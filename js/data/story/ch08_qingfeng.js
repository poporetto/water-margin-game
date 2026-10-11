// Chapter 8 — "Qingfeng Fort" (novel chapters 32–35).
// Song Jiang is nearly made into soup on Qingfeng Mountain; Liu Gao's wife; the Lantern Festival; Hua Rong;
// Huang Xin; Qin Ming's ruin and surrender; the tangled halberds of Lü Fang and Guo Sheng; Shi Yong's letter;
// the heroes go to Liangshan while Song Jiang goes home and is arrested.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('liugao', 'Liu Gao', { skin: '#f0c49a', hairStyle: 'futou', beard: 'mustache', body: '#3a2a5a', trim: '#c8b890', face: 'long', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('liuwife', 'Lady Liu', { skin: '#f6e2cc', hairStyle: 'woman', body: '#8a4a6a', trim: '#f0e0c0', dress: true, build: 'slim', face: 'narrow', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('qingzhouprefect', 'Prefect Murong', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', body: '#7a1a1a', trim: '#d8b36a' }, { face: true });
  WM.npc('zhaoneng', 'Constable Zhao', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#c8302a', weapon: 'dao' }, { face: true });

  WM.enemy('qz_soldier', 'Qingzhou Soldier', 18, WM.hum(WM.enemyLooks.soldier), { hp: 0.8, atk: 0.72, range: 'M', exp: 95, drops: [['medicine', 0.12]] });
  WM.enemy('qz_archer', 'Qingzhou Archer', 18, WM.hum(WM.enemyLooks.archer), { hp: 0.7, atk: 0.55, range: 'L', fx: 'arrow', exp: 95 });
  WM.enemy('liugao_guard', 'Liu Gao\'s Guard', 17, WM.hum(WM.enemyLooks.constable), { exp: 90 });
  WM.enemy('huangxin_boss', 'Huang Xin', 20, WM.hum(WM.data.chars.huangxin.look), { hp: 1.9, atk: 0.75, exp: 450, gold: 200, boss: true, skills: [{ name: 'Mourning Sword', chance: 0.3, type: 'phys', power: 1.5 }] });
  WM.enemy('liugao_boss', 'Liu Gao', 18, WM.hum(WM.data.npcs.liugao.look), { hp: 1.2, atk: 0.7, exp: 300, gold: 300, boss: true });
  var T = WM.data.troops;
  T.ch8_liugao = { enemies: ['liugao_guard', 'liugao_guard', 'liugao_guard'], bg: 'snow', noRun: true };
  T.ch8_escort = { enemies: ['qz_soldier', 'huangxin_boss', 'liugao_boss', 'qz_archer'], bg: 'snow', boss: true };

  WM.data.duels.huarong_qinming = {
    hero: 'huarong', foe: 'qinming', bg: 'snow', heroHp: 460, heroAtk: 44, foeHp: 460, foeAtk: 46, drawAfter: 4,
    intro: [['foe:angry', 'Hua Rong! You come from a family of officers and you side with bandits? Come down and be bound!'], ['hero', 'Commander Qin, you don\'t know the truth of it. Liu Gao drove us to this.']],
    lines: {
      attack: ['Thunderbolt!', 'Take my mace!', 'Hraah!'],
      wild: ['I\'ll smash you and your bow together!', 'Feel the Thunderbolt\'s fire!', 'One blow — now!'],
      defend: ['Hm, his arrows...', 'Come, come!', 'Watch his bow-hand...']
    },
    draw: [['hero', '(He\'s too strong to beat head-on. Better to lead him into the hills.)']]
  };
  WM.data.wars.ch8_qinming = {
    name: 'Qin Ming Attacks Qingfeng Mountain', goal: 'commander', turns: 10, music: 'war',
    map: [
      'mmTT..........',
      'm.T....:......',
      'mmm...::......',
      'm.T..::.......',
      'mm...:........',
      'm.TT..........',
      'mmmm..........'
    ],
    player: [
      { leader: 'songjiang', type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'huarong', type: 'arch', x: 1, y: 1 },
      { leader: 'yanshun', type: 'inf', x: 2, y: 3 },
      { leader: 'wangying', type: 'cav', x: 2, y: 5 },
      { leader: 'zhengtianshou', type: 'inf', x: 1, y: 4 }
    ],
    enemy: [
      { name: 'Qin Ming', portrait: 'qinming', type: 'cav', atk: 96, def: 82, x: 12, y: 3, commander: true },
      { name: 'Qingzhou Cavalry', type: 'cav', atk: 74, def: 62, x: 11, y: 1 },
      { name: 'Qingzhou Cavalry', type: 'cav', atk: 74, def: 62, x: 11, y: 5 },
      { name: 'Qingzhou Archers', type: 'arch', atk: 68, def: 50, x: 13, y: 2 },
      { name: 'Qingzhou Foot', type: 'inf', atk: 66, def: 66, x: 13, y: 4 }
    ],
    intro: [['songjiang', 'Qin Ming has brought five hundred men from Qingzhou. He is fierce, but hot-tempered.'], ['huarong', 'Then let\'s make him angry. In the hills his cavalry are useless, and at night the pits we dug will do the rest.'], [null, 'Victory: capture Qin Ming. The hills and forests on the left favour the defender.']],
    events: [{ turn: 4, run: async function (s, api) {
      await s.say(null, 'Night falls. Qin Ming, raging at the arrows from the dark, drives his men up the mountain — straight into the pit traps.');
      s.sfx('earth');
      var q = api.unit('Qin Ming'); if (q && q.losses < 2) q.losses = 1;
      api.weaken('enemy', 0.8);
    } }],
    win: [['yanshun', 'Qin Ming is in the pit! Drag him out!']], lose: [['songjiang:sad', 'Fall back to the stronghold!']]
  };

  WM.data.chapters[8].begin = async function (s) {
    await s.chapter(8);
    s.party(['songjiang']); s.level('songjiang', 18); s.setLeader('songjiang');
    WM.state.chars.songjiang.equip.body = 'quilted'; WM.state.chars.songjiang.equip.head = 'leathercap';
    s.flag('protagonist', 'songjiang');
    s.give('medicine', 2, true);
    WM.unlock('qingfengshan', 'qingfeng', 'kongmanor');
    await s.narrate('Song Jiang left the Kong family manor alone and travelled towards Qingfeng Fort. It was winter, and on the road through the mountains darkness caught him. As he hurried on through the forest, his foot caught a tripwire, bells rang, and a dozen bandits sprang out and bound him.');
    await s.warp('qingfengshan_in', 9, 7, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[8].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 7; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng'].forEach(function (id) { S.recruit(id, 18); });
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng', 'boarforest', 'chaimanor', 'cangzhou', 'zhugui', 'daming', 'shijie', 'huangni', 'erlong', 'yuncheng', 'dongxi', 'songfarm', 'jingyang', 'yanggu', 'crossslope', 'mengzhou');
    await WM.data.chapters[8].begin(s);
  };

  WM.defEvents('qingfengshan_in', [
    { id: 'ch8_soup', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 8; }, run: async function (s) {
      s.spawn('yanshun', 'yanshun', 9, 4, 'down'); s.spawn('wangying', 'wangying', 7, 5, 'right'); s.spawn('zheng', 'zhengtianshou', 11, 5, 'left');
      await s.say('yanshun', 'A fat one. Boys, cut out his heart and make sobering soup for the three of us.');
      await s.say('songjiang:sad', '(...So this is how it ends.) Alas, that Song Jiang should die in a place like this.');
      await s.emote('yanshun', '!');
      await s.say('yanshun:shock', 'Wait! What did you say? Song Jiang? Which Song Jiang?');
      await s.say('songjiang', 'Song Jiang of Yuncheng county. A clerk. A fugitive.');
      await s.say('yanshun:shock', 'Timely Rain Song Gongming?! The Song Jiang who saved Chao Gai?');
      await s.narrate('Yan Shun leapt up, cut the ropes himself, threw his own cloak around Song Jiang\'s shoulders, and dropped to his knees. Wang Ying and Zheng Tianshou knelt beside him. "We nearly killed the most righteous man under heaven! Gouge out our eyes!"');
      s.flag('ch8_bandits');
      await s.say('yanshun', 'I am Yan Shun, a cattle-trader from Laizhou, called the Brocade Tiger. This is Wang Ying, the Stumpy Tiger, and Zheng Tianshou, the Fair-Faced Gentleman. Stay with us, brother! Stay as long as you like!');
      await s.narrate('Song Jiang stayed some days on Qingfeng Mountain. One day Wang Ying, who could never resist a pretty woman, came back from the road with a lady in a sedan chair — the wife of a Qingfeng Fort official, returning from visiting her mother\'s grave.');
      s.spawn('lady', 'liuwife', 10, 7, 'up');
      await s.say('wangying:smile', 'Look what I caught on the road, brothers! My new wife!');
      await s.say('liuwife:sad', 'I am the wife of Liu Gao, the civil commander of Qingfeng Fort. Please... let me go home.');
      await s.say('songjiang', '(The wife of Hua Rong\'s colleague!) Brother Wang, this lady is the wife of an official, and of a colleague of my sworn brother Hua Rong. Let her go — for my sake. I promise you, one day I will find you a good wife myself.');
      await s.say('wangying:sad', '...For you, brother. All right.');
      await s.say('liuwife', 'Thank you, sir... thank you.');
      s.despawn('lady'); s.despawn('yanshun'); s.despawn('wangying'); s.despawn('zheng');
      await s.narrate('Lady Liu went home. And Song Jiang, after a few more days, set out for Qingfeng Fort to see Hua Rong, at last.');
      s.flag('ch8_tohua');
    } }
  ]);
  WM.defEvents('qingfeng', [
    { id: 'ch8_lanterns', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_tohua'); }, run: async function (s) {
      s.spawn('huarong', 'huarong', 20, 24, 'down');
      await s.move('huarong', 'D2', { run: true });
      await s.say('huarong:smile', 'Brother Song! At last! I heard about Yuncheng — I\'ve been praying you\'d come here. Stay with me, as long as you need.');
      await s.say('songjiang', 'Hua Rong. You\'ve grown into a fine officer.');
      await s.narrate('Song Jiang stayed at Hua Rong\'s house, and spoke of Lady Liu, whom he had saved on the mountain. Hua Rong frowned. "Liu Gao is a corrupt, petty man, and his wife is worse. You should not have saved her." Song Jiang only said, "A kindness is never wasted."');
      await s.narrate('The fifteenth of the first month came: the Lantern Festival. The whole fort was hung with lanterns, and Song Jiang went out with Hua Rong\'s servants to see them.');
      s.despawn('huarong');
      s.night(true);
      s.place('player', 20, 14, 'right');
      s.spawn('lady', 'liuwife', 28, 14, 'left'); s.spawn('liugao', 'liugao', 29, 13, 'left');
      await s.say('liuwife:angry', 'There! That short dark man — he\'s the bandit chief from Qingfeng Mountain who carried me off!');
      await s.say('songjiang:shock', 'What?!');
      await s.say('liugao:angry', 'Seize him!');
      await s.battle('ch8_liugao', { bg: 'snow', canLose: true, rounds: 2 });
      await s.narrate('Song Jiang was overpowered and dragged before Liu Gao. "I am Zhang San, a merchant from Yuncheng!" he protested. "Liar! You\'re the bandit chief!" Liu Gao had him beaten until his skin split, and locked him in a cage.');
      s.despawn('lady'); s.despawn('liugao');
      s.party(['huarong']); s.level('huarong', 18); s.setLeader('huarong');
      WM.state.chars.huarong.equip.body = 'leather';
      s.flag('protagonist', 'huarong');
      s.flag('ch8_caged');
      await s.narrate('When Hua Rong heard, he wrote to Liu Gao, calling the prisoner his kinsman Liu Zhang. Liu Gao tore up the letter. So Hua Rong armed his men, and went himself.');
      await s.say(null, '(Liu Gao\'s residence is on the east side of the fort.)');
    } }
  ]);
  WM.defEvents('qingfeng_in', [
    { id: 'ch8_rescue', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_caged') && WM.state.x >= 17; }, run: async function (s) {
      s.spawn('sj', 'songjiang', 20, 8, 'up'); s.lie('sj');
      await s.say('huarong:angry', 'Liu Gao! You beat my kinsman half to death on a lie! Where is he?');
      await s.narrate('Liu Gao\'s guards fell back before Hua Rong\'s bow. Hua Rong broke open the cage and carried Song Jiang out himself. On the way out he fired an arrow into the lintel of Liu Gao\'s gate: "The next one will be for your heart."');
      s.despawn('sj');
      await s.narrate('But Song Jiang could not stay at Hua Rong\'s. "Liu Gao will report to Qingzhou that you harbour bandits. I must go back to Qingfeng Mountain." That night he slipped out — and Liu Gao\'s men, waiting in ambush on the road, caught him again.');
      await s.narrate('Liu Gao reported to the prefect of Qingzhou, who sent his military supervisor Huang Xin, the "Suppressor of Three Mountains." Huang Xin invited Hua Rong to a feast "to make peace with Liu Gao" — and seized him at the table. Song Jiang and Hua Rong were put in prison carts to be taken to Qingzhou.');
      s.flag('ch8_carts');
      s.party(['songjiang', 'huarong']); s.setLeader('songjiang');
      s.addParty('yanshun'); s.addParty('wangying'); s.addParty('zhengtianshou');
      s.level('yanshun', 17); s.level('wangying', 16); s.level('zhengtianshou', 16);
      s.flag('protagonist', 'songjiang');
      await s.narrate('On the road through the hills, the bandits of Qingfeng Mountain were waiting.');
      await s.warp('qingfengshan', 14, 28, 'up');
    } }
  ]);
  WM.defEvents('qingfengshan', [
    { id: 'ch8_ambush', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_carts'); }, run: async function (s) {
      await s.say('yanshun', 'Halt! Leave the carts and the silver, and you can keep your heads!');
      await s.battle('ch8_escort', { bg: 'snow', music: 'boss' });
      await s.narrate('Huang Xin fled back to Qingzhou alone. Liu Gao was taken, and Hua Rong, who had suffered from him more than anyone, ended his life. Song Jiang and Hua Rong went up to the stronghold. They knew Qingzhou would send an army next — and that its commander would be Qin Ming, the Thunderbolt.');
      s.flag('ch8_ambushed');
      s.heal();
    } },
    { id: 'ch8_war', x: 13, y: 12, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch8_ambushed'); }, run: async function (s) {
      await s.narrate('Qin Ming came, as they had known he would, with five hundred men, and rode up to the foot of the mountain roaring for the bandits to come down.');
      await s.duel('huarong_qinming', { hero: 'huarong', canLose: true });
      await s.narrate('Hua Rong turned his horse as if fleeing, drew his bow, and shot the red tassel off the top of Qin Ming\'s helmet. Qin Ming, beside himself, chased the outlaws up and down the mountain all day, and found only arrows and empty slopes.');
      await s.war('ch8_qinming');
      s.flag('ch8_qinmingtaken');
    } }
  ]);
  WM.defEvents('qingfengshan_in', [
    { id: 'ch8_qinming', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_qinmingtaken'); }, run: async function (s) {
      s.spawn('qinming', 'qinming', 9, 5, 'down'); s.spawn('huarong', 'huarong', 7, 6, 'right'); s.spawn('yanshun', 'yanshun', 11, 6, 'left');
      await s.say('songjiang', 'Untie him! Commander Qin, forgive us. We are not bandits by choice. Stay with us.');
      await s.say('qinming:angry', 'I am an officer of the Song. I would rather die than join you. Let me go back to Qingzhou.');
      await s.say('songjiang', '...Then rest tonight, and go in the morning. We will return your horse and your weapons.');
      await s.narrate('Song Jiang feasted Qin Ming and kept him drinking late. That night, men of the mountain dressed in his armour and rode on his horse to the villages around Qingzhou, burning and killing, crying "Qin Ming has joined the bandits!"');
      await s.narrate('In the morning Qin Ming rode home. He found the villages around Qingzhou burned, and the city gate shut against him. On a spear above the wall was the head of his wife. "Traitor!" shouted the prefect. "Your family has paid for your treason!"');
      s.place('qinming', 9, 5, 'down');
      s.music('sad');
      await s.say('qinming:angry', 'Song Jiang!! You did this! You and your bandits — you burned the villages in my name! My wife — my family — !');
      await s.say('songjiang:sad', 'Commander... it is true. It was my plan. I wanted a man like you among us, and I knew you would never come of your own will. I am responsible for your family\'s death. Kill me if you must.');
      await s.say('songjiang', 'But hear me first. Hua Rong has a sister, wise and virtuous. If you will stay with us, she will be your wife, and we will be your family.');
      await s.narrate('Qin Ming stood a long while in silence. Their kindness, the hopelessness of his position, and the respect they showed him wore down his anger. At last he bowed his head. "You have left me no road back. ...So be it."');
      await s.say('qinming', 'My lieutenant Huang Xin holds Qingfeng Fort. He was my pupil. I will bring him to you.');
      s.despawn('qinming'); s.despawn('huarong'); s.despawn('yanshun');
      await s.narrate('Huang Xin came over with the fort. Qin Ming married Hua Rong\'s sister. And when they heard that Qingzhou was raising a great army against them, Song Jiang said: "There is only one place for us now. Liangshan Marsh."');
      await s.narrate('On the road south, at a mountain called Duiying, they came upon two young men in a valley fighting on horseback with painted halberds — one all in red, one all in white. The two halberds\' tassels had become entangled, and neither could pull free. Hua Rong drew his bow, aimed, and with a single arrow cut the tassels apart. The whole valley cheered.');
      await s.narrate('The two were Lü Fang, the Little Marquis, who held that mountain, and Guo Sheng, who had come to take it from him. Both knelt to Song Jiang and asked to join.');
      await s.narrate('At an inn on the road a rough man named Shi Yong, the Stone General, sat in Song Jiang\'s seat and would not move until he heard who Song Jiang was. "I\'ve been searching for you! I have a letter from your brother Song Qing."');
      await s.say('songjiang:shock', '(reading) "...Father died in the first month of this year... we await your return to bury him..." Father! Father!');
      await s.narrate('Song Jiang fell down weeping and beating his breast. He would not go on to Liangshan. He wrote a letter to Chao Gai for the others to carry, and set out for home alone, by night.');
      s.flag('ch8_letter');
      await s.notice('The heroes of Qingfeng go on to Liangshan.', { auto: 2 });
      await s.joinMany(['huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong']);
      ['huangxin', 'lufang', 'guosheng', 'shiyong'].forEach(function (id) { s.level(id, 17); });
      s.party(['songjiang']); s.setLeader('songjiang');
      await s.warp('songfarm', 15, 23, 'up');
    } }
  ]);
  WM.defEvents('songfarm', [
    { id: 'ch8_home', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_letter'); }, run: async function (s) {
      s.spawn('father', 'songtaigong', 15, 14, 'down'); s.spawn('qing', 'songqing', 16, 14, 'down');
      await s.move('player', 'U6', { run: true });
      await s.say('songjiang:shock', 'Father?! You\'re alive!');
      await s.say('songtaigong', 'My son, forgive me. There has been an amnesty for the new Crown Prince. Your crime is reduced; you will only be exiled, not executed. I feared you would join those bandits at Liangshan and be a rebel forever. So I had Qing write that letter, to bring you home.');
      await s.say('songjiang:sad', '...Father.');
      await s.narrate('That same night the constables surrounded the farm. Song Jiang gave himself up. Because of the amnesty, he was sentenced only to twenty strokes and exile to Jiangzhou, on the Yangtze, far in the south.');
      s.despawn('father'); s.despawn('qing');
      s.flag('ch8_done');
      await s.endChapter();
      if (WM.data.chapters[9].begin) await WM.data.chapters[9].begin(s);
    } }
  ]);
})();
