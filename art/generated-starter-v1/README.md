# Water Margin starter artwork

Generated with the built-in image generation tool from tile-art-brief.md. This is a partial first-priority source-art set, not the full brief.

## Status

Production update: native-size exports and the game integration are now available in `assets/tiles/`. See `assets/tiles/README.md` for the final coordinates, dimensions and validation. The notes below describe these original source PNGs, which are preserved unchanged.

The generated images are high-resolution source artwork, NOT native 16×16 production sprites. The logical grid, limited palette, exact object dimensions, seamless edges and animation consistency requested in the prompts were not fully satisfied. No runtime files were changed. Pixel cleanup, slicing, palette reduction and in-game validation remain necessary. Shoreline inner corners, reeds and other assets from the full brief are not included.

## Ground index

Intended 8 columns × 4 rows; read left to right, top to bottom. Coordinates below are zero-based logical cells, not pixel offsets in this high-resolution source.

1. (0, 0) Grass 1
2. (1, 0) Grass 2 (dense)
3. (2, 0) Grass 3 (earth patches)
4. (3, 0) Grass 4 (stones)
5. (4, 0) Dark grass 1
6. (5, 0) Dark grass 2
7. (6, 0) Flowers 1
8. (7, 0) Flowers 2
9. (0, 1) Dirt 1
10. (1, 1) Dirt 2
11. (2, 1) Dirt 3
12. (3, 1) Dirt, grass top
13. (4, 1) Dirt, grass bottom
14. (5, 1) Dirt, grass left
15. (6, 1) Dirt, grass right
16. (7, 1) Dirt, grass top-left
17. (0, 2) Dirt, grass top-right
18. (1, 2) Dirt, grass bottom-left
19. (2, 2) Dirt, grass bottom-right
20. (3, 2) Shallow water frame 1
21. (4, 2) Shallow water frame 2
22. (5, 2) Shallow water frame 3
23. (6, 2) Deep water frame 1
24. (7, 2) Deep water frame 2
25. (0, 3) Shore, land top
26. (1, 3) Shore, land bottom
27. (2, 3) Shore, land left
28. (3, 3) Shore, land right
29. (4, 3) Shore, land top-left
30. (5, 3) Shore, land top-right
31. (6, 3) Shore, land bottom-left
32. (7, 3) Shore, land bottom-right

## Trees index

Left to right; transparent source sheet. Intended sizes below have NOT been achieved in the generated PNG.

1. Rounded broadleaf — target 16×28.
2. Irregular broadleaf — target 16×28.
3. Full pine — target 16×38.
4. Slender pine — target 16×38.

## Generation prompts

### Ground

Use case: stylized-concept
Asset type: Water Margin RPG environment ground sprite atlas, first priority from supplied brief.
Create a tightly registered 8-column by 4-row tile sheet, exactly 32 square tiles with NO spacing, borders, labels, text or padding. Target native art 128x64 pixels: each tile is 16x16 actual pixel art; if output must be larger, use uniform integer nearest-neighbor enlargement of that exact low-resolution pixel grid. Strict chunky pixel art, no antialiasing, blur or soft gradients. Top-down three-quarter Playstation-era Suikoden II inspired RPG, Northern Song China circa 1120. Muted warm earthy greens and browns, blue teal water, 8–16 colors per tile. Each cell fills its entire square, terrain edges align for seamless repeated map construction.
Exact row-major order:
row 1: grass variants 1,2,3,4; dark grass variants 1,2; tiny flowers in grass variants 1,2.
row 2: dirt path variants 1,2,3; dirt with grass at TOP boundary; dirt with grass at BOTTOM; dirt with grass at LEFT; dirt with grass at RIGHT; dirt with grass at TOP LEFT corner.
row 3: dirt with grass TOP RIGHT corner; BOTTOM LEFT corner; BOTTOM RIGHT corner; shallow water animation frames 1,2,3 (same base water with only subtle ripple movement); deep water animation frames 1,2.
row 4: shoreline with grass on TOP and water below; grass BOTTOM water above; grass LEFT water right; grass RIGHT water left; grass TOP LEFT corner water remainder; grass TOP RIGHT corner; grass BOTTOM LEFT corner; grass BOTTOM RIGHT corner.
Ground tiles completely opaque, actual transparent background only outside content if any. Draw all 32 cells evenly with exact consistent square cell boundaries but no visible grid lines. This is a usable sprite atlas, not an illustrated scene or presentation.

### Trees

Use case: stylized-concept
Asset type: transparent tree sprite sheet for Water Margin, a Northern Song China circa 1120 pixel-art RPG.
Create exactly FOUR individual tree sprites in a single horizontal row on genuinely transparent background. Order left to right: rounded broadleaf tree, irregular broadleaf tree, full dark green pine, slender dark green pine. Three-quarter top-down view showing tops and fronts, Suikoden II / Playstation-era pixel art, muted warm earthy palette, spring/summer greens, brown trunks, roughly 8–16 colors per sprite. Hard pixel edges ONLY, no smoothing, blur, antialiasing, painted textures.
Exact target logical canvas 64x48 pixels, four adjacent 16x48 slots with no extra padding. All trees bottom-aligned at logical y=47. Broadleaf sprites each exactly 16x28 logical pixels (y20–47); pine sprites each exactly 16x38 logical pixels (y10–47). Bottom 16 pixels are the footprint/trunk zone. Keep each tree wholly within its own slot with NO overlap into other slots. Canopy silhouette must remain readable at native 16px width, use intentionally very simple chunky pixel clusters. If larger resolution is needed, represent ONLY this exact 64x48 logical grid via nearest-neighbor integer enlargement. No ground, no pedestal, no text, no labels, no grid lines, no decorative framing. Transparency between branches and around trunks. This is an asset sheet not a scene.

