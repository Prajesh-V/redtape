# ============================================================
# 🏛️ LEGAL NOTICE TEMPLATE SYSTEM
# ============================================================
# Structured templates for different legal issue types
# Each template has specific sections and formatting rules

from enum import Enum
from datetime import datetime

class NoticeType(Enum):
    DEPOSIT_REFUND = "deposit_refund"
    RENT_HIKE = "rent_hike"
    EVICTION = "eviction"
    BREACH = "breach"
    GENERAL = "general"


# ============================================================
# 📋 TEMPLATE DATA STRUCTURES
# ============================================================

TEMPLATES = {
    NoticeType.DEPOSIT_REFUND: {
        "name": "Security Deposit Refund Notice",
        "keywords": ["deposit", "refund", "security", "return"],
        "sections": [
            "header",
            "to_from",
            "subject",
            "intro",
            "facts",
            "legal_basis",
            "demand",
            "closure"
        ]
    },
    NoticeType.RENT_HIKE: {
        "name": "Rent Hike Complaint Notice",
        "keywords": ["rent", "increase", "hike", "raise"],
        "sections": [
            "header",
            "to_from",
            "subject",
            "intro",
            "facts",
            "legal_basis",
            "demand",
            "closure"
        ]
    },
    NoticeType.EVICTION: {
        "name": "Eviction Notice",
        "keywords": ["evict", "remove", "vacate", "possession"],
        "sections": [
            "header",
            "to_from",
            "subject",
            "intro",
            "facts",
            "legal_basis",
            "demand",
            "closure"
        ]
    },
    NoticeType.BREACH: {
        "name": "Breach of Agreement Notice",
        "keywords": ["breach", "violation", "breach", "fail"],
        "sections": [
            "header",
            "to_from",
            "subject",
            "intro",
            "facts",
            "legal_basis",
            "demand",
            "closure"
        ]
    },
    NoticeType.GENERAL: {
        "name": "Legal Notice",
        "keywords": [],
        "sections": [
            "header",
            "to_from",
            "subject",
            "intro",
            "facts",
            "legal_basis",
            "demand",
            "closure"
        ]
    }
}


# ============================================================
# 🔍 ISSUE TYPE DETECTION
# ============================================================

def detect_notice_type(issue: str) -> NoticeType:
    """Detect the type of legal notice needed based on issue description."""
    issue_lower = issue.lower()
    
    # Check keywords for each notice type
    for notice_type, template_data in TEMPLATES.items():
        for keyword in template_data["keywords"]:
            if keyword in issue_lower:
                return notice_type
    
    # Default to GENERAL if no specific type matches
    return NoticeType.GENERAL


# ============================================================
# 📝 TEMPLATE STRUCTURE CLASSES
# ============================================================

class NoticeStructure:
    """Structured legal notice with proper sections."""
    
    def __init__(self, notice_type: NoticeType):
        self.notice_type = notice_type
        self.template_data = TEMPLATES[notice_type]
        self.date = datetime.now().strftime("%d %B %Y")
        self.sections = {}
    
    def set_section(self, section_name: str, content: str) -> None:
        """Set content for a specific section."""
        self.sections[section_name] = content.strip()
    
    def format_header(self) -> str:
        """Format the header section."""
        return f"LEGAL NOTICE\n{'='*50}\n{self.template_data['name']}\n{'='*50}"
    
    def format_to_from(self) -> str:
        """Format TO and FROM sections."""
        to_content = self.sections.get("to", "To: The Recipient")
        from_content = self.sections.get("from", "From: The Complainant")
        
        return f"{to_content}\n\n{from_content}"
    
    def format_subject(self) -> str:
        """Format SUBJECT line."""
        subject = self.sections.get("subject", "Legal Notice")
        return f"SUBJECT: {subject}"
    
    def format_body(self) -> str:
        """Format main body paragraphs."""
        body = self.sections.get("body", "")
        if body:
            return body
        return ""
    
    def format_demand(self) -> str:
        """Format the legal demand section."""
        demand = self.sections.get("demand", 
            "The Respondent is hereby called upon to resolve the matter within 15 days "
            "from the receipt of this notice.\n\n"
            "Failing which, appropriate legal proceedings shall be initiated at your risk, "
            "cost, and consequences.")
        return demand
    
    def format_closure(self) -> str:
        """Format closing section with date and signature."""
        return f"\nDATE: {self.date}\n\nPlace: ___________\n\nSignature: ___________\nName: ___________"
    
    def render(self) -> str:
        """Render the complete formatted notice."""
        sections = [
            self.format_header(),
            "",
            self.format_to_from(),
            "",
            self.format_subject(),
            "",
            self.format_body(),
            "",
            self.format_demand(),
            self.format_closure()
        ]
        
        return "\n".join(sections)


