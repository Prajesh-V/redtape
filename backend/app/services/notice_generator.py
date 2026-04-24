"""
🏛️ PRACTICAL LEGAL NOTICE GENERATOR
=====================================

Generates usable, practical legal notices using:
- Simple, clear language (no legal jargon)
- No hallucinated laws or citations
- Location-agnostic approach
- Focus on clear communication and demands
"""

import json
from typing import Dict, List
from datetime import datetime
from app.services.llm_service import call_llm


class LegalNoticeGenerator:
    """Practical legal notice generator for real-world use."""

    # Issue type detection keywords
    ISSUE_TYPES = {
        "deposit": ["deposit", "refund", "security", "return"],
        "rent": ["rent", "increase", "hike", "raise", "payment"],
        "eviction": ["evict", "remove", "vacate", "possession", "leave"],
        "breach": ["breach", "violation", "fail", "default", "not doing"],
        "harassment": ["harassment", "abuse", "threat", "violence", "trouble"],
        "maintenance": ["maintenance", "repair", "damage", "negligence", "broken"],
        "general": []
    }

    # Subject line templates per issue type
    SUBJECT_TEMPLATES = {
        "deposit": "Request for Return of Security Deposit",
        "rent": "Notice About Rent Issues",
        "eviction": "Notice About Eviction",
        "breach": "Notice About Agreement Violation",
        "harassment": "Notice About Harassment",
        "maintenance": "Notice About Property Maintenance",
        "general": "Legal Notice"
    }

    def detect_issue_type(self, issue_description: str) -> str:
        """Detect the type of legal issue from description."""
        issue_lower = issue_description.lower()

        for issue_type, keywords in self.ISSUE_TYPES.items():
            if any(keyword in issue_lower for keyword in keywords):
                return issue_type

        return "general"

    def generate_notice(self, issue_description: str) -> Dict:
        """Generate a practical, usable legal notice."""
        issue_type = self.detect_issue_type(issue_description)

        # Get subject line
        subject = self.SUBJECT_TEMPLATES.get(issue_type, "Legal Notice")

        # Generate content using constrained LLM prompt
        content = self._generate_content(issue_description, issue_type)

        # Structure the notice
        notice = {
            "header": "LEGAL NOTICE",
            "to": "[Recipient Name and Address]",
            "from": "[Your Name and Address]",
            "date": datetime.now().strftime("%d %B %Y"),
            "subject": subject,
            "body": content.get("body", ""),
            "demand": content.get("demand", ""),
            "signature": f"Date: {datetime.now().strftime('%d %B %Y')}\n\nPlace: __________\n\nSignature: ___________\n\nName: ___________"
        }

        return notice

    def _generate_content(self, issue_description: str, issue_type: str) -> Dict:
        """Generate notice content using highly constrained LLM prompt."""

        # Ultra-constrained prompt that prevents hallucinations
        prompt = f"""
You are a legal notice writer. Generate a simple, clear notice about: "{issue_description}"

RULES - FOLLOW THESE STRICTLY:
1. Use simple, everyday language - no legal jargon
2. Do NOT mention any specific laws, acts, or sections
3. Do NOT make up legal references or citations
4. Keep it practical and understandable
5. Focus on facts and clear requests
6. Be polite but firm

OUTPUT FORMAT - Use this exact structure:

BODY:
[Write 2-3 simple paragraphs explaining the situation clearly]

DEMAND:
[Write 1 clear paragraph stating what you want the other party to do and by when]
"""

        try:
            response = call_llm(prompt)

            # Parse the response
            body = ""
            demand = ""

            if "BODY:" in response:
                body_part = response.split("BODY:")[1]
                if "DEMAND:" in body_part:
                    body = body_part.split("DEMAND:")[0].strip()
                    demand = body_part.split("DEMAND:")[1].strip()
                else:
                    body = body_part.strip()
            else:
                # Fallback if parsing fails
                body = f"I am writing regarding: {issue_description}"
                demand = "Please resolve this matter within 15 days."

            return {
                "body": body,
                "demand": demand
            }

        except Exception as e:
            # Fallback content if LLM fails
            return {
                "body": f"I am writing to inform you about the following issue: {issue_description}",
                "demand": "Please resolve this matter within 15 days from receiving this notice."
            }

    def validate_notice(self, notice: Dict) -> bool:
        """Validate that notice has all required sections."""
        required_sections = ["header", "to", "from", "date", "subject", "body", "demand", "signature"]

        for section in required_sections:
            if section not in notice or not notice[section]:
                return False

        return True


# ============================================================
# Convenience methods used by API routes
# ============================================================

def generate_legal_notice(issue_description: str) -> Dict:
    """Generate a structured and validated legal notice."""
    generator = LegalNoticeGenerator()

    notice = generator.generate_notice(issue_description)
    notice["issue_type"] = generator.detect_issue_type(issue_description)

    if not generator.validate_notice(notice):
        raise ValueError("Generated notice is missing required fields")

    return notice


def render_notice(notice: Dict) -> str:
    """Render structured notice as a formatted plain text string."""
    if not notice or not isinstance(notice, dict):
        raise ValueError("Invalid notice data for rendering")

    parts = [
        "LEGAL NOTICE",
        "",
        f"TO: {notice.get('to', '[Recipient Name and Address]')}",
        f"FROM: {notice.get('from', '[Your Name and Address]')}",
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

