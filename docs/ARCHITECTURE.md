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
- `tests/performance.mjs` — non-deploying paired Playwright profiler for rAF callbacks versus WebGL draws, workload stages, heap and cold/warm/offline loading (development only; not runtime instrumentation).
- `tests/performance-compare.mjs` — deterministic negative-case regression for the trace comparison contract (rejects mismatched DPR, GPU, stage names and profiling settings).

`.github/workflows/pages.yml` tests local production files, assembles `_site/`, deploys GitHub Pages on pushes to **`main`**, and checks the deployed URL. Its assembly copies `assets/` wholesale, so the independent listening page can be served without changing the deployment workflow. `.github/workflows/review.yml` runs on pushes to three **historical, explicitly named** review branches; a new arbitrary feature branch does not currently acquire CI automatically. Report the absence of an automated run rather than claiming it passed.

See [Engineering workflow](ENGINEERING_WORKFLOW.md) for focused checks and release controls, and [Development state](DEVELOPMENT_STATE.md) for time-qualified evidence.

## Contextual UI verification (issue #9)

- `tests/ui-accessibility.mjs` exercises contextual state, keyboard/touch, Help/Certificate/Cinema focus, reduced motion and responsive menu positions.
- `.github/workflows/review.yml` runs non-deploying Chromium tests for PRs targeting `main`; historical review branch triggers and room visual probes remain. Verify the actual current workflow and job conclusion, not its mere presence.

## 10.2.1 integration maintenance

- `tests/maintenance.mjs` guards package/lock version, HTML module URLs, service-worker cache/precache membership and the complete declared test roster.
- The combined source includes issue #6 lighting, issue #7 room shell, issue #9 contextual UI, issue #8 profiling and issue #10 state/maintenance checks. Review whole-scene behavior and CI on the final commit, not just independent PR artifacts.

## Historical legacy behavior and contradiction register (issue #10, pre-integration, 2 November 2026)

This register distinguishes historical *appearance* from real defects; the audited baseline is `main` at `9b95387f4e2e`. This is a baseline record; issue #9 has since changed the HUD, and the 10.2.1 combined source supersedes the old working-state descriptions. Recheck actual source for current behavior.

| Item / source | Classification and evidence | Decision / ownership |
| --- | --- | --- |
| V10 cinema badge / `index.html` | **Intentional feature-era label.** Package/lockfile, loaded module URLs and offline cache consistently identify release 10.1.1; the plaque describes the V10 cinematic bureau. | **Retain** artistic badge; no false requirement to display the patch release. |
| Hidden `#cross` / `index.html`, `styles.css` | **Dormant UI artifact, not a demonstrated gameplay bug.** V8 CSS explicitly hides the earlier crosshair, and no current JavaScript consumes that element. | **Retain pending issue #9** HUD redesign; removal would overlap its markup/style ownership for no player benefit. |
| Layered HUD CSS / `styles.css` | **Legacy cascade, partly deliberate.** V8/V9 overrides and responsive media queries are still the effective current stylesheet; duplication alone is not a behavior regression. | **Do not blindly consolidate.** Issue #9 owns visual hierarchy, computed-style/viewport evidence, and responsive cleanup. |
| Nine checks vs “five suites” / `docs/QUALITY_STANDARDS.md` | **Confirmed documentation defect.** The npm test script declares nine checks on 10.1.1. | **Correct** the maintained guide; link to the actual script and guard its references. |
| PR #5 pre-merge status / `docs/DEVELOPMENT_STATE.md` | **Confirmed chronology drift.** Historical source correctly describes PR #5 before merge, but a current reader would miss its 2 November merge and successful exact-head Pages run. | **Correct** current snapshot **without rewriting dated evidence**. |
| PR review CI branch filter / `.github/workflows/review.yml` | **Maintenance gap in `main` baseline.** The old push-only filter excluded new PR heads from the full review suite. | **Add pull-request-to-main trigger**; preserve historical push triggers, and do not change Pages release workflow. Sibling PRs #14/#15 also edit this workflow and must reconcile their changes serially. |
| Document lifecycle / `js/app.js` | **Retained contract, no new contradiction reproduced by source review.** The busy guard prevents repeated processing; file selection invalidates the previous receipt; reset is refused mid-cycle. Local storage holds the capped issued number, while the visible tray is capped separately. | **Retain** mechanics. Existing acceptance tests exercise no-file, processing, receipt, reset, persistence and offline; add an explicit post-reload filename-privacy assertion. |
| Paper, stamp and corridor / `js/app.js`, `js/audio.js` | **Retained after proven V10.1/10.1.1 repairs.** Output progression is bounded per frame; audio begins after gesture; a 500ms *bounded* interval schedules occasional corridor effects, not uncontrolled render polling. | **Retain** and leave mechanical/audio optimization to verified defects rather than speculation; original motion and cooldown tests stay authoritative. |
| Cinematic paths and photography / `js/cinematic.js` | **Intentional subsystem.** Eight obstacle-aware views, a tour and scene-only PNG output were explicitly introduced and tested in PR #3. | **Retain**; issue #9 owns control presentation, while issue #7 owns any changed collision geometry. |
| Versioned offline shell and standalone sound page / `service-worker.js` | **Intentional separation**, repaired in PR #5. Required game assets are precached; optional listening-room navigation cannot overwrite game-shell HTML. | **Retain** cache behavior; new release checks ensure cache/version URL cohesion. Cache profiling belongs to issue #8. |

**Integration boundary:** issue #10's checks currently validate its own candidate against `main` at `9b95387f4e2e`. Other unmerged polishing work overlaps `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT_STATE.md` (#12–#15), `docs/QUALITY_STANDARDS.md` (#13), `.github/workflows/review.yml` (#14/#15), `package.json`/`tests/acceptance.mjs` (#13–#15). PR #13 and PR #15 each propose version 10.1.2 independently while PR #14 proposes 10.2.0; these cache/version edits must be reconciled after serial integration. Per the cross-issue coordination comment, rebase issue #10 after the other feature changes stabilize and rerun its checks, particularly persistence, UI/keyboard, PWA cache, camera and audio. Neither independent green CI nor this audit certifies the combined result.

**Verification boundary:** static source inspection cannot establish correct computed CSS, real audio quality, physical-device experience, or full gameplay behavior. Use the executable Node and browser gates for those claims, and keep separate statuses for proposed/implemented/tested/merged/published/device verified.

## Bureau display language / accessible English

The owner-directed Russian-first typography is authored in `index.html`, `js/app.js` and `js/cinematic.js`, with the governing editorial rules in [Language style](LANGUAGE_STYLE.md). Machine plates, input/output paper and the PNG certificate remain authentic Cyrillic. Visible `#hint` and `#cinemaStatus` carry fictional lettering with `aria-hidden`; `#srStatus` and `#srCinemaStatus` carry independent readable spoken announcements. Control `aria-label` values, dialog names and user-selected filename bytes are not themed. `tests/language-style.mjs` guards these distinctions; the UI and acceptance browser suites exercise live updates.
