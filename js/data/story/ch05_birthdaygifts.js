// Chapter 5 — "The Birthday Gifts" (novel chapters 14–20).
// Liu Tang and Lei Heng; Wu Yong wins the Ruan brothers; Gongsun Sheng and the seven stars; Yellow Earth Ridge;
// Yang Zhi, Lu Zhishen and Cao Zheng take Mount Erlong; Song Jiang's warning; the battle in the reeds of Shijie;
// Lin Chong kills Wang Lun; Liangshan becomes the stronghold of the heroes; Huang An's attack is broken.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('hetao', 'He Tao', { skin: '#e0a880', hairStyle: 'futou', beard: 'short', body: '#2a3a5a', trim: '#c8b890', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('laoduguan', 'Old Steward', { skin: '#e0a880', hair: '#c0c0b8', hairStyle: 'scarf', band: '#2a2a2a', beard: 'long', beardColor: '#d0d0c8', body: '#5a4a3a', trim: '#c8b890', eyes: 'narrow' }, { face: true });
  WM.npc('denglong', 'Deng Long', { skin: '#d8a070', hairStyle: 'bald', beard: 'full', body: '#3a2a2a', trim: '#8a3a2a', build: 'big', weapon: 'staff', face: 'square', eyes: 'fierce', fierce: true }, { face: true });
  WM.npc('huangan', 'Huang An', { skin: '#e0a880', hairStyle: 'helmet', helmColor: '#5a5a6a', tassel: '#c8302a', beard: 'short', body: '#3a3a5a', trim: '#d8b36a', face: 'square' }, { face: true });
  WM.npc('chaoservant', 'Chao Gai\'s Servant', { skin: '#d8a070', hairStyle: 'topknot', body: '#5a5a3a', trim: '#e8e0d0' }, { face: true });

  WM.npc('erlongguard', 'Gate Guard', { skin: '#d8a070', hairStyle: 'bald', beard: 'stubble', body: '#6a4a3a', trim: '#4a3a2a', weapon: 'staff' }, { face: true });

  WM.enemy('escort_soldier', 'Escort Soldier', 10, WM.hum(WM.enemyLooks.soldier), { exp: 90, range: 'M' });
  WM.enemy('denglong_boss', 'Deng Long', 14, WM.hum(WM.data.npcs.denglong.look), { hp: 3.4, atk: 1.1, exp: 320, gold: 200, boss: true, fx: 'blunt', drops: [['medicine', 2]], skills: [{ name: 'Gold-Eyed Tiger\'s Staff', chance: 0.25, type: 'phys', power: 1.6 }] });
  WM.enemy('erlong_monk', 'Erlong Bandit-Monk', 12, WM.hum(WM.enemyLooks.monkThug), { exp: 95, fx: 'blunt', drops: [['bun', 0.3]] });
  WM.data.troops.ch5_erlong = { enemies: ['erlong_monk', 'denglong_boss', 'erlong_monk'], bg: 'temple', boss: true };
  WM.data.troops.ch5_erlonggate = { enemies: ['erlong_monk', 'erlong_monk', 'roadarcher'], bg: 'mountain' };

  WM.data.duels.liutang_leiheng = {
    hero: 'liutang', foe: 'leiheng', bg: 'plains', heroHp: 360, heroAtk: 40, foeHp: 360, foeAtk: 40, drawAfter: 3,
    intro: [['foe:angry', 'You ungrateful dog! I spared you, and you chase me down the road?'], ['hero:angry', 'You squeezed ten taels out of my uncle! Give them back!']],
    lines: {
      attack: ['Hyah!', 'Take that, red-haired devil!', 'Here!'],
      wild: ['I\'ll leap the stream and land on your head!', 'All my strength!', 'Die!'],
      defend: ['Come on, then...', 'Hm, he\'s strong.', 'I\'m watching you.']
    },
    draw: [['wuyong', 'Stop! Stop, both of you! What is all this about?']]
  };

  // ---------------- wars ----------------
  WM.data.wars.ch5_shijie = {
    name: 'The Reeds of Shijie Village', goal: 'commander', turns: 10, music: 'war',
    map: [
      '....~~rr~~~~~~',
      '....~~~~~r~~~~',
      '.TT.~r~~~~~r~~',
      '....~~~~rr~~~~',
      '..m.~~r~~~~~r~',
      '....~~~~~~~~~~',
      '..T.~~rr~~~~~~'
    ],
    player: [
      { leader: 'chaogai', support: ['wuyong'], type: 'inf', x: 1, y: 3, commander: true },
      { leader: 'gongsunsheng', type: 'mage', x: 0, y: 2 },
      { leader: 'liutang', type: 'inf', x: 1, y: 5 },
      { leader: 'ruanxiaoer', type: 'naval', x: 4, y: 1 },
      { leader: 'ruanxiaowu', type: 'naval', x: 5, y: 3 },
      { leader: 'ruanxiaoqi', type: 'naval', x: 4, y: 5 }
    ],
    enemy: [
      { name: 'He Tao', portrait: 'hetao', type: 'naval', atk: 64, def: 56, x: 12, y: 3, commander: true },
      { name: 'Official Boats', type: 'naval', atk: 52, def: 44, x: 11, y: 1 },
      { name: 'Official Boats', type: 'naval', atk: 52, def: 44, x: 11, y: 5 },
      { name: 'Constables', type: 'naval', atk: 46, def: 40, x: 13, y: 4 },
      { name: 'Archer Boats', type: 'arch', atk: 48, def: 36, x: 13, y: 2 }
    ],
    intro: [['wuyong', 'He Tao has brought five hundred men in boats into the marsh. He doesn\'t know these waters. The Ruan brothers do.'], ['ruanxiaoqi:smile', 'Let them come into the reeds. We\'ll take them one boat at a time.'], [null, 'Victory: capture He Tao. Naval units (the Ruan brothers) can move through water.']],
    events: [{ turn: 3, run: async function (s, api) {
      await s.say('gongsunsheng', 'The wind is turning. Light the fire boats!');
      s.sfx('wind'); s.sfx('fire');
      await s.say(null, 'Gongsun Sheng raised a great wind from the south-east, and the fire boats drove into the official fleet. The enemy are thrown into confusion!');
      api.weaken('enemy', 0.75);
    } }],
    win: [['ruanxiaoqi', 'Got him! He Tao himself, dragged out of the water like a wet dog!']],
    lose: [['wuyong:sad', 'We must fall back...']]
  };
  WM.data.wars.ch5_huangan = {
    name: 'Huang An Attacks Liangshan', goal: 'commander', turns: 10, music: 'war',
    map: [
      '..TT~~~~~~~~~~',
      '....~~rr~~~~~~',
      '.m..B~~~~~r~~~',
      '....BB~~~~~~~~',
      '..T.~~r~~~rr~~',
      '....~~~~~~~~~~',
      '.m..~~~~rr~~~~'
    ],
    player: [
      { leader: 'chaogai', support: ['wuyong'], type: 'inf', x: 1, y: 3, commander: true },
      { leader: 'linchong', support: ['duqian'], type: 'cav', x: 2, y: 2 },
      { leader: 'liutang', support: ['songwan'], type: 'inf', x: 2, y: 4 },
      { leader: 'gongsunsheng', type: 'mage', x: 0, y: 4 },
      { leader: 'ruanxiaoer', type: 'naval', x: 5, y: 1 },
      { leader: 'ruanxiaowu', type: 'naval', x: 6, y: 3 },
      { leader: 'ruanxiaoqi', type: 'naval', x: 5, y: 5 }
    ],
    enemy: [
      { name: 'Huang An', portrait: 'huangan', type: 'naval', atk: 72, def: 64, x: 12, y: 3, commander: true },
      { name: 'Jizhou Boats', type: 'naval', atk: 60, def: 50, x: 11, y: 1 },
      { name: 'Jizhou Boats', type: 'naval', atk: 60, def: 50, x: 11, y: 5 },
      { name: 'Jizhou Archers', type: 'arch', atk: 56, def: 42, x: 13, y: 2 },
      { name: 'Jizhou Archers', type: 'arch', atk: 56, def: 42, x: 13, y: 4 },
      { name: 'Jizhou Boats', type: 'naval', atk: 60, def: 50, x: 10, y: 3 }
    ],
    intro: [['chaogai', 'The Jizhou prefect has sent Huang An with a thousand men in boats to take Liangshan.'], ['wuyong', 'Let them come into the narrows below the jetty. Brother Lin will hold the shore, and the Ruans will close behind them.'], [null, 'Victory: capture Huang An.']],
    win: [['liutang', 'Huang An is ours! The rest are swimming for their lives!']],
    lose: [['chaogai:sad', 'Back to the passes!']]
  };

  // ---------------- chapter start ----------------
  WM.data.chapters[5].begin = async function (s) {
    await s.chapter(5);
    s.party(['chaogai']); s.level('chaogai', 14); s.setLeader('chaogai');
    WM.state.chars.chaogai.equip.body = 'leather'; WM.state.chars.chaogai.equip.head = 'cap';
    s.flag('protagonist', 'chaogai');
    WM.unlock('dongxi', 'yuncheng');
    await s.narrate('In Yuncheng county of Jizhou prefecture, the new magistrate Shi Wenbin had two constables: Zhu Tong, the Lord of the Beautiful Beard, who led the mounted constables, and Lei Heng, the Winged Tiger, who led the foot. To be sure the patrols were really made, the magistrate ordered Lei Heng to bring him red leaves from the tree on the hill above East Creek village, where no one else could have picked them.');
    await s.narrate('Late one night, Lei Heng and his men passed the old Lingguan temple near East Creek village, and found the door open. On the altar table lay a big man, naked, fast asleep. Thinking him a thief, they tied him up, and since it was nearly dawn, Lei Heng decided to take him to the house of the headman of East Creek, Chao Gai, for breakfast.');
    await s.warp('dongxi', 15, 12, 'down', { noFade: true });
    await s.fadeIn(0.8);
  };
  WM.data.chapters[5].debugStart = async function (s) {
    S.newGame(); ['pro_done', 'ch1_done', 'ch2_done', 'ch3_done', 'ch4_done'].forEach(function (f) { s.flag(f); });
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng', 'boarforest', 'chaimanor', 'cangzhou', 'zhugui', 'daming');
    WM.state.flags.lsWangLun = true;
    s.level('linchong', 14); s.level('luzhishen', 14); s.level('yangzhi', 14);
    await WM.data.chapters[5].begin(s);
  };

  // ---------------- East Creek: Liu Tang and Lei Heng ----------------
  WM.defEvents('dongxi', [
    { id: 'ch5_liutang', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 5; }, run: async function (s) {
      s.spawn('liutang', 'liutang', 13, 14, 'right');
      s.spawn('serv', 'chaoservant', 17, 12, 'left');
      await s.say('chaoservant', 'Master, Constable Lei is at breakfast in the hall. He caught a thief in the temple and hung him in the gatehouse. That\'s him there.');
      await s.say('chaogai', '(A big man with a red birthmark on his face and red hair... no ordinary thief.)');
      s.despawn('serv');
      await s.move('player', 'L1');
      s.faceEach('player', 'liutang');
      await s.say('chaogai', 'Fellow, where are you from? Why did you come to our village?');
      await s.say('liutang', 'I\'m from far away. I came to find someone — a great hero, Chao Gai, the headman here. I have a fortune to bring him.');
      await s.say('chaogai', 'I am Chao Gai.');
      await s.say('liutang:shock', '...You?');
      await s.say('chaogai', 'Quiet. When I come back with the constable, call me "uncle." I will say you are my sister\'s son, Wang Xiaosan, who left home as a boy.');
      s.place('player', 15, 12, 'down');
      s.spawn('lei', 'leiheng', 15, 10, 'down');
      await s.move('lei', 'D1');
      await s.say('leiheng', 'Many thanks for breakfast, Headman. Now I\'ll take my thief to the county.');
      await s.say('liutang', 'Uncle! Uncle, save me!');
      await s.say('chaogai:shock', '...Wang Xiaosan? Is it you, nephew? Why are you here, you good-for-nothing? You left home ten years ago, and now you turn up as a thief in a temple?');
      await s.say('leiheng:shock', 'This is your nephew, Headman? ...Then I am sorry. I didn\'t know. Untie him!');
      await s.narrate('Chao Gai gave Lei Heng ten taels of silver "for the trouble," and Lei Heng and his men went off to the county. But Liu Tang, the moment he was free, snatched up a halberd and ran after them.');
      s.despawn('lei', { leave: true });
      s.despawn('liutang', { leave: true });
      await s.duel('liutang_leiheng', { hero: 'liutang', canLose: true });
      await s.narrate('The two fought fifty bouts on the road, and neither could win, until a man in a scholar\'s gown came out of a schoolhouse by the bridge and held them apart with a pair of copper chains. This was the village schoolmaster, Wu Yong, the Resourceful Star — a friend of Chao Gai from childhood. Then Chao Gai came running, scolded his "nephew," and Lei Heng went off cursing.');
      s.flag('ch5_wuyong');
      await s.warp('dongxi_in', 10, 8, 'up', { noFade: true });
      s.spawn('liutang', 'liutang', 8, 5, 'right'); s.spawn('wuyong', 'wuyong', 12, 5, 'left');
      await s.say('liutang', 'Brother Chao, I came to tell you something. Liang Zhongshu, the governor of Daming, is sending a hundred thousand strings\' worth of gold and pearls to his father-in-law Cai Jing for his birthday. It will pass along this road. That money was squeezed from the people. Taking it is no sin.');
      await s.say('chaogai', 'Last night I dreamed that the seven stars of the Dipper fell on my roof, and a little white star flew off by itself. I wonder...');
      await s.say('wuyong', 'This can\'t be done with three men, nor with three thousand. It needs seven or eight good men — no more. I know three: the Ruan brothers of Shijie village, fishermen, fearless, as loyal as they come. Let me go and win them over.');
      await s.say('chaogai', 'Go, then, Professor.');
      s.despawn('liutang', { leave: true }); s.despawn('wuyong', { leave: true });
      s.party(['wuyong']); s.level('wuyong', 13); s.setLeader('wuyong');
      WM.state.chars.wuyong.equip.body = 'robe';
      WM.unlock('shijie');
      s.flag('ch5_toshijie');
      await s.narrate('That same night Wu Yong set out, and walked through the dark, and by morning he had reached Shijie village, on the edge of the great marsh, east of East Creek.');
    } }
  ]);

  // ---------------- Shijie: the Ruan brothers ----------------
  WM.defEvents('shijie', [
    { id: 'ch5_ruans', x: 2, y: 6, w: 4, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_toshijie'); }, run: async function (s) {
      s.spawn('r2', 'ruanxiaoer', 3, 7, 'up');
      await s.say('ruanxiaoer:smile', 'Professor Wu! What wind brings you here?');
      await s.say('wuyong', 'I\'m teaching at a rich man\'s house now. He needs a dozen big golden carp for a feast, fourteen or fifteen catties each, and I came to buy them from you.');
      await s.say('ruanxiaoer', 'Carp that size? Not these days. Let\'s find my brothers, and drink, and I\'ll tell you why.');
      s.spawn('r7', 'ruanxiaoqi', 12, 12, 'left'); s.boat('r7'); s.spawn('r5', 'ruanxiaowu', 8, 12, 'left');   // Xiaoqi punting out of the reeds; Xiaowu back from the gambling den
      await s.narrate('Ruan Xiaoer took a boat, and they rowed out among the reeds, calling for the others. Ruan Xiaoqi came punting out of the reeds singing, and they found Ruan Xiaowu coming back from the gambling den, his shirt open on the leopard tattooed on his chest. The four went to a tavern built on stilts over the water.');
      s.despawn('r2', { leave: true }); s.despawn('r5', { leave: true }); s.despawn('r7', { leave: true });
      await s.warp('shijie_in', 25, 6, 'up');
      s.spawn('r2', 'ruanxiaoer', 24, 6, 'right'); s.spawn('r5', 'ruanxiaowu', 26, 5, 'left'); s.spawn('r7', 'ruanxiaoqi', 25, 3, 'down');
      await s.say('ruanxiaowu', 'Big carp? They\'re all out in the deep water of Liangshan Marsh, and we can\'t go there.');
      await s.say('wuyong', 'Why not? The marsh is wide. Who could stop you?');
      await s.say('ruanxiaoqi:angry', 'The bandits. A failed scholar called Wang Lun has five or seven hundred men up there now. They don\'t let anyone fish their waters. We\'ve had to put away our nets.');
      await s.say('wuyong', 'Then the officials will deal with them soon enough.');
      await s.say('ruanxiaowu:angry', 'The officials! When the officials come, they\'re worse than the bandits. They go through the villages taking pigs and chickens. They don\'t dare go near the bandits.');
      await s.say('ruanxiaoqi', 'Those bandits on the mountain, though... they don\'t fear Heaven or the government. They divide gold and silver by the measure, wear silk and satin, and eat meat by the joint. We\'re as good fighters as any of them. If anyone would lead us, we\'d go.');
      await s.say('wuyong', '...If someone did ask you, would you really go?');
      await s.say('ruanxiaoer', 'If a man would treat us as brothers, we\'d follow him through fire and water.');
      await s.narrate('Then Wu Yong told them the truth: of Liu Tang\'s news, of Chao Gai\'s dream, of the birthday gifts. The three brothers leapt up, and Ruan Xiaoqi slapped his neck. "This blood of mine will sell itself to anyone who knows its worth!" They swore to follow Chao Gai to the end.');
      s.despawn('r2'); s.despawn('r5'); s.despawn('r7');
      s.addParty('ruanxiaoer'); s.addParty('ruanxiaowu'); s.addParty('ruanxiaoqi');
      s.level('ruanxiaoer', 12); s.level('ruanxiaowu', 12); s.level('ruanxiaoqi', 12);
      s.flag('ch5_ruansjoin');
      await s.notice('The Ruan brothers joined the party.', { auto: 1.6 });
      await s.narrate('Next morning the four set off together for East Creek village.');
    } }
  ]);

  // ---------------- back at East Creek: Gongsun Sheng and the oath ----------------
  WM.defEvents('dongxi', [
    { id: 'ch5_gongsun', x: 14, y: 15, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_ruansjoin'); }, run: async function (s) {
      s.spawn('gss', 'gongsunsheng', 15, 13, 'down'); s.spawn('sv1', 'chaoservant', 14, 13, 'right'); s.spawn('sv2', 'chaoservant', 16, 13, 'left');
      s.spawn('chaogai', 'chaogai', 15, 11, 'down');
      await s.say('chaoservant', 'You can\'t come in! The master is busy!');
      await s.narrate('A Daoist with a crown on his head and a sword on his back was standing in the gateway, knocking down ten servants one after another.');
      await s.move('chaogai', 'D1');
      await s.say('chaogai', 'Stop! Who are you, Reverend, to come to my gate and beat my servants?');
      await s.say('gongsunsheng', 'I am Gongsun Sheng of Jizhou in the north. I have studied the arts of wind and rain since my youth, and they call me Dragon Entering the Clouds. I have come with a fortune worth a hundred thousand strings, as a gift to the headman — if he dares to take it.');
      await s.say('wuyong:smile', '"A fortune worth a hundred thousand strings"? Come inside, Reverend. You are not the only one who has heard of it.');
      s.despawn('sv1'); s.despawn('sv2');
      await s.warp('dongxi_in', 10, 8, 'up');
      s.spawn('chaogai', 'chaogai', 10, 4, 'down'); s.spawn('gss', 'gongsunsheng', 8, 6, 'right'); s.spawn('liutang', 'liutang', 12, 6, 'left');
      s.spawn('r2', 'ruanxiaoer', 6, 7, 'right'); s.spawn('r5', 'ruanxiaowu', 14, 7, 'left'); s.spawn('r7', 'ruanxiaoqi', 13, 8, 'up');
      await s.say('chaogai', 'Seven stars of the Dipper fell on my roof. Now there are seven of us. It is Heaven\'s will.');
      await s.say('wuyong', 'And the little white star that flew off — near Yellow Earth Ridge, at Anle village, lives a man called Bai Sheng, the Daylight Rat. A gambler, but a sharp one. He will be our eighth.');
      await s.say('wuyong', 'Here is the plan. We will be seven date merchants pushing carts, resting in the shade on top of Yellow Earth Ridge. Bai Sheng will come by selling wine. We will win their escort without lifting a weapon — with this.');
      await s.say('liutang', 'The knockout drug?');
      await s.say('wuyong:smile', 'The knockout drug.');
      await s.narrate('So the seven burned incense and swore brotherhood before heaven and earth: Chao Gai, Wu Yong, Gongsun Sheng, Liu Tang, and the three Ruans. Chao Gai was their leader.');
      s.despawn('chaogai'); s.despawn('gss'); s.despawn('liutang'); s.despawn('r2'); s.despawn('r5'); s.despawn('r7');
      s.flag('ch5_oath');
      // switch to Yang Zhi on the road
      await s.fadeOut(1);
      await s.narrate('On the fifteenth of the fifth month, Yang Zhi set out from Daming with eleven soldiers disguised as porters, the old steward of Madam Cai\'s household, and two officers. They carried the birthday gifts on shoulder-poles, in eleven loads.');
      s.party(['yangzhi']); s.setLeader('yangzhi'); s.level('yangzhi', 15);
      s.flag('protagonist', 'yangzhi');
      s.flag('ch5_escort');
      WM.unlock('huangni');
      await s.warp('huangni', 2, 12, 'right', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);

  // ---------------- Yellow Earth Ridge ----------------
  WM.defEvents('huangni', [
    { id: 'ch5_heat', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_escort'); }, run: async function (s) {
      s.spawn('steward', 'laoduguan', 1, 13, 'right'); s.spawn('s1', 'soldier', 0, 12, 'right'); s.spawn('s2', 'soldier', 0, 13, 'right');
      await s.narrate('It was the hottest time of the year. Yang Zhi made them start late and stop early at first. But once they came to the mountains, where the bandits were, he drove them on through the burning midday, beating any man who lagged.');
      await s.say('soldier', 'We\'re carrying a hundred catties each in this heat! Even the dogs lie in the shade!');
      await s.say('laoduguan', 'Officer Yang, have pity on the men. You don\'t rank so high that you can drive them like oxen.');
      await s.say('yangzhi:angry', 'You don\'t know these roads. This is bandit country. Keep moving!');
      s.despawn('steward'); s.despawn('s1'); s.despawn('s2');
      await s.say(null, '(Lead the escort over the ridge. The pine grove at the crest offers shade.)');
    } },
    { id: 'ch5_ridge', x: 19, y: 7, w: 7, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_escort'); }, idle: { steward: 'You drive these men too hard, Officer Yang. The Governor\'s lady would not want them to die on the road.', s1: 'Officer Yang, the sun is splitting the stones. Only a little rest in the shade...', s2: '(The soldier groans under his carrying pole and does not look up.)', s3: 'Bandits, bandits! He beats us with his rattan and shouts about bandits. I\'ve seen nothing but dust.' },
      run: async function (s) {
      s.music('tense');
      s.spawn('steward', 'laoduguan', 20, 9, 'up'); s.spawn('s1', 'soldier', 21, 10, 'up'); s.spawn('s2', 'soldier', 23, 10, 'up'); s.spawn('s3', 'soldier', 19, 10, 'right');
      await s.narrate('At noon they reached the top of Yellow Earth Ridge. The soldiers dropped their loads and threw themselves down in the shade of the pines, and no amount of beating would make them get up.');
      await s.say('yangzhi:angry', 'Up! This is the worst place on the whole road — Yellow Earth Ridge! Bandits rob here in broad daylight!');
      await s.say('laoduguan:angry', 'Let them rest, Officer Yang! You\'re always talking of bandits. Where are they?');
      s.spawn('m1', 'chaogai', 24, 6, 'down'); s.spawn('m2', 'liutang', 24, 7, 'left'); s.spawn('m3', 'ruanxiaoqi', 23, 6, 'down');
      await s.emote('player', '!');
      await s.say('yangzhi:angry', 'You see? There\'s someone watching us in the trees! Who are you?');
      await s.say('chaogai', 'Who are you, then? We\'re seven brothers from Haozhou, taking dates to the capital to sell. We stopped here to rest in the shade. We heard there were robbers on this ridge, and when we saw you, we were afraid you were the robbers!');
      await s.say('yangzhi', '...Small traders. Very well.');
      s.spawn('bai', 'baisheng', 14, 12, 'right');
      await s.say('baisheng', '(singing) "The sun burns down like fire, and scorches all the grain; the farmers\' hearts are boiling, the young lords fan in vain..."');
      await s.move('bai', 'R6 U2');
      await s.say('soldier', 'What\'s in those buckets?');
      await s.say('baisheng', 'White wine. Five strings a bucket.');
      await s.say('soldier', 'Let\'s buy some! We\'re dying of thirst!');
      await s.say('yangzhi:angry', 'Don\'t touch it! Strangers\' wine on a bandit road — how many travellers have been drugged that way?');
      await s.say('baisheng:angry', 'Drugged? Who says my wine\'s drugged? I wasn\'t going to sell to you anyway!');
      await s.say('chaogai', 'We\'ll buy a bucket! We\'re thirsty too.');
      await s.narrate('The seven "date merchants" bought a bucket, and drank it all with their own ladles, laughing. When it was gone, one of them took a ladle of the second bucket — and the wine-seller snatched it away and poured it back. "No more for free!"');
      await s.say('laoduguan', 'They drank a whole bucket and nothing happened to them. Officer Yang, let the men buy the other. Your suspicions shame us all.');
      await s.say('yangzhi', '(They drank from the same wine and nothing happened... and I saw him pour the ladle back myself.) ...Very well. Buy it, then.');
      await s.narrate('The soldiers bought the second bucket, and shared it out; the old steward drank, and the officers, and in the end Yang Zhi, hot and tired, drank half a bowl himself.');
      s.sfx('wind');
      await s.say(null, 'Falling... falling...');
      await s.say('chaogai:smile', '(laughing) Down you go! Down you go!');
      s.lie('steward'); s.lie('s1'); s.lie('s2'); s.lie('s3'); s.lie('player');
      await s.fadeOut(1.5);
      await s.narrate('The soldiers fell one after another. Yang Zhi could see, but he could not move a finger. The seven merchants tipped the dates out of their carts, loaded the eleven packs of gold and pearls in their place, covered them with the dates, and pushed the carts away down the ridge.');
      await s.narrate('How was it done? The first bucket was clean. While the soldiers watched, Wu Yong took a ladle from the second bucket — and the drug was in the ladle. When Bai Sheng snatched it back and poured it in, the drug went with it. This is what the storytellers call "Seizing the Birthday Gifts by Guile."');
      s.despawn('m1', { leave: true }); s.despawn('m2', { leave: true }); s.despawn('m3', { leave: true }); s.despawn('bai', { leave: true }); s.despawn('steward', { leave: true }); s.despawn('s1', { leave: true }); s.despawn('s2', { leave: true }); s.despawn('s3', { leave: true });
      s.lie('player', false);
      s.flag('ch5_gifts');
      await s.fadeIn(1);
      await s.say('yangzhi:sad', '...Gone. All of it. I\'ve lost the birthday gifts. How can I go back to Liang Zhongshu now? I have no home, no country... I might as well throw myself off this ridge.');
      await s.say('yangzhi:sad', '...No. My father and mother gave me this body. I am not finished yet. I\'ll wander the rivers and lakes, and see what fate has left for me.');
      await s.narrate('The soldiers, when they woke, agreed to tell the governor that Yang Zhi had plotted with the robbers. Yang Zhi had already gone, south, with nothing but his sabre.');
      WM.unlock('erlong');
      await s.narrate('He came to a village inn and ate without paying, fought the innkeeper — and found that the innkeeper was Cao Zheng, a butcher who had learned his art from none other than Lin Chong. Cao Zheng told him of a temple stronghold on Mount Erlong, nearby in Qingzhou, held by a renegade monk called Deng Long. And on the road there, Yang Zhi met a monk with a staff of iron, who had been turned away from Mount Erlong and had kicked Deng Long in the belly for it. It was Lu Zhishen.');
      s.addParty('luzhishen'); s.addParty('caozheng');
      s.level('luzhishen', Math.max(15, WM.state.chars.luzhishen.lv)); s.level('caozheng', 13);
      s.flag('ch5_toerlong');
      await s.warp('erlong', 15, 33, 'up');
    } }
  ]);

  // ---------------- Mount Erlong ----------------
  WM.defEvents('erlong', [
    { id: 'ch5_erlongplan', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_toerlong'); }, run: async function (s) {
      await s.say('luzhishen', 'So you\'re Yang Zhi, who fought my brother Lin Chong to a standstill! Good. That cur Deng Long shut his gate on me and won\'t come down. The pass is too steep to storm.');
      await s.say('caozheng', 'I have an idea. Brother Lu, take off your robe and let us tie you up with a slip-knot. I\'ll tell them I caught the monk who kicked their chief, drugged in my inn. They\'ll open the gate to take you — and once you\'re inside...');
      await s.say('luzhishen:smile', 'Ha! Then I\'ll undo the knot and give Deng Long a staff to the skull!');
    } },
    { id: 'ch5_erlonggate', x: 13, y: 14, w: 6, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_toerlong'); }, run: async function (s) {
      await s.say('caozheng', 'Open up! We\'ve brought the monk who kicked your chief!');
      await s.say('erlongguard:smile', 'Ha! Bring him in, bring him in! The chief will skin him alive!');
      await s.narrate('The gate swung open. They passed three gates and came into the courtyard of the Baozhu Temple. Deng Long sat in the hall in a tiger-skin chair.');
      s.flag('ch5_erlonginside');
    } }
  ]);
  WM.defEvents('erlong_in', [
    { id: 'ch5_denglong', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_erlonginside'); }, run: async function (s) {
      s.spawn('deng', 'denglong', 9, 4, 'down');
      await s.say('denglong:smile', 'So, you bald thief! The one who kicked me! Tie him to a pillar and —');
      s.sfx('crit'); await s.shake(5, 0.4);
      await s.narrate('Lu Zhishen shook off the ropes, snatched his staff from Cao Zheng\'s hands, and leapt at Deng Long.');
      await s.battle('ch5_erlong', { bg: 'temple', music: 'boss' });
      await s.narrate('Deng Long fell to Lu Zhishen\'s staff. The bandit-monks of the temple knelt and surrendered. Lu Zhishen and Yang Zhi became the chiefs of Mount Erlong, and Cao Zheng went home to his inn.');
      s.despawn('deng', { leave: true });
      s.removeParty('luzhishen'); s.removeParty('caozheng');
      s.flag('ch5_erlongtaken');
      // He Tao's investigation and Song Jiang's warning
      await s.fadeOut(1);
      await s.narrate('When the news reached Daming, Liang Zhongshu was furious, and Cai Jing in the capital more so. The prefect of Jizhou was told to find the thieves within ten days or be exiled to the far south himself. The task fell to his chief inspector, He Tao.');
      await s.narrate('He Tao\'s brother, a gambler, happened to remember a night at an inn near Yellow Earth Ridge, when seven date merchants had passed through, led by a man he recognised: the headman of East Creek village. And he knew Bai Sheng, the Daylight Rat, who had suddenly started gambling with gold. Bai Sheng was arrested, beaten, and confessed.');
      await s.narrate('With the warrant for Chao Gai in his hand, He Tao rode at once to Yuncheng. It was noon. The magistrate was resting. He sat down in the teahouse opposite the county office, to wait — and the county clerk who came out to greet him was Song Jiang.');
      s.party(['songjiang']); s.level('songjiang', 12); s.setLeader('songjiang');
      WM.state.chars.songjiang.equip.body = 'robe'; WM.state.chars.songjiang.equip.head = 'cap';
      s.flag('protagonist', 'songjiang');
      s.flag('ch5_hetao');
      await s.warp('yuncheng_in', 23, 6, 'up', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);

  // ---------------- Yuncheng: Song Jiang's warning ----------------
  WM.defEvents('yuncheng_in', [
    { id: 'ch5_teahouse', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_hetao') && WM.state.x >= 18 && WM.state.x <= 27; }, run: async function (s) {
      s.spawn('hetao', 'hetao', 23, 5, 'down');
      await s.narrate('Song Jiang was a clerk of the Yuncheng county office: short and dark-skinned, filial to his father, generous with his money to anyone in need. Throughout Shandong and Hebei he was known as "Timely Rain," because, like rain in a drought, he came to the help of those in trouble.');
      await s.say('hetao', 'Clerk Song, I am He Tao, inspector of the Jizhou prefecture. I have urgent business for the magistrate — a warrant for seven robbers of the birthday gifts. The ringleader lives in your county: Chao Gai, headman of East Creek village.');
      await s.say('songjiang:shock', '(Chao Gai! My sworn brother! If they take him, he\'s a dead man.)');
      await s.say('songjiang', 'Chao Gai? That villain! The whole county has been cursing him. Inspector, the magistrate is resting after the morning session. Have some tea and wait; when he comes out I\'ll take you to him myself. I have a small matter at home to see to first.');
      await s.say('hetao', 'Thank you, Clerk Song. I\'ll wait.');
      s.despawn('hetao');
      s.flag('ch5_warn');
      await s.say(null, '(Song Jiang must ride to East Creek village before the magistrate wakes. Leave town to the east, then south.)');
    } }
  ]);
  WM.defEvents('dongxi', [
    { id: 'ch5_warned', x: 14, y: 15, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_warn'); }, run: async function (s) {
      s.spawn('chaogai', 'chaogai', 15, 13, 'down');
      await s.say('chaogai', 'Brother Song! Why are you riding so hard in this heat?');
      await s.say('songjiang:concerned', 'Brother, there\'s no time. The birthday gifts — Bai Sheng has confessed. He Tao is sitting in the teahouse in town with a warrant for you, waiting for the magistrate. I\'ve delayed him as long as I can. Go! Go now, all of you!');
      await s.say('chaogai:shock', '...Brother, I will never forget this.');
      await s.say('songjiang', 'Don\'t waste time with thanks. Run!');
      s.despawn('chaogai', { leave: true });
      await s.narrate('Song Jiang rode back to town and took He Tao to the magistrate as if nothing had happened. The magistrate sent the constables Zhu Tong and Lei Heng with soldiers to East Creek that night.');
      await s.narrate('Both constables were Chao Gai\'s friends. Zhu Tong took the back gate, where he knew Chao Gai would come out, and let him through, shouting and waving his sword at empty air, and even pretended to stumble so the soldiers would fall over him. Chao Gai and his men escaped into the night to Shijie village, and the manor was left empty.');
      s.flag('ch5_fled');
      s.party(['chaogai', 'wuyong', 'gongsunsheng', 'liutang', 'ruanxiaoer', 'ruanxiaowu']);
      s.addParty('ruanxiaoqi');
      WM.state.party = ['chaogai', 'liutang', 'ruanxiaoqi', 'wuyong', 'gongsunsheng', 'ruanxiaoer'];
      s.level('gongsunsheng', 14); s.level('liutang', 14);
      s.setLeader('chaogai');
      s.flag('protagonist', 'chaogai');
      s.heal();
      await s.warp('shijie', 3, 14, 'right');
    } }
  ]);

  // ---------------- Shijie: the battle in the reeds ----------------
  WM.defEvents('shijie', [
    { id: 'ch5_hetaowar', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_fled'); }, run: async function (s) {
      await s.narrate('He Tao followed them to Shijie village with five hundred soldiers and constables, and commandeered every boat on the shore. The Ruans had gone out into the marsh. He Tao\'s men rowed deep into the reeds after them, singing and shouting.');
      await s.war('ch5_shijie');
      await s.narrate('Every boat was burned or sunk. The soldiers who were not killed drowned in the mud. He Tao was dragged out of the water by Ruan Xiaoqi. They did not kill him: they cut off his ears and sent him back to the prefect as a message.');
      s.flag('ch5_hetaobeaten');
      await s.say('wuyong', 'Now there is no going back. Wang Lun\'s stronghold on Liangshan is the only place for us. Zhu Gui\'s tavern on the shore is the way in.');
      WM.unlock('zhugui');
    } }
  ]);
  WM.defEvents('zhugui_in', [
    { id: 'ch5_zhugui', x: 5, y: 5, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch5_hetaobeaten'); }, run: async function (s) {
      s.spawn('zhugui', 'zhugui', 8, 4, 'down');
      await s.say('zhugui:smile', 'Headman Chao! The whole of Shandong is talking of the birthday gifts — and the reeds of Shijie. You\'re welcome here. I\'ll take you across.');
      s.despawn('zhugui');
      s.flag('ch5_toliangshan');
      await s.warp('liangshan', 24, 40, 'up');
    } }
  ]);

  // ---------------- Liangshan: Wang Lun's last feast ----------------
  WM.defEvents('liangshan_in', [
    { id: 'ch5_feast', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch5_toliangshan') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('wanglun', 'wanglun', 15, 5, 'down'); s.spawn('lin', 'linchong', 11, 7, 'right'); s.spawn('duqian', 'duqian', 19, 6, 'left'); s.spawn('songwan', 'songwan', 19, 8, 'left'); s.spawn('zhugui', 'zhugui', 11, 9, 'right');
      s.spawn('wuyong', 'wuyong', 14, 9, 'up'); s.spawn('gss', 'gongsunsheng', 16, 9, 'up'); s.spawn('liutang', 'liutang', 13, 11, 'up'); s.spawn('r2', 'ruanxiaoer', 17, 11, 'up');
      s.place('player', 15, 9, 'up');
      await s.narrate('Wang Lun received them with a great feast. But when Chao Gai told him all their story, Wang Lun said little, and his face grew uneasy. Lin Chong watched him.');
      await s.say('wanglun:smile', 'Gentlemen, it is an honour. But our little stronghold is a pond too small for such dragons. Here are some bars of silver for each of you. Find a greater mountain than ours.');
      await s.say('chaogai', 'We came to ask for shelter, not silver. If you will not have us, we will go.');
      await s.say('wuyong:smile', '(quietly, to Lin Chong) Instructor, they say you were the fourth chief here, and that Wang Lun has never treated you as you deserve. Is that so?');
      await s.say('linchong:angry', '...Wang Lun! When I came, you would not have me unless I brought you a head. Now heroes like these come to us, and again you send them away with a handful of silver. You are jealous of every man better than yourself — a failed scholar with no ability. What right have you to lead Liangshan?');
      await s.say('wanglun:angry', 'Lin Chong! You are drunk! You dare to insult me before guests?');
      await s.say('linchong:angry', 'Jealous, narrow little man. You\'re not fit to lead anyone!');
      s.sfx('slash'); await s.shake(5, 0.5);
      await s.narrate('Lin Chong kicked the table over, drew a knife from his robe and seized Wang Lun. Wu Yong, Chao Gai and the others leapt up — as if to stop him — and stood between Wang Lun\'s men and the two of them. And Lin Chong killed Wang Lun there in the hall.');
      s.lie('wanglun');
      await s.say('linchong', 'I killed him for the sake of the brotherhood, not for any seat. Headman Chao is a man of honour, known to everyone. He shall be our chief. Whoever disagrees, step forward.');
      await s.say('duqian', 'We were only ever Wang Lun\'s men because there was no one better. Chief Chao — we follow you.');
      await s.say('chaogai', '...Brothers, I am a plain village headman. But if you will have me, I will not fail you.');
      await s.narrate('Chao Gai took the first seat. Wu Yong was second, as strategist; Gongsun Sheng third; Lin Chong fourth. Then Liu Tang, the three Ruan brothers, Du Qian, Song Wan, and Zhu Gui. And Liangshan became the stronghold of the heroes.');
      s.idle('songwan', 'Wang Lun was afraid of every man better than himself. Now Chao Gai sits in his chair, and I think this mountain will be the better for it.');
      s.idle('zhugui', 'I\'ll be back at my tavern on the shore tomorrow. Whoever wants to join Liangshan still comes past my door first.');
      s.despawn('lin'); s.despawn('duqian'); s.despawn('songwan'); s.despawn('zhugui'); s.despawn('wuyong'); s.despawn('gss'); s.despawn('liutang'); s.despawn('r2');
      s.unflag('lsWangLun');
      s.flag('castle');
      s.music('castle');
      await s.joinMany(['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui']);
      await s.narrate('THE STARS GATHER. From this day Liangshan is your stronghold. Heroes who join the cause will come to live here, and as their number grows, so will the fortress. Speak to a brother in the Assembly Hall to choose who rides out with you, and to read the Roll of Heroes.');
      s.flag('ch5_castle');
      s.level('linchong', Math.max(16, WM.state.chars.linchong.lv)); s.level('duqian', 12); s.level('songwan', 12); s.level('zhugui', 12);
      S.restoreAll();
    } },
    { id: 'ch5_huangan', x: 14, y: 6, char: 'wuyong', cond: function (S2) { return S2.has('ch5_castle') && !S2.has('ch5_huanganbeaten'); }, run: async function (s) {
      await s.say('wuyong', 'Brother Chao, our scouts say the Jizhou prefect has sent Commander Huang An with a thousand men and a fleet of boats to take Liangshan. They will be at the jetty soon.');
      var k = await s.ask('wuyong', 'Are the brothers ready?', ['To battle!', 'Wait — let me prepare first']);
      if (k !== 0) { await s.say('wuyong', 'Don\'t take too long. When you are ready, speak to me.'); return; }
      await s.war('ch5_huangan');
      await s.narrate('Huang An was taken in the reeds, and more than half his men drowned. From then on no official in Jizhou dared to attack Liangshan.');
      await s.narrate('Chao Gai sent men with silver to the Jizhou prison, to bribe the jailers. A few nights later Bai Sheng, the Daylight Rat, walked out of his cell and came to Liangshan.');
      s.flag('ch5_huanganbeaten');
      await s.join('baisheng');
      await s.say('chaogai', 'We have a home, and silver, and brothers. But we owe our lives to Song Jiang of Yuncheng, who rode through the heat to warn us — and to Zhu Tong and Lei Heng, who let us go. We must not forget them.');
      await s.say('liutang', 'Let me take him a letter, and a hundred taels of gold.');
      await s.say('wuyong:concerned', 'Go, then. But be careful in Yuncheng. Your face is on every wall.');
      s.flag('ch5_done');
      await s.endChapter();
      if (WM.data.chapters[6].begin) await WM.data.chapters[6].begin(s);
    } }
  ]);
})();
