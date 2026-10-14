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
// staging problems a player would see: people standing in walls, on top of each other, in another room, or talking
// while nowhere to be seen. Printed as a list to review (some are intended: a voice outside, a letter read aloud).
const scene = [];
function sceneWarn(msg) { scene.push('[' + curEvent + '] ' + msg); }
let pendingWet = [];   // someone placed on water: fine if the scene seats them in a boat (s.boat), else reported
const SCENES = process.argv.includes('--scenes');
const FLOW = process.argv.includes('--flow');   // print the story as played: each scene that moves it on, with its first line
let firstLine = '';
// --hints: when a scene ends and the story goes on somewhere else, does the player get told where?
// --leftover: people a scene leaves standing on the map when it ends (the player can walk up to them)
const LEFT = process.argv.includes('--leftover'); const leftLog = [];
const HINTS = process.argv.includes('--hints'); const flowLog = []; let hinted = false, spoken = '';
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
// interiors hold several rooms walled off by void ('x'): which room a tile is in (-1 outside any, or not an interior)
const roomCache = {};
function roomOf(mid, x, y) {
  const m = D.maps[mid]; if (!m || !m.interior) return -1;
  let R = roomCache[mid];
  if (!R) {
    const r = rowsOf(mid), h = r.length; let w = 0; r.forEach((row) => { w = Math.max(w, row.length); });
    const lab = new Int32Array(w * h).fill(-1); let n = 0;
    for (let y0 = 0; y0 < h; y0++) for (let x0 = 0; x0 < w; x0++) {
      if (lab[y0 * w + x0] >= 0 || (tile(mid, x0, y0) || 'x') === 'x') continue;
      const st = [[x0, y0]]; lab[y0 * w + x0] = n;
      while (st.length) { const [cx, cy] = st.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h || lab[ny * w + nx] >= 0 || (tile(mid, nx, ny) || 'x') === 'x') continue; lab[ny * w + nx] = n; st.push([nx, ny]); } }
      n++;
    }
    R = roomCache[mid] = { lab, w, h };
  }
  return x < 0 || y < 0 || x >= R.w || y >= R.h ? -1 : R.lab[y * R.w + x];
}
// is this character somewhere in the scene the player is looking at?
// a hero who rejoins after a long absence keeps the level they left with: report anyone far behind the party at fights
function lagging() {
  const lv = (WM.state.party || []).map((id) => [id, WM.state.chars[id] ? WM.state.chars[id].lv : 0]);
  const top = Math.max(0, ...lv.map((x) => x[1]));
  lv.forEach(([id, l]) => { if (l && top - l > 6) sceneWarn('"' + id + '" is level ' + l + ' in a party led at level ' + top); });
}
function present(id) {
  if (!id || typeof id !== 'string') return true;
  id = id.split(':')[0];
  if (id === WM.state.leader || WM.state.party.indexOf(id) >= 0) return true;   // the party is with the leader
  const pr = roomOf(cur.map, cur.x, cur.y), here = (a) => pr < 0 || roomOf(cur.map, a.x, a.y) === pr || roomOf(cur.map, a.x, a.y) < 0;
  if (Object.keys(temp).some((k) => (temp[k].who === id || id.indexOf(temp[k].who + '_') === 0) && here(temp[k]))) return true;   // a beast's rider ('oxboy' -> 'oxboy_boy')
  const f = frozen[id]; return !!(f && here(f));
}

// ---------- world simulation ----------
let cur = { map: null, x: 0, y: 0 };
let temp = {};
const lastLine = {};   // who -> they have spoken a line in this scene (what a lingerer says if spoken to)
function flushOff() { Object.keys(temp).forEach((k) => { if (temp[k].pending && (temp[k].leave || WM.state.party.indexOf(temp[k].who) >= 0)) delete temp[k]; }); }          // temp actors on the current map: key -> {x,y}
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
// the drawn faces, plus any extra expression an illustrated portrait sheet provides (assets/manifest.js)
const EXPR = ['normal', 'angry', 'sad', 'smile', 'shock'];
Object.values((WM.ASSETS && WM.ASSETS.portraitSheets) || {}).forEach((sh) => (sh.expressions || []).forEach((e) => { if (EXPR.indexOf(e) < 0) EXPR.push(e); }));
function checkSpeaker(who) {
  if (who == null) return;
  if (typeof who === 'object') { if (!who.name) err('speaker object without name'); return; }
  let id = who, expr = null;
  if (who.indexOf(':') > 0) { id = who.split(':')[0]; expr = who.split(':')[1]; }
  if (!D.chars[id] && !D.npcs[id]) err('unknown speaker "' + who + '"');
  if (expr && EXPR.indexOf(expr) < 0) err('unknown expression "' + expr + '"');
}

