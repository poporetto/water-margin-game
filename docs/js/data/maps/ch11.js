// Maps for chapter 11: the Yinma River (Pei Xuan's band), Jizhou of the north (Yang Xiong's house, the butcher
// shop, Baoen Temple, the state bridge), Cuiping Mountain, the Zhu family inn below Dulong Ridge, and the Li
// family manor.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- the Yinma River ----------------
  var y = L.grid(36, 26, 'P');
  y.rect(0, 10, 36, 6, '.'); y.hline(0, 35, 12, ':'); y.hline(0, 35, 13, ':');
  for (var yy = 0; yy < 26; yy++) { y.set(17, yy, '~'); y.set(18, yy, '~'); y.set(19, yy, yy % 7 === 3 ? 'r' : '~'); }
  y.rect(17, 12, 3, 2, 'B');
  // Pei Xuan's stockade in the hills to the north-east
  y.rect(22, 1, 12, 9, '.'); y.frame(22, 1, 12, 9, 'F'); y.rect(27, 9, 2, 1, ':'); y.vline(27, 9, 11, ':'); y.vline(28, 9, 11, ':');
  var camp = y.house(24, 2, 8, 5, { roof: 'z', door: 4, windows: [1, 6] }); y.set(23, 7, 'Y'); y.set(32, 7, 'Y');
  y.scatter('m', 0.05, 411, '.'); L.clearAround(y, ':', 'Pm', '.');
  WM.defMap('yinma', { name: 'Yinma River', theme: 'autumn', music: 'field', rows: y.rows(), spawn: [1, 12], battleBg: 'forest',
    exits: [WM.toWorld('yinma', 0, 12, 1, 2)],
    encounters: { rate: 0.05, troops: [['n_wolf', 'n_wolf'], ['n_bandit', 'n_bandit', 'n_archer'], ['n_bear']], cond: function (S2) { return !S2.has('ch11_yinma'); } } });
  var yi = L.grid(12, 8, 'x'); var yR = yi.room(1, 1, 10, 7, { floor: 'N' });
  yi.stamp(2, 3, ['h..A...h', '.t..t...', '........']);
  WM.defMap('yinma_in', { name: 'Pei Xuan\'s Hall', interior: true, theme: 'autumn', music: 'field', rows: yi.rows(), spawn: [6, 6] });
  L.link({ map: 'yinma', x: camp.x, y: camp.y }, { map: 'yinma_in', x: yR.x, y: yR.y });

  // ---------------- Jizhou ----------------
  var g = L.grid(48, 40, '.');
  g.border('#', 1, [{ side: 's', from: 22, to: 24 }]);
  g.rect(22, 39, 3, 1, 'G');
  g.rect(22, 1, 3, 38, '='); g.rect(1, 22, 46, 2, '=');
  for (var x0 = 1; x0 < 47; x0++) g.set(x0, 16, '~');                         // the canal
  g.rect(22, 16, 3, 1, 'B');                                                    // the state bridge (州橋)
  var prefect = g.house(5, 3, 12, 6, { roof: 'Z', wall: 'R', door: 6 }); g.set(4, 8, 'L'); g.set(17, 8, 'L');
  var temple = g.house(30, 3, 12, 6, { roof: 'v', wall: 'R', door: 6 }); g.set(29, 8, 'L'); g.set(42, 8, 'L');   // Baoen Temple
  var yang = g.house(5, 25, 10, 5, { roof: '^', door: 3, windows: [1, 7] });     // Yang Xiong's house, the shop on the street side
  g.set(15, 28, 'I');
  var tavern = g.house(29, 25, 9, 5, { roof: 'z', door: 4, windows: [1, 7] }); g.set(38, 26, 'J');
  var lodge = g.house(33, 32, 8, 4, { roof: 'z', door: 3, windows: [1, 6] });
  g.house(5, 33, 7, 4, { roof: '^', door: false, windows: [3] }); g.house(39, 11, 6, 4, { roof: '^', door: false, windows: [2] }); g.house(5, 11, 7, 4, { roof: '^', door: false, windows: [2] });
  [prefect, temple].forEach(function (d) { g.vline(d.x, d.y + 1, 15, ':'); });
  g.hline(prefect.x, 21, 15, ':'); g.hline(25, temple.x, 15, ':');
  g.hline(yang.x, 21, yang.y + 1, ':'); g.hline(25, tavern.x, tavern.y + 1, ':'); g.hline(25, lodge.x, lodge.y + 1, ':');
  g.rect(1, 30, 4, 2, ':'); g.hline(1, yang.x, 31, ':');                       // the lane behind, ending at the city wall
  g.scatter('T', 0.04, 421, '.', [1, 1, 46, 37]);
  L.clearAround(g, ':', 'T', '.'); L.clearAround(g, '=', 'T', '.');
  WM.defMap('jizhou_n', { name: 'Jizhou', theme: 'autumn', music: 'town', rows: g.rows(), spawn: [23, 37], battleBg: 'town',
    exits: [WM.toWorld('jizhou_n', 22, 39, 3, 1)] });
  var gi = L.grid(58, 11, 'x');
  var gR = { yang: gi.room(1, 1, 14, 9), tavern: gi.room(16, 1, 11, 8), temple: gi.room(28, 1, 14, 10, { floor: 'N' }), lodge: gi.room(43, 1, 9, 7), prefect: gi.room(53, 1, 4, 5, { floor: 'N' }) };
  gi.stamp(2, 3, ['h.ttt.c.k.k.', '......c.....', '............', 'A...........', '...........j']);   // front: the meat counter; back: the rooms
  gi.stamp(17, 3, ['h..L...h', '.t..t..t.', '.........', 'ccc......']);
  gi.stamp(29, 3, ['L...111....L', '....222.....', '...4.3.4....', 'j..........j', '............']);   // the Buddha hall of Baoen Temple
  gi.stamp(44, 3, ['k..h...', '.......', '..t....']);
  WM.defMap('jizhou_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: gi.rows(), spawn: [7, 8] });
  [[yang, gR.yang], [tavern, gR.tavern], [temple, gR.temple], [lodge, gR.lodge]].forEach(function (p) { L.link({ map: 'jizhou_n', x: p[0].x, y: p[0].y }, { map: 'jizhou_in', x: p[1].x, y: p[1].y }); });
  WM.data.jizhou = { doors: { yang: yang, tavern: tavern, temple: temple, lodge: lodge, prefect: prefect }, rooms: gR };
  WM.defEvents('jizhou_in', [L.inn('jzlodge', 47, 4, 22), L.save('jzrec', 50, 6)]);

  // ---------------- Cuiping Mountain ----------------
  var c = L.grid(30, 32, 'P');
  var cp = [[14, 31], [14, 26], [9, 21], [12, 15], [19, 11], [16, 6]];
  var walk = function (fn) { for (var i = 0; i < cp.length - 1; i++) { var a = cp[i], b = cp[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk(function (x, yy) { c.rect(x - 2, yy - 1, 5, 3, '.'); });
  walk(function (x, yy) { c.set(x, yy, ':'); });
  c.rect(8, 1, 16, 7, '.');                                                     // the old tombs at the top
  c.set(11, 2, 'g'); c.set(14, 2, 'g'); c.set(19, 3, 'g'); c.set(16, 2, 'Q'); c.set(21, 2, 'e'); c.set(9, 4, 'e');
  c.rect(12, 3, 3, 2, 'm');                                                     // the great grave mound
  c.scatter('m', 0.03, 431, '.'); L.clearAround(c, ':', 'Pm', '.');
  WM.defMap('cuiping', { name: 'Cuiping Mountain', theme: 'autumn', music: 'tense', rows: c.rows(), spawn: [14, 30], battleBg: 'forest',
    exits: [WM.toWorld('cuiping', 13, 31, 3, 1)] });

  // ---------------- the inn below Dulong Ridge ----------------
  var z = L.grid(36, 24, '.');
  z.rect(0, 13, 36, 3, ':');
  z.rect(0, 0, 36, 5, 'M'); z.scatter('P', 0.5, 441, '.', [0, 5, 36, 3]);       // Dulong Ridge behind
  var inn = z.house(10, 6, 10, 5, { roof: 'z', door: 4, windows: [1, 8] }); z.vline(14, 11, 12, ':'); z.set(20, 7, 'J'); z.set(21, 11, 'I');
  z.frame(21, 8, 4, 3, 'F'); z.set(22, 10, '.');                                // the hen-coop yard
  z.rect(30, 12, 6, 5, '.'); z.frame(31, 11, 5, 7, '#'); z.rect(31, 13, 1, 3, 'G');   // the road on to Zhu Family Village (barred)
  z.scatter('T', 0.12, 442, '.', [0, 16, 30, 8]); z.scatter('b', 0.04, 443, '.', [0, 16, 30, 8]);
  L.clearAround(z, ':', 'TbP', '.');
  WM.defMap('zhuinn', { name: 'Inn below Dulong Ridge', theme: 'autumn', music: 'town', rows: z.rows(), spawn: [1, 14], battleBg: 'forest',
    exits: [WM.toWorld('zhuinn', 0, 13, 1, 3)] });
  var zi = L.grid(14, 9, 'x'); var zR = zi.room(1, 1, 12, 8);
  zi.stamp(2, 3, ['h..j..k.k.', '.t..t.....', '..........', 'ccc.......']);
  WM.defMap('zhuinn_in', { name: 'Zhu Family Inn', interior: true, theme: 'autumn', music: 'inn', rows: zi.rows(), spawn: [7, 7] });
  L.link({ map: 'zhuinn', x: inn.x, y: inn.y }, { map: 'zhuinn_in', x: zR.x, y: zR.y });

  // ---------------- the Li family manor ----------------
  var m = L.grid(44, 32, '.');
  m.rect(0, 20, 44, 2, ':');
  m.frame(12, 2, 20, 14, '#'); m.rect(21, 15, 3, 1, 'G');
  for (var xx = 10; xx < 34; xx++) { m.set(xx, 0, '~'); m.set(xx, 17, '~'); } for (yy = 0; yy < 18; yy++) { m.set(10, yy, '~'); m.set(33, yy, '~'); }
  m.rect(21, 17, 3, 1, 'B'); m.rect(21, 16, 3, 1, ':'); m.vline(22, 18, 19, ':'); m.vline(21, 18, 19, ':'); m.vline(23, 18, 19, ':');
  var hall = m.house(15, 4, 14, 6, { roof: 'Z', wall: 'R', door: 7 }); m.vline(22, 10, 14, ':'); m.set(14, 9, 'L'); m.set(29, 9, 'L');
  m.house(13, 11, 5, 3, { roof: '^', door: false, windowsUpper: [], wallRows: 1 }); m.house(26, 11, 5, 3, { roof: '^', door: false, wallRows: 1 });
  var shop = m.house(3, 23, 7, 4, { roof: 'z', door: 3, windows: [1, 5] }); m.set(10, 24, 'J');   // the village tavern
  m.rect(36, 18, 8, 6, '.');                                                    // the fields towards Zhu Family Village
  m.rect(14, 23, 18, 7, 'y');
  m.scatter('T', 0.06, 451, '.', [0, 22, 44, 10]); m.scatter('T', 0.05, 452, '.', [34, 0, 10, 18]); m.scatter('T', 0.05, 453, '.', [0, 0, 10, 18]);
  L.clearAround(m, ':', 'T', '.');
  WM.defMap('lijia', { name: 'Li Family Manor', theme: 'autumn', music: 'field', rows: m.rows(), spawn: [1, 20], battleBg: 'field',
    exits: [WM.toWorld('lijia', 0, 20, 1, 2)] });
  var mi = L.grid(30, 10, 'x'); var mR = { hall: mi.room(1, 1, 16, 9, { floor: 'N' }), shop: mi.room(18, 1, 10, 7) };
  mi.stamp(2, 3, ['h...UU....h...', '....AA........', '..t...........', '..............']);
  mi.stamp(19, 3, ['h..j...h', '.t..t...', 'cc......']);
  WM.defMap('lijia_in', { name: '', interior: true, theme: 'autumn', music: 'field', rows: mi.rows(), spawn: [8, 8] });
  L.link({ map: 'lijia', x: hall.x, y: hall.y }, { map: 'lijia_in', x: mR.hall.x, y: mR.hall.y });
  L.link({ map: 'lijia', x: shop.x, y: shop.y }, { map: 'lijia_in', x: mR.shop.x, y: mR.shop.y });
  WM.defEvents('lijia_in', [L.inn('liinn', 22, 4, 24), L.save('lirec', 26, 5)]);
})();
