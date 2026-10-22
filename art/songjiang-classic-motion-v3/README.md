# Song Jiang — trim, eyes and natural bob

Refines the front and back walking rows after feedback about broken gold trim, brightness changes, and a missing eye white. The user approved the v2 left and right walks; those complete rows are copied pixel for pixel in all three exports.

## Preview

- [Game-location preview](in-game.html): original reference on the left, refined movement on the right. The selector includes corrected standing and v2 before these fixes.
- [Detail comparison](compare.html): original, refined movement and v2, with direction controls and frame stepping.
- [Actual game-rendered eye detail](face-game-detail.png): enlarged screenshot crop, showing both eye whites surviving final rendering.

## Changes

Front/back gold shoulder bands are drawn continuously through the shoulder-to-torso transition. The hard rectangular head/shoulder replacement used in v2 has been removed. Natural variation in the poses gives a small 1–2 pixel head bob in the 192 × 256 export while feet share a baseline. The front eye whites are more readable, including the character's right eye. Red and gold tones were matched between phases, with an additional brightness edit for the back strip.

These front/back frames were edited as complete strips using the built-in image generation tool. They therefore contain small drawn differences; they are not pixel-identical to the original standing reference. The approved side walks remain untouched. The original Classic remains the design reference.

## Deliverables

| File | Layout |
| --- | --- |
| [songjiang-walking.png](songjiang-walking.png) | 576 × 1024 sheet; 192 × 256 cells. |
| [songjiang-walking-96.png](songjiang-walking-96.png) | 288 × 512 compatibility sheet; 96 × 128 cells. |
| [songjiang-walking-master.png](songjiang-walking-master.png) | 2304 × 4096 master; 768 × 1024 cells. |
| [corrected-standing.png](corrected-standing.png) | Detailed neutral frames repeated for preview compatibility. |
| [frames.json](frames.json) | Layout, source bounds, common directional scales and frame tops. |

Rows: **down, left, right, up**. Columns: **neutral, stride A, stride B**. Animation sequence: **0 → 1 → 0 → 2**, five steps per second. Detailed preview retains the same 24 × 32 world size with an 8× drawing buffer.

Each export is prepared directly from its source using a shared directional scale and nearest-neighbour sampling. No palette reduction is applied. Raw images remain intact; low-alpha halo pixels below 128 are suppressed during preparation. [prepare.cjs](prepare.cjs) and [validate.cjs](validate.cjs) use Sharp.

## Sources and prompts

- Front: [edit canvas](front-edit-canvas.png), [prompt](front-prompt.txt), [raw result](front-raw.png).
- Back: [edit canvas](back-edit-canvas.png), [prompt](back-prompt.txt), [first result](back-first-pass.png), [brightness refinement prompt](back-tone-prompt.txt), [final raw result](back-raw.png).
- Side frames: the corresponding v2 export, copied without resampling or alpha-compositing changes.

## Checks

[Image validation](validation.json) records exact preservation of both side rows, front/back colour statistics and the subtle height variation. [Browser checks](browser-checks.json) cover all animation phases and directions, comparison modes and three location backgrounds without page errors. Gold-band continuity and game-size eye visibility were checked visually.

The user subsequently approved this walking sheet and requested integration. It is installed unchanged as `assets/sprites/songjiang.png` and `docs/assets/sprites/songjiang.png`, registered at density 8. The production viewport now retains that density while map caches keep their existing resolution. The existing battle-pose artwork is unchanged.
