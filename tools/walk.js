// Headless story walker: plays the whole story with a mock cutscene API.
//   node tools/walk.js            -> walk from a new game to the end, report errors and progress
//   node tools/walk.js --verbose  -> also print each event as it runs
// It checks: speakers, actor keys, spawn/warp/place tiles, battle/duel/war/shop/item ids, beast art,
// joins (each of the 108 exactly once), map reachability through exits, and tile reachability of events.
'use strict';
const { load } = require('./headless.js');
const VERBOSE = process.argv.includes('--verbose');
const sb = load();
const WM = sb.WM, S = WM.S, D = WM.data;
// time never passes headless: make engine timing helpers resolve at once
WM.tween = function (d, fn) { if (fn) fn(1); return Promise.resolve(); };
WM.wait = function () { return Promise.resolve(); };
WM.fadeOut = WM.fadeIn = function () { return Promise.resolve(); };

const errors = [];
const warn = [];
let curEvent = '(none)';
function err(msg) { errors.push('[' + curEvent + '] ' + msg); }

// ---------- map helpers ----------
const rowsCache = {};
function rowsOf(mid) {
  const m = D.maps[mid];
  if (!m) return null;
  if (typeof m.rows === 'function') { // world depends on flags: cache by its key
    const key = mid + ':' + (m.cacheKey ? m.cacheKey() : '');
    return rowsCache[key] || (rowsCache[key] = m.rows());
  }
  return rowsCache[mid] || (rowsCache[mid] = m.rows);
}
function tile(mid, x, y) { const r = rowsOf(mid); if (!r || y < 0 || x < 0 || !r[y] || x >= r[y].length) return null; const c = r[y][x]; return c === ' ' ? (D.maps[mid].fill || '.') : c; }
function walkable(mid, x, y) { const c = tile(mid, x, y); return c != null && !WM.tiles.solid(c); }

// ---------- world simulation ----------
let cur = { map: null, x: 0, y: 0 };
let temp = {};          // temp actors on the current map: key -> {x,y}
const joins = {};

function eventActive(ev) {
  if (ev.once && S.has('ev:' + ev.map + ':' + ev.id)) return false;
  if (ev.cond) { try { if (!ev.cond(S, WM.state)) return false; } catch (e) { err('cond threw on ' + ev.map + ':' + ev.id + ': ' + e.message); return false; } }
  return true;
}
function eventHasActor(ev) { return !!(ev.char || ev.npc || ev.look); }
function actorsOnMap(mid) {
  const out = {};
  (D.events[mid] || []).forEach((ev) => {
    if (!eventHasActor(ev) || !eventActive(ev)) return;
    const a = { x: ev.x, y: ev.y };
    out[ev.id] = a; if (ev.char) out[ev.char] = a; if (ev.npc) out[ev.npc] = a;
  });
  return out;
}
// like the real field, actors are fixed when a map loads or an event starts, not re-evaluated mid-script
let frozen = {};
function freezeActors() { frozen = actorsOnMap(cur.map); }
function findActor(key) {
  if (key === 'player' || key === WM.state.leader) return cur;
  if (temp[key]) return temp[key];
  return frozen[key] || null;
}

// ---------- speaker validation ----------
const EXPR = ['normal', 'angry', 'sad', 'smile', 'shock'];
function checkSpeaker(who) {
  if (who == null) return;
  if (typeof who === 'object') { if (!who.name) err('speaker object without name'); return; }
  let id = who, expr = null;
  if (who.indexOf(':') > 0) { id = who.split(':')[0]; expr = who.split(':')[1]; }
  if (!D.chars[id] && !D.npcs[id]) err('unknown speaker "' + who + '"');
  if (expr && EXPR.indexOf(expr) < 0) err('unknown expression "' + expr + '"');
}

