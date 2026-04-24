# FILE: backend/app/services/notice_templates.py
from enum import Enum
from datetime import datetime

class NoticeType(Enum):
    DEPOSIT_REFUND = "deposit_refund"
    RENT_HIKE = "rent_hike"
    EVICTION = "eviction"
    BREACH = "breach"
    UNPAID_SALARY = "unpaid_salary"
    GENERAL = "general"


TEMPLATES = {
    NoticeType.DEPOSIT_REFUND: {
        "name": "Security Deposit Refund Notice",
        "keywords": ["deposit", "refund", "security", "return"],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    },
    NoticeType.RENT_HIKE: {
        "name": "Rent Hike Complaint Notice",
        "keywords": ["rent", "increase", "hike", "raise"],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    },
    NoticeType.EVICTION: {
        "name": "Eviction Notice",
        "keywords": ["evict", "remove", "vacate", "possession"],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    },
    NoticeType.BREACH: {
        "name": "Breach of Agreement Notice",
        "keywords": ["breach", "violation", "fail"],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    },
    NoticeType.UNPAID_SALARY: {
        "name": "Notice for Unpaid Salary and Dues",
        "keywords": ["salary", "wage", "pay", "unpaid", "employment", "employee", "employer"],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    },
    NoticeType.GENERAL: {
        "name": "Legal Notice",
        "keywords": [],
        "sections": ["header", "to_from", "subject", "intro", "facts", "legal_basis", "demand", "closure"]
    }
}


def detect_notice_type(issue: str) -> NoticeType:
    issue_lower = issue.lower()
    
    for notice_type, template_data in TEMPLATES.items():
        for keyword in template_data["keywords"]:
            if keyword in issue_lower:
                return notice_type
    
    return NoticeType.GENERAL


class NoticeStructure:
    def __init__(self, notice_type: NoticeType):
        self.notice_type = notice_type
        self.template_data = TEMPLATES[notice_type]
        self.date = datetime.now().strftime("%d %B %Y")
        self.sections = {}
    
    def set_section(self, section_name: str, content: str) -> None:
        self.sections[section_name] = content.strip()
    
    def format_header(self) -> str:
        return f"LEGAL NOTICE\n{'='*50}\n{self.template_data['name']}\n{'='*50}"
    
    def format_to_from(self) -> str:
        to_content = self.sections.get("to", "To: The Recipient")
        from_content = self.sections.get("from", "From: The Complainant")
        return f"{to_content}\n\n{from_content}"
    
    def format_subject(self) -> str:
        subject = self.sections.get("subject", "Legal Notice")
        return f"SUBJECT: {subject}"
    
    def format_body(self) -> str:
        body = self.sections.get("body", "")
        return body if body else ""
    
    def format_demand(self) -> str:
        return self.sections.get("demand", 
            "The Respondent is hereby called upon to resolve the matter within 15 days "
            "from the receipt of this notice.\n\n"
            "Failing which, appropriate legal proceedings shall be initiated at your risk, "
            "cost, and consequences.")
    
    def format_closure(self) -> str:
        return f"\nDATE: {self.date}\n\nPlace: ___________\n\nSignature: ___________\nName: ___________"
    
    def render(self) -> str:
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


