# -*- coding: utf-8 -*-
"""printlog3d.com acceptance harness.

Runs the same defect checks against either the local build output or live
production. Production is the acceptance boundary (Golden Property Standard
section 2), so `--prod` is the run that actually counts; `--local` exists to
catch regressions before a deploy.

    py -3.11 scripts/acceptance.py --local
    py -3.11 scripts/acceptance.py --prod

Counting note: these pages are minified onto very few lines, so every count
uses re.findall (occurrences), never a line count. `grep -c` reports 1 or 0 on
this HTML no matter how many matches are present.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
BUILD = REPO / ".next" / "server" / "app"
BASE = "https://www.printlog3d.com"

# Claims that must appear nowhere on the site.
BANNED = {
    "fabricated filament count": r"1,260",
    "fabricated source name": r"Filamentpedia",
    "firsthand testing claim": r"\btested\b(?![^<]{0,40}by the manufacturer)",
    "we tested / our lab": r"\b(we tested|we measured|our lab|I tested)\b",
    "false Associates membership": r"participates in the Amazon Associates",
    "dead App Store link": r'href="https://apps\.apple\.com"',
    "dead Google Play link": r'href="https://play\.google\.com"',
    "unpublished app price": r"\$6\.99",
    "app availability claim": r"free on (iPhone|iOS)",
    # The app is not published. These phrases all assert it is usable today,
    # and they survived a first sweep on six guide pages that were out of scope.
    "app usability claim": r"FREE APP|in PrintLog3D|check the app|Download the app",
    "untagged Amazon link": r"amazon\.com/s\?k=(?![^\"]*tag=)",
    "missing tracking placeholder": r"PENDING_TRACKING_ID",
    "NaN render": r"NaN",
    "em dash": r"—",
}

# Checks where a negation in the preceding clause flips the meaning. "not
# numbers we measured" is a disclaimer; "we measured" on its own is a claim.
NEGATABLE = {"we tested / our lab", "firsthand testing claim"}
NEGATIONS = ("not ", "never ", "no ", "without ")
NEG_WINDOW = 40


def is_negated(html: str, at: int) -> bool:
    """True when a negation appears close before the match, in the same clause."""
    window = html[max(0, at - NEG_WINDOW) : at].lower()
    window = window.rsplit(".", 1)[-1]  # do not read across a sentence boundary
    return any(n in window for n in NEGATIONS)


# --------------------------------------------------------------------------
# Amazon commerce checks
# --------------------------------------------------------------------------
# This property's own tracking ID. A site must never carry a sibling's tag:
# every monetised property in the portfolio has its own, and a borrowed tag
# sends the commission and the attribution to the wrong place.
OWN_TAG = "printlog3d-20"

# Sibling tags, checked explicitly so a copy-paste from another repo is caught
# rather than merely "not our tag". Not exhaustive, and does not need to be:
# ANY tag that is not OWN_TAG fails the check below regardless.
SIBLING_TAGS = (
    "digpicframe-20", "homesteadgr-20", "ageinplace0d-20", "cleanairhome-20",
    "bpmonitorlab-20", "pfasfilter-20", "petcoolprod-20", "solargenpros-20",
    "lvl2chargr-20", "smartrngcmp-20", "hearingaidotc-20", "compostlab-20",
    "veteranswater-20", "sleepgearpros-20", "freezedryguide-20",
    "steellitterbox-20", "chunkyknit-20", "portabledish-20", "wlshotguide-20",
)

AMAZON_LINK_RE = re.compile(r'href="(https://(?:www\.)?amazon\.com/[^"]*)"')
# HTML entity-encodes the query separator, so a live href reads
# `...?k=petg&amp;tag=printlog3d-20`. Matching on a bare `&` reports every
# correctly tagged link as untagged. Unescape before parsing.
TAG_RE = re.compile(r"[?&]tag=([A-Za-z0-9_-]+)")


def unescape_href(url: str) -> str:
    return url.replace("&amp;", "&").replace("&#38;", "&")


DEAD_HREF_RE = re.compile(r'<a\b[^>]*\bhref="(#|)"[^>]*>', re.IGNORECASE)


def check_dead_ctas(html, label, failures):
    """No empty and no placeholder-hash hrefs.

    A source grep cannot catch these: href="" arises from data, not markup, and
    renders as a button that silently does nothing. Crawling production is the
    only way to see it.
    """
    for m in DEAD_HREF_RE.finditer(html):
        kind = "fake # CTA" if '"#"' in m.group(0) else 'empty href=""'
        failures.append("%s -> %s: %s" % (label, kind, m.group(0)[:80]))


def check_amazon(html, label, failures):
    """Returns the number of Amazon links found, and appends any failures."""
    links = [unescape_href(u) for u in AMAZON_LINK_RE.findall(html)]
    for url in links:
        tags = TAG_RE.findall(url)
        if not tags:
            failures.append("%s -> Amazon link with NO tag: %s" % (label, url[:90]))
            continue
        for t in tags:
            if t == OWN_TAG:
                continue
            why = "sibling property's tag" if t in SIBLING_TAGS else "unknown tag"
            failures.append("%s -> Amazon link carries %s (%s): %s" % (label, t, why, url[:70]))
    # The click tracker keys off the anchor, so an untracked Amazon exit earns
    # money we cannot attribute to a page.
    if links and 'rel="nofollow noopener noreferrer sponsored"' not in html:
        failures.append("%s -> Amazon link present without sponsored rel attributes" % label)
    return len(links)


STATIC_PAGES = [
    "", "/library", "/free-download", "/about", "/support", "/privacy", "/terms",
    "/disclosure", "/get-it-printed",
    "/pla-vs-petg", "/pla-vs-abs", "/abs-vs-petg",
    "/3d-printing-filament-guide", "/how-to-dry-filament", "/3d-print-stringing",
]
def _materials_from_source() -> list[str]:
    """Read the slugs from materials.ts, the single definition of a material.

    A hardcoded copy here silently checked 17 slugs after the library grew to
    30, and still printed PASS. Deriving removes the possibility.
    """
    src = (REPO / "src" / "lib" / "materials.ts").read_text(encoding="utf-8")
    slugs = re.findall(r"^\s*slug: '([a-z0-9-]+)',", src, re.MULTILINE)
    if not slugs:
        raise SystemExit("acceptance: could not parse any slug from materials.ts")
    return slugs


MATERIALS = _materials_from_source()
# A sample of the noindexed catalogue entries.
SAMPLE_ENTRIES = [
    "/library/peek/bambu-lab-peek-premium",
    "/library/pla/hatchbox-pla-standard",
    "/library/petg/cc3d-petg-standard",
    "/library/abs/amazon-basics-abs-premium",
]


def fetch_prod(path: str) -> tuple[int, str]:
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "printlog3d-acceptance/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""


def read_local(path: str) -> tuple[int, str]:
    name = "index" if path == "" else path.lstrip("/")
    f = BUILD / (name + ".html")
    if not f.exists():
        f = BUILD / name / "index.html"
    if not f.exists():
        return 404, ""
    return 200, f.read_text(encoding="utf-8", errors="replace")


def visible_text(html: str) -> str:
    """Strip script/style so a schema string is not mistaken for visible copy."""
    out = re.sub(r"(?is)<script.*?</script>", " ", html)
    out = re.sub(r"(?is)<style.*?</style>", " ", out)
    out = re.sub(r"(?s)<[^>]+>", " ", out)
    return re.sub(r"\s+", " ", out)


def jsonld_blocks(html: str) -> list[dict]:
    blocks = []
    for m in re.finditer(
        r'(?is)<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html
    ):
        raw = m.group(1)
        raw = raw.replace("&quot;", '"').replace("&amp;", "&").replace("&#x27;", "'")
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError:
            blocks.append({"@type": "UNPARSEABLE"})
    return blocks


def main() -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--prod", action="store_true")
    g.add_argument("--local", action="store_true")
    args = ap.parse_args()
    get = fetch_prod if args.prod else read_local
    where = "PRODUCTION" if args.prod else "LOCAL BUILD"

    failures: list[str] = []
    checked = 0
    amazon_links_total = [0]

    paths = STATIC_PAGES + ["/library/" + m for m in MATERIALS] + SAMPLE_ENTRIES

    for path in paths:
        status, html = get(path)
        checked += 1
        label = path or "/"
        if status != 200 or not html:
            failures.append("%s -> HTTP %s" % (label, status))
            continue

        vis = visible_text(html)

        for name, pattern in BANNED.items():
            hits = [
                m
                for m in re.finditer(pattern, html)
                if not (name in NEGATABLE and is_negated(html, m.start()))
            ]
            if hits:
                failures.append("%s -> %s x%d" % (label, name, len(hits)))

        amazon_links_total[0] += check_amazon(html, label, failures)
        check_dead_ctas(html, label, failures)

        # Exactly one h1 per page.
        h1 = len(re.findall(r"(?i)<h1[\s>]", html))
        if h1 != 1:
            failures.append("%s -> %d h1 elements" % (label, h1))

        # Catalogue entries must be noindexed; everything else must not be.
        is_entry = path in SAMPLE_ENTRIES
        noindex = bool(re.search(r'(?i)<meta[^>]+name="robots"[^>]+noindex', html))
        if is_entry and not noindex:
            failures.append("%s -> catalogue entry is NOT noindexed" % label)
        if not is_entry and noindex:
            failures.append("%s -> indexable page is noindexed" % label)

        # Every FAQ answer promised to Google must be readable on the page.
        for block in jsonld_blocks(html):
            if not isinstance(block, dict):
                continue
            if block.get("@type") == "FAQPage":
                for q in block.get("mainEntity", []):
                    ans = (q.get("acceptedAnswer") or {}).get("text", "")
                    probe = re.sub(r"\s+", " ", ans)[:60]
                    if probe and probe not in vis:
                        failures.append(
                            "%s -> FAQ answer in schema is not visible: %r" % (label, probe[:45])
                        )

    # The sitemap must list every indexable page and no noindexed one.
    status, xml = get("/sitemap.xml")
    if args.local:
        f = BUILD / "sitemap.xml" / "route.js"
        xml = ""  # the local sitemap is a route handler, not a static file
    if xml:
        locs = re.findall(r"<loc>(.*?)</loc>", xml)
        expected = {BASE + p for p in STATIC_PAGES} | {BASE + "/library/" + m for m in MATERIALS}
        expected = {u.rstrip("/") if u != BASE else u for u in expected}
        got = {u.rstrip("/") if u != BASE else u for u in locs}
        for missing in sorted(expected - got):
            failures.append("sitemap -> missing %s" % missing)
        for extra in sorted(got - expected):
            failures.append("sitemap -> unexpected %s" % extra)
        print("sitemap: %d URLs" % len(locs))

    print(
        "\n%s: %d pages checked (%d materials derived from materials.ts)"
        % (where, checked, len(MATERIALS))
    )
    if amazon_links_total[0] == 0:
        print(
            "Amazon links: 0 found. The tag checks passed VACUOUSLY - commerce is "
            "not activated yet. This is not the same as 'all links verified'."
        )
    else:
        print(
            "Amazon links: %d found, all carrying tag=%s"
            % (amazon_links_total[0], OWN_TAG)
        )
    if failures:
        print("FAIL: %d finding(s)\n" % len(failures))
        for f in failures:
            print("  -", f)
        return 1
    print("PASS: no findings")
    return 0


if __name__ == "__main__":
    sys.exit(main())
