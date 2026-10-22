# Song Jiang — Classic consistency revision

Revises the walking artwork to follow the approved [Classic original](../songjiang-style-variations-v8/variant-a-original.png) more closely, retaining its original head size, long robe, body proportions and ornament detail. This is a review candidate; the original remains the approved style template.

## Compare

- [Game-background comparison](in-game.html): approved original on the left, revised walk on the right. Change facing or location; pause or step through frames. The selector also includes the previous movement for comparison.
- [Enlarged detail comparison](compare.html): original, revised movement and previous movement at equal scale.

## Files

| File | Contents |
| --- | --- |
| [songjiang-walking.png](songjiang-walking.png) | Detailed 576 × 1024 sheet; 192 × 256 frames. |
| [classic-original-hd.png](classic-original-hd.png) | Original standing artwork prepared at matching detail and world size. |
| [songjiang-walking-master.png](songjiang-walking-master.png) | 2304 × 4096 source-scale master; 768 × 1024 cells. Retains the source-sized figures without downsampling. |
| [songjiang-walking-96.png](songjiang-walking-96.png) | Compact 288 × 512 compatibility sheet; 96 × 128 cells. |
| [frames.json](frames.json) | Frame layout, scale, head-lock boundaries, source bounds and timing. |
| [prepare.cjs](prepare.cjs) | Reproducible extraction, normalization and original-art lockback. Requires Sharp. |

Rows are **down, left, right, up**. Columns are **original idle, stride A, stride B**. Play **0 → 1 → 0 → 2** at five steps per second. Right-facing frames mirror the left-facing frames.

The original neutral frames are reused rather than regenerated. The upper 34% of the figure (cap, face and beard, or rear head) is copied from the original into each stride, including its transparent surround. A common scale per directional strip matches the generated standing height to the original; frames are not independently stretched. The body and moving cloth still contain generated differences, so this is not a claim that every costume pixel is identical throughout the walk.

The detailed export retains four times the pixels per frame of the previous 96 × 128 export. All exports are independently sampled from the original/source strips with nearest-neighbour sampling and no palette reduction. Low-alpha generated halo pixels are removed below alpha 128; retained pixels keep their alpha and RGB values. Raw files remain untouched. The detailed preview uses an 8× world buffer and the same 24 × 32 logical character size. Final visible detail still depends on the display size.

The master has its own source-scale layout; use its frame dimensions when extracting, rather than assuming the game export is a direct quarter-size version.

## Generation record

Generated using the built-in image generation tool. Each edit canvas contains three copies of the exact original directional figure, at source resolution. Each complete directional strip was generated together:

- Front: [prompt](front-prompt.txt), [edit canvas](front-edit-canvas.png), [first draft](front-draft.png), [opposite-stride refinement prompt](front-refinement-prompt.txt), [final raw strip](front-raw.png).
- Left: [prompt](left-prompt.txt), [edit canvas](left-edit-canvas.png), [raw strip](left-raw.png).
- Back: [prompt](back-prompt.txt), [edit canvas](back-edit-canvas.png), [raw strip](back-raw.png).

The direction seeds are lossless crops of the approved original. Preparation uses Sharp equivalents of the sprite pipeline's canvas, shared-scale normalization and seed-lockback steps to support rectangular frames and preserve the original source resolution.

## Verification

[Image checks](validation.json) confirm the compact idle frames match the approved original export pixel for pixel, the locked head regions match across all strides, stride A and B differ, and the right row mirrors the left row. [Browser checks](browser-checks.json) confirm all four phases, synchronized comparison directions, pause/step, three game backgrounds, and the enlarged comparison, with no page errors.

The previous single left-facing battle pose remains in the v1 folder. This revision supplies walking review assets; production sprite manifests are unchanged.
