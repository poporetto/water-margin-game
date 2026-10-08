// Maps for Lin Chong's exile (chapter 3): Wild Boar Forest, Chai Jin's manor, Cangzhou and the fodder depot.
'use strict';
(function () {
  var L = WM.mapLib;

  // ---------------- Wild Boar Forest ----------------
  var b = L.grid(40, 26, 'T');
  var pts = [[0, 13], [8, 13], [14, 9], [22, 11], [28, 15], [34, 13], [39, 13]];
  for (var i = 0; i < pts.length - 1; i++) {
    var a = pts[i], c = pts[i + 1], n = Math.max(Math.abs(c[0] - a[0]), Math.abs(c[1] - a[1]));
    for (var k = 0; k <= n; k++) { var x = Math.round(a[0] + (c[0] - a[0]) * k / n), y = Math.round(a[1] + (c[1] - a[1]) * k / n); b.rect(x - 1, y - 1, 3, 3, '.'); b.set(x, y, ':'); }
  }
  b.rect(19, 8, 7, 6, '.'); b.set(22, 9, 'T');                 // the clearing with the great tree
  b.scatter(',', 0.3, 111, '.'); b.scatter('P', 0.05, 112, '.');
  L.clearAround(b, ':', 'P', '.');
  WM.defMap('boarforest', { name: 'Wild Boar Forest', theme: 'autumn', music: 'tense', rows: b.rows(), spawn: [1, 13], battleBg: 'forest', tint: 'dusk',
    exits: [WM.toWorld('boarforest', 0, 12, 1, 3), WM.toWorld('boarforest', 39, 12, 1, 3)],
    encounters: { rate: 0.06, troops: [['wolf', 'wolf'], ['boar', 'boar'], ['wolf2']], cond: function (S2) { return S2.has('ch3_saved'); } } });

  // ---------------- Chai Jin's manor ----------------
  var m = L.grid(36, 28, '.');
  m.border('T', 1, [{ side: 's', from: 16, to: 18 }]);
  m.frame(4, 3, 28, 20, '#');
  m.rect(16, 22, 3, 1, 'G');
  m.rect(16, 23, 3, 5, ':');
  var hall = m.house(10, 4, 16, 7, { roof: '^', door: 8, windows: [2, 5, 10, 13] });
  m.rect(14, 11, 8, 10, '=');                                  // the courtyard where Lin fights Hong
  m.set(13, 12, 'L'); m.set(22, 12, 'L'); m.set(13, 19, 'L'); m.set(22, 19, 'L');
  m.house(5, 13, 7, 5, { roof: '^', door: false, windows: [2, 5] });
  m.house(24, 13, 7, 5, { roof: '^', door: false, windows: [2, 5] });
  m.stamp(5, 19, ['f.T.f', 'T.f.T']); m.stamp(26, 19, ['f.T.f', 'T.f.T']);
  m.rect(5, 4, 4, 3, '~'); m.rect(27, 4, 4, 3, '~');
  m.scatter('T', 0.1, 121, '.', [1, 23, 34, 4]); L.clearAround(m, ':', 'T', '.');
  WM.defMap('chaimanor', { name: 'Chai Jin\'s Manor', theme: 'snow', music: 'palace', rows: m.rows(), spawn: [17, 26], battleBg: 'snow', exits: [WM.toWorld('chaimanor', 16, 27, 3, 1)] });
  var mi = L.grid(20, 12, 'x');
  var mR = mi.room(1, 1, 18, 10, { floor: 'K' });
  mi.stamp(2, 3, ['h..L......L..h..', '................', '..t..t....t..t..', '................', 'j..............j']);
  WM.defMap('chaimanor_in', { name: 'Chai Jin\'s Hall', interior: true, theme: 'snow', music: 'palace', rows: mi.rows(), spawn: [10, 9] });
  L.link({ map: 'chaimanor', x: hall.x, y: hall.y }, { map: 'chaimanor_in', x: mR.x, y: mR.y });

  // ---------------- Cangzhou: town and prison camp ----------------
  var g = L.grid(44, 32, '.');
  g.border('#', 1, [{ side: 's', from: 20, to: 23 }, { side: 'e', from: 14, to: 16 }]);
  g.rect(20, 31, 4, 1, 'G');
  g.rect(20, 1, 4, 30, ':'); g.rect(1, 14, 42, 3, ':');
  // prison camp (north-west), walled
  g.frame(2, 2, 16, 10, 'F'); g.set(10, 11, ':'); g.vline(10, 11, 13, ':');
  var camp = g.house(4, 3, 9, 5, { roof: 'v', wall: 'R', door: 4 });
  g.house(13, 3, 4, 4, { roof: 'z', door: false });
  g.stamp(4, 9, ['V.V.V']);
  // Celestial King Hall (north-east)
  var tw = g.house(28, 3, 9, 6, { roof: 'v', wall: 'R', door: 4 });
  g.set(27, 7, 'L'); g.set(37, 7, 'L');
  // Li Xiaoer's tavern and shops (south)
  var lix = g.house(3, 19, 9, 5, { roof: 'z', door: 4, windows: [1, 7] }); g.set(12, 19, 'Y');
  var shop = g.house(26, 19, 7, 5, { roof: 'z', door: 3, windows: [1, 5] });
  var inn = g.house(34, 19, 8, 5, { roof: '^', door: 4, windows: [1, 6] });
  g.hline(2, 41, 25, ':'); [lix, shop, inn].forEach(function (d) { g.vline(d.x, d.y + 1, 25, ':'); });
  g.vline(32, 9, 13, ':');
  g.scatter('T', 0.06, 131, '.', [1, 1, 42, 30]); g.scatter('f', 0.03, 132, '.', [1, 1, 42, 30]);
  L.clearAround(g, ':', 'T', '.');
  // Lin Chong is here in the snows of winter; Zhu Tong's exile (chapter 13) falls in the seventh month
  var summer = function () { return WM.S.has('ch12_done'); };
  WM.defMap('cangzhou', { name: 'Cangzhou', get theme() { return summer() ? 'summer' : 'snow'; }, get music() { return summer() ? 'town' : 'snow'; }, rows: g.rows(), spawn: [21, 29], get battleBg() { return summer() ? 'town' : 'snow'; },
    exits: [WM.toWorld('cangzhou', 20, 31, 4, 1), { x: 43, y: 14, w: 1, h: 3, to: 'fodder', tx: 1, ty: 12, dir: 'right' }] });
  var gi = L.grid(56, 12, 'x');
  var gR = { camp: gi.room(1, 1, 12, 8, { floor: 'N' }), tw: gi.room(14, 1, 10, 8, { floor: 'N' }), lix: gi.room(25, 1, 10, 8), shop: gi.room(36, 1, 8, 8), inn: gi.room(45, 1, 10, 8) };
  gi.stamp(2, 3, ['h...A....h', '..........', '..t..t....']);
  gi.stamp(15, 3, ['L.UUU.L.', '..AAA...', '........']);
  gi.stamp(26, 3, ['h..L...h', '........', '.t..t..t', 'cc......']);
  gi.stamp(37, 3, ['hhhh..', '......', 'ccc...']);
  gi.stamp(46, 3, ['k.k.k...', '........', 'ccc.....']);
  WM.defMap('cangzhou_in', { name: '', interior: true, get theme() { return summer() ? 'summer' : 'snow'; }, get music() { return summer() ? 'town' : 'snow'; }, rows: gi.rows(), spawn: [6, 7] });
  [[camp, gR.camp], [tw, gR.tw], [lix, gR.lix], [shop, gR.shop], [inn, gR.inn]].forEach(function (p) { L.link({ map: 'cangzhou', x: p[0].x, y: p[0].y }, { map: 'cangzhou_in', x: p[1].x, y: p[1].y }); });
  WM.data.cangzhou = { rooms: gR };
  WM.defEvents('cangzhou_in', [
    L.shop('czshop', 38, 4, 'cangzhou', 'shopkeep', 'Cold enough for you? Buy something warm.'),
    L.inn('czinn', 47, 4, 15), L.save('czrec', 52, 6)
  ]);

  // ---------------- the fodder depot and the Mountain God's temple ----------------
  var f = L.grid(36, 26, '.');
  f.border('P', 1, [{ side: 'w', from: 11, to: 13 }]);
  f.rect(0, 11, 10, 3, ':');
  f.frame(14, 4, 18, 16, 'F');
  f.set(14, 12, ':'); f.hline(10, 14, 12, ':');
  // haystacks (drawn as thatch blocks) and the old hut
  [[17, 6], [22, 6], [27, 6], [17, 14], [22, 14]].forEach(function (q) { f.rect(q[0], q[1], 3, 3, 'z'); });
  var hut = f.house(26, 13, 5, 4, { roof: 'z', door: 2 });
  // the Mountain God's temple, half a li east of the depot... here, in the trees to the north-west
  var temple = f.house(4, 3, 6, 4, { roof: 'v', wall: 'R', door: 3 });
  f.vline(7, 7, 10, ':');
  f.scatter('P', 0.12, 141, '.', [1, 1, 12, 22]); f.scatter('P', 0.08, 142, '.', [1, 20, 34, 5]);
  L.clearAround(f, ':', 'P', '.');
  WM.defMap('fodder', { name: 'Fodder Depot', theme: 'snow', music: 'snow', weather: 'snow', rows: f.rows(), spawn: [1, 12], battleBg: 'snow',
    exits: [{ x: 0, y: 11, w: 1, h: 3, to: 'cangzhou', tx: 42, ty: 15, dir: 'left' }] });
  var fi = L.grid(22, 10, 'x');
  var fR = { temple: fi.room(1, 1, 9, 7, { floor: 'N' }), hut: fi.room(11, 1, 9, 7) };
  fi.stamp(2, 3, ['..U..', '..A..']); fi.stamp(12, 3, ['k..j..', '......']);
  WM.defMap('fodder_in', { name: '', interior: true, theme: 'snow', music: 'snow', rows: fi.rows(), spawn: [5, 6] });
  L.link({ map: 'fodder', x: temple.x, y: temple.y }, { map: 'fodder_in', x: fR.temple.x, y: fR.temple.y });
  L.link({ map: 'fodder', x: hut.x, y: hut.y }, { map: 'fodder_in', x: fR.hut.x, y: fR.hut.y });
  WM.data.fodder = { rooms: fR, temple: temple, hut: hut };
})();
