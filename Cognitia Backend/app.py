# app.py

import streamlit as st
import os

# Your existing imports are correct
from ollama_utils.summarize import summarize_sources
from debate.debate_agent import generate_debate
# --- MoodTracker import has been removed ---
from fetchers.youtube_fetcher import download_subtitles_for_topic
from fetchers.arxiv_fetcher import fetch_arxiv_papers_by_topic
from utils.parser import run_parser
from semantic_engine.vector_index import build_vector_index, semantic_search

# ========== Streamlit Setup ==========
st.set_page_config(page_title="Cognitia", layout="wide")
st.title("💻 Welcome to Cognitia - Research and Debate Engine")

# --- MoodTracker instantiation has been removed ---

# --- Sidebar: Topic Fetch (No changes here) ---
st.sidebar.header("📚 Topic Selector")
user_topic = st.sidebar.text_input("Enter a topic (e.g., LLMs, Quantum Computing)", "")

if st.sidebar.button("🔎 Fetch Knowledge"):
    if user_topic:
        st.session_state["topic"] = user_topic
        # Clear previous results when fetching new data
        if 'current_answer' in st.session_state:
            del st.session_state.current_answer
        if 'debate_result' in st.session_state:
            del st.session_state.debate_result

        with st.spinner("Fetching and processing knowledge... This may take a moment."):
            fetch_arxiv_papers_by_topic(user_topic)
            download_subtitles_for_topic(user_topic)
            run_parser()
            build_vector_index()
        st.success("✅ Fetched, processed, and indexed content for topic.")
    else:
        st.warning("⚠️ Please enter a topic before fetching.")

# --- Main Interaction Area ---
st.markdown("## 💬 Ask a Research Question")

query = st.text_input("Ask me anything about your topic...", key="user_input")

if st.button("Get Answer"):
    if query:
        # --- All mood-related logic has been removed from this block ---

        with st.spinner("Searching for relevant knowledge..."):
            search_results = semantic_search(query)
        
        docs = search_results.get('documents', [])
        if docs and docs[0]:
            source_chunks = docs[0]
            with st.spinner("Synthesizing information from multiple sources..."):
                answer = summarize_sources(source_chunks)

            # Store the generated answer in the session state to use it later.
            st.session_state.current_answer = answer
            # Reset any previous debate result.
            if 'debate_result' in st.session_state:
                del st.session_state.debate_result
        else:
            st.error("❌ No relevant knowledge found for your query. Try fetching data first.")
            if 'current_answer' in st.session_state:
                del st.session_state.current_answer

# --- On-Demand Debate Generation (No changes here) ---
# This logic remains perfectly intact.
if 'current_answer' in st.session_state:
    st.markdown("### 🧠 Answer")
    st.markdown(st.session_state.current_answer)

    # Add the button to generate the debate only after an answer is shown
    if st.button("🤖 Generate Debate"):
        with st.spinner("Generating debate..."):
            # Use the stored answer from the session state to generate the debate
            debate = generate_debate(st.session_state.current_answer)
            # Store the debate result in the session state
            st.session_state.debate_result = debate

    # If the debate has been generated and stored, display it
    if 'debate_result' in st.session_state:
        st.markdown("### 🤖 Debate Mode")
        debate = st.session_state.debate_result
        
        reflection_text = debate.get('reflection', '')
        if reflection_text.strip().startswith("❌"):
            st.error(reflection_text)
        else:
            st.markdown(f"**🔵 Support:**\n\n{debate.get('support', 'N/A')}")
            st.markdown(f"**🔴 Counterpoint:**\n\n{debate.get('counter', 'N/A')}")
            st.markdown(f"**🧘 Reflection:**\n\n{debate.get('reflection', 'N/A')}")