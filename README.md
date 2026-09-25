# БЮРОКЯДТ-1

Fictional 1982 Soviet document-confirmation apparatus, installed as a local-first Chromebook PWA.

## V8 operator edition

- Recovered full-resolution party artwork, valid JPEG binaries, and separately typeset Russian slogans.
- Posters must decode before the loading screen can report success; versioned assets replace corrupted V7 files.
- Room and desk camera presets, keyboard controls, touch look, optional synthesized mechanical sound.
- Physical feed, scanner, gauges, stamp and output. Collect a downloadable PNG certificate after processing.
- File contents are never uploaded or read. Only the locally selected filename appears on the certificate.
- Versioned offline shell, network-first navigation, scoped cache cleanup, native-size install icons.

Use **1 / 2** to change view, **F** to select a document, **Enter** to run, **R** to reset. Physical tray, red button, reset knob and output paper also respond to clicks. Drag to look; WASD to walk.

## Acceptance

GitHub Actions renders the local build before deployment and repeats acceptance on the deployed URL. The checks cover poster decoding, WebGL initialization, file selection, full mechanical cycle, exported certificate, reset, cache reload and offline reload. Screenshots and the test result are retained as the `byurokyadt-acceptance` artifact. Installation and standalone window behavior also need a real ChromeOS device check; a manifest test alone does not establish these.

The recovered poster artwork came from the user-provided project handoff; it is stylized fictional set dressing rather than an archival reproduction. New assets are `assets/brezhnev-party-v8.jpg` and `assets/xi-plan-v8.jpg`. Earlier assets remain for historical reference and are not loaded.
