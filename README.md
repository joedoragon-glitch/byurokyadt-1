# БЮРОКЯДТ-1

Fictional 1982 Soviet document-confirmation apparatus. A local-first, installable browser experience, built for a Chromebook.

## V9 factory refit

The cabinet follows the original cinematic and propaganda-poster designs: square recessed CRT, left switch bank, ministry plate, two analog meters, confirmation button, deep feed bay, projecting tray, and open piston press. Soft cabinet edges, worn AI-generated enamel, side vents, handles, bearing hardware, and correctly oriented paper make the design readable from multiple angles.

The concrete office includes restored party posters, a winter window, a heavy door, paper archives, a chair, telephone, and green desk lamp. Furniture and wall collisions use a player radius and sliding contact. View presets reposition the camera behind a short fade so it never visibly travels through objects.

Outside instructions use readable Hollywood Soviet English. Cyrillic lettering remains on the machine and its display. Your selected file stays on your device: no file contents are read or uploaded, and only its filename is printed on the certificate.

## Controls

- **1**: room view. **2**: machine. **3**: side inspection.
- **WASD**: walk. **Drag**: look around. Touch drag also works.
- **F / Select Doc**: select any local file. **Enter / Confirm**: run the procedure.
- **R / Reset**: clear the current document. **Certificate**: collect and save the PNG.
- The input tray, red button, reset knob, and completed output sheet are clickable.
- **Sound** and **Music** are separate, initially off, with a volume control. Sound starts only after your click. Music softens during a machine cycle, and audio pauses when the tab is hidden.

## Audio and materials

Original mechanical sounds and a sparse 64-second instrumental were synthesized for this project, with no third-party music or archival samples. Rebuild them using `python3 scripts/build_audio.py` with NumPy, SciPy and ffmpeg installed. The score and effects are included in offline storage. The AI texture prompt and reference construction decisions are recorded in `AESTHETICS.md`.

## Verification

GitHub Actions runs `npm test` in Chromium before deployment and again at the live URL. The suite covers decoded visual assets, WebGL initialization, document selection, mechanical cycle, certificate export, reset, audio decoding and independent controls, furniture and walking collisions, cached and offline reload, offline audio, and smaller viewport layouts. Screenshots and results are retained as workflow artifacts.

Real ChromeOS installation, device-specific graphics speed, and the perceived balance on the user's speakers are not established by headless Chromium. The app has a standalone manifest and service worker, but those are not a substitute for an OS installation check.

The original user-supplied party poster art remains unchanged from V8. Its earlier corrupted files are historical, unused assets. No external runtime assets, CDN, analytics, remote music, or document-upload service is required.
