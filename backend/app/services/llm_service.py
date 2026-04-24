# FILE: backend/app/services/llm_service.py
import os
import json
import google.generativeai as genai

# Setup Gemini using environment variable set in Render
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def clean_output(text: str):
    """
    Cleans LLM output to ensure it is valid JSON or plain text.
    """
    if not text:
        return ""
    return text.replace("```json", "").replace("```", "").replace("markdown", "").strip()

def call_llm(prompt: str, temperature=0.2):
    """
    Calls the Gemini API instead of the local Ollama service.
    """
    try:
        # Gemini uses 'generation_config' for temperature settings
        generation_config = genai.types.GenerationConfig(temperature=temperature)
        response = model.generate_content(prompt, generation_config=generation_config)
        return clean_output(response.text)
    except Exception as e:
        return f"ERROR: {str(e)}"

def analyze_clause(clause: str, doc_summary: str = "Unknown context"):
    prompt = f"""
You are a top-tier legal risk analysis engine evaluating a specific clause within a broader document.

DOCUMENT SUMMARY (Context):
{doc_summary}

CLAUSE TO ANALYZE:
\"\"\"{clause}\"\"\"

INSTRUCTIONS:
1. Briefly analyze how this specific clause interacts with the overall document context.
2. Identify if it presents a financial risk, restriction, or unfair term to the user.
3. Output your final assessment in STRICT valid JSON format.
4. No markdown, no conversational text outside the JSON.

RISK TYPES: financial, restriction, unfair, none
SEVERITY: low, medium, high

OUTPUT FORMAT:
{{
  "internal_reasoning": "Step-by-step thought process regarding the context (max 2 sentences)",
  "risk_type": "",
  "severity": "",
  "confidence": 0.0,
  "explanation": "Clear, practical explanation of the risk.",
  "recommendation": "Actionable next step."
}}
"""
    response_text = call_llm(prompt, temperature=0.2)
    
    if response_text.startswith("ERROR:"):
        return {"internal_reasoning": "Failed to reach Gemini API.", "risk_type": "unknown", "severity": "medium", "confidence": 0.0, "explanation": "Cloud LLM service unavailable", "recommendation": "Retry."}

    try:
        parsed = json.loads(response_text)
        return {
            "internal_reasoning": str(parsed.get("internal_reasoning", "No internal reasoning provided.")).strip(),
            "risk_type": str(parsed.get("risk_type", "unknown")).lower(),
            "severity": str(parsed.get("severity", "unknown")).lower(),
            "confidence": float(parsed.get("confidence", 0.5)),
            "explanation": str(parsed.get("explanation", "No explanation provided.")).strip(),
            "recommendation": str(parsed.get("recommendation", "No recommendation provided.")).strip()
        }
    except Exception:
        return {"internal_reasoning": "JSON Parsing Failed.", "risk_type": "unknown", "severity": "low", "confidence": 0.0, "explanation": "Could not parse analysis.", "recommendation": "Retry."}

def summarize_document(text: str):
    prompt = (
        "You are a legal document summarization engine. Return ONLY valid JSON with this exact structure:\n"
        "{\n  \"short_summary\": \"\",\n  \"important_points\": [\"\", \"\"],\n  \"possible_risks\": [\n    {\"risk_type\": \"financial\", \"description\": \"\"}\n  ]\n}\n\n"
        "Rules:\n- Do NOT output markdown.\n- Use plain text in strings.\n- Keep fields concise.\n\n"
        f"Document:\n{text[:5000]}"
    )
    result = call_llm(prompt, temperature=0.3)
    try:
        parsed = json.loads(result)
        return {
            "short_summary": parsed.get("short_summary", "").strip(),
            "important_points": parsed.get("important_points", []) if isinstance(parsed.get("important_points"), list) else [],
            "possible_risks": parsed.get("possible_risks", [])
        }
    except Exception:
        return {"short_summary": "Unable to generate summary at this time.", "important_points": [], "possible_risks": []}

def detect_document_type(text: str):
    prompt = f"You are a document classification engine.\nChoose ONLY one: rental agreement, legal notice, employment contract, loan agreement, service agreement, other\nRULES: Output only label. No explanation.\nDOCUMENT:\n\"\"\"{text[:2000]}\"\"\""
    result = call_llm(prompt, temperature=0)
    return result.strip().lower() if result and not result.startswith("ERROR:") else "unknown"

def chat_with_document(question: str, document_context: str):
    prompt = f"""
You are an expert legal assistant helping a user understand their document.
Answer the user's question based STRICTLY on the provided document context.

RULES:
1. Do not hallucinate external laws or facts not present in the text.
2. Be concise, direct, and practical.
3. If the answer cannot be found in the context, reply exactly with: "I cannot find this information in the document."

DOCUMENT CONTEXT:
{document_context[:8000]}

USER QUESTION:
"{question}"

ANSWER:
"""
    response = call_llm(prompt, temperature=0.3)
    return response if not response.startswith("ERROR:") else "I am currently unable to process your question."