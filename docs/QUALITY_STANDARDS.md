# Quality standards and acceptance boundaries

**Purpose:** Translate the owner's reusable visual, audio, gameplay and engineering quality principles into meaningful acceptance criteria for this **Three.js browser experience**. These are expectations, not claims that every future device has already passed.

## Visual and physical coherence

- Preserve the approved cabinet silhouette, original posters and material character. Compare in actual 3D views rather than treating source geometry or an isolated render as proof of appearance.
- Paper must emerge progressively, remain above the outlet surface, bend around its intended path, receive the red imprint **at physical stamp contact**, and finish in the tray. Inspect intermediate animation frames, especially at slow frame rates; an attractive final still cannot validate the journey.
- Machine motion should communicate weight: switch response, meter movement, press travel, recoil, feed and output timing should agree with the sound and object they represent.
- Camera routes and manual movement must respect furniture/wall clearance, maintain usable framing and restore the operator camera after cinematic inspection. Avoid clipping and tunneling.
- Visual changes should not alter document-processing rules, timing, counters or collisions merely to make a screenshot look better.
- Respect reduced-motion preferences, narrow/mobile layout and readable external controls. Stylized lettering does not replace accessible names or contrast.

## Audio and experience

Use [Audio direction](AUDIO_DIRECTION.md) for the creative sound contract. Keep effects tied to real causes and locations. Music and effects must remain independently controlled. Silence or audio failure must not prevent the machine's visual procedure. No automatic unmuted playback before a user gesture. Assess actual listening when possible; digital peaks, decode success and a green test do **not** certify enjoyable sound, speaker balance or long-session fatigue.

## Performance without sacrificing the scene

Keep the idle scene event-driven; do not redraw continuously when nothing changes. Avoid needless GPU geometry churn, disposable allocations in animation hot paths and excess draw calls **when profiling shows material impact**. Prefer instancing or stable geometry where it preserves the intended appearance.

Do not impose an arbitrary FPS threshold or equate a headless software renderer with an actual Chromebook, phone or GPU. Report device, browser, viewport, resolution and measurement method. Compare matched before/after interactions and images, then weigh visible fidelity and memory against performance. Quality regressions are not acceptable benchmark wins.

## Offline, privacy and durability

- Local file selection must not send file data to a service or persist private names/content unnecessarily. The current certificate uses the filename only.
- Keep the existing locally stored issued count and bounded receiving tray stable unless an explicit migration is authorized. Do not wipe local history during a cosmetic update.
- Preserve asset availability, service-worker update behavior and core offline play. The **optional listening room** has a distinct first-visit/offline scope; it must not replace or poison the cached game shell.
- Validate scene photo and certificate exports as actual image outputs; preserve render size and player UI state after capture.

## Evidence appropriate to the change

A geometry adjustment warrants `node tests/paper-path.mjs`, camera changes `node tests/camera-math.mjs`, and related actual browser paths when needed. Audio lifecycle, offline, or player interaction changes may need focused Playwright coverage. A docs/listening-page edit needs link, asset, HTML and offline-shell safety checks; use the real Chromium preview test when playback, browser compatibility or caching is affected. The `npm test` command runs the ordered Node and Chromium checks in `package.json` (nine on the original 10.1.1 release; ten with the issue #10 maintenance guard, plus any later explicitly added checks). The lightweight `tests/maintenance.mjs` check validates version/cache alignment and the test command itself. A full run is **not the default** for a small documentation pass.

For each milestone, state exactly what passed, what was reviewed visually or audibly, what hardware was actually checked, and what remains unverified. Historical evidence belongs in [AUDIT.md](../AUDIT.md); present claims belong in [Development state](DEVELOPMENT_STATE.md). Do not invent screenshots, music acceptance or a live deployment.
