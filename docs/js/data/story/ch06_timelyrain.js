// Chapter 6 — "Timely Rain" (novel chapters 20–23).
// Liu Tang brings Chao Gai's gold; Song Jiang kills Yan Poxi; Tang Niu'er and Zhu Tong let him go;
// at Chai Jin's manor he trips over Wu Song's shovel of coals.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('yanpo', 'Old Mother Yan', { skin: '#e0a880', hair: '#b0b0a8', hairStyle: 'woman', body: '#5a3a4a', trim: '#c8b890', dress: true, face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('yanpoxi', 'Yan Poxi', { skin: '#f6e2cc', hairStyle: 'woman', body: '#c8507a', trim: '#f0d8a0', dress: true, build: 'slim', face: 'narrow', eyes: 'sharp', flower: '#f07090', lips: '#c03040' }, { face: true });
  WM.npc('tangniuer', 'Tang Niu\'er', { skin: '#c8905e', hairStyle: 'headband', band: '#7a5a3a', body: '#6a6a4a', trim: '#4a3a2a', face: 'round', eyes: 'round' }, { face: true });
  WM.npc('songtaigong', 'Song Taigong', { skin: '#e0a880', hair: '#d0d0c8', hairStyle: 'scarf', band: '#2a2a2a', beard: 'long', beardColor: '#e0e0d8', body: '#5a3a2a', trim: '#c8b890', eyes: 'narrow', face: 'round' }, { face: true });
  WM.npc('oldwang', 'Old Wang the Soup-Seller', { skin: '#d8a070', hair: '#c0c0b8', hairStyle: 'topknot', beard: 'short', beardColor: '#d0d0c8', body: '#6a5a4a', trim: '#a89070' }, { face: true });
  var IT = WM.data.items;
  IT.chaoletter = { id: 'chaoletter', name: 'Chao Gai\'s Letter', type: 'key', price: 0, desc: 'A letter of thanks from Chao Gai of Liangshan, kept in Song Jiang\'s document pouch.', order: 600 };

  WM.data.chapters[6].begin = async function (s) {
    await s.chapter(6);
    s.party(['songjiang']); s.level('songjiang', 14); s.setLeader('songjiang');
    WM.state.chars.songjiang.equip.body = 'robe'; WM.state.chars.songjiang.equip.head = 'cap';
    s.flag('protagonist', 'songjiang');
    WM.unlock('yuncheng', 'dongxi');
    await s.warp('yuncheng', 21, 18, 'down', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[6].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 5; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle');
    WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou', 'yanmen', 'wutai', 'peach', 'waguan', 'kaifeng', 'boarforest', 'chaimanor', 'cangzhou', 'zhugui', 'daming', 'shijie', 'huangni', 'erlong');
    ['wuyong', 'gongsunsheng', 'linchong', 'liutang', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'duqian', 'songwan', 'zhugui', 'baisheng'].forEach(function (id) { S.recruit(id, 16); });
    await WM.data.chapters[6].begin(s);
  };

  WM.defEvents('yuncheng', [
    { id: 'ch6_liutang', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 6; }, run: async function (s) {
      s.spawn('liutang', 'liutang', 25, 19, 'left');
      await s.narrate('One evening, as Song Jiang came out of the county office, he noticed a big man in a broad hat who kept glancing at him from under the brim and following at a distance. Song Jiang turned into a side lane, and the man followed and bowed to him.');
      await s.move('liutang', 'L3');
      await s.say('liutang', 'Clerk Song! Don\'t you remember me? Liu Tang — from Chao Gai\'s manor. The brothers on Liangshan sent me with a letter, and a hundred taels of gold, to thank you for saving our lives.');
      await s.say('songjiang:shock', 'You came into town? Your face is on the wanted posters! Come — up to the tavern, quickly.');
      await s.narrate('In a private room of a small tavern Song Jiang read Chao Gai\'s letter. The gold he would not take: "My brothers need it more than I do. They are starting a new life." Only when Liu Tang begged did he take a single bar, and he put it, with the letter, into the document pouch at his belt.');
      await s.give('chaoletter', 1);
      await s.say('songjiang', 'Tell the brothers I am grateful. And go now — before the gates close. Don\'t stop for anything.');
      s.despawn('liutang', { leave: true });
      await s.narrate('It was a bright moonlit night. As Song Jiang walked home, a voice called out to him from behind: "Clerk Song! I\'ve been looking for you everywhere!"');
      s.spawn('yanpo', 'yanpo', 22, 22, 'up');
      await s.move('yanpo', 'U3');
      await s.narrate('Months before, Song Jiang had given Old Mother Yan the money to bury her husband, and in gratitude she had made her daughter, Yan Poxi, his concubine. He had set them up in a house in the town. But he cared little for women, and seldom went there — and the young woman had taken up with his clerk, Zhang Wenyuan.');
      await s.say('yanpo', 'You haven\'t come to see my daughter in ten days! She\'s pining away! Come, come — tonight you\'re coming home with me, and I won\'t hear a word against it.');
      await s.say('songjiang', '...Very well. Just for a little while.');
      s.despawn('yanpo');
      s.flag('ch6_yan');
      await s.warp('yuncheng_in', 34, 7, 'up');
    } }
  ]);
  WM.defEvents('yuncheng_in', [
    { id: 'ch6_yanhouse', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch6_yan') && WM.state.x >= 29 && WM.state.x <= 40; }, run: async function (s) {
      s.spawn('yanpo', 'yanpo', 32, 6, 'right'); s.spawn('poxi', 'yanpoxi', 36, 4, 'down');
      s.night(true);
      await s.say('yanpo:smile', 'Daughter! Look who\'s here! Your Third Brother Song!');
      await s.say('yanpoxi', '...Oh. Him.');
      await s.narrate('Yan Poxi had been waiting for Zhang Wenyuan. When she saw it was Song Jiang, she went cold, and sat with her back to him. The old woman fussed with wine and dishes. Song Jiang drank a cup or two in silence.');
      await s.narrate('At last the old woman locked them in together and went downstairs. Song Jiang sat on the stool all night in his clothes, and Yan Poxi lay facing the wall. Neither spoke a word. At the fifth watch, Song Jiang got up, washed his face, and went out without a word — and in his anger, he left his document pouch hanging on the bedpost.');
      s.despawn('yanpo'); s.despawn('poxi');
      s.night(false);
      await s.warp('yuncheng', 36, 15, 'down');
      s.spawn('wang', 'oldwang', 34, 16, 'right');
      await s.say('oldwang:smile', 'Clerk Song! Up so early? Here, have a bowl of hot herb soup, on the house.');
      await s.say('songjiang', 'Thank you, Old Wang. ...I promised you money for a coffin. Wait, let me get it for you — it\'s in my pouch...');
      await s.emote('player', '!');
      await s.say('songjiang:shock', '(My pouch! The pouch with Chao Gai\'s letter in it — I left it in her room!)');
      s.despawn('wang');
      await s.move('player', 'U1', { run: true });
      await s.warp('yuncheng_in', 34, 7, 'up', { fade: 0.25 });
      s.spawn('poxi', 'yanpoxi', 37, 5, 'left');
      await s.say('yanpoxi:smile', 'Looking for something, Third Brother?');
      await s.say('songjiang', 'Give me my pouch. It\'s mine.');
      await s.say('yanpoxi:smile', 'Your pouch... and this letter in it? From Chao Gai, the bandit chief of Liangshan Marsh? And a bar of gold? "To our benefactor Song Jiang"... My, my. You\'re a friend of robbers, Third Brother.');
      await s.say('songjiang', '...What do you want?');
      await s.say('yanpoxi', 'Three things. First, give me back the paper that made me your woman, and write that you\'ll let me marry Zhang Wenyuan. Second, all the clothes and jewels you\'ve given me are mine. Third — the hundred taels of gold Liangshan sent you. All of it.');
      await s.say('songjiang', 'The first two, yes. But the gold — I took only one bar. I sent the rest back.');
      await s.say('yanpoxi:angry', '"The cat that\'s caught the fish doesn\'t give it back." You expect me to believe you turned down a hundred taels from bandits? Give me the gold, or tomorrow morning I take this letter to the magistrate.');
      await s.say('songjiang', 'I don\'t have it! Give me three days, and I\'ll sell what I own and get it for you —');
      await s.say('yanpoxi:angry', 'Three days! And by then you\'d have me dead. Do you take me for a fool? No. Tomorrow I go to the court!');
      s.music('tense');
      await s.narrate('Song Jiang grabbed for the pouch, and she clutched it to her breast. As they struggled, the small knife in the pouch fell out on the bed. Song Jiang snatched it up. "Murder! Black Song Jiang is murdering me!" she screamed. The word put the thought into his head. Rage overcame him.');
      s.sfx('slash'); await s.shake(4, 0.4);
      await s.fadeOut(0.6, '#600');
      s.lie('poxi');   // dead on the bed
      s.take('chaoletter', 1);
      await s.narrate('Song Jiang took the letter from the pouch and burned it in the lamp. Then he sat down, and waited for the dawn.');
      await s.fadeIn(0.6);
      s.spawn('yanpo', 'yanpo', 34, 8, 'up');
      await s.say('yanpo:shock', '...What was that noise? ...Daughter?');
      await s.say('songjiang:sad', 'Your daughter was insolent to me. I have killed her.');
      await s.say('yanpo:sad', '...She was a bad girl, Clerk. I won\'t blame you. But who will support me now?');
      await s.say('songjiang', 'I will look after you, as long as you live. You have my word.');
      await s.say('yanpo', 'Then... then come with me now to Wang\'s shop for a coffin, before anyone wakes.');
      s.despawn('yanpo');
      await s.warp('yuncheng', 22, 9, 'down');
      s.spawn('yanpo', 'yanpo', 21, 10, 'right'); s.spawn('tang', 'tangniuer', 25, 11, 'left');
      await s.say('yanpo:angry', 'Murderer! Help! Here is the murderer! Seize him!');
      await s.narrate('At the gate of the county office the old woman seized Song Jiang\'s collar and shrieked for the constables. But the townspeople all loved Song Jiang, and no one would lay a hand on him. Then Tang Niu\'er, a ginger-seller Song Jiang had often helped, pushed through the crowd.');
      await s.say('tangniuer:angry', 'Let him go, you old hag!');
      s.sfx('hit');
      await s.narrate('Tang Niu\'er knocked the old woman\'s hands loose, and Song Jiang slipped away into the crowd. For his trouble Tang Niu\'er was dragged before the magistrate in Song Jiang\'s place.');
      s.despawn('yanpo'); s.despawn('tang', { leave: true });
      s.flag('ch6_fled');
      WM.unlock('songfarm');
      await s.say(null, '(Song Jiang\'s family farm lies south-west of the town.)');
    } }
  ]);
  WM.defEvents('songfarm', [
    { id: 'ch6_home', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch6_fled'); }, run: async function (s) {
      s.spawn('qing', 'songqing', 15, 16, 'down');
      await s.say('songqing:shock', 'Brother! You\'re white as a ghost. What\'s happened?');
      await s.say('songjiang:sad', 'Qing, I\'ve killed Yan Poxi. The constables will be here before nightfall. Is the cellar still under the Buddha hall?');
      await s.say('songqing', 'Father had it dug for days like this. Go! I\'ll tell them you haven\'t been home in months.');
      s.despawn('qing');
      s.flag('ch6_hide');
      await s.say(null, '(Hide in the cellar beneath the Buddha hall, north-east of the house.)');
    } }
  ]);
  WM.defEvents('songfarm_in', [
    { id: 'ch6_cellar', x: 21, y: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch6_hide'); }, run: async function (s) {
      await s.fadeOut(0.6);
      await s.narrate('Song Jiang lifted the board beneath the altar and climbed down into the darkness of the cellar. Above him he heard horses, and voices: the constables Zhu Tong and Lei Heng had come with the warrant, and were searching the farm.');
      s.spawn('zhutong', 'zhutong', 21, 5, 'down');
      s.place('player', 21, 7, 'up');
      await s.fadeIn(0.6);
      await s.narrate('The board lifted. A lamp shone down. It was Zhu Tong, alone.');
      await s.say('zhutong', 'Brother Song. I thought you\'d be here. Your father told me about this cellar once, after too much wine. I sent Lei Heng to search the front, and came myself.');
      await s.say('zhutong:concerned', 'This is no safe place — if I could guess it, others will. Where will you go?');
      await s.say('songjiang', 'I have thought of three places. Lord Chai Jin of Cangzhou. The Kong family at White Tiger Mountain in Qingzhou. And Hua Rong, the deputy commander of Qingfeng Fort, my sworn brother.');
      await s.say('zhutong', 'Chai Jin first. His iron writ protects anyone under his roof. Go tonight. I will tell the magistrate you have fled the county, and Lei Heng will say the same.');
      await s.say('songjiang', 'Zhu Tong... You let Chao Gai go, and now me. How can I ever repay you?');
      await s.say('zhutong:smile', 'Go. That\'s payment enough.');
      s.despawn('zhutong');
      s.flag('ch6_tochai');
      s.addParty('songqing'); s.level('songqing', 12);
      WM.unlock('chaimanor');
      await s.narrate('That night Song Jiang said farewell to his father, and set out with his younger brother Song Qing for Lord Chai Jin\'s manor at Cangzhou, far to the north-east.');
    } }
  ]);
  WM.defEvents('chaimanor', [
    { id: 'ch6_chai', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch6_tochai'); }, run: async function (s) {
      s.spawn('chaijin', 'chaijin', 17, 21, 'down');
      await s.move('chaijin', 'D2', { run: true });
      await s.say('chaijin:smile', 'Song Gongming! Timely Rain! I have longed to meet you for years — I dreamed of it! What wind has blown you to my door?');
      await s.say('songjiang', 'An ill wind, Lord Chai. I have killed a woman, and I am a fugitive.');
      await s.say('chaijin', 'Then you are among friends. Even if you had robbed the Imperial treasury, I could hide you. Come in. Tonight we drink.');
      s.despawn('chaijin');
      s.night(true);
      await s.narrate('Lord Chai feasted them until late in the night. Song Jiang, needing to relieve himself, went out along the dark corridor of the east wing. At the corner a man sat hunched over a shovel of glowing coals, warming himself, shaking with fever.');
      await s.warp('chaimanor', 10, 12, 'right');
      s.spawn('wusong', 'wusong', 12, 12, 'left');
      await s.move('player', 'R1');
      s.sfx('fire');
      await s.narrate('Song Jiang, a little drunk, did not see him in the dark, and trod on the handle of the shovel. The coals flew up into the man\'s face.');
      await s.say('wusong:angry', 'What dog\'s turtle-spawn —! You want to die?!');
      await s.narrate('The man leapt up, seized Song Jiang by the collar, and raised a fist like a hammer.');
      s.spawn('lamp', 'servant', 9, 12, 'right');
      await s.say('servant:shock', 'Stop! Stop! This is the master\'s honoured guest, Clerk Song!');
      await s.say('wusong:concerned', '"Clerk Song"? Which Clerk Song?');
      await s.say('servant', 'Song Jiang of Yuncheng! Timely Rain!');
      await s.say('wusong:shock', '...Song Jiang? Timely Rain Song Gongming? ...You — you are Song Jiang?');
      await s.say('songjiang', 'I am.');
      await s.narrate('The big man dropped to his knees at once and kowtowed. "I have eyes, and did not see Mount Tai in front of me! Forgive me, brother!"');
      await s.say('wusong', 'I am Wu Song, the second son of my family, from Qinghe county. A year ago I struck a man in a drunken quarrel and thought I\'d killed him, so I fled here to Lord Chai. Then I heard he lived after all. I meant to go home, and I caught this fever. I\'ve been waiting for it to pass.');
      await s.say('songjiang:smile', 'Then come, sit with us and drink. A hero\'s fever goes the moment he meets a friend.');
      s.despawn('lamp', { leave: true }); s.despawn('wusong');
      s.night(false);
      await s.fadeOut(1);
      await s.narrate('Song Jiang and Wu Song became sworn brothers, with Song Jiang as the elder, and Wu Song stayed at Chai Jin\'s side, recovered from his fever, for many days. At last he took his leave to go home to his elder brother in Qinghe county. Song Jiang and Song Qing walked with him five li, then ten, unwilling to part, and at an inn by the road they drank once more.');
      await s.warp('chaimanor', 17, 25, 'up', { noFade: true });
      s.spawn('wusong', 'wusong', 18, 24, 'down');
      await s.fadeIn(1);
      await s.say('wusong', 'Brother, go back now. A thousand li of seeing off still ends in parting.');
      await s.say('songjiang', 'Take this silver for the road. And Wu Song — when you are home, take care of yourself. You have a temper.');
      await s.say('wusong:smile', 'Brother Song. If ever you need me, I will come.');
      s.despawn('wusong', { leave: true });
      s.flag('ch6_done');
      await s.endChapter();
      if (WM.data.chapters[7].begin) await WM.data.chapters[7].begin(s);
    } }
  ]);
})();
