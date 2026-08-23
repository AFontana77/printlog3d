"""Build the PrintLog3D filament settings cheat sheet PDF.

Source of truth is src/lib/materials.ts (MATERIAL_PROFILES). This script
parses that TypeScript file with a small hand-rolled scanner instead of
hand-retyping the data, so the PDF can never drift from the site.

Run with:
    py -3.11 scripts/build_cheatsheet.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# ---------------------------------------------------------------------------
# Paths - always derived, never a literal C:\... string (the \2 in
# "2 Areas" would otherwise become a 0x02 byte).
# ---------------------------------------------------------------------------
SCRIPT_PATH = Path(__file__).resolve()
PROJECT_ROOT = SCRIPT_PATH.parents[1]  # .../printlog3d
MATERIALS_TS = PROJECT_ROOT / "src" / "lib" / "materials.ts"
OUTPUT_PDF = PROJECT_ROOT / "public" / "printlog3d-filament-settings-cheat-sheet.pdf"

EXPECTED_MATERIAL_COUNT = 17

# ---------------------------------------------------------------------------
# Colors / layout constants
# ---------------------------------------------------------------------------
VIOLET = colors.HexColor("#5B21B6")
LIGHT_VIOLET = colors.HexColor("#F5F3FB")
GRID_GRAY = colors.HexColor("#CBD5E1")
MUTED_GRAY = colors.HexColor("#5B5B66")
BLACK = colors.black
WHITE = colors.white
DEGREE = "\u00b0"  # written as an escape so this source file stays pure ASCII

PAGE_W, PAGE_H = LETTER
MARGIN_LEFT = 36
MARGIN_RIGHT = 36
MARGIN_TOP = 40
MARGIN_BOTTOM = 56
CONTENT_WIDTH = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT

FOOTER_LINE1 = "printlog3d.com"
FOOTER_LINE2 = (
    "Typical manufacturer-published ranges for each material class. "
    "Not measurements we took. Always check your filament maker's own figures."
)

# ---------------------------------------------------------------------------
# Minimal TypeScript object-literal parser for MATERIAL_PROFILES.
# Deliberately not a general TS parser -- just enough bracket/string
# tracking to split the array into per-material blocks and pull fields
# back out with regexes, so the data can never be hand-retyped.
# ---------------------------------------------------------------------------


def _extract_array_body(source: str) -> str:
    """Return the raw text strictly between the array's [ and matching ]."""
    marker = "export const MATERIAL_PROFILES: MaterialProfile[] = ["
    marker_pos = source.index(marker)
    start = marker_pos + len(marker)
    depth = 1  # already inside the opening [
    i = start
    in_string = False
    quote_char = ""
    while i < len(source):
        ch = source[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == quote_char:
                in_string = False
            i += 1
            continue
        if ch == "'" or ch == '"':
            in_string = True
            quote_char = ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return source[start:i]
        i += 1
    raise ValueError("Unterminated MATERIAL_PROFILES array literal in materials.ts")


def _split_top_level_objects(array_body: str) -> list[str]:
    """Split the array body into the raw text of each top-level {...} object."""
    objects: list[str] = []
    depth = 0
    start = None
    in_string = False
    quote_char = ""
    i = 0
    while i < len(array_body):
        ch = array_body[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == quote_char:
                in_string = False
            i += 1
            continue
        if ch == "'" or ch == '"':
            in_string = True
            quote_char = ch
        elif ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(array_body[start : i + 1])
                start = None
        i += 1
    return objects


def _unescape(raw: str) -> str:
    return raw.replace(r"\'", "'").replace(r"\"", '"').replace("\\\\", "\\")


def _get_string_field(obj_text: str, key: str) -> str:
    pattern = re.escape(key) + r":\s*'((?:[^'\\]|\\.)*)'"
    m = re.search(pattern, obj_text)
    if not m:
        raise ValueError(f"Missing or unparseable string field '{key}'")
    return _unescape(m.group(1))


def _get_bool_field(obj_text: str, key: str) -> bool:
    pattern = re.escape(key) + r":\s*(true|false)"
    m = re.search(pattern, obj_text)
    if not m:
        raise ValueError(f"Missing or unparseable bool field '{key}'")
    return m.group(1) == "true"


REQUIRED_STRING_FIELDS = [
    "category",
    "printTempC",
    "bedTempC",
    "enclosure",
    "coolingFan",
    "drying",
    "commonProblem",
]


def parse_materials(ts_source: str) -> list[dict]:
    array_body = _extract_array_body(ts_source)
    blocks = _split_top_level_objects(array_body)
    materials = []
    for block in blocks:
        record = {field: _get_string_field(block, field) for field in REQUIRED_STRING_FIELDS}
        record["needsDrying"] = _get_bool_field(block, "needsDrying")
        materials.append(record)
    return materials


# ---------------------------------------------------------------------------
# Condensing helpers for the settings table. These only reformat text that
# already exists in materials.ts -- they never invent a number.
# ---------------------------------------------------------------------------

DRY_RE = re.compile(r"Dry at (\d+(?:-\d+)?C) for ((?:at least )?\d+(?:-\d+)? hours?)")


def condense_dry(drying_text: str, needs_drying: bool) -> str:
    m = DRY_RE.search(drying_text)
    if not m:
        return "See notes" if needs_drying else "Not required"
    temp, duration = m.group(1), m.group(2)
    duration = duration.replace(" hours", "h").replace(" hour", "h")
    cell = f"{temp} / {duration}"
    if not needs_drying:
        cell += " (opt.)"
    return cell


def condense_cooling(text: str) -> str:
    pct_match = re.search(r"\d+-?\d*%", text)
    if text.startswith("No"):
        return "No / low" if "very low" in text.lower() else "No"
    if text.startswith("Minimal"):
        return "Minimal"
    if pct_match:
        return f"Yes ({pct_match.group(0)})"
    if "low" in text.lower():
        return "Yes (low)"
    return "Yes"


def first_sentence(text: str) -> str:
    m = re.match(r"(.+?[.!?])(\s|$)", text.strip())
    return m.group(1) if m else text.strip()


# ---------------------------------------------------------------------------
# Layout safety check - fail loudly instead of silently overflowing a cell.
# Only used for the settings table, whose cells are plain (non-wrapping)
# strings; the problem table uses wrapping Paragraph cells instead.
# ---------------------------------------------------------------------------


def _assert_single_line_fits(text: str, font_name: str, font_size: float, max_width_pt: float, column_label: str) -> None:
    width = stringWidth(text, font_name, font_size)
    if width > max_width_pt:
        raise RuntimeError(
            f"Layout overflow in column '{column_label}': a cell is {len(text)} chars "
            f"({width:.1f}pt) but the column budget is only {max_width_pt:.1f}pt. "
            "Widen the column or shorten the condensing logic."
        )


# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------


def build_styles() -> dict:
    return {
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=20, leading=23, textColor=VIOLET,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Helvetica", fontSize=10, leading=13, textColor=MUTED_GRAY,
        ),
        "section": ParagraphStyle(
            "section", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=VIOLET,
            spaceAfter=4,
        ),
        "section_note": ParagraphStyle(
            "section_note", fontName="Helvetica", fontSize=8.5, leading=11, textColor=MUTED_GRAY,
            spaceAfter=10,
        ),
        "problem_text": ParagraphStyle(
            "problem_text", fontName="Helvetica", fontSize=8.3, leading=10.2, textColor=BLACK,
        ),
    }


# ---------------------------------------------------------------------------
# Table builders
# ---------------------------------------------------------------------------

SETTINGS_HEADERS = ["Material", f"Nozzle {DEGREE}C", f"Bed {DEGREE}C", "Enclosure", "Part cooling", "Dry at"]
SETTINGS_COL_WIDTHS = [88, 62, 58, 82, 90, 160]  # sums to 540pt = CONTENT_WIDTH

PROBLEM_HEADERS = ["Material", "What goes wrong"]
PROBLEM_COL_WIDTHS = [85, 455]  # sums to 540pt = CONTENT_WIDTH


def build_settings_table(materials: list[dict]) -> Table:
    data = [SETTINGS_HEADERS]
    left_pad, right_pad = 6, 6
    for m in materials:
        row = [
            m["category"],
            m["printTempC"],
            m["bedTempC"],
            m["enclosure"],
            condense_cooling(m["coolingFan"]),
            condense_dry(m["drying"], m["needsDrying"]),
        ]
        for col_idx, (value, width) in enumerate(zip(row, SETTINGS_COL_WIDTHS)):
            font = "Helvetica-Bold" if col_idx == 0 else "Helvetica"
            _assert_single_line_fits(value, font, 9, width - left_pad - right_pad, SETTINGS_HEADERS[col_idx])
        data.append(row)

    table = Table(data, colWidths=SETTINGS_COL_WIDTHS, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), VIOLET),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9.5),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (0, 1), (0, -1), VIOLET),
                ("ALIGN", (0, 0), (0, -1), "LEFT"),
                ("ALIGN", (1, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), left_pad),
                ("RIGHTPADDING", (0, 0), (-1, -1), right_pad),
                ("GRID", (0, 0), (-1, -1), 0.5, GRID_GRAY),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_VIOLET]),
            ]
        )
    )
    return table


