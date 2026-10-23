# Wu Song · Classic standing candidate

Standing design approved on 23 October 2026 with a request for animation. The resulting four-direction walking review is in `../wusong-classic-motion-v1/`; it is not yet installed in the game. The next character was selected from the first-batch list after Lu Zhishen; the user subsequently asked a Sol agent at medium reasoning to work on another character in parallel (Li Kui).

Wu Song's own expression portrait supplies his clean-shaven square jaw, long dark hair, slate headband, indigo pilgrim robe, beige trim and wooden prayer beads. Original Song Jiang Classic supplies the style; Lin Chong supplies a medium-build comparison. The first generation acquired a chin beard from the reference, removed in a targeted built-in imagegen edit. Both native sources and exact prompts are retained.

- `wusong-original.png`: selected native transparent turnaround, unchanged.
- `wusong-initial-original.png`: superseded generation with chin beard.
- `prompt.txt`, `face-correction-prompt.txt`, `generation.json`: exact prompts and built-in `image_gen.imagegen` provenance.
- `wusong-front.png`, `wusong-left.png`, `wusong-back.png`: 192 × 256 cells, one common source scale and baseline 255.
- `wusong-turnaround.png`: front/left/back strip; `wusong-review-sheet.png`: standing-only runtime preview atlas with blank right row.
- `pack.cjs`, `packing.json`: opaque bounds with two-pixel padding; one nearest-neighbour resize from the native source, no palette reduction, lossless RGBA packing. Maximum height 228px at the same 24 × 32 world size and artScale 8.

`in-game.html` uses the shared character preview in `../luda-classic-motion-v1/`, defaulting to Wu Song and showing his latest walking review beside the original neutral frame. It also exposes the approved walking sprites and Li Kui's standing candidate, with an all-character lineup and three actual game backgrounds. Li Kui remains a standing candidate with front/left/back views; Wu Song now has all four walking directions. `compare.html` shows larger static views and links the source.

The shared `../luda-classic-motion-v1/check-browser.cjs` verifies selection, authored directions, animation/static behavior, references, map changes, mobile controls and detail links. Source dimensions, transparency, clipping and atlas pixels are checked separately in `asset-checks.json`.
