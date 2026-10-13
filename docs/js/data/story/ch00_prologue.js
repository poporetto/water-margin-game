// Prologue — novel chapter 1. Marshal Hong Xin at Dragon-Tiger Mountain releases the 108 demon stars.
'use strict';
(function () {
  var L = WM.mapLib, S = WM.S;

  WM.data.start = { party: ['hongxin'], map: 'longhu', x: 15, y: 27, dir: 'up', items: [], gold: 0 };
  WM.npc('abbot', 'Abbot of Shangqing', { skin: '#e8b48a', hairStyle: 'daoist', crown: '#c8a040', beard: 'long', beardColor: '#d8d8d0', hair: '#c8c8c0', body: '#6a5a9a', trim: '#e8d8a0' }, { face: true });
  WM.npc('daoistA', 'Daoist', { skin: '#e8b48a', hairStyle: 'daoist', crown: '#6a6a6a', body: '#4a5a7a', trim: '#e8e0d0' }, { face: true });
  WM.npc('hongguard', 'Escort', { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#8a7a3a', tassel: '#c8302a', body: '#7a1a1a', trim: '#d8b36a', weapon: 'spear' });

  // ---------------- Shangqing Temple at the foot of the mountain ----------------
  var g = L.grid(32, 30, '.');
  g.border('P', 2, [{ side: 'n', from: 2, to: 3 }, { side: 's', from: 15, to: 16 }]);
  g.frame(4, 6, 24, 20, 'R');
  g.rect(15, 25, 2, 1, '=');
  g.rect(15, 14, 2, 11, '=');
  g.rect(9, 19, 14, 1, '=');
  var hall = g.house(10, 8, 12, 6, { roof: 'v', wall: 'R', door: 6 });
  var demon = g.house(22, 8, 5, 5, { roof: '^', wall: 'W', door: 2 });
  g.house(5, 15, 6, 4, { roof: 'z', door: false, windows: [2] });
  g.house(5, 20, 6, 4, { roof: 'z', door: false, windows: [3] });
  g.rect(20, 16, 6, 3, '~'); g.set(19, 17, 'r');
  g.set(13, 19, 'A'); g.set(18, 19, 'A');
  g.set(14, 14, 'L'); g.set(17, 14, 'L'); g.set(14, 23, 'L'); g.set(17, 23, 'L');
  g.stamp(6, 9, ['P', 'P']); g.stamp(24, 21, ['PP', 'P.']); g.stamp(21, 13, ['f']);
  g.rect(15, 26, 2, 4, ':'); g.rect(2, 26, 15, 1, ':'); g.vline(2, 2, 26, ':'); g.vline(3, 2, 26, ':');
  g.scatter('P', 0.18, 5, '.', [2, 2, 28, 4]);
  g.scatter('T', 0.12, 6, '.', [17, 26, 13, 2]);
  g.set(14, 27, 'I');
  WM.defMap('longhu', {
    name: 'Shangqing Temple, Dragon-Tiger Mountain', theme: 'summer', music: 'palace', rows: g.rows(), spawn: [15, 27],
    exits: [WM.toWorld('longhu', 15, 29, 2, 1), { x: 2, y: 0, w: 2, h: 1, to: 'longhu_path', tx: 11, ty: 38, dir: 'up' }]
  });

  // ---------------- the mountain path ----------------
  var p = L.grid(24, 40, 'M');
  var pts = [[11, 39], [11, 34], [6, 30], [6, 24], [15, 20], [17, 14], [9, 9], [11, 2], [11, 0]];
  function walkPts(fn) {
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1], n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (var k = 0; k <= n; k++) fn(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n));
    }
  }
  walkPts(function (x, y) { p.rect(x - 3, y - 1, 7, 3, '.'); });
  walkPts(function (x, y) { p.set(x, y, ':'); p.set(x + 1, y, ':'); });
  p.scatter('P', 0.22, 9, '.'); p.scatter('m', 0.06, 10, '.');
  L.clearAround(p, ':', 'Pm', '.');
  // a mountain stream crossing
  for (var sx = 0; sx < 24; sx++) p.set(sx, 22, p.get(sx, 22) === ':' ? 'B' : '~');
  for (sx = 1; sx < 23; sx++) if (p.get(sx, 22) === 'B') { p.set(sx - 1, 22, p.get(sx - 1, 22) === '~' ? 'B' : 'B'); }
  p.rect(9, 0, 5, 2, '.'); p.rect(10, 0, 2, 2, ':');
  WM.defMap('longhu_path', {
    name: 'Path to the Summit', theme: 'summer', music: 'dungeon', rows: p.rows(), spawn: [11, 38],
    exits: [{ x: 9, y: 39, w: 5, h: 1, to: 'longhu', tx: 2, ty: 1, dir: 'down' }]
  });

  // ---------------- the Hall of Subdued Demons ----------------
  var d = L.ascii([
    'XXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXX',
    'XNNNNNNNNNNNNNX',
    'XNNNNNNQNNNNNNX',
    'XNNNNNNNNNNNNNX',
    'XNNNNNNNNNNNNNX',
    'XNLNNNNNNNNNLNX',
    'XNNNNNNNNNNNNNX',
    'XNNNNNNNNNNNNNX',
    'XNNNNNNNNNNNNNX',
    'XXXXXXXDXXXXXXX'
  ]);
  WM.defMap('demonhall', { name: 'Hall of Subdued Demons', interior: true, theme: 'summer', music: 'dungeon', tint: 'dark', rows: d, spawn: [7, 9] });
  L.link({ map: 'longhu', x: demon.x, y: demon.y }, { map: 'demonhall', x: 7, y: 10 }, {
    cond: function (S2) { return S2.has('pro_tour'); },
    blocked: { text: 'The doors are bolted and pasted over with layer upon layer of seals.' }
  });

  // ---------------- the black vapour effect ----------------
  function vapor(s, dur) {
    var t0 = WM.time;
    var F = WM.field;
    var rays = [];
    for (var i = 0; i < 108; i++) rays.push({ a: Math.random() * Math.PI * 2, v: 60 + Math.random() * 140, d: Math.random() * 0.8, gold: true });
    F.draw.hook = function () {
      var t = WM.time - t0, c = WM.gfx.ctx;
      var px = (7 * 16 + 8 - F.cam.x) * 3, py = (3 * 16 + 8 - F.cam.y) * 3;
      c.save();
      // black vapour column
      for (var k = 0; k < 40; k++) {
        var yy = py - ((t * 260 + k * 37) % 700), xx = px + Math.sin(k * 1.7 + t * 3) * (20 + (py - yy) * 0.12);
        c.fillStyle = 'rgba(10,6,16,' + Math.max(0, 0.6 - (py - yy) / 1400) + ')';
        c.beginPath(); c.arc(xx, yy, 30 + (py - yy) * 0.05, 0, 7); c.fill();
      }
      // a hundred and eight golden rays scattering to every quarter
      if (t > 1.5) rays.forEach(function (r) {
        var tt = t - 1.5 - r.d; if (tt < 0) return;
        var dist = tt * r.v * 3;
        var rx = px + Math.cos(r.a) * dist, ry = py - 200 + Math.sin(r.a) * dist * 0.6 - tt * 80;
        c.strokeStyle = 'rgba(255,220,120,' + Math.max(0, 1 - tt / 3) + ')'; c.lineWidth = 3;
        c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - Math.cos(r.a) * 24, ry - Math.sin(r.a) * 14 + 8); c.stroke();
      });
      c.restore();
    };
    return WM.wait(dur || 5).then(function () { F.draw.hook = null; });
  }

  // ---------------- story ----------------
  var ABBOT_X = 16, ABBOT_Y = 21;
  WM.defEvents('longhu', [
    { id: 'arrive', trigger: 'auto', once: true, x: 0, y: 0, run: async function (s) {
      // the abbot and his Daoists wait at the temple gate; the Marshal's escort has come up the road with him
      s.spawn('abbotT', 'abbot', 15, 24, 'down');
      s.spawn('dA', 'daoistA', 13, 24, 'down');
      s.spawn('dB', 'daoistA', 17, 24, 'down');
      s.spawn('esc1', 'hongguard', 15, 29, 'up');
      s.spawn('esc2', 'hongguard', 16, 29, 'up');
      s.music('title');
      await s.chapter(0);
      await s.narrate('In the reign of Emperor Renzong of the Song, when the realm had known peace for generations, a great pestilence swept the land. From the Yangtze to the Huai, from the Eastern Capital to the far provinces, the people died in their thousands.');
      await s.narrate('On the advice of Fan Zhongyan, the emperor resolved to summon the Celestial Master Zhang, the thirty-first of his line, from Dragon-Tiger Mountain in Jiangxi, that he might come to the capital and hold the great rites to drive out the plague.');
      await s.narrate('Grand Marshal Hong Xin was charged with carrying the imperial decree. After many days on the road, he came at last to the Shangqing Temple at the foot of the mountain.');
      s.music('palace');
      await s.move('player', 'U2');
      await s.say('abbot', 'The Daoists of Shangqing welcome the Grand Marshal. Bells, drums and incense have been prepared for the reception of the decree.');
      await s.say('hongxin', 'I bear the Son of Heaven\'s summons for the Celestial Master. Where is he? Bring him here at once.');
      await s.say('abbot', 'Your Excellency, the present Master, called the Teacher of Empty Tranquillity, is of a lofty and solitary nature. He has built himself a hut on the very summit of the mountain and seldom comes down.');
      await s.say('hongxin:angry', 'Then send for him! The emperor\'s business cannot wait upon a hermit.');
      await s.say('abbot', 'With respect, the Master cannot be summoned by messengers. If Your Excellency would truly meet him, you must fast, bathe, put on plain cloth and climb alone on foot, with incense in your hands and the decree on your back. If your heart is sincere, he will receive you. If not, the mountain will not show him to you.');
      await s.say('hongxin', '...I have eaten nothing but vegetables since I left the capital. Very well. Tomorrow at dawn I shall climb.');
      await s.fadeOut(0.8);
      s.despawn('dA'); s.despawn('dB'); s.despawn('esc1'); s.despawn('esc2'); s.despawn('abbotT');
      s.place('player', 15, 23, 'up');
      await s.fadeIn(0.8);
      await s.narrate('Next morning, before dawn, the Marshal bathed, dressed in plain cloth and straw sandals, and tied the decree in a yellow silk bundle across his back. A silver censer of burning incense in his hands, he set out alone. The Daoists pointed him to the path that climbs from the north-west corner of the temple grounds.');
      s.flag('pro_climb');
      WM.unlock('longhu');
      s.state.flags.noEncounters = true;
    } },
    { id: 'abbotTalk', x: ABBOT_X, y: ABBOT_Y, npc: 'abbot', cond: function (S2) { return S2.has('pro_climb') && !S2.has('pro_met'); }, text: ['The path to the summit leaves the temple grounds at the north-west corner, Your Excellency. Keep your heart sincere.'] },
    { id: 'gate', x: 15, y: 28, w: 2, h: 1, trigger: 'touch', cond: function (S2) { return !S2.has('pro_done'); }, run: async function (s) {
      await s.say('hongxin', 'I cannot return to the capital without the Celestial Master. The emperor\'s business comes first.');
      await s.move('player', 'U1');
    } },
    { id: 'pondmsg', x: 14, y: 27, trigger: 'check', text: ['Shangqing Temple, seat of the Celestial Masters of the Zhang family since the Han dynasty.'] },
    { id: 'dao1', x: 11, y: 17, npc: 'daoistA', wander: true, cond: function (S2) { return S2.has('pro_climb'); }, text: ['The Hall of Subdued Demons? The first Celestial Master sealed something there long ago. Every Master since has added a seal. No one goes near it.'] },
    { id: 'dao2', x: 24, y: 15, npc: 'daoistA', cond: function (S2) { return S2.has('pro_climb'); }, text: ['On the mountain there are tigers and serpents, Excellency. But they say a man with a sincere heart passes untouched.'] },
    // return from the mountain
    { id: 'returned', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('pro_met') && WM.state.map === 'longhu'; }, run: async function (s) {
      s.spawn('abbotT', 'abbot', 3, 6, 'down');
      await s.move('abbotT', 'D3', { speed: 90 });
      s.faceEach('player', 'abbotT');
      await s.say('abbot:concerned', 'Your Excellency! Did you meet the Master?');
      await s.say('hongxin:angry', 'Your mountain nearly killed me twice over! First a great tiger with hanging eyes and a white forehead sprang at me from the pines. Then a snake as thick as a rice bucket came hissing out of the bamboo. If my life were not so precious to the dynasty, I would be bones on that path now.');
      await s.say('hongxin', 'And at the end of it all, a little herd-boy riding backwards on an ox, playing a flute, tells me the Master already left this morning, riding a crane to the capital! The insolence of these mountain children!');
      await s.say('abbot:shock', 'Your Excellency... that herd-boy was the Celestial Master himself!');
      await s.say('abbot', 'Young as he looks, his Way is very high. Your tiger and your serpent were only trials of your heart. If he says he has gone to the capital, then he has gone. By the time you return, the rites will be done.');
      await s.say('hongxin:sad', '...I had the Celestial Master before my eyes, and I scolded him like a stable boy.');
      await s.say('abbot', 'Do not trouble yourself, Excellency. Rest tonight. Tomorrow I will show you the temple grounds.');
      await s.fadeOut(1);
      s.place('player', 16, 20, 'up'); s.place('abbotT', 17, 20, 'up');
      await s.fadeIn(1);
      // the two of them walk round the pond to the sealed hall while the tour is told
      s.move('abbotT', 'R9 U6 L3', { wait: false });
      var walk = s.move('player', 'R10 U6 L2');
      await s.narrate('The next day the abbot led the Marshal through the Hall of the Three Pure Ones and the halls of the Nine Heavens, and he was greatly impressed. At last they came to the north-east corner of the grounds, where a small hall stood apart, its red walls stained, its doors sealed with a great iron lock and layer upon layer of paper charms.');
      await walk;
      s.face('player', 'up'); s.face('abbotT', 'up');
      await s.wait(0.3);
      await s.say('hongxin', 'And what is this? Why is it locked so tightly? Whose seals are these?');
      await s.say('abbot', 'This is the Hall of Subdued Demons. Long ago the Ancestral Master imprisoned demon kings within it. Each Master since has added another seal over the last. In eight or nine generations no one has dared to open it.');
      await s.say('hongxin', 'Demon kings? I should like to see what a demon king looks like. Open it.');
      await s.say('abbot:shock', 'Excellency, I beg you! The Ancestral Master left the strictest command: whoever opens it will bring calamity on the whole world!');
      await s.say('hongxin:angry', 'Nonsense! You keep this place shut to frighten the common folk into giving you rice and silver. Open it, or I shall report to the emperor that you Daoists defied the decree and kept me from the Celestial Master. You will all be exiled to the frontier and branded!');
      await s.say('abbot:sad', '...As Your Excellency commands.');
      await s.narrate('Fearing the Marshal\'s power, the abbot called for workmen. They tore away the seals and broke the iron lock with hammers. Within, the hall was black as pitch.');
      s.despawn('abbotT');
      s.flag('pro_tour');
    } },
    { id: 'abbot2', x: 25, y: 14, npc: 'abbot', cond: function (S2) { return S2.has('pro_tour') && !S2.has('pro_opened'); }, text: ['Your Excellency... I beg you once more. Let it be.'] }
  ]);

  WM.defEvents('longhu_path', [
    { id: 'tiger', x: 4, y: 28, w: 5, h: 3, trigger: 'touch', once: true, cond: function () { return (WM.state.chapter || 0) === 0; }, run: async function (s) {
      s.sfx('wind');
      await s.wait(0.4);
      s.spawnBeast('tiger', 'tiger', 3, 24, 'right');
      s.sfx('roar');
      await s.shake(4, 0.6);
      await s.move('tiger', 'R2 D2', { speed: 140 });   // out of the trees at the foot of the cliff
      await s.emote('player', '!');
      await s.say('hongxin:shock', 'A tiger! A tiger with hanging eyes and a white forehead!');
      await s.narrate('A gust of wind tore through the pines, and from the trees leapt a huge tiger, its eyes like hanging lamps, its forehead white. The Marshal tumbled to the ground, the censer flying from his hands. His teeth chattered like a woodpecker on a hollow tree.');
      await s.wait(0.4);
      s.sfx('roar');
      await s.move('tiger', 'U2 L2', { speed: 120 });   // and back into them
      s.despawn('tiger');
      await s.say('hongxin', '...It... it has gone. It circled me, roared, and went off down the slope. Heaven preserve me.');
      await s.say('hongxin:angry', 'I am a Grand Marshal of the realm! Why must I crawl up a mountain like a woodcutter? If that Daoist sent me here to be eaten...');
    } },
    { id: 'snake', x: 13, y: 15, w: 6, h: 3, trigger: 'touch', once: true, cond: function () { return (WM.state.chapter || 0) === 0; }, run: async function (s) {
      s.sfx('wind');
      s.spawnBeast('snake', 'snake', 19, 14, 'left', { body: '#e8e8e0' });
      await s.move('snake', 'L2', { speed: 80 });
      await s.emote('player', '!');
      await s.narrate('He had not gone fifty paces when a hissing came from the bamboo, and a great serpent, white and thick as a rice bucket, slid across the path and coiled before him, its eyes like flames, its tongue flickering at his face.');
      await s.say('hongxin:shock', 'Aaah! Gods and spirits, protect me!');
      s.sfx('wind');
      await s.move('snake', 'R2 U2', { speed: 70 });
      s.despawn('snake');
      await s.say('hongxin:sad', 'Gone again... My legs will not stop shaking. Very well, Hong Xin, onwards. Onwards.');
    } },
    { id: 'boy', x: 8, y: 5, w: 7, h: 4, trigger: 'touch', once: true, cond: function () { return (WM.state.chapter || 0) === 0; }, run: async function (s) {
      s.music('field');
      s.spawnBeast('oxboy', 'oxboy', 11, 0, 'right');
      await s.say(null, '(From around the bend comes the sound of a flute, sweet and clear.)');
      await s.move('oxboy', 'D2', { speed: 30 });
      await s.say('oxboy_boy:smile', 'Are you the man who has come to see the Celestial Master?');
      await s.say('hongxin', 'You are only a herd-boy. How would you know who I am?');
      await s.say('oxboy_boy', 'This morning the Master said to me, "The emperor has sent Marshal Hong with a decree for me to go to the capital and pray away the plague. I shall ride a crane there at once." He has gone already. There is no one up the mountain to see, and there are many tigers and serpents on these paths. You had better go back down before you lose your life.');
      await s.say('hongxin:angry', 'Wretched boy! Don\'t lie to me!');
      await s.say('oxboy_boy:smile', '...');
      s.sfx('wind');
      await s.move('oxboy', 'U2', { speed: 40 });
      s.despawn('oxboy');
      await s.say('hongxin', 'How could a child know of the decree? Unless... Bah. The summit is still far and my legs are finished. I shall go down and ask the abbot.');
      s.flag('pro_met');
      s.music('dungeon');
    } },
    { id: 'clouds', x: 9, y: 0, w: 5, h: 1, trigger: 'touch', cond: function (S2) { return true; }, run: async function (s) {
      await s.say(null, 'Above, the path vanishes into cloud. You can go no further.');
      await s.move('player', 'D1');
    } }
  ]);
  WM.data.npcs.oxboy_boy = { id: 'oxboy_boy', name: 'Herd-Boy', look: { skin: '#f0c49a', hairStyle: 'topknot', body: '#3a6a3a', trim: '#e8e0d0', build: 'small' }, face: true };

  WM.defEvents('demonhall', [
    { id: 'tablet', x: 7, y: 3, trigger: 'check', cond: function (S2) { return S2.has('pro_tour') && !S2.has('pro_opened'); }, run: async function (s) {
      s.spawn('abbot', 'abbot', 8, 8, 'up');
      s.spawn('w1', 'villager', 5, 6, 'up'); s.spawn('w2', 'villager', 10, 6, 'up');
      await s.say(null, 'In the middle of the empty hall stands a stone tablet five or six feet high, set on a stone turtle half buried in the earth. The front is covered in ancient seal characters no one can read.');
      await s.say('hongxin', 'Bring torches round the back. Is there writing there too?');
      await s.say(null, 'On the back, four large characters are cut deep into the stone: 遇洪而開 — "Opened when Hong arrives."');
      await s.say('hongxin:smile', 'Ha! Ha ha ha! Do you see? Hundreds of years ago it was written that I, Hong, would open this hall! It was fated! The demons are surely beneath this stone. Dig it up!');
      await s.say('abbot:shock', 'Excellency, no! Disaster will come of it!');
      await s.say('hongxin:angry', 'What do you Daoists know? It is written on your own stone. Dig!');
      s.sfx('earth'); await s.shake(2, 0.6); s.sfx('earth'); await s.shake(2, 0.6);
      await s.narrate('The workmen pushed over the tablet and dug beneath the turtle. Three or four feet down they struck a great square slab of blue stone. When they pried it up with crowbars, there below was a pit of unfathomable depth.');
      s.stopMusic();
      s.sfx('thunder'); await s.shake(6, 1.0);
      await s.narrate('From the depths came a roar like the collapse of heaven. A column of black vapour rolled out of the pit, smashed through half the roof of the hall, and rose into the sky. There it burst apart into a hundred and more golden rays of light that scattered to every quarter of the earth.');
      s.sfx('wind');
      s.flag('pro_opened');
      var vp = vapor(s, 6);
      s.lie('w1'); s.lie('w2');
      await vp;
      s.lie('w1', false); s.lie('w2', false);
      s.music('sad');
      await s.say('hongxin:shock', 'What... what was that? What have I done?');
      await s.say('abbot:sad', 'You do not know, Excellency. When the Ancestral Master Dongxuan imprisoned them here, he warned: within this pit lie thirty-six Heavenly Spirits and seventy-two Earthly Fiends, one hundred and eight demon lords in all. He bound them beneath the tablet with seal characters. If they came into the world, they would bring chaos on all living things.');
      await s.say('abbot:sad', 'Now they are loose. This will not end well.');
      await s.say('hongxin:sad', '...Not one word of this is to reach the capital. Not one word, do you hear?');
      await s.fadeOut(1.2);
      await s.narrate('Hong Xin hurried back to the Eastern Capital and swore his escort to silence. There he learned that the Celestial Master had indeed come on a crane, held the rites, and that the plague had already passed. The Marshal said nothing of the Hall of Subdued Demons, and the matter was forgotten.');
      await s.narrate('Emperor Renzong reigned forty-two years. The throne passed to Yingzong, to Shenzong, to Zhezong. The empire was at peace. But the hundred and eight stars had fallen to earth, and were waiting.');
      await s.narrate('In the Eastern Capital in those days there lived a good-for-nothing called Gao Er, the second son of a broken family, who could not read but played football better than any man alive. He was banished for leading a rich man\'s son astray, drifted from patron to patron, and by chance came into the household of Prince Duan, the emperor\'s younger brother, just as the prince was playing ball in his garden.');
      await s.narrate('The ball flew towards Gao Er; with one kick he sent it back to the prince\'s feet. The prince was delighted and kept him at his side. Not two months later Emperor Zhezong died without an heir, and Prince Duan ascended the throne as Emperor Huizong. Within half a year Gao Er, now called Gao Qiu, "Gao the Ball," was made Grand Marshal of the Imperial Guard.');
      s.flag('pro_done');
      s.state.flags.noEncounters = false;
      await WM.data.chapters[1].begin(s);
    } }
  ]);
})();
