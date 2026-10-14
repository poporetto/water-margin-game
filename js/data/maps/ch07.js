// Maps for Wu Song (chapter 7): Jingyang Ridge, Yanggu county, Cross Slope, Mengzhou and the Happy Forest,
// Flying Cloud Pond, Centipede Ridge, and the Kong family manor at White Tiger Mountain.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  WM.data.locations.kongmanor = { id: 'kongmanor', name: 'Kong Family Manor', x: 130, y: 38, icon: 'manor', map: 'kongmanor', sx: 14, sy: 20 };

  // ---------------- Jingyang Ridge ----------------
  var j = L.grid(30, 44, 'P');
  var jp = [[14, 43], [14, 38], [9, 33], [12, 26], [20, 20], [17, 13], [14, 6], [14, 0]];
  var walk = function (fn) { for (var i = 0; i < jp.length - 1; i++) { var a = jp[i], b = jp[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } };
  walk(function (x, y) { j.rect(x - 3, y - 1, 7, 3, '.'); });
  walk(function (x, y) { j.set(x, y, ':'); j.set(x + 1, y, ':'); });
  // the tavern at the foot: "three bowls and you can't cross the ridge"
  j.rect(4, 37, 22, 7, '.');
  var tav = j.house(5, 37, 7, 4, { roof: 'z', door: 3, windows: [1, 5] }); j.set(12, 38, 'J'); j.set(13, 39, 'I');
  j.hline(8, 14, 41, ':');
  // the temple of the Mountain God halfway up, with the notice about the tiger
  j.rect(20, 23, 6, 5, '.'); var tmp = j.house(21, 22, 4, 3, { roof: 'v', wall: 'R', door: false, wallRows: 1 }); j.set(23, 25, 'I');
  // the great flat rock where Wu Song lay down — and the tiger came
  j.rect(10, 9, 9, 7, '.'); j.rect(13, 11, 3, 2, 'm');
  j.scatter('m', 0.04, 241, '.'); L.clearAround(j, ':', 'Pm', '.');
  j.set(13, 11, 'm'); j.set(14, 11, 'm');
  WM.defMap('jingyang', { name: 'Jingyang Ridge', theme: 'autumn', music: 'dungeon', rows: j.rows(), spawn: [14, 42], battleBg: 'forest', tint: 'dusk',
    exits: [WM.toWorld('jingyang', 13, 43, 3, 1), { x: 13, y: 0, w: 3, h: 1, to: 'yanggu', tx: 21, ty: 31, dir: 'up' }] });
  var ji = L.grid(12, 8, 'x');
  var jR = ji.room(1, 1, 10, 7);
  ji.stamp(2, 3, ['h..L...h', '.t..t...', 'cc......']);
  WM.defMap('jingyang_in', { name: 'Ridge Tavern', interior: true, theme: 'autumn', music: 'field', rows: ji.rows(), spawn: [6, 6] });
  L.link({ map: 'jingyang', x: tav.x, y: tav.y }, { map: 'jingyang_in', x: jR.x, y: jR.y });

  // ---------------- Yanggu county ----------------
  var y = L.grid(42, 34, '.');
  y.border('#', 1, [{ side: 's', from: 20, to: 22 }]);
  y.rect(20, 33, 3, 1, 'G');
  y.rect(20, 1, 3, 32, '='); y.rect(1, 15, 40, 2, '=');
  var office = y.house(14, 3, 14, 6, { roof: 'v', wall: 'R', door: 7 });
  var dalang = y.house(3, 18, 7, 5, { roof: '^', door: 3, windows: [1, 5], windowsUpper: [5] });   // Wu Dalang's house, the curtained window upstairs
  var wang = y.house(11, 18, 6, 5, { roof: '^', door: 3, windows: [1] });                           // Granny Wang's teashop next door
  var ximen = y.house(28, 18, 9, 5, { roof: '^', door: 4, windows: [1, 7] });                        // Ximen Qing's medicine shop
  var lion = y.house(28, 4, 11, 6, { roof: 'v', door: 5, windows: [1, 9], windowsUpper: [2, 8] });   // the Lion Bridge tavern
  y.rect(27, 11, 13, 2, '~'); y.rect(32, 11, 3, 2, 'B');                                             // the stream under the Lion Bridge
  var hejiu = y.house(3, 4, 7, 5, { roof: 'z', door: 3, windows: [1] });                             // He Jiu the coroner
  var inn = y.house(3, 26, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  [dalang, wang, ximen].forEach(function (d) { y.vline(d.x, d.y + 1, 24, ':'); }); y.hline(2, 40, 24, ':');
  y.vline(inn.x, inn.y + 1, 31, ':'); y.hline(2, 19, 31, ':');
  y.vline(lion.x, lion.y + 1, 10, ':'); y.vline(33, 13, 14, ':'); y.vline(hejiu.x, hejiu.y + 1, 14, ':');
  y.scatter('T', 0.06, 251, '.', [1, 1, 40, 32]); y.scatter('f', 0.04, 252, '.', [1, 1, 40, 32]);
  L.clearAround(y, ':', 'T', '.'); L.clearAround(y, '=', 'T', '.');
  WM.defMap('yanggu', { name: 'Yanggu County', theme: 'autumn', music: 'town', rows: y.rows(), spawn: [21, 31], battleBg: 'town',
    exits: [WM.toWorld('yanggu', 20, 33, 3, 1)] });
  var yi = L.grid(70, 12, 'x');
  var yR = { office: yi.room(1, 1, 12, 9, { floor: 'N' }), dalang: yi.room(14, 1, 10, 9), wang: yi.room(25, 1, 8, 8), ximen: yi.room(34, 1, 10, 8), lion: yi.room(45, 1, 14, 10), hejiu: yi.room(60, 1, 8, 8) };
  yi.stamp(2, 3, ['hEEEEEEh.', '..q00q...', '..aaaa...']);   // the county hall
  yi.stamp(15, 3, ['k...j...', '........', '..t..ttt', '........']);
  yi.stamp(26, 3, ['h..j..', '.t..t.', 'cc....']);
  yi.stamp(35, 3, ['hhhhhh..', '........', 'cccc....']);
  yi.stamp(46, 3, ['h..L....L..h', '.t..t..t..t.', '............', '.t..t..t..t.']);
  yi.stamp(61, 3, ['k..j..', '......', '..t...']);
  WM.defMap('yanggu_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: yi.rows(), spawn: [6, 8] });
  [[office, yR.office], [dalang, yR.dalang], [wang, yR.wang], [ximen, yR.ximen], [lion, yR.lion], [hejiu, yR.hejiu]].forEach(function (p) { L.link({ map: 'yanggu', x: p[0].x, y: p[0].y }, { map: 'yanggu_in', x: p[1].x, y: p[1].y }); });
  WM.data.yanggu = { rooms: yR, doors: { office: office, dalang: dalang, wang: wang, ximen: ximen, lion: lion, hejiu: hejiu, inn: inn } };

  // ---------------- Cross Slope ----------------
  var c = L.grid(28, 20, '.');
  c.border('T', 1, [{ side: 's', from: 12, to: 14 }]);
  c.rect(12, 12, 3, 8, ':'); c.rect(1, 12, 26, 2, ':');
  var cs = c.house(8, 5, 12, 6, { roof: 'z', door: 5, windows: [2, 9] }); c.set(20, 6, 'J');
  c.vline(13, 11, 11, ':');
  c.stamp(3, 3, ['TT', 'T.', 'TT']); c.stamp(23, 3, ['TT', '.T', 'TT']);
  c.scatter('T', 0.12, 261, '.', [1, 1, 26, 18]); L.clearAround(c, ':', 'T', '.');
  WM.defMap('crossslope', { name: 'Cross Slope', theme: 'autumn', music: 'tense', rows: c.rows(), spawn: [13, 18], battleBg: 'plains', exits: [WM.toWorld('crossslope', 12, 19, 3, 1)] });
  var ci = L.grid(16, 9, 'x');
  var cR = ci.room(1, 1, 14, 8);
  ci.stamp(2, 3, ['h..j....j..h', '.t..t..t....', '..........cc', 'kk.......jjj']);
  WM.defMap('crossslope_in', { name: 'Cross Slope Inn', interior: true, theme: 'autumn', music: 'tense', rows: ci.rows(), spawn: [8, 7] });
  L.link({ map: 'crossslope', x: cs.x, y: cs.y }, { map: 'crossslope_in', x: cR.x, y: cR.y });

  // ---------------- Mengzhou: the Anping camp, the Happy Forest, Commander Zhang's residence ----------------
  var m = L.grid(56, 30, '.');
  m.border('#', 1, [{ side: 'w', from: 13, to: 15 }, { side: 'e', from: 13, to: 15 }]);
  m.rect(0, 13, 56, 3, ':');
  // the camp (west)
  m.frame(2, 2, 14, 9, 'F'); m.set(8, 10, ':'); m.vline(8, 10, 12, ':');
  var camp = m.house(4, 3, 9, 5, { roof: 'v', wall: 'R', door: 4 });
  // Commander Zhang's residence, with the Mandarin Duck Tower (north-east)
  m.frame(36, 2, 18, 10, '#'); m.set(44, 11, 'G'); m.vline(44, 9, 12, ':');
  var zhang = m.house(38, 3, 14, 6, { roof: 'Z', wall: 'R', door: 6, windowsUpper: [2, 11] });
  m.set(37, 9, 'L'); m.set(52, 9, 'L');
  // the road of taverns to the Happy Forest (south, eastwards)
  var taverns = [];
  [[4, 19], [12, 19], [20, 19], [28, 19]].forEach(function (q, i) { m.house(q[0], q[1], 6, 4, { roof: 'z', door: false, windows: [2] }); m.set(q[0] + 6, q[1] + 1, 'J'); taverns.push([q[0] + 3, q[1] + 4]); });
  m.hline(1, 54, 24, ':'); taverns.forEach(function (t) { m.set(t[0], t[1], ':'); });
  m.rect(38, 17, 16, 10, 'T'); m.rect(40, 19, 12, 7, '.');
  var happy = m.house(42, 19, 8, 4, { roof: 'z', door: 4, windows: [1, 6] }); m.set(41, 19, 'J');
  m.vline(46, 23, 24, ':'); m.hline(38, 46, 24, ':');
  m.scatter('T', 0.05, 271, '.', [1, 1, 54, 28]); L.clearAround(m, ':', 'T', '.'); m.vline(44, 9, 10, ':');
  WM.defMap('mengzhou', { name: 'Mengzhou', theme: 'autumn', music: 'town', rows: m.rows(), spawn: [1, 14], battleBg: 'town',
    exits: [WM.toWorld('mengzhou', 0, 13, 1, 3), WM.toWorld('mengzhou', 55, 13, 1, 3)] });
  WM.data.mengzhouTaverns = taverns;
  var mi = L.grid(56, 12, 'x');
  var mR = { camp: mi.room(1, 1, 12, 8, { floor: 'N' }), zhang: mi.room(14, 1, 16, 10, { floor: 'K' }), tower: mi.room(31, 1, 12, 8, { floor: 'K' }), happy: mi.room(44, 1, 11, 8) };
  mi.stamp(2, 3, ['h...A....h', '..........', 'kk..kk..kk', 'kk..kk..kk']);
  mi.stamp(15, 3, ['h...L....L...h', '..............', '...t......t...', '...t......t...', 'j............j']);
  mi.stamp(32, 3, ['L..t..t...L', '...........', '.k.......k.']);
  mi.stamp(45, 3, ['h..L....h', '.t..t..t.', 'cccc.....']);
  WM.defMap('mengzhou_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: mi.rows(), spawn: [6, 7] });
  L.link({ map: 'mengzhou', x: camp.x, y: camp.y }, { map: 'mengzhou_in', x: mR.camp.x, y: mR.camp.y });
  L.link({ map: 'mengzhou', x: zhang.x, y: zhang.y }, { map: 'mengzhou_in', x: mR.zhang.x, y: mR.zhang.y });
  L.link({ map: 'mengzhou', x: happy.x, y: happy.y }, { map: 'mengzhou_in', x: mR.happy.x, y: mR.happy.y });
  WM.data.mengzhou = { rooms: mR, doors: { camp: camp, zhang: zhang, happy: happy } };

  // ---------------- Flying Cloud Pond ----------------
  var f = L.grid(32, 16, 'T');
  f.rect(0, 6, 32, 4, '.'); f.hline(0, 31, 7, ':'); f.hline(0, 31, 8, ':');
  f.rect(12, 2, 9, 4, '~'); f.rect(13, 10, 7, 4, '~'); f.rect(15, 7, 3, 2, 'B');
  f.scatter('r', 0.3, 281, '~');
  WM.defMap('feiyun', { name: 'Flying Cloud Pond', theme: 'autumn', music: 'tense', rows: f.rows(), spawn: [1, 7], battleBg: 'marsh', exits: [] });

  // ---------------- Centipede Ridge ----------------
  var w = L.grid(30, 24, 'M');
  w.rect(10, 4, 12, 18, '.'); w.rect(14, 18, 4, 6, ':'); w.vline(15, 8, 22, ':');
  var hut = w.house(11, 4, 9, 4, { roof: 'z', door: 4, windows: [1, 7] });
  w.scatter('P', 0.25, 291, '.'); L.clearAround(w, ':', 'P', '.');
  WM.defMap('centipede', { name: 'Centipede Ridge', theme: 'autumn', music: 'dungeon', rows: w.rows(), spawn: [15, 22], battleBg: 'mountain', tint: 'night', exits: [] });
  var wi = L.grid(12, 8, 'x'); var wR = wi.room(1, 1, 10, 7, { floor: 'N' }); wi.stamp(2, 3, ['hkkA....', '.kk.....', '..t.....']);
  WM.defMap('centipede_in', { name: 'Hermitage', interior: true, theme: 'autumn', music: 'dungeon', rows: wi.rows(), spawn: [6, 6] });
  L.link({ map: 'centipede', x: hut.x, y: hut.y }, { map: 'centipede_in', x: wR.x, y: wR.y });

  // ---------------- Kong family manor (White Tiger Mountain) ----------------
  var k = L.grid(32, 24, '.');
  k.border('T', 1, [{ side: 's', from: 14, to: 16 }]);
  k.rect(14, 12, 3, 12, ':'); k.rect(1, 18, 30, 2, '~'); k.rect(14, 18, 3, 2, 'B');
  k.frame(5, 2, 22, 10, 'F'); k.rect(14, 11, 3, 1, ':');
  var km = k.house(8, 3, 16, 6, { roof: '^', door: 7, windows: [2, 5, 10, 13] }); k.vline(15, 9, 11, ':');
  k.house(3, 13, 6, 4, { roof: 'z', door: false, windows: [2] }); k.set(9, 14, 'J');       // the village inn where Wu Song drank
  k.scatter('T', 0.08, 301, '.', [1, 1, 30, 22]); L.clearAround(k, ':', 'T', '.');
  WM.defMap('kongmanor', { name: 'Kong Family Manor', theme: 'snow', music: 'field', rows: k.rows(), spawn: [15, 22], battleBg: 'snow', exits: [WM.toWorld('kongmanor', 14, 23, 3, 1)] });
  var ki = L.grid(18, 11, 'x'); var kR = ki.room(1, 1, 16, 9, { floor: 'K' }); ki.stamp(2, 3, ['h..A......A.h.', '..............', '..t...KKK..t..', '..............', 'j............j']);
  WM.defMap('kongmanor_in', { name: 'Kong Family Hall', interior: true, theme: 'snow', music: 'field', rows: ki.rows(), spawn: [8, 8] });
  L.link({ map: 'kongmanor', x: km.x, y: km.y }, { map: 'kongmanor_in', x: kR.x, y: kR.y });
})();
