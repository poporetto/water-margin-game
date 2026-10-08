// Chapter 12 — "The Zhu Family Village" (novel chapters 47–50).
// Shi Xiu's scouting and old Zhongli's white poplars; the first attack and the red lantern; Li Ying will not come out;
// Hu Sanniang takes Wang Ying and Lin Chong takes Hu Sanniang; in Dengzhou, the Xie brothers' tiger, Squire Mao, and
// Gu Dasao's jailbreak; Sun Li inside the Zhu manor; the third attack; Li Ying brought up the mountain; a wedding.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('zhongli', 'Old Zhongli', { skin: '#e0a880', hair: '#e0e0d8', hairStyle: 'scarf', band: '#5a4a3a', beard: 'long', beardColor: '#e8e8e0', body: '#7a6a4a', trim: '#c8b890', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('luantingyu', 'Luan Tingyu', { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#5a5a62', tassel: '#c8302a', beard: 'full', body: '#4a4a52', trim: '#c8b890', weapon: 'staff', build: 'big', face: 'square', eyes: 'sharp' }, { face: true });
  WM.npc('zhulong', 'Zhu Long', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#8a6a3a', tassel: '#c8302a', beard: 'short', body: '#8a3a2a', trim: '#d8b36a', weapon: 'spear', face: 'square' }, { face: true });
  WM.npc('zhuhu', 'Zhu Hu', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#6a6a72', tassel: '#2a2a2a', body: '#3a4a6a', trim: '#d8b36a', weapon: 'spear', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('squirezhu', 'Squire Zhu', { skin: '#f0c49a', hair: '#c8c8c0', hairStyle: 'scarf', band: '#2a2a3a', beard: 'long', beardColor: '#d8d8d0', body: '#5a2a3a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('hucheng', 'Hu Cheng', { skin: '#f0c49a', hairStyle: 'scarf', band: '#2a3a5a', beard: 'short', body: '#3a5a8a', trim: '#e8e0c0', face: 'oval' }, { face: true });
  WM.npc('maotaigong', 'Squire Mao', { skin: '#f0c49a', hair: '#c8c8c0', hairStyle: 'scarf', band: '#3a2a1a', beard: 'mustache', body: '#6a4a2a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('maozhong', 'Mao Zhong', { skin: '#f0c49a', hairStyle: 'futou', body: '#5a3a5a', trim: '#c8b890', face: 'narrow', eyes: 'sharp' }, { face: true });
  WM.npc('baoji', 'Bao Ji', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', beard: 'full', body: '#2a2a2a', trim: '#8a1a1a', weapon: 'dao', build: 'big', face: 'square', eyes: 'narrow' }, { face: true });

  WM.enemy('zj_ambush', 'Zhu Village Spearman', 23, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 110, drops: [['medicine', 0.12]] });
  WM.enemy('zj_archer', 'Zhu Village Archer', 23, WM.hum(WM.enemyLooks.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 110 });
  WM.enemy('zj_guard', 'Zhu Manor Guard', 24, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 120, drops: [['medicine', 0.15]] });
  WM.enemy('dz_tiger', 'Tiger of Dengzhou Hill', 23, WM.beast('tiger'), { hp: 2.1, atk: 1.05, spd: 1.2, exp: 400, gold: 0, boss: true, fx: 'claw', skills: [{ name: 'Pounce', chance: 0.3, type: 'phys', power: 1.4, fx: 'claw', sfx: 'roar' }] });
  WM.enemy('dz_guard', 'Dengzhou Jailer', 22, WM.hum(WM.enemyLooks.constable), { exp: 100, drops: [['medicine', 0.12]] });
  WM.enemy('baoji_foe', 'Bao Ji', 24, WM.hum(WM.data.npcs.baoji.look), { hp: 2.2, atk: 1.0, exp: 380, gold: 300, boss: true, drops: [['ginseng', 1]], skills: [{ name: 'Jailer\'s Cudgel', chance: 0.3, type: 'phys', power: 1.4, fx: 'blunt' }] });
  var T = WM.data.troops;
  T.ch12_ambush = { enemies: ['zj_ambush', 'zj_archer', 'zj_ambush'], bg: 'forest', noRun: true };
  T.ch12_tiger = { enemies: ['dz_tiger'], bg: 'forest', boss: true };
  T.ch12_jail = { enemies: ['dz_guard', 'baoji_foe', 'dz_guard'], bg: 'town', boss: true };
  T.ch12_inside = { enemies: ['zj_guard', 'zj_guard', 'zj_guard'], bg: 'town', noRun: true };

  WM.data.duels.wangying_hu = {
    hero: 'wangying', foe: 'husanniang', bg: 'field', heroHp: 260, heroAtk: 26, foeHp: 520, foeAtk: 46,
    intro: [['hero:smile', 'A girl general! Leave her to me, brothers!'], ['foe:angry', 'Liangshan bandit. Come and be tied up.']],
    lines: { attack: ['Hah!', 'Too slow!', 'There!'], wild: ['Twin sabres!', 'Down you go!', 'Lasso!'], defend: ['Come on, then.', 'Hm.', 'Is that all?'] },
    win: [['foe:shock', 'He... he\'s stronger than he looks...']], lose: [['hero:shock', 'Wh— the rope —!']]
  };
  WM.data.duels.linchong_hu = {
    hero: 'linchong', foe: 'husanniang', bg: 'field', heroHp: 640, heroAtk: 52, foeHp: 520, foeAtk: 44,
    intro: [['foe:angry', 'Another one? Come on!'], ['hero', 'Lady, I would rather not hurt you. Yield.']],
    lines: { attack: ['Hah!', 'Take this!', 'There!'], wild: ['Twin sabres!', 'Out of my way!', 'Fall!'], defend: ['He\'s strong...', 'Steady...', 'Hm.'] },
    win: [['hero', 'Your sabres are fast. But not fast enough.']], lose: [['foe:smile', 'Panther Head? Ha!']]
  };
  WM.data.duels.sunli_shixiu = {
    hero: 'sunli', foe: 'shixiu', bg: 'field', heroHp: 520, heroAtk: 44, foeHp: 520, foeAtk: 44, drawAfter: 3,
    intro: [['foe:angry', 'Who are you, riding out for the Zhu family?'], ['hero', '(Brother Shi Xiu, make it look good.) Sun Li of Dengzhou! Come on!']],
    lines: { attack: ['Hah!', 'Take this!', 'There!'], wild: ['All my strength!', 'Down!', 'Here!'], defend: ['Steady...', 'Come on.', 'Hm.'] },
    draw: [[null, 'They fought fifty bouts. Then Sun Li dropped his spear, seized Shi Xiu by the belt, dragged him from the saddle, and threw him to the Zhu men to tie up.']],
    win: [[null, 'Sun Li seized Shi Xiu by the belt, dragged him from the saddle, and threw him to the Zhu men to tie up.']],
    lose: [[null, 'Sun Li let Shi Xiu press him back — and then seized him by the belt, dragged him from the saddle, and threw him to the Zhu men to tie up.']]
  };

  WM.data.wars.ch12_second = {
    name: 'The Second Attack on Zhu Village', goal: 'commander', turns: 10, music: 'war',
    map: [
      '..TT.....mm.#.',
      '.......::...#.',
      '..:::::......G',
      '::...T...TT..G',
      '..:::::......G',
      '.......::...#.',
      '..TT.....mm.#.'
    ],
    player: [
      { leader: 'songjiang', support: ['huarong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'linchong', type: 'cav', x: 2, y: 2 },
      { leader: 'qinming', type: 'cav', x: 2, y: 4 },
      { leader: 'oupeng', support: ['malin'], type: 'cav', x: 1, y: 1 },
      { leader: 'dengfei', type: 'inf', x: 1, y: 5 },
      { leader: 'likui', type: 'inf', x: 3, y: 3 }
    ],
    enemy: [
      { name: 'Hu Sanniang', portrait: 'husanniang', type: 'cav', atk: 112, def: 92, x: 9, y: 2, commander: true },
      { name: 'Luan Tingyu', portrait: 'luantingyu', type: 'cav', atk: 120, def: 100, x: 11, y: 3 },
      { name: 'Zhu Long', portrait: 'zhulong', type: 'cav', atk: 96, def: 86, x: 10, y: 1 },
      { name: 'Zhu Biao', portrait: 'zhubiao', type: 'cav', atk: 100, def: 84, x: 10, y: 5 },
      { name: 'Zhu Village Foot', type: 'inf', atk: 82, def: 86, x: 11, y: 4 },
      { name: 'Zhu Village Archers', type: 'arch', atk: 84, def: 60, x: 12, y: 2 }
    ],
    intro: [['songjiang', 'Wang Ying is taken. We must not be beaten twice. Brother Lin Chong — the girl general on the red horse is the heart of their army.'], ['linchong', 'Leave her to me.'], [null, 'Victory: rout Hu Sanniang\'s unit. Beware Luan Tingyu, the Zhu instructor.']],
    events: [
      { turn: 2, run: async function (s, api) {
        await s.say(null, 'Luan Tingyu let fly his iron hammer, and Ou Peng was knocked from his saddle!');
        s.sfx('hit'); api.rout('oupeng');
      } },
      { turn: 3, run: async function (s, api) {
        await s.say(null, 'Qin Ming and Deng Fei chased Luan Tingyu into the long grass — straight into the trip-ropes. The Zhu men dragged them away with hooks.');
        s.sfx('earth'); api.rout('qinming'); api.rout('dengfei');
      } }
    ],
    win: [['linchong', 'Hu Sanniang\'s banner has fallen back! She\'s cut off from the rest!']], lose: [['songjiang:sad', 'Fall back! Fall back to the camp!']]
  };
  WM.data.wars.ch12_third = {
    name: 'The Third Attack on Zhu Village', goal: 'commander', turns: 12, music: 'war',
    map: [
      '..T......~#...',
      '.......::~#...',
      '..:::::::BG...',
      '::.......BG...',
      '..:::::::BG...',
      '.......::~#...',
      '..T......~#...'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'linchong', support: ['huarong'], type: 'cav', x: 3, y: 2 },
      { leader: 'likui', type: 'inf', x: 4, y: 3 },
      { leader: 'lufang', support: ['guosheng'], type: 'cav', x: 3, y: 4 },
      { leader: 'muhong', support: ['muchun'], type: 'cav', x: 2, y: 1 },
      { leader: 'yangxiong', type: 'inf', x: 2, y: 5 }
    ],
    enemy: [
      { name: 'Luan Tingyu', portrait: 'luantingyu', type: 'cav', atk: 118, def: 100, x: 8, y: 3, commander: true },
      { name: 'Zhu Long', portrait: 'zhulong', type: 'cav', atk: 96, def: 86, x: 8, y: 1 },
      { name: 'Zhu Hu', portrait: 'zhuhu', type: 'cav', atk: 94, def: 86, x: 11, y: 3 },
      { name: 'Zhu Biao', portrait: 'zhubiao', type: 'cav', atk: 100, def: 84, x: 8, y: 5 },
      { name: 'Zhu Manor Guards', type: 'inf', atk: 82, def: 92, x: 12, y: 2 },
      { name: 'Zhu Manor Archers', type: 'arch', atk: 84, def: 60, x: 12, y: 4 }
    ],
    intro: [['songjiang', 'Today Brother Sun Li opens the gate for us from inside. Attack from all four sides!'], ['likui', 'Ha! Let me at them!'], [null, 'Victory: rout Luan Tingyu, the Zhu instructor.']],
    events: [
      { turn: 2, run: async function (s, api) {
        await s.say('yuehe', '(singing) "...the tigers are let out of their cages..."');
        await s.say(null, 'Inside the manor, Yue He\'s song was the signal. Zou Yuan and Zou Run cut down the prison guards and opened the cages. The Xie brothers set the fodder stacks ablaze. Sun Xin planted the Liangshan banner on the gatehouse!');
        s.sfx('fire'); api.weaken('enemy', 0.75);
      } },
      { turn: 3, run: async function (s, api) {
        await s.say('sunli', 'Zhu Hu! Where do you think you\'re going?');
        await s.say(null, 'Sun Li held the drawbridge. Zhu Hu, cut off from the manor, turned back — into the halberds of Lü Fang and Guo Sheng.');
        api.rout('Zhu Hu');
      } }
    ],
    win: [['songjiang', 'The Zhu Family Village has fallen.']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[12].begin = async function (s) {
    await s.chapter(12);
    s.party(['songjiang', 'huarong', 'likui', 'yangxiong', 'shixiu', 'huangxin']); s.setLeader('songjiang');
    ['songjiang', 'huarong', 'likui', 'yangxiong', 'shixiu', 'huangxin'].forEach(function (id) { s.level(id, 24); });
    s.flag('protagonist', 'songjiang');
    WM.unlock('zhujia', 'lijia');
    await s.narrate('Song Jiang led three thousand foot and three hundred horse down from Liangshan, with Hua Rong, Li Kui, Yang Xiong, Shi Xiu, Huang Xin, Ou Peng, Deng Fei, Wang Ying, Ma Lin and many more, and camped before Dulong Ridge.');
    await s.warp('zhujia', 30, 46, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[12].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 11; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong', 'xiaorang', 'jindajian', 'songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang', 'songqing', 'zhufu', 'liyun', 'yanglin', 'dengfei', 'mengkang', 'peixuan', 'yangxiong', 'shixiu'].forEach(function (id) { S.recruit(id, 24); });
    s.flag('away:gongsunsheng');
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou', 'yishui', 'jizhou_n', 'cuiping');
    await WM.data.chapters[12].begin(s);
  };

  // the four false roads: dead ends sown with caltrops, where the Zhu men lie in wait
  var DEAD = [['d1', 46, 34, 31, 39], ['d2', 12, 25, 18, 33], ['d3', 50, 30, 37, 25], ['d4', 6, 23, 25, 19]];
  var deadEvents = DEAD.map(function (d) {
    return { id: 'ch12_' + d[0], x: d[1], y: d[2], w: 2, h: 2, trigger: 'touch', cond: function () { return WM.state.chapter === 12; }, run: async function (s) {
      if (S.has('ch12_trap') && !S.has('ch12_first')) {
        await s.say(null, 'Caltrops in the path — and torches all around! An ambush!');
        await s.battle('ch12_ambush', { bg: 'night' });
        await s.say('shixiu', 'Wrong road! Back to the last white poplar!');
      } else {
        await s.say(null, 'The path ends in a thicket of bamboo, the ground sown with sharp iron caltrops.');
      }
      await s.warp('zhujia', d[3], d[4], 'down');
    } };
  });
  WM.defEvents('zhujia', deadEvents);

  WM.defEvents('zhujia', [
    { id: 'ch12_plan', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 12; }, run: async function (s) {
      s.spawn('sx', 'shixiu', 29, 44, 'down'); s.spawn('yl', 'yanglin', 31, 44, 'down');
      await s.say('songjiang', 'They say the roads into the Zhu Village twist and turn, and a stranger can never find his way. Before we attack, we must know the roads.');
      await s.say('shixiu', 'Let me go. I\'ll carry a load of firewood in and sell it.');
      await s.say('yanglin', 'And I\'ll go as a Daoist exorcist with a bell. Two of us will see twice as much.');
      s.despawn('sx'); s.despawn('yl');
      s.party(['shixiu']); s.setLeader('shixiu'); s.flag('protagonist', 'shixiu');
      s.flag('ch12_scout');
      await s.narrate('Shi Xiu shouldered a load of firewood and went into the village. The roads wound back and forth among the bamboo and the trees, and every one looked like every other.');
      await s.say(null, '(Find someone in the village who will talk.)');
    } }
  ]);
  WM.defEvents('zhujia_in', [
    { id: 'ch12_zhongli', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_scout') && WM.state.x >= 33; }, run: async function (s) {
      s.spawn('zl', 'zhongli', 35, 4, 'down');
      await s.say('shixiu', 'Grandfather, I\'m a stranger selling firewood. Every road here turns back on itself. How does anyone get out?');
      await s.say('zhongli', 'Young man, leave quickly! Liangshan is about to attack, and the Zhu family are taking every stranger as a spy. "Fine is the Zhu Family Village, and every road winds round" — so the song goes. Go wrong, and you walk onto caltrops, and the men in the bamboo take you.');
      await s.say('shixiu:sad', 'Then I\'m dead either way. Grandfather, save me.');
      await s.say('zhongli', '...You seem an honest man. Listen. Wherever you see a white poplar, turn there. That is the living road. The roads without poplars, wide or narrow, are dead roads.');
      await s.say('zhongli', 'My name is Zhongli. My family has lived here for generations. Stay the night; it\'s not safe on the roads.');
      s.sfx('gong');
      await s.narrate('Towards evening there was shouting outside. Shi Xiu looked out and saw a man stripped and bound being led past to the manor — Yang Lin. He had taken the wrong road and drawn his blade, and the Zhu men had pulled him down.');
      await s.say('zhongli', 'A Liangshan spy. They say he went the wrong way. Do you see? Don\'t go out tonight. The Zhu men are signalling to each other with a red lantern: wherever the lantern moves, the men in the bamboo follow.');
      s.despawn('zl');
      s.flag('away:yanglin');
      s.flag('ch12_poplar');
      await s.fadeOut(1);
      s.night(true);
      s.party(['songjiang', 'huarong', 'likui', 'yangxiong', 'huangxin']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.narrate('But Song Jiang, with no word from his scouts, had grown anxious. At dusk he led the army into the village himself, along the widest road, up to the very moat of the Zhu manor.');
      await s.warp('zhujia', 30, 15, 'up', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);
  WM.defEvents('zhujia', [
    { id: 'ch12_trapauto', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_poplar') && !S2.has('ch12_trap'); }, run: async function (s) {
      s.music('tense');
      await s.say('likui', 'The bridge is up and the gate\'s shut! Not a man on the walls! They\'re scared of us!');
      await s.say('songjiang:shock', '...No. Not a soldier, not a light — this is a trap. Turn back! Turn back at once!');
      s.sfx('cannon'); await s.shake(6, 0.5);
      await s.narrate('A signal cannon boomed from the manor. Arrows poured down from the wall, and behind them the roads they had come by were full of torches and shouting.');
      s.spawn('sx', 'shixiu', 30, 18, 'up');
      await s.say('shixiu', 'Brother! I found you! Don\'t take the wide roads — wherever you see a white poplar, turn there! That\'s the living road!');
      await s.say('huarong', 'And look — wherever that red lantern on the pole goes, their men follow it.');
      s.sfx('arrow'); await s.flash('#ffffff', 0.2);
      await s.narrate('Hua Rong drew his bow and shot. The red lantern dropped into the darkness, and the Zhu men in the bamboo, without their signal, ran about in confusion.');
      s.despawn('sx');
      s.addParty('shixiu');
      s.flag('ch12_trap');
      await s.say(null, '(Lead the army back to the camp. Turn only where the white poplars stand.)');
    } },
    { id: 'ch12_camp1', x: 0, y: 42, w: 60, h: 1, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch12_trap'); }, run: async function (s) {
      s.night(false); s.music('sad');
      await s.narrate('The army came out of the maze at dawn. But Huang Xin was missing — the hooks had caught his horse\'s legs in the dark and dragged him down — and Yang Lin was a prisoner in the manor.');
      s.flag('away:huangxin'); s.removeParty('huangxin');
      await s.say('songjiang:sad', 'Two brothers lost, and we never even crossed the moat. ...Li Ying of the Li Family Manor was wounded by Zhu Biao. Perhaps he will help us. I\'ll go to him myself.');
      s.flag('ch12_first');
      s.heal();
      await s.say(null, '(Go east to the Li Family Manor.)');
    } }
  ]);
  WM.defEvents('lijia', [
    { id: 'ch12_liying', x: 20, y: 16, w: 5, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch12_first'); }, run: async function (s) {
      s.spawn('dx', 'duxing', 22, 16, 'down');
      await s.say('duxing', 'Brother Song Jiang. My master thanks you for the gifts, but he is in bed with his wound, and dares not meet you.');
      await s.say('songjiang', 'I understand. He fears to be seen with us. Then tell me about the Zhu Village.');
      await s.say('duxing', 'The three villages swore an oath to stand together. The Zhu manor is on the ridge, with a moat and a drawbridge, and a front gate and a back gate. Their instructor is Luan Tingyu, the Iron Staff — he cannot be beaten by ten men. And the Hu family to the west have a daughter, Hu Sanniang, "Ten Feet of Blue." Her twin sabres are very fast. She is betrothed to Zhu Biao.');
      await s.say('songjiang', 'I thank you. The road we came in by is the wrong road, then. Next time we\'ll come at them from the front.');
      s.despawn('dx');
      s.flag('ch12_duxing');
      await s.say(null, '(Return to the camp before Zhu Village.)');
    } }
  ]);
  WM.defEvents('zhujia', [
    { id: 'ch12_second', x: 0, y: 42, w: 60, h: 8, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch12_duxing'); }, run: async function (s) {
      await s.narrate('Song Jiang divided his army and attacked again. Out of the west came a troop of horsemen, and at their head, on a red-maned horse, a young woman with a sabre in each hand: Hu Sanniang.');
      s.level('wangying', 22);
      await s.duel('wangying_hu', { hero: 'wangying', canLose: true });
      await s.narrate('Wang Ying the Stumpy Tiger had thought he would take her easily. Within ten bouts his hands were shaking. She hooked him out of the saddle with her lasso, and her men carried him off to the Zhu manor.');
      s.flag('away:wangying');
      await s.war('ch12_second');
      s.flag('away:qinming'); s.flag('away:dengfei');
      s.level('linchong', 25);
      await s.narrate('Hu Sanniang chased Song Jiang himself across the field — until Li Kui drew her off with his axes, and a rider in black came between them: Lin Chong, the Panther Head.');
      await s.duel('linchong_hu', { hero: 'linchong', canLose: true });
      await s.narrate('Lin Chong let her sabres slide off his serpent spear, reached across, and lifted her bodily from the saddle.');
      await s.say('songjiang', 'Do her no harm. Take her up the mountain to my father, Song Taigong, and keep her safe there.');
      s.music('sad');
      await s.narrate('That night Song Jiang could not sleep. Wang Ying, Qin Ming, Deng Fei, Huang Xin and Yang Lin were prisoners in the Zhu manor; Ou Peng was wounded. In the morning a messenger came: Wu Yong had come down from Liangshan with the three Ruan brothers, Lü Fang and Guo Sheng, and five hundred men.');
      s.spawn('wy', 'wuyong', 31, 44, 'left');
      await s.say('wuyong:smile', 'Don\'t despair, brother. The Zhu Village will be ours in a few days. Help has come to us from where we least expected it: a band of heroes from Dengzhou, at Shi Yong\'s tavern. Let me tell you how they came.');
      s.despawn('wy');
      s.flag('ch12_second');
      await WM.data.chapters[12].dengzhou(s);
    } }
  ]);

  // ---------------- Dengzhou (told by Wu Yong) ----------------
  WM.data.chapters[12].dengzhou = async function (s) {
    await s.fadeOut(1);
    s.party(['xiezhen', 'xiebao']); s.level('xiezhen', 23); s.level('xiebao', 23); s.setLeader('xiezhen'); s.flag('protagonist', 'xiezhen');
    WM.unlock('dengzhou');
    await s.narrate('In Dengzhou, by the sea, there were two brothers, hunters: Xie Zhen, the Two-Headed Snake, and Xie Bao, the Double-Tailed Scorpion. Both were over seven feet tall and had a snake and a scorpion tattooed on their legs. The prefect had ordered the hunters to catch a tiger on the hill within three days, or be beaten.');
    s.night(true);
    await s.warp('dengzhou', 9, 5, 'up', { noFade: true });
    s.flag('ch12_dz');
    await s.fadeIn(1);
  };
  WM.defEvents('dengzhou', [
    { id: 'ch12_hunt', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_dz'); }, run: async function (s) {
      await s.say('xiebao', 'The third night, brother. If we don\'t get it tonight, it\'s the stick for us.');
      await s.narrate('In the fourth watch the spring-bow went off with a twang. The tiger, a poisoned arrow in its side, came roaring out of the dark.');
      await s.battle('ch12_tiger', { bg: 'forest' });
      await s.narrate('Wounded and poisoned, the tiger rolled away down the hillside, over the wall, into the garden of Squire Mao\'s manor at the foot of the hill.');
      await s.say('xiezhen', 'It\'s in Squire Mao\'s garden. In the morning we\'ll knock and ask for it.');
      s.night(false);
      s.flag('ch12_tiger');
    } }
  ]);
  WM.defEvents('dengzhou_in', [
    { id: 'ch12_mao', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_tiger') && WM.state.x < 13; }, run: async function (s) {
      s.spawn('mt', 'maotaigong', 6, 4, 'down');
      await s.say('maotaigong:smile', 'The Xie brothers! So early? Sit down, have some breakfast first.');
      await s.narrate('Squire Mao kept them at breakfast as long as he could. When at last he took them into the garden, the grass was flattened and bloody — and there was no tiger.');
      s.spawn('mz', 'maozhong', 8, 6, 'up');
      await s.say('maotaigong:angry', 'A tiger? I see no tiger. You came here to rob me, under a pretext!');
      await s.say('maozhong', 'Father, I\'ve already taken a tiger to the prefecture this morning — the one that was killed on our land. These two smashed our things. Constables!');
      await s.say('xiezhen:angry', 'You\'ve stolen our tiger, and now you call us robbers?!');
      await s.narrate('Mao Zhong had the constables waiting. The brothers were taken to the prefecture as robbers. Mao\'s son-in-law, the clerk Wang Zheng, saw to it that they were beaten until they confessed, and the chief jailer, Bao Ji, took Mao\'s silver to make sure they never came out of the prison alive.');
      s.despawn('mt'); s.despawn('mz');
      s.flag('ch12_arrest');
      await s.fadeOut(1);
      s.party(['gudasao']); s.level('gudasao', 23); s.setLeader('gudasao'); s.flag('protagonist', 'gudasao');
      await s.warp('dengzhou_in', 31, 6, 'up', { noFade: true });
      await s.fadeIn(1);
      s.spawn('yh', 'yuehe', 31, 4, 'down');
      await s.say('yuehe', 'Sister-in-law Gu! I\'m Yue He, the jailer — Sun Li\'s wife is my sister. Your cousins the Xie brothers are in the death cell. Squire Mao has bought Bao Ji, and they won\'t live many days.');
      await s.say('gudasao:angry', 'My cousins? Husband! Sun Xin! Get in here!');
      s.spawn('sx', 'sunxin', 33, 5, 'left');
      await s.say('sunxin', 'We\'ll have to break them out. And for that we need my elder brother, Sun Li, the commander of the garrison. And Zou Yuan and Zou Run of Denglong Mountain.');
      s.spawn('zy', 'zouyuan', 29, 5, 'right'); s.spawn('zr', 'zourun', 29, 6, 'right');
      await s.say('zouyuan', 'Zou Yuan, the Forest-Emerging Dragon. This is my nephew Zou Run, the Single-Horned Dragon — he can knock a pine tree down with his head. We\'re in.');
      await s.narrate('Gu Dasao sent word to Sun Li that she was gravely ill. He came at once, with his wife.');
      s.spawn('sl', 'sunli', 31, 7, 'up');
      await s.say('sunli', 'Sister-in-law, you\'re not ill at all. What is this?');
      await s.say('gudasao:angry', 'Brother-in-law. We are going to break the Xie brothers out of prison. If you won\'t come, then —');
      s.sfx('slash');
      await s.say(null, 'Gu Dasao drew two sabres from under her skirt.');
      await s.say('gudasao:angry', '— then I start with you, and we\'ll go to Liangshan without you. The officials will hang you for us anyway.');
      await s.say('sunli:sad', '...Put those away. I\'m a garrison commander... and I\'m coming. But we do it my way.');
      ['yh', 'sx', 'zy', 'zr', 'sl'].forEach(function (k) { s.despawn(k); });
      ['sunli', 'sunxin', 'zouyuan', 'zourun', 'yuehe'].forEach(function (id) { s.addParty(id); s.level(id, 23); });
      s.flag('ch12_plot');
      await s.say(null, '(Go to the prison in the city.)');
    } },
    { id: 'ch12_jail', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_plot') && WM.state.x >= 14 && WM.state.x < 26; }, run: async function (s) {
      s.spawn('bj', 'baoji', 20, 4, 'down');
      await s.narrate('Gu Dasao went in with a basket, as a relative bringing food. Yue He let her through. When the signal came from outside, she drew her sabres.');
      await s.say('baoji:angry', 'What\'s this?!');
      s.despawn('bj');
      await s.battle('ch12_jail', { bg: 'town' });
      s.addParty('xiezhen'); s.addParty('xiebao');
      await s.narrate('Bao Ji died in the gateway of his own prison. The Xie brothers broke their cangues. Zou Yuan and Zou Run went to the clerk Wang Zheng\'s house and came back with his head. That same night they went to Squire Mao\'s manor, where a birthday feast was going on, and killed Squire Mao, Mao Zhong and their household, took the gold and silver and the horses, and burned the manor to the ground.');
      await s.narrate('Then all eight of them took the road to Liangshan. At Shi Yong\'s tavern they heard that Song Jiang was fighting the Zhu Family Village and had been beaten twice.');
      await s.say('sunli', 'Then we come with a gift. Luan Tingyu, the Zhu instructor, learned the spear from the same master as I did. I\'ll go to the Zhu manor as a garrison commander on my way to a new post, and ask to stay with my old fellow-student. When you attack, we open the gates from inside.');
      s.flag('ch12_dzdone');
      await s.fadeOut(1);
      s.party(['songjiang', 'huarong', 'likui', 'yangxiong', 'shixiu']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.warp('zhujia', 30, 46, 'up', { noFade: true });
      s.spawn('sl', 'sunli', 30, 44, 'down'); s.spawn('gd', 'gudasao', 28, 44, 'down'); s.spawn('xz', 'xiezhen', 32, 44, 'down');
      await s.fadeIn(1);
      await s.say('songjiang:smile', 'Heroes of Dengzhou! You come at the moment we most need you. Welcome — welcome, all of you!');
      s.despawn('sl'); s.despawn('gd'); s.despawn('xz');
      await s.joinMany(['sunli', 'sunxin', 'gudasao', 'xiezhen', 'xiebao', 'zouyuan', 'zourun', 'yuehe']);
      s.flag('ch12_dengzhou');
    } }
  ]);

  // ---------------- the third attack ----------------
  WM.defEvents('zhujia', [
    { id: 'ch12_hucheng', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_dengzhou'); }, run: async function (s) {
      s.spawn('hc', 'hucheng', 30, 43, 'down');
      await s.say('hucheng', 'I am Hu Cheng of the Hu Family Manor, Hu Sanniang\'s brother. My sister was foolish, and she was betrothed to Zhu Biao. I beg you, spare her.');
      await s.say('songjiang', 'Your sister took my brother Wang Ying. Send Wang Ying back, and she will come back to you. And from now on, the Hu family stays out of this. If any of the Zhu family flee to you, bind them and hand them to me.');
      await s.say('hucheng', '...Wang Ying is in the Zhu manor, not ours. But I swear: the Hu family will not lift a hand for the Zhu again, and anyone who comes to us, I will bind and bring to you.');
      s.despawn('hc');
      s.flag('ch12_hucheng');
      await s.fadeOut(1);
      s.party(['sunli', 'sunxin', 'gudasao', 'xiezhen', 'xiebao', 'yuehe']); s.setLeader('sunli'); s.flag('protagonist', 'sunli');
      await s.narrate('Sun Li came up the road to the Zhu manor with his banners flying and his family behind him, as a garrison commander on his way to his new post at Yunzhou.');
      await s.warp('zhujia', 30, 15, 'up', { noFade: true });
      s.spawn('lt', 'luantingyu', 30, 12, 'down');
      await s.fadeIn(1);
      await s.say('luantingyu:smile', 'Brother Sun Li! The Sick Yuchi himself! We learned the spear from the same master. What brings you here?');
      await s.say('sunli', 'I\'m transferred to Yunzhou, to guard against the Liangshan bandits. I heard you were here, and that the bandits are at your gate. Let me stay a few days and help you.');
      await s.say('luantingyu', 'Heaven sends you! Come in, come in.');
      s.despawn('lt');
      s.flag('ch12_inside');
      await s.warp('zhujia_in', 10, 9, 'up');
    } }
  ]);
  WM.defEvents('zhujia_in', [
    { id: 'ch12_staged', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_inside') && WM.state.x < 19; }, run: async function (s) {
      s.spawn('sz', 'squirezhu', 10, 4, 'down'); s.spawn('zl', 'zhulong', 7, 5, 'right'); s.spawn('zh', 'zhuhu', 13, 5, 'left'); s.spawn('zb', 'zhubiao', 13, 6, 'left'); s.spawn('lt', 'luantingyu', 7, 6, 'right');
      await s.say('squirezhu:smile', 'Commander Sun, you honour my house. With you and Instructor Luan, Liangshan will break its teeth on us.');
      await s.say('zhubiao', 'We have seven of their chiefs in the cages already. When we have Song Jiang, we\'ll send them all to the capital together.');
      await s.narrate('On the third day the Liangshan army came again, and a chief rode out to the bridge and challenged the manor. It was Shi Xiu.');
      await s.say('sunli', 'Let me go out. I\'ll show the Zhu family what a Dengzhou commander can do.');
      s.despawn('sz'); s.despawn('zl'); s.despawn('zh'); s.despawn('zb'); s.despawn('lt');
      s.level('sunli', 25);
      await s.duel('sunli_shixiu', { hero: 'sunli', canLose: true });
      await s.say('squirezhu:smile', 'Magnificent! Into the cage with him! Commander, you are our saviour!');
      s.flag('ch12_staged');
      await s.narrate('So Sun Li won the Zhu family\'s trust. Inside the manor, Zou Yuan and Zou Run learned where the prison was, and Yue He where the keys were kept. On the fifth day, at the signal, Song Jiang attacked from four sides at once.');
      s.music('battle');
      await s.say('gudasao:angry', 'Now!');
      await s.battle('ch12_inside', { bg: 'town' });
      await s.narrate('Gu Dasao ran into the inner rooms with her two sabres, and none of the women of the Zhu household came out. Squire Zhu tried to throw himself into a well, and Shi Xiu, out of his cage, cut him down at the well\'s edge.');
      s.unflag('away:yanglin'); s.unflag('away:huangxin'); s.unflag('away:wangying'); s.unflag('away:qinming'); s.unflag('away:dengfei');
      await s.join('shiqian');
      await s.war('ch12_third');
      s.flag('ch12_victory');
      await s.warp('zhujia', 30, 15, 'down');
    } }
  ]);
  WM.defEvents('zhujia', [
    { id: 'ch12_after', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_victory'); }, run: async function (s) {
      s.party(['songjiang', 'likui', 'linchong', 'huarong', 'sunli', 'shixiu']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.spawn('lk', 'likui', 31, 17, 'up');
      await s.narrate('Zhu Long fled for the Li village, and Li Kui caught him on the road and split his head with one axe-stroke. Zhu Biao fled to the Hu manor; Hu Cheng, as he had sworn, bound him and was bringing him to Song Jiang — when Li Kui met them on the road, cut Zhu Biao down, and then charged into the Hu manor and killed the Hu family, old and young. Only Hu Cheng escaped, and fled to Yan\'an.');
      await s.say('songjiang:angry', 'Li Kui! Hu Cheng had surrendered! I gave him my word! Who told you to kill the Hu family?');
      await s.say('likui', 'Brother, you forgot — but I didn\'t. That girl was going to marry Zhu Biao, so they were in-laws. And I had a good time of it, too.');
      await s.say('songjiang:angry', 'You disobeyed my orders. That should cost you your head. ...Your merit today pays for it. But you get no reward.');
      await s.say('likui:smile', 'I didn\'t want a reward. I got to kill plenty. Ha!');
      s.despawn('lk');
      await s.say('songjiang:sad', 'Only it is a pity about Luan Tingyu. He was a true hero, and he died in the fighting.');
      s.spawn('zl', 'zhongli', 30, 18, 'up');
      await s.say('songjiang', 'Grandfather Zhongli. Shi Xiu told me how you saved him. If not for you, I would have razed this whole village. For your sake I spare it. Take this gold and silk; and every household here shall have a shi of rice from the Zhu granaries.');
      await s.say('zhongli:smile', 'Great King! The village will remember you.');
      s.despawn('zl');
      await s.narrate('Five hundred thousand shi of grain were carried out of the Zhu manor. Then Song Jiang turned to the Li Family Manor. Li Ying had not fought, and would not come. So Wu Yong made a plan.');
      s.flag('ch12_aftermath');
      await s.warp('lijia', 22, 19, 'up');
    } }
  ]);
  WM.defEvents('lijia', [
    { id: 'ch12_ruse', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_aftermath'); }, run: async function (s) {
      s.spawn('xr', 'xiaorang', 22, 17, 'down'); s.spawn('dz', 'daizong', 21, 18, 'right'); s.spawn('yl', 'yanglin', 23, 18, 'left');
      s.spawn('ly', 'liying', 22, 15, 'down'); s.spawn('dx', 'duxing', 23, 15, 'down');
      await s.narrate('A few days later a prefect came to the Li manor with constables and clerks.');
      await s.say('xiaorang', '(in a magistrate\'s voice) Li Ying! You are in league with the Liangshan bandits who destroyed the Zhu Family Village! Bind him and his steward!');
      await s.say('liying:shock', 'Your Honour, I never — I was wounded, I never left my bed —');
      await s.narrate('Li Ying and Du Xing were bound and led away. A few li down the road, Liangshan men burst out of the woods, drove off the "constables," and carried the prisoners up the mountain.');
      ['xr', 'dz', 'yl', 'ly', 'dx'].forEach(function (k) { s.despawn(k); });
      s.flag('ch12_ruse');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch12_end', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch12_ruse') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('ly', 'liying', 15, 7, 'down'); s.spawn('xr', 'xiaorang', 13, 7, 'right'); s.spawn('sj', 'songjiang', 15, 5, 'down');
      await s.say('liying:angry', 'Song Jiang! You\'ve ruined me! I\'ll go back and clear my name with the prefecture!');
      await s.say('songjiang', 'Look at the "prefect," Squire Li.');
      await s.say('xiaorang:smile', 'Xiao Rang, the Master Calligrapher, at your service. I make a passable magistrate, I\'m told.');
      await s.say('songjiang', 'And your family and all your goods are already on the mountain. Your manor is burnt. There is nothing to go back to — except brothers here.');
      await s.say('liying:sad', '...You have left me no road but this one. Very well. Du Xing and I will stay.');
      await s.joinMany(['liying', 'duxing']);
      s.despawn('xr');
      s.spawn('hs', 'husanniang', 17, 7, 'left'); s.spawn('wy', 'wangying', 19, 7, 'left');
      await s.say('songjiang', 'And one more thing. Long ago I promised Brother Wang Ying a bride. My father, Song Taigong, has taken Hu Sanniang as his adopted daughter. Sister, today is an auspicious day. Will you marry Wang Ying?');
      await s.say('husanniang', '...My family is gone. Brother Song has treated me with honour. I will do as he says.');
      await s.say('wangying:smile', 'Brother Song Jiang... you\'re a man of your word!');
      await s.join('husanniang');
      await s.narrate('So Hu Sanniang, Ten Feet of Blue, married Wang Ying the Stumpy Tiger, and the whole mountain feasted for days.');
      s.despawn('ly'); s.despawn('sj'); s.despawn('hs'); s.despawn('wy');
      s.flag('ch12_done');
      await s.endChapter();
      if (WM.data.chapters[13].begin) await WM.data.chapters[13].begin(s);
    } }
  ]);
})();
