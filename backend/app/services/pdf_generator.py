"""
📄 PROFESSIONAL LEGAL DOCUMENT PDF GENERATOR
==============================================

Uses ReportLab to generate professionally formatted PDFs that:
- Look like real legal documents
- Have proper typography and spacing
- Include headers, footers, and page numbers
- Are printable and signable
- Support special characters
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
import re


class LegalDocumentPDF:
    """Professional PDF generator for legal documents."""
    
    def __init__(self):
        self.pagesize = A4
        self.width, self.height = self.pagesize
        self.margins = 0.75 * inch
        self.styles = self._create_styles()
    
    def _create_styles(self):
        """Create custom styles for legal documents."""
        styles = getSampleStyleSheet()
        
        # Title style (LEGAL NOTICE)
        styles.add(ParagraphStyle(
            name='LegalTitle',
            parent=styles['Heading1'],
            fontSize=16,
            textColor='black',
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold',
            letterSpacing=2
        ))
        
        # Subject style
        styles.add(ParagraphStyle(
            name='Subject',
            parent=styles['Normal'],
            fontSize=12,
            textColor='black',
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Normal paragraph style (justified)
        styles.add(ParagraphStyle(
            name='BodyJustified',
            parent=styles['Normal'],
            fontSize=11,
            leading=16,
            alignment=TA_JUSTIFY,
            spaceAfter=10,
            textColor='#333333'
        ))
        
        # Numbered paragraph style
        styles.add(ParagraphStyle(
            name='NumberedPara',
            parent=styles['Normal'],
            fontSize=11,
            leading=16,
            leftIndent=0.5*inch,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
            textColor='#333333'
        ))
        
        # Header footer style
        styles.add(ParagraphStyle(
            name='HeaderFooter',
            parent=styles['Normal'],
            fontSize=9,
            textColor='#666666',
            alignment=TA_CENTER,
            spaceAfter=6
        ))
        
        # Signature block style
        styles.add(ParagraphStyle(
            name='SignatureBlock',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=4,
            textColor='black'
        ))
        
        return styles
    
    def _header_footer(self, canvas, doc):
        """Add header and footer to each page."""
        # Save current state
        canvas.saveState()
        
        # Footer
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor('#999999')
        canvas.drawString(
            self.margins,
            0.5 * inch,
            f"Generated on {datetime.now().strftime('%d %B %Y')}"
        )
        canvas.drawRightString(
            self.width - self.margins,
            0.5 * inch,
            f"Page {doc.page}"
        )
        
        # Restore state
        canvas.restoreState()
    
    def generate_pdf(self, notice_dict: dict) -> bytes:
        """
        Generate professional PDF from structured notice.
        
        Args:
            notice_dict: Dict with keys: header, to, from, date, subject, body, demand, signature
        
        Returns:
            PDF bytes
        """
        
        # Create PDF in memory
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4,
            rightMargin=self.margins,
            leftMargin=self.margins,
            topMargin=self.margins,
            bottomMargin=1.5*inch
        )
        
        # Build document content
        content = []
        
        # 1. Header - LEGAL NOTICE (centered, bold)
        content.append(Paragraph("LEGAL NOTICE", self.styles['LegalTitle']))
        content.append(Spacer(1, 0.2*inch))
        
        # 2. TO and FROM section
        to_text = notice_dict.get("to", "").replace("TO: ", "").strip()
        from_text = notice_dict.get("from", "").replace("FROM: ", "").strip()
        
        content.append(Paragraph(f"<b>To:</b> {to_text}", self.styles['BodyJustified']))
        content.append(Spacer(1, 0.1*inch))
        content.append(Paragraph(f"<b>From:</b> {from_text}", self.styles['BodyJustified']))
        content.append(Spacer(1, 0.2*inch))
        
        # 3. Date
        date_text = notice_dict.get("date", "").replace("Date: ", "").strip()
        content.append(Paragraph(f"<b>Date:</b> {date_text}", self.styles['BodyJustified']))
        content.append(Spacer(1, 0.2*inch))
        
        # 4. Subject
        subject_text = notice_dict.get("subject", "").replace("SUBJECT: ", "").strip()
        content.append(Paragraph(subject_text, self.styles['Subject']))
        content.append(Spacer(1, 0.2*inch))
        
        # 5. Body (numbered paragraphs)
        body_text = notice_dict.get("body", "")
        paragraphs = self._parse_numbered_paragraphs(body_text)
        
        for para in paragraphs:
            content.append(Paragraph(para, self.styles['NumberedPara']))
            content.append(Spacer(1, 0.05*inch))
        
        content.append(Spacer(1, 0.15*inch))
        
        # 6. Demand section
        demand_text = notice_dict.get("demand", "")
        content.append(Paragraph("<b>LEGAL DEMAND:</b>", self.styles['BodyJustified']))
        content.append(Spacer(1, 0.05*inch))
        
        # Split demand into paragraphs
        for para in demand_text.split("\n\n"):
            if para.strip():
                content.append(Paragraph(para.strip(), self.styles['BodyJustified']))
                content.append(Spacer(1, 0.1*inch))
        
        content.append(Spacer(1, 0.3*inch))
        
        # 7. Signature block
        signature_lines = [
            f"Date: {date_text}",
            "",
            "Place: _______________",
            "",
            "Signature: _______________",
            "",
            "Name: _______________"
        ]
        
        for line in signature_lines:
            content.append(Paragraph(line if line else "&nbsp;", self.styles['SignatureBlock']))
            content.append(Spacer(1, 0.08*inch))
        
        # Build PDF
        doc.build(content, onFirstPage=self._header_footer, onLaterPages=self._header_footer)
        
        pdf_buffer.seek(0)
        return pdf_buffer.getvalue()
    
    def _parse_numbered_paragraphs(self, text: str) -> list:
        """Parse numbered paragraphs from text."""
        
        # Split by pattern like "1.", "2.", etc.
        pattern = r'^\d+\.\s+'
        paragraphs = []
        
        lines = text.split('\n')
        current_para = ""
        
        for line in lines:
            stripped = line.strip()
            if stripped and re.match(pattern, stripped):
                if current_para:
                    paragraphs.append(current_para.strip())
                current_para = stripped
            elif stripped:
                current_para += " " + stripped
            elif current_para:
                paragraphs.append(current_para.strip())
                current_para = ""
        
        if current_para:
            paragraphs.append(current_para.strip())
        
        return paragraphs


# ============================================================
# CONVENIENCE FUNCTIONS
# ============================================================

def notice_to_pdf(notice_dict: dict) -> bytes:
    """Convert structured notice to professional PDF bytes."""
    generator = LegalDocumentPDF()
    return generator.generate_pdf(notice_dict)


def notice_text_to_pdf(notice_text: str) -> bytes:
    """Convert plain text notice to PDF (fallback)."""
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas as pdf_canvas
    from io import BytesIO
    
    buffer = BytesIO()
    c = pdf_canvas.Canvas(buffer, pagesize=letter)
    
    width, height = letter
    y = height - 1*inch
    
    c.setFont("Helvetica", 11)
    
    # Split into lines and wrap
    lines = notice_text.split('\n')
    for line in lines:
        if y < 1*inch:
            c.showPage()
            y = height - 1*inch
        
        c.drawString(1*inch, y, line)
        y -= 0.2*inch
    
    c.save()
    buffer.seek(0)
    return buffer.getvalue()
