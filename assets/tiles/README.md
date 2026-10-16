> The active game now uses the [32-pixel exports](32/README.md). The specifications below describe the preserved 16-pixel pack.

# Water Margin — production starter tiles

The exterior building batch is now available and integrated too; see `BUILDINGS.md` for Song-era roofs, walls, doors, fences, paving, wells and city gates. The scope below describes the original ground-and-trees batch.

This first-priority set is integrated into spring and summer field maps. It covers grass, dark grass, flowers, dirt roads, shallow/deep water, shoreline corners, two broadleaf trees and two pines. Buildings, interiors, additional nature, seasonal sprite sets and the silk world map are outside this batch; the existing renderer still supplies them.

## Files

| Sheet | PNG dimensions | Contents |
|---|---|---|
| ground.png | 128 × 64 | 32 cells, 16 × 16 px each |
| water.png | 128 × 288 | 47 shoreline shapes × 3 frames |
| deep-water.png | 128 × 288 | 47 shoreline shapes × 3 frames |
| trees.png | 64 × 48 | Four objects at grid-aligned origins |

All art is rendered at native resolution with nearest-neighbour display scaling. Ground tiles use at most 16 colours per cell. Tree pixels use a shared 15-colour palette and binary alpha (0 or 255); no blurred or partially transparent edges. Source artwork and the original generation prompts remain in `art/generated-starter-v1/`.

## Ground cell index

Read left to right, top to bottom; index numbers are one-based, coordinates in `starter-index.json` are zero-based.

1. Grass 1
2. Grass 2
3. Grass 3
4. Grass 4
5. Dark grass 1
6. Dark grass 2
7. Flowers 1
8. Flowers 2
9. Road, connection mask 0
10. Road, connection mask 1
11. Road, connection mask 2
12. Road, connection mask 3
13. Road, connection mask 4
14. Road, connection mask 5
15. Road, connection mask 6
16. Road, connection mask 7
17. Road, connection mask 8
18. Road, connection mask 9
19. Road, connection mask 10
20. Road, connection mask 11
21. Road, connection mask 12
22. Road, connection mask 13
23. Road, connection mask 14
24. Road, connection mask 15 / dirt variant 1
25. Shallow water, frame 1
26. Shallow water, frame 2
27. Shallow water, frame 3
28. Deep water, frame 1
29. Deep water, frame 2
30. Deep water, frame 3
31. Dirt variant 2
32. Dirt variant 3

Road connection bits: north=1, east=2, south=4, west=8. A missing connection draws the grassy edge on that side. Interior dirt cells choose between three variants deterministically.

## Water cell index

Each frame occupies six rows of eight cells. Cells 1–47 correspond in order to `canonicalWaterMasks` in the JSON index. Cell 48 is unused. Frame 2 begins at row 6 and frame 3 at row 12. `waterCells` maps every 8-neighbour mask (0–255) to its frame-1 cell. Add `waterFrameOffsets` to select an animation frame.

Cardinal water-connection bits are N=1, E=2, S=4, W=8; diagonal bits are NE=16, SE=32, SW=64, NW=128. A diagonal matters only if both adjacent cardinal neighbours are water. All frames run synchronously at 3 fps so neighbouring tiles keep matching borders. Shallow-to-deep boundaries intentionally change colour; the exact seam test covers joins within each water depth.

## Tree cell index

1. Rounded broadleaf: cell (0,0), source rectangle 16 × 28.
2. Irregular broadleaf: cell (1,0), source rectangle 16 × 28.
3. Full pine: cell (2,0), source rectangle 16 × 38.
4. Slender pine: cell (3,0), source rectangle 16 × 38.

Objects are stored at the top of their slots, with unused space transparent. Draw at `(tileX, tileY + 16 - objectHeight)`; the object’s bottom aligns with the bottom of its ground tile. The runtime manifest already sets these sizes and draws grass beneath the trees.

## Integration and verification

`assets/tiles.js` registers the sheets and map characters. `js/core/tiles.js` supports diagonal masks, animation frame offsets and separate ground/object sheets. The local `docs/` publishing copy includes the same runtime files and assets; nothing has been published remotely.

Preview: serve the repository and open `/tools/starter-tiles.html`. Play at `/index.html` or `/docs/index.html`.

Rebuild with `node tools/build-starter-tiles.js` (requires `sharp`). Asset checks: `node tools/test-starter-tiles.js`. Browser checks: `node tools/test-starter-browser.js` (requires Playwright, a Chromium installation, and the local server on port 8765). Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if using an existing Chromium executable.

Validation covers PNG dimensions, binary alpha, palette limits, grass-variant seams, 12,288 shoreline neighbour/frame cases, tree bounds and bottom alignment, sheet loading and animation. Browser checks cover desktop/mobile preview, seasonal fallback, game boot, keyboard movement, collision flags, the docs build, missing assets and JavaScript errors. Screenshots and the browser result are under `output/tiles/`.
