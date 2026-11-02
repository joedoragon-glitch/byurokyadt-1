# Architecture and source ownership

**БЮРОКЯДТ-1 · Maintained technical map.** Read actual source before editing; this file is a routing guide, not a substitute for implementation inspection.

## Runtime and entry points

- `index.html` — game shell, controls, boot/loading UI, certificate dialog and the script loading order.
- `styles.css` — desktop/mobile HUD, overlay, player controls and visual presentation.
- `js/app.js` — authoritative Three.js scene, cabinet and office geometry, paper path, animation, interaction, collision, document-processing state, certificate capture and persistence hooks.
- `js/cinematic.js` — eight inspection shots, routes, camera transitions, movement and photo controls. Uses real room obstacle geometry.
- `js/audio.js` — Web Audio context, audio unlock, original recorded samples, generated winter effects, source positioning, audio buses and lifecycle. It exposes `window.MinistryAudio`.
- `vendor/three.min.js` — vendored Three.js runtime, not a PixiJS project or an online CDN.
- `assets/` and `icons/` — posters, enamel texture, original OGG assets and PWA icons. `assets/audio-preview.html` is an **independent listening page**, not part of the game boot path.
- `manifest.webmanifest`, `service-worker.js` — installation metadata and offline caching. The service worker's versioned cache list is curated, so changed runtime assets require careful cache review.
- `scripts/build_audio.py` — reproducible source generator for the original recorded mechanical effects and score; requires NumPy, SciPy and ffmpeg.

No application backend, telemetry or document-upload endpoint is part of the project.

## Real gameplay path and boundaries

The user picks a local file; the program displays and records its **filename**, not its contents. The machine feeds paper, stamps it at contact and places the certificate in the receiving tray. Paper geometry and stamp registration have an explicit arc-length surface and timing constraints. A saved issued total lives in local browser storage; the tray is a bounded visual representation. Actual camera clearance and interaction targets are defined by production scene geometry.

Follow `js/app.js` when changing processing, counter/tray, collisions or geometry; `js/cinematic.js` for inspection motion; `js/audio.js` for game sound. Review all touched interfaces when a change crosses these boundaries. A separate audio preview must not reference game saves or `window.MinistryAudio` to function.

## Tests and deployment

`package.json` runs six suites with `npm test`:
- `tests/audio-preview.mjs` — verifies the listening page's seven local sources and protects the offline game shell.
- `tests/camera-math.mjs` — real camera controller and obstacle map without a GPU.
- `tests/paper-path.mjs` — paper path geometry and stamp/UV registration without a browser.
- `tests/acceptance.mjs` — Playwright/Chromium game workflow, WebGL, offline, document, sound, export, persistence, collisions and viewports.
- `tests/cinematic.mjs` — browser cinematic behavior, photos and related checks.
- `tests/paper-motion.mjs` — rendered intermediate paper motion, stamping and corridor cues.

`.github/workflows/pages.yml` tests local production files, assembles `_site/`, deploys GitHub Pages on pushes to **`main`**, and checks the deployed URL. Its assembly copies `assets/` wholesale, so the independent listening page can be served without changing the deployment workflow. `.github/workflows/review.yml` runs on pushes to three **historical, explicitly named** review branches; a new arbitrary feature branch does not currently acquire CI automatically. Report the absence of an automated run rather than claiming it passed.

See [Engineering workflow](ENGINEERING_WORKFLOW.md) for focused checks and release controls, and [Development state](DEVELOPMENT_STATE.md) for time-qualified evidence.
