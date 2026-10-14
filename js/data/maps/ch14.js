// Maps for chapter 14: Qingzhou — Prefect Murong's walled city, and the hills west of it where the three mountains
// fight Huyan Zhuo and where Wu Yong digs the pit that takes him.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var q = L.grid(60, 40, '.');
  // the hills and fields to the west
  q.rect(0, 0, 24, 40, '.'); q.scatter('m', 0.05, 521, '.', [0, 0, 22, 40]); q.scatter('T', 0.07, 522, '.', [0, 0, 22, 40]);
  q.rect(4, 4, 10, 8, '.'); q.rect(7, 6, 4, 3, ','); q.set(9, 5, 'Y');        // the low hill where Song Jiang shows himself
  q.rect(6, 12, 6, 2, '.');                                                   // and the slope below it, where the pit is dug
  q.rect(0, 19, 26, 2, ':'); q.vline(9, 12, 18, ':'); q.vline(10, 12, 18, ':');
  q.set(3, 22, 'V'); q.set(6, 23, 'V'); q.set(3, 26, 'V'); q.set(14, 24, 'Y');  // the three mountains' camp
  // the city
  q.frame(26, 2, 32, 34, '#'); q.rect(26, 19, 1, 2, 'G');
  q.rect(27, 19, 30, 2, '='); q.rect(40, 3, 3, 32, '=');
  var yamen = q.house(29, 4, 10, 6, { roof: 'Z', wall: 'R', door: 5 }); q.vline(yamen.x, 10, 18, '=');
  var jail = q.house(45, 4, 10, 6, { roof: 'v', wall: '#', door: 5 }); q.vline(jail.x, 10, 18, '=');
  q.house(29, 23, 8, 5, { roof: '^', door: false, windows: [2, 5] }); q.house(45, 23, 9, 5, { roof: 'z', door: false, windows: [2, 6] });
  q.house(29, 29, 8, 5, { roof: 'z', door: false, windows: [3] }); q.house(45, 29, 9, 5, { roof: '^', door: false, windows: [4] });
  q.scatter('T', 0.03, 523, '.', [27, 3, 30, 32]); L.clearAround(q, '=', 'T', '.'); L.clearAround(q, ':', 'Tm', '.');
  WM.defMap('qingzhou', { name: 'Qingzhou', theme: 'autumn', music: 'tense', rows: q.rows(), spawn: [1, 19], battleBg: 'field',
    exits: [WM.toWorld('qingzhou', 0, 19, 1, 2)] });
  var qi = L.grid(30, 10, 'x'); var qR = { yamen: qi.room(1, 1, 14, 9, { floor: 'K' }), jail: qi.room(16, 1, 12, 9, { floor: 'N' }) };
  qi.stamp(2, 3, ['h.EEEEEE..h.', '...q00q.....', '..taaaa..t..']);   // the prefect's hall
  qi.stamp(17, 3, ['F.FF.FF.FF', 'F..F..F..F', '..........']);
  WM.defMap('qingzhou_in', { name: '', interior: true, theme: 'autumn', music: 'tense', rows: qi.rows(), spawn: [8, 8] });
  L.link({ map: 'qingzhou', x: yamen.x, y: yamen.y }, { map: 'qingzhou_in', x: qR.yamen.x, y: qR.yamen.y });
  L.link({ map: 'qingzhou', x: jail.x, y: jail.y }, { map: 'qingzhou_in', x: qR.jail.x, y: qR.jail.y });
})();
