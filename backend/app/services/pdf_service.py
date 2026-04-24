import fitz
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import io

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from a PDF using PyMuPDF
    """

    text_content = ""

    with fitz.open(stream=pdf_bytes, filetype="pdf") as document:

        for page_number in range(len(document)):
            page = document.load_page(page_number)
            text_content += page.get_text()

    return text_content



def text_to_pdf(text: str) -> bytes:
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    content = []

    for line in text.split("\n"):
        content.append(Paragraph(line, styles["Normal"]))

    doc.build(content)

    return buffer.getvalue()