# V10 audit — prepared, not published

Requested scope: cinematic inspection and photographs, mechanical weight and positional sound, winter atmosphere, and a persistent receiving tray/counter. Existing document-confirmation functions stay intact.

## Completed local verification

- JavaScript syntax checks and whitespace/diff checks pass.
- The production cinematic controller was exercised with the vendored Three.js math and actual scene collision map. All 64 routes between eight viewpoints completed, with 10,664 sampled camera positions clear of furniture and walls. Camera position/FOV restored on exit.
- Source review corrected stamp/paper contact and ejection continuity, a counter/label overlap, camera keyboard focus after using the view selector, a range-input browser-test interaction, and movement interruption of the guided tour.
- Camera capture restores render size/pixel ratio in a finally block and exports scene pixels without UI. Continuous rendering is restricted to active movement and mechanisms; daylight requests at most one frame per second except during a brief passing-light event.
- A new browser acceptance suite covers travel, photographs, camera restoration, guided tour, manual collision, reduced motion, portrait layout, offline export and spatial/winter audio. Existing end-to-end checks additionally verify recoil, paper deformation, counter and tray persistence.

## Pending validation / publication

Rendered visual review, the complete browser suites, and live deployment are NOT yet complete. Automatic approval review rejected uploading the modified source and workflows to the existing public repository, including after ownership/public visibility and the matching V9 commit were verified. The requested next authorization is to upload V10 to this same repository, run its review workflow, fix audit findings, and merge/publish the passing release to its existing GitHub Pages site.

No V10 source has been uploaded and V9 remains live. This document does not claim a successful browser audit.

---

# V9 release audit

Scope: Joel requested a complete aesthetic pass matching the two original illustrations, a richer office, original audio, readable Hollywood Soviet English controls, collision protection, and an autonomous audit/debug/release pass.

## Implemented corrections

- Cabinet rebuilt around the reference silhouette and panel proportions; square inset CRT, switch column, paired meters, ministry plate, extended input bed, recessed press and side hardware.
- Meter needles pivot from the scale origin and sweep over the printed scale. Sheet artwork faces upward and follows the output chute.
- Worn enamel uses one generated, compressed texture. Lettering stays deterministic and readable. Repeated screws and paper sheets are instanced to reduce draw calls.
- Cold closed winter window, solid door, wood/linoleum desk, green lamp, archive stacks, telephone and chair complete the office.
- Player-radius collision footprints cover furniture, window sill, door hardware and walls; normalized movement slides along obstacles and uses short steps to avoid tunneling.
- Idle scenes render only when changed, avoiding continuous GPU work. Clock updates are limited to ten-second intervals. Animation and movement still request frames immediately.
- View changes fade between clear positions. Keyboard movement keeps working after clicking buttons. Hidden output paper is excluded from picking.
- External instructions and controls use Hollywood Soviet English; controls also have plain-English accessible names.
- Original 64-second stereo instrumental and six mechanical/room assets replace oscillator beeps. Music and effects toggle independently, volume is adjustable, music ducks during processing, and tab hiding suspends audio.
- All runtime files are included in the offline shell. No remote runtime, third-party music, telemetry or file-upload service is involved.

## Verification record

The complete browser acceptance suite passed on review commit `7b578203bf9d65c928f23ea7d740f22ac7979ed1`, [review run 36089217304](https://github.com/joedoragon-glitch/byurokyadt-1/actions/runs/36089217304). It covered 15 categories: asset decode, WebGL, document selection, the mechanical cycle, PNG export, reset, cached reload, offline reload, audio controls, offline audio, cabinet dimensions, furniture footprints, actual walking collision, narrow layouts, and idle rendering. No JavaScript page errors were recorded.

The rendered audit corrected excessive enamel bump, an output sheet sinking into its chute, oversized sheet layers, low-frame-rate walking, continuously rendering an idle room, and the camera framing near the lower UI. Screenshot checks wait for camera fades to finish. A software renderer receives bounded extra time for the full cycle; the production animation durations are unchanged.

The static scene reported approximately 327 draw calls and 31,440 triangles. The complete cached runtime is about 2.4 MB. Machine bounds are approximately 1.32 m wide, 1.20 m high and 0.94 m deep including projecting mechanisms and handles.

Final camera framing is checked by the last review run. Publication runs the same acceptance suite before deployment and again against the live Pages URL. Current release results and screenshots are available in [GitHub Actions](https://github.com/joedoragon-glitch/byurokyadt-1/actions).

## Practical limits

This is a stylized real-time interpretation of the reference, not a photoreal reconstruction. Headless Chromium can verify rendering, actions, audio decoding and offline behavior; it does not establish real ChromeOS installation or the perceived sound balance on the user's speakers.
