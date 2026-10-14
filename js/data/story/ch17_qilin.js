// Chapter 17 — "The Jade Qilin" (novel chapters 61–67).
// Wu Yong the fortune-teller and his mute acolyte; Lu Junyi's journey and the gauntlet below Liangshan; Li Gu and
// Lady Jia; Yan Qing's crossbow; Shi Xiu's leap from the tavern; Guan Sheng; Suo Chao in the snow; Song Jiang's boil and
// Chao Gai's ghost; Zhang Shun, An Daoquan and Wang Dingliu; the Lantern Festival at Daming; Lingzhou.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('ligu', 'Li Gu', { skin: '#f0c49a', hairStyle: 'scarf', band: '#2a2a2a', beard: 'mustache', body: '#5a4a3a', trim: '#c8b890', face: 'narrow', eyes: 'sharp', brows: 'angled' }, { face: true });
  WM.npc('jiashi', 'Lady Jia', { skin: '#f6e2cc', hairStyle: 'woman', body: '#8a3a6a', trim: '#f0d8a0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#f0a0c0', lips: '#c03040' }, { face: true });
  WM.npc('zhangwang', 'Zhang Wang', { skin: '#a8784e', hairStyle: 'headband', band: '#2a2a2a', beard: 'stubble', body: '#3a3a3a', trim: '#5a4a3a', weapon: 'dao', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('liqiaonu', 'Li Qiaonu', { skin: '#f6e2cc', hairStyle: 'woman', body: '#d86a8a', trim: '#f0e0c0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#ff90b0', lips: '#d04050' }, { face: true });
  WM.npc('wangfather', 'Old Wang', { skin: '#d8a070', hair: '#c8c8c0', hairStyle: 'scarf', band: '#4a3a2a', beard: 'long', beardColor: '#d8d8d0', body: '#5a4a3a', trim: '#a89a7a', face: 'round', eyes: 'narrow' }, { face: true });

  var hum = WM.hum, C = WM.data.chars;
  WM.enemy('lu_liutang', 'Liu Tang', 27, hum(C.liutang.look), { hp: 1.3, atk: 0.62, exp: 300, gold: 0, boss: true });
  WM.enemy('lu_muhong', 'Mu Hong', 27, hum(C.muhong.look), { hp: 1.3, atk: 0.62, exp: 300, gold: 0, boss: true });
  WM.enemy('lu_liying', 'Li Ying', 27, hum(C.liying.look), { hp: 1.3, atk: 0.62, exp: 300, gold: 0, boss: true, range: 'L', fx: 'arrow' });
  WM.enemy('dm_guard', 'Daming Guard', 27, hum(WM.enemyLooks.soldier), { atk: 0.85, range: 'M', exp: 150, drops: [['medicine', 0.15]] });
  WM.enemy('dm_jailer', 'Daming Jailer', 26, hum(WM.enemyLooks.constable), { hp: 0.7, atk: 0.62, exp: 150 });
  WM.enemy('zhangwang_foe', 'Zhang Wang', 27, hum(WM.data.npcs.zhangwang.look), { hp: 2.0, exp: 360, gold: 400, boss: true });
  WM.enemy('sunwu_foe', 'Sun Wu', 25, hum(WM.enemyLooks.thug), { hp: 1.2, exp: 200, gold: 100, fx: 'blunt' });
  WM.enemy('lz_soldier', 'Lingzhou Soldier', 30, hum(WM.enemyLooks.soldier), { range: 'M', exp: 160, drops: [['medicine', 0.15]] });
  WM.enemy('lz_fire', 'Divine Fire Trooper', 30, hum({ skin: '#c8905e', hairStyle: 'helmet', helmColor: '#c8302a', tassel: '#ffb040', body: '#c83a1a', trim: '#ffd040', weapon: 'spear' }), { range: 'M', exp: 160, fx: 'fire', skills: [{ name: 'Fire Gourd', chance: 0.3, type: 'magic', power: 30, fx: 'fire', sfx: 'fire' }] });
  var T = WM.data.troops;
  T.ch17_trio = { enemies: ['lu_liutang', 'lu_muhong', 'lu_liying'], bg: 'forest', noRun: true };
  T.ch17_execution = { enemies: ['dm_guard', 'dm_guard', 'dm_guard', 'dm_guard'], bg: 'town', noRun: true };
  T.ch17_zhangwang = { enemies: ['sunwu_foe', 'zhangwang_foe'], bg: 'river', boss: true };
  T.ch17_prison = { enemies: ['dm_jailer', 'dm_guard', 'dm_jailer'], bg: 'night', noRun: true };
  T.ch17_escort = { enemies: ['lz_soldier', 'lz_fire', 'lz_soldier'], bg: 'forest', noRun: true };

  function duelVs(id, hero, foe, hp, atk, fhp, fatk, intro, draw, o) {
    WM.data.duels[id] = Object.assign({ hero: hero, foe: foe, bg: 'forest', heroHp: hp, heroAtk: atk, foeHp: fhp, foeAtk: fatk, drawAfter: 3, intro: intro,
      lines: { attack: ['Hah!', 'Take this!', 'There!'], wild: ['All my strength!', 'Fall!', 'Down!'], defend: ['Steady...', 'Come on.', 'Hm.'] }, draw: draw }, o || {});
  }
  duelVs('lu_likui', 'lujunyi', 'likui', 820, 60, 560, 46, [['foe:smile', 'Hey, rich man! Recognise the mute acolyte?'], ['hero:angry', 'You! The fortune-teller\'s boy! So this was all a Liangshan trick!']], [[null, 'Li Kui broke off and ran into the trees, laughing. Lu Junyi chased him, and lost him.']]);
  duelVs('lu_luzhishen', 'lujunyi', 'luzhishen', 820, 60, 720, 54, [['foe', 'Squire Lu! The brothers on the mountain have been waiting for you!'], ['hero:angry', 'Out of my way, monk!']], [[null, 'Lu Zhishen dragged his staff and fell back into the woods.']]);
  duelVs('lu_wusong', 'lujunyi', 'wusong', 820, 60, 640, 54, [['foe', 'Wu Song. Come with us, Squire Lu.'], ['hero:angry', 'Never!']], [[null, 'Wu Song gave way and slipped back among the trees.']]);
  duelVs('linchong_guansheng', 'linchong', 'guansheng', 700, 56, 760, 58, [['foe', 'I am Guan Sheng, of the line of Guan Yu. Bandits, kneel.'], ['hero:angry', 'Lin Chong. Come and see what a bandit can do.']], [['songjiang', 'Stop! Brother Lin Chong, stop! — I want that man for Liangshan, not dead.']], { bg: 'field' });
  duelVs('likui_jiaoting', 'likui', 'jiaoting', 520, 44, 600, 52, [['foe', 'You\'re in my way, darkie.'], ['hero:angry', 'Who are you calling — !']], [[null, 'Jiao Ting caught Li Kui by the arm and threw him flat, and when he got up, threw him again.']], { bg: 'forest' });
  duelVs('guansheng_shan', 'guansheng', 'shantinggui', 760, 60, 600, 50, [['foe', 'Guan Sheng! You took the government\'s pay and went over to the bandits?'], ['hero', 'Shan Tinggui. I went over to men of honour. Come.']], [[null, 'Guan Sheng\'s great blade flashed, and Shan Tinggui went down from his horse, stunned by the flat of it.']], { bg: 'field', drawAfter: 0 });

  WM.data.wars.ch17_daming = {
    name: 'Before the Gates of Daming', goal: 'rout', turns: 15, music: 'war',
    map: [
      '.......mm....#',
      '..TT.........#',
      '.......::...:G',
      '::::::::::::.G',
      '.......::...:G',
      '..TT.........#',
      '.......mm....#'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'qinming', support: ['hantao'], type: 'cav', x: 3, y: 2 },
      { leader: 'linchong', support: ['huarong'], type: 'cav', x: 3, y: 4 },
      { leader: 'likui', type: 'inf', x: 4, y: 3 },
      { leader: 'husanniang', support: ['sunerniang', 'gudasao'], type: 'cav', x: 2, y: 1 },
      { leader: 'lingzhen', type: 'arch', x: 1, y: 5 }
    ],
    enemy: [
      { name: 'Suo Chao', portrait: 'suochao', type: 'cav', atk: 116, def: 96, x: 9, y: 2 },
      { name: 'Li Cheng', type: 'cav', atk: 104, def: 96, x: 10, y: 4 },
      { name: 'Wen Da', type: 'cav', atk: 102, def: 96, x: 11, y: 3 },
      { name: 'Daming Foot', type: 'inf', atk: 92, def: 98, x: 11, y: 1 },
      { name: 'Daming Foot', type: 'inf', atk: 92, def: 98, x: 11, y: 5 },
      { name: 'Daming Archers', type: 'arch', atk: 90, def: 66, x: 12, y: 3 }
    ],
    intro: [['songjiang', 'Lu Junyi and Shi Xiu are behind those walls. We will not leave without them.'], [null, 'Victory: rout every enemy unit.']],
    events: [{ turn: 3, run: async function (s, api) {
      await s.say(null, 'Han Tao\'s arrow took Suo Chao, the Vanguard Hothead, in the arm, and he fell back behind the gates.');
      var u = api.unit('Suo Chao'); if (u) u.losses = Math.max(u.losses, 1);
    } }],
    win: [['songjiang', 'They\'ve shut the gates. Surround the city!']], lose: [['songjiang:sad', 'Fall back!']]
  };
  WM.data.wars.ch17_lantern = {
    name: 'The Lantern Festival', goal: 'rout', turns: 10, music: 'war',
    map: [
      '#..::::::::..#',
      '#.:..#..#..:.#',
      'G::::::::::::G',
      '#.:..#..#..:.#',
      'G::::::::::::G',
      '#.:..#..#..:.#',
      '#..::::::::..#'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 2, commander: true },
      { leader: 'guansheng', support: ['xuanzan', 'haosiwen'], type: 'cav', x: 0, y: 4 },
      { leader: 'suochao', type: 'cav', x: 13, y: 2 },
      { leader: 'leiheng', support: ['fanrui'], type: 'inf', x: 13, y: 4 },
      { leader: 'shiqian', type: 'inf', x: 6, y: 0 },
      { leader: 'likui', support: ['xiezhen', 'xiebao'], type: 'inf', x: 7, y: 6 }
    ],
    enemy: [
      { name: 'Li Cheng', type: 'cav', atk: 104, def: 96, x: 6, y: 3, commander: true },
      { name: 'Wen Da', type: 'cav', atk: 102, def: 96, x: 8, y: 3 },
      { name: 'Daming Guard', type: 'inf', atk: 92, def: 98, x: 4, y: 2 },
      { name: 'Daming Guard', type: 'inf', atk: 92, def: 98, x: 9, y: 4 },
      { name: 'Daming Archers', type: 'arch', atk: 90, def: 66, x: 7, y: 1 }
    ],
    intro: [['wuyong', 'When the Cuiyun Tower burns, every man strikes at once — at the gates, at the yamen, at the prison.'], [null, 'Victory: rout every enemy unit.']],
    events: [{ turn: 1, run: async function (s, api) {
      await s.say(null, 'The Cuiyun Tower went up in flames over the lantern-lit streets. All over the city, the hunters, beggars, monks and pedlars of the festival crowd drew their weapons.');
      s.sfx('fire'); api.weaken('enemy', 0.8);
    } }],
    win: [['songjiang', 'Daming is ours. Find Brother Lu Junyi!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[17].begin = async function (s) {
    await s.chapter(17);
    s.party(['wuyong', 'likui']); s.setLeader('wuyong'); s.flag('protagonist', 'wuyong');
    ['wuyong', 'likui'].forEach(function (id) { s.level(id, 30); });
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('sj', 'songjiang', 15, 6, 'down');
    await s.fadeIn(0.6);
    await s.say('likui', 'Professor, take me with you to Daming!');
    await s.say('wuyong', 'Then three conditions. First, no wine. Second, you will dress as a Daoist acolyte and walk behind me. Third — and this is the hardest — from the moment we leave until the moment we return, you will not say one single word. You are a mute.');
    await s.say('likui', 'Not a word? ...Fine. I\'ll hold a copper coin in my mouth.');
    await s.say('songjiang', '...Brother Wu Yong, are you sure about this?');
    s.despawn('sj');
    WM.unlock('daming');
    await s.narrate('So Wu Yong, as the fortune-teller "Zhang Yong," with a brass bell in his hand, and Li Kui behind him, in a Daoist cap, with a forked stick and a sign reading "Fortunes Told: One Tael," went north to Daming.');
    await s.warp('daming', 28, 42, 'up');
  };
  WM.data.chapters[17].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 16; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall');
    var later = ['suochao', 'guansheng', 'xuanzan', 'haosiwen', 'andaoquan', 'wangdingliu', 'lujunyi', 'yanqing', 'caifu', 'caiqing', 'shantinggui', 'weidingguo', 'jiaoting', 'baoxu', 'yubaosi', 'dongping', 'zhangqing', 'gongwang', 'dingdesun', 'huangfuduan'];
    WM.data.charOrder.forEach(function (id) { if (later.indexOf(id) < 0) S.recruit(id, 30); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'zhujia', 'lijia', 'gaotang', 'qingzhou', 'huazhou', 'mangdang', 'zengtou');
    await WM.data.chapters[17].begin(s);
  };

  // ---------------- Daming: the fortune-teller ----------------
  WM.defEvents('daming', [
    { id: 'ch17_gate', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 17 && !S.has('ch17_fortune'); }, run: async function (s) {
      s.spawn('gd', 'guard', 27, 40, 'down');
      await s.say('guard', 'Halt. Who are you — and what\'s wrong with your boy? Look at those eyes. He looks like a murderer.');
      await s.say('wuyong', 'Ah, my poor acolyte. Dumb from birth, and simple. But he carries my things faithfully. Fortunes told, officer — one tael!');
      await s.say('likui', '...!');
      s.despawn('gd');
      await s.narrate('All the way up the street the children ran after them, laughing at the ugly mute acolyte and chanting Wu Yong\'s cry: "Fate, fortune, the times, and the turns — know the living, know the dead, know the rich, know the poor!"');
      s.flag('ch17_gate');
      await s.say(null, '(Go to Lu Junyi\'s mansion, in the north-west of the city.)');
    } }
  ]);
  WM.defEvents('daming_in', [
    { id: 'ch17_fortune', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_gate') && WM.state.x >= 24 && WM.state.x < 40 && WM.state.y <= 10; }, run: async function (s) {
      s.addParty('lujunyi'); s.removeParty('lujunyi');
      s.spawn('lu', 'lujunyi', 31, 4, 'down'); s.spawn('yq', 'yanqing', 34, 5, 'left'); s.spawn('lg', 'ligu', 28, 5, 'right');
      await s.say('lujunyi', 'Master Zhang. They say you can read a man\'s fate. Read mine. I was born in the year of —');
      await s.narrate('Wu Yong counted on his fingers, and then slammed the table.');
      await s.say('wuyong', 'Strange! Within a hundred days, blood will fall on you. Your family will be scattered and your fortune lost, and you will die under the blade.');
      await s.say('lujunyi', 'Ha! I have lived honestly, I have never broken a law, I have no enemies. How can I die under the blade?');
      await s.say('wuyong', '...Then return my tael. Men will hear only flattery. I will go.');
      await s.say('lujunyi', 'Wait, wait! Master, forgive me. Is there a way to escape it?');
      await s.say('wuyong', 'Only one. Go more than a thousand li to the south-east. There the disaster will pass you by. And let me leave four lines on your wall, as a charm. In time you will understand them.');
      await s.narrate('Lu Junyi wrote on the wall as Wu Yong recited: four lines of verse about a boat among the reeds, a hero, and righteousness. No one noticed that the first characters of the four lines, read downwards, said: "Lu Junyi rebels."');
      s.despawn('lg', { leave: true });
      await s.say('yanqing', 'Master, that fortune-teller is a Liangshan spy. The south-east road goes right past Liangshan. Let me go after him and deal with him.');
      await s.say('lujunyi', 'Nonsense, Little Yi. I am going to burn incense at Mount Tai and escape my fate. And if the bandits come, I\'ll take them all.');
      s.despawn('lu', { leave: true }); s.despawn('yq', { leave: true });
      s.flag('ch17_fortune');
      await s.narrate('Wu Yong and Li Kui left the city. Li Kui took the coin out of his mouth at last and swore for a whole li without stopping.');
      await s.fadeOut(1);
      s.party(['lujunyi']); s.setLeader('lujunyi'); s.level('lujunyi', 31); s.flag('protagonist', 'lujunyi');
      await s.narrate('Lu Junyi set out with ten carts of goods and forty porters, his steward Li Gu going ahead. Yan Qing, his foundling servant — a tattooed youth who could sing, play, wrestle, and shoot a crossbow better than any man in Daming — he left at home. At the last inn before the marsh, Lu had four white banners made, and wrote on them: "Lu Junyi of Daming, mighty in arms, comes to take the bandits of Liangshan."');
      await s.warp('lsroad', 0, 12, 'right', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);

  // ---------------- the gauntlet ----------------
  WM.defEvents('lsroad', [
    { id: 'ch17_g1', x: 9, y: 10, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_fortune'); }, run: async function (s) {
      await s.narrate('In the forest, a gong sounded, and the carts were surrounded. A black giant with two axes jumped into the road.');
      await s.duel('lu_likui', { hero: 'lujunyi', canLose: true });
      s.flag('ch17_g1');
    } },
    { id: 'ch17_g2', x: 19, y: 7, w: 3, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_g1'); }, run: async function (s) {
      await s.duel('lu_luzhishen', { hero: 'lujunyi', canLose: true });
      s.flag('ch17_g2');
    } },
    { id: 'ch17_g3', x: 28, y: 12, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_g2'); }, run: async function (s) {
      await s.duel('lu_wusong', { hero: 'lujunyi', canLose: true });
      s.flag('ch17_g3');
    } },
    { id: 'ch17_g4', x: 33, y: 12, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_g3'); }, run: async function (s) {
      await s.narrate('Three horsemen came at him together, in a triangle: Liu Tang, Mu Hong and Li Ying.');
      await s.battle('ch17_trio', { bg: 'forest', canLose: true, rounds: 4 });
      await s.narrate('A gong sounded on the hill, and the three wheeled away. Above the trees Lu Junyi saw a great yellow banner: "Act on Heaven\'s Behalf."');
      s.flag('ch17_hill');
    } },
    { id: 'ch17_g5', x: 36, y: 7, w: 3, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_hill'); }, run: async function (s) {
      s.spawn('sj', 'songjiang', 37, 4, 'down'); s.spawn('wy', 'wuyong', 36, 4, 'down'); s.spawn('gs', 'gongsunsheng', 38, 4, 'down');
      await s.say('wuyong', 'Squire Lu! Brother Song Jiang has long admired you. The fortune-teller was me. Come up the mountain, and share our righteous cause.');
      await s.say('lujunyi:angry', 'Bandits! Come down and fight me!');
      s.spawn('hr', 'huarong', 35, 5, 'down');
      s.sfx('arrow'); await s.flash();
      ['sj', 'wy', 'gs', 'hr'].forEach(function (k) { s.despawn(k, { leave: true }); });   // the chiefs melt back into the hill as the others close in
      await s.narrate('An arrow sang down from the hill and cut the red tassel from Lu Junyi\'s hat. Then from both sides came Qin Ming, Lin Chong, Huyan Zhuo and Xu Ning. Lu Junyi had been fighting since dawn and had not eaten. He turned and fled east, towards the water.');
      s.night(true);
      s.flag('ch17_flee');
    } },
    { id: 'ch17_boat', x: 50, y: 10, w: 5, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_flee'); }, run: async function (s) {
      s.spawn('lj', 'lijun', 54, 12, 'left');
      await s.say('lujunyi', 'Boatman! Take me across and I\'ll pay you whatever you ask!');
      await s.say('lijun', 'Get in. ...Do you know who I am? Li Jun, the Dragon of the Turbulent River. Squire Lu, you\'ll come up the mountain.');
      await s.narrate('Lu Junyi lunged with his spear. Li Jun turned a somersault backwards into the water. Then the boat lurched: a pale figure had come up from under it — Zhang Shun, the White Streak in the Waves — and tipped it over, and Lu Junyi went into the lake.');
      s.despawn('lj', { leave: true });
      s.night(false);
      s.flag('ch17_taken');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch17_refuse', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_taken') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('sj', 'songjiang', 15, 5, 'down'); s.spawn('wy', 'wuyong', 13, 6, 'right');
      await s.say('songjiang', 'Squire Lu, forgive the way we brought you. We have long admired you. Stay with us — and be the lord of this mountain.');
      await s.say('lujunyi', 'I have lived all my life as a loyal subject. I would rather die than be a bandit.');
      await s.say('wuyong', 'Then stay a few days as our guest, at least. ...Li Gu! Take the carts home ahead of your master. And tell Lady Jia: Squire Lu wrote four lines on his wall. Read the first character of each.');
      s.despawn('sj'); s.despawn('wy');
      await s.narrate('Lu Junyi stayed on the mountain for more than two months, feasted by one chief after another. At last they let him go.');
      s.flag('ch17_released');
      await s.warp('daming', 28, 42, 'up');
    } }
  ]);
  WM.defEvents('daming', [
    { id: 'ch17_beggar', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_released'); }, run: async function (s) {
      s.spawn('yq', 'yanqing', 28, 40, 'down');
      await s.say('yanqing:sad', 'Master! Master, it\'s me, Little Yi. Don\'t go into the city! Li Gu came back and went to the prefecture and denounced you as a rebel — the poem on the wall. He and the mistress... they have been together a long time. He threw me out of the house, and I\'ve been begging in the streets.');
      await s.say('lujunyi:angry', 'Lies! My wife has been with me five years, and Li Gu owes me everything. You beggar — you\'re the one who\'s been up to something!');
      await s.narrate('Lu Junyi kicked Yan Qing aside and went in at the gate.');
      s.despawn('yq', { leave: true });
      s.flag('ch17_home');
      await s.say(null, '(Go home.)');
    } }
  ]);
  WM.defEvents('daming_in', [
    { id: 'ch17_arrest', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_home') && WM.state.x >= 24 && WM.state.x < 40 && WM.state.y <= 10; }, run: async function (s) {
      s.spawn('lg', 'ligu', 31, 4, 'down'); s.spawn('js', 'jiashi', 33, 4, 'down');
      await s.say('jiashi:sad', 'Husband, you\'re home...');
      await s.say('lujunyi', 'Where is Yan Qing?');
      await s.say('ligu', 'Don\'t ask about him now, master. Eat first.');
      s.spawn('c1', 'constable', 28, 8, 'up'); s.spawn('c2', 'constable', 34, 8, 'up');
      await s.narrate('Before he had finished his rice, the constables of the prefecture burst in and bound him.');
      ['lg', 'js', 'c1', 'c2'].forEach(function (k) { s.despawn(k); });
      await s.narrate('Governor Liang had him beaten until he confessed to dealing with Liangshan. Li Gu bribed the jailer, Cai Fu — the Iron Arm — and his brother Cai Qing, the Single Flower, with five hundred taels to finish Lu Junyi in prison. But that night a gentleman in fine clothes called on Cai Fu with a thousand taels of gold: Chai Jin. "If Lu Junyi dies, Liangshan will come to Daming, and nobody will be spared." Cai Fu kept Lu alive. He was sentenced to exile on Shamen Island instead — and his escorts were Dong Chao and Xue Ba.');
      s.flag('ch17_exile');
      WM.state.chars.lujunyi.equip.acc = 'cangue';
      await s.warp('shamenroad', 14, 9, 'up');
    } }
  ]);
  WM.defEvents('shamenroad', [
    { id: 'ch17_crossbow', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_exile'); }, run: async function (s) {
      s.spawn('dc', 'dongchao', 13, 9, 'right'); s.spawn('xb', 'xueba', 15, 8, 'down');
      await s.say('xueba', 'Squire, Li Gu paid us well. Don\'t blame us. Blame him.');
      await s.say('dongchao', 'Tie him to the tree. Make it quick.');
      s.sfx('arrow'); await s.flash();
      await s.narrate('An arrow from a crossbow took Xue Ba in the throat. Dong Chao turned — and the second took him in the heart. Out of the pines came Yan Qing, with his little crossbow.');
      s.lie('dc'); s.lie('xb');   // shot dead under the pines
      s.spawn('yq', 'yanqing', 12, 9, 'right');
      await s.say('yanqing', 'Master! I followed you all the way.');
      await s.say('lujunyi:sad', 'Little Yi... I should have listened to you.');
      WM.state.chars.lujunyi.equip.acc = null;
      await s.narrate('But Lu Junyi\'s legs were broken by beating and he was sick with fever. Yan Qing carried him on his back to a village inn — and there the constables, who had found the bodies, caught Lu Junyi again. Yan Qing, out buying food, saw it from a distance and ran for Liangshan. On the road he met Yang Xiong and Shi Xiu.');
      s.despawn('yq', { leave: true });
      s.party(['shixiu']); s.setLeader('shixiu'); s.level('shixiu', 30); s.flag('protagonist', 'shixiu');
      await s.narrate('Yang Xiong took Yan Qing to the mountain. Shi Xiu went straight to Daming alone — and arrived on the day Lu Junyi was to be beheaded at the crossroads.');
      s.flag('ch17_leap');
      await s.warp('daming_in', 57, 14, 'up');
    } }
  ]);
  WM.defEvents('daming_in', [
    { id: 'ch17_shixiu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_leap') && WM.state.x >= 51 && WM.state.y >= 10; }, run: async function (s) {
      await s.narrate('Shi Xiu sat at the upstairs window of a tavern over the crossroads with a jug of wine, and watched them bring Lu Junyi out and kneel him down. At noon the executioner raised his sword.');
      await s.say('shixiu:angry', 'THE HEROES OF LIANGSHAN ARE ALL HERE!');
      s.sfx('slash'); await s.shake(6, 0.4);
      await s.narrate('He leapt from the window into the square with a sword in each hand, cut down the executioner and a dozen guards, seized Lu Junyi by the arm, and ran. But he did not know the streets of Daming, and the gates had been shut.');
      await s.battle('ch17_execution', { bg: 'town', canLose: true, rounds: 4 });
      await s.narrate('They were taken together. Shi Xiu, in chains, cursed Governor Liang to his face as a slave of Cai Jing\'s. The next morning, notices were found all over Daming, pasted up in the night: if Lu Junyi and Shi Xiu were harmed, Liangshan would come and burn the city to the ground.');
      s.flag('ch17_caught');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);

  // ---------------- Liangshan marches: Guan Sheng, Suo Chao, the boil ----------------
  WM.defEvents('liangshan_in', [
    { id: 'ch17_march', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_caught') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.party(['songjiang', 'wuyong', 'linchong', 'qinming', 'huarong', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.war('ch17_daming');
      await s.narrate('Song Jiang surrounded Daming. Governor Liang wrote to his father-in-law, Cai Jing, and Cai Jing\'s clerk Xuan Zan, the Ugly Prince Consort, recommended a descendant of Guan Yu — Guan Sheng of Pudong, who carried a green-dragon blade like his ancestor\'s, with his sworn brother Hao Siwen. Guan Sheng did not march to Daming. He marched on Liangshan itself — "besiege Wei to save Zhao" — and Song Jiang had to raise the siege and hurry home.');
      await s.duel('linchong_guansheng', { hero: 'linchong', canLose: true });
      await s.narrate('Zhang Heng tried to raid Guan Sheng\'s camp at night and was taken; Ruan Xiaoqi went to rescue him without orders and was taken too. Then Huyan Zhuo rode into Guan Sheng\'s camp, saying he had come over, and offered to lead him by night to take Song Jiang. Guan Sheng followed the red lantern — into the hooks. Qin Ming and Sun Li took Xuan Zan; Hu Sanniang lassoed Hao Siwen.');
      s.spawn('gs', 'guansheng', 15, 7, 'up');
      await s.say('songjiang', 'General, forgive us. Huyan Zhuo only did what I asked. We are waiting for the emperor\'s pardon; until then, we are men driven here by injustice. Will you stay with us?');
      await s.say('guansheng', 'I am a beaten general. If you will have me, I will serve you as a common soldier.');
      s.despawn('gs', { leave: true });
      await s.joinMany(['guansheng', 'xuanzan', 'haosiwen']);
      await s.narrate('It was winter when they marched on Daming again. Suo Chao came out to meet them in the snow — and Wu Yong had had pits dug along the river road and covered with the snow. Li Jun drew Suo Chao after him, and down he went. Yang Zhi, who had once been his comrade in Daming, talked to him for a long time.');
      await s.join('suochao');
      s.music('sad');
      await s.narrate('But Song Jiang fell ill. A boil rose on his back, and he burned with fever. One night as he lay half-asleep, a cold wind blew through the tent.');
      s.flag('ghost:chaogai');
      s.spawn('cg', 'chaogai', 15, 6, 'down');
      await s.say('chaogai:sad', 'Brother... you have a hundred days of calamity upon you, and only a man of the south, the Earth Spirit Star, can save you. Withdraw while you can.');
      await s.say('songjiang:shock', 'Brother Chao Gai! Brother —');
      s.despawn('cg', { leave: true }); s.unflag('ghost:chaogai');
      s.spawn('zs', 'zhangshun', 17, 7, 'left');
      await s.say('zhangshun', 'The Earth Spirit Star... there is a physician in Jiankang, An Daoquan, the Miraculous Doctor. He cured my mother once. Let me go and fetch him.');
      s.despawn('zs', { leave: true });
      s.party(['zhangshun']); s.setLeader('zhangshun'); s.level('zhangshun', 30); s.flag('protagonist', 'zhangshun');
      s.flag('ch17_doctor');
      await s.narrate('Zhang Shun went south through the snow and reached the Yangtze at dusk.');
      await s.warp('yangtze', 19, 2, 'down');
    } }
  ]);

  // ---------------- the Yangtze, Jiankang ----------------
  WM.defEvents('yangtze', [
    { id: 'ch17_ferry', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_doctor'); }, run: async function (s) {
      s.spawn('zw', 'zhangwang', 19, 6, 'up');
      await s.say('zhangwang', 'Going across in this snow? Get in, I\'ll take you.');
      await s.narrate('In the middle of the river, the ferryman — Zhang Wang, the River-Cutting Ghost — and his partner Sun Wu, the Oily Loach, jumped on Zhang Shun, tied him hand and foot, took his gold, and threw him into the Yangtze.');
      s.despawn('zw');
      await s.narrate('Zhang Shun, who could stay under water for seven days and nights, bit through his ropes under the ice-cold river and swam ashore. Half-frozen, he crawled to the lamp of a little tavern on the south bank.');
      s.flag('ch17_swim');
      await s.warp('yangtze_in', 6, 6, 'up');
    } }
  ]);
  WM.defEvents('yangtze_in', [
    { id: 'ch17_wang', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_swim'); }, run: async function (s) {
      s.spawn('wf', 'wangfather', 5, 4, 'down'); s.spawn('wd', 'wangdingliu', 7, 4, 'down');
      await s.say('wangfather', 'A drowned man! Quick, son, dry clothes and hot wine!');
      await s.say('wangdingliu', 'I\'m Wang Dingliu — they call me the Lightning Flash, I run so fast. Zhang Wang? That devil has robbed half the travellers on this river. I\'d give anything to join Liangshan. Brother, take me with you.');
      await s.say('zhangshun', 'When I come back this way, I\'ll take you. And I\'ll settle with Zhang Wang.');
      s.despawn('wf'); s.despawn('wd');
      s.flag('ch17_jiankang');
      await s.warp('jiankang', 19, 2, 'down');
    } }
  ]);
  WM.defEvents('jiankang_in', [
    { id: 'ch17_an', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_jiankang') && WM.state.x < 14; }, run: async function (s) {
      s.spawn('an', 'andaoquan', 6, 4, 'down');
      await s.say('andaoquan', 'Zhang Shun! ...Song Jiang, with a boil on his back? Of course I\'ll come. But — my wife is dead, and there is a woman here, Li Qiaonu. She won\'t let me go anywhere. Come with me tonight, and I\'ll tell her.');
      s.despawn('an');
      s.night(true);
      s.flag('ch17_qiaonu');
      await s.warp('jiankang_in', 21, 8, 'up');
    } },
    { id: 'ch17_blood', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_qiaonu') && WM.state.x >= 14; }, run: async function (s) {
      s.spawn('lq', 'liqiaonu', 20, 4, 'down'); s.spawn('an', 'andaoquan', 18, 5, 'right');
      await s.say('liqiaonu:angry', 'Go to Shandong? To the bandits? If you go, I\'ll curse you every day you\'re gone!');
      await s.narrate('An Daoquan drank himself into a stupor and was put to bed. Late in the night, Zhang Shun heard a man come in by the back way — and knew the voice. It was Zhang Wang, with his share of Zhang Shun\'s gold, come to spend it on Li Qiaonu.');
      s.despawn('lq'); s.despawn('an', { leave: true });
      await s.fadeOut(1);
      await s.narrate('Zhang Shun took a kitchen knife. Zhang Wang got away out of the window. Li Qiaonu and the servants who saw Zhang Shun did not. Then Zhang Shun dipped his finger in the blood and wrote on the wall: "The killer is An Daoquan."');
      await s.fadeIn(1);
      s.spawn('an', 'andaoquan', 18, 5, 'right');
      await s.say('andaoquan:shock', 'What have you done?! You\'ve ruined me!');
      await s.say('zhangshun', 'Now you can\'t stay in Jiankang, Doctor. Come with me, or wait here for the constables.');
      await s.say('andaoquan:sad', '...Then let us go.');
      s.despawn('an');
      s.night(false);
      s.addParty('andaoquan'); s.level('andaoquan', 28);
      s.flag('ch17_return');
      await s.warp('yangtze', 19, 22, 'up');
    } }
  ]);
  WM.defEvents('yangtze', [
    { id: 'ch17_revenge', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_return'); }, run: async function (s) {
      s.addParty('wangdingliu'); s.level('wangdingliu', 28);
      s.spawn('zw', 'zhangwang', 19, 19, 'down'); s.boat('zw');   // the ferry
      await s.say('zhangwang', 'Ferry across? Get in, get in.');
      await s.say('zhangshun:angry', 'Zhang Wang. Remember me?');
      await s.say('zhangwang:shock', 'You — you\'re dead!');
      s.despawn('zw');
      await s.battle('ch17_zhangwang', { bg: 'river' });
      await s.narrate('Zhang Shun tied Zhang Wang hand and foot, just as he himself had been tied, and threw him into the Yangtze. Wang Dingliu and his old father came with them. On the north bank Dai Zong was waiting: he tied his charms to An Daoquan\'s legs and carried him to Liangshan in a day and a night.');
      await s.joinMany(['andaoquan', 'wangdingliu']);
      s.flag('ch17_cured');
      await s.narrate('An Daoquan burned moxa on Song Jiang\'s back to draw out the poison, then put on plasters and gave him medicine to drink. In ten days the boil was healed.');
      await s.warp('daming', 47, 33, 'up');
    } }
  ]);

  // ---------------- the Lantern Festival ----------------
  WM.defEvents('daming', [
    { id: 'ch17_lanterns', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_cured'); }, run: async function (s) {
      s.party(['shiqian']); s.setLeader('shiqian'); s.level('shiqian', 30); s.flag('protagonist', 'shiqian');
      s.night(true);
      await s.narrate('It was the fifteenth of the first month, the Lantern Festival, and Governor Liang had ordered the lanterns lit in Daming as in every year. Through the gates came hunters with game, merchants, beggars, Daoists, pedlars of lanterns — Liangshan men, all of them, in twos and threes. Shi Qian had come in two days earlier and hidden in the Cuiyun Tower.');
      await s.say('shiqian', '(At the second watch, the tower burns. Time to climb.)');
      s.flag('ch17_fire');
      await s.say(null, '(Go into the Cuiyun Tower.)');
    } }
  ]);
  WM.defEvents('daming_in', [
    { id: 'ch17_tower', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_fire') && WM.state.x >= 51 && WM.state.y >= 10; }, run: async function (s) {
      s.sfx('fire'); await s.shake(4, 0.4);
      await s.narrate('Shi Qian climbed to the top of the Cuiyun Tower with sulphur and saltpetre, and set it alight. The flames went up into the night sky like a signal from Heaven.');
      s.party(['songjiang', 'wuyong', 'guansheng', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.war('ch17_lantern');
      s.party(['chaijin', 'yuehe', 'zouyuan', 'zourun']); s.setLeader('chaijin');
      await s.narrate('Chai Jin and Yue He, dressed as officials, were already at the prison gate.');
      await s.battle('ch17_prison', { bg: 'night' });
      await s.narrate('Zou Yuan and Zou Run broke the cell doors with their axes. Cai Fu and Cai Qing, who had kept Lu Junyi alive, took their own families and went with Liangshan. Lu Junyi and Shi Xiu were free.');
      s.night(false);
      await s.narrate('Li Gu and Lady Jia had fled by boat. Zhang Shun caught Lady Jia on the river, and Yan Qing caught Li Gu. They were brought before Lu Junyi on Liangshan, and he put them to death with his own hand.');
      s.flag('ch17_freed');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch17_lu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_freed') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('lu', 'lujunyi', 15, 7, 'up'); s.spawn('sj', 'songjiang', 15, 5, 'down'); s.spawn('yq', 'yanqing', 17, 7, 'up');
      await s.say('songjiang', 'Brother Lu. Take the first seat. You are a greater man than I.');
      await s.say('lujunyi', 'Brother Song Jiang, I owe you my life. I could never take your seat. Let me be a common soldier under you.');
      await s.say('likui', 'Brother, if you make him lord, I\'ll — !');
      await s.say('wuyong', 'Brother Chao Gai said: whoever takes the man who shot him. Until then, let things stay as they are.');
      ['lu', 'sj', 'yq'].forEach(function (k) { s.despawn(k); });
      await s.joinMany(['lujunyi', 'yanqing', 'caifu', 'caiqing']);
      await s.narrate('In the capital, Cai Jing sent for two generals of Lingzhou: Shan Tinggui, the General of Holy Water, whose men fought with water; and Wei Dingguo, the General of Divine Fire, whose five hundred men carried fire-gourds. Guan Sheng asked to go against them, with Xuan Zan and Hao Siwen. And Li Kui, who had not been chosen, slipped off the mountain alone in the night to follow.');
      s.party(['likui']); s.setLeader('likui'); s.level('likui', 31); s.flag('protagonist', 'likui');
      s.flag('ch17_lingzhou');
      await s.warp('kushu', 0, 18, 'right');
    } }
  ]);

  // ---------------- Withered Tree Mountain and Lingzhou ----------------
  WM.defEvents('kushu', [
    { id: 'ch17_jiaoting', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_lingzhou'); }, run: async function (s) {
      await s.narrate('On the road Li Kui ate at a tavern where the owner, Han Bolong, boasted he was a Liangshan man and demanded payment. Li Kui, who had no money and knew no Han Bolong on Liangshan, killed him with one blow of his axe. A little further on, a big man stepped into his path.');
      s.spawn('jt', 'jiaoting', 8, 17, 'left');
      await s.duel('likui_jiaoting', { hero: 'likui', canLose: true });
      await s.say('jiaoting', 'Jiao Ting, from Zhongshan. Three generations of wrestlers in my family. They call me Faceless, because I never show my face to any man I don\'t like. I wanted to join Liangshan, but they say the Black Whirlwind is up there, and I\'m afraid of him.');
      await s.say('likui', '...I am the Black Whirlwind.');
      await s.say('jiaoting:shock', 'You! Forgive me, brother! I didn\'t know!');
      await s.say('jiaoting', 'There\'s a man on Withered Tree Mountain up ahead — Bao Xu, the God of Death. He kills like you do. Let\'s go and get him to join too.');
      s.despawn('jt', { leave: true }); s.addParty('jiaoting'); s.level('jiaoting', 29);
      s.flag('ch17_kushu');
    } },
    { id: 'ch17_baoxu', x: 18, y: 2, w: 8, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch17_kushu'); }, run: async function (s) {
      s.spawn('bx', 'baoxu', 22, 4, 'down');
      await s.say('baoxu', 'The Black Whirlwind? Ha! I\'ve wanted to go to Liangshan for years. Brothers, burn the stockade!');
      await s.narrate('Then a rider came by: Xuan Zan and Hao Siwen had been taken by the Lingzhou generals and were being sent to the capital in cages. Li Kui, Bao Xu and Jiao Ting ambushed the escort on the road.');
      s.despawn('bx'); s.addParty('baoxu'); s.level('baoxu', 29);
      await s.battle('ch17_escort', { bg: 'forest' });
      await s.narrate('They freed Xuan Zan and Hao Siwen, and then went round to the north side of Lingzhou and set fire to the city.');
      WM.unlock('lingzhou');
      s.flag('ch17_fired');
      await s.warp('lingzhou', 10, 14, 'right');
    } }
  ]);
  WM.defEvents('lingzhou', [
    { id: 'ch17_shan', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_fired'); }, run: async function (s) {
      s.party(['guansheng', 'likui']); s.setLeader('guansheng'); s.level('guansheng', 31); s.flag('protagonist', 'guansheng');
      s.spawn('st', 'shantinggui', 16, 14, 'left');
      await s.duel('guansheng_shan', { hero: 'guansheng', canLose: true });
      await s.narrate('Guan Sheng lifted Shan Tinggui from the ground, and spoke to him as one soldier to another. Shan Tinggui knelt to him. With the fire behind them in Lingzhou, Wei Dingguo\'s fire-troops broke, and he fled to Zhongling.');
      await s.say('shantinggui', 'Let me go to him. He will listen to me.');
      s.despawn('st', { leave: true });
      await s.narrate('Wei Dingguo listened to Shan Tinggui, but he said: "If Guan Sheng wants me, let him come himself." Guan Sheng went alone, unarmed, into Zhongling. Wei Dingguo came out and knelt.');
      await s.joinMany(['shantinggui', 'weidingguo', 'jiaoting', 'baoxu']);
      s.flag('ch17_ling');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch17_end', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch17_ling') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('dj', 'duanjingzhu', 15, 7, 'up'); s.spawn('sj', 'songjiang', 15, 5, 'down');
      await s.say('duanjingzhu', 'Brother! I went north with Yang Lin and Shi Yong to buy horses — two hundred of the best — and at the Zeng family\'s town they took them all, and Yu Baosi the Dangerous Road God led the robbers! The Zeng family boasts they will catch you and send you to the capital in a cage!');
      await s.say('songjiang:angry', 'Zengtou. Where Brother Chao Gai died. ...We have mourned long enough.');
      s.despawn('dj'); s.despawn('sj');
      s.party(['songjiang', 'lujunyi', 'wuyong', 'linchong', 'guansheng', 'huarong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.flag('ch17_done');
      await s.endChapter();
      if (WM.data.chapters[18].begin) await WM.data.chapters[18].begin(s);
    } }
  ]);
})();
