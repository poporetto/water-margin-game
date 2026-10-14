// Procedural 16x16 tiles with neighbour-aware autotiling.
// Maps are ASCII; each character maps to a tile definition below.
'use strict';
(function () {
  var U = WM.util;
  var T = WM.tiles = {};
  var S = 16;

  // Seasonal/terrain palettes. Maps choose one with `theme`.
  var THEMES = {
    spring: { g0: '#5b9a3e', g1: '#4b8434', g2: '#77b552', g3: '#3d6e2b', flower: ['#f2e27a', '#f08aa0', '#ffffff'], tree: ['#2c6a2c', '#3c8a36', '#5aaa48'], dirt: ['#b99b66', '#9d8151', '#cfb57f'] },
    summer: { g0: '#4f9238', g1: '#407c2e', g2: '#6aaa48', g3: '#356625', flower: ['#f7d14a', '#e86a5a', '#ffffff'], tree: ['#255f27', '#327d30', '#4c9c3e'], dirt: ['#b99b66', '#9d8151', '#cfb57f'] },
    autumn: { g0: '#9a9441', g1: '#827a34', g2: '#b5aa55', g3: '#6a6229', flower: ['#e8a33c', '#c85a2e', '#f2e2a0'], tree: ['#8a3a1e', '#b8582a', '#d8883a'], dirt: ['#b08e5a', '#957649', '#c8a874'] },
    snow: { g0: '#e6ecf2', g1: '#cdd6e2', g2: '#ffffff', g3: '#b4c0d0', flower: ['#ffffff', '#dde6f0', '#ffffff'], tree: ['#3b5a4a', '#567a66', '#e8f0f6'], dirt: ['#c9c4bc', '#aaa49a', '#ddd8d0'] },
    dusk: { g0: '#5a7a3e', g1: '#4a6634', g2: '#6f9150', g3: '#3a522a', flower: ['#d8b860', '#c86a70', '#e8e0d0'], tree: ['#2a4f2a', '#386638', '#4c824a'], dirt: ['#a58b5e', '#8a734c', '#bca274'] },
    marsh: { g0: '#6a9a48', g1: '#56843a', g2: '#86b25e', g3: '#456c2e', flower: ['#e8e4a0', '#c8d8f0', '#ffffff'], tree: ['#2f6a3a', '#3f8a46', '#5aa85a'], dirt: ['#b3a06c', '#988656', '#c9b884'] },
    south: { g0: '#4a9a4a', g1: '#3a843c', g2: '#64b462', g3: '#2e6a32', flower: ['#f08a8a', '#f7e27a', '#ffffff'], tree: ['#1f5f2f', '#2c7c3c', '#45a052'], dirt: ['#b59a6a', '#977e52', '#cbb383'] },
    north: { g0: '#8a9a5a', g1: '#76844a', g2: '#a0b06a', g3: '#5e6a3a', flower: ['#e0d890', '#c0c0d0', '#ffffff'], tree: ['#3a5a3a', '#4a704a', '#6a8a5a'], dirt: ['#a89878', '#8c7e62', '#beae8e'] }
  };
  T.THEMES = THEMES;

  function px(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x, y, w, h); }

  // ---------- individual tile painters ----------
  function grass(c, x, y, tx, ty, th, rich) {
    px(c, x, y, S, S, th.g0);
    for (var i = 0; i < 9; i++) {
      var h = U.hash2(tx * 7 + i, ty * 13 + i, 3);
      var gx = Math.floor(h * 16), gy = Math.floor(U.hash2(tx + i, ty - i, 9) * 16);
      px(c, x + gx, y + gy, 1, 2, i % 3 ? th.g1 : th.g2);
    }
    if (rich || U.hash2(tx, ty, 77) > 0.86) {
      // tuft
      var ox = 3 + Math.floor(U.hash2(tx, ty, 5) * 9), oy = 4 + Math.floor(U.hash2(tx, ty, 6) * 8);
      px(c, x + ox, y + oy, 1, 3, th.g3); px(c, x + ox + 2, y + oy - 1, 1, 4, th.g3); px(c, x + ox + 4, y + oy + 1, 1, 2, th.g3);
      px(c, x + ox + 2, y + oy - 1, 1, 1, th.g2);
    }
  }
  function flowers(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    for (var i = 0; i < 5; i++) {
      var fx = Math.floor(U.hash2(tx * 3 + i, ty, 11) * 14) + 1, fy = Math.floor(U.hash2(tx, ty * 3 + i, 12) * 14) + 1;
      var col = th.flower[i % th.flower.length];
      px(c, x + fx, y + fy, 2, 2, col); px(c, x + fx, y + fy + 2, 1, 1, th.g3);
    }
  }
  function dirt(c, x, y, tx, ty, th, m) {
    var d = th.dirt;
    px(c, x, y, S, S, d[0]);
    for (var i = 0; i < 7; i++) {
      var h1 = U.hash2(tx * 5 + i, ty * 3, 21), h2 = U.hash2(tx, ty * 5 + i, 22);
      px(c, x + Math.floor(h1 * 15), y + Math.floor(h2 * 15), 2, 1, i % 2 ? d[1] : d[2]);
    }
    // soften edges into grass
    var isG = function (dx, dy) { var ch = m.get(tx + dx, ty + dy); return ch === '.' || ch === ',' || ch === 'f'; };
    if (isG(0, -1)) for (var k = 0; k < 16; k += 2) px(c, x + k, y, 1, 1 + (U.hash2(tx + k, ty, 1) > 0.5 ? 1 : 0), th.g0);
    if (isG(0, 1)) for (k = 1; k < 16; k += 2) px(c, x + k, y + 15 - (U.hash2(tx + k, ty, 2) > 0.5 ? 1 : 0), 1, 2, th.g0);
    if (isG(-1, 0)) for (k = 0; k < 16; k += 2) px(c, x, y + k, 1 + (U.hash2(tx, ty + k, 3) > 0.5 ? 1 : 0), 1, th.g0);
    if (isG(1, 0)) for (k = 1; k < 16; k += 2) px(c, x + 15 - (U.hash2(tx, ty + k, 4) > 0.5 ? 1 : 0), y + k, 2, 1, th.g0);
  }
  function pave(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#a7a49a');
    var off = (ty % 2) * 4;
    c.fillStyle = '#8a877e';
    c.fillRect(x, y + 7, S, 1); c.fillRect(x, y + 15, S, 1);
    c.fillRect(x + ((off + 0) % 16), y, 1, 7); c.fillRect(x + ((off + 8) % 16), y + 8, 1, 7);
    c.fillStyle = '#bdbab0';
    c.fillRect(x + ((off + 1) % 16), y, 6, 1); c.fillRect(x + ((off + 9) % 16), y + 8, 6, 1);
    if (U.hash2(tx, ty, 30) > 0.8) px(c, x + 5, y + 3, 2, 1, '#7d7a72');
  }
  var WATER = ['#2f67ad', '#3b78c0', '#5d97d6', '#24548e', '#d6ecf7'];
  function water(c, x, y, tx, ty, th, m) {
    px(c, x, y, S, S, WATER[0]);
    for (var i = 0; i < 4; i++) {
      var wx = Math.floor(U.hash2(tx * 9 + i, ty, 40) * 12), wy = Math.floor(U.hash2(tx, ty * 9 + i, 41) * 15);
      px(c, x + wx, y + wy, 4, 1, WATER[1]);
    }
    var isLand = function (dx, dy) { var ch = m.get(tx + dx, ty + dy); return ch && !T.isWaterChar(ch); };
    var landCol = th.g0;
    // shoreline: a lip of land, then a sandy/foam edge
    if (isLand(0, -1)) { px(c, x, y, S, 3, landCol); px(c, x, y + 3, S, 1, '#7a6a48'); px(c, x, y + 4, S, 1, WATER[4]); }
    if (isLand(0, 1)) { px(c, x, y + 14, S, 2, '#7a6a48'); px(c, x, y + 13, S, 1, WATER[2]); }
    if (isLand(-1, 0)) { px(c, x, y, 2, S, landCol); px(c, x + 2, y, 1, S, '#7a6a48'); px(c, x + 3, y, 1, S, WATER[4]); }
    if (isLand(1, 0)) { px(c, x + 14, y, 2, S, landCol); px(c, x + 13, y, 1, S, '#7a6a48'); px(c, x + 12, y, 1, S, WATER[4]); }
  }
  function deep(c, x, y, tx, ty) {
    px(c, x, y, S, S, WATER[3]);
    for (var i = 0; i < 3; i++) {
      var wx = Math.floor(U.hash2(tx * 9 + i, ty, 42) * 12), wy = Math.floor(U.hash2(tx, ty * 9 + i, 43) * 15);
      px(c, x + wx, y + wy, 4, 1, WATER[0]);
    }
  }
  function reeds(c, x, y, tx, ty, th, m) {
    water(c, x, y, tx, ty, th, m);
    for (var i = 0; i < 7; i++) {
      var rx = 1 + Math.floor(U.hash2(tx * 4 + i, ty, 50) * 14), rh = 6 + Math.floor(U.hash2(tx, ty * 4 + i, 51) * 7);
      px(c, x + rx, y + 16 - rh, 1, rh, i % 2 ? '#8a9a4a' : '#6f8238');
      px(c, x + rx, y + 16 - rh - 2, 1, 2, '#c8b878');
    }
  }
  function sand(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#d6c48c');
    for (var i = 0; i < 6; i++) px(c, x + Math.floor(U.hash2(tx + i, ty, 60) * 15), y + Math.floor(U.hash2(tx, ty + i, 61) * 15), 1, 1, i % 2 ? '#bfa970' : '#e8daa8');
  }
  function treeBase(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    // shadow + trunk + lower canopy
    c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(x + 8, y + 13, 7, 3, 0, 0, Math.PI * 2); c.fill();
    px(c, x + 7, y + 8, 3, 6, '#6b4a2b'); px(c, x + 7, y + 8, 1, 6, '#4f3520');
  }
  function treeTall(c, x, y, tx, ty, th) {
    // a broadleaf tree: the trunk rises unbroken from its foot on the ground tile (y+8) and forks into the crown,
    // which is three clumps of leaves, darker underneath, lit from the upper left
    var t = th.tree, bark = '#6b4a2b', dark = '#4f3520', under = U.shade(t[0], -0.22);
    px(c, x + 7, y - 2, 3, 11, bark); px(c, x + 7, y - 2, 1, 11, dark);
    px(c, x + 5, y - 3, 2, 1, bark); px(c, x + 4, y - 4, 2, 1, bark); px(c, x + 10, y - 4, 2, 1, bark); px(c, x + 11, y - 5, 2, 1, bark);
    blob(c, x + 4, y - 4, 5, 5, under); blob(c, x + 12, y - 4, 5, 5, under); blob(c, x + 8, y - 9, 7, 5, under);
    blob(c, x + 4, y - 5, 5, 4, t[0]); blob(c, x + 12, y - 5, 5, 4, t[0]); blob(c, x + 8, y - 10, 7, 4, t[0]);
    blob(c, x + 3, y - 6, 3, 2, t[1]); blob(c, x + 11, y - 6, 3, 2, t[1]); blob(c, x + 7, y - 11, 5, 2, t[1]);
    px(c, x + 5, y - 12, 3, 1, t[2]); px(c, x + 2, y - 7, 2, 1, t[2]); px(c, x + 10, y - 7, 2, 1, t[2]);
    px(c, x + 6, y - 2, 1, 1, under); px(c, x + 9, y - 1, 2, 1, under);   // leaves hanging over the fork
  }
  function pineTall(c, x, y, tx, ty, th) {
    // a pine as Song painters drew it: a crooked trunk carrying flat, layered pads of needles
    var snow = th === THEMES.snow;
    var dark = snow ? '#2f4f42' : '#1f4a33', mid = snow ? '#456c5a' : '#2e6644', lite = snow ? '#eef4f8' : '#4a8a5a', bark = '#5a3a20';
    // the trunk runs down unbroken to the foot drawn on the ground tile (which starts 10px into the tile)
    px(c, x + 7, y - 4, 2, 15, bark); px(c, x + 8, y - 10, 2, 7, bark); px(c, x + 7, y - 16, 2, 7, bark); px(c, x + 7, y - 4, 1, 15, '#7a5230');
    px(c, x + 3, y - 8, 5, 1, bark); px(c, x + 10, y - 13, 4, 1, bark); px(c, x + 4, y - 17, 4, 1, bark);
    var pad = function (cx, cy, w) { blob(c, cx, cy, w, 2, dark); blob(c, cx, cy - 1, w - 1, 1, mid); px(c, cx - w + 2, cy - 2, 3, 1, lite); };
    pad(x + 4, y - 8, 6); pad(x + 11, y - 9, 4); pad(x + 12, y - 14, 6); pad(x + 4, y - 15, 4); pad(x + 6, y - 18, 6); pad(x + 10, y - 22, 5);
  }

  // the white poplar (白楊樹): a tall, narrow tree with a pale, dark-eyed trunk — the guide through the Zhu maze
  function poplarBase(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(x + 8, y + 13, 5, 2, 0, 0, Math.PI * 2); c.fill();
    px(c, x + 7, y + 2, 3, 12, '#e8e4d8'); px(c, x + 9, y + 2, 1, 12, '#b8b4a8');
    px(c, x + 7, y + 6, 2, 1, '#3a3630'); px(c, x + 8, y + 10, 2, 1, '#3a3630');
  }
  function poplarTall(c, x, y) {
    // a northern white poplar: pale bark marked with dark 'eyes', a tall dark-green column of leaves
    px(c, x + 7, y - 6, 3, 9, '#e4e0d2'); px(c, x + 9, y - 6, 1, 9, '#b8b4a8'); px(c, x + 7, y - 3, 2, 1, '#3a3630');
    blob(c, x + 8, y - 15, 4, 10, '#2f5a2c'); blob(c, x + 7, y - 17, 3, 8, '#3f7436');
    px(c, x + 6, y - 22, 2, 3, '#5a9446'); px(c, x + 5, y - 16, 1, 3, '#5a9446'); px(c, x + 9, y - 12, 1, 2, '#5a9446');
  }

  function bamboo(c, x, y, tx, ty, th) {
    // a clump of bamboo: jointed green stems, sprays of narrow leaves
    grass(c, x, y, tx, ty, th);
    for (var i = 0; i < 4; i++) {
      var bx = x + 1 + i * 4 + Math.floor(U.hash2(tx, ty + i, 70) * 2), o = (i * 5 + tx) % 4;
      px(c, bx, y, 2, S, i % 2 ? '#5f9a3a' : '#4e8530'); px(c, bx, y, 1, S, '#7fbf55');
      for (var k = o; k < 16; k += 4) px(c, bx, y + k, 2, 1, '#2e5a1e');   // joints
      var ly = 1 + (i * 7 + ty * 3) % 9;
      px(c, bx + 2, ly + y, 3, 1, '#3d7a2a'); px(c, bx + 3, ly + y - 1, 2, 1, '#6aaa48');
      px(c, bx - 2, ly + y + 5, 2, 1, '#3d7a2a'); px(c, bx - 3, ly + y + 6, 2, 1, '#6aaa48');
    }
  }

  function rock(c, x, y, tx, ty, th, m) {
    grass(c, x, y, tx, ty, th);
    var base = th === THEMES.snow ? '#9aa4b0' : '#8a7c6a', lite = th === THEMES.snow ? '#f4f8fb' : '#ad9f88', dark = '#5e5446';
    blob(c, x + 8, y + 9, 8, 7, dark);
    blob(c, x + 8, y + 8, 7, 6, base);
    blob(c, x + 6, y + 6, 4, 3, lite);
    px(c, x + 9, y + 9, 3, 1, dark);
  }
  function mountain(c, x, y, tx, ty, th, m) {
    // fills the tile with rocky cliff; edges blend to neighbours
    var snow = th === THEMES.snow;
    var base = snow ? '#a9b3bf' : '#8d7c66', lite = snow ? '#f0f5f9' : '#b1a084', dark = snow ? '#6c7888' : '#5f5243';
    px(c, x, y, S, S, base);
    for (var i = 0; i < 5; i++) {
      var rx = Math.floor(U.hash2(tx * 3 + i, ty, 80) * 12), ry = Math.floor(U.hash2(tx, ty * 3 + i, 81) * 12);
      px(c, x + rx, y + ry, 4, 1, lite); px(c, x + rx + 1, y + ry + 1, 3, 2, dark);
    }
    var up = m.get(tx, ty - 1);
    if (up !== 'M') { px(c, x, y, S, 3, snow ? '#ffffff' : th.g3); px(c, x, y + 3, S, 1, dark); }
    var dn = m.get(tx, ty + 1);
    if (dn !== 'M') { px(c, x, y + 12, S, 4, dark); for (var k = 0; k < 16; k += 3) px(c, x + k, y + 11, 2, 1, dark); }
  }
  function wallPlaster(c, x, y, tx, ty, th, m, ch) {
    // a Song house front: whitewashed infill between timber columns, a vermilion beam resting on small brackets
    // under the eave, and the whole raised on a stone base
    px(c, x, y, S, S, '#ebe2ca');
    // a front two tiles high is one storey: the beam goes along the top row only, the stone base along the bottom
    var top = !T.isWallChar(m.get(tx, ty - 1)) && m.get(tx, ty - 1) !== 'D', bottom = !T.isWallChar(m.get(tx, ty + 1));
    var y0 = top ? 2 : 0, y1 = bottom ? 13 : 16;
    if (top) {
      px(c, x, y, S, 2, '#8e2f22'); px(c, x, y, S, 1, '#a8402e');            // beam under the eave
      for (var b = 1; b < 16; b += 5) px(c, x + b, y + 2, 3, 1, '#5a2418');   // bracket blocks (dougong)
    }
    if (bottom) { px(c, x, y + 13, S, 3, '#8c877c'); px(c, x, y + 13, S, 1, '#a9a498'); }   // stone base
    var l = m.get(tx - 1, ty), r = m.get(tx + 1, ty);
    var column = function (cx) { px(c, cx, y + y0, 2, y1 - y0, '#6e2a1c'); px(c, cx, y + y0, 1, y1 - y0, '#8a3a26'); };
    if (!T.isWallChar(l)) column(x);
    if (!T.isWallChar(r)) column(x + 14);
    // columns along a long front, where the wall is plain from eave to base (not through a window or a door)
    var plain = function (dy) { var q = m.get(tx, ty + dy); return !T.isWallChar(q) || q === 'W'; };
    if (tx % 3 === 0 && T.isWallChar(l) && T.isWallChar(r) && ch === 'W' && plain(-1) && plain(1)) column(x + 7);
    if (ch === 'O') { // a vertical-slat window (zhiling chuang), the common Song window
      px(c, x + 3, y + 4, 10, 8, '#4a2a18');
      px(c, x + 4, y + 5, 8, 6, '#f0e6c6');
      c.fillStyle = '#4a2a18';
      for (var sl = x + 5; sl < x + 12; sl += 2) c.fillRect(sl, y + 5, 1, 6);
      px(c, x + 3, y + 11, 10, 1, '#6a4028');
    }
  }
  function wallRed(c, x, y, tx, ty, th, m) {
    // the vermilion wall of a temple or a government office, capped with grey tiles
    px(c, x, y, S, S, '#9c2f25');
    var base = !m || m.get(tx, ty + 1) !== 'R';   // the stone footing only where the wall meets the ground
    px(c, x + 2, y, 3, base ? 14 : 16, '#b8463a'); px(c, x + 11, y, 3, base ? 14 : 16, '#b8463a');
    px(c, x + 2, y, 1, base ? 14 : 16, '#d0604f');
    if (base) px(c, x, y + 14, S, 2, '#6b5a48');
    // (the tiled coping along the top is drawn by wallRedOver; a wall running north-south is one unbroken face)
  }
  function wallStone(c, x, y, tx, ty, th, m) {
    // a city wall of rammed earth faced with brick, battlemented along the top
    px(c, x, y, S, S, '#8a8478');
    c.fillStyle = '#6a655b';
    for (var r = 0; r < 4; r++) {
      c.fillRect(x, y + r * 4 + 3, S, 1);
      var o = (r + ty) % 2 ? 0 : 5;
      c.fillRect(x + o, y + r * 4, 1, 3); c.fillRect(x + o + 8, y + r * 4, 1, 3);
    }
    c.fillStyle = '#a49e90';
    for (r = 0; r < 4; r++) c.fillRect(x + 1, y + r * 4, 14, 1);
    if (m.get(tx, ty - 1) !== '#' && m.get(tx, ty - 1) !== 'G') {
      px(c, x, y, S, 3, '#5d584f');
      for (var k = 0; k < 16; k += 6) { px(c, x + k + 1, y - 4, 4, 4, '#7a756a'); px(c, x + k + 1, y - 4, 4, 1, '#a49e90'); px(c, x + k + 4, y - 4, 1, 4, '#5d584f'); }   // merlons
    }
  }

  function cityGate(c, x, y, tx, ty, th, m) {
    // a Song gate passage: flat-topped, framed in timber, the leaves of the gate pushed back inside
    px(c, x, y, S, S, '#8a8478');
    var G = function (dx) { return m.get(tx + dx, ty) === 'G'; };
    var l = G(-1) ? 0 : 2, r = G(1) ? 16 : 14;
    px(c, x + l, y + 2, r - l, 14, '#1e140c');
    px(c, x + l, y + 2, r - l, 2, '#6a3e22');                       // the lintel beam
    if (!G(-1)) { px(c, x + 1, y + 2, 2, 14, '#6a3e22'); px(c, x + 3, y + 5, 2, 9, '#7a3a22'); }
    if (!G(1)) { px(c, x + 13, y + 2, 2, 14, '#6a3e22'); px(c, x + 11, y + 5, 2, 9, '#7a3a22'); }
    px(c, x + l, y + 12, r - l, 4, '#7d7a72');                      // the road through
  }
  // the gate tower: a tiled roof on the wall over the passage
  function cityGateOver(c, x, y, tx, ty, th, m) {
    if (m.get(tx, ty - 1) === 'G') return;
    var G = function (dx) { return m.get(tx + dx, ty) === 'G'; };
    var x0 = x - (G(-1) ? 0 : 6), x1 = x + 16 + (G(1) ? 0 : 6);
    px(c, x0, y - 13, x1 - x0, 2, '#2f3542');                       // ridge
    px(c, x0, y - 11, x1 - x0, 6, '#5b6476');
    for (var k = x0 + 1; k < x1; k += 4) px(c, k, y - 11, 2, 6, '#7b8598');
    px(c, x0, y - 5, x1 - x0, 2, '#2f3542');                        // eave
    px(c, x0 + 3, y - 3, x1 - x0 - 6, 3, '#9c2f25');                 // the tower's red front
    for (var q = x0 + 4; q < x1 - 4; q += 5) px(c, q, y - 3, 1, 3, '#5c1a14');
    if (!G(-1)) { px(c, x0 - 2, y - 7, 3, 2, '#2f3542'); px(c, x0 - 3, y - 8, 2, 1, '#2f3542'); }
    if (!G(1)) { px(c, x1 - 1, y - 7, 3, 2, '#2f3542'); px(c, x1 + 1, y - 8, 2, 1, '#2f3542'); }
  }

  function roof(c, x, y, tx, ty, th, m, ch) {
    var pal = roofPal(ch);
    var R = function (dx, dy) { var q = m.get(tx + dx, ty + dy); return q === ch; };
    px(c, x, y, S, S, pal[0]);
    if (ch === 'z') { // thatch: streaky straw
      for (var i = 0; i < 16; i += 2) px(c, x + i, y, 1, S, i % 4 ? pal[1] : pal[2]);
      for (var j = 3; j < 16; j += 5) px(c, x, y + j, S, 1, pal[2]);
    } else {
      // Song roofs: rows of round tube tiles running down the slope, with channels of flat tiles between them
      for (var col = 0; col < 16; col += 4) {
        px(c, x + col, y, 2, S, pal[1]); px(c, x + col, y, 1, S, U.shade(pal[1], 0.18));   // the tube tile, lit on one side
        px(c, x + col + 2, y, 1, S, pal[2]);                                                   // shadow beside it
      }
      for (var row = 3 + (ty % 2) * 2; row < 16; row += 5) px(c, x, y + row, S, 1, U.shade(pal[0], -0.12));   // courses
    }
    if (!R(0, -1)) { // the main ridge, with a curled ornament (chiwen) rising at each end
      px(c, x, y, S, 4, pal[3]); px(c, x, y, S, 1, U.shade(pal[3], 0.25)); px(c, x, y + 3, S, 1, pal[2]);
    }
    if (!R(0, 1)) { // the eave: a dark edge of round tile-ends, sweeping up and out at the corners
      px(c, x, y + 13, S, 3, pal[3]);
      for (var k = 1; k < 16; k += 4) { px(c, x + k, y + 14, 2, 2, pal[1]); px(c, x + k, y + 14, 1, 1, U.shade(pal[1], 0.25)); }
    }
    if (!R(-1, 0)) px(c, x, y, 1, S, pal[3]);
    if (!R(1, 0)) px(c, x + 15, y, 1, S, pal[3]);
  }
  function roofPal(ch) {
    return ch === 'Z' ? ['#c99a2e', '#e8bf4a', '#9a7020', '#7a5418'] : ch === 'z' ? ['#a88d5a', '#c4aa72', '#857048', '#6a5838'] :
           ch === 'v' ? ['#7a3a2a', '#9a4e38', '#5a2a1e', '#401a12'] : ['#5b6476', '#7b8598', '#424a5a', '#2f3542'];
  }
  // drawn after every tile is down, so the next tile cannot cover them: the curled ornaments (chiwen) at the ends
  // of the ridge, and the eave corners sweeping up and out
  function roofOver(c, x, y, tx, ty, th, m, ch) {
    if (ch === 'z') return;   // thatch has neither
    var pal = roofPal(ch), R = function (dx, dy) { return m.get(tx + dx, ty + dy) === ch; }, hi = U.shade(pal[3], 0.3);
    if (!R(0, -1)) {
      if (!R(-1, 0)) { px(c, x, y - 4, 2, 5, pal[3]); px(c, x + 1, y - 6, 2, 2, pal[3]); px(c, x + 3, y - 6, 1, 2, pal[3]); px(c, x + 1, y - 6, 1, 1, hi); }
      if (!R(1, 0)) { px(c, x + 14, y - 4, 2, 5, pal[3]); px(c, x + 13, y - 6, 2, 2, pal[3]); px(c, x + 12, y - 6, 1, 2, pal[3]); px(c, x + 14, y - 6, 1, 1, hi); }
    }
    if (!R(0, 1)) {
      if (!R(-1, 0)) { px(c, x - 2, y + 12, 3, 3, pal[3]); px(c, x - 4, y + 10, 3, 3, pal[3]); px(c, x - 5, y + 8, 2, 3, pal[3]); px(c, x - 5, y + 8, 1, 1, hi); }
      if (!R(1, 0)) { px(c, x + 15, y + 12, 3, 3, pal[3]); px(c, x + 17, y + 10, 3, 3, pal[3]); px(c, x + 19, y + 8, 2, 3, pal[3]); px(c, x + 20, y + 8, 1, 1, hi); }
    }
  }
  function wallRedOver(c, x, y, tx, ty, th, m) {
    if (m.get(tx, ty - 1) === 'R') return;
    px(c, x, y - 2, S, 5, '#4a5262'); px(c, x, y - 2, S, 1, '#6a7488');
    for (var k = 1; k < 16; k += 4) px(c, x + k, y + 1, 2, 2, '#7b8598');
  }
  function door(c, x, y, tx, ty, th, m) {
    var wallUp = m.get(tx, ty - 1);
    var outdoorWall = T.isWallChar(m.get(tx - 1, ty)) || T.isWallChar(m.get(tx + 1, ty)) || wallUp === '^' || wallUp === 'z' || wallUp === 'Z' || wallUp === 'v';
    if (outdoorWall) {
      px(c, x, y, S, S, '#ebe2ca');
      px(c, x, y, S, 2, '#8e2f22');
      px(c, x + 1, y + 2, 14, 14, '#3a2012');                                   // the door frame
      px(c, x + 2, y + 5, 6, 11, '#7a3a22'); px(c, x + 8, y + 5, 6, 11, '#7a3a22');   // two leaves
      px(c, x + 2, y + 5, 12, 1, '#94503a');
      c.fillStyle = '#d8b36a';
      for (var sr = 0; sr < 3; sr++) for (var sc = 0; sc < 2; sc++) { c.fillRect(x + 3 + sc * 3, y + 7 + sr * 3, 1, 1); c.fillRect(x + 10 + sc * 3, y + 7 + sr * 3, 1, 1); }   // door studs
      px(c, x + 6, y + 10, 1, 2, '#c8a050'); px(c, x + 9, y + 10, 1, 2, '#c8a050');   // ring knockers
      px(c, x + 4, y + 2, 8, 3, '#2a1a10'); px(c, x + 4, y + 2, 8, 1, '#c8a050'); px(c, x + 6, y + 3, 4, 1, '#c8a050');   // name plaque
    } else {
      // interior exit mat
      px(c, x, y, S, S, '#3a2a1e'); px(c, x + 2, y + 4, 12, 12, '#7a5a3a'); px(c, x + 3, y + 5, 10, 10, '#8f6c46');
    }
  }
  function floorWood(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#a3744a');
    c.fillStyle = '#8a5f38';
    for (var r = 0; r < 4; r++) { c.fillRect(x, y + r * 4 + 3, S, 1); c.fillRect(x + ((r * 5 + tx * 3) % 16), y + r * 4, 1, 3); }
    c.fillStyle = '#b8875a';
    for (r = 0; r < 4; r++) c.fillRect(x + 2, y + r * 4, 5, 1);
  }
  function floorStone(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#8e8c86');
    c.fillStyle = '#76746e'; c.fillRect(x, y + 15, S, 1); c.fillRect(x + 15, y, 1, S);
    c.fillStyle = '#a4a29b'; c.fillRect(x, y, S, 1); c.fillRect(x, y, 1, S);
  }
  function carpet(c, x, y, tx, ty, th, m) {
    px(c, x, y, S, S, '#8a2420');
    var K = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'K'; };
    if (!K(-1, 0)) px(c, x, y, 2, S, '#d8b36a');
    if (!K(1, 0)) px(c, x + 14, y, 2, S, '#d8b36a');
    if (!K(0, -1)) px(c, x, y, S, 2, '#d8b36a');
    if (!K(0, 1)) px(c, x, y + 14, S, 2, '#d8b36a');
    if ((tx + ty) % 2 === 0) { px(c, x + 6, y + 6, 4, 4, '#a8382c'); px(c, x + 7, y + 7, 2, 2, '#d8b36a'); }
  }
  function interiorWall(c, x, y, tx, ty, th, m) {
    var below = m.get(tx, ty + 1);
    if (below && below !== 'X' && below !== 'x') {
      // visible wall face
      px(c, x, y, S, S, '#d8ccb0');
      px(c, x, y, S, 3, '#6a3e22');
      px(c, x, y + 13, S, 3, '#6a4a30');
      if (tx % 4 === 0) px(c, x, y, 2, S, '#6a3e22');
    } else {
      px(c, x, y, S, S, '#2a1c14');
      px(c, x, y, S, 1, '#3a281c');
    }
  }
  function table(c, x, y, tx, ty, th, m) {
    floorWood(c, x, y, tx, ty);
    px(c, x + 1, y + 3, 14, 9, '#5a3218'); px(c, x + 1, y + 3, 14, 2, '#7a4a28');
    px(c, x + 2, y + 12, 2, 4, '#4a2810'); px(c, x + 12, y + 12, 2, 4, '#4a2810');
    // a cup and a jug
    if (U.hash2(tx, ty, 90) > 0.4) { px(c, x + 4, y + 4, 3, 3, '#e8e0d0'); px(c, x + 9, y + 3, 4, 4, '#8a6a4a'); px(c, x + 10, y + 2, 2, 1, '#8a6a4a'); }
  }
  function counter(c, x, y, tx, ty) {
    floorWood(c, x, y, tx, ty);
    px(c, x, y + 2, S, 12, '#6a3a1c'); px(c, x, y + 2, S, 3, '#8a5a2c'); px(c, x, y + 13, S, 1, '#3a200e');
  }
  // A bed is a block of 'k' tiles, two deep: drawn whole and cut to each tile. A run four or more wide is beds side
  // by side, two tiles each; an odd run of three is one long platform bed with a pillow for each sleeper.
  function bedBlock(m, tx, ty) {
    var K = function (x, y) { return m.get(x, y) === 'k'; };
    var x0 = tx, x1 = tx, y0 = ty, y1 = ty;
    while (K(x0 - 1, ty)) x0--; while (K(x1 + 1, ty)) x1++;
    while (K(tx, y0 - 1)) y0--; while (K(tx, y1 + 1)) y1++;
    var w = x1 - x0 + 1, h = y1 - y0 + 1;
    if (w >= 4 && w % 2 === 0) { x0 += Math.floor((tx - x0) / 2) * 2; w = 2; }
    if (h > 2) { y0 += Math.floor((ty - y0) / 2) * 2; h = Math.min(2, y1 - y0 + 1); }
    return { x: x0, y: y0, w: w, h: h };
  }
  function bigBed(c, X, Y, w, h) {
    // a Song canopy bed seen from above the foot: dark lacquered posts and frame, the canopy along the head,
    // red curtains tied back at the head posts, a quilt turned down, and a porcelain pillow for each sleeper
    var W = w * S, H = h * S;
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(X + 2, Y + H - 2, W - 3, 2);
    px(c, X + 1, Y + 1, W - 2, H - 3, '#3a1e10');                                       // frame
    px(c, X + 3, Y + 5, W - 6, H - 9, '#e6dcc4');                                       // the mat
    for (var i = 0; i < w; i++) {                                                         // pillows
      var pxx = X + Math.round((i + 0.5) * (W - 6) / w) + 3 - 4;
      px(c, pxx, Y + 6, 8, 3, '#dcd8c0'); px(c, pxx, Y + 8, 8, 1, '#a8a48c'); px(c, pxx + 1, Y + 6, 2, 1, '#f4f0e0');
    }
    var qy = Y + Math.max(11, Math.round(H * 0.42));
    px(c, X + 3, qy, W - 6, Y + H - 4 - qy, '#34466e');                                // quilt
    px(c, X + 3, qy, W - 6, 2, '#e6dcc4'); px(c, X + 3, qy + 2, W - 6, 1, '#24345a');   // the sheet turned over it
    for (var q = X + 6; q < X + W - 5; q += 6) px(c, q, qy + 5, 2, 2, '#5a6a94');      // woven flowers
    px(c, X + 1, Y + 1, W - 2, 4, '#7a2a20'); px(c, X + 1, Y + 1, W - 2, 1, '#9a3a2a'); px(c, X + 1, Y + 4, W - 2, 1, '#4a160e');   // canopy
    px(c, X + 1, Y + 1, 2, H - 3, '#5a2e18'); px(c, X + W - 3, Y + 1, 2, H - 3, '#5a2e18');   // posts
    px(c, X + 3, Y + 5, 2, 7, '#a8483a'); px(c, X + W - 5, Y + 5, 2, 7, '#a8483a');           // curtains, tied back
    px(c, X + 3, Y + 9, 2, 1, '#d8b36a'); px(c, X + W - 5, Y + 9, 2, 1, '#d8b36a');
    px(c, X + 1, Y + H - 3, W - 2, 1, '#2a140a');                                       // the foot rail
  }
  function bed(c, x, y, tx, ty, th, m) {
    var b = m ? bedBlock(m, tx, ty) : { w: 1, h: 1 };
    if (b.h >= 2) {
      if (m.get(tx, ty + 1) === 'N' || m.get(tx, ty - 1) === 'N') floorStone(c, x, y, tx, ty); else floorWood(c, x, y, tx, ty);
      c.save(); c.beginPath(); c.rect(x, y, S, S); c.clip();
      bigBed(c, x - (tx - b.x) * S, y - (ty - b.y) * S, b.w, b.h);
      c.restore();
      return;
    }
    // a single tile with no room to grow: a narrow canopied bed
    floorWood(c, x, y, tx, ty);
    px(c, x + 1, y + 1, 14, 14, '#4a2614');
    px(c, x + 1, y + 1, 14, 3, '#7a2a20'); px(c, x + 1, y + 1, 14, 1, '#9a3a2a');   // canopy
    px(c, x + 1, y + 4, 3, 11, '#a8483a'); px(c, x + 12, y + 4, 3, 11, '#a8483a');   // curtains
    px(c, x + 4, y + 5, 8, 9, '#d8b06a'); px(c, x + 4, y + 9, 8, 5, '#a86a3a'); px(c, x + 5, y + 10, 6, 1, '#c8885a');
    px(c, x + 5, y + 5, 6, 2, '#e8e0d0');
  }

  // A great hall's column: red lacquer on a carved stone base, rising out of sight with a gilded bracket at the top.
  function pillar(c, x, y, tx, ty) {
    floorStone(c, x, y, tx, ty);
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x + 3, y + 13, 11, 2);
    px(c, x + 3, y + 11, 10, 4, '#b8b4a8'); px(c, x + 3, y + 11, 10, 1, '#d8d4c8'); px(c, x + 4, y + 14, 8, 1, '#8a867c');   // lotus base
    px(c, x + 5, y, 6, 11, '#9c2f25'); px(c, x + 5, y, 2, 11, '#bc4a3a'); px(c, x + 10, y, 1, 11, '#6a1a14');
  }
  function pillarTall(c, x, y, tx, ty, th, m) {
    // a row of columns down a hall reads as one column per pair of tiles: join up to the one above, bracket only at the top
    var joined = m && m.get(tx, ty - 2) === 'i', h = joined ? 32 : 18;
    px(c, x + 5, y - h, 6, h, '#9c2f25'); px(c, x + 5, y - h, 2, h, '#bc4a3a'); px(c, x + 10, y - h, 1, h, '#6a1a14');
    if (!joined) { px(c, x + 3, y - 22, 10, 4, '#c8a040'); px(c, x + 3, y - 22, 10, 1, '#e8c860'); px(c, x + 2, y - 23, 12, 1, '#5a3a18'); }   // gilded bracket
  }
  // A market stall as on the Qingming scroll: a trestle counter of goods under a cloth awning on two poles.
  function stall(c, x, y, tx, ty, th, m) {
    var near = function (ch) { return m.get(tx - 1, ty) === ch || m.get(tx + 1, ty) === ch || m.get(tx, ty - 1) === ch || m.get(tx, ty + 1) === ch; };
    if (near('=')) pave(c, x, y, tx, ty); else if (near(':')) dirt(c, x, y, tx, ty, th, m); else grass(c, x, y, tx, ty, th);
    c.fillStyle = 'rgba(0,0,0,0.22)'; c.fillRect(x + 1, y + 13, 14, 2);
    px(c, x + 1, y + 6, 14, 6, '#6a4224'); px(c, x + 1, y + 6, 14, 1, '#8a5a32');           // the board
    px(c, x + 2, y + 12, 1, 3, '#4a2a14'); px(c, x + 13, y + 12, 1, 3, '#4a2a14');           // trestle legs
    var kind = Math.floor(U.hash2(tx, ty, 41) * 4);
    if (kind === 0) { for (var i = 0; i < 3; i++) { px(c, x + 2 + i * 4, y + 4, 4, 3, '#e8e0cc'); px(c, x + 3 + i * 4, y + 4, 2, 1, '#fff8e8'); } }   // steamed buns in a basket row
    else if (kind === 1) { px(c, x + 2, y + 3, 5, 4, '#8a6a3a'); px(c, x + 3, y + 3, 3, 1, '#c84a2a'); px(c, x + 9, y + 3, 5, 4, '#8a6a3a'); px(c, x + 10, y + 3, 3, 1, '#e8a03a'); }   // baskets of dates and persimmons
    else if (kind === 2) { px(c, x + 2, y + 4, 4, 3, '#3a5a8a'); px(c, x + 6, y + 4, 4, 3, '#a83a2a'); px(c, x + 10, y + 4, 4, 3, '#d8c890'); }   // bolts of cloth
    else { px(c, x + 3, y + 2, 4, 5, '#7a5a3a'); px(c, x + 4, y + 1, 2, 1, '#7a5a3a'); px(c, x + 9, y + 3, 3, 4, '#5a4a3a'); px(c, x + 12, y + 4, 2, 3, '#e8e0d0'); }   // wine jars and cups
  }
  function stallTall(c, x, y, tx, ty, th, m) {
    var cloth = ['#d8c8a0', '#c8a878', '#a8b8b0'][Math.floor(U.hash2(tx, ty, 42) * 3)];
    px(c, x + 1, y - 8, 1, 15, '#4a2a14'); px(c, x + 14, y - 8, 1, 15, '#4a2a14');            // poles
    px(c, x - 1, y - 10, 18, 5, cloth); px(c, x - 1, y - 10, 18, 1, U.shade(cloth, 0.2));    // the awning
    px(c, x - 1, y - 5, 18, 1, U.shade(cloth, -0.3));
    for (var k = x; k < x + 17; k += 3) px(c, k, y - 4, 2, 1, U.shade(cloth, -0.15));         // the scalloped edge
  }

  function shelf(c, x, y, tx, ty) {
    // a scholar's shelf: rolled scrolls, stacks of stitched books lying flat, a little jar
    px(c, x, y, S, S, '#4a2a16');
    for (var r = 0; r < 3; r++) {
      var yy = y + 1 + r * 5;
      px(c, x + 1, yy, 14, 4, '#2a180c');
      var kind = (r + tx) % 3;
      if (kind === 0) for (var k = 0; k < 4; k++) { px(c, x + 2 + k * 3, yy + 1, 2, 3, '#e8dcc0'); px(c, x + 2 + k * 3, yy + 2, 1, 1, '#8a6a4a'); }   // scroll ends
      else if (kind === 1) { px(c, x + 2, yy + 1, 6, 3, '#3a4a6a'); px(c, x + 2, yy + 2, 6, 1, '#e8e0d0'); px(c, x + 9, yy + 1, 5, 3, '#4a3a2a'); px(c, x + 9, yy + 2, 5, 1, '#e8e0d0'); }   // thread-bound books
      else { px(c, x + 3, yy, 4, 4, '#8a6a4a'); px(c, x + 4, yy - 1, 2, 1, '#8a6a4a'); px(c, x + 9, yy + 1, 5, 3, '#3a4a6a'); px(c, x + 9, yy + 2, 5, 1, '#e8e0d0'); }
    }
  }

  function jar(c, x, y, tx, ty, th, m) {
    var under = m.get(tx, ty + 1);
    if (m.interior) floorWood(c, x, y, tx, ty); else dirt(c, x, y, tx, ty, th, m);
    blob(c, x + 8, y + 9, 6, 6, '#6a4a2a'); blob(c, x + 7, y + 8, 4, 4, '#8a6a42');
    px(c, x + 5, y + 2, 6, 3, '#4a3018'); px(c, x + 6, y + 1, 4, 1, '#c84a3a');
  }
  function fence(c, x, y, tx, ty, th, m) {
    // a village fence of woven wattle between sharpened stakes
    grass(c, x, y, tx, ty, th);
    var F = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'F'; };
    var horiz = F(-1, 0) || F(1, 0) || !(F(0, -1) || F(0, 1));
    if (horiz) {
      for (var i = 0; i < 16; i += 2) { px(c, x + i, y + 6 + (i % 4 ? 1 : 0), 2, 5, i % 4 ? '#a8885a' : '#8a6a40'); }
      px(c, x, y + 6, S, 1, '#c8a870'); px(c, x, y + 11, S, 1, '#6a4a2a');
      for (var k = 1; k < 16; k += 6) { px(c, x + k, y + 3, 2, 11, '#6a4a2a'); px(c, x + k, y + 2, 1, 1, '#6a4a2a'); }
    } else {
      for (var j = 0; j < 16; j += 2) { px(c, x + 5 + (j % 4 ? 1 : 0), y + j, 5, 2, j % 4 ? '#a8885a' : '#8a6a40'); }
      px(c, x + 5, y, 1, S, '#c8a870'); px(c, x + 10, y, 1, S, '#6a4a2a');
      for (var q = 1; q < 16; q += 6) px(c, x + 6, y + q, 3, 2, '#6a4a2a');
    }
  }

  function bridge(c, x, y, tx, ty, th, m) {
    // a timber bridge with a railing of posts and rails along both sides
    var vert = T.isWaterChar(m.get(tx - 1, ty)) && T.isWaterChar(m.get(tx + 1, ty));
    water(c, x, y, tx, ty, th, m);
    if (vert) {
      px(c, x + 1, y, 14, S, '#9a6a3c');
      for (var i = 0; i < 16; i += 3) px(c, x + 1, y + i, 14, 1, '#7a4e28');
      px(c, x, y, 2, S, '#5a3418'); px(c, x + 14, y, 2, S, '#5a3418');
      px(c, x, y + 2, 2, 3, '#c8965a'); px(c, x + 14, y + 2, 2, 3, '#c8965a'); px(c, x, y + 10, 2, 3, '#c8965a'); px(c, x + 14, y + 10, 2, 3, '#c8965a');
    } else {
      px(c, x, y + 1, S, 14, '#9a6a3c');
      for (var j = 0; j < 16; j += 3) px(c, x + j, y + 1, 1, 14, '#7a4e28');
      px(c, x, y, S, 2, '#5a3418'); px(c, x, y + 14, S, 2, '#5a3418');
      px(c, x + 2, y - 1, 3, 3, '#c8965a'); px(c, x + 10, y - 1, 3, 3, '#c8965a'); px(c, x + 2, y + 13, 3, 3, '#c8965a'); px(c, x + 10, y + 13, 3, 3, '#c8965a');
    }
  }

  function stairs(c, x, y) {
    px(c, x, y, S, S, '#6a655b');
    for (var i = 0; i < 4; i++) { px(c, x, y + i * 4, S, 3, '#a7a49a'); px(c, x, y + i * 4, S, 1, '#c4c1b8'); }
  }
  function well(c, x, y, tx, ty, th, m) {
    pave(c, x, y, tx, ty);
    blob(c, x + 8, y + 9, 7, 6, '#6a655b'); blob(c, x + 8, y + 8, 5, 4, '#1a2a3a');
    px(c, x + 2, y + 1, 2, 8, '#5a3418'); px(c, x + 12, y + 1, 2, 8, '#5a3418'); px(c, x + 2, y, 12, 2, '#7a4e28');
  }
  function lanternTall(c, x, y) {
    // a round red paper lantern hanging from a post
    px(c, x + 6, y - 6, 2, 20, '#3a2a1e'); px(c, x + 7, y - 12, 5, 1, '#3a2a1e');
    blob(c, x + 11, y - 7, 3, 4, '#c8392a'); px(c, x + 10, y - 9, 1, 4, '#f08a3a');
    px(c, x + 9, y - 11, 5, 1, '#2a1a10'); px(c, x + 9, y - 3, 5, 1, '#2a1a10');
    px(c, x + 11, y - 2, 1, 2, '#d8b36a');
  }

  function bannerTall(c, x, y, tx, ty, th, m) {
    // on Liangshan's own ground, its apricot-yellow banner bordered in red: "Act on Heaven's Behalf" (替天行道);
    // anywhere else, a plain red war banner of whoever holds the place
    var ls = !!(m && m.id && (/^liangshan/.test(m.id) || m.id === 'world'));
    px(c, x + 7, y - 24, 2, 38, '#4a2a16'); px(c, x + 6, y - 25, 4, 2, '#c8a050');
    var wave = Math.sin((WM.time || 0) * 3 + tx) * 1.5;
    px(c, x + 9, y - 22, 9, 22, ls ? '#b02a1e' : '#3a2010');
    px(c, x + 10, y - 21, 7, 20, ls ? '#e0a838' : '#b02a1e');
    c.fillStyle = ls ? '#3a200e' : '#e8c060';
    for (var i = 0; i < 4; i++) c.fillRect(x + 12 + Math.round(wave * (i / 4)), y - 19 + i * 5, 3, 3);
  }
  function wineFlagTall(c, x, y, tx, ty) {
    // a tavern's wine flag (酒旗): a dark blue cloth with a white border and the character 酒, on a bamboo pole
    px(c, x + 3, y - 22, 2, 36, '#a08a50'); px(c, x + 3, y - 22, 1, 36, '#c8b070');
    for (var n = y - 18; n < y + 12; n += 7) px(c, x + 3, n, 2, 1, '#6a5a30');                 // bamboo joints
    px(c, x + 3, y - 21, 12, 1, '#6a5a30');                                                    // the crossbar
    var wave = Math.round(Math.sin((WM.time || 0) * 2.6 + tx * 1.7) * 1.2);
    var fx = x + 5, fy = y - 20;
    px(c, fx, fy, 9, 15, '#e8e0d0'); px(c, fx + 1, fy, 7, 14, '#24365e');                      // cloth and border
    px(c, fx + 1 + wave, fy + 14, 2, 3, '#24365e'); px(c, fx + 5 + wave, fy + 14, 2, 3, '#24365e');   // swallow-tail ends
    c.fillStyle = '#f0e8d8';                                                                   // 酒: water radical and the wine jar
    c.fillRect(fx + 2, fy + 3, 1, 1); c.fillRect(fx + 2, fy + 6, 1, 1); c.fillRect(fx + 2, fy + 9, 1, 2);
    c.fillRect(fx + 4, fy + 2, 4, 1); c.fillRect(fx + 4, fy + 4, 1, 7); c.fillRect(fx + 7, fy + 4, 1, 7);
    c.fillRect(fx + 4, fy + 4, 4, 1); c.fillRect(fx + 4, fy + 7, 4, 1); c.fillRect(fx + 4, fy + 10, 4, 1); c.fillRect(fx + 5, fy + 2, 1, 3); c.fillRect(fx + 6, fy + 2, 1, 3);
  }

  function altar(c, x, y, tx, ty) {
    floorStone(c, x, y, tx, ty);
    px(c, x + 1, y + 4, 14, 10, '#6a1a14'); px(c, x + 1, y + 4, 14, 2, '#d8b36a');
    px(c, x + 6, y + 1, 4, 4, '#a08a5a'); px(c, x + 7, y, 1, 2, '#e8e0d0'); px(c, x + 8, y - 1, 1, 2, '#c8c0b0');
  }
  function statueTall(c, x, y) {
    px(c, x + 3, y + 8, 10, 6, '#6a655b');
    blob(c, x + 8, y + 2, 5, 7, '#9a8a5a'); blob(c, x + 8, y - 6, 3, 3, '#b8a46a'); px(c, x + 6, y - 2, 4, 6, '#c8b478');
  }
  function grave(c, x, y, tx, ty, th, m) {
    grass(c, x, y, tx, ty, th);
    blob(c, x + 8, y + 10, 7, 5, '#7a6a4a'); blob(c, x + 8, y + 9, 6, 4, th.g1);
    px(c, x + 6, y + 1, 4, 8, '#9a958a'); px(c, x + 6, y + 1, 4, 1, '#bdb8ac'); px(c, x + 7, y + 3, 2, 4, '#6a655b');
  }
  function deadTree(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    px(c, x + 7, y + 2, 2, 12, '#4a3626'); px(c, x + 4, y + 4, 3, 1, '#4a3626'); px(c, x + 9, y + 6, 4, 1, '#4a3626'); px(c, x + 3, y + 3, 1, 1, '#4a3626'); px(c, x + 12, y + 5, 1, 1, '#4a3626');
  }
  function voidT(c, x, y) { px(c, x, y, S, S, '#000'); }
  function steleTall(c, x, y) {
    // a stele with a rounded, dragon-carved head, standing on the back of a stone tortoise (bixi)
    blob(c, x + 8, y + 11, 7, 3, '#5f5b52'); blob(c, x + 8, y + 10, 6, 2, '#6f6b60');
    px(c, x + 6, y + 13, 4, 2, '#5f5b52'); px(c, x + 7, y + 14, 2, 1, '#3a3630');   // the tortoise's head
    px(c, x + 3, y + 10, 1, 1, '#4a463e'); px(c, x + 12, y + 10, 1, 1, '#4a463e');
    px(c, x + 4, y - 12, 8, 21, '#8a867a'); px(c, x + 11, y - 12, 1, 21, '#6a665c');
    px(c, x + 5, y - 14, 6, 2, '#8a867a'); px(c, x + 6, y - 15, 4, 1, '#8a867a');
    px(c, x + 5, y - 13, 6, 2, '#6a665c'); px(c, x + 6, y - 12, 4, 1, '#a8a496');   // the carved head
    for (var i = 0; i < 6; i++) px(c, x + 6 + (i % 2) * 2, y - 8 + i * 3, 2, 1, '#4a463e');
  }

  function boat(c, x, y, tx, ty, th, m) {
    // a river sampan: a long hull, and an arched awning of woven bamboo over the middle
    water(c, x, y, tx, ty, th, m);
    blob(c, x + 8, y + 10, 8, 3, '#4a2a12'); px(c, x + 1, y + 8, 14, 2, '#8a5a2c'); px(c, x + 2, y + 9, 12, 2, '#3a200e');
    px(c, x + 5, y + 3, 7, 6, '#7a6a48'); px(c, x + 6, y + 2, 5, 1, '#7a6a48');
    px(c, x + 5, y + 5, 7, 1, '#5a4a30'); px(c, x + 5, y + 7, 7, 1, '#5a4a30'); px(c, x + 6, y + 3, 4, 1, '#a89a70');
  }

  function signTall(c, x, y) {
    // a notice board: a tall board on a post, sheltered by a little tiled roof
    px(c, x + 7, y + 4, 2, 10, '#4a2a16');
    px(c, x + 3, y - 9, 10, 13, '#5a3418'); px(c, x + 4, y - 8, 8, 11, '#d8c49a');
    for (var i = 0; i < 3; i++) { px(c, x + 5 + i * 2, y - 6, 1, 7, '#3a200e'); }
    px(c, x + 2, y - 11, 12, 2, '#424a5a'); px(c, x + 1, y - 12, 2, 1, '#424a5a'); px(c, x + 13, y - 12, 2, 1, '#424a5a');
  }

  function tent(c, x, y, tx, ty, th, m) {
    // an army tent of the Song: a ridged cloth hall with its door flap open, a pennant on the pole
    grass(c, x, y, tx, ty, th);
    px(c, x + 1, y + 14, 14, 2, 'rgba(0,0,0,0.25)');
    px(c, x + 1, y + 6, 14, 8, '#c8bfa0'); px(c, x + 1, y + 6, 14, 2, '#d8d0b4');
    px(c, x + 1, y + 4, 14, 2, '#7a6a4a'); px(c, x, y + 5, 1, 2, '#7a6a4a'); px(c, x + 15, y + 5, 1, 2, '#7a6a4a');
    px(c, x + 6, y + 8, 4, 6, '#3a2a1e'); px(c, x + 5, y + 8, 1, 6, '#a89a78'); px(c, x + 10, y + 8, 1, 6, '#a89a78');
    px(c, x + 2, y - 3, 1, 8, '#4a2a16'); px(c, x + 3, y - 3, 4, 2, '#b02a1e');
  }

  function cropField(c, x, y, tx, ty, th) {
    px(c, x, y, S, S, '#7a5a34');
    for (var r = 0; r < 4; r++) { px(c, x, y + r * 4 + 2, S, 1, '#5a4024'); for (var k = 1; k < 16; k += 3) px(c, x + k, y + r * 4, 1, 2, th === THEMES.autumn ? '#d8b04a' : '#7ab04a'); }
  }
  function mapEdgeDark(c, x, y) { px(c, x, y, S, S, '#0c0c10'); }

  // small shape helpers
  function blob(c, cx, cy, rx, ry, col) {
    c.fillStyle = col;
    for (var yy = -ry; yy <= ry; yy++) {
      var w = Math.round(rx * Math.sqrt(1 - (yy * yy) / (ry * ry + 0.01)));
      c.fillRect(Math.round(cx - w), Math.round(cy + yy), w * 2, 1);
    }
  }
  function tri(c, cx, top, halfW, h, col) {
    c.fillStyle = col;
    for (var i = 0; i < h; i++) { var w = Math.round(halfW * (i / h)); c.fillRect(cx - w, top + i, w * 2 || 1, 1); }
  }
  T.blob = blob; T.tri = tri;

  // ---------- tile table ----------
  // solid: blocks movement. tall: extra art drawn in the y-sorted pass. water: for shore logic.
  T.DEF = {
    '.': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th); } },
    ',': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th, true); } },
    'f': { draw: flowers },
    ':': { draw: dirt },
    '=': { draw: pave },
    '~': { draw: water, solid: true, water: true },
    'w': { draw: deep, solid: true, water: true },
    'r': { draw: reeds, solid: true, water: true },
    's': { draw: sand },
    'T': { draw: treeBase, tall: treeTall, solid: true },
    'P': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th); px(c, x + 7, y + 10, 2, 5, '#5a3a20'); }, tall: pineTall, solid: true },
    'b': { draw: bamboo, solid: true },
    'H': { draw: poplarBase, tall: poplarTall, solid: true },
    'm': { draw: rock, solid: true },
    'M': { draw: mountain, solid: true },
    '^': { draw: roof, tall: roofOver, solid: true },
    'Z': { draw: roof, tall: roofOver, solid: true },
    'z': { draw: roof, tall: roofOver, solid: true },
    'v': { draw: roof, tall: roofOver, solid: true },
    'W': { draw: wallPlaster, solid: true, wall: true },
    'O': { draw: wallPlaster, solid: true, wall: true },
    'R': { draw: wallRed, tall: wallRedOver, solid: true, wall: true },
    '#': { draw: wallStone, solid: true, wall: true },
    // the tower over the passage hides anyone in the passage or on the road behind it (sorted after its own row)
    'G': { draw: cityGate, tall: cityGateOver, sortDy: 17 },
    'D': { draw: door },
    'd': { draw: door, solid: true, shut: true },   // a house's own door, shut: nobody lives there for the player to visit
    'u': { draw: stall, tall: stallTall, solid: true },
    'i': { draw: pillar, tall: pillarTall, solid: true },   // a column of a great hall
    'n': { draw: floorWood },
    'N': { draw: floorStone },
    'K': { draw: carpet },
    'X': { draw: interiorWall, solid: true },
    'x': { draw: voidT, solid: true },
    't': { draw: table, solid: true },
    'c': { draw: counter, solid: true },
    'k': { draw: bed, solid: true },   // a run of 'k' two rows deep is one bed (two wide), or a long sleeping platform
    'h': { draw: shelf, solid: true },
    'j': { draw: jar, solid: true },
    'F': { draw: fence, solid: true },
    'B': { draw: bridge, water: true },
    'S': { draw: stairs },
    'p': { draw: well, solid: true },
    'L': { draw: function (c, x, y, tx, ty, th, m) { if (m.interior) floorWood(c, x, y, tx, ty); else pave(c, x, y, tx, ty); }, tall: lanternTall, solid: true },
    'Y': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th); }, tall: bannerTall, solid: true },
    'J': { draw: function (c, x, y, tx, ty, th, m) { if (m.get(tx, ty + 1) === '=' || m.get(tx, ty - 1) === '=') pave(c, x, y, tx, ty); else grass(c, x, y, tx, ty, th); }, tall: wineFlagTall, solid: true },
    'A': { draw: altar, solid: true },
    'U': { draw: function (c, x, y, tx, ty) { floorStone(c, x, y, tx, ty); }, tall: statueTall, solid: true },
    'g': { draw: grave, solid: true },
    'e': { draw: deadTree, solid: true },
    'o': { draw: boat, solid: true, water: true },
    'I': { draw: function (c, x, y, tx, ty, th, m) { grass(c, x, y, tx, ty, th); }, tall: signTall, solid: true },
    'V': { draw: tent, solid: true },
    'y': { draw: cropField },
    '_': { draw: mapEdgeDark, solid: true },
    'C': { draw: function (c, x, y, tx, ty, th, m) { px(c, x, y, S, S, '#4a4a2a'); for (var i = 0; i < 5; i++) px(c, x + Math.floor(U.hash2(tx + i, ty, 70) * 13), y + Math.floor(U.hash2(tx, ty + i, 71) * 13), 3, 1, '#6a6a3a'); var nb = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'C'; }; if (!nb(0, -1)) px(c, x, y, S, 2, '#5a4a30'); if (!nb(-1, 0)) px(c, x, y, 2, S, '#5a4a30'); if (!nb(1, 0)) px(c, x + 14, y, 2, S, '#5a4a30'); if (!nb(0, 1)) px(c, x, y + 14, S, 2, '#5a4a30'); }, solid: true },
    'Q': { draw: function (c, x, y, tx, ty, th, m) { if (m.interior) floorStone(c, x, y, tx, ty); else grass(c, x, y, tx, ty, th); }, tall: steleTall, solid: true }
  };

  T.isWaterChar = function (ch) { var d = T.DEF[ch]; return !!(d && d.water && ch !== 'B'); };
  T.isWallChar = function (ch) { var d = T.DEF[ch]; return !!(d && d.wall) || ch === 'D'; };
  T.solid = function (ch) { var d = T.DEF[ch]; return !d || !!d.solid; };

  // Bake a map's ground layer into a canvas.
  T.bake = function (map) {
    var w = map.w, h = map.h;
    var cv = U.makeCanvas(w * S, h * S);
    var c = cv.getContext('2d');
    var th = THEMES[map.theme] || THEMES.spring;
    for (var ty = 0; ty < h; ty++) for (var tx = 0; tx < w; tx++) {
      var ch = map.get(tx, ty);
      var d = T.DEF[ch] || T.DEF['.'];
      d.draw(c, tx * S, ty * S, tx, ty, th, map, ch);
    }
    // second pass: what overhangs its own tile (eave corners, ridge ornaments, wall copings), so later tiles cannot cover it
    for (ty = 0; ty < h; ty++) for (tx = 0; tx < w; tx++) {
      ch = map.get(tx, ty); d = T.DEF[ch];
      if (d && d.over) d.over(c, tx * S, ty * S, tx, ty, th, map, ch);
    }
    return cv;
  };

  // Draw animated water glints on visible water tiles.
  T.animateWater = function (c, map, camX, camY, time) {
    var x0 = Math.floor(camX / S), y0 = Math.floor(camY / S);
    for (var ty = y0; ty < y0 + 16; ty++) for (var tx = x0; tx < x0 + 21; tx++) {
      var ch = map.get(tx, ty);
      if (ch !== '~' && ch !== 'w' && ch !== 'r') continue;
      var ph = U.hash2(tx, ty, 99) * 6.28;
      var k = Math.sin(time * 2 + ph);
      if (k > 0.55) {
        var gx = tx * S - camX + 3 + Math.floor(U.hash2(tx, ty, 98) * 8), gy = ty * S - camY + 5 + Math.floor(U.hash2(tx, ty, 97) * 7);
        c.fillStyle = 'rgba(220,240,255,' + ((k - 0.55) * 1.6).toFixed(2) + ')';
        c.fillRect(Math.round(gx + k * 2), gy, 3, 1);
      }
    }
  };
})();
