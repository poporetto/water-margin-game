// Chapter 11 — "Cuiping Mountain" (novel chapters 44–47).
// Dai Zong goes north to look for Gongsun Sheng: Yang Lin; the Yinma River (Deng Fei, Meng Kang, Pei Xuan); a vain
// search in Jizhou. Yang Xiong and Shi Xiu; Pan Qiaoyun and the monk Pei Ruhai; Cuiping Mountain; Shi Qian; the
// rooster at the Zhu family inn; Du Xing and Li Ying; Chao Gai's anger.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('zhangbao', 'Zhang Bao', { skin: '#c8905e', hairStyle: 'headband', band: '#5a2a1a', body: '#5a4a2a', trim: '#2a1a0a', beard: 'stubble', build: 'big', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('pangong', 'Old Pan', { skin: '#e0a880', hair: '#c8c8c0', hairStyle: 'scarf', band: '#3a3a3a', beard: 'long', beardColor: '#d8d8d0', body: '#6a4a3a', trim: '#c8b890', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('qiaoyun', 'Pan Qiaoyun', { skin: '#f6e2cc', hairStyle: 'woman', body: '#a83a5a', trim: '#f0d8a0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#f08090', lips: '#c03040' }, { face: true });
  WM.npc('yinger', 'Ying\'er', { skin: '#f0d8c0', hairStyle: 'bun', body: '#6a8aa8', trim: '#e8e0d0', dress: true, build: 'slim', face: 'round' }, { face: true });
  WM.npc('peiruhai', 'Pei Ruhai', { skin: '#f0d0b0', hairStyle: 'bald', body: '#a86a2a', trim: '#e8c860', face: 'oval', eyes: 'narrow', lips: '#c86060' }, { face: true });
  WM.npc('hudao', 'Hu Dao', { skin: '#b8804e', hairStyle: 'pilgrim', body: '#4a3a2a', trim: '#8a6a3a', face: 'long' }, { face: true });
  WM.npc('zhubiao', 'Zhu Biao', { skin: '#f6dcc4', hairStyle: 'helmet', helmColor: '#d8d8e0', tassel: '#e8e8f0', body: '#e8e8f0', trim: '#c8302a', weapon: 'spear', build: 'slim', face: 'narrow', eyes: 'sharp' }, { face: true });

  WM.enemy('n_wolf', 'Northern Wolf', 19, WM.beast('wolf', { body: '#8a8a8a' }), { exp: 85, gold: 0, spd: 1.2, fx: 'claw' });
  WM.enemy('n_bear', 'Mountain Bear', 21, WM.beast('bear'), { hp: 1.6, exp: 140, gold: 0, fx: 'claw', drops: [['beef', 0.5]] });
  WM.enemy('n_bandit', 'Hill Bandit', 20, WM.hum(WM.enemyLooks.bandit), { exp: 90, drops: [['medicine', 0.12]] });
  WM.enemy('n_archer', 'Hill Archer', 20, WM.hum(WM.enemyLooks.banditArcher), { hp: 0.8, range: 'L', fx: 'arrow', exp: 90 });
  WM.enemy('jz_tough', 'Zhang Bao\'s Crony', 18, WM.hum(WM.enemyLooks.thug), { hp: 0.6, atk: 0.6, exp: 80, fx: 'blunt', drops: [['wine', 0.3]] });
  WM.enemy('zhangbao_foe', 'Zhang Bao', 20, WM.hum(WM.data.npcs.zhangbao.look), { hp: 1.3, atk: 0.75, exp: 220, gold: 80, boss: true, fx: 'blunt' });
  WM.enemy('zhu_waiter', 'Inn Hand', 19, WM.hum(WM.enemyLooks.thug), { hp: 0.7, atk: 0.75, exp: 80, fx: 'blunt' });
  WM.enemy('zhu_hook', 'Zhu Village Hook-Man', 22, WM.hum(WM.enemyLooks.soldier), { hp: 0.8, atk: 0.72, range: 'M', exp: 100, drops: [['medicine', 0.1]] });
  WM.enemy('zhu_rider', 'Zhu Village Rider', 22, WM.hum(WM.enemyLooks.soldier), { hp: 0.7, atk: 0.52, range: 'M', exp: 120 });
  var T = WM.data.troops;
  T.ch11_brawl = { enemies: ['jz_tough', 'zhangbao_foe', 'jz_tough'], bg: 'town', noRun: true };
  T.ch11_inn = { enemies: ['zhu_waiter', 'zhu_waiter', 'zhu_waiter'], bg: 'town', noRun: true };
  T.ch11_pursuit = { enemies: ['zhu_hook', 'zhu_hook', 'zhu_hook', 'zhu_hook'], bg: 'night', noRun: true };
  T.ch11_riders = { enemies: ['zhu_rider', 'zhu_rider', 'zhu_rider'], bg: 'field', noRun: true };

  WM.data.duels.liying_zhubiao = {
    hero: 'liying', foe: 'zhubiao', bg: 'field', heroHp: 460, heroAtk: 44, foeHp: 460, foeAtk: 44, drawAfter: 4,
    intro: [['hero:angry', 'Zhu Biao! Your family and mine swore an oath to stand together. I asked you for one man, and you tear up my letter?'], ['foe:angry', 'And you shelter Liangshan bandits! Come and be tied up with them!']],
    lines: { attack: ['Hah!', 'Have at you!', 'There!'], wild: ['I\'ll unhorse you!', 'Take this!', 'Fall!'], defend: ['Steady...', 'Come, then.', 'Hm.'] },
    draw: [[null, 'They fought seventeen or eighteen bouts. Then Zhu Biao wheeled his horse and fled.']]
  };

  WM.data.chapters[11].begin = async function (s) {
    await s.chapter(11);
    s.party(['daizong']); s.level('daizong', 23); s.setLeader('daizong');
    s.flag('protagonist', 'daizong');
    WM.unlock('yinma', 'jizhou_n');
    await s.warp('liangshan_in', 16, 9, 'up', { noFade: true });
    s.spawn('sj', 'songjiang', 15, 6, 'down'); s.spawn('wy', 'wuyong', 17, 6, 'down');
    await s.fadeIn(0.6);
    await s.say('songjiang', 'Brother Gongsun Sheng said he would come back within a hundred days. The hundred days are long past, and there is no word. Brother Dai Zong — you are the only one of us who can go a thousand li and back. Will you go to Jizhou and find him?');
    await s.say('daizong', 'I will. I\'ll go as a courier, and I\'ll bring him back.');
    await s.say('wuyong', 'Ask about him outside the city as well as in. A man of the Way does not always live where the clerks can find him.');
    s.despawn('sj'); s.despawn('wy');
    await s.fadeOut(0.6);
    await s.warp('liangshan', 24, 41, 'down', { noFade: true });
    await s.fadeIn(0.6);
    await s.say('daizong', 'Spirits of the road, take this offering. Two charms on each leg... and away.');
    s.sfx('fire'); await s.flash();
    s.sfx('magic'); await s.jump('player', 4);
    await s.move('player', 'D4', { run: true, speed: 220 });
    await s.narrate('Dai Zong set off north, covering eight hundred li in a day.');
    await s.say(null, '(Jizhou lies far to the north. The road passes the Yinma River.)');
  };
  WM.data.chapters[11].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 10; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng', 'huarong', 'qinming', 'huangxin', 'yanshun', 'wangying', 'zhengtianshou', 'lufang', 'guosheng', 'shiyong', 'xiaorang', 'jindajian', 'songjiang', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang', 'songqing', 'zhufu', 'liyun'].forEach(function (id) { S.recruit(id, 23); });
    s.flag('away:gongsunsheng');
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'songfarm', 'jiangzhou', 'yishui');
    await WM.data.chapters[11].begin(s);
  };

  // ---------------- the Yinma River ----------------
  WM.defEvents('yinma', [
    { id: 'ch11_yanglin', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 11; }, run: async function (s) {
      s.spawn('yl', 'yanglin', 6, 12, 'left');
      await s.say('yanglin', 'Divine Traveller! Dai Zong of Jiangzhou! Wait!');
      await s.say('daizong', 'Who are you, to know my name?');
      await s.say('yanglin', 'Yang Lin of Zhangde. They call me the Brocade Leopard. I\'ve lived on the rivers and lakes by the strength of this spear. Some months ago I met a man of the Way in a tavern — Gongsun Sheng. He wrote me a letter to take to Liangshan, but I never dared go up alone. Then I heard the Divine Traveller was on the road, and I knew you by the charms on your legs.');
      await s.say('daizong', 'Gongsun Sheng! I\'m going to Jizhou to find him. Come with me — I\'ll tie a charm on your legs too, and you\'ll keep up.');
      await s.say('yanglin', 'Gladly. The road ahead crosses the Yinma River. There\'s a band in those hills — let me go first.');
      s.despawn('yl'); s.addParty('yanglin'); s.level('yanglin', 22);
      s.flag('ch11_withyanglin');
    } },
    { id: 'ch11_block', x: 13, y: 10, w: 3, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_withyanglin'); }, run: async function (s) {
      s.spawn('b1', 'bandit', 16, 11, 'left'); s.spawn('b2', 'bandit', 16, 14, 'left'); s.spawn('df', 'dengfei', 17, 12, 'left');
      await s.say('dengfei:angry', 'Halt! Leave your packs and go — or stay here for ever!');
      await s.say('yanglin', '...Brother Deng Fei? It\'s me — Yang Lin!');
      await s.say('dengfei:smile', 'Yang Lin! Ha! I almost chained you to a tree! Brothers, put down your blades. This is an old friend.');
      await s.say('dengfei', 'I\'m Deng Fei of Xiangyang, the Fiery-Eyed Lion. My eyes go red when I\'m angry. Come up to the stockade and meet my brothers.');
      s.despawn('b1', { leave: true }); s.despawn('b2', { leave: true }); s.despawn('df', { leave: true });   // back up to their stockade
      s.flag('ch11_metdeng');
      await s.say(null, '(The stockade is in the hills north-east of the river.)');
    } }
  ]);
  WM.defEvents('yinma_in', [
    { id: 'ch11_peixuan', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_metdeng'); }, run: async function (s) {
      s.spawn('px', 'peixuan', 6, 5, 'down'); s.spawn('mk', 'mengkang', 8, 5, 'down'); s.spawn('df', 'dengfei', 4, 5, 'down');
      await s.say('dengfei', 'This is Meng Kang of Zhending, the Jade Flagpole — tall and white as a mast. He built boats for the Flower-and-Rock convoys, and when the official over him drove the shipwrights too hard, he killed him and ran.');
      await s.say('mengkang', 'I can build anything that floats. Gladly met.');
      await s.say('dengfei', 'And our chief, Pei Xuan of Jingzhao — the Iron-Faced Clerk. He was a clerk in the prefecture who would never bend the law. A new prefect framed him and sent him to Shamen Island. We heard he was passing on the road, killed his escorts, and made him our chief.');
      await s.say('peixuan', 'I have three hundred men here and some carts. We have long heard of the righteousness of Song Jiang and Chao Gai. If Liangshan will have us, we will go and serve under their orders.');
      await s.say('daizong', 'Liangshan will be glad of you. When I have found Gongsun Sheng, I\'ll come back this way, and we\'ll all go to the mountain together.');
      s.despawn('px'); s.despawn('mk'); s.despawn('df');
      s.flag('ch11_yinma');
      s.heal();
      await s.narrate('They feasted Dai Zong and Yang Lin for a day, and saw them off north to Jizhou.');
    } }
  ]);

  // ---------------- Jizhou: the search, and the brawl ----------------
  WM.defEvents('jizhou_n', [
    { id: 'ch11_search', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_yinma') && WM.state.chapter === 11; }, run: async function (s) {
      s.spawn('q1', 'villager', 24, 30, 'down'); s.spawn('q2', 'oldwoman', 19, 24, 'right'); s.spawn('q3', 'merchant', 26, 21, 'left');
      await s.walkTo('player', 23, 30); s.face('player', 'right'); s.face('q1', 'left');
      await s.say('daizong', 'Friend — a Daoist called Gongsun Sheng, from these parts. Do you know where he lives?');
      await s.say('villager', 'Gongsun? Never heard the name, sir.');
      await s.walkTo('player', 20, 24); s.face('player', 'left'); s.face('q2', 'right');
      await s.say('yanglin', 'Grandmother, a man of the Way called Gongsun Sheng — have you heard of him?');
      await s.emote('q2', '?');
      await s.say('oldwoman', 'There are a hundred Daoists in Jizhou, young man, and not one of them by that name.');
      await s.walkTo('player', 25, 21); s.face('player', 'right'); s.face('q3', 'left');
      await s.say('merchant', 'Gongsun Sheng? No. Try the temples outside the walls.');
      await s.say('daizong', 'We have tried the temples outside the walls.');
      s.despawn('q1', { leave: true }); s.despawn('q2', { leave: true }); s.despawn('q3', { leave: true });
      await s.narrate('For days they searched Jizhou, inside the walls and out. No one had heard of anyone called Gongsun Sheng.');
      await s.say('yanglin:sad', 'Not a trace. Perhaps he lives in the hills, under his Daoist name.');
      await s.say('daizong', 'One more day in the city. Let\'s try the main street.');
      s.flag('ch11_searched');
    } },
    { id: 'ch11_brawl', x: 21, y: 22, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_searched'); }, idle: { yx: '(Yang Xiong walks at the head of the procession, his red-tasselled sword at his hip. He nods to you, but does not stop.)', zb: 'Out of my way. I\'ve business with the warden.', t1: 'Heh. Zhang Bao\'s going to have a word with the executioner about all that silk.', t2: 'Silk! Bolts of it! Somebody has a lot of friends...' },
      run: async function (s) {
      await s.walkTo('player', 23, 25); s.face('player', 'left');
      s.spawn('yx', 'yangxiong', 8, 22, 'right'); s.spawn('pb1', 'servant', 7, 23, 'right'); s.spawn('pb2', 'servant', 6, 22, 'right');
      s.music('town_jizhou');
      s.walkTo('pb1', 16, 23); s.walkTo('pb2', 15, 22); await s.walkTo('yx', 17, 22);
      await s.say('yanglin', 'Who\'s that, with all the silk behind him?');
      s.spawn('vl', 'villager', 24, 26, 'up');
      await s.say('villager', 'That? That\'s the Sick Guan Suo — Yang Xiong, warden of the two prisons, and the city executioner. He\'s just done a beheading in the market, and his friends have loaded him with presents.');
      s.despawn('vl', { leave: true });
      s.spawn('zb', 'zhangbao', 22, 21, 'left'); s.spawn('t1', 'gambler', 21, 23, 'left'); s.spawn('t2', 'drunk', 22, 24, 'left');
      s.walkTo('t1', 18, 23); s.walkTo('t2', 16, 24); await s.walkTo('zb', 18, 22);
      await s.say('zhangbao', 'Brother Yang Xiong! Congratulations on all these presents. Lend me a hundred strings of cash.');
      await s.say('yangxiong', 'I don\'t know you, and I don\'t lend money to men I don\'t know.');
      await s.say('zhangbao:angry', 'Then I\'ll take the silk! Grab his arms, lads!');
      s.walkTo('t1', 17, 23, { run: true }); await s.walkTo('t2', 16, 23, { run: true });
      s.face('t1', 'up'); s.face('t2', 'up');
      await s.emote('yx', 'anger'); s.sfx('hit'); await s.shake(2, 0.3);
      await s.emote('pb1', '!'); s.walkTo('pb1', 12, 24, { run: true }); s.walkTo('pb2', 11, 22, { run: true });
      await s.say('yangxiong:angry', 'Let go of me! Thieves — in broad daylight!');
      s.spawn('sx', 'shixiu', 26, 24, 'left');
      await s.walkTo('sx', 20, 23);
      s.sfx('hit'); await s.wait(0.3);
      await s.say('shixiu:angry', '(He sets down a load of firewood in the road.) Why are you beating this officer?');
      s.face('zb', 'right');
      await s.say('zhangbao:angry', 'Beggar! Mind your own business!');
      s.hide('sx'); s.despawn('sx');
      var keep = WM.state.party.slice();
      s.addParty('shixiu'); s.level('shixiu', 23); s.party(['shixiu']);
      await s.battle('ch11_brawl', { bg: 'town', guests: ['yangxiong'] });
      s.party(keep); s.setLeader('daizong');
      s.spawn('sx', 'shixiu', 19, 23, 'left');
      s.walkTo('zb', 30, 22, { run: true }); s.walkTo('t1', 31, 23, { run: true }); s.walkTo('t2', 30, 24, { run: true });
      await s.say('zhangbao:shock', 'Run! He hits like a bull!');
      s.hide('zb'); s.hide('t1'); s.hide('t2'); s.despawn('zb'); s.despawn('t1'); s.despawn('t2');
      await s.say('yangxiong:angry', 'Come back here, Zhang Bao!');
      s.walkTo('yx', 32, 22, { run: true }); await s.wait(0.5);
      await s.walkTo('sx', 30, 23, { run: true });
      await s.say('daizong', 'Brother Yang Lin — after that firewood seller! A man like that is worth ten of the ones we came for.');
      await s.walkTo('player', 28, 23, { run: true });
      s.hide('yx'); s.despawn('yx');
      s.despawn('pb1', { leave: true }); s.despawn('pb2', { leave: true });
      s.flag('ch11_brawled');
      await s.warp('jizhou_in', 21, 6, 'up');
    } }
  ]);
  WM.defEvents('jizhou_in', [
    { id: 'ch11_tavern', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_brawled') && !S2.has('ch11_brothers'); }, run: async function (s) {
      s.spawn('sx', 'shixiu', 23, 4, 'down');
      await s.say('daizong', 'You fight like a tiger, friend. Who are you?');
      await s.say('shixiu', 'Shi Xiu, from Jiankang. I learned the spear and staff as a boy, and I can\'t walk past an injustice without stepping in, so people call me the Daredevil Third Brother. I came north with my uncle to sell livestock. He died on the road, the money\'s gone, and I sell firewood to eat.');
      await s.say('daizong', 'Then don\'t sell firewood. Come to Liangshan, where a man like you can hold up his head. Here — ten taels, for now.');
      await s.say('shixiu', 'I\'d go. But how could a nobody like me get into Liangshan?');
      await s.say('soldier', '(from the street) The firewood seller! Has anyone seen the big firewood seller? The warden wants him!');
      s.spawn('ym1', 'soldier', 21, 8, 'up'); s.spawn('ym2', 'soldier', 22, 7, 'up');
      await s.emote('player', '!');
      await s.say('daizong', '...Yang Xiong\'s men. We had better not be seen with the warden of the prisons. Think about what I said, Brother Shi Xiu.');
      await s.walkTo('player', 25, 4); s.hide('player');
      await s.walkTo('ym1', 21, 6);
      await s.say('soldier', 'There he is! Sir, the warden begs you to wait for him here!');
      s.despawn('ym1', { leave: true }); s.despawn('ym2', { leave: true });
      s.show('player');
      s.despawn('sx');
      await s.narrate('Since Gongsun Sheng was not to be found, Dai Zong and Yang Lin went back to the Yinma River. Pei Xuan, Deng Fei and Meng Kang burned their stockade, and with all their men and carts went south, dressed as government troops, to Liangshan.');
      await s.joinMany(['yanglin', 'dengfei', 'mengkang', 'peixuan']);
      // Shi Xiu's story begins
      s.party(['shixiu']); s.setLeader('shixiu'); s.level('shixiu', 23); s.flag('protagonist', 'shixiu');
      await s.fadeOut(0.6);
      await s.warp('jizhou_in', 21, 6, 'up', { noFade: true });
      s.spawn('yx', 'yangxiong', 22, 5, 'down');
      await s.fadeIn(0.6);
      await s.say('yangxiong:smile', 'There you are! You saved my face today, friend. Who were the two men drinking with you?');
      await s.say('shixiu', 'Two travellers. They left.');
      await s.say('yangxiong', 'I have no brother. Will you be mine? I am twenty-nine.');
      await s.say('shixiu', 'And I am twenty-eight. Then you are my elder brother.');
      s.face('player', 'up'); await s.jump('player'); await s.jump('yx');
      await s.say('yangxiong:smile', 'Brother! Now you\'ll come home with me and meet the family.');
      s.addParty('yangxiong'); s.level('yangxiong', 23); s.removeParty('yangxiong');
      s.flag('ch11_brothers');
      await s.fadeOut(0.6);
      s.despawn('yx');
      await s.warp('jizhou_in', 8, 7, 'up', { noFade: true });
      s.spawn('yx', 'yangxiong', 7, 6, 'right'); s.spawn('qy', 'qiaoyun', 10, 5, 'down'); s.spawn('pg', 'pangong', 4, 5, 'right');
      await s.fadeIn(0.6);
      await s.say('yangxiong', 'Wife, Father — this is Shi Xiu, my sworn younger brother. He lives with us from today.');
      await s.say('qiaoyun:smile', 'Welcome, Uncle. My husband has never brought a brother home before.');
      await s.say('pangong', 'Shi Xiu — you said you\'ve been a butcher? I was one myself. Let\'s open a shop at the front of the house. You keep it, I\'ll help.');
      await s.say('shixiu', 'Gladly, Uncle. I know the trade well.');
      s.despawn('yx', { leave: true }); s.despawn('qy'); s.despawn('pg');
      await s.narrate('So the butcher\'s shop opened at the front of Yang Xiong\'s house, and Shi Xiu kept it.');
    } },
    { id: 'ch11_service', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_brothers') && WM.state.x < 15; }, run: async function (s) {
      await s.narrate('Two months went by. Then Old Pan held a service for the second anniversary of the death of Qiaoyun\'s first husband, Clerk Wang.');
      s.spawn('qy', 'qiaoyun', 5, 7, 'right'); s.spawn('pg', 'pangong', 4, 6, 'right');
      s.spawn('mk1', 'monk', 3, 7, 'left'); s.spawn('mk2', 'monk', 3, 8, 'left');
      s.spawn('pr', 'peiruhai', 7, 8, 'up');
      await s.walkTo('pr', 6, 7);
      s.face('pr', 'left'); s.face('qy', 'right');
      await s.say('peiruhai:smile', 'Elder Sister! I have brought some fine incense, and some dates from the capital, for the service.');
      await s.say('qiaoyun:smile', 'Brother Pei, you shouldn\'t have. Come, sit.');
      await s.say('pangong', 'Brother Shi Xiu — that is Pei Ruhai. His master is my sworn godfather, so he calls my daughter "Elder Sister."');
      s.face('pr', 'up'); s.face('qy', 'left');
      s.sfx('bell'); await s.emote('mk1', 'note'); await s.emote('mk2', 'note');
      await s.say('monk', '"...Namo Amitabha... may the soul of the departed be reborn in the Pure Land..."');
      s.face('pr', 'left'); s.face('qy', 'right');
      await s.emote('pr', 'heart'); await s.emote('qy', 'heart');
      await s.emote('mk1', '?');
      await s.say('monk', '"...may the... the..." (He has lost his place, staring at the two of them.)');
      await s.emote('player', 'anger');
      await s.say('shixiu:angry', '(The monk\'s eyes never leave her, and hers never leave him. And Brother Yang Xiong is on night duty in the prison tonight... This is not right.)');
      s.sfx('bell');
      s.despawn('pr', { leave: true }); s.despawn('mk1', { leave: true }); s.despawn('mk2', { leave: true });
      s.flag('ch11_service');
      await s.fadeOut(0.8);
      s.night(true);
      s.hide('qy'); s.hide('pg'); s.despawn('qy'); s.despawn('pg');
      s.place('player', 9, 5, 'down'); s.lie('player');
      await s.fadeIn(0.8);
      await s.emote('player', 'zzz', 1.4);
      s.sfx('hit'); await s.wait(0.5); s.sfx('hit'); await s.wait(0.5); s.sfx('hit');
      await s.say('hudao', '(from the lane behind the house) (tok... tok... tok...) "The sky is bright, all beings rise and pray..."');
      s.lie('player', false); await s.emote('player', '!');
      await s.say('shixiu', '(The fifth watch. A monk beating a wooden fish in the dead-end lane behind the house — every morning, in a lane where no one lives?)');
      await s.say(null, '(Go out and see who it is.)');
    } }
  ]);
  WM.defEvents('jizhou_n', [
    { id: 'ch11_dawn', x: 1, y: 30, w: 8, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_service') && !S2.has('ch11_dawnseen'); },
      idle: { hd: '(The wandering monk beats his wooden fish and does not look up.) Save us from suffering, O Bodhisattva...', pr: '(A man in a scarf turns his face to the wall and says nothing.)' },
      run: async function (s) {
      s.spawn('hd', 'hudao', 3, 30, 'right');
      await s.say('hudao', '(tok... tok... tok...) "Save us from suffering, O Bodhisattva..."');
      await s.say('shixiu', '(Into the shadow of the wall. Watch.)');
      s.sfx('door');
      s.spawn('pr', 'peiruhai', 10, 30, 'left');
      await s.say('shixiu', '(The back door... A man in a scarf.)');
      await s.walkTo('pr', 5, 30);
      s.face('pr', 'right'); await s.wait(0.4); s.face('pr', 'left');
      await s.emote('player', '!');
      await s.say('shixiu:angry', '(Under the scarf — a shaven head. Pei Ruhai!)');
      await s.say('peiruhai', '(whispering) Hu Dao. Same again in three days.');
      s.despawn('pr', { leave: true }); s.despawn('hd', { leave: true });
      await s.wait(1.2);
      await s.say('shixiu:angry', '(So that is the signal. When Brother is on duty, an incense table goes out by the back door. And at dawn Hu Dao beats his fish to wake the monk.)');
      s.night(false);
      s.flag('ch11_dawnseen');
      await s.say(null, '(Find Yang Xiong. He drinks at the tavern east of the main street.)');
    } }
  ]);
  WM.defEvents('jizhou_in', [
    { id: 'ch11_tell', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_dawnseen') && WM.state.x >= 16 && WM.state.x < 27; }, run: async function (s) {
      s.spawn('yx', 'yangxiong', 22, 3, 'down');
      await s.say('shixiu', 'Brother. Every time you are on duty at night, Pei Ruhai of Baoen Temple comes into your house. I saw him go out of the back door this morning with my own eyes. Don\'t be hasty. Tomorrow say you are on duty, and come back at the third watch, and we\'ll take him together.');
      await s.say('yangxiong:angry', '...So that\'s it. Tomorrow, then.');
      s.despawn('yx', { leave: true });
      s.music('sad');
      await s.narrate('But that evening Yang Xiong was called before the prefect, who kept him drinking late.');
      // that night, in Yang Xiong's house (Shi Xiu away buying pigs)
      await s.fadeOut(0.8);
      s.night(true);
      s.hide('player');
      await s.warp('jizhou_in', 8, 8, 'up', { noFade: true });
      s.spawn('qy', 'qiaoyun', 11, 4, 'down'); s.spawn('yx', 'yangxiong', 8, 8, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('yx', 9, 5);
      await s.emote('yx', 'anger');
      await s.say('yangxiong:angry', 'You... cheap... You think I don\'t know? You think I don\'t know what goes on in this house while I\'m on duty? I\'ll... I\'ll settle with you...', { top: true });
      await s.emote('yx', 'zzz', 1.4); s.lie('yx');
      await s.emote('qy', 'sweat');
      await s.say('qiaoyun', '(...He knows. Someone told him. And there is only one person who could have.)', { top: true });
      await s.fadeOut(0.8);
      s.lie('yx', false); s.place('yx', 9, 5, 'right'); s.place('qy', 10, 5, 'left');
      await s.fadeIn(0.8);
      await s.say('yangxiong', 'Why are you crying? What did I say last night?');
      await s.say('qiaoyun:sad', 'You said... you knew. Husband, I didn\'t dare tell you. Your sworn brother Shi Xiu — when you are on duty he comes and says shameless things to me. Once he put his hand on my breast. I said nothing, for fear of what it would do to you.');
      await s.emote('yx', 'anger');
      await s.say('yangxiong:angry', '...That dog! And I called him my brother! Father! Pull down the counters of the shop — today!', { top: true });
      await s.fadeOut(0.8);
      s.hide('qy'); s.hide('yx'); s.despawn('qy'); s.despawn('yx');
      s.night(false);
      s.spawn('pg', 'pangong', 7, 4, 'down');
      s.show('player'); s.place('player', 8, 8, 'up');
      await s.fadeIn(0.8);
      await s.walkTo('player', 8, 6);
      await s.emote('player', '?');
      await s.say('shixiu', 'Uncle... the counters? The meat hooks, the chopping block — where is the shop?');
      await s.say('pangong:sad', 'Yang Xiong told me to take it all down. He didn\'t say why. ...I think you know why, Brother Shi Xiu.');
      await s.say('shixiu:sad', '(I see. She has got her word in first. If I argue, it only shames my brother. I will settle the accounts and go.)');
      s.sfx('item');
      await s.say('shixiu', 'Here is the account book, Uncle. Every copper is in it. Thank you for your kindness.');
      await s.say('pangong:sad', '...Take care of yourself, lad.');
      s.flag('ch11_expelled');
      await s.walkTo('player', 8, 8);
      await s.narrate('Shi Xiu packed his bundle and took a room at a lodging house nearby. But he did not leave Jizhou.');
      s.despawn('pg');
      await s.warp('jizhou_in', 47, 6, 'up');
    } },
    { id: 'ch11_lodge', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_expelled') && WM.state.x >= 43; }, run: async function (s) {
      await s.say('shixiu:angry', '(Brother Yang Xiong is a good man, but he believes her, and he\'ll be killed by those two one day. I must show him the truth.)');
      s.night(true);
      await s.narrate('For three nights Shi Xiu watched the prison. On the fourth, Yang Xiong was on duty — and Shi Xiu, with a sharp knife at his waist, went before dawn to the lane behind the house.');
      s.flag('ch11_watch');
      await s.say(null, '(Go to the lane behind Yang Xiong\'s house.)');
    } }
  ]);
  WM.defEvents('jizhou_n', [
    { id: 'ch11_lane', x: 1, y: 30, w: 8, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_watch'); }, idle: { hd: '(tok... tok...) The sky is bright, all beings, rise and pray... (He sees you, and the fish falls silent.)' },
      run: async function (s) {
      s.spawn('hd', 'hudao', 3, 30, 'right');
      await s.say('hudao', '(tok... tok...)');
      await s.say('shixiu:angry', 'Not a sound. Tell me the truth, or you die.');
      await s.say('hudao:shock', 'M-mercy! It\'s the monk Pei Ruhai! When the incense table is set out, he goes in. When I beat the fish at dawn, he comes out. He pays me!');
      await s.say('shixiu:angry', 'Take off your robe. And give me that fish.');
      s.sfx('slash'); await s.flash(); s.lie('hd');
      await s.fadeOut(0.6);
      s.costume('shixiu', { body: '#5a4a3a', trim: '#8a7a5a' });
      await s.fadeIn(0.6);
      s.sfx('hit'); await s.wait(0.5); s.sfx('hit'); await s.wait(0.5); s.sfx('hit');
      await s.say('shixiu', '(tok... tok... tok...)');
      s.sfx('door');
      s.spawn('pr', 'peiruhai', 10, 30, 'left');
      await s.walkTo('pr', 6, 30);
      await s.say('peiruhai', '(whispering) Hu Dao? Why are you beating so loud? Quiet!');
      await s.walkTo('player', 5, 30, { run: true });
      s.face('pr', 'left');
      await s.emote('pr', '!');
      await s.say('shixiu:angry', 'Not a sound. Off with your robes.');
      s.sfx('slash'); await s.flash(); s.lie('pr');
      await s.fadeOut(1);
      s.costume('shixiu', null);
      s.night(false);
      s.place('player', 18, 31, 'left'); s.hide('player');
      await s.fadeIn(1);
      s.spawn('pc', 'peddler', 8, 31, 'left');
      await s.walkTo('pc', 6, 31);
      await s.emote('pc', '!'); await s.jump('pc');
      await s.say('peddler:shock', 'Aiee! Dead men! Two dead monks in the lane! Help! Constables!', { top: true });
      s.spawn('kc1', 'constable', 9, 31, 'left'); s.spawn('kc2', 'constable', 10, 31, 'left');
      s.walkTo('kc2', 7, 30); await s.walkTo('kc1', 4, 31);
      await s.say('constable', 'The monk Pei Ruhai of Baoen Temple... and the wandering monk Hu Dao, with a knife in his hand. Stripped, both of them.', { top: true });
      await s.say('constable', 'A quarrel between monks. Over a woman, most like. They killed each other. Write it down, and close the case.', { top: true });
      await s.fadeOut(0.8);
      s.hide('hd'); s.hide('pr'); s.hide('pc'); s.hide('kc1'); s.hide('kc2');
      s.despawn('hd'); s.despawn('pr'); s.despawn('pc'); s.despawn('kc1'); s.despawn('kc2');
      s.show('player'); s.place('player', 5, 31, 'right');
      s.flag('ch11_proof');
      await s.fadeIn(1);
      await s.say('shixiu', '(All Jizhou is talking of nothing else. And the clothes of both monks are in my bundle.)');
      await s.say('shixiu', '(Brother will come over the state bridge on his way to the prison.)');
    } },
    { id: 'ch11_bridge', x: 22, y: 15, w: 3, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_proof'); }, idle: { yx: '(Yang Xiong is pacing at the end of the bridge, searching every face that passes. He hasn\'t seen you yet.)' },
      run: async function (s) {
      s.spawn('yx', 'yangxiong', 23, 18, 'up');
      await s.say('yangxiong', 'Brother! I\'ve been looking for you. I was a fool, and I listened to a woman. Those two dead monks — I know now.');
      await s.say('shixiu', 'Brother, these are the clothes of the monk and of Hu Dao. Now you know I did not lie to you. But I want her to say it to your face, so that my name is clear.');
      await s.say('yangxiong:angry', '...Then tell me how.');
      await s.say('shixiu', 'Tell her you made a vow to burn incense at the temple outside the east gate, and take her and the maid Ying\'er with you. I\'ll be waiting on Cuiping Mountain, by the old tombs, where no one goes.');
      s.despawn('yx');
      s.addParty('yangxiong'); s.party(['shixiu', 'yangxiong']); s.setLeader('shixiu');
      WM.unlock('cuiping');
      s.flag('ch11_bridgedone');
      await s.say(null, '(Cuiping Mountain lies a little way north-east of Jizhou.)');
    } }
  ]);

  // ---------------- Cuiping Mountain ----------------
  WM.defEvents('cuiping', [
    { id: 'ch11_cuiping', x: 8, y: 1, w: 16, h: 8, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_bridgedone'); }, run: async function (s) {
      s.music('tense');
      s.spawn('qy', 'qiaoyun', 15, 7, 'up'); s.spawn('ye', 'yinger', 13, 7, 'up');
      await s.say('qiaoyun:shock', '...Brother-in-law? Why are you here? Husband — why have you brought us up among the graves?');
      await s.say('shixiu', 'Sister-in-law. You told my brother I made advances to you. Then let us settle it here, in front of him.');
      await s.say('yangxiong:angry', 'Ying\'er. Tell the truth.');
      await s.say('yinger:sad', '...It was the monk. When the master was on duty, I set out the incense table at the back door, and he came in. At dawn Hu Dao beat his fish and he went out. My mistress gave me a bracelet to keep quiet. It is all true.');
      await s.say('qiaoyun:sad', '...It is true. And Brother Shi Xiu never laid a finger on me. Husband, for the sake of our marriage, forgive me...');
      await s.say('shixiu', 'Brother. Now you know everything. It is for you to decide.');
      await s.fadeOut(1.5);
      s.lie('qy'); s.lie('ye');
      await s.narrate('Yang Xiong killed the maid Ying\'er there among the tombs, and then he killed his wife, Pan Qiaoyun.');
      await s.fadeIn(1);
      await s.say('yangxiong:sad', 'Brother... what now? I am a murderer, and I can\'t go back to the city.');
      await s.say('shixiu', 'I have a road for us. Dai Zong of Liangshan gave me ten taels and told me to come up the mountain. We\'ll go to Liangshan.');
      s.spawn('sq', 'shiqian', 21, 3, 'left');
      await s.say('shiqian:smile', 'Liangshan! Then take me too!');
      await s.say('yangxiong:shock', 'Who\'s that?! — Shi Qian?');
      await s.say('shiqian', 'Shi Qian of Gaotang — the Flea on a Drum, at your service. I go over walls and through roofs, and I don\'t much mind whose. I was digging in these old graves for anything worth having, and I heard it all. Warden Yang, you saved me from the court once. Let me follow you two to Liangshan.');
      await s.say('shixiu', 'A man of your skills would be useful. Come on, then.');
      s.despawn('sq', { leave: true }); s.addParty('shiqian'); s.level('shiqian', 22);
      WM.unlock('zhuinn');
      s.flag('ch11_cuiping');
      await s.narrate('The three of them went down the back of the mountain and took the road south-east to Yunzhou, towards Liangshan.');
      await s.say(null, '(Go south-east, towards Liangshan.)');
    } }
  ]);

  // ---------------- the Zhu family inn ----------------
  WM.defEvents('zhuinn', [
    { id: 'ch11_innarrive', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_cuiping'); }, run: async function (s) {
      s.night(true);
      await s.narrate('Towards evening they came to an inn at the foot of a high ridge. Behind the counter hung a row of sharp halberds and spears, and outside the gate stood a sign: "The Zhu Family Inn."');
      await s.say(null, '(Go into the inn.)');
    } }
  ]);
  WM.defEvents('zhuinn_in', [
    { id: 'ch11_rooster', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_cuiping'); }, run: async function (s) {
      s.spawn('ky', 'innkeep', 4, 5, 'right');
      await s.say('shixiu', 'Keeper, why do you have so many weapons hanging up?');
      await s.say('innkeep', 'This is the land of the Zhu Family Village. That\'s Dulong Ridge behind us, and the Zhu master and his three sons have five or seven hundred tenants who can fight. Liangshan isn\'t far. Every house in the village keeps a weapon or two, in case the bandits come.');
      await s.say('shiqian', 'Any meat?');
      await s.say('innkeep', 'There was. It\'s all gone. Only wine and greens.');
      s.despawn('ky', { leave: true });
      s.spawn('sq', 'shiqian', 7, 6, 'up');
      await s.say('shiqian', 'Only greens! ...Wait here, brothers. I need to step out the back a moment.');
      await s.walkTo('sq', 7, 8); s.hide('sq');
      await s.wait(1.2);
      s.sfx('hit'); await s.wait(0.4);
      s.show('sq');
      await s.walkTo('sq', 7, 6);
      await s.say('shiqian:smile', 'Look what I found out the back! A fine fat rooster — already plucked. I\'ll have it in the pot in no time.');
      await s.say('yangxiong', '...You never learn, do you, Shi Qian?');
      await s.fadeOut(0.6);
      s.place('sq', 6, 5, 'right');
      await s.fadeIn(0.6);
      await s.emote('sq', 'note'); await s.emote('player', 'heart');
      await s.say('shiqian:smile', 'Mm! Tender!');
      s.hide('sq'); s.despawn('sq');
      s.spawn('ky', 'innkeep', 7, 8, 'up');
      await s.walkTo('ky', 7, 6);
      await s.say('innkeep:angry', 'Where is our rooster? You\'ve eaten the cock that crows for the dawn!');
      await s.say('shixiu', 'Don\'t shout. How much was it worth? We\'ll pay.');
      await s.say('innkeep:angry', 'Pay? That bird tells the hour! You can\'t pay for that with less than ten taels! ...You\'re Liangshan bandits, the three of you. I\'ll take you to the village!');
      await s.say('shixiu:angry', 'Liangshan heroes, are we? And if we were, would you take us anywhere?');
      await s.say('innkeep:angry', 'Hands! Hands! Bring your clubs!');
      s.despawn('ky', { leave: true });
      s.spawn('hn1', 'workman', 7, 8, 'up'); s.spawn('hn2', 'workman', 8, 7, 'up');
      await s.walkTo('hn1', 7, 7, { run: true });
      await s.battle('ch11_inn', { bg: 'town' });
      s.hide('hn1'); s.hide('hn2'); s.despawn('hn1'); s.despawn('hn2');
      await s.say('shixiu', 'They\'ll be back with the whole village. Let them find nothing but ashes!');
      await s.walkTo('player', 9, 5);
      s.sfx('fire'); await s.flash();
      s.tint('fire');
      await s.say('shixiu', 'A brand from the kitchen — into the thatch. Out, both of you!');
      s.flag('ch11_fire');
      await s.warp('zhuinn', 14, 13, 'down');
    } }
  ]);
  WM.defEvents('zhuinn', [
    { id: 'ch11_pursuit', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_fire'); }, run: async function (s) {
      s.tint('fire');
      s.spawn('sq', 'shiqian', 13, 14, 'left'); s.spawn('yx', 'yangxiong', 15, 14, 'left');
      await s.move('player', 'L5', { run: true, wait: false }); s.move('sq', 'L5', { run: true, wait: false }); await s.move('yx', 'L5', { run: true });
      await s.say('shiqian', 'Look back — the whole inn\'s alight! Ha!');
      s.spawn('zt1', 'farmer', 1, 13, 'right'); s.spawn('zt2', 'farmer', 1, 15, 'right'); s.spawn('zt3', 'farmer', 20, 13, 'left'); s.spawn('zt4', 'farmer', 20, 15, 'left');
      await s.emote('player', '!');
      await s.say('yangxiong:shock', 'Torches! On both sides of the road — a hundred, two hundred of them!');
      await s.say('farmer', 'Liangshan thieves! Burnt the inn! Hook them, hook them!');
      s.walkTo('zt1', 6, 13, { run: true }); s.walkTo('zt2', 6, 15, { run: true }); s.walkTo('zt3', 12, 13, { run: true }); await s.walkTo('zt4', 12, 15, { run: true });
      await s.battle('ch11_pursuit', { bg: 'night', rounds: 4 });
      s.hide('zt1'); s.hide('zt2'); s.despawn('zt1'); s.despawn('zt2');
      await s.say('shixiu', 'The front ones are down! Run, now!');
      s.spawn('hk1', 'farmer', 7, 17, 'up'); s.spawn('hk2', 'farmer', 9, 17, 'up');
      await s.wait(0.3);
      await s.emote('sq', '!'); await s.jump('sq', 8);
      await s.say('shiqian:shock', 'AAH! Hooks — they\'ve got my legs! Brothers!');
      s.sfx('hit');
      await s.move('sq', 'D3', { speed: 90 });
      s.hide('sq'); s.hide('hk1'); s.hide('hk2');
      s.despawn('sq'); s.despawn('hk1'); s.despawn('hk2');
      s.removeParty('shiqian');
      await s.say('shixiu:sad', 'Shi Qian! ...There are too many. Brother, we have to go — we\'ll come back for him!');
      s.despawn('yx');
      s.walkTo('zt3', 9, 13, { run: true }); s.walkTo('zt4', 9, 15, { run: true });
      await s.move('player', 'L6', { run: true });
      s.hide('zt3'); s.hide('zt4'); s.despawn('zt3'); s.despawn('zt4');
      s.tint(null);
      s.night(false);
      WM.unlock('lijia');
      s.flag('ch11_lostshiqian');
      await s.narrate('They ran on through the night. At dawn they came to a village tavern, far from the ridge, and sat down to eat.');
      await s.warp('lijia_in', 22, 6, 'up');
    } }
  ]);

  // ---------------- Du Xing and Li Ying ----------------
  WM.defEvents('lijia_in', [
    { id: 'ch11_duxing', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_lostshiqian') && WM.state.x >= 18; }, run: async function (s) {
      s.spawn('dx', 'duxing', 21, 4, 'down');
      await s.say('duxing:shock', '...Warden Yang? Benefactor! What are you doing here?');
      await s.say('yangxiong', 'Du Xing! Brother, this is Du Xing, the Demon Face. He killed a man in a fight in Jizhou, and I got him out of prison.');
      await s.say('duxing', 'I\'m steward now to the master of the Li Family Manor, Li Ying, the Sky-Striking Eagle. There are three villages here under Dulong Ridge — the Zhu in the middle, the Hu to the west, the Li to the east. They\'ve sworn an oath: if one is attacked, the others help. My master will write to the Zhu family, and they will let your friend go.');
      s.despawn('dx');
      s.flag('ch11_metduxing');
      await s.warp('lijia_in', 9, 7, 'up');
    } },
    { id: 'ch11_letters', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_metduxing') && WM.state.x < 17; }, run: async function (s) {
      s.spawn('ly', 'liying', 8, 4, 'down'); s.spawn('dx', 'duxing', 11, 5, 'left');
      await s.say('liying', 'A man stole a chicken? I will write to the Zhu brothers. They will send him back.');
      s.sfx('item');
      await s.say('liying', 'Take this to the Zhu manor. Quickly.');
      s.spawn('ms', 'servant', 8, 8, 'up'); await s.walkTo('ms', 8, 5);
      s.despawn('ms', { leave: true });
      await s.fadeOut(0.6); await s.wait(0.4);
      s.spawn('ms', 'servant', 8, 8, 'up');
      await s.fadeIn(0.6);
      await s.walkTo('ms', 8, 5);
      await s.say('servant', 'Master... the Zhu brothers say the thief will go to the prefecture, and they won\'t hand him to anyone else.');
      await s.emote('ly', 'anger');
      s.despawn('ms', { leave: true });
      await s.say('liying', 'They refuse a letter from me? Then I will write in my own hand, and seal it with my own seal. Du Xing, take it yourself.');
      s.sfx('item');
      await s.walkTo('dx', 9, 5);
      await s.say('duxing', 'Yes, master.');
      await s.walkTo('dx', 8, 8); s.hide('dx');
      await s.fadeOut(0.6); await s.wait(0.4);
      s.show('dx');
      await s.fadeIn(0.6);
      await s.walkTo('dx', 10, 5, { run: true });
      await s.say('duxing:angry', 'Master! Zhu Biao tore your letter in pieces without reading it. He said the Li family is in league with Liangshan, and that he\'d have you tied up too. All three Zhu brothers shouted "We won\'t give him back! We won\'t give him back!"');
      await s.say('liying:angry', 'He tore up my letter? Bring my horse and my armour!');
      s.despawn('ly'); s.despawn('dx');
      s.flag('ch11_torn');
      await s.warp('lijia', 38, 20, 'right');
    } }
  ]);
  WM.defEvents('lijia', [
    { id: 'ch11_arrow', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_torn'); }, run: async function (s) {
      s.spawn('ly', 'liying', 39, 20, 'right'); s.spawn('zb', 'zhubiao', 42, 20, 'left');
      s.music('duel');
      await s.narrate('Li Ying rode out with three hundred men to the Zhu Family Village. Zhu Biao came out to meet him.');
      await s.say('liying:angry', 'Zhu Biao! Our fathers swore an oath of life and death between our villages. And you tear up my letter?');
      await s.say('zhubiao:angry', 'You\'re hand in glove with the Liangshan bandits! I\'ll tie you up with the chicken thief!');
      s.level('liying', 25);
      await s.duel('liying_zhubiao', { hero: 'liying', canLose: true });
      s.walkTo('zb', 43, 20, { run: true });
      await s.say('liying:angry', 'Running? Stand and fight!');
      await s.walkTo('ly', 41, 20, { run: true });
      s.face('zb', 'left');
      s.sfx('arrow'); await s.wait(0.3);
      s.sfx('hit'); await s.jump('ly'); await s.shake(2, 0.3);
      s.lie('ly');
      await s.say('liying', 'Ngh — my arm!');
      await s.say('yangxiong:angry', 'Brother Shi Xiu — at them!');
      await s.battle('ch11_riders', { bg: 'field', rounds: 3 });
      s.spawn('yx', 'yangxiong', 40, 21, 'right');
      await s.walkTo('yx', 42, 21, { run: true });
      s.sfx('slash'); await s.flash();
      await s.say('zhubiao:shock', 'My horse! Back — back to the village!');
      s.despawn('zb', { leave: true });
      s.spawn('dx', 'duxing', 37, 20, 'right');
      await s.walkTo('dx', 40, 20, { run: true });
      await s.say('duxing', 'Master! Hold on to me — I\'ll carry you home.');
      s.hide('ly'); s.despawn('ly');
      s.despawn('dx', { to: [22, 17] });
      s.despawn('yx');
      s.heal();
      await s.say('yangxiong', 'Master Li Ying is wounded because of us. We have no road but one. To Liangshan — and ask them to save Shi Qian.');
      s.flag('ch11_toliangshan');
      await s.narrate('They came to Shi Yong\'s tavern on the shore of the marsh, and Shi Yong knew Shi Xiu\'s name from Dai Zong. He shot a whistling arrow across the water, and a boat came for them.');
      await s.warp('liangshan_in', 16, 12, 'up');
    } }
  ]);

  // ---------------- Liangshan ----------------
  WM.defEvents('liangshan_in', [
    { id: 'ch11_chaogai', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_toliangshan') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('cg', 'chaogai', 15, 5, 'down'); s.spawn('sj', 'songjiang', 13, 6, 'down'); s.spawn('wy', 'wuyong', 17, 6, 'down'); s.spawn('dz', 'daizong', 19, 7, 'left');
      await s.narrate('Yang Xiong and Shi Xiu told the whole story: Cuiping Mountain, Shi Qian, the rooster, the fire, Li Ying\'s letters.');
      await s.say('chaogai:angry', 'These two went about under the name of the heroes of Liangshan stealing chickens to eat — and brought shame on all of us! Take them out and cut off their heads!');
      await s.say('songjiang', 'No, brother! They came hundreds of li to join us. It was Shi Qian who stole the chicken, not these two. And the Zhu family has long boasted that it will destroy Liangshan. They insult us — and we should kill the men who came to us for help?');
      await s.say('wuyong', 'Brother, the Zhu Village has been our enemy a long time. This is not their fault.');
      await s.say('daizong', 'I invited Shi Xiu myself. If they die, cut off my head with theirs.');
      await s.say('chaogai', '...Very well. Stand up.');
      await s.say('songjiang', 'We have set down rules for the mountain, and Brother Pei Xuan, our Iron-Faced Clerk, keeps them. Let no one forget them.');
      await s.joinMany(['yangxiong', 'shixiu']);
      await s.say('songjiang', 'Brothers. Let me take an army against the Zhu Family Village. First, to wipe out this insult; second, to rescue Shi Qian; third, the village has grain enough to feed our mountain for years; and fourth, we will ask Li Ying to join us. If I do not take Zhu Village, I will not come back up this mountain.');
      await s.say('chaogai', 'Then go, and come back victorious.');
      s.despawn('cg'); s.despawn('sj'); s.despawn('wy'); s.despawn('dz');
      s.flag('ch11_done');
      await s.endChapter();
      if (WM.data.chapters[12].begin) await WM.data.chapters[12].begin(s);
    } }
  ]);
})();
