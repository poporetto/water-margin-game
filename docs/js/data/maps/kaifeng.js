// The Eastern Capital, Kaifeng: city, interiors, Gao Qiu's residence. Reused from the prologue to the amnesty.
'use strict';
(function () {
  var L = WM.mapLib;

  // ---------------- city ----------------
  var g = L.grid(60, 46, '.');
  g.border('#', 2, [{ side: 's', from: 28, to: 31 }]);
  g.rect(28, 44, 4, 2, 'G');
  // avenues
  g.rect(28, 2, 4, 42, '=');
  g.rect(2, 12, 56, 2, '=');
  g.rect(2, 33, 56, 2, '=');
  // Bian River and its bridges
  g.rect(2, 23, 56, 3, '~');
  g.rect(28, 23, 4, 3, 'B'); g.rect(10, 23, 2, 3, 'B'); g.rect(46, 23, 2, 3, 'B');
  g.hline(2, 57, 21, ':'); g.hline(2, 57, 27, ':');
  g.vline(10, 21, 27, ':'); g.vline(11, 21, 27, ':'); g.vline(46, 21, 27, ':'); g.vline(47, 21, 27, ':');
  g.rect(10, 23, 2, 3, 'B'); g.rect(46, 23, 2, 3, 'B');
  // the imperial palace (north)
  g.frame(21, 2, 18, 9, 'R');
  g.rect(22, 3, 16, 7, '=');
  g.house(24, 3, 12, 5, { roof: 'Z', wall: 'R', door: false });
  g.rect(28, 10, 4, 1, 'G');
  g.set(23, 8, 'L'); g.set(36, 8, 'L');
  // Gao Qiu's residence (north-west)
  var gaoDoor = g.house(4, 3, 12, 7, { roof: '^', door: 6, windows: [2, 9] });
  g.vline(10, 10, 11, ':');
  g.stamp(3, 10, ['TT']); g.stamp(16, 4, ['T', 'T', 'f']);
  // Fan Tower and Li Shishi's house (north-east)
  var fanDoor = g.house(41, 3, 9, 7, { roof: 'v', door: 4, windows: [1, 7], windowsUpper: [2, 6] });
  g.vline(45, 10, 11, ':');
  var liDoor = g.house(51, 4, 6, 6, { roof: '^', door: 3, windows: [1] });
  g.vline(54, 10, 11, ':');
  g.stamp(51, 10, ['ff', 'ff']); g.stamp(39, 4, ['T', 'T']);
  // north bank: market
  var shopDoor = g.house(3, 15, 6, 5, { door: 3, windows: [1] });
  var smithDoor = g.house(12, 15, 6, 5, { door: 2, windows: [4] });
  g.stamp(18, 16, ['jj', 'j ']);
  var innDoor = g.house(33, 15, 8, 6, { door: 3, windows: [1, 6], windowsUpper: [1, 6] });
  var talDoor = g.house(42, 15, 6, 5, { roof: 'v', wall: 'R', door: 3 });
  var luDoor = g.house(50, 15, 7, 5, { door: 3, windows: [1, 5] });
  [shopDoor, smithDoor, innDoor, talDoor, luDoor].forEach(function (d) { if (d.y + 1 <= 20) g.vline(d.x, d.y + 1, 20, ':'); });
  g.stamp(21, 15, ['f.T', '.p.', 'T.f']);
  // south bank: temples
  var yueDoor = g.house(3, 28, 10, 5, { roof: 'v', wall: 'R', door: 5 });
  var xgDoor = g.house(41, 28, 15, 5, { roof: 'v', wall: 'R', door: 8 });
  g.set(40, 31, 'L'); g.set(56, 31, 'L');
  g.stamp(15, 28, ['TfT', '.U.', 'TfT']);
  // south: residences
  var wangDoor = g.house(4, 36, 7, 5, { door: 3, windows: [1, 5] });
  var xuDoor = g.house(13, 36, 6, 5, { door: 3, windows: [1, 4] });   // Xu Ning, instructor of the Imperial Guard (chapter 14)
  g.house(20, 36, 6, 5, { roof: 'z', door: false, windows: [2] });
  var linDoor = g.house(34, 36, 7, 5, { door: 3, windows: [1, 5] });
  g.house(43, 36, 6, 5, { door: false, windows: [1, 4] });
  g.house(51, 36, 6, 5, { roof: 'z', door: false, windows: [3] });
  g.hline(2, 57, 41, ':');
  [wangDoor, linDoor, xuDoor].forEach(function (d) { g.vline(d.x, d.y + 1, 41, ':'); });
  g.stamp(12, 42, ['T..f..T']); g.stamp(36, 42, ['f..T']);
  // lanterns along the main avenue
  for (var y = 15; y < 43; y += 5) { if (y >= 22 && y <= 26) continue; if (y === 12 || y === 13 || y === 33 || y === 34) continue; g.set(27, y, 'L'); g.set(32, y, 'L'); }
  g.scatter('T', 0.12, 7, '.', [2, 2, 56, 42]);
  g.scatter('f', 0.05, 8, '.', [2, 2, 56, 42]);
  // keep the riverside walk clear
  g.hline(2, 57, 21, ':'); g.hline(2, 57, 27, ':');
  g.set(26, 40, 'I'); g.set(26, 20, 'I');

  WM.defMap('kaifeng', {
    name: 'The Eastern Capital', theme: 'spring', music: 'town', rows: g.rows(), battleBg: 'town', spawn: [29, 40],
    exits: [WM.toWorld('kaifeng', 28, 44, 4, 2)]   // out of the south gate, onto the road below the Eastern Capital on the world map
  });
  WM.data.kaifengDoors = { gao: gaoDoor, fan: fanDoor, li: liDoor, shop: shopDoor, smith: smithDoor, inn: innDoor, tal: talDoor, luqian: luDoor, yue: yueDoor, xiangguo: xgDoor, wang: wangDoor, lin: linDoor, xu: xuDoor };

  // ---------------- interiors ----------------
  var I = L.grid(64, 30, 'x');
  var R = {};
  R.wang = I.room(1, 1, 10, 8); I.stamp(2, 3, ['k...h', '.....', '..t..']); I.set(8, 3, 'j');
  R.lin = I.room(12, 1, 10, 8); I.stamp(13, 3, ['k.h.k', '.....', '..t..']); I.set(20, 3, 'j');
  R.luqian = I.room(23, 1, 10, 8); I.stamp(24, 3, ['h..kk', '...kk', '.tt..']);
  R.inn = I.room(34, 1, 12, 9); I.stamp(35, 3, ['.....kk.kk', '.....kk.kk', 'cccc......', '......t..t']);
  R.shop = I.room(47, 1, 8, 7); I.stamp(48, 3, ['hhhhhh', '......', 'cccc..']);
  R.smith = I.room(56, 1, 8, 7); I.stamp(57, 3, ['jj..jj', '......', '.cccc.']);
  R.tal = I.room(1, 11, 9, 7, { floor: 'N' }); I.stamp(2, 13, ['h.A.h', '.....', '.ccc.']);
  R.fan = I.room(11, 11, 15, 10); I.stamp(12, 13, ['h..L.....L..h', '.............', '.t..t..t..t..', '.............', '.t..t..t..t..', 'cccc.........']);
  R.li = I.room(27, 11, 10, 8, { floor: 'K' }); I.stamp(28, 13, ['hkk..h', '.kk...', '..t...']);
  R.yue = I.room(38, 11, 12, 9, { floor: 'N' }); I.stamp(39, 13, ['L..77..L.', '...88....', '.........', 'j.......j']);
  R.xu = I.room(51, 11, 12, 9); I.stamp(52, 13, ['k..h..j...', '..........', '...t......', 'h.........']);
  WM.defMap('kaifeng_in', { name: '', interior: true, theme: 'spring', music: 'town', rows: I.rows(), battleBg: 'interior', spawn: [6, 6] });
  WM.data.kaifengRooms = R;

  var d = WM.data.kaifengDoors;
  [['wang', 'wang'], ['lin', 'lin'], ['luqian', 'luqian'], ['inn', 'inn'], ['shop', 'shop'], ['smith', 'smith'], ['tal', 'tal'], ['fan', 'fan'], ['li', 'li'], ['yue', 'yue'], ['xu', 'xu']].forEach(function (p) {
    L.link({ map: 'kaifeng', x: d[p[0]].x, y: d[p[0]].y }, { map: 'kaifeng_in', x: R[p[1]].x, y: R[p[1]].y });
  });

  // ---------------- Gao Qiu's residence (with the White Tiger Hall) ----------------
  var gg = L.ascii([
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XNNNNNNNNNNXXXNNNNNNNNNNNNNX',
    'XNhEEEEEEhNXXXNNNEEEEEENNNNX',   // the Marshal's hall and the White Tiger Hall: screens behind the seats
    'XNNNq00qNNNXXXNNNNq00qNNNNNX',
    'XNNNaaaaNNNXXXNNNKaaaaKNNNNX',
    'XNLNNKKNNLNXXXNLNKKKKKKNNLNX',
    'XNNNNKKNNNNXXXNNNKKKKKKNNNNX',
    'XNNNNKKNNNNNNNNNNNNNNNNNNNNX',
    'XNNNNKKNNNNXXXNNNNNNNNNNNNNX',
    'XNNNNKKNNNNXXXXXXXXXXXXXXXXX',
    'XNNNNKKNNNNXxxxxxxxxxxxxxxxx',
    'XXXXXDXXXXXXxxxxxxxxxxxxxxxx'
  ], 'x');
  WM.defMap('kaifeng_gao', { name: 'Residence of Marshal Gao', interior: true, theme: 'spring', music: 'palace', rows: gg, battleBg: 'palace', spawn: [5, 11] });
  L.link({ map: 'kaifeng', x: d.gao.x, y: d.gao.y }, { map: 'kaifeng_gao', x: 5, y: 12 });
  WM.data.whiteTigerDoor = { x: 22, y: 10 };

  // ---------------- standing NPCs and services ----------------
  WM.defEvents('kaifeng_in', [
    L.inn('inn', 36, 4, 20),
    L.save('innrec', 43, 7),
    L.shop('shop', 49, 4, 'kaifeng', 'shopkeep', 'Everything a traveller needs, straight from the market by the Zhou Bridge.'),
    L.smith('smith', 59, 4, 8),
    L.talis('tal', 4, 14, 'kaifeng_t'),
    { id: 'fanwaiter', x: 15, y: 18, npc: 'waiter', text: ['Welcome to the Fan Tower, finest wine in the capital! Up the stairs and the whole city is at your feet.'] }
  ]);
  WM.defEvents('kaifeng', [
    { id: 'pg1', x: 29, y: 11, npc: 'guard', fixedDir: true, text: ['The palace of the Son of Heaven. Move along.'] },
    { id: 'pg2', x: 30, y: 11, npc: 'guard', fixedDir: true, text: ['No one passes the palace gate without an imperial summons.'] },
    { id: 'kv1', x: 24, y: 30, npc: 'merchant', wander: true, text: ['The Bian River carries grain and stone from the south all year. The capital never sleeps!'] },
    { id: 'kv2', x: 41, y: 22, npc: 'woman2', dir: 'up', text: ['They say the Fan Tower has five buildings joined by flying bridges. I have only ever seen it from the street.'] },
    { id: 'kv3', x: 15, y: 27, npc: 'oldman', text: ['When I was young the street-toughs played football in the alleys. Now one of them is a Marshal. Strange world.'] },
    // the vegetable garden of the Xiangguo Monastery, before and after Lu Zhishen keeps it
    { id: 'kv4', x: 44, y: 34, npc: 'monk', cond: function (S2) { return !S2.has('ch2_rascalsdone'); }, text: ['The Great Xiangguo Monastery is the largest in the realm. Its vegetable garden is plagued by idle rascals, I hear.'] },
    { id: 'kv4b', x: 44, y: 34, npc: 'monk', cond: function (S2) { return S2.has('ch2_rascalsdone') && !S2.has('ch3_saved'); }, text: ['The new keeper of the Xiangguo vegetable garden is a monk from Mount Wutai. He threw the rascals into the cesspit and pulled up a willow by the roots. Now they bring him wine.'] },
    { id: 'kv4c', x: 44, y: 34, npc: 'monk', cond: function (S2) { return S2.has('ch3_saved'); }, text: ['The big monk of the vegetable garden has gone. He left the same month Instructor Lin was sent to Cangzhou. Marshal Gao\'s men came asking for him.'] },
    L.sign('ksign1', 26, 40, 'South Gate — the Eastern Capital, Kaifeng. Seat of the Son of Heaven.'),
    L.sign('ksign2', 26, 20, 'The Zhou Bridge over the Bian River.')
  ]);
})();