// ---------- mock API ----------
const realApi = WM.script.makeApi({});
const resolved = Promise.resolve();
function mkApi(ctx) {
  const s = {
    S: S, ctx: ctx,
    get state() { return WM.state; },
    say(who, text) { checkSpeaker(who); if (!text) err('empty say'); return resolved; },
    narrate(text) { if (!text) err('empty narrate'); return resolved; },
    ask(who, text, options) { checkSpeaker(who); return Promise.resolve(0); },
    choose(options) { return Promise.resolve(0); },
    notice() { return resolved; }, wait() { return resolved; }, fadeOut() { return resolved; }, fadeIn() { return resolved; },
    actor(key) { const a = findActor(key); if (!a) err('no actor "' + key + '" on ' + cur.map); return a || {}; },
    move(key, steps) {
      const a = findActor(key); if (!a) { err('move: no actor "' + key + '" on ' + cur.map); return resolved; }
      const parse = Array.isArray(steps) ? steps : steps.trim().split(/\s+/).map((tk) => { const d = tk[0].toUpperCase(), n = parseInt(tk.slice(1) || '1', 10); return d === 'R' ? [n, 0] : d === 'L' ? [-n, 0] : d === 'U' ? [0, -n] : [0, n]; });
      parse.forEach((st) => { a.x += st[0]; a.y += st[1]; });
      if (a.x < 0 || a.y < 0) err('move: "' + key + '" leaves the map');
      return resolved;
    },
    moveTo(key, tx, ty) { const a = findActor(key); if (!a) err('moveTo: no actor "' + key + '"'); else { a.x = tx; a.y = ty; } return resolved; },
    place(key, tx, ty) {
      const a = findActor(key); if (!a) { err('place: no actor "' + key + '" on ' + cur.map); return; }
      a.x = tx; a.y = ty;
      if (key === 'player' || key === WM.state.leader) { if (!walkable(cur.map, tx, ty)) err('place player on solid tile ' + cur.map + '(' + tx + ',' + ty + ') "' + tile(cur.map, tx, ty) + '"'); }
    },
    face(key) { if (!findActor(key)) err('face: no actor "' + key + '"'); },
    faceEach(a, b) { if (!findActor(a)) err('faceEach: no actor "' + a + '"'); if (!findActor(b)) err('faceEach: no actor "' + b + '"'); },
    emote(key) { if (!findActor(key)) err('emote: no actor "' + key + '"'); return resolved; },
    jump(key) { if (!findActor(key)) err('jump: no actor "' + key + '"'); return resolved; },
    show(key) { if (!findActor(key)) err('show: no actor "' + key + '"'); },
    hide(key) { if (!findActor(key)) err('hide: no actor "' + key + '"'); },
    lie(key) { if (!findActor(key)) err('lie: no actor "' + key + '"'); },
    spawn(key, who, tx, ty) {
      if (typeof who === 'string' && !D.chars[who] && !D.npcs[who]) err('spawn: unknown "' + who + '"');
      if (tile(cur.map, tx, ty) == null) err('spawn "' + key + '" outside map ' + cur.map + ' (' + tx + ',' + ty + ')');
      temp[key] = { x: tx, y: ty };
    },
    spawnBeast(key, art, tx, ty) { if (!WM.monsters.ART[art]) err('spawnBeast: unknown art "' + art + '"'); temp[key] = { x: tx, y: ty }; },
    despawn(key) { if (!temp[key] && !findActor(key)) err('despawn: no actor "' + key + '"'); delete temp[key]; },
    leader(id) { if (!D.chars[id]) err('leader: unknown char ' + id); },
    shake() { return resolved; }, flash() { return resolved; },
    sfx() {}, music(id) { if (id && !WM.audio.tracks[id]) err('unknown music "' + id + '"'); }, stopMusic() {},
    tint(t) { WM.state.flags.tintOverride = t; }, night(on) { WM.state.flags.night = on !== false; }, weather(w) { WM.state.flags.weather = w || null; },
    camera() { return resolved; }, cameraReset() {},
    warp(map, tx, ty) {
      if (!D.maps[map]) { err('warp to unknown map ' + map); return resolved; }
      if (!walkable(map, tx, ty)) err('warp lands on solid tile ' + map + '(' + tx + ',' + ty + ') "' + tile(map, tx, ty) + '"');
      cur = { map: map, x: tx, y: ty }; temp = {}; WM.state.map = map; WM.state.x = tx; WM.state.y = ty; freezeActors();
      return resolved;
    },
    battle(troop) { const t = typeof troop === 'string' ? D.troops[troop] : troop; if (!t) err('unknown troop ' + troop); else (Array.isArray(t) ? t : t.enemies).forEach((e) => { if (!D.enemies[e]) err('troop ' + troop + ' has unknown enemy ' + e); }); return Promise.resolve('win'); },
    duel(id) { if (!D.duels[id]) err('unknown duel ' + id); else { const d = D.duels[id]; if (!D.chars[d.hero]) err('duel hero unknown ' + d.hero); if (!D.chars[d.foe] && !D.npcs[d.foe]) err('duel foe unknown ' + d.foe); } return Promise.resolve('win'); },
    war(id) { if (!D.wars[id]) err('unknown war ' + id); else { D.wars[id].player.forEach((u) => { if (!D.chars[u.leader]) err('war ' + id + ' unknown leader ' + u.leader); (u.support || []).forEach((x) => { if (!D.chars[x]) err('war ' + id + ' unknown support ' + x); }); }); } return Promise.resolve('win'); },
    join(id, opt) {
      if (!D.chars[id]) { err('join unknown ' + id); return resolved; }
      if (joins[id]) err('duplicate join of ' + id + ' (first in ' + joins[id] + ')');
      joins[id] = curEvent;
      S.recruit(id, opt && opt.lv); if (opt && opt.party) S.addToParty(id);
      return resolved;
    },
    joinMany(ids, opt) { ids.forEach((id) => s.join(id, opt)); return resolved; },
    party(ids) { ids.forEach((id) => { if (!D.chars[id]) err('party unknown ' + id); }); S.setParty(ids); },
    addParty(id) { if (!D.chars[id]) { err('addParty unknown ' + id); return; } if (!WM.state.chars[id]) S.initChar(id); S.addToParty(id); },
    removeParty(id) { S.removeFromParty(id); if (WM.state.leader === id && WM.state.party.length) WM.state.leader = WM.state.party[0]; },
    setLeader(id) { if (!D.chars[id]) err('setLeader unknown ' + id); WM.state.leader = id; },
    inParty(id) { return WM.state.party.indexOf(id) >= 0; },
    level(id, lv) { if (!D.chars[id]) { err('level unknown ' + id); return; } const c = WM.state.chars[id] || S.initChar(id, lv); if (c.lv < lv) { c.lv = lv; S.restore(id); } },
    heal() { S.restoreParty(); },
    kill(id) { if (!D.chars[id]) err('kill unknown ' + id); WM.state.dead[id] = true; S.removeFromParty(id); return resolved; },
    flag(k, v) { return S.flag(k, v === undefined ? true : v); },
    unflag(k) { delete WM.state.flags[k]; },
    has(k) { return S.has(k); },
    give(item, n) { if (!D.items[item]) { err('give unknown item ' + item); return resolved; } S.give(item, n || 1); return resolved; },
    take(item, n) { if (!D.items[item]) err('take unknown item ' + item); else S.take(item, n || 1); },
    count(item) { return S.count(item); },
    gold(n) { WM.state.gold = Math.max(0, WM.state.gold + n); return resolved; },
    chapter(n) { if (!D.chapters[n]) err('unknown chapter ' + n); WM.state.chapter = n; if (VERBOSE) console.log('== Chapter ' + n + ' ' + (D.chapters[n] || {}).short); return resolved; },
    card() { return resolved; }, endChapter() { if (global.__checkTotals) global.__checkTotals(); return resolved; },
    shop(id) { if (!D.shops[id]) err('unknown shop ' + id); else D.shops[id].items.forEach((i) => { if (!D.items[i]) err('shop ' + id + ' unknown item ' + i); }); return resolved; },
    inn() { S.restoreAll(); return Promise.resolve(true); }, smith() { return resolved; },
    talismanShop(id) { if (!D.shops[id]) err('unknown talisman shop ' + id); else D.shops[id].items.forEach((i) => { if (!D.talismans[i]) err('talisman shop ' + id + ' unknown talisman ' + i); }); return resolved; },
    saveMenu() { return resolved; }, roster() { return resolved; }, tablet() { return resolved; }
  };
  // keep the mock in lock-step with the real API
  Object.keys(realApi).forEach((k) => { if (!(k in s)) err('walker mock missing API method "' + k + '"'); });
  return s;
}

