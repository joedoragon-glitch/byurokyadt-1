# Development state — БЮРОКЯДТ-1

**Maintained status snapshot, prepared 1 November 2026.** Status is sourced from the repository at the stated checkpoints. Future changes must update this document when they affect current behavior or release claims.

## Verified baseline before the documentation migration

- **Default branch:** `main` at `fe68d5e1fc579d899392baef10fa091674a28473`, committed **25 September 2026**, message: "Allow slow software renderers to complete the full paper cycle in acceptance."
- **Published-baseline package version:** `10.1.0`; the published service-worker cache was `byurokyadt-v10-1`. **PR #5 candidate:** package `10.1.1`, updated query-string assets and `byurokyadt-v10-1-1` offline cache. The candidate is not yet published.
- **Latest observed Pages workflow:** [run #36100805145](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/36100805145), **completed successfully** for that same `main` commit, with local/deployed verification steps in its workflow. This is historical CI evidence; it is **not** a fresh 1 November test or physical-device certification.
- **Open work when inspected:** the issue listing contained no independent open issues; the repository's four historical PRs #1–#4 were closed. New work should verify GitHub again before acting.
- **Runtime:** Three.js scene, V10.1 mechanical/paper path, eight cinematic inspection viewpoints, original sound, local issued counter, offline-capable PWA. See [README](../README.md), [Architecture](ARCHITECTURE.md), [AUDIT.md](../AUDIT.md).

## Documentation and listening-room proposal (1 November 2026 checkpoint)

[PR #5](https://github.com/joedoragon-glitch/byurokyadt-1/pull/5) proposes maintained AI guidance, a linked README/documentation map and a standalone seven-recording listening page. A narrow service-worker fix keeps standalone navigation separate from the cached game index. Source patch 10.1.1 also fixes an audio-startup/corridor-footstep race revealed by full browser CI and adds a targeted regression. Its cache revision isolates the new source from the old installed shell. At the time the PR was opened this work was **unmerged and unpublished**; this dated observation must not be interpreted as its continuing status. Follow the live PR, exact commit and Pages workflow to establish subsequent outcomes.

The listening room contains no new music, engine, online service or game-state integration. The new Pages route is live **only when** an authorized merge and a successful Pages publication confirm that version. Its standalone sound and game cache behavior require browser checks; actual speaker/iPhone/Chromebook listening is a distinct unverified experience.

## Ongoing accuracy rules

Use exact commit and CI run URLs for **tested**, GitHub PR state for **merged**, Pages job results for **published**, and physical-device observation for **device verified**. An installed browser app may retain older cached content. Document unperformed listening and handset/Chromebook checks explicitly. If a candidate or next phase changes, update its current guide instead of appending another contradictory "latest" block. Historical source and review logs remain in [AUDIT.md](../AUDIT.md).
