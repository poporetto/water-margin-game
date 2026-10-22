# Lu Da · Approved Classic walking

Requested on 22 October 2026 after approval and installation of Lu Zhishen walking v2. This is Lu Da before his monastic vows: the same broad, bearded man in his olive garrison uniform, wrapped cap, ivory trim, brown belt and boots. The reference is `../luda-luzhishen-classic-v1/luda-original.png`; Song Jiang's original Classic remains the series style anchor.

`in-game.html` compares the standing pose with the walking animation on three actual game backgrounds. The Character selector includes Song Jiang, both Lin Chong outfits, Lu Zhishen and Lu Da. Choose **All characters together** to compare all five approved sprite sets at the same world scale. The preview reads the installed production PNGs directly. Use direction buttons, pause/step and arrow keys. `compare.html` shows the full directional strips and animated detail views. Approved and installed unchanged in `assets/sprites/luda.png` and `docs/assets/sprites/luda.png` on 22 October 2026. Both manifests declare 8× density.

## Assets and method

- `luda-walking.png`: 576 × 1024, rows down/left/right/up; columns neutral/stride A/stride B. Each cell is 192 × 256 at 8× art density, maintaining the existing 24 × 32 world size.
- `luda-standing.png`: neutral reference repeated across each row.
- `luda-walking-master.png`: source-density atlas in 768 × 1024 cells; retained without reduction.
- `front/left/back-0.png`: exact original standing PNGs. The unseen right view is separately generated.
- `*-raw.png`: selected native generated strips; all original attempts and exact prompts are preserved. Built-in `image_gen.imagegen` generated the direction strips, right-stride correction, and material-tone revisions.
- `build-inputs.cjs` creates edit canvases directly from the native standing source. `pack.cjs` applies one shared nearest-neighbour scale per row and packs RGBA bytes losslessly. There is no palette quantization or scripted recolouring; natural head bob is allowed.

The right strip initially repeated its near-arm phase. The third pose was regenerated with the opposite swing. A subsequent generation pass matched olive cloth and charcoal trousers more closely to the original standing design. Tone statistics are diagnostics, not proof of identical lighting: arm positions and garment folds change sampled areas.

## Verification

`validate.cjs` checks exact original neutral frames, distinct strides, dimensions, clipping and lossless atlas packing; its material diagnostics are in `validation.json`. `check-browser.cjs` serves the local preview over HTTP and checks four directions, the complete 0→1→0→2 loop, pause/step, keyboard movement, all three backgrounds, 8× rendering and the detail page. Reports and screenshots are retained alongside the assets.

Run these scripts with Sharp and Playwright available through NODE_PATH. Native generation paths are recorded in `generation.json`.

Production integration is checked by `tools/test-luda-sprite.js`, including exact installed PNG bytes, frame sampling, movement, idle, density and separation from the monk costume in both root and docs builds. The expanded preview check covers all five selections and the group lineup, all directions/phases, stationary references, map changes, mobile controls and detail links.
