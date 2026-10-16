// Shi Family Village (Huayin county) and Mount Shaohua.
'use strict';
(function () {
  var L = WM.mapLib;

  // ---------------- Shi Family Village ----------------
  var g = L.grid(40, 32, '.');
  g.border('T', 1, [{ side: 's', from: 13, to: 15 }, { side: 'n', from: 30, to: 31 }]);
  // main road from the south gap up to the manor gate, and a lane east to the north gap
  g.rect(13, 20, 3, 12, ':');
  g.rect(4, 20, 34, 2, ':');
  g.rect(30, 1, 2, 19, ':');
  // the manor: fenced compound
  g.frame(5, 3, 22, 16, 'F');
  g.rect(13, 18, 3, 1, ':');
  var hall = g.house(9, 4, 14, 6, { roof: '^', door: 7, windows: [2, 4, 9, 11] });
  g.house(6, 11, 5, 4, { roof: 'z', door: false, windows: [2] });       // granary
  g.house(22, 11, 4, 4, { roof: 'z', door: false, windows: [1] });      // stable
  g.rect(12, 11, 9, 6, '=');                                             // practice yard
  g.set(12, 11, 'j'); g.set(20, 11, 'j'); g.set(12, 16, 'I'); g.set(20, 16, 'L'); g.set(12, 13, 'L');
  g.rect(16, 10, 1, 1, ':');
  g.vline(16, 10, 10, ':');
  g.stamp(6, 16, ['ff.', 'T..']); g.stamp(24, 16, ['.T']);
  // village houses and fields
  var houseA = g.house(2, 23, 6, 4, { roof: 'z', door: 3 });
  var shopH = g.house(9, 23, 6, 4, { roof: 'z', door: 3, windows: [1] });
  var houseB = g.house(18, 23, 6, 4, { roof: 'z', door: 2, windows: [4] });
  g.rect(26, 23, 11, 7, 'y'); g.frame(25, 22, 13, 9, 'F'); g.set(31, 22, ':');
  g.rect(2, 28, 9, 3, 'y');
  g.rect(28, 4, 6, 4, '~'); g.set(27, 5, 'r'); g.set(34, 6, 'r'); g.rect(30, 4, 2, 4, 'B');   // the north road crosses the pond on a bridge
  g.house(33, 10, 5, 4, { roof: 'z', door: false, windows: [2] });
  g.set(17, 28, 'p');
  g.scatter('T', 0.1, 21, '.', [1, 1, 38, 30]);
  g.scatter('f', 0.05, 22, '.', [1, 1, 38, 30]);
  L.clearAround(g, ':', 'T', '.');
  g.set(12, 21, 'I');
  WM.defMap('shivillage', {
    name: 'Shi Family Village', theme: 'spring', music: 'field', rows: g.rows(), battleBg: 'plains', spawn: [14, 30],
    exits: [WM.toWorld('shivillage', 13, 31, 3, 1), WM.toWorld('shivillage', 30, 0, 2, 1)].map(function (e) {
      e.cond = function (S2) { return WM.state.chapter !== 1 || S2.has('ch1_escaped'); };
      e.blocked = function (S2) { return { who: WM.state.leader, text: S2.has('ch1_shijin') ? 'I can\'t leave the village unguarded.' : 'We should not wander off. Mother needs rest.' }; };
      return e;
    })
  });
  WM.data.shiDoors = { hall: hall, houseA: houseA, shop: shopH, houseB: houseB };

  // interiors: the manor hall with guest room, and village rooms
  var I = L.grid(48, 22, 'x');
  var R = {};
  R.hall = I.room(1, 1, 20, 11, { floor: 'n' });
  I.stamp(2, 3, ['h..A.....A..h.....', '..................', '......KKKK........', '......KKKK....t...', '..................', '..................', 'j................j']);
  I.vline(14, 3, 6, 'X'); I.set(14, 5, 'n');
  I.stamp(15, 3, ['k...', '....', '...k']);
  R.houseA = I.room(22, 1, 8, 7); I.stamp(23, 3, ['k..j..', '......', '..t...']);
  R.shop = I.room(31, 1, 8, 7); I.stamp(32, 3, ['hhhhh.', '......', 'ccc...']);
  R.houseB = I.room(40, 1, 8, 7); I.stamp(41, 3, ['k...h.', '......', '...t..']);
  WM.defMap('shivillage_in', { name: '', interior: true, theme: 'spring', music: 'field', rows: I.rows(), spawn: [10, 9] });
  var D = WM.data.shiDoors;
  L.link({ map: 'shivillage', x: D.hall.x, y: D.hall.y }, { map: 'shivillage_in', x: R.hall.x, y: R.hall.y });
  L.link({ map: 'shivillage', x: D.houseA.x, y: D.houseA.y }, { map: 'shivillage_in', x: R.houseA.x, y: R.houseA.y });
  L.link({ map: 'shivillage', x: D.shop.x, y: D.shop.y }, { map: 'shivillage_in', x: R.shop.x, y: R.shop.y });
  L.link({ map: 'shivillage', x: D.houseB.x, y: D.houseB.y }, { map: 'shivillage_in', x: R.houseB.x, y: R.houseB.y });
  WM.data.shiRooms = R;

  WM.defEvents('shivillage_in', [
    L.shop('vstore', 33, 4, 'village', 'shopkeep', 'Buns, beef and a few odds and ends. We are a long way from the capital.'),
    { id: 'housewife', x: 25, y: 5, npc: 'woman', cond: function (S2) { return !S2.has('ch1_escaped'); }, text: ['The young master trains with that staff from dawn until dark. The Taigong despairs of him ever minding the farm.'] },
    { id: 'housewife2', x: 25, y: 5, npc: 'woman', cond: function (S2) { return S2.has('ch1_escaped'); }, text: ['The manor is ashes, and the young master has gone up Mount Shaohua with the bandit chiefs. The Taigong would have wept to see it. And Li Ji the hunter, who sold him to the constables for a reward — the young master cut him down in the gateway.'] }
  ]);

  // ---------------- Mount Shaohua ----------------
  var m = L.grid(30, 44, 'M');
  var pts = [[14, 43], [14, 38], [8, 33], [9, 26], [18, 22], [20, 16], [14, 12], [14, 9]];
  function walk(fn) { for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n)); } }
  walk(function (x, y) { m.rect(x - 3, y - 1, 7, 3, '.'); });
  walk(function (x, y) { m.set(x, y, ':'); m.set(x + 1, y, ':'); });
  m.scatter('P', 0.2, 41, '.'); m.scatter('m', 0.05, 42, '.');
  L.clearAround(m, ':', 'Pm', '.');
  // the bandit stockade at the top
  m.rect(4, 1, 22, 11, '.');
  m.frame(4, 1, 22, 11, 'F');
  m.rect(13, 11, 3, 1, ':'); m.set(14, 10, ':');
  var fortHall = m.house(8, 2, 14, 6, { roof: 'z', door: 7, windows: [2, 11] });
  m.set(6, 9, 'Y'); m.set(23, 9, 'Y'); m.set(9, 9, 'V'); m.set(20, 9, 'V');
  m.set(12, 8, 'L'); m.set(17, 8, 'L');
  m.rect(13, 9, 3, 2, ':');
  WM.defMap('shaohua', {
    name: 'Mount Shaohua', theme: 'spring', music: 'dungeon', rows: m.rows(), battleBg: 'mountain', spawn: [14, 42],
    exits: [WM.toWorld('shaohua', 11, 43, 7, 1)],
    encounters: { rate: 0.07, troops: [['wolf', 'wolf'], ['snake', 'snake'], ['boar'], ['wolf', 'snake'], ['eagle']] }
  });
  var H = L.grid(18, 12, 'x');
  var hallR = H.room(0, 0, 18, 12, { floor: 'n' });
  H.stamp(1, 2, ['h...LA..AL...h..', '................', '..t...KKKK......', '......KKKK......', '................', '................', 'j..............j']);
  H.set(2, 3, 'k');
  WM.defMap('shaohua_in', { name: 'Shaohua Stronghold', interior: true, theme: 'spring', music: 'dungeon', rows: H.rows(), spawn: [9, 10] });
  L.link({ map: 'shaohua', x: fortHall.x, y: fortHall.y }, { map: 'shaohua_in', x: hallR.x, y: hallR.y });
})();
