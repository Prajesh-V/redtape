from pdf2image import convert_from_bytes
import pytesseract
from pytesseract import Output
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
import re

def clean_ocr_text(text: str) -> str:
    """
    Advanced OCR cleanup + structure normalization
    """

    # Normalize spacing
    text = re.sub(r'\s+', ' ', text)

    # Fix common OCR mistakes
    text = text.replace("INR.", "INR ")
    text = text.replace("lNR", "INR")
    text = text.replace("0f", "of")

    # Fix broken words (optional but helpful)
    text = text.replace("complishes", "comprises")
    text = text.replace("securitary", "security")

    keywords = [
        "RENT",
        "SECURITY DEPOSIT",
        "LOCK-IN PERIOD",
        "LOCK IN PERIOD",
        "TERMINATION"
    ]

    for word in keywords:
        text = re.sub(
            rf'\b{word}\b',
            f'\n{word}\n',
            text,
            count=1, 
            flags=re.IGNORECASE
        )

    # Remove duplicate newlines
    text = re.sub(r'\n+', '\n', text)

    return text.strip()

def extract_text_with_ocr(pdf_bytes: bytes) -> str:
    """
    Runs OCR on a PDF if normal text extraction fails.
    """

    images = convert_from_bytes(pdf_bytes)

    extracted_text = ""

    for image in images:
        text = pytesseract.image_to_string(image)
        extracted_text += text + "\n"

    return extracted_text
def extract_text_with_boxes(pdf_bytes: bytes):
    """
    Extracts OCR text WITH bounding boxes
    """

    from pdf2image import convert_from_bytes

    images = convert_from_bytes(pdf_bytes)

    all_words = []

    for page_num, image in enumerate(images):
        data = pytesseract.image_to_data(image, output_type=Output.DICT)

        for i in range(len(data["text"])):
            word = data["text"][i].strip()

            if not word:
                continue

            x = data["left"][i]
            y = data["top"][i]
            w = data["width"][i]
            h = data["height"][i]

            all_words.append({
                "word": word,
                "bbox": (x, y, x + w, y + h),
                "page": page_num
            })

    return all_words
from pytesseract import Output

def extract_lines_with_boxes(pdf_bytes: bytes):
    from pdf2image import convert_from_bytes

    images = convert_from_bytes(pdf_bytes)
    all_lines = []

    for page_num, image in enumerate(images):
        data = pytesseract.image_to_data(image, output_type=Output.DICT)

        lines = {}

        for i in range(len(data["text"])):
            text = data["text"][i].strip()
            if not text:
                continue

            line_num = data["line_num"][i]

            x = data["left"][i]
            y = data["top"][i]
            w = data["width"][i]
            h = data["height"][i]

            if line_num not in lines:
                lines[line_num] = {
                    "text": text,
                    "bbox": [x, y, x + w, y + h],
                    "page": page_num
                }
            else:
                lines[line_num]["text"] += " " + text

                # expand bounding box
                bx0, by0, bx1, by1 = lines[line_num]["bbox"]
                lines[line_num]["bbox"] = [
                    min(bx0, x),
                    min(by0, y),
                    max(bx1, x + w),
                    max(by1, y + h)
                ]

        all_lines.extend(lines.values())

    return all_lines