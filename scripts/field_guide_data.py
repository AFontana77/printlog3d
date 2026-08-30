# -*- coding: utf-8 -*-
"""Canonical data layer for the field guide.

`materials.ts` is the single source of truth for the site, so it is the single
source for the PDF too. This module turns it into the exact strings the guide
prints, and nothing here invents a value: every temperature, range and
requirement is read from the profile, and the condensers below only shorten
prose that is already there.

The condensers are the part worth reviewing. `drying` and `coolingFan` are
sentences on the site and cells in the PDF, so they have to be compressed. Each
one parses what it can and falls back to a safe literal rather than guessing --
an unparseable drying string yields "See profile", never a made-up temperature.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

# Reuse the parser that already reads this file for the retired cheat sheet.
# A third hand-rolled TypeScript parser is a third thing that can disagree.
from build_cheatsheet import (  # noqa: E402
    _extract_array_body,
    _get_bool_field,
    _get_string_field,
    _split_top_level_objects,
)

MATERIALS_TS = Path(__file__).resolve().parent.parent / "src" / "lib" / "materials.ts"


class Material:
    __slots__ = (
        "category", "slug", "full_name", "summary", "nozzle", "bed", "enclosure",
        "cooling", "retraction", "price", "drying", "needs_drying", "difficulty",
        "common_problem",
    )

    def __init__(self, obj: str):
        self.category = _get_string_field(obj, "category")
        self.slug = _get_string_field(obj, "slug")
        self.full_name = _get_string_field(obj, "fullName")
        self.summary = _get_string_field(obj, "summary")
        self.nozzle = _get_string_field(obj, "printTempC")
        self.bed = _get_string_field(obj, "bedTempC")
        self.enclosure = _get_string_field(obj, "enclosure")
        self.cooling = _get_string_field(obj, "coolingFan")
        self.retraction = _get_string_field(obj, "retraction")
        self.price = _get_string_field(obj, "priceBandUsd")
        self.drying = _get_string_field(obj, "drying")
        self.needs_drying = _get_bool_field(obj, "needsDrying")
        self.difficulty = _get_string_field(obj, "difficulty")
        self.common_problem = _get_string_field(obj, "commonProblem")


def load_materials() -> list[Material]:
    src = MATERIALS_TS.read_text(encoding="utf-8")
    return [Material(o) for o in _split_top_level_objects(_extract_array_body(src))]


# --------------------------------------------------------------------------
# Cell condensers. Shorten, never invent.
# --------------------------------------------------------------------------

def cooling_cell(m: Material) -> str:
    """`coolingFan` prose -> the short form the matrix column uses."""
    c = m.cooling.lower()
    pct = re.search(r"(\d+\s*-\s*\d+|\d+)\s*%", m.cooling)
    if c.startswith("no,"):
        return "No / low"
    if c == "no":
        return "No"
    if "minimal" in c:
        return "Minimal"
    if pct:
        return "Yes (%s%%)" % pct.group(1).replace(" ", "")
    if c.startswith("yes"):
        return "Yes"
    return m.cooling[:18]


def drying_cell(m: Material) -> str:
    """`drying` prose -> "<temp>C / <duration>", with the optional marker kept.

    Falls back to "See profile" rather than a guess. A wrong drying temperature
    in a printed reference is the one error here that could ruin a spool.
    """
    temp = re.search(r"(\d+(?:\s*-\s*\d+)?)\s*C\b", m.drying)
    dur = re.search(r"(\d+(?:\s*-\s*\d+)?)\s*(hours|h)\b", m.drying, re.I)
    if not temp:
        return "See profile"
    t = temp.group(1).replace(" ", "")
    if not dur:
        # e.g. "several hours" with no number.
        if re.search(r"several hours", m.drying, re.I):
            return "%sC / several h" % t
        return "%sC" % t
    d = dur.group(1).replace(" ", "")
    cell = "%sC / %sh" % (t, d)
    if not m.needs_drying:
        cell += " (opt.)"
    return cell


def needs_oven(m: Material) -> bool:
    """True where a domestic filament dryer cannot reach the temperature.

    The site's drying tool draws this line at 90C. The PDF must draw it in the
    same place, or the printed reference contradicts the live one.
    """
    temp = re.search(r"(\d+)(?:\s*-\s*(\d+))?\s*C\b", m.drying)
    if not temp:
        return False
    ceiling = int(temp.group(2) or temp.group(1))
    return ceiling > 90


def enclosure_cell(m: Material) -> tuple[str, str]:
    """(label, style) for the enclosure column."""
    if m.enclosure == "Required":
        return "REQUIRED", "required"
    if m.enclosure == "Recommended":
        return "RECOMMENDED", "recommended"
    return "Not needed", "plain"


def accent_for(m: Material) -> str:
    """Row accent colour, matching the legend on the matrix page.

    blue   = prints without an enclosure
    orange = needs drying attention beyond an ordinary dryer, or an enclosure
    """
    if needs_oven(m):
        return "orange"
    if m.enclosure == "Required":
        return "slate"
    return "blue"
