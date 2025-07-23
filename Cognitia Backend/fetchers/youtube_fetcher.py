# fetchers/youtube_fetcher.py

import os
import subprocess
from datetime import datetime

SAVE_DIR = "data/youtube_transcripts"
MAX_RESULTS = 5  # Number of YouTube videos to fetch per topic

def _clean_old_transcripts():
    if os.path.exists(SAVE_DIR):
        for filename in os.listdir(SAVE_DIR):
            if filename.endswith((".vtt", ".json", ".txt")):
                os.remove(os.path.join(SAVE_DIR, filename))
        print("🧹 Cleared previous YouTube transcripts.")

def download_subtitles_for_topic(topic, max_results=MAX_RESULTS):
    os.makedirs(SAVE_DIR, exist_ok=True)
    _clean_old_transcripts()

    print(f"\n🔍 Searching YouTube for: {topic} (Top {max_results} videos)")

    try:
        search_query = f"ytsearch{max_results}:{topic}"
        command = [
            "yt-dlp",
            "--skip-download",
            "--write-auto-sub",
            "--sub-lang", "en",
            "--output", f"{SAVE_DIR}/%(title).100s.%(id)s.%(ext)s",
            search_query
        ]
        subprocess.run(command, check=True)
        print(f"✅ Subtitles downloaded for: {topic}")

    except subprocess.CalledProcessError as e:
        print(f"❌ yt-dlp failed: {e}")
    except Exception as ex:
        print(f"⚠️ Unexpected error: {ex}")

    print(f"📁 Subtitles saved to: {SAVE_DIR} ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")


if __name__ == "__main__":
    print("🎯 YouTube Subtitle Fetcher with Topic Search")
    user_topic = input("🧠 Enter a topic you're interested in (e.g., 'generative art', 'quantum computing'): ")
    download_subtitles_for_topic(user_topic)