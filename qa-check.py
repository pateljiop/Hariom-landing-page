#!/usr/bin/env python3
"""Small standard-library smoke checks for the static Hariom Studio landing page."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
errors = []
html_path = ROOT / "index.html"
css_path = ROOT / "styles.css"
js_path = ROOT / "script.js"

for path in (html_path, css_path, js_path):
    if not path.exists():
        errors.append(f"Missing required file: {path.name}")

if not errors:
    html = html_path.read_text(encoding="utf-8")
    css = css_path.read_text(encoding="utf-8")
    js = js_path.read_text(encoding="utf-8")

    for required in (
        'name="viewport"', 'name="description"', 'application/ld+json',
        'id="work"', 'id="lab"', 'id="offers"', 'id="brief"', 'id="faq"',
        'id="contact"', 'id="project-brief"', 'aria-label="Main navigation"',
    ):
        if required not in html:
            errors.append(f"Missing HTML feature: {required}")

    for asset in ('styles.css', 'script.js'):
        if not re.search(rf'(?:href|src)="{re.escape(asset)}"', html):
            errors.append(f"HTML does not link {asset}")

    for selector in ('.lab-shell[data-mood="signal"]', '.lab-shell[data-mood="form"]',
                     '.lab-shell[data-mood="play"]', '.brief-form', ':focus-visible',
                     'prefers-reduced-motion'):
        if selector not in css:
            errors.append(f"Missing CSS support: {selector}")

    for feature in ("mood-button", "project-brief", "mailto:", "scroll-progress"):
        if feature not in js:
            errors.append(f"Missing JavaScript feature: {feature}")

    ids = re.findall(r'\bid="([^"]+)"', html)
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        errors.append("Duplicate HTML IDs: " + ", ".join(duplicates))

    anchors = re.findall(r'href="#([^"]+)"', html)
    id_set = set(ids)
    missing_anchors = sorted({anchor for anchor in anchors if anchor not in id_set})
    if missing_anchors:
        errors.append("Broken in-page links: " + ", ".join(missing_anchors))

if errors:
    print("SMOKE CHECK FAILED")
    for error in errors:
        print(" -", error)
    sys.exit(1)

print("SMOKE CHECK PASSED")
print("Required assets, key sections, interactive features, duplicate IDs, and in-page links checked.")
print("This is a static smoke test; it does not replace browser, accessibility, or performance testing.")
