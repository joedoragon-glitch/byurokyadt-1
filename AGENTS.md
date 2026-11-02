# AI collaborator operating policy — БЮРОКЯДТ-1

This is the entry point for any AI agent or engineer working on **БЮРОКЯДТ-1**. Read this document at the start of a task, then the relevant guides linked below. These are **repository-level working instructions**, not a claim that a chat model automatically retains previous sessions or that a GitHub document changes ChatGPT settings.

## Authority, identity and consent

1. **Current explicit owner request** controls authorized scope, creative corrections and consent gates.
2. **This policy** controls safety of the workflow, independence of routine engineering and release boundaries.
3. **Approved game decisions and creative direction** live in [Decisions](docs/DECISIONS.md) and [Creative direction](docs/CREATIVE_DIRECTION.md).
4. **Actual current source** and [Architecture](docs/ARCHITECTURE.md) describe implementation; [Development state](docs/DEVELOPMENT_STATE.md) holds time-qualified evidence.
5. **Historical** [AESTHETICS.md](AESTHETICS.md), [AUDIT.md](AUDIT.md), old commits and closed PRs explain past decisions but are not continuing authorization.

The canonical public identity is **БЮРОКЯДТ-1**, a fictional 1982 Soviet bureaucratic apparatus. The repository slug `byurokyadt-1` is a technical identifier. **Do not rename it to the fantasy game's title, import fantasy lore, transplant PixiJS/Canvas rules or claim its releases are this game's releases.** Preserve the existing satirical, tactile, winter-office design unless the owner asks to revise it.

## Act as a capable developer, not a permission-seeking messenger

For a clear authorized request, investigate the source, plan an appropriately sized change, implement, run focused validation and leave a recoverable GitHub record. Do not delegate routine debugging, issue triage, documentation upkeep or technical trade-offs to the owner. Ask only when a meaningful creative choice, scope expansion, material risk or separately controlled action is required.

For multi-phase work, decide against the phase's actual acceptance criteria:
- **Block:** a relevant failed regression, wrong player-facing result, material quality defect, data/security/licensing issue, or unsafe prerequisite. Diagnose; do not use a smaller passing test to hide it.
- **Defer with ownership:** a proven independent, bounded, noncritical issue that does not compromise current scope. Note it briefly in the current issue/PR; create separate tracking only if substantial work is genuinely needed.
- **Investigate briefly:** unknown cause or relevance. Compare exact base, test and behavior. An unexplained relevant failure remains blocked.

Keep changes coherent and minimally invasive. Never optimize away the visual, tactile or audio identity merely to improve a measurement. Keep real gameplay mechanics authoritative over presentation. A renderer change, timing change, save change or audio change requires its own relevant validation.

## Explicit boundaries

- **Do not merge, publish, deploy or push directly to `main` without current explicit owner authorization.** `main` automatically triggers Pages deployment.
- Do not run full browser matrices, a comprehensive game suite or unrelated expensive verification without the owner's separate permission. Use focused tests for ordinary development. A plain documentation update needs link/asset checks, not a forced full machine-cycle test.
- A previous V10 release approval, successful CI or dated "next phase" is not permission for a new release.
- Do not upload document contents, add telemetry, reduce accessibility/privacy protections, discard original authored assets or wipe browser persistence.
- Preserve offline behavior and user interaction; new optional tools must not silently alter the app's service worker, save state, UI or controls.
- Never claim to have listened to audio, inspected a real device or received owner approval if that did not occur.

## Standard work sequence

1. Read [Development state](docs/DEVELOPMENT_STATE.md), [Architecture](docs/ARCHITECTURE.md), [Decisions](docs/DECISIONS.md), the relevant [creative](docs/CREATIVE_DIRECTION.md), [quality](docs/QUALITY_STANDARDS.md) or [audio](docs/AUDIO_DIRECTION.md) guide, and the actual source.
2. Identify one user-visible outcome, affected modules, non-goals and the minimum meaningful regression set. Reuse relevant open work rather than opening duplicate issues.
3. Make a focused branch change. Preserve existing functionality, original artwork and recordings; record any owner-authored new design choice.
4. Test what changed with source-backed assertions and actual game paths when necessary. Validate negative cases and lifecycle boundaries appropriate to the task.
5. **Update the affected maintained documents in the same PR.** Reuse before creating another competing "current" file; keep historical evidence intact and mark superseded plans clearly.
6. Report exact branch/SHA, check names and outcomes, any unperformed listening/device checks, outstanding blockers, and the next action. No imaginary background work.

Status terms must remain distinct: **proposed**, **implemented**, **tested**, **merged**, **published** and **real-device verified**. A green draft PR is not a shipped game. Read [Engineering workflow](docs/ENGINEERING_WORKFLOW.md) for practical tests and GitHub handoffs.

## Creative and public communication

Design should begin with the intended player experience and this game's accepted reference art, not a generic feature checklist. See [Creative direction](docs/CREATIVE_DIRECTION.md), [Quality standards](docs/QUALITY_STANDARDS.md) and [Audio direction](docs/AUDIO_DIRECTION.md). New generated assets need context, source/provenance and actual visual or sound review; technical validity is not creative acceptance. Preserve the original unedited source when replacing an accepted work.

When drafting public posts in the owner's voice, read [Communication style](docs/COMMUNICATION_STYLE.md). Do not invent personal anecdotes, approvals or performance impressions. Never publish or post on the owner's behalf without authorization.

**Migration note:** The reusable operating standards above are adapted from *So I Became the Dark Lord's Problem*'s AGENTS and development/audio guides at the owner's request (1 November 2026). Only cross-game principles were adopted. Repository-specific features, tests, CI layouts, source ownership, soundtracks and old approvals remain with their original project.
