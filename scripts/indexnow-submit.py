# -*- coding: utf-8 -*-
"""Submit this property's indexable URLs to IndexNow.

Bing consumes IndexNow directly and needs no account for it, which matters
because printlog3d's historical traffic is Bing-weighted and the property is not
verified in Bing Webmaster Tools. Verification is an owner action; this is not.

Submits exactly the sitemap, so it can never advertise a URL we do not want
indexed. The 1,000 legacy catalogue entries are absent from the sitemap on
purpose and stay absent here.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

HOST = "www.printlog3d.com"
ROOT = Path(__file__).resolve().parent.parent
KEY = re.search(
    r"INDEXNOW_KEY = '([0-9a-f]+)'",
    (ROOT / "src" / "lib" / "indexnow.ts").read_text(encoding="utf-8"),
).group(1)

xml = urllib.request.urlopen("https://%s/sitemap.xml" % HOST, timeout=60).read().decode()
urls = re.findall(r"<loc>([^<]+)</loc>", xml)
print("sitemap URLs: %d" % len(urls))

if "--submit" not in sys.argv:
    print("dry run. re-run with --submit to notify IndexNow.")
    sys.exit(0)

body = json.dumps({
    "host": HOST,
    "key": KEY,
    "keyLocation": "https://%s/%s.txt" % (HOST, KEY),
    "urlList": urls,
}).encode()

req = urllib.request.Request(
    "https://api.indexnow.org/IndexNow",
    data=body,
    headers={"Content-Type": "application/json; charset=utf-8"},
)
with urllib.request.urlopen(req, timeout=90) as r:
    print("IndexNow responded HTTP %s" % r.status)
