import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"


# -------------------------------
# 🔹 CLEAN OUTPUT (CRITICAL)
# -------------------------------
def clean_output(text: str):
    if not text:
        return ""

    return (
        text.replace("```", "")
        .replace("markdown", "")
        .strip()
    )


# -------------------------------
# 🔹 COMMON LLM CALL FUNCTION
# -------------------------------
def call_llm(prompt: str, temperature=0.2):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature
                }
            },
            timeout=600
        )

        result = response.json()
        output = result.get("response", "").strip()

        return clean_output(output)

    except requests.exceptions.RequestException as e:
        return f"ERROR: {str(e)}"


# -------------------------------
# 🔹 CLAUSE ANALYSIS
# -------------------------------
def analyze_clause(clause: str):
    prompt = f"""
You are a legal risk analysis engine specialized in rental agreements.

STRICT RULES:

- Output ONLY valid JSON
- No markdown, no explanations outside JSON
- Do not hallucinate laws
- Ignore irrelevant clauses

RISK TYPES:
financial, restriction, unfair, none

SEVERITY:
low, medium, high

OUTPUT:

{{
  "risk_type": "",
  "severity": "",
  "confidence": 0.0,
  "explanation": "",
  "recommendation": ""
}}

Guidance:
- If a clause touches multiple risk areas, choose the dominant risk_type.
- Set confidence as a decimal between 0.0 and 1.0.
- Keep explanation concise and include a practical recommendation.

CLAUSE:
\"\"\"{clause}\"\"\"

If format breaks, regenerate correctly.
"""

    response_text = call_llm(prompt, temperature=0.2)

    # Handle error responses from LLM
    if response_text.startswith("ERROR:"):
        return {
            "risk_type": "unknown",
            "severity": "medium",
            "confidence": 0.0,
            "explanation": "Unable to analyze clause (LLM service unavailable)",
            "recommendation": "Please retry or verify the document content."
        }

    try:
        parsed = json.loads(response_text)

        if not isinstance(parsed, dict):
            raise ValueError("Invalid JSON format")

        risk_type_raw = str(parsed.get("risk_type", "unknown")).lower()
        risk_type_candidates = [r.strip() for r in risk_type_raw.replace("\\", "|").replace("/", "|").split("|") if r.strip()]
        risk_type_final = "unknown"
        for candidate in risk_type_candidates:
            if candidate in ["financial", "restriction", "unfair", "none"]:
                risk_type_final = candidate
                break
        if risk_type_final == "unknown" and risk_type_raw in ["financial", "restriction", "unfair", "none", "unknown"]:
            risk_type_final = risk_type_raw

        severity = str(parsed.get("severity", "unknown")).lower()
        if severity not in ["low", "medium", "high", "unknown"]:
            severity = "unknown"

        confidence = parsed.get("confidence", None)
        try:
            confidence = float(confidence)
            confidence = max(0.0, min(1.0, confidence))
        except (TypeError, ValueError):
            # fallback confidence for non-none risk categories
            if risk_type_final in ["financial", "restriction", "unfair"]:
                confidence = 0.7
            elif severity in ["high"]:
                confidence = 0.75
            elif severity in ["medium"]:
                confidence = 0.6
            else:
                confidence = 0.3

        explanation = str(parsed.get("explanation", "No explanation provided.")).strip()
        if not explanation:
            explanation = "No explanation provided."

        recommendation = str(parsed.get("recommendation", "")).strip()
        if not recommendation:
            if risk_type_final == "financial":
                recommendation = "Review payment terms and discuss potential adjustments with the landlord."
            elif risk_type_final == "restriction":
                recommendation = "Consider negotiating the lock-in period or termination clauses."
            elif risk_type_final == "unfair":
                recommendation = "Seek legal advice to challenge potentially unfair terms."
            else:
                recommendation = "No recommendation provided."

        return {
            "risk_type": risk_type_final,
            "severity": severity,
            "confidence": confidence,
            "explanation": explanation,
            "recommendation": recommendation
        }

    except Exception:
        # Fallback for unparseable responses
        return {
            "risk_type": "unknown",
            "severity": "low",
            "confidence": 0.0,
            "explanation": "Could not parse analysis; please verify model output format.",
            "recommendation": "Use a stronger model or debug clause prompts."
        }


# -------------------------------
# 🔹 DOCUMENT SUMMARIZATION
# -------------------------------
def summarize_document(text: str):
    prompt = (
        "You are a legal document summarization engine. Return ONLY valid JSON with this exact structure:\n"
        "{\n"
        "  \"short_summary\": \"\",\n"
        "  \"important_points\": [\"\", \"\"],\n"
        "  \"possible_risks\": [\n"
        "    {\"risk_type\": \"financial\", \"description\": \"\"}\n"
        "  ]\n"
        "}\n"
        "\n"
        "Rules:\n"
        "- Do NOT output markdown.\n"
        "- Use plain text in strings.\n"
        "- Do NOT hallucinate laws.\n"
        "- Keep fields concise and relevant.\n"
        "\n"
        "Document:\n"
        f"{text[:3000]}"
    )

    result = call_llm(prompt, temperature=0.3)

    if result.startswith("ERROR:"):
        return {
            "short_summary": "Document summary unavailable.",
            "important_points": [],
            "possible_risks": []
        }

    try:
        parsed = json.loads(result)

        if not isinstance(parsed, dict):
            raise ValueError("Invalid format")

        short_summary = parsed.get("short_summary", "").strip()
        important_points = parsed.get("important_points", [])
        possible_risks = parsed.get("possible_risks", [])

        if not isinstance(important_points, list):
            important_points = []
        if not isinstance(possible_risks, list):
            possible_risks = []

        # Normalize risk_type entries
        allowed_risks = ["financial", "restriction", "unfair", "other"]
        normalized_risks = []

        for risk in possible_risks:
            if not isinstance(risk, dict):
                continue
            rt = str(risk.get("risk_type", "other")).lower()
            if "|" in rt:
                rt = next((part.strip() for part in rt.split("|") if part.strip() in allowed_risks), "other")
            if rt not in allowed_risks:
                rt = "other"
            desc = str(risk.get("description", "")).strip()
            normalized_risks.append({"risk_type": rt, "description": desc})

        possible_risks = normalized_risks

        return {
            "short_summary": short_summary,
            "important_points": important_points,
            "possible_risks": possible_risks
        }

    except Exception:
        # Fallback to minimal structure
        return {
            "short_summary": result.strip() or "Unable to generate summary at this time.",
            "important_points": [],
            "possible_risks": []
        }


# -------------------------------
# 🔹 DOCUMENT TYPE DETECTION
# -------------------------------
def detect_document_type(text: str):
    prompt = f"""
You are a document classification engine.

Choose ONLY one:
rental agreement
legal notice
employment contract
loan agreement
service agreement
other

RULES:
- Output only label
- No explanation

DOCUMENT:
\"\"\"{text[:2000]}\"\"\"

If unsure return "other".
"""

    result = call_llm(prompt, temperature=0)
    
    # Handle error responses
    if result.startswith("ERROR:"):
        return "unknown"
    
    clean_result = result.strip().lower()
    return clean_result if clean_result else "unknown"

