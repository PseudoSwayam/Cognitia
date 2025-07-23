# 🧠 Cognitia – Agentic AI Research Mentor with Debate Reasoning

> Your personal AI-powered academic research companion — built to simulate expert mentorship via semantic understanding, debate reasoning, and adaptive conversation.

---

## 📚 Overview

**Cognitia** is a full-stack, AI-driven research assistant designed to **semantically fetch** and **debate academic content** from sources like **ArXiv papers** and **YouTube lectures**. It enables researchers and students to gain **expert-level insights** through an agentic, reasoning-based interaction layer.

> Powered by [FastAPI](https://fastapi.tiangolo.com/), [React + TypeScript](https://react.dev/), [LangChain](https://www.langchain.com/), and [Mistral via Ollama](https://ollama.com/).

---

## 🧠 Features

- 📖 **Academic Content Fetching** from ArXiv & YouTube
- 🗣️ **Debate Simulation** for deeper understanding
- 🧩 **Semantic Indexing & Reasoning** using vector databases
- 🧵 **Tone-Adaptive Conversations** using LLMs (Mistral)
- 📦 **Offline-Ready Chat** with persistent memory
- ⚙️ **Modular FastAPI Backend** + Clean React Frontend

---

## 🛠️ Tech Stack

### 🔹 Backend
- `FastAPI`, `LangChain`, `Ollama (Mistral)`
- `ChromaDB`, `SQLite`
- `Python`, `ArXiv API`, `YouTube API`

### 🔹 Frontend
- `React`, `TypeScript`, `TailwindCSS`
- `Vite`, `Component-Based UI`

---

## 📁 Project Structure

```
Cognitia/
│
├── Cognitia Backend/
│   ├── data/                  # Raw, processed, vector DBs
│   ├── debate/                # Debate engine (LLM-based)
│   ├── fetchers/              # Arxiv and YouTube content fetchers
│   ├── memory/                # Local memory handling
│   ├── ollama_utils/          # Ollama + Mistral helpers
│   ├── semantic_engine/       # Vector DB + similarity engine
│   ├── utils/                 # Parsing utilities
│   ├── app.py                 # FastAPI app entrypoint
│   └── main.py                # Debug or launch script
│
├── Cognitia FrontEnd/
│   ├── src/components/        # Modular UI: Chat, Sidebar, etc.
│   ├── services/              # API calling layer
│   ├── types/                 # TypeScript interfaces
│   ├── App.tsx / main.tsx     # Frontend root
│   └── index.html / Tailwind / Vite config
│
├── LICENSE
└── .gitignore
```
---

## ⚡ Getting Started

🔧 Backend (Python + FastAPI)
```bash
cd 'Cognitia Backend'
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

💻 Frontend (React + Vite)

```bash
cd 'Cognitia FrontEnd'
npm install
npm run dev
```

⸻

🧪 Demo Use Cases
	•	Ask: “Summarize and debate the claims of this ArXiv paper”
	•	Ask: “What are the counterarguments in this YouTube lecture?”
	•	Ask: “Give a mentor’s response vs a critic’s view”

⸻

📌 Roadmap
	•	Add local PDF upload + analysis
	•	Export debate logs as reports
	•	Improve real-time LLM streaming
	•	Integrate citation-aware memory

⸻

🪪 License

This project is licensed under the MIT License

⸻

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

⸻

📬 Contact

Built with ❤️ by Swayam Sahoo
For collaboration, reach out via LinkedIn or GitHub.

---

## ✅ What You Should Do Next

1. Create a file:
```bash
touch README.md

	2.	Paste the entire markdown above.
	3.	Commit and push:

git add README.md
git commit -m "Added professional README for Cognitia"
git push
```

⸻
