# БЮРОКЯДТ-1

*A fictional Soviet document-confirmation apparatus, 1982.* A compact, atmospheric 3D browser game about operating an extraordinarily serious machine for an extraordinarily unnecessary procedure. Explore a winter office, submit a local document, watch the mechanism do its work, and collect the official certificate.

**[Play the game](https://joedoragon-glitch.github.io/byurokyadt-1/)** · **[Sound listening room](https://joedoragon-glitch.github.io/byurokyadt-1/assets/audio-preview.html)** · **[Development state](docs/DEVELOPMENT_STATE.md)**

The listening room is included with the site's assets. Its Pages link works after a successful deployment of the commit containing it; an unmerged PR is not a live site. It can also be opened from a local server at `/assets/audio-preview.html`.

**Jump to:** [Experience](#the-experience) · [Controls](#controls) · [Sound and photography](#sound-and-photography) · [Privacy and offline use](#privacy-and-offline-use) · [Development](#development) · [Project documentation](#project-documentation)

## The experience

The office contains a 3D cabinet with switches, a CRT, analog meters, a printer feed, a physical stamping press, a paper chute and a receiving tray. You can walk around the machinery, inspect the winter office and use cinematic views to photograph it. An issued-document counter persists locally; the tray displays at most 32 sheets while the counter tracks up to 999,999.

The intended tone is restrained, tactile and gently absurd: institutional bureaucracy treated with the seriousness of a monumental industrial process. The room contains original mechanical sound, a sparse instrumental score, winter ambience and spatially placed corridor footsteps.

**The 10.1.2 lighting improvement** in [issue #6](https://github.com/joedoragon-glitch/byurokyadt-1/issues/6) fits a single shadow camera across the office without changing the original lamp palette or mechanical animation. The overall lighting appearance remains subject to the owner's evaluation of the integrated game.

**Version 10.1** corrected the continuous paper path and stamp-contact timing, and made the corridor footsteps respond to an operator approaching the door. The **10.1.1 maintenance patch** protects that approach cue against early background footsteps and adds a separate sound listening room. The **10.2.0 room-completeness pass** completes the fourth wall, door joinery, office surfaces and period props without replacing the approved machine or posters; see [the matched environment review](docs/ROOM_COMPLETENESS_REVIEW.md). See [Development state](docs/DEVELOPMENT_STATE.md) for the distinction between source availability and a verified public deployment. See the [historical production audit](AUDIT.md) for the recorded work and its verification; the [maintained development state](docs/DEVELOPMENT_STATE.md) distinguishes historical evidence from current verification.

## Controls

The **10.2.1 polishing release** brings the lighting, complete room architecture and contextual accessible UI together with performance profiling and maintenance guards. Consult the current [Development state](docs/DEVELOPMENT_STATE.md) and [Pages workflow](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml) for the exact deployed source; final appearance is yours to assess in the game.


**First procedure:** Select a local document → Confirm → watch the machine inspect and stamp its certificate → Collect certificate → Save PNG. The operator strip shows the current step, file name and progress in ordinary English; the file is not uploaded. The **Menu** button at the top right opens Room/Machine/Side views, Sound, Music, volume, fullscreen, installation (when supported) and How to operate. Escape closes the menu. The menu is optional for the main procedure and keeps the office unobstructed when closed.

| Action | Keyboard / mouse / touch |
| --- | --- |
| Room / machine / side inspection | **1 / 2 / 3** or **Menu → Views** |
| Walk, look around | **WASD**, drag to look; touch drag is supported |
| Select a document | **F** or **Select document** |
| Confirm the procedure | **Enter** or **Confirm** (the prompt explains when selection is missing) |
| Reset current document | **R** or **Reset** |
| Collect a completed certificate | **Collect certificate**, then save PNG |
| Enter cinematic inspection | **C** or **Menu → Photography mode** |
| Exit cinematic inspection | **Escape** |
| Cinematic camera move, height, lens | **WASD**, **Q / E**, scroll |
| Select cinematic views / tour | **[ / ]**, **T** |
| Hide/show cinematic controls | **H** |
| Save scene-only photograph | **P** in photography mode |

The input tray, confirmation button, reset knob and completed output sheet are also clickable. All primary actions are keyboard-accessible and sized for touch. Menu → How to operate provides in-game instructions without requiring this README. Cinematic inspection offers eight composed views; photography supports 16:9, 2.39:1 and screen-shaped framing. Reduced-motion preferences are respected. Keyboard, touch and small-screen behavior are not assumed to be identical; see [Quality standards](docs/QUALITY_STANDARDS.md).

## Sound and photography

**[Open the sound listening room](https://joedoragon-glitch.github.io/byurokyadt-1/assets/audio-preview.html)** to play each of the seven existing recordings individually, without starting a machine cycle or changing game state. The room has native playback controls and a one-track-at-a-time behavior. It does not preview procedural wind, radiator ticks or corridor footsteps; those are generated inside the game.

Inside the game, **Sound** (mechanics and room) and **Music** begin enabled and remain independent. iPhone Safari requires a user gesture before audible playback: the first tap or key press in the game automatically unlocks Web Audio without opening Menu. A subsequent tap can resume an interrupted context; the master volume is adjustable and music quietens during a procedure. Audio suspends when the tab is hidden. The original 64-second score and mechanical sounds can be regenerated with `python3 scripts/build_audio.py` when NumPy, SciPy and ffmpeg are available.

**[Sound identity and production guidance](docs/AUDIO_DIRECTION.md)** explains the creative and technical standards. **[Creative direction](docs/CREATIVE_DIRECTION.md)** records the visual and narrative identity; accepted reference decisions and original texture notes remain in [AESTHETICS.md](AESTHETICS.md).

## Privacy and offline use

The selected file stays on your device: the game uses its **filename**, not its contents, for the fictional certificate. No document upload, analytics or cloud-save service is present. The issued total is stored in this browser's local storage; clearing site data resets it. The game has an installable manifest and a service worker for offline operation after required assets have been cached. Browser installation and real-device performance remain separate from automated checks.

The sound listening room is a separate optional page. Its first visit and its offline behavior are not part of the original game-shell precache guarantee.

## Development

This is a static, local-first **Three.js / JavaScript / HTML / CSS / Web Audio** application, not the fantasy RPG or a backend service. The vendored Three.js library is under `vendor/`; game modules are in `js/`. The Playwright tests cover rendering and real user paths; two geometry checks run without a browser.

```sh
npm ci --ignore-scripts
python3 -m http.server 8000
# In another terminal, with Playwright Chromium installed:
npm test
```

The full `npm test` command runs the documented Node and Chromium regression suites, including listening-room playback and game acceptance. Prefer the smallest relevant checks during ordinary edits; broader browser/device work needs the owner's authorization. A push to `main` triggers the GitHub Pages workflow and is **not** an innocuous staging action. Develop on a branch, present a reviewable PR, and do not merge or deploy without explicit authorization. See the [engineering workflow](docs/ENGINEERING_WORKFLOW.md).

## Project documentation

| What you need | Start here |
| --- | --- |
| Rules for an AI collaborator, authority and consent | [AGENTS.md](AGENTS.md) |
| Current repository status and last verified evidence | [Development state](docs/DEVELOPMENT_STATE.md) |
| Game modules, runtime and build ownership | [Architecture](docs/ARCHITECTURE.md) |
| Authorial identity, tone and design constraints | [Creative direction](docs/CREATIVE_DIRECTION.md) |
| Visual, interaction, accessibility and performance bar | [Quality standards](docs/QUALITY_STANDARDS.md) |
| Music, effects, sound production and listening room | [Audio direction](docs/AUDIO_DIRECTION.md) |
| Scoping, implementation, testing and handoffs | [Engineering workflow](docs/ENGINEERING_WORKFLOW.md) |
| Confirmed choices versus proposed changes | [Decisions](docs/DECISIONS.md) |
| Public-facing writing in the owner's voice | [Communication style](docs/COMMUNICATION_STYLE.md) |
| All maintained guides and historical reference paths | [Documentation index](docs/DOCUMENTATION_INDEX.md) |

**Historical records remain intact:** [AESTHETICS.md](AESTHETICS.md) contains approved visual references and texture provenance; [AUDIT.md](AUDIT.md) contains V9–V10.1 testing and release history. These are evidence, not fresh work orders. The authorial and engineering principles above were adapted from the separately maintained *So I Became the Dark Lord's Problem* repository; its fantasy setting, game mechanics, code paths and platform-specific policies do **not** apply here.

## Version 10.2.2 — mobile audio, floor shadows and touch controls

[Issue #16](https://github.com/joedoragon-glitch/byurokyadt-1/issues/16) adds default-on gesture-unlocked audio, removes detached shadows projected by the front-wall service fittings, introduces a floating reddish touch-first movement joystick, and corrects the accidental double-dotted I stand-ins in decorated English text. The source change was validated by Chromium regression; physical iPhone Safari audio and touch response remain separate device checks. Consult [PR #17](https://github.com/joedoragon-glitch/byurokyadt-1/pull/17), [development state](docs/DEVELOPMENT_STATE.md) and [Pages Actions](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml) to distinguish code integration from confirmed public deployment.

## Version 10.2.3 — period-correct office desk props

The right-hand wooden office desk features restrained, separately bound archive folders with readable case spines and a thin loose dossier, rather than intersecting broad plastic-looking files and a paper block. Its red rotary desk telephone is modeled after the era-appropriate Soviet VEF TA-72 silhouette (low wedge, numbered ivory rotary face, continuous handset and coiled lead), not a photograph or exact manufactured replica. The tabletop, mug, machine, room placement, sound and game controls remain intact. See [issue #20](https://github.com/joedoragon-glitch/byurokyadt-1/issues/20) and its reviewable PR for source and 3D screenshot evidence. Automated Chromium captures are not evidence of physical iPhone or owner visual approval; consult [Pages runs](https://github.com/joedoragon-glitch/byurokyadt-1/actions/workflows/pages.yml) before calling the public version deployed.

## Version 10.2.4 — overhead winter shadows and built-in door (review candidate)

Following the owner's in-game screenshots, this branch changes the shadow direction from a diagonal exterior-sun look to overhead fluorescent-dominant shadows, retains weak diffused daylight through the frosted window, seats the wall clock flush and suppresses exaggerated decorative shadows, and constructs a real right-wall door opening with interrupted trim and integrated steel jambs. No gameplay, accepted machine/art, sound, save or camera-route changes are intended. The source is **a PR candidate**, not a deployed or owner-accepted change; consult the [development state](docs/DEVELOPMENT_STATE.md) and live GitHub PR/Pages run before judging it in the public game.
