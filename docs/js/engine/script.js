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
      if (d >= 2) {
        if (!door && isWay(c[0], c[1])) door = c;
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
    return !f || !f.map || f.map.def.world || G.fade > 0.4 || f.transitioning || (typeof who === 'string' && WM.state.flags['ghost:' + who]) || !WM.field.player;
  }
  function walk(a, path, onDone) {
    a.x = path[0][0] * TS + 8; a.y = path[0][1] * TS + 15;
    a.path = path.slice(1).map(function (p) { return { x: p[0] * TS + 8, y: p[1] * TS + 15 }; });
    a.speed = U.clamp((path.length - 1) * TS / 1.6, 56, 140); a.animSpeed = a.speed > 90 ? 1.4 : 1;
    a.onArrive = onDone;
    if (!a.path.length) { a.onArrive = null; onDone(); }
  }
  function enter(a, who, tx, ty, dir) {
    if (instant(who)) return;
    var path = wayIn(tx, ty); if (!path || path.length < 3) return;
    a.finalDir = dir || 'down';
    a.entering = new Promise(function (res) {
      a.finishEntrance = function () { a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; a.onArrive = null; a.dir = a.finalDir; a.entering = null; a.finishEntrance = null; res(); };
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
  function leave(key) {
    var f = F(), a = f.findActor(key);
    if (!a || !a.ev || !a.ev.temp) { f.removeActor(key); return; }
    if (a.finishEntrance) a.finishEntrance();
    var t = { x: Math.floor(a.x / TS), y: Math.floor((a.y - 1) / TS) };
    var path = (!instant(a.sheetWho) && a.visible && !a.static) ? wayIn(t.x, t.y) : null;
    if (!path || path.length < 3) { f.removeActor(key); return; }
    path.reverse();                                     // from where they stand to the way out
    a.ev.id = '__leaving' + (++leaving); a.leavingKey = key;
    walk(a, path, function () { f.actors = f.actors.filter(function (o) { return o !== a; }); });
  }

  function makeApi(ctx) {
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
      place: function (key, tx, ty, dir) { snap(key); var a = actor(key); a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; if (dir) a.dir = dir; if (a.isPlayer) F().lastTile = a.tile(); },
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
      spawn: function (key, who, tx, ty, dir) {
        // the same character still walking off from an earlier despawn turns round and walks to the new spot
        var f = F(), ex = f.findActor(key);
        // already standing there since the scene was set (see Field.stage)
        if (ex && ex.ev && ex.ev.staged) {
          var et = ex.tile();
          if (et.x === tx && et.y === ty && ex.sheetWho === who) { ex.ev.staged = false; if (dir) ex.dir = dir; return ex; }
          f.actors = f.actors.filter(function (o) { return o !== ex; });
        }
        var back = (f.actors || []).filter(function (o) { return o.leavingKey && o.sheetWho === who; })[0];
        var a = f.addActor(key, who, tx, ty, dir); a.sheetWho = who;
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
      despawn: function (key) { leave(key); },
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
      talismanShop: function (id) { return WM.shops.talismans(id); },
      saveMenu: function () { return WM.menu.saveMenu(); },
      roster: function () { return WM.menu.partyEdit(); },
      tablet: function () { return WM.menu.tablet(); }
    };
    // these wait for anyone still walking in; a warp first sets everyone down where they were going
    ['battle', 'duel', 'war', 'tablet', 'card', 'shop', 'inn', 'smith', 'talismanShop', 'saveMenu', 'roster', 'join', 'joinMany', 'endChapter'].forEach(function (k) { s[k] = after(s[k]); });
    var warp0 = s.warp; s.warp = function () { snapAll(); return warp0.apply(s, arguments); };
    return s;
  }
  SC.makeApi = makeApi;
})();
