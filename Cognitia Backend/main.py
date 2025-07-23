# main.py

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import subprocess

# Your core logic modules
from debate.debate_agent import debate_agent
from semantic_engine.vector_index import build_vector_index, semantic_search
from fetchers.arxiv_fetcher import fetch_arxiv_papers_by_topic
from fetchers.youtube_fetcher import download_subtitles_for_topic
from utils.parser import run_parser

# --- Chat History Management (No Changes) ---
history: List[Dict[str, str]] = []

def add_to_history(role: str, content: str):
    history.append({"role": role, "content": content})

def get_history() -> List[Dict[str, str]]:
    return history

def clear_history():
    history.clear()

# --- Core Application Logic ---
def prepare_knowledge_base(topic: str) -> Dict[str, str]:
    try:
        print(f"--- Preparing knowledge base for topic: '{topic}' ---")
        fetch_arxiv_papers_by_topic(topic)
        download_subtitles_for_topic(topic)
        run_parser()
        build_vector_index()
        return {"status": "success", "message": f"Knowledge base for '{topic}' is ready."}
    except Exception as e:
        print(f"ERROR: Failed to prepare knowledge base. {e}")
        raise HTTPException(status_code=500, detail=f"Failed to prepare knowledge base: {str(e)}")

def answer_question(query: str) -> str:
    print(f"\n--- Answering question: '{query}' with Single-Call RAG ---")
    print("1. Performing semantic search...")
    search_results = semantic_search(query)
    docs = search_results.get('documents', [])
    if not (docs and docs[0]):
        return "No relevant knowledge was found for your query. Try a different topic or question."
    source_chunks = docs[0]
    context_text = "\n\n---\n\n".join(source_chunks)
    print(f"2. Using {len(source_chunks)} chunks for context...")
    prompt = f"""
You are a helpful AI research assistant. Your task is to provide a comprehensive answer to the user's question based *only* on the following context.
Synthesize the information from all parts of the context to form a complete response.

### CONTEXT ###
{context_text[:8000]} 

### QUESTION ###
{query}

### ANSWER ###
"""
    print("3. Generating final answer in one call...")
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt.encode('utf-8'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        answer = result.stdout.decode('utf-8').strip()
        print("4. Answer generated successfully.")
        return answer
    except Exception as e:
        print(f"ERROR: Failed to get answer from Ollama. {e}")
        return "An error occurred while generating the answer."

# --- Pydantic Models ---
class PrepareRequest(BaseModel):
    topic: str

class QueryRequest(BaseModel):
    question: str
    debate: bool = False

# --- FastAPI App Setup ---
app = FastAPI(
    title="Cognitia Backend API",
    description="API for the Cognitia Research and Debate Engine",
    version="FINAL"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.post("/prepare", summary="Prepare Knowledge Base")
def api_prepare_knowledge_base(request: PrepareRequest):
    return prepare_knowledge_base(topic=request.topic)

@app.post("/query", summary="Process User Input (Query or Debate)")
def api_process_query(request: QueryRequest):
    if request.debate:
        print("\n--- DEBATE request received ---")
        if not history or history[-1]['role'] != 'assistant':
            raise HTTPException(status_code=400, detail="Cannot generate debate without a previous answer.")
        context_for_debate = history[-1]['content']
        original_question = next((msg['content'] for msg in reversed(history) if msg['role'] == 'user'), "related context")
        print(f"1. Debating context from question: '{original_question}'")
        debate_response = debate_agent(question=original_question, context=context_for_debate)
        full_debate_message = f"**Debate Response:**\n\n{debate_response}"
        add_to_history("assistant", full_debate_message)
        print("2. Debate generated successfully.")
        return {"response": full_debate_message}
    else:
        add_to_history("user", request.question)
        answer = answer_question(query=request.question)
        add_to_history("assistant", answer)
        return {"response": answer}

@app.post("/debate", summary="Dedicated Debate Endpoint")
def api_generate_debate(request: QueryRequest):
    print("\n--- [DEBATE] POST /debate ---")
    if not history or history[-1]['role'] != 'assistant':
        raise HTTPException(status_code=400, detail="Cannot generate debate without a previous assistant message.")
    context_for_debate = history[-1]['content']
    original_question = next((msg['content'] for msg in reversed(history) if msg['role'] == 'user'), "related context")
    print(f"Generating debate for question: '{original_question}'")
    try:
        debate_response = debate_agent(question=original_question, context=context_for_debate)
        debate_message = f"**Debate Response:**\n\n{debate_response}"
        add_to_history("assistant", debate_message)
        print("Debate generated successfully.")
        return {"response": debate_message}
    except Exception as e:
        print(f"Error generating debate: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate debate.")

@app.post("/reset", summary="Reset Chat History")
def api_reset_history():
    clear_history()
    return {"status": "success", "message": "Chat history has been cleared."}

@app.get("/history", summary="Get Chat History")
def api_get_history() -> List[Dict[str, str]]:
    return get_history()

# --- Uvicorn Runner ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)