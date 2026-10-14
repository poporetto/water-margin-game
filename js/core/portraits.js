// Illustrated portrait overrides with procedural pixel portraits (48x56) as fallback.
// Expressions: normal, angry, sad, smile, shock. Drop-in override: assets/portraits/<id>.png (any size, shown scaled to 144x168).
'use strict';
(function () {
  var U = WM.util;
  var PT = WM.portraits = { cache: {}, overrides: {} };
  var PW = 48, PH = 56;
  PT.W = PW; PT.H = PH;

  function ellipseRows(g, cx, cy, rx, ry, col, x0clip, x1clip) {
    for (var y = -ry; y <= ry; y++) {
      var w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
      for (var x = -w; x < w; x++) {
        var px = Math.round(cx + x);
        if (x0clip != null && px < x0clip) continue;
        if (x1clip != null && px > x1clip) continue;
        g.set(px, Math.round(cy + y), col);
      }
    }
  }

  function build(lk, expr) {
    var Grid = WM.sprites.Grid;
    var g = new Grid(PW, PH);
    var L = {};
    var D = { skin: '#e8b48a', hair: '#1c1612', hairStyle: 'topknot', beard: 'none', body: '#4a6a9a', trim: '#d8c49a', face: 'oval', eyes: 'normal', build: 'normal' };
    for (var k in D) L[k] = D[k]; for (k in lk) L[k] = lk[k];
    var sk = L.skin, skD = U.shade(sk, -0.16), skDD = U.shade(sk, -0.32), skL = U.shade(sk, 0.12);
    var hr = L.hair, hrL = U.shade(hr, 0.22), hrD = U.shade(hr, -0.3);
    var bd = L.body, bdD = U.shade(bd, -0.3), bdL = U.shade(bd, 0.15);
    var big = L.build === 'big';
    var woman = L.hairStyle === 'bun' || L.hairStyle === 'woman';
    var cx = 24;

    // --- shoulders / robe ---
    var sw = big ? 23 : woman ? 16 : 19;
    for (var y = 43; y < PH; y++) {
      var t = (y - 43) / 12;
      var hw = Math.round(sw * (0.62 + 0.38 * Math.min(1, t * 1.6)));
      for (var x = -hw; x < hw; x++) g.set(cx + x, y, x > hw * 0.45 ? bdD : x < -hw * 0.6 ? bdL : bd);
    }
    // neck
    g.rect(cx - 4, 38, 8, 7, skD); g.rect(cx - 4, 38, 5, 6, sk);
    // crossed collar
    for (var i = 0; i < 9; i++) { g.set(cx - 6 + i, 43 + i, L.trim); g.set(cx - 5 + i, 43 + i, L.trim); g.set(cx + 6 - i, 43 + i, L.trim); }
    if (L.armor) { // lamellar armour on shoulders
      for (var ay = 45; ay < PH; ay += 3) for (var ax = -sw + 2; ax < sw - 2; ax += 4) { if (Math.abs(ax) < 6) continue; g.set(cx + ax, ay, L.armor); g.set(cx + ax + 1, ay, U.shade(L.armor, 0.3)); }
    }
    if (L.beads) for (i = 0; i < 14; i++) { var bx = cx - 9 + i * 1.3, byy = 45 + Math.round(Math.sin(i / 13 * Math.PI) * 6); g.set(bx, byy, i % 2 ? '#4a2414' : '#7a4424'); }
    if (L.mark === 'dragons' || L.mark === 'tattooChest') { for (i = 0; i < 6; i++) { g.set(cx - 2 + i % 3, 44 + i, '#3a5a9a'); } g.set(cx + 1, 46, '#c84a3a'); }

    // --- head ---
    var faceRx = L.face === 'round' ? 12 : L.face === 'square' ? 12 : L.face === 'long' ? 10 : L.face === 'narrow' ? 9 : 11;
    var faceRy = L.face === 'long' ? 16 : L.face === 'round' ? 13 : 14;
    if (big) faceRx += 1;
    var fcy = 25;
    ellipseRows(g, cx, fcy, faceRx, faceRy, sk);
    if (L.face === 'square') { g.rect(cx - faceRx + 1, fcy + 4, faceRx * 2 - 2, 7, sk); }
    // shading on the right side, light on left cheek
    ellipseRows(g, cx + 3, fcy + 1, faceRx - 2, faceRy - 1, sk);
    for (y = fcy - faceRy; y <= fcy + faceRy; y++) for (x = cx + Math.round(faceRx * 0.45); x < cx + faceRx + 1; x++) if (g.get(x, y) === sk) g.set(x, y, skD);
    for (y = fcy + 6; y <= fcy + faceRy; y++) for (x = cx - faceRx; x < cx + faceRx; x++) if (g.get(x, y) === sk && y > fcy + faceRy - 3) g.set(x, y, skD);
    g.set(cx - 7, fcy + 4, skL); g.set(cx - 6, fcy + 4, skL); g.set(cx - 7, fcy + 5, skL);
    // ears
    g.rect(cx - faceRx - 1, fcy - 1, 2, 6, skD); g.rect(cx + faceRx - 1, fcy - 1, 2, 6, skDD);
    if (L.earring) g.set(cx - faceRx - 1, fcy + 6, '#d8b36a');

    // --- eyes & brows ---
    var ey = fcy - 1, ex = 5;
    var eyeC = L.eyeColor || '#16100c';
    var white = '#f4efe6';
    var angry = expr === 'angry' || L.fierce, sad = expr === 'sad', shock = expr === 'shock', smile = expr === 'smile';
    function eye(sx, side) {
      var x0 = cx + sx * ex - (sx < 0 ? 3 : 0);
      if (L.eyes === 'narrow' || (smile && L.eyes !== 'round')) {
        g.hline(x0, x0 + 3, ey, eyeC); g.set(x0 + (sx < 0 ? 3 : 0), ey - 1, eyeC);
        if (smile) { g.hline(x0, x0 + 3, ey, eyeC); g.set(x0, ey + 1, skD); g.set(x0 + 3, ey + 1, skD); }
      } else {
        g.hline(x0, x0 + 3, ey - 1, eyeC);              // upper lid
        g.hline(x0, x0 + 3, ey, white);
        if (L.eyes === 'round' || shock) g.hline(x0, x0 + 3, ey + 1, white);
        var pupX = sx < 0 ? x0 + 2 : x0 + 1;
        g.set(pupX, ey, eyeC); if (L.eyes === 'round' || shock) g.set(pupX, ey + 1, eyeC);
        if (L.eyes === 'sharp' || angry) { g.set(x0 + (sx < 0 ? 0 : 3), ey - 1, white); g.set(x0 + (sx < 0 ? 0 : 3), ey - 2, eyeC); }
        if (L.eyes === 'fierce' || L.redEyes) { g.set(pupX, ey, L.redEyes ? '#c8302a' : eyeC); g.hline(x0, x0 + 3, ey + 1, eyeC); }
        g.set(x0 + (sx < 0 ? 3 : 0), ey + 1, skD);
      }
      // brow
      var by = ey - 4;
      var bc = L.browColor || hr;
      var thick = L.brows === 'thick' || big;
      for (var b = 0; b < 5; b++) {
        var bx2 = cx + sx * (ex - 1) + (sx < 0 ? -b : b) - (sx < 0 ? 0 : 0);
        var tilt = angry ? (sx < 0 ? -b + 3 : -b + 3) * 0.5 : sad ? (b - 2) * 0.5 : L.brows === 'angled' ? (-b + 2) * 0.4 : 0;
        var yy = Math.round(by - (angry ? -(4 - b) * 0.5 : 0) + (sad ? -(4 - b) * 0.45 : 0) + (L.brows === 'angled' ? (b - 2) * -0.3 : 0));
        if (angry) yy = Math.round(by + (4 - b) * 0.55 - 1);
        g.set(bx2, yy, bc); if (thick) g.set(bx2, yy - 1, bc);
      }
    }
    eye(-1); eye(1);
    if (L.mark === 'blue') { // Yang Zhi's great blue birthmark
      for (y = ey + 2; y < ey + 10; y++) for (x = cx - 10; x < cx - 3; x++) if (g.get(x, y) === sk || g.get(x, y) === skD || g.get(x, y) === skL) { if (U.hash2(x, y, 3) > 0.15 && (x - (cx - 7)) * (x - (cx - 7)) + (y - ey - 5) * (y - ey - 5) < 14) g.set(x, y, (x + y) % 3 ? '#4a6e9e' : '#5a80b0'); }
    }
    if (L.mark === 'tattooFace') { g.set(cx - 8, ey + 5, '#3a4a6a'); g.set(cx - 8, ey + 6, '#3a4a6a'); g.set(cx - 7, ey + 6, '#3a4a6a'); }
    if (L.mark === 'scar') { g.line(cx + 4, ey - 4, cx + 8, ey + 4, '#a85a4a'); }

    // --- nose & mouth ---
    var ny = fcy + 4;
    g.set(cx, ny, skDD); g.set(cx + 1, ny, skD); g.set(cx - 1, ny + 1, skD); g.set(cx + 2, ny + 1, skDD);
    var my = fcy + 8;
    var lip = L.lips || U.shade(sk, -0.38);
    if (woman && !L.lips) lip = '#c04a4a';
    if (angry) { g.hline(cx - 3, cx + 3, my, lip); g.set(cx - 3, my + 1, lip); g.set(cx + 3, my + 1, lip); g.hline(cx - 2, cx + 2, my + 1, '#2a1410'); }
    else if (smile) { g.hline(cx - 2, cx + 2, my + 1, lip); g.set(cx - 3, my, lip); g.set(cx + 3, my, lip); }
    else if (sad) { g.hline(cx - 2, cx + 2, my, lip); g.set(cx - 3, my + 1, lip); g.set(cx + 3, my + 1, lip); }
    else if (shock) { g.rect(cx - 1, my - 1, 3, 3, '#2a1410'); }
    else g.hline(cx - 2, cx + 2, my, lip);

    // --- beard ---
    var bdc = L.beardColor || hr;
    if (L.beard === 'stubble') {
      for (y = my - 2; y < fcy + faceRy; y++) for (x = cx - faceRx + 2; x < cx + faceRx - 1; x++) { var c0 = g.get(x, y); if ((c0 === sk || c0 === skD) && (x + y) % 2 === 0 && y > my - 1) g.set(x, y, U.mix(c0, bdc, 0.45)); }
    } else if (L.beard === 'mustache' || L.beard === 'short' || L.beard === 'full' || L.beard === 'long') {
      g.hline(cx - 4, cx + 4, my - 2, bdc); g.set(cx - 5, my - 1, bdc); g.set(cx + 5, my - 1, bdc);
      if (L.beard === 'short') { g.hline(cx - 2, cx + 2, my + 3, bdc); g.hline(cx - 3, cx + 3, my + 4, bdc); g.hline(cx - 2, cx + 2, my + 5, bdc); }
      if (L.beard === 'full') {
        for (y = fcy - 2; y < fcy + faceRy + 5; y++) for (x = cx - faceRx; x <= cx + faceRx; x++) {
          var inFace = g.get(x, y) === sk || g.get(x, y) === skD || g.get(x, y) === skL || (y > fcy + faceRy - 2 && Math.abs(x - cx) < faceRx - (y - fcy - faceRy) * 2);
          var side = Math.abs(x - cx) > faceRx - 4 && y > fcy - 1;
          var jaw = y > my + 1;
          if (inFace && (side || jaw) && !(y === my && Math.abs(x - cx) < 3)) g.set(x, y, (x * 7 + y * 3) % 5 === 0 ? hrL : bdc);
        }
        g.hline(cx - 2, cx + 2, my, lip);
      }
      if (L.beard === 'long') { // flowing beard (Guan Sheng, Zhu Tong)
        for (y = my + 2; y < my + 20; y++) { var hw2 = Math.max(1, Math.round(5 - (y - my) * 0.18)); for (x = -hw2; x <= hw2; x++) g.set(cx + x + Math.round(Math.sin(y * 0.4) * 0.6), y, (x + y) % 4 === 0 ? hrL : bdc); }
        g.vline(cx - 6, my - 3, my + 4, bdc); g.vline(cx + 6, my - 3, my + 4, bdc);
      }
    }

    // --- hair & headwear ---
    var hs = L.hairStyle;
    var top = fcy - faceRy;
    function hairCap(depth, wide) {
      for (y = top - 3; y < top + depth; y++) {
        var w = Math.round((faceRx + (wide || 1)) * Math.sqrt(Math.max(0, 1 - Math.pow((y - (top + depth)) / (depth + 3), 2))));
        for (x = -w; x <= w; x++) g.set(cx + x, y, (x < -w * 0.3 && y < top + 3) ? hrL : hr);
      }
    }
    if (hs === 'bald' || hs === 'monk') {
      for (y = top; y < top + 8; y++) for (x = cx - faceRx; x < cx + faceRx; x++) if (g.get(x, y) === sk || g.get(x, y) === skD) g.set(x, y, y < top + 3 && x < cx ? skL : g.get(x, y));
      ellipseRows(g, cx, top + 4, faceRx - 1, 6, sk, null, cx + 3); ellipseRows(g, cx, top + 4, faceRx - 1, 6, skD, cx + 4, null);
      g.set(cx - 5, top + 1, skL); g.set(cx - 4, top + 1, skL); g.set(cx - 5, top + 2, '#fff2dc');
      if (hs === 'monk') for (i = 0; i < 6; i++) { g.set(cx - 5 + (i % 3) * 5, top + 3 + Math.floor(i / 3) * 3, '#8a5a4a'); }
      if (L.beard === 'none') {}
    } else {
      hairCap(8, 1);
      // sideburns and temples
      g.rect(cx - faceRx - 1, top + 6, 3, 9, hr); g.rect(cx + faceRx - 1, top + 6, 3, 9, hr);
      // hairline fringe
      for (x = -faceRx + 2; x < faceRx - 1; x++) if ((x + 20) % 4 === 0) g.set(cx + x, top + 8, hr);
    }
    if (hs === 'topknot' || hs === 'headband' || hs === 'wild') {
      ellipseRows(g, cx, top - 5, 5, 4, hr); g.hline(cx - 2, cx + 1, top - 8, hrL);
      g.rect(cx - 5, top - 2, 10, 2, L.knotTie || hrD);
    }
    if (hs === 'headband') { var hb = L.band || '#b02a1e'; for (x = -faceRx - 1; x <= faceRx + 1; x++) { g.set(cx + x, top + 5, hb); g.set(cx + x, top + 6, U.shade(hb, -0.2)); } g.rect(cx + faceRx, top + 6, 3, 2, hb); g.line(cx + faceRx + 2, top + 7, cx + faceRx + 5, top + 14, hb); }
    if (hs === 'wild') { for (i = 0; i < 9; i++) { var ang = -Math.PI * 0.95 + i * Math.PI * 0.9 / 8; g.line(cx + Math.round(Math.cos(ang) * (faceRx - 2)), top + 4 + Math.round(Math.sin(ang) * 4), cx + Math.round(Math.cos(ang) * (faceRx + 4)), top + 3 + Math.round(Math.sin(ang) * 9), hr); } }
    if (hs === 'long' || hs === 'pilgrim') {
      for (y = top + 4; y < 46; y++) { g.set(cx - faceRx - 1, y, hr); g.set(cx - faceRx, y, hr); g.set(cx - faceRx - 2, y + 1, hrD); g.set(cx + faceRx, y, hr); g.set(cx + faceRx + 1, y, hrD); g.set(cx + faceRx - 1, y, hr); }
      if (hs === 'pilgrim') { for (x = -faceRx; x <= faceRx; x++) { g.set(cx + x, top + 4, '#b8b090'); g.set(cx + x, top + 5, '#d8d0b0'); } g.rect(cx - 2, top + 3, 4, 4, '#e8dca0'); g.set(cx - 1, top + 4, '#c8302a'); }
    }
    if (hs === 'scarf') {
      var scf = L.band || '#2a3a5a';
      for (y = top - 6; y < top + 7; y++) { var w2 = Math.round((faceRx + 2) * Math.sqrt(Math.max(0, 1 - Math.pow((y - (top + 7)) / 13, 2)))); for (x = -w2; x <= w2; x++) g.set(cx + x, y, x < -w2 * 0.4 ? U.shade(scf, 0.2) : scf); }
      g.rect(cx - 3, top - 9, 6, 4, scf); g.line(cx + faceRx, top + 4, cx + faceRx + 4, top + 16, scf); g.line(cx + faceRx + 1, top + 4, cx + faceRx + 5, top + 16, U.shade(scf, -0.3));
    }
    if (hs === 'hat') {
      var hc = L.hatColor || '#8a6a3a';
      for (y = top - 7; y < top + 3; y++) { var w3 = Math.round(8 + (y - top + 7) * 1.0); for (x = -w3; x <= w3; x++) g.set(cx + x, y, (x + y) % 3 ? hc : U.shade(hc, -0.15)); }
      for (x = -faceRx - 8; x <= faceRx + 8; x++) { g.set(cx + x, top + 3, U.shade(hc, -0.3)); g.set(cx + x, top + 2, hc); }
    }
    if (hs === 'futou') {
      for (y = top - 7; y < top + 6; y++) { var w4 = faceRx + 1 - Math.max(0, (top - y) - 2); for (x = -w4; x <= w4; x++) g.set(cx + x, y, '#15151b'); }
      g.hline(cx - faceRx - 1, cx + faceRx + 1, top + 5, '#2a2a34');
      for (i = 0; i < 9; i++) { g.set(cx - faceRx - 2 - i, top + 1, '#15151b'); g.set(cx + faceRx + 2 + i, top + 1, '#15151b'); g.set(cx - faceRx - 2 - i, top + 2, '#22222a'); g.set(cx + faceRx + 2 + i, top + 2, '#22222a'); }
    }
    if (hs === 'helmet') {
      var hm = L.helmColor || '#7a7a86', hmL = U.shade(hm, 0.3), hmD = U.shade(hm, -0.35);
      for (y = top - 7; y < top + 7; y++) { var w5 = Math.round((faceRx + 3) * Math.sqrt(Math.max(0, 1 - Math.pow((y - (top + 7)) / 14, 2)))); for (x = -w5; x <= w5; x++) g.set(cx + x, y, x < -w5 * 0.4 ? hmL : x > w5 * 0.5 ? hmD : hm); }
      g.hline(cx - faceRx - 3, cx + faceRx + 3, top + 6, hmD); g.hline(cx - faceRx - 3, cx + faceRx + 3, top + 7, '#d8b36a');
      g.rect(cx - faceRx - 3, top + 7, 3, 12, hm); g.rect(cx + faceRx, top + 7, 3, 12, hmD);
      g.rect(cx - 1, top - 11, 3, 5, '#d8b36a'); for (i = 0; i < 7; i++) g.set(cx + Math.round(Math.sin(i) * 2), top - 12 - i, L.tassel || '#c8302a'); g.rect(cx - 2, top - 16, 5, 4, L.tassel || '#c8302a');
    }
    if (hs === 'daoist') {
      g.rect(cx - 5, top - 9, 10, 6, L.crown || '#d8b36a'); g.hline(cx - 6, cx + 5, top - 3, U.shade(L.crown || '#d8b36a', -0.3)); g.line(cx - 9, top - 6, cx + 9, top - 6, '#8a7040'); g.set(cx, top - 7, '#f0e0a0');
    }
    if (woman) {
      ellipseRows(g, cx, top - 6, 8, 6, hr); ellipseRows(g, cx - 2, top - 8, 3, 2, hrL);
      g.rect(cx - faceRx - 2, top + 4, 4, 14, hr); g.rect(cx + faceRx - 2, top + 4, 4, 14, hrD);
      var pin = L.pin || '#d8b36a';
      g.line(cx + 4, top - 8, cx + 13, top - 13, pin); g.set(cx + 13, top - 14, '#c8302a'); g.set(cx + 14, top - 13, '#c8302a');
      if (L.flower) { g.rect(cx - 9, top - 4, 3, 3, L.flower); g.set(cx - 8, top - 3, '#f0e080'); }
    }
    if (L.flowerHair) { g.rect(cx + 6, top - 2, 3, 3, L.flowerHair); g.set(cx + 7, top - 1, '#f8f0a0'); }

    // outline pass for crisp silhouette
    g.outline('#120c08');
    var cv = U.makeCanvas(PW, PH);
    g.toCanvas(cv, 0, 0);
    return cv;
  }

  PT.get = function (id, expr) {
    expr = expr || 'normal';
    if (PT.overrides[id + ':' + expr]) return PT.overrides[id + ':' + expr];
    var sheets = WM.ASSETS && WM.ASSETS.portraitSheets;
    if (sheets && sheets[id]) PT.tryExpressionSheet(id, sheets[id]);
    if (PT.overrides[id]) return PT.overrides[id];
    var key = id + ':' + expr;
    if (!PT.cache[key]) {
      var ch = WM.data.chars[id] || (WM.data.npcs && WM.data.npcs[id]);
      var lk = ch ? ((typeof ch.face === 'object' && ch.face) || ch.look || {}) : {};
      if (ch && ch.look && ch.face && typeof ch.face === 'object') { var m = {}; for (var k in ch.look) m[k] = ch.look[k]; for (k in ch.face) m[k] = ch.face[k]; lk = m; }
      PT.cache[key] = build(lk, expr);
    }
    return PT.cache[key];
  };
  PT.build = build;

  PT.tryOverride = function (id) {
    var img = new Image();
    img.onload = function () {
      img.isOverride = true;
      if (!PT.overrides[id + ':normal']) PT.overrides[id] = img;
    };
    img.src = 'assets/portraits/' + id + '.png';
  };

  // Expression sheets share one image download; each cell becomes a cached portrait.
  PT.sheetLoads = {};
  PT.sheetSettled = {};
  PT.tryExpressionSheet = function (id, spec) {
    if (PT.sheetLoads[id]) return PT.sheetLoads[id];
    PT.sheetLoads[id] = new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var cw = img.width / spec.columns, ch = img.height / spec.rows;
        spec.expressions.forEach(function (expr, i) {
          var tile = U.makeCanvas(Math.round(cw), Math.round(ch));
          tile.getContext('2d').drawImage(img, (i % spec.columns) * cw,
            Math.floor(i / spec.columns) * ch, cw, ch, 0, 0, tile.width, tile.height);
          tile.isOverride = true;
          PT.overrides[id + ':' + expr] = tile;
          if (expr === 'normal') PT.overrides[id] = tile;
        });
        PT.sheetSettled[id] = true;
        resolve(true);
      };
      img.onerror = function () { PT.sheetSettled[id] = true; resolve(false); };
      // never hold up a line of dialogue on art: if the sheet is slow, go on with the plain portrait
      setTimeout(function () { if (!PT.sheetSettled[id]) { PT.sheetSettled[id] = true; resolve(false); } }, 2500);
      img.src = 'assets/portraits/' + (spec.file || id) + '-expressions.png';   // a sheet may be shared (spec.file)
    });
    return PT.sheetLoads[id];
  };

  // Preserve painted portrait proportions and smooth downsampling at every UI size.
  PT.drawOverride = function (img, x, y, w, h) {
    var c = WM.gfx.ctx;
    var s = Math.max(w / img.width, h / img.height);
    c.save();
    c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = 'high';
    c.drawImage(img, x + (w - img.width * s) / 2, y, img.width * s, img.height * s);
    c.restore();
  };

  // Draw framed portrait on UI canvas at (x,y) sized 144x168.
  PT.drawFramed = function (id, expr, x, y, flip) {
    var c = WM.gfx.ctx;
    var img = PT.get(id, expr);
    WM.gfx.window(x - 6, y - 6, 156, 180, { alpha: 0.96, top: '#2a3448', bottom: '#151a28' });
    c.save();
    c.beginPath(); c.rect(x, y, 144, 168); c.clip();
    var gr = c.createLinearGradient(0, y, 0, y + 168);
    gr.addColorStop(0, '#3a4660'); gr.addColorStop(1, '#1a2032');
    c.fillStyle = gr; c.fillRect(x, y, 144, 168);
    c.imageSmoothingEnabled = !img.isOverride ? false : true;
    if (img.isOverride) {
      PT.drawOverride(img, x, y, 144, 168);
    } else WM.gfx.blit(img, x, y, 3, flip);
    c.restore();
  };
})();
