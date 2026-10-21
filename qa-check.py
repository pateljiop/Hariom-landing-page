#!/usr/bin/env python3
"""Static smoke checks for Hariom Patel's personal developer portfolio."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
errors = []
paths = {name: ROOT / name for name in ("index.html", "styles.css", "script.js")}
for path in paths.values():
    if not path.exists():
        errors.append(f"Missing required file: {path.name}")

if not errors:
    html = paths["index.html"].read_text(encoding="utf-8")
    css = paths["styles.css"].read_text(encoding="utf-8")
    js = paths["script.js"].read_text(encoding="utf-8")
    required_html = (
        'name="viewport"', 'name="description"', 'application/ld+json',
        'id="home"', 'id="about"', 'id="projects"', 'id="lab"',
        'id="activity"', 'id="notes"', 'id="contact"',
        'aria-label="Main navigation"', 'Hariom Patel', 'Haryomix', 'Hariom AI',
    )
    for feature in required_html:
        if feature not in html:
            errors.append(f"Missing HTML feature: {feature}")
    for asset in ("styles.css", "script.js"):
        if not re.search(rf'(?:href|src)="{re.escape(asset)}"', html):
            errors.append(f"HTML does not link {asset}")
    for selector in (".p-hero-grid", ".p-project-grid", ".p-lab-shell",
                     ".p-links.open", ":focus-visible", "prefers-reduced-motion"):
        if selector not in css:
            errors.append(f"Missing CSS support: {selector}")
    for feature in ("p-menu", "signal-lab", "reading-progress", "aria-pressed"):
        if feature not in js:
            errors.append(f"Missing JavaScript feature: {feature}")
    ids = re.findall(r'\bid="([^"]+)"', html)
    duplicates = sorted({item for item in ids if ids.count(item) > 1})
    if duplicates:
        errors.append("Duplicate HTML IDs: " + ", ".join(duplicates))
    anchors = re.findall(r'href="#([^"]+)"', html)
    id_set = set(ids)
    missing = sorted({anchor for anchor in anchors if anchor not in id_set})
    if missing:
        errors.append("Broken in-page links: " + ", ".join(missing))

if errors:
    print("SMOKE CHECK FAILED")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print("SMOKE CHECK PASSED")
print("Required personal sections, assets, interactions, duplicate IDs and in-page anchors checked.")
print("Static smoke test only; browser, accessibility and performance tests are still needed.")
