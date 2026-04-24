# highlight_engine.py

import spacy
from typing import List, Dict

from app.services.chunk_service import split_into_clauses
from app.services.llm_service import analyze_clause

# Load spaCy model once (IMPORTANT for performance)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    raise Exception(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )


class HighlightEngine:
    def __init__(self):
        # You can expand this later
        self.keyword_weights = {
            "legal action": 3,
            "penalty": 2.5,
            "fine": 2,
            "within": 1.5,
            "deadline": 2,
            "terminate": 2,
            "failure": 2,
            "notice": 1,
            "liable": 2.5,
            "court": 3,
            "immediately": 2,
        }

    def split_sentences(self, text: str) -> List[str]:
        doc = nlp(text)
        return [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    def keyword_score(self, sentence: str) -> float:
        score = 0
        sentence_lower = sentence.lower()

        for keyword, weight in self.keyword_weights.items():
            if keyword in sentence_lower:
                score += weight

        return score

    def structure_score(self, sentence: str) -> float:
        score = 0
        words = sentence.split()

        # Prefer informative sentences (not too short)
        if len(words) > 8:
            score += 1

        # Penalize very long noisy sentences slightly
        if len(words) > 40:
            score -= 0.5

        return score

    def numeric_signal_score(self, sentence: str) -> float:
        score = 0

        # Detect numbers (deadlines, fines etc.)
        for token in sentence.split():
            if token.isdigit():
                score += 1

        return score

    def score_sentence(self, sentence: str) -> float:
        return (
            self.keyword_score(sentence)
            + self.structure_score(sentence)
            + self.numeric_signal_score(sentence)
        )

    def extract_highlights(self, text: str, top_k: int = 3) -> List[Dict]:
        # Prefer clause-based risk from the LLM analysis engine, fallback to keyword scoring
        clauses = split_into_clauses(text)

        risk_items = []
        for clause in clauses:
            if len(clause.split()) < 5:
                continue

            analysis = analyze_clause(clause)
            severity = analysis.get("severity", "unknown").lower()
            risk_type = analysis.get("risk_type", "none").lower()

            severity_score_map = {
                "high": 3,
                "medium": 2,
                "low": 1,
                "unknown": 0
            }

            score = severity_score_map.get(severity, 0)

            # Add LLM confidence weight (0-1) scaled to 2 points
            confidence = analysis.get("confidence", 0.0)
            try:
                confidence = float(confidence)
                confidence = max(0.0, min(1.0, confidence))
            except (TypeError, ValueError):
                confidence = 0.0

            score += confidence * 2

            if risk_type in ["financial", "restriction", "unfair"]:
                score += 1

            # Boost for clause length and keyword signals when LLM returns unknown
            if risk_type == "unknown" and severity == "unknown":
                score = max(score, self.score_sentence(clause) * 0.5)

            risk_items.append({
                "clause": clause,
                "risk_type": risk_type,
                "severity": severity,
                "explanation": analysis.get("explanation", ""),
                "score": round(score, 2)
            })

        risk_items.sort(key=lambda x: x["score"], reverse=True)

        if risk_items:
            return risk_items[:top_k]

        # fallback to sentence-level extraction when clause analysis fails
        sentences = self.split_sentences(text)
        scored_sentences = []

        for sent in sentences:
            score = self.score_sentence(sent)
            scored_sentences.append({"clause": sent, "score": round(score, 2)})

        scored_sentences.sort(key=lambda x: x["score"], reverse=True)
        return scored_sentences[:top_k]


# Quick test
if __name__ == "__main__":
    sample_text = """
    You are hereby notified that failure to comply within 7 days will result in legal action.
    A penalty of Rs. 5000 may be imposed.
    This is for your information.
    """

    engine = HighlightEngine()
    results = engine.extract_highlights(sample_text)

    for r in results:
        print(r)