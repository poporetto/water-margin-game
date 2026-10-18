// One-on-one duels, Suikoden II rules: Attack beats Defend, Brute Attack beats Attack, Defend beats Brute Attack.
// The opponent's line before each exchange hints at their next move.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input, U = WM.util, S = WM.S, UI = WM.ui;
  var D = WM.duel = {};
  var SCN = { countsTime: true };
  WM.scenes.duel = SCN;
  var MOVES = ['attack', 'wild', 'defend'];
  var MOVE_NAME = { attack: 'Attack', wild: 'Brute Attack', defend: 'Defend' };

  D.start = function (id, opt) {
    var d = WM.data.duels[id];
    if (!d) throw new Error('Unknown duel ' + id);
    return new Promise(function (resolve) {
      var prev = WM.scene, prevMusic = WM.audio.current;
      var heroId = opt.hero || d.hero;
      if (!WM.state.chars[heroId]) S.initChar(heroId, S.partyAvgLv());
      var hs = S.stats(heroId);
      var foeIsChar = !!WM.data.chars[d.foe];
      var du = D.cur = {
        d: d, opt: opt, heroId: heroId,
        hero: { name: S.def(heroId).name, hp: d.heroHp || Math.max(hs.mhp, 200), mhp: d.heroHp || Math.max(hs.mhp, 200), atk: d.heroAtk || Math.round(hs.atk * 0.9 + 10), x: 600, ox: 0, flash: 0, pose: 'idle' },
        foe: { name: d.foeName || (foeIsChar ? WM.data.chars[d.foe].name : (WM.data.npcs[d.foe] || {}).name), hp: d.foeHp, mhp: d.foeHp, atk: d.foeAtk, x: 360, ox: 0, flash: 0, pose: 'idle' },
        bg: WM.battle.makeBg(d.bg || 'plains'),
        pops: [], round: 0, foeId: d.foe, heroSheet: WM.sprites.get(heroId),
        foeSheet: foeIsChar ? WM.sprites.get(d.foe) : WM.sprites.get('npc:' + d.foe, (WM.data.npcs[d.foe] || {}).look)
      };
      WM.fadeOut(0.4).then(function () {
        WM.setScene(SCN);
        WM.audio.play(d.music || 'duel');
        return WM.fadeIn(0.4);
      }).then(function () { return run(du); }).then(function (res) {
        return WM.fadeOut(0.4).then(function () {
          D.cur = null;
          if (prev) WM.setScene(prev, null, true);
          if (prevMusic) WM.audio.play(prevMusic);
          if (res !== 'lose' || opt.canLose) WM.fadeIn(0.4);
          resolve(res);
        });
      });
    });
  };

  // 'hero' and 'foe' stand for the two fighters, with or without an expression ('hero:sad', 'foe:shock')
  function who(du, sp) {
    if (typeof sp !== 'string') return sp;
    var p = sp.split(':'), id = p[0] === 'hero' ? du.heroId : p[0] === 'foe' ? du.foeId : p[0];
    return p.length > 1 ? id + ':' + p[1] : id;
  }
  function speaker(du) { return WM.data.chars[du.foeId] ? du.foeId : du.foeId; }

  async function run(du) {
    var d = du.d;
    for (var i = 0; i < (d.intro || []).length; i++) {
      var ln = d.intro[i];
      await UI.message(who(du, ln[0]), ln[1]);
    }
    // a teaching duel opens with lessons: the opponent shows his move, the hero says how to answer it, and that answer
    // is marked in the menu (the player may still choose otherwise). Real exchanges, so the damage stands.
    var lessons = du.opt.noLessons ? [] : (d.lessons || []);
    for (i = 0; i < lessons.length; i++) {
      var L = lessons[i];
      du.round++; du.next = L.move;
      await UI.message(who(du, 'foe'), L.foe);
      var pick = await chooseMove(du, L.tip, { name: du.hero.name, advice: L.answer });
      await exchange(du, pick, L.move);
      if (L.after) await outro(du, pick === L.answer ? L.after : L.missed || []);
      if (du.foe.hp <= 0) { await outro(du, d.win); return 'win'; }
      if (du.hero.hp <= 0) { await outro(du, d.lose); return 'lose'; }
    }
    if (lessons.length) await outro(du, d.afterLessons);
    var pattern = d.pattern ? d.pattern.slice() : null;
    while (true) {
      du.round++;
      // opponent picks a move (scripted pattern first, then weighted random)
      var foeMove = pattern && pattern.length ? pattern.shift() : weighted(d.weights || { attack: 0.45, wild: 0.25, defend: 0.3 });
      var line = U.pick(d.lines[foeMove]);
      du.next = foeMove; // (exposed for automated tests)
      var choice = await chooseMove(du, line);
      await exchange(du, choice, foeMove);
      if (du.foe.hp <= 0) { await outro(du, d.win); return 'win'; }
      if (du.hero.hp <= 0) { await outro(du, d.lose); return 'lose'; }
      if (d.drawAfter && du.round >= d.drawAfter) { await outro(du, d.draw); return 'draw'; }
    }
  }
  async function outro(du, lines) {
    for (var i = 0; i < (lines || []).length; i++) {
      var ln = lines[i];
      await UI.message(who(du, ln[0]), ln[1]);
    }
  }
  function weighted(w) {
    var r = Math.random(), acc = 0;
    for (var k in w) { acc += w[k]; if (r < acc) return k; }
    return 'attack';
  }

  // tip (in a lesson): { name: who is speaking, advice: the move he advises, marked in the menu with the cursor on it }
  function chooseMove(du, line, tip) {
    return new Promise(function (resolve) {
      var adv = tip && tip.advice;
      var list = new UI.List(MOVES.map(function (m) { return { label: MOVE_NAME[m], v: m, color: m === adv ? G.COL.gold : null, right: m === adv ? '◀' : null, rightColor: G.COL.gold }; }),
        { x: 690, y: 330, w: 250, cancel: false, index: adv ? MOVES.indexOf(adv) : 0 });
      var w = {
        isDuelChoice: true,
        update: function () { var r = list.handle(); if (r && r.ok) { UI.remove(w); resolve(r.ok.v); } },
        draw: function () {
          // the same dialogue box as everywhere else: portrait, name, then his words
          var boxX = 24, boxW = WM.W - 48, boxH = 196, boxY = WM.H - boxH - 18;
          var sid = tip ? (tip.name === du.foe.name ? du.foeId : du.heroId) : du.foeId;
          var sp = UI.resolveSpeaker(sid), textX = boxX + 190;
          G.window(boxX, boxY, boxW, boxH);
          WM.portraits.drawFramed(sp.portrait, sp.expr, boxX + 20, boxY + 14);
          G.text(tip ? tip.name : du.foe.name, textX, boxY + 14, { size: 22, bold: true, color: G.COL.gold });
          var ls = G.wrap('“' + line + '”', boxW - 214, 25);
          for (var i = 0; i < ls.length; i++) G.text(ls[i], textX, boxY + 60 + i * 33, { size: 25 });
          // read his words for his next move: the rule, for anyone new to duels
          if (adv) G.text(du.foe.name + ' will ' + { attack: 'attack', wild: 'make a Brute Attack', defend: 'defend' }[du.next] + '  →  answer with ' + MOVE_NAME[adv], textX, boxY + boxH - 36, { size: 17, color: G.COL.gold });
          else G.text('Attack beats Defend  ·  Brute beats Attack  ·  Defend beats Brute', textX, boxY + boxH - 36, { size: 17, color: G.COL.dim });
          list.draw();
        }
      };
      UI.push(w);
    });
  }

  function lunge(f, dir, dist, dur) {
    var s = f.ox;
    return WM.tween(dur, function (k) { f.ox = s + dir * dist * Math.sin(k * Math.PI); });
  }
  function pop(f, text, col) { if (D.cur) D.cur.pops.push({ x: f.x + f.ox, y: 210, text: String(text), col: col || '#fff', t: 0 }); }
  function hit(f, dmg, big) {
    f.hp = Math.max(0, f.hp - dmg); f.flash = 0.3;
    pop(f, dmg, big ? '#ffd040' : '#ffffff');
    WM.audio.sfx(big ? 'crit' : 'hit');
    if (big) G.shake = 3;
  }

  async function exchange(du, me, foe) {
    var h = du.hero, f = du.foe;
    h.pose = me; f.pose = foe;
    var dmgH = function (mult) { return Math.round(f.atk * mult * (0.88 + Math.random() * 0.24)); };
    var dmgF = function (mult) { return Math.round(h.atk * mult * (0.88 + Math.random() * 0.24)); };
    G.flash = 0.25;
    await WM.wait(0.2);
    if (me === foe) {
      if (me === 'defend') { pop(h, 'Guard', '#a0d0ff'); pop(f, 'Guard', '#a0d0ff'); WM.audio.sfx('block'); await WM.wait(0.6); }
      else {
        var big = me === 'wild';
        await Promise.all([lunge(h, -1, 110, 0.35), lunge(f, 1, 110, 0.35)]);
        hit(f, dmgF(big ? 1.6 : 0.8), big); hit(h, dmgH(big ? 1.6 : 0.8), big);
        await WM.wait(0.5);
      }
    } else {
      var heroWins = (me === 'attack' && foe === 'defend') || (me === 'wild' && foe === 'attack') || (me === 'defend' && foe === 'wild');
      var winner = heroWins ? h : f, loser = heroWins ? f : h;
      var winMove = heroWins ? me : foe;
      var dir = heroWins ? -1 : 1;
      if (winMove === 'defend') {
        // loser charges wildly, winner parries and counters
        await lunge(loser, -dir, 140, 0.3);
        WM.audio.sfx('block'); pop(winner, 'Parry!', '#a0d0ff');
        await WM.wait(0.15);
        await lunge(winner, dir, 160, 0.3);
        if (heroWins) hit(f, dmgF(1.7), true); else hit(h, dmgH(1.7), true);
      } else if (winMove === 'wild') {
        await lunge(winner, dir, 170, 0.35);
        if (heroWins) hit(f, dmgF(2.0), true); else hit(h, dmgH(2.0), true);
      } else { // attack breaks guard
        await lunge(winner, dir, 150, 0.3);
        pop(loser, 'Guard broken', '#d0d0d0');
        if (heroWins) hit(f, dmgF(1.0)); else hit(h, dmgH(1.0));
      }
      await WM.wait(0.5);
    }
    h.pose = f.pose = 'idle';
  }

  SCN.update = SCN.updateBackground = function (dt) {
    var du = D.cur; if (!du) return;
    du.pops.forEach(function (p) { p.t += dt; });
    du.pops = du.pops.filter(function (p) { return p.t < 1; });
    if (du.hero.flash > 0) du.hero.flash -= dt;
    if (du.foe.flash > 0) du.foe.flash -= dt;
  };

  SCN.draw = function () {
    var du = D.cur; if (!du) return;
    var c = G.ctx;
    c.imageSmoothingEnabled = false;
    WM.battle.drawBackground(c,du.bg);
    drawFighter(du.foeSheet, du.foe, 2, du.foe.x, 380);
    drawFighter(du.heroSheet, du.hero, 1, du.hero.x, 380);
    // HP bars
    [[du.foe, 40, 'left'], [du.hero, 560, 'right']].forEach(function (z) {
      var f = z[0], x = z[1];
      G.window(x, 20, 360, 70);
      G.text(f.name, x + 20, 30, { size: 22, bold: true, color: G.COL.gold });
      G.text(Math.max(0, Math.round(f.hp)) + ' / ' + f.mhp, x + 340, 32, { size: 18, align: 'right', color: G.hpColor(f.hp / f.mhp) });
      G.bar(x + 20, 62, 320, 14, f.hp / f.mhp, G.hpColor(f.hp / f.mhp));
    });
    G.text('VS', 480, 40, { size: 34, bold: true, align: 'center', color: '#e0573f' });
    du.pops.forEach(function (p) {
      c.globalAlpha = Math.max(0, 1 - p.t);
      G.text(p.text, p.x, p.y - p.t * 40, { size: 32, bold: true, align: 'center', color: p.col });
      c.globalAlpha = 1;
    });
  };
  function drawFighter(sheet, f, row, x, y) {
    var c = G.ctx, P = 5;
    var fr = Math.abs(f.ox) > 4 ? 1 : 0;
    if (sheet.battle) { sheet = sheet.battle; row = row === 1 ? 0 : 1; }   // the weapon in hand; row 0 faces west, row 1 east
    var cw = sheet.isOverride ? sheet.cw : WM.sprites.CW, ch = sheet.isOverride ? sheet.ch : WM.sprites.CH;
    c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.ellipse(x + f.ox, y, 40, 10, 0, 0, 7); c.fill();
    WM.util.drawArt(c, sheet, fr * cw, row * ch, cw, ch, x + f.ox - cw * P / 2, y - (sheet.isOverride ? ch : WM.sprites.FOOT) * P + 5, cw * P, ch * P);
    if (f.flash > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.7; WM.util.drawArt(c, sheet, fr * cw, row * ch, cw, ch, x + f.ox - cw * P / 2, y - (sheet.isOverride ? ch : WM.sprites.FOOT) * P + 5, cw * P, ch * P); c.restore(); }
    if (f.pose !== 'idle') G.text(MOVE_NAME[f.pose], x + f.ox, y - (sheet.isOverride ? ch : WM.sprites.FOOT) * P - 10, { size: 22, bold: true, align: 'center', color: f.pose === 'wild' ? '#ffb070' : f.pose === 'defend' ? '#a0d0ff' : '#ffffff' });
  }
})();
