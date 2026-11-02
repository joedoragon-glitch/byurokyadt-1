# Engineering workflow — from request to reviewable game change

This is the **maintained** procedure for БЮРОКЯДТ-1. It adapts the reusable engineering workflow from *So I Became the Dark Lord's Problem* while replacing all fantasy-game-specific instructions, test names, save schemas and engine assumptions with this repository's real source.

## 1. Confirm authority and intended outcome

Read the current request and [AGENTS.md](../AGENTS.md). Inspect `main`, any relevant open PR/issue and recent commits. Read [Development state](DEVELOPMENT_STATE.md), [Decisions](DECISIONS.md), [Architecture](ARCHITECTURE.md), and the pertinent design, sound and quality guide. Define the visible end result, non-goals, failure behavior and features that cannot regress. Historical feature authorization does not authorize a new merge.

## 2. Find the real code owner

Map scene/geometry/persistence to `js/app.js`, camera to `js/cinematic.js`, sound to `js/audio.js`, UI to `index.html` and `styles.css`, offline packaging to `service-worker.js`, and assets/generation to their actual files. Do not edit rendered outputs as though they were source recipes. Preserve approved references and authored originals.

## 3. Implement smallest coherent solution

Use a feature branch and one reviewable purpose per PR. A new feature must work via the real player path, not only a mock. Account for cancellation, muted audio, slow frame delivery, switching viewpoints, reload, offline recovery and local persistence **where relevant**, rather than imposing every lifecycle case on every tiny edit.

Do not add a dependency, renderer, server, new data store or extra workflow merely because the other game has one. For new assets, retain provenance and original; distinguish proposed appearance from owner-accepted artwork.

## 4. Test what matters

Use narrow, reproducible checks matched to the affected subsystem:

| Change | Focused evidence |
| --- | --- |
| Paper/press surface or sequence | `node tests/paper-path.mjs`, then relevant rendered motion checks |
| Cinematic routes or collisions | `node tests/camera-math.mjs`, then relevant browser cinematic checks |
| Core document/file/receipt/persistence | Relevant `tests/acceptance.mjs` behavior |
| Sound or environmental events | Relevant game/browser audio check and honest listening status |
| README, agent guides or audio-preview page | Run `node tests/documentation-links.mjs` and `node tests/audio-preview.mjs`; use `node tests/audio-preview-browser.mjs` when player/browser behavior changes |
| Release candidate | Broader `npm test` **only after explicit permission** |

`npm ci --ignore-scripts` installs development dependencies. Browser tests require Playwright Chromium and a local server at `http://127.0.0.1:8000/`. Do not claim completion of an unrun command or infer real device performance from headless Chromium.

When tests fail, keep the failing original assertion, tested SHA and actual logs. Reproduce and classify: a relevant unaccounted-for regression **blocks**, a proven independent small issue can be recorded as a bounded deferral, and an unclear relevant failure remains unresolved. No cosmetic green status is worth suppressing a real defect.

## 5. Keep documents in sync

A feature is not complete if its new behavior and current guidance contradict each other. Update affected README/player instructions, architecture, decision/creative guidance and audio guide **in the same change**; avoid creating another status ledger. Preserve historical evidence in `AUDIT.md` and `AESTHETICS.md`. Separate **proposed, implemented, tested, merged, published and device-verified**.

## 6. PR and release boundaries

Package a coherent branch change and reviewable PR with the exact commit, affected source paths, tests/results, known limitations and next action. The old `review.yml` is limited to named historic branches; do not assume an arbitrary branch automatically runs CI. A push to `main` invokes the full Pages/test workflow and may deploy the game; never merge, publish or trigger broad verification without current explicit owner approval.

If interrupted, leave a brief state/next-action record in the existing PR or issue and resume from exact GitHub state in the next conversation. A conversation ending does not make progress happen autonomously.
