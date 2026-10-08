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
      s.spawn('he', 'heprefect', 22, 9, 'down');
      await s.narrate('Lu Zhishen waited on the bridge, staff in hand, for the prefect\'s procession. The prefect saw the huge monk from his sedan chair, and did not stop. A little later a runner came out: "His Honour invites the reverend master to a vegetarian meal in the hall."');
      await s.say('luzhishen', '(Ha! The fool\'s inviting me in. I\'ll kill him at his own table.)');
      s.despawn('he');
      await s.narrate('As soon as Lu Zhishen was inside the hall, they shut the gate behind him, and men leapt out from both sides and pinned him down.');
      await s.say('luzhishen:angry', 'I am the Flowery Monk, Lu Zhishen of Liangshan! Song Jiang will come for me, and then you\'ll see!');
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
      s.spawn('su', 'suyuanjing', 15, 12, 'up');
      await s.narrate('Li Jun, Zhang Shun and Yang Chun had seized the ferry boats. When the envoy\'s barge came down the river, Song Jiang stood on the bank and bowed.');
      await s.say('songjiang', 'Song Jiang of Liangshan begs an audience with the Marshal.');
      await s.say('suyuanjing', 'I am on the emperor\'s business. What business have I with bandits?');
      await s.narrate('Li Jun and Zhang Shun leapt aboard and tipped two of the Marshal\'s guards into the river.');
      await s.say('songjiang', 'Forgive my men, Your Excellency — they are rough, and I cannot always hold them. I mean you no harm. I only ask you to step ashore for a moment.');
      s.despawn('su'); s.spawn('su', 'suyuanjing', 15, 7, 'up');
      await s.say('songjiang', 'Your Excellency, two of my brothers are in the prison of Huazhou, because a wicked prefect stole a painter\'s daughter. We need your golden bells and your regalia for a single day. We will return every piece, and no harm will come to you. I swear it.');
      await s.say('suyuanjing', '...If I refuse, I see I shall not leave this bank. Take them. But you will answer for it to Heaven, Song Jiang.');
      await s.say('songjiang', 'We wait only for the emperor\'s pardon, Your Excellency, to serve the state. Remember us.');
      s.despawn('su');
      s.flag('ch15_bells');
      await s.narrate('A Liangshan man who looked a little like the Marshal put on his robes and lay behind the curtains of a sedan chair, "ill from the journey." Wu Yong dressed as the master of ceremonies. Wu Song and Shi Xiu stood at the temple gate as guards.');
      await s.warp('xiyue', 17, 26, 'up');
    } }
  ]);
  WM.defEvents('xiyue', [
    { id: 'ch15_temple', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_bells'); }, run: async function (s) {
      s.spawn('he', 'heprefect', 17, 29, 'up'); s.spawn('g1', 'guard', 16, 30, 'up'); s.spawn('g2', 'guard', 19, 30, 'up');
      s.spawn('wy', 'wuyong', 17, 23, 'down');
      await s.narrate('Prefect He came out to the temple with three hundred men to welcome the imperial envoy.');
      await s.say('wuyong', 'The Marshal is unwell from the road and cannot see you. But he asks: why did the Prefect not come out to meet him at the river, as the law requires?');
      await s.say('heprefect', 'I — I did not know His Excellency had arrived —');
      await s.say('wuyong', 'Seize him!');
      s.sfx('slash');
      await s.narrate('The Xie brothers sprang from behind the pillars. Prefect He died on the temple steps; his three hundred men were cut down or scattered.');
      ['he', 'g1', 'g2', 'wy'].forEach(function (k) { s.despawn(k); });
      s.flag('ch15_he');
      await s.warp('huazhou_in', 24, 8, 'up');
    } }
  ]);
  WM.defEvents('huazhou_in', [
    { id: 'ch15_rescue', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_he') && WM.state.x >= 18 && WM.state.x < 30; }, run: async function (s) {
      await s.narrate('Then into Huazhou itself, while the city still thought the envoy was at the temple.');
      await s.battle('ch15_jail', { bg: 'town' });
      s.spawn('sj', 'shijin', 21, 4, 'down'); s.spawn('lz', 'luzhishen', 26, 4, 'down');
      await s.say('shijin', 'Brother Song Jiang! And Master Lu — you came for me, and got yourself caught too!');
      await s.say('luzhishen:smile', 'Ha! I was keeping you company!');
      s.despawn('sj'); s.despawn('lz');
      await s.narrate('They set fire to the prefect\'s hall and emptied the treasury. Then they returned every piece of Su Yuanjing\'s regalia, with gold and silver for his trouble, and let him go on his way. Su Yuanjing went back to the capital and reported that he had been robbed by bandits on the road — and said no more.');
      await s.joinMany(['shijin', 'zhuwu', 'chenda', 'yangchun']);
      s.flag('ch15_freed');
      await s.narrate('Back at Liangshan, news came from the south: three bandit chiefs on Mount Mangdang had sworn to swallow Liangshan — Fan Rui, the Demon King Who Roils the World, a sorcerer; Xiang Chong, the Eight-Armed Nezha; and Li Gun, the Great Sage Who Flies in the Sky, whose shields bristled with throwing knives and javelins.');
      await s.say('shijin', 'Let me go. I\'ve only just come up the mountain, and I\'ve done nothing yet.');
      s.party(['shijin', 'zhuwu', 'chenda', 'yangchun']); s.setLeader('shijin'); s.flag('protagonist', 'shijin');
      ['shijin', 'zhuwu', 'chenda', 'yangchun'].forEach(function (id) { s.level(id, 27); });
      WM.unlock('mangdang');
      await s.say(null, '(Mount Mangdang lies far to the south-east.)');
    } }
  ]);

  // ---------------- Mount Mangdang ----------------
  WM.defEvents('mangdang', [
    { id: 'ch15_mangdang', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch15_freed'); }, run: async function (s) {
      s.music('boss');
      await s.narrate('Down the mountain came Xiang Chong and Li Gun, each behind a great round shield of oxhide studded with brass, with twenty-four throwing knives on Xiang Chong\'s and twenty-four javelins on Li Gun\'s.');
      await s.battle('ch15_shields', { bg: 'forest', canLose: true, rounds: 4 });
      await s.narrate('The knives and javelins came out from behind the shields faster than Shi Jin\'s men could see them. Half the Shaohua men fell; Yang Chun\'s horse was wounded under him. Then Hua Rong and Xu Ning came up with fresh troops, and Song Jiang behind them with Gongsun Sheng.');
      s.party(['songjiang', 'gongsunsheng', 'shijin', 'huarong', 'xuning']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.say('gongsunsheng', 'Did you see the blue lanterns on the mountain last night? There\'s a sorcerer up there. Give me a day. I will lay out a formation.');
      await s.war('ch15_mangdang');
      s.spawn('xc', 'xiangchong', 17, 30, 'up'); s.spawn('lg', 'ligun', 19, 30, 'up');
      await s.say('songjiang', 'Untie them. Bring them new clothes and their horses. ...Brothers, we have long heard of you. If you will not stay, go back to your mountain. If you will, persuade Brother Fan Rui to come too.');
      await s.say('xiangchong', '...We came to destroy you, and you give us our horses back. Brother Li Gun, what do you say?');
      await s.say('ligun', 'I say we go and fetch Fan Rui.');
      s.despawn('xc'); s.despawn('lg');
      await s.narrate('Fan Rui came down the mountain with them the next day and knelt to Song Jiang. When he saw Gongsun Sheng, he begged to become his disciple and learn the true Way of the Five Thunders. Then they burned their stockade and brought their men and stores to Liangshan.');
      await s.joinMany(['fanrui', 'xiangchong', 'ligun']);
      s.flag('ch15_done');
      await s.endChapter();
      if (WM.data.chapters[16].begin) await WM.data.chapters[16].begin(s);
    } }
  ]);
})();
