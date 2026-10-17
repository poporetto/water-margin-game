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
        draw: function () {
          var t = WM.time - t0, c = G.ctx;
          c.fillStyle = '#0c0a08'; c.fillRect(0, 0, WM.W, WM.H);
          var a = U.clamp(t / 0.8, 0, 1);
          c.globalAlpha = a;
          // paper
          var px = 150, py = 120, pw = 660, ph = 480;
          var gr = c.createLinearGradient(0, py, 0, py + ph); gr.addColorStop(0, '#efe4c8'); gr.addColorStop(1, '#d9c9a0');
          c.fillStyle = gr; c.fillRect(px, py, pw, ph);
          c.strokeStyle = '#8a5a30'; c.lineWidth = 2; c.strokeRect(px + 14, py + 14, pw - 28, ph - 28);
          G.text(ch.label || (n === 0 ? 'Prologue' : 'Chapter ' + roman(n)), 480, py + 50, { size: 30, bold: true, align: 'center', color: '#7a1e14', shadow: false });
          if (ch.zh) G.text(ch.zh, 480, py + 96, { size: 22, align: 'center', color: '#5a3a20', shadow: false });
          c.fillStyle = '#7a1e14'; c.fillRect(380, py + 140, 200, 2);
          var lines = ch.title;
          lines.forEach(function (ln, i) {
            var wl = G.wrap(ln, pw - 120, 26);
            wl.forEach(function (l2, j) { G.text(l2, 480, py + 180 + i * 96 + j * 34, { size: 26, align: 'center', color: '#2a1a0e', shadow: false }); });
          });
          if (ch.chapters) G.text('(after the novel, ch. ' + ch.chapters + ')', 480, py + ph - 60, { size: 17, align: 'center', color: '#7a5a3a', shadow: false });
          // seal
          c.fillStyle = 'rgba(160,30,20,0.85)'; c.fillRect(px + pw - 90, py + ph - 100, 54, 54);
          G.text('忠義', px + pw - 63, py + ph - 92, { size: 20, bold: true, align: 'center', color: '#f6e6c4', shadow: false });
          c.globalAlpha = 1;
        }
      };
      UI.push(w);
    });
  };
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
      var w = {
        update: function () {
          if (WM.time - t0 > 2 && (I.pressed('ok') || I.pressed('cancel'))) { I.clear(); UI.remove(w); WM.script.running = 0; WM.setScene(WM.scenes.title); resolve(); }
        },
        draw: function () {
          var c = G.ctx; c.fillStyle = '#000'; c.fillRect(0, 0, WM.W, WM.H);
          c.globalAlpha = U.clamp((WM.time - t0) / 1.5, 0, 1);
          G.text('The heroes have fallen.', 480, 300, { size: 36, bold: true, align: 'center', color: '#c04030' });
          G.text('Heaven\'s mandate is not yet fulfilled...', 480, 360, { size: 22, align: 'center', color: '#a09080' });
          c.globalAlpha = 1;
        }
      };
      G.fade = 0;
      UI.push(w);
    });
  };
})();