// ---------- reachability ----------
function exitsOf(mid) { const m = D.maps[mid]; return (m && m.exits) || []; }
let reachCache = {};      // per iteration: mapId -> component labelling
let reachMapsCache = null;
function labelMap(mid) {
  if (reachCache[mid]) return reachCache[mid];
  const r = rowsOf(mid); const h = r.length; let w = 0; r.forEach((row) => { w = Math.max(w, row.length); });
  const lab = new Int32Array(w * h).fill(-1);
  const blockers = new Set();
  const acts = actorsOnMap(mid);
  Object.keys(acts).forEach((k) => blockers.add(acts[k].x + ',' + acts[k].y));
  let id = 0;
  for (let y0 = 0; y0 < h; y0++) for (let x0 = 0; x0 < w; x0++) {
    if (lab[y0 * w + x0] !== -1 || !walkable(mid, x0, y0) || blockers.has(x0 + ',' + y0)) continue;
    const st = [[x0, y0]]; lab[y0 * w + x0] = id;
    while (st.length) {
      const [x, y] = st.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || lab[ny * w + nx] !== -1) continue;
        if (!walkable(mid, nx, ny) || blockers.has(nx + ',' + ny)) continue;
        lab[ny * w + nx] = id; st.push([nx, ny]);
      }
    }
    id++;
  }
  return (reachCache[mid] = { lab, w, h });
}
function tileReach(mid, from) {
  const L = labelMap(mid);
  const at = (x, y) => (x < 0 || y < 0 || x >= L.w || y >= L.h) ? -2 : L.lab[y * L.w + x];
  let comp = at(from.x, from.y);
  if (comp < 0) { // standing on a non-walkable arrival tile: use any neighbour's component
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = at(from.x + dx, from.y + dy); if (c >= 0) { comp = c; break; } }
  }
  return { has(k) { const i = k.indexOf(','); const x = +k.slice(0, i), y = +k.slice(i + 1); return comp >= 0 && at(x, y) === comp; } };
}
// map-level BFS through exits (with conditions), returning a path of [mapId, arrival tile]
// all (map, arrival) states reachable from the current position: mapId -> [arrival tiles]
// (maps with several separate rooms are reached through several arrivals)
function reachableMaps(fromMap, fromTile) {
  const out = new Map([[fromMap, [fromTile]]]);
  const seen = new Set([fromMap + '@' + fromTile.x + ',' + fromTile.y]);
  const q = [{ map: fromMap, t: fromTile }];
  while (q.length) {
    const n = q.shift();
    const reach = tileReach(n.map, n.t);
    exitsOf(n.map).forEach((e) => {
      if (!D.maps[e.to]) return;
      const key = e.to + '@' + e.tx + ',' + e.ty;
      if (seen.has(key)) return;
      if (e.cond) { try { if (!e.cond(S, WM.state)) return; } catch (x) { return; } }
      let ok = false;
      for (let dx = 0; dx < (e.w || 1) && !ok; dx++) for (let dy = 0; dy < (e.h || 1) && !ok; dy++) {
        const ex = e.x + dx, ey = e.y + dy;
        if (reach.has(ex + ',' + ey) || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => reach.has((ex + a) + ',' + (ey + b)))) ok = true;
      }
      if (!ok) return;
      seen.add(key);
      const t = { x: e.tx, y: e.ty };
      if (!out.has(e.to)) out.set(e.to, []);
      out.get(e.to).push(t);
      q.push({ map: e.to, t: t });
    });
  }
  return out;
}
// map-level BFS through exits (with conditions), returning a path of [mapId, arrival tile]
function mapRoute(fromMap, fromTile, toMap) {
  const start = { map: fromMap, t: fromTile };
  const seen = new Set([fromMap]); const q = [start];
  while (q.length) {
    const n = q.shift();
    if (n.map === toMap) return n;
    const reach = tileReach(n.map, n.t);
    exitsOf(n.map).forEach((e) => {
      if (seen.has(e.to) || !D.maps[e.to]) return;
      if (e.cond) { try { if (!e.cond(S, WM.state)) return; } catch (x) { return; } }
      // an exit is usable if any of its tiles is reachable
      let ok = false;
      for (let dx = 0; dx < (e.w || 1); dx++) for (let dy = 0; dy < (e.h || 1); dy++) {
        const ex = e.x + dx, ey = e.y + dy;
        if (reach.has(ex + ',' + ey) || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => reach.has((ex + a) + ',' + (ey + b)))) ok = true;
      }
      if (!ok) return;
      seen.add(e.to); q.push({ map: e.to, t: { x: e.tx, y: e.ty }, prev: n });
    });
  }
  return null;
}
function eventReachable(ev, arrival) {
  const reach = tileReach(ev.map, arrival);
  const w = ev.w || 1, h = ev.h || 1;
  if (ev.trigger === 'auto') return true;
  for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) {
    const x = ev.x + dx, y = ev.y + dy;
    if (ev.trigger === 'touch') { if (reach.has(x + ',' + y)) return true; }
    else if ([[1, 0], [-1, 0], [0, 1], [0, -1], [0, 2], [0, -2], [2, 0], [-2, 0]].some(([a, b]) => reach.has((x + a) + ',' + (y + b)))) return true;
  }
  return false;
}

