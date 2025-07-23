# debate/debate_agent.py

import subprocess
import re

MODEL = "mistral"

def _generate_debate_parts(text: str) -> dict:
    """
    Internal helper that runs the debate logic and returns a structured dict.
    This preserves the original robust parsing logic.
    """
    prompt = f"""
You are a debate-style reasoning assistant who helps deepen understanding of academic material.

Here is a claim or excerpt from a research paper:
{text[:3500]}

Debate this claim using the following structure:
1. Support the claim with evidence or logic.
2. Challenge the claim with a counterpoint.
3. Reflect on both sides and conclude which is stronger, or propose a synthesis.

Be concise, insightful, and neutral. Use plain academic English.
Respond using clear section headings like:

Support:
...
Counterpoint:
...
Reflection:
...
"""
    try:
        result = subprocess.run(
            ["ollama", "run", MODEL],
            input=prompt.encode('utf-8'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        output = result.stdout.decode('utf-8').strip()
        pattern = r"((?i)\n*(?:Support|Counterpoint|Challenge|Reflection|Synthesis):\s*)"
        parts = re.split(pattern, output)
        
        sections = {}
        for i in range(1, len(parts), 2):
            header = parts[i].strip().lower().replace(":", "")
            content = parts[i+1].strip()
            sections[header] = content
            
        support_text = sections.get('support', '❓ Not found')
        counter_text = sections.get('counterpoint') or sections.get('challenge', '❓ Not found')
        reflection_text = sections.get('reflection') or sections.get('synthesis', '❓ Not found')

        if support_text == '❓ Not found' or counter_text == '❓ Not found':
             error_details = f"Could not parse required sections from LLM output.\n\nRaw Output:\n{output}"
             return {"support": support_text, "counter": counter_text, "reflection": f"❌ {error_details}"}

        return {"support": support_text, "counter": counter_text, "reflection": reflection_text}
        
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.decode('utf-8')
        return {"support": "", "counter": "", "reflection": f"❌ Ollama Error: {error_msg}"}
    except Exception as e:
        return {"support": "", "counter": "", "reflection": f"❌ Error generating debate: {str(e)}"}


def debate_agent(question: str, context: str) -> str:
    """
    Public function to generate a debate on a given context.
    Returns a single, formatted markdown string.
    """
    debate_parts = _generate_debate_parts(context)
    
    support = debate_parts.get("support", "N/A")
    counter = debate_parts.get("counter", "N/A")
    reflection = debate_parts.get("reflection", "N/A")

    if reflection.strip().startswith("❌"):
        return f"Error during debate generation: {reflection}"

    formatted_response = f"""### 🤖 Debate Mode

**🔵 Support:**
{support}

**🔴 Counterpoint:**
{counter}

**🧘 Reflection:**
{reflection}
"""
    return formatted_response.strip()