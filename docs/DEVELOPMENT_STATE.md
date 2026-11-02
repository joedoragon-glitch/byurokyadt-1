# Development state — БЮРОКЯДТ-1

## Version 10.2.4 lighting and right-wall doorway — review candidate (2 November 2026)

The owner supplied rendered screenshots showing sun-like floor/furniture shadows inconsistent with an iced-over winter window and ceiling fluorescent fixtures, a long misdirected shadow under the back-wall clock, and a right-hand door with visible nonintegrated backing. A **candidate branch only** at `fix/overhead-shadows-doorway-v10-2-4` changes the single fitted interior shadow key to a near-vertical ceiling proxy and reduces window fill; seats the wall clock against the masonry and stops decorative clock/flat picture frames from projecting misleading shadows; replaces the solid right-wall slab behind the door with two solid sides and a lintel, adds steel jamb returns, moves the leaf into the opening and interrupts wall trim at the jamb. The original cabinet, posters, audio, interaction/collisions and cinematic camera definitions are retained. Source and browser tests are updated and PWA cache metadata advances to 10.2.4. **Not merged, published, owner-visually accepted or native-iPhone verified.** Tests and exact SHA should be read from the review PR and its CI results, not inferred from this candidate description.

## Version 10.2.3 right-desk correction — owner-authorized (2 November 2026)

The [issue #20](https://github.com/joedoragon-glitch/byurokyadt-1/issues/20) correction replaces the interpenetrating file/paper slabs and toy-like red telephone with individually bound office files, a slim separate dossier and a period-plausible red VEF TA-72–inspired rotary instrument. Production geometry is grouped into `deskPhone`, `deskFiles` and `looseDossier` in `js/app.js`. The `tests/desk-props.mjs` browser gate checks their world-space bounds, numbering and supported handset while saving real rendered desktop/mobile photos. The owner authorized implementation and merge **after satisfactory engineering review**. The authoritative `main` status and exact check results live in [PR #21](https://github.com/joedoragon-glitch/byurokyadt-1/pull/21), and publication requires a successful [Pages deployment](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml); a GitHub merge alone is not proof of published pages. Physical iPhone Safari render quality and final owner aesthetic review remain unverified.

**Maintained status snapshot, prepared 1 November 2026.** Status is sourced from the repository at the stated checkpoints. Future changes must update this document when they affect current behavior or release claims.

## Version 10.2.2 — owner-authorized integration (2 November 2026)

[Issue #16](https://github.com/joedoragon-glitch/byurokyadt-1/issues/16) / [PR #17](https://github.com/joedoragon-glitch/byurokyadt-1/pull/17) implement Sound and Music enabled by default with Safari-compatible first-gesture activation, fix two detached +Z-front-wall floor shadows, provide a hidden-until-touch reddish mobile movement joystick, and replace accidental double-dotted `Ї` stand-ins in the decorative English interface text. The 13-check Node/Chromium review [passed on the full implementation](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41444873097); a later exact-head 13-check review also passed before documentation-only release-note cleanup. Owner authorized merge after technical review on 2 November 2026. Consult PR state and the [Pages workflow](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml) for actual merge and publication outcomes: authorization is not itself proof of publication. Physical iPhone Safari playback, installed PWA audio interruption/resumption and human joystick feel are **not device-verified**.


## Integrated polishing release source — 10.2.1 (2 November 2026)

The integrated source combines [#6 lighting](https://github.com/joedoragon-glitch/byurokyadt-1/pull/13), [#7 room completion](https://github.com/joedoragon-glitch/byurokyadt-1/pull/14), [#9 contextual accessible UI](https://github.com/joedoragon-glitch/byurokyadt-1/pull/15), [#8 measured performance tooling](https://github.com/joedoragon-glitch/byurokyadt-1/pull/12), and [#10 legacy/maintenance](https://github.com/joedoragon-glitch/byurokyadt-1/pull/11). All five issues retain their original PR and their exact-head evidence. This is a **source-content description**, not a substitute for checking the current `main` SHA and successful [Pages workflow](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml) before calling the version published.

- The 10.2.1 package, root lockfile, module query strings and `byurokyadt-v10-2-1` cache are aligned; `tests/maintenance.mjs` prevents future metadata drift. Local selection remains filename-only and the saved issued total and 32-sheet tray bounds are exercised in browser regression.
- The combined test command includes **12** ordered Node/Chromium checks, including the room-shell and contextual UI suites; separate lighting photo, room visual and performance workflows also exist. Record the exact merged/published run and compare screenshots before claiming the entire release or a physical-device experience is verified.
- Earlier sections below discussing PR #13, #14, #15, #12 or #11 as *unmerged* are explicitly **dated snapshots**, not the current state after authorization. Do not rewrite those historical observations or conflate passing independent PR CI with the final build.

## Historical: Issue #8 — evidence-led performance profiling (2 November 2026)

- [PR #12](https://github.com/joedoragon-glitch/byurokyadt-1/pull/12) provides reproducible paired CPU/WebGL workload instrumentation, cold/warm/offline cache traces, renderer/resource snapshots, comparison checks and a non-deploying profiling workflow. It preserves the original Three.js runtime, artwork, audio, documents and PWA behavior.
- Initial separate-head software-Chromium profiling showed similar rendering/callback counts before and after instrumentation; no physical-device speedup is claimed. The combination with lighting, completed room and accessible UI needs its own exact-head repeat; see PR #12's latest Actions run and [profiling protocol](PERFORMANCE_PROFILING.md).
- The old 10.1.1 main snapshots below remain historical; don't interpret branch-specific performance numbers as hardware-native results or final release validation.

## Cross-issue integration candidate (2 November 2026)

- [PR #13](https://github.com/joedoragon-glitch/byurokyadt-1/pull/13) (lighting) was merged into `main` and [PR #14](https://github.com/joedoragon-glitch/byurokyadt-1/pull/14) (room) was combined on its branch with the lighting code. The independent PR snapshots below are historical and may predate the combined build.
- [PR #15](https://github.com/joedoragon-glitch/byurokyadt-1/pull/15) adds contextual accessible operator controls, independent Sound/Music settings, a secondary Menu, first-time Help and reduced HUD noise. The unified 10.2.1 release assets are coordinated with the room and lighting versions; validate the exact combined branch and the future Pages deployment separately.
- Separate work on [PR #12](https://github.com/joedoragon-glitch/byurokyadt-1/pull/12) (profiling) and [PR #11](https://github.com/joedoragon-glitch/byurokyadt-1/pull/11) (maintenance) must be integrated with docs/test rosters rather than replacing earlier work.

## Historical checkpoint: source and issue #6 candidate (2 November 2026 UTC)

- `main` is at `9b95387f4e2ee1966cfce7f1bc3ec9a66e4b0e9d`, following the authorized PR #5 merge. Exact-main [CI/Pages run #41392927312](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/41392927312) passed the existing acceptance and deployment checks. The sections below are dated historical snapshots and should not be read as the current PR #5 state.
- [Issue #6](https://github.com/joedoragon-glitch/byurokyadt-1/issues/6) / [draft PR #13](https://github.com/joedoragon-glitch/byurokyadt-1/pull/13): an **unmerged and unpublished** 10.1.2 lighting candidate, confined to office shadow coverage, caster selection, source-aligned regression and offline cache revision. Owner visual approval, actual physical handset/GPU verification, any PR merge, and deployment remain outstanding.
- The dedicated lighting review workflow compares the exact main baseline with the branch in Chromium at desktop and narrow/mobile viewports; the complete existing browser game suite runs without publishing. Use the final CI run, attached before/after frames and measured results on PR #13 to determine its actual verified status; the presence of a workflow or candidate commit does **not** imply a pass.

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

## Issue #7 environment candidate — 2 November 2026

The `issue-7-room-completeness` feature branch proposes the **10.2.0 room visual update** from main `9b95387f4e2e`: a physical +Z wall, continuous four-wall joins, period service fittings, door details, and refined cabinets/chair/telephone/radiator. It does **not** change the accepted central machine, original poster files, paper timing, lighting, audio, save data or eight cinematic shot definitions. A new cache namespace `byurokyadt-v10-2-0` and query string `?v=10.2.0` isolate the candidate from installed 10.1.1 shells.

The issue-specific [environment evidence guide](ROOM_COMPLETENESS_REVIEW.md) inventories changes and specifies repeatable before/after Chromium captures from the pinned main base. Test results and evidence should be linked from the issue and PR **only after an actual run**. This branch is **implemented, not merged, published, accepted artistically, or device verified**; physical-device and native-GPU performance remain unmeasured.

## Ongoing accuracy rules

Use exact commit and CI run URLs for **tested**, GitHub PR state for **merged**, Pages job results for **published**, and physical-device observation for **device verified**. An installed browser app may retain older cached content. Document unperformed listening and handset/Chromebook checks explicitly. If a candidate or next phase changes, update its current guide instead of appending another contradictory "latest" block. Historical source and review logs remain in [AUDIT.md](../AUDIT.md).
