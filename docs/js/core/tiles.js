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
    // the world map, painted as on an old silk map: pale ochre ground, ink-green trees
    world: { g0: '#cfc59c', g1: '#c2b78c', g2: '#dbd2ae', g3: '#a89d74', flower: ['#c8a040', '#b8584a', '#e8e0c8'], tree: ['#2f5440', '#41684e', '#5e8466'], dirt: ['#a0603c', '#8a4e30', '#b8744c'] },
    north: { g0: '#8a9a5a', g1: '#76844a', g2: '#a0b06a', g3: '#5e6a3a', flower: ['#e0d890', '#c0c0d0', '#ffffff'], tree: ['#3a5a3a', '#4a704a', '#6a8a5a'], dirt: ['#a89878', '#8c7e62', '#beae8e'] }
  };
  T.THEMES = THEMES;

  var edgeColours = {};
  function px(c, x, y, w, h, col) {
    c.fillStyle = col; c.fillRect(x, y, w, h);
    // Half-unit bevels are one physical pixel at 32px density, including procedural seasonal props.
    if (WM.ART_SCALE === 2 && w >= 3 && h >= 3 && /^#[0-9a-f]{6}$/i.test(col)) {
      var edge = edgeColours[col] || (edgeColours[col] = [U.shade(col, 0.07), U.shade(col, -0.08)]);
      c.fillStyle = edge[0]; c.fillRect(x + 0.5, y, w - 1, 0.5);
      c.fillStyle = edge[1]; c.fillRect(x + 0.5, y + h - 0.5, w - 1, 0.5);
    }
  }

  // ---------- individual tile painters ----------
  function grass(c, x, y, tx, ty, th, rich) {
    // Use the same ground under procedural props as on adjacent painted tiles.
    var theme = Object.keys(THEMES).filter(function (k) { return THEMES[k] === th; })[0];
    if (drawGroundArt(c, x, y, tx, ty, { theme: theme }, rich ? ',' : '.', 0)) return;
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
    if (m && m.def && m.def.world) {   // on the world map a road is a full-width beaten track, edged in ink so it reads against the silk
      var rd = function (dx, dy) { var q = m.get(tx + dx, ty + dy); return q === ':' || q === 'B' || q === 'D' || q === 'G' || q === null; };
      if (SHEETS.seasonalGround) blit(c, SHEETS.seasonalGround, [3, 2], S, S, x, y);   // the silk-map road texture, when the art is in
      else {
        px(c, x, y, S, S, '#b58a58');
        for (var j = 0; j < 5; j++) px(c, x + Math.floor(U.hash2(tx * 7 + j, ty, 23) * 14), y + Math.floor(U.hash2(tx, ty * 7 + j, 24) * 15), 2, 1, j % 2 ? '#9c7244' : '#c9a170');
      }
      if (!rd(0, -1)) px(c, x, y, S, 1, '#6e4a2a'); if (!rd(0, 1)) px(c, x, y + 15, S, 1, '#6e4a2a');
      if (!rd(-1, 0)) px(c, x, y, 1, S, '#6e4a2a'); if (!rd(1, 0)) px(c, x + 15, y, 1, S, '#6e4a2a');
      return;
    }
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
  function worldWater(c, x, y, tx, ty, th, m, deepSea) {
    // water as the old maps paint it: rivers with flowing lines, the sea in rows of curling fish-scale waves
    px(c, x, y, S, S, deepSea ? '#3a6482' : '#4a7c96');
    if (deepSea) {
      for (var r = 0; r < 4; r++) for (var k = -1; k < 3; k++) {
        var ox = x + k * 8 + (r % 2) * 4, oy = y + r * 4;
        px(c, ox + 1, oy + 2, 6, 1, '#d6e4e0'); px(c, ox, oy + 3, 1, 1, '#d6e4e0'); px(c, ox + 7, oy + 3, 1, 1, '#d6e4e0'); px(c, ox + 2, oy + 1, 4, 1, '#5e8aa4');
      }
    } else {
      for (var i = 0; i < 3; i++) { var wy = y + 3 + i * 5, sh = (tx * 3 + i * 5) % 6; px(c, x + sh, wy, 5, 1, '#d6e4e0'); px(c, x + sh + 5, wy - 1, 2, 1, '#d6e4e0'); px(c, x + sh + 9, wy, 4, 1, '#9cc0c8'); }
    }
    var isLand = function (dx, dy) { var ch = m.get(tx + dx, ty + dy); return ch && !T.isWaterChar(ch); };
    if (isLand(0, -1)) { px(c, x, y, S, 1, '#2a3a3a'); }
    if (isLand(0, 1)) { px(c, x, y + 15, S, 1, '#2a3a3a'); }
    if (isLand(-1, 0)) { px(c, x, y, 1, S, '#2a3a3a'); }
    if (isLand(1, 0)) { px(c, x + 15, y, 1, S, '#2a3a3a'); }
  }
  function water(c, x, y, tx, ty, th, m) {
    if (m && m.def && m.def.world) return worldWater(c, x, y, tx, ty, th, m, false);
    if (drawGroundArt(c, x, y, tx, ty, m, '~', 0)) return;
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
  function deep(c, x, y, tx, ty, th, m) {
    if (m && m.def && m.def.world) return worldWater(c, x, y, tx, ty, th, m, true);
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
    if (m && m.def && m.def.world) {
      if(SHEETS.worldIcons){grass(c,x,y,tx,ty,th);U.drawArt(c,SHEETS.worldIcons,48*(1+(U.hash2(tx,ty,61)>.5?1:0)),96,48,32,x,y+5,16,11);return;}
      // blue-and-green peaks (青綠山水) rising from the silk, each tile a peak or two outlined in ink
      grass(c, x, y, tx, ty, th);
      var h1 = U.hash2(tx, ty, 61), pk = function (cx, base, hgt, half) {
        for (var r = 0; r < hgt; r++) {
          var w = Math.max(1, Math.round(half * r / hgt));
          px(c, cx - w, base - hgt + r, w, 1, '#7aa89a'); px(c, cx, base - hgt + r, w, 1, '#3f7064');   // lit face, shadowed face
          px(c, cx - w - 1, base - hgt + r, 1, 1, '#24342e'); px(c, cx + w, base - hgt + r, 1, 1, '#24342e');   // ink outline
        }
        px(c, cx - 1, base - hgt, 2, 2, '#3a6a8a');   // the azurite peak
      };
      pk(x + 5 + Math.floor(h1 * 3), y + 15, 10 + Math.floor(h1 * 4), 6);
      pk(x + 11, y + 15, 7 + Math.floor(U.hash2(tx, ty, 62) * 3), 4);
      return;
    }
    // fills the tile with rocky cliff; edges blend to neighbours
    var snow = th === THEMES.snow;
    var base = snow ? '#a9b3bf' : '#8d7c66', lite = snow ? '#f0f5f9' : '#b1a084', dark = snow ? '#6c7888' : '#5f5243';
    px(c, x, y, S, S, base);
    for (var i = 0; i < 5; i++) {
      var rx = Math.floor(U.hash2(tx * 3 + i, ty, 80) * 12), ry = Math.floor(U.hash2(tx, ty * 3 + i, 81) * 12);
      px(c, x + rx, y + ry, 4, 1, lite); px(c, x + rx + 1, y + ry + 1, 3, 2, dark);
    }
    // Eight distinct cells sample a continuous face instead of enlarging a rock fragment.
    if(SHEETS.cliffFaces)U.drawArt(c,SHEETS.cliffFaces,((tx%4+4)%4)*16,(snow?2:th===THEMES.autumn?1:0)*32+((ty%2+2)%2)*16,16,16,x,y,16,16);
    var topEdge=m.get(tx,ty-1)!=='M',bottomEdge=m.get(tx,ty+1)!=='M';
    for(var k=0;k<32;k++){
      var edgeNoise=U.hash2(tx*32+k,ty,873),depth=.5+Math.floor(edgeNoise*4)*.5;
      if(topEdge){c.fillStyle=snow?'#e9f0f5':th.g3;c.fillRect(x+k*.5,y,.5,depth);if(edgeNoise>.75){c.fillStyle=snow?'#b8c9d6':th.g1;c.fillRect(x+k*.5,y+depth,.5,.5);}}
      if(bottomEdge){c.fillStyle=dark;c.fillRect(x+k*.5,y+16-depth,.5,depth);}
      if(k<32 && m.get(tx-1,ty)!=='M'){c.fillStyle=dark;c.fillRect(x,y+k*.5,edgeNoise>.6?1:.5,.5);}
      if(k<32 && m.get(tx+1,ty)!=='M'){c.fillStyle=dark;c.fillRect(x+15.5,y+k*.5,.5,.5);}
    }
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
    // shut: the two leaves are drawn across the passage (a scene sets the flag 'shut:<map>')
    if (WM.state && WM.state.flags && WM.state.flags['shut:' + m.id]) {
      px(c, x, y + 2, 16, 14, '#7a2a1c'); px(c, x, y + 2, 16, 1, '#9a4a32');
      if (!G(-1)) px(c, x, y + 2, 1, 14, '#3a1a10');
      if (!G(1)) px(c, x + 15, y + 2, 1, 14, '#3a1a10');
      c.fillStyle = '#d8b36a';
      for (var sr = 0; sr < 4; sr++) for (var sc = 0; sc < 3; sc++) c.fillRect(x + 3 + sc * 5, y + 4 + sr * 3, 1, 1);   // studs
      if (G(1) && !G(2)) { px(c, x + 14, y + 8, 4, 2, '#4a2a14'); }   // the bar across the middle of the two leaves
      if (!G(-1)) px(c, x + 15, y + 2, 1, 14, '#2a120a');           // where the leaves meet
    }
    // a temple's gate hall: its roof also covers the guardian kings standing in the wings on either side
    var U = function (dx) { return m.get(tx + dx, ty) === 'U'; };
    var x0 = x - (G(-1) ? 0 : U(-1) ? 22 : 6), x1 = x + 16 + (G(1) ? 0 : U(1) ? 22 : 6);
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
  function surface(c, x, y, choices, tx, ty) {
    if (!SHEETS || !SHEETS.surfaces) return false;
    var index = choices[Math.floor(U.hash2(tx || 0, ty || 0, 919) * choices.length) % choices.length];
    blit(c, SHEETS.surfaces, [index % 4, Math.floor(index / 4)], S, S, x, y);
    return true;
  }
  function floorWood(c, x, y, tx, ty) {
    if (surface(c, x, y, [8,9,10], tx, ty)) return;
    px(c, x, y, S, S, '#a3744a');
    c.fillStyle = '#8a5f38';
    for (var r = 0; r < 4; r++) { c.fillRect(x, y + r * 4 + 3, S, 1); c.fillRect(x + ((r * 5 + tx * 3) % 16), y + r * 4, 1, 3); }
    c.fillStyle = '#b8875a';
    for (r = 0; r < 4; r++) c.fillRect(x + 2, y + r * 4, 5, 1);
  }
  function floorStone(c, x, y, tx, ty) {
    if (surface(c, x, y, [12,13], tx, ty)) return;
    px(c, x, y, S, S, '#8e8c86');
    c.fillStyle = '#76746e'; c.fillRect(x, y + 15, S, 1); c.fillRect(x + 15, y, 1, S);
    c.fillStyle = '#a4a29b'; c.fillRect(x, y, S, 1); c.fillRect(x, y, 1, S);
  }
  function carpet(c, x, y, tx, ty, th, m) {
    var textured = surface(c, x, y, [11], tx, ty);
    if (!textured) px(c, x, y, S, S, '#8a2420');
    var K = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'K'; };
    if (!K(-1, 0)) px(c, x, y, 2, S, '#d8b36a');
    if (!K(1, 0)) px(c, x + 14, y, 2, S, '#d8b36a');
    if (!K(0, -1)) px(c, x, y, S, 2, '#d8b36a');
    if (!K(0, 1)) px(c, x, y + 14, S, 2, '#d8b36a');
    if (!textured && (tx + ty) % 2 === 0) { px(c, x + 6, y + 6, 4, 4, '#a8382c'); px(c, x + 7, y + 7, 2, 2, '#d8b36a'); }
  }
  function interiorWall(c, x, y, tx, ty, th, m) {
    var below = m.get(tx, ty + 1);
    if (below && below !== 'X' && below !== 'x') {
      // visible wall face
      if (surface(c, x, y, [15], tx, ty)) return;
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

  // A weeping willow with a crows' nest; a scene can fell it ('felled:<map>'), and then it lies on its side, roots in the air.
  function willowTall(c, x, y, tx, ty, th, m) {
    var t = WM.time || 0, felled = WM.state && WM.state.flags && WM.state.flags['felled:' + m.id];
    var bark = '#5a4a32', dark = '#3e3222', leaf = '#7a9a4a', leafD = '#5a7a3a', leafL = '#a0b860';
    if (felled) {
      c.fillStyle = 'rgba(30,20,10,0.55)'; c.beginPath(); c.ellipse(x + 8, y + 12, 6, 3, 0, 0, Math.PI * 2); c.fill();   // the hole it came out of
      px(c, x - 10, y + 8, 30, 4, bark); px(c, x - 10, y + 8, 30, 1, '#7a6448'); px(c, x - 10, y + 11, 30, 1, dark);   // the trunk on the ground
      for (var r = 0; r < 5; r++) { px(c, x - 14 + r, y + 3 + r * 2, 5, 1, dark); px(c, x - 15, y + 5 + r * 2, 2, 1, '#6a5038'); }   // roots, earth still on them
      for (var k = x + 14; k < x + 28; k += 2) px(c, k, y + 4 + ((k * 7) % 5), 1, 9, (k % 4) ? leaf : leafD);                   // the crown, crushed
      return;
    }
    px(c, x + 5, y - 14, 6, 28, bark); px(c, x + 5, y - 14, 2, 28, dark); px(c, x + 9, y - 8, 1, 20, '#7a6448');   // a thick old trunk
    px(c, x + 1, y - 17, 5, 2, bark); px(c, x + 10, y - 19, 6, 2, bark);
    blob(c, x + 8, y - 24, 18, 11, leafD); blob(c, x + 7, y - 27, 14, 7, leaf); blob(c, x + 4, y - 30, 7, 3, leafL);
    for (var k2 = x - 9; k2 <= x + 25; k2 += 2) {                                                              // the long hanging strands
      var len = 14 + Math.floor(U.hash2(k2, ty, 77) * 12), sway = Math.round(Math.sin(t * 1.3 + k2 * 0.4) * 1.5);
      px(c, k2, y - 20, 1, 5, (k2 % 4) ? leaf : leafD); px(c, k2 + sway, y - 15, 1, len - 5, (k2 % 4) ? leaf : leafD);
    }
    px(c, x + 12, y - 37, 9, 4, '#3a2a18'); px(c, x + 11, y - 36, 11, 1, '#5a4228'); px(c, x + 13, y - 38, 3, 1, '#3a2a18');   // the nest
    // crows: two perched (now and then lifting their wings), and one wheeling overhead
    var crow = function (cx, cy, up) { px(c, cx, cy, 4, 3, '#141414'); px(c, cx + 4, cy + 1, 1, 1, '#c8a040'); px(c, cx - 1, cy + 2, 1, 1, '#141414'); if (up) { px(c, cx - 2, cy - 2, 3, 2, '#141414'); px(c, cx + 3, cy - 2, 3, 2, '#141414'); } };
    crow(x + 15, y - 41, Math.sin(t * 3) > 0.85); crow(x - 2, y - 34, Math.sin(t * 2.3 + 1) > 0.9);
    var a = t * 0.9, ox = Math.round(Math.cos(a) * 18), oy = Math.round(Math.sin(a) * 5), fl = Math.sin(t * 9) > 0 ? 0 : 2;
    px(c, x + 8 + ox, y - 50 + oy, 2, 1, '#141414'); px(c, x + 6 + ox, y - 51 + oy + fl, 2, 1, '#141414'); px(c, x + 10 + ox, y - 51 + oy + fl, 2, 1, '#141414');
  }
  // the floor a piece of furniture stands on: boards if the room around it is boarded, else stone flags
  function floorUnder(c, x, y, tx, ty, m) {
    var wood = 0, stone = 0;
    [[0, 1], [-1, 0], [1, 0], [0, 2], [-2, 0], [2, 0]].forEach(function (d) { var q = m && m.get(tx + d[0], ty + d[1]); if (q === 'n') wood++; else if (q === 'N') stone++; });
    if (wood >= stone) floorWood(c, x, y, tx, ty); else floorStone(c, x, y, tx, ty);   // (boards, unless the room is stone: a gap in a carpet has neither)
  }
  // ---- a Buddhist hall: the great seated Buddha on his lotus throne, the offering altar, the censer, kneeling cushions ----
  function buddhaTall(c, x, y, tx, ty, th, m) {
    if (m.get(tx - 1, ty) === '1') return;
    var n = runOf(m, tx, ty, '1').n, k = n / 3, W = n * S, cx = x + W / 2, t = WM.time || 0;
    var R = function (dx, dy, w, h, col) { px(c, Math.round(cx + dx * k), Math.round(y + dy * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)), col); };
    // the flame-edged mandorla, and the halo behind the head
    c.fillStyle = '#9a3a1e'; c.beginPath(); c.ellipse(cx, y - 14 * k, 23 * k, 30 * k, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#c8a040'; c.beginPath(); c.ellipse(cx, y - 14 * k, 21 * k, 28 * k, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#e8cc70'; c.beginPath(); c.ellipse(cx, y - 14 * k, 17 * k, 24 * k, 0, 0, Math.PI * 2); c.fill();
    for (var f = -2; f <= 2; f++) R(f * 8 - 1, -44 + Math.abs(f) * 4, 2, 3, '#c8502a');                       // flame tips
    c.fillStyle = '#f4e4a0'; c.beginPath(); c.arc(cx, y - 27 * k, 8 * k, 0, Math.PI * 2); c.fill();              // halo
    // the lotus throne
    R(-22, 4, 44, 12, '#8a3a2e'); for (var p2 = -21; p2 < 21; p2 += 6) { R(p2, 4, 5, 6, '#d88a7a'); R(p2 + 1, 4, 3, 2, '#f0b8a8'); }
    R(-18, 10, 36, 2, '#c8a040'); R(-20, 12, 40, 4, '#6a2a20');
    // the seated figure: crossed legs, robe, hands at rest in the lap, the head with its topknot of wisdom
    R(-17, -2, 34, 8, '#c89a38'); R(-17, -2, 34, 2, '#e0b850'); R(-12, 3, 24, 2, '#a07a28');                // legs
    R(-11, -20, 22, 19, '#d8ac44'); R(-11, -20, 3, 19, '#e8c460'); R(8, -20, 3, 19, '#a8802c');                // robe
    R(-3, -18, 6, 10, '#c8302a'); R(-2, -17, 4, 1, '#e8c860');                                                 // inner robe
    R(-5, -6, 10, 4, '#e8c470'); R(-2, -6, 4, 2, '#f4dc90');                                                   // hands in the lap
    R(-5, -31, 10, 11, '#e0b450'); R(-5, -31, 10, 3, '#2a3a5a'); R(-2, -34, 4, 3, '#2a3a5a');                 // head, hair, topknot
    R(-3, -26, 2, 1, '#8a5a20'); R(1, -26, 2, 1, '#8a5a20'); R(-1, -23, 2, 1, '#a86a2a');                      // closed eyes, mouth
    R(-6, -27, 1, 5, '#c89a38'); R(5, -27, 1, 5, '#c89a38');                                                   // long ears
  }
  function offeringTall(c, x, y, tx, ty, th, m) {
    if (m.get(tx - 1, ty) === '2') return;
    var n = runOf(m, tx, ty, '2').n, W = n * S, X = x, cx = X + W / 2, t = WM.time || 0;
    px(c, X, y + 1, W, 3, '#5a1a10'); px(c, X, y + 4, W, 12, '#d8a830'); px(c, X, y + 4, W, 1, '#f0c848'); px(c, X, y + 15, W, 1, '#8a6a20');   // the yellow-draped altar
    for (var q = X + 3; q < X + W - 2; q += 5) px(c, q, y + 9, 2, 3, '#c8302a');                                  // embroidery
    px(c, cx - 3, y - 3, 6, 4, '#6a5a3a'); px(c, cx - 4, y - 4, 8, 1, '#8a7a50'); px(c, cx - 1, y - 7, 1, 3, '#e8e0d0');   // a small censer, and incense
    var flick = Math.sin(t * 8) > 0 ? 1 : 0;
    [X + 3, X + W - 5].forEach(function (cx2) { px(c, cx2, y - 5, 2, 6, '#c8302a'); px(c, cx2, y - 7 - flick, 2, 2, '#ffd060'); });   // candles
    if (n >= 3) { px(c, X + 9, y - 1, 5, 2, '#c8a040'); px(c, X + 10, y - 3, 1, 2, '#e85a3a'); px(c, X + 12, y - 3, 1, 2, '#f08a3a'); px(c, X + W - 14, y - 1, 5, 2, '#c8a040'); px(c, X + W - 13, y - 3, 2, 2, '#e8c040'); }   // fruit
  }
  function censerTall(c, x, y, tx, ty) {
    // a great bronze censer (香炉) on three legs, with incense smoke rising from it
    var t = WM.time || 0;
    px(c, x + 2, y + 2, 12, 9, '#5a4a30'); px(c, x + 2, y + 2, 12, 2, '#7a6a48'); px(c, x + 1, y + 1, 14, 2, '#4a3a24');
    px(c, x + 3, y + 11, 2, 4, '#4a3a24'); px(c, x + 11, y + 11, 2, 4, '#4a3a24'); px(c, x + 7, y + 11, 2, 3, '#4a3a24');
    px(c, x, y + 3, 2, 3, '#4a3a24'); px(c, x + 14, y + 3, 2, 3, '#4a3a24');                                                    // handles
    for (var i = 0; i < 4; i++) { var ph = (t * 0.5 + i / 4) % 1, sx = Math.round(x + 7 + Math.sin(t * 2 + i * 1.7) * 2); c.globalAlpha = 0.6 * (1 - ph); px(c, sx, Math.round(y - ph * 18), 2, 2, '#d8d8d0'); }
    c.globalAlpha = 1;
  }
  function cushion(c, x, y, tx, ty, th, m) {
    floorUnder(c, x, y, tx, ty, m);
    c.fillStyle = '#7a5a2a'; c.beginPath(); c.ellipse(x + 8, y + 9, 6, 4, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#c8a050'; c.beginPath(); c.ellipse(x + 8, y + 8, 5, 3, 0, 0, Math.PI * 2); c.fill();
    px(c, x + 5, y + 8, 6, 1, '#a8803a');
  }
  // ---- a Daoist hall: the Three Pure Ones (5), a goddess (6), a deity-king (7), the altar with the eight trigrams (8) ----
  // One seated deity, drawn to scale k about a centre (cx, y = top of the base row). kind: 'pure' (lotus crown,
  // long beard), 'lady' (phoenix crown, no beard), 'king' (the flat crown hung with bead tassels, a court tablet).
  function deity(c, cx, y, k, kind, robe, hold) {
    var R = function (dx, dy, w, h, col) { px(c, Math.round(cx + dx * k), Math.round(y + dy * k), Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k)), col); };
    var skin = '#ecd0a0', rl = U.shade(robe, 0.2), rd = U.shade(robe, -0.25);
    if (kind === 'pure') { c.fillStyle = 'rgba(232,200,96,0.55)'; c.beginPath(); c.arc(cx, y - 26 * k, 9 * k, 0, Math.PI * 2); c.fill(); }   // halo
    R(-15, 2, 30, 14, '#5a1a10'); R(-15, 2, 30, 1, '#c8a040'); R(-17, -6, 3, 9, '#c8a040'); R(14, -6, 3, 9, '#c8a040');   // throne, with finials
    R(-14, -8, 5, 10, robe); R(9, -8, 5, 10, robe);                                                                         // sleeves
    R(-11, -18, 22, 20, robe); R(-11, -18, 3, 20, rl); R(8, -18, 3, 20, rd); R(-12, -2, 24, 6, rd);                       // robe, lap
    R(-2, -16, 4, 13, kind === 'lady' ? '#e8e0d0' : '#c8a040');                                                             // inner robe
    R(-4, -8, 8, 4, skin);                                                                                                  // hands
    if (hold === 'pearl') { R(-2, -11, 4, 4, '#f4f0e8'); R(-1, -11, 1, 1, '#ffffff'); }
    else if (hold === 'ruyi') { R(-1, -13, 2, 7, '#c8a040'); R(-3, -14, 6, 2, '#e8c860'); }
    else if (hold === 'fan') { R(-4, -14, 8, 6, '#e8e0d0'); R(-1, -8, 2, 2, '#8a6a3a'); }
    else if (hold === 'tablet') { R(-1, -15, 3, 9, '#ece4cc'); }
    R(-5, -30, 10, 11, skin); R(-5, -30, 10, 3, '#1a1a1a');                                                                 // head, hair
    R(-3, -25, 2, 1, '#3a2a1a'); R(1, -25, 2, 1, '#3a2a1a');                                                                // eyes
    if (kind !== 'lady') R(-3, -21, 6, kind === 'pure' ? 8 : 5, kind === 'pure' ? '#e8e8e0' : '#2a2018');                   // beard
    else { R(-1, -21, 2, 1, '#c8302a'); R(-7, -28, 2, 8, '#1a1a1a'); R(5, -28, 2, 8, '#1a1a1a'); }                           // lips, hair falling
    if (kind === 'pure') { R(-4, -34, 8, 4, '#c8a040'); R(-3, -36, 2, 2, '#e8c860'); R(1, -36, 2, 2, '#e8c860'); }          // lotus crown
    else if (kind === 'lady') { R(-6, -35, 12, 5, '#c8a040'); R(-1, -37, 2, 2, '#c8302a'); R(-9, -33, 3, 2, '#e8c860'); R(6, -33, 3, 2, '#e8c860'); }   // phoenix crown
    else { R(-4, -33, 8, 3, '#1a1a1a'); R(-9, -35, 18, 2, '#1a1a1a'); for (var t = -8; t <= 8; t += 4) R(t, -33, 1, 4, '#c8a040'); }   // the tasselled crown
  }
  function canopy(c, X, y, W, top) {
    // the shrine's curtain: a yellow valance with a scalloped edge, red curtains drawn back at the sides
    px(c, X, top, W, 5, '#d8a830'); px(c, X, top, W, 1, '#f0c848');
    for (var q = X; q < X + W; q += 4) px(c, q + 1, top + 5, 2, 2, '#d8a830');
    px(c, X, top + 5, 3, y - top + 6, '#9a2a1e'); px(c, X + W - 3, top + 5, 3, y - top + 6, '#9a2a1e');
    px(c, X + 1, top + 5, 1, y - top + 6, '#c84a3a'); px(c, X + W - 2, top + 5, 1, y - top + 6, '#c84a3a');
  }
  function pureTall(c, x, y, tx, ty, th, m) {
    if (m.get(tx - 1, ty) === '5') return;
    var n = runOf(m, tx, ty, '5').n, W = n * S;
    canopy(c, x, y, W, y - 26);
    var looks = [['#3a4a8a', 'ruyi'], ['#9a2a1e', 'pearl'], ['#c8a040', 'fan']];
    for (var i = 0; i < n; i++) { var lk = n === 3 ? looks[i] : looks[(i + 1) % 3]; deity(c, x + i * S + 8, y, 0.5, 'pure', lk[0], lk[1]); }
  }
  function bigDeityTall(kind, ch, robe, hold) {
    return function (c, x, y, tx, ty, th, m) {
      if (m.get(tx - 1, ty) === ch) return;
      var n = runOf(m, tx, ty, ch).n, W = n * S, k = Math.min(1.25, Math.max(0.5, W / 34));
      canopy(c, x, y, W, Math.round(y - 42 * k));
      deity(c, x + W / 2, y, k, kind, robe, hold);
    };
  }
  function daoAltarTall(c, x, y, tx, ty, th, m) {
    if (m.get(tx - 1, ty) === '8') return;
    var n = runOf(m, tx, ty, '8').n, W = n * S, X = x, cx = X + W / 2, t = WM.time || 0;
    px(c, X, y + 1, W, 3, '#3a1e10'); px(c, X, y + 4, W, 12, '#1e2c4a'); px(c, X, y + 4, W, 1, '#c8a040'); px(c, X, y + 15, W, 1, '#10182a');
    // the taiji, and the trigrams on either side
    c.fillStyle = '#f0ece0'; c.beginPath(); c.arc(cx, y + 10, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#141414'; c.beginPath(); c.arc(cx, y + 10, 4, -Math.PI / 2, Math.PI / 2); c.fill();
    c.fillStyle = '#f0ece0'; c.beginPath(); c.arc(cx, y + 8, 2, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#141414'; c.beginPath(); c.arc(cx, y + 12, 2, 0, Math.PI * 2); c.fill();
    if (W >= 32) for (var g2 = 0; g2 < 3; g2++) { px(c, cx - 14, y + 7 + g2 * 3, 5, 1, '#c8a040'); px(c, cx + 9, y + 7 + g2 * 3, g2 === 1 ? 2 : 5, 1, '#c8a040'); if (g2 === 1) px(c, cx + 12, y + 10, 2, 1, '#c8a040'); }   // trigrams, where there is room
    px(c, cx - 3, y - 3, 6, 4, '#5a4a30'); px(c, cx - 1, y - 7, 1, 4, '#e8e0d0');                                   // incense
    var fl = Math.sin(t * 8) > 0 ? 1 : 0;
    [X + 2, X + W - 4].forEach(function (cx2) { px(c, cx2, y - 5, 2, 6, '#c8302a'); px(c, cx2, y - 7 - fl, 2, 2, '#ffd060'); });
  }
  // ---- a Song government hall: the official's dais and chair, his desk, and the great painted screen behind ----
  function runOf(m, tx, ty, ch) { var x0 = tx; while (m.get(x0 - 1, ty) === ch) x0--; var n = 1; while (m.get(x0 + n, ty) === ch) n++; return { x0: x0, n: n }; }
  function dais(c, x, y, tx, ty, th, m) {
    // a raised platform of polished boards; its front edge steps down to the hall floor
    px(c, x, y, S, S, '#7a4a2a'); for (var r = 0; r < 4; r++) px(c, x, y + r * 4 + 3, S, 1, '#6a3e22');
    px(c, x, y, S, 1, '#9a6a3e');
    var below = m.get(tx, ty + 1); if (below !== 'q' && below !== '0' && below !== 'a') { px(c, x, y + 13, S, 3, '#4a2a14'); px(c, x, y + 13, S, 1, '#a8784a'); }
  }
  function screenTall(c, x, y, tx, ty, th, m) {
    // one long screen across the run of 'E': a lacquer frame, and in it the sea and the rising sun (海水朝日)
    if (m.get(tx - 1, ty) === 'E') return;
    var n = runOf(m, tx, ty, 'E').n, W = n * S, X = x, top = y - 18, H = 32, cx = X + W / 2;
    px(c, X, top, W, H, '#4a160e'); px(c, X + 1, top + 1, W - 2, H - 2, '#c8a040'); px(c, X + 2, top + 2, W - 4, H - 4, '#e6d6aa');   // frame, gilt line, silk
    px(c, X + 2, top + 2, W - 4, 3, '#e8c86a');                                                                                     // gold sky at the top
    c.fillStyle = '#c8302a'; c.beginPath(); c.arc(cx, top + 11, 4, 0, Math.PI * 2); c.fill();                                     // the sun
    px(c, X + 6, top + 8, 7, 1, '#d8c8a0'); px(c, X + W - 14, top + 7, 8, 1, '#d8c8a0');                                         // thin clouds
    var sea = top + 15;
    px(c, X + 2, sea, W - 4, H - 17, '#2f6a6a');
    for (var k = X + 3; k < X + W - 4; k += 6) {                                                                                     // curling crests
      var o = (k * 7) % 3; px(c, k, sea + o, 4, 1, '#e8f0e8'); px(c, k + 3, sea + o + 1, 1, 1, '#e8f0e8');
      px(c, k + 1, sea + 5 + o, 3, 1, '#9ac8c0'); px(c, k + 2, sea + 9, 3, 1, '#4a8a86');
    }
    for (var j = 1; j < n; j++) px(c, X + j * S, top + 2, 1, H - 4, '#8a6a3a');                                                    // the folds between panels
    px(c, X - 1, top - 2, W + 2, 2, '#4a160e'); px(c, X + 2, top + H, 2, 2, '#3a1208'); px(c, X + W - 4, top + H, 2, 2, '#3a1208');  // cap and feet
  }
  function chairTall(c, x, y, tx, ty, th, m) {
    // the official's great chair: a high carved back, armrests, a seat with a red cushion
    if (m.get(tx - 1, ty) === '0') return;
    var n = runOf(m, tx, ty, '0').n, W = n * S, X = x;
    px(c, X + 2, y - 14, W - 4, 16, '#5a1a10'); px(c, X + 4, y - 12, W - 8, 12, '#7a2a1c'); px(c, X + 2, y - 14, W - 4, 1, '#c8a040');   // back
    px(c, X + W / 2 - 3, y - 11, 6, 8, '#c8a040'); px(c, X + W / 2 - 2, y - 10, 4, 6, '#9a2a1e');                                         // carved panel
    px(c, X + 1, y - 2, 3, 10, '#5a1a10'); px(c, X + W - 4, y - 2, 3, 10, '#5a1a10');                                                     // arms
    px(c, X + 3, y + 2, W - 6, 6, '#9a2a1e'); px(c, X + 3, y + 2, W - 6, 1, '#c84a3a');                                                   // seat cushion
  }
  function deskTall(c, x, y, tx, ty, th, m) {
    // the judge's desk: a red cloth to the floor, and on it the seal box, the brush stand, the tally tube and the gavel
    if (m.get(tx - 1, ty) === 'a') return;
    var n = runOf(m, tx, ty, 'a').n, W = n * S, X = x;
    px(c, X, y + 1, W, 4, '#3a1e10'); px(c, X, y + 1, W, 1, '#6a3e22');                                         // the top
    px(c, X, y + 5, W, 11, '#9a2a1e'); px(c, X, y + 5, W, 1, '#c8a040'); px(c, X, y + 15, W, 1, '#5a140e');     // the cloth
    for (var k = X + 4; k < X + W - 2; k += 6) px(c, k, y + 9, 2, 2, '#c8a040');                                  // embroidery
    px(c, X + 3, y - 2, 5, 4, '#c8a040'); px(c, X + 4, y - 3, 3, 1, '#e8c860');                                   // seal box
    px(c, X + W - 9, y - 6, 4, 8, '#9a2a1e'); for (var q = 0; q < 3; q++) px(c, X + W - 9 + q + (q > 1 ? 0 : 0), y - 9, 1, 3, '#e8d8a8');   // tally tube
    px(c, X + W / 2 - 4, y - 1, 4, 2, '#4a2a14');                                                                   // the gavel block
    px(c, X + W / 2 + 2, y - 4, 1, 5, '#2a1a10'); px(c, X + W / 2 + 4, y - 4, 1, 5, '#2a1a10'); px(c, X + W / 2 + 1, y, 5, 2, '#5a4a3a');   // brush stand
  }
  // A great hall's column: red lacquer on a carved stone base, rising out of sight with a gilded bracket at the top.
  function pillar(c, x, y, tx, ty, th, m) {
    floorUnder(c, x, y, tx, ty, m);
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
    var F = function (dx, dy) { return m.get(tx + dx, ty + dy) === 'F'; };
    if (m && m.interior) { cellBars(c, x, y, tx, ty, m, function (dx, dy) { var q = m.get(tx + dx, ty + dy); return q === 'F' || q === '+'; }); return; }   // indoors a fence is the timber grille of a prison cell
    // a village fence of woven wattle between sharpened stakes
    grass(c, x, y, tx, ty, th);
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

  // A prison cell's wall of heavy timber bars, standing on the stone floor: across the room, a top beam and a sill with
  // squared bars between; running away from the viewer, one long beam with the bar tops along it.
  function cellBars(c, x, y, tx, ty, m, F) {
    floorStone(c, x, y, tx, ty);
    if (F(-1, 0) || F(1, 0) || !(F(0, -1) || F(0, 1))) {
      px(c, x, y + 14, S, 2, 'rgba(0,0,0,0.25)');                                    // shadow on the floor
      for (var i = 1; i < 16; i += 4) { px(c, x + i, y + 1, 2, 13, '#4a2e18'); px(c, x + i, y + 1, 1, 13, '#7a5232'); }
      px(c, x, y, S, 2, '#3a2412'); px(c, x, y, S, 1, '#6a4428');                      // top beam
      px(c, x, y + 12, S, 2, '#3a2412'); px(c, x, y + 12, S, 1, '#6a4428');            // sill
      if (!F(-1, 0)) px(c, x, y, 2, 14, '#2e1c0e');                                     // end posts
      if (!F(1, 0)) px(c, x + 14, y, 2, 14, '#2e1c0e');
    } else {
      px(c, x + 10, y, 2, S, 'rgba(0,0,0,0.25)');
      px(c, x + 6, y, 4, S, '#3a2412'); px(c, x + 6, y, 1, S, '#6a4428');
      for (var j = 1; j < 16; j += 4) px(c, x + 7, y + j, 2, 2, '#7a5232');
    }
  }

  // A cell door in a run of bars: the same grille, framed by two posts, with an iron lock on a chain.
  function cellDoor(c, x, y, tx, ty) {
    floorStone(c, x, y, tx, ty);
    px(c, x, y + 14, S, 2, 'rgba(0,0,0,0.25)');
    for (var i = 3; i < 14; i += 3) { px(c, x + i, y + 2, 2, 11, '#4a2e18'); px(c, x + i, y + 2, 1, 11, '#7a5232'); }
    px(c, x, y, 2, 14, '#2e1c0e'); px(c, x + 14, y, 2, 14, '#2e1c0e');                // door posts
    px(c, x, y, S, 2, '#3a2412'); px(c, x, y, S, 1, '#6a4428');
    px(c, x + 2, y + 7, 12, 1, '#3a2412'); px(c, x + 2, y + 12, 12, 1, '#3a2412');     // the door's own rails
    px(c, x + 12, y + 6, 3, 4, '#5a5a60'); px(c, x + 12, y + 6, 3, 1, '#8a8a92');      // lock
  }
  // A prisoner's pallet: a straw mat two tiles long and a tile deep, laid across the line between two rows of '-' (a
  // man lying on the upper row lies along it), with a rolled straw pillow at the head and a rough grey blanket at the foot.
  function pallet(c, x, y, tx, ty, th, m) {
    floorStone(c, x, y, tx, ty);
    var head = m.get(tx - 1, ty) !== '-', foot = m.get(tx + 1, ty) !== '-', top = m.get(tx, ty - 1) !== '-';
    var x0 = x + (head ? 1 : 0), x1 = x + (foot ? 15 : 16);
    c.save(); c.beginPath(); c.rect(x, y, S, S); c.clip();
    var my = top ? y + 7 : y - 9;   // the mat's top edge, in this tile's frame
    px(c, x0, my, x1 - x0, 18, '#a8894a'); px(c, x0, my, x1 - x0, 1, '#c8aa62'); px(c, x0, my + 17, x1 - x0, 1, '#6e5628');
    for (var i = 0; i < 8; i++) px(c, x0 + Math.floor(U.hash2(tx * 3 + i, 0, 77) * (x1 - x0 - 3)), my + 2 + Math.floor(U.hash2(tx, i, 78) * 14), 3, 1, i % 2 ? '#c8aa62' : '#8a6e36');
    if (head) { px(c, x + 2, my + 3, 5, 12, '#c8aa62'); px(c, x + 2, my + 14, 5, 1, '#8a6e36'); px(c, x + 4, my + 3, 1, 12, '#b09050'); }   // the straw pillow
    if (foot) { px(c, x + 1, my + 2, 13, 14, '#6c6a64'); px(c, x + 1, my + 2, 13, 1, '#8a8880'); px(c, x + 1, my + 15, 13, 1, '#4a4844'); px(c, x + 1, my + 2, 1, 14, '#8a8880'); }   // the blanket
    c.restore();
  }

  function bridge(c, x, y, tx, ty, th, m) {
    // Determine orientation for the whole deck, including bridges wider than one tile.
    var horizontal = runOf(m, tx, ty, 'B').n, top=ty, bottom=ty;
    while(top>0 && m.get(tx,top-1)==='B')top--;
    while(bottom<m.h-1 && m.get(tx,bottom+1)==='B')bottom++;
    var vertical=bottom-top+1;
    var vert = vertical>horizontal || (vertical===horizontal && T.isWaterChar(m.get(tx-1,ty)) && T.isWaterChar(m.get(tx+1,ty)));
    water(c, x, y, tx, ty, th, m);
    if (!surface(c,x,y,[vert?7:14],tx,ty)) {
      px(c,x,y,S,S,'#9a6a3c');
      for(var i=0;i<S;i+=3)px(c,vert?x:x+i,vert?y+i:y,vert?S:1,vert?1:S,'#7a4e28');
    }
    // Railings belong only on the outside of the full bridge footprint.
    if(vert){
      if(m.get(tx-1,ty)!=='B'){px(c,x,y,2,S,'#5a3418');px(c,x,y+2,2,3,'#c8965a');px(c,x,y+10,2,3,'#c8965a');}
      if(m.get(tx+1,ty)!=='B'){px(c,x+14,y,2,S,'#5a3418');px(c,x+14,y+2,2,3,'#c8965a');px(c,x+14,y+10,2,3,'#c8965a');}
    }else{
      if(m.get(tx,ty-1)!=='B'){px(c,x,y,S,2,'#5a3418');px(c,x+2,y-1,3,3,'#c8965a');px(c,x+10,y-1,3,3,'#c8965a');}
      if(m.get(tx,ty+1)!=='B'){px(c,x,y+14,S,2,'#5a3418');px(c,x+2,y+13,3,3,'#c8965a');px(c,x+10,y+13,3,3,'#c8965a');}
    }
  }

  function stairs(c, x, y) {
    if (surface(c, x, y, [6], 0, 0)) return;
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
    var LSW = WM.world && WM.world.LOC && WM.world.LOC.liangshan;   // on the world map only Liangshan's own island flies it
    var ls = !!(m && m.id && (/^liangshan/.test(m.id) || (m.id === 'world' && (!LSW || Math.abs(tx - LSW.x) + Math.abs(ty - LSW.y) < 4))));
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

  // A two-man sampan (舢板) moored broadside, four tiles long: bow '<', midships '[', then two stern tiles '>'. The tiles are water; the
  // whole boat is drawn in the depth pass from the middle tile, so its upswept ends and the woven-mat awning (篷) can rise
  // above the row, with the boatman in his straw hat at the stern oar (櫓).
  function sampanTile(c, x, y, tx, ty, th, m) { water(c, x, y, tx, ty, th, m); }
  function sampanTall(c, x, y) {
    var bx = x - S, wl = y + 15, N = 64;   // four tiles long
    var top = function (u) { return u < 12 ? 5 - Math.round((12 - u) * 0.6) : u > 50 ? 5 - Math.round((u - 50) * 0.65) : 5; };
    var bot = function (u) { return u < 7 ? 15 - Math.round((7 - u) * 1.3) : u > 56 ? 15 - Math.round((u - 56) * 1.3) : 15; };
    c.fillStyle = 'rgba(10,20,40,0.35)'; c.fillRect(bx + 5, wl, 54, 2);   // its shadow on the water
    for (var u = 0; u < N; u++) {
      var t = top(u), b = bot(u); if (t >= b) continue;
      px(c, bx + u, y + t, 1, b - t, '#6a3e1c');
      px(c, bx + u, y + t, 1, 1, '#c99a5c');                          // the gunwale
      if (b - t > 4) px(c, bx + u, y + t + 2, 1, 1, '#8a5a2c');         // the rubbing strake
      if (b - t > 6) px(c, bx + u, y + t + 5, 1, 1, '#5a3418');         // a plank seam
      if (b - t > 6) px(c, bx + u, y + b - 3, 1, 3, '#3a2210');         // the wet planks at the waterline
    }
    px(c, bx, y - 3, 2, 5, '#c99a5c'); px(c, bx + 2, y - 1, 1, 2, '#c99a5c');   // the bow post
    // the awning: woven bamboo matting on hoops, open at both ends
    for (var r = 0; r < 14; r++) {
      var inset = [6, 4, 2, 1, 1, 0][r] || 0;
      px(c, bx + 20 + inset, y - 9 + r, 24 - inset * 2, 1, r < 2 ? '#bca676' : r < 5 ? '#a08a5a' : '#8f7a4c');
    }
    for (var k = 0; k < 8; k++) px(c, bx + 22 + k * 3, y - 6, 1, 11, '#6a5634');   // the hoops
    px(c, bx + 20, y - 5, 2, 10, '#241810'); px(c, bx + 42, y - 5, 2, 10, '#2e2014');   // the dark mouths
    // the boatman at the stern, standing to his oar under a conical straw hat (斗笠)
    px(c, bx + 50, y - 4, 6, 9, '#3a4a5a'); px(c, bx + 51, y - 4, 2, 9, '#4a5c6e');   // his blue coat
    px(c, bx + 51, y - 7, 4, 3, '#d8a878');                                            // his face
    px(c, bx + 52, y - 12, 2, 1, '#c8b078'); px(c, bx + 51, y - 11, 4, 1, '#c8b078'); px(c, bx + 49, y - 10, 8, 1, '#c8b078'); px(c, bx + 47, y - 9, 12, 1, '#8a7448');   // the hat
    px(c, bx + 55, y - 3, 2, 2, '#d8a878');                                            // his hands
    for (var j = 0; j < 17; j++) px(c, bx + 56 + j, y - 3 + j, 1, 1, '#9a7a4a');      // the oar, raked back over the stern
    px(c, bx + 71, y + 12, 3, 2, '#9a7a4a');                                            // its blade in the water
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
    '!': { draw: function(c,x,y,tx,ty){if(!surface(c,x,y,[4,5],tx,ty))px(c,x,y,S,S,'#302c28');} },
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
    'i': { draw: pillar, tall: pillarTall, solid: true },
    '1': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: buddhaTall, solid: true },     // the great Buddha (a run of tiles is one figure)
    '2': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: offeringTall, solid: true },  // the offering altar before him
    '3': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: censerTall, solid: true },    // a great bronze censer
    '4': { draw: cushion },                                                                                          // a kneeling cushion
    '5': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: pureTall, solid: true },                          // the Three Pure Ones
    '6': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: bigDeityTall('lady', '6', '#9a2a1e', 'tablet'), solid: true },   // a goddess
    '7': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: bigDeityTall('king', '7', '#c8a040', 'tablet'), solid: true },   // a deity-king
    '8': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: daoAltarTall, solid: true },                       // the Daoist altar
    'E': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: screenTall, solid: true },   // painted screen behind an official's seat
    'q': { draw: dais },                                                                                          // the raised dais
    '0': { draw: dais, tall: chairTall },                                                                         // the official's chair (he stands on it, as if seated)
    'a': { draw: function (c, x, y, tx, ty, th, m) { floorUnder(c, x, y, tx, ty, m); }, tall: deskTall, solid: true },    // the judge's desk
    'l': { draw: function (c, x, y, tx, ty, th) { grass(c, x, y, tx, ty, th); }, tall: willowTall, solid: true },   // a weeping willow (crows' nest)   // a column of a great hall
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
    '+': { draw: cellDoor },     // the door of a prison cell, in its bars
    '-': { draw: pallet },       // a prisoner's straw pallet
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
    '<': { draw: sampanTile, solid: true, water: true },
    '[': { draw: sampanTile, tall: sampanTall, solid: true, water: true },
    '>': { draw: sampanTile, solid: true, water: true },
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
  // The map symbols replace only the cells already reserved by world.js.
  // Discovery conditions and the original doorway/collision cells remain authoritative.
  function worldSymbols(map) {
    if (!(map.def && map.def.world) || !SHEETS.worldIcons) return [];
    var names=['city','town','village','manor','temple','fort','inn','ruin','pass','forest','marsh','fortress','mountain'];
    return Object.keys(WM.data.locations || {}).map(function(id){return WM.data.locations[id];}).filter(function(l){return !l.cond || l.cond(WM.S);}).map(function(l){
      var narrow=l.icon==='forest'||l.icon==='marsh', two=l.icon==='village'||l.icon==='manor'||l.icon==='inn';
      return {i:names.indexOf(l.icon),x:l.x+(narrow||l.icon==='inn'?0:-1),y:l.y+(l.icon==='fortress'?0:-1),w:narrow?1:two?2:3,h:2};
    }).filter(function(l){return l.i>=0;});
  }
  function worldSymbolAt(map,tx,ty) {return (map._worldSymbols || []).some(function(l){return tx>=l.x&&tx<l.x+l.w&&ty>=l.y&&ty<l.y+l.h;});}
  // Rendering and collision share one placement for every world terrain feature.
  // Dense terrain is grouped first; isolated features expand only onto safe open ground.
  var worldLayouts = new WeakMap();
  T.worldTerrainLayout = function(map) {
    artInit();
    var empty={items:[],occupied:{}};
    if(!(map.def && map.def.world) || !SHEETS.worldIcons)return empty;
    var cached=worldLayouts.get(map);
    if(cached && cached.version===T.artVersion && cached.entry===map.propEntry)return cached;
    var out={items:[],occupied:{},version:T.artVersion,entry:map.propEntry}, reserved={},symbols=worldSymbols(map);
    function key(x,y){return x+','+y;}
    function protect(x,y,w,h){for(var yy=y-1;yy<y+(h||1)+1;yy++)for(var xx=x-1;xx<x+(w||1)+1;xx++)reserved[key(xx,yy)]=true;}
    symbols.forEach(function(l){protect(l.x,l.y,l.w,l.h);});
    var exits=map.def.exits||[];if(typeof exits==='function')exits=exits();
    exits.forEach(function(e){protect(e.x,e.y,e.w,e.h);});
    var events=WM.data.events && WM.data.events[map.id] || [];events.forEach(function(e){protect(e.x,e.y,e.w,e.h);});
    if(map.propEntry)protect(map.propEntry.x,map.propEntry.y);
    function kind(ch){return ch==='M'?'mountain':'TPHlb'.indexOf(ch)>=0 && ch?'forest':null;}
    function blocked(x,y){return !!out.occupied[key(x,y)] || T.solid(map.get(x,y)) || T.isWaterChar(map.get(x,y));}
    // Every surviving perimeter cell that was connected before must remain connected.
    function routesSafe(x,y,w,h){
      var perimeter=[];for(var yy=y-1;yy<=y+h;yy++)for(var xx=x-1;xx<=x+w;xx++)if((xx<x||xx>=x+w||yy<y||yy>=y+h)&&!blocked(xx,yy))perimeter.push([xx,yy]);
      function labels(after){var ids={},n=0;for(var sy=y-2;sy<y+h+2;sy++)for(var sx=x-2;sx<x+w+2;sx++){
        if(ids[key(sx,sy)]||blocked(sx,sy)||(after&&sx>=x&&sx<x+w&&sy>=y&&sy<y+h))continue;
        var queue=[[sx,sy]];ids[key(sx,sy)]=++n;
        for(var q=0;q<queue.length;q++)[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var nx=queue[q][0]+d[0],ny=queue[q][1]+d[1];if(nx<x-2||nx>=x+w+2||ny<y-2||ny>=y+h+2||ids[key(nx,ny)]||blocked(nx,ny)||(after&&nx>=x&&nx<x+w&&ny>=y&&ny<y+h))return;ids[key(nx,ny)]=n;queue.push([nx,ny]);});
      }return ids;}
      var before=labels(false),after=labels(true);
      for(var a=0;a<perimeter.length;a++)for(var b=a+1;b<perimeter.length;b++){var ka=key.apply(null,perimeter[a]),kb=key.apply(null,perimeter[b]);if(before[ka]===before[kb]&&after[ka]!==after[kb])return false;}return true;
    }
    for(var y=0;y<map.h;y++)for(var x=0;x<map.w;x++){
      var k=kind(map.get(x,y));if(!k||out.occupied[key(x,y)]||reserved[key(x,y)])continue;
      var chosen=null, sizes=k==='forest'?[[4,3],[3,2],[2,2],[2,1],[1,1]]:[[3,2],[2,2],[2,1],[1,1]];
      // Prefer merging existing solid cells before adding any new boundary.
      for(var grow=0;grow<2&&!chosen;grow++)for(var f=0;f<sizes.length&&!chosen;f++){
        var size=sizes[f],w=size[0],h=size[1],okay=true,added=false;
        for(var yy=y;yy<y+h;yy++)for(var xx=x;xx<x+w;xx++){
          var ch=map.get(xx,yy),same=kind(ch)===k;
          if(xx>=map.w||yy>=map.h||reserved[key(xx,yy)]||out.occupied[key(xx,yy)]||(!same&&(!grow||'.,f'.indexOf(ch)<0||!ch)))okay=false;
          if(!same)added=true;
        }
        // Leave single cells for the growth pass so isolated terrain can become larger.
        if(!grow&&w===1)continue;
        if(okay&&(!added||routesSafe(x,y,w,h)))chosen={x:x,y:y,w:w,h:h,kind:k};
      }
      if(!chosen)chosen={x:x,y:y,w:1,h:1,kind:k};
      out.items.push(chosen);for(var yy=y;yy<y+chosen.h;yy++)for(var xx=x;xx<x+chosen.w;xx++)out.occupied[key(xx,yy)]=chosen;
    }
    worldLayouts.set(map,out);return out;
  };
  T.bake = function (map) {
    var w = map.w, h = map.h;
    var cv = U.makeWorldCanvas(w * S, h * S);
    var c = cv.getContext('2d');
    var th = THEMES[map.theme] || THEMES.spring;
    artInit();
    c.imageSmoothingEnabled = false;
    map._worldSymbols = worldSymbols(map);
    var terrain=T.worldTerrainLayout(map);
    for (var ty = 0; ty < h; ty++) for (var tx = 0; tx < w; tx++) {
      var ch = (worldSymbolAt(map,tx,ty) || terrain.occupied[tx+','+ty]) ? '.' : map.get(tx, ty);
      var d = T.DEF[ch] || T.DEF['.'];
      if(map.def && map.def.world && ch==='b' && SHEETS.worldIcons){grass(c,tx*S,ty*S,tx,ty,th);U.drawArt(c,SHEETS.worldIcons,48,64,48,32,tx*S,ty*S+5,16,11);continue;}
      if (!drawGroundArt(c, tx * S, ty * S, tx, ty, map, ch, 0)) d.draw(c, tx * S, ty * S, tx, ty, th, map, ch);
    }
    // second pass: what overhangs its own tile (eave corners, ridge ornaments, wall copings), so later tiles cannot cover it
    // (a tile drawn from art brings its own overhang, if it has one)
    for (ty = 0; ty < h; ty++) for (tx = 0; tx < w; tx++) {
      ch = map.get(tx, ty); d = T.DEF[ch];
      if (!worldSymbolAt(map,tx,ty) && d && d.over && !groundArt(ch, map)) d.over(c, tx * S, ty * S, tx, ty, th, map, ch);
    }
    terrain.items.forEach(function(l){
      var i=l.kind==='forest'?9:13+(U.hash2(l.x,l.y,61)>.5?1:0),scale=Math.min(l.w/3,l.h/2),dw=48*scale,dh=32*scale;
      U.drawArt(c,SHEETS.worldIcons,(i%4)*48,Math.floor(i/4)*32,48,32,l.x*16+(l.w*16-dw)/2,(l.y+l.h)*16-dh,dw,dh);
    });
    map._worldSymbols.forEach(function(l){
      var scale=Math.min(l.w/3,1),dw=48*scale,dh=32*scale;
      U.drawArt(c,SHEETS.worldIcons,(l.i%4)*48,Math.floor(l.i/4)*32,48,32,l.x*16+(l.w*16-dw)/2,(l.y+2)*16-dh,dw,dh);
    });
    return cv;
  };

  // ---------- tile art ----------
  // Drawn art for the tiles lives in assets/tiles/ and is described in assets/tiles.js (WM.TILE_ART). A tile that has
  // art is drawn from its sheet; anything without art is still drawn by the code above, so art can arrive a batch at a
  // time. See assets/tiles.js for the format.
  T.artVersion = 0;
  var ART = null, SHEETS = {}, artWaiting = 0;
  function artInit() {
    if (ART !== null) return;
    var cfg = WM.TILE_ART || {};
    ART = cfg.tiles || {};
    var sh = cfg.sheets || {}, names = Object.keys(sh);
    if (!names.length || typeof Image === 'undefined') return;
    artWaiting = names.length;
    names.forEach(function (n) {
      var img = new Image();
      img.artScale = (cfg.size || S) / S;
      img.onload = function () { SHEETS[n] = img; if (--artWaiting === 0) artReady(); };
      img.onerror = function () { if (window.console) console.warn('Tile sheet not found: ' + sh[n]); if (--artWaiting === 0) artReady(); };
      img.src = sh[n];
    });
  }
  function artReady() { T.artVersion++; if (T.onArtReady) T.onArtReady(); }
  // start again from assets/tiles.js (for testing art without reloading the page)
  T.reloadArt = function () { ART = null; SHEETS = {}; artInit(); if (!artWaiting) artReady(); };
  T.artStatus = function () { return { tiles: ART ? Object.keys(ART).length : 0, sheets: Object.keys(SHEETS), waiting: artWaiting }; };

  // the art entry for a tile on this map: a season's own version ('T@autumn') before the plain one ('T')
  // (building pieces are left out indoors unless the entry says inside: true, and an entry marked indoors: true is used only indoors)
  function artEntry(ch, map) {
    var e = ART && (ART[ch + '@' + map.theme] || ART[ch]) || null;
    if (!e || (e.indoors && !map.interior)) return null;
    var world = map.theme === 'world' || (map.def && map.def.world);
    return (e.building && (world || (map.interior && !e.inside))) || (e.object && world) ? null : e;
  }
  function sheetOf(e) { return SHEETS[e.sheet || 'tiles']; }
  function cellList(v) { return !v ? [] : typeof v[0] === 'number' ? [v] : v; }
  function groundArt(ch, map) { var e = artEntry(ch, map); return !!(e && (e.ground || e.auto || e.frames || e.building || e.object) && sheetOf(e)); }
  function blit(c, img, cell, w, h, dx, dy) { if (img && cell) U.drawArt(c, img, cell[0] * S, cell[1] * S, w, h, dx, dy, w, h); }

  function buildingCell(c, index, x, y) { blit(c, SHEETS.buildingWalls, [index % 8, Math.floor(index / 8)], S, S, x, y); }
  function buildingSide(map, tx, ty, same) { return same.indexOf(map.get(tx - 1, ty)) < 0 ? 0 : same.indexOf(map.get(tx + 1, ty)) < 0 ? 2 : 1; }
  function roofCell(e, map, tx, ty, ch) {
    var up = map.get(tx, ty - 1) === ch, down = map.get(tx, ty + 1) === ch;
    return [(e.style || 0) * 3 + buildingSide(map, tx, ty, ch), !up && !down ? 4 : down ? 0 : 2];
  }
  // Rendering and collision share the same rule for roof rows replaced by grass.
  T.isRemovedRoof = function (map, tx, ty) {
    artInit();
    var ch = map.get(tx, ty), e = ch && artEntry(ch, map);
    return !!(e && e.building === 'roof' && sheetOf(e) &&
      map.get(tx, ty + 1) === ch && map.get(tx, ty + 2) === ch);
  };
  T.solidAt = function (map, tx, ty) {
    if(T.worldTerrainLayout(map).occupied[tx+','+ty])return true;
    var layout = T.propLayout(map);
    return !!layout.occupied[tx + ',' + ty] || (!T.isRemovedRoof(map, tx, ty) && T.solid(map.get(tx, ty)));
  };
  function gateEligible(map, tx, ty) {
    // Guardian wings in temple gates use the original bespoke roof coverage.
    var run = runOf(map, tx, ty, 'G'), l = map.get(run.x0 - 1, ty), r = map.get(run.x0 + run.n, ty);
    return (l === '#' || l === 'R') && (r === '#' || r === 'R');
  }
  function shrineFacade(map,tx,ty){
    // Architectural style follows the roof, so adjoining windows and doors agree.
    for(var yy=ty;yy>=0;yy--){var ch=map.get(tx,yy);if(ch==='Z')return true;if(!ch||'WODdR'.indexOf(ch)<0)return false;}
    return false;
  }
  function facadeGround(c,x,y,tx,ty,map,ch,th){
    var same='WODdR',left=same.indexOf(map.get(tx-1,ty))<0?4:0,right=same.indexOf(map.get(tx+1,ty))<0?4:0;
    var bottom=same.indexOf(map.get(tx,ty+1))<0;
    var shrine=shrineFacade(map,tx,ty);
    var red=!shrine&&(ch==='R'||[map.get(tx-1,ty),map.get(tx+1,ty),map.get(tx,ty-1)].indexOf('R')>=0);
    grass(c,x,y,tx,ty,th);
    c.save();c.beginPath();c.rect(x+left,y,S-left-right,S);c.clip();
    // Use continuous upper-wall material; the footing is shared across all lower bays.
    buildingCell(c,red?7:26,x,y);
    if(shrine){
      c.fillStyle='#30251d';c.fillRect(x,y,2,S);c.fillRect(x,y+1,S,1);
      if(right)c.fillRect(x+S-right-2,y,2,S);
    }
    if(left||right){c.fillStyle='#503629';if(left)c.fillRect(x+left,y,2,S);if(right)c.fillRect(x+S-right-2,y,2,S);}
    if(bottom&&shrine){c.fillStyle='#b0ad9b';c.fillRect(x+left,y+13,S-left-right,1);}
    if(bottom){c.fillStyle='#898b7e';c.fillRect(x+left,y+14,S-left-right,1);c.fillStyle='#4b5151';c.fillRect(x+left,y+15,S-left-right,1);}
    c.restore();
  }
  function buildingGround(c, x, y, tx, ty, map, ch, e) {
    if (!SHEETS.buildingWalls) return false;
    var th = THEMES[map.theme] || THEMES.spring, side = buildingSide(map, tx, ty, 'WODdR');
    if (e.building === 'roof') {
      grass(c, x, y, tx, ty, th);
      // Keep only the ridge and eave rows, anchored directly above the facade.
      // Extra map rows no longer insert a repeated, rectangular slope band.
      if (!T.isRemovedRoof(map, tx, ty))
        blit(c, sheetOf(e), roofCell(e, map, tx, ty, ch), S, S, x, y);
    } else if (e.building === 'plaster' || e.building === 'window' || e.building === 'red') {
      facadeGround(c,x,y,tx,ty,map,ch,th);
      if(e.building==='window'){
        // Raise the opening above the sill; it is not a floor-height doorway.
        var red=!shrineFacade(map,tx,ty)&&[map.get(tx-1,ty),map.get(tx+1,ty),map.get(tx,ty-1)].indexOf('R')>=0;
        var rise='WOR'.indexOf(map.get(tx,ty-1))>=0?6:0;
        U.drawArt(c,SHEETS.buildingWalls,(red?5:3)*S+4,red?3*S+3:3,8,11,x+4,y+3-rise,8,11);
      }
    }
    else if (e.building === 'stone') buildingCell(c, 9 + buildingSide(map, tx, ty, '#G'), x, y);
    else if (e.building === 'door') {
      // Closed Chinese house doors: 24 logical / 48 physical pixels high.
      // Keep the passable D event and blocked d collision semantics unchanged.
      facadeGround(c,x,y,tx,ty,map,ch,th);
      if (SHEETS.objects) {
        var doorCell = ch === 'd' ? [28, 25] : [0, 0];
        blit(c, SHEETS.objects, doorCell, S, 24, x, y - 8);
      } else U.drawArt(c, SHEETS.buildingWalls, 5 * S, 0, S, S, x, y - 8, S, 24);
    }
    else if (e.building === 'paving') buildingCell(c, U.hash2(tx, ty, 408) > 0.5 ? 15 : 16, x, y);
    else if (e.building === 'well') { buildingCell(c, 15, x, y); buildingCell(c, 24, x, y); }
    else if (e.building === 'fence') {
      grass(c, x, y, tx, ty, th);
      var n = map.get(tx, ty - 1) === 'F', s = map.get(tx, ty + 1) === 'F', w = map.get(tx - 1, ty) === 'F', east = map.get(tx + 1, ty) === 'F';
      var index = !n && !s && !w && !east ? 23 : (n || s) && !(w || east) ? 18 : !(n || s) ? 17 : s && east ? 19 : s && w ? 20 : n && east ? 21 : 22;
      buildingCell(c, index, x, y);
    } else if (e.building === 'gate') {
      if (!gateEligible(map, tx, ty)) return false;
      px(c, x, y, S, S, '#181b1c');
      if (map.get(tx, ty + 1) !== 'G') U.drawArt(c, SHEETS.buildingWalls, 7 * S, S + 12, S, 4, x, y + 12, S, 4);
    } else return false;
    return true;
  }
  function buildingTall(c, x, y, tx, ty, map, ch, e) {
    if (e.building === 'roof') {
      if (map.get(tx, ty + 1) !== ch) { var rc = roofCell(e, map, tx, ty, ch); U.drawArt(c, sheetOf(e), rc[0] * S, rc[1] * S + 16, S, 6, x, y + 16, S, 6); }
      return true;
    }
    if (e.building === 'red') { if (!SHEETS.buildingRoofs) return false; if (map.get(tx, ty - 1) !== 'R') U.drawArt(c, SHEETS.buildingRoofs, 7 * S, 42, S, 4, x, y - 2, S, 4); return true; }
    if (e.building === 'stone') { if (map.get(tx, ty - 1) !== '#' && map.get(tx, ty - 1) !== 'G') U.drawArt(c, sheetOf(e), (12 + buildingSide(map, tx, ty, '#G')) % 8 * S, S, S, 4, x, y - 4, S, 4); return true; }
    if (e.building === 'gate' && gateEligible(map, tx, ty)) {
      if (map.get(tx - 1, ty) === 'G' || map.get(tx, ty + 1) === 'G') return true;
      var run = runOf(map, tx, ty, 'G'), sy = WM.state && WM.state.flags && WM.state.flags['shut:' + map.id] ? 48 : 0;
      // Piers sit on neighbouring solid wall tiles; every G tile remains a visible passage.
      U.drawArt(c, sheetOf(e), 0, sy, 16, 45, x - 16, y - 29, 16, 45);
      for (var i = 0; i < run.n; i++) U.drawArt(c, sheetOf(e), 16 + (i % 2) * 16, sy, 16, 45, x + i * 16, y - 29, 16, 45);
      U.drawArt(c, sheetOf(e), 48, sy, 16, 45, x + run.n * 16, y - 29, 16, 45);
      return true;
    }
    return false;
  }

  function objectGround(c, x, y, tx, ty, map, ch, e) {
    var th = THEMES[map.theme] || THEMES.spring;
    if (e.base === 'water') water(c, x, y, tx, ty, th, map);
    else if (e.base === 'floor' || map.interior) floorUnder(c, x, y, tx, ty, map);
    else grass(c, x, y, tx, ty, th);
    return true;
  }
  var propLayouts = new WeakMap();
  T.propLayout = function (map) {
    artInit();
    var cached = propLayouts.get(map);
    if (cached && cached.version === T.artVersion && cached.theme === map.theme) return cached;
    var out = {version:T.artVersion, theme:map.theme, occupied:{}, anchors:{}, skipped:{}, constrained:[]}, protectedCells = {};
    var events = map.def && map.def.events;
    if (typeof events === 'function') events = events(WM.S);
    var accessPoints = (Array.isArray(events) ? events : []).slice();
    if (map.propEntry) accessPoints.push(map.propEntry);
    accessPoints.forEach(function(ev){
      if (typeof ev.x !== 'number' || typeof ev.y !== 'number') return;
      [[0,0],[0,1],[0,-1],[1,0],[-1,0]].forEach(function(d){protectedCells[(ev.x+d[0])+','+(ev.y+d[1])]=true;});
    });
    function free(x,y,ch) {
      if(x<0||y<0||x>=map.w||y>=map.h)return false;
      var key=x+','+y, q=map.get(x,y);
      if(out.occupied[key] || protectedCells[key])return false;
      // Do not expand over roads, entrances, stairs, other props or room boundaries.
      return q===ch || (ch==='o' ? '~w'.indexOf(q)>=0 : '.,fnN'.indexOf(q)>=0);
    }
    function keepsRoutes(left,top,w,h) {
      var added={}, around={}, start=null;
      function walk(x,y,extra){return x>=0&&y>=0&&x<map.w&&y<map.h&&!T.solid(map.get(x,y))&&!out.occupied[x+','+y]&&!(extra&&extra[x+','+y]);}
      for(var y=top;y<top+h;y++)for(var x=left;x<left+w;x++)added[x+','+y]=true;
      for(var y=top-1;y<=top+h;y++)for(var x=left-1;x<=left+w;x++)if(!added[x+','+y]&&walk(x,y)){around[x+','+y]=true;if(!start)start=[x,y];}
      if(!start)return true;
      function reach(extra){var seen={},q=[start];seen[start.join(',')]=true;
        for(var i=0;i<q.length;i++){var p=q[i];[[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var x=p[0]+d[0],y=p[1]+d[1],k=x+','+y;if(!seen[k]&&walk(x,y,extra)){seen[k]=true;q.push([x,y]);}});}return seen;}
      var before=reach(null),after=reach(added);
      return Object.keys(around).every(function(k){return !before[k]||after[k];});
    }
    // Scan bottom-up so a two-row bed is anchored at its foot.
    for(var y=map.h-1;y>=0;y--)for(var x=0;x<map.w;x++){
      var ch=map.get(x,y),e=artEntry(ch,map),key=x+','+y;
      if(!e||!e.object||!e.object.footprint||!sheetOf(e)||out.skipped[key])continue;
      var fp=e.object.footprint, chosen=null;
      for(var offset=0;offset<fp[0]&&!chosen;offset++){
        var left=x-offset, top=y-fp[1]+1, okay=true;
        for(var yy=top;yy<=y;yy++)for(var xx=left;xx<left+fp[0];xx++){
          // An event on the authored prop itself is allowed; surrounding access is protected.
          if(xx===x&&yy===y)continue;
          if(!free(xx,yy,ch))okay=false;
        }
        if(okay && keepsRoutes(left,top,fp[0],fp[1]))chosen={x:left,y:top,w:fp[0],h:fp[1],bottom:y+1};
      }
      if(!chosen){chosen={x:x,y:y,w:1,h:1,bottom:y+1};out.constrained.push({x:x,y:y,ch:ch});}
      out.anchors[key]=chosen;
      for(var yy=chosen.y;yy<chosen.y+chosen.h;yy++)for(var xx=chosen.x;xx<chosen.x+chosen.w;xx++){
        out.occupied[xx+','+yy]=chosen;
        if((xx!==x||yy!==y)&&map.get(xx,yy)===ch)out.skipped[xx+','+yy]=true;
      }
    }
    propLayouts.set(map,out);return out;
  };
  function objectTall(c, x, y, tx, ty, map, ch, e) {
    if (ch === 'l' && WM.state && WM.state.flags && WM.state.flags['felled:' + map.id]) {
      willowTall(c, x, y, tx, ty, THEMES[map.theme] || THEMES.spring, map); return;
    }
    var o = e.object, cell = o.at;
    if (o.variants) cell = o.variants[Math.floor(U.hash2(tx, ty, 905) * o.variants.length) % o.variants.length];
    var w = o.w || S, h = o.h || S, dx = x + (S - w) / 2;
    var placement = o.footprint && T.propLayout(map);
    if (placement && placement.skipped[tx+','+ty]) return;
    if (ch === 'u' && !placement) {
      var stallRun = runOf(map, tx, ty, ch), offset = tx - stallRun.x0;
      if (offset % 2) return;
      w = Math.min(2, stallRun.n - offset) * S; dx = x;
    }
    if (o.run) {
      if (map.get(tx - 1, ty) === ch) return;
      w = runOf(map, tx, ty, ch).n * S; dx = x;
    }
    if (o.bed && !placement) {
      if (map.get(tx - 1, ty) === ch || map.get(tx, ty + 1) === ch) return;
      w = runOf(map, tx, ty, ch).n * S; dx = x;
    }
    if (ch === '[') dx = x - S;
    if (placement) {
      var bounds=placement.anchors[tx+','+ty];
      if(bounds){dx=x+(bounds.x-tx)*S;w=bounds.w*S;}
    }
    // Never stretch an object's width independently of its height to fill a map run.
    var sourceW = o.w || S, fit = ch === 'b' ? 1 : Math.min(1, w / sourceW), drawW = sourceW * fit, drawH = h * fit;
    U.drawArt(c, sheetOf(e), cell[0] * S, cell[1] * S, sourceW, h, dx + (w - drawW) / 2, y + S - drawH, drawW, drawH);
  }

  // the ground of a tile from its art (returns false if it has none): a variant chosen by place, a piece joining
  // its neighbours (auto), or a frame of its animation
  function drawGroundArt(c, x, y, tx, ty, map, ch, frame) {
    var e = artEntry(ch, map); if (!e) return false;
    var img = sheetOf(e); if (!img) return false;
    if (e.object) return objectGround(c, x, y, tx, ty, map, ch, e);
    if (e.building) return buildingGround(c, x, y, tx, ty, map, ch, e);
    var cell = null;
    if (e.auto) {
      var same = e.auto.same || ch, m = 0;
      [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]].forEach(function (d) { var n = map.get(tx + d[0], ty + d[1]); if (n == null || same.indexOf(n) >= 0) m |= d[2]; });
      if (e.auto.diagonal) [[1, -1, 16], [1, 1, 32], [-1, 1, 64], [-1, -1, 128]].forEach(function (d) { var n = map.get(tx + d[0], ty + d[1]); if (n == null || same.indexOf(n) >= 0) m |= d[2]; });
      cell = e.auto.cells && e.auto.cells[m];
      if (cell) { var choices = cellList(cell); cell = choices[Math.floor(U.hash2(tx, ty, 404) * choices.length) % choices.length]; }
      if (cell && e.auto.frames) { var offset = e.auto.frames[frame % e.auto.frames.length]; cell = [cell[0] + offset[0], cell[1] + offset[1]]; }
    }
    if (!cell && e.frames) cell = cellList(e.frames)[frame % cellList(e.frames).length];
    if (!cell && e.ground) { var vs = cellList(e.ground); cell = vs[Math.floor(U.hash2(tx, ty, 404) * vs.length) % vs.length]; }
    if (!cell) return false;
    blit(c, img, cell, S, S, x, y);
    return true;
  }
  // animated tiles in view are drawn over the baked ground each frame
  T.animateArt = function (c, map, camX, camY, time) {
    if (!ART) return;
    var x0 = Math.floor(camX / S), y0 = Math.floor(camY / S);
    for (var ty = y0; ty < y0 + 16; ty++) for (var tx = x0; tx < x0 + 21; tx++) {
      var ch = map.get(tx, ty), e = ch && artEntry(ch, map);
      var frames = e && (e.auto ? e.auto.frames : e.frames);
      if (!frames) continue;
      var n = cellList(frames).length, f = Math.floor(time * (e.fps || 3) + (e.sync ? 0 : U.hash2(tx, ty, 405) * n)) % n;
      drawGroundArt(c, tx * S - camX, ty * S - camY, tx, ty, map, ch, f);
    }
  };
  // a tall object from its art, bottom-aligned on its tile and centred across it; in a run of the same tile
  // (the great Buddha, a long counter) each tile takes its own slice, left to right
  function tallArt(ch, map) { var e = artEntry(ch, map); return e && e.tall && SHEETS[e.tall.sheet || e.sheet || 'tiles'] ? e : null; }
  T.hasTall = function (ch, map) { var d = T.DEF[ch], e = ART && map && artEntry(ch, map); return !!((d && d.tall) || (e && (e.building === 'stone' || e.object) && sheetOf(e)) || (ART && map && tallArt(ch, map))); };
  T.drawTall = function (c, x, y, tx, ty, th, map, ch) {
    if (worldSymbolAt(map,tx,ty) || T.worldTerrainLayout(map).occupied[tx+','+ty]) return;
    if(map.def && map.def.world && SHEETS.worldIcons && 'TPHlb'.indexOf(ch)>=0){
      U.drawArt(c,SHEETS.worldIcons,48,64,48,32,x,y+5,16,11);return;
    }
    var building = artEntry(ch, map);
    if (building && building.object && sheetOf(building)) { objectTall(c, x, y, tx, ty, map, ch, building); return; }
    if (building && building.building && sheetOf(building) && buildingTall(c, x, y, tx, ty, map, ch, building)) return;
    var e = tallArt(ch, map), d = T.DEF[ch];
    if (!e) { if (d && d.tall) d.tall(c, x, y, tx, ty, th, map, ch); return; }
    var t = e.tall, w = t.w || S, h = t.h || S, cell;
    if (t.run) {
      var i = 0; while (map.get(tx - i - 1, ty) === ch) i++;
      var run = cellList(t.run); cell = run[Math.min(i, run.length - 1)];
      w = S;
    } else { var vs = cellList(t.at); cell = vs[Math.floor(U.hash2(tx, ty, 406) * vs.length) % vs.length]; }
    blit(c, SHEETS[t.sheet || e.sheet || 'tiles'], cell, w, h, x + Math.round((S - w) / 2) + (t.dx || 0), y + S - h + (t.dy || 0));
  };

  // Draw animated water glints on visible water tiles.
  T.animateWater = function (c, map, camX, camY, time) {
    var x0 = Math.floor(camX / S), y0 = Math.floor(camY / S);
    for (var ty = y0; ty < y0 + 16; ty++) for (var tx = x0; tx < x0 + 21; tx++) {
      var ch = map.get(tx, ty);
      if (worldSymbolAt(map,tx,ty) || (ch !== '~' && ch !== 'w' && ch !== 'r')) continue;
      if (ART && groundArt(ch, map)) continue;   // drawn water brings its own movement
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
