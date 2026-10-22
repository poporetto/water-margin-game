# Lin Chong colour-only walking correction

On 22 October 2026, the user explicitly authorized scripted colour-only correction for the six original v1 stride frames in instructor front, exile left and exile back. These outputs start from motion v1, not the superseded regenerated v2 candidates.

The correction matches each material's lightness distribution and median Lab chroma to its approved neutral frame. Continuous colour transforms preserve the original pixel positions, geometry, resolution and transparency; there is no resizing, drawing or fixed-palette reduction. Near-black outline pixels are unchanged. Material masks use colour and approximate body region, so the measurements are diagnostics rather than a guarantee of perceptually identical shading across different poses.

All eight neutral frames and ten strides in unaffected rows are byte-identical to v1. The six original approved front/left/back neutral frames remain the colour references; right-facing neutrals retain the v1 separately authored asymmetric details. Original artwork and source-scale masters remain in ../linchong-classic-motion-v1/.

Open in-game.html for the actual game-background comparison: approved standing at left, walking at right. The tone selector switches between original v1 and corrected v3. Both outfits, all directions, three locations, pause, frame stepping and keyboard movement are available. compare.html shows enlarged looping sprites beside all three frames.

Run correct-colours.cjs with Sharp available to reproduce all images. colour-report.json records the material transforms; frames.json describes the sheets. validate.cjs verifies every alpha byte, transparent RGB, near-black outlines, lossless sheet packing and all 18 untouched files. It also verifies reduced hair/trouser/mantle lightness errors against neutral references. check-browser.cjs exercises both outfits and all directions, loop phases, keyboard movement, pause/step, before/after selection and three locations, with zero browser errors.

192 × 256 frames; 576 × 1024 sheets; down, left, right, up rows; neutral, stride A, stride B columns; 0 → 1 → 0 → 2 loop at 5 phases per second. Logical size 24 × 32, art scale 8. Approved by the user on 22 October 2026 and installed as production Lin Chong walking sprites: assets/sprites/linchong-official.png and linchong-exile.png, with matching docs copies. Runtime resolves the outfit using ch3_exiled or chapter > 3. Dedicated battle poses remain pending.
