// Chapter 9 — "Xunyang Tower" (novel chapters 36–41).
// Song Jiang's road to exile: Liangshan's offer refused; Jieling Ridge; Jieyang and the river; Jiangzhou, Dai Zong,
// Li Kui and Zhang Shun; the rebel poem; the forged letter; the execution ground; the White Dragon Temple;
// Wuweijun; and the return of all to Liangshan.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('escortzhang', 'Escort Zhang Qian', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#3a3a2a', trim: '#8a3a2a', weapon: 'pole' }, { face: true });
  WM.npc('mutaigong', 'Mu Taigong', { skin: '#e0a880', hair: '#d0d0c8', hairStyle: 'scarf', band: '#2a2a2a', beard: 'long', beardColor: '#e0e0d8', body: '#5a4a3a', trim: '#c8b890' }, { face: true });
  WM.npc('caijiu', 'Prefect Cai Jiu', { skin: '#f0c49a', hairStyle: 'futou', beard: 'short', body: '#7a1a1a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('huangwenbing', 'Huang Wenbing', { skin: '#f0c49a', hairStyle: 'scarf', band: '#1a1a2a', beard: 'mustache', body: '#3a4a3a', trim: '#c8b890', face: 'long', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('executioner', 'Executioner', { skin: '#c8905e', hairStyle: 'scarf', band: '#8a1a1a', body: '#8a1a1a', trim: '#2a1a1a', weapon: 'dao', build: 'big' }, { face: true });

  WM.enemy('jy_tough', 'Jieyang Tough', 19, WM.hum(WM.enemyLooks.thug), { exp: 95, fx: 'blunt', drops: [['beef', 0.2]] });
  WM.enemy('jz_guard', 'Jiangzhou Guard', 22, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 100, drops: [['medicine', 0.12]] });
  WM.enemy('jz_archer', 'Jiangzhou Archer', 22, WM.hum(WM.enemyLooks.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 100 });
  WM.enemy('jz_officer', 'Execution Officer', 24, WM.hum(WM.enemyLooks.officer), { hp: 2.4, atk: 1.1, exp: 300, gold: 200, boss: true, drops: [['ginseng', 1]] });
  WM.enemy('huang_guard', 'Huang\'s Retainer', 22, WM.hum(WM.enemyLooks.constable), { exp: 95 });
  WM.enemy('huang_boss', 'Huang Wenbing', 22, WM.hum(WM.data.npcs.huangwenbing.look), { hp: 2.0, exp: 380, gold: 500, boss: true, drops: [['goodwine', 1]] });
  var T = WM.data.troops;
  T.ch9_jieyang = { enemies: ['jy_tough', 'jy_tough', 'jy_tough'], bg: 'town', noRun: true };
  T.ch9_exec1 = { enemies: ['jz_guard', 'jz_guard', 'jz_archer', 'jz_guard'], bg: 'town', noRun: true };
  T.ch9_exec2 = { enemies: ['jz_guard', 'jz_officer', 'jz_archer'], bg: 'town', boss: true };
  T.ch9_wuwei = { enemies: ['huang_guard', 'huang_boss', 'huang_guard'], bg: 'night', boss: true };

  WM.data.duels.likui_zhangshun_land = {
    hero: 'likui', foe: 'zhangshun', bg: 'river', heroHp: 420, heroAtk: 46, foeHp: 300, foeAtk: 32,
    intro: [['foe:angry', 'You black devil! Those were my fish!'], ['hero:angry', 'Your fish? I\'ll make fish soup out of you!']],
    lines: { attack: ['Take that!', 'Hyah!', 'Fish-thief!'], wild: ['I\'ll knock your teeth out!', 'All or nothing!', 'Here I come!'], defend: ['He\'s strong on land...', 'Careful...', 'Hm.'] },
    win: [['foe:angry', '...Just you wait. Just you wait!']], lose: [['foe:smile', 'Ha!']]
  };
  WM.data.duels.likui_zhangshun_water = {
    hero: 'likui', foe: 'zhangshun', bg: 'river', heroHp: 320, heroAtk: 20, foeHp: 600, foeAtk: 48,
    intro: [['foe:smile', 'Come aboard, black devil! Let\'s settle it out here!'], ['hero:shock', 'Wh-what are you doing?! Stop rocking the boat!']],
    lines: { attack: ['Down you go!', 'Drink up!', 'Under!'], wild: ['Seven days under the water — how about you?', 'Deep breath!', 'Splash!'], defend: ['Can you swim? No?', 'Ha ha!', 'Come on then!'] },
    win: [['foe:shock', 'Lucky!']], lose: [['hero:sad', 'Glub... glub...']]
  };
  WM.data.wars.ch9_river = {
    name: 'The Banks of the Xunyang', goal: 'rout', turns: 12, music: 'war',
    map: [
      '~~~~~.......TT',
      '~rr~~.........',
      '~~~~..........',
      '~~r~..:::.....',
      '~~~~~.........',
      '~r~~..........',
      '~~~~~.....TT..'
    ],
    player: [
      { leader: 'chaogai', support: ['liutang'], type: 'inf', x: 6, y: 3, commander: true },
      { leader: 'likui', type: 'inf', x: 7, y: 2 },
      { leader: 'huarong', support: ['lufang'], type: 'arch', x: 5, y: 1 },
      { leader: 'zhangshun', support: ['zhangheng'], type: 'naval', x: 2, y: 2 },
      { leader: 'lijun', support: ['tongwei', 'tongmeng'], type: 'naval', x: 2, y: 4 },
      { leader: 'muhong', support: ['muchun'], type: 'cav', x: 6, y: 5 }
    ],
    enemy: [
      { name: 'Jiangzhou Cavalry', type: 'cav', atk: 92, def: 78, x: 12, y: 2 },
      { name: 'Jiangzhou Cavalry', type: 'cav', atk: 92, def: 78, x: 12, y: 4 },
      { name: 'Jiangzhou Archers', type: 'arch', atk: 84, def: 60, x: 13, y: 3 },
      { name: 'Jiangzhou Foot', type: 'inf', atk: 80, def: 84, x: 11, y: 3 },
      { name: 'Jiangzhou Foot', type: 'inf', atk: 80, def: 84, x: 13, y: 6 }
    ],
    intro: [['chaogai', 'Five or seven thousand men are coming out of Jiangzhou after us. The boats are in the reeds behind.'], ['likui', 'Let them come! I\'ll chop them all!'], [null, 'Victory: rout all enemy units. Navy can fight from the river.']],
    win: [['lijun', 'They\'re broken! To the boats — and then to Wuweijun!']], lose: [['chaogai:sad', 'To the boats! Retreat!']]
  };

  WM.data.chapters[9].begin = async function (s) {
    await s.chapter(9);
    s.party(['songjiang']); s.level('songjiang', 20); s.setLeader('songjiang');
    s.flag('protagonist', 'songjiang');
    WM.state.chars.songjiang.equip.acc = 'cangue'; S.restore('songjiang');
    WM.unlock('jieling', 'jieyang', 'jiangzhou');
    await s.narrate('Song Jiang was sent south to Jiangzhou with two escorts, Zhang Qian and Li Wan. The road ran past the shore of Liangshan Marsh.');
    // the road past Zhu Gui's tavern, the cangue on his neck, the escorts at his heels
    await s.warp('zhugui', 9, 21, 'up', { noFade: true });
    s.spawn('ez', 'escortzhang', 8, 21, 'up'); s.spawn('el', 'constable', 10, 21, 'up');
    await s.fadeIn(0.6);
    s.move('ez', 'U3', { speed: 40, wait: false }); s.move('el', 'U3', { speed: 40, wait: false });
    await s.move('player', 'U3', { speed: 40 });
    // Liu Tang and his men come out of the tavern and the reeds
    s.spawn('lt9', 'liutang', 9, 15, 'down'); s.spawn('m91', 'outlaw', 5, 17, 'right'); s.spawn('m92', 'outlaw', 13, 17, 'left');
    s.walkTo('m91', 7, 18, { run: true }); s.walkTo('m92', 11, 18, { run: true });
    await s.walkTo('lt9', 9, 17, { run: true });
    await s.say('liutang', 'Halt! You two — leave the prisoner and go, or you go into the marsh!', { top: true });
    s.emote('ez', 'sweat', 1); await s.emote('el', 'sweat', 1);
    await s.say('escortzhang:shock', 'B-bandits! Mercy, sirs — we\'re only escorts, we\'re only doing our duty!', { top: true });
    await s.say('songjiang', 'Brother Liu Tang! Don\'t harm them. They have treated me well.', { top: true });
    await s.say('liutang:smile', 'As you say, brother. Then they can come too. The chiefs are waiting for you across the water.', { top: true });
    // down to the pier, and out across the marsh in the sampan
    s.walkTo('lt9', 13, 8); s.walkTo('ez', 12, 9); s.walkTo('el', 14, 9);
    await s.walkTo('player', 13, 9);
    await s.walkTo('player', 13, 4);
    s.sfx('splash');
    await s.narrate('Liu Tang brought Song Jiang across the water to Chao Gai.');
    await s.fadeOut(0.8);
    ['lt9', 'm91', 'm92', 'ez', 'el'].forEach(function (k) { s.hide(k); s.despawn(k); });
    await s.warp('liangshan', 24, 41, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[9].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 8; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong'].forEach(function (id) { S.recruit(id, 20); });
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'qingfeng', 'qingfengshan');
    await WM.data.chapters[9].begin(s);
  };

  // ---------------- the offer at Liangshan ----------------
  WM.defEvents('liangshan', [
    // on the beach below the fortress, where the sampan comes in
    { id: 'ch9_offer', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 9 && !S.has('ch9_road'); }, run: async function (s) {
      s.spawn('chaogai', 'chaogai', 24, 38, 'down'); s.spawn('wuyong', 'wuyong', 25, 38, 'down'); s.spawn('esc', 'escortzhang', 23, 41, 'up'); s.spawn('esc2', 'constable', 25, 41, 'up');
      await s.walkTo('chaogai', 24, 40, { run: true }); s.face('player', 'up');
      await s.say('chaogai', 'Brother Song! Stay with us. Why go to Jiangzhou to be a convict? Take off that cangue, and take the first seat on Liangshan.');
      await s.say('songjiang:sad', 'Brother, my father ordered me home and told me to serve my sentence and live as an honest man. If I stay, I disobey my father and break the law — I would be unfilial and disloyal both. If you force me, I will cut my throat here before you.');
      await s.say('chaogai:sad', '...Then go. But we will not forget you.');
      await s.say('wuyong', 'At least take this. The superintendent of the Jiangzhou prison is an old friend of mine: Dai Zong, called the Magic Traveller. I have written to him. He will look after you.');
      s.despawn('chaogai'); s.despawn('wuyong'); s.despawn('esc'); s.despawn('esc2');
      await s.narrate('So Song Jiang went on south with his escorts. After a long journey they crossed into Jiangzhou country, and climbed a steep ridge called Jieling. At the top was an inn.');
      s.flag('ch9_road');
      await s.warp('jieling', 1, 9, 'right');
    } }
  ]);

  // ---------------- Jieling Ridge ----------------
  WM.defEvents('jieling_in', [
    { id: 'ch9_lili', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_road'); }, run: async function (s) {
      s.spawn('lili', 'lili', 5, 5, 'down'); s.spawn('esc', 'escortzhang', 4, 5, 'right'); s.spawn('esc2', 'constable', 7, 6, 'left');   // Zhang Qian and Li Wan
      await s.say('lili', 'Wine? Meat? Sit, sit, travellers. You look tired.');
      await s.narrate('The wine tasted strange. Before Song Jiang could set down the bowl, the room spun. He and both escorts slid to the floor.');
      s.lie('player'); s.lie('esc'); s.lie('esc2');
      await s.say('lili:smile', 'Three fat ones. And this one has silver in his bundle... "Song Jiang"? What\'s a letter to "Song Jiang" doing here?');
      s.spawn('lijun', 'lijun', 7, 6, 'up'); s.spawn('tongwei', 'tongwei', 8, 6, 'up'); s.spawn('tongmeng', 'tongmeng', 5, 6, 'up');
      await s.say('lijun', 'Brother Li! I\'ve been waiting on the ridge for days for Song Jiang of Yuncheng, who\'s being sent to Jiangzhou. Has a convict passed?');
      await s.say('lili:shock', '...Song Jiang? He\'s lying on my butchering floor!');
      await s.narrate('They poured the antidote into Song Jiang\'s mouth and propped him up. When he came round, four men were kneeling before him.');
      s.lie('player', false); s.lie('esc', false); s.lie('esc2', false);
      await s.say('lijun', 'I am Li Jun, a boatman of the Xunyang, called the River Dragon. These are the Tong brothers, Tong Wei and Tong Meng, and this is Li Li, who keeps the inn. Forgive him — he nearly made dumplings of the most righteous man in the world.');
      await s.say('songjiang', 'No harm done. ...Though I\'d rather not eat here again.');
      s.despawn('lili'); s.despawn('esc'); s.despawn('esc2'); s.despawn('lijun'); s.despawn('tongwei'); s.despawn('tongmeng');
      s.flag('ch9_jieyang');
      await s.narrate('Li Jun walked with them down the ridge, and they parted with promises. Song Jiang went on to Jieyang town, on the bank of the great river.');
      await s.warp('jieyang', 1, 8, 'right');
    } }
  ]);

  // ---------------- Jieyang ----------------
  WM.defEvents('jieyang', [
    { id: 'ch9_xueyong', x: 14, y: 9, w: 14, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_jieyang'); }, idle: { c3: 'Shh — he\'s about to start. They say this fellow can do things with a spear you won\'t believe.' }, run: async function (s) {
      s.spawn('xueyong', 'xueyong', 20, 12, 'down'); s.spawn('c1', 'villager', 18, 13, 'up'); s.spawn('c2', 'woman', 22, 13, 'up'); s.spawn('c3', 'farmer', 20, 14, 'up');
      // more of the town gathered round the ring
      [['c4', 'villager2', 17, 12, 'right'], ['c5', 'oldwoman', 23, 12, 'left'], ['c6', 'merchant', 17, 13, 'right'], ['c7', 'woman2', 21, 14, 'up'], ['c8', 'villager', 23, 13, 'left'], ['c9', 'oldman', 18, 11, 'down'], ['c10', 'farmer', 22, 11, 'down']].forEach(function (c) { s.spawn(c[0], c[1], c[2], c[3], c[4]); });
      // Song Jiang joins the ring of onlookers on the square
      await s.walkTo('player', 19, 14); s.face('player', 'up');
      await s.narrate('In the square a crowd had gathered round a street performer, a man with a staff, showing his skill with weapons.');
      // the performance: spinning, leaping, the staff whirling
      for (var r = 0; r < 4; r++) { s.face('xueyong', ['left', 'up', 'right', 'down'][r]); s.jump('xueyong', 4); s.sfx('block'); await s.wait(0.35); }
      await s.move('xueyong', 'L1', { run: true }); s.jump('xueyong', 5); s.sfx('crit'); await s.wait(0.3);
      await s.move('xueyong', 'R2', { run: true }); s.jump('xueyong', 5); s.sfx('crit'); await s.wait(0.3);
      await s.move('xueyong', 'L1', { run: true }); s.face('xueyong', 'down');
      s.emote('c1', '!', 0.8); s.emote('c3', '!', 0.8); s.emote('c5', '!', 0.8); s.emote('c9', 'heart', 0.8); await s.emote('player', '!', 0.8);
      await s.say('xueyong', '...and now, good people, if you\'ve enjoyed the show, a few coppers for a poor performer and his medicine!');
      // he goes round with his plate; the onlookers look away
      await s.walkTo('xueyong', 18, 12); s.face('xueyong', 'down'); s.face('c1', 'left'); await s.emote('c1', 'sweat', 0.6);
      await s.walkTo('xueyong', 22, 12); s.face('xueyong', 'down'); s.face('c2', 'right'); await s.emote('c2', 'sweat', 0.6);
      await s.walkTo('xueyong', 19, 13); s.face('xueyong', 'down');
      await s.narrate('No one in the crowd gave him anything. Song Jiang took out five taels of silver and gave it to him.');
      s.sfx('item');
      await s.say('xueyong:shock', 'Five taels! Sir, I am Xue Yong of Henan, called the Sick Tiger. Who are you, who gives so freely?');
      // the young master of the Mu family pushes through the crowd to Song Jiang
      s.spawn('muchun', 'muchun', 26, 14, 'left'); s.face('c3', 'right');
      s.move('c3', 'D1', { wait: false });
      await s.walkTo('muchun', 20, 14, { run: true }); s.face('muchun', 'left'); s.face('player', 'right');
      await s.emote('muchun', 'anger', 0.8);
      await s.say('muchun:angry', 'Who are you, convict, to throw silver around in Jieyang? This street-performer didn\'t pay his respects to the Mu family. Nobody was to give him a copper!');
      await s.say('songjiang', 'My silver is my own, sir.');
      await s.say('muchun:angry', 'Then let\'s see if your fists are your own too!');
      await s.battle('ch9_jieyang', { bg: 'town', canLose: true, rounds: 3 });
      // Xue Yong throws him down; he picks himself up and runs off, cursing
      s.sfx('hit'); s.jump('xueyong', 4); await s.shake(3, 0.3);
      s.lie('muchun');
      await s.narrate('Xue Yong knocked Mu Chun into the dust.');
      s.lie('muchun', false); await s.emote('muchun', 'anger', 0.6);
      await s.say('muchun:angry', 'You\'ll pay for this, both of you! Nobody in Jieyang will give you so much as a cup of water!');
      await s.walkTo('muchun', 30, 9, { run: true }); await s.walkTo('muchun', 43, 9, { run: true }); s.hide('muchun');
      s.despawn('xueyong', { leave: true }); s.despawn('c1', { leave: true }); s.despawn('c2', { leave: true }); s.despawn('c3', { leave: true }); ['c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'].forEach(function (k) { s.despawn(k, { leave: true }); }); s.despawn('muchun');
      // with his escorts, Song Jiang tries the inn before dark
      s.tint('dusk');
      s.spawn('ez9', 'escortzhang', 18, 15, 'up'); s.spawn('el9', 'constable', 20, 15, 'up');
      await s.walkTo('player', 7, 7);
      s.walkTo('ez9', 6, 8); await s.walkTo('el9', 8, 8);
      s.face('player', 'up');
      s.spawn('ik9', 'innkeep', 7, 6, 'down'); s.sfx('door');
      await s.say('innkeep:sad', 'No, no — no room. ...The Mu family sent word round: anyone who takes in the convict with the silver answers to them. Go on, please. Go.');
      s.sfx('door'); s.hide('ik9'); s.despawn('ik9');
      await s.emote('player', '...', 0.8);
      await s.narrate('Song Jiang and the escorts hurried out of town before dark — but no inn would take them: the Mu brothers had sent word.');
      // after dark, the gate of a big manor, and a kind old man
      await s.fadeOut(0.8);
      s.tint(null); s.night(true);
      s.place('player', 36, 10, 'up'); s.place('ez9', 35, 10, 'up'); s.place('el9', 37, 10, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('player', 36, 9);
      s.spawn('om9', 'oldman', 36, 7, 'down'); s.sfx('door');
      await s.move('om9', 'D1');
      await s.say('songjiang', 'Venerable sir, we are travellers caught by the dark, with nowhere to sleep. Could you spare us a corner for the night?');
      await s.say('oldman', 'A convict and two escorts, out on the road at this hour? Poor fellows. Come in, come in — there\'s a room by the gate, and rice in the pot.');
      await s.narrate('At last, in the dark, they found a big manor and begged a night\'s lodging from a kind old man.');
      await s.move('om9', 'U1'); s.hide('om9');
      s.walkTo('ez9', 36, 8); s.walkTo('el9', 36, 8); await s.walkTo('player', 36, 7);
      ['om9', 'ez9', 'el9'].forEach(function (k) { s.hide(k); s.despawn(k); });
      await s.narrate('In the night they heard the old man\'s sons come home: "Mu Chun was beaten in the market by a convict with silver! We\'ve shut every door in town against him!" They were lodging in the house of the Mu brothers. They crept out the back gate in the dark and ran for the river.');
      s.flag('ch9_river');
      await s.warp('jieyang', 20, 20, 'down');
    } },
    { id: 'ch9_boat', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_river'); }, run: async function (s) {
      s.spawn('zhangheng', 'zhangheng', 20, 21, 'up');
      await s.say('zhangheng', 'Need a boat? Hop in, quick — I see torches behind you!');
      await s.narrate('They jumped into the little boat and the ferryman pushed off into the dark river. The torches of the Mu brothers stopped at the bank. Out in the middle of the current, the ferryman shipped his oar, and drew a broad knife from under the boards.');
      await s.say('zhangheng:smile', 'Now, sirs. Which will it be — "dumplings" or "knife-noodles"?');
      await s.say('songjiang:shock', 'What... what do you mean?');
      await s.say('zhangheng:smile', '"Dumplings": you strip and jump in, and drown nice and quiet. "Knife-noodles": I cut you into the river myself. Choose.');
      await s.narrate('Just then a fast boat came flying downstream, with three men at the oars. "Who\'s working the river tonight?" "Zhang Heng, brother!" — "Who\'ve you got?" — "Three fat sheep, a convict and two escorts." — "A convict? Is it Song Jiang of Yuncheng?"');
      s.spawn('lijun', 'lijun', 22, 21, 'left');
      await s.say('lijun', 'It is! Zhang Heng, you fool, put down that knife! This is Song Gongming!');
      await s.say('zhangheng:shock', '...Timely Rain? Brother, forgive me! I nearly made knife-noodles of you!');
      s.night(false);
      await s.narrate('On the bank, Li Jun brought the Mu brothers, Mu Hong and Mu Chun, and Xue Yong, and they all bowed and begged Song Jiang\'s forgiveness. Zhang Heng gave Song Jiang a letter. "My younger brother, Zhang Shun, is a fish-broker in Jiangzhou. Give him this."');
      s.despawn('zhangheng'); s.despawn('lijun');
      s.flag('ch9_jiangzhou');
      await s.warp('jiangzhou', 27, 3, 'down');
    } }
  ]);

  // ---------------- Jiangzhou ----------------
  WM.defEvents('jiangzhou', [
    { id: 'ch9_prison', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_jiangzhou'); }, run: async function (s) {
      await s.narrate('At the Jiangzhou prison camp, Song Jiang gave silver to everyone — the warden, the guards, the clerks — and was made a clerk in the camp office, without a single stroke of the "welcoming" stick. Only one man he did not pay: the superintendent of the prison, Dai Zong.');
      s.spawn('daizong', 'daizong', 27, 5, 'down');
      s.face('daizong', 'up'); s.face('player', 'down');   // the two face each other (he comes up from below)
      await s.say('daizong:angry', 'Which convict here is Song? You\'ve paid everybody in the camp but me. Do you think I can\'t have you beaten to death for it?');
      await s.say('songjiang', 'For not paying you? Is that a crime? ...But tell me, what would be the crime of a man who was a friend of Wu Yong, of Liangshan Marsh?');
      await s.say('daizong:shock', '...!! Quiet! Who are you?');
      await s.say('songjiang', 'Song Jiang of Yuncheng. Here — a letter from the Professor.');
      await s.say('daizong:shock', 'Song Jiang! Timely Rain! Brother, why didn\'t you say so?! Come, come — let\'s drink.');
      s.despawn('daizong');
      WM.state.chars.songjiang.equip.acc = null; S.restore('songjiang');
      s.addParty('daizong'); s.level('daizong', 20);
      s.flag('ch9_likui');
      await s.narrate('They had barely sat down in a tavern by the river when a huge black man came storming up the stairs, shouting for Dai Zong. Dai Zong sighed. "That is Li Kui, a jailer of mine. They call him the Black Whirlwind. He\'s mad as a buffalo — but loyal."');
      s.spawn('likui', 'likui', 30, 5, 'left');
      await s.say('likui', 'Brother Dai! Lend me ten taels, I\'ll win it all back tonight! ...Who\'s this dark little fellow?');
      await s.say('daizong', 'Mind your manners! This is Song Jiang of Yuncheng.');
      await s.say('likui:shock', '...Song Jiang? THE Song Jiang? Timely Rain? Not some cheat?');
      await s.say('songjiang:smile', 'The very same.');
      await s.narrate('Li Kui threw himself down and kowtowed so hard the floor shook. Song Jiang gave him ten taels. Li Kui lost it all at the gambling den in an hour, robbed the den to get it back, and Song Jiang had to pay the gamblers. Li Kui was his devoted slave from that day on.');
      await s.narrate('Then Song Jiang wanted fresh fish soup, and Li Kui ran down to the river to get some.');
      s.despawn('likui', { leave: true });
      // the riverbank below the city gate: fishing boats at the water's edge
      await s.fadeOut(0.6);
      await s.warp('jiangzhou', 24, 35, 'right', { noFade: true });   // Song Jiang and Dai Zong watching from the sand
      s.spawn('dz9', 'daizong', 23, 35, 'right');
      s.spawn('fb1', 'villager', 30, 36, 'left'); s.boat('fb1'); s.spawn('fb2', 'farmer', 34, 36, 'left'); s.boat('fb2');
      s.spawn('likui', 'likui', 27, 31, 'down');
      await s.fadeIn(0.6);
      await s.walkTo('likui', 27, 33, { run: true }); await s.walkTo('likui', 29, 35, { run: true }); s.face('likui', 'right');
      await s.say('likui', 'You! Fish! Hand it over — the best you\'ve got!');
      await s.say('villager', 'We can\'t sell a single fish till the broker comes, sir — those are his rules!', { top: true });
      // he grabs it out of their boats anyway
      s.sfx('splash'); s.jump('likui', 4); await s.wait(0.4); s.sfx('item');
      await s.emote('fb1', '!', 0.6);
      await s.move('likui', 'R4', { run: true }); s.face('likui', 'right'); s.sfx('splash'); s.jump('likui', 4); await s.wait(0.3);
      await s.emote('fb2', 'anger', 0.6);
      await s.narrate('— by grabbing it from the fishermen\'s boats. The fishermen ran for their master, the fish-broker of the river.');
      s.move('fb1', 'L6', { run: true, wait: false }); await s.move('fb2', 'R6', { run: true });
      s.hide('fb1'); s.hide('fb2');
      // and here he comes, along the sand
      s.spawn('zhangshun', 'zhangshun', 42, 35, 'left');
      await s.walkTo('zhangshun', 34, 35, { run: true }); s.face('likui', 'right');
      await s.say('zhangshun:angry', 'So you\'re the black ox who\'s been robbing my fishermen! Put that fish down.');
      await s.say('likui:angry', 'I want fish for my brother\'s soup, and I\'ll have it — fish-broker or no fish-broker!');
      await s.duel('likui_zhangshun_land', { hero: 'likui', canLose: true });
      await s.narrate('On land Li Kui pinned the fish-broker under his fists. But the white-skinned man broke away, jumped onto a boat, and taunted him until Li Kui, furious, leapt in after him. In the middle of the river the man tipped the boat over.');
      await s.duel('likui_zhangshun_water', { hero: 'likui', canLose: true });
      await s.narrate('Zhang Shun dragged Li Kui under the water again and again, until his eyes were white, then held him up for air, then dunked him again, while the whole riverbank roared with laughter.');
      await s.say('daizong', 'Zhang Shun! Stop! That\'s Li Kui — and this is Song Jiang!');
      await s.say('zhangshun:shock', '...Song Jiang? My brother Zhang Heng wrote to me about you!');
      await s.narrate('So Zhang Shun the White Streak in the Waves, and Li Kui the Black Whirlwind, became friends, though Li Kui would never again go near water if he could help it.');
      s.despawn('likui', { leave: true }); s.despawn('zhangshun', { leave: true }); s.despawn('dz9'); s.despawn('fb1'); s.despawn('fb2');
      s.flag('ch9_poem');
      s.removeParty('daizong');
      await s.narrate('Some days later, Song Jiang went alone to the famous Xunyang Tower overlooking the river.');
      await s.say(null, '(The Xunyang Tower is in the north-east of the city.)');
    } }
  ]);
  WM.defEvents('jiangzhou_in', [
    { id: 'ch9_tower', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_poem') && WM.state.x >= 43 && WM.state.x <= 56; }, run: async function (s) {
      s.night(false);
      // the tower over the river: Song Jiang alone with his wine, and the white wall
      // up the stairs and through the room to a seat by the window
      await s.walkTo('player', 50, 5); s.face('player', 'up');
      await s.narrate('Song Jiang sat by the window drinking alone, looking out over the great river. He thought of his age — past thirty, with no name and no achievement, a branded convict far from home, his father old and alone. He grew drunk, and sad, and angry.');
      await s.say('songjiang', 'Waiter! A brush. And ink. Plenty of ink.');
      s.spawn('wt9', 'waiter', 48, 8, 'up');
      await s.walkTo('wt9', 49, 5);
      s.face('wt9', 'right'); s.face('player', 'left'); s.emote('wt9', '...', 1);
      s.despawn('wt9', { to: [48, 8] });
      s.face('player', 'up');
      await s.move('player', 'U2', { speed: 34 });   // unsteady, up to the white wall
      s.face('player', 'up');
      await s.say('songjiang:angry', '(writing on the wall) "In youth I studied the classics and histories; grown, I learned strategy too. Like a tiger lying in a wild hill, I hide my claws and bear it. Ill fate has branded both my cheeks, and sent me to Jiangzhou. If one day I can avenge my wrongs, I will stain the mouth of the Xunyang with blood."');
      await s.say('songjiang:angry', '(and beneath it) "My heart is in Shandong, my body in Wu; I drift on the rivers and lakes, and sigh in vain. If one day I achieve my soaring ambition, I will laugh at Huang Chao for being less than a man." ...Written by Song Jiang of Yuncheng. Ha!');
      // he pays at the counter and staggers out down the stairs
      await s.walkTo('player', 48, 7, { speed: 34 }); s.face('player', 'left');
      s.sfx('item'); await s.wait(0.4);
      await s.narrate('Then he paid, staggered home, and forgot all about it.');
      await s.walkTo('player', 50, 9, { speed: 30 }); s.emote('player', '...', 0.6); await s.move('player', 'D1', { speed: 30 });
      s.hide('player');
      await s.fadeOut(0.8);
      s.flag('ch9_written');
      s.spawn('huang', 'huangwenbing', 50, 5, 'up');
      await s.fadeIn(0.8);
      await s.narrate('The next day, a retired official named Huang Wenbing, of Wuweijun across the river, a jealous, scheming man always looking for a way back into office, climbed the tower to pass the time, and read the walls.');
      await s.say('huangwenbing:smile', '"...I will laugh at Huang Chao for being less than a man"? Huang Chao, the rebel who sacked the capital! This is a rebel\'s poem! "Song Jiang of Yuncheng"... And the children in the streets have been singing a rhyme: "The one who ruins the state is house-and-wood; the one who leads the troops is water-and-work; across thirty-six, rebellion in Shandong." House over wood is Song. Water beside work is Jiang. Song Jiang!');
      s.despawn('huang');
      // the prefect's hall: Cai Jiu on the dais, Huang Wenbing at his side, and Song Jiang dragged in
      await s.fadeOut(0.8);
      await s.warp('jiangzhou_in', 14, 9, 'up', { noFade: true });
      s.hide('player');
      s.spawn('cj9', 'caijiu', 7, 4, 'down'); s.spawn('hw9', 'huangwenbing', 10, 5, 'left');
      var g9 = WM.data.troop(s, 'jg', 'soldier', [[2, 6], [12, 6], [3, 8], [12, 8]], 'down');
      s.spawn('sj9', 'songjiang', 7, 9, 'up'); s.spawn('dg', 'soldier', 6, 9, 'up'); s.spawn('dg2', 'soldier', 8, 9, 'up');
      await s.fadeIn(0.8);
      await s.narrate('Huang Wenbing copied the poem and took it at once to the prefect, Cai Jiu — the ninth son of the Prime Minister Cai Jing. The prefect sent his guards for Song Jiang that very hour. Dai Zong had run ahead to warn him: "Brother, pretend to be mad!"');
      s.move('dg', 'U1', { wait: false }); s.move('dg2', 'U1', { wait: false }); await s.move('sj9', 'U1');
      // he raves on his feet, waving his arms, laughing at them all
      s.jump('sj9', 4); await s.wait(0.25); s.jump('sj9', 4); s.emote('sj9', 'anger', 1);
      await s.say('songjiang:angry', 'Ha! Who dares lay hands on me? I am the son-in-law of the Jade Emperor! My father-in-law has lent me a hundred thousand heavenly soldiers to kill every one of you in Jiangzhou! The King of Hell himself is my vanguard!');
      await s.say('caijiu', '...He is mad. Huang Wenbing, you have brought me a madman.');
      await s.say('huangwenbing:smile', 'Your Honour, ask the clerks of the prison camp whether he was mad when he came. A madman does not write in that hand.');
      await s.say('caijiu:angry', '...He was not. Then he is a rebel feigning madness. Beat him until he tells the truth!');
      for (var b9 = 0; b9 < 3; b9++) { s.sfx('hit'); s.jump('sj9', 2); await s.shake(3, 0.25); await s.wait(0.2); }
      await s.narrate('Song Jiang was beaten until his skin split and his blood ran, and he confessed: he had written it drunk, and meant nothing by it. They locked him in a cangue in the condemned cell.');
      await s.fadeOut(0.8);
      WM.data.clear(s, g9.concat(['cj9', 'hw9', 'sj9', 'dg', 'dg2']));
      s.show('player');
      await s.fadeIn(0.8);
      s.flag('ch9_condemned');
      s.party(['daizong']); s.level('daizong', 21); s.setLeader('daizong');
      s.flag('protagonist', 'daizong');
      WM.state.chars.daizong.equip.body = 'leather';
      await s.narrate('Cai Jiu wrote to his father in the capital asking what to do with the rebel, and chose as his messenger the swiftest man in Jiangzhou: Dai Zong, the Magic Traveller, who could walk eight hundred li a day with his charms tied to his legs.');
      await s.say('daizong', '(The road to the capital passes Liangshan. Brother Wu Yong will know what to do.)');
      WM.unlock('zhugui');
      await s.say(null, '(Dai Zong\'s Divine March makes him very fast. Go north to Zhu Gui\'s tavern by Liangshan.)');
    } }
  ]);
  WM.defEvents('zhugui_in', [
    { id: 'ch9_daizong', x: 5, y: 5, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_condemned'); }, run: async function (s) {
      s.spawn('zhugui', 'zhugui', 8, 4, 'down');
      await s.narrate('Dai Zong stopped at the tavern by the marsh for a meal. Zhu Gui served him wine, and Dai Zong fell senseless — and when Zhu Gui searched his bundle, he found the prefect\'s letter to Cai Jing, about the rebel Song Jiang.');
      s.despawn('zhugui');
      s.flag('ch9_forge');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch9_forgery', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_forge') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('chaogai', 'chaogai', 15, 6, 'down'); s.spawn('wuyong', 'wuyong', 13, 8, 'right'); s.spawn('zhugui', 'zhugui', 18, 8, 'left');
      await s.say('chaogai:angry', 'They mean to kill Song Jiang! Brothers, we ride for Jiangzhou tonight!');
      await s.say('wuyong', 'Wait. It is a long way, and if we fail, Song Jiang dies. There is a better way. We write Cai Jing\'s reply ourselves: "Do not execute the rebel there. Send him to the capital under guard." On the road, we take him.');
      await s.say('daizong', 'But who can copy the Prime Minister\'s hand, and his seal?');
      await s.say('wuyong:smile', 'In Jizhou there is a scholar, Xiao Rang, who can write in the style of any master — Su, Huang, Mi or Cai. And Jin Dajian, who carves seals in jade and stone better than anyone alive. We will invite them to Liangshan... to carve an inscription for a temple.');
      await s.narrate('Liangshan\'s men "invited" the scholar and the carver, and their families followed soon after.');
      // the two are brought up the hall, a little bewildered, between two of the brothers
      s.spawn('xr', 'xiaorang', 15, 15, 'up'); s.spawn('jd', 'jindajian', 17, 15, 'up');
      s.spawn('ob1', 'outlaw', 14, 15, 'up'); s.spawn('ob2', 'outlaw', 18, 15, 'up');
      s.walkTo('ob1', 14, 11); s.walkTo('ob2', 18, 11); s.walkTo('xr', 15, 10); await s.walkTo('jd', 17, 10);
      s.face('xr', 'up'); s.face('jd', 'up'); s.emote('xr', 'sweat', 1); await s.emote('jd', '?', 1);
      await s.say('chaogai:smile', 'Forgive the manner of the invitation, gentlemen. A friend\'s life hangs on your brush and your knife.');
      // to work: Xiao Rang at the table with brush and paper, Jin Dajian at his stone
      s.walkTo('xr', 13, 9); await s.walkTo('jd', 19, 9); s.face('xr', 'up'); s.face('jd', 'up');
      s.emote('xr', '...', 1.6);
      for (var cv = 0; cv < 3; cv++) { s.sfx('block'); s.jump('jd', 2); await s.wait(0.35); }
      await s.narrate('Xiao Rang wrote the letter in Cai Jing\'s hand, and Jin Dajian carved Cai Jing\'s seal.');
      // the letter into Dai Zong's hands, and he is off down the hall at a run, the charms on his legs
      await s.walkTo('wuyong', 15, 11); s.faceEach('wuyong', 'player');
      s.sfx('item'); await s.emote('player', '!', 0.6);
      await s.say('wuyong', 'Here — sealed and ready. Run, Dai Zong. Run as you have never run.');
      await s.narrate('Dai Zong took it and ran back to Jiangzhou with his charms on his legs.');
      await s.walkTo('player', 16, 15, { speed: 160 }); s.hide('player');
      s.despawn('ob1', { leave: true }); s.despawn('ob2', { leave: true });
      s.despawn('chaogai'); s.despawn('zhugui');
      await s.joinMany(['xiaorang', 'jindajian']);
      s.face('xr', 'right'); s.face('jd', 'left'); s.face('wuyong', 'down');
      await s.say('wuyong:shock', '...Wait. Which seal did you put on the letter?');
      await s.say('jindajian', 'The one with his name and title: "Cai Jing, Hanlin Academician."');
      await s.say('wuyong:shock', 'Aiya! That is the seal for his public writings! No father writes to his own son under his name and title. The prefect will see it at once — Dai Zong is running to his death! Gather everyone! We go to Jiangzhou ourselves!');
      s.despawn('wuyong', { leave: true });
      s.flag('ch9_rescue'); s.show('player');
      s.party(['chaogai', 'huarong', 'liutang', 'yanshun', 'ruanxiaoqi', 'lufang']);
      s.level('chaogai', 22); ['huarong', 'liutang', 'yanshun', 'ruanxiaoqi', 'lufang'].forEach(function (id) { s.level(id, 21); });
      s.setLeader('chaogai'); s.flag('protagonist', 'chaogai');
      S.restoreParty();
      // Jiangzhou: Dai Zong hands the letter up to the prefect, and Huang Wenbing reads the seal
      await s.fadeOut(0.8);
      await s.warp('jiangzhou_in', 14, 9, 'up', { noFade: true });
      s.hide('player');
      s.spawn('cj9', 'caijiu', 7, 4, 'down'); s.spawn('hw9', 'huangwenbing', 10, 5, 'left');
      var g10 = WM.data.troop(s, 'jg2', 'soldier', [[2, 6], [12, 6], [3, 8], [12, 8]], 'down');
      s.spawn('dz10', 'daizong', 7, 9, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('dz10', 7, 6); s.face('dz10', 'up');
      s.sfx('item');
      await s.say('caijiu:smile', 'From my father already! ..."Send the rebel to the capital under guard." Excellent. Excellent.');
      await s.walkTo('hw9', 9, 5); s.face('hw9', 'left');
      await s.emote('hw9', '!', 0.8);
      await s.say('huangwenbing:smile', 'Your Honour — the seal. "Cai Jing, Hanlin Academician"? A father writing to his own son, under his name and his public title? This letter is a forgery.');
      s.emote('dz10', 'sweat', 1); await s.emote('cj9', 'anger', 0.8);
      await s.say('caijiu:angry', 'Seize him! Beat him until he tells us who wrote it!');
      s.walkTo(g10[0], 6, 7, { run: true }); await s.walkTo(g10[1], 8, 7, { run: true });
      for (var b10 = 0; b10 < 3; b10++) { s.sfx('hit'); s.jump('dz10', 2); await s.shake(3, 0.25); await s.wait(0.2); }
      await s.say('daizong:sad', '...Liangshan. It came from Liangshan.');
      await s.say('caijiu:angry', 'Then he and Song Jiang die together. Tomorrow, at the crossroads.');
      await s.narrate('So the prefect sentenced Dai Zong and Song Jiang to be beheaded together at the crossroads.');
      await s.fadeOut(0.8);
      WM.data.clear(s, g10.concat(['cj9', 'hw9', 'dz10']));
      s.show('player');
      await s.narrate('On the day of the execution, crowds packed the square. Among them were snake-charmers, beggars, porters with their poles, and merchants with carts — all of them Liangshan men.');
      await s.warp('jiangzhou', 18, 32, 'up', { fade: 0.6 });
    } }
  ]);
  WM.defEvents('jiangzhou', [
    { id: 'ch9_execution', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_rescue'); }, run: async function (s) {
      s.spawn('sj', 'songjiang', 17, 28, 'down'); s.spawn('dz', 'daizong', 19, 28, 'down');
      s.spawn('ex1', 'executioner', 17, 27, 'down'); s.spawn('ex2', 'executioner', 19, 27, 'down');
      s.spawn('g1', 'soldier', 15, 29, 'right'); s.spawn('g2', 'soldier', 21, 29, 'left');
      // the guard round the execution ground, and the crowd packed about it — snake-charmers, beggars, porters, merchants:
      // every one of them a Liangshan man
      var D = WM.data;
      var guard = D.troop(s, 'eg', 'soldier', [[14, 27], [22, 27], [15, 31], [21, 31], [14, 30], [22, 30]], 'down');
      var crowd = [].concat(
        D.troop(s, 'cm', 'merchant', [[12, 32], [21, 33], [24, 32]], 'up'),
        D.troop(s, 'cw', 'workman', [[13, 33], [16, 33], [23, 33], [12, 30]], 'up'),
        D.troop(s, 'co', 'oldman', [[15, 32], [24, 33]], 'up'),
        D.troop(s, 'cd', 'daoist', [[13, 31], [23, 31]], 'up'),
        D.troop(s, 'cf', 'farmer', [[19, 33], [12, 33], [23, 29], [13, 29]], 'up'));
      s.music('tense');
      await s.say({ name: 'Officer' }, 'The third quarter of the noon hour! Execute the prisoners!');
      s.spawn('likui', 'likui', 24, 24, 'down');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('Before the executioners could raise their swords, a huge black man, stripped to the waist, leapt down from the roof of a teahouse with a battle-axe in each hand, roaring like thunder. He cut down the two executioners and charged into the guards.');
      s.moveTo('likui', 18, 26, { run: true, wait: false });   // down off the teahouse roof and into the square
      s.lie('ex1'); s.lie('ex2');   // the two executioners, cut down where they stood
      await s.wait(0.5);
      await s.say('chaogai', 'Now! Liangshan, now!');
      // the crowd throws off its disguise: knives from the carts, swords from the poles
      crowd.forEach(function (k) { s.jump(k, 6); s.emote(k, '!', 0.8); });
      s.spawn('hr9', 'huarong', 16, 32, 'up'); s.spawn('lt9', 'liutang', 20, 32, 'up'); s.spawn('ys9', 'yanshun', 14, 32, 'up'); s.spawn('rq9', 'ruanxiaoqi', 22, 32, 'up'); s.spawn('lf9', 'lufang', 17, 33, 'up');
      guard.forEach(function (k) { s.face(k, 'down'); s.emote(k, '!', 0.8); });
      s.sfx('slash'); await s.wait(0.6);
      s.addParty('likui'); s.level('likui', 22);
      await s.battle('ch9_exec1', { bg: 'town', music: 'battle' });
      await s.battle('ch9_exec2', { bg: 'town', music: 'boss' });
      guard.concat(['g1', 'g2']).forEach(function (k) { s.lie(k); });   // the guard of the execution ground, cut down where they stood
      s.despawn('sj', { leave: true }); s.despawn('dz', { leave: true });
      await s.narrate('Liangshan\'s men carried Song Jiang and Dai Zong on their backs, and followed the Black Whirlwind, who cut a road through the crowd towards the river. But when they reached the bank there were no boats, only the White Dragon Temple, and the great river, and the soldiers of Jiangzhou coming behind.');
      s.flag('ch9_temple');
      WM.unlock('whitedragon');
      await s.warp('whitedragon', 15, 12, 'up');
    } }
  ]);
  WM.defEvents('whitedragon', [
    { id: 'ch9_gathering', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_temple'); }, run: async function (s) {
      await s.narrate('They shut themselves in the temple. Then, down the river, came three great boats under sail, packed with armed men — Zhang Shun and Zhang Heng, Li Jun, the Tong brothers, the Mu brothers, Xue Yong and Li Li, who had heard of the execution and come to rescue Song Jiang themselves.');
      await s.narrate('Twenty-nine heroes met at the White Dragon Temple that day. The storytellers call it "the small gathering at the White Dragon Temple."');
      s.spawn('sj', 'songjiang', 15, 9, 'down'); s.spawn('lk', 'likui', 16, 10, 'up');
      await s.say('songjiang', 'Brothers... I owe you my life. All of you.');
      await s.say('likui', 'Brother! Let\'s go back and kill the prefect, and Huang Wenbing too!');
      s.despawn('sj', { leave: true }); s.despawn('lk');
      ['zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili'].forEach(function (id) { S.initChar(id, 20); });
      await s.war('ch9_river');
      await s.narrate('The Jiangzhou army broke and fled. That night, guided by Hou Jian — a tailor from Hongdu who worked in Huang Wenbing\'s house and was Xue Yong\'s pupil — they crossed the river to Wuweijun.');
      s.flag('ch9_wuwei');
      WM.unlock('wuweijun');
      await s.warp('wuweijun', 1, 11, 'right');
    } }
  ]);
  WM.defEvents('wuweijun', [
    { id: 'ch9_huang', x: 20, y: 9, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_wuwei'); }, idle: { houjian: '(whispering) Not here — the watch passes along this wall. Come round to the back gate and I\'ll open it.' },
      run: async function (s) {
      s.spawn('houjian', 'houjian', 22, 11, 'up');
      await s.say('houjian', 'The back gate is open. Huang Wenbing is inside. Only he and his household — his brother Huang Wenye is a good man, spare him.');
      s.despawn('houjian');
      await s.battle('ch9_wuwei', { bg: 'night', music: 'boss' });
      await s.narrate('Huang Wenbing was taken as he fled down the river. Song Jiang had him brought before all the brothers, and accused him of his crimes, and Li Kui carried out the sentence. The house was burned. His brother\'s family, who had always been kind to the poor, was left untouched.');
      s.flag('ch9_home');
      await s.narrate('Then they all set out for Liangshan together. On the way, at Huangmen Mountain, four chiefs came down to meet them and asked to follow Song Jiang: Ou Peng, the Golden-Winged Eagle; Jiang Jing, the Divine Mathematician; Ma Lin, the Iron Flute Immortal; and Tao Zongwang, the Nine-Tailed Turtle.');
      s.party(['songjiang', 'likui', 'daizong', 'huarong']); s.setLeader('songjiang');
      s.flag('protagonist', 'songjiang');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch9_welcome', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_home') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('chaogai', 'chaogai', 15, 6, 'down'); s.spawn('wuyong', 'wuyong', 13, 7, 'right');
      s.music('castle');
      await s.say('chaogai:smile', 'Brother Song! At last you are home. Take the first seat — I will gladly give it to you.');
      await s.say('songjiang', 'Never, brother. You are the elder, and Liangshan is yours. I will take the second seat, and be grateful.');
      await s.narrate('Chao Gai remained the first chief, and Song Jiang took the second. Liangshan feasted for days. New houses went up on the mountain, new boats were built in the marsh, and more men came every month to join the cause.');
      s.despawn('chaogai'); s.despawn('wuyong');
      await s.joinMany(['songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang']);
      ['houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang'].forEach(function (id) { s.level(id, 20); });
      s.flag('ch9_done');
      await s.endChapter();
      if (WM.data.chapters[10].begin) await WM.data.chapters[10].begin(s);
    } }
  ]);
})();
