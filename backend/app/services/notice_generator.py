# FILE: backend/app/services/notice_generator.py
import json
from typing import Dict, Optional
from datetime import datetime
from app.services.llm_service import call_llm
from app.services.notice_templates import (
    detect_notice_type,
    NoticeType,
    build_deposit_refund_notice,
    build_rent_hike_notice,
    build_eviction_notice,
    build_breach_notice,
    build_unpaid_salary_notice,
    build_general_notice
)

class LegalNoticeGenerator:
    """Practical legal notice generator connecting LLM extraction to deterministic templates."""

    def _extract_facts(self, user_issue: str, context_data: Optional[str] = None) -> str:
        """Uses LLM solely to extract and formalize facts, incorporating contract context if provided."""
        context_instruction = ""
        if context_data:
            context_instruction = (
                f"ADDITIONAL CONTRACT CONTEXT:\n{context_data}\n"
                f"Reference relevant clauses or summary points from this context in your summary.\n"
            )

        prompt = f"""
You are a legal assistant summarizing a user's complaint.
Translate the user's informal explanation into a single, formal, factual paragraph that can be inserted into a legal notice.

{context_instruction}
USER ISSUE: "{user_issue}"

RULES:
1. Keep it under 4 sentences.
2. Use formal, objective language (e.g., "The Respondent failed to...", "The Complainant paid...").
3. Do NOT include greetings, demands, or legal jargon. Just the core facts.
4. If contract context is provided, ensure the summary aligns with specific breaches or risky clauses mentioned.
5. Return ONLY valid JSON.

OUTPUT FORMAT:
{{
    "formal_summary": "The objective summary of the issue."
}}
"""
        try:
            response = call_llm(prompt)
            parsed = json.loads(response)
            summary = parsed.get("formal_summary", "").strip()
            return summary if summary else user_issue
        except Exception:
            return user_issue

    def generate_notice(self, issue_description: str, context_data: Optional[str] = None) -> Dict:
        """Generate a structured legal notice dictionary."""
        
        # 1. Detect the legal category based on the issue and any context
        combined_text = f"{issue_description} {context_data if context_data else ''}"
        notice_type = detect_notice_type(combined_text)
        
        # 2. Extract Formal Facts via LLM, passing the bridge context
        formal_facts = self._extract_facts(issue_description, context_data)
        
        # 3. Inject facts into the deterministic Python templates
        if notice_type == NoticeType.DEPOSIT_REFUND:
            notice_obj = build_deposit_refund_notice(formal_facts)
        elif notice_type == NoticeType.RENT_HIKE:
            notice_obj = build_rent_hike_notice(formal_facts)
        elif notice_type == NoticeType.EVICTION:
            notice_obj = build_eviction_notice(formal_facts)
        elif notice_type == NoticeType.BREACH:
            notice_obj = build_breach_notice(formal_facts)
        elif notice_type == NoticeType.UNPAID_SALARY:
            notice_obj = build_unpaid_salary_notice(formal_facts)
        else:
            notice_obj = build_general_notice(formal_facts)
            
        # 4. Map the object back to the JSON structure the frontend expects
        return {
            "issue_type": notice_type.value,
            "header": notice_obj.format_header(),
            "to": notice_obj.sections.get("to", "[Recipient Name and Address]"),
            "from": notice_obj.sections.get("from", "[Your Name and Address]"),
            "date": notice_obj.date,
            "subject": notice_obj.sections.get("subject", "Legal Notice"),
            "body": notice_obj.sections.get("body", ""),
            "demand": notice_obj.sections.get("demand", ""),
            "signature": notice_obj.format_closure()
        }


def generate_legal_notice(issue_description: str, context_data: Optional[str] = None) -> Dict:
    """Generate a structured and validated legal notice."""
    generator = LegalNoticeGenerator()
    notice = generator.generate_notice(issue_description, context_data)
    return notice

def render_notice(notice: Dict) -> str:
    """Render structured notice as a formatted plain text string."""
    if not notice or not isinstance(notice, dict):
        raise ValueError("Invalid notice data for rendering")

    parts = [
        notice.get('header', 'LEGAL NOTICE'),
        "",
        notice.get('to', ''),
        "",
        notice.get('from', ''),
        "",
        f"Date: {notice.get('date', '')}",
        "",
        f"Subject: {notice.get('subject', '')}",
        "",
        "BODY:",
        notice.get('body', ''),
        "",
        "DEMAND:",
        notice.get('demand', ''),
        "",
        notice.get('signature', '')
    ]

    return "\n".join(parts)