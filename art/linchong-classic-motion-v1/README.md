# Lin Chong Classic — both walking outfits

Walking review candidate based on the user-approved `linchong-classic-v2` instructor and exile designs. Open [in-game.html](in-game.html) to compare walking against standing on actual game backgrounds, or [compare.html](compare.html) for animated enlarged loops beside each three-frame strip.

Both outfits have front, left, right and back movement. Each direction has neutral, stride A and stride B; play neutral → A → neutral → B at five phase changes per second. Front, left and back neutral frames retain the approved 192 × 256 images exactly. Right-facing neutral and movement were generated separately, hiding the anatomical-right cheek tattoo and silver ornament on the far side rather than blindly mirroring the marked left profile.

## Files and method

- `official-walking.png`, `exile-walking.png`: 576 × 1024 sheets, three columns and four rows (down, left, right, up). Frame size 192 × 256; logical world size 24 × 32; artScale 8.
- `*-walking-master.png`: 2304 × 4096 packed masters, 768 × 1024 cells. Native generated strips and approved original sources remain the authoritative high-detail originals.
- `*-standing.png`: neutral-frame sheets for comparison.
- `*-raw.png`: selected full-detail source strips. Drafts and pre-tone passes are preserved separately.
- `*-prompt.txt`, `*-refinement.txt`: generation, motion and tone-correction prompts. All image creation and artistic corrections used the built-in image generation tool.
- `build-inputs.cjs`: prepares native-resolution reference crops and transparent three-slot canvases with Sharp. This preserves the large source seed instead of forcing it through a small square slot.
- `pack.cjs`: shared scale per directional strip anchored to the approved seed height, head alignment, natural small vertical bob, and detailed nearest-neighbour export. No hard head/shoulder splice or palette quantization. Alpha below 128 is suppressed at generated edges; RGB values are retained. Final sheets use lossless raw pixel packing to avoid premultiplied-alpha rounding of approved neutrals.

## Colour and motion refinement

Initial generation repeated some arm/leg phases; targeted edits separated them. Several generated strips were brighter than the originals. Separate image-generation tone passes restored the original dark forest green, muted gold, slate blue and grey-brown mantle. Existing poses were retained through those edits.

Material-colour sampling in `frames.json` and `validation.json` is a diagnostic, not a claim of identical palettes. Final median cloth luminance varies by at most 3/255 within a direction; mantle luminance varies by at most 6/255. Differences in silhouette and moving folds remain hand-reviewable in the animated comparison. Full source colours and fine details are retained instead of reducing to a fixed small palette.

## Verification and status

`validate.cjs` verifies all 24 frames, six exact approved neutrals, distinct stride images, transparent canvas margins, no clipping and material-tone limits. `check-browser.cjs` checks both outfits, all directions and animation phases, pause/frame-step controls, keyboard movement, three real map backgrounds, detail-page assets, density 8 and browser errors. Results are saved alongside the preview.

This is a walking preview for review, not a production Lin Chong asset replacement. Production Song Jiang integration remains in place. Battle art remains a separate task: one dynamic static left-facing Serpent Spear pose per outfit, as requested.
