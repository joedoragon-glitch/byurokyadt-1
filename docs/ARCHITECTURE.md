# Architecture and source ownership

**БЮРОКЯДТ-1 · Maintained technical map.** Read actual source before editing; this file is a routing guide, not a substitute for implementation inspection.

## Runtime and entry points

- `index.html` — game shell, contextual operator controls, secondary Menu and native help/certificate dialogs, boot/loading UI and script loading order.
- `styles.css` — quiet desktop/mobile HUD, secondary settings, state-specific operator strip, focus/contrast/touch targets and visual presentation.
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

## Office lighting and shadow ownership

`js/app.js` owns the fixed shadow rig: one cool, shadow-casting directional interior key, a fitted orthographic shadow camera spanning the occupied 12 × 14 office, and unshadowed warm practical lights. The key's shadow-space origin is moved along its existing direction to keep the whole scene inside its near/far range; its orientation, color and energy are preserved. The five solid enclosing shell surfaces receive interior prop shadows but do not cast artificial roof/wall darkness against the simulated key. Desktop maps are 2048²; narrow/mobile maps are 1024². Tiny screw heads, shallow concrete seams and flush form-tie marks do not contribute shadow casts; this preserves their surfaces while avoiding work for implausible micro-shadows. The mechanical press and output paper remain eligible for dynamic shadowing. The shadow volume is static rather than following the operator, to avoid view-dependent flicker.

`tests/lighting-shadows.mjs` is a focused **paired baseline/candidate** Chromium diagnostic. It requires two separately served repositories (main at port 8000 and candidate at 8001), applies a test-only scene probe via Playwright request interception, checks world-space coverage at representative room points, drives real WASD movement, and saves desktop/mobile views plus intermediate press states and renderer metadata. This probe is not included in production. `.github/workflows/lighting-review.yml` provisions both checkouts, runs the paired diagnostic, then runs `npm test` without deploying. Headless SwiftShader/Chromium is not native-phone or physical-GPU evidence.

## Tests and deployment

`package.json` runs focused source checks and Chromium suites with `npm test`:
- `tests/documentation-links.mjs` — verifies cross-document local links and the required contributor entry points.
- `tests/audio-preview.mjs` — checks the seven OGG sources and isolates standalone/service-worker navigation.
- `tests/audio-corridor.mjs` — deterministic Web Audio unlock, background/approach priority, cooldown and mute.
- `tests/audio-preview-browser.mjs` — tests actual Chromium OGG decoding, player controls, cache isolation and offline reopen.
- `tests/room-shell.mjs` — evaluates actual room-finishing source with simple shape fakes, proving front-wall presence, four-wall junction treatment and camera clearance.
- `tests/room-visual.mjs` — candidate/baseline paired 360° desktop/mobile Chromium screenshots, camera matching and representative render draw-call/triangle samples; needs two local servers.
- `tests/camera-math.mjs` — real camera controller and obstacle map without a GPU.
- `tests/paper-path.mjs` — paper path geometry and stamp/UV registration without a browser.
- `tests/acceptance.mjs` — Playwright/Chromium game workflow, WebGL, offline, document, sound, export, persistence, collisions and viewports.
- `tests/cinematic.mjs` — browser cinematic behavior, photos and related checks.
- `tests/paper-motion.mjs` — rendered intermediate paper motion, stamping and corridor cues.

`.github/workflows/pages.yml` tests local production files, assembles `_site/`, deploys GitHub Pages on pushes to **`main`**, and checks the deployed URL. Its assembly copies `assets/` wholesale, so the independent listening page can be served without changing the deployment workflow. `.github/workflows/review.yml` runs on pushes to three **historical, explicitly named** review branches; a new arbitrary feature branch does not currently acquire CI automatically. Report the absence of an automated run rather than claiming it passed.

See [Engineering workflow](ENGINEERING_WORKFLOW.md) for focused checks and release controls, and [Development state](DEVELOPMENT_STATE.md) for time-qualified evidence.

## Contextual UI verification (issue #9)

- `tests/ui-accessibility.mjs` exercises contextual state, keyboard/touch, Help/Certificate/Cinema focus, reduced motion and responsive menu positions.
- `.github/workflows/review.yml` runs non-deploying Chromium tests for PRs targeting `main`; historical review branch triggers and room visual probes remain. Verify the actual current workflow and job conclusion, not its mere presence.
