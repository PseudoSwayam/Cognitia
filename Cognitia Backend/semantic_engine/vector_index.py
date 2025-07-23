# semantic_engine/vector_index.py

import os
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

DATA_DIR = "data/processed"
DB_DIR = "data/vector_db"
COLLECTION_NAME = "research_knowledge"

client = chromadb.Client(Settings(
    persist_directory=DB_DIR,
    anonymized_telemetry=False
))
collection = client.get_or_create_collection(name=COLLECTION_NAME)

# Lightweight CPU model
model = SentenceTransformer("all-MiniLM-L6-v2")

def build_vector_index():
    print("📚 Building vector index...")
    doc_id = 0

    for filename in os.listdir(DATA_DIR):
        if not filename.endswith(".txt"):
            continue

        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        collection.add(
            documents=[content],
            metadatas=[{"source": filename}],
            ids=[f"doc_{doc_id}"]
        )
        doc_id += 1
        print(f"✅ Indexed: {filename}")

    print("✅ Vector DB ready.")

def semantic_search(query, top_k=3):
    query_embedding = model.encode(query).tolist()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results