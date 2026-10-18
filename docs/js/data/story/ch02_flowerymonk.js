// Chapter 2 — "The Flowery Monk" (novel chapters 3–7).
// Lu Da kills Zheng the Butcher with three punches, takes the tonsure on Mount Wutai, wrecks it twice,
// beats Zhou Tong at Peach Blossom Village, burns Waguan Monastery with Shi Jin, and keeps the
// vegetable garden of the Xiangguo Monastery, where he meets Lin Chong.
'use strict';
(function () {
  var L = WM.mapLib, S = WM.S;

  // ---------------- people ----------------
  WM.npc('oldjin', 'Old Jin', { skin: '#d8a070', hair: '#c8c8c0', hairStyle: 'topknot', beard: 'short', beardColor: '#d0d0c8', body: '#5a5a4a', trim: '#a89070', eyes: 'narrow' }, { face: true });
  WM.npc('cuilian', 'Jin Cuilian', { skin: '#f6dcc4', hairStyle: 'woman', body: '#c86a7a', trim: '#f0e0c0', dress: true, build: 'slim', face: 'narrow', eyes: 'normal', flower: '#f0a0b0' }, { face: true });
  WM.npc('zhengtu', 'Zheng the Butcher', { skin: '#d8a070', hairStyle: 'scarf', band: '#5a1a1a', beard: 'full', body: '#e8e0d0', trim: '#8a3a2a', build: 'big', face: 'square', eyes: 'narrow', chest: true }, { face: true });
  WM.npc('innwaiter', 'Inn Boy', { skin: '#d8a070', hairStyle: 'headband', band: '#e8e0d0', body: '#6a5a4a', trim: '#3a3a3a', eyes: 'narrow' }, { face: true });
  WM.npc('zhaoyuanwai', 'Squire Zhao', { skin: '#f0c49a', hairStyle: 'scarf', band: '#3a2a4a', beard: 'mustache', body: '#4a3a6a', trim: '#d8b36a', face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('zhizhen', 'Abbot Zhizhen', { skin: '#e8b48a', hairStyle: 'bald', beard: 'long', beardColor: '#e8e8e0', body: '#b8302a', trim: '#e8c060', beads: true, face: 'long', eyes: 'narrow' }, { face: true });
  WM.npc('wutaimonk', 'Monk of Wutai', { skin: '#e8b48a', hairStyle: 'bald', body: '#7a6a4a', trim: '#c8a060', weapon: 'staff' }, { face: true });
  WM.npc('peddler', 'Wine Peddler', { skin: '#c8905e', hairStyle: 'hat', hatColor: '#a8905a', body: '#6a6a5a', trim: '#4a3a2a', weapon: 'pole' }, { face: true });
  WM.npc('liutaigong', 'Liu Taigong', { skin: '#e0a880', hair: '#d0d0c8', hairStyle: 'scarf', band: '#2a2a2a', beard: 'long', beardColor: '#e0e0d8', body: '#5a4a3a', trim: '#c8b890', eyes: 'narrow' }, { face: true });
  WM.npc('oldmonk', 'Old Monk', { skin: '#d8a070', hairStyle: 'bald', body: '#5a4a3a', trim: '#8a7a5a', build: 'slim', face: 'narrow', eyes: 'narrow' }, { face: true });
  WM.npc('cuidaocheng', 'Cui Daocheng', { skin: '#d8a070', hairStyle: 'bald', beard: 'full', body: '#3a2a2a', trim: '#8a6a3a', build: 'big', weapon: 'dao', face: 'square', eyes: 'fierce', fierce: true }, { face: true });
  WM.npc('qiuxiaoyi', 'Qiu Xiaoyi', { skin: '#e0b090', hairStyle: 'daoist', crown: '#3a3a3a', beard: 'short', body: '#2a3a2a', trim: '#8a3a2a', weapon: 'sword', face: 'long', eyes: 'sharp' }, { face: true });
  WM.npc('zhiqing', 'Abbot Zhiqing', { skin: '#f0c49a', hairStyle: 'bald', beard: 'short', beardColor: '#8a8a80', body: '#c8a040', trim: '#8a2a1a', beads: true, face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('zhangsan', 'Zhang San', { skin: '#d8a070', hairStyle: 'topknot', body: '#5a5a3a', trim: '#3a2a1a', beard: 'stubble', face: 'narrow', eyes: 'narrow' }, { face: true });
  WM.npc('lisi', 'Li Si', { skin: '#c8905e', hairStyle: 'headband', band: '#3a6a3a', body: '#4a6a4a', trim: '#2a2a1a', face: 'narrow', eyes: 'round' }, { face: true });
  WM.npc('jiner', 'Jin\'er', { skin: '#f6dcc4', hairStyle: 'woman', body: '#6a8a6a', trim: '#e8e0d0', dress: true, build: 'slim', face: 'round' }, { face: true });

  // ---------------- enemies, troops, duels ----------------
  WM.enemy('wutai_monk', 'Monk of Wutai', 5, WM.hum(WM.data.npcs.wutaimonk.look), { hp: 0.9, atk: 0.85, exp: 70, gold: 0, fx: 'blunt', drops: [['bun', 0.4]] });
  WM.enemy('wutai_monk2', 'Wutai Warrior-Monk', 7, WM.hum(WM.enemyLooks.monkThug), { atk: 0.62, exp: 80, gold: 0, fx: 'blunt', drops: [['bun', 0.3]] });
  WM.enemy('peach_bandit', 'Peach Blossom Bandit', 6, WM.hum(WM.enemyLooks.bandit), { atk: 0.7, exp: 90, drops: [['beef', 0.2]] });
  WM.enemy('zhoutong_boss', 'Zhou Tong', 8, WM.hum(WM.data.chars.zhoutong.look), { hp: 2.0, atk: 0.85, range: 'M', exp: 240, gold: 80, boss: true, drops: [['medicine', 1]], skills: [{ name: 'Little Conqueror\'s Thrust', chance: 0.25, type: 'phys', power: 1.5 }] });
  WM.enemy('cui_boss', 'Cui Daocheng', 10, WM.hum(WM.data.npcs.cuidaocheng.look), { hp: 1.9, atk: 0.7, exp: 280, gold: 120, boss: true, drops: [['medicine', 1]], skills: [{ name: 'Iron Buddha Cleave', chance: 0.25, type: 'phys', power: 1.6 }] });
  WM.enemy('qiu_boss', 'Qiu Xiaoyi', 10, WM.hum(WM.data.npcs.qiuxiaoyi.look), { hp: 1.5, atk: 0.62, spd: 1.2, exp: 260, gold: 100, boss: true, drops: [['antidote', 2]], skills: [{ name: 'Flying Yaksha', chance: 0.3, type: 'phys', power: 1.3, target: 'all' }] });
  WM.enemy('cui_strong', 'Cui Daocheng', 10, WM.hum(WM.data.npcs.cuidaocheng.look), { hpAbs: 9999, atk: 1.0, exp: 0, gold: 0, boss: true });
  WM.enemy('qiu_strong', 'Qiu Xiaoyi', 10, WM.hum(WM.data.npcs.qiuxiaoyi.look), { hpAbs: 9999, atk: 0.9, exp: 0, gold: 0, boss: true });
  WM.enemy('rascal', 'Garden Rascal', 4, WM.hum(WM.enemyLooks.thug), { hp: 0.8, atk: 0.8, exp: 60, gold: 15, fx: 'blunt' });
  WM.data.troops.ch2_monks1 = { enemies: ['wutai_monk', 'wutai_monk', 'wutai_monk'], bg: 'temple' };
  WM.data.troops.ch2_monks2 = { enemies: ['wutai_monk2', 'wutai_monk', 'wutai_monk2', 'wutai_monk'], bg: 'temple' };
  WM.data.troops.ch2_zhoutong = { enemies: ['peach_bandit', 'zhoutong_boss', 'peach_bandit'], bg: 'interior', boss: true };
  WM.data.troops.ch2_waguan1 = { enemies: ['cui_strong', 'qiu_strong'], bg: 'forest', boss: true };
  WM.data.troops.ch2_waguan2 = { enemies: ['cui_boss', 'qiu_boss'], bg: 'forest', boss: true };
  WM.data.troops.ch2_rascals = { enemies: ['rascal', 'rascal', 'rascal', 'rascal'], bg: 'plains', noRun: true };

  WM.data.duels.luda_zhengtu = {
    hero: 'luda', foe: 'zhengtu', bg: 'town', heroHp: 330, heroAtk: 52, foeHp: 260, foeAtk: 30,
    intro: [['foe:angry', 'You came here to make sport of me? I\'ll gut you like a hog!'], ['hero:angry', 'Come on then, Lord of the West!']],
    lines: {
      attack: ['Hyaah! My knife!', 'I\'ll stick you!', 'Here — take it!'],
      wild: ['I\'ll carve you to the bone!', 'Every hog I ever killed — this is for you!', 'Die, you meddling soldier!'],
      defend: ['Wh-what are you waiting for?', 'Stay back! Stay back!', 'I\'m not afraid of you...']
    },
    win: [['hero:angry', 'That\'s for the Jins!']], lose: [['foe:smile', 'Ha! Big talk, soldier!']]
  };
  WM.data.duels.lu_shijin = {
    hero: 'luzhishen', foe: 'shijin', bg: 'forest', heroHp: 380, heroAtk: 40, foeHp: 300, foeAtk: 32, drawAfter: 3,
    intro: [['foe', 'Halt, monk! Leave your bundle and pass!'], ['hero:angry', 'You rob a monk, you thieving fool? Come and take it!']],
    lines: {
      attack: ['Here it comes!', 'Have at you, bald-head!', 'Take this!'],
      wild: ['I\'ll finish you in one stroke!', 'All my strength — now!', 'No mercy!'],
      defend: ['You fight well for a monk...', 'Steady... watch his staff.', 'Hm.']
    },
    draw: [['hero', 'Wait! That voice! Who are you, highwayman?'], ['foe:shock', 'Brother Lu? Is it you? It\'s me — Shi Jin!']]
  };

  // move a character's progress from one id to another (Lu Da becomes Lu Zhishen)
  function transform(from, to) {
    var a = WM.state.chars[from];
    var b = S.initChar(to, a.lv);
    b.lv = a.lv; b.exp = a.exp; b.wlv = Math.max(b.wlv, a.wlv); b.equip = a.equip; S.restore(to);
    var p = WM.state.party, i = p.indexOf(from);
    if (i >= 0) p[i] = to; else p.unshift(to);
    if (WM.state.leader === from) WM.state.leader = to;
    WM.field.setLeader && WM.field.player && WM.field.setLeader(WM.state.leader);
  }

  WM.data.chapters[2].begin = async function (s) {
    await s.chapter(2);
    s.party(['luda']); s.level('luda', 8); s.setLeader('luda');
    WM.state.chars.luda.equip.body = 'quilted';
    s.flag('protagonist', 'luda');
    var R = WM.data.weizhouRooms;
    await s.warp('weizhou_in', 30, 6, 'up', { noFade: true });
    await s.fadeIn(0.6);
  };
  WM.data.chapters[2].debugStart = async function (s) {
    S.newGame(); ['pro_done', 'ch1_done'].forEach(function (f) { s.flag(f); }); WM.unlock('longhu', 'shivillage', 'shaohua', 'weizhou');
    s.party(['shijin']); s.level('shijin', 7);
    await WM.data.chapters[2].begin(s);
  };

  // ---------------- Weizhou: the Jins, the inn, the butcher ----------------
  WM.defEvents('weizhou_in', [
    { id: 'ch2_pan', trigger: 'auto', once: true, x: 0, y: 0, cond: function () { return WM.state.chapter === 2; }, run: async function (s) {
      s.spawn('shijin', 'shijin', 31, 6, 'left'); s.spawn('lizhong', 'lizhong', 29, 6, 'right');
      s.spawn('waiterP', 'waiter', 35, 8, 'up');
      s.spawn('oldjin', 'oldjin', 38, 4, 'down'); s.spawn('cuilian', 'cuilian', 39, 4, 'down');
      s.face('player', 'down');
      await s.move('waiterP', 'U1');
      await s.say('waiter:shock', 'Sir! Sir, what is it? What do you want?');
      await s.say('luda:angry', 'Who\'s that blubbering next door, spoiling our wine? Bring them here!');
      s.move('cuilian', 'L5', { wait: false }); await s.move('oldjin', 'L5');
      await s.say('oldjin:sad', 'Forgive us, sir. We did not mean to disturb you.');
      await s.say('luda', 'Where are you from? Why the tears?');
      await s.say('cuilian:sad', 'We came from the Eastern Capital with my mother to join relatives here, sir, but they had moved south. My mother fell sick at the inn and died.');
      await s.say('cuilian:sad', 'There is a rich man here called Zheng the Butcher. He calls himself "Lord of the West." He sent a matchmaker and made me his concubine on a contract for three thousand strings of cash. The contract was real, but the money never was. In three months his wife drove me out, and now he says we owe him the three thousand strings.');
      await s.say('oldjin:sad', 'He is rich and powerful, and we are strangers here. We cannot fight him. So my daughter sings in the taverns and gives him most of what she earns. These two days there have been few customers, and we are afraid of what he will do when we cannot pay. That is why she was crying.');
      await s.say('luda:angry', 'Zheng the butcher! The pig-sticker who keeps a meat stall at the Zhuangyuan Bridge? That dog! He trades on my commander\'s name to cheat people!');
      await s.say('luda:angry', 'Brothers, wait here. I\'m going to beat that cur to death.');
      await s.say('shijin', 'Brother, wait! Let us think of something better first.');
      await s.say('luda', '...All right. Old man, I\'ll give you money for the road. You go back to the Eastern Capital tomorrow.');
      await s.say('oldjin', 'If we could only go home! But the innkeeper is Zheng\'s man. He\'ll never let us leave.');
      await s.say('luda', 'Leave that to me.');
      await s.narrate('Lu Da found five taels of silver in his purse and set them on the table. "Brother, lend me some, and I\'ll pay you back tomorrow." Shi Jin took out a ten-tael ingot. Li Zhong, after some rummaging, produced two taels. Lu Da glanced at them, tossed them back across the table, and said, "You\'re not much of a man, are you?"');
      await s.say('luda', 'Fifteen taels, old man. Pack tonight. At dawn I\'ll come to the inn and see you off — and let\'s see who tries to stop you.');
      await s.say('cuilian:smile', 'May Heaven repay you, sir. We will never forget you.');
      s.despawn('oldjin'); s.despawn('cuilian'); s.despawn('waiterP');
      await s.say('shijin', 'Brother Lu, I must go on and look for Master Wang. When will we meet again?');
      await s.say('luda:smile', 'Who knows? The rivers and lakes are wide, but they all flow together somewhere. Take care of yourself, Nine Dragons.');
      s.despawn('shijin', { leave: true }); s.despawn('lizhong', { leave: true });
      await s.fadeOut(0.8);
      await s.narrate('Shi Jin went his own way, and Li Zhong went his. Lu Da went back to his quarters, too angry to eat, and lay awake all night. At the first light of dawn he strode to the Jins\' inn.');
      s.flag('ch2_dawn');
      await s.warp('weizhou_in', 51, 7, 'up', { noFade: true });   // beside the door, leaving the Jins the way out
      s.spawn('oldjin', 'oldjin', 47, 4, 'down'); s.spawn('cuilian', 'cuilian', 48, 4, 'down');
      s.spawn('innboy', 'innwaiter', 50, 5, 'down');
      await s.fadeIn(0.8);
      await s.say('innwaiter', 'Where do you think you\'re going, Old Jin? You still owe Master Zheng for the girl. He told me not to let you out of my sight.');
      await s.say('luda:angry', 'Their debt\'s been paid. What business is it of yours?');
      await s.say('innwaiter:angry', 'Master Zheng\'s money is my business!');
      s.sfx('hit'); await s.shake(3, 0.3);
      await s.narrate('Lu Da slapped him so hard blood ran from his mouth, then a second blow knocked out two of his teeth. The inn boy crawled away into the back and did not come out again.');
      s.despawn('innboy', { leave: true });
      await s.say('luda', 'Go, old man. Go now, the two of you, and don\'t stop until you\'re far from Weizhou.');
      await s.move('oldjin', 'R2 D3 R1'); await s.move('cuilian', 'R1 D3');   // between the beds and out
      s.despawn('oldjin', { leave: true }); s.despawn('cuilian', { leave: true });
      await s.narrate('Lu Da took a stool, sat himself down in the inn doorway, and stayed there for two hours, until he judged the Jins were well out of reach. Then he got up and walked to the Zhuangyuan Bridge.');
      s.flag('ch2_tobutcher');
      s.give('beef', 2, true);
    } }
  ]);
  WM.defEvents('weizhou', [
    { id: 'ch2_zheng', x: 30, y: 23, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_tobutcher'); }, idle: { helper1: 'Best pork in Weizhou, sir. Master Zheng supplies the garrison and the Commissioner\'s own kitchen.', helper2: '(He is sharpening a cleaver, and keeps glancing at his master behind the chopping block.)' },
      run: async function (s) {
      s.spawn('zhengtu', 'zhengtu', 32, 23, 'down');
      s.spawn('helper1', 'servant', 29, 24, 'right'); s.spawn('helper2', 'servant', 34, 24, 'left');
      s.place('player', 32, 25, 'up');
      await s.say('zhengtu:smile', 'Major Lu! Forgive me for not greeting you. A stool for the Major! What can I do for you?');
      await s.say('luda', 'Ten catties of lean pork, for my commander. Minced fine. And not a speck of fat in it.');
      await s.say('zhengtu', 'Of course! You there, cut ten catties of the best —');
      await s.say('luda', 'Not your boys. I want you to do it yourself.');
      await s.narrate('So Zheng the butcher chose ten catties of lean pork and minced it himself, for most of an hour, while the Jins\' inn boy came running up to tell him what had happened — and then, seeing Lu Da sitting there, did not dare come near, and hid under the eaves.');
      await s.say('luda', 'Now ten catties of fat. Minced fine. Not a speck of lean in it.');
      await s.say('zhengtu', '...Fat, sir? What does the Major want with fat?');
      await s.say('luda', 'My commander\'s orders. Who\'d dare ask him?');
      await s.narrate('Zheng minced ten catties of fat. By now it was near noon. He wrapped it in lotus leaves.');
      await s.say('zhengtu', 'Shall I send it to your quarters, Major?');
      await s.say('luda', 'Now ten catties of gristle, minced fine. Not a scrap of meat in it.');
      await s.say('zhengtu:angry', '...You\'ve come here on purpose to make a fool of me!');
      await s.narrate('Lu Da leapt up, a packet of minced meat in each hand, and flung them in the butcher\'s face. It came down on him like a rain of meat.');
      await s.say('luda:angry', 'That\'s right, I came to make a fool of you!');
      s.sfx('slash');
      await s.narrate('Zheng\'s rage flamed from the soles of his feet to the top of his head. He snatched up a boning knife from the block and leapt into the street. The neighbours and passers-by drew back and watched from a distance; not one dared step in.');
      await s.duel('luda_zhengtu');
      s.music('tense');
      await s.narrate('Lu Da caught the butcher\'s knife hand, kicked him in the belly and stamped on his chest. "I fought my way up from the ranks to be a major under the Minister, and only then did I call myself Lord of the West. What are you? A pig-sticker, a cur — and you call yourself the Lord of the West? And you cheated Jin Cuilian!"');
      s.sfx('hit'); await s.shake(4, 0.3);
      await s.narrate('His first punch landed on the butcher\'s nose. Blood burst out and the nose went flat to one side, as if a sauce shop had overturned inside his head: salt, sour and peppery all at once.');
      s.sfx('hit'); await s.shake(4, 0.3);
      await s.narrate('"You still talk back?" The second punch landed between the eyebrows and the eye sockets split, and he saw red, black and purple all together, as if a dyer\'s shop had opened inside his skull.');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('The third punch caught him on the temple, and it was like a great Buddhist rite: chimes, cymbals and bells all ringing at once. Zheng lay stretched on the ground. His breath went out, and did not come in again.');
      s.lie('zhengtu');
      await s.say('luda', '...You\'re pretending to be dead! Get up, I\'ll hit you again!');
      await s.emote('player', 'sweat');
      await s.say('luda', '(...His face is turning colour. I only meant to give him a beating, and I\'ve killed him with three punches. I\'ll go to prison for this, and there\'ll be nobody to bring me food. Better be off.)');
      await s.say('luda:angry', 'Pretending to be dead! I\'ll settle with you later!');
      await s.narrate('And swearing at the corpse as he went, Lu Da strode off down the street. None of the neighbours or Zheng\'s men dared to stop him. He went back to his lodgings, rolled up some clothes and silver, took a staff and was out of the South Gate before anyone came for him.');
      s.lie('zhengtu'); s.despawn('helper1', { leave: true }); s.despawn('helper2', { leave: true });   // the butcher lies dead in his shop
      s.flag('ch2_fled');
      WM.unlock('yanmen');
      await s.narrate('The prefect sent men after him and posted a reward of a thousand strings for the arrest of the murderer Lu Da. But Lu Da had fled, hungry and desperate, through one prefecture after another, until he came to Yanmen county in Daizhou.');
      await s.warp('world', WM.worldAt('yanmen')[0], WM.worldAt('yanmen')[1], 'up', { fade: 0.6 });
    } }
  ]);
  // Weizhou is closed to the fugitive
  WM.defEvents('world', [
    { id: 'ch2_noweizhou', x: 8, y: 41, trigger: 'touch', cond: function (S2) { return S2.has('ch2_fled') && WM.state.chapter === 2; }, text: ['The posters for my arrest will be all over Weizhou. Better not go back.'] }
  ]);

  // ---------------- Yanmen: the wanted poster and Squire Zhao ----------------
  WM.defEvents('yanmen', [
    { id: 'ch2_poster', x: 11, y: 11, w: 4, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_fled'); }, idle: { c1: 'A thousand strings for one man! What did he do?', c2: 'Killed the butcher of Weizhou with three blows of his fist, they say. Three!', c3: 'The notice? Here, I\'ll read it to you. Most folk in Yanmen can\'t make out a word of it.' },
      run: async function (s) {
      s.spawn('c1', 'villager', 11, 10, 'up'); s.spawn('c2', 'merchant', 13, 10, 'up'); s.spawn('c3', 'scholar', 12, 9, 'down');
      await s.say('scholar', '(reading aloud) "...By order of the Military Commissioner of Taiyuan: the criminal Lu Da, formerly a major in the Weizhou garrison, killed Zheng Tu with his fists and fled. A reward of one thousand strings is offered to whoever harbours or seizes him..."');
      await s.say('luda', '(...Me. That\'s me. And I can\'t even read it myself.)');
      s.spawn('oldjin', 'oldjin', 15, 13, 'up');
      await s.move('oldjin', 'L2 U1', { run: true });
      await s.say('oldjin', 'Brother Zhang! What are you doing here? Come — come with me at once!');
      await s.narrate('The old man seized Lu Da by the sleeve and pulled him out of the crowd and down a quiet lane.');
      s.despawn('c1'); s.despawn('c2'); s.despawn('c3');
      await s.say('oldjin', 'Benefactor, are you mad? The notice describes you to the hair, and you stand there reading it! If I hadn\'t seen you, the constables would have.');
      await s.say('luda', '...I can\'t read. But tell me, how do you come to be in Yanmen? I sent you to the Eastern Capital.');
      await s.say('oldjin:smile', 'After we left Weizhou we met an old neighbour who brought us here, and he made a match for Cuilian with a rich man of this place, Squire Zhao. He keeps her in a house of her own, and treats us well. Every day she speaks of you. Come, come and see her!');
      s.despawn('oldjin');
      await s.warp('yanmen_in', 28, 8, 'up');
      s.spawn('oldjin', 'oldjin', 27, 5, 'down'); s.spawn('cuilian', 'cuilian', 29, 5, 'down');
      await s.say('cuilian:smile', 'Benefactor! If not for you, we would never have escaped that man. Please, sit. You must eat with us.');
      await s.narrate('They had not finished the first cup when there was a great shouting outside. Twenty or thirty men with staves burst in, led by a man on horseback, crying "Seize the thief!"');
      s.spawn('zhao', 'zhaoyuanwai', 29, 9, 'up');
      await s.move('zhao', 'U1');
      await s.say('cuilian:shock', 'No, no! Stop! This is the Major Lu who saved us!');
      await s.say('zhaoyuanwai:shock', 'This is... Major Lu? The one who killed the Lord of the West? Forgive me! The servants told me Cuilian was entertaining a strange man, and I thought... Forgive me, Major. I am honoured — truly honoured.');
      await s.fadeOut(0.8);
      await s.narrate('Squire Zhao took Lu Da into his own manor ten li from the town and treated him as an honoured guest. But after some days the squire came to him, troubled. The constables had been asking questions in the village about a stranger at the squire\'s house.');
      s.place('zhao', 30, 6, 'left'); s.despawn('oldjin'); s.despawn('cuilian');
      s.place('player', 28, 6, 'right');
      await s.fadeIn(0.8);
      await s.say('zhaoyuanwai', 'Major, I have an idea, though I hardly dare suggest it. Thirty li from here is Mount Wutai, and on it the Monastery of Manjusri. I am a patron there. Long ago I vowed to have a monk ordained in my name, and I have the certificate already bought. If you were to shave your head and become a monk, no constable could touch you there.');
      await s.say('luda', '...A monk? Me?');
      await s.say('luda', '...Well. Better a monk than a head on the city wall. I\'ll do it.');
      s.despawn('zhao', { leave: true });
      WM.unlock('wutai');
      s.flag('ch2_towutai');
      await s.narrate('Next morning Squire Zhao and Lu Da set out for Mount Wutai with porters carrying gifts for the monastery. It lies north-east of Yanmen, up a valley of pines.');
    } }
  ]);

  // ---------------- Mount Wutai ----------------
  var wutaiRooms = function () { return WM.data.wutai.rooms; };
  WM.defEvents('wutai', [
    { id: 'ch2_arrive', x: 15, y: 19, w: 6, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_towutai'); }, idle: { zhao: 'Up the steps, brother. The Abbot Zhizhen is a holy man. Keep your voice down, and let them shave your head without a word.' },
      run: async function (s) {
      s.spawn('zhao', 'zhaoyuanwai', 16, 22, 'up');
      s.spawn('m1', 'wutaimonk', 17, 11, 'down'); s.spawn('m2', 'wutaimonk', 18, 11, 'down');
      await s.say('wutaimonk', 'Squire Zhao! Welcome. The Abbot is expecting you in the Hall.');
      s.despawn('m1'); s.despawn('m2');
      await s.warp('wutai_in', 36, 9, 'up');
      s.spawn('zhizhen', 'zhizhen', 36, 5, 'down');
      s.spawn('zhao', 'zhaoyuanwai', 35, 8, 'up');
      s.spawn('m1', 'wutaimonk', 33, 6, 'right'); s.spawn('m2', 'wutaimonk', 39, 6, 'left'); s.spawn('m3', 'wutaimonk', 33, 8, 'right'); s.spawn('m4', 'wutaimonk', 39, 8, 'left');
      await s.move('player', 'U2');
      await s.say('zhaoyuanwai', 'Reverend Abbot, this is a cousin of mine, Lu Da, who has seen the emptiness of the world and wishes to leave it. I beg you to accept him as a monk.');
      await s.say('wutaimonk:concerned', '(whispering) Look at him. That face. Those eyes. He\'s no monk — he\'s a killer. Ordain him and he\'ll bring the whole monastery down on our heads.');
      await s.say('zhizhen', 'Light the incense. I will sit in meditation and see.');
      s.sfx('gong');
      await s.narrate('The Abbot sat cross-legged on his couch, closed his eyes and murmured a spell, and was still for as long as it takes an incense stick to burn down. Then he opened his eyes.');
      await s.say('zhizhen', 'Ordain him. This man corresponds to a star of Heaven. His heart is upright. Though he is fierce now and his life will be full of trouble, in time he will be purified and will find enlightenment beyond any of you. Remember my words. Do not oppose him.');
      await s.say('wutaimonk', '(muttering) The Abbot is shielding his own patron. Well, on his head be it...');
      s.sfx('gong');
      await s.narrate('So on an auspicious day the bell was struck and the drum beaten, and before all the monks Lu Da\'s hair was shaved. When the barber came to his beard, Lu Da said, "Leave me that much at least," and the monks laughed, but the Abbot said, "Not one hair may remain, lest it bind him to the world." So it all went.');
      await s.say('zhizhen', 'A spark of spirit, hard to come by: your Dharma name is Zhishen — Deep Wisdom. Now hear the precepts. Take no life. Do not steal. Do not lust. Drink no wine. Do not lie.');
      await s.say('luda', '...I\'ll remember.');
      await s.narrate('He did not know that a monk is meant to answer, "I will keep them." The monks laughed behind their hands.');
      transform('luda', 'luzhishen');
      s.flag('protagonist', 'luzhishen');
      WM.state.chars.luzhishen.equip.body = 'monkrobe';
      s.despawn('zhao', { leave: true }); s.despawn('m1'); s.despawn('m2'); s.despawn('m3'); s.despawn('m4'); s.despawn('zhizhen');
      await s.notice('Lu Da took the tonsure as Lu Zhishen.', { auto: 2 });
      await s.narrate('Squire Zhao left a great gift for the monastery and went home. And the new monk Zhishen went to the meditation hall, threw himself down on the bench and went to sleep. When the monks shook him and said he must sit in meditation, he said, "I\'ll sleep. What\'s it to you?" He snored like thunder. At night he got up and relieved himself behind the Buddha hall. The monks complained to the Abbot every day; the Abbot only said, "He will be enlightened one day. Bear with him."');
      await s.narrate('Four or five months went by. In the first month of winter, Zhishen, who had not touched wine or meat in all that time, could bear it no longer. One fine day he put on his black robe, tied his belt, and walked out of the mountain gate.');
      s.flag('ch2_monk');
      await s.warp('wutai', 17, 22, 'down');
    } },
    { id: 'ch2_peddler', x: 9, y: 31, npc: 'peddler', ambientEmote: 'note', cond: function (S2) { return S2.has('ch2_monk') && !S2.has('ch2_drunk1'); }, run: async function (s) {
      await s.say('peddler', '(singing) "Below the Nine-Li Hill, a soldier\'s bones lie bare; the wind blows on the river, and a cowherd plays his air..."');
      await s.say('luzhishen', 'You there! What\'s in the buckets?');
      await s.say('peddler', 'Good wine, Reverend.');
      await s.say('luzhishen', 'How much a bucket?');
      await s.say('peddler', '...You\'re joking, Reverend. I sell to the monastery\'s workmen and porters, not to monks. The Abbot has forbidden us. If he hears I\'ve sold a monk wine, he\'ll take back the shop he lets me, and I\'ll have nowhere to live. I wouldn\'t sell to you if you killed me.');
      await s.say('luzhishen:angry', 'I\'m not going to kill you. I\'m going to buy your wine.');
      await s.narrate('The peddler picked up his buckets and started to run. Zhishen caught him, seized the pole, and kicked him in the groin. While the man doubled over, Zhishen carried a bucket up into the pavilion, sat down, scooped the wine out with the ladle, and drank it all.');
      s.place('player', 9, 31, 'down'); s.place('ch2_peddler', 9, 32, 'up');   // Zhishen in the pavilion, the peddler outside it
      await s.say('luzhishen', 'Come to the monastery tomorrow for your money.');
      await s.say('peddler:shock', '(clutching himself) T-tomorrow! Yes, Reverend! Keep the bucket!');
      // he snatches up his pole and the other bucket and runs for it, down the path to the town
      await s.move('ch2_peddler', 'D1 R4 D1 R2 D2 R2 D5', { run: true });
      s.flag('ch2_drunk1');
      s.weather(null);
      await s.narrate('By the time he had finished the bucket, the wine had gone to his head. He tied his robe sleeves round his waist and staggered back up the mountain, swinging his arms and showing the tattoos on his back.');
    } },
    { id: 'ch2_gate1', x: 15, y: 20, w: 6, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_drunk1'); }, run: async function (s) {
      s.spawn('m1', 'wutaimonk', 16, 18, 'down'); s.spawn('m2', 'wutaimonk', 19, 18, 'down');
      await s.say('wutaimonk:angry', 'You\'re a disciple of the Buddha, and you come back drunk as a wine-sack?! Get out! The rules say twenty strokes with the bamboo for a monk who breaks the wine precept!');
      await s.say('luzhishen:angry', 'Strokes? You\'ll strike me? Come and try!');
      await s.battle('ch2_monks1', { bg: 'temple' });
      await s.narrate('The monks scattered, howling. Zhishen rampaged through the monastery, scattering the brethren in every direction, until the Abbot himself came out with several elders.');
      s.despawn('m1', { leave: true }); s.despawn('m2', { leave: true });
      await s.walkTo('player', 18, 18);   // up from the gate, out from under its roof, so he can be seen
      s.face('player', 'up');
      s.spawn('zhizhen', 'zhizhen', 17, 15, 'down');
      await s.move('zhizhen', 'D2');
      await s.say('zhizhen:angry', 'Zhishen! Stop this at once.');
      await s.say('luzhishen', '...Abbot. I had a little wine, but I didn\'t pick the quarrel. They hit me first.');
      await s.say('zhizhen', 'Go and sleep. We will speak tomorrow.');
      await s.narrate('Next day the Abbot called him in and spoke to him gravely. "Squire Zhao brought you here to be a monk. Wine brings confusion; it is the first of the precepts. If it happens again, you cannot stay." Zhishen knelt and said he would never dare again.');
      s.despawn('zhizhen', { leave: true });
      s.flag('ch2_scolded');
      await s.narrate('For three or four months after that, he did not dare leave the monastery. But one warm day in the second month he strolled out of the gate, and looking down from the hill, he saw the market town at the foot of the mountain, and heard the ring of a smith\'s hammer.');
      s.mark([{ map: 'wutai', x: 16, y: 41, w: 3 }, { map: 'wutai_town', x: 6, y: 7, sparks: true }], 'ch2_staff');   // down the mountain, to the smithy
    } }
  ]);

  // ---------------- the monks of Wutai: newly ordained, after the first drunkenness, after he is sent away ----------------
  var ordained = function (S2) { return S2.has('ch2_monk') && !S2.has('ch2_drunk1'); };
  var disgraced = function (S2) { return S2.has('ch2_drunk1') && !S2.has('ch2_expelled'); };
  var gone = function (S2) { return S2.has('ch2_expelled'); };
  function monks(map, id, x, y, npc, lines) {
    return [ordained, disgraced, gone].map(function (cond, i) { return { id: id + i, x: x, y: y, npc: npc, cond: cond, text: [lines[i]] }; });
  }
  WM.defEvents('wutai', [].concat(
    monks('wutai', 'wtsweep', 22, 17, 'wutaimonk', [
      'Brother Zhishen, the meditation bell has rung twice. ...You are going out of the gate again? The Abbot said — never mind. Amitabha.',
      'Twenty strokes of the bamboo for breaking the wine precept, the rules say, and you got not one. The Abbot is too soft on you, Brother. Everyone says so.',
      'We are rebuilding the guardian kings at the gate with Squire Zhao\'s silver. The new ones look a good deal less fierce.']),
    monks('wutai', 'wtmed', 9, 17, 'wutaimonk', [
      'You snore like a thunderclap, Brother, and you relieve yourself behind the Buddha hall. The elders have gone to the Abbot twice. He only says, "In time he will be enlightened."',
      '(The monk steps quickly out of your way and bows very low.) Good — good morning, Reverend Brother.',
      'Sometimes I almost miss the snoring. The meditation hall is very quiet now.']),
    monks('wutai', 'wtwell', 30, 9, 'wutaimonk', [
      'When the Abbot sits in meditation he sees a man\'s past and future. If he says you are a star of Heaven, Brother, then you are one. Even if the rest of us cannot see it.',
      'The Abbot did not sleep last night. He sat before the Buddha until dawn. I think he was praying for you, Brother.',
      'The Abbot keeps Zhishen\'s old begging bowl by his couch. He says that one will come back to Wutai once more, before the end.'])
  ));
  WM.defEvents('wutai_in', [].concat(
    monks('wutai_in', 'wthall', 33, 10, 'wutaimonk', [
      'This is the Hall of the Great Hero. Manjusri, the Bodhisattva of Wisdom, sits at the centre. Keep your voice down here, Brother.',
      '(He keeps his eyes on his sutra, and edges round to the far side of the column.)',
      'Manjusri rides a lion, because wisdom must be fierce. The Abbot said that once, about a certain monk.']),
    monks('wutai_in', 'wthall2', 39, 10, 'wutaimonk', [
      'Squire Zhao gave the monastery a great gift on the day you were ordained: bolts of silk and a hundred strings of cash. The elders were very quiet after that.',
      'The brother you struck on the head is still lying in the infirmary. Please, Brother — not in the hall.',
      'Squire Zhao has paid for the new guardian kings, the pavilion and the medicine for the injured brothers. He is a patient man.']),
    monks('wutai_in', 'wtplat', 9, 5, 'wutaimonk', [
      '(A monk sits cross-legged on the platform with his eyes closed.) ...When you sleep here, Brother, please do it quietly. Some of us are trying to reach enlightenment.',
      'You were sick on the floor, just there. I cleaned it. Amitabha.',
      'His place on the platform is still empty. Nobody will take it.'])
  ));
  WM.defEvents('wutai_town', [
    // a woman of the town, which lives off the monastery and its pilgrims
    { id: 'wtt_a', x: 10, y: 11, npc: 'woman', cond: function (S2) { return !S2.has('ch2_monk'); }, text: ['Pilgrims come up from Daizhou every spring. We sell them incense and steamed buns, and rent them beds. The monastery owns half the houses in town.'] },
    { id: 'wtt_b', x: 10, y: 11, npc: 'woman', cond: ordained, text: ['There\'s a new monk up at the monastery, they say. Big as a guardian king, with flowers tattooed all over his back!'] },
    { id: 'wtt_c', x: 10, y: 11, npc: 'woman', cond: function (S2) { return S2.has('ch2_drunk1') && !S2.has('ch2_expelled'); }, text: ['A monk kicked the wine-seller flat on the mountain path and drank his whole bucket! The Abbot paid the man out of his own purse.'] },
    { id: 'wtt_d', x: 10, y: 11, npc: 'woman', cond: gone, text: ['The big monk smashed the guardian kings at the gate, and they have sent him away to the Eastern Capital. The whole town heard the crash.'] },
    // a porter on the road up the mountain
    { id: 'wtt_p', x: 19, y: 8, npc: 'villager', cond: function (S2) { return !S2.has('ch2_drunk1'); }, text: ['I carry rice up to the monastery. Three hundred and some steps, twice a day. The monks never carry their own.'] },
    { id: 'wtt_p2', x: 19, y: 8, npc: 'villager', cond: function (S2) { return S2.has('ch2_drunk1'); }, text: ['No wine sold on the mountain path any more, not even to us porters. All for one thirsty monk.'] },
    // an old man by the smithy
    { id: 'wtt_o', x: 9, y: 8, npc: 'oldman', cond: function (S2) { return !S2.has('ch2_staff'); }, text: ['Hear that hammer? Old Zhang the smith. Pilgrims buy knives from him for the road home.'] },
    { id: 'wtt_o2', x: 9, y: 8, npc: 'oldman', cond: function (S2) { return S2.has('ch2_staff'); }, text: ['Sixty-two catties of iron, for a monk\'s staff! Zhang says his arm still aches. What does a monk want with a thing like that?'] },
    // a child, and a pilgrim come to burn incense
    { id: 'wtt_k', x: 23, y: 23, npc: 'child', cond: function (S2) { return !S2.has('ch2_expelled'); }, text: ['Mama says not to stare at the monks. ...Are you a monk? You don\'t look like one.'] },
    { id: 'wtt_k2', x: 23, y: 23, npc: 'child', cond: gone, text: ['When I grow up I\'m going to be as strong as the big monk. He knocked over a guardian king!'] },
    { id: 'wtt_s', x: 14, y: 21, npc: 'scholar', text: ['I have walked four hundred li to burn incense before Manjusri. They say that on a clear night you can see the Bodhisattva\'s lamp shining on the northern peak.'] }
  ]);

  // ---------------- Wutai town: the staff and the dog meat ----------------
  WM.defEvents('wutai_town_in', [
    { id: 'ch2_smith', x: 4, y: 4, npc: 'smith', cond: function (S2) { return S2.has('ch2_scolded'); }, run: async function (s) {
      if (!S.has('ch2_staff')) {
        await s.say('luzhishen', 'Smith! Have you any good steel? I want a Chan staff made, and a precept knife.');
        await s.say('smith', 'Plenty of good steel, Reverend. How heavy a staff?');
        await s.say('luzhishen', 'A hundred catties.');
        await s.say('smith:shock', 'A hundred? That\'s too heavy for any man. Guan Yu\'s own blade weighed only eighty-one!');
        await s.say('luzhishen:angry', 'And am I less than Guan Yu? He was a man too, wasn\'t he?');
        await s.say('smith', 'Let me make it sixty-two catties, Reverend, and even that will be a burden. Five taels for the two.');
        await s.say('luzhishen', 'Sixty-two catties, then. And make it of good iron.');
        s.flag('ch2_staff');
        await s.notice('Lu Zhishen ordered an iron Chan staff of sixty-two catties.', { auto: 2 });
        WM.state.chars.luzhishen.wlv = Math.max(WM.state.chars.luzhishen.wlv, 4);
        await s.say('smith', 'Come back in a few days for it. And Reverend... the taverns here won\'t sell to monks. Just so you know.');
      } else {
        await s.say('smith', 'Your staff is ready, Reverend. Sixty-two catties. I\'ve never forged anything like it.');
        await s.smith(6, 'smith');
      }
    } },
    { id: 'ch2_tavern1', x: 15, y: 4, npc: 'innkeep', cond: function (S2) { return S2.has('ch2_scolded') && !S2.has('ch2_dogmeat'); }, text: ['Wine? For a monk? Not here, Reverend. The monastery owns this house. If I sold you wine, I\'d be out on the street tomorrow.'] },
  ]);
  WM.defEvents('wutai_town', [
    { id: 'ch2_tavern2b', x: 30, y: 11, npc: 'waiter', cond: function (S2) { return S2.has('ch2_dogmeat'); }, text: ['Reverend, ten bowls and half a dog, and you walked out straight. But please — no more wine. If the Abbot hears a monk was drinking in my shop, he will have my licence, and you will have the bamboo. Drink less, I beg you.'] },
    { id: 'ch2_tavern2', x: 30, y: 11, npc: 'waiter', ambientEmote: '!', cond: function (S2) { return S2.has('ch2_staff') && !S2.has('ch2_dogmeat'); }, run: async function (s) {
      await s.say(null, '(A little tavern at the edge of town, a wine flag hanging from a pole over its door.)');
      await s.say('waiter', '...You\'re not from the monastery up the mountain, are you, Reverend?');
      await s.say('luzhishen', 'Me? I\'m a wandering monk, just passing through. Bring me wine.');
      await s.say('waiter', 'A wandering monk! Then that\'s different. How many bowls?');
      await s.say('luzhishen', 'Don\'t count bowls. Bring it by the bucket. And what\'s that smell? Meat?');
      await s.say('waiter', '...Dog meat, Reverend. In the pot. But you\'re a monk, so I didn\'t think —');
      await s.say('luzhishen', 'Half a dog! And garlic with it!');
      await s.narrate('Zhishen tore into the dog meat with both hands and drank ten bowls of wine, one after another. He paid with a piece of silver, stuffed a leftover dog leg into his robe, and said, "Keep the change. I\'ll be back tomorrow."');
      s.flag('ch2_dogmeat');
      await s.narrate('He collected his staff from the smith and climbed back up the mountain. The wine rose in him with every step.');
    } }
  ]);
  WM.defEvents('wutai', [
    // outside the mountain gate: the gatekeepers see him coming and bar it
    { id: 'ch2_gate2', x: 15, y: 22, w: 7, h: 1, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_dogmeat'); },
      idle: { m1: '(The gatekeeper squints down the path at you, and his hand creeps towards the bolt.)', m2: 'Is that Brother Zhishen coming up the path? Swaying like a reed in the wind? Amitabha...' },
      run: async function (s) {
      s.spawn('m1', 'wutaimonk', 17, 19, 'down'); s.spawn('m2', 'wutaimonk', 18, 19, 'down');   // the gatekeepers, in the gateway (two tiles up, clear of its roof, so they can be seen)
      s.music('tense');
      await s.narrate('In the pavilion half-way up, he swung his arms and stretched his legs. "I haven\'t practised in an age. My joints are rusting." He took hold of a pillar of the pavilion and gave it a shake. The pillar cracked, and half the pavilion came down with a crash.');
      s.sfx('earth'); await s.shake(4, 0.5);
      await s.emote('m1', '!');
      await s.say('wutaimonk:shock', 'It\'s Zhishen — drunk again! Bar the gate! Bar the gate!');
      s.move('m1', 'U3', { run: true, wait: false }); await s.move('m2', 'U3', { run: true });
      s.sfx('door'); s.flag('shut:wutai'); await s.shake(2, 0.2);
      await s.narrate('The gatekeepers slammed the mountain gate and shot the bolt. Zhishen pounded on it with his fists until the leaves shook, and then he turned and saw the two great guardian kings glaring down at him from the wings of the gate.');
      await s.say('luzhishen:angry', 'You great lumps! Instead of opening the gate for me, you stand there waving your fists at me? Do you think I\'m afraid of you?');
      s.sfx('crit'); await s.shake(6, 0.5);
      await s.narrate('He leapt onto the pedestal, wrenched at the railing, broke off a pole and beat the guardian on the left until the clay and plaster came crashing down. Then he turned on the guardian on the right — "You open your mouth and laugh at me too?" — and kicked it so hard it toppled off its pedestal.');
      s.sfx('earth'); await s.shake(6, 0.5);
      // the gatekeepers, terrified, draw the bolt, and he tumbles in through the gate
      await s.narrate('Inside, the gatekeepers heard the guardian come down and thought the whole gate would follow. They drew back the bolt and ran — and Zhishen, who was leaning on the leaves, tumbled in head first.');
      s.unflag('shut:wutai'); s.sfx('door');
      await s.moveTo('player', 17, 19, { run: true });
      s.move('m2', 'R1', { wait: false }); await s.move('m1', 'L1');   // the gatekeepers fall back to either side
      s.spawn('m3', 'wutaimonk', 17, 16, 'down');                       // and a third comes running between them
      await s.say('wutaimonk:angry', 'Brothers! Take up your staves! He\'s pulled down the guardian kings!');
      await s.battle('ch2_monks2', { bg: 'temple' });
      await s.narrate('Zhishen cleared the hall with his staff. The monks who had tried to block him were laid out on every side, and he smashed his way into the meditation hall, where he flung pieces of dog meat into the faces of the meditating monks and stuffed it into one old monk\'s mouth.');
      s.despawn('m1', { leave: true }); s.despawn('m2', { leave: true }); s.despawn('m3', { leave: true });
      s.spawn('zhizhen', 'zhizhen', 17, 15, 'down');
      await s.move('zhizhen', 'D2');
      await s.say('zhizhen', 'Zhishen.');
      await s.narrate('At the sound of the Abbot\'s voice, the staff fell from his hands. "I didn\'t start it, Abbot. They attacked me." But he was sober enough to see what he had done.');
      await s.say('zhizhen:concerned', 'Zhishen, you have wrecked the guardian kings, broken the pavilion and beaten your brothers. Squire Zhao will pay for the statues. But you cannot stay among us any longer.');
      await s.say('zhizhen', 'I have a fellow disciple, the Abbot Zhiqing of the Great Xiangguo Monastery in the Eastern Capital. I will give you a letter to him; he will find you a post. And I give you four lines of verse to carry with you for the rest of your life. Remember them.');
      await s.say('zhizhen', '"Meet forest, and rise. Meet mountain, and prosper. Meet water, and flourish. Meet river, and stop."');
      await s.say('luzhishen', '...I will remember them, Abbot.');
      await s.say('luzhishen:sad', '(I made a fool of the old man in front of everyone, and he still sends me off with a letter and a blessing.)');
      s.despawn('zhizhen', { leave: true });
      s.flag('ch2_expelled');
      WM.unlock('peach', 'waguan', 'kaifeng');
      s.give('medicine', 3, true); s.gold(50, true);
      await s.narrate('So Lu Zhishen took his leave of Mount Wutai, with the Abbot\'s letter, ten taels of silver, his staff and his precept knife. In the town below he waited some days for the smith to finish, then set out for the Eastern Capital, more than half a month away to the south-east, by way of Peach Blossom Village.');
    } }
  ]);

  // ---------------- Peach Blossom Village: the bride's bed ----------------
  WM.defEvents('peach', [
    { id: 'ch2_peach', x: 13, y: 14, w: 3, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_expelled'); }, run: async function (s) {
      s.tint('dusk');
      s.spawn('servant', 'servant', 14, 11, 'down');
      await s.move('servant', 'D2');
      await s.say('servant', 'Monk, you can\'t stay here tonight! There\'s business at the manor tonight.');
      await s.say('luzhishen', 'What business is it of yours if I stay one night? Is it a wedding or a funeral, that I can\'t sleep in a barn?');
      var door = WM.centeredEntry ? WM.centeredEntry('peach', 14, 9) : { x: 14, y: 9 };   // his door, wherever doors were centred
      s.spawn('liu', 'liutaigong', door.x, 9, 'down');   // out of his door
      await s.move('liu', 'D2');
      await s.say('liutaigong:sad', 'Forgive my servant, Reverend. Come in, eat and rest. But it is a sorry kind of wedding tonight.');
      s.despawn('servant'); s.despawn('liu');
      await s.warp('peach_in', 9, 8, 'up');
      s.spawn('liu', 'liutaigong', 9, 5, 'down');
      await s.say('liutaigong:sad', 'I have only one daughter, nineteen this year. On the mountain nearby there are bandits, and their second chief, Zhou Tong, the Little Conqueror, came down and saw her and sent twenty taels and a bolt of red silk as bride-gifts. He is coming tonight to marry her. I cannot fight him. That is why we are all in tears.');
      await s.say('luzhishen', 'So that\'s it! Old man, I learned the art of talking men round from the Abbot of Wutai himself. Hide your daughter, and let me go into her room. I\'ll persuade the bridegroom to change his mind.');
      await s.say('liutaigong:concerned', '...You would do that? He is a fierce one, Reverend.');
      await s.say('luzhishen', 'I am fiercer. Bring me some wine and a goose first. A man can\'t talk on an empty stomach.');
      s.despawn('liu');
      await s.fadeOut(0.8);
      s.night(true);
      await s.narrate('Zhishen ate a whole goose and drank twenty bowls of wine. Then he went into the bridal chamber, put out the lamp, stripped himself naked, sat in the bed with the curtains drawn and his staff beside the pillow, and waited.');
      await s.warp('peach_in', 22, 4, 'down', { noFade: true });
      s.lie('player');
      await s.fadeIn(0.8);
      s.spawn('zhoutong', 'zhoutong', 22, 7, 'up');
      await s.say('zhoutong:smile', 'Where\'s my little lady? So shy she\'s put out the lamp! Your husband\'s here, my dear — don\'t be bashful!');
      await s.move('zhoutong', 'U1');
      await s.say('zhoutong', 'Feel my way to the bed... here\'s the curtain... and here\'s... a belly... a big hairy belly?!');
      s.lie('player', false);
      s.sfx('hit'); await s.shake(5, 0.4);
      await s.narrate('Zhishen seized him by the head, pressed him down on the bed and punched him behind the ear. "What are you hitting your husband for?" yelled Zhou Tong. "I\'ll teach you to know your wife!" roared Zhishen, and beat him around the room.');
      await s.say('zhoutong:shock', 'Help! Help! Save your chief!');
      await s.battle('ch2_zhoutong', { bg: 'interior' });
      await s.narrate('Zhou Tong broke free, ran out of the manor, leapt on his horse and fled up the mountain, his men scattering after him.');
      s.despawn('zhoutong', { leave: true });
      await s.fadeOut(0.6);
      await s.narrate('Before dawn the whole mountain came down: the chief of Peach Blossom Mountain himself, with torches and men, to avenge his brother. But when he saw the naked monk standing in the gate with his staff, he cried out in surprise.');
      s.night(false);
      await s.warp('peach_in', 9, 5, 'down', { noFade: true });
      s.spawn('lizhong', 'lizhong', 9, 7, 'up'); s.spawn('liu', 'liutaigong', 7, 5, 'right');
      await s.fadeIn(0.6);
      await s.say('lizhong:shock', 'Hold! Isn\'t that... Major Lu?!');
      await s.say('luzhishen', 'Li Zhong! The plaster-seller! What are you doing here?');
      await s.say('lizhong', 'After Weizhou I came this way and met Zhou Tong here. He made me chief of the mountain and he took second place. And you — a monk?');
      await s.say('luzhishen', 'That\'s a long story. But your brother Zhou Tong wants to marry this old man\'s only daughter by force. She is his one support in old age. Let her be.');
      await s.say('lizhong', 'If it\'s your wish, brother, it will be done. Zhou Tong will break the arrow and swear it.');
      await s.narrate('Zhou Tong, sore and humbled, swore he would never trouble the Liu family again. Li Zhong and Zhou Tong took Zhishen up the mountain and feasted him for several days. But Zhishen saw that they were stingy fellows, who meant to rob travellers for the parting gifts rather than give anything of their own.');
      await s.narrate('So while the two were down the mountain on a robbery, he gathered up the gold and silver wine cups from the table, stamped them flat, stuffed them in his bundle, and, finding the path guarded, wrapped himself up and rolled down the steep back of the mountain to the road below.');
      s.despawn('lizhong', { leave: true }); s.despawn('liu', { leave: true });
      s.tint(null);
      s.gold(120, true);
      s.flag('ch2_peachdone');
      await s.warp('peach', 14, 15, 'down');
      await s.say(null, '(Take the road south-east, towards the Eastern Capital.)');
    } }
  ]);

  // ---------------- Waguan Monastery ----------------
  WM.defEvents('waguan_in', [
    { id: 'ch2_oldmonks', x: 4, y: 4, npc: 'oldmonk', cond: function (S2) { return S2.has('ch2_peachdone') && !S2.has('ch2_waguanwin'); }, run: async function (s) {
      await s.say('oldmonk:sad', 'Don\'t... don\'t come shouting here, Reverend. We have not eaten in three days.');
      await s.say('luzhishen', 'Three days? In a monastery this size? Where are the monks? Where is the grain?');
      await s.say('oldmonk:sad', 'This was a great monastery once. Then a wandering monk called Cui Daocheng — they call him the Iron Buddha — and a Daoist called Qiu Xiaoyi — the Flying Yaksha — came and took it. They drove off the monks, sold the lands, and live in the back with a woman they keep. We are too old to go anywhere. We are waiting to die.');
      await s.say('luzhishen:angry', 'A monk and a Daoist playing at bandits in a house of the Buddha! Where are they?');
      await s.say('oldmonk:concerned', 'In the back court, under the locust tree... Reverend, they are strong. Be careful.');
      s.flag('ch2_heardcui');
    } }
  ]);
  // Shi Jin on the road below Waguan: talk to him, or walk into the clearing, and he comes at you
  async function shijinOnRoad(s) {
      await s.say('shijin:angry', 'You there, monk! Whatever you carry, set it down on the road, and go on your way.');
      await s.duel('lu_shijin', { canLose: true });
      await s.say('shijin', 'Brother! After we parted at Weizhou, I went to Yan\'an to look for Master Wang and never found him. My money ran out, so I\'ve been... borrowing from travellers on the road.');
      await s.say('luzhishen', 'Ha! And I have been a monk. Here — do you have anything to eat? I\'ve had nothing all day.');
      await s.narrate('Shi Jin brought out dried meat and flatbread, and Zhishen ate it all. Then he told Shi Jin about the Waguan Monastery and the two villains.');
      await s.say('shijin:angry', 'Then let\'s go back together and finish them.');
      // (he falls in with Zhishen: the party takes him from here)
      s.addParty('shijin'); s.level('shijin', Math.max(8, WM.state.chars.luzhishen.lv - 1));
      S.restoreParty();
      s.flag('ch2_withshijin');
      await s.notice('Shi Jin joined the party.', { auto: 1.6 });
  }
  WM.defEvents('waguan', [
    { id: 'ch2_cui1', x: 20, y: 13, w: 6, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_heardcui'); }, idle: { cui: 'A wandering monk? This monastery has nothing left for beggars. Sit down, brother, if you want a cup.', qiu: '(Qiu Xiaoyi, the Flying Yaksha, rests a hand on his sword and smiles at you.)' },
      run: async function (s) {
      s.spawn('cui', 'cuidaocheng', 19, 11, 'down'); s.spawn('qiu', 'qiuxiaoyi', 20, 11, 'down');
      await s.say('cuidaocheng', 'A monk? Sit down, sit down, brother. Share our wine.');
      await s.say('luzhishen:angry', 'You two have ruined this monastery and starved the old monks!');
      await s.say('cuidaocheng', 'Who told you that? Those old men lie. They lost the lands themselves, gambling and drinking...');
      await s.say('luzhishen:angry', 'Liar!');
      await s.narrate('Zhishen rushed at them with his staff. But he had walked all day and eaten nothing, and Cui Daocheng\'s halberd and Qiu Xiaoyi\'s sword came at him from both sides.');
      await s.battle('ch2_waguan1', { bg: 'forest', rounds: 3, noRun: true, canLose: true, intro: 'Lu Zhishen is weak with hunger...' });
      await s.narrate('Fifteen bouts, and Zhishen\'s strength was gone. Hungry and exhausted, he dragged his staff away and ran, and the two came after him, laughing.');
      // he runs for the gate down the old road, and they chase him as far as the wall
      s.music('tense');
      await s.moveTo('player', 16, 15, { run: true });
      s.move('player', 'D17', { run: true, wait: false });
      s.move('cui', 'D4 L3 D2', { run: true, wait: false }); await s.move('qiu', 'D4 L3 D1', { run: true });
      await s.say('cuidaocheng:smile', 'Run, you starving bald donkey! And don\'t come back!');
      await s.say('qiuxiaoyi:smile', 'Ha! The Flower Monk, they call him? The wilted monk!');
      s.flag('ch2_fled_cui');
      await s.warp('world', WM.worldAt('waguan')[0], WM.worldAt('waguan')[1], 'down');
      await s.say('luzhishen:sad', '(If I\'d had a meal in my belly, those two... I\'ll find something to eat and come back.)');
      await s.say(null, '(Below the monastery, on the road he came by, there was a forest of red pines.)');
    } },
    { id: 'ch2_shijin', x: 20, y: 24, char: 'shijin', dir: 'left', once: true,   // waiting among the pines; speak to him and he comes at you
      cond: function (S2) { return S2.has('ch2_fled_cui') && !S2.has('ch2_withshijin'); },
      run: shijinOnRoad },
    { id: 'ch2_shijin_road', x: 14, y: 23, w: 7, h: 3, trigger: 'touch', once: true,   // or walk into the clearing past him
      cond: function (S2) { return S2.has('ch2_fled_cui') && !S2.has('ch2_withshijin'); },
      run: shijinOnRoad },

    { id: 'ch2_cui2', x: 20, y: 13, w: 6, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_withshijin'); }, idle: { cui: 'Still on your feet, fat monk? Those old men filled your ears with lies.', qiu: '(This time Qiu Xiaoyi has his sword drawn across his knees.)' },
      run: async function (s) {
      s.spawn('cui', 'cuidaocheng', 19, 11, 'down'); s.spawn('qiu', 'qiuxiaoyi', 20, 11, 'down');
      // Shi Jin came back with him: he stands at Zhishen's side
      s.spawn('sj', 'shijin', WM.state.x - 1, WM.state.y, 'up');
      await s.say('cuidaocheng:angry', 'Back again, and with a friend? We beat you once already!');
      await s.say('luzhishen:angry', 'Now my belly\'s full. Let\'s see who wins this time!');
      await s.battle('ch2_waguan2', { bg: 'forest', music: 'boss' });
      await s.narrate('This time it was different. Cui Daocheng fell to Zhishen\'s staff, and Shi Jin ran Qiu Xiaoyi through from behind. When they went to the kitchen, they found the old monks had hanged themselves for fear of what the bandits would do to them after Zhishen\'s defeat.');
      s.place('cui', 18, 13, 'down'); s.place('qiu', 20, 14, 'down');   // where they fell, on the open ground of the court
      s.lie('cui'); s.lie('qiu');   // both dead, and left there
      s.tint('fire'); s.sfx('fire');
      await s.narrate('The two of them set fire to the monastery and watched it burn. Then they walked through the night until dawn, and parted at a crossroads: Shi Jin back to his friends on Mount Shaohua, Zhishen on to the Eastern Capital.');
      await s.say('shijin', 'Take care of yourself, brother. Send word to Shaohua if ever you need me.');
      await s.say('luzhishen', 'And you, Nine Dragons. Stay out of trouble.');
      s.tint(null);
      s.removeParty('shijin');
      s.flag('ch2_waguanwin');
      await s.warp('world', WM.worldAt('waguan')[0], WM.worldAt('waguan')[1], 'down');
      await s.say(null, '(The Great Xiangguo Monastery is in the Eastern Capital, to the south-east.)');
    } }
  ]);

  // ---------------- Kaifeng: the Great Xiangguo Monastery ----------------
  WM.defEvents('xiangguo', [
    { id: 'ch2_xg_arrive', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch2_waguanwin'); }, run: async function (s) {
      s.spawn('mk', 'monk', 15, 25, 'right');
      await s.say('monk', 'A monk from Mount Wutai, with a letter for the Abbot? This way. The Abbot\'s quarters are at the top of the court.');
      s.despawn('mk');
    } },
    { id: 'ch2_rascals', x: 17, y: 16, w: 6, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_gardener'); }, idle: { zhangsan: 'Reverend! Welcome, welcome! Come over here, by the edge, where we can greet you properly.', lisi: '(Li Si grins and edges round behind the cesspit.)', r1: 'Heh. Heh heh. The new gardener.', r2: 'Twenty cash says he goes in head first.' },
      run: async function (s) {
      s.spawn('zhangsan', 'zhangsan', 26, 16, 'left'); s.spawn('lisi', 'lisi', 26, 17, 'left');
      s.spawn('r1', 'drunk', 27, 15, 'left'); s.spawn('r2', 'gambler', 28, 17, 'left');
      await s.say('zhangsan:smile', 'Congratulations, congratulations, Reverend! We\'re your neighbours. We\'ve come to welcome you to the garden.');
      await s.moveTo('player', 24, 16, { yFirst: true });   // he walks right up to them, at the edge of the pit
      s.face('player', 'right');
      await s.say('luzhishen', '(They\'re standing round the edge of the cesspit... smiling like cats at a fishpond. Hm.)');
      await s.say('luzhishen', 'Neighbours! Then come closer and let me greet you properly.');
      await s.narrate('Zhang San and Li Si came forward as if to kneel, meaning to seize his legs and throw him into the cesspit. But before they could touch him, Zhishen shot out his right foot and his left, and sent them flying.');
      s.sfx('splash'); await s.shake(3, 0.3);
      await s.say('lisi:shock', 'Help! Get us out!');
      await s.say('gambler', 'He threw the bosses into the pit! Get him!');
      await s.battle('ch2_rascals', { bg: 'plains' });
      await s.narrate('The rest of the gang were sent sprawling one after another. Zhishen hauled Zhang San and Li Si out of the muck, stinking, and sent them off to wash.');
      // the next day: they come back with wine and meat, and kneel
      await s.fadeOut(0.8);
      s.place('player', 21, 16, 'down');
      s.place('zhangsan', 20, 17, 'up'); s.place('lisi', 22, 17, 'up'); s.place('r1', 19, 18, 'up'); s.place('r2', 23, 18, 'up');
      await s.fadeIn(0.8);
      await s.narrate('Next day they came back, washed, with a jar of wine and a pig\'s head, and knelt to him.');
      await s.say('zhangsan', 'Reverend, we were blind. From today you are our master, and we are your followers.');
      await s.say('lisi', 'Whatever the garden needs, we\'ll see to it. And the wine — we\'ll see to that too.');
      s.idle('zhangsan', 'Master, we have sworn it: whatever you need, we will see to it.');
      s.idle('lisi', 'Those crows in the old willow, Master. Cawing from dawn to dark. It\'s bad luck, they say.');
      s.idle('r1', '(hic) ...Never seen a man throw Zhang San in the muck before. Here — have some wine, Master. Our wine. Your wine.');
      s.idle('r2', 'Twenty cash I lost on you going in head first. Worth every coin, Master.');
      s.flag('ch2_rascalsdone');
    } },
    { id: 'ch2_willow', x: 28, y: 6, w: 5, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_rascalsdone'); }, idle: { zhangsan: 'Reverend, we know our betters now. Every one of us will do as you say.', lisi: 'Those crows in the willow, Reverend. Cawing from dawn to dark. It\'s bad luck, they say.' },
      run: async function (s) {
      s.spawn('zhangsan', 'zhangsan', 27, 8, 'right'); s.spawn('lisi', 'lisi', 28, 9, 'up');   // at his elbow, under the willow
      s.sfx('wind');
      await s.say('lisi', 'Those cursed crows in the willow — cawing day and night. People say it\'s bad luck. We\'ll fetch a ladder and pull the nest down.');
      await s.say('luzhishen', 'A ladder? Why bother?');
      s.sfx('earth'); s.flag('felled:xiangguo'); await s.shake(6, 0.8);   // down it comes, nest, crows and all
      await s.narrate('Zhishen walked up to the willow, looked it over, wrapped his arms around the trunk, bent his back, and with one heave pulled the whole tree out of the ground, roots and all.');
      await s.say('zhangsan:shock', '...He pulled up the willow. Roots and all.');
      await s.say('lisi:shock', 'He isn\'t a man. He\'s a living arhat!');
      s.flag('ch2_willowdone');
      s.despawn('zhangsan', { leave: true }); s.despawn('lisi', { leave: true });   // home for the day; they come back every morning
      await s.narrate('After that the rascals came every day with wine and meat. One day, to repay them, Zhishen fetched his staff and showed them his art, whirling the sixty-two catties of iron as if it were a reed.');
    } },
    { id: 'ch2_linchong', x: 17, y: 4, w: 16, h: 3, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch2_willowdone'); }, run: async function (s) {
      s.sfx('wind');
      s.spawn('linchong', 'linchong', 24, 2, 'down');
      await s.say('linchong', 'Splendid! Splendid staff-work!');
      await s.say('luzhishen', 'Who\'s that, over the wall?');
      s.spawn('zs', 'zhangsan', 18, 5, 'up');
      await s.say('zhangsan', 'That\'s the Arms Instructor of the Eight Hundred Thousand Imperial Guards, Master Lin Chong.');
      await s.say('luzhishen', 'Then come in, Instructor, come in!');
      await s.move('linchong', 'R1');
      s.despawn('linchong'); s.spawn('linchong', 'linchong', 24, 5, 'down');
      await s.say('linchong', 'Lin Chong, at your service. And you, Reverend?');
      await s.say('luzhishen', 'Lu Da, once of Weizhou. I killed too many men, so I became a monk. Your father — wasn\'t he Instructor Lin of the capital? I met him once, when I was young.');
      await s.say('linchong:smile', 'You knew my father? Then we are old friends already. Reverend, let us be brothers.');
      await s.narrate('So Lu Zhishen and Lin Chong swore brotherhood beneath the trees, with Zhishen as the elder. They had drunk only a few cups when Lin Chong\'s maid Jin\'er came running to the garden wall, out of breath, her face white.');
      s.spawn('jiner', 'jiner', 22, 2, 'right');
      await s.say('jiner:shock', 'Master! Master, come quickly! At the Temple of the Eastern Peak — a man has stopped the Mistress and won\'t let her go!');
      await s.say('linchong:angry', 'What?!');
      await s.say('linchong', 'Brother, forgive me — I must go!');
      s.despawn('jiner'); s.despawn('linchong', { leave: true }); s.despawn('zs');
      s.flag('ch2_done');
      await s.endChapter();
      if (WM.data.chapters[3].begin) await WM.data.chapters[3].begin(s);
    } }
  ]);
  WM.defEvents('xiangguo_in', [
    { id: 'ch2_zhiqing', x: 7, y: 5, npc: 'zhiqing', cond: function (S2) { return S2.has('ch2_waguanwin') && !S2.has('ch2_gardener'); }, run: async function (s) {
      await s.say('zhiqing', '(reading the letter) "...This Zhishen will in time become enlightened... I beg you to find him a post..." Hm. My brother Zhizhen has sent us a monk who smashed the guardian kings of Wutai.');
      await s.say('zhiqing', 'We have a large vegetable garden by the old Suanzao gate, plagued by idle rascals who steal the vegetables and graze their sheep. No ordinary monk can control them. You will be the gardener there.');
      await s.say('luzhishen:angry', 'Gardener? I was sent to be a steward of the monastery, not to grow cabbages!');
      await s.say('zhiqing', 'Every man rises by steps. Keep the garden a year, and you may rise to keep the pagoda; keep that a year, and you will be steward of the bath-house; and so on. Begin with the garden.');
      await s.say('luzhishen', '...Hmph. Then I\'ll keep your garden.');
      s.flag('ch2_gardener');
      await s.say(null, '(The vegetable garden is beyond the wall, on the east side of the court.)');
    } },
    // the Abbot stays in his hall: what he says follows Zhishen's time at the Xiangguo Monastery
    { id: 'zq_garden', x: 7, y: 5, npc: 'zhiqing', cond: function (S2) { return S2.has('ch2_gardener') && !S2.has('ch2_rascalsdone'); }, text: [
      'The garden is beyond the wall, on the east side of the court. The rascals who haunt it are led by two men called Zhang San and Li Si.',
      'Do not let them provoke you, Zhishen. And — I beg you — do not provoke them.'] },
    { id: 'zq_settled', x: 7, y: 5, npc: 'zhiqing', cond: function (S2) { return S2.has('ch2_rascalsdone') && !S2.has('ch3_saved'); }, text: [
      'I hear the rascals of the garden now bring you wine and call you Master. And there is a willow lying in the garden with its roots in the air.',
      '(He sighs.) My brother Zhizhen did write that you would be no ordinary gardener.'] },
    { id: 'zq_gone', x: 7, y: 5, npc: 'zhiqing', cond: function (S2) { return S2.has('ch3_saved'); }, text: [
      'Zhishen left the garden in the same month that Instructor Lin was sent into exile. Marshal Gao\'s men came here asking for him.',
      'I told them the truth: I do not know where he has gone. ...Amitabha. I hope that wherever he is, he is eating well.'] }
  ]);
})();
