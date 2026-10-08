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
    await s.narrate('On the fifteenth day of the fourth month, Gongsun Sheng and forty-eight Daoists began the rite in the Hall of Loyalty. Banners were hung, incense burned day and night, and the chiefs fasted for seven days.');
    s.night(true); s.music('palace');
    await s.narrate('On the seventh night, in the third watch, there was a sound in the north-west of the sky like a bolt of silk being torn. A gate of heaven opened, blazing so bright no one could look at it, and out of it rolled a ball of fire. It circled the altar three times and plunged into the earth south of the hall.');
    s.sfx('thunder'); await s.flash(); await s.shake(8, 0.8);
    await s.say('songjiang:shock', 'Dig there! Quickly!');
    await s.narrate('Three feet down, the spades rang on stone: a tablet, carved on every side with characters like the tracks of tadpoles. Not one of the chiefs could read them.');
    s.spawn('he', 'hexuantong', 18, 6, 'left');
    await s.say('hexuantong', 'My family has handed down a book of the ancient heavenly script. I can read it. ...On the front: "Act on Heaven\'s Behalf." On the side: "Loyalty and Righteousness, Both Complete." And here are names — thirty-six stars of Heaven, seventy-two stars of Earth.');
    await s.narrate('He Xuantong read out the names, and Xiao Rang wrote them down in a fair hand. The first was the Chief Star of Heaven: Song Jiang, the Timely Rain. The second, the Ruling Star of Heaven: Lu Junyi, the Jade Qilin. The third, the Resourceful Star of Heaven: Wu Yong. And so on, one hundred and eight names — every chief in the hall.');
    s.flag('grand_assembly');
    await s.tablet();
    s.despawn('he');
    await s.say('songjiang', 'So we were stars in heaven before we were men on earth, and Heaven has set our places. Let no brother quarrel over high or low. ...Kneel with me. We swear: to act on Heaven\'s behalf, to keep the land safe and the people at peace; to keep loyalty and righteousness in our hearts and win merit for the state. Whoever breaks this oath, may Heaven strike him down, and may he never be born a man again.');
    await s.narrate('One hundred and eight voices swore it together. The apricot-yellow banner "Act on Heaven\'s Behalf" was raised before the Hall of Loyalty, with two red banners beside it: "Protector of Righteousness, of Shandong" and "Jade Qilin of Hebei." The chiefs were given their posts — the six passes, the eight camps, the cavalry and the foot, the navy and the scouts, the smiths, the tailors, the doctors and the clerks.');
    s.night(false);
    s.music('castle');
    await s.narrate('On the Double Ninth, the festival of the chrysanthemums, there was a great feast. Song Jiang, drunk, wrote a song to the tune "The River Runs Red," and Yue He sang it. It ended with the hope that the emperor would soon send down his pardon.');
    s.spawn('ws', 'wusong', 13, 8, 'right'); s.spawn('lk', 'likui', 18, 8, 'left'); s.spawn('lz', 'luzhishen', 14, 9, 'up');
    await s.say('wusong:angry', 'Pardon today, pardon tomorrow! It will only chill the brothers\' hearts!');
    await s.say('likui:angry', 'Pardon! Pardon! What damned pardon!');
    s.sfx('hit'); await s.shake(5, 0.3);
    await s.narrate('Li Kui kicked over the table, and the cups and dishes flew.');
    await s.say('songjiang:angry', 'This black devil insults the court! Take him out and behead him!');
    await s.narrate('All the chiefs went down on their knees to beg for him, and Song Jiang let Li Kui be locked up instead.');
    await s.say('luzhishen', 'The court is full of crooked officials, brother. A pardon won\'t wash them clean. If we take it, we\'ll be as dirty as they are. Better let each of us go his own way.');
    await s.say('songjiang:sad', 'The emperor is wise and good. It is only that the evil ministers hide the truth from him. One day the clouds will clear, and he will know our hearts.');
    s.despawn('ws'); s.despawn('lz');
    await s.narrate('In the morning Li Kui, sober, came and knelt before Song Jiang, and Song Jiang forgave him.');
    s.despawn('lk'); s.despawn('gs'); s.despawn('lu'); s.despawn('wy');
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
