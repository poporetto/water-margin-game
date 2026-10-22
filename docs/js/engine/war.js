// Army battles in the style of Suikoden II's "massive battles":
// grid map, units led by a hero with up to two supports, Cavalry > Archers > Magic > Cavalry,
// each unit can take two losses before it retreats, support heroes grant abilities.
// Faithful to the novel: no hero dies in these battles unless the story itself says so (wounded only).
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var W = WM.war = {};
  var SCN = { countsTime: true };
  WM.scenes.war = SCN;
  var CELL = 64, OX = 32, OY = 72, COLS = 14, ROWS = 7;

  var TYPE = {
    cav: { name: 'Cavalry', move: 4, range: 1, beats: 'arch' },
    inf: { name: 'Infantry', move: 3, range: 1, beats: 'arch' },
    arch: { name: 'Archers', move: 3, range: 2, beats: 'mage' },
    mage: { name: 'Sorcery', move: 2, range: 2, beats: 'cav' },
    naval: { name: 'Navy', move: 4, range: 1, beats: null, water: true }
  };
  var ABIL = {
    heal: 'Physician: once per battle, restore one loss to an adjacent unit.',
    scout: 'Divine March: +2 movement.',
    charge: 'Charge: +25% attack after moving.',
    guard: 'Shield Wall: +25% defence.',
    arrows: 'Hundred-Pace Archery: +2 range for archers.',
    thunder: 'Five Thunders: ranged sorcery (3), strong vs cavalry.',
    sorcery: 'Sorcery: ranged magic (3).',
    fire: 'Holy Fire: ranged fire (2).',
    water: 'Sacred Water: ranged water (2).',
    cannon: 'Fire Trebuchet: once per turn bombard at range 4.',
    stratagem: 'Stratagem: once per battle, all allied units may act again.',
    infiltrate: 'Infiltrate: once per battle, slip agents into an adjacent enemy unit — it falls into confusion, and cannot move or attack in its next turn.',
    naval: 'Water Warriors: unit can cross water.',
    morale: 'Rally: adjacent allies +10% attack.'
  };
  W.ABIL = ABIL;

  // The famous few have a deed of their own from the novel: an order they can give once in a battle (active),
  // or a way they always fight (passive). A hero brings it to any unit he leads or supports.
  var SIG = {
    timelyrain: { hero: 'songjiang', name: 'Timely Rain', active: true, desc: 'Timely Rain: once per battle, his name rallies the scattered men — every allied unit within 2 recovers one loss.' },
    willow: { hero: 'huarong', name: 'Through the Willow', active: true, desc: 'Through the Willow at a Hundred Paces: once per battle, a sure arrow into any enemy unit within 5.' },
    panther: { hero: 'linchong', name: 'Unhorse the General', active: true, desc: 'Unhorse the General: once per battle, the snake spear lifts the enemy leader from his saddle — a sure loss, and that unit fights at -25% for the rest of the battle.' },
    uproot: { hero: 'luzhishen', name: 'Uproot the Willow', active: true, desc: 'Uproot the Willow: once per battle, the iron staff sweeps every adjacent enemy unit.' },
    tiger: { hero: 'wusong', name: 'Tiger-Slayer\'s Fists', active: true, desc: 'Tiger-Slayer\'s Fists: once per battle, strike an adjacent enemy unit twice.' },
    stones: { hero: 'zhangqing', name: 'Featherless Stones', active: true, desc: 'Featherless Stones: once per battle, a stone knocks the enemy general from his horse — a unit within 2 cannot move or attack in the next enemy phase.' },
    lasso: { hero: 'husanniang', name: 'Red Lasso', active: true, desc: 'Red Lasso: once per battle, drag an enemy officer from the saddle — an adjacent unit takes a loss, and cannot strike back.' },
    bore: { hero: 'zhangshun', name: 'White Streak in the Waves', active: true, desc: 'White Streak in the Waves: once per battle, swim under an adjacent enemy on the water and hole its boats — a sure loss.' },
    flea: { hero: 'shiqian', name: 'Drum-Flea\'s Fire', active: true, desc: 'Drum-Flea\'s Fire: once per battle, slip behind the lines and set a fire — any enemy unit loses 30% defence for the rest of the battle.' },
    whirlwind: { hero: 'likui', name: 'Black Whirlwind', desc: 'Black Whirlwind: charges ahead whatever the orders — +40% attack, -25% defence.' },
    dragon: { hero: 'guansheng', name: 'Green-Dragon Blade', desc: 'Green-Dragon Blade: the heir of Lord Guan — when he attacks, the enemy cannot strike back.' },
    chained: { hero: 'huyanzhuo', name: 'Chained Cavalry', desc: 'Chained Cavalry: horses chained in line — +35% defence beside allied cavalry.' },
    hooks: { hero: 'xuning', name: 'Hooked Lances', desc: 'Hooked Lances: the lance that broke the chained horses — +60% attack against cavalry.' }
  };
  W.SIG = SIG;
  var HERO_SIG = {}; Object.keys(SIG).forEach(function (k) { HERO_SIG[SIG[k].hero] = k; });
  function hasSig(u, id) { return !!(u.sig && u.sig.indexOf(id) >= 0); }

  var TERR = {
    '.': { name: 'Plain', def: 0, col: '#6aa848', col2: '#5b9a3e' },
    'T': { name: 'Forest', def: 0.2, col: '#3c7a34', col2: '#2c6a2c', move: 2 },
    'm': { name: 'Hills', def: 0.25, col: '#9a8a6e', col2: '#8a7a5e', move: 2 },
    '~': { name: 'Water', def: 0, col: '#3b78c0', col2: '#2f67ad', water: true },
    'r': { name: 'Reeds', def: 0.3, col: '#6a8a5a', col2: '#4a7a8a', water: true, reeds: true },
    '#': { name: 'Wall', def: 0, col: '#8a8478', col2: '#6a655b', block: true },
    'G': { name: 'Gate', def: 0.4, col: '#7a5a3a', col2: '#5a3a1a' },
    'H': { name: 'Fort', def: 0.35, col: '#a7a49a', col2: '#8a877e' },
    ':': { name: 'Road', def: 0, col: '#b99b66', col2: '#a88a58' },
    'B': { name: 'Bridge', def: 0, col: '#9a6a3c', col2: '#7a4e28' },
    's': { name: 'Snow', def: 0, col: '#e6ecf2', col2: '#cdd6e2' },
    'x': { name: 'Cliff', def: 0, col: '#5f5243', col2: '#4f4233', block: true }
  };

  var RULES = 'Cavalry and infantry beat archers, archers beat sorcery, sorcery beats cavalry. Every unit faces the way it last moved or struck (the small arrow on its square). Strike it from the flank for +25% and a weaker counter; from behind for +50%, with no counter, and its ranks are shaken. Ranged attacks are never countered.';
  W.RULES = RULES;

  function charWar(id) {
    var d = WM.data.chars[id];
    var w = (d && d.war) || {};
    var lv = WM.state.chars[id] ? WM.state.chars[id].lv : (d && d.lv) || 10;
    return { atk: (w.atk || 4) * 10 + lv * 2, def: (w.def || 4) * 10 + lv * 2, ability: w.ability };
  }

  function mkUnit(side, o) {
    var u = { side: side, x: o.x, y: o.y, type: o.type || 'cav', losses: 0, done: false, commander: !!o.commander, supports: o.support || [], name: o.name, leader: o.leader, wounded: [], debuff: 0, usedAbil: {} };
    if (side === 'player') {
      var lw = charWar(o.leader);
      u.atk = lw.atk; u.def = lw.def; u.abil = [];
      if (lw.ability) u.abil.push(lw.ability);
      u.supports.forEach(function (sid) { var sw = charWar(sid); u.atk += Math.round(sw.atk * 0.45); u.def += Math.round(sw.def * 0.45); if (sw.ability) u.abil.push(sw.ability); });
      u.sig = [o.leader].concat(u.supports).map(function (id) { return HERO_SIG[id]; }).filter(Boolean); u.usedSig = {};
      if (!u.name) u.name = WM.data.chars[o.leader].name;
      if (o.leader && WM.data.chars[o.leader] && WM.data.chars[o.leader].war && WM.data.chars[o.leader].war.type && !o.type) u.type = WM.data.chars[o.leader].war.type;
    } else {
      u.atk = o.atk || 60; u.def = o.def || 60; u.abil = o.abil || [];
      u.portrait = o.portrait;
    }
    if (u.abil.indexOf('naval') >= 0 || u.type === 'naval') u.naval = true;
    u.atk = Math.round(u.atk * (o.mult || 1)); u.def = Math.round(u.def * (o.mult || 1));
    return u;
  }

  W.start = function (id, opt) {
    var d = WM.data.wars[id];
    if (!d) throw new Error('Unknown war ' + id);
    return new Promise(function (resolve) {
      var prev = WM.scene, prevMusic = WM.audio.current;
      var wr = W.cur = {
        id: id, d: d, opt: opt, turn: 1, phase: 'player', sel: null, cursor: { x: 0, y: 0 }, msg: null, fx: [],
        units: [], terrain: d.map, log: [], resolve: resolve
      };
      d.player.forEach(function (o) {
        // skip heroes not yet recruited (optional slots)
        if (o.optional && !S.isRecruited(o.leader)) return;
        var sup = (o.support || []).filter(function (sid) { return !o.optional || S.isRecruited(sid) || !o.supportOptional; });
        wr.units.push(mkUnit('player', Object.assign({}, o, { support: sup })));
      });
      d.enemy.forEach(function (o) { wr.units.push(mkUnit('enemy', o)); });
      wr.units.forEach(faceNearestFoe);   // everyone starts facing the enemy
      var first = wr.units.filter(function (u) { return u.side === 'player'; })[0];
      wr.cursor = { x: first.x, y: first.y };
      WM.fadeOut(0.5).then(function () {
        WM.setScene(SCN);
        WM.audio.play(d.music || 'war');
        return WM.fadeIn(0.5);
      }).then(function () { return run(wr); }).then(function (res) {
        return WM.fadeOut(0.5).then(function () {
          W.cur = null;
          if (prev) WM.setScene(prev, null, true);
          if (prevMusic) WM.audio.play(prevMusic);
          if (res !== 'lose' || opt.canLose) WM.fadeIn(0.5);
          resolve(res);
        });
      });
    });
  };

  function terr(x, y) { var r = W.cur.terrain[y]; var ch = r ? r[x] : null; return TERR[ch] || null; }
  function unitAt(x, y) { return W.cur.units.filter(function (u) { return u.x === x && u.y === y && u.losses < 2; })[0]; }
  function active(side) { return W.cur.units.filter(function (u) { return u.side === side && u.losses < 2; }); }
  function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
  // Every unit faces one of the four ways: where it last moved or struck. A blow to its flank or rear lands harder.
  function sgn(n) { return n > 0 ? 1 : n < 0 ? -1 : 0; }
  function dirTo(fx, fy, tx, ty, keep) {
    var dx = tx - fx, dy = ty - fy;
    if (!dx && !dy) return keep || { x: 1, y: 0 };
    return Math.abs(dx) >= Math.abs(dy) ? { x: sgn(dx), y: 0 } : { x: 0, y: sgn(dy) };
  }
  function faceNearestFoe(u) {
    var foes = active(u.side === 'player' ? 'enemy' : 'player').sort(function (p, q) { return dist(u, p) - dist(u, q); });
    if (foes.length) u.face = dirTo(u.x, u.y, foes[0].x, foes[0].y, u.face);
    else if (!u.face) u.face = { x: u.side === 'player' ? 1 : -1, y: 0 };
  }
  var ANGLE = {
    front: { label: 'Front', mult: 1, hit: 0, counter: 1 },
    flank: { label: 'Flank', mult: 1.25, hit: 0.03, counter: 0.6 },
    rear: { label: 'Rear', mult: 1.5, hit: 0.06, counter: 0 }
  };
  // where a blow from (ax, ay) falls on t, judged against the way t faces
  function angleAt(ax, ay, t) {
    var f = t.face || { x: 1, y: 0 }, dx = ax - t.x, dy = ay - t.y;
    var along = dx * f.x + dy * f.y, across = Math.abs(dx * f.y - dy * f.x);
    if (along > 0 && along >= across) return 'front';
    if (along < 0 && -along >= across) return 'rear';
    return 'flank';
  }
  function moveOf(u) { return TYPE[u.type].move + (u.abil.indexOf('scout') >= 0 ? 2 : 0); }
  function rangeOf(u) {
    var r = TYPE[u.type].range;
    if (u.type === 'arch' && u.abil.indexOf('arrows') >= 0) r += 1;
    if (u.abil.indexOf('thunder') >= 0 || u.abil.indexOf('sorcery') >= 0) r = Math.max(r, 3);
    if (u.abil.indexOf('fire') >= 0 || u.abil.indexOf('water') >= 0) r = Math.max(r, 2);
    return r;
  }

  // flood-fill reachable cells
  function reach(u) {
    var out = {}, q = [[u.x, u.y, 0]];
    out[u.x + ',' + u.y] = 0;
    var mv = moveOf(u);
    while (q.length) {
      var c = q.shift();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = c[0] + d[0], ny = c[1] + d[1];
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
        var t = terr(nx, ny); if (!t || t.block) return;
        if (t.water && !u.naval) return;
        var o = unitAt(nx, ny); if (o && o.side !== u.side) return;
        var cost = c[2] + (t.move || 1);
        if (cost > mv) return;
        var k = nx + ',' + ny;
        if (out[k] != null && out[k] <= cost) return;
        out[k] = cost; q.push([nx, ny, cost]);
      });
    }
    // can't end on an occupied ally cell
    for (var k in out) { var p = k.split(','); var o2 = unitAt(+p[0], +p[1]); if (o2 && o2 !== u) delete out[k]; }
    return out;
  }

  async function run(wr) {
    var d = wr.d;
    for (var i = 0; i < (d.intro || []).length; i++) await UI.message(d.intro[i][0], d.intro[i][1]);
    await turnEvents(wr);
    while (true) {
      // player phase
      wr.phase = 'player';
      active('player').forEach(function (u) { u.done = !!u.confused; u.moved = false; u.cannonUsed = false; });   // a confused unit sits this turn out
      await banner(wr, 'Turn ' + wr.turn + ' — Liangshan moves');
      var dazed = active('player').filter(function (u) { return u.confused; });
      for (var di = 0; di < dazed.length; di++) { wr.cursor = { x: dazed[di].x, y: dazed[di].y }; await banner(wr, dazed[di].name + '\'s unit is in confusion, and cannot move or attack this turn.', 1); }
      if (active('player').some(function (u) { return !u.done; })) await playerPhase(wr);
      wr.units.forEach(function (u) { if (u.side === 'player') { u.shaken = false; u.confused = false; } });
      var res = checkEnd(wr); if (res) return await endWar(wr, res);
      // enemy phase
      wr.phase = 'enemy';
      await banner(wr, 'Enemy moves');
      await enemyPhase(wr);
      wr.units.forEach(function (u) { if (u.side === 'enemy') { u.shaken = false; u.confused = false; } });
      res = checkEnd(wr); if (res) return await endWar(wr, res);
      wr.turn++;
      await turnEvents(wr);
      res = checkEnd(wr); if (res) return await endWar(wr, res);
      if (d.turns && wr.turn > d.turns) return await endWar(wr, d.goal && d.goal.survive ? 'win' : 'lose');
    }
  }

  async function turnEvents(wr) {
    var evs = (wr.d.events || []).filter(function (e) { return e.turn === wr.turn && !e.done; });
    for (var i = 0; i < evs.length; i++) {
      evs[i].done = true;
      await WM.script.run(function (s) { return evs[i].run(s, W.api(wr)); });
    }
  }
  // helpers usable by war events
  W.api = function (wr) {
    return {
      addUnit: function (side, o) { var u = mkUnit(side, o); wr.units.push(u); faceNearestFoe(u); },
      rout: function (name) { wr.units.forEach(function (u) { if (u.name === name || u.leader === name) u.losses = 2; }); },
      // throw a side (or one unit, by name or leader) into confusion: it cannot move or attack in its next turn
      confuse: function (who) { wr.units.forEach(function (u) { if (u.losses < 2 && (u.side === who || u.name === who || u.leader === who)) u.confused = true; }); },
      weaken: function (side, f) { wr.units.forEach(function (u) { if (u.side === side) { u.def = Math.round(u.def * f); u.atk = Math.round(u.atk * f); } }); },
      unit: function (name) { return wr.units.filter(function (u) { return u.name === name || u.leader === name; })[0]; },
      win: function () { wr.forced = 'win'; },
      lose: function () { wr.forced = 'lose'; }
    };
  };

  function checkEnd(wr) {
    if (wr.forced) return wr.forced;
    var goal = wr.d.goal || 'rout';
    var pc = active('player'), ec = active('enemy');
    if (!pc.length) return 'lose';
    if (wr.units.some(function (u) { return u.side === 'player' && u.commander && u.losses >= 2; })) return 'lose';
    if (!ec.length) return 'win';
    if (goal === 'commander' && wr.units.some(function (u) { return u.side === 'enemy' && u.commander && u.losses >= 2; })) return 'win';
    if (goal.reach) { if (pc.some(function (u) { return u.x === goal.reach[0] && u.y === goal.reach[1]; })) return 'win'; }
    return null;
  }

  async function endWar(wr, res) {
    var lines = res === 'win' ? wr.d.win : wr.d.lose;
    await banner(wr, res === 'win' ? 'Victory' : 'Defeat', 1.2);
    for (var i = 0; i < (lines || []).length; i++) await UI.message(lines[i][0], lines[i][1]);
    // wounded heroes are restored afterwards (the novel's heroes all survive until the southern campaign)
    return res;
  }

  function banner(wr, text, dur) {
    wr.msg = { text: text, t: 0 };
    return WM.wait(dur || 0.9).then(function () { wr.msg = null; });
  }

  // ---------- player phase ----------
  function playerPhase(wr) {
    return new Promise(function (resolve) {
      wr.mode = 'cursor';
      wr._resolvePhase = resolve;
      var w = {
        isWarInput: true,
        update: function () {
          if (wr.busy) return;
          if (wr.mode === 'cursor') {
            moveCursor(wr);
            if (I.pressed('ok')) {
              I.clear();
              var u = unitAt(wr.cursor.x, wr.cursor.y);
              if (u && u.side === 'player' && !u.done) { wr.sel = u; wr.reach = reach(u); wr.mode = 'move'; wr.orig = { x: u.x, y: u.y }; WM.audio.sfx('ok'); }
              else if (!u || u.side !== 'player' || u.done) { openPhaseMenu(wr, w, resolve); }
            } else if (I.pressed('menu')) { I.clear(); openPhaseMenu(wr, w, resolve); }
          } else if (wr.mode === 'move') {
            moveCursor(wr);
            if (I.pressed('ok')) {
              I.clear();
              var k = wr.cursor.x + ',' + wr.cursor.y;
              if (wr.reach[k] != null) {
                wr.sel.moved = !(wr.cursor.x === wr.sel.x && wr.cursor.y === wr.sel.y);
                wr.origFace = wr.sel.face;
                wr.sel.face = dirTo(wr.sel.x, wr.sel.y, wr.cursor.x, wr.cursor.y, wr.sel.face);   // it faces the way it marched
                slideTo(wr.sel, wr.cursor.x, wr.cursor.y);
                wr.sel.x = wr.cursor.x; wr.sel.y = wr.cursor.y; wr.reach = null;
                WM.audio.sfx('step');
                actionMenu(wr, w);
              } else WM.audio.sfx('buzz');
            }
            if (I.pressed('cancel')) { I.clear(); wr.mode = 'cursor'; wr.sel = null; wr.reach = null; }
          } else if (wr.mode === 'target') {
            var ts = wr.targets;
            if (I.pressed('left') || I.pressed('up')) { wr.tIdx = (wr.tIdx + ts.length - 1) % ts.length; WM.audio.sfx('cursor'); }
            if (I.pressed('right') || I.pressed('down')) { wr.tIdx = (wr.tIdx + 1) % ts.length; WM.audio.sfx('cursor'); }
            var t = ts[wr.tIdx]; wr.cursor = { x: t.x, y: t.y };
            if (I.pressed('ok')) {
              I.clear(); var act = wr.pendingAct; wr.mode = 'busy';
              wr.busy = true;
              doAction(wr, wr.sel, t, act).then(function () { wr.busy = false; finishUnit(wr, w); });
            }
            if (I.pressed('cancel')) { I.clear(); wr.cursor = { x: wr.sel.x, y: wr.sel.y }; actionMenu(wr, w); }
          } else if (wr.mode === 'face') {
            // the unit stands where it is and turns to meet the enemy
            var fu = wr.sel;
            if (I.pressed('left')) fu.face = { x: -1, y: 0 };
            if (I.pressed('right')) fu.face = { x: 1, y: 0 };
            if (I.pressed('up')) fu.face = { x: 0, y: -1 };
            if (I.pressed('down')) fu.face = { x: 0, y: 1 };
            if (I.pressed('ok')) { I.clear(); WM.audio.sfx('ok'); finishUnit(wr, w); }
            else if (I.pressed('cancel')) { I.clear(); fu.face = wr.waitFace; actionMenu(wr, w); }
          }
        },
        draw: function () {}
      };
      UI.push(w);
    });
  }
  function moveCursor(wr) {
    if (I.pressed('left')) wr.cursor.x = Math.max(0, wr.cursor.x - 1);
    if (I.pressed('right')) wr.cursor.x = Math.min(COLS - 1, wr.cursor.x + 1);
    if (I.pressed('up')) wr.cursor.y = Math.max(0, wr.cursor.y - 1);
    if (I.pressed('down')) wr.cursor.y = Math.min(ROWS - 1, wr.cursor.y + 1);
  }
  function enemiesInRange(u, r) { return active(u.side === 'player' ? 'enemy' : 'player').filter(function (e) { return dist(u, e) <= r; }); }

  function actionMenu(wr, w) {
    var u = wr.sel;
    var items = [];
    var melee = enemiesInRange(u, 1), ranged = enemiesInRange(u, rangeOf(u));
    if (ranged.length) items.push({ label: rangeOf(u) > 1 ? 'Attack (range ' + rangeOf(u) + ')' : 'Attack', v: 'attack', help: rangeOf(u) > 1 ? 'Strike an enemy unit up to ' + rangeOf(u) + ' squares away. A blow from afar is never answered; one from the side lands +25%, from behind +50%.' : 'Strike an adjacent enemy unit. It strikes back from the front; less from the side (+25% to you); not at all from behind (+50%).' });
    if (u.abil.indexOf('cannon') >= 0 && !u.cannonUsed && enemiesInRange(u, 4).length) items.push({ label: 'Fire Trebuchet', v: 'cannon', help: ABIL.cannon });
    if (u.abil.indexOf('heal') >= 0 && !u.usedAbil.heal && active('player').some(function (a) { return a.losses > 0 && dist(a, u) <= 1; })) items.push({ label: 'Treat Wounded', v: 'heal', help: ABIL.heal });
    if (u.abil.indexOf('infiltrate') >= 0 && !u.usedAbil.infiltrate && melee.length) items.push({ label: 'Infiltrate', v: 'infiltrate', help: ABIL.infiltrate });
    if (u.abil.indexOf('stratagem') >= 0 && !wr.stratUsed) items.push({ label: 'Stratagem', v: 'stratagem', help: ABIL.stratagem });
    // the hero's own deed, while it is still to be done this battle
    (u.sig || []).forEach(function (id) {
      if (!SIG[id].active || u.usedSig[id]) return;
      var pool = sigTargets(u, id);
      if (pool && pool.length) items.push({ label: '\u2605 ' + SIG[id].name, v: 'sig:' + id, help: SIG[id].desc });
    });
    items.push({ label: 'Wait', v: 'wait', help: 'Stand here, and choose which way the unit faces.' });
    UI.remove(w);
    UI.choose(items, { x: 700, y: 120, title: u.name, help: items.some(function (it) { return it.help; }) }).then(function (k) {
      UI.push(w);
      if (k < 0) { u.slide = null; u.x = wr.orig.x; u.y = wr.orig.y; u.face = wr.origFace || u.face; wr.mode = 'move'; wr.reach = reach(u); wr.cursor = { x: u.x, y: u.y }; return; }
      var v = items[k].v;
      if (v === 'wait') { wr.waitFace = u.face; wr.cursor = { x: u.x, y: u.y }; wr.mode = 'face'; return; }
      if (v === 'stratagem') {
        wr.stratUsed = true; wr.busy = true;
        banner(wr, 'Stratagem! All units may act again.').then(function () { active('player').forEach(function (a) { a.done = false; }); u.done = true; wr.busy = false; wr.mode = 'cursor'; wr.sel = null; });
        return;
      }
      if (v.indexOf('sig:') === 0) {
        var sid = v.slice(4);
        if (sid === 'uproot' || sid === 'timelyrain') { wr.busy = true; wr.mode = 'busy'; sigOrder(wr, u, sid).then(function () { wr.busy = false; finishUnit(wr, w); }); return; }
        wr.targets = sigTargets(u, sid); wr.tIdx = 0; wr.pendingAct = v; wr.mode = 'target'; return;
      }
      if (v === 'heal') {
        var pts = active('player').filter(function (a) { return a.losses > 0 && dist(a, u) <= 1; });
        wr.targets = pts; wr.tIdx = 0; wr.pendingAct = 'heal'; wr.mode = 'target'; return;
      }
      var pool = v === 'cannon' ? enemiesInRange(u, 4) : v === 'infiltrate' ? melee : ranged;
      wr.targets = pool; wr.tIdx = 0; wr.pendingAct = v; wr.mode = 'target';
    });
  }

  // who a hero's deed can reach (for the orders with no target, a non-empty list means it can be given)
  function sigTargets(u, id) {
    var foes = active(u.side === 'player' ? 'enemy' : 'player');
    if (id === 'willow') return foes.filter(function (e) { return dist(u, e) <= 5; });
    if (id === 'stones') return foes.filter(function (e) { return dist(u, e) <= 2; });
    if (id === 'flea') return foes;
    if (id === 'bore') return foes.filter(function (e) { var t = terr(e.x, e.y); return dist(u, e) <= 1 && (e.naval || (t && t.water)); });
    if (id === 'panther' || id === 'tiger' || id === 'lasso' || id === 'uproot') return foes.filter(function (e) { return dist(u, e) <= 1; });
    if (id === 'timelyrain') return active(u.side).filter(function (o) { return o.losses > 0 && dist(o, u) <= 2; });
    return [];
  }

  function finishUnit(wr, w) {
    if (wr.sel) wr.sel.done = true;
    wr.sel = null; wr.reach = null; wr.mode = 'cursor';
    if (checkEnd(wr) || !active('player').some(function (u) { return !u.done; })) { UI.remove(w); wr._resolvePhase(); }
  }

  function openPhaseMenu(wr, w, resolve) {
    UI.remove(w);
    UI.choose([{ label: 'End Turn' }, { label: 'Unit List' }, { label: 'Battle Objective' }, { label: 'Rules of War' }, { label: 'Resume' }], { x: 700, y: 120 }).then(function (k) {
      if (k === 0) { resolve(); return; }
      UI.push(w);
      if (k === 1) unitList(wr);
      if (k === 2) UI.message(null, objectiveText(wr));
      if (k === 3) UI.message(null, RULES);
    });
  }
  function objectiveText(wr) {
    var g = wr.d.goal || 'rout';
    var s = g === 'rout' ? 'Victory: rout every enemy unit.' : g === 'commander' ? 'Victory: rout the enemy commander.' : g.reach ? 'Victory: reach the marked objective.' : g.survive ? 'Victory: hold out for ' + wr.d.turns + ' turns.' : '';
    return s + ' Defeat: the commander\'s unit is routed' + (wr.d.turns && !g.survive ? ', or ' + wr.d.turns + ' turns pass' : '') + '.';
  }
  function unitList(wr) {
    var items = active('player').map(function (u) {
      // what the unit can do, in words: its skills and its heroes' deeds
      var skills = u.abil.map(function (a) { return ABIL[a] || a; }).concat((u.sig || []).map(function (id) { return SIG[id].desc + (SIG[id].active && u.usedSig[id] ? ' (used)' : ''); }));
      return { label: (u.done ? '\u2713 ' : '') + u.name + ' (' + TYPE[u.type].name + ')', right: 'ATK ' + u.atk + ' DEF ' + u.def + (u.losses ? '  Loss ' + u.losses : ''), help: skills.length ? skills.join('  ') : 'No special skills.' };
    });
    UI.choose(items, { x: 120, y: 60, w: 720, title: 'Units', help: true }).then(function (k) {
      if (k >= 0) { var u = active('player')[k]; wr.cursor = { x: u.x, y: u.y }; }
    });
  }

  // ---------- combat ----------
  function power(u, other, attacking) {
    var a = u.atk;
    if (attacking && u.moved && u.abil.indexOf('charge') >= 0) a *= 1.25;
    if (TYPE[u.type].beats === other.type) a *= 1.3;
    if (active(u.side).some(function (o) { return o !== u && dist(o, u) <= 1 && o.abil.indexOf('morale') >= 0; })) a *= 1.1;
    if (hasSig(u, 'whirlwind')) a *= 1.4;
    if (hasSig(u, 'hooks') && other.type === 'cav') a *= 1.6;
    a *= 1 - (u.atkDebuff || 0);
    if (u.shaken) a *= 0.85;
    return a;
  }
  function defence(u) {
    var t = terr(u.x, u.y);
    var d = u.def * (1 + (t ? t.def : 0));
    if (u.abil.indexOf('guard') >= 0) d *= 1.25;
    if (hasSig(u, 'whirlwind')) d *= 0.75;
    if (hasSig(u, 'chained') && active(u.side).some(function (o) { return o !== u && o.type === 'cav' && dist(o, u) <= 1; })) d *= 1.35;
    d *= 1 - (u.debuff || 0);
    if (u.shaken) d *= 0.85;
    return d;
  }
  // the odds of one blow, as the clash rolls them and the target preview shows them
  function odds(a, t, act) {
    var ranged = act === 'cannon' || dist(a, t) > 1;
    var ang = angleAt(a.x, a.y, t), A = ANGLE[ang];
    var ap = power(a, t, true) * (act === 'cannon' ? 1.4 : 1) * A.mult, dp = defence(t);
    var ratio = ap / (ap + dp);
    var noCounter = ranged || hasSig(a, 'dragon') || !!(act && act.noCounter);
    return {
      ang: ang, ranged: ranged,
      hit: Math.min(0.95, 0.25 + ratio * 0.6 + A.hit),
      counter: noCounter ? 0 : (0.15 + (1 - ratio) * 0.45) * A.counter
    };
  }
  async function doAction(wr, a, t, act) {
    if (act === 'heal') {
      t.losses = Math.max(0, t.losses - 1); a.usedAbil.heal = true;
      WM.audio.sfx('heal'); fxAt(wr, t, 'heal'); await banner(wr, t.name + '\'s unit recovers.');
      return;
    }
    if (act === 'infiltrate') {
      t.confused = true; a.usedAbil.infiltrate = true; WM.audio.sfx('miss'); fxAt(wr, t, 'smoke'); await banner(wr, t.name + '\'s ranks are thrown into confusion! They cannot move or attack next turn.', 1.3);
      return;
    }
    if (typeof act === 'string' && act.indexOf('sig:') === 0) return sigDeed(wr, a, t, act.slice(4));
    var ranged = act === 'cannon' || dist(a, t) > 1;
    if (act === 'cannon') a.cannonUsed = true;
    await clash(wr, a, t, ranged, act);
  }
  // a sure loss on a unit, with its own sound and words
  async function sureLoss(wr, t, kind, sfx, text) {
    WM.audio.sfx(sfx); fxAt(wr, t, kind); animate(t, 'hit', null, 0.15); await WM.wait(0.4);
    t.losses++; fallFx(wr, t, t.losses - 1); G.shake = 3;
    await banner(wr, text + (t.losses >= 2 ? '  ' + t.name + '\'s unit is routed!' : ''), 1.3);
  }
  async function sigDeed(wr, a, t, id) {
    a.usedSig[id] = true;
    a.face = dirTo(a.x, a.y, t.x, t.y, a.face);
    var who = WM.data.chars[SIG[id].hero].name;
    if (id === 'willow') return sureLoss(wr, t, 'arrows', 'arrow', who + '\'s arrow finds ' + t.name + ' at a hundred paces!');
    if (id === 'panther') { t.atkDebuff = 0.25; return sureLoss(wr, t, 'clash', 'crit', who + '\'s snake spear lifts ' + t.name + ' from the saddle!'); }
    if (id === 'bore') return sureLoss(wr, t, 'smoke', 'splash', who + ' comes up under the boats — ' + t.name + '\'s hulls are holed!');
    if (id === 'lasso') return sureLoss(wr, t, 'clash', 'hit', who + '\'s red lasso drags an officer of ' + t.name + '\'s from the saddle!');
    if (id === 'stones') { t.confused = 'leaderless'; WM.audio.sfx('hit'); fxAt(wr, t, 'clash'); await banner(wr, who + '\'s stone knocks ' + t.name + ' from his horse — the unit stands leaderless!', 1.4); return; }
    if (id === 'flea') { t.debuff = Math.max(t.debuff || 0, 0.3); WM.audio.sfx('fire'); fxAt(wr, t, 'boom'); await banner(wr, 'Fire behind the lines! ' + t.name + '\'s ranks are thrown into disorder.', 1.4); return; }
    if (id === 'tiger') { await banner(wr, who + ' throws down his weapons and goes in with his fists!', 1); await clash(wr, a, t, false, 'attack'); if (t.losses < 2 && a.losses < 2) await clash(wr, a, t, false, 'attack'); return; }
  }
  async function sigOrder(wr, a, id) {   // the deeds that need no single target
    a.usedSig[id] = true;
    var who = WM.data.chars[SIG[id].hero].name;
    if (id === 'uproot') {
      await banner(wr, who + ' plants his feet and swings the iron staff!', 1);
      var near = enemiesInRange(a, 1);
      for (var i = 0; i < near.length; i++) if (near[i].losses < 2) await clash(wr, a, near[i], false, { noCounter: true });
      return;
    }
    if (id === 'timelyrain') {
      var hurt = active(a.side).filter(function (o) { return o.losses > 0 && dist(o, a) <= 2; });
      hurt.forEach(function (o) { o.losses--; fxAt(wr, o, 'heal'); });
      WM.audio.sfx('heal');
      await banner(wr, 'Timely Rain! The scattered men come back to ' + who + '\'s banner.', 1.4);
    }
  }
  async function clash(wr, a, t, ranged, act) {
    var magic = a.abil.indexOf('thunder') >= 0 || a.abil.indexOf('sorcery') >= 0 || a.abil.indexOf('fire') >= 0 || a.abil.indexOf('water') >= 0;
    var sfx = act === 'cannon' ? 'cannon' : a.abil.indexOf('thunder') >= 0 ? 'thunder' : a.abil.indexOf('fire') >= 0 ? 'fire' : a.abil.indexOf('water') >= 0 ? 'water' : ranged ? 'arrow' : 'drum';
    WM.audio.sfx(sfx);
    fxAt(wr, t, act === 'cannon' ? 'boom' : magic && ranged ? (a.abil.indexOf('thunder') >= 0 ? 'thunder' : 'magic') : ranged ? 'arrows' : 'clash');
    var o = odds(a, t, act);
    a.face = dirTo(a.x, a.y, t.x, t.y, a.face);   // the attacker turns to its blow
    animate(a, o.ranged ? 'shoot' : 'lunge', t);
    // the target may take a loss; the attacker may take one in the counter (never from behind, less from the flank)
    var tLoss = Math.random() < o.hit;
    var aLoss = Math.random() < o.counter;
    if (tLoss) animate(t, 'hit', null, o.ranged ? 0.3 : 0.18);   // struck as the charge lands (or the volley)
    await WM.wait(0.45);
    var outcome = o.ang === 'rear' ? 'Struck from behind! ' : o.ang === 'flank' ? 'Caught on the flank! ' : '';
    if (o.ang === 'rear' && tLoss) WM.audio.sfx('crit');
    if (tLoss) { t.losses++; fallFx(wr, t, t.losses - 1); outcome += t.losses >= 2 ? t.name + '\'s unit is routed!' : t.name + '\'s unit takes losses.'; }
    else outcome += t.name + '\'s unit holds firm.';
    if (t.losses < 2 && o.ang === 'rear' && !t.shaken) { t.shaken = true; outcome += '  Its ranks are shaken.'; }
    // a unit that survives hand-to-hand fighting wheels round to meet its attacker, so a back is open to one blow, not to all
    if (t.losses < 2 && !o.ranged) t.face = dirTo(t.x, t.y, a.x, a.y, t.face);
    if (aLoss) { a.losses++; animate(a, 'hit'); fallFx(wr, a, a.losses - 1); outcome += a.losses >= 2 ? '  ' + a.name + '\'s unit falls back!' : '  ' + a.name + '\'s unit is hurt in the clash.'; }
    G.shake = o.ang === 'rear' && tLoss ? 4 : 2;
    await banner(wr, outcome, 1.1);
    [t, a].forEach(function (u) { if (u.losses >= 2 && u.side === 'player') u.wounded = [u.leader].concat(u.supports); });
  }
  function fxAt(wr, u, kind) { wr.fx.push({ x: u.x, y: u.y, kind: kind, t: 0 }); }

  // ---------- enemy AI ----------
  async function enemyPhase(wr) {
    var es = active('enemy');
    for (var i = 0; i < es.length; i++) {
      var e = es[i];
      if (e.losses >= 2) continue;
      if (!active('player').length) return;
      if (e.hold && !enemiesInRange(e, rangeOf(e) + 1).length) continue; // garrison units stay put
      if (e.confused) { wr.cursor = { x: e.x, y: e.y }; await banner(wr, e.confused === 'leaderless' ? e.name + '\'s unit is without its general, and does not move.' : e.name + '\'s unit is in confusion, and cannot move or attack.', 0.9); continue; }
      var plan = planEnemy(e), travel = 0;
      wr.actor = e;
      if (plan.x !== e.x || plan.y !== e.y) { e.moved = true; e.face = dirTo(e.x, e.y, plan.x, plan.y, e.face); travel = slideTo(e, plan.x, plan.y); e.x = plan.x; e.y = plan.y; }
      else e.moved = false;
      wr.cursor = { x: e.x, y: e.y };
      await WM.wait(Math.max(0.25, travel + 0.05));
      if (plan.target && plan.target.losses < 2 && dist(e, plan.target) <= rangeOf(e)) {
        await clash(wr, e, plan.target, dist(e, plan.target) > 1, 'attack');
        if (checkEnd(wr)) return;
      } else faceNearestFoe(e);   // nothing to strike: turn to meet the enemy rather than show it a back
    }
    wr.actor = null;
  }

  // How badly a unit standing at (x, y) and facing f could be caught next turn: the worst angle each foe can reach.
  function exposure(x, y, f, threats) {
    var pen = 0, ghost = { x: x, y: y, face: f };
    threats.forEach(function (th) {
      var worst = 0;
      for (var k in th.R) {
        var p = k.split(','), tx = +p[0], ty = +p[1];
        var dd = Math.abs(tx - x) + Math.abs(ty - y);
        if (!dd || dd > th.rg) continue;
        var ang = angleAt(tx, ty, ghost);
        worst = Math.max(worst, ang === 'rear' ? 2 : ang === 'flank' ? 1 : 0);
        if (worst === 2) break;
      }
      pen += worst === 2 ? 110 : worst === 1 ? 45 : 0;
    });
    return pen;
  }
  // The enemy weighs every cell it can reach against every unit it could strike from there: the odds of the blow
  // (so flanks and backs are sought out), wounded units and the commander, the ground, and how open it is left.
  function planEnemy(e) {
    var foes = active('player'), R = reach(e), rg = rangeOf(e);
    var threats = foes.map(function (q) { return { R: reach(q), rg: rangeOf(q) }; });
    var care = e.commander ? 2.5 : 1;   // a general minds his own back more than a captain does
    var ox = e.x, oy = e.y, om = e.moved;
    var best = { x: ox, y: oy, target: null }, bestScore = -1e9;
    for (var k in R) {
      var p = k.split(','), x = +p[0], y = +p[1];
      e.x = x; e.y = y; e.moved = x !== ox || y !== oy;
      var td = terr(x, y).def;
      var near = null, nd = 1e9;
      foes.forEach(function (t) {
        var dd = dist(e, t);
        if (dd < nd) { nd = dd; near = t; }
        if (dd > rg) return;
        var o = odds(e, t, 'attack');
        var score = 1000 + o.hit * 400 - o.counter * 260 + (t.losses ? 220 : 0) + (t.commander ? 100 : 0) + td * 80 + (rg > 1 ? dd * 5 : 0)
          - exposure(x, y, dirTo(x, y, t.x, t.y), threats) * care;
        if (score > bestScore) { bestScore = score; best = { x: x, y: y, target: t }; }
      });
      if (near && nd > rg) {
        var s2 = -nd * 10 + td * 15 - exposure(x, y, dirTo(x, y, near.x, near.y), threats) * 0.3 * care;
        if (s2 > bestScore) { bestScore = s2; best = { x: x, y: y, target: null }; }
      }
    }
    e.x = ox; e.y = oy; e.moved = om;
    return best;
  }

  // ---------- the battlefield, painted with the field-map tiles ----------
  // War letters that mean something else to the tile painter (H is a poplar there, s sand, x the void).
  var TILE_OF = { 'H': '^', 's': '.', 'x': 'M' };
  function warTheme(wr) {
    if (wr.d.theme) return wr.d.theme;
    var rows = wr.terrain.join(''), wet = (rows.match(/[~r]/g) || []).length;
    if (rows.indexOf('s') >= 0) return 'snow';
    if (/^ch2[12]_/.test(wr.id)) return 'north';    // Liao and Hedong
    if (/^ch23_/.test(wr.id)) return 'south';       // Fang La's Jiangnan
    return wet >= 10 ? 'marsh' : 'spring';
  }
  // Bake the 14x7 grid once, with a one-tile border copied from its edges so shores, roads and walls join up
  // at the rim; then the tall pieces (tree crowns, gate towers) of the board's own cells, top row first.
  var TREE = 'TPl';   // trees, pines, willows: drawn whole and shrunk into a grove inside their square
  // each little tree as [centre x, foot y, height], in squares, back to front
  var GROVE2 = [[0.3, 0.74, 0.74], [0.7, 0.98, 0.74]];
  var GROVE3 = [[0.26, 0.6, 0.64], [0.75, 0.64, 0.64], [0.5, 0.99, 0.68]];
  function bakeBoard(wr) {
    var T = WM.tiles; if (!T || !T.bake) return null;
    var rows = [];
    for (var y = -1; y <= ROWS; y++) {
      var src = wr.terrain[Math.max(0, Math.min(ROWS - 1, y))] || '', row = '';
      for (var x = -1; x <= COLS; x++) { var ch = src[Math.max(0, Math.min(COLS - 1, x))] || '.'; row += TILE_OF[ch] || ch; }
      rows.push(row);
    }
    var theme = warTheme(wr), th = T.THEMES[theme] || T.THEMES.spring;
    function mapOf(rs) {
      return { id: 'war:' + wr.id, def: {}, rows: rs, w: COLS + 2, h: ROWS + 2, theme: theme, interior: false,
        get: function (x, y) { if (y < 0 || y >= this.h || x < 0 || x >= this.w) return null; return this.rows[y][x] || '.'; } };
    }
    function put(rs, x, y, ch) { return rs.map(function (r, i) { return i === y ? r.slice(0, x) + ch + r.slice(x + 1) : r; }); }
    // the ground is baked with every tree taken out
    var bare = rows.map(function (r) { return r.replace(new RegExp('[' + TREE + ']', 'g'), '.'); });
    var m = mapOf(bare), base = T.bake(m), c2 = base.getContext('2d');
    var k = base.width / ((COLS + 2) * 16), cell = 16 * k;   // device pixels per tile
    var bareData = c2.getImageData(0, 0, base.width, base.height).data;
    // the other tall pieces (gate towers, roofs) stay inside their own square
    for (y = 1; y <= ROWS; y++) for (x = 1; x <= COLS; x++) {
      var t = m.get(x, y); if (!T.hasTall(t, m)) continue;
      c2.save(); c2.beginPath(); c2.rect(x * 16, y * 16, 16, 16); c2.clip();
      T.drawTall(c2, x * 16, y * 16, x, y, th, m, t);
      c2.restore();
    }
    // each tree: paint it alone on the bare ground, keep the pixels that changed, and fit the whole tree into its square
    for (y = 1; y <= ROWS; y++) for (x = 1; x <= COLS; x++) {
      var ch2 = rows[y][x]; if (TREE.indexOf(ch2) < 0) continue;
      var tm = mapOf(put(bare, x, y, ch2)), tc = T.bake(tm), tcx = tc.getContext('2d');
      if (T.hasTall(ch2, tm)) T.drawTall(tcx, x * 16, y * 16, x, y, th, tm, ch2);
      var rx = Math.max(0, (x - 1) * cell), ry = Math.max(0, (y - 3) * cell), rw = 3 * cell, rh = (y + 1) * cell - ry;
      var img = tcx.getImageData(rx, ry, rw, rh), d = img.data, x0 = rw, y0 = rh, x1 = -1, y1 = -1;
      for (var py = 0; py < rh; py++) for (var px = 0; px < rw; px++) {
        var i = (py * rw + px) * 4, j = ((ry + py) * base.width + rx + px) * 4;
        if (Math.abs(d[i] - bareData[j]) + Math.abs(d[i + 1] - bareData[j + 1]) + Math.abs(d[i + 2] - bareData[j + 2]) < 12) { d[i + 3] = 0; continue; }
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
      if (x1 < 0) continue;
      var sprite = U.makeCanvas(rw, rh); sprite.getContext('2d').putImageData(img, 0, 0);
      var bw = x1 - x0 + 1, bh = y1 - y0 + 1;
      c2.save(); c2.setTransform(1, 0, 0, 1, 0, 0); c2.imageSmoothingEnabled = true; c2.imageSmoothingQuality = 'high';
      // a small grove: two or three little trees, the back ones higher up, some turned the other way
      var grove = U.hash2(x, y, 517) < 0.5 ? GROVE2 : GROVE3;
      grove.forEach(function (g, n) {
        var hgt = g[2] * cell, sc = Math.min(hgt / bh, 0.7 * cell / bw), w = bw * sc, h = bh * sc;
        var dx = x * cell + g[0] * cell - w / 2, dy = y * cell + g[1] * cell - h;
        var flip = U.hash2(x + n, y, 518) < 0.5;
        c2.save();
        if (flip) { c2.translate(2 * dx + w, 0); c2.scale(-1, 1); }
        c2.drawImage(sprite, x0, y0, bw, bh, dx, dy, w, h);
        c2.restore();
      });
      c2.restore();
    }
    return base;
  }

  W.flatBoard = false;   // debug: true draws the old flat squares

  // ---------- draw ----------
  SCN.update = SCN.updateBackground = function (dt) {
    var wr = W.cur; if (!wr) return;
    wr.fx.forEach(function (f) { f.t += dt; });
    wr.fx = wr.fx.filter(function (f) { return f.t < 0.8; });
    wr.units.forEach(function (u) {
      if (u.slide && (u.slide.t += dt) >= u.slide.dur) u.slide = null;
      if (u.anim && (u.anim.t += dt) >= u.anim.dur) u.anim = null;
    });
    if (wr.msg) wr.msg.t += dt;
  };

  SCN.draw = function () {
    var wr = W.cur; if (!wr) return;
    var c = G.ctx;
    var gr = c.createLinearGradient(0, 0, 0, WM.H);
    gr.addColorStop(0, '#2a2016'); gr.addColorStop(1, '#120c06');
    c.fillStyle = gr; c.fillRect(0, 0, WM.W, WM.H);
    G.text(wr.d.name, 32, 18, { size: 26, bold: true, color: G.COL.gold });
    G.text('Turn ' + (wr.d.turns ? Math.min(wr.turn, wr.d.turns) + ' / ' + wr.d.turns : wr.turn), WM.W - 32, 22, { size: 22, align: 'right' });   // never "11 / 10" while time runs out
    // terrain: the baked tiles, or flat squares if they cannot be had
    if (wr.board === undefined && !W.flatBoard) { try { wr.board = bakeBoard(wr); } catch (err) { console.warn('war board', err); wr.board = null; } }
    var board = !W.flatBoard && wr.board;
    if (board) {
      var sc = board.width / ((COLS + 2) * 16);   // the canvas may be baked at double density
      c.save(); c.imageSmoothingEnabled = false;
      c.drawImage(board, 16 * sc, 16 * sc, COLS * 16 * sc, ROWS * 16 * sc, OX, OY, COLS * CELL, ROWS * CELL);
      c.restore();
    }
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var t = terr(x, y); if (!t) continue;
      var px = OX + x * CELL, py = OY + y * CELL;
      if (board) { c.strokeStyle = 'rgba(0,0,0,0.22)'; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1); continue; }
      c.fillStyle = (x + y) % 2 ? t.col : t.col2; c.fillRect(px, py, CELL, CELL);
      if (t === TERR.T) { for (var i = 0; i < 3; i++) { c.fillStyle = '#245a24'; c.beginPath(); c.arc(px + 16 + i * 16, py + 26 + (i % 2) * 14, 12, 0, 7); c.fill(); c.fillStyle = '#3a8a3a'; c.beginPath(); c.arc(px + 13 + i * 16, py + 22 + (i % 2) * 14, 6, 0, 7); c.fill(); } }
      if (t === TERR.m) { c.fillStyle = '#7a6a52'; c.beginPath(); c.moveTo(px + 6, py + 54); c.lineTo(px + 26, py + 16); c.lineTo(px + 46, py + 54); c.fill(); c.fillStyle = '#b1a084'; c.beginPath(); c.moveTo(px + 26, py + 16); c.lineTo(px + 32, py + 28); c.lineTo(px + 22, py + 26); c.fill(); }
      if (t.water) { c.fillStyle = 'rgba(220,240,255,0.35)'; c.fillRect(px + 8 + (Math.floor(WM.time * 2 + x) % 3) * 10, py + 20 + (y % 2) * 18, 16, 2); }
      if (t.reeds) { c.fillStyle = '#8a9a4a'; for (i = 0; i < 6; i++) c.fillRect(px + 6 + i * 9, py + 24 + (i % 3) * 6, 2, 20); }
      if (t === TERR['#']) { c.fillStyle = '#5d584f'; for (i = 0; i < 4; i++) c.fillRect(px, py + i * 16 + 14, CELL, 2); }
      if (t === TERR.H || t === TERR.G) { c.fillStyle = '#5b6476'; c.fillRect(px + 8, py + 10, 48, 14); c.fillStyle = '#e6dcc4'; c.fillRect(px + 12, py + 24, 40, 26); c.fillStyle = '#6a3e22'; c.fillRect(px + 27, py + 34, 10, 16); }
      c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, CELL - 1, CELL - 1);
    }
    if (wr.d.goal && wr.d.goal.reach) { var g = wr.d.goal.reach; c.strokeStyle = '#ffd040'; c.lineWidth = 4; c.strokeRect(OX + g[0] * CELL + 4, OY + g[1] * CELL + 4, CELL - 8, CELL - 8); }
    // reach overlay
    if (wr.reach) for (var k in wr.reach) { var p = k.split(','); c.fillStyle = 'rgba(80,160,255,0.32)'; c.fillRect(OX + p[0] * CELL + 2, OY + p[1] * CELL + 2, CELL - 4, CELL - 4); }
    if (wr.mode === 'target' && wr.targets) wr.targets.forEach(function (t2) {
      // foes struck from the flank or behind glow warmer
      var pa = wr.pendingAct, angled = pa === 'attack' || pa === 'cannon' || pa === 'sig:tiger';   // sure-hit deeds ignore the angle
      var ang = angled && t2.side !== wr.sel.side ? angleAt(wr.sel.x, wr.sel.y, t2) : 'front';
      c.fillStyle = ang === 'rear' ? 'rgba(255,200,40,0.45)' : ang === 'flank' ? 'rgba(255,140,40,0.38)' : t2.side === wr.sel.side ? 'rgba(80,255,120,0.3)' : 'rgba(255,80,60,0.3)';
      c.fillRect(OX + t2.x * CELL + 2, OY + t2.y * CELL + 2, CELL - 4, CELL - 4);
    });
    // units
    wr.units.forEach(function (u) { if (u.losses < 2) drawUnit(u, wr); });
    // fx
    wr.fx.forEach(function (f) {
      var px2 = OX + f.x * CELL + 32, py2 = OY + f.y * CELL + 32, k2 = f.t / 0.8;
      if (f.t < 0) return;
      c.save(); c.globalAlpha = 1 - k2;
      if (f.kind === 'fall') {   // a man topples over backwards and is gone
        var back = f.flip ? 1 : -1;
        c.imageSmoothingEnabled = false;
        c.translate(f.px + 16, f.py + 30); c.rotate(back * Math.min(1, k2 * 1.6) * Math.PI / 2); if (f.flip) c.scale(-1, 1);
        c.drawImage(f.spr, -16, -30, 32, 32);
      }
      if (f.kind === 'boom' || f.kind === 'clash') { c.fillStyle = f.kind === 'boom' ? '#ffb040' : '#ffffff'; for (var i2 = 0; i2 < 8; i2++) { var an = i2 / 8 * 6.28; c.fillRect(px2 + Math.cos(an) * k2 * 40 - 4, py2 + Math.sin(an) * k2 * 40 - 4, 8, 8); } }
      if (f.kind === 'arrows') { c.strokeStyle = '#e8e0d0'; c.lineWidth = 2; for (i2 = 0; i2 < 6; i2++) { c.beginPath(); c.moveTo(px2 - 30 + i2 * 10, py2 - 40 + k2 * 40); c.lineTo(px2 - 24 + i2 * 10, py2 - 30 + k2 * 40); c.stroke(); } }
      if (f.kind === 'thunder') { c.strokeStyle = '#ffff90'; c.lineWidth = 4; c.beginPath(); c.moveTo(px2, py2 - 60); c.lineTo(px2 - 10, py2 - 20); c.lineTo(px2 + 8, py2 - 10); c.lineTo(px2, py2 + 20); c.stroke(); }
      if (f.kind === 'magic' || f.kind === 'heal' || f.kind === 'smoke') { c.fillStyle = f.kind === 'heal' ? '#a0ffa0' : f.kind === 'smoke' ? '#808080' : '#ffd0ff'; c.beginPath(); c.arc(px2, py2, 10 + k2 * 30, 0, 7); c.fill(); }
      c.restore();
    });
    // cursor
    var cp = wr.cursor;
    c.strokeStyle = wr.phase === 'enemy' ? '#ff6050' : '#ffe080'; c.lineWidth = 3;
    var bb = Math.sin(WM.time * 6) * 2;
    c.strokeRect(OX + cp.x * CELL + 2 - bb, OY + cp.y * CELL + 2 - bb, CELL - 4 + bb * 2, CELL - 4 + bb * 2);
    // info panel
    var hu = unitAt(cp.x, cp.y) || wr.sel;
    G.window(16, 530, 928, 176);
    if (hu) {
      // the portrait at a little under full size, so its frame sits inside the panel
      var pc = G.ctx; pc.save(); pc.translate(32, 542); pc.scale(0.84, 0.84);
      if (hu.side === 'player') WM.portraits.drawFramed(hu.leader, 'normal', 6, 6);
      else if (hu.portrait) WM.portraits.drawFramed(hu.portrait, 'angry', 6, 6);
      pc.restore();
      var x0 = hu.portrait || hu.side === 'player' ? 210 : 40;
      G.text(hu.name + (hu.commander ? '  (Commander)' : ''), x0, 548, { size: 24, bold: true, color: hu.side === 'player' ? G.COL.gold : '#f0a090' });
      G.text(TYPE[hu.type].name + '   ATK ' + hu.atk + '   DEF ' + hu.def + '   Losses ' + hu.losses + '/2', x0, 582, { size: 20 });
      if (hu.supports && hu.supports.length) G.text('Support: ' + hu.supports.map(function (s) { return WM.data.chars[s].name; }).join(', '), x0, 610, { size: 20, color: '#c0d0e0' });
      var tags = hu.abil.map(function (a) { return (ABIL[a] || a).split(':')[0]; });
      if (tags.length) G.text(tags.join(' · '), x0, 638, { size: 18, color: '#a0e0a0' });
      // what has been done to the unit this battle
      var st = [];
      if (hu.shaken) st.push('Shaken');
      if (hu.confused) st.push(hu.confused === 'leaderless' ? 'Leaderless: cannot act next turn' : 'Confused: cannot act next turn');
      if (hu.debuff) st.push('Disordered -' + Math.round(hu.debuff * 100) + '% def');
      if (hu.atkDebuff) st.push('Unhorsed -' + Math.round(hu.atkDebuff * 100) + '% atk');
      if (st.length) G.text(st.join(' · '), x0, 686, { size: 16, color: '#ff9080' });
      preview(wr, hu);
      if (hu.sig && hu.sig.length) G.text(hu.sig.map(function (id) { return '\u2605 ' + SIG[id].name + (SIG[id].active && hu.usedSig[id] ? ' (used)' : ''); }).join('   '), x0, 664, { size: 18, color: '#ffd070' });
      var tt = terr(cp.x, cp.y); if (tt) G.text(tt.name + (tt.def ? ' (+' + Math.round(tt.def * 100) + '% def)' : ''), 920, 548, { size: 18, align: 'right', color: G.COL.dim });
    } else {
      var tt2 = terr(cp.x, cp.y);
      G.text(tt2 ? tt2.name : '', 40, 548, { size: 22, color: G.COL.dim });
      G.text('Z: select unit / menu    X: cancel    C: end turn menu', 40, 590, { size: 18, color: G.COL.dim });
      G.text('Strike from the flank +25%, from behind +50% and no counter. The arrow on a unit shows its front.', 40, 620, { size: 18, color: G.COL.dim });
    }
    if (wr.msg) {
      var ms = 26; while (ms > 16 && G.measure(wr.msg.text, ms, true) + 80 > WM.W - 32) ms -= 2;   // long reports shrink to fit
      var mw = G.measure(wr.msg.text, ms, true) + 80;
      G.window((WM.W - mw) / 2, 260, mw, 64, { top: '#4a2a10', bottom: '#20100a' });
      G.text(wr.msg.text, WM.W / 2, 278 + (26 - ms) / 2, { size: ms, bold: true, align: 'center', color: '#ffe0a0' });
    }
  };

  // While choosing whom to strike: the angle, its bonus, and the odds of the blow and of the counter.
  function preview(wr, hu) {
    if (wr.mode === 'face' && hu === wr.sel) {
      G.text('Arrows: turn to face', 920, 582, { size: 20, align: 'right', color: '#ffe080' });
      G.text('Z: stand   X: back', 920, 610, { size: 18, align: 'right', color: G.COL.dim });
      return;
    }
    if (wr.mode !== 'target' || !wr.sel || hu.side === wr.sel.side) return;
    var act = wr.pendingAct;
    if (act !== 'attack' && act !== 'cannon' && act !== 'sig:tiger') return;
    var o = odds(wr.sel, hu, act === 'cannon' ? 'cannon' : 'attack');
    var A = ANGLE[o.ang];
    G.text(A.label + (A.mult > 1 ? ' +' + Math.round((A.mult - 1) * 100) + '%' : ''), 920, 582, { size: 22, bold: true, align: 'right', color: o.ang === 'rear' ? '#ffd040' : o.ang === 'flank' ? '#ffa050' : '#e0d0c0' });
    G.text('Hit ' + Math.round(o.hit * 100) + '%', 920, 610, { size: 20, align: 'right' });
    G.text(o.ranged ? 'No counter (ranged)' : o.counter ? 'Counter ' + Math.round(o.counter * 100) + '%' : 'No counter', 920, 638, { size: 18, align: 'right', color: o.counter ? '#f0a090' : '#a0e0a0' });
  }
  // what is wrong with a unit, beside its flag: a swirl in a speech bubble for confusion, a bead of sweat for shaken ranks
  function drawStatus(u, x, y) {
    var c = G.ctx, bob = Math.round(Math.sin(WM.time * 4) * 1);
    if (u.confused) {
      c.fillStyle = '#fbf6ea'; c.strokeStyle = '#2a1a10'; c.lineWidth = 1;
      c.beginPath(); c.ellipse(x + 7, y + 6 + bob, 7.5, 6, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x + 2, y + 10 + bob); c.lineTo(x - 1, y + 14 + bob); c.lineTo(x + 5, y + 11 + bob); c.closePath(); c.fill();
      c.strokeStyle = u.confused === 'leaderless' ? '#a0501a' : '#7a3aa8'; c.lineWidth = 1.4; c.beginPath();
      for (var a = 0; a <= Math.PI * 4; a += 0.3) { var r = 0.4 + a * 0.36, ang = a + WM.time * 5; var sx = x + 7 + Math.cos(ang) * r, sy = y + 6 + bob + Math.sin(ang) * r * 0.8; if (a === 0) c.moveTo(sx, sy); else c.lineTo(sx, sy); }
      c.stroke();
      x += 17;
    }
    if (u.shaken) {
      c.fillStyle = '#9ad0f0'; c.strokeStyle = '#1a3a5a'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x + 5, y + 1 + bob); c.quadraticCurveTo(x + 10, y + 8 + bob, x + 5, y + 11 + bob); c.quadraticCurveTo(x, y + 8 + bob, x + 5, y + 1 + bob); c.fill(); c.stroke();
    }
  }
  // a small arrowhead on the edge of the square the unit faces
  function drawFacing(u, px, py, wr) {
    var f = u.face; if (!f) return;
    var c = G.ctx, cx = px + 32 + f.x * 27, cy = py + 34 + f.y * 27;
    if (f.y < 0) { cx = px + 28; cy = py + 7; }   // clear of the banner and the loss marks
    var big = wr.mode === 'face' && wr.sel === u ? 1.5 + Math.sin(WM.time * 8) * 0.25 : 1;
    var s = 6 * big, nx = -f.y, ny = f.x;
    c.beginPath();
    c.moveTo(cx + f.x * s, cy + f.y * s);
    c.lineTo(cx - f.x * s * 0.6 + nx * s, cy - f.y * s * 0.6 + ny * s);
    c.lineTo(cx - f.x * s * 0.6 - nx * s, cy - f.y * s * 0.6 - ny * s);
    c.closePath();
    c.fillStyle = u.side === 'player' ? '#ffd040' : '#ff8a70'; c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.75)'; c.lineWidth = 1.5; c.stroke();
  }
  // ---------- the troops, painted pixel by pixel ----------
  // Each kind of soldier is a 32x32 figure facing right, painted from simple pixel shapes onto a grid of colour keys;
  // then every shape gets a dark outline, light along its top and shade along its bottom, and a dark seam where it
  // lies in front of another (the rider on his horse, the shield on the coat). A unit is a few of them together.
  //   keys: a coat, A coat's dark facing, h helmet, s skin, l trousers and boots, b belt, r plume and the side's cloth,
  //   w steel, p wood, n horse (or hull), N its far legs, m mane and tail, y brass, k outline/eye
  // a head in three-quarter view, the face's top-left at (x, y): long dark eyes under their brows, and what he wears
  //   helm: the Song iron helmet, domed, a brass spike with a red tassel, a brim and a neck guard behind
  //   futou: the black cloth cap with its ties hanging behind; dao: a Daoist's topknot crown
  function head(P, x, y, kind) {
    P.rect('s', x, y, 6, 6);
    P.rect('l', x + 1, y + 1, 2, 1); P.rect('l', x + 4, y + 1, 2, 1);         // brows
    P.rect('k', x + 1, y + 2, 2, 1); P.rect('k', x + 4, y + 2, 2, 1);         // eyes, long and dark
    P.px('S', x + 5, y + 4);                                                  // the line of the mouth
    if (kind === 'helm') {
      P.ell('h', x + 3, y - 1, 4, 2); P.rect('h', x - 1, y, 8, 1); P.rect('h', x - 1, y + 1, 2, 5);
      P.px('y', x + 3, y - 4); P.rect('r', x + 2, y - 5, 3, 1); P.px('r', x + 3, y - 6); P.px('r', x + 1, y - 4);
    } else if (kind === 'futou') {
      P.rect('l', x - 1, y - 3, 7, 4); P.rect('l', x + 1, y - 4, 3, 1); P.line('l', x - 2, y - 1, x - 4, y + 3);
    } else if (kind === 'dao') {
      P.rect('l', x - 1, y - 2, 7, 3); P.rect('y', x + 1, y - 4, 3, 2); P.px('y', x + 2, y - 5);
      P.rect('l', x + 2, y + 5, 4, 3); P.px('l', x + 3, y + 8);                // the long beard
    }
  }
  var PAINT = {
    cav: function (P) {
      // the horse, long in the body, its neck arched up to a head held forward
      P.part(1);
      var f = P.f, hind = f ? [5, 12] : [7, 10], fore = f ? [23, 22] : [21, 24];   // (the second frame is mid-stride)
      P.rect('N', hind[0], 22, 2, 8); P.rect('N', fore[0], 22, 2, 8);           // far legs
      P.ell('n', 15, 19, 10, 4); P.ell('n', 23, 18, 3, 4); P.ell('n', 7, 18, 3, 3);   // body, chest, haunch
      for (var t = 0; t < 4; t++) P.line('n', 22 + t, 17, 25 + t, 10);          // the neck
      P.rect('n', 25, 8, 4, 4); P.rect('n', 28, 10, 3, 3); P.px('n', 26, 7); P.px('n', 26, 6);   // head, muzzle, ear
      P.px('k', 27, 9); P.px('N', 30, 12);                                      // eye, nostril
      P.rect('n', hind[1], 22, 2, 8); P.rect('n', fore[1], 21, 2, 9);           // near legs
      [hind[0], hind[1], fore[0], fore[1]].forEach(function (lx) { P.rect('N', lx, 29, 2, 1); });   // hooves
      P.line('m', 22, 15, 25, 7); P.line('m', 23, 15, 26, 7);                  // mane
      P.line('m', 4, 17, 2 + f, 25); P.line('m', 5, 17, 3 + f, 26); P.line('m', 4, 16, 1 + f, 24);   // tail, swishing
      P.rect('r', 10, 15, 10, 3); P.rect('y', 10, 17, 10, 1);                   // saddle cloth and its fringe
      // the rider
      P.part(2);
      P.line('p', 8, 26, 8, 2); P.rect('w', 7, 0, 3, 3); P.px('w', 8, 3); P.rect('r', 7, 4, 3, 1); P.px('r', 8, 5);   // spear, blade, red tassel
      P.rect('l', 14, 14, 3, 6); P.rect('l', 14, 19, 4, 2);                     // leg and boot down the horse's side
      P.rect('a', 11, 7, 7, 8); P.lam(13, 7, 5, 5); P.rect('A', 11, 7, 2, 8); P.rect('b', 11, 12, 7, 1);   // lamellar coat, facing, belt
      P.ell('A', 12, 8, 2, 1);                                                  // shoulder plate
      P.rect('a', 17, 9, 4, 2); P.rect('s', 21, 9, 2, 2);                       // arm forward to the reins
      P.line('b', 23, 10, 26, 11);                                              // the reins
      P.rect('s', 8, 9, 2, 2);                                                  // the hand on the spear
      head(P, 12, 2, 'helm');
    },
    inf: function (P) {
      P.part(1);
      P.line('p', 7, 30, 7, 3); P.rect('w', 6, 0, 3, 3); P.px('w', 7, 3); P.rect('r', 6, 4, 3, 1); P.px('r', 7, 5);   // spear and its red tassel
      var st = P.f ? 1 : 0;   // the second frame steps out
      P.rect('l', 11 - st, 22, 3, 8); P.rect('l', 16 + st, 22, 3, 8); P.rect('k', 10 - st, 29, 4, 1); P.rect('k', 16 + st, 29, 4, 1);   // legs, boots
      P.rect('a', 10, 11, 10, 9); P.rect('a', 9, 18, 12, 4); P.lam(12, 11, 8, 6); P.lam(10, 19, 11, 3); P.rect('A', 10, 11, 2, 11);   // lamellar coat and skirts
      P.rect('b', 10, 17, 10, 1); P.px('y', 14, 17);                            // belt, buckle
      P.ell('A', 11, 12, 2, 1); P.ell('A', 19, 12, 2, 1);                       // shoulder plates
      P.rect('a', 8, 13, 2, 4); P.rect('s', 7, 15, 2, 2);                       // arm to the spear
      head(P, 12, 6, 'helm');
      P.part(2);
      // the rattan shield, painted with a tiger's face
      P.ell('p', 21, 17, 4, 6); P.ell('y', 21, 17, 3, 5);
      P.rect('k', 19, 15, 2, 1); P.rect('k', 22, 15, 2, 1); P.px('S', 21, 17); P.rect('r', 19, 19, 5, 1); P.px('w', 20, 20); P.px('w', 22, 20);
    },
    arch: function (P) {
      P.part(1);
      P.rect('p', 7, 9, 3, 10); P.rect('w', 7, 7, 1, 2); P.rect('w', 9, 6, 1, 3); P.px('r', 8, 8);   // quiver and fletching
      var st = P.f ? 1 : 0;
      P.rect('l', 11 - st, 22, 3, 8); P.rect('l', 16 + st, 22, 3, 8); P.rect('k', 10 - st, 29, 4, 1); P.rect('k', 16 + st, 29, 4, 1);
      P.rect('a', 10, 11, 9, 9); P.rect('a', 9, 18, 11, 4); P.rect('A', 10, 11, 2, 11);
      P.rect('b', 10, 17, 9, 1); P.rect('r', 13, 18, 2, 4);                     // sash ends
      head(P, 12, 6, 'futou');
      P.part(2);
      P.rect('a', 17, 12, 5, 3); P.rect('s', 22, 12, 2, 3);                     // arms out, drawing
      for (var y = 4; y <= 26; y++) P.px('p', 21 + Math.round(4 * Math.sin(Math.PI * (y - 4) / 22)), y);   // the bow
      P.line('w', 21, 4, 18, 13); P.line('w', 18, 13, 21, 26);                 // its string, drawn back
      P.line('w', 18, 13, 27, 13); P.px('w', 28, 13);                           // the arrow
    },
    mage: function (P) {
      P.part(1);
      P.line('p', 24, 30, 24, 5); P.ell(P.f ? 'w' : 'y', 24, 3, 2, 2); P.px('r', 24, 3);   // staff and its jewel, glinting
      for (var y = 11; y <= 29; y++) { var hw = Math.round(4 + (y - 11) * 0.38); P.rect('a', 15 - hw, y, hw * 2 + 1, 1); }   // the robe
      P.rect('A', 14, 11, 3, 19); P.rect('b', 9, 18, 13, 2); P.rect('r', 14, 18, 3, 7);   // its front panel, sash
      P.rect('a', 19, 13, 4, 4); P.rect('s', 22, 14, 2, 2);                     // sleeve and hand on the staff
      head(P, 12, 4, 'dao');
    },
    naval: function (P) {
      P.part(1);
      if (P.f) { P.line('p', 21, 14, 25, 30); P.rect('p', 23, 28, 3, 3); }     // the oar, at the end of the stroke
      else { P.line('p', 21, 14, 29, 29); P.rect('p', 27, 27, 3, 3); }
      P.rect('a', 12, 12, 8, 10); P.lam(14, 12, 6, 6); P.rect('A', 12, 12, 2, 10); P.rect('b', 12, 18, 8, 1);
      P.rect('a', 19, 14, 3, 2); P.rect('s', 21, 14, 2, 2);
      head(P, 13, 7, 'helm');
      P.part(2);
      for (var y = 20; y <= 26; y++) { var d = y - 20; P.rect('n', 2 + d, y, 28 - d * 2, 1); }   // the hull
      P.rect('n', 1, 19, 30, 1); P.rect('N', 4, 23, 24, 1);                    // gunwale, a strake
    }
  };
  var INK = { k: '#1a120c', s: '#e8b48a', S: '#b07a58', l: '#3a2a1e', b: '#2a1a10', w: '#e4e8ee', p: '#7a4a26', n: '#74462a', N: '#3e2414', m: '#2a1810', y: '#d8b048' };
  // Liangshan in leather and rust-orange; the government's men in blue with steel helmets
  var SIDE_INK = {
    player: { a: '#c4642c', A: '#8a3e1a', h: '#5a3420', r: '#c8302a' },
    enemy: { a: '#3e5c9a', A: '#273c6a', h: '#a8b4c6', r: '#2a4a8a' }
  };
  var NO_SHADE = { k: 1, w: 1, b: 1, L: 1, S: 1 };
  var REGION = { L: 'a', S: 's' };   // (a plate on the coat, the mouth on the face, belong to it for the light)
  var troopCache = {};
  function troopSprite(type, u, frame) {
    var key = type + ':' + u.side + ':' + (u.color || '') + ':' + (frame ? 1 : 0);
    if (troopCache[key]) return troopCache[key];
    var ink = Object.assign({}, INK, SIDE_INK[u.side === 'player' ? 'player' : 'enemy']);
    if (u.color) { ink.a = u.color; ink.A = U.shade(u.color, -0.3); ink.r = u.color; }
    ink.L = U.shade(ink.a, -0.22);
    var N = 32, g = [], part = [], cur = 0, x, y;
    for (y = 0; y < N; y++) { g.push([]); part.push([]); }
    function set(k, px, py) { if (px < 0 || py < 0 || px >= N || py >= N) return; g[py][px] = k; part[py][px] = cur; }
    var P = {
      f: frame ? 1 : 0,
      part: function (n) { cur = n; },
      px: set,
      rect: function (k, x0, y0, w, h) { for (var yy = y0; yy < y0 + h; yy++) for (var xx = x0; xx < x0 + w; xx++) set(k, xx, yy); },
      ell: function (k, cx, cy, rx, ry) { for (var yy = cy - ry; yy <= cy + ry; yy++) for (var xx = cx - rx; xx <= cx + rx; xx++) { var dx = (xx - cx) / (rx + 0.5), dy = (yy - cy) / (ry + 0.5); if (dx * dx + dy * dy <= 1) set(k, xx, yy); } },
      // lamellar: little iron plates laced in staggered rows over the coat
      lam: function (x0, y0, w, h) { for (var yy = y0; yy < y0 + h; yy++) if ((yy - y0) % 2 === 0) for (var xx = x0 + ((yy - y0) / 2) % 2; xx < x0 + w; xx += 2) if (g[yy] && g[yy][xx] === 'a') set('L', xx, yy); },
      line: function (k, x0, y0, x1, y1) { var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy; for (;;) { set(k, x0, y0); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } }
    };
    (PAINT[type] || PAINT.inf)(P);
    var at = function (xx, yy) { return xx < 0 || yy < 0 || xx >= N || yy >= N ? undefined : g[yy][xx]; };
    var out = [];
    for (y = 0; y < N; y++) { out.push([]); for (x = 0; x < N; x++) {
      var k = g[y][x], col = null;
      if (k == null) {   // the outline round the whole figure
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var q = at(x + d[0], y + d[1]); return q != null; })) col = ink.k;
      } else {
        col = ink[k] || ink.k;
        // a seam where this part lies behind another
        var behind = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var xx = x + d[0], yy = y + d[1]; return at(xx, yy) != null && part[yy][xx] > part[y][x] && at(xx, yy) !== k; });
        if (behind && k !== 'k') col = ink.k;
        else if (!NO_SHADE[k]) {
          var rk = REGION[k] || k, up = at(x, y - 1), dn = at(x, y + 1);
          up = REGION[up] || up; dn = REGION[dn] || dn;
          if (up !== rk && dn === rk) col = U.shade(col, 0.22);        // light from above
          else if (dn !== rk && up === rk) col = U.shade(col, -0.28);  // shade beneath
        }
      }
      out[y].push(col);
    } }
    var cv = U.makeCanvas(N, N), c = cv.getContext('2d');
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) if (out[y][x]) { c.fillStyle = out[y][x]; c.fillRect(x, y, 1, 1); }
    return (troopCache[key] = cv);
  }
  W.troopSprite = troopSprite;   // (for the debug panel and art checks)
  function flashOf(spr) {   // the figure blanched white, for the instant it is struck
    if (spr.flash) return spr.flash;
    var cv = U.makeCanvas(spr.width, spr.height), c = cv.getContext('2d');
    c.drawImage(spr, 0, 0); c.globalCompositeOperation = 'source-atop'; c.fillStyle = '#ffffff'; c.fillRect(0, 0, cv.width, cv.height);
    return (spr.flash = cv);
  }
  // where the men stand in the square (for a unit facing right), back rank first: four at full strength, three
  // once it has taken a loss (a second loss routs it)
  var RANKS = { 0: [[4, 4], [28, 0], [0, 28], [26, 26]], 1: [[6, 8], [30, 4], [16, 28]] };
  // ---------- motion ----------
  // u.slide: on its way from (x0, y0) to its square; u.anim: lunge (at a foe), shoot (the recoil of a volley),
  // hit (struck: it shakes and flashes). A negative t is a delay before it starts.
  function slideTo(u, x, y) { var d = Math.abs(x - u.x) + Math.abs(y - u.y); if (d) u.slide = { x0: u.x, y0: u.y, t: 0, dur: Math.min(0.5, 0.1 + d * 0.07) }; return d ? u.slide.dur : 0; }
  function animate(u, kind, to, delay) {
    var dx = to ? sgn(to.x - u.x) : 0, dy = to ? sgn(to.y - u.y) : 0, n = Math.hypot(dx, dy) || 1;
    u.anim = { kind: kind, t: -(delay || 0), dur: kind === 'hit' ? 0.45 : 0.4, dx: dx / n, dy: dy / n };
  }
  function unitOffset(u) {
    var ox = 0, oy = 0, a = u.anim, sl = u.slide;
    if (sl) { var k = Math.min(1, sl.t / sl.dur), e = k * k * (3 - 2 * k); ox += (sl.x0 - u.x) * CELL * (1 - e); oy += (sl.y0 - u.y) * CELL * (1 - e); }
    if (a && a.t >= 0) {
      var q = Math.min(1, a.t / a.dur);
      if (a.kind === 'lunge') { var amp = Math.sin(Math.PI * q) * 18; ox += a.dx * amp; oy += a.dy * amp; }
      if (a.kind === 'shoot') { var rc = -Math.sin(Math.PI * q) * 4; ox += a.dx * rc; oy += a.dy * rc; }
      if (a.kind === 'hit') ox += Math.sin(a.t * 70) * 3 * (1 - q);
    }
    return [ox, oy];
  }
  // a unit that is doing something: chosen, under the cursor on its turn, moving, fighting, or the enemy now acting
  function isActive(u, wr) {
    if (u.anim || u.slide || wr.actor === u) return true;
    return wr.phase === 'player' && u.side === 'player' && !u.done && (wr.sel === u || (wr.cursor.x === u.x && wr.cursor.y === u.y));
  }
  // where each man of a unit stands, in pixels
  function figures(u, losses) {
    var off = unitOffset(u), px = OX + u.x * CELL + off[0], py = OY + u.y * CELL + off[1], flip = (u.lookX || (u.side === 'player' ? 1 : -1)) < 0;
    return RANKS[Math.min(1, losses)].map(function (r) { return { x: flip ? px + CELL - 32 - r[0] : px + r[0], y: py + r[1], flip: flip }; });
  }
  // men falling from a unit's ranks when it takes a loss (all of them, when it is routed)
  function fallFx(wr, u, before) {
    var tt = terr(u.x, u.y), kind = u.type === 'naval' && !(tt && tt.water) ? 'inf' : u.type, spr = troopSprite(kind, u, 0);
    var was = figures(u, before), gone = u.losses >= 2 ? was : was.slice(RANKS[Math.min(1, u.losses)].length);
    gone.forEach(function (g, i) { wr.fx.push({ kind: 'fall', x: u.x, y: u.y, px: g.x, py: g.y, flip: g.flip, spr: spr, t: -i * 0.08 }); });
  }
  function drawUnit(u, wr) {
    var c = G.ctx;
    var off = unitOffset(u);
    var px = OX + u.x * CELL + off[0], py = OY + u.y * CELL + off[1];
    var col = u.side === 'player' ? '#c8302a' : '#2a4a8a';
    if (u.side === 'enemy' && u.color) col = u.color;
    // the men turn left or right with the unit (one facing up or down keeps the way it last looked)
    if (u.face && u.face.x) u.lookX = u.face.x;
    var flip = (u.lookX || (u.side === 'player' ? 1 : -1)) < 0;
    // a navy unit is in its boats only on the water; ashore its men fight on foot
    var tt = terr(u.x, u.y), kind = u.type === 'naval' && !(tt && tt.water) ? 'inf' : u.type;
    var ranks = RANKS[Math.min(1, u.losses)], live = isActive(u, wr);
    var struck = u.anim && u.anim.kind === 'hit' && u.anim.t >= 0 && u.anim.t < 0.3 && Math.floor(u.anim.t * 20) % 2 === 0;
    c.save(); c.imageSmoothingEnabled = false;
    ranks.forEach(function (r, i) {
      // the active unit's men step in place, each a beat apart; a foot soldier rises a pixel on his step
      var fr = live ? (Math.floor(WM.time * 5) + i) % 2 : 0;
      var spr = troopSprite(kind, u, fr); if (struck) spr = flashOf(spr);
      var x = flip ? px + CELL - 32 - r[0] : px + r[0], y = py + r[1] - (fr && kind !== 'cav' && kind !== 'naval' ? 1 : 0);
      c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(x + 16, py + r[1] + 31, 11, 3, 0, 0, 7); c.fill();
      if (flip) { c.save(); c.translate(x + 32, y); c.scale(-1, 1); c.drawImage(spr, 0, 0, 32, 32); c.restore(); }
      else c.drawImage(spr, x, y, 32, 32);
    });
    c.restore();
    // the leader's standard, carried at the back of the unit and streaming forward, his initial on it
    var pole = flip ? px + CELL - 6 : px + 4, fx = flip ? pole - 15 : pole + 2;
    c.fillStyle = '#4a2a16'; c.fillRect(pole, py + 1, 2, 30);
    var wave = live ? Math.round(Math.sin(WM.time * 10) * 1) : 0;
    c.fillStyle = col; c.fillRect(fx, py + 2 + wave, 15, 12);
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(fx, py + 12, 15, 2);
    G.text(u.name.charAt(0), fx + 7.5, py + 2, { size: 11, bold: true, align: 'center', color: '#fff' });
    if (u.commander) { c.fillStyle = '#ffd040'; c.fillRect(fx, py, 15, 2); }
    drawStatus(u, flip ? fx - 17 : fx + 17, py + 1);
    if (u.done && u.side === 'player') { c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(px + 2, py + 2, CELL - 4, CELL - 4); }
    if (u.losses) { c.fillStyle = '#ff6050'; for (var l = 0; l < u.losses; l++) c.fillRect((flip ? px + 6 + l * 8 : px + CELL - 12 - l * 8), py + 4, 6, 6); }
    drawFacing(u, px, py, wr);
  }

})();
