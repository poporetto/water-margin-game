// Weizhou, a garrison town of the north-west frontier. Chapters 1–2.
'use strict';
(function () {
  var L = WM.mapLib;
  var g = L.grid(42, 32, '.');
  g.border('#', 1, [{ side: 's', from: 19, to: 22 }]);
  g.rect(19, 31, 4, 1, 'G');
  // streets
  g.rect(19, 1, 4, 30, '=');
  g.rect(1, 10, 40, 2, '=');
  g.rect(1, 24, 40, 2, ':');
  // a canal with the Zhuangyuan Bridge
  g.rect(1, 15, 40, 2, '~');
  g.rect(19, 15, 4, 2, 'B'); g.rect(31, 15, 2, 2, 'B');
  g.vline(31, 12, 14, ':'); g.vline(32, 12, 14, ':'); g.vline(31, 17, 23, ':'); g.vline(32, 17, 23, ':');
  // north side
  var tea = g.house(2, 3, 8, 5, { roof: '^', door: 4, windows: [1, 6] });
  var garrison = g.house(11, 2, 7, 6, { roof: 'v', wall: 'R', door: 3 });
  var pan = g.house(25, 2, 11, 6, { roof: 'v', door: 5, windows: [1, 3, 7, 9], windowsUpper: [2, 8] });
  g.set(24, 5, 'L'); g.set(36, 5, 'L');
  g.stamp(37, 2, ['T.', 'fT', 'T.']);
  [tea, garrison, pan].forEach(function (d) { g.vline(d.x, d.y + 1, 9, ':'); });
  // market square
  g.rect(23, 12, 7, 2, '=');
  g.stamp(24, 12, ['t.t.t']);
  // south side
  var inn = g.house(2, 18, 9, 5, { roof: 'z', door: 4, windows: [1, 7] });
  var butcher = g.house(26, 18, 9, 5, { roof: 'z', door: 6, windows: [2] });
  g.stamp(27, 23, ['jj.j']);
  var house1 = g.house(12, 18, 6, 5, { roof: '^', door: false, windows: [1, 4] });
  g.house(36, 18, 5, 5, { roof: 'z', door: false, windows: [2] });
  [inn, butcher].forEach(function (d) { g.vline(d.x, d.y + 1, 23, ':'); });
  g.stamp(3, 26, ['T..f..T...TT.', '..f......f...', 'T....T.....T.']);
  g.stamp(26, 26, ['f..T..f..T..T', '...........f.', 'T..f..T......']);
  for (var y = 2; y < 30; y += 5) { if (y >= 10 && y <= 17) continue; g.set(18, y, 'L'); g.set(23, y, 'L'); }
  g.set(17, 29, 'I');
  WM.defMap('weizhou', {
    name: 'Weizhou', theme: 'autumn', music: 'town', rows: g.rows(), battleBg: 'town', spawn: [20, 29],
    exits: [WM.toWorld('weizhou', 19, 31, 4, 1)]
  });

  var I = L.grid(64, 26, 'x');
  var R = {};
  R.tea = I.room(1, 1, 12, 8); I.stamp(2, 3, ['h..L....h.', '..........', '.t..t..t..', 'cc........']);
  R.garrison = I.room(14, 1, 10, 8, { floor: 'N' }); I.stamp(15, 3, ['h..A...h', '........', '..t..t..']);
  R.pan = I.room(25, 1, 18, 10); I.stamp(26, 3, ['h...L.....L...h.', '................', '.t..t..t....t...', '................', '.t..t..t..cccc..']);
  R.inn = I.room(44, 1, 12, 8); I.stamp(45, 3, ['k.k..k.k..', '..........', 'cccc......']);
  R.butcher = I.room(1, 12, 12, 8); I.stamp(2, 14, ['jj..hh..jj', '..........', '.cccccccc.']);
  WM.defMap('weizhou_in', { name: '', interior: true, theme: 'autumn', music: 'town', rows: I.rows(), spawn: [6, 7] });
  var link = function (door, room) { L.link({ map: 'weizhou', x: door.x, y: door.y }, { map: 'weizhou_in', x: room.x, y: room.y }); };
  link(tea, R.tea); link(garrison, R.garrison); link(pan, R.pan); link(inn, R.inn); link(butcher, R.butcher);
  WM.data.weizhouRooms = R;
  WM.data.weizhouDoors = { tea: tea, garrison: garrison, pan: pan, inn: inn, butcher: butcher };

  WM.defEvents('weizhou', [
    L.sign('wzsign', 17, 29, 'Weizhou — garrison prefecture of the Jingyuan circuit, under the command of Minister Chong the Younger.'),
    // the town's talk moves on once Lu Da has killed the butcher and fled
    { id: 'wz1', x: 14, y: 13, npc: 'soldier', wander: true, cond: function (S2) { return !S2.has('ch2_fled'); }, text: ['Major Lu of the garrison? Big as a bear and twice as loud. Good man, though. Pays for his wine.'] },
    { id: 'wz1b', x: 14, y: 13, npc: 'soldier', wander: true, cond: function (S2) { return S2.has('ch2_fled'); }, text: ['Major Lu killed Zheng the butcher with three blows of his fist, and ran. The Commissioner was fond of him, too. Now there\'s a thousand strings on his head.'] },
    { id: 'wz2', x: 35, y: 9, npc: 'merchant', wander: true, text: ['Wool from the frontier, horses from the Xia! Weizhou is the last proper town before the passes.'] },
    { id: 'wz3', x: 9, y: 13, npc: 'oldwoman', cond: function (S2) { return !S2.has('ch2_fled'); }, text: ['That butcher by the bridge calls himself "Lord of the West" now. Lord! He was a pig-sticker when I was a girl.'] },
    { id: 'wz3b', x: 9, y: 13, npc: 'oldwoman', cond: function (S2) { return S2.has('ch2_fled'); }, text: ['"Lord of the West"! He lay in his own shop like one of his pigs. And old Jin and his girl got clean away. I won\'t pretend I wept.'] }
  ]);
  WM.defEvents('weizhou_in', [
    L.inn('wzinn', 47, 4, 15),
    L.save('wzrec', 53, 6),
    L.shop('wzshop', 30, 4, 'weizhou', 'waiter', 'Food for the road? We sell what we cook.')
  ]);
})();
