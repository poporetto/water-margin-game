// Daming Prefecture, the Northern Capital: Liang Zhongshu's yamen, the drill ground, Lu Junyi's mansion,
// the prison, the Cuiyun Tower. Used in chapters 4 and 17.
'use strict';
(function () {
  var L = WM.mapLib;
  var g = L.grid(58, 46, '.');
  g.border('#', 2, [{ side: 's', from: 27, to: 30 }]);
  g.rect(27, 44, 4, 2, 'G');
  // avenues
  g.rect(27, 2, 4, 42, '=');
  g.rect(2, 22, 54, 3, '=');
  g.rect(2, 36, 54, 2, ':');
  // Liang Zhongshu's yamen (north centre)
  g.frame(17, 2, 24, 12, 'R');
  g.rect(18, 3, 22, 10, '=');
  var yamen = g.house(20, 3, 18, 6, { roof: 'Z', wall: 'R', door: 9 });
  g.rect(27, 13, 4, 1, 'G');
  g.set(22, 11, 'L'); g.set(35, 11, 'L'); g.set(19, 4, 'P'); g.set(38, 4, 'P');
  // drill ground (north-east)
  g.frame(43, 3, 13, 16, 'F'); g.rect(44, 4, 11, 14, '=');
  g.house(46, 4, 7, 3, { roof: 'v', wall: 'R', door: false, wallRows: 1 });   // reviewing stand
  g.set(44, 9, 'j'); g.set(54, 9, 'j'); g.set(44, 14, 'j'); g.set(54, 14, 'j'); g.set(47, 17, 'Y'); g.set(51, 17, 'Y');   // a banner either side of the entrance
  g.rect(48, 18, 3, 4, ':');   // the entrance, three wide, in the middle of the south fence, and its path down to the street
  // Lu Junyi's mansion (north-west)
  g.frame(3, 3, 13, 14, '#');
  var lu = g.house(4, 4, 11, 6, { roof: '^', door: 5, windows: [1, 3, 7, 9] });
  g.rect(8, 10, 3, 6, ':'); g.rect(8, 16, 3, 1, 'G'); g.vline(9, 17, 21, ':');
  g.stamp(4, 11, ['f.T', 'T.f', 'f..']); g.stamp(12, 11, ['T.f', 'f.T', '..f']);
  // market street (south of the cross avenue)
  var inn = g.house(4, 26, 9, 5, { roof: '^', door: 4, windows: [1, 7] });
  var shop = g.house(14, 26, 7, 5, { roof: 'z', door: 3, windows: [1, 5] });
  var smith = g.house(33, 26, 6, 5, { roof: 'z', door: 2, windows: [4] });
  var tal = g.house(40, 26, 6, 5, { roof: 'v', wall: 'R', door: 3 });
  // the Cuiyun Tower
  var tower = g.house(47, 25, 9, 8, { roof: 'v', door: 4, windows: [1, 7], windowsUpper: [2, 6] });
  g.set(46, 29, 'L');   // (none on the right: that side of the tower is the city wall)
  [inn, shop, smith, tal, tower].forEach(function (d) { g.vline(d.x, d.y + 1, 35, ':'); });
  // the prison (south-west)
  var prison = g.house(4, 38, 11, 5, { roof: 'v', wall: '#', door: 5 });
  g.hline(3, 15, 43, ':'); g.vline(3, 38, 43, ':');
  // execution ground (cross street)
  g.rect(20, 39, 6, 4, '=');
  g.set(20, 39, 'Y');
  // houses
  g.house(34, 39, 6, 4, { roof: 'z', door: false, windows: [2] });
  g.house(44, 39, 6, 4, { roof: '^', door: false, windows: [1, 4] });
  for (var y = 15; y < 44; y += 5) { if (y >= 21 && y <= 25) continue; g.set(26, y, 'L'); g.set(31, y, 'L'); }
  g.scatter('T', 0.08, 171, '.', [2, 2, 54, 42]); g.scatter('f', 0.04, 172, '.', [2, 2, 54, 42]);
  L.clearAround(g, ':', 'T', '.'); L.clearAround(g, '=', 'T', '.');
  g.set(25, 42, 'I');
  WM.defMap('daming', { name: 'Daming Prefecture', theme: 'autumn', music: 'town', rows: g.rows(), spawn: [28, 42], battleBg: 'town',
    exits: [WM.toWorld('daming', 27, 45, 4, 1)] });
  WM.data.damingDoors = { yamen: yamen, lu: lu, inn: inn, shop: shop, smith: smith, tal: tal, tower: tower, prison: prison };

  var I = L.grid(74, 24, 'x');
  var R = {};
  R.yamen = I.room(1, 1, 22, 12, { floor: 'N' });
  I.stamp(2, 3, ['h...L..EEEEEE..L...h', '........q00q........', '........aaaa........', '..t.....KKKK.....t..', '........KKKK........', '....................', '....................', 'j..................j']);
  R.lu = I.room(24, 1, 16, 10, { floor: 'N' });
  I.stamp(25, 3, ['h..A......A.kk', '............kk', '..t...KKK.....', '.....KKKK.....', '..............']);
  R.inn = I.room(41, 1, 12, 8); I.stamp(42, 3, ['.....kk.kk', '.....kk.kk', 'cccc......']);
  R.shop = I.room(54, 1, 9, 8); I.stamp(55, 3, ['hhhhh..', '.......', 'ccc....']);
  R.smith = I.room(64, 1, 9, 8); I.stamp(65, 3, ['jj..jj.', '.......', '.cccc..']);
  R.tal = I.room(41, 10, 9, 8, { floor: 'N' }); I.stamp(42, 12, ['h.A.h..', '.......', '.ccc...']);
  R.tower = I.room(51, 10, 14, 10); I.stamp(52, 12, ['h..L....L...', '.t..t..t..t.', '............', '.t..t..t..t.', 'cccc........']);
  R.prison = I.room(1, 14, 18, 9, { floor: 'N' }); I.stamp(2, 16, ['--..F--..F--..F.', '--..F--..F--..F.', 'F+FFFF+FFFF+FFF.']);
  WM.defMap('daming_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: I.rows(), spawn: [12, 11] });
  var D = WM.data.damingDoors;
  Object.keys(R).forEach(function (k) { L.link({ map: 'daming', x: D[k].x, y: D[k].y }, { map: 'daming_in', x: R[k].x, y: R[k].y }); });
  WM.data.damingRooms = R;

  WM.defEvents('daming_in', [
    L.inn('dminn', 44, 4, 25), L.save('dmrec', 50, 6),
    L.shop('dmshop', 56, 4, 'daming', 'shopkeep', 'The Northern Capital has everything, if you have the silver.'),
    L.smith('dmsmith', 67, 4, 10),
    L.talis('dmtal', 44, 13, 'daming_t')
  ]);
  WM.defEvents('daming', [
    L.sign('dmsign', 25, 42, 'Daming Prefecture, the Northern Capital. Governor: the Honourable Liang Zhongshu.'),
    // what Daming talks about: the birthday gifts, Yang Zhi, and the Lantern Festival when Liangshan came in
    { id: 'dm1', x: 33, y: 20, npc: 'merchant', wander: true, cond: function (S2) { return !S2.has('ch5_gifts'); }, text: ['The Governor is the Prime Minister Cai Jing\'s son-in-law. Every year he sends his father-in-law a birthday present worth a hundred thousand strings. Every year!'] },
    { id: 'dm1b', x: 33, y: 20, npc: 'merchant', wander: true, cond: function (S2) { return S2.has('ch5_gifts'); }, text: ['The Governor\'s birthday gifts were robbed on Yellow Earth Ridge — a hundred thousand strings, taken with a bucket of drugged wine. Twice now! The Prime Minister is said to be beside himself.'] },
    { id: 'dm2', x: 12, y: 33, npc: 'woman2', wander: true, cond: function (S2) { return !S2.has('ch17_fire'); }, text: ['The Cuiyun Tower is the finest tavern in the north. On the night of the Lantern Festival you can see the whole city lit up from its balconies.'] },
    { id: 'dm2b', x: 12, y: 33, npc: 'woman2', wander: true, cond: function (S2) { return S2.has('ch17_fire'); }, text: ['On the night of the Lantern Festival the Cuiyun Tower went up like a torch. Then the beggars and pedlars in the crowd drew swords — Liangshan men, every one of them.'] },
    { id: 'dm3', x: 40, y: 34, npc: 'soldier', cond: function (S2) { return !S2.has('ch4_done'); }, text: ['The drill ground is at the north-east of the city. The Governor reviews the troops there.'] },
    { id: 'dm3b', x: 40, y: 34, npc: 'soldier', cond: function (S2) { return S2.has('ch4_done') && !S2.has('ch5_gifts'); }, text: ['You should have seen the contest on the drill ground! Yang Zhi and Suo Chao fought fifty bouts and neither could win. The Governor made them both captains on the spot.'] },
    { id: 'dm3c', x: 40, y: 34, npc: 'soldier', cond: function (S2) { return S2.has('ch5_gifts'); }, text: ['Captain Yang Zhi took the birthday gifts south, and never came back. The Governor has put a price on his head. A good soldier, that one. Unlucky.'] }
  ]);
})();
