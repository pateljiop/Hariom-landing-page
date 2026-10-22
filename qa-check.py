#!/usr/bin/env python3
"""Repository-wide static QA for Hariom's portfolio and all 18 theme pages."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
ERRORS = []
WARNINGS = []
THEMES = {
    "studio", "terminal", "editorial", "brutalist", "cinema", "minimal",
    "playful", "retro", "swiss", "neon", "nature", "dashboard",
    "magazine", "mono", "pixel", "future", "office", "netflix",
}

class Markup(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.anchors, self.assets, self.titles = [], [], [], []
        self.in_title = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"): self.ids.append(a["id"])
        if tag == "a":
            href = a.get("href", "")
            if href.startswith("#") and len(href) > 1: self.anchors.append(href[1:])
            if not href or href.strip() == "#": WARNINGS.append("Anchor has no destination")
        if tag == "script" and a.get("src"): self.assets.append(a["src"])
        if tag == "link" and a.get("rel") == "stylesheet" and a.get("href"): self.assets.append(a["href"])
        if tag == "title": self.in_title = True
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title and data.strip(): self.titles.append(data.strip())

required = [ROOT / "index.html", ROOT / "styles.css", ROOT / "script.js"]
for p in required:
    if not p.is_file(): ERRORS.append(f"Missing required file: {p.relative_to(ROOT)}")
pages = [ROOT / "index.html", *sorted((ROOT / "worlds").glob("*.html"))]
if not (ROOT / "worlds").is_dir(): ERRORS.append("Missing worlds/ directory")

css = (ROOT / "styles.css").read_text(encoding="utf-8") if (ROOT / "styles.css").exists() else ""
js = (ROOT / "script.js").read_text(encoding="utf-8") if (ROOT / "script.js").exists() else ""
declared_themes = set(re.findall(r'body\[data-landing-theme="([a-z-]+)"\]', css))
actual_themes = set()
page_count = 0

for page in pages:
    page_count += 1
    rel = page.relative_to(ROOT).as_posix()
    raw = page.read_text(encoding="utf-8")
    parser = Markup()
    try: parser.feed(raw)
    except Exception as exc:
        ERRORS.append(f"{rel}: HTML parser error: {exc}")
    duplicates = sorted(k for k, v in Counter(parser.ids).items() if v > 1)
    if duplicates: ERRORS.append(f"{rel}: duplicate IDs: {', '.join(duplicates)}")
    missing_anchors = sorted(set(parser.anchors) - set(parser.ids))
    if missing_anchors: ERRORS.append(f"{rel}: broken in-page anchors: {', '.join(missing_anchors)}")
    if not parser.titles: ERRORS.append(f"{rel}: missing <title>")
    if 'name="viewport"' not in raw: ERRORS.append(f"{rel}: missing responsive viewport meta")
    if not parser.assets: ERRORS.append(f"{rel}: no local script or stylesheet assets found")
    for asset in parser.assets:
        if asset.startswith(("https://", "http://", "//", "data:")): continue
        target = (page.parent / asset.split("#")[0].split("?")[0]).resolve()
        if not target.is_file(): ERRORS.append(f"{rel}: missing asset {asset}")
    if page.parent.name == "worlds":
        m = re.search(r'data-landing-theme="([a-z-]+)"', raw)
        if not m:
            ERRORS.append(f"{rel}: missing data-landing-theme")
        else:
            theme = m.group(1)
            actual_themes.add(theme)
            if page.stem != theme: ERRORS.append(f"{rel}: filename does not match theme '{theme}'")
            if theme not in declared_themes: ERRORS.append(f"{rel}: no page-wide CSS rules for theme '{theme}'")
        if 'src="../script.js"' not in raw: ERRORS.append(f"{rel}: shared script not linked correctly")
        if 'href="../styles.css"' not in raw: ERRORS.append(f"{rel}: shared stylesheet not linked correctly")

if actual_themes != THEMES:
    ERRORS.append(f"Theme pages mismatch. Missing: {sorted(THEMES-actual_themes)}; unexpected: {sorted(actual_themes-THEMES)}")
if len(pages) != 19: ERRORS.append(f"Expected homepage + 18 theme pages, found {len(pages)}")
if len(declared_themes) < 18: ERRORS.append(f"Expected 18 page-wide theme selectors, found {len(declared_themes)}")
for feature in ('name="description"', 'application/ld+json', 'Hariom Patel', 'Haryomix', 'Hariom AI'):
    if feature not in (ROOT / "index.html").read_text(encoding="utf-8"): ERRORS.append(f"Homepage missing required content: {feature}")
for selector in (".p-hero-grid", ".p-project-grid", ".p-lab-shell", ":focus-visible", "prefers-reduced-motion", "@media"):
    if selector not in css: ERRORS.append(f"Stylesheet missing expected support: {selector}")
for feature in ("p-menu", "signal-lab", "reading-progress", "aria-pressed"):
    if feature not in js: ERRORS.append(f"JavaScript missing expected feature marker: {feature}")
if not re.search(r'@media\s*\(max-width:\s*(?:760|480)px\)', css):
    ERRORS.append("Responsive breakpoints at 760px/480px not found")

print(f"Checked {page_count} HTML pages ({len(actual_themes)} theme pages), local assets, IDs, anchors, metadata and theme CSS.")
if ERRORS:
    print(f"QA FAILED: {len(ERRORS)} error(s)")
    for e in ERRORS: print(" -", e)
    sys.exit(1)
print("QA PASSED: no static repository-wide issues found.")
print("Note: static checks do not replace real browser interaction, visual, accessibility or performance testing.")
