"""Safely integrate the Word Imposter spotlight into an existing FLUX Studios clone.

Run from the repository root: python tools/add_word_imposter.py
The script is idempotent and intentionally touches only index.html and README.md.
"""
from pathlib import Path
import sys
import re

root=Path(__file__).resolve().parents[1]
index=root/'index.html'
readme=root/'README.md'
if not index.exists():
    sys.exit('Missing index.html. Extract this add-on into the root of the flux-studios clone.')
html=index.read_text(encoding='utf-8')
css='<link href="assets/css/word-imposter.css" rel="stylesheet"/>'
needle='<link href="assets/css/studio-home.css" rel="stylesheet"/>'
if needle not in html and css not in html:
    sys.exit('The homepage stylesheet marker changed. Left index.html untouched for safety.')
anchor='<div class="upcoming-head">'
if anchor not in html and 'id="wiLaunchTitle"' not in html:
    sys.exit('The Game Library insertion point changed. Left index.html untouched for safety.')
spotlight='''<!-- BEGIN WORD IMPOSTER — LIVE GAME -->
<article class="wi-spotlight" aria-labelledby="wiLaunchTitle">
  <div class="wi-copy">
    <span class="wi-eyebrow"><span class="wi-live-dot"></span> LIVE ONLINE / MULTIPLAYER PARTY GAME</span>
    <h3 id="wiLaunchTitle">WORD<br/><span>IMPOSTER.</span></h3>
    <p>Everyone gets a secret word. One is different — and even that player doesn't know. Talk, type, suspect and find the imposter with friends.</p>
    <div class="wi-tags"><span>4–12 PLAYERS</span><span>LIVE VOICE + CHAT</span><span>PRIVATE GAME ROOMS</span></div>
    <div class="wi-actions">
      <a class="wi-button wi-button-primary" href="https://word-imposter-live.onrender.com/" target="_blank" rel="noopener noreferrer">Play Word Imposter <span aria-hidden="true">↗</span></a>
      <a class="wi-button wi-button-secondary" href="games/word-imposter/">Explore the game <span aria-hidden="true">→</span></a>
    </div>
  </div>
  <div class="wi-stage" aria-label="Illustration of five friends around a table with an unidentified secret word" role="img">
    <div class="wi-table"><div class="wi-card"><small>YOUR SECRET WORD</small><strong>??????</strong><b>WHO'S DIFFERENT?</b></div></div>
    <span class="wi-seat one">A<small>LISTENING</small></span><span class="wi-seat two active">M<small>ON MIC</small></span><span class="wi-seat three">P</span><span class="wi-seat four">R</span><span class="wi-seat five">N</span>
  </div>
</article>
<!-- END WORD IMPOSTER -->
'''
if css not in html:
    html=html.replace(needle,needle+css,1)
if 'id="wiLaunchTitle"' not in html:
    html=html.replace(anchor,spotlight+anchor,1)
old='One flagship title, more original and reimagined board games on the drawing board.'
new='Explore our flagship FLUX world, play Word Imposter online, and discover concepts taking shape.'
if old in html:
    html=html.replace(old,new,1)
# Build the detail page from the existing homepage's shared header, footer and modal.
# This keeps studio navigation, support, theme switching and mobile menu consistent.
template=(root/'tools'/'word_imposter_page_template.html').read_text(encoding='utf-8')
header=re.search(r'<header\b[^>]*id="ofsSiteHeader"[^>]*>.*?</header>', html, re.S)
footer=re.search(r'<footer\b[^>]*class="ofs-footer"[^>]*>.*?</footer>', html, re.S)
modal=re.search(r'<div aria-labelledby="ofsSupportTitle".*?(?=</body>)',html,re.S)
if not (header and footer and modal):
    sys.exit('Could not find existing header/footer/contact dialog. No files written.')
def subpage_links(fragment):
    return fragment.replace('href="./','href="../../').replace('src="./','src="../../')
page=template.replace('@@HEADER@@',subpage_links(header.group(0)))\
    .replace('@@FOOTER@@',subpage_links(footer.group(0)))\
    .replace('@@MODAL@@',modal.group(0))
if '@@' in page:
    sys.exit('Template placeholder unresolved. No files written.')
(root/'games'/'word-imposter').mkdir(parents=True,exist_ok=True)
(root/'games'/'word-imposter'/'index.html').write_text(page,encoding='utf-8')
index.write_text(html,encoding='utf-8')
if readme.exists():
    content=readme.read_text(encoding='utf-8')
    content=content.replace('across all five pages','across the studio pages').replace('The five HTML pages','The HTML pages')
    if '/games/word-imposter/' not in content:
        heading='## Pages'
        item='- `/games/word-imposter/` — Word Imposter live multiplayer party game overview; links to the separate Render-hosted game\\n'
        if heading in content:
            content=content.replace(heading,heading+'\n'+item.replace('\\n','\n'),1)
        else:
            content+='\n'+item.replace('\\n','\n')
        readme.write_text(content,encoding='utf-8')
print('Added/verified Word Imposter on homepage, generated game detail page and updated README.')
print('Next: preview locally, commit, then push your branch to GitHub.')
