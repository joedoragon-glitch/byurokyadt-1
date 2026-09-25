# V10.1 paper and corridor correction

User review found that the output sheet appeared whole under the press, then intersected the chute during delivery. The V10 end-state screenshots did not catch those intermediate defects; its earlier claim of corrected ejection continuity was insufficient.

- Replaced the approximate sheet translation with a shared, arc-length platen/curved chute surface. The sheet is cropped at the printer mouth with matching UVs, and remains a fixed distance above the metal. Guide rods sit outside the paper width.
- Feed, press contact, red imprint, stamp retraction and delivery form one continuous sequence. The red stamp is drawn only at impact and follows the same sheet.
- Door approach schedules six muffled positional steps outside the wall after a short dwell. A cooldown prevents repeated triggering; occasional background passes remain. Mute stops scheduled voices.
- The production path passes 116,885 sampled vertex-clearance checks, arc-length checks and stamp registration. Existing camera checks pass 64 routes / 10,566 samples after widening the press view to include the entire chute.
- Release run `36100451758` stopped before deployment: its slower software renderer reached the old 90-second cycle limit during supported delivery (40.9%, positive clearance, no JavaScript errors). The two cycle-completion waits now allow 180 seconds; all geometry, sequence and interaction assertions remain. Runtime files are unchanged by this test-only correction.
- Slow software rendering initially skipped too many output frames. Paper-related tweens now advance by at most 100 ms per frame, preserving visible motion on slow devices and after tab suspension. Dynamic mesh hit bounds are recomputed during feeding.
- A new browser gate records nine rendered intermediate views and checks the actual sheet geometry, stamp timing, door approach, source positions, cooldown and mute. Final runtime commit `a4000f06f3dfe8ebb67c55ecef86e885ca349199` passed all three browser suites (39 categories) in review run `36100016436`. All nine motion images were inspected: first emergence, progressive feed, press descent/contact, three delivery positions and final placement. The mesh stayed at least 0.00599997 local units above the tray throughout 57 rendered samples. The actual door approach produced one six-step pass about 1.27 seconds after entering range; cooldown and mute passed.

---

# V10 audit — release review

Requested scope: cinematic inspection and photographs, mechanical weight and positional sound, winter atmosphere, and a persistent receiving tray/counter. Existing document-confirmation functions stay intact.

## Verification

- JavaScript syntax checks and whitespace/diff checks pass.
- The production cinematic controller was exercised with the vendored Three.js math and actual scene collision map. All 64 routes between eight viewpoints completed with 10,664 camera positions clear of furniture and walls; operator position/FOV restored on exit. This count belongs to the initial camera layout; revised framing is checked again by the same test.
- Both browser suites passed on review commit `842363c149c2d9f95b08c9f2e4f942e433927355`, run `36096369025`. They cover 31 categories across document processing, audio, collisions, counter/tray persistence, photographs, reduced motion, mobile layout and offline use.
- Actual scene PNG export is 2560 × 1440 and contains no controls. Render size is restored afterward. The ordinary scene reports about 335 draw calls and 31,500 triangles.
- Final corrected runtime commit `81eb6f901183b2a32419aa7393e427c514abfbee` passed both browser suites in run `36096867616`. Its cabinet portrait and CRT/meter images were inspected and accepted. The output-roller sound originates at the output roller.
- Final route verification sampled 10,604 clear positions across all 64 routes. A subsequent documentation-only commit records these results; it changes no runtime or test files.
- Earlier source review corrected stamp/paper contact and ejection continuity, a counter/label overlap, keyboard focus after using the view selector, and manual interruption of the guided tour.
- Counter stores only the issued total. Receiving tray displays at most 32 sheets; neither document names nor contents are persisted. The counter saturates at 999,999.

## Release gate

Joel explicitly authorized uploading, auditing/fixing, merging and publishing V10 to the existing public repository and GitHub Pages site on 25 September 2026. Final corrected screenshots passed visual review before merge. The deployment workflow repeats the same browser checks against the release files and live URL. Results are retained in GitHub Actions.

## Practical limits

Headless Chromium verifies rendered images, interaction and audio decoding/positioning. It cannot establish perceived sound balance on the user's speakers or device-specific ChromeOS performance. Source-only camera tests complement, rather than replace, the browser checks.

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
