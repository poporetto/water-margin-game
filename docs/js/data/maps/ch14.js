// Maps for chapter 14: Qingzhou — Prefect Murong's walled city, and the hills west of it where the three mountains
// fight Huyan Zhuo and where Wu Yong digs the pit that takes him.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var q = L.grid(60, 40, '.');
  // the hills and fields to the west
  q.rect(0, 0, 24, 40, '.'); q.scatter('m', 0.05, 521, '.', [0, 0, 22, 40]); q.scatter('T', 0.07, 522, '.', [0, 0, 22, 40]);
  // the low hill where Song Jiang shows himself: a rocky knoll, its crown open, one path down its south face
  q.rect(3, 3, 13, 11, '.');
  for (var hy = 3; hy <= 10; hy++) for (var hx = 4; hx <= 14; hx++) { var e = Math.pow((hx - 9) / 5.5, 2) + Math.pow((hy - 6.5) / 4, 2); if (e > 0.62 && e <= 1.05 && !(hx >= 8 && hx <= 10 && hy >= 8)) q.set(hx, hy, 'M'); }
  q.rect(7, 5, 5, 3, ','); q.set(9, 4, 'Y');
  q.vline(9, 8, 18, ':'); q.vline(10, 8, 18, ':');
  q.rect(6, 12, 2, 3, ','); q.rect(12, 12, 2, 3, ',');   // brushwood either side of the path, where the hook-men hide
  q.rect(0, 19, 26, 2, ':'); q.vline(9, 12, 18, ':'); q.vline(10, 12, 18, ':');
  [[2, 23], [6, 23], [3, 27]].forEach(function (p) { q.rect(p[0], p[1] - 1, 3, 2, '.'); q.set(p[0], p[1], 'V'); }); q.set(14, 24, 'Y');  // the three mountains' camp (each tent on its own 3x2 of ground)
  // the city
  q.frame(26, 2, 32, 34, '#'); q.rect(26, 19, 1, 2, 'G');
  q.rect(27, 19, 30, 2, '='); q.rect(40, 3, 3, 32, '=');
  var yamen = q.house(29, 4, 10, 6, { roof: 'Z', wall: 'R', door: 5 }); q.rect(yamen.x - 1, 10, 2, 9, '=');   // (paved the width of the double door)
  var jail = q.house(45, 4, 10, 6, { roof: 'v', wall: '#', door: 5 }); q.vline(jail.x, 10, 18, '=');
  q.house(29, 23, 8, 5, { roof: '^', door: false, windows: [2, 5] }); q.house(45, 23, 9, 5, { roof: 'z', door: false, windows: [2, 6] });
  q.house(29, 29, 8, 5, { roof: 'z', door: false, windows: [3] }); q.house(45, 29, 9, 5, { roof: '^', door: false, windows: [4] });
  q.scatter('T', 0.03, 523, '.', [27, 3, 30, 32]); L.clearAround(q, '=', 'T', '.'); L.clearAround(q, ':', 'Tm', '.');
  // the pit under the path at the foot of the knoll: covered over with brush until Huyan Zhuo falls into it
  var qRows = q.rows(), qOpen = qRows.map(function (r, y) { return y === 13 ? r.slice(0, 9) + '__' + r.slice(11) : r; });
  var pitOpen = function () { return !!(WM.state && WM.state.flags && WM.state.flags.ch14_pitopen); };
  WM.defMap('qingzhou', { name: 'Qingzhou', theme: 'autumn', music: 'tense', cacheKey: function () { return pitOpen() ? 'pit' : 'shut'; }, rows: function () { return pitOpen() ? qOpen : qRows; }, spawn: [1, 19], battleBg: 'field',
    exits: [WM.toWorld('qingzhou', 0, 19, 1, 2)] });
  var qi = L.grid(30, 10, 'x'); var qR = { yamen: qi.room(1, 1, 14, 9, { floor: 'N' }), jail: qi.room(16, 1, 12, 9, { floor: 'N' }) };
  qi.stamp(2, 3, ['h.EEEEEE..h.', '...q00q.....', '..taaaa..t..', '...KKKK', '...KKKK']);   // the prefect's hall
  qi.stamp(17, 3, ['--.F--.F..', '--.F--.F..', 'F+FFF+FF..']);   // two cells, each with room to stand beside the pallet
  WM.defMap('qingzhou_in', { name: '', interior: true, theme: 'autumn', music: 'tense', rows: qi.rows(), spawn: [8, 8] });
  L.link({ map: 'qingzhou', x: yamen.x, y: yamen.y }, { map: 'qingzhou_in', x: qR.yamen.x, y: qR.yamen.y });
  L.link({ map: 'qingzhou', x: jail.x, y: jail.y }, { map: 'qingzhou_in', x: qR.jail.x, y: qR.jail.y });
})();
