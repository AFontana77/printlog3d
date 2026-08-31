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
import html as _html
import json
import re
from urllib.parse import unquote
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
BUILD = REPO / ".next" / "server" / "app"
BASE = "https://www.printlog3d.com"

# Claims that must appear nowhere on the site.
# Banned wording lives in banned-claims.json so the hydrated layer enforces the
# SAME rules. Two copies of a rule set is the drift this property keeps paying
# for; the em dash that escaped M1.5 escaped because only one layer existed.
_RULES = json.loads(
    (Path(__file__).resolve().parent / "banned-claims.json").read_text(encoding="utf-8")
)
BANNED = dict(_RULES["patterns"])
# Literal program values only ever appear in one casing; prose rules must not
# depend on casing at all. See the comment in banned-claims.json.
CASE_SENSITIVE = set(_RULES.get("case_sensitive", []))


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


# Local assets referenced by a page: both direct src/href and the next/image
# proxy form, which hides the real path inside a query parameter.
ASSET_RE = re.compile(r'(?:src|href)="(/[^"?]+\.(?:webp|png|jpg|jpeg|svg|ico|pdf))"')
NEXT_IMG_RE = re.compile(r'/_next/image\?url=([^"&]+)')


PUBLIC = Path(__file__).resolve().parent.parent / "public"


def resolve_asset_local(path: str) -> int:
    """Assets live in public/, not in the prerendered route output."""
    f = PUBLIC / path.lstrip("/")
    return 200 if f.is_file() else 404


def check_assets(html, label, failures, cache, get):
    """Every referenced local asset must resolve.

    Checked once per URL across the whole run, because the same icon appears on
    dozens of pages and one 404 is one defect, not fifty.
    """
    urls = set(ASSET_RE.findall(html))
    for enc in NEXT_IMG_RE.findall(html):
        u = unquote(unescape_href(enc))
        if u.startswith("/"):
            urls.add(u)
    for u in sorted(urls):
        if u in cache:
            status = cache[u]
        else:
            status = get(u)[0] if get is fetch_prod else resolve_asset_local(u)
            cache[u] = status
        if status != 200:
            failures.append("ASSET %s -> HTTP %s (referenced by %s)" % (u, status, label))


STATIC_PAGES = [
    "", "/library", "/free-download", "/about", "/support", "/privacy", "/terms",
    "/disclosure", "/editorial-policy", "/get-it-printed", "/workshop", "/recommended-gear",
    "/pla-vs-petg", "/pla-vs-abs", "/abs-vs-petg",
    "/3d-printing-filament-guide", "/how-to-dry-filament", "/3d-print-stringing",
    "/3d-printer-troubleshooting", "/asa-vs-abs",
]
def _material_categories_from_source() -> list[str]:
    """Canonical category names, read from the same file the pages render from."""
    src = (Path(__file__).resolve().parent.parent / "src" / "lib" / "materials.ts").read_text(
        encoding="utf-8"
    )
    return re.findall(r"^    category: '([^']+)'", src, re.M)


MATERIAL_CATEGORIES = _material_categories_from_source()


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


def _workshop_from_source() -> list[str]:
    """Derive workshop slugs too, for the same reason MATERIALS is derived."""
    src = (REPO / "src" / "lib" / "workshop.ts").read_text(encoding="utf-8")
    slugs = re.findall(r"^\s*slug: '([a-z0-9-]+)',", src, re.MULTILINE)
    if not slugs:
        raise SystemExit("acceptance: could not parse any workshop slug")
    return slugs


