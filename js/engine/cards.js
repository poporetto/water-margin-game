// Title screen, chapter cards (the novel's paired-couplet chapter titles), join cards, game over.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var C = WM.cards = {};

  function inkScene(t, opt) {
    opt = opt || {};
    var c = G.ctx;
    var gr = c.createLinearGradient(0, 0, 0, WM.H);
    gr.addColorStop(0, opt.top || '#1a2236'); gr.addColorStop(0.6, opt.mid || '#3a3a4a'); gr.addColorStop(1, opt.bot || '#0e0e14');
    c.fillStyle = gr; c.fillRect(0, 0, WM.W, WM.H);
    // moon
    if (!opt.noMoon) {
      c.fillStyle = 'rgba(240,230,200,0.9)'; c.beginPath(); c.arc(760, 150, 54, 0, 7); c.fill();
      c.fillStyle = 'rgba(240,230,200,0.12)'; c.beginPath(); c.arc(760, 150, 90, 0, 7); c.fill();
    }
    // layered mountains (ink wash)
    var layers = [['rgba(60,70,90,0.55)', 360, 90, 0.004], ['rgba(40,46,62,0.75)', 430, 70, 0.007], ['rgba(20,24,34,0.95)', 500, 60, 0.011]];
    layers.forEach(function (L, li) {
      c.fillStyle = L[0]; c.beginPath(); c.moveTo(0, WM.H);
      for (var x = 0; x <= WM.W; x += 8) {
        var y = L[1] - Math.abs(Math.sin(x * L[3] + li * 2)) * L[2] - Math.sin(x * L[3] * 3.1 + li) * 18;
        c.lineTo(x, y);
      }
      c.lineTo(WM.W, WM.H); c.closePath(); c.fill();
    });
    // mist
    for (var i = 0; i < 5; i++) {
      var mx = ((t * 12 + i * 260) % (WM.W + 400)) - 200;
      var mg = c.createRadialGradient(mx, 470 + i * 14, 10, mx, 470 + i * 14, 220);
      mg.addColorStop(0, 'rgba(200,210,220,0.10)'); mg.addColorStop(1, 'rgba(200,210,220,0)');
      c.fillStyle = mg; c.fillRect(mx - 220, 250, 440, 440);
    }
    // water & reeds
    c.fillStyle = 'rgba(14,20,30,0.95)'; c.fillRect(0, 560, WM.W, 160);
    for (i = 0; i < 26; i++) { c.fillStyle = 'rgba(240,230,200,' + (0.05 + 0.05 * Math.sin(t * 2 + i)) + ')'; c.fillRect(700 + Math.sin(i * 3.7) * 60, 580 + i * 5, 40 + (i % 5) * 10, 2); }
    c.strokeStyle = 'rgba(10,12,16,0.95)'; c.lineWidth = 3;
    for (i = 0; i < 70; i++) {
      var rx = (i * 37) % WM.W, rh = 60 + (i * 13) % 70, sway = Math.sin(t * 1.3 + i * 0.7) * 6;
      c.beginPath(); c.moveTo(rx, 720); c.quadraticCurveTo(rx + sway * 0.5, 720 - rh / 2, rx + sway, 720 - rh); c.stroke();
      c.fillStyle = 'rgba(10,12,16,0.95)'; c.fillRect(rx + sway - 2, 720 - rh - 10, 4, 12);
    }
    // a lone boat
    if (!opt.noBoat) {
      var bx = 200 + Math.sin(t * 0.2) * 20;
      c.fillStyle = 'rgba(10,12,16,0.95)';
      c.beginPath(); c.moveTo(bx - 60, 600); c.quadraticCurveTo(bx, 618, bx + 60, 600); c.lineTo(bx + 50, 608); c.quadraticCurveTo(bx, 622, bx - 50, 608); c.fill();
      c.fillRect(bx - 6, 580, 12, 20); c.beginPath(); c.moveTo(bx - 14, 582); c.lineTo(bx, 568); c.lineTo(bx + 14, 582); c.fill();
      c.strokeStyle = 'rgba(10,12,16,0.95)'; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + 30, 560); c.lineTo(bx + 46, 616); c.stroke();
    }
    // geese
    if (!opt.noGeese) {
      c.strokeStyle = 'rgba(20,20,26,0.85)'; c.lineWidth = 2;
      for (i = 0; i < 7; i++) {
        var gx = ((t * 30) % (WM.W + 300)) - 150 + (i < 4 ? i * 26 : (7 - i) * 26), gy = 230 + Math.abs(i - 3) * 14 + Math.sin(t * 4 + i) * 2;
        var fl = Math.sin(t * 8 + i) * 4;
        c.beginPath(); c.moveTo(gx - 8, gy - fl); c.lineTo(gx, gy); c.lineTo(gx + 8, gy - fl); c.stroke();
      }
    }
  }
  C.inkScene = inkScene;

  // ---------- Title ----------
  var T = WM.scenes.title = {};
  T.enter = function () {
    T.t = 0; T.mode = 'press';
    WM.audio.play('title');
    WM.script.running = 0;
    UI.stack.length = 0;
    G.fade = 0;
  };
  T.update = function (dt) {
    T.t += dt;
    if (WM.script.running) return;   // a chapter is being started (debug picker): the title takes no input
    if (T.mode === 'press') {
      if (I.pressed('ok')) {
        I.clear(); WM.audio.unlock(); WM.audio.sfx('ok'); WM.audio.play('title');
        T.mode = 'menu';
        var items = [{ label: 'New Game', v: 'new' }];
        if (S.anySave()) { items.unshift({ label: 'Continue', v: 'cont' }); items.push({ label: 'Load', v: 'load' }); }
        T.list = new UI.List(items, { x: 360, y: 470, w: 240, cancel: false });
      }
    } else if (T.mode === 'menu') {
      var r = T.list.handle(); if (!r) return;
      var v = r.ok.v;
      if (v === 'new') { T.mode = 'busy'; WM.audio.stop(); WM.fadeOut(1).then(function () { WM.newGame(); }); }
      if (v === 'cont') { var best = latestSlot(); T.mode = 'busy'; loadSlot(best); }
      if (v === 'load') { T.mode = 'busy'; WM.menu.saveMenu(true).then(function (slot) { if (slot === false || slot == null) { T.mode = 'menu'; return; } loadSlot(slot); }); }
    }
  };
  function latestSlot() { var b = 0, bt = -1; for (var i = 0; i < S.SLOTS; i++) { var p = S.peek(i); if (p && (p.savedAt || 0) > bt) { bt = p.savedAt || 0; b = i; } } return b; }
  function loadSlot(slot) {
    WM.fadeOut(0.6).then(function () {
      if (!S.load(slot)) { T.mode = 'menu'; WM.fadeIn(0.3); return; }
      WM.audio.setVolumes(WM.state.opts.music, WM.state.opts.sfx);
      WM.script.running = 0;
      WM.setScene(WM.field, { map: WM.state.map, x: WM.state.x, y: WM.state.y, dir: WM.state.dir, noAuto: false });
      WM.fadeIn(0.6);
    });
  }
  T.draw = function () {
    inkScene(T.t);
    var c = G.ctx;
    var a = U.clamp(T.t / 2, 0, 1);
    c.globalAlpha = a;
    // seal-red cartouche + titles
    c.fillStyle = 'rgba(150,30,20,0.9)'; c.fillRect(480 - 54, 70, 108, 290);
    c.strokeStyle = 'rgba(240,210,170,0.8)'; c.lineWidth = 3; c.strokeRect(480 - 46, 78, 92, 274);
    ['水', '滸', '傳'].forEach(function (ch, i) { G.text(ch, 480, 92 + i * 86, { size: 70, bold: true, align: 'center', color: '#f6e6c4', shadow: false }); });
    G.text('OUTLAWS OF THE MARSH', 480, 378, { size: 40, bold: true, align: 'center', color: '#f2e6c8' });
    G.text('The One Hundred and Eight Stars', 480, 426, { size: 22, align: 'center', color: '#c8b890' });
    c.globalAlpha = 1;
    if (T.mode === 'press' && T.t > 1.5) { c.globalAlpha = 0.5 + 0.5 * Math.sin(T.t * 3); G.text(WM.input.lastDevice === 'touch' ? 'Tap A' : 'Press Z / Enter', 480, 520, { size: 24, align: 'center', color: '#f2e6c8' }); c.globalAlpha = 1; }
    if (T.mode === 'menu' || (T.mode === 'busy' && T.list)) T.list.draw();
    G.text(WM.input.lastDevice === 'touch' ? 'A: confirm   B: cancel   Menu: menu   hold Dash to run   L / R: turn pages' : 'Z / Enter: confirm   X / Esc: cancel & menu   Shift: dash   Arrows / WASD: move', 480, 690, { size: 15, align: 'center', color: 'rgba(240,230,200,0.5)' });
  };

  // ---------- chapter card ----------
  C.chapter = function (n) {
    var ch = WM.data.chapters[n];
    if (!ch) return Promise.resolve();
    return new Promise(function (resolve) {
      var t0 = WM.time;
      var prevFade = G.fade;
      WM.audio.sfx('gong');
      var w = {
        // the card gives way to black, and the chapter's first scene fades in from it (see WM.chapterDark)
        update: function () { if (WM.time - t0 > 1.2 && (I.pressed('ok') || I.pressed('cancel'))) { I.clear(); G.fade = 1; WM.chapterDark = true; UI.remove(w); resolve(); } },
        draw: function () { drawChapterCard(n, ch, WM.time - t0); }
      };
      UI.push(w);
    });
  };

  // The chapter card: a sheet of old paper on a dark ground, as a page of a printed novel opens a chapter — the
  // chapter number set in spaced capitals, the couplet title in Chinese, a rule with a lozenge, the English couplet
  // in an italic book face (one line of it above the other, as couplets are), and the publisher's seal.
  var grain = null;
  function paperGrain() {
    if (grain) return grain;
    grain = document.createElement('canvas'); grain.width = 160; grain.height = 160;
    var g = grain.getContext('2d'), img = g.createImageData(160, 160);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = Math.random(), k = v < 0.5 ? 0 : 255, al = Math.floor(Math.abs(v - 0.5) * 34);
      img.data[i] = k ? 255 : 90; img.data[i + 1] = k ? 250 : 60; img.data[i + 2] = k ? 235 : 30; img.data[i + 3] = al;
    }
    g.putImageData(img, 0, 0);
    return grain;
  }
  function spaced(str, x, y, opt, gap) {   // centred text with its letters spread apart
    G.font(opt.size, opt.weight, opt.font, opt.italic);
    var c = G.ctx, ws = str.split('').map(function (k) { return c.measureText(k).width; });
    var total = ws.reduce(function (a, b) { return a + b; }, 0) + gap * (str.length - 1), cx = x - total / 2;
    for (var i = 0; i < str.length; i++) { G.text(str[i], cx, y, Object.assign({}, opt, { align: 'left' })); cx += ws[i] + gap; }
  }
  function lozengeRule(c, x, y, half, col) {
    c.fillStyle = col;
    c.fillRect(x - half, y, half - 12, 1); c.fillRect(x + 12, y, half - 12, 1);
    c.fillRect(x - half + 6, y + 3, half - 22, 1); c.fillRect(x + 16, y + 3, half - 22, 1);
    c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x + 6, y + 2); c.lineTo(x, y + 9); c.lineTo(x - 6, y + 2); c.closePath(); c.fill();
    c.fillRect(x - half - 4, y, 2, 4); c.fillRect(x + half + 2, y, 2, 4);
  }
  function corner(c, x, y, sx, sy, col) {   // a fret-work corner, as on a book's border
    c.fillStyle = col;
    c.fillRect(x, y, 26 * sx, 2 * sy); c.fillRect(x, y, 2 * sx, 26 * sy);
    c.fillRect(x + 6 * sx, y + 6 * sy, 12 * sx, 2 * sy); c.fillRect(x + 6 * sx, y + 6 * sy, 2 * sx, 12 * sy);
    c.fillRect(x + 12 * sx, y + 12 * sy, 4 * sx, 4 * sy);
  }
  function drawChapterCard(n, ch, t) {
    var c = G.ctx, W = WM.W, H = WM.H, cx = W / 2;
    // the ground: near black, warmer at the centre
    var bg = c.createRadialGradient(cx, H / 2, 60, cx, H / 2, W * 0.75);
    bg.addColorStop(0, '#2a1f16'); bg.addColorStop(1, '#070504');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    var a = U.clamp(t / 0.9, 0, 1), rise = (1 - a) * (1 - a) * 18;
    c.save(); c.globalAlpha = a; c.translate(0, rise);
    var pw = 640, ph = 500, px = cx - pw / 2, py = (H - ph) / 2;
    // the sheet, with a soft shadow under it
    c.save(); c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 40; c.shadowOffsetY = 12;
    c.fillStyle = '#e9dcbc'; c.fillRect(px, py, pw, ph); c.restore();
    var gr = c.createLinearGradient(0, py, 0, py + ph); gr.addColorStop(0, '#f3e9d0'); gr.addColorStop(0.55, '#eadcb8'); gr.addColorStop(1, '#dccaa0');
    c.fillStyle = gr; c.fillRect(px, py, pw, ph);
    c.fillStyle = c.createPattern(paperGrain(), 'repeat'); c.fillRect(px, py, pw, ph);
    var vg = c.createRadialGradient(cx, py + ph / 2, ph * 0.35, cx, py + ph / 2, pw * 0.72);   // the edges browned with age
    vg.addColorStop(0, 'rgba(120,80,30,0)'); vg.addColorStop(1, 'rgba(120,80,30,0.28)');
    c.fillStyle = vg; c.fillRect(px, py, pw, ph);
    // the printed border: a heavy rule and a hairline inside it, with fret corners
    var ink = '#6e2a18', m = 22;
    c.strokeStyle = ink; c.lineWidth = 3; c.strokeRect(px + m, py + m, pw - 2 * m, ph - 2 * m);
    c.lineWidth = 1; c.strokeRect(px + m + 7, py + m + 7, pw - 2 * m - 14, ph - 2 * m - 14);
    var k = m + 13;
    corner(c, px + k, py + k, 1, 1, ink); corner(c, px + pw - k, py + k, -1, 1, ink);
    corner(c, px + k, py + ph - k, 1, -1, ink); corner(c, px + pw - k, py + ph - k, -1, -1, ink);
    // the chapter number
    var label = ch.label || (n === 0 ? 'Prologue' : 'Chapter ' + roman(n));
    spaced(label.toUpperCase(), cx, py + 62, { size: 22, weight: '600', font: G.FONT_TITLE, color: '#8a2a1a', shadow: false }, 6);
    // the Chinese couplet
    if (ch.zh) {
      var halves = ch.zh.split(/\s+/);
      spaced(halves.join('　'), cx, py + 104, { size: 30, weight: '700', font: G.FONT_ZH, color: '#2e1c10', shadow: false }, 3);
    }
    lozengeRule(c, cx, py + 164, 150, '#8a2a1a');
    // the English couplet, a line of it to each half
    var y = py + 196;
    (ch.title || []).forEach(function (ln, i) {
      if (i) { c.fillStyle = 'rgba(138,42,26,0.55)'; c.fillRect(cx - 3, y + 6, 6, 6); y += 30; }   // a small dot between the halves
      var txt = ln.replace(/[;,.]\s*$/, '');
      G.font(31, '500', G.FONT_TITLE, true);
      var wl = wrapWith(txt, pw - 150);
      wl.forEach(function (l2) { G.text(l2, cx, y, { size: 31, weight: '500', italic: true, font: G.FONT_TITLE, align: 'center', color: '#2a1a0e', shadow: false }); y += 38; });
    });
    if (ch.chapters) spaced('AFTER THE NOVEL · CHAPTERS ' + ch.chapters.replace(/[–-]/, ' – '), cx, py + ph - 74, { size: 13, weight: '600', font: G.FONT_TITLE, color: '#7a5a3a', shadow: false }, 2.5);
    // the seal, stamped a little askew, its red uneven where the ink took
    c.save(); c.translate(px + pw - 86, py + ph - 108); c.rotate(-0.06);
    c.fillStyle = 'rgba(168,36,24,0.88)'; c.fillRect(-26, -26, 52, 52);
    c.fillStyle = 'rgba(243,233,208,0.9)'; c.fillRect(-21, -21, 42, 1); c.fillRect(-21, 20, 42, 1); c.fillRect(-21, -21, 1, 42); c.fillRect(20, -21, 1, 42);
    G.text('忠', 0, -19, { size: 18, weight: '700', font: G.FONT_ZH, align: 'center', color: '#f6e6c4', shadow: false });
    G.text('義', 0, 0, { size: 18, weight: '700', font: G.FONT_ZH, align: 'center', color: '#f6e6c4', shadow: false });
    c.globalCompositeOperation = 'destination-out'; c.globalAlpha = 0.25;
    for (var i = 0; i < 40; i++) c.fillRect(-26 + U.hash2(n, i, 7) * 50, -26 + U.hash2(i, n, 8) * 50, 2, 1);
    c.restore();
    c.restore();
    // a hint to go on, once the card has settled
    if (t > 1.2) { c.globalAlpha = 0.35 + 0.25 * Math.sin(t * 3); G.text('▼', cx, py + ph + 26 - rise, { size: 14, align: 'center', color: '#c8a870', shadow: false }); c.globalAlpha = 1; }
  }
  function wrapWith(text, maxW) {   // wrap in the font already set
    var words = text.split(' '), out = [], cur = '';
    words.forEach(function (wd) { var t2 = cur ? cur + ' ' + wd : wd; if (cur && G.ctx.measureText(t2).width > maxW) { out.push(cur); cur = wd; } else cur = t2; });
    if (cur) out.push(cur);
    return out;
  }
  function roman(n) {
    var map = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = '';
    if (n === 0) return 'Prologue';
    map.forEach(function (m) { while (n >= m[0]) { s += m[1]; n -= m[0]; } });
    return s;
  }
  C.roman = roman;

  // Storyteller's sign-off at the end of each chapter, as the novel closes every chapter.
  C.nextTime = function () {
    // the chapter that ends does not show again: the screen stays black for the next chapter's card
    return C.text('If you would know what happened next, hear the next chapter.', { italic: true, dur: 2.5, dark: true });
  };

  C.text = function (text, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var t0 = WM.time;
      var w = {
        update: function () { if (WM.time - t0 > (opt.min || 0.8) && (I.pressed('ok') || I.pressed('cancel'))) { I.clear(); if (opt.dark) { G.fade = 1; WM.chapterDark = true; } UI.remove(w); resolve(); } },   // opt.dark: black behind it as it goes, not the scene
        draw: function () {
          var c = G.ctx, t = WM.time - t0;
          c.fillStyle = opt.bg || '#0a0806'; c.globalAlpha = opt.overlay ? 0.8 : 1; c.fillRect(0, 0, WM.W, WM.H); c.globalAlpha = 1;
          c.globalAlpha = U.clamp(t / 0.7, 0, 1);
          var ls = G.wrap(text, 760, opt.size || 28);
          ls.forEach(function (l, i) { G.text(l, 480, WM.H / 2 - ls.length * 20 + i * 42, { size: opt.size || 28, align: 'center', color: opt.color || '#e8dcc0' }); });
          c.globalAlpha = 1;
        }
      };
      UI.push(w);
    });
  };

  // The closing roll: all hundred and eight, by rank, each with a portrait, the star, the name, and how their story
  // ended (WM.data.fates), in the manner of the old Suikoden endings. Hold a button to hurry it.
  C.credits = function () {
    var st = WM.state, order = WM.data.charOrder.slice().sort(function (a, b) { return S.def(a).rank - S.def(b).rank; });
    var FATES = WM.data.fates || {}, ROW = 196, HEAD = 200, total = HEAD + order.length * ROW + WM.H + 360;
    var BOX = { top: '#1f3a33', bottom: '#0e1d19' }, lines = {};
    order.forEach(function (id) { lines[id] = G.wrap(FATES[id] || '', 530, 21); });
    return new Promise(function (resolve) {
      var y = 0;
      var w = {
        update: function (dt) {
          y += (I.down('ok') || I.down('cancel') ? 420 : 62) * (dt || 1 / 60);
          if (y > total) { UI.remove(w); resolve(); }
        },
        draw: function () {
          var c = G.ctx; c.fillStyle = '#0a0806'; c.fillRect(0, 0, WM.W, WM.H);
          var top = WM.H - y;
          G.text('The Hundred and Eight Stars', 480, top + 40, { size: 34, bold: true, align: 'center', color: G.COL.gold });
          G.text('天罡三十六 · 地煞七十二', 480, top + 86, { size: 22, align: 'center', color: '#c8b890' });
          order.forEach(function (id, i) {
            var py = top + HEAD + i * ROW; if (py < -ROW || py > WM.H + 20) return;
            var d = S.def(id), fell = !!st.dead[id], col = fell ? '#b8ab98' : '#f0e4c8';
            try { WM.portraits.drawFramed(id, fell ? 'sad' : 'normal', 96, py + 6); } catch (e) {}
            G.window(276, py, 316, 46, BOX); G.window(602, py, 262, 46, BOX);   // the name, then the star
            G.text(d.name + '  ' + d.zh, 290, py + 24, { size: 23, bold: true, color: col, baseline: 'middle' });
            G.text(d.starEn, 616, py + 24, { size: 19, color: '#d8c898', baseline: 'middle' });
            G.window(276, py + 54, 588, 122, BOX);
            (lines[id] || []).slice(0, 4).forEach(function (l, k) { G.text(l, 292, py + 68 + k * 26, { size: 21, color: col }); });
          });
          var ey = top + HEAD + order.length * ROW + 160;
          G.text('The End', 480, ey, { size: 44, bold: true, align: 'center', color: G.COL.gold });
          G.text('水滸傳', 480, ey + 70, { size: 30, align: 'center', color: '#c8b890' });
        }
      };
      UI.push(w);
    });
  };

  // "X has joined" card with portrait and star, struck with a gong.
  UI.joinCard = function (id) {
    var d = WM.data.chars[id];
    return new Promise(function (resolve) {
      var t0 = WM.time;
      var w = {
        update: function () { if (WM.time - t0 > 0.6 && (I.pressed('ok') || I.pressed('cancel'))) { I.clear(); UI.remove(w); resolve(); } },
        draw: function () {
          var t = WM.time - t0, c = G.ctx;
          var a = U.clamp(t / 0.4, 0, 1);
          c.globalAlpha = a * 0.6; c.fillStyle = '#000'; c.fillRect(0, 0, WM.W, WM.H); c.globalAlpha = a;
          G.window(150, 210, 660, 230, { top: '#3a2a12', bottom: '#160e06' });
          WM.portraits.drawFramed(id, 'smile', 176, 236);
          var x = 350;
          G.text(d.name + (d.zh ? '   ' + d.zh : ''), x, 236, { size: 30, bold: true, color: '#ffe0a0' });
          if (d.nick) G.text('“' + d.nick + '”', x, 278, { size: 22, color: '#e8dcc0' });
          if (d.rank && WM.state.flags.grand_assembly) {
            G.text('The ' + d.starEn + ' has appeared.', x, 320, { size: 22, color: '#f0e0b0' });
            G.text(d.star + ' · ' + (d.group === 'heaven' ? 'Heavenly Spirit ' : 'Earthly Fiend ') + d.rank, x, 352, { size: 18, color: '#c8b890' });
          } else if (d.rank) {
            G.text('has joined Liangshan.', x, 320, { size: 22, color: '#f0e0b0' });
            G.text('One of the hundred and eight stars has found its place.', x, 352, { size: 17, color: '#c8b890' });
          } else G.text('has joined the party.', x, 320, { size: 22, color: '#f0e0b0' });
          if (WM.state.flags.castle && d.rank) G.text(S.starCount() + (WM.state.flags.grand_assembly ? ' / 108' : ' heroes'), 790, 400, { size: 18, align: 'right', color: '#c8b890' });
          c.globalAlpha = 1;
        }
      };
      UI.push(w);
    });
  };

  // ---------- game over ----------
  WM.gameOver = function () {
    return new Promise(function (resolve) {
      WM.audio.play('sad');
      var t0 = WM.time;
      UI.stack.length = 0;
      // what the player may do next: load a record, begin the chapter again from its opening, or go to the title
      var snap = null;
      try { snap = JSON.parse(localStorage.getItem('wm-chapterstart') || 'null'); } catch (e) { snap = null; }
      var items = [];
      if (S.anySave()) items.push({ label: 'Load a Record', v: 'load' });
      if (snap && snap.state && WM.data.chapters[snap.n] && WM.data.chapters[snap.n].begin) items.push({ label: 'Restart ' + (snap.n === 0 ? 'the Prologue' : 'Chapter ' + roman(snap.n)), v: 'chapter' });
      items.push({ label: 'Return to Title', v: 'title' });
      var list = new UI.List(items, { x: 110, y: 300, w: 300, cancel: false });
      var busy = false;
      var finish = function () { UI.remove(w); WM.script.running = 0; resolve(); };
      var w = {
        update: function () {
          if (busy || WM.time - t0 < 2) return;
          var r = list.handle(); if (!r || !r.ok) return;
          var v = r.ok.v;
          if (v === 'title') { finish(); WM.setScene(WM.scenes.title); return; }
          if (v === 'load') {
            busy = true;
            WM.menu.saveMenu(true).then(function (slot) {
              if (slot === false || slot == null || !S.load(slot)) { busy = false; return; }
              finish();
              WM.audio.setVolumes(WM.state.opts.music, WM.state.opts.sfx);
              WM.setScene(WM.field, { map: WM.state.map, x: WM.state.x, y: WM.state.y, dir: WM.state.dir, noAuto: false });
              G.fade = 1; WM.fadeIn(0.6);
            });
            return;
          }
          if (v === 'chapter') {
            busy = true; finish();
            var st = snap.state, defaults = S.newGame();
            for (var k in defaults) if (st[k] === undefined) st[k] = defaults[k];
            WM.state = st;
            WM.audio.setVolumes(WM.state.opts.music, WM.state.opts.sfx);
            WM.script.run(function (s) { return WM.data.chapters[snap.n].begin(s); });
          }
        },
        draw: function () {
          var c = G.ctx; c.fillStyle = '#000'; c.fillRect(0, 0, WM.W, WM.H);
          c.globalAlpha = U.clamp((WM.time - t0) / 1.5, 0, 1);
          // Song Jiang alone in a pool of light on the dark ground
          var sx = 640, sy = 560;
          c.save(); c.translate(sx, sy); c.scale(1, 0.42);
          var rg = c.createRadialGradient(0, 0, 20, 0, 0, 230);
          rg.addColorStop(0, 'rgba(236,206,150,0.55)'); rg.addColorStop(0.55, 'rgba(190,150,96,0.32)'); rg.addColorStop(0.85, 'rgba(120,90,50,0.1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = rg; c.beginPath(); c.arc(0, 0, 230, 0, Math.PI * 2); c.fill();
          c.restore();
          var sheet = WM.sprites.get('songjiang'), k = 5;
          c.save(); c.imageSmoothingEnabled = false;
          c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(sx, sy + 4, 34, 9, 0, 0, Math.PI * 2); c.fill();
          c.translate(sx, sy + 4); c.scale(k, k);
          WM.sprites.draw(c, sheet, 'down', 0, 0, 0);
          c.restore();
          G.text('The heroes have fallen.', 480, 120, { size: 36, bold: true, align: 'center', color: '#c04030' });
          G.text('Heaven\'s mandate is not yet fulfilled...', 480, 180, { size: 22, align: 'center', color: '#a09080' });
          c.globalAlpha = 1;
          if (WM.time - t0 >= 2 && !busy) list.draw();
        }
      };
      G.fade = 0;
      UI.push(w);
    });
  };
})();
