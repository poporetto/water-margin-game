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
        SC.running--; WM.input.clear();
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

  function makeApi(ctx) {
    var s = {
      S: S, ctx: ctx,
      get state() { return WM.state; },
      say: function (who, text, opt) {
        if (Array.isArray(text)) { var chain = Promise.resolve(); text.forEach(function (t) { chain = chain.then(function () { return UI.message(who, t, opt); }); }); return chain; }
        return UI.message(who, text, opt);
      },
      narrate: function (text, opt) { return UI.narrate(text, opt); },
      ask: function (who, text, options, opt) { return UI.ask(who, text, options, opt); },
      choose: function (options, opt) { return UI.choose(options, opt); },
      notice: function (text, opt) { return UI.notice(text, opt); },
      wait: function (sec) { return WM.wait(sec); },
      fadeOut: function (d, col) { return WM.fadeOut(d == null ? 0.5 : d, col); },
      fadeIn: function (d) { return WM.fadeIn(d == null ? 0.5 : d); },
      // --- actors ---
      actor: actor,
      move: function (key, steps, opt) {
        opt = opt || {};
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
      place: function (key, tx, ty, dir) { var a = actor(key); a.x = tx * TS + 8; a.y = ty * TS + 15; a.path = []; if (dir) a.dir = dir; if (a.isPlayer) F().lastTile = a.tile(); },
      face: function (key, dir) { actor(key).dir = dir; },
      faceEach: function (k1, k2) {
        var a = actor(k1), b = actor(k2);
        var dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) > Math.abs(dy)) { a.dir = dx > 0 ? 'right' : 'left'; b.dir = dx > 0 ? 'left' : 'right'; }
        else { a.dir = dy > 0 ? 'down' : 'up'; b.dir = dy > 0 ? 'up' : 'down'; }
      },
      emote: function (key, type, dur) { var a = actor(key); a.emote = type; a.emoteT = dur || 1.2; WM.audio.sfx(type === '!' ? 'cursor' : 'blip'); return WM.wait(Math.min(0.6, dur || 0.6)); },
      jump: function (key, h) { var a = actor(key); a.jumpDur = a.jumpT = 0.35; a.jumpH = h || 6; return WM.wait(0.36); },
      show: function (key) { actor(key).visible = true; },
      hide: function (key) { actor(key).visible = false; },
      lie: function (key, on) { actor(key).static = on === false ? null : 'down'; },
      spawn: function (key, who, tx, ty, dir) { return F().addActor(key, who, tx, ty, dir); },
      despawn: function (key) { F().removeActor(key); },
      spawnBeast: function (key, art, tx, ty, dir, params) { return F().addBeast(key, art, tx, ty, dir, params); },
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
        var f = F();
        f.camTarget = { x: tx * TS + 8, y: ty * TS + 8 };
        return WM.wait(dur || 0.8);
      },
      cameraReset: function () { F().camTarget = null; F().updateCamera(true); },
      warp: function (map, tx, ty, dir, opt) {
        opt = opt || {};
        var go = function () { F().loadMap(map, tx, ty, dir || 'down', true); if (WM.scene !== F()) WM.setScene(F(), { map: map, x: tx, y: ty, dir: dir, noAuto: true }); };
        if (opt.noFade) { go(); return Promise.resolve(); }
        return WM.fadeOut(opt.fade || 0.4).then(function () { go(); return WM.fadeIn(opt.fade || 0.4); });
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
      level: function (id, lv) { var c = WM.state.chars[id] || S.initChar(id, lv); if (c.lv < lv) { c.lv = lv; S.restore(id); } },
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
    return s;
  }
  SC.makeApi = makeApi;
})();
