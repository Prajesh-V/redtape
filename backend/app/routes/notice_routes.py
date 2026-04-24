from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io
from typing import Optional

from app.services.notice_generator import generate_legal_notice, render_notice
from app.services.pdf_generator import notice_to_pdf

router = APIRouter(prefix="/notice", tags=["Notice Generator"])


# ============================================================
# 📋 REQUEST/RESPONSE SCHEMAS
# ============================================================

class NoticeRequest(BaseModel):
    """User submits an issue description."""
    issue: str


class NoticeUpdateRequest(BaseModel):
    """User edits one or more sections."""
    notice_data: dict


class NoticeDownloadRequest(BaseModel):
    """User requests PDF download."""
    notice_data: dict


# ============================================================
# 🧠 GENERATE STRUCTURED NOTICE
# ============================================================

@router.post("/generate")
def generate_notice_api(req: NoticeRequest):
    """
    Generate a professionally structured legal notice.
    
    Returns:
        {
            "success": true,
            "notice": {
                "issue_type": "deposit|rent|eviction|breach|harassment|maintenance|general",
                "header": "LEGAL NOTICE",
                "to": "TO: [Recipient]",
                "from": "FROM: [Sender]",
                "date": "DD Month YYYY",
                "subject": "Subject Line",
                "body": "Numbered paragraphs...",
                "demand": "Legal demand section...",
                "signature": "Signature block..."
            }
        }
    """
    try:
        issue = req.issue.strip()
        
        if not issue or len(issue) < 10:
            return {
                "success": False,
                "error": "Please provide a detailed description (minimum 10 characters)"
            }
        
        # Generate structured notice
        notice = generate_legal_notice(issue)
        
        print(f"✅ GENERATED NOTICE - Type: {notice.get('issue_type')}")
        
        return {
            "success": True,
            "notice": notice
        }
    
    except Exception as e:
        print(f"❌ ERROR generating notice: {str(e)}")
        return {
            "success": False,
            "error": f"Failed to generate notice: {str(e)}"
        }


# ============================================================
# ✏️ UPDATE NOTICE SECTIONS
# ============================================================

@router.post("/update")
def update_notice_api(req: NoticeUpdateRequest):
    """
    Update specific sections of the notice.
    
    Allows users to edit:
    - to, from, date, subject, body, demand, signature
    """
    try:
        notice_data = req.notice_data
        
        # Validate structure
        required = ["header", "to", "from", "date", "subject", "body", "demand", "signature"]
        for field in required:
            if field not in notice_data:
                return {
                    "success": False,
                    "error": f"Missing field: {field}"
                }
        
        # Validate content length
        if len(notice_data.get("body", "")) < 50:
            return {
                "success": False,
                "error": "Body section is too short"
            }
        
        return {
            "success": True,
            "notice": notice_data,
            "message": "Notice updated successfully"
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# 📄 DOWNLOAD AS PROFESSIONAL PDF
# ============================================================

@router.post("/download")
def download_notice_pdf(req: NoticeDownloadRequest):
    """
    Download the notice as a professionally formatted PDF.
    
    Uses ReportLab to create legal document styled PDFs.
    """
    try:
        notice_data = req.notice_data
        
        # Validate data
        if not notice_data or "body" not in notice_data:
            return {
                "success": False,
                "error": "Invalid notice data"
            }
        
        # Generate PDF
        pdf_bytes = notice_to_pdf(notice_data)
        
        print("✅ PDF generated successfully")
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=legal_notice.pdf"
            }
        )
    
    except Exception as e:
        print(f"❌ PDF generation error: {str(e)}")
        return {
            "success": False,
            "error": f"PDF generation failed: {str(e)}"
        }