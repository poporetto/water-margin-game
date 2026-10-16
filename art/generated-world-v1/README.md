# Silk-map icons

Sixteen transparent Northern Song-inspired symbols, generated with the built-in image generator; exact prompt saved in icons-prompt.txt.

Thirteen destination types replace existing map markers. Two peak variations and woodland are used for world terrain. Source art is fitted without stretching to 96×64 export envelopes and quantized to sixteen colours with hard alpha.

The renderer preserves world.js visibility conditions, entrance coordinates, road approaches and collision cells. Symbols are drawn only over the cells already reserved for that destination. Map ground uses the seasonal-ground silk textures.

Index and individual PNGs: `assets/tiles/32/world-icons-index.json`. Rebuild with `tools/build-seasonal-tiles.js`.

## Multi-tile terrain placement

World mountains and woodland now share a layout between rendering and collision. Dense terrain merges into 3×2 groups where possible; isolated features can occupy 3×2 cells of safe ground. Smaller footprints are used near obstacles. Expansion excludes roads, water, destination symbols, exit approaches, events and the arrival point, and checks that local walking routes remain connected. Bamboo uses the same silk-map woodland treatment.

Destination entrances retain their original coordinates. World maps rebake after the arrival point is assigned so artwork and collision use identical placements, including when returning to a cached map.

Preview: tools/world-footprints.html (gold rectangles show blocked footprints).
Tests: tools/test-world-footprints.js and tools/test-seasonal-tiles.js.

Forest proportion revision: woodland terrain now uses the dense forest illustration (icon 9), replacing the small scattered trees and removing their stray blue marks. Forest groups prefer a 4×3 footprint, with smaller route-safe placements when constrained. Mountains retain their 3×2 preference. Sprite aspect ratio is preserved; the shared occupied-cell layout controls collision.
