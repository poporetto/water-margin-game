// Maps for chapter 18: Dongping (Prefect Cheng's hall, the prison, Li Ruilan's house, and the village where Dong Ping
// is tripped) and Dongchang with the river where Zhang Qing is taken.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- Dongping ----------------
  var d = L.grid(56, 36, '.');
  d.frame(24, 2, 30, 30, '#'); d.rect(24, 16, 1, 3, 'G');
  d.rect(25, 16, 28, 3, '='); d.rect(37, 3, 3, 28, '=');
  var hall = d.house(26, 4, 10, 6, { roof: 'Z', wall: 'R', door: 5 }); d.vline(hall.x, 10, 15, '=');
  var jail = d.house(42, 4, 10, 6, { roof: 'v', wall: '#', door: 5 }); d.vline(jail.x, 10, 15, '=');
  var rui = d.house(42, 22, 9, 5, { roof: '^', door: 4, windows: [1, 3, 6, 7], windowsUpper: [2, 6] }); d.set(41, 23, 'L'); d.set(51, 23, 'L');
  d.house(26, 22, 8, 5, { roof: 'z', door: false, windows: [2, 5] });
  // the village west of the city, with its narrow lanes
  d.rect(0, 16, 24, 3, ':');
  d.house(3, 8, 6, 4, { roof: 'z', door: false, windows: [2] }); d.house(12, 8, 6, 4, { roof: 'z', door: false, windows: [2] });
  d.house(3, 22, 6, 4, { roof: 'z', door: false, windows: [2] }); d.house(12, 22, 6, 4, { roof: 'z', door: false, windows: [3] });
  d.scatter('T', 0.06, 551, '.', [0, 0, 24, 36]); L.clearAround(d, ':', 'T', '.'); L.clearAround(d, '=', 'T', '.');
  WM.defMap('dongping', { name: 'Dongping', theme: 'spring', music: 'tense', rows: d.rows(), spawn: [1, 17], battleBg: 'town',
    exits: [WM.toWorld('dongping', 0, 16, 1, 3)] });
  var di = L.grid(44, 11, 'x'); var dR = { hall: di.room(1, 1, 14, 9, { floor: 'N' }), jail: di.room(16, 1, 12, 9, { floor: 'N' }), rui: di.room(29, 1, 13, 9, { floor: 'n' }) };
  di.stamp(2, 3, ['h.EEEEEE..h.', '...q00q.....', '..taaaa..t..', '...KKKK', '...KKKK']);   // the prefect's hall
  di.stamp(17, 3, ['-.F-.F-.F.', '..F..F..F.', 'F+FF+FF+F.']);
  di.stamp(30, 3, ['k..h...L..k', '...........', '..t........']);
  WM.defMap('dongping_in', { name: '', interior: true, theme: 'spring', music: 'tense', rows: di.rows(), spawn: [8, 8] });
  [[hall, dR.hall], [jail, dR.jail], [rui, dR.rui]].forEach(function (p) { L.link({ map: 'dongping', x: p[0].x, y: p[0].y }, { map: 'dongping_in', x: p[1].x, y: p[1].y }); });

  // ---------------- Dongchang ----------------
  var c = L.grid(52, 34, '.');
  for (var y = 24; y < 34; y++) for (var x = 0; x < 52; x++) c.set(x, y, y < 26 ? '~' : 'w');
  c.scatter('r', 0.25, 552, '~', [0, 24, 52, 2]); c.set(10, 27, 'o'); c.set(14, 28, 'o'); c.set(18, 27, 'o');
  c.frame(26, 2, 24, 20, '#'); c.rect(26, 11, 1, 3, 'G'); c.rect(27, 11, 22, 3, '=');
  c.house(29, 4, 12, 5, { roof: 'Z', wall: 'R', door: false }); c.house(30, 15, 7, 4, { roof: 'z', door: false }); c.house(40, 15, 7, 4, { roof: '^', door: false });
  c.rect(0, 11, 26, 3, ':'); c.rect(8, 14, 3, 10, ':');
  c.scatter('T', 0.07, 553, '.', [0, 0, 24, 22]); L.clearAround(c, ':', 'T', '.');
  WM.defMap('dongchang', { name: 'Dongchang', theme: 'spring', music: 'tense', rows: c.rows(), spawn: [1, 12], battleBg: 'field',
    exits: [WM.toWorld('dongchang', 0, 11, 1, 3)] });
})();
