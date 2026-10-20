// Event script runtime. Story events are async functions that receive `s`, a small cutscene API.
'use strict';
(function () {
  var UI = WM.ui, S = WM.S, G = WM.gfx, U = WM.util;
  var TS = 16;
  var SC = WM.script = { running: 0 };

  SC.run = function (fn, ctx) {
    SC.running++;
    var s = makeApi(ctx || {});
    var p;
    try { p = Promise.resolve(fn(s)); } catch (e) { p = Promise.reject(e); }
    return p.catch(function (e) { console.error('Script error', e); WM.lastError = e; })
      .then(function () {
        try { s._end(); } catch (e) { console.error(e); }
        SC.running = Math.max(0, SC.running - 1); WM.input.clear();
        var F = WM.field;
        if (WM.scene === F && F.map && !SC.running) { F.refreshActors(); F.pendingAuto = true; }
      });
  };

  function F() { return WM.field; }
  function actor(key) {
    var a = F().findActor(key);
    if (!a) throw new Error('No actor ' + key + ' on map ' + (F().map && F().map.id));
    return a;
  }

  function parseSteps(steps) {
    // "R3 D2 L1" -> [[3,0],[0,2],[-1,0]]
    if (Array.isArray(steps)) return steps;
    return steps.trim().split(/\s+/).map(function (tk) {
      var d = tk[0].toUpperCase(), n = parseInt(tk.slice(1) || '1', 10);
      return d === 'R' ? [n, 0] : d === 'L' ? [-n, 0] : d === 'U' ? [0, -n] : [0, n];
    });
  }

  // ---------- stage entrances and exits ----------
  // A character spawned into a cutscene walks in from the nearest door or exit (or from just off-screen) instead of
  // appearing; one who is despawned walks out the same way while the scene goes on. The next line of dialogue (or
  // battle, warp, move...) waits until everyone who is entering has arrived. Characters appear instantly when the
  // screen is faded out, when they are ghosts or dreams, when they lie down, or when there is no way in.
  var arrivals = [];
  function cam() { var f = F(); return f.cam || { x: 0, y: 0 }; }
  function onScreen(tx, ty) { var c = cam(); return Math.abs(tx * TS + 8 - c.x) < WM.LOW_W / 2 + 10 && Math.abs(ty * TS + 8 - c.y) < WM.LOW_H / 2 + 24; }
  function isWay(tx, ty) {
    var f = F(), m = f.map; if (m.get(tx, ty) === 'D' || m.get(tx, ty) === 'G') return true;
    var ex = m.def.exits || [];
    for (var i = 0; i < ex.length; i++) { var e = ex[i]; if (tx >= e.x && tx < e.x + (e.w || 1) && ty >= e.y && ty < e.y + (e.h || 1)) return true; }
    return false;
  }
  // a path of tile centres from a way in (door, exit, or off-screen) to (tx, ty); null if there is none worth walking
  function wayIn(tx, ty) {
    var f = F(); if (!f.map || f.tileSolid(tx, ty)) return null;
    var key = function (x, y) { return x + ',' + y; };
    var prev = {}, depth = {}, q = [[tx, ty]], door = null, off = null, far = null;
    prev[key(tx, ty)] = null; depth[key(tx, ty)] = 0;
    while (q.length) {
      var c = q.shift(), d = depth[key(c[0], c[1])];
      if (d >= 1 && !door && isWay(c[0], c[1])) door = c;   // (a door right in front of them is still the way out)
      if (d >= 2) {
        if (!off && !onScreen(c[0], c[1])) off = c;
        if (d <= 6 && (!far || d > depth[key(far[0], far[1])])) far = c;
      }
      if (door || d >= 16) break;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) {
        var nx = c[0] + o[0], ny = c[1] + o[1], k = key(nx, ny);
        if (k in prev || f.tileSolid(nx, ny)) return;
        prev[k] = c; depth[k] = d + 1; q.push([nx, ny]);
      });
    }
    var start = door || off || far; if (!start) return null;
    var path = [], cur = start;
    while (cur) { path.push(cur); cur = prev[key(cur[0], cur[1])]; }
    return path;   // from the way in to the target
  }
  function instant(who) {
    var f = F();
    if (typeof who === 'string' && WM.state.party.indexOf(who) >= 0) return true;   // a party member is already at the leader's side
    return !f || !f.map || f.map.def.world || G.fade > 0.4 || f.transitioning || (typeof who === 'string' && WM.state.flags['ghost:' + who]) || !WM.field.player;
  }
  function walk(a, path, onDone) {
    a.x = path[0][0] * TS + 8; a.y = path[0][1] * TS + 15;
    a.path = path.slice(1).map(function (p) { return { x: p[0] * TS + 8, y: p[1] * TS + 15 }; });
    a.speed = U.clamp((path.length - 1) * TS / 1.6, 56, 140); a.animSpeed = a.speed > 90 ? 1.4 : 1;
    a.onArrive = onDone;
    if (!a.path.length) { a.onArrive = null; onDone(); }
  }
  var batch = {};   // ways in already used by people entering together: the next one through waits his turn
  function enter(a, who, tx, ty, dir) {
    if (instant(who)) return;
    var path = wayIn(tx, ty); if (!path || path.length < 3) return;
    if (!arrivals.length) batch = {};
    var k = path[0][0] + ',' + path[0][1]; batch[k] = (batch[k] || 0) + 1;
    a.hold = (batch[k] - 1) * 0.35;   // single file, not all at once on top of each other
    a.finalDir = dir || 'down';
    a.entering = new Promise(function (res) {
      a.finishEntrance = function () { a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; a.onArrive = null; a.dir = a.finalDir; a.entering = null; a.finishEntrance = null; a.hold = 0; res(); };
      walk(a, path, function () { if (a.finishEntrance) a.finishEntrance(); });
    });
    arrivals.push(a.entering);
  }
  function settle() { var p = arrivals.slice(); arrivals = []; return p.length ? Promise.all(p) : Promise.resolve(); }
  function snapAll() { (F().actors || []).forEach(function (a) { if (a.finishEntrance) a.finishEntrance(); }); arrivals = []; }
  function snap(key) { var a = F().findActor(key); if (a && a.finishEntrance) a.finishEntrance(); return a; }
  // run fn once everyone entering has arrived
  function after(fn) { return function () { var args = arguments, self = this; return settle().then(function () { return fn.apply(self, args); }); }; }
  var leaving = 0;
  // s.despawn: someone is sent off. They only go once the scene carries on (the next line, move or fade): then the
  // story has them leave, and they walk out (or, if they have just joined the party, fall in with the leader). If the
  // scene simply ends instead, it was tidying up, and they stay where they are (see settle), as people do.
  // the shortest walk from one tile to another, around anything solid (null if there is none)
  function pathTo(fx, fy, tx, ty) {
    var f = F(), k = function (x, y) { return x + ',' + y; }, prev = {}, q = [[fx, fy]];
    prev[k(fx, fy)] = null;
    while (q.length) {
      var c = q.shift();
      if (c[0] === tx && c[1] === ty) { var out = []; for (var n = c; n; n = prev[k(n[0], n[1])]) out.unshift(n); return out; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = c[0] + d[0], ny = c[1] + d[1];
        if (k(nx, ny) in prev || nx < 0 || ny < 0 || nx >= f.map.w || ny >= f.map.h) return;
        if (f.tileSolid(nx, ny) && !(nx === tx && ny === ty)) return;
        prev[k(nx, ny)] = c; q.push([nx, ny]);
      });
      if (q.length > 4000) break;
    }
    return null;
  }
  function sendOff(key, pending, opt) {
    var f = F(), a = f.findActor(key);
    if (!a || !a.ev || !a.ev.temp) { f.removeActor(key); return; }
    if (a.finishEntrance) a.finishEntrance();
    // a party member is already at the leader's side: they go quietly, but not before the scene moves on (so they
    // are still there while a fade to black darkens over them)
    // so are the fallen, carried off: they lie there until the scene moves on (or the screen is dark)
    var quiet = a.visible && !(opt && opt.to) && (a.static || typeof a.sheetWho === 'string' && WM.state.party.indexOf(a.sheetWho) >= 0);   // (sent somewhere in particular, they walk there)
    if (!quiet && (instant(a.sheetWho) || !a.visible || a.static)) { f.actors = f.actors.filter(function (o) { return o !== a; }); return; }
    if (quiet) { a.ev.id = '__leaving' + (++leaving); a.leavingKey = key; a.solid = false; a.lingering = false; a.quiet = true; pending.push(a); return; }
    a.ev.id = '__leaving' + (++leaving); a.leavingKey = key; a.solid = false; a.lingering = false;
    a.leaveTo = opt && opt.to;   // somewhere of their own to go (their house, their post), not just the nearest way out
    a.leaveOpt = !!(opt && (opt.leave || opt.to));   // the story has them leave; otherwise they stay where they are
    pending.push(a);
  }
  function go(a) {
    var f = F();
    if (f.actors.indexOf(a) < 0 || a.path.length || !a.leavingKey) return;   // called back on stage meanwhile (spawn)
    var t = { x: Math.floor(a.x / TS), y: Math.floor((a.y - 1) / TS) };
    var gone = function () { f.actors = f.actors.filter(function (o) { return o !== a; }); };
    // someone who has just joined the party does not walk away: they fall in with the leader and are gone into the party
    if (a.sheetWho && WM.state.party.indexOf(a.sheetWho) >= 0 && f.player && !a.leaveTo) {
      var p = f.player.tile(), steps = [[t.x, t.y]], cx = t.x, cy = t.y;
      while (cx !== p.x) { cx += cx < p.x ? 1 : -1; steps.push([cx, cy]); }
      while (cy !== p.y) { cy += cy < p.y ? 1 : -1; steps.push([cx, cy]); }
      walk(a, steps, gone);
      return;
    }
    var path = a.leaveTo ? pathTo(t.x, t.y, a.leaveTo[0], a.leaveTo[1]) : null;
    if (!path) { path = wayIn(t.x, t.y); if (path) path.reverse(); }   // from where they stand to the way out
    if (!path || path.length < (door1(path) ? 2 : 3)) { gone(); return; }
    walk(a, path, gone);
  }
  function door1(path) { return path.length === 2 && isWay(path[1][0], path[1][1]); }   // one step, out through a door
  function stay(a, lines) {
    var f = F();
    if (f.actors.indexOf(a) < 0 || !a.leavingKey) return;
    // the place has its own standing version of this person (a resident or shopkeeper): no double
    var twin = f.actors.some(function (o) { return o !== a && o.visible && o.ev && !o.ev.temp && (o.ev.npc === a.sheetWho || o.ev.char === a.sheetWho); });
    if (twin) { f.actors = f.actors.filter(function (o) { return o !== a; }); return; }
    a.ev.id = a.leavingKey; a.leavingKey = null; a.lingering = true;
    a.solid = false;   // someone left standing about can never trap the player in a lane or a doorway: they can be walked past
    if (!a.ev.idle && lines[a.sheetWho]) a.ev.idle = lines[a.sheetWho];   // what they last said in the scene
  }

  function makeApi(ctx) {
    var pending = [], lines = {};
    // the scene goes on: those the story sends away go now (and new party members fall in); the rest stay put
    var joined = function (a) { return a.sheetWho && WM.state.party.indexOf(a.sheetWho) >= 0; };
    // beasts (the tiger, the serpent, the herd-boy's ox) never stand about: sent off, they go
    var drop = function (a) { F().actors = F().actors.filter(function (o) { return o !== a; }); };
    var flush = function () { var keep = []; pending.forEach(function (a) { if (a.quiet) drop(a); else if (a.leaveOpt || joined(a) || a.img) go(a); else keep.push(a); }); pending = keep; };
    var s = {
      S: S, ctx: ctx,
      get state() { return WM.state; },
      say: after(function (who, text, opt) {
        if (Array.isArray(text)) { var chain = Promise.resolve(); text.forEach(function (t) { chain = chain.then(function () { return UI.message(who, t, opt); }); }); return chain; }
        return UI.message(who, text, opt);
      }),
      narrate: after(function (text, opt) { return UI.narrate(text, opt); }),
      ask: after(function (who, text, options, opt) { return UI.ask(who, text, options, opt); }),
      choose: after(function (options, opt) { return UI.choose(options, opt); }),
      notice: after(function (text, opt) { return UI.notice(text, opt); }),
      wait: function (sec) { return WM.wait(sec); },
      fadeOut: function (d, col) { snapAll(); return WM.fadeOut(d == null ? 0.5 : d, col); },
      fadeIn: function (d) { return WM.fadeIn(d == null ? 0.5 : d); },
      // --- actors ---
      actor: actor,
      move: function (key, steps, opt) {
        opt = opt || {};
        snap(key);
        var a = actor(key);
        var path = parseSteps(steps);
        var x = a.path.length ? a.path[a.path.length - 1].x : a.x, y = a.path.length ? a.path[a.path.length - 1].y : a.y;
        path.forEach(function (st) { x += st[0] * TS; y += st[1] * TS; a.path.push({ x: x, y: y }); });
        a.speed = opt.speed || (opt.run ? 110 : 60);
        a.animSpeed = opt.run ? 1.6 : 1;
        if (opt.wait === false) return Promise.resolve();
        return new Promise(function (res) { a.onArrive = res; if (!a.path.length) res(); });
      },
      moveTo: function (key, tx, ty, opt) {
        snap(key);
        var a = actor(key);
        var cx = Math.floor(a.x / TS), cy = Math.floor((a.y - 1) / TS);
        var steps = [];
        if (opt && opt.yFirst) { if (ty !== cy) steps.push([0, ty - cy]); if (tx !== cx) steps.push([tx - cx, 0]); }
        else { if (tx !== cx) steps.push([tx - cx, 0]); if (ty !== cy) steps.push([0, ty - cy]); }
        if (!steps.length) return Promise.resolve();
        // snap to tile centre first
        a.x = cx * TS + 8; a.y = cy * TS + 15;
        return s.move(key, steps, opt);
      },
      // walk to a tile by the shortest clear way (around stacks, houses and fences), not in straight lines
      walkTo: function (key, tx, ty, opt) {
        snap(key);
        var a = actor(key), t = a.tile(), path = pathTo(t.x, t.y, tx, ty);
        if (!path) return s.moveTo(key, tx, ty, opt);
        var steps = []; for (var i = 1; i < path.length; i++) steps.push([path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]]);
        a.x = t.x * TS + 8; a.y = t.y * TS + 15;
        return s.move(key, steps, opt);
      },
      place: function (key, tx, ty, dir) { snap(key); var a = actor(key); a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; if (dir) a.dir = dir; if (a.isPlayer) { F().lastTile = a.tile(); if (!F().camTarget) F().updateCamera(true); } },   // the view goes with the player
      face: function (key, dir) { var a = actor(key); if (a.entering) a.finalDir = dir; else a.dir = dir; },
      faceEach: function (k1, k2) {
        var a = actor(k1), b = actor(k2);
        var dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) > Math.abs(dy)) { a.dir = dx > 0 ? 'right' : 'left'; b.dir = dx > 0 ? 'left' : 'right'; }
        else { a.dir = dy > 0 ? 'down' : 'up'; b.dir = dy > 0 ? 'up' : 'down'; }
      },
      emote: function (key, type, dur) { snap(key); var a = actor(key); a.emote = type; a.emoteT = dur || 1.2; WM.audio.sfx(type === '!' ? 'cursor' : 'blip'); return WM.wait(Math.min(0.6, dur || 0.6)); },
      jump: function (key, h) { snap(key); var a = actor(key); a.jumpDur = a.jumpT = 0.35; a.jumpH = h || 6; return WM.wait(0.36); },
      show: function (key) { actor(key).visible = true; },
      hide: function (key) { actor(key).visible = false; },
      lie: function (key, on) { snap(key); actor(key).static = on === false ? null : 'down'; },
      splash: function (key) { var a = actor(key); F().splash(a.x, a.y - 3); WM.audio.sfx('splash'); },   // someone goes into the water
      boat: function (key, on) { actor(key).boat = on !== false; },   // seat a character in a small boat (on water)
      spawn: function (key, who, tx, ty, dir) {
        // the same character still walking off from an earlier despawn turns round and walks to the new spot
        var f = F(), ex = f.findActor(key);
        // already standing there since the scene was set (see Field.stage)
        if (ex && ex.ev && ex.ev.staged) {
          var et = ex.tile();
          if (et.x === tx && et.y === ty && ex.sheetWho === who) { ex.ev.staged = false; ex.ev.idle = null; ex.solid = true; if (dir) ex.dir = dir; return ex; }
          f.actors = f.actors.filter(function (o) { return o !== ex; });
        }
        var back = (f.actors || []).filter(function (o) { return (o.leavingKey || o.lingering || o.autoShown) && o.sheetWho === who; })[0];   // still on their way out, or still standing about
        // a companion standing in at the leader's side on this very spot steps aside for whoever the scene puts there
        shown.slice().forEach(function (o) {
          if (o.sheetWho === who || !o.standTo || o.standTo.x !== tx || o.standTo.y !== ty) return;
          shown.splice(shown.indexOf(o), 1); f.actors = f.actors.filter(function (q) { return q !== o; });
          reserved = { x: tx, y: ty }; showSpeaker(o.sheetWho); reserved = null;
          if (WM.debug && WM.debug.showLog) WM.debug.showLog.push({ clash: true, id: o.sheetWho, by: who, map: f.map.id, at: [tx, ty] });
        });
        var a = f.addActor(key, who, tx, ty, dir); a.sheetWho = who;
        // the same person called back on stage walks over from where they are, if the way is clear (never through a wall)
        if (back) {
          var bx = Math.floor(back.x / TS), by = Math.floor((back.y - 1) / TS), clear = true;
          for (var cx2 = Math.min(bx, tx); cx2 <= Math.max(bx, tx) && clear; cx2++) if (f.tileSolid(cx2, by)) clear = false;
          for (var cy2 = Math.min(by, ty); cy2 <= Math.max(by, ty) && clear; cy2++) if (f.tileSolid(tx, cy2)) clear = false;
          if (!clear || Math.abs(bx - tx) + Math.abs(by - ty) > 12) { f.actors = f.actors.filter(function (o) { return o !== back; }); back = null; }
        }
        if (back) {
          var from = { x: Math.floor(back.x / TS), y: Math.floor((back.y - 1) / TS) };
          f.actors = f.actors.filter(function (o) { return o !== back; });
          a.x = back.x; a.y = back.y;
          if (from.x !== tx || from.y !== ty) { a.finalDir = dir || 'down'; a.entering = new Promise(function (res) { a.finishEntrance = function () { a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; a.onArrive = null; a.dir = a.finalDir; a.entering = null; a.finishEntrance = null; res(); }; a.path = [{ x: a.x, y: ty * TS + 15 }, { x: tx * TS + 8, y: ty * TS + 15 }]; a.speed = 70; a.onArrive = function () { if (a.finishEntrance) a.finishEntrance(); }; }); arrivals.push(a.entering); }
          return a;
        }
        enter(a, who, tx, ty, dir);
        return a;
      },
      // those named fall in behind the leader and follow wherever he walks (until a scene places them again)
      follow: function (keys) { F().trail = []; keys.forEach(function (k, i) { var a = F().findActor(k); if (!a) return; snap(k); a.following = true; a.followIdx = i; a.solid = false; }); },
      despawn: function (key, opt) { sendOff(key, pending, opt); },   // opt.to: [x, y], where they go
      // show the way on: twinkling motes at each spot ({ map, x, y, w }) until the story flag `until` is set
      mark: function (spots, until) {
        var st = WM.state; st.marks = (st.marks || []).filter(function (m) { return !(m.until && S.has(m.until)); });
        (spots || []).forEach(function (sp) { st.marks.push({ map: sp.map, x: sp.x, y: sp.y, w: sp.w || 1, sparks: !!sp.sparks, until: until }); });
      },
      // a change of clothes for a character (look parts to change, e.g. { body, robe: false }); null puts theirs back
      costume: function (id, look) { var st = WM.state; st.costume = st.costume || {}; if (look) st.costume[id] = look; else delete st.costume[id]; },
      // what someone left standing after the scene says when the player talks to them (a line, or several)
      idle: function (key, lines) { var a = F().findActor(key); if (a && a.ev) a.ev.idle = lines; },
      spawnBeast: function (key, art, tx, ty, dir, params) { var a = F().addBeast(key, art, tx, ty, dir, params); enter(a, null, tx, ty, dir); return a; },
      leader: function (id) { F().setLeader(id); },
      // --- screen ---
      shake: function (p, d) { G.shake = p || 3; return WM.wait(d || 0.3); },
      flash: function () { G.flash = 1; return WM.wait(0.25); },
      sfx: function (n) { WM.audio.sfx(n); },
      music: function (id) { WM.audio.play(id); },
      stopMusic: function () { WM.audio.stop(); },
      tint: function (t) { WM.state.flags.tintOverride = t; },
      night: function (on) { WM.state.flags.night = on !== false; },
      weather: function (w) { WM.state.flags.weather = w || null; },
      camera: function (tx, ty, dur) {
        snapAll();
        var f = F();
        f.camTarget = { x: tx * TS + 8, y: ty * TS + 8 };
        return WM.wait(dur || 0.8);
      },
      cameraReset: function () { F().camTarget = null; F().updateCamera(true); },
      warp: function (map, tx, ty, dir, opt) {
        opt = opt || {};
        var go = function () { F().loadMap(map, tx, ty, dir || 'down', true); if (WM.scene !== F()) WM.setScene(F(), { map: map, x: tx, y: ty, dir: dir, noAuto: true }); };
        if (opt.noFade) { go(); return Promise.resolve(); }
        // the fade-in starts but the script goes on at once, so whoever it places next is already there when the picture appears
        return WM.fadeOut(opt.fade || 0.4).then(function () { go(); WM.fadeIn(opt.fade || 0.4); });
      },
      // --- combat ---
      battle: function (troop, opt) {
        opt = opt || {};
        return WM.battle.start(troop, opt).then(function (r) {
          if (r === 'lose' && !opt.canLose) return WM.gameOver().then(function () { return new Promise(function () {}); });
          return r;
        });
      },
      duel: function (id, opt) {
        return WM.duel.start(id, opt || {}).then(function (r) {
          if (r === 'lose' && !(opt && opt.canLose)) return WM.gameOver().then(function () { return new Promise(function () {}); });
          return r;
        });
      },
      war: function (id, opt) {
        return WM.war.start(id, opt || {}).then(function (r) {
          if (r === 'lose' && !(opt && opt.canLose)) return WM.gameOver().then(function () { return new Promise(function () {}); });
          return r;
        });
      },
      // --- party / roster ---
      join: function (id, opt) {
        opt = opt || {};
        var fresh = S.recruit(id, opt.lv);
        if (opt.party) S.addToParty(id);
        if (!fresh || opt.silent) return Promise.resolve();
        var d = S.def(id);
        WM.audio.sfx('join');
        var line = d.rank ? d.name + ' joined the 108 Stars.' : d.name + ' joined.';
        var sub = d.rank ? 'The ' + d.starEn + ' (' + d.star + ') shines.' : '';
        return WM.ui.joinCard ? WM.ui.joinCard(id) : UI.notice(line + (sub ? '  ' + sub : ''));
      },
      joinMany: function (ids, opt) {
        var chain = Promise.resolve();
        ids.forEach(function (id) { chain = chain.then(function () { return s.join(id, opt); }); });
        return chain;
      },
      party: function (ids) { S.setParty(ids); if (F().player) F().setLeader(WM.state.leader); },
      addParty: function (id) { if (!WM.state.chars[id]) S.initChar(id); S.addToParty(id); },
      removeParty: function (id) { S.removeFromParty(id); if (WM.state.leader === id && WM.state.party.length) F().setLeader(WM.state.party[0]); },
      setLeader: function (id) { WM.state.leader = id; if (F().player) F().setLeader(id); },
      inParty: function (id) { return WM.state.party.indexOf(id) >= 0; },
      level: function (id, lv) { var c = WM.state.chars[id] || S.initChar(id, lv); if (c.lv < lv) { c.lv = lv; S.catchUp(id); S.restore(id); } },
      heal: function () { S.restoreParty(); WM.audio.sfx('heal'); },
      kill: function (id) { // story death
        WM.state.dead[id] = true; S.removeFromParty(id);
        return Promise.resolve();
      },
      // --- flags & items ---
      flag: function (k, v) { return S.flag(k, v === undefined ? true : v); },
      unflag: function (k) { delete WM.state.flags[k]; },
      has: function (k) { return S.has(k); },
      give: function (item, n, silent) {
        S.give(item, n || 1);
        if (silent) return Promise.resolve();
        WM.audio.sfx('item');
        var it = WM.data.items[item];
        return UI.notice('Obtained ' + it.name + ((n || 1) > 1 ? ' x' + n : '') + '.', { auto: 1.6 });
      },
      take: function (item, n) { S.take(item, n || 1); },
      count: function (item) { return S.count(item); },
      gold: function (n, silent) {
        WM.state.gold = Math.max(0, WM.state.gold + n);
        if (silent) return Promise.resolve();
        WM.audio.sfx('coins');
        return UI.notice((n >= 0 ? 'Received ' : 'Paid ') + Math.abs(n) + ' taels.', { auto: 1.4 });
      },
      // --- presentation ---
      chapter: function (n) { WM.state.chapter = n; return WM.cards.chapter(n); },
      card: function (text, opt) { return WM.cards.text(text, opt); },
      credits: function () { return WM.cards.credits(); },
      endChapter: function () { return WM.cards.nextTime(); },
      // --- facilities ---
      shop: function (id) { return WM.shops.open(id); },
      inn: function (price, who) { return WM.shops.inn(price, who); },
      smith: function (maxLv, who) { return WM.shops.smith(maxLv, who); },
      talismanShop: function (id) { return WM.shops.open(id); },   // talismans gave way to skills: the old masters sell incense
      saveMenu: function () { return WM.menu.saveMenu(); },
      roster: function () { return WM.menu.partyEdit(); },
      tablet: function () { return WM.menu.tablet(); }
    };
    // these wait for anyone still walking in; a warp first sets everyone down where they were going
    ['battle', 'duel', 'war', 'tablet', 'card', 'shop', 'inn', 'smith', 'talismanShop', 'saveMenu', 'roster', 'join', 'joinMany', 'endChapter'].forEach(function (k) { s[k] = after(s[k]); });
    var warp0 = s.warp; s.warp = function () { snapAll(); return warp0.apply(s, arguments); };
    // after a chapter card the screen is black: narration may run over it, but the first line spoken, or anyone
    // moving, fades the scene in first
    ['say', 'ask', 'choose', 'notice', 'move', 'moveTo', 'walkTo', 'emote', 'jump', 'battle', 'duel', 'war'].forEach(function (k) {
      var f0 = s[k]; if (typeof f0 !== 'function') return;
      s[k] = function () {
        var self = this, args = arguments;
        if (!WM.chapterDark) return f0.apply(self, args);
        WM.chapterDark = false;
        return (G.fade > 0.5 ? WM.fadeIn(0.6) : Promise.resolve()).then(function () { return f0.apply(self, args); });
      };
    });
    var fadeIn0 = s.fadeIn; s.fadeIn = function () { WM.chapterDark = false; return fadeIn0.apply(this, arguments); };
    // the scene goes on: whoever was sent off now leaves (see sendOff)
    ['say', 'narrate', 'ask', 'choose', 'notice', 'wait', 'move', 'moveTo', 'walkTo', 'emote', 'jump', 'shake', 'flash', 'battle', 'duel', 'war', 'camera'].forEach(function (k) {
      var f0 = s[k]; if (typeof f0 !== 'function') return;
      s[k] = function () { flush(); return f0.apply(this, arguments); };
    });
    // a fade to black: those sent off stay in the picture while it darkens, and are gone once it is dark (no one
    // vanishes, or turns to walk away, in the second before the scene goes black)
    var fadeOut0 = s.fadeOut;
    s.fadeOut = function () {
      return fadeOut0.apply(this, arguments).then(function () {
        hideShown();
        var f = F(), keep = [];
        pending.forEach(function (a) { if (a.leaveOpt || joined(a) || a.img) f.actors = f.actors.filter(function (o) { return o !== a; }); else keep.push(a); });
        pending = keep;
      });
    };
    // A companion who speaks is seen speaking: a party member (not the leader) with a line and no figure on the map
    // steps out from the leader to stand beside them, and falls back in when the scene is over.
    var shown = [];
    var reserved = null;
    var faceLeader = function (a) {   // a companion beside the leader looks at them, not off where they walked
      var pl = F().player; if (!pl) return;
      var dx = pl.x - a.x, dy = pl.y - a.y;
      a.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    };
    var showSpeaker = function (who) {
      var id = typeof who === 'string' ? who.split(':')[0] : null, f = F();
      // one who has since become the leader, or left the party, is no longer a stand-in at the leader's side
      shown = shown.filter(function (o) { var gone = f.actors.indexOf(o) < 0 || o.sheetWho === WM.state.leader || WM.state.party.indexOf(o.sheetWho) < 0; if (gone) f.actors = f.actors.filter(function (q) { return q !== o; }); return !gone; });
      if (!id || WM.scene !== f || !f.map || f.map.def.world || !f.player || f.player.hiddenPlayer || f.transitioning) return;
      if (id === WM.state.leader || WM.state.party.indexOf(id) < 0 || WM.state.flags['ghost:' + id]) return;
      var here = (f.actors || []).filter(function (o) { return o.sheetWho === id && o.visible; })[0];
      if (here) { if (here.autoShown && !here.path.length) faceLeader(here); return; }
      var p = f.player.tile(), room = f.roomAt(p.x, p.y), taken = function (x, y) { return (f.actors || []).some(function (o) { var t = o.standTo || o.tile(); return o.visible && t.x === x && t.y === y; }) || (x === p.x && y === p.y); };   // (one still stepping out counts where they are going)
      var back = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[f.player.dir] || [0, 1];
      var spots = [[-1, 0], [1, 0], back, [-1, back[1] || 1], [1, back[1] || 1], [-2, 0], [2, 0], [back[0] * 2, back[1] * 2]];
      var at = null;
      for (var i = 0; i < spots.length && !at; i++) {
        var x = p.x + spots[i][0], y = p.y + spots[i][1];
        if (!f.tileSolid(x, y) && !taken(x, y) && f.roomAt(x, y) === room && !(reserved && reserved.x === x && reserved.y === y)) at = [x, y];
      }
      var log = WM.debug && WM.debug.showLog;
      if (log && WM.debug.holdOnShow && at) WM.debug.hold = true;   // (tools/autoplay-headless.js SHOTDIR: wait while the scene is photographed)
      if (log) log.push({ id: id, map: f.map.id, ch: WM.state.chapter, lead: [p.x, p.y, f.player.dir], at: at, on: at ? f.map.get(at[0], at[1]) : null, others: (f.actors || []).filter(function (o) { return o.visible; }).length });
      if (!at) return;
      var a = f.addActor('~' + id, id, at[0], at[1], f.player.dir); a.sheetWho = id; a.autoShown = true; a.solid = false; a.standTo = { x: at[0], y: at[1] };
      a.x = f.player.x; a.y = f.player.y; a.path = [{ x: at[0] * TS + 8, y: at[1] * TS + 15 }]; a.speed = 70;   // out from the leader's side
      a.onArrive = function () { a.onArrive = null; faceLeader(a); };   // then turn to the leader
      shown.push(a);
    };
    var hideShown = function () { var f = F(); f.actors = f.actors.filter(function (o) { return shown.indexOf(o) < 0; }); shown = []; };
    s.beside = function (id) { showSpeaker(id); };   // bring a companion out beside the leader without a line (someone the scene is about)
    var ask0 = s.ask;
    s.ask = function (who) { showSpeaker(who); return ask0.apply(this, arguments); };
    var say0 = s.say;
    s.say = function (who, text) {
      showSpeaker(who);
      var id = typeof who === 'string' ? who.split(':')[0] : null, last = Array.isArray(text) ? text[text.length - 1] : text;
      if (id && last && !/^\(/.test(last)) lines[id] = last;   // remembered as what they say if spoken to afterwards
      return say0.apply(this, arguments);
    };
    // the scene is over: anyone sent off at its very end stays where they are (new party members still fall in)
    s._end = function () { hideShown(); var p = pending; pending = []; p.forEach(function (a) { if (a.quiet) drop(a); else if (a.img || (a.sheetWho && WM.state.party.indexOf(a.sheetWho) >= 0)) go(a); else stay(a, lines); }); };
    return s;
  }
  SC.makeApi = makeApi;
})();
