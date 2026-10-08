// Maps for chapter 17: the forest road and reed shore below Liangshan (Lu Junyi's gauntlet), a forest on the road to
// Shamen Island, the Yangtze crossing with Wang Dingliu's tavern, Jiankang (An Daoquan; Li Qiaonu's house), Withered
// Tree Mountain, and Lingzhou.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var walk = function (pts, fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };

  // ---------------- the road below Liangshan ----------------
  var r = L.grid(60, 24, 'T');
  var rp = [[0, 12], [10, 12], [16, 8], [24, 8], [30, 14], [38, 14], [44, 9], [50, 12], [59, 12]];
  walk(rp, function (x, y) { r.rect(x - 1, y - 1, 3, 3, '.'); });
  walk(rp, function (x, y) { r.set(x, y, ':'); });
  r.rect(34, 2, 8, 5, '.'); r.set(37, 3, 'Y'); r.set(36, 3, 'V'); r.set(38, 3, 'V'); r.vline(37, 7, 13, '.');   // the hill with the yellow banner
  for (var y = 0; y < 24; y++) for (var x = 52; x < 60; x++) if (r.get(x, y) !== ':' && r.get(x, y) !== '.') r.set(x, y, y % 3 ? 'r' : '~');
  r.rect(52, 10, 8, 5, '~'); r.rect(52, 11, 3, 3, '.'); r.set(55, 12, 'o');
  r.scatter('b', 0.06, 541, 'T');
  WM.defMap('lsroad', { name: 'Forest Road below Liangshan', theme: 'spring', music: 'tense', rows: r.rows(), spawn: [0, 12], battleBg: 'forest' });

  // ---------------- a forest on the road to Shamen Island ----------------
  var f = L.grid(30, 18, 'P');
  walk([[0, 9], [10, 8], [18, 10], [29, 9]], function (x, y) { f.rect(x - 1, y - 1, 3, 3, '.'); });
  f.rect(12, 6, 6, 6, '.'); f.set(14, 7, 'T'); f.set(16, 10, 'T');
  WM.defMap('shamenroad', { name: 'Pine Forest', theme: 'autumn', music: 'tense', rows: f.rows(), spawn: [0, 9], battleBg: 'forest' });

  // ---------------- the Yangtze crossing ----------------
  var y2 = L.grid(40, 26, '.');
  for (y = 6; y < 20; y++) for (x = 0; x < 40; x++) y2.set(x, y, y < 8 || y > 17 ? '~' : 'w');
  y2.scatter('r', 0.2, 542, '~', [0, 6, 40, 2]); y2.scatter('r', 0.2, 543, '~', [0, 18, 40, 2]);
  y2.rect(18, 3, 3, 4, 'B'); y2.set(19, 8, 'o');
  var wtav = y2.house(4, 20, 8, 4, { roof: 'z', door: 4, windows: [1, 6] }); y2.set(12, 21, 'Y'); y2.hline(0, 39, 25, ':'); y2.vline(wtav.x, 24, 25, ':');
  y2.rect(0, 1, 40, 2, ':'); y2.vline(19, 3, 3, ':');
  y2.scatter('T', 0.08, 544, '.', [0, 0, 40, 6]); y2.scatter('T', 0.05, 545, '.', [14, 20, 26, 5]); L.clearAround(y2, ':', 'T', '.');
  WM.defMap('yangtze', { name: 'The Yangtze, below Jiankang', theme: 'snow', music: 'snow', rows: y2.rows(), spawn: [1, 1], battleBg: 'river', weather: 'snow' });
  var yi = L.grid(12, 8, 'x'); var yR = yi.room(1, 1, 10, 7);
  yi.stamp(2, 3, ['h..j..k.', '.t..t...', 'cc......']);
  WM.defMap('yangtze_in', { name: 'Wang Dingliu\'s Tavern', interior: true, theme: 'snow', music: 'inn', rows: yi.rows(), spawn: [6, 6] });
  L.link({ map: 'yangtze', x: wtav.x, y: wtav.y }, { map: 'yangtze_in', x: yR.x, y: yR.y });

  // ---------------- Jiankang ----------------
  var j = L.grid(40, 30, '.');
  j.border('#', 1, [{ side: 'n', from: 18, to: 21 }]); j.rect(18, 0, 4, 1, 'G');
  j.rect(18, 1, 4, 28, '='); j.rect(1, 14, 38, 2, '=');
  var an = j.house(4, 4, 10, 5, { roof: '^', door: 4, windows: [1, 8] }); j.set(14, 6, 'I');                 // An Daoquan's clinic
  var li = j.house(24, 4, 11, 5, { roof: '^', door: 5, windows: [1, 3, 7, 9], windowsUpper: [2, 8] }); j.set(23, 5, 'L'); j.set(35, 5, 'L');   // Li Qiaonu's house
  j.house(4, 18, 9, 5, { roof: 'z', door: false, windows: [2, 6] }); j.house(25, 18, 9, 5, { roof: '^', door: false, windows: [2, 6] });
  [an, li].forEach(function (d) { j.vline(d.x, d.y + 1, 13, ':'); });
  j.scatter('T', 0.05, 546, '.', [1, 1, 38, 27]); L.clearAround(j, ':', 'T', '.'); L.clearAround(j, '=', 'T', '.');
  WM.defMap('jiankang', { name: 'Jiankang', theme: 'snow', music: 'town', rows: j.rows(), spawn: [19, 1], battleBg: 'town', weather: 'snow' });
  var ji = L.grid(30, 10, 'x'); var jR = { an: ji.room(1, 1, 12, 8), li: ji.room(14, 1, 14, 9, { floor: 'K' }) };
  ji.stamp(2, 3, ['hhhh..k...', '..........', '..t.......']);
  ji.stamp(15, 3, ['k..h....L...', '............', '..t...t.....', '............']);
  WM.defMap('jiankang_in', { name: '', interior: true, theme: 'snow', music: 'town', rows: ji.rows(), spawn: [6, 6] });
  L.link({ map: 'jiankang', x: an.x, y: an.y }, { map: 'jiankang_in', x: jR.an.x, y: jR.an.y });
  L.link({ map: 'jiankang', x: li.x, y: li.y }, { map: 'jiankang_in', x: jR.li.x, y: jR.li.y });
  WM.data.jiankang = { rooms: jR };

  // ---------------- Withered Tree Mountain ----------------
  var k = L.grid(30, 26, 'P');
  walk([[0, 18], [8, 18], [12, 13], [18, 10], [22, 5]], function (x, y0) { k.rect(x - 1, y0 - 1, 3, 3, '.'); });
  k.scatter('e', 0.25, 547, 'P'); k.rect(18, 2, 8, 6, '.'); k.set(20, 3, 'V'); k.set(23, 3, 'V'); k.set(21, 4, 'Y');
  WM.defMap('kushu', { name: 'Withered Tree Mountain', theme: 'autumn', music: 'dungeon', rows: k.rows(), spawn: [0, 18], battleBg: 'forest' });

  // ---------------- Lingzhou ----------------
  var g = L.grid(48, 30, '.');
  g.frame(26, 2, 20, 24, '#'); g.rect(26, 13, 1, 3, 'G'); g.rect(27, 13, 18, 3, '=');
  g.house(29, 4, 14, 6, { roof: 'Z', wall: 'R', door: false }); g.house(29, 18, 6, 4, { roof: 'z', door: false }); g.house(37, 18, 6, 4, { roof: 'z', door: false });
  g.rect(0, 13, 26, 3, ':'); g.set(6, 10, 'V'); g.set(10, 10, 'V'); g.set(8, 9, 'Y');
  g.scatter('T', 0.07, 548, '.', [0, 0, 24, 30]); L.clearAround(g, ':', 'T', '.');
  WM.defMap('lingzhou', { name: 'Lingzhou', theme: 'autumn', music: 'tense', rows: g.rows(), spawn: [1, 14], battleBg: 'field',
    exits: [WM.toWorld('lingzhou', 0, 13, 1, 3)] });
})();
