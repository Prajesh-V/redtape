import re

def split_into_clauses(text: str):
    """
    Merge OCR fragments into meaningful clauses
    """

    lines = text.split("\n")

    clauses = []
    current_clause = ""

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Detect new clause (strong signal)
        if line.isupper() and len(line.split()) <= 4:
            if current_clause:
                clauses.append(current_clause.strip())
            current_clause = line

        else:
            current_clause += " " + line
        if len(line.split()) < 3:   
            continue

    if current_clause:
        clauses.append(current_clause.strip())
    if re.match(r'^\d+\.', line):
        if current_clause:
            clauses.append(current_clause.strip())
        current_clause = line

    return clauses