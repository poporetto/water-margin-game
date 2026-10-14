// Chapter 3 — "Panther Head" (novel chapters 7–12).
// Gao Yanei covets Lin Chong's wife; Lu Qian betrays him; the sword and the White Tiger Hall; exile;
// Wild Boar Forest; Chai Jin and Instructor Hong; Cangzhou, the snowstorm and the Mountain God's temple;
// Zhu Gui's tavern; Wang Lun's demand; the fight with Yang Zhi.
'use strict';
(function () {
  var L = WM.mapLib, S = WM.S;

  WM.npc('gaoyanei', 'Gao Yanei', { skin: '#f6e2cc', hairStyle: 'scarf', band: '#c8302a', body: '#d870a0', trim: '#f0d080', build: 'slim', face: 'long', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('linwife', 'Lady Zhang', { skin: '#f6e2cc', hairStyle: 'woman', body: '#5a7aaa', trim: '#e8e0f0', dress: true, build: 'slim', face: 'narrow', eyes: 'normal', pin: '#d8d8e8' }, { face: true });
  WM.npc('zhangjiaotou', 'Instructor Zhang', { skin: '#e0a880', hair: '#c0c0b8', hairStyle: 'topknot', beard: 'long', beardColor: '#d0d0c8', body: '#4a4a5a', trim: '#c8c0a0', eyes: 'narrow' }, { face: true });
  WM.npc('luqian', 'Lu Qian', { skin: '#e8b48a', hairStyle: 'scarf', band: '#2a2a3a', body: '#4a3a5a', trim: '#c8b890', face: 'long', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('fuan', 'Fu An', { skin: '#e8b48a', hairStyle: 'scarf', band: '#5a2a1a', body: '#6a4a3a', trim: '#c8b890', face: 'narrow', eyes: 'narrow' }, { face: true });
  WM.npc('swordseller', 'Sword Seller', { skin: '#c8905e', hairStyle: 'headband', band: '#3a3a3a', body: '#3a4a3a', trim: '#a89070', beard: 'full', weapon: 'sword', build: 'big' }, { face: true });
  WM.npc('dongchao', 'Dong Chao', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#8a3a2a', beard: 'stubble', weapon: 'pole', face: 'square', eyes: 'narrow' }, { face: true });
  WM.npc('xueba', 'Xue Ba', { skin: '#d8a070', hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#8a3a2a', weapon: 'pole', face: 'narrow', eyes: 'narrow' }, { face: true });
  WM.npc('hongjiaotou', 'Instructor Hong', { skin: '#e0a880', hairStyle: 'scarf', band: '#5a1a1a', beard: 'short', body: '#6a2a2a', trim: '#d8b36a', weapon: 'staff', face: 'square', eyes: 'sharp', brows: 'angled' }, { face: true });
  WM.npc('warden', 'Camp Warden', { skin: '#e0a880', hairStyle: 'futou', beard: 'mustache', body: '#3a3a5a', trim: '#c8b890', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('lixiaoer', 'Li Xiaoer', { skin: '#d8a070', hairStyle: 'headband', band: '#e8e0d0', body: '#6a5a4a', trim: '#e8e0d0', face: 'round', eyes: 'round' }, { face: true });
  WM.npc('lixiaoerwife', 'Li Xiaoer\'s Wife', { skin: '#e8b48a', hairStyle: 'woman', body: '#7a6a5a', trim: '#e8e0d0', dress: true, face: 'round' }, { face: true });
  WM.npc('overseer', 'Overseer of the Depot', { skin: '#c8905e', hairStyle: 'scarf', band: '#2a2a2a', beard: 'short', body: '#4a4a3a', trim: '#8a6a4a', face: 'narrow', eyes: 'narrow' }, { face: true });
  WM.npc('oldsoldier', 'Old Soldier', { skin: '#c8905e', hair: '#b8b8b0', hairStyle: 'topknot', beard: 'short', beardColor: '#c0c0b8', body: '#5a5a4a', trim: '#8a6a4a' }, { face: true });
  WM.npc('wanglun', 'Wang Lun', { skin: '#f0c49a', hairStyle: 'scarf', band: '#1a1a2a', beard: 'mustache', body: '#3a4a6a', trim: '#e8e0d0', build: 'slim', face: 'long', eyes: 'narrow', brows: 'angled' }, { face: true });
  WM.npc('gaoofficer2', 'Officer of the Residence', { skin: '#d8a070', hairStyle: 'futou', body: '#2a3a5a', trim: '#d8b36a' }, { face: true });

  WM.enemy('luqian_foe', 'Lu Qian', 9, WM.hum(WM.data.npcs.luqian.look), { hp: 1.4, atk: 0.5, exp: 200, gold: 100, boss: true });
  WM.enemy('fuan_foe', 'Fu An', 8, WM.hum(WM.data.npcs.fuan.look), { hp: 1.0, atk: 0.48, exp: 160, gold: 60, boss: true });
  WM.enemy('overseer_foe', 'Overseer', 8, WM.hum(WM.data.npcs.overseer.look), { hp: 1.0, atk: 0.48, exp: 160, gold: 40, boss: true, drops: [['beef', 1]] });
  // Lin Chong bursts out of the temple on three men who think he is burning to death: they are taken by surprise
  WM.data.troops.ch3_temple = { enemies: ['fuan_foe', 'luqian_foe', 'overseer_foe'], bg: 'snow', boss: true, noRun: true };

  WM.data.duels.lin_hong = {
    hero: 'linchong', foe: 'hongjiaotou', bg: 'snow', heroHp: 340, heroAtk: 46, foeHp: 260, foeAtk: 34,
    intro: [['foe:angry', 'A branded convict calls himself an instructor of the Imperial Guard? Pick up a staff, if you dare!'], ['hero', 'If Lord Chai permits it. Excuse my clumsiness.']],
    lines: {
      attack: ['Come! Come!', 'My staff will teach you manners!', 'Have at you, convict!'],
      wild: ['I\'ll break you in one blow!', 'Sweep the field!', 'Down you go — all my strength!'],
      defend: ['Hm, he\'s cautious...', 'Let\'s see you try.', 'I\'m waiting for you, prisoner.']
    },
    win: [['foe:shock', 'Aaagh — my shin!'], ['hero', 'Forgive me, Instructor.']], lose: [['foe:smile', 'Ha! The Imperial Guard must be desperate!']]
  };
  WM.data.duels.lin_yangzhi = {
    hero: 'linchong', foe: 'yangzhi', bg: 'snow', heroHp: 420, heroAtk: 40, foeHp: 420, foeAtk: 40, drawAfter: 4,
    intro: [['foe:angry', 'Bandit! Where are you taking my load?'], ['hero', 'It\'s mine now, unless you can take it back.']],
    lines: {
      attack: ['Have at you!', 'My sabre is waiting!', 'Hah!'],
      wild: ['The sabre of the Yang family!', 'I\'ll cut you in two!', 'All or nothing!'],
      defend: ['You\'re no common bandit...', 'Careful — this one knows his spear.', 'Show me again.']
    },
    draw: [['wanglun', 'Stop! Stop, both of you!']], lose: [['foe', 'Back to your mountain, bandit!']]
  };

  WM.data.chapters[3].begin = async function (s) {
    await s.chapter(3);
    s.party(['linchong']); s.level('linchong', 9); s.setLeader('linchong');
    WM.state.chars.linchong.equip.body = 'quilted'; WM.state.chars.linchong.equip.head = 'cap';
    s.flag('protagonist', 'linchong');
    await s.warp('kaifeng_in', 44, 18, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[3].debugStart = async function (s) {
    S.newGame(); ['pro_done', 'ch1_done', 'ch2_done'].forEach(function (f) { s.flag(f); });
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng');
    await WM.data.chapters[3].begin(s);
  };

  // ---------------- Kaifeng ----------------
  WM.defEvents('kaifeng_in', [
    { id: 'ch3_yue', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 3; }, run: async function (s) {
      s.spawn('gaoyanei', 'gaoyanei', 43, 15, 'down'); s.spawn('wife', 'linwife', 42, 16, 'right');
      s.spawn('lackey1', 'servant', 45, 15, 'left'); s.spawn('lackey2', 'servant', 41, 15, 'right');
      await s.say('gaoyanei:smile', 'Come up the stairs with me, lady. There\'s a fine view of the whole temple from the pavilion.');
      await s.say('linwife:angry', 'In broad daylight, in a temple, you dare to stop a respectable woman? Let me pass!');
      await s.move('player', 'U2', { run: true });
      await s.narrate('Lin Chong seized the young man by the shoulder and spun him round, his fist raised — and saw who it was. Gao Yanei, the adopted son of Grand Marshal Gao Qiu. His hand would not come down.');
      await s.say('gaoyanei', 'Lin Chong? What business is it of yours?');
      await s.say('servant:concerned', '(whispering) Instructor, don\'t you know who this is? It\'s the Yanei! He didn\'t know she was your wife. Let it go!');
      await s.narrate('Gao Yanei and his lackeys sauntered out of the temple, laughing. Lin Chong stood shaking with rage, then took his wife by the arm and turned to go.');
      s.despawn('gaoyanei'); s.despawn('lackey1'); s.despawn('lackey2');
      s.spawn('luzhishen', 'luzhishen', 44, 18, 'up');
      s.spawn('zhangsan', 'zhangsan', 43, 18, 'up');
      await s.move('luzhishen', 'U1', { run: true });
      await s.say('luzhishen:angry', 'Brother! Where is he? I\'ve come to help you thrash him!');
      await s.say('linchong:sad', 'It was the Marshal\'s son, brother. He didn\'t know she was my wife... It ended without blows. I\'m in his father\'s service. If I struck him, the Marshal would destroy me.');
      await s.say('luzhishen:angry', 'You\'re afraid of the Marshal? I\'m not! If I meet that whelp, I\'ll give him three hundred strokes of my staff!');
      await s.say('linchong', 'Brother, you\'ve been drinking. Let me take you home.');
      await s.say('luzhishen', '...All right. But if he troubles you again, you send for me.');
      s.despawn('luzhishen'); s.despawn('zhangsan'); s.despawn('wife');
      await s.fadeOut(0.8);
      await s.narrate('Gao Yanei, back at the residence, could neither eat nor sleep for thinking of Lin Chong\'s wife. His crony Fu An saw it, and went to Lu Qian, who had grown up with Lin Chong, and was his oldest friend.');
      await s.narrate('Lu Qian listened to the plan, and agreed to it. If the Marshal\'s son was pleased, the Marshal would reward him.');
      s.flag('ch3_luqian');
      await s.warp('kaifeng_in', 16, 6, 'down', { noFade: true });
      s.spawn('wife', 'linwife', 15, 4, 'down');
      s.spawn('luqian', 'luqian', 17, 7, 'up');
      await s.fadeIn(0.8);
      await s.say('luqian:smile', 'Brother Lin! You look gloomy. Come and drink with me. The Fan Tower has a new wine from the south. It will do you good.');
      await s.say('linchong', '...Very well. Wife, I\'ll be back before dark.');
      await s.say('linwife', 'Don\'t drink too much.');
      s.despawn('luqian');   // he goes on ahead to the Fan Tower; Lady Zhang stays at home
      s.idle('wife', 'Go and drink with Brother Lu, then — but come home before dark. I\'ll keep the lamp lit.');
      await s.say(null, '(The Fan Tower is on the north side of the city, by the palace.)');
    } },
    { id: 'ch3_fan', x: 17, y: 17, w: 3, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_luqian'); }, run: async function (s) {
      s.spawn('luqian', 'luqian', 17, 16, 'down');
      await s.moveTo('player', 17, 17);                    // sit down across from Lu Qian
      s.face('player', 'up');
      await s.say('luqian:smile', 'Drink, brother, drink! Here — another cup.');
      await s.say('linchong:sad', 'What use is a man\'s talent, Lu Qian, if he must serve a man like Gao Qiu? I swallow insult after insult.');
      await s.say('luqian', 'Don\'t think like that. The Marshal values you. He just doesn\'t know his son\'s ways. Drink.');
      await s.say('linchong', '...I must step out a moment.');
      s.despawn('luqian');
      s.spawn('jiner', 'jiner', 18, 18, 'left');           // she runs in at the door and stops beside him
      s.face('player', 'right');
      await s.say('jiner:shock', 'Master! Master, I\'ve been looking everywhere! A man came to the house saying you had fainted at Lu Qian\'s, and the Mistress went with him — and it was the Yanei waiting there! He\'s got her upstairs in Lu Qian\'s house!');
      await s.say('linchong:angry', 'Lu Qian!!');
      s.despawn('jiner');
      s.flag('ch3_rush');
      await s.say(null, '(Lu Qian\'s house is on the north bank, east of the market.)');
    } },
    { id: 'ch3_luqianhouse', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_rush') && WM.state.map === 'kaifeng_in' && WM.state.x >= 23 && WM.state.x <= 32 && WM.state.y < 10; }, run: async function (s) {
      s.spawn('gaoyanei', 'gaoyanei', 25, 3, 'down'); s.spawn('wife', 'linwife', 29, 4, 'down');
      await s.say('linwife:angry', 'In the age of peace and order, how can you hold a respectable woman prisoner?!');
      await s.say('linchong:angry', 'Wife! Open the door!');
      s.sfx('hit'); await s.shake(4, 0.3);
      // he goes out of the back window, not the door Lin Chong is breaking down
      await s.emote('gaoyanei', '!');
      s.face('gaoyanei', 'up'); await s.jump('gaoyanei', 10);
      s.hide('gaoyanei'); s.despawn('gaoyanei');
      await s.narrate('Gao Yanei heard Lin Chong\'s voice and lost his nerve. He pushed open the back window and jumped out over the wall. When Lin Chong burst in, there was only his wife, white-faced but unharmed.');
      await s.say('linwife:sad', 'He... he didn\'t touch me. Jin\'er came in time.');
      await s.narrate('Lin Chong smashed everything in Lu Qian\'s house to pieces. Then he took his wife home, put a sharp knife in his belt, and went looking for Lu Qian. For three days he waited outside Lu Qian\'s door. But Lu Qian had hidden himself in the Marshal\'s residence and did not come out.');
      s.flag('ch3_sword');
      await s.narrate('On the fourth day Lin Chong was walking with Lu Zhishen, who had come to cheer him, when they passed a big man in a soldier\'s cap standing at the corner with a straw sign stuck in a sword-hilt — the sign of a thing for sale.');
      await s.warp('kaifeng', 20, 33, 'right');
    } }
  ]);
  WM.defEvents('kaifeng', [
    { id: 'ch3_sword', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_sword') && WM.state.chapter === 3; }, run: async function (s) {
      s.spawn('seller', 'swordseller', 23, 33, 'left'); s.spawn('lu', 'luzhishen', 20, 34, 'right');
      await s.say('swordseller', 'Such a fine sword, and nobody in all this great capital knows its worth! What a pity, what a pity...');
      await s.say('linchong', '(Let me see it.)');
      await s.narrate('Lin Chong drew the blade. It shone like frost and snow, and it was keen enough to cut a hair blown against it. A precious sword indeed.');
      await s.say('linchong', 'How much?');
      await s.say('swordseller', 'Three thousand strings. But I\'d take two thousand.');
      await s.say('linchong', 'It\'s worth two thousand. But there\'s no one here who\'ll pay it. A thousand, and it\'s mine.');
      await s.say('swordseller', '...I need the money. A thousand it is.');
      await s.give('precioussword', 1);
      s.despawn('seller');
      await s.say('luzhishen:concerned', 'A fine blade, brother. But a man doesn\'t sell a sword like that on a street corner for nothing. Be careful.');
      s.despawn('lu');
      await s.fadeOut(0.8);
      await s.narrate('Lin Chong could not take his eyes from the sword all evening. "Gao Qiu has a precious sword too, they say, and he will show it to no one. One day I\'ll compare mine with his."');
      await s.narrate('The very next morning two officers came to his door. "The Marshal has heard you bought a fine sword. He wants to compare it with his own. Bring it to the residence at once."');
      s.flag('ch3_summoned');
      await s.warp('kaifeng', 10, 10, 'up', { noFade: true });
      s.spawn('o1', 'gaoofficer2', 9, 11, 'up'); s.spawn('o2', 'gaoofficer2', 11, 11, 'up');
      await s.fadeIn(0.8);
      await s.say('gaoofficer2', 'This way, Instructor. The Marshal is waiting in the inner hall.');
      s.despawn('o1'); s.despawn('o2');
    } }
  ]);
  WM.defEvents('kaifeng_gao', [
    { id: 'ch3_whitetiger', x: 11, y: 8, w: 3, h: 1, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_summoned'); }, run: async function (s) {
      s.spawn('o1', 'gaoofficer2', 15, 8, 'left');
      await s.say('gaoofficer2', 'Wait here a moment, Instructor. I\'ll tell the Marshal you\'ve come.');
      s.despawn('o1');
      await s.move('player', 'R4');
      await s.wait(0.6);
      await s.narrate('Lin Chong waited, sword in hand. A long time passed and no one came. He looked about him, and above the doorway of the hall he saw a blue tablet with four green characters: White Tiger Hall.');
      await s.say('linchong:shock', '(The White Tiger Hall! This is where the Marshal holds his councils of war. No one may enter here without being summoned — and certainly not with a blade! Why did they bring me here?)');
      s.spawn('gaoqiu', 'gaoqiu', 19, 5, 'down');
      s.spawn('g1', 'gaoofficer', 17, 6, 'down'); s.spawn('g2', 'gaoofficer', 21, 6, 'down');
      s.music('tense');
      await s.say('gaoqiu:angry', 'Lin Chong! I did not summon you. How dare you walk into the White Tiger Hall with a naked sword in your hand? You have come to murder me!');
      await s.say('linchong:shock', 'Your Excellency, your own officers brought me here to compare swords!');
      await s.say('gaoqiu:angry', 'Officers? What officers? Guards! Seize him!');
      s.sfx('hit'); await s.shake(3, 0.4);
      await s.narrate('From both sides of the hall more than twenty guards rushed in and threw Lin Chong to the floor. The sword was taken from him. And the two "officers" who had brought him were nowhere to be found.');
      s.take('precioussword', 1);
      s.despawn('gaoqiu'); s.despawn('g1'); s.despawn('g2');
      await s.fadeOut(1);
      await s.narrate('Gao Qiu sent him to the Kaifeng prefecture to be tried for the attempted murder of a minister — a crime punishable by death. But a clerk named Sun Ding, an upright man, persuaded the prefect that the charge did not hold: who goes to murder a Marshal by first buying a sword in the street?');
      await s.narrate('Even the prefect could not ignore it. Lin Chong was sentenced to twenty strokes, his face was tattooed with the mark of a criminal, and he was exiled to the prison camp at Cangzhou. A seven-and-a-half-catty cangue was locked around his neck.');
      s.flag('ch3_exiled');
      await s.warp('kaifeng_in', 21, 15, 'up', { noFade: true });
      s.spawn('zhang', 'zhangjiaotou', 20, 14, 'right'); s.spawn('wife', 'linwife', 22, 14, 'left');
      s.spawn('dong', 'dongchao', 18, 17, 'up'); s.spawn('xue', 'xueba', 23, 17, 'up');
      await s.fadeIn(1);
      await s.say('linchong:sad', 'Father-in-law. I have been unjustly condemned. Who knows if I will ever come back alive? Your daughter is young. I will not have her wait for me and waste her youth, and I will not have Gao Yanei pester her because of me. I have written a letter of divorce. Let her marry again.');
      await s.say('linwife:sad', 'Husband! I have done nothing wrong — why would you cast me off?');
      await s.say('zhangjiaotou:sad', 'Son-in-law, don\'t say such things. You have had bad luck, nothing more. I will keep my daughter at home, and send you money every month. Come back to us.');
      await s.say('linchong:sad', 'Thank you, father. But if you won\'t take the letter, I swear I won\'t live to see Cangzhou. Let her be free.');
      await s.narrate('Lin Chong\'s wife wept until she fainted. Instructor Zhang carried her home. And the two escorts, Dong Chao and Xue Ba, led Lin Chong out of the city.');
      s.despawn('zhang'); s.despawn('wife');
      await s.narrate('That night, at a tavern, a man in a cloth cap paid the two escorts ten taels of gold. "This is from Lu Qian, by order of the Marshal. Lin Chong is not to reach Cangzhou. Somewhere quiet on the road — finish him, and bring back the brand cut from his face as proof."');
      WM.state.chars.linchong.equip.acc = 'cangue';
      WM.state.chars.linchong.equip.body = null;
      S.restore('linchong');
      await s.narrate('On the road the escorts drove him without pity. At an inn one night, Xue Ba poured boiling water into a basin, "to bathe your feet, brother," and pushed Lin Chong\'s feet into it. They blistered and swelled. In the morning they gave him new straw sandals, and by noon his feet were running with blood.');
      await s.narrate('On the fourth day they came to the Wild Boar Forest, the most dangerous stretch of the road between the capital and Cangzhou: a tangle of trees full of mist, where countless men had been murdered.');
      s.despawn('dong'); s.despawn('xue');
      WM.unlock('boarforest');
      await s.warp('boarforest', 2, 13, 'right');
    } }
  ]);

  // ---------------- Wild Boar Forest ----------------
  WM.defEvents('boarforest', [
    { id: 'ch3_boar', x: 18, y: 8, w: 8, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_exiled'); }, run: async function (s) {
      s.spawn('dong', 'dongchao', 20, 11, 'right'); s.spawn('xue', 'xueba', 21, 12, 'up');
      s.place('player', 22, 10, 'down');
      await s.say('xueba', 'We\'ve walked too far — I\'m worn out. Let\'s rest here. But you\'ll run off while we sleep. We\'ll have to tie you to the tree.');
      await s.say('linchong', 'I\'m a man of honour. I won\'t run.');
      await s.say('dongchao', 'How would we know that? Hold still.');
      await s.narrate('They tied Lin Chong hand and foot to the great tree, and the cangue with him. Then they picked up their staffs.');
      await s.say('xueba', 'Don\'t blame us, Instructor. Lu Qian gave the order, on the Marshal\'s word. We\'re only messengers. Next year on this day, it will be one year since you died.');
      await s.say('linchong:sad', '...Heaven. Is this how it ends?');
      await s.move('xue', 'U1');
      s.sfx('wind'); await s.wait(0.3);
      s.spawn('lu', 'luzhishen', 25, 8, 'left');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('As Xue Ba raised his staff, there was a thunderclap from behind the tree, and an iron staff came flying out and struck the staff from his hands. A huge monk leapt from the undergrowth: "I\'ve been listening in the woods for a long time!"');
      await s.move('lu', 'L3', { run: true });
      await s.say('luzhishen:angry', 'You dogs! I\'ll smash you both to pulp!');
      await s.say('linchong', 'Brother, no! Don\'t kill them — they were only doing as they were told by Gao Qiu and Lu Qian. If you kill them, you\'ll be a murderer too.');
      await s.say('luzhishen:angry', '...Hmph. For my brother\'s sake, I\'ll spare your miserable lives.');
      await s.say('luzhishen', 'After you left the city, I heard what Lu Qian had arranged, and I followed you all the way. When they poured boiling water on your feet at the inn, I nearly killed them there. I\'ve been watching every step since.');
      await s.say('luzhishen', 'I\'m taking you all the way to Cangzhou myself. You two — carry his bundle. Move!');
      s.despawn('dong'); s.despawn('xue'); s.despawn('lu');
      s.addParty('luzhishen'); s.level('luzhishen', Math.max(10, WM.state.chars.linchong.lv));
      s.flag('ch3_saved');
      await s.notice('Lu Zhishen joined the party.', { auto: 1.6 });
      await s.say('luzhishen', 'Let\'s go. The road east leads out of the forest.');
    } },
    { id: 'ch3_pine', x: 33, y: 12, w: 3, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_saved'); }, idle: { dong: '(Dong Chao will not meet your eyes.) We were only following orders, Instructor. Lu Qian\'s orders.', xue: 'Is the monk still behind us? ...Don\'t tell him I asked.' },
      run: async function (s) {
      s.spawn('dong', 'dongchao', 31, 13, 'right'); s.spawn('xue', 'xueba', 31, 15, 'right');
      await s.narrate('For seventeen or eighteen days Lu Zhishen escorted them. When Cangzhou was only seventy li away, and the road was busy with people, he stopped.');
      await s.say('luzhishen', 'From here on the road\'s too busy for any mischief. I\'ll leave you. You two — look at that pine.');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('He swung his staff and struck a pine tree as thick as a man\'s waist. It split two inches deep and crashed to the ground.');
      await s.say('luzhishen:angry', 'If either of you has any more ideas, your heads are not as hard as this pine. Brother, take care of yourself.');
      await s.say('linchong', 'Brother... I\'ll never be able to repay you.');
      await s.say('dongchao:shock', '(...He split a pine with one blow.)');
      s.despawn('dong'); s.despawn('xue');
      s.removeParty('luzhishen');
      s.flag('ch3_luleft');
      WM.unlock('chaimanor');
      await s.narrate('So the two escorts led Lin Chong on, a great deal more politely than before. Near Cangzhou they stopped at a wine shop, and the keeper told them of a great lord nearby, Lord Chai Jin of the Later Zhou royal house, who welcomed every exile and wanderer under heaven.');
      await s.warp('chaimanor', 17, 25, 'up');
    } }
  ]);

  // ---------------- Chai Jin's manor ----------------
  WM.defEvents('chaimanor', [
    { id: 'ch3_chai', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_luleft'); }, run: async function (s) {
      s.spawn('chaijin', 'chaijin', 17, 21, 'down');
      s.spawn('h1', 'hunter', 16, 20, 'down'); s.spawn('h2', 'hunter', 18, 20, 'down');
      await s.move('chaijin', 'D2');
      await s.say('chaijin:smile', 'Is it — Instructor Lin Chong, of the Imperial Guard? I have long heard your name! Who would have thought you\'d come to my door like this? Come in, come in!');
      await s.say('linchong', 'Lord Chai... your name is known to everyone under heaven. I am only a branded convict.');
      await s.say('chaijin', 'Nonsense. The heroes of the rivers and lakes are my guests whatever their fortunes. Bring wine! Kill a sheep!');
      s.despawn('h1'); s.despawn('h2'); s.despawn('chaijin');
      await s.warp('chaimanor_in', 10, 8, 'up');
      s.spawn('chaijin', 'chaijin', 10, 4, 'down');
      s.spawn('hong', 'hongjiaotou', 13, 6, 'left');
      await s.say('hongjiaotou:angry', 'Lord Chai, why fuss over a convict? Every vagabond who wants a free meal calls himself an arms instructor.');
      await s.say('chaijin', 'Instructor Hong is my martial arts teacher. Instructor Lin, he means no harm. But perhaps... the two of you might cross staves, to settle it.');
      await s.say('linchong', '...I dare not. I am a prisoner.');
      await s.say('hongjiaotou:angry', 'He dares not, because he can\'t!');
      await s.say('chaijin', 'Escorts — here are ten taels. Unlock the Instructor\'s cangue for a little while; I\'ll answer for it. And here is a silver ingot of twenty-five taels: whichever of you wins, it is his.');
      WM.state.chars.linchong.equip.acc = null; S.restore('linchong');
      s.despawn('hong'); s.despawn('chaijin');
      await s.warp('chaimanor', 17, 15, 'up');
      s.spawn('chaijin', 'chaijin', 13, 13, 'right'); s.spawn('hong', 'hongjiaotou', 17, 13, 'down');
      await s.duel('lin_hong');
      await s.narrate('Hong swung his staff down at Lin Chong\'s head. Lin Chong stepped back, and as the staff came down, swept his own across and caught Hong on the shin. Hong\'s staff flew from his hands and he went down flat on his back, to the laughter of the whole household. He crawled away in shame and left the manor.');
      s.despawn('hong');
      await s.say('chaijin:smile', 'Splendid! Splendid! The silver is yours, Instructor.');
      await s.gold(25);
      await s.say('chaijin', 'I will write letters to the warden and the guards at the Cangzhou camp, so they will treat you well. If ever you need anything — anything — come to me.');
      s.despawn('chaijin');
      WM.state.chars.linchong.equip.acc = 'cangue'; S.restore('linchong');
      WM.unlock('cangzhou');
      s.flag('ch3_tocangzhou');
      await s.narrate('After several days, Lin Chong took his leave, with the cangue locked back on his neck and Lord Chai\'s letters in his bundle, and went on to Cangzhou, a little to the north-east.');
    } }
  ]);

  // ---------------- Cangzhou ----------------
  WM.defEvents('cangzhou', [
    { id: 'ch3_camp', x: 9, y: 12, w: 3, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_tocangzhou'); }, run: async function (s) {
      await s.narrate('At the prison camp, every new convict received a hundred "welcoming strokes" unless he paid the guards. Lin Chong paid, and gave the warden Lord Chai\'s letter. The hundred strokes were "postponed on account of illness." He was given an easy post: keeping the Celestial King Hall, sweeping and burning incense.');
      s.flag('ch3_incamp');
      await s.narrate('One day as he walked in the town, someone called out behind him: "Master Lin! Is it you?"');
      s.spawn('lix', 'lixiaoer', 13, 15, 'up');
      await s.say('lixiaoer:smile', 'Master Lin! Don\'t you remember me? Li Xiaoer! In the capital I stole from my master, and you paid my debt and gave me money to leave the city. I came here and married, and now my wife and I keep a little tavern. What brings you here in a cangue?');
      await s.say('linchong:sad', 'Gao Qiu, Li Xiaoer. Gao Qiu brought me here.');
      await s.say('lixiaoer', 'Then you must come and eat at our tavern whenever you like. We\'ll wash your clothes, and mend them. It\'s the least we can do.');
      s.despawn('lix');
      s.flag('ch3_lixiaoer');
      await s.say(null, '(Li Xiaoer\'s tavern is on the south side of town, under the wine flag.)');
    } }
  ]);
  WM.defEvents('cangzhou_in', [
    { id: 'ch3_whisper', x: 29, y: 6, w: 3, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_lixiaoer'); }, run: async function (s) {
      s.spawn('lix', 'lixiaoer', 31, 4, 'down'); s.spawn('wife', 'lixiaoerwife', 32, 6, 'left');
      await s.say('lixiaoer:concerned', 'Master Lin, sit down, sit down. I\'ve been waiting for you — something odd happened yesterday.');
      await s.say('lixiaoer:concerned', 'Two men came in, dressed like officials, talking with the accent of the capital. They had me fetch the camp warden and the overseer of the guards, and the four of them sat in the back room drinking and whispering.');
      await s.say('lixiaoerwife:concerned', 'I listened at the door. I couldn\'t hear much — only "Gao Taiwei" — the Marshal — and one of them said, "Don\'t worry, it will all be finished in a day or two." One of them was a short man, pale, with no beard.');
      await s.say('linchong:angry', 'Short, pale, without a beard... Lu Qian! That dog has come all the way here to finish me. If I meet him, I\'ll cut him to pieces!');
      await s.say('lixiaoer:concerned', 'Master Lin, be careful. Don\'t do anything rash.');
      s.despawn('lix'); s.despawn('wife');
      await s.give('knife', 1);
      await s.narrate('Lin Chong went straight to the market and bought a sharp knife, which he carried at his waist. For three days he searched the streets and lanes of Cangzhou from morning till night. Nothing. Gradually his anger cooled.');
      await s.narrate('On the fourth day the warden called him in. "You have served well, and Lord Chai speaks for you. The old soldier who keeps the great fodder depot east of the town is leaving. You will take his place. It is easy work, and there\'s a little money in it from the farmers who deliver hay."');
      s.flag('ch3_fodder');
      s.weather('snow');
      await s.say('linchong', '(The fodder depot... east of the town.)');
    } }
  ]);

  // ---------------- the fodder depot and the Mountain God's temple ----------------
  WM.defEvents('fodder', [
    { id: 'ch3_depot', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_fodder'); }, run: async function (s) {
      s.spawn('old', 'oldsoldier', 27, 18, 'up');
      await s.say(null, '(It is the depth of winter. Dark clouds hang low and the snow falls without stopping.)');
      await s.move('player', 'R12');
      s.place('player', 27, 17, 'down'); s.faceEach('player', 'old');
      await s.say('oldsoldier', 'You\'re the new keeper? Here are the keys, and the tally of the stacks. The hut\'s old — mind the roof in this snow.');
      await s.say('oldsoldier:smile', 'If you want a drink, go east of here two or three li, past the old temple of the Mountain God, and there\'s a village with wine. Take my gourd. Keep warm.');
      s.despawn('old');
      await s.narrate('Lin Chong went into the hut. The wind howled through the cracked walls and the snow drifted in. "This place won\'t last the winter. I\'ll get some wine, and send for a builder tomorrow." He hung the gourd on his spear, locked the hut and set off through the snow.');
      s.flag('ch3_wine');
      await s.say(null, '(Go buy wine: out of the depot and up past the old temple to the north-west.)');
    } },
    { id: 'ch3_buywine', x: 3, y: 8, w: 6, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_wine'); }, run: async function (s) {
      await s.narrate('Lin Chong passed the old temple — "May the Mountain God protect me," he said, and bowed — and went on to the village, filled the gourd, ate some beef, and came back with the wind roaring and the snow falling thicker than before.');
      s.flag('ch3_collapsed');
      s.sfx('earth'); await s.shake(4, 0.6);
      await s.narrate('When he reached the depot, the hut had collapsed under the weight of the snow. "Heaven pities the honest man. If I had been inside, I would have been crushed. Where can I sleep tonight? The old temple of the Mountain God — I\'ll shelter there till dawn."');
    } }
  ]);
  WM.defEvents('fodder_in', [
    { id: 'ch3_temple', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_collapsed') && WM.state.map === 'fodder_in' && WM.state.x < 10; }, run: async function (s) {
      await s.narrate('There was no one in the temple. Lin Chong pushed a great stone against the door, spread his quilt, and sat drinking cold wine from the gourd. Then he heard a crackling outside, and saw through a crack in the door a red glow. The fodder depot was burning.');
      s.tint('fire'); s.sfx('fire');
      await s.say('linchong:shock', '(The depot! It\'s on fire!)');
      await s.narrate('He was reaching to pull the stone from the door when he heard footsteps in the snow outside, and voices. Three men had come to stand in front of the temple, to watch the fire.');
      await s.say('overseer:smile', '(outside) Wasn\'t that well done? I set fire to the hay at all four corners. He can\'t get out of that.');
      await s.say('luqian', '(outside) This time the Instructor is finished. The Marshal will be pleased. When the Yanei is well again, you\'ll both be rewarded.');
      await s.say('fuan:smile', '(outside) Even if he got out of the hut alive, burning the Imperial fodder depot is a capital crime. Either way, he\'s done.');
      await s.say('luqian', '(outside) Let\'s wait a little, then pick a few bones out of the ashes and take them back to the capital, so the Marshal and the Yanei know he\'s dead.');
      await s.say('linchong:angry', '(...Lu Qian. Fu An. The overseer. If the hut had not fallen in, I would be dead in that fire, by their hands.)');
      s.sfx('hit'); await s.shake(5, 0.4);
      await s.narrate('Lin Chong pulled the stone away, threw open the door, and stood in the snow with his spear in his hand. "Where are you going, you dogs?"');
      s.music('boss');
      await s.battle('ch3_temple', { bg: 'snow', music: 'boss' });
      s.spawn('luqian', 'luqian', 5, 7, 'up');   // at the temple door, in the snow
      await s.narrate('The overseer fell first. Fu An ran, and Lin Chong brought him down in a dozen strides. Lu Qian had gone only three or four paces before his legs gave way beneath him.');
      await s.say('luqian:shock', 'Brother! It wasn\'t my idea! The Marshal ordered it — how could I refuse?');
      await s.say('linchong:angry', 'You and I were friends from childhood. And you came all the way here to burn me alive. "How could you refuse?" You could have refused.');
      await s.narrate('Lin Chong killed Lu Qian there in the snow. He laid the three heads on the altar of the Mountain God, put on his white felt hat, drank the last of the cold wine, and walked out into the snow towards the east, leaving the depot burning behind him.');
      s.despawn('luqian');
      s.tint(null);
      s.flag('ch3_killed');
      WM.state.chars.linchong.equip.acc = null; S.restore('linchong');
      await s.narrate('Exhausted and half-frozen, he came to a farmhouse where the labourers were drinking round a fire. He begged for wine; they refused; he drove them out and drank it all, and then fell down drunk in the snow outside. The farmhands came back, tied him up and dragged him to their master\'s house — and their master was Lord Chai Jin.');
      await s.warp('chaimanor_in', 10, 7, 'up', { noFade: true });
      s.spawn('chaijin', 'chaijin', 10, 5, 'down');
      s.tint(null);
      await s.fadeIn(1);
      await s.say('chaijin:shock', 'Instructor Lin! Untie him, you fools! ...So it\'s true. The depot burned, and you killed three men. The whole of Cangzhou is out looking for you.');
      await s.say('linchong:sad', 'Lord Chai. I am a dead man in this world.');
      await s.say('chaijin', 'Not yet. In Shandong there is a marsh called Liangshan, eight hundred li of water, and on it a stronghold of bold fellows. The chief is Wang Lun, the Scholar in White, with Du Qian and Song Wan. They are friends of mine. I will give you a letter. Go to them.');
      await s.give('chailetter', 1);
      await s.say('chaijin', 'The checkpoints are watched. I\'ll go hunting tomorrow with my men, and you\'ll ride out among us in a hunter\'s coat. No guard will stop Chai Jin\'s hunting party.');
      s.despawn('chaijin');
      s.weather(null);
      WM.unlock('zhugui');
      s.flag('ch3_toliangshan');
      await s.narrate('So Lin Chong passed the checkpoint among Lord Chai\'s hunters, took leave of his benefactor, and set out alone on the road south to Liangshan Marsh. It was the depth of winter, and the snow was falling again.');
      await s.warp('world', 92, 23, 'down');
      await s.say(null, '(Liangshan Marsh lies to the south. Travellers bound for the stronghold ask at Zhu Gui\'s tavern on its shore.)');
    } }
  ]);

  // ---------------- Zhu Gui's tavern ----------------
  WM.defEvents('zhugui_in', [
    { id: 'ch3_zhugui', x: 5, y: 5, w: 5, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch3_toliangshan'); }, run: async function (s) {
      s.weather('snow');
      s.spawn('waiterZ', 'waiter', 3, 6, 'right');
      await s.say('waiter', 'Wine, sir? How much?');
      await s.say('linchong', 'Two catties. And boiled beef. ...Tell me, how far is it to Liangshan from here? Is there a boat?');
      await s.say('waiter', 'Only a few li across the water, but there\'s no road — only boats, and none would take you in this snow.');
      await s.narrate('Lin Chong drank alone, his heart heavy. He thought of how he had once been an instructor of the Imperial Guard, honoured in the capital, and now was a hunted criminal with nowhere to go. He called for a brush, and on the whitewashed wall he wrote:');
      await s.narrate('"I was born to be loyal and true; my name was known through all the capital. Like the floating weed I drift on the river and lakes; my fame once shook the land. But if one day my ambition is fulfilled, my power will shake the east of Mount Tai."');
      s.despawn('waiterZ');
      s.spawn('zhugui', 'zhugui', 8, 4, 'down');
      await s.say('zhugui', 'Lin Chong. You\'ve written your name on my wall, and the whole of Shandong is looking for you. You have courage.');
      await s.say('linchong:shock', '...Who are you?');
      await s.say('zhugui:smile', 'Zhu Gui, the Dry-Land Crocodile. I keep this tavern as a lookout for Liangshan. Travellers who are rich are robbed here, and travellers who are heroes are taken across the water. Lord Chai has written of you more than once.');
      await s.narrate('Zhu Gui went to the window that faced the lake, drew a bow, and shot a whistling arrow into the reeds. Soon a boat with several men came gliding out from the reeds to the landing.');
      s.despawn('zhugui');
      s.flag('ch3_boat');
      s.flag('lsWangLun');
      await s.warp('liangshan', 24, 40, 'up');
    } }
  ]);

  // ---------------- Liangshan under Wang Lun ----------------
  WM.defEvents('liangshan', [
    { id: 'ch3_arrive', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_boat'); }, run: async function (s) {
      s.weather('snow');
      s.spawn('zhugui', 'zhugui', 25, 40, 'up');
      await s.say('zhugui', 'This is Liangshan. The passes are guarded, and the hall is at the top. Come, the chiefs are waiting.');
      s.despawn('zhugui');
      await s.say(null, '(The Assembly Hall is at the top of the mountain.)');
    } }
  ]);
  WM.defEvents('liangshan_in', [
    { id: 'ch3_wanglun', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_boat') && !S2.has('ch3_head') && WM.state.x < 31 && WM.state.y < 17; }, run: async function (s) {
      s.spawn('wanglun', 'wanglun', 15, 5, 'down'); s.spawn('duqian', 'duqian', 13, 6, 'down'); s.spawn('songwan', 'songwan', 17, 6, 'down'); s.spawn('zhugui', 'zhugui', 19, 8, 'left');
      s.place('player', 16, 13, 'up');
      await s.move('player', 'U4');
      await s.say('zhugui', 'Brothers, this is Lin Chong, Arms Instructor of the Imperial Guard, with a letter from Lord Chai.');
      await s.say('wanglun', '(reading) "...an upright man, wronged by Gao Qiu..." Hm.');
      await s.say('wanglun:concerned', '(to himself) I am a failed scholar. Du Qian and Song Wan are no great fighters. If this Imperial Instructor stays, he\'ll see how little we are, and sooner or later he\'ll take the mountain from us...');
      await s.say('wanglun:smile', 'Instructor Lin, Lord Chai is our benefactor, and you are welcome. But our mountain is small — our grain is short and our houses few. We could not do you justice. Here are fifty taels of silver. Find a bigger stronghold elsewhere.');
      await s.say('zhugui', 'Brother, Lord Chai has done so much for us. If we turn away the man he sends, how will that look?');
      await s.say('duqian', 'We are short of good men, not of grain. Let him stay.');
      await s.say('songwan', 'If we send off a hero who comes to us, the world will laugh at Liangshan.');
      await s.say('wanglun', '...Very well. But if you want to join us, Instructor, you must bring a token of good faith.');
      await s.say('linchong', 'I can write, sir. Tell me what to write.');
      await s.say('wanglun', 'Not writing. Those who join a band like ours bring a head. Go down the mountain and kill a traveller, and bring his head to me within three days. Then we\'ll know you are one of us — and can\'t go back.');
      await s.say('linchong:sad', '...I will go.');
      s.despawn('wanglun'); s.despawn('duqian'); s.despawn('songwan'); s.despawn('zhugui');
      s.flag('ch3_head');
      await s.narrate('On the first day Lin Chong waited by the road with a guide from morning till dusk, and no traveller came by. On the second day a party of more than three hundred came down the road together; he dared not attack so many. On the third day, he went down in despair.');
      await s.warp('zhugui', 9, 18, 'down');
    } }
  ]);
  WM.defEvents('zhugui', [
    { id: 'ch3_yangzhi', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch3_head'); }, run: async function (s) {
      s.weather(null);
      s.spawn('guide', 'outlaw', 10, 17, 'down');
      await s.say('outlaw:concerned', 'Today\'s the last day, chief. If no one comes...');
      await s.wait(0.6);
      s.spawn('porter', 'servant', 9, 21, 'up');
      await s.move('porter', 'U1');
      await s.say('outlaw', 'There! A man with a load on a pole!');
      await s.move('player', 'D1', { run: true });
      await s.narrate('Lin Chong sprang out with his spear. The porter flung down his load and fled. Lin Chong was picking it up when a big man came striding up the road behind — a man with a blue birthmark on his face and a sabre in his hand.');
      s.despawn('porter');
      s.spawn('yangzhi', 'yangzhi', 9, 21, 'up');
      await s.move('yangzhi', 'U1');
      await s.duel('lin_yangzhi', { canLose: true });
      s.spawn('wanglun', 'wanglun', 13, 15, 'down'); s.spawn('duqian', 'duqian', 14, 15, 'down');
      await s.say('wanglun', 'Two such fighters! Thirty or forty bouts and neither gives an inch! Who are you, sir, with the blue face?');
      await s.say('yangzhi', 'Yang Zhi, a descendant of the three generations of the Yang generals, once an officer of the palace guard. I was sent to escort a load of flower-rock to the capital, and my boat capsized in a storm on the Yellow River. I dared not return, so I fled. Now there is an amnesty, and I am taking silver to the capital to buy back my post. That load is my silver.');
      await s.say('wanglun:smile', 'Yang Zhi! Then stay with us on Liangshan. Why go back to serve the men who ruined you?');
      await s.say('yangzhi', 'I thank you. But I have a family name to honour. I will not shame my ancestors by becoming an outlaw. Please return my load.');
      await s.narrate('Wang Lun saw that Yang Zhi would not stay, and thought it better to keep a check on Lin Chong than to have two such men on the mountain. He gave back the silver, feasted Yang Zhi for a day, and let him go on to the capital.');
      s.despawn('yangzhi'); s.despawn('wanglun'); s.despawn('duqian'); s.despawn('guide');
      await s.narrate('And Lin Chong was made the fourth chief of Liangshan, after Wang Lun, Du Qian and Song Wan — above Zhu Gui. But Wang Lun never trusted him, and Lin Chong never forgot it.');
      s.flag('ch3_done');
      await s.endChapter();
      if (WM.data.chapters[4].begin) await WM.data.chapters[4].begin(s);
    } }
  ]);
})();
