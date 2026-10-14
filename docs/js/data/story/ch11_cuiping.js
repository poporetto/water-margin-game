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
    await s.narrate('Dai Zong tied his magic charms to his legs, burnt paper money to the spirits, and set off north, covering eight hundred li in a day. On the road near Yishui he heard everyone talking about the Black Whirlwind\'s killings.');
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
      await s.narrate('For days Dai Zong and Yang Lin searched Jizhou, inside the walls and out, and asked everyone they met. No one had heard of anyone called Gongsun Sheng.');
      await s.say('yanglin:sad', 'Not a trace. Perhaps he lives in the hills, under his Daoist name.');
      await s.say('daizong', 'One more day in the city. Let\'s try the main street.');
      s.flag('ch11_searched');
    } },
    { id: 'ch11_brawl', x: 21, y: 22, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_searched'); }, idle: { yx: '(Yang Xiong walks at the head of the procession, his red-tasselled sword at his hip. He nods to you, but does not stop.)', zb: 'Out of my way. I\'ve business with the warden.', t1: 'Heh. Zhang Bao\'s going to have a word with the executioner about all that silk.', t2: 'Silk! Bolts of it! Somebody has a lot of friends...' },
      run: async function (s) {
      s.spawn('yx', 'yangxiong', 18, 22, 'right'); s.spawn('zb', 'zhangbao', 20, 22, 'left'); s.spawn('t1', 'gambler', 19, 23, 'up'); s.spawn('t2', 'drunk', 17, 23, 'up');
      await s.narrate('A procession was coming down the street: a tall, sallow-faced officer with a red-tasselled sword, behind him men carrying bolts of silk and satin — gifts from his friends. People called him the Sick Guan Suo: Yang Xiong, warden of the two prisons of Jizhou, and the executioner of the city.');
      await s.say('zhangbao', 'Brother Yang Xiong! Congratulations on all these presents. Lend me a hundred strings of cash.');
      await s.say('yangxiong', 'I don\'t know you, and I don\'t lend money to men I don\'t know.');
      await s.say('zhangbao:angry', 'Then I\'ll take the silk! Grab his arms, lads!');
      s.spawn('sx', 'shixiu', 26, 23, 'left');
      await s.narrate('They seized Yang Xiong\'s arms and began snatching the silk. And then a big man with a load of firewood on his shoulder put it down in the road.');
      await s.say('shixiu:angry', 'Why are you beating this officer?');
      await s.say('zhangbao:angry', 'Beggar! Mind your own business!');
      s.despawn('sx');
      var keep = WM.state.party.slice();
      s.addParty('shixiu'); s.level('shixiu', 23); s.party(['shixiu']);
      await s.battle('ch11_brawl', { bg: 'town', guests: ['yangxiong'] });
      s.despawn('zb', { leave: true }); s.despawn('t1', { leave: true }); s.despawn('t2', { leave: true });
      await s.narrate('Zhang Bao and his cronies scattered. Yang Xiong, free at last, ran after them, and the stranger went after him to help. Dai Zong and Yang Lin, who had watched it all, followed the stranger, and caught him at the corner.');
      s.despawn('yx', { leave: true });
      s.party(keep); s.setLeader('daizong');
      s.flag('ch11_brawled');
      await s.warp('jizhou_in', 21, 6, 'up');
    } }
  ]);
  WM.defEvents('jizhou_in', [
    { id: 'ch11_tavern', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_brawled') && !S2.has('ch11_brothers'); }, run: async function (s) {
      s.spawn('sx', 'shixiu', 22, 4, 'down');
      await s.say('daizong', 'You fight like a tiger, friend. Who are you?');
      await s.say('shixiu', 'Shi Xiu, from Jiankang. I learned the spear and staff as a boy, and I can\'t walk past an injustice without stepping in, so people call me the Daredevil Third Brother. I came north with my uncle to sell livestock. He died on the road, the money\'s gone, and I sell firewood to eat.');
      await s.say('daizong', 'Then don\'t sell firewood. Come to Liangshan, where a man like you can hold up his head. Here — ten taels, for now.');
      await s.say('shixiu', 'I\'d go. But how could a nobody like me get into Liangshan?');
      await s.narrate('There was a commotion in the street: Yang Xiong\'s men, looking for the man who had helped their master. Dai Zong and Yang Lin slipped out by the back.');
      s.despawn('sx');
      await s.narrate('Since Gongsun Sheng was not to be found, Dai Zong and Yang Lin went back to the Yinma River. Pei Xuan, Deng Fei and Meng Kang burned their stockade, and with all their men and carts went south, dressed as government troops, to Liangshan.');
      await s.joinMany(['yanglin', 'dengfei', 'mengkang', 'peixuan']);
      // Shi Xiu's story begins
      s.party(['shixiu']); s.setLeader('shixiu'); s.level('shixiu', 23); s.flag('protagonist', 'shixiu');
      await s.fadeOut(0.6);
      await s.warp('jizhou_in', 21, 6, 'up', { noFade: true });
      s.spawn('yx', 'yangxiong', 22, 4, 'down');
      await s.fadeIn(0.6);
      await s.say('yangxiong:smile', 'There you are! You saved my face today, friend. Who were the two men drinking with you?');
      await s.say('shixiu', 'Two travellers. They left.');
      await s.say('yangxiong', 'I have no brother. Will you be mine? I am twenty-nine.');
      await s.say('shixiu', 'And I am twenty-eight. Then you are my elder brother.');
      await s.narrate('So Yang Xiong and Shi Xiu swore brotherhood in the tavern. Yang Xiong took Shi Xiu home, to his wife Pan Qiaoyun and her father, Old Pan, who had been a butcher. Old Pan opened a butcher\'s shop in the front of the house, and Shi Xiu, who knew the trade, kept it.');
      s.despawn('yx', { leave: true });
      s.addParty('yangxiong'); s.level('yangxiong', 23); s.removeParty('yangxiong');
      s.flag('ch11_brothers');
      await s.warp('jizhou_in', 8, 7, 'up');
    } },
    { id: 'ch11_service', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_brothers') && WM.state.x < 15; }, run: async function (s) {
      await s.narrate('Two months went by. Then Old Pan held a service for the second anniversary of the death of Qiaoyun\'s first husband, Clerk Wang. The monks came from Baoen Temple.');
      s.spawn('qy', 'qiaoyun', 5, 7, 'right'); s.spawn('pr', 'peiruhai', 8, 6, 'left'); s.spawn('pg', 'pangong', 4, 6, 'right');
      await s.say('peiruhai:smile', 'Elder Sister! I have brought some fine incense, and some dates from the capital, for the service.');
      await s.say('qiaoyun:smile', 'Brother Pei, you shouldn\'t have. Come, sit.');
      await s.say('pangong', 'Brother Shi Xiu — that is Pei Ruhai. His master is my sworn godfather, so he calls my daughter "Elder Sister."');
      await s.narrate('All through the chanting, Shi Xiu watched. The monk\'s eyes kept going to Qiaoyun, and hers kept going to the monk; and when the other monks lost their places in the sutras because of it, the two of them only smiled.');
      await s.say('shixiu:angry', '(Brother Yang Xiong is on night duty in the prison tonight... This is not right.)');
      s.despawn('qy'); s.despawn('pr'); s.despawn('pg');
      s.flag('ch11_service');
      s.night(true);
      await s.narrate('Some nights later, in the fifth watch, Shi Xiu woke in the back room of the shop. In the dead-end lane behind the house a mendicant monk was striking a wooden fish and calling out to the dawn — every morning, in a lane where no one lived.');
      await s.say(null, '(Go out and see who it is.)');
    } }
  ]);
  WM.defEvents('jizhou_n', [
    { id: 'ch11_dawn', x: 1, y: 30, w: 8, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch11_service') && !S2.has('ch11_dawnseen'); }, run: async function (s) {
      s.spawn('hd', 'hudao', 3, 30, 'right'); s.spawn('pr', 'peiruhai', 8, 30, 'left');
      await s.say('hudao', '(tok... tok... tok...) "Save us from suffering, O Bodhisattva..."');
      await s.narrate('The back door opened. A man in a scarf slipped out — and Shi Xiu, from the shadow of the wall, saw the shaven head under it. It was Pei Ruhai. The wandering monk Hu Dao went off with him.');
      await s.move('pr', 'L5'); s.despawn('pr', { leave: true }); s.despawn('hd', { leave: true });
      await s.say('shixiu:angry', '(So that is the signal. When Brother is on duty, an incense table goes out by the back door. And at dawn Hu Dao beats his fish to wake the monk.)');
      s.night(false);
      s.flag('ch11_dawnseen');
      await s.say(null, '(Find Yang Xiong. He drinks at the tavern east of the main street.)');
    } }
  ]);
  WM.defEvents('jizhou_in', [
    { id: 'ch11_tell', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_dawnseen') && WM.state.x >= 16 && WM.state.x < 27; }, run: async function (s) {
      s.spawn('yx', 'yangxiong', 22, 4, 'down');
      await s.say('shixiu', 'Brother. Every time you are on duty at night, Pei Ruhai of Baoen Temple comes into your house. I saw him go out of the back door this morning with my own eyes. Don\'t be hasty. Tomorrow say you are on duty, and come back at the third watch, and we\'ll take him together.');
      await s.say('yangxiong:angry', '...So that\'s it. Tomorrow, then.');
      s.despawn('yx', { leave: true });
      s.music('sad');
      await s.narrate('But that evening Yang Xiong was called before the prefect, and came home drunk, and in his drink he cursed his wife and let slip that he knew. In the night she wept and told him another story: that his sworn brother, Shi Xiu, had made advances to her, and that she had said nothing for fear of what it would do to him.');
      await s.narrate('In the morning Yang Xiong told Old Pan to pull down the counters of the butcher\'s shop. When Shi Xiu came back from buying pigs, the shop was gone.');
      await s.say('shixiu:sad', '(I see. She has got her word in first. If I argue, it only shames my brother. I will settle the accounts and go.)');
      s.flag('ch11_expelled');
      await s.narrate('Shi Xiu handed Old Pan the account book, packed his bundle, and took a room at a lodging house nearby. But he did not leave Jizhou.');
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
      await s.fadeOut(1);
      s.despawn('hd');
      await s.narrate('In the morning, a porridge seller found two dead men in the lane: the monk Pei Ruhai, and the wandering monk Hu Dao, with a knife beside him. The prefect\'s men examined the bodies and ruled that the two monks had quarrelled and killed each other, and closed the case. All Jizhou talked of nothing else. But the clothes of both monks were missing.');
      s.night(false);
      s.flag('ch11_proof');
      await s.fadeIn(1);
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
      s.despawn('qy', { leave: true }); s.despawn('ye', { leave: true });
      await s.narrate('Yang Xiong killed the maid Ying\'er there among the tombs, and then he killed his wife, Pan Qiaoyun.');
      await s.fadeIn(1);
      await s.say('yangxiong:sad', 'Brother... what now? I am a murderer, and I can\'t go back to the city.');
      await s.say('shixiu', 'I have a road for us. Dai Zong of Liangshan gave me ten taels and told me to come up the mountain. We\'ll go to Liangshan.');
      s.spawn('sq', 'shiqian', 20, 3, 'left');
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
      s.despawn('ky');
      await s.narrate('Shi Qian went out to the back. When he came in, he had a rooster under his arm, already plucked — the inn\'s own bird, that crowed the hour every dawn. He boiled it, and the three of them ate it.');
      s.spawn('ky', 'innkeep', 7, 6, 'up');
      await s.say('innkeep:angry', 'Where is our rooster? You\'ve eaten the cock that crows for the dawn!');
      await s.say('shixiu', 'Don\'t shout. How much was it worth? We\'ll pay.');
      await s.say('innkeep:angry', 'Pay? That bird tells the hour! You can\'t pay for that with less than ten taels! ...You\'re Liangshan bandits, the three of you. I\'ll take you to the village!');
      await s.say('shixiu:angry', 'Liangshan heroes, are we? And if we were, would you take us anywhere?');
      s.despawn('ky');
      await s.battle('ch11_inn', { bg: 'town' });
      await s.narrate('Three or four hands came running in with clubs, and went down again. Shi Xiu took a burning brand from the kitchen and set fire to the thatch, and the three ran out into the night.');
      s.flag('ch11_fire');
      await s.warp('zhuinn', 14, 13, 'down');
    } }
  ]);
  WM.defEvents('zhuinn', [
    { id: 'ch11_pursuit', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch11_fire'); }, run: async function (s) {
      s.tint('fire');
      await s.narrate('The inn went up in flames. Before they had gone two li, torches came after them from every side — a hundred, two hundred men of the Zhu Village, with hooked poles.');
      await s.battle('ch11_pursuit', { bg: 'night', rounds: 4 });
      await s.narrate('Yang Xiong and Shi Xiu cut down the men in front. But in the dark, from the grass beside the road, two long hooks shot out and caught Shi Qian, and dragged him into the ditch.');
      s.removeParty('shiqian');
      await s.say('shixiu:sad', 'Shi Qian! ...There are too many. Brother, we have to go — we\'ll come back for him!');
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
      await s.narrate('The first messenger came back alone: the Zhu family would only hand Shi Qian to the prefecture. Li Ying wrote a second letter in his own hand, sealed it with his own seal, and sent Du Xing with it.');
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
      await s.narrate('Li Ying rode out with three hundred men to the Zhu Family Village. Zhu Biao came out to meet him on a white horse.');
      s.level('liying', 25);
      await s.duel('liying_zhubiao', { hero: 'liying', canLose: true });
      await s.narrate('Li Ying spurred after him. Zhu Biao twisted round in the saddle and shot. The arrow struck Li Ying in the arm, and he fell from his horse.');
      s.lie('ly');
      await s.say('yangxiong:angry', 'Brother Shi Xiu — at them!');
      await s.battle('ch11_riders', { bg: 'field', rounds: 3 });
      await s.narrate('Yang Xiong and Shi Xiu charged with their swords. Yang Xiong slashed Zhu Biao\'s horse across the rump, and Zhu Biao fled back to his village. Du Xing carried his master home.');
      s.despawn('ly', { leave: true }); s.despawn('zb', { leave: true });
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
