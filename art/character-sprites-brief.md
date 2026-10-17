# Character sprite brief

Water Margin, a Suikoden II–style RPG set in Northern Song China, c. 1120. Every person in the game walks the maps and fights in battle as a small sprite. Today these are drawn by code from a description; this list is for drawn replacements. Each sprite should match that character's portrait (linked in the lists) for face, hair, clothes and colours, and the style of the 32 px tiles.

## Format

- **One PNG per person: 144 × 256 px, transparent background.** A grid of **3 columns × 4 rows**, each frame **48 × 64 px**, no padding between frames.
- **Columns:** 1 standing still · 2 mid-step, left foot forward · 3 mid-step, right foot forward. The game walks them stand → left → stand → right.
- **Rows:** 1 facing down (towards the viewer) · 2 facing left · 3 facing right · 4 facing up (back to the viewer).
- **In each frame:** the figure stands centred, **feet touching the bottom edge** of the frame (the game sets the bottom of the frame on the ground). A figure fills about 32 px wide and 48–56 px tall; tall hats, helmets, spears and staves may reach the top of the frame but not past it.
- **Proportions:** Suikoden II style: a large head, about 2½ heads tall, sturdy and readable at small size (see [the sample](sprite-samples/songjiang-preview-x4.png)). Big men (Lu Zhishen, Li Kui, Lu Junyi) are broader and a little taller; small ones (Song Jiang, Wu Dalang) shorter.
- **Pixel art:** hard edges, no anti-aliasing or blur, a dark outline, roughly 16–24 colours per sprite. Light from the upper left.
- **No weapons on the walking sheet.** People do not go about town armed; the weapon appears only on the battle sheet below. Guards, soldiers and constables on duty are the exception and keep their spear or staff. (Clothes that are part of who they are, such as a monk's prayer beads or an official's hat, stay.)
- **The right-facing row may mirror the left-facing row**, as long as nothing one-sided (a scar, a tattoo) flips wrongly.
- **All twelve frames must be the same person**: same clothes, colours and height.
- **No shadow** under the feet; the game draws its own.

The walking sheet is used on the maps, and laid on its side when someone lies wounded or dead (the facing-down standing frame).

## The battle sheet

In battles and duels everyone is seen side-on, five times larger, **with the weapon in hand**. So everyone who fights (the hundred and eight, the guests, and the enemies in section 5) has a second sheet: their walking side view again, carrying the weapon.

- **One PNG: 144 × 64 px**, a single row of **3 frames** of 48 × 64, transparent background.
- **The frames:** the same as the left-facing row of the walking sheet (stand, step, step), **facing west (left)**, but holding the weapon listed for them: a spear or staff upright beside them, a sword in the hand, Li Kui's two axes, a bow for an archer.
- **Facing west only.** The party stands on the right of the field and faces west; the game mirrors the sheet for enemies, who face east.
- Same size, position and proportions as the walking sheet; feet on the bottom edge. The weapon may reach to the top and sides of the frame.
- File name: the file id with **`-battle`** added: `songjiang-battle.png`, `en-bandit-battle.png`. Without one, battles draw the code's own figure with the weapon.

## File names and adding them to the game

Save each sheet in `assets/sprites/` under the **file id** given in the lists (`songjiang.png`, `npc-villager.png`, `en-bandit.png`), and add the id to the `sprites` list in `assets/manifest.js`, written with a colon for townsfolk and enemies: `'songjiang'`, `'npc:villager'`, `'en:bandit'`. A sheet 144 px wide is recognised as 32 px art by itself. Anyone without a sheet keeps the code-drawn sprite, so they can be added a batch at a time.

## Not in this list

Animals and monsters (tigers, wolves, serpents, horses and the like: 21 in all) are drawn differently and will have a list of their own.

## 1. First batch: the characters you play most

The party leaders of each chapter and those always at their side.

