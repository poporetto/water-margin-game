// Browser autoplayer: plays the real game from a new game to the ending with the real engine — walking with the
// arrow keys across maps, through doors and over the world map, triggering events by touch, by facing and pressing
// confirm, or by arrival, and fighting every battle, duel and war. It logs anything that cannot be played.
// Load it in a ?debug page:  await import('/tools/autoplay.js?' + Date.now())  then  await AutoPlay.run({ from: 0 })
'use strict';
(function () {
  const S = WM.S, D = WM.data, T = WM.tiles;
  const log = [];
  const note = (kind, msg, extra) => { const e = Object.assign({ kind, ch: WM.state && WM.state.chapter, map: WM.state && WM.state.map, msg }, extra || {}); log.push(e); console.log('[autoplay]', kind, msg, extra || ''); };
  // let the browser breathe now and then (a message-channel tick is not throttled in a hidden tab the way timers are)
  const mc = new MessageChannel(); let tickRes = null; mc.port1.onmessage = () => { const r = tickRes; tickRes = null; r && r(); };
  const tick = () => new Promise((r) => { tickRes = r; mc.port2.postMessage(0); });
  let fcount = 0;
  const frames = async (n) => { for (let i = 0; i < n; i++) { WM.step(1 / 60, 1); for (let k = 0; k < 12; k++) await null; if (++fcount % 20 === 0) await tick(); } };
  const sceneName = () => Object.keys(WM.scenes).filter((k) => WM.scenes[k] === WM.scene)[0];
  const F = () => WM.field;

  // ---------- map geometry without building the field ----------
  const gridCache = {};
  function grid(id) {
    const def = D.maps[id]; if (!def) return null;
    const rows = typeof def.rows === 'function' ? (def._rows || def.rows()) : def.rows;
    const ck = id + '|' + (def.cacheKey ? def.cacheKey() : '');
    if (gridCache[ck]) return gridCache[ck];
    let w = 0; rows.forEach((r) => { w = Math.max(w, r.length); });
    const g = { id, w, h: rows.length, get: (x, y) => (y < 0 || y >= rows.length || x < 0 || x >= w) ? null : (rows[y][x] === undefined || rows[y][x] === ' ' ? (def.fill || '.') : rows[y][x]) };
    g.walk = (x, y) => { const c = g.get(x, y); return c !== null && !T.solid(c); };
    return (gridCache[ck] = g);
  }

  // ---------- which story event comes next ----------
  const DEAD = /^ch12_d\d$/;
  // story flags (not event bookkeeping): if firing a repeatable event leaves these unchanged, it did not move the story
  const storySig = () => Object.keys(WM.state.flags).filter((f) => f.indexOf('ev:') !== 0 && f.indexOf('loc:') !== 0 && WM.state.flags[f]).sort().join(',');
  const ignored = {}; let pending = null;
  function storyEvents() {
    const out = [];
    for (const map in D.events) for (const ev of D.events[map]) {
      if (!ev.run || ev.resident || DEAD.test(ev.id)) continue;
      const talk = !ev.trigger || ev.trigger === 'talk';
      if (!(ev.trigger === 'auto' || ev.trigger === 'touch' || ev.trigger === 'check' || talk)) continue;
      if (ev.once ? S.has('ev:' + ev.map + ':' + ev.id) : (!ev.cond || !/^(ch\d+_|tablet$)/.test(ev.id))) continue;   // repeatable: only chapter story, never shops and keepers (one that changes nothing is ignored below)
      const ig = ignored[ev.map + ':' + ev.id]; if (ig && ig === storySig()) continue;
      // only this chapter's story (a chapter jump never marks earlier chapters' one-time events as done)
      const cm = /^ch(\d+)_/.exec(ev.id), cur = WM.state.chapter || 0;
      if (cm ? +cm[1] !== cur : cur > 0 && /^(arrive|boy|snake|tiger|returned|tablet|gate|clouds)$/.test(ev.id)) continue;
      out.push(ev);
    }
    return out;
  }
  // tiles of ev.map on which ev could fire
  function fireTiles(ev) {
    const g = grid(ev.map); if (!g) return [];
    const st = WM.state, sm = st.map, sx = st.x, sy = st.y, out = [];
    const posDep = ev.cond && /\.x\b|\.y\b/.test(ev.cond.toString());
    const test = () => { try { return !ev.cond || !!ev.cond(S, st); } catch (e) { return false; } };
    st.map = ev.map;
    if (!posDep) { const ok = test(); st.map = sm; if (!ok) return []; return ['any']; }
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) { if (!g.walk(x, y)) continue; st.x = x; st.y = y; if (test()) out.push([x, y]); }
    st.map = sm; st.x = sx; st.y = sy;
    return out;
  }

  // ---------- routes between rooms ----------
  // A node is one connected walkable area of a map (an interior map holds several rooms); doors and exits link them.
  const compCache = {};
  function comps(id) {
    const g = grid(id); if (!g) return null;
    const ck = id + '|' + (D.maps[id].cacheKey ? D.maps[id].cacheKey() : '');
    if (compCache[ck]) return compCache[ck];
    const lab = new Int32Array(g.w * g.h).fill(-1); let n = 0;
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      if (lab[y * g.w + x] >= 0 || !g.walk(x, y)) continue;
      const q = [[x, y]]; lab[y * g.w + x] = n;
      while (q.length) { const c = q.pop(); for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = c[0] + d[0], ny = c[1] + d[1]; if (nx < 0 || ny < 0 || nx >= g.w || ny >= g.h) continue; const i = ny * g.w + nx; if (lab[i] >= 0 || !g.walk(nx, ny)) continue; lab[i] = n; q.push([nx, ny]); } }
      n++;
    }
    const c = { lab, w: g.w, h: g.h, at: (x, y) => (x < 0 || y < 0 || x >= g.w || y >= g.h) ? -1 : lab[y * g.w + x] };
    return (compCache[ck] = c);
  }
  function exitsOf(id) { const def = D.maps[id]; if (!def) return []; try { return (def.exits || []).filter((e) => D.maps[e.to] && (!e.cond || e.cond(S, WM.state))); } catch (e) { return []; } }
  // the rooms an exit can be stepped onto from (an exit tile may be a door in a wall: use its walkable neighbours too)
  function exitComps(id, e) {
    const c = comps(id), out = new Set();
    for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) {
      [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach((d) => { const k = c.at(x + d[0], y + d[1]); if (k >= 0) out.add(k); });
    }
    return out;
  }
  // BFS from the player's room to any goal room; returns the exits to take, in order
  function routeTo(goals) {     // goals: Set of 'map#comp'
    const f = F(), here = f.map.id, t = f.player.tile(), start = here + '#' + comps(here).at(t.x, t.y);
    if (goals.has(start)) return [];
    const prev = { [start]: null }, q = [start];
    while (q.length) {
      const node = q.shift(), [m, cs] = node.split('#'), cc = +cs;
      for (const e of exitsOf(m)) {
        if (!exitComps(m, e).has(cc)) continue;
        const tc = comps(e.to); if (!tc) continue;
        let k = tc.at(e.tx, e.ty);
        if (k < 0) for (const d of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { k = tc.at(e.tx + d[0], e.ty + d[1]); if (k >= 0) break; }
        const nn = e.to + '#' + k; if (nn in prev) continue;
        prev[nn] = { node, e };
        if (goals.has(nn)) { const path = []; let c = nn; while (prev[c]) { path.unshift(prev[c].e); c = prev[c].node; } return path; }
        q.push(nn);
      }
    }
    return null;
  }
  // the rooms (map#comp) from which an event can be reached
  function goalRooms(ev, tiles) {
    const c = comps(ev.map), out = new Set(); if (!c) return out;
    const add = (x, y) => { const k = c.at(x, y); if (k >= 0) out.add(ev.map + '#' + k); };
    const near = (x, y) => { add(x, y); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach((d) => add(x + d[0], y + d[1])); };
    if (ev.trigger === 'auto') { if (tiles[0] === 'any') { for (let i = 0; i < c.lab.length; i++) if (c.lab[i] >= 0) out.add(ev.map + '#' + c.lab[i]); } else tiles.forEach((p) => add(p[0], p[1])); }
    else if (ev.trigger === 'touch') { for (let y = ev.y; y < ev.y + (ev.h || 1); y++) for (let x = ev.x; x < ev.x + (ev.w || 1); x++) add(x, y); }
    else { let x = ev.x, y = ev.y; const a = F().map.id === ev.map && (F().actors.find((q) => q.ev === ev)); if (a) { const at = a.tile(); x = at.x; y = at.y; } near(x, y); }
    return out;
  }

  // ---------- walking ----------
  // BFS on the live field from the player to any of `goals` ([x,y] list); walks there with the arrow keys
  async function walkToAny(goals, opt) {
    opt = opt || {};
    const f = F(), m = f.map, start = f.player.tile(), key = (x, y) => x + ',' + y;
    const goalSet = new Set(goals.map((g) => key(g[0], g[1])));
    if (goalSet.has(key(start.x, start.y)) && !opt.step) return 'here';
    const prev = { [key(start.x, start.y)]: null }, q = [[start.x, start.y]]; let found = null;
    const blockedByActor = (x, y) => f.actors.some((a) => { const t = a.tile(); return a.visible && a.solid && t.x === x && t.y === y; });
    const locked = new Set();
    // locked exits bump the player back, and other open exits would carry the player off somewhere else: walk around both
    (f.map.def.exits || []).forEach((e) => { let ok = true; try { ok = !e.cond || e.cond(S, WM.state); } catch (er) {} const inIt = start.x >= e.x && start.x < e.x + (e.w || 1) && start.y >= e.y && start.y < e.y + (e.h || 1); if ((ok || !e.passable) && !inIt) for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) locked.add(key(x, y)); });
    while (q.length && !found) {
      const c = q.shift();
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = c[0] + d[0], ny = c[1] + d[1], k = key(nx, ny);
        if (k in prev || nx < 0 || ny < 0 || nx >= m.w || ny >= m.h) continue;
        const isGoal = goalSet.has(k);
        if (f.tileSolid(nx, ny) && !(isGoal && opt.solidGoal)) continue;
        if (blockedByActor(nx, ny) && !isGoal) continue;
        if (locked.has(k) && !isGoal) continue;
        prev[k] = c; if (isGoal) { found = [nx, ny]; break; } q.push([nx, ny]);
      }
    }
    if (!found) {
      // say who stands in the way: actors on any tile next to the explored area
      const by = f.actors.filter((a) => { const t = a.tile(); return a.visible && a.solid && !a.isPlayer && [[1, 0], [-1, 0], [0, 1], [0, -1]].some((d) => key(t.x + d[0], t.y + d[1]) in prev); });
      return 'nopath' + (by.length ? ' (blocked by ' + by.map((a) => (a.ev && (a.ev.id || a.ev.char)) || a.name || '?').join(', ') + ')' : '');
    }
    const path = []; let cur = found; while (cur) { path.unshift(cur); cur = prev[key(cur[0], cur[1])]; }
    for (let i = 1; i < path.length; i++) {
      const p = path[i];
      if (opt.solidGoal && i === path.length - 1) { // face it instead of walking into it
        const t = f.player.tile();
        const kk = t.x < p[0] ? 'ArrowRight' : t.x > p[0] ? 'ArrowLeft' : t.y < p[1] ? 'ArrowDown' : 'ArrowUp';
        window.dispatchEvent(new KeyboardEvent('keydown', { code: kk })); await frames(2); window.dispatchEvent(new KeyboardEvent('keyup', { code: kk })); await frames(1);
        return 'facing';
      }
      for (let guard = 0; guard < 50; guard++) {
        const t = f.player.tile();
        if (t.x === p[0] && t.y === p[1]) break;
        const kk = t.x < p[0] ? 'ArrowRight' : t.x > p[0] ? 'ArrowLeft' : t.y < p[1] ? 'ArrowDown' : 'ArrowUp';
        window.dispatchEvent(new KeyboardEvent('keydown', { code: kk })); await frames(3); window.dispatchEvent(new KeyboardEvent('keyup', { code: kk })); await frames(1);
        if (WM.ui.busy() || WM.script.running || WM.scene !== WM.field || f.map !== m || f.transitioning) return 'interrupted';
        if (guard === 49) return 'stuck@' + t.x + ',' + t.y;
      }
    }
    return 'arrived';
  }
  const press = async (code) => { window.dispatchEvent(new KeyboardEvent('keydown', { code })); await frames(2); window.dispatchEvent(new KeyboardEvent('keyup', { code })); await frames(2); };

  // ---------- fights and dialogue ----------
  let topW = null, topN = 0;
  async function handleNonField() {
    const sc = sceneName();
    if (sc === 'battle') { await window.battleAuto(); return true; }
    if (sc === 'duel') { await window.duelAuto(); return true; }
    if (sc === 'war') { await warSmart(); return true; }
    if (WM.ui.busy()) {
      const top = WM.ui.top(); topN = top === topW ? topN + 1 : 0; topW = top;
      await press(topN > 25 ? 'KeyX' : 'KeyZ'); await frames(4); return true;   // a menu that will not close on confirm (a shop): cancel out
    }
    if (WM.script.running || F().transitioning || (sc && sc !== 'field')) { await frames(8); return true; }
    return false;
  }

  // ---------- one step of progress ----------
  let lastProgress = '', sameCount = 0, rests = 0;
  async function advance() {
    if (await handleNonField()) return 'busy';
    if (pending) { if (!pending.ev.once && storySig() === pending.sig) ignored[pending.ev.map + ':' + pending.ev.id] = pending.sig; pending = null; }
    const f = F(), here = f.map.id;
    // a player rests at an inn or uses medicine between scenes; stand in for that when the party is worn down
    const worn = (WM.state.party || []).some((id) => { const c = WM.state.chars[id]; return c && c.hp < S.stats(id).mhp * 0.6; });
    if (worn) { (WM.state.party || []).forEach((id) => S.restore(id)); rests++; }
    // the next event: prefer this map, then the nearest by route
    const evs = storyEvents(); let best = null;
    for (const ev of evs) {
      const tiles = fireTiles(ev); if (!tiles.length) continue;
      const goals = goalRooms(ev, tiles); if (!goals.size) continue;
      const r = routeTo(goals); if (!r) continue;
      const score = r.length * 1000 + (ev.trigger === 'auto' ? 0 : 1);
      if (!best || score < best.score) best = { ev, tiles, r, score };
    }
    if (!best) return 'noevent';
    const { ev, tiles, r } = best;
    if (r.length) {
      // step onto the first exit on the route
      const e = r[0], goals = [];
      for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) goals.push([x, y]);
      const res = await walkToAny(goals, { step: true });
      if (String(res).startsWith('nopath') || String(res).startsWith('stuck')) return 'route-fail:' + here + '->' + e.to + ' ' + res + ' (for ' + ev.map + ':' + ev.id + ')';
      await frames(40);
      return 'moved';
    }
    // on the event's map
    if (ev.trigger === 'auto') {
      if (tiles[0] === 'any') { f.pendingAuto = true; await frames(4); return WM.script.running ? (pending = { ev, sig: storySig() }, 'fired') : 'auto-wont-fire:' + ev.id; }
      const t = f.player.tile();
      if (tiles.some((p) => p[0] === t.x && p[1] === t.y)) { f.pendingAuto = true; await frames(4); return WM.script.running ? (pending = { ev, sig: storySig() }, 'fired') : 'auto-wont-fire:' + ev.id; }
      // a position-dependent auto event only fires on arrival — note it, then walk there and nudge it
      const res = await walkToAny(tiles);
      note('warn', 'auto event needs a position reached by walking: ' + ev.map + ':' + ev.id + ' (' + res + ')');
      f.pendingAuto = true; await frames(4);
      return 'nudged';
    }
    if (ev.trigger === 'touch') {
      const goals = []; for (let y = ev.y; y < ev.y + (ev.h || 1); y++) for (let x = ev.x; x < ev.x + (ev.w || 1); x++) goals.push([x, y]);
      const ok = goals.filter((g) => tiles[0] === 'any' || tiles.some((p) => p[0] === g[0] && p[1] === g[1]));
      const res = await walkToAny(ok.length ? ok : goals, { step: true });
      await frames(6);
      if (WM.script.running || WM.ui.busy() || sceneName() !== 'field') { pending = { ev, sig: storySig() }; return 'fired'; }
      return 'touch-fail:' + ev.map + ':' + ev.id + ' ' + res;
    }
    if (ev.trigger === 'check') {
      const res = await walkToAny([[ev.x, ev.y]], { solidGoal: true });
      await press('KeyZ'); await frames(6);
      if (WM.script.running || WM.ui.busy()) { pending = { ev, sig: storySig() }; return 'fired'; }
      return 'check-fail:' + ev.map + ':' + ev.id + ' ' + res;
    }
    // talk to a character: walk next to them, face them, press confirm
    const a = f.actors.find((x) => x.ev === ev) || f.findActor(ev.id);
    if (!a) return 'talk-noactor:' + ev.map + ':' + ev.id;
    const at = a.tile();
    const res = await walkToAny([[at.x, at.y]], { solidGoal: true });
    await press('KeyZ'); await frames(6);
    if (WM.script.running || WM.ui.busy()) { pending = { ev, sig: storySig() }; return 'fired'; }
    return 'talk-fail:' + ev.map + ':' + ev.id + ' ' + res;
  }

  // Losing a fight that would end the game is recorded (troop, party, levels) and the story carries on, so one run
  // finds every fight that is too hard rather than stopping at the first.
  function hookFights() {
    if (WM.__apHooked) return; WM.__apHooked = true;
    const partyInfo = () => (WM.state.party || []).map((id) => id + ' L' + (WM.state.chars[id] ? WM.state.chars[id].lv : '?')).join(', ');
    const wrap = (obj, name, kind) => {
      const f0 = obj.start;
      obj.start = function (id, o) {
        o = o || {}; const could = !!o.canLose, info = partyInfo();
        o.canLose = true;
        return f0.call(this, id, o).then((r) => {
          if ((r === 'lose') && !could) note('LOST', kind + ' ' + (typeof id === 'string' ? id : '(inline)') + ' — party: ' + info);
          if (r === 'lose' && !could) { (WM.state.party || []).forEach((p) => S.restore(p)); return 'win'; }
          return r;
        });
      };
    };
    wrap(WM.battle, 'battle', 'battle'); wrap(WM.duel, 'duel', 'duel'); wrap(WM.war, 'war', 'war');
  }

  async function run(opt) {
    opt = opt || {};
    log.length = 0;
    hookFights();
    const from = opt.from || 0, to = opt.to != null ? opt.to : 24;
    window.AutoPlay.stop = false;
    WM.debug.jump(from); await frames(60);
    WM.state.flags.noEncounters = !opt.encounters;
    let fails = 0, steps = 0, lastCh = -1, chStart = Date.now(), curCh = from, busyN = 0, busySig = '';
    while (!window.AutoPlay.stop && steps < (opt.maxSteps || 40000)) {
      steps++;
      if (sceneName() === 'title' && WM.state && WM.state.flags.ending_done) { note('done', 'reached the ending'); break; }
      if (sceneName() === 'title' && (WM.ui.busy() || WM.script.running)) { await handleNonField(); continue; }
      if (sceneName() === 'title') { note('fail', 'game over or kicked to title'); if (curCh >= to) break; if (!opt.skipOnFail) break; curCh = Math.min(24, curCh + 1); WM.debug.jump(curCh); await frames(60); continue; }
      if (WM.lastError) { note('error', String(WM.lastError && WM.lastError.stack || WM.lastError)); WM.lastError = null; }
      if (WM.state.chapter !== lastCh) {
        if (lastCh >= 0) note('chapter', 'chapter ' + lastCh + ' done in ' + Math.round((Date.now() - chStart) / 1000) + 's');
        lastCh = WM.state.chapter; chStart = Date.now(); if (lastCh > curCh) curCh = lastCh;
        WM.state.flags.noEncounters = !opt.encounters;
        if (lastCh > to) break;
      }
      const res = await advance();
      if (res === 'busy') {
        const sig = storySig() + '|' + WM.state.map + '|' + JSON.stringify(F().player && F().player.tile()) + '|' + sceneName();
        busyN = sig === busySig ? busyN + 1 : 0; busySig = sig;
        if (busyN > 1500) { note('fail', 'looping without progress (repeating dialogue?)'); busyN = 0; if (!opt.skipOnFail) break; curCh = Math.min(24, curCh + 1); if (curCh > to) break; WM.debug.jump(curCh); await frames(60); }
        continue;
      }
      if (res === 'moved' || res === 'fired' || res === 'nudged') { fails = 0; busyN = 0; continue; }
      fails++;
      if (fails === 1 || fails % 5 === 0) note('stuck', res, { tile: F().player && F().player.tile() });
      if (fails > 12) {
        note('fail', 'cannot progress: ' + res);
        if (!opt.skipOnFail) break;
        curCh = Math.min(24, curCh + 1); if (curCh > to) break; WM.debug.jump(curCh); await frames(60); fails = 0;
      }
      await frames(10);
    }
    return log;
  }
  // Play a war the way a careful player would: the commander holds back (and only strikes what comes next to it),
  // everyone else closes on the weakest enemy in reach, from the best ground, and archers shoot from range.
  async function warSmart() {
    const rng = (u) => { let r = u.type === 'arch' ? 2 : 1; if (u.type === 'arch' && u.abil.includes('arrows')) r++; if (u.abil.includes('thunder') || u.abil.includes('sorcery')) r = Math.max(r, 3); if (u.abil.includes('fire') || u.abil.includes('water')) r = Math.max(r, 2); return r; };
    const dist = (a, x, y) => Math.abs(a.x - x) + Math.abs(a.y - y);
    for (let t = 0; t < 600 && WM.war.cur; t++) {
      const wr = WM.war.cur, top = WM.ui.top();
      if (!top) { await frames(10); continue; }
      if (wr.phase !== 'player' || wr.busy || !top.isWarInput) { if (!top.isWarInput) await press('KeyZ'); await frames(10); continue; }
      if (wr.mode === 'cursor') {
        const mine = wr.units.filter((u) => u.side === 'player' && u.losses < 2 && !u.done).sort((a, b) => (a.commander ? 1 : 0) - (b.commander ? 1 : 0))[0];
        if (!mine) { await frames(10); continue; }
        wr.cursor = { x: mine.x, y: mine.y }; await press('KeyZ');
        if (wr.mode !== 'move') { await press('KeyZ'); continue; }
        const foes = wr.units.filter((u) => u.side === 'enemy' && u.losses < 2);
        let best = [mine.x, mine.y];
        if (!mine.commander) {
          let bs = -1e9;
          for (const k in wr.reach) {
            const p = k.split(',').map(Number);
            if (k !== mine.x + ',' + mine.y && wr.units.some((u) => u.losses < 2 && u.x === p[0] && u.y === p[1])) continue;
            const inR = foes.filter((e) => dist(e, p[0], p[1]) <= rng(mine));
            const near = Math.min(...foes.map((e) => dist(e, p[0], p[1])));
            const adj = foes.filter((e) => dist(e, p[0], p[1]) <= 1).length;
            let sc = inR.length ? 100 + Math.max(...inR.map((e) => e.losses * 20 - e.def / 10)) : -near * 5;
            if (rng(mine) > 1) sc -= adj * 30;                     // archers keep out of reach
            if (mine.losses && inR.length) sc -= adj * 15;         // a hurt unit avoids being swarmed
            const tr = WM.war.cur.d.map[p[1]] && WM.war.cur.d.map[p[1]][p[0]];
            if (tr === 'T' || tr === 'm' || tr === 'H' || tr === 'G' || tr === 'r') sc += 8;
            if (sc > bs) { bs = sc; best = p; }
          }
        }
        wr.cursor = { x: best[0], y: best[1] }; await press('KeyZ'); await frames(4);
        if (WM.ui.top() && !WM.ui.top().isWarInput) { await press('KeyZ'); await frames(4); }   // Attack if there is one, else Wait
        if (wr.mode === 'target') {
          let bi = 0; wr.targets.forEach((e, i) => { const b0 = wr.targets[bi]; if (e.losses > b0.losses || (e.losses === b0.losses && e.def < b0.def)) bi = i; });
          wr.tIdx = bi; await press('KeyZ');
        }
        await frames(80);
      } else { await press('KeyZ'); await frames(10); }
    }
    for (let j = 0; j < 30 && WM.scene !== F(); j++) { if (WM.ui.busy()) await press('KeyZ'); await frames(10); }
  }
  // Fight a war several times with every hero in it at a given level; returns wins/tries
  async function warBench(id, lv, reps) {
    const d = D.wars[id], out = [];
    for (let rep = 0; rep < (reps || 5); rep++) {
      WM.script.running = 0; WM.ui.stack.length = 0;
      d.player.forEach((u) => [u.leader].concat(u.support || []).forEach((cid) => { if (!WM.state.chars[cid]) S.initChar(cid, lv); WM.state.chars[cid].lv = lv; }));
      let res; WM.script.run(async (s) => { res = await s.war(id, { canLose: true }); });
      await frames(60); await warSmart(); for (let i = 0; i < 40 && res === undefined; i++) await frames(10);
      out.push(res === 'win' ? 'W' : 'L');
    }
    return id + ' @L' + lv + ': ' + out.join('');
  }
  // Replay a fight several times with a given party (ids and levels) at the floor gear a hero of that level has.
  async function bench(troop, party, opt) {
    opt = opt || {}; const out = [];
    for (let rep = 0; rep < (opt.reps || 3); rep++) {
      WM.script.running = 0; WM.ui.stack.length = 0; WM.battle.cur = null;
      WM.state.chars = {};
      party.forEach(([id, lv]) => { S.initChar(id, lv); S.catchUp(id); if (opt.weapon && opt.weapon[id]) WM.state.chars[id].weapon = opt.weapon[id]; S.restore(id); });
      (opt.guests || []).forEach(([id, lv]) => { S.initChar(id, lv); S.catchUp(id); S.restore(id); });
      S.setParty(party.map((p) => p[0]));
      let res; WM.script.run(async (s) => { res = await s.battle(troop, Object.assign({ canLose: true }, opt.battle || {}, opt.guests ? { guests: opt.guests.map((g) => g[0]) } : {})); });
      await frames(30); await window.battleAuto(); for (let i = 0; i < 20 && res === undefined; i++) await frames(10);
      const hp = party.map(([id]) => Math.round(100 * WM.state.chars[id].hp / S.stats(id).mhp));
      out.push((res === 'win' ? 'W' : res === 'timeout' ? 'T' : 'L') + hp.join('/'));
    }
    return troop + ': ' + out.join(' ');
  }
  window.AutoPlay = { bench, warBench, warSmart, run, log, get rests() { return rests; }, advance, storyEvents, fireTiles, routeTo, goalRooms, comps, walkToAny };
})();
