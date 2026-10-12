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
  WM.enemy('yi_tiger', 'White-Browed Tiger', 24, WM.beast('tiger', { body: '#c87a2a' }), { hp: 1.8, atk: 0.95, spd: 1.1, exp: 500, gold: 0, boss: true, fx: 'claw', skills: [{ name: 'Pounce', chance: 0.3, type: 'phys', power: 1.5, fx: 'claw', sfx: 'roar' }, { name: 'Mountain Roar', chance: 0.15, type: 'magic', power: 14, status: 'sleep', statusChance: 0.3, sfx: 'roar', fx: 'dark' }] });
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
    await s.narrate('Song Jiang could not rest on Liangshan while his old father was alone at home and the constables of Yuncheng watched the farm. One night he slipped away by himself to bring his father to the mountain. But the constables were waiting. Song Jiang fled through the dark, with the brothers Zhao Neng and Zhao De and their men hard behind him, until he came to a village called Huandao.');
    s.night(true);
    await s.warp('huandao', 15, 22, 'up', { noFade: true });
    await s.fadeIn(0.6);
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
      s.spawn('c1', 'zhaoneng', 15, 25, 'up');
      await s.say('zhaoneng', 'He went into the village! Search every house! There\'s no way out of Huandao — the hills close it in on three sides!');
      await s.say('songjiang:sad', '(The village is a dead end. The only shelter is the old temple at the top of the slope...)');
      s.despawn('c1');
      await s.say(null, '(Run to the temple at the north of the village.)');
    } }
  ]);
  WM.defEvents('huandao_in', [
    { id: 'ch10_temple', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 10; }, run: async function (s) {
      await s.narrate('There was no one in the temple. Behind the altar stood a great shrine cabinet with a curtain. Song Jiang climbed inside and drew the curtain, his heart pounding.');
      s.place('player', 7, 5, 'down'); s.hide('player');
      s.spawn('c1', 'zhaoneng', 7, 8, 'up'); s.spawn('c2', 'constable', 6, 8, 'up');
      await s.say('zhaoneng', 'Bring the torches here! Look in the shrine!');
      s.sfx('wind'); await s.shake(4, 0.6);
      await s.narrate('As the torch came near the curtain, a black wind rushed out of the cabinet, blew out every torch, and filled the temple with flying sand. Dust swirled up from the floor as if a spirit were standing in it.');
      await s.say('constable:shock', 'The spirit of the temple is angry! Out, out!');
      s.despawn('c1'); s.despawn('c2');
      await s.narrate('The constables fled the temple and posted guards at the mouth of the village to wait for dawn. Song Jiang, trembling, sat in the dark cabinet. And then two maidens in blue robes stood before him, and bowed.');
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
      await s.narrate('Chao Gai and Wu Yong had sent men after Song Jiang as soon as he was missed. And Dai Zong, with Du Qian, Song Wan, Wang Ying, Zheng Tianshou and the Tong brothers, had already brought Song Taigong and Song Qing safely to Liangshan. Back on the mountain, Song Jiang studied the Heavenly Books with Wu Yong alone, and told no one else what was in them.');
      s.flag('ch10_back');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch10_hall', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_back') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('gss', 'gongsunsheng', 13, 7, 'right'); s.spawn('likui', 'likui', 18, 7, 'left'); s.spawn('chaogai', 'chaogai', 15, 5, 'down');
      await s.join('songqing');
      await s.say('gongsunsheng', 'Brothers, seeing Song Jiang\'s father brought safely here, I think of my own mother in Jizhou, and of my master, Luo Zhenren. Let me go home to see them. I will return within a hundred days.');
      await s.say('chaogai', 'Go, then, and come back to us.');
      s.flag('away:gongsunsheng');
      s.removeParty('gongsunsheng');
      s.despawn('gss');
      s.music('sad');
      await s.say('likui:sad', '...Everybody\'s fetching their father, and their mother. My mother\'s in Yishui, carrying water and weaving straw sandals for my brother. I want to bring her here to live well too!');
      await s.say('songjiang', 'Brother, you are hot-headed, and the roads are watched. If you go, there are three things you must promise. Do not drink. Go alone, and quietly. And do not take your axes.');
      await s.say('likui', 'No wine — I promise. Alone — fine. My axes... all right. All right! I\'ll take a waist sabre and a pudao.');
      await s.say('songjiang', 'Then go, and come back quickly.');
      s.despawn('likui'); s.despawn('chaogai');
      s.party(['likui']); s.setLeader('likui'); s.level('likui', 23);
      WM.state.chars.likui.weapon = { name: 'Pudao', range: 'S', pow: 1.05 };
      s.flag('protagonist', 'likui');
      s.give('medicine', 3, true);
      s.flag('ch10_likui');
      await s.narrate('Li Kui set off for Yishui with a sabre at his waist and a pudao in his hand. And Song Jiang, who knew him well, quietly sent Zhu Gui after him: Zhu Gui\'s younger brother, Zhu Fu, kept a tavern in Yishui.');
      await s.say(null, '(Yishui lies to the east. Go home to Li Kui\'s mother.)');
    } }
  ]);

  // ---------------- Yishui ----------------
  WM.defEvents('yishui', [
    { id: 'ch10_ligui', x: 2, y: 26, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_likui'); }, run: async function (s) {
      s.spawn('ligui', 'ligui', 9, 26, 'left');
      await s.say('ligui:angry', 'Halt! I am Li Kui, the Black Whirlwind! Leave your silver and go, or I\'ll chop you in two!');
      await s.say('likui:angry', '...What? Who did you say you were?');
      await s.battle('ch10_ligui', { bg: 'forest' });
      await s.say('ligui:sad', 'Mercy! Mercy! My real name is Li Gui. I use the Black Whirlwind\'s name because everyone is afraid of it. I have a mother of ninety at home and no one to feed her — that\'s why I rob! If you kill me, she\'ll starve!');
      await s.say('likui', '...A mother at home, eh? I\'ve come all this way to fetch my own mother. All right. Here — ten taels. Go home and become an honest man.');
      s.despawn('ligui');
      await s.narrate('A little further on, Li Kui stopped at a cottage to buy a meal. From the next room he heard a man telling his wife how he had tricked the real Black Whirlwind with a story about a mother of ninety — there was no mother. Li Kui burst in. The false Li Kui did not trick anyone again. His wife ran away into the hills.');
      s.flag('ch10_liguidone');
    } }
  ]);
  WM.defEvents('yishui_in', [
    { id: 'ch10_home', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_liguidone') && WM.state.map === 'yishui_in' && WM.state.x < 10; }, run: async function (s) {
      s.spawn('mother', 'likuimother', 3, 4, 'down');
      await s.say('likuimother', 'Who\'s there? ...Tie\'niu? Is that you, my son?');
      await s.say('likui:sad', 'Mother! It\'s me, Iron Ox! I\'ve come home!');
      await s.say('likuimother:sad', 'I\'ve cried my eyes blind for you, my son. Where have you been all these years?');
      await s.say('likui', 'I\'m an official now, Mother! I\'ve come to take you to live in comfort! I\'ll carry you on my back.');
      s.spawn('lida', 'lida', 6, 6, 'left');   // in at the door, beside Li Kui
      await s.say('lida:angry', 'Iron Ox! You killed a man and ran, and the county has hounded me ever since! Now there\'s a reward of three thousand strings for you. You\'re no official — you\'re a bandit! I\'m going to the squire!');
      s.despawn('lida');
      await s.say('likui', '(No time. Brother will bring the whole village.) Up you come, Mother. We\'re going over the Yi Ridge tonight.');
      s.despawn('mother');
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
      s.heal();
      s.flag('ch10_water');
      await s.say(null, '(The stream is in the valley to the west.)');
    } },
    { id: 'ch10_stream', x: 14, y: 12, w: 6, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_water'); }, run: async function (s) {
      await s.narrate('Li Kui found the stream, but had nothing to carry water in. He climbed to a little shrine to the Great Sage of Sizhou on the hillside, wrenched the stone incense burner off its base, washed it in the stream, and filled it, and carried it carefully back up the slope.');
      s.flag('ch10_back2');
    } },
    { id: 'ch10_gone', x: 26, y: 8, w: 8, h: 5, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_back2'); }, run: async function (s) {
      s.despawn('mother');
      s.music('sad');
      await s.say('likui:shock', 'Mother? Mother! Where are you?!');
      await s.narrate('The rock was empty. Thirty paces away, in the grass, there was blood, and a strand of grey hair. And from the hillside above came the sound of beasts, eating.');
      await s.say('likui:angry', 'I carried her all the way from home on my back... to feed her to you?!');
      s.flag('ch10_rage');
      await s.say(null, '(The cave is in the cliff to the north-east.)');
    } },
    { id: 'ch10_cave', x: 31, y: 4, w: 4, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch10_rage'); }, run: async function (s) {
      s.music('boss');
      await s.narrate('At the mouth of the cave, two tiger cubs were gnawing on a human leg. Li Kui levelled his pudao with a roar.');
      await s.battle('ch10_cave', { bg: 'cave', music: 'boss' });
      await s.narrate('He killed the cubs. Then he crouched in the cave and waited, and when the tigress came backing in, tail first, he dropped the pudao, drew the sabre from his waist, and thrust it into her from behind, so hard the handle went in after the blade. She ran out howling and fell dead below the cliff. Then a great wind blew down from the hill, and the white-browed tiger came.');
      s.heal();
      await s.battle('ch10_tiger', { bg: 'forest', music: 'boss', noRun: true });
      await s.narrate('Li Kui caught it with a single thrust under the jaw as it sprang, and it fell dead. He had killed four tigers in one night. Then he gathered what was left of his mother, wrapped it in his coat, and buried her behind the temple of the Mountain God, weeping like a child.');
      s.night(false);
      s.flag('ch10_tigers');
      await s.narrate('In the morning, hunters found the four dead tigers and the black giant asleep beside them, and carried him down in triumph to the house of a rich squire, Squire Cao, to be feasted as a hero.');
      await s.warp('yishui_in', 15, 7, 'up');
    } }
  ]);
  WM.defEvents('yishui_in', [
    { id: 'ch10_squire', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_tigers') && WM.state.x >= 10; }, run: async function (s) {
      s.spawn('cao', 'squirecao', 15, 4, 'down'); s.spawn('widow', 'woman', 18, 5, 'left');
      await s.say('squirecao:smile', 'A hero! Four tigers in one night! Drink, drink, sir. What is your name?');
      await s.say('likui', 'Zhang. No given name. They just call me Zhang the Bold. ...Thanks. Just one cup.');
      await s.say('woman:shock', '(whispering) Squire... that\'s him. The Black Whirlwind. The man who killed my husband Li Gui. There\'s a price of three thousand strings on him.');
      await s.narrate('Squire Cao kept pouring wine for the hero, until Li Kui — who had promised Song Jiang not to drink — was dead drunk. Then they bound him hand and foot and sent for the county. The constable who came for him was Li Yun, the Green-Eyed Tiger, with thirty men.');
      s.despawn('cao'); s.despawn('widow');
      s.party(['likui']); s.flag('ch10_bound');
      await s.warp('yishui', 6, 26, 'right');
    } }
  ]);
  WM.defEvents('yishui', [
    { id: 'ch10_zhufu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch10_bound'); }, run: async function (s) {
      s.spawn('liyun', 'liyun', 8, 26, 'left'); s.spawn('zhufu', 'zhufu', 3, 27, 'right'); s.spawn('zhugui', 'zhugui', 2, 26, 'right');
      await s.say('zhufu:smile', 'Master Li! Congratulations on the capture! Here, I\'ve brought wine and meat for you and your men. My compliments!');
      await s.say('liyun', 'Zhu Fu, my old pupil! Very kind. Just one cup — I\'m on duty.');
      await s.narrate('Zhu Gui and Zhu Fu had put a sleeping drug in the meat and the wine. Li Yun drank one cup, and his men emptied the jars. A moment later they were all lying in the road. Li Kui burst his ropes, snatched up a pudao, and went after Squire Cao, the false Li Kui\'s widow and the village headman, who had come along to see him punished. None of them came back from that road.');
      s.lie('liyun');
      await s.say('zhugui', 'Brother Song sent me after you. He knew.');
      await s.say('likui:angry', '...I broke my promise and drank. And my mother... Now let me kill that green-eyed constable too!');
      await s.say('zhufu', 'No! Don\'t harm him. He is my master, who taught me the spear. He only does his duty.');
      s.lie('liyun', false);
      await s.narrate('Li Yun woke before he was meant to, and came after them up the road in a fury, and he and Li Kui fought there in the road.');
      await s.duel('likui_liyun', { hero: 'likui', canLose: true });
      await s.say('zhufu', 'Master, you have lost your prisoner. You can never go back to the county now — they will punish you for it. Come with us to Liangshan. Song Jiang welcomes every hero.');
      await s.say('liyun:sad', '...You have left me no road back, Zhu Fu. So be it.');
      s.despawn('liyun'); s.despawn('zhufu'); s.despawn('zhugui');
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
