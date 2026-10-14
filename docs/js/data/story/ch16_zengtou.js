// Chapter 16 — "Zengtou" (novel chapter 60).
// Duan Jingzhu and the Night-Shining Jade Lion; the Zeng family's insult; Chao Gai leads the army himself; the broken
// banner; the monks of the Fahua Temple; Shi Wengong's arrow; Chao Gai's last words; the Hall of Loyalty.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('zengkui', 'Zeng Kui', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#5a5a62', tassel: '#2a2a2a', body: '#4a3a2a', trim: '#d8b36a', weapon: 'spear', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('zengtu', 'Zeng Tu', { skin: '#e8b890', hairStyle: 'helmet', helmColor: '#8a6a3a', tassel: '#c8302a', body: '#6a2a2a', trim: '#d8b36a', weapon: 'spear', face: 'square' }, { face: true });
  WM.npc('shiwengong', 'Shi Wengong', { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#3a3a42', tassel: '#e8e8e8', beard: 'short', body: '#2a2a3a', trim: '#c8b890', weapon: 'halberd', build: 'big', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('fahuamonk', 'Monk of the Fahua Temple', { skin: '#d8a070', hairStyle: 'bald', body: '#8a6a3a', trim: '#c8a860', face: 'round', eyes: 'narrow' }, { face: true });

  WM.enemy('zt_spear', 'Zengtou Spearman', 28, WM.hum(WM.enemyLooks.soldier), { range: 'M', exp: 150, drops: [['medicine', 0.15]] });
  WM.enemy('zt_archer', 'Zengtou Archer', 28, WM.hum(WM.enemyLooks.archer), { hp: 0.85, range: 'L', fx: 'arrow', exp: 150 });
  var T = WM.data.troops;
  T.ch16_ambush = { enemies: ['zt_spear', 'zt_archer', 'zt_spear', 'zt_archer'], bg: 'night', noRun: true };

  WM.data.duels.linchong_zengkui = {
    hero: 'linchong', foe: 'zengkui', bg: 'field', heroHp: 680, heroAtk: 54, foeHp: 640, foeAtk: 50, drawAfter: 4,
    intro: [['foe:angry', 'Liangshan horse-thieves! I am Zeng Kui, fourth of the five tigers of the Zeng!'], ['hero', 'And I am Lin Chong. The horse was ours first.']],
    lines: { attack: ['Hah!', 'Take this!', 'There!'], wild: ['Five Tigers of the Zeng!', 'Fall!', 'Down!'], defend: ['Hmph.', 'Come on.', 'Steady...'] },
    draw: [[null, 'Twenty bouts, and Zeng Kui wheeled his horse and fled back behind the walls of Zengtou.']]
  };

  WM.data.chapters[16].begin = async function (s) {
    await s.chapter(16);
    s.party(['songjiang']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('cg', 'chaogai', 15, 5, 'down'); s.spawn('dj', 'duanjingzhu', 16, 7, 'up');
    await s.fadeIn(0.6);
    await s.narrate('On the way home from Mangdang, a thin man with a yellow beard and reddish hair had stopped Song Jiang on the road and bowed to the ground. His name was Duan Jingzhu; people called him the Golden-Haired Dog. He was a horse thief.');
    await s.say('duanjingzhu', 'In the north I stole a horse from a prince of the Jin — a white horse, without a single hair of another colour, that can go a thousand li in a day. They call it the Night-Shining Jade Lion. I was bringing it to Liangshan, as my gift to you. But at Zengtou the Zeng family took it from me. When I said it was for Song Jiang of Liangshan, they cursed you to your face.');
    await s.say('duanjingzhu', 'They have five sons, the Five Tigers of the Zeng, and two instructors, Shi Wengong and Su Ding. And their children sing a song in the streets: "Shake the iron rings, the gods and ghosts all quake... Sweep Liangshan from the marsh, take Chao Gai to the capital, catch the Timely Rain alive, and the Star of Wisdom too..."');
    await s.say('chaogai:angry', 'They steal our horse, and sing songs about us? This time I will go myself.');
    await s.say('songjiang', 'Brother, you are the lord of the mountain. You must not go into danger for a horse. Let me go.');
    await s.say('chaogai', 'It\'s not that I want to take your merit, brother. But you have gone down the mountain again and again, and fought and suffered. This time it is my turn. Don\'t try to stop me.');
    s.despawn('dj');
    await s.narrate('Chao Gai chose twenty chiefs and five thousand men. As they set out from the hall, a sudden wind came down the mountain and snapped the shaft of his new banner in two.');
    await s.say('wuyong', 'Brother, this is an ill omen. Wait for another day.');
    await s.say('chaogai', 'The wind blows when it blows. What has it to do with me? We go.');
    s.despawn('cg');
    s.addParty('chaogai'); s.level('chaogai', 29);
    s.party(['chaogai', 'linchong', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng']); s.setLeader('chaogai'); s.flag('protagonist', 'chaogai');
    ['linchong', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng'].forEach(function (id) { s.level(id, 28); });
    WM.unlock('zengtou');
    s.flag('ch16_march');
    await s.say(null, '(Zengtou lies to the north-east.)');
  };
  WM.data.chapters[16].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 15; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    WM.data.charOrder.slice(0).forEach(function (id) {
      if (['duanjingzhu', 'suochao', 'guansheng', 'xuanzan', 'haosiwen', 'andaoquan', 'wangdingliu', 'lujunyi', 'yanqing', 'caifu', 'caiqing', 'shantinggui', 'weidingguo', 'jiaoting', 'baoxu', 'yubaosi', 'dongping', 'zhangqing', 'gongwang', 'dingdesun', 'huangfuduan'].indexOf(id) < 0) S.recruit(id, 29);
    });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    S.initChar('duanjingzhu', 24);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'zhujia', 'lijia', 'gaotang', 'qingzhou', 'huazhou', 'mangdang');
    await WM.data.chapters[16].begin(s);
  };

  WM.defEvents('zengtou', [
    { id: 'ch16_first', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch16_march'); }, run: async function (s) {
      s.spawn('zk', 'zengkui', 26, 24, 'down');
      await s.say('zengkui', 'So the bandit king himself has come to die!');
      await s.duel('linchong_zengkui', { hero: 'linchong', canLose: true });
      s.despawn('zk', { leave: true });
      await s.narrate('For days the Zeng family would not come out. Then two monks came to Chao Gai\'s camp.');
      s.spawn('m1', 'fahuamonk', 25, 33, 'up'); s.spawn('m2', 'fahuamonk', 27, 33, 'up');
      await s.say('fahuamonk', 'Great King, we are monks of the Fahua Temple, to the west. The Zeng family have plundered our temple and abused us beyond bearing. We know a back way to their camp. If you come tonight, we will lead you to it.');
      await s.say('linchong', 'Brother, I don\'t trust them. Let me go, and you stay with the camp.');
      await s.say('chaogai', 'If I don\'t go myself, who will fight with heart? You stay and guard the camp, Brother Lin Chong.');
      s.despawn('m1', { leave: true }); s.despawn('m2', { leave: true });
      s.party(['chaogai', 'liutang', 'ruanxiaoer', 'huyanzhuo', 'baisheng']); s.setLeader('chaogai');
      s.night(true);
      s.flag('ch16_night');
      await s.say(null, '(Follow the monks to the Fahua Temple in the woods to the west.)');
    } },
    { id: 'ch16_trap', x: 6, y: 13, w: 3, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch16_night'); }, run: async function (s) {
      await s.narrate('The Fahua Temple was empty — not a monk in it. The two guides led them on along a narrow road behind it, through the dark woods. Then, at a turning, the monks were gone.');
      await s.say('liutang:shock', 'Brother — the monks have vanished!');
      await s.say('chaogai', '...Back. Turn back, quickly!');
      s.sfx('gong'); await s.shake(4, 0.3);
      await s.narrate('Gongs and drums on every side. Torches in the trees.');
      await s.battle('ch16_ambush', { bg: 'night' });
      s.flag('ch16_ambushed');
      await s.say(null, '(Fight your way back east to the camp!)');
    } },
    { id: 'ch16_arrow', x: 0, y: 20, w: 17, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch16_ambushed'); }, run: async function (s) {
      s.music('sad');
      s.sfx('arrow'); await s.flash();
      await s.narrate('An arrow came out of the dark and struck Chao Gai full in the face. He fell from his horse. Liu Tang and Bai Sheng lifted him and fought their way out, with Huyan Zhuo and the Ruans holding the road behind them.');
      await s.narrate('When they drew the arrow out in the camp, there were characters cut into the shaft: "Shi Wengong." The arrow had been poisoned, and Chao Gai could no longer speak.');
      s.night(false);
      s.flag('ch16_shot');
      await s.fadeOut(1.5);
      s.party(['songjiang']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
      await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
      s.spawn('cg', 'chaogai', 15, 6, 'down'); s.lie('cg');
      s.spawn('wy', 'wuyong', 13, 7, 'right'); s.spawn('lc', 'linchong', 17, 7, 'left');
      await s.fadeIn(1.5);
      await s.say('songjiang:sad', 'Brother! Brother Chao Gai!');
      await s.say('chaogai:sad', 'Brother Song Jiang... take care of yourself. Whoever captures the man who shot me... let him be the lord of Liangshan.');
      await s.narrate('Then Chao Gai closed his eyes and died. Song Jiang wept as if he had lost his own father, and the whole mountain wept with him.');
      s.lie('cg');
      s.flag('chaogai_dead');
      S.removeFromParty('chaogai');
      await s.say('wuyong', 'Brother, the mountain cannot be without a lord. Brother Chao Gai\'s words will be honoured when his enemy is taken. Until then, sit in the seat — for the sake of all of us.');
      await s.say('linchong', 'We all ask it.');
      await s.say('songjiang:sad', '...Until Shi Wengong is taken, I will sit in it — for a time. When he is taken, whoever took him shall be our lord, as our brother wished.');
      await s.narrate('Song Jiang changed the name of the Hall of Gathered Righteousness to the Hall of Loyalty and Righteousness, and before it raised a great apricot-yellow banner: "Act on Heaven\'s Behalf." He divided the mountain into camps and set a captain over each.');
      s.flag('loyaltyhall');
      s.despawn('wy', { leave: true }); s.despawn('lc');
      await s.join('duanjingzhu');
      await s.narrate('Song Jiang wanted to march on Zengtou at once. Wu Yong held him back: they were in mourning, and an army in mourning goes out under a bad star. And one day, at the memorial service for Chao Gai, a monk from Daming spoke of the richest man in the north, a master of the spear and staff without equal in the land: Lu Junyi, the Jade Qilin.');
      await s.say('songjiang', 'If only we had such a man on Liangshan, what would we fear from any army?');
      await s.say('wuyong:smile', 'Then let me go to Daming, and bring him here.');
      s.flag('ch16_done');
      await s.endChapter();
      if (WM.data.chapters[17].begin) await WM.data.chapters[17].begin(s);
    } }
  ]);
})();
