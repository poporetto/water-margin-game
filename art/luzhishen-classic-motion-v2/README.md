# Lu Zhishen · Corrected side directions

The user approved the v1 motion but requested the two side sets be swapped and horizontally mirrored. This revision performs that exact atlas mapping, including each row's neutral frame:

- Left-facing = mirror of v1 right-facing.
- Right-facing = mirror of v1 left-facing.
- Front and back = unchanged v1 pixels.

Each cell is mirrored independently, so neutral / stride A / stride B ordering, timing, world size, colours, detail and alpha are preserved. No new art generation, resampling, palette correction or scaling was applied. Both walking and standing sheets, all frame/strip exports and the source-density master follow the same mapping.

Run pack.cjs to reproduce the correction from immutable v1 assets. Its validation compares every RGBA pixel against the requested mapping, including unchanged front/back rows and transparent pixels. See validation.json. Original generation sources and prompts remain in ../luzhishen-classic-motion-v1/.

Open in-game.html for corrected movement on the game backgrounds. compare.html shows all frame strips and animated loops. Browser checks cover all directions, phases, pause/step, keyboard movement and three locations. Approved on 22 October 2026 and installed unchanged as assets/sprites/luzhishen.png and docs/assets/sprites/luzhishen.png.

Production integration was verified with `tools/test-luzhishen-sprite.js`: root and docs builds load the exact v2 PNG, sample all 16 direction/phase combinations correctly, walk in four keyboard directions, return to neutral when idle, preserve 24 × 32 world size at 8× density and retain the existing battle fallback. Lu Da remains a distinct pre-monastic character. Reports and screenshots are in `output/luzhishen-integration/`.
