# БЮРОКЯДТ-1

Fictional 1982 Soviet document-confirmation apparatus. A local-first, installable browser experience, built for a Chromebook.

## V10 cinema bureau (prepared; browser audit and release pending)

Cinematic inspection provides eight composed views: office, cabinet, CRT/meters, feed rollers, stamp press, winter window, corridor door, and receiving tray. The camera plans routes around the existing furniture footprints. It interpolates its position, orientation and lens smoothly; manual gliding retains collision protection. Reduced-motion mode changes views immediately and suppresses cabinet recoil and weather-light animation.

- **C** opens cinematic inspection; **Escape** restores the operator camera.
- **WASD** glides, **drag** looks, **Q/E** lowers/raises the camera, and **scroll** changes the lens.
- **[ / ]** select views, **T** toggles the guided tour, and **H** hides/reveals controls.
- **P** saves a scene-only PNG, up to 2560 × 1440, using the selected 16:9, 2.39:1 or screen-shaped frame. Export works offline and restores the normal rendering size afterward.
- Start a machine cycle before entering cinema to photograph the working mechanisms.

The mechanism has snapping knobs, damped meter overshoot, segmented paper that bends at rollers, a visible sheet under the press, and small cabinet recoil on impact. HRTF positional audio follows the camera and places the machinery at its actual 3D location. Original quiet wind, radiator ticks and muffled corridor footsteps imply an outside world. The closed window shows a defocused neighbouring block, slow daylight variation and an occasional passing glow. Music remains independent of sound effects.

A physical six-digit rolling counter and receiving tray restore the issued total from this browser's local storage. The tray displays up to 32 sheets to bound rendering cost; the counter tracks up to 999,999. Clearing site data resets this local history. Neither document names nor contents are persisted in the tray, and no file contents are uploaded.

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
