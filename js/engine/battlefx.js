// Battle effects for skills: a library of drawn styles (weapon blows, thrown weapons, the elements, support magic and a
// few signature pieces), and the rule that picks a style for every hero skill, unite attack, enemy skill and item.
// battle.js pushes effects as { kind, x, y, t, dur, opt } and calls WM.bfx.draw for any kind found here.
//   opt.from: [x, y] where a thrown weapon starts; opt.dir: -1 when the blow travels left (the party strikes west), 1 right;
//   opt.seed: fixes the random shape of an effect for its whole life (no flicker); opt.col: a tint for auras and rings.
'use strict';
(function () {
  var U = WM.util;
  var X = WM.bfx = {};

  // ---------- helpers ----------
  function R(f, i, j) { return U.hash2((f.opt.seed || 1) + i * 17, j || 0, 5); }   // a fixed random number for this effect
  function rgba(rgb, a) { return 'rgba(' + rgb + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }
  function ease(k) { return 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3); }
  function seg(k, a, b) { return Math.min(1, Math.max(0, (k - a) / (b - a))); }   // progress of k through [a, b]
  function fade(k, from) { return k < from ? 1 : 1 - (k - from) / (1 - from); }
  function glow(c, on) { c.globalCompositeOperation = on ? 'lighter' : 'source-over'; }
  function dirOf(f) { return f.opt.dir || (f.opt.flip ? 1 : -1); }
  function star(c, x, y, r, n, col) {   // a spiky impact star
    c.fillStyle = col; c.beginPath();
    for (var i = 0; i < n * 2; i++) { var a = i / (n * 2) * Math.PI * 2, rr = i % 2 ? r * 0.38 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    c.closePath(); c.fill();
  }
  function sparks(c, f, k, n, rgb, spread, size) {   // bits flying out from the point of impact
    for (var i = 0; i < n; i++) {
      var a = R(f, i) * Math.PI * 2, sp = (0.5 + R(f, i, 1)) * spread, e = ease(k);
      c.fillStyle = rgba(rgb, 1 - k);
      var s = size || 5;
      c.fillRect(f.x + Math.cos(a) * sp * e - s / 2, f.y + Math.sin(a) * sp * e + k * k * 40 - s / 2, s, s);
    }
  }
  function ring(c, x, y, r, w, rgb, a) { c.strokeStyle = rgba(rgb, a); c.lineWidth = w; c.beginPath(); c.arc(x, y, Math.max(1, r), 0, Math.PI * 2); c.stroke(); }
  function arcStroke(c, x, y, r, a0, a1, w, rgb, a) { c.strokeStyle = rgba(rgb, a); c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, r, a0, a1); c.stroke(); }
  // a weapon's flight from opt.from to the target: position at progress p (0..1), with an arc of height h
  function flight(f, p, h) { var o = f.opt.from || [f.x - dirOf(f) * 260, f.y]; return [o[0] + (f.x - o[0]) * p, o[1] + (f.y - o[1]) * p - Math.sin(p * Math.PI) * (h || 0)]; }

  // ---------- the styles ----------
  // each: { dur: seconds, travel: true if it flies from the attacker (damage lands as it arrives), draw(c, f, k) }
  var S = X.STYLES = {};

  // --- blades ---
  S.slash = { dur: 0.45, draw: function (c, f, k) {   // a bright crescent cut across the target
    var d = dirOf(f), p = ease(seg(k, 0, 0.45)), a = fade(k, 0.45);
    // drawn as a swing from left to right; mirrored when the blow travels left (the party striking west)
    if (d < 0) { c.translate(f.x, 0); c.scale(-1, 1); c.translate(-f.x, 0); }
    glow(c, true);
    for (var t = 0; t < 3; t++) arcStroke(c, f.x + 10, f.y - 6, 52 - t * 6, -Math.PI * 0.85, -Math.PI * 0.85 + p * Math.PI * 1.1, 10 - t * 3, t ? '255,230,160' : '255,255,255', a * (0.9 - t * 0.25));
    sparks(c, f, k, 8, '255,240,190', 50, 4);
    glow(c, false);
  } };
  S.blade = { dur: 0.6, draw: function (c, f, k) {   // a great sabre or crescent blade: a wide arc with an afterimage
    var d = dirOf(f), p = ease(seg(k, 0, 0.4)), a = fade(k, 0.4);
    glow(c, true);
    for (var t = 0; t < 4; t++) {
      var a0 = d < 0 ? -Math.PI * 0.2 : Math.PI * 1.2, sweep = (d < 0 ? 1 : -1) * Math.PI * 1.3 * p;
      arcStroke(c, f.x - d * 6, f.y - 20, 74 - t * 8, Math.min(a0, a0 + sweep) , Math.max(a0, a0 + sweep), 14 - t * 3, t < 2 ? '255,255,235' : '140,220,255', a * (1 - t * 0.2));
    }
    ring(c, f.x, f.y, 20 + ease(seg(k, 0.3, 1)) * 70, 3, '200,240,255', fade(k, 0.3) * 0.6);
    sparks(c, f, k, 12, '220,245,255', 70, 5);
    glow(c, false);
  } };
  S.cross = { dur: 0.55, draw: function (c, f, k) {   // two blades at once: an X
    var a = fade(k, 0.5);
    glow(c, true);
    [[-1, 0], [1, 0.12]].forEach(function (s) {
      var p = ease(seg(k, s[1], s[1] + 0.3)), L = 110;
      c.strokeStyle = rgba('255,255,255', a); c.lineWidth = 8; c.lineCap = 'round'; c.beginPath();
      var x0 = f.x - s[0] * L / 2, y0 = f.y - L / 2;
      c.moveTo(x0, y0); c.lineTo(x0 + s[0] * L * p, y0 + L * p); c.stroke();
      c.strokeStyle = rgba('255,200,120', a * 0.7); c.lineWidth = 16; c.stroke();
    });
    star(c, f.x, f.y, 26 * fade(k, 0.3) * ease(seg(k, 0.25, 0.4)), 4, rgba('255,250,220', a));
    sparks(c, f, k, 10, '255,220,150', 60, 4);
    glow(c, false);
  } };
  S.stab = { dur: 0.5, draw: function (c, f, k) {   // a dagger or knife: quick little cuts, one after another
    glow(c, true);
    for (var i = 0; i < 4; i++) {
      var p = seg(k, i * 0.12, i * 0.12 + 0.18), a = p > 0 ? fade(seg(k, i * 0.12, 1), 0.2) : 0;
      if (!p) continue;
      var x = f.x + (R(f, i) - 0.5) * 50, y = f.y + (R(f, i, 1) - 0.5) * 60, ang = R(f, i, 2) * Math.PI;
      c.strokeStyle = rgba('255,255,255', a); c.lineWidth = 5; c.lineCap = 'round'; c.beginPath();
      c.moveTo(x - Math.cos(ang) * 34 * p, y - Math.sin(ang) * 34 * p); c.lineTo(x + Math.cos(ang) * 34 * p, y + Math.sin(ang) * 34 * p); c.stroke();
      c.strokeStyle = rgba('255,170,150', a * 0.5); c.lineWidth = 11; c.stroke();
    }
    sparks(c, f, k, 6, '255,200,200', 40, 3);
    glow(c, false);
  } };
  S.sweep = { dur: 0.6, draw: function (c, f, k) {   // a blade swung flat along the whole enemy line
    var d = dirOf(f), p = ease(seg(k, 0, 0.45)), a = fade(k, 0.45);
    glow(c, true);
    for (var t = 0; t < 3; t++) {
      c.strokeStyle = rgba(t ? '255,220,150' : '255,255,255', a * (1 - t * 0.3)); c.lineWidth = 12 - t * 4; c.lineCap = 'round';
      c.beginPath(); c.ellipse(f.x, f.y + 6, 80, 22 - t * 4, 0, d < 0 ? 0 : Math.PI, (d < 0 ? 0 : Math.PI) + (d < 0 ? 1 : -1) * Math.PI * 1.6 * p, d > 0); c.stroke();
    }
    sparks(c, f, k, 10, '255,230,170', 70, 4);
    glow(c, false);
  } };
  // --- spears, forks and lances ---
  S.thrust = { dur: 0.5, draw: function (c, f, k) {   // a spear-thrust: a streak driving in, a shock ring where it lands
    var d = dirOf(f), p = ease(seg(k, 0, 0.3)), a = fade(k, 0.35);
    var x1 = f.x - d * 30, x0 = x1 - d * 150;
    glow(c, true);
    c.strokeStyle = rgba('255,255,240', a); c.lineWidth = 6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0 + (x1 - x0) * Math.max(0, p - 0.5), f.y); c.lineTo(x0 + (x1 - x0) * p + d * 40, f.y); c.stroke();
    c.fillStyle = rgba('255,255,255', a); c.beginPath(); var tx = x0 + (x1 - x0) * p + d * 40; c.moveTo(tx + d * 18, f.y); c.lineTo(tx, f.y - 8); c.lineTo(tx, f.y + 8); c.fill();
    for (var i = 0; i < 5; i++) { c.fillStyle = rgba('200,230,255', a * 0.6); c.fillRect(x0 + (x1 - x0) * p - d * (20 + i * 22), f.y - 16 + R(f, i) * 32, d * -30, 2); }
    var q = seg(k, 0.25, 1);
    if (q > 0) { ring(c, f.x, f.y, 10 + ease(q) * 60, 5 * (1 - q), '255,240,200', 1 - q); star(c, f.x, f.y, 30 * (1 - q), 6, rgba('255,250,230', 1 - q)); }
    glow(c, false);
  } };
  S.hook = { dur: 0.55, draw: function (c, f, k) {   // a hooked lance or fork catches and drags
    var d = dirOf(f), p = ease(seg(k, 0, 0.4)), a = fade(k, 0.5);
    glow(c, true);
    arcStroke(c, f.x + d * 20, f.y + 10, 46, d < 0 ? Math.PI * 0.6 : -Math.PI * 0.4, (d < 0 ? Math.PI * 0.6 : -Math.PI * 0.4) + (d < 0 ? 1 : -1) * Math.PI * 1.4 * p, 7, '255,255,255', a);
    arcStroke(c, f.x + d * 20, f.y + 10, 46, d < 0 ? Math.PI * 0.6 : -Math.PI * 0.4, (d < 0 ? Math.PI * 0.6 : -Math.PI * 0.4) + (d < 0 ? 1 : -1) * Math.PI * 1.4 * p, 14, '150,220,255', a * 0.5);
    var q = seg(k, 0.35, 1);
    for (var i = 0; i < 4; i++) { c.fillStyle = rgba('220,220,200', 1 - q); c.fillRect(f.x - d * q * 40 + i * 6, f.y + 40 + R(f, i) * 6, 8, 3); }
    glow(c, false);
  } };
  // --- axes and clubs ---
  S.chop = { dur: 0.6, draw: function (c, f, k) {   // an axe brought straight down: a heavy arc, a crack, flying chips
    var p = ease(seg(k, 0, 0.3)), a = fade(k, 0.4);
    glow(c, true);
    var dy0 = f.y - 130, dy1 = f.y - 130 + 170 * p;
    c.strokeStyle = rgba('255,255,255', a); c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(f.x, Math.max(dy0, dy1 - 90)); c.lineTo(f.x, dy1); c.stroke();
    c.strokeStyle = rgba('255,140,90', a * 0.5); c.lineWidth = 22; c.stroke();
    arcStroke(c, f.x, f.y + 40, 90, -Math.PI / 2 - 0.6, -Math.PI / 2 - 0.6 + 1.2 * p, 12, '255,255,255', a);
    arcStroke(c, f.x, f.y + 40, 90, -Math.PI / 2 - 0.6, -Math.PI / 2 - 0.6 + 1.2 * p, 22, '255,120,80', a * 0.45);
    glow(c, false);
    var q = seg(k, 0.25, 1);
    if (q > 0) {
      c.strokeStyle = rgba('40,20,10', (1 - q) * 0.8); c.lineWidth = 3; c.beginPath(); c.moveTo(f.x, f.y + 40);
      for (var i = 0; i < 5; i++) c.lineTo(f.x + (R(f, i) - 0.5) * 30 + (i % 2 ? 6 : -6), f.y + 40 + i * 4 - 2);
      c.stroke();
      for (i = 0; i < 9; i++) { var ang = -Math.PI * (0.15 + R(f, i, 3) * 0.7), sp = 40 + R(f, i, 4) * 70; c.fillStyle = rgba(i % 2 ? '150,110,70' : '200,180,140', 1 - q); c.fillRect(f.x + Math.cos(ang) * sp * q, f.y + 40 + Math.sin(ang) * sp * q + q * q * 60, 7, 7); }
      ring(c, f.x, f.y + 40, ease(q) * 70, 4, '255,220,180', (1 - q) * 0.8);
    }
  } };
  S.smash = { dur: 0.6, draw: function (c, f, k) {   // a staff, mace or hammer: a shockwave and dust
    var q = ease(k), a = fade(k, 0.2);
    glow(c, true);
    star(c, f.x, f.y, 44 * (1 - k * 0.7), 8, rgba('255,245,200', a));
    ring(c, f.x, f.y, 14 + q * 80, 8 * (1 - k), '255,230,160', a);
    ring(c, f.x, f.y, q * 50, 4, '255,255,255', a * 0.8);
    glow(c, false);
    for (var i = 0; i < 10; i++) { var ang = R(f, i) * Math.PI * 2, sp = 30 + R(f, i, 1) * 50; c.fillStyle = rgba('190,170,130', (1 - k) * 0.7); c.beginPath(); c.arc(f.x + Math.cos(ang) * sp * q, f.y + 40 + Math.sin(ang) * sp * q * 0.3, 6 + 8 * q, 0, Math.PI * 2); c.fill(); }
  } };
  S.fist = { dur: 0.45, draw: function (c, f, k) {   // a punch, a kick or a throw: an impact star and speed lines
    var d = dirOf(f), a = fade(k, 0.3), p = ease(k);
    glow(c, true);
    star(c, f.x, f.y, 40 * (1 - k * 0.5), 6, rgba('255,240,170', a));
    star(c, f.x, f.y, 20 * (1 - k * 0.5), 6, rgba('255,255,255', a));
    for (var i = 0; i < 8; i++) { var ang = (i / 8) * Math.PI * 2 + 0.2, r0 = 30 + p * 30, r1 = r0 + 26; c.strokeStyle = rgba('255,255,230', a); c.lineWidth = 3; c.beginPath(); c.moveTo(f.x + Math.cos(ang) * r0, f.y + Math.sin(ang) * r0); c.lineTo(f.x + Math.cos(ang) * r1, f.y + Math.sin(ang) * r1); c.stroke(); }
    for (i = 0; i < 4; i++) { c.fillStyle = rgba('255,255,255', a * 0.6); c.fillRect(f.x - d * (60 + i * 20) - (d > 0 ? 40 : 0), f.y - 20 + i * 12, 40, 2); }
    glow(c, false);
  } };
  S.whip = { dur: 0.55, draw: function (c, f, k) {   // a whip, a chain or a lasso: a wave running out to the target
    var o = f.opt.from || [f.x - dirOf(f) * 220, f.y], p = ease(seg(k, 0, 0.45)), a = fade(k, 0.45);
    glow(c, true);
    c.strokeStyle = rgba('255,240,200', a); c.lineWidth = 5; c.lineCap = 'round'; c.beginPath();
    for (var i = 0; i <= 24; i++) { var t = i / 24 * p, x = o[0] + (f.x - o[0]) * t, y = o[1] + (f.y - o[1]) * t + Math.sin(t * 14 - k * 20) * 16 * (1 - t * 0.5); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
    c.stroke();
    var q = seg(k, 0.4, 1);
    if (q > 0) { star(c, f.x, f.y, 30 * (1 - q), 5, rgba('255,250,220', 1 - q)); ring(c, f.x, f.y, 10 + q * 40, 3, '255,230,170', 1 - q); }
    glow(c, false);
  } };
  S.claw = { dur: 0.5, draw: function (c, f, k) {   // claws, or a tiger's strength in a blow: three red rakes
    var p = ease(seg(k, 0, 0.35)), a = fade(k, 0.4), d = dirOf(f);
    glow(c, true);
    for (var i = 0; i < 3; i++) {
      var off = (i - 1) * 18;
      c.strokeStyle = rgba('255,120,100', a); c.lineWidth = 7; c.lineCap = 'round'; c.beginPath();
      c.moveTo(f.x - d * 40 + off, f.y - 44); c.lineTo(f.x - d * 40 + off + d * 80 * p, f.y - 44 + 88 * p); c.stroke();
      c.strokeStyle = rgba('255,240,220', a); c.lineWidth = 2; c.stroke();
    }
    glow(c, false);
  } };
  S.rush = { dur: 0.5, draw: function (c, f, k) {   // a charge, a leap, a dash: lines of speed and a hard impact
    var d = dirOf(f), a = fade(k, 0.35);
    glow(c, true);
    for (var i = 0; i < 9; i++) { var y = f.y - 50 + R(f, i) * 100, len = 60 + R(f, i, 1) * 90, x = f.x - d * (40 + (1 - k) * 180) - (d > 0 ? len : 0); c.fillStyle = rgba('255,255,255', a * 0.7); c.fillRect(x, y, len, 3); }
    var q = seg(k, 0.2, 1);
    if (q > 0) { star(c, f.x, f.y, 46 * (1 - q * 0.6), 7, rgba('255,220,140', 1 - q)); ring(c, f.x, f.y, 16 + ease(q) * 70, 6 * (1 - q), '255,240,200', 1 - q); }
    glow(c, false);
  } };
  S.roar = { dur: 0.7, draw: function (c, f, k) {   // a roar, a war-cry: rings of sound from the one who shouts
    var o = f.opt.from || [f.x, f.y];
    for (var i = 0; i < 4; i++) { var q = seg(k, i * 0.12, i * 0.12 + 0.6); if (!q || q >= 1) continue; arcStroke(c, o[0], o[1], 20 + q * 220, -0.6 + (dirOf(f) < 0 ? Math.PI : 0), 0.6 + (dirOf(f) < 0 ? Math.PI : 0), 6, '255,230,180', (1 - q) * 0.8); }
    if (f.opt.from) return;
    star(c, f.x, f.y, 30 * fade(k, 0.3), 6, rgba('255,200,140', fade(k, 0.3)));
  } };
  // --- thrown and shot ---
  S.arrow = { dur: 0.55, travel: 0.45, draw: function (c, f, k) {   // an arrow or bolt with a streak behind it
    var p = seg(k, 0, 0.45);
    if (p < 1) {
      var pt = flight(f, p, 24), pv = flight(f, Math.max(0, p - 0.08), 24), ang = Math.atan2(pt[1] - pv[1], pt[0] - pv[0]);
      glow(c, true); c.strokeStyle = rgba('255,240,200', 0.5); c.lineWidth = 2; c.beginPath(); c.moveTo(flight(f, Math.max(0, p - 0.3), 24)[0], flight(f, Math.max(0, p - 0.3), 24)[1]); c.lineTo(pt[0], pt[1]); c.stroke(); glow(c, false);
      c.save(); c.translate(pt[0], pt[1]); c.rotate(ang);
      c.strokeStyle = '#e8e0d0'; c.lineWidth = 3; c.beginPath(); c.moveTo(-28, 0); c.lineTo(0, 0); c.stroke();
      c.fillStyle = '#f0f0f0'; c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.fill();
      c.fillStyle = '#c8402a'; c.fillRect(-30, -4, 6, 8);
      c.restore();
    } else { var q = seg(k, 0.45, 1); glow(c, true); star(c, f.x, f.y, 26 * (1 - q), 4, rgba('255,250,220', 1 - q)); sparks(c, f, q, 6, '255,230,180', 40, 4); glow(c, false); }
  } };
  S.volley = { dur: 0.75, draw: function (c, f, k) {   // a rain of arrows falling on the target from above
    for (var i = 0; i < 9; i++) {
      var t0 = R(f, i) * 0.35, p = seg(k, t0, t0 + 0.3);
      if (p <= 0) continue;
      var x = f.x + (R(f, i, 1) - 0.5) * 90, y = f.y - 260 + p * 300 - 20 + R(f, i, 2) * 40;
      if (p < 1) { c.strokeStyle = '#e8e0d0'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 6, y - 30); c.lineTo(x, y); c.stroke(); c.fillStyle = '#c8402a'; c.fillRect(x - 9, y - 34, 6, 6); }
      else { var q = seg(k, t0 + 0.3, t0 + 0.6); c.fillStyle = rgba('255,240,200', 1 - q); c.fillRect(x - 6, y - 2, 12, 3); }
    }
  } };
  S.stone = { dur: 0.6, travel: 0.4, draw: function (c, f, k) {   // a stone flung hard: it spins, it cracks against the target
    var p = seg(k, 0, 0.4);
    if (p < 1) {
      var pt = flight(f, p, 50);
      glow(c, true); for (var i = 1; i < 5; i++) { var tr = flight(f, Math.max(0, p - i * 0.05), 50); c.fillStyle = rgba('220,220,200', 0.4 - i * 0.08); c.fillRect(tr[0] - 4, tr[1] - 4, 8, 8); } glow(c, false);
      c.save(); c.translate(pt[0], pt[1]); c.rotate(k * 30);
      c.fillStyle = '#9a9a8e'; c.fillRect(-7, -7, 14, 14); c.fillStyle = '#c8c8bc'; c.fillRect(-7, -7, 7, 7);
      c.restore();
    } else { var q = seg(k, 0.4, 1); glow(c, true); star(c, f.x, f.y, 34 * (1 - q), 6, rgba('255,255,220', 1 - q)); glow(c, false); sparks(c, f, q, 10, '170,165,150', 55, 6); }
  } };
  S.knife = { dur: 0.6, travel: 0.4, draw: function (c, f, k) {   // flying knives, spinning, several at once
    var p = seg(k, 0, 0.4);
    if (p < 1) {
      for (var i = 0; i < 3; i++) {
        var pt = flight(f, Math.max(0, p - i * 0.08), 30 + i * 12);
        c.save(); c.translate(pt[0], pt[1] + (i - 1) * 14); c.rotate(k * 40 + i);
        c.fillStyle = '#e8eef4'; c.beginPath(); c.moveTo(0, -14); c.lineTo(4, 6); c.lineTo(-4, 6); c.fill(); c.fillStyle = '#6a4a2a'; c.fillRect(-2, 6, 4, 7);
        c.restore();
      }
    } else { var q = seg(k, 0.4, 1); glow(c, true); for (var j = 0; j < 3; j++) star(c, f.x + (j - 1) * 18, f.y + (j - 1) * 14, 18 * (1 - q), 4, rgba('255,255,240', 1 - q)); glow(c, false); }
  } };
  S.javelin = { dur: 0.6, travel: 0.42, draw: function (c, f, k) {   // a javelin or flying fork, thrown in a long arc
    var p = seg(k, 0, 0.42);
    if (p < 1) {
      var pt = flight(f, p, 70), pv = flight(f, Math.max(0, p - 0.05), 70), ang = Math.atan2(pt[1] - pv[1], pt[0] - pv[0]);
      c.save(); c.translate(pt[0], pt[1]); c.rotate(ang);
      c.strokeStyle = '#8a6a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-50, 0); c.lineTo(0, 0); c.stroke();
      c.fillStyle = '#e0e8f0'; c.beginPath(); c.moveTo(14, 0); c.lineTo(0, -6); c.lineTo(0, 6); c.fill();
      c.restore();
    } else { var q = seg(k, 0.42, 1); glow(c, true); ring(c, f.x, f.y, 10 + ease(q) * 50, 5, '255,240,200', 1 - q); star(c, f.x, f.y, 30 * (1 - q), 5, rgba('255,250,230', 1 - q)); glow(c, false); }
  } };
  S.bomb = { dur: 0.9, travel: 0.45, draw: function (c, f, k) {   // a fire-bomb, a cannon-ball, a fire-cart: an arcing ball and an explosion
    var p = seg(k, 0, 0.45);
    if (p < 1) {
      var pt = flight(f, p, 140);
      c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(pt[0], pt[1], 9, 0, Math.PI * 2); c.fill();
      glow(c, true); c.fillStyle = rgba('255,180,60', 0.9); c.fillRect(pt[0] - 2, pt[1] - 14, 4, 6); glow(c, false);
    } else {
      var q = seg(k, 0.45, 1);
      glow(c, true);
      c.fillStyle = rgba('255,240,180', (1 - q) * 0.9); c.beginPath(); c.arc(f.x, f.y, 20 + ease(q) * 70, 0, Math.PI * 2); c.fill();
      c.fillStyle = rgba('255,120,40', (1 - q) * 0.8); c.beginPath(); c.arc(f.x, f.y, 10 + ease(q) * 55, 0, Math.PI * 2); c.fill();
      ring(c, f.x, f.y, 20 + ease(q) * 120, 6, '255,200,120', 1 - q);
      glow(c, false);
      for (var i = 0; i < 12; i++) { var ang = R(f, i) * Math.PI * 2, sp = 50 + R(f, i, 1) * 80; c.fillStyle = rgba(i % 3 ? '80,70,60' : '255,150,60', 1 - q); c.fillRect(f.x + Math.cos(ang) * sp * ease(q), f.y + Math.sin(ang) * sp * ease(q), 6, 6); }
    }
  } };
  // --- the elements ---
  S.fire = { dur: 0.8, draw: function (c, f, k) {   // a column of flame with embers rising
    glow(c, true);
    for (var i = 0; i < 18; i++) {
      var ph = (k * 1.6 + R(f, i)) % 1, x = f.x + (R(f, i, 1) - 0.5) * 80 * (1 - ph * 0.5), y = f.y + 50 - ph * 140, s = (1 - ph) * 28 * fade(k, 0.6);
      c.fillStyle = rgba(ph < 0.25 ? '255,220,110' : ph < 0.6 ? '255,120,30' : '220,50,20', fade(k, 0.6) * 0.85);
      c.beginPath(); c.arc(x, y, Math.max(1, s), 0, Math.PI * 2); c.fill();
    }
    ring(c, f.x, f.y + 50, 30 + ease(k) * 40, 4, '255,160,60', fade(k, 0.5) * 0.6);
    glow(c, false);
  } };
  S.thunder = { dur: 0.7, draw: function (c, f, k) {   // bolts out of the sky, the same jagged shape for their whole life
    var a = fade(k, 0.3), flick = k < 0.5 ? (Math.floor(k * 30) % 2 ? 1 : 0.6) : 1;
    glow(c, true);
    for (var b = 0; b < 2; b++) {
      c.strokeStyle = rgba(b ? '160,200,255' : '255,255,210', a * flick); c.lineWidth = b ? 12 : 5; c.lineJoin = 'miter';
      c.beginPath(); var lx = f.x + (R(f, 0) - 0.5) * 20, ly = f.y - 340; c.moveTo(lx, ly);
      for (var i = 0; i < 9; i++) { lx = f.x + (R(f, i + 1) - 0.5) * 60; ly += 40; c.lineTo(lx, ly); }
      c.stroke();
    }
    for (i = 0; i < 2; i++) { c.strokeStyle = rgba('200,220,255', a * 0.6); c.lineWidth = 2; c.beginPath(); var bx = f.x + (R(f, i, 7) - 0.5) * 40, by = f.y - 100; c.moveTo(bx, by); c.lineTo(bx + (R(f, i, 8) - 0.5) * 80, by + 40); c.lineTo(bx + (R(f, i, 9) - 0.5) * 60, by + 80); c.stroke(); }
    c.fillStyle = rgba('255,255,220', a * 0.6); c.beginPath(); c.ellipse(f.x, f.y + 50, 60 * (0.5 + k), 14, 0, 0, Math.PI * 2); c.fill();
    glow(c, false);
  } };
  S.water = { dur: 0.8, draw: function (c, f, k) {   // a wave breaking over the target, spray flying
    var q = ease(seg(k, 0, 0.5)), a = fade(k, 0.5);
    glow(c, true);
    c.fillStyle = rgba('120,190,255', a * 0.5);
    c.beginPath(); c.moveTo(f.x - 80, f.y + 50);
    for (var i = 0; i <= 16; i++) c.lineTo(f.x - 80 + i * 10, f.y + 50 - q * 90 * Math.sin(i / 16 * Math.PI) - Math.sin(i + k * 12) * 6);
    c.lineTo(f.x + 80, f.y + 50); c.fill();
    for (i = 0; i < 14; i++) { var ang = -Math.PI * (0.1 + R(f, i) * 0.8), sp = 40 + R(f, i, 1) * 80, p = ease(seg(k, 0.2, 1)); c.fillStyle = rgba('200,235,255', (1 - p) * 0.9); c.fillRect(f.x + Math.cos(ang) * sp * p, f.y + 10 + Math.sin(ang) * sp * p + p * p * 70, 5, 5); }
    ring(c, f.x, f.y + 50, 20 + ease(k) * 60, 3, '180,220,255', a * 0.7);
    glow(c, false);
  } };
  S.wind = { dur: 0.75, draw: function (c, f, k) {   // a whirling gust with leaves in it
    var a = fade(k, 0.5);
    glow(c, true);
    for (var i = 0; i < 5; i++) arcStroke(c, f.x, f.y, 18 + i * 13 + k * 26, k * 10 + i, k * 10 + i + 2.4, 4, '220,255,230', a * 0.8);
    glow(c, false);
    for (i = 0; i < 8; i++) { var ang = k * 9 + i * 0.8, r = 20 + i * 8 + k * 20; c.fillStyle = rgba(i % 2 ? '120,180,90' : '200,170,80', a); c.save(); c.translate(f.x + Math.cos(ang) * r, f.y + Math.sin(ang) * r * 0.7 - k * 30); c.rotate(ang); c.fillRect(-5, -2, 10, 4); c.restore(); }
  } };
  S.earth = { dur: 0.8, draw: function (c, f, k) {   // rocks bursting up out of the ground
    for (var i = 0; i < 8; i++) {
      var t0 = i * 0.05, p = seg(k, t0, t0 + 0.45), x = f.x + (R(f, i) - 0.5) * 110, h = 30 + R(f, i, 1) * 40;
      if (p <= 0) continue;
      var up = Math.sin(Math.min(1, p) * Math.PI);
      c.fillStyle = rgba('120,95,65', fade(k, 0.7)); c.beginPath(); c.moveTo(x - 12, f.y + 55); c.lineTo(x - 4, f.y + 55 - h * up); c.lineTo(x + 8, f.y + 55 - h * up * 0.8); c.lineTo(x + 14, f.y + 55); c.fill();
      c.fillStyle = rgba('170,140,100', fade(k, 0.7)); c.fillRect(x - 4, f.y + 55 - h * up, 6, h * up * 0.5);
    }
    sparks(c, f, k, 10, '150,120,80', 70, 7);
  } };
  S.dark = { dur: 0.8, draw: function (c, f, k) {   // a black miasma that coils round the target
    var a = fade(k, 0.5);
    for (var i = 0; i < 10; i++) { var ang = k * 6 + i * 0.63, r = 50 - k * 20 + (i % 3) * 10; c.fillStyle = rgba(i % 2 ? '70,20,100' : '30,10,40', a * 0.7); c.beginPath(); c.arc(f.x + Math.cos(ang) * r, f.y + Math.sin(ang) * r * 0.6, 14 + (i % 3) * 5, 0, Math.PI * 2); c.fill(); }
    glow(c, true); c.fillStyle = rgba('160,60,220', a * 0.4); c.beginPath(); c.arc(f.x, f.y, 26 + k * 40, 0, Math.PI * 2); c.fill(); glow(c, false);
  } };
  S.sand = { dur: 0.8, draw: function (c, f, k) {   // sand and stones on a black wind
    var a = fade(k, 0.6);
    for (var j = 0; j < 7; j++) { c.fillStyle = rgba(j % 2 ? '110,85,50' : '150,120,70', a * 0.35); c.beginPath(); c.arc(f.x - 90 + ((j * 53 + k * 260) % 180), f.y - 30 + (j % 3) * 30, 34 + (j % 2) * 10, 0, Math.PI * 2); c.fill(); }
    for (var i = 0; i < 40; i++) { var x = f.x - 130 + ((i * 37 + k * 420) % 260), y = f.y - 60 + (i * 13) % 120 + Math.sin(k * 10 + i) * 6; c.fillStyle = rgba(i % 4 ? '90,70,40' : '230,200,130', a); c.fillRect(x, y, i % 4 ? 6 : 9, i % 4 ? 3 : 8); }
  } };
  S.magic = { dur: 0.8, draw: function (c, f, k) {   // golden light coming down in a pillar, motes rising
    var a = fade(k, 0.5), w = 30 + Math.sin(k * Math.PI) * 20;
    glow(c, true);
    var g = c.createLinearGradient(f.x, f.y - 300, f.x, f.y + 60); g.addColorStop(0, rgba('255,240,170', 0)); g.addColorStop(1, rgba('255,230,140', a * 0.7));
    c.fillStyle = g; c.fillRect(f.x - w, f.y - 300, w * 2, 360);
    for (var i = 0; i < 10; i++) { var ph = (k * 1.4 + R(f, i)) % 1; c.fillStyle = rgba('255,255,220', a * (1 - ph)); c.fillRect(f.x + (R(f, i, 1) - 0.5) * w * 2, f.y + 50 - ph * 140, 4, 4); }
    ring(c, f.x, f.y + 50, 20 + k * 50, 3, '255,230,150', a);
    glow(c, false);
  } };
  S.stars = { dur: 1.0, draw: function (c, f, k) {   // the stars of Heaven falling on the enemy (Song Jiang's Thirty-Six Spirits)
    glow(c, true);
    for (var i = 0; i < 12; i++) {
      var t0 = R(f, i) * 0.4, p = seg(k, t0, t0 + 0.35); if (p <= 0) continue;
      var x0 = f.x + 120 + R(f, i, 1) * 80, y0 = f.y - 320, x1 = f.x + (R(f, i, 2) - 0.5) * 80, y1 = f.y + (R(f, i, 3) - 0.5) * 40;
      if (p < 1) { var x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p; c.strokeStyle = rgba('255,240,180', 0.6); c.lineWidth = 3; c.beginPath(); c.moveTo(x - (x1 - x0) * 0.15, y - (y1 - y0) * 0.15); c.lineTo(x, y); c.stroke(); star(c, x, y, 9, 5, rgba('255,255,230', 1)); }
      else { var q = seg(k, t0 + 0.35, t0 + 0.65); star(c, x1, y1, 22 * (1 - q), 5, rgba('255,230,140', 1 - q)); }
    }
    glow(c, false);
  } };
  S.dragon = { dur: 1.0, draw: function (c, f, k) {   // a dragon of light coiling round the target and striking down
    var a = fade(k, 0.6);
    glow(c, true);
    for (var i = 0; i < 26; i++) {
      var t = k * 1.6 - i * 0.03; if (t < 0) continue;
      var ang = t * 9, r = 70 * (1 - Math.min(1, t) * 0.6), x = f.x + Math.cos(ang) * r, y = f.y - 140 + Math.min(1, t) * 140 + Math.sin(ang) * r * 0.35;
      c.fillStyle = rgba(i < 3 ? '255,255,230' : i % 2 ? '120,200,255' : '200,240,255', a * (1 - i / 30));
      c.beginPath(); c.arc(x, y, Math.max(2, (i < 3 ? 13 : 11) - i * 0.35), 0, Math.PI * 2); c.fill();
    }
    var q = seg(k, 0.55, 1); if (q > 0) ring(c, f.x, f.y, 20 + ease(q) * 90, 6, '180,230,255', 1 - q);
    glow(c, false);
  } };
  // --- support ---
  S.heal = { dur: 0.8, draw: function (c, f, k) {   // green motes and leaves rising, a soft ring on the ground
    var a = fade(k, 0.6);
    glow(c, true);
    for (var i = 0; i < 14; i++) { var ph = (k * 1.2 + R(f, i)) % 1, x = f.x + Math.sin(i * 2.4 + k * 4) * 34, y = f.y + 50 - ph * 120; c.fillStyle = rgba(i % 3 ? '150,255,170' : '255,255,200', a * (1 - ph)); c.fillRect(x - 3, y - 3, 6, 6); if (i % 4 === 0) { c.fillRect(x - 7, y - 1, 14, 2); c.fillRect(x - 1, y - 7, 2, 14); } }
    ring(c, f.x, f.y + 50, 30 + Math.sin(k * Math.PI) * 14, 4, '140,255,160', a * 0.7);
    glow(c, false);
  } };
  S.rain = { dur: 0.9, draw: function (c, f, k) {   // a gentle rain falling on the target, and green light where it lands
    var a = fade(k, 0.6);
    for (var i = 0; i < 16; i++) { var ph = (k * 2 + R(f, i)) % 1, x = f.x + (R(f, i, 1) - 0.5) * 100, y = f.y - 140 + ph * 190; c.strokeStyle = rgba('170,210,255', a * 0.9); c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y + 12); c.stroke(); }
    S.heal.draw(c, f, k);
  } };
  S.buff = { dur: 0.8, draw: function (c, f, k) {   // rings of colour rising round the one strengthened
    var col = f.opt.col || '255,210,110', a = fade(k, 0.6);
    glow(c, true);
    for (var i = 0; i < 3; i++) { var ph = (k * 1.3 + i / 3) % 1; c.strokeStyle = rgba(col, a * (1 - ph)); c.lineWidth = 4; c.beginPath(); c.ellipse(f.x, f.y + 50 - ph * 110, 40, 12, 0, 0, Math.PI * 2); c.stroke(); }
    for (i = 0; i < 6; i++) { var ph2 = (k * 1.5 + R(f, i)) % 1; c.fillStyle = rgba('255,255,230', a * (1 - ph2)); c.fillRect(f.x + (R(f, i, 1) - 0.5) * 70, f.y + 40 - ph2 * 120, 3, 8); }
    glow(c, false);
  } };
  S.banner = { dur: 1.0, draw: function (c, f, k) {   // the apricot-yellow banner, "Act on Heaven's Behalf", raised over each brother
    var p = ease(seg(k, 0, 0.4)), a = fade(k, 0.7), h = 90 * p, x = f.x + 30, y = f.y - 50;
    c.fillStyle = rgba('90,60,30', a); c.fillRect(x, y - h, 4, h + 50);
    c.fillStyle = rgba('240,190,60', a); c.beginPath(); c.moveTo(x + 4, y - h); for (var i = 0; i <= 8; i++) c.lineTo(x + 4 + i * 6, y - h + Math.sin(i * 0.8 + k * 12) * 3); c.lineTo(x + 52, y - h + 36 * p); c.lineTo(x + 4, y - h + 36 * p); c.fill();
    c.fillStyle = rgba('180,40,30', a); for (i = 0; i < 4; i++) c.fillRect(x + 12 + i * 9, y - h + 10, 5, 16 * p);
    S.buff.draw(c, f, k);
  } };
  S.drug = { dur: 0.9, draw: function (c, f, k) {   // drugged wine: a purple haze, bubbles, the z's of sleep
    var a = fade(k, 0.6);
    c.fillStyle = rgba('150,100,190', a * 0.3); c.beginPath(); c.ellipse(f.x, f.y + 20, 70, 40, 0, 0, Math.PI * 2); c.fill();
    for (var i = 0; i < 10; i++) { var ph = (k * 1.2 + R(f, i)) % 1; c.strokeStyle = rgba('210,170,255', a * (1 - ph)); c.lineWidth = 2; c.beginPath(); c.arc(f.x + (R(f, i, 1) - 0.5) * 80, f.y + 40 - ph * 100, 4 + R(f, i, 2) * 6, 0, Math.PI * 2); c.stroke(); }
    var zee = function (x, y, z) { c.strokeStyle = rgba('230,210,255', a); c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + z, y); c.lineTo(x, y + z); c.lineTo(x + z, y + z); c.stroke(); };   // (drawn, so it is pixelated with the rest)
    if (k > 0.3) zee(f.x + 26, f.y - 70 - k * 30, 18);
    if (k > 0.5) zee(f.x + 50, f.y - 96 - k * 30, 13);
  } };
  S.poison = { dur: 0.8, draw: function (c, f, k) {   // poison: green bubbles boiling up
    var a = fade(k, 0.6);
    c.fillStyle = rgba('90,170,60', a * 0.25); c.beginPath(); c.ellipse(f.x, f.y + 10, 60, 50, 0, 0, Math.PI * 2); c.fill();
    for (var i = 0; i < 14; i++) { var ph = (k * 1.4 + R(f, i)) % 1; c.fillStyle = rgba(i % 2 ? '140,240,100' : '70,170,60', a * (1 - ph) * 0.9); c.beginPath(); c.arc(f.x + (R(f, i, 1) - 0.5) * 80, f.y + 40 - ph * 110, 6 + R(f, i, 2) * 9, 0, Math.PI * 2); c.fill(); }
  } };
  S.powder = { dur: 0.7, draw: function (c, f, k) {   // a handful of lime or powder in the eyes: a white puff
    var a = fade(k, 0.3);
    for (var i = 0; i < 10; i++) { var ang = R(f, i) * Math.PI * 2, r = ease(k) * (30 + R(f, i, 1) * 30); c.fillStyle = rgba('240,240,230', a * 0.7); c.beginPath(); c.arc(f.x + Math.cos(ang) * r, f.y - 20 + Math.sin(ang) * r * 0.6, 10 + k * 12, 0, Math.PI * 2); c.fill(); }
  } };
  S.smoke = { dur: 0.7, draw: function (c, f, k) {   // a puff of smoke: someone is there, and then is not
    var a = fade(k, 0.3);
    for (var i = 0; i < 8; i++) { var ang = i / 8 * Math.PI * 2, r = 10 + ease(k) * 40; c.fillStyle = rgba('200,200,210', a * 0.6); c.beginPath(); c.arc(f.x + Math.cos(ang) * r, f.y + 20 + Math.sin(ang) * r * 0.5 - k * 20, 14 + k * 10, 0, Math.PI * 2); c.fill(); }
  } };
  S.steal = { dur: 0.7, draw: function (c, f, k) {   // a thief's hand: a puff of smoke and the glint of coin
    S.smoke.draw(c, f, k);
    glow(c, true); for (var i = 0; i < 5; i++) { var ph = seg(k, i * 0.08, 0.6 + i * 0.08); star(c, f.x + (i - 2) * 12, f.y - 30 - ph * 50, 7 * (1 - ph), 4, rgba('255,220,80', 1 - ph)); } glow(c, false);
  } };
  S.net = { dur: 0.75, draw: function (c, f, k) {   // a fishing net thrown over the enemy
    var p = ease(seg(k, 0, 0.4)), a = fade(k, 0.6), w = 100, h = 110, y0 = f.y - 160 + p * 110;
    c.strokeStyle = rgba('210,190,140', a); c.lineWidth = 2;
    for (var i = 0; i <= 6; i++) { c.beginPath(); c.moveTo(f.x - w / 2 + i * w / 6, y0); c.quadraticCurveTo(f.x - w / 2 + i * w / 6, y0 + h * 0.6, f.x - w / 2 + i * w / 6 + (i - 3) * 4, y0 + h); c.stroke(); }
    for (i = 0; i <= 5; i++) { c.beginPath(); var yy = y0 + i * h / 5; c.moveTo(f.x - w / 2, yy); c.quadraticCurveTo(f.x, yy + 10, f.x + w / 2, yy); c.stroke(); }
  } };
  S.charge = { dur: 0.45, draw: function (c, f, k) {   // the one who acts gathers their strength: an aura and rising light
    var col = f.opt.col || '255,220,140', a = Math.sin(k * Math.PI);
    glow(c, true);
    c.fillStyle = rgba(col, a * 0.35); c.beginPath(); c.ellipse(f.x, f.y, 46, 70, 0, 0, Math.PI * 2); c.fill();
    for (var i = 0; i < 10; i++) { var ph = (k * 1.6 + R(f, i)) % 1; c.fillStyle = rgba(col, a * (1 - ph)); c.fillRect(f.x + (R(f, i, 1) - 0.5) * 80, f.y + 60 - ph * 130, 3, 10); }
    ring(c, f.x, f.y + 60, 30 + k * 30, 3, col, a * 0.8);
    glow(c, false);
  } };
  // older names in the data, drawn with the styles above
  var ALIAS = X.ALIAS = { splash: 'water', hit: 'fist', cannon: 'bomb', miss: 'powder', burst: 'smash', blunt: 'smash' };
  X.has = function (kind) { return !!(S[kind] || S[ALIAS[kind]]); };
  X.style = function (kind) { return S[kind] || S[ALIAS[kind]] || null; };
  X.draw = function (c, f) {
    var st = X.style(f.kind); if (!st) return false;
    c.save();
    if (f.opt.scale) { c.translate(f.x, f.y); c.scale(f.opt.scale, f.opt.scale); c.translate(-f.x, -f.y); }   // (a plain blow is drawn smaller than a skill)
    st.draw(c, f, Math.min(1, f.t / f.dur)); c.restore();
    return true;
  };
  // The blow of a plain attack, by the weapon in hand: a sabre cuts a crescent, a spear thrusts, an axe chops straight
  // down, a club or staff smashes, a dagger jabs, a whip lashes, twin blades cross, fists punch. `fx` is the weapon's
  // own word from the data (claw, blunt), which decides when the name says nothing.
  var STRIKES = [
    [/hook/i, 'hook'],
    [/twin (sabres|swords|snowflake)/i, 'cross'],
    [/spear|lance|fork|javelin|halberd|trident/i, 'thrust'],
    [/axe|spade|cleaver|butcher|executioner/i, 'chop'],
    [/whip|chain|lasso|meteor/i, 'whip'],
    [/twin|sabres|swords|blades|knives/i, 'cross'],
    [/fist|palm/i, 'fist'],
    [/dagger|knife|needle|graver|shears/i, 'stab'],
    [/hammer|mace|staff|pole|club|fan|abacus|brush|stick/i, 'smash'],
    [/long-handled|green dragon|long blade|three-pointed|great/i, 'blade'],
    [/sabre|saber|sword|blade|dao/i, 'slash']
  ];
  X.strikeOf = function (name, fx) {
    if (fx === 'claw') return 'claw';
    for (var i = 0; i < STRIKES.length; i++) if (STRIKES[i][0].test(name || '')) return STRIKES[i][1];
    return fx === 'blunt' ? 'smash' : 'slash';
  };
  // All the effects of a frame, drawn pixelated to match the battle sprites: onto a canvas a quarter the size of the
  // screen, the soft edges snapped to a few hard steps of opacity, then blown back up without smoothing.
  var PIX = X.PIXEL = 4, layer = null, lctx = null;
  X.drawLayer = function (ctx, list, w, h) {
    if (!list.length) return;
    w = w || 960; h = h || 720;
    var lw = Math.ceil(w / PIX), lh = Math.ceil(h / PIX);
    if (!layer || layer.width !== lw || layer.height !== lh) { layer = U.makeCanvas(lw, lh); lctx = layer.getContext('2d'); }
    lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, lw, lh);
    lctx.setTransform(1 / PIX, 0, 0, 1 / PIX, 0, 0);
    list.forEach(function (f) { X.draw(lctx, f); });
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    var img = lctx.getImageData(0, 0, lw, lh), d = img.data;
    for (var i = 3; i < d.length; i += 4) {
      var a = d[i]; if (!a) continue;
      // snap the opacity to four steps (no smooth fringes), and un-premultiply what the snapping brightens
      d[i] = a < 40 ? 0 : a < 110 ? 96 : a < 190 ? 176 : 255;
    }
    lctx.putImageData(img, 0, 0);
    var sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(layer, 0, 0, lw, lh, 0, 0, lw * PIX, lh * PIX);
    ctx.imageSmoothingEnabled = sm;
  };

  // ---------- which style for which skill ----------
  // signature pieces and anything the rules below would get wrong, by hero and skill number (0, 1, 2)
  var OVR = X.OVERRIDES = {
    'songjiang:0': 'rain', 'songjiang:1': 'banner', 'songjiang:2': 'stars',
    'lujunyi:2': 'thrust', 'wuyong:0': 'whip', 'wuyong:2': 'buff',
    'gongsunsheng:2': 'dragon', 'guansheng:0': 'blade', 'guansheng:1': 'sweep', 'guansheng:2': 'dragon',
    'linchong:1': 'thrust', 'linchong:2': 'rush', 'qinming:1': 'roar', 'qinming:2': 'thunder',
    'huyanzhuo:0': 'whip', 'huyanzhuo:1': 'rush', 'huyanzhuo:2': 'whip', 'huarong:2': 'arrow',
    'chaijin:1': 'magic', 'chaijin:2': 'buff', 'liying:0': 'knife', 'liying:1': 'knife', 'liying:2': 'rush',
    'luzhishen:0': 'fist', 'luzhishen:1': 'earth', 'luzhishen:2': 'smash', 'wusong:0': 'claw', 'wusong:1': 'fist', 'wusong:2': 'cross',
    'dongping:0': 'thrust', 'dongping:2': 'thrust', 'zhangqing:2': 'stone', 'xuning:0': 'hook', 'xuning:1': 'hook', 'xuning:2': 'hook',
    'suochao:1': 'rush', 'daizong:1': 'rush', 'daizong:2': 'rush', 'likui:1': 'wind', 'likui:2': 'chop',
    'shijin:1': 'dragon', 'muhong:2': 'rush', 'leiheng:0': 'rush', 'lijun:1': 'water', 'lijun:2': 'water',
    'ruanxiaoer:1': 'net', 'zhangheng:1': 'water', 'zhangheng:2': 'water', 'ruanxiaowu:1': 'knife', 'zhangshun:1': 'water', 'zhangshun:2': 'water',
    'ruanxiaoqi:1': 'dark', 'shixiu:1': 'rush', 'xiezhen:1': 'hook', 'xiebao:1': 'stab', 'xiebao:2': 'claw', 'yanqing:1': 'fist', 'yanqing:2': 'arrow',
    'zhuwu:0': 'buff', 'zhuwu:1': 'buff', 'zhuwu:2': 'earth', 'huangxin:1': 'roar', 'sunli:0': 'whip',
    'shantinggui:0': 'water', 'shantinggui:1': 'water', 'shantinggui:2': 'water', 'weidingguo:0': 'fire', 'weidingguo:1': 'bomb', 'weidingguo:2': 'fire',
    'oupeng:1': 'rush', 'dengfei:0': 'whip', 'dengfei:2': 'water', 'lingzhen:0': 'bomb', 'lingzhen:1': 'bomb', 'lingzhen:2': 'bomb',
    'husanniang:0': 'cross', 'husanniang:1': 'whip', 'fanrui:0': 'dark', 'fanrui:1': 'sand', 'fanrui:2': 'wind',
    'kongming:2': 'stars', 'kongliang:0': 'fire', 'kongliang:1': 'claw', 'xiangchong:0': 'knife', 'xiangchong:1': 'knife', 'xiangchong:2': 'knife',
    'ligun:0': 'javelin', 'ligun:1': 'javelin', 'ligun:2': 'javelin', 'malin:1': 'roar', 'tongwei:1': 'water', 'tongmeng:1': 'water', 'tongmeng:2': 'hook',
    'mengkang:1': 'water', 'taozongwang:1': 'earth', 'gongwang:0': 'javelin', 'gongwang:2': 'javelin', 'dingdesun:0': 'javelin', 'dingdesun:2': 'javelin',
    'tanglong:1': 'fire', 'zourun:2': 'rush', 'zhugui:1': 'drug', 'zhugui:2': 'arrow', 'zhufu:1': 'drug', 'lili:1': 'drug',
    'jiaoting:0': 'fist', 'jiaoting:1': 'fist', 'jiaoting:2': 'fist', 'sunxin:0': 'whip', 'gudasao:1': 'fist', 'sunerniang:1': 'drug', 'sunerniang:2': 'knife',
    'wangdingliu:0': 'rush', 'wangdingliu:1': 'rush', 'wangdingliu:2': 'rush', 'baisheng:1': 'drug', 'shiqian:1': 'steal', 'shiqian:2': 'steal',
    'duanjingzhu:1': 'rush', 'duanjingzhu:2': 'rush', 'wangjin:2': 'cross', 'luda:0': 'fist', 'chaogai:2': 'smash',
    'qiongying:0': 'stone', 'qiongying:1': 'arrow', 'hongxin:1': 'magic',
    'huarong:1': 'volley', 'wangying:1': 'rush', 'chaogai:0': 'smash', 'shiyong:0': 'smash', 'lizhong:0': 'smash', 'yangzhi:2': 'blade'
  };
  // a word in the skill's name or description that says how it looks
  var WORDS = [
    [/\b(fire|flame|burn|forge)\b/i, 'fire'], [/\b(thunder|lightning|thunderbolt)\b/i, 'thunder'], [/\bbomb|cannon|trebuchet|fire-cart/i, 'bomb'],
    [/\b(drug|drugged)\b/i, 'drug'], [/\bpoison/i, 'poison'], [/\b(net)\b/i, 'net'], [/\bwave|river|water|flood|drown|capsize/i, 'water'],
    [/\bflying knives|\bknives\b/i, 'knife'], [/\bjavelin|flying spear|flying fork/i, 'javelin'], [/\bstones?\b|pebble/i, 'stone'],
    [/\barrows?\b|\bbolt\b|crossbow/i, 'arrow'], [/\bpunch|fist|wrestl|\bthrow\b|kick|butt|headbutt/i, 'fist'],
    [/\bwhip|chain|lasso/i, 'whip'], [/\bhook/i, 'hook'], [/\baxe/i, 'chop'], [/\bclaw|tiger's|tiger-slaying/i, 'claw'],
    [/\b(charge|leap|dash|swoop|stampede|rush)/i, 'rush'], [/\broar|war-cry|shout/i, 'roar'], [/\bsnake|serpent's strike/i, 'thrust']
  ];
  // the weapon in the hero's hand, when the skill itself does not say
  function byWeapon(name) {
    name = name || '';
    if (/Twin|Sabres &|Spear & Whip/i.test(name) && !/Spear/i.test(name)) return 'cross';
    if (/Twin Spears/i.test(name)) return 'thrust';
    if (/Bow|Crossbow/i.test(name)) return 'arrow';
    if (/Stones|Trebuchet/i.test(name)) return /Trebuchet/.test(name) ? 'bomb' : 'stone';
    if (/Flying Knives/i.test(name)) return 'knife';
    if (/Javelin|Flying Spear|Flying Fork/i.test(name)) return 'javelin';
    if (/Axe/i.test(name)) return 'chop';
    if (/Whip|Chain/i.test(name)) return 'whip';
    if (/Hook/i.test(name)) return 'hook';
    if (/Spear|Lance|Fork/i.test(name)) return 'thrust';
    if (/Halberd|Long Blade|Long-Handled|Green Dragon|Broad Sword|Three-Pointed|Executioner/i.test(name)) return 'blade';
    if (/Staff|Mace|Hammer|Pole|Spade|Fan|Abacus|Flagstaff|Club/i.test(name)) return 'smash';
    if (/Fists/i.test(name)) return 'fist';
    if (/Dagger|Knife|Needles|Graver|Shears|Hoof|Butcher/i.test(name)) return 'stab';
    if (/Brush/i.test(name)) return 'stab';
    return 'slash';
  }
  var ELEM = { fire: 'fire', thunder: 'thunder', water: 'water', wind: 'wind', earth: 'earth', dark: 'dark', magic: 'magic', heal: 'heal', sand: 'sand' };
  // ctx: { hero: id, idx: 0..2 } for a hero's skill
  X.forSkill = function (sk, ctx) {
    ctx = ctx || {};
    var key = ctx.hero != null ? ctx.hero + ':' + ctx.idx : null;
    if (sk.vfx) return sk.vfx;
    if (key && OVR[key]) return OVR[key];
    if (sk.effect === 'heal' || sk.effect === 'revive' || sk.effect === 'cure') return 'heal';
    if (sk.effect === 'buff') return 'buff';
    if (sk.effect === 'status') return sk.status === 'sleep' ? 'drug' : sk.status === 'poison' ? 'poison' : sk.status === 'silence' ? 'powder' : 'wind';
    if (sk.effect === 'damage') return ELEM[sk.element] || 'magic';
    var text = (sk.name || '') + ' ' + (sk.desc || '');
    for (var i = 0; i < WORDS.length; i++) if (WORDS[i][0].test(sk.name || '')) return WORDS[i][1];
    if (sk.shot) return sk.shot === 'arrow' ? (sk.target === 'enemyAll' ? 'volley' : 'arrow') : 'stone';
    if (sk.fx && X.has(sk.fx)) return ALIAS[sk.fx] || sk.fx;
    for (i = 0; i < WORDS.length; i++) if (WORDS[i][0].test(text)) return WORDS[i][1];
    var w = ctx.hero && WM.data.chars[ctx.hero] && WM.data.chars[ctx.hero].weapon;
    var st = byWeapon(w && w.name);
    if (sk.target === 'enemyAll' && (st === 'slash' || st === 'blade')) return 'sweep';
    return st;
  };
  // an enemy's skill, a unite attack or an item: their own fx (or element), drawn by the nearest style
  X.forOther = function (o) {
    var k = o.vfx || o.fx || o.element;
    if (k === 'arrow' && (o.target === 'all' || o.target === 'enemyAll')) return 'volley';
    if (k && X.has(k)) return S[k] ? k : ALIAS[k];
    if (o.status === 'sleep' || (o.effect && o.effect.status === 'sleep')) return 'drug';
    if (o.heal || (o.effect && o.effect.heal)) return 'heal';
    if (o.buff || (o.effect && o.effect.buff)) return 'buff';
    return o.type === 'magic' ? 'magic' : 'slash';
  };
  // a colour for the charge-up aura and the tint over the field, from the style
  X.tintFor = function (style) {
    return { fire: '255,140,60', bomb: '255,140,60', thunder: '170,200,255', dragon: '150,210,255', water: '120,180,255', wind: '200,255,220', dark: '150,60,200', sand: '200,170,100', earth: '190,150,100', stars: '255,230,150', magic: '255,230,150', banner: '255,210,110', heal: '150,255,170', rain: '150,220,255', drug: '200,160,255', poison: '120,220,90', claw: '255,120,100' }[style] || '255,230,170';
  };
  X.travels = function (style) { var st = X.style(style); return st && st.travel ? st.travel * st.dur : 0; };
  X.dur = function (style) { var st = X.style(style); return st ? st.dur : 0.5; };
  // the sound of each look (js/core/audio.js): a launch for what flies from the attacker, and the impact
  var SND = X.SOUNDS = {
    arrow: { launch: 'fx_bow', hit: 'fx_arrowhit' }, volley: { hit: 'fx_volley' },
    stone: { launch: 'fx_throw', hit: 'fx_stonehit' }, knife: { launch: 'fx_throw', hit: 'fx_knifehit' }, javelin: { launch: 'fx_throw', hit: 'fx_javelinhit' },
    bomb: { launch: 'fx_fuse', hit: 'fx_boom' }, smoke: { hit: 'fx_puff' }, powder: { hit: 'fx_puff' }
  };
  X.soundFor = function (style, phase) {
    style = S[style] ? style : ALIAS[style] || style;
    var e = SND[style];
    if (e) return e[phase] || null;
    return phase === 'hit' ? 'fx_' + style : null;
  };
  X.sound = function (style, phase) { var n = X.soundFor(style, phase); if (n && WM.audio) WM.audio.sfx(n); return !!n; };
})();
