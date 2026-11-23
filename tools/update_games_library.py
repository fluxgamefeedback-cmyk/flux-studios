"""Add a dedicated Games Library to an existing Flux Studios / Word Imposter clone.

Run from the flux-studios repository root:
    py -3 tools/update_games_library.py

Requirements: first apply the Word Imposter spotlight add-on. No third-party packages.
This installer does not change game logic, images, or the site's existing design.
"""
from __future__ import annotations
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
DETAIL = ROOT / "games" / "word-imposter" / "index.html"
TEMPLATE = ROOT / "tools" / "games_library_page_template.html"
CSS = ROOT / "assets" / "css" / "games-library.css"
README = ROOT / "README.md"

if not all(p.is_file() for p in (INDEX, DETAIL, TEMPLATE, CSS)):
    sys.exit("Missing Word Imposter integration or Game Library update files. Make sure you extracted the ZIP into the *flux-studios* repository root and already applied the Word Imposter add-on.")

html = INDEX.read_text(encoding="utf-8")
if 'id="wiLaunchTitle"' not in html:
    sys.exit("Word Imposter spotlight was not found on the homepage. Apply the previous Word Imposter add-on first; no changes were made.")

# Remove ONLY the obsolete future-concepts subsection (not the Word Imposter spotlight or FLUX flagship).
if 'class="upcoming-head"' in html:
    html, removed = re.subn(
        r'\s*<div class="upcoming-head">.*?</div>\s*</section>',
        '\n</section>', html, count=1, flags=re.S
    )
    if removed != 1 or 'class="future-grid"' in html:
        sys.exit("The 'What's Coming Next' markup differs from the known version. Nothing was written. Share the current index.html so it can be updated safely.")
elif 'class="future-grid"' in html:
    sys.exit("Found an unexpected future-concepts block. Nothing was written.")

# Avoid contradicting the new list of published games.
html = html.replace(
    'Explore our flagship FLUX world, play Word Imposter online, and discover concepts taking shape.',
    'Explore FLUX: Elements Awaken and jump into Word Imposter with your friends.'
).replace(
    'One flagship title, more original and reimagined board games on the drawing board.',
    'Explore FLUX: Elements Awaken and jump into Word Imposter with your friends.'
)

# Preserve every original page design; only adjust 'Our games' destinations.
def update_nav(source: str, target: str, homepage: bool = False) -> str:
    def callback(match: re.Match[str]) -> str:
        before, after = match.group(1), match.group(2)
        if homepage:
            before = re.sub(r'\s*aria-current="page"', '', before)
        return before + 'href="' + target + '"' + after
    return re.sub(
        r'(<a\b(?:(?!>).)*?)\bhref="[^"]*"((?:(?!>).)*>\s*Our games\s*</a>)',
        callback, source, flags=re.I
    )

html = update_nav(html, './games/', homepage=True)
# The existing homepage hero's main Explore button should open the full library,
# while the homepage's featured cards remain accessible by scrolling.
html = html.replace('href="#games">Explore our games', 'href="games/">Explore our games')

# Build the library's header and footer from the *latest* studio home, rather than
# shipping an outdated copy of shared navigation, theme choices or support links.
header = re.search(r'<header\b[^>]*id="ofsSiteHeader"[^>]*>.*?</header>', html, re.S)
footer = re.search(r'<footer\b[^>]*class="ofs-footer"[^>]*>.*?</footer>', html, re.S)
modal = re.search(r'<div aria-labelledby="ofsSupportTitle".*?(?=</body>)', html, re.S)
if not (header and footer and modal):
    sys.exit("Could not identify the current studio header, footer or contact modal. Nothing was written.")

def library_links(part: str) -> str:
    return part.replace('href="./', 'href="../').replace('src="./', 'src="../')

library = TEMPLATE.read_text(encoding="utf-8")
library = (library.replace('@@HEADER@@', library_links(header.group(0)))
                  .replace('@@FOOTER@@', library_links(footer.group(0)))
                  .replace('@@MODAL@@', modal.group(0)))
if '@@' in library:
    sys.exit("Game Library template placeholders could not be resolved. Nothing was written.")

# Update only the 'Our games' link on other studio pages and the Word Imposter
# breadcrumb. This avoids silently overwriting any customized UI.
updates = {INDEX: html}
for path in sorted((ROOT/'games').glob('*/index.html')) + sorted((ROOT/'rules').glob('*/index.html')):
    source = path.read_text(encoding="utf-8")
    updated = update_nav(source, '../../games/')
    if path == DETAIL:
        updated = updated.replace('href="../../#games">GAME LIBRARY</a>', 'href="../../games/">GAME LIBRARY</a>')
    if updated != source:
        updates[path] = updated

# Keep the README aligned with the new location.
if README.exists():
    source = README.read_text(encoding="utf-8")
    if '- `/games/` —' not in source:
        marker = '## Pages\n'
        addition = '- `/games/` — dedicated, theme-aware game library listing built titles only (FLUX and Word Imposter)\n'
        if marker in source:
            source = source.replace(marker, marker+addition, 1)
        else:
            source += '\n' + addition
    updates[README] = source

# All preflight checks are above. Write only now.
for path, content in updates.items():
    if not path.exists() or path.read_text(encoding="utf-8") != content:
        path.write_text(content, encoding="utf-8")

LIBRARY_FILE = ROOT / 'games' / 'index.html'
if not LIBRARY_FILE.exists() or LIBRARY_FILE.read_text(encoding='utf-8') != library:
    LIBRARY_FILE.write_text(library, encoding='utf-8')

print('SUCCESS — Games Library created at games/index.html')
print('SUCCESS — Removed only the What\'s Coming Next concepts from homepage')
print('SUCCESS — Our games navigation now opens the dedicated Games Library')
print('SUCCESS — Word Imposter spotlight and FLUX flagship preserved')
print('Run: py -3 -m http.server 5500  (then open http://localhost:5500/games/)')
