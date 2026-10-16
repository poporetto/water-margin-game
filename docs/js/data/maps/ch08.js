// Maps for chapter 8: Qingfeng Mountain (the bandit stronghold) and Qingfeng Fort.
'use strict';
(function () {
  var L = WM.mapLib;
  WM.data.locations.qingfengshan = { id: 'qingfengshan', name: 'Qingfeng Mountain', x: WM.worldPos('qingfengshan')[0], y: WM.worldPos('qingfengshan')[1], icon: 'mountain', map: 'qingfengshan', sx: 14, sy: 30 };

  // ---------------- Qingfeng Mountain ----------------
  var m = L.grid(30, 34, 'M');
  var pts = [[14, 33], [14, 27], [9, 22], [16, 17], [15, 12]];
  var walk = function (fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk(function (x, y) { m.rect(x - 3, y - 1, 7, 3, '.'); });
  walk(function (x, y) { m.set(x, y, ':'); m.set(x + 1, y, ':'); });
  m.rect(4, 2, 22, 11, '.'); m.frame(4, 2, 22, 11, 'F'); m.rect(14, 12, 3, 1, ':');
  var hall = m.house(8, 3, 14, 5, { roof: 'z', door: 7, windows: [2, 11] });
  m.set(6, 9, 'Y'); m.set(23, 9, 'Y'); m.set(9, 10, 'V'); m.set(20, 10, 'V'); m.rect(15, 8, 2, 4, ':');
  m.scatter('P', 0.2, 311, '.'); L.clearAround(m, ':', 'P', '.');
  WM.defMap('qingfengshan', { name: 'Qingfeng Mountain', theme: 'snow', music: 'dungeon', rows: m.rows(), spawn: [14, 32], battleBg: 'snow',
    exits: [WM.toWorld('qingfengshan', 12, 33, 6, 1)], encounters: { rate: 0.05, troops: [['wolf2', 'wolf2'], ['bear'], ['roadbandit', 'roadarcher']], cond: function (S2) { return !S2.has('ch8_bandits'); } } });
  var mi = L.grid(18, 11, 'x'); var mR = mi.room(1, 1, 16, 9, { floor: 'n' });
  mi.stamp(2, 3, ['h..L....L..h..', '..............', '..t..KKKK..t..', '..............', 'j............j']);
  WM.defMap('qingfengshan_in', { name: 'Qingfeng Stronghold', interior: true, theme: 'snow', music: 'dungeon', rows: mi.rows(), spawn: [9, 8] });
  L.link({ map: 'qingfengshan', x: hall.x, y: hall.y }, { map: 'qingfengshan_in', x: mR.x, y: mR.y });

  // ---------------- Qingfeng Fort ----------------
  var g = L.grid(42, 30, '.');
  g.border('#', 1, [{ side: 's', from: 19, to: 22 }]);
  g.rect(19, 29, 4, 1, 'G');
  g.rect(19, 1, 4, 28, '='); g.rect(1, 13, 40, 2, '=');
  var hua = g.house(4, 3, 11, 6, { roof: '^', wall: 'W', door: 5, windows: [1, 3, 7, 9] });   // Hua Rong (military)
  var liu = g.house(27, 3, 11, 6, { roof: 'v', wall: 'R', door: 5, windows: [2, 8] });        // Liu Gao (civil)
  g.vline(hua.x, hua.y + 1, 12, ':'); g.vline(liu.x, liu.y + 1, 12, ':');
  for (var x = 3; x < 40; x += 4) { g.set(x, 12, 'L'); g.set(x + 1, 16, 'L'); }               // the Lantern Festival
  g.house(4, 18, 6, 4, { roof: 'z', door: false, windows: [2] }); g.house(12, 18, 6, 4, { roof: 'z', door: false, windows: [3] });
  g.house(25, 18, 6, 4, { roof: '^', door: false, windows: [2] }); g.house(33, 18, 6, 4, { roof: 'z', door: false, windows: [3] });
  g.scatter('T', 0.05, 321, '.', [1, 1, 40, 28]); g.scatter('f', 0.03, 322, '.', [1, 1, 40, 28]);
  L.clearAround(g, ':', 'T', '.'); L.clearAround(g, '=', 'T', '.');
  WM.defMap('qingfeng', { name: 'Qingfeng Fort', theme: 'snow', music: 'town', rows: g.rows(), spawn: [20, 28], battleBg: 'town', exits: [WM.toWorld('qingfeng', 19, 29, 4, 1)] });
  var gi = L.grid(34, 12, 'x');
  var gR = { hua: gi.room(1, 1, 15, 10, { floor: 'N' }), liu: gi.room(17, 1, 15, 10, { floor: 'N' }) };
  gi.stamp(2, 3, ['h..A......A.h', '.............', '..t..KKK.....', '.............', 'k...........k']);
  gi.stamp(18, 3, ['h...UU....h..', '....AA.......', '..t......t...', '.............', 'F.FFF.FFF.F..']);
  WM.defMap('qingfeng_in', { name: '', interior: true, theme: 'snow', music: 'town', rows: gi.rows(), spawn: [8, 9] });
  L.link({ map: 'qingfeng', x: hua.x, y: hua.y }, { map: 'qingfeng_in', x: gR.hua.x, y: gR.hua.y });
  L.link({ map: 'qingfeng', x: liu.x, y: liu.y }, { map: 'qingfeng_in', x: gR.liu.x, y: gR.liu.y });
  WM.data.qingfeng = { rooms: gR };
})();