| # | file id | name | nickname | build, hair | weapon (battle sheet) | reference |
|---|---|---|---|---|---|---|
| 1 | `songjiang` | Song Jiang | “Timely Rain” | short, scarf | Sword | [portrait](../assets/portraits/songjiang-expressions.png) |
| 2 | `lujunyi` | Lu Junyi | “Jade Qilin” | big, broad, scarf | Steel Spear | [portrait](../assets/portraits/lujunyi-expressions.png) |
| 3 | `wuyong` | Wu Yong | “Resourceful Star” | slim, scarf | Copper Chains | [portrait](../assets/portraits/wuyong-expressions.png) |
| 4 | `gongsunsheng` | Gongsun Sheng | “Dragon Entering the Clouds” | slim, daoist | Pine-Pattern Sword | [portrait](../assets/portraits/gongsunsheng-expressions.png) |
| 6 | `linchong` | Lin Chong | “Panther Head” | medium, topknot | Serpent Spear | [portrait](../assets/portraits/linchong-expressions.png) |
| 13 | `luzhishen` | Lu Zhishen | “Flowery Monk” | big, broad, monk | Iron Chan Staff | [portrait](../assets/portraits/luzhishen-expressions.png) |
| 14 | `wusong` | Wu Song | “Pilgrim” | medium, pilgrim | Twin Snowflake Blades | [portrait](../assets/portraits/wusong-expressions.png) |
| 22 | `likui` | Li Kui | “Black Whirlwind” | big, broad, wild | Twin Axes | [portrait](../assets/portraits/likui-expressions.png) |
| 9 | `huarong` | Hua Rong | “Little Li Guang” | medium, topknot | Bow | [portrait](../assets/portraits/huarong-expressions.png) |
| 17 | `yangzhi` | Yang Zhi | “Blue-Faced Beast” | medium, helmet | Heirloom Sabre | [portrait](../assets/portraits/yangzhi-expressions.png) |
| 23 | `shijin` | Shi Jin | “Nine Dragons” | medium, topknot | Three-Pointed Blade | [portrait](../assets/portraits/shijin-expressions.png) |
| 20 | `daizong` | Dai Zong | “Magic Traveller” | slim, scarf | Sword | [portrait](../assets/portraits/daizong-expressions.png) |
| 36 | `yanqing` | Yan Qing | “The Prodigal” | slim, topknot | Crossbow | [portrait](../assets/portraits/yanqing-expressions.png) |
| guest | `chaogai` | Chao Gai | “Heavenly King Who Carries the Pagoda” | big, broad, scarf | Sword | [portrait](../assets/portraits/chaogai-expressions.png) |
| guest | `luda` | Lu Da | “Major of Weizhou” | big, broad, scarf | Fists | [portrait](../assets/portraits/luda-expressions.png) |
| guest | `wangjin` | Wang Jin | “Arms Instructor” | medium, topknot | Staff | [portrait](../assets/portraits/wangjin-expressions.png) |
| guest | `hongxin` | Hong Xin | “Grand Marshal” | medium, futou | Ceremonial Staff | [portrait](../assets/portraits/hongxin-expressions.png) |
| 21 | `liutang` | Liu Tang | “Red-Haired Devil” | medium, wild | Long-Handled Sabre | [portrait](../assets/portraits/liutang-expressions.png) |
| 27 | `ruanxiaoer` | Ruan Xiao'er | “Tai Sui Who Stands His Ground” | medium, headband | Fish Spear | [portrait](../assets/portraits/ruanxiaoer-expressions.png) |
| 29 | `ruanxiaowu` | Ruan Xiaowu | “Short-Lived Second Brother” | medium, headband | Dagger | [portrait](../assets/portraits/ruanxiaowu-expressions.png) |
| 31 | `ruanxiaoqi` | Ruan Xiaoqi | “Living King of Hell” | medium, wild | Fish Spear | [portrait](../assets/portraits/ruanxiaoqi-expressions.png) |
| 106 | `baisheng` | Bai Sheng | “Daylight Rat” | slim, hat | Carrying Pole | [portrait](../assets/portraits/baisheng-expressions.png) |
| 12 | `zhutong` | Zhu Tong | “Lord of the Beautiful Beard” | big, broad, scarf | Halberd | [portrait](../assets/portraits/zhutong-expressions.png) |
| 25 | `leiheng` | Lei Heng | “Winged Tiger” | big, broad, scarf | Sabre | [portrait](../assets/portraits/leiheng-expressions.png) |
| 10 | `chaijin` | Chai Jin | “Little Whirlwind” | medium, scarf | Sword | [portrait](../assets/portraits/chaijin-expressions.png) |
| 30 | `zhangshun` | Zhang Shun | “White Streak in the Waves” | slim, topknot | Short Sword | [portrait](../assets/portraits/zhangshun-expressions.png) |
| 26 | `lijun` | Li Jun | “River Dragon” | medium, headband | Steel Fork | [portrait](../assets/portraits/lijun-expressions.png) |
| 33 | `shixiu` | Shi Xiu | “Daredevil Third Brother” | medium, topknot | Sabre | [portrait](../assets/portraits/shixiu-expressions.png) |
| 32 | `yangxiong` | Yang Xiong | “Sick Guan Suo” | medium, scarf | Executioner's Sabre | [portrait](../assets/portraits/yangxiong-expressions.png) |
| 107 | `shiqian` | Shi Qian | “Flea on a Drum” | short, headband | Dagger | [portrait](../assets/portraits/shiqian-expressions.png) |
| 59 | `husanniang` | Hu Sanniang ♀ | “Ten Feet of Blue” | slim, woman | Twin Sabres & Lasso | [portrait](../assets/portraits/husanniang-expressions.png) |
| 7 | `qinming` | Qin Ming | “Thunderbolt” | big, broad, helmet | Wolf-Tooth Mace | [portrait](../assets/portraits/qinming-expressions.png) |
| 5 | `guansheng` | Guan Sheng | “Great Blade” | big, broad, helmet | Green Dragon Blade | [portrait](../assets/portraits/guansheng-expressions.png) |
| 8 | `huyanzhuo` | Huyan Zhuo | “Twin Whips” | big, broad, helmet | Twin Steel Whips | [portrait](../assets/portraits/huyanzhuo-expressions.png) |

## 2. The rest of the hundred and eight, and the guests

