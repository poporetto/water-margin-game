// Maps for chapter 13: a roadside inn on the way to Jizhou, the woods outside Cangzhou, Gaotang prefecture (Chai
// Huangcheng's garden, the yamen, the prison and its dry well), the bottom of the well, Erxian Mountain (old Mother
// Gongsun's cottage and Luo Zhenren's Purple Void Temple), and the market town of Wugang.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- a roadside inn (Zhu Tong lets Lei Heng go) ----------------
  var r = L.grid(26, 16, 'T');
  r.rect(0, 7, 26, 3, '.'); r.hline(0, 25, 8, ':');
  r.rect(7, 2, 12, 5, '.'); var rinn = r.house(8, 2, 9, 4, { roof: 'z', door: 4, windows: [1, 7] }); r.set(17, 3, 'J'); r.vline(12, 6, 7, ':');
  r.scatter('.', 0.25, 481, 'T', [0, 0, 26, 16]); r.rect(0, 7, 26, 3, '.'); r.hline(0, 25, 8, ':'); r.vline(12, 6, 7, ':');
  WM.defMap('roadinn', { name: 'Roadside Inn', theme: 'summer', music: 'field', rows: r.rows(), spawn: [1, 8], battleBg: 'forest' });
  var ri = L.grid(12, 8, 'x'); var rR = ri.room(1, 1, 10, 7);
  ri.stamp(2, 3, ['h..j...h', '.t..t...', 'cc......']);
  WM.defMap('roadinn_in', { name: 'Roadside Inn', interior: true, theme: 'summer', music: 'inn', rows: ri.rows(), spawn: [6, 6] });
  L.link({ map: 'roadinn', x: rinn.x, y: rinn.y }, { map: 'roadinn_in', x: rR.x, y: rR.y });

  // ---------------- the woods outside Cangzhou ----------------
  var w = L.grid(40, 18, 'T');
  var wp = [[0, 9], [8, 7], [15, 11], [22, 6], [30, 10], [39, 8]];
  var walk = function (pts, fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk(wp, function (x, y) { w.rect(x - 1, y - 1, 3, 3, '.'); });
  w.rect(13, 9, 5, 5, '.');                                                      // the clearing where the child lies
  w.scatter('b', 0.06, 482, 'T');
  WM.defMap('cangforest', { name: 'Woods outside Cangzhou', theme: 'summer', music: 'tense', rows: w.rows(), spawn: [0, 9], battleBg: 'forest', tint: 'night' });

  // ---------------- Gaotang ----------------
  var g = L.grid(50, 40, '.');
  g.border('#', 1, [{ side: 's', from: 23, to: 26 }]);
  g.rect(23, 39, 4, 1, 'G');
  g.rect(23, 1, 4, 38, '='); g.rect(1, 20, 48, 2, '=');
  var yamen = g.house(14, 3, 18, 6, { roof: 'Z', wall: 'R', door: 9 }); g.set(13, 8, 'L'); g.set(32, 8, 'L'); g.vline(yamen.x, 9, 19, '=');
  // the prison yard, and the old dry well in its corner
  g.frame(34, 3, 14, 12, '#'); g.rect(40, 14, 2, 1, 'G'); g.vline(40, 15, 19, ':'); g.vline(41, 15, 19, ':');
  var jail = g.house(36, 4, 10, 5, { roof: 'v', wall: '#', door: 4 }); g.set(45, 12, 'p');
  // Chai Huangcheng's house and the garden Yin Tianxi covets
  var chai = g.house(4, 23, 10, 5, { roof: '^', door: 5, windows: [1, 8] }); g.frame(2, 22, 14, 14, 'F'); g.rect(3, 29, 12, 6, 'f'); g.rect(8, 35, 3, 1, '.');
  g.set(5, 31, 'p'); g.set(12, 30, 'T'); g.set(4, 33, 'T');
  g.hline(9, 22, 36, ':'); g.vline(chai.x, chai.y + 1, 34, ':');
  var inn = g.house(30, 24, 9, 5, { roof: 'z', door: 4, windows: [1, 7] });
  g.house(40, 24, 7, 4, { roof: '^', door: false, windows: [2] }); g.house(30, 32, 7, 4, { roof: '^', door: false, windows: [2] }); g.house(3, 11, 8, 4, { roof: '^', door: false, windows: [2, 5] });
  g.scatter('T', 0.04, 491, '.', [1, 1, 48, 37]); L.clearAround(g, '=', 'T', '.'); L.clearAround(g, ':', 'T', '.');
  WM.defMap('gaotang', { name: 'Gaotang', theme: 'summer', music: 'town', rows: g.rows(), spawn: [24, 37], battleBg: 'town',
    exits: [WM.toWorld('gaotang', 23, 39, 4, 1)] });
  var gi = L.grid(52, 11, 'x');
  var gR = { chai: gi.room(1, 1, 14, 9), yamen: gi.room(16, 1, 18, 10, { floor: 'K' }), jail: gi.room(35, 1, 14, 9, { floor: 'N' }) };
  gi.stamp(2, 3, ['h..A......h.', '..........k.', '..t.....t...', '............']);
  gi.stamp(17, 3, ['h....EEEEEE....h', '......q00q......', '..t...aaaa...t..', '................']);   // the prefect's hall
  gi.stamp(36, 3, ['F.FF.FF.FF.F', 'F..F..F..F..', '............', 'h..........h']);
  WM.defMap('gaotang_in', { name: '', interior: true, theme: 'summer', music: 'town', rows: gi.rows(), spawn: [8, 8] });
  [[chai, gR.chai], [yamen, gR.yamen], [jail, gR.jail]].forEach(function (p) { L.link({ map: 'gaotang', x: p[0].x, y: p[0].y }, { map: 'gaotang_in', x: p[1].x, y: p[1].y }); });
  WM.data.gaotang = { doors: { chai: chai, yamen: yamen, jail: jail, inn: inn }, rooms: gR, well: [45, 12] };

  // ---------------- the bottom of the dry well ----------------
  var k = L.grid(22, 16, '_');
  walk([[3, 2], [3, 7], [9, 9], [14, 6], [18, 11], [12, 13]], function (x, y) { k.rect(x - 1, y - 1, 3, 3, 'N'); });
  k.rect(2, 1, 3, 3, 'N'); k.set(6, 8, 'm'); k.set(15, 9, 'm'); k.set(10, 11, 'g'); k.set(17, 13, 'g'); k.set(5, 5, 'g');
  WM.defMap('gaowell', { name: 'The Dry Well', interior: true, theme: 'snow', music: 'dungeon', rows: k.rows(), spawn: [3, 2], battleBg: 'cave', tint: 'dark' });

  // ---------------- Erxian Mountain ----------------
  var e = L.grid(34, 36, 'P');
  var ep = [[16, 35], [16, 30], [10, 25], [14, 18], [20, 12], [17, 7]];
  walk(ep, function (x, y) { e.rect(x - 2, y - 1, 5, 3, '.'); });
  walk(ep, function (x, y) { e.set(x, y, ':'); });
  e.rect(4, 26, 10, 7, '.'); var home = e.house(5, 27, 6, 4, { roof: 'z', door: 3, windows: [1] }); e.hline(8, 15, 31, ':');   // Mother Gongsun's cottage
  e.rect(8, 1, 18, 9, '.'); var temple = e.house(10, 1, 14, 6, { roof: 'v', wall: 'R', door: 7 }); e.set(9, 6, 'L'); e.set(24, 6, 'L'); e.vline(17, 7, 8, ':');   // the Purple Void Temple
  e.scatter('m', 0.04, 501, '.'); e.scatter('T', 0.03, 502, '.'); L.clearAround(e, ':', 'PmT', '.');
  WM.defMap('erxian', { name: 'Erxian Mountain', theme: 'summer', music: 'palace', rows: e.rows(), spawn: [16, 34], battleBg: 'forest',
    exits: [WM.toWorld('erxian', 14, 35, 5, 1)] });
  var ei = L.grid(30, 10, 'x'); var eR = { home: ei.room(1, 1, 8, 7), temple: ei.room(10, 1, 16, 9, { floor: 'N' }) };
  ei.stamp(2, 3, ['k..j..', '......', '..t...']);
  ei.stamp(11, 3, ['L...UUUU...L.', '....AAAA.....', '.............', 'j...........j']);
  WM.defMap('erxian_in', { name: '', interior: true, theme: 'summer', music: 'palace', rows: ei.rows(), spawn: [5, 6] });
  L.link({ map: 'erxian', x: home.x, y: home.y }, { map: 'erxian_in', x: eR.home.x, y: eR.home.y });
  L.link({ map: 'erxian', x: temple.x, y: temple.y }, { map: 'erxian_in', x: eR.temple.x, y: eR.temple.y });

  // ---------------- Wugang ----------------
  var m = L.grid(30, 20, '.');
  m.rect(0, 10, 30, 2, ':');
  var smithy = m.house(4, 4, 8, 5, { roof: 'z', door: 4, windows: [1, 6] }); m.set(12, 6, 'Y'); m.vline(smithy.x, 9, 9, ':');
  m.house(15, 4, 6, 5, { roof: '^', door: false, windows: [2] }); m.house(22, 4, 6, 5, { roof: 'z', door: false, windows: [3] });
  m.house(5, 14, 6, 4, { roof: '^', door: false, windows: [2] }); m.house(18, 14, 7, 4, { roof: 'z', door: false, windows: [3] });
  m.scatter('T', 0.05, 511, '.'); L.clearAround(m, ':', 'T', '.');
  WM.defMap('wugang', { name: 'Wugang Market', theme: 'summer', music: 'town', rows: m.rows(), spawn: [0, 10], battleBg: 'town',
    exits: [WM.toWorld('wugang', 0, 10, 1, 2)] });
  var mi = L.grid(12, 8, 'x'); var mR = mi.room(1, 1, 10, 7);
  mi.stamp(2, 3, ['hjj..h..', '..t.....', 'p.......']);
  WM.defMap('wugang_in', { name: 'Smithy', interior: true, theme: 'summer', music: 'town', rows: mi.rows(), spawn: [6, 6] });
  L.link({ map: 'wugang', x: smithy.x, y: smithy.y }, { map: 'wugang_in', x: mR.x, y: mR.y });
})();
