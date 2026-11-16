# FLUX Studios — Unified GitHub Pages Site

One integrated, build-free static site with a **single shared navigation, footer, contact form, theme selector and studio identity** across all five pages.

## Pages
- `/` — FLUX Studios homepage, 3D crystal and game library
- `/games/flux-elements-awaken/` — FLUX: Elements Awaken game, modes, editions and card archive
- `/games/elemental-surge/` — Elemental Surge digital mode
- `/games/overdrive/` — Overdrive digital mode
- `/rules/flux-classic/` — Classic Universe physical card rulebook, kept stable for box QR code

## Contact
Every page has a Contact button and compact CTA that opens the **same Google Form** in a popup. The homepage retains the lime-green contact design. The visitor remains on the site; a new-tab fallback is provided. The form lives in Google Forms, and submissions reach the account configured in Forms. To change the form URL, edit `assets/js/site-config.js` once. In Google Forms, turn on response notification emails yourself.

## Theme
Flux Neon, Elemental Spectrum and Midnight Violet are shared across routes and saved locally in the visitor's browser.

## GitHub Pages (project repo)
1. Create a public GitHub repository (for example `flux-studios`).
2. Upload **the contents of this directory** to the repository root, not a second enclosing folder.
3. In GitHub Settings > Pages, select `Deploy from a branch`, branch `main`, folder `/(root)`.
4. Your site will typically be `https://USERNAME.github.io/flux-studios/`.
5. Confirm `https://USERNAME.github.io/flux-studios/rules/flux-classic/` opens on a phone before making the printed QR code.
6. All local URLs are relative so they work both in a repo subpath and at the domain root.

## Testing
The site is HTML/CSS/JavaScript only, no bundler and no paid hosting. Cross-page navigation and shared components can be checked locally by opening `index.html`; a local HTTP server is best for comprehensive tests. Fonts may require an internet connection; a system fallback remains. Google Forms iframe requires internet and that form's access be public.

## Future edits
The shared shell is maintained in `assets/css/site-shell.css` and `assets/js/site-shell.js`. The five HTML pages contain copies of the identical shared header/footer markup so navigation remains visible even if JS is off. Keep those in sync if editing manually; or update using the integration builder when available.

This does not deploy the site automatically; it is ready for you to upload and publish.

## Launch checklist for FLUX Studios

- Use the repository name `flux-studios`; make it Public for free GitHub Pages.
- Upload all files and folders in this directory directly to the repository root.
- In Settings > Pages select Deploy from a branch, branch `main`, and `/(root)`.
- Verify the Google Form is published and accepts public responses, then test the popup and form submission.
- Confirm all five pages and `/rules/flux-classic/` before printing the QR code.
