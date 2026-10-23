# Wu Yong · Classic standing candidate

Front, left and back neutral standing views created with built-in `image_gen.imagegen`. This is a review candidate; right-facing artwork and walking animation remain pending. No weapon or fan appears in standing views.

Wu Yong's own expression portrait supplies the slim scholarly identity, narrow eyes, fine moustache and pointed chin beard, navy wrapped scarf with attached tails, teal robes and pale patterned edging. `../songjiang-style-variations-v8/variant-a-original.png` supplies approved Classic rendering and original head/body proportions.

- `wuyong-original.png`: unchanged 1774 × 887 native transparent source.
- `prompt.txt`, `generation.json`: exact prompt and built-in generation provenance.
- `wuyong-front.png`, `wuyong-left.png`, `wuyong-back.png`: 192 × 256 cells with a shared nearest-neighbour scale, two-pixel source bounding-box padding and baseline 255. Character height is 226 pixels, at 24 × 32 logical world size and artScale 8.
- `wuyong-turnaround.png`: 576 × 256 three-view strip.
- `wuyong-review-sheet.png`: 576 × 1024 standing-only atlas. Front, left and back rows repeat one neutral view three times; the right row is blank. This is not animation.
- `pack.cjs`, `packing.json`: reproducible normalization without recolouring, quantization or artwork reconstruction. Source colours and alpha are preserved through one nearest-neighbour sample.
- `check-assets.cjs`, `asset-checks.json`: dimensions, transparency, alpha-edge clipping, exact repeated atlas pixels and blank-right-row validation.

Native and packed turnaround were visually inspected: all three figures are complete with attached scarf tails, visible hands and feet, consistent teal/ivory/navy materials, and readable facial detail. Every packed view has visible alpha bounds at y=29…254; no frame touches an outer edge. Native alpha contains partially transparent pixels across much of the image; that generated alpha is retained unchanged rather than hardened.

`compare.html` displays the three standing views and native source link. `in-game.html` defaults the shared game-background preview to `wuyong`, using `../luda-classic-motion-v1/in-game.js`; the parent task manages its shared catalog and browser integration. No production asset or manifest was modified.

Run packing/checks with Node and the bundled dependencies, for example `NODE_PATH=/Users/andriastaniwan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node art/wuyong-classic-v1/check-assets.cjs` from the repository root.
