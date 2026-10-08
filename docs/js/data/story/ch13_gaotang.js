// Chapter 13 — "Gaotang" (novel chapters 51–54).
// Lei Heng and the singer Bai Xiuying; Zhu Tong lets him go; Zhu Tong in Cangzhou and the little master; Li Kui at
// Chai Jin's manor; Yin Tianxi and Chai Huangcheng's garden; Gao Lian's sorcery; Dai Zong and Li Kui fetch Gongsun
// Sheng from Erxian Mountain; Tang Long; Gao Lian's fall; the dry well.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('baixiuying', 'Bai Xiuying', { skin: '#f6e2cc', hairStyle: 'woman', body: '#c84a6a', trim: '#f0d8a0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#ffd040', lips: '#c03040' }, { face: true });
  WM.npc('baiyuqiao', 'Bai Yuqiao', { skin: '#e0a880', hair: '#a8a8a0', hairStyle: 'scarf', band: '#3a2a4a', beard: 'short', body: '#5a3a5a', trim: '#c8b890', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('leimother', 'Lei Heng\'s Mother', { skin: '#d8a070', hair: '#c8c8c0', hairStyle: 'woman', body: '#4a4a3a', trim: '#8a7a5a', dress: true, face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('yintianxi', 'Yin Tianxi', { skin: '#f6dcc4', hairStyle: 'futou', body: '#8a2a6a', trim: '#f0d8a0', face: 'narrow', eyes: 'sharp', lips: '#c86060' }, { face: true });
  WM.npc('chaihuangcheng', 'Chai Huangcheng', { skin: '#e8b890', hair: '#d8d8d0', hairStyle: 'scarf', band: '#3a2a1a', beard: 'long', beardColor: '#e0e0d8', body: '#3a3a5a', trim: '#c8b890', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('gaolian', 'Gao Lian', { skin: '#f0d0b0', hairStyle: 'daoist', beard: 'short', body: '#2a2a4a', trim: '#c8302a', weapon: 'sword', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('luozhenren', 'Luo Zhenren', { skin: '#f0d8c0', hair: '#f0f0e8', hairStyle: 'daoist', beard: 'long', beardColor: '#f4f4f0', body: '#e8e4d8', trim: '#4a6a9a', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('gongsunmother', 'Mother Gongsun', { skin: '#e0a880', hair: '#e0e0d8', hairStyle: 'woman', body: '#5a5a4a', trim: '#a89a7a', dress: true, face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('linren', 'Lin Ren', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#3a3a3a', trim: '#8a6a3a', face: 'round' }, { face: true });
  WM.npc('cangzhouboy', 'The Little Master', { skin: '#f6e2cc', hairStyle: 'bun', body: '#c83a3a', trim: '#f0d080', build: 'small', face: 'round' }, { face: true });

  WM.enemy('yin_thug', 'Yin Tianxi\'s Bully', 23, WM.hum(WM.enemyLooks.thug), { hp: 0.8, atk: 0.8, exp: 90, fx: 'blunt', drops: [['wine', 0.3]] });
  WM.enemy('yin_boss', 'Yin Tianxi', 22, WM.hum(WM.data.npcs.yintianxi.look), { hp: 1.6, atk: 0.7, exp: 260, gold: 300, boss: true, drops: [['silkrobe', 1]] });
  WM.enemy('well_bat', 'Well Bat', 18, WM.beast('bat'), { hp: 0.5, spd: 1.4, atk: 0.55, exp: 70, gold: 0, fx: 'claw', range: 'M' });
  var T = WM.data.troops;
  T.ch13_yin = { enemies: ['yin_thug', 'yin_boss', 'yin_thug'], bg: 'town', noRun: true };
  T.ch13_well = { enemies: ['well_bat', 'well_bat', 'well_bat'], bg: 'cave' };

  WM.data.duels.zhutong_likui = {
    hero: 'zhutong', foe: 'likui', bg: 'forest', heroHp: 520, heroAtk: 46, foeHp: 560, foeAtk: 46, drawAfter: 3,
    intro: [['hero:angry', 'You killed a child! A four-year-old child! I\'ll have your life for it!'], ['foe:smile', 'Come and take it, Beard! Come on!']],
    lines: { attack: ['Ha!', 'Missed me!', 'Here!'], wild: ['Chop chop!', 'Whirlwind!', 'Black Whirlwind!'], defend: ['Can\'t catch me!', 'Ha ha!', 'Come on, then!'] },
    draw: [[null, 'Li Kui broke off, laughing, and ran on through the trees, and Zhu Tong ran after him.']]
  };

  WM.data.wars.ch13_gaotang1 = {
    name: 'Before Gaotang', goal: { survive: true }, turns: 5, music: 'war',
    map: [
      '..TT.......#..',
      '.......::..#..',
      '..::::::::.G..',
      '::.........G..',
      '..::::::::.G..',
      '.......::..#..',
      '..TT.......#..'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'linchong', type: 'cav', x: 3, y: 2 },
      { leader: 'qinming', type: 'cav', x: 3, y: 4 },
      { leader: 'huarong', support: ['lufang', 'guosheng'], type: 'arch', x: 1, y: 1 },
      { leader: 'likui', type: 'inf', x: 2, y: 3 },
      { leader: 'yanglin', support: ['baisheng'], type: 'inf', x: 1, y: 5 }
    ],
    enemy: [
      { name: 'Gao Lian', portrait: 'gaolian', type: 'mage', atk: 120, def: 96, x: 11, y: 3, commander: true },
      { name: 'Flying Divine Troops', type: 'inf', atk: 104, def: 90, x: 9, y: 2 },
      { name: 'Flying Divine Troops', type: 'inf', atk: 104, def: 90, x: 9, y: 4 },
      { name: 'Gaotang Cavalry', type: 'cav', atk: 92, def: 80, x: 8, y: 1 },
      { name: 'Gaotang Cavalry', type: 'cav', atk: 92, def: 80, x: 8, y: 5 },
      { name: 'Gaotang Archers', type: 'arch', atk: 86, def: 60, x: 12, y: 3 }
    ],
    intro: [['songjiang', 'Gao Lian is Gao Qiu\'s cousin, and they say he is a sorcerer. His three hundred Flying Divine Troops wear yellow and carry gourds of fire.'], ['wuyong', 'Then we must hold together until we understand his magic.'], [null, 'Victory: hold out for 5 turns.']],
    events: [
      { turn: 2, run: async function (s, api) {
        await s.say('gaolian', 'Hah!');
        await s.say(null, 'Gao Lian struck his sword on his bronze shield. A black wind rose out of the ground, full of sand and flying stones, and the Liangshan men could not see their hands before their faces.');
        s.sfx('wind'); api.weaken('player', 0.8);
      } },
      { turn: 3, run: async function (s, api) {
        await s.say('songjiang', 'The Heavenly Books — "to turn back wind and fire"!');
        await s.say(null, 'Song Jiang unrolled the scroll of the Mysterious Lady and read the spell. The wind turned and blew back into the faces of the Gaotang troops.');
        s.sfx('magic'); api.weaken('enemy', 0.8);
      } },
      { turn: 4, run: async function (s, api) {
        await s.say(null, 'Gao Lian beat his bronze shield again. Out of a yellow mist came tigers and leopards, wolves and serpents, and the Liangshan horses reared and bolted.');
        s.sfx('roar'); api.weaken('player', 0.85);
      } }
    ],
    win: [['songjiang:sad', 'We held — but we cannot break his magic. Fall back to the camp.']], lose: [['songjiang:sad', 'We cannot fight sorcery with spears. Retreat to the camp!']]
  };
  WM.data.wars.ch13_gaotang2 = {
    name: 'The Fall of Gaotang', goal: 'commander', turns: 10, music: 'war',
    map: WM.data.wars.ch13_gaotang1.map,
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'gongsunsheng', type: 'mage', x: 2, y: 3 },
      { leader: 'linchong', type: 'cav', x: 3, y: 2 },
      { leader: 'qinming', type: 'cav', x: 3, y: 4 },
      { leader: 'huarong', support: ['lufang', 'guosheng'], type: 'arch', x: 1, y: 1 },
      { leader: 'leiheng', support: ['zhutong'], type: 'inf', x: 1, y: 5 }
    ],
    enemy: WM.data.wars.ch13_gaotang1.enemy,
    intro: [['gongsunsheng', 'Let him bring out his beasts. My master gave me the Five Thunders of the Heart of Heaven.'], [null, 'Victory: rout Gao Lian.']],
    events: [
      { turn: 1, run: async function (s, api) {
        await s.say(null, 'Gao Lian beat his shield, and the yellow mist poured out with its beasts — tigers, leopards, wolves, serpents.');
        await s.say('gongsunsheng', 'Paper!');
        s.sfx('thunder'); await s.flash();
        await s.say(null, 'Gongsun Sheng raised his pine-patterned sword and cried a word of command. A golden light shot from the blade, and the beasts fell to the ground — tigers and leopards cut out of white paper. The mist blew away.');
        api.weaken('enemy', 0.7);
      } }
    ],
    win: [['gongsunsheng', 'He\'s fleeing — on a black cloud!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[13].begin = async function (s) {
    await s.chapter(13);
    s.addParty('leiheng'); s.level('leiheng', 25); s.party(['leiheng']); s.setLeader('leiheng');
    s.flag('protagonist', 'leiheng');
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('sj', 'songjiang', 15, 6, 'down'); s.spawn('cg', 'chaogai', 13, 6, 'down');
    await s.fadeIn(0.6);
    await s.narrate('A few days after the wedding, Zhu Gui\'s lookouts stopped a traveller on the road below the marsh. It was Lei Heng, the Winged Tiger, constable of Yuncheng, on his way home from an errand to Dongchang. They brought him up the mountain and feasted him for five days.');
    await s.say('songjiang', 'Brother Lei Heng, stay with us.');
    await s.say('leiheng', 'Brother, my mother is old, and I am all she has. When she has gone to her rest, I will come. Brother Zhu Tong is chief jailer in Yuncheng now — I\'ll give him your greetings.');
    s.despawn('sj'); s.despawn('cg');
    await s.narrate('Lei Heng went home to Yuncheng with gifts of gold and silk. One day a friend told him there was a new singer from the capital in the theatre on the south side of town, Bai Xiuying — and the best show in years.');
    WM.unlock('yuncheng');
    await s.warp('yuncheng', 32, 32, 'up');
  };
  WM.data.chapters[13].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 12; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong', 'xiaorang', 'jindajian', 'songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang', 'songqing', 'zhufu', 'liyun', 'yanglin', 'dengfei', 'mengkang', 'peixuan', 'yangxiong', 'shixiu', 'sunli', 'sunxin', 'gudasao', 'xiezhen', 'xiebao', 'zouyuan', 'zourun', 'yuehe', 'shiqian', 'liying', 'duxing', 'husanniang'].forEach(function (id) { S.recruit(id, 25); });
    s.flag('away:gongsunsheng');
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou', 'yishui', 'jizhou_n', 'cuiping', 'zhujia', 'lijia', 'dengzhou');
    await WM.data.chapters[13].begin(s);
  };

  // ---------------- Yuncheng: the theatre ----------------
  WM.defEvents('yuncheng_in', [
    { id: 'ch13_theatre', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 13 && WM.state.x >= 67; }, run: async function (s) {
      s.spawn('bx', 'baixiuying', 72, 3, 'down'); s.spawn('by', 'baiyuqiao', 70, 4, 'right');
      s.spawn('a1', 'villager', 69, 6, 'up'); s.spawn('a2', 'merchant', 75, 6, 'up'); s.spawn('a3', 'villager2', 71, 7, 'up');
      s.music('inn');
      await s.narrate('Lei Heng took the best seat, in the front row. Bai Xiuying sang "Shuang Jian Chases Su Qing at Yuzhang," and the hall roared. Then she came down with a plate to collect from the audience — and began with the front row.');
      await s.say('baixiuying:smile', 'Sir, the first in the front row should be the first to give.');
      await s.say('leiheng', '...I forgot to bring any money. Tomorrow I\'ll give you plenty.');
      await s.say('baixiuying', 'A man who sits in the best seat without a coin on him? You know nothing of the world.');
      await s.say('baiyuqiao', 'Daughter, you\'ve no eye for men. This is a country bumpkin. Ask a dog for a bone sooner!');
      await s.say('leiheng:angry', 'Who are you calling a dog?!');
      s.sfx('hit'); await s.shake(4, 0.3);
      await s.narrate('Lei Heng leapt onto the stage and beat the old man until his lips split and his teeth came out. The audience pulled them apart.');
      ['bx', 'by', 'a1', 'a2', 'a3'].forEach(function (k) { s.despawn(k); });
      await s.narrate('But Bai Xiuying had been the new magistrate\'s lover in the capital. She went straight to him, and the magistrate had Lei Heng put in the cangue and stood in the street before the theatre, for everyone to see.');
      WM.state.chars.leiheng.equip.acc = 'cangue';
      s.flag('ch13_pillory');
      await s.warp('yuncheng', 32, 32, 'up');
    } }
  ]);
  WM.defEvents('yuncheng', [
    { id: 'ch13_mother', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_pillory'); }, run: async function (s) {
      s.spawn('lm', 'leimother', 30, 33, 'up'); s.spawn('bx', 'baixiuying', 34, 32, 'left');
      s.music('sad');
      await s.say('leimother:sad', 'My son! Who has done this to you? You constables — he is one of you! How can you stand by?');
      await s.say('baixiuying:angry', 'Old beggar woman, who are you to curse in front of my theatre?');
      await s.say('leimother:angry', 'Shameless singing-girl, who is a beggar?!');
      await s.narrate('Bai Xiuying struck the old woman across the face, and again, and again, until she staggered.');
      await s.say('leiheng:angry', 'MOTHER!');
      s.sfx('hit'); await s.shake(6, 0.4);
      await s.narrate('Lei Heng, a devoted son, could not bear it. He swung the heavy cangue on his neck and struck Bai Xiuying on the head. She fell dead in the street.');
      s.despawn('bx'); s.despawn('lm');
      s.flag('ch13_killed');
      await s.fadeOut(1);
      // Zhu Tong
      s.addParty('zhutong'); s.level('zhutong', 25); s.party(['zhutong']); s.setLeader('zhutong'); s.flag('protagonist', 'zhutong');
      await s.narrate('Lei Heng was tried and condemned. The chief jailer, Zhu Tong — the Lord of the Beautiful Beard, whose beard reached his belt — treated him kindly, and promised his weeping mother he would do what he could. After sixty days Lei Heng was sent under escort to Jizhou for execution. Zhu Tong took him there himself.');
      await s.warp('roadinn_in', 6, 6, 'up', { noFade: true });
      s.spawn('lh', 'leiheng', 6, 4, 'down');
      await s.fadeIn(1);
      await s.say('zhutong', 'Brother, I\'ll take the cangue off. Go home, fetch your mother, and run. I\'ll go back and say you escaped.');
      await s.say('leiheng:shock', 'Brother, you\'ll be punished for it!');
      await s.say('zhutong', 'You killed that woman: for you it\'s death. For me, letting a prisoner go is a lighter crime, and I have no family to suffer for it. Go — and don\'t waste the chance.');
      s.despawn('lh');
      WM.state.chars.leiheng.equip.acc = null;
      await s.narrate('Lei Heng took his mother and went to Liangshan. Zhu Tong went back to Yuncheng and reported that the prisoner had escaped. The magistrate, who liked Zhu Tong, did what he could, but Bai Yuqiao pressed the case, and Zhu Tong was given twenty strokes and exiled to Cangzhou.');
      await s.join('leiheng');
      s.flag('ch13_zhutong');
      await s.narrate('In Cangzhou the prefect took a liking to the handsome, bearded prisoner, and kept him in his own household instead of the camp. And the prefect\'s little son, four years old, would not let Zhu Tong out of his sight.');
      await s.warp('cangzhou', 21, 22, 'up');
    } }
  ]);

  // ---------------- Cangzhou: the lanterns, and the woods ----------------
  WM.defEvents('cangzhou', [
    { id: 'ch13_lanterns', x: 28, y: 8, w: 10, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch13_zhutong'); }, run: async function (s) {
      s.spawn('boy', 'cangzhouboy', 30, 10, 'up');
      s.night(true);
      await s.narrate('On the fifteenth night of the seventh month — the Feast of the Hungry Ghosts — Zhu Tong carried the little master on his shoulders to the temple of Ksitigarbha to watch the river lanterns float away.');
      s.spawn('lh', 'leiheng', 35, 10, 'left'); s.spawn('wy', 'wuyong', 35, 11, 'left');
      await s.say('leiheng', 'Brother Zhu Tong.');
      await s.say('zhutong:shock', 'Lei Heng! And — Professor Wu Yong?');
      await s.say('wuyong', 'Song Jiang and Chao Gai have long admired you. You saved Brother Lei Heng, and lost everything for it. Come up the mountain with us.');
      await s.say('zhutong:angry', 'Don\'t say it. I am a convict under the law, and the prefect has been good to me. I will serve out my sentence and go home a free man. If you go on, I\'ll take it as an insult.');
      await s.say('leiheng', '...Then let us at least talk a while, there by the bank.');
      s.despawn('lh'); s.despawn('wy');
      await s.narrate('When Zhu Tong came back, the little master was gone.');
      s.despawn('boy');
      s.spawn('lh', 'leiheng', 33, 10, 'left');
      await s.say('zhutong:shock', 'The boy! Where is the boy?!');
      await s.say('leiheng', 'Our companion — the black one, Li Kui — must have taken him to play.');
      await s.say('zhutong:angry', '...If anything has happened to that child —');
      s.despawn('lh');
      s.flag('ch13_gone');
      await s.warp('cangforest', 0, 8, 'right');
    } }
  ]);
  WM.defEvents('cangforest', [
    { id: 'ch13_child', x: 13, y: 9, w: 5, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch13_gone'); }, run: async function (s) {
      s.music('sad');
      await s.narrate('In a clearing in the woods, twenty li from the city, Zhu Tong found the little master lying on the ground. He was dead. His head had been split open.');
      await s.say('zhutong:sad', '...A child. A child of four.');
      s.spawn('lk', 'likui', 30, 9, 'left');
      await s.say('likui:smile', 'Hey! Beard! Over here!');
      await s.say('zhutong:angry', 'YOU!');
      s.despawn('lk');
      s.flag('ch13_found');
    } },
    { id: 'ch13_chase', x: 30, y: 6, w: 10, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch13_found'); }, run: async function (s) {
      s.music('duel');
      await s.duel('zhutong_likui', { hero: 'zhutong', canLose: true });
      s.night(false);
      await s.narrate('Li Kui led him on, running and stopping and running, all night long, until at dawn they came to the gate of a great manor. Li Kui ran inside.');
      s.flag('ch13_chai');
      await s.warp('chaimanor', 14, 20, 'up');
    } }
  ]);
  WM.defEvents('chaimanor', [
    { id: 'ch13_chaijin', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_chai') && !S2.has('ch13_cond'); }, run: async function (s) {
      s.spawn('cj', 'chaijin', 14, 17, 'down'); s.spawn('wy', 'wuyong', 12, 18, 'right'); s.spawn('lh', 'leiheng', 16, 18, 'left');
      await s.say('chaijin', 'Lord of the Beautiful Beard, I am Chai Jin. Forgive us. Song Jiang wrote to me: he wanted you on the mountain, and Professor Wu Yong and Brother Lei Heng could not persuade you. So the Black Whirlwind... was told to cut off your road home.');
      await s.say('zhutong:angry', 'Then you have done it. I can never go back to Cangzhou now. ...I will go up the mountain. But on one condition.');
      await s.say('wuyong', 'Anything.');
      await s.say('zhutong:angry', 'Kill the Black Whirlwind. Then I will come.');
      await s.say('chaijin', 'That — we cannot do. But let Li Kui stay here with me, and keep out of your sight, and you three go up the mountain.');
      await s.say('zhutong', '...So be it. As long as I don\'t have to look at him.');
      s.despawn('wy'); s.despawn('lh');
      await s.join('zhutong');
      await s.narrate('Zhu Tong went to Liangshan with Wu Yong and Lei Heng. Li Kui stayed at Chai Jin\'s manor, out of the way. A month later a letter came: Chai Jin\'s uncle, Chai Huangcheng, in Gaotang, was dying.');
      s.despawn('cj');
      s.addParty('chaijin'); s.level('chaijin', 24);
      s.party(['likui']); s.setLeader('likui'); s.flag('protagonist', 'likui');
      WM.unlock('gaotang');
      s.flag('ch13_cond');
      await s.say(null, '(Go with Chai Jin to Gaotang.)');
    } }
  ]);

  // ---------------- Gaotang: Yin Tianxi ----------------
  WM.defEvents('gaotang_in', [
    { id: 'ch13_uncle', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_cond') && WM.state.x < 15; }, run: async function (s) {
      s.spawn('hc', 'chaihuangcheng', 11, 4, 'left'); s.spawn('cj', 'chaijin', 9, 5, 'up');
      await s.say('chaihuangcheng:sad', 'Nephew... The prefect here is Gao Lian, Gao Qiu\'s cousin. His wife\'s brother, Yin Tianxi, wants my house and garden. When I refused, he had me beaten... I\'m dying of it.');
      await s.say('chaijin', 'Uncle, our family holds the iron pledge of the first emperor. No official may touch a descendant of the Chai. I\'ll take it to the capital and have justice.');
      await s.say('chaihuangcheng:sad', 'Take it to the capital... and avenge me...');
      await s.narrate('That night Chai Huangcheng died. Three days later, Yin Tianxi came to the garden gate with twenty bullies, to take the house.');
      s.despawn('hc'); s.despawn('cj');
      s.flag('ch13_uncledead');
      await s.warp('gaotang', 9, 32, 'up');
    } }
  ]);
  WM.defEvents('gaotang', [
    { id: 'ch13_yin', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_uncledead'); }, run: async function (s) {
      s.spawn('yt', 'yintianxi', 9, 35, 'up'); s.spawn('cj', 'chaijin', 7, 31, 'down');
      await s.say('yintianxi', 'Out of the house, the lot of you! It\'s mine now!');
      await s.say('chaijin', 'I am Chai Jin, of the house of Chai. Our family holds the iron pledge from the founding emperor!');
      await s.say('yintianxi', 'Bring me a pledge and I\'ll wipe my backside on it! Beat him!');
      await s.say('likui:angry', 'Wipe your backside on THAT!');
      s.despawn('yt');
      await s.battle('ch13_yin', { bg: 'town', guests: ['chaijin'] });
      await s.narrate('Li Kui dragged Yin Tianxi from his horse and beat him to death with his fists.');
      await s.say('chaijin', 'Brother, run! Back to Liangshan, now! I\'ll face the prefecture — I have the iron pledge, they cannot touch me.');
      s.despawn('cj');
      await s.narrate('Gao Lian\'s men came and took Chai Jin. Gao Lian cared nothing for the iron pledge. He had Chai Jin beaten until his flesh split, and threw him in the death cell. Li Kui ran to Liangshan.');
      s.flag('ch13_jailed');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch13_attack', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_jailed') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('zt', 'zhutong', 13, 6, 'down'); s.spawn('sj', 'songjiang', 15, 5, 'down');
      await s.say('zhutong:angry', 'The black devil! I\'ll —');
      await s.say('songjiang', 'Brother Zhu Tong! He killed the child on our orders, not his own. The fault is ours. Li Kui — bow to him.');
      await s.say('likui', '...Fine. I\'m sorry, Beard. Er, brother.');
      await s.say('songjiang', 'Chai Jin saved my life once, and Lin Chong\'s, and many more of ours. We go to Gaotang.');
      s.despawn('zt'); s.despawn('sj');
      s.party(['songjiang', 'likui', 'linchong', 'huarong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.war('ch13_gaotang1', { canLose: true });
      await s.narrate('That night Gao Lian came out to raid the Liangshan camp, but Yang Lin and Bai Sheng were waiting in the grass. An arrow took Gao Lian in the left shoulder, and he fled back inside the walls.');
      await s.say('wuyong', 'Gao Lian\'s magic is real. Only one man can break it — Gongsun Sheng. Dai Zong, take Li Kui, and go to Jizhou. This time you must find him.');
      s.party(['daizong', 'likui']); s.setLeader('daizong'); s.flag('protagonist', 'daizong');
      s.flag('ch13_fetch');
      await s.narrate('On the road Dai Zong told Li Kui: anyone who travels by his magic charms must eat no meat. That night Li Kui ate a whole plate of beef in secret. The next day, once the charms were on his legs, he could not stop running. "Brother! Help! I can\'t stop!" — "Did you eat meat?" — "...A little beef!" Dai Zong let him run until he wept, and then took the charms off.');
      await s.say(null, '(Search for Gongsun Sheng in Jizhou. Try asking in an eating-house.)');
    } }
  ]);

  // ---------------- Jizhou and Erxian Mountain ----------------
  WM.defEvents('jizhou_in', [
    { id: 'ch13_noodles', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_fetch') && WM.state.x >= 16 && WM.state.x < 27; }, run: async function (s) {
      s.spawn('om', 'oldman', 21, 4, 'down');
      await s.narrate('They had searched Jizhou for days and asked everyone. At midday they went into a noodle shop. The shop was crowded, and they had to share a table with an old man. The noodles were slow coming; and when the old man\'s bowl came first, Li Kui lost his temper and banged the table, and the old man\'s noodles went into his lap.');
      await s.say('oldman:angry', 'You great brute!');
      await s.say('daizong', 'Forgive him, grandfather, he\'s a fool. Let me buy you another bowl. ...We\'re looking for a man called Gongsun Sheng.');
      await s.say('oldman', 'Gongsun Sheng? ...You mean Daoist Qing? He lives on Erxian Mountain, forty-five li east of here, with his old mother. He studies under the immortal Luo Zhenren, at the Purple Void Temple.');
      s.despawn('om');
      WM.unlock('erxian');
      s.flag('ch13_erxian');
    } }
  ]);
  WM.defEvents('erxian_in', [
    { id: 'ch13_mothergs', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_erxian') && WM.state.x < 10; }, run: async function (s) {
      s.flag('present:gongsunsheng');
      s.spawn('gm', 'gongsunmother', 4, 4, 'down');
      await s.say('gongsunmother', 'My son? He has gone travelling. He isn\'t here.');
      await s.say('daizong', '(whispering) Li Kui — she\'s lying. Frighten her a little.');
      await s.say('likui:angry', 'Gongsun Sheng! Come out, or I\'ll chop this house to pieces, and the old lady with it!');
      await s.say('gongsunmother:shock', 'Help! Help!');
      s.spawn('gs', 'gongsunsheng', 6, 6, 'up');
      await s.say('gongsunsheng', 'Stop! Don\'t frighten my mother. ...Brother Dai Zong. I knew it would be you.');
      await s.say('daizong', 'Chai Jin is in prison in Gaotang, and Gao Lian\'s sorcery has beaten us. Only you can break it.');
      await s.say('gongsunsheng:sad', 'My mother is old, and my master will not let me go. Come with me to the temple, and ask him yourself.');
      s.despawn('gm'); s.despawn('gs');
      s.flag('ch13_gsfound');
    } },
    { id: 'ch13_luo', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_gsfound') && WM.state.x >= 10; }, run: async function (s) {
      s.spawn('luo', 'luozhenren', 18, 4, 'down'); s.spawn('gs', 'gongsunsheng', 16, 5, 'right');
      await s.say('luozhenren', 'My disciple has left the world of men, and the affairs of men do not concern him. He will not go.');
      await s.say('likui:angry', '(...Not go? Then I\'ll chop the old Daoist, and he\'ll have nobody left to stop him.)');
      s.despawn('luo'); s.despawn('gs');
      s.night(true);
      await s.narrate('In the night Li Kui crept into the temple with his axes. Luo Zhenren sat alone before the lamp, chanting. Li Kui swung — and the head fell, and white blood gushed out. A boy acolyte cried out, and Li Kui cut him down too, and ran.');
      s.night(false);
      s.spawn('luo', 'luozhenren', 18, 4, 'down');
      await s.say('likui:shock', '...You — you\'re — I chopped your head off!');
      await s.say('luozhenren', 'Did you, now?');
      await s.narrate('Luo Zhenren spread a handkerchief on the ground and told Li Kui to stand on it. It rose into the air as a cloud. Li Kui shrieked as he flew. The cloud carried him all the way to Jizhou, and dropped him through the roof of the prefecture into the courtyard. The officials took him for a demon, poured dog\'s blood and filth over him, and threw him in prison.');
      await s.say('daizong', 'Master — I beg you. He\'s a fool, but he\'s our brother.');
      await s.say('luozhenren', 'That one is the Killing Star of Heaven, come down into the world to slay men, for the sins of men. I could not kill him if I tried. ...Very well.');
      await s.narrate('A yellow-turbaned genie of the Way brought Li Kui back through the air, stinking and humbled. Luo Zhenren called Gongsun Sheng to him.');
      s.spawn('gs', 'gongsunsheng', 16, 5, 'right');
      await s.say('luozhenren', 'Go and save Song Jiang\'s brothers. I give you the method of the Five Thunders of the Heart of Heaven. And remember eight words: "Meet You, and stop. Meet Bian, and return." Do not forget them.');
      await s.say('gongsunsheng', 'I will not forget, Master.');
      s.despawn('luo'); s.despawn('gs');
      s.unflag('away:gongsunsheng');
      s.unflag('present:gongsunsheng');
      WM.unlock('wugang');
      s.flag('ch13_gsback');
      await s.narrate('Gongsun Sheng and Dai Zong went ahead by Dai Zong\'s magic. Li Kui, who had had enough of magic, walked.');
      s.party(['likui']); s.setLeader('likui'); s.flag('protagonist', 'likui');
      await s.say(null, '(Head back south, through Wugang.)');
    } }
  ]);
  WM.defEvents('wugang_in', [
    { id: 'ch13_tanglong', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_gsback'); }, run: async function (s) {
      s.spawn('tl', 'tanglong', 6, 4, 'down');
      s.sfx('hit');
      await s.say('likui', 'Smith! Can you make me a pair of axes? Good heavy ones.');
      await s.say('tanglong', 'Heavy axes for a heavy man. ...You\'re no farmer. Liangshan?');
      await s.say('likui', 'What of it?');
      await s.say('tanglong:smile', 'Then take me with you! I\'m Tang Long — the Gold-Coin Leopard, for the spots on my skin. My father was an officer in Yan\'an. I learned to forge weapons from him, and gambled away everything else. My cousin is Xu Ning, the Gold Lancer, instructor of the Imperial Guard in the capital.');
      await s.say('likui', 'A smith who can fight! Come on, then!');
      s.despawn('tl');
      await s.join('tanglong');
      s.flag('ch13_tanglong');
      await s.warp('gaotang', 24, 37, 'up');
    } }
  ]);

  // ---------------- the fall of Gaotang, and the well ----------------
  WM.defEvents('gaotang', [
    { id: 'ch13_fall', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch13_tanglong'); }, run: async function (s) {
      s.party(['songjiang', 'gongsunsheng', 'likui', 'linchong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.war('ch13_gaotang2');
      await s.narrate('Gao Lian mounted a black cloud and rose above the city wall. Gongsun Sheng pointed his sword and spoke a word, and Gao Lian fell out of the sky — and Lei Heng, waiting below, cut him in two.');
      await s.narrate('Song Jiang entered Gaotang and forbade his men to harm the people. But Chai Jin was not in the prison. The jailer Lin Ren came forward.');
      s.spawn('lr', 'linren', 44, 13, 'left');
      await s.say('linren', 'Gao Lian ordered me to kill Lord Chai. I couldn\'t do it. I let him down into the old dry well in the yard and told the prefect he was dead. I don\'t know if he\'s still alive.');
      await s.say('likui', 'I\'ll go down. Put me in a basket and let the rope out.');
      s.despawn('lr');
      s.party(['likui']); s.setLeader('likui'); s.heal();
      s.flag('ch13_well');
      await s.warp('gaowell', 3, 2, 'down');
    } }
  ]);
  WM.defEvents('gaowell', [
    { id: 'ch13_bats', x: 8, y: 6, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch13_well'); }, run: async function (s) {
      await s.battle('ch13_well', { bg: 'cave' });
    } },
    { id: 'ch13_found_chai', x: 10, y: 11, w: 9, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch13_well'); }, run: async function (s) {
      s.spawn('cj', 'chaijin', 13, 13, 'down'); s.lie('cj');
      await s.say('likui', 'Lord Chai! ...He\'s breathing! Barely.');
      await s.narrate('Li Kui put Chai Jin in the basket and shouted up the well, and they hauled him out. Then the rope came down again for Li Kui — eventually.');
      s.despawn('cj');
      await s.warp('gaotang', 44, 13, 'down');
      await s.say('likui:angry', 'You FORGOT me! You left me down there with the bones!');
      await s.say('songjiang', 'Brother, we were seeing to Lord Chai. Forgive us.');
      await s.narrate('Chai Jin\'s head was split and his legs torn by the beatings, and he could hardly speak. They carried him on a cart. Song Jiang rewarded Lin Ren, and the whole army, with the Chai family and their goods, went back to Liangshan.');
      s.heal();
      await s.join('chaijin');
      s.party(['songjiang', 'gongsunsheng', 'likui', 'linchong', 'chaijin']); s.setLeader('songjiang');
      s.flag('ch13_done');
      await s.endChapter();
      if (WM.data.chapters[14].begin) await WM.data.chapters[14].begin(s);
    } }
  ]);
})();
