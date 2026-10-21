// Chapter 23 — "The Southern Campaign" (novel chapters 110–119).
// Fang La. Seventy of the hundred and eight die: fifty-nine in battle, ten of illness, and Lu Zhishen, who dies seated
// in meditation at the Liuhe Temple. Every death is placed where the novel places it (see docs/STORY.md). Played: the
// crossing at Runzhou, Wu Song at Suzhou, Zhang Shun at the Yongjin Gate, the battle for Hangzhou, Muzhou, the Yuling
// Pass, Qingxi, Lu Zhishen's capture of Fang La, the tide at Qiantang. The rest is narrated, as a roll of the fallen.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('fangla', 'Fang La', { skin: '#e8c0a0', hairStyle: 'futou', beard: 'full', body: '#e8c840', trim: '#c83a1a', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('shibao', 'Shi Bao', { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#2a2a32', tassel: '#c8302a', beard: 'short', body: '#3a2a2a', trim: '#c8b890', weapon: 'saber', build: 'big', face: 'square', eyes: 'sharp' }, { face: true });
  WM.npc('fangmao', 'Fang Mao', { skin: '#e8c0a0', hairStyle: 'helmet', helmColor: '#d8b040', tassel: '#c8302a', body: '#7a2a2a', trim: '#e8c860', weapon: 'spear', face: 'round' }, { face: true });

  var hum = WM.hum;
  var south = { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#5a5a62', tassel: '#e8c840', body: '#5a3a6a', trim: '#e8c860', weapon: 'spear' };
  WM.enemy('south_spear', 'Southern Spearman', 40, hum(south), { range: 'M', exp: 240, drops: [['medicine', 0.15]] });
  WM.enemy('south_archer', 'Southern Archer', 40, hum(Object.assign({}, south, { weapon: 'bow' })), { hp: 0.85, range: 'L', fx: 'arrow', exp: 240 });
  WM.enemy('fangmao_foe', 'Fang Mao', 41, hum(WM.data.npcs.fangmao.look), { hp: 2.4, exp: 700, gold: 500, boss: true, range: 'M' });
  WM.enemy('pangwanchun_foe', 'Pang Wanchun', 42, hum(Object.assign({}, south, { weapon: 'bow', body: '#2a5a3a' })), { hp: 1.9, spd: 1.3, exp: 800, gold: 500, boss: true, range: 'L', fx: 'arrow',
    skills: [{ name: 'Little Yang Youji', chance: 0.35, type: 'phys', power: 1.3, fx: 'arrow', sfx: 'arrow' }, { name: 'Rain of Arrows', chance: 0.2, type: 'phys', power: 0.8, target: 'all', fx: 'arrow', sfx: 'arrow' }] });
  var T = WM.data.troops;
  T.ch23_suzhou = { enemies: ['south_spear', 'fangmao_foe', 'south_spear'], bg: 'town', boss: true };
  T.ch23_yuling = { enemies: ['south_archer', 'pangwanchun_foe', 'south_archer'], bg: 'forest', boss: true };

  WM.data.duels.lu_fangla = {
    hero: 'luzhishen', foe: 'fangla', bg: 'forest', heroHp: 900, heroAtk: 66, foeHp: 420, foeAtk: 40,
    intro: [['foe:shock', 'A monk? Out of my way, monk!'], ['hero', 'I have been looking for you all over these hills.']],
    lines: { attack: ['Out of my way!', 'Hah!', 'Back!'], wild: ['I am the emperor!', 'Die!', 'Away!'], defend: ['No...', 'Get back!', 'Mercy...'] },
    win: [[null, 'Lu Zhishen knocked him down with one sweep of his staff and tied him up with his own belt.']], lose: [[null, 'Fang La ran, and stumbled — and Lu Zhishen was on him and tied him up with his own belt.']]
  };

  function W(name, turns, units, enemy, intro, events, win) {
    return { name: name, goal: 'commander', turns: turns, music: 'war',
      map: ['......T.......', '..mm.......#..', '...........G..', '...........G..', '...........G..', '..mm.......#..', '......T.......'],
      player: units, enemy: enemy, intro: intro, events: events || [], win: win, lose: [['songjiang:sad', 'Fall back...']] };
  }
  WM.data.wars.ch23_runzhou = W('The Crossing at Runzhou', 10, [
    { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
    { leader: 'guansheng', type: 'cav', x: 3, y: 2 }, { leader: 'huyanzhuo', type: 'cav', x: 3, y: 4 },
    { leader: 'huarong', type: 'arch', x: 1, y: 1 }, { leader: 'songwan', support: ['jiaoting', 'taozongwang'], type: 'inf', x: 2, y: 3 },
    { leader: 'lijun', support: ['tongwei', 'tongmeng'], type: 'naval', x: 1, y: 5 }
  ], [
    { name: 'Lü Shinang', type: 'cav', atk: 136, def: 120, x: 12, y: 3, commander: true },
    { name: 'Southern Cavalry', type: 'cav', atk: 126, def: 116, x: 10, y: 2 }, { name: 'Southern Cavalry', type: 'cav', atk: 126, def: 116, x: 10, y: 4 },
    { name: 'Southern Foot', type: 'inf', atk: 120, def: 124, x: 12, y: 1 }, { name: 'Southern Archers', type: 'arch', atk: 118, def: 86, x: 12, y: 5 }
  ], [['songjiang', 'Fang La holds eight prefectures. Runzhou is the gate of the south.'], [null, 'Victory: rout Lü Shinang.']],
  [{ turn: 2, run: async function (s, api) { await s.say(null, 'Mu Hong and Li Jun, disguised as the traitor Chen Guan\'s sons, had brought the army across the Yangtze in Fang La\'s own boats. The gates of Runzhou opened from within.'); api.weaken('enemy', 0.8); } }],
  [['guansheng', 'Runzhou is ours.']]);
  WM.data.wars.ch23_hangzhou = W('Hangzhou', 12, [
    { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
    { leader: 'guansheng', type: 'cav', x: 3, y: 2 }, { leader: 'huyanzhuo', support: ['suochao'], type: 'cav', x: 3, y: 4 },
    { leader: 'liutang', support: ['baoxu', 'dengfei'], type: 'inf', x: 2, y: 3 }, { leader: 'huarong', type: 'arch', x: 1, y: 1 },
    { leader: 'zhangheng', support: ['ruanxiaoqi'], type: 'naval', x: 1, y: 5 }
  ], [
    { name: 'Fang Tianding', type: 'cav', atk: 138, def: 122, x: 12, y: 3, commander: true },
    { name: 'Shi Bao', portrait: 'shibao', type: 'cav', atk: 146, def: 124, x: 11, y: 2 },
    { name: 'Deng Yuanjue', type: 'inf', atk: 136, def: 124, x: 11, y: 4 },
    { name: 'Southern Guard', type: 'inf', atk: 124, def: 128, x: 13, y: 1 }, { name: 'Southern Archers', type: 'arch', atk: 120, def: 88, x: 13, y: 5 }
  ], [['songjiang', 'Hangzhou. Brother Zhang Shun died at its gate. Take it.'], [null, 'Victory: rout Fang Tianding.']],
  [{ turn: 3, run: async function (s, api) { await s.say(null, 'Liangshan men hidden in grain boats from Fuyang came in under the walls. The city was opened from inside, and fire ran through the streets.'); api.weaken('enemy', 0.75); } }],
  [['zhangheng', '...Brother. Brother Zhang Shun. I have Fang Tianding\'s head.']]);
  WM.data.wars.ch23_muzhou = W('Muzhou', 12, [
    { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
    { leader: 'guansheng', type: 'cav', x: 3, y: 2 }, { leader: 'huarong', type: 'arch', x: 1, y: 1 },
    { leader: 'lingzhen', type: 'arch', x: 1, y: 5 }, { leader: 'likui', support: ['xiangchong', 'ligun'], type: 'inf', x: 3, y: 4 },
    { leader: 'wangying', support: ['husanniang'], type: 'cav', x: 2, y: 3 }
  ], [
    { name: 'Zheng Biao, Demon Lord', type: 'mage', atk: 142, def: 118, x: 11, y: 3, commander: true },
    { name: 'Bao Daoyi', type: 'mage', atk: 146, def: 110, x: 12, y: 3 },
    { name: 'Southern Cavalry', type: 'cav', atk: 130, def: 118, x: 10, y: 2 }, { name: 'Southern Cavalry', type: 'cav', atk: 130, def: 118, x: 10, y: 4 },
    { name: 'Muzhou Guard', type: 'inf', atk: 126, def: 130, x: 13, y: 1 }
  ], [['wuyong', 'Zheng Biao and his master Bao Daoyi are sorcerers. Bao Daoyi\'s sword flies by itself.'], [null, 'Victory: rout Zheng Biao.']],
  [{ turn: 2, run: async function (s, api) { await s.say(null, 'Ling Zhen\'s trebuchet loosed, and a thunderclap bomb burst on the sorcerer Bao Daoyi where he stood on the wall.'); s.sfx('cannon'); api.rout('Bao Daoyi'); api.weaken('enemy', 0.85); } }],
  [['guansheng', 'Zheng Biao is dead. Muzhou has fallen.']]);
  WM.data.wars.ch23_qingxi = W('Qingxi', 12, [
    { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
    { leader: 'lujunyi', support: ['yanqing'], type: 'cav', x: 3, y: 3 }, { leader: 'guansheng', type: 'cav', x: 3, y: 1 },
    { leader: 'qinming', type: 'cav', x: 3, y: 5 }, { leader: 'huarong', type: 'arch', x: 1, y: 1 },
    { leader: 'lijun', support: ['ruanxiaowu', 'ruanxiaoqi'], type: 'naval', x: 1, y: 5 }
  ], [
    { name: 'Fang Jie', type: 'cav', atk: 150, def: 128, x: 11, y: 3, commander: true },
    { name: 'Du Wei', type: 'inf', atk: 140, def: 120, x: 10, y: 2 }, { name: 'Lou Minzhong', type: 'inf', atk: 132, def: 122, x: 10, y: 4 },
    { name: 'Palace Guard of the South', type: 'inf', atk: 132, def: 134, x: 12, y: 1 }, { name: 'Palace Guard of the South', type: 'inf', atk: 132, def: 134, x: 12, y: 5 }
  ], [['songjiang', 'Qingxi, where Fang La began. Chai Jin is inside, as his son-in-law. Li Jun\'s men have gone in as deserters. Strike.'], [null, 'Victory: rout Fang Jie.']],
  [{ turn: 2, run: async function (s, api) { await s.say(null, 'Fires broke out inside Qingxi — Li Jun\'s men. Chai Jin, at Fang Jie\'s side, turned his sword on him.'); s.sfx('fire'); api.weaken('enemy', 0.7); } }],
  [['songjiang', 'Qingxi has fallen. ...Where is Fang La?']]);

  // narrate a death, take the fallen out of the world, and show their names
  async function fall(s, ids, text) {
    await s.narrate(text);
    ids.forEach(function (id) { if (!WM.state.dead[id]) { WM.state.dead[id] = true; S.removeFromParty(id); } });
    await s.notice('Fallen: ' + ids.map(function (id) { return S.def(id).name; }).join(', '), { auto: 2.6 });
  }

  WM.data.chapters[23].begin = async function (s) {
    await s.chapter(23);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'guansheng', 'huarong', 'wusong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    WM.data.charOrder.forEach(function (id) { if (WM.state.chars[id] && WM.state.chars[id].lv < 40) s.level(id, 40); });
    await s.narrate('The army of Liangshan crossed the Huai and came to the Yangtze, and looked across the water at Runzhou, held by Fang La\'s general Lü Shinang.');
    await WM.data.warCouncil(s, {
      beside: 'wuyong', generals: ['lujunyi', 'guansheng', 'huarong', 'zhangshun', 'shixiu', 'muhong'],
      scout: { lines: ['Brother, the Yangtze is a mile wide here, and Runzhou is on the far shore. Lü Shinang has ships across the river mouth, and on Jinshan and Jiaoshan — the two islands — his men keep watch day and night.'] },
      lines: [['zhangshun', 'Then I\'ll swim over to Jinshan tonight and see how well they watch.'],
        ['wuyong', 'And we will cross in merchant ships, with our soldiers lying under the grain sacks. Grain for Runzhou, as far as anyone can see.'],
        ['songjiang', 'The first river of the south. Go carefully, brothers. Every one of you.']]
    });
    await s.war('ch23_runzhou');
    await fall(s, ['songwan', 'jiaoting', 'taozongwang'], 'Runzhou was taken. But in the confusion of the battle, three chiefs fell under arrows and hooves: Song Wan, who had helped Wang Lun found Liangshan; Jiao Ting the Faceless; and Tao Zongwang, the Nine-Tailed Tortoise. Song Jiang buried them outside the east gate of Runzhou, and wept.');
    await s.say('songjiang:sad', 'Three brothers, at the first river. ...How many will cross back?');
    await s.narrate('Yang Zhi fell sick and was left behind at Dantu. The army divided: Song Jiang towards Changzhou and Suzhou, Lu Junyi towards Xuanzhou and Huzhou.');
    await fall(s, ['hantao', 'pengqi'], 'Before Changzhou, an arrow from the Southern general Gao Keli struck Han Tao in the face. Peng Qi rode to avenge him, and Zhang Jinren speared him from the side. They had come to Liangshan together, as prisoners of war, and they died together.');
    await fall(s, ['zhengtianshou', 'caozheng', 'wangdingliu'], 'At Xuanzhou, a millstone thrown from the wall killed Zheng Tianshou, the Fair-Faced Gentleman. Cao Zheng and Wang Dingliu were struck by poisoned arrows and died as they reached the camp. When Song Jiang heard, he fainted away.');
    s.party(['wusong', 'luzhishen', 'likui', 'zhutong']); s.setLeader('wusong');
    await s.say('wusong', 'Fang Mao, Fang La\'s own brother, holds Suzhou. The gates are shut and the canals are full of his boats. Brothers, we go in on foot, by the Pan Gate, while they watch the water.');
    await s.say('luzhishen:smile', 'Ha! Lead on, brother. My staff has been idle since the river.');
    await s.battle('ch23_suzhou', { bg: 'town' });
    await fall(s, ['xuanzan', 'shien', 'kongliang'], 'At Suzhou, Wu Song killed Fang La\'s brother Fang Mao. But under the Yinma Bridge, Xuan Zan the Ugly Prince Consort and the Southern general Guo Shiguang wounded each other and died together. At Changshu and Kunshan, Shi En and Kong Liang, who could not swim, fell from the boats and drowned.');
    await s.narrate('An envoy came from the capital: the Retired Emperor was unwell, and An Daoquan was to return at once. Song Jiang could not refuse.');
    s.flag('away:andaoquan'); S.removeFromParty('andaoquan');
    s.flag('ch23_hangzhou');
    s.party(['zhangshun']); s.setLeader('zhangshun'); s.flag('protagonist', 'zhangshun');
    await s.narrate('Before Hangzhou, the army camped beside the West Lake. Zhang Shun said: "I\'ll swim across the lake by night and climb in at the Yongjin Gate, and open it from inside. Then you will have the city."');
    s.night(true);
    await s.warp('hangzhou', 22, 15, 'right');
  };
  WM.data.chapters[23].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 22; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall'); s.flag('grand_assembly');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 40); });
    ['gongsunsheng', 'xiaorang', 'yuehe', 'jindajian', 'huangfuduan'].forEach(function (id) { s.flag('away:' + id); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'daming');
    await WM.data.chapters[23].begin(s);
  };

  // ---------------- Hangzhou ----------------
  WM.defEvents('hangzhou', [
    { id: 'ch23_yongjin', x: 24, y: 14, w: 2, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch23_hangzhou'); }, run: async function (s) {
      await s.fadeOut(0.6);
      s.place('player', 22, 15, 'right'); s.hide('player');
      await s.fadeIn(0.6);
      await s.narrate('Zhang Shun crossed the whole of the West Lake under the water, with a knife in his teeth.');
      s.show('player'); s.splash('player');
      await s.walkTo('player', 25, 15);
      s.face('player', 'right');
      await s.say('zhangshun', '(whispering, the knife in his hand now) The water-grating... up, and over, and the gate is ours.');
      await s.jump('player', 4);
      s.sfx('bell'); await s.wait(0.3); s.sfx('bell');
      await s.emote('player', '!');
      await s.say('zhangshun:shock', '(A bell — strung on the grating!)');
      var wg = WM.data.troop(s, 'yg', 'soldier', [[27, 13], [27, 17], [28, 14], [28, 16]], 'left');
      wg.forEach(function (k) { s.emote(k, '!', 0.8); });
      await s.say('soldier', 'Torches! Someone at the water-grating! Shoot — shoot!');
      s.sfx('arrow'); await s.flash(); s.sfx('arrow'); await s.shake(3, 0.3);
      WM.data.clear(s, wg);
      await fall(s, ['zhangshun'], 'Arrows, crossbow bolts and stones rained down into the pool. Zhang Shun, the White Streak in the Waves, who could stay seven days under water, died in the pool outside the Yongjin Gate.');
      s.night(false);
      s.party(['songjiang', 'lujunyi', 'wuyong', 'guansheng', 'huarong', 'huyanzhuo']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      s.flag('ghost:zhangshun');
      s.spawn('zs', 'zhangshun', 22, 14, 'right');   // up out of the lake onto the bank, dripping
      await s.say('zhangshun:sad', 'Brother... I am cold. The water at Yongjin Gate is so cold...');
      await s.say('songjiang:sad', 'Brother Zhang Shun!');
      s.hide('zs'); s.despawn('zs'); s.unflag('ghost:zhangshun');   // a dream: he is simply gone when Song Jiang wakes
      await s.narrate('Song Jiang woke weeping, and held a sacrifice for Zhang Shun\'s spirit at the Xiling bridge. Then the battle for Hangzhou began.');
      await fall(s, ['xuning', 'haosiwen'], 'At the North Gate an ambush closed on them. A poisoned arrow struck Xu Ning in the neck; he lingered half a month and died. Hao Siwen was taken by six Southern generals and put to death by Fang Tianding.');
      await fall(s, ['dongping', 'zhangqing', 'zhoutong'], 'At the Dusong Pass, Zhang Tao cut Dong Ping in two from behind. Zhang Qing\'s spear stuck fast in a pine tree, and Li Tianrun speared him through the belly. Li Tianrun cut down Zhou Tong in the same fight.');
      await fall(s, ['leiheng', 'gongwang'], 'At Deqing, Si Xingfang cut Lei Heng from his horse. Gong Wang\'s horse fell into a stream, and the Southern soldiers speared him in the water.');
      await WM.data.warCouncil(s, {
        beside: 'wuyong', generals: ['guansheng', 'huarong', 'huyanzhuo', 'linchong', 'zhangheng', 'likui'],
        lines: [['wuyong', 'Fang Tianding holds Hangzhou with seven gates and seventy thousand men. We have already lost Xu Ning, Dong Ping, Zhang Qing...'],
          ['zhangheng:sad', 'And my brother. Give me the Yongjin Gate, brother Song Jiang. I will go in where he died.'],
          ['songjiang', 'All seven gates at once, then. For every brother who has fallen on this road.']]
      });
      await s.war('ch23_hangzhou');
      await fall(s, ['liutang', 'baoxu', 'dengfei', 'suochao'], 'At the Houchao Gate, Liu Tang rode in as the portcullis rope was cut, and horse and man died together under the gate. At the North Gate, Shi Bao cut Bao Xu in two, and then Deng Fei; and Suo Chao, the Vanguard Hothead, fell to Shi Bao\'s hammer.');
      await s.narrate('Hangzhou fell. Zhang Heng, possessed by his dead brother\'s spirit, cut off Fang Tianding\'s head and brought it to Song Jiang. Then a plague broke out in the city, and six chiefs fell sick: Zhang Heng, Mu Hong, Kong Ming, Zhu Gui, Yang Lin and Bai Sheng. Mu Chun and Zhu Fu stayed behind to nurse them.');
      await fall(s, ['houjian', 'duanjingzhu'], 'Ruan Xiaoqi came back from the coast. His boat had been wrecked on the way to Haiyan, and Hou Jian the tailor and Duan Jingzhu the horse-thief, who could not swim, had drowned in the sea.');
      await fall(s, ['ruanxiaoer', 'mengkang', 'xiezhen', 'xiebao'], 'At the river below Wulong Ridge, fire-rafts came down on the navy. Ruan Xiao\'er, surrounded, cut his own throat rather than be taken. A fire-bomb from the bank struck Meng Kang\'s helmet. Xie Zhen, climbing the cliff by night, was hooked from above, cut his rope, and fell a hundred feet; Xie Bao died under stones and arrows in the bamboo at the foot of the ridge. Hunters all their lives, they died together on the mountain.');
      s.flag('ch23_muzhou');
      await s.say('songjiang', 'Muzhou, and then Qingxi — Fang La\'s nest.');
      await s.say('wuyong', 'Bao Daoyi the Daoist and Zheng Biao, the Demon Lord, hold Muzhou. Their sorcery is all Fang La has left. We must strike before they can work it.');
      await s.war('ch23_muzhou');
      await fall(s, ['wangying', 'husanniang', 'xiangchong', 'ligun'], 'Before Muzhou, the Demon Lord Zheng Biao speared Wang Ying from his horse. Hu Sanniang, his wife, rode after Zheng Biao to avenge him, and a gilded brick from his sorcery struck her down. Xiang Chong and Li Gun, chasing the enemy across a stream, fell in: Xiang Chong was hacked to pieces, Li Gun shot full of arrows.');
      // Wu Song is brought into the camp, his sleeve empty
      s.spawn('ws23', 'wusong', 16, 21, 'up'); s.spawn('ws1', 'outlaw', 15, 21, 'up'); s.spawn('ws2', 'outlaw', 17, 21, 'up');
      s.moveTo('ws1', 15, 12, { yFirst: true, wait: false }); s.moveTo('ws2', 17, 12, { yFirst: true, wait: false }); await s.moveTo('ws23', 16, 11, { yFirst: true });
      await s.narrate('Bao Daoyi\'s flying sword had struck Wu Song\'s left arm and all but cut it off. Wu Song cut through what was left with his own monk\'s knife, and lived.');
      await s.say('songjiang:sad', 'Brother Wu Song... your arm.');
      await s.say('wusong', 'It is only an arm, brother. Better I took it than his sorcery. ...But Brother Lu Zhishen went after the Southern general Xiahou Cheng into the hills, and he has not come back.');
      await s.say('wuyong:sad', 'We have sent men into every valley. No one has seen him.');
      s.despawn('ws23', { to: [16, 22] }); s.despawn('ws1', { to: [16, 22] }); s.despawn('ws2', { to: [16, 22] });
      await s.wait(0.6);
      await fall(s, ['yanshun', 'malin'], 'On Wulong Ridge, Shi Bao\'s meteor hammer killed Yan Shun, and Shi Bao cut Ma Lin in two after Bai Qin\'s spear had brought him down.');
      await fall(s, ['lufang', 'guosheng'], 'Lü Fang grappled with Bai Qin on the edge of the ridge, and the two of them fell together down the cliff. A boulder from the heights killed Guo Sheng, horse and man. The two young halberdiers who had once fought each other on a mountain road had never been apart since.');
      s.flag('ch23_yuling');
      s.party(['lujunyi', 'shiqian', 'yanqing']); s.setLeader('lujunyi'); s.flag('protagonist', 'lujunyi');
      await s.narrate('On the other road, Lu Junyi came to the Yuling Pass. Shi Jin led the vanguard.');
      await fall(s, ['shijin', 'shixiu', 'chenda', 'yangchun', 'lizhong', 'xueyong'], 'At the pass, an arrow from Pang Wanchun — the "Little Yang Youji," who never missed — struck Shi Jin from his horse. Shi Xiu, Chen Da, Yang Chun, Li Zhong and Xue Yong, caught in the pass, were shot down from both slopes and died in a heap below the pass. Shi Jin, Chen Da and Yang Chun had come from Shaohua together, long ago.');
      await s.say('shiqian', 'Master, nobody will take that pass from the front. But there\'s a goat-track round behind it, through the cliffs. Let me go up tonight.');
      await s.say('lujunyi:sad', 'Go, then — and may Heaven keep you, Drum-Flea.');
      await s.narrate('Shi Qian climbed round behind the pass by night and set fire to it.');
      await s.battle('ch23_yuling', { bg: 'forest' });
      await fall(s, ['oupeng', 'zhangqing2', 'dingdesun', 'shantinggui', 'weidingguo', 'liyun', 'shiyong'], 'At Shezhou, Pang Wanchun shot Ou Peng in the back. Zhang Qing the Gardener fell in the confusion. Ding Desun was bitten by a snake on the mountain path, and the poison went to his heart. Shan Tinggui and Wei Dingguo charged into the city and fell into a pit, and were speared in it. Wang Yin trampled Li Yun and speared Shi Yong.');
      s.party(['songjiang', 'lujunyi', 'wuyong', 'guansheng', 'huarong', 'likui']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.say('lujunyi:sad', 'Brother... Shi Jin, Shi Xiu, the Shaohua men — all of them, at the pass. This is all I could bring you.');
      await s.say('songjiang:sad', 'We are nearly at the end of it, brother. Fang La is behind the walls of Qingxi. Let us finish it, and take home the ones who are left.');
      s.sfx('drum'); await s.wait(0.3); s.sfx('drum');
      await s.war('ch23_qingxi');
      await fall(s, ['qinming', 'yubaosi', 'sunerniang', 'zouyuan', 'duqian', 'lili', 'tanglong', 'caifu', 'ruanxiaowu'], 'At Qingxi, Fang Jie\'s halberd brought down Qin Ming while Du Wei\'s flying knife distracted him. Du Wei\'s knives killed Yu Baosi and Sun Erniang. Zou Yuan and Du Qian were trampled in the cavalry. Li Li, Tang Long and Cai Fu died of wounds that would not heal. Ruan Xiaowu was killed by the chancellor Lou Minzhong.');
      await s.narrate('Fang La fled from the palace into the Pangyuan cave, and from the cave into the hills, alone.');
      s.party(['luzhishen']); s.setLeader('luzhishen'); s.flag('protagonist', 'luzhishen');
      s.flag('ch23_hills');
      await s.warp('qingxi', 16, 26, 'up');
    } }
  ]);
  WM.defEvents('qingxi', [
    { id: 'ch23_fangla', x: 18, y: 2, w: 10, h: 7, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch23_hills'); }, run: async function (s) {
      await s.narrate('Lu Zhishen had chased Xiahou Cheng deep into the hills and killed him, and had been lost there ever since, living on what an old monk in a grass hut gave him. That morning the old monk had said: "Wait by the pine trees. Catch the big man who comes out of the woods." A man in a yellow robe came stumbling out of the trees.');
      s.spawn('fl', 'fangla', 26, 8, 'left');
      await s.walkTo('fl', 23, 7);
      await s.emote('fl', '!');
      await s.say('fangla', '(in a torn yellow robe, gasping) A monk? Out of my way, monk!');
      await s.say('luzhishen', 'The old man said: catch the big man who comes out of the woods. You\'re big enough.');
      await s.duel('lu_fangla', { hero: 'luzhishen', canLose: true });
      s.despawn('fl', { leave: true });
      await s.say('luzhishen', '"Meet Xia, and capture. Meet La, and seize." ...Xiahou Cheng, and Fang La. So that is what the old man meant.');
      s.flag('ch23_caught');
      await s.narrate('So Fang La, who had called himself emperor of the south, was taken by a monk with a staff. He was sent to the capital in a cage. The army turned back north, and came to Hangzhou, and camped at the Liuhe Temple above the Qiantang River.');
      await s.warp('liuhe', 16, 13, 'up');
    } }
  ]);
  WM.defEvents('liuhe', [
    { id: 'ch23_tide', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch23_caught'); }, run: async function (s) {
      s.night(true); s.music('sad');
      await s.narrate('That night, under a bright moon, a sound like ten thousand drums came up the river. Lu Zhishen leapt up and seized his staff, thinking it was the enemy.');
      await s.say('luzhishen:shock', 'War drums!');
      s.spawn('mk', 'monk', 17, 12, 'left');
      await s.say('monk', 'Master, that is the tide of the Qiantang. It comes at the same hour every day and every night, and it never fails. We call it the tide\'s signal — the tide\'s faith.');
      s.despawn('mk');
      await s.say('luzhishen', '..."Hear the tide, and be complete. See the signal, and be still." The tide\'s faith... the signal. Master Zhizhen, I understand now.');
      await s.narrate('Lu Zhishen asked for hot water and bathed, and put on the new robe the emperor had given him.');
      s.sfx('fire'); await s.emote('player', '...', 1.4);
      await s.say(null, '(He lights incense, writes a verse, and sits down in the meditation chair with his legs crossed.)');
      await s.say('luzhishen', '"All my life I did no good deeds; I only loved to kill and burn. Today my golden chains are broken; today my jade locks are undone. Ah! On the Qiantang River the tide\'s signal came — and today, at last, I know that I am I."');
      s.sfx('gong');
      await fall(s, ['luzhishen'], 'When Song Jiang came with the others to see him, Lu Zhishen was sitting in the meditation chair, and did not move. He had passed away.');
      s.night(false);
      await s.narrate('Wu Song, who had lost an arm, would not go to the capital. "I am a cripple now. Let me stay here as a monk, and watch over Brother Lin Chong." He lived at the Liuhe Temple until he was eighty.');
      s.flag('away:wusong');
      await fall(s, ['linchong'], 'Lin Chong, the Panther Head, had been struck down by a paralysing wind, and could not rise from his bed. Wu Song nursed him at the temple; half a year later he died.');
      await fall(s, ['yangzhi', 'zhangheng', 'muhong', 'kongming', 'zhugui', 'baisheng', 'zhufu'], 'Word came from Dantu: Yang Zhi had died of his sickness and been buried there. In Hangzhou the plague had taken Zhang Heng, Mu Hong, Kong Ming, Zhu Gui and Bai Sheng — and Zhu Fu, who had stayed to nurse them. Only Yang Lin and Mu Chun recovered.');
      await fall(s, ['yangxiong', 'shiqian'], 'On the road north, Yang Xiong died of an abscess on his back, and Shi Qian of a cramping sickness of the bowels.');
      s.spawn('yq', 'yanqing', 17, 13, 'up'); s.spawn('lu', 'lujunyi', 16, 12, 'down');
      await s.say('yanqing', 'Master, I am leaving. Come with me. Let us hide somewhere far away and live out our lives.');
      await s.say('lujunyi', 'Little Yi, we have won. We are going to the capital to be honoured. Why would I hide?');
      await s.say('yanqing:sad', 'Master, you are wrong. Where I am going, there is a good ending. I only fear that where you are going, there is none.');
      s.despawn('yq', { leave: true }); s.despawn('lu');
      s.flag('away:yanqing');
      await s.narrate('That night Yan Qing left with a bundle on his back, and no one ever knew where he went. At Suzhou, Li Jun pretended to be stricken with palsy and stayed behind with Tong Wei and Tong Meng. When the army had gone, the three of them sailed out to sea from Taicang. Years later, it was said, Li Jun became the king of a country across the ocean.');
      ['lijun', 'tongwei', 'tongmeng'].forEach(function (id) { s.flag('away:' + id); });
      await s.narrate('Of the hundred and eight who had come down from Liangshan, twenty-seven came back to the capital to see the emperor.');
      s.flag('ch23_done');
      await s.endChapter();
      if (WM.data.chapters[24].begin) await WM.data.chapters[24].begin(s);
    } }
  ]);
})();
