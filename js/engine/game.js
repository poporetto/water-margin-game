// Game glue: new game, Liangshan castle growth, debug tools.
'use strict';
(function () {
  var S = WM.S, UI = WM.ui, G = WM.gfx, I = WM.input;

  WM.newGame = function () {
    S.newGame();
    WM.state.flags.protagonist = 'hongxin';
    var start = WM.data.start;
    S.setParty(start.party);
    WM.state.leader = start.party[0];
    start.items.forEach(function (it) { S.give(it[0], it[1]); });
    WM.state.gold = start.gold;
    WM.script.running = 0;
    WM.setScene(WM.field, { map: start.map, x: start.x, y: start.y, dir: start.dir });
    WM.fadeIn(0.8);
  };

  // ---------- Liangshan (the castle) ----------
  var C = WM.castle = {};
  C.THRESH = [0, 20, 40, 60, 85, 105];
  C.level = function () {
    var n = S.starCount(), l = 1;
    for (var i = 1; i < C.THRESH.length; i++) if (n >= C.THRESH[i]) l = i + 1;
    return Math.min(5, l);
  };
  C.nextHint = function () {
    var l = C.level();
    if (l >= 5) return 'The fortress stands complete.';
    return 'With ' + C.THRESH[l] + ' Stars the fortress will grow again.';
  };
  // A facility is open when its keeper has joined (and survives).
  C.has = function (id) { return S.isRecruited(id) && !WM.state.dead[id]; };
  // Smith's max sharpening level grows with the fortress
  C.smithMax = function () { return [0, 6, 8, 10, 13, 16][C.level()]; };

  // ---------- data checks at boot (also run headless by tools/validate.js) ----------
  WM.validateData = function () {
    var errs = [];
    var d = WM.data;
    if (d.charOrder.length !== 108) errs.push('Expected 108 stars, have ' + d.charOrder.length);
    for (var mid in d.maps) {
      var m = d.maps[mid];
      (m.exits || []).forEach(function (e) { if (!d.maps[e.to]) errs.push('Map ' + mid + ' exit to missing map ' + e.to); });
    }
    for (var em in d.events) {
      if (!d.maps[em]) errs.push('Events for missing map ' + em);
      d.events[em].forEach(function (ev) {
        if (ev.char && !d.chars[ev.char]) errs.push('Event ' + em + ':' + ev.id + ' unknown char ' + ev.char);
        if (ev.npc && !d.npcs[ev.npc]) errs.push('Event ' + em + ':' + ev.id + ' unknown npc ' + ev.npc);
      });
    }
    // exits must land on walkable tiles
    var rowsOf = function (m) { return typeof m.rows === 'function' ? m.rows() : m.rows; };
    var tileAt = function (mid, x, y) { var rr = rowsOf(d.maps[mid]); return rr[y] ? rr[y][x] : null; };
    for (var mid2 in d.maps) {
      var m2 = d.maps[mid2];
      (m2.exits || []).forEach(function (e) {
        if (!d.maps[e.to]) return;
        var ch = tileAt(e.to, e.tx, e.ty);
        if (ch == null || WM.tiles.solid(ch)) errs.push('Exit ' + mid2 + '(' + e.x + ',' + e.y + ') -> ' + e.to + ' lands on solid/void tile (' + e.tx + ',' + e.ty + ') "' + ch + '"');
      });
      if (m2.spawn) { var sc = tileAt(mid2, m2.spawn[0], m2.spawn[1]); if (sc == null || WM.tiles.solid(sc)) errs.push('Spawn of ' + mid2 + ' is solid "' + sc + '"'); }
    }
    for (var tid in d.troops) {
      var t = d.troops[tid]; var list = Array.isArray(t) ? t : t.enemies;
      list.forEach(function (e) { if (!d.enemies[e]) errs.push('Troop ' + tid + ' unknown enemy ' + e); });
    }
    (d.unites || []).forEach(function (u) { u.members.forEach(function (m) { if (!d.chars[m]) errs.push('Unite ' + u.name + ' unknown ' + m); }); });
    if (errs.length) { console.warn('Data problems:\n' + errs.join('\n')); }
    WM.dataErrors = errs;
    return errs;
  };

  // ---------- debug (F2) ----------
  var D = WM.debug = { enabled: /debug/.test(location.search) };
  D.open = function () {
    if (!D.enabled) return;
    WM.script.run(async function (s) {
      var k = await UI.choose(['Jump to chapter', 'Warp to map', 'Level party +10', 'Gold +5000', 'Recruit all 108', 'Toggle encounters', 'Show flags'], { x: 40, y: 40, title: 'Debug' });
      if (k === 0) {
        var chs = WM.data.chapters.map(function (c, i) { return { label: (i === 0 ? 'Prologue' : 'Ch ' + i) + ' ' + (c.short || '') }; });
        var n = await UI.choose(chs, { x: 40, y: 40, rows: 12, w: 600 });
        if (n >= 0 && WM.data.chapters[n].debugStart) await WM.data.chapters[n].debugStart(s);
      } else if (k === 1) {
        var ids = Object.keys(WM.data.maps);
        var mi = await UI.choose(ids.map(function (i) { return { label: i + ' — ' + (WM.data.maps[i].name || '') }; }), { x: 40, y: 40, rows: 12, w: 700 });
        if (mi >= 0) { var m = WM.data.maps[ids[mi]]; var sp = m.spawn || [2, 2]; await s.warp(ids[mi], sp[0], sp[1], 'down'); }
      } else if (k === 2) { WM.state.party.forEach(function (id) { var c = WM.state.chars[id]; c.lv = Math.min(99, c.lv + 10); S.restore(id); }); }
      else if (k === 3) WM.state.gold += 5000;
      else if (k === 4) { WM.data.charOrder.forEach(function (id) { S.recruit(id); }); WM.state.flags.castle = true; }
      else if (k === 5) { WM.state.flags.noEncounters = !WM.state.flags.noEncounters; UI.toast('Encounters ' + (WM.state.flags.noEncounters ? 'off' : 'on')); }
      else if (k === 6) { await s.say(null, Object.keys(WM.state.flags).filter(function (f) { return f.indexOf('ev:') !== 0; }).join(', ') || '(none)'); }
    });
  };
})();

// Test helpers (only with ?debug): drive input and time from the console.
// They are async so promise continuations (scripts) run between frames.
(function () {
  if (!/debug/.test(location.search)) return;
  async function flush() { for (var i = 0; i < 12; i++) await null; }
  async function frames(n) { for (var i = 0; i < n; i++) { WM.step(1 / 60, 1); await flush(); } }
  window.adv = function (sec) { return frames(Math.round(sec * 60)); };
  window.press = async function (code, n) { for (var i = 0; i < (n || 1); i++) { window.dispatchEvent(new KeyboardEvent('keydown', { code: code })); await frames(2); window.dispatchEvent(new KeyboardEvent('keyup', { code: code })); await frames(2); } };
  window.hold = async function (code, sec) { window.dispatchEvent(new KeyboardEvent('keydown', { code: code })); await frames(Math.round(sec * 60)); window.dispatchEvent(new KeyboardEvent('keyup', { code: code })); await frames(1); };
  // advance dialogue: press Z while UI is up, until it closes or a choice appears (max n)
  window.talk = async function (n) {
    var k = 0, idle = 0;
    while (k < (n || 80)) {
      await frames(20);
      if (WM.ui.busy()) { idle = 0; await press('KeyZ'); k++; continue; }
      if (WM.script.running || WM.scene !== WM.field) { idle++; if (idle > 30) break; continue; }
      break;
    }
    return k;
  };
  window.info = function () { var p = WM.field && WM.field.player; return { scene: Object.keys(WM.scenes).filter(function (k) { return WM.scenes[k] === WM.scene; })[0], map: WM.state && WM.state.map, tile: p ? p.tile() : null, ui: WM.ui.stack.length, script: WM.script.running, err: String(WM.lastError || ''), flags: WM.state ? Object.keys(WM.state.flags).filter(function (f) { return f.indexOf('ev:') < 0; }).join(',') : '' }; };
  // play a duel perfectly (reads the telegraphed move), or badly with wrong=true
  window.duelAuto = async function (wrong) {
    var counter = { attack: 1, wild: 2, defend: 0 }, bad = { attack: 2, wild: 0, defend: 1 };
    for (var i = 0; i < 400; i++) {
      if (WM.scene !== WM.scenes.duel && i > 60 && !WM.duel.cur) break;
      var top = WM.ui.top();
      if (top && top.isDuelChoice) {
        var idx = (wrong ? bad : counter)[WM.duel.cur.next];
        for (var k = 0; k < idx; k++) await press('ArrowDown');
        await press('KeyZ');
      } else if (top) await press('KeyZ');
      await frames(10);
    }
    return info();
  };
  // fight a battle by always choosing Fight / Attack / first target
  window.battleAuto = async function () {
    for (var i = 0; i < 40 && WM.scene !== WM.scenes.battle; i++) { await frames(10); if (WM.ui.busy()) await press('KeyZ'); }
    for (var j = 0; j < 600 && (WM.battle.cur || WM.scene === WM.scenes.battle); j++) { if (WM.ui.busy()) await press('KeyZ'); await frames(8); }
    await frames(30);
    return info();
  };
  // run the story forward: talk, fight and duel through whatever comes, until control returns to the player
  window.story = async function (maxSteps) {
    for (var i = 0; i < (maxSteps || 2000); i++) {
      if (WM.scene === WM.scenes.duel) { await duelAuto(); continue; }
      if (WM.scene === WM.scenes.battle) { await battleAuto(); continue; }
      if (WM.ui.busy()) { await press('KeyZ'); await frames(6); continue; }
      if (WM.script.running || WM.scene !== WM.field) { await frames(10); continue; }
      await frames(20);
      if (!WM.ui.busy() && !WM.script.running && WM.scene === WM.field) break;
    }
    return info();
  };
  // play a war crudely: every unit advances toward the nearest enemy and attacks if it can
  window.warAuto = async function () {
    for (var t = 0; t < 400 && WM.war.cur; t++) {
      var wr = WM.war.cur, top = WM.ui.top();
      if (!top) { await frames(10); continue; }
      if (wr.phase !== 'player' || wr.busy || !top.isWarInput) { if (!top.isWarInput) await press('KeyZ'); await frames(10); continue; }
      if (wr.mode === 'cursor') {
        var mine = wr.units.filter(function (u) { return u.side === 'player' && u.losses < 2 && !u.done; })[0];
        if (!mine) { await frames(10); continue; }
        wr.cursor = { x: mine.x, y: mine.y }; await press('KeyZ');
        if (wr.mode !== 'move') { await press('KeyZ'); continue; }
        var foes = wr.units.filter(function (u) { return u.side === 'enemy' && u.losses < 2; });
        var best = null, bd = 1e9;
        for (var k in wr.reach) { var p = k.split(',').map(Number); foes.forEach(function (e) { var d = Math.abs(e.x - p[0]) + Math.abs(e.y - p[1]); if (d < bd) { bd = d; best = p; } }); }
        wr.cursor = { x: best[0], y: best[1] }; await press('KeyZ'); await frames(4);
        if (WM.ui.top() && !WM.ui.top().isWarInput) { await press('KeyZ'); await frames(4); }   // first action (Attack if available, else Wait)
        if (wr.mode === 'target') { await press('KeyZ'); }
        await frames(80);
      } else { await press('KeyZ'); await frames(10); }
    }
    for (var j = 0; j < 30 && WM.scene !== WM.field; j++) { if (WM.ui.busy()) await press('KeyZ'); await frames(10); }
    return info();
  };
  window.saveAt = function (n) { var p = WM.field.player, t = p.tile(); WM.state.x = t.x; WM.state.y = t.y; WM.state.dir = p.dir; return WM.S.save(n); };
  window.loadAt = async function (n) { WM.S.load(n); WM.script.running = 0; WM.ui.stack.length = 0; WM.gfx.fade = 0; WM.setScene(WM.field, { map: WM.state.map, x: WM.state.x, y: WM.state.y, dir: WM.state.dir, noAuto: true }); await frames(10); return info(); };
  window.snap = function () { var c = document.getElementById('game'); var im = document.getElementById('snapimg'); if (!im) { im = document.createElement('img'); im.id = 'snapimg'; im.style.cssText = 'position:fixed;left:0;top:0;width:' + innerWidth + 'px;z-index:9;image-rendering:pixelated'; document.body.appendChild(im); } im.src = c.toDataURL(); return 'snap'; };
  window.unsnap = function () { var im = document.getElementById('snapimg'); if (im) im.remove(); };
  // walk the player to a tile using straight moves (no pathfinding)
  // BFS path over walkable tiles, then step tile by tile
  window.walkTo = async function (tx, ty) {
    var F = WM.field, m = F.map;
    var start = F.player.tile();
    var key = function (x, y) { return x + ',' + y; };
    var prev = {}, q = [[start.x, start.y]]; prev[key(start.x, start.y)] = null;
    var found = false;
    while (q.length) {
      var c = q.shift();
      if (c[0] === tx && c[1] === ty) { found = true; break; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = c[0] + d[0], ny = c[1] + d[1], k = key(nx, ny);
        if (k in prev) return;
        if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) return;
        if (WM.tiles.solid(m.get(nx, ny)) && !(nx === tx && ny === ty)) return;
        if (F.actors.some(function (a) { var t = a.tile(); return a.visible && a.solid && t.x === nx && t.y === ny; })) return;
        prev[k] = c; q.push([nx, ny]);
      });
    }
    if (!found) return 'nopath';
    var path = [], cur = [tx, ty];
    while (cur) { path.unshift(cur); cur = prev[key(cur[0], cur[1])]; }
    for (var i = 1; i < path.length; i++) {
      var p = path[i];
      for (var guard = 0; guard < 40; guard++) {
        var t = F.player.tile();
        if (t.x === p[0] && t.y === p[1]) {
          // centre on the tile a little to avoid clipping corners
          break;
        }
        var kk = t.x < p[0] ? 'ArrowRight' : t.x > p[0] ? 'ArrowLeft' : t.y < p[1] ? 'ArrowDown' : 'ArrowUp';
        window.dispatchEvent(new KeyboardEvent('keydown', { code: kk })); await frames(3); window.dispatchEvent(new KeyboardEvent('keyup', { code: kk })); await frames(1);
        if (WM.ui.busy() || WM.script.running || WM.scene !== WM.field || WM.field.map !== m) return 'interrupted';
      }
    }
    return true;
  };
})();

// A small war used only to exercise the army-battle engine in debug sessions.
WM.data.wars.debugwar = {
  name: 'Debug Skirmish', goal: 'rout', turns: 12,
  map: [
    '..............',
    '..TT......mm..',
    '......~~......',
    '..::::BB::::..',
    '......~~......',
    '..mm......TT..',
    '..............'
  ],
  player: [
    { leader: 'shijin', support: ['chenda'], type: 'cav', x: 1, y: 2, commander: true },
    { leader: 'zhuwu', support: ['yangchun'], type: 'inf', x: 1, y: 4 },
    { leader: 'andaoquan', type: 'inf', x: 0, y: 3 },
    { leader: 'huarong', type: 'arch', x: 2, y: 3 }
  ],
  enemy: [
    { name: 'Officer Wang', type: 'cav', atk: 70, def: 60, x: 12, y: 2, commander: true, portrait: 'officer' },
    { name: 'Archers', type: 'arch', atk: 55, def: 45, x: 12, y: 4 },
    { name: 'Spearmen', type: 'inf', atk: 60, def: 60, x: 11, y: 3 }
  ],
  intro: [[null, 'A debug skirmish. Rout every enemy unit.']],
  win: [[null, 'Victory.']], lose: [[null, 'Defeat.']]
};
