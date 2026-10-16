# Remaining tile brief — production assets

Generated with the built-in image-generation tool, then normalized with tools/build-part2-tiles.js. Original source sheets and exact prompts are retained here. This exporter creates 24 native-resolution atlases. All textures use hard alpha; individual source components are reduced to 16 colours, while composed shoreline tiles can combine ground and water palettes.

## Coverage

| Brief items | Deliverable |
|---|---|
| 1–6 marsh, south and dusk | regional-marsh/south/dusk: four grass, two dark grass, two flower choices, 47 road shapes and three road variants; regional-trees: two broadleaf and two pine variants per region |
| 7–8 autumn | regional-autumn: connected leaf-strewn paths and two harvest field variants |
| 9–14 snow | regional-snow paths and paving; part2-extra snow wall/end/cap pieces, reeds and rowboat; part2-objects lantern |
| 15–18 seasonal water | marsh, south, autumn and snow shallow/deep sheets; canonical 47 shapes, three animation frames. Extra dusk pair included |
| 19–20 gates | gate-snow and gate-autumn: open at pixel y=0, closed at y=96; each sprite 128×90 |
| 21–23 interiors | part2-objects: seven two-row wall pieces including scroll and corners, inside doorway, five dais pieces |
| 24–26 world map | river and sea sheets: 47 shapes, two frames; ink reeds in part2-extra |
| 27 vegetable plots | vegetables: 47 connecting shapes, two variants; use map character % |
| 28–30 prisons | part2-objects: seven grille pieces, locked cell door, 64×36 straw pallet |

## Coordinates and sizing

`assets/tiles/32/part2-index.json` is the numbered machine-readable catalogue. `assets/tiles/32/PART2-TILE-LIST.md` is the readable coordinate list. Coordinates count 32×32 cells from zero. Tall pieces start at the listed cell and are bottom-aligned by the game. Transparent unused cells separate oversized sprites; there are no gutters between grid cells. Tree sprites occupy 32×56 or 32×76 envelopes. Rowboats are 64×40, retaining the previously requested two-tile proportion rather than reducing them to the brief's one-tile size.

Water uses eight columns and six rows per frame. Frames start at rows 0, 6 and 12 (world water only 0 and 6). The 48th cell in each block is unused. The canonical mask order matches the starter water sheets. Vegetable variants use the same blocks at rows 0 and 6.

## Runtime notes

Regional assets are active via assets/tiles.js. Interior walls, exit doorways, prison bars/pallets, winter walls and connected vegetable plots are integrated in js/core/tiles.js. The front-facing dais renderer uses the front tile and straight timber sides; additional corner alternatives remain available in the atlas. Interior corner alternatives are supplied for map-editor use; existing rectangular room maps use straight wall/end pieces.

Vegetable tiles are available as `%`; existing crop fields retain their authored crop type. This delivery does not replace arbitrary crop fields with vegetables.

## Building corrections carried forward

Winter roof joins are matched while preserving the original ridge and eave geometry. Windows fit inside a timber panel without crossing the beam. Exterior door centering is applied after map registration by js/data/centered-doors.js: 225 doors are centered, including closed decorative doors. 129 entrance links and incoming return coordinates are updated. Old arrival coordinates have a migration lookup. Adjacent buildings are separated by roof style before centering. Existing interior room doors and world-map markers keep their authored positions.

## Verification

- tools/test-part2-tiles.js: atlas dimensions, binary alpha, 69,632 shoreline/frame seam cases, eleven browser scenes and mobile fit.
- tools/test-centered-doors.js: all door cells, widened entrance triggers, approach cells and coordinate migration.
- tools/test-part2-browser.js: live entry and return through a moved door in game and docs; winter roof/window preview and gate states.
- tools/test-building-tiles.js, tools/test-world-footprints.js and tools/validate.js.

Previews: tools/part2-tiles.html and tools/building-tiles.html?theme=snow.
