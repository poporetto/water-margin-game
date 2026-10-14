// Chapter 4 — "The Blue-Faced Beast" (novel chapters 12–13, and the start of 16).
// Yang Zhi is refused by Gao Qiu, sells his heirloom sabre, kills Niu Er, is exiled to Daming,
// wins the contest against Zhou Jin and fights Suo Chao to a standstill, and is given the birthday gifts to escort.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('niuer', 'Niu Er', { skin: '#c88a6a', hairStyle: 'wild', hair: '#2a1a10', beard: 'stubble', body: '#6a4a3a', trim: '#3a2a1a', chest: true, build: 'big', face: 'square', eyes: 'round', fierce: true }, { face: true });
  WM.npc('zhoujin', 'Zhou Jin', { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#6a6a72', tassel: '#c8302a', beard: 'short', body: '#5a2a2a', trim: '#d8b36a', weapon: 'spear', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('liangzhongshu', 'Liang Zhongshu', { skin: '#f0c49a', hairStyle: 'futou', beard: 'long', beardColor: '#2a2a2a', body: '#8a1a1a', trim: '#e8c060', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('kfinnkeep', 'Innkeeper', { skin: '#d8a070', hairStyle: 'scarf', band: '#5a2a1a', body: '#6a3a2a', trim: '#c8b890', beard: 'mustache', build: 'big' }, { face: true });

  WM.data.duels.yz_niuer = {
    hero: 'yangzhi', foe: 'niuer', bg: 'town', heroHp: 300, heroAtk: 50, foeHp: 160, foeAtk: 26,
    intro: [['foe:angry', 'Kill a man without blood on the blade? Then kill me! Go on — or give me the sabre!'], ['hero:angry', 'Let go of me!']],
    lines: {
      attack: ['Give it here!', 'Hand it over, you blue-faced freak!', 'Mine!'],
      wild: ['I\'ll take it off your corpse!', 'I\'ll smash your skull!', 'Nobody refuses Niu Er!'],
      defend: ['Eh? You won\'t dare...', 'Go on then, try it!', 'Ha... you\'re all talk.']
    },
    win: [['hero:sad', '...It is done.']], lose: [['foe:smile', 'Ha! Mine now!']]
  };
  WM.data.duels.yz_zhoujin = {
    hero: 'yangzhi', foe: 'zhoujin', bg: 'plains', heroHp: 320, heroAtk: 44, foeHp: 300, foeAtk: 36,
    intro: [['liangzhongshu', 'Spears tipped with felt and dipped in lime. Whoever bears the most white spots loses.'], ['foe', 'A branded convict! I\'ll paint you white from head to foot.']],
    lines: {
      attack: ['Here comes my spear!', 'Hah! Take this!', 'One spot for you!'],
      wild: ['I\'ll cover you in white!', 'The Governor is watching — all or nothing!', 'Down you go!'],
      defend: ['Let\'s see your spear-work first.', 'I\'m waiting...', 'Careful...']
    },
    win: [['liangzhongshu', 'Zhou Jin is white as a ghost, and Yang Zhi has a single spot on his shoulder! Yang Zhi wins!']], lose: [['foe:smile', 'Covered in white, convict!']]
  };
  WM.data.duels.yz_suochao = {
    hero: 'yangzhi', foe: 'suochao', bg: 'plains', heroHp: 420, heroAtk: 42, foeHp: 420, foeAtk: 42, drawAfter: 4,
    intro: [['foe:angry', 'Zhou Jin was sick today, that\'s all! Let me fight him, Excellency — to the death if you like!'], ['hero', 'As the Governor wishes.']],
    lines: {
      attack: ['Hyaah!', 'The Impatient Vanguard strikes!', 'Here!'],
      wild: ['My golden axe will split you!', 'Charge!', 'Everything — now!'],
      defend: ['Hm! You\'re good...', 'Come, come!', 'Show me again!']
    },
    draw: [['liangzhongshu', 'Enough! Enough, both of you! Bring them both here!']]
  };

  WM.data.chapters[4].begin = async function (s) {
    await s.chapter(4);
    s.party(['yangzhi']); s.level('yangzhi', 11); s.setLeader('yangzhi');
    WM.state.chars.yangzhi.equip.head = 'leathercap'; WM.state.chars.yangzhi.equip.body = 'quilted';
    s.flag('protagonist', 'yangzhi');
    s.give('sabre', 1, true);
    WM.state.gold = 20;
    WM.state.flags.lsWangLun = true;
    await s.warp('kaifeng_in', 40, 8, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[4].debugStart = async function (s) {
    S.newGame(); ['pro_done', 'ch1_done', 'ch2_done', 'ch3_done'].forEach(function (f) { s.flag(f); });
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng', 'boarforest', 'chaimanor', 'cangzhou', 'zhugui');
    await WM.data.chapters[4].begin(s);
  };

  WM.defEvents('kaifeng_in', [
    { id: 'ch4_inn', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 4; }, run: async function (s) {
      await s.narrate('Yang Zhi came to the Eastern Capital with the silver Wang Lun had returned to him, and spent it all on bribes to the clerks of the Bureau of Military Affairs, to have his case reopened and his post restored. At last his petition reached the Grand Marshal himself.');
      await s.warp('kaifeng_gao', 5, 8, 'up', { noFade: true });
      s.spawn('gaoqiu', 'gaoqiu', 5, 4, 'down');
      await s.say('gaoqiu:angry', 'Ten officers were sent to fetch the flower-rock for the Emperor\'s garden. Nine brought their loads to the capital. You alone lost yours — and then you ran away, and hid, and now an amnesty brings you crawling back, asking for your post? Even if there were an amnesty, you deserve no office. Get out!');
      s.despawn('gaoqiu');
      await s.warp('kaifeng_in', 40, 7, 'up', { noFade: true });
      s.spawn('keep', 'kfinnkeep', 37, 4, 'down');
      await s.say('yangzhi:sad', '(Wang Lun was right. And now I have nothing. Not one coin for the inn, nor for the road home.)');
      await s.say('kfinnkeep:concerned', 'Officer Yang, you owe for three weeks. I can\'t feed you on promises.');
      await s.say('yangzhi:sad', '(All I have left is the sabre my ancestors handed down. ...So be it. I will sell it, and go home.)');
      s.despawn('keep', { leave: true });
      s.flag('ch4_sell');
      await s.narrate('He tied a straw tag to the sabre\'s hilt — the sign of a thing for sale — and went out to the Tianhan Bridge, where the crowds were thickest, to sell it.');
      await s.say(null, '(The Tianhan Bridge crosses the river on the west side of the city.)');
    } }
  ]);
  WM.defEvents('kaifeng', [
    { id: 'ch4_bridge', x: 9, y: 20, w: 4, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch4_sell'); }, idle: { c1: 'If you\'re selling, officer, sell quickly and go home. This bridge belongs to the Tiger.', c2: 'It\'s a fine blade... but three thousand strings? Nobody on this bridge has that kind of money.', c3: 'Three thousand strings for a sabre! What does it do, cut gold?' },
      run: async function (s) {
      s.place('player', 10, 22, 'down');
      s.spawn('c1', 'villager', 8, 21, 'right'); s.spawn('c2', 'woman', 12, 21, 'left'); s.spawn('c3', 'merchant', 13, 22, 'left');
      await s.wait(0.5);
      await s.say('villager:shock', 'Run! Hide! The Tiger\'s coming!');
      s.despawn('c1'); s.despawn('c2'); s.despawn('c3');
      await s.narrate('The crowd scattered like chickens before a hawk. Yang Zhi turned and saw a great black lout lurching down the street, half drunk. This was Niu Er, the "Hairless Tiger," the most notorious bully in the capital. Even the magistrates gave him a wide berth.');
      s.spawn('niuer', 'niuer', 10, 26, 'up');
      await s.move('niuer', 'U3');
      await s.say('niuer', 'You! What do you want for that cleaver?');
      await s.say('yangzhi', 'It is my family\'s heirloom sabre. Three thousand strings.');
      await s.say('niuer:angry', 'Three thousand? For a kitchen knife? I can buy one for thirty coppers that cuts meat and bean curd just as well! What\'s so precious about yours?');
      await s.say('yangzhi', 'It has three virtues. It cuts copper and iron without notching its edge. It severs a hair blown against it. And it kills a man without a drop of blood on the blade.');
      await s.say('niuer', 'Prove it! Copper first.');
      await s.narrate('Niu Er got twenty copper coins from a nearby shop and stacked them on the bridge rail. Yang Zhi rolled back his sleeve, raised the sabre, and with a single stroke cut the stack in two. The onlookers, watching from a safe distance, cheered.');
      await s.say('niuer', '...Hair, then.');
      await s.narrate('Yang Zhi took a few hairs from his own head and blew them at the edge. They fell in two. The crowd cheered louder.');
      await s.say('niuer:smile', 'And the third? "Kills a man without blood"? Show me. Kill somebody.');
      await s.say('yangzhi', 'In the capital? Am I to murder someone on a whim? Kill a dog, then, and I\'ll show you.');
      await s.say('niuer:angry', 'You said a man, not a dog! I don\'t believe you. Give me the sabre — I\'ll test it myself.');
      await s.say('yangzhi:angry', 'If you want to buy it, bring the money.');
      await s.say('niuer:angry', 'Money? I haven\'t any. And I want the sabre!');
      await s.duel('yz_niuer');
      s.lie('niuer');
      s.music('sad');
      await s.narrate('Niu Er grabbed at him and swung his fists. Yang Zhi, in a rage, struck once, then again, and Niu Er fell dead on the bridge. And true enough, there was no blood on the blade.');
      await s.say('yangzhi:sad', 'Neighbours! I killed this bully, and I will not run and leave you to answer for it. Come with me to the prefecture, all of you, and bear witness.');
      s.despawn('niuer', { leave: true });
      s.take('sabre', 1);
      await s.narrate('The people of the capital, who had hated Niu Er, went with him to the prefecture and spoke for him, and many sent him food and money in prison. The prefect, knowing that the dead man had been a menace to all, reduced the charge. Yang Zhi was given twenty strokes, tattooed on the face, and exiled to the Northern Capital, Daming. His sabre was confiscated.');
      s.flag('ch4_exiled');
      WM.unlock('daming');
      await s.warp('daming', 28, 42, 'up');
    } }
  ]);
  WM.defEvents('daming', [
    { id: 'ch4_arrive', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch4_exiled'); }, run: async function (s) {
      await s.narrate('The governor of Daming, Liang Zhongshu, was the son-in-law of the Prime Minister Cai Jing, and the most powerful man in the north. When the escorts brought Yang Zhi before him, he recognised him at once: he had known the young officer in the capital.');
      await s.warp('daming_in', 12, 10, 'up', { noFade: true });
      s.spawn('liang', 'liangzhongshu', 12, 5, 'down');
      await s.say('liangzhongshu', 'Yang Zhi! A descendant of the Yang generals, branded and exiled for killing a ruffian. What a waste of a man. I will keep you here at my yamen.');
      await s.say('yangzhi', 'I am grateful, Excellency.');
      await s.say('liangzhongshu', 'I would like to give you a commission at once. But the officers will grumble that I favour a convict. Tomorrow I review the troops at the drill ground. Show us what you can do, and no one will be able to say a word.');
      s.despawn('liang');
      s.flag('ch4_contest');
      await s.say(null, '(The drill ground is in the north-east corner of the city.)');
    } },
    { id: 'ch4_drill', x: 44, y: 14, w: 11, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch4_contest'); }, run: async function (s) {
      s.spawn('liang', 'liangzhongshu', 49, 7, 'down');
      s.spawn('zhoujin', 'zhoujin', 50, 11, 'down');
      s.spawn('suochao', 'suochao', 46, 9, 'down');
      s.spawn('s1', 'soldier', 45, 12, 'right'); s.spawn('s2', 'soldier', 53, 12, 'left');
      s.place('player', 49, 13, 'up');
      await s.say('liangzhongshu', 'Deputy Commander Zhou Jin! Come forward. And Yang Zhi, the convict. Let us see who deserves Zhou Jin\'s post.');
      await s.duel('yz_zhoujin');
      await s.narrate('Then the Governor ordered them to contest with the bow. Zhou Jin shot three arrows at Yang Zhi, one after another. The first Yang Zhi knocked aside with his bow, the second he dodged by leaning back in the saddle, and the third he caught in his hand.');
      await s.narrate('Then it was Yang Zhi\'s turn. He shot only once — and the arrow struck Zhou Jin in the left shoulder and knocked him from his horse.');
      await s.say('liangzhongshu:smile', 'Splendid! Yang Zhi shall have Zhou Jin\'s post!');
      await s.duel('yz_suochao');
      await s.narrate('For more than fifty bouts Suo Chao\'s battle-axe and Yang Zhi\'s spear met and parted, and neither could gain the advantage. The soldiers on both sides shouted themselves hoarse. "In all our years in the army," the old officers said, "we have never seen a fight like this one."');
      await s.say('liangzhongshu:smile', 'Both are heroes! Both shall be made captains of my guard!');
      await s.say('suochao:smile', 'Yang Zhi. You\'re the first man who\'s ever stood up to my axe. Let\'s drink.');
      await s.say('yangzhi:smile', 'Gladly, brother Suo.');
      s.despawn('liang', { leave: true }); s.despawn('zhoujin', { leave: true }); s.despawn('suochao', { leave: true }); s.despawn('s1', { leave: true }); s.despawn('s2', { leave: true });
      await s.fadeOut(1);
      await s.narrate('From then on Yang Zhi was in high favour. Liang Zhongshu kept him near, and he served diligently from morning to night. Spring passed, and summer came, and the fifth day of the fifth month — the Dragon Boat Festival.');
      await s.warp('daming_in', 12, 10, 'up', { noFade: true });
      s.spawn('liang', 'liangzhongshu', 12, 5, 'down');
      await s.fadeIn(1);
      await s.say('liangzhongshu', 'Yang Zhi. On the fifteenth of the sixth month it is my father-in-law\'s birthday. Every year I send the Prime Minister gifts — gold, pearls, jade — worth a hundred thousand strings. Last year the whole load was stolen on the road by bandits, and the thieves were never found.');
      await s.say('liangzhongshu', 'This year I want you to escort it to the Eastern Capital. I will give you ten carts and an armed escort, with banners reading "Birthday Gifts for the Prime Minister."');
      await s.say('yangzhi', 'Excellency... with banners and carts, every bandit between here and the capital will know what we carry. On the road there are the Purple Gold Mountain, the Twin Dragon Mountain, the Peach Blossom Mountain, the Umbrella Cover Mountain, the Yellow Earth Ridge, the White Sand Bank, the Wild Cloud Ford... all bandit country. Ten thousand men could not guard it.');
      await s.say('yangzhi', 'Let me pack it in loads, and have eleven strong soldiers carry them on poles, disguised as porters. I and they will go as merchants, quietly. That way we may get through.');
      await s.say('liangzhongshu:smile', 'Excellent. It shall be as you say. And my wife\'s steward, and two officers from the household, will go with you.');
      await s.say('yangzhi:concerned', '(The steward and the household officers... they will not take orders from me. This will be trouble.)');
      s.despawn('liang', { leave: true });
      s.flag('ch4_done');
      await s.endChapter();
      if (WM.data.chapters[5].begin) await WM.data.chapters[5].begin(s);
    } }
  ]);
})();
