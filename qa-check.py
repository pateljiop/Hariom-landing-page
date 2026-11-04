#!/usr/bin/env python3
"""Static repository-wide QA for Hariom's 19-world personal portfolio."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
ERRORS = []
EXPECTED_WORLDS = {
    "studio", "terminal", "editorial", "brutalist", "cinema", "minimal",
    "playful", "retro", "swiss", "neon", "nature", "dashboard",
    "magazine", "mono", "pixel", "future", "blueprint", "office", "netflix",
}

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.anchors, self.assets, self.templates = [], [], [], []
        self.template_pressed, self.links = [], []
        self.world_page = self.landing_theme = None
        self.title = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"): self.ids.append(a["id"])
        if tag == "a":
            href = a.get("href", "")
            self.links.append(href)
            if href.startswith("#") and len(href) > 1: self.anchors.append(href[1:])
        if tag == "script" and a.get("src"): self.assets.append(a["src"])
        if tag == "link" and a.get("rel") == "stylesheet" and a.get("href"): self.assets.append(a["href"])
        if "data-template" in a:
            self.templates.append(a["data-template"])
            self.template_pressed.append(a.get("aria-pressed"))
        if "data-world-page" in a: self.world_page = a["data-world-page"]
        if "data-landing-theme" in a: self.landing_theme = a["data-landing-theme"]
    def handle_endtag(self, tag):
        if tag == "title": self.title = True

html_files = [ROOT / "index.html", *sorted((ROOT / "worlds").glob("*.html"))]
for required in ("styles.css", "script.js", "README.md"):
    if not (ROOT / required).is_file(): ERRORS.append(f"Missing {required}")
if not (ROOT / "worlds").is_dir(): ERRORS.append("Missing worlds/ directory")
world_names = set()

for page in html_files:
    rel = page.relative_to(ROOT).as_posix()
    raw = page.read_text(encoding="utf-8")
    parser = PageParser()
    try: parser.feed(raw)
    except Exception as exc: ERRORS.append(f"{rel}: HTML parse error: {exc}")
    duplicates = sorted(name for name, count in Counter(parser.ids).items() if count > 1)
    if duplicates: ERRORS.append(f"{rel}: duplicate IDs: {', '.join(duplicates)}")
    missing = sorted(set(parser.anchors) - set(parser.ids))
    if missing: ERRORS.append(f"{rel}: broken in-page anchors: {', '.join(missing)}")
    if not parser.title: ERRORS.append(f"{rel}: missing <title>")
    if 'name="viewport"' not in raw: ERRORS.append(f"{rel}: missing responsive viewport meta")
    for href in parser.links:
        if not href or href == "#" or href.startswith(("#", "https://", "http://", "mailto:", "tel:", "data:", "javascript:")): continue
        target = (page.parent / href.split("#", 1)[0].split("?", 1)[0]).resolve()
        if not target.is_file(): ERRORS.append(f"{rel}: missing local link target {href}")
    if page.name == "index.html":
        for feature in ("landing-studio", "template-grid", "template-preview", "template-count",
                        "template-style-title", "template-style-description", "template-open-world",
                        "Hariom Patel", "Haryomix", "Hariom AI", 'aria-label="Main navigation"'):
            if feature not in raw: ERRORS.append(f"index.html: missing {feature}")
        if len(parser.templates) != len(EXPECTED_WORLDS):
            ERRORS.append(f"index.html: expected 19 preview buttons, found {len(parser.templates)}")
        if set(parser.templates) != EXPECTED_WORLDS:
            ERRORS.append(f"index.html: selector mismatch; missing {sorted(EXPECTED_WORLDS-set(parser.templates))}, extra {sorted(set(parser.templates)-EXPECTED_WORLDS)}")
        if parser.template_pressed.count("true") != 1 or any(v not in ("true", "false") for v in parser.template_pressed):
            ERRORS.append("index.html: expected exactly one initial aria-pressed=true selector button")
        for asset in ("styles.css", "script.js"):
            if asset not in parser.assets: ERRORS.append(f"index.html: missing {asset}")
        if 'href="#landing-studio"' not in raw: ERRORS.append("index.html: Studio missing from main navigation")
    else:
        theme = page.stem
        world_names.add(theme)
        if parser.world_page != theme: ERRORS.append(f"{rel}: wrong html data-world-page marker")
        if parser.landing_theme != theme: ERRORS.append(f"{rel}: wrong body data-landing-theme marker")
        if not re.search(r"document\.documentElement\.dataset\.worldPage=['\"]" + re.escape(theme) + r"['\"]", raw):
            ERRORS.append(f"{rel}: wrong inline worldPage marker")
        if "../styles.css" not in parser.assets: ERRORS.append(f"{rel}: missing ../styles.css")
        if "../script.js" not in parser.assets: ERRORS.append(f"{rel}: missing ../script.js")
        if not re.search(r'href="\.\./index\.html#landing-(?:studio|entry)"', raw):
            ERRORS.append(f"{rel}: missing world selector return link")
        if not re.search(r"<main\b", raw): ERRORS.append(f"{rel}: missing main landmark")

if world_names != EXPECTED_WORLDS:
    ERRORS.append(f"world pages mismatch; missing {sorted(EXPECTED_WORLDS-world_names)}, extra {sorted(world_names-EXPECTED_WORLDS)}")

js = (ROOT / "script.js").read_text(encoding="utf-8") if (ROOT / "script.js").exists() else ""
css = (ROOT / "styles.css").read_text(encoding="utf-8") if (ROOT / "styles.css").exists() else ""
readme = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").exists() else ""
if "const worlds = [" in js:
    block = js.split("const worlds = [", 1)[1].split("];", 1)[0]
    entry_worlds = set(re.findall(r"\['([a-z-]+)'", block))
    if entry_worlds != EXPECTED_WORLDS: ERRORS.append("script.js: entry selector does not match the 19 page IDs")
else: ERRORS.append("script.js: missing entry selector")
if "const concepts = {" in js:
    block = js.split("const concepts = {", 1)[1].split("};", 1)[0]
    preview_worlds = set(re.findall(r"^\s*([a-z-]+): \[", block, re.M))
    if preview_worlds != EXPECTED_WORLDS: ERRORS.append("script.js: live preview concept map does not match the 19 page IDs")
else: ERRORS.append("script.js: missing preview concept map")
for selector in (".p-template-layout", ".p-template-grid", ".p-template-preview", ".theme-blueprint",
                 'data-world-page="blueprint"', 'data-landing-theme="blueprint"',
                 ":focus-visible", "prefers-reduced-motion", "@media(max-width:760px)"):
    if selector not in css: ERRORS.append(f"styles.css: missing {selector}")
for feature in ("template-open-world", "worlds/' + id + '.html"):
    if feature not in js: ERRORS.append(f"script.js: missing preview navigation behaviour {feature}")
if "19 selectable" not in readme.lower(): ERRORS.append("README.md: document 19 selectable directions")
if "Blueprint Workshop" not in readme: ERRORS.append("README.md: document Blueprint Workshop")

if ERRORS:
    print(f"QA FAILED: {len(ERRORS)} issue(s)")
    for error in ERRORS: print(" -", error)
    sys.exit(1)
print(f"QA PASSED: {len(html_files)} HTML pages checked (homepage + {len(world_names)} themed worlds).")
print("Checked selector/page/preview parity, duplicate IDs, anchors, local links, assets, landmarks and responsive/reduced-motion hooks.")
print("Static source QA only; no real-device browser, automated accessibility or performance audit is claimed.")
