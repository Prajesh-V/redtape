# pdf_highlight_service.py

import fitz  # PyMuPDF
from app.services.highlight_engine import HighlightEngine


class PDFHighlightService:
    def __init__(self):
        self.engine = HighlightEngine()

    def highlight_pdf(self, input_pdf, output_pdf, clauses=None):
        from app.services.ocr_service import extract_lines_with_boxes

        doc = fitz.open(input_pdf)

        # Extract text normally
        full_text = ""
        for page in doc:
            full_text += page.get_text()

        # =========================
        # CASE 1: IMAGE PDF (NO TEXT)
        # =========================
        if len(full_text.strip()) < 20:
            pdf_bytes = open(input_pdf, "rb").read()
            lines = extract_lines_with_boxes(pdf_bytes)

            if not clauses:
                doc.save(output_pdf)
                doc.close()
                return {"mode": "image_no_clauses"}

            for clause in clauses:
                clause_words = [
                    w for w in clause.lower().split()
                    if len(w) > 4
                ]

                for line in lines:
                    line_text = line["text"].lower()

                    match_count = sum(
                        1 for w in clause_words if w in line_text
                    )

                    # threshold: at least 2 meaningful words match
                    if match_count >= 2:
                        page = doc[line["page"]]
                        rect = fitz.Rect(line["bbox"])

                        annot = page.add_highlight_annot(rect)
                        annot.set_colors(stroke=(1, 1, 0))
                        annot.update()

            doc.save(output_pdf)
            doc.close()

            return {"mode": "ocr_line_highlight"}

        # =========================
        # CASE 2: TEXT PDF
        # =========================
        if clauses and len(clauses) > 0:
            targets = clauses
        else:
            highlights = self.engine.extract_highlights(full_text)
            targets = [h.get("clause", "") for h in highlights if h.get("clause")]

        def _search_target(page, target):
            if not target or len(target.strip()) < 8:
                return []

            rects = page.search_for(target)
            if rects:
                return rects

            # fallback: search by first strong fragment
            tokens = [w for w in target.split() if len(w) > 3]
            if len(tokens) >= 6:
                snippet = " ".join(tokens[:6])
                rects = page.search_for(snippet)
                if rects:
                    return rects

            # second fallback: any three consecutive key tokens
            for i in range(len(tokens) - 2):
                snippet = " ".join(tokens[i : i + 3])
                rects = page.search_for(snippet)
                if rects:
                    return rects

            return []

        for page in doc:
            for target in targets:
                instances = _search_target(page, target)

                for inst in instances:
                    annot = page.add_highlight_annot(inst)
                    annot.set_colors(stroke=(1, 1, 0))
                    annot.update()

        doc.save(output_pdf)
        doc.close()

        return {"mode": "text_highlight"}


# =========================
# WRAPPER FUNCTION
# =========================
def highlight_clauses_in_pdf(pdf_bytes, clauses):
    import tempfile

    service = PDFHighlightService()

    # Save input PDF
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_input:
        temp_input.write(pdf_bytes)
        input_path = temp_input.name

    # Output file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_output:
        output_path = temp_output.name

    # 🔥 PASS CLAUSES HERE (IMPORTANT)
    service.highlight_pdf(input_path, output_path, clauses)

    # Read output
    with open(output_path, "rb") as f:
        highlighted_pdf = f.read()

    return highlighted_pdf