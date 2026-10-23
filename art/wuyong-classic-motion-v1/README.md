# Wu Yong · Classic four-direction walking review

Review candidate, not installed in production. Open [in-game.html](in-game.html) for the shared game-background preview with this character selected, or [compare.html](compare.html) for animated/detail comparisons.

- `wuyong-walking.png`: 576 × 1024 RGBA; twelve 192 × 256 cells.
- Rows: front/down, left, separately authored right, back/up.
- Columns: exact approved neutral, stride A, stride B. Engine phases 0,1,2,3 map to columns 0,1,0,2.
- Game logical size remains 24 × 32 with artScale=8 and an 8× world preview buffer.
- `wuyong-standing.png`: static neutral comparison sheet.
- `wuyong-walking-master.png`: native-density review master with uniform directional normalization directly from raw source. Original neutral crops are retained at native size.

Front uses the corrected v2 native original; left/back native crops use v1 to match exact approved side/back PNGs. Preserves slender build, blue scholar robe, patterned tan trim and navy turban. Front/left strides use 0.97 uniform adjustment to match standing head/body width. Left/back B phases were corrected by whole-strip edits.

## Preservation and generation

`source.json` records every native crop and approved folder. `build-inputs.cjs` reconstructs the native seed/edit canvases. Each directional strip was authored through the built-in `image_gen.imagegen` tool, with a separate right-facing request. Exact prompts and returned source paths are beside the raw PNGs in `*-prompt.txt` / `*-generation.json`. Earlier raw passes are preserved under versioned or `before-*` names. No palette reduction, quantization, scripted recolouring, head locking or pixel splices were applied. Small natural bob is retained. Frames are sampled directly from native raw images with nearest-neighbour, preserving original colours/alpha; neutral front/left/back PNG bytes are copied exactly from the approved review.

## Verification

Run `node pack.cjs`, then `node validate.cjs` (requires sharp; use the bundled runtime NODE_PATH if necessary). `frames.json` records scales/crop bounds. `validation.json` verifies dimensions, twelve distinct cells, exact approved neutral PNGs, transparent edge clearance and lossless RGBA sheet packing, with approximate tone diagnostics. Visual review checked every native strip, opposite limb phases, head/torso apparent size against standing, connected costume detail, consistent materials and character asymmetry. Shared game browser checks are coordinated by the parent task.

Only walking reviews are included. Battle artwork and production manifests are outside this batch.
