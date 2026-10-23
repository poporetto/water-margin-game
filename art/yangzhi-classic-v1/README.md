# Yang Zhi · Classic standing candidate

Unapproved front/left/back standing design, generated on 23 October 2026. This is a standing review only; no animation or production integration is implied.

Yang Zhi’s expression portrait supplies his stern square face, short beard, blue-grey birthmark on his anatomical left temple/cheek, olive military helmet with black horsehair crest, dark olive lamellar armour, bronze edging and ivory inner collar. Song Jiang’s approved original Classic supplies the sprite rendering and original head/body proportions. Hands are empty in all three views.

- `yangzhi-original.png`: unchanged native transparent generated source.
- `prompt.txt`, `generation.json`: exact prompt and built-in imagegen provenance.
- `yangzhi-front.png`, `yangzhi-left.png`, `yangzhi-back.png`: 192 × 256 RGBA cells, one shared nearest-neighbour scale from the native source, baseline 255.
- `yangzhi-turnaround.png`: front/left/back packed strip.
- `yangzhi-review-sheet.png`: preview atlas with repeated standing rows and a blank right row; it is not a walking animation.
- `pack.cjs`, `packing.json`: alpha ≥ 200 bounds with two-pixel padding; maximum character height 228px at logical size 24 × 32 and artScale 8. Source colours and alpha are preserved without palette reduction or recolouring.
- `asset-checks.json`: dimensions, alpha, clipping and atlas validation.

`compare.html` shows the packed views and links the original source. `in-game.html` defaults to Yang Zhi and uses `../luda-classic-motion-v1/in-game.js`, with actual game location backgrounds. The shared preview catalog is maintained separately. No production assets or manifest were changed.