def build_deposit_refund_notice(issue: str) -> NoticeStructure:
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
    notice = NoticeStructure(NoticeType.RENT_HIKE)
    notice.set_section("subject", "Notice Regarding Unlawful Increase in Rent")
    notice.set_section("to", "TO: The Landlord / Property Owner")
    notice.set_section("from", "FROM: The Tenant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the unlawful 
   and arbitrary increase in rental charges.

2. The Complainant is a tenant at the property under a valid lease agreement. The rent was agreed 
   upon at a fixed amount as per the contract.

3. Recently, the Respondent has unilaterally increased the rent without proper legal procedure. Details:
   - Issue: {issue}

4. Such unilateral action is in violation of the principles of natural justice and the applicable rental laws.

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
    notice = NoticeStructure(NoticeType.EVICTION)
    notice.set_section("subject", "Notice Against Unlawful Eviction Proceedings")
    notice.set_section("to", "TO: The Landlord / Property Owner")
    notice.set_section("from", "FROM: The Tenant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the unlawful 
   attempt at eviction from the rented premises.

2. The Complainant occupies the property as a tenant under a valid lease agreement. 
   The Complainant has regularly paid all dues and has not violated any terms of the agreement.

3. Despite compliance with all obligations, the Respondent has initiated unlawful eviction proceedings. Details:
   - Issue: {issue}

4. Such action is unlawful as it violates the statutory requirements for eviction as prescribed 
   under the applicable tenancy laws.

5. The Complainant protests this unlawful action and reserves all rights to defend the same in law.
"""
    notice.set_section("body", body.strip())
    notice.set_section("demand",
        "The Respondent is hereby called upon to immediately cease all eviction proceedings and "
        "allow the Complainant to continue occupation of the premises within 15 days.\n\n"
        "Failing which, the Complainant shall take appropriate legal action to protect their rights.")
    return notice


def build_breach_notice(issue: str) -> NoticeStructure:
    notice = NoticeStructure(NoticeType.BREACH)
    notice.set_section("subject", "Notice Regarding Breach of Agreement")
    notice.set_section("to", "TO: The Respondent")
    notice.set_section("from", "FROM: The Complainant")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent regarding the breach 
   of the agreement entered into between the parties.

2. A valid agreement exists between the Complainant and the Respondent. The terms 
   and conditions of the agreement were agreed upon by both parties in good faith.

3. However, the Respondent has violated the following terms of the agreement:
   - Issue Description: {issue}

4. Such breach has caused/is causing financial and legal consequences to the Complainant. 

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


def build_unpaid_salary_notice(issue: str) -> NoticeStructure:
    notice = NoticeStructure(NoticeType.UNPAID_SALARY)
    notice.set_section("subject", "Legal Notice for Non-Payment of Salary and Dues")
    notice.set_section("to", "TO: The Employer / Company Management")
    notice.set_section("from", "FROM: The Employee")
    
    body = f"""
1. That the Complainant hereby submits this legal notice to the Respondent (Employer/Company) 
   regarding the unlawful withholding and non-payment of salary and legally entitled dues.

2. The Complainant was/is employed by the Respondent and has discharged all duties diligently 
   and in accordance with the terms of employment.

3. Despite fulfilling all professional obligations, the Respondent has failed to remit the 
   salary/dues owed to the Complainant. The details of the default are as follows:
   - Issue Details: {issue}

4. Such non-payment constitutes a severe breach of the employment contract and violates the 
   provisions of the Payment of Wages Act and other applicable labor laws. It has caused severe 
   financial hardship and mental agony to the Complainant.

5. The Complainant has made multiple amicable requests for the release of the pending dues, 
   which have been ignored or unjustly denied by the Respondent.
"""
    notice.set_section("body", body.strip())
    notice.set_section("demand",
        "The Respondent is hereby called upon to clear the entire outstanding salary and dues "
        "within 15 days from the receipt of this notice.\n\n"
        "Failing which, appropriate legal proceedings shall be initiated before the competent labor "
        "court or civil court for the recovery of dues along with interest, at your risk, cost, and consequences.")
    return notice


def build_general_notice(issue: str) -> NoticeStructure:
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


def generate_notice_template(issue: str) -> str:
    notice_type = detect_notice_type(issue)
    
    if notice_type == NoticeType.DEPOSIT_REFUND:
        notice = build_deposit_refund_notice(issue)
    elif notice_type == NoticeType.RENT_HIKE:
        notice = build_rent_hike_notice(issue)
    elif notice_type == NoticeType.EVICTION:
        notice = build_eviction_notice(issue)
    elif notice_type == NoticeType.BREACH:
        notice = build_breach_notice(issue)
    elif notice_type == NoticeType.UNPAID_SALARY:
        notice = build_unpaid_salary_notice(issue)
    else:
        notice = build_general_notice(issue)
    
    return notice.render()