// Maps for chapter 12: the Zhu Family Village under Dulong Ridge — Song Jiang's camp, the maze of winding paths
// (盤陀路) whose true turns are marked by white poplars, old Zhongli's cottage, the moated Zhu manor, the Hu manor —
// and Dengzhou, where the Xie brothers hunt their tiger and Gu Dasao keeps her tavern.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- the Zhu Family Village ----------------
  var z = L.grid(60, 50, 'b');
  z.scatter('T', 0.35, 461, 'b');
  // Song Jiang's camp at the south
  z.rect(0, 42, 60, 8, '.'); z.rect(0, 45, 60, 2, ':');
  [[8, 43], [14, 43], [40, 43], [46, 43], [52, 43], [8, 48], [46, 48]].forEach(function (p) { z.set(p[0], p[1], 'V'); });
  z.set(26, 43, 'Y'); z.set(34, 43, 'Y'); z.set(29, 48, 'V'); z.set(31, 48, 'V');
  // the maze: one true road, four false ones
  var brush = function (x, y) { z.rect(x, y, 2, 2, ':'); };
  var line = function (a, b) { var n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) brush(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); };
  var road = [[30, 44], [30, 38], [18, 38], [18, 31], [36, 31], [36, 24], [24, 24], [24, 18], [30, 18], [30, 14]];
  for (var i = 0; i < road.length - 1; i++) line(road[i], road[i + 1]);
  var dead = { d1: [[30, 38], [46, 38], [46, 34]], d2: [[18, 31], [18, 25], [12, 25]], d3: [[36, 24], [50, 24], [50, 30]], d4: [[24, 18], [6, 18], [6, 23]] };
  for (var k in dead) for (i = 0; i < dead[k].length - 1; i++) line(dead[k][i], dead[k][i + 1]);
  // white poplars stand at the roadside where the true road turns
  [[27, 37], [19, 30], [33, 30], [37, 23], [25, 23], [27, 17], [31, 16]].forEach(function (p) { z.set(p[0], p[1], 'H'); });
  // old Zhongli's cottage, by the road
  z.rect(6, 32, 10, 6, '.'); var zhongli = z.house(7, 32, 6, 4, { roof: 'z', door: 3, windows: [1] }); line([10, 36], [17, 36]);
  z.set(14, 33, 'p');
  // the moated manor at the north, on the ridge
  z.rect(12, 0, 38, 14, '.');
  for (var xx = 14; xx < 48; xx++) { z.set(xx, 1, '~'); z.set(xx, 12, '~'); } for (var yy = 1; yy < 13; yy++) { z.set(14, yy, '~'); z.set(47, yy, '~'); }
  z.frame(16, 2, 30, 10, '#'); z.rect(30, 11, 2, 1, 'G'); z.rect(30, 12, 2, 2, 'B');
  var hall = z.house(22, 3, 18, 6, { roof: 'Z', wall: 'R', door: 9 }); z.set(21, 8, 'L'); z.set(40, 8, 'L');
  z.house(17, 3, 4, 4, { roof: '^', door: false, wallRows: 1 }); z.house(41, 3, 4, 4, { roof: '^', door: false, wallRows: 1 });
  z.rect(30, 9, 2, 2, ':'); z.set(18, 9, 'Y'); z.set(43, 9, 'Y');
  // the Hu manor to the west
  z.rect(0, 2, 11, 9, '.'); z.frame(1, 3, 9, 7, 'F'); var hu = z.house(2, 4, 7, 4, { roof: '^', door: 3, windows: [1, 5] }); z.set(5, 9, '.');
  z.scatter('T', 0.06, 462, '.', [12, 0, 38, 14]);
  WM.defMap('zhujia', { name: 'Zhu Family Village', theme: 'autumn', music: 'tense', rows: z.rows(), spawn: [30, 46], battleBg: 'forest',
    exits: [WM.toWorld('zhujia', 0, 45, 1, 2)] });
  WM.data.zhujia = { road: road, dead: dead, doors: { hall: hall, zhongli: zhongli, hu: hu } };
  var zi = L.grid(40, 12, 'x');
  var zR = { hall: zi.room(1, 1, 18, 10, { floor: 'K' }), prison: zi.room(20, 1, 12, 9, { floor: 'N' }), cottage: zi.room(33, 1, 6, 6) };
  zi.stamp(2, 3, ['h...UU....UU...h', '....AA....AA....', '..t..........t..', '..t..........t..', '................']);
  zi.stamp(21, 3, ['F.FF.FF.FF', 'F..F..F..F', 'FF.FF.FF.F']);
  zi.stamp(34, 3, ['k..', '.t.']);
  WM.defMap('zhujia_in', { name: '', interior: true, theme: 'autumn', music: 'tense', rows: zi.rows(), spawn: [10, 9] });
  L.link({ map: 'zhujia', x: hall.x, y: hall.y }, { map: 'zhujia_in', x: zR.hall.x, y: zR.hall.y });
  L.link({ map: 'zhujia', x: zhongli.x, y: zhongli.y }, { map: 'zhujia_in', x: zR.cottage.x, y: zR.cottage.y });
  WM.data.zhujia.rooms = zR;

  // ---------------- Dengzhou ----------------
  var d = L.grid(48, 36, '.');
  d.rect(0, 0, 48, 11, 'P'); d.scatter('m', 0.08, 471, 'P', [0, 0, 48, 11]);
  d.rect(4, 2, 14, 6, '.'); d.vline(16, 8, 10, ':'); d.vline(17, 8, 10, ':');                 // the hunters' clearing on the hill
  d.set(6, 3, 'V'); d.set(13, 3, 'V');                                                         // their crossbow blinds
  d.frame(2, 11, 14, 9, 'F'); d.rect(3, 12, 12, 7, 'f'); var mao = d.house(4, 12, 8, 4, { roof: '^', door: 4, windows: [1, 6] });   // Squire Mao's manor and garden
  d.set(8, 19, ':'); d.set(9, 19, ':');
  d.frame(18, 12, 20, 22, '#'); d.rect(37, 20, 1, 3, 'G'); d.rect(27, 33, 3, 1, 'G');
  d.rect(19, 20, 18, 2, '='); d.rect(27, 13, 3, 20, '=');
  var yamen = d.house(19, 13, 8, 5, { roof: 'Z', wall: 'R', door: 4 });
  var jail = d.house(30, 13, 7, 5, { roof: 'v', wall: '#', door: 3 });
  d.house(19, 24, 6, 4, { roof: 'z', door: false, windows: [2] }); d.house(31, 25, 5, 4, { roof: 'z', door: false, windows: [2] });
  var gdt = d.house(40, 18, 7, 4, { roof: 'z', door: 3, windows: [1, 5] }); d.set(39, 19, 'Y');   // Gu Dasao's tavern, outside the east gate
  d.rect(38, 20, 10, 3, ':'); d.vline(43, 21, 22, ':');
  d.hline(0, 26, 20, ':'); d.hline(0, 26, 21, ':'); d.vline(9, 19, 21, ':'); d.vline(8, 19, 21, ':');
  [yamen, jail].forEach(function (h) { d.vline(h.x, h.y + 1, 19, '='); });
  d.scatter('T', 0.06, 472, '.', [0, 22, 18, 14]); L.clearAround(d, ':', 'T', '.');
  WM.defMap('dengzhou', { name: 'Dengzhou', theme: 'autumn', music: 'town', rows: d.rows(), spawn: [1, 20], battleBg: 'town',
    exits: [WM.toWorld('dengzhou', 0, 20, 1, 2)] });
  var di = L.grid(40, 11, 'x');
  var dR = { mao: di.room(1, 1, 12, 8, { floor: 'K' }), jail: di.room(14, 1, 12, 9, { floor: 'N' }), tavern: di.room(27, 1, 10, 8) };
  di.stamp(2, 3, ['h..A...h..', '.t....t...', '..........']);
  di.stamp(15, 3, ['F.FF.FF.FF', 'F..F..F..F', '..........', 'h........h']);
  di.stamp(28, 3, ['h..j..k.', '.t..t...', '........', 'ccc.....']);
  WM.defMap('dengzhou_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: di.rows(), spawn: [31, 7] });
  [[mao, dR.mao], [jail, dR.jail], [gdt, dR.tavern]].forEach(function (p) { L.link({ map: 'dengzhou', x: p[0].x, y: p[0].y }, { map: 'dengzhou_in', x: p[1].x, y: p[1].y }); });
  WM.data.dengzhou = { doors: { mao: mao, jail: jail, tavern: gdt, yamen: yamen }, rooms: dR };
})();
