// Procedural character sprites (16x24 field sprites, 4 directions x 3 frames)
// built from a "look" descriptor, with a dark outline pass for a clean pixel-art read.
// Drop-in override: assets/sprites/<id>.png (48x96: 3 frames across; rows = down, left, right, up).
'use strict';
(function () {
  var U = WM.util;
  var SP = WM.sprites = { cache: {}, overrides: {} };
  var W = 16, H = 24;
  var OUTLINE = '#1b130e';

  function Grid(w, h) { this.w = w; this.h = h; this.p = new Array(w * h); }
  Grid.prototype.set = function (x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.p[y * this.w + x] = c; };
  Grid.prototype.get = function (x, y) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null; return this.p[y * this.w + x]; };
  Grid.prototype.rect = function (x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) this.set(x + i, y + j, c); };
  Grid.prototype.hline = function (x0, x1, y, c) { for (var x = x0; x <= x1; x++) this.set(x, y, c); };
  Grid.prototype.vline = function (x, y0, y1, c) { for (var y = y0; y <= y1; y++) this.set(x, y, c); };
  Grid.prototype.line = function (x0, y0, x1, y1, c) {
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy;
    for (var n = 0; n < 200; n++) { this.set(x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * err; if (e2 > -dy) { err -= dy; x0 += sx; } if (e2 < dx) { err += dx; y0 += sy; } }
  };
  Grid.prototype.outline = function (col) {
    var add = [];
    for (var y = 0; y < this.h; y++) for (var x = 0; x < this.w; x++) {
      if (this.get(x, y)) continue;
      if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) add.push(x, y);
    }
    for (var i = 0; i < add.length; i += 2) this.p[add[i + 1] * this.w + add[i]] = col;
  };
  Grid.prototype.toCanvas = function (cv, ox, oy, flip) {
    var c = cv.getContext('2d');
    for (var y = 0; y < this.h; y++) for (var x = 0; x < this.w; x++) {
      var col = this.p[y * this.w + x];
      if (!col) continue;
      c.fillStyle = col;
      c.fillRect(ox + (flip ? this.w - 1 - x : x), oy + y, 1, 1);
    }
  };
  SP.Grid = Grid;

  var DEFAULT = { skin: '#e8b48a', hair: '#1c1612', hairStyle: 'topknot', beard: 'none', body: '#4a6a9a', trim: '#d8c49a', pants: '#3a3028', shoes: '#2a1e16', build: 'normal', weapon: 'none' };

  function look(l) { var o = {}; for (var k in DEFAULT) o[k] = DEFAULT[k]; for (k in l) o[k] = l[k]; return o; }

  // ---- body parts ----
  function drawHead(g, L, dir, ox, oy) {
    var sk = L.skin, skD = U.shade(sk, -0.18), hr = L.hair, hrL = U.shade(hr, 0.25);
    var bald = L.hairStyle === 'bald' || L.hairStyle === 'monk';
    // head block 8x8 at (4..11, 2..9)
    var x0 = 4 + ox, y0 = 2 + oy;
    g.rect(x0, y0 + 1, 8, 7, sk);
    g.hline(x0 + 1, x0 + 6, y0, sk);
    g.vline(x0 + 7, y0 + 2, y0 + 7, skD);
    if (dir === 'down') {
      // eyes, brows
      var eye = L.eyeColor || '#1a1410';
      g.set(x0 + 2, y0 + 5, eye); g.set(x0 + 5, y0 + 5, eye);
      if (L.fierce) { g.set(x0 + 1, y0 + 4, hr); g.set(x0 + 2, y0 + 4, hr); g.set(x0 + 5, y0 + 4, hr); g.set(x0 + 6, y0 + 4, hr); }
      g.set(x0 + 3, y0 + 7, skD); g.set(x0 + 4, y0 + 7, skD);
      if (L.mark === 'blue') { g.set(x0 + 1, y0 + 5, '#4a6a9a'); g.set(x0 + 1, y0 + 6, '#4a6a9a'); g.set(x0 + 2, y0 + 6, '#5a7aaa'); }
      if (L.mark === 'tattooFace') { g.set(x0 + 1, y0 + 6, '#4a5a7a'); g.set(x0 + 6, y0 + 6, '#4a5a7a'); }
    } else if (dir === 'left') {
      g.set(x0 + 1, y0 + 5, L.eyeColor || '#1a1410');
      g.set(x0 - 1, y0 + 6, sk); // nose
      if (L.fierce) { g.set(x0 + 1, y0 + 4, hr); g.set(x0 + 2, y0 + 4, hr); }
      g.set(x0 + 6, y0 + 5, skD); // ear
      if (L.mark === 'blue') { g.set(x0 + 2, y0 + 5, '#4a6a9a'); g.set(x0 + 2, y0 + 6, '#4a6a9a'); g.set(x0 + 3, y0 + 6, '#5a7aaa'); }
    }
    // hair / headwear
    var hs = L.hairStyle;
    if (!bald) {
      if (dir === 'up') { g.rect(x0, y0, 8, 7, hr); g.hline(x0 + 1, x0 + 6, y0 - 1, hr); g.hline(x0 + 2, x0 + 4, y0 + 1, hrL); }
      else if (dir === 'down') { g.rect(x0, y0, 8, 3, hr); g.set(x0, y0 + 3, hr); g.set(x0 + 7, y0 + 3, hr); g.set(x0, y0 + 4, hr); g.set(x0 + 7, y0 + 4, hr); g.hline(x0 + 1, x0 + 6, y0 - 1, hr); g.hline(x0 + 2, x0 + 3, y0, hrL); }
      else { g.rect(x0 + 2, y0, 6, 3, hr); g.rect(x0 + 4, y0 + 3, 4, 3, hr); g.hline(x0 + 1, x0 + 6, y0 - 1, hr); g.set(x0 + 3, y0, hrL); }
    }
    if (hs === 'topknot' || hs === 'headband' || hs === 'scarf') {
      g.rect(x0 + 3, y0 - 3, 2, 2, hr); g.set(x0 + 3, y0 - 3, hrL);
      g.hline(x0 + 2, x0 + 5, y0 - 1, hr);
    }
    if (hs === 'headband') {
      var hb = L.band || '#b02a1e';
      if (dir === 'down') g.hline(x0, x0 + 7, y0 + 2, hb);
      else if (dir === 'up') { g.hline(x0, x0 + 7, y0 + 2, hb); g.set(x0 + 3, y0 + 3, hb); g.set(x0 + 4, y0 + 4, hb); }
      else { g.hline(x0, x0 + 7, y0 + 2, hb); g.set(x0 + 8, y0 + 3, hb); g.set(x0 + 9, y0 + 4, hb); }
    }
    if (hs === 'scarf') { // scholar's cloth cap
      var sc = L.band || '#2a3a5a';
      g.rect(x0, y0 - 1, 8, 3, sc); g.rect(x0 + 2, y0 - 3, 4, 2, sc);
      if (dir !== 'down') { g.set(x0 + (dir === 'left' ? 8 : 3), y0 + 2, sc); g.set(x0 + (dir === 'left' ? 9 : 4), y0 + 4, sc); }
    }
    if (hs === 'long' || hs === 'pilgrim') { // loose long hair (Wu Song as pilgrim: hair to shoulders with metal band)
      if (dir === 'up') g.rect(x0, y0 + 5, 8, 4, hr);
      else if (dir === 'left') g.rect(x0 + 4, y0 + 4, 4, 5, hr);
      else { g.vline(x0, y0 + 3, y0 + 8, hr); g.vline(x0 + 7, y0 + 3, y0 + 8, hr); }
      if (hs === 'pilgrim') { g.hline(x0, x0 + 7, y0 + 1, '#c8c0a0'); g.set(x0 + 3, y0 + 1, '#f0e8c0'); }
    }
    if (hs === 'wild') { // spiky unkempt (Li Kui, Liu Tang)
      g.set(x0 - 1, y0 + 1, hr); g.set(x0 + 8, y0 + 1, hr); g.set(x0 + 1, y0 - 2, hr); g.set(x0 + 4, y0 - 2, hr); g.set(x0 + 6, y0 - 2, hr); g.set(x0 - 1, y0 + 3, hr); g.set(x0 + 8, y0 + 3, hr);
    }
    if (hs === 'bun' || hs === 'woman') { // women's high bun with hairpin
      g.rect(x0 + 2, y0 - 4, 4, 3, hr); g.hline(x0 + 3, x0 + 4, y0 - 5, hr);
      g.set(x0 + 6, y0 - 3, L.pin || '#d8b36a'); g.set(x0 + 7, y0 - 4, L.pin || '#d8b36a');
      if (dir !== 'up') { g.vline(x0, y0 + 3, y0 + 6, hr); g.vline(x0 + 7, y0 + 3, y0 + 6, hr); }
      else g.rect(x0, y0 + 5, 8, 3, hr);
    }
    if (hs === 'hat') { // wide straw/travel hat
      var hc = L.hatColor || '#8a6a3a';
      g.hline(x0 - 2, x0 + 9, y0 + 1, hc); g.hline(x0 - 1, x0 + 8, y0 + 2, U.shade(hc, -0.25)); g.rect(x0 + 1, y0 - 2, 6, 3, hc); g.hline(x0 + 2, x0 + 5, y0 - 3, U.shade(hc, 0.2));
    }
    if (hs === 'futou') { // an official's black gauze cap (幞头): a rounded crown behind, and long straight wings out to either side
      g.rect(x0, y0 - 2, 8, 4, '#16161c'); g.rect(x0 + 1, y0 - 4, 6, 2, '#16161c'); g.hline(x0 + 2, x0 + 5, y0 - 5, '#16161c');
      g.hline(x0 + 1, x0 + 6, y0 - 1, '#2a2a34');   // the band
      if (dir === 'down' || dir === 'up') { g.hline(x0 - 6, x0 - 1, y0, '#16161c'); g.hline(x0 + 8, x0 + 13, y0, '#16161c'); g.set(x0 - 6, y0 - 1, '#16161c'); g.set(x0 + 13, y0 - 1, '#16161c'); }
      else { g.hline(x0 + 8, x0 + 12, y0, '#16161c'); g.set(x0 - 1, y0, '#16161c'); }
    }
    if (hs === 'helmet') { // general's helmet with tassel
      var hm = L.helmColor || '#7a7a86';
      g.rect(x0 - 1, y0 - 1, 10, 4, hm); g.hline(x0 - 1, x0 + 8, y0 + 2, U.shade(hm, -0.3)); g.rect(x0 + 2, y0 - 3, 4, 2, hm); g.set(x0 + 3, y0 - 3, U.shade(hm, 0.3));
      g.vline(x0 + 4, y0 - 6, y0 - 4, L.tassel || '#c8302a'); g.set(x0 + 3, y0 - 6, L.tassel || '#c8302a'); g.set(x0 + 5, y0 - 5, L.tassel || '#c8302a');
      if (dir !== 'up') { g.vline(x0 - 1, y0 + 3, y0 + 6, hm); g.vline(x0 + 8, y0 + 3, y0 + 6, hm); }
    }
    if (hs === 'daoist') { // Daoist crown (Gongsun Sheng, Fan Rui)
      g.rect(x0 + 2, y0 - 3, 4, 3, L.crown || '#d8b36a'); g.set(x0 + 1, y0 - 2, L.crown || '#d8b36a'); g.set(x0 + 6, y0 - 2, L.crown || '#d8b36a'); g.vline(x0 + 3, y0 - 5, y0 - 3, '#8a7040');
    }
    if (hs === 'monk' && dir !== 'up') { g.set(x0 + 2, y0 + 1, U.shade(sk, 0.25)); g.set(x0 + 3, y0 + 1, U.shade(sk, 0.25)); }
    if (hs === 'monk') { g.set(x0 + 5, y0, '#8a6a5a'); g.set(x0 + 2, y0 + 1, '#8a6a5a'); } // ordination marks
    // beard
    if (dir !== 'up' && L.beard !== 'none') {
      var bd = L.beardColor || hr;
      if (dir === 'down') {
        if (L.beard === 'stubble') { g.hline(x0 + 1, x0 + 6, y0 + 7, U.mix(sk, bd, 0.55)); g.set(x0 + 1, y0 + 6, U.mix(sk, bd, 0.55)); g.set(x0 + 6, y0 + 6, U.mix(sk, bd, 0.55)); }
        else if (L.beard === 'short') { g.hline(x0 + 1, x0 + 6, y0 + 7, bd); g.hline(x0 + 2, x0 + 5, y0 + 8, bd); }
        else if (L.beard === 'full') { g.vline(x0, y0 + 4, y0 + 7, bd); g.vline(x0 + 7, y0 + 4, y0 + 7, bd); g.hline(x0, x0 + 7, y0 + 7, bd); g.hline(x0 + 1, x0 + 6, y0 + 8, bd); g.hline(x0 + 2, x0 + 5, y0 + 9, bd); g.set(x0 + 3, y0 + 6, bd); g.set(x0 + 4, y0 + 6, bd); }
        else if (L.beard === 'long') { g.hline(x0 + 2, x0 + 5, y0 + 7, bd); g.rect(x0 + 2, y0 + 8, 4, 3, bd); g.hline(x0 + 3, x0 + 4, y0 + 11, bd); g.set(x0 + 2, y0 + 6, bd); g.set(x0 + 5, y0 + 6, bd); }
        else if (L.beard === 'mustache') { g.hline(x0 + 2, x0 + 5, y0 + 6, bd); }
      } else {
        if (L.beard === 'stubble') g.hline(x0, x0 + 3, y0 + 7, U.mix(sk, bd, 0.55));
        else if (L.beard === 'short') { g.hline(x0, x0 + 3, y0 + 7, bd); g.hline(x0 + 1, x0 + 2, y0 + 8, bd); }
        else if (L.beard === 'full') { g.rect(x0, y0 + 6, 5, 2, bd); g.hline(x0 + 1, x0 + 4, y0 + 8, bd); g.vline(x0 + 4, y0 + 4, y0 + 6, bd); }
        else if (L.beard === 'long') { g.rect(x0, y0 + 7, 3, 4, bd); g.set(x0 + 1, y0 + 11, bd); }
        else if (L.beard === 'mustache') g.hline(x0, x0 + 2, y0 + 6, bd);
      }
    }
  }

  function drawBody(g, L, dir, frame, ox, oy) {
    var big = L.build === 'big', slim = L.build === 'slim', small = L.build === 'small';
    var bd = L.body, bdD = U.shade(bd, -0.28), bdL = U.shade(bd, 0.18), tr = L.trim, sk = L.skin;
    // an official (wearing the 幞头 cap) wears the round-collared robe of rank, long to the feet, with a loose belt of
    // gold plaques and wide sleeves; a civil one (no weapon) holds his ivory court tablet before him
    var official = L.hairStyle === 'futou' && L.robe !== false;
    var skirt = L.dress || official;
    var top = 10 + oy, legTop = (small ? 17 : 18) + oy, bottom = 23 + oy;
    var bw = big ? 10 : slim ? 6 : 8, bx = 8 - bw / 2 + ox;
    var step = frame === 1 ? 1 : frame === 2 ? -1 : 0;
    if (dir === 'down' || dir === 'up') {
      // torso
      g.rect(bx, top, bw, legTop - top, bd);
      g.vline(bx + bw - 1, top, legTop - 1, bdD);
      g.vline(bx, top, legTop - 1, bdL);
      if (dir === 'down') {
        // crossed collar (jiaoling)
        g.set(bx + bw / 2 - 1, top, tr); g.set(bx + bw / 2, top + 1, tr); g.set(bx + bw / 2 + 1, top + 2, tr); g.set(bx + bw / 2 - 2, top + 1, tr);
        if (L.chest) { g.set(bx + bw / 2 - 1, top + 1, sk); g.set(bx + bw / 2, top + 2, sk); }
        if (L.mark === 'dragons') { g.set(bx + bw / 2 - 1, top + 1, '#3a5a9a'); g.set(bx + bw / 2, top + 2, '#3a5a9a'); }
        if (L.beads) for (var i = 0; i < bw - 2; i++) g.set(bx + 1 + i, top + 2 + (i % 2), i % 2 ? '#3a2014' : '#6a3a1e');
      }
      g.hline(bx, bx + bw - 1, top + 5, L.belt || bdD); // belt
      if (official) {
        if (dir === 'down') {   // the round collar, in place of the crossed one
          var cx0 = bx + bw / 2;
          g.set(cx0 - 2, top, tr); g.set(cx0 + 1, top, tr); g.set(cx0 - 1, top + 1, tr); g.set(cx0, top + 1, tr); g.set(cx0 - 1, top, bd); g.set(cx0, top, bd);
        }
        g.hline(bx - 1, bx + bw, top + 6, '#2a1a10'); for (var pq = bx; pq < bx + bw; pq += 2) g.set(pq, top + 6, '#d8b36a');   // the belt of plaques, worn low
        g.vline(bx - 2, top + 3, top + 7, bdD); g.vline(bx + bw + 1, top + 3, top + 7, bdD);                                    // wide sleeves
      }
      // arms
      var aOff = dir === 'down' ? step : -step;
      g.vline(bx - 1, top + 1, top + 5 + aOff, bd); g.vline(bx - 2, top + 2, top + 5 + aOff, bdD); g.set(bx - 1, top + 6 + aOff, sk); g.set(bx - 2, top + 6 + aOff, sk);
      g.vline(bx + bw, top + 1, top + 5 - aOff, bd); g.vline(bx + bw + 1, top + 2, top + 5 - aOff, bdD); g.set(bx + bw, top + 6 - aOff, sk); g.set(bx + bw + 1, top + 6 - aOff, sk);
      // lower robe + legs
      if (skirt) {
        g.rect(bx - 1, legTop, bw + 2, bottom - legTop, bd); g.hline(bx - 1, bx + bw, bottom - 1, tr);
        g.set(bx + 1 + (step > 0 ? 1 : 0), bottom, L.shoes); g.set(bx + bw - 2 - (step < 0 ? 1 : 0), bottom, L.shoes);
      } else {
        g.rect(bx + 1, legTop, bw - 2, 2, bd); // robe hem
        var lx = bx + 1, rx = bx + bw - 3;
        var lY = bottom - (step > 0 ? 1 : 0), rY = bottom - (step < 0 ? 1 : 0);
        g.rect(lx, legTop + 2, 2, lY - legTop - 2, L.pants); g.rect(rx, legTop + 2, 2, rY - legTop - 2, L.pants);
        g.hline(lx, lx + 1, lY, L.shoes); g.hline(rx, rx + 1, rY, L.shoes);
        g.set(lx, legTop + 2, tr); g.set(rx + 1, legTop + 2, tr); // leg wraps
      }
      if (official && dir === 'down' && (!L.weapon || L.weapon === 'none')) {   // the court tablet (笏), held in both hands
        var hx2 = bx + bw / 2;
        g.vline(hx2 - 1, top + 1, top + 5, '#ece4cc'); g.vline(hx2, top + 1, top + 5, '#d8d0b8');
        g.set(hx2 - 2, top + 5, sk); g.set(hx2 + 1, top + 5, sk);
      }
      if (dir === 'up' && L.mark === 'flowers') { g.set(bx + 2, top + 2, '#c84a6a'); g.set(bx + bw - 3, top + 3, '#c84a6a'); }
    } else { // left-facing profile
      var sw = big ? 8 : slim ? 5 : 6, sx = 8 - sw / 2 + ox;
      g.rect(sx, top, sw, legTop - top, bd);
      g.vline(sx + sw - 1, top, legTop - 1, bdD);
      g.set(sx, top, tr); g.set(sx + 1, top + 1, tr);
      g.hline(sx, sx + sw - 1, top + 5, L.belt || bdD);
      if (official) { g.hline(sx - 1, sx + sw - 1, top + 6, '#2a1a10'); g.set(sx + 1, top + 6, '#d8b36a'); g.set(sx + sw - 2, top + 6, '#d8b36a'); }   // the belt of plaques
      // arm swings
      var ax = sx + Math.floor(sw / 2) - 1 - step;
      g.vline(ax, top + 1, top + 5, bdL); g.vline(ax + 1, top + 1, top + 5, bd); g.set(ax, top + 6, sk); g.set(ax + 1, top + 6, sk);
      if (official) { g.vline(ax - 1, top + 3, top + 7, bdD); g.vline(ax + 2, top + 4, top + 7, bd); }   // a wide sleeve
      if (skirt) {
        g.rect(sx - 1, legTop, sw + 1, bottom - legTop, bd); g.hline(sx - 1, sx + sw - 1, bottom - 1, tr);
        g.set(sx - 1 - (step > 0 ? 1 : 0), bottom, L.shoes); g.set(sx + sw - 2, bottom, L.shoes);
      } else {
        g.rect(sx, legTop, sw, 2, bd);
        // scissor legs
        var f1 = 3 + ox - step * 1, f2 = 3 + ox + step * 1;
        var la = sx + 1 - step, lb = sx + sw - 3 + step;
        g.rect(la, legTop + 2, 2, bottom - legTop - 2, L.pants);
        g.rect(lb, legTop + 2, 2, bottom - legTop - 2, U.shade(L.pants, -0.2));
        g.hline(la - 1, la + 1, bottom, L.shoes); g.hline(lb - 1, lb + 1, bottom, U.shade(L.shoes, -0.2));
      }
    }
  }

  function drawWeapon(g, L, dir, frame, ox, oy, behind) {
    var w = L.weapon; if (!w || w === 'none' || w === 'fists') return;
    var metal = '#c8ccd4', metalD = '#7a808c', wood = '#7a4a28', gold = '#d8b36a';
    var top = 10 + oy;
    if (dir === 'down' || dir === 'up') {
      var hx = dir === 'down' ? 13 + ox : 2 + ox; // right hand side in front view
      if ((dir === 'up') !== !!behind) return;
      switch (w) {
        case 'spear': case 'halberd': case 'staff': case 'lance': case 'hooklance': case 'trident': case 'fork': case 'guandao':
          g.vline(hx, top - 9, top + 12, wood);
          if (w === 'spear' || w === 'lance' || w === 'hooklance') { g.vline(hx, top - 12, top - 10, metal); g.set(hx, top - 9, '#c8302a'); if (w === 'hooklance') g.set(hx + 1, top - 10, metal); }
          if (w === 'halberd') { g.vline(hx, top - 12, top - 10, metal); g.rect(hx + 1, top - 10, 2, 3, metal); }
          if (w === 'guandao') { g.rect(hx, top - 14, 2, 5, metal); g.set(hx + 1, top - 15, metal); g.set(hx - 1, top - 9, gold); }
          if (w === 'staff') { g.rect(hx - 1, top - 11, 3, 2, metalD); g.set(hx, top - 12, metal); }
          if (w === 'trident' || w === 'fork') { g.vline(hx, top - 12, top - 10, metal); g.vline(hx - 1, top - 11, top - 10, metal); g.vline(hx + 1, top - 11, top - 10, metal); }
          break;
        case 'sword': case 'dao': case 'saber': case 'twindao':
          g.vline(hx, top + 3, top + 10, metal); g.set(hx, top + 2, gold); if (w !== 'sword') g.vline(hx + 1, top + 5, top + 9, metalD);
          if (w === 'twindao') { g.vline(hx - 11, top + 3, top + 10, metal); g.set(hx - 11, top + 2, gold); }
          break;
        case 'axes': g.vline(hx, top + 2, top + 9, wood); g.rect(hx + 1, top + 2, 2, 3, metal); g.vline(hx - 11, top + 2, top + 9, wood); g.rect(hx - 13, top + 2, 2, 3, metal); break;
        case 'clubs': case 'whips': g.vline(hx, top + 1, top + 9, metalD); g.set(hx, top, metal); g.vline(hx - 11, top + 1, top + 9, metalD); break;
        case 'bow': g.line(hx - 1, top - 2, hx + 1, top + 3, wood); g.line(hx + 1, top + 3, hx - 1, top + 9, wood); g.vline(hx - 1, top - 2, top + 9, '#e8e0d0'); break;
        case 'fan': g.rect(hx - 1, top + 3, 3, 3, '#e8e0d0'); g.set(hx, top + 6, wood); break;
        case 'flute': g.vline(hx, top + 2, top + 8, '#4a4a52'); break;
        case 'stones': g.set(hx, top + 6, '#9a9a92'); g.set(hx + 1, top + 6, '#9a9a92'); break;
        case 'shield': g.rect(hx - 1, top + 1, 4, 6, '#8a5a2c'); g.set(hx, top + 3, gold); break;
        case 'chain': g.set(hx, top + 6, metalD); g.set(hx + 1, top + 7, metal); g.set(hx, top + 8, metalD); break;
        case 'pole': g.vline(hx, top - 8, top + 12, wood); break;
      }
    } else {
      if (behind) return;
      var fx = 5 + ox, fy = top + 5;
      switch (w) {
        case 'spear': case 'halberd': case 'staff': case 'lance': case 'hooklance': case 'trident': case 'fork': case 'guandao': case 'pole':
          g.line(fx + 6, fy + 6, fx - 2, fy - 14, wood);
          if (w === 'spear' || w === 'lance' || w === 'hooklance') { g.line(fx - 2, fy - 14, fx - 3, fy - 17, metal); g.set(fx - 1, fy - 12, '#c8302a'); }
          if (w === 'halberd') { g.line(fx - 2, fy - 14, fx - 3, fy - 17, metal); g.rect(fx - 4, fy - 14, 2, 2, metal); }
          if (w === 'guandao') { g.rect(fx - 4, fy - 19, 2, 6, metal); g.set(fx - 5, fy - 18, metal); }
          if (w === 'staff') { g.rect(fx - 3, fy - 16, 3, 2, metalD); }
          if (w === 'trident' || w === 'fork') { g.line(fx - 2, fy - 14, fx - 3, fy - 17, metal); g.set(fx - 4, fy - 16, metal); g.set(fx - 1, fy - 17, metal); }
          break;
        case 'sword': case 'dao': case 'saber': case 'twindao':
          g.line(fx, fy + 1, fx - 3, fy - 5, metal); g.set(fx + 1, fy + 2, gold); if (w !== 'sword') g.set(fx - 2, fy - 3, metalD);
          break;
        case 'axes': g.line(fx, fy + 2, fx - 2, fy - 4, wood); g.rect(fx - 4, fy - 5, 2, 3, metal); break;
        case 'clubs': case 'whips': g.line(fx, fy + 2, fx - 3, fy - 5, metalD); break;
        case 'bow': g.vline(fx - 1, fy - 6, fy + 6, wood); g.set(fx - 2, fy - 4, wood); g.set(fx - 2, fy + 4, wood); g.vline(fx, fy - 5, fy + 5, '#e8e0d0'); break;
        case 'fan': g.rect(fx - 2, fy - 2, 3, 3, '#e8e0d0'); break;
        case 'flute': g.line(fx, fy, fx - 3, fy - 3, '#4a4a52'); break;
        case 'shield': g.rect(fx - 2, fy - 3, 3, 7, '#8a5a2c'); g.set(fx - 1, fy, gold); break;
        case 'chain': g.set(fx - 1, fy + 1, metal); g.set(fx - 2, fy + 2, metalD); break;
      }
    }
  }

  function renderFrame(L, dir, frame) {
    var g = new Grid(W + 8, H + 8); // padded for weapons that stick out; cropped by offsets
    var ox = 4, oy = 6;
    var bob = frame === 0 ? 0 : 0;
    drawWeapon(g, L, dir, frame, ox, oy, true);
    drawBody(g, L, dir, frame, ox, oy);
    drawHead(g, L, dir, ox, oy + (L.build === 'small' ? 1 : 0) + bob);
    drawWeapon(g, L, dir, frame, ox, oy, false);
    g.outline(OUTLINE);
    return g;
  }

  // Sheet: frames are 24x32 cells (16x24 sprite + hats above + the feet's outline and shadow row below).
  // rows: down,left,right,up; cols: stand, step1, step2. FOOT is the row the feet stand on, for anchoring.
  SP.CW = 24; SP.CH = 32; SP.OX = 4; SP.OY = 6; SP.FOOT = 30;
  SP.build = function (id, lk) {
    var L = look(lk || {});
    var cv = U.makeCanvas(SP.CW * 3, SP.CH * 4);
    var dirs = ['down', 'left', 'right', 'up'];
    for (var r = 0; r < 4; r++) for (var f = 0; f < 3; f++) {
      var d = dirs[r] === 'right' ? 'left' : dirs[r];
      var g = renderFrame(L, d, f);
      g.toCanvas(cv, f * SP.CW, r * SP.CH, dirs[r] === 'right');
    }
    return cv;
  };

  SP.get = function (id, lk) {
    if (SP.overrides[id]) return SP.overrides[id];
    // a change of clothes the story has given someone (s.costume): their look with those parts changed
    var cos = WM.state && WM.state.costume && WM.state.costume[id];
    if (cos) {
      var key = id + '|' + JSON.stringify(cos);
      if (!SP.cache[key]) SP.cache[key] = SP.build(id, Object.assign({}, lk || (WM.data.chars[id] && WM.data.chars[id].look) || {}, cos));
      return SP.cache[key];
    }
    if (!SP.cache[id]) SP.cache[id] = SP.build(id, lk || (WM.data.chars[id] && WM.data.chars[id].look) || {});
    return SP.cache[id];
  };

  // Draw a sprite on the low-res context. x,y = feet position (bottom-centre of the tile).
  var DIR_ROW = { down: 0, left: 1, right: 2, up: 3 };
  var WALK = [0, 1, 0, 2];
  SP.draw = function (c, sheet, dir, animStep, x, y, opt) {
    var row = DIR_ROW[dir] || 0;
    var col = WALK[animStep & 3];
    var cw = SP.CW, ch = SP.CH;
    if (sheet.isOverride) { cw = sheet.cw; ch = sheet.ch; }
    var dx = Math.round(x - cw / 2), dy = Math.round(sheet.isOverride ? y - ch : y - SP.FOOT + 1);
    c.drawImage(sheet, col * cw, row * ch, cw, ch, dx, dy, cw, ch);
  };

  // Shadow ellipse under actors.
  SP.shadow = function (c, x, y, w) {
    c.fillStyle = 'rgba(0,0,0,0.28)';
    c.beginPath(); c.ellipse(Math.round(x), Math.round(y - 1), w || 5, 2, 0, 0, Math.PI * 2); c.fill();
  };

  // Load optional PNG override for a sprite sheet.
  SP.tryOverride = function (id) {
    var img = new Image();
    img.onload = function () {
      var cv = U.makeCanvas(img.width, img.height);
      cv.getContext('2d').drawImage(img, 0, 0);
      cv.isOverride = true; cv.cw = img.width / 3; cv.ch = img.height / 4;
      SP.overrides[id] = cv;
    };
    img.onerror = function () {};
    img.src = 'assets/sprites/' + id + '.png';
  };
})();
