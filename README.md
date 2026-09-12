# Ο Διαβήτης — Digital Library

A clean three-stage web application for the National Grand Lodge of Greece.

## Flow

0. **Grand Master's welcome message** — a dismissible pop-up shown on load, over page 1. Displays the Grand Master's letter in Greek and English by default, with 🇪🇸/🇧🇷 buttons to also reveal the Spanish and Portuguese translations. The page-1 countdown only starts once the visitor closes it (Continue button).
1. **Welcome** — full-screen welcome image. Automatically advances after 7 seconds or immediately by button.
2. **Library Access Verification** — Vatican-inspired guarded entrance. The unique gate background is shown alone for a few seconds first, then the Greek/English/Spanish instructions, email field, OTP field and buttons fade in over it. A countdown pill (`ACCESS_COUNTDOWN_SECONDS`, default 12s) auto-continues once it reaches zero, or the visitor can click anywhere on the background to continue immediately — both demo-mode only, real OTP verification is never skipped. Once the form is submitted (or demo entry is confirmed), the form fades out and the background is shown alone again for a few seconds before advancing. Timings are configurable via `ACCESS_REVEAL_DELAY_MS` / `ACCESS_EXIT_DELAY_MS` in `config.js` (default 4000ms each).
3. **The Real Library** — the library image with clickable annual positions, 3D book-out animation, issue modal, and the gold-symbol link to the related digital library. While `LIBRARY_PAGE_HIDDEN` is `true` in `config.js`, the bookshelf is skipped and the Year Browser opens directly instead (see below); set it to `false` to restore the normal bookshelf.
4. **Year Browser** — opened via the "Έτος · Year" pill (or automatically, per above). A dialog with an aristocratic gold-on-dark theme: an embedded embossed relief of the ΕΜΣΤΕ emblem as a background layer (not a discrete image), a year list with cover previews, and a footer with the eye-and-bridge "Η Γνώση Ενώνει · Knowledge Unites" emblem and credit line.

## Repository structure

```text
.nojekyll
index.html
styles.css
app.js
config.js
README.md
assets/
  welcome.jpg
  access-gate.jpg
  library-main.jpg
  nglg-emblem.jpg
  grand-master.jpg
  emblem-plaque.jpg
  emblem-watermark.webp
  emblem-watermark-dark.webp
  eye-bridge-emblem.png
docs/
  API_CONTRACT.md
```

## GitHub Pages

Open **Settings → Pages** and select:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

## Demo mode now

`config.js` has `DEMO_MODE: true`, so visitors can enter page 3 without verification.

## OTP mode later

When the secure backend is ready:

1. Set `DEMO_MODE: false`.
2. Set `API_BASE_URL`.
3. Implement the API contract in `docs/API_CONTRACT.md`.

Do not place the authorised-email database or secrets in this repository.
