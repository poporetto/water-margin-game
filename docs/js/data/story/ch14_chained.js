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
    map: [
      'rrTT..........',
      'rTT...........',
      'rrT...........',
      'TTT...........',
      'rrT...........',
      'rTT...........',
      'rrTT..........'
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
    intro: [['xuning', 'Into the reeds and the brush. When the chained horses come, hook the legs of one horse — and the whole chain goes down.'], ['songjiang', 'Lure them into the reeds!'], [null, 'Victory: rout Huyan Zhuo.']],
    events: [
      { turn: 1, run: async function (s, api) {
        await s.say(null, 'The chained cavalry charged into the reeds after the fleeing Liangshan men — and out of the reeds came the hooked lances. One horse went down, and the thirty chained to it fell over one another. Ling Zhen\'s fire-bombs burst behind them.');
        s.sfx('cannon'); api.weaken('enemy', 0.6);
      } },
      { turn: 3, run: async function (s, api) {
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
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('wy', 'wuyong', 15, 6, 'down');
    await s.fadeIn(0.6);
    await s.narrate('In the capital, Gao Qiu went before the emperor with the news of Gaotang. "My cousin Gao Lian is dead, the city plundered. These bandits must be destroyed." He recommended Huyan Zhuo of Ruzhou, a descendant of the great general Huyan Zan, a master of the twin steel whips. The emperor gave Huyan Zhuo a black horse with white hooves, "Snow-Treading Black," and an army.');
    await s.say('wuyong', 'Brother, Huyan Zhuo is coming with Han Tao, the General of a Hundred Victories, and Peng Qi, the Heaven-Eyed General. They are both good soldiers.');
    await s.say('songjiang', 'Then we go down to meet them on the plain.');
    s.despawn('wy');
    await s.duel('linchong_huyan', { hero: 'linchong', canLose: true });
    await s.duel('hu_pengqi', { hero: 'husanniang', canLose: true });
    s.spawn('pq', 'pengqi', 16, 12, 'up'); s.spawn('hs', 'husanniang', 17, 12, 'up');
    await s.walkTo('pq', 16, 10); await s.walkTo('hs', 17, 10);
    await s.say('husanniang', 'Brother — the Heaven-Eyed General. I pulled him out of the saddle myself.');
    await s.walkTo('player', 16, 9); s.face('player', 'down');
    await s.say('songjiang', 'Untie him! ...General Peng, forgive the ropes. We are not rebels; we wait only for the emperor\'s pardon. Will you stay with us?');
    s.sfx('item');
    await s.say('pengqi', '...You untie your prisoner with your own hands? General Song, I have heard of your righteousness. Peng Qi will stay.');
    s.despawn('pq'); s.despawn('hs', { leave: true });
    await s.join('pengqi');
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
    await s.battle('ch14_lingzhen', { bg: 'river' });
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
      good: 'A thin reed tube, a soft breath — and the lamp went out. "The wind," said the maid, and went to fetch a light, and did not come back.' },
    { text: 'In the night Xu Ning stirred in his bed. "What\'s that scratching up on the beam?"',
      opts: ['Drop down and run for the door', 'Keep perfectly still', 'Squeak and scrabble like fighting rats'], ok: 2,
      fail: ['Shi Qian landed on a stool with a crash.', 'Silence was worse. Xu Ning sat up and reached for the lamp...', ''],
      good: 'Squeak, squeak, scrabble — the rats are fighting on the beam again. Xu Ning grunted and turned over.' },
    { text: 'The fourth watch. The box was in Shi Qian\'s arms. Below, the servants unbarred the back gate to go and fetch water for the morning.',
      opts: ['Slip out behind them through the gate', 'Wait for full daylight', 'Climb out over the roof'], ok: 0,
      fail: ['', 'At dawn the house woke, and the empty beam was seen at once.', 'A tile slid under his foot and smashed in the yard.'],
      good: 'While the servants clattered with their buckets, a shadow with a box on its back slipped out of the gate behind them and was gone.' }
  ];
  WM.defEvents('kaifeng_in', [
    { id: 'ch14_xu', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch14_heist') && WM.state.x >= 51 && WM.state.y >= 11; }, run: async function (s) {
      s.music('tense');
      for (var i = 0; i < HEIST.length; i++) {
        var h = HEIST[i], tries = 0;
        await s.narrate(h.text);
        for (;;) {
          var k = await s.ask('shiqian', 'What should I do?', h.opts);
          if (k === h.ok || tries >= 2) { await s.narrate(h.good); break; }
          tries++;
          await s.narrate(h.fail[k] + ' Shi Qian shrank back into the dark under the eaves, and waited until all was quiet again.');
        }
      }
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
      s.spawn('sq', 'shiqian', 22, 9, 'left'); s.lie('sq');
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
      await s.warp('liangshan', 24, 37, 'down', { noFade: true });
      s.hide('player');
      var dr = WM.data.troop(s, 'dr', 'outlaw', [[20, 39], [22, 39], [24, 39], [26, 39], [28, 39], [20, 40], [22, 40], [24, 40], [26, 40], [28, 40]], 'up');
      s.spawn('xn', 'xuning', 24, 38, 'down');
      await s.fadeIn(0.6);
      await s.say('xuning', '"Seven steps, three hooks and four thrusts; nine changes in all!" Hook low — at the horse\'s legs, not the rider!');
      for (var dk = 0; dk < 3; dk++) { dr.forEach(function (k) { s.jump(k, 4); }); s.sfx('slash'); await s.wait(0.5); }
      await s.say('xuning', 'Again! When the chained horses come, one falls, and the whole line falls with it!');
      dr.forEach(function (k) { s.jump(k, 4); }); s.sfx('crit'); await s.wait(0.5);
      await s.say('xuning:smile', 'Good. In half a month, seven hundred of you will know it.');
      await s.fadeOut(0.6);
      WM.data.clear(s, dr.concat(['xn']));
      s.show('player');
      await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
      await s.fadeIn(0.6);
      s.party(['songjiang', 'xuning', 'linchong', 'huarong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.war('ch14_hooks');
      await s.join('hantao');
      await s.narrate('Huyan Zhuo escaped alone towards Qingzhou. On the way he stopped at a village inn, and in the night his black horse, Snow-Treading Black, was stolen. "That will be the bandits of Peach Blossom Mountain," said the innkeeper.');
      await s.narrate('In Qingzhou, Prefect Murong gave Huyan Zhuo two thousand men to wipe out the bandits of Peach Blossom Mountain and get his horse back. Li Zhong and Zhou Tong, terrified, sent to Mount Erlong for help.');
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
      s.spawn('hy', 'huyanzhuo', 14, 20, 'left');
      await s.say('luzhishen', 'Brother Wu Song, Brother Yang Zhi — leave him to me first!');
      await s.duel('lu_huyan', { hero: 'luzhishen', canLose: true });
      await s.duel('yangzhi_huyan', { hero: 'yangzhi', canLose: true });
      s.despawn('hy', { leave: true });
      await s.narrate('Huyan Zhuo went back into Qingzhou. A few days later he caught Kong Ming of White Tiger Mountain, who had come to rescue his uncle Kong Bin from the prison, and threw him into the cells too. Kong Ming\'s brother Kong Liang fled — straight into Wu Song on the road.');
      s.spawn('kl', 'kongliang', 12, 21, 'left');
      await s.say('kongliang:sad', 'Master Wu Song! My brother is taken!');
      await s.say('wusong', 'Kong Liang! ...Huyan Zhuo is too strong for any one of our mountains. But Song Jiang of Liangshan is my brother, and yours too — he stayed at your father\'s house. Go to Liangshan and ask him. And let the three mountains fight together.');
      await s.say('yangzhi', 'Agreed. Erlong, Peach Blossom and White Tiger — one army, under Song Jiang.');
      s.despawn('kl', { leave: true });
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
      await s.warp('qingzhou', 10, 22, 'up', { noFade: true });
      s.spawn('ys', 'yangzhi', 8, 21, 'right'); s.spawn('ws', 'wusong', 12, 22, 'left'); s.spawn('lz', 'lizhong', 7, 24, 'right'); s.spawn('zt', 'zhoutong', 13, 23, 'left');
      await s.fadeIn(1);
      await s.say('wusong', 'Brother! You came!');
      await s.say('songjiang:smile', 'Brother Wu Song. Brother Lu Zhishen. Yang Zhi. I have long wanted to see you on our mountain.');
      await s.say('wuyong', 'Huyan Zhuo is brave but proud. Tomorrow, Brother Song Jiang, show yourself on the little hill west of the city, as if you were looking over the walls. He will come out for you — and the slope below the hill will be dug and covered.');
      ['ys', 'ws', 'lz', 'zt'].forEach(function (k) { s.despawn(k); });
      s.flag('ch14_pitplan');
      await s.say(null, '(Go up the little hill north-west of the camp.)');
    } },
    { id: 'ch14_pit', x: 4, y: 4, w: 10, h: 8, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch14_pitplan'); }, idle: { hy: '(Huyan Zhuo sits his black horse at the edge of the trees, watching the hill. He has not seen you.)' },
      run: async function (s) {
      s.spawn('hy', 'huyanzhuo', 22, 13, 'left');
      await s.say('huyanzhuo:angry', 'There! On the hill — Song Jiang himself! Follow me!');
      await s.move('hy', 'L5 D1 L5 U1');   // round the trees to the pit
      s.sfx('earth'); await s.shake(6, 0.4);
      await s.jump('hy', 2); s.hide('hy');
      await s.say('huyanzhuo:shock', '(from the pit) A trap — the ground — !');
      var hk = WM.data.troop(s, 'hk', 'outlaw', [[9, 13], [12, 13], [8, 12], [13, 12]], 'up');
      await s.say('songjiang', 'Hooks! Pull him out — gently! And do not harm the horse!');
      hk.forEach(function (k) { s.jump(k, 4); }); s.sfx('hit'); await s.wait(0.4);
      WM.data.clear(s, hk);
      s.despawn('hy');
      s.spawn('hy', 'huyanzhuo', 9, 12, 'up');
      await s.say('songjiang', 'Untie him! ...General Huyan, forgive us. We are not rebels. We were driven to this marsh by corrupt officials, and we wait only for the emperor\'s pardon to serve the state again. We would gladly follow a man like you.');
      await s.say('huyanzhuo', '...It is not that Huyan Zhuo is disloyal to the state. It is that your righteousness is beyond other men\'s. I will follow you. And I will give you Qingzhou: the gate will open for me tonight.');
      s.despawn('hy');
      s.flag('ch14_huyan');
      s.night(true);
      await s.fadeOut(0.8);
      s.place('player', 18, 19, 'right'); s.hide('player');
      s.spawn('hy', 'huyanzhuo', 22, 19, 'right');
      var tr = WM.data.troop(s, 'qt', 'outlaw', [[16, 19], [16, 20], [15, 19], [15, 20], [14, 19], [14, 20]], 'right');
      await s.fadeIn(0.8);
      await s.walkTo('hy', 25, 19);
      await s.say('huyanzhuo', 'Open the gate! It is Huyan Zhuo! I have escaped from the bandits — open up, quickly, before they come after me!', { top: true });
      await s.say('guard', '(on the wall) General Huyan! Open the gate — the general\'s back!', { top: true });
      s.sfx('door'); await s.wait(0.5);
      await s.say('songjiang', 'Now!');
      s.sfx('drum');
      tr.forEach(function (k) { s.walkTo(k, 30, 19, { run: true }); });
      await s.walkTo('hy', 30, 20, { run: true });
      await s.battle('ch14_qingzhou', { bg: 'night' });
      WM.data.clear(s, tr.concat(['hy']));
      s.show('player');
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
