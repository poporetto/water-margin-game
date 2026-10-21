// Chapter 7 — "The Pilgrim" (novel chapters 23–32).
// Wu Song kills the tiger of Jingyang Ridge; his brother Wu Dalang is murdered by Pan Jinlian and Ximen Qing;
// Wu Song's revenge; Cross Slope; Shi En and Jiang Menshen; Commander Zhang's plot; Flying Cloud Pond and the
// Mandarin Duck Tower; the pilgrim's robes; Centipede Ridge; reunion with Song Jiang at the Kong family manor.
'use strict';
(function () {
  var S = WM.S;
  // ---------------- people ----------------
  WM.npc('wudalang', 'Wu Dalang', { skin: '#d8a070', hairStyle: 'hat', hatColor: '#6a5a3a', body: '#7a6a4a', trim: '#4a3a2a', build: 'small', face: 'round', eyes: 'round' }, { face: true });
  WM.npc('panjinlian', 'Pan Jinlian', { skin: '#f6e2cc', hairStyle: 'woman', body: '#d06a8a', trim: '#f0e0c0', dress: true, build: 'slim', face: 'narrow', eyes: 'narrow', flower: '#e84a6a', lips: '#c02030' }, { face: true });
  WM.npc('wangpo', 'Granny Wang', { skin: '#e0a880', hair: '#a8a8a0', hairStyle: 'woman', body: '#4a3a3a', trim: '#8a6a4a', dress: true, face: 'round', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('ximenqing', 'Ximen Qing', { skin: '#f0c49a', hairStyle: 'scarf', band: '#6a2a6a', body: '#8a3a8a', trim: '#e8c060', face: 'long', eyes: 'narrow', brows: 'angled', beard: 'mustache' }, { face: true });
  WM.npc('yunge', 'Yun Ge', { skin: '#e8b48a', hairStyle: 'topknot', body: '#6a8a5a', trim: '#e8e0d0', build: 'small', face: 'round', eyes: 'round' }, { face: true });
  WM.npc('hejiu', 'He Jiu', { skin: '#e0a880', hairStyle: 'scarf', band: '#2a2a2a', beard: 'short', body: '#3a3a3a', trim: '#a89070', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('yangguofficial', 'Magistrate of Yanggu', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', body: '#7a1a1a', trim: '#d8b36a' }, { face: true });
  WM.npc('tigerhunter', 'Hunter in a Tiger Skin', { skin: '#c8905e', hairStyle: 'wild', hair: '#c88a3a', body: '#d89a3a', trim: '#2a1a10', weapon: 'fork' }, { face: true });
  WM.npc('shienfather', 'Old Warden Shi', { skin: '#e0a880', hair: '#c0c0b8', hairStyle: 'futou', beard: 'long', beardColor: '#d0d0c8', body: '#3a4a3a', trim: '#c8b890' }, { face: true });
  WM.npc('jiangmenshen', 'Jiang the Door God', { skin: '#c88a6a', hairStyle: 'wild', hair: '#1a1a1a', beard: 'full', body: '#e8e0d0', trim: '#5a3a2a', build: 'big', chest: true, face: 'square', eyes: 'round', fierce: true }, { face: true });
  WM.npc('zhangdujian', 'Commander Zhang', { skin: '#f0c49a', hairStyle: 'helmet', helmColor: '#8a7a3a', tassel: '#c8302a', beard: 'long', body: '#6a1a1a', trim: '#d8b36a', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('zhangtuanlian', 'Militia Captain Zhang', { skin: '#e0a880', hairStyle: 'helmet', helmColor: '#5a5a6a', beard: 'short', body: '#3a3a5a', trim: '#c8b890' }, { face: true });
  WM.npc('yulan', 'Yulan', { skin: '#f6e2cc', hairStyle: 'woman', body: '#7a9aca', trim: '#f0e8f0', dress: true, build: 'slim', face: 'narrow' }, { face: true });
  WM.npc('daoistwang', 'The Daoist of Centipede Ridge', { skin: '#e0b090', hairStyle: 'daoist', crown: '#5a3a5a', beard: 'short', body: '#4a2a4a', trim: '#c8a040', weapon: 'sword', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('tavernkeep', 'Tavern Keeper', { skin: '#d8a070', hairStyle: 'scarf', band: '#5a2a1a', body: '#6a3a2a', trim: '#c8b890', beard: 'mustache' }, { face: true });

  // ---------------- enemies ----------------
  WM.enemy('jy_tiger', 'Tiger of Jingyang Ridge', 16, WM.beast('tiger'), { hp: 1.6, atk: 0.8, spd: 1.2, exp: 600, gold: 0, boss: true, fx: 'claw', skills: [
    { name: 'Pounce', chance: 0.3, type: 'phys', power: 1.4, fx: 'claw', sfx: 'roar' },
    { name: 'Tail Lash', chance: 0.2, type: 'phys', power: 1.1, fx: 'blunt' },
    { name: 'Mountain Roar', chance: 0.15, type: 'magic', power: 10, status: 'sleep', statusChance: 0.3, sfx: 'roar', fx: 'dark' }] });
  WM.enemy('ximen_boss', 'Ximen Qing', 17, WM.hum(WM.data.npcs.ximenqing.look), { hp: 1.5, atk: 0.55, spd: 1.2, exp: 400, gold: 300, boss: true, drops: [['jadering', 1]], skills: [{ name: 'Rich Man\'s Kick', chance: 0.3, type: 'phys', power: 1.4 }] });
  WM.enemy('ximen_guard', 'Ximen\'s Bodyguard', 15, WM.hum(WM.enemyLooks.thug), { hp: 0.55, atk: 0.45, exp: 90, fx: 'blunt' });
  WM.enemy('jiang_boss', 'Jiang the Door God', 18, WM.hum(WM.data.npcs.jiangmenshen.look), { hp: 1.6, atk: 0.57, spd: 0.8, exp: 480, gold: 250, boss: true, fx: 'blunt', drops: [['tigerwine', 2]], skills: [{ name: 'Door God\'s Charge', chance: 0.3, type: 'phys', power: 1.5 }] });
  WM.enemy('jiang_man', 'Happy Forest Tough', 16, WM.hum(WM.enemyLooks.thug), { hp: 0.55, atk: 0.45, exp: 95, fx: 'blunt', drops: [['wine', 0.3]] });
  WM.enemy('escort_killer', 'Hired Killer', 17, WM.hum(WM.enemyLooks.bandit), { hp: 0.6, atk: 0.52, exp: 100, drops: [['medicine', 0.3]] });
  WM.enemy('escort_guard', 'Crooked Escort', 16, WM.hum(WM.enemyLooks.constable), { hp: 0.6, atk: 0.5, exp: 95 });
  WM.enemy('zhangdu_boss', 'Commander Zhang', 19, WM.hum(WM.data.npcs.zhangdujian.look), { hp: 1.0, atk: 0.4, exp: 500, gold: 400, boss: true, drops: [['goodwine', 1]] });
  WM.enemy('zhangtuan_boss', 'Militia Captain Zhang', 18, WM.hum(WM.data.npcs.zhangtuanlian.look), { hp: 0.8, atk: 0.38, exp: 400, gold: 200, boss: true });
  WM.enemy('jiang_boss2', 'Jiang the Door God', 19, WM.hum(WM.data.npcs.jiangmenshen.look), { hp: 0.9, atk: 0.42, exp: 450, gold: 200, boss: true, fx: 'blunt' });
  WM.enemy('daoist_boss', 'Daoist of Centipede Ridge', 19, WM.hum(WM.data.npcs.daoistwang.look), { hp: 1.25, atk: 0.5, mgc: 0.9, exp: 450, gold: 220, boss: true, skills: [{ name: 'Twin Swords', chance: 0.3, type: 'phys', power: 1.4 }, { name: 'Black Wind', chance: 0.2, type: 'magic', power: 40, element: 'wind', fx: 'wind' }] });
  WM.enemy('daoist_boy', 'Daoist Acolyte', 16, WM.hum({ skin: '#e8b48a', hairStyle: 'topknot', body: '#4a2a4a', trim: '#c8a040', weapon: 'sword', build: 'small' }), { hp: 0.6, atk: 0.55, exp: 80 });
  var T = WM.data.troops;
  T.ch7_tiger = { enemies: ['jy_tiger'], bg: 'forest', boss: true };
  T.ch7_lion = { enemies: ['ximen_guard', 'ximen_boss', 'ximen_guard'], bg: 'interior', boss: true };
  T.ch7_happy = { enemies: ['jiang_man', 'jiang_boss', 'jiang_man'], bg: 'plains', boss: true };
  T.ch7_feiyun = { enemies: ['escort_guard', 'escort_killer', 'escort_killer', 'escort_guard'], bg: 'marsh', noRun: true };
  T.ch7_tower = { enemies: ['zhangtuan_boss', 'zhangdu_boss', 'jiang_boss2'], bg: 'palace', boss: true };
  T.ch7_daoist = { enemies: ['daoist_boy', 'daoist_boss'], bg: 'interior', boss: true };

  WM.data.duels.wusong_sunerniang = {
    hero: 'wusong', foe: 'sunerniang', bg: 'interior', heroHp: 400, heroAtk: 46, foeHp: 280, foeAtk: 38,
    intro: [['foe:angry', 'You weren\'t drugged at all, you sly devil!'], ['hero', 'You serve your customers a strange kind of wine, landlady.']],
    lines: {
      attack: ['Let go of me!', 'Take that!', 'Hyaa!'],
      wild: ['I\'ll carve you into dumplings!', 'You\'re dead!', 'All my knives!'],
      defend: ['Stay back...', 'Wait — who are you?', 'Hm...']
    },
    win: [['foe:shock', 'Aiee — let me go, hero!']], lose: [['foe:smile', 'Fresh meat for the buns!']]
  };
  WM.data.duels.wusong_kongliang = {
    hero: 'wusong', foe: 'kongliang', bg: 'snow', heroHp: 380, heroAtk: 44, foeHp: 260, foeAtk: 30,
    intro: [['foe:angry', 'Drunken monk! That chicken and wine were cooked for me!'], ['hero:angry', 'I paid for my wine. Who are you to shout at me?']],
    lines: {
      attack: ['Take this!', 'Monk!', 'Hyah!'],
      wild: ['I\'ll teach you a lesson!', 'All or nothing!', 'Down you go!'],
      defend: ['He\'s staggering...', 'Careful, he\'s strong.', 'Hm.']
    },
    win: [['foe:shock', 'Ow! Ow! Brother — help!']], lose: [['foe:smile', 'Drunk as a fish!']]
  };

  // a story weapon override helper
  function setWeapon(id, w) { var c = WM.state.chars[id]; if (c) c.weapon = w; }

  WM.data.chapters[7].begin = async function (s) {
    await s.chapter(7);
    s.party(['wusong']); s.level('wusong', 16); s.setLeader('wusong');
    WM.state.chars.wusong.equip.body = 'quilted'; WM.state.chars.wusong.equip.head = 'bandana';
    setWeapon('wusong', { name: 'Cudgel', range: 'S', pow: 1.0, fx: 'blunt' });
    s.flag('protagonist', 'wusong');
    s.give('medicine', 3, true);
    WM.unlock('jingyang');
    // the road home: how Wu Song came to the foot of Jingyang Ridge
    await s.narrate('Wu Song left Lord Chai\'s manor with a cudgel in his hand and the silver Song Jiang had given him, and set out west for Qinghe county, where his elder brother Wu Dalang lived. He had not seen him in more than a year.');
    await s.narrate('He walked for many days. Late one afternoon, hot and thirsty, he came into Yanggu county, to a little tavern at the foot of a ridge. Over its door hung a banner: "Three bowls and you can\'t cross the ridge."');
    await s.warp('jingyang', 14, 41, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[7].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 6; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng', 'boarforest', 'chaimanor', 'cangzhou', 'zhugui', 'daming', 'shijie', 'huangni', 'erlong', 'yuncheng', 'dongxi', 'songfarm');
    await WM.data.chapters[7].begin(s);
  };

  // ---------------- Jingyang Ridge ----------------
  WM.defEvents('jingyang', [
    { id: 'ch7_sign', x: 13, y: 39, trigger: 'check', text: ['A banner over the tavern door: "Three bowls and you can\'t cross the ridge."'] },
    { id: 'ch7_notice', x: 23, y: 25, trigger: 'check', run: async function (s) {
      await s.say(null, '"Notice from the county of Yanggu: A tiger has appeared on Jingyang Ridge and has killed many travellers. Hunters are ordered to take it within a set time. Travellers may cross only between the hours of 9 and 3, in groups. Crossing alone, or at other hours, is forbidden."');
      if (S.has('ch7_drunk') && !S.has('ch7_noticeread')) {
        s.flag('ch7_noticeread');
        await s.say('wusong', '(...So there really is a tiger. If I go back now, that innkeeper will laugh at me. What\'s there to fear? Let\'s go on.)');
      }
    } }
  ]);
  WM.defEvents('jingyang_in', [
    { id: 'ch7_bowls', x: 5, y: 4, npc: 'tavernkeep', cond: function (S2) { return !S2.has('ch7_drunk'); }, run: async function (s) {
      await s.say('wusong', 'Keeper! Wine, and meat. I\'m hungry.');
      await s.say('tavernkeep', 'Here, three bowls and two catties of beef. And that\'s all the wine you\'ll get.');
      await s.say('wusong', 'Why only three bowls?');
      await s.say('tavernkeep', 'Didn\'t you see my banner? "Three bowls and you can\'t cross the ridge." My wine\'s strong — any man who drinks three bowls of it can\'t get over the ridge. It\'s called "Through the Bottle and Out the Gate."');
      await s.say('wusong:angry', 'Nonsense! I\'ve had three bowls, and I\'m not drunk. More!');
      await s.narrate('The keeper poured three more, and three more, and Wu Song drank them all, and banged on the table for more, until he had drunk eighteen bowls. Then he picked up his cudgel and stood up.');
      await s.say('tavernkeep', 'Wait! Don\'t cross the ridge, sir! There\'s a tiger up there — a great white-browed beast that\'s killed thirty men. The county\'s posted notices. Stay here tonight and cross with others in the morning.');
      await s.say('wusong:angry', 'A tiger! You just want me to stay and spend more money. I\'m from Qinghe county, and I\'ve crossed this ridge twenty times and never seen a tiger. Even if there is one, I\'m not afraid of it.');
      s.flag('ch7_drunk');
      await s.say('tavernkeep:sad', 'Well, don\'t say I didn\'t warn you...');
    } },
    // and he is still behind his counter afterwards
    { id: 'ch7_bowls2', x: 5, y: 4, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_drunk') && !S2.has('ch7_tigerslain'); }, text: ['Eighteen bowls, and he walks out straight up the ridge... Heaven keep that man. I\'ll light a stick of incense for him.'] },
    { id: 'ch7_bowls3', x: 5, y: 4, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_tigerslain'); }, text: ['The tiger of Jingyang Ridge, killed with bare fists by a man with eighteen bowls in him! I\'m painting it on my banner.'] }
  ]);
  WM.defEvents('jingyang', [
    { id: 'ch7_tiger', x: 10, y: 9, w: 9, h: 7, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch7_drunk'); }, run: async function (s) {
      s.stopMusic();
      await s.narrate('By the time he came up onto the ridge, the sun was setting and the wine was burning in him. He saw a great flat rock beneath the trees, lay down on it with his cudgel beside him, and was about to sleep — when a wild wind sprang up, and out of the trees leapt a huge tiger with hanging eyes and a white forehead.');
      s.spawnBeast('tiger', 'tiger', 17, 11, 'left');
      s.sfx('roar'); await s.shake(6, 0.8);
      await s.emote('player', '!');
      await s.say('wusong:shock', 'Aiya!');
      await s.narrate('The tiger crouched, then sprang. Wu Song leapt aside. The tiger lashed with its tail like an iron rod. Wu Song dodged again. He raised his cudgel and brought it down with all his strength — and in his haste he struck a branch, and the cudgel broke in two.');
      setWeapon('wusong', { name: 'Fists', range: 'S', pow: 1.15, fx: 'blunt' });
      s.music('boss');
      await s.battle('ch7_tiger', { bg: 'forest', music: 'boss', noRun: true, intro: 'Wu Song\'s cudgel has broken. Only his fists remain.' });
      s.despawn('tiger', { leave: true });
      await s.narrate('Wu Song seized the tiger by the scruff of the neck and forced its head to the ground. The tiger clawed two pits in the earth beneath it. Holding it down with his left hand, Wu Song beat it with his right fist, fifty, seventy blows, until blood ran from its eyes, nose, mouth and ears, and it lay still.');
      await s.say('wusong', '(...It\'s dead. I killed a tiger with my bare hands. And I can barely stand.)');
      s.spawn('h1', 'tigerhunter', 12, 15, 'up'); s.spawn('h2', 'tigerhunter', 16, 15, 'up');
      await s.say('wusong:shock', '(Two more tigers?! I\'m finished...)');
      await s.say('tigerhunter', 'Don\'t be afraid! We\'re men — hunters, in tiger skins. Who are you? Where did you come from at this hour? ...Is that the tiger? Dead?! You killed it?!');
      await s.narrate('The hunters ran down to the villages. Torches came up the ridge, and the villagers carried the dead tiger down in triumph, with Wu Song before it. Next morning the whole town of Yanggu turned out to see the man who had killed the tiger of Jingyang Ridge with his fists.');
      s.despawn('h1', { leave: true }); s.despawn('h2', { leave: true });
      setWeapon('wusong', { name: 'Fists', range: 'S', pow: 1.15, fx: 'blunt' });
      s.flag('ch7_tigerslain');
      WM.unlock('yanggu');
      await s.warp('yanggu', 21, 30, 'up');
    } }
  ]);

  // ---------------- Yanggu ----------------
  WM.defEvents('yanggu', [
    { id: 'ch7_parade', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_tigerslain'); }, run: async function (s) {
      s.spawn('c1', 'villager', 19, 27, 'right'); s.spawn('c2', 'woman', 23, 26, 'left'); s.spawn('c3', 'child', 18, 24, 'right'); s.spawn('c4', 'merchant', 24, 23, 'left');
      s.music('heroic');
      await s.narrate('The magistrate of Yanggu received Wu Song in his hall, gave him the thousand strings of reward money — which Wu Song gave away at once to the hunters — and made him chief constable of the county.');
      s.despawn('c1'); s.despawn('c2'); s.despawn('c3'); s.despawn('c4');
      s.spawn('dalang', 'wudalang', 20, 20, 'down');
      await s.say('wudalang', 'Second Brother! Second Brother, it\'s me!');
      await s.say('wusong:smile', 'Elder Brother! What are you doing in Yanggu?');
      await s.narrate('Wu Dalang, Wu Song\'s elder brother, was barely five feet tall, ugly and good-natured, and sold steamed pancakes in the street for a living. People called him "Three-Inch Mulberry Bark." He had married a beautiful woman, Pan Jinlian, and the gossip in Qinghe had driven them to move here.');
      await s.say('wudalang', 'Come home! Come home and see your sister-in-law. She\'ll be so pleased.');
      s.despawn('dalang');
      s.flag('ch7_home');
      setWeapon('wusong', { name: 'Constable\'s Sabre', range: 'S', pow: 1.1 });
      await s.say(null, '(Wu Dalang\'s house is on the south side of the street, next to Granny Wang\'s teashop.)');
    } }
  ]);
  WM.defEvents('yanggu_in', [
    { id: 'ch7_jinlian', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_home') && WM.state.x >= 14 && WM.state.x <= 23; }, run: async function (s) {
      s.spawn('jinlian', 'panjinlian', 17, 4, 'down'); s.spawn('dalang', 'wudalang', 20, 6, 'left');
      await s.say('panjinlian:smile', 'So this is the famous brother-in-law who killed the tiger! Come and live with us, brother. Why should you sleep at the barracks, when your own family is here?');
      // she comes round the table to him, all smiles
      await s.walkTo('jinlian', 18, 7); s.faceEach('jinlian', 'player');
      await s.emote('jinlian', 'heart', 1);
      await s.narrate('So Wu Song moved into his brother\'s house. Every day Pan Jinlian cooked for him and fussed over him, and looked at him in a way he did not care for.');
      s.face('player', 'right'); await s.emote('player', '...', 1);
      // one snowy day in winter
      await s.fadeOut(0.8);
      s.despawn('dalang');
      s.place('player', 18, 5, 'left'); s.place('jinlian', 15, 6, 'right');
      s.night(false);
      await s.fadeIn(0.8);
      await s.narrate('One snowy day in winter, when Wu Dalang was out selling pancakes, she lit a brazier, warmed some wine, and came to sit beside him.');
      await s.walkTo('jinlian', 19, 6); await s.walkTo('jinlian', 19, 5); s.face('jinlian', 'left'); s.face('player', 'right');
      await s.emote('jinlian', 'heart', 0.8);
      await s.say('panjinlian:smile', 'Brother-in-law, they say you keep a singing girl in the east of town. Is it true?');
      await s.say('wusong', 'Don\'t listen to gossip, sister-in-law. I\'m not that sort of man.');
      await s.say('panjinlian:smile', 'Then you must be cold, all alone... Here. Drink half my cup.');
      // he knocks the cup away and leaps up
      s.sfx('block'); s.jump('player', 4); await s.shake(3, 0.3);
      await s.move('player', 'D1'); s.face('player', 'up');
      await s.emote('player', 'anger', 0.8);
      await s.say('wusong:angry', 'Sister-in-law! Have some shame! I am a man with teeth in his head and hair on his chin — not some beast who knows no human decency. If I hear anything more of this, my eyes may know my sister-in-law, but my fists will not!');
      await s.emote('jinlian', 'sweat', 1);
      // and walks straight out of the house
      await s.walkTo('player', 19, 8);
      await s.move('player', 'D1');
      s.hide('player');
      await s.narrate('Wu Song moved back to the barracks that very day. Soon after, the magistrate sent him to the Eastern Capital with gifts for a relative — a journey of two months. Before he left, he came to say goodbye to his brother.');
      s.show('player'); s.place('player', 19, 8, 'up');
      s.place('jinlian', 16, 4, 'down');
      s.spawn('dalang', 'wudalang', 19, 5, 'up');
      await s.say('wusong', 'Brother, I must be away two months. You are an honest man, and people take advantage of honest men. Sell fewer pancakes. Go out late and come home early. Bar your door. Don\'t drink with anyone. If anyone bullies you, wait till I come back and I will deal with them.');
      await s.say('wudalang', 'I will, brother. I promise.');
      await s.say('wusong', 'And sister-in-law — "a strong fence keeps the dogs out."');
      await s.say('panjinlian:angry', '...!');
      s.despawn('jinlian'); s.despawn('dalang');
      await s.fadeOut(1);
      s.flag('ch7_away');
      await s.narrate('While Wu Song was away, the story went on without him, as such stories do.');
      // the street outside Wu Dalang's house, while Wu Song is away: watch it happen
      await s.warp('yanggu', 10, 24, 'left', { noFade: true }); s.hide('player');
      s.spawn('jinlian', 'panjinlian', 6, 23, 'down'); s.spawn('wangpo', 'wangpo', 14, 23, 'down'); s.spawn('ximen', 'ximenqing', 12, 24, 'left');
      await s.fadeIn(0.8);
      await s.move('ximen', 'L4');
      s.sfx('hit'); await s.emote('ximen', '!');
      await s.say('panjinlian:shock', 'Oh! Forgive me, sir — the pole slipped from my hand!');
      await s.say('ximenqing:smile', 'No harm done, lady. ...None at all.');
      await s.narrate('One day, as Pan Jinlian lowered the bamboo pole that held up the curtain at her window, it slipped from her hand and struck a passer-by on the head. He was Ximen Qing, a rich, idle man who kept a medicine shop by the county office, and who was in with every official in the town. He looked up, and smiled.');
      await s.emote('wangpo', '...');
      await s.narrate('Next door, Granny Wang, who kept the teashop and was a matchmaker, midwife and procuress, saw everything.');
      // Ximen Qing strolls over to her teashop and presses silver into her hand
      await s.walkTo('ximen', 13, 24); s.faceEach('ximen', 'wangpo');
      s.sfx('item'); await s.emote('wangpo', '!', 0.8);
      await s.narrate('For ten taels of silver she laid a plan for Ximen Qing, step by step, and within a month Ximen Qing and Pan Jinlian were meeting in her back room every afternoon.');
      // the old woman stands aside; Jinlian slips out of her own door and along to the teashop, and the two go in together
      await s.move('wangpo', 'R1'); s.face('wangpo', 'left');
      await s.walkTo('jinlian', 12, 24);
      s.face('ximen', 'left'); await s.emote('jinlian', 'heart', 0.8);
      s.walkTo('ximen', 13, 22).then(function () { s.hide('ximen'); });
      await s.walkTo('jinlian', 12, 23); await s.walkTo('jinlian', 13, 23); await s.walkTo('jinlian', 13, 22); s.hide('jinlian');
      s.sfx('door');
      await s.move('wangpo', 'L1'); s.face('wangpo', 'down');   // and keeps watch at the door
      s.despawn('jinlian'); s.despawn('ximen');
      await s.narrate('The whole street knew it — except Wu Dalang.');
      s.spawn('dalang', 'wudalang', 9, 24, 'right');
      // Yun Ge the pear-seller, whom Granny Wang had boxed on the ears, comes running
      s.spawn('yg', 'yunge', 4, 24, 'right');
      await s.move('yg', 'R4', { run: true });
      await s.say('yunge', 'Uncle Wu! Your wife is in Granny Wang\'s back room with Ximen Qing — right now! Go in and catch them. I\'ll keep the old woman out of your way!');
      await s.say('wudalang', '...Ximen Qing? In there? With — ?');
      s.move('yg', 'R4', { run: true, wait: false });
      await s.move('dalang', 'R4');
      await s.move('wangpo', 'R1');   // the boy butts her aside
      s.face('dalang', 'up');
      await s.say('wudalang', 'Open the door! Open it!');
      s.spawn('xm2', 'ximenqing', 14, 23, 'down');
      s.sfx('hit'); await s.shake(4, 0.3); s.lie('dalang');
      await s.narrate('Ximen Qing burst out of the door and kicked Wu Dalang full in the chest. He fell, and was carried home, and lay sick for days, and no one came to him.');
      s.despawn('xm2', { leave: true }); s.despawn('yg', { leave: true });
      await s.fadeOut(1);
      s.despawn('dalang', { leave: true }); s.despawn('wangpo'); s.show('player');
      await s.narrate('"When my brother comes home," Wu Dalang said, "he will know what to do." The lovers heard. Ximen Qing brought arsenic from his shop. Pan Jinlian put it in Wu Dalang\'s medicine, and held the quilt over him until he was still.');
      await s.narrate('The coroner, He Jiu, was called to examine the body. Ximen Qing slipped him ten taels of silver. He Jiu saw at once that the dead man\'s face was purple and his lips black — and he took the silver, said nothing, and quietly kept two of the burned bones.');
      s.flag('ch7_return');
      await s.warp('yanggu_in', 19, 7, 'up', { noFade: true });
      s.spawn('jinlian', 'panjinlian', 16, 5, 'right');
      await s.fadeIn(1);
      s.music('sad');
      await s.say(null, '(Where Wu Dalang\'s pancake trays used to stand, there is a spirit tablet: "The Late Husband, Wu Dalang.")');
      await s.say('wusong:shock', '...Brother? Elder Brother?!');
      await s.say('panjinlian:sad', 'Brother-in-law... a sudden pain in his heart. Nine days, and then he was gone. We had him cremated.');
      await s.say('wusong:sad', '...Cremated. So quickly.');
      await s.say('wusong', '(My brother was never sick a day in his life. And she is wearing mourning white over a silk skirt.)');
      s.hide('jinlian'); s.despawn('jinlian');   // (her standing self, ch7_jinlian2, takes over)
      await s.say(null, '(Find out how Wu Dalang died. The coroner, He Jiu, lives in the north-west of town.)');
    } },
    // Granny Wang at home, next door to Wu Dalang
    { id: 'ch7_wangpo1', x: 29, y: 5, npc: 'wangpo', dir: 'down', cond: function (S2) { return S2.has('ch7_home') && !S2.has('ch7_away'); }, run: async function (s) {
      await s.say('wangpo:smile', 'Ah, the tiger-killer himself, in my humble house! Sit, sit. A cup of plum tea?');
      await s.say('wangpo', 'Your sister-in-law next door — have you ever seen a face like hers? Skin like fresh bean curd, a waist you could close your hand around. And married to your brother, three feet tall and selling pancakes in the street!');
      await s.say('wangpo:smile', 'A fresh flower stuck in a heap of cow dung, that\'s what the whole street says. Such a waste. Such a waste...');
      await s.say('wusong:angry', 'Watch your tongue, old woman. That is my brother you are talking about.');
      await s.say('wangpo', 'Hee hee... I meant no harm, Constable. An old woman talks.');
    } },
    { id: 'ch7_wangpo2', x: 29, y: 5, npc: 'wangpo', dir: 'down', cond: function (S2) { return S2.has('ch7_return') && !S2.has('ch7_tolion'); }, run: async function (s) {
      await s.say('wangpo:sad', 'C-Constable Wu! Such a terrible thing, your poor brother. A pain in the heart, just like that. I helped the widow with everything, I did...');
      await s.say('wusong', '(She will not meet my eyes.)');
    } },
    // the widow in her mourning white, by the bed, until Wu Song comes back for her
    { id: 'ch7_jinlian2', x: 16, y: 5, npc: 'panjinlian', dir: 'right', cond: function (S2) { return S2.has('ch7_return') && !S2.has('ch7_evidence'); }, run: async function (s) {
      await s.say('panjinlian:sad', 'He was such a good husband... I burn incense for him every morning and every night. What more can a widow do?');
      await s.say('wusong', 'Who bought the coffin? Who carried it out?');
      await s.say('panjinlian:shock', '...Granny Wang next door helped me. I was too distraught to see to anything. Why do you ask, brother-in-law?');
      await s.say('wusong', '(Her hands are shaking.)');
    } },
    { id: 'ch7_jinlian3', x: 16, y: 5, npc: 'panjinlian', dir: 'right', cond: function (S2) { return S2.has('ch7_evidence') && !S2.has('ch7_tolion'); }, run: async function (s) {
      await s.say('panjinlian:smile', 'Brother-in-law, you\'re back so late... Shall I warm some wine for you?');
      await s.say('wusong', '(Not yet. When the neighbours are gathered, before my brother\'s tablet — then.)');
    } },
    { id: 'ch7_hejiu', x: 63, y: 4, npc: 'hejiu', cond: function (S2) { return S2.has('ch7_return') && !S2.has('ch7_hejiutold'); }, run: async function (s) {
      await s.say('hejiu', '...Constable Wu. I knew you would come.');
      await s.say('wusong:angry', 'Tell me how my brother died. If one word is a lie, this knife will know it.');
      await s.say('hejiu:sad', 'Here. Two bones from the cremation, black and brittle — poison. And ten taels of silver that Ximen Qing gave me to keep quiet. I wrote down the day and the hour.');
      await s.say('wusong', '...Ximen Qing.');
      await s.say('hejiu', 'There is a boy who saw more than I did — Yun Ge, the pear-seller. Your brother was kind to him. You will find him by the stream, near the Lion Bridge.');
      await s.say('wusong', 'Then you will come with me, He Jiu. When I have the boy, we go to the magistrate together.');
      s.flag('ch7_hejiutold');
      s.hide('ch7_hejiu'); WM.state.followers = ['hejiu']; WM.field.refreshFollowers();   // he comes along with Wu Song
      await s.say(null, '(Find Yun Ge the pear-seller by the stream, near the Lion Bridge.)');
    } },
    // the county hall: Wu Song brings his witnesses before the magistrate
    { id: 'ch7_court', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_yunge') && !S2.has('ch7_evidence') && WM.state.x <= 12; }, run: async function (s) {
      var p = s.actor('player').tile();
      WM.state.followers = []; WM.field.refreshFollowers();   // (the two witnesses stand in the hall as themselves now)
      s.spawn('mag', 'official', 5, 4, 'down');
      s.spawn('hj', 'hejiu', p.x - 1, p.y, 'up'); s.spawn('yg', 'yunge', p.x + 1, p.y, 'up');
      await s.walkTo('player', 6, 6); s.face('player', 'up');
      await s.say('wusong:angry', 'Your Honour! My brother Wu Dalang was poisoned by his wife and Ximen Qing, with Granny Wang\'s help. Here is the coroner, He Jiu, with the bones and the silver he was paid. Here is Yun Ge, who saw them at the teashop.');
      await s.say('yunge', 'It\'s true, sir! I saw Ximen Qing kick Uncle Wu in the chest with my own eyes!');
      s.face('hj', 'up');
      await s.say('hejiu', 'Your Honour, these are the bones from the pyre — black, and brittle as old charcoal. No sickness of the heart does that. And here are the ten taels Ximen Qing pressed into my hand at the funeral.');
      await s.emote('mag', '...', 1);
      await s.narrate('But Ximen Qing\'s silver had reached the magistrate first.');
      await s.say('official', 'Constable Wu, you are an officer of this court. You know better. Without the body there is no evidence. Don\'t believe what a boy says. A charge of murder is no small thing — I will not hear it.');
      await s.emote('player', 'anger', 1);
      await s.say('wusong:angry', '...Then I will see justice done myself.');
      s.face('hj', 'right'); s.face('yg', 'left');
      await s.say('yunge:sad', 'He didn\'t even look at the bones...');
      await s.say('hejiu:sad', 'Ximen Qing has dined with half the officials in this county. I feared it would go this way, Constable.');
      s.flag('ch7_evidence');
      // the magistrate withdraws; the two witnesses stay a while in the hall, and have a word for Wu Song if he asks
      s.idle('hj', ['I have kept the bones and the silver, Constable, and the paper with the day and the hour. Whatever you mean to do — they are yours, if they are ever needed.']);
      s.idle('yg', ['Uncle Wu was the only one in the street who ever gave me a pancake for nothing. Whatever you do, Constable... I won\'t tell anyone I saw you.']);
      s.despawn('mag', { leave: true }); s.despawn('hj'); s.despawn('yg');
    } }
  ]);
  WM.defEvents('yanggu', [
    // Yun Ge the pear-seller by the stream: he tells Wu Song the rest, and he and He Jiu go with him to the magistrate
    { id: 'ch7_yunge', x: 31, y: 14, npc: 'yunge', dir: 'down', ambientEmote: '...', cond: function (S2) { return S2.has('ch7_hejiutold') && !S2.has('ch7_yunge'); }, run: async function (s) {
      await s.say('yunge:sad', 'Constable Wu! You\'re back! I... I tried to help Uncle Wu, I did.');
      await s.say('wusong', 'Tell me everything, boy. Leave nothing out.');
      await s.say('yunge', 'Granny Wang let them use her back room, every afternoon — your sister-in-law and Ximen Qing. I told Uncle Wu, and he went to catch them, and Ximen Qing kicked him in the chest. He never got up again.');
      await s.say('wusong', '...You are a good boy. Come with me. We will tell the magistrate.');
      s.flag('ch7_yunge');
      s.hide('ch7_yunge'); WM.state.followers = ['hejiu', 'yunge']; WM.field.refreshFollowers();   // and the boy too
      s.mark([{ map: 'yanggu', x: 20, y: 9, w: 2 }], 'ch7_evidence');
      await s.say(null, '(Take He Jiu and Yun Ge to the county office, north up the main street.)');
    } },
    { id: 'ch7_revenge', x: 4, y: 23, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch7_evidence'); }, run: async function (s) {
      await s.narrate('Wu Song bought paper and a brush, and invited the neighbours to his brother\'s house for a meal of remembrance — a schoolmaster to write, and old men of the street as witnesses. He barred the door. Then before the spirit tablet he drew his knife, and made Granny Wang and Pan Jinlian tell the whole story, and the schoolmaster wrote it all down, and the neighbours signed it.');
      s.music('tense');
      await s.narrate('"Brother, your spirit is not far away. Today I avenge you." Before the spirit tablet of Wu Dalang, Wu Song killed Pan Jinlian. Then he asked the neighbours to keep Granny Wang under guard, and went out with his knife to find Ximen Qing.');
      s.flag('ch7_tolion');
      await s.say(null, '(Ximen Qing is drinking at the Lion Bridge tavern, north-east across the stream.)');
    } }
  ]);
  WM.defEvents('yanggu_in', [
    { id: 'ch7_lion', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_tolion') && WM.state.x >= 45 && WM.state.x <= 58; }, run: async function (s) {
      s.spawn('ximen', 'ximenqing', 52, 4, 'down');
      await s.say('ximenqing:shock', 'Wu Song!');
      await s.say('wusong:angry', 'Ximen Qing. My brother sends his greetings.');
      await s.battle('ch7_lion', { bg: 'interior', music: 'boss' });
      await s.narrate('Ximen Qing kicked the knife from Wu Song\'s hand and leapt for the window. Wu Song caught him by the leg and hurled him headfirst out of the window into the street below, then leapt down after him. There, in the street beneath the Lion Bridge tavern, the matter was ended.');
      s.hide('ximen'); s.despawn('ximen');   // out of the window, into the street below
      await s.narrate('Wu Song went straight to the county office with the confession, the bones, the silver and Granny Wang, and gave himself up. The magistrate, who had a conscience after all, wrote the report as mercifully as he could. Granny Wang was executed. Wu Song was beaten forty strokes, tattooed on the face, and exiled to Mengzhou, two thousand li away. The people of Yanggu gave him money and wine for the journey.');
      s.flag('ch7_exiled');
      WM.state.followers = ['constable', 'constable'];   // his two escorts walk with him to Mengzhou
      WM.unlock('crossslope', 'mengzhou');
      await s.warp('world', WM.worldAt('crossslope')[0], WM.worldAt('crossslope')[1], 'up');
      await s.say(null, '(Wu Song is sent to Mengzhou. The road north passes the inn at Cross Slope.)');
    } }
  ]);

  // ---------------- Cross Slope ----------------
  WM.defEvents('crossslope_in', [
    { id: 'ch7_slope1', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_exiled'); }, run: async function (s) {
      s.spawn('erniang', 'sunerniang', 8, 4, 'down');
      await s.narrate('On the way, at a place called Cross Slope, Wu Song and his two escorts stopped at a tavern under a great tree. The landlady was a young woman in a green skirt with a golden hairpin, wild flowers in her hair, and a red waistcoat that showed her arms.');
      await s.say('sunerniang:smile', 'Come in, come in! Good wine, and meat dumplings, hot!');
      await s.say('wusong', '(These dumplings... there\'s a hair in this one. A human hair.) Landlady, are these dumplings made of human meat or dog meat?');
      await s.say('sunerniang:smile', 'Ha! In the age of peace, who would make dumplings of men? You\'re joking, officer.');
      await s.say('wusong', '(Hm. Then let\'s see her wine.)');
      // (the escorts, behind him, drink the drugged wine and go down)
      await s.narrate('Wu Song had heard of the Cross Slope inn. When she brought hot wine, he poured it away when she turned her back, and then fell down with his eyes rolled up. The two escorts, who had drunk theirs, were already on the floor.');
      ['fol_0', 'fol_1'].forEach(function (k) { if (WM.field.findActor(k)) s.lie(k); });
      s.lie('player');
      await s.say('sunerniang:smile', 'Down! "Even the cleverest ghost drinks the footwash." Lads, take them to the butchery — start with the big one.');
      await s.narrate('Two of her men could not lift him, so she came herself. And as she bent to lift him, Wu Song seized her and pinned her down.');
      s.lie('player', false);
      await s.duel('wusong_sunerniang');
      s.spawn('zhangqing2', 'zhangqing2', 8, 6, 'up');
      await s.say('zhangqing2', 'Hero, spare her! She is my wife!');
      await s.say('zhangqing2', 'I am Zhang Qing, called the Gardener. We keep this inn, but we have three rules: never harm wandering monks, singing girls, or convicts on their way to exile — and we broke the third today. Forgive us! Aren\'t you Wu Song, who killed the tiger of Jingyang Ridge?');
      await s.say('wusong', 'I am. ...You honour a code, at least. Get up.');
      await s.narrate('So they became sworn brothers. Zhang Qing told Wu Song of the two monks who held Mount Erlong — Lu Zhishen and Yang Zhi — and Wu Song stayed three days before going on to Mengzhou.');
      ['fol_0', 'fol_1'].forEach(function (k) { if (WM.field.findActor(k)) s.lie(k, false); });   // the escorts are brought round with an antidote
      s.hide('erniang'); s.hide('zhangqing2'); s.despawn('erniang'); s.despawn('zhangqing2');   // (their standing selves below take over)
      s.flag('ch7_slope');
    } },
    // the inn at Cross Slope afterwards: the landlady, beaten and now a sworn sister, and her husband
    { id: 'ch7_erniang2', x: 8, y: 4, char: 'sunerniang', dir: 'down', cond: function (S2) { return S2.has('ch7_slope') && !S2.has('ch7_fugitive'); }, run: async function (s) {
      await s.say('sunerniang:smile', 'My wrists still ache! Twenty years I\'ve kept this inn, and no man ever pinned me like that. You\'ve a grip like a tiger, brother.');
      await s.say('sunerniang', 'Don\'t worry — your dumplings tonight are beef. Real beef. On my honour as your sister.');
      await s.say('wusong', '...I\'ll still look before I bite.');
      await s.say('sunerniang:smile', 'Ha! Clever man. If you\'re ever in trouble on this road, come to Cross Slope. We look after our own.');
    } },
    { id: 'ch7_zhangqing2', x: 8, y: 6, char: 'zhangqing2', dir: 'up', cond: function (S2) { return S2.has('ch7_slope') && !S2.has('ch7_fugitive'); }, text: ['Forgive my wife, brother. She has a temper, and the knives are always close to hand. But she keeps the three rules better than I do.'] }
  ]);

  // ---------------- Mengzhou: Shi En and the Happy Forest ----------------
  WM.defEvents('mengzhou', [
    { id: 'ch7_camp', x: 7, y: 9, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch7_slope'); }, run: async function (s) {
      WM.state.followers = []; WM.field.refreshFollowers();   // handed over at the camp: the escorts' work is done
      await s.narrate('At the Anping camp in Mengzhou, every new prisoner who did not pay received a hundred "welcoming strokes." Wu Song refused to pay a single copper. "Beat me if you like!" But the strokes never came. Instead, every day the guards brought him good food and wine, a bath, and a fresh bed.');
      s.spawn('shien', 'shien', 9, 12, 'up');
      await s.say('shien', 'Brother Wu Song. I am Shi En, son of the warden. It was I who had you spared and fed. I have a favour to ask, though I hardly dare.');
      await s.say('shien:sad', 'East of the city, at the Happy Forest, I kept a great tavern that took a fortune every day from the merchants on the road. Then a giant called Jiang Menshen — "Jiang the Door God" — came with Commander Zhang\'s favour behind him, beat me half to death, and took it. I can\'t win it back. But you killed a tiger with your fists...');
      await s.say('wusong', 'Then I\'ll take it back for you. One condition.');
      await s.say('shien', 'Anything.');
      await s.say('wusong', 'On the road to the Happy Forest, at every tavern we pass, I drink three bowls. "No three bowls, no crossing."');
      await s.say('shien:shock', 'But there are a dozen taverns on that road! You\'ll be falling over!');
      await s.say('wusong:smile', 'A little wine gives me one part of strength. A lot gives me five. The more I drink, the better I fight.');
      s.despawn('shien');
      s.flag('ch7_road');
      await s.say(null, '(Drink three bowls at each tavern along the road east, then face Jiang Menshen at the Happy Forest.)');
    } },
    { id: 'ch7_t1', x: 7, y: 23, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_road') && !S2.has('ch7_t1'); }, run: async function (s) { await s.say('tavernkeep', 'Three bowls? Coming up.'); s.sfx('item'); s.flag('ch7_t1'); await s.notice('Three bowls. One.', { auto: 1 }); } },
    { id: 'ch7_t2', x: 15, y: 23, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_road') && !S2.has('ch7_t2'); }, run: async function (s) { await s.say('tavernkeep', 'Three bowls, for the tiger-slayer!'); s.sfx('item'); s.flag('ch7_t2'); await s.notice('Three bowls. Two.', { auto: 1 }); } },
    { id: 'ch7_t3', x: 23, y: 23, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_road') && !S2.has('ch7_t3'); }, run: async function (s) { await s.say('tavernkeep', 'He\'s still standing! Three more!'); s.sfx('item'); s.flag('ch7_t3'); await s.notice('Three bowls. Three.', { auto: 1 }); } },
    { id: 'ch7_t4', x: 31, y: 23, npc: 'tavernkeep', cond: function (S2) { return S2.has('ch7_road') && !S2.has('ch7_t4'); }, run: async function (s) { await s.say('tavernkeep', 'Three bowls! Careful, officer, the road\'s swaying.'); s.sfx('item'); s.flag('ch7_t4'); await s.notice('Three bowls. Four — and the Happy Forest ahead.', { auto: 1.2 }); } },
    { id: 'ch7_jiang', x: 40, y: 24, w: 7, h: 1, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch7_t1') && S2.has('ch7_t2') && S2.has('ch7_t3') && S2.has('ch7_t4'); }, idle: { jiang: '(A huge man lounges in a folding chair under the locust trees, fanning himself and watching the tavern.) What are you staring at? Drink, if you can pay.' },
      run: async function (s) {
      s.spawn('jiang', 'jiangmenshen', 44, 25, 'left');
      await s.narrate('By the time he reached the Happy Forest, Wu Song had drunk his three bowls at more than a dozen taverns. He staggered into the tavern, insulted the barmaid — Jiang\'s new concubine — and threw her into the wine vat. Jiang Menshen, sitting in the shade under the trees, came running.');
      await s.say('jiangmenshen:angry', 'Drunk dog! You know whose tavern this is?!');
      await s.say('wusong:smile', 'Shi En\'s.');
      await s.battle('ch7_happy', { bg: 'plains', music: 'boss' });
      await s.narrate('Wu Song feinted with his fists and turned as if to run. As Jiang rushed after him, he spun and kicked him in the belly, then whirled and kicked him in the head with the other foot: the "Jade Ring Step" and the "Duck-and-Drake Kick." Jiang went down and did not get up.');
      await s.say('jiangmenshen:sad', 'Hero! Mercy! I\'ll give it back — I\'ll give it all back, and leave Mengzhou!');
      s.despawn('jiang', { leave: true });
      s.flag('ch7_happy');
      await s.narrate('Jiang Menshen returned the tavern, and Shi En\'s business flourished again. But Jiang had friends, and the friends had a plan.');
      await s.narrate('Commander Zhang of the Mengzhou garrison sent for Wu Song, made him a member of his household, and treated him like a son. On the night of the Mid-Autumn Festival he feasted him, and promised him his own maid, Yulan, as a wife. Late that night, a cry went up: "Thief!" Wu Song ran to help — and was seized, and in his trunk the guards "found" silver and gold plate from the commander\'s house.');
      await s.narrate('It was all a trap, laid by Jiang Menshen, Commander Zhang, and his cousin Captain Zhang. Wu Song was beaten, and sent off in a cangue to exile in Enzhou, with two escorts.');
      setWeapon('wusong', { name: 'Fists', range: 'S', pow: 1.15, fx: 'blunt' });
      WM.state.chars.wusong.equip.acc = 'cangue'; S.restore('wusong');
      s.flag('ch7_framed');
      // out of the Commander's gate in the cangue, with two escorts, east along the road to Enzhou
      WM.state.followers = ['constable', 'constable'];
      await s.warp('mengzhou', 44, 13, 'right');
      await s.say(null, '(Wu Song is marched out of Mengzhou in a cangue. Walk east along the road to Enzhou.)');
    } },
    // on the road out of the city, Shi En is waiting with two roast geese
    { id: 'ch7_geese', x: 50, y: 13, w: 3, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch7_framed') && !S2.has('ch7_totower'); }, run: async function (s) {
      s.spawn('se', 'shien', 53, 12, 'down');
      await s.emote('se', '!', 0.6);
      await s.walkTo('se', 52, 14); s.face('se', 'left'); s.face('player', 'right');
      await s.say('shien:sad', 'Brother! They told me nothing — I only heard this morning. Here, two roast geese for the road. Eat, while the escorts let you.');
      await s.say('wusong', 'Shi En. You came.');
      await s.say('shien', '(whispering) Listen. These two escorts — I saw them drinking with Jiang Menshen\'s men last night, and two more with swords went on ahead down this road. Be careful, brother. Watch them.');
      await s.say('wusong', '(quietly) I have been watching them since the gate.');
      await s.narrate('Wu Song ate the geese one-handed, in the cangue, while the escorts looked at each other and said nothing. Shi En watched them go, until the road turned.');
      s.despawn('se', { leave: true });
      // the road goes on to the Flying Cloud Pond (the escorts are there in the scene itself)
      WM.state.followers = []; WM.field.refreshFollowers();
      await s.warp('feiyun', 2, 7, 'right');
    } }
  ]);

  // ---------------- Flying Cloud Pond and the Mandarin Duck Tower ----------------
  WM.defEvents('feiyun', [
    { id: 'ch7_feiyun', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_framed'); }, run: async function (s) {
      s.spawn('e1', 'constable', 4, 7, 'right'); s.spawn('e2', 'constable', 4, 8, 'right');
      s.spawn('k1', 'bandit', 16, 7, 'left'); s.spawn('k2', 'bandit', 16, 8, 'left');
      await s.narrate('At the Flying Cloud Pond, two men with knives stepped out onto the bridge ahead, and the escorts drew back behind him.');
      await s.say('wusong:angry', '(So this is where it ends for me. Or for you.)');
      s.sfx('block'); await s.shake(4, 0.4);
      await s.narrate('Wu Song twisted his wrists, and the cangue split in two.');
      WM.state.chars.wusong.equip.acc = null; S.restore('wusong');
      await s.battle('ch7_feiyun', { bg: 'marsh', music: 'battle' });
      await s.narrate('When it was over, Wu Song held the last of them by the collar. "Who sent you?" "Jiang Menshen... and Commander Zhang, and Captain Zhang. They\'re waiting for us tonight at the Commander\'s residence, in the Mandarin Duck Tower, to hear that you\'re dead."');
      s.despawn('e1', { leave: true }); s.despawn('e2', { leave: true }); s.despawn('k1', { leave: true }); s.despawn('k2', { leave: true });
      await s.say('wusong:angry', '"Waiting to hear that I\'m dead." ...Then I will bring them the news myself.');
      setWeapon('wusong', { name: 'Knife', range: 'S', pow: 1.15 });
      s.flag('ch7_totower');
      s.night(true);
      await s.warp('mengzhou', 44, 12, 'up');
    } }
  ]);
  WM.defEvents('mengzhou_in', [
    { id: 'ch7_tower', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_totower') && WM.state.x >= 14 && WM.state.x <= 29; }, run: async function (s) {
      await s.narrate('Wu Song climbed over the wall of the residence in the dark. Up on the Mandarin Duck Tower, the lamps were lit, and three men were drinking and laughing: Commander Zhang, Captain Zhang, and Jiang Menshen.');
      await s.warp('mengzhou_in', 37, 7, 'up', { noFade: true });
      s.spawn('zd', 'zhangdujian', 37, 4, 'down'); s.spawn('zt', 'zhangtuanlian', 34, 4, 'down'); s.spawn('jm', 'jiangmenshen', 39, 4, 'down');
      await s.say('jiangmenshen:smile', '...They\'ll have finished him by now. Drink, Commander! To the end of Wu Song!');
      await s.say('wusong:angry', 'Wu Song is here.');
      await s.battle('ch7_tower', { bg: 'palace', music: 'boss' });
      s.lie('zd'); s.lie('zt'); s.lie('jm');   // all three dead in the Mandarin Duck Tower
      await s.narrate('That night in the Mandarin Duck Tower, and through the house below, Wu Song killed all who had plotted against him and many who stood in his way. Then he tore a strip from a dead man\'s robe, dipped it in blood, and wrote on the white wall: "The man who killed these is Wu Song, the slayer of the tiger."');
      await s.narrate('He gathered up the silver cups from the table, climbed over the city wall in the dark, and walked through the night, until he collapsed, exhausted, in a little temple — where four men with hooks caught him, and dragged him to a tavern to be butchered. And the tavern was Cross Slope, and the landlady was Sun Erniang.');
      s.night(false);
      s.flag('ch7_fugitive');
      await s.warp('crossslope_in', 8, 6, 'up');
    } }
  ]);
  WM.defEvents('crossslope_in', [
    { id: 'ch7_pilgrim', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_fugitive'); }, run: async function (s) {
      s.spawn('erniang', 'sunerniang', 8, 4, 'down'); s.spawn('zhangqing2', 'zhangqing2', 9, 5, 'down');
      await s.say('sunerniang:shock', 'Brother Wu Song?! Lads, let him go!');
      await s.say('zhangqing2', 'Every road in Mengzhou is watched. Posters with your face, and a reward of three thousand strings. You can\'t go anywhere as you are.');
      await s.say('sunerniang', 'Two years ago a pilgrim monk came through here, and... well, he left behind his things. A black robe, a headband, a string of a hundred and eight beads of human skull-bone, a certificate of ordination, and two snowflake steel swords that sing in the night. Let your hair down over your brand and wear them, and you\'ll be the pilgrim.');
      await s.say('wusong:smile', '...A monk. Well, why not? Lu Zhishen made a fine monk.');
      setWeapon('wusong', null);
      WM.state.chars.wusong.weapon = null;
      WM.state.chars.wusong.equip.body = 'monkrobe';
      await s.notice('Wu Song became the Pilgrim. (Twin Snowflake Blades)', { auto: 2 });
      await s.say('zhangqing2', 'Go to Mount Erlong. Lu Zhishen and Yang Zhi hold it. They\'ll take you in.');
      s.despawn('erniang', { leave: true }); s.despawn('zhangqing2');
      s.flag('ch7_isPilgrim');
      await s.narrate('So Wu Song the Pilgrim set out for Mount Erlong. It was the tenth month, and the nights were cold. As he crossed Centipede Ridge in the moonlight, he saw a light in a hermitage among the pines, and heard a woman laughing — and a man.');
      await s.warp('centipede', 15, 21, 'up');
    } }
  ]);
  WM.defEvents('centipede_in', [
    { id: 'ch7_daoist', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_isPilgrim'); }, run: async function (s) {
      s.spawn('daoist', 'daoistwang', 5, 4, 'down');
      await s.say('daoistwang:angry', 'Who comes knocking at this hour? A monk? Get out, or my swords will see you out!');
      await s.battle('ch7_daoist', { bg: 'interior', music: 'boss' });
      s.despawn('daoist', { leave: true });
      s.spawn('woman', 'woman', 8, 4, 'down');
      await s.say('woman:sad', 'Thank you, master monk... He killed my father and mother and my brother and kept me here. He calls himself a Daoist, but he is a wolf.');
      await s.narrate('Wu Song gave her the Daoist\'s silver and sent her home, and burned the hermitage behind him. Then he went on towards Qingzhou. At a village inn near White Tiger Mountain, cold and thirsty, he drank, and saw a chicken and a jar of good wine being prepared for someone else — and took them.');
      s.despawn('woman', { leave: true });
      s.flag('ch7_tokong');
      WM.unlock('kongmanor');
      await s.warp('kongmanor', 9, 15, 'up');
    } }
  ]);
  WM.defEvents('kongmanor', [
    { id: 'ch7_kong', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch7_tokong'); }, run: async function (s) {
      s.spawn('kongliang', 'kongliang', 12, 15, 'left');
      await s.narrate('Wu Song, in his pilgrim\'s robe, came stumbling through the snow and found men sitting round a fire with a jar of wine and a boiled chicken. He took the jar without asking, and drank.');
      await s.say('kongliang:angry', 'You thieving drunk of a monk! That wine is mine, and this is my father\'s land!');
      await s.say('wusong', 'Yours? Then I paid for it already — with my fists.');
      await s.duel('wusong_kongliang', { canLose: true });
      await s.narrate('Wu Song threw Kong Liang into the stream. Then, staggering after a yellow dog that barked at him, he fell into the icy water himself, and was too drunk to get out. Kong Liang\'s men fished him out, tied him to a tree, and beat him with willow switches — until the elder Kong brother came out with a guest to see what the noise was about. The guest was Song Jiang.');
      s.despawn('kongliang', { leave: true });
      s.spawn('songjiang', 'songjiang', 15, 12, 'down'); s.spawn('kongming', 'kongming', 16, 12, 'down');
      await s.move('songjiang', 'D2', { run: true });
      await s.say('songjiang:shock', 'Stop! This is my brother Wu Song!');
      await s.say('wusong:shock', '...Brother Song?!');
      await s.narrate('The Kong brothers, who had learned the spear from Song Jiang, untied him and begged his pardon. And that night Wu Song and Song Jiang talked until dawn of everything that had happened since they parted at Chai Jin\'s manor.');
      await s.say('songjiang', 'Brother, my old friend Hua Rong is deputy commander of Qingfeng Fort, near here. Come with me.');
      await s.say('wusong', 'Brother, I have killed too many men. The posters are everywhere. If I go with you, I\'ll bring trouble on you, and on Hua Rong. Lu Zhishen and Yang Zhi are at Mount Erlong. I\'ll go to them. If the court ever pardons us, I\'ll come to you.');
      await s.say('songjiang:sad', '...Then we part again. Brother, take care of yourself. And drink less.');
      await s.say('wusong:smile', 'Never.');
      s.despawn('songjiang', { leave: true }); s.despawn('kongming', { leave: true });
      s.flag('ch7_done');
      await s.endChapter();
      if (WM.data.chapters[8].begin) await WM.data.chapters[8].begin(s);
    } }
  ]);
})();
