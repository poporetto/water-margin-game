// Residents of Liangshan: every recruited hero stands somewhere in the fortress (as in Suikoden II),
// says a line of their own, and can be asked to join or leave the party.
'use strict';
(function () {
  var S = WM.S;
  var LINES = {
    songjiang: 'Brothers, we are here because the court is full of traitors. One day, when the Emperor sees our loyalty, we will serve the state again.',
    lujunyi: 'I was a rich man in Daming, and blind to the man who betrayed me. Here I have learned what brotherhood is.',
    wuyong: 'Every battle is won before it is fought. Sit down — let me show you the map.',
    gongsunsheng: 'The wind and the thunder answer the rite, not the man. My master taught me that.',
    guansheng: 'My ancestor served the Han with this blade. I will serve righteousness with it.',
    linchong: 'Some nights I still see the snow at the fodder depot. Then I remember I am alive, and among brothers.',
    qinming: 'Song Jiang tricked me out of my family and my post. ...And yet here I am, fighting at his side. Strange world.',
    huyanzhuo: 'My chained cavalry once broke this very fortress. Xu Ning\'s hooks were the answer. I bear no grudge.',
    huarong: 'Wherever Brother Song goes, my bow goes. That is all there is to say.',
    chaijin: 'My manor at Cangzhou welcomed every wanderer under heaven. Liangshan does the same. I feel at home.',
    liying: 'I keep the accounts with Chai Jin. Flying knives are easier.',
    zhutong: 'I let Chao Gai go, and Song Jiang, and Lei Heng. In the end I could not let myself go — so I came.',
    luzhishen: 'Is there wine? Bring wine! A monk who fights needs his strength!',
    wusong: 'I killed a tiger with these hands. Men are harder. Men lie.',
    dongping: 'Twin spears, twin horses — and only one way to go: forward.',
    zhangqing: 'Stand still a moment. Let me see how far I can throw today. ...Joking!',
    yangzhi: 'The heirloom sabre, the flower-rock, the birthday gifts... I have lost a great deal. Not my honour.',
    xuning: 'My goose-feather armour hangs in the store. Shi Qian still swears he only borrowed it.',
    suochao: 'Why wait? Let\'s charge!',
    daizong: 'Two charms on the legs, eight hundred li a day. Four charms, and I can outrun the news.',
    liutang: 'I brought Chao Gai the news of the birthday gifts. Best day\'s work I ever did.',
    likui: 'When are we going to fight our way into the Eastern Capital and put Big Brother Song on the throne?!',
    shijin: 'Master Wang taught me the eighteen arms. I wonder where he is now... I hope he found peace at Yan\'an.',
    muhong: 'At Jieyang I chased Brother Song with half the town. Now I would chase anyone who harmed him.',
    leiheng: 'I let Chao Gai go once. I\'m glad I did.',
    lijun: 'The rivers know me, and I know the rivers. Some day, when the fighting\'s done, I\'d like to sail beyond them.',
    ruanxiaoer: 'The fishing\'s good now. No bandits — well, we\'re the bandits.',
    zhangheng: 'Dumplings or knife-noodles? Ha! Old ferryman\'s joke.',
    ruanxiaowu: 'Want to roll some dice? No? Your loss.',
    zhangshun: 'Seven days and nights under the water. Li Kui still won\'t go near the lake with me.',
    ruanxiaoqi: 'Officials, monks, generals — they all bleed the same when they fall in the marsh.',
    yangxiong: 'I should have listened to Shi Xiu. I will not make that mistake again.',
    shixiu: 'Someone has to go in first. It might as well be me.',
    xiezhen: 'We hunted tigers in Dengzhou. Liangshan\'s game is bigger.',
    xiebao: 'Brother and I share everything. Even the scars.',
    yanqing: 'My master gave me my life. I will give him everything else.',
    zhuwu: 'A formation is a poem written with men. Shall I teach you one?',
    huangxin: 'Suppressor of Three Mountains, they called me. The mountains won.',
    sunli: 'I swore an oath to the Zhu family and broke it. I swore another to my sister-in-law, and kept it.',
    xuanzan: 'Yes, I am ugly. The enemy runs faster.',
    haosiwen: 'Brother Guan Sheng and I came as enemies and stayed as brothers.',
    hantao: 'I was Huyan Zhuo\'s vanguard once. Now I am Liangshan\'s.',
    pengqi: 'Captured by a woman with a red lasso, on my first day. Never let me hear the end of it.',
    shantinggui: 'Water drowns armies. But it also feeds the fields.',
    weidingguo: 'Fire carts, fire arrows, fire oil. I like things warm.',
    xiaorang: 'I can write in any master\'s hand. Do not ask me to write yours.',
    peixuan: 'Rewards and punishments must be fair, or a band of brothers becomes a band of thieves.',
    oupeng: 'Golden Wings — they named me for my speed. I named myself for my freedom.',
    dengfei: 'My eyes are red from the wine, not from eating men. Mostly.',
    yanshun: 'I traded cattle once. Now I trade blows.',
    yanglin: 'Dai Zong found me on the road. Best meeting of my life.',
    lingzhen: 'My fire-bombs fly fourteen li. Stand back when I light the fuse.',
    jiangjing: 'Grain for forty days, silver for ninety. Don\'t ask me to count the arrows again.',
    lufang: 'Red halberd, red armour. Guo Sheng wears white so we can tell ourselves apart.',
    guosheng: 'Our tassels tangled and Hua Rong shot them apart. That arrow made us brothers.',
    andaoquan: 'Sit still. This will only hurt a great deal.',
    huangfuduan: 'Horses are honest creatures. They tell you exactly where it hurts.',
    wangying: 'Brother Song found me a wife. The best wife in the world. Don\'t tell her I said so.',
    husanniang: 'My family is gone. My sabres remain.',
    baoxu: 'I don\'t talk much. Point me at the enemy.',
    fanrui: 'I called the wind and the sand, and Gongsun Sheng\'s thunder answered louder. So I became his pupil.',
    kongming: 'Song Jiang taught us the spear at White Tiger Mountain. Now we follow him everywhere.',
    kongliang: 'I had Wu Song thrown in the stream. He\'s forgiven me. I think.',
    xiangchong: 'Twenty-four flying knives behind one shield. Count them if you like.',
    ligun: 'Javelins over the shield-rim. Xiang Chong throws, I throw. Simple.',
    jindajian: 'A seal is a promise carved in stone. So is a talisman.',
    malin: 'Shall I play the iron flute? It calms the horses, and frightens the enemy.',
    tongwei: 'Where Li Jun goes, we go.',
    tongmeng: 'The river at night is the safest place in the world.',
    mengkang: 'Give me timber and a month, and I\'ll give you a fleet.',
    houjian: 'Hold still, I\'m measuring you for armour. Hm. You\'ve grown.',
    chenda: 'Nine Dragons spared my life when I raided his village. I owe him everything.',
    yangchun: '...',
    zhengtianshou: 'A silversmith\'s son on a bandit mountain. My father would faint.',
    taozongwang: 'Walls, moats, palisades. A fortress is dug before it is fought.',
    songqing: 'Brother Jiang worries about everyone. I worry about Brother Jiang, and the banquets.',
    yuehe: 'Shall I sing? It is a long night.',
    gongwang: 'Flying spears! Duck!',
    dingdesun: 'The forks fly straighter than the spears. Don\'t tell Gong Wang.',
    muchun: 'Brother Mu Hong does the thinking. I do the hitting.',
    caozheng: 'A butcher\'s knife and a teacher like Lin Chong. That\'s all a man needs.',
    songwan: 'I was here before any of you, you know. In the Wang Lun days.',
    duqian: 'Touching the Sky, they call me. The ceilings here are too low.',
    xueyong: 'Song Jiang paid five taels for my show at Jieyang when nobody else dared. I haven\'t forgotten.',
    shien: 'I lost the Happy Forest tavern twice. Wu Song won it back twice. I owe him two lives.',
    lizhong: 'Lu Zhishen calls me stingy. I call it careful.',
    zhoutong: 'Don\'t mention the wedding. Please don\'t mention the wedding.',
    tanglong: 'My cousin Xu Ning still hasn\'t forgiven me. But the hooked lances won the day.',
    duxing: 'They say my face frightens children. My heart\'s loyal, though.',
    zouyuan: 'Gambling\'s a fine way to lose money. War\'s a fine way to win it back.',
    zourun: 'I can butt a pine tree in two. Want to see?',
    zhugui: 'The whistling arrow is still the best way into Liangshan.',
    zhufu: 'Some wine? It\'s not drugged. Not this jar.',
    caifu: 'I kept Lu Junyi alive in that prison. Hardest job I ever did.',
    caiqing: 'A flower behind the ear keeps the day bright.',
    lili: 'I don\'t drug travellers any more. I promise.',
    liyun: 'Green eyes see in the dark. Useful, on a night march.',
    jiaoting: 'Nobody ever liked me. Li Kui hit me and I threw him. Then he liked me.',
    shiyong: 'I carried a letter that broke Song Jiang\'s heart. I carry his banner now.',
    sunxin: 'My wife does the fighting. I do the cooking. Usually.',
    gudasao: 'Twenty men? I\'ve thrown more than twenty men out of my tavern.',
    zhangqing2: 'We only made dumplings of the wicked. Mostly.',
    sunerniang: 'Wu Song saw through my wine at Cross Slope. Few men can.',
    wangdingliu: 'Living Lightning God! Want to race?',
    yubaosi: 'I carry Brother Song\'s great banner. Nothing will make me drop it.',
    baisheng: 'I sold the drugged wine on Yellow Earth Ridge. Daylight Rat — that\'s me.',
    shiqian: 'Don\'t look at me like that. I didn\'t take it. ...What were you missing?',
    duanjingzhu: 'I stole the finest horse in the north for Brother Song. The Zeng family stole it back. I\'ll never forgive them.',
    chaogai: 'Brother, Liangshan is your home now. The hall is always open.'
  };
  WM.data.residentLines = LINES;
  // facility keepers stand in their rooms instead
  var KEEPERS = { tanglong: 1, houjian: 1, andaoquan: 1, jindajian: 1, xiaorang: 1, songqing: 1 };
  var NAVY = { lijun: 1, zhangheng: 1, zhangshun: 1, ruanxiaoer: 1, ruanxiaowu: 1, ruanxiaoqi: 1, tongwei: 1, tongmeng: 1, mengkang: 1 };

  // hall spots (interior, two lines along the carpet) and the jetty spots
  var hallSpots = [];
  for (var x = 4; x <= 27; x += 2) { hallSpots.push([x, 5]); hallSpots.push([x, 13]); }
  for (x = 5; x <= 26; x += 3) hallSpots.push([x, 14]);
  var jettySpots = [[18, 40], [20, 40], [22, 40], [28, 40], [30, 40], [19, 41], [29, 41], [21, 41], [27, 41]];

  // outdoor spots are found on the built fortress map: open ground on the terraces
  function outdoorSpots() {
    var rows = WM.data.maps.liangshan._rows;
    if (!rows) return [];
    if (outdoorSpots.key === WM.data.maps.liangshan._rowsKey) return outdoorSpots.cache;
    var out = [];
    for (var y = 13; y < 39; y++) for (var xx = 5; xx < 45; xx++) {
      var c = rows[y][xx];
      if (c !== '.' && c !== '=' && c !== ',') continue;
      var near = false;
      for (var dy = -1; dy <= 1 && !near; dy++) for (var dx = -1; dx <= 1 && !near; dx++) { var n = rows[y + dy] && rows[y + dy][xx + dx]; if (n === ':' || n === 'D' || n === 'G' || n === 'T' || n === 'B') near = true; }
      // and well clear of the Stone Tablet: they wander two tiles from home, and must never stand where it is examined
      for (dy = -3; dy <= 3 && !near; dy++) for (dx = -3; dx <= 3 && !near; dx++) if (rows[y + dy] && rows[y + dy][xx + dx] === 'Q') near = true;
      if (near) continue;
      if ((xx + y * 3) % 4) continue;   // spread them out
      out.push([xx, y]);
    }
    outdoorSpots.key = WM.data.maps.liangshan._rowsKey; outdoorSpots.cache = out;
    return out;
  }

  function present(id) {
    var st = WM.state;
    if (!st || !st.flags.castle || st.flags.lsWangLun) return false;
    if (id === 'chaogai') return !st.flags.chaogai_dead && st.party.indexOf('chaogai') < 0;
    return S.isRecruited(id) && !st.dead[id] && !st.flags['away:' + id] && st.party.indexOf(id) < 0;
  }

  async function talk(s, id) {
    var d = WM.data.chars[id];
    await s.say(id, LINES[id] || '...');
    if (d.combat === false || id === WM.state.flags.protagonist) return;
    var inParty = WM.state.party.indexOf(id) >= 0;
    if (inParty) return;
    if (WM.state.party.length >= 6) { await s.say(id, 'Your party is full. Make room, and I\'ll come.'); return; }
    var k = await s.ask(id, 'Shall I ride out with you?', ['Join the party', 'Not now']);
    if (k === 0) { S.addToParty(id); S.restore(id); WM.audio.sfx('ok'); await s.notice(d.name + ' joined the party.', { auto: 1.2 }); }
  }

  // build the resident events: heavenly stars in the hall, navy at the jetty, the rest on the terraces
  var hallEvents = [], outEvents = [];
  var order = WM.data.charOrder.concat(['chaogai']);
  var hi = 0, ji = 0, oi = 0;
  order.forEach(function (id) {
    if (KEEPERS[id]) return;
    var d = WM.data.chars[id];
    var isHall = id === 'chaogai' || (d.rank && d.rank <= 36 && !NAVY[id]);
    if (isHall) {
      var sp = hallSpots[hi++ % hallSpots.length];
      hallEvents.push({ resident: true, id: 'res_' + id, x: sp[0], y: sp[1], char: id, dir: sp[1] < 9 ? 'down' : 'up', cond: function () { return present(id); }, run: function (s) { return talk(s, id); } });
    } else if (NAVY[id]) {
      var jp = jettySpots[ji++ % jettySpots.length];
      outEvents.push({ resident: true, id: 'res_' + id, x: jp[0], y: jp[1], char: id, dir: 'down', cond: function () { return present(id); }, run: function (s) { return talk(s, id); } });
    } else {
      (function (k) {
        var ev = { resident: true, id: 'res_' + id, char: id, dir: 'down', wander: true, cond: function () { return present(id); }, run: function (s) { return talk(s, id); } };
        Object.defineProperty(ev, 'x', { get: function () { var sp2 = outdoorSpots(); return sp2.length ? sp2[(k * 7) % sp2.length][0] : 24; } });
        Object.defineProperty(ev, 'y', { get: function () { var sp2 = outdoorSpots(); return sp2.length ? sp2[(k * 7) % sp2.length][1] : 30; } });
        outEvents.push(ev);
      })(oi++);
    }
  });
  WM.defEvents('liangshan_in', hallEvents);
  WM.defEvents('liangshan', outEvents);
})();
