// Chapter 19 — "The Grand Assembly" (novel chapter 71).
// The Luotian rite; the fire from heaven and the stone tablet; He Xuantong reads the tadpole script; the oath in the
// Hall of Loyalty; the Double Ninth feast, the song of amnesty, and Li Kui's rage.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('hexuantong', 'He Xuantong', { skin: '#e8c0a0', hair: '#c8c8c0', hairStyle: 'daoist', beard: 'long', beardColor: '#d8d8d0', body: '#3a4a7a', trim: '#e8d8a0', face: 'long', eyes: 'narrow' }, { face: true });

  WM.data.chapters[19].begin = async function (s) {
    await s.chapter(19);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'guansheng', 'linchong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    await s.warp('liangshan_in', 16, 12, 'up', { noFade: true });
    s.spawn('gs', 'gongsunsheng', 15, 5, 'down'); s.spawn('lu', 'lujunyi', 13, 7, 'right'); s.spawn('wy', 'wuyong', 17, 7, 'left');
    await s.fadeIn(1);
    await s.say('songjiang', 'Brothers. Since the day we came together, we have never lost one of our number in battle — save Brother Chao Gai. Heaven has protected us. Let us hold a great Luotian rite, to thank Heaven and Earth, to pray for the emperor\'s pardon, and to bring peace to the souls of all who have died by our hands.');
    await s.narrate('On the fifteenth day of the fourth month, Gongsun Sheng and forty-eight Daoists began the rite in the Hall of Loyalty.');
    var dao = WM.data.troop(s, 'dao', 'daoist', [[12, 6], [13, 6], [17, 6], [18, 6], [12, 8], [18, 8]], 'up');
    s.face('gs', 'up');
    s.sfx('bell'); await s.emote('gs', 'note', 1.2);
    dao.forEach(function (k) { s.emote(k, 'note', 1.2); });
    await s.say('gongsunsheng', '(chanting before the altar) ...To the Three Pure Ones, to the Jade Emperor, to the stars of the Northern Dipper — we, the brothers of Liangshan, burn incense and fast...');
    s.sfx('bell'); await s.wait(0.6);
    await s.say(null, '(Banners are hung, incense burns day and night, and the chiefs fast for seven days.)');
    s.night(true); s.music('palace');
    s.sfx('wind'); await s.shake(2, 0.6);
    dao.forEach(function (k) { s.emote(k, '!', 0.8); });
    await s.narrate('On the seventh night, in the third watch, there was a sound in the north-west of the sky like a bolt of silk being torn. A gate of heaven opened, blazing so bright no one could look at it, and out of it rolled a ball of fire. It circled the altar three times and plunged into the earth south of the hall.');
    s.sfx('thunder'); await s.flash(); await s.shake(8, 0.8);
    await s.say('songjiang:shock', 'Dig there! Quickly!');
    await s.fadeOut(0.6);
    WM.data.clear(s, dao.concat(['gs', 'lu', 'wy']));
    await s.warp('liangshan', 31, 15, 'up', { noFade: true });
    var dg = WM.data.troop(s, 'dg', 'outlaw', [[30, 13], [32, 13], [31, 12]], 'down');
    s.spawn('gs', 'gongsunsheng', 29, 15, 'up'); s.spawn('lu', 'lujunyi', 34, 15, 'up'); s.spawn('wy', 'wuyong', 28, 15, 'up');
    await s.fadeIn(0.6);
    for (var di = 0; di < 3; di++) { dg.forEach(function (k) { s.jump(k, 3); }); s.sfx('earth'); await s.wait(0.5); }
    s.sfx('block'); await s.shake(2, 0.2);
    await s.say('outlaw', 'Stone! The spades have hit stone — three feet down!');
    s.sfx('earth'); await s.shake(3, 0.4);
    await s.say('wuyong', 'A tablet... carved on every side with characters like the tracks of tadpoles. I cannot read a word of it.');
    await s.say('lujunyi', 'Nor I. Does any man here know this script?');
    WM.data.clear(s, dg);
    s.spawn('he', 'hexuantong', 35, 14, 'left');
    await s.walkTo('he', 32, 15);
    await s.say('hexuantong', 'My family has handed down a book of the ancient heavenly script. I can read it. ...On the front: "Act on Heaven\'s Behalf." On the side: "Loyalty and Righteousness, Both Complete." And here are names — thirty-six stars of Heaven, seventy-two stars of Earth.');
    await s.narrate('He Xuantong read out the names, and Xiao Rang wrote them down in a fair hand. The first was the Chief Star of Heaven: Song Jiang, the Timely Rain. The second, the Ruling Star of Heaven: Lu Junyi, the Jade Qilin. The third, the Resourceful Star of Heaven: Wu Yong. And so on, one hundred and eight names — every chief in the hall.');
    s.flag('grand_assembly');
    await s.tablet();
    s.despawn('he', { leave: true });
    await s.fadeOut(0.6);
    WM.data.clear(s, ['gs', 'lu', 'wy']);
    await s.warp('liangshan_in', 16, 12, 'up', { noFade: true });
    s.spawn('gs', 'gongsunsheng', 15, 5, 'down'); s.spawn('lu', 'lujunyi', 13, 7, 'right'); s.spawn('wy', 'wuyong', 17, 7, 'left');
    await s.fadeIn(0.6);
    await s.say('songjiang', 'So we were stars in heaven before we were men on earth, and Heaven has set our places. Let no brother quarrel over high or low. ...Kneel with me. We swear: to act on Heaven\'s behalf, to keep the land safe and the people at peace; to keep loyalty and righteousness in our hearts and win merit for the state. Whoever breaks this oath, may Heaven strike him down, and may he never be born a man again.');
    await s.narrate('One hundred and eight voices swore it together. The apricot-yellow banner "Act on Heaven\'s Behalf" was raised before the Hall of Loyalty, with two red banners beside it: "Protector of Righteousness, of Shandong" and "Jade Qilin of Hebei." The chiefs were given their posts — the six passes, the eight camps, the cavalry and the foot, the navy and the scouts, the smiths, the tailors, the doctors and the clerks.');
    s.night(false);
    s.music('castle');
    await s.narrate('On the Double Ninth, the festival of the chrysanthemums, there was a great feast. Song Jiang, drunk, wrote a song to the tune "The River Runs Red."');
    s.spawn('ws', 'wusong', 13, 8, 'right'); s.spawn('lk', 'likui', 18, 8, 'left'); s.spawn('lz', 'luzhishen', 14, 9, 'up');
    s.spawn('yh', 'yuehe', 16, 9, 'up');
    await s.emote('player', 'heart');
    await s.say('songjiang', 'Brother Yue He — you have the finest voice on the mountain. Sing it for us.');
    s.sfx('bell'); await s.emote('yh', 'note', 1.4); await s.emote('yh', 'note', 1.4);
    await s.say('yuehe', '(singing) "...My heart is set on loyalty, to quell the land\'s unrest... I wait only for the emperor\'s word — for the pardon to come down, and my heart to be at peace..."');
    s.despawn('yh', { leave: true });
    await s.emote('ws', 'anger'); await s.emote('lk', 'anger');
    await s.say('wusong:angry', 'Pardon today, pardon tomorrow! It will only chill the brothers\' hearts!');
    await s.say('likui:angry', 'Pardon! Pardon! What damned pardon!');
    await s.jump('lk', 8); s.sfx('hit'); await s.shake(5, 0.3);
    await s.say(null, '(Li Kui kicks over the table. Cups and dishes fly.)');
    await s.say('songjiang:angry', 'This black devil insults the court! Take him out and behead him!');
    s.spawn('k1', 'linchong', 12, 9, 'up'); s.spawn('k2', 'huarong', 19, 9, 'up'); s.spawn('k3', 'daizong', 16, 10, 'up');
    ['ws', 'lz', 'k1', 'k2', 'k3'].forEach(function (k) { s.jump(k, 3); });
    await s.say('linchong', 'Brother — we beg you! He was drunk! Spare him!');
    await s.say('songjiang', '...Then lock him up until he is sober.');
    s.spawn('gd1', 'outlaw', 17, 11, 'up'); s.spawn('gd2', 'outlaw', 19, 11, 'up');
    s.walkTo('gd1', 18, 9); await s.walkTo('gd2', 19, 8);
    s.despawn('lk', { to: [16, 13] }); s.despawn('gd1', { to: [16, 13] }); s.despawn('gd2', { to: [17, 13] });
    WM.data.clear(s, ['k1', 'k2', 'k3']);
    await s.say('luzhishen', 'The court is full of crooked officials, brother. A pardon won\'t wash them clean. If we take it, we\'ll be as dirty as they are. Better let each of us go his own way.');
    await s.say('songjiang:sad', 'The emperor is wise and good. It is only that the evil ministers hide the truth from him. One day the clouds will clear, and he will know our hearts.');
    s.despawn('ws'); s.despawn('lz');
    await s.fadeOut(0.8); await s.wait(0.4); await s.fadeIn(0.8);
    s.spawn('lk', 'likui', 16, 13, 'up');
    await s.walkTo('lk', 16, 10);
    await s.jump('lk');
    await s.say('likui:sad', '(kneeling, sober) Brother... I was drunk. I kicked the table. Chop my head off if you like — I won\'t complain.');
    await s.say('songjiang', 'Get up, Iron Ox. I forgive you. But hold your tongue about the pardon from now on.');
    s.despawn('lk', { leave: true }); s.despawn('gs'); s.despawn('lu'); s.despawn('wy');
    s.flag('ch19_free');
    await s.notice('All 108 Stars are gathered at Liangshan. Talk to your brothers, visit the workshops, and examine the Stone Tablet before the hall when you are ready to go on.', { auto: 4 });
  };
  WM.data.chapters[19].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 18; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 33); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'zhujia', 'gaotang', 'qingzhou', 'huazhou', 'daming', 'dongping', 'dongchang');
    await WM.data.chapters[19].begin(s);
  };

  WM.defEvents('liangshan', [
    { id: 'ch19_tablet', x: 31, y: 14, trigger: 'check', cond: function (S2) { return S2.has('ch19_free') && !S2.has('ch19_done'); }, run: async function (s) {
      var k = await s.ask(null, 'The Stone Tablet from Heaven. "Act on Heaven\'s Behalf." Is Liangshan ready to go on?', ['Go on (Chapter 20)', 'Not yet']);
      if (k !== 0) return;
      s.flag('ch19_done');
      await s.endChapter();
      if (WM.data.chapters[20].begin) await WM.data.chapters[20].begin(s);
    } }
  ]);
})();
