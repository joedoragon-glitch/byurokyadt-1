# Performance profiling and acceptance — issue #8

**Status:** candidate instrumentation on branch perf/issue-8-workload-profiling (not merged, released or device-verified). Scope: CPU/WebGL workload, memory and asset/cache efficiency. Related review: [issue #8](https://github.com/joedoragon-glitch/byurokyadt-1/issues/8). Last reconciled production base: main at 9b95387f4e2ee1966cfce7f1bc3ec9a66e4b0e9d (2 November 2026).

## Source-backed hypotheses, not automatic optimization orders

- js/app.js creates one Three.js r152 WebGL renderer, caps DPR and configures mobile shadows. Its rAF loop **always schedules another callback**, but calls renderer.render on needsFrame; a callback is not a GPU draw. Hidden tabs skip scene updates. Direct renders for boot and photography are intentional.
- Winter updates about once per second except for a five-second passing glow (~0.12 s); the clock updates every ten seconds; js/audio.js has a guarded 500-ms room scheduler. These are bounded, not demonstrated runaway polling.
- The output paper surface changes shape each feed/delivery step; normals and hit bounds must remain correct. Existing screws and paper stacks use instancing. Preserve the leading edge, stamp contact and supported ejection, even on a slow renderer.
- The PWA already precaches shell assets, fetches static resources cache-first and treats standalone navigation separately. The independent audio-listening page is not the cached game shell.
- Shadow appearance belongs to issue #6 and room art to #7. Issue #8 may profile costs but must not silently remove visual quality.

## Reproduce the workload

Install Node 22, Python 3 and Playwright Chromium, then from repository root:

    npm ci --ignore-scripts
    npx playwright install chromium
    python3 -m http.server 8000

In a second terminal:

    node tests/performance.mjs --base=http://127.0.0.1:8000/ --label=local --out=test-results/performance/local.json --idle-ms=30000

The harness exercises cold boot, 30-second idle, keyboard walking, eight animated cinematic view transitions, reduced-motion idle, sound-on idle and decode, the complete document procedure, warm reload, offline reload and post-offline idle. It checks rendering initialization, certificate production, PWA cache and browser errors, and saves JSON traces/screenshots in test-results/performance/. To compare identical workloads:

    node tests/performance.mjs --compare=test-results/performance/base.json --candidate=test-results/performance/candidate.json --out=test-results/performance/compare.json

The Issue 8 performance review pull-request workflow runs the script against base and candidate in isolated local static servers with the same browser/version, viewport, DPR and instrumentation. Each JSON trace retains its **exact checked-out source commit SHA**. Comparison rejects mismatched browser, WebGL renderer, viewport/DPR, idle duration, or stage names rather than quietly presenting unrelated measurements as paired. `node tests/performance-compare.mjs` verifies both valid comparisons and intentional mismatches without launching Chromium. The workflow runs existing comprehensive regressions, does not deploy, and uploads JSON/screenshots even on failure.

## What the numbers establish — and what they do not

Record exact browser, UA, viewport/DPR, WebGL version/vendor/renderer (including software-vs-hardware identification where available), wall time, rAF requests/callbacks, callback wall-time samples, actual game render count, wrapped WebGL draw submissions, draw calls/triangles on the *last* rendered Three.js frame, reported JS heap where available, and service-worker-served responses plus asset paths. A continuously scheduled callback with zero redraws is not 60 FPS of GPU work.

Wrapped WebGL functions impose instrumentation overhead on both builds. Callback wall-time can include driver stalls; it is not pure JavaScript CPU time. The last frame's draw/triangle counts do not measure GPU milliseconds. JavaScript heap is not GPU texture memory. Locally decoded poster blob: object URLs are classified as local resources, not network responses; offline reload asserts zero uncached network responses (the cache may still serve SW-controlled resources). Headless software rendering cannot establish native hardware throughput, input-to-photon delay, thermals, power or speaker performance. One sample is diagnostic rather than a statistically established improvement; repeat suspect stages under matched conditions.

For physical review, record device, OS, GPU, browser, viewport/DPR, thermals, audio state, reduced motion, installed/browser context, visibility and observed input responsiveness. Do not invent FPS thresholds.

## Acceptance

Optimize only measured, reproducible costs with a concrete root cause, then compare the same interactions and preserve appearance. Relevant regression owners include tests/paper-path.mjs and tests/paper-motion.mjs (continuous output/stamp), tests/camera-math.mjs and tests/cinematic.mjs (camera/collisions), tests/audio-corridor.mjs (causal audio) and tests/acceptance.mjs plus tests/audio-preview-browser.mjs (shell/offline). No quality trade-off is acceptable solely for a benchmark win.

If no material bottleneck is demonstrated, retain production code and ship the reproducible profiler and evidence rather than speculative speedups. Record actual results in the PR and [maintained status](DEVELOPMENT_STATE.md). This guide defines repeatable method; it does not certify an unexecuted run.

## Concurrent polishing PR integration checkpoint (2 November 2026)

The [issue #8 coordination comment](https://github.com/joedoragon-glitch/byurokyadt-1/issues/8#issuecomment-6570536925) defines a serial, owner-authorized integration plan. At the review checkpoint main is `9b95387f4e2ee1966cfce7f1bc3ec9a66e4b0e9d`; PR #12 is independently validated against that base only. There is no reason to rebase while main is unchanged.

- [PR #13 / lighting](https://github.com/joedoragon-glitch/byurokyadt-1/pull/13) changes the directional shadow-frustum configuration and desktop map area (1536² to 2048²). Reprofile matched camera, shadow and mechanical work after integration; do not assume its software WebGL cost represents a physical GPU.
- [PR #14 / environment](https://github.com/joedoragon-glitch/byurokyadt-1/pull/14) adds office shell/prop geometry. Its separate Chromium evidence reports roughly 337 to 383 draw calls in a wide view; compare a **new** post-integration baseline rather than mixing it with pre-change #8 numbers.
- [PR #15 / interface](https://github.com/joedoragon-glitch/byurokyadt-1/pull/15) moves optional sound and cinematic controls behind a menu. The #8 profiler uses the real menu path when present and the original controls otherwise, but this combined path is **not yet validated** because #15 is unmerged; rerun after its authorized integration.
- [PR #11 / maintenance](https://github.com/joedoragon-glitch/byurokyadt-1/pull/11) edits the same maintained architecture/development-status documents and adds release/cache guards. Reconcile duplicate status records and ensure the latest version/cache metadata before merging #8 after the other work.

The four PRs share package/version/cache and documentation concerns with each other. PR #12 changes no runtime files, versioned game URLs, assets, service-worker cache or gameplay code, so it cannot resolve or certify their combined production behavior. Current-main CI passing for each independent PR does **not** establish a combined pass. After owner-authorized #13/#14 integration, update #12 from new main, rerun the paired performance harness plus relevant shadow/room/offline/complete-cycle regressions, and inspect screenshots/trace data before final merge authorization. No branch combination, deploy or merge is authorized by this checkpoint.