WORKSHOP = _workshop_from_source()
# A sample of the noindexed catalogue entries.
# Retired legacy catalogue URLs. These must NOT resolve as pages any more.
# Asserted as 301s to the real material profile, so reviving the route or
# dropping the redirect fails acceptance rather than silently republishing a
# thousand invented products.
RETIRED_ENTRIES = [
    ("/library/peek/bambu-lab-peek-premium", "/library/peek"),
    ("/library/pla/hatchbox-pla-standard", "/library/pla"),
    ("/library/petg/cc3d-petg-standard", "/library/petg"),
    ("/library/abs/amazon-basics-abs-premium", "/library/abs"),
    ("/library/pctg/polymaker-pctg-premium", "/library/pctg"),
]
SAMPLE_ENTRIES = []


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
    return _html.unescape(re.sub(r"\s+", " ", out))


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


MATRIX_MATERIAL_X = 45.0     # measured column origin of the matrix rows
MATRIX_X_TOLERANCE = 1.5
# The guide disambiguates one material name that also names a build surface.
PDF_LABEL_TO_CATEGORY = {"PEI (ULTEM)": "PEI"}


def _pdf_matrix_rows(pdf_path):
    """Material names read structurally, by column position.

    Returns None when PyMuPDF is unavailable, so the caller can skip rather
    than pretend the check passed.
    """
    try:
        import fitz
    except ImportError:
        return None

    rows = []
    doc = fitz.open(str(pdf_path))
    for page in doc:
        if "FILAMENT SETTINGS MATRIX" not in page.get_text():
            continue
        by_line = {}
        for w in page.get_text("words"):
            x0, y0, _, _, word = w[0], w[1], w[2], w[3], w[4]
            if abs(x0 - MATRIX_MATERIAL_X) <= MATRIX_X_TOLERANCE:
                by_line[round(y0, 1)] = [word]
            else:
                key = round(y0, 1)
                if key in by_line and x0 < 130:
                    by_line[key].append(word)
        for _, parts in sorted(by_line.items()):
            rows.append(" ".join(parts))
    doc.close()
    return rows


def check_field_guide(failures):
    """The landing page, the PDF and the material library must agree exactly.

    Three numbers, one truth. The page derives its claim from fieldGuide.ts, the
    PDF is built from materials.ts, and this asserts the loop closed.
    """
    root = Path(__file__).resolve().parent.parent
    pdf = root / "public" / "PrintLog3D-Filament-Settings-Field-Guide.pdf"
    ts = (root / "src" / "lib" / "fieldGuide.ts").read_text(encoding="utf-8")
    claimed = re.findall(r"^    '([^']+)',", ts, re.M)
    canon = list(MATERIAL_CATEGORIES)

    if not pdf.is_file():
        failures.append("FIELD GUIDE -> PDF missing at %s" % pdf.name)
        return

    rows = _pdf_matrix_rows(pdf)
    if rows is None:
        print("  (field-guide structural check skipped: PyMuPDF not installed)")
        return

    normalised = [PDF_LABEL_TO_CATEGORY.get(r, r) for r in rows]

    # FORWARD: everything the page promises is a real row and a live profile.
    for m in claimed:
        if m not in normalised:
            failures.append("FIELD GUIDE -> claims %s but it is not a matrix row in the PDF" % m)
        if m not in canon:
            failures.append("FIELD GUIDE -> claims %s, which is not a canonical material" % m)

    # REVERSE: everything the PDF documents is canonical and still has a page.
    for m in normalised:
        if m not in canon:
            failures.append("FIELD GUIDE -> PDF documents %s, which is not a canonical material" % m)
        if m not in claimed:
            failures.append("FIELD GUIDE -> PDF documents %s but the page does not claim it" % m)

    # EXACT COUNTS. Equal sets can still hide a duplicated row.
    if not (len(claimed) == len(normalised) == len(canon)):
        failures.append(
            "FIELD GUIDE -> counts disagree: page claims %d, PDF rows %d, library %d"
            % (len(claimed), len(normalised), len(canon))
        )
    else:
        print("  field guide: %d claimed = %d PDF matrix rows = %d live profiles"
              % (len(claimed), len(normalised), len(canon)))


