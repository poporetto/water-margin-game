// Maps for chapter 10: Huandao Village and the temple of the Mysterious Lady, her heavenly palace (a dream),
// and Yishui county with the Yi Ridge where Li Kui's mother died.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;

  // ---------------- Huandao Village ----------------
  var h = L.grid(32, 26, '.');
  h.border('T', 1, [{ side: 's', from: 14, to: 16 }, { side: 'w', from: 12, to: 14 }]);
  h.rect(14, 14, 3, 12, ':'); h.rect(0, 13, 18, 2, ':');
  h.rect(9, 2, 14, 11, '.'); h.frame(9, 2, 14, 11, 'R'); h.rect(14, 12, 3, 1, ':');
  var temple = h.house(11, 3, 10, 6, { roof: 'v', wall: 'R', door: 5 }); h.vline(16, 9, 11, ':');
  h.set(11, 10, 'L'); h.set(20, 10, 'L');
  h.house(3, 17, 6, 4, { roof: 'z', door: false, windows: [2] }); h.house(22, 17, 6, 4, { roof: 'z', door: false, windows: [3] });
  h.scatter('T', 0.14, 381, '.', [1, 1, 30, 24]); L.clearAround(h, ':', 'T', '.');
  WM.defMap('huandao', { name: 'Huandao Village', theme: 'dusk', music: 'tense', rows: h.rows(), spawn: [15, 24], battleBg: 'forest', tint: 'night',
    exits: [WM.toWorld('huandao', 14, 25, 3, 1), WM.toWorld('huandao', 0, 12, 1, 3)] });
  var hi = L.grid(14, 10, 'x'); var hR = hi.room(1, 1, 12, 9, { floor: 'N' });
  hi.stamp(2, 3, ['L..6666..L', '...8888...', '..........', 'j........j']);
  WM.defMap('huandao_in', { name: 'Temple of the Mysterious Lady', interior: true, theme: 'dusk', music: 'tense', rows: hi.rows(), spawn: [7, 8] });
  L.link({ map: 'huandao', x: temple.x, y: temple.y }, { map: 'huandao_in', x: hR.x, y: hR.y });

  // ---------------- the palace of the Mysterious Lady of the Ninth Heaven (dream) ----------------
  var p = L.grid(24, 22, '_');
  p.rect(4, 2, 16, 18, 'N');
  p.frame(4, 2, 16, 18, 'R');
  p.rect(10, 18, 4, 4, 'K'); p.rect(10, 3, 4, 15, 'K');
  p.set(7, 5, 'L'); p.set(16, 5, 'L'); p.set(7, 12, 'L'); p.set(16, 12, 'L');
  p.rect(9, 3, 6, 1, 'A');
  WM.defMap('xuannu', { name: 'Palace of the Ninth Heaven', interior: true, theme: 'snow', music: 'palace', rows: p.rows(), spawn: [11, 20], battleBg: 'palace' });

  // ---------------- Yishui: Li Kui's village and the Yi Ridge ----------------
  var y = L.grid(40, 34, 'P');
  y.rect(2, 20, 20, 13, '.');
  var home = y.house(4, 22, 6, 4, { roof: 'z', door: 3, windows: [1] });
  y.house(12, 22, 6, 4, { roof: 'z', door: false, windows: [2] });
  var cao = y.house(4, 28, 8, 4, { roof: '^', door: 4, windows: [1, 6] });
  y.rect(0, 26, 40, 2, ':'); y.vline(home.x, home.y + 1, 26, ':');
  // the ridge path north-east, the spring and the tigers' cave
  var pts = [[22, 26], [26, 20], [24, 14], [30, 9], [32, 4]];
  var walk = function (fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk(function (x, yy) { y.rect(x - 2, yy - 1, 5, 3, '.'); });
  walk(function (x, yy) { y.set(x, yy, ':'); });
  y.rect(26, 8, 8, 5, '.'); y.rect(29, 9, 2, 2, 'm');                     // the great rock where he set her down
  y.rect(14, 10, 4, 3, '~');                                                // the stream in the valley below
  y.rect(15, 13, 2, 1, '.'); y.hline(16, 25, 13, ':');
  y.rect(33, 2, 5, 4, 'M'); y.set(34, 5, '_'); y.set(35, 5, '_');            // the tigers' cave
  y.scatter('m', 0.03, 391, '.'); L.clearAround(y, ':', 'Pm', '.');
  WM.defMap('yishui', { name: 'Yishui — the Yi Ridge', theme: 'summer', music: 'field', rows: y.rows(), spawn: [1, 26], battleBg: 'forest',
    exits: [Object.assign(WM.toWorld('yishui', 0, 26, 1, 2), { cond: function (S2) { return !S2.has('ch10_carry') || S2.has('ch10_tigers'); }, blocked: '(Li Kui will not turn back now.)' })] });
  WM.defEvents('yishui', [L.save('yisave', 19, 28)]);
  var yi = L.grid(22, 9, 'x'); var yR = { home: yi.room(1, 1, 8, 7), cao: yi.room(10, 1, 11, 8, { floor: 'K' }) };
  yi.stamp(2, 3, ['k..j..', '......', '..t...']); yi.stamp(11, 3, ['h..A..h..', '.........', '..t...t..']);
  WM.defMap('yishui_in', { name: '', interior: true, theme: 'summer', music: 'field', rows: yi.rows(), spawn: [5, 6] });
  L.link({ map: 'yishui', x: home.x, y: home.y }, { map: 'yishui_in', x: yR.home.x, y: yR.home.y });
  L.link({ map: 'yishui', x: cao.x, y: cao.y }, { map: 'yishui_in', x: yR.cao.x, y: yR.cao.y });
})();