# ============================================================
# 🏗️ TEMPLATE BUILDERS (Issue-specific)
# ============================================================

def build_deposit_refund_notice(issue: str) -> NoticeStructure:
    """Build a security deposit refund notice."""
    notice = NoticeStructure(NoticeType.DEPOSIT_REFUND)
    
    notice.set_section("subject", "Demand for Return of Security Deposit")
    notice.set_section("to", "TO: The Landlord / Property Owner")
    notice.set_section("from", "FROM: The Tenant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent (Landlord/Property Owner) 
   regarding the unlawful withholding of the security deposit.

2. The Complainant was a tenant at the property and paid a security deposit as per the terms of the 
   rental agreement. Upon vacating the premises, the Respondent has unjustly refused to refund the same.

3. The details are as follows:
   - Property: [Address to be filled]
   - Amount of Deposit: [Amount to be filled]
   - Date of Vacation: [Date to be filled]
   - Issue: {issue}

4. Such refusal to return the security deposit is in direct violation of the provisions of the 
   Indian Contract Act and the prevailing rental laws.

5. The security deposit is the rightful property of the Complainant and must be returned without 
   any unauthorized deductions.
"""
    
    notice.set_section("body", body.strip())
    
    notice.set_section("demand", 
        "The Respondent is hereby called upon to refund the entire security deposit within 15 days "
        "from the receipt of this notice.\n\n"
        "Failing which, appropriate legal proceedings shall be initiated at your risk, cost, and consequences.")
    
    return notice


def build_rent_hike_notice(issue: str) -> NoticeStructure:
    """Build a rent hike complaint notice."""
    notice = NoticeStructure(NoticeType.RENT_HIKE)
    
    notice.set_section("subject", "Notice Regarding Unlawful Increase in Rent")
    notice.set_section("to", "TO: The Landlord / Property Owner")
    notice.set_section("from", "FROM: The Tenant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the unlawful 
   and arbitrary increase in rental charges.

2. The Complainant is a tenant at the property under a valid lease agreement. The rent was agreed 
   upon at a fixed amount as per the contract.

3. Recently, the Respondent has unilaterally increased the rent without:
   - Providing legal notice as per the tenancy laws
   - Following the proper procedures prescribed under the applicable rent control act
   - Issue Details: {issue}

4. Such unilateral action is in violation of the principles of natural justice and the applicable 
   rental laws, which require compliance with statutory procedures before any rent increase.

5. The rental agreement remains valid as per its original terms, and the Complainant has the right 
   to continue at the agreed rent amount.
"""
    
    notice.set_section("body", body.strip())
    
    notice.set_section("demand",
        "The Respondent is hereby called upon to withdraw the rent increase and maintain the rent "
        "at the agreed amount within 15 days from the receipt of this notice.\n\n"
        "Failing which, appropriate legal proceedings shall be initiated at your risk, cost, and consequences.")
    
    return notice


def build_eviction_notice(issue: str) -> NoticeStructure:
    """Build an eviction defense/notice."""
    notice = NoticeStructure(NoticeType.EVICTION)
    
    notice.set_section("subject", "Notice Against Unlawful Eviction Proceedings")
    notice.set_section("to", "TO: The Landlord / Property Owner")
    notice.set_section("from", "FROM: The Tenant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the unlawful 
   attempt at eviction from the rented premises.

2. The Complainant occupies the property as a tenant under a valid lease agreement dated [Date]. 
   The Complainant has regularly paid all dues and has not violated any terms of the agreement.

3. Despite compliance with all obligations, the Respondent has initiated unlawful eviction 
   proceedings against the Complainant. Details:
   - Issue: {issue}
   - Legal grounds claimed by Respondent: [To be specified]

4. Such action is unlawful as it violates the statutory requirements for eviction as prescribed 
   under the applicable tenancy laws. The Respondent cannot evict without:
   - Valid legal grounds
   - Proper legal notice
   - Order from a competent court

5. The Complainant protests this unlawful action and reserves all rights to defend the same in law.
"""
    
    notice.set_section("body", body.strip())
    
    notice.set_section("demand",
        "The Respondent is hereby called upon to immediately cease all eviction proceedings and "
        "allow the Complainant to continue occupation of the premises within 15 days.\n\n"
        "Failing which, the Complainant shall take appropriate legal action to protect their rights.")
    
    return notice


def build_breach_notice(issue: str) -> NoticeStructure:
    """Build a breach of agreement notice."""
    notice = NoticeStructure(NoticeType.BREACH)
    
    notice.set_section("subject", "Notice Regarding Breach of Agreement")
    notice.set_section("to", "TO: The Respondent")
    notice.set_section("from", "FROM: The Complainant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the breach 
   of the agreement entered into between the parties.

2. A valid agreement exists between the Complainant and the Respondent dated [Date]. The terms 
   and conditions of the agreement were agreed upon by both parties in good faith.

3. However, the Respondent has violated the following terms of the agreement:
   - Issue Description: {issue}
   - Specific Breach: [Details to be filled]

4. Such breach has caused/is causing financial and legal consequences to the Complainant. The 
   Respondent is legally bound to remedy this breach and compensate for damages caused.

5. The Complainant reserves all rights under the Indian Contract Act, 1872, and other applicable 
   laws to enforce performance of the agreement and seek damages.
"""
    
    notice.set_section("body", body.strip())
    
    notice.set_section("demand",
        "The Respondent is hereby called upon to remedy the breach and comply with all terms of "
        "the agreement within 15 days from the receipt of this notice.\n\n"
        "Failing which, appropriate legal proceedings shall be initiated for specific performance "
        "and damages at your risk, cost, and consequences.")
    
    return notice


def build_general_notice(issue: str) -> NoticeStructure:
    """Build a general legal notice."""
    notice = NoticeStructure(NoticeType.GENERAL)
    
    notice.set_section("subject", "Legal Notice")
    notice.set_section("to", "TO: The Respondent")
    notice.set_section("from", "FROM: The Complainant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding a matter 
   of legal concern.

2. The following issue requires immediate attention and resolution:
   {issue}

3. The Complainant has exhausted all amicable means of resolution and hereby formally notifies 
   the Respondent.

4. The Respondent is legally required to address this matter and take corrective action as appropriate.
"""
    
    notice.set_section("body", body.strip())
    
    return notice


# ============================================================
# 🎯 MAIN TEMPLATE FUNCTION
# ============================================================

def generate_notice_template(issue: str) -> str:
    """
    Main function to generate a properly structured legal notice.
    
    Args:
        issue: Description of the legal issue
    
    Returns:
        Formatted legal notice as string
    """
    
    # Detect the type of notice needed
    notice_type = detect_notice_type(issue)
    
    # Build the appropriate notice
    if notice_type == NoticeType.DEPOSIT_REFUND:
        notice = build_deposit_refund_notice(issue)
    elif notice_type == NoticeType.RENT_HIKE:
        notice = build_rent_hike_notice(issue)
    elif notice_type == NoticeType.EVICTION:
        notice = build_eviction_notice(issue)
    elif notice_type == NoticeType.BREACH:
        notice = build_breach_notice(issue)
    else:
        notice = build_general_notice(issue)
    
    # Render and return
    return notice.render()
