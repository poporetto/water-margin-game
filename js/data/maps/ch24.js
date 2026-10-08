// Maps for chapter 24: the prefect's hall at Chuzhou, and Liaoerwa — a marsh of reeds and low hills south of Chuzhou
// that looked like Liangshan, where Song Jiang asked to be buried.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var c = L.grid(16, 11, 'x'); var cR = c.room(1, 1, 14, 9, { floor: 'K' });
  c.stamp(2, 3, ['h...UU....h.', '....AA......', '..t......t..', '............']);
  WM.defMap('chuzhou_in', { name: 'The Prefect\'s Hall, Chuzhou', interior: true, theme: 'autumn', music: 'sad', rows: c.rows(), spawn: [7, 8] });

  var l = L.grid(40, 30, 'w');
  l.scatter('r', 0.35, 591, 'w');
  l.rect(8, 6, 24, 18, '.'); l.scatter('r', 0.15, 592, '.', [8, 6, 24, 18]); l.scatter('m', 0.04, 593, '.', [8, 6, 24, 18]);
  l.rect(16, 9, 8, 6, '.'); l.set(19, 10, 'g'); l.set(20, 10, 'g'); l.set(21, 11, 'g'); l.set(18, 11, 'g');   // the graves
  l.set(17, 9, 'Q'); l.set(22, 9, 'T'); l.set(16, 12, 'T');
  l.rect(19, 15, 2, 9, ':'); l.rect(19, 24, 2, 6, 'B');
  WM.defMap('liaoerwa', { name: 'Liaoerwa', theme: 'autumn', music: 'sad', rows: l.rows(), spawn: [19, 22], battleBg: 'marsh',
    exits: [WM.toWorld('liaoerwa', 19, 29, 2, 1)] });
})();
