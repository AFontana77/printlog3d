# -*- coding: utf-8 -*-
"""Failure-mode cards for the field guide.

TWO KINDS OF ENTRY, AND THE DIFFERENCE MATTERS.

The first 17 are transcribed VERBATIM from the shipped asset. They are not
regenerated, not reworded and not improved. M1.7's instruction is to extend the
existing guide rather than replace it, and the existing copy is approved work.

The remaining 14 are new, and each one is condensed from that material's own
`commonProblem` field in materials.ts. Nothing is invented: the headline is a
label for the failure the profile already describes, and the body is that
description tightened to two printed lines. Where the profile gives a number,
the number is the profile's.

Ordering follows MATERIAL_PROFILES so the guide reads in the same order as the
site's library.
"""

# Transcribed from PrintLog3D-Filament-Settings-Field-Guide.pdf, pages 3.
VERBATIM_FROM_SHIPPED_ASSET = {
    "PLA": (
        "HEAT SOFTENING",
        "Parts soften around 60C. If the part must survive heat, move to PETG or ABS "
        "instead of trying to tune PLA.",
    ),
    "PETG": (
        "STRINGING",
        "Lower nozzle temperature 5C at a time and raise travel speed before changing "
        "retraction distance.",
    ),
    "ABS": (
        "WARPING / LAYER SPLIT",
        "Corners lift and layers split when the print is exposed to drafts. Enclose the "
        "printer and turn part cooling off.",
    ),
    "ASA": (
        "WARPING + ODOR",
        "Similar warping behavior to ABS, with a stronger smell. Ventilate the room and "
        "keep the chamber warm and still.",
    ),
    "PC": (
        "LAYER DELAMINATION",
        "A clean-looking print can still delaminate under load when the filament is wet. "
        "Dry it and keep it dry during printing.",
    ),
    "PEEK": (
        "MACHINE LIMITS",
        "The main problem is often machine capability. If your hot end or bed cannot reach "
        "the required temperatures, tuning cannot solve it.",
    ),
    "Nylon PA6": (
        "MOISTURE",
        "Steam pops and a furry surface mean the filament is wet. Dry once is not enough - "
        "it needs to stay dry during the print.",
    ),
    "Nylon PA12": (
        "BED ADHESION",
        "Nylon does not like a PEI build surface. A garolite or PA-specific sheet, or a "
        "glue-stick layer, can solve what temperature tuning will not.",
    ),
    "PA-CF": (
        "NOZZLE WEAR",
        "Underextrusion that worsens over time can mean the carbon fiber has widened the "
        "nozzle bore. Use hardened steel or ruby before the first print.",
    ),
    "PETG-CF": (
        "WRONG EXPECTATION",
        "Carbon fiber makes the material stiffer, not stronger in every sense. Impact "
        "resistance goes down, not up.",
    ),
    "PCTG": (
        "AVAILABILITY",
        "The problem may be sourcing more than printing. Fewer brands carry it, so color "
        "choice is narrower than PETG.",
    ),
    "CPE": (
        "NAME CONFUSION",
        "In 3D printing, CPE means co-polyester. Do not confuse it with chlorinated "
        "polyethylene, an unrelated industrial rubber.",
    ),
    "HIPS": (
        "SUPPORT ASSUMPTIONS",
        "Do not buy it as support material unless you have a second extruder. On a "
        "single-nozzle printer it is simply an ABS-like filament.",
    ),
    "PLA Silk": (
        "LOST SHEEN",
        "Too much cooling dulls the sheen. Reduce fan, print a little hotter, and slow "
        "down versus plain PLA.",
    ),
    "PLA Matte": (
        "ABRASIVE FILLER",
        "The matting filler is mildly abrasive. Brass can work, but expect faster nozzle "
        "wear than plain PLA.",
    ),
    "PLA Wood": (
        "CLOGGING",
        "Wood particles bridge small nozzles easily. Use 0.4mm or larger and avoid long "
        "retractions.",
    ),
    "PLA Metal": (
        "STRENGTH MYTH",
        "Metal filler adds weight and finish, but reduces strength compared with plain PLA.",
    ),
}

# New in M1.7. Each condensed from the material's own commonProblem.
NEW_IN_M1_7 = {
    "TPU": (
        "FEED BUCKLING",
        "The filament buckles between the drive gear and the hot end instead of feeding. "
        "Slow to 15-25 mm/s and use direct drive.",
    ),
    "TPE": (
        "SOFTER, SOONER",
        "Everything that goes wrong with TPU goes wrong sooner. Direct drive is effectively "
        "mandatory and 15 mm/s is a sensible ceiling.",
    ),
    "PVA": (
        "ARRIVES WET",
        "It degrades in the hot end on long prints because it absorbed water on the spool. "
        "Store it sealed from the day it arrives.",
    ),
    "PP": (
        "IT WILL NOT STICK",
        "PP bonds to itself and to very little else. Packing tape or a PP-specific sheet is "
        "the answer; bed temperature alone is not.",
    ),
    "PVB": (
        "CLOUDING",
        "It takes on moisture noticeably faster than PLA, and a spool left out for a "
        "fortnight prints cloudy rather than clear.",
    ),
    "PLA-CF": (
        "STIFFER, NOT STRONGER",
        "PLA-CF snaps where plain PLA would bend. Stiffness is the reason to choose it, "
        "not strength.",
    ),
    "PA-GF": (
        "WORSE THAN CARBON",
        "Glass fibre is more abrasive than carbon, not less. Hardened steel is the minimum; "
        "ruby or tungsten if you print it often.",
    ),
    "ASA-CF": (
        "BOTH PROBLEMS AT ONCE",
        "It warps like ASA and wears nozzles like a composite. Enclose the printer and fit "
        "a hardened nozzle before the first print.",
    ),
    "PC-CF": (
        "TOUGHNESS TRADED AWAY",
        "The carbon fibre removes much of polycarbonate's impact toughness and keeps all "
        "its difficulty. For drops, plain PC is better.",
    ),
    "PEI": (
        "CHAMBER, NOT BED",
        "A heated bed is not a heated chamber. Large parts delaminate partway up unless the "
        "chamber holds 120-180C.",
    ),
    "PPS": (
        "CRYSTALLISATION SHRINKAGE",
        "The part comes off the plate dimensionally different from the model. The fix is "
        "chamber temperature and part design, not slicer settings.",
    ),
    "Conductive PLA": (
        "NOT A WIRE",
        "Resistance rises with trace length, so a circuit working across 20mm fails across "
        "200mm. Never put it near mains voltage.",
    ),
    "Glow PLA": (
        "PHOSPHOR IS ABRASIVE",
        "The phosphor is a hard mineral and eats brass faster than most carbon fills. Fit "
        "hardened steel first.",
    ),
    "Magnetic PLA": (
        "FERROMAGNETIC, NOT MAGNETISED",
        "A printed part sticks to a magnet but holds nothing up by itself. It also genuinely "
        "rusts, so seal it if you do not want that.",
    ),
}

CARDS = {**VERBATIM_FROM_SHIPPED_ASSET, **NEW_IN_M1_7}


def card_for(category: str) -> tuple[str, str] | None:
    return CARDS.get(category)
