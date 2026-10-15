// Chapter 22 — "Hedong and Huaixi" (novel chapters 91–110). Condensed: twenty chapters in one.
// Played: the war in Hedong and Qiao Daoqing's illusory sea; Gongsun Sheng against Qiao Daoqing; Zhang Qing and
// Qiongying; the fall of Tian Hu; the war in Huaixi; Li Jun the "fisherman" takes Wang Qing; Yan Qing's wild geese;
// Gongsun Sheng goes home. Narrated: most of the sieges of Hedong and Huaixi, Qiongying's revenge, Wang Qing's
// execution, the court's rewards, and the chiefs kept in the capital.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('qiaodaoqing', 'Qiao Daoqing', { skin: '#e8c0a0', hairStyle: 'daoist', beard: 'long', beardColor: '#2a2a2a', body: '#3a2a4a', trim: '#c8302a', weapon: 'sword', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('qiongying', 'Qiongying', { skin: '#f6e2cc', hairStyle: 'woman', body: '#c84a4a', trim: '#e8c860', dress: true, build: 'slim', face: 'oval', eyes: 'sharp', pin: '#e8e8ff', weapon: 'stones' }, { face: true });
  WM.npc('tianhu', 'Tian Hu', { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#d8b040', tassel: '#c8302a', beard: 'full', body: '#6a1a1a', trim: '#e8c860', build: 'big', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('wangqing', 'Wang Qing', { skin: '#f0c49a', hairStyle: 'helmet', helmColor: '#d8b040', tassel: '#2a2a8a', beard: 'mustache', body: '#2a2a6a', trim: '#e8c860', face: 'narrow', eyes: 'sharp' }, { face: true });

  var hum = WM.hum;
  WM.enemy('qiao_foe', 'Qiao Daoqing', 39, hum(WM.data.npcs.qiaodaoqing.look), { hp: 2.6, exp: 800, gold: 500, boss: true, range: 'L', fx: 'dark',
    skills: [{ name: 'Illusory Sea', chance: 0.35, type: 'magic', power: 48, target: 'all', fx: 'water', sfx: 'water' }, { name: 'Clay Dragon', chance: 0.25, type: 'magic', power: 60, fx: 'earth', sfx: 'earth' }] });
  WM.enemy('paper_soldier', 'Paper Soldier', 36, hum({ skin: '#f0f0e8', hairStyle: 'helmet', helmColor: '#e8e8e0', tassel: '#c8302a', body: '#f0ece0', trim: '#c8302a', weapon: 'spear' }), { hp: 0.6, exp: 120, gold: 0, weak: 'fire' });
  var T = WM.data.troops;
  T.ch22_qiao = { enemies: ['paper_soldier', 'qiao_foe', 'paper_soldier'], bg: 'field', boss: true };

  WM.data.duels.zhangqing_qiongying = {
    hero: 'zhangqing', foe: 'qiongying', bg: 'field', heroHp: 640, heroAtk: 52, foeHp: 560, foeAtk: 50,
    intro: [['foe', 'They say you throw stones, Featherless Arrow. So do I.'], ['hero', '...You are the general from my dream.']],
    lines: { attack: ['Hah!', 'Stone!', 'There!'], wild: ['Jade Arrowhead!', 'Catch this!', 'Fall!'], defend: ['Hm.', 'Caught it.', 'Again?'] },
    win: [[null, 'Stone for stone, they threw — and Zhang Qing caught every one of hers in his hand. Qiongying lowered her arm and looked at him for a long time.']],
    lose: [[null, 'Her stones came faster than any he had ever seen — and yet Zhang Qing caught them, one after another. Qiongying lowered her arm and looked at him for a long time.']]
  };

  WM.data.wars.ch22_hedong = {
    name: 'The Illusory Sea', goal: { survive: true }, turns: 5, music: 'war',
    map: ['..............', '..mm.....mm...', '..............', '..............', '..............', '..mm.....mm...', '..............'],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'linchong', support: ['husanniang'], type: 'cav', x: 3, y: 2 },
      { leader: 'luzhishen', support: ['wusong'], type: 'inf', x: 3, y: 4 },
      { leader: 'likui', support: ['liutang'], type: 'inf', x: 4, y: 3 },
      { leader: 'fanrui', type: 'mage', x: 2, y: 3 },
      { leader: 'huarong', type: 'arch', x: 1, y: 1 }
    ],
    enemy: [
      { name: 'Qiao Daoqing', portrait: 'qiaodaoqing', type: 'mage', atk: 136, def: 110, x: 12, y: 3, commander: true },
      { name: 'Hedong Cavalry', type: 'cav', atk: 120, def: 110, x: 10, y: 1 },
      { name: 'Hedong Cavalry', type: 'cav', atk: 120, def: 110, x: 10, y: 5 },
      { name: 'Hedong Foot', type: 'inf', atk: 114, def: 118, x: 11, y: 2 },
      { name: 'Hedong Foot', type: 'inf', atk: 114, def: 118, x: 11, y: 4 }
    ],
    intro: [['wuyong', 'Tian Hu\'s sorcerer is Qiao Daoqing, the Demon Lord of Illusion. Hold together, whatever you see.'], [null, 'Hold out for 5 turns.']],
    events: [{ turn: 2, run: async function (s, api) {
      await s.say(null, 'Qiao Daoqing raised yellow sand and black fog — and then the plain was gone, and a sea lay where it had been, with the Liangshan army standing in the middle of it.');
      s.sfx('water'); api.weaken('player', 0.8);
    } }],
    win: [['songjiang:sad', 'The water drained away, as if the earth had drunk it. ...We need Gongsun Sheng.']], lose: [['songjiang:sad', 'Back! Back to the camp!']]
  };
  WM.data.wars.ch22_tianhu = {
    name: 'Xiangyuan', goal: 'commander', turns: 10, music: 'war',
    map: ['......T...mm..', '..T..........#', '.............G', '.......mm....G', '.............G', '..T..........#', '......T...mm..'],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'zhangqing', support: ['dingdesun', 'gongwang'], type: 'cav', x: 3, y: 2 },
      { leader: 'lujunyi', support: ['yanqing'], type: 'cav', x: 3, y: 4 },
      { leader: 'gongsunsheng', support: ['fanrui'], type: 'mage', x: 2, y: 3 },
      { leader: 'guansheng', type: 'cav', x: 1, y: 1 },
      { leader: 'huyanzhuo', type: 'cav', x: 1, y: 5 }
    ],
    enemy: [
      { name: 'Tian Hu', portrait: 'tianhu', type: 'cav', atk: 130, def: 116, x: 12, y: 3, commander: true },
      { name: 'Tian Bao', type: 'cav', atk: 120, def: 110, x: 10, y: 2 },
      { name: 'Tian Biao', type: 'cav', atk: 120, def: 110, x: 10, y: 4 },
      { name: 'Weisheng Guard', type: 'inf', atk: 114, def: 120, x: 12, y: 1 },
      { name: 'Weisheng Guard', type: 'inf', atk: 114, def: 120, x: 12, y: 5 }
    ],
    intro: [['songjiang', 'Tian Hu has run to Xiangyuan. Let him not escape again.'], [null, 'Victory: rout Tian Hu.']],
    events: [{ turn: 3, run: async function (s, api) {
      await s.say(null, 'At Weisheng, Qiongying rode up to the gate with men dressed as Tian Hu\'s own guard, and the gate opened to them. Tian Hu\'s capital was lost behind him.');
      api.weaken('enemy', 0.75);
    } }],
    win: [['zhangqing', 'His horse threw him — Ye Qing and I have him!']], lose: [['songjiang:sad', 'Fall back!']]
  };
  WM.data.wars.ch22_wangqing = {
    name: 'Nanfeng', goal: 'commander', turns: 10, music: 'war',
    map: ['~~~...........', '~~....mm......', '~.............', '~.......:::...', '~.............', '~~....mm......', '~~~...........'],
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 2, y: 3, commander: true },
      { leader: 'linchong', type: 'cav', x: 4, y: 2 },
      { leader: 'gongsunsheng', type: 'mage', x: 3, y: 3 },
      { leader: 'zhangqing', type: 'cav', x: 4, y: 4 },
      { leader: 'lijun', support: ['tongwei', 'tongmeng'], type: 'naval', x: 0, y: 3 },
      { leader: 'qinming', type: 'cav', x: 3, y: 1 }
    ],
    enemy: [
      { name: 'Wang Qing', portrait: 'wangqing', type: 'cav', atk: 128, def: 114, x: 12, y: 3, commander: true },
      { name: 'Liu Yuan', type: 'cav', atk: 120, def: 108, x: 10, y: 2 },
      { name: 'Li Zhi, Master of the Golden Sword', type: 'mage', atk: 126, def: 96, x: 11, y: 4 },
      { name: 'Duan Sanniang', type: 'cav', atk: 116, def: 104, x: 10, y: 5 },
      { name: 'Huaixi Foot', type: 'inf', atk: 112, def: 118, x: 12, y: 1 }
    ],
    intro: [['songjiang', 'Wang Qing, the last of the rebels within. When he falls, the Mysterious Lady\'s words are fulfilled — foreign foes and rebels within.'], [null, 'Victory: rout Wang Qing.']],
    events: [
      { turn: 1, run: async function (s, api) { await s.say(null, 'Lin Chong met Liu Yuan in single combat and killed him.'); api.rout('Liu Yuan'); } },
      { turn: 2, run: async function (s, api) {
        await s.say('gongsunsheng', 'Fall!');
        await s.say(null, 'Li Zhi\'s golden sword flew through the air at Gongsun Sheng — and at his word it dropped out of the sky like a stone. Qiongying\'s stone struck Duan Sanniang in the face, and she was taken.');
        api.rout('Li Zhi, Master of the Golden Sword'); api.rout('Duan Sanniang');
      } }
    ],
    win: [['songjiang', 'Wang Qing has fled towards the river!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[22].begin = async function (s) {
    await s.chapter(22);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'linchong', 'zhangqing']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    ['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'linchong', 'zhangqing', 'fanrui', 'luzhishen', 'likui'].forEach(function (id) { s.level(id, 38); });
    await s.narrate('No titles came from the court. Cai Jing and Tong Guan let the matter sleep. Then word came from Hedong: Tian Hu, a hunter of Weisheng, had made himself king of five prefectures and fifty-six counties. Su Yuanjing spoke again, and Song Jiang was sent west.');
    await WM.data.warCouncil(s, {
      beside: 'wuyong', generals: ['lujunyi', 'linchong', 'zhangqing', 'luzhishen', 'likui', 'fanrui'],
      scout: { lines: ['Tian Hu\'s men hold the passes of Gaiping, brother. And at Zhaode a Daoist rides with them — Qiao Daoqing, the Phantom Magician. They say he can fill a valley with water out of a clear sky.'] },
      lines: [['wuyong', 'Then we fight his soldiers by daylight, and leave his magic to Brother Gongsun Sheng.'],
        ['likui:angry', 'Magic! Give me the vanguard and I\'ll chop his magic in half!'],
        ['songjiang', 'No one goes ahead against orders, Iron Ox. Not one man.']]
    });
    await s.war('ch22_hedong', { canLose: true });
    await s.narrate('Li Kui charged ahead against orders and was caught with five hundred men; then Lu Zhishen, Wu Song and Liu Tang were lost in the sea of illusion. A figure robed in yellow — the spirit of the Earth, Wu Yong said, for earth conquers water — drained the sea away. And then Gongsun Sheng rode out with his pine-patterned sword.');
    await s.say('gongsunsheng', 'His is the magic of the left-hand way, brother — borrowed, and false. Let me meet it.');
    await s.battle('ch22_qiao', { bg: 'field' });
    await s.narrate('Qiao Daoqing\'s divine soldiers fell down as paper. His clay dragons were smashed by a great roc that rose from Gongsun Sheng\'s whisk. He fled to Baigu Ridge, and there, surrounded, he gave himself up. Li Kui, Lu Zhishen, Wu Song and Liu Tang came back alive.');
    await s.narrate('At the next city, a girl of sixteen led the enemy: Qiongying, whose stones struck down Wang Ying, Sun Xin, Lin Chong and Li Kui one after another.');
    // that night a man comes secretly to the camp: her steward
    s.night(true);
    s.spawn('yeq', 'servant', 16, 21, 'up');
    await s.moveTo('yeq', 17, 12, { yFirst: true });
    s.face('yeq', 'up');
    await s.say({ name: 'Ye Qing' }, 'General, I am Ye Qing, steward of the house of Qiu. The girl who throws the stones is no daughter of the rebel Wu Li. Tian Hu\'s men killed her father, Qiu Shen, and took her mother — who threw herself from a cliff rather than submit. She has waited years to be avenged.');
    await s.say({ name: 'Ye Qing' }, 'And she has sworn an oath. A young general in green came to her in a dream, throwing stones as she does — and she will marry no man but one who can throw as she throws.');
    await s.say('zhangqing:shock', '...I have dreamed of her.');
    await s.say('wuyong:smile', 'Then Heaven has drawn up our plan for us. Steward, take An Daoquan into the city as a doctor for your lady\'s household — and Brother Zhang Qing with him, as his "brother."');
    s.despawn('yeq', { to: [16, 22] });
    s.night(false);
    await s.narrate('An Daoquan went into the city disguised as a doctor, with Zhang Qing as his "brother." Before the gates, Qiongying rode out.');
    s.level('zhangqing', 40);
    await s.duel('zhangqing_qiongying', { hero: 'zhangqing', canLose: true });
    await s.narrate('They were married. Together they did away with Wu Li and opened the city. At Weisheng Qiongying took her revenge on Tian Hu\'s brother Tian Ding with her own blade, and went to find her mother\'s bones on the mountain.');
    await s.say('songjiang', 'Weisheng is the last of Tian Hu\'s cities, and Tian Hu is in it with everything he has left. Brothers — finish it.');
    s.sfx('drum'); await s.wait(0.3); s.sfx('drum');
    await s.war('ch22_tianhu');
    await s.narrate('Tian Hu, his brothers Tian Bao and Tian Biao, were caged to be sent to the capital. Hedong was won. And before the army could rest, the court sent it south-west against Wang Qing — a soldier from the capital who had fled a murder charge and made himself king of eight prefectures in Huaixi.');
    await WM.data.warCouncil(s, {
      beside: 'wuyong', generals: ['lujunyi', 'linchong', 'gongsunsheng', 'zhangqing', 'huarong', 'likui'],
      scout: { lines: ['Wang Qing\'s army is drawn up before Nanfeng, brother. His general Li Zhi is a sorcerer — they say his golden sword flies out of its sheath by itself and cuts down whoever he points at. And a woman rides with them, Duan Sanniang, who fights like ten men.'] },
      lines: [['gongsunsheng', 'A flying sword is a small magic. When it comes, I will speak to it.'],
        ['songjiang', 'This is the last of the rebels within. When Wang Qing falls, the Lady\'s words are fulfilled.']]
    });
    await s.war('ch22_wangqing');
    s.flag('ch22_ferry');
    await s.warp('armycamp', 30, 13, 'right');
  };
  WM.data.chapters[22].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 21; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall'); s.flag('grand_assembly');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 38); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'daming');
    await WM.data.chapters[22].begin(s);
  };

  WM.defEvents('armycamp', [
    { id: 'ch22_fisherman', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch22_ferry'); }, run: async function (s) {
      s.spawn('wq', 'wangqing', 31, 12, 'right'); s.spawn('lj', 'lijun', 33, 13, 'left'); s.boat('lj');   // the 'fisherman' in his boat
      await s.say('wangqing', 'Fisherman! A boat! I still have three cities on the far side — take me over and you\'ll be rich!');
      await s.say('lijun:smile', 'Splendid — more wine money! Get in, get in.');
      await s.narrate('On the bank of the Qing River, the "fisherman" was Li Jun, and the man at the oar was Tong Wei. Halfway across, the nets came up — over Wang Qing.');
      s.despawn('wq', { leave: true }); s.despawn('lj');
      await s.say('songjiang', 'Brother Li Jun, that is no small merit.');
      s.music('sad');
      await s.narrate('The army turned north for the capital. It was autumn. At the Qiulin ferry, a long skein of wild geese went over, crying, and Yan Qing — who had never missed — drew his bow and brought down one after another.');
      s.spawn('yq', 'yanqing', 29, 14, 'right');
      await s.say('songjiang:sad', 'Little Yi, stop. The wild goose is a bird of the five virtues: they keep their order in the sky, they mourn their mates, they guard each other in the night. They are like us — brothers. And you have shot down a whole row of them... like our brothers, falling one by one.');
      await s.say('yanqing:sad', '...Forgive me, brother. I won\'t shoot them again.');
      s.despawn('yq');
      await s.narrate('That night Song Jiang wrote a lament for the broken skein of geese, and could not sleep.');
      s.flag('ch22_geese');
      await s.warp('kaifeng', 29, 40, 'up');
    } }
  ]);
  WM.defEvents('kaifeng', [
    { id: 'ch22_parting', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch22_geese'); }, run: async function (s) {
      s.spawn('gs', 'gongsunsheng', 29, 38, 'down');
      await s.say('gongsunsheng', 'Brother. My master told me long ago: "Meet You, and stop. Meet Bian, and return." We fought at Youzhou and stopped the Liao there; and now we have come back to Bianliang. He told me to see you home to the capital, and then go back to the mountain. My mother is old.');
      await s.say('songjiang:sad', 'I promised him I would let you go. ...We came together like a gathering of flowers, and now we fall apart like petals. Go, brother.');
      s.despawn('gs', { leave: true });
      s.flag('away:gongsunsheng'); S.removeFromParty('gongsunsheng');
      await s.narrate('Gongsun Sheng went back to Erxian Mountain, to his master and his mother. Tian Hu and Wang Qing were put to death in the market-place. Song Jiang was made an Imperial City Commissioner — no more — and Lu Junyi a minor officer. Wu Yong said nothing, but his face said everything.');
      await s.narrate('And the court began to keep the useful ones for itself. Cai Jing took Xiao Rang to write his letters. Prince Wang took Yue He for his singing. The emperor kept Jin Dajian to carve jade seals and Huangfu Duan to tend the imperial horses. They were not asked.');
      ['xiaorang', 'yuehe', 'jindajian', 'huangfuduan'].forEach(function (id) { s.flag('away:' + id); S.removeFromParty(id); });
      await s.narrate('Then an old man came from the south. Fang La, a lacquer-grower of Muzhou, had rebelled at Qingxi, and held eight prefectures and twenty-five counties. He had made himself emperor. The court made Song Jiang Pioneer of the southern campaign.');
      s.flag('ch22_done');
      await s.endChapter();
      if (WM.data.chapters[23].begin) await WM.data.chapters[23].begin(s);
    } }
  ]);
})();
