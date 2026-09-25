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

Review rendering and browser acceptance are in progress. Final release evidence is recorded after the visual review and live acceptance complete.

## Practical limits

This is a stylized real-time interpretation of the reference, not a photoreal reconstruction. Headless Chromium can verify rendering, actions, audio decoding and offline behavior; it does not establish real ChromeOS installation or the perceived sound balance on the user's speakers.
