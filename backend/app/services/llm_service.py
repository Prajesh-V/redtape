# FILE: backend/app/services/llm_service.py
import json
import os
import time
import threading
from openai import OpenAI
from contextlib import contextmanager

# Load .env so API keys are available when running locally via `python run.py`
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed — env vars must be set externally (e.g. Render)

# ---------------------------------------------------------------------------
# Optional MLflow — never blocks execution
# ---------------------------------------------------------------------------
try:
    import mlflow
    # mlflow.set_experiment("RedTape-Legal-AI")
    # _mlflow_available = True
    # print("[MLflow] Initialized successfully")
    _mlflow_available = False
except Exception as e:
    _mlflow_available = False
    print(f"[MLflow] Disabled: {e}")

@contextmanager
def _safe_mlflow_run(run_name="LLM_Call", nested=False):
    """MLflow context that silently no-ops if MLflow is unavailable."""
    if _mlflow_available:
        try:
            with mlflow.start_run(run_name=run_name, nested=nested):
                yield
        except Exception:
            yield
    else:
        yield

def _mlflow_log(fn_name, *args, **kwargs):
    """Safely call an mlflow logging function, never raising."""
    if not _mlflow_available:
        return
    try:
        getattr(mlflow, fn_name)(*args, **kwargs)
    except Exception:
        pass

# ---------------------------------------------------------------------------
# LLM Configuration
# Supports DeepSeek V4 Pro via NVIDIA NIM (Remote) or Ollama (Local)
# ---------------------------------------------------------------------------

NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"

# Provider selection: "nvidia" (default), "deepseek", or "ollama"
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "nvidia").lower()

if LLM_PROVIDER == "ollama":
    MODEL_NAME = os.getenv("OLLAMA_MODEL", "mistral")
elif LLM_PROVIDER == "deepseek":
    MODEL_NAME = os.getenv("LLM_MODEL", "deepseek-v4-pro")
elif LLM_PROVIDER == "gemini":
    MODEL_NAME = os.getenv("LLM_MODEL", "gemini-2.5-flash")
else:  # nvidia (default)
    MODEL_NAME = os.getenv("LLM_MODEL", "meta/llama-3.1-70b-instruct")

print(f"[LLM] Provider={LLM_PROVIDER} | Model={MODEL_NAME}")

# Lazy client — created on first use so it always reads the env var correctly
_client: OpenAI | None = None
_client_lock = threading.Lock()

def _get_client() -> OpenAI:
    """Return the shared OpenAI client, creating it on first call."""
    global _client
    if _client is None:
        with _client_lock:
            if _client is None:  # double-checked locking
                if LLM_PROVIDER == "ollama":
                    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
                    api_key = "ollama"  # dummy key for local
                elif LLM_PROVIDER == "deepseek":
                    base_url = DEEPSEEK_BASE_URL
                    api_key = os.getenv("DEEPSEEK_API_KEY", "")
                    if not api_key:
                        raise RuntimeError(
                            "DEEPSEEK_API_KEY is not set. "
                            "Add it to backend/.env or set it as an environment variable."
                        )
                elif LLM_PROVIDER == "gemini":
                    base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
                    api_key = os.getenv("GEMINI_API_KEY", "")
                    if not api_key:
                        raise RuntimeError(
                            "GEMINI_API_KEY is not set. "
                            "Add it to backend/.env or set it as an environment variable."
                        )
                else:  # nvidia (default)
                    base_url = NVIDIA_BASE_URL
                    api_key = os.getenv("NVIDIA_API_KEY", "")
                    if not api_key:
                        raise RuntimeError(
                            "NVIDIA_API_KEY is not set. "
                            "Add it to backend/.env or set it as an environment variable."
                        )
                
                _client = OpenAI(api_key=api_key, base_url=base_url, timeout=30.0)
    return _client

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
    Call the configured LLM provider and return the cleaned text response.
    Automatically respects the 40 req/min rate limit.
    """
    _rate_limited_wait()
    
    start_time = time.time()
    try:
        client = _get_client()
        print(f"[LLM] Sending request to {MODEL_NAME}...")
        
        kwargs = {
            "model": MODEL_NAME,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": 8192,
            "stream": False,
        }
        
        if "deepseek" in MODEL_NAME.lower():
            kwargs["top_p"] = 0.95
            kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": False}}

        completion = client.chat.completions.create(**kwargs)
        raw = completion.choices[0].message.content or ""
        latency = time.time() - start_time
        print(f"[LLM] Response received in {latency:.1f}s")
        
        _mlflow_log("log_metric", "latency", latency)
        
        cleaned = clean_output(raw)
        return cleaned
    except RuntimeError as e:
        print(f"[LLM] RuntimeError: {e}")
        return f"ERROR: {str(e)}"
    except Exception as e:
        print(f"[LLM] Exception: {e}")
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


def analyze_clauses_batch(clauses: list[str], doc_summary: str = "Unknown context"):
    """
    Analyzes multiple clauses in a single LLM call to save time and stay within timeouts.
    """
    if not clauses:
        return []

    clauses_text = "\n".join([f"{i+1}. {c}" for i, c in enumerate(clauses)])
    
    prompt = f"""
You are a legal risk analysis engine. Analyze the following clauses from a document summarized as: {doc_summary}

CLAUSES:
{clauses_text}

INSTRUCTIONS:
1. For each clause, identify if it presents a financial risk, restriction, or unfair term.
2. Return a JSON object containing a list called "results".
3. Each object in "results" must have: "risk_type", "severity", "explanation", "recommendation".
4. Output ONLY valid JSON.

RISK TYPES: financial, restriction, unfair, none
SEVERITY: low, medium, high

OUTPUT FORMAT:
{{
  "results": [
    {{
      "risk_type": "",
      "severity": "",
      "explanation": "Brief explanation",
      "recommendation": "Actionable step"
    }},
    ...
  ]
}}
"""
    response_text = call_llm(prompt, temperature=0.1)

    try:
        parsed = json.loads(response_text)
        results = parsed.get("results", [])
        
        # Pad or truncate to match input size if LLM misbehaves
        if len(results) < len(clauses):
            for _ in range(len(clauses) - len(results)):
                results.append({"risk_type": "unknown", "severity": "low", "explanation": "Batch parsing error", "recommendation": "None"})
        
        return results[:len(clauses)]
    except Exception:
        return [{"risk_type": "unknown", "severity": "low", "explanation": "Failed to parse batch response", "recommendation": "Retry"}] * len(clauses)


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