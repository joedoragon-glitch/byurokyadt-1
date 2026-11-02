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

`package.json` runs focused source checks and Chromium suites with `npm test`:
- `tests/documentation-links.mjs` — verifies cross-document local links and the required contributor entry points.
- `tests/maintenance.mjs` — catches version/cache/asset-reference drift and missing or duplicated entries in the declared test command.
- `tests/audio-preview.mjs` — checks the seven OGG sources and isolates standalone/service-worker navigation.
- `tests/audio-corridor.mjs` — deterministic Web Audio unlock, background/approach priority, cooldown and mute.
- `tests/audio-preview-browser.mjs` — tests actual Chromium OGG decoding, player controls, cache isolation and offline reopen.
- `tests/camera-math.mjs` — real camera controller and obstacle map without a GPU.
- `tests/paper-path.mjs` — paper path geometry and stamp/UV registration without a browser.
- `tests/acceptance.mjs` — Playwright/Chromium game workflow, WebGL, offline, document, sound, export, persistence, collisions and viewports.
- `tests/cinematic.mjs` — browser cinematic behavior, photos and related checks.
- `tests/paper-motion.mjs` — rendered intermediate paper motion, stamping and corridor cues.

`.github/workflows/pages.yml` tests local production files, assembles `_site/`, deploys GitHub Pages on pushes to **`main`**, and checks the deployed URL. Its assembly copies `assets/` wholesale, so the independent listening page can be served without changing the deployment workflow. `.github/workflows/review.yml` runs on pushes to three **historical, explicitly named** review branches; a new arbitrary feature branch does not currently acquire CI automatically. Report the absence of an automated run rather than claiming it passed.

See [Engineering workflow](ENGINEERING_WORKFLOW.md) for focused checks and release controls, and [Development state](DEVELOPMENT_STATE.md) for time-qualified evidence.

## Legacy behavior and contradiction register (issue #10, inspected 2 November 2026)

This register distinguishes historical *appearance* from real defects; the audited baseline is `main` at `9b95387f4e2e`. Recheck source after any other polishing PR is merged.

| Item / source | Classification and evidence | Decision / ownership |
| --- | --- | --- |
| V10 cinema badge / `index.html` | **Intentional feature-era label.** Package/lockfile, loaded module URLs and offline cache consistently identify release 10.1.1; the plaque describes the V10 cinematic bureau. | **Retain** artistic badge; no false requirement to display the patch release. |
| Hidden `#cross` / `index.html`, `styles.css` | **Dormant UI artifact, not a demonstrated gameplay bug.** V8 CSS explicitly hides the earlier crosshair, and no current JavaScript consumes that element. | **Retain pending issue #9** HUD redesign; removal would overlap its markup/style ownership for no player benefit. |
| Layered HUD CSS / `styles.css` | **Legacy cascade, partly deliberate.** V8/V9 overrides and responsive media queries are still the effective current stylesheet; duplication alone is not a behavior regression. | **Do not blindly consolidate.** Issue #9 owns visual hierarchy, computed-style/viewport evidence, and responsive cleanup. |
| Nine checks vs “five suites” / `docs/QUALITY_STANDARDS.md` | **Confirmed documentation defect.** The npm test script declares nine checks on 10.1.1. | **Correct** the maintained guide; link to the actual script and guard its references. |
| PR #5 pre-merge status / `docs/DEVELOPMENT_STATE.md` | **Confirmed chronology drift.** Historical source correctly describes PR #5 before merge, but a current reader would miss its 2 November merge and successful exact-head Pages run. | **Correct** current snapshot **without rewriting dated evidence**. |
| PR review CI branch filter / `.github/workflows/review.yml` | **Maintenance gap.** Non-deploying suite listens only to three historical review branches, so new polishing PRs receive no automatic full gate. | **Add pull-request-to-main trigger**; preserve historical push triggers, and do not change Pages release workflow. |
| Document lifecycle / `js/app.js` | **Retained contract, no new contradiction reproduced by source review.** The busy guard prevents repeated processing; file selection invalidates the previous receipt; reset is refused mid-cycle. Local storage holds the capped issued number, while the visible tray is capped separately. | **Retain** mechanics. Existing acceptance tests exercise no-file, processing, receipt, reset, persistence and offline; add an explicit post-reload filename-privacy assertion. |
| Paper, stamp and corridor / `js/app.js`, `js/audio.js` | **Retained after proven V10.1/10.1.1 repairs.** Output progression is bounded per frame; audio begins after gesture; a 500ms *bounded* interval schedules occasional corridor effects, not uncontrolled render polling. | **Retain** and leave mechanical/audio optimization to verified defects rather than speculation; original motion and cooldown tests stay authoritative. |
| Cinematic paths and photography / `js/cinematic.js` | **Intentional subsystem.** Eight obstacle-aware views, a tour and scene-only PNG output were explicitly introduced and tested in PR #3. | **Retain**; issue #9 owns control presentation, while issue #7 owns any changed collision geometry. |
| Versioned offline shell and standalone sound page / `service-worker.js` | **Intentional separation**, repaired in PR #5. Required game assets are precached; optional listening-room navigation cannot overwrite game-shell HTML. | **Retain** cache behavior; new release checks ensure cache/version URL cohesion. Cache profiling belongs to issue #8. |

**Verification boundary:** static source inspection cannot establish correct computed CSS, real audio quality, physical-device experience, or full gameplay behavior. Use the executable Node and browser gates for those claims, and keep separate statuses for proposed/implemented/tested/merged/published/device verified.
