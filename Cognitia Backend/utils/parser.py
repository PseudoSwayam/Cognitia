# utils/parser.py

import os
import fitz  # PyMuPDF
import webvtt
import re
from datetime import datetime

RAW_PDF_DIR = "data/raw_papers"
RAW_YT_DIR = "data/youtube_transcripts"
OUT_DIR = "data/processed"

os.makedirs(OUT_DIR, exist_ok=True)

def _clean_processed_folder():
    """Clear all previously processed text files."""
    for file in os.listdir(OUT_DIR):
        if file.endswith(".txt"):
            os.remove(os.path.join(OUT_DIR, file))
    print("🧹 Cleared previously processed documents.")

def clean_text(text):
    """Remove extra spaces, newlines, and garbage tokens."""
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\x00-\x7F]+", "", text)  # remove non-ASCII
    return text.strip()

def process_pdf(file_path):
    """Extract plain text from a PDF using PyMuPDF."""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return clean_text(text)
    except Exception as e:
        print(f"❌ PDF parse failed: {file_path} | Error: {e}")
        return ""

def process_vtt(file_path):
    """Convert .vtt subtitle file to plain transcript text."""
    try:
        captions = webvtt.read(file_path)
        text = " ".join([caption.text for caption in captions])
        return clean_text(text)
    except Exception as e:
        print(f"❌ VTT parse failed: {file_path} | Error: {e}")
        return ""

def save_clean_text(text, original_file, source_type):
    """Saves cleaned text with metadata."""
    basename = os.path.basename(original_file)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    out_name = f"{source_type}_{basename[:60]}_{timestamp}.txt"
    out_path = os.path.join(OUT_DIR, out_name)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"[SOURCE]: {original_file}\n")
        f.write(f"[TYPE]: {source_type}\n")
        f.write(f"[DATE]: {timestamp}\n\n")
        f.write(text)

    print(f"✅ Saved cleaned {source_type}: {out_path}")

def run_parser():
    print("\n🧠 Sentient Scholar | Document Processor Started")
    _clean_processed_folder()

    # Process PDFs
    for file in os.listdir(RAW_PDF_DIR):
        if file.endswith(".pdf"):
            path = os.path.join(RAW_PDF_DIR, file)
            text = process_pdf(path)
            if text:
                save_clean_text(text, path, "pdf")

    # Process YouTube captions
    for file in os.listdir(RAW_YT_DIR):
        if file.endswith(".vtt") or file.endswith(".webvtt"):
            path = os.path.join(RAW_YT_DIR, file)
            text = process_vtt(path)
            if text:
                save_clean_text(text, path, "youtube")

    print("\n🎉 All documents processed successfully!")

if __name__ == "__main__":
    run_parser()