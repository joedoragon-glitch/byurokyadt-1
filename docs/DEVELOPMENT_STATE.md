# Development state — БЮРОКЯДТ-1

**Maintained status snapshot, prepared 1 November 2026 and refreshed 2 November 2026.** Status is sourced from the repository at the stated checkpoints. Future changes must update this document when they affect current behavior or release claims.

## Latest repository and performance review checkpoint (2 November 2026 UTC)

- **Current released-source checkpoint:** `main` at `9b95387f4e2ee1966cfce7f1bc3ec9a66e4b0e9d`, package `10.1.1`, Three.js r152/WebGL, PWA cache `byurokyadt-v10-1-1`. [PR #5](https://github.com/joedoragon-glitch/byurokyadt-1/pull/5) was merged on 2 November 2026; exact-main [Pages and acceptance run #41392927312](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41392927312) passed. The following 1 November PR #5 candidate description is retained as **dated history**, not the present release status.
- **Current unmerged issue #8 work:** [PR #12](https://github.com/joedoragon-glitch/byurokyadt-1/pull/12) on branch `perf/issue-8-workload-profiling` introduces a non-deploying paired Chromium profiler and documented performance acceptance protocol. No player-facing runtime, artwork, audio, game data or service-worker asset was changed. Source review confirmed gated WebGL draws despite continuously scheduled rAF callbacks, bounded winter/clock/audio updates, instanced props and existing offline caches.
- **Measured early profiler and comprehensive regression evidence:** [CI run #41399820069](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41399820069) passed the base/candidate profiler and full existing `npm test` on first instrumentation commit `9db86edf394050cb2874cdc94d85b22187cf4ba0`. Software-rendered Chromium used ANGLE/SwiftShader, 960×680 DPR 1: 30-second idle 1,155 vs 1,159 rAF callbacks but only 26 vs 27 scene renders; a full physical document procedure rendered 77 frames on each and took 39.18 vs 38.98 seconds. Minor differences reflect uncontrolled run variation on identical runtime code, **not** claimed performance improvement or physical-device speed. Offline/audio/cinema/paper and source geometry regressions passed.
- **Instrument refinement:** The subsequent candidate includes WebGL buffer/texture resource-lifecycle counts, Chromium CDP JavaScript-heap sampling, lower-overhead browser polling and a CI checkout pinned to the exact PR head SHA. Read the PR's matching commit/run evidence for those refined measurements. These counters are diagnostics: headless SwiftShader render time is not hardware GPU time, and JavaScript heap does not measure VRAM. Without a material demonstrated runtime bottleneck, production rendering stays unchanged.
- **Unverified:** physical mobile/desktop/Chromebook latency, GPU throughput, power/thermals, native installed-PWA update behavior, and human visual/acoustic acceptance. PR #12 must not be merged or deployed without the owner's explicit authorization.

---

## Verified baseline before the documentation migration

- **Default branch:** `main` at `fe68d5e1fc579d899392baef10fa091674a28473`, committed **25 September 2026**, message: "Allow slow software renderers to complete the full paper cycle in acceptance."
- **Published-baseline package version:** `10.1.0`; the published service-worker cache was `byurokyadt-v10-1`. **PR #5 candidate:** package `10.1.1`, updated query-string assets and `byurokyadt-v10-1-1` offline cache. The candidate is not yet published.
- **Latest observed Pages workflow:** [run #36100805145](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/36100805145), **completed successfully** for that same `main` commit, with local/deployed verification steps in its workflow. This is historical CI evidence; it is **not** a fresh 1 November test or physical-device certification.
- **Open work when inspected:** the issue listing contained no independent open issues; the repository's four historical PRs #1–#4 were closed. New work should verify GitHub again before acting.
- **Runtime:** Three.js scene, V10.1 mechanical/paper path, eight cinematic inspection viewpoints, original sound, local issued counter, offline-capable PWA. See [README](../README.md), [Architecture](ARCHITECTURE.md), [AUDIT.md](../AUDIT.md).

## Documentation and listening-room proposal (1 November 2026 checkpoint)

[PR #5](https://github.com/joedoragon-glitch/byurokyadt-1/pull/5) proposes maintained AI guidance, a linked README/documentation map and a standalone seven-recording listening page. A narrow service-worker fix keeps standalone navigation separate from the cached game index. Source patch 10.1.1 also fixes an audio-startup/corridor-footstep race revealed by full browser CI and adds a targeted regression. Its cache revision isolates the new source from the old installed shell. At the time the PR was opened this work was **unmerged and unpublished**; this dated observation must not be interpreted as its continuing status. Follow the live PR, exact commit and Pages workflow to establish subsequent outcomes.

The listening room contains no new music, engine, online service or game-state integration. The new Pages route is live **only when** an authorized merge and a successful Pages publication confirm that version. Its standalone sound and game cache behavior require browser checks; actual speaker/iPhone/Chromebook listening is a distinct unverified experience.

## Pre-merge engineering audit (2 November 2026 UTC)

- [Focused PR review #41388488368](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41388488368) **passed** for source candidate `b162ea0cd810716902a132365cc04609fd08bf73`: 13 Markdown documents/102 local links, the seven original OGG references, deterministic delayed-unlock and corridor-priority tests, actual Chromium OGG decoding, one-at-a-time sound playback, Stop All, game/room cache isolation and desktop/mobile screenshots.
- [Full non-deploying game review #41388482279](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41388482279) **passed** on that same candidate: the original camera, geometry, machine-cycle, persistence, cinematic, paper-motion, corridor and offline acceptance suites, plus the added preview/browser checks.
- The previous failing runs were used to diagnose a real background-footstep/approach race and overly eager browser/test assertions. The three-line `js/audio.js` fix preserves original sound assets and the real paper-cycle logic. Earlier failures are historical evidence, not current passes.
- The final documentation cleanup and restoration of the historical `review.yml` branch filter do not alter the tested app, game tests, assets or package version. Verify the focused PR check on that documentation-only commit before merge.
- **No publication or real-device/acoustic certification is implied.** `main` and the public Pages build remain at the prior verified baseline until the owner explicitly authorizes merge. Device audio quality, physical iPhone/Chromebook performance and installed PWA update behavior remain unverified.

## Ongoing accuracy rules

Use exact commit and CI run URLs for **tested**, GitHub PR state for **merged**, Pages job results for **published**, and physical-device observation for **device verified**. An installed browser app may retain older cached content. Document unperformed listening and handset/Chromebook checks explicitly. If a candidate or next phase changes, update its current guide instead of appending another contradictory "latest" block. Historical source and review logs remain in [AUDIT.md](../AUDIT.md).
