// Rendering: a 320x240 pixel buffer scaled 3x, with crisp UI text drawn at full resolution on top.
'use strict';
(function () {
  var U = WM.util;
  var G = WM.gfx = {};

  G.FONT = '"Palatino Linotype","Book Antiqua",Palatino,"Noto Serif",Georgia,serif';
  G.COL = {
    ink: '#0d1220', win: '#141c33', winB: '#0a0f1e', gold: '#d8b36a', goldD: '#8a6a32',
    text: '#f2ead8', dim: '#9a937f', red: '#e0573f', green: '#7fd17a', blue: '#7fb0ef',
    hp: '#6fd06a', hpLow: '#e3b23c', hpCrit: '#e0573f', select: 'rgba(216,179,106,0.22)'
  };

  G.init = function (canvas) {
    G.canvas = canvas;
    canvas.width = WM.W; canvas.height = WM.H;
    G.ctx = canvas.getContext('2d');
    G.ctx.imageSmoothingEnabled = false;
    G.low = U.makeCanvas(WM.LOW_W, WM.LOW_H);
    G.lctx = G.low.getContext('2d');
    G.fade = 0;          // 0 = clear, 1 = black
    G.fadeColor = '#000';
    G.flash = 0;
    G.shake = 0;
    G.tint = null;       // e.g. 'rgba(255,120,40,0.2)' for burning scenes
  };

  // Blit the low-res buffer to screen (called by scenes that use the world view).
  G.present = function () {
    var c = G.ctx;
    var sx = 0, sy = 0;
    if (G.shake > 0) { sx = (Math.random() * 2 - 1) * G.shake * WM.SCALE; sy = (Math.random() * 2 - 1) * G.shake * WM.SCALE; }
    c.imageSmoothingEnabled = false;
    c.drawImage(G.low, 0, 0, WM.LOW_W, WM.LOW_H, Math.round(sx), Math.round(sy), WM.W, WM.H);
    if (G.tint) { c.fillStyle = G.tint; c.fillRect(0, 0, WM.W, WM.H); }
  };

  G.overlay = function () {
    var c = G.ctx;
    if (G.flash > 0) { c.fillStyle = 'rgba(255,255,255,' + Math.min(1, G.flash) + ')'; c.fillRect(0, 0, WM.W, WM.H); }
    if (G.fade > 0) { c.globalAlpha = Math.min(1, G.fade); c.fillStyle = G.fadeColor; c.fillRect(0, 0, WM.W, WM.H); c.globalAlpha = 1; }
  };

  // ---------- UI primitives (full resolution) ----------
  G.font = function (size, weight) {
    G.ctx.font = (weight || '') + ' ' + size + 'px ' + G.FONT;
  };

  G.text = function (str, x, y, opt) {
    opt = opt || {};
    var c = G.ctx;
    G.font(opt.size || 24, opt.bold ? 'bold' : '');
    c.textAlign = opt.align || 'left';
    c.textBaseline = opt.baseline || 'top';
    if (opt.shadow !== false) {
      c.fillStyle = 'rgba(0,0,0,0.75)';
      c.fillText(str, x + 2, y + 2);
    }
    c.fillStyle = opt.color || G.COL.text;
    c.fillText(str, x, y);
    return c.measureText(str).width;
  };

  G.measure = function (str, size, bold) {
    G.font(size || 24, bold ? 'bold' : '');
    return G.ctx.measureText(str).width;
  };

  // Word-wrap into lines that fit maxW. Respects explicit \n.
  G.wrap = function (str, maxW, size) {
    G.font(size || 24);
    var out = [];
    var paras = String(str).split('\n');
    for (var p = 0; p < paras.length; p++) {
      var words = paras[p].split(' ');
      var line = '';
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + ' ' + words[i] : words[i];
        if (G.ctx.measureText(test).width > maxW && line) { out.push(line); line = words[i]; }
        else line = test;
      }
      out.push(line);
    }
    return out;
  };

  // The window style: deep indigo lacquer, thin gold rule, cloud-corner ornaments.
  G.window = function (x, y, w, h, opt) {
    opt = opt || {};
    var c = G.ctx;
    var a = opt.alpha == null ? 0.92 : opt.alpha;
    c.save();
    c.globalAlpha = a;
    var gr = c.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, opt.top || '#1d2846');
    gr.addColorStop(1, opt.bottom || '#0b1022');
    c.fillStyle = gr;
    roundRect(c, x, y, w, h, 6); c.fill();
    c.globalAlpha = 1;
    c.lineWidth = 2;
    c.strokeStyle = G.COL.goldD;
    roundRect(c, x + 1, y + 1, w - 2, h - 2, 6); c.stroke();
    c.strokeStyle = 'rgba(216,179,106,0.55)';
    c.lineWidth = 1;
    roundRect(c, x + 5, y + 5, w - 10, h - 10, 4); c.stroke();
    // corner ornaments (small hooked "cloud" corners)
    c.strokeStyle = G.COL.gold; c.lineWidth = 2;
    var corners = [[x + 5, y + 5, 1, 1], [x + w - 5, y + 5, -1, 1], [x + 5, y + h - 5, 1, -1], [x + w - 5, y + h - 5, -1, -1]];
    for (var i = 0; i < 4; i++) {
      var k = corners[i];
      c.beginPath();
      c.moveTo(k[0], k[1] + 12 * k[3]);
      c.lineTo(k[0], k[1]);
      c.lineTo(k[0] + 12 * k[2], k[1]);
      c.moveTo(k[0] + 4 * k[2], k[1] + 4 * k[3]);
      c.lineTo(k[0] + 7 * k[2], k[1] + 4 * k[3]);
      c.lineTo(k[0] + 7 * k[2], k[1] + 7 * k[3]);
      c.stroke();
    }
    c.restore();
  };

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  G.roundRect = roundRect;

  // Pointing cursor (a small brush-tip arrow) with bob.
  G.cursor = function (x, y, t) {
    var c = G.ctx;
    var b = Math.sin((t || WM.time) * 8) * 3;
    x += b;
    c.save();
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.beginPath(); c.moveTo(x + 2, y + 2 - 9); c.lineTo(x + 16, y + 2); c.lineTo(x + 2, y + 2 + 9); c.lineTo(x + 6, y + 2); c.closePath(); c.fill();
    c.fillStyle = G.COL.gold;
    c.beginPath(); c.moveTo(x, y - 9); c.lineTo(x + 14, y); c.lineTo(x, y + 9); c.lineTo(x + 4, y); c.closePath(); c.fill();
    c.fillStyle = '#fff3c9';
    c.beginPath(); c.moveTo(x + 1, y - 6); c.lineTo(x + 10, y); c.lineTo(x + 4, y); c.closePath(); c.fill();
    c.restore();
  };

  G.bar = function (x, y, w, h, frac, col, back) {
    var c = G.ctx;
    frac = U.clamp(frac, 0, 1);
    c.fillStyle = back || 'rgba(0,0,0,0.6)';
    c.fillRect(x, y, w, h);
    c.fillStyle = col;
    c.fillRect(x + 1, y + 1, Math.round((w - 2) * frac), h - 2);
    c.fillStyle = 'rgba(255,255,255,0.25)';
    c.fillRect(x + 1, y + 1, Math.round((w - 2) * frac), Math.max(1, Math.floor((h - 2) / 3)));
  };

  G.hpColor = function (frac) { return frac > 0.5 ? G.COL.hp : frac > 0.2 ? G.COL.hpLow : G.COL.hpCrit; };

  // Draw an image (sprite/portrait canvas) scaled with nearest neighbour onto the UI layer.
  G.blit = function (img, x, y, scale, flip) {
    var c = G.ctx;
    scale = scale || WM.SCALE;
    c.imageSmoothingEnabled = false;
    if (flip) {
      c.save(); c.translate(x + img.width * scale, y); c.scale(-1, 1);
      c.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * scale, img.height * scale);
      c.restore();
    } else c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);
  };

  // Ink-wash style backdrop used by title & story cards.
  G.inkBackdrop = function (t, hue) {
    var c = G.ctx;
    var gr = c.createLinearGradient(0, 0, 0, WM.H);
    gr.addColorStop(0, hue === 'red' ? '#2a1010' : '#0e1424');
    gr.addColorStop(1, hue === 'red' ? '#0a0404' : '#04060c');
    c.fillStyle = gr; c.fillRect(0, 0, WM.W, WM.H);
  };
})();
