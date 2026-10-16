# 32-pixel game artwork

The active game uses 32 × 32 physical pixels per map tile. Logical movement remains 16 units per tile, so maps, collision, camera coverage and saved positions retain their existing dimensions. The world buffer is 640 × 480 pixels.

Terrain, water, trees and Northern Song buildings are re-exported from the original high-resolution artwork with hard alpha and limited palettes. They are not nearest-neighbour enlargements of the old PNGs. Song-era roof shapes, timber construction and clothing remain in place.

Characters and creatures are generated at twice their previous pixel resolution with contour refinement and material-edge shading. This is a procedural enhancement, not a complete hand-redrawn character collection. Characters have 32 × 48 bodies in padded 48 × 64 frames; generated walking sheets are 144 × 256 (3 columns × 4 directions). Creature sizes vary by species. Portraits retain their separate existing resolution.

## Exported sheets

- Ground: 256 × 128; 32 cells.
- Water and deep water: 256 × 576 each; 47 shoreline shapes × 3 frames.
- Trees: 128 × 96; broadleaf sprites 32 × 56, pine sprites 32 × 76.
- Building roofs: 384 × 192; four roof styles and 12-pixel eave overhangs.
- Building walls: 256 × 128; 32 wall and fixture cells.
- Building gate: 128 × 192; open and closed 128 × 90 sprites. Closed origin y=96.

JSON indexes describe physical sizes. Runtime tile configuration retains logical coordinates; the renderer converts source coordinates using artScale=2. All generated pixel art uses nearest-neighbour display. Old 16-pixel sheets remain available in the parent folder.

Regenerate using `node tools/build-starter-tiles.js --32` and `node tools/build-building-tiles.js --32` (requires sharp). Validate with `tools/test-32px.js` plus the tile and browser tests.

## Additional objects and facade corrections

48 new transparent object PNGs are in `objects/`, with physical dimensions and source bounds in `objects-index.json`. `objects.png` is a combined 32px-grid atlas with padded slots. Runtime source positions are logical half-resolution coordinates.

Closed house doors are now 32 × 48 px (75% of the previous 64px rendered height), anchored to the original threshold. The D tile still triggers normal entry; d stays blocked. Left/right plaster wall pieces have transparent 8px outer strips below the projecting beam. Compact roofs use only the ridge and eave, omitting repeated middle rows.

The game uses the new nature, town, furniture and temple objects in compatible field themes. Snow and autumn foliage retain seasonal artwork; world-map symbols retain the silk-map style. The felled-willow story state retains its fallen-tree rendering. The plain willow, yellow banner, cliff samples and standalone dais are also supplied as exported variants; existing connected cliff/dais rendering remains in use.

Preview: `tools/remaining-tiles.html`. Rebuild: `node tools/build-remaining-tiles.js`.

### Front-facing revision

The active objects now use `objects-front-source.png`, generated with the built-in image tool. Front edges are horizontal and furniture faces the viewer. Exports preserve source aspect ratios inside bottom-aligned transparent envelopes; they no longer stretch to fill those envelopes. Updated physical sizes are authoritative in objects-index.json. Wide market stalls occupy two adjacent stall cells where available. Removed upper roof rows are walkable only when the compact roof artwork is active; seasonal fallback roofs remain solid.

### Multi-tile prop footprints

Tables, counters, shelves, incense altars, market stalls, graves and rowboats use 2×1 ground cells; beds use 2×2, tents 3×2. Rendering and collision share a single placement record. Tall artwork above the ground footprint does not block extra rows. Adjacent authored markers covered by one placement render only once.

Placement protects event approaches, map-entry positions, roads, entrances, other objects and connected walking routes. In cramped legacy layouts, an object stays compact rather than claiming inaccessible ground. The current static map audit is in output/props/layout-audit.json. Character-scale and boundary preview: tools/prop-footprints.html.

### Surface batch

16 new 32×32 textures: sand (2), millet crops (2), scorched earth (2), stone steps, horizontal bridge planks, timber floors (3), red carpet, flagstone floors (2), vertical bridge planks and an interior wall face. See surfaces-index.json and surfaces/. Floors beneath furniture use the same materials. Compatible variants share opposite borders and matched brightness. Wide bridge rails render only on outside edges; bridge movement remains passable. The new `!` tile supplies walkable scorched ground for map authors without replacing existing black map boundaries.

Preview: tools/surface-tiles.html. Rebuild: tools/build-surface-tiles.js. Checks: tools/test-surface-tiles.js.

Seasonal additions: seasonal-nature.png (24 transparent sprites), seasonal-ground.png (12 textures), cliff-faces.png (3 connected face textures), world-icons.png (16 silk-map symbols). JSON indices and individual PNGs accompany the atlases. See art/TILE-PROGRESS.md for active assets and remaining procedural categories.
