# Audio direction and production guide

**БЮРОКЯДТ-1** uses original recorded OGG music/mechanical samples plus generated spatial winter ambience. This is the project-specific adaptation of the owner's broader sound-design principles: **purpose, identity, readable action, restraint, original provenance and audible review**. Do not import the fantasy RPG's cues, score families, instrument prescriptions or music-production tooling.

## What the game actually plays

The registered recordings reside in `assets/audio/` and are loaded by `js/audio.js` after the user's audio gesture.

| File | Current purpose |
| --- | --- |
| `ministry.ogg` | Original sparse ~64-second instrumental ministry score; music bus |
| `room.ogg` | Interior room/office sound bed; effects/ambience |
| `relay.ogg` | Mechanical relay action |
| `feed.ogg` | Paper feed mechanism |
| `scan.ogg` | Scanning/inspection machinery |
| `stamp.ogg` | Physical stamp impact |
| `bell.ogg` | Machine's completion bell |

Three additional textures are **synthesized at runtime rather than stored as OGG files**: winter wind, radiator ticks and muffled footsteps beyond the corridor door. `js/audio.js` positions sounds in 3D, follows the listener, limits active voices, fades buses and pauses on tab hiding.

**[Listen to the seven recordings](https://joedoragon-glitch.github.io/byurokyadt-1/assets/audio-preview.html)** on the separate standalone page once this proposal is published. The page plays individual recordings, not the spatialized room mix or full timed machine cycle; it deliberately neither reads nor changes game saves/settings. For exact emitted audio in context, use the game.

## Authorial sound principles

1. **Story through sound:** the machine should feel heavy, procedural and institutionally serious; its sounds tell the player what is happening without shouting. Distant human sounds imply a world outside the door.
2. **Sound must correspond to action:** relay activation, rollers, scanning, contact of the stamp and completion bell each need appropriate timing. Do not solve an incorrect event by merely raising its gain.
3. **Atmosphere has space:** the sparse music must leave room for mechanical cues, faint room tone and intermittent environmental life. Avoid constant loops or effects that mask the confirmation moment.
4. **Independent player control:** keep separate Sound and Music toggles, a working master slider and a deliberate first user gesture. Mute must stop existing voices and prevent newly scheduled voices; background/tab visibility must be handled.
5. **Originality and identity:** preserve and credit the current authored source. Don't introduce licensed recordings, copied melodies, third-party samples or unexplained AI assets. If a new source is approved, record its production method, author/license, intended event and exact file.
6. **Contextual listening matters:** a recording that decodes, meets a peak threshold and loops cleanly is **technically valid**, not necessarily expressive, balanced or pleasant. Judge its audible role, harshness, masking, repetition and positional believability where actual listening is possible.

## Production and change workflow

**Source of recordings:** `scripts/build_audio.py` is the historical reproducible generator. `assets/audio/*.ogg` are the current packaged files. `js/audio.js` defines real-time routing and procedural sound; `service-worker.js` lists the game's required offline audio assets.

For an approved change, identify the exact event and current asset; specify what must remain recognizable; keep a recoverable original; edit the producing source or approved replacement; update bindings/precache only if needed; then test the **actual event** with ordinary Sound/Music states, volume extremes, sound on/off, game pause/tab hiding, offline reload and positional audio where applicable. For a replacement, compare the old and new recording independently and in the live room. Avoid duplicating creative briefs into a competing generated catalog.

`npm test` covers audio decoding, game interaction and offline audio among broader suites. Choose relevant focused checks first and reserve comprehensive browser/device passes for separately authorized work. Human listening on the owner's speakers or phone remains **unverified until actually performed**.

Audio composition and recordings should only be called **accepted** when the owner has made that choice; source review is not a substitute for the owner's ear. See [Creative direction](CREATIVE_DIRECTION.md), [Quality standards](QUALITY_STANDARDS.md) and the historical [AESTHETICS.md](../AESTHETICS.md).
