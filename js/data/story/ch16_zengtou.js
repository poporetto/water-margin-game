// Chapter 16 — "Zengtou" (novel chapter 60).
// Duan Jingzhu and the Night-Shining Jade Lion; the Zeng family's insult; Chao Gai leads the army himself; the broken
// banner; the monks of the Fahua Temple; Shi Wengong's arrow; Chao Gai's last words; the Hall of Loyalty.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('zengkui', 'Zeng Kui', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#5a5a62', tassel: '#2a2a2a', body: '#4a3a2a', trim: '#d8b36a', weapon: 'spear', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('zengtu', 'Zeng Tu', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#8a6a3a', tassel: '#c8302a', body: '#6a2a2a', trim: '#d8b36a', weapon: 'spear', face: 'square' }, { face: true });
  WM.npc('shiwengong', 'Shi Wengong', { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#3a3a42', tassel: '#e8e8e8', beard: 'short', body: '#2a2a3a', trim: '#c8b890', weapon: 'halberd', build: 'big', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('fahuamonk', 'Monk of the Fahua Temple', { skin: '#d8a070', hairStyle: 'bald', body: '#8a6a3a', trim: '#c8a860', face: 'round', eyes: 'narrow' }, { face: true });

  WM.enemy('zt_spear', 'Zengtou Spearman', 28, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 150, drops: [['medicine', 0.15]] });
  WM.enemy('zt_archer', 'Zengtou Archer', 28, WM.hum(WM.enemyLooks.archer), { hp: 0.85, range: 'L', fx: 'arrow', exp: 150 });
  var T = WM.data.troops;
  T.ch16_ambush = { enemies: ['zt_spear', 'zt_archer', 'zt_spear', 'zt_archer'], bg: 'night', noRun: true };

  WM.data.duels.linchong_zengkui = {
    hero: 'linchong', foe: 'zengkui', bg: 'field', heroHp: 680, heroAtk: 54, foeHp: 640, foeAtk: 50, drawAfter: 4,
    intro: [['foe:angry', 'Liangshan horse-thieves! I am Zeng Kui, fourth of the five tigers of the Zeng!'], ['hero', 'And I am Lin Chong. The horse was ours first.']],
    lines: { attack: ['Hah!', 'Take this!', 'There!'], wild: ['Five Tigers of the Zeng!', 'Fall!', 'Down!'], defend: ['Hmph.', 'Come on.', 'Steady...'] },
    draw: [[null, 'Twenty bouts, and Zeng Kui wheeled his horse and fled back behind the walls of Zengtou.']]
  };

  WM.data.chapters[16].begin = async function (s) {
    await s.chapter(16);
    s.party(['songjiang']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('cg', 'chaogai', 15, 5, 'down'); s.spawn('dj', 'duanjingzhu', 16, 7, 'up');
    await s.fadeIn(0.6);
    await s.narrate('On the way home from Mangdang, a thin man with a yellow beard and reddish hair had stopped Song Jiang on the road and bowed to the ground. His name was Duan Jingzhu; people called him the Golden-Haired Dog. He was a horse thief.');
    await s.say('duanjingzhu', 'In the north I stole a horse from a prince of the Jin — a white horse, without a single hair of another colour, that can go a thousand li in a day. They call it the Night-Shining Jade Lion. I was bringing it to Liangshan, as my gift to you. But at Zengtou the Zeng family took it from me. When I said it was for Song Jiang of Liangshan, they cursed you to your face.');
    await s.say('duanjingzhu', 'They have five sons, the Five Tigers of the Zeng, and two instructors, Shi Wengong and Su Ding. And their children sing a song in the streets: "Shake the iron rings, the gods and ghosts all quake... Sweep Liangshan from the marsh, take Chao Gai to the capital, catch the Timely Rain alive, and the Star of Wisdom too..."');
    await s.say('chaogai:angry', 'They steal our horse, and sing songs about us? This time I will go myself.');
    await s.say('songjiang', 'Brother, you are the lord of the mountain. You must not go into danger for a horse. Let me go.');
    await s.say('chaogai', 'It\'s not that I want to take your merit, brother. But you have gone down the mountain again and again, and fought and suffered. This time it is my turn. Don\'t try to stop me.');
    s.despawn('dj');
    await s.narrate('Chao Gai chose twenty chiefs and five thousand men.');
    await s.fadeOut(0.6);
    s.despawn('cg');
    await s.warp('liangshan', 24, 34, 'down', { noFade: true });
    s.spawn('cg', 'chaogai', 24, 36, 'down'); s.spawn('wy', 'wuyong', 22, 35, 'down');
    s.spawn('bn', 'outlaw', 26, 36, 'down');
    var mt = WM.data.troop(s, 'mt', 'outlaw', [[21, 38], [23, 38], [25, 38], [27, 38], [22, 39], [24, 39], [26, 39]], 'down');
    await s.fadeIn(0.6);
    await s.say('chaogai', 'Raise the new banner! We march for Zengtou!');
    s.sfx('wind'); await s.shake(4, 0.6);
    s.sfx('hit'); await s.emote('bn', '!'); await s.jump('bn');
    await s.say('outlaw', 'The wind — the banner shaft! It\'s snapped clean in two!');
    mt.forEach(function (k) { s.emote(k, '!', 0.8); });
    s.face('wy', 'right');
    await s.say('wuyong', 'Brother, this is an ill omen. Wait for another day.');
    await s.say('chaogai', 'The wind blows when it blows. What has it to do with me? We go.');
    await s.fadeOut(0.6);
    WM.data.clear(s, mt.concat(['cg', 'wy', 'bn']));
    s.addParty('chaogai'); s.level('chaogai', 29);
    s.party(['chaogai', 'linchong', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng']); s.setLeader('chaogai'); s.flag('protagonist', 'chaogai');
    await s.fadeIn(0.6);
    ['linchong', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng'].forEach(function (id) { s.level(id, 28); });
    WM.unlock('zengtou');
    s.flag('ch16_march');
    await s.say(null, '(Zengtou lies to the north-east.)');
  };
  WM.data.chapters[16].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 15; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    WM.data.charOrder.slice(0).forEach(function (id) {
      if (['duanjingzhu', 'suochao', 'guansheng', 'xuanzan', 'haosiwen', 'andaoquan', 'wangdingliu', 'lujunyi', 'yanqing', 'caifu', 'caiqing', 'shantinggui', 'weidingguo', 'jiaoting', 'baoxu', 'yubaosi', 'dongping', 'zhangqing', 'gongwang', 'dingdesun', 'huangfuduan'].indexOf(id) < 0) S.recruit(id, 29);
    });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    S.initChar('duanjingzhu', 24);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'zhujia', 'lijia', 'gaotang', 'qingzhou', 'huazhou', 'mangdang');
    await WM.data.chapters[16].begin(s);
  };

  // the Hall at Chao Gai's death: anyone already standing where the bier goes steps out of sight for the scene
  function clearAround(cx, cy) {
    var f = WM.field; if (!f || !f.map || !Array.isArray(f.actors)) return [];
    var gone = f.actors.filter(function (a) { if (a.visible === false || !a.ev || a.ev.resident) return false; var t = a.tile(); return Math.abs(t.x - cx) <= 1 && Math.abs(t.y - cy) <= 1; });
    gone.forEach(function (a) { a.visible = false; });
    return gone;
  }
  // ...and the heroes standing about the hall break their places: a few steps this way and that, then turn to the
  // bier, weeping (or still not believing it)
  function mourn(cx, cy) {
    var f = WM.field, T = WM.TILE || 16; if (!f || !f.map || !Array.isArray(f.actors)) return;
    f.actors.forEach(function (a, i) {
      if (!a.ev || !a.ev.resident || a.visible === false) return;
      var t = a.tile(), tx = t.x, ty = t.y;
      for (var k = 0; k < 2; k++) {
        var nx = tx + Math.round((Math.random() - 0.5) * 4), ny = ty + (ty < cy ? 1 : -1) * Math.round(Math.random() * 2);
        if (f.tileSolid(nx, ny) || (Math.abs(nx - cx) <= 2 && Math.abs(ny - cy) <= 2)) continue;
        a.path.push({ x: nx * T + 8, y: ny * T + 15 }); tx = nx; ty = ny;
      }
      a.speed = 55 + Math.random() * 60; a.faced = true;
      a.onArrive = function () { var dx = cx - tx, dy = cy - ty; a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); };
      setTimeout(function () { a.emote = ['tears', 'tears', 'tears', '!', '...'][i % 5]; a.emoteT = 9; }, (i * 170) % 1600);
    });
  }

  WM.defEvents('zengtou', [
    { id: 'ch16_first', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch16_march'); }, run: async function (s) {
      await s.narrate('Chao Gai\'s army came to Zengtou and made camp before its walls: five thousand men, and twenty chiefs. At dawn the gate opened, and a young man in silver armour rode out at the head of a troop of horse — Zeng Kui, the fourth of the Zeng sons.');
      s.spawn('zk', 'zengkui', 26, 24, 'down');
      await s.move('zk', 'D3');
      await s.say('zengkui', 'So the bandit king himself has come to die! Which of you thieves will face me?');
      await s.say('linchong', 'Brother Chao Gai, this one is mine.');
      await s.duel('linchong_zengkui', { hero: 'linchong', canLose: true });
      s.despawn('zk', { leave: true });
      await s.narrate('For days the Zeng family would not come out. Then two monks came to Chao Gai\'s camp.');
      s.spawn('m1', 'fahuamonk', 4, 34, 'right'); s.spawn('m2', 'fahuamonk', 4, 35, 'right');
      s.walkTo('m1', 24, 34); await s.walkTo('m2', 24, 35);
      s.face('m1', 'right'); s.face('m2', 'right');
      s.beside('linchong'); s.face('player', 'left'); s.face('linchong', 'left');   // both turn to the monks
      await s.jump('m1'); await s.jump('m2');
      await s.say('fahuamonk', 'Great King, we are monks of the Fahua Temple, to the west. The Zeng family have plundered our temple and abused us beyond bearing. We know a back way to their camp. If you come tonight, we will lead you to it.');
      await s.say('linchong', 'Brother, I don\'t trust them. Let me go, and you stay with the camp.');
      await s.say('chaogai', 'If I don\'t go myself, who will fight with heart? You stay and guard the camp, Brother Lin Chong.');
      s.despawn('m1', { leave: true }); s.despawn('m2', { leave: true });
      s.party(['chaogai', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng']); s.setLeader('chaogai');
      s.night(true);
      s.flag('ch16_night');
      await s.say(null, '(Follow the monks to the Fahua Temple in the woods to the west.)');
    } },
    { id: 'ch16_trap', x: 6, y: 13, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch16_night'); }, run: async function (s) {
      await s.walkTo('player', 7, 13); s.face('player', 'down');
      s.spawn('m1', 'fahuamonk', 7, 15, 'up'); s.spawn('m2', 'fahuamonk', 7, 16, 'up');
      await s.say('fahuamonk', 'The temple is empty, Great King — the Zeng men drove our brothers out. This way. The road behind the temple goes straight to their camp.');
      s.walkTo('m2', 7, 21); await s.walkTo('m1', 7, 20);
      await s.walkTo('player', 7, 18);
      s.walkTo('m1', 12, 22); await s.walkTo('m2', 12, 23);
      s.hide('m1'); s.hide('m2'); s.despawn('m1'); s.despawn('m2');
      await s.walkTo('player', 9, 22);
      await s.emote('player', '?');
      await s.say('liutang:shock', 'Brother — the monks have vanished!');
      await s.say('chaogai', '...Back. Turn back, quickly!');
      s.sfx('gong'); await s.shake(4, 0.3);
      var amb = WM.data.troop(s, 'za', 'guard', [[5, 20], [13, 20], [6, 24], [12, 25], [10, 19]], 'right');
      s.sfx('drum');
      await s.say('guard', 'The bandit king walked right into it! Torches! Take him!');
      await s.battle('ch16_ambush', { bg: 'night' });
      await s.fadeOut(0.4);
      WM.data.clear(s, amb);
      s.spawn('lt', 'liutang', 8, 22, 'right'); s.spawn('bs', 'baisheng', 10, 21, 'down'); s.spawn('hy', 'huyanzhuo', 11, 22, 'left'); s.spawn('rx', 'ruanxiaoer', 10, 23, 'up');
      await s.fadeIn(0.4);
      await s.emote('hy', 'anger');
      await s.say('huyanzhuo', 'They\'ll be back with more torches. Brother, we must get out of these woods!');
      await s.emote('rx', 'sweat');
      await s.say('ruanxiaoer', 'The camp is south-east, past the trees. Stay close, Great King!');
      await s.fallIn('lt', 'liutang'); await s.fallIn('bs', 'baisheng'); await s.fallIn('hy', 'huyanzhuo'); await s.fallIn('rx', 'ruanxiaoer');
      s.flag('ch16_ambushed');
      await s.say(null, '(Fight your way back to the camp, south of the woods!)');
    } },
    { id: 'ch16_arrow', x: 0, y: 30, w: 26, h: 1, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch16_ambushed'); }, run: async function (s) {
      // out of the trees, the camp in sight: Shi Wengong's arrow from the edge of the wood
      WM.data.clear(s, ['lt', 'bs', 'hy', 'rx']);   // (the four who fell in after the ambush: on stage again where they walk)
      var at = {}, f = WM.field, near = [[14, 29], [13, 29], [15, 28], [14, 28]];
      if (f && f.map && Array.isArray(f.actors)) f.actors.forEach(function (a) { if (a.following && a.sheetWho) { var t = a.tile(); at[a.sheetWho] = [t.x, t.y, a.dir]; } });
      WM.state.followers = []; if (f.refreshFollowers) f.refreshFollowers();
      [['lt', 'liutang'], ['bs', 'baisheng'], ['hy', 'huyanzhuo'], ['rx', 'ruanxiaoer']].forEach(function (k, i) { var p = at[k[1]] || near[i]; s.spawn(k[0], k[1], p[0], p[1], p[2] || 'down'); });
      await s.walkTo('player', 15, 30); s.face('player', 'down');
      await s.say('liutang', 'There — the camp fires! We\'re through, Brother!');
      s.spawn('swg', 'shiwengong', 21, 30, 'left');
      ['player', 'lt', 'bs', 'hy', 'rx'].forEach(function (k) { s.face(k, 'right'); });
      await s.emote('rx', '!');
      await s.say('shiwengong', 'Bandit king! Shi Wengong of Zengtou sends you this!');
      s.sfx('arrow'); await s.flash();
      await s.jump('player'); await s.shake(3, 0.3); s.lie('player');
      s.music('sad');
      s.emote('lt', '!'); s.emote('bs', '!'); s.emote('hy', 'anger'); await s.emote('rx', '!');
      s.despawn('swg', { leave: true });
      await s.say('liutang:shock', 'BROTHER! An arrow — in his face! Bai Sheng, help me lift him!');
      s.walkTo('lt', 15, 29, { run: true }); await s.walkTo('bs', 16, 30, { run: true });
      s.face('lt', 'down'); s.face('bs', 'left');
      await s.emote('bs', 'sweat');
      await s.say('baisheng', 'I\'ve got him! Huyan Zhuo, Ruan Xiao\'er — hold the road behind us!');
      s.walkTo('rx', 19, 30, { run: true }); await s.walkTo('hy', 18, 29, { run: true });
      s.face('hy', 'right'); s.face('rx', 'right');
      await s.emote('hy', 'anger');
      await s.say('huyanzhuo', 'Go! Any Zeng dog who comes out of those trees answers to my whips!');
      await s.fadeOut(1);
      WM.data.clear(s, ['lt', 'bs', 'hy', 'rx']);
      s.lie('player', false);
      s.place('player', 25, 33, 'down'); s.hide('player');
      s.night(false);
      s.spawn('cg2', 'chaogai', 25, 33, 'down'); s.lie('cg2');
      s.spawn('lc2', 'linchong', 24, 34, 'up'); s.spawn('lt2', 'liutang', 26, 34, 'up');
      await s.fadeIn(1);
      s.sfx('item');
      await s.say('linchong', 'The arrow is out. There are characters cut into the shaft: "Shi Wengong."');
      await s.say('liutang:sad', 'Brother Chao Gai... can you hear me? ...He can\'t speak. The arrow was poisoned.');
      await s.say('linchong:sad', 'Back to the mountain. Now.');
      s.flag('ch16_shot');
      await s.fadeOut(1.5);
      WM.data.clear(s, ['cg2', 'lc2', 'lt2']);
      s.show('player');
      s.party(['songjiang']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.warp('liangshan_in', 15, 9, 'up', { noFade: true });
      var stood = clearAround(15, 6);   // (the hall's own people step out of the way of the bier)
      s.spawn('cg', 'chaogai', 15, 6, 'down'); s.lie('cg');
      s.spawn('wy', 'wuyong', 13, 7, 'right'); s.spawn('lc', 'linchong', 17, 7, 'left');
      await s.fadeIn(1.5);
      await s.walkTo('player', 15, 7, { run: true }); s.face('player', 'up');
      await s.say('songjiang:sad', 'Brother! Brother Chao Gai!');
      await s.say('chaogai:sad', 'Brother Song Jiang... take care of yourself. Whoever captures the man who shot me... let him be the lord of Liangshan.');
      await s.wait(0.8);
      s.sfx('gong');
      await s.jump('player'); s.emote('player', 'tears', 9);
      s.emote('wy', 'tears', 9); s.emote('lc', 'tears', 9);
      mourn(15, 6);   // the whole hall: some run to the bier, some turn away weeping
      await s.wait(2.2);
      await s.narrate('Then Chao Gai closed his eyes and died. Song Jiang wept as if he had lost his own father, and the whole mountain wept with him.');
      s.flag('chaogai_dead');
      S.removeFromParty('chaogai');
      await s.walkTo('wy', 14, 8); s.faceEach('wy', 'player');
      await s.say('wuyong', 'Brother, the mountain cannot be without a lord. Brother Chao Gai\'s words will be honoured when his enemy is taken. Until then, sit in the seat — for the sake of all of us.');
      await s.emote('player', '...');
      await s.walkTo('lc', 16, 8); s.faceEach('lc', 'player');
      await s.say('linchong', 'We all ask it, Brother. Every man in this hall.');
      s.face('player', 'down');
      await s.emote('player', 'sweat');
      await s.say('songjiang:sad', '...Until Shi Wengong is taken, I will sit in it — for a time. When he is taken, whoever took him shall be our lord, as our brother wished.');
      s.emote('wy', '...'); await s.emote('lc', '...');
      await s.fadeOut(1);
      WM.data.clear(s, ['cg', 'lc']);
      stood.forEach(function (a) { a.visible = true; });
      s.place('player', 15, 8, 'down'); s.place('wy', 14, 8, 'right');
      await s.fadeIn(1);
      await s.narrate('Song Jiang changed the name of the Hall of Gathered Righteousness to the Hall of Loyalty and Righteousness, and before it raised a great apricot-yellow banner: "Act on Heaven\'s Behalf." He divided the mountain into camps and set a captain over each.');
      s.flag('loyaltyhall');
      await s.join('duanjingzhu');
      await s.narrate('Song Jiang wanted to march on Zengtou at once. Wu Yong held him back: they were in mourning, and an army in mourning goes out under a bad star.');
      await s.narrate('A monk came from Daming to chant at Chao Gai\'s memorial.');
      s.spawn('dmk', 'monk', 15, 12, 'up');
      await s.walkTo('dmk', 15, 10); s.faceEach('dmk', 'player');
      await s.say('monk', 'Amitabha. Lord Song, in Daming there lives the richest man in the north, Lu Junyi — the Jade Qilin. With the spear and the staff he has no equal in the land.');
      s.despawn('dmk', { leave: true });
      await s.emote('player', '!');
      await s.say('songjiang', 'If only we had such a man on Liangshan, what would we fear from any army?');
      s.faceEach('wy', 'player');
      await s.say('wuyong:smile', 'Then let me go to Daming, and bring him here.');
      s.despawn('wy', { leave: true });
      s.flag('ch16_done');
      await s.endChapter();
      if (WM.data.chapters[17].begin) await WM.data.chapters[17].begin(s);
    } }
  ]);
})();
