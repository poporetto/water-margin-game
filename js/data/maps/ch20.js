// Maps for chapter 20: the Temple of the Eastern Peak at Mount Tai, with Ren Yuan's wrestling platform.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var t = L.grid(36, 30, 'P');
  t.rect(0, 0, 36, 4, 'M');
  t.rect(4, 4, 28, 26, '.'); t.frame(5, 5, 26, 14, 'R'); t.rect(16, 18, 4, 1, 'G');
  t.house(10, 6, 16, 5, { roof: 'v', wall: 'R', door: false }); t.set(9, 10, 'L'); t.set(26, 10, 'L');
  t.rect(12, 12, 12, 5, 'K');                                                    // the wrestling platform
  t.set(11, 12, 'Y'); t.set(24, 12, 'Y'); t.set(18, 11, 'I');
  t.rect(16, 19, 4, 11, ':');
  t.scatter('T', 0.05, 561, '.', [4, 19, 28, 11]); L.clearAround(t, ':', 'T', '.');
  WM.defMap('taishan', { name: 'Temple of the Eastern Peak, Mount Tai', theme: 'spring', music: 'palace', rows: t.rows(), spawn: [17, 28], battleBg: 'palace',
    exits: [WM.toWorld('taishan', 16, 29, 4, 1)] });
})();
