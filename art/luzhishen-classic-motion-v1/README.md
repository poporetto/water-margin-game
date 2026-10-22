# Lu Zhishen · Classic walking candidate

The user requested Lu Zhishen animation on 22 October 2026 from the standing design in ../luda-luzhishen-classic-v1/. This work covers Lu Zhishen only; Lu Da remains at the standing-design stage.

Four directions, each with neutral plus two opposing strides. The front, left and back neutral PNGs are exact copies of the standing design. Right-facing views were newly drawn so the near anatomical left shoulder stays robed; the tattooed anatomical right arm remains on the far side. The right-facing reference beside the walker is the new neutral, not a previously approved source frame.

Open in-game.html for the standing reference beside the walk on three actual game backgrounds, with direction selection, pause, frame stepping and arrow-key movement. compare.html shows the four looping directions beside their three frame strips.

The sheet is luzhishen-walking.png: 576 × 1024, three 192 × 256 cells per row, down/left/right/up rows. Logical world size stays 24 × 32, artScale 8. Loop phases 0,1,0,2 at five phases per second. Front/left/back neutrals are preserved exactly; no fixed head/shoulder splices or palette reduction. A small natural bob is allowed.

Generation used built-in imagegen. Exact prompts are *-prompt.txt and *-phase-prompt.txt. Source-scale edit canvases were created from the actual standing original. Native generation PNGs are *-raw.png; first left/right/back candidates are retained as *-first.png. Those first candidates repeated a stride limb phase; targeted whole-strip image edits corrected the third frame. The source-density master is luzhishen-walking-master.png. All native originals are retained.

pack.cjs normalizes all three frames in a direction with one shared scale, aligning the head centre to the original standing reference and keeping the foot baseline inside the fixed cell. It samples the original generation once with nearest-neighbour and packs raw RGBA without compositing colour shifts. It does not remap colours, edit anatomy or quantize a palette. frames.json records source bounds and normalization.

validate.cjs checks dimensions, clipping, distinct stride frames, exact original neutrals and lossless sheet packing. It also records approximate material luminance percentiles so shifts in beard, robe, skin or trousers are visible, rather than testing only the robe median. Sampling regions can include different pixels as limbs move, so those measurements support visual review rather than proving identical tones. Median skin/robe variation within each row is at most 5/255. The newly drawn right side has slightly lighter overall shading than the original left side; its cycle is internally consistent.

check-browser.cjs checks all four directions and loop phases, pause/step, keyboard motion, three maps, density and detail loading. See validation.json and browser-checks.json.

Walking review candidate only; not installed in production. Dedicated battle art remains one static dynamic left-facing Iron Chan Staff pose, to be produced separately.
