// Maps for the birthday gifts (chapter 5) and Song Jiang's county (chapter 6):
// East Creek Village, Shijie Village, Yellow Earth Ridge, Mount Erlong, Yuncheng.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- East Creek Village (Chao Gai's manor) ----------------
  var d = L.grid(36, 30, '.');
  d.border('T', 1, [{ side: 's', from: 16, to: 18 }]);
  d.rect(16, 18, 3, 12, ':'); d.rect(3, 17, 30, 2, ':');
  // the creek with the stone pagoda Chao Gai carried across
  d.rect(1, 22, 34, 2, '~'); d.rect(16, 22, 3, 2, 'B'); d.set(10, 21, 'U');
  // Chao Gai's manor
  d.frame(5, 3, 20, 13, 'F'); d.rect(14, 15, 3, 1, ':');
  var manor = d.house(7, 4, 16, 6, { roof: '^', door: 8, windows: [2, 5, 10, 13] });
  d.vline(15, 10, 16, ':');
  d.house(6, 11, 5, 3, { roof: 'z', door: false, wallRows: 1 }); d.house(19, 11, 5, 3, { roof: 'z', door: false, wallRows: 1 });
  d.set(12, 12, 'p'); d.stamp(11, 13, ['f.T.f']);
  // Lingguan temple, where Liu Tang slept
  var temple = d.house(27, 4, 6, 4, { roof: 'v', wall: 'R', door: 3 });
  d.vline(30, 8, 16, ':');
  // Wu Yong's schoolhouse
  var school = d.house(26, 24, 7, 4, { roof: 'z', door: 3, windows: [1, 5] });
  d.vline(29, 19, 23, ':'); d.set(29, 22, 'B'); d.set(29, 23, 'B');
  d.house(3, 25, 6, 4, { roof: 'z', door: false, windows: [2] });
  d.rect(10, 25, 6, 4, 'y');
  d.scatter('T', 0.08, 181, '.', [1, 1, 34, 28]); d.scatter('f', 0.04, 182, '.', [1, 1, 34, 28]);
  L.clearAround(d, ':', 'T', '.');
  WM.defMap('dongxi', { name: 'East Creek Village', theme: 'summer', music: 'field', rows: d.rows(), spawn: [17, 28], battleBg: 'plains', exits: [WM.toWorld('dongxi', 16, 29, 3, 1)] });
  var di = L.grid(40, 12, 'x');
  var dR = { manor: di.room(1, 1, 18, 10, { floor: 'K' }), temple: di.room(20, 1, 8, 7, { floor: 'N' }), school: di.room(29, 1, 10, 8) };
  di.stamp(2, 3, ['h..A......A..h..', '................', '..t..KKKKKK..t..', '.....KKKKKK.....', 'k..............k']);
  di.stamp(21, 3, ['.UUU..', '.AAA..']); di.stamp(30, 3, ['h..h..h.', '........', '.t.t.t..', '.t.t.t..']);
  WM.defMap('dongxi_in', { name: '', interior: true, theme: 'summer', music: 'field', rows: di.rows(), spawn: [10, 9] });
  L.link({ map: 'dongxi', x: manor.x, y: manor.y }, { map: 'dongxi_in', x: dR.manor.x, y: dR.manor.y });
  L.link({ map: 'dongxi', x: temple.x, y: temple.y }, { map: 'dongxi_in', x: dR.temple.x, y: dR.temple.y });
  L.link({ map: 'dongxi', x: school.x, y: school.y }, { map: 'dongxi_in', x: dR.school.x, y: dR.school.y });
  WM.data.dongxi = { rooms: dR, manor: manor };

  // ---------------- Shijie Village (the Ruan brothers) ----------------
  var s = L.grid(40, 30, 'w');
  for (var y = 0; y < 30; y++) for (var x = 0; x < 40; x++) {
    var land = x < 14 + Math.round(Math.sin(y * 0.4) * 2) || (y > 20 && x < 22);
    if (land) s.set(x, y, '.');
    else if (x < 17 + Math.round(Math.sin(y * 0.4) * 2)) s.set(x, y, '~');
    else if (U.hash2(x, y, 191) > 0.72) s.set(x, y, 'r');
  }
  s.rect(0, 13, 6, 2, ':'); s.vline(6, 4, 26, ':');
  var r2 = s.house(1, 3, 5, 4, { roof: 'z', door: 2 }); var r5 = s.house(8, 8, 5, 4, { roof: 'z', door: 2 }); var r7 = s.house(1, 17, 5, 4, { roof: 'z', door: 2 });
  // the waterside tavern on stilts
  s.rect(15, 23, 6, 4, '.'); var tavern = s.house(15, 22, 6, 4, { roof: 'z', door: 3 }); s.rect(17, 26, 2, 1, 'B'); s.hline(7, 18, 27, ':'); s.set(21, 23, 'Y');
  [r2, r5, r7].forEach(function (q) { s.hline(Math.min(q.x, 6), Math.max(q.x, 6), q.y + 1, ':'); });
  s.set(14, 6, 'o'); s.set(15, 12, 'o'); s.set(14, 18, 'o');
  s.scatter('T', 0.08, 192, '.', [0, 0, 14, 30]);
  L.clearAround(s, ':', 'T', '.');
  WM.defMap('shijie', { name: 'Shijie Village', theme: 'marsh', music: 'field', rows: s.rows(), spawn: [1, 14], battleBg: 'marsh', exits: [WM.toWorld('shijie', 0, 13, 1, 2)] });
  var si = L.grid(30, 10, 'x');
  var sR = { r2: si.room(1, 1, 7, 7), r5: si.room(8, 1, 7, 7), r7: si.room(15, 1, 7, 7), tavern: si.room(22, 1, 8, 8) };
  si.stamp(2, 3, ['k..j.', '.....', '..t..']); si.stamp(9, 3, ['k..j.', '.....', '..t..']); si.stamp(16, 3, ['k..j.', '.....', '..t..']);
  si.stamp(23, 3, ['h..h..', '.t..t.', 'cc....']);
  WM.defMap('shijie_in', { name: '', interior: true, theme: 'marsh', music: 'field', rows: si.rows(), spawn: [4, 6] });
  [[r2, sR.r2], [r5, sR.r5], [r7, sR.r7], [tavern, sR.tavern]].forEach(function (p) { L.link({ map: 'shijie', x: p[0].x, y: p[0].y }, { map: 'shijie_in', x: p[1].x, y: p[1].y }); });
  WM.data.shijie = { rooms: sR };

  // ---------------- Yellow Earth Ridge ----------------
  var h = L.grid(40, 24, 'm');
  for (y = 0; y < 24; y++) for (x = 0; x < 40; x++) { if (Math.abs(y - 12 - Math.round(Math.sin(x * 0.18) * 3)) < 5) h.set(x, y, 's'); }
  for (x = 0; x < 40; x++) { var cy = 12 + Math.round(Math.sin(x * 0.18) * 3); h.set(x, cy, ':'); h.set(x, cy + 1, ':'); }
  h.rect(18, 4, 9, 7, 's'); h.scatter('P', 0.35, 201, 's', [18, 4, 9, 6]);   // the pine grove at the crest
  h.scatter('m', 0.06, 202, 's'); h.scatter('e', 0.03, 203, 's');
  L.clearAround(h, ':', 'mPe', 's');
  h.rect(20, 7, 5, 3, 's');
  WM.defMap('huangni', { name: 'Yellow Earth Ridge', theme: 'autumn', music: 'tense', rows: h.rows(), spawn: [1, 12], battleBg: 'ridge', tint: 'dusk',
    exits: [WM.toWorld('huangni', 0, 8, 1, 10), WM.toWorld('huangni', 39, 8, 1, 10)],
    encounters: { rate: 0.05, troops: [['roadbandit', 'roadbandit', 'roadarcher'], ['wolf2', 'wolf2'], ['eagle', 'eagle']], cond: function (S2) { return !S2.has('ch5_escort') || S2.has('ch5_gifts'); } } });

  // ---------------- Mount Erlong and the Baozhu Temple ----------------
  var e = L.grid(32, 36, 'M');
  var ep = [[15, 35], [15, 28], [10, 24], [16, 19], [16, 14]];
  var epWalk = function (fn) { for (var i = 0; i < ep.length - 1; i++) { var a = ep[i], b = ep[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  epWalk(function (px, py) { e.rect(px - 2, py - 1, 5, 3, '.'); });
  epWalk(function (px, py) { e.set(px, py, ':'); e.set(px + 1, py, ':'); });
  e.rect(4, 2, 24, 12, '.'); e.frame(4, 2, 24, 12, 'R');
  e.rect(14, 13, 4, 1, 'G'); e.set(14, 13, 'R'); e.set(17, 13, 'R'); e.rect(15, 13, 2, 1, 'G');
  var bz = e.house(9, 3, 14, 6, { roof: 'v', wall: 'R', door: 7 });
  e.rect(15, 9, 2, 4, '='); e.set(12, 10, 'L'); e.set(19, 10, 'L');
  e.scatter('P', 0.15, 211, '.'); L.clearAround(e, ':', 'P', '.'); L.clearAround(e, '=', 'P', '.');
  e.set(15, 12, ':'); e.set(16, 12, ':');
  WM.defMap('erlong', { name: 'Mount Erlong — Baozhu Temple', theme: 'autumn', music: 'dungeon', rows: e.rows(), spawn: [15, 34], battleBg: 'mountain',
    exits: [WM.toWorld('erlong', 13, 35, 5, 1)], encounters: { rate: 0.06, troops: [['roadbandit', 'roadbandit'], ['wolf2', 'wolf2'], ['bear']], cond: function (S2) { return !S2.has('ch5_erlongtaken'); } } });
  var ei = L.grid(18, 11, 'x');
  var eR = ei.room(1, 1, 16, 9, { floor: 'N' });
  ei.stamp(2, 3, ['L...UUU...L...', '....AAA.......', '..............', '..t........t..']);
  WM.defMap('erlong_in', { name: 'Baozhu Temple', interior: true, theme: 'autumn', music: 'dungeon', rows: ei.rows(), spawn: [9, 8] });
  L.link({ map: 'erlong', x: bz.x, y: bz.y }, { map: 'erlong_in', x: eR.x, y: eR.y });

  // ---------------- Yuncheng County ----------------
  var c = L.grid(44, 34, '.');
  c.border('#', 1, [{ side: 's', from: 20, to: 23 }]);
  c.rect(20, 33, 4, 1, 'G');
  c.rect(20, 1, 4, 32, '='); c.rect(1, 16, 42, 2, '=');
  var office = c.house(14, 3, 16, 6, { roof: 'v', wall: 'R', door: 8 });     // the county yamen, where Song Jiang is a clerk
  c.set(13, 7, 'L'); c.set(30, 7, 'L');
  var tea = c.house(3, 10, 8, 5, { roof: '^', door: 4, windows: [1, 6] });   // the teahouse opposite the yamen
  var yan = c.house(32, 10, 8, 5, { roof: '^', door: 4, windows: [1, 6] });  // the house Song Jiang bought for Yan Poxi
  var inn = c.house(3, 20, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  var shop = c.house(13, 20, 6, 5, { roof: 'z', door: 3, windows: [1] });
  var store2 = c.house(26, 20, 7, 5, { roof: 'z', door: 3, windows: [1, 5] });
  var wine = c.house(34, 20, 7, 5, { roof: 'z', door: 3, windows: [1, 5] }); c.set(33, 20, 'Y');
  [tea, yan].forEach(function (q) { c.vline(q.x, q.y + 1, 15, ':'); });
  c.hline(2, 41, 26, ':'); [inn, shop, store2, wine].forEach(function (q) { c.vline(q.x, q.y + 1, 26, ':'); });
  c.vline(22, 9, 9, '=');
  c.scatter('T', 0.07, 221, '.', [1, 1, 42, 32]); c.scatter('f', 0.04, 222, '.', [1, 1, 42, 32]);
  L.clearAround(c, ':', 'T', '.'); L.clearAround(c, '=', 'T', '.');
  c.set(18, 30, 'I');
  var stage = c.house(27, 28, 11, 4, { roof: 'z', wall: 'R', door: 5, windows: [2, 8] }); c.set(26, 29, 'Y'); c.set(38, 29, 'Y');   // the theatre (勾欄) the Bai family open in chapter 13
  WM.defMap('yuncheng', { name: 'Yuncheng County', theme: 'summer', music: 'town', rows: c.rows(), spawn: [21, 31], battleBg: 'town', exits: [WM.toWorld('yuncheng', 20, 33, 4, 1)] });
  var ci = L.grid(80, 12, 'x');
  var cR = { office: ci.room(1, 1, 16, 10, { floor: 'N' }), tea: ci.room(18, 1, 10, 8), yan: ci.room(29, 1, 12, 9), inn: ci.room(42, 1, 10, 8), shop: ci.room(53, 1, 7, 8), store2: ci.room(60, 1, 6, 8), stage: ci.room(67, 1, 12, 10) };
  ci.stamp(68, 3, ['..KKKKKKK.', '..KKKKKKK.', '..........', '.t.t.t.t..', '.t.t.t.t..', '..........']);
  ci.stamp(2, 3, ['h...UU....h...', '....AA........', '..t.....t.....', '..t.....t.....']);
  ci.stamp(19, 3, ['h..L...h', '.t..t...', '........', 'cc......']);
  ci.stamp(30, 3, ['k...h...X.', '........X.', '..t.....n.', '........Xk', 'j.......X.']);
  ci.stamp(43, 3, ['k.k.k...', '........', 'ccc.....']);
  ci.stamp(54, 3, ['hhhh.', '.....', 'ccc..']);
  ci.stamp(61, 3, ['hhh.', '....', 'cc..']);
  WM.defMap('yuncheng_in', { name: '', interior: true, theme: 'summer', music: 'town', rows: ci.rows(), spawn: [9, 9] });
  [[office, cR.office], [tea, cR.tea], [yan, cR.yan], [inn, cR.inn], [shop, cR.shop], [store2, cR.store2], [stage, cR.stage]].forEach(function (p) { L.link({ map: 'yuncheng', x: p[0].x, y: p[0].y }, { map: 'yuncheng_in', x: p[1].x, y: p[1].y }); });
  WM.data.yuncheng = { rooms: cR, doors: { office: office, tea: tea, yan: yan, inn: inn, shop: shop, store2: store2, wine: wine, stage: stage } };
  WM.defEvents('yuncheng_in', [
    L.inn('ycinn', 45, 4, 20), L.save('ycrec', 49, 6),
    L.shop('ycshop', 56, 4, 'yuncheng', 'shopkeep', 'Welcome to Yuncheng. We have everything for the road.')
  ]);
})();

// ---------------- the Song family farm (Song Jiang's home, chapter 6) ----------------
(function () {
  var L = WM.mapLib;
  var f = L.grid(32, 26, '.');
  f.border('T', 1, [{ side: 's', from: 14, to: 16 }]);
  f.rect(14, 15, 3, 11, ':');
  f.frame(4, 3, 24, 12, 'F'); f.rect(14, 14, 3, 1, ':');
  var hall = f.house(6, 4, 12, 5, { roof: '^', door: 6, windows: [2, 9] });
  var shrine = f.house(20, 4, 6, 5, { roof: 'v', wall: 'R', door: 3 });     // the Buddha hall with the cellar beneath
  f.hline(12, 23, 10, ':'); f.vline(12, 9, 13, ':'); f.vline(23, 9, 10, ':');
  f.stamp(5, 11, ['f.T.f.', 'T.f.T.']); f.stamp(20, 11, ['.f.T.f', '.T.f.T']);
  f.rect(3, 17, 9, 6, 'y'); f.rect(19, 17, 10, 6, 'y');
  f.scatter('T', 0.06, 231, '.', [1, 1, 30, 24]); L.clearAround(f, ':', 'T', '.');
  WM.defMap('songfarm', { name: 'Song Family Farm', theme: 'summer', music: 'field', rows: f.rows(), spawn: [15, 24], battleBg: 'plains', exits: [WM.toWorld('songfarm', 14, 25, 3, 1)] });
  var fi = L.grid(30, 10, 'x');
  var fR = { hall: fi.room(1, 1, 14, 8, { floor: 'K' }), shrine: fi.room(16, 1, 9, 8, { floor: 'N' }) };
  fi.stamp(2, 3, ['h..A.....A..', '............', '..t......t..', 'k..........k']);
  fi.stamp(17, 3, ['.UUU...', '.AAA...', '.......', '....S..']);
  WM.defMap('songfarm_in', { name: '', interior: true, theme: 'summer', music: 'field', rows: fi.rows(), spawn: [8, 7] });
  L.link({ map: 'songfarm', x: hall.x, y: hall.y }, { map: 'songfarm_in', x: fR.hall.x, y: fR.hall.y });
  L.link({ map: 'songfarm', x: shrine.x, y: shrine.y }, { map: 'songfarm_in', x: fR.shrine.x, y: fR.shrine.y });
  WM.data.songfarm = { rooms: fR };
})();