| # | file id | name | nickname | build, hair | weapon (battle sheet) | reference |
|---|---|---|---|---|---|---|
| 11 | `liying` | Li Ying | “Sky-Striking Eagle” | medium, scarf | Flying Knives | [portrait](../assets/portraits/liying-expressions.png) |
| 15 | `dongping` | Dong Ping | “Double Spears” | medium, helmet | Twin Spears | [portrait](../assets/portraits/dongping-expressions.png) |
| 16 | `zhangqing` | Zhang Qing | “Featherless Arrow” | medium, helmet | Flying Stones | [portrait](../assets/portraits/zhangqing-expressions.png) |
| 18 | `xuning` | Xu Ning | “Gold Lancer” | medium, helmet | Hooked Lance | [portrait](../assets/portraits/xuning-expressions.png) |
| 19 | `suochao` | Suo Chao | “Impatient Vanguard” | big, broad, helmet | Golden Battle-Axe | [portrait](../assets/portraits/suochao-expressions.png) |
| 24 | `muhong` | Mu Hong | “Unrestrained” | medium, topknot | Spear | [portrait](../assets/portraits/muhong-expressions.png) |
| 28 | `zhangheng` | Zhang Heng | “Boatman” | big, broad, wild | Boatman's Knife | [portrait](../assets/portraits/zhangheng-expressions.png) |
| 34 | `xiezhen` | Xie Zhen | “Two-Headed Snake” | medium, topknot | Steel Hunting Fork | [portrait](../assets/portraits/xiezhen-expressions.png) |
| 35 | `xiebao` | Xie Bao | “Twin-Tailed Scorpion” | medium, headband | Steel Hunting Fork | [portrait](../assets/portraits/xiebao-expressions.png) |
| 37 | `zhuwu` | Zhu Wu | “Wily Strategist” | slim, scarf | Twin Swords | [portrait](../assets/portraits/zhuwu-expressions.png) |
| 38 | `huangxin` | Huang Xin | “Suppressor of Three Mountains” | medium, helmet | Mourning Sword | [portrait](../assets/portraits/huangxin-expressions.png) |
| 39 | `sunli` | Sun Li | “Sick Yuchi” | big, broad, helmet | Spear & Whip | [portrait](../assets/portraits/sunli-expressions.png) |
| 40 | `xuanzan` | Xuan Zan | “Ugly Prince Consort” | medium, helmet | Steel Sabre | [portrait](../assets/portraits/xuanzan-expressions.png) |
| 41 | `haosiwen` | Hao Siwen | “Wood Dog of the Well” | medium, helmet | Spear | [portrait](../assets/portraits/haosiwen-expressions.png) |
| 42 | `hantao` | Han Tao | “General of a Hundred Victories” | medium, helmet | Jujube-Wood Lance | [portrait](../assets/portraits/hantao-expressions.png) |
| 43 | `pengqi` | Peng Qi | “Heaven-Eyed General” | medium, helmet | Three-Pointed Blade | [portrait](../assets/portraits/pengqi-expressions.png) |
| 44 | `shantinggui` | Shan Tinggui | “General of Sacred Water” | medium, helmet | Black Spear | [portrait](../assets/portraits/shantinggui-expressions.png) |
| 45 | `weidingguo` | Wei Dingguo | “General of Holy Fire” | medium, helmet | Fire Sabre | [portrait](../assets/portraits/weidingguo-expressions.png) |
| 46 | `xiaorang` | Xiao Rang | “Master Calligrapher” | slim, scarf | Brush | [portrait](../assets/portraits/xiaorang-expressions.png) |
| 47 | `peixuan` | Pei Xuan | “Iron-Faced Judge” | medium, futou | Twin Swords | [portrait](../assets/portraits/peixuan-expressions.png) |
| 48 | `oupeng` | Ou Peng | “Golden-Winged Eagle” | medium, topknot | Spear | [portrait](../assets/portraits/oupeng-expressions.png) |
| 49 | `dengfei` | Deng Fei | “Fiery-Eyed Lion” | big, broad, wild | Iron Chain | [portrait](../assets/portraits/dengfei-expressions.png) |
| 50 | `yanshun` | Yan Shun | “Brocade Tiger” | big, broad, headband | Sabre | [portrait](../assets/portraits/yanshun-expressions.png) |
| 51 | `yanglin` | Yang Lin | “Brocade Leopard” | medium, topknot | Brush-Tipped Spear | [portrait](../assets/portraits/yanglin-expressions.png) |
| 52 | `lingzhen` | Ling Zhen | “Heaven-Shaking Thunder” | big, broad, helmet | Fire Trebuchet | [portrait](../assets/portraits/lingzhen-expressions.png) |
| 53 | `jiangjing` | Jiang Jing | “Divine Mathematician” | slim, scarf | Abacus | [portrait](../assets/portraits/jiangjing-expressions.png) |
| 54 | `lufang` | Lü Fang | “Little Marquis” | medium, helmet | Red Halberd | [portrait](../assets/portraits/lufang-expressions.png) |
| 55 | `guosheng` | Guo Sheng | “Second Rengui” | medium, helmet | White Halberd | [portrait](../assets/portraits/guosheng-expressions.png) |
| 56 | `andaoquan` | An Daoquan | “Divine Physician” | slim, scarf | Needles | [portrait](../assets/portraits/andaoquan-expressions.png) |
| 57 | `huangfuduan` | Huangfu Duan | “Purple-Bearded Count” | medium, scarf | Hoof Knife | [portrait](../assets/portraits/huangfuduan-expressions.png) |
| 58 | `wangying` | Wang Ying | “Stumpy Tiger” | short, topknot | Spear | [portrait](../assets/portraits/wangying-expressions.png) |
| 60 | `baoxu` | Bao Xu | “God of Death” | big, broad, wild | Broad Sword | [portrait](../assets/portraits/baoxu-expressions.png) |
| 61 | `fanrui` | Fan Rui | “Demon King Who Roils the World” | medium, daoist | Meteor Hammer | [portrait](../assets/portraits/fanrui-expressions.png) |
| 62 | `kongming` | Kong Ming | “Comet” | medium, topknot | Spear | [portrait](../assets/portraits/kongming-expressions.png) |
| 63 | `kongliang` | Kong Liang | “Lone Fire” | medium, topknot | Sword | [portrait](../assets/portraits/kongliang-expressions.png) |
| 64 | `xiangchong` | Xiang Chong | “Eight-Armed Nezha” | medium, headband | Shield & Flying Knives | [portrait](../assets/portraits/xiangchong-expressions.png) |
| 65 | `ligun` | Li Gun | “Sky-Soaring Sage” | medium, headband | Shield & Javelins | [portrait](../assets/portraits/ligun-expressions.png) |
| 66 | `jindajian` | Jin Dajian | “Jade-Armed Craftsman” | medium, scarf | Graver | [portrait](../assets/portraits/jindajian-expressions.png) |
| 67 | `malin` | Ma Lin | “Iron Flute Immortal” | medium, topknot | Twin Swords & Flute | [portrait](../assets/portraits/malin-expressions.png) |
| 68 | `tongwei` | Tong Wei | “Dragon from the Cave” | medium, headband | Short Sword | [portrait](../assets/portraits/tongwei-expressions.png) |
| 69 | `tongmeng` | Tong Meng | “River-Churning Clam” | medium, headband | Short Sword | [portrait](../assets/portraits/tongmeng-expressions.png) |
| 70 | `mengkang` | Meng Kang | “Jade Flagpole” | slim, topknot | Spear | [portrait](../assets/portraits/mengkang-expressions.png) |
| 71 | `houjian` | Hou Jian | “Long-Armed Gibbon” | slim, topknot | Shears | [portrait](../assets/portraits/houjian-expressions.png) |
| 72 | `chenda` | Chen Da | “Stream-Leaping Tiger” | medium, headband | Steel Spear | [portrait](../assets/portraits/chenda-expressions.png) |
| 73 | `yangchun` | Yang Chun | “White-Spotted Snake” | slim, topknot | Long Blade | [portrait](../assets/portraits/yangchun-expressions.png) |
| 74 | `zhengtianshou` | Zheng Tianshou | “Fair-Faced Gentleman” | slim, topknot | Sword | [portrait](../assets/portraits/zhengtianshou-expressions.png) |
| 75 | `taozongwang` | Tao Zongwang | “Nine-Tailed Turtle” | big, broad, headband | Iron Spade | [portrait](../assets/portraits/taozongwang-expressions.png) |
| 76 | `songqing` | Song Qing | “Iron Fan” | medium, scarf | Iron Fan | [portrait](../assets/portraits/songqing-expressions.png) |
| 77 | `yuehe` | Yue He | “Iron Whistle” | slim, topknot | Short Spear | [portrait](../assets/portraits/yuehe-expressions.png) |
| 78 | `gongwang` | Gong Wang | “Flower-Necked Tiger” | medium, helmet | Flying Spears | [portrait](../assets/portraits/gongwang-expressions.png) |
| 79 | `dingdesun` | Ding Desun | “Arrow-Struck Tiger” | medium, helmet | Flying Forks | [portrait](../assets/portraits/dingdesun-expressions.png) |
| 80 | `muchun` | Mu Chun | “Little Unrestrained” | medium, topknot | Staff | [portrait](../assets/portraits/muchun-expressions.png) |
| 81 | `caozheng` | Cao Zheng | “Demon Carver” | big, broad, headband | Butcher's Knife | [portrait](../assets/portraits/caozheng-expressions.png) |
| 82 | `songwan` | Song Wan | “Giant in the Clouds” | big, broad, headband | Sabre | [portrait](../assets/portraits/songwan-expressions.png) |
| 83 | `duqian` | Du Qian | “Sky-Touching Giant” | big, broad, headband | Sabre | [portrait](../assets/portraits/duqian-expressions.png) |
| 84 | `xueyong` | Xue Yong | “Sick Tiger” | slim, topknot | Staff | [portrait](../assets/portraits/xueyong-expressions.png) |
| 85 | `shien` | Shi En | “Golden-Eyed Tiger Cub” | medium, topknot | Sword | [portrait](../assets/portraits/shien-expressions.png) |
| 86 | `lizhong` | Li Zhong | “Tiger-Slaying General” | medium, topknot | Staff | [portrait](../assets/portraits/lizhong-expressions.png) |
| 87 | `zhoutong` | Zhou Tong | “Little Conqueror” | medium, topknot | Spear | [portrait](../assets/portraits/zhoutong-expressions.png) |
| 88 | `tanglong` | Tang Long | “Gold-Spotted Leopard” | big, broad, headband | Iron Hammer | [portrait](../assets/portraits/tanglong-expressions.png) |
| 89 | `duxing` | Du Xing | “Demon Face” | big, broad, topknot | Sabre | [portrait](../assets/portraits/duxing-expressions.png) |
| 90 | `zouyuan` | Zou Yuan | “Dragon from the Forest” | medium, wild | Sabre | [portrait](../assets/portraits/zouyuan-expressions.png) |
| 91 | `zourun` | Zou Run | “Single-Horned Dragon” | medium, topknot | Sabre | [portrait](../assets/portraits/zourun-expressions.png) |
| 92 | `zhugui` | Zhu Gui | “Dry-Land Crocodile” | medium, scarf | Knife | [portrait](../assets/portraits/zhugui-expressions.png) |
| 93 | `zhufu` | Zhu Fu | “Smiling Tiger” | medium, scarf | Knife | [portrait](../assets/portraits/zhufu-expressions.png) |
| 94 | `caifu` | Cai Fu | “Iron Arm” | big, broad, scarf | Executioner's Sword | [portrait](../assets/portraits/caifu-expressions.png) |
| 95 | `caiqing` | Cai Qing | “Single Flower” | medium, scarf | Executioner's Sword | [portrait](../assets/portraits/caiqing-expressions.png) |
| 96 | `lili` | Li Li | “Life-Taking Judge” | medium, wild | Knife | [portrait](../assets/portraits/lili-expressions.png) |
| 97 | `liyun` | Li Yun | “Green-Eyed Tiger” | medium, helmet | Sabre | [portrait](../assets/portraits/liyun-expressions.png) |
| 98 | `jiaoting` | Jiao Ting | “Faceless” | big, broad, topknot | Fists | [portrait](../assets/portraits/jiaoting-expressions.png) |
| 99 | `shiyong` | Shi Yong | “Stone General” | big, broad, headband | Sabre | [portrait](../assets/portraits/shiyong-expressions.png) |
| 100 | `sunxin` | Sun Xin | “Little Yuchi” | medium, topknot | Steel Whip | [portrait](../assets/portraits/sunxin-expressions.png) |
| 101 | `gudasao` | Gu Dasao ♀ | “Female Tiger” | big, broad, woman | Sabres | [portrait](../assets/portraits/gudasao-expressions.png) |
| 102 | `zhangqing2` | Zhang Qing | “Vegetable Gardener” | medium, hat | Pole | [portrait](../assets/portraits/zhangqing2-expressions.png) |
| 103 | `sunerniang` | Sun Erniang ♀ | “Female Yaksha” | medium, woman | Knives | [portrait](../assets/portraits/sunerniang-expressions.png) |
| 104 | `wangdingliu` | Wang Dingliu | “Living Lightning God” | slim, topknot | Staff | [portrait](../assets/portraits/wangdingliu-expressions.png) |
| 105 | `yubaosi` | Yu Baosi | “God of the Dangerous Road” | big, broad, headband | Flagstaff | [portrait](../assets/portraits/yubaosi-expressions.png) |
| 108 | `duanjingzhu` | Duan Jingzhu | “Golden-Haired Hound” | medium, wild | Knife | [portrait](../assets/portraits/duanjingzhu-expressions.png) |
| guest | `qiongying` | Qiongying ♀ | “Feathered Arrow Maiden” | slim, woman | Flying Stones | — |

