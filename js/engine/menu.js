// Field menu: items, equipment, status, formation, the Stone Tablet, options, saving.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var M = WM.menu = {};

  M.open = function () {
    WM.audio.sfx('ok');
    WM.script.run(async function () { await mainMenu(); });
  };

  function partyPanel(selIdx, x, y) {
    var p = WM.state.party;
    G.window(x, y, 560, 6 * 92 + 28);
    for (var i = 0; i < 6; i++) {
      var id = p[i], yy = y + 16 + i * 92;
      if (i === 3) { G.ctx.fillStyle = 'rgba(216,179,106,0.35)'; G.ctx.fillRect(x + 20, yy - 6, 520, 1); }
      if (!id) { G.text(i < 3 ? '— front —' : '— back —', x + 280, yy + 30, { size: 18, align: 'center', color: '#555' }); continue; }
      var c = WM.state.chars[id], d = S.def(id), st = S.stats(id);
      if (selIdx === i) { G.ctx.fillStyle = G.COL.select; G.ctx.fillRect(x + 12, yy - 4, 536, 86); }
      var img = WM.portraits.get(id, c.hp <= 0 ? 'sad' : 'normal');
      var cx = G.ctx;
      cx.save(); cx.beginPath(); cx.rect(x + 22, yy, 64, 76); cx.clip(); cx.fillStyle = '#26304a'; cx.fillRect(x + 22, yy, 64, 76);
      if (img.isOverride) cx.drawImage(img, 0, 0, img.width, img.height * 0.75, x + 22, yy, 64, 76); else cx.drawImage(img, 8, 4, 32, 38, x + 22, yy, 64, 76);
      cx.restore();
      G.text(d.name, x + 100, yy + 2, { size: 22, bold: true, color: c.hp <= 0 ? '#c06050' : G.COL.text });
      G.text('LV ' + c.lv, x + 330, yy + 4, { size: 20 });
      G.text((i < 3 ? 'Front' : 'Back') + ' · ' + st.range, x + 530, yy + 4, { size: 18, align: 'right', color: G.COL.dim });
      G.text('HP ' + c.hp + '/' + st.mhp, x + 100, yy + 34, { size: 19, color: G.hpColor(c.hp / st.mhp) });
      G.bar(x + 100, y + 16 + i * 92 + 60, 220, 8, c.hp / st.mhp, G.hpColor(c.hp / st.mhp));
      G.text('EXP ' + c.exp, x + 330, yy + 34, { size: 18, color: G.COL.dim });
      if (B_spells(id)) G.text('MP ' + c.mp.join('/'), x + 330, yy + 56, { size: 17, color: '#a0c0ff' });
    }
  }
  function B_spells(id) { var c = WM.state.chars[id]; return ['head', 'rhand', 'lhand'].some(function (s) { var t = c.tal[s] && WM.data.talismans[c.tal[s]]; return t && t.spells; }); }

  function infoBar() {
    G.window(600, 600, 344, 104);
    G.text(WM.state.gold + ' taels', 920, 616, { size: 22, align: 'right', color: G.COL.gold });
    G.text(U.fmtTime(WM.state.playtime), 920, 648, { size: 20, align: 'right', color: G.COL.dim });
    var mp = WM.data.maps[WM.state.map]; if (mp && mp.name) G.text(mp.name, 620, 648, { size: 18, color: G.COL.dim });
    if (WM.state.flags.castle) G.text(S.starCount() + ' / 108 Stars', 620, 616, { size: 20, color: '#ffe0a0' });
  }

  function mainMenu() {
    return new Promise(function (resolve) {
      var items = [
        { label: 'Items', v: 'items' }, { label: 'Equipment', v: 'equip' }, { label: 'Status', v: 'status' },
        { label: 'Formation', v: 'form' }
      ];
      if (WM.state.flags.castle) items.push({ label: 'Stone Tablet', v: 'tablet' });
      if (WM.state.flags.castle) items.push({ label: 'Liangshan', v: 'castle' });
      items.push({ label: 'Options', v: 'opts' });
      if (WM.debug && WM.debug.enabled) items.push({ label: 'Debug', v: 'debug' });
      var list = new UI.List(items, { x: 600, y: 20, w: 344 });
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          UI.remove(w);
          var v = r.ok.v;
          var back = function () { UI.push(w); };
          if (v === 'items') itemsMenu().then(back);
          else if (v === 'equip') pickMember('Equip whom?').then(function (id) { return id ? equipMenu(id) : null; }).then(back);
          else if (v === 'status') pickMember('Whose status?').then(function (id) { return id ? M.status(id) : null; }).then(back);
          else if (v === 'form') formation().then(back);
          else if (v === 'tablet') M.tablet().then(back);
          else if (v === 'castle') castleInfo().then(back);
          else if (v === 'opts') options().then(back);
          else if (v === 'debug') { WM.debug.open(); resolve(); }
        },
        draw: function () { partyPanel(-1, 16, 16); list.draw(); infoBar(); }
      };
      UI.push(w);
    });
  }

  function pickMember(title, opt) {
    opt = opt || {};
    return new Promise(function (resolve) {
      var idx = opt.start || 0;
      var p = WM.state.party;
      var w = {
        update: function () {
          if (I.pressed('up')) { idx = (idx + p.length - 1) % p.length; WM.audio.sfx('cursor'); }
          if (I.pressed('down')) { idx = (idx + 1) % p.length; WM.audio.sfx('cursor'); }
          if (I.pressed('ok')) { I.clear(); WM.audio.sfx('ok'); UI.remove(w); resolve(p[idx]); }
          if (I.pressed('cancel')) { I.clear(); WM.audio.sfx('cancel'); UI.remove(w); resolve(null); }
        },
        draw: function () {
          partyPanel(idx, 16, 16);
          G.window(600, 20, 344, 60); G.text(title, 620, 36, { size: 22, color: G.COL.gold });
          G.cursor(24, 16 + 16 + idx * 92 + 38);
          infoBar();
        }
      };
      UI.push(w);
    });
  }
  M.pickMember = pickMember;

  // ---------- items ----------
  function itemsMenu() {
    return new Promise(function (resolve) {
      var tab = 0, tabs = ['Use', 'Equip', 'Valuables'];
      var filterFor = function () {
        return tab === 0 ? function (it) { return it.type === 'use'; } : tab === 1 ? function (it) { return ['head', 'body', 'shield', 'acc'].indexOf(it.type) >= 0; } : function (it) { return it.type === 'key'; };
      };
      var build = function () {
        var inv = S.invList(filterFor());
        return new UI.List(inv.map(function (e) { return { label: e.it.name, right: e.n, help: e.it.desc, e: e }; }), { x: 120, y: 90, w: 720, rows: 10, help: true });
      };
      var list = build();
      var w = {
        update: function () {
          if (I.pressed('left') || I.pressed('pageL')) { tab = (tab + 2) % 3; list = build(); WM.audio.sfx('cursor'); }
          if (I.pressed('right') || I.pressed('pageR')) { tab = (tab + 1) % 3; list = build(); WM.audio.sfx('cursor'); }
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          var e = r.ok.e;
          if (e.it.type === 'use' && e.it.field) {
            UI.remove(w);
            var after = function () { var k = list.idx; list = build(); list.idx = Math.min(k, Math.max(0, list.items.length - 1)); UI.push(w); };
            if (e.it.field === 'allyAll') { useField(e.id, null); after(); }
            else pickMember('Use ' + e.it.name + ' on?').then(function (id) { if (id) useField(e.id, id); after(); });
          } else WM.audio.sfx('buzz');
        },
        draw: function () {
          G.window(120, 20, 720, 60);
          tabs.forEach(function (t, i) { G.text(t, 200 + i * 220, 36, { size: 24, bold: i === tab, color: i === tab ? G.COL.gold : G.COL.dim, align: 'center' }); });
          G.text('◀ ▶', 800, 38, { size: 18, color: G.COL.dim, align: 'right' });
          list.draw();
          if (!list.items.length) G.text('Nothing here.', 480, 140, { size: 22, color: G.COL.dim, align: 'center' });
        }
      };
      UI.push(w);
    });
  }
  function useField(itemId, id) {
    var it = WM.data.items[itemId], e = it.effect || {};
    var targets = id ? [id] : WM.state.party.slice();
    var used = false;
    targets.forEach(function (tid) {
      var c = WM.state.chars[tid], st = S.stats(tid);
      if (e.revive && c.hp <= 0) { c.hp = Math.round(st.mhp * e.revive); used = true; }
      if (e.heal && c.hp > 0 && c.hp < st.mhp) { c.hp = Math.min(st.mhp, c.hp + (e.heal === 'full' ? st.mhp : e.heal)); used = true; }
      if (e.cure) { e.cure.forEach(function (k) { if (c.status[k]) { delete c.status[k]; used = true; } }); }
      if (e.mp) { var mm = S.maxMp(tid); for (var i = 0; i < 4; i++) c.mp[i] = mm[i]; used = true; }
    });
    if (used) { S.take(itemId, 1); WM.audio.sfx('heal'); } else WM.audio.sfx('buzz');
  }

  // ---------- equipment ----------
  var SLOTS = [['head', 'Head'], ['body', 'Body'], ['shield', 'Shield'], ['acc', 'Other']];
  function canEquip(id, it) {
    if (!it.who) return true;
    var d = S.def(id);
    if (it.who === 'women') return !!d.female;
    if (it.who === 'men') return !d.female;
    if (Array.isArray(it.who)) return it.who.indexOf(d.cls) >= 0 || it.who.indexOf(id) >= 0;
    return true;
  }
  function equipMenu(id) {
    return new Promise(function (resolve) {
      var c = WM.state.chars[id];
      var mk = function () { return new UI.List(SLOTS.map(function (s) { var it = c.equip[s[0]] && WM.data.items[c.equip[s[0]]]; return { label: s[1], right: it ? it.name : '—', slot: s[0] }; }), { x: 400, y: 120, w: 520 }); };
      var list = mk();
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          var slot = r.ok.slot;
          var inv = S.invList(function (it) { return it.type === slot && canEquip(id, it); });
          var opts = [{ label: '(Remove)', v: null }].concat(inv.map(function (e) { return { label: e.it.name, right: '+' + (e.it.def || 0) + ' x' + e.n, v: e.id, help: e.it.desc }; }));
          UI.remove(w);
          UI.choose(opts, { x: 400, y: 320, w: 520, help: true, rows: 7 }).then(function (k) {
            if (k >= 0) {
              var cur = c.equip[slot];
              var nv = opts[k].v;
              if (cur) S.give(cur, 1);
              if (nv) S.take(nv, 1);
              c.equip[slot] = nv;
              var st = S.stats(id); if (c.hp > st.mhp) c.hp = st.mhp;
              WM.audio.sfx('ok');
            }
            list = mk(); UI.push(w);
          });
        },
        draw: function () { drawStatusBox(id, 20, 20); list.draw(); }
      };
      UI.push(w);
    });
  }

  function drawStatusBox(id, x, y) {
    var c = WM.state.chars[id], d = S.def(id), st = S.stats(id);
    G.window(x, y, 360, 680);
    WM.portraits.drawFramed(id, 'normal', x + 108, y + 20);
    G.text(d.name, x + 180, y + 206, { size: 26, bold: true, align: 'center', color: G.COL.gold });
    G.text(d.nick ? '“' + d.nick + '”' : '', x + 180, y + 240, { size: 18, align: 'center', color: '#c8b890' });
    var rows = [['LV', c.lv], ['HP', c.hp + '/' + st.mhp], ['ATK', st.atk], ['DEF', st.dfs]];
    S.STATS.forEach(function (k) { rows.push([S.STAT_NAMES[k], st[k]]); });
    rows.forEach(function (r, i) {
      G.text(r[0], x + 40, y + 280 + i * 34, { size: 20, color: G.COL.dim });
      G.text(String(r[1]), x + 320, y + 280 + i * 34, { size: 20, align: 'right' });
    });
  }

  // ---------- status ----------
  M.status = function (id) {
    return new Promise(function (resolve) {
      var p = WM.state.party, idx = Math.max(0, p.indexOf(id));
      var w = {
        update: function () {
          if (p.length > 1 && (I.pressed('left') || I.pressed('up'))) { idx = (idx + p.length - 1) % p.length; id = p[idx]; WM.audio.sfx('cursor'); }
          if (p.length > 1 && (I.pressed('right') || I.pressed('down'))) { idx = (idx + 1) % p.length; id = p[idx]; WM.audio.sfx('cursor'); }
          if (I.pressed('ok') || I.pressed('cancel')) { I.clear(); UI.remove(w); resolve(); }
        },
        draw: function () { M.drawStatus(id); }
      };
      UI.push(w);
    });
  };
  M.drawStatus = function (id) {
    var c = WM.state.chars[id], d = S.def(id);
    drawStatusBox(id, 20, 20);
    G.window(396, 20, 544, 680);
    var x = 420, y = 40;
    if (d.rank) {
      G.text((d.group === 'heaven' ? 'Heavenly Spirit' : 'Earthly Fiend') + ' · Star ' + d.rank + ' of 108', x, y, { size: 20, color: '#ffe0a0' });
      G.text(d.starEn + ' (' + d.star + ')', x, y + 28, { size: 20, color: '#ffe0a0' });
    } else G.text('Ally', x, y, { size: 20, color: '#ffe0a0' });
    if (d.zh) G.text(d.zh, 920, y, { size: 26, align: 'right', color: G.COL.gold });
    y += 70;
    var wpn = d.weapon || { name: 'Fists', range: 'S' };
    G.text('Weapon', x, y, { size: 20, color: G.COL.dim });
    G.text(wpn.name + '  Lv ' + c.wlv + '  (' + wpn.range + ')', x + 120, y, { size: 20 });
    y += 34;
    G.text('Talismans', x, y, { size: 20, color: G.COL.dim });
    [['head', 'Head'], ['rhand', 'R.Hand'], ['lhand', 'L.Hand']].forEach(function (s, i) {
      var t = c.tal[s[0]] && WM.data.talismans[c.tal[s[0]]];
      G.text(s[1] + ': ' + (t ? t.name : '—'), x + 120, y + i * 28, { size: 19 });
    });
    y += 96;
    G.text('Equipment', x, y, { size: 20, color: G.COL.dim });
    SLOTS.forEach(function (s, i) { var it = c.equip[s[0]] && WM.data.items[c.equip[s[0]]]; G.text(s[1] + ': ' + (it ? it.name : '—'), x + 120, y + i * 28, { size: 19 }); });
    y += 124;
    if (d.role) { G.text('At Liangshan', x, y, { size: 20, color: G.COL.dim }); G.text(d.role, x + 140, y, { size: 19 }); y += 34; }
    var bio = G.wrap(d.bio || '', 500, 19);
    for (var i = 0; i < Math.min(bio.length, 8); i++) G.text(bio[i], x, y + i * 26, { size: 19, color: '#d8d0c0' });
  };

  // ---------- formation ----------
  function formation() {
    return new Promise(function (resolve) {
      var idx = 0, picked = -1, p = WM.state.party;
      var w = {
        update: function () {
          if (I.pressed('up')) { idx = (idx + 5) % 6; WM.audio.sfx('cursor'); }
          if (I.pressed('down')) { idx = (idx + 1) % 6; WM.audio.sfx('cursor'); }
          if (I.pressed('ok')) {
            I.clear();
            if (picked < 0) { if (p[idx]) { picked = idx; WM.audio.sfx('ok'); } }
            else {
              var a = p[picked], b = p[idx];
              // allow moving into empty slots by compacting
              var arr = []; for (var i = 0; i < 6; i++) arr[i] = p[i] || null;
              arr[picked] = b || null; arr[idx] = a;
              WM.state.party = arr.filter(function (x) { return x; });
              // keep explicit gaps impossible: front row fills first
              p = WM.state.party; picked = -1; WM.audio.sfx('ok');
            }
          }
          if (I.pressed('cancel')) { I.clear(); if (picked >= 0) picked = -1; else { UI.remove(w); resolve(); } }
        },
        draw: function () {
          partyPanel(idx, 16, 16);
          G.window(600, 20, 344, 150);
          G.text('Formation', 620, 36, { size: 22, bold: true, color: G.COL.gold });
          G.text('Slots 1–3 fight in the front row.', 620, 72, { size: 18, color: G.COL.dim });
          G.text('S weapons cannot reach', 620, 98, { size: 18, color: G.COL.dim });
          G.text('from the back row.', 620, 122, { size: 18, color: G.COL.dim });
          if (picked >= 0) { G.ctx.strokeStyle = G.COL.gold; G.ctx.lineWidth = 3; G.ctx.strokeRect(26, 16 + 12 + picked * 92, 536, 86); }
          G.cursor(24, 16 + 16 + idx * 92 + 38);
        }
      };
      UI.push(w);
    });
  }

  // ---------- party editing at Liangshan ----------
  M.partyEdit = function () {
    return new Promise(function (resolve) {
      var st = WM.state;
      var pool = function () {
        return st.recruited.filter(function (id) { var d = S.def(id); return d.combat !== false && !st.dead[id] && !st.flags['away:' + id]; });
      };
      var sel = 0;
      var mkList = function () {
        var ids = pool();
        return new UI.List(ids.map(function (id) {
          var d = S.def(id), inP = st.party.indexOf(id) >= 0;
          return { label: (inP ? '★ ' : '   ') + d.name, right: 'LV ' + st.chars[id].lv + ' ' + (d.weapon ? d.weapon.range : ''), id: id, help: d.nick ? '“' + d.nick + '”  ' + (d.weapon ? d.weapon.name : '') : '' };
        }), { x: 600, y: 20, w: 344, rows: 13, rowH: 36, help: true, size: 20 });
      };
      var list = mkList();
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) {
            if (!st.party.length) { WM.audio.sfx('buzz'); return; }
            UI.remove(w); if (st.party.indexOf(st.leader) < 0) WM.field.setLeader(st.party[0]); resolve(); return;
          }
          var id = r.ok.id;
          if (st.party.indexOf(id) >= 0) {
            if (id === st.flags.protagonist) { WM.audio.sfx('buzz'); WM.ui.toast(S.def(id).name + ' must lead the party.'); return; }
            S.removeFromParty(id);
          } else if (st.party.length < 6) { S.addToParty(id); S.restore(id); }
          else { WM.audio.sfx('buzz'); WM.ui.toast('The party is full (six heroes).'); return; }
          var k = list.idx; list = mkList(); list.idx = k;
        },
        draw: function () { partyPanel(-1, 16, 16); list.draw(); }
      };
      UI.push(w);
    });
  };

  // ---------- the Stone Tablet (108 Stars) ----------
  M.tablet = function () {
    return new Promise(function (resolve) {
      var order = WM.data.charOrder;
      var idx = 0, scroll = 0, ROWS = 12;
      var w = {
        update: function () {
          if (I.pressed('up')) { idx = (idx + 107) % 108; WM.audio.sfx('cursor'); }
          if (I.pressed('down')) { idx = (idx + 1) % 108; WM.audio.sfx('cursor'); }
          if (I.pressed('left')) { idx = Math.max(0, idx - ROWS); WM.audio.sfx('cursor'); }
          if (I.pressed('right')) { idx = Math.min(107, idx + ROWS); WM.audio.sfx('cursor'); }
          if (idx < scroll) scroll = idx;
          if (idx >= scroll + ROWS) scroll = idx - ROWS + 1;
          if (I.pressed('cancel') || I.pressed('ok')) { I.clear(); UI.remove(w); resolve(); }
        },
        draw: function () {
          var c = G.ctx;
          // stone slab
          var gr = c.createLinearGradient(0, 0, 0, WM.H);
          gr.addColorStop(0, '#5a5a58'); gr.addColorStop(1, '#3a3a38');
          c.fillStyle = gr; c.fillRect(20, 20, 920, 680);
          c.strokeStyle = '#2a2a28'; c.lineWidth = 6; c.strokeRect(23, 23, 914, 674);
          G.text('The Stone Tablet of Heaven', 480, 34, { size: 28, bold: true, align: 'center', color: '#e8d8a0' });
          G.text(S.starCount() + ' of 108 Stars gathered', 480, 70, { size: 20, align: 'center', color: '#c8c0a0' });
          for (var r = 0; r < ROWS; r++) {
            var i = scroll + r; if (i >= 108) break;
            var id = order[i], d = WM.data.chars[id];
            var got = S.isRecruited(id), dead = WM.state.dead[id];
            var y = 110 + r * 46;
            if (i === idx) { c.fillStyle = 'rgba(255,230,160,0.15)'; c.fillRect(40, y - 4, 500, 42); }
            G.text((i + 1) + '.', 90, y + 4, { size: 20, align: 'right', color: '#c8c0a0' });
            G.text(got ? d.starEn : '?????', 110, y + 4, { size: 20, color: got ? (dead ? '#8a6a6a' : '#f0e0b0') : '#7a7a74' });
            G.text(got ? d.name : '', 520, y + 4, { size: 20, align: 'right', color: dead ? '#a07070' : '#ffffff', shadow: true });
          }
          var sel = order[idx], sd = WM.data.chars[sel];
          if (S.isRecruited(sel)) {
            WM.portraits.drawFramed(sel, WM.state.dead[sel] ? 'sad' : 'normal', 650, 130);
            G.text(sd.name + (sd.zh ? '  ' + sd.zh : ''), 720, 320, { size: 24, bold: true, align: 'center', color: '#f0e0b0' });
            G.text('“' + sd.nick + '”', 720, 352, { size: 19, align: 'center', color: '#e8e0d0' });
            G.text(sd.star, 720, 380, { size: 18, align: 'center', color: '#c8c0a0' });
            if (sd.role) G.text(sd.role, 720, 408, { size: 18, align: 'center', color: '#c8c0a0' });
            if (WM.state.dead[sel]) G.text(WM.state.deathNotes && WM.state.deathNotes[sel] || 'Fell in the southern campaign.', 720, 440, { size: 17, align: 'center', color: '#d0a0a0' });
            var bio = G.wrap(sd.bio || '', 340, 17);
            for (var k = 0; k < Math.min(8, bio.length); k++) G.text(bio[k], 560, 470 + k * 24, { size: 17, color: '#e0d8c8' });
          } else {
            G.text('This star has not yet appeared.', 720, 300, { size: 20, align: 'center', color: '#a0a098' });
          }
        }
      };
      UI.push(w);
    });
  };

  function castleInfo() {
    var st = WM.state, n = S.starCount();
    var lvl = WM.castle ? WM.castle.level() : 1;
    var text = 'Liangshan Marsh — fortress level ' + lvl + '. ' + n + ' of the 108 Stars have gathered. ' + (WM.castle ? WM.castle.nextHint() : '');
    return UI.message(null, text);
  }

  // ---------- options ----------
  function options() {
    return new Promise(function (resolve) {
      var o = WM.state.opts;
      var mk = function () {
        return new UI.List([
          { label: 'Music', right: Math.round(o.music * 10), k: 'music' },
          { label: 'Sound', right: Math.round(o.sfx * 10), k: 'sfx' },
          { label: 'Text speed', right: o.textSpeed >= 90 ? 'Fast' : o.textSpeed >= 55 ? 'Normal' : 'Slow', k: 'text' },
          { label: 'Done', k: 'done' }
        ], { x: 300, y: 200, w: 360 });
      };
      var list = mk();
      var w = {
        update: function () {
          var it = list.items[list.idx];
          var d = I.pressed('right') ? 1 : I.pressed('left') ? -1 : 0;
          if (d && it.k === 'music') { o.music = U.clamp(o.music + d * 0.1, 0, 1); WM.audio.setVolumes(o.music, o.sfx); list = mk(); list.idx = 0; }
          if (d && it.k === 'sfx') { o.sfx = U.clamp(o.sfx + d * 0.1, 0, 1); WM.audio.setVolumes(o.music, o.sfx); WM.audio.sfx('ok'); list = mk(); list.idx = 1; }
          if (d && it.k === 'text') { var sp = [30, 55, 100]; var i = sp.indexOf(o.textSpeed); i = U.clamp((i < 0 ? 1 : i) + d, 0, 2); o.textSpeed = sp[i]; list = mk(); list.idx = 2; }
          var r = list.handle(); if (!r) return;
          if (r.cancel || r.ok.k === 'done') { UI.remove(w); resolve(); }
        },
        draw: function () { list.draw(); }
      };
      UI.push(w);
    });
  }

  // ---------- save ----------
  M.saveMenu = function (loadMode) {
    return new Promise(function (resolve) {
      var mk = function () {
        var items = [];
        for (var i = 0; i < S.SLOTS; i++) {
          var p = S.peek(i);
          items.push({ label: 'Record ' + (i + 1) + (p ? '   ' + (p.chapterTitle || '') : '   — empty —'), right: p ? U.fmtTime(p.time) : '', slot: i, disabled: loadMode && !p, help: p ? (WM.data.chars[p.leader] ? WM.data.chars[p.leader].name : '') + (p.mapName ? ' · ' + p.mapName : '') + (p.stars ? ' · ' + p.stars + ' Stars' : '') : '' });
        }
        return new UI.List(items, { x: 120, y: 60, w: 720, rows: 8, help: true, title: loadMode ? 'Load which record?' : 'Write in which record?' });
      };
      var list = mk();
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(false); return; }
          var slot = r.ok.slot;
          if (loadMode) { UI.remove(w); resolve(slot); return; }
          UI.remove(w);
          var go = function () {
            WM.state.x = Math.floor(WM.field.player.x / 16); WM.state.y = Math.floor((WM.field.player.y - 1) / 16); WM.state.dir = WM.field.player.dir;
            if (S.save(slot)) { WM.audio.sfx('save'); UI.notice('The record has been written.', { auto: 1.2 }).then(function () { resolve(true); }); }
            else UI.notice('Could not save (storage unavailable).').then(function () { resolve(false); });
          };
          if (S.peek(slot)) UI.ask(null, 'Overwrite this record?', ['Yes', 'No']).then(function (k) { if (k === 0) go(); else { list = mk(); UI.push(w); } });
          else go();
        },
        draw: function () { list.draw(); }
      };
      UI.push(w);
    });
  };
})();
