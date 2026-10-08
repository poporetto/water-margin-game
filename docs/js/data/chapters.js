// Chapter cards. Each game chapter covers a span of the 120-chapter novel; titles are couplets in the novel's manner.
'use strict';
(function () {
  var CH = WM.data.chapters;
  function C(n, short, title, chapters, zh) { CH[n] = { short: short, title: title, chapters: chapters, zh: zh }; }
  C(0, 'The Demons Released', ['The Celestial Master is summoned to banish the plague;', 'Marshal Hong rashly sets the demons free.'], '1', '張天師祈禳瘟疫　洪太尉誤走妖魔');
  C(1, 'Nine Dragons', ['Instructor Wang flees by night to Yan\'an;', 'Nine Dragons makes havoc at the Shi Family Village.'], '2–3', '王教頭私走延安府　九紋龍大鬧史家村');
  C(2, 'The Flowery Monk', ['Major Lu strikes down the Lord of the West;', 'the Flowery Monk turns Mount Wutai upside down.'], '3–7', '魯提轄拳打鎮關西　魯智深大鬧五臺山');
  C(3, 'Panther Head', ['Lin Chong blunders into the White Tiger Hall;', 'in snow he takes shelter in the Mountain God\'s temple.'], '7–12', '林教頭誤入白虎堂　林教頭風雪山神廟');
  C(4, 'The Blue-Faced Beast', ['Yang Zhi sells his precious sabre in the Eastern Capital;', 'he contends with Suo Chao on the drill ground of Daming.'], '12–13', '楊志東京賣刀　急先鋒東郭爭功');
  C(5, 'The Birthday Gifts', ['Wu Yong wins over the three Ruan brothers;', 'on Yellow Earth Ridge the treasure is taken by guile.'], '14–20', '吳學究說三阮撞籌　智取生辰綱');
  C(6, 'Timely Rain', ['Song Jiang kills Yan Poxi in anger;', 'at Chai Jin\'s manor he meets Wu Song.'], '21–23', '宋江怒殺閻婆惜　橫海郡柴進留賓');
  C(7, 'The Pilgrim', ['On Jingyang Ridge Wu Song kills a tiger;', 'at Mandarin Duck Tower his vengeance is complete.'], '23–32', '景陽岡武松打虎　武行者夜走蜈蚣嶺');
  C(8, 'Qingfeng Fort', ['Hua Rong makes havoc at Qingfeng Fort;', 'Thunderbolt Qin Ming goes up the mountain at night.'], '32–35', '花榮大鬧清風寨　霹靂火夜走瓦礫場');
  C(9, 'Xunyang Tower', ['Song Jiang writes a rebel poem at Xunyang Tower;', 'the heroes storm the execution ground at Jiangzhou.'], '36–41', '潯陽樓宋江吟反詩　梁山泊好漢劫法場');
  C(10, 'The Heavenly Books', ['Song Jiang receives three scrolls from the Mysterious Lady;', 'Li Kui kills four tigers by the Yi Ridge.'], '42–43', '還道村受三卷天書　沂嶺殺四虎');
  C(11, 'Cuiping Mountain', ['Yang Xiong in drink brawls with Shi Xiu;', 'on Cuiping Mountain a wife pays for her deceit.'], '44–46', '病關索長街遇石秀　病關索大翻翠屏山');
  C(12, 'The Zhu Family Village', ['Three times Song Jiang attacks the Zhu Family Village;', 'Sun Li opens the gates from within.'], '46–50', '宋公明三打祝家莊');
  C(13, 'Gaotang', ['Li Kui kills Yin Tianxi;', 'Gongsun Sheng breaks the sorcery of Gao Lian.'], '51–54', '李逵打死殷天錫　入雲龍鬥法破高廉');
  C(14, 'Chained Cavalry', ['Shi Qian steals the goose-feather armour;', 'the hooked lance breaks the chained horses.'], '54–58', '吳用使時遷偷甲　宋江大破連環馬');
  C(15, 'Huazhou', ['Wu Yong borrows the golden bell at Huazhou;', 'Gongsun Sheng\'s formation subdues Mount Mangdang.'], '58–59', '吳用賺金鈴吊掛　公孫勝芒碭山降魔');
  C(16, 'Zengtou City', ['The Heavenly King falls to a poisoned arrow;', 'the brotherhood swears to avenge him.'], '60', '晁天王曾頭市中箭');
  C(17, 'The Jade Qilin', ['Wu Yong lures the Jade Qilin with a riddle;', 'Shi Xiu leaps from the tower onto the execution ground.'], '61–67', '吳用智賺玉麒麟　劫法場石秀跳樓');
  C(18, 'Dongping and Dongchang', ['Lu Junyi captures Shi Wengong;', 'Song Jiang takes Dongping, Lu takes Dongchang.'], '68–70', '盧俊義活捉史文恭　沒羽箭飛石打英雄');
  C(19, 'The Grand Assembly', ['At Loyalty Hall a stone tablet falls from heaven;', 'the hundred and eight heroes take their places.'], '71', '忠義堂石碣受天文　梁山泊英雄排座次');
  C(20, 'Amnesty', ['Li Kui tears the imperial edict;', 'Song Jiang at last accepts the emperor\'s pardon.'], '72–82', '黑旋風扯詔謗徽宗　宋公明全夥受招安');
  C(21, 'The Northern Campaign', ['Song Jiang breaks the Liao formation of the Great Unity;', 'the Flowery Monk visits his old master on Wutai.'], '83–90', '宋公明破陣成功　五臺山宋江參禪');
  C(22, 'Hedong and Huaixi', ['Qiongying\'s stones avenge her parents on Tian Hu;', 'Wang Qing is brought down in Huaixi.'], '91–110');
  C(23, 'The Southern Campaign', ['Song Jiang marches against Fang La;', 'one by one the stars fall over Jiangnan.'], '110–119');
  C(24, 'Liaoerwa', ['The emperor dreams of Liangshan Marsh;', 'the souls of the heroes gather at Liaoerwa.'], '120', '宋公明神聚蓼兒洼　徽宗帝夢遊梁山泊');
})();