## 3. Townsfolk and soldiers (generic people)

One sheet each; the game reuses them across every town.

| file id | who | build, hair, carried | reference |
|---|---|---|---|
| `npc-villager` | Villager | medium, topknot | [portrait](../assets/portraits/villager-expressions.png) |
| `npc-villager2` | Villager | medium, headband | [portrait](../assets/portraits/villager2-expressions.png) |
| `npc-farmer` | Farmer | medium, hat | [portrait](../assets/portraits/farmer-expressions.png) |
| `npc-woman` | Village Woman | medium, woman | [portrait](../assets/portraits/woman-expressions.png) |
| `npc-woman2` | Townswoman | medium, woman | [portrait](../assets/portraits/woman2-expressions.png) |
| `npc-oldman` | Old Man | medium, topknot | [portrait](../assets/portraits/oldman-expressions.png) |
| `npc-oldwoman` | Old Woman | medium, woman | [portrait](../assets/portraits/oldwoman-expressions.png) |
| `npc-child` | Child | short, topknot | [portrait](../assets/portraits/child-expressions.png) |
| `npc-merchant` | Merchant | medium, scarf | [portrait](../assets/portraits/merchant-expressions.png) |
| `npc-shopkeep` | Shopkeeper | medium, scarf | [portrait](../assets/portraits/shopkeep-expressions.png) |
| `npc-waiter` | Waiter | medium, headband | [portrait](../assets/portraits/waiter-expressions.png) |
| `npc-innkeep` | Innkeeper | big, broad, scarf | — |
| `npc-smith` | Blacksmith | big, broad, headband | [portrait](../assets/portraits/smith-expressions.png) |
| `npc-talismaster` | Incense Daoist | medium, daoist | — |
| `npc-monk` | Monk | medium, bald | [portrait](../assets/portraits/monk-expressions.png) |
| `npc-daoist` | Daoist | medium, daoist | — |
| `npc-scholar` | Scholar | slim, scarf | [portrait](../assets/portraits/scholar-expressions.png) |
| `npc-soldier` | Soldier | medium, helmet, spear | [portrait](../assets/portraits/soldier-expressions.png) |
| `npc-guard` | Guard | medium, helmet, spear | [portrait](../assets/portraits/guard-expressions.png) |
| `npc-officer` | Officer | medium, futou | — |
| `npc-official` | Official | medium, futou | [portrait](../assets/portraits/official-expressions.png) |
| `npc-constable` | Constable | medium, scarf, dao | [portrait](../assets/portraits/constable-expressions.png) |
| `npc-bandit` | Bandit | medium, headband, dao | [portrait](../assets/portraits/bandit-expressions.png) |
| `npc-servant` | Servant | medium, topknot | [portrait](../assets/portraits/servant-expressions.png) |
| `npc-maid` | Maid | medium, woman | — |
| `npc-boatman` | Boatman | medium, hat | [portrait](../assets/portraits/boatman-expressions.png) |
| `npc-hunter` | Hunter | medium, headband, bow | — |
| `npc-drunk` | Drunkard | medium, wild | — |
| `npc-gambler` | Gambler | medium, headband | [portrait](../assets/portraits/gambler-expressions.png) |
| `npc-outlaw` | Liangshan Man | medium, headband, spear | [portrait](../assets/portraits/outlaw-expressions.png) |
| `npc-outlawW` | Liangshan Woman | medium, woman | — |
| `npc-recorder` | Record Keeper | slim, scarf | [portrait](../assets/portraits/recorder-expressions.png) |

