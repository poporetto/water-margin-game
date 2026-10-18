// Maps for Lu Zhishen's road (chapter 2): Yanmen, Mount Wutai, Peach Blossom Village, Waguan Monastery,
// and the Great Xiangguo Monastery's vegetable garden in Kaifeng.
'use strict';
(function () {
  var L = WM.mapLib;

  // ---------------- Yanmen County ----------------
  var y = L.grid(32, 24, '.');
  y.border('T', 1, [{ side: 's', from: 14, to: 16 }]);
  y.rect(14, 1, 3, 23, ':'); y.rect(1, 11, 30, 2, '=');
  var notice = { x: 12, y: 10 };
  y.set(12, 10, 'I'); y.set(18, 10, 'L');
  var yShop = y.house(2, 3, 7, 5, { roof: 'z', door: 3, windows: [1, 5] });
  var yInn = y.house(19, 3, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  var zhao = y.house(19, 14, 11, 6, { roof: '^', door: 5, windows: [1, 3, 7, 9] });
  y.frame(18, 13, 13, 9, 'F'); y.set(24, 21, ':'); y.vline(24, 20, 21, ':');
  y.house(2, 14, 6, 5, { roof: 'z', door: false, windows: [2] });
  y.house(9, 15, 4, 4, { roof: 'z', door: false });
  [yShop, yInn].forEach(function (d) { y.vline(d.x, d.y + 1, 10, ':'); });
  y.rect(24, 22, 1, 1, ':'); y.vline(24, 21, 22, ':'); y.hline(16, 24, 22, ':');
  y.scatter('T', 0.08, 51, '.', [1, 1, 30, 22]); y.scatter('f', 0.05, 52, '.', [1, 1, 30, 22]);
  L.clearAround(y, ':', 'T', '.'); L.clearAround(y, '=', 'T', '.');
  WM.defMap('yanmen', { name: 'Yanmen County', theme: 'autumn', music: 'town', rows: y.rows(), spawn: [15, 22], battleBg: 'town', exits: [WM.toWorld('yanmen', 14, 23, 3, 1)] });
  var yi = L.grid(40, 12, 'x');
  var yR = { shop: yi.room(1, 1, 8, 7), inn: yi.room(10, 1, 10, 7), zhao: yi.room(21, 1, 16, 10, { floor: 'n' }) };
  yi.stamp(2, 3, ['hhhh..', '......', 'ccc...']); yi.stamp(11, 3, ['...kk.kk', '...kk.kk', 'cccc....']);
  yi.stamp(22, 3, ['h..A....A..hkk', '............kk', '...t..........', '..............', 'j............j']);
  WM.defMap('yanmen_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: yi.rows(), spawn: [5, 6] });
  L.link({ map: 'yanmen', x: yShop.x, y: yShop.y }, { map: 'yanmen_in', x: yR.shop.x, y: yR.shop.y });
  L.link({ map: 'yanmen', x: yInn.x, y: yInn.y }, { map: 'yanmen_in', x: yR.inn.x, y: yR.inn.y });
  L.link({ map: 'yanmen', x: zhao.x, y: zhao.y }, { map: 'yanmen_in', x: yR.zhao.x, y: yR.zhao.y });
  WM.data.yanmen = { notice: notice, rooms: yR };
  WM.defEvents('yanmen_in', [
    L.shop('ymshop', 4, 4, 'weizhou', 'shopkeep', 'Yanmen is a frontier county, but we keep a decent stock.'),
    L.inn('yminn', 13, 4, 15), L.save('ymrec', 17, 6)
  ]);

  // ---------------- Wutai town at the foot of the mountain ----------------
  var t = L.grid(34, 26, '.');
  t.border('P', 1, [{ side: 's', from: 16, to: 17 }, { side: 'n', from: 16, to: 17 }]);
  t.rect(16, 0, 2, 26, ':');
  t.rect(1, 12, 32, 2, ':');
  var smith = t.house(3, 3, 8, 5, { roof: 'z', door: 3, windows: [6] });
  t.stamp(11, 6, ['j', 'j']);
  var tavern = t.house(22, 3, 9, 5, { roof: 'z', door: 4, windows: [1, 7] });
  var store = t.house(3, 16, 7, 5, { roof: 'z', door: 3, windows: [1] });
  var tinn = t.house(22, 16, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  [smith, tavern].forEach(function (d) { t.vline(d.x, d.y + 1, 11, ':'); });
  t.hline(2, 31, 22, ':'); t.vline(12, 14, 22, ':'); t.vline(20, 14, 22, ':');
  [store, tinn].forEach(function (d) { t.vline(d.x, d.y + 1, 22, ':'); });
  t.stamp(27, 9, ['j.u.J']);                       // a little tavern stall at the edge of town
  t.scatter('P', 0.1, 61, '.', [1, 1, 32, 24]); t.scatter('m', 0.03, 62, '.', [1, 1, 32, 24]);
  t.rect(26, 8, 7, 1, '.');                        // (room behind the stall's awning)
  L.clearAround(t, ':', 'Pm', '.');
  WM.defMap('wutai_town', { name: 'Town below Mount Wutai', theme: 'autumn', music: 'field', rows: t.rows(), spawn: [16, 24], battleBg: 'mountain', exits: [WM.toWorld('wutai', 16, 25, 2, 1)] });
  var ti = L.grid(44, 10, 'x');
  var tR = { smith: ti.room(1, 1, 10, 8), tavern: ti.room(12, 1, 12, 8), store: ti.room(25, 1, 8, 8), inn: ti.room(34, 1, 10, 8) };
  ti.stamp(2, 3, ['jj..hh..', '........', '.cccc...']); ti.stamp(13, 3, ['h...L....h', '..........', '.t..t..t..', 'cc........']);
  ti.stamp(26, 3, ['hhhh..', '......', 'ccc...']); ti.stamp(35, 3, ['...kk.kk', '...kk.kk', 'ccc.....']);
  WM.defMap('wutai_town_in', { name: '', interior: true, theme: 'autumn', music: 'field', rows: ti.rows(), spawn: [5, 6] });
  L.link({ map: 'wutai_town', x: smith.x, y: smith.y }, { map: 'wutai_town_in', x: tR.smith.x, y: tR.smith.y });
  L.link({ map: 'wutai_town', x: tavern.x, y: tavern.y }, { map: 'wutai_town_in', x: tR.tavern.x, y: tR.tavern.y });
  L.link({ map: 'wutai_town', x: store.x, y: store.y }, { map: 'wutai_town_in', x: tR.store.x, y: tR.store.y });
  L.link({ map: 'wutai_town', x: tinn.x, y: tinn.y }, { map: 'wutai_town_in', x: tR.inn.x, y: tR.inn.y });
  WM.data.wutaiTown = { rooms: tR };
  WM.defEvents('wutai_town_in', [
    L.shop('wtshop', 28, 4, 'wutai', 'shopkeep', 'Pilgrims come up the valley all year. We sell what they need.'),
    L.inn('wtinn', 37, 4, 12), L.save('wtrec', 41, 6)
  ]);

  // ---------------- Mount Wutai: the Manjusri Monastery ----------------
  var w = L.grid(36, 42, 'M');
  // path from the town up to the half-way pavilion and the mountain gate
  var path = [[17, 41], [17, 36], [12, 32], [12, 27], [17, 24], [17, 21]];
  function walk(fn) { for (var i = 0; i < path.length - 1; i++) { var a = path[i], b = path[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } }
  walk(function (x, yy) { w.rect(x - 3, yy - 1, 7, 3, '.'); });
  walk(function (x, yy) { w.set(x, yy, ':'); w.set(x + 1, yy, ':'); });
  w.scatter('P', 0.2, 71, '.'); L.clearAround(w, ':', 'Pm', '.');
  // half-way pavilion
  w.rect(8, 29, 4, 3, '.'); w.house(8, 29, 3, 3, { roof: 'v', wall: 'R', door: false, wallRows: 1 }); w.set(9, 31, '.'); w.rect(9, 32, 3, 1, '.'); w.set(11, 31, 'j');   // (no tree in front of the wine peddler, a wine jar beside his pavilion)
  // monastery terrace
  w.rect(3, 2, 30, 20, '.');
  w.frame(3, 2, 30, 20, 'R');
  // the mountain gate: a gate hall in the wall, the two guardian kings standing in its wings, facing out
  w.rect(16, 21, 4, 1, 'G'); w.set(15, 22, 'U'); w.set(20, 22, 'U');   // the lions stand in front, so the gate hall meets the wall on both sides
  w.rect(16, 15, 4, 6, '=');
  w.set(14, 20, 'L'); w.set(21, 20, 'L');
  var mainHall = w.house(11, 3, 14, 7, { roof: 'Z', wall: 'R', door: 7 });
  w.rect(17, 10, 2, 5, '=');
  var medHall = w.house(5, 11, 9, 5, { roof: 'v', wall: 'W', door: 4, windows: [1, 7] });
  var abbotH = w.house(23, 11, 8, 5, { roof: 'v', wall: 'W', door: 4, windows: [1, 6] });
  w.hline(8, 16, 16, ':'); w.hline(19, 28, 16, ':'); w.set(16, 16, '='); w.set(19, 16, '=');   // (the paving meets the side paths without a patch of pebbles between) w.set(8, 16, ':'); w.set(28, 16, ':');
  w.set(26, 5, 'L'); w.set(9, 5, 'L');
  w.stamp(4, 3, ['PP', 'P.']); w.stamp(30, 3, ['PP', '.P']); w.stamp(4, 18, ['f.P']); w.stamp(29, 18, ['P.f']);
  w.set(31, 8, 'p');
  WM.defMap('wutai', {
    name: 'Mount Wutai — Manjusri Monastery', theme: 'autumn', music: 'palace', rows: w.rows(), spawn: [17, 40], battleBg: 'temple',
    exits: [{ x: 16, y: 41, w: 3, h: 1, to: 'wutai_town', tx: 16, ty: 1, dir: 'down' }]
  });
  // town north gap leads up the mountain
  WM.data.maps.wutai_town.exits.push({ x: 16, y: 0, w: 2, h: 1, to: 'wutai', tx: 17, ty: 40, dir: 'up' });
  var wi = L.grid(46, 15, 'x');
  var wR = { med: wi.room(1, 1, 16, 10, { floor: 'N' }), abbot: wi.room(18, 1, 10, 8, { floor: 'N' }), main: wi.room(29, 1, 15, 13, { floor: 'n' }) };
  wi.stamp(2, 3, ['kkk..kkk..kkk.', 'kkk..kkk..kkk.', '..............', 'kkk..kkk..kkk.', 'kkk..kkk..kkk.'])   // the long meditation platforms the monks sleep on;
  wi.stamp(19, 3, ['h..A..h.', '........', '..t.....']);
  // the Hall of the Great Hero: the Manjusri triad on its altar, red columns, a carpet from the door to the altar
  wi.stamp(30, 3, ['hh.L.111.L.hh', '.....222.....', '.i..4...4..i.', '.....nnn.....', '.i...nnn...i.', '.....nnn.....', '.i...nnn...i.', '.....nnn.....', '.....nnn.....', '.....nnn.....']);
  WM.defMap('wutai_in', { name: '', interior: true, theme: 'autumn', music: 'palace', rows: wi.rows(), spawn: [9, 9] });
  L.link({ map: 'wutai', x: medHall.x, y: medHall.y }, { map: 'wutai_in', x: wR.med.x, y: wR.med.y });
  L.link({ map: 'wutai', x: abbotH.x, y: abbotH.y }, { map: 'wutai_in', x: wR.abbot.x, y: wR.abbot.y });
  L.link({ map: 'wutai', x: mainHall.x, y: mainHall.y }, { map: 'wutai_in', x: wR.main.x, y: wR.main.y });
  WM.data.wutai = { rooms: wR, medHall: medHall, abbotH: abbotH, mainHall: mainHall };

  // ---------------- Peach Blossom Village (Liu Taigong's manor) ----------------
  var p = L.grid(30, 26, '.');
  p.border('T', 1, [{ side: 's', from: 13, to: 15 }, { side: 'n', from: 24, to: 25 }]);
  p.rect(13, 14, 3, 12, ':'); p.rect(15, 14, 11, 1, ':'); p.rect(24, 1, 2, 14, ':');
  p.frame(3, 3, 18, 11, 'F'); p.rect(13, 13, 3, 1, ':');
  var liu = p.house(5, 4, 14, 6, { roof: '^', door: 9, windows: [2, 5, 11] });
  p.vline(14, 10, 12, ':');
  p.stamp(4, 11, ['f.f.', '.T..']); p.stamp(16, 11, ['..f.', 'f.T.']);
  p.house(2, 17, 6, 4, { roof: 'z', door: false, windows: [2] });
  p.house(18, 18, 6, 4, { roof: 'z', door: false, windows: [3] });
  p.rect(2, 22, 9, 3, 'y');
  p.scatter('f', 0.12, 81, '.', [1, 1, 28, 24]); p.scatter('T', 0.07, 82, '.', [1, 1, 28, 24]);
  L.clearAround(p, ':', 'T', '.');
  WM.defMap('peach', { name: 'Peach Blossom Village', theme: 'spring', music: 'field', rows: p.rows(), spawn: [14, 24], battleBg: 'plains', exits: [WM.toWorld('peach', 13, 25, 3, 1)] });
  var pi = L.grid(30, 12, 'x');
  var pR = { hall: pi.room(1, 1, 16, 10), bride: pi.room(18, 1, 9, 8) };
  pi.stamp(2, 3, ['h..A....A..h..', '..............', '.....KKKK.....', '.....KKKK....t', '..............', 'j............j']);
  pi.stamp(19, 3, ['k...h..', '.......', '..t....']);
  WM.defMap('peach_in', { name: '', interior: true, theme: 'spring', music: 'field', rows: pi.rows(), spawn: [9, 9] });
  L.link({ map: 'peach', x: liu.x, y: liu.y }, { map: 'peach_in', x: pR.hall.x, y: pR.hall.y });
  WM.data.peach = { rooms: pR };

  // ---------------- Waguan Monastery and the red pine forest ----------------
  var g = L.grid(34, 34, 'P');
  g.rect(2, 2, 30, 16, '.');
  g.frame(4, 3, 26, 14, 'R');
  // the gate: an opening in the wall, the width of the road
  g.rect(16, 16, 3, 1, ':');
  g.house(11, 4, 12, 5, { roof: 'v', wall: 'R', door: false });  // the great hall, roof falling in
  var kitchen = g.house(6, 11, 7, 4, { roof: 'z', door: 3 });   // (a step in from the monastery wall)
  var cuiRoom = g.house(21, 10, 7, 4, { roof: '^', door: 3, windows: [1, 5] });
  g.rect(16, 9, 3, 7, ':');
  g.scatter('e', 0.04, 91, '.', [5, 4, 24, 12]); g.scatter(',', 0.25, 92, '.', [5, 4, 24, 12]);
  // the red pine forest to the south
  g.rect(16, 17, 3, 17, ':');   // the road south, as wide as the gate
  g.rect(8, 22, 18, 6, '.'); g.scatter('P', 0.18, 93, '.', [8, 22, 18, 6]);
  g.rect(16, 17, 3, 17, ':');   // the road carries on through the clearing
  L.clearAround(g, ':', 'Pe', '.');
  WM.defMap('waguan', { name: 'Waguan Monastery', theme: 'autumn', music: 'dungeon', rows: g.rows(), spawn: [16, 32], battleBg: 'forest', exits: [WM.toWorld('waguan', 16, 33, 3, 1)],
    encounters: { rate: 0.05, troops: [['wolf', 'wolf'], ['boar'], ['bandit', 'bandit', 'banditArcher']], cond: function (S2) { return !S2.has('ch2_waguanwin'); } } });
  var gi = L.grid(20, 9, 'x');
  var gR = { kitchen: gi.room(1, 1, 8, 7), cui: gi.room(10, 1, 9, 7) };
  gi.stamp(2, 3, ['jj..j.', '......', '.t....']); gi.stamp(11, 3, ['k..h..j', '.......', '..t....']);
  WM.defMap('waguan_in', { name: '', interior: true, theme: 'autumn', music: 'dungeon', rows: gi.rows(), spawn: [5, 6] });
  L.link({ map: 'waguan', x: kitchen.x, y: kitchen.y }, { map: 'waguan_in', x: gR.kitchen.x, y: gR.kitchen.y });
  L.link({ map: 'waguan', x: cuiRoom.x, y: cuiRoom.y }, { map: 'waguan_in', x: gR.cui.x, y: gR.cui.y });
  WM.data.waguan = { rooms: gR };

  // ---------------- Great Xiangguo Monastery (Kaifeng) ----------------
  var x = L.grid(34, 28, '.');
  x.rect(0, 0, 34, 3, '=');                                   // the lane outside the north wall
  x.hline(0, 33, 3, 'R'); x.vline(0, 3, 27, 'R'); x.vline(33, 3, 27, 'R'); x.hline(0, 33, 27, 'R');
  x.set(16, 27, 'D'); x.set(17, 27, 'D');
  x.vline(16, 3, 26, 'R'); x.set(16, 21, '.'); x.set(16, 22, '.');   // wall between temple court and garden
  // temple court (west)
  var zhiqing = x.house(2, 5, 12, 6, { roof: 'Z', wall: 'R', door: 6 });
  x.rect(7, 11, 2, 15, '='); x.set(5, 14, 'L'); x.set(10, 14, 'L'); x.set(5, 20, 'L'); x.set(10, 20, 'L');
  x.rect(8, 21, 9, 2, ':'); x.rect(9, 25, 8, 1, ':'); x.vline(16, 25, 26, ':');
  // vegetable garden (east)
  x.rect(18, 6, 6, 4, 'y'); x.rect(25, 6, 6, 4, 'y'); x.rect(18, 12, 6, 4, 'y');
  x.rect(26, 13, 3, 2, 'C');                                  // the cesspit
  x.set(30, 5, 'l');                                         // the old willow, with the crows' nest
  var hut = x.house(24, 18, 7, 4, { roof: 'z', door: 3, windows: [1, 5] });
  x.rect(17, 22, 16, 1, ':'); x.vline(27, 22, 22, ':');
  x.vline(17, 10, 22, ':');
  x.scatter('f', 0.06, 101, '.', [17, 4, 16, 22]);
  WM.defMap('xiangguo', { name: 'Great Xiangguo Monastery', theme: 'spring', music: 'field', rows: x.rows(), spawn: [16, 25], battleBg: 'temple' });
  var d = WM.data.kaifengDoors.xiangguo;
  L.link({ map: 'kaifeng', x: d.x, y: d.y }, { map: 'xiangguo', x: 16, y: 27, w: 2, inside: { x: 16, y: 26, dir: 'up' } });
  var xi = L.grid(24, 10, 'x');
  var xR = { zhiqing: xi.room(1, 1, 12, 8, { floor: 'n' }), hut: xi.room(14, 1, 9, 7) };
  xi.stamp(2, 3, ['h..111...h', '...222....', '..........']);   // the Buddha hall xi.stamp(15, 3, ['k...j..', '.......', '..t....']);
  WM.defMap('xiangguo_in', { name: '', interior: true, theme: 'spring', music: 'field', rows: xi.rows(), spawn: [6, 7] });
  L.link({ map: 'xiangguo', x: zhiqing.x, y: zhiqing.y }, { map: 'xiangguo_in', x: xR.zhiqing.x, y: xR.zhiqing.y });
  L.link({ map: 'xiangguo', x: hut.x, y: hut.y }, { map: 'xiangguo_in', x: xR.hut.x, y: xR.hut.y });
  WM.data.xiangguo = { rooms: xR };
})();
