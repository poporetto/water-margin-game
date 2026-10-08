// Chapter 21 — "The Northern Campaign" (novel chapters 83–90).
// The rations at Chenqiao; Tanzhou; the Liao offer and the taking of Bazhou; Luo Zhenren's warning; Wuyan Guang's
// formation of the Great Unity; the Mysterious Lady's second dream; peace bought by bribes; Mount Wutai and Zhizhen's
// second gatha. Condensed (narrated): Bazhou, Li Kui's capture and exchange, the Liao court's bribes.
'use strict';
(function () {
  var S = WM.S;
  WM.npc('wuyanguang', 'Wuyan Guang', { skin: '#e8c0a0', hairStyle: 'helmet', helmColor: '#d8b040', tassel: '#e8e8e8', beard: 'full', body: '#c8a030', trim: '#5a3a1a', weapon: 'halberd', build: 'big', face: 'square', eyes: 'sharp' }, { face: true });
  WM.npc('liaosoldier', 'Liao Rider', { skin: '#e0b090', hairStyle: 'helmet', helmColor: '#4a4a52', tassel: '#2a6a8a', body: '#2a5a7a', trim: '#e8e0c0', weapon: 'spear' }, { face: true });
  WM.npc('rationclerk', 'Ration Clerk', { skin: '#f0c49a', hairStyle: 'futou', beard: 'mustache', body: '#5a4a3a', trim: '#8a6a3a', face: 'narrow', eyes: 'sharp' }, { face: true });

  var hum = WM.hum;
  var liaoLook = { skin: '#e0b090', hairStyle: 'helmet', helmColor: '#4a4a52', tassel: '#2a6a8a', body: '#2a5a7a', trim: '#e8e0c0', weapon: 'spear' };
  WM.enemy('liao_rider', 'Liao Rider', 35, hum(liaoLook), { range: 'M', exp: 210, drops: [['medicine', 0.15]] });
  WM.enemy('liao_archer', 'Liao Horse-Archer', 35, hum(Object.assign({}, liaoLook, { weapon: 'bow' })), { hp: 0.85, range: 'L', fx: 'arrow', exp: 210 });
  WM.enemy('aliqi_foe', 'Ali Qi', 37, hum(Object.assign({}, liaoLook, { helmColor: '#d8b040', body: '#7a2a2a' })), { hp: 2.6, exp: 600, gold: 400, boss: true, range: 'M' });
  var T = WM.data.troops;
  T.ch21_tanzhou = { enemies: ['liao_rider', 'aliqi_foe', 'liao_archer'], bg: 'field', boss: true };

  var TAIYI_MAP = [
    '..............',
    '.......#####..',
    '.......#...#..',
    '.......H...H..',
    '.......#...#..',
    '.......#####..',
    '..............'
  ];
  var TAIYI_ENEMY = [
    { name: 'Wuyan Guang', portrait: 'wuyanguang', type: 'cav', atk: 140, def: 122, x: 10, y: 3, commander: true },
    { name: 'Black Banners (North)', type: 'cav', atk: 120, def: 112, x: 12, y: 1 },
    { name: 'Blue Banners (East)', type: 'cav', atk: 120, def: 112, x: 12, y: 5 },
    { name: 'White Banners (West)', type: 'inf', atk: 118, def: 118, x: 7, y: 2 },
    { name: 'Red Banners (South)', type: 'inf', atk: 118, def: 118, x: 7, y: 4 },
    { name: 'The Sun: Yelü Dezhong', type: 'cav', atk: 122, def: 110, x: 9, y: 1 },
    { name: 'The Moon: Princess Dali Bei', type: 'cav', atk: 122, def: 110, x: 9, y: 5 }
  ];
  WM.data.wars.ch21_taiyi1 = {
    name: 'The Formation of the Great Unity', goal: { survive: true }, turns: 5, music: 'war', map: TAIYI_MAP,
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'guansheng', support: ['xuanzan', 'haosiwen'], type: 'cav', x: 3, y: 3 },
      { leader: 'linchong', type: 'cav', x: 2, y: 1 },
      { leader: 'qinming', type: 'cav', x: 2, y: 5 },
      { leader: 'huyanzhuo', type: 'cav', x: 1, y: 2 },
      { leader: 'dongping', type: 'cav', x: 1, y: 4 }
    ],
    enemy: TAIYI_ENEMY,
    intro: [['wuyong', 'It mirrors the heavens: sun, moon, the four quarters, and the Liao king himself in the centre. Every time we strike, it turns and closes.'], [null, 'Hold out for 5 turns. The formation cannot be broken by force.']],
    events: [{ turn: 2, run: async function (s, api) {
      await s.say(null, 'The formation turned like the wheel of the heavens. Wherever the Liangshan men struck, the banners shifted and closed behind them.');
      s.sfx('drum'); api.weaken('player', 0.85);
    } }],
    win: [['songjiang:sad', 'Fall back... We cannot break it by force.']], lose: [['songjiang:sad', 'Fall back... We cannot break it by force.']]
  };
  WM.data.wars.ch21_taiyi2 = {
    name: 'The Five Elements', goal: 'commander', turns: 10, music: 'war', map: TAIYI_MAP,
    player: [
      { leader: 'songjiang', support: ['wuyong'], type: 'inf', x: 0, y: 3, commander: true },
      { leader: 'guansheng', support: ['zhangqing'], type: 'cav', x: 3, y: 3 },
      { leader: 'gongsunsheng', support: ['fanrui'], type: 'mage', x: 2, y: 3 },
      { leader: 'dongping', type: 'cav', x: 2, y: 1 },
      { leader: 'linchong', type: 'cav', x: 2, y: 5 },
      { leader: 'likui', support: ['xiangchong', 'ligun'], type: 'inf', x: 1, y: 2 }
    ],
    enemy: TAIYI_ENEMY,
    intro: [['songjiang', 'Earth over water, metal over wood, fire over metal, water over fire, wood over earth. Strike each gate with the colour that conquers it — and attack by night.'], [null, 'Victory: rout Wuyan Guang.']],
    events: [{ turn: 1, run: async function (s, api) {
      await s.say('gongsunsheng', 'Five Thunders!');
      await s.say(null, 'In the dark, twenty-four thunder-carts packed with fire-stones rolled into the Liao lines, and Gongsun Sheng\'s sword called down a south wind to drive the fire. Each gate of the formation was struck by the colour that conquers it. The stars shifted, and the sun and moon went dark.');
      s.sfx('thunder'); s.sfx('fire'); await s.flash(); api.weaken('enemy', 0.6);
    } }],
    win: [['guansheng', 'Wuyan Guang is down!']], lose: [['songjiang:sad', 'Fall back!']]
  };

  WM.data.chapters[21].begin = async function (s) {
    await s.chapter(21);
    s.party(['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'guansheng', 'zhangqing']); s.setLeader('songjiang'); s.flag('protagonist', 'songjiang');
    ['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'guansheng', 'zhangqing', 'linchong', 'dongping', 'huarong'].forEach(function (id) { s.level(id, 36); });
    await s.narrate('The ministers at court wanted the men of Liangshan scattered, or dead. But the Liao had crossed the northern border, and Marshal Su Yuanjing told the emperor: "These men are bound together like brothers. Send them north." The emperor made Song Jiang Vanguard Commander against the Liao. Song Jiang buried Chao Gai\'s spirit tablet, sent the families home, and left the stronghold in the care of a few old soldiers.');
    await s.warp('roadinn', 12, 8, 'up', { noFade: true });
    s.spawn('rc', 'rationclerk', 12, 6, 'down'); s.spawn('sd', 'soldier', 14, 8, 'left');
    await s.fadeIn(1);
    await s.narrate('At the posting station of Chenqiao, the emperor\'s gift of wine and meat was handed out to the soldiers. The two clerks in charge had kept back half the wine, and the meat was cut to scraps.');
    await s.say('soldier:angry', 'Is this the emperor\'s reward? Half a cup and a sliver of meat?');
    await s.say('rationclerk', 'You Liangshan bandits! You should be grateful you\'re not hanging from a tree!');
    s.sfx('slash'); await s.shake(4, 0.3);
    await s.narrate('The soldier — one of Xiang Chong\'s shield-men — drew his blade and killed the clerk where he stood.');
    s.despawn('rc');
    await s.say('wuyong', 'Brother, we are under the court\'s command now. If you spare him, they will say Liangshan cannot be ruled. He must die.');
    await s.say('songjiang:sad', '...On the mountain, no one could have touched you. Under the court, I cannot even save my own man. Drink this wine, brother. Then go.');
    s.despawn('sd');
    await s.narrate('The soldier drank, and hanged himself, and his head was hung at Chenqiao as a warning. Song Jiang wept for him. Then the army marched north.');
    await s.battle('ch21_tanzhou', { bg: 'field' });
    await s.narrate('Zhang Qing\'s stone struck the Liao general Ali Qi in the eye, and Hua Rong, Lin Chong, Qin Ming and Suo Chao took him. Dong Ping unhorsed Yelü Guozhen; the navy, disguised as grain-boats, seized the water gate of Tanzhou. Then the Liao king sent his envoy Ouyang with a gift: Song Jiang would be Grand Marshal of Liao, if he would change sides.');
    await s.say('songjiang', 'Even if the Song betray me, my loyal heart will not betray the Song.');
    await s.narrate('But Wu Yong said: "Then let us use their trick against them." Song Jiang pretended to accept; the Liao let him into Bazhou; and Bazhou was Song\'s by nightfall. After that, Song Jiang went with Gongsun Sheng up Erxian Mountain to call on Luo Zhenren.');
    s.flag('ch21_luo');
    await s.warp('erxian_in', 18, 8, 'up');
  };
  WM.data.chapters[21].debugStart = async function (s) {
    S.newGame(); for (var i = 0; i <= 20; i++) s.flag((i ? 'ch' + i : 'pro') + '_done'); s.flag('castle'); s.flag('chaogai_dead'); s.flag('loyaltyhall'); s.flag('grand_assembly');
    WM.data.charOrder.forEach(function (id) { S.recruit(id, 36); });
    WM.state.chars.songjiang.tal.head = 'heavenbook'; S.give('heavenbook', 1);
    WM.unlock('longhu', 'kaifeng', 'zhugui', 'yuncheng', 'jiangzhou', 'daming', 'erxian');
    await WM.data.chapters[21].begin(s);
  };

  WM.defEvents('erxian_in', [
    { id: 'ch21_luo', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch21_luo'); }, run: async function (s) {
      s.spawn('luo', 'luozhenren', 18, 4, 'down'); s.spawn('gs', 'gongsunsheng', 16, 5, 'right');
      await s.say('songjiang', 'Master, I have brought gold and silk.');
      await s.say('luozhenren', 'A man of the Way has no use for gold. ...General, your loyalty is great, but your fate is thin. Your life will not end in full. When you are at the height of your success, step back. Do not linger over riches and rank.');
      await s.narrate('He gave Song Jiang eight lines of verse that none of them could understand. "In time, you will."');
      await s.say('luozhenren', 'And when this war is over, let my disciple come home. I need someone to pass the Way to — and his old mother stands at the door every evening, watching the road.');
      await s.say('songjiang', '...I will not forget, Master.');
      s.despawn('luo'); s.despawn('gs');
      s.flag('ch21_formation');
      s.party(['songjiang', 'lujunyi', 'wuyong', 'gongsunsheng', 'guansheng', 'zhangqing']);
      await s.narrate('North of Yanjing, the Liao Grand Marshal Wuyan Guang drew up two hundred thousand men in the Formation of the Great Unity, which mirrors the heavens.');
      await s.war('ch21_taiyi1', { canLose: true });
      s.music('sad');
      await s.narrate('Again and again the formation turned and closed. Li Kui was captured and had to be exchanged for Wuyan Guang\'s son. A court instructor, Wang Wenbin, who had come with the winter clothing, rode out to show the bandits how it was done and was cut down. Song Jiang sat up night after night over the problem. At last he fell asleep at his table.');
      s.flag('ch21_dream');
      await s.fadeOut(1, '#ffffff');
      await s.warp('xuannu', 11, 20, 'up', { noFade: true });
      s.spawn('lady', 'xuannu', 11, 5, 'down'); s.spawn('m1', 'jademaiden', 9, 6, 'down'); s.spawn('m2', 'jademaiden', 13, 6, 'down');
      s.music('palace');
      await s.fadeIn(1);
      await s.move('player', 'U12');
      await s.say('xuannu', 'Star Lord Song. The formation gathers all the yang of heaven. You cannot break it from the front. Break it by the way the elements conquer one another.');
      await s.say('xuannu', 'Let your yellow army strike its black gate — earth dams water. White against its blue — metal cuts wood. Red against its white — fire melts metal. Black against its red — water quenches fire. And blue against the yellow centre — wood breaks earth. Strike at night. Send carts of fire, and let Gongsun Sheng call the thunder against the king himself.');
      await s.say('xuannu', 'Go now. You will not meet me again for a long time.');
      ['lady', 'm1', 'm2'].forEach(function (k) { s.despawn(k); });
      await s.fadeOut(1, '#ffffff');
      await s.warp('roadinn', 12, 8, 'up', { noFade: true });
      s.music('war');
      await s.fadeIn(1);
      await s.war('ch21_taiyi2');
      await s.narrate('Hua Rong\'s arrow glanced off Wuyan Guang\'s breastplate. Zhang Qing\'s stones knocked him onto his horse\'s neck. Guan Sheng\'s blade cut him through the waist, and Zhang Qing finished him with his spear. Hu Sanniang took a Liao princess; Lu Junyi took a Liao prince.');
      await s.narrate('The Liao king, beaten, did not surrender to Song Jiang. His chancellor went to the capital with gold for Cai Jing, Tong Guan, Gao Qiu and Yang Jian, and the four of them persuaded the emperor that Liao should be left as a buffer in the north. Su Yuanjing brought the order: the war was over. Every conquered city was handed back.');
      await s.say('songjiang:sad', 'I do not blame the court. Only... all that we did is undone.');
      await s.say('luzhishen', 'Brother, Mount Wutai is near. Let me go and see my old master.');
      await s.say('songjiang', 'Then I will come with you.');
      s.flag('ch21_wutai');
      await s.warp('wutai_in', 34, 8, 'up');
    } }
  ]);
  WM.defEvents('wutai_in', [
    { id: 'ch21_zhizhen', trigger: 'auto', once: true, x: 0, y: 0, cond: function (S2) { return S2.has('ch21_wutai'); }, run: async function (s) {
      s.spawn('zz', 'zhizhen', 34, 5, 'down'); s.spawn('lz', 'luzhishen', 33, 7, 'up');
      await s.say('zhizhen', 'My disciple. You have been gone many years. Killing and burning... it was hard to avoid, wasn\'t it.');
      await s.say('luzhishen:sad', 'Master...');
      await s.say('zhizhen', 'Your time of fulfilment is near. Here are four more lines; keep them all your life. "Meet Xia, and capture. Meet La, and seize. Hear the tide, and be complete. See the signal, and be still."');
      await s.say('luzhishen', '...I will keep them, Master.');
      await s.say('zhizhen', 'And for you, General Song, four lines to keep to yourself. "Wild geese cast shadows in the wind; the eastern gate is never whole. One eye\'s merit is enough; at Shuanglin, fortune and long life are complete." It is a riddle of Chan; I cannot explain it. Ponder it yourself.');
      await s.narrate('Before the Buddha, the chiefs who had come with Song Jiang knelt and swore: "Let us brothers live and die together, and meet again in every life to come."');
      s.despawn('zz'); s.despawn('lz');
      s.flag('ch21_done');
      await s.endChapter();
      if (WM.data.chapters[22].begin) await WM.data.chapters[22].begin(s);
    } }
  ]);
})();