## 4. Named people of the story

| file id | who | build, hair, carried | reference |
|---|---|---|---|
| `npc-abbot` | Abbot of Shangqing | medium, daoist | [portrait](../assets/portraits/abbot-expressions.png) |
| `npc-daoistA` | Daoist | medium, daoist | [portrait](../assets/portraits/daoistA-expressions.png) |
| `npc-workman` | Workman | medium, topknot | [portrait](../assets/portraits/workman-expressions.png) |
| `npc-hongguard` | Escort | medium, helmet, spear | — |
| `npc-daoistElder` | Elder Daoist | medium, daoist | — |
| `npc-oxboy_boy` | Herd-Boy | short, topknot | [portrait](../assets/portraits/oxboy_boy-expressions.png) |
| `npc-gaoqiu` | Gao Qiu | medium, futou | [portrait](../assets/portraits/gaoqiu-expressions.png) |
| `npc-wangmother` | Wang Jin's Mother | medium, woman | [portrait](../assets/portraits/wangmother-expressions.png) |
| `npc-shitaigong` | Shi Taigong | medium, scarf | [portrait](../assets/portraits/shitaigong-expressions.png) |
| `npc-wangsi` | Wang Si | medium, topknot | [portrait](../assets/portraits/wangsi-expressions.png) |
| `npc-liji` | Li Ji the Hunter | medium, headband, bow | [portrait](../assets/portraits/liji-expressions.png) |
| `npc-dutyA` | Duty Officer | medium, scarf, dao | [portrait](../assets/portraits/dutyA-expressions.png) |
| `npc-gaoofficer` | Guard Officer | medium, helmet, spear | [portrait](../assets/portraits/gaoofficer-expressions.png) |
| `npc-zhangservant` | Servant Zhang | medium, topknot | — |
| `npc-oldjin` | Old Jin | medium, topknot | [portrait](../assets/portraits/oldjin-expressions.png) |
| `npc-cuilian` | Jin Cuilian | slim, woman | [portrait](../assets/portraits/cuilian-expressions.png) |
| `npc-zhengtu` | Zheng the Butcher | big, broad, scarf | [portrait](../assets/portraits/zhengtu-expressions.png) |
| `npc-innwaiter` | Inn Boy | medium, headband | [portrait](../assets/portraits/innwaiter-expressions.png) |
| `npc-zhaoyuanwai` | Squire Zhao | medium, scarf | [portrait](../assets/portraits/zhaoyuanwai-expressions.png) |
| `npc-zhizhen` | Abbot Zhizhen | medium, bald | [portrait](../assets/portraits/zhizhen-expressions.png) |
| `npc-wutaimonk` | Monk of Wutai | medium, bald, staff | [portrait](../assets/portraits/wutaimonk-expressions.png) |
| `npc-peddler` | Wine Peddler | medium, hat, pole | [portrait](../assets/portraits/peddler-expressions.png) |
| `npc-liutaigong` | Liu Taigong | medium, scarf | [portrait](../assets/portraits/liutaigong-expressions.png) |
| `npc-oldmonk` | Old Monk | slim, bald | [portrait](../assets/portraits/oldmonk-expressions.png) |
| `npc-cuidaocheng` | Cui Daocheng | big, broad, bald, dao | [portrait](../assets/portraits/cuidaocheng-expressions.png) |
| `npc-qiuxiaoyi` | Qiu Xiaoyi | medium, daoist, sword | [portrait](../assets/portraits/qiuxiaoyi-expressions.png) |
| `npc-zhiqing` | Abbot Zhiqing | medium, bald | [portrait](../assets/portraits/zhiqing-expressions.png) |
| `npc-zhangsan` | Zhang San | medium, topknot | [portrait](../assets/portraits/zhangsan-expressions.png) |
| `npc-lisi` | Li Si | medium, headband | [portrait](../assets/portraits/lisi-expressions.png) |
| `npc-jiner` | Jin'er | slim, woman | [portrait](../assets/portraits/jiner-expressions.png) |
| `npc-gaoyanei` | Gao Yanei | slim, scarf | [portrait](../assets/portraits/gaoyanei-expressions.png) |
| `npc-linwife` | Lady Zhang | slim, woman | [portrait](../assets/portraits/linwife-expressions.png) |
| `npc-zhangjiaotou` | Instructor Zhang | medium, topknot | [portrait](../assets/portraits/zhangjiaotou-expressions.png) |
| `npc-luqian` | Lu Qian | medium, scarf | [portrait](../assets/portraits/luqian-expressions.png) |
| `npc-fuan` | Fu An | medium, scarf | [portrait](../assets/portraits/fuan-expressions.png) |
| `npc-swordseller` | Sword Seller | big, broad, headband, sword | [portrait](../assets/portraits/swordseller-expressions.png) |
| `npc-dongchao` | Dong Chao | medium, scarf, pole | [portrait](../assets/portraits/dongchao-expressions.png) |
| `npc-xueba` | Xue Ba | medium, scarf, pole | [portrait](../assets/portraits/xueba-expressions.png) |
| `npc-hongjiaotou` | Instructor Hong | medium, scarf, staff | [portrait](../assets/portraits/hongjiaotou-expressions.png) |
| `npc-warden` | Camp Warden | medium, futou | [portrait](../assets/portraits/warden-expressions.png) |
| `npc-lixiaoer` | Li Xiaoer | medium, headband | [portrait](../assets/portraits/lixiaoer-expressions.png) |
| `npc-lixiaoerwife` | Li Xiaoer's Wife | medium, woman | [portrait](../assets/portraits/lixiaoerwife-expressions.png) |
| `npc-overseer` | Overseer of the Depot | medium, scarf | [portrait](../assets/portraits/overseer-expressions.png) |
| `npc-oldsoldier` | Old Soldier | medium, topknot | [portrait](../assets/portraits/oldsoldier-expressions.png) |
| `npc-wanglun` | Wang Lun | slim, scarf | [portrait](../assets/portraits/wanglun-expressions.png) |
| `npc-gaoofficer2` | Officer of the Residence | medium, futou | [portrait](../assets/portraits/gaoofficer2-expressions.png) |
| `npc-niuer` | Niu Er | big, broad, wild | [portrait](../assets/portraits/niuer-expressions.png) |
| `npc-zhoujin` | Zhou Jin | medium, helmet, spear | [portrait](../assets/portraits/zhoujin-expressions.png) |
| `npc-liangzhongshu` | Liang Zhongshu | medium, futou | [portrait](../assets/portraits/liangzhongshu-expressions.png) |
| `npc-kfinnkeep` | Innkeeper | big, broad, scarf | [portrait](../assets/portraits/kfinnkeep-expressions.png) |
| `npc-hetao` | He Tao | medium, futou | [portrait](../assets/portraits/hetao-expressions.png) |
| `npc-laoduguan` | Old Steward | medium, scarf | [portrait](../assets/portraits/laoduguan-expressions.png) |
| `npc-denglong` | Deng Long | big, broad, bald, staff | [portrait](../assets/portraits/denglong-expressions.png) |
| `npc-huangan` | Huang An | medium, helmet | [portrait](../assets/portraits/huangan-expressions.png) |
| `npc-chaoservant` | Chao Gai's Servant | medium, topknot | [portrait](../assets/portraits/chaoservant-expressions.png) |
| `npc-erlongguard` | Gate Guard | medium, bald, staff | [portrait](../assets/portraits/erlongguard-expressions.png) |
| `npc-yanpo` | Old Mother Yan | medium, woman | [portrait](../assets/portraits/yanpo-expressions.png) |
| `npc-yanpoxi` | Yan Poxi | slim, woman | [portrait](../assets/portraits/yanpoxi-expressions.png) |
| `npc-tangniuer` | Tang Niu'er | medium, headband | [portrait](../assets/portraits/tangniuer-expressions.png) |
| `npc-songtaigong` | Song Taigong | medium, scarf | [portrait](../assets/portraits/songtaigong-expressions.png) |
| `npc-oldwang` | Old Wang the Soup-Seller | medium, topknot | [portrait](../assets/portraits/oldwang-expressions.png) |
| `npc-wudalang` | Wu Dalang | short, hat | [portrait](../assets/portraits/wudalang-expressions.png) |
| `npc-panjinlian` | Pan Jinlian | slim, woman | [portrait](../assets/portraits/panjinlian-expressions.png) |
| `npc-wangpo` | Granny Wang | medium, woman | [portrait](../assets/portraits/wangpo-expressions.png) |
| `npc-ximenqing` | Ximen Qing | medium, scarf | [portrait](../assets/portraits/ximenqing-expressions.png) |
| `npc-yunge` | Yun Ge | short, topknot | [portrait](../assets/portraits/yunge-expressions.png) |
| `npc-hejiu` | He Jiu | medium, scarf | [portrait](../assets/portraits/hejiu-expressions.png) |
| `npc-yangguofficial` | Magistrate of Yanggu | medium, futou | [portrait](../assets/portraits/yangguofficial-expressions.png) |
| `npc-tigerhunter` | Hunter in a Tiger Skin | medium, wild, fork | [portrait](../assets/portraits/tigerhunter-expressions.png) |
| `npc-shienfather` | Old Warden Shi | medium, futou | [portrait](../assets/portraits/shienfather-expressions.png) |
| `npc-jiangmenshen` | Jiang the Door God | big, broad, wild | [portrait](../assets/portraits/jiangmenshen-expressions.png) |
| `npc-zhangdujian` | Commander Zhang | medium, helmet | [portrait](../assets/portraits/zhangdujian-expressions.png) |
| `npc-zhangtuanlian` | Militia Captain Zhang | medium, helmet | [portrait](../assets/portraits/zhangtuanlian-expressions.png) |
| `npc-yulan` | Yulan | slim, woman | [portrait](../assets/portraits/yulan-expressions.png) |
| `npc-daoistwang` | The Daoist of Centipede Ridge | medium, daoist, sword | [portrait](../assets/portraits/daoistwang-expressions.png) |
| `npc-tavernkeep` | Tavern Keeper | medium, scarf | [portrait](../assets/portraits/tavernkeep-expressions.png) |
| `npc-liugao` | Liu Gao | medium, futou | [portrait](../assets/portraits/liugao-expressions.png) |
| `npc-liuwife` | Lady Liu | slim, woman | [portrait](../assets/portraits/liuwife-expressions.png) |
| `npc-qingzhouprefect` | Prefect Murong | medium, futou | [portrait](../assets/portraits/qingzhouprefect-expressions.png) |
| `npc-zhaoneng` | Constable Zhao | medium, scarf, dao | [portrait](../assets/portraits/zhaoneng-expressions.png) |
| `npc-escortzhang` | Escort Zhang Qian | medium, scarf, pole | [portrait](../assets/portraits/escortzhang-expressions.png) |
| `npc-mutaigong` | Mu Taigong | medium, scarf | [portrait](../assets/portraits/mutaigong-expressions.png) |
| `npc-caijiu` | Prefect Cai Jiu | medium, futou | [portrait](../assets/portraits/caijiu-expressions.png) |
| `npc-huangwenbing` | Huang Wenbing | medium, scarf | [portrait](../assets/portraits/huangwenbing-expressions.png) |
| `npc-executioner` | Executioner | big, broad, scarf, dao | [portrait](../assets/portraits/executioner-expressions.png) |
| `npc-jademaiden` | Maiden in Blue | slim, woman | [portrait](../assets/portraits/jademaiden-expressions.png) |
| `npc-xuannu` | Mysterious Lady of the Ninth Heaven | slim, woman | [portrait](../assets/portraits/xuannu-expressions.png) |
| `npc-likuimother` | Li Kui's Mother | medium, woman | [portrait](../assets/portraits/likuimother-expressions.png) |
| `npc-lida` | Li Da | medium, headband | [portrait](../assets/portraits/lida-expressions.png) |
| `npc-ligui` | Li Gui | medium, wild, axes | [portrait](../assets/portraits/ligui-expressions.png) |
| `npc-squirecao` | Squire Cao | medium, scarf | [portrait](../assets/portraits/squirecao-expressions.png) |
| `npc-zhangbao` | Zhang Bao | big, broad, headband | [portrait](../assets/portraits/zhangbao-expressions.png) |
| `npc-pangong` | Old Pan | medium, scarf | [portrait](../assets/portraits/pangong-expressions.png) |
| `npc-qiaoyun` | Pan Qiaoyun | slim, woman | [portrait](../assets/portraits/qiaoyun-expressions.png) |
| `npc-yinger` | Ying'er | slim, bun | [portrait](../assets/portraits/yinger-expressions.png) |
| `npc-peiruhai` | Pei Ruhai | medium, bald | [portrait](../assets/portraits/peiruhai-expressions.png) |
| `npc-hudao` | Hu Dao | medium, pilgrim | [portrait](../assets/portraits/hudao-expressions.png) |
| `npc-zhubiao` | Zhu Biao | slim, helmet, spear | [portrait](../assets/portraits/zhubiao-expressions.png) |
| `npc-zhongli` | Old Zhongli | medium, scarf | [portrait](../assets/portraits/zhongli-expressions.png) |
| `npc-luantingyu` | Luan Tingyu | big, broad, helmet, staff | [portrait](../assets/portraits/luantingyu-expressions.png) |
| `npc-zhulong` | Zhu Long | medium, helmet, spear | [portrait](../assets/portraits/zhulong-expressions.png) |
| `npc-zhuhu` | Zhu Hu | medium, helmet, spear | [portrait](../assets/portraits/zhuhu-expressions.png) |
| `npc-squirezhu` | Squire Zhu | medium, scarf | [portrait](../assets/portraits/squirezhu-expressions.png) |
| `npc-hucheng` | Hu Cheng | medium, scarf | [portrait](../assets/portraits/hucheng-expressions.png) |
| `npc-maotaigong` | Squire Mao | medium, scarf | [portrait](../assets/portraits/maotaigong-expressions.png) |
| `npc-maozhong` | Mao Zhong | medium, futou | [portrait](../assets/portraits/maozhong-expressions.png) |
| `npc-baoji` | Bao Ji | big, broad, scarf, dao | [portrait](../assets/portraits/baoji-expressions.png) |
| `npc-baixiuying` | Bai Xiuying | slim, woman | [portrait](../assets/portraits/baixiuying-expressions.png) |
| `npc-baiyuqiao` | Bai Yuqiao | medium, scarf | [portrait](../assets/portraits/baiyuqiao-expressions.png) |
| `npc-leimother` | Lei Heng's Mother | medium, woman | [portrait](../assets/portraits/leimother-expressions.png) |
| `npc-yintianxi` | Yin Tianxi | medium, futou | [portrait](../assets/portraits/yintianxi-expressions.png) |
| `npc-chaihuangcheng` | Chai Huangcheng | medium, scarf | [portrait](../assets/portraits/chaihuangcheng-expressions.png) |
| `npc-gaolian` | Gao Lian | medium, daoist, sword | [portrait](../assets/portraits/gaolian-expressions.png) |
| `npc-luozhenren` | Luo Zhenren | medium, daoist | [portrait](../assets/portraits/luozhenren-expressions.png) |
| `npc-gongsunmother` | Mother Gongsun | medium, woman | [portrait](../assets/portraits/gongsunmother-expressions.png) |
| `npc-linren` | Lin Ren | medium, scarf | [portrait](../assets/portraits/linren-expressions.png) |
| `npc-cangzhouboy` | The Little Master | short, bun | [portrait](../assets/portraits/cangzhouboy-expressions.png) |
| `npc-murong` | Prefect Murong | medium, futou | [portrait](../assets/portraits/murong-expressions.png) |
| `npc-kongbin` | Kong Bin | medium, scarf | [portrait](../assets/portraits/kongbin-expressions.png) |
| `npc-xuwife` | Xu Ning's Wife | slim, woman | [portrait](../assets/portraits/xuwife-expressions.png) |
| `npc-heprefect` | Prefect He | medium, futou | [portrait](../assets/portraits/heprefect-expressions.png) |
| `npc-suyuanjing` | Marshal Su Yuanjing | medium, futou | [portrait](../assets/portraits/suyuanjing-expressions.png) |
| `npc-zengkui` | Zeng Kui | medium, helmet, spear | [portrait](../assets/portraits/zengkui-expressions.png) |
| `npc-zengtu` | Zeng Tu | medium, helmet, spear | [portrait](../assets/portraits/zengtu-expressions.png) |
| `npc-shiwengong` | Shi Wengong | big, broad, helmet, halberd | [portrait](../assets/portraits/shiwengong-expressions.png) |
| `npc-fahuamonk` | Monk of the Fahua Temple | medium, bald | [portrait](../assets/portraits/fahuamonk-expressions.png) |
| `npc-ligu` | Li Gu | medium, scarf | [portrait](../assets/portraits/ligu-expressions.png) |
| `npc-jiashi` | Lady Jia | slim, woman | [portrait](../assets/portraits/jiashi-expressions.png) |
| `npc-zhangwang` | Zhang Wang | medium, headband, dao | [portrait](../assets/portraits/zhangwang-expressions.png) |
| `npc-liqiaonu` | Li Qiaonu | slim, woman | [portrait](../assets/portraits/liqiaonu-expressions.png) |
| `npc-wangfather` | Old Wang | medium, scarf | [portrait](../assets/portraits/wangfather-expressions.png) |
| `npc-liruilan` | Li Ruilan | slim, woman | [portrait](../assets/portraits/liruilan-expressions.png) |
| `npc-chengprefect` | Prefect Cheng | medium, futou | [portrait](../assets/portraits/chengprefect-expressions.png) |
| `npc-zengnong` | Zeng Nong | medium, scarf | [portrait](../assets/portraits/zengnong-expressions.png) |
| `npc-hexuantong` | He Xuantong | medium, daoist | [portrait](../assets/portraits/hexuantong-expressions.png) |
| `npc-lishishi` | Li Shishi | slim, woman | [portrait](../assets/portraits/lishishi-expressions.png) |
| `npc-huizong` | The Emperor | medium, futou | [portrait](../assets/portraits/huizong-expressions.png) |
| `npc-yangjian` | Marshal Yang | medium, futou | [portrait](../assets/portraits/yangjian-expressions.png) |
| `npc-renyuan` | Ren Yuan | big, broad, topknot | — |
| `npc-chenzongshan` | Chen Zongshan | medium, futou | — |
| `npc-zhangganban` | Secretary Zhang | medium, futou | [portrait](../assets/portraits/zhangganban-expressions.png) |
| `npc-tongguan` | Tong Guan | medium, helmet | — |
| `npc-wuyanguang` | Wuyan Guang | big, broad, helmet, halberd | — |
| `npc-liaosoldier` | Liao Rider | medium, helmet, spear | — |
| `npc-rationclerk` | Ration Clerk | medium, futou | [portrait](../assets/portraits/rationclerk-expressions.png) |
| `npc-qiaodaoqing` | Qiao Daoqing | medium, daoist, sword | — |
| `npc-tianhu` | Tian Hu | big, broad, helmet | — |
| `npc-wangqing` | Wang Qing | medium, helmet | [portrait](../assets/portraits/wangqing-expressions.png) |
| `npc-fangla` | Fang La | medium, futou | — |
| `npc-shibao` | Shi Bao | big, broad, helmet, saber | — |
| `npc-fangmao` | Fang Mao | medium, helmet, spear | — |

