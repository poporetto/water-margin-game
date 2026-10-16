// Maps for chapters 15–16: Huazhou (Prefect He's hall and prison), the Wei River crossing where the imperial envoy is
// stopped, the Temple of the Western Peak below Mount Hua, Mount Mangdang, and Zengtou with the Fahua Temple.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var walk = function (pts, fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };

  // ---------------- Huazhou ----------------
  var h = L.grid(46, 38, '.');
  h.border('#', 1, [{ side: 's', from: 21, to: 24 }]); h.rect(21, 37, 4, 1, 'G');
  h.rect(21, 1, 4, 36, '='); h.rect(1, 18, 44, 2, '=');
  for (var x = 1; x < 45; x++) h.set(x, 13, '~'); h.rect(21, 13, 4, 1, 'B');      // the canal, and the bridge where Lu Zhishen waited
  var hall = h.house(5, 3, 14, 6, { roof: 'Z', wall: 'R', door: 7 }); h.set(4, 8, 'L'); h.set(19, 8, 'L'); h.vline(hall.x, 9, 12, '='); h.hline(hall.x, 20, 12, '=');
  var jail = h.house(29, 3, 11, 6, { roof: 'v', wall: '#', door: 5 }); h.vline(jail.x, 9, 12, '='); h.hline(25, jail.x, 12, '=');
  var inn = h.house(5, 22, 9, 5, { roof: 'z', door: 4, windows: [1, 7] });
  h.house(29, 22, 8, 5, { roof: '^', door: false, windows: [2, 5] }); h.house(5, 29, 7, 4, { roof: '^', door: false, windows: [3] }); h.house(30, 29, 9, 4, { roof: 'z', door: false, windows: [2, 6] });
  h.scatter('T', 0.04, 531, '.', [1, 1, 44, 35]); L.clearAround(h, '=', 'T', '.');
  WM.defMap('huazhou', { name: 'Huazhou', theme: 'summer', music: 'tense', rows: h.rows(), spawn: [22, 35], battleBg: 'town',
    exits: [WM.toWorld('huazhou', 21, 37, 4, 1)] });
  var hi = L.grid(42, 11, 'x');
  var hR = { hall: hi.room(1, 1, 16, 10, { floor: 'K' }), jail: hi.room(18, 1, 12, 9, { floor: 'N' }), inn: hi.room(31, 1, 10, 8) };
  hi.stamp(2, 3, ['h...EEEEEE...h', '.....q00q.....', '..t..aaaa..t..', '..............']);   // the prefect's hall
  hi.stamp(19, 3, ['-.F-.F-.F.', '..F..F..F.', 'F+FF+FF+F.']);
  hi.stamp(32, 3, ['...kk.kk', '...kk.kk', 'ccc.....']);
  WM.defMap('huazhou_in', { name: '', interior: true, theme: 'summer', music: 'tense', rows: hi.rows(), spawn: [8, 8] });
  [[hall, hR.hall], [jail, hR.jail], [inn, hR.inn]].forEach(function (p) { L.link({ map: 'huazhou', x: p[0].x, y: p[0].y }, { map: 'huazhou_in', x: p[1].x, y: p[1].y }); });
  WM.defEvents('huazhou_in', [L.inn('hzinn', 34, 4, 26), L.save('hzrec', 38, 6)]);

  // ---------------- the Wei River crossing ----------------
  var w = L.grid(32, 20, '.');
  for (var y = 9; y < 20; y++) for (x = 0; x < 32; x++) w.set(x, y, y < 11 ? '~' : 'w');
  w.scatter('r', 0.25, 532, '~', [0, 9, 32, 2]);
  w.rect(14, 8, 4, 3, 'B'); w.set(13, 12, 'o'); w.set(18, 12, 'o'); w.set(16, 14, 'o'); w.set(15, 14, 'o');
  w.rect(0, 4, 32, 2, ':'); w.vline(15, 6, 8, ':'); w.vline(16, 6, 8, ':');
  w.scatter('T', 0.12, 533, '.', [0, 0, 32, 8]); L.clearAround(w, ':', 'T', '.');
  WM.defMap('weiriver', { name: 'Wei River Crossing', theme: 'summer', music: 'field', rows: w.rows(), spawn: [1, 4], battleBg: 'river' });

  // ---------------- the Temple of the Western Peak ----------------
  var t = L.grid(36, 32, 'P');
  t.rect(0, 0, 36, 6, 'M');
  t.rect(4, 6, 28, 26, '.'); t.frame(6, 8, 24, 16, 'R'); t.rect(16, 23, 4, 1, 'G');
  var shrine = t.house(10, 9, 16, 7, { roof: 'v', wall: 'R', door: 8 }); t.set(9, 15, 'L'); t.set(26, 15, 'L');
  t.rect(16, 17, 4, 6, '='); t.set(12, 19, 'Q'); t.set(23, 19, 'Q'); t.set(11, 21, 'U'); t.set(24, 21, 'U');
  t.rect(16, 24, 4, 8, ':');
  t.scatter('T', 0.05, 534, '.', [4, 24, 28, 8]); L.clearAround(t, ':', 'T', '.');
  WM.defMap('xiyue', { name: 'Temple of the Western Peak', theme: 'summer', music: 'palace', rows: t.rows(), spawn: [17, 30], battleBg: 'palace',
    exits: [WM.toWorld('xiyue', 16, 31, 4, 1)] });
  var ti = L.grid(20, 11, 'x'); var tR = ti.room(1, 1, 18, 10, { floor: 'N' });
  ti.stamp(2, 3, ['L...777777...L..', '....888888......', '................', 'j..............j']);
  WM.defMap('xiyue_in', { name: 'Hall of the Golden Heaven King', interior: true, theme: 'summer', music: 'palace', rows: ti.rows(), spawn: [10, 9] });
  L.link({ map: 'xiyue', x: shrine.x, y: shrine.y }, { map: 'xiyue_in', x: tR.x, y: tR.y });

  // ---------------- Mount Mangdang ----------------
  var m = L.grid(36, 36, 'P');
  var mp = [[18, 35], [18, 29], [11, 23], [16, 16], [23, 11], [18, 5]];
  walk(mp, function (x0, y0) { m.rect(x0 - 2, y0 - 1, 5, 3, '.'); });
  walk(mp, function (x0, y0) { m.set(x0, y0, ':'); });
  m.rect(8, 1, 20, 7, '.'); m.frame(8, 1, 20, 7, 'F'); m.rect(17, 7, 3, 1, ':');
  var fort = m.house(12, 2, 12, 4, { roof: 'z', door: 6, windows: [2, 9] }); m.set(10, 5, 'Y'); m.set(25, 5, 'Y');
  m.rect(6, 26, 24, 8, '.');                                                  // the plain below, where the formation is laid
  [[9, 28], [14, 28], [19, 28], [24, 28], [9, 32], [14, 32], [19, 32], [24, 32]].forEach(function (p) { m.set(p[0], p[1], 'm'); });
  m.scatter('m', 0.03, 535, '.'); L.clearAround(m, ':', 'Pm', '.');
  WM.defMap('mangdang', { name: 'Mount Mangdang', theme: 'summer', music: 'dungeon', rows: m.rows(), spawn: [18, 34], battleBg: 'forest',
    exits: [WM.toWorld('mangdang', 16, 35, 5, 1)] });

  // ---------------- Zengtou ----------------
  var z = L.grid(52, 40, '.');
  z.rect(0, 30, 52, 10, '.'); z.rect(0, 34, 52, 2, ':');                       // the Liangshan camp to the south
  [[6, 31], [12, 31], [38, 31], [44, 31], [6, 37], [44, 37]].forEach(function (p) { z.set(p[0], p[1], 'V'); }); z.set(24, 31, 'Y'); z.set(28, 31, 'Y');
  z.frame(14, 2, 26, 18, '#'); z.rect(26, 19, 2, 1, 'G');                      // the walled market town of the Zeng family
  var zhall = z.house(19, 4, 16, 6, { roof: 'Z', wall: 'R', door: 8 }); z.rect(26, 10, 2, 9, '=');
  z.house(16, 12, 6, 4, { roof: '^', door: false, windows: [2] }); z.house(32, 12, 6, 4, { roof: '^', door: false, windows: [3] });
  z.set(17, 3, 'Y'); z.set(37, 3, 'Y');
  z.rect(26, 20, 2, 14, ':');
  // the Fahua Temple in the woods to the west, and the dark road behind it
  z.rect(2, 8, 10, 10, '.'); var fahua = z.house(3, 8, 8, 5, { roof: 'v', wall: 'R', door: 4 }); z.vline(7, 13, 33, ':');
  walk([[7, 22], [12, 21], [13, 24], [14, 27]], function (x0, y0) { z.rect(x0, y0, 2, 2, ':'); });
  z.scatter('T', 0.4, 536, '.', [0, 20, 26, 10]); z.scatter('T', 0.25, 537, '.', [0, 0, 14, 8]); z.scatter('T', 0.06, 538, '.', [40, 0, 12, 30]);
  L.clearAround(z, ':', 'T', '.');
  WM.defMap('zengtou', { name: 'Zengtou', theme: 'spring', music: 'tense', rows: z.rows(), spawn: [26, 35], battleBg: 'field',
    exits: [WM.toWorld('zengtou', 0, 34, 1, 2)] });
  var zi = L.grid(30, 10, 'x'); var zR = { hall: zi.room(1, 1, 16, 9, { floor: 'K' }), fahua: zi.room(18, 1, 10, 8, { floor: 'N' }) };
  zi.stamp(2, 3, ['h...UU....UU..', '....AA....AA..', '..t...........']);
  zi.stamp(19, 3, ['L.UUU.L.', '..AAA...', '........']);
  WM.defMap('zengtou_in', { name: '', interior: true, theme: 'spring', music: 'tense', rows: zi.rows(), spawn: [8, 8] });
  L.link({ map: 'zengtou', x: zhall.x, y: zhall.y }, { map: 'zengtou_in', x: zR.hall.x, y: zR.hall.y });
  L.link({ map: 'zengtou', x: fahua.x, y: fahua.y }, { map: 'zengtou_in', x: zR.fahua.x, y: zR.fahua.y });
})();
