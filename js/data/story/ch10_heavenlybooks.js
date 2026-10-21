// Chapter 10 — "The Heavenly Books" (novel chapters 42–43).
// Song Jiang, fleeing the constables, hides in the temple of the Mysterious Lady of the Ninth Heaven and receives
// the three Heavenly Books. Li Kui goes home for his mother; the false Li Kui; the four tigers of the Yi Ridge;
// Zhu Fu and Li Yun.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('jademaiden', 'Maiden in Blue', { skin: '#f6e2cc', hairStyle: 'woman', body: '#3a6ac8', trim: '#e8f0ff', dress: true, build: 'slim', face: 'narrow', pin: '#e8e8ff' }, { face: true });
  WM.npc('xuannu', 'Mysterious Lady of the Ninth Heaven', { skin: '#fbefe0', hairStyle: 'woman', hair: '#14101a', body: '#e8c860', trim: '#c83a3a', dress: true, build: 'slim', face: 'oval', eyes: 'narrow', pin: '#ffe080', flower: '#ff8040' }, { face: true });
  WM.npc('likuimother', 'Li Kui\'s Mother', { skin: '#c8905e', hair: '#c0c0b8', hairStyle: 'woman', body: '#5a4a3a', trim: '#8a6a4a', dress: true, eyes: 'narrow', face: 'round' }, { face: true });
  WM.npc('lida', 'Li Da', { skin: '#8a6a4a', hairStyle: 'headband', band: '#5a4a2a', body: '#5a4a3a', trim: '#3a2a1a', face: 'square' }, { face: true });
  WM.npc('ligui', 'Li Gui', { skin: '#5a4a3a', hairStyle: 'wild', hair: '#0e0a08', body: '#2a2a2a', trim: '#5a3a2a', weapon: 'axes', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('squirecao', 'Squire Cao', { skin: '#f0c49a', hairStyle: 'scarf', band: '#3a2a4a', beard: 'mustache', body: '#5a3a5a', trim: '#c8b890', face: 'round', eyes: 'narrow' }, { face: true });

  WM.enemy('zhao_constable', 'Yuncheng Constable', 22, WM.hum(WM.enemyLooks.constable), { exp: 95, drops: [['medicine', 0.12]] });
  WM.enemy('ligui_foe', 'Li Gui', 18, WM.hum(WM.data.npcs.ligui.look), { hp: 1.4, atk: 0.8, exp: 120, gold: 40 });
  WM.enemy('tiger_cub', 'Tiger Cub', 18, WM.beast('tiger', { body: '#e8b060' }), { hp: 0.7, atk: 0.7, spd: 1.3, exp: 120, gold: 0, fx: 'claw' });
  WM.enemy('yi_tiger', 'White-Browed Tiger', 24, WM.beast('tiger', { body: '#c87a2a' }), { hp: 1.5, atk: 0.75, spd: 1.1, exp: 500, gold: 0, boss: true, fx: 'claw', skills: [{ name: 'Pounce', chance: 0.3, type: 'phys', power: 1.5, fx: 'claw', sfx: 'roar' }, { name: 'Mountain Roar', chance: 0.15, type: 'magic', power: 14, status: 'sleep', statusChance: 0.3, sfx: 'roar', fx: 'dark' }] });
  var T = WM.data.troops;
  T.ch10_constables = { enemies: ['zhao_constable', 'zhao_constable', 'zhao_constable'], bg: 'night', noRun: true };
  T.ch10_ligui = { enemies: ['ligui_foe'], bg: 'forest', noRun: true };
  T.ch10_cave = { enemies: ['tiger_cub', 'tiger_cub'], bg: 'cave' };
  T.ch10_tiger = { enemies: ['yi_tiger'], bg: 'forest', boss: true };
  WM.data.duels.likui_liyun = {
    hero: 'likui', foe: 'liyun', bg: 'forest', heroHp: 420, heroAtk: 46, foeHp: 420, foeAtk: 44, drawAfter: 3,
    intro: [['foe:angry', 'Black Whirlwind! You won\'t get away from me twice!'], ['hero:angry', 'Green-eyed dog! Come here and get chopped!']],
    lines: { attack: ['Hyah!', 'Take that!', 'Here!'], wild: ['I\'ll take your head back to the magistrate!', 'All my strength!', 'Down!'], defend: ['He\'s a madman...', 'Steady...', 'Come on, then.'] },
    draw: [['zhufu', 'Stop! Master, stop! Brother Li Kui, stop!']]
  };

  WM.data.chapters[10].begin = async function (s) {
    await s.chapter(10);
    s.party(['songjiang']); s.level('songjiang', 22); s.setLeader('songjiang');
    s.flag('protagonist', 'songjiang');
    WM.unlock('huandao', 'songfarm', 'yishui');
    await s.narrate('Song Jiang could not rest on Liangshan while his old father was alone at home and the constables of Yuncheng watched the farm. One night he slipped away by himself to bring his father to the mountain.');
    s.night(true);
    await s.warp('songfarm', 15, 25, 'up', { noFade: true });
    await s.fadeIn(0.6);
    await s.walkTo('player', 15, 19);
    await s.say('songjiang', '(The gate... Father will be asleep. Quietly now.)');
    s.spawn('zn0', 'zhaoneng', 12, 17, 'right'); s.spawn('zd0', 'constable', 18, 17, 'left');
    await s.emote('player', '!');
    await s.say('zhaoneng', 'Song Jiang! We knew you\'d come home sooner or later! Brother Zhao De, get round behind him!', { top: true });
    await s.say('songjiang:shock', '(The Zhao brothers! They\'ve been lying in wait at the farm!)');
    s.moveTo('zn0', 14, 18, { run: true }); s.moveTo('zd0', 16, 18, { run: true });
    await s.move('player', 'D6', { run: true });
    s.hide('player');
    await s.walkTo('zn0', 15, 23, { run: true });
    await s.say('zhaoneng', 'After him! He\'s running for the hills!');
    await s.fadeOut(0.6);
    s.despawn('zn0'); s.despawn('zd0'); s.show('player');
    await s.warp('huandao', 15, 25, 'up', { noFade: true });
    await s.fadeIn(0.6);
    await s.move('player', 'U3', { run: true });
  };
  WM.data.chapters[10].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 9; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong', 'xiaorang', 'jindajian', 'songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang'].forEach(function (id) { S.recruit(id, 22); });
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou');
    await WM.data.chapters[10].begin(s);
  };

  // ---------------- Huandao: the Mysterious Lady ----------------
  WM.defEvents('huandao', [
    { id: 'ch10_chase', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 10; }, run: async function (s) {
      s.spawn('c1', 'zhaoneng', 15, 25, 'up'); s.spawn('c2', 'constable', 16, 25, 'up');
      await s.say('zhaoneng', 'He went into the village! Search every house! There\'s no way out of Huandao — the hills close it in on three sides!');
      s.face('player', 'down');
      await s.emote('player', 'sweat');
      await s.say('songjiang:sad', '(The village is a dead end. The only shelter is the old temple at the top of the slope...)');
      s.face('player', 'up');
      s.despawn('c1', { to: [1, 13] }); s.despawn('c2', { to: [23, 21] });
      await s.say(null, '(Run to the temple at the north of the village.)');
    } }
  ]);
  WM.defEvents('huandao_in', [
    { id: 'ch10_temple', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 10; }, run: async function (s) {
      await s.emote('player', '?');
      await s.say('songjiang', '(Empty... no priest, no lamp. Only the shrine cabinet behind the altar, with its curtain.)');
      await s.walkTo('player', 7, 5);
      s.face('player', 'up');
      await s.say('songjiang:sad', '(Forgive me, whatever spirit lives here. Hide me tonight.)');
      s.hide('player');
      await s.wait(0.6);
      s.spawn('c1', 'zhaoneng', 7, 9, 'up'); s.spawn('c2', 'constable', 6, 8, 'up');
      s.walkTo('c2', 5, 7); await s.walkTo('c1', 7, 7);
      await s.say('zhaoneng', 'Bring the torches here! Look in the shrine!');
      s.sfx('wind'); await s.shake(4, 0.6);
      await s.narrate('As the torch came near the curtain, a black wind rushed out of the cabinet, blew out every torch, and filled the temple with flying sand.');
      await s.emote('c2', '!'); await s.jump('c2');
      await s.say('constable:shock', 'The spirit of the temple is angry! Out, out!');
      s.sfx('wind'); s.shake(3, 0.4);
      s.walkTo('c2', 6, 8, { run: true }); await s.emote('c1', 'sweat');
      await s.say('zhaoneng', '...Guard the mouth of the village! He can\'t get out. We\'ll take him at dawn!');
      await s.walkTo('c1', 7, 9, { run: true });
      s.hide('c1'); s.hide('c2'); s.despawn('c1'); s.despawn('c2');
      await s.wait(0.8);
      await s.narrate('Song Jiang, trembling, sat in the dark cabinet. And then two maidens in blue robes stood before him, and bowed.');
      s.show('player');
      s.place('player', 7, 6, 'down');
      s.spawn('m1', 'jademaiden', 6, 7, 'up'); s.spawn('m2', 'jademaiden', 8, 7, 'up');
      await s.say('jademaiden', 'Star Lord, our Mistress invites you.');
      await s.say('songjiang', '..."Star Lord"? Your Mistress? Who is she?');
      await s.say('jademaiden', 'Come and see.');
      s.despawn('m1'); s.despawn('m2');
      s.night(false);
      await s.fadeOut(1, '#ffffff');
      await s.warp('xuannu', 11, 20, 'up', { noFade: true });
      s.spawn('lady', 'xuannu', 11, 5, 'down');
      s.spawn('m1', 'jademaiden', 9, 6, 'down'); s.spawn('m2', 'jademaiden', 13, 6, 'down');
      s.music('palace');
      await s.fadeIn(1);
      await s.move('player', 'U12');
      await s.say('xuannu', 'Star Lord Song. Do not be afraid. I am the Mysterious Lady of the Ninth Heaven.');
      await s.say('xuannu', 'I give you three volumes of the Heavenly Books. With them, act on Heaven\'s behalf. As leader, be loyal and righteous; as a minister, support the state and bring peace to the people; abandon what is crooked and return to what is upright. One day you will be raised to the heights.');
      await s.say('xuannu', 'And remember these four lines from Heaven: "Meet Su, and joy upon joy. Meet Gao, and it is no ill. Against foreign foes and rebels within, in many places you will win wondrous merit."');
      await s.say('xuannu', 'Your earthly karma is not yet fulfilled. The Jade Emperor punished you for a fault in your heart, and sent you down to the world below. When your work is done, you will return to the Purple Palace. Study these books only with the Resourceful Star of Heaven; let no one else see them. When your work is done, burn them, and leave nothing of them in the world. But if one day you sin and are sent down to Fengdu, even I will not be able to save you. Now go.');
      await s.give('heavenbook', 1);
      WM.state.chars.songjiang.tal.head = 'heavenbook';
      await s.notice('Song Jiang received the Heavenly Books.', { auto: 2.2 });
      s.despawn('lady'); s.despawn('m1'); s.despawn('m2');
      await s.fadeOut(1, '#ffffff');
      await s.warp('huandao_in', 7, 6, 'down', { noFade: true });
      s.music('tense');
      await s.fadeIn(1);
      await s.narrate('Song Jiang woke in the shrine cabinet with a start. It had been a dream — but in his sleeve were three scrolls bound in yellow silk, smelling of strange incense. Outside, it was dawn, and he heard shouting and the clash of weapons.');
      s.flag('ch10_books');
    } }
  ]);
  WM.defEvents('huandao', [
    { id: 'ch10_rescue', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_books'); }, run: async function (s) {
      s.night(false);
      s.spawn('likui', 'likui', 15, 18, 'up'); s.spawn('oupeng', 'oupeng', 14, 19, 'up');
      s.spawn('c1', 'zhaoneng', 15, 14, 'down');
      await s.say('zhaoneng:shock', 'Who are you — ?!');
      s.sfx('slash'); s.despawn('c1');
      await s.say('likui', 'Brother! Brother Song! Are you in there? That was Zhao Neng — one chop! Ou Peng and Tao Zongwang are at the gate, and Liu Tang, Shi Yong and Li Li are coming with more men!');
      s.addParty('likui'); s.addParty('oupeng'); s.level('likui', 23); s.level('oupeng', 22);
      s.despawn('likui'); s.despawn('oupeng');
      await s.battle('ch10_constables', { bg: 'night' });
      await s.say('songjiang', 'Iron Ox... Brothers. How did you know where to find me?');
      await s.say('oupeng', 'Lord Chao and Mister Wu sent us down the hill the moment you were missed, brother. They guessed where you\'d gone.');
      s.flag('ch10_back');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch10_hall', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_back') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('gss', 'gongsunsheng', 13, 7, 'right'); s.spawn('likui', 'likui', 18, 7, 'left'); s.spawn('chaogai', 'chaogai', 15, 5, 'down');
      s.spawn('tg', 'songtaigong', 15, 8, 'down'); s.spawn('sq', 'songqing', 14, 9, 'down'); s.spawn('dz', 'daizong', 17, 9, 'down');
      await s.walkTo('player', 15, 10);
      await s.emote('player', '!');
      await s.say('songjiang:shock', 'Father?! And Fourth Brother! You\'re here?');
      await s.say('daizong:smile', 'We went to the farm while the Zhao brothers were busy chasing you, brother. Du Qian, Song Wan, Wang Ying, Zheng Tianshou and the Tongs carried the Taigong out in a sedan chair. Not a constable saw us.');
      await s.say('songtaigong', 'My son. You need not slip away in the night for me any more.');
      await s.jump('player');
      await s.say('songjiang:sad', 'Father... your unworthy son has made you suffer so much. Brothers, I can never repay you for this.');
      await s.say('chaogai:smile', 'Repay? We are brothers. Now — Mister Wu tells me you came back with something in your sleeve.');
      await s.narrate('Song Jiang studied the Heavenly Books with Wu Yong alone, and told no one else what was in them.');
      s.despawn('tg'); s.despawn('sq'); s.despawn('dz');
      await s.join('songqing');
      await s.say('gongsunsheng', 'Brothers, seeing Song Jiang\'s father brought safely here, I think of my own mother in Jizhou, and of my master, Luo Zhenren. Let me go home to see them. I will return within a hundred days.');
      await s.say('chaogai', 'Go, then, and come back to us.');
      s.flag('away:gongsunsheng');
      s.removeParty('gongsunsheng');
      s.despawn('gss', { leave: true });
      s.music('sad');
      await s.say('likui:sad', '...Everybody\'s fetching their father, and their mother. My mother\'s in Yishui, carrying water and weaving straw sandals for my brother. I want to bring her here to live well too!');
      await s.say('songjiang', 'Brother, you are hot-headed, and the roads are watched. If you go, there are three things you must promise. Do not drink. Go alone, and quietly. And do not take your axes.');
      await s.say('likui', 'No wine — I promise. Alone — fine. My axes... all right. All right! I\'ll take a waist sabre and a pudao.');
      await s.say('songjiang', 'Then go, and come back quickly.');
      s.despawn('likui', { leave: true }); s.despawn('chaogai', { leave: true });
      s.spawn('zg', 'zhugui', 12, 10, 'right');
      await s.walkTo('zg', 14, 10);
      s.face('player', 'left');
      await s.say('songjiang', 'Brother Zhu Gui. Your younger brother Zhu Fu keeps a tavern in Yishui, doesn\'t he? Follow Iron Ox — quietly, so he doesn\'t know. If he gets into trouble, and he will, help him out of it.');
      await s.say('zhugui:smile', 'Ha! I\'ll leave within the hour. It\'s time I saw my brother anyway.');
      s.despawn('zg', { leave: true });
      s.party(['likui']); s.setLeader('likui'); s.level('likui', 23);
      WM.state.chars.likui.weapon = { name: 'Pudao', range: 'S', pow: 1.05 };
      s.flag('protagonist', 'likui');
      s.give('medicine', 3, true);
      s.flag('ch10_likui');
      await s.narrate('Li Kui set off for Yishui with a sabre at his waist and a pudao in his hand, and never knew that Zhu Gui was a day behind him on the road.');
      await s.say(null, '(Yishui lies to the east. Go home to Li Kui\'s mother.)');
    } }
  ]);

  // ---------------- Yishui ----------------
  WM.defEvents('yishui', [
    { id: 'ch10_ligui', x: 2, y: 26, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_likui'); }, idle: { ligui: '(A man with a blackened face crouches among the trees with two axes, waiting for travellers.)' },
      run: async function (s) {
      s.spawn('ligui', 'ligui', 9, 26, 'left');
      await s.say('ligui:angry', 'Halt! I am Li Kui, the Black Whirlwind! Leave your silver and go, or I\'ll chop you in two!');
      await s.say('likui:angry', '...What? Who did you say you were?');
      await s.battle('ch10_ligui', { bg: 'forest' });
      await s.say('ligui:sad', 'Mercy! Mercy! My real name is Li Gui. I use the Black Whirlwind\'s name because everyone is afraid of it. I have a mother of ninety at home and no one to feed her — that\'s why I rob! If you kill me, she\'ll starve!');
      await s.say('likui', '...A mother at home, eh? I\'ve come all this way to fetch my own mother. All right. Here — ten taels. Go home and become an honest man.');
      await s.say('ligui:smile', 'Heaven bless you, sir! Heaven bless you!');
      await s.walkTo('ligui', 20, 26, { run: true });
      s.hide('ligui');
      // a little way on: the cottage by the road
      await s.walkTo('player', 14, 26);
      s.face('player', 'up');
      await s.say('likui', '(My belly\'s growling like a tiger. That cottage — somebody\'ll sell me a bowl of rice.)');
      s.spawn('lgw', 'woman', 18, 25, 'left');
      await s.walkTo('lgw', 16, 26);
      await s.say('woman', 'Rice? ...I suppose I can cook you some. Wait here by the road, big fellow. It won\'t be long.');
      await s.walkTo('lgw', 18, 25); s.face('lgw', 'down');
      await s.say('likui', '(Can\'t sit still. I\'ll go round the back and wait in the shade.)');
      await s.walkTo('player', 18, 23); s.face('player', 'down');
      s.place('ligui', 22, 26, 'left'); s.show('ligui');
      await s.walkTo('ligui', 18, 26);
      s.face('lgw', 'down'); s.face('ligui', 'up');
      await s.say('woman', 'Back already? You\'re limping!');
      await s.say('ligui:smile', 'Wife, you won\'t believe it! I met the real Black Whirlwind on the road. He beat me flat — so I told him I had a mother of ninety at home to feed. And the great fool gave me ten taels! Ha! A mother of ninety!');
      await s.say('woman', 'Hush! Keep your voice down! There\'s a huge black fellow waiting on a meal round the front...');
      await s.emote('player', 'anger');
      await s.say('likui:angry', 'A MOTHER OF NINETY, eh?!');
      s.face('ligui', 'right'); s.face('lgw', 'right');
      await s.emote('ligui', '!');
      await s.walkTo('player', 19, 25, { run: true });
      await s.say('ligui:shock', 'Y-you —!', { top: true });
      s.sfx('slash'); await s.flash(); s.shake(3, 0.3);
      s.lie('ligui');
      await s.say('likui:angry', 'I spared you for your mother\'s sake, and there never was any mother!');
      await s.emote('lgw', '!');
      s.walkTo('lgw', 10, 20, { run: true });
      await s.say('woman:shock', 'Murder! Murder! Help!');
      s.hide('lgw'); s.despawn('lgw');
      await s.say('likui', '...Let her run. I\'ll cook my own rice.');
      s.hide('ligui'); s.despawn('ligui');
      s.flag('ch10_liguidone');
    } }
  ]);
  WM.defEvents('yishui_in', [
    { id: 'ch10_home', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_liguidone') && WM.state.map === 'yishui_in' && WM.state.x < 10; }, run: async function (s) {
      s.spawn('mother', 'likuimother', 4, 4, 'down');   // by her bed
      await s.say('likuimother', 'Who\'s there? ...Tie\'niu? Is that you, my son?');
      await s.say('likui:sad', 'Mother! It\'s me, Iron Ox! I\'ve come home!');
      await s.say('likuimother:sad', 'I\'ve cried my eyes blind for you, my son. Where have you been all these years?');
      await s.say('likui', 'I\'m an official now, Mother! I\'ve come to take you to live in comfort! I\'ll carry you on my back.');
      s.spawn('lida', 'lida', 6, 6, 'left');   // in at the door, beside Li Kui
      await s.say('lida:angry', 'Iron Ox! You killed a man and ran, and the county has hounded me ever since! Now there\'s a reward of three thousand strings for you. You\'re no official — you\'re a bandit! I\'m going to the squire!');
      s.despawn('lida');
      await s.say('likui', '(No time. Brother will bring the whole village.) Up you come, Mother. We\'re going over the Yi Ridge tonight.');
      s.despawn('mother', { leave: true });
      s.flag('ch10_carry');
      s.night(true);
      await s.narrate('Li Kui left a bar of silver on the bed for his brother, took his mother on his back, and went out into the night, up the path to the Yi Ridge.');
      await s.warp('yishui', 22, 25, 'up');
    } }
  ]);
  WM.defEvents('yishui', [
    { id: 'ch10_rock', x: 26, y: 8, w: 8, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_carry'); }, run: async function (s) {
      s.spawn('mother', 'likuimother', 28, 10, 'down');
      await s.say('likuimother', 'Son... I\'m so thirsty. Is there water?');
      await s.say('likui', 'Rest here on this rock, Mother. There\'s a stream down in the valley. I\'ll bring you some.');
      s.idle('mother', 'Tie\'niu? Back already? ...No? Go on, then, son. I\'ll sit here on the rock and wait for you.');
      s.heal();
      s.flag('ch10_water');
      await s.say(null, '(The stream is in the valley to the west.)');
    } },
    { id: 'ch10_stream', x: 14, y: 12, w: 6, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_water'); }, run: async function (s) {
      s.face('player', 'up');
      await s.say('likui', 'Water! ...And nothing to carry it in. Can\'t bring it to her in my hands.');
      await s.emote('player', '?');
      s.face('player', 'right');
      await s.say('likui', 'There — a little shrine up on the bank. The Great Sage of Sizhou. Begging your pardon, Great Sage.');
      await s.walkTo('player', 19, 11); s.face('player', 'up');
      s.sfx('hit'); await s.shake(3, 0.4);
      await s.say('likui', 'Hnngh... up she comes! A stone incense burner. That\'ll hold water.');
      await s.walkTo('player', 16, 13); s.face('player', 'up');
      s.sfx('splash'); await s.wait(0.6);
      await s.say('likui', 'Washed and full. Now back up the slope, slowly. Don\'t spill a drop.');
      WM.data.clear(s, ['mother']);   // while he was gone: nobody on the rock when he climbs back
      s.flag('ch10_back2');
    } },
    { id: 'ch10_gone', x: 26, y: 8, w: 8, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_back2'); }, run: async function (s) {
      s.music('sad');
      await s.say('likui:shock', 'Mother? Mother! Where are you?!');
      await s.narrate('The rock was empty. Thirty paces away, in the grass, there was blood, and a strand of grey hair. And from the hillside above came the sound of beasts, eating.');
      await s.say('likui:angry', 'I carried her all the way from home on my back... to feed her to you?!');
      s.flag('ch10_rage');
      await s.say(null, '(The cave is in the cliff to the north-east.)');
    } },
    { id: 'ch10_cave', x: 31, y: 4, w: 4, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_rage'); }, run: async function (s) {
      s.music('boss');
      var cb1 = s.spawnBeast('cub1', 'tiger', 34, 6, 'left'); cb1.scale = 0.55;
      var cb2 = s.spawnBeast('cub2', 'tiger', 32, 7, 'right'); cb2.scale = 0.55;
      await s.wait(0.5);
      await s.emote('player', 'anger');
      await s.say('likui:angry', 'Cubs... gnawing on... THAT\'S MY MOTHER\'S LEG!');
      await s.battle('ch10_cave', { bg: 'cave', music: 'boss' });
      s.hide('cub1'); s.hide('cub2'); s.despawn('cub1'); s.despawn('cub2');
      await s.walkTo('player', 34, 6); s.face('player', 'down');
      await s.say('likui', '(Two of you. Where there are cubs, there\'s a mother. I\'ll wait for her in here.)');
      s.hide('player');
      await s.wait(0.8);
      s.sfx('roar');
      var ts = s.spawnBeast('tigress', 'tiger', 32, 12, 'up', { body: '#d8a050' });
      await s.walkTo('tigress', 33, 7);
      s.face('tigress', 'right');
      await s.wait(0.4);
      s.show('player'); s.place('player', 34, 6, 'down');
      await s.say('likui:angry', 'HERE!');
      s.sfx('slash'); await s.flash(); await s.shake(4, 0.4);
      s.sfx('roar');
      await s.move('tigress', 'D5', { run: true });
      s.hide('tigress'); s.despawn('tigress');
      s.sfx('hit'); await s.shake(2, 0.3);
      await s.say('likui', 'The sabre went in to the hilt... she won\'t get up from under that cliff.');
      s.sfx('wind'); await s.shake(3, 0.8);
      await s.say('likui', '...A wind off the hill. And that smell. The big one\'s coming.');
      var wt = s.spawnBeast('wtiger', 'tiger', 27, 12, 'right', { body: '#c87a2a' }); wt.scale = 1.15;
      s.sfx('roar');
      await s.walkTo('wtiger', 31, 8);
      s.heal();
      await s.battle('ch10_tiger', { bg: 'forest', music: 'boss', noRun: true });
      s.hide('wtiger'); s.despawn('wtiger');
      await s.say('likui', 'One thrust... under the jaw. Four tigers. Four.');
      s.music('sad');
      await s.say('likui:sad', '...And it doesn\'t bring you back, Mother.');
      await s.narrate('He gathered what was left of his mother, wrapped it in his coat, and buried her behind the temple of the Mountain God, weeping like a child. Then he lay down among the dead tigers and slept.');
      await s.fadeOut(1);
      s.night(false);
      s.flag('ch10_tigers');
      s.place('player', 32, 9, 'down'); s.lie('player');
      await s.fadeIn(1);
      s.spawn('h1', 'hunter', 28, 13, 'up'); s.spawn('h2', 'hunter', 29, 13, 'up'); s.spawn('h3', 'hunter', 27, 14, 'up');
      await s.walkTo('h1', 31, 10);
      await s.emote('h1', '!');
      await s.say('hunter', 'Heaven and earth... one, two... FOUR tigers! All dead! And who\'s this lying among them?');
      s.walkTo('h3', 31, 11); await s.walkTo('h2', 33, 11);
      s.lie('player', false); await s.jump('player');
      await s.say('likui', 'Mm? What? ...Yes, I killed them. What of it?');
      await s.say('hunter', 'What of it?! Those tigers have eaten half the travellers on this ridge! You must come down with us, sir — Squire Cao will want to feast the man who did this!');
      await s.fadeOut(0.8);
      await s.warp('yishui_in', 15, 7, 'up', { noFade: true });
      await s.fadeIn(0.6);
    } }
  ]);
  WM.defEvents('yishui_in', [
    { id: 'ch10_squire', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_tigers') && WM.state.x >= 10; }, run: async function (s) {
      s.spawn('cao', 'squirecao', 15, 4, 'down'); s.spawn('widow', 'woman', 18, 5, 'left');
      await s.say('squirecao:smile', 'A hero! Four tigers in one night! Drink, drink, sir. What is your name?');
      await s.say('likui', 'Zhang. No given name. They just call me Zhang the Bold. ...Thanks. Just one cup.');
      await s.say('woman:shock', '(whispering) Squire... that\'s him. The Black Whirlwind. The man who killed my husband Li Gui. There\'s a price of three thousand strings on him.');
      await s.say('squirecao', '(whispering) ...Not a word. Keep smiling.');
      await s.say('squirecao:smile', 'Another cup for the tiger-killer! And another! A hero can\'t stop at one!');
      await s.say('likui', 'I promised my brother — no wine... Well. One more can\'t hurt.');
      s.sfx('item'); await s.emote('player', 'note');
      await s.say('likui', 'Ha! Good wine! Fill it up!');
      s.sfx('item'); await s.emote('player', 'heart');
      await s.say('likui', 'Four tigers... I killed four... Where\'s my... Mm.');
      await s.emote('player', 'zzz', 1.6);
      s.lie('player');
      await s.say('squirecao', 'He\'s out. Quick — ropes! Hands and feet!');
      s.spawn('sv1', 'servant', 13, 7, 'up'); s.spawn('sv2', 'servant', 17, 7, 'up');
      s.walkTo('sv1', 14, 7); await s.walkTo('sv2', 16, 7);
      s.sfx('hit'); await s.shake(2, 0.3);
      await s.say('squirecao:smile', 'Three thousand strings! Send to the county. Tell them we have the Black Whirlwind trussed like a pig.');
      await s.narrate('The constable who came for him was Li Yun, the Green-Eyed Tiger, with thirty men.');
      s.despawn('cao'); s.despawn('widow'); s.despawn('sv1'); s.despawn('sv2');
      s.party(['likui']); s.flag('ch10_bound');
      await s.warp('yishui', 6, 26, 'right');
    } }
  ]);
  WM.defEvents('yishui', [
    { id: 'ch10_zhufu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_bound'); }, run: async function (s) {
      s.spawn('liyun', 'liyun', 8, 26, 'left');
      var ym = WM.data.troop(s, 'ym', 'constable', [[9, 27], [10, 26], [11, 27]], 'left');
      s.spawn('cao', 'squirecao', 12, 26, 'left'); s.spawn('widow', 'woman', 13, 27, 'left'); s.spawn('hm', 'oldman', 13, 26, 'left');
      s.spawn('zhufu', 'zhufu', 2, 27, 'right'); s.spawn('zhugui', 'zhugui', 1, 26, 'right');
      await s.walkTo('zhufu', 6, 27);
      await s.say('zhufu:smile', 'Master Li! Congratulations on the capture! Here, I\'ve brought wine and meat for you and your men. My compliments!');
      await s.say('liyun', 'Zhu Fu, my old pupil! Very kind. Just one cup — I\'m on duty.');
      await s.say('zhufu', 'And for the lads — a whole jar each! Eat, eat, it\'s a long road to the county.');
      s.sfx('item'); await s.emote(ym[0], 'note'); await s.emote(ym[1], 'heart');
      await s.wait(0.5);
      await s.emote('liyun', '?');
      await s.say('liyun', 'Zhu Fu... what did you... put in the...', { top: true });
      s.lie('liyun'); s.sfx('hit');
      for (var yi = 0; yi < ym.length; yi++) { s.lie(ym[yi]); await s.wait(0.25); }
      await s.say('zhugui', 'Brother Li Kui! Up you get!');
      await s.shake(3, 0.3); await s.jump('player', 8);
      await s.say('likui:angry', 'RRRAAH! Ropes! Ha! A pudao — give it here!');
      s.face('cao', 'right'); s.face('widow', 'right'); s.face('hm', 'right');
      await s.emote('cao', '!');
      await s.say('squirecao:shock', 'He\'s loose! RUN!');
      s.walkTo('cao', 20, 26, { run: true }); s.walkTo('widow', 21, 27, { run: true }); s.walkTo('hm', 22, 26, { run: true });
      await s.walkTo('player', 18, 26, { run: true });
      s.hide('cao'); s.hide('widow'); s.hide('hm');
      s.hide('player');
      s.sfx('slash'); await s.wait(0.4); s.sfx('slash'); await s.wait(0.4); s.sfx('slash'); await s.shake(2, 0.3);
      s.despawn('cao'); s.despawn('widow'); s.despawn('hm');
      await s.wait(0.6);
      s.show('player');
      await s.walkTo('player', 7, 26);
      await s.say('zhugui', 'Brother Song sent me after you. He knew.');
      await s.say('likui:angry', '...I broke my promise and drank. And my mother... Now let me kill that green-eyed constable too!');
      await s.say('zhufu', 'No! Don\'t harm him. He is my master, who taught me the spear. He only does his duty.');
      await s.say('likui', '...Fine. Fine! Let\'s go before his men wake up.');
      s.walkTo('zhugui', 3, 26); s.walkTo('zhufu', 4, 27); await s.walkTo('player', 4, 26);
      await s.wait(0.4);
      s.lie('liyun', false); await s.jump('liyun');
      await s.emote('liyun', 'anger');
      await s.say('liyun:angry', 'Zhu Fu! You drugged your own master! Black Whirlwind — stand and fight!', { top: true });
      s.face('player', 'right'); s.face('zhufu', 'right'); s.face('zhugui', 'right');
      await s.walkTo('liyun', 6, 26, { run: true });
      await s.duel('likui_liyun', { hero: 'likui', canLose: true });
      await s.say('zhufu', 'Master, you have lost your prisoner. You can never go back to the county now — they will punish you for it. Come with us to Liangshan. Song Jiang welcomes every hero.');
      await s.say('liyun:sad', '...You have left me no road back, Zhu Fu. So be it.');
      s.despawn('liyun', { leave: true }); s.despawn('zhufu', { leave: true }); s.despawn('zhugui', { leave: true });
      ym.forEach(function (k) { s.hide(k); s.despawn(k); });
      s.flag('ch10_return');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch10_end', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_return') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('sj', 'songjiang', 15, 6, 'down');
      await s.say('likui:sad', 'Brother... I brought my mother over the Yi Ridge, and the tigers... I killed four tigers, but my mother is gone.');
      await s.say('songjiang:sad', 'Iron Ox... Heaven knows your filial heart. Your mother is at peace. You have brothers here now.');
      await s.narrate('Song Jiang held a great feast for the four tigers and the new brothers. Li Kui laughed and drank with everyone, and only now and then fell quiet.');
      s.despawn('sj');
      WM.state.chars.likui.weapon = null;
      await s.joinMany(['zhufu', 'liyun']);
      s.party(['songjiang', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.flag('ch10_done');
      await s.endChapter();
      if (WM.data.chapters[11].begin) await WM.data.chapters[11].begin(s);
    } }
  ]);
})();
