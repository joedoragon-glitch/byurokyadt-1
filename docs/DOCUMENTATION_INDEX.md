# Documentation index — БЮРОКЯДТ-1

This is the **maintained routing map**, not a duplicate implementation ledger. AI collaborators should begin with [AGENTS.md](../AGENTS.md) and the latest owner request, then consult the relevant sources. New guides should be created only when existing documentation cannot accurately own the material.

| Document | Read it for |
| --- | --- |
| [README](../README.md) | Player introduction, controls, browser link, sound listening room, setup and project map |
| [AGENTS.md](../AGENTS.md) | Current AI collaboration policy, source authority, scope and release permission |
| [Development state](DEVELOPMENT_STATE.md) | Time-qualified status, exact CI evidence and release/device verification distinctions |
| [Architecture](ARCHITECTURE.md) | Code ownership, actual files, game runtime, test owners and deployment boundaries |
| [Creative direction](CREATIVE_DIRECTION.md) | World tone, cabinet/office identity, inherited authorial philosophy and art provenance |
| [Quality standards](QUALITY_STANDARDS.md) | Visual, interaction, sound, performance, accessibility, privacy and acceptance gates |
| [Audio direction](AUDIO_DIRECTION.md) | Original cue inventory, creative sound standards, editing/verification and preview |
| [Engineering workflow](ENGINEERING_WORKFLOW.md) | Scoped implementation, bug triage, focused tests, documentation and PR handoff |
| [Decisions](DECISIONS.md) | Established design choices and how to record approved future corrections |
| [Communication style](COMMUNICATION_STYLE.md) | Natural public-facing drafts in the owner's voice, without private writing samples |

## Original, retained reference material

- [AESTHETICS.md](../AESTHETICS.md) — V9 accepted cabinet design references, poster priorities, texture generation prompt and original-audio provenance. **Historical creative evidence, not a new edit request.**
- [AUDIT.md](../AUDIT.md) — V9, V10 and V10.1 implementation audits, original player observations, scene tests and historical release receipts. **Dated evidence, not today's CI status.**
- [Original audio source](../scripts/build_audio.py) — deterministic sound-generation recipe; [current game audio runtime](../js/audio.js) — event/audio routing; [sound listening room](../assets/audio-preview.html) — standalone native HTML audio page.
- [GitHub Actions](https://github.com/joedoragon-glitch/byurokyadt-1/actions) — exact workflow receipts and deploy outcomes.

## Cross-project migration boundary

These maintained guides borrow **portable standards** from the author's other game *So I Became the Dark Lord's Problem*: independent engineering ownership, concise phase acceptance, source-grounded decisions, honest QA/status, visual fidelity, purposeful sound, audio listening, natural communication and continuous documentation. They intentionally **do not** import the other game's fantasy characters, sprites, mechanics, names, controls, save format, rendering stack, CI workflows or source-specific bans and release approvals.

There is one active home for each topic. A new issue or PR can link its own scoped evidence without spawning another global status page. When a guide becomes stale, update it and mark earlier claims superseded rather than generating competing "current" files.
