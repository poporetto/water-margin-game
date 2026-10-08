// Shops, inns, blacksmiths (weapon sharpening) and talisman masters.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var SH = WM.shops = {};

  function goldBox() {
    G.window(700, 20, 240, 56);
    G.text(WM.state.gold + ' taels', 920, 34, { size: 22, align: 'right', color: G.COL.gold });
  }

  SH.open = function (id) {
    var shop = WM.data.shops[id];
    if (!shop) throw new Error('No shop ' + id);
    return (async function () {
      while (true) {
        var k = await UI.choose(['Buy', 'Sell', 'Leave'], { x: 40, y: 40, title: shop.name });
        if (k === 0) await buy(shop);
        else if (k === 1) await sell();
        else return;
      }
    })();
  };

  function partyCompare(itemId) {
    var it = WM.data.items[itemId];
    if (['head', 'body', 'shield', 'acc'].indexOf(it.type) < 0) return;
    var p = WM.state.party;
    G.window(40, 400, 620, 300);
    G.text('Party', 60, 414, { size: 20, color: G.COL.gold });
    p.forEach(function (id, i) {
      var cur = WM.state.chars[id].equip[it.type];
      var cd = cur ? (WM.data.items[cur].def || 0) : 0;
      var diff = (it.def || 0) - cd;
      var ok = !it.who || (it.who === 'women' ? S.def(id).female : it.who === 'men' ? !S.def(id).female : (Array.isArray(it.who) && (it.who.indexOf(S.def(id).cls) >= 0 || it.who.indexOf(id) >= 0)));
      G.text(S.def(id).name, 60, 450 + i * 38, { size: 20, color: ok ? G.COL.text : G.COL.dim });
      G.text(ok ? (diff > 0 ? '+' + diff : diff < 0 ? String(diff) : '=') : 'Cannot equip', 640, 450 + i * 38, { size: 20, align: 'right', color: !ok ? G.COL.dim : diff > 0 ? G.COL.green : diff < 0 ? G.COL.red : G.COL.text });
    });
  }

  function buy(shop) {
    return new Promise(function (resolve) {
      var items = shop.items.map(function (iid) { var it = WM.data.items[iid]; if (!it) throw new Error('shop item ' + iid); return { label: it.name, right: it.price, id: iid, help: it.desc }; });
      var list = new UI.List(items, { x: 40, y: 40, w: 620, rows: 8, help: true, title: shop.name + ' — Buy' });
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          var it = WM.data.items[r.ok.id];
          UI.remove(w);
          var max = Math.min(99 - S.count(r.ok.id), Math.floor(WM.state.gold / it.price));
          if (max <= 0) { WM.audio.sfx('buzz'); UI.notice(WM.state.gold < it.price ? 'Not enough silver.' : 'You cannot carry more.', { auto: 1 }).then(function () { UI.push(w); }); return; }
          qtyPicker(it, max, true).then(function (n) {
            if (n > 0) { WM.state.gold -= n * it.price; S.give(r.ok.id, n); WM.audio.sfx('coins'); }
            UI.push(w);
          });
        },
        draw: function () { list.draw(); goldBox(); var cur = list.items[list.idx]; if (cur) { partyCompare(cur.id); G.window(700, 90, 240, 56); G.text('Have: ' + S.count(cur.id), 920, 104, { size: 20, align: 'right' }); } }
      };
      UI.push(w);
    });
  }

  function sell() {
    return new Promise(function (resolve) {
      var mk = function () {
        var inv = S.invList(function (it) { return it.type !== 'key' && it.price > 0; });
        return new UI.List(inv.map(function (e) { return { label: e.it.name, right: Math.floor(e.it.price / 2) + ' (' + e.n + ')', id: e.id, help: e.it.desc }; }), { x: 40, y: 40, w: 620, rows: 8, help: true, title: 'Sell' });
      };
      var list = mk();
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          var it = WM.data.items[r.ok.id];
          UI.remove(w);
          qtyPicker(it, S.count(r.ok.id), false).then(function (n) {
            if (n > 0) { WM.state.gold += n * Math.floor(it.price / 2); S.take(r.ok.id, n); WM.audio.sfx('coins'); }
            var k = list.idx; list = mk(); list.idx = Math.min(k, Math.max(0, list.items.length - 1)); UI.push(w);
          });
        },
        draw: function () { list.draw(); goldBox(); if (!list.items.length) G.text('Nothing to sell.', 350, 140, { size: 22, color: G.COL.dim, align: 'center' }); }
      };
      UI.push(w);
    });
  }

  function qtyPicker(it, max, buying) {
    return new Promise(function (resolve) {
      var n = 1;
      var w = {
        update: function () {
          if (I.pressed('up') || I.pressed('right')) { n = Math.min(max, n + 1); WM.audio.sfx('cursor'); }
          if (I.pressed('down') || I.pressed('left')) { n = Math.max(1, n - 1); WM.audio.sfx('cursor'); }
          if (I.pressed('pageR')) n = Math.min(max, n + 10);
          if (I.pressed('pageL')) n = Math.max(1, n - 10);
          if (I.pressed('ok')) { I.clear(); UI.remove(w); resolve(n); }
          if (I.pressed('cancel')) { I.clear(); UI.remove(w); resolve(0); }
        },
        draw: function () {
          G.window(300, 280, 360, 130);
          G.text(it.name, 480, 296, { size: 22, bold: true, align: 'center', color: G.COL.gold });
          G.text('◀ ' + n + ' ▶', 480, 334, { size: 26, align: 'center' });
          var price = buying ? it.price : Math.floor(it.price / 2);
          G.text((buying ? 'Cost ' : 'Get ') + n * price + ' taels', 480, 372, { size: 20, align: 'center', color: G.COL.dim });
        }
      };
      UI.push(w);
    });
  }

  // Inn: rest restores HP & charges for the whole roster (Suikoden-style).
  SH.inn = async function (price, who) {
    var k = await UI.ask(who || null, price ? 'A room for the night is ' + price + ' taels. Will you stay?' : 'Rest here for a while?', ['Rest', 'Not now']);
    if (k !== 0) return false;
    if (price && WM.state.gold < price) { await UI.message(who || null, 'You don\'t have enough silver, friend.'); return false; }
    WM.state.gold -= price || 0;
    await WM.fadeOut(0.6);
    WM.audio.play('inn');
    S.restoreAll();
    await WM.wait(1.6);
    await WM.fadeIn(0.6);
    var mus = WM.field.map && WM.field.map.def.music;
    WM.audio.play(typeof mus === 'function' ? mus(S) : mus);
    return true;
  };

  // Blacksmith: sharpen a character's own weapon (no weapon swapping, as in Suikoden II).
  SH.cost = function (wlv) { return Math.round(200 * Math.pow(wlv, 1.9)); };
  SH.smith = function (maxLv, who) {
    return new Promise(function (resolve) {
      var mk = function () {
        return new UI.List(WM.state.party.map(function (id) {
          var c = WM.state.chars[id], d = S.def(id), w = d.weapon || { name: 'Fists' };
          var can = c.wlv < maxLv && c.wlv < S.MAX_WLV;
          return { label: d.name + ' — ' + w.name + ' Lv' + c.wlv, right: can ? SH.cost(c.wlv) : 'Max', disabled: !can, id: id };
        }), { x: 40, y: 90, w: 720, title: 'Sharpen weapons (up to Lv ' + maxLv + ')' });
      };
      var list = mk();
      var w = {
        update: function () {
          var r = list.handle(); if (!r) return;
          if (r.cancel) { UI.remove(w); resolve(); return; }
          var c = WM.state.chars[r.ok.id], cost = SH.cost(c.wlv);
          if (WM.state.gold < cost) { WM.audio.sfx('buzz'); UI.toast('Not enough silver.'); return; }
          WM.state.gold -= cost; c.wlv++;
          WM.audio.sfx('block'); setTimeout(function () { WM.audio.sfx('block'); }, 150); setTimeout(function () { WM.audio.sfx('item'); }, 320);
          UI.toast(S.def(r.ok.id).weapon.name + ' sharpened to Lv ' + c.wlv + '.');
          var k = list.idx; list = mk(); list.idx = k;
        },
        draw: function () { list.draw(); goldBox(); }
      };
      UI.push(w);
    });
  };

  // Talisman master: attach purchasable talismans into head / right hand / left hand slots.
  SH.talismans = async function (id) {
    var shop = WM.data.shops[id];
    while (true) {
      var k = await UI.choose(['Attach a talisman', 'Remove a talisman', 'Leave'], { x: 40, y: 40, title: shop ? shop.name : 'Talisman Master' });
      if (k === 0) {
        var who = await WM.menu.pickMember('Attach to whom?');
        if (!who) continue;
        var c = WM.state.chars[who], d = S.def(who);
        var slots = [['head', 'Head'], ['rhand', 'Right hand'], ['lhand', 'Left hand']].filter(function (s) { return d.slots ? d.slots.indexOf(s[0]) >= 0 : true; });
        var si = await UI.choose(slots.map(function (s) { var t = c.tal[s[0]] && WM.data.talismans[c.tal[s[0]]]; return { label: s[1], right: t ? t.name : '—' }; }), { x: 40, y: 200, w: 500 });
        if (si < 0) continue;
        var slot = slots[si][0];
        if (c.tal[slot] && WM.data.talismans[c.tal[slot]].fixed) { await UI.message(null, 'That talisman is bound to ' + d.name + ' and cannot be removed.'); continue; }
        var list = (shop ? shop.items : []).filter(function (tid) { var t = WM.data.talismans[tid]; return !t.slot || t.slot === slot; });
        var ti = await UI.choose(list.map(function (tid) { var t = WM.data.talismans[tid]; return { label: t.name, right: t.price, help: t.desc }; }), { x: 40, y: 200, w: 620, help: true });
        if (ti < 0) continue;
        var tdef = WM.data.talismans[list[ti]];
        if (WM.state.gold < tdef.price) { await UI.message(null, 'Not enough silver.'); continue; }
        WM.state.gold -= tdef.price; c.tal[slot] = list[ti];
        WM.audio.sfx('magic');
        await UI.notice(tdef.name + ' attached to ' + d.name + '.', { auto: 1.2 });
      } else if (k === 1) {
        var who2 = await WM.menu.pickMember('Remove from whom?');
        if (!who2) continue;
        var c2 = WM.state.chars[who2];
        var slots2 = ['head', 'rhand', 'lhand'].filter(function (s) { return c2.tal[s]; });
        if (!slots2.length) { await UI.message(null, 'Nothing to remove.'); continue; }
        var r = await UI.choose(slots2.map(function (s) { return WM.data.talismans[c2.tal[s]].name; }), { x: 40, y: 200 });
        if (r < 0) continue;
        if (WM.data.talismans[c2.tal[slots2[r]]].fixed) { await UI.message(null, 'That talisman cannot be removed.'); continue; }
        c2.tal[slots2[r]] = null; WM.audio.sfx('ok');
      } else return;
    }
  };
})();
