// Liangshan Marsh: Zhu Gui's tavern on the shore and the fortress itself (the castle).
// The fortress map is rebuilt from the castle level and the heroes who keep its facilities.
'use strict';
(function () {
  var L = WM.mapLib, S = WM.S, U = WM.util;

  // ---------------- Zhu Gui's tavern on the marsh shore ----------------
  var z = L.grid(30, 22, '.');
  for (var y = 0; y < 22; y++) for (var x = 0; x < 30; x++) {
    if (y < 7) z.set(x, y, y < 3 ? 'w' : '~');
    else if (y === 7) z.set(x, y, U.hash2(x, y, 3) > 0.4 ? 'r' : '~');
  }
  z.scatter('r', 0.4, 151, '~', [0, 3, 30, 5]);
  z.rect(13, 3, 2, 5, 'B'); z.set(12, 5, 'o'); z.set(15, 4, 'o');   // the landing where the boat comes
  var tav = z.house(4, 10, 10, 5, { roof: 'z', door: 5, windows: [1, 3, 7] }); z.set(15, 10, 'J');
  z.rect(13, 8, 2, 2, ':'); z.vline(9, 15, 21, ':'); z.hline(9, 14, 15, ':'); z.vline(14, 8, 15, ':');
  z.scatter('T', 0.1, 152, '.', [0, 9, 30, 13]); z.scatter(',', 0.2, 153, '.', [0, 9, 30, 13]);
  L.clearAround(z, ':', 'T', '.');
  WM.defMap('zhugui', { name: 'Zhu Gui\'s Tavern, Liangshan Marsh', theme: 'marsh', music: 'field', rows: z.rows(), spawn: [9, 20], battleBg: 'marsh',
    exits: [WM.toWorld('zhugui', 8, 21, 3, 1)] });
  var zi = L.grid(14, 9, 'x');
  var zR = zi.room(1, 1, 12, 7);
  zi.stamp(2, 3, ['h..L....h.', '.t..t..t..', 'cc........']);
  WM.defMap('zhugui_in', { name: 'Zhu Gui\'s Tavern', interior: true, theme: 'marsh', music: 'field', rows: zi.rows(), spawn: [7, 6] });
  L.link({ map: 'zhugui', x: tav.x, y: tav.y }, { map: 'zhugui_in', x: zR.x, y: zR.y });
  WM.data.zhuguiTav = { door: tav, room: zR };

  // ---------------- the fortress ----------------
  var W = 50, H = 48;
  // building slots on the terraces: id -> rect and the facility keeper who opens it
  var SLOTS = {
    store:   { x: 6, y: 27, w: 7, h: 5, door: 3, roof: 'z', always: true },
    smithy:  { x: 14, y: 27, w: 6, h: 5, door: 2, roof: 'z', keeper: 'tanglong' },
    tailor:  { x: 30, y: 27, w: 7, h: 5, door: 3, roof: '^', keeper: 'houjian' },
    barracks:{ x: 38, y: 27, w: 7, h: 5, door: 3, roof: 'z', always: true },
    clinic:  { x: 6, y: 16, w: 7, h: 5, door: 3, roof: '^', keeper: 'andaoquan' },
    engrave: { x: 14, y: 16, w: 6, h: 5, door: 2, roof: 'v', wall: 'R', keeper: 'jindajian' },
    records: { x: 30, y: 16, w: 6, h: 5, door: 3, roof: '^', always: true },
    banquet: { x: 37, y: 16, w: 8, h: 5, door: 4, roof: 'v', keeper: 'songqing' }
  };
  WM.data.lsSlots = SLOTS;

  function level() { return WM.castle ? WM.castle.level() : 1; }
  // a workshop is built once its keeper joins; after the Grand Assembly the building stands even if the keeper is gone
  function open(slot) { var sl = SLOTS[slot]; return sl.always || (WM.castle && WM.castle.has(sl.keeper)) || (S.has('grand_assembly') && S.isRecruited(sl.keeper)); }

  function build() {
    var lv = level();
    var g = L.grid(W, H, 'w');
    for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) {
      var dx = (xx - 25) / 22, dy = (yy - 22) / 20.5;
      var d = dx * dx + dy * dy + (U.hash2(xx, yy, 7) - 0.5) * 0.06;
      if (d < 0.88) g.set(xx, yy, '.');
      else if (d < 1.0) g.set(xx, yy, '~');
      else if (d < 1.12 && U.hash2(xx, yy, 8) > 0.45) g.set(xx, yy, 'r');
    }
    // mountains and pines to the north
    for (xx = 0; xx < W; xx++) for (yy = 0; yy < 8; yy++) if (g.get(xx, yy) === '.' && (yy < 4 || U.hash2(xx, yy, 9) > 0.55)) g.set(xx, yy, yy < 3 ? 'M' : 'P');
    // shore & jetty
    g.rect(18, 40, 14, 2, 's');
    g.rect(23, 42, 4, 5, 'B'); g.set(21, 44, 'o'); g.set(28, 44, 'o'); g.set(20, 42, 'o');
    // main path
    g.rect(24, 9, 2, 32, ':');
    // Duanjin Pavilion near the landing
    g.house(14, 36, 3, 3, { roof: 'v', wall: 'R', door: false, wallRows: 1 }); g.set(15, 38, '.');
    g.hline(17, 23, 37, ':');
    // first pass (lower wall)
    var wallCh = lv >= 3 ? '#' : 'F';
    g.hline(5, 44, 34, wallCh); g.rect(24, 34, 2, 1, lv >= 3 ? 'G' : ':');
    // second pass
    g.hline(5, 44, 24, wallCh); g.rect(24, 24, 2, 1, lv >= 3 ? 'G' : ':');
    // drill ground (lower terrace, west of the path) and the meadow
    g.rect(6, 35, 8, 4, lv >= 2 ? '=' : ':');
    // terraces: buildings
    var doors = {};
    Object.keys(SLOTS).forEach(function (k) {
      var sl = SLOTS[k];
      if (!open(k)) { g.stamp(sl.x, sl.y + sl.h - 2, ['  ']); return; }
      var d = g.house(sl.x, sl.y, sl.w, sl.h, { roof: sl.roof, wall: sl.wall, door: sl.door, windows: sl.w > 6 ? [1, sl.w - 2] : [] });
      doors[k] = d;
      g.hline(Math.min(d.x, 24), Math.max(d.x, 24), d.y + 1, ':');
    });
    // lanes along the terraces
    g.hline(6, 44, 32, ':'); g.hline(6, 44, 21, ':');
    Object.keys(doors).forEach(function (k) { var d = doors[k]; g.set(d.x, d.y + 1, ':'); });
    // the great hall
    var hallRoof = lv >= 3 ? 'Z' : lv >= 2 ? 'v' : '^';
    var hall = g.house(15, 6, 20, 6, { roof: hallRoof, wall: lv >= 2 ? 'R' : 'W', door: 10, windows: lv >= 2 ? [] : [3, 16] });
    doors.hall = hall;
    g.set(23, 12, 'L'); g.set(26, 12, 'L');
    if (S.has('loyaltyhall')) { g.set(20, 13, 'Y'); g.set(29, 13, 'Y'); }   // "Act on Heaven's behalf"
    if (S.has('grand_assembly')) g.set(31, 14, 'Q');                    // the stone tablet from heaven
    // stables (Huangfu Duan) on the east meadow
    if (WM.castle && WM.castle.has('huangfuduan')) { g.frame(37, 35, 8, 4, 'F'); g.set(37, 37, ':'); g.house(39, 35, 4, 3, { roof: 'z', door: false, wallRows: 1 }); }
    // artillery (Ling Zhen) on the lower wall
    if (WM.castle && WM.castle.has('lingzhen')) { g.set(10, 33, 'j'); g.set(39, 33, 'j'); }
    // trees and flowers, more as the fortress grows
    g.scatter('T', 0.07, 161, '.', [4, 8, 42, 30]);
    g.scatter('f', 0.03 + lv * 0.01, 162, '.', [4, 8, 42, 32]);
    L.clearAround(g, ':', 'T', '.');
    Object.keys(doors).forEach(function (k) { var d = doors[k]; g.set(d.x, d.y + 1, ':'); });
    WM.data.lsDoors = doors;
    return g.rows();
  }

  WM.defMap('liangshan', {
    name: 'Liangshan', theme: 'marsh', rows: build, spawn: [24, 40], entry: [24, 40], battleBg: 'marsh',
    cacheKey: function () { return level() + '|' + Object.keys(SLOTS).filter(open).join(',') + '|' + S.has('loyaltyhall') + S.has('grand_assembly') + (WM.castle && WM.castle.has('huangfuduan')) + (WM.castle && WM.castle.has('lingzhen')); },
    music: function (S2) { return S2.has('lsWangLun') ? 'tense' : 'castle'; },
    get exits() {
      var out = [];
      // leaving by boat from the jetty
      out.push({ x: 23, y: 46, w: 4, h: 1, to: 'zhugui', tx: 13, ty: 8, dir: 'down', sfx: 'splash' });
      var doors = WM.data.lsDoors || {};
      if (doors.hall) out.push({ x: doors.hall.x, y: doors.hall.y, to: 'liangshan_in', tx: ROOMS.hall.x, ty: ROOMS.hall.y - 1, dir: 'up' });
      Object.keys(SLOTS).forEach(function (k) { if (doors[k] && ROOMS[k]) out.push({ x: doors[k].x, y: doors[k].y, to: 'liangshan_in', tx: ROOMS[k].x, ty: ROOMS[k].y - 1, dir: 'up' }); });
      return out;
    }
  });

  // interiors
  var I = L.grid(70, 36, 'x');
  var ROOMS = {};
  ROOMS.hall = I.room(1, 1, 30, 16, { floor: 'N' });
  I.stamp(2, 3, ['h....L.....AAAA.....L.....h.', '............................', '............................', '....KKKKKKKKKKKKKKKKKKKK....', '....KKKKKKKKKKKKKKKKKKKK....', '..t.KKKKKKKKKKKKKKKKKKKK.t..', '..t.KKKKKKKKKKKKKKKKKKKK.t..', '....KKKKKKKKKKKKKKKKKKKK....', '....KKKKKKKKKKKKKKKKKKKK....', '............................', 'j..........................j']);
  ROOMS.store = I.room(32, 1, 9, 7); I.stamp(33, 3, ['hhhhh..', '.......', 'ccc....']);
  ROOMS.smithy = I.room(42, 1, 9, 7); I.stamp(43, 3, ['jj..jj.', '.......', '.cccc..']);
  ROOMS.tailor = I.room(52, 1, 9, 7); I.stamp(53, 3, ['hhhhhh.', '.......', '.cccc..']);
  ROOMS.barracks = I.room(61, 1, 9, 9); I.stamp(62, 3, ['k.k.k..', '.......', 'k.k.k..', '.......', '..t....']);
  ROOMS.clinic = I.room(32, 10, 9, 7); I.stamp(33, 12, ['k.h.k..', '.......', '..t....']);
  ROOMS.engrave = I.room(42, 10, 9, 7, { floor: 'N' }); I.stamp(43, 12, ['h.A.h..', '.......', '.ccc...']);
  ROOMS.records = I.room(52, 10, 9, 7); I.stamp(53, 12, ['hhhhhh.', '.......', '..t....']);
  ROOMS.banquet = I.room(1, 18, 20, 10, { floor: 'K' }); I.stamp(2, 20, ['h...L......L...h.', '..................', '.t..t..t..t..t..t.', '..................', '.t..t..t..t..t..t.', '..................']);
  WM.defMap('liangshan_in', { name: '', interior: true, theme: 'marsh', music: function (S2) { return S2.has('lsWangLun') ? 'tense' : 'castle'; }, rows: I.rows(), spawn: [16, 15] });
  // exits from rooms back to the fortress (door positions are known only after the fortress is built)
  Object.defineProperty(WM.data.maps.liangshan_in, 'exits', { get: function () {
    var doors = WM.data.lsDoors; if (!doors) { build(); doors = WM.data.lsDoors; }
    var out = [];
    Object.keys(ROOMS).forEach(function (k) { if (doors[k]) out.push({ x: ROOMS[k].x, y: ROOMS[k].y, to: 'liangshan', tx: doors[k].x, ty: doors[k].y + 1, dir: 'down' }); });
    return out;
  } });
  WM.data.lsRooms = ROOMS;

  // ---------------- standing services ----------------
  var C = function () { return WM.castle; };
  var notWL = function (S2) { return !S2.has('lsWangLun'); };
  WM.defEvents('liangshan_in', [
    { id: 'ls_store', x: 34, y: 4, npc: 'outlaw', cond: notWL, run: async function (s) { await s.say('outlaw', 'Supplies for the brothers. Take what you need — the silver goes to the common store.'); await s.shop('liangshan'); } },
    { id: 'ls_smith', x: 45, y: 4, char: 'tanglong', cond: function (S2) { return C().has('tanglong') && WM.state.party.indexOf('tanglong') < 0; }, run: async function (s) { await s.say('tanglong', 'Bring me any blade, brother. The forge of Liangshan can take it as far as level ' + C().smithMax() + '.'); await s.smith(C().smithMax(), 'tanglong'); } },
    { id: 'ls_tailor', x: 55, y: 4, char: 'houjian', cond: function (S2) { return C().has('houjian') && WM.state.party.indexOf('houjian') < 0; }, run: async function (s) { await s.say('houjian', 'Banners, coats, armour — I sew them all. Have a look.'); await s.shop('liangshan_armor'); } },
    { id: 'ls_rest', x: 64, y: 7, npc: 'outlaw', cond: notWL, run: async function (s) { await s.inn(0, 'outlaw'); } },
    { id: 'ls_clinic', x: 36, y: 13, char: 'andaoquan', cond: function (S2) { return C().has('andaoquan'); }, run: async function (s) { await s.say('andaoquan', 'Let me see your wounds. There — all of you, mended.'); s.heal(); WM.S.restoreAll(); } },
    { id: 'ls_engrave', x: 45, y: 13, char: 'jindajian', cond: function (S2) { return C().has('jindajian'); }, run: async function (s) { await s.say('jindajian', 'Seals, tallies, and incense sticks carved with the brothers\' names. Burn one, and the spirit comes back.'); await s.shop('liangshan_t'); } },
    { id: 'ls_records', x: 56, y: 13, char: 'xiaorang', cond: function (S2) { return C().has('xiaorang'); }, run: async function (s) { var k = await s.ask('xiaorang', 'Shall I set down the record of our deeds?', ['Write a record', 'Not now']); if (k === 0) await s.saveMenu(); } },
    { id: 'ls_records2', x: 56, y: 13, npc: 'recorder', cond: function (S2) { return !C().has('xiaorang') && notWL(S2); }, run: async function (s) { var k = await s.ask('recorder', 'Shall I set down the record of our deeds?', ['Write a record', 'Not now']); if (k === 0) await s.saveMenu(); } },
    { id: 'ls_banquet', x: 10, y: 21, char: 'songqing', cond: function (S2) { return C().has('songqing'); }, run: async function (s) {
      var k = await s.ask('songqing', 'A feast for the brothers? It costs 300 taels, but everyone rests, and the cooks pack food for the road.', ['Hold a feast', 'Not now']);
      if (k !== 0) return;
      if (WM.state.gold < 300) { await s.say('songqing', 'The treasury is short, brother. Another time.'); return; }
      WM.state.gold -= 300; await s.fadeOut(0.6); s.music('victory'); WM.S.restoreAll(); await s.wait(1.5); await s.fadeIn(0.6);
      await s.give('beef', 3); await s.give('wine', 2);
    } },
    { id: 'ls_roster', x: 16, y: 6, npc: 'outlaw', cond: function (S2) { return S2.has('castle') && notWL(S2); }, run: async function (s) {
      var k = await s.ask('outlaw', 'Shall I call the brothers together, so you can choose who rides out with you?', ['Choose the party', 'Look at the roll', 'Not now']);
      if (k === 0) await s.roster(); else if (k === 1) await s.tablet();
    } }
  ]);
  WM.defEvents('liangshan', [
    { id: 'ls_boat', x: 22, y: 41, npc: 'boatman', cond: notWL, text: ['The boats can take you across to Zhu Gui\'s tavern on the shore. Just walk to the end of the jetty.'] }
  ]);
})();
