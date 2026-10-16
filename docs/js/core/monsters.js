// Procedural pixel art for beasts and spirits. Each returns a canvas (facing right).
'use strict';
(function () {
  var U = WM.util;
  var M = WM.monsters = { cache: {} };

  function G(w, h) { return new WM.sprites.Grid(w, h); }
  function ell(g, cx, cy, rx, ry, col) {
    for (var y = -ry; y <= ry; y++) { var w = Math.round(rx * Math.sqrt(Math.max(0, 1 - y * y / (ry * ry)))); for (var x = -w; x <= w; x++) g.set(cx + x, cy + y, col); }
  }
  function fin(g, outline) { g.outline(outline || '#1b130e'); var cv = U.makeWorldCanvas(g.w, g.h); g.toCanvas(cv, 0, 0); return cv; }

  var ART = {
    tiger: function (p) {
      p = p || {};
      var g = G(46, 28);
      var body = p.body || '#e09a3a', belly = '#f6e6c8', stripe = '#2a1a10', dark = U.shade(body, -0.25);
      // tail
      for (var i = 0; i < 9; i++) g.set(3 + i, 9 + Math.round(Math.sin(i * 0.6) * 2), i % 3 === 0 ? stripe : body), g.set(3 + i, 10 + Math.round(Math.sin(i * 0.6) * 2), dark);
      ell(g, 21, 14, 11, 6, body);               // torso
      ell(g, 21, 17, 9, 3, belly);
      // legs
      [[13, 0], [17, 1], [26, 0], [30, 1]].forEach(function (l) { g.rect(l[0], 18, 3, 8, l[1] ? dark : body); g.rect(l[0] - 1, 25, 5, 2, belly); });
      // head
      ell(g, 35, 10, 6, 6, body); ell(g, 39, 12, 3, 3, belly);
      g.rect(32, 3, 2, 3, body); g.rect(37, 3, 2, 3, body); g.set(32, 3, stripe); g.set(38, 3, stripe);
      g.set(37, 9, '#f0e040'); g.set(38, 9, '#1a1008'); g.set(41, 12, '#1a1008');
      g.hline(38, 42, 14, '#8a2020'); g.set(39, 15, '#ffffff'); g.set(41, 15, '#ffffff');
      // stripes
      for (i = 0; i < 6; i++) { g.vline(14 + i * 3, 9, 12 + (i % 2), stripe); g.set(15 + i * 3, 13, stripe); }
      g.vline(34, 5, 7, stripe); g.vline(36, 5, 6, stripe); g.set(31, 9, stripe); g.set(31, 11, stripe);
      return fin(g);
    },
    wolf: function (p) {
      p = p || {};
      var g = G(36, 22), b = p.body || '#7a7a80', d = U.shade(b, -0.3), l = U.shade(b, 0.3);
      for (var i = 0; i < 7; i++) g.set(2 + i, 8 + Math.floor(i / 2), b), g.set(2 + i, 9 + Math.floor(i / 2), d);
      ell(g, 16, 11, 8, 5, b); ell(g, 16, 13, 6, 2, l);
      [[10, 0], [13, 1], [20, 0], [23, 1]].forEach(function (q) { g.rect(q[0], 14, 2, 7, q[1] ? d : b); });
      ell(g, 27, 8, 4, 4, b); g.rect(29, 9, 5, 3, b); g.hline(30, 33, 12, d);
      g.set(25, 3, b); g.set(26, 2, b); g.set(28, 3, b); g.set(28, 2, b);
      g.set(28, 7, '#f0d040'); g.set(33, 9, '#1a1008'); g.set(31, 12, '#ffffff');
      return fin(g);
    },
    boar: function (p) {
      var g = G(36, 22), b = '#5a3e2a', d = '#3a2618', l = '#7a5a40';
      ell(g, 16, 11, 11, 7, b); ell(g, 14, 8, 8, 3, d);
      for (var i = 0; i < 9; i++) g.set(9 + i * 2, 4, d);
      [[9, 0], [13, 1], [20, 0], [24, 1]].forEach(function (q) { g.rect(q[0], 16, 3, 5, q[1] ? d : b); });
      ell(g, 28, 12, 5, 5, b); g.rect(31, 11, 4, 4, l); g.set(34, 12, '#1a1008');
      g.set(29, 9, '#e04020'); g.set(32, 15, '#f0f0e0'); g.set(33, 14, '#f0f0e0'); g.set(33, 13, '#f0f0e0');
      g.set(26, 7, b); g.set(27, 6, b);
      return fin(g);
    },
    snake: function (p) {
      p = p || {};
      var g = G(34, 20), b = p.body || '#4a8a3a', d = U.shade(b, -0.35), belly = '#d8d08a';
      for (var i = 0; i < 26; i++) { var y = 13 + Math.round(Math.sin(i * 0.45) * 3); g.rect(i + 2, y, 1, 4, b); g.set(i + 2, y + 3, belly); if (i % 4 === 0) g.set(i + 2, y, d); }
      ell(g, 30, 9, 3, 3, b); g.set(31, 8, '#f0d040'); g.vline(28, 10, 14, b);
      g.hline(33, 33, 10, '#c02020'); g.set(33, 11, '#c02020');
      return fin(g);
    },
    bear: function () {
      var g = G(36, 30), b = '#3a2a22', d = '#22180f', l = '#5a4232';
      ell(g, 16, 17, 12, 9, b); ell(g, 14, 14, 8, 4, l);
      g.rect(8, 23, 5, 6, d); g.rect(20, 23, 5, 6, b);
      ell(g, 27, 10, 6, 6, b); g.rect(31, 11, 4, 3, l); g.set(34, 11, '#100808');
      g.set(24, 4, b); g.set(25, 4, b); g.set(29, 4, b); g.set(30, 4, b); g.set(29, 8, '#e0c040');
      return fin(g);
    },
    eagle: function () {
      var g = G(34, 26), b = '#6a4a2a', d = '#3a2414', w = '#e8e0d0';
      ell(g, 17, 14, 6, 5, b);
      for (var i = 0; i < 14; i++) { g.vline(3 + i, 6 + Math.floor(i / 3), 11 + Math.floor(i / 4), i % 3 ? b : d); g.vline(20 + i, 4 + Math.floor((13 - i) / 4), 10 + Math.floor((13 - i) / 5), i % 3 ? b : d); }
      ell(g, 24, 9, 3, 3, w); g.set(25, 8, '#e0b020'); g.rect(27, 9, 2, 2, '#e0b020');
      g.rect(14, 19, 2, 4, '#e0b020'); g.rect(18, 19, 2, 4, '#e0b020');
      return fin(g);
    },
    monkey: function () {
      var g = G(26, 28), b = '#8a6a4a', f = '#e8b890';
      ell(g, 12, 16, 6, 6, b); ell(g, 13, 8, 5, 5, b); ell(g, 14, 9, 3, 3, f);
      g.set(13, 8, '#1a1008'); g.set(15, 8, '#1a1008');
      g.rect(7, 20, 3, 7, b); g.rect(14, 20, 3, 7, b); g.line(18, 14, 23, 10, b); g.line(6, 14, 2, 20, b);
      for (var i = 0; i < 6; i++) g.set(4 - (i > 3 ? 1 : 0), 20 + i, b);
      return fin(g);
    },
    bat: function () {
      var g = G(30, 16), b = '#3a2a3a', d = '#1a101a';
      ell(g, 15, 8, 3, 4, b);
      for (var i = 0; i < 11; i++) { g.vline(4 + i, 4 + Math.floor(i / 3), 8 + (i % 3), d); g.vline(16 + i, 4 + Math.floor((10 - i) / 3), 8 + (i % 3), d); }
      g.set(14, 7, '#e02020'); g.set(16, 7, '#e02020');
      return fin(g);
    },
    spirit: function (p) { // wandering flame / ghost-fire
      p = p || {};
      var g = G(20, 26), c1 = p.c1 || '#7ad0f0', c2 = p.c2 || '#d8f4ff', c3 = p.c3 || '#3a80c0';
      ell(g, 10, 17, 7, 7, c3); ell(g, 10, 15, 5, 6, c1); ell(g, 10, 14, 3, 4, c2);
      g.vline(10, 3, 9, c1); g.vline(8, 6, 10, c1); g.vline(12, 5, 10, c1); g.set(7, 15, '#103050'); g.set(12, 15, '#103050');
      return fin(g, '#0a1a2a');
    },
    demonqi: function () { // the black vapour of the released demon stars
      var g = G(40, 32);
      ell(g, 20, 18, 16, 11, '#1a1022'); ell(g, 14, 14, 9, 7, '#2a1a3a'); ell(g, 26, 12, 8, 7, '#2a1a3a'); ell(g, 20, 20, 9, 6, '#3a2450');
      g.set(15, 16, '#e04030'); g.set(16, 16, '#f08040'); g.set(25, 16, '#e04030'); g.set(24, 16, '#f08040');
      for (var i = 0; i < 6; i++) g.vline(8 + i * 5, 26, 29 + (i % 2), '#1a1022');
      return fin(g, '#000000');
    },
    crocodile: function () {
      var g = G(46, 16), b = '#4a6a3a', d = '#2a4a22', belly = '#b8b880';
      ell(g, 20, 9, 14, 4, b); g.rect(30, 8, 14, 3, b); g.hline(32, 44, 11, belly); g.hline(32, 44, 7, d);
      for (var i = 0; i < 6; i++) g.set(10 + i * 4, 5, d);
      g.rect(2, 9, 8, 2, b); g.set(1, 9, b); g.set(34, 7, '#e0d040');
      [[12, 0], [26, 0]].forEach(function (q) { g.rect(q[0], 12, 3, 3, d); });
      for (i = 0; i < 5; i++) g.set(35 + i * 2, 10, '#ffffff');
      return fin(g);
    },
    horse: function (p) { // armoured cavalry horse with rider space
      p = p || {};
      var g = G(40, 30), b = p.body || '#5a3a26', a = p.armor || null, d = U.shade(b, -0.3);
      ell(g, 18, 16, 11, 6, b);
      [[9, 0], [12, 1], [24, 0], [27, 1]].forEach(function (q) { g.rect(q[0], 20, 3, 9, q[1] ? d : b); g.rect(q[0], 28, 3, 1, '#1a1008'); });
      g.rect(28, 6, 5, 12, b); ell(g, 33, 6, 4, 3, b); g.rect(35, 6, 4, 3, b); g.set(33, 5, '#1a1008');
      for (var i = 0; i < 6; i++) g.set(4 + i, 12 + i, '#1a1410');
      g.vline(27, 4, 12, '#1a1410');
      if (a) { for (var x = 9; x < 30; x += 2) for (var y = 11; y < 21; y += 2) g.set(x, y, (x + y) % 4 ? a : U.shade(a, 0.3)); g.rect(29, 4, 5, 6, a); }
      return fin(g);
    },
    toad: function () {
      var g = G(30, 20), b = '#6a7a3a', d = '#3a4a1a', y = '#d8c860';
      ell(g, 15, 12, 11, 7, b); ell(g, 15, 15, 8, 3, y);
      ell(g, 10, 5, 3, 3, b); ell(g, 20, 5, 3, 3, b); g.set(10, 5, '#1a1008'); g.set(20, 5, '#1a1008');
      for (var i = 0; i < 5; i++) g.set(8 + i * 3, 10 + (i % 2), d);
      return fin(g);
    },
    oxboy: function () { // the Celestial Master in the guise of a herd-boy riding an ox, playing an iron flute
      var g = G(34, 34), b = '#3a2e26', d = '#241a14', l = '#5a4a3a';
      ell(g, 16, 23, 11, 6, b); ell(g, 14, 21, 8, 3, l);
      [[8, 0], [11, 1], [20, 0], [23, 1]].forEach(function (q) { g.rect(q[0], 27, 3, 6, q[1] ? d : b); });
      ell(g, 28, 20, 4, 4, b); g.rect(30, 21, 3, 3, l); g.set(29, 19, '#1a1008');
      g.line(26, 16, 24, 13, '#e8e0d0'); g.line(30, 16, 32, 13, '#e8e0d0');
      for (var i = 0; i < 5; i++) g.set(4 - (i > 2 ? 1 : 0), 21 + i, d);
      // boy, seated backwards
      g.rect(13, 9, 6, 8, '#3a6a3a'); g.rect(13, 16, 6, 2, '#2a4a2a');
      ell(g, 16, 6, 3, 3, '#f0c49a'); g.rect(14, 2, 4, 2, '#1a1410'); g.set(15, 1, '#1a1410'); g.set(17, 1, '#1a1410');
      g.set(15, 6, '#1a1008');
      g.line(12, 9, 8, 6, '#4a4a52'); g.set(12, 10, '#f0c49a');
      return fin(g);
    },
    golem: function () { // sorcerous yellow-scarf warrior (Gao Lian's divine troops) - armoured giant
      var g = G(28, 38), b = '#c8a83a', d = '#8a6a1a', s = '#5a3a22';
      ell(g, 14, 8, 5, 5, '#c89a7a'); g.rect(9, 3, 10, 3, '#d8b020');
      g.rect(7, 13, 14, 14, b); for (var y = 14; y < 27; y += 2) g.hline(8, 19, y, d);
      g.rect(3, 13, 4, 12, b); g.rect(21, 13, 4, 12, b); g.rect(9, 27, 4, 10, s); g.rect(15, 27, 4, 10, s);
      g.set(12, 8, '#1a1008'); g.set(16, 8, '#1a1008');
      g.vline(25, 2, 26, '#7a7a86'); g.rect(24, 1, 3, 3, '#c8ccd4');
      return fin(g);
    }
  };
  M.ART = ART;

  M.get = function (art, params) {
    var key = art + JSON.stringify(params || {});
    if (!M.cache[key]) {
      if (!ART[art]) throw new Error('No monster art ' + art);
      M.cache[key] = ART[art](params);
    }
    return M.cache[key];
  };
})();
