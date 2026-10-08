// Maps for chapters 22–23: an army camp in the field (used for the campaigns against Tian Hu, Wang Qing and Fang La),
// with the commander's tent, banners, and a river crossing.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var c = L.grid(40, 28, '.');
  for (var y = 0; y < 28; y++) for (var x = 32; x < 40; x++) c.set(x, y, x < 34 ? '~' : 'w');
  c.scatter('r', 0.25, 571, '~', [32, 0, 2, 28]); c.set(33, 12, 'o'); c.set(33, 15, 'o');
  c.frame(4, 3, 26, 20, 'F'); c.rect(15, 22, 4, 1, '.'); c.rect(29, 12, 1, 3, '.');
  c.rect(12, 6, 10, 5, '.'); c.set(14, 6, 'V'); c.set(17, 6, 'V'); c.set(20, 6, 'V'); c.rect(15, 7, 4, 2, 'V');   // the commander's pavilion
  c.set(13, 10, 'Y'); c.set(21, 10, 'Y');
  [[6, 13], [9, 13], [24, 13], [27, 13], [6, 18], [9, 18], [24, 18], [27, 18]].forEach(function (p) { c.set(p[0], p[1], 'V'); });
  c.rect(16, 11, 2, 11, ':'); c.rect(18, 13, 11, 2, ':');
  c.scatter('T', 0.06, 572, '.', [0, 0, 32, 3]); c.scatter('T', 0.06, 573, '.', [0, 23, 32, 5]);
  WM.defMap('armycamp', { name: 'Song Jiang\'s Camp', theme: 'autumn', music: 'tense', rows: c.rows(), spawn: [16, 20], battleBg: 'field' });
})();
