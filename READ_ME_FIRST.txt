FLUX STUDIOS — DEDICATED GAME LIBRARY UPDATE
===========================================

Designed to apply ON TOP OF the previous Word Imposter homepage integration.
Does NOT replace your homepage design, FLUX game pages, Word Imposter UI or 3D hero.
Does NOT change the separate Render-hosted Word Imposter server.

CHANGES:
- Removes the old "What's Coming Next?" block (Ludo Nexus / Hex Dominion concepts).
- Adds /games/ with two built titles: FLUX: Elements Awaken and Word Imposter.
- Updates "Our games" site navigation on existing pages to open /games/.
- Changes homepage "Explore our games" action to open the new library.
- Preserves Word Imposter homepage spotlight, its dedicated page, and the FLUX flagship.
- Reuses all existing 3 studio themes and shared site header/footer.

APPLY:
1) In VS Code, open your existing *flux-studios* clone (not word-imposter).
2) Ensure the prior Word Imposter add-on has already been applied.
3) If needed create a branch: git switch -c feature/games-library
4) Extract this ZIP into the ROOT of flux-studios, preserving the tools/ and assets/ folders.
   Example from a VS Code PowerShell terminal inside flux-studios:
   Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\Flux_Studios_Game_Library_Update.zip" -DestinationPath . -Force
5) Run: py -3 tools/update_games_library.py
   Or: python tools/update_games_library.py
6) Preview: py -3 -m http.server 5500
7) Visit: http://localhost:5500/games/
   Also verify: http://localhost:5500/ and http://localhost:5500/games/word-imposter/
8) Stop server Ctrl+C; inspect changes:
   git status
   git diff -- index.html
9) When satisfied:
   git add index.html README.md games assets/css/games-library.css tools/update_games_library.py tools/games_library_page_template.html
   git commit -m "feat: add dedicated games library and remove future concepts"
   git push -u origin feature/games-library  (or your existing feature branch)
   Open a PR and merge to main for GitHub Pages publication.

The script is idempotent. No pip/npm install needed.
It checks that the previous Word Imposter spotlight exists before changing anything.

WARNING: Word Imposter's Play Online button links to the public Render URL.
If your game is still in private beta, ensure beta access is active before publishing.