## 5. Enemies in battle

File id is `en-<id>` (for example `en-bandit.png`). Many are the same soldier in a different army's colours; make the uniform match the army named.

| file id | enemy | weapon (battle sheet) |
|---|---|---|
| `en-bandit` | Mountain Bandit | dao |
| `en-bandit2` | Bandit Brute | axes |
| `en-banditArcher` | Bandit Archer | bow |
| `en-thug` | Street Tough | fists |
| `en-roadbandit` | Highwayman | dao |
| `en-roadbrute` | Highway Brute | axes |
| `en-roadarcher` | Highway Archer | bow |
| `en-soldier` | Government Soldier | spear |
| `en-archer` | Government Archer | bow |
| `en-constable` | Yamen Runner | dao |
| `en-soldier2` | Garrison Soldier | spear |
| `en-archer2` | Garrison Archer | bow |
| `en-officer2` | Garrison Officer | saber |
| `en-soldier3` | Imperial Soldier | spear |
| `en-archer3` | Imperial Archer | bow |
| `en-officer3` | Imperial Officer | saber |
| `en-soldier4` | Palace Guard | spear |
| `en-archer4` | Palace Archer | bow |
| `en-officer4` | Guard Commander | saber |
| `en-chenda_bandit` | Shaohua Bandit | dao |
| `en-chenda_archer` | Shaohua Archer | bow |
| `en-county_runner` | County Constable | dao |
| `en-county_archer` | County Archer | bow |
| `en-liji_boss` | Li Ji | bow |
| `en-duty_boss` | Duty Officer | dao |
| `en-wutai_monk` | Monk of Wutai | staff |
| `en-wutai_monk2` | Wutai Warrior-Monk | staff |
| `en-peach_bandit` | Peach Blossom Bandit | dao |
| `en-zhoutong_boss` | Zhou Tong | spear |
| `en-cui_boss` | Cui Daocheng | dao |
| `en-qiu_boss` | Qiu Xiaoyi | sword |
| `en-cui_strong` | Cui Daocheng | dao |
| `en-qiu_strong` | Qiu Xiaoyi | sword |
| `en-rascal` | Garden Rascal | fists |
| `en-luqian_foe` | Lu Qian |  |
| `en-fuan_foe` | Fu An |  |
| `en-overseer_foe` | Overseer |  |
| `en-escort_soldier` | Escort Soldier | spear |
| `en-denglong_boss` | Deng Long | staff |
| `en-erlong_monk` | Erlong Bandit-Monk | staff |
| `en-ximen_boss` | Ximen Qing |  |
| `en-ximen_guard` | Ximen's Bodyguard | fists |
| `en-jiang_boss` | Jiang the Door God |  |
| `en-jiang_man` | Happy Forest Tough | fists |
| `en-escort_killer` | Hired Killer | dao |
| `en-escort_guard` | Crooked Escort | dao |
| `en-zhangdu_boss` | Commander Zhang |  |
| `en-zhangtuan_boss` | Militia Captain Zhang |  |
| `en-jiang_boss2` | Jiang the Door God |  |
| `en-daoist_boss` | Daoist of Centipede Ridge | sword |
| `en-daoist_boy` | Daoist Acolyte | sword |
| `en-qz_soldier` | Qingzhou Soldier | spear |
| `en-qz_archer` | Qingzhou Archer | bow |
| `en-liugao_guard` | Liu Gao's Guard | dao |
| `en-huangxin_boss` | Huang Xin | saber |
| `en-liugao_boss` | Liu Gao |  |
| `en-jy_tough` | Jieyang Tough | fists |
| `en-jz_guard` | Jiangzhou Guard | spear |
| `en-jz_archer` | Jiangzhou Archer | bow |
| `en-jz_officer` | Execution Officer | saber |
| `en-huang_guard` | Huang's Retainer | dao |
| `en-huang_boss` | Huang Wenbing |  |
| `en-zhao_constable` | Yuncheng Constable | dao |
| `en-ligui_foe` | Li Gui | axes |
| `en-n_bandit` | Hill Bandit | dao |
| `en-n_archer` | Hill Archer | bow |
| `en-jz_tough` | Zhang Bao's Crony | fists |
| `en-zhangbao_foe` | Zhang Bao |  |
| `en-zhu_waiter` | Inn Hand | fists |
| `en-zhu_hook` | Zhu Village Hook-Man | spear |
| `en-zhu_rider` | Zhu Village Rider | spear |
| `en-zj_ambush` | Zhu Village Spearman | spear |
| `en-zj_archer` | Zhu Village Archer | bow |
| `en-zj_guard` | Zhu Manor Guard | spear |
| `en-dz_guard` | Dengzhou Jailer | dao |
| `en-baoji_foe` | Bao Ji | dao |
| `en-yin_thug` | Yin Tianxi's Bully | fists |
| `en-yin_boss` | Yin Tianxi |  |
| `en-gunner` | Ling Zhen's Bombardier | spear |
| `en-lingzhen_foe` | Ling Zhen | none |
| `en-qz_guard` | Qingzhou Guard | spear |
| `en-qz_archer2` | Qingzhou Archer | bow |
| `en-hz_guard` | Huazhou Guard | spear |
| `en-hz_jailer` | Huazhou Jailer | dao |
| `en-xiang_foe` | Xiang Chong | shield |
| `en-ligun_foe` | Li Gun | shield |
| `en-zt_spear` | Zengtou Spearman | spear |
| `en-zt_archer` | Zengtou Archer | bow |
| `en-lu_liutang` | Liu Tang | halberd |
| `en-lu_muhong` | Mu Hong | spear |
| `en-lu_liying` | Li Ying | spear |
| `en-dm_guard` | Daming Guard | spear |
| `en-dm_jailer` | Daming Jailer | dao |
| `en-zhangwang_foe` | Zhang Wang | dao |
| `en-sunwu_foe` | Sun Wu | fists |
| `en-lz_soldier` | Lingzhou Soldier | spear |
| `en-lz_fire` | Divine Fire Trooper | spear |
| `en-zt_guard` | Zeng Family Guard | spear |
| `en-zhangqing_foe` | Zhang Qing | stones |
| `en-gongwang_foe` | Gong Wang | spear |
| `en-dingdesun_foe` | Ding Desun | fork |
| `en-kf_guard` | Palace Guard | spear |
| `en-niutou_bandit` | Niutou Bandit | axes |
| `en-wangjiang_foe` | Wang Jiang | dao |
| `en-donghai_foe` | Dong Hai | axes |
| `en-gaofleet` | Marine of the Sea-Eel Ships | spear |
| `en-liao_rider` | Liao Rider | spear |
| `en-liao_archer` | Liao Horse-Archer | bow |
| `en-aliqi_foe` | Ali Qi | spear |
| `en-qiao_foe` | Qiao Daoqing | sword |
| `en-paper_soldier` | Paper Soldier | spear |
| `en-south_spear` | Southern Spearman | spear |
| `en-south_archer` | Southern Archer | bow |
| `en-fangmao_foe` | Fang Mao | spear |
| `en-pangwanchun_foe` | Pang Wanchun | bow |
