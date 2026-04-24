# FILE: backend/app/routes/notice_routes.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import io

from app.schemas import APIResponse, NoticeRequest, NoticeUpdateRequest, NoticeDownloadRequest
from app.services.notice_generator import generate_legal_notice
from app.services.pdf_generator import notice_to_pdf

router = APIRouter(prefix="/notice", tags=["Notice Generator"])

# ---------------------------------------------------
# Generate Structured Notice
# ---------------------------------------------------

@router.post("/generate", response_model=APIResponse)
def generate_notice_api(req: NoticeRequest):
    """
    Generate a professionally structured legal notice based on user issue.
    Accepts optional context_data from a previously scanned contract to 
    ensure factual accuracy.
    """
    try:
        issue = req.issue.strip()
        
        if not issue or len(issue) < 10:
            return APIResponse(
                status="error",
                error="Please provide a detailed description (minimum 10 characters)"
            )
        
        # Generate the structured notice, passing the bridge context if it exists
        notice = generate_legal_notice(
            issue_description=issue,
            context_data=req.context_data
        )
        
        return APIResponse(
            status="success",
            data={"notice": notice}
        )
    
    except Exception as e:
        return APIResponse(
            status="error",
            error=f"Failed to generate notice: {str(e)}"
        )

# ---------------------------------------------------
# Update Notice Sections
# ---------------------------------------------------

@router.post("/update", response_model=APIResponse)
def update_notice_api(req: NoticeUpdateRequest):
    """
    Update specific sections of the notice after user edits.
    """
    try:
        notice_data = req.notice_data
        
        # Validate that the structure contains all required legal sections
        required_fields = ["header", "to", "from", "date", "subject", "body", "demand", "signature"]
        for field in required_fields:
            if field not in notice_data:
                return APIResponse(status="error", error=f"Missing field: {field}")
        
        # Basic validation for content substance
        if len(notice_data.get("body", "")) < 50:
            return APIResponse(status="error", error="Notice body section is too short")
        
        return APIResponse(
            status="success",
            data={"notice": notice_data},
            metadata={"message": "Notice updated successfully"}
        )
    
    except Exception as e:
        return APIResponse(status="error", error=str(e))

# ---------------------------------------------------
# Download as Professional PDF
# ---------------------------------------------------

@router.post("/download")
def download_notice_pdf(req: NoticeDownloadRequest):
    """
    Render the current notice state into a professionally formatted PDF.
    """
    try:
        notice_data = req.notice_data
        
        if not notice_data or "body" not in notice_data:
            return {"status": "error", "error": "Invalid notice data provided"}
        
        # Generate PDF byte stream
        pdf_bytes = notice_to_pdf(notice_data)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=legal_notice.pdf"
            }
        )
    
    except Exception as e:
        return {"status": "error", "error": f"PDF generation failed: {str(e)}"}