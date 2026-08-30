# -*- coding: utf-8 -*-
"""Make the extracted Lato subsets usable by ReportLab.

The faces are lifted out of the shipped PDF's embedded subsets, so they arrive
with a single Mac-Roman (1,0) cmap whose glyph names are generic (`glyph00035`).
ReportLab refuses them: it looks for a Unicode cmap and raises "could not find a
suitable cmap encoding".

The (1,0) codes are plain ASCII. That was established two ways rather than
assumed:

  * glyph indices run sequentially from 0x20, so 0x30 lands on glyph00018 and
    0x41 on glyph00035, exactly 16 and 33 steps along;
  * the advance widths match Lato's real metrics at 2000 upem -- space 512,
    I 560, M 1857, W 2071 -- and the digits are tabular, 0 and 1 both 1160.

So this adds a Unicode (3,1) cmap over the same glyph ids. It does not add,
remove or alter a single outline; it only tells a reader which character each
existing glyph is. Run once after extracting.

    py -3.11 scripts/normalise_fonts.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable

FONT_DIR = Path(__file__).resolve().parent / "fonts"


def add_unicode_cmap(path: Path) -> int:
    font = TTFont(str(path))
    cmap = font["cmap"]

    legacy = next((t for t in cmap.tables if (t.platformID, t.platEncID) == (1, 0)), None)
    if legacy is None:
        raise SystemExit("%s: no (1,0) cmap to translate" % path.name)

    # ASCII identity: the byte code IS the codepoint.
    mapping = {code: glyph for code, glyph in legacy.cmap.items() if 0x20 <= code <= 0x7E}

    sub = CmapSubtable.newSubtable(4)
    sub.platformID, sub.platEncID, sub.language = 3, 1, 0
    sub.cmap = mapping

    cmap.tables = [t for t in cmap.tables if (t.platformID, t.platEncID) != (3, 1)]
    cmap.tables.append(sub)

    # ReportLab reads the PostScript name; the subset tag would otherwise leak
    # a meaningless "AAAAAA+" prefix into the output document.
    clean = path.stem
    for rec in font["name"].names:
        if rec.nameID in (1, 4, 6):
            rec.string = clean.encode("utf-16-be" if rec.platformID == 3 else "latin-1")

    font.save(str(path))
    return len(mapping)


def main() -> int:
    files = sorted(FONT_DIR.glob("*.ttf"))
    if not files:
        raise SystemExit("No fonts in %s. Extract them from the source PDF first." % FONT_DIR)
    for f in files:
        n = add_unicode_cmap(f)
        print("  %-22s unicode cmap added, %d characters" % (f.name, n))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
