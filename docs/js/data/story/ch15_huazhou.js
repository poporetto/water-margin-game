// Chapter 15 — "Huazhou" (novel chapters 58–60).
// Shi Jin and the painter's daughter; Lu Zhishen taken on the bridge; Wu Yong stops the imperial envoy Su Yuanjing on
// the Wei River and borrows his golden bells; Prefect He at the Temple of the Western Peak; Mount Mangdang, Fan Rui's
// sorcery and Gongsun Sheng's formation.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('heprefect', 'Prefect He', { skin: '#f0c49a', hairStyle: 'futou', beard: 'mustache', body: '#5a1a1a', trim: '#d8b36a', face: 'round', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('suyuanjing', 'Marshal Su Yuanjing', { skin: '#f0d0b0', hairStyle: 'futou', beard: 'long', body: '#7a1a2a', trim: '#e8c860', face: 'long', eyes: 'narrow' }, { face: true });

  WM.enemy('hz_guard', 'Huazhou Guard', 27, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 140, drops: [['medicine', 0.15]] });
  WM.enemy('hz_jailer', 'Huazhou Jailer', 27, WM.hum(WM.enemyLooks.constable), { exp: 140 });
  WM.enemy('xiang_foe', 'Xiang Chong', 28, WM.hum(WM.data.chars.xiangchong.look), { hp: 2.6, exp: 420, gold: 100, boss: true, range: 'M', skills: [{ name: 'Flying Knives', chance: 0.35, type: 'phys', power: 1.1, target: 'all', fx: 'arrow' }] });
  WM.enemy('ligun_foe', 'Li Gun', 28, WM.hum(WM.data.chars.ligun.look), { hp: 2.6, exp: 420, gold: 100, boss: true, range: 'M', skills: [{ name: 'Javelin Volley', chance: 0.35, type: 'phys', power: 1.1, target: 'all', fx: 'arrow' }] });
  var T = WM.data.troops;
  T.ch15_jail = { enemies: ['hz_jailer', 'hz_guard', 'hz_guard', 'hz_jailer'], bg: 'town', noRun: true };
  T.ch15_shields = { enemies: ['xiang_foe', 'ligun_foe'], bg: 'forest', noRun: true };

  WM.data.wars.ch15_mangdang = {
    name: 'The Formation below Mangdang', goal: 'commander', turns: 10, music: 'war',
    map: [
      'mm....m......T',
      '..........mm..',
      '.mm....m......',
      '..............',
      '.mm....m......',
      '..........mm..',
      'mm....m......T'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'gongsunsheng', type: 'mage', x: 3, y: 3 },
      { leader: 'huarong', type: 'arch', x: 2, y: 1 },
      { leader: 'xuning', type: 'inf', x: 4, y: 2 },
      { leader: 'shijin', support: ['zhuwu', 'chenda', 'yangchun'], type: 'cav', x: 4, y: 4 },
      { leader: 'leiheng', support: ['zhutong'], type: 'inf', x: 2, y: 5 }
    ],
    enemy: [
      { name: 'Xiang Chong', portrait: 'xiangchong', type: 'inf', atk: 112, def: 104, x: 9, y: 2, commander: true },
      { name: 'Li Gun', portrait: 'ligun', type: 'inf', atk: 112, def: 104, x: 9, y: 4 },
      { name: 'Fan Rui', portrait: 'fanrui', type: 'mage', atk: 118, def: 90, x: 12, y: 3 },
      { name: 'Shield Fighters', type: 'inf', atk: 96, def: 100, x: 10, y: 1 },
      { name: 'Shield Fighters', type: 'inf', atk: 96, def: 100, x: 10, y: 5 }
    ],
    intro: [['gongsunsheng', 'Eight bands of eight around the centre, as Zhuge Liang laid out his stones. When they come in, the formation closes behind them like a snake.'], [null, 'Victory: capture Xiang Chong.']],
    events: [
      { turn: 1, run: async function (s, api) {
        await s.say('fanrui', 'Wind!');
        await s.say(null, 'Fan Rui, the Demon King Who Roils the World, rode out with a morning star in one hand and a sword in the other, and called up a wind full of sand and stones.');
        s.sfx('wind'); api.weaken('player', 0.85);
      } },
      { turn: 2, run: async function (s, api) {
        await s.say(null, 'Xiang Chong and Li Gun charged into the formation behind their shields — and the formation closed behind them. Gongsun Sheng pointed his sword, the wind turned, and the two of them, blinded, fell into the pit at the centre. Hooks dragged them out.');
        s.sfx('thunder'); api.rout('Xiang Chong'); api.rout('Li Gun');
      } }
    ],
    win: [['gongsunsheng', 'Both shield-bearers are taken.']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[15].begin = async function (s) {
    await s.chapter(15);
    s.party(['luzhishen']); s.setLeader('luzhishen'); s.level('luzhishen', 28); s.flag('protagonist', 'luzhishen');
    WM.unlock('shaohua', 'huazhou');
    await s.narrate('Lu Zhishen strode west alone, and in a few days came to Mount Shaohua, where Zhu Wu, Chen Da and Yang Chun came down to meet him.');
    await s.warp('shaohua_in', 9, 10, 'up', { noFade: true });
    s.spawn('zw', 'zhuwu', 9, 7, 'down'); s.spawn('cd', 'chenda', 7, 8, 'right'); s.spawn('yc', 'yangchun', 11, 8, 'left');
    await s.fadeIn(0.6);
    await s.say('zhuwu', 'Master! Brother Shi Jin is in the prison of Huazhou. A painter, Wang Yi, was going to the Western Peak temple to paint the walls, with his daughter Yujiao. Prefect He saw the girl, sent the father into exile on a false charge, and took her into his house. Wang Yi met Shi Jin on the road and told him. Shi Jin went to the prefect\'s hall to kill him — and was recognised and taken.');
    await s.say('luzhishen:angry', 'That dog of a prefect! I\'ll go and kill him myself.');
    await s.say('zhuwu', 'Master, wait for Song Jiang! He\'ll bring an army —');
    await s.say('luzhishen:angry', 'Wait? While Shi Jin rots? Never!');
    s.despawn('zw'); s.despawn('cd'); s.despawn('yc');
    s.flag('ch15_alone');
    await s.say(null, '(Go to Huazhou, south-west of Mount Shaohua.)');
  };
  WM.data.chapters[15].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 14; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    WM.data.charOrder.slice(0).forEach(function (id) {
      if (['shijin', 'zhuwu', 'chenda', 'yangchun', 'fanrui', 'xiangchong', 'ligun', 'duanjingzhu', 'suochao', 'guansheng', 'xuanzan', 'haosiwen', 'andaoquan', 'wangdingliu', 'lujunyi', 'yanqing', 'caifu', 'caiqing', 'shantinggui', 'weidingguo', 'jiaoting', 'baoxu', 'yubaosi', 'dongping', 'zhangqing', 'gongwang', 'dingdesun', 'huangfuduan'].indexOf(id) < 0) S.recruit(id, 28);
    });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    ['shijin', 'zhuwu', 'chenda', 'yangchun'].forEach(function (id) { S.initChar(id, 26); });
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou', 'yishui', 'jizhou_n', 'zhujia', 'lijia', 'dengzhou', 'gaotang', 'qingzhou');
    await WM.data.chapters[15].begin(s);
  };

  // ---------------- Huazhou ----------------
  WM.defEvents('huazhou', [
    { id: 'ch15_bridge', x: 21, y: 13, w: 4, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch15_alone'); }, run: async function (s) {
      await s.walkTo('player', 22, 14); s.face('player', 'up');
      await s.say('luzhishen', '(The prefect\'s procession comes over this bridge. I\'ll wait here.)');
      s.spawn('pg1', 'guard', 22, 20, 'up'); s.spawn('he', 'heprefect', 23, 21, 'up'); s.spawn('pg2', 'guard', 24, 20, 'up');
      s.walkTo('pg1', 21, 16); s.walkTo('pg2', 24, 16); await s.walkTo('he', 23, 17);
      await s.emote('he', '!');
      await s.say('heprefect', '(from his sedan chair) ...A monk the size of a temple guardian, with a staff like a mast. Don\'t stop. Back to the hall — quickly.');
      s.walkTo('pg1', 21, 21); s.walkTo('pg2', 24, 21); await s.walkTo('he', 23, 21);
      WM.data.clear(s, ['pg1', 'pg2', 'he']);
      await s.emote('player', '?');
      s.spawn('rn', 'servant', 23, 20, 'up');
      await s.walkTo('rn', 23, 15, { run: true });
      await s.say('servant', 'Reverend master! His Honour the Prefect invites you to a vegetarian meal in the hall.');
      await s.say('luzhishen', '(Ha! The fool\'s inviting me in. I\'ll kill him at his own table.)');
      s.despawn('rn', { leave: true });
      await s.fadeOut(0.6);
      await s.warp('huazhou_in', 8, 9, 'up', { noFade: true });
      var amb = WM.data.troop(s, 'am', 'guard', [[3, 6], [3, 8], [14, 6], [14, 8]], 'right');
      amb.forEach(function (k) { s.hide(k); });
      await s.fadeIn(0.6);
      await s.walkTo('player', 8, 7);
      s.sfx('door'); await s.shake(2, 0.2);
      await s.emote('player', '!');
      amb.forEach(function (k) { s.show(k); });
      await s.say('guard', 'Now! Take him!');
      amb.forEach(function (k, i) { s.walkTo(k, i < 2 ? 7 : 9, i % 2 ? 8 : 7, { run: true }); });
      await s.wait(0.6);
      s.sfx('hit'); await s.shake(4, 0.4);
      await s.say('luzhishen:angry', 'I am the Flowery Monk, Lu Zhishen of Liangshan! Song Jiang will come for me, and then you\'ll see!');
      WM.data.clear(s, amb);
      await s.narrate('Prefect He put him in the heaviest cangue in the prison, and locked up his staff and his knife. Wu Song\'s men, who had followed Lu Zhishen at a distance, ran for Liangshan.');
      s.flag('ch15_taken');
      await s.fadeOut(1);
      s.party(['songjiang', 'wuyong', 'wusong', 'shixiu', 'lijun', 'zhangshun']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      ['songjiang', 'wuyong', 'wusong', 'shixiu', 'lijun', 'zhangshun'].forEach(function (id) { s.level(id, 28); });
      await s.narrate('Song Jiang came with seven thousand men in three columns and camped at Mount Shaohua. But Huazhou\'s walls were high and its moat deep. Then word came: the emperor was sending Marshal Su Yuanjing to the Temple of the Western Peak with a golden bell-hanging, an offering to the god. He would cross the Wei River.');
      await s.say('wuyong:smile', 'Then the Marshal\'s regalia will open Huazhou for us.');
      await s.warp('weiriver', 15, 5, 'down', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);
  WM.defEvents('weiriver', [
    { id: 'ch15_envoy', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_taken'); }, run: async function (s) {
      s.spawn('su', 'suyuanjing', 15, 11, 'up'); s.boat('su');   // the envoy's barge, at the foot of the landing
      s.spawn('g1', 'guard', 14, 10, 'down'); s.spawn('g2', 'guard', 17, 10, 'down');   // two of his guards gone ahead onto the landing
      await s.camera(15, 10, 0.6);   // the view down to the river, so the landing is not behind the words
      await s.narrate('Li Jun, Zhang Shun and Yang Chun had seized the ferry boats. When the envoy\'s barge came down the river, Song Jiang stood on the bank and bowed.');
      await s.say('songjiang', 'Song Jiang of Liangshan begs an audience with the Marshal.');
      await s.say('suyuanjing', 'I am on the emperor\'s business. What business have I with bandits?');
      // Li Jun and Zhang Shun come down the landing at a run, and the two guards go into the river
      s.spawn('lj', 'lijun', 15, 6, 'down'); s.spawn('zs', 'zhangshun', 16, 6, 'down');
      s.moveTo('lj', 15, 10, { run: true }); await s.moveTo('zs', 16, 10, { run: true });
      s.face('g1', 'right'); s.face('g2', 'left'); s.emote('g1', '!'); await s.emote('g2', '!');
      s.face('lj', 'left'); s.face('zs', 'right');
      s.sfx('hit'); s.jump('lj', 3); s.jump('zs', 3);
      s.emote('g1', '?', 0.6); s.emote('g2', '?', 0.6);   // staggering back over the edge, arms going
      s.jump('g1', 10); s.jump('g2', 10); s.move('g1', 'L1', { speed: 34, wait: false, fall: true }); await s.move('g2', 'R1', { speed: 34, fall: true });
      s.splash('g1'); s.splash('g2'); s.hide('g1'); s.hide('g2'); s.despawn('g1'); s.despawn('g2'); await s.shake(2, 0.3);
      await s.wait(0.6);   // the rings spread where they went in
      await s.say('songjiang', 'Forgive my men, Your Excellency — they are rough, and I cannot always hold them. I mean you no harm. I only ask you to step ashore for a moment.');
      s.despawn('su'); s.spawn('su', 'suyuanjing', 15, 7, 'up');   // stepped ashore
      await s.say('songjiang', 'Your Excellency, two of my brothers are in the prison of Huazhou, because a wicked prefect stole a painter\'s daughter. We need your golden bells and your regalia for a single day. We will return every piece, and no harm will come to you. I swear it.');
      await s.say('suyuanjing', '...If I refuse, I see I shall not leave this bank. Take them. But you will answer for it to Heaven, Song Jiang.');
      await s.say('songjiang', 'We wait only for the emperor\'s pardon, Your Excellency, to serve the state. Remember us.');
      s.despawn('su'); s.cameraReset();
      s.flag('ch15_bells');
      await s.narrate('A Liangshan man who looked a little like the Marshal put on his robes and lay behind the curtains of a sedan chair, "ill from the journey."');
      await s.warp('xiyue', 17, 26, 'up');
    } }
  ]);
  WM.defEvents('xiyue', [
    { id: 'ch15_temple', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_bells'); }, run: async function (s) {
      s.spawn('wy', 'wuyong', 17, 22, 'down'); s.spawn('ws', 'wusong', 16, 23, 'down'); s.spawn('sx', 'shixiu', 19, 23, 'down');
      s.hide('player');
      await s.say('wuyong', '(in a master of ceremonies\' robe) Brothers Wu Song, Shi Xiu — stand straight, like imperial guards. Here he comes.');
      s.spawn('he', 'heprefect', 17, 31, 'up'); s.spawn('g1', 'guard', 16, 31, 'up'); s.spawn('g2', 'guard', 19, 31, 'up');
      s.walkTo('g1', 16, 27); s.walkTo('g2', 19, 27); await s.walkTo('he', 17, 25);
      await s.say('heprefect', 'Prefect He of Huazhou, come with three hundred men to welcome the imperial envoy!');
      await s.say('wuyong', 'The Marshal is unwell from the road and cannot see you. But he asks: why did the Prefect not come out to meet him at the river, as the law requires?');
      await s.say('heprefect', 'I — I did not know His Excellency had arrived —');
      await s.say('wuyong', 'Seize him!');
      s.spawn('xz', 'xiezhen', 12, 20, 'right'); s.spawn('xb', 'xiebao', 23, 20, 'left');
      s.walkTo('xz', 16, 25, { run: true }); await s.walkTo('xb', 18, 25, { run: true });
      await s.emote('he', '!');
      s.sfx('slash'); await s.flash(); s.lie('he');
      s.walkTo('ws', 16, 26, { run: true }); s.walkTo('sx', 19, 26, { run: true });
      await s.emote('g1', '!');
      s.walkTo('g1', 15, 31, { run: true }); s.walkTo('g2', 20, 31, { run: true });
      await s.say('guard', 'The envoy\'s men are bandits! Run!');
      ['he', 'g1', 'g2', 'wy', 'ws', 'sx', 'xz', 'xb'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.show('player');
      s.flag('ch15_he');
      await s.warp('huazhou_in', 24, 8, 'up');
    } }
  ]);
  WM.defEvents('huazhou_in', [
    { id: 'ch15_rescue', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_he') && WM.state.x >= 18 && WM.state.x < 30; }, run: async function (s) {
      await s.narrate('Then into Huazhou itself, while the city still thought the envoy was at the temple.');
      s.spawn('j1', 'guard', 22, 6, 'down'); s.spawn('j2', 'guard', 26, 6, 'down');   // the jailers before the cells
      await s.say('guard', 'Halt! No one comes into the prison by night without the Prefect\'s own tally.');
      await s.say('wusong:angry', 'Your Prefect is lying on the temple steps with his head beside him. Here is my tally.');
      await s.say('guard:shock', 'Bandits! Turn out the guard — the Liangshan bandits are in the prison!');
      await s.battle('ch15_jail', { bg: 'town' });
      s.lie('j1'); s.lie('j2');
      s.spawn('sj', 'shijin', 20, 4, 'down'); s.spawn('lz', 'luzhishen', 26, 4, 'down');
      await s.say('shijin', 'Brother Song Jiang! And Master Lu — you came for me, and got yourself caught too!');
      await s.say('luzhishen:smile', 'Ha! I was keeping you company!');
      s.despawn('sj', { leave: true }); s.despawn('lz', { leave: true });
      await s.narrate('They set fire to the prefect\'s hall and emptied the treasury. Then they returned every piece of Su Yuanjing\'s regalia, with gold and silver for his trouble, and let him go on his way. Su Yuanjing went back to the capital and reported that he had been robbed by bandits on the road — and said no more.');
      await s.joinMany(['shijin', 'zhuwu', 'chenda', 'yangchun']);
      s.flag('ch15_freed');
      await s.warp('liangshan_in', 16, 9, 'up');
      s.spawn('sct', 'outlaw', 16, 13, 'up');
      await s.walkTo('sct', 16, 10, { run: true });
      await s.say('outlaw', 'Brother! News from the south. Three chiefs on Mount Mangdang have sworn to swallow Liangshan: Fan Rui, the Demon King Who Roils the World, a sorcerer; Xiang Chong, the Eight-Armed Nezha; and Li Gun, the Great Sage Who Flies in the Sky. Their shields bristle with throwing knives and javelins.');
      s.despawn('sct', { leave: true });
      s.spawn('sj', 'shijin', 14, 9, 'right');
      await s.say('shijin', 'Let me go. I\'ve only just come up the mountain, and I\'ve done nothing yet.');
      s.despawn('sj', { leave: true });
      s.party(['shijin', 'zhuwu', 'chenda', 'yangchun']); s.setLeader('shijin'); s.flag('protagonist', 'shijin');
      ['shijin', 'zhuwu', 'chenda', 'yangchun'].forEach(function (id) { s.level(id, 27); });
      WM.unlock('mangdang');
      await s.say(null, '(Mount Mangdang lies far to the south-east.)');
    } }
  ]);

  // ---------------- Mount Mangdang ----------------
  WM.defEvents('mangdang', [
    { id: 'ch15_mangdang', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_freed'); }, run: async function (s) {
      s.music('tense');
      await s.say('shijin', 'Mount Mangdang. Brothers, this is the first thing we do for Liangshan. Let them see what Shaohua men are made of.');
      s.spawn('xc', 'xiangchong', 13, 26, 'down'); s.spawn('lg', 'ligun', 15, 26, 'down');
      s.move('xc', 'D3', { wait: false }); await s.move('lg', 'D3');
      await s.narrate('Down the mountain came Xiang Chong and Li Gun, each behind a great round shield of oxhide studded with brass, with twenty-four throwing knives on Xiang Chong\'s and twenty-four javelins on Li Gun\'s.');
      await s.say('xiangchong', 'So Liangshan sends us its newest dogs! Go back and tell Song Jiang to bring his own head down the mountain.');
      await s.say('ligun', 'Brother Xiang — the shields!');
      s.music('boss');
      s.despawn('xc'); s.despawn('lg');
      await s.battle('ch15_shields', { bg: 'forest', canLose: true, rounds: 4 });
      await s.say('yangchun:sad', 'Brother Shi Jin — my horse is down! Half our men are hit — we can\'t get near those shields!');
      await s.say('shijin:sad', 'Back! Fall back!');
      s.spawn('hr', 'huarong', 17, 35, 'up'); s.spawn('xn', 'xuning', 19, 35, 'up');
      s.walkTo('hr', 17, 31, { run: true }); await s.walkTo('xn', 19, 31, { run: true });
      await s.say('huarong', 'Brother Shi Jin! Fall back behind us — Song Jiang is coming with Gongsun Sheng!');
      s.despawn('hr'); s.despawn('xn');
      s.party(['songjiang', 'gongsunsheng', 'shijin', 'huarong', 'xuning']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.say('gongsunsheng', 'Did you see the blue lanterns on the mountain last night? There\'s a sorcerer up there. Give me a day. I will lay out a formation.');
      await s.war('ch15_mangdang');
      s.spawn('xc', 'xiangchong', 17, 30, 'up'); s.spawn('lg', 'ligun', 19, 30, 'up');
      await s.say('songjiang', 'Untie them. Bring them new clothes and their horses. ...Brothers, we have long heard of you. If you will not stay, go back to your mountain. If you will, persuade Brother Fan Rui to come too.');
      await s.say('xiangchong', '...We came to destroy you, and you give us our horses back. Brother Li Gun, what do you say?');
      await s.say('ligun', 'I say we go and fetch Fan Rui.');
      s.despawn('xc', { leave: true }); s.despawn('lg', { leave: true });
      await s.fadeOut(0.8); await s.wait(0.4); await s.fadeIn(0.8);
      s.spawn('fr', 'fanrui', 18, 26, 'down'); s.spawn('xc', 'xiangchong', 17, 26, 'down'); s.spawn('lg', 'ligun', 19, 26, 'down');
      s.spawn('gs', 'gongsunsheng', 20, 31, 'up');
      s.walkTo('xc', 17, 29); s.walkTo('lg', 19, 29); await s.walkTo('fr', 18, 29);
      await s.jump('fr');
      await s.say('fanrui', 'Fan Rui of Mangdang kneels to Song Jiang. You gave my brothers back their horses; I give you my mountain.');
      s.face('fr', 'right');
      await s.say('fanrui', '...And that is the one who broke my sorcery. Master Gongsun — I beg you, take me as your disciple. Teach me the true Way of the Five Thunders.');
      await s.say('gongsunsheng:smile', 'If your heart is upright, I will teach you.');
      await s.narrate('They burned the Mangdang stockade and brought their men and stores to Liangshan.');
      ['fr', 'xc', 'lg', 'gs'].forEach(function (k) { s.hide(k); s.despawn(k); });
      await s.joinMany(['fanrui', 'xiangchong', 'ligun']);
      s.flag('ch15_done');
      await s.endChapter();
      if (WM.data.chapters[16].begin) await WM.data.chapters[16].begin(s);
    } }
  ]);
})();