// ---------- the walk ----------
function storyFlags() { return Object.keys(WM.state.flags).filter((f) => f.indexOf('ev:') !== 0 && WM.state.flags[f]).sort().join('|'); }

async function runEvent(ev) {
  curEvent = ev.map + ':' + ev.id;
  if (VERBOSE) console.log('  run ' + curEvent + ' (ch ' + WM.state.chapter + ')');
  freezeActors();
  const fn = ev.run || (ev.text ? async (s) => { (Array.isArray(ev.text) ? ev.text : [ev.text]).forEach((t) => s.say(ev.char || ev.npc || null, t)); } : null);
  if (!fn) return;
  try { await fn(mkApi({ ev })); } catch (e) { err('script threw: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e)); }
  if (ev.once) S.flag('ev:' + ev.map + ':' + ev.id, true);
}

async function main() {
  S.newGame();
  const st = D.start;
  S.setParty(st.party); WM.state.leader = st.party[0];
  cur = { map: st.map, x: st.x, y: st.y }; WM.state.map = st.map;
  const EXPECT_STARS = { 5: 11, 8: 20, 9: 39, 10: 42, 11: 48, 12: 60, 13: 64, 14: 80, 15: 87, 16: 88, 17: 102, 18: 108 }, checkedTotals = {};
  let lastProgress = '';
  function checkTotals() {
    // running total of Stars at each chapter end must match docs/STORY.md
    for (const n in EXPECT_STARS) {
      if (!checkedTotals[n] && S.has('ch' + n + '_done')) {
        checkedTotals[n] = true;
        const got = D.charOrder.filter((id) => joins[id]).length;
        if (got !== EXPECT_STARS[n]) errors.push('Stars after chapter ' + n + ': ' + got + ', expected ' + EXPECT_STARS[n]);
      }
    }
  }
  global.__checkTotals = checkTotals;
  for (let iter = 0; iter < 5000; iter++) {
    if (S.has('ending_done')) break;
    // 1. auto events on the current map
    const autos = (D.events[cur.map] || []).filter((e) => e.trigger === 'auto' && eventActive(e));
    if (autos.length) { await runEvent(autos[0]); continue; }
    // 2. find a progressing event anywhere reachable
    reachCache = {};
    reachMapsCache = reachableMaps(cur.map, { x: cur.x, y: cur.y });
    const before = storyFlags();
    let progressed = false;
    const candidates = [];
    Object.keys(D.events).forEach((mid) => (D.events[mid] || []).forEach((ev) => {
      if (ev.trigger === 'auto') {
        const saved = [WM.state.map, WM.state.x, WM.state.y]; WM.state.map = mid;   // auto events may test where the player arrives
        const arrs = (reachMapsCache && reachMapsCache.get(mid)) || [];
        let act = false;
        for (const t of arrs) { WM.state.x = t.x; WM.state.y = t.y; if (eventActive(ev)) { act = true; ev._arrival = t; break; } }
        WM.state.map = saved[0]; WM.state.x = saved[1]; WM.state.y = saved[2];
        if (act) candidates.push(ev);
        return;
      }
      if (!eventActive(ev)) return;
      if (!ev.run || ev.resident) return;   // plain text NPCs and castle residents never progress the story
      candidates.push(ev);
    }));
    // nearer maps first
    candidates.sort((a, b) => (a.map === cur.map ? 0 : 1) - (b.map === cur.map ? 0 : 1));
    const maps = reachMapsCache;
    for (const ev of candidates) {
      if (!maps.has(ev.map)) continue;
      const arrival = ev.trigger === 'auto' ? ev._arrival : maps.get(ev.map).find((t) => eventReachable(ev, t));
      if (!arrival) continue;
      const route = { map: ev.map, t: arrival };
      const snapshot = JSON.stringify(WM.state), snapCur = JSON.stringify(cur), snapTemp = JSON.stringify(temp), errCount = errors.length, joinSnap = JSON.stringify(joins);
      const prevMap = cur.map;
      cur = { map: route.map, x: route.t.x, y: route.t.y }; WM.state.map = cur.map; WM.state.x = cur.x; WM.state.y = cur.y; if (prevMap !== cur.map) temp = {};
      await runEvent(ev);
      const after = storyFlags();
      reachCache = {};
      if (after !== before || S.has('ev:' + ev.map + ':' + ev.id) && ev.once) {
        if (after !== before) { progressed = true; lastProgress = curEvent; break; }
      }
      // revert a non-progressing trial (but keep the errors it found)
      WM.state = JSON.parse(snapshot); cur = JSON.parse(snapCur); temp = JSON.parse(snapTemp);
      Object.keys(joins).forEach((k) => delete joins[k]); Object.assign(joins, JSON.parse(joinSnap));
    }
    if (!progressed) break;
    checkTotals();
  }
  checkTotals();
  // ---------- report ----------
  const order = D.charOrder;
  const missing = order.filter((id) => !joins[id]);
  console.log('Chapter reached: ' + WM.state.chapter + ' (' + ((D.chapters[WM.state.chapter] || {}).short || '') + ')');
  console.log('Last progressing event: ' + lastProgress);
  console.log('Current map: ' + cur.map + ' (' + cur.x + ',' + cur.y + ')');
  const fl = Object.keys(WM.state.flags).filter((f) => f.indexOf('ev:') !== 0 && f.indexOf('loc:') !== 0 && WM.state.flags[f]);
  console.log('Latest flags: ' + fl.slice(-6).join(', '));
  console.log('Stars joined: ' + (order.length - missing.length) + ' / 108');
  if (missing.length && process.argv.includes('--missing')) console.log('Not yet joined: ' + missing.join(', '));
  const uniq = Array.from(new Set(errors));
  if (uniq.length) { console.log('\nERRORS (' + uniq.length + '):'); uniq.forEach((e) => console.log('  ' + e)); process.exitCode = 1; }
  else console.log('No script errors.');
}
main();
