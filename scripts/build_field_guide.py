# -*- coding: utf-8 -*-
"""Build the PrintLog3D Filament Settings Field Guide.

WHY THIS FILE EXISTS
--------------------
The shipped guide was produced by a script that could not be recovered. M1.7
searched every git ref, dangling objects, branches, the repo, portfolio tooling,
orchestration and Downloads; the only ReportLab script referencing the guide is
the retired cheat-sheet builder, which produces a different two-page design and
carries a do-not-run warning.

So the artefact itself became the specification. Every constant below was
MEASURED out of the shipped PDF with pdfplumber and PyMuPDF -- page geometry,
table rects, row pitch, column centres, type sizes, weights and colours -- rather
than approximated by eye. The Lato faces are extracted from the PDF's own
embedded subsets, so the rebuild uses the exact faces the original used and
nothing was downloaded.

WHAT IS REGENERATED AND WHAT IS PRESERVED
-----------------------------------------
The cover and the print-log worksheet are static design and are COPIED from the
original file, not redrawn, so they remain byte-identical artwork. Only two
strings on them are patched: the baked-in material count on the cover, and the
worksheet's page label.

The matrix and failure-mode pages are data pages, so they are regenerated from
`materials.ts` -- which is the point of the exercise. The PDF can no longer drift
away from the site, because it is built from the same source the site renders.

PAGE COUNT
----------
The original is four pages and 17 materials. 31 materials do not fit that
geometry: the matrix uses a 29pt row pitch and the failure grid a 61pt card
pitch, both of which would have to be roughly halved. That would mean ~3.5pt
type in a printed reference read at a workbench.

So the two data sections each gain one page, at IDENTICAL geometry, and the
guide becomes six pages. Preserving a page count by making the content
unreadable would defeat the purpose of the asset.

    py -3.11 scripts/build_field_guide.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import fitz
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as rl_canvas

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from field_guide_cards import card_for  # noqa: E402
from field_guide_data import (  # noqa: E402
    accent_for,
    cooling_cell,
    drying_cell,
    enclosure_cell,
    load_materials,
    needs_oven,
)

ROOT = HERE.parent
# The 17-material original, kept as the artwork source for the two preserved
# pages. The builder must never read its own output, or a second run would
# copy already-patched pages and compound the edits.
SOURCE_PDF = HERE / "_original-field-guide-17-material.pdf"
OUTPUT_PDF = ROOT / "public" / "PrintLog3D-Filament-Settings-Field-Guide.pdf"
FONT_DIR = HERE / "fonts"

# --------------------------------------------------------------------------
# Measured design constants. Do not adjust without re-measuring the source.
# --------------------------------------------------------------------------
PAGE_W, PAGE_H = 612.0, 792.0
MARGIN = 36.0
HEADER_H = 52.0

INK = Color(0.070588, 0.078431, 0.090196)        # #121417
SLATE = Color(0.164706, 0.176471, 0.2)           # #2A2D33
BODY = Color(0.419608, 0.439216, 0.466667)       # #6B7077
MUTED = Color(0.654902, 0.674510, 0.701961)      # #A7ACB3
PALE = Color(0.823529, 0.847059, 0.882353)       # #D2D8E1
ROW_ALT = Color(0.949020, 0.956863, 0.968627)    # #F2F4F7
BLUE = Color(0.0, 0.4, 1.0)                      # #0066FF
ORANGE = Color(1.0, 0.415686, 0.0)               # #FF6A00
WHITE = Color(1, 1, 1)

TABLE_X0, TABLE_X1 = 36.0, 502.0
ROW_H = 29.0
COL_MATERIAL_X = 45.0
COL_NOZZLE_C = 144.5
COL_BED_C = 199.0
COL_ENCL_C = 264.0
COL_COOL_C = 340.0
COL_DRY_C = 443.0

CARD_W = 264.0
CARD_H = 52.0
CARD_PITCH = 61.0
CARD_COL_X = (36.0, 312.0)
CARDS_PER_PAGE = 18

FONTS = {
    "heavy": "Lato-Heavy",
    "bold": "Lato-Bold",
    "semi": "Lato-Semibold",
    "med": "Lato-Medium",
    "reg": "Lato-Regular",
}


def register_fonts() -> None:
    for f in FONTS.values():
        path = FONT_DIR / (f + ".ttf")
        if not path.is_file():
            raise SystemExit(
                "Missing %s. The Lato subsets are extracted from the source PDF; "
                "see the M1.7 report." % path
            )
        pdfmetrics.registerFont(TTFont(f, str(path)))


def y(top: float) -> float:
    """Convert a top-down coordinate (how the source was measured) to PDF space."""
    return PAGE_H - top


def centred(c, text, cx, top, font, size, color):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawCentredString(cx, y(top + size * 0.78), text)


def left(c, text, x, top, font, size, color):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y(top + size * 0.78), text)


def right(c, text, x, top, font, size, color):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawRightString(x, y(top + size * 0.78), text)


LOCKUP_W = 300.0
_LOCKUP_CACHE = HERE / "_header-lockup.png"


def ensure_lockup() -> Path:
    """Lift the header lockup out of the original as artwork.

    The mark is a detailed hexagonal printer icon. Redrawing it from primitives
    produced a plain blue rectangle, which is the single most obvious tell that
    a page was rebuilt by a different hand. Capturing it guarantees the branding
    on the regenerated pages is the branding on the preserved ones.

    Only the left 300pt is taken; the per-page section labels live beyond x=465
    and are drawn as text.
    """
    if _LOCKUP_CACHE.is_file():
        return _LOCKUP_CACHE
    src = fitz.open(str(SOURCE_PDF))
    pix = src[1].get_pixmap(clip=fitz.Rect(0, 0, LOCKUP_W, HEADER_H), dpi=600)
    pix.save(str(_LOCKUP_CACHE))
    src.close()
    return _LOCKUP_CACHE


def draw_header(c, section_label: str, page_no: str) -> None:
    c.setFillColor(INK)
    c.rect(0, y(HEADER_H), PAGE_W, HEADER_H, stroke=0, fill=1)
    c.drawImage(str(ensure_lockup()), 0, y(HEADER_H), width=LOCKUP_W, height=HEADER_H,
                mask=None)

    right(c, section_label, PAGE_W - MARGIN, 25.0, FONTS["semi"], 8.0, MUTED)
    right(c, "FIELD GUIDE  /  %s" % page_no, PAGE_W - MARGIN, 38.0, FONTS["med"], 6.5, MUTED)


def draw_footer(c, centre_text: str) -> None:
    c.setStrokeColor(PALE)
    c.setLineWidth(0.5)
    c.line(MARGIN, y(762.0), PAGE_W - MARGIN, y(762.0))
    left(c, "PRINTLOG3D.COM", MARGIN, 770.0, FONTS["semi"], 6.5, BODY)
    centred(c, centre_text, PAGE_W / 2, 770.0, FONTS["med"], 6.5, BODY)
    right(c, "LOG IT. LEARN IT. PRINT BETTER.", PAGE_W - MARGIN, 770.0, FONTS["semi"], 6.5, BLUE)


def draw_title(c, title: str, subtitle: str) -> None:
    left(c, title, MARGIN, 69.0, FONTS["heavy"], 23.0, INK)
    left(c, subtitle, MARGIN, 97.0, FONTS["reg"], 9.5, BODY)


def pill(c, text, x, top, fill, text_color, font=None, size=6.5, outline=None):
    font = font or FONTS["semi"]
    tw = pdfmetrics.stringWidth(text, font, size)
    w = tw + 14
    c.setFillColor(fill)
    if outline is not None:
        c.setStrokeColor(outline)
        c.setLineWidth(0.7)
        c.roundRect(x, y(top + 11), w, 12.5, 6, stroke=1, fill=1)
    else:
        c.roundRect(x, y(top + 11), w, 12.5, 6, stroke=0, fill=1)
    centred(c, text, x + w / 2, top - 0.6, font, size, text_color)
    return w


def draw_legend(c, top: float) -> None:
    x = MARGIN
    x += pill(c, "NO ENCLOSURE", x, top, Color(0.918, 0.945, 1.0), BLUE) + 6
    x += pill(c, "ENCLOSURE REQUIRED", x, top, Color(0.906, 0.918, 0.933), SLATE) + 6
    pill(c, "DRYING GUIDANCE", x, top, Color(1.0, 0.949, 0.910), ORANGE)


def matrix_page(c, materials, page_no: str, title: str, subtitle: str, callout: bool) -> None:
    draw_header(c, "FILAMENT SETTINGS MATRIX", page_no)
    draw_title(c, title, subtitle)
    draw_legend(c, 125.0)

    head_top = 146.0
    c.setFillColor(INK)
    c.roundRect(TABLE_X0, y(head_top + ROW_H), TABLE_X1 - TABLE_X0, ROW_H, 4, stroke=0, fill=1)
    c.setFillColor(INK)
    c.rect(TABLE_X0, y(head_top + ROW_H), TABLE_X1 - TABLE_X0, ROW_H / 2, stroke=0, fill=1)

    hy = head_top + 9.5
    left(c, "MATERIAL", 59.4, hy, FONTS["bold"], 6.7, WHITE)
    centred(c, "NOZZLE C", COL_NOZZLE_C, hy, FONTS["bold"], 6.7, WHITE)
    centred(c, "BED C", COL_BED_C, hy, FONTS["bold"], 6.7, WHITE)
    centred(c, "ENCLOSURE", COL_ENCL_C, hy, FONTS["bold"], 6.7, WHITE)
    centred(c, "PART COOLING", COL_COOL_C, hy, FONTS["bold"], 6.7, WHITE)
    centred(c, "DRY AT", COL_DRY_C, hy, FONTS["bold"], 6.7, WHITE)

    top = head_top + ROW_H
    for i, m in enumerate(materials):
        c.setFillColor(WHITE if i % 2 == 0 else ROW_ALT)
        c.rect(TABLE_X0, y(top + ROW_H), TABLE_X1 - TABLE_X0, ROW_H, stroke=0, fill=1)

        accent = accent_for(m)
        c.setFillColor({"blue": BLUE, "orange": ORANGE, "slate": PALE}[accent])
        c.rect(TABLE_X0, y(top + ROW_H), 3.0, ROW_H, stroke=0, fill=1)

        ty = top + 10.0
        # PEI is also the name of a build-plate surface, and this guide uses it
        # that way in prose. The trade name disambiguates without inventing one.
        label_name = "PEI (ULTEM)" if m.category == "PEI" else m.category
        left(c, label_name, COL_MATERIAL_X, ty - 0.8, FONTS["bold"], 8.1, INK)
        centred(c, m.nozzle, COL_NOZZLE_C, ty, FONTS["semi"], 7.7, INK)
        centred(c, m.bed, COL_BED_C, ty, FONTS["semi"], 7.7, INK)

        label, style = enclosure_cell(m)
        if style == "required":
            tw = pdfmetrics.stringWidth(label, FONTS["bold"], 6.5)
            c.setFillColor(Color(0.906, 0.918, 0.933))
            c.roundRect(COL_ENCL_C - (tw + 16) / 2, y(ty + 10.6), tw + 16, 13.0, 6.5, stroke=0, fill=1)
            centred(c, label, COL_ENCL_C, ty - 0.4, FONTS["bold"], 6.5, SLATE)
        elif style == "recommended":
            tw = pdfmetrics.stringWidth(label, FONTS["bold"], 6.5)
            c.setFillColor(WHITE)
            c.setStrokeColor(ORANGE)
            c.setLineWidth(0.7)
            c.roundRect(COL_ENCL_C - (tw + 16) / 2, y(ty + 10.6), tw + 16, 13.0, 6.5, stroke=1, fill=1)
            centred(c, label, COL_ENCL_C, ty - 0.4, FONTS["bold"], 6.5, ORANGE)
        else:
            centred(c, label, COL_ENCL_C, ty, FONTS["med"], 7.0, BODY)

        centred(c, cooling_cell(m), COL_COOL_C, ty, FONTS["med"], 7.1, INK)
        centred(c, drying_cell(m), COL_DRY_C, ty, FONTS["med"], 7.0,
                ORANGE if needs_oven(m) else INK)
        top += ROW_H

    oven = [m.category for m in materials if needs_oven(m)]
    if oven:
        note_top = top + 12
        c.setFillColor(ORANGE)
        c.circle(MARGIN + 4, y(note_top + 4), 2.6, stroke=0, fill=1)
        left(c, "A FILAMENT DRYER CANNOT DO THESE: %s" % ", ".join(oven),
             MARGIN + 12, note_top, FONTS["bold"], 7.0, ORANGE)
        left(c,
             "Domestic dryers stop near 90C. These need a high-temperature oven with a thermostat you have verified.",
             MARGIN + 12, note_top + 10, FONTS["reg"], 6.5, BODY)
        top = note_top + 12

    if callout:
        box_top = top + 14
        c.setFillColor(Color(0.965, 0.976, 1.0))
        c.setStrokeColor(Color(0.851, 0.894, 0.973))
        c.setLineWidth(0.7)
        c.roundRect(MARGIN, y(box_top + 52), PAGE_W - 2 * MARGIN, 52, 6, stroke=1, fill=1)
        centred(c, "!", MARGIN + 24, box_top + 16, FONTS["heavy"], 13.0, ORANGE)
        left(c, 'IMPORTANT: RANGE DOES NOT MEAN "BEST SETTING"', MARGIN + 44, box_top + 12,
             FONTS["bold"], 8.0, INK)
        left(c, "Printer geometry, filament brand, moisture, part design, and environment can change the useful setting.",
             MARGIN + 44, box_top + 25, FONTS["reg"], 6.5, BODY)
        left(c, "Use this matrix to choose a safe starting range, then log the result on your own machine.",
             MARGIN + 44, box_top + 35, FONTS["reg"], 6.5, BODY)


def wrap(text: str, font: str, size: float, width: float, max_lines: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if pdfmetrics.stringWidth(trial, font, size) <= width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
            if len(lines) == max_lines:
                break
    if cur and len(lines) < max_lines:
        lines.append(cur)
    return lines[:max_lines]


def failure_page(c, entries, page_no: str, title: str, subtitle: str, callout: bool) -> None:
    draw_header(c, "WHAT GOES WRONG AND WHY", page_no)
    draw_title(c, title, subtitle)

    per_col = (len(entries) + 1) // 2
    for idx, (m, headline, bodytext) in enumerate(entries):
        col = 0 if idx < per_col else 1
        row = idx if col == 0 else idx - per_col
        x = CARD_COL_X[col]
        top = 145.0 + row * CARD_PITCH

        c.setFillColor(WHITE)
        c.setStrokeColor(Color(0.898, 0.910, 0.929))
        c.setLineWidth(0.7)
        c.roundRect(x, y(top + CARD_H), CARD_W, CARD_H, 5, stroke=1, fill=1)

        c.setFillColor(ORANGE if accent_for(m) == "orange" else BLUE)
        c.rect(x, y(top + CARD_H - 3), 3.0, CARD_H - 6, stroke=0, fill=1)

        pill_name = "PEI (ULTEM)" if m.category == "PEI" else m.category
        tw = pdfmetrics.stringWidth(pill_name, FONTS["semi"], 6.5)
        c.setFillColor(Color(0.918, 0.945, 1.0))
        c.roundRect(x + 12, y(top + 19), max(tw + 16, 58), 12.5, 6, stroke=0, fill=1)
        centred(c, pill_name, x + 12 + max(tw + 16, 58) / 2, top + 8.4, FONTS["semi"], 6.5, BLUE)

        left(c, headline, x + 12 + max(tw + 16, 58) + 10, top + 8.4, FONTS["bold"], 7.6, INK)

        for li, line in enumerate(wrap(bodytext, FONTS["reg"], 6.5, CARD_W - 26, 2)):
            left(c, line, x + 12, top + 27 + li * 9.6, FONTS["reg"], 6.5, BODY)

    if callout:
        box_top = 704.0
        c.setFillColor(INK)
        c.roundRect(MARGIN, y(box_top + 44), PAGE_W - 2 * MARGIN, 44, 6, stroke=0, fill=1)
        left(c, "THE GOAL IS NOT TO MEMORIZE FIXES. BUILD A REPEATABLE HISTORY.",
             MARGIN + 16, box_top + 10, FONTS["bold"], 8.0, WHITE)
        left(c, "Record the setting, the failure, the change, and the result on the print log.",
             MARGIN + 16, box_top + 24, FONTS["reg"], 6.5, MUTED)
        right(c, "PRINTLOG3D.COM", PAGE_W - MARGIN - 16, box_top + 24, FONTS["semi"], 6.5, BLUE)


def build_new_pages(materials, tmp: Path) -> None:
    c = rl_canvas.Canvas(str(tmp), pagesize=(PAGE_W, PAGE_H))

    split = 17  # keeps page 02 identical in content to the shipped asset
    first, second = materials[:split], materials[split:]

    matrix_page(
        c, first, "02", "%d-MATERIAL SETTINGS MATRIX" % len(materials),
        "Typical published ranges at a glance. Use the material maker as the final authority.",
        callout=True,
    )
    draw_footer(c, "%d MATERIALS. ONE SETTINGS REFERENCE." % len(materials))
    c.showPage()

    matrix_page(
        c, second, "03", "SETTINGS MATRIX, CONTINUED",
        "Flexibles, supports, composites and the high-temperature engineering grades.",
        callout=True,
    )
    draw_footer(c, "%d MATERIALS. ONE SETTINGS REFERENCE." % len(materials))
    c.showPage()

    cards = [(m, *card_for(m.category)) for m in materials if card_for(m.category)]
    a, b = cards[:CARDS_PER_PAGE], cards[CARDS_PER_PAGE:]

    failure_page(
        c, a, "04", "FAILURE MODES: THE FIRST THING TO CHECK",
        "The most common problem called out for each material in the source guide - tightened into field-note format.",
        callout=True,
    )
    draw_footer(c, "FAILURE NOTES INCLUDED. LOG WHAT WORKS.")
    c.showPage()

    failure_page(
        c, b, "05", "FAILURE MODES, CONTINUED",
        "Flexibles, supports, composites and the high-temperature grades.",
        callout=True,
    )
    draw_footer(c, "FAILURE NOTES INCLUDED. LOG WHAT WORKS.")
    c.showPage()

    c.save()


def patch_text(page, needle: str, replacement: str, font_size: float, fontfile: Path,
               color, align_right: bool = False, fill=(1, 1, 1)) -> bool:
    """Replace a string in a copied page, keeping the original typography.

    Used only for the two baked-in strings on the pages that are preserved as
    artwork: the cover's material count and the worksheet's page label.
    """
    hits = page.search_for(needle)
    if not hits:
        return False
    r = hits[0]
    # Fill with the ground the text actually sits on. The cover is dark, and a
    # white redaction box on it was visible from across the room.
    page.add_redact_annot(r, fill=fill)
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
    page.insert_font(fontname="F0", fontfile=str(fontfile))
    # Measure with ReportLab, which already has this exact file registered.
    # fitz.get_text_length only knows its own base-14 names.
    if align_right:
        width = pdfmetrics.stringWidth(replacement, fontfile.stem, font_size)
        x = r.x1 - width
    else:
        x = r.x0
    page.insert_text((x, r.y1 - (r.height - font_size) / 2 - font_size * 0.16),
                     replacement, fontname="F0", fontsize=font_size, color=color)
    return True


def main() -> int:
    register_fonts()
    materials = load_materials()
    print("materials from materials.ts: %d" % len(materials))

    missing = [m.category for m in materials if not card_for(m.category)]
    if missing:
        raise SystemExit("No failure card for: %s" % ", ".join(missing))

    tmp = HERE / "_field_guide_pages.pdf"
    build_new_pages(materials, tmp)

    src = fitz.open(str(SOURCE_PDF))
    new = fitz.open(str(tmp))
    out = fitz.open()

    out.insert_pdf(src, from_page=0, to_page=0)          # cover, preserved
    out.insert_pdf(new, from_page=0, to_page=3)          # matrix x2, failures x2
    out.insert_pdf(src, from_page=3, to_page=3)          # worksheet, preserved

    muted = (0.654902, 0.674510, 0.701961)
    # Measured off the original cover: blue #1D7CFF on the dark #111316 ground.
    cover_blue = (0.113725, 0.486275, 1.0)
    cover_bg = (17 / 255, 19 / 255, 22 / 255)

    cover = out[0]
    ok_cover = patch_text(cover, "17 MATERIALS. ONE REFERENCE. LESS GUESSWORK.",
                          "%d MATERIALS. ONE REFERENCE. LESS GUESSWORK." % len(materials),
                          13.0, FONT_DIR / "Lato-Bold.ttf", cover_blue, fill=cover_bg)
    sheet = out[5]
    # The worksheet's page label sits in the dark header bar, so the redaction
    # has to be filled with that bar's colour, not white.
    header_bg = cover_bg  # measured (17,19,22) on both preserved pages
    ok_sheet = patch_text(sheet, "FIELD GUIDE  /  04", "FIELD GUIDE  /  06",
                          6.5, FONT_DIR / "Lato-Medium.ttf", muted, align_right=True,
                          fill=header_bg)
    # The worksheet also carries the count in its field-reminders panel, on the
    # pale #F2F4F7 ground. Missed on the first pass because the cover's copy is
    # the one everybody looks at.
    ok_count = patch_text(sheet, "17 MATERIALS", "%d MATERIALS" % len(materials),
                          8.2, FONT_DIR / "Lato-Bold.ttf",
                          (0.070588, 0.078431, 0.090196),
                          fill=(242 / 255, 244 / 255, 246 / 255))
    print("worksheet count patched: %s" % ok_count)
    print("cover count patched: %s | worksheet label patched: %s" % (ok_cover, ok_sheet))

    out.set_metadata({
        "title": "PrintLog3D - Filament Settings Field Guide",
        "author": "PrintLog3D.com",
        "subject": "%d-material filament settings reference and troubleshooting field guide" % len(materials),
        "keywords": "3d printing, filament, settings, PLA, PETG, ABS, ASA, TPU, nylon, PEEK",
        "creator": "printlog3d/scripts/build_field_guide.py",
        "producer": "ReportLab + PyMuPDF",
    })

    out.save(str(OUTPUT_PDF), garbage=4, deflate=True)
    out.close(); new.close(); src.close()
    tmp.unlink(missing_ok=True)

    size = OUTPUT_PDF.stat().st_size
    print("wrote %s (%d pages, %.0f KB)" % (OUTPUT_PDF.name, 6, size / 1024))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
