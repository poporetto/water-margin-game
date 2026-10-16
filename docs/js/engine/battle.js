// Turn-based battle modelled on Suikoden II:
// six-member party in front and back rows (everyone can strike from either), each hero's own skills with uses per skill level,
// Unite attacks, and the Fight / Bribe / Run / Auto / Let Go round menu.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var B = WM.battle = {};
  var SCN = { countsTime: true };
  WM.scenes.battle = SCN;

  var STAGE_H = 520, PX = 4, PXH = 5; // battle pixel scale: beasts x4, people x5
  var MENU_W = 170, MENU_X = 480 - MENU_W / 2;   // the round and command menus, centred between the enemy and the party
  var POS = {
    party: [[600, 300], [672, 372], [744, 444], [744, 256], [816, 328], [888, 400]],
    enemy: [[364, 280], [292, 352], [220, 424], [226, 236], [154, 308], [82, 380]],
    guest: [[900, 230]]
  };

  // ---------- backgrounds ----------
  var BG = {
    plains: { sky: ['#8ec5ef', '#d8ecf6'], far: '#7aa0b8', near: '#5b9a3e', ground: ['#6aa848', '#4f8a34'], deco: 'grass' },
    spring: { sky: ['#8ec5ef', '#d8ecf6'], far: '#7aa0b8', near: '#5b9a3e', ground: ['#6aa848', '#4f8a34'], deco: 'grass' },
    summer: { sky: ['#7ab8ea', '#d0eaf6'], far: '#6a98b0', near: '#4f9238', ground: ['#5a9e40', '#407c2e'], deco: 'grass' },
    forest: { sky: ['#4a7a5a', '#8ab08a'], far: '#2e5a3a', near: '#2a5a2a', ground: ['#4a7a34', '#365e26'], deco: 'trees' },
    mountain: { sky: ['#a0b8d0', '#e0e8ee'], far: '#8a8a9a', near: '#7a6a58', ground: ['#9a8a6e', '#7a6a52'], deco: 'rocks' },
    snow: { sky: ['#9aa8b8', '#dfe6ee'], far: '#b8c4d0', near: '#cfd8e2', ground: ['#eef2f6', '#cdd6e2'], deco: 'snow' },
    autumn: { sky: ['#e0b080', '#f4dcc0'], far: '#a08060', near: '#9a7a3a', ground: ['#a8984a', '#8a7a34'], deco: 'grass' },
    dusk: { sky: ['#5a3a5a', '#e89a5a'], far: '#5a4a5a', near: '#4a5a34', ground: ['#5a7a3e', '#3a5a2a'], deco: 'grass' },
    night: { sky: ['#0a1028', '#2a3458'], far: '#1a2238', near: '#1e2a22', ground: ['#2a3a2a', '#1a261a'], deco: 'grass', stars: true },
    town: { sky: ['#9ac8ec', '#dceaf2'], far: '#8a8478', near: '#a7a49a', ground: ['#b4b0a4', '#8a877e'], deco: 'town' },
    interior: { sky: ['#3a2418', '#5a3a24'], far: '#4a2e1c', near: '#6a4a30', ground: ['#a3744a', '#8a5f38'], deco: 'interior' },
    marsh: { sky: ['#9ac0d8', '#e0ecf0'], far: '#6a8a7a', near: '#3b78c0', ground: ['#4a86c8', '#2f67ad'], deco: 'reeds' },
    river: { sky: ['#9ac0d8', '#e0ecf0'], far: '#6a8a7a', near: '#3b78c0', ground: ['#4a86c8', '#2f67ad'], deco: 'boat' },
    temple: { sky: ['#5a2a20', '#8a4a30'], far: '#6a2a20', near: '#7a6a58', ground: ['#8e8c86', '#76746e'], deco: 'temple' },
    palace: { sky: ['#3a2a30', '#6a4a40'], far: '#5a2a24', near: '#7a3a2a', ground: ['#8a2420', '#6a1a14'], deco: 'palace' },
    cave: { sky: ['#14100c', '#2a2018'], far: '#2a2018', near: '#3a2e22', ground: ['#4a3e30', '#362c22'], deco: 'rocks' },
    fire: { sky: ['#3a0a04', '#c84a1a'], far: '#5a1a0a', near: '#4a2a1a', ground: ['#5a3a24', '#3a2414'], deco: 'fire' },
    ridge: { sky: ['#c8a070', '#f0d8b0'], far: '#8a7a6a', near: '#8a7a50', ground: ['#a89060', '#8a7448'], deco: 'rocks' },
    south: { sky: ['#8ec8e8', '#e0f0f4'], far: '#6a9a8a', near: '#3a843c', ground: ['#4a9a4a', '#3a843c'], deco: 'trees' },
    north: { sky: ['#a8b4c0', '#e4e8ea'], far: '#8a8a7a', near: '#8a9a5a', ground: ['#8a9a5a', '#76844a'], deco: 'grass' },
    hall: { sky: ['#0a0810', '#24182a'], far: '#1a1020', near: '#2a1a24', ground: ['#3a2a30', '#241820'], deco: 'temple', stars: false }
  };
  function makeBg(type) {
    var b = BG[type] || BG.plains;
    var w = 240, h = 130;
    var cv = U.makeWorldCanvas(w, h), c = cv.getContext('2d');
    var hz = 40;
    var gr = c.createLinearGradient(0, 0, 0, hz);
    gr.addColorStop(0, b.sky[0]); gr.addColorStop(1, b.sky[1]);
    c.fillStyle = gr; c.fillRect(0, 0, w, hz + 2);
    if (b.stars) for (var i = 0; i < 40; i++) { c.fillStyle = i % 5 ? '#c8d0ff' : '#ffffff'; c.fillRect(Math.floor(U.hash2(i, 1, 7) * w), Math.floor(U.hash2(i, 2, 7) * hz), 1, 1); }
    // far hills silhouette
    c.fillStyle = b.far;
    for (var x = 0; x < w; x++) { var y = hz - 6 - Math.round(Math.sin(x * 0.05) * 4 + Math.sin(x * 0.13 + 1) * 3 + U.hash2(x, 0, 3) * 1.5); c.fillRect(x, y, 1, hz - y + 1); }
    if (type === 'mountain' || type === 'snow' || type === 'ridge') {
      c.fillStyle = U.shade(b.far, -0.15);
      for (x = 0; x < w; x++) { var yy = hz - 4 - Math.abs(((x + 30) % 80) - 40) * 0.6; c.fillRect(x, yy, 1, hz - yy); }
      if (type === 'snow') { c.fillStyle = '#f4f8fb'; for (x = 0; x < w; x++) { var y2 = hz - 4 - Math.abs(((x + 30) % 80) - 40) * 0.6; if (y2 < hz - 16) c.fillRect(x, y2, 1, 3); } }
    }
    // ground with perspective bands
    for (var yy2 = hz; yy2 < h; yy2++) {
      var t = (yy2 - hz) / (h - hz);
      c.fillStyle = U.mix(b.near, b.ground[0], Math.min(1, t * 2.2));
      c.fillRect(0, yy2, w, 1);
    }
    // texture
    for (i = 0; i < 260; i++) {
      var gx = Math.floor(U.hash2(i, 3, 11) * w), gy = hz + 2 + Math.floor(Math.pow(U.hash2(i, 4, 11), 0.8) * (h - hz - 2));
      c.fillStyle = i % 2 ? b.ground[1] : U.shade(b.ground[0], 0.12);
      c.fillRect(gx, gy, 1 + Math.floor((gy - hz) / 30), 1);
    }
    var deco = b.deco;
    if (deco === 'trees') for (i = 0; i < 12; i++) { var tx = (i * 23 + 7) % w, ty = hz - 2; c.fillStyle = '#5a3a20'; c.fillRect(tx + 3, ty - 4, 2, 6); c.fillStyle = i % 2 ? '#2c6a2c' : '#3c8a36'; c.beginPath(); c.arc(tx + 4, ty - 8, 6, 0, 7); c.fill(); }
    if (deco === 'reeds' || deco === 'boat') {
      for (i = 0; i < 50; i++) { var rx = Math.floor(U.hash2(i, 9, 2) * w), ry = hz + Math.floor(U.hash2(i, 8, 2) * 14); c.fillStyle = '#8a9a4a'; c.fillRect(rx, ry - 8, 1, 8); c.fillStyle = '#c8b878'; c.fillRect(rx, ry - 10, 1, 2); }
      for (i = 0; i < 40; i++) { c.fillStyle = 'rgba(220,240,255,0.5)'; c.fillRect(Math.floor(U.hash2(i, 5, 2) * w), hz + 10 + Math.floor(U.hash2(i, 6, 2) * 80), 4, 1); }
      if (deco === 'boat') { c.fillStyle = '#5a3418'; c.fillRect(110, 92, 120, 14); c.fillStyle = '#8a5a2c'; c.fillRect(110, 88, 120, 5); c.fillStyle = '#7a4e28'; c.fillRect(10, 74, 90, 12); c.fillStyle = '#9a6a3c'; c.fillRect(10, 71, 90, 4); }
    }
    if (deco === 'rocks') for (i = 0; i < 8; i++) { var kx = Math.floor(U.hash2(i, 7, 4) * w), ky = hz + 6 + Math.floor(U.hash2(i, 8, 4) * 70); c.fillStyle = '#5e5446'; c.beginPath(); c.ellipse(kx, ky, 5 + i % 3, 3, 0, 0, 7); c.fill(); c.fillStyle = '#ad9f88'; c.fillRect(kx - 2, ky - 2, 3, 1); }
    if (deco === 'town') { for (i = 0; i < 6; i++) { var hx = i * 44 - 8; c.fillStyle = '#e6dcc4'; c.fillRect(hx, hz - 14, 34, 14); c.fillStyle = '#5b6476'; c.fillRect(hx - 3, hz - 20, 40, 7); c.fillStyle = '#6a3e22'; c.fillRect(hx + 13, hz - 9, 7, 9); } }
    if (deco === 'interior') { c.fillStyle = '#4a2e1c'; c.fillRect(0, 0, w, hz); for (i = 0; i < w; i += 30) { c.fillStyle = '#2a180c'; c.fillRect(i, 0, 4, hz); } c.fillStyle = '#d8ccb0'; c.fillRect(0, hz - 12, w, 10); }
    if (deco === 'temple' || deco === 'palace') { for (i = 0; i < w; i += 40) { c.fillStyle = '#9c2f25'; c.fillRect(i + 10, 4, 6, hz); c.fillStyle = '#5c1a14'; c.fillRect(i + 9, 4, 8, 3); } c.fillStyle = deco === 'palace' ? '#c99a2e' : '#5b6476'; c.fillRect(0, 0, w, 5); }
    if (deco === 'fire') for (i = 0; i < 30; i++) { c.fillStyle = i % 2 ? '#f08a2a' : '#e04a1a'; var fx = Math.floor(U.hash2(i, 1, 9) * w); c.fillRect(fx, hz - 10 - (i % 7), 3, 12 + (i % 7)); }
    if (deco === 'snow') for (i = 0; i < 60; i++) { c.fillStyle = '#ffffff'; c.fillRect(Math.floor(U.hash2(i, 1, 13) * w), Math.floor(U.hash2(i, 2, 13) * h), 1, 1); }
    return cv;
  }

  // ---------- units ----------
  function partyUnit(id, idx) {
    var c = WM.state.chars[id], st = S.stats(id), d = S.def(id);
    return {
      side: 'party', id: id, name: d.name, idx: idx, row: idx < 3 ? 0 : 1, lv: c.lv,
      hp: c.hp, mhp: st.mhp, atk: st.atk, dfs: st.dfs, spd: st.spd, skl: st.skl, mgc: st.mgc, luk: st.luk,
      range: st.range, mp: c.mp, status: U.deepCopy(c.status || {}), pos: POS.party[idx].slice(),
      sheet: WM.sprites.get(id), anim: { ox: 0, oy: 0, flash: 0, alpha: 1 }, tal: c.tal
    };
  }
  function guestUnit(id, i) {
    if (!WM.state.chars[id]) S.initChar(id, S.partyAvgLv());
    var u = partyUnit(id, 0); u.idx = 6 + i; u.row = 1; u.guest = true; u.pos = POS.guest[i].slice();
    S.restore(id); u.hp = u.mhp;
    return u;
  }
  function enemyUnit(eid, idx) {
    var d = WM.data.enemies[eid];
    if (!d) throw new Error('Unknown enemy ' + eid);
    var u = {
      side: 'enemy', id: eid, def: d, name: d.name, idx: idx, row: idx < 3 ? 0 : 1, lv: d.lv,
      hp: d.hp, mhp: d.hp, atk: d.atk, dfs: d.dfs, spd: d.spd, skl: d.skl || d.lv * 2 + 10, mgc: d.mgc || 5, luk: d.luk || 8,
      range: d.range || 'S', status: {}, pos: POS.enemy[idx].slice(), anim: { ox: 0, oy: 0, flash: 0, alpha: 0 }
    };
    if (d.sprite.kind === 'human') u.sheet = WM.sprites.get('en:' + eid, d.sprite.look);
    else u.img = WM.monsters.get(d.sprite.art, d.sprite.params);
    return u;
  }

  // ---------- start ----------
  B.start = function (troop, opt) {
    opt = opt || {};
    var tdef = typeof troop === 'string' ? WM.data.troops[troop] : troop;
    if (!tdef) throw new Error('Unknown troop ' + troop);
    if (Array.isArray(tdef)) tdef = { enemies: tdef };
    return new Promise(function (resolve) {
      var prevScene = WM.scene;
      var prevMusic = WM.audio.current;
      var bt = B.cur = {
        opt: opt, tdef: tdef, resolve: resolve, prevScene: prevScene, prevMusic: prevMusic,
        party: [], enemies: [], guests: [], pops: [], fx: [], log: '', auto: false, round: 0,
        bg: makeBg(opt.bg || tdef.bg || 'plains'), intro: 0, noRun: opt.noRun || tdef.noRun || tdef.boss
      };
      WM.state.party.forEach(function (id, i) { if (i < 6) bt.party.push(partyUnit(id, i)); });
      (opt.guests || tdef.guests || []).forEach(function (id, i) { bt.guests.push(guestUnit(id, i)); });
      tdef.enemies.forEach(function (eid, i) { if (i < 6) bt.enemies.push(enemyUnit(eid, i)); });
      // swirl transition then enter
      transitionIn().then(function () {
        WM.setScene(SCN);
        WM.audio.play(opt.music || tdef.music || (tdef.boss ? 'boss' : 'battle'));
        G.fade = 0;
        run(bt);
      });
    });
  };

  function transitionIn() {
    // Suikoden-like shatter: screen breaks into tiles that fall away
    var shot = U.makeCanvas(WM.W, WM.H);
    shot.getContext('2d').drawImage(G.canvas, 0, 0, WM.W, WM.H);
    var tiles = [];
    for (var y = 0; y < 6; y++) for (var x = 0; x < 8; x++) tiles.push({ x: x * 120, y: y * 120, vx: (Math.random() - 0.5) * 300, vy: -100 - Math.random() * 200, r: 0, vr: (Math.random() - 0.5) * 6, delay: (x + y) * 0.02 });
    var t0 = WM.time;
    var w = { draw: function () {
      var t = WM.time - t0;
      var c = G.ctx; c.fillStyle = '#000'; c.fillRect(0, 0, WM.W, WM.H);
      tiles.forEach(function (tl) {
        var tt = Math.max(0, t - tl.delay);
        c.save(); c.translate(tl.x + 60 + tl.vx * tt, tl.y + 60 + tl.vy * tt + 900 * tt * tt); c.rotate(tl.vr * tt);
        c.drawImage(shot, tl.x, tl.y, 120, 120, -60, -60, 120, 120); c.restore();
      });
    } };
    UI.push(w);
    return WM.wait(0.7).then(function () { UI.remove(w); });
  }

  // ---------- helpers ----------
  function living(list) { return list.filter(function (u) { return u.hp > 0; }); }
  function allies(u) { var bt = B.cur; return u.side === 'party' ? bt.party.concat(bt.guests) : bt.enemies; }
  function foes(u) { var bt = B.cur; return u.side === 'party' ? bt.enemies : bt.party.concat(bt.guests); }
  function frontRowEmpty(list) { return !list.some(function (u) { return u.hp > 0 && u.row === 0; }); }
  // Can unit `u` hit target `t`? Anyone can strike anyone still standing, from either row (a weapon's reach only
  // decides how the blow is drawn: a bow or sling shoots from where it stands, the rest close in)
  function canReach(u, t) { return t.hp > 0; }
  function canAttack(u) { return foes(u).some(function (t) { return canReach(u, t); }); }
  B.canReach = canReach;

  function pop(u, text, col, big) {
    B.cur.pops.push({ x: u.pos[0] + u.anim.ox, y: u.pos[1] - 120, text: String(text), col: col || '#ffffff', t: 0, big: big });
  }
  function fx(kind, x, y, opt) { B.cur.fx.push({ kind: kind, x: x, y: y, t: 0, dur: (opt && opt.dur) || 0.5, opt: opt || {} }); }

  function tweenAnim(u, ox, oy, dur) {
    var a = u.anim, sx = a.ox, sy = a.oy;
    return WM.tween(dur, function (k) { var e = 1 - Math.pow(1 - k, 2); a.ox = sx + (ox - sx) * e; a.oy = sy + (oy - sy) * e; });
  }
  function hurt(u) { u.anim.flash = 0.3; u.anim.shake = 0.25; }

  // ---------- damage ----------
  function physDamage(a, t, mult, opt) {
    opt = opt || {};
    var hit = U.clamp(0.93 + (a.skl - t.spd) / 400, 0.72, 0.99);
    if (t.status.sleep || opt.sure) hit = 1;
    if (Math.random() > hit) return { miss: true };
    var raw = a.atk * (0.9 + Math.random() * 0.2) * (mult || 1);
    if (a.status.atkUp) raw *= 1.3;
    var dmg = raw - t.dfs * (opt.pierce ? 0.2 : 0.55) * (t.status.defUp ? 1.6 : 1);
    dmg = Math.max(raw * 0.12, dmg);
    var crit = Math.random() < U.clamp(0.04 + (a.skl - t.spd) / 600 + a.luk / 2000, 0.02, 0.2);
    if (crit) dmg *= 1.6;
    if (t.defending) dmg *= 0.5;
    if (t.def && t.def.weak === 'phys') dmg *= 1.4;
    return { dmg: Math.max(1, Math.round(dmg)), crit: crit };
  }
  function magicDamage(a, t, power, element) {
    var dmg = power * (1 + a.mgc / 55) * (0.92 + Math.random() * 0.16) - t.mgc * 0.25;
    if (t.def) {
      if (t.def.weak === element) dmg *= 1.5;
      if (t.def.resist === element) dmg *= 0.5;
    }
    if (t.defending) dmg *= 0.75;
    return Math.max(1, Math.round(dmg));
  }
  function applyDamage(t, dmg) {
    t.hp = Math.max(0, t.hp - dmg);
    if (t.status.sleep) delete t.status.sleep;
    hurt(t);
    if (t.hp <= 0) onKO(t);
  }
  function applyHeal(t, n) { if (t.hp <= 0) return; t.hp = Math.min(t.mhp, t.hp + n); pop(t, n, '#7fe07a'); }
  function onKO(t) {
    t.status = {};
    if (t.side === 'enemy') { WM.tween(0.5, function (k) { t.anim.alpha = 1 - k; t.anim.flash = 0.5 * (1 - k); }); }
  }

  // ---------- main loop ----------
  async function run(bt) {
    // fade enemies in
    await WM.tween(0.4, function (k) { bt.enemies.forEach(function (e) { e.anim.alpha = k; }); });
    if (bt.opt.intro) await UI.message(null, bt.opt.intro);
    var result = null;
    while (!result) {
      bt.round++;
      bt.party.concat(bt.guests).forEach(function (u) { u.defending = false; });
      bt.enemies.forEach(function (u) { u.defending = false; });
      var choice = bt.auto ? 'auto' : await roundMenu(bt);
      if (choice === 'run') {
        var pSpd = avg(living(bt.party), 'spd'), eSpd = avg(living(bt.enemies), 'spd');
        if (Math.random() < U.clamp(0.55 + (pSpd - eSpd) / 120, 0.2, 0.95)) { WM.audio.sfx('run'); await say('The party escaped.'); result = 'run'; break; }
        await say('Could not escape!');
        await executeRound(bt, []);
      } else if (choice === 'bribe') {
        var cost = bribeCost(bt);
        var ok = await UI.ask(null, 'Bribe the enemy with ' + cost + ' taels? (You have ' + WM.state.gold + '.)', ['Pay', 'Never mind']);
        if (ok === 0) {
          if (WM.state.gold >= cost) { WM.state.gold -= cost; WM.audio.sfx('coins'); await say('The enemy took the silver and left.'); result = 'bribe'; break; }
          await say('Not enough silver.');
        }
        continue;
      } else if (choice === 'letgo') {
        await say('The enemies scattered before you.'); result = 'letgo'; break;
      } else {
        var cmds = choice === 'auto' ? autoCommands(bt) : await gatherCommands(bt);
        if (!cmds) continue; // backed out
        await executeRound(bt, cmds);
      }
      if (!living(bt.enemies).length) result = 'win';
      else if (!living(bt.party).length) result = 'lose';
      else if (bt.opt.rounds && bt.round >= bt.opt.rounds) result = 'timeout';
      if (bt.auto && (I.down('cancel') || I.pressed('cancel'))) { bt.auto = false; I.clear(); }
    }
    await finish(bt, result);
  }
  function avg(list, k) { if (!list.length) return 0; var s = 0; list.forEach(function (u) { s += u[k]; }); return s / list.length; }
  function bribeCost(bt) { var g = 0; bt.enemies.forEach(function (e) { if (e.hp > 0) g += (e.def.gold || 10) * 4 + e.lv * 6; }); return Math.max(30, Math.round(g)); }
  function say(t) { return UI.notice(t, { auto: 1.1, y: 140 }); }

  function roundMenu(bt) {
    return new Promise(function (resolve) {
      var items = [{ label: 'Fight', v: 'fight' }];
      if (!bt.tdef.boss && !bt.opt.noBribe) items.push({ label: 'Bribe', v: 'bribe' });
      items.push({ label: 'Run', v: 'run', disabled: !!bt.noRun });
      items.push({ label: 'Auto', v: 'auto' });
      var maxE = 0; bt.enemies.forEach(function (e) { maxE = Math.max(maxE, e.lv); });
      if (!bt.tdef.boss && S.partyAvgLv() >= maxE + 12) items.push({ label: 'Let Go', v: 'letgo' });
      // menus sit in the clear column between the two sides, so no fighter is hidden behind them
      var list = new UI.List(items, { x: MENU_X, y: 170, w: MENU_W, cancel: false });
      list.idx = bt.lastRound || 0;
      var w = {
        update: function () {
          var r = list.handle(); if (!r || !r.ok) return;
          bt.lastRound = r.index;
          UI.remove(w);
          if (r.ok.v === 'auto') { bt.auto = true; WM.ui.toast('Auto battle — hold X to stop'); }
          resolve(r.ok.v);
        },
        draw: function () { list.draw(); }
      };
      UI.push(w);
    });
  }

  function autoCommands(bt) {
    var cmds = [];
    bt.party.forEach(function (u) {
      if (u.hp <= 0) return;
      if (canAttack(u)) cmds.push({ u: u, type: 'attack', target: null });
      else cmds.push({ u: u, type: 'defend' });
    });
    return cmds;
  }

  // ----- per-member command selection -----
  async function gatherCommands(bt) {
    var cmds = [];
    var members = bt.party.filter(function (u) { return u.hp > 0 && !u.status.sleep; });
    var i = 0;
    var usedByUnite = {};
    while (i < members.length) {
      var u = members[i];
      if (usedByUnite[u.id]) { i++; continue; }
      bt.active = u;
      var c = await commandFor(bt, u, usedByUnite);
      if (c === 'back') {
        if (i === 0) { bt.active = null; return null; }
        // undo previous command
        var prev = cmds.pop();
        if (prev && prev.type === 'unite') prev.unite.members.forEach(function (m) { delete usedByUnite[m]; });
        i--;
        while (i > 0 && usedByUnite[members[i].id]) i--;
        continue;
      }
      cmds.push(c);
      if (c.type === 'unite') c.unite.members.forEach(function (m) { usedByUnite[m] = true; });
      i++;
    }
    bt.active = null;
    // sleeping members still occupy a slot (do nothing)
    return cmds;
  }

  function commandFor(bt, u, usedByUnite) {
    return new Promise(function (resolve) {
      var unites = availableUnites(bt, u, usedByUnite);
      var arts = skillsOf(u), silenced = !!u.status.silence;
      var items = [
        { label: 'Attack', v: 'attack', disabled: !canAttack(u), help: 'Strike with your weapon.' },
        { label: 'Skill', v: 'tal', disabled: !arts.length, help: arts.length ? arts.map(function (a) { return a.name; }).join(', ') : 'No skills.' },
        { label: 'Item', v: 'item', disabled: !S.invList(function (it) { return it.battle; }).length },
        { label: 'Defend', v: 'defend' },
        { label: 'Unite', v: 'unite', disabled: !unites.length, help: unites.length ? unites.map(function (x) { return x.name; }).join(', ') : 'No unite partners in the party.' }
      ];
      var list = new UI.List(items, { x: MENU_X, y: 196, w: MENU_W, help: true });
      list.idx = u.lastCmd || (canAttack(u) ? 0 : 3);
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve('back'); return; }
          var v = r.ok.v;
          u.lastCmd = r.index;
          if (v === 'attack') {
            UI.remove(w);
            pickTarget(bt, u, foes(u).filter(function (t) { return canReach(u, t); })).then(function (t) {
              if (!t) { UI.push(w); return; }
              resolve({ u: u, type: 'attack', target: t });
            });
          } else if (v === 'defend') { UI.remove(w); resolve({ u: u, type: 'defend' }); }
          else if (v === 'tal') {
            UI.remove(w);
            pickSpell(bt, u, arts).then(function (sp) {
              if (!sp) { UI.push(w); return; }
              if (sp.target === 'enemy1' || sp.target === 'ally1' || sp.target === 'allyKO') {
                var pool = sp.target === 'enemy1' ? living(foes(u)) : sp.target === 'allyKO' ? allies(u).filter(function (a) { return a.hp <= 0; }) : living(allies(u));
                pickTarget(bt, u, pool).then(function (t) {
                  if (!t) { UI.push(w); return; }
                  resolve({ u: u, type: 'tal', spell: sp, target: t });
                });
              } else resolve({ u: u, type: 'tal', spell: sp });
            });
          } else if (v === 'item') {
            UI.remove(w);
            pickItem(bt, u).then(function (it) {
              if (!it) { UI.push(w); return; }
              var tgt = it.it.battle;
              if (tgt === 'ally1' || tgt === 'allyKO' || tgt === 'enemy1') {
                var pool = tgt === 'enemy1' ? living(foes(u)) : tgt === 'allyKO' ? allies(u) : living(allies(u));
                pickTarget(bt, u, pool).then(function (t) {
                  if (!t) { UI.push(w); return; }
                  resolve({ u: u, type: 'item', item: it.id, target: t });
                });
              } else resolve({ u: u, type: 'item', item: it.id });
            });
          } else if (v === 'unite') {
            UI.remove(w);
            UI.choose(unites.map(function (x) { return { label: x.name, help: x.desc }; }), { x: 250, y: 196, help: true }).then(function (k) {
              if (k < 0) { UI.push(w); return; }
              resolve({ u: u, type: 'unite', unite: unites[k] });
            });
          }
        },
        draw: function () { list.draw(); drawCmdHeader(u); }
      };
      UI.push(w);
    });
  }
  function drawCmdHeader(u) {
    var tw = Math.max(MENU_W, G.measure(u.name, 22, true) + 40), x = 480 - tw / 2;
    G.window(x, 150, tw, 44, { top: '#3a2a1a', bottom: '#1e140c' });
    G.text(u.name, 480, 160, { size: 22, bold: true, align: 'center', color: G.COL.gold });
  }

  function pickTarget(bt, u, pool) {
    return new Promise(function (resolve) {
      if (!pool.length) { resolve(null); return; }
      var idx = 0;
      var w = {
        update: function () {
          var cur = pool[idx];
          if (I.pressed('left') || I.pressed('up')) { idx = (idx + pool.length - 1) % pool.length; WM.audio.sfx('cursor'); }
          if (I.pressed('right') || I.pressed('down')) { idx = (idx + 1) % pool.length; WM.audio.sfx('cursor'); }
          if (I.pressed('ok')) { I.clear(); WM.audio.sfx('ok'); UI.remove(w); bt.targeting = null; resolve(pool[idx]); }
          if (I.pressed('cancel')) { I.clear(); WM.audio.sfx('cancel'); UI.remove(w); bt.targeting = null; resolve(null); }
          bt.targeting = pool[idx];
        },
        draw: function () {
          var t = pool[idx];
          var x = t.pos[0] + t.anim.ox, y = t.pos[1] - (t.img ? t.img.height * PX + 20 : 150);
          G.cursor(x - 40, y + 60);
          var tw = G.measure(t.name, 22, true) + 40;
          G.window(x - tw / 2, y - 6, tw, 40);
          G.text(t.name, x, y + 3, { size: 22, bold: true, align: 'center', color: t.side === 'enemy' ? '#f0c0a0' : G.COL.gold });
        }
      };
      UI.push(w);
    });
  }

  // the hero's own skills (js/data/skills.js): skill N uses the level-N charges, and opens once there are any
  function skillsOf(u) {
    if (u.side !== 'party' || !u.mp) return [];
    var max = S.maxMp(u.id);
    return (WM.data.skills[u.id] || []).map(function (sk, i) { return Object.assign({ lvl: i + 1 }, sk); })
      .filter(function (sk) { return max[sk.lvl - 1] > 0; });
  }
  B.skillsOf = skillsOf;
  function magical(sk) { return sk.effect !== 'phys'; }

  // what a skill reaches, in a few words, ahead of its description
  function reach(sp) {
    var who = { enemy1: 'One enemy', enemyAll: 'All enemies', ally1: 'One ally', allyAll: 'The party', allyKO: 'A fallen ally', self: 'Self' }[sp.target] || '';
    if (sp.hits > 1) who = sp.scatter ? sp.hits + ' blows at random' : who + ', ' + sp.hits + ' blows';
    if (sp.status && sp.effect === 'phys') who += ', may ' + ({ sleep: 'stun', poison: 'poison', silence: 'silence' }[sp.status] || sp.status);
    return who;
  }
  function pickSpell(bt, u, spells) {
    var items = spells.map(function (sp) {
      var hush = u.status.silence && magical(sp);
      return { label: sp.name, right: u.mp[sp.lvl - 1], disabled: u.mp[sp.lvl - 1] <= 0 || hush, help: hush ? 'Silenced.' : reach(sp) + ' — ' + sp.desc };
    });
    return UI.choose(items, { x: 250, y: 120, w: 460, help: true, title: 'Skills' }).then(function (k) { return k < 0 ? null : spells[k]; });
  }
  function pickItem(bt, u) {
    var inv = S.invList(function (it) { return it.battle; });
    var items = inv.map(function (e) { return { label: e.it.name, right: e.n, help: e.it.desc }; });
    return UI.choose(items, { x: 250, y: 60, w: 420, help: true, title: 'Items', rows: 7 }).then(function (k) { return k < 0 ? null : inv[k]; });
  }

  function availableUnites(bt, u, used) {
    var inParty = {};
    bt.party.forEach(function (p) { if (p.hp > 0 && !p.status.sleep && !used[p.id]) inParty[p.id] = p; });
    return (WM.data.unites || []).filter(function (un) {
      if (un.members.indexOf(u.id) < 0) return false;
      return un.members.every(function (m) { return inParty[m]; });
    });
  }

  // ---------- executing a round ----------
  async function executeRound(bt, cmds) {
    var acts = cmds.slice();
    // guests act automatically
    bt.guests.forEach(function (g) { if (g.hp > 0) acts.push({ u: g, type: 'attack', target: null }); });
    // enemies choose
    bt.enemies.forEach(function (e) { if (e.hp > 0) acts.push(enemyChoice(bt, e)); });
    // order by speed with jitter; defend resolves first
    acts.forEach(function (a) {
      var spd = a.type === 'unite' ? Math.min.apply(null, a.unite.members.map(function (m) { var p = bt.party.filter(function (x) { return x.id === m; })[0]; return p ? p.spd : 0; })) : a.u.spd;
      a.ord = a.type === 'defend' ? 9999 : spd + Math.random() * (spd * 0.35 + 6);
    });
    acts.sort(function (x, y) { return y.ord - x.ord; });
    for (var i = 0; i < acts.length; i++) {
      var a = acts[i];
      if (a.u.hp <= 0) continue;
      if (a.u.status.sleep) { pop(a.u, 'Asleep', '#a0a0ff'); await WM.wait(0.3); continue; }
      if (a.u.status.unbalanced) { delete a.u.status.unbalanced; pop(a.u, 'Unbalanced', '#d0d0d0'); await WM.wait(0.35); continue; }
      if (!living(bt.enemies).length || !living(bt.party).length) break;
      await perform(bt, a);
      await WM.wait(0.08);
    }
    // end of round: poison, buff decay
    var all = bt.party.concat(bt.guests, bt.enemies);
    for (i = 0; i < all.length; i++) {
      var u = all[i];
      if (u.hp <= 0) continue;
      if (u.status.poison) { var pd = Math.max(1, Math.round(u.mhp * 0.08)); u.hp = Math.max(1, u.hp - pd); pop(u, pd, '#c080ff'); }
      ['atkUp', 'defUp', 'silence'].forEach(function (k) { if (u.status[k]) { u.status[k]--; if (u.status[k] <= 0) delete u.status[k]; } });
      if (u.status.sleep && Math.random() < 0.3) delete u.status.sleep;
    }
    if (all.some(function (u) { return u.status.poison; })) await WM.wait(0.4);
  }

  function enemyChoice(bt, e) {
    var d = e.def;
    var skills = d.skills || [];
    var r = Math.random();
    for (var i = 0; i < skills.length; i++) {
      var sk = skills[i];
      if (sk.hpBelow && e.hp / e.mhp > sk.hpBelow) continue;
      if (r < sk.chance) return { u: e, type: 'skill', skill: sk };
      r -= sk.chance;
    }
    if (!canAttack(e)) return { u: e, type: 'defend' };
    return { u: e, type: 'attack', target: null };
  }

  function retarget(u, t) {
    if (t && t.hp > 0 && canReach(u, t)) return t;
    var pool = foes(u).filter(function (x) { return canReach(u, x); });
    if (!pool.length) return null;
    // enemies favour the front row a little
    return U.pick(pool);
  }

  async function perform(bt, a) {
    var u = a.u;
    var dirX = u.side === 'party' ? -1 : 1;
    if (a.type === 'defend') { u.defending = true; return; }
    if (a.type === 'attack') {
      var t = retarget(u, a.target);
      if (!t) return;
      var dx = (t.pos[0] - u.pos[0]) * (u.range === 'L' ? 0.15 : 0.55), dy = (t.pos[1] - u.pos[1]) * (u.range === 'L' ? 0.15 : 0.55);
      await tweenAnim(u, dx, dy, 0.16);
      var res = physDamage(u, t);
      var weaponFx = u.side === 'party' ? S.weapon(u.id).fx : (u.def.fx);
      if (u.range === 'L' && (weaponFx === 'arrow' || weaponFx === 'stone')) { fx(weaponFx, t.pos[0], t.pos[1] - 50, { from: [u.pos[0] + dx, u.pos[1] - 50 + dy] }); WM.audio.sfx('arrow'); await WM.wait(0.18); }
      if (res.miss) { WM.audio.sfx('miss'); pop(t, 'Miss', '#c0c0c0'); }
      else {
        fx(weaponFx === 'claw' ? 'claw' : weaponFx === 'blunt' ? 'blunt' : 'slash', t.pos[0], t.pos[1] - 50, { flip: dirX > 0 });
        WM.audio.sfx(res.crit ? 'crit' : 'hit');
        if (res.crit) { G.shake = 2; pop(t, res.dmg, '#ffd040', true); } else pop(t, res.dmg, '#ffffff');
        applyDamage(t, res.dmg);
      }
      await WM.wait(0.18);
      await tweenAnim(u, 0, 0, 0.14);
      return;
    }
    if (a.type === 'tal') { if (a.spell.effect === 'phys') await useArt(bt, u, a.spell, a.target); else await castSpell(bt, u, a.spell, a.target); return; }
    if (a.type === 'item') { await useItem(bt, u, a.item, a.target); return; }
    if (a.type === 'unite') { await doUnite(bt, a.unite); return; }
    if (a.type === 'skill') { await enemySkill(bt, u, a.skill); return; }
  }

  async function castSpell(bt, u, sp, target) {
    if (!sp.free) {
      if (u.mp[sp.lvl - 1] <= 0) { pop(u, 'No charges', '#c0c0c0'); return; }
      u.mp[sp.lvl - 1]--;
    }
    await banner(sp.name);
    u.anim.glow = 0.6;
    WM.audio.sfx('magic');
    await WM.wait(0.3);
    var targets;
    var tt = sp.target;
    if (tt === 'enemy1') targets = [target && target.hp > 0 ? target : U.pick(living(foes(u)))].filter(Boolean);
    else if (tt === 'enemyAll') targets = living(foes(u));
    else if (tt === 'ally1') targets = [target && target.hp > 0 ? target : u];
    else if (tt === 'allyKO') targets = [target];
    else if (tt === 'allyAll') targets = living(allies(u));
    else if (tt === 'self') targets = [u];
    else targets = [];
    WM.audio.sfx(sp.element || 'magic');
    targets.forEach(function (t) { if (t) fx(sp.element || 'magic', t.pos[0], t.pos[1] - 50, { dur: 0.7 }); });
    if (sp.screen) { G.flash = 0.6; G.shake = 3; }
    await WM.wait(0.45);
    targets.forEach(function (t) {
      if (!t) return;
      if (sp.effect === 'damage') { var d = magicDamage(u, t, sp.power, sp.element); pop(t, d, '#ffb070'); applyDamage(t, d); if (sp.status && t.hp > 0 && Math.random() < (sp.statusChance || 0.5)) { t.status[sp.status] = 3; pop(t, statusName(sp.status), '#c0a0ff'); } }
      else if (sp.effect === 'heal') { if (sp.cure) t.status = {}; applyHeal(t, Math.round(sp.power * (1 + u.mgc / 80))); }
      else if (sp.effect === 'revive') { if (t.hp <= 0) { t.hp = Math.round(t.mhp * (sp.power || 0.5)); pop(t, 'Revived', '#7fe07a'); } else applyHeal(t, Math.round(t.mhp * 0.5)); }
      else if (sp.effect === 'cure') { t.status = {}; pop(t, 'Cured', '#7fe07a'); if (sp.power) applyHeal(t, Math.round(sp.power * (1 + u.mgc / 80))); }
      else if (sp.effect === 'status') { if (Math.random() < (sp.statusChance || 0.6) && !(t.def && t.def.boss && sp.status === 'sleep')) { t.status[sp.status] = 3; pop(t, statusName(sp.status), '#c0a0ff'); } else pop(t, 'Resisted', '#c0c0c0'); }
      else if (sp.effect === 'buff') { t.status[sp.status] = sp.turns || 3; if (sp.also) t.status[sp.also] = sp.turns || 3; pop(t, statusName(sp.status), '#a0e0ff'); }
    });
    await WM.wait(0.5);
  }
  // a weapon skill: one or more blows at `power` times a normal attack
  async function useArt(bt, u, sk, target) {
    if (u.mp[sk.lvl - 1] <= 0) { pop(u, 'No uses left', '#c0c0c0'); return; }
    u.mp[sk.lvl - 1]--;
    await banner(sk.name);
    u.anim.glow = 0.5;
    var pool = function () { return living(foes(u)); };
    var single = sk.target === 'enemy1';
    var first = single ? (target && target.hp > 0 ? target : U.pick(pool())) : null;
    if (single && !first) return;
    var dirX = u.side === 'party' ? -1 : 1, near = !sk.shot && u.range !== 'L';
    var aim = first || { pos: [u.pos[0] + dirX * 160, u.pos[1]] };
    var dx = (aim.pos[0] - u.pos[0]) * (near ? 0.55 : 0.15), dy = (aim.pos[1] - u.pos[1]) * (near ? 0.55 : 0.15);
    await tweenAnim(u, dx, dy, 0.16);
    if (sk.screen) { G.flash = 0.5; G.shake = 3; }
    var hits = sk.hits || 1;
    for (var h = 0; h < hits; h++) {
      var targets = single ? [sk.scatter ? U.pick(pool()) : first] : pool();
      targets = targets.filter(function (t) { return t && t.hp > 0; });
      if (!targets.length && single && !sk.scatter) targets = [U.pick(pool())].filter(Boolean);   // the first one fell: go on to the next
      if (!targets.length) break;
      if (sk.shot) { targets.forEach(function (t) { fx(sk.shot, t.pos[0], t.pos[1] - 50, { from: [u.pos[0] + dx, u.pos[1] - 50 + dy] }); }); WM.audio.sfx('arrow'); await WM.wait(0.16); }
      var anyCrit = false;
      targets.forEach(function (t) {
        var r = physDamage(u, t, sk.power, sk);
        if (r.miss) { pop(t, 'Miss', '#c0c0c0'); return; }
        fx(sk.fx || (sk.shot ? 'burst' : 'slash'), t.pos[0], t.pos[1] - 50, { flip: dirX > 0 });
        if (r.crit) anyCrit = true;
        pop(t, r.dmg, r.crit ? '#ffd040' : '#ffe0a0', r.crit);
        applyDamage(t, r.dmg);
        if (sk.status && t.hp > 0 && Math.random() < (sk.statusChance || 0.5) && !(t.def && t.def.boss && sk.status === 'sleep' && Math.random() < 0.6)) { t.status[sk.status] = sk.status === 'sleep' ? 1 : 3; pop(t, statusName(sk.status), '#c0a0ff'); }
      });
      WM.audio.sfx(anyCrit ? 'crit' : 'hit');
      if (anyCrit) G.shake = 2;
      await WM.wait(hits > 1 ? 0.2 : 0.3);
    }
    if (sk.selfStatus) { u.status[sk.selfStatus] = 3; pop(u, statusName(sk.selfStatus), '#a0e0ff'); }
    await tweenAnim(u, 0, 0, 0.14);
    await WM.wait(0.2);
  }
  function statusName(s) { return { poison: 'Poison', sleep: 'Sleep', silence: 'Silence', atkUp: 'Power Up', defUp: 'Guard Up', unbalanced: 'Unbalanced' }[s] || s; }

  async function useItem(bt, u, itemId, target) {
    var it = WM.data.items[itemId];
    if (S.count(itemId) <= 0) { pop(u, 'None left', '#c0c0c0'); return; }
    S.take(itemId, 1);
    await banner(it.name);
    WM.audio.sfx(it.sfx || 'heal');
    var targets = it.battle === 'allyAll' ? living(allies(u)) : it.battle === 'enemyAll' ? living(foes(u)) : [target && (target.hp > 0 || it.battle === 'allyKO') ? target : (it.battle === 'enemy1' ? U.pick(living(foes(u))) : u)];
    targets.forEach(function (t) {
      if (!t) return;
      fx(it.fx || 'heal', t.pos[0], t.pos[1] - 50);
      var e = it.effect || {};
      if (e.revive && t.hp <= 0) { t.hp = Math.round(t.mhp * e.revive); pop(t, 'Revived', '#7fe07a'); }
      if (e.heal && t.hp > 0) applyHeal(t, e.heal === 'full' ? t.mhp : e.heal);
      if (e.cure) { e.cure.forEach(function (k) { delete t.status[k]; }); pop(t, 'Cured', '#7fe07a'); }
      if (e.status) { if (!(t.def && t.def.boss) && Math.random() < (e.chance || 0.75)) { t.status[e.status] = 3; pop(t, statusName(e.status), '#c0a0ff'); } else pop(t, 'Resisted', '#c0c0c0'); }
      if (e.damage) { var d = Math.round(e.damage * (0.9 + Math.random() * 0.2)); pop(t, d, '#ffb070'); applyDamage(t, d); }
      if (e.buff) { t.status[e.buff] = 3; pop(t, statusName(e.buff), '#a0e0ff'); }
      if (e.mp && t.mp && t.side === 'party') { var mm = S.maxMp(t.id); for (var i = 0; i < 4; i++) t.mp[i] = mm[i]; pop(t, 'Spirit restored', '#a0c0ff'); }
    });
    await WM.wait(0.45);
  }

  async function doUnite(bt, un) {
    var mem = un.members.map(function (m) { return bt.party.filter(function (p) { return p.id === m; })[0]; }).filter(Boolean);
    if (mem.some(function (m) { return m.hp <= 0; })) { pop(mem[0], 'Unite failed', '#c0c0c0'); return; }
    await banner(un.name, true);
    var targets = un.target === 'all' ? living(bt.enemies) : [U.pick(living(bt.enemies).filter(function (t) { return t.row === 0 || frontRowEmpty(bt.enemies); }) || living(bt.enemies))].filter(Boolean);
    if (!targets.length) return;
    var focus = targets[0];
    await Promise.all(mem.map(function (m, i) { return tweenAnim(m, (focus.pos[0] - m.pos[0]) * 0.5 + i * 12, (focus.pos[1] - m.pos[1]) * 0.4 - i * 8, 0.22); }));
    G.flash = 0.5; G.shake = 4;
    WM.audio.sfx(un.sfx || 'crit');
    targets.forEach(function (t) { fx(un.fx || 'burst', t.pos[0], t.pos[1] - 50, { dur: 0.8 }); });
    await WM.wait(0.4);
    var atk = 0; mem.forEach(function (m) { atk += m.atk; });
    targets.forEach(function (t) {
      var raw = atk * (un.mult || 1) * (0.9 + Math.random() * 0.2) - t.dfs * 0.5;
      var d = Math.max(1, Math.round(raw));
      pop(t, d, '#ffd040', true); applyDamage(t, d);
    });
    await WM.wait(0.45);
    await Promise.all(mem.map(function (m) { return tweenAnim(m, 0, 0, 0.2); }));
    if (un.unbalanced) mem.forEach(function (m) { m.status.unbalanced = 1; });
  }

  async function enemySkill(bt, u, sk) {
    await banner(sk.name);
    var pool = living(bt.party.concat(bt.guests));
    if (!pool.length) return;
    var targets = sk.target === 'all' ? pool : sk.target === 'self' ? [u] : sk.target === 'allyAll' ? living(bt.enemies) : [U.pick(pool)];
    if (sk.type === 'phys') await tweenAnim(u, 60, -10, 0.15);
    WM.audio.sfx(sk.sfx || sk.element || 'magic');
    targets.forEach(function (t) { fx(sk.fx || sk.element || 'slash', t.pos[0], t.pos[1] - 50, { dur: 0.6 }); });
    if (sk.screen) { G.flash = 0.5; G.shake = 3; }
    await WM.wait(0.4);
    targets.forEach(function (t) {
      if (sk.heal) { applyHeal(t, sk.heal); return; }
      if (sk.buff) { t.status[sk.buff] = 3; pop(t, statusName(sk.buff), '#a0e0ff'); return; }
      var d;
      if (sk.type === 'phys') { var r = physDamage(u, t, sk.power || 1.5); if (r.miss) { pop(t, 'Miss', '#c0c0c0'); return; } d = r.dmg; }
      else d = magicDamage(u, t, sk.power || 40, sk.element);
      if (d) { pop(t, d, '#ffb070'); applyDamage(t, d); }
      if (sk.status && t.hp > 0 && Math.random() < (sk.statusChance || 0.4)) { t.status[sk.status] = 3; pop(t, statusName(sk.status), '#c0a0ff'); }
    });
    await WM.wait(0.35);
    if (sk.type === 'phys') await tweenAnim(u, 0, 0, 0.15);
  }

  function banner(text, big) {
    B.cur.banner = { text: text, t: 0, big: big };
    return WM.wait(0.55).then(function () { B.cur.banner = null; });
  }

  // ---------- finish ----------
  async function finish(bt, result) {
    // write HP / MP / status back
    bt.party.forEach(function (u) { var c = WM.state.chars[u.id]; c.hp = u.hp; c.status = u.status.poison ? { poison: 1 } : {}; });
    if (result === 'win') {
      WM.audio.play('victory');
      var gold = 0, drops = [], expTotal = {};
      bt.enemies.forEach(function (e) {
        gold += e.def.gold || 0;
        (e.def.drops || []).forEach(function (dr) { if (Math.random() < dr[1]) drops.push(dr[0]); });
      });
      var gains = [];
      bt.party.forEach(function (u) {
        if (u.hp <= 0) { gains.push({ u: u, exp: 0 }); return; }
        var c = WM.state.chars[u.id], ex = 0;
        bt.enemies.forEach(function (e) { ex += S.expFor(c.lv, e.lv, e.def.exp || 60); });
        ex = Math.min(1000, Math.round(ex / Math.max(1, Math.sqrt(bt.enemies.length) * 0.9)));
        var up = S.gainExp(u.id, ex);
        gains.push({ u: u, exp: ex, up: up, lv: c.lv });
      });
      WM.state.gold += gold;
      drops.forEach(function (d) { S.give(d, 1); });
      await victoryScreen(bt, gold, drops, gains);
    } else if (result === 'lose' || result === 'timeout') {
      if (bt.opt.canLose || result === 'timeout') {
        // keep party alive at 1 HP for story losses
        bt.party.forEach(function (u) { WM.state.chars[u.id].hp = Math.max(1, WM.state.chars[u.id].hp); });
      }
    }
    // fade back to the previous scene
    await WM.fadeOut(0.3);
    B.cur = null;
    if (bt.prevScene && bt.prevScene !== SCN) { WM.setScene(bt.prevScene, null, true); if (bt.prevScene.resume) bt.prevScene.resume(); }
    if (bt.prevMusic && bt.prevMusic !== 'battle' && bt.prevMusic !== 'boss') WM.audio.play(bt.prevMusic);
    else if (WM.field.map) { var mus = WM.field.map.def.music; WM.audio.play(typeof mus === 'function' ? mus(S) : mus); }
    if (result === 'lose' && !bt.opt.canLose) { bt.resolve('lose'); return; }
    WM.fadeIn(0.3);
    bt.resolve(result);
  }

  function victoryScreen(bt, gold, drops, gains) {
    return new Promise(function (resolve) {
      var t0 = WM.time;
      var w = {
        update: function () { if (WM.time - t0 > 0.6 && (I.pressed('ok') || I.pressed('cancel'))) { I.clear(); UI.remove(w); resolve(); } },
        draw: function () {
          // the banner is as tall as its lines (no "0 taels"); the EXP tags never sit on it
          var lines = [];
          if (gold > 0) lines.push({ t: 'Got ' + gold + ' taels', size: 22, col: G.COL.text });
          if (drops.length) lines.push({ t: 'Found: ' + drops.map(function (d) { return WM.data.items[d].name; }).join(', '), size: 20, col: '#bfe0ff' });
          var bottom = 70 + 52 + lines.length * 32;
          G.window(200, 70, 560, bottom - 70);
          G.text('Victory', 480, 82, { size: 30, bold: true, align: 'center', color: G.COL.gold });
          lines.forEach(function (l, i) { G.text(l.t, 480, 120 + i * 32, { size: l.size, align: 'center', color: l.col }); });
          gains.forEach(function (g) {
            var x = g.u.pos[0], y = g.u.pos[1] - 140;
            if (y - 6 < bottom + 8) y = g.u.pos[1] + 12;   // no room above the head: show it at the feet
            if (g.u.hp <= 0) return;
            var tx = g.up ? 'LV UP! ' + g.lv : '+' + g.exp + ' EXP';
            var tw = G.measure(tx, 20, true) + 24;
            G.window(x - tw / 2, y - 6, tw, 36, { top: g.up ? '#5a3a10' : '#1d2846' });
            G.text(tx, x, y + 2, { size: 20, bold: true, align: 'center', color: g.up ? '#ffe080' : G.COL.text });
            if (g.up && !g.sfx) { g.sfx = 1; WM.audio.sfx('levelup'); }
          });
        }
      };
      UI.push(w);
    });
  }

  // ---------- drawing ----------
  SCN.update = function (dt) { tick(dt); };
  SCN.updateBackground = function (dt) { tick(dt); };
  function tick(dt) {
    var bt = B.cur; if (!bt) return;
    bt.pops.forEach(function (p) { p.t += dt; });
    bt.pops = bt.pops.filter(function (p) { return p.t < 1.1; });
    bt.fx.forEach(function (f) { f.t += dt; });
    bt.fx = bt.fx.filter(function (f) { return f.t < f.dur; });
    bt.party.concat(bt.enemies, bt.guests).forEach(function (u) {
      if (u.anim.flash > 0) u.anim.flash -= dt;
      if (u.anim.shake > 0) u.anim.shake -= dt;
      if (u.anim.glow > 0) u.anim.glow -= dt;
    });
    if (bt.banner) bt.banner.t += dt;
  }

  SCN.draw = function () {
    var bt = B.cur; if (!bt) return;
    var c = G.ctx;
    c.imageSmoothingEnabled = false;
    WM.util.drawArt(c, bt.bg, 0, 0, 240, 130, 0, 0, 960, 520);
    // draw units sorted by y
    var units = bt.party.concat(bt.enemies, bt.guests).slice().sort(function (a, b) { return a.pos[1] - b.pos[1]; });
    units.forEach(function (u) { drawUnit(u, bt); });
    drawFx(bt);
    // pops
    bt.pops.forEach(function (p) {
      var k = p.t;
      var y = p.y - Math.min(1, k * 4) * 24 + (k > 0.25 ? 0 : 0);
      var a = k > 0.8 ? 1 - (k - 0.8) / 0.3 : 1;
      c.globalAlpha = Math.max(0, a);
      G.text(p.text, p.x, y, { size: p.big ? 36 : 28, bold: true, align: 'center', color: p.col });
      c.globalAlpha = 1;
    });
    if (bt.banner) {
      var bw = G.measure(bt.banner.text, bt.banner.big ? 30 : 24, true) + 80;
      G.window((960 - bw) / 2, 20, bw, bt.banner.big ? 60 : 50, bt.banner.big ? { top: '#5a2a10', bottom: '#2a1006' } : null);
      G.text(bt.banner.text, 480, bt.banner.big ? 34 : 32, { size: bt.banner.big ? 30 : 24, bold: true, align: 'center', color: bt.banner.big ? '#ffe0a0' : G.COL.text });
    }
    drawPanel(bt);
  };

  function drawUnit(u, bt) {
    var c = G.ctx;
    var x = Math.round(u.pos[0] + u.anim.ox + (u.anim.shake > 0 ? (Math.random() - 0.5) * 8 : 0));
    var y = Math.round(u.pos[1] + u.anim.oy);
    var ko = u.hp <= 0;
    if (u.side === 'enemy' && ko && u.anim.alpha <= 0.01) return;
    c.save();
    c.globalAlpha = u.side === 'enemy' ? u.anim.alpha : 1;
    // shadow
    c.fillStyle = 'rgba(0,0,0,0.3)';
    c.beginPath(); c.ellipse(x, y, u.img ? u.img.width / (u.img.artScale || 1) * PX * 0.35 : 26, 8, 0, 0, 7); c.fill();
    if (u.img) {
      var iw = u.img.width / (u.img.artScale || 1) * PX, ih = u.img.height / (u.img.artScale || 1) * PX;
      var bob = Math.round(Math.sin(WM.time * 3 + u.idx) * 2);
      c.drawImage(u.img, 0, 0, u.img.width, u.img.height, x - iw / 2, y - ih + bob, iw, ih);
      if (u.anim.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.6; c.drawImage(u.img, 0, 0, u.img.width, u.img.height, x - iw / 2, y - ih + bob, iw, ih); c.globalCompositeOperation = 'source-over'; }
    } else {
      var sh = u.sheet;
      var cw = sh.isOverride ? sh.cw : WM.sprites.CW, ch = sh.isOverride ? sh.ch : WM.sprites.CH;
      var row = u.side === 'party' ? 1 : 2; // party faces left, enemies right
      var frame = 0;
      if (Math.abs(u.anim.ox) > 2) frame = Math.floor(WM.time * 8) % 2 ? 1 : 2;
      if (ko) {
        c.translate(x, y - 10); c.rotate(u.side === 'party' ? Math.PI / 2 : -Math.PI / 2);
        WM.util.drawArt(c, sh, 0, 1 * ch, cw, ch, -cw * PXH / 2, -(sh.isOverride ? ch : WM.sprites.FOOT) * PXH + 30, cw * PXH, ch * PXH);
        G.base();
      } else {
        var bob2 = u.status.sleep ? 0 : Math.round(Math.sin(WM.time * 4 + u.idx * 1.3) * 1.5);
        WM.util.drawArt(c, sh, frame * cw, row * ch, cw, ch, x - cw * PXH / 2, y - (sh.isOverride ? ch : WM.sprites.FOOT) * PXH + 5 + bob2, cw * PXH, ch * PXH);
        if (u.anim.flash > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.7; WM.util.drawArt(c, sh, frame * cw, row * ch, cw, ch, x - cw * PXH / 2, y - ch * PXH + 5, cw * PXH, ch * PXH); c.globalCompositeOperation = 'source-over'; }
        if (u.anim.glow > 0) { c.globalAlpha = 0.5; c.fillStyle = '#ffe8a0'; c.beginPath(); c.ellipse(x, y - 40, 40, 60, 0, 0, 7); c.fill(); }
      }
    }
    c.restore();
    var top = u.img ? u.img.height * PX : 125;
    if (bt.active === u) { G.cursor(x - 14, y - top - 14 + Math.sin(WM.time * 6) * 3); }
    if (u.defending && !ko) G.text('Guard', x, y - top - 20, { size: 16, align: 'center', color: '#a0d0ff' });
    if (u.status.sleep && !ko) G.text('z z', x + 20, y - top - (WM.time * 20 % 20), { size: 20, color: '#c0c0ff' });
    // enemy HP bar (thin, like S2's damage readout we show only when hurt)
    if (u.side === 'enemy' && !ko && u.hp < u.mhp) G.bar(x - 30, y + 6, 60, 6, u.hp / u.mhp, G.hpColor(u.hp / u.mhp));
  }

  function drawFx(bt) {
    var c = G.ctx;
    bt.fx.forEach(function (f) {
      var k = f.t / f.dur;
      c.save();
      switch (f.kind) {
        case 'slash': case 'claw':
          c.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; c.lineWidth = f.kind === 'claw' ? 4 : 6;
          var n = f.kind === 'claw' ? 3 : 1;
          for (var i = 0; i < n; i++) { c.beginPath(); var off = (i - (n - 1) / 2) * 16; c.moveTo(f.x - 40 + off, f.y - 40); c.lineTo(f.x - 40 + off + 80 * Math.min(1, k * 3), f.y - 40 + 80 * Math.min(1, k * 3)); c.stroke(); }
          break;
        case 'blunt': case 'burst':
          c.fillStyle = 'rgba(255,240,180,' + (1 - k) + ')';
          for (i = 0; i < 8; i++) { var an = i / 8 * Math.PI * 2, r = 10 + k * (f.kind === 'burst' ? 90 : 50); c.fillRect(f.x + Math.cos(an) * r - 4, f.y + Math.sin(an) * r - 4, 8, 8); }
          if (f.kind === 'burst') { c.strokeStyle = 'rgba(255,200,80,' + (1 - k) + ')'; c.lineWidth = 6; c.beginPath(); c.arc(f.x, f.y, k * 110, 0, 7); c.stroke(); }
          break;
        case 'arrow': case 'stone':
          var from = f.opt.from || [f.x + 200, f.y];
          var px = from[0] + (f.x - from[0]) * Math.min(1, k * 2.5), py = from[1] + (f.y - from[1]) * Math.min(1, k * 2.5) - Math.sin(Math.min(1, k * 2.5) * Math.PI) * 30;
          if (f.kind === 'arrow') { c.strokeStyle = '#e8e0d0'; c.lineWidth = 3; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 24, py - 4); c.stroke(); }
          else { c.fillStyle = '#9a9a92'; c.fillRect(px - 5, py - 5, 10, 10); }
          break;
        case 'fire':
          for (i = 0; i < 14; i++) { var fx2 = f.x + Math.sin(i * 7.3) * 40, fy = f.y + 40 - (k * 120 + i * 9) % 100; c.fillStyle = i % 2 ? 'rgba(255,140,40,' + (1 - k) + ')' : 'rgba(255,220,80,' + (1 - k) + ')'; c.fillRect(fx2 - 6, fy - 10, 12, 18); }
          break;
        case 'thunder':
          c.strokeStyle = 'rgba(255,255,160,' + (1 - k) + ')'; c.lineWidth = 6; c.beginPath();
          var lx = f.x, ly = f.y - 300; c.moveTo(lx, ly);
          for (i = 0; i < 8; i++) { lx = f.x + (Math.random() - 0.5) * 50; ly += 40; c.lineTo(lx, ly); } c.stroke();
          break;
        case 'water': case 'heal':
          for (i = 0; i < 12; i++) { var hx = f.x + Math.sin(i * 2.4) * 40, hy = f.y + 40 - k * 100 - (i % 4) * 14; c.fillStyle = f.kind === 'heal' ? 'rgba(160,255,170,' + (1 - k) + ')' : 'rgba(140,200,255,' + (1 - k) + ')'; c.fillRect(hx - 3, hy - 3, 6, 6); }
          break;
        case 'wind':
          c.strokeStyle = 'rgba(220,255,230,' + (1 - k) + ')'; c.lineWidth = 3;
          for (i = 0; i < 4; i++) { c.beginPath(); c.arc(f.x, f.y, 20 + i * 14 + k * 30, k * 8 + i, k * 8 + i + 2.2); c.stroke(); }
          break;
        case 'earth':
          c.fillStyle = 'rgba(140,110,70,' + (1 - k) + ')';
          for (i = 0; i < 10; i++) c.fillRect(f.x + Math.sin(i * 3.1) * 50 - 6, f.y + 40 - Math.abs(Math.sin(k * 6 + i)) * 60, 12, 12);
          break;
        case 'dark': case 'magic':
          c.fillStyle = f.kind === 'dark' ? 'rgba(120,40,160,' + (1 - k) * 0.6 + ')' : 'rgba(255,230,140,' + (1 - k) * 0.6 + ')';
          c.beginPath(); c.arc(f.x, f.y, 20 + k * 60, 0, 7); c.fill();
          break;
        case 'sand':
          c.fillStyle = 'rgba(200,170,90,' + (1 - k) * 0.8 + ')';
          for (i = 0; i < 30; i++) c.fillRect(f.x - 120 + ((i * 37 + k * 400) % 240), f.y - 60 + (i * 13) % 120, 5, 3);
          break;
      }
      c.restore();
    });
  }

  function drawPanel(bt) {
    var c = G.ctx;
    // party status panel: two rows of three, mirroring the formation
    G.window(8, 524, 944, 190, { alpha: 0.95 });
    for (var i = 0; i < 6; i++) {
      var u = bt.party[i];
      var col = i % 3, row = i < 3 ? 0 : 1;
      var x = 22 + col * 310, y = 536 + row * 88;
      if (!u) { G.text('—', x + 140, y + 28, { size: 22, color: '#555', align: 'center' }); continue; }
      var active = bt.active === u || bt.targeting === u;
      if (active) { c.fillStyle = 'rgba(216,179,106,0.25)'; c.fillRect(x - 4, y - 4, 302, 82); }
      // face crop
      var img = WM.portraits.get(u.id, u.hp <= 0 ? 'sad' : 'normal');
      c.save(); c.beginPath(); c.rect(x, y, 64, 72); c.clip();
      c.fillStyle = '#26304a'; c.fillRect(x, y, 64, 72);
      if (img.isOverride) WM.portraits.drawOverride(img, x, y, 64, 72);
      else c.drawImage(img, 8, 4, 32, 36, x, y, 64, 72);
      if (u.hp <= 0) { c.fillStyle = 'rgba(80,0,0,0.5)'; c.fillRect(x, y, 64, 72); }
      c.restore();
      c.strokeStyle = G.COL.goldD; c.lineWidth = 2; c.strokeRect(x, y, 64, 72);
      G.text(u.name, x + 74, y + 2, { size: 20, bold: true, color: u.hp <= 0 ? '#c06050' : G.COL.text });
      var fr = u.hp / u.mhp;
      G.text(u.hp + '/' + u.mhp, x + 286, y + 26, { size: 18, align: 'right', color: G.hpColor(fr) });
      G.bar(x + 74, y + 50, 212, 9, fr, G.hpColor(fr));
      // skill uses, one count per skill level
      var arts = skillsOf(u);
      if (arts.length) {
        var mm = u.mp, s2 = '';
        for (var k = 0; k < arts.length; k++) s2 += (k ? '/' : '') + mm[k];
        s2 = 'Uses ' + s2;
        G.text(s2, x + 74, y + 26, { size: 16, color: '#a0c0ff' });
      }
      var stt = Object.keys(u.status).filter(function (k2) { return ['poison', 'sleep', 'silence', 'atkUp', 'defUp'].indexOf(k2) >= 0; });
      if (stt.length) G.text(stt.map(statusName).join(' '), x + 74, y + 62, { size: 14, color: '#d0a0ff' });
    }
  }

  B.makeBg = makeBg;
})();
