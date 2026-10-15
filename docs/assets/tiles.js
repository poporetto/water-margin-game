// Drawn art for the map tiles (see art/tile-art-brief.md for what is wanted).
// Any tile listed here is drawn from its sheet; anything not listed is still drawn by the code (js/core/tiles.js),
// so art can be added a batch at a time. A sheet that fails to load just leaves those tiles to the code.
//
// sheets: a name for each PNG in assets/tiles/ (16x16 cells, no padding). Entries use sheet 'tiles' unless they say otherwise.
// tiles:  keyed by the map character (see T.DEF in js/core/tiles.js), or 'char@theme' for one season or setting
//         (spring, summer, autumn, snow, dusk, marsh, south, north, world), which wins over the plain one.
//   Cells are [column, row] on the sheet, counted from 0.
//   { ground: [c, r] }                      the tile's ground; or a list of cells, one chosen by place, for variants
//   { frames: [[c, r], ...], fps: 3 }       an animated ground (water): the frames in order
//   { auto: { same: '~w', cells: { 0: [c, r], 1: ..., 15: ... } } }
//                                           a piece chosen by which neighbours are the same kind (shorelines, roads,
//                                           fences): add N=1, E=2, S=4, W=8 for each matching neighbour; any number
//                                           left out falls back to 'ground' (if given) or to the code
//   { tall: { at: [c, r], w: 16, h: 38 } }  a tall object (tree, banner, statue), bottom-aligned on its tile and
//                                           centred across it; 'at' may be a list of variants; dx/dy nudge it
//   { tall: { run: [[c, r], [c, r], [c, r]], h: 43 } }
//                                           a figure several tiles wide (the great Buddha, the sampan): each tile in a
//                                           row of the same character takes the next 16 px slice, left to right
//   An entry can have both a ground and a tall part (a tree on grass).
//
// Example, once assets/tiles/ground.png and assets/tiles/trees.png exist:
//   sheets: { tiles: 'assets/tiles/ground.png', trees: 'assets/tiles/trees.png' },
//   tiles: {
//     '.': { ground: [[0, 0], [1, 0], [2, 0], [3, 0]] },          // grass, four variants
//     '.@autumn': { ground: [[0, 1], [1, 1]] },
//     '~': { frames: [[0, 2], [1, 2], [2, 2]], fps: 3 },          // water
//     'T': { sheet: 'trees', tall: { at: [[0, 0], [1, 0]], w: 16, h: 28 } }
//   }
//
// In the browser console, WM.tiles.reloadArt() reloads this list's sheets and WM.tiles.artStatus() says what loaded.
WM.TILE_ART = {
  size: 16,
  sheets: {},
  tiles: {}
};
