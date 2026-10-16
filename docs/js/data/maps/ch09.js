// Maps for chapter 9: Jieling Ridge, Jieyang town and the Xunyang River, Jiangzhou,
// the White Dragon Temple, and Wuweijun.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- Jieling Ridge (Li Li's inn) ----------------
  var j = L.grid(28, 20, 'P');
  j.rect(0, 8, 28, 4, '.'); j.hline(0, 27, 9, ':'); j.hline(0, 27, 10, ':');
  j.rect(9, 3, 10, 5, '.');
  var inn = j.house(10, 3, 8, 4, { roof: 'z', door: 4, windows: [1, 6] }); j.set(18, 4, 'J'); j.vline(14, 7, 8, ':');
  j.scatter('m', 0.04, 331, '.'); L.clearAround(j, ':', 'Pm', '.');
  WM.defMap('jieling', { name: 'Jieling Ridge', theme: 'south', music: 'tense', rows: j.rows(), spawn: [1, 9], battleBg: 'forest', exits: [WM.toWorld('jieling', 0, 8, 1, 4), WM.toWorld('jieling', 27, 8, 1, 4)] });
  var ji = L.grid(12, 8, 'x'); var jR = ji.room(1, 1, 10, 7);
  ji.stamp(2, 3, ['h..j..kk', '.t..t...', 'cc......']);
  WM.defMap('jieling_in', { name: 'Li Li\'s Inn', interior: true, theme: 'south', music: 'tense', rows: ji.rows(), spawn: [6, 6] });
  L.link({ map: 'jieling', x: inn.x, y: inn.y }, { map: 'jieling_in', x: jR.x, y: jR.y });

  // ---------------- Jieyang town and the river ----------------
  var y = L.grid(44, 30, '.');
  for (var yy = 22; yy < 30; yy++) for (var xx = 0; xx < 44; xx++) y.set(xx, yy, yy < 24 ? '~' : 'w');
  y.scatter('r', 0.2, 341, '~', [0, 22, 44, 2]);
  y.rect(0, 8, 44, 2, ':'); y.rect(20, 0, 3, 22, ':');
  y.rect(14, 10, 14, 5, '=');                                        // the market square where Xue Yong performs
  var mu = y.house(30, 2, 12, 5, { roof: '^', door: 6, windows: [2, 9] });   // the Mu family manor
  y.frame(29, 1, 14, 8, 'F'); y.set(36, 8, ':');
  var yinn = y.house(3, 2, 9, 5, { roof: 'z', door: 4, windows: [1, 7] });
  y.house(3, 12, 6, 4, { roof: 'z', door: false, windows: [2] }); y.house(32, 12, 6, 4, { roof: '^', door: false, windows: [3] });
  y.rect(18, 15, 6, 7, ':'); y.rect(19, 22, 4, 2, 'B'); y.set(17, 23, 'o'); y.set(24, 23, 'o'); y.set(26, 22, 'o');
  y.scatter('b', 0.06, 342, '.', [0, 0, 44, 22]); y.scatter('T', 0.05, 343, '.', [0, 0, 44, 22]);
  L.clearAround(y, ':', 'Tb', '.'); L.clearAround(y, '=', 'Tb', '.');
  WM.defMap('jieyang', { name: 'Jieyang Town', theme: 'south', music: 'town', rows: y.rows(), spawn: [1, 8], battleBg: 'river', exits: [WM.toWorld('jieyang', 0, 8, 1, 2)] });
  var yi = L.grid(30, 10, 'x'); var yR = { mu: yi.room(1, 1, 14, 9, { floor: 'K' }), inn: yi.room(16, 1, 12, 8) };
  yi.stamp(2, 3, ['h..A.....A.h', '............', '..t..KKK....', 'k..........k']); yi.stamp(17, 3, ['.....kk.kk', '.....kk.kk', 'ccc.......']);
  WM.defMap('jieyang_in', { name: '', interior: true, theme: 'south', music: 'town', rows: yi.rows(), spawn: [8, 8] });
  L.link({ map: 'jieyang', x: mu.x, y: mu.y }, { map: 'jieyang_in', x: yR.mu.x, y: yR.mu.y });
  L.link({ map: 'jieyang', x: yinn.x, y: yinn.y }, { map: 'jieyang_in', x: yR.inn.x, y: yR.inn.y });
  WM.defEvents('jieyang_in', [L.inn('jyinn', 18, 4, 20), L.save('jyrec', 25, 6)]);

  // ---------------- Jiangzhou ----------------
  var g = L.grid(56, 44, '.');
  g.border('#', 2, [{ side: 'n', from: 26, to: 29 }]);
  g.rect(26, 0, 4, 2, 'G');
  for (yy = 36; yy < 44; yy++) for (xx = 0; xx < 56; xx++) g.set(xx, yy, yy < 38 ? '~' : 'w');   // the Xunyang River (Yangtze) to the south
  g.hline(0, 55, 35, 's'); g.hline(0, 55, 34, '#'); g.rect(26, 34, 4, 1, 'G');
  g.rect(26, 2, 4, 32, '='); g.rect(2, 18, 52, 3, '=');
  var prefect = g.house(4, 4, 14, 6, { roof: 'Z', wall: 'R', door: 7 }); g.set(3, 9, 'L'); g.set(18, 9, 'L');
  var prison = g.house(32, 4, 11, 6, { roof: 'v', wall: '#', door: 5 });
  var daizong = g.house(12, 12, 8, 4, { roof: '^', door: 4, windows: [1, 6] });
  var tower = g.house(44, 3, 10, 8, { roof: 'v', door: 5, windows: [1, 8], windowsUpper: [2, 7] });   // Xunyang Tower
  g.set(43, 8, 'L');
  var pipa = g.house(44, 24, 8, 4, { roof: 'v', wall: 'R', door: 4 });                                   // Pipa pavilion
  var shop = g.house(32, 24, 6, 4, { roof: 'z', door: 3, windows: [1] });
  var jinn = g.house(4, 24, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  g.rect(14, 26, 8, 6, '=');                                                                            // execution ground
  g.set(14, 26, 'Y'); g.set(21, 26, 'Y');
  [prefect, prison, tower, daizong].forEach(function (d) { g.vline(d.x, d.y + 1, 17, ':'); });
  [pipa, shop, jinn].forEach(function (d) { g.vline(d.x, d.y + 1, 32, ':'); }); g.hline(2, 53, 32, ':'); g.vline(27, 32, 33, ':');
  g.scatter('T', 0.05, 351, '.', [2, 2, 52, 30]); g.scatter('b', 0.03, 352, '.', [2, 2, 52, 30]);
  L.clearAround(g, ':', 'Tb', '.'); L.clearAround(g, '=', 'Tb', '.');
  WM.defMap('jiangzhou', { name: 'Jiangzhou', theme: 'south', music: 'town', rows: g.rows(), spawn: [27, 3], battleBg: 'town',
    exits: [WM.toWorld('jiangzhou', 26, 0, 4, 1)] });
  var gi = L.grid(70, 12, 'x');
  var gR = { prefect: gi.room(1, 1, 16, 10, { floor: 'K' }), prison: gi.room(18, 1, 14, 9, { floor: 'N' }), daizong: gi.room(33, 1, 9, 7), tower: gi.room(43, 1, 14, 10), shop: gi.room(58, 1, 8, 7) };
  gi.stamp(2, 3, ['h.EEEEEE..h...', '...q00q.......', '..taaaa...t...', '..t.......t...']);   // the prefect's hall
  gi.stamp(19, 3, ['-..F-..F-..F', '...F...F...F', 'F+FFF+FFF+FF']);
  gi.stamp(34, 3, ['k...h..', '.......', '..t....']);
  gi.stamp(44, 3, ['h..L.....L..', '.t..t..t..t.', '............', '.t..t..t....', 'cccc........']);
  gi.stamp(59, 3, ['hhhh..', '......', 'ccc...']);
  WM.defMap('jiangzhou_in', { name: '', interior: true, theme: 'south', music: 'town', rows: gi.rows(), spawn: [8, 9] });
  [[prefect, gR.prefect], [prison, gR.prison], [daizong, gR.daizong], [tower, gR.tower], [shop, gR.shop]].forEach(function (p) { L.link({ map: 'jiangzhou', x: p[0].x, y: p[0].y }, { map: 'jiangzhou_in', x: p[1].x, y: p[1].y }); });
  WM.data.jiangzhou = { rooms: gR, doors: { prefect: prefect, prison: prison, daizong: daizong, tower: tower, pipa: pipa, shop: shop, inn: jinn } };
  WM.defEvents('jiangzhou_in', [L.shop('jzshop', 61, 4, 'jiangzhou', 'shopkeep', 'Fine goods from the river trade.')]);

  // ---------------- White Dragon Temple ----------------
  var w = L.grid(30, 22, '.');
  for (yy = 14; yy < 22; yy++) for (xx = 0; xx < 30; xx++) w.set(xx, yy, yy < 16 ? '~' : 'w');
  w.scatter('r', 0.3, 361, '~');
  var wt = w.house(9, 2, 12, 6, { roof: 'v', wall: 'R', door: 6 }); w.rect(14, 8, 3, 6, ':'); w.rect(13, 14, 4, 2, 'B');
  w.set(8, 6, 'L'); w.set(21, 6, 'L');
  w.scatter('T', 0.12, 362, '.', [0, 0, 30, 14]); L.clearAround(w, ':', 'T', '.');
  WM.defMap('whitedragon', { name: 'White Dragon Temple', theme: 'south', music: 'tense', rows: w.rows(), spawn: [15, 12], battleBg: 'river', exits: [WM.toWorld('whitedragon', 0, 0, 1, 14)] });
  var wi = L.grid(16, 10, 'x'); var wR = wi.room(1, 1, 14, 9, { floor: 'N' });
  wi.stamp(2, 3, ['L...777...L.', '....888.....', '............', 'j..........j']);
  WM.defMap('whitedragon_in', { name: 'White Dragon Temple', interior: true, theme: 'south', music: 'tense', rows: wi.rows(), spawn: [8, 8] });
  L.link({ map: 'whitedragon', x: wt.x, y: wt.y }, { map: 'whitedragon_in', x: wR.x, y: wR.y });

  // ---------------- Wuweijun (Huang Wenbing's home) ----------------
  var v = L.grid(34, 24, '.');
  v.border('T', 1, [{ side: 'w', from: 10, to: 12 }]);
  v.rect(0, 10, 34, 3, ':');
  v.frame(14, 1, 18, 9, '#'); v.set(22, 9, 'G'); v.vline(22, 9, 10, ':');
  var huang = v.house(16, 2, 14, 5, { roof: '^', door: 6, windows: [2, 11] });
  v.house(3, 15, 6, 4, { roof: 'z', door: false, windows: [2] }); v.house(12, 15, 6, 4, { roof: 'z', door: false, windows: [2] }); v.house(22, 15, 6, 4, { roof: 'z', door: false, windows: [3] });
  v.scatter('T', 0.08, 371, '.', [1, 1, 32, 22]); L.clearAround(v, ':', 'T', '.');
  WM.defMap('wuweijun', { name: 'Wuweijun', theme: 'south', music: 'tense', rows: v.rows(), spawn: [1, 11], battleBg: 'town', tint: 'night', exits: [WM.toWorld('wuweijun', 0, 10, 1, 3)] });
})();
