# Ο Διαβήτης — Digital Library

A clean three-stage web application for the National Grand Lodge of Greece.

## Flow

1. **Welcome** — full-screen welcome image. Automatically advances after 7 seconds or immediately by button.
2. **Library Access Verification** — Vatican-inspired guarded entrance. Greek, English and Spanish instructions, email field, OTP field, and production-ready API hooks. Demo mode currently allows direct entry.
3. **The Real Library** — the library image with clickable annual positions, 3D book-out animation, issue modal, and the gold-symbol link to the related digital library.

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
