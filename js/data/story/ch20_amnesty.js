// Chapter 20 — "Amnesty" (novel chapters 72–82).
// Song Jiang's secret visit to the capital at the Lantern Festival and Li Shishi; Li Kui's rampage and his thorns;
// Yan Qing wrestles Ren Yuan at Mount Tai; the first amnesty and the village wine; Tong Guan and the Nine Palaces;
// Gao Qiu's three campaigns, Hua Rong's arrow, Zhang Shun's drill; Yan Qing before the emperor; Su Yuanjing's edict.
// Condensed (narrated): the Di manor "ghost", Li Kui as magistrate of Shouzhang, Gao Qiu's first land battles.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('lishishi', 'Li Shishi', { skin: '#fbefe0', hairStyle: 'woman', body: '#e8d8f0', trim: '#b04a8a', dress: true, build: 'slim', face: 'oval', eyes: 'narrow', flower: '#ff80a0', lips: '#c84060', pin: '#ffe080' }, { face: true });
  WM.npc('huizong', 'The Emperor', { skin: '#fbe8d0', hairStyle: 'futou', beard: 'short', body: '#e8c840', trim: '#c83a1a', face: 'oval', eyes: 'narrow' }, { face: true });
  WM.npc('yangjian', 'Marshal Yang', { skin: '#f0c49a', hairStyle: 'futou', beard: 'mustache', body: '#5a2a5a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('renyuan', 'Ren Yuan', { skin: '#c8905e', hairStyle: 'topknot', body: '#7a3a2a', trim: '#d8b36a', build: 'big', face: 'square', eyes: 'narrow', chest: true }, { face: true });
  WM.npc('chenzongshan', 'Chen Zongshan', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', body: '#2a3a6a', trim: '#d8b36a', face: 'long' }, { face: true });
  WM.npc('zhangganban', 'Secretary Zhang', { skin: '#f0d0b0', hairStyle: 'futou', body: '#3a3a3a', trim: '#8a6a3a', face: 'narrow', eyes: 'sharp', brows: 'angled' }, { face: true });
  WM.npc('tongguan', 'Tong Guan', { skin: '#f6dcc4', hairStyle: 'helmet', helmColor: '#d8b040', tassel: '#c8302a', body: '#7a1a1a', trim: '#e8c860', face: 'round', eyes: 'narrow' }, { face: true });

  var hum = WM.hum, C = WM.data.chars;
  WM.enemy('kf_guard', 'Palace Guard', 33, hum(WM.enemyLooks.soldier), { range: 'M', exp: 190, drops: [['medicine', 0.15]] });
  WM.enemy('niutou_bandit', 'Niutou Bandit', 31, hum(WM.enemyLooks.bandit2), { hp: 0.7, atk: 0.65, exp: 170, fx: 'blunt' });
  WM.enemy('wangjiang_foe', 'Wang Jiang', 32, hum(WM.enemyLooks.bandit), { hp: 1.2, atk: 0.7, exp: 300, gold: 300, boss: true });
  WM.enemy('donghai_foe', 'Dong Hai', 32, hum(WM.enemyLooks.bandit2), { hp: 1.2, atk: 0.7, exp: 300, gold: 300, boss: true, fx: 'blunt' });
  WM.enemy('gaofleet', 'Marine of the Sea-Eel Ships', 34, hum(WM.enemyLooks.soldier), { range: 'M', exp: 200 });
  var T = WM.data.troops;
  T.ch20_riot = { enemies: ['kf_guard', 'kf_guard', 'kf_guard'], bg: 'night', noRun: true };
  T.ch20_niutou = { enemies: ['niutou_bandit', 'wangjiang_foe', 'donghai_foe', 'niutou_bandit'], bg: 'forest', boss: true };
  T.ch20_ship = { enemies: ['gaofleet', 'gaofleet', 'gaofleet'], bg: 'river', noRun: true };

  WM.data.duels.yanqing_renyuan = {
    hero: 'yanqing', foe: 'renyuan', bg: 'palace', heroHp: 520, heroAtk: 46, foeHp: 640, foeAtk: 54,
    intro: [['foe:angry', '"Fists that strike the southern mountain tigers; feet that kick the northern sea dragons." Who are you, little one, to tear down my banner?'], ['hero:smile', 'Just a pedlar from Shandong. Shall we?']],
    lines: { attack: ['Hah!', 'Grab!', 'There!'], wild: ['The Pillar That Props Up Heaven!', 'Crush!', 'Down!'], defend: ['Hm.', 'Come on.', 'Too slow.'] },
    win: [[null, 'Yan Qing slipped under Ren Yuan\'s arm, caught him, heaved him up onto his shoulder, spun round and round — the "pigeon\'s turn" — and threw him headfirst off the platform.']],
    lose: [[null, 'Ren Yuan thought he had him — but Yan Qing slipped under his arm, heaved him onto his shoulder, spun — the "pigeon\'s turn" — and threw him off the platform.']]
  };
  WM.data.duels.yanqing_gaoqiu = {
    hero: 'yanqing', foe: 'gaoqiu', bg: 'palace', heroHp: 520, heroAtk: 40, foeHp: 380, foeAtk: 30,
    intro: [['foe:smile', 'I was the best wrestler in the capital, you know. There\'s no man in the empire can throw me.'], ['hero:smile', 'Then, Your Excellency, a friendly bout on the felt?']],
    lines: { attack: ['Hup!', 'Ha!', 'There!'], wild: ['Capital style!', 'Watch this!', 'Hah!'], defend: ['Hmph.', 'Come on.', 'Er...'] },
    win: [[null, 'Yan Qing threw Gao Qiu flat on the felt, and he lay there and could not get up.']],
    lose: [[null, 'Yan Qing let him push for a while, and then threw Gao Qiu flat on the felt, and he lay there and could not get up.']]
  };

  WM.data.wars.ch20_tongguan = {
    name: 'The Nine Palaces and Eight Trigrams', goal: 'commander', turns: 12, music: 'war',
    map: [
      '..............',
      '.mm.......TT..',
      '..............',
      '..............',
      '..............',
      '.mm.......TT..',
      '..............'
    ],
    player: [
      { leader: 'songjiang', support: ['gongsunsheng', 'wuyong'], type: 'inf', x: 1, y: 3, commander: true },
      { leader: 'qinming', support: ['shantinggui', 'weidingguo'], type: 'cav', x: 3, y: 3 },
      { leader: 'guansheng', support: ['xuanzan', 'haosiwen'], type: 'cav', x: 2, y: 1 },
      { leader: 'linchong', support: ['huangxin', 'sunli'], type: 'cav', x: 2, y: 5 },
      { leader: 'huyanzhuo', support: ['hantao', 'pengqi'], type: 'cav', x: 0, y: 2 },
      { leader: 'dongping', support: ['oupeng', 'dengfei'], type: 'cav', x: 0, y: 4 }
    ],
    enemy: [
      { name: 'Tong Guan', portrait: 'tongguan', type: 'cav', atk: 120, def: 110, x: 12, y: 3, commander: true },
      { name: 'Feng Mei', type: 'cav', atk: 112, def: 100, x: 10, y: 2 },
      { name: 'Bi Sheng', type: 'cav', atk: 110, def: 100, x: 10, y: 4 },
      { name: 'Imperial Cavalry', type: 'cav', atk: 108, def: 100, x: 9, y: 1 },
      { name: 'Imperial Foot', type: 'inf', atk: 102, def: 108, x: 9, y: 5 },
      { name: 'Imperial Archers', type: 'arch', atk: 100, def: 74, x: 13, y: 2 }
    ],
    intro: [['wuyong', 'Qin Ming to the south, Guan Sheng east, Lin Chong west, Huyan Zhuo north; Dong Ping, Suo Chao, Shi Jin and Yang Zhi at the four corners; Brother Song Jiang in the centre under the yellow banners.'], ['tongguan:shock', '...These are no bandits. This is an army.'], [null, 'Victory: rout Tong Guan.']],
    events: [{ turn: 3, run: async function (s, api) {
      await s.say(null, 'Flags rose on every hill — the ambush from ten sides. Zhu Tong and Lei Heng under yellow, Qin Ming and Guan Sheng under red and blue, Huyan Zhuo and Lin Chong under black and white. Tong Guan\'s generals fell one after another.');
      s.sfx('drum'); api.weaken('enemy', 0.7);
    } }],
    win: [['songjiang', 'Let him go. Do not pursue. We want a pardon, not his head.']], lose: [['songjiang:sad', 'Fall back!']]
  };
  WM.data.wars.ch20_gaoqiu = {
    name: 'The Sea-Eel Ships', goal: 'commander', turns: 10, music: 'war',
    map: [
      'rr~~~~~~~~~~~~',
      'r~~~~~~~~~~~~~',
      '~~~rr~~~~~~~~~',
      '~~~~~~~~~~~~~~',
      '~~~rr~~~~~~~~~',
      'r~~~~~~~~~~~~~',
      'rr~~~~~~~~~~~~'
    ],
    player: [
      { leader: 'lijun', support: ['tongwei', 'tongmeng'], type: 'naval', x: 1, y: 3, commander: true },
      { leader: 'zhangshun', support: ['zhangheng'], type: 'naval', x: 3, y: 3 },
      { leader: 'ruanxiaoer', type: 'naval', x: 2, y: 1 },
      { leader: 'ruanxiaowu', type: 'naval', x: 2, y: 5 },
      { leader: 'ruanxiaoqi', type: 'naval', x: 0, y: 2 },
      { leader: 'lingzhen', type: 'arch', x: 0, y: 4 }
    ],
    enemy: [
      { name: 'Gao Qiu\'s Flagship', portrait: 'gaoqiu', type: 'naval', atk: 104, def: 120, x: 12, y: 3, commander: true },
      { name: 'Sea-Eel Ship', type: 'naval', atk: 104, def: 112, x: 10, y: 1 },
      { name: 'Sea-Eel Ship', type: 'naval', atk: 104, def: 112, x: 10, y: 5 },
      { name: 'Sea-Eel Ship', type: 'naval', atk: 104, def: 112, x: 11, y: 3 }
    ],
    intro: [['zhangshun', 'Those paddle-wheel ships are like floating forts. But every ship has a bottom.'], [null, 'Victory: sink Gao Qiu\'s flagship.']],
    events: [{ turn: 2, run: async function (s, api) {
      await s.say(null, 'Zhang Shun\'s divers swam under the great ships with augers and bored through their hulls. One after another the Sea-Eel ships began to settle in the water.');
      s.sfx('splash'); api.weaken('enemy', 0.6);
    } }],
    win: [['zhangshun', 'I\'ve got Marshal Gao by the collar! In you go!']], lose: [['lijun:sad', 'Back into the reeds!']]
  };

  WM.data.chapters[20].begin = async function (s) {
    await s.chapter(20);
    s.party(['songjiang', 'chaijin', 'daizong', 'yanqing', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    ['songjiang', 'chaijin', 'daizong', 'yanqing', 'likui'].forEach(function (id) { s.level(id, 34); });
    await s.narrate('Some months after the Grand Assembly, travellers came through with lanterns from Laizhou for the capital. Song Jiang, against everyone\'s advice, decided to see the Lantern Festival in the Eastern Capital with his own eyes — and perhaps find a way to the emperor\'s ear. He went in disguise, with Chai Jin, Dai Zong, Yan Qing and Li Kui; and Shi Jin, Mu Hong, Lu Zhishen, Wu Song, Zhu Tong and Liu Tang followed in twos and threes.');
    var atTablet = WM.field.map && WM.field.map.id === 'liangshan';   // (a chapter jump starts here with no map yet)
    if (atTablet) s.spawn('wy', 'wuyong', 32, 13, 'down');
    await s.say('wuyong', 'Brother Li Kui, you will stay at the inn and guard the door, and you will not move.');
    if (atTablet) s.despawn('wy');
    WM.unlock('kaifeng');
    s.night(true);
    s.flag('ch20_lantern');
    await s.warp('kaifeng', 29, 40, 'up', { noFade: true });
    await s.fadeIn(1);
    await s.say(null, '(The singing-girl Li Shishi, whom the emperor himself visits, lives in the north-east of the city.)');
  };
  WM.data.chapters[20].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 19; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall'); s.flag('grand_assembly');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 34); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'zhugui', 'yuncheng', 'jiangzhou', 'gaotang', 'qingzhou', 'daming', 'dongping', 'dongchang');
    await WM.data.chapters[20].begin(s);
  };

  // ---------------- the Lantern Festival ----------------
  WM.defEvents('kaifeng_in', [
    { id: 'ch20_shishi', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch20_lantern') && WM.state.x >= 27 && WM.state.x < 37 && WM.state.y >= 11 && WM.state.y < 20; }, run: async function (s) {
      s.spawn('ls', 'lishishi', 31, 13, 'down');
      s.spawn('mm', 'oldwoman', 30, 16, 'right'); s.spawn('yq0', 'yanqing', 32, 16, 'left');
      await s.say('yanqing', '(as a rich merchant\'s steward) Madam, my master is a great merchant from Shandong. A little something, for your trouble.');
      s.sfx('coins'); await s.emote('mm', 'heart');
      await s.say('oldwoman:smile', 'Oh! Oh my. Daughter — come and greet these generous gentlemen yourself!');
      s.despawn('mm', { leave: true }); s.despawn('yq0');
      await s.say('lishishi:smile', 'Gentlemen from Shandong? Welcome. Will you take a cup of wine?');
      s.sfx('item'); await s.emote('player', 'note');
      await s.say('songjiang', '(warm with wine) Brush and paper, if you would... (writing) "Where the lakes of Shandong meet the sky, the men of the marsh wait, loyal at heart... waiting for the golden cock of pardon to come down from heaven."');
      await s.say('lishishi', '...A strange song for a merchant.');
      s.spawn('mm', 'oldwoman', 29, 16, 'up');
      await s.say('oldwoman:shock', 'Daughter! His Majesty has come — through the passage to the back gate!');
      s.despawn('mm');
      await s.say('songjiang', '(The emperor! He is here — in the next room. If I could only kneel before him, and tell him...)');
      s.despawn('ls');
      await s.walkTo('player', 32, 15);
      s.spawn('lk', 'likui', 31, 17, 'up');
      s.spawn('yj', 'yangjian', 32, 18, 'up');
      await s.walkTo('yj', 32, 17);
      s.face('lk', 'right'); s.face('yj', 'left');
      await s.say('yangjian:angry', 'Who is this ruffian squatting in the doorway? Out of the way!');
      await s.say('likui:angry', 'Ruffian?! The emperor gets to drink with the pretty girl, and I have to sit at the door?!');
      await s.jump('lk', 8); s.sfx('hit'); await s.flash(); await s.shake(6, 0.4);
      s.lie('yj');
      await s.say('songjiang:shock', 'Iron Ox — NO!');
      s.walkTo('lk', 31, 14, { run: true }); s.sfx('slash'); await s.wait(0.4); s.sfx('fire');
      s.tint('fire'); await s.shake(3, 0.4);
      await s.say('likui:angry', 'Paintings! Down with them! And burn the lot!');
      s.spawn('hz', 'huizong', 35, 14, 'down'); s.spawn('eu', 'servant', 35, 15, 'left');
      await s.say('servant', 'Majesty! Fire! This way — back through the passage, quickly!');
      s.walkTo('hz', 35, 13, { run: true }); await s.walkTo('eu', 35, 14, { run: true });
      WM.data.clear(s, ['hz', 'eu']);
      await s.say('songjiang:sad', '(The emperor — gone. So close... and gone.)');
      s.tint(null);
      s.despawn('yj'); s.despawn('lk');
      s.flag('ch20_riot');
      await s.battle('ch20_riot', { bg: 'night' });
      await s.fadeOut(0.6);
      await s.warp('kaifeng', 29, 38, 'down', { noFade: true });
      s.spawn('lz', 'luzhishen', 28, 43, 'up'); s.spawn('ws', 'wusong', 31, 43, 'up'); s.spawn('sj2', 'shijin', 29, 42, 'up'); s.spawn('mh', 'muhong', 30, 42, 'up');
      await s.fadeIn(0.6);
      await s.say('luzhishen', 'Brother! The gate\'s ours — we forced it from outside! This way, quick!');
      await s.move('player', 'D4', { run: true });
      await s.fadeOut(0.8);
      WM.data.clear(s, ['lz', 'ws', 'sj2', 'mh']);
      s.night(false);
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);

  // ---------------- Li Kui's thorns; Mount Tai ----------------
  WM.defEvents('liangshan_in', [
    { id: 'ch20_thorns', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch20_riot') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      await s.narrate('On the way home, Li Kui and Yan Qing stopped at the Liu family farm. Two men calling themselves "Song Jiang of Liangshan" had carried off Squire Liu\'s daughter.');
      s.spawn('sj', 'songjiang', 15, 5, 'down');
      s.spawn('lk', 'likui', 16, 13, 'up');
      await s.walkTo('lk', 15, 8, { run: true });
      await s.say('likui:angry', 'Song Jiang! You lecher! You hypocrite! "Act on Heaven\'s Behalf" — I\'ve just chopped that banner down! You carried off old Liu\'s daughter!');
      await s.say('songjiang:shock', 'Iron Ox — what are you saying? I have never been near the Liu farm!');
      await s.say('likui:angry', 'Then come and let old Liu look at you! If he says it\'s you, I take your head. If he says it isn\'t — I\'ll give you mine!');
      await s.fadeOut(0.8); await s.wait(0.4); await s.fadeIn(0.8);
      await s.say(null, '(At the Liu farm, old Squire Liu looks long at Song Jiang, and shakes his head: "That is not the man.")');
      s.despawn('lk');
      s.spawn('lk', 'likui', 16, 13, 'up');
      await s.walkTo('lk', 15, 8);
      await s.jump('lk');
      await s.say('likui:sad', 'Brother... I\'ve come with thorns on my back. Beat me as much as you like. Or take my head — I lost the bet.');
      await s.say('songjiang', 'I want neither. Bring back the girl, and the men who used my name, and we will say no more.');
      s.despawn('lk', { leave: true }); s.despawn('sj', { leave: true });
      s.party(['likui', 'yanqing']); s.setLeader('likui'); s.flag('protagonist', 'likui');
      await s.narrate('They found the impostors on Niutou Mountain: Wang Jiang and Dong Hai.');
      await s.battle('ch20_niutou', { bg: 'forest' });
      await s.narrate('Li Kui and Yan Qing brought the girl home to her father and the two heads to Song Jiang. Not long after, pilgrims passing below the mountain spoke of the wrestler Ren Yuan, the Pillar That Props Up Heaven, who had been champion at Mount Tai for two years and boasted that no man in the empire could throw him.');
      await s.say('yanqing', 'Brother, let me go to Mount Tai. I\'ll throw him off his own platform.');
      s.party(['yanqing']); s.setLeader('yanqing'); s.flag('protagonist', 'yanqing');
      WM.unlock('taishan');
      s.flag('ch20_wrestle');
      await s.say(null, '(Mount Tai lies east of Liangshan.)');
    } }
  ]);
  WM.defEvents('taishan', [
    { id: 'ch20_renyuan', x: 12, y: 12, w: 12, h: 7, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch20_wrestle'); }, run: async function (s) {
      s.spawn('ry', 'renyuan', 18, 13, 'down');
      s.spawn('a1', 'villager', 10, 15, 'right'); s.spawn('a2', 'merchant', 25, 15, 'left'); s.spawn('a3', 'villager2', 11, 16, 'right'); s.spawn('a4', 'monk', 24, 16, 'left');
      await s.narrate('The whole country seemed to have come to the Temple of the Eastern Peak.');
      await s.say('renyuan', 'Two years champion of Mount Tai! "The Pillar That Props Up Heaven" — read my placard! No man in the empire can throw me!');
      await s.walkTo('player', 17, 11, { run: true });
      s.sfx('slash'); await s.shake(2, 0.2);
      await s.say('yanqing', '(as a pedlar, tearing the placard down) Then let a pedlar from Shandong try.');
      ['a1', 'a2', 'a3', 'a4'].forEach(function (k) { s.emote(k, '!', 0.8); });
      await s.walkTo('player', 18, 15);
      s.face('player', 'up'); s.face('ry', 'down');
      await s.duel('yanqing_renyuan', { hero: 'yanqing', canLose: true });
      s.lie('ry');
      await s.say('villager', 'He threw him! The pedlar threw Ren Yuan off his own platform!');
      var dsc = WM.data.troop(s, 'ds', 'bandit', [[14, 13], [22, 13], [13, 16], [23, 16]], 'down');
      var dspot = [[17, 13], [19, 13], [17, 14], [19, 14]]; dsc.forEach(function (k, i) { s.walkTo(k, dspot[i][0], dspot[i][1], { run: true }); });
      s.spawn('lk', 'likui', 12, 19, 'up');
      await s.say('likui:angry', 'Leave Little Yi alone, you dogs!');
      await s.walkTo('lk', 17, 14, { run: true });
      s.sfx('crit'); await s.flash(); await s.shake(5, 0.4);
      await s.say('yanqing', 'Brother Li Kui?! — Never mind. Over the roofs, now!');
      s.walkTo('lk', 16, 25, { run: true }); await s.walkTo('player', 17, 25, { run: true });
      s.hide('player');
      await s.fadeOut(0.8);
      WM.data.clear(s, ['ry', 'a1', 'a2', 'a3', 'a4', 'lk'].concat(dsc));
      s.show('player');
      await s.fadeIn(0.6);
      await s.say(null, '(Lu Junyi\'s men, whom Song Jiang had sent after them, covered their escape.)');
      await s.narrate('On the way home Li Kui went into Shouzhang county, put on the magistrate\'s robes, tried a case, sentenced the winner and let the loser go, and frightened a schoolroom of children half to death, before Mu Hong found him and dragged him back to the mountain.');
      s.flag('ch20_tai');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);

  // ---------------- the first amnesty; Tong Guan; Gao Qiu ----------------
  WM.defEvents('liangshan_in', [
    { id: 'ch20_first', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch20_tai') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.party(['songjiang', 'lujunyi', 'wuyong', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.narrate('In the capital, a censor proposed that the men of Liangshan be offered a pardon. Marshal Chen Zongshan was sent with an edict and ten jars of imperial wine — and with him went Secretary Zhang from Cai Jing\'s household and Officer Li from Gao Qiu\'s, to make sure he was not too kind.');
      await s.fadeOut(0.6);
      await s.warp('liangshan', 24, 40, 'down', { noFade: true });
      s.hide('player');
      s.spawn('rq', 'ruanxiaoqi', 18, 45, 'right'); s.boat('rq');
      s.spawn('cz', 'chenzongshan', 17, 45, 'right'); s.spawn('zg', 'zhangganban', 16, 45, 'right'); s.boat('cz'); s.boat('zg');
      await s.camera(18, 43, 0.05);
      await s.fadeIn(0.6);
      await s.say('ruanxiaoqi', '(rowing) Ai! A leak! The boat\'s sprung a leak! Your Excellencies — look, there, at the stern! Bail, bail!', { top: true });
      s.face('cz', 'left'); s.face('zg', 'left');
      await s.emote('cz', '!'); await s.emote('zg', 'sweat');
      s.face('rq', 'right');
      s.sfx('item'); await s.emote('rq', 'heart');
      await s.say('ruanxiaoqi', '(drinking from one of the imperial jars, quietly) Mmm! That\'s the emperor\'s own. ...And another. ...And now — the village wine back in, to the brim. Nobody\'ll know.', { top: true });
      s.face('cz', 'right'); s.face('zg', 'right');
      await s.say('ruanxiaoqi', 'Ah — false alarm, Your Excellencies! Only a splash. Nearly there!', { top: true });
      await s.fadeOut(0.6);
      WM.data.clear(s, ['rq', 'cz', 'zg']);
      s.cameraReset(); s.show('player');
      await s.warp('liangshan_in', 16, 12, 'up', { noFade: true });
      s.spawn('cz', 'chenzongshan', 15, 5, 'down'); s.spawn('zg', 'zhangganban', 17, 6, 'down');
      await s.fadeIn(0.6);
      await s.say('zhangganban', '(reading) "...Should you persist in your stubbornness, the heavenly army shall come, and not a child shall be spared."');
      await s.say('likui:angry', 'Whose edict is this?! The emperor is named Song — and so is my brother! Why shouldn\'t my brother be emperor too?!');
      s.spawn('lk', 'likui', 16, 10, 'up');
      await s.walkTo('lk', 17, 7, { run: true });
      s.sfx('slash'); await s.shake(3, 0.3); await s.emote('zg', '!');
      await s.say(null, '(Li Kui snatches the edict and tears it to pieces.)');
      s.spawn('lu', 'lujunyi', 14, 9, 'up');
      s.walkTo('player', 16, 8, { run: true }); await s.walkTo('lu', 18, 8, { run: true });
      await s.say('songjiang:shock', 'Iron Ox — hold! Brother Lu, help me hold him!');
      s.despawn('lk', { to: [16, 13] });
      await s.say('songjiang', 'Your Excellency, forgive him. Let us drink the emperor\'s wine, and calm ourselves.');
      s.sfx('item');
      await s.say('lujunyi:shock', '...This is no imperial wine. This is village wine — the rough stuff they sell by the roadside!');
      s.spawn('lz', 'luzhishen', 12, 8, 'right'); s.spawn('ws', 'wusong', 20, 8, 'left'); s.spawn('lt', 'liutang', 13, 10, 'up');
      await s.say('luzhishen:angry', 'Village wine — for the heroes of Liangshan? Is this how the court mocks us?!');
      s.walkTo('player', 16, 6, { run: true });
      await s.say('songjiang', '(standing between them and the envoys) Brothers, no! No hand will be raised against an envoy of the emperor while I live. Take Their Excellencies safely down the mountain.');
      WM.data.clear(s, ['lz', 'ws', 'lt', 'lu']);
      s.despawn('cz'); s.despawn('zg');
      await s.say('wuyong', 'There will be war now, brother. Be ready.');
      await s.narrate('The court sent Tong Guan, Privy Councillor, with a hundred thousand men.');
      s.party(['songjiang', 'gongsunsheng', 'wuyong', 'lujunyi']); s.level('gongsunsheng', 33);
      await WM.data.warCouncil(s, {
        beside: 'wuyong', generals: ['lujunyi', 'gongsunsheng', 'guansheng', 'linchong', 'huyanzhuo', 'dongping'],
        scout: { lines: ['Tong Guan is at Jizhou, brother! Eight regional commanders under him, a hundred thousand men, and he swears to sweep the marsh clean in ten days.'] },
        lines: [['wuyong', 'He comes in one long column, proud and in a hurry. Let us meet him on the plain with the formation of the Nine Palaces and the Eight Trigrams — and hide our men on every side of it. When he turns, there will be an army wherever he looks.'], ['songjiang', 'We fight only to be pardoned, not to overthrow anyone. Take the officers alive where you can.']]
      });
      await s.war('ch20_tongguan');
      await s.warp('liangshan_in', 16, 12, 'up');   // back up the mountain after the battle
      await s.narrate('Tong Guan fled to the capital. Then Gao Qiu came with ten regional commanders and a fleet, and was beaten on land and on the water. He had a new edict drawn up. When it was read before the walls of Jizhou, it said: "...except Song Jiang, Lu Junyi and all others great and small are pardoned." With the comma in the wrong place, every man was pardoned but the one who mattered.');
      s.spawn('hr', 'huarong', 15, 7, 'up');
      await s.say('huarong:angry', 'Except Song Jiang? Look at Hua Rong\'s arrow!');
      s.sfx('arrow'); await s.flash();
      await s.narrate('Hua Rong shot the reader of the edict through the face. Gao Qiu built great paddle-wheel ships, the Sea-Eels, and came a third time.');
      s.despawn('hr', { leave: true });
      s.spawn('zs0', 'zhangshun', 16, 8, 'up');
      await s.say('zhangshun:smile', 'Let him come in his eel-ships, brother. The water is ours. While his paddle-wheels turn, my men will be underneath them with augers.');
      s.despawn('zs0');
      await s.war('ch20_gaoqiu');
      s.flag('ch20_gao');
      s.spawn('gq', 'gaoqiu', 16, 13, 'up'); s.spawn('zs1', 'zhangshun', 17, 13, 'up');
      s.walkTo('zs1', 17, 8); await s.walkTo('gq', 16, 8);
      await s.say('zhangshun:smile', 'Brother — one Marshal of the Imperial Guard, fished out of the lake like a drowned rat!');
      await s.emote('gq', 'sweat');
      await s.say('songjiang', 'Fresh clothes for His Excellency — at once! And the seat of honour.');
      s.despawn('zs1', { leave: true });
      await s.walkTo('gq', 15, 6); s.face('gq', 'down');
      await s.walkTo('player', 15, 8); s.face('player', 'up');
      await s.jump('player', 3);
      await s.say('songjiang', 'Your Excellency, forgive us. We have never wished to rebel. We beg only for the emperor\'s pardon.');
      await s.say('gaoqiu:smile', 'Hm, hm... Yes. Of course. I shall speak to His Majesty myself. ...You know, when I was young, there was no wrestler in the capital who could throw me.');
      await s.duel('yanqing_gaoqiu', { hero: 'yanqing', canLose: true });
      await s.say('gaoqiu:sad', '...I swear it before Heaven: I will see you pardoned. If I go back on my word, let Heaven not cover me nor Earth bear me.');
      s.despawn('gq', { leave: true });
      await s.narrate('Song Jiang let him go, with Xiao Rang and Yue He to carry the petition. Gao Qiu left one of his staff, Wen Huanzhang, on the mountain as a pledge. And as soon as Gao Qiu was home, he locked Xiao Rang and Yue He in his own house and said nothing to the emperor at all.');
      s.flag('away:xiaorang'); s.flag('away:yuehe');
      await s.say('wuyong', 'As I thought. Brother — send Yan Qing to Li Shishi. And Dai Zong with him.');
      s.party(['yanqing', 'daizong']); s.setLeader('yanqing'); s.flag('protagonist', 'yanqing');
      s.flag('ch20_shishi2');
      await s.warp('kaifeng', 29, 40, 'up');
    } }
  ]);
  WM.defEvents('kaifeng_in', [
    { id: 'ch20_emperor', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch20_shishi2') && WM.state.x >= 27 && WM.state.x < 37 && WM.state.y >= 11 && WM.state.y < 20; }, run: async function (s) {
      s.spawn('ls', 'lishishi', 31, 13, 'down');
      await s.say('lishishi', 'You again — the steward from Shandong. You brought me a burned house last time.');
      await s.say('yanqing', 'And today I bring the truth, sister. Song Jiang never meant you or His Majesty any harm. All we want is the pardon — and every time it comes, Cai Jing and Gao Qiu spoil it.');
      await s.say('lishishi:smile', '...You have an honest face, for a liar. I will take you as my younger brother. And tonight — you will meet someone.');
      await s.fadeOut(0.8); s.night(true);
      s.spawn('hz', 'huizong', 35, 13, 'left');
      await s.fadeIn(0.8);
      await s.walkTo('hz', 33, 14);
      await s.say('lishishi:smile', 'Majesty, my younger brother, from Shandong. He plays the flute.');
      s.sfx('bell'); await s.emote('player', 'note', 1.4); await s.emote('player', 'note', 1.4);
      await s.emote('hz', 'heart');
      await s.jump('player');
      await s.say('yanqing', '(kneeling) Majesty, forgive me — I am Yan Qing of Liangshan. Let me tell you what your ministers have not: the village wine in the imperial jars, the comma in the wrong place, the battles Tong Guan and Gao Qiu lost and reported to you as victories...');
      await s.say('huizong', '...So my ministers have been deceiving me. Brush and paper.');
      await s.give('pardon_yanqing', 1);
      await s.narrate('The emperor wrote in his own hand: "Yan Qing is pardoned of all offences. No office may arrest or question him." Then Yan Qing and Dai Zong went by night to the house of Marshal Su Yuanjing — the envoy whose golden bells they had borrowed in Huazhou — with gold and a letter from Wen Huanzhang. And Dai Zong bribed one of Gao Qiu\'s servants, and before dawn Xiao Rang and Yue He came down over the garden wall on a rope.');
      s.despawn('ls'); s.despawn('hz');
      s.night(false);
      s.unflag('away:xiaorang'); s.unflag('away:yuehe');
      s.flag('ch20_su');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch20_amnesty', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch20_su') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.party(['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'guansheng', 'linchong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.spawn('su', 'suyuanjing', 15, 5, 'down'); s.spawn('sj', 'songjiang', 15, 7, 'up');
      s.music('palace');
      await s.say('suyuanjing', '"...We now send Su Yuanjing, Marshal of the Palace Guard, to Liangshan Marsh with this edict: all crimes of Song Jiang and every man under him, great and small, are pardoned."');
      await s.say('songjiang:sad', '...Ten thousand years to His Majesty.');
      await s.give('amnesty', 1);
      await s.narrate('Song Jiang remembered the Mysterious Lady\'s words in the temple of Huandao: "Meet Su, and joy upon joy." The one hundred and eight chiefs each drank a cup of the imperial wine — the real wine, this time — and received gold and silver medals and bolts of red and green brocade.');
      await s.say('suyuanjing', 'Song Jiang. Do you remember the Wei River?');
      await s.say('songjiang', 'I remember, Your Excellency. We returned every bell.');
      s.despawn('su'); s.despawn('sj');
      await s.narrate('Song Jiang held a market for ten days to sell off the mountain\'s goods and pay the people round about. Any soldier who wished to go home was given money and let go; three or four thousand went. The families stayed on the mountain for now, and the Hall of Loyalty stood empty but for its banners — the old home that the brothers would return to in their thoughts in all the years of war to come.');
      await s.narrate('Then the army of Liangshan marched to the Eastern Capital under two new banners: "Obedient to Heaven" and "Protector of the State." The emperor watched them pass from the Xuande Tower. Before they went into the palace, the chiefs took off their armour and put on the brocade robes he had given them — all but Gongsun Sheng and Lu Zhishen, who had theirs made into a Daoist\'s robe and a monk\'s.');
      s.flag('ch20_done');
      await s.endChapter();
      if (WM.data.chapters[21].begin) await WM.data.chapters[21].begin(s);
    } }
  ]);
})();
