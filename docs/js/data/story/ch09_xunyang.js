// Chapter 9 — "Xunyang Tower" (novel chapters 36–41).
// Song Jiang's road to exile: Liangshan's offer refused; Jieling Ridge; Jieyang and the river; Jiangzhou, Dai Zong,
// Li Kui and Zhang Shun; the rebel poem; the forged letter; the execution ground; the White Dragon Temple;
// Wuweijun; and the return of all to Liangshan.
'use strict';
(function () {
  // Song Jiang's two escorts, Zhang Qian and Li Wan, walk at his heels all the way from Liangshan to the Jiangzhou camp.
  // A scene that stages them takes them over from where they are walking (keys k1, k2), and gives them back after.
  var ESCORTS = ['escortzhang', 'constable'];
  function escortsIn(s, k1, k2, fb1, fb2) {
    var at = ['fol_0', 'fol_1'].map(function (k) { var a = WM.field.actors && WM.field.findActor(k); return a && a.tile ? a.tile() : null; });
    WM.state.followers = []; if (WM.field.refreshFollowers) WM.field.refreshFollowers();
    var a = at[0] || { x: fb1[0], y: fb1[1] }, b = at[1] || { x: fb2[0], y: fb2[1] };
    s.spawn(k1, ESCORTS[0], a.x, a.y, 'up'); s.spawn(k2, ESCORTS[1], b.x, b.y, 'up');
  }
  function escortsFollow(s, keys) { if (keys) WM.data.clear(s, keys); WM.state.followers = ESCORTS.slice(); if (WM.field.refreshFollowers) WM.field.refreshFollowers(); }

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
      s.despawn('chaogai'); s.despawn('wuyong');
      await s.narrate('So Song Jiang went on south with his escorts. After a long journey they crossed into Jiangzhou country, and climbed a steep ridge called Jieling. At the top was an inn.');
      s.flag('ch9_road');
      escortsFollow(s, ['esc', 'esc2']);
      await s.warp('jieling', 1, 9, 'right');
    } }
  ]);

  // ---------------- Jieling Ridge ----------------
  WM.defEvents('jieling_in', [
    { id: 'ch9_lili', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_road'); }, run: async function (s) {
      s.spawn('lili', 'lili', 5, 5, 'down');
      escortsIn(s, 'esc', 'esc2', [5, 6], [7, 6]);   // Zhang Qian and Li Wan, in at the door behind him
      s.walkTo('esc', 4, 5); await s.walkTo('esc2', 4, 6); s.face('esc', 'right'); s.face('esc2', 'up');
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
      s.despawn('lili'); s.despawn('lijun'); s.despawn('tongwei'); s.despawn('tongmeng');
      s.flag('ch9_jieyang');
      await s.narrate('Li Jun walked with them down the ridge, and they parted with promises. Song Jiang went on to Jieyang town, on the bank of the great river.');
      escortsFollow(s, ['esc', 'esc2']);
      await s.warp('jieyang', 1, 8, 'right');
    } }
  ]);

  // ---------------- Jieyang ----------------
  WM.defEvents('jieyang', [
    { id: 'ch9_xueyong', x: 14, y: 9, w: 14, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_jieyang'); }, idle: { c3: 'Shh — he\'s about to start. They say this fellow can do things with a spear you won\'t believe.', c7: 'A medicine-seller with a staff... I\'ve no coppers to spare, but I\'ll watch.' }, run: async function (s) {
      s.spawn('xueyong', 'xueyong', 20, 12, 'down'); s.spawn('c1', 'villager', 18, 13, 'up'); s.spawn('c2', 'woman', 22, 13, 'up'); s.spawn('c3', 'farmer', 20, 14, 'up');
      // more of the town gathered round the ring
      s.spawn('c4', 'villager2', 17, 12, 'right'); s.spawn('c5', 'oldwoman', 23, 12, 'left'); s.spawn('c6', 'merchant', 17, 13, 'right'); s.spawn('c7', 'woman2', 21, 14, 'up');
      s.spawn('c8', 'villager', 23, 13, 'left'); s.spawn('c9', 'oldman', 18, 11, 'down'); s.spawn('c10', 'farmer', 22, 11, 'down');   // (written out, so they stand in the square before he arrives)
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
      await s.fadeOut(0.8);   // and the afternoon goes, while the town shuts its doors
      s.tint('dusk');
      escortsIn(s, 'ez9', 'el9', [18, 15], [22, 15]);
      await s.fadeIn(0.8);
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
      s.hide('player'); WM.data.clear(s, ['om9', 'ez9', 'el9']);   // (inside, in the little room by the gate)
      await s.wait(0.8);
      // late in the night, torches on the road: the old man's sons come home
      s.spawn('mh9', 'muhong', 18, 9, 'right'); s.spawn('mc9', 'muchun', 17, 9, 'right');
      s.walkTo('mh9', 35, 9); await s.walkTo('mc9', 36, 9); s.face('mh9', 'up'); s.face('mc9', 'up');
      await s.say('muchun:angry', 'Father! Open up! A convict with silver beat me in the market today — him and that street-performer!');
      await s.say('muhong:angry', 'Never mind, brother. We\'ve shut every door in Jieyang against him. Tonight he sleeps in a ditch, and in the morning we hunt him down.');
      s.walkTo('mh9', 35, 7); await s.walkTo('mc9', 36, 7); s.hide('mh9'); s.hide('mc9'); s.sfx('door');
      await s.narrate('Inside, Song Jiang heard every word. They were lodging in the house of the Mu brothers.');
      // out over the back fence in the dark, and down the lanes to the river
      await s.fadeOut(0.6);
      s.place('player', 41, 7, 'right'); s.show('player');   // (out of the little door at the back of the house, into the side yard)
      s.spawn('ez9b', ESCORTS[0], 40, 7, 'right'); s.spawn('el9b', ESCORTS[1], 39, 7, 'right');
      await s.fadeIn(0.6);
      s.sfx('door'); await s.wait(0.3);
      s.move('el9b', 'R3', { run: true }); await s.wait(0.25); s.move('ez9b', 'R2', { run: true }); await s.wait(0.25); await s.move('player', 'R1', { run: true });   // through the back gate in the fence
      s.walkTo('ez9b', 19, 19, { run: true }); s.walkTo('el9b', 21, 19, { run: true }); await s.walkTo('player', 20, 20, { run: true });
      s.face('player', 'up');
      // behind them, the Mu brothers burst out of the gate with torches
      s.show('mh9'); s.show('mc9'); s.place('mh9', 35, 8, 'down'); s.place('mc9', 36, 8, 'down');
      s.walkTo('mh9', 28, 9, { run: true }); await s.walkTo('mc9', 29, 9, { run: true });
      await s.say('muchun:angry', 'The room\'s empty — the convict\'s gone! After him! Down to the river!', { top: true });
      s.flag('ch9_river');
      WM.data.clear(s, ['ez9b', 'el9b', 'mh9', 'mc9']);
      escortsFollow(s);
      await s.warp('jieyang', 20, 20, 'down', { noFade: true });
    } },
    { id: 'ch9_boat', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_river'); }, run: async function (s) {
      // a ferryman's boat at the foot of the landing, and the torches coming down the lane behind
      escortsIn(s, 'e1', 'e2', [19, 20], [21, 20]);
      s.spawn('zhangheng', 'zhangheng', 21, 22, 'up'); s.boat('zhangheng', 4);
      await s.say('zhangheng', 'Need a boat? Hop in, quick — I see torches behind you!');
      // down into the boat, and off into the dark current
      s.moveTo('e1', 19, 22); s.moveTo('e2', 22, 22); await s.moveTo('player', 20, 22);
      ['player', 'e1', 'e2'].forEach(function (k) { s.boat(k, 'ride'); s.face(k, 'down'); });
      s.face('zhangheng', 'down');
      var crew = ['zhangheng', 'player', 'e1', 'e2'], xs = [21, 20, 19, 22];
      crew.forEach(function (k, n) { s.moveTo(k, xs[n], 26); }); await s.wait(1.6);
      await s.narrate('The ferryman pushed off into the dark river. The torches of the Mu brothers stopped at the bank. Out in the middle of the current, the ferryman shipped his oar, and drew a broad knife from under the boards.');
      s.face('zhangheng', 'left'); s.face('player', 'right'); s.face('e1', 'right'); s.face('e2', 'left');
      s.sfx('block'); await s.emote('zhangheng', 'anger', 0.8);
      await s.say('zhangheng:smile', 'Now, sirs. Which will it be — "dumplings" or "knife-noodles"?');
      await s.say('songjiang:shock', 'What... what do you mean?');
      await s.say('zhangheng:smile', '"Dumplings": you strip and jump in, and drown nice and quiet. "Knife-noodles": I cut you into the river myself. Choose.');
      s.emote('e1', 'sweat', 1); await s.emote('e2', 'sweat', 1);
      // a fast boat comes flying down the river from upstream
      await s.narrate('Just then a fast boat came flying downstream, with three men at the oars.');
      s.spawn('lijun', 'lijun', 2, 27, 'right'); s.boat('lijun', 3); s.spawn('tw', 'tongwei', 1, 27, 'right'); s.boat('tw', 'ride'); s.spawn('tm', 'tongmeng', 3, 27, 'right'); s.boat('tm', 'ride');
      s.moveTo('tw', 13, 27); s.moveTo('tm', 15, 27); await s.moveTo('lijun', 14, 27);
      await s.say('lijun', 'Ho there! Who\'s working the river tonight?');
      s.face('zhangheng', 'left');
      await s.say('zhangheng', 'Zhang Heng, brother!');
      await s.say('lijun', 'Who\'ve you got?');
      await s.say('zhangheng:smile', 'Three fat sheep — a convict and two escorts.');
      await s.say('lijun:shock', 'A convict? Is it Song Jiang of Yuncheng?');
      s.moveTo('tw', 16, 27); s.moveTo('tm', 18, 27); await s.moveTo('lijun', 17, 27);
      await s.emote('lijun', '!', 0.6);
      await s.say('lijun', 'It is! Zhang Heng, you fool, put down that knife! This is Song Gongming!');
      await s.emote('zhangheng', '!', 0.6);
      await s.say('zhangheng:shock', '...Timely Rain? Brother, forgive me! I nearly made knife-noodles of you!');
      // both boats pull back to the landing, and everyone climbs ashore
      crew.forEach(function (k, n) { s.moveTo(k, xs[n], 22); }); s.moveTo('tw', 16, 23); s.moveTo('tm', 18, 23); s.moveTo('lijun', 17, 23);
      await s.wait(1.6);
      ['player', 'e1', 'e2', 'zhangheng', 'lijun', 'tw', 'tm'].forEach(function (k) { s.boat(k, false); });
      s.moveTo('player', 20, 20); s.moveTo('e1', 19, 21); s.moveTo('e2', 22, 21); s.moveTo('zhangheng', 22, 20); s.moveTo('lijun', 17, 21);
      s.moveTo('tw', 16, 21); await s.moveTo('tm', 18, 21);
      WM.data.clear(s, ['tw', 'tm']);
      s.night(false);
      // Li Jun brings the Mu brothers and Xue Yong down to the landing, ashamed
      s.spawn('mh', 'muhong', 20, 15, 'down'); s.spawn('mc', 'muchun', 21, 15, 'down'); s.spawn('xy', 'xueyong', 19, 15, 'down');
      s.walkTo('mh', 19, 18); s.walkTo('mc', 21, 18); await s.walkTo('xy', 18, 19);
      s.face('player', 'up');
      await s.say('muhong', 'Brother Song Jiang! We had eyes, and did not see Mount Tai. Forgive us — we had no idea who you were.');
      await s.emote('mc', 'sweat', 0.8);
      await s.say('muchun:sad', 'It was I who insulted you in the market. Beat me if you like, brother — I deserve it.');
      await s.say('xueyong', 'Benefactor! Li Jun told them everything. Half the river is ashamed of itself tonight.');
      await s.say('songjiang:smile', 'Get up, all of you. A quarrel in the market is nothing between brothers.');
      s.face('zhangheng', 'up'); s.face('player', 'down');
      await s.say('zhangheng', 'Brother, take this with you to Jiangzhou. My younger brother, Zhang Shun, is a fish-broker there. Give him this letter, and he will look after you.');
      s.sfx('item');
      WM.data.clear(s, ['mh', 'mc', 'xy']);
      // on, down the river, to Jiangzhou
      await s.fadeOut(0.8);
      await s.narrate('They drank together on the bank until dawn. Then Song Jiang and his escorts said goodbye and went on down the great river. Some days later the walls of Jiangzhou rose above the water ahead of them, and they went up through the north gate to the prison camp.');
      s.despawn('zhangheng'); s.despawn('lijun');
      escortsFollow(s, ['e1', 'e2']);   // (the escorts walk on with him to Jiangzhou)
      s.flag('ch9_jiangzhou');
      await s.warp('jiangzhou', 27, 3, 'down', { noFade: true });
    } }
  ]);

  // ---------------- Jiangzhou ----------------
  WM.defEvents('jiangzhou', [
    { id: 'ch9_prison', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_jiangzhou'); }, run: async function (s) {
      // the escorts hand him in at the camp, and set off home
      escortsIn(s, 'ez10', 'el10', [26, 4], [28, 4]);
      await s.fadeIn(0.8);   // (in through the north gate, from the road down the river)
      await s.say({ name: 'Escort' }, 'Jiangzhou at last. Come, Clerk Song — the camp is this way, and then our job is done.');
      s.despawn('ez10', { leave: true }); s.despawn('el10', { leave: true });
      await s.narrate('At the Jiangzhou prison camp, Song Jiang gave silver to everyone — the warden, the guards, the clerks — and was made a clerk in the camp office, without a single stroke of the "welcoming" stick. Only one man he did not pay: the superintendent of the prison, Dai Zong.');
      s.spawn('daizong', 'daizong', 27, 5, 'down');
      s.face('daizong', 'up'); s.face('player', 'down');   // the two face each other (he comes up from below)
      await s.say('daizong:angry', 'Which convict here is Song? You\'ve paid everybody in the camp but me. Do you think I can\'t have you beaten to death for it?');
      await s.say('songjiang', 'For not paying you? Is that a crime? ...But tell me, what would be the crime of a man who was a friend of Wu Yong, of Liangshan Marsh?');
      await s.say('daizong:shock', '...!! Quiet! Who are you?');
      await s.say('songjiang', 'Song Jiang of Yuncheng. Here — a letter from the Professor.');
      await s.say('daizong:shock', 'Song Jiang! Timely Rain! Brother, why didn\'t you say so?! Come, come — let\'s drink.');
      var dzAt = s.actor('player').tile(); await s.walkTo('daizong', dzAt.x - 1, dzAt.y); s.face('daizong', 'right');   // (he stays at Song Jiang's side)
      WM.state.chars.songjiang.equip.acc = null; S.restore('songjiang');
      s.addParty('daizong'); s.level('daizong', 20);
      s.flag('ch9_likui');
      await s.narrate('They had barely sat down in a tavern by the river when a huge black man came storming up the stairs, shouting for Dai Zong. Dai Zong sighed. "That is Li Kui, a jailer of mine. They call him the Black Whirlwind. He\'s mad as a buffalo — but loyal."');
      var sjAt = s.actor('player').tile();
      s.spawn('likui', 'likui', sjAt.x + 1, sjAt.y + 6, 'up');   // (from down the avenue)
      await s.walkTo('likui', sjAt.x + 1, sjAt.y, { run: true });   // up the street at a run, to Song Jiang's elbow
      s.faceEach('player', 'likui'); await s.emote('player', '!', 0.8);
      await s.say('likui', 'Brother Dai! Lend me ten taels, I\'ll win it all back tonight! ...Who\'s this dark little fellow?');
      await s.say('daizong', 'Mind your manners! This is Song Jiang of Yuncheng.');
      await s.say('likui:shock', '...Song Jiang? THE Song Jiang? Timely Rain? Not some cheat?');
      await s.say('songjiang:smile', 'The very same.');
      await s.narrate('Li Kui threw himself down and kowtowed so hard the floor shook. Song Jiang gave him ten taels. Li Kui lost it all at the gambling den in an hour, robbed the den to get it back, and Song Jiang had to pay the gamblers. Li Kui was his devoted slave from that day on.');
      await s.narrate('Then Song Jiang wanted fresh fish soup, and Li Kui ran down to the river to get some.');
      s.despawn('likui', { leave: true });
      // the riverbank below the city gate: fishing boats at the water's edge
      await s.fadeOut(0.6);
      WM.data.clear(s, ['daizong']);
      await s.warp('jiangzhou', 24, 35, 'right', { noFade: true });   // Song Jiang and Dai Zong watching from the sand
      s.spawn('dz9', 'daizong', 23, 35, 'right');
      s.spawn('fb1', 'villager', 30, 36, 'left'); s.boat('fb1'); s.spawn('fb2', 'farmer', 34, 36, 'left'); s.boat('fb2');
      s.spawn('likui', 'likui', 27, 31, 'down');
      s.camera(30, 33, 0.01);   // (the view on Li Kui and the boats, not on Song Jiang at the edge of it)
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
      // the riverside folk come running to watch: a fight with the fish-broker is worth seeing
      s.spawn('w1', 'villager', 14, 35, 'right'); s.spawn('w2', 'woman', 15, 35, 'right'); s.spawn('w3', 'villager2', 46, 35, 'left'); s.spawn('w4', 'farmer', 47, 35, 'left'); s.spawn('w5', 'child', 45, 35, 'left');
      s.walkTo('w1', 21, 35, { run: true }); s.walkTo('w2', 20, 35, { run: true }); s.walkTo('w3', 38, 35, { run: true }); s.walkTo('w4', 40, 35, { run: true }); s.walkTo('w5', 39, 35, { run: true });
      await s.say('zhangshun:angry', 'So you\'re the black ox who\'s been robbing my fishermen! Put that fish down.');
      await s.say('likui:angry', 'I want fish for my brother\'s soup, and I\'ll have it — fish-broker or no fish-broker!');
      await s.duel('likui_zhangshun_land', { hero: 'likui', canLose: true });
      await s.narrate('On land Li Kui pinned the fish-broker under his fists — until the white-skinned man twisted free.');
      // into a boat at the water's edge, and out of reach
      await s.walkTo('zhangshun', 33, 35, { run: true });
      s.jump('zhangshun', 4); await s.moveTo('zhangshun', 33, 36); s.boat('zhangshun', 3);   // a fisherman's sampan, room for three s.face('zhangshun', 'left');
      await s.say('zhangshun:smile', 'Come on, black ox! Your fish is out here. Come and fetch it — if you dare!');
      await s.emote('likui', 'anger', 0.8);
      await s.say('likui:angry', 'You think I\'m scared of a little water?!');
      await s.walkTo('likui', 32, 35, { run: true });
      s.jump('likui', 5); await s.moveTo('likui', 32, 36); s.boat('likui', 'ride');   // into the same boat
      // out into the middle of the river (the view goes with them, so the words don't cover them)
      s.camera(31, 38, 0.8);
      s.moveTo('zhangshun', 33, 38); await s.moveTo('likui', 32, 38);
      await s.narrate('Out in the middle of the river, Zhang Shun planted his feet on the gunwale and rocked the boat — and over it went.');
      s.sfx('splash'); s.splash('likui'); s.splash('zhangshun'); s.swim('likui'); s.swim('zhangshun'); await s.shake(3, 0.3);
      s.face('zhangshun', 'left'); s.face('likui', 'right');
      // under, and up, and under again
      for (var dk = 0; dk < 3; dk++) {
        s.splash('likui'); s.hide('likui'); await s.wait(0.6);
        s.show('likui'); s.splash('likui'); await s.emote('likui', 'sweat', 0.5);
      }
      await s.say('likui:shock', '(glub) — let go — (glub) — I can\'t — !');
      ['w1', 'w2', 'w3', 'w4', 'w5'].forEach(function (k) { s.face(k, 'down'); s.emote(k, 'note', 1.2); });
      await s.say('villager', 'Ha! Look at the Black Whirlwind now — like a drowned buffalo!', { top: true });
      await s.narrate('Zhang Shun dragged Li Kui under the water again and again, until his eyes were white, then held him up for air, then dunked him again, while the whole riverbank roared with laughter.');
      await s.say('daizong', 'Zhang Shun! Stop! That\'s Li Kui — and this is Song Jiang!');
      await s.emote('zhangshun', '!');
      await s.say('zhangshun:shock', '...Song Jiang? My brother Zhang Heng wrote to me about you!');
      // he tows the half-drowned Whirlwind back to the sand
      s.moveTo('zhangshun', 33, 36); await s.moveTo('likui', 32, 36);
      s.swim('zhangshun', false); s.swim('likui', false);
      s.moveTo('zhangshun', 33, 35); await s.moveTo('likui', 32, 35);
      s.face('likui', 'left'); s.camera(30, 33, 0.6); await s.emote('likui', 'sweat', 1);
      await s.narrate('So Zhang Shun the White Streak in the Waves, and Li Kui the Black Whirlwind, became friends, though Li Kui would never again go near water if he could help it.');
      // the crowd drifts off along the bank, and the brothers go up through the water gate into the city, out of sight
      s.walkTo('w1', 6, 35); s.walkTo('w2', 5, 35); s.walkTo('w3', 50, 35); s.walkTo('w4', 51, 35); s.walkTo('w5', 49, 35);
      s.walkTo('likui', 27, 24); await s.walkTo('zhangshun', 28, 24);
      WM.data.clear(s, ['likui', 'zhangshun', 'w1', 'w2', 'w3', 'w4', 'w5']); s.despawn('dz9'); s.despawn('fb1'); s.despawn('fb2');
      s.cameraReset();
      s.flag('ch9_poem');
      s.removeParty('daizong');
      await s.fadeOut(0.8); await s.fadeIn(0.8);   // (the days go by)
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
      // the keeper comes out from behind his counter with them, and goes back to it
      await s.walkTo('jztowerkeep', 49, 5);
      s.face('jztowerkeep', 'right'); s.face('player', 'left'); await s.emote('jztowerkeep', '...', 1);
      s.walkTo('jztowerkeep', 45, 7).then(function () { s.face('jztowerkeep', 'down'); });
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
      s.spawn('cj9', 'caijiu', 8, 4, 'down'); s.actor('cj9').x += 8;   // (in the middle of the two-tile chair)
      s.spawn('hw9', 'huangwenbing', 11, 5, 'left');
      var g9 = WM.data.troop(s, 'jg', 'soldier', [[5, 6], [12, 6], [5, 8], [12, 8]], 'down');
      s.spawn('sj9', 'songjiang', 8, 9, 'up'); s.spawn('dg', 'soldier', 7, 9, 'up'); s.spawn('dg2', 'soldier', 9, 9, 'up');
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
      s.flag('ch9_condemned');
      s.party(['daizong']); s.level('daizong', 21); s.setLeader('daizong');   // (while the screen is dark: no glimpse of Song Jiang)
      s.flag('protagonist', 'daizong');
      WM.state.chars.daizong.equip.body = 'leather';
      s.show('player');
      await s.fadeIn(0.8);
      await s.narrate('Cai Jiu wrote to his father in the capital asking what to do with the rebel, and chose as his messenger the swiftest man in Jiangzhou: Dai Zong, the Magic Traveller, who could walk eight hundred li a day with his charms tied to his legs.');
      await s.say('daizong', '(The road to the capital passes Liangshan. Brother Wu Yong will know what to do.)');
      WM.unlock('zhugui');
      await s.say(null, '(Dai Zong\'s Divine March makes him very fast. Go north to Zhu Gui\'s tavern by Liangshan.)');
    } }
  ]);
  WM.defEvents('zhugui_in', [
    { id: 'ch9_daizong', x: 5, y: 5, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_condemned'); }, run: async function (s) {
      s.spawn('zhugui', 'zhugui', 8, 4, 'down');
      await s.say('zhugui:smile', 'Welcome, traveller! Sit, sit — you look like you\'ve come a long way.');
      await s.walkTo('player', 7, 5); s.face('player', 'up');
      await s.say('daizong', 'Wine, and something quick. I have far to go tonight.');
      // the keeper brings the jug round to him
      await s.walkTo('zhugui', 8, 5); s.face('zhugui', 'left'); s.sfx('item');
      await s.say('zhugui:smile', 'The best wine on the marsh, sir. Drink up.');
      await s.emote('player', '...', 1.2);
      s.sfx('hit'); s.lie('player'); await s.shake(2, 0.3);
      await s.narrate('Dai Zong had hardly set down the bowl before the room spun, and he slid senseless to the floor.');
      // Zhu Gui goes through his bundle, and finds the letter
      s.sfx('item'); await s.emote('zhugui', '?', 1);
      await s.say('zhugui:shock', '(reading) "...the rebel Song Jiang of Yuncheng... a reply is awaited from the Prime Minister..." The Jiangzhou prefect, writing to Cai Jing! And this courier\'s badge says "Dai Zong" — the Professor\'s friend!');
      await s.say('zhugui', 'Quick — the antidote!');
      s.sfx('heal'); s.lie('player', false); s.face('player', 'right');
      await s.emote('player', '!', 0.8);
      await s.say('daizong:shock', 'What — where — my letter!');
      await s.say('zhugui', 'Forgive me, brother. Song Jiang is my brother too. Come — the chiefs must see this at once.');
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
      await s.say('chaogai', 'And Dai Zong carries the reply back himself — no courier on earth is faster.');
      await s.say('daizong', 'Eight hundred li a day with the charms on my legs. The prefect will have it in his hands before he has missed me.');
      await s.say('zhugui', 'Then I will send men to Jizhou tonight, Professor. A temple inscription, you say? They will need a little... persuading.');
      await s.say('wuyong:smile', 'Gently, brother. We want their brushes and their knives, not their fear.');
      // some days later: the two are brought up from Jizhou
      await s.fadeOut(0.8);
      await s.narrate('Liangshan\'s men "invited" the scholar and the carver, and their families followed soon after.');
      await s.fadeIn(0.8);
      // the two are brought up the hall, a little bewildered, between two of the brothers
      s.spawn('xr', 'xiaorang', 15, 15, 'up'); s.spawn('jd', 'jindajian', 17, 15, 'up');
      s.spawn('ob1', 'outlaw', 14, 15, 'up'); s.spawn('ob2', 'outlaw', 18, 15, 'up');
      s.walkTo('ob1', 14, 11); s.walkTo('ob2', 18, 11); s.walkTo('xr', 15, 10); await s.walkTo('jd', 17, 10);
      s.face('xr', 'up'); s.face('jd', 'up'); s.emote('xr', 'sweat', 1); await s.emote('jd', '?', 1);
      await s.say('chaogai:smile', 'Forgive the manner of the invitation, gentlemen. A friend\'s life hangs on your brush and your knife.');
      await s.say('xiaorang:shock', 'We were told there was an inscription to be carved for a temple on Mount Tai... and then your men put us in a boat.');
      await s.say('jindajian', 'Our wives — our children — what has become of them?');
      await s.say('wuyong', 'They are on their way here now, safe and well cared for. No harm will come to anyone. We need one letter in the Prime Minister\'s hand, and one seal — to save the life of Song Jiang.');
      await s.emote('xr', '!', 0.6);
      await s.say('xiaorang', 'Song Jiang? Timely Rain, of Yuncheng? ...Then give me paper, and good ink. For him I will write as Cai Jing himself.');
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
      s.spawn('cj9', 'caijiu', 8, 4, 'down'); s.actor('cj9').x += 8;
      s.spawn('hw9', 'huangwenbing', 11, 5, 'left');
      var g10 = WM.data.troop(s, 'jg2', 'soldier', [[5, 6], [12, 6], [5, 8], [12, 8]], 'down');
      s.spawn('dz10', 'daizong', 8, 9, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('dz10', 8, 6); s.face('dz10', 'up');
      s.sfx('item');
      await s.say('caijiu:smile', 'From my father already! ..."Send the rebel to the capital under guard." Excellent. Excellent.');
      await s.walkTo('hw9', 10, 6); s.face('hw9', 'left');
      await s.emote('hw9', '!', 0.8);
      await s.say('huangwenbing:smile', 'Your Honour — the seal. "Cai Jing, Hanlin Academician"? A father writing to his own son, under his name and his public title? This letter is a forgery.');
      s.emote('dz10', 'sweat', 1); await s.emote('cj9', 'anger', 0.8);
      await s.say('caijiu:angry', 'Seize him! Beat him until he tells us who wrote it!');
      s.walkTo(g10[0], 7, 7, { run: true }); await s.walkTo(g10[1], 9, 7, { run: true });
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
      guard.concat(['g1', 'g2']).forEach(function (k) { s.lie(k); });   // the guard of the execution ground, cut down where they stood
      // the prefect's own guard pours down the avenue and closes round Chao Gai
      var rs = ['rs1', 'rs2', 'rs3', 'rs4'];
      s.spawn('rs1', 'soldier', 26, 22, 'down'); s.spawn('rs2', 'soldier', 27, 22, 'down'); s.spawn('rs3', 'soldier', 28, 22, 'down'); s.spawn('rs4', 'soldier', 29, 22, 'down');
      await s.say({ name: 'Officer' }, 'The prefect\'s guard! Here — cut them down! Not one bandit reaches the river!', { top: true });
      s.walkTo('rs1', 16, 31, { run: true }); s.walkTo('rs2', 20, 31, { run: true }); s.walkTo('rs3', 17, 33, { run: true }); await s.walkTo('rs4', 19, 33, { run: true });
      rs.forEach(function (k) { s.faceEach(k, 'player'); });
      await s.emote('player', 'anger', 0.8);
      await s.say('chaogai:angry', 'Here comes another wave, men of Liangshan! Stand fast — nobody leaves this square without our brothers!');
      await s.battle('ch9_exec2', { bg: 'town', music: 'boss' });
      rs.forEach(function (k) { s.lie(k); });
      // the Black Whirlwind cuts a road to the river gate, the brothers carrying Song Jiang and Dai Zong behind him
      await s.say('likui:angry', 'This way! To the river! Out of my way, or lose your heads!');
      s.walkTo('likui', 27, 33, { run: true }); s.walkTo('sj', 26, 33, { run: true }); s.walkTo('dz', 28, 33, { run: true });
      s.walkTo('hr9', 25, 32, { run: true }); s.walkTo('lt9', 29, 32, { run: true }); s.walkTo('ys9', 24, 32, { run: true }); s.walkTo('rq9', 30, 32, { run: true }); s.walkTo('lf9', 26, 31, { run: true });
      await s.walkTo('player', 27, 31, { run: true });
      // and behind them, more soldiers coming down the avenue
      s.spawn('ps1', 'soldier', 26, 19, 'down'); s.spawn('ps2', 'soldier', 28, 19, 'down'); s.spawn('ps3', 'soldier', 27, 18, 'down');
      s.walkTo('ps1', 26, 25, { run: true }); s.walkTo('ps2', 28, 25, { run: true }); await s.walkTo('ps3', 27, 24, { run: true });
      s.face('player', 'up'); await s.emote('player', '!', 0.6);
      await s.say({ name: 'Officer' }, 'After them! They\'re making for the river!', { top: true });
      WM.data.clear(s, ['sj', 'dz', 'hr9', 'lt9', 'ys9', 'rq9', 'lf9']);
      await s.narrate('Liangshan\'s men carried Song Jiang and Dai Zong on their backs, and followed the Black Whirlwind, who cut a road through the crowd towards the river. But when they reached the bank there were no boats, only the White Dragon Temple, and the great river, and the soldiers of Jiangzhou coming behind.');
      s.flag('ch9_temple');
      WM.unlock('whitedragon');
      await s.warp('whitedragon', 15, 12, 'up');
    } }
  ]);
  WM.defEvents('whitedragon', [
    { id: 'ch9_gathering', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_temple'); }, run: async function (s) {
      // cornered in the temple yard, the river before them and Jiangzhou behind
      s.spawn('sj', 'songjiang', 14, 11, 'down'); s.spawn('dz', 'daizong', 16, 11, 'down'); s.spawn('lk', 'likui', 15, 10, 'down');
      await s.narrate('They shut themselves in the temple yard, with the great river before them and the soldiers of Jiangzhou somewhere behind.');
      await s.say('likui:angry', 'No boats! Not one! Then we go back the way we came and cut our way through the whole city!');
      await s.say('songjiang:sad', 'Brother Chao, I have brought you all to this. If we die here, it is my doing.');
      s.face('player', 'down'); await s.emote('player', '!', 0.8);
      await s.say('chaogai', 'Wait — look! Sails, on the river!');
      // three boats come down the current under sail, packed with men
      var boats = [['zs', 'zhangshun', 3, 16, 3], ['zh', 'zhangheng', 2, 16, 'ride'], ['ll', 'lili', 4, 16, 'ride'],
        ['lj', 'lijun', 3, 18, 3], ['tw', 'tongwei', 2, 18, 'ride'], ['tm', 'tongmeng', 4, 18, 'ride'],
        ['mh', 'muhong', 3, 20, 3], ['mc', 'muchun', 2, 20, 'ride'], ['xy', 'xueyong', 4, 20, 'ride']];
      boats.forEach(function (b) { s.spawn(b[0], b[1], b[2], b[3], 'right'); s.boat(b[0], b[4]); });
      var last = null;
      boats.forEach(function (b) { last = s.moveTo(b[0], b[2] + 8, b[3]); });
      await last;
      await s.say('zhangshun', 'Brother Song Jiang! We heard in Jieyang that they meant to behead you today — we came as fast as the current would carry us!');
      // over the side and up onto the jetty
      var ashore = { zs: [14, 14], zh: [13, 14], ll: [15, 14], lj: [16, 14], tw: [13, 15], tm: [14, 15], mh: [15, 15], mc: [16, 15], xy: [14, 13] };
      boats.forEach(function (b) { s.boat(b[0], false); s.jump(b[0], 4); last = s.moveTo(b[0], ashore[b[0]][0], ashore[b[0]][1]); });
      await last;
      boats.forEach(function (b) { s.face(b[0], 'up'); });
      s.face('sj', 'down'); await s.emote('sj', '!', 0.8);
      await s.say('songjiang:shock', 'Zhang Shun... Li Jun... the Mu brothers — all of you, here?');
      await s.say('lijun', 'Every man on the river who owes you a kindness is in these boats, brother.');
      await s.say('muhong', 'And some who owe you an apology.');
      await s.narrate('Twenty-nine heroes met at the White Dragon Temple that day. The storytellers call it "the small gathering at the White Dragon Temple."');
      // and Jiangzhou's vanguard comes along the shore road
      s.spawn('js1', 'soldier', 0, 10, 'right'); s.spawn('js2', 'soldier', 0, 11, 'right'); s.spawn('js3', 'officer', 0, 9, 'right');
      s.walkTo('js1', 6, 10, { run: true }); s.walkTo('js2', 6, 11, { run: true }); await s.walkTo('js3', 3, 9, { run: true });
      s.face('player', 'left'); s.face('sj', 'left'); s.face('lk', 'left');
      await s.say({ name: 'Officer' }, 'There they are — at the temple! Send to the prefect: the whole army, now!', { top: true });
      s.move('js1', 'L5', { run: true, wait: false }); s.move('js2', 'L5', { run: true, wait: false }); await s.move('js3', 'L3', { run: true });
      await s.say('chaogai', 'Five or seven thousand men will be out of Jiangzhou after us within the hour. Brothers of the river — will you fight beside Liangshan?');
      await s.say('zhangshun:smile', 'On the water or off it! Put us in the reeds, and let them come.');
      await s.say('likui:angry', 'Let them come! My axes are still hungry!');
      await s.say('songjiang', 'Then hear me: archers on the bank, the boats hidden in the reeds behind, and the Black Whirlwind in front. We hold the shore, and when they break, we take to the water.');
      WM.data.clear(s, ['sj', 'dz', 'lk', 'js1', 'js2', 'js3'].concat(boats.map(function (b) { return b[0]; })));
      ['zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili'].forEach(function (id) { S.initChar(id, 20); });
      await s.war('ch9_river');
      await s.narrate('The Jiangzhou army broke and fled. That night, guided by Hou Jian — a tailor from Hongdu who worked in Huang Wenbing\'s house and was Xue Yong\'s pupil — they crossed the river to Wuweijun.');
      s.flag('ch9_wuwei');
      WM.unlock('wuweijun');
      await s.warp('wuweijun', 1, 11, 'right');
    } }
  ]);
  WM.defEvents('wuweijun', [
    { id: 'ch9_huang', x: 20, y: 9, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_wuwei'); }, idle: { houjian: '(whispering) Not here — the watch passes along this wall. Come round to the back gate and I\'ll open it.', xy: '(whispering) My pupil will come out to meet us. Wait for him by the gate.', sj: '(quietly) Huang Wenbing wanted me beheaded for a poem. Tonight he answers for it.', lk: 'Is it time yet? My axes are getting cold!' },
      run: async function (s) {
      // midnight under the wall: Xue Yong brings his pupil out of the shadows
      s.spawn('xy', 'xueyong', 18, 11, 'right'); s.spawn('sj', 'songjiang', 17, 12, 'up'); s.spawn('lk', 'likui', 19, 12, 'up');
      s.spawn('houjian', 'houjian', 26, 11, 'left');
      await s.walkTo('houjian', 23, 11); s.face('player', 'right');
      await s.say('xueyong', 'Brothers, this is Hou Jian of Hongdu, my pupil — a tailor, and the quickest needle on the river. He has been sewing robes in Huang Wenbing\'s house all month.');
      await s.say('houjian', 'The back gate is open. Huang Wenbing is inside tonight — he came home from the prefect\'s banquet boasting about the "rebel poem." Only he and his household are there.');
      await s.say('houjian', 'But his elder brother, Huang Wenye, lives in the next house. He gives rice to the poor and is called "Huang the Buddha" in this town. Spare him, I beg you.');
      s.faceEach('sj', 'houjian');
      await s.say('songjiang', 'Not one of Huang Wenye\'s people will be touched. It is the man who would have had me beheaded for a poem that I have come for.');
      await s.say('likui:angry', 'Then let me go in first! I\'ve been waiting all the way across the river!');
      await s.say('chaogai', 'Quietly, brother — through the back gate, and a torch to the thatch when we have him. Go!');
      await s.walkTo('houjian', 22, 10); s.hide('houjian');
      s.walkTo('lk', 22, 10, { run: true }); s.walkTo('xy', 21, 10, { run: true }); await s.walkTo('sj', 23, 10, { run: true });
      WM.data.clear(s, ['houjian', 'lk', 'xy', 'sj']);
      await s.battle('ch9_wuwei', { bg: 'night', music: 'boss' });
      // dragged back from the river landing, where he had run for a boat
      s.spawn('sj', 'songjiang', 21, 12, 'up'); s.spawn('xy', 'xueyong', 24, 12, 'up');
      s.spawn('hw', 'huangwenbing', 22, 8, 'down'); s.spawn('lk', 'likui', 23, 8, 'down');
      s.walkTo('lk', 23, 10); await s.walkTo('hw', 22, 10);
      s.face('player', 'up'); s.faceEach('sj', 'hw');
      await s.narrate('Huang Wenbing had run for the river and a boat, and was caught on the landing.');
      await s.emote('hw', 'sweat', 1);
      await s.say('huangwenbing:shock', 'Mercy! Mercy, good sirs! I only did my duty as a servant of the court!');
      await s.say('songjiang:angry', 'Your duty? You have no post. You read a drunk man\'s poem on a tavern wall, and ran to the prefect with it, to buy your way back into office with my head. How many others have you ruined so?');
      await s.say('huangwenbing:sad', 'I... I...');
      await s.say('chaogai', 'Brothers, you have heard him. What is the sentence?');
      await s.say('likui:angry', 'Leave it to me!');
      s.sfx('slash'); await s.flash(); s.lie('hw'); await s.shake(4, 0.3);
      // and his house goes up in flames
      await s.say('songjiang', 'Burn his house. But not a single torch near his brother\'s gate — Huang Wenye is a good man.');
      s.music('tense'); s.tint('fire');
      s.flames(17, 2, 3, 3); await s.wait(0.4); s.flames(21, 2, 4, 3); await s.wait(0.4); s.flames(26, 2, 3, 3);
      s.face('player', 'up'); s.face('sj', 'up'); s.face('xy', 'up'); s.face('lk', 'up');
      await s.narrate('The house was burned. His brother\'s family, who had always been kind to the poor, was left untouched.');
      await s.fadeOut(1);
      s.flames(); s.tint('burnt'); s.night(false);
      WM.data.clear(s, ['hw']);
      await s.fadeIn(1);
      await s.say('xueyong', 'Nothing left but ash and black beams. All Wuweijun will know by noon what became of Huang Wenbing.');
      s.flag('ch9_home');
      // on the road north, Huangmen Mountain: four chiefs come down to meet them
      await s.fadeOut(0.8);
      s.tint(null); WM.data.clear(s, ['xy']);
      s.place('player', 16, 11, 'right'); s.place('sj', 15, 11, 'right'); s.place('lk', 15, 12, 'right');
      await s.fadeIn(0.8);
      await s.narrate('Then they all set out for Liangshan together. On the way, at Huangmen Mountain, gongs sounded on the slope, and a band of men came down to bar the road.');
      s.spawn('op', 'oupeng', 33, 11, 'left'); s.spawn('jj', 'jiangjing', 33, 12, 'left'); s.spawn('ml', 'malin', 33, 10, 'left'); s.spawn('tz', 'taozongwang', 32, 12, 'left');
      s.walkTo('op', 20, 11); s.walkTo('jj', 21, 12); s.walkTo('ml', 21, 10); await s.walkTo('tz', 22, 11);
      await s.emote('lk', 'anger', 0.8);
      await s.say('oupeng', 'Halt! We are the chiefs of Huangmen Mountain. We heard that Song Jiang of Yuncheng was taken from the execution ground at Jiangzhou — is he with you?');
      s.faceEach('sj', 'op');
      await s.say('songjiang', 'I am Song Jiang.');
      await s.say('oupeng', 'Brother! I am Ou Peng, the Golden-Winged Eagle. This is Jiang Jing, the Divine Mathematician; Ma Lin, the Iron Flute Immortal; and Tao Zongwang, the Nine-Tailed Turtle. We meant to storm Jiangzhou ourselves to save you. Take us with you to Liangshan!');
      await s.say('jiangjing', 'I keep accounts better than any clerk in the empire, brother. An army needs one who can count.');
      await s.say('malin', 'And one to play it into battle.');
      await s.say('songjiang:smile', 'Welcome, brothers. There is room for all of you.');
      WM.data.clear(s, ['op', 'jj', 'ml', 'tz', 'sj', 'lk']);
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
