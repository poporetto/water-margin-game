// Outlaws of the Marsh — core namespace and utilities.
// Everything hangs off the global WM object so the game runs from file:// without a bundler.
'use strict';

var WM = window.WM = window.WM || {};

WM.VERSION = '0.9.0';
WM.LOW_W = 320;      // world render resolution (Suikoden II ran at 320x240)
WM.LOW_H = 240;
WM.SCALE = 3;        // UI canvas is LOW * SCALE
WM.W = WM.LOW_W * WM.SCALE;
WM.H = WM.LOW_H * WM.SCALE;
WM.TILE = 16;
WM.scenes = {};

WM.util = {
  clamp: function (v, a, b) { return v < a ? a : v > b ? b : v; },
  lerp: function (a, b, t) { return a + (b - a) * t; },
  rand: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
  chance: function (p) { return Math.random() < p; },
  pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  shuffle: function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  },
  // Deterministic PRNG so procedural art is identical every load.
  rng: function (seed) {
    var s = 0;
    var str = String(seed);
    for (var i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) | 0;
    s = s ^ 0x9e3779b9;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  hash2: function (x, y, seed) {
    var h = (x * 374761393 + y * 668265263 + (seed || 0) * 1442695040) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  },
  makeCanvas: function (w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    return c;
  },
  // Colour helpers: '#rrggbb' -> shaded '#rrggbb'
  shade: function (hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt < 0) { r = r * (1 + amt); g = g * (1 + amt); b = b * (1 + amt); }
    else { r = r + (255 - r) * amt; g = g + (255 - g) * amt; b = b + (255 - b) * amt; }
    return '#' + ((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).slice(1);
  },
  mix: function (a, b, t) {
    var na = parseInt(a.slice(1), 16), nb = parseInt(b.slice(1), 16);
    var r = ((na >> 16) & 255) * (1 - t) + ((nb >> 16) & 255) * t;
    var g = ((na >> 8) & 255) * (1 - t) + ((nb >> 8) & 255) * t;
    var bl = (na & 255) * (1 - t) + (nb & 255) * t;
    return '#' + ((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl)).toString(16).slice(1);
  },
  fmtTime: function (sec) {
    sec = Math.floor(sec);
    var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
    return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  },
  deepCopy: function (o) { return JSON.parse(JSON.stringify(o)); }
};

// Registries filled by data files.
WM.data = WM.data || {
  chars: {},      // the 108 + guests
  charOrder: [],  // canonical star order
  items: {},
  talismans: {},
  enemies: {},
  troops: {},
  maps: {},
  events: {},     // per map id -> array of events
  chapters: [],
  unites: [],
  duels: {},
  wars: {},
  shops: {}
};

WM.defMap = function (id, def) { def.id = id; if (def.interior && Array.isArray(def.rows)) def.rows = WM.growBeds(def.rows); WM.data.maps[id] = def; return def; };
// A bed drawn as a single tile is too small for a person: grow each lone 'k' into a bed two tiles wide and two deep
// (rightwards or leftwards, and down) where the floor is clear and it does not stand in front of a door.
WM.growBeds = function (rows) {
  var g = rows.map(function (r) { return r.split(''); });
  var at = function (x, y) { return (g[y] || [])[x]; };
  var floor = function (x, y) { var c = at(x, y); return c === 'n' || c === 'N' || c === 'K'; };
  for (var y = 0; y < g.length; y++) for (var x = 0; x < g[y].length; x++) {
    if (at(x, y) !== 'k' || at(x - 1, y) === 'k' || at(x + 1, y) === 'k' || at(x, y - 1) === 'k' || at(x, y + 1) === 'k') continue;
    for (var o = 0; o > -2; o--) {
      var ox = x + o, ok = true;
      for (var dx = 0; dx < 2 && ok; dx++) for (var dy = 0; dy < 2 && ok; dy++) {
        var cx = ox + dx, cy = y + dy;
        if (!(cx === x && cy === y) && !floor(cx, cy)) ok = false;
        if (at(cx, y + 2) === 'D' || at(cx, y + 2) === 'k' || at(cx, y - 1) === 'k') ok = false;
      }
      [y, y + 1].forEach(function (yy) { if (at(ox - 1, yy) === 'k' || at(ox + 2, yy) === 'k') ok = false; });   // never fused with the next bed
      if (ok) { g[y][ox] = g[y][ox + 1] = g[y + 1][ox] = g[y + 1][ox + 1] = 'k'; break; }
    }
  }
  return g.map(function (r) { return r.join(''); });
};
WM.defEvents = function (mapId, list) {
  var arr = WM.data.events[mapId] = WM.data.events[mapId] || [];
  for (var i = 0; i < list.length; i++) { list[i].map = mapId; arr.push(list[i]); }
};
