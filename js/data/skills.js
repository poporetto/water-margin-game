// Battle skills: every hero who fights has three, drawn from what they do in the novel. They replace talismans.
// Skill 1 is known from the start, skill 2 opens at level 8 and skill 3 (the hero's signature) at level 18. Each
// level of skill has its own uses, as runes have charges in Suikoden; an inn or Calming Incense restores them.
//
// effect 'phys': a weapon blow at `power` times a normal attack. `hits` strikes the target that many times;
//   `scatter` spreads the hits over random enemies; `pierce` cuts through most of the target's defence; `sure`
//   never misses; `status` (+ `statusChance`) may leave the target poisoned, asleep (stunned) or silenced;
//   `selfStatus` is a stance the hero takes afterwards; `shot` flies from the hero ('arrow' or 'stone').
// Other effects work as talisman magic did: 'damage' (power, element), 'heal', 'buff', 'status', 'cure', 'revive'.
'use strict';
(function () {
  var SK = WM.data.skills = {};
  function o(base, extra) { return Object.assign(base, extra || {}); }
  // a blow at one enemy / at every enemy
  function P(name, power, desc, x) { return o({ name: name, effect: 'phys', target: 'enemy1', power: power, desc: desc }, x); }
  function PA(name, power, desc, x) { return o({ name: name, effect: 'phys', target: 'enemyAll', power: power, desc: desc }, x); }
  // magic at one or all enemies
  function M(name, power, element, target, desc, x) { return o({ name: name, effect: 'damage', target: target, power: power, element: element, desc: desc }, x); }
  function H(name, power, target, desc, x) { return o({ name: name, effect: 'heal', target: target, power: power, element: 'heal', desc: desc }, x); }
  function BF(name, status, target, desc, x) { return o({ name: name, effect: 'buff', target: target, status: status, element: 'magic', desc: desc }, x); }
  function ST(name, status, chance, target, desc, x) { return o({ name: name, effect: 'status', target: target, status: status, statusChance: chance, element: 'wind', desc: desc }, x); }
  function sk(id, list) { SK[id] = list; }
  var BL = { fx: 'blunt' }, AR = { shot: 'arrow', sure: true }, STN = { shot: 'stone' };

  // ===================== The thirty-six Heavenly Spirits =====================
  sk('songjiang', [
    H('Timely Rain', 60, 'allyAll', 'His generosity falls on the brothers like rain in a drought, restoring everyone\'s strength.'),
    BF('Act on Heaven\'s Behalf', 'atkUp', 'allyAll', 'He raises the apricot-yellow banner, and every brother strikes harder.'),
    M('Thirty-Six Spirits', 230, 'magic', 'enemyAll', 'He opens the Heavenly Book, and the thirty-six Heavenly Spirits come down on the whole enemy line.', { screen: true })
  ]);
  sk('lujunyi', [
    P('Jade Qilin Thrust', 1.9, 'One heavy spear-thrust, driven home so hard no guard can turn it.'),
    PA('Peerless Staff', 1.15, 'He swings his staff in a long arc that knocks down the whole enemy line.', BL),
    P('Pillar of Hebei', 4.0, 'All his art in a single blow on one foe — it cannot miss.', { sure: true })
  ]);
  sk('wuyong', [
    M('Copper Chains', 70, 'wind', 'enemy1', 'He lashes his copper chains at one foe like a whip of wind.'),
    ST('Drugged Wine', 'sleep', 0.6, 'enemyAll', 'The trick of Yellow Earth Ridge: drugged wine that may put the whole enemy to sleep.'),
    BF('Stratagem of Zhuge', 'atkUp', 'allyAll', 'He lays out a plan worthy of Zhuge Liang: the party\'s attack and defence both rise.', { also: 'defUp' })
  ]);
  sk('gongsunsheng', [
    M('Thunderclap', 80, 'thunder', 'enemy1', 'He points the pine-pattern sword and a bolt of lightning strikes one foe.'),
    M('Five Thunders', 135, 'thunder', 'enemyAll', 'He calls the Five Thunders of Heaven down on every enemy at once.', { screen: true }),
    M('Dragon Entering the Clouds', 270, 'thunder', 'enemyAll', 'He rides the storm itself down upon the enemy: thunder over the whole field.', { screen: true })
  ]);
  sk('guansheng', [
    P('Green Dragon Slash', 2.0, 'The Green Dragon blade comes down on one foe like a falling moon.'),
    PA('Crescent Moon Sweep', 1.2, 'He sweeps the crescent blade along the whole enemy line.'),
    P('Spirit of Guan Yu', 4.0, 'For one blow he is Guan Yu himself — the blade cleaves straight through armour.', { pierce: true })
  ]);
  sk('linchong', [
    P('Serpent Spear', 1.9, 'The eighteen-foot serpent spear finds the gap in one foe\'s guard and pierces armour.', { pierce: true }),
    P('Wind and Snow at the Temple', 1.0, 'Three quick spear-thrusts at one foe, as on the snowy night at the temple.', { hits: 3 }),
    P('Panther Head Charge', 3.9, 'Every insult he swallowed, paid back in one charge that cannot miss.', { sure: true })
  ]);
  sk('qinming', [
    P('Wolf-Tooth Mace', 2.0, 'A thunderbolt blow of the wolf-tooth mace that may leave the foe stunned.', o({ status: 'sleep', statusChance: 0.3 }, BL)),
    PA('Thunder Roar', 1.1, 'He roars like thunder and smashes into the whole enemy line.', BL),
    P('Thunderbolt', 3.9, 'One crushing blow of the mace, with all the fury of Qingzhou\'s commander behind it.', BL)
  ]);
  sk('huyanzhuo', [
    P('Twin Steel Whips', 1.05, 'Two blows on one foe: the left steel whip, then the right.', o({ hits: 2 }, BL)),
    PA('Chained Cavalry', 1.25, 'His chained cavalry, ten horses abreast, ride down the whole enemy line.'),
    P('Legacy of Huyan Zan', 1.3, 'Three blows of the twin whips in the style of his ancestor Huyan Zan.', o({ hits: 3 }, BL))
  ]);
  sk('huarong', [
    P('Little Li Guang', 2.0, 'One arrow at one foe; it never misses.', AR),
    PA('Rain of Arrows', 1.1, 'Arrow after arrow rains down on every enemy, never missing.', AR),
    P('The Wild Goose', 1.35, 'He names the target before he looses: three arrows into one foe, never missing.', o({ hits: 3 }, AR))
  ]);
  sk('chaijin', [
    P('Little Whirlwind', 0.95, 'Two quick sword-cuts at one foe, light as a whirl of wind.', { hits: 2 }),
    BF('Iron Writ', 'defUp', 'allyAll', 'He holds up the emperor\'s iron writ: the party\'s defence rises.'),
    H('Welcome of the Chai Manor', 160, 'allyAll', 'The welcome of the Chai manor: the whole party is healed and cured of ailments.', { cure: true })
  ]);
  sk('liying', [
    P('Flying Knife', 1.8, 'He throws one of the five knives on his back at one foe.', { shot: 'arrow' }),
    PA('Five Flying Knives', 1.0, 'All five flying knives at once, spread across the enemy line.', { shot: 'arrow' }),
    P('Sky-Striking Eagle', 3.6, 'He drops on one foe like an eagle from the sky — a blow that cannot miss.', { sure: true })
  ]);
  sk('zhutong', [
    P('Beautiful Beard Halberd', 1.9, 'A heavy sweep of the halberd at one foe, with Guan Yu\'s strength in it.'),
    PA('Halberd Sweep', 1.15, 'A long halberd sweep that cuts across the whole enemy line.'),
    P('Lord of the Beautiful Beard', 3.6, 'One mighty halberd blow; this foe he does not let go.')
  ]);
  sk('luzhishen', [
    P('Three Punches', 0.85, 'Three punches at one foe — nose, eye, temple — as on the Lord of the West.', o({ hits: 3 }, BL)),
    PA('Uproot the Willow', 1.3, 'He pulls up a willow by the roots and swings it through the whole enemy line.', BL),
    P('Chan Staff of Wutai', 4.2, 'Sixty-two catties of iron staff brought down on one foe in a single crushing blow.', BL)
  ]);
  sk('wusong', [
    P('Tiger-Slaying Fists', 0.85, 'Three blows of the fists that beat the tiger to death, on one foe.', o({ hits: 3 }, BL)),
    PA('Drunken Fist', 1.2, 'The more he drinks, the better he fights: a drunken flurry that hits every enemy.', BL),
    PA('Mandarin Duck Tower', 1.8, 'The night of vengeance at the Mandarin Duck Tower: a heavy blow on every enemy.')
  ]);
  sk('dongping', [
    P('Twin Spears', 1.0, 'Two thrusts at one foe, a spear in each hand.', { hits: 2 }),
    PA('General of Myriad Households', 1.15, 'He charges the whole enemy line with both spears.'),
    P('Double Spear Storm', 0.95, 'Four spear-thrusts flying at random foes from everywhere at once.', { hits: 4, scatter: true })
  ]);
  sk('zhangqing', [
    P('Featherless Arrow', 1.8, 'He throws a stone at one foe, true as an arrow — it never misses.', o({ sure: true }, STN)),
    PA('Volley of Stones', 1.0, 'Stone after stone from his pouch, at every enemy.', STN),
    P('Fifteen Generals Felled', 0.85, 'Five stones in quick succession at random foes, never missing — as when fifteen generals fell.', o({ hits: 5, scatter: true, sure: true }, STN))
  ]);
  sk('yangzhi', [
    P('Heirloom Sabre', 2.0, 'The heirloom sabre that cuts iron like mud slices through one foe\'s armour.', { pierce: true }),
    PA('Yang Family Blade', 1.15, 'The sabre-art of the Yang generals: one cut across the whole enemy line.'),
    P('Blue-Faced Beast', 3.8, 'All the bad luck of his life comes down on one foe in a single crushing stroke.')
  ]);
  sk('xuning', [
    P('Hooked Lance', 1.8, 'The hooked lance pulls one foe off balance and may leave them stunned.', { status: 'sleep', statusChance: 0.3 }),
    PA('Break the Chained Horses', 1.3, 'The lance that broke the chained cavalry hooks the legs of the whole enemy line.'),
    P('Golden Lance Guard', 3.6, 'The sole master of the hooked lance strikes one foe — a thrust that cannot miss.', { sure: true })
  ]);
  sk('suochao', [
    P('Golden Battle-Axe', 2.0, 'A heavy blow of the golden battle-axe at one foe.'),
    PA('Vanguard Charge', 1.2, 'He charges into the enemy without waiting, striking the whole line.'),
    P('Impatient Vanguard', 4.1, 'One enormous, impatient blow of the golden axe on one foe.')
  ]);
  sk('daizong', [
    P('Swift Sword', 0.95, 'Two sword-cuts at one foe, too fast to see.', { hits: 2 }),
    { name: 'Divine March', effect: 'escape', target: 'self', element: 'wind', vfx: 'rush', desc: 'He ties his paper charms to the brothers\' legs and the whole party flees at once. (Not from battles that cannot be fled.)' },
    P('Eight Hundred Li a Day', 0.95, 'Eight hundred li a day: five sword-cuts at random foes, here, there and everywhere.', { hits: 5, scatter: true })
  ]);
  sk('liutang', [
    P('Red-Haired Devil', 1.9, 'A heavy cut of the long-handled sabre at one foe.'),
    PA('Long Sabre Sweep', 1.15, 'He sweeps the long sabre across the whole enemy line.'),
    P('Raid on the Birthday Gifts', 3.6, 'One great sabre stroke on one foe, like the raid that began the brotherhood.')
  ]);
  sk('likui', [
    P('Twin Axes', 1.05, 'Two blows on one foe: one axe, then the other.', { hits: 2 }),
    PA('Black Whirlwind', 1.35, 'Stripped to the waist, he spins through every enemy with both axes.'),
    P('Killing Frenzy', 0.95, 'Six axe-blows at random foes — he cuts down whatever is in his path.', { hits: 6, scatter: true })
  ]);
  sk('shijin', [
    P('Three-Pointed Blade', 1.8, 'A heavy cut of the three-pointed blade at one foe.'),
    PA('Nine Dragons', 1.15, 'The nine dragons on his back seem to move as he cuts across the whole line.'),
    P('Wang Jin\'s Lesson', 3.6, 'Strength with method at last: one great blow that cannot miss.', { sure: true })
  ]);
  sk('muhong', [
    P('Tyrant of Jieyang', 1.8, 'A heavy spear-thrust at one foe from the man who rules Jieyang.'),
    PA('Unrestrained', 1.1, 'He fights without restraint, laying into the whole enemy line.'),
    P('Chase to the River', 3.4, 'He runs one foe down like a fugitive chased to the river — a crushing blow.')
  ]);
  sk('leiheng', [
    P('Winged Tiger Leap', 1.9, 'He leaps three zhang and lands sabre-first on one foe.'),
    PA('Constable\'s Sweep', 1.1, 'The strong constable clears the way with a sweep across the whole line.'),
    P('Vengeance for His Mother', 3.4, 'One terrible sabre-stroke on one foe, as he struck for his mother\'s honour.')
  ]);
  sk('lijun', [
    P('River Dragon Fork', 1.8, 'A heavy thrust of the boatman\'s steel fork at one foe.'),
    PA('Capsize', 1.2, 'He overturns the boat: every enemy is thrown into the water.'),
    P('Lord of the Yangtze', 3.6, 'The Lord of the Yangtze strikes one foe with all his strength.')
  ]);
  sk('ruanxiaoer', [
    P('Fish Spear', 1.8, 'A heavy thrust of the fish spear at one foe.'),
    PA('Net of Shijie Village', 1.1, 'He casts his net over the whole enemy line and drags them down.'),
    P('Tai Sui Stands His Ground', 3.4, 'The eldest Ruan stands his ground and drives one crushing thrust into one foe.')
  ]);
  sk('zhangheng', [
    P('Knife-Noodles', 1.8, '"Dumplings or knife-noodles?" A heavy knife-cut at one foe.'),
    PA('Ferry of the Xunyang', 1.1, 'Halfway across the river the boatman turns: a cut at every enemy.'),
    P('Into the River', 3.4, 'He heaves one foe over the side — a crushing blow that may leave them stunned.', { status: 'sleep', statusChance: 0.4 })
  ]);
  sk('ruanxiaowu', [
    P('Leopard\'s Dagger', 1.0, 'Two quick dagger-stabs at one foe.', { hits: 2 }),
    PA('Gambler\'s Throw', 1.1, 'He bets everything on one wild throw that hits every enemy.'),
    P('Short-Lived Second Brother', 3.4, 'He fights as though he will die tomorrow: one crushing blow on one foe.')
  ]);
  sk('zhangshun', [
    P('White Streak in the Waves', 1.0, 'Two quick strikes at one foe, in and out like a fish.', { hits: 2 }),
    P('Drag Under', 2.2, 'He drags one foe under the water — a heavy blow that may leave them senseless.', { status: 'sleep', statusChance: 0.45 }),
    PA('Seven Days Beneath the Water', 1.6, 'He comes up from beneath the water among them all, striking every enemy.')
  ]);
  sk('ruanxiaoqi', [
    P('Fish Spear', 1.85, 'A heavy thrust of the fish spear at one foe.'),
    PA('Living King of Hell', 1.15, 'He fights like the king of the dead, laying into the whole enemy line.'),
    P('Insult to the Envoy', 3.6, 'He would not bow to the court\'s envoy: one crushing thrust at one foe.')
  ]);
  sk('yangxiong', [
    P('Executioner\'s Sabre', 1.9, 'The executioner\'s sabre falls on one foe and cuts straight through armour.', { pierce: true }),
    PA('Sick Guan Suo', 1.15, 'Pale of face, terrible of blade: one cut across the whole enemy line.'),
    P('Green Mountain Reckoning', 3.6, 'The reckoning of Cuiping Mountain: one crushing sabre-stroke on one foe.')
  ]);
  sk('shixiu', [
    P('Daredevil\'s Sabre', 1.9, 'A heavy sabre-cut at one foe; he can never pass by an injustice.'),
    PA('Leap from the Tower', 1.2, 'He leaps down among the enemy as he leapt onto the execution ground, striking them all.'),
    P('Daredevil Third Brother', 3.6, 'He does not count the enemy: one great blow on one foe that cannot miss.', { sure: true })
  ]);
  sk('xiezhen', [
    P('Hunting Fork', 1.8, 'A heavy thrust of the hunting fork at one foe.'),
    PA('Tiger Trap', 1.1, 'The poisoned arrows of the tiger trap: every enemy is hit and may be poisoned.', { status: 'poison', statusChance: 0.4 }),
    P('Two-Headed Snake', 3.4, 'The Two-Headed Snake strikes one foe from both sides: two heavy blows.', { hits: 2, power: 1.7 })
  ]);
  sk('xiebao', [
    P('Hunting Fork', 1.8, 'A heavy thrust of the younger hunter\'s fork at one foe.'),
    PA('Twin-Tailed Scorpion', 1.1, 'A scorpion\'s sting from behind: every enemy is hit and may be poisoned.', { status: 'poison', statusChance: 0.4 }),
    P('The Stolen Tiger', 3.4, 'One crushing blow on one foe, for the tiger the Mao family stole.')
  ]);
  sk('yanqing', [
    P('Crossbow Bolt', 1.8, 'One bolt from his little crossbow at one foe; it never misses.', AR),
    P('Wrestler\'s Throw', 2.2, 'The throw that beat Ren Yuan at Mount Tai — one foe is slammed down and may be stunned.', o({ status: 'sleep', statusChance: 0.45 }, BL)),
    P('The Prodigal', 1.4, 'Three crossbow bolts at one foe, never missing, and then he is gone.', o({ hits: 3 }, AR))
  ]);

  // ===================== The seventy-two Earthly Fiends =====================
  sk('zhuwu', [
    M('Battle Formation', 60, 'earth', 'enemy1', 'He arranges the ground against one foe: the earth rises and strikes.'),
    BF('Plea of Brotherhood', 'defUp', 'allyAll', 'His tearful plea of brotherhood steels the party: defence rises.'),
    M('Landslide', 160, 'earth', 'enemyAll', 'The mountainside comes down on the whole enemy in a landslide.', { screen: true })
  ]);
  sk('huangxin', [
    P('Mourning Sword', 1.8, 'A heavy cut of the Mourning Sword at one foe.'),
    PA('Suppress Three Mountains', 1.1, 'He swings the sword he boasted would suppress three mountains across the whole line.'),
    P('Suppressor\'s Wrath', 3.3, 'One crushing blow on one foe: now he suppresses the enemy instead.')
  ]);
  sk('sunli', [
    P('Spear and Whip', 1.0, 'Two blows on one foe: the spear in one hand, the steel whip in the other.', { hits: 2 }),
    PA('Sick Yuchi', 1.1, 'Like the Tang general Yuchi Gong, he lays into the whole enemy line.'),
    P('The Pretended Ally', 3.4, 'He came as a friend and strikes as an enemy: one blow on one foe that cannot miss.', { sure: true })
  ]);
  sk('xuanzan', [
    P('Steel Sabre', 1.8, 'A heavy cut of the steel sabre at one foe.'),
    PA('Ugly Face', 1.0, 'His fearsome face throws the whole enemy line off guard; some may be stunned.', { status: 'sleep', statusChance: 0.25 }),
    P('Prince Consort\'s Blow', 3.3, 'One crushing sabre-stroke on one foe from the prince\'s son-in-law.')
  ]);
  sk('haosiwen', [
    P('Wood Dog Spear', 1.8, 'A heavy thrust of the Wood Dog spear at one foe.'),
    PA('Sworn Brother\'s Charge', 1.1, 'He charges at Guan Sheng\'s side, striking the whole enemy line.'),
    P('Star of the Well', 3.3, 'The star of his mother\'s dream shines on his spear: one crushing thrust.')
  ]);
  sk('hantao', [
    P('Jujube-Wood Lance', 1.8, 'A heavy thrust of the jujube-wood lance at one foe.'),
    PA('Hundred Victories', 1.1, 'A trained cavalry charge that strikes the whole enemy line.'),
    P('General of a Hundred Victories', 3.3, 'One more victory: a crushing lance-thrust at one foe.')
  ]);
  sk('pengqi', [
    P('Three-Pointed Blade', 1.8, 'A heavy cut of the three-pointed blade at one foe.'),
    PA('Heaven-Eyed Sweep', 1.1, 'He sees the whole line, and sweeps his blade across it.'),
    P('Heaven-Eyed General', 3.3, 'The third eye sees exactly where to strike: one blow that cannot miss.', { sure: true })
  ]);
  sk('shantinggui', [
    M('Black Water', 70, 'water', 'enemy1', 'He looses a rush of black water on one foe.'),
    H('Spring of Sacred Water', 120, 'allyAll', 'Clean, sacred spring water restores the whole party.'),
    M('Flood the Field', 190, 'water', 'enemyAll', 'He breaks the dikes and floods the field: water crashes over every enemy.', { screen: true })
  ]);
  sk('weidingguo', [
    M('Fire Arrows', 70, 'fire', 'enemy1', 'Fire arrows streak into one foe.'),
    M('Fire-Carts', 120, 'fire', 'enemyAll', 'Burning carts roll into the enemy, setting every one of them alight.'),
    M('General of Holy Fire', 220, 'fire', 'enemyAll', 'The General of Holy Fire turns the whole field to flame.', { screen: true })
  ]);
  sk('oupeng', [
    P('Golden-Winged Spear', 1.0, 'Two swift spear-thrusts at one foe, quick as a bird.', { hits: 2 }),
    PA('Swoop of the Eagle', 1.1, 'He swoops down on the whole enemy line like an eagle.'),
    P('Golden-Winged Eagle', 3.3, 'He strikes one foe from above, like an eagle — a blow that cannot miss.', { sure: true })
  ]);
  sk('dengfei', [
    P('Iron Chain', 1.8, 'A heavy blow of the swinging iron chain at one foe.'),
    PA('Fiery-Eyed Lion', 1.15, 'Red-eyed with rage, he whirls the chain through the whole enemy line.'),
    P('Yinma River', 3.4, 'The master of the Yinma River brings his chain down on one foe in a crushing blow.')
  ]);
  sk('yanshun', [
    P('Brocade Tiger', 1.9, 'A heavy blow at one foe, with the strength of a bull.'),
    PA('Qingfeng Ambush', 1.15, '"Halt! Leave the carts!" He springs an ambush on the whole enemy line.'),
    P('Cattle Trader\'s Blow', 3.4, 'He could fell an ox with one stroke — and fells one foe.', BL)
  ]);
  sk('yanglin', [
    P('Brush-Tipped Spear', 1.0, 'Two thrusts of the brush-tipped spear at one foe.', { hits: 2 }),
    PA('Brocade Leopard', 1.1, 'A leopard\'s spring into the whole enemy line.'),
    P('Road of Zhangde', 3.3, 'One crushing spear-thrust at one foe from the wandering Brocade Leopard.')
  ]);
  sk('lingzhen', [
    P('Heaven-Shaking Thunder', 2.0, 'A thunderclap bomb lands on one foe — it never misses.', { fx: 'fire', sure: true }),
    PA('Mother-and-Son Bombs', 1.2, 'A great shell bursts over the enemy into a shower of small bombs, hitting them all.', { fx: 'fire' }),
    PA('Heaven-Shaking Thunder', 1.75, 'His great shells, that reach fifteen li, fall on the whole enemy line.', { fx: 'fire', screen: true })
  ]);
  sk('lufang', [
    P('Red Halberd', 1.85, 'A heavy cut of the red halberd at one foe.'),
    PA('Little Marquis', 1.1, 'He sweeps the halberd across the whole enemy line, like a would-be Lü Bu.'),
    P('Painted Halberd', 3.3, 'One crushing blow of the painted halberd on one foe.')
  ]);
  sk('guosheng', [
    P('White Halberd', 1.85, 'A heavy cut of the white halberd at one foe.'),
    PA('Second Rengui', 1.1, 'Like the Tang general Xue Rengui, he sweeps across the whole enemy line.'),
    P('Mercury-Seller\'s Challenge', 3.3, 'He issues a challenge and lands one crushing halberd-blow on one foe.')
  ]);
  sk('wangying', [
    P('Stumpy Tiger', 1.7, 'A quick, heavy blow at one foe from below.'),
    PA('Cart-Driver\'s Charge', 1.05, 'He drives straight through the whole enemy line like a runaway cart.'),
    P('Low Blow', 3.2, 'Short men strike low: one crushing blow on one foe that cannot miss.', { sure: true })
  ]);
  sk('husanniang', [
    P('Twin Sabres', 1.0, 'Two cuts at one foe, a sabre in each hand.', { hits: 2 }),
    P('Red Lasso', 1.8, 'Her red lasso hooks one foe out of the saddle — it never misses and may leave them stunned.', { status: 'sleep', statusChance: 0.5, sure: true }),
    P('Ten Feet of Blue', 1.0, 'Twin sabres and lasso: four strikes at random foes.', { hits: 4, scatter: true })
  ]);
  sk('baoxu', [
    P('Broad Sword', 1.9, 'A heavy cut of the broad sword at one foe; he kills without blinking.'),
    PA('God of Death', 1.2, 'The God of Death lays into the whole enemy line.'),
    P('Mount Kumu', 3.5, 'Death comes down the mountain: one crushing blow on one foe.')
  ]);
  sk('fanrui', [
    M('Black Wind', 70, 'wind', 'enemy1', 'He calls up a black wind that tears at one foe.'),
    ST('Sand and Stones', 'silence', 0.6, 'enemyAll', 'Flying sand and stones may silence every enemy, so they cannot use their skills.'),
    M('Demon King\'s Storm', 190, 'wind', 'enemyAll', 'The Demon King\'s storm of wind and rain batters every enemy.', { screen: true })
  ]);
  sk('kongming', [
    P('Comet Spear', 1.8, 'A heavy spear-thrust at one foe from Song Jiang\'s pupil.'),
    PA('Kong Family Charge', 1.1, 'The elder Kong leads a charge that strikes the whole enemy line.'),
    P('Comet', 3.3, 'A bright streak across the field: one crushing thrust at one foe.')
  ]);
  sk('kongliang', [
    P('Lone Fire', 1.8, 'A heavy sword-cut at one foe.'),
    PA('Set the Dog On', 1.0, 'He sets his dog on them: every enemy is bitten.'),
    P('Kong Liang\'s Sword', 3.2, 'The sword Song Jiang taught him to use: one crushing blow on one foe.')
  ]);
  sk('xiangchong', [
    P('Flying Knives', 1.6, 'He hurls a flying knife at one foe from behind his round shield.', { shot: 'arrow' }),
    PA('Twenty-Four Knives', 1.05, 'Twenty-four flying knives at once, hitting every enemy.', { shot: 'arrow' }),
    P('Eight-Armed Nezha', 0.9, 'Like eight-armed Nezha he throws five knives at random foes.', { hits: 5, scatter: true, shot: 'arrow' })
  ]);
  sk('ligun', [
    P('Javelin', 1.7, 'He hurls a javelin over the rim of his shield at one foe.', { shot: 'arrow' }),
    PA('Shield Wall', 1.05, 'Javelins fly from behind the shield wall at every enemy.', { shot: 'arrow' }),
    P('Sky-Soaring Sage', 3.3, 'A javelin drops on one foe from the sky — a blow that cannot miss.', { shot: 'arrow', sure: true })
  ]);
  sk('malin', [
    P('Twin Swords', 1.0, 'Two sword-cuts at one foe between bouts of the flute.', { hits: 2 }),
    ST('Iron Flute', 'sleep', 0.5, 'enemyAll', 'The song of the iron flute may lull every enemy to sleep.'),
    P('Iron Flute Immortal', 1.0, 'The swords dance to his tune: four cuts at random foes.', { hits: 4, scatter: true })
  ]);
  sk('tongwei', [
    P('Dragon from the Cave', 1.0, 'Two quick strikes at one foe, slippery as an eel.', { hits: 2 }),
    PA('River Ambush', 1.05, 'He rises out of the water among them, striking the whole enemy line.'),
    P('Smuggler\'s Knife', 3.2, 'The smuggler\'s knife strikes one foe from below in one crushing blow.')
  ]);
  sk('tongmeng', [
    P('River-Churning Clam', 1.0, 'Two quick strikes at one foe as he churns the water.', { hits: 2 }),
    PA('Overturned Boat', 1.05, 'He overturns the boat and throws every enemy into the water.'),
    P('Clam\'s Grip', 3.2, 'Once the clam grips, it never lets go: one crushing blow on one foe.')
  ]);
  sk('mengkang', [
    P('Jade Flagpole', 1.8, 'A heavy blow at one foe from the towering Jade Flagpole.'),
    PA('Flower-Rock Barge', 1.1, 'He rams the whole enemy line like a great flower-and-rock barge.'),
    P('Flogging Repaid', 3.3, 'As he repaid the officer who flogged him: one crushing blow on one foe.')
  ]);
  sk('chenda', [
    P('Stream-Leaping Tiger', 1.7, 'A heavy blow at one foe from the stream-leaping tiger.'),
    PA('Shaohua Raid', 1.05, 'The bandits of Mount Shaohua raid the whole enemy line.'),
    P('Tiger\'s Leap', 3.2, 'He leaps the stream onto one foe in one crushing blow.')
  ]);
  sk('yangchun', [
    P('Long Blade', 1.7, 'A heavy cut of the long blade at one foe.'),
    PA('White-Spotted Snake', 1.05, 'The long blade slides along the whole enemy line like a snake; some may be poisoned.', { status: 'poison', statusChance: 0.3 }),
    P('Snake\'s Strike', 3.2, 'Quiet, and then very fast: one strike on one foe that cannot miss.', { sure: true })
  ]);
  sk('zhengtianshou', [
    P('Fair-Faced Sword', 1.7, 'A heavy sword-cut at one foe — pale and handsome, and deadly.'),
    PA('Silversmith\'s Edge', 1.05, 'A silversmith\'s fine edge cuts across the whole enemy line.'),
    P('Fair-Faced Gentleman', 3.2, 'Not as gentle as he looks: one crushing blow on one foe.')
  ]);
  sk('taozongwang', [
    P('Iron Spade', 1.8, 'A heavy blow of the farmer\'s iron spade at one foe.', BL),
    PA('Earthworks', 1.05, 'He digs the ground out from under the whole enemy line.', BL),
    P('Nine-Tailed Turtle', 3.2, 'Slow and impossible to stop: one crushing blow on one foe.', BL)
  ]);
  sk('gongwang', [
    P('Flying Spear', 1.7, 'He hurls a flying spear at one foe.', { shot: 'arrow' }),
    PA('Flower-Necked Tiger', 1.05, 'Spears fly from the tattooed tiger at every enemy.', { shot: 'arrow' }),
    P('Dongchang Spear', 3.2, 'The great Dongchang spear, hurled at one foe in one crushing blow.', { shot: 'arrow' })
  ]);
  sk('dingdesun', [
    P('Flying Fork', 1.7, 'He throws a flying fork at one foe; it flies true.', { shot: 'arrow' }),
    PA('Arrow-Struck Tiger', 1.05, 'Forks fly in every direction, hitting every enemy.', { shot: 'arrow' }),
    P('Scarred Fork', 3.2, 'He has been hit before; now he hurls one crushing fork at one foe.', { shot: 'arrow' })
  ]);
  sk('muchun', [
    P('Little Unrestrained', 1.7, 'A heavy blow at one foe, picking a fight as in the Jieyang market.', BL),
    PA('Market Brawl', 1.05, 'A street brawl that sweeps up the whole enemy line.', BL),
    P('Younger Brother\'s Staff', 3.2, 'One crushing blow of the staff on one foe — Mu Hong\'s brother is no weakling.', BL)
  ]);
  sk('caozheng', [
    P('Butcher\'s Knife', 1.8, 'The butcher\'s knife carves into one foe and cuts through armour.', { pierce: true }),
    PA('Demon Carver', 1.1, 'He carves through the whole enemy line like a carcass.'),
    P('Trick of Mount Erlong', 3.3, 'The trick that won Mount Erlong: one blow on one foe that cannot miss.', { sure: true })
  ]);
  sk('songwan', [
    P('Giant in the Clouds', 1.8, 'A heavy blow at one foe from the towering giant.', BL),
    PA('Founder\'s Charge', 1.05, 'One of the first chiefs of Liangshan charges the whole enemy line.'),
    P('Towering Blow', 3.2, 'He brings a towering blow down on one foe from high above.', BL)
  ]);
  sk('duqian', [
    P('Sky-Touching Giant', 1.8, 'A heavy blow at one foe from the sky-touching giant.', BL),
    PA('Founder\'s Sabre', 1.05, 'He sweeps the founder\'s sabre across the whole enemy line.'),
    P('Giant\'s Blow', 3.2, 'He falls on one foe like a toppling tree in one crushing blow.', BL)
  ]);
  sk('xueyong', [
    P('Sick Tiger Staff', 1.7, 'A heavy blow of the performer\'s staff at one foe.', BL),
    H('Medicine-Seller', 90, 'allyAll', 'He hands out his plasters and pills: the whole party is healed.'),
    P('Street Performer', 1.0, 'The whole street-performer\'s routine, for real: three staff-blows on one foe.', o({ hits: 3 }, BL))
  ]);
  sk('shien', [
    P('Golden-Eyed Sword', 1.7, 'A heavy cut of the golden-eyed sword at one foe.'),
    BF('Happy Forest Tavern', 'atkUp', 'allyAll', 'Wine from the Happy Forest before the fight: the party\'s attack rises.'),
    P('Tiger Cub', 3.2, 'The tiger cub has teeth: one crushing blow on one foe.')
  ]);
  sk('lizhong', [
    P('Tiger-Slaying Staff', 1.7, 'A heavy blow of the tiger-slaying staff at one foe.', BL),
    H('Plasters for Sale', 80, 'allyAll', 'His street plasters actually work: the whole party is healed.'),
    P('Tiger-Slaying General', 3.2, 'The name is not only for show: one crushing blow on one foe.', BL)
  ]);
  sk('zhoutong', [
    P('Little Conqueror', 1.8, 'A heavy spear-thrust at one foe from the Little Conqueror.'),
    PA('Bridegroom\'s Charge', 1.05, 'He charges the whole enemy line like a bridegroom come for his bride.'),
    P('Peach Blossom Spear', 3.2, 'One crushing thrust of the Peach Blossom spear at one foe.')
  ]);
  sk('tanglong', [
    P('Iron Hammer', 1.9, 'A heavy blow of the blacksmith\'s iron hammer at one foe.', BL),
    PA('Forge Fire', 1.1, 'Sparks fly from his hammer as he strikes the whole enemy line.', { fx: 'fire' }),
    P('Gold-Spotted Leopard', 3.4, 'He swings the hammer down on one foe in one crushing blow.', BL)
  ]);
  sk('duxing', [
    P('Demon Face', 1.7, 'A heavy blow at one foe; his demon face may leave them frozen with fright.', { status: 'sleep', statusChance: 0.2 }),
    PA('Loyal Steward', 1.05, 'The loyal steward fights for his master, striking the whole enemy line.'),
    P('Loyal to the End', 3.2, 'Loyal to the end: one crushing blow on one foe.')
  ]);
  sk('zouyuan', [
    P('Dragon from the Forest', 1.75, 'A heavy cut at one foe, straight out of the forest.'),
    PA('Dengyun Ambush', 1.05, 'An ambush from the trees of Dengyun Mountain hits the whole enemy line.'),
    P('Uncle\'s Sabre', 3.2, 'One crushing blow of the uncle\'s sabre on one foe.')
  ]);
  sk('zourun', [
    P('Single Horn', 1.8, 'He butts one foe with the horn on his head — they may be left stunned.', o({ status: 'sleep', statusChance: 0.35 }, BL)),
    PA('Single-Horned Dragon', 1.1, 'He charges head-first through the whole enemy line.', BL),
    P('Pine-Splitting Butt', 3.4, 'The head-butt that splits a pine tree, into one foe: a crushing blow.', BL)
  ]);
  sk('zhugui', [
    P('Dry-Land Crocodile', 1.7, 'A heavy blow at one foe from the crocodile of the marsh shore.'),
    ST('Drugged Meat', 'sleep', 0.5, 'enemyAll', 'Drugged meat from his tavern may put every enemy to sleep.'),
    P('Whistling Arrow', 3.2, 'He looses a whistling arrow into one foe — it never misses.', AR)
  ]);
  sk('zhufu', [
    P('Smiling Tiger', 1.7, 'An easy smile, then a heavy knife-cut at one foe.'),
    ST('Drugged Wine', 'sleep', 0.5, 'enemyAll', 'The drugged wine that freed Li Kui may put every enemy to sleep.'),
    P('Smile and Strike', 3.2, 'He smiles right up to the last moment: one blow on one foe that cannot miss.', { sure: true })
  ]);
  sk('caifu', [
    P('Iron Arm', 1.8, 'The iron arm of the executioner cuts into one foe, straight through armour.', { pierce: true }),
    PA('Executioner\'s Round', 1.1, 'He works through a long list today: a cut across the whole enemy line.'),
    P('Iron Arm Strikes', 3.3, 'One clean executioner\'s stroke on one foe that cuts through armour.', { pierce: true })
  ]);
  sk('caiqing', [
    P('Single Flower', 1.8, 'A heavy sword-cut at one foe that cuts through armour.', { pierce: true }),
    PA('Execution Ground', 1.1, 'He clears the whole execution ground with one sweep of the sword.'),
    P('Falling Petal', 3.3, 'Neat and final: one sword-stroke on one foe that cuts through armour.', { pierce: true })
  ]);
  sk('lili', [
    P('Life-Taking Judge', 1.7, 'A heavy blow at one foe from the life-taking judge of Jieling Ridge.'),
    ST('Drugged Dumplings', 'sleep', 0.55, 'enemyAll', 'His drugged dumplings may put every enemy to sleep.'),
    P('Judge\'s Verdict', 3.3, 'The judgement is death: one crushing blow on one foe.')
  ]);
  sk('liyun', [
    P('Green-Eyed Tiger', 1.8, 'A heavy blow at one foe from the green-eyed constable.'),
    PA('Constable\'s Sabre', 1.05, 'The constable\'s sabre keeps order across the whole enemy line.'),
    P('Tricked No Longer', 3.3, 'He was tricked once and never again: one crushing blow on one foe.')
  ]);
  sk('jiaoting', [
    P('Family Wrestling', 0.9, 'Three wrestling throws in a row on one foe.', o({ hits: 3 }, BL)),
    P('Faceless', 2.2, 'He grabs one foe and slams them down — they may be stunned.', o({ status: 'sleep', statusChance: 0.4 }, BL)),
    PA('Unwelcome Everywhere', 1.6, 'Unwelcome everywhere, he throws every enemy to the ground.', BL)
  ]);
  sk('shiyong', [
    P('Stone General', 1.8, 'A heavy blow at one foe from the Stone General.'),
    PA('Gambler\'s Fury', 1.1, 'A gambler\'s fury that lashes out at the whole enemy line.'),
    P('The False Letter', 3.3, 'One crushing blow on one foe from the man who carried the false letter.')
  ]);
  sk('sunxin', [
    P('Steel Whip', 1.0, 'Two blows of the steel whip at one foe.', o({ hits: 2 }, BL)),
    PA('Little Yuchi', 1.05, 'Like his brother, like Yuchi Gong, he lays into the whole enemy line.', BL),
    P('Tavern Brawl', 3.2, 'A tavern-brawler\'s crushing blow on one foe.', BL)
  ]);
  sk('gudasao', [
    P('Female Tiger', 1.0, 'Two hard blows at one foe from the woman who can thrash twenty men.', { hits: 2 }),
    PA('Thrash Twenty Men', 1.2, 'She thrashes the whole enemy line, twenty men or more.'),
    P('Prison Break', 3.4, 'As she forced the prison open: one crushing blow on one foe.')
  ]);
  sk('zhangqing2', [
    P('Gardener\'s Pole', 1.7, 'A heavy blow of the gardener\'s pole at one foe.', BL),
    PA('Cross Slope', 1.05, 'The keeper of Cross Slope inn lays into the whole enemy line.', BL),
    P('Vegetable Gardener', 3.2, 'He knows how to dig: one crushing blow on one foe.', BL)
  ]);
  sk('sunerniang', [
    P('Female Yaksha', 1.0, 'Two quick knife-strikes at one foe.', { hits: 2, vfx: 'knife' }),
    ST('Drugged Wine of Cross Slope', 'sleep', 0.6, 'enemyAll', 'The drugged wine of Cross Slope may put every enemy to sleep.'),
    P('Yaksha\'s Knives', 0.9, 'The mistress of Cross Slope at work: five knife-strikes at random foes.', { hits: 5, scatter: true })
  ]);
  sk('wangdingliu', [
    P('Living Lightning God', 0.95, 'Two lightning-fast strikes at one foe.', o({ hits: 2 }, BL)),
    PA('Lightning Dash', 1.05, 'He dashes past the whole enemy line, striking each before they can turn.', BL),
    P('Run Like Lightning', 0.9, 'He runs like lightning: four strikes at random foes.', o({ hits: 4, scatter: true }, BL))
  ]);
  sk('yubaosi', [
    P('Flagstaff', 1.9, 'A heavy blow of the banner-pole at one foe from the giant who carries it.', BL),
    PA('Highwayman', 1.15, 'The highwayman lays into the whole enemy line.', BL),
    P('God of the Dangerous Road', 3.5, 'No one passes the God of the Dangerous Road: one crushing blow on one foe.', BL)
  ]);
  sk('baisheng', [
    P('Carrying Pole', 1.6, 'A blow of the carrying pole he took the wine up the ridge on, at one foe.', BL),
    ST('Wine on Yellow Earth Ridge', 'sleep', 0.6, 'enemyAll', 'The drugged wine of Yellow Earth Ridge may put every enemy to sleep.'),
    P('Daylight Rat', 0.85, 'Quick hands of the Daylight Rat: four strikes at random foes.', { hits: 4, scatter: true })
  ]);
  sk('shiqian', [
    P('Flea on a Drum', 1.0, 'Two strikes at one foe as he leaps from roof to roof.', { hits: 2 }),
    ST('Steal', 'silence', 0.6, 'enemy1', 'He steals one foe\'s voice: they may be silenced and unable to use skills.'),
    P('The Stolen Rooster', 0.9, 'The thief who stole the rooster darts among them: five strikes at random foes.', { hits: 5, scatter: true })
  ]);
  sk('duanjingzhu', [
    P('Golden-Haired Hound', 1.7, 'A heavy blow at one foe from the horse thief of Zhuozhou.'),
    PA('Stampede', 1.05, 'He drives a stampede of horses through the whole enemy line.'),
    P('Jade Lion That Lights the Night', 3.2, 'He rides the finest horse in the land into one foe — a blow that cannot miss.', { sure: true })
  ]);

  // ===================== companions who fight beside the 108 =====================
  sk('wangjin', [
    P('Instructor\'s Staff', 1.8, 'A heavy blow of the instructor\'s staff at one foe, strength with method.', BL),
    BF('Method', 'defUp', 'allyAll', 'He shows the party how to stand: defence rises.'),
    P('Eighteen Arms', 3.6, 'The master of the eighteen arms strikes one foe — a blow that cannot miss.', o({ sure: true }, BL))
  ]);
  sk('luda', [
    P('Three Punches', 0.85, 'Three punches at one foe — nose, eye, temple — the end of the Lord of the West.', o({ hits: 3 }, BL)),
    PA('Major\'s Temper', 1.2, 'Loud and quick with his fists, he lays into the whole enemy line.', BL),
    P('For the Jins', 3.8, 'For the singer and her father: one crushing blow on one foe.', BL)
  ]);
  sk('chaogai', [
    P('Stone Pagoda', 2.0, 'A heavy blow at one foe from the man who carried a stone pagoda across the stream.', BL),
    PA('Heavenly King', 1.15, 'The headman of East Creek leads a charge that strikes the whole enemy line.'),
    P('Heavenly King Who Carries the Pagoda', 3.8, 'All the weight of the pagoda in one crushing blow on one foe.', BL)
  ]);
  sk('qiongying', [
    P('Flying Stone', 1.8, 'She throws a stone at one foe, as Zhang Qing taught her in a dream — it never misses.', o({ sure: true }, STN)),
    PA('Feathered Arrow', 1.0, 'Stone after stone, at every enemy.', STN),
    P('Vengeance of the Maiden', 0.85, 'For her parents: five stones at random foes, never missing.', o({ hits: 5, scatter: true, sure: true }, STN))
  ]);
  sk('hongxin', [
    P('Ceremonial Staff', 1.4, 'A weak blow of the ceremonial staff at one foe; the Grand Marshal is no fighter.', BL),
    BF('Imperial Authority', 'defUp', 'self', 'He hides behind his rank: his own defence rises.'),
    P('Marshal\'s Pride', 2.4, 'His pride broke the demons\' seal; now he brings his staff down on one foe.', BL)
  ]);
})();
