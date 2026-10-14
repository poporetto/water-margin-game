// Maps for chapter 23: Hangzhou from the West Lake (the Yongjin Gate where Zhang Shun fell), the mountains behind
// Qingxi where Lu Zhishen finds Fang La, and the Liuhe Temple above the Qiantang River.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- Hangzhou and the West Lake ----------------
  var h = L.grid(48, 32, '.');
  for (var y = 0; y < 32; y++) for (var x = 0; x < 22; x++) h.set(x, y, (x < 2 || y < 2 || y > 29) ? '~' : 'w');   // the West Lake
  h.scatter('r', 0.08, 581, 'w', [2, 2, 20, 28]);
  h.rect(4, 14, 14, 1, 'B'); h.set(10, 13, 'B'); h.set(10, 15, 'B');          // Xiling bridge and causeway
  h.rect(22, 0, 2, 32, '.');
  h.frame(26, 1, 21, 30, '#'); h.rect(26, 14, 1, 3, 'G');                     // the city wall; the Yongjin Gate faces the lake
  h.rect(22, 14, 4, 3, ':'); h.set(24, 13, 'Y'); h.set(24, 17, 'Y');
  for (y = 13; y < 18; y++) h.set(25, y, y === 15 ? ':' : '~');               // the moat-pool before the gate
  h.house(29, 3, 14, 6, { roof: 'Z', wall: 'R', door: false }); h.house(29, 21, 7, 4, { roof: 'z', door: false }); h.house(38, 21, 7, 4, { roof: '^', door: false });
  h.rect(27, 14, 19, 3, '=');
  WM.defMap('hangzhou', { name: 'Hangzhou — the West Lake', theme: 'spring', music: 'tense', rows: h.rows(), spawn: [23, 28], battleBg: 'river', tint: 'night',
    exits: [WM.toWorld('hangzhou', 22, 31, 2, 1)] });

  // ---------------- the mountains behind Qingxi ----------------
  var q = L.grid(34, 28, 'P');
  var walk = function (pts, fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk([[16, 27], [16, 21], [9, 16], [14, 10], [22, 6]], function (x0, y0) { q.rect(x0 - 1, y0 - 1, 3, 3, '.'); });
  q.rect(18, 2, 10, 7, '.'); q.house(21, 3, 5, 3, { roof: 'z', door: false, wallRows: 1 });   // a grass hut in a fold of the hills
  q.set(5, 3, 'M'); q.rect(3, 2, 4, 3, 'M'); q.set(5, 5, '_');                                   // the mouth of the Pangyuan cave
  q.scatter('m', 0.05, 582, 'P'); q.scatter('b', 0.08, 583, 'P');
  WM.defMap('qingxi', { name: 'The Hills behind Qingxi', theme: 'summer', music: 'dungeon', rows: q.rows(), spawn: [16, 26], battleBg: 'forest',
    exits: [WM.toWorld('qingxi', 15, 27, 3, 1)] });

  // ---------------- the Liuhe Temple ----------------
  var t = L.grid(34, 28, '.');
  for (y = 18; y < 28; y++) for (x = 0; x < 34; x++) t.set(x, y, y < 20 ? '~' : 'w');   // the Qiantang River, where the tide comes in
  t.scatter('r', 0.15, 584, '~', [0, 18, 34, 2]);
  t.frame(5, 2, 24, 14, 'R'); t.rect(15, 15, 4, 1, 'G'); t.rect(15, 16, 4, 2, ':');
  var hall = t.house(8, 3, 12, 6, { roof: 'v', wall: 'R', door: 6 });
  t.rect(22, 4, 4, 6, 'M'); t.set(23, 9, 'U'); t.set(24, 9, 'U');                      // the Liuhe Pagoda
  t.vline(hall.x, 9, 14, '='); t.rect(15, 12, 4, 3, '=');
  t.scatter('T', 0.08, 585, '.', [0, 0, 34, 2]); t.scatter('T', 0.06, 586, '.', [0, 2, 5, 16]); t.scatter('T', 0.06, 587, '.', [29, 2, 5, 16]);
  WM.defMap('liuhe', { name: 'The Liuhe Temple', theme: 'autumn', music: 'sad', rows: t.rows(), spawn: [16, 17], battleBg: 'palace',
    exits: [WM.toWorld('liuhe', 15, 17, 4, 1)] });
  var ti = L.grid(16, 10, 'x'); var tR = ti.room(1, 1, 14, 9, { floor: 'N' });
  ti.stamp(2, 3, ['L...111...L.', '....222.....', '...4.3.4....', 'k..........k']);   // the Buddha hall of the Liuhe Temple
  WM.defMap('liuhe_in', { name: 'The Liuhe Temple', interior: true, theme: 'autumn', music: 'sad', rows: ti.rows(), spawn: [8, 8] });
  L.link({ map: 'liuhe', x: hall.x, y: hall.y }, { map: 'liuhe_in', x: tR.x, y: tR.y });
})();
