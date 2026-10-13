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
    infiltrate: 'Infiltrate: weaken an adjacent enemy unit\'s defence for the rest of the battle.',
    naval: 'Water Warriors: unit can cross water.',
    morale: 'Rally: adjacent allies +10% attack.'
  };
  W.ABIL = ABIL;

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
        d: d, opt: opt, turn: 1, phase: 'player', sel: null, cursor: { x: 0, y: 0 }, msg: null, fx: [],
        units: [], terrain: d.map, log: [], resolve: resolve
      };
      d.player.forEach(function (o) {
        // skip heroes not yet recruited (optional slots)
        if (o.optional && !S.isRecruited(o.leader)) return;
        var sup = (o.support || []).filter(function (sid) { return !o.optional || S.isRecruited(sid) || !o.supportOptional; });
        wr.units.push(mkUnit('player', Object.assign({}, o, { support: sup })));
      });
      d.enemy.forEach(function (o) { wr.units.push(mkUnit('enemy', o)); });
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
      active('player').forEach(function (u) { u.done = false; u.moved = false; u.cannonUsed = false; });
      await banner(wr, 'Turn ' + wr.turn + ' — Liangshan moves');
      var r = await playerPhase(wr);
      var res = checkEnd(wr); if (res) return await endWar(wr, res);
      // enemy phase
      wr.phase = 'enemy';
      await banner(wr, 'Enemy moves');
      await enemyPhase(wr);
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
      addUnit: function (side, o) { wr.units.push(mkUnit(side, o)); },
      rout: function (name) { wr.units.forEach(function (u) { if (u.name === name || u.leader === name) u.losses = 2; }); },
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
            if (I.pressed('cancel')) { I.clear(); actionMenu(wr, w); }
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
    if (ranged.length) items.push({ label: rangeOf(u) > 1 ? 'Attack (range ' + rangeOf(u) + ')' : 'Attack', v: 'attack' });
    if (u.abil.indexOf('cannon') >= 0 && !u.cannonUsed && enemiesInRange(u, 4).length) items.push({ label: 'Fire Trebuchet', v: 'cannon' });
    if (u.abil.indexOf('heal') >= 0 && !u.usedAbil.heal && active('player').some(function (a) { return a.losses > 0 && dist(a, u) <= 1; })) items.push({ label: 'Treat Wounded', v: 'heal' });
    if (u.abil.indexOf('infiltrate') >= 0 && melee.length) items.push({ label: 'Infiltrate', v: 'infiltrate' });
    if (u.abil.indexOf('stratagem') >= 0 && !wr.stratUsed) items.push({ label: 'Stratagem', v: 'stratagem' });
    items.push({ label: 'Wait', v: 'wait' });
    UI.remove(w);
    UI.choose(items, { x: 700, y: 120, title: u.name }).then(function (k) {
      UI.push(w);
      if (k < 0) { u.x = wr.orig.x; u.y = wr.orig.y; wr.mode = 'move'; wr.reach = reach(u); wr.cursor = { x: u.x, y: u.y }; return; }
      var v = items[k].v;
      if (v === 'wait') { finishUnit(wr, w); return; }
      if (v === 'stratagem') {
        wr.stratUsed = true; wr.busy = true;
        banner(wr, 'Stratagem! All units may act again.').then(function () { active('player').forEach(function (a) { a.done = false; }); u.done = true; wr.busy = false; wr.mode = 'cursor'; wr.sel = null; });
        return;
      }
      if (v === 'heal') {
        var pts = active('player').filter(function (a) { return a.losses > 0 && dist(a, u) <= 1; });
        wr.targets = pts; wr.tIdx = 0; wr.pendingAct = 'heal'; wr.mode = 'target'; return;
      }
      var pool = v === 'cannon' ? enemiesInRange(u, 4) : v === 'infiltrate' ? melee : ranged;
      wr.targets = pool; wr.tIdx = 0; wr.pendingAct = v; wr.mode = 'target';
    });
  }

  function finishUnit(wr, w) {
    if (wr.sel) wr.sel.done = true;
    wr.sel = null; wr.reach = null; wr.mode = 'cursor';
    if (checkEnd(wr) || !active('player').some(function (u) { return !u.done; })) { UI.remove(w); wr._resolvePhase(); }
  }

  function openPhaseMenu(wr, w, resolve) {
    UI.remove(w);
    UI.choose([{ label: 'End Turn' }, { label: 'Unit List' }, { label: 'Battle Objective' }, { label: 'Resume' }], { x: 700, y: 120 }).then(function (k) {
      if (k === 0) { resolve(); return; }
      UI.push(w);
      if (k === 1) unitList(wr);
      if (k === 2) UI.message(null, objectiveText(wr));
    });
  }
  function objectiveText(wr) {
    var g = wr.d.goal || 'rout';
    var s = g === 'rout' ? 'Victory: rout every enemy unit.' : g === 'commander' ? 'Victory: rout the enemy commander.' : g.reach ? 'Victory: reach the marked objective.' : g.survive ? 'Victory: hold out for ' + wr.d.turns + ' turns.' : '';
    return s + ' Defeat: the commander\'s unit is routed' + (wr.d.turns && !g.survive ? ', or ' + wr.d.turns + ' turns pass' : '') + '.';
  }
  function unitList(wr) {
    var items = active('player').map(function (u) { return { label: u.name + ' (' + TYPE[u.type].name + ')', right: 'ATK ' + u.atk + ' DEF ' + u.def + (u.losses ? '  Loss ' + u.losses : '') }; });
    UI.choose(items, { x: 120, y: 80, w: 720, title: 'Units' }).then(function (k) {
      if (k >= 0) { var u = active('player')[k]; wr.cursor = { x: u.x, y: u.y }; }
    });
  }

  // ---------- combat ----------
  function power(u, other, attacking) {
    var a = u.atk;
    if (attacking && u.moved && u.abil.indexOf('charge') >= 0) a *= 1.25;
    if (TYPE[u.type].beats === other.type) a *= 1.3;
    if (active(u.side).some(function (o) { return o !== u && dist(o, u) <= 1 && o.abil.indexOf('morale') >= 0; })) a *= 1.1;
    return a;
  }
  function defence(u) {
    var t = terr(u.x, u.y);
    var d = u.def * (1 + (t ? t.def : 0));
    if (u.abil.indexOf('guard') >= 0) d *= 1.25;
    d *= 1 - (u.debuff || 0);
    return d;
  }
  async function doAction(wr, a, t, act) {
    if (act === 'heal') {
      t.losses = Math.max(0, t.losses - 1); a.usedAbil.heal = true;
      WM.audio.sfx('heal'); fxAt(wr, t, 'heal'); await banner(wr, t.name + '\'s unit recovers.');
      return;
    }
    if (act === 'infiltrate') {
      t.debuff = 0.25; WM.audio.sfx('miss'); fxAt(wr, t, 'smoke'); await banner(wr, t.name + '\'s ranks are thrown into confusion!');
      return;
    }
    var ranged = act === 'cannon' || dist(a, t) > 1;
    if (act === 'cannon') a.cannonUsed = true;
    await clash(wr, a, t, ranged, act);
  }
  async function clash(wr, a, t, ranged, act) {
    var magic = a.abil.indexOf('thunder') >= 0 || a.abil.indexOf('sorcery') >= 0 || a.abil.indexOf('fire') >= 0 || a.abil.indexOf('water') >= 0;
    var sfx = act === 'cannon' ? 'cannon' : a.abil.indexOf('thunder') >= 0 ? 'thunder' : a.abil.indexOf('fire') >= 0 ? 'fire' : a.abil.indexOf('water') >= 0 ? 'water' : ranged ? 'arrow' : 'drum';
    WM.audio.sfx(sfx);
    fxAt(wr, t, act === 'cannon' ? 'boom' : magic && ranged ? (a.abil.indexOf('thunder') >= 0 ? 'thunder' : 'magic') : ranged ? 'arrows' : 'clash');
    var ap = power(a, t, true) * (act === 'cannon' ? 1.4 : 1), dp = defence(t);
    var ratio = ap / (ap + dp);
    var r = Math.random();
    var outcome;
    // enemy takes a loss; attacker may take a loss in melee counter
    var tLoss = r < 0.25 + ratio * 0.6;
    var aLoss = !ranged && Math.random() < 0.15 + (1 - ratio) * 0.45;
    await WM.wait(0.45);
    if (tLoss) { t.losses++; outcome = t.losses >= 2 ? t.name + '\'s unit is routed!' : t.name + '\'s unit takes losses.'; }
    else outcome = t.name + '\'s unit holds firm.';
    if (aLoss) { a.losses++; outcome += a.losses >= 2 ? '  ' + a.name + '\'s unit falls back!' : '  ' + a.name + '\'s unit is hurt in the clash.'; }
    G.shake = 2;
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
      // choose nearest target
      var targets = active('player').slice().sort(function (p, q) { return dist(e, p) - dist(e, q); });
      var tgt = targets[0];
      var R = reach(e), rg = rangeOf(e);
      // pick reachable cell that is within range of tgt, prefer max distance for ranged
      var best = null, bestScore = -1e9;
      for (var k in R) {
        var p = k.split(','), x = +p[0], y = +p[1];
        var dd = Math.abs(x - tgt.x) + Math.abs(y - tgt.y);
        var score = -dd * 10;
        if (dd <= rg) score = 1000 + (rg > 1 ? dd * 5 : 0) + (terr(x, y).def * 50);
        if (score > bestScore) { bestScore = score; best = [x, y]; }
      }
      if (best) { e.moved = best[0] !== e.x || best[1] !== e.y; e.x = best[0]; e.y = best[1]; wr.cursor = { x: e.x, y: e.y }; }
      await WM.wait(0.25);
      var inR = active('player').filter(function (p) { return dist(e, p) <= rg; });
      if (inR.length) {
        var t = inR.sort(function (p, q) { return (q.losses - p.losses) || (defence(p) - defence(q)); })[0];
        await clash(wr, e, t, dist(e, t) > 1, 'attack');
        if (checkEnd(wr)) return;
      }
    }
  }

  // ---------- draw ----------
  SCN.update = SCN.updateBackground = function (dt) {
    var wr = W.cur; if (!wr) return;
    wr.fx.forEach(function (f) { f.t += dt; });
    wr.fx = wr.fx.filter(function (f) { return f.t < 0.8; });
    if (wr.msg) wr.msg.t += dt;
  };

  SCN.draw = function () {
    var wr = W.cur; if (!wr) return;
    var c = G.ctx;
    var gr = c.createLinearGradient(0, 0, 0, WM.H);
    gr.addColorStop(0, '#2a2016'); gr.addColorStop(1, '#120c06');
    c.fillStyle = gr; c.fillRect(0, 0, WM.W, WM.H);
    G.text(wr.d.name, 32, 18, { size: 26, bold: true, color: G.COL.gold });
    G.text('Turn ' + wr.turn + (wr.d.turns ? ' / ' + wr.d.turns : ''), WM.W - 32, 22, { size: 22, align: 'right' });
    // terrain
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var t = terr(x, y); if (!t) continue;
      var px = OX + x * CELL, py = OY + y * CELL;
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
    if (wr.mode === 'target' && wr.targets) wr.targets.forEach(function (t2) { c.fillStyle = 'rgba(255,80,60,0.3)'; c.fillRect(OX + t2.x * CELL + 2, OY + t2.y * CELL + 2, CELL - 4, CELL - 4); });
    // units
    wr.units.forEach(function (u) { if (u.losses < 2) drawUnit(u, wr); });
    // fx
    wr.fx.forEach(function (f) {
      var px2 = OX + f.x * CELL + 32, py2 = OY + f.y * CELL + 32, k2 = f.t / 0.8;
      c.save(); c.globalAlpha = 1 - k2;
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
      if (hu.side === 'player') WM.portraits.drawFramed(hu.leader, 'normal', 36, 536 + 6);
      else if (hu.portrait) WM.portraits.drawFramed(hu.portrait, 'angry', 36, 536 + 6);
      var x0 = hu.portrait || hu.side === 'player' ? 210 : 40;
      G.text(hu.name + (hu.commander ? '  (Commander)' : ''), x0, 548, { size: 24, bold: true, color: hu.side === 'player' ? G.COL.gold : '#f0a090' });
      G.text(TYPE[hu.type].name + '   ATK ' + hu.atk + '   DEF ' + hu.def + '   Losses ' + hu.losses + '/2', x0, 582, { size: 20 });
      if (hu.supports && hu.supports.length) G.text('Support: ' + hu.supports.map(function (s) { return WM.data.chars[s].name; }).join(', '), x0, 610, { size: 20, color: '#c0d0e0' });
      if (hu.abil.length) G.text(hu.abil.map(function (a) { return (ABIL[a] || a).split(':')[0]; }).join(' · '), x0, 638, { size: 18, color: '#a0e0a0' });
      var tt = terr(cp.x, cp.y); if (tt) G.text(tt.name + (tt.def ? ' (+' + Math.round(tt.def * 100) + '% def)' : ''), 920, 548, { size: 18, align: 'right', color: G.COL.dim });
    } else {
      var tt2 = terr(cp.x, cp.y);
      G.text(tt2 ? tt2.name : '', 40, 548, { size: 22, color: G.COL.dim });
      G.text('Z: select unit / menu    X: cancel    C: end turn menu', 40, 590, { size: 18, color: G.COL.dim });
    }
    if (wr.msg) {
      var mw = G.measure(wr.msg.text, 26, true) + 80;
      G.window((WM.W - mw) / 2, 260, mw, 64, { top: '#4a2a10', bottom: '#20100a' });
      G.text(wr.msg.text, WM.W / 2, 278, { size: 26, bold: true, align: 'center', color: '#ffe0a0' });
    }
  };

  function drawUnit(u, wr) {
    var c = G.ctx;
    var px = OX + u.x * CELL, py = OY + u.y * CELL;
    var col = u.side === 'player' ? '#c8302a' : '#2a4a8a';
    if (u.side === 'enemy' && u.color) col = u.color;
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(px + 6, py + 46, 52, 10);
    // tiny troop formation
    var n = 6 - u.losses * 2;
    for (var i = 0; i < n; i++) {
      var sx = px + 12 + (i % 3) * 15, sy = py + 24 + Math.floor(i / 3) * 14;
      c.fillStyle = col; c.fillRect(sx, sy, 8, 10);
      c.fillStyle = '#e8b48a'; c.fillRect(sx + 2, sy - 4, 4, 4);
      if (u.type === 'cav') { c.fillStyle = '#5a3a26'; c.fillRect(sx - 2, sy + 8, 12, 5); }
      if (u.type === 'arch') { c.strokeStyle = '#7a4a28'; c.lineWidth = 1; c.beginPath(); c.arc(sx + 9, sy + 4, 4, -1.4, 1.4); c.stroke(); }
      if (u.type === 'mage') { c.fillStyle = '#e0d070'; c.fillRect(sx + 3, sy - 7, 2, 3); }
      if (u.type === 'naval') { c.fillStyle = '#7a4e28'; c.fillRect(sx - 2, sy + 9, 12, 4); }
    }
    // banner with leader initial
    c.fillStyle = '#4a2a16'; c.fillRect(px + 52, py + 6, 2, 40);
    c.fillStyle = col; c.fillRect(px + 34, py + 6, 18, 16);
    G.text(u.name.charAt(0), px + 43, py + 7, { size: 14, bold: true, align: 'center', color: '#fff' });
    if (u.commander) { c.fillStyle = '#ffd040'; c.fillRect(px + 34, py + 2, 18, 3); }
    if (u.done && u.side === 'player') { c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(px + 2, py + 2, CELL - 4, CELL - 4); }
    if (u.losses) { c.fillStyle = '#ff6050'; for (var l = 0; l < u.losses; l++) c.fillRect(px + 6 + l * 8, py + 6, 6, 6); }
  }
})();
