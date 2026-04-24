import io
import img2pdf
from PIL import Image
from docx import Document


def convert_to_pdf(file_bytes: bytes, filename: str) -> bytes:
    """
    Converts supported file formats into PDF bytes.
    Supported formats:
    - PDF (no conversion)
    - Images (JPG, PNG)
    - DOCX
    """

    filename = filename.lower()

    # Already a PDF
    if filename.endswith(".pdf"):
        return file_bytes

    # Image → PDF
    if filename.endswith((".png", ".jpg", ".jpeg")):
        return img2pdf.convert(file_bytes)

    # DOCX → PDF (simple text rendering)
    if filename.endswith(".docx"):
        document = Document(io.BytesIO(file_bytes))

        text_content = "\n".join([para.text for para in document.paragraphs])

        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter

        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)

        y = 750
        for line in text_content.split("\n"):
            pdf.drawString(50, y, line)
            y -= 15

            if y < 50:
                pdf.showPage()
                y = 750

        pdf.save()

        return buffer.getvalue()

    raise ValueError("Unsupported file type")