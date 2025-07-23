# fetchers/arxiv_fetcher.py

import os
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

SAVE_DIR = "data/raw_papers"
MAX_RESULTS = 5  # Number of papers per topic

def _clean_old_papers():
    if os.path.exists(SAVE_DIR):
        for filename in os.listdir(SAVE_DIR):
            if filename.endswith(".pdf"):
                os.remove(os.path.join(SAVE_DIR, filename))
        print("🧹 Cleared previous arXiv PDFs.")

def fetch_arxiv_papers_by_topic(topic, max_results=MAX_RESULTS):
    os.makedirs(SAVE_DIR, exist_ok=True)
    _clean_old_papers()

    print(f"\n🔍 Searching arXiv for: {topic} (Top {max_results} results)")

    base_url = "http://export.arxiv.org/api/query?"
    query = f"search_query=all:{urllib.parse.quote(topic)}&start=0&max_results={max_results}&sortBy=relevance&sortOrder=descending"

    response = urllib.request.urlopen(base_url + query)
    raw_xml = response.read()
    root = ET.fromstring(raw_xml)

    count = 0
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text
        id_url = entry.find("{http://www.w3.org/2005/Atom}id").text
        pdf_url = id_url.replace("abs", "pdf") + ".pdf"

        safe_title = title.strip().replace(" ", "_").replace("/", "_")
        filename = os.path.join(SAVE_DIR, f"{safe_title[:80]}.pdf")

        if os.path.exists(filename):
            continue

        try:
            print(f"⬇️ Downloading: {title}")
            urllib.request.urlretrieve(pdf_url, filename)
            count += 1
            time.sleep(2)  # Avoid rate limiting
        except Exception as e:
            print(f"❌ Failed to download {title}: {e}")

    print(f"✅ Fetched {count} papers on '{topic}' → {SAVE_DIR} ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")


if __name__ == "__main__":
    print("📚 arXiv Paper Fetcher with Topic Search")
    user_topic = input("🧠 Enter a research topic (e.g., 'graph neural networks', 'LLM alignment'): ")
    fetch_arxiv_papers_by_topic(user_topic)