# Decisions and creative authority

**Purpose:** Preserve confirmed project choices and distinguish them from future proposals. This concise index is not a replacement for [AESTHETICS.md](../AESTHETICS.md) or the historical [AUDIT.md](../AUDIT.md). A later owner correction supersedes a conflicting older decision; record the correction rather than silently rewriting history.

## Established, source-supported direction

| Area | Established decision / source |
| --- | --- |
| Identity | Fictional 1982 Soviet bureaucratic document-confirmation experience, titled **БЮРОКЯДТ-1**; current source, [README](../README.md) |
| Machine appearance | Layered physical cabinet with recessed CRT, switch bank, ministry plate, analog meters, press, paper feed/chute, wear and hardware; [AESTHETICS.md](../AESTHETICS.md) |
| Atmosphere | Cold inhabited winter office, original poster assets, heavy door, archival furniture, nearby environmental details; [AESTHETICS.md](../AESTHETICS.md), [AUDIT.md](../AUDIT.md) |
| Player trust | File contents do not leave the device; certificate uses selected filename; issued count persists locally but personal names/contents do not persist in the tray; source and [README](../README.md) |
| Audio | Original generated music and effects; independent sound/music controls, user-gesture startup and positional room/corridor sounds; `js/audio.js`, [AESTHETICS.md](../AESTHETICS.md) |
| Cinematic presentation | Eight physical-camera inspection views, obstruction-safe routing, scene-only photographs and reduced-motion support; `js/cinematic.js`, [AUDIT.md](../AUDIT.md) |
| V10.1 physical flow | Progressive feed, imprint at stamp contact, curved chute delivery and recoverable intermediate motion under slow rendering; [AUDIT.md](../AUDIT.md) |

## Adopted cross-project principles — 1 November 2026

At the owner's request, the **portable authorial and collaboration standards** of *So I Became the Dark Lord's Problem* are adapted in this repository. They are captured in [AGENTS.md](../AGENTS.md), [Creative direction](CREATIVE_DIRECTION.md), [Quality standards](QUALITY_STANDARDS.md), [Audio direction](AUDIO_DIRECTION.md), [Engineering workflow](ENGINEERING_WORKFLOW.md) and [Communication style](COMMUNICATION_STYLE.md). These are guidelines for **future work**, not a claim that the fantasy game's mechanics, score, art assets, CI budget or implementation choices are applicable here.

Key commitments: respect original authored assets; prioritize specific player-facing identity over generic spectacle; review visual and audio experiences in context; use appropriate measured engineering tests; make an authorized task independently actionable; preserve evidence; keep feature documents accurate; never confuse draft, test, release or device acceptance.

## Cross-project rule mapping and intentional exclusions

This migration is **a selective adaptation, not a claim of exact rule-for-rule equivalence**. The source files named here live in the separate `joedoragon-glitch/azeroth-chronicles-prototype` repository; only the principles listed were considered applicable to this game's existing code and setting.

| Source in the other game | Portable principle | Adopted here |
| --- | --- | --- |
| `AGENTS.md`, `docs/MECHANIC_DEVELOPMENT.md` | Owner scope/consent, autonomous implementation, blocker triage, focused testing, clear handoffs, accurate release statuses | [Agent policy](../AGENTS.md), [Engineering workflow](ENGINEERING_WORKFLOW.md) |
| `docs/BRAND_IDENTITY.md` | Separate player-facing title and identity from technical legacy identifiers | [Creative direction](CREATIVE_DIRECTION.md), [README](../README.md) |
| `docs/DESIGN_TO_SPRITE_WORKFLOW.md` | Work from accepted visual references, preserve originals and provenance, distinguish candidate art from owner approval, review in the actual game | [Creative direction](CREATIVE_DIRECTION.md), [Quality standards](QUALITY_STANDARDS.md) |
| `docs/AUDIO_SOUND_PASS.md`, `docs/AUDIO_AUTHORING.md`, `docs/AUDIO_PLAYBACK.md` | Purpose-specific sound, original source provenance, coherent audible identity, context/mix review, technology not being artistic acceptance | [Audio direction](AUDIO_DIRECTION.md), [Sound listening room](../assets/audio-preview.html) |
| `docs/PERFORMANCE_MEASUREMENT_AUDIT_20261022.md` | Measure actual workload and user experience; do not confuse simulated metrics with device FPS or remove fidelity blindly | [Quality standards](QUALITY_STANDARDS.md) |
| `docs/COMMUNICATION_STYLE.md` | Natural first-person developer voice, factual updates, no invented personal claims, private writing stays private | [Communication style](COMMUNICATION_STYLE.md) |
| `docs/DOCUMENTATION_GOVERNANCE_DEEP_AUDIT_20261025.md` | One owner for current guidance, linkable index, historical evidence separate from current state, low-ceremony upkeep | [Documentation index](DOCUMENTATION_INDEX.md), [Development state](DEVELOPMENT_STATE.md) |

**Not imported:** fantasy setting, characters, gameplay/combat/balance, companion/pet mechanics, PixiJS/Canvas renderer policies, the other game's v4 saves, sprite atlas and 150%-source pipeline, its 83-track or 147-recording catalog, bespoke audio instruments/tempo rules, its specific CI/test commands, previous releases or historic task permissions. This project uses Three.js, a 7-OGG recorded library, procedural ambience, and a local issued-document counter.

The mapping is meant to keep future collaborators from copying the other project's current implementation as a false authority. Consult this repository's live source and the owner's new directions before proposing a change.

## Issue #7 visual candidate — not yet accepted

The owner authorized implementation and visual review of a more complete 1982 room on issue #7. The current branch candidate adds a physically modeled +Z wall, continuous muted institutional junctions, improved period desk/cabinet/door detailing and service fittings. **These proposed appearances are not owner-accepted replacements**; the accepted V9 machine and poster artwork are unchanged. See [room comparison and selective aesthetic choices](ROOM_COMPLETENESS_REVIEW.md).

## Future design decisions

A feature suggested in chat remains **proposed** until the owner authorizes it. If new narrative, interaction, art or music direction is accepted, record the exact choice, its scope, affected asset/behavior and source in this maintained page or the relevant owning feature document. Do not manufacture retrospective approval from dated pull requests, an AI description or an illustrative brief. Keep gameplay-specific proposals separate from existing accepted visual and interaction identity.

## Owner corrections — 2 November 2026 (issue #16)

The owner requests Sound/Music enabled by default, automatic first-gesture Safari-compliant unlocking, correction of the two detached rear-view floor shadows and a temporary left-side touch joystick. The control should look like a **normal round game joystick with a reddish tint**, explicitly not an industrial instrument panel or robot controller, and should be invisible at rest. Desktop controls stay unchanged. In player-facing stylized lettering, replace the incorrect doubly dotted `Ї` lookalike for Latin `I`, without altering genuine Cyrillic. These decisions authorize a candidate, not automatic publication or creative/device acceptance.
