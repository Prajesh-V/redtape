# FILE: backend/app/services/llm_service.py
import json
import os
import time
import threading
from openai import OpenAI

# ---------------------------------------------------------------------------
# NVIDIA NIM Configuration
# Uses the OpenAI-compatible endpoint — model: mistralai/mistral-medium-3.5-128b
# Rate limit: 40 requests/minute → min 1.5s between calls
# ---------------------------------------------------------------------------

NVIDIA_API_KEY  = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
MODEL_NAME      = "mistralai/mistral-medium-3.5-128b"

_client = OpenAI(
    api_key=NVIDIA_API_KEY or "dummy",  # OpenAI client requires non-empty key
    base_url=NVIDIA_BASE_URL,
)

# ---------------------------------------------------------------------------
# Thread-safe rate limiter (40 req/min → 1 call per 1.5 s)
# ---------------------------------------------------------------------------

_rate_lock       = threading.Lock()
_last_call_time  = 0.0
_MIN_INTERVAL    = 1.6  # seconds between calls (slightly above 60/40 = 1.5)

def _rate_limited_wait():
    """Block until we are safe to make another API call."""
    global _last_call_time
    with _rate_lock:
        now  = time.monotonic()
        wait = _MIN_INTERVAL - (now - _last_call_time)
        if wait > 0:
            time.sleep(wait)
        _last_call_time = time.monotonic()


# ---------------------------------------------------------------------------
# Core helpers
# ---------------------------------------------------------------------------

def clean_output(text: str) -> str:
    if not text:
        return ""
    return text.replace("```json", "").replace("```", "").replace("markdown", "").strip()


def call_llm(prompt: str, temperature: float = 0.2) -> str:
    """
    Call NVIDIA NIM (Mistral Medium 3.5) and return the cleaned text response.
    Automatically respects the 40 req/min rate limit.
    """
    _rate_limited_wait()
    try:
        completion = _client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=4096,
            stream=False,
        )
        raw = completion.choices[0].message.content or ""
        return clean_output(raw)
    except Exception as e:
        return f"ERROR: {str(e)}"


# ---------------------------------------------------------------------------
# Domain functions — signatures unchanged, all callers work as before
# ---------------------------------------------------------------------------

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
        return {
            "internal_reasoning": "Failed to reach LLM.",
            "risk_type": "unknown", "severity": "medium",
            "confidence": 0.0,
            "explanation": "LLM service unavailable.",
            "recommendation": "Retry later.",
        }

    try:
        parsed = json.loads(response_text)
        return {
            "internal_reasoning": str(parsed.get("internal_reasoning", "No reasoning provided.")).strip(),
            "risk_type":          str(parsed.get("risk_type", "unknown")).lower(),
            "severity":           str(parsed.get("severity", "unknown")).lower(),
            "confidence":         float(parsed.get("confidence", 0.5)),
            "explanation":        str(parsed.get("explanation", "No explanation provided.")).strip(),
            "recommendation":     str(parsed.get("recommendation", "No recommendation provided.")).strip(),
        }
    except Exception:
        return {
            "internal_reasoning": "JSON parsing failed.",
            "risk_type": "unknown", "severity": "low",
            "confidence": 0.0,
            "explanation": "Could not parse analysis.",
            "recommendation": "Retry.",
        }


def summarize_document(text: str):
    prompt = (
        "You are a legal document summarization engine. Return ONLY valid JSON with this exact structure:\n"
        "{\n  \"short_summary\": \"\",\n  \"important_points\": [\"\", \"\"],\n"
        "  \"possible_risks\": [\n    {\"risk_type\": \"financial\", \"description\": \"\"}\n  ]\n}\n\n"
        "Rules:\n- Do NOT output markdown.\n- Use plain text in strings.\n- Keep fields concise.\n\n"
        f"Document:\n{text[:3000]}"
    )
    result = call_llm(prompt, temperature=0.3)
    try:
        parsed = json.loads(result)
        return {
            "short_summary":   parsed.get("short_summary", "").strip(),
            "important_points": parsed.get("important_points", []) if isinstance(parsed.get("important_points"), list) else [],
            "possible_risks":  [
                {"risk_type": str(r.get("risk_type", "other")).lower(), "description": str(r.get("description", "")).strip()}
                for r in parsed.get("possible_risks", []) if isinstance(r, dict)
            ],
        }
    except Exception:
        return {"short_summary": "Unable to generate summary at this time.", "important_points": [], "possible_risks": []}


def detect_document_type(text: str):
    prompt = (
        "You are a document classification engine.\n"
        "Choose ONLY one: rental agreement, legal notice, employment contract, loan agreement, service agreement, other\n"
        "RULES: Output only the label. No explanation.\n"
        f"DOCUMENT:\n\"\"\"{text[:2000]}\"\"\""
    )
    result = call_llm(prompt, temperature=0.0)
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
{document_context[:4000]}

USER QUESTION:
"{question}"

ANSWER:
"""
    response = call_llm(prompt, temperature=0.3)
    return response if not response.startswith("ERROR:") else "I am currently unable to process your question."