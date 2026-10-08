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
    name: 'The Banks of the Xunyang', goal: 'rout', turns: 10, music: 'war',
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
    await s.narrate('Song Jiang was sent south to Jiangzhou with two escorts, Zhang Qian and Li Wan. Near Liangshan, Liu Tang and a band of men stopped them on the road and brought Song Jiang across the water to Chao Gai.');
    await s.warp('zhugui', 9, 16, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[9].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 8; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong'].forEach(function (id) { S.recruit(id, 20); });
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'qingfeng', 'qingfengshan');
    await WM.data.chapters[9].begin(s);
  };

  // ---------------- the offer at Liangshan ----------------
  WM.defEvents('zhugui', [
    { id: 'ch9_offer', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 9; }, run: async function (s) {
      s.spawn('chaogai', 'chaogai', 11, 16, 'left'); s.spawn('wuyong', 'wuyong', 12, 16, 'left'); s.spawn('esc', 'escortzhang', 8, 18, 'up');
      await s.say('chaogai', 'Brother Song! Stay with us. Why go to Jiangzhou to be a convict? Take off that cangue, and take the first seat on Liangshan.');
      await s.say('songjiang:sad', 'Brother, my father ordered me home and told me to serve my sentence and live as an honest man. If I stay, I disobey my father and break the law — I would be unfilial and disloyal both. If you force me, I will cut my throat here before you.');
      await s.say('chaogai:sad', '...Then go. But we will not forget you.');
      await s.say('wuyong', 'At least take this. The superintendent of the Jiangzhou prison is an old friend of mine: Dai Zong, called the Magic Traveller. I have written to him. He will look after you.');
      s.despawn('chaogai'); s.despawn('wuyong'); s.despawn('esc');
      await s.narrate('So Song Jiang went on south with his escorts. After a long journey they crossed into Jiangzhou country, and climbed a steep ridge called Jieling. At the top was an inn.');
      s.flag('ch9_road');
      await s.warp('jieling', 1, 9, 'right');
    } }
  ]);

  // ---------------- Jieling Ridge ----------------
  WM.defEvents('jieling_in', [
    { id: 'ch9_lili', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_road'); }, run: async function (s) {
      s.spawn('lili', 'lili', 5, 4, 'down'); s.spawn('esc', 'escortzhang', 4, 5, 'right');
      await s.say('lili', 'Wine? Meat? Sit, sit, travellers. You look tired.');
      await s.narrate('The wine tasted strange. Before Song Jiang could set down the bowl, the room spun. He and both escorts slid to the floor.');
      s.lie('player'); s.lie('esc');
      await s.say('lili:smile', 'Three fat ones. And this one has silver in his bundle... "Song Jiang"? What\'s a letter to "Song Jiang" doing here?');
      s.spawn('lijun', 'lijun', 7, 6, 'up'); s.spawn('tongwei', 'tongwei', 8, 6, 'up'); s.spawn('tongmeng', 'tongmeng', 5, 6, 'up');
      await s.say('lijun', 'Brother Li! I\'ve been waiting on the ridge for days for Song Jiang of Yuncheng, who\'s being sent to Jiangzhou. Has a convict passed?');
      await s.say('lili:shock', '...Song Jiang? He\'s lying on my butchering floor!');
      await s.narrate('They poured the antidote into Song Jiang\'s mouth and propped him up. When he came round, four men were kneeling before him.');
      s.lie('player', false); s.lie('esc', false);
      await s.say('lijun', 'I am Li Jun, a boatman of the Xunyang, called the River Dragon. These are the Tong brothers, Tong Wei and Tong Meng, and this is Li Li, who keeps the inn. Forgive him — he nearly made dumplings of the most righteous man in the world.');
      await s.say('songjiang', 'No harm done. ...Though I\'d rather not eat here again.');
      s.despawn('lili'); s.despawn('esc'); s.despawn('lijun'); s.despawn('tongwei'); s.despawn('tongmeng');
      s.flag('ch9_jieyang');
      await s.narrate('Li Jun walked with them down the ridge, and they parted with promises. Song Jiang went on to Jieyang town, on the bank of the great river.');
      await s.warp('jieyang', 1, 8, 'right');
    } }
  ]);

  // ---------------- Jieyang ----------------
  WM.defEvents('jieyang', [
    { id: 'ch9_xueyong', x: 14, y: 9, w: 14, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_jieyang'); }, run: async function (s) {
      s.spawn('xueyong', 'xueyong', 20, 12, 'down'); s.spawn('c1', 'villager', 18, 13, 'right'); s.spawn('c2', 'woman', 22, 13, 'left');
      await s.say('xueyong', '...and now, good people, if you\'ve enjoyed the show, a few coppers for a poor performer and his medicine!');
      await s.narrate('No one in the crowd gave him anything. Song Jiang took out five taels of silver and gave it to him.');
      await s.say('xueyong:shock', 'Five taels! Sir, I am Xue Yong of Henan, called the Sick Tiger. Who are you, who gives so freely?');
      s.spawn('muchun', 'muchun', 26, 11, 'left');
      await s.say('muchun:angry', 'Who are you, convict, to throw silver around in Jieyang? This street-performer didn\'t pay his respects to the Mu family. Nobody was to give him a copper!');
      await s.say('songjiang', 'My silver is my own, sir.');
      await s.say('muchun:angry', 'Then let\'s see if your fists are your own too!');
      await s.battle('ch9_jieyang', { bg: 'town', canLose: true, rounds: 3 });
      await s.narrate('Xue Yong knocked Mu Chun into the dust, and Mu Chun ran off swearing vengeance. Song Jiang and the escorts hurried out of town before dark — but no inn would take them: the Mu brothers had sent word. At last, in the dark, they found a big manor and begged a night\'s lodging from a kind old man.');
      s.despawn('xueyong'); s.despawn('c1'); s.despawn('c2'); s.despawn('muchun');
      s.night(true);
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
      await s.narrate('Then Song Jiang wanted fresh fish soup, and Li Kui ran down to the river to get some — by grabbing it from the fishermen\'s boats. The fishermen ran for their master, the fish-broker of the river.');
      s.despawn('likui');
      await s.warp('jiangzhou', 27, 35, 'down');
      s.spawn('likui', 'likui', 26, 35, 'right'); s.spawn('zhangshun', 'zhangshun', 29, 35, 'left');
      await s.duel('likui_zhangshun_land', { hero: 'likui', canLose: true });
      await s.narrate('On land Li Kui pinned the fish-broker under his fists. But the white-skinned man broke away, jumped onto a boat, and taunted him until Li Kui, furious, leapt in after him. In the middle of the river the man tipped the boat over.');
      await s.duel('likui_zhangshun_water', { hero: 'likui', canLose: true });
      await s.narrate('Zhang Shun dragged Li Kui under the water again and again, until his eyes were white, then held him up for air, then dunked him again, while the whole riverbank roared with laughter.');
      await s.say('daizong', 'Zhang Shun! Stop! That\'s Li Kui — and this is Song Jiang!');
      await s.say('zhangshun:shock', '...Song Jiang? My brother Zhang Heng wrote to me about you!');
      await s.narrate('So Zhang Shun the White Streak in the Waves, and Li Kui the Black Whirlwind, became friends, though Li Kui would never again go near water if he could help it.');
      s.despawn('likui'); s.despawn('zhangshun');
      s.flag('ch9_poem');
      s.removeParty('daizong');
      await s.narrate('Some days later, Song Jiang went alone to the famous Xunyang Tower overlooking the river.');
      await s.say(null, '(The Xunyang Tower is in the north-east of the city.)');
    } }
  ]);
  WM.defEvents('jiangzhou_in', [
    { id: 'ch9_tower', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_poem') && WM.state.x >= 43 && WM.state.x <= 56; }, run: async function (s) {
      s.night(false);
      await s.narrate('Song Jiang sat by the window drinking alone, looking out over the great river. He thought of his age — past thirty, with no name and no achievement, a branded convict far from home, his father old and alone. He grew drunk, and sad, and angry. He called for a brush, and on the white wall wrote:');
      await s.narrate('"In youth I studied the classics and histories; grown, I learned strategy too. Like a tiger lying in a wild hill, I hide my claws and bear it. Ill fate has branded both my cheeks, and sent me to Jiangzhou. If one day I can avenge my wrongs, I will stain the mouth of the Xunyang with blood."');
      await s.narrate('And beneath it: "My heart is in Shandong, my body in Wu; I drift on the rivers and lakes, and sigh in vain. If one day I achieve my soaring ambition, I will laugh at Huang Chao for being less than a man." He signed it: "Written by Song Jiang of Yuncheng." Then he paid, staggered home, and forgot all about it.');
      s.flag('ch9_written');
      s.spawn('huang', 'huangwenbing', 49, 5, 'up');
      await s.narrate('The next day, a retired official named Huang Wenbing, of Wuweijun across the river, a jealous, scheming man always looking for a way back into office, climbed the tower to pass the time, and read the walls.');
      await s.say('huangwenbing:smile', '"...I will laugh at Huang Chao for being less than a man"? Huang Chao, the rebel who sacked the capital! This is a rebel\'s poem! "Song Jiang of Yuncheng"... And the children in the streets have been singing a rhyme: "The one who ruins the state is house-and-wood; the one who leads the troops is water-and-work; across thirty-six, rebellion in Shandong." House over wood is Song. Water beside work is Jiang. Song Jiang!');
      s.despawn('huang');
      await s.narrate('Huang Wenbing copied the poem and took it at once to the prefect, Cai Jiu — the ninth son of the Prime Minister Cai Jing. The prefect sent his guards for Song Jiang that very hour. Dai Zong ran ahead to warn him: "Brother, pretend to be mad!" So when the guards came, they found Song Jiang rolling in his own filth, shouting that he was the son-in-law of the Jade Emperor.');
      await s.narrate('It did not work. Huang Wenbing asked whether he had been mad when he arrived, and the camp clerks said no. Song Jiang was beaten until he confessed, and locked in a cangue in the condemned cell.');
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
      await s.narrate('Liangshan\'s men "invited" the scholar and the carver, and their families followed soon after. Xiao Rang wrote the letter in Cai Jing\'s hand, and Jin Dajian carved Cai Jing\'s seal. Dai Zong took it and ran back to Jiangzhou with his charms on his legs.');
      s.despawn('chaogai'); s.despawn('zhugui');
      await s.joinMany(['xiaorang', 'jindajian']);
      await s.say('wuyong:shock', '...Wait. Which seal did you put on the letter?');
      await s.say('jindajian', 'The one with his name and title: "Cai Jing, Hanlin Academician."');
      await s.say('wuyong:shock', 'Aiya! That is the seal for his public writings! No father writes to his own son under his name and title. The prefect will see it at once — Dai Zong is running to his death! Gather everyone! We go to Jiangzhou ourselves!');
      s.despawn('wuyong');
      s.flag('ch9_rescue');
      s.party(['chaogai', 'huarong', 'liutang', 'yanshun', 'ruanxiaoqi', 'lufang']);
      s.level('chaogai', 22); ['huarong', 'liutang', 'yanshun', 'ruanxiaoqi', 'lufang'].forEach(function (id) { s.level(id, 21); });
      s.setLeader('chaogai'); s.flag('protagonist', 'chaogai');
      S.restoreParty();
      await s.narrate('Huang Wenbing saw the flaw in the seal just as Wu Yong had feared. Dai Zong was beaten until he confessed that the letter came from Liangshan. The prefect sentenced him and Song Jiang to be beheaded together at the crossroads.');
      await s.narrate('On the day of the execution, crowds packed the square. Among them were snake-charmers, beggars, porters with their poles, and merchants with carts — all of them Liangshan men.');
      await s.warp('jiangzhou', 18, 32, 'up', { fade: 0.6 });
    } }
  ]);
  WM.defEvents('jiangzhou', [
    { id: 'ch9_execution', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch9_rescue'); }, run: async function (s) {
      s.spawn('sj', 'songjiang', 17, 28, 'down'); s.spawn('dz', 'daizong', 19, 28, 'down');
      s.spawn('ex1', 'executioner', 17, 27, 'down'); s.spawn('ex2', 'executioner', 19, 27, 'down');
      s.spawn('g1', 'soldier', 15, 29, 'right'); s.spawn('g2', 'soldier', 21, 29, 'left');
      s.music('tense');
      await s.say({ name: 'Officer' }, 'The third quarter of the noon hour! Execute the prisoners!');
      s.spawn('likui', 'likui', 24, 24, 'down');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('Before the executioners could raise their swords, a huge black man, stripped to the waist, leapt down from the roof of a teahouse with a battle-axe in each hand, roaring like thunder. He cut down the two executioners and charged into the guards.');
      s.despawn('ex1'); s.despawn('ex2');
      await s.say('chaogai', 'Now! Liangshan, now!');
      s.addParty('likui'); s.level('likui', 22);
      await s.battle('ch9_exec1', { bg: 'town', music: 'battle' });
      await s.battle('ch9_exec2', { bg: 'town', music: 'boss' });
      s.despawn('g1'); s.despawn('g2'); s.despawn('sj'); s.despawn('dz');
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
      s.spawn('sj', 'songjiang', 15, 9, 'down');
      await s.say('songjiang', 'Brothers... I owe you my life. All of you.');
      await s.say('likui', 'Brother! Let\'s go back and kill the prefect, and Huang Wenbing too!');
      s.despawn('sj');
      ['zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili'].forEach(function (id) { S.initChar(id, 20); });
      await s.war('ch9_river');
      await s.narrate('The Jiangzhou army broke and fled. That night, guided by Hou Jian — a tailor from Hongdu who worked in Huang Wenbing\'s house and was Xue Yong\'s pupil — they crossed the river to Wuweijun.');
      s.flag('ch9_wuwei');
      WM.unlock('wuweijun');
      await s.warp('wuweijun', 1, 11, 'right');
    } }
  ]);
  WM.defEvents('wuweijun', [
    { id: 'ch9_huang', x: 20, y: 9, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch9_wuwei'); }, run: async function (s) {
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
