# FILE: backend/app/services/lawyer_registry.py
from typing import List, Dict, Optional
from app.services.notice_templates import NoticeType

class LawyerRegistry:
    """
    A curated registry of legal professionals. 
    This is a cost-effective alternative to paid APIs for MVP stage.
    """
    
    def __init__(self):
        # Data curated for common Indian legal issues
        self.lawyers = [
            {
                "id": "L_BLR_001",
                "name": "Adv. S. Vishwanath",
                "specialization": [NoticeType.DEPOSIT_REFUND, NoticeType.EVICTION, NoticeType.RENT_HIKE],
                "location": "Bengaluru",
                "experience": "14 Years",
                "rating": 4.9,
                "contact": "svishwanath.legal@example.com",
                "bio": "Specializes in Karnataka Rent Control Act and property disputes."
            },
            {
                "id": "L_CH_001",
                "name": "Adv. Meera Ramakrishnan",
                "specialization": [NoticeType.UNPAID_SALARY, NoticeType.BREACH],
                "location": "Chennai",
                "experience": "9 Years",
                "rating": 4.7,
                "contact": "meera.r@example.com",
                "bio": "Expert in labor laws and employment contract breaches."
            },
            {
                "id": "L_BLR_002",
                "name": "Adv. Anirudh Hegde",
                "specialization": [NoticeType.BREACH, NoticeType.GENERAL],
                "location": "Bengaluru",
                "experience": "11 Years",
                "rating": 4.6,
                "contact": "hegde.associates@example.com",
                "bio": "Civil litigation expert focusing on consumer rights and contract law."
            },
            {
                "id": "L_DEL_001",
                "name": "Adv. Priyanshu Sharma",
                "specialization": [NoticeType.DEPOSIT_REFUND, NoticeType.RENT_HIKE],
                "location": "Delhi",
                "experience": "7 Years",
                "rating": 4.5,
                "contact": "psharma.advocate@example.com",
                "bio": "Handles residential lease disputes and RERA complaints."
            }
        ]

    def match_lawyers(self, issue_type_val: str, location: Optional[str] = None) -> List[Dict]:
        """
        Matches lawyers based on NoticeType and Location.
        """
        try:
            target_issue = NoticeType(issue_type_val)
        except ValueError:
            target_issue = NoticeType.GENERAL

        # Step 1: Find lawyers who handle this specific issue
        matches = [
            lawyer for lawyer in self.lawyers 
            if target_issue in lawyer["specialization"]
        ]

        # Step 2: Sort so that local lawyers appear first
        if location:
            matches.sort(
                key=lambda x: x["location"].lower() == location.lower(), 
                reverse=True
            )

        return matches[:3]

lawyer_service = LawyerRegistry()