// Chapter 18 — "Dongping and Dongchang" (novel chapters 68–70).
// The fire-carts at Zengtou; Yu Baosi turns; Shi Wengong taken by Lu Junyi and Yan Qing; the lots for Dongping and
// Dongchang; Shi Jin and Li Ruilan; Dong Ping the Double Spear; Zhang Qing's stones; the last of the 108.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('liruilan', 'Li Ruilan', { skin: '#f6e2cc', hairStyle: 'woman', body: '#c86a9a', trim: '#f0e0c0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#ffb0c0', lips: '#d04050' }, { face: true });
  WM.npc('chengprefect', 'Prefect Cheng', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', body: '#3a2a5a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('zengnong', 'Zeng Nong', { skin: '#e0a880', hair: '#c8c8c0', hairStyle: 'scarf', band: '#2a1a1a', beard: 'long', beardColor: '#d8d8d0', body: '#5a2a2a', trim: '#d8b36a', face: 'square', eyes: 'narrow' }, { face: true });

  var hum = WM.hum, C = WM.data.chars;
  WM.enemy('zt_guard', 'Zeng Family Guard', 30, hum(WM.enemyLooks.soldier), { range: 'M', exp: 170, drops: [['medicine', 0.15]] });
  WM.enemy('zhangqing_foe', 'Zhang Qing', 32, hum(C.zhangqing.look), { hp: 2.8, spd: 1.3, exp: 600, gold: 300, boss: true, range: 'L', fx: 'blunt',
    skills: [{ name: 'Featherless Arrow', chance: 0.45, type: 'phys', power: 1.3, fx: 'blunt', sfx: 'hit' }, { name: 'Hail of Stones', chance: 0.2, type: 'phys', power: 0.8, target: 'all', fx: 'blunt', sfx: 'hit' }] });
  WM.enemy('gongwang_foe', 'Gong Wang', 30, hum(C.gongwang.look), { hp: 1.6, exp: 300, range: 'L', fx: 'arrow' });
  WM.enemy('dingdesun_foe', 'Ding Desun', 30, hum(C.dingdesun.look), { hp: 1.6, exp: 300, range: 'L', fx: 'arrow' });
  var T = WM.data.troops;
  T.ch18_zeng = { enemies: ['zt_guard', 'zt_guard', 'zt_guard'], bg: 'night', noRun: true };
  T.ch18_stones = { enemies: ['gongwang_foe', 'zhangqing_foe', 'dingdesun_foe'], bg: 'field', boss: true };

  WM.data.duels.lu_shiwengong = {
    hero: 'lujunyi', foe: 'shiwengong', bg: 'forest', heroHp: 860, heroAtk: 62, foeHp: 680, foeAtk: 54,
    intro: [['foe:angry', 'Out of my way!'], ['hero', 'Shi Wengong. You shot Chao Gai, lord of Liangshan. You will not leave this wood.']],
    lines: { attack: ['Hah!', 'Halberd!', 'There!'], wild: ['Out of my way!', 'Die!', 'Fall!'], defend: ['Hmph.', 'Come on.', 'Steady...'] },
    win: [[null, 'Lu Junyi\'s blade took Shi Wengong in the leg, and he went down from the Jade Lion. Yan Qing was on him before he could rise.']],
    lose: [[null, 'Shi Wengong broke past — but Yan Qing\'s crossbow bolt took the Jade Lion\'s rider in the thigh, and Lu Junyi dragged him down.']]
  };
  WM.data.duels.xuning_dongping = {
    hero: 'xuning', foe: 'dongping', bg: 'field', heroHp: 680, heroAtk: 54, foeHp: 680, foeAtk: 56, drawAfter: 4,
    intro: [['foe', 'Dong Ping of Dongping. My two spears are known from the Hebei plains to the Huai River.'], ['hero', 'Xu Ning. Let\'s see them.']],
    lines: { attack: ['Hah!', 'Double spear!', 'There!'], wild: ['Two spears, one heart!', 'Fall!', 'Down!'], defend: ['Hmph.', 'Come on.', 'Steady...'] },
    draw: [[null, 'Fifty bouts. Then Song Jiang\'s gongs called Xu Ning back, and Dong Ping, sure he had won, came riding after.']]
  };

  WM.data.wars.ch18_zengtou = {
    name: 'The Fire-Carts of Zengtou', goal: 'rout', turns: 12, music: 'war',
    map: [
      '..TT....#.....',
      '.......:#..H..',
      '..:::::.G.....',
      '::....:.G..H..',
      '..:::::.G.....',
      '.......:#..H..',
      '..TT....#.....'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'gongsunsheng', support: ['fanrui'], type: 'mage', x: 2, y: 3 },
      { leader: 'lujunyi', support: ['yanqing'], type: 'cav', x: 3, y: 2 },
      { leader: 'huarong', support: ['lufang', 'guosheng'], type: 'arch', x: 2, y: 1 },
      { leader: 'zhutong', support: ['leiheng'], type: 'inf', x: 3, y: 4 },
      { leader: 'xiezhen', support: ['xiebao'], type: 'inf', x: 2, y: 5 }
    ],
    enemy: [
      { name: 'Shi Wengong', portrait: 'shiwengong', type: 'cav', atk: 126, def: 104, x: 11, y: 3 },
      { name: 'Zeng Tu', portrait: 'zengtu', type: 'cav', atk: 108, def: 92, x: 9, y: 2 },
      { name: 'Zeng Suo', type: 'cav', atk: 102, def: 90, x: 9, y: 4 },
      { name: 'Zeng Mi', type: 'inf', atk: 100, def: 96, x: 11, y: 1 },
      { name: 'Su Ding', type: 'cav', atk: 104, def: 92, x: 11, y: 5 },
      { name: 'Zengtou Archers', type: 'arch', atk: 94, def: 70, x: 13, y: 3 }
    ],
    intro: [['wuyong', 'They have dug pits before every gate. Shi Qian has marked them all. Tonight we push in carts of reeds instead of men.'], [null, 'Victory: rout every enemy unit.']],
    events: [{ turn: 2, run: async function (s, api) {
      await s.say(null, 'A hundred carts of reeds and brushwood rolled down on the south gate and were lit. Gongsun Sheng called up a wind, and the fire leapt the walls.');
      s.sfx('fire'); s.sfx('wind'); api.weaken('enemy', 0.75);
    } }],
    win: [['songjiang', 'Zengtou is burning. Find Shi Wengong!']], lose: [['songjiang:sad', 'Fall back!']]
  };
  WM.data.wars.ch18_dongchang = {
    name: 'The Grain Boats of Dongchang', goal: 'commander', turns: 10, music: 'war',
    map: [
      '~~~~~~~.......',
      '~rr~~~~.......',
      '~~~~~~..::....',
      '~~~~~...::...#',
      'rr~~~~..::...G',
      '~~~~~~.......#',
      '~~~~~~~.......'
    ],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 7, y: 0, commander: true },
      { leader: 'gongsunsheng', type: 'mage', x: 8, y: 1 },
      { leader: 'linchong', support: ['huarong'], type: 'cav', x: 9, y: 6 },
      { leader: 'ruanxiaoer', support: ['ruanxiaowu', 'ruanxiaoqi'], type: 'naval', x: 2, y: 3 },
      { leader: 'zhangshun', support: ['zhangheng'], type: 'naval', x: 3, y: 5 },
      { leader: 'lujunyi', support: ['yanqing'], type: 'cav', x: 8, y: 5 }
    ],
    enemy: [
      { name: 'Zhang Qing', portrait: 'zhangqing', type: 'cav', atk: 128, def: 100, x: 12, y: 3, commander: true },
      { name: 'Dongchang Cavalry', type: 'cav', atk: 102, def: 92, x: 12, y: 1 },
      { name: 'Dongchang Cavalry', type: 'cav', atk: 102, def: 92, x: 12, y: 5 },
      { name: 'Dongchang Foot', type: 'inf', atk: 96, def: 98, x: 13, y: 2 }
    ],
    intro: [['wuyong', 'Zhang Qing cannot resist plunder. Let the grain boats go down the river where he can see them.'], [null, 'Victory: rout Zhang Qing.']],
    events: [{ turn: 2, run: async function (s, api) {
      await s.say(null, 'Zhang Qing came out after the grain boats — and Gongsun Sheng called up a fog from the river. Lin Chong\'s horsemen drove Zhang Qing\'s men back against the water, where the Ruan brothers were waiting.');
      s.sfx('wind'); api.weaken('enemy', 0.7);
    } }],
    win: [['ruanxiaoqi', 'Got him! Out of the water with you, Featherless Arrow!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[18].begin = async function (s) {
    await s.chapter(18);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'linchong', 'guansheng', 'huarong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    ['songjiang', 'lujunyi', 'wuyong', 'linchong', 'guansheng', 'huarong', 'yanqing'].forEach(function (id) { s.level(id, 32); });
    WM.unlock('zengtou');
    await s.narrate('Shi Qian went into Zengtou first, and came back with a map of every pit the Zeng family had dug before their gates.');
    await s.warp('zengtou', 26, 35, 'up');
  };
  WM.data.chapters[18].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 17; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall');
    var later = ['yubaosi', 'dongping', 'zhangqing', 'gongwang', 'dingdesun', 'huangfuduan'];
    WM.data.charOrder.forEach(function (id) { if (later.indexOf(id) < 0) S.recruit(id, 32); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'zhujia', 'gaotang', 'qingzhou', 'huazhou', 'daming', 'lingzhou');
    await WM.data.chapters[18].begin(s);
  };

  WM.defEvents('zengtou', [
    { id: 'ch18_attack', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 18; }, run: async function (s) {
      s.music('tense');
      s.spawn('sq', 'shiqian', 26, 29, 'down');
      await s.moveTo('sq', 26, 33, { run: true });
      await s.say('shiqian', 'Brother! The Zengs have five camps round the town, and before the north and the south camp they\'ve dug pits — dozens of them, under a skin of earth and straw. I put a little flag beside every one.');
      await s.say('wuyong:smile', 'Then the pits are theirs, not ours. Brother, send the horse out to the north camp by the flags, and let them run when the Zengs come after them. The Zeng cavalry will find their own pits.');
      await s.say('songjiang', 'For Brother Chao Gai. Sound the drums!');
      s.despawn('sq');
      s.music('war'); s.sfx('drum'); await s.wait(0.3); s.sfx('drum');
      await s.war('ch18_zengtou');
      await s.narrate('Hua Rong\'s arrow took Zeng Tu in the arm, and Lü Fang and Guo Sheng finished him with their halberds. Zeng Nong, the old master, sent to ask for terms: he would give back the horses, and pay for the war.');
      await s.say('wuyong', 'Let us talk. Send hostages both ways. And their Yu Baosi, the Dangerous Road God, who took our horses — I want to speak with him.');
      await s.narrate('Shi Qian, Li Kui, Fan Rui, Xiang Chong and Li Gun went into Zengtou as hostages. Yu Baosi came out to the Liangshan camp — and Song Jiang talked with him far into the night.');
      await s.join('yubaosi');
      await s.narrate('Yu Baosi went back and told the Zeng family that Song Jiang meant only to get the Jade Lion back and then fall on them, and that his camp was carelessly kept. That night Shi Wengong and the Zeng brothers came to raid it — and found it empty. The hostages broke loose inside the town; Shi Qian rang the temple bell.');
      s.night(true);
      s.party(['lujunyi', 'yanqing']); s.setLeader('lujunyi'); s.flag('protagonist', 'lujunyi');
      await s.battle('ch18_zeng', { bg: 'night' });
      await s.narrate('Xie Zhen forked Zeng Suo; Zhu Tong cut down Zeng Mi; Zeng Kui was trampled under the horses; Yang Zhi and Shi Jin shot Su Ding at the north gate. The old master, Zeng Nong, hanged himself. And Shi Wengong broke out on the Jade Lion and fled west into the woods — where Lu Junyi and Yan Qing were waiting.');
      s.spawn('sw', 'shiwengong', 8, 22, 'right');
      await s.duel('lu_shiwengong', { hero: 'lujunyi', canLose: true });
      s.despawn('sw', { leave: true });
      s.night(false);
      s.flag('ch18_shi');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch18_offering', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch18_shi') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.music('sad');
      s.spawn('sj', 'songjiang', 15, 5, 'down'); s.spawn('lu', 'lujunyi', 15, 7, 'up');
      await s.narrate('Before Chao Gai\'s spirit tablet in the Hall of Loyalty, Shi Wengong was put to death, and his heart was offered to the spirit of the Heavenly King. All the chiefs wept.');
      await s.say('songjiang', 'Brother Chao Gai said: whoever takes the man who shot me shall be lord of Liangshan. Brother Lu Junyi took him. Brother, take the seat.');
      await s.say('lujunyi', 'I could not. I am new to the mountain, and you are its heart.');
      await s.say('likui:angry', 'If anybody but Brother Song Jiang sits there, I\'ll —!');
      await s.say('songjiang', '...Then let Heaven decide. East of Liangshan are two cities with grain, Dongping and Dongchang. Brother Lu and I will draw lots, and each attack one. Whoever takes his city first becomes lord.');
      s.despawn('sj'); s.despawn('lu');
      s.flag('ch18_lots');
      await s.narrate('Song Jiang drew Dongping; Lu Junyi drew Dongchang.');
      s.party(['songjiang', 'shijin', 'wuyong', 'xuning', 'husanniang', 'gudasao']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      WM.unlock('dongping', 'dongchang');
      await s.warp('dongping', 2, 17, 'right');
    } }
  ]);

  // ---------------- Dongping ----------------
  WM.defEvents('dongping', [
    { id: 'ch18_shijin', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch18_lots'); }, run: async function (s) {
      s.spawn('sj2', 'shijin', 4, 17, 'left');
      await s.say('shijin', 'Brother, I used to know a singing-girl in Dongping, Li Ruilan. Let me go in and stay at her house. On the night you attack, I\'ll set a fire inside the walls as a signal.');
      await s.say('wuyong', '...Be careful. Those houses love silver more than they love any man.');
      s.despawn('sj2');
      await s.narrate('Li Ruilan welcomed Shi Jin with smiles. Her mother went straight to the prefecture. That night the constables took Shi Jin from her bed. Gu Dasao, dressed as a beggar woman, got into the prison with a bowl of food and whispered: "The last night of the month."');
      s.flag('away:shijin');
      await s.narrate('Song Jiang brought the army up to the walls of Dongping. The gate opened, and out rode the city\'s commander with a spear in each hand and a little banner on his back: "A Hero of Hedong; the Double Spear General."');
      s.spawn('dp0', 'dongping', 10, 17, 'left');
      await s.say('dongping', 'Song Jiang! You marsh-rats have the gall to come to my city? Which of you will meet my two spears?');
      await s.say('xuning', 'Brother, let me. I want to see these two spears for myself.');
      s.despawn('dp0', { leave: true });   // back to his lines, to meet Xu Ning in the field
      await s.duel('xuning_dongping', { hero: 'xuning', canLose: true });
      await s.narrate('Dong Ping, the Double Spear, followed Xu Ning\'s retreat at full gallop into a village west of the city — and in the narrow lane, ropes jerked up out of the dust in front of and behind his horse. Wang Ying, Hu Sanniang, Zhang Qing the Gardener and Sun Erniang were on him before he could rise.');
      s.spawn('dp', 'dongping', 10, 17, 'left');
      await s.say('songjiang', 'Untie him! Give the General back his armour and his horse. General, we are men driven to the marsh by evil officials. We wait for the emperor\'s pardon. Will you join us?');
      await s.say('dongping', '...I have been a fool, fighting for a prefect who would not even give me his daughter. I will open Dongping for you tonight.');
      s.despawn('dp', { leave: true });
      await s.narrate('Dong Ping called up to the gate, and it opened. He went straight to Prefect Cheng\'s hall, killed him and his household, and took the prefect\'s daughter for himself. Shi Jin was freed, and Li Ruilan\'s house was paid back for its treachery. Song Jiang emptied the granary for Liangshan and posted notices to calm the people.');
      s.unflag('away:shijin');
      await s.join('dongping');
      s.flag('ch18_dongping');
      await s.narrate('Song Jiang had taken his city first. By the lots, the seat of Liangshan stayed his — though he said nothing of it, and only asked after Lu Junyi.');
      await s.narrate('Then Bai Sheng came running: Lu Junyi had been beaten twice at Dongchang. Its general, Zhang Qing, the Featherless Arrow, never missed with a stone.');
      s.party(['songjiang', 'lujunyi', 'dongping', 'guansheng', 'luzhishen', 'wusong']); s.setLeader('songjiang');
      s.level('luzhishen', 34); s.level('wusong', 34);
      await s.warp('dongchang', 2, 12, 'right');
    } }
  ]);
  WM.defEvents('dongchang', [
    { id: 'ch18_stones', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch18_dongping'); }, run: async function (s) {
      s.spawn('zq', 'zhangqing', 14, 12, 'left');
      await s.narrate('Zhang Qing rode out from Dongchang with a bag of round stones at his saddle. Xu Ning went out against him and was struck between the eyes. Then Han Tao. Then Peng Qi. Then Xuan Zan, Liu Tang, Lei Heng — one after another they went down from their saddles. Guan Sheng\'s blade was struck aside; Dong Ping\'s helmet was knocked askew.');
      s.despawn('zq', { leave: true });
      await s.battle('ch18_stones', { bg: 'field', canLose: true, rounds: 5 });
      await s.say('songjiang', 'I swear it: if I do not take this man, I will not take the army home!');
      await s.narrate('Yan Qing shot Ding Desun\'s horse from under him, and Lü Fang and Guo Sheng took him. Lin Chong and Hua Rong took Gong Wang. But Zhang Qing captured Liu Tang and went back into the city.');
      await s.war('ch18_dongchang');
      await s.narrate('They brought Zhang Qing up out of the river dripping. Lu Zhishen, whose head still ached from a stone, rushed at him with his staff. Song Jiang stood between them.');
      s.spawn('zq', 'zhangqing', 14, 12, 'left');
      await s.say('songjiang', 'Brothers, in battle every man serves his master. Whoever bears a grudge for what was done today, Heaven will strike him. General Zhang, will you stay with us?');
      await s.say('zhangqing', '...I will. And let me bring you one more: there is a horse-doctor in Dongchang, Huangfu Duan, the Purple-Bearded Earl. There is no sickness of a horse he cannot cure.');
      s.despawn('zq', { leave: true });
      await s.joinMany(['zhangqing', 'gongwang', 'dingdesun', 'huangfuduan']);
      await s.narrate('So Dongchang fell, and Liu Tang was brought out of its prison unharmed. Its prefect, who was an honest man, was spared, and the grain was shared out among the people. When the army had returned to the mountain, Song Jiang counted the chiefs in the Hall of Loyalty. There were one hundred and eight.');
      s.flag('ch18_done');
      await s.endChapter();
      if (WM.data.chapters[19].begin) await WM.data.chapters[19].begin(s);
    } }
  ]);
})();
