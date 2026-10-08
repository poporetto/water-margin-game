// The 108 Stars of Destiny, in the order of the stone tablet (ch. 71), plus guests.
// look = sprite/portrait descriptor. war = army-battle values (atk/def 1-10, type, ability).
'use strict';
(function () {
  var C = WM.data.chars, ORDER = WM.data.charOrder;
  var W = function (name, range, pow, fx) { return { name: name, range: range, pow: pow || 1, fx: fx }; };
  // skin tones
  var SK = { fair: '#f0c49a', light: '#e8b48a', mid: '#d8a070', tan: '#c8905e', dark: '#9a6a48', black: '#6a4a34', red: '#c0583a' };

  function H(rank, id, zh, name, nick, star, starEn, cls, weapon, look, o) {
    o = o || {};
    var d = {
      id: id, rank: rank, group: rank <= 36 ? 'heaven' : 'earth', zh: zh, name: name, nick: nick,
      star: star, starEn: starEn, cls: cls, weapon: weapon, look: look,
      combat: o.combat !== false, role: o.role || '', bio: o.bio || '', war: o.war || { atk: 4, def: 4, type: 'inf' },
      lv: o.lv || 1, mul: o.mul, talisman: o.tal, talismanHead: o.head, female: !!o.female, face: o.face, equip: o.equip
    };
    C[id] = d; ORDER.push(id);
  }
  function guest(id, name, zh, nick, cls, weapon, look, o) {
    o = o || {};
    C[id] = { id: id, rank: 0, zh: zh, name: name, nick: nick, cls: cls, weapon: weapon, look: look, combat: o.combat !== false, bio: o.bio || '', war: o.war || { atk: 5, def: 5, type: 'inf' }, lv: o.lv || 1, mul: o.mul, talisman: o.tal, talismanHead: o.head, female: !!o.female, role: o.role || '' };
  }

  // ====================== 36 Heavenly Spirits ======================
  H(1, 'songjiang', '宋江', 'Song Jiang', 'Timely Rain', '天魁星 Tiankui', 'Chief Star of Heaven', 'leader', W('Sword', 'S', 0.9),
    { skin: SK.dark, hairStyle: 'scarf', band: '#1c1c24', beard: 'mustache', body: '#5a2626', trim: '#d8b36a', build: 'small', weapon: 'sword', face: 'round', eyes: 'narrow', brows: 'thick' },
    { role: 'Commander of Liangshan', war: { atk: 5, def: 7, type: 'inf', ability: 'morale' }, mul: { hp: 1.1 },
      bio: 'A county clerk of Yuncheng, dark of face and short of stature, famed across the land as "Timely Rain" for his generosity to anyone in need. Loyalty and filial piety rule him, even when they pull him two ways.' });
  H(2, 'lujunyi', '盧俊義', 'Lu Junyi', 'Jade Qilin', '天罡星 Tiangang', 'Ruling Star of Heaven', 'warrior', W('Steel Spear', 'M', 1.15),
    { skin: SK.fair, hairStyle: 'scarf', band: '#e8e0d0', beard: 'short', body: '#e8e4dc', trim: '#3a6a9a', build: 'big', weapon: 'spear', face: 'square', eyes: 'sharp' },
    { lv: 30, role: 'Deputy Commander', war: { atk: 9, def: 8, type: 'cav', ability: 'charge' }, mul: { pwr: 1.15, hp: 1.1 },
      bio: 'The wealthiest man of Daming, peerless with spear and staff. Lured to Liangshan by Wu Yong\'s riddle, betrayed by his steward Li Gu, and saved from the execution ground.' });
  H(3, 'wuyong', '吳用', 'Wu Yong', 'Resourceful Star', '天機星 Tianji', 'Resourceful Star of Heaven', 'scholar', W('Copper Chains', 'M', 0.8, 'blunt'),
    { skin: SK.light, hairStyle: 'scarf', band: '#2a3a5a', beard: 'mustache', body: '#3a5a6a', trim: '#e8e0d0', build: 'slim', weapon: 'chain', face: 'long', eyes: 'narrow' },
    { tal: 'wind', role: 'Chief Strategist', war: { atk: 3, def: 5, type: 'inf', ability: 'stratagem' }, mul: { mgc: 1.2 },
      bio: 'A village schoolmaster of Dongxi whose schemes rival Zhuge Liang\'s. He planned the seizure of the birthday gifts and nearly every victory that followed.' });
  H(4, 'gongsunsheng', '公孫勝', 'Gongsun Sheng', 'Dragon Entering the Clouds', '天閒星 Tianxian', 'Leisurely Star of Heaven', 'mage', W('Pine-Pattern Sword', 'S', 0.85),
    { skin: SK.fair, hairStyle: 'daoist', crown: '#c8a040', beard: 'long', beardColor: '#2a2018', body: '#6a6aa0', trim: '#e8e0d0', build: 'slim', weapon: 'sword', face: 'long', eyes: 'narrow' },
    { tal: 'thunder', role: 'Chief Strategist (Daoist rites)', war: { atk: 6, def: 5, type: 'mage', ability: 'thunder' }, mul: { mgc: 1.35 },
      bio: 'A Daoist of Jizhou trained by the immortal Luo Zhenren in the Five Thunders. He breaks the sorcery of Gao Lian, Fan Rui and the generals of Liao.' });
  H(5, 'guansheng', '關勝', 'Guan Sheng', 'Great Blade', '天勇星 Tianyong', 'Brave Star of Heaven', 'warrior', W('Green Dragon Blade', 'M', 1.2),
    { skin: SK.red, hairStyle: 'helmet', helmColor: '#3a6a3a', tassel: '#c8302a', beard: 'long', beardColor: '#1a1410', body: '#2a5a2a', trim: '#d8b36a', build: 'big', weapon: 'guandao', face: 'long', eyes: 'narrow' },
    { lv: 32, role: 'Five Tiger General (Left)', war: { atk: 10, def: 8, type: 'cav', ability: 'charge' }, mul: { pwr: 1.15 },
      bio: 'A descendant of Guan Yu with his ancestor\'s red face and long beard, wielding the Green Dragon Crescent Blade. Sent against Liangshan, he was won over by Song Jiang\'s righteousness.' });
  H(6, 'linchong', '林沖', 'Lin Chong', 'Panther Head', '天雄星 Tianxiong', 'Heroic Star of Heaven', 'warrior', W('Serpent Spear', 'M', 1.1),
    { skin: SK.light, hairStyle: 'topknot', beard: 'short', body: '#2a3a5a', trim: '#c8c0a0', weapon: 'spear', face: 'long', eyes: 'round', brows: 'thick' },
    { lv: 8, role: 'Five Tiger General (Right)', war: { atk: 9, def: 8, type: 'cav', ability: 'charge' }, mul: { pwr: 1.1, skl: 1.1 },
      bio: 'Arms instructor of the Imperial Guard, eight hundred thousand strong. Framed by Marshal Gao Qiu so that Gao\'s adopted son might take his wife, he was driven step by step into outlawry.' });
  H(7, 'qinming', '秦明', 'Qin Ming', 'Thunderbolt', '天猛星 Tianmeng', 'Fierce Star of Heaven', 'brute', W('Wolf-Tooth Mace', 'S', 1.2, 'blunt'),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#8a3a2a', tassel: '#f0c040', beard: 'full', body: '#8a2a1a', trim: '#d8b36a', build: 'big', weapon: 'clubs', face: 'square', eyes: 'fierce', fierce: true },
    { lv: 18, role: 'Five Tiger General (Vanguard)', war: { atk: 9, def: 7, type: 'cav', ability: 'charge' }, mul: { pwr: 1.2 },
      bio: 'Commander of Qingzhou with a voice like thunder and a temper to match. Song Jiang\'s ruse cost him his family and his post, and left him nowhere to go but Liangshan.' });
  H(8, 'huyanzhuo', '呼延灼', 'Huyan Zhuo', 'Twin Whips', '天威星 Tianwei', 'Mighty Star of Heaven', 'warrior', W('Twin Steel Whips', 'S', 1.15, 'blunt'),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#3a3a4a', tassel: '#e8e0d0', beard: 'full', body: '#2a2a3a', trim: '#c8c0a0', build: 'big', weapon: 'whips', face: 'square', eyes: 'sharp' },
    { lv: 26, role: 'Five Tiger General (Rear)', war: { atk: 9, def: 9, type: 'cav', ability: 'guard' },
      bio: 'Descendant of the founding general Huyan Zan, master of twin steel whips and of the chained armoured cavalry that once broke Liangshan\'s lines.' });
  H(9, 'huarong', '花榮', 'Hua Rong', 'Little Li Guang', '天英星 Tianying', 'Valiant Star of Heaven', 'archer', W('Bow', 'L', 1.05, 'arrow'),
    { skin: SK.fair, hairStyle: 'topknot', knotTie: '#e8e0d0', beard: 'none', body: '#e8e0f0', trim: '#5a8ac8', weapon: 'bow', face: 'oval', eyes: 'sharp' },
    { lv: 16, role: 'Cavalry Vanguard (Archery)', war: { atk: 8, def: 6, type: 'arch', ability: 'arrows' }, mul: { skl: 1.25 },
      bio: 'Deputy commander of Qingfeng Fort, handsome and the finest archer of his age. Song Jiang\'s most devoted brother, in life and after it.' });
  H(10, 'chaijin', '柴進', 'Chai Jin', 'Little Whirlwind', '天貴星 Tiangui', 'Noble Star of Heaven', 'leader', W('Sword', 'S', 0.9),
    { skin: SK.fair, hairStyle: 'scarf', band: '#5a2a6a', beard: 'mustache', body: '#6a3a8a', trim: '#d8b36a', weapon: 'sword', face: 'oval', eyes: 'narrow' },
    { lv: 18, role: 'Treasurer', war: { atk: 4, def: 5, type: 'inf' },
      bio: 'A descendant of the Later Zhou emperors, protected by an iron writ of immunity. His manor at Cangzhou shelters fugitives of every kind.' });
  H(11, 'liying', '李應', 'Li Ying', 'Sky-Striking Eagle', '天富星 Tianfu', 'Wealthy Star of Heaven', 'warrior', W('Flying Knives', 'L', 1.0, 'arrow'),
    { skin: SK.light, hairStyle: 'scarf', band: '#3a3a3a', beard: 'short', body: '#4a5a3a', trim: '#c8b890', weapon: 'spear', face: 'square', eyes: 'sharp' },
    { lv: 20, role: 'Treasurer', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Master of the Li Family Manor, who carries five throwing knives on his back. Wounded by Zhu Biao\'s arrow, he was brought to Liangshan by a ruse.' });
  H(12, 'zhutong', '朱仝', 'Zhu Tong', 'Lord of the Beautiful Beard', '天滿星 Tianman', 'Full Star of Heaven', 'warrior', W('Halberd', 'M', 1.05),
    { skin: SK.red, hairStyle: 'scarf', band: '#2a2a2a', beard: 'long', beardColor: '#1a1410', body: '#3a4a6a', trim: '#c8c0a0', build: 'big', weapon: 'halberd', face: 'long', eyes: 'narrow' },
    { lv: 20, role: 'Cavalry Vanguard', war: { atk: 7, def: 7, type: 'cav' },
      bio: 'Constable of Yuncheng with a beard to rival Guan Yu\'s. He let Chao Gai, Song Jiang and Lei Heng escape in turn, out of plain decency.' });
  H(13, 'luzhishen', '魯智深', 'Lu Zhishen', 'Flowery Monk', '天孤星 Tiangu', 'Solitary Star of Heaven', 'brute', W('Iron Chan Staff', 'S', 1.25, 'blunt'),
    { skin: SK.mid, hairStyle: 'monk', beard: 'full', beardColor: '#2a1a10', body: '#7a4a2a', trim: '#c89a4a', build: 'big', weapon: 'staff', beads: true, mark: 'flowers', face: 'round', eyes: 'round', brows: 'thick' },
    { lv: 4, role: 'Infantry Commander', war: { atk: 9, def: 7, type: 'inf', ability: 'charge' }, mul: { pwr: 1.25, hp: 1.2, spd: 0.85 },
      bio: 'Once Major Lu Da of Weizhou, he killed a bully with three punches and took the tonsure on Mount Wutai, his back tattooed with flowers. Hot-tempered, drunken, and the truest heart of all.' });
  H(14, 'wusong', '武松', 'Wu Song', 'Pilgrim', '天傷星 Tianshang', 'Wounding Star of Heaven', 'brute', W('Twin Snowflake Blades', 'S', 1.2),
    { skin: SK.light, hairStyle: 'pilgrim', hair: '#18120c', beard: 'none', body: '#2a2a3a', trim: '#a89a7a', weapon: 'twindao', beads: true, face: 'square', eyes: 'sharp', brows: 'thick' },
    { lv: 10, role: 'Infantry Commander', war: { atk: 9, def: 7, type: 'inf', ability: 'charge' }, mul: { pwr: 1.2, spd: 1.1 },
      bio: 'The man who killed the tiger of Jingyang Ridge with his bare hands, then avenged his murdered brother Wu Dalang. A fugitive in a pilgrim\'s robes, he fears nothing under heaven.' });
  H(15, 'dongping', '董平', 'Dong Ping', 'Double Spears', '天立星 Tianli', 'Standing Star of Heaven', 'swift', W('Twin Spears', 'M', 1.15),
    { skin: SK.fair, hairStyle: 'helmet', helmColor: '#5a6a8a', tassel: '#f0f0f0', beard: 'none', body: '#4a5a8a', trim: '#e8e0d0', weapon: 'spear', face: 'oval', eyes: 'sharp' },
    { lv: 36, role: 'Five Tiger General (Centre)', war: { atk: 9, def: 7, type: 'cav', ability: 'charge' }, mul: { spd: 1.15 },
      bio: 'Commander of Dongping, brave with twin spears, called "General of the Myriad Households" in the north. Captured by ambush, he turned on his prefect and joined Liangshan.' });
  H(16, 'zhangqing', '張清', 'Zhang Qing', 'Featherless Arrow', '天捷星 Tianjie', 'Swift Star of Heaven', 'archer', W('Flying Stones', 'L', 1.05, 'stone'),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#6a6a7a', tassel: '#5a8ac8', beard: 'none', body: '#3a6a8a', trim: '#c8c0a0', weapon: 'stones', face: 'oval', eyes: 'sharp' },
    { lv: 36, role: 'Cavalry Vanguard', war: { atk: 8, def: 6, type: 'arch', ability: 'arrows' }, mul: { skl: 1.2 },
      bio: 'Commander of Dongchang, whose thrown stones felled fifteen Liangshan generals one after another before he was taken.' });
  H(17, 'yangzhi', '楊志', 'Yang Zhi', 'Blue-Faced Beast', '天暗星 Tian\'an', 'Dark Star of Heaven', 'warrior', W('Heirloom Sabre', 'S', 1.15),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#5a6a5a', tassel: '#2a2a2a', beard: 'short', body: '#3a4a3a', trim: '#a8a090', weapon: 'saber', mark: 'blue', face: 'square', eyes: 'sharp' },
    { lv: 8, role: 'Cavalry Vanguard', war: { atk: 8, def: 7, type: 'cav' },
      bio: 'A descendant of the great Yang generals, marked by a blue birthmark. Ill luck dogged him: the flower-rock lost in a storm, the heirloom sabre sold in desperation, the birthday gifts stolen on his watch.' });
  H(18, 'xuning', '徐寧', 'Xu Ning', 'Gold Lancer', '天佑星 Tianyou', 'Protecting Star of Heaven', 'warrior', W('Hooked Lance', 'M', 1.1),
    { skin: SK.fair, hairStyle: 'helmet', helmColor: '#c8a040', tassel: '#c8302a', beard: 'short', body: '#5a3a2a', trim: '#d8b36a', weapon: 'hooklance', face: 'oval' },
    { lv: 24, role: 'Cavalry Vanguard', war: { atk: 7, def: 8, type: 'inf', ability: 'guard' },
      bio: 'Instructor of the Golden Lance Guard and sole master of the hooked lance. Lured to Liangshan when Shi Qian stole his goose-feather armour, he taught the art that broke the chained cavalry.' });
  H(19, 'suochao', '索超', 'Suo Chao', 'Impatient Vanguard', '天空星 Tiankong', 'Empty Star of Heaven', 'brute', W('Golden Battle-Axe', 'S', 1.2),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#8a7a3a', tassel: '#c8302a', beard: 'full', body: '#6a5a2a', trim: '#d8b36a', build: 'big', weapon: 'axes', face: 'square', eyes: 'fierce', fierce: true },
    { lv: 28, role: 'Cavalry Vanguard', war: { atk: 8, def: 6, type: 'cav', ability: 'charge' },
      bio: 'A Daming officer who always charges first. He fought Yang Zhi to a standstill on the drill ground.' });
  H(20, 'daizong', '戴宗', 'Dai Zong', 'Magic Traveller', '天速星 Tiansu', 'Speedy Star of Heaven', 'swift', W('Sword', 'S', 0.95),
    { skin: SK.light, hairStyle: 'scarf', band: '#3a2a2a', beard: 'mustache', body: '#5a4a2a', trim: '#c8b890', build: 'slim', weapon: 'sword', face: 'long', eyes: 'narrow' },
    { lv: 14, tal: 'march', role: 'Chief of Couriers', war: { atk: 4, def: 5, type: 'inf', ability: 'scout' }, mul: { spd: 1.4 },
      bio: 'Superintendent of the Jiangzhou prison. With paper charms tied to his legs he walks eight hundred li a day: Liangshan\'s messenger and spy.' });
  H(21, 'liutang', '劉唐', 'Liu Tang', 'Red-Haired Devil', '天異星 Tianyi', 'Strange Star of Heaven', 'brute', W('Long-Handled Sabre', 'M', 1.1),
    { skin: SK.tan, hair: '#a8301a', hairStyle: 'wild', beard: 'stubble', beardColor: '#a8301a', body: '#3a3a2a', trim: '#7a2a1a', weapon: 'halberd', mark: 'scar', face: 'square', eyes: 'round', fierce: true },
    { lv: 6, role: 'Infantry Commander', war: { atk: 7, def: 5, type: 'inf' },
      bio: 'A wanderer with a red birthmark and wild red hair who brought Chao Gai word of the birthday gifts.' });
  H(22, 'likui', '李逵', 'Li Kui', 'Black Whirlwind', '天殺星 Tiansha', 'Killing Star of Heaven', 'brute', W('Twin Axes', 'S', 1.25),
    { skin: SK.black, hair: '#0e0a08', hairStyle: 'wild', beard: 'full', beardColor: '#0e0a08', body: '#2a2a2a', trim: '#7a2a1a', build: 'big', weapon: 'axes', face: 'square', eyes: 'round', brows: 'thick', fierce: true },
    { lv: 12, role: 'Infantry Commander', war: { atk: 10, def: 4, type: 'inf', ability: 'charge' }, mul: { pwr: 1.25, def: 0.85, hp: 1.15 },
      bio: 'A jailer of Jiangzhou, black as iron, who fights stripped to the waist with two axes. Rash and murderous, devoted to Song Jiang like a child to a father.' });
  H(23, 'shijin', '史進', 'Shi Jin', 'Nine Dragons', '天微星 Tianwei', 'Subtle Star of Heaven', 'swift', W('Three-Pointed Blade', 'M', 1.05),
    { skin: SK.fair, hairStyle: 'topknot', knotTie: '#c8302a', beard: 'none', body: '#3a6a8a', trim: '#e8e0d0', weapon: 'trident', mark: 'dragons', chest: true, face: 'oval', eyes: 'round' },
    { lv: 1, role: 'Cavalry Vanguard', war: { atk: 7, def: 6, type: 'cav' }, mul: { skl: 1.1, spd: 1.1 },
      bio: 'Son of the Shi Family Village headman, with nine blue dragons tattooed on his body. He learned true martial arts from the fugitive instructor Wang Jin.' });
  H(24, 'muhong', '穆弘', 'Mu Hong', 'Unrestrained', '天究星 Tianjiu', 'Probing Star of Heaven', 'warrior', W('Spear', 'M', 1.05),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'short', body: '#6a4a3a', trim: '#c8b890', weapon: 'spear', face: 'square', eyes: 'sharp' },
    { lv: 16, role: 'Cavalry Vanguard', war: { atk: 7, def: 6, type: 'cav' },
      bio: 'The local tyrant of Jieyang town, who chased Song Jiang to the river\'s edge before learning who he was.' });
  H(25, 'leiheng', '雷橫', 'Lei Heng', 'Winged Tiger', '天退星 Tiantui', 'Retreating Star of Heaven', 'warrior', W('Sabre', 'S', 1.05),
    { skin: SK.mid, hairStyle: 'scarf', band: '#2a2a2a', beard: 'stubble', body: '#4a3a2a', trim: '#a89070', build: 'big', weapon: 'dao', face: 'square', eyes: 'round' },
    { lv: 18, role: 'Infantry Commander', war: { atk: 6, def: 6, type: 'inf' },
      bio: 'Constable of Yuncheng, so strong he can leap a stream three zhang wide. He killed the singer Bai Xiuying for striking his mother.' });
  H(26, 'lijun', '李俊', 'Li Jun', 'River Dragon', '天壽星 Tianshou', 'Long-lived Star of Heaven', 'swift', W('Steel Fork', 'M', 1.0),
    { skin: SK.tan, hairStyle: 'headband', band: '#2a5a8a', beard: 'none', body: '#2a4a6a', trim: '#c8c0a0', weapon: 'fork', face: 'oval', eyes: 'sharp' },
    { lv: 14, role: 'Navy Commander', war: { atk: 7, def: 6, type: 'naval', ability: 'naval' },
      bio: 'A boatman and salt-smuggler of the Yangtze, chief of the river heroes. Of all the 108, he alone sees how the story must end, and sails away before it does.' });
  H(27, 'ruanxiaoer', '阮小二', 'Ruan Xiao\'er', 'Tai Sui Who Stands His Ground', '天劍星 Tianjian', 'Sword Star of Heaven', 'warrior', W('Fish Spear', 'M', 1.0),
    { skin: SK.tan, hairStyle: 'headband', band: '#8a6a3a', beard: 'stubble', body: '#5a6a5a', trim: '#a89070', weapon: 'fork', face: 'square', chest: true },
    { lv: 5, role: 'Navy Commander', war: { atk: 6, def: 6, type: 'naval', ability: 'naval' },
      bio: 'Eldest of the three Ruan brothers, fishermen of Shijie Village who would trade their nets for a righteous fight.' });
  H(28, 'zhangheng', '張橫', 'Zhang Heng', 'Boatman', '天平星 Tianping', 'Even Star of Heaven', 'warrior', W('Boatman\'s Knife', 'S', 1.0),
    { skin: SK.tan, hairStyle: 'wild', beard: 'full', body: '#3a4a3a', trim: '#7a6a4a', build: 'big', weapon: 'dao', face: 'square', eyes: 'round' },
    { lv: 14, role: 'Navy Commander', war: { atk: 6, def: 6, type: 'naval', ability: 'naval' },
      bio: 'A Xunyang River ferryman who offers his passengers a choice of "dumplings or knife-noodles" once the boat is midstream.' });
  H(29, 'ruanxiaowu', '阮小五', 'Ruan Xiaowu', 'Short-Lived Second Brother', '天罪星 Tianzui', 'Guilty Star of Heaven', 'swift', W('Dagger', 'S', 1.0),
    { skin: SK.tan, hairStyle: 'headband', band: '#3a3a3a', beard: 'none', body: '#4a5a6a', trim: '#a89070', weapon: 'sword', chest: true, mark: 'tattooChest', face: 'oval', eyes: 'sharp' },
    { lv: 5, role: 'Navy Commander', war: { atk: 6, def: 5, type: 'naval', ability: 'naval' },
      bio: 'The second Ruan brother, a leopard tattooed on his chest and a gambler\'s grin on his face.' });
  H(30, 'zhangshun', '張順', 'Zhang Shun', 'White Streak in the Waves', '天損星 Tiansun', 'Harmed Star of Heaven', 'swift', W('Short Sword', 'S', 1.0),
    { skin: '#f6e2cc', hairStyle: 'topknot', beard: 'none', body: '#e8e8e0', trim: '#5a8ac8', build: 'slim', weapon: 'sword', face: 'oval', eyes: 'sharp' },
    { lv: 14, role: 'Navy Commander', war: { atk: 6, def: 5, type: 'naval', ability: 'naval' }, mul: { spd: 1.2 },
      bio: 'A fish-broker of Jiangzhou, white-skinned, who can stay under water seven days and nights. He gave Li Kui a thorough drowning the day they met.' });
  H(31, 'ruanxiaoqi', '阮小七', 'Ruan Xiaoqi', 'Living King of Hell', '天敗星 Tianbai', 'Defeated Star of Heaven', 'brute', W('Fish Spear', 'M', 1.05),
    { skin: SK.tan, hairStyle: 'wild', beard: 'stubble', body: '#3a3a4a', trim: '#a89070', weapon: 'fork', chest: true, face: 'square', eyes: 'round', fierce: true },
    { lv: 5, role: 'Navy Commander', war: { atk: 7, def: 5, type: 'naval', ability: 'naval' },
      bio: 'Youngest and wildest of the Ruan brothers. When the emperor\'s envoy brought an insulting amnesty, he drank the imperial wine and filled the jars with village swill.' });
  H(32, 'yangxiong', '楊雄', 'Yang Xiong', 'Sick Guan Suo', '天牢星 Tianlao', 'Prison Star of Heaven', 'warrior', W('Executioner\'s Sabre', 'S', 1.1),
    { skin: '#e8d0b0', hairStyle: 'scarf', band: '#5a1a1a', beard: 'short', body: '#5a3a3a', trim: '#c8b890', weapon: 'dao', mark: 'tattooFace', face: 'long', eyes: 'narrow' },
    { lv: 16, role: 'Infantry Commander', war: { atk: 6, def: 6, type: 'inf' },
      bio: 'Jailer and executioner of Jizhou, pale of face. Slow to believe his sworn brother Shi Xiu about his wife, he paid for it in grief and blood on Cuiping Mountain.' });
  H(33, 'shixiu', '石秀', 'Shi Xiu', 'Daredevil Third Brother', '天慧星 Tianhui', 'Wise Star of Heaven', 'swift', W('Sabre', 'S', 1.1),
    { skin: SK.light, hairStyle: 'topknot', beard: 'none', body: '#3a3a3a', trim: '#a8a090', weapon: 'dao', face: 'oval', eyes: 'sharp' },
    { lv: 16, role: 'Infantry Commander', war: { atk: 7, def: 5, type: 'inf', ability: 'infiltrate' }, mul: { spd: 1.15 },
      bio: 'A firewood-seller from Jinling who can never pass by an injustice. Alone, he leapt from a tower onto the execution ground of Daming to save Lu Junyi.' });
  H(34, 'xiezhen', '解珍', 'Xie Zhen', 'Two-Headed Snake', '天暴星 Tianbao', 'Violent Star of Heaven', 'warrior', W('Steel Hunting Fork', 'M', 1.05),
    { skin: SK.dark, hairStyle: 'topknot', beard: 'stubble', body: '#6a4a2a', trim: '#4a3a2a', weapon: 'fork', face: 'square', eyes: 'sharp' },
    { lv: 20, role: 'Infantry Commander', war: { atk: 6, def: 6, type: 'inf' },
      bio: 'Elder of the hunter brothers of Dengzhou, robbed of their tiger by the Mao family and thrown in jail for asking for it back.' });
  H(35, 'xiebao', '解寶', 'Xie Bao', 'Twin-Tailed Scorpion', '天哭星 Tianku', 'Weeping Star of Heaven', 'warrior', W('Steel Hunting Fork', 'M', 1.05),
    { skin: SK.dark, hairStyle: 'headband', band: '#5a3a1a', beard: 'none', body: '#6a5a2a', trim: '#4a3a2a', weapon: 'fork', face: 'square', eyes: 'round' },
    { lv: 20, role: 'Infantry Commander', war: { atk: 6, def: 6, type: 'inf' },
      bio: 'Younger of the Xie brothers, tattooed with flying tigers on his legs and a temper as quick as his fork.' });
  H(36, 'yanqing', '燕青', 'Yan Qing', 'The Prodigal', '天巧星 Tianqiao', 'Skilful Star of Heaven', 'swift', W('Crossbow', 'L', 1.0, 'arrow'),
    { skin: '#f6dcc0', hairStyle: 'topknot', knotTie: '#e86a8a', beard: 'none', body: '#e8f0e8', trim: '#4a8a5a', build: 'slim', weapon: 'bow', mark: 'tattooChest', flowerHair: '#e86a8a', face: 'oval', eyes: 'sharp' },
    { lv: 30, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'arch', ability: 'infiltrate' }, mul: { spd: 1.3, luk: 1.3 },
      bio: 'Lu Junyi\'s orphaned servant, raised as his son: handsome, tattooed, a singer, a wrestler without equal, and never misses with a crossbow.' });

  // ====================== 72 Earthly Fiends ======================
  H(37, 'zhuwu', '朱武', 'Zhu Wu', 'Wily Strategist', '地魁星 Dikui', 'Chief Star of Earth', 'scholar', W('Twin Swords', 'S', 0.9),
    { skin: SK.light, hairStyle: 'scarf', band: '#4a4a2a', beard: 'mustache', body: '#5a5a3a', trim: '#c8c0a0', build: 'slim', weapon: 'sword', face: 'long', eyes: 'narrow' },
    { lv: 3, tal: 'earth', role: 'Strategist', war: { atk: 3, def: 5, type: 'inf', ability: 'stratagem' }, mul: { mgc: 1.15 },
      bio: 'The brains of Mount Shaohua, versed in battle formations. His tearful plea of brotherhood won Shi Jin\'s friendship.' });
  H(38, 'huangxin', '黃信', 'Huang Xin', 'Suppressor of Three Mountains', '地煞星 Disha', 'Malevolent Star of Earth', 'warrior', W('Mourning Sword', 'S', 1.0),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#8a7a3a', beard: 'short', body: '#5a4a2a', trim: '#d8b36a', weapon: 'saber', face: 'square' },
    { lv: 16, role: 'Patrol Commander', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Qingzhou officer who boasted he would suppress the three bandit mountains, and ended up joining them.' });
  H(39, 'sunli', '孫立', 'Sun Li', 'Sick Yuchi', '地勇星 Diyong', 'Brave Star of Earth', 'warrior', W('Spear & Whip', 'M', 1.1),
    { skin: '#c8a070', hairStyle: 'helmet', helmColor: '#5a5a6a', beard: 'full', body: '#6a5a3a', trim: '#d8b36a', build: 'big', weapon: 'spear', face: 'square', eyes: 'sharp' },
    { lv: 22, role: 'Patrol Commander', war: { atk: 7, def: 7, type: 'cav', ability: 'infiltrate' },
      bio: 'Commander of Dengzhou, sallow of face, compared to the Tang general Yuchi Gong. His pretended alliance opened the Zhu Family Village from within.' });
  H(40, 'xuanzan', '宣贊', 'Xuan Zan', 'Ugly Prince Consort', '地傑星 Dijie', 'Outstanding Star of Earth', 'warrior', W('Steel Sabre', 'S', 1.05),
    { skin: '#7a5040', hairStyle: 'helmet', helmColor: '#4a4a5a', beard: 'full', beardColor: '#6a2a1a', body: '#4a3a3a', trim: '#c8b890', weapon: 'dao', face: 'square', eyes: 'round', mark: 'scar' },
    { lv: 30, role: 'Patrol Commander', war: { atk: 7, def: 6, type: 'cav' },
      bio: 'A prince\'s son-in-law so ugly his bride died of the shock. It was he who recommended Guan Sheng to the throne.' });
  H(41, 'haosiwen', '郝思文', 'Hao Siwen', 'Wood Dog of the Well', '地雄星 Dixiong', 'Heroic Star of Earth', 'warrior', W('Spear', 'M', 1.0),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#3a5a3a', beard: 'short', body: '#3a5a3a', trim: '#c8b890', weapon: 'spear', face: 'oval' },
    { lv: 30, role: 'Patrol Commander', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Guan Sheng\'s sworn brother, whose mother dreamt of the Wood Dog constellation when he was born.' });
  H(42, 'hantao', '韓滔', 'Han Tao', 'General of a Hundred Victories', '地威星 Diwei', 'Mighty Star of Earth', 'warrior', W('Jujube-Wood Lance', 'M', 1.0),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#6a3a2a', beard: 'short', body: '#5a2a2a', trim: '#c8b890', weapon: 'lance', face: 'square' },
    { lv: 24, role: 'Patrol Commander', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Huyan Zhuo\'s vanguard, a graduate of the military examinations.' });
  H(43, 'pengqi', '彭玘', 'Peng Qi', 'Heaven-Eyed General', '地英星 Diying', 'Valiant Star of Earth', 'warrior', W('Three-Pointed Blade', 'M', 1.0),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#5a5a6a', beard: 'none', body: '#4a4a6a', trim: '#c8b890', weapon: 'trident', face: 'oval' },
    { lv: 24, role: 'Patrol Commander', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Huyan Zhuo\'s second, captured by Hu Sanniang\'s lasso in his first battle with Liangshan.' });
  H(44, 'shantinggui', '單廷珪', 'Shan Tinggui', 'General of Sacred Water', '地奇星 Diqi', 'Wondrous Star of Earth', 'mage', W('Black Spear', 'M', 1.0),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#1a1a2a', tassel: '#2a5aaa', beard: 'short', body: '#1a2a4a', trim: '#5a8ac8', weapon: 'spear', face: 'oval' },
    { lv: 32, tal: 'water', role: 'Patrol Commander', war: { atk: 6, def: 6, type: 'mage', ability: 'water' },
      bio: 'Commander of Lingzhou, who floods the field to drown the enemy: all his army in black.' });
  H(45, 'weidingguo', '魏定國', 'Wei Dingguo', 'General of Holy Fire', '地猛星 Dimeng', 'Fierce Star of Earth', 'mage', W('Fire Sabre', 'S', 1.0),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#8a2a1a', tassel: '#f0a020', beard: 'short', body: '#8a2a1a', trim: '#f0c040', weapon: 'saber', face: 'square', eyes: 'fierce' },
    { lv: 32, tal: 'fire', role: 'Patrol Commander', war: { atk: 7, def: 5, type: 'mage', ability: 'fire' },
      bio: 'Commander of Lingzhou who fights with fire-carts and fire-arrows, all his army in red.' });
  H(46, 'xiaorang', '蕭讓', 'Xiao Rang', 'Master Calligrapher', '地文星 Diwen', 'Literary Star of Earth', 'civil', W('Brush', 'S', 0.5),
    { skin: SK.fair, hairStyle: 'scarf', band: '#2a2a3a', beard: 'long', body: '#4a4a5a', trim: '#e8e0d0', build: 'slim', weapon: 'none', face: 'long', eyes: 'narrow' },
    { combat: false, role: 'Secretary — keeps the records', war: { atk: 1, def: 2, type: 'inf' },
      bio: 'A scholar of Jizhou who can imitate the hand of any master. He forged Cai Jing\'s letter to save Song Jiang, and keeps Liangshan\'s records.' });
  H(47, 'peixuan', '裴宣', 'Pei Xuan', 'Iron-Faced Judge', '地正星 Dizheng', 'Upright Star of Earth', 'civil', W('Twin Swords', 'S', 0.8),
    { skin: SK.light, hairStyle: 'futou', beard: 'short', body: '#2a2a3a', trim: '#c8c0a0', weapon: 'sword', face: 'square', eyes: 'narrow' },
    { combat: false, role: 'Chief Justice — military law', war: { atk: 3, def: 4, type: 'inf' },
      bio: 'An incorruptible clerk exiled for his honesty. At Liangshan he sees that rewards and punishments are just.' });
  H(48, 'oupeng', '歐鵬', 'Ou Peng', 'Golden-Winged Eagle', '地闊星 Dikuo', 'Broad Star of Earth', 'swift', W('Spear', 'M', 1.0),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'short', body: '#6a5a2a', trim: '#d8b36a', weapon: 'spear', face: 'oval', eyes: 'sharp' },
    { lv: 18, role: 'Patrol Commander', war: { atk: 6, def: 5, type: 'inf' },
      bio: 'A former garrison soldier, one of the masters of Huangmen Mountain, and swift as a bird.' });
  H(49, 'dengfei', '鄧飛', 'Deng Fei', 'Fiery-Eyed Lion', '地闔星 Dihe', 'Closing Star of Earth', 'brute', W('Iron Chain', 'M', 1.05, 'blunt'),
    { skin: SK.mid, hairStyle: 'wild', beard: 'stubble', body: '#5a2a2a', trim: '#7a2a1a', build: 'big', weapon: 'chain', redEyes: true, face: 'square', eyes: 'fierce' },
    { lv: 18, role: 'Patrol Commander', war: { atk: 6, def: 5, type: 'inf' },
      bio: 'Master of Yinma River with eyes red from eating human flesh, or so they say. His iron chain is never far from his hand.' });
  H(50, 'yanshun', '燕順', 'Yan Shun', 'Brocade Tiger', '地強星 Diqiang', 'Strong Star of Earth', 'warrior', W('Sabre', 'S', 1.0),
    { skin: SK.tan, hair: '#8a3a1a', hairStyle: 'headband', band: '#c8a040', beard: 'full', beardColor: '#8a3a1a', body: '#6a3a1a', trim: '#c8a040', build: 'big', weapon: 'dao', face: 'square', eyes: 'round' },
    { lv: 12, role: 'Patrol Commander', war: { atk: 6, def: 5, type: 'inf' },
      bio: 'A former cattle trader, chief of Mount Qingfeng, with a red beard and the strength of a bull.' });
  H(51, 'yanglin', '楊林', 'Yang Lin', 'Brocade Leopard', '地暗星 Di\'an', 'Dark Star of Earth', 'swift', W('Brush-Tipped Spear', 'M', 1.0),
    { skin: SK.light, hairStyle: 'topknot', beard: 'stubble', body: '#3a5a4a', trim: '#c8c0a0', weapon: 'spear', face: 'oval', eyes: 'sharp' },
    { lv: 18, role: 'Patrol Commander', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'A wandering bandit of Zhangde who met Dai Zong on the road and joined Liangshan\'s cause.' });
  H(52, 'lingzhen', '凌振', 'Ling Zhen', 'Heaven-Shaking Thunder', '地軸星 Dizhou', 'Axle Star of Earth', 'archer', W('Fire Cannon', 'L', 1.1, 'stone'),
    { skin: SK.mid, hairStyle: 'helmet', helmColor: '#3a3a3a', beard: 'full', body: '#4a3a2a', trim: '#c8302a', build: 'big', weapon: 'none', face: 'round', eyes: 'round' },
    { lv: 24, role: 'Master of Artillery', war: { atk: 7, def: 4, type: 'arch', ability: 'cannon' },
      bio: 'The finest cannoneer of the realm, whose shells reach fourteen or fifteen li. Captured in the reeds when he came to bombard Liangshan.' });
  H(53, 'jiangjing', '蔣敬', 'Jiang Jing', 'Divine Mathematician', '地會星 Dihui', 'Gathering Star of Earth', 'civil', W('Abacus', 'S', 0.5, 'blunt'),
    { skin: SK.fair, hairStyle: 'scarf', band: '#3a3a2a', beard: 'mustache', body: '#4a5a3a', trim: '#e8e0d0', build: 'slim', weapon: 'none', face: 'long', eyes: 'narrow' },
    { combat: false, role: 'Accountant — the granaries & treasury', war: { atk: 2, def: 3, type: 'inf' },
      bio: 'A failed examination candidate who can reckon any sum in his head. He keeps Liangshan\'s accounts.' });
  H(54, 'lufang', '呂方', 'Lü Fang', 'Little Marquis', '地佐星 Dizuo', 'Assisting Star of Earth', 'warrior', W('Red Halberd', 'M', 1.0),
    { skin: SK.light, hairStyle: 'helmet', helmColor: '#a82a1a', tassel: '#f0c040', beard: 'none', body: '#a82a1a', trim: '#f0c040', weapon: 'halberd', face: 'oval', eyes: 'sharp' },
    { lv: 14, role: 'Guard of the Central Camp', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'Admirer of Lü Bu, all in red with a painted halberd. His duel with Guo Sheng ended when their tassels tangled and Hua Rong shot them apart.' });
  H(55, 'guosheng', '郭盛', 'Guo Sheng', 'Second Rengui', '地佑星 Diyou', 'Protecting Star of Earth', 'warrior', W('White Halberd', 'M', 1.0),
    { skin: SK.fair, hairStyle: 'helmet', helmColor: '#d8d8e0', tassel: '#e8e8f0', beard: 'none', body: '#d8d8e0', trim: '#7a8aa0', weapon: 'halberd', face: 'oval', eyes: 'sharp' },
    { lv: 14, role: 'Guard of the Central Camp', war: { atk: 6, def: 6, type: 'cav' },
      bio: 'A mercury-seller from Sichuan, all in white, who came to challenge Lü Fang for his mountain.' });
  H(56, 'andaoquan', '安道全', 'An Daoquan', 'Divine Physician', '地靈星 Diling', 'Spirited Star of Earth', 'civil', W('Needles', 'S', 0.5),
    { skin: SK.fair, hairStyle: 'scarf', band: '#e8e0d0', beard: 'long', beardColor: '#8a8a8a', body: '#e8e4dc', trim: '#5a8a5a', build: 'slim', weapon: 'none', face: 'long', eyes: 'narrow' },
    { combat: false, tal: 'water', role: 'Physician', war: { atk: 1, def: 3, type: 'inf', ability: 'heal' },
      bio: 'The finest physician of Jiankang, who cured the carbuncle on Song Jiang\'s back that no one else could treat.' });
  H(57, 'huangfuduan', '皇甫端', 'Huangfu Duan', 'Purple-Bearded Count', '地獸星 Dishou', 'Beast Star of Earth', 'civil', W('Hoof Knife', 'S', 0.5),
    { skin: SK.light, hair: '#5a2a5a', hairStyle: 'scarf', band: '#3a2a3a', beard: 'full', beardColor: '#6a2a7a', body: '#4a3a4a', trim: '#c8b890', weapon: 'none', face: 'square', eyes: 'round', eyeColor: '#2a5a8a' },
    { combat: false, role: 'Veterinarian — the stables', war: { atk: 2, def: 3, type: 'inf' },
      bio: 'A horse doctor of Dongchang with blue eyes and a purple beard, who can cure any beast.' });
  H(58, 'wangying', '王英', 'Wang Ying', 'Stumpy Tiger', '地微星 Diwei', 'Slight Star of Earth', 'swift', W('Spear', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'stubble', body: '#6a3a2a', trim: '#c8a040', build: 'small', weapon: 'spear', face: 'round', eyes: 'round' },
    { lv: 12, role: 'Cavalry Commander', war: { atk: 5, def: 4, type: 'cav' },
      bio: 'A short, lecherous cart-driver turned bandit of Mount Qingfeng. Song Jiang promised him a fine wife, and kept the promise.' });
  H(59, 'husanniang', '扈三娘', 'Hu Sanniang', 'Ten Feet of Blue', '地慧星 Dihui', 'Wise Star of Earth', 'swift', W('Twin Sabres & Lasso', 'S', 1.05),
    { skin: '#f6dcc4', hair: '#1a1210', hairStyle: 'woman', body: '#b8384a', trim: '#f0d8a0', build: 'slim', weapon: 'twindao', dress: true, flower: '#e86a8a', face: 'narrow', eyes: 'sharp', pin: '#e8c060' },
    { lv: 22, female: true, role: 'Cavalry Commander', war: { atk: 6, def: 5, type: 'cav' }, mul: { spd: 1.2, skl: 1.15 },
      bio: 'Daughter of the Hu Family Manor, betrothed to Zhu Biao, unbeatable with her twin sabres and red lasso until Lin Chong took her.' });
  H(60, 'baoxu', '鮑旭', 'Bao Xu', 'God of Death', '地暴星 Dibao', 'Violent Star of Earth', 'brute', W('Broad Sword', 'S', 1.1),
    { skin: SK.dark, hairStyle: 'wild', beard: 'full', body: '#3a2a2a', trim: '#5a3a2a', build: 'big', weapon: 'dao', face: 'square', eyes: 'round', fierce: true },
    { lv: 26, role: 'Infantry Commander', war: { atk: 7, def: 4, type: 'inf', ability: 'charge' },
      bio: 'Bandit chief of Mount Kumu who kills without blinking, Li Kui\'s kindred spirit.' });
  H(61, 'fanrui', '樊瑞', 'Fan Rui', 'Demon King Who Roils the World', '地默星 Dimo', 'Silent Star of Earth', 'mage', W('Meteor Hammer', 'M', 1.0, 'blunt'),
    { skin: SK.light, hairStyle: 'daoist', crown: '#3a3a3a', beard: 'short', body: '#2a2a3a', trim: '#8a2a2a', weapon: 'chain', face: 'long', eyes: 'sharp' },
    { lv: 26, tal: 'wind', role: 'Infantry Commander', war: { atk: 6, def: 4, type: 'mage', ability: 'sorcery' }, mul: { mgc: 1.25 },
      bio: 'Sorcerer-chief of Mount Mangdang who can call wind and rain. Defeated by Gongsun Sheng, he became his disciple.' });
  H(62, 'kongming', '孔明', 'Kong Ming', 'Comet', '地猖星 Dichang', 'Wild Star of Earth', 'warrior', W('Spear', 'M', 1.0),
    { skin: SK.light, hairStyle: 'topknot', beard: 'stubble', body: '#5a4a6a', trim: '#c8b890', weapon: 'spear', face: 'square' },
    { lv: 14, role: 'Guard of the Central Camp', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'Elder son of the Kong family, Song Jiang\'s pupil in martial arts at White Tiger Mountain.' });
  H(63, 'kongliang', '孔亮', 'Kong Liang', 'Lone Fire', '地狂星 Dikuang', 'Mad Star of Earth', 'warrior', W('Sword', 'S', 0.95),
    { skin: SK.light, hairStyle: 'topknot', beard: 'none', body: '#6a4a5a', trim: '#c8b890', weapon: 'sword', face: 'oval' },
    { lv: 14, role: 'Guard of the Central Camp', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'Younger Kong brother, who once had Wu Song thrown into a stream for fighting with his dog.' });
  H(64, 'xiangchong', '項充', 'Xiang Chong', 'Eight-Armed Nezha', '地飛星 Difei', 'Flying Star of Earth', 'warrior', W('Shield & Flying Knives', 'L', 0.95, 'arrow'),
    { skin: SK.tan, hairStyle: 'headband', band: '#5a2a1a', beard: 'short', body: '#5a3a1a', trim: '#c8a040', weapon: 'shield', face: 'square' },
    { lv: 26, role: 'Infantry Commander', war: { atk: 5, def: 7, type: 'inf', ability: 'guard' },
      bio: 'Shield-bearer of Mount Mangdang who hurls twenty-four flying knives from behind his round shield.' });
  H(65, 'ligun', '李袞', 'Li Gun', 'Sky-Soaring Sage', '地走星 Dizou', 'Running Star of Earth', 'warrior', W('Shield & Javelins', 'L', 0.95, 'arrow'),
    { skin: SK.tan, hairStyle: 'headband', band: '#2a4a2a', beard: 'stubble', body: '#3a4a2a', trim: '#c8a040', weapon: 'shield', face: 'square' },
    { lv: 26, role: 'Infantry Commander', war: { atk: 5, def: 7, type: 'inf', ability: 'guard' },
      bio: 'Xiang Chong\'s partner of Mount Mangdang, who throws javelins over the rim of his shield.' });
  H(66, 'jindajian', '金大堅', 'Jin Dajian', 'Jade-Armed Craftsman', '地巧星 Diqiao', 'Skilful Star of Earth', 'civil', W('Graver', 'S', 0.5),
    { skin: SK.fair, hairStyle: 'scarf', band: '#5a4a2a', beard: 'mustache', body: '#6a5a3a', trim: '#c8b890', weapon: 'none', face: 'round', eyes: 'narrow' },
    { combat: false, role: 'Head Craftsman — seals & tallies', war: { atk: 1, def: 2, type: 'inf' },
      bio: 'A seal-engraver of Jizhou who carves stone and jade like no one else. At Liangshan he engraves talismans and the army\'s tallies.' });
  H(67, 'malin', '馬麟', 'Ma Lin', 'Iron Flute Immortal', '地明星 Diming', 'Bright Star of Earth', 'swift', W('Twin Swords & Flute', 'S', 1.0),
    { skin: SK.light, hairStyle: 'topknot', beard: 'none', body: '#3a5a5a', trim: '#e8e0d0', weapon: 'flute', face: 'oval', eyes: 'narrow' },
    { lv: 18, role: 'Patrol Commander', war: { atk: 5, def: 5, type: 'inf', ability: 'morale' },
      bio: 'One of the masters of Huangmen Mountain, who plays the iron flute between bouts with his twin swords.' });
  H(68, 'tongwei', '童威', 'Tong Wei', 'Dragon from the Cave', '地進星 Dijin', 'Advancing Star of Earth', 'swift', W('Short Sword', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'headband', band: '#2a5a5a', beard: 'none', body: '#2a5a6a', trim: '#c8c0a0', weapon: 'sword', face: 'oval' },
    { lv: 14, role: 'Navy Commander', war: { atk: 5, def: 5, type: 'naval', ability: 'naval' },
      bio: 'Li Jun\'s follower on the Xunyang, a smuggler who swims like a fish.' });
  H(69, 'tongmeng', '童猛', 'Tong Meng', 'River-Churning Clam', '地退星 Ditui', 'Retreating Star of Earth', 'swift', W('Short Sword', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'headband', band: '#5a5a2a', beard: 'none', body: '#5a6a2a', trim: '#c8c0a0', weapon: 'sword', face: 'round' },
    { lv: 14, role: 'Navy Commander', war: { atk: 5, def: 5, type: 'naval', ability: 'naval' },
      bio: 'Tong Wei\'s younger brother, equally at home on the river.' });
  H(70, 'mengkang', '孟康', 'Meng Kang', 'Jade Flagpole', '地滿星 Diman', 'Full Star of Earth', 'warrior', W('Spear', 'M', 0.95),
    { skin: '#f6e6d6', hairStyle: 'topknot', beard: 'none', body: '#4a5a6a', trim: '#e8e0d0', build: 'slim', weapon: 'spear', face: 'long' },
    { lv: 18, role: 'Master Shipwright', war: { atk: 4, def: 5, type: 'naval', ability: 'naval' },
      bio: 'A builder of flower-rock barges who killed the officer who flogged him. At Liangshan he builds the warships.' });
  H(71, 'houjian', '侯健', 'Hou Jian', 'Long-Armed Gibbon', '地遂星 Disui', 'Fulfilled Star of Earth', 'civil', W('Shears', 'S', 0.5),
    { skin: SK.dark, hairStyle: 'topknot', beard: 'stubble', body: '#5a4a3a', trim: '#c8b890', build: 'slim', weapon: 'none', face: 'narrow', eyes: 'round' },
    { combat: false, role: 'Master Tailor — flags & armour', war: { atk: 2, def: 3, type: 'inf' },
      bio: 'A tailor of Hongdu, thin and long-armed, who sews the banners, uniforms and armour of Liangshan.' });
  H(72, 'chenda', '陳達', 'Chen Da', 'Stream-Leaping Tiger', '地周星 Dizhou', 'Circling Star of Earth', 'warrior', W('Steel Spear', 'M', 1.0),
    { skin: SK.tan, hairStyle: 'headband', band: '#5a1a1a', beard: 'stubble', body: '#5a3a2a', trim: '#a89070', weapon: 'spear', face: 'square', eyes: 'round' },
    { lv: 3, role: 'Patrol Commander', war: { atk: 5, def: 5, type: 'cav' },
      bio: 'Second chief of Mount Shaohua, who rode down to the Shi Village to borrow grain and was taken alive by Shi Jin.' });
  H(73, 'yangchun', '楊春', 'Yang Chun', 'White-Spotted Snake', '地隱星 Diyin', 'Hidden Star of Earth', 'warrior', W('Long Blade', 'M', 1.0),
    { skin: SK.light, hairStyle: 'topknot', beard: 'short', body: '#e8e0d0', trim: '#4a5a6a', build: 'slim', weapon: 'halberd', face: 'long' },
    { lv: 3, role: 'Patrol Commander', war: { atk: 5, def: 5, type: 'cav' },
      bio: 'Third chief of Mount Shaohua, lean and quiet, with a long-handled blade.' });
  H(74, 'zhengtianshou', '鄭天壽', 'Zheng Tianshou', 'Fair-Faced Gentleman', '地異星 Diyi', 'Strange Star of Earth', 'swift', W('Sword', 'S', 0.95),
    { skin: '#f6e2cc', hairStyle: 'topknot', beard: 'none', body: '#7a5a8a', trim: '#e8e0d0', build: 'slim', weapon: 'sword', face: 'oval' },
    { lv: 12, role: 'Infantry Commander', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'A silversmith\'s son, pale and handsome, third chief of Mount Qingfeng.' });
  H(75, 'taozongwang', '陶宗旺', 'Tao Zongwang', 'Nine-Tailed Turtle', '地理星 Dili', 'Ordered Star of Earth', 'brute', W('Iron Spade', 'S', 1.0, 'blunt'),
    { skin: SK.dark, hairStyle: 'headband', band: '#5a4a2a', beard: 'stubble', body: '#6a5a3a', trim: '#4a3a2a', build: 'big', weapon: 'pole', face: 'round' },
    { lv: 18, role: 'Supervisor of Works — walls & moats', war: { atk: 5, def: 6, type: 'inf', ability: 'guard' },
      bio: 'A farmer of Huangmen Mountain with an iron spade; at Liangshan he builds the walls and digs the moats.' });
  H(76, 'songqing', '宋清', 'Song Qing', 'Iron Fan', '地俊星 Dijun', 'Handsome Star of Earth', 'civil', W('Iron Fan', 'S', 0.6, 'blunt'),
    { skin: SK.mid, hairStyle: 'scarf', band: '#3a2a2a', beard: 'none', body: '#5a3a3a', trim: '#d8b36a', weapon: 'fan', face: 'round', eyes: 'narrow' },
    { combat: false, role: 'Master of Banquets', war: { atk: 2, def: 3, type: 'inf' },
      bio: 'Song Jiang\'s younger brother, who stayed home to care for their father. At Liangshan he arranges the feasts.' });
  H(77, 'yuehe', '樂和', 'Yue He', 'Iron Whistle', '地樂星 Dile', 'Joyful Star of Earth', 'civil', W('Short Spear', 'M', 0.8),
    { skin: SK.fair, hairStyle: 'topknot', beard: 'none', body: '#3a6a5a', trim: '#e8e0d0', build: 'slim', weapon: 'flute', face: 'oval', eyes: 'narrow' },
    { combat: false, role: 'Musician & Messenger', war: { atk: 2, def: 3, type: 'inf' },
      bio: 'A prison guard of Dengzhou with the finest singing voice in Shandong; he carried word between the jail and the Xie brothers\' rescuers.' });
  H(78, 'gongwang', '龔旺', 'Gong Wang', 'Flower-Necked Tiger', '地捷星 Dijie', 'Swift Star of Earth', 'warrior', W('Flying Spears', 'L', 0.95, 'arrow'),
    { skin: SK.tan, hairStyle: 'helmet', helmColor: '#5a5a3a', beard: 'short', body: '#5a5a3a', trim: '#c8b890', weapon: 'spear', mark: 'tattooFace', face: 'square' },
    { lv: 34, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'arch' },
      bio: 'Zhang Qing\'s lieutenant at Dongchang, tattooed with tigers, who hurls flying spears.' });
  H(79, 'dingdesun', '丁得孫', 'Ding Desun', 'Arrow-Struck Tiger', '地速星 Disu', 'Quick Star of Earth', 'warrior', W('Flying Forks', 'L', 0.95, 'arrow'),
    { skin: SK.tan, hairStyle: 'helmet', helmColor: '#3a5a3a', beard: 'stubble', body: '#3a5a3a', trim: '#c8b890', weapon: 'fork', mark: 'scar', face: 'square' },
    { lv: 34, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'arch' },
      bio: 'Zhang Qing\'s other lieutenant, his face pitted with scars, who hurls flying forks.' });
  H(80, 'muchun', '穆春', 'Mu Chun', 'Little Unrestrained', '地鎮星 Dizhen', 'Guarding Star of Earth', 'warrior', W('Staff', 'S', 0.95, 'blunt'),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'none', body: '#6a5a4a', trim: '#c8b890', weapon: 'staff', face: 'round' },
    { lv: 14, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'Mu Hong\'s younger brother, who picked a fight with Xue Yong in the Jieyang marketplace.' });
  H(81, 'caozheng', '曹正', 'Cao Zheng', 'Demon Carver', '地羈星 Diji', 'Bridled Star of Earth', 'warrior', W('Butcher\'s Knife', 'S', 1.0),
    { skin: SK.mid, hairStyle: 'headband', band: '#e8e0d0', beard: 'short', body: '#e8e0d0', trim: '#8a3a2a', build: 'big', weapon: 'dao', face: 'round' },
    { lv: 8, role: 'Head Butcher', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Lin Chong\'s apprentice and a butcher by trade. It was his trick that won Mount Erlong for Lu Zhishen and Yang Zhi.' });
  H(82, 'songwan', '宋萬', 'Song Wan', 'Giant in the Clouds', '地魔星 Dimo', 'Demonic Star of Earth', 'brute', W('Sabre', 'S', 1.0),
    { skin: SK.tan, hairStyle: 'headband', band: '#3a2a1a', beard: 'full', body: '#4a3a2a', trim: '#7a5a3a', build: 'big', weapon: 'dao', face: 'square' },
    { lv: 5, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'One of the first chiefs of Liangshan under Wang Lun, a towering man.' });
  H(83, 'duqian', '杜遷', 'Du Qian', 'Sky-Touching Giant', '地妖星 Diyao', 'Uncanny Star of Earth', 'brute', W('Sabre', 'S', 1.0),
    { skin: SK.mid, hairStyle: 'headband', band: '#5a2a1a', beard: 'short', body: '#5a4a2a', trim: '#7a5a3a', build: 'big', weapon: 'dao', face: 'long' },
    { lv: 5, role: 'Infantry Commander', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'With Wang Lun and Song Wan, one of the founders of the Liangshan stronghold.' });
  H(84, 'xueyong', '薛永', 'Xue Yong', 'Sick Tiger', '地幽星 Diyou', 'Secluded Star of Earth', 'warrior', W('Staff', 'S', 0.95, 'blunt'),
    { skin: '#d8b090', hairStyle: 'topknot', beard: 'short', body: '#5a5a4a', trim: '#c8b890', build: 'slim', weapon: 'staff', face: 'narrow' },
    { lv: 14, role: 'Infantry Commander', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'A street performer and medicine-seller. Song Jiang paid him when no one else in Jieyang dared.' });
  H(85, 'shien', '施恩', 'Shi En', 'Golden-Eyed Tiger Cub', '地伏星 Difu', 'Lurking Star of Earth', 'warrior', W('Sword', 'S', 0.95),
    { skin: SK.fair, hairStyle: 'topknot', beard: 'none', body: '#7a6a3a', trim: '#e8e0d0', weapon: 'sword', face: 'oval', eyes: 'round' },
    { lv: 10, role: 'Infantry Commander', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Son of the warden of Anping camp at Mengzhou, who won back his Happy Forest tavern through Wu Song\'s fists.' });
  H(86, 'lizhong', '李忠', 'Li Zhong', 'Tiger-Slaying General', '地僻星 Dipi', 'Remote Star of Earth', 'warrior', W('Staff', 'S', 0.95, 'blunt'),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'short', body: '#6a4a3a', trim: '#c8b890', weapon: 'staff', face: 'square' },
    { lv: 3, role: 'Infantry Commander', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Shi Jin\'s first teacher, a street performer selling plasters, too stingy for Lu Zhishen\'s taste. Later chief of Peach Blossom Mountain.' });
  H(87, 'zhoutong', '周通', 'Zhou Tong', 'Little Conqueror', '地空星 Dikong', 'Empty Star of Earth', 'warrior', W('Spear', 'M', 0.95),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'stubble', body: '#7a3a3a', trim: '#c8a040', weapon: 'spear', face: 'round' },
    { lv: 6, role: 'Patrol Commander', war: { atk: 4, def: 4, type: 'cav' },
      bio: 'Bandit of Peach Blossom Mountain who came to claim a bride and found Lu Zhishen in the bridal bed.' });
  H(88, 'tanglong', '湯隆', 'Tang Long', 'Gold-Spotted Leopard', '地孤星 Digu', 'Lonely Star of Earth', 'warrior', W('Iron Hammer', 'S', 1.0, 'blunt'),
    { skin: SK.mid, hairStyle: 'headband', band: '#3a3a3a', beard: 'short', body: '#4a3a2a', trim: '#c8302a', build: 'big', weapon: 'clubs', mark: 'scar', face: 'square', eyes: 'round' },
    { lv: 22, role: 'Chief Armourer — the forge', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'A blacksmith and Xu Ning\'s cousin, spotted with smallpox scars. He forges Liangshan\'s weapons.' });
  H(89, 'duxing', '杜興', 'Du Xing', 'Demon Face', '地全星 Diquan', 'Whole Star of Earth', 'warrior', W('Sabre', 'S', 0.95),
    { skin: '#9a8a6a', hairStyle: 'topknot', beard: 'stubble', body: '#4a4a3a', trim: '#a89070', build: 'big', weapon: 'dao', face: 'square', eyes: 'round', mark: 'scar' },
    { lv: 18, role: 'Tavern Keeper (South)', war: { atk: 4, def: 5, type: 'inf' },
      bio: 'Li Ying\'s steward, a face so ugly it frightens children, and a heart loyal to the end.' });
  H(90, 'zouyuan', '鄒淵', 'Zou Yuan', 'Dragon from the Forest', '地短星 Diduan', 'Short Star of Earth', 'warrior', W('Sabre', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'wild', beard: 'full', body: '#4a3a2a', trim: '#a89070', weapon: 'dao', face: 'square' },
    { lv: 20, role: 'Infantry Commander', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'A gambler and bandit of Dengyun Mountain, uncle of Zou Run.' });
  H(91, 'zourun', '鄒潤', 'Zou Run', 'Single-Horned Dragon', '地角星 Dijiao', 'Horned Star of Earth', 'brute', W('Sabre', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'topknot', beard: 'none', body: '#5a3a2a', trim: '#a89070', weapon: 'dao', face: 'square', eyes: 'round' },
    { lv: 20, role: 'Infantry Commander', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'Zou Yuan\'s nephew, with a lump on his head that can butt a pine tree in two.' });
  H(92, 'zhugui', '朱貴', 'Zhu Gui', 'Dry-Land Crocodile', '地囚星 Diqiu', 'Captive Star of Earth', 'warrior', W('Knife', 'S', 0.9),
    { skin: SK.mid, hairStyle: 'scarf', band: '#5a3a2a', beard: 'short', body: '#6a4a2a', trim: '#c8b890', weapon: 'dao', face: 'round', eyes: 'narrow' },
    { lv: 6, role: 'Tavern Keeper (South) & Lookout', war: { atk: 3, def: 4, type: 'inf' },
      bio: 'Keeper of the tavern on the shore of Liangshan Marsh, where travellers are welcomed, robbed, or announced with a whistling arrow.' });
  H(93, 'zhufu', '朱富', 'Zhu Fu', 'Smiling Tiger', '地藏星 Dizang', 'Hidden Treasure Star of Earth', 'warrior', W('Knife', 'S', 0.9),
    { skin: SK.mid, hairStyle: 'scarf', band: '#6a5a2a', beard: 'none', body: '#7a5a2a', trim: '#c8b890', weapon: 'dao', face: 'round', eyes: 'narrow' },
    { lv: 12, role: 'Master Brewer', war: { atk: 3, def: 4, type: 'inf' },
      bio: 'Zhu Gui\'s brother, a tavern-keeper with an easy smile. His drugged wine freed Li Kui from Li Yun\'s escort.' });
  H(94, 'caifu', '蔡福', 'Cai Fu', 'Iron Arm', '地平星 Diping', 'Level Star of Earth', 'warrior', W('Executioner\'s Sword', 'S', 1.0),
    { skin: SK.light, hairStyle: 'scarf', band: '#5a1a1a', beard: 'short', body: '#5a1a1a', trim: '#c8b890', build: 'big', weapon: 'dao', face: 'square' },
    { lv: 30, role: 'Chief Executioner', war: { atk: 5, def: 5, type: 'inf' },
      bio: 'Jailer and executioner of Daming who protected Lu Junyi in prison, at Chai Jin\'s request.' });
  H(95, 'caiqing', '蔡慶', 'Cai Qing', 'Single Flower', '地損星 Disun', 'Harm Star of Earth', 'warrior', W('Executioner\'s Sword', 'S', 1.0),
    { skin: SK.light, hairStyle: 'scarf', band: '#5a1a1a', beard: 'none', body: '#6a2a2a', trim: '#c8b890', weapon: 'dao', flowerHair: '#e86a8a', face: 'oval' },
    { lv: 30, role: 'Chief Executioner', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'Cai Fu\'s brother, who always wears a flower over his ear.' });
  H(96, 'lili', '李立', 'Li Li', 'Life-Taking Judge', '地奴星 Dinu', 'Slave Star of Earth', 'warrior', W('Knife', 'S', 0.95),
    { skin: SK.dark, hair: '#5a2a1a', hairStyle: 'wild', beard: 'full', beardColor: '#6a2a1a', body: '#4a3a2a', trim: '#7a2a1a', weapon: 'dao', face: 'square', eyes: 'round', redEyes: true },
    { lv: 14, role: 'Tavern Keeper (North)', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Keeper of a murderous inn on Jieling Ridge, who drugged Song Jiang before learning who he was.' });
  H(97, 'liyun', '李雲', 'Li Yun', 'Green-Eyed Tiger', '地察星 Dicha', 'Watchful Star of Earth', 'warrior', W('Sabre', 'S', 0.95),
    { skin: SK.light, hair: '#5a4a2a', hairStyle: 'helmet', helmColor: '#5a5a5a', beard: 'short', beardColor: '#8a6a3a', body: '#4a5a4a', trim: '#c8b890', weapon: 'dao', eyeColor: '#2a7a3a', face: 'square' },
    { lv: 12, role: 'Supervisor of Works — houses & halls', war: { atk: 4, def: 5, type: 'inf' },
      bio: 'A constable of Yishui with green eyes, Zhu Fu\'s master, tricked into joining after Li Kui escaped him.' });
  H(98, 'jiaoting', '焦挺', 'Jiao Ting', 'Faceless', '地惡星 Di\'e', 'Evil Star of Earth', 'brute', W('Fists', 'S', 1.0, 'blunt'),
    { skin: SK.mid, hairStyle: 'topknot', beard: 'stubble', body: '#5a3a2a', trim: '#a89070', build: 'big', weapon: 'fists', face: 'square', eyes: 'round' },
    { lv: 26, role: 'Infantry Commander', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'A wrestler whose family art has no equal, so rude that he has never been welcome anywhere — until he threw Li Kui.' });
  H(99, 'shiyong', '石勇', 'Shi Yong', 'Stone General', '地醜星 Dichou', 'Ugly Star of Earth', 'warrior', W('Sabre', 'S', 0.95),
    { skin: SK.tan, hairStyle: 'headband', band: '#3a3a3a', beard: 'full', body: '#3a3a2a', trim: '#a89070', build: 'big', weapon: 'dao', face: 'square' },
    { lv: 12, role: 'Infantry Commander', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'A gambler who killed a man over a game. He carried the false letter of Song Jiang\'s father\'s death.' });
  H(100, 'sunxin', '孫新', 'Sun Xin', 'Little Yuchi', '地數星 Dishu', 'Numbered Star of Earth', 'warrior', W('Steel Whip', 'S', 0.95, 'blunt'),
    { skin: '#c8a070', hairStyle: 'topknot', beard: 'short', body: '#5a4a3a', trim: '#c8b890', weapon: 'whips', face: 'square' },
    { lv: 20, role: 'Tavern Keeper (East)', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Sun Li\'s younger brother, who learned the whip from him, and keeps a tavern with his wife Gu Dasao.' });
  H(101, 'gudasao', '顧大嫂', 'Gu Dasao', 'Female Tiger', '地陰星 Diyin', 'Yin Star of Earth', 'brute', W('Sabres', 'S', 1.0),
    { skin: SK.tan, hair: '#1a1210', hairStyle: 'woman', body: '#6a3a2a', trim: '#c8a040', build: 'big', weapon: 'twindao', dress: true, face: 'round', eyes: 'round', pin: '#c8c0a0' },
    { lv: 20, female: true, role: 'Tavern Keeper (East)', war: { atk: 5, def: 4, type: 'inf' },
      bio: 'A tavern-keeper who can thrash twenty men. She forced her brother-in-law Sun Li to help break the Xie brothers out of jail.' });
  H(102, 'zhangqing2', '張青', 'Zhang Qing', 'Vegetable Gardener', '地刑星 Dixing', 'Punishing Star of Earth', 'warrior', W('Pole', 'S', 0.95, 'blunt'),
    { skin: SK.tan, hairStyle: 'hat', hatColor: '#8a7a4a', beard: 'short', body: '#5a6a3a', trim: '#a89070', weapon: 'pole', face: 'round' },
    { lv: 10, role: 'Tavern Keeper (West)', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Once a monastery gardener, now keeper with his wife of the Cross Slope inn, where they spare monks, singers and exiles, and make dumplings of the rest.' });
  H(103, 'sunerniang', '孫二娘', 'Sun Erniang', 'Female Yaksha', '地壯星 Dizhuang', 'Robust Star of Earth', 'swift', W('Knives', 'S', 1.0),
    { skin: '#f0c8a0', hair: '#1a1210', hairStyle: 'woman', body: '#2a6a4a', trim: '#e8c060', weapon: 'twindao', dress: true, flower: '#e8c060', face: 'oval', eyes: 'sharp', pin: '#e8c060', lips: '#c03030' },
    { lv: 10, female: true, role: 'Tavern Keeper (West)', war: { atk: 4, def: 4, type: 'inf' },
      bio: 'Mistress of Cross Slope inn, whose drugged wine was no match for Wu Song. She gave him the robes of a pilgrim.' });
  H(104, 'wangdingliu', '王定六', 'Wang Dingliu', 'Living Lightning God', '地劣星 Dilie', 'Lowly Star of Earth', 'swift', W('Staff', 'S', 0.9, 'blunt'),
    { skin: SK.light, hairStyle: 'topknot', beard: 'none', body: '#4a6a5a', trim: '#c8b890', build: 'slim', weapon: 'pole', face: 'narrow' },
    { lv: 30, role: 'Tavern Keeper (North)', war: { atk: 3, def: 3, type: 'inf', ability: 'scout' }, mul: { spd: 1.3 },
      bio: 'A tavern-keeper\'s son by the Yangtze who runs like lightning and helped Zhang Shun bring An Daoquan.' });
  H(105, 'yubaosi', '郁保四', 'Yu Baosi', 'God of the Dangerous Road', '地健星 Dijian', 'Hale Star of Earth', 'brute', W('Flagstaff', 'M', 1.0, 'blunt'),
    { skin: SK.dark, hairStyle: 'headband', band: '#c8302a', beard: 'full', body: '#4a2a2a', trim: '#c8a040', build: 'big', weapon: 'pole', face: 'square' },
    { lv: 34, role: 'Bearer of the Commander\'s Banner', war: { atk: 5, def: 6, type: 'inf', ability: 'morale' },
      bio: 'A giant highwayman who stole the horses Duan Jingzhu bought for Liangshan, and now carries Song Jiang\'s great banner.' });
  H(106, 'baisheng', '白勝', 'Bai Sheng', 'Daylight Rat', '地耗星 Dihao', 'Wasting Star of Earth', 'swift', W('Carrying Pole', 'S', 0.85, 'blunt'),
    { skin: SK.tan, hairStyle: 'hat', hatColor: '#a8905a', beard: 'stubble', body: '#7a6a4a', trim: '#4a3a2a', build: 'slim', weapon: 'pole', face: 'narrow', eyes: 'narrow' },
    { lv: 4, role: 'Scout', war: { atk: 2, def: 3, type: 'inf', ability: 'infiltrate' },
      bio: 'An idle gambler of Anle village who sold the drugged wine on Yellow Earth Ridge.' });
  H(107, 'shiqian', '時遷', 'Shi Qian', 'Flea on a Drum', '地賊星 Dizei', 'Thieving Star of Earth', 'swift', W('Dagger', 'S', 0.9),
    { skin: SK.tan, hairStyle: 'headband', band: '#2a2a2a', beard: 'stubble', body: '#2a2a2a', trim: '#5a5a5a', build: 'small', weapon: 'sword', face: 'narrow', eyes: 'round' },
    { lv: 16, role: 'Scout', war: { atk: 3, def: 3, type: 'inf', ability: 'infiltrate' }, mul: { spd: 1.45, luk: 1.4 },
      bio: 'A grave-robber and thief who can leap rooftops and steal anything; he once stole the Zhu family\'s rooster for supper.' });
  H(108, 'duanjingzhu', '段景住', 'Duan Jingzhu', 'Golden-Haired Hound', '地狗星 Digou', 'Hound Star of Earth', 'swift', W('Knife', 'S', 0.9),
    { skin: SK.light, hair: '#c8a040', hairStyle: 'wild', beard: 'stubble', beardColor: '#c8a040', body: '#6a5a3a', trim: '#a89070', weapon: 'sword', face: 'narrow' },
    { lv: 28, role: 'Scout — horse dealer', war: { atk: 3, def: 3, type: 'cav', ability: 'scout' },
      bio: 'A horse thief from Zhuozhou, golden-haired, who stole the Jade Lion that Lights the Night for Song Jiang, and lost it to the Zeng family.' });

  // ====================== Guests (not among the 108) ======================
  guest('hongxin', 'Hong Xin', '洪信', 'Grand Marshal', 'civil', W('Ceremonial Staff', 'S', 0.4),
    { skin: SK.fair, hairStyle: 'futou', beard: 'long', body: '#7a1a1a', trim: '#d8b36a', build: 'normal', weapon: 'none', face: 'round', eyes: 'narrow' },
    { bio: 'Grand Marshal of the Imperial Guard, sent to summon the Celestial Master. His pride broke the seal of the Hall of Subdued Demons.' });
  guest('wangjin', 'Wang Jin', '王進', 'Arms Instructor', 'warrior', W('Staff', 'S', 1.1, 'blunt'),
    { skin: SK.light, hairStyle: 'topknot', beard: 'short', body: '#4a4a5a', trim: '#c8c0a0', weapon: 'staff', face: 'long', eyes: 'narrow' },
    { lv: 12, bio: 'Arms instructor of the Imperial Guard, whose father once beat the street-tough Gao Qiu. When Gao rose to Marshal, Wang Jin fled with his mother.' });
  guest('luda', 'Lu Da', '魯達', 'Major of Weizhou', 'brute', W('Fists', 'S', 1.2, 'blunt'),
    { skin: '#d8a070', hairStyle: 'scarf', band: '#2a4a2a', beard: 'full', beardColor: '#2a1a10', body: '#3a5a3a', trim: '#c89a4a', build: 'big', weapon: 'fists', face: 'round', eyes: 'round', brows: 'thick' },
    { lv: 8, mul: { pwr: 1.25, hp: 1.2, spd: 0.85 }, bio: 'A major in the Weizhou garrison under Minister Chong: loud, generous, and quick with his fists. He will soon have another name.' });
  guest('chaogai', 'Chao Gai', '晁蓋', 'Heavenly King Who Carries the Pagoda', 'warrior', W('Sword', 'S', 1.05),
    { skin: SK.mid, hairStyle: 'scarf', band: '#3a2a1a', beard: 'full', body: '#6a5a2a', trim: '#d8b36a', build: 'big', weapon: 'sword', face: 'square', eyes: 'round' },
    { lv: 6, role: 'First Chief of Liangshan', war: { atk: 7, def: 7, type: 'inf', ability: 'morale' },
      bio: 'Headman of East Creek village, who once carried a stone pagoda across the stream. Generous and brave, he led the theft of the birthday gifts and became first chief of Liangshan.' });
  guest('qiongying', 'Qiongying', '瓊英', 'Feathered Arrow Maiden', 'archer', W('Flying Stones', 'L', 1.0, 'stone'),
    { skin: '#f6dcc4', hairStyle: 'woman', body: '#5a8ac8', trim: '#e8e0f0', build: 'slim', weapon: 'stones', dress: true, face: 'narrow', eyes: 'sharp', pin: '#c8c0e0' },
    { lv: 50, female: true, bio: 'A girl of Tian Hu\'s court who, taught in a dream, throws stones as Zhang Qing does. She avenged her parents on Tian Hu and married Zhang Qing.' });
})();
