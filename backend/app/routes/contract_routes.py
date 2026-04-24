# FILE: backend/app/routes/contract_routes.py
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import io

from app.schemas import APIResponse
from app.services.file_conversion_service import convert_to_pdf
from app.services.pdf_service import extract_text_from_pdf
from app.services.ocr_service import extract_text_with_ocr, clean_ocr_text
from app.services.chunk_service import split_into_clauses
from app.services.llm_service import analyze_clause, summarize_document, detect_document_type
from app.services.pdf_highlight_service import highlight_clauses_in_pdf
from app.services.highlight_engine import HighlightEngine

# CRITICAL FIX: Changed from "/contracts" to "/contract"
router = APIRouter(prefix="/contract", tags=["Contract Scanner"])

engine = HighlightEngine()

# =========================
# SCAN CONTRACT (JSON OUTPUT)
# =========================
# CRITICAL FIX: Changed from "/scan-contract" to "/scan"
@router.post("/scan", response_model=APIResponse)
async def scan_contract(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_file"

        # 1. Convert & Extract Text
        pdf_bytes = convert_to_pdf(file_bytes, filename)
        text = extract_text_from_pdf(pdf_bytes)

        if len(text.strip()) < 50:
            text = extract_text_with_ocr(pdf_bytes)

        text = clean_ocr_text(text)

        # 2. Document Level Context
        document_type = detect_document_type(text)
        summary_struct = summarize_document(text)

        summary_text = summary_struct.get("short_summary") if isinstance(summary_struct, dict) else str(summary_struct)
        important_points = summary_struct.get("important_points", []) if isinstance(summary_struct, dict) else []
        possible_risks = summary_struct.get("possible_risks", []) if isinstance(summary_struct, dict) else []

        # 3. Split & Filter Clauses
        clauses = split_into_clauses(text)
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

        # 4. Contextual Clause Analysis
        analysis_results = []
        for clause in filtered_clauses[:10]:
            analysis = analyze_clause(clause, doc_summary=summary_text) 
            analysis_results.append({
                "clause": clause,
                "analysis": analysis
            })

        # 5. Determine Risky Clauses for Highlighting
        risky_clauses = [
            r["clause"]
            for r in analysis_results
            if r["analysis"].get("risk_type") in ["financial", "restriction", "unfair"] or r["analysis"].get("severity") == "high"
        ]

        highlighted_pdf = highlight_clauses_in_pdf(pdf_bytes, risky_clauses)

        # 6. Standardized API Response
        return APIResponse(
            status="success",
            data={
                "filename": filename,
                "document_type": document_type,
                "summary": summary_text,
                "important_points": important_points,
                "possible_risks": possible_risks,
                "total_clauses_detected": len(filtered_clauses),
                "analysis_results": analysis_results,
                "highlighted_pdf_size": len(highlighted_pdf)
            },
            metadata={"model": "mistral", "processing_mode": "contextual"}
        )

    except Exception as e:
        return APIResponse(
            status="error",
            error=str(e),
            data={
                "filename": filename if 'filename' in locals() else "unknown",
                "document_type": "unknown",
                "summary": "Error processing document",
                "important_points": [],
                "possible_risks": [],
                "total_clauses_detected": 0,
                "analysis_results": [],
                "highlighted_pdf_size": 0
            }
        )

# =========================
# DOWNLOAD HIGHLIGHTED PDF
# =========================
# CRITICAL FIX: Changed from "/highlight-contract" to "/highlight"
@router.post("/highlight")
async def highlight_contract(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_file"

        pdf_bytes = convert_to_pdf(file_bytes, filename)
        text = extract_text_from_pdf(pdf_bytes)

        if len(text.strip()) < 50:
            text = extract_text_with_ocr(pdf_bytes)

        text = clean_ocr_text(text)
        
        summary_struct = summarize_document(text)
        summary_text = summary_struct.get("short_summary", "Unknown context")

        clauses = split_into_clauses(text)
        keywords = ["rent", "deposit", "lock-in", "termination", "penalty", "liability"]
        filtered_clauses = []

        for clause in clauses:
            clause_lower = clause.lower()
            if "agreement is made" in clause_lower or "signature" in clause_lower or len(clause.split()) < 6:
                continue
            if any(word in clause_lower for word in keywords):
                filtered_clauses.append(clause)

        results = []
        for clause in filtered_clauses:
            analysis = analyze_clause(clause, doc_summary=summary_text)
            results.append({
                "clause": clause,
                "analysis": analysis
            })

        risky_clauses = [
            r["clause"]
            for r in results
            if r["analysis"]["risk_type"] != "none"
        ]

        highlighted_pdf = highlight_clauses_in_pdf(pdf_bytes, risky_clauses)
        safe_name = filename.rsplit(".", 1)[0] + ".pdf"

        return StreamingResponse(
            io.BytesIO(highlighted_pdf),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=highlighted_{safe_name}"
            }
        )
    
    except Exception as e:
        return {"status": "error", "error": str(e)}

# =========================
# TEXT ANALYSIS (JSON ONLY)
# =========================
@router.post("/analyze", response_model=APIResponse)
def analyze_notice(data: dict):
    text = data.get("text", "")
    if not text:
        return APIResponse(status="error", error="No text provided")

    highlights = engine.extract_highlights(text)

    return APIResponse(
        status="success",
        data={"highlights": highlights}
    )