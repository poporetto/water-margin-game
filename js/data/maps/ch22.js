// Maps for chapters 22–23: an army camp in the field (used for the campaigns against Tian Hu, Wang Qing and Fang La),
// with the commander's tent, banners, and a river crossing.
'use strict';
(function () {
  var L = WM.mapLib, U = WM.util;
  var c = L.grid(40, 28, '.');
  for (var y = 0; y < 28; y++) for (var x = 32; x < 40; x++) c.set(x, y, x < 34 ? '~' : 'w');
  c.scatter('r', 0.25, 571, '~', [32, 0, 2, 28]); c.set(33, 12, 'o'); c.set(33, 15, 'o');
  c.frame(4, 3, 26, 20, 'F'); c.rect(15, 22, 4, 1, '.'); c.rect(29, 12, 1, 3, '.');
  c.rect(12, 6, 10, 5, '.'); c.set(14, 6, 'V'); c.set(17, 6, 'V'); c.set(20, 6, 'V'); c.rect(15, 7, 4, 2, 'V');   // the commander's pavilion
  c.set(13, 10, 'Y'); c.set(21, 10, 'Y');
  [[6, 13], [9, 13], [24, 13], [27, 13], [6, 18], [9, 18], [24, 18], [27, 18]].forEach(function (p) { c.set(p[0], p[1], 'V'); });
  c.rect(16, 11, 2, 11, ':'); c.rect(18, 13, 11, 2, ':');
  c.scatter('T', 0.06, 572, '.', [0, 0, 32, 3]); c.scatter('T', 0.06, 573, '.', [0, 23, 32, 5]);
  WM.defMap('armycamp', { name: 'Song Jiang\'s Camp', theme: 'autumn', music: 'tense', rows: c.rows(), spawn: [16, 20], battleBg: 'field' });

  // A council of war before a great battle, in the commander's pavilion: the leader before his tent with his strategist
  // at his side, the commanders gathered before him; a scout may come running up from the gate with news of the enemy.
  // Then the plan, the war drums, and the commanders go out to their troops.
  //   o.beside: the strategist; o.generals: up to six commanders; o.scout: { who, lines }; o.lines: [[speaker|null, text]]
  //   (null narrates); o.night; o.here: hold the council where the leader already is (no march to the camp)
  WM.data.warCouncil = async function (s, o) {
    o = o || {};
    if (!o.here) { await s.fadeOut(0.6); await s.warp('armycamp', 17, 9, 'down', { noFade: true }); }
    var slots = [[14, 11, 'up'], [20, 11, 'up'], [15, 12, 'up'], [19, 12, 'up'], [13, 12, 'up'], [21, 12, 'up']];
    if (o.beside) s.spawn('cb', o.beside, 16, 9, 'right');
    (o.generals || []).forEach(function (id, i) { if (slots[i]) s.spawn('cg' + i, id, slots[i][0], slots[i][1], slots[i][2]); });
    s.night(!!o.night);
    s.music(o.music || 'tense');
    s.camera(17, 11, 0.01);   // the whole gathering above the words, the pavilion at the top
    if (!o.here) await s.fadeIn(0.8);
    if (o.scout) {
      var sw = o.scout.who || 'soldier';
      s.spawn('scout', sw, 16, 21, 'up');
      await s.moveTo('scout', 17, 13, { run: true, yFirst: true });
      s.face('scout', 'up');
      for (var k = 0; k < o.scout.lines.length; k++) await s.say(sw, o.scout.lines[k]);
      s.despawn('scout', { to: [16, 22] });
    }
    for (var i = 0; i < (o.lines || []).length; i++) {
      var ln = o.lines[i];
      if (typeof ln === 'function') await ln(s); else if (ln[0] === null) await s.narrate(ln[1]); else await s.say(ln[0], ln[1]);
    }
    s.music('war'); s.sfx('drum'); await s.wait(0.25); s.sfx('drum'); await s.wait(0.25); s.sfx('gong');
    // the commanders turn and go out to their troops, every one of them (companions too), and the scene darkens over them;
    // the camp is cleared in the dark, and the battle comes up out of it
    var keys = (o.generals || []).map(function (id, i) { return 'cg' + i; }).filter(function (k, i) { return !!slots[i]; });
    keys.forEach(function (k) { s.moveTo(k, 16, 21, { run: true, wait: false }); });
    await s.wait(0.7);
    await s.fadeOut(0.5);
    keys.concat(o.beside ? ['cb'] : []).forEach(function (k) { s.hide(k); s.despawn(k); });
    s.cameraReset();
  };
})();
