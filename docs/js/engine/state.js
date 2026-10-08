// Game state, character stats, inventory and save/load.
'use strict';
(function () {
  var U = WM.util;
  var S = WM.S = {}; // runtime helpers; the live state object is WM.state

  // Stat growth by class: [base at Lv1, gain per level]
  var CLASS = {
    warrior: { hp: [42, 10.5], pwr: [16, 2.3], skl: [12, 1.8], def: [12, 1.7], spd: [11, 1.6], mgc: [6, 0.9], luk: [8, 1.0] },
    brute:   { hp: [52, 12.5], pwr: [19, 2.6], skl: [10, 1.5], def: [12, 1.8], spd: [8, 1.3], mgc: [4, 0.6], luk: [7, 0.9] },
    swift:   { hp: [36, 9.0], pwr: [13, 2.0], skl: [15, 2.1], def: [10, 1.5], spd: [15, 2.1], mgc: [7, 1.0], luk: [11, 1.3] },
    archer:  { hp: [36, 9.0], pwr: [13, 2.0], skl: [17, 2.3], def: [10, 1.5], spd: [13, 1.8], mgc: [7, 1.0], luk: [10, 1.2] },
    mage:    { hp: [30, 7.5], pwr: [9, 1.3], skl: [11, 1.6], def: [9, 1.3], spd: [11, 1.5], mgc: [17, 2.4], luk: [10, 1.2] },
    scholar: { hp: [30, 7.8], pwr: [9, 1.3], skl: [12, 1.7], def: [9, 1.3], spd: [11, 1.6], mgc: [14, 2.1], luk: [12, 1.4] },
    leader:  { hp: [40, 10.0], pwr: [13, 2.0], skl: [13, 1.8], def: [11, 1.6], spd: [11, 1.6], mgc: [12, 1.8], luk: [13, 1.5] },
    civil:   { hp: [26, 6.0], pwr: [8, 1.0], skl: [9, 1.2], def: [8, 1.1], spd: [9, 1.2], mgc: [9, 1.3], luk: [10, 1.2] }
  };
  S.CLASS = CLASS;
  S.STATS = ['pwr', 'skl', 'def', 'spd', 'mgc', 'luk'];
  S.STAT_NAMES = { pwr: 'PWR', skl: 'SKL', def: 'DEF', spd: 'SPD', mgc: 'MGC', luk: 'LUCK' };
  S.EXP_PER_LV = 1000;
  S.MAX_LV = 99;
  S.MAX_WLV = 16;

  S.newGame = function () {
    WM.state = {
      flags: {},
      gold: 120,
      inv: {},          // itemId -> count
      party: [],        // up to 6 char ids; index 0-2 front row, 3-5 back row
      chars: {},        // id -> runtime
      recruited: [],    // ids in order of joining (the stone tablet)
      leader: null,     // field sprite
      map: null, x: 0, y: 0, dir: 'down',
      chapter: 0,
      playtime: 0,
      steps: 0,
      castleName: 'Liangshan',
      warLog: [],
      dead: {},         // story deaths (Fang La campaign)
      opts: { music: 0.55, sfx: 0.7, textSpeed: 55, autoBattle: false }
    };
    return WM.state;
  };

  // ---------- characters ----------
  S.def = function (id) { return WM.data.chars[id]; };

  // the weapon level and plain gear a hero of this level has at the least (recruits join with it; the story keeps
  // veterans up to it whenever it raises their level; the smith takes weapons beyond it)
  S.floorWlv = function (lv) { return Math.max(2, Math.min(14, Math.floor(lv / 4) + 2)); };
  S.kit = function (lv) {
    return { body: lv >= 20 ? 'leather' : lv >= 10 ? 'quilted' : lv >= 4 ? 'robe' : null, head: lv >= 18 ? 'leathercap' : lv >= 8 ? 'cap' : null };
  };
  S.catchUp = function (id) {
    var c = WM.state && WM.state.chars[id]; if (!c) return;
    c.wlv = Math.max(c.wlv || 1, S.floorWlv(c.lv));
    var kit = S.kit(c.lv), IT = WM.data.items;
    ['body', 'head'].forEach(function (slot) {
      var want = kit[slot], have = c.equip[slot];
      if (want && (!have || ((IT[have] && IT[have].def) || 0) < IT[want].def)) c.equip[slot] = want;
    });
  };
  S.initChar = function (id, lv) {
    var d = S.def(id);
    if (!d) throw new Error('Unknown character ' + id);
    var st = WM.state;
    if (st.chars[id]) return st.chars[id];
    var c = {
      id: id, lv: lv || d.lv || 1, exp: 0,
      wlv: d.wlv || S.floorWlv(lv || d.lv || 1),
      equip: { head: null, body: null, shield: null, acc: null },
      tal: { head: null, rhand: null, lhand: null },
      status: {}
    };
    // as in Suikoden II, a hero joins already dressed for the road: plain gear that suits their level
    var kit = S.kit(c.lv); c.equip.body = kit.body; c.equip.head = kit.head;
    if (d.equip) for (var k in d.equip) c.equip[k] = d.equip[k];
    if (d.talisman) c.tal.rhand = d.talisman;
    if (d.talismanHead) c.tal.head = d.talismanHead;
    if (d.talismanL) c.tal.lhand = d.talismanL;
    st.chars[id] = c;
    S.restore(id);
    return c;
  };

  S.base = function (id, stat, lv) {
    var d = S.def(id), cl = CLASS[d.cls || 'warrior'];
    var g = cl[stat];
    var mul = (d.mul && d.mul[stat]) || 1;
    return Math.floor((g[0] + g[1] * (lv - 1)) * mul);
  };

  // Derived stats including equipment and weapon.
  S.stats = function (id) {
    var c = WM.state.chars[id], d = S.def(id);
    var o = { lv: c.lv };
    o.mhp = S.base(id, 'hp', c.lv);
    S.STATS.forEach(function (k) { o[k] = S.base(id, k, c.lv); });
    var arm = 0;
    for (var slot in c.equip) {
      var it = c.equip[slot] && WM.data.items[c.equip[slot]];
      if (!it) continue;
      arm += it.def || 0;
      if (it.bonus) for (var b in it.bonus) { if (b === 'hp') o.mhp += it.bonus[b]; else o[b] = (o[b] || 0) + it.bonus[b]; }
    }
    // talisman passives
    ['head', 'rhand', 'lhand'].forEach(function (s) {
      var t = c.tal[s] && WM.data.talismans[c.tal[s]];
      if (t && t.passive) for (var b in t.passive) o[b] = (o[b] || 0) + t.passive[b];
    });
    o.atk = o.pwr + S.weaponPower(id, c.wlv);
    o.dfs = o.def + arm;
    o.range = S.weapon(id).range || 'S';
    return o;
  };

  // A character's current weapon: a story override (e.g. Wu Song's fists) or their own.
  S.weapon = function (id) {
    var c = WM.state && WM.state.chars[id], d = S.def(id);
    return (c && c.weapon) || d.weapon || { name: 'Fists', range: 'S', pow: 1 };
  };
  S.weaponPower = function (id, wlv) {
    var base = S.weapon(id).pow || 1;
    return Math.floor((6 + wlv * 9 + wlv * wlv * 0.6) * base);
  };

  // Magic charges per spell level (Suikoden-style: separate uses per level 1..4).
  S.maxMp = function (id) {
    var c = WM.state.chars[id];
    var mg = S.base(id, 'mgc', c.lv);
    var lv = c.lv;
    var out = [0, 0, 0, 0];
    out[0] = U.clamp(Math.floor(lv / 4 + mg / 40) + 1, 1, 9);
    out[1] = U.clamp(Math.floor((lv - 8) / 5 + mg / 50) + 1, 0, 9);
    out[2] = U.clamp(Math.floor((lv - 18) / 7 + mg / 70) + 1, 0, 9);
    out[3] = U.clamp(Math.floor((lv - 30) / 9 + mg / 90) + 1, 0, 9);
    if (lv < 8) out[1] = 0;
    if (lv < 18) out[2] = 0;
    if (lv < 30) out[3] = 0;
    return out;
  };

  S.restore = function (id) {
    var c = WM.state.chars[id];
    c.hp = S.stats(id).mhp;
    c.mp = S.maxMp(id).slice();
    c.status = {};
  };
  S.restoreParty = function () { WM.state.party.forEach(S.restore); };
  S.restoreAll = function () { WM.state.recruited.concat(WM.state.party).forEach(function (id) { if (WM.state.chars[id]) S.restore(id); }); };

  S.gainExp = function (id, amt) {
    var c = WM.state.chars[id];
    if (!c || c.lv >= S.MAX_LV) return false;
    c.exp += amt;
    var up = false;
    while (c.exp >= S.EXP_PER_LV && c.lv < S.MAX_LV) {
      var before = S.stats(id).mhp;
      c.exp -= S.EXP_PER_LV; c.lv++; up = true;
      var after = S.stats(id).mhp;
      c.hp += after - before;
      var mm = S.maxMp(id);
      for (var i = 0; i < 4; i++) c.mp[i] = Math.min(mm[i], c.mp[i] + (mm[i] > 0 ? 1 : 0));
    }
    return up;
  };
  // Suikoden-style: exp scales with level gap so latecomers catch up quickly.
  S.expFor = function (charLv, enemyLv, baseExp) {
    var diff = enemyLv - charLv;
    var e = (baseExp || 100) * Math.pow(2, diff / 3);
    return Math.max(1, Math.min(1000, Math.round(e)));
  };

  // Level new recruits close to the party average so they are usable.
  S.partyAvgLv = function () {
    var p = WM.state.party, n = 0, sum = 0;
    for (var i = 0; i < p.length; i++) { var c = WM.state.chars[p[i]]; if (c) { sum += c.lv; n++; } }
    return n ? Math.round(sum / n) : 1;
  };

  // ---------- recruiting ----------
  S.recruit = function (id, lv) {
    var st = WM.state;
    if (st.recruited.indexOf(id) >= 0) return false;
    var d = S.def(id);
    var target = lv || Math.max(d.lv || 1, S.partyAvgLv() - 2);
    S.initChar(id, target);
    st.recruited.push(id);
    return true;
  };
  S.isRecruited = function (id) { return WM.state.recruited.indexOf(id) >= 0; };
  S.starCount = function () {
    var n = 0, st = WM.state;
    st.recruited.forEach(function (id) { var d = S.def(id); if (d && d.rank && !st.dead[id]) n++; });
    return n;
  };

  S.setParty = function (ids) {
    WM.state.party = ids.slice(0, 6);
    ids.forEach(function (id) { if (!WM.state.chars[id]) S.initChar(id); });
    if (!WM.state.leader || ids.indexOf(WM.state.leader) < 0) WM.state.leader = ids[0];
  };
  S.addToParty = function (id) {
    var p = WM.state.party;
    if (p.indexOf(id) >= 0 || p.length >= 6) return false;
    if (!WM.state.chars[id]) S.initChar(id);
    p.push(id); return true;
  };
  S.removeFromParty = function (id) {
    var p = WM.state.party, i = p.indexOf(id);
    if (i >= 0) p.splice(i, 1);
  };
  S.alive = function (id) { var c = WM.state.chars[id]; return c && c.hp > 0; };

  // ---------- inventory ----------
  S.give = function (item, n) {
    n = n == null ? 1 : n;
    if (!WM.data.items[item]) throw new Error('Unknown item ' + item);
    var inv = WM.state.inv;
    inv[item] = (inv[item] || 0) + n;
    if (inv[item] <= 0) delete inv[item];
  };
  S.count = function (item) { return WM.state.inv[item] || 0; };
  S.take = function (item, n) { S.give(item, -(n || 1)); };
  S.invList = function (filter) {
    var out = [];
    for (var k in WM.state.inv) { var it = WM.data.items[k]; if (it && (!filter || filter(it))) out.push({ id: k, it: it, n: WM.state.inv[k] }); }
    out.sort(function (a, b) { return (a.it.order || 0) - (b.it.order || 0) || a.it.name.localeCompare(b.it.name); });
    return out;
  };

  // ---------- flags ----------
  S.flag = function (k, v) { if (v === undefined) return WM.state ? WM.state.flags[k] : undefined; WM.state.flags[k] = v; return v; };
  S.has = function (k) { return !!(WM.state && WM.state.flags[k]); };

  // ---------- save / load ----------
  var KEY = 'wm_outlaws_save_';
  S.SLOTS = 8;
  S.save = function (slot) {
    var st = WM.state;
    st.savedAt = Date.now();
    try {
      localStorage.setItem(KEY + slot, JSON.stringify(st));
      return true;
    } catch (e) { console.warn('save failed', e); return false; }
  };
  S.load = function (slot) {
    try {
      var raw = localStorage.getItem(KEY + slot);
      if (!raw) return false;
      var loaded = JSON.parse(raw);
      var defaults = S.newGame(); // forward-compat defaults for fields added after the save was made
      for (var k in defaults) if (loaded[k] === undefined) loaded[k] = defaults[k];
      WM.state = loaded;
      return true;
    } catch (e) { console.warn('load failed', e); return false; }
  };
  S.peek = function (slot) {
    try {
      var raw = localStorage.getItem(KEY + slot);
      if (!raw) return null;
      var s = JSON.parse(raw);
      var ch = WM.data.chapters[s.chapter] || {};
      return { chapter: s.chapter, chapterTitle: ch.short || '', time: s.playtime, leader: s.leader, stars: (s.recruited || []).filter(function (id) { var d = WM.data.chars[id]; return d && d.rank && !(s.dead || {})[id]; }).length, savedAt: s.savedAt, mapName: (WM.data.maps[s.map] || {}).name || '' };
    } catch (e) { return null; }
  };
  S.anySave = function () { for (var i = 0; i < S.SLOTS; i++) if (S.peek(i)) return true; return false; };
})();
