// UI widget stack: message boxes, choices, lists, notices. Widgets get input from the top of the stack.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util;
  var UI = WM.ui = { stack: [] };

  UI.push = function (w) { UI.stack.push(w); return w; };
  UI.remove = function (w) { var i = UI.stack.indexOf(w); if (i >= 0) UI.stack.splice(i, 1); };
  UI.top = function () { return UI.stack[UI.stack.length - 1]; };
  UI.busy = function () { return UI.stack.length > 0; };
  UI.update = function (dt) {
    for (var i = 0; i < UI.stack.length; i++) if (UI.stack[i].tick) UI.stack[i].tick(dt);
    var t = UI.top(); if (t && t.update) t.update(dt);
  };
  UI.draw = function () { for (var i = 0; i < UI.stack.length; i++) if (UI.stack[i].draw) UI.stack[i].draw(); };

  // ---------------- Message box ----------------
  // speaker: char id (portrait + name), or {name, portrait?} or null for narration.
  function resolveSpeaker(sp) {
    if (!sp) return null;
    if (typeof sp === 'string') {
      var expr = 'normal', id = sp;
      if (sp.indexOf(':') > 0) { id = sp.split(':')[0]; expr = sp.split(':')[1]; }
      var ch = WM.data.chars[id];
      if (ch) return { name: ch.name, portrait: id, expr: expr };
      var npc = WM.data.npcs && WM.data.npcs[id];
      if (npc) return { name: npc.name, portrait: npc.face ? id : null, expr: expr, npc: npc };
      return { name: sp };
    }
    return sp;
  }
  UI.resolveSpeaker = resolveSpeaker;

  UI.message = function (speaker, text, opt) {
    opt = opt || {};
    var pendingSpeaker = resolveSpeaker(speaker);
    var portraitId = WM.portraits.resolveId(pendingSpeaker && pendingSpeaker.portrait);
    var sheet = WM.portraits.sheetSpec(portraitId);
    if (sheet && !WM.portraits.sheetSettled[portraitId]) {
      return WM.portraits.tryExpressionSheet(portraitId, sheet).then(function () {
        return UI.message(speaker, text, opt);
      });
    }
    return new Promise(function (resolve) {
      var sp = resolveSpeaker(speaker);
      var hasPortrait = sp && sp.portrait;
      var boxX = 24, boxW = WM.W - 48, boxH = 196, boxY = opt.top ? 20 : WM.H - boxH - 18;
      var textX = boxX + (hasPortrait ? 190 : 34), textW = boxW - (hasPortrait ? 214 : 68);
      var named = !!(sp && sp.name), textY = boxY + (named ? 60 : 26);   // the name sits level with the top of the portrait; text below it
      var pages = paginate(text, textW, 25, named ? 4 : 5);
      var page = 0, shown = 0, speed = opt.speed || 55, blipT = 0;
      var w = {
        update: function (dt) {
          var full = pages[page].join('\n').length;
          if (shown < full) {
            shown += dt * speed;
            blipT -= dt;
            if (blipT <= 0 && WM.audio) { WM.audio.blip(sp && sp.portrait ? 1 : 0); blipT = 0.06; }
            if (I.pressed('ok') || I.pressed('cancel')) { shown = full; I.clear(); }
          } else if (I.pressed('ok') || I.pressed('cancel')) {
            I.clear();
            if (page < pages.length - 1) { page++; shown = 0; }
            else { UI.remove(w); resolve(); }
          }
        },
        draw: function () {
          G.window(boxX, boxY, boxW, boxH);
          if (hasPortrait) {
            WM.portraits.drawFramed(sp.portrait, sp.expr, boxX + 20, boxY + 14);
          }
          if (named) drawName(sp.name, textX, boxY + 14, textW);
          var lines = pages[page], left = Math.floor(shown);
          for (var i = 0; i < lines.length; i++) {
            if (left <= 0) break;
            var s = lines[i].substring(0, left);
            left -= lines[i].length + 1;
            G.text(s, textX, textY + i * 33, { size: 25, color: opt.color });
          }
          var full = pages[page].join('\n').length;
          if (shown >= full) {
            var bob = Math.sin(WM.time * 6) * 3;
            var c = G.ctx; c.fillStyle = G.COL.gold;
            c.beginPath(); var ax = boxX + boxW - 34, ay = boxY + boxH - 26 + bob;
            c.moveTo(ax - 8, ay - 5); c.lineTo(ax + 8, ay - 5); c.lineTo(ax, ay + 4); c.closePath(); c.fill();
          }
        }
      };
      UI.push(w);
    });
  };

  function paginate(text, w, size, maxLines) {
    var lines = G.wrap(text, w, size);
    var pages = [];
    for (var i = 0; i < lines.length; i += maxLines) pages.push(lines.slice(i, i + maxLines));
    return pages.length ? pages : [['']];
  }

  // Narration: the storyteller's voice, on a scroll-like panel at the top of the screen.
  UI.narrate = function (text, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var boxW = 760, x = (WM.W - boxW) / 2;
      var lines = G.wrap(text, boxW - 80, 25);
      var pages = [];
      for (var i = 0; i < lines.length; i += 7) pages.push(lines.slice(i, i + 7));
      var page = 0, alpha = 0;
      var w = {
        update: function (dt) {
          alpha = Math.min(1, alpha + dt * 3);
          if (alpha >= 1 && (I.pressed('ok') || I.pressed('cancel'))) {
            I.clear();
            if (page < pages.length - 1) { page++; alpha = 0.3; }
            else { UI.remove(w); resolve(); }
          }
        },
        draw: function () {
          var ls = pages[page];
          var h = ls.length * 34 + 60;
          var y = opt.y != null ? opt.y : 24;   // at the top, clear of the scene being told
          var c = G.ctx;
          c.save(); c.globalAlpha = alpha;
          // paper scroll
          c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(x + 6, y + 6, boxW, h);
          var gr = c.createLinearGradient(0, y, 0, y + h);
          gr.addColorStop(0, '#efe4c8'); gr.addColorStop(1, '#ddcfa8');
          c.fillStyle = gr; c.fillRect(x, y, boxW, h);
          c.fillStyle = '#5a3a20'; c.fillRect(x - 10, y - 6, 10, h + 12); c.fillRect(x + boxW, y - 6, 10, h + 12);
          c.fillStyle = '#8a5a30'; c.fillRect(x - 8, y - 4, 4, h + 8); c.fillRect(x + boxW + 2, y - 4, 4, h + 8);
          c.strokeStyle = 'rgba(120,80,40,0.5)'; c.lineWidth = 1; c.strokeRect(x + 10, y + 10, boxW - 20, h - 20);
          for (var i = 0; i < ls.length; i++) G.text(ls[i], x + 40, y + 30 + i * 34, { size: 25, color: '#2a1a0e', shadow: false });
          if (alpha >= 1) { c.fillStyle = '#9a2a1a'; c.fillRect(x + boxW - 30, y + h - 26 + Math.sin(WM.time * 6) * 2, 10, 10); }
          c.restore();
        }
      };
      UI.push(w);
    });
  };

  // ---------------- Generic list menu ----------------
  // items: [{label, value, disabled, right, color, help}] ; opt: x,y,w,title,cancel(bool),rows
  UI.List = function (items, opt) {
    this.items = items; this.opt = opt || {};
    this.idx = this.opt.index || 0; this.scroll = 0;
    this.rows = this.opt.rows || Math.min(items.length, 9);
    this.rowH = this.opt.rowH || 38;
    this.w = this.opt.w || 300;
    if (this.opt.title) this.w = Math.max(this.w, G.measure(this.opt.title, 22, true) + 48);   // the title fits inside the frame
    this.x = this.opt.x == null ? (WM.W - this.w) / 2 : Math.min(this.opt.x, WM.W - this.w - 8);
    this.h = this.rows * this.rowH + 32 + (this.opt.title ? 40 : 0);
    this.y = this.opt.y == null ? (WM.H - this.h) / 2 : this.opt.y;
    this.active = true;
    while (this.items[this.idx] && this.items[this.idx].disabled && this.opt.skipDisabled && this.idx < this.items.length - 1) this.idx++;
  };
  UI.List.prototype.handle = function () {
    // returns: undefined (nothing), {ok: item}, {cancel: true}
    var n = this.items.length;
    if (!n) { if (I.pressed('cancel')) { I.clear(); return { cancel: true }; } return; }
    var cols = this.opt.cols || 1;
    if (I.pressed('up')) { this.idx = (this.idx - cols + n) % n; WM.audio && WM.audio.sfx('cursor'); }
    if (I.pressed('down')) { this.idx = (this.idx + cols) % n; WM.audio && WM.audio.sfx('cursor'); }
    if (cols > 1) {
      if (I.pressed('left')) { this.idx = (this.idx - 1 + n) % n; WM.audio && WM.audio.sfx('cursor'); }
      if (I.pressed('right')) { this.idx = (this.idx + 1) % n; WM.audio && WM.audio.sfx('cursor'); }
    }
    var visRow = Math.floor(this.idx / cols);
    if (visRow < this.scroll) this.scroll = visRow;
    if (visRow >= this.scroll + this.rows) this.scroll = visRow - this.rows + 1;
    if (I.pressed('ok')) {
      I.clear();
      var it = this.items[this.idx];
      if (it.disabled) { WM.audio && WM.audio.sfx('buzz'); return; }
      WM.audio && WM.audio.sfx('ok');
      return { ok: it, index: this.idx };
    }
    if (I.pressed('cancel') && this.opt.cancel !== false) { I.clear(); WM.audio && WM.audio.sfx('cancel'); return { cancel: true }; }
  };
  UI.List.prototype.draw = function () {
    var o = this.opt;
    G.window(this.x, this.y, this.w, this.h, o.style);
    var y0 = this.y + 18;
    if (o.title) { G.text(o.title, this.x + 22, this.y + 14, { size: 22, bold: true, color: G.COL.gold }); y0 += 40; }
    var cols = o.cols || 1, colW = (this.w - 40) / cols;
    for (var r = 0; r < this.rows; r++) for (var cI = 0; cI < cols; cI++) {
      var i = (this.scroll + r) * cols + cI;
      var it = this.items[i]; if (!it) continue;
      var ix = this.x + 20 + cI * colW, iy = y0 + r * this.rowH;
      if (i === this.idx && this.active) {
        G.ctx.fillStyle = G.COL.select; G.ctx.fillRect(ix + 4, iy - 2, colW - 8, this.rowH - 4);
      }
      if (it.icon) it.icon(ix + 30, iy + this.rowH / 2 - 2);
      G.text(it.label, ix + (it.icon ? 58 : 34), iy + 4, { size: o.size || 24, color: it.disabled ? G.COL.dim : (it.color || G.COL.text) });
      if (it.right != null) G.text(String(it.right), ix + colW - 14, iy + 4, { size: o.size || 24, align: 'right', color: it.disabled ? G.COL.dim : (it.rightColor || G.COL.text) });
      if (i === this.idx && this.active) G.cursor(ix + 6, iy + this.rowH / 2 - 3);
    }
    var totalRows = Math.ceil(this.items.length / cols);
    if (totalRows > this.rows) {
      var c = G.ctx; c.fillStyle = G.COL.gold;
      if (this.scroll > 0) { c.beginPath(); c.moveTo(this.x + this.w / 2 - 8, y0 - 4); c.lineTo(this.x + this.w / 2 + 8, y0 - 4); c.lineTo(this.x + this.w / 2, y0 - 12); c.fill(); }
      if (this.scroll + this.rows < totalRows) { var by = y0 + this.rows * this.rowH; c.beginPath(); c.moveTo(this.x + this.w / 2 - 8, by - 2); c.lineTo(this.x + this.w / 2 + 8, by - 2); c.lineTo(this.x + this.w / 2, by + 6); c.fill(); }
    }
    if (o.help && this.items[this.idx] && this.items[this.idx].help) {
      var hl = G.wrap(this.items[this.idx].help, this.w - 40, 20);   // long descriptions wrap inside the box
      G.window(this.x, this.y + this.h + 6, this.w, 28 + hl.length * 25);
      for (var hi = 0; hi < hl.length; hi++) G.text(hl[hi], this.x + 20, this.y + this.h + 20 + hi * 25, { size: 20, color: G.COL.text });
    }
  };

  // Promise-returning choice: resolves to index or -1 on cancel (if allowed).
  UI.choose = function (options, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var items = options.map(function (o, i) { return typeof o === 'string' ? { label: o, value: i } : o; });
      var wMax = 0; items.forEach(function (it) { wMax = Math.max(wMax, G.measure(it.label, 24) + (it.right != null ? G.measure(String(it.right), 24) + 30 : 0)); });
      var list = new UI.List(items, { w: Math.max(opt.w || 0, wMax + 80), x: opt.x, y: opt.y == null ? WM.H - 196 - 18 - items.length * 38 - 50 : opt.y, title: opt.title, cancel: opt.cancel !== false, rows: Math.min(items.length, opt.rows || 8), help: opt.help });
      if (opt.x == null) list.x = WM.W - list.w - 40;
      var w = {
        update: function () {
          var r = list.handle();
          if (!r) return;
          if (r.cancel) { if (opt.cancel === false) return; UI.remove(w); resolve(-1); }
          else { UI.remove(w); resolve(r.index); }
        },
        draw: function () { list.draw(); }
      };
      UI.push(w);
    });
  };

  // Ask a question with a speaker line kept visible above the choices.
  UI.ask = function (speaker, text, options, opt) {
    return new Promise(function (resolve) {
      var sp = resolveSpeaker(speaker);
      var shown = false;
      var msgW = { draw: function () { drawStaticMessage(sp, text); } };
      UI.push(msgW);
      UI.choose(options, opt).then(function (i) { UI.remove(msgW); resolve(i); });
    });
  };
  // the speaker's name, in gold, with a thin rule under it, at the top of the text column
  function drawName(name, x, y, w) {
    G.text(name, x, y, { size: 23, bold: true, color: G.COL.gold });
    // the rule is as long as the name, and sits halfway between the name's baseline (y+18) and the first line (y+46)
    var c = G.ctx; c.fillStyle = 'rgba(216,179,106,0.45)'; c.fillRect(x, y + 32, Math.min(w, G.measure(name, 23, true)), 1);
  }
  function drawStaticMessage(sp, text) {
    var hasPortrait = sp && sp.portrait;
    var boxX = 24, boxW = WM.W - 48, boxH = 196, boxY = WM.H - boxH - 18;
    var textX = boxX + (hasPortrait ? 190 : 34), textW = boxW - (hasPortrait ? 214 : 68);
    G.window(boxX, boxY, boxW, boxH);
    if (hasPortrait) WM.portraits.drawFramed(sp.portrait, sp.expr, boxX + 20, boxY + 14);
    var named = !!(sp && sp.name), textY = boxY + (named ? 60 : 26);
    if (named) drawName(sp.name, textX, boxY + 14, textW);
    var lines = G.wrap(text, textW, 25);
    for (var i = 0; i < Math.min(named ? 4 : 5, lines.length); i++) G.text(lines[i], textX, textY + i * 33, { size: 25 });
  }

  // Short centred notice ("Lin Chong joined!"), auto or ok-dismissed.
  UI.notice = function (text, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var t = 0;
      var w = {
        update: function (dt) {
          t += dt;
          if ((opt.auto && t > opt.auto) || (t > 0.25 && (I.pressed('ok') || I.pressed('cancel')))) { I.clear(); UI.remove(w); resolve(); }
        },
        draw: function () {
          G.font(26, 'bold');
          var tw = G.measure(text, 26, true) + 80;
          var x = (WM.W - tw) / 2, y = opt.y || 260;
          G.window(x, y, tw, 64, opt.style);
          G.text(text, WM.W / 2, y + 18, { size: 26, bold: true, align: 'center', color: opt.color || G.COL.gold });
        }
      };
      UI.push(w);
    });
  };

  // Floating toast that doesn't block (e.g. "Obtained Medicine x2").
  UI.toasts = [];
  UI.toast = function (text, col) { UI.toasts.push({ text: text, t: 2.2, col: col }); };
  UI.drawToasts = function (dt) {
    var y = 24;
    for (var i = 0; i < UI.toasts.length; i++) {
      var to = UI.toasts[i];
      to.t -= dt;
      var a = U.clamp(to.t * 2, 0, 1);
      G.ctx.globalAlpha = a;
      var tw = G.measure(to.text, 22) + 40;
      G.window(WM.W - tw - 20, y, tw, 44);
      G.text(to.text, WM.W - tw, y + 22 + 1, { size: 22, baseline: 'middle', color: to.col || G.COL.text });   // centred in the plate
      G.ctx.globalAlpha = 1;
      y += 50;
    }
    UI.toasts = UI.toasts.filter(function (t) { return t.t > 0; });
  };
})();