// ---------- the dead and the departed may not appear (except as ghosts: flag ghost:<id>) ----------
function gone(id, what) {
  if (!id || typeof id !== 'string' || !WM.state) return;
  id = id.split(':')[0];
  if (WM.state.flags['ghost:' + id] || WM.state.flags['present:' + id]) return;   // a ghost, or a departed hero met where he now lives
  if (WM.state.dead[id] || (id === 'chaogai' && WM.state.flags.chaogai_dead)) err(what + ': ' + id + ' is dead');
  else if (WM.state.flags['away:' + id]) err(what + ': ' + id + ' has left (away:' + id + ')');
}

// ---------- mock API ----------
const realApi = WM.script.makeApi({});
const resolved = Promise.resolve();
function mkApi(ctx) {
  const s = {
    S: S, ctx: ctx,
    get state() { return WM.state; },
    say(who, text) {
      checkSpeaker(who); gone(who, 'say'); if (!text) err('empty say');
      if (who == null && /^\(/.test(text || '')) hinted = true;
      spoken += ' ' + (text || '');
      if (who && typeof who === 'string' && !present(who) && !/^\((outside|off|offstage|from|voice|inside|behind|far|calling|shouting|letter)/i.test(text || '')) sceneWarn('"' + who.split(':')[0] + '" speaks but is not in the scene on ' + cur.map);
      return resolved;
    },
    narrate(text) { if (!text) err('empty narrate'); if (!firstLine) firstLine = text; spoken += ' ' + (text || ''); return resolved; },
    ask(who, text, options) { checkSpeaker(who); return Promise.resolve(0); },
    choose(options) { return Promise.resolve(0); },
    notice() { hinted = true; return resolved; }, wait() { return resolved; }, fadeOut() { return resolved; }, fadeIn() { return resolved; },
    actor(key) { const a = findActor(key); if (!a) err('no actor "' + key + '" on ' + cur.map); return a || {}; },
    move(key, steps) {
      const a = findActor(key); if (!a) { err('move: no actor "' + key + '" on ' + cur.map); return resolved; }
      const parse = Array.isArray(steps) ? steps : steps.trim().split(/\s+/).map((tk) => { const d = tk[0].toUpperCase(), n = parseInt(tk.slice(1) || '1', 10); return d === 'R' ? [n, 0] : d === 'L' ? [-n, 0] : d === 'U' ? [0, -n] : [0, n]; });
      let hit = null;
      parse.forEach((st) => {
        const n = Math.abs(st[0]) + Math.abs(st[1]), sx = Math.sign(st[0]), sy = Math.sign(st[1]);
        for (let i = 0; i < n; i++) { a.x += sx; a.y += sy; if (!hit && !a.boat && !walkable(cur.map, a.x, a.y)) hit = [a.x, a.y]; }
      });
      if (hit && key !== 'player') sceneWarn('"' + (a.who || key) + '" walks through a solid tile "' + tile(cur.map, hit[0], hit[1]) + '" at ' + cur.map + '(' + hit[0] + ',' + hit[1] + ')');
      else if (hit) sceneWarn('the player walks through a solid tile "' + tile(cur.map, hit[0], hit[1]) + '" at ' + cur.map + '(' + hit[0] + ',' + hit[1] + ')');
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
    lie(key, on) { if (!findActor(key)) err('lie: no actor "' + key + '"'); if (temp[key]) temp[key].lying = on !== false; },   // the dead and the fallen say nothing
    boat(key) { const a = findActor(key); if (!a) err('boat: no actor "' + key + '"'); else { a.boat = true; pendingWet = pendingWet.filter((m) => !m.endsWith('|' + key)); } },
    spawn(key, who, tx, ty) {
      gone(who, 'spawn');
      if (typeof who === 'string' && !D.chars[who] && !D.npcs[who]) err('spawn: unknown "' + who + '"');
      if (tile(cur.map, tx, ty) == null) err('spawn "' + key + '" outside map ' + cur.map + ' (' + tx + ',' + ty + ')');
      else {
        const wid = typeof who === 'string' ? who : key;
        const tc = tile(cur.map, tx, ty), wet = WM.tiles.DEF[tc] && WM.tiles.DEF[tc].water;
        if (!walkable(cur.map, tx, ty)) (wet ? pendingWet : scene).push((wet ? '' : '[' + curEvent + '] ') + '"' + wid + '" placed on a solid tile "' + tc + '" at ' + cur.map + '(' + tx + ',' + ty + ')' + (wet ? '|' + key : ''));
        if (cur.x === tx && cur.y === ty) sceneWarn('"' + wid + '" placed on the player\'s tile ' + cur.map + '(' + tx + ',' + ty + ')');
        const on = Object.keys(temp).filter((k) => k !== key && temp[k].x === tx && temp[k].y === ty);
        if (on.length) sceneWarn('"' + wid + '" placed on top of "' + on.join('", "') + '" at ' + cur.map + '(' + tx + ',' + ty + ')');
        const pr = roomOf(cur.map, cur.x, cur.y), ar = roomOf(cur.map, tx, ty);
        if (pr >= 0 && ar >= 0 && pr !== ar) sceneWarn('"' + wid + '" placed in another room from the player (' + cur.map + ' ' + tx + ',' + ty + ' vs player ' + cur.x + ',' + cur.y + ')');
      }
      temp[key] = { x: tx, y: ty, who: typeof who === 'string' ? who : key };
    },
    spawnBeast(key, art, tx, ty) { if (!WM.monsters.ART[art]) err('spawnBeast: unknown art "' + art + '"'); temp[key] = { x: tx, y: ty, who: key }; },
    despawn(key, opt) { if (opt && opt.to && tile(cur.map, opt.to[0], opt.to[1]) == null) err('despawn: ' + key + ' sent to ' + opt.to + ', off the map'); if (!temp[key] && !findActor(key)) err('despawn: no actor "' + key + '"'); if (temp[key]) { temp[key].pending = true; temp[key].leave = !!(opt && (opt.leave || opt.to)); } },   // the story sends them away (opt.leave / opt.to), or they stay
    _end() { Object.keys(temp).forEach((k) => { if (temp[k].pending) { temp[k].pending = false; if (WM.state.party.indexOf(temp[k].who) >= 0) delete temp[k]; else { temp[k].lingering = true; if (lastLine[temp[k].who]) temp[k].idle = true; } } }); },
    mark(spots, until) {
      (spots || []).forEach((sp) => { if (!D.maps[sp.map]) err('mark: unknown map ' + sp.map); else if (tile(sp.map, sp.x, sp.y) == null) err('mark: ' + sp.map + '(' + sp.x + ',' + sp.y + ') is off the map'); });
      if (until && typeof until !== 'string') err('mark: until must be a flag name');
    },
    idle(key, lines) { if (!temp[key]) err('idle: no actor "' + key + '"'); else if (!lines || !lines.length) err('idle: no line for "' + key + '"'); else temp[key].idle = true; },
    leader(id) { if (!D.chars[id]) err('leader: unknown char ' + id); },
    shake() { return resolved; }, flash() { return resolved; },
    sfx() {}, music(id) { if (id && !WM.audio.tracks[id]) err('unknown music "' + id + '"'); }, stopMusic() {},
    tint(t) { WM.state.flags.tintOverride = t; }, night(on) { WM.state.flags.night = on !== false; }, weather(w) { WM.state.flags.weather = w || null; },
    camera() { return resolved; }, cameraReset() {},
    warp(map, tx, ty) {
      if (!D.maps[map]) { err('warp to unknown map ' + map); return resolved; }
      if (!walkable(map, tx, ty)) err('warp lands on solid tile ' + map + '(' + tx + ',' + ty + ') "' + tile(map, tx, ty) + '"');
      cur = { map: map, x: tx, y: ty }; temp = {}; WM.state.map = map; WM.state.x = tx; WM.state.y = ty; freezeActors(); syncField();
      return resolved;
    },
    battle(troop) { lagging(); const t = typeof troop === 'string' ? D.troops[troop] : troop; noteFoes(t); if (!t) err('unknown troop ' + troop); else (Array.isArray(t) ? t : t.enemies).forEach((e) => { if (!D.enemies[e]) err('troop ' + troop + ' has unknown enemy ' + e); }); return Promise.resolve('win'); },
    duel(id, opt) { if (!D.duels[id]) err('unknown duel ' + id); else { const d = D.duels[id]; gone((opt && opt.hero) || d.hero, 'duel ' + id); gone(d.foe, 'duel ' + id); if (!D.chars[d.hero]) err('duel hero unknown ' + d.hero); if (!D.chars[d.foe] && !D.npcs[d.foe]) err('duel foe unknown ' + d.foe); } return Promise.resolve('win'); },
    war(id) { lagging(); if (!D.wars[id]) err('unknown war ' + id); else { D.wars[id].player.forEach((u) => { gone(u.leader, 'war ' + id); (u.support || []).forEach((x) => gone(x, 'war ' + id)); if (!D.chars[u.leader]) err('war ' + id + ' unknown leader ' + u.leader); (u.support || []).forEach((x) => { if (!D.chars[x]) err('war ' + id + ' unknown support ' + x); }); }); } return Promise.resolve('win'); },
    join(id, opt) {
      if (!D.chars[id]) { err('join unknown ' + id); return resolved; }
      if (joins[id]) err('duplicate join of ' + id + ' (first in ' + joins[id] + ')');
      joins[id] = curEvent;
      S.recruit(id, opt && opt.lv); if (opt && opt.party) S.addToParty(id);
      return resolved;
    },
    joinMany(ids, opt) { ids.forEach((id) => s.join(id, opt)); return resolved; },
    party(ids) { ids.forEach((id) => { gone(id, 'party'); if (!D.chars[id]) err('party unknown ' + id); }); S.setParty(ids); },
    addParty(id) { gone(id, 'addParty'); if (!D.chars[id]) { err('addParty unknown ' + id); return; } if (!WM.state.chars[id]) S.initChar(id); S.addToParty(id); },
    removeParty(id) { S.removeFromParty(id); if (WM.state.leader === id && WM.state.party.length) WM.state.leader = WM.state.party[0]; },
    setLeader(id) { gone(id, 'setLeader'); if (!D.chars[id]) err('setLeader unknown ' + id); WM.state.leader = id; },
    inParty(id) { return WM.state.party.indexOf(id) >= 0; },
    level(id, lv) { if (!D.chars[id]) { err('level unknown ' + id); return; } const c = WM.state.chars[id] || S.initChar(id, lv); if (c.lv < lv) { c.lv = lv; S.catchUp(id); S.restore(id); } },
    heal() { S.restoreParty(); },
    kill(id) { if (!D.chars[id]) err('kill unknown ' + id); WM.state.dead[id] = true; S.removeFromParty(id); return resolved; },
    flag(k, v) { return S.flag(k, v === undefined ? true : v); },
    unflag(k) { delete WM.state.flags[k]; },
    has(k) { return S.has(k); },
    give(item, n) { if (!D.items[item]) { err('give unknown item ' + item); return resolved; } S.give(item, n || 1); return resolved; },
    take(item, n) { if (!D.items[item]) err('take unknown item ' + item); else S.take(item, n || 1); },
    count(item) { return S.count(item); },
    gold(n) { WM.state.gold = Math.max(0, WM.state.gold + n); return resolved; },
    chapter(n) {
      // dump the party's real state (what the story alone leaves you: no grinding, no smith) for balance testing
      if (process.argv.includes('--dump')) {
        const fs = require('fs'), path = require('path'), dir = path.join(__dirname, 'out');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        const snap = {}; Object.keys(WM.state.chars).forEach((id) => { const c = WM.state.chars[id]; snap[id] = { lv: c.lv, wlv: c.wlv, equip: c.equip }; });
        fs.writeFileSync(path.join(dir, 'chars_ch' + n + '.json'), JSON.stringify({ chars: snap, smithMax: WM.castle && WM.castle.smithMax ? WM.castle.smithMax() : null }));
      }
      const was = WM.state.chapter; WM.state.chapter = n;
      if (process.argv.includes('--stale')) Object.keys(D.events).forEach((mid) => (D.events[mid] || []).forEach((ev) => {
        if (!ev.once || !ev.run || ev.resident || S.has('ev:' + mid + ':' + ev.id) || mid + ':' + ev.id === curEvent) return;
        const m = /^ch(\d+)_/.exec(ev.id), from = m ? +m[1] : (/^ls_|^res_/.test(ev.id) ? 99 : 0);
        if (from >= n) return;
        let on = true; try { on = !ev.cond || ev.cond(S, WM.state); } catch (e) { on = false; }
        if (on) console.log('  armed at chapter ' + n + ': ' + mid + ':' + ev.id + ' (' + (ev.trigger || 'talk') + ')');
      }));
      if (FLOW) console.log('== Chapter ' + n + ' ' + (D.chapters[n] || {}).short);
      if (!D.chapters[n]) err('unknown chapter ' + n); WM.state.chapter = n; if (VERBOSE) console.log('== Chapter ' + n + ' ' + (D.chapters[n] || {}).short); return resolved; },
    card() { return resolved; }, credits() { return resolved; }, endChapter() { if (global.__checkTotals) global.__checkTotals(); return resolved; },
    shop(id) { if (!D.shops[id]) err('unknown shop ' + id); else D.shops[id].items.forEach((i) => { if (!D.items[i]) err('shop ' + id + ' unknown item ' + i); }); return resolved; },
    inn() { S.restoreAll(); return Promise.resolve(true); }, smith() { return resolved; },
    talismanShop(id) { if (!D.shops[id]) err('unknown talisman shop ' + id); else D.shops[id].items.forEach((i) => { if (!D.talismans[i]) err('talisman shop ' + id + ' unknown talisman ' + i); }); return resolved; },
    saveMenu() { return resolved; }, roster() { return resolved; }, tablet() { return resolved; }
  };
  // as in the game: whoever was sent off leaves once the scene goes on, and each speaker's last line is remembered
  ['say', 'narrate', 'ask', 'choose', 'notice', 'wait', 'fadeOut', 'move', 'moveTo', 'emote', 'jump', 'shake', 'flash', 'battle', 'duel', 'war', 'camera'].forEach((k) => {
    const f0 = s[k]; if (typeof f0 !== 'function') return;
    s[k] = function () { flushOff(); if (k === 'say' && typeof arguments[0] === 'string' && arguments[1] && !/^\(/.test(String(arguments[1]))) lastLine[arguments[0].split(':')[0]] = true; return f0.apply(this, arguments); };
  });
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

// ---------- checkpoints (--checkpoints): the state just before every scene that moves the story on ----------
// written to js/data/checkpoints.js for the debug picker, which can then start any scene of any chapter
const CPS = process.argv.includes('--checkpoints'); const cps = []; const foeLv = {};
function noteFoes(t) {
  if (!t) return;
  const lv = Math.max(0, ...(Array.isArray(t) ? t : t.enemies || []).map((e) => (D.enemies[e] && D.enemies[e].lv) || 0));
  foeLv[cps.length] = Math.max(foeLv[cps.length] || 0, lv);
}
function cpSnap(ev, arrival) {
  const st = WM.state, chars = {};
  Object.keys(st.chars).forEach((id) => { const c = st.chars[id]; chars[id] = JSON.stringify({ lv: c.lv, wlv: c.wlv, equip: c.equip, tal: c.tal }); });
  let x = cur.x, y = cur.y, dir = 'up';
  if (ev.trigger !== 'auto' && ev.trigger !== 'touch') { const dx = ev.x - x, dy = ev.y - y; dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
  if (ev.trigger === 'auto') { x = arrival.x; y = arrival.y; }
  return { ch: st.chapter, flags: JSON.parse(JSON.stringify(st.flags)), party: st.party.slice(), leader: st.leader, recruited: st.recruited.slice(), chars, inv: Object.assign({}, st.inv), gold: st.gold, map: cur.map, x, y, dir };
}
function writeCheckpoints() {
  const out = []; let prev = { flags: {}, chars: {}, inv: {}, recruited: [] };
  cps.forEach((cp, i) => {
    const sn = cp.snap, o = { ch: sn.ch, ev: cp.ev, t: cp.trig, l: cp.label, m: sn.map, x: sn.x, y: sn.y, d: sn.dir, p: sn.party, ld: sn.leader, g: sn.gold };
    const set = {}, del = [];
    Object.keys(sn.flags).forEach((k) => { if (k === 'noEncounters') return; if (JSON.stringify(sn.flags[k]) !== JSON.stringify(prev.flags[k])) set[k] = sn.flags[k]; });
    Object.keys(prev.flags).forEach((k) => { if (!(k in sn.flags)) del.push(k); });
    if (Object.keys(set).length) o.fs = set; if (del.length) o.fd = del;
    const ch = {}; Object.keys(sn.chars).forEach((id) => { if (sn.chars[id] !== prev.chars[id]) ch[id] = JSON.parse(sn.chars[id]); });
    if (Object.keys(ch).length) o.c = ch;
    const r = sn.recruited.filter((id) => prev.recruited.indexOf(id) < 0); if (r.length) o.r = r;
    const inv = {}; Object.keys(Object.assign({}, sn.inv, prev.inv)).forEach((k) => { if ((sn.inv[k] || 0) !== (prev.inv[k] || 0)) inv[k] = sn.inv[k] || 0; });
    if (Object.keys(inv).length) o.iv = inv;
    // the party should be able to win the next fight of the chapter: the level of its strongest foe
    for (let j = i; j < cps.length && cps[j].snap.ch === sn.ch; j++) if (foeLv[j]) { o.fl = foeLv[j]; break; }
    out.push(o); prev = sn;
  });
  const file = require('path').join(__dirname, '..', 'js', 'data', 'checkpoints.js');
  require('fs').writeFileSync(file, '// Generated by `node tools/walk.js --checkpoints`: the game state just before each scene that moves the story on.\n' +
    '// The debug chapter picker (?debug) lists them under each chapter and can start any of them. Do not edit by hand.\n' +
    'WM.data.checkpoints = [\n' + out.map((o) => JSON.stringify(o)).join(',\n') + '\n];\n');
  console.log('Wrote ' + out.length + ' checkpoints to js/data/checkpoints.js');
}

// ---------- people with nothing to say ----------
// Characters a scene places before its first line stand on the map from the moment it could fire (Field.stage).
// If the player can walk up to one without setting the scene off, they need a line of their own: ev.idle[key].
const LEAD_RE = /s\.spawn\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*'(\w+)')?\s*\)/g;
function leadSpawns(ev) {
  const src = ev.run.toString(), body = src.slice(src.indexOf('{') + 1), cut = body.search(/\bawait\b|s\.warp\(|s\.night\(|s\.tint\(/);
  const lead = cut >= 0 ? body.slice(0, cut) : body, out = []; let m;
  LEAD_RE.lastIndex = 0;
  while ((m = LEAD_RE.exec(lead))) { if (lead.indexOf("'ghost:" + m[2] + "'") >= 0 || (!D.chars[m[2]] && !D.npcs[m[2]])) continue; out.push({ key: m[1], who: m[2], x: +m[3], y: +m[4] }); }
  return out;
}
function silentStaged(ev, arrival) {
  if (!ev.run || ev.resident || !/^(auto|touch|check)$/.test(ev.trigger || '')) return [];
  const missing = leadSpawns(ev).filter((sp) => !(ev.idle && ev.idle[sp.key]));
  if (!missing.length) return [];
  const byPlace = ev.trigger === 'auto' && ev.cond && /\.x\b|\.y\b/.test(ev.cond.toString());
  if (ev.trigger === 'auto' && !byPlace) return [];   // it fires the moment the player arrives
  const st = WM.state, sx = st.x, sy = st.y, sm = st.map;
  const fires = (x, y) => {
    if (ev.trigger === 'touch') return x >= ev.x && x < ev.x + (ev.w || 1) && y >= ev.y && y < ev.y + (ev.h || 1);
    if (!byPlace) return false;
    st.map = ev.map; st.x = x; st.y = y; let on = false; try { on = !!ev.cond(S, st); } catch (e) {} st.map = sm; st.x = sx; st.y = sy; return on;
  };
  const acts = actorsOnMap(ev.map), block = new Set(Object.keys(acts).map((k) => acts[k].x + ',' + acts[k].y));
  const ok = (x, y) => walkable(ev.map, x, y) && !block.has(x + ',' + y) && !fires(x, y);
  if (!ok(arrival.x, arrival.y)) return [];
  const seen = new Set([arrival.x + ',' + arrival.y]), q = [[arrival.x, arrival.y]];
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + dx) + ',' + (y + dy); if (!seen.has(k) && ok(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
  }
  const over = (x, y) => ['c', 't'].indexOf(tile(ev.map, x, y)) >= 0;
  return missing.filter((sp) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) =>
    seen.has((sp.x + dx) + ',' + (sp.y + dy)) || (over(sp.x + dx, sp.y + dy) && seen.has((sp.x + 2 * dx) + ',' + (sp.y + 2 * dy)))));
}

// ---------- the walk ----------
function storyFlags() { return Object.keys(WM.state.flags).filter((f) => f.indexOf('ev:') !== 0 && WM.state.flags[f]).sort().join('|'); }

// what a player would call a map: its name, the world location it belongs to, and that location's short name
function placeNames(mid) {
  const out = [], m = D.maps[mid]; if (m && m.name) out.push(m.name);
  const outer = Object.keys(D.maps).filter((k) => exitsOf(k).some((e) => e.to === mid)).concat([mid]);
  Object.keys(D.locations || {}).forEach((id) => { const L = D.locations[id]; if (outer.indexOf(L.map) >= 0) { out.push(L.name); out.push(L.name.split(/[ ,(]/)[0]); } });
  return Array.from(new Set(out.filter((n) => n && n.length > 3 && !/^(The|Mount|Inn)$/.test(n))));
}
// scenes may ask which map is loaded (WM.field.map.id): answer as the real field would
function syncField() { WM.field.map = cur.map ? { id: cur.map } : null; }
async function runEvent(ev) {
  curEvent = ev.map + ':' + ev.id; syncField();
  if (VERBOSE) console.log('  run ' + curEvent + ' (ch ' + WM.state.chapter + ')');
  freezeActors();
  const fn = ev.run || (ev.text ? async (s) => { (Array.isArray(ev.text) ? ev.text : [ev.text]).forEach((t) => s.say(ev.char || ev.npc || null, t)); } : null);
  if (!fn) return;
  pendingWet = []; firstLine = ''; hinted = false; spoken = '';
  Object.keys(lastLine).forEach((k) => delete lastLine[k]);
  const api = mkApi({ ev });
  try { await fn(api); api._end(); } catch (e) { err('script threw: ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e)); }
  pendingWet.forEach((m) => sceneWarn(m.split('|')[0] + ' (on water, not in a boat)'));
  if (ev.once) S.flag('ev:' + ev.map + ':' + ev.id, true);
}

async function main() {
  S.newGame();
  const st = D.start;
  S.setParty(st.party); WM.state.leader = st.party[0];
  cur = { map: st.map, x: st.x, y: st.y }; WM.state.map = st.map;
  // Stars dead, and Stars departed (away:), at each chapter end (docs/STORY.md)
  const EXPECT_DEAD = { 19: 0, 22: 0, 23: 70, 24: 75 }, EXPECT_AWAY = { 19: 0, 22: 5, 23: 11 };
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
  function checkGone() {
    for (const n in EXPECT_DEAD) if (!checkedTotals['d' + n] && S.has('ch' + n + '_done')) {
      checkedTotals['d' + n] = true;
      const dead = D.charOrder.filter((id) => WM.state.dead[id]).length, away = D.charOrder.filter((id) => !WM.state.dead[id] && WM.state.flags['away:' + id]).length;
      if (dead !== EXPECT_DEAD[n]) errors.push('Dead Stars after chapter ' + n + ': ' + dead + ', expected ' + EXPECT_DEAD[n]);
      if (EXPECT_AWAY[n] != null && away !== EXPECT_AWAY[n]) errors.push('Departed Stars after chapter ' + n + ': ' + away + ', expected ' + EXPECT_AWAY[n]);
    }
  }
  global.__checkTotals = function () { checkTotals(); checkGone(); };
  for (let iter = 0; iter < 5000; iter++) {
    if (S.has('ending_done')) break;
    // 1. auto events on the current map
    const autos = (D.events[cur.map] || []).filter((e) => e.trigger === 'auto' && eventActive(e));
    if (autos.length) {
      await runEvent(autos[0]);
      if (HINTS) flowLog.push({ ev: curEvent, endMap: cur.map, hinted: hinted, ch: WM.state.chapter, text: spoken });
      continue;
    }
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
      // where the player actually stands when it fires: inside a touch area, or beside the one they talk to
      if (ev.trigger !== 'auto') {
        const rch = tileReach(ev.map, arrival), spots = [];
        for (let dx = 0; dx < (ev.w || 1); dx++) for (let dy = 0; dy < (ev.h || 1); dy++) {
          const x = ev.x + dx, y = ev.y + dy;
          if (ev.trigger === 'touch') spots.push([x, y]); else [[0, 1], [-1, 0], [1, 0], [0, -1], [0, 2], [-2, 0], [2, 0], [0, -2]].forEach(([a, b]) => spots.push([x + a, y + b]));   // across a counter, too
        }
        const st = spots.find(([x, y]) => rch.has(x + ',' + y));
        if (st) { cur.x = st[0]; cur.y = st[1]; WM.state.x = cur.x; WM.state.y = cur.y; }
      }
      const silent = silentStaged(ev, arrival);
      const snap = CPS ? cpSnap(ev, cur.map === ev.map && ev.trigger !== 'auto' ? cur : arrival) : null;
      await runEvent(ev);
      const after = storyFlags();
      reachCache = {};
      if (after !== before || S.has('ev:' + ev.map + ':' + ev.id) && ev.once) {
        if (after !== before) {
          progressed = true; lastProgress = curEvent;
          if (FLOW) console.log('  ' + curEvent + '  — ' + (firstLine || '').slice(0, 110));
          if (HINTS) flowLog.push({ ev: curEvent, endMap: cur.map, hinted: hinted, ch: WM.state.chapter, text: spoken });
          if (CPS) cps.push({ ev: ev.map + ':' + ev.id, trig: ev.trigger || 'talk', label: spoken.trim().replace(/\s+/g, ' ').slice(0, 80), snap: snap });
          if (LEFT) Object.keys(temp).forEach((k) => { if (D.chars[temp[k].who] || D.npcs[temp[k].who]) leftLog.push('ch' + WM.state.chapter + ' ' + curEvent + ' leaves ' + k + (k === temp[k].who ? '' : '=' + temp[k].who) + ' on ' + cur.map); });
          // the player can talk to anyone left standing, and to anyone waiting for this scene
          Object.keys(temp).forEach((k) => { if ((D.chars[temp[k].who] || D.npcs[temp[k].who]) && !temp[k].idle && !temp[k].lying) err('"' + k + '" is left standing after the scene with nothing to say (s.idle)'); });
          silent.forEach((sp) => errors.push('[' + ev.map + ':' + ev.id + '] "' + sp.key + '" (' + sp.who + ') waits at ' + sp.x + ',' + sp.y + ' where the player can talk to them first, with nothing to say (idle.' + sp.key + ')'));
          break;
        }
      }
      // revert a non-progressing trial (but keep the errors it found)
      WM.state = JSON.parse(snapshot); cur = JSON.parse(snapCur); temp = JSON.parse(snapTemp);
      Object.keys(joins).forEach((k) => delete joins[k]); Object.assign(joins, JSON.parse(joinSnap));
    }
    if (!progressed) break;
    checkTotals();
  }
  global.__checkTotals();
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
  // optional one-time scenes the story never needed, which could still fire now, long after their chapter
  if (process.argv.includes('--stale')) {
    Object.keys(D.events).forEach((mid) => (D.events[mid] || []).forEach((ev) => {
      if (!ev.once || !ev.run || ev.resident || S.has('ev:' + mid + ':' + ev.id)) return;
      let on = true; try { on = !ev.cond || ev.cond(S, WM.state); } catch (e) { on = false; }
      if (on) console.log('  still armed: ' + mid + ':' + ev.id + ' (' + (ev.trigger || 'talk') + ')');
    }));
  }
  if (CPS) writeCheckpoints();
  if (LEFT) { console.log('\nPeople left standing after a scene:'); leftLog.forEach((l) => console.log('  ' + l)); }
  if (HINTS) {
    console.log('\nScenes after which the story moves to another map without a hint:');
    for (let i = 0; i < flowLog.length - 1; i++) {
      const a = flowLog[i], b = flowLog[i + 1], next = b.ev.split(':')[0];
      if (a.hinted || next === a.endMap || b.ch !== a.ch) continue;
      // one doorway away (a house in the same town, the yard outside): the player can see where to go
      const nearby = exitsOf(a.endMap).some((e) => e.to === next) || exitsOf(next).some((e) => e.to === a.endMap);
      // or the scene named the place it sends you to
      const names = placeNames(next);
      const named = names.some((n) => n && a.text.toLowerCase().indexOf(n.toLowerCase()) >= 0);
      if (!nearby && !named) console.log('  ch' + a.ch + ' ' + a.ev + ' (ends on ' + a.endMap + ') -> next: ' + b.ev + '   [' + names.join(' / ') + ']');
    }
  }
  const sc = Array.from(new Set(scene));
  if (sc.length) console.log('\nScene staging to review: ' + sc.length + (SCENES ? '' : ' (list them with --scenes)'));
  if (SCENES) sc.forEach((e) => console.log('  ' + e));
  const uniq = Array.from(new Set(errors));
  if (uniq.length) { console.log('\nERRORS (' + uniq.length + '):'); uniq.forEach((e) => console.log('  ' + e)); process.exitCode = 1; }
  else console.log('No script errors.');
}
main();
