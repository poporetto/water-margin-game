// Field scene: tile maps, free 8-direction movement (as in Suikoden II), NPCs, events, exits, encounters.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, T = WM.tiles, SP = WM.sprites;
  var TS = 16;

  var F = WM.field = {};
  WM.scenes.field = F;
  F.countsTime = true;

  // ---------- map loading ----------
  function buildMap(id) {
    var def = WM.data.maps[id];
    if (!def) throw new Error('No map ' + id);
    var rows;
    if (typeof def.rows === 'function') {
      var rk = def.cacheKey ? def.cacheKey() : 'static';
      if (!def._rows || def._rowsKey !== rk) { def._rows = def.rows(); def._rowsKey = rk; }
      rows = def._rows;
    } else rows = def.rows;
    var w = 0; rows.forEach(function (r) { w = Math.max(w, r.length); });
    var m = {
      id: id, def: def, rows: rows, w: w, h: rows.length, theme: def.theme || 'spring', interior: !!def.interior,
      get: function (x, y) {
        if (y < 0 || y >= this.h || x < 0 || x >= this.w) return this.def.edge || null;
        var ch = this.rows[y][x];
        return ch === undefined || ch === ' ' ? (this.def.fill || '.') : ch;
      }
    };
    var key = (def.cacheKey ? def.cacheKey() : 'static') + '|' + m.theme;
    if (!def._baked || def._bakedKey !== key) { def._baked = T.bake(m); def._bakedKey = key; }
    m.baked = def._baked;
    m.talls = [];
    if (m.interior) m.rooms = rooms(m);
    for (var y = 0; y < m.h; y++) for (var x = 0; x < m.w; x++) {
      var d = T.DEF[m.get(x, y)];
      if (d && d.tall) m.talls.push({ x: x, y: y, d: d });
    }
    return m;
  }
  F.buildMap = buildMap;
  // An interior map holds several rooms side by side, each walled off by void ('x'). Number them, so that only the
  // room the player stands in is drawn: the house next door is not visible through the wall.
  function rooms(m) {
    var id = new Int16Array(m.w * m.h).fill(-1), n = 0;
    for (var sy = 0; sy < m.h; sy++) for (var sx = 0; sx < m.w; sx++) {
      if (id[sy * m.w + sx] >= 0 || m.get(sx, sy) === 'x') continue;
      var q = [sx, sy]; id[sy * m.w + sx] = n;
      while (q.length) {
        var y0 = q.pop(), x0 = q.pop();
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          var x1 = x0 + d[0], y1 = y0 + d[1];
          if (x1 < 0 || y1 < 0 || x1 >= m.w || y1 >= m.h || id[y1 * m.w + x1] >= 0 || m.get(x1, y1) === 'x') return;
          id[y1 * m.w + x1] = n; q.push(x1, y1);
        });
      }
      n++;
    }
    return n > 1 ? id : null;
  }
  function roomAt(m, x, y) { return m.rooms && x >= 0 && y >= 0 && x < m.w && y < m.h ? m.rooms[y * m.w + x] : -1; }

  // ---------- actors ----------
  function Actor(o) {
    this.x = o.x; this.y = o.y; this.dir = o.dir || 'down';
    this.sheetId = o.sheetId; this.look = o.look;
    this.anim = 0; this.animT = 0; this.moving = false;
    this.path = []; this.speed = o.speed || 60;
    this.visible = o.visible !== false;
    this.ev = o.ev || null; this.solid = o.solid !== false;
    this.emote = null; this.emoteT = 0;
    this.wander = o.wander; this.wanderT = Math.random() * 3; this.home = { x: o.x, y: o.y };
    this.offY = 0; this.jump = 0;
    this.name = o.name;
    this.static = o.static; // e.g. lying down
  }
  Actor.prototype.sheet = function () { return SP.get(this.sheetId, this.look); };
  Actor.prototype.tile = function () { return { x: Math.floor(this.x / TS), y: Math.floor((this.y - 1) / TS) }; };

  function lookFor(ev) {
    if (ev.char) { var d = WM.data.chars[ev.char]; return { id: ev.char, look: d ? d.look : {} , name: d ? d.name : ev.char }; }
    if (ev.npc) { var n = WM.data.npcs[ev.npc]; if (!n) throw new Error('No npc ' + ev.npc); return { id: 'npc:' + ev.npc, look: n.look, name: n.name }; }
    if (ev.look) return { id: 'ev:' + ev.map + ':' + ev.id, look: ev.look, name: ev.name };
    return null;
  }

  F.evDone = function (ev) { return S.has('ev:' + ev.map + ':' + ev.id); };
  F.evActive = function (ev) {
    if (ev.once && F.evDone(ev)) return false;
    if (ev.cond && !ev.cond(S, WM.state)) return false;
    return true;
  };

  F.spawnActors = function () {
    F.actors = [];
    var evs = WM.data.events[F.map.id] || [];
    evs.forEach(function (ev) {
      if (!F.evActive(ev)) return;
      var lk = lookFor(ev);
      if (!lk) return;
      var a = new Actor({ x: ev.x * TS + 8, y: ev.y * TS + 15, dir: ev.dir || 'down', sheetId: lk.id, look: lk.look, ev: ev, wander: ev.wander, name: lk.name, speed: ev.speed });
      if (ev.hidden) a.visible = false;
      F.actors.push(a);
    });
  };

  // ---------- staging ----------
  // Characters an event places before its first line of dialogue are already in the room when the scene opens, so
  // they are set on the map as soon as the event becomes possible (on arrival, or when the story moves on) instead
  // of appearing when it fires. The event's own spawn() then finds them standing there.
  var SPAWN_RE = /s\.spawn\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*'(\w+)')?\s*\)/g;
  function leadSpawns(ev) {
    if (ev._lead) return ev._lead;
    var src = '', out = [];
    try { src = ev.run.toString(); } catch (e) {}
    var body = src.slice(src.indexOf('{') + 1), cut = body.search(/\bawait\b|s\.warp\(|s\.night\(|s\.tint\(/);
    var lead = cut >= 0 ? body.slice(0, cut) : body, m;
    SPAWN_RE.lastIndex = 0;
    while ((m = SPAWN_RE.exec(lead))) { if (lead.indexOf("'ghost:" + m[2] + "'") >= 0) continue; out.push({ key: m[1], who: m[2], x: +m[3], y: +m[4], dir: m[5] || 'down' }); }
    return (ev._lead = out);
  }
  // could this event fire on this map now, wherever the player stands?
  function couldFire(ev) {
    if (ev.once && F.evDone(ev)) return false;
    if (!ev.cond) return true;
    var st = WM.state, sx = st.x, sy = st.y, ok = false;
    try { ok = !!ev.cond(S, st); } catch (e) {}
    if (!ok && /\.x\b|\.y\b/.test(ev.cond.toString())) {
      for (var y = 0; y < F.map.h && !ok; y++) for (var x = 0; x < F.map.w && !ok; x++) {
        if (tileSolid(x, y)) continue;
        st.x = x; st.y = y; try { ok = !!ev.cond(S, st); } catch (e) {}
      }
      st.x = sx; st.y = sy;
    }
    return ok;
  }
  F.playing = [];   // events whose scripts are running now
  F.stage = function () {
    if (!F.map || F.map.def.world) return;
    var want = {};
    (WM.data.events[F.map.id] || []).forEach(function (ev) {
      if (!ev.run || ev.resident || !(ev.trigger === 'auto' || ev.trigger === 'touch' || ev.trigger === 'check')) return;
      if (F.playing.indexOf(ev) >= 0) return;   // a scene already under way (it may warp back into this room) does not set its stage again
      var lead = leadSpawns(ev); if (!lead.length || !couldFire(ev)) return;
      lead.forEach(function (sp) {
        if (want[sp.key] || (!WM.data.chars[sp.who] && !WM.data.npcs[sp.who])) return;
        want[sp.key] = sp;
      });
    });
    // drop staged characters whose scene can no longer happen; add the new ones
    F.actors = F.actors.filter(function (a) { return !(a.ev && a.ev.staged && !want[a.ev.id]); });
    Object.keys(want).forEach(function (k) {
      if (F.findActor(k)) return;
      var sp = want[k], a = F.addActor(k, sp.who, sp.x, sp.y, sp.dir);
      a.ev.staged = true; a.sheetWho = sp.who; a.solid = false;   // never in the way of the player walking up to their scene
    });
  };

  F.findActor = function (key) {
    for (var i = 0; i < F.actors.length; i++) {
      var a = F.actors[i];
      if (a.ev && (a.ev.id === key || a.ev.char === key || a.ev.npc === key)) return a;
    }
    if (key === 'player' || key === WM.state.leader) return F.player;
    return null;
  };

  // Temporary actor for cutscenes.
  F.addActor = function (key, charOrLook, tx, ty, dir) {
    var lk;
    if (typeof charOrLook === 'string') {
      if (WM.data.chars[charOrLook]) lk = { id: charOrLook, look: WM.data.chars[charOrLook].look };
      else if (WM.data.npcs[charOrLook]) lk = { id: 'npc:' + charOrLook, look: WM.data.npcs[charOrLook].look };
      else throw new Error('addActor: unknown ' + charOrLook);
    } else lk = { id: 'tmp:' + key, look: charOrLook };
    var a = new Actor({ x: tx * TS + 8, y: ty * TS + 15, dir: dir || 'down', sheetId: lk.id, look: lk.look, ev: { id: key, map: F.map.id, temp: true } });
    F.actors.push(a);
    return a;
  };
  F.addBeast = function (key, art, tx, ty, dir, params) {
    var a = new Actor({ x: tx * TS + 8, y: ty * TS + 15, dir: dir || 'right', sheetId: null, look: {}, ev: { id: key, map: F.map.id, temp: true } });
    a.img = WM.monsters.get(art, params);
    F.actors.push(a);
    return a;
  };
  F.removeActor = function (key) {
    F.actors = F.actors.filter(function (a) { return !(a.ev && (a.ev.id === key || a.ev.char === key || a.ev.npc === key)); });
  };

  // ---------- enter ----------
  F.enter = function (arg) {
    arg = arg || {};
    var st = WM.state;
    F.loadMap(arg.map || st.map, arg.x != null ? arg.x : st.x, arg.y != null ? arg.y : st.y, arg.dir || st.dir, arg.noAuto);
  };

  F.loadMap = function (id, tx, ty, dir, noAuto) {
    var st = WM.state;
    F.map = buildMap(id);
    st.map = id;
    var leader = st.leader || st.party[0];
    F.player = new Actor({ x: tx * TS + 8, y: ty * TS + 15, dir: dir || 'down', sheetId: leader, look: WM.data.chars[leader] ? WM.data.chars[leader].look : {} });
    F.player.isPlayer = true;
    st.x = tx; st.y = ty; st.dir = dir;
    F.spawnActors();
    F.stage();
    F.cam = { x: 0, y: 0 };
    F.updateCamera(true);
    F.encSteps = 0;
    F.nameBanner = { text: F.map.def.name, t: F.map.def.name ? 2.6 : 0 };
    F.snow = [];
    F.lastTile = F.player.tile();
    F.exitLock = true; // don't immediately re-trigger the exit we arrived on
    var mus = typeof F.map.def.music === 'function' ? F.map.def.music(S) : F.map.def.music;
    if (mus && !F.musicLocked) WM.audio.play(mus);
    if (!noAuto) F.pendingAuto = true;
    if (WM.state.party.length) F.player.sheetId = WM.state.leader;
  };

  F.setLeader = function (id) {
    WM.state.leader = id;
    if (F.player) { F.player.sheetId = id; F.player.look = WM.data.chars[id].look; }
  };

  // ---------- collision ----------
  function tileSolid(tx, ty) {
    var ch = F.map.get(tx, ty);
    if (ch === null) return true;
    return T.solid(ch);
  }
  F.tileSolid = function (tx, ty) { return tileSolid(tx, ty); };
  var HB_W = 5, HB_H = 4; // half-width, height of feet hitbox
  function blockedAt(a, x, y) {
    var x0 = Math.floor((x - HB_W) / TS), x1 = Math.floor((x + HB_W - 1) / TS);
    var y0 = Math.floor((y - HB_H) / TS), y1 = Math.floor((y - 1) / TS);
    for (var ty = y0; ty <= y1; ty++) for (var tx = x0; tx <= x1; tx++) if (tileSolid(tx, ty)) return true;
    if (a.isPlayer || a.solidVsActors) {
      for (var i = 0; i < F.actors.length; i++) {
        var o = F.actors[i];
        if (o === a || !o.visible || !o.solid) continue;
        if (Math.abs(o.x - x) < 11 && Math.abs(o.y - y) < 8) return true;
      }
    }
    if (!a.isPlayer && F.player && a.solid && !a.path.length) {
      if (Math.abs(F.player.x - x) < 11 && Math.abs(F.player.y - y) < 8) return true;
    }
    return false;
  }

  function tryMove(a, dx, dy) {
    var moved = false;
    if (dx) {
      if (!blockedAt(a, a.x + dx, a.y)) { a.x += dx; moved = true; }
      else if (!dy) { // corner assist: nudge around tile corners
        for (var k = 1; k <= 6; k++) {
          if (!blockedAt(a, a.x + dx, a.y - k) && !blockedAt(a, a.x, a.y - 1)) { a.y -= 1; moved = true; break; }
          if (!blockedAt(a, a.x + dx, a.y + k) && !blockedAt(a, a.x, a.y + 1)) { a.y += 1; moved = true; break; }
        }
      }
    }
    if (dy) {
      if (!blockedAt(a, a.x, a.y + dy)) { a.y += dy; moved = true; }
      else if (!dx) {
        for (k = 1; k <= 6; k++) {
          if (!blockedAt(a, a.x - k, a.y + dy) && !blockedAt(a, a.x - 1, a.y)) { a.x -= 1; moved = true; break; }
          if (!blockedAt(a, a.x + k, a.y + dy) && !blockedAt(a, a.x + 1, a.y)) { a.x += 1; moved = true; break; }
        }
      }
    }
    return moved;
  }

  // ---------- update ----------
  F.update = function (dt) {
    var st = WM.state;
    var scripting = WM.script.running;
    if (F.pendingAuto && !scripting) { F.pendingAuto = false; if (F.checkAuto()) return; }

    // player control
    var p = F.player;
    p.moving = false;
    if (!scripting && !F.transitioning) {
      if (I.pressed('menu') || I.pressed('cancel')) { I.clear(); WM.menu.open(); return; }
      if (I.pressed('debug') && WM.debug) { I.clear(); WM.debug.open(); return; }
      var mx = (I.down('right') ? 1 : 0) - (I.down('left') ? 1 : 0);
      var my = (I.down('down') ? 1 : 0) - (I.down('up') ? 1 : 0);
      if (mx || my) {
        var spd = (I.down('dash') ? 128 : 72) * (F.map.def.world ? 0.8 : 1);
        var len = Math.sqrt(mx * mx + my * my);
        var vx = mx / len * spd * dt, vy = my / len * spd * dt;
        if (mx && !my) p.dir = mx > 0 ? 'right' : 'left';
        else if (my && !mx) p.dir = my > 0 ? 'down' : 'up';
        else if (p.dir === 'up' || p.dir === 'down') p.dir = my > 0 ? 'down' : 'up';
        else p.dir = mx > 0 ? 'right' : 'left';
        // sub-pixel accumulation
        p.fx = (p.fx || 0) + vx; p.fy = (p.fy || 0) + vy;
        var ix = Math.trunc(p.fx), iy = Math.trunc(p.fy);
        p.fx -= ix; p.fy -= iy;
        var moved = false;
        var sx = Math.sign(ix), sy = Math.sign(iy);
        for (var i = 0; i < Math.max(Math.abs(ix), Math.abs(iy)); i++) {
          var ddx = i < Math.abs(ix) ? sx : 0, ddy = i < Math.abs(iy) ? sy : 0;
          if (tryMove(p, ddx, ddy)) moved = true;
        }
        p.moving = true;
        p.animSpeed = I.down('dash') ? 1.6 : 1;
        if (moved) {
          st.steps += 1 / 16;
          F.encSteps += Math.abs(ix) + Math.abs(iy);
          var t = p.tile();
          if (t.x !== F.lastTile.x || t.y !== F.lastTile.y) {
            F.lastTile = t; F.exitLock = false;
            if (F.onTileEnter(t)) return;
          }
          if (F.encSteps >= 16) { F.encSteps -= 16; if (F.rollEncounter()) return; }
        }
      }
      if (I.pressed('ok')) { I.clear(); F.interact(); }
    }

    // actors
    F.updateActors(dt);
    F.updateCamera();
  };
  F.updateBackground = function (dt) { F.updateActors(dt, true); };

  F.updateActors = function (dt, frozen) {
    var all = F.actors.concat([F.player]);
    for (var i = 0; i < all.length; i++) {
      var a = all[i];
      if (a.path.length) {
        var tgt = a.path[0];
        var dx = tgt.x - a.x, dy = tgt.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var step = a.speed * dt;
        if (Math.abs(dx) > Math.abs(dy)) a.dir = dx > 0 ? 'right' : 'left'; else if (dy) a.dir = dy > 0 ? 'down' : 'up';
        if (d <= step) { a.x = tgt.x; a.y = tgt.y; a.path.shift(); if (!a.path.length && a.onArrive) { var cb = a.onArrive; a.onArrive = null; cb(); } }
        else { a.x += dx / d * step; a.y += dy / d * step; }
        a.moving = true;
      } else if (a.wander && !WM.script.running && !frozen && !a.isPlayer) {
        a.wanderT -= dt;
        if (a.wanderT <= 0) {
          a.wanderT = 1.5 + Math.random() * 3;
          var dirs = [[1, 0, 'right'], [-1, 0, 'left'], [0, 1, 'down'], [0, -1, 'up']];
          var pick = U.pick(dirs);
          var nx = a.x + pick[0] * TS, ny = a.y + pick[1] * TS;
          if (Math.abs(nx - a.home.x) <= TS * 2 && Math.abs(ny - a.home.y) <= TS * 2 && !blockedAt(a, nx, ny) && !blockedAt(a, (a.x + nx) / 2, (a.y + ny) / 2)) {
            a.path.push({ x: nx, y: ny }); a.speed = 30;
          } else a.dir = pick[2];
        }
      } else if (!a.isPlayer || frozen || WM.script.running) a.moving = false;   // the player stands still while a dialogue or event runs
      if (a.moving) { a.animT += dt * 6.5 * (a.animSpeed || 1); a.anim = Math.floor(a.animT) & 3; }
      else { a.anim = 0; a.animT = 0; }
      if (a.emoteT > 0) { a.emoteT -= dt; if (a.emoteT <= 0) a.emote = null; }
      if (a.jumpT > 0) { a.jumpT -= dt; a.offY = -Math.sin((1 - a.jumpT / a.jumpDur) * Math.PI) * a.jumpH; if (a.jumpT <= 0) a.offY = 0; }
    }
  };

  F.updateCamera = function (snap) {
    var p = F.player;
    var tw = F.map.w * TS, th = F.map.h * TS;
    var cx = F.camTarget ? F.camTarget.x : p.x, cy = F.camTarget ? F.camTarget.y : p.y - 8;
    var tx = tw <= WM.LOW_W ? (tw - WM.LOW_W) / 2 : U.clamp(cx - WM.LOW_W / 2, 0, tw - WM.LOW_W);
    var ty = th <= WM.LOW_H ? (th - WM.LOW_H) / 2 : U.clamp(cy - WM.LOW_H / 2, 0, th - WM.LOW_H);
    if (snap || !F.camTarget) { F.cam.x = tx; F.cam.y = ty; }
    else { F.cam.x += (tx - F.cam.x) * 0.12; F.cam.y += (ty - F.cam.y) * 0.12; }
  };

  // ---------- triggers ----------
  F.onTileEnter = function (t) {
    // exits
    var exits = F.map.def.exits || [];
    for (var i = 0; i < exits.length; i++) {
      var e = exits[i];
      var w = e.w || 1, h = e.h || 1;
      if (t.x >= e.x && t.x < e.x + w && t.y >= e.y && t.y < e.y + h) {
        if (e.cond && !e.cond(S, WM.state)) {
          // a locked place on the world map may sit on the only road: say so, but let the traveller walk on
          if (e.passable) { var m0 = typeof e.blocked === 'function' ? e.blocked(S) : e.blocked; if (m0) WM.ui.toast((m0 && m0.text) || m0); continue; }
          if (e.blocked) { F.bump(e); return true; }
          continue;
        }
        F.useExit(e, t);
        return true;
      }
    }
    // touch events
    var evs = WM.data.events[F.map.id] || [];
    for (i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.trigger !== 'touch') continue;
      var ew = ev.w || 1, eh = ev.h || 1;
      if (t.x >= ev.x && t.x < ev.x + ew && t.y >= ev.y && t.y < ev.y + eh && F.evActive(ev)) { F.runEvent(ev); return true; }
    }
    return false;
  };

  F.bump = function (e) {
    // Push player back one step and show a message (used for story-locked exits).
    var p = F.player;
    var back = { up: [0, 6], down: [0, -6], left: [6, 0], right: [-6, 0] }[p.dir] || [0, 0];
    p.x += back[0]; p.y += back[1];
    F.lastTile = p.tile();
    var msg = typeof e.blocked === 'function' ? e.blocked(S) : e.blocked;
    if (msg) WM.script.run(function (s) { return s.say(msg.who || null, msg.text || msg); });
  };

  F.useExit = function (e, t) {
    if (F.transitioning) return;
    F.transitioning = true;
    WM.audio.sfx(e.sfx || (F.map.interior || (WM.data.maps[e.to] && WM.data.maps[e.to].interior) ? 'door' : 'step'));
    var tx = e.tx, ty = e.ty;
    if (e.keepX) tx = e.tx + (t.x - e.x);
    if (e.keepY) ty = e.ty + (t.y - e.y);
    WM.fadeOut(0.25).then(function () {
      F.loadMap(e.to, tx, ty, e.dir || F.player.dir);
      return WM.fadeIn(0.25);
    }).then(function () { F.transitioning = false; });
  };

  F.checkAuto = function () {
    var evs = WM.data.events[F.map.id] || [];
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.trigger === 'auto' && F.evActive(ev)) { F.runEvent(ev); return true; }
    }
    return false;
  };

  F.interact = function () {
    var p = F.player;
    var fx = { left: -1, right: 1, up: 0, down: 0 }[p.dir], fy = { up: -1, down: 1, left: 0, right: 0 }[p.dir];
    // probe two points in front of the player (near and a little further) so facing an object is forgiving
    var probes = [10, 20].map(function (d) { return { x: p.x + fx * d, y: p.y - 4 + fy * d }; });
    var best = null, bd = 999;
    probes.forEach(function (pt, pi) {
      if (best) return;
      for (var i = 0; i < F.actors.length; i++) {
        var a = F.actors[i];
        if (!a.visible || !a.ev || a.ev.temp) continue;
        var d = Math.abs(a.x - pt.x) + Math.abs(a.y - 4 - pt.y);
        if (d < 14 && d < bd) { best = a; bd = d; }
      }
    });
    // across counters and tables
    if (!best) {
      var pt0 = probes[0], tx0 = Math.floor(pt0.x / TS), ty0 = Math.floor(pt0.y / TS);
      var tx1 = Math.floor(probes[1].x / TS), ty1 = Math.floor(probes[1].y / TS);
      var over = ['c', 't'];
      var ctx = over.indexOf(F.map.get(tx0, ty0)) >= 0 ? [tx0, ty0] : over.indexOf(F.map.get(tx1, ty1)) >= 0 ? [tx1, ty1] : null;
      if (ctx) {
        var px2 = ctx[0] * TS + 8 + fx * 16, py2 = ctx[1] * TS + 11 + fy * 16;
        for (var i = 0; i < F.actors.length; i++) {
          var a = F.actors[i];
          if (!a.visible || !a.ev) continue;
          var d = Math.abs(a.x - px2) + Math.abs(a.y - 4 - py2);
          if (d < 14 && d < bd) { best = a; bd = d; }
        }
      }
    }
    if (best) {
      if (best.ev.trigger === 'touch' || best.ev.trigger === 'auto') return;
      var dirTo = { left: 'right', right: 'left', up: 'down', down: 'up' }[p.dir];
      if (!best.ev.fixedDir) best.dir = dirTo;
      F.runEvent(best.ev, best);
      return;
    }
    // tile events (signs, caches, objects)
    var evs = WM.data.events[F.map.id] || [];
    for (var k = 0; k < probes.length; k++) {
      var ttx = Math.floor(probes[k].x / TS), tty = Math.floor(probes[k].y / TS);
      for (var i2 = 0; i2 < evs.length; i2++) {
        var ev = evs[i2];
        if ((ev.trigger === 'talk' || ev.trigger === 'check' || !ev.trigger) && !lookFor(ev) && F.evActive(ev)) {
          var ew = ev.w || 1, eh = ev.h || 1;
          if (ttx >= ev.x && ttx < ev.x + ew && tty >= ev.y && tty < ev.y + eh) { F.runEvent(ev); return; }
        }
      }
    }
  };

  F.runEvent = function (ev, actor) {
    var fn = ev.run;
    if (!fn && ev.text) {
      var lines = Array.isArray(ev.text) ? ev.text : [ev.text];
      var who = ev.char || (ev.npc ? ev.npc : (ev.name ? { name: ev.name } : null));
      fn = async function (s) { for (var i = 0; i < lines.length; i++) await s.say(who, lines[i]); };
    }
    if (!fn) return;
    var body = fn;
    // mark once-events done as soon as their script finishes (before actors refresh)
    WM.script.run(async function (s) {
      F.playing.push(ev);
      try { await body(s); } finally { F.playing = F.playing.filter(function (e) { return e !== ev; }); }
      if (ev.once) S.flag('ev:' + ev.map + ':' + ev.id, true);
    }, { ev: ev, actor: actor });
  };

  // Keep existing actors' positions but add/remove according to current conditions.
  F.refreshActors = function () {
    var evs = WM.data.events[F.map.id] || [];
    var keep = [];
    F.actors.forEach(function (a) {
      if (a.ev && a.ev.temp) { if (!a.ev.dismiss) keep.push(a); return; }
      if (a.ev && F.evActive(a.ev)) keep.push(a);
    });
    evs.forEach(function (ev) {
      if (!F.evActive(ev)) return;
      if (keep.some(function (a) { return a.ev === ev; })) return;
      var lk = lookFor(ev); if (!lk) return;
      var a = new Actor({ x: ev.x * TS + 8, y: ev.y * TS + 15, dir: ev.dir || 'down', sheetId: lk.id, look: lk.look, ev: ev, wander: ev.wander, name: lk.name });
      if (ev.hidden) a.visible = false;
      keep.push(a);
    });
    F.actors = keep;
    F.stage();
  };

  // ---------- encounters ----------
  F.rollEncounter = function () {
    var enc = F.map.def.encounters;
    if (!enc || WM.state.flags.noEncounters) return false;
    if (enc.cond && !enc.cond(S)) return false;
    if (Math.random() > (enc.rate || 0.06)) return false;
    var troops = typeof enc.troops === 'function' ? enc.troops(S) : enc.troops;
    var troop = U.pick(troops);
    // a hero travelling alone (or in a pair) meets as many foes as they have companions, not a full band
    var n = WM.state.party.length;
    if (n && n < 3 && troop.length > n) troop = troop.slice(0, n);
    F.startBattle(troop, { bg: F.map.def.battleBg || F.map.theme, canRun: true });
    return true;
  };

  F.startBattle = function (troop, opt) {
    WM.audio.sfx('encounter');
    F.transitioning = true;
    return WM.battle.start(troop, opt).then(function (res) {
      F.transitioning = false;
      if (res === 'lose') return WM.gameOver().then(function () { return res; });
      return res;
    });
  };

  // ---------- drawing ----------
  F.draw = function () {
    var c = G.lctx;
    var cam = F.cam;
    var cx = Math.round(cam.x), cy = Math.round(cam.y);
    c.fillStyle = '#000'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H);
    c.drawImage(F.map.baked, -cx, -cy);
    T.animateWater(c, F.map, cx, cy, WM.time);

    // in an interior, only the player's own room is drawn
    var pt = F.player.tile(), room = roomAt(F.map, pt.x, pt.y);
    var elsewhere = function (x, y) { var r = roomAt(F.map, x, y); return room >= 0 && r >= 0 && r !== room; };

    // y-sorted pass
    var list = [];
    var th = T.THEMES[F.map.theme] || T.THEMES.spring;
    for (var i = 0; i < F.map.talls.length; i++) {
      var tt = F.map.talls[i];
      var sx = tt.x * TS - cx, sy = tt.y * TS - cy;
      if (sx < -32 || sy < -48 || sx > WM.LOW_W + 32 || sy > WM.LOW_H + 32) continue;
      if (elsewhere(tt.x, tt.y)) continue;
      list.push({ y: tt.y * TS + 14, kind: 't', t: tt, sx: sx, sy: sy });
    }
    var all = F.actors.concat([F.player]);
    for (i = 0; i < all.length; i++) {
      var a = all[i];
      if (!a.visible) continue;
      if (a.hiddenPlayer) continue;
      if (!a.isPlayer && elsewhere(Math.floor(a.x / TS), Math.floor((a.y - 1) / TS))) continue;
      list.push({ y: a.y + (a.layer || 0), kind: 'a', a: a });
    }
    list.sort(function (p, q) { return p.y - q.y; });
    for (i = 0; i < list.length; i++) {
      var it = list[i];
      if (it.kind === 't') it.t.d.tall(c, it.sx, it.sy, it.t.x, it.t.y, th, F.map);
      else drawActor(c, it.a, cx, cy);
    }
    // emotes on top
    for (i = 0; i < all.length; i++) if (all[i].emote && all[i].visible) drawEmote(c, all[i], cx, cy);
    if (room >= 0) {
      c.fillStyle = '#000';
      var x0 = Math.max(0, Math.floor(cx / TS)), y0 = Math.max(0, Math.floor(cy / TS));
      for (var ty = y0; ty <= y0 + Math.ceil(WM.LOW_H / TS) && ty < F.map.h; ty++)
        for (var tx = x0; tx <= x0 + Math.ceil(WM.LOW_W / TS) && tx < F.map.w; tx++)
          if (elsewhere(tx, ty)) c.fillRect(tx * TS - cx, ty * TS - cy, TS, TS);
    }

    // weather & lighting
    if (F.map.def.weather === 'snow' || WM.state.flags.weather === 'snow') drawSnow(c);
    if (F.map.def.weather === 'rain' || WM.state.flags.weather === 'rain') drawRain(c);
    var tint = (!F.map.interior && WM.state.flags.tintOverride) || F.map.def.tint || (WM.state.flags.night && !F.map.interior ? 'night' : null);
    if (tint === 'night') { c.fillStyle = 'rgba(10,20,60,0.42)'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H); drawLanternGlow(c, cx, cy); }
    else if (tint === 'dusk') { c.fillStyle = 'rgba(120,50,20,0.18)'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H); }
    else if (tint === 'fire') { c.fillStyle = 'rgba(160,40,10,' + (0.22 + Math.sin(WM.time * 7) * 0.04).toFixed(3) + ')'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H); }
    else if (tint === 'dark') { c.fillStyle = 'rgba(0,0,10,0.5)'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H); }
    G.present();

    // location banner (hi-res)
    if (F.nameBanner && F.nameBanner.t > 0 && F.nameBanner.text) {
      F.nameBanner.t -= 1 / 60;
      var al = U.clamp(F.nameBanner.t, 0, 1);
      G.ctx.globalAlpha = al;
      var tw = G.measure(F.nameBanner.text, 26, true) + 70;
      G.window((WM.W - tw) / 2, 40, tw, 58, { top: '#2a1e12', bottom: '#120c06' });
      G.text(F.nameBanner.text, WM.W / 2, 40 + 29 + 1, { size: 26, bold: true, align: 'center', baseline: 'middle', color: G.COL.gold });   // centred in the plate
      G.ctx.globalAlpha = 1;
    }
    if (F.map.def.world) drawWorldLabel();
    if (F.draw.hook) F.draw.hook();
  };

  function drawWorldLabel() {
    var p = F.player.tile(), best = null, bd = 3;
    var LOC = WM.data.locations;
    for (var id in LOC) {
      var L = LOC[id];
      if (!S.has('loc:' + id)) continue;
      var d = Math.abs(L.x - p.x) + Math.abs(L.y - p.y);
      if (d < bd) { bd = d; best = L; }
    }
    if (!best) return;
    var tw = G.measure(best.name, 22, true) + 50;
    G.window((WM.W - tw) / 2, 16, tw, 48, { top: '#2a1e12', bottom: '#120c06' });
    G.text(best.name, WM.W / 2, 28, { size: 22, bold: true, align: 'center', color: G.COL.gold });
  }

  function drawActor(c, a, cx, cy) {
    var x = Math.round(a.x - cx), y = Math.round(a.y - cy + a.offY);
    if (a.img) {
      var iw = a.img.width * (a.scale || 1), ih = a.img.height * (a.scale || 1);
      c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(x, Math.round(a.y - cy) - 1, iw * 0.35, 3, 0, 0, Math.PI * 2); c.fill();
      if (a.alpha != null) c.globalAlpha = a.alpha;
      c.save();
      if (a.dir === 'left') { c.translate(x + iw / 2, y - ih); c.scale(-1, 1); c.drawImage(a.img, 0, 0, iw, ih); }
      else c.drawImage(a.img, Math.round(x - iw / 2), Math.round(y - ih), iw, ih);
      c.restore();
      c.globalAlpha = 1;
      return;
    }
    if (a.static === 'down') { // lying (wounded / dead)
      SP.shadow(c, x, y - a.offY, 8);
      c.save(); c.translate(x, y - 4); c.rotate(-Math.PI / 2);
      SP.draw(c, a.sheet(), 'down', 0, 0, 12);
      c.restore();
      return;
    }
    SP.shadow(c, x, Math.round(a.y - cy), a.big ? 7 : 5);
    if (a.alpha != null) c.globalAlpha = a.alpha;
    SP.draw(c, a.sheet(), a.dir, a.anim, x, y);
    c.globalAlpha = 1;
  }

  var EMOTES = {
    '!': function (c, x, y) { c.fillStyle = '#e03a2a'; c.fillRect(x - 1, y - 6, 2, 5); c.fillRect(x - 1, y, 2, 2); },
    '?': function (c, x, y) { c.fillStyle = '#2a5ae0'; c.fillRect(x - 2, y - 6, 4, 1); c.fillRect(x + 1, y - 5, 1, 2); c.fillRect(x, y - 3, 1, 1); c.fillRect(x - 1, y - 2, 1, 1); c.fillRect(x - 1, y, 1, 1); },
    '...': function (c, x, y) { c.fillStyle = '#333'; c.fillRect(x - 4, y - 2, 2, 2); c.fillRect(x - 1, y - 2, 2, 2); c.fillRect(x + 2, y - 2, 2, 2); },
    'note': function (c, x, y) { c.fillStyle = '#2a8a3a'; c.fillRect(x, y - 6, 1, 6); c.fillRect(x - 2, y - 1, 3, 2); c.fillRect(x + 1, y - 6, 2, 1); },
    'anger': function (c, x, y) { c.fillStyle = '#e03a2a'; c.fillRect(x - 3, y - 5, 2, 2); c.fillRect(x + 1, y - 5, 2, 2); c.fillRect(x - 3, y - 1, 2, 2); c.fillRect(x + 1, y - 1, 2, 2); },
    'sweat': function (c, x, y) { c.fillStyle = '#5aa0e0'; c.fillRect(x, y - 4, 2, 3); c.fillRect(x - 1, y - 2, 4, 2); },
    'heart': function (c, x, y) { c.fillStyle = '#e04a7a'; c.fillRect(x - 3, y - 5, 2, 2); c.fillRect(x + 1, y - 5, 2, 2); c.fillRect(x - 3, y - 4, 6, 2); c.fillRect(x - 2, y - 2, 4, 1); c.fillRect(x - 1, y - 1, 2, 1); },
    'zzz': function (c, x, y) { c.fillStyle = '#5a5a8a'; c.fillRect(x - 3, y - 5, 4, 1); c.fillRect(x - 1, y - 4, 1, 1); c.fillRect(x - 2, y - 3, 1, 1); c.fillRect(x - 3, y - 2, 4, 1); }
  };
  function drawEmote(c, a, cx, cy) {
    var x = Math.round(a.x - cx), y = Math.round(a.y - cy - 32 + a.offY);
    var b = Math.sin(WM.time * 10) > 0 ? 0 : -1;
    c.fillStyle = '#fff'; c.fillRect(x - 6, y - 8 + b, 12, 11); c.fillRect(x - 5, y - 9 + b, 10, 13);
    c.fillStyle = '#1b130e'; c.fillRect(x - 6, y - 9 + b, 1, 1);
    c.fillRect(x - 1, y + 4 + b, 2, 2);
    var fn = EMOTES[a.emote]; if (fn) fn(c, x, y + 1 + b);
  }

  function drawSnow(c) {
    if (F.snow.length < 90) for (var i = 0; i < 3; i++) F.snow.push({ x: Math.random() * WM.LOW_W, y: -4, v: 18 + Math.random() * 22, s: Math.random() < 0.3 ? 2 : 1, ph: Math.random() * 6 });
    c.fillStyle = '#ffffff';
    for (i = F.snow.length - 1; i >= 0; i--) {
      var f = F.snow[i];
      f.y += f.v / 60; f.x += Math.sin(WM.time * 1.5 + f.ph) * 0.4 - 0.2;
      if (f.y > WM.LOW_H) { F.snow.splice(i, 1); continue; }
      c.fillRect(Math.round(f.x), Math.round(f.y), f.s, f.s);
    }
  }
  function drawRain(c) {
    c.strokeStyle = 'rgba(180,200,230,0.5)'; c.lineWidth = 1; c.beginPath();
    for (var i = 0; i < 70; i++) {
      var x = (U.hash2(i, 1, 5) * WM.LOW_W + WM.time * 60) % WM.LOW_W, y = (U.hash2(i, 2, 5) * WM.LOW_H + WM.time * 300) % WM.LOW_H;
      c.moveTo(x, y); c.lineTo(x - 2, y + 6);
    }
    c.stroke();
    c.fillStyle = 'rgba(20,30,50,0.18)'; c.fillRect(0, 0, WM.LOW_W, WM.LOW_H);
  }
  function drawLanternGlow(c, cx, cy) {
    c.globalCompositeOperation = 'lighter';
    for (var i = 0; i < F.map.talls.length; i++) {
      var t = F.map.talls[i];
      if (F.map.get(t.x, t.y) !== 'L') continue;
      var x = t.x * TS + 8 - cx, y = t.y * TS - 6 - cy;
      var g = c.createRadialGradient(x, y, 1, x, y, 26);
      g.addColorStop(0, 'rgba(255,170,80,0.45)'); g.addColorStop(1, 'rgba(255,120,40,0)');
      c.fillStyle = g; c.fillRect(x - 26, y - 26, 52, 52);
    }
    c.globalCompositeOperation = 'source-over';
  }

  F.Actor = Actor;
})();
