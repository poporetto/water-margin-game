// Chapter 24 — "Liaoerwa" (novel chapter 120).
// The twenty-seven who came back; Lu Junyi's mercury; the poisoned wine at Chuzhou; Song Jiang and Li Kui; Liaoerwa;
// Wu Yong and Hua Rong at the grave; the emperor's dream; the Temple of Pacified Loyalty.
'use strict';
(function () {
  var S = WM.S;

  async function fall(s, ids, text) {
    await s.narrate(text);
    ids.forEach(function (id) { if (!WM.state.dead[id]) { WM.state.dead[id] = true; S.removeFromParty(id); } });
    await s.notice('Fallen: ' + ids.map(function (id) { return S.def(id).name; }).join(', '), { auto: 2.6 });
  }

  WM.data.chapters[24].begin = async function (s) {
    await s.chapter(24);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'huarong', 'likui', 'daizong']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    await s.warp('kaifeng', 29, 40, 'up', { noFade: true });
    await s.fadeIn(1);
    await s.narrate('The emperor received the twenty-seven in the palace and gave them titles and gold. Then they were sent away to posts across the empire, one here, one there, so that they would never stand together again.');
    await s.narrate('Dai Zong gave back his seal and went to the temple of Mount Tai as a Daoist; one night, after his prayers, he laughed aloud and died. Ruan Xiaoqi was stripped of his rank because he had once put on Fang La\'s yellow robe for a joke, and went home to fish at Shijie Village with his old mother. Chai Jin, afraid of the same, pleaded a palsy and went home. Li Ying went home with Du Xing and grew rich. Guan Sheng fell from his horse, drunk, and died of it. Huyan Zhuo would die years later fighting the Jin in the north. Zhu Tong rose to command a province.');
    await s.narrate('Song Jiang was made Commissioner of Chuzhou, and Lu Junyi of Luzhou. And in the capital, Gao Qiu, Yang Jian, Cai Jing and Tong Guan, who had never forgiven Liangshan, put their heads together.');
    await fall(s, ['lujunyi'], 'Lu Junyi was summoned to the capital on a false charge of treason, and cleared, and given an imperial banquet before he went home — and in the food was mercury. On the boat back to Luzhou his body grew heavy and his mind clouded. He stood in the bow, drunk, and fell into the Huai River, and drowned.');
    s.flag('ch24_chuzhou');
    await s.warp('chuzhou_in', 7, 8, 'up');
  };
  WM.data.chapters[24].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 23; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall'); s.flag('grand_assembly');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 42); });
    var lived = ['songjiang', 'lujunyi', 'wuyong', 'guansheng', 'huyanzhuo', 'huarong', 'chaijin', 'liying', 'zhutong', 'daizong', 'likui', 'ruanxiaoqi', 'zhuwu', 'huangxin', 'sunli', 'fanrui', 'lingzhen', 'peixuan', 'jiangjing', 'duxing', 'songqing', 'zourun', 'caiqing', 'yanglin', 'muchun', 'sunxin', 'gudasao'];
    var away = ['gongsunsheng', 'xiaorang', 'yuehe', 'jindajian', 'huangfuduan', 'andaoquan', 'wusong', 'yanqing', 'lijun', 'tongwei', 'tongmeng'];
    WM.data.charOrder.forEach(function (id) { if (away.indexOf(id) >= 0) s.flag('away:' + id); else if (lived.indexOf(id) < 0) WM.state.dead[id] = true; });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('kaifeng', 'liaoerwa');
    await WM.data.chapters[24].begin(s);
  };

  WM.defEvents('chuzhou_in', [
    { id: 'ch24_wine', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch24_chuzhou'); }, run: async function (s) {
      s.party(['songjiang']); s.setLeader('songjiang');
      s.spawn('env', 'official', 7, 5, 'down');
      await s.say('official', 'Imperial wine, sent by His Majesty to Commissioner Song.');
      s.despawn('env');
      await s.narrate('Song Jiang drank a cup in thanks, and the envoy would not drink with him, and left that same day. In the night Song Jiang felt the poison in his belly, and knew.');
      await s.say('songjiang:sad', '...I never had a disloyal thought in all my life. Let the court betray me: my loyal heart will not betray the court.');
      await s.say('songjiang:sad', 'But Li Kui. Li Kui is at Runzhou. When he hears of this, he will raise his men and rebel — and all that we did, all our loyalty and righteousness, will be lost in one day. ...Send for him.');
      s.spawn('lk', 'likui', 7, 6, 'up');
      await s.say('likui:smile', 'Brother! You sent for me!');
      await s.narrate('Song Jiang poured him wine — from the same jar — and they drank together, and when they had drunk, Song Jiang told him.');
      await s.say('songjiang:sad', 'Brother, the court has sent me poisoned wine, and I am dying. And I have given you the same. When I am gone, you would rebel, and ruin the name we kept so long. So I have taken you with me.');
      await s.say('likui:angry', 'Brother — let\'s rebel! Let\'s go back to the marsh!');
      await s.say('songjiang:sad', 'Our army is gone, brother. Our brothers are gone.');
      await s.say('likui:sad', '...All right. All right. All right! Alive, I served you, brother. Dead, I\'ll be a little ghost under you, all the same.');
      await s.say('songjiang:sad', 'South of Chuzhou there is a place called Liaoerwa. The water and the hills there are just like Liangshan. Bury me there.');
      s.despawn('lk', { leave: true });
      s.music('sad');
      await fall(s, ['likui'], 'Li Kui went back to Runzhou, and the poison took him on the road. As he had asked, he was carried to Liaoerwa.');
      await fall(s, ['songjiang'], 'Song Jiang, the Timely Rain, died at Chuzhou. His people wept for him, and buried him at Liaoerwa, among the reeds and the low hills that looked like Liangshan. Li Kui was buried beside him.');
      s.flag('ch24_grave');
      s.party(['wuyong', 'huarong']); s.setLeader('wuyong'); s.flag('protagonist', 'wuyong');
      await s.narrate('Far away, on the same night, Wu Yong dreamed that Song Jiang and Li Kui came to him, and took his sleeve, and said: "Come to Liaoerwa." Hua Rong dreamed the same dream.');
      await s.warp('liaoerwa', 19, 22, 'up');
    } }
  ]);
  WM.defEvents('liaoerwa', [
    { id: 'ch24_wuyong', x: 16, y: 9, w: 8, h: 6, trigger: 'touch', once: true, cond: function (S2) { return S2.has('ch24_grave'); }, run: async function (s) {
      s.spawn('hr', 'huarong', 20, 13, 'up');
      await s.say('huarong:sad', 'Professor. You dreamed it too.');
      await s.say('wuyong:sad', 'All my life I spent my wits for him. Now he is gone, and we live on in a world without our brothers. ...I would rather follow him here, and sleep beside him.');
      await s.say('huarong:sad', 'Then I will go with you. Let us be buried here together, so that people will say: the brothers of Liangshan kept faith to the end.');
      s.despawn('hr', { leave: true });
      await fall(s, ['wuyong', 'huarong'], 'At Song Jiang\'s grave, Wu Yong and Hua Rong embraced, and wept, and hanged themselves from the same tree. The people of Chuzhou buried them beside Song Jiang and Li Kui. There were four graves at Liaoerwa.');
      s.flag('ch24_dream');
      s.party(['daizong']); s.setLeader('daizong'); s.flag('protagonist', 'daizong');
      await s.fadeOut(1.5);
      await s.narrate('In the capital, the emperor sat late at Li Shishi\'s house, and fell asleep. A man in black, with charms tied to his legs, came and bowed: "Majesty, come with me." It was Dai Zong.');
      ['songjiang', 'likui', 'wuyong', 'huarong', 'lujunyi', 'luzhishen', 'linchong'].forEach(function (id) { s.flag('ghost:' + id); });
      s.spawn('emp', 'huizong', 19, 18, 'up');
      s.spawn('sj', 'songjiang', 19, 13, 'down'); s.spawn('lu', 'lujunyi', 17, 14, 'down'); s.spawn('wy', 'wuyong', 21, 14, 'down');
      s.spawn('hr', 'huarong', 23, 14, 'down'); s.spawn('lz', 'luzhishen', 16, 15, 'down'); s.spawn('lc', 'linchong', 15, 16, 'down');
      s.night(true);
      await s.fadeIn(1.5);
      await s.say('songjiang:sad', 'Majesty. We once resisted the armies of Heaven, it is true. But we kept loyalty and righteousness in our hearts always, and never had the least thought of rebellion. We fought the Liao for you, and Tian Hu, and Wang Qing, and Fang La. Of a hundred and eight brothers, few are left. And then you sent me poisoned wine.');
      await s.say('huizong:shock', 'Poisoned wine? I sent you wine to honour you!');
      s.spawn('lk', 'likui', 23, 16, 'left');
      await s.say('likui:angry', 'Emperor! Why did you believe those four traitors and kill us? I\'ll have my revenge now!');
      s.sfx('slash'); await s.flash(); await s.shake(6, 0.5);
      await s.narrate('Li Kui came at the emperor with both axes raised — and the emperor woke, in a cold sweat, in Li Shishi\'s room.');
      ['emp', 'sj', 'lu', 'wy', 'hr', 'lz', 'lc', 'lk'].forEach(function (k) { s.despawn(k); });
      ['songjiang', 'likui', 'wuyong', 'huarong', 'lujunyi', 'luzhishen', 'linchong'].forEach(function (id) { s.unflag('ghost:' + id); });
      s.night(false);
      await s.narrate('In the morning Marshal Su Yuanjing came to the palace. He too had dreamed of Song Jiang. The emperor learned the truth, and wept, and could not punish Gao Qiu and Yang Jian as they deserved; but he gave Song Jiang the title of Marquis of Loyalty, Valour, Righteousness and Succour, and ordered a temple built on Liangshan — the Temple of Pacified Loyalty — with the images of the hundred and eight in its halls. Song Qing was given land and money to tend his brother\'s grave.');
      s.flag('ch24_temple');
      await s.warp('liangshan', 24, 20, 'up');
    } }
  ]);
  WM.defEvents('liangshan', [
    { id: 'ch24_end', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch24_temple'); }, run: async function (s) {
      await s.narrate('The people of the marsh came to the temple in spring and autumn, and burned incense, and said that prayers there were always answered. On windy nights, the fishermen said, they could hear voices on the water, and the sound of horses on the hill, and banners flapping where there were no banners.');
      s.music('ending');   // the closing theme, for the last card and the roll of names
      await s.card('"Their bodies lie in Liaoerwa; their names fill the land under heaven." — The hundred and eight Stars came down from the sky, and went back to the sky. Here ends the Water Margin.', { min: 2, size: 26 });
      s.flag('ch24_done');
      await s.credits();
      s.flag('ending_done');
      if (WM.setScene && WM.scenes.title && !WM.headless) WM.setScene(WM.scenes.title);
    } }
  ]);
})();
