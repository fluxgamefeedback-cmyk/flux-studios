# Add Word Imposter to the FLUX Studios website

This is an **add-on**, not a replacement for your studio website. It was prepared from the `main` branch structure of `fluxgamefeedback-cmyk/flux-studios` reviewed on November 23, 2026. It preserves the homepage, FLUX: Elements Awaken, theme picker, shared header/footer, contact modal, 3D gateway and all other game pages.

## Install in a fresh VS Code window (Windows PowerShell)

1. Open a **new VS Code window** (`Ctrl+Shift+N`). Open the Command Palette (`Ctrl+Shift+P`), choose **Git: Clone**, enter `https://github.com/fluxgamefeedback-cmyk/flux-studios.git`, and select your preferred parent folder. Click **Open**.
2. In the VS Code terminal, create an isolated working branch:

   ```powershell
   git switch -c feature/add-word-imposter
   ```

3. **Extract this ZIP's contents into the cloned `flux-studios` root** (the folder containing `index.html` and `assets/`). Use "merge folders" if prompted. No pre-existing site files are replaced by the ZIP itself.
4. Run the integration script from the repository root:

   ```powershell
   python tools/add_word_imposter.py
   ```

   If your Windows launcher is `py`, use `py -3 tools/add_word_imposter.py`.

5. Preview locally using VS Code Live Server or:

   ```powershell
   python -m http.server 5500
   ```

   Open `http://localhost:5500/` and `http://localhost:5500/games/word-imposter/`.
6. After checking desktop/mobile navigation and the **Play Word Imposter** button, review:

   ```powershell
   git status
   git diff -- index.html README.md
   ```

7. Commit and push your feature branch, then review it on GitHub before merging into `main`:

   ```powershell
   git add index.html README.md assets/css/word-imposter.css games/word-imposter/index.html tools/add_word_imposter.py tools/word_imposter_page_template.html
   git commit -m "feat: add Word Imposter game to studio site"
   git push -u origin feature/add-word-imposter
   ```

   Open a pull request from the feature branch into `main`. Merging to `main` will update GitHub Pages if it publishes from that branch.

## Changes made

- Adds a responsive **Word Imposter** spotlight after the FLUX flagship feature, before the conceptual game list.
- Adds `/games/word-imposter/` with a dedicated detail page, how-to-play steps, and a link to the existing online game.
- Adds only one new stylesheet, `assets/css/word-imposter.css`, designed to use the existing studio theme variables.
- Reuses the original homepage header, footer and support modal in the new page by extracting them during installation.
- Updates the homepage Game Library description and the README.
- The patch is **idempotent**: running it again will not add a duplicate spotlight.

## Deployment and security notes

The existing game remains hosted separately at `https://word-imposter-live.onrender.com/`. **Do not** copy the Node.js game server, LiveKit credentials or `.env` into the static `flux-studios` repository. The new page only links to the hosted game.

**Important:** this adds a publicly visible link. If you want your Word Imposter beta to be invite-only, confirm `BETA_ACCESS_CODE` is configured and enforced in the *Word Imposter* Render service before publishing this site update.

If your homepage has changed significantly from the version reviewed, the installer will refuse to patch it rather than guess at a location. Contact the developer or update the anchor carefully.
