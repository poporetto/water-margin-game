# Approved sprite preparation method

User-approved on 21 October 2026, based on `songjiang-suikoden2-v7/in-game.html`. That approval covers the preparation and preview method, **not** the v7 character style. The user subsequently approved **Song Jiang Classic (variant A)** in `songjiang-style-variations-v8/variant-a-original.png` and requested Lin Chong in the same style.

## Preserve the artwork

- Keep each original generated PNG and its generation prompt. Save new explorations in versioned sibling folders.
- Preserve the original colours and transparency. Do not force detailed generated artwork into a 16–24 colour palette after generation; that destroyed facial features and clothing contrast in v6.
- Do not aggressively shrink generated illustrations into 48 × 64 cells. The accepted walking baseline is **96 × 128 pixels per frame**, 288 × 512 for a three-column/four-row walking sheet.
- Use nearest-neighbour sampling once from the original source. Never derive a new version by enlarging an already reduced export.
- Use a shared scale across a source strip, stable head/body alignment and a common foot baseline. Do not independently stretch frames to fill their cells.
- Battle assets now use **one static, dynamic combat pose facing left**. Allow a wider single frame to fit the weapon without shrinking the character; 128 × 128 or a wider canvas is appropriate. The old v7 three-frame sword strip is a superseded experiment.
- Preserve the source artwork's pixel colours; a strict low-resolution pixel-art version needs deliberate pixel-level redesign, not repeated reduction and colour quantization.

### Detail and consistency revision

The user found the v1 Classic walk's motion good but its proportions and detail inconsistent with the approved original. Preserve the original standing views as exact neutral frames and reuse invariant head/face artwork through the cycle where it fits the action. Generate each complete directional strip from a canvas containing the actual original source, with the original robe length, body proportions and ornament detail specified. Avoid using a previous drifting generation as the design reference.

For this detail-sensitive work, export **192 × 256** frames (576 × 1024 walking sheet) directly from source, and retain a source-scale master plus the raw strips. Keep the **24 × 32 logical world size** with `artScale=8` and an **8× preview buffer**. A 96 × 128 compatibility export can also be provided, directly sampled from source. Do not enlarge a reduced export to make the detailed version. Compare the original standing sprite beside the moving sprite on the same game background, with a separate enlarged detail comparison. Locking an invariant region must be inspected for visible seams.

The [v2 comparison](songjiang-classic-motion-v2/compare.html) and [game preview](songjiang-classic-motion-v2/in-game.html) are review candidates. The original Classic remains the approved style anchor.

**Subsequent feedback:** v2 left/right movement is approved; preserve it exactly. For front/back, fix the broken shoulder gold bands, brightness variation and missing eye white. The user allows a slight natural head bob and does not require head/shoulder locking. Avoid the hard rectangular splice used in v2, which introduced a trim discontinuity. Check the eyes after the final game render, since a visible white cluster in the source can disappear when sampled for display. See the [v3 game preview](songjiang-classic-motion-v3/in-game.html) and [refinement record](songjiang-classic-motion-v3/README.md).

## Preview in the actual game location

- Show candidates against actual game location backgrounds, with a location selector and direction controls. Start with the tavern interior; marsh tavern and Liangshan courtyard are also useful.
- Maintain the character's logical world size: walking `cw=24`, `ch=32`, physical asset density `artScale=4` for 96 × 128 cells. Wider 128 × 128 battle cells use `cw=32`, `ch=32`.
- Preserve the higher source density through the preview world buffer: use a four-times-density canvas while retaining the game's logical coordinates. A higher-resolution file alone is insufficient if the renderer reduces it back into the older buffer.
- Keep preview-specific renderer changes in the preview. Do not change the shipped game's rendering or asset manifest just to compare art.
- In a walking preview, pass animation phase indices **0, 1, 2, 3** to `WM.sprites.draw`; the engine itself maps those indices to sprite columns **0, 1, 0, 2**. Applying the column sequence twice skips a stride.
- Inspect front, left, right and back at normal game display size, and check the sword pose separately. Check transparent edges, stable feet, readable face and consistent scale.

## Art approval

- The complete `songjiang-classic-motion-v3/songjiang-walking.png` sheet is now approved and installed as the production Song Jiang walking asset. Its left/right rows preserve v2, while its front/back rows include the approved trim, eye-white, brightness and natural-bob refinements.

- For style exploration, generate only the requested directions/poses first. The established initial comparison uses front, left and back standing views.
- Approved style anchor: [Song Jiang Classic](songjiang-style-variations-v8/variant-a-original.png). Match its proportions, pixel clusters and rendering for other characters; preserve each character's own portrait identity, hair and clothing.
- The user chose the original Classic head size over the +10% head experiment. Keep the original proportions in walking and battle generation.
- Walking uses distinct alternating limb phases in four directions. Battle uses one energetic left-facing pose, with no idle cycle or three-pose requirement.
- Do not mistake acceptance of the preparation method for acceptance of a character design.
- References: [v7 preparation script](songjiang-suikoden2-v7/pack.cjs), [v7 game preview](songjiang-suikoden2-v7/in-game.html), [v7 preview implementation](songjiang-suikoden2-v7/in-game.js).
