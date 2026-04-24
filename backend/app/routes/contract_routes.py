from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import io

from app.services.file_conversion_service import convert_to_pdf
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_with_ocr, clean_ocr_text
from app.services.chunk_service import split_into_clauses
from app.services.llm_service import analyze_clause, summarize_document, detect_document_type
from app.services.pdf_highlight_service import highlight_clauses_in_pdf
from app.services.highlight_engine import HighlightEngine

router = APIRouter(prefix="/contracts", tags=["Contract Scanner"])

engine = HighlightEngine()


# =========================
# 📄 SCAN CONTRACT (JSON OUTPUT)
# =========================
@router.post("/scan-contract")
async def scan_contract(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_file"

        # Convert to PDF
        pdf_bytes = convert_to_pdf(file_bytes, filename)

        # Extract text
        text = extract_text_from_pdf(pdf_bytes)

        if len(text.strip()) < 50:
            text = extract_text_with_ocr(pdf_bytes)

        text = clean_ocr_text(text)

        # Metadata
        document_type = detect_document_type(text)
        summary_struct = summarize_document(text)

        summary_text = summary_struct.get("short_summary") if isinstance(summary_struct, dict) else str(summary_struct)
        important_points = summary_struct.get("important_points", []) if isinstance(summary_struct, dict) else []
        possible_risks = summary_struct.get("possible_risks", []) if isinstance(summary_struct, dict) else []

        # Split clauses
        clauses = split_into_clauses(text)

        # Prefer potential risk clauses by keywords first
        keywords = ["rent", "deposit", "lock-in", "termination", "penalty", "liability", "maintenance", "eviction"]

        filtered_clauses = []

        for clause in clauses:
            if len(clause.strip()) < 10:
                continue

            clause_lower = clause.lower()
            if any(term in clause_lower for term in ["agreement is made", "signature", "witness", "date", "place"]):
                continue

            if any(word in clause_lower for word in keywords):
                filtered_clauses.append(clause)

        if not filtered_clauses:
            filtered_clauses = [c for c in clauses if len(c.split()) > 8][:10]

        # Analyze and rank clauses
        analysis_results = []
        for clause in filtered_clauses[:10]:
            analysis = analyze_clause(clause)
            analysis_results.append({
                "clause": clause,
                "analysis": analysis
            })

        # Choose high-risk items for highlighting
        risky_clauses = [
            r["clause"]
            for r in analysis_results
            if r["analysis"].get("risk_type") in ["financial", "restriction", "unfair"] or r["analysis"].get("severity") == "high"
        ]

        highlighted_pdf = highlight_clauses_in_pdf(pdf_bytes, risky_clauses)

        return {
            "status": "success",
            "filename": filename,
            "document_type": document_type,
            "summary": summary_text,
            "important_points": important_points,
            "possible_risks": possible_risks,
            "total_clauses_detected": len(filtered_clauses),
            "analysis_results": analysis_results,
            "highlighted_pdf_size": len(highlighted_pdf)
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "filename": filename,
            "document_type": "unknown",
            "summary": "Error processing document",
            "important_points": [],
            "possible_risks": [],
            "total_clauses_detected": 0,
            "analysis_results": [],
            "highlighted_pdf_size": 0
        }


# =========================
# 📄 DOWNLOAD HIGHLIGHTED PDF
# =========================
@router.post("/highlight-contract")
async def highlight_contract(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_file"

        # Convert to PDF
        pdf_bytes = convert_to_pdf(file_bytes, filename)

        # Extract text
        text = extract_text_from_pdf(pdf_bytes)

        if len(text.strip()) < 50:
            text = extract_text_with_ocr(pdf_bytes)

        text = clean_ocr_text(text)

        # Split clauses
        clauses = split_into_clauses(text)

        keywords = ["rent", "deposit", "lock-in", "termination", "penalty", "liability"]

        filtered_clauses = []

        for clause in clauses:
            clause_lower = clause.lower()

            if "agreement is made" in clause_lower:
                continue
            if "signature" in clause_lower:
                continue
            if len(clause.split()) < 6:
                continue

            if any(word in clause_lower for word in keywords):
                filtered_clauses.append(clause)

        # Analyze clauses
        results = []

        for clause in filtered_clauses:
            analysis = analyze_clause(clause)

            results.append({
                "clause": clause,
                "analysis": analysis
            })

        # Extract risky clauses
        risky_clauses = [
            r["clause"]
            for r in results
            if r["analysis"]["risk_type"] != "none"
        ]

        # Highlight PDF
        highlighted_pdf = highlight_clauses_in_pdf(pdf_bytes, risky_clauses)

        # ✅ FIX: always return .pdf filename
        safe_name = filename.rsplit(".", 1)[0] + ".pdf"

        return StreamingResponse(
            io.BytesIO(highlighted_pdf),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=highlighted_{safe_name}"
            }
        )
    
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# =========================
# 🧠 TEXT ANALYSIS (JSON ONLY)
# =========================
@router.post("/analyze")
def analyze_notice(data: dict):
    text = data.get("text", "")

    if not text:
        return {"error": "No text provided"}

    highlights = engine.extract_highlights(text)

    return {
        "status": "success",
        "highlights": highlights
    }
@router.post("/generate-notice")
def generate_notice_api(data: dict):
    issue = data.get("issue", "")

    if not issue:
        return {"error": "No issue provided"}

    notice_text = generate_notice(issue)

    return {
        "status": "success",
        "notice": notice_text
    }