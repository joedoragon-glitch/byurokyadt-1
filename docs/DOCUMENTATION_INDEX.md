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
| [Performance profiling](PERFORMANCE_PROFILING.md) | CPU/WebGL workload harness, cache measurements, matched baseline protocol and hardware limits |
| [Room completeness review](ROOM_COMPLETENESS_REVIEW.md) | Dated 10.2.0 room-comparison inventory; **historical candidate evidence**, not current source status |
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

## Documentation maintenance conventions

- **One current owner per subject.** `README.md` is the player entry point; `DEVELOPMENT_STATE.md` owns time-qualified repository status; `ARCHITECTURE.md` owns runtime and test mapping; topic guides own continuing design and acceptance rules. `AUDIT.md`, `AESTHETICS.md` and dated room/performance checkpoints are historical evidence, not competing current-state claims.
- **Current facts versus dated snapshots.** Name the observed date and branch/SHA for mutable status. Use precise terms: proposed, implemented, tested, merged, published and device-verified. When a candidate merges, update the current summary and mark earlier instructions superseded without falsifying the older checkpoint.
- **Markdown presentation.** One descriptive H1 in each maintained guide, organized H2/H3 sections, fenced code blocks with language hints where useful, backticks for literal paths and commands, short paragraphs and tables only for comparisons. Avoid escaped code delimiters, trailing whitespace, duplicate “latest” sections and append-only release-note sprawl.
- **Links and navigation.** Prefer repository-relative paths for in-repo documents/code, GitHub permalinks for exact commits/runs, and meaningful link labels. Update this index when guides change. Use `npm run test:docs` for local links, headings, anchors and formatting; document-only changes do not need a comprehensive machine cycle by default.
- **Review discipline.** Reconcile player instructions, architecture, release metadata and affected topic guides in the same PR. Preserve original assets and historical audits; CI screenshots do not prove owner visual approval, physical phone testing, listening quality or a successful Pages deployment.
