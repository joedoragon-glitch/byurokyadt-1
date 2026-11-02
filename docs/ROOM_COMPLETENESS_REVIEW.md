# Room completeness — issue #7 candidate review

**Scope:** physical environment only. **Base:** main at 9b95387f4e2ee1966cfce7f1bc3ec9a66e4b0e9d (2 November 2026).
**Status:** implemented candidate in \`issue-7-room-completeness\`, not artistically accepted, merged, deployed, or physically device-tested.

## Deficiency inventory and design response

| Area | Base deficiency / preserve | Candidate response | Evidence to inspect |
| --- | --- | --- | --- |
| Front (+Z) | No mesh; operator stops at an invisible positive-Z limit | Full concrete wall at z=7 (12 × 6 m) with panel seams, form ties and subordinate service fittings | Matched operator turn / front-wall capture |
| Rear (-Z) | Poster wall is finished but has unconnected floor and ceiling junctions | Retain exact propaganda originals, ministerial signs, room clock, and its existing reveals; add continuous dull lower paint, skirting, chair rail and ceiling edge | Cinema 01 and 02 |
| Left (-X) | Window has glazing and casing but long untreated concrete planes | Repeat credible cast-concrete panel seams and restrained paint and joint finishes; add two sill brackets without moving or replacing winter image | Cinema 06 |
| Right (+X) | Door exists, but its surrounding concrete and small joinery lack continuation | Match wall panel/junction treatment; door gains frame/hinges, kick protection, threshold and peephole; retain sign, handle and closed-leaf geometry | Cinema 07 |
| Floor | Existing wear-pattern tiled surface is present; avoid replacing it to fix a wall issue | Keep existing floor shader/UVs. Add deliberate skirting and an actual fourth boundary at its perimeter | Operator, door, front |
| Ceiling | Concrete slab and coffer beams are already modeled | Preserve coffers and original fixtures; finish visible perimeter contact without modifying light count or shadow budgets | Operator and front |
| Filing cabinets | Repeated rectangular drawer fronts with handles and labels, low construction detail | Add cast plinths, top edge, shallow pulls, rivets and drawer channels; preserve old labels/dimensions/collisions | Cinema 06 and wide room |
| Telephone desk & instrument | Flat desktop and rudimentary receiver body | Recessed drawers, apron, receiver ends, dialing detail, physical cord; preserve period color and footprint | Wide room and door |
| Archive desk, chair | Simple flat forms at playable distance | Archive aprons/stringers, back rails, seat edge and leg braces; preserve original floor footprints | Cinema 06/07 and wide room |
| Radiator/clock/mug | Existing silhouettes are sound but fittings are sparse | Radiator manifolds/valve, clock rim/spindle, ceramic rim, original positions retained | Cinema 01 and close views |
| Paper stacks / machine / posters | Paper stack is already fine-layered instanced geometry; main machine and originals are approved art | No replacement or gratuitous rework | All closeups and full cycle |

The deficiencies above are **source-grounded construction findings**, not a claim that each rendered pixel has been aesthetically judged. The matched photos in the review workflow are the concrete visual-acceptance evidence.

## Reference-driven design

An [archived accounting-office photograph from the Byelorussian SSR, dated 1982–83](https://russiainphoto.ru/photos/140670/) documents period workstations, paperwork, a desk telephone, and ordinary institutional office fittings. A [historical overview of Soviet offices](https://realty.rbc.ru/news/577d23579a7947a78ce917c3) describes restrained grey finishes and period desk implements. These references inform construction language, **not** copied textures or new propaganda artwork. The accepted V9 cabinet and poster design remain controlled by [AESTHETICS.md](../AESTHETICS.md).

All new surfaces are geometry and deterministic text within \`js/app.js\` using existing scene materials, Three.js primitives and the existing label renderer. No external assets, generated third-party textures, new lighting, sound, game systems or libraries are introduced.

Repeated wall dado, trim, panel seams and corner arrises are submitted to material-grouped Three.js `InstancedMesh` batches, rather than separate draw calls; concrete front-wall form ties likewise share one instanced cylinder batch. The front-facing text on that wall is deliberately rotated inward. This was corrected after visual inspection found back-facing labels in the first rendered atlas. The corrected capture and actual draw-call cost are required for review.

## Architecture, scale, collision and cinematography

The new front wall spans x=-6..6 and y=0..6, with its room-facing surface at z=6.90. Lower paint, slim rails and skirting remain consistent across all walls. To keep the modeled inside skirting outside the player's 0.19 m collision radius, the free-walk horizontal boundaries move from ±5.68 to ±5.60 and the positive Z bound from 6.70 to 6.60. The existing eight cinematic positions and furniture obstacles are unchanged. The added threshold is within the original right-hand door obstacle; all other new protrusions are wall-mounted above walking height or lie inside existing furniture footprints.

The original room camera composition, all eight cinematic camera targets and travel interpolation, document machinery, cabinet material, winter lighting and animation remain unchanged. No indiscriminate per-object shadow enablement or new light is introduced; the existing source helpers continue to assign shadows consistently.

## Repeatable visual and engineering acceptance

The branch's non-deploying review workflow runs the original \`npm test\` (including paper/document/audio/offline and cinematic behavior), plus \`tests/room-shell.mjs\`. It additionally checks out **the exact baseline commit** into a separate directory and serves it on port 8001 alongside the candidate on port 8000. \`tests/room-visual.mjs\` captures the same default operator shot, a 180° front-wall turn, all eight cinematic shots, and a narrow operator shot, saving individually named **before**, **after**, and labeled side-by-side **PNG comparisons**. It records camera positions, draw calls, rendered triangle counts, errors and screenshot hashes in \`test-results/room-visual.json\`. These are **Chromium automation** measurements, not native GPU FPS or owner artistic approval. See the review workflow artifact for exact files and evidence.

## Focused owner aesthetic decisions

1. **Service-board language:** is the single front-wall \`ПОРЯДОК УЧЁТА\` procedural notice the right level of visible bureaucratic identity? It can be removed or reworded without redesign.
2. **Lower-wall finish:** should the existing muted grey-green painted dado remain subtle or lean slightly more toward desaturated concrete? No new palette was imposed on the main cabinet.
3. **Period wear:** keep new service boxes and joins as clean but aged institutional equipment, or add restrained localized wear in a subsequent owner-approved visual pass?

## Boundaries and remaining verification

Lighting/shadow authorship belongs to issue #6, performance characterization to the performance issue; any eventual simultaneous edits to \`js/app.js\` require a rebase and rerun. The browser screenshot atlas is for real visual comparison; screenshot generation does not equal a human visual acceptance. Physical iPhone, Chromebook, discrete GPU and installed-PWA checks remain separate from Linux Chromium automation. Do not merge/publish before the owner approves the visual result and technical CI is green.
