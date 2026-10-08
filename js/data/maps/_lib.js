// Map-building helpers so towns and rooms are composed in code with exact door coordinates.
'use strict';
(function () {
  var U = WM.util;
  var L = WM.mapLib = {};

  function Grid(w, h, fill) {
    this.w = w; this.h = h; this.c = [];
    for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push(fill || '.'); this.c.push(r); }
  }
  Grid.prototype.set = function (x, y, ch) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.c[y][x] = ch; return this; };
  Grid.prototype.get = function (x, y) { return (x >= 0 && y >= 0 && x < this.w && y < this.h) ? this.c[y][x] : null; };
  Grid.prototype.rect = function (x, y, w, h, ch) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) this.set(x + i, y + j, ch); return this; };
  Grid.prototype.frame = function (x, y, w, h, ch) { for (var i = 0; i < w; i++) { this.set(x + i, y, ch); this.set(x + i, y + h - 1, ch); } for (var j = 0; j < h; j++) { this.set(x, y + j, ch); this.set(x + w - 1, y + j, ch); } return this; };
  Grid.prototype.hline = function (x0, x1, y, ch) { for (var x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) this.set(x, y, ch); return this; };
  Grid.prototype.vline = function (x, y0, y1, ch) { for (var y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) this.set(x, y, ch); return this; };
  // L-shaped road between two points, `width` tiles wide
  Grid.prototype.road = function (x0, y0, x1, y1, ch, width) {
    width = width || 1;
    for (var k = 0; k < width; k++) { this.hline(x0, x1, y0 + k, ch); this.vline(x1 + k, y0, y1, ch); }
    return this;
  };
  // Stamp an array of strings; spaces are transparent.
  Grid.prototype.stamp = function (x, y, rows) {
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch !== ' ') this.set(x + i, y + j, ch); }
    return this;
  };
  // Scatter a tile over cells currently holding one of `on` characters.
  Grid.prototype.scatter = function (ch, density, seed, on, area) {
    on = on || '.';
    var a = area || [0, 0, this.w, this.h];
    for (var y = a[1]; y < a[1] + a[3]; y++) for (var x = a[0]; x < a[0] + a[2]; x++) {
      if (on.indexOf(this.get(x, y)) < 0) continue;
      if (U.hash2(x, y, seed || 1) < density) this.set(x, y, ch);
    }
    return this;
  };
  // Tree border of given thickness with optional gaps [{side:'s', from, to}]
  Grid.prototype.border = function (ch, t, gaps) {
    t = t || 1;
    for (var y = 0; y < this.h; y++) for (var x = 0; x < this.w; x++) {
      if (x < t || y < t || x >= this.w - t || y >= this.h - t) {
        var gap = (gaps || []).some(function (g) {
          if (g.side === 'n') return y < t && x >= g.from && x <= g.to;
          if (g.side === 's') return y >= this.h - t && x >= g.from && x <= g.to;
          if (g.side === 'w') return x < t && y >= g.from && y <= g.to;
          if (g.side === 'e') return x >= this.w - t && y >= g.from && y <= g.to;
        }, this);
        if (!gap) this.set(x, y, ch);
      }
    }
    return this;
  };
  // A house: roof rows above two wall rows; door on the bottom wall row. Returns {dx, dy} door tile.
  Grid.prototype.house = function (x, y, w, h, o) {
    o = o || {};
    var roof = o.roof || '^', wall = o.wall || 'W';
    var wallRows = o.wallRows || 2;
    this.rect(x, y, w, h - wallRows, roof);
    this.rect(x, y + h - wallRows, w, wallRows, wall);
    var dx = x + (o.door != null ? o.door : Math.floor(w / 2));
    var dy = y + h - 1;
    if (o.door !== false) this.set(dx, dy, 'D');
    (o.windows || []).forEach(function (wx) { this.set(x + wx, y + h - 1, 'O'); }, this);
    if (o.windowsUpper) o.windowsUpper.forEach(function (wx) { this.set(x + wx, y + h - 2, 'O'); }, this);
    return { x: dx, y: dy };
  };
  // An interior room: walls 'X' (2 rows on top), floor, exit door in the bottom wall.
  Grid.prototype.room = function (x, y, w, h, o) {
    o = o || {};
    this.rect(x, y, w, h, 'X');
    this.rect(x + 1, y + 2, w - 2, h - 3, o.floor || 'n');
    var ex = x + (o.door != null ? o.door : Math.floor(w / 2));
    this.set(ex, y + h - 1, 'D');
    return { x: ex, y: y + h - 1, fx: x + 1, fy: y + 2 };
  };
  Grid.prototype.rows = function () { return this.c.map(function (r) { return r.join(''); }); };
  L.grid = function (w, h, fill) { return new Grid(w, h, fill); };
  // Clear obstacles (chars in `what`) that touch any tile of `pathCh`, replacing with `withCh`.
  L.clearAround = function (g, pathCh, what, withCh) {
    var pts = [];
    for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) if (g.get(x, y) === pathCh) pts.push([x, y]);
    pts.forEach(function (p) {
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var c = g.get(p[0] + dx, p[1] + dy); if (c && what.indexOf(c) >= 0) g.set(p[0] + dx, p[1] + dy, withCh); }
    });
  };

  // Link a door on map A to a spawn on map B (and back). Door tiles: player steps on the door to leave.
  // a = {map, x, y} (the door tile on A), b = {map, x, y} (the door tile on B).
  L.link = function (a, b, o) {
    o = o || {};
    var A = WM.data.maps[a.map], B = WM.data.maps[b.map];
    A.exits = A.exits || []; B.exits = B.exits || [];
    // leaving A through its door: arrive on B one tile inside its door
    var bIn = b.inside || (B.interior ? { x: b.x, y: b.y - 1, dir: 'up' } : { x: b.x, y: b.y + 1, dir: 'down' });
    var aIn = a.inside || (A.interior ? { x: a.x, y: a.y - 1, dir: 'up' } : { x: a.x, y: a.y + 1, dir: 'down' });
    A.exits.push({ x: a.x, y: a.y, w: a.w || 1, h: a.h || 1, to: b.map, tx: bIn.x, ty: bIn.y, dir: bIn.dir, cond: o.cond, blocked: o.blocked });
    if (!o.oneWay) B.exits.push({ x: b.x, y: b.y, w: b.w || 1, h: b.h || 1, to: a.map, tx: aIn.x, ty: aIn.y, dir: aIn.dir, cond: o.backCond, blocked: o.backBlocked });
  };

  // Parse raw ASCII rows (for hand-drawn maps); pads rows to equal width with `fill`.
  L.ascii = function (rows, fill) {
    var w = 0; rows.forEach(function (r) { w = Math.max(w, r.length); });
    return rows.map(function (r) { while (r.length < w) r += (fill || '.'); return r; });
  };

  // Common NPC event helpers
  L.sign = function (id, x, y, text) { return { id: id, x: x, y: y, trigger: 'check', text: text }; };
  L.inn = function (id, x, y, price, npc) {
    return { id: id, x: x, y: y, npc: npc || 'innkeep', run: function (s) { return s.inn(price, npc || 'innkeep'); } };
  };
  L.shop = function (id, x, y, shopId, npc, line) {
    return { id: id, x: x, y: y, npc: npc || 'shopkeep', run: async function (s) { if (line) await s.say(npc || 'shopkeep', line); await s.shop(shopId); } };
  };
  L.smith = function (id, x, y, maxLv, npc, line) {
    return { id: id, x: x, y: y, npc: npc || 'smith', run: async function (s) { await s.say(npc || 'smith', line || 'Want that blade of yours sharper? I can take it as far as level ' + maxLv + '.'); await s.smith(maxLv, npc || 'smith'); } };
  };
  L.talis = function (id, x, y, shopId, npc) {
    return { id: id, x: x, y: y, npc: npc || 'talismaster', run: async function (s) { await s.say(npc || 'talismaster', 'Talismans are bound into the head or the hands. Each holds magic of its own.'); await s.talismanShop(shopId); } };
  };
  L.save = function (id, x, y, npc) {
    return { id: id, x: x, y: y, npc: npc || 'recorder', run: async function (s) { var k = await s.ask(npc || 'recorder', 'Shall I set down the record of your journey?', ['Write a record', 'Not now']); if (k === 0) await s.saveMenu(); } };
  };
  // a treasure chest-like object: a jar / crate you search once
  L.cache = function (id, x, y, item, n, gold) {
    return { id: id, x: x, y: y, trigger: 'check', once: true, run: async function (s) {
      s.sfx('chest');
      if (gold) await s.gold(gold); else await s.give(item, n || 1);
    } };
  };
})();
