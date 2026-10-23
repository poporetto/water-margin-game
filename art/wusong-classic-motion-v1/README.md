# Wu Song · Classic walking review

The user approved `../wusong-classic-v1/` on 23 October 2026 and requested animation. This folder contains a four-direction walking review, not yet installed as production art.

Open `in-game.html` to compare the approved standing pose with the walking loop on the tavern interior, marsh tavern or Liangshan courtyard. The shared character selector also includes this walking review. `compare.html` shows all direction strips beside animated detail views.

## Preserved design and exports

- The original front, left and back neutral PNGs are retained byte-for-byte. The right-facing view is separately generated from the approved turnaround.
- The youthful clean-shaven face, original head/body proportions, indigo pilgrim robe, tan edging, connected wooden prayer beads, charcoal trousers and brown wraps guide all frames. A small natural head/shoulder bob and hair/tail sway are allowed.
- `wusong-walking.png`: 576 × 1024; 192 × 256 cells; down/left/right/up rows; neutral/stride A/stride B columns. Runtime sequence 0→1→0→2, five phases per second, 24 × 32 logical size at artScale 8.
- `wusong-standing.png`: neutral rows repeated for comparison.
- `wusong-walking-master.png`: native-density crops packed in 768 × 1024 cells, without reduction.
- `*-raw.png`: selected native strips. Initial outputs and intermediate phase corrections are retained, including the rejected front phase attempt. `generation.json` records their original paths.
- `*-prompt.txt`, `*-phase-prompt.txt`, `*-phase2-prompt.txt`: exact built-in `image_gen.imagegen` prompts. The initial front and side strips repeated a limb phase; targeted edits corrected the alternating arms/legs before export.

`build-inputs.cjs` builds directional edit canvases from the approved native source. `pack.cjs` applies one common nearest-neighbour scale per direction, aligns the head/body and preserves the baseline. It copies raw RGBA pixels losslessly into the atlas. No palette reduction, scripted recolouring or head/shoulder splices were used.

## Checks

`validate.cjs` verifies frame dimensions, distinct images, exact original neutral PNGs, clear frame edges and lossless atlas packing. `validation.json` also contains approximate material-tone diagnostics; pose changes affect these sample distributions, so they supplement visual review rather than guarantee identical lighting.

`check-browser.cjs` serves the preview over local HTTP and checks all four directions, every loop phase, pause/step, keyboard movement, three game backgrounds, detail-image loading and 8× rendering. Reports and screenshots are stored here. The shared selector regression check is `../luda-classic-motion-v1/check-browser.cjs`.