def build_problem_table(materials: list[dict], styles: dict, use_full_text: bool) -> Table:
    data = [PROBLEM_HEADERS]
    for m in materials:
        text = m["commonProblem"] if use_full_text else first_sentence(m["commonProblem"])
        data.append([m["category"], Paragraph(text, styles["problem_text"])])

    table = Table(data, colWidths=PROBLEM_COL_WIDTHS, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), VIOLET),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9.5),
                ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
                ("TEXTCOLOR", (0, 1), (0, -1), VIOLET),
                ("FONTSIZE", (0, 1), (0, -1), 9),
                ("ALIGN", (0, 0), (0, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, GRID_GRAY),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_VIOLET]),
            ]
        )
    )
    return table


def _footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GRID_GRAY)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN_LEFT, 46, PAGE_W - MARGIN_RIGHT, 46)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(VIOLET)
    canvas.drawString(MARGIN_LEFT, 34, FOOTER_LINE1)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED_GRAY)
    canvas.drawString(MARGIN_LEFT, 23, FOOTER_LINE2)
    canvas.restoreState()


def build_pdf(materials: list[dict], use_full_problem_text: bool) -> None:
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=LETTER,
        leftMargin=MARGIN_LEFT,
        rightMargin=MARGIN_RIGHT,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title="3D Printing Filament Settings - printlog3d.com",
        author="printlog3d.com",
    )

    story = []
    story.append(Paragraph("3D Printing Filament Settings", styles["title"]))
    story.append(Paragraph("printlog3d.com", styles["subtitle"]))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width=CONTENT_WIDTH, thickness=1.2, color=VIOLET, spaceAfter=14))
    story.append(build_settings_table(materials))

    story.append(PageBreak())
    story.append(Paragraph("What Goes Wrong (and Why)", styles["section"]))
    story.append(Paragraph("The problem you are most likely to hit with each material, and why it happens.", styles["section_note"]))
    story.append(build_problem_table(materials, styles, use_full_problem_text))

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)


# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------


def verify_pdf() -> int:
    from pypdf import PdfReader

    if not OUTPUT_PDF.exists():
        raise RuntimeError("Output PDF was not created")
    size = OUTPUT_PDF.stat().st_size
    if size <= 5000:
        raise RuntimeError(f"Output PDF is too small: {size} bytes")

    reader = PdfReader(str(OUTPUT_PDF))
    page_count = len(reader.pages)
    if page_count == 2:
        page1_text = reader.pages[0].extract_text() or ""
        required_tokens = ["PEEK", "PLA", "PETG", "370-420"]
        missing = [token for token in required_tokens if token not in page1_text]
        if missing:
            raise RuntimeError(f"Page 1 text is missing {len(missing)} required token(s)")
    return page_count


def main() -> None:
    if not MATERIALS_TS.exists():
        raise RuntimeError("materials.ts not found at expected path")

    ts_source = MATERIALS_TS.read_text(encoding="utf-8")
    materials = parse_materials(ts_source)

    if len(materials) != EXPECTED_MATERIAL_COUNT:
        raise RuntimeError(
            f"Expected exactly {EXPECTED_MATERIAL_COUNT} materials, parsed {len(materials)}. "
            "Refusing to build a cheat sheet with drifted data."
        )
    print(f"Parsed {len(materials)} materials from materials.ts (expected {EXPECTED_MATERIAL_COUNT}: OK)")

    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)

    page_count = None
    for attempt_num, use_full in enumerate([True, False], start=1):
        build_pdf(materials, use_full_problem_text=use_full)
        page_count = verify_pdf()
        print(f"Attempt {attempt_num}: full_problem_text={use_full} -> page_count={page_count}")
        if page_count == 2:
            break

    if page_count != 2:
        raise RuntimeError(f"Could not fit content into exactly 2 pages (got {page_count})")

    size = OUTPUT_PDF.stat().st_size
    print(f"OK: wrote {size} bytes, {page_count} pages, {len(materials)} materials")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"BUILD FAILED: {type(exc).__name__}: {exc}", file=sys.stderr)
        sys.exit(1)
