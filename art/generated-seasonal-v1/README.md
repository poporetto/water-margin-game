# Seasonal nature — 32px production export

Generated with the built-in image generator. Exact prompts are saved beside the source PNGs.

Run `NODE_PATH=<directory containing sharp> node tools/build-seasonal-tiles.js` from the project root.

- 24 transparent nature sprites: green, autumn, snow; seven trees/rocks and one cliff reference per season.
- 12 ground textures: autumn, snow, silk-map ground and an optional road swatch.
- Individual transparent PNGs and atlas coordinates are in `assets/tiles/32/seasonal-nature-index.json`.
- Objects preserve aspect ratio, use bottom anchors and binary alpha. Their dimensions are multiples of the game's physical-to-logical scale (2); they need not fit a single 32px cell.
- Autumn/snow nature and ground are active. Existing green trees remain active; the green exports are optional alternatives.
- Cliff face textures use neighbour-aware perimeter caps and shadows. Their existing solid cells are unchanged.
- The world road swatch is exported for future use; connected roads currently retain their procedural edges and texture.

Preview: `tools/seasonal-tiles.html`. Verification: `tools/test-seasonal-tiles.js`.
