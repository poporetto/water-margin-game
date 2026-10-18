// Chapter 1 — "Nine Dragons" (novel chapters 2–3).
// Wang Jin flees Gao Qiu; at the Shi Family Village he makes Shi Jin his pupil; Shi Jin befriends the
// chiefs of Mount Shaohua, is betrayed on Mid-Autumn night, burns his own manor, and wanders to Weizhou.
'use strict';
(function () {
  var L = WM.mapLib, S = WM.S;
  var KR = function () { return WM.data.kaifengRooms; };

  // ---------------- people ----------------
  WM.npc('gaoqiu', 'Gao Qiu', { skin: '#f0c49a', hairStyle: 'futou', beard: 'mustache', body: '#5a2a6a', trim: '#d8b36a', eyes: 'narrow', brows: 'angled', face: 'long' }, { face: true });
  WM.npc('wangmother', 'Wang Jin\'s Mother', { skin: '#e0a880', hair: '#b8b8b0', hairStyle: 'woman', body: '#4a4a5a', trim: '#c8c0a0', dress: true, face: 'round', eyes: 'narrow' }, { face: true });
  WM.npc('shitaigong', 'Shi Taigong', { skin: '#e0a880', hair: '#d0d0c8', hairStyle: 'scarf', band: '#3a2a1a', beard: 'long', beardColor: '#e0e0d8', body: '#6a4a2a', trim: '#d8b36a', eyes: 'narrow' }, { face: true });
  WM.npc('wangsi', 'Wang Si', { skin: '#d8a070', hairStyle: 'topknot', body: '#6a6a4a', trim: '#4a3a2a', eyes: 'narrow', face: 'round' }, { face: true });
  WM.npc('liji', 'Li Ji the Hunter', { skin: '#c8905e', hairStyle: 'headband', band: '#5a4a2a', body: '#6a5a3a', trim: '#8a6a4a', weapon: 'bow', beard: 'stubble', eyes: 'narrow', face: 'narrow' }, { face: true });
  WM.npc('dutyA', 'Duty Officer', { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#c8302a', weapon: 'dao', beard: 'short' }, { face: true });
  WM.npc('gaoofficer', 'Guard Officer', { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#8a7a3a', tassel: '#c8302a', body: '#6a2a2a', trim: '#d8b36a', weapon: 'spear' }, { face: true });
  WM.npc('zhangservant', 'Servant Zhang', { skin: '#d8a070', hairStyle: 'topknot', body: '#5a5a4a', trim: '#e8e0d0' });

  // ---------------- enemies, troops, duels ----------------
  WM.enemy('chenda_bandit', 'Shaohua Bandit', 1, WM.hum(WM.enemyLooks.bandit), { exp: 90, drops: [['bun', 0.3]] });
  WM.enemy('chenda_archer', 'Shaohua Archer', 1, WM.hum(WM.enemyLooks.banditArcher), { hp: 0.8, range: 'L', fx: 'arrow', exp: 90 });
  WM.enemy('county_runner', 'County Constable', 4, WM.hum(WM.enemyLooks.constable), { exp: 100, drops: [['bun', 0.3], ['medicine', 0.05]] });
  WM.enemy('county_archer', 'County Archer', 4, WM.hum(WM.enemyLooks.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 100 });
  WM.enemy('liji_boss', 'Li Ji', 6, WM.hum(WM.data.npcs.liji.look), { hp: 2.6, range: 'L', fx: 'arrow', exp: 220, gold: 60, boss: true, drops: [['medicine', 1]], skills: [{ name: 'Hunter\'s Volley', chance: 0.2, type: 'phys', power: 0.75, target: 'all', fx: 'arrow', sfx: 'arrow' }] });
  WM.enemy('duty_boss', 'Duty Officer', 6, WM.hum(WM.data.npcs.dutyA.look), { hp: 2.2, atk: 1.0, exp: 200, gold: 50, boss: true, drops: [['beef', 1]], skills: [{ name: 'Heavy Cut', chance: 0.25, type: 'phys', power: 1.6 }] });
  WM.data.troops.ch1_raid = { enemies: ['chenda_bandit', 'chenda_archer'], bg: 'plains', noRun: true };
  WM.data.troops.ch1_gate = { enemies: ['county_runner', 'county_runner', 'county_archer'], bg: 'night', noRun: true };
  WM.data.troops.ch1_yard = { enemies: ['county_runner', 'county_runner', 'county_archer'], bg: 'fire', noRun: true };
  WM.data.troops.ch1_boss = { enemies: ['duty_boss', 'liji_boss'], bg: 'fire', boss: true };

  WM.data.duels.wangjin_shijin = {
    hero: 'wangjin', foe: 'shijin', bg: 'plains', heroHp: 420, heroAtk: 60, foeHp: 420, foeAtk: 32,   // (the lessons take about 280 of his)
    pattern: ['wild', 'attack', 'defend'],
    intro: [['foe', 'You think you can teach me? Pick up a staff and we\'ll see who laughs!'], ['hero', 'If your father permits it. Come then, young master.'],
      ['hero', '(He is young and proud, and every move he means to make shows in his face first. Let me teach him to read it.)']],
    // the first duel in the game: Wang Jin teaches Shi Jin, and the player, how a duel is read
    lessons: [
      { move: 'attack', foe: 'Hah! Straight at you. Here comes my staff!',
        tip: 'You lean in before every thrust, young master. I can see the attack coming. Let me teach you the brute attack: one heavy blow goes straight through it.', answer: 'wild',
        after: [['foe:shock', 'Ugh! You ran right through my staff!'], ['hero', 'Because you came at me plainly. An attack breaks before a heavier blow.']],
        missed: [['hero', '(Not like that. When he attacks, a brute attack is the answer.)']] },
      { move: 'defend', foe: 'Fine. Then I\'ll keep my guard up and wait for you this time.',
        tip: 'You hide behind your staff and wait for me. In that case it is my turn to attack. A steady attack breaks a guard that only waits.', answer: 'attack',
        after: [['foe', 'My guard... you just knocked it aside!'], ['hero', 'A guard that only waits is a door left on the latch.']],
        missed: [['hero', '(He was waiting behind his guard. That was the moment to attack.)']] },
      { move: 'wild', foe: 'Enough of this! Everything I\'ve got, Nine Dragons!',
        tip: 'Now you lose your temper and swing with all your strength. Time for me to calm down and defend. Let the wild blow spend itself.', answer: 'defend',
        after: [['foe:shock', 'I hit nothing but air... and then you were behind my staff!'], ['hero', 'Rage is strength thrown away. Guard against it, and it falls on its face.']],
        missed: [['hero', '(Against fury, keep calm and defend. Let him exhaust himself.)']] }
    ],
    afterLessons: [['hero', 'Attack breaks a guard, a brute blow breaks an attack, a calm guard breaks a brute blow. That is all a duel is. Read the man, not the staff.'],
      ['foe:angry', 'Enough lessons! This time I won\'t give anything away!'], ['hero', '(He will, though. Watch what he says.)']],
    lines: {
      attack: ['Hah! Take this!', 'Here comes my staff!', 'Straight at you — block this!'],
      wild: ['Everything I\'ve got — Nine Dragons!', 'I\'ll knock you flat in one blow!', 'No holding back now!'],
      defend: ['Let\'s see what you\'ve got first.', 'Come on, old man — come at me!', 'I\'m watching your staff...']
    },
    win: [['foe:sad', '...My staff... gone. And I\'m on my back. How?'], ['hero', 'Strength without method is a door without a bolt, young master.']],
    lose: [['foe:smile', 'Ha! Some instructor!']]
  };
  WM.data.duels.shijin_chenda = {
    hero: 'shijin', foe: 'chenda', bg: 'plains', heroHp: 260, heroAtk: 44, foeHp: 230, foeAtk: 30,
    intro: [['foe', 'We only want to borrow your road to Huayin. Stand aside, boy!'], ['hero', 'Borrow my road? Get past my blade first!']],
    lines: {
      attack: ['Have at you!', 'My spear will settle this!', 'Hyah!'],
      wild: ['I\'ll put a hole right through you!', 'The Stream-Leaping Tiger pounces!', 'All or nothing!'],
      defend: ['Hm. You\'re quicker than you look.', 'Come on then, show me.', 'Careful, Chen Da...']
    },
    win: [['foe:shock', 'Aaagh!'], ['hero', 'Down you come. Tie him up!']],
    lose: [['foe:smile', 'Village boy!']]
  };

  // ---------------- chapter start ----------------
  WM.data.chapters[1].begin = async function (s) {
    await s.chapter(1);
    s.party(['wangjin']); s.setLeader('wangjin'); s.level('wangjin', 12);
    s.flag('protagonist', 'wangjin');
    await s.warp('kaifeng_gao', 5, 11, 'up', { noFade: true });
    await s.fadeIn(0.8);
  };
  WM.data.chapters[1].debugStart = async function (s) {
    WM.S.newGame(); WM.state.flags.pro_done = true; WM.unlock('longhu');
    await WM.data.chapters[1].begin(s);
  };

  // ---------------- Kaifeng: Gao Qiu and Wang Jin ----------------
  WM.defEvents('kaifeng_gao', [
    { id: 'ch1_gao', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return WM.state.chapter === 1; }, run: async function (s) {
      s.music('palace');
      s.spawn('gaoqiu', 'gaoqiu', 5, 4, 'down');
      s.spawn('o1', 'gaoofficer', 3, 6, 'right'); s.spawn('o2', 'gaoofficer', 8, 6, 'left');
      s.spawn('o3', 'officer', 3, 8, 'right'); s.spawn('o4', 'officer', 8, 8, 'left');
      await s.narrate('On his first day as Grand Marshal, Gao Qiu took his seat in the Marshal\'s hall, and all the officers of the Imperial Guard came to pay their respects. Only one name on the roll went unanswered: Wang Jin, arms instructor to the eight hundred thousand guards, who had been sick in bed for half a month.');
      await s.narrate('Gao Qiu flew into a rage. "He mocks me! He pretends to be ill!" He sent men to drag the instructor before him. Wang Jin, still feverish, had no choice but to come.');
      await s.move('player', 'U4');
      await s.say('gaoqiu:angry', 'So. You are Wang Jin. The son of Wang Sheng, the staff-fighter who used to put on shows in the streets?');
      await s.say('wangjin', 'I am, Your Excellency.');
      await s.say('gaoqiu:angry', 'Your father was a vagabond who sold quack medicines in the marketplace. What do you know of martial arts? The last Marshal must have been blind to give you a post. And now you dare to ignore my summons — feigning sickness, lying at home!');
      await s.say('wangjin', 'I would not dare, Excellency. I have been truly ill, and I am not yet recovered —');
      await s.say('gaoqiu:angry', 'If you were ill, how did you walk here? Guards! Take him out and beat him!');
      await s.emote('o1', '!');
      await s.say('gaoofficer:concerned', 'Your Excellency, today is your first day in office — the most auspicious of days. We beg you, spare him this once.');
      await s.say('gaoqiu', '...Hmph. For the sake of the officers, I will let it pass today. Tomorrow I will deal with you. Get out.');
      await s.move('player', 'D2');
      await s.face('player', 'up');
      await s.say('wangjin:sad', '(I knew that face. Gao Er, the street tough — the one my father knocked flat with a single stroke of his staff, so badly hurt he lay in bed three months. So that is the new Marshal. Today he spared me before the officers. Tomorrow he will have his revenge.)');
      s.despawn('gaoqiu'); s.despawn('o1', { leave: true }); s.despawn('o2', { leave: true }); s.despawn('o3', { leave: true }); s.despawn('o4', { leave: true });
      await s.warp('kaifeng_in', 6, 6, 'up');
      s.spawn('mother', 'wangmother', 4, 4, 'down');
      await s.say('wangjin:sad', 'Mother, the new Grand Marshal is Gao Er — the street-tough Father once beat half to death. He has power over me now, and he means to use it.');
      await s.say('wangmother:sad', 'Aiya... There is an old saying, my son: "Of the thirty-six ways out, running is the best." But where in all the world could we go?');
      await s.say('wangjin', 'Old Minister Chong commands the frontier at Yan\'an. Many of his officers have seen me teach, and they value the art. If we go to him, we will be safe.');
      await s.say('wangjin', 'Gao Qiu has set two servants, Zhang and Li, to watch the house. I will tell them we made a vow at the Temple of the Eastern Peak and must offer incense at dawn. Zhang can go ahead tonight to prepare the offerings, and Li can buy the sacrifice. When they are gone, we leave.');
      await s.say('wangmother', 'Then let us pack what we can carry. Quietly.');
      s.night(true);
      s.flag('ch1_flee');
      s.despawn('mother');
      await s.narrate('That night Wang Jin saddled their horse, set his mother on its back, tied their bundles behind her, and led the horse out into the dark streets. "Leave by the South Gate," he told himself. "By the time anyone thinks to look for us, we must be far away."');
    } }
  ]);
  WM.defEvents('kaifeng_in', [
    { id: 'ch1_home', x: 4, y: 4, trigger: 'check', cond: function (S2) { return S2.has('ch1_flee') && !S2.has('ch1_fled'); }, text: ['Everything we can carry is already on the horse. There is nothing more to take.'] }
  ]);
  WM.defEvents('kaifeng', [
    { id: 'ch1_gate', x: 28, y: 42, w: 4, h: 1, trigger: 'touch', cond: function (S2) { return S2.has('ch1_flee') && !S2.has('ch1_fled'); }, idle: { mother: 'I have tied up what we can carry. Don\'t look back at the house, son. Gao Qiu never forgets a grudge.' },
      run: async function (s) {
      s.spawn('mother', 'wangmother', 30, 40, 'down');
      await s.say('wangmother', 'The gate guards are asleep. Go, my son. Go quickly.');
      s.flag('ch1_fled'); s.night(false);
      s.despawn('mother');
      await s.fadeOut(1);
      await s.narrate('Next morning the servant Li waited at the temple until noon, then hurried back to find the house empty. When word reached Gao Qiu, he flew into a fury and sent out an order through every prefecture for the arrest of the runaway Wang Jin.');
      await s.narrate('Mother and son travelled more than a month, west through the mountains, sleeping in poor inns and sometimes not at all. One evening, as the sun went down, they found they had missed the last inn, and saw lights through the trees ahead.');
      WM.unlock('shivillage');
      s.flag('ch1_arrive');
      await s.warp('shivillage', 14, 21, 'up', { noFade: true });
      await s.fadeIn(1);
    } },
    { id: 'ch1_gatelock', x: 28, y: 42, w: 4, h: 1, trigger: 'touch', cond: function (S2) { return WM.state.chapter === 1 && !S2.has('ch1_flee'); }, run: async function (s) {
      await s.say('wangjin', 'I should go home and tell Mother first.');
      await s.move('player', 'U1');
    } },
    { id: 'ch1_houseHint', x: 7, y: 41, trigger: 'touch', once: true, cond: function (S2) { return WM.state.chapter === 1 && S2.has('ch1_flee'); }, text: ['(Wang Jin\'s house is behind you. The South Gate is straight down the main avenue.)'] }
  ]);

  // ---------------- Shi Family Village ----------------
  var shiActive = function (S2) { return S2.has('ch1_arrive') && !(S2.has('ch1_fire') && !S2.has('ch1_escaped')); };
  WM.defEvents('shivillage', [
    { id: 'ch1_arrival', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch1_arrive'); }, run: async function (s) {
      s.music('field');
      s.tint('dusk');
      s.spawn('mother', 'wangmother', 15, 22, 'up');
      s.spawn('servant', 'servant', 15, 17, 'down');
      await s.move('servant', 'D2');
      await s.say('wangjin', 'Friend, my mother and I have travelled far and missed the inn. May we beg a night\'s lodging? We will pay for the room.');
      await s.say('servant', 'Wait here. I\'ll ask the Taigong.');
      await s.move('servant', 'U3');
      s.despawn('servant');
      await s.wait(0.6);
      await s.narrate('The servant soon returned and led them through the gate and into a great hall, where an old man of more than sixty, his beard white as frost, rose to greet them. This was the master of the Shi Family Village, whom everyone called Shi Taigong.');
      s.despawn('mother');
      await s.warp('shivillage_in', 9, 7, 'up');
      s.spawn('taigong', 'shitaigong', 9, 4, 'down');
      s.spawn('mother', 'wangmother', 7, 7, 'up');
      await s.say('shitaigong', 'Please, please, sit. Travellers on the road at this hour must be weary. Where have you come from?');
      await s.say('wangjin', 'My name is Zhang. We came from the Eastern Capital, where I lost my capital in trade. I am taking my mother to relatives in Yan\'an.');
      await s.say('shitaigong:smile', 'Then you will eat with us and sleep here tonight. No talk of payment. Who carries his house on his back when he travels?');
      await s.fadeOut(0.8);
      await s.narrate('But in the night Wang Jin\'s mother was taken with pains in her chest, and by morning she could not rise. The kindly Taigong would not hear of them leaving. He sent to the county town for medicine and told Wang Jin to stay until she was well.');
      await s.narrate('Five or six days later, her illness easing, Wang Jin went out behind the hall to see to the horse. There, in the threshing yard, a young man stood stripped to the waist, tattooed from shoulders to chest with blue dragons, practising with a staff.');
      s.despawn('taigong', { leave: true }); s.despawn('mother', { leave: true });
      s.tint(null);
      s.flag('ch1_yard');
      await s.warp('shivillage', 16, 15, 'up', { noFade: true });
      await s.fadeIn(0.8);
    } },
    { id: 'ch1_shijinyard', x: 16, y: 13, char: 'shijin', dir: 'left', cond: function (S2) { return S2.has('ch1_yard') && !S2.has('ch1_duelled'); }, run: async function (s) {
      await s.say('wangjin', '(He has strength, and speed. But his footwork... His staff work is all for show.)');
      await s.say('wangjin', 'Not bad, that staff. But it has gaps in it. It would never stand against a real master.');
      await s.say('shijin:angry', 'What did you say? I\'ve studied under seven or eight famous teachers! Who are you to laugh at my staff?');
      s.spawn('taigong', 'shitaigong', 16, 10, 'down');
      await s.move('taigong', 'D1');
      await s.say('shitaigong', 'Son! Where are your manners? This is our guest.');
      await s.say('shijin:angry', 'He mocks my art, Father! If he can beat me, I\'ll take him for my teacher. Let him take up a staff!');
      await s.say('shitaigong', '...Master Zhang, if you know the staff, would you instruct my son? He is too proud by half.');
      await s.say('wangjin', 'If the Taigong permits it, I will show the young master a few things.');
      var r = await s.duel('wangjin_shijin', { canLose: true });
      if (r === 'lose') {
        await s.say('wangjin', '(I held back too much. Again, properly this time.)');
        await s.duel('wangjin_shijin', { canLose: true, noLessons: true });
      }
      s.flag('ch1_duelled');
      await s.narrate('Wang Jin did not strike him down. He stepped back and swept the staff across, and Shi Jin\'s own staff flew from his hands as he went over backwards. Wang Jin threw his staff aside and helped him up.');
      await s.say('shijin:shock', 'I studied for years and paid a fortune for my teachers... and I was nothing. Master! Please, accept me as your pupil!');
      await s.say('shitaigong', 'Master Zhang, you are no ordinary merchant. Who are you?');
      await s.say('wangjin', '...Taigong, you have been kind to us, so I will not lie to you. My name is not Zhang. I am Wang Jin, arms instructor of the Imperial Guard in the Eastern Capital. Gao Qiu, the new Grand Marshal, hated my father and meant to destroy me, so I fled with my mother. We are going to Old Minister Chong at Yan\'an.');
      await s.say('shitaigong:smile', 'An instructor of the Imperial Guard, under my roof! Heaven has sent you. Stay as long as you like and teach my son. We will see that you want for nothing.');
      await s.say('shitaigong', 'This boy is Shi Jin, my only son. He would never look at a plough. All he wants is spear and staff, and he spent his mother\'s heart\'s blood on teachers. He had a craftsman tattoo nine dragons on his body, so the whole county calls him "Nine Dragons Shi Jin."');
      await s.say('shijin', 'Master, I swear I will learn everything you teach me.');
      s.despawn('taigong', { leave: true });
      await s.fadeOut(1);
      await s.narrate('So Wang Jin and his mother stayed at the Shi Family Village. Day after day Wang Jin taught Shi Jin from the beginning: the eighteen weapons of war, the spear and the staff, the sword and the halberd, the bow and the crossbow, the axe and the hammer, until he had mastered every one.');
      await s.narrate('Half a year went by. Wang Jin saw that his pupil had learned all he had to teach, and that the longer he stayed, the more likely Gao Qiu\'s men would find him. One day he told the Taigong that he must go on to Yan\'an.');
      s.hide('shijin');
      s.spawn('mother', 'wangmother', 14, 21, 'down');
      s.spawn('wangjinA', 'wangjin', 15, 21, 'down');
      s.spawn('taigong', 'shitaigong', 13, 19, 'down');
      s.place('player', 14, 19, 'down');
      s.party(['shijin']); s.setLeader('shijin'); s.level('shijin', 5);
      WM.state.chars.shijin.equip.head = 'bandana'; WM.state.chars.shijin.equip.body = 'quilted'; S.restore('shijin');
      s.give('bun', 5, true); s.give('medicine', 2, true); s.gold(200, true);
      s.flag('protagonist', 'shijin');
      await s.fadeIn(1);
      await s.say('shijin:sad', 'Master, stay with us. We will look after you and your mother all your lives. Why go to the frontier?');
      await s.say('wangjin', 'You have been more than good to us, my pupil. But I am a fugitive. If Gao Qiu learned I was here, your whole family would suffer for it. At Yan\'an, among soldiers, I can serve and be safe.');
      await s.say('wangjin', 'You have learned all I know. Practise every day. And one more thing — a man\'s art is for protecting the weak. Do not let it lead you into trouble.');
      await s.say('shitaigong', 'Take this silver for the journey, Instructor. One hundred taels — no, don\'t refuse. You have given my son more than silver can pay for.');
      await s.say('wangmother:smile', 'May Heaven repay your kindness, Taigong.');
      await s.move('wangjinA', 'D9', { wait: false }); await s.move('mother', 'R2 D9');   // side by side down the road   // down the village road
      s.despawn('wangjinA', { leave: true }); s.despawn('mother', { leave: true });
      await s.say('shijin:sad', 'Farewell, Master...');
      await s.fadeOut(1);
      s.despawn('taigong', { leave: true });
      await s.narrate('Wang Jin and his mother went on their way to Yan\'an, and Shi Jin returned to his practice. But not half a year later Shi Taigong fell ill, and no physician could save him. Shi Jin buried his father with all due rites on the hill behind the village. Now the master of the manor, he cared even less for farming than before. Every day he practised spear and staff, and the village went on as best it could.');
      s.flag('ch1_shijin');
      s.place('player', 16, 14, 'down');
      await s.fadeIn(1);
      await s.say('shijin', '(Father is gone, and Master Wang too. This manor is mine to protect now.)');
    } },
    // --- Shi Jin's village, before the raid ---
    { id: 'v_liji', x: 22, y: 20, npc: 'liji', cond: function (S2) { return S2.has('ch1_shijin') && !S2.has('ch1_midautumn'); }, text: ['Young master! I caught a fine buck in the hills yesterday. The hunting\'s good, if it weren\'t for the bandits of Mount Shaohua.', 'They say there are three chiefs up there with five or seven hundred men. Zhu Wu the strategist, Chen Da who leaps streams, and Yang Chun the white-spotted snake.'] },
    { id: 'v_wangsi', x: 10, y: 19, npc: 'wangsi', cond: function (S2) { return S2.has('ch1_shijin') && !S2.has('ch1_midautumn'); }, text: ['Young master, the elders want to form a militia. If the bandits come down, we\'ll sound the clappers and every household will turn out.'] },
    { id: 'v_farmer', x: 27, y: 21, npc: 'farmer', wander: true, cond: shiActive, text: ['The fields won\'t plough themselves, but the young master won\'t plough them either! Ha! Still, there\'s no one I\'d rather have between us and Mount Shaohua.'] },
    { id: 'v_child', x: 18, y: 28, npc: 'child', wander: true, cond: shiActive, text: ['When I grow up I\'m going to get nine dragons too! Maybe ten!'] },
    { id: 'v_save', x: 8, y: 21, npc: 'recorder', cond: shiActive, run: async function (s) { var k = await s.ask('recorder', 'I keep the village register. Shall I record your deeds?', ['Write a record', 'Not now']); if (k === 0) await s.saveMenu(); } },
    { id: 'v_sign', x: 12, y: 21, trigger: 'check', text: ['Shi Family Village, Huayin County. To the north-east, Mount Shaohua.'] },
    { id: 'v_yardsign', x: 12, y: 16, trigger: 'check', text: ['A rack of weapons: spear, staff, sabre, halberd... Shi Jin practises with all eighteen.'] },
    // the raid
    { id: 'ch1_raid', x: 28, y: 18, w: 6, h: 4, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch1_shijin'); }, idle: { villagerA: '(He is bent double by the gate, gasping.) Young master — the north road — let me get my breath —' },
      run: async function (s) {
      s.spawn('villagerA', 'villager2', 33, 19, 'left');
      await s.move('villagerA', 'L2', { run: true });
      await s.say('villager2', 'Young master! Bandits from Mount Shaohua! A hundred and more, coming down the north road! They say their chief is the one called Chen Da!');
      await s.say('shijin:angry', 'Sound the clappers! Every man take up a weapon and follow me!');
      s.despawn('villagerA');
      s.music('tense');
      s.spawn('chenda', 'chenda', 30, 3, 'down');
      s.spawn('b1', 'bandit', 30, 1, 'down'); s.spawn('b2', 'bandit', 31, 2, 'down');   // in file behind Chen Da, over the bridge
      await s.moveTo('player', 30, 9, { run: true, yFirst: false });
      await s.move('chenda', 'D3'); s.move('b1', 'D3', { wait: false }); await s.move('b2', 'D3');
      await s.say('chenda', 'We of Mount Shaohua are short of grain. We mean to borrow from Huayin county, and your village lies on the road. Let us pass and we won\'t touch a blade of grass.');
      await s.say('shijin:angry', 'I am the head of this village now, and the county would hold us guilty if we let you pass. If you want to go through here, you go through me.');
      await s.say('chenda:angry', 'Then I\'ll cut my way through! Men, at them!');
      await s.battle('ch1_raid', { bg: 'plains' });
      await s.say('chenda:angry', 'Enough of these village boys. You and me, Nine Dragons!');
      await s.duel('shijin_chenda');
      s.lie('b1'); s.lie('b2'); s.lie('chenda');   // beaten down on the road
      await s.narrate('The two fought back and forth on the road. At last Shi Jin feinted, let Chen Da\'s spear thrust past him, seized him by the belt and dragged him from his horse. The bandits who could still stand fled back up the mountain. The villagers bound Chen Da and dragged him to the manor.');
      s.music('field');
      await s.say('shijin', 'Tie him to a pillar in the yard, and bind those two of his as well. When we have the other two chiefs too, we\'ll hand them all to the magistrate and claim the reward.');
      s.despawn('chenda'); s.despawn('b1'); s.despawn('b2');   // bound and carried off to the yard (Chen Da to the pillar)
      await s.fadeOut(0.5); await s.fadeIn(0.5);
      s.flag('ch1_captured');
    } },
    { id: 'ch1_bound', x: 13, y: 14, char: 'chenda', dir: 'down', cond: function (S2) { return S2.has('ch1_captured') && !S2.has('ch1_oath'); }, text: ['(Chen Da glowers at you from the pillar he is tied to.)'] },
    { id: 'ch1_plea', x: 14, y: 22, w: 3, h: 2, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch1_captured'); }, idle: { zhuwu: 'We have come on foot, without weapons. Tell Master Shi that Zhu Wu and Yang Chun of Mount Shaohua are at his gate.', yangchun: '(Yang Chun stands in the road with his empty hands at his sides, and says nothing.)', sv: 'Young master! There are two men at the gate — from the mountain!' },
      run: async function (s) {
      s.spawn('zhuwu', 'zhuwu', 15, 30, 'up'); s.spawn('yangchun', 'yangchun', 16, 30, 'up');
      s.spawn('sv', 'servant', 16, 21, 'left');
      await s.say('servant', 'Young master! Two men from the mountain at the gate — on foot, unarmed! They say they\'ve come to... to surrender themselves.');
      s.despawn('sv');
      await s.face('player', 'down');
      await s.move('zhuwu', 'U5', { wait: false }); await s.move('yangchun', 'U5');
      await s.narrate('Zhu Wu and Yang Chun came before Shi Jin and dropped to their knees, tears running down their faces.');
      await s.say('zhuwu:sad', 'We three were driven to the mountain by officials who would not let honest men live. When we swore brotherhood, we vowed: not born on the same day, we would die on the same day. Our brother Chen Da would not listen to our advice and has offended your house. We cannot save him — so we have come to die with him.');
      await s.say('yangchun:sad', 'Hand us to the magistrate with him and claim your reward, hero. We will not raise a hand.');
      await s.say('shijin', '(They came on foot, without weapons, to die beside their brother...)');
      await s.say('shijin', 'If they are so loyal to each other, and I hand them over for a reward, the heroes of the land would laugh at me — and rightly. Get up, both of you. Untie Chen Da.');
      s.flag('ch1_oath');
      s.spawn('chendaF', 'chenda', 13, 22, 'right');
      await s.say('chenda', '...You would let me go? After I raided your village?');
      await s.say('shijin:smile', 'You came for grain, not blood. Let\'s drink to it instead. Come inside, all three of you!');
      await s.say('zhuwu:smile', 'Nine Dragons Shi Jin... your name is well earned. We will not forget this.');
      await s.fadeOut(1);
      s.despawn('zhuwu'); s.despawn('yangchun'); s.despawn('chendaF');
      await s.narrate('After that day the three chiefs of Mount Shaohua and Shi Jin became fast friends. Zhu Wu sent thirty taels of gold, and later a string of great pearls, by night to the manor in thanks. Shi Jin had three suits of red silk brocade made, and roasted fat sheep, and sent them up the mountain by his servant Wang Si.');
      await s.narrate('So time passed, and the Mid-Autumn Festival came round. Shi Jin wanted to invite his three friends to enjoy the full moon at his manor, and sent Wang Si up the mountain with a letter of invitation.');
      await s.narrate('At the stockade the chiefs gave Wang Si four or five bowls of wine and silver for his trouble, and Zhu Wu wrote a reply.');
      // the road down from the mountain, by moonlight: Wang Si, the letter, and the hunter
      s.night(true);
      s.hide('player'); s.camera(32, 3, 0.01);
      s.spawn('ws', 'wangsi', 31, 0, 'down');
      await s.fadeIn(0.8);
      await s.move('ws', 'D2', { speed: 28 });
      await s.say('wangsi', '(hic) Four bowls... five bowls... and silver for Wang Si, and a fine reply for the young master... (hic) Just a little rest. Just under this tree. Just for a...');
      await s.move('ws', 'R2', { speed: 28 });
      s.lie('ws'); s.emote('ws', 'zzz', 2);
      await s.wait(0.8);
      s.spawn('lj', 'liji', 37, 1, 'left');
      await s.move('lj', 'L2');
      await s.say('liji', 'Who\'s snoring in my trap-ground? ...Wang Si, from the Shi manor, drunk as a lord. And what\'s this beside him — silver? And a letter?');
      s.emote('lj', '!', 1);
      await s.say('liji:shock', '"...From Zhu Wu, Chen Da and Yang Chun, of Mount Shaohua, to our brother Shi Jin..." The Shaohua bandits! There are three thousand strings on their heads — and the young master of Shi Village drinks with them!');
      s.despawn('lj', { leave: true });
      await s.narrate('Li Ji pocketed the silver and the letter and went straight to the county town.');
      await s.fadeOut(0.8);
      s.hide('ws'); s.despawn('ws'); s.cameraReset(); s.show('player');
      s.flag('ch1_midautumn');
      await s.warp('shivillage_in', 9, 7, 'up', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);

  // ---------------- Mid-Autumn night ----------------
  WM.defEvents('shivillage_in', [
    { id: 'ch1_feast', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch1_midautumn'); }, run: async function (s) {
      s.music('field');
      s.spawn('zhuwu', 'zhuwu', 7, 5, 'right'); s.spawn('chenda', 'chenda', 11, 5, 'left'); s.spawn('yangchun', 'yangchun', 9, 4, 'down');
      s.place('player', 9, 6, 'up');
      await s.say('zhuwu:smile', 'A full moon, good wine, and a host like Nine Dragons. Brothers, we are fortunate men.');
      await s.say('chenda:smile', 'To Shi Jin! May the moon shine on us like this every year!');
      await s.say('yangchun', 'To the moon. And to brothers.');
      s.stopMusic();
      s.sfx('drum'); await s.wait(0.4); s.sfx('drum');
      await s.emote('zhuwu', '!');
      await s.say(null, '(Outside, a great shout goes up. Through the windows, the night glows red with torches.)');
      s.spawn('servantA', 'servant', 9, 10, 'up');
      await s.move('servantA', 'U2', { run: true });
      await s.say('servant', 'Young master! Soldiers! The county\'s two duty officers and three or four hundred men with torches — they have the whole manor surrounded! Li Ji the hunter is with them!');
      await s.say('shijin:shock', 'What?!');
      s.despawn('servantA');
      await s.say('zhuwu:sad', 'Brother, you are an honest man. We will not drag you into this. Tie us up and hand us over — you can claim the reward and keep your name clean.');
      await s.say('shijin:angry', 'Never! If I did that, I would be the lowest dog under heaven. We live together or we die together.');
      await s.say('shijin', 'Wang Si! Get in here!');
      s.spawn('wangsi', 'wangsi', 8, 10, 'up');   // he comes up beside the servant who brought the news
      await s.move('wangsi', 'U2');
      await s.say('wangsi:sad', 'Y-young master...');
      await s.say('shijin:angry', 'Where is the reply letter Zhu Wu gave you?');
      await s.say('wangsi:sad', 'I... I had a few cups on the way back and fell asleep in the woods. When I woke it was gone. I was afraid to tell you...');
      await s.say('shijin:angry', 'So that is how Li Ji knew! You have brought ruin on this house!');
      await s.narrate('In his fury Shi Jin cut Wang Si down where he stood. Then he went to the gate and called out to the officers, asking for time to bind the bandits and hand them over. While the officers waited, he and the three chiefs set fire to the manor from back to front, packed what gold and silver they could carry, and took up their weapons.');
      s.lie('wangsi');   // cut down where he stood
      // the three chiefs step in beside Shi Jin and fall in with him, one notice for each
      var lead = s.actor('player').tile();
      s.moveTo('zhuwu', lead.x, lead.y, { wait: false }); s.moveTo('yangchun', lead.x, lead.y, { wait: false }); await s.moveTo('chenda', lead.x, lead.y);
      await s.wait(0.3);
      s.hide('zhuwu'); s.hide('chenda'); s.hide('yangchun');   // stepped into Shi Jin
      s.despawn('zhuwu'); s.despawn('chenda'); s.despawn('yangchun');
      s.addParty('zhuwu'); s.addParty('chenda'); s.addParty('yangchun');
      s.level('zhuwu', 4); s.level('chenda', 4); s.level('yangchun', 4);
      WM.state.party = ['shijin', 'chenda', 'yangchun', 'zhuwu'];
      s.heal();
      s.flag('ch1_fire');
      s.give('medicine', 2, true); s.give('bun', 4, true);
      await s.say('shijin', 'My father\'s house... let it burn. We fight our way out. Brothers, stay close!');
      s.music('battle');
    } }
  ]);
  var fireActive = function (S2) { return S2.has('ch1_fire') && !S2.has('ch1_escaped'); };
  WM.defEvents('shivillage', [
    { id: 'ch1_firestart', trigger: 'auto', once: true, x: 0, y: 0, cond: fireActive, run: async function (s) {
      s.tint('fire'); s.music('tense');
      await s.say('zhuwu', 'The soldiers are thickest at the front gate. Cut through the yard and out by the south road — Mount Shaohua is our only refuge now.');
    } },
    { id: 'ch1_yardfight', x: 12, y: 15, w: 9, h: 2, trigger: 'touch', once: true, cond: fireActive, run: async function (s) {
      s.sfx('fire');
      s.spawn('d1', 'dutyA', 14, 17, 'up'); s.spawn('d2', 'dutyA', 16, 17, 'up');
      await s.say('dutyA:angry', 'There they are! Don\'t let them escape!');
      await s.battle('ch1_yard', { bg: 'fire' });
      s.despawn('d1', { leave: true }); s.despawn('d2', { leave: true });
    } },
    { id: 'ch1_bossfight', x: 12, y: 24, w: 5, h: 2, trigger: 'touch', once: true, cond: fireActive, idle: { liji: 'Not one step further, Shi Jin. The constables hold every gate, and the reward is as good as mine.', d1: 'Stand back! By order of the magistrate of Huayin county!', d2: '(The duty officer\'s spear shakes in the firelight.)' },
      run: async function (s) {
      s.spawn('liji', 'liji', 14, 27, 'up'); s.spawn('d1', 'dutyA', 13, 27, 'up'); s.spawn('d2', 'dutyA', 15, 27, 'up');
      await s.say('liji', 'Shi Jin! Give yourself up! You\'re harbouring bandits — the reward\'s already as good as mine!');
      await s.say('shijin:angry', 'Li Ji, you treacherous dog! I\'ll settle with you first!');
      await s.battle('ch1_boss', { bg: 'fire', music: 'boss' });
      await s.narrate('Shi Jin cut Li Ji in two with a single stroke. The two duty officers turned to flee, and Chen Da and Yang Chun ran them down. The rest of the soldiers scattered in every direction. Behind them the Shi Family manor burned to the ground.');
      s.lie('liji'); s.lie('d1'); s.lie('d2');   // Li Ji cut down, the duty officers run down
      s.flag('ch1_escaped'); s.tint(null); s.night(false);
      WM.unlock('shaohua');
      s.music('world');
      await s.say('zhuwu', 'To Mount Shaohua, brother. North-east of here — the path climbs through the forest.');
    } }
  ]);

  // ---------------- Mount Shaohua ----------------
  var shiJinHere = function () { return WM.state.chapter === 1 && WM.state.party.indexOf('shijin') >= 0; };
  WM.defEvents('shaohua', [
    // the hill's sentries: they speak to Shi Jin as one of their own when he comes up with the chiefs, and to anyone
    // else who comes later as what they are, the men of a robber hill
    { id: 'sh_guard1', x: 13, y: 12, npc: 'bandit', cond: function (S2) { return S2.has('ch1_escaped'); }, run: async function (s) {
      if (shiJinHere()) await s.say('bandit', 'The chiefs are back! And Nine Dragons with them! Make way!');
      else await s.say('bandit', 'Mount Shaohua. Zhu Wu, Chen Da and Yang Chun keep this hill. State your business, stranger, and keep your hand off your weapon while you do it.');
    } },
    { id: 'sh_guard2', x: 17, y: 9, npc: 'bandit', cond: function (S2) { return S2.has('ch1_escaped'); }, run: async function (s) {
      if (shiJinHere()) await s.say('bandit', 'Our chiefs owe their lives to you, Master Shi. This mountain is yours as much as theirs.');
      else await s.say('bandit', 'We don\'t touch the poor folk who use this road, only fat officials and their tax silver. The chiefs swore it, the day Master Shi of Shi Village spared their lives.');
    } },
    L.cache('sh_cache1', 9, 9, 'medicine', 2),
    { id: 'sh_jars', x: 9, y: 9, trigger: 'check', cond: function (S2) { return S2.has('ev:shaohua:sh_cache1'); }, text: ['Empty tents.'] }
  ]);
  WM.defEvents('shaohua_in', [
    { id: 'sh_rest', x: 2, y: 3, trigger: 'check', run: async function (s) { var k = await s.ask(null, 'A pile of furs to sleep on. Rest here?', ['Rest', 'No']); if (k === 0) { await s.fadeOut(0.5); WM.S.restoreAll(); await s.wait(0.6); await s.fadeIn(0.5); } } },
    { id: 'ch1_hall', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch1_escaped'); }, run: async function (s) {
      s.spawn('zhuwu', 'zhuwu', 8, 4, 'down'); s.spawn('chenda', 'chenda', 6, 5, 'right'); s.spawn('yangchun', 'yangchun', 10, 5, 'left');
      s.heal();
      WM.state.party = ['shijin'];
      s.setLeader('shijin');
      await s.move('player', 'U4');
      await s.say('zhuwu', 'Brother, rest here a while. When the hunt for you dies down, we will think of what comes next. Better still — stay. Be our chief. With your skill, Mount Shaohua would be the strongest stronghold in the west.');
      await s.say('shijin', 'No. I am the son of an honest family. My father kept a good name all his life, and I won\'t soil it as a mountain bandit.');
      await s.say('shijin', 'My teacher, Wang Jin, has gone to serve at the frontier. I will go and find him. With his help, perhaps I can make something of myself yet.');
      await s.say('chenda:sad', 'Then at least take silver for the road. And come back to us, if ever you need to.');
      await s.say('yangchun', 'The mountain will be here.');
      await s.say('shijin', 'Farewell, brothers. We\'ll meet again.');
      await s.fadeOut(1);
      s.despawn('zhuwu'); s.despawn('chenda'); s.despawn('yangchun');
      s.gold(150, true);
      await s.narrate('Shi Jin left his rich clothes and most of his silver at the stockade. He tied on a plain felt cap, tucked a sword in his belt, slung his bundle over his shoulder, and set off alone on the road to the north-west, to look for Instructor Wang. After half a month on the road he came to Weizhou, where there was a garrison under Old Minister Chong\'s son. "Perhaps my master is here," he thought.');
      WM.unlock('weizhou');
      s.flag('ch1_toweizhou');
      await s.warp('world', WM.worldAt('weizhou')[0], WM.worldAt('weizhou')[1], 'down', { noFade: true });
      await s.fadeIn(1);
    } }
  ]);

  // ---------------- Weizhou: Shi Jin meets Lu Da ----------------
  WM.defEvents('weizhou_in', [
    { id: 'ch1_tea', x: 3, y: 7, npc: 'waiter', dir: 'right', cond: function (S2) { return S2.has('ch1_toweizhou') && !S2.has('ch1_metluda'); },   // the scene starts when Shi Jin speaks to the waiter
      run: async function (s) {
      await s.say('waiter', 'Tea, sir? What can I bring you?');
      await s.say('shijin', 'A pot of the strong stuff. And tell me — where is the garrison commander\'s office? I\'m looking for an instructor from the Eastern Capital named Wang Jin. Is he here?');
      await s.say('waiter', 'Lots of instructors in the garrison, sir. Three or four named Wang. Ah — there\'s the man to ask. The Major\'s just come in.');
      s.spawn('luda', 'luda', 9, 7, 'up');
      await s.move('luda', 'U1');
      await s.narrate('A big man strode in, broad of shoulder, with a round face, big ears, a straight nose and a wide mouth, and a bristling beard all round his jaw. He wore an officer\'s green cap and a green war-robe, with a belt of plaited silk.');
      await s.faceEach('player', 'luda');
      await s.say('shijin', 'Sir, may I ask you to sit and take tea with me? I\'m looking for someone.');
      await s.say('luda', 'Hah! A fine strapping young fellow. Who\'re you looking for?');
      await s.say('shijin', 'I am Shi Jin of the Shi Family Village in Huayin. I\'m looking for my teacher, Wang Jin, arms instructor of the Imperial Guard.');
      await s.say('luda:shock', 'Shi Jin? Not "Nine Dragons" Shi Jin?');
      await s.say('shijin', 'The same.');
      await s.say('luda:smile', 'Ha ha! I\'ve heard of you! I\'m Lu Da, a major in the garrison here. Your teacher Wang Jin — I know the name. But he\'s not with us. He\'s with the old Minister at Yan\'an, not the son here at Weizhou.');
      await s.say('luda:smile', 'Never mind! Meeting you is worth a jar of wine. Come drinking with me!');
      s.flag('ch1_metluda');
      s.addParty('shijin');
      await s.fadeOut(0.6);
      s.despawn('luda');
      await s.warp('weizhou', 20, 13, 'right', { noFade: true });
      await s.fadeIn(0.6);
    } }
  ]);
  WM.defEvents('weizhou', [
    { id: 'ch1_lizhong', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch1_metluda'); }, run: async function (s) {
      s.spawn('luda', 'luda', 21, 13, 'left');
      s.spawn('lizhong', 'lizhong', 25, 13, 'down');
      s.spawn('c1', 'villager', 24, 14, 'up'); s.spawn('c2', 'woman', 26, 14, 'up'); s.spawn('c3', 'merchant', 27, 13, 'left');   // in front of his stall, watching
      await s.say('lizhong', '...and with one plaster of this, any bruise, any sprain! Ten coppers! Watch the staff, friends, and then buy the plaster!');
      await s.say('shijin', 'That voice... Teacher Li! Li Zhong!');
      await s.say('lizhong:smile', 'Young Master Shi! What are you doing in Weizhou?');
      await s.say('shijin', 'This was my first teacher, brother. He taught me my first moves with the staff, back in Huayin.');
      await s.say('luda', 'Then he\'s a friend of yours, and he drinks with us. Come on, man!');
      await s.say('lizhong', 'Gladly, gladly... as soon as I\'ve sold my plasters and collected my coppers. You go ahead —');
      await s.say('luda:angry', 'Who\'s got time to wait! Clear off, the lot of you!');
      await s.narrate('Lu Da shoved the onlookers aside, and they scattered, cursing under their breath but too afraid of the big Major to say it aloud. Li Zhong forced a smile, packed up his pole and his plasters, and followed.');
      s.despawn('c1'); s.despawn('c2'); s.despawn('c3');
      await s.narrate('The three of them went to the Pan family tavern by the Zhuangyuan Bridge and took a private room upstairs. Lu Da ordered four measures of wine and dishes of meat, and they talked of spear and staff and the heroes of the land.');
      await s.narrate('They had not been drinking long when they heard, from the next room, the sound of someone weeping. Lu Da\'s face darkened. He snatched up a plate and hurled it to the floor.');
      s.despawn('luda'); s.despawn('lizhong');
      s.flag('ch1_done');
      await s.endChapter();
      if (WM.data.chapters[2].begin) await WM.data.chapters[2].begin(s);
    } }
  ]);
  // guard rails so the player follows the story in this chapter
  WM.defEvents('world', [
    { id: 'ch1_noreturn', x: 12, y: 55, trigger: 'touch', cond: function (S2) { return S2.has('ch1_escaped') && !S2.has('ch1_done'); }, text: ['Only ashes remain of the Shi family manor. There is nothing to go back to.'] }
  ]);
})();
