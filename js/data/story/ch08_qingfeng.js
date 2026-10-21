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
    await s.narrate('Song Jiang left the Kong family manor alone and travelled towards Qingfeng Fort. It was winter, and on the road through the mountains darkness caught him.');
    // the forest road up Qingfeng Mountain, at night
    s.night(true);
    await s.warp('qingfengshan', 14, 32, 'up', { noFade: true });
    await s.fadeIn(0.8);
    await s.move('player', 'U4', { speed: 44 });
    s.sfx('cursor'); s.sfx('blip'); await s.shake(1, 0.2);   // a tripwire, and bells in the dark
    await s.emote('player', '!', 0.8);
    await s.narrate('As he hurried on through the forest, his foot caught a tripwire, and bells rang out in the trees.');
    // bandits spring out of the dark on every side
    var p = s.actor('player').tile();
    s.spawn('qb1', 'bandit', p.x - 3, p.y - 1, 'right'); s.spawn('qb2', 'bandit', p.x + 3, p.y - 1, 'left'); s.spawn('qb3', 'bandit', p.x - 2, p.y + 2, 'up'); s.spawn('qb4', 'bandit', p.x + 2, p.y + 2, 'up');
    s.walkTo('qb1', p.x - 1, p.y, { run: true }); s.walkTo('qb2', p.x + 1, p.y, { run: true }); s.walkTo('qb3', p.x, p.y + 1, { run: true });
    await s.walkTo('qb4', p.x, p.y - 1, { run: true });
    await s.say('bandit:smile', 'Got one! Tie him up — the chiefs will want to see this fat catch.', { top: true });
    s.sfx('block'); await s.shake(2, 0.3);
    await s.emote('player', 'sweat', 0.8);
    await s.narrate('A dozen bandits sprang out and bound him, and carried him up the mountain to their stronghold.');
    await s.fadeOut(0.8);
    ['qb1', 'qb2', 'qb3', 'qb4'].forEach(function (k) { s.hide(k); s.despawn(k); });
    s.night(false);
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
      s.despawn('lady', { leave: true }); s.despawn('yanshun'); s.despawn('wangying'); s.despawn('zheng');
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
      s.despawn('huarong', { leave: true });
      // the festival night: out of the gate and along the lantern street
      await s.fadeOut(0.8);
      s.night(true);
      s.place('player', 20, 18, 'up');
      s.spawn('sv1', 'servant', 19, 19, 'up'); s.spawn('sv2', 'servant', 21, 19, 'up');
      await s.wait(0.2);
      await s.fadeIn(0.8);
      s.move('sv1', 'U4', { speed: 40, wait: false }); s.move('sv2', 'U4', { speed: 40, wait: false });
      await s.move('player', 'U4', { speed: 40 });
      s.face('player', 'left'); await s.wait(0.5); s.face('player', 'right'); await s.wait(0.4);   // looking at the lanterns
      // the Lius come walking along the cross street, the lady on her husband's arm; she stops dead
      s.spawn('lady', 'liuwife', 31, 14, 'left'); s.spawn('liugao', 'liugao', 32, 13, 'left');
      s.move('liugao', 'L4', { speed: 40, wait: false }); await s.move('lady', 'L3', { speed: 40 });
      await s.emote('lady', '!', 0.8);
      s.face('sv1', 'right'); s.face('sv2', 'right');
      await s.say('liuwife:angry', 'There! That short dark man — he\'s the bandit chief from Qingfeng Mountain who carried me off!');
      await s.say('songjiang:shock', 'What?!');
      await s.say('liugao:angry', 'Guards! Seize him!');
      // soldiers come running from all sides and close in round him; the servants scatter
      s.spawn('g1', 'soldier', 20, 9, 'down'); s.spawn('g2', 'soldier', 15, 14, 'right'); s.spawn('g3', 'soldier', 25, 14, 'left'); s.spawn('g4', 'soldier', 20, 19, 'up');
      s.walkTo('sv1', 17, 17, { run: true }); s.walkTo('sv2', 24, 19, { run: true });
      s.walkTo('g1', 20, 13, { run: true }); s.walkTo('g2', 19, 14, { run: true }); s.walkTo('g3', 21, 14, { run: true });
      await s.walkTo('g4', 20, 15, { run: true });
      s.hide('sv1'); s.hide('sv2');
      await s.emote('player', 'sweat', 0.8);
      await s.battle('ch8_liugao', { bg: 'snow', canLose: true, rounds: 2 });
      // overpowered, and dragged before Liu Gao
      s.sfx('block'); await s.shake(3, 0.3);
      await s.say('songjiang:shock', 'I am Zhang San, a merchant from Yuncheng! You have the wrong man!');
      await s.say('liugao:angry', 'Liar! You\'re the bandit chief! My wife knows your face. Beat him!');
      for (var hit = 0; hit < 3; hit++) { s.sfx('hit'); s.jump('g2', 3); s.jump('player', 2); await s.shake(2, 0.2); await s.wait(0.25); }
      s.lie('player');
      await s.narrate('Liu Gao had him beaten until his skin split, and locked him in a cage.');
      // dragged away east to Liu Gao's residence, a soldier at each arm
      s.lie('player', false);
      var pl = s.actor('player');
      s.walkTo('liugao', 31, 13); s.walkTo('lady', 31, 14);
      s.walkTo('g2', 27, 13, { speed: 40 }); s.walkTo('g3', 27, 15, { speed: 40 });
      pl.path = [{ x: 27 * 16 + 8, y: 14 * 16 + 15 }]; pl.speed = 40;
      s.walkTo('g1', 26, 13, { speed: 40 }); await s.walkTo('g4', 25, 15, { speed: 40 });
      await s.fadeOut(0.8);
      ['g1', 'g2', 'g3', 'g4'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.hide('lady'); s.hide('liugao');
      s.despawn('lady'); s.despawn('liugao'); s.despawn('sv1'); s.despawn('sv2');
      s.party(['huarong']); s.level('huarong', 18); s.setLeader('huarong');
      WM.state.chars.huarong.equip.body = 'leather';
      s.flag('protagonist', 'huarong');
      s.flag('ch8_caged');
      await s.narrate('When Hua Rong heard, he wrote to Liu Gao, calling the prisoner his kinsman Liu Zhang. Liu Gao tore up the letter. So Hua Rong armed his men, and went himself.');
      s.place('player', 20, 18, 'up');
      await s.fadeIn(0.8);
      await s.say(null, '(Liu Gao\'s residence is on the east side of the fort.)');
    } }
  ]);
  WM.defEvents('qingfeng_in', [
    { id: 'ch8_rescue', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch8_caged') && WM.state.x >= 17; }, run: async function (s) {
      s.spawn('sj', 'songjiang', 19, 4, 'up'); s.lie('sj');   // beaten, in the cage
      var D = WM.data, lg = D.troop(s, 'lgg', 'guard', [[24, 6], [26, 5], [28, 5], [29, 7]], 'down');
      await s.say('huarong:angry', 'Liu Gao! You beat my kinsman half to death on a lie! Where is he?');
      await s.say('guard', 'The Commandant\'s orders — no one goes near the prisoner! Stand back, Major Hua!');
      s.sfx('arrow'); await s.flash('#ffffff', 0.15); s.emote('lgg0', '!', 0.8);
      await s.say('huarong:angry', 'That arrow went where I meant it to. The next one goes where I mean it to as well. Who is first?');
      lg.forEach(function (k) { s.move(k, 'U2', { run: true, wait: false }); });
      await s.wait(0.5);
      await s.walkTo('player', 20, 7); s.face('player', 'up');
      s.sfx('door'); await s.wait(0.3);   // the cage door wrenched open
      await s.move('player', 'U2');
      s.sfx('hit');
      await s.narrate('Liu Gao\'s guards fell back before Hua Rong\'s bow. He broke open the cage and lifted Song Jiang out himself, and on the way out he put an arrow into the lintel of Liu Gao\'s gate: "The next one will be for your heart."');
      // back at Hua Rong's house, Song Jiang on his feet again, bandaged
      await s.fadeOut(0.8);
      D.clear(s, lg); s.hide('sj'); s.despawn('sj');
      await s.warp('qingfeng_in', 8, 7, 'left', { noFade: true });
      s.spawn('sj2', 'songjiang', 7, 7, 'right');
      await s.wait(0.2);
      await s.fadeIn(0.8);
      await s.say('songjiang:sad', 'Brother, I cannot stay here. Liu Gao will report to Qingzhou that you harbour bandits, and then it is your head as well as mine. I must go back to Qingfeng Mountain.');
      await s.say('huarong', 'You can hardly walk, brother. At least wait until —');
      await s.say('songjiang', 'Tonight. While the fort sleeps.');
      // that night he slips out of the gate and down the street towards the south gate
      await s.fadeOut(0.8);
      s.hide('sj2'); s.despawn('sj2');
      s.night(true);
      await s.warp('qingfeng', 20, 10, 'down', { noFade: true }); s.hide('player');
      s.spawn('sj3', 'songjiang', 9, 9, 'down');
      s.camera(15, 15, 0.1);
      await s.fadeIn(0.8);
      await s.walkTo('sj3', 9, 13, { speed: 34 }); await s.walkTo('sj3', 19, 14, { speed: 34 });
      s.camera(20, 19, 0.6);
      await s.walkTo('sj3', 20, 21, { speed: 34 });
      // Liu Gao's men rise out of the dark on every side
      s.spawn('am1', 'soldier', 17, 21, 'right'); s.spawn('am2', 'soldier', 23, 21, 'left'); s.spawn('am3', 'soldier', 20, 25, 'up'); s.spawn('am4', 'soldier', 20, 17, 'down');
      s.walkTo('am1', 19, 21, { run: true }); s.walkTo('am2', 21, 21, { run: true }); s.walkTo('am4', 20, 20, { run: true });
      await s.walkTo('am3', 20, 22, { run: true });
      await s.emote('sj3', '!', 0.8);
      await s.say('soldier', 'The Commandant said you\'d try the road tonight. Take him!', { top: true });
      s.sfx('block'); s.jump('am1', 3); s.jump('am2', 3); await s.shake(3, 0.3);
      s.lie('sj3');
      await s.narrate('Liu Gao\'s men, waiting in ambush on the road, caught him again.');
      await s.fadeOut(0.8);
      ['am1', 'am2', 'am3', 'am4', 'sj3'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.night(false); s.cameraReset(); s.show('player');
      await s.narrate('Liu Gao reported to the prefect of Qingzhou, who sent his military supervisor Huang Xin, the "Suppressor of Three Mountains." Huang Xin invited Hua Rong to a feast "to make peace with Liu Gao."');
      // the feast in Liu Gao's hall: Huang Xin between the two rivals, cups raised
      await s.warp('qingfeng_in', 27, 6, 'left', { noFade: true });
      s.spawn('hx', 'huangxin', 26, 5, 'down'); s.spawn('lg', 'liugao', 25, 6, 'right');
      s.spawn('fs1', 'soldier', 24, 9, 'up'); s.spawn('fs2', 'soldier', 28, 9, 'up'); s.hide('fs1'); s.hide('fs2');
      await s.wait(0.2);
      await s.fadeIn(0.8);
      await s.say('huangxin:smile', 'Major Hua, Commandant Liu — two officers of the same fort, quarrelling like fishwives! Drink with me, both of you, and let it be forgotten.');
      await s.say('huarong', '...If the Commandant will drink to it, so will I.');
      await s.emote('hx', '...', 0.8);
      // he dashes his cup to the floor: the signal
      s.sfx('block'); await s.shake(2, 0.3);
      await s.say('huangxin:angry', 'Now!', { top: true });
      s.show('fs1'); s.show('fs2');
      s.walkTo('fs1', 26, 6, { run: true }); await s.walkTo('fs2', 28, 6, { run: true });
      s.face('player', 'down'); await s.emote('player', '!', 0.8);
      await s.say('huarong:angry', 'Huang Xin! A peace feast, and soldiers behind the screen?!');
      await s.say('huangxin', 'Orders from the prefecture, Major. You harboured the bandit chief. Take him!');
      s.sfx('hit'); s.jump('fs1', 3); s.jump('fs2', 3); await s.shake(3, 0.3);
      s.lie('player');
      await s.narrate('He was seized at the table. Song Jiang and Hua Rong were put in prison carts to be taken to Qingzhou.');
      await s.fadeOut(0.8);
      ['hx', 'lg', 'fs1', 'fs2'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.lie('player', false);
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
      // Song Jiang in the great chair; Qin Ming, bound, brought before him; the chiefs either side
      s.place('player', 8, 4, 'down'); s.actor('player').x += 8;   // (the chair is two tiles wide: he sits in its middle)
      s.spawn('qinming', 'qinming', 8, 6, 'up'); s.actor('qinming').x += 8;
      s.spawn('huarong', 'huarong', 6, 5, 'right'); s.spawn('yanshun', 'yanshun', 11, 5, 'left');
      await s.emote('qinming', 'anger', 0.8);
      await s.say('songjiang', 'Untie him! Commander Qin, forgive us. We are not bandits by choice. Stay with us.');
      await s.say('qinming:angry', 'I am an officer of the Song. I would rather die than join you. Let me go back to Qingzhou.');
      await s.say('songjiang', '...Then rest tonight, and go in the morning. We will return your horse and your weapons.');
      await s.narrate('Song Jiang feasted Qin Ming and kept him drinking late. That night, men of the mountain dressed in his armour and rode on his horse to the villages around Qingzhou, burning and killing, crying "Qin Ming has joined the bandits!"');
      // morning: Qin Ming rides back to Qingzhou, past the burned villages, to find the gate shut against him
      await s.fadeOut(0.8);
      s.hide('qinming'); s.hide('huarong'); s.hide('yanshun');
      var home = s.actor('player'); var homeAt = home.tile();
      s.flag('shut:qingzhou');
      await s.warp('qingzhou', 16, 19, 'right', { noFade: true }); s.hide('player');
      s.spawn('qm9', 'qinming', 3, 19, 'right');
      s.spawn('pf9', 'official', 27, 18, 'left'); s.spawn('wg1', 'soldier', 27, 17, 'left'); s.spawn('wg2', 'soldier', 27, 21, 'left');
      s.tint('dusk'); s.camera(20, 19, 0.1);   // the road up to the west gate
      await s.fadeIn(0.8);
      await s.narrate('In the morning Qin Ming rode home. He found the villages around Qingzhou burned to the ground.');
      await s.walkTo('qm9', 22, 19, { speed: 50 });
      await s.emote('qm9', '?', 0.8);
      await s.say('qinming', 'Open the gate! It is Qin Ming — Commander of Qingzhou! Open up!');
      await s.say('official:angry', 'Traitor! You burned the villages with your bandits last night — the whole countryside saw you! Your family has paid for your treason. Archers!', { top: true });
      s.sfx('arrow'); await s.flash('#ffffff', 0.12); s.sfx('arrow');
      await s.emote('qm9', '!', 0.8);
      await s.move('qm9', 'L3', { run: true });
      s.face('qm9', 'right');
      await s.say('qinming:sad', '...My family. What has happened to my family?');
      await s.narrate('The gate stayed shut. There was nowhere left for him to go but back up the mountain.');
      await s.walkTo('qm9', 3, 19, { speed: 40 });
      await s.fadeOut(0.8);
      ['qm9', 'pf9', 'wg1', 'wg2'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.unflag('shut:qingzhou'); s.tint(null); s.cameraReset();
      await s.warp('qingfengshan_in', 8, 4, 'down', { noFade: true });
      s.actor('player').x += 8;
      s.spawn('huarong', 'huarong', 6, 5, 'right'); s.spawn('yanshun', 'yanshun', 11, 5, 'left');
      await s.wait(0.2);
      await s.fadeIn(0.8);
      // he bursts in at the door and storms up the hall to the chair
      s.sfx('door');
      s.spawn('qinming', 'qinming', 9, 8, 'up');
      s.music('sad');
      await s.walkTo('qinming', 9, 6, { run: true }); s.face('qinming', 'up'); s.actor('qinming').x -= 8;
      s.jump('qinming', 3); await s.emote('qinming', 'anger', 0.8);
      s.face('huarong', 'down'); s.face('yanshun', 'down');
      await s.say('qinming:angry', 'Song Jiang!! You did this! You and your bandits — you burned the villages in my name! My wife — my family — !');
      await s.say('songjiang:sad', 'Commander... it is true. It was my plan. I wanted a man like you among us, and I knew you would never come of your own will. I am responsible for your family\'s death. Kill me if you must.');
      await s.say('songjiang', 'But hear me first. Hua Rong has a sister, wise and virtuous. If you will stay with us, she will be your wife, and we will be your family.');
      await s.narrate('Qin Ming stood a long while in silence. Their kindness, the hopelessness of his position, and the respect they showed him wore down his anger. At last he bowed his head. "You have left me no road back. ...So be it."');
      await s.say('qinming', 'My lieutenant Huang Xin holds Qingfeng Fort. He was my pupil. I will bring him to you.');
      // he goes to fetch his lieutenant, and comes back up the hall with him
      await s.walkTo('qinming', 9, 8); s.hide('qinming');
      await s.fadeOut(0.6); await s.wait(0.4); await s.fadeIn(0.6);
      s.show('qinming'); s.place('qinming', 9, 8, 'up'); s.spawn('hx9', 'huangxin', 8, 8, 'up');
      s.walkTo('qinming', 10, 6); await s.walkTo('hx9', 8, 6); s.face('qinming', 'up'); s.face('hx9', 'up');
      await s.say('huangxin', 'Brother Song. My teacher has told me everything. Qingfeng Fort is yours — the gates are open, and the men will follow me.');
      await s.say('songjiang:smile', 'Commander Huang. Welcome, brother.');
      await s.narrate('So Huang Xin brought Qingfeng Fort over to them, and Qin Ming married Hua Rong\'s sister.');
      // a scout runs in with bad news
      s.sfx('door'); s.spawn('sc9', 'bandit', 9, 8, 'up');
      await s.walkTo('sc9', 9, 7, { run: true }); s.face('sc9', 'up');
      await s.say('bandit', 'Chiefs! Qingzhou is raising a great army — horse and foot — to come and burn us off this mountain!');
      ['huarong', 'yanshun', 'qinming', 'hx9'].forEach(function (k) { s.face(k, 'up'); });
      await s.emote('player', '...', 0.8);
      await s.say('songjiang', 'This mountain is too small to hold against an army. There is only one place for us now. Liangshan Marsh.');
      s.despawn('qinming'); s.despawn('huarong'); s.despawn('yanshun'); s.despawn('hx9'); s.despawn('sc9');
      // on the road south, in a valley below Duiying Mountain: two young men on horseback, one in red, one in white
      await s.fadeOut(0.8);
      await s.warp('roadinn', 4, 8, 'right', { noFade: true });
      s.spawn('hr8', 'huarong', 3, 7, 'right');
      s.spawn('lf8', 'lufang', 14, 8, 'right'); s.spawn('gs8', 'guosheng', 16, 8, 'left');
      await s.fadeIn(0.8);
      for (var r8 = 0; r8 < 3; r8++) { s.sfx('block'); s.jump('lf8', 4); s.jump('gs8', 4); await s.wait(0.35); }
      await s.say('lufang:angry', 'This is my mountain, Guo Sheng! Go back to Sichuan!');
      await s.say('guosheng:angry', 'Then let the halberd decide whose mountain it is! ...Let go of my tassel!');
      await s.narrate('The two halberds\' gold-and-silk tassels had wound together in the fighting, and neither man could pull free.');
      await s.say('huarong', 'Hold still, the pair of you.');
      s.sfx('arrow'); await s.flash('#ffffff', 0.15);
      s.emote('lf8', '!', 1); s.emote('gs8', '!', 1);
      await s.narrate('Hua Rong drew his bow and, with a single arrow, cut the tangled tassels apart.');
      s.face('lf8', 'left'); s.face('gs8', 'left');
      await s.moveTo('lf8', 7, 8); await s.moveTo('gs8', 8, 8);
      await s.say('lufang', 'What archery! ...Song Jiang? Song Jiang of Yuncheng, Timely Rain? I am Lü Fang, the Little Marquis, and this mountain is mine — or it was until this morning.');
      await s.say('guosheng', 'And I am Guo Sheng, who came to take it from him. ...We will both follow you, brother, if you will have us.');
      s.hide('lf8'); s.despawn('lf8'); s.hide('gs8'); s.despawn('gs8');
      // and an inn further on, where a stranger will not give up the best seat
      await s.fadeOut(0.8);
      await s.warp('roadinn_in', 6, 6, 'up', { noFade: true });
      s.spawn('sy', 'shiyong', 4, 4, 'down');
      // the whole band crowding in behind Song Jiang, stamping the snow off their boots
      var band = [['b1', 'huarong', 5, 7], ['b2', 'qinming', 7, 7], ['b3', 'huangxin', 4, 8], ['b4', 'yanshun', 6, 8], ['b5', 'wangying', 8, 8], ['b6', 'zhengtianshou', 5, 9], ['b7', 'lufang', 7, 9], ['b8', 'guosheng', 9, 9]];
      band.forEach(function (b) { s.spawn(b[0], b[1], b[2], b[3], 'up'); });
      await s.fadeIn(0.8);
      await s.say('songjiang', 'Friend, my companions are many. Would you move to another table?');
      await s.say('shiyong:angry', 'Move? For you? There are only two men in the world I would move for: Chai Jin of Cangzhou, and Song Jiang of Yuncheng!');
      await s.say('songjiang', '...I am Song Jiang of Yuncheng.');
      await s.say('shiyong:shock', 'You — ! I\'ve been searching the roads for you! I\'m Shi Yong, the Stone General. I have a letter for you from your brother, Song Qing.');
      await s.say('songjiang:shock', '(reading) "...Father died in the first month of this year... we await your return to bury him..." Father! Father!');
      s.lie('player');
      s.emote('b1', '...', 1.2); s.emote('b2', '...', 1.2); s.emote('b4', 'sweat', 1.2);
      await s.narrate('Song Jiang fell down weeping and beating his breast.');
      // the brothers gather round him
      await s.walkTo('b1', 5, 6); s.face('b1', 'right');
      await s.say('huarong:sad', 'Brother, Chao Gai is waiting for us at Liangshan. Come with us — your father would want you safe.');
      s.lie('player', false); s.face('player', 'left');
      await s.say('songjiang:sad', 'A son who does not bury his father is no son at all. I must go home. You go on to Liangshan without me.');
      await s.narrate('He would not go on to Liangshan. He sat down at a table and wrote a letter to Chao Gai for the others to carry.');
      await s.walkTo('player', 6, 5); s.face('player', 'up'); await s.wait(0.8);   // writing at the table
      s.face('player', 'left'); s.sfx('item'); await s.emote('b1', '!', 0.6);   // the letter into Hua Rong's hands
      await s.say('songjiang', 'Give this to Chao Gai. Tell him I will come when I can.');
      // that night he leaves alone; the brothers watch him go from the door
      await s.fadeOut(0.8);
      s.night(true);
      s.place('player', 8, 9, 'down'); s.place('b5', 9, 7, 'down');
      band.forEach(function (b) { s.face(b[0], 'down'); });
      await s.fadeIn(0.8);
      await s.narrate('And he set out for home alone, by night.');
      await s.walkTo('player', 8, 10); s.hide('player');
      await s.wait(0.6);
      await s.fadeOut(0.8);
      s.night(false); s.show('player');
      s.hide('sy'); s.despawn('sy');
      band.forEach(function (b) { s.hide(b[0]); s.despawn(b[0]); });
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
      // that night torches come up the road and round the farm
      await s.fadeOut(0.8);
      s.night(true);
      s.place('player', 15, 15, 'down'); s.place('father', 14, 14, 'down'); s.place('qing', 16, 14, 'down');
      ['c1', 'c2', 'c3', 'c4'].forEach(function (k, i) { s.spawn(k, 'constable', [13, 17, 12, 18][i], 23, 'up'); });
      await s.fadeIn(0.8);
      s.walkTo('c1', 14, 17, { run: true }); s.walkTo('c2', 16, 17, { run: true }); s.walkTo('c3', 12, 16, { run: true });
      await s.walkTo('c4', 18, 16, { run: true });
      await s.emote('father', '!', 0.8);
      await s.say('constable', 'Song Jiang! The farm is surrounded. Come out quietly, and no one else need be hurt.', { top: true });
      await s.say('songjiang', 'Father, stay inside. ...I am coming.');
      await s.walkTo('player', 15, 16); s.face('player', 'down');
      await s.walkTo('c1', 15, 17); s.face('c1', 'up');
      s.sfx('block'); s.jump('c1', 2); await s.wait(0.3);   // the cangue and the ropes
      await s.narrate('So Song Jiang gave himself up. Because of the amnesty, he was sentenced only to twenty strokes and exile to Jiangzhou, on the Yangtze, far in the south.');
      s.walkTo('c1', 15, 22, { speed: 34 }); s.walkTo('c2', 16, 21, { speed: 34 }); s.walkTo('c3', 14, 20, { speed: 34 });   // led away between them
      await s.walkTo('player', 15, 21, { speed: 34 }); s.face('father', 'down'); s.face('qing', 'down');
      await s.fadeOut(0.8);
      ['c1', 'c2', 'c3', 'c4'].forEach(function (k) { s.hide(k); s.despawn(k); });
      s.night(false);
      s.despawn('father'); s.despawn('qing');
      s.flag('ch8_done');
      await s.endChapter();
      if (WM.data.chapters[9].begin) await WM.data.chapters[9].begin(s);
    } }
  ]);
})();