def check_retired_entries(failures):
    """The generated catalogue must 301, never resolve.

    A page that still answers 200 is still publishing an invented product, no
    matter what its robots tag says.
    """
    import urllib.request as _u

    class _NoRedirect(_u.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    opener = _u.build_opener(_NoRedirect)
    for src, dest in RETIRED_ENTRIES:
        try:
            r = opener.open(_u.Request(BASE + src, method="GET"), timeout=30)
            failures.append("LEGACY %s -> still resolves (HTTP %s); it must 301" % (src, r.status))
        except _u.HTTPError as e:
            loc = e.headers.get("Location", "")
            if e.code not in (301, 308):
                failures.append("LEGACY %s -> HTTP %s, expected 301" % (src, e.code))
            elif not loc.rstrip("/").endswith(dest):
                failures.append("LEGACY %s -> redirects to %s, expected %s" % (src, loc, dest))
        except Exception as e:  # noqa: BLE001
            failures.append("LEGACY %s -> could not be checked: %s" % (src, e))
    print("  legacy catalogue: %d retired URLs asserted as 301" % len(RETIRED_ENTRIES))


def main() -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--prod", action="store_true")
    g.add_argument("--local", action="store_true")
    args = ap.parse_args()
    get = fetch_prod if args.prod else read_local
    where = "PRODUCTION" if args.prod else "LOCAL BUILD"

    failures: list[str] = []
    asset_cache: dict[str, int] = {}
    check_field_guide(failures)

    if args.prod:
        check_retired_entries(failures)

    # The IndexNow key must be reachable at /<key>.txt or submission
    # silently stops working. Nothing links to it, so no other check
    # would ever notice it had gone.
    if args.prod:
        _k = re.search(
            r"INDEXNOW_KEY = '([0-9a-f]+)'",
            (Path(__file__).resolve().parent.parent / 'src' / 'lib' / 'indexnow.ts')
            .read_text(encoding='utf-8'),
        ).group(1)
        _st, _body = fetch_prod('/%s.txt' % _k)
        if _st != 200 or _k not in _body:
            failures.append('INDEXNOW -> key file /%s.txt not serving the key (HTTP %s)' % (_k, _st))
        else:
            print('  indexnow: key file serving correctly')
    checked = 0
    amazon_links_total = [0]

    paths = (
        STATIC_PAGES
        + ["/library/" + m for m in MATERIALS]
        + ["/workshop/" + w for w in WORKSHOP]
        + SAMPLE_ENTRIES
    )

    for path in paths:
        status, html = get(path)
        checked += 1
        label = path or "/"
        if status != 200 or not html:
            failures.append("%s -> HTTP %s" % (label, status))
            continue

        vis = visible_text(html)
        check_assets(html, label, failures, asset_cache, get)

        # No page may state a material count that disagrees with the library.
        # Six pages -- including the site-wide metadata used on every one of
        # them -- still said 17 after the library grew to 31, because the
        # number was typed rather than derived.
        for _n in set(re.findall(r'(\d{1,3}) (?:filament )?materials?', vis, re.I)):
            if int(_n) != len(MATERIALS):
                failures.append(
                    '%s -> states "%s materials" but the library has %d'
                    % (label, _n, len(MATERIALS))
                )

        # No dead-end material profile. A profile that offers only the
        # workshop hub is the 'related articles dump where a specific next
        # action exists' the journey rules forbid. 15 of 31 did exactly that
        # until the cross-links were derived from material properties.
        if path.startswith('/library/') and path.count('/') == 2:
            if not re.search(r'href="/workshop/[a-z0-9-]+"', html):
                failures.append(
                    '%s -> no specific workshop step; only the hub' % label
                )

        for name, pattern in BANNED.items():
            hits = [
                m
                for m in re.finditer(
                    pattern, html, 0 if name in CASE_SENSITIVE else re.IGNORECASE
                )
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
        expected = (
            {BASE + p for p in STATIC_PAGES}
            | {BASE + "/library/" + m for m in MATERIALS}
            | {BASE + "/workshop/" + w for w in WORKSHOP}
        )
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
