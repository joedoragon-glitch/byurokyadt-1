# Development state — БЮРОКЯДТ-1

**Maintained status snapshot, prepared 1 November 2026.** Status is sourced from the repository at the stated checkpoints. Future changes must update this document when they affect current behavior or release claims.

## Verified baseline before the documentation migration

- **Default branch:** `main` at `fe68d5e1fc579d899392baef10fa091674a28473`, committed **25 September 2026**, message: "Allow slow software renderers to complete the full paper cycle in acceptance."
- **Package version:** `10.1.0`; manifest and service-worker cache are aligned to the V10.1 game.
- **Latest observed Pages workflow:** [run #36100805145](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/36100805145), **completed successfully** for that same `main` commit, with local/deployed verification steps in its workflow. This is historical CI evidence; it is **not** a fresh 1 November test or physical-device certification.
- **Open work when inspected:** the issue listing contained no independent open issues; the repository's four historical PRs #1–#4 were closed. New work should verify GitHub again before acting.
- **Runtime:** Three.js scene, V10.1 mechanical/paper path, eight cinematic inspection viewpoints, original sound, local issued counter, offline-capable PWA. See [README](../README.md), [Architecture](ARCHITECTURE.md), [AUDIT.md](../AUDIT.md).

## Proposed documentation and listening-room update

This migration is **candidate branch work**, not a published feature or evidence of a game-version release. It adds maintained AI guidance, a linked README/documentation map and a standalone original-OGG listening page, with a narrowly targeted service-worker safeguard to prevent the listening-page navigation from replacing the cached game shell. Its correctness must be established by specific checks on the actual candidate SHA; it is **not merged, deployed or real-device verified** as part of writing this document.

The listening room contains no new music, engine, online service or game-state integration. It is available on the Pages URL only after authorized merge and a successful Pages publication.

## Ongoing accuracy rules

Use exact commit and CI run URLs for **tested**, GitHub PR state for **merged**, Pages job results for **published**, and physical-device observation for **device verified**. An installed browser app may retain older cached content. Document unperformed listening and handset/Chromebook checks explicitly. If a candidate or next phase changes, update its current guide instead of appending another contradictory "latest" block. Historical source and review logs remain in [AUDIT.md](../AUDIT.md).
