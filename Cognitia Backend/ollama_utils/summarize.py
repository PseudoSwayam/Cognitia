# ollama_utils/summarize.py

import subprocess
import re

# This file is well-structured for backend use and remains unchanged.
# Its functions are stateless and focused on a single task.

MODEL = "mistral"

def _summarize_chunk(text: str) -> str:
    """(Internal Helper) Uses Ollama to summarize a single chunk of text."""
    prompt = f"""
    Concisely summarize the key points from the following academic text excerpt.
    Focus on the main argument, evidence, or finding.

    Excerpt:
    {text.strip()[:4000]}
    """
    try:
        result = subprocess.run(
            ["ollama", "run", MODEL],
            input=prompt.encode('utf-8'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        return result.stdout.decode('utf-8').strip()
    except subprocess.CalledProcessError as e:
        return f"Error summarizing chunk: {e.stderr.decode('utf-8')}"
    except Exception as e:
        return f"Error during chunk summarization: {str(e)}"


def summarize_sources(sources: list[str]) -> str:
    """
    Summarizes a list of source text chunks using a Map-Reduce strategy.
    """
    if not sources:
        return "No sources found to summarize."

    individual_summaries = [_summarize_chunk(chunk) for chunk in sources]

    if len(individual_summaries) == 1:
        return individual_summaries[0]

    combined_summaries_text = "\n\n---\n\n".join(individual_summaries)

    synthesis_prompt = f"""
    You are a research assistant. You have been provided with several summaries from different academic sources.
    Your task is to synthesize these summaries into a single, cohesive, and well-structured answer.
    Do not just list the summaries. Integrate their points into a comprehensive explanation.

    Here are the summaries:
    {combined_summaries_text}

    Synthesized Answer:
    """

    try:
        result = subprocess.run(
            ["ollama", "run", MODEL],
            input=synthesis_prompt.encode('utf-8'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        return result.stdout.decode('utf-8').strip()
    except subprocess.CalledProcessError as e:
        return f"❌ Error in final synthesis: {e.stderr.decode('utf-8')}"
    except Exception as e:
        return f"❌ Error during synthesis: {str(e)}"