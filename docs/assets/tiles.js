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
//   tall.sheet selects a separate sheet for the object while entry.sheet supplies its ground.
//   auto.diagonal adds NE=16, SE=32, SW=64, NW=128 to the neighbour mask.
//   auto.frames lists cell offsets for animated autotiles; sync aligns neighbouring animation phases.
//
// Example, once assets/tiles/ground.png and assets/tiles/trees.png exist:
//   sheets: { tiles: 'assets/tiles/32/ground.png', trees: 'assets/tiles/32/trees.png' },
//   tiles: {
//     '.': { ground: [[0, 0], [1, 0], [2, 0], [3, 0]] },          // grass, four variants
//     '.@autumn': { ground: [[0, 1], [1, 1]] },
//     '~': { frames: [[0, 2], [1, 2], [2, 2]], fps: 3 },          // water
//     'T': { sheet: 'trees', tall: { at: [[0, 0], [1, 0]], w: 16, h: 28 } }
//   }
//
// In the browser console, WM.tiles.reloadArt() reloads this list's sheets and WM.tiles.artStatus() says what loaded.
WM.TILE_ART = {
  size: 32,
  sheets: { tiles: 'assets/tiles/32/ground.png', trees: 'assets/tiles/32/trees.png', water: 'assets/tiles/32/water.png', deepWater: 'assets/tiles/32/deep-water.png', buildingRoofs: 'assets/tiles/32/building-roofs.png', buildingWalls: 'assets/tiles/32/building-walls.png', buildingGate: 'assets/tiles/32/building-gate.png' },
  tiles: {}
};
(function () {
  var masks = [], cells = {}, roads = {};
  function canonical(m) {
    [[16, 1, 2], [32, 2, 4], [64, 4, 8], [128, 8, 1]].forEach(function (d) { if (!(m & d[1]) || !(m & d[2])) m &= ~d[0]; });
    return m;
  }
  for (var m = 0; m < 256; m++) if (masks.indexOf(canonical(m)) < 0) masks.push(canonical(m));
  for (m = 0; m < 256; m++) { var i = masks.indexOf(canonical(m)); cells[m] = [i % 8, Math.floor(i / 8)]; }
  for (m = 0; m < 16; m++) roads[m] = [m % 8, 1 + Math.floor(m / 8)];
  roads[15] = [[7, 2], [6, 3], [7, 3]];
  var grass = [[0, 0], [1, 0], [2, 0], [3, 0]];
  function water(sheet) { return { sheet: sheet, fps: 3, sync: true, auto: { same: '~wrBo[<>', diagonal: true, cells: cells, frames: [[0, 0], [0, 6], [0, 12]] } }; }
  // A path blends only into natural ground, not into a doorway, bridge or courtyard.
  var roadNeighbours = Object.keys(WM.tiles.DEF).filter(function (ch) { return '.,fTPbHmMlegIyVQ_'.indexOf(ch) < 0; }).join('');
  var entries = {
    '.': { ground: grass }, ',': { ground: [[4, 0], [5, 0]] }, f: { ground: [[6, 0], [7, 0]] },
    ':': { auto: { same: roadNeighbours, cells: roads } },
    '~': water('water'), w: water('deepWater'),
    T: { ground: grass, tall: { sheet: 'trees', at: [[0, 0], [1, 0]], w: 16, h: 28 } },
    P: { ground: grass, tall: { sheet: 'trees', at: [[2, 0], [3, 0]], w: 16, h: 38 } }
  };
  // Other seasons and the silk world map retain their own art direction.
  ['spring', 'summer'].forEach(function (theme) { Object.keys(entries).forEach(function (ch) { WM.TILE_ART.tiles[ch + '@' + theme] = entries[ch]; }); });
})();
(function () {
  var entries = {
    '^': { sheet: 'buildingRoofs', building: 'roof', style: 0 },
    z: { sheet: 'buildingRoofs', building: 'roof', style: 1 },
    v: { sheet: 'buildingRoofs', building: 'roof', style: 2 },
    Z: { sheet: 'buildingRoofs', building: 'roof', style: 3 },
    W: { sheet: 'buildingWalls', building: 'plaster' }, O: { sheet: 'buildingWalls', building: 'window' },
    R: { sheet: 'buildingWalls', building: 'red' }, '#': { sheet: 'buildingWalls', building: 'stone' },
    D: { sheet: 'buildingWalls', building: 'door' }, d: { sheet: 'buildingWalls', building: 'door' },
    F: { sheet: 'buildingWalls', building: 'fence' }, p: { sheet: 'buildingWalls', building: 'well' },
    '=': { sheet: 'buildingWalls', building: 'paving' }, G: { sheet: 'buildingGate', building: 'gate' }
  };
  // Snow keeps its procedural treatment; the silk world map and interior exits are separate styles.
  ['spring', 'summer', 'autumn', 'dusk', 'marsh', 'south', 'north'].forEach(function (theme) {
    Object.keys(entries).forEach(function (ch) { WM.TILE_ART.tiles[ch + '@' + theme] = entries[ch]; });
  });
})();
(function () {
  WM.TILE_ART.sheets.objects = 'assets/tiles/32/objects.png';
  function cell(i) { return [(i % 8) * 4, Math.floor(i / 8) * 5]; }
  function object(i,w,h,base,extra) { return {sheet:'objects',base:base||'grass',object:Object.assign({at:cell(i),w:w||16,h:h||16},extra||{})}; }
  var entries = {
    H:object(1,24,38), l:object(3,48,60), b:object(4,32,64,'grass',{footprint:[2,1]}), e:object(5), m:object(6,16,16,'grass',{variants:[cell(6),cell(7)]}),
    u:object(8,32,32,'grass',{variants:[cell(8),cell(9),cell(10)]}), L:object(11,16,28),
    Y:object(12,32,41), J:object(14,24,38), I:object(15,24,28), Q:object(16,24,31),
    g:object(17,32,20), V:object(18,48,40), o:object(19,32,20,'water'), '[':object(20,64,28,'water'), U:object(21,16,22,'floor'),
    t:object(22,32,28,'floor',{variants:[cell(22),cell(23)]}), c:object(24,32,28,'floor'),
    k:object(25,32,32,'floor',{bed:true}), h:object(26,32,28,'floor',{variants:[cell(26),cell(27)]}),
    j:object(28,16,16,'floor'), A:object(29,32,28,'floor'), '4':object(30,16,16,'floor'), i:object(31,16,39,'floor'),
    '1':object(32,48,43,'floor',{run:true}), '2':object(33,48,23,'floor',{run:true}), '3':object(34,16,16,'floor'),
    '5':object(35,48,42,'floor',{run:true}), '6':object(36,24,48,'floor'), '7':object(37,24,48,'floor'),
    '8':object(38,48,23,'floor',{run:true}), E:object(39,48,34,'floor',{run:true}),
    '0':object(41,16,30,'floor'), a:object(42,48,25,'floor',{run:true}),
    r:object(43,16,16,'water',{variants:[cell(43),cell(44)]})
  };
  // Ground footprints are independent of sprite height (canopies and poles overhang).
  ['u','t','c','h','A','g','o'].forEach(function(ch){entries[ch].object.footprint=[2,1];});
  entries.V.object.footprint=[3,2];
  entries.k.object.footprint=[2,2];
  ['spring','summer','autumn','dusk','marsh','south','north'].forEach(function(theme){
    Object.keys(entries).forEach(function(ch){
      if(theme==='autumn' && 'Hlb'.indexOf(ch)>=0)return;
      WM.TILE_ART.tiles[ch+'@'+theme]=entries[ch];
    });
  });
})();

(function(){
  WM.TILE_ART.sheets.surfaces='assets/tiles/32/surfaces.png';
  ['spring','summer','autumn','dusk','marsh','south','north'].forEach(function(theme){
    WM.TILE_ART.tiles['s@'+theme]={sheet:'surfaces',ground:[[0,0],[1,0]]};
    if(theme!=='autumn')WM.TILE_ART.tiles['y@'+theme]={sheet:'surfaces',ground:[[2,0],[3,0]]};
  });
})();

// Seasonal nature and the separately painted silk map share the 32px grid.
(function(){
  WM.TILE_ART.sheets.cliffFaces='assets/tiles/32/cliff-faces.png';
  WM.TILE_ART.sheets.seasonalNature='assets/tiles/32/seasonal-nature.png';
  WM.TILE_ART.sheets.seasonalGround='assets/tiles/32/seasonal-ground.png';
  WM.TILE_ART.sheets.worldIcons='assets/tiles/32/world-icons.png';
  ['autumn','snow','world'].forEach(function(theme,row){
    WM.TILE_ART.tiles['.@'+theme]={sheet:'seasonalGround',ground:row===2?[[0,row],[1,row],[2,row]]:[[0,row],[1,row]]};
    WM.TILE_ART.tiles[',@'+theme]={sheet:'seasonalGround',ground:[2,row]};
    WM.TILE_ART.tiles['f@'+theme]={sheet:'seasonalGround',ground:[row===2?0:3,row]};
  });
  var chars=['T','P','H','l','b','e','m'],sizes=[[24,32],[24,44],[24,44],[48,60],[32,64],[24,28],[16,16]];
  ['autumn','snow'].forEach(function(theme,row){chars.forEach(function(ch,i){WM.TILE_ART.tiles[ch+'@'+theme]={sheet:'seasonalNature',base:'grass',object:{at:[i*3,(row+1)*4],w:sizes[i][0],h:sizes[i][1],footprint:ch==='b'?[2,1]:undefined}};});});
})();

// Bamboo stands above a person: 3–4 tiles of visible stalks, with a two-cell base.
(function(){
  ['spring','summer','dusk','marsh','south','north'].forEach(function(theme){
    WM.TILE_ART.tiles['b@'+theme]={sheet:'seasonalNature',base:'grass',object:{at:[12,0],w:32,h:64,footprint:[2,1]}};
  });
})();

// Winter houses retain the same architecture, compact roof and doorway geometry.
(function(){
  WM.TILE_ART.sheets.snowRoofs='assets/tiles/32/building-roofs-snow.png';
  ['^','z','v','Z','W','O','R','D','d'].forEach(function(ch){
    var entry=Object.assign({},WM.TILE_ART.tiles[ch+'@spring']);
    if(entry.building==='roof')entry.sheet='snowRoofs';
    WM.TILE_ART.tiles[ch+'@snow']=entry;
  });
})();

// Art that was made but not switched on everywhere it could be.
(function(){
  var A=WM.TILE_ART.tiles, themes=['spring','summer','autumn','dusk','marsh','south','north','snow'];
  // Indoors the season does not show: snow-country interiors use the same furniture as everywhere else.
  't c k h j A 4 i 1 2 3 5 6 7 8 E 0 a U'.split(' ').forEach(function(ch){ if(!A[ch+'@snow'])A[ch+'@snow']=A[ch+'@spring']; });
  // The lantern too, but only indoors: outdoors in snow it waits for a snowy version.
  A['L@snow']=Object.assign({},A['L@spring'],{indoors:true});
  // A well that stands inside an interior map. (Indoors a fence is a prison cell's bars, drawn by the code until there
  // is art for them; red walls indoors keep the plain lacquer the code draws, as the outdoor wall art shows the ground
  // through its edges.)
  ['p'].forEach(function(ch){ themes.forEach(function(th){ if(A[ch+'@'+th])A[ch+'@'+th]=Object.assign({},A[ch+'@'+th],{inside:true}); }); });
  // (the world map's roads take the silk road texture in js/core/tiles.js, so they keep their ink edges)
})();
