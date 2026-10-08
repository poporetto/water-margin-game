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
    // crown spans from y-12 to y+9 (drawn in sorted pass)
    var t = th.tree;
    var cy = y - 3;
    blob(c, x + 8, cy, 8, 9, t[0]);
    blob(c, x + 7, cy - 2, 7, 7, t[1]);
    blob(c, x + 6, cy - 4, 4, 4, t[2]);
    px(c, x + 3, cy + 3, 2, 1, t[2]); px(c, x + 11, cy - 1, 2, 1, t[2]); px(c, x + 9, cy + 5, 2, 1, t[0]);
  }
  function pineTall(c, x, y, tx, ty, th) {
    var dark = th === THEMES.snow ? '#2f4f42' : '#1f4a33', mid = th === THEMES.snow ? '#456c5a' : '#2e6644', lite = th === THEMES.snow ? '#eef4f8' : '#4a8a5a';
    for (var i = 0; i < 4; i++) {
      var w = 3 + i * 2, yy = y - 12 + i * 5;
      tri(c, x + 8, yy, w, 6, dark);
      tri(c, x + 8, yy, w - 1, 4, mid);
      px(c, x + 8 - w + 2, yy + 5, 2, 1, lite);
    }
  }
  // the white poplar (白楊樹): a tall, narrow tree with a pale, dark-eyed trunk — the guide through the Zhu maze
  function poplarBase(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    c.fillStyle = 'rgba(0,0,0,0.22)'; c.beginPath(); c.ellipse(x + 8, y + 13, 5, 2, 0, 0, Math.PI * 2); c.fill();
    px(c, x + 7, y + 2, 3, 12, '#e8e4d8'); px(c, x + 9, y + 2, 1, 12, '#b8b4a8');
    px(c, x + 7, y + 6, 2, 1, '#3a3630'); px(c, x + 8, y + 10, 2, 1, '#3a3630');
  }
  function poplarTall(c, x, y) {
    px(c, x + 7, y - 6, 3, 9, '#ecebe2'); px(c, x + 9, y - 6, 1, 9, '#b8b4a8'); px(c, x + 7, y - 3, 2, 1, '#3a3630');
    blob(c, x + 8, y - 13, 5, 9, '#7a9a70'); blob(c, x + 7, y - 15, 4, 7, '#b4c8a4'); blob(c, x + 7, y - 19, 2, 3, '#e0e8d4');
    px(c, x + 5, y - 10, 1, 2, '#e0e8d4'); px(c, x + 10, y - 13, 1, 2, '#e0e8d4');
  }
  function bamboo(c, x, y, tx, ty, th) {
    grass(c, x, y, tx, ty, th);
    for (var i = 0; i < 4; i++) {
      var bx = x + 1 + i * 4 + Math.floor(U.hash2(tx, ty + i, 70) * 2);
      px(c, bx, y, 2, S, i % 2 ? '#6fa04a' : '#5a8a3a');
      for (var k = 2; k < 16; k += 5) px(c, bx, y + k, 2, 1, '#3d6a2a');
      px(c, bx + 2, y + 3 + i * 3 % 12, 3, 1, '#8ac060');
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
    px(c, x, y, S, S, '#e6dcc4');
    px(c, x, y, S, 2, '#6a3e22');       // beam under the eave
    px(c, x, y + 14, S, 2, '#7a6a58');   // plinth
    px(c, x, y + 13, S, 1, '#b8ab90');
    var l = m.get(tx - 1, ty), r = m.get(tx + 1, ty);
    if (!T.isWallChar(l)) px(c, x, y, 2, S, '#6a3e22');
    if (!T.isWallChar(r)) px(c, x + 14, y, 2, S, '#6a3e22');
    if (ch === 'O') { // lattice window
      px(c, x + 3, y + 4, 10, 8, '#5a3820');
      px(c, x + 4, y + 5, 8, 6, '#efe3c0');
      c.fillStyle = '#5a3820';
      c.fillRect(x + 6, y + 5, 1, 6); c.fillRect(x + 9, y + 5, 1, 6); c.fillRect(x + 4, y + 7, 8, 1); c.fillRect(x + 4, y + 9, 8, 1);
    }
  }
  function wallRed(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#9c2f25');
    px(c, x, y, S, 2, '#5c1a14');
    px(c, x, y + 14, S, 2, '#6b5a48');
    px(c, x + 2, y + 2, 3, 12, '#b8463a'); px(c, x + 11, y + 2, 3, 12, '#b8463a');
    px(c, x + 2, y + 2, 1, 12, '#d0604f');
  }
  function wallStone(c, x, y, tx, ty, th, m) {
    px(c, x, y, S, S, '#8a8478');
    c.fillStyle = '#6a655b';
    for (var r = 0; r < 4; r++) {
      c.fillRect(x, y + r * 4 + 3, S, 1);
      var o = (r + ty) % 2 ? 0 : 5;
      c.fillRect(x + o, y + r * 4, 1, 3); c.fillRect(x + o + 8, y + r * 4, 1, 3);
    }
    c.fillStyle = '#a49e90';
    for (r = 0; r < 4; r++) c.fillRect(x + 1, y + r * 4, 14, 1);
    if (m.get(tx, ty - 1) !== '#') { px(c, x, y, S, 3, '#5d584f'); for (var k = 0; k < 16; k += 4) px(c, x + k, y - 2, 3, 2, '#6a655b'); }
  }
  function cityGate(c, x, y, tx, ty, th, m) {
    px(c, x, y, S, S, '#3a2a1e');
    px(c, x, y, S, 2, '#5d584f');
    px(c, x + 1, y + 2, 14, 14, '#24180f');
    pave(c, x + 0, y + 10, tx, ty); // threshold peeking
    px(c, x, y + 10, S, 6, '#7d7a72');
  }
  function roof(c, x, y, tx, ty, th, m, ch) {
    var pal = ch === 'Z' ? ['#c99a2e', '#e8bf4a', '#9a7020', '#7a5418'] :
              ch === 'z' ? ['#a88d5a', '#c4aa72', '#857048', '#6a5838'] :
              ch === 'v' ? ['#7a3a2a', '#9a4e38', '#5a2a1e', '#401a12'] :
                           ['#5b6476', '#7b8598', '#424a5a', '#2f3542'];
    var R = function (dx, dy) { var q = m.get(tx + dx, ty + dy); return q === ch; };
    px(c, x, y, S, S, pal[0]);
    if (ch === 'z') { // thatch: streaky straw
      for (var i = 0; i < 16; i += 2) px(c, x + i, y, 1, S, i % 4 ? pal[1] : pal[2]);
      for (var j = 3; j < 16; j += 5) px(c, x, y + j, S, 1, pal[2]);
    } else {
      // rows of curved tiles
      for (var row = 0; row < 16; row += 4) {
        px(c, x, y + row + 3, S, 1, pal[2]);
        for (var col = (row / 4) % 2 ? 2 : 0; col < 16; col += 4) { px(c, x + col, y + row, 2, 3, pal[1]); px(c, x + col, y + row, 1, 3, U.shade(pal[1], 0.15)); }
      }
    }
    if (!R(0, -1)) { // ridge
      px(c, x, y, S, 4, pal[3]); px(c, x, y + 1, S, 1, pal[2]);
      if (!R(-1, 0)) { px(c, x - 0, y - 3, 3, 3, pal[3]); px(c, x, y - 4, 2, 1, pal[3]); } // upturned ridge ends
      if (!R(1, 0)) { px(c, x + 13, y - 3, 3, 3, pal[3]); px(c, x + 14, y - 4, 2, 1, pal[3]); }
    }
    if (!R(0, 1)) { // eave
      px(c, x, y + 13, S, 3, pal[3]);
      for (var k = 1; k < 16; k += 3) px(c, x + k, y + 13, 1, 2, pal[1]);
      if (!R(-1, 0)) { px(c, x - 2, y + 11, 3, 3, pal[3]); }
      if (!R(1, 0)) { px(c, x + 15, y + 11, 3, 3, pal[3]); }
    }
    if (!R(-1, 0)) px(c, x, y, 1, S, pal[3]);
    if (!R(1, 0)) px(c, x + 15, y, 1, S, pal[3]);
  }
  function door(c, x, y, tx, ty, th, m) {
    var wallUp = m.get(tx, ty - 1);
    var outdoorWall = T.isWallChar(m.get(tx - 1, ty)) || T.isWallChar(m.get(tx + 1, ty)) || wallUp === '^' || wallUp === 'z' || wallUp === 'Z' || wallUp === 'v';
    if (outdoorWall) {
      px(c, x, y, S, S, '#e6dcc4');
      px(c, x, y, S, 2, '#6a3e22');
      px(c, x + 2, y + 2, 12, 14, '#4a2a16');
      px(c, x + 3, y + 3, 5, 13, '#7a4a28'); px(c, x + 8, y + 3, 5, 13, '#7a4a28');
      px(c, x + 7, y + 8, 1, 2, '#d8b36a'); px(c, x + 8, y + 8, 1, 2, '#d8b36a');
      px(c, x + 3, y + 3, 10, 1, '#94603a');
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
  function bed(c, x, y, tx, ty) {
    floorWood(c, x, y, tx, ty);
    px(c, x + 1, y + 1, 14, 14, '#5a3218'); px(c, x + 2, y + 2, 12, 12, '#c8b8a0'); px(c, x + 3, y + 3, 10, 3, '#f0e8da'); px(c, x + 2, y + 7, 12, 7, '#3a5a8a'); px(c, x + 2, y + 7, 12, 1, '#5a7aaa');
  }
  function shelf(c, x, y, tx, ty) {
    px(c, x, y, S, S, '#4a2a16');
    for (var r = 0; r < 3; r++) {
      px(c, x + 1, y + 1 + r * 5, 14, 4, '#2a180c');
      for (var k = 0; k < 4; k++) px(c, x + 2 + k * 3, y + 2 + r * 5, 2, 3, ['#c84a3a', '#d8b36a', '#5a8ac8', '#e8e0d0'][(k + r + tx) % 4]);
    }
  }
  function jar(c, x, y, tx, ty, th, m) {
    var under = m.get(tx, ty + 1);
    if (m.interior) floorWood(c, x, y, tx, ty); else dirt(c, x, y, tx, ty, th, m);
    blob(c, x + 8, y + 9, 6, 6, '#6a4a2a'); blob(c, x + 7, y + 8, 4, 4, '#8a6a42');
    px(c, x + 5, y + 2, 6, 3, '#4a3018'); px(c, x + 6, y + 1, 4, 1, '#c84a3a');
  }
  function fence(c, x, y, tx, ty, th, m) {
    grass(c, x, y, tx, ty, th);
    var F = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'F'; };
    var horiz = F(-1, 0) || F(1, 0) || !(F(0, -1) || F(0, 1));
    if (horiz) {
      px(c, x, y + 6, S, 2, '#8a6038'); px(c, x, y + 10, S, 2, '#8a6038');
      px(c, x + 2, y + 4, 2, 10, '#6a4424'); px(c, x + 12, y + 4, 2, 10, '#6a4424');
    } else {
      px(c, x + 6, y, 2, S, '#8a6038'); px(c, x + 9, y, 2, S, '#8a6038');
      px(c, x + 5, y + 2, 6, 2, '#6a4424'); px(c, x + 5, y + 11, 6, 2, '#6a4424');
    }
  }
  function bridge(c, x, y, tx, ty, th, m) {
    var vert = T.isWaterChar(m.get(tx - 1, ty)) && T.isWaterChar(m.get(tx + 1, ty));
    water(c, x, y, tx, ty, th, m);
    if (vert) {
      px(c, x + 1, y, 14, S, '#9a6a3c');
      for (var i = 0; i < 16; i += 3) px(c, x + 1, y + i, 14, 1, '#7a4e28');
      px(c, x, y, 2, S, '#5a3418'); px(c, x + 14, y, 2, S, '#5a3418');
    } else {
      px(c, x, y + 1, S, 14, '#9a6a3c');
      for (var j = 0; j < 16; j += 3) px(c, x + j, y + 1, 1, 14, '#7a4e28');
      px(c, x, y, S, 2, '#5a3418'); px(c, x, y + 14, S, 2, '#5a3418');
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
    px(c, x + 7, y - 6, 2, 20, '#3a2a1e');
    px(c, x + 4, y - 10, 8, 6, '#c8392a'); px(c, x + 5, y - 9, 6, 4, '#f08a3a'); px(c, x + 6, y - 11, 4, 1, '#3a2a1e'); px(c, x + 6, y - 4, 4, 1, '#d8b36a');
  }
  function bannerTall(c, x, y, tx, ty, th, m) {
    // "Act on behalf of Heaven" banner pole (替天行道)
    px(c, x + 7, y - 24, 2, 38, '#4a2a16');
    var wave = Math.sin((WM.time || 0) * 3 + tx) * 1.5;
    px(c, x + 9, y - 22, 9, 22, '#c8a02a');
    px(c, x + 10, y - 21, 7, 20, '#b02a1e');
    c.fillStyle = '#f0d890';
    for (var i = 0; i < 4; i++) c.fillRect(x + 12 + Math.round(wave * (i / 4)), y - 19 + i * 5, 3, 3);
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
    px(c, x + 2, y + 9, 12, 5, '#5a564e'); px(c, x + 2, y + 9, 12, 1, '#7a766c');
    px(c, x + 4, y - 14, 8, 23, '#8a867a'); px(c, x + 4, y - 14, 8, 2, '#a8a496'); px(c, x + 11, y - 14, 1, 23, '#6a665c');
    for (var i = 0; i < 6; i++) px(c, x + 6 + (i % 2) * 2, y - 10 + i * 3, 2, 1, '#4a463e');
  }
  function boat(c, x, y, tx, ty, th, m) {
    water(c, x, y, tx, ty, th, m);
    blob(c, x + 8, y + 9, 8, 4, '#5a3418'); px(c, x + 1, y + 7, 14, 2, '#8a5a2c'); px(c, x + 3, y + 8, 10, 2, '#3a200e');
  }
  function signTall(c, x, y) {
    px(c, x + 7, y + 4, 2, 10, '#4a2a16');
    px(c, x + 2, y - 4, 12, 9, '#6a3a1c'); px(c, x + 3, y - 3, 10, 7, '#d8c49a');
    px(c, x + 5, y - 2, 6, 1, '#3a200e'); px(c, x + 5, y, 6, 1, '#3a200e'); px(c, x + 5, y + 2, 4, 1, '#3a200e');
  }
  function tent(c, x, y, tx, ty, th, m) {
    grass(c, x, y, tx, ty, th);
    tri(c, x + 8, y, 8, 15, '#d8d0b8'); tri(c, x + 8, y + 2, 3, 13, '#5a4a3a'); px(c, x + 7, y, 2, 2, '#b02a1e');
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
    '^': { draw: roof, solid: true },
    'Z': { draw: roof, solid: true },
    'z': { draw: roof, solid: true },
    'v': { draw: roof, solid: true },
    'W': { draw: wallPlaster, solid: true, wall: true },
    'O': { draw: wallPlaster, solid: true, wall: true },
    'R': { draw: wallRed, solid: true, wall: true },
    '#': { draw: wallStone, solid: true, wall: true },
    'G': { draw: cityGate },
    'D': { draw: door },
    'n': { draw: floorWood },
    'N': { draw: floorStone },
    'K': { draw: carpet },
    'X': { draw: interiorWall, solid: true },
    'x': { draw: voidT, solid: true },
    't': { draw: table, solid: true },
    'c': { draw: counter, solid: true },
    'k': { draw: bed, solid: true },
    'h': { draw: shelf, solid: true },
    'j': { draw: jar, solid: true },
    'F': { draw: fence, solid: true },
    'B': { draw: bridge, water: true },
    'S': { draw: stairs },
    'p': { draw: well, solid: true },
    'L': { draw: function (c, x, y, tx, ty, th, m) { if (m.interior) floorWood(c, x, y, tx, ty); else pave(c, x, y, tx, ty); }, tall: lanternTall, solid: true },
    'Y': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th); }, tall: bannerTall, solid: true },
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
    // second pass: roof ornaments that overhang (ridge tips) were drawn in-place; nothing else.
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
