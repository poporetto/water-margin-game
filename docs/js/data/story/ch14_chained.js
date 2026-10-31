// Chapter 14 — "Chained Cavalry" (novel chapters 54–58).
// Huyan Zhuo, Han Tao and Peng Qi; Hu Sanniang's lasso; the chained horses; Ling Zhen's fire-bombs; Shi Qian steals Xu
// Ning's armour; the hooked lances; Huyan Zhuo's lost horse; the three mountains at Qingzhou; the pit.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('murong', 'Prefect Murong', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', body: '#5a1a3a', trim: '#d8b36a', face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('kongbin', 'Kong Bin', { skin: '#e0a880', hair: '#c8c8c0', hairStyle: 'scarf', band: '#3a3a2a', beard: 'long', beardColor: '#d8d8d0', body: '#5a4a3a', trim: '#c8b890', face: 'round' }, { face: true });
  WM.npc('xuwife', 'Xu Ning\'s Wife', { skin: '#f6e2cc', hairStyle: 'woman', body: '#4a6a8a', trim: '#e8e0d0', dress: true, build: 'slim', face: 'oval' }, { face: true });

  WM.enemy('gunner', 'Ling Zhen\'s Bombardier', 25, WM.hum(WM.enemyLooks.soldier), { hp: 0.9, range: 'L', fx: 'fire', exp: 120, drops: [['medicine', 0.12]] });
  WM.enemy('lingzhen_foe', 'Ling Zhen', 26, WM.hum(WM.data.chars.lingzhen.look), { hp: 2.4, exp: 420, gold: 200, boss: true, range: 'L', skills: [{ name: 'Wind-and-Fire Bombs', chance: 0.35, type: 'magic', power: 40, target: 'all', fx: 'fire', sfx: 'cannon' }] });
  WM.enemy('qz_guard', 'Qingzhou Guard', 26, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 130, drops: [['medicine', 0.15]] });
  WM.enemy('qz_archer2', 'Qingzhou Archer', 26, WM.hum(WM.enemyLooks.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 130 });
  var T = WM.data.troops;
  T.ch14_lingzhen = { enemies: ['gunner', 'lingzhen_foe', 'gunner'], bg: 'river', boss: true };
  T.ch14_qingzhou = { enemies: ['qz_guard', 'qz_archer2', 'qz_guard', 'qz_guard'], bg: 'town', noRun: true };

  WM.data.duels.linchong_huyan = {
    hero: 'linchong', foe: 'huyanzhuo', bg: 'field', heroHp: 640, heroAtk: 52, foeHp: 680, foeAtk: 52, drawAfter: 4,
    intro: [['foe', 'Bandit! I am Huyan Zhuo, of the line of Huyan Zan. Dismount and be bound!'], ['hero:angry', 'Lin Chong of Liangshan. Your ancestors served the state; you serve Gao Qiu. Come!']],
    lines: { attack: ['Hah!', 'Twin whips!', 'There!'], wild: ['Steel whips of the Huyan!', 'Fall!', 'Down!'], defend: ['Hmph.', 'Come on.', 'Steady...'] },
    draw: [[null, 'Spear came, whips went — a whirl of flowers; whips went, spear came — a knot of brocade. Fifty bouts, and neither could beat the other.']]
  };
  WM.data.duels.hu_pengqi = {
    hero: 'husanniang', foe: 'pengqi', bg: 'field', heroHp: 480, heroAtk: 48, foeHp: 460, foeAtk: 40,
    intro: [['foe', 'A woman? Out of my way, girl!'], ['hero:angry', 'Peng Qi, the Heaven-Eyed General? Let me see how far your eyes see.']],
    lines: { attack: ['Hyah!', 'Three-pointed blade!', 'There!'], wild: ['Heaven\'s eye!', 'Fall!', 'Hah!'], defend: ['Hm.', 'Not bad.', 'Steady.'] },
    win: [[null, 'Hu Sanniang tossed her red silk lasso. It dropped over Peng Qi\'s shoulders, and she pulled him out of the saddle.']],
    lose: [[null, 'Peng Qi pressed her hard — but as he turned his horse, Hu Sanniang\'s red silk lasso dropped over his shoulders, and she pulled him out of the saddle.']]
  };
  WM.data.duels.lu_huyan = {
    hero: 'luzhishen', foe: 'huyanzhuo', bg: 'field', heroHp: 720, heroAtk: 54, foeHp: 680, foeAtk: 52, drawAfter: 4,
    intro: [['foe', 'A fat monk? Is this what Mount Erlong sends?'], ['hero:angry', 'You\'re the one who lost your horse, eh? Come and get a taste of my staff!']],
    lines: { attack: ['Hah!', 'Twin whips!', 'There!'], wild: ['Steel whips of the Huyan!', 'Fall!', 'Down!'], defend: ['Strong monk...', 'Come on.', 'Steady...'] },
    draw: [[null, 'Forty or fifty bouts, and still neither gave way. Huyan Zhuo cried out in admiration: "Where did this monk come from?"']]
  };
  WM.data.duels.yangzhi_huyan = {
    hero: 'yangzhi', foe: 'huyanzhuo', bg: 'field', heroHp: 640, heroAtk: 52, foeHp: 680, foeAtk: 52, drawAfter: 4,
    intro: [['hero', 'Yang Zhi of Mount Erlong. Of the line of the Yang generals.'], ['foe', 'A Yang, and a Huyan, fighting each other for bandits and a prefect. What an age.']],
    lines: { attack: ['Hah!', 'Twin whips!', 'There!'], wild: ['Steel whips of the Huyan!', 'Fall!', 'Down!'], defend: ['Skilled...', 'Come on.', 'Steady...'] },
    draw: [[null, 'Again forty or fifty bouts without a winner. Then the gongs of Qingzhou called Huyan Zhuo back to the city.']]
  };

  WM.data.wars.ch14_chained = {
    name: 'The Chained Cavalry', goal: { survive: true }, turns: 6, music: 'war',
    map: [
      '~~r...........',
      '~r....mm......',
      '~~............',
      '~r............',
      '~~............',
      '~r....mm......',
      '~~r...........'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 2, y: 3, commander: true },
      { leader: 'linchong', type: 'cav', x: 4, y: 2 },
      { leader: 'qinming', type: 'cav', x: 4, y: 4 },
      { leader: 'huarong', support: ['lufang', 'guosheng'], type: 'arch', x: 3, y: 1 },
      { leader: 'sunli', support: ['sunxin'], type: 'cav', x: 3, y: 5 },
      { leader: 'ruanxiaoer', support: ['ruanxiaowu', 'ruanxiaoqi'], type: 'naval', x: 0, y: 2 }
    ],
    enemy: [
      { name: 'Huyan Zhuo', portrait: 'huyanzhuo', type: 'cav', atk: 128, def: 108, x: 12, y: 3, commander: true },
      { name: 'Han Tao', portrait: 'hantao', type: 'cav', atk: 104, def: 92, x: 10, y: 1 },
      { name: 'Chained Cavalry', type: 'cav', atk: 136, def: 130, x: 9, y: 2 },
      { name: 'Chained Cavalry', type: 'cav', atk: 136, def: 130, x: 9, y: 3 },
      { name: 'Chained Cavalry', type: 'cav', atk: 136, def: 130, x: 9, y: 4 },
      { name: 'Imperial Archers', type: 'arch', atk: 90, def: 64, x: 13, y: 5 }
    ],
    intro: [['songjiang', 'Huyan Zhuo\'s horsemen are armoured to the eyes, horse and man alike, and chained together thirty at a time.'], ['linchong', 'Arrows bounce off them. Spears cannot stop them.'], [null, 'Victory: hold out for 6 turns. The armoured chains cannot be broken by force.']],
    events: [
      { turn: 2, run: async function (s, api) {
        await s.say(null, 'The chains of horses came on like a wall, thirty abreast. Nothing could stand before them.');
        s.sfx('drum'); api.weaken('player', 0.85);
      } },
      { turn: 4, run: async function (s, api) {
        await s.say(null, 'From across the water came a sound like thunder: Ling Zhen, the Heaven-Shaking Thunder, had set up his trebuchets, and the fire-bombs fell among the Liangshan camp.');
        s.sfx('cannon'); await s.shake(6, 0.5); api.weaken('player', 0.9);
      } }
    ],
    win: [['songjiang:sad', 'Back to the boats! Back to the Duck-Bill Shoal!']], lose: [['songjiang:sad', 'Back to the boats! Back to the Duck-Bill Shoal!']]
  };
  WM.data.wars.ch14_hooks = {
    name: 'The Hooked Lances', goal: 'commander', turns: 10, music: 'war',
    // the reed marsh where Xu Ning's hook-men lie hidden (v: reeds on wet ground, which horses can be drawn into)
    map: [
      'rvTTvv........',
      'rTvvv.........',
      'rvTvvv........',
      'TvvvvT........',
      'rvTvvv........',
      'rTvvv.........',
      'rvTTvv........'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'xuning', support: ['tanglong'], type: 'inf', x: 2, y: 2 },
      { leader: 'linchong', support: ['huarong'], type: 'cav', x: 3, y: 3 },
      { leader: 'lingzhen', type: 'arch', x: 1, y: 1 },
      { leader: 'leiheng', support: ['zhutong'], type: 'inf', x: 2, y: 4 },
      { leader: 'ruanxiaoer', support: ['ruanxiaowu', 'ruanxiaoqi'], type: 'naval', x: 0, y: 5 }
    ],
    enemy: WM.data.wars.ch14_chained.enemy,
    intro: [['xuning', 'Into the reeds and the brush. When the chained horses come, hook the legs of one horse — and the whole chain goes down.'], ['songjiang', 'Lure them into the reeds!'], [null, 'Victory: rout Huyan Zhuo. Draw the chained cavalry into the reed marsh on the left.']],
    events: [
      // the hooked lances spring when the first of the chained horses comes into the reeds
      { id: 'hooks', enter: function (u, t) { return u.side === 'enemy' && u.name === 'Chained Cavalry' && t && t.reeds; }, run: async function (s, api) {
        await s.say(null, 'The chained cavalry charged into the reeds after the fleeing Liangshan men — and out of the reeds came the hooked lances. One horse went down, and the thirty chained to it fell over one another. Ling Zhen\'s fire-bombs burst behind them.');
        s.sfx('cannon'); api.weaken('enemy', 0.6); api.confuse('Chained Cavalry');
        await s.say(null, 'Han Tao was pulled from his horse by the hook-men, and tied up.');
        api.rout('Han Tao');
        await s.say('xuning', 'The chains are down and tangled — they cannot move. Strike them now, before they cut themselves free!');
      } },
      // if Huyan Zhuo will not come into the reeds, the hook-men go out to him
      { turn: 4, run: async function (s, api) {
        if (api.done('hooks')) return;
        api.finish('hooks');
        await s.say(null, 'Huyan Zhuo would not ride into the reeds. So Xu Ning\'s hook-men crept out through the long grass under cover of night, and caught the chained horses where they stood. One horse went down, and the thirty chained to it fell over one another.');
        s.sfx('cannon'); api.weaken('enemy', 0.6); api.confuse('Chained Cavalry');
        await s.say(null, 'Han Tao was pulled from his horse by the hook-men, and tied up.');
        api.rout('Han Tao');
      } }
    ],
    win: [['xuning', 'The chains are broken! Huyan Zhuo is fleeing alone!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[14].begin = async function (s) {
    await s.chapter(14);
    s.party(['songjiang', 'linchong', 'husanniang', 'huarong', 'qinming', 'gongsunsheng']); s.setLeader('songjiang');
    ['songjiang', 'linchong', 'husanniang', 'huarong', 'qinming', 'gongsunsheng'].forEach(function (id) { s.level(id, 26); });
    s.flag('protagonist', 'songjiang');
    // the Eastern Capital: Gao Qiu, raging over Gaotang, sends for Huyan Zhuo
    await s.warp('kaifeng_gao', 5, 11, 'up', { noFade: true });
    s.hide('player');
    s.spawn('gq', 'gaoqiu', 5, 4, 'down');
    await s.fadeIn(0.6);
    await s.narrate('In the capital, Gao Qiu went before the emperor with the news of Gaotang. "My cousin Gao Lian is dead, the city plundered. These bandits must be destroyed." He recommended Huyan Zhuo of Ruzhou, a descendant of the great general Huyan Zan, a master of the twin steel whips.');
    s.spawn('hy', 'huyanzhuo', 6, 11, 'up'); await s.walkTo('hy', 5, 6);
    await s.say('gaoqiu:angry', 'General Huyan. His Majesty has given you Snow-Treading Black from the imperial stables, and an army. Bring me Song Jiang of Liangshan in a cage.');
    await s.say('huyanzhuo', 'Marshal, give me Han Tao of Chenzhou and Peng Qi of Yingzhou for my vanguard, and three thousand armoured horse. In a month the marsh will be quiet.');
    await s.say('gaoqiu:smile', 'Take what you need. And when the bandits are taken — remember who recommended you.');
    // and back at Liangshan, the news comes up the hall
    await s.fadeOut(0.6);
    WM.data.clear(s, ['gq', 'hy']);
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.show('player');
    s.spawn('wy', 'wuyong', 15, 6, 'down'); s.spawn('lc0', 'linchong', 13, 7, 'right'); s.spawn('hs0', 'husanniang', 18, 7, 'left');
    await s.fadeIn(0.6);
    await s.say('wuyong', 'Brother, Huyan Zhuo is coming with Han Tao, the General of a Hundred Victories, and Peng Qi, the Heaven-Eyed General. They are both good soldiers.');
    await s.say('linchong', 'I know Huyan Zhuo by name. His family has served the throne since the founding. He will not be easy.');
    await s.say('husanniang', 'Then let the Heaven-Eyed General find out what a lasso can do.');
    await s.say('songjiang', 'Then we go down to meet them on the plain.');
    // down to the boats, and across the marsh to the shore by Zhu Gui's tavern
    await s.fadeOut(0.6);
    WM.data.clear(s, ['wy', 'lc0', 'hs0']);
    await s.warp('zhugui', 14, 9, 'down', { noFade: true });
    var ours = [['lc1', 'linchong', 15, 9], ['hs1', 'husanniang', 16, 9], ['qm1', 'qinming', 14, 8], ['hr1', 'huarong', 15, 8]];
    ours.forEach(function (o) { s.spawn(o[0], o[1], o[2], o[3], 'down'); });
    await s.fadeIn(0.6);
    await s.narrate('The Liangshan army crossed the marsh and drew up on the plain beyond the shore.');
    s.walkTo('lc1', 15, 16); s.walkTo('hs1', 17, 16); s.walkTo('qm1', 14, 15); s.walkTo('hr1', 18, 15); await s.walkTo('player', 16, 15);
    // and out of the south, the imperial army: Huyan Zhuo at its head
    s.spawn('hy1', 'huyanzhuo', 16, 21, 'up'); s.spawn('ht1', 'hantao', 14, 21, 'up'); s.spawn('pq1', 'pengqi', 19, 21, 'up');
    var imp = WM.data.troop(s, 'im1', 'soldier', [[13, 21], [15, 21], [17, 21], [20, 21]], 'up');
    s.walkTo('ht1', 14, 19); s.walkTo('pq1', 18, 19); [[13, 20], [15, 20], [17, 20], [19, 20]].forEach(function (p, i) { s.walkTo(imp[i], p[0], p[1]); });
    await s.walkTo('hy1', 16, 18);
    s.sfx('gong'); await s.shake(2, 0.3);
    await s.say('huyanzhuo:angry', 'Bandits of Liangshan! I am Huyan Zhuo, of the line of Huyan Zan. Who will come out and fight me?');
    s.face('lc1', 'up');
    await s.say('linchong:angry', 'Lin Chong of Liangshan will!');
    await s.duel('linchong_huyan', { hero: 'linchong', canLose: true });
    await s.duel('hu_pengqi', { hero: 'husanniang', canLose: true });
    // the duels done, Peng Qi is dragged back across the water to the hall
    await s.fadeOut(0.6);
    WM.data.clear(s, ['lc1', 'hs1', 'qm1', 'hr1', 'hy1', 'ht1', 'pq1'].concat(imp));
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('pq', 'pengqi', 16, 12, 'up'); s.spawn('hs', 'husanniang', 17, 12, 'up');
    await s.fadeIn(0.6);
    await s.walkTo('pq', 16, 10); await s.walkTo('hs', 17, 10);
    await s.say('husanniang', 'Brother — the Heaven-Eyed General. I pulled him out of the saddle myself.');
    await s.walkTo('player', 16, 9); s.face('player', 'down');
    await s.say('songjiang', 'Untie him! ...General Peng, forgive the ropes. We are not rebels; we wait only for the emperor\'s pardon. Will you stay with us?');
    s.sfx('item');
    await s.say('pengqi', '...You untie your prisoner with your own hands? General Song, I have heard of your righteousness. Peng Qi will stay.');
    s.despawn('pq'); s.despawn('hs', { leave: true });
    await s.join('pengqi');
    // next morning, word from the shore: Huyan Zhuo has a new formation
    s.spawn('sc', 'outlaw', 16, 13, 'up'); await s.walkTo('sc', 16, 11, { run: true });
    await s.say('outlaw', 'Brother! Huyan Zhuo has come out again — but not as before. His horses are in iron armour to the eyes, and chained together, thirty abreast!');
    s.spawn('wy2', 'wuyong', 14, 7, 'down'); await s.walkTo('wy2', 15, 8);
    await s.say('wuyong', 'Chained cavalry. Arrows will not pierce them, and a line of thirty horses cannot be broken by spears. Brother, be careful.');
    await s.say('songjiang', 'We cannot hide in the marsh while he burns the villages on the shore. We go out and meet him.');
    WM.data.clear(s, ['sc', 'wy2']);
    await s.war('ch14_chained', { canLose: true });
    await s.narrate('The Liangshan army fled across the water with heavy losses. Huyan Zhuo sent to the capital for Ling Zhen, the greatest artillerist of the empire.');
    s.sfx('cannon'); await s.flash(); await s.shake(6, 0.5);
    await s.emote('player', '!');
    await s.say('songjiang:shock', 'What was that?!');
    s.sfx('cannon'); await s.shake(5, 0.4);
    s.spawn('wy', 'wuyong', 16, 12, 'up');
    await s.walkTo('wy', 15, 7, { run: true }); s.face('wy', 'down');
    await s.say('wuyong', '"Wind-and-fire" bombs, brother — thrown by trebuchet from across the water. Two of the forts on the shore are burning.');
    await s.say('wuyong', 'Ling Zhen\'s trebuchets are on the shore. Li Jun, Zhang Heng — draw him to the water. The Ruan brothers will be waiting under it.');
    s.despawn('wy', { leave: true });
    s.party(['ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'lijun', 'zhangheng']); s.setLeader('ruanxiaoer');
    ['ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'lijun', 'zhangheng'].forEach(function (id) { s.level(id, 25); });
    // the water brothers go down to the shore, where Ling Zhen's gunners are setting up the trebuchets
    await s.fadeOut(0.6);
    await s.warp('zhugui', 14, 9, 'down', { noFade: true });
    var wb = [['r2', 'ruanxiaowu', 15, 9], ['r7', 'ruanxiaoqi', 16, 9], ['lj', 'lijun', 14, 8], ['zh', 'zhangheng', 15, 8]];
    wb.forEach(function (o) { s.spawn(o[0], o[1], o[2], o[3], 'down'); });
    s.spawn('lz', 'lingzhen', 16, 19, 'up'); var gun = WM.data.troop(s, 'gn', 'soldier', [[14, 20], [18, 20], [16, 21]], 'up');
    await s.fadeIn(0.6);
    s.walkTo('r2', 15, 16); s.walkTo('r7', 17, 16); s.walkTo('lj', 14, 15); s.walkTo('zh', 18, 15); await s.walkTo('player', 16, 15);
    await s.say('lingzhen:angry', 'There they are — the bandits of the water! Load the next shot!');
    await s.say('ruanxiaoer', 'Come and catch us, gunner! Down to the boats, brothers — let him chase us onto the water!');
    s.sfx('cannon'); await s.shake(4, 0.3);
    await s.battle('ch14_lingzhen', { bg: 'river' });
    WM.data.clear(s, wb.map(function (o) { return o[0]; }).concat(['lz'], gun));
    await s.fadeOut(0.6);
    await s.warp('liangshan', 24, 40, 'down', { noFade: true });
    s.hide('player');
    s.spawn('lzb', 'lingzhen', 20, 45, 'left'); s.boat('lzb');
    s.spawn('ljb', 'lijun', 16, 44, 'left'); s.boat('ljb');
    await s.camera(17, 43, 0.05);
    await s.fadeIn(0.6);
    await s.say('lingzhen:angry', 'After them! Row! Those bandit boats are running for the reeds!', { top: true });
    await s.move('ljb', 'L4', { speed: 50, wait: false }); await s.move('lzb', 'L3', { speed: 50 });
    s.spawn('re', 'ruanxiaoer', 16, 46, 'up'); s.spawn('rw', 'ruanxiaowu', 18, 46, 'up'); s.spawn('rq', 'ruanxiaoqi', 17, 44, 'down');
    s.splash('re'); s.splash('rw'); s.boat('re'); s.boat('rw'); s.boat('rq');
    await s.say('ruanxiaoqi:smile', 'Surprise, Master Gunner! The water belongs to us!', { top: true });
    await s.emote('lzb', '!');
    s.sfx('splash'); await s.shake(3, 0.3);
    await s.jump('lzb', 8); s.splash('lzb'); s.hide('lzb');
    await s.wait(0.6);
    await s.say('ruanxiaoer', 'Got him! Haul him out — he swims like a stone!', { top: true });
    await s.fadeOut(0.6);
    WM.data.clear(s, ['lzb', 'ljb', 're', 'rw', 'rq']);
    s.cameraReset(); s.show('player');
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    await s.fadeIn(0.6);
    s.spawn('sj', 'songjiang', 16, 6, 'down'); s.spawn('lz', 'lingzhen', 17, 8, 'up'); s.spawn('wy', 'wuyong', 15, 6, 'down'); s.spawn('tl', 'tanglong', 14, 8, 'right');
    await s.say('lingzhen', 'My family is in the capital. If I stay, Gao Qiu will kill them.');
    await s.say('songjiang', 'Then we will bring them here.');
    await s.join('lingzhen');
    await s.say('tanglong', 'Brother — there is a way to beat the chained horses. The hooked lance. And only one man in the empire knows how to use it: my cousin Xu Ning, instructor of the Imperial Guard. And he would never leave the capital — unless he lost his family\'s treasure, the goose-feather armour he keeps in a leather box on the beam over his bed.');
    await s.say('wuyong:smile', 'Then we send someone to take it. Shi Qian!');
    s.despawn('sj', { leave: true }); s.despawn('lz', { leave: true }); s.despawn('wy', { leave: true }); s.despawn('tl', { leave: true });
    s.party(['shiqian']); s.setLeader('shiqian'); s.level('shiqian', 25); s.flag('protagonist', 'shiqian');
    s.flag('ch14_heist');
    WM.unlock('kaifeng');
    await s.say(null, '(Go to the capital and find Xu Ning\'s house. It is on the south side of the city.)');
  };
  WM.data.chapters[14].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 13; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong', 'xiaorang', 'jindajian', 'songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang', 'songqing', 'zhufu', 'liyun', 'yanglin', 'dengfei', 'mengkang', 'peixuan', 'yangxiong', 'shixiu', 'sunli', 'sunxin', 'gudasao', 'xiezhen', 'xiebao', 'zouyuan', 'zourun', 'yuehe', 'shiqian', 'liying', 'duxing', 'husanniang', 'leiheng', 'zhutong', 'tanglong', 'chaijin'].forEach(function (id) { S.recruit(id, 26); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou', 'yishui', 'jizhou_n', 'cuiping', 'zhujia', 'lijia', 'dengzhou', 'gaotang', 'erxian', 'wugang');
    await WM.data.chapters[14].begin(s);
  };

  // ---------------- the theft of the goose-feather armour ----------------
  var HEIST = [
    { text: 'Shi Qian slipped in over the back wall at dusk and up onto the beam of Xu Ning\'s bedroom, right above the red leather box. Below, a maid came in to trim the lamp. If the light kept burning, sooner or later someone would look up.',
      opts: ['Hold still and hope', 'Blow out the lamp through a reed tube', 'Grab the box and jump for it'], ok: 1,
      fail: ['The maid glanced up — and screamed.', '', 'The box swung and knocked against the beam. Lights everywhere!'],
      good: 'A thin reed tube, a soft breath — and the lamp went out. "The wind," said the maid, and went to fetch a light, and did not come back.',
      async pre(s) { s.spawn('mm', 'maid', 57, 18, 'up'); await s.walkTo('mm', 57, 15); s.face('mm', 'up'); },
      async bad(s, k) { if (k === 0) { s.face('mm', 'up'); await s.emote('mm', '!'); } else { s.sfx('block'); s.jump('sq', 3); await s.emote('mm', '!'); } s.emote('sq', 'sweat', 1); await s.emote('xn', '?'); },
      async goodfx(s) { s.sfx('wind'); await s.emote('sq', 'note', 0.8); await s.emote('mm', '?'); await s.walkTo('mm', 57, 18); s.hide('mm'); },
    },
    { text: 'In the night Xu Ning stirred in his bed. "What\'s that scratching up on the beam?"',
      opts: ['Drop down and run for the door', 'Keep perfectly still', 'Squeak and scrabble like fighting rats'], ok: 2,
      fail: ['Shi Qian landed on a stool with a crash.', 'Silence was worse. Xu Ning sat up and reached for the lamp...', ''],
      good: 'Squeak, squeak, scrabble — the rats are fighting on the beam again. Xu Ning grunted and turned over.',
      async pre(s) { s.sfx('step'); await s.emote('xn', '?', 1.2); },
      async bad(s, k) { await s.emote('xn', '!', 0.8); s.emote('sq', 'sweat', 1); },
      async goodfx(s) { s.sfx('cursor'); await s.emote('sq', 'note', 0.8); await s.emote('xn', 'zzz', 1.4); },
    },
    { text: 'The fourth watch. The box was in Shi Qian\'s arms. Below, the servants unbarred the back gate to go and fetch water for the morning.',
      opts: ['Slip out behind them through the gate', 'Wait for full daylight', 'Climb out over the roof'], ok: 0,
      fail: ['', 'At dawn the house woke, and the empty beam was seen at once.', 'A tile slid under his foot and smashed in the yard.'],
      good: 'While the servants clattered with their buckets, a shadow with a box on its back slipped out of the gate behind them and was gone.',
      async pre(s) { s.spawn('sv1', 'servant', 57, 18, 'up'); s.spawn('sv2', 'servant', 56, 18, 'up'); await s.walkTo('sv1', 58, 16); s.face('sv1', 'down'); },
      async bad(s, k) { if (k === 2) { s.sfx('hit'); await s.shake(2, 0.2); } await s.emote('xn', '!', 0.8); s.emote('sq', 'sweat', 1); },
      async goodfx(s) { s.walkTo('sv1', 57, 18); var sq = s.actor('sq'); for (var d = 0; d < 6; d++) { sq.offY += 2; await s.wait(0.04); } await s.walkTo('sq', 57, 17); await s.walkTo('sq', 57, 18); WM.data.clear(s, ['sq', 'sv1', 'sv2']); },
    }
  ];
  WM.defEvents('kaifeng_in', [
    { id: 'ch14_xu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch14_heist') && WM.state.x >= 51 && WM.state.y >= 11; }, run: async function (s) {
      s.music('tense'); s.night(true);
      // Xu Ning's bedroom by lamplight: Xu Ning asleep, and Shi Qian up on the beam above the red leather box
      s.hide('player'); s.place('player', 61, 17);   // (out of the way: Shi Qian is the one on the beam)
      s.spawn('xn', 'xuning', 54, 14, 'down'); s.lie('xn'); s.emote('xn', 'zzz', 3);
      s.spawn('sq', 'shiqian', 56, 14, 'down'); s.actor('sq').offY = -14; s.actor('sq').solid = false;
      for (var i = 0; i < HEIST.length; i++) {
        var h = HEIST[i], tries = 0;
        await s.narrate(h.text);
        if (h.pre) await h.pre(s);
        for (;;) {
          var k = await s.ask('shiqian', 'What should I do?', h.opts);
          if (k === h.ok || tries >= 2) { await s.narrate(h.good); if (h.goodfx) await h.goodfx(s); break; }
          tries++;
          if (h.bad) await h.bad(s, k);
          await s.narrate(h.fail[k] + ' Shi Qian shrank back into the dark under the eaves, and waited until all was quiet again.');
        }
      }
      WM.data.clear(s, ['xn', 'mm', 'sv1', 'sv2', 'sq']); s.show('player'); s.night(false);
      // a day's march out of the capital
      await s.fadeOut(0.8);
      await s.warp('roadinn', 2, 8, 'right', { noFade: true });
      s.spawn('dz', 'daizong', 22, 8, 'left');
      await s.fadeIn(0.8);
      await s.walkTo('player', 10, 8); await s.walkTo('dz', 12, 8, { run: true });
      await s.say('daizong:smile', 'Brother Shi Qian! The box?');
      await s.say('shiqian:smile', 'Four generations of goose-feather armour, light as a feather and hard as iron. Off the beam, out the gate, and nobody the wiser.');
      s.sfx('item');
      await s.say('daizong', 'Then the armour goes to the mountain with me, by the charms. You keep the empty box — and go slowly, so they can follow you.');
      await s.move('dz', 'R13', { run: true, speed: 220 });
      s.hide('dz'); s.despawn('dz');
      await s.walkTo('player', 12, 6); s.face('player', 'up');
      await s.say('shiqian', 'And a chalk circle on the inn door, so my pursuers don\'t lose the scent. ...There.');
      await s.emote('player', 'note');
      s.flag('ch14_stolen');
      await s.fadeOut(1);
      s.addParty('xuning'); s.level('xuning', 26); s.party(['xuning']); s.setLeader('xuning'); s.flag('protagonist', 'xuning');
      await s.warp('kaifeng_in', 56, 15, 'up', { noFade: true });
      s.spawn('wf', 'xuwife', 57, 13, 'down');
      await s.fadeIn(1);
      await s.say('xuwife:sad', 'Husband — the red leather box. It\'s gone. Your grandfather\'s armour.');
      await s.say('xuning:shock', 'The goose-feather armour? Gone? I would give thirty thousand strings for it! It has been in my family four generations!');
      s.despawn('wf');
      s.spawn('tl', 'tanglong', 56, 17, 'up');
      await s.say('tanglong', 'Cousin! It\'s me, Tang Long! ...Your armour? A red sheepskin box? I saw a thin fellow on the road east of the city with a box like that on his shoulder! We can catch him!');
      await s.say('xuning:angry', 'Then let\'s go. Now!');
      s.despawn('tl'); s.addParty('tanglong');
      s.flag('ch14_chase');
      await s.fadeOut(0.8);
      await s.warp('roadinn', 2, 8, 'right', { noFade: true });
      s.spawn('tl', 'tanglong', 1, 9, 'right');
      await s.fadeIn(0.8);
      s.walkTo('tl', 11, 7); await s.walkTo('player', 10, 8);
      s.face('tl', 'up');
      await s.say('tanglong', 'Look, cousin — a chalk circle on the inn door! He stopped here! The same mark as the last three inns!');
      await s.say('xuning:angry', 'Then he can\'t be far. On!');
      s.spawn('sq', 'shiqian', 22, 9, 'left'); s.lie('sq'); s.emote('sq', 'zzz', 4);
      s.walkTo('tl', 19, 8); await s.walkTo('player', 20, 8);
      await s.emote('player', '!');
      await s.say('xuning:angry', 'There — asleep under the tree, with my box! Thief!');
      s.lie('sq', false); await s.jump('sq'); s.face('sq', 'left');
      await s.say('shiqian:shock', 'W-wait, wait! It\'s empty, look — empty! A rich man in Tai\'an paid me to steal it. My partner Li San took the armour on ahead. Kill me and you\'ll never find him!');
      await s.say('xuning', '...Then you\'ll take us to him. Walk.');
      s.spawn('yh', 'yuehe', 25, 8, 'left');
      await s.walkTo('yh', 22, 8);
      await s.say('yuehe:smile', '(as a carter) Travellers! Going east? I\'m Li Rong, carting to Tai\'an. Ride with me — and have a cup of wine against the dust.');
      s.sfx('item');
      await s.say('xuning', 'Wine... yes. I\'ve not eaten all day. Thank you, friend.');
      await s.emote('player', 'note'); await s.emote('player', '?');
      await s.say('xuning', 'The road is... turning over...');
      await s.emote('player', 'zzz', 1.4); s.lie('player');
      await s.say('tanglong', '(quietly) Down he goes. Gently with him, Brother Yue He.');
      await s.fadeOut(1);
      WM.data.clear(s, ['tl', 'sq', 'yh']);
      s.lie('player', false);
      await s.warp('liangshan_in', 16, 12, 'up', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch14_xuning', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch14_chase') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('sj', 'songjiang', 15, 6, 'down'); s.spawn('lc', 'linchong', 13, 7, 'right'); s.spawn('tl', 'tanglong', 17, 7, 'left');
      await s.say('xuning:shock', '...Where am I? Lin Chong?!');
      await s.say('linchong', 'Brother Xu Ning. We were instructors together in the Guard. Forgive us.');
      await s.say('tanglong', 'Cousin, it was me. I put on your armour and robbed travellers in it, so the capital would think you\'d turned bandit. You can\'t go back now. And your wife and children are already on their way here.');
      await s.say('xuning:angry', 'Tang Long... you\'ve ruined me!');
      await s.say('songjiang', 'Brother Xu Ning, we did this only because we need you. Huyan Zhuo\'s chained horses are killing our men. Only the hooked lance can stop them. Teach us, and you will save hundreds of lives.');
      await s.say('xuning', '...My family is coming? ...Then there is no road back. Very well. I will teach you the hooked lance.');
      s.despawn('lc'); s.despawn('tl'); s.despawn('sj');
      await s.join('xuning');
      await s.narrate('Lei Heng had the smiths forge the hooked lances, and Xu Ning chose the strongest men and drilled them.');
      await s.fadeOut(0.6);
      // the drill ground on the lower terrace, west of the road
      await s.warp('liangshan', 9, 37, 'up', { noFade: true });
      s.hide('player');
      var drs = []; for (var dy = 36; dy <= 38; dy++) for (var dx = 6; dx <= 13; dx += 1) if ((dx + dy) % 2 === 0) drs.push([dx, dy]);
      var dr = WM.data.troop(s, 'dr', 'outlaw', drs, 'up');
      s.spawn('xn', 'xuning', 10, 35, 'down');
      s.camera(10, 36, 0.05);
      await s.fadeIn(0.6);
      await s.say('xuning', '"Seven steps, three hooks and four thrusts; nine changes in all!" Hook low — at the horse\'s legs, not the rider!');
      for (var dk = 0; dk < 3; dk++) { dr.forEach(function (k) { s.jump(k, 4); }); s.sfx('slash'); await s.wait(0.5); }
      await s.say('xuning', 'Again! When the chained horses come, one falls, and the whole line falls with it!');
      dr.forEach(function (k) { s.jump(k, 4); }); s.sfx('crit'); await s.wait(0.5);
      await s.say('xuning:smile', 'Good. In half a month, seven hundred of you will know it.');
      await s.fadeOut(0.6);
      WM.data.clear(s, dr.concat(['xn'])); s.cameraReset();
      s.show('player');
      s.party(['songjiang', 'xuning', 'linchong', 'huarong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
      s.spawn('wy', 'wuyong', 14, 7, 'right'); s.spawn('xn2', 'xuning', 18, 7, 'left'); s.spawn('lc2', 'linchong', 13, 8, 'right');
      await s.fadeIn(0.6);
      await s.say('wuyong', 'The lancers are ready. Here is the plan: we do not meet the chained horses on the open plain. Our men go into the reeds and brushwood along the shore, ten to a band, with the hooked lances.');
      await s.say('xuning', 'And when the chained horses charge into the reeds after us, the lancers hook the legs of one horse — and the whole chain of thirty goes down with it. The footmen finish them where they fall.');
      await s.say('linchong', 'Hua Rong\'s archers and I will draw them in. Huyan Zhuo will not refuse a fight.');
      await s.say('songjiang', 'Then let the drums sound. Today the chained horses break.');
      WM.data.clear(s, ['wy', 'xn2', 'lc2']);
      await s.war('ch14_hooks');
      // Han Tao, taken in the reeds, is brought up to the hall; Peng Qi talks him round
      await s.fadeOut(0.6);
      await s.warp('liangshan_in', 16, 9, 'down', { noFade: true });
      s.spawn('ht', 'hantao', 16, 13, 'up'); s.spawn('lt', 'liutang', 15, 13, 'up'); s.spawn('dq', 'duqian', 17, 13, 'up');
      s.spawn('pq3', 'pengqi', 19, 9, 'left'); s.spawn('xn3', 'xuning', 13, 9, 'right');
      await s.fadeIn(0.6);
      s.walkTo('lt', 15, 11); s.walkTo('dq', 17, 11); await s.walkTo('ht', 16, 11);
      await s.say('liutang', 'Brother! The chained horses went down in the reeds like reaped barley. Du Qian and I pulled this one out from under his own horse — Han Tao, the Hundred-Victory General.');
      await s.say('hantao:angry', 'Kill me and be done with it. I will not kneel to bandits.');
      await s.walkTo('player', 16, 10); s.faceEach('player', 'ht');
      await s.say('songjiang', 'Untie him! ...General Han, you fought for the court, as a soldier should. No one here will make you kneel.');
      s.sfx('item');
      await s.emote('ht', '?');
      await s.walkTo('pq3', 17, 10); s.faceEach('pq3', 'ht');
      await s.say('pengqi', 'Brother Han, I said the same words in this hall, and Brother Song untied me with his own hands. They wait only for the emperor\'s pardon. Stay with us.');
      await s.say('hantao:sad', '...Huyan Zhuo is gone, and the chained horses with him. If even Peng Qi stays — then Han Tao will stay too. I owe you my life, General Song.');
      await s.say('songjiang:smile', 'Then pour the wine. A good general is worth more to us than a thousand horses.');
      WM.data.clear(s, ['ht', 'lt', 'dq', 'pq3', 'xn3']);
      await s.join('hantao');
      // Huyan Zhuo flees alone, and stops at a village inn for the night
      await s.fadeOut(0.8);
      await s.warp('roadinn', 1, 8, 'right', { noFade: true });
      s.hide('player'); s.night(true);
      s.spawn('hy3', 'huyanzhuo', 0, 8, 'right'); s.spawn('ik3', 'innkeep', 9, 6, 'down');
      await s.fadeIn(0.8);
      await s.walkTo('hy3', 8, 7);
      await s.narrate('Huyan Zhuo escaped alone towards Qingzhou. On the way he stopped at a village inn for the night.');
      await s.say('huyanzhuo:sad', 'Wine, and a stall for my horse. Snow-Treading Black has carried me all day.');
      await s.say('innkeep', 'Yes, sir, at once, sir. The stable is round the back.');
      await s.fadeOut(0.6); await s.wait(0.3); await s.fadeIn(0.6);
      s.sfx('door'); s.place('hy3', 8, 7, 'down');
      await s.emote('hy3', '!');
      await s.say('huyanzhuo:shock', 'Innkeeper! The stable is empty — where is my horse?!');
      await s.walkTo('ik3', 9, 7); s.faceEach('ik3', 'hy3');
      await s.say('innkeep:sad', 'Gone, sir? Then that will be the bandits of Peach Blossom Mountain. They come down at night and take whatever they please.');
      await s.say('huyanzhuo:angry', 'Bandits again! ...To Qingzhou, then. The prefect there will give me men.');
      // Qingzhou: Prefect Murong in his hall
      await s.fadeOut(0.8);
      s.night(false); WM.data.clear(s, ['hy3', 'ik3']);
      await s.warp('qingzhou_in', 8, 8, 'up', { noFade: true });
      s.hide('player');
      s.spawn('mr', 'murong', 7, 4, 'down'); s.actor('mr').x += 8; s.spawn('hy4', 'huyanzhuo', 8, 9, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('hy4', 8, 6); s.face('hy4', 'up');
      await s.say('murong', 'General Huyan! The bandits of Peach Blossom Mountain stole the emperor\'s gift horse from under you? Take two thousand of my men, wipe them out, and get your horse back.');
      await s.say('huyanzhuo:angry', 'I will bring you their heads, Prefect, and ride home on Snow-Treading Black.');
      // Peach Blossom Mountain sends to Mount Erlong for help
      await s.fadeOut(0.8);
      WM.data.clear(s, ['mr', 'hy4']);
      await s.warp('erlong_in', 9, 8, 'up', { noFade: true });
      s.hide('player');
      s.spawn('lz5', 'luzhishen', 9, 6, 'down'); s.spawn('yz5', 'yangzhi', 6, 6, 'right'); s.spawn('ws5', 'wusong', 11, 6, 'left'); s.spawn('ms5', 'bandit', 9, 9, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('ms5', 9, 8, { run: true }); s.face('ms5', 'up');
      await s.say('bandit', 'Masters of Mount Erlong! Li Zhong and Zhou Tong of Peach Blossom Mountain beg your help! Huyan Zhuo has come with two thousand men from Qingzhou — we cannot hold him!');
      await s.say('luzhishen:angry', 'Zhou Tong? The little bridegroom I beat in his own bridal bed? Ha! He is a brother now. Huyan Zhuo, is it — let me see what this famous general is made of.');
      await s.say('yangzhi', 'Huyan Zhuo is no common soldier. But three of us against one — he will find us a hard meal.');
      await s.say('wusong', 'Then we go down the mountain today.');
      await s.fadeOut(0.8);
      WM.data.clear(s, ['lz5', 'yz5', 'ws5', 'ms5']); s.show('player');
      s.party(['luzhishen', 'yangzhi', 'wusong']); s.setLeader('luzhishen'); s.flag('protagonist', 'luzhishen');
      ['luzhishen', 'yangzhi', 'wusong'].forEach(function (id) { s.level(id, 27); });
      WM.unlock('qingzhou');
      s.flag('ch14_erlong');
      await s.warp('qingzhou', 8, 20, 'right');
    } }
  ]);

  // ---------------- Qingzhou ----------------
  WM.defEvents('qingzhou', [
    { id: 'ch14_duels', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch14_erlong') && !S2.has('ch14_three'); }, run: async function (s) {
      s.spawn('ys0', 'yangzhi', 7, 19, 'right'); s.spawn('ws0', 'wusong', 7, 21, 'right');
      s.spawn('hy', 'huyanzhuo', 26, 20, 'left'); s.sfx('door');
      await s.walkTo('hy', 14, 20);
      await s.say('huyanzhuo:angry', 'So Peach Blossom Mountain sends for monks now? Come out, bald one, and be bound!');
      await s.say('luzhishen', 'Brother Wu Song, Brother Yang Zhi — leave him to me first!');
      await s.duel('lu_huyan', { hero: 'luzhishen', canLose: true });
      await s.duel('yangzhi_huyan', { hero: 'yangzhi', canLose: true });
      s.despawn('hy', { to: [26, 20] }); WM.data.clear(s, ['ys0', 'ws0']);
      // some days later, before the gate: Kong Ming's men try for the prison, and Huyan Zhuo rides out
      await s.fadeOut(0.8);
      s.hide('player');
      s.spawn('km', 'kongming', 18, 19, 'right'); s.spawn('kl', 'kongliang', 17, 20, 'right');
      var wt = WM.data.troop(s, 'wt', 'bandit', [[16, 19], [16, 20]], 'right');
      s.camera(20, 19, 0.05);
      await s.fadeIn(0.8);
      await s.narrate('A few days later Kong Ming of White Tiger Mountain came to Qingzhou to rescue his uncle Kong Bin from the prison.');
      await s.say('kongming:angry', 'Open the prison, Murong, or we break down your gate!');
      s.sfx('door'); s.spawn('hy7', 'huyanzhuo', 26, 19, 'left'); s.spawn('g71', 'soldier', 26, 20, 'left');
      await s.walkTo('hy7', 20, 19, { run: true });
      s.emote('km', '!'); await s.emote('kl', '!');
      s.sfx('hit'); await s.flash(); await s.shake(4, 0.3);
      s.lie('km'); s.lie(wt[0]);
      await s.say('huyanzhuo:angry', 'Bind him! Into the cells with his uncle!');
      await s.say('kongliang:shock', 'Brother!');
      await s.walkTo('g71', 19, 19);
      // Kong Liang flees west along the road — straight into Wu Song by the camp
      await s.walkTo('kl', 9, 20, { run: true });
      s.cameraReset(); WM.data.clear(s, ['km', 'hy7', 'g71'].concat(wt));
      s.spawn('ws7', 'wusong', 6, 20, 'right'); s.spawn('lz7', 'luzhishen', 6, 21, 'right'); s.spawn('ys7', 'yangzhi', 5, 20, 'right');
      await s.walkTo('kl', 7, 20, { run: true }); s.faceEach('kl', 'ws7');
      await s.emote('ws7', '!');
      s.despawn('kl', { leave: true }); WM.data.clear(s, ['ws7', 'lz7', 'ys7']); s.show('player');
      s.flag('ch14_three');
      await s.fadeOut(1);
      s.party(['songjiang', 'wuyong', 'qinming', 'huarong', 'linchong', 'luzhishen']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.level('wuyong', 25);
      await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
      s.spawn('kl2', 'kongliang', 16, 13, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('kl2', 16, 10, { run: true });
      await s.jump('kl2');
      await s.say('kongliang:sad', 'Master Song! Master Song — save us! Huyan Zhuo has my brother Kong Ming in the Qingzhou prison, and my uncle with him. Wu Song sent me. The three mountains will fight under you, if only you\'ll come!');
      s.face('player', 'down');
      await s.say('songjiang', 'Kong Liang! You and your brother were my hosts for half a year. Get up. ...Mister Wu, Qin Ming, Hua Rong, Lin Chong — three thousand men. We march today.');
      await s.fadeOut(1);
      s.hide('kl2'); s.despawn('kl2');
      await s.warp('qingzhou', 0, 19, 'right', { noFade: true });
      s.spawn('ys', 'yangzhi', 8, 21, 'up'); s.spawn('ws', 'wusong', 12, 22, 'up'); s.spawn('lz', 'lizhong', 7, 24, 'up'); s.spawn('zt', 'zhoutong', 13, 23, 'up');
      s.spawn('wyf', 'wuyong', 0, 20, 'right');
      await s.fadeIn(1);
      // Song Jiang comes along the road, Wu Yong at his back, and the camp turns out to see him
      s.walkTo('wyf', 9, 20); await s.walkTo('player', 10, 20);
      s.face('player', 'down'); s.face('wyf', 'down');
      s.emote('ys', '!'); s.emote('ws', '!'); s.emote('lz', '!'); await s.emote('zt', '!');
      s.walkTo('ws', 11, 21); await s.walkTo('ys', 9, 21);
      s.faceEach('ws', 'player'); s.face('ys', 'up');
      s.emote('lz', 'note'); await s.emote('zt', 'note');
      await s.say('wusong', 'Brother! You came!');
      await s.say('songjiang:smile', 'Brother Wu Song. Brother Lu Zhishen. Yang Zhi. I have long wanted to see you on our mountain.');
      await s.say('wuyong', 'Huyan Zhuo is brave but proud. Tomorrow, Brother Song Jiang, show yourself on the little hill west of the city, as if you were looking over the walls. He will come out for you — and the slope below the hill will be dug and covered.');
      s.idle('ys', ['Huyan Zhuo\'s whips are no joke. Twice he fought me to a standstill. A pit is a fitting end for that horse of his.']);
      s.idle('ws', ['Brother Song, the three mountains are yours. Say the word and we go where you point.']);
      s.idle('lz', ['I am Li Zhong, the Tiger-Slaying General. I sold plasters on the street once. Now I hold a mountain — or I did, until Huyan Zhuo came.']);
      s.idle('zt', ['Zhou Tong, the Little Conqueror. ...Don\'t ask the monk about my wedding night.']);
      s.idle('wyf', ['The pit is dug on the slope below the knoll. Go up and let him see you, brother. I will be at your side.']);
      ['ys', 'ws', 'lz', 'zt', 'wyf'].forEach(function (k) { s.despawn(k); });
      s.flag('ch14_pitplan');
      await s.say(null, '(Go up the little hill north-west of the camp.)');
    } },
    { id: 'ch14_pit', x: 4, y: 4, w: 10, h: 8, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch14_pitplan'); }, idle: { hy: '(Huyan Zhuo sits his black horse at the edge of the trees, watching the hill. He has not seen you.)' },
      run: async function (s) {
      // up on the crown of the knoll, Song Jiang and Wu Yong look out over the walls
      await s.walkTo('player', 9, 6); s.face('player', 'right');
      s.spawn('wy', 'wuyong', 9, 9, 'up'); await s.walkTo('wy', 8, 6); s.face('wy', 'right');
      await s.say('wuyong', '(quietly) He has seen us. Stand still, brother, and look as if you are counting the towers.');
      // out of the gate along the road comes Huyan Zhuo, riding hard, and up the path towards the knoll
      s.camera(12, 13, 0.6);
      s.spawn('hy', 'huyanzhuo', 26, 19, 'left'); s.sfx('door');
      var hs = WM.data.troop(s, 'hs', 'soldier', [[26, 20], [27, 19]], 'left');
      s.walkTo(hs[0], 16, 20, { run: true }); s.walkTo(hs[1], 17, 19, { run: true });
      await s.walkTo('hy', 10, 19, { run: true });
      await s.say('huyanzhuo:angry', 'There! On the hill — Song Jiang himself! After him!');
      await s.walkTo('hy', 10, 14, { run: true });
      await s.move('hy', 'U1', { run: true });
      // the brush over the path gives way under him
      s.flag('ch14_pitopen'); s.refreshMap();
      s.sfx('earth'); await s.shake(6, 0.4);
      await s.jump('hy', 2); s.hide('hy');
      await s.say('huyanzhuo:shock', '(from the pit) A trap — the ground — !');
      s.emote(hs[0], '!'); await s.emote(hs[1], '!');
      // the hook-men rise out of the brushwood on both sides
      var hk = WM.data.troop(s, 'hk', 'outlaw', [[6, 13], [13, 13], [7, 14], [12, 14]], 'right');
      s.face(hk[1], 'left'); s.face(hk[3], 'left');
      s.walkTo(hs[0], 26, 20, { run: true }); s.walkTo(hs[1], 26, 19, { run: true });   // (his men turn and run for the gate)
      s.cameraReset();
      await s.walkTo('player', 9, 11); s.walkTo('wy', 8, 11); s.face('player', 'down');
      await s.say('songjiang', 'Hooks! Pull him out — gently! And do not harm the horse!');
      s.walkTo(hk[0], 8, 13); await s.walkTo(hk[1], 11, 13);
      hk.forEach(function (k) { s.jump(k, 4); }); s.sfx('hit'); await s.wait(0.4);
      s.show('hy'); s.place('hy', 9, 12, 'up'); await s.jump('hy', 6);
      s.unflag('ch14_pitopen'); s.refreshMap();   // (the pit filled in again)
      WM.data.clear(s, hs);
      s.face('hy', 'up'); s.face('player', 'down');
      await s.emote('hy', 'anger', 0.8);
      await s.walkTo(hk[0], 7, 12); s.face(hk[0], 'right');
      await s.say('songjiang', 'Untie him! ...General Huyan, forgive us. We are not rebels. We were driven to this marsh by corrupt officials, and we wait only for the emperor\'s pardon to serve the state again. We would gladly follow you, if you would stay.');
      await s.emote('hy', '...', 1.4);
      await s.say('huyanzhuo', '...It is not that Huyan Zhuo is disloyal to the state. It is that your righteousness is beyond other men\'s. I will follow you. And I will give you Qingzhou: the gate will open for me tonight.');
      s.emote('wy', 'note'); await s.emote('player', 'note');
      WM.data.clear(s, hk.concat(['wy']));
      s.despawn('hy');
      s.flag('ch14_huyan');
      s.night(true);
      await s.fadeOut(0.8);
      s.place('player', 12, 19, 'right');   // (Song Jiang and his chiefs behind the column)
      s.spawn('wy6', 'wuyong', 11, 19, 'right'); s.spawn('qm6', 'qinming', 12, 20, 'right'); s.spawn('lz6', 'luzhishen', 11, 20, 'right');
      s.spawn('hy', 'huyanzhuo', 22, 19, 'right');
      var tr = WM.data.troop(s, 'qt', 'outlaw', [[16, 19], [16, 20], [15, 19], [15, 20], [14, 19], [14, 20]], 'right');
      await s.fadeIn(0.8);
      await s.walkTo('hy', 25, 19);
      await s.say('huyanzhuo', 'Open the gate! It is Huyan Zhuo! I have escaped from the bandits — open up, quickly, before they come after me!', { top: true });
      await s.say({ name: 'Gate Guard' }, '(on the wall) General Huyan! Open the gate — the general\'s back!', { top: true });
      s.sfx('door'); await s.wait(0.5);
      await s.say('songjiang', 'Now!');
      s.sfx('drum');
      tr.forEach(function (k) { s.walkTo(k, 30, 19, { run: true }); });
      s.walkTo('wy6', 24, 19, { run: true }); s.walkTo('qm6', 25, 20, { run: true }); s.walkTo('lz6', 24, 20, { run: true }); s.walkTo('player', 25, 19, { run: true });
      await s.walkTo('hy', 30, 20, { run: true });
      await s.battle('ch14_qingzhou', { bg: 'night' });
      WM.data.clear(s, tr.concat(['hy', 'wy6', 'qm6', 'lz6']));
      await s.narrate('The Liangshan men poured into Qingzhou. Qin Ming went to the prefect\'s hall and cut down Prefect Murong, who had once ordered his family killed. Kong Ming and his uncle Kong Bin were freed from the prison.');
      s.night(false);
      await s.joinMany(['huyanzhuo', 'luzhishen', 'yangzhi', 'wusong', 'shien', 'caozheng', 'zhangqing2', 'sunerniang', 'lizhong', 'zhoutong', 'kongming', 'kongliang']);
      s.flag('ch14_victory');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch14_end', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch14_victory') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('lz', 'luzhishen', 15, 7, 'down'); s.spawn('ws', 'wusong', 13, 7, 'right'); s.spawn('sj', 'songjiang', 15, 5, 'down');
      await s.narrate('The feast lasted for days. Liangshan had never been so strong. But Lu Zhishen was restless.');
      await s.say('luzhishen', 'I have a friend — Shi Jin, the Nine Dragons. He went to Mount Shaohua with Zhu Wu and Chen Da and Yang Chun. I hear he\'s in trouble in Huazhou. I\'m going to fetch him.');
      await s.say('wusong', 'Brother, let me go with you — or wait for the army.');
      await s.say('luzhishen:angry', 'Wait? While my friend rots in prison? I\'m going alone!');
      s.despawn('lz'); s.despawn('ws'); s.despawn('sj');
      s.flag('ch14_done');
      await s.endChapter();
      if (WM.data.chapters[15].begin) await WM.data.chapters[15].begin(s);
    } }
  ]);
})();
