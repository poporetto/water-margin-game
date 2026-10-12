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
    H('Timely Rain', 60, 'allyAll', 'Song Jiang\'s generosity falls like rain in a drought: restores the party.'),
    BF('Act on Heaven\'s Behalf', 'atkUp', 'allyAll', 'He raises the apricot-yellow banner: the party\'s attack rises.'),
    M('Thirty-Six Spirits', 230, 'magic', 'enemyAll', 'The Heavenly Book of the Mysterious Lady: the Heavenly Spirits descend on the enemy.', { screen: true })
  ]);
  sk('lujunyi', [
    P('Jade Qilin Thrust', 1.9, 'The spear-thrust that no man of Hebei could turn aside.'),
    PA('Peerless Staff', 1.15, 'Lu Junyi\'s staff, unmatched in the land, sweeps the whole enemy line.', BL),
    P('Pillar of Hebei', 4.0, 'All the art of the richest and greatest fighter of Daming in a single blow.', { sure: true })
  ]);
  sk('wuyong', [
    M('Copper Chains', 70, 'wind', 'enemy1', 'The schoolmaster\'s copper chains lash out like a whip of wind.'),
    ST('Drugged Wine', 'sleep', 0.6, 'enemyAll', 'The trick of Yellow Earth Ridge: the enemy drinks, and drops where they stand.'),
    BF('Stratagem of Zhuge', 'atkUp', 'allyAll', 'A plan to rival Zhuge Liang\'s: every brother knows where to strike.', { also: 'defUp' })
  ]);
  sk('gongsunsheng', [
    M('Thunderclap', 80, 'thunder', 'enemy1', 'Lightning answers the pine-pattern sword.'),
    M('Five Thunders', 135, 'thunder', 'enemyAll', 'The Five Thunders of Heaven\'s True Law, taught by Luo Zhenren.', { screen: true }),
    M('Dragon Entering the Clouds', 270, 'thunder', 'enemyAll', 'The Daoist rides the storm itself down upon the enemy.', { screen: true })
  ]);
  sk('guansheng', [
    P('Green Dragon Slash', 2.0, 'The crescent blade of his ancestor Guan Yu comes down like a falling moon.'),
    PA('Crescent Moon Sweep', 1.2, 'The Green Dragon Blade sweeps the whole line.'),
    P('Spirit of Guan Yu', 4.0, 'The red face, the long beard, the blade: for a moment, the god of war himself.', { pierce: true })
  ]);
  sk('linchong', [
    P('Serpent Spear', 1.9, 'The eighteen-foot serpent spear of the Imperial Instructor finds the gap in any guard.', { pierce: true }),
    P('Wind and Snow at the Temple', 1.0, 'The night of the Mountain God temple: three thrusts, three dead men.', { hits: 3 }),
    P('Panther Head Charge', 3.9, 'Every insult swallowed since the White Tiger Hall, paid back at once.', { sure: true })
  ]);
  sk('qinming', [
    P('Wolf-Tooth Mace', 2.0, 'A blow like a thunderbolt. It may leave the foe senseless.', o({ status: 'sleep', statusChance: 0.3 }, BL)),
    PA('Thunder Roar', 1.1, 'Qin Ming\'s voice like thunder before the charge.', BL),
    P('Thunderbolt', 3.9, 'The fury of the commander of Qingzhou.', BL)
  ]);
  sk('huyanzhuo', [
    P('Twin Steel Whips', 1.05, 'Left whip, right whip.', o({ hits: 2 }, BL)),
    PA('Chained Cavalry', 1.25, 'The armoured horses, chained ten abreast, ride down the enemy.'),
    P('Legacy of Huyan Zan', 1.3, 'The whips of the founding general\'s house.', o({ hits: 3 }, BL))
  ]);
  sk('huarong', [
    P('Little Li Guang', 2.0, 'An arrow that never misses its mark.', AR),
    PA('Rain of Arrows', 1.1, 'Arrow after arrow, faster than the eye.', AR),
    P('The Wild Goose', 1.35, 'He named the goose before he loosed. Three arrows, three in the head.', o({ hits: 3 }, AR))
  ]);
  sk('chaijin', [
    P('Little Whirlwind', 0.95, 'A noble\'s swordsmanship, quick as a whirl of wind.', { hits: 2 }),
    BF('Iron Writ', 'defUp', 'allyAll', 'The founding emperor\'s pledge of immunity shields the party.'),
    H('Welcome of the Chai Manor', 160, 'allyAll', 'Every wanderer under heaven finds food and rest at Chai Jin\'s gate.', { cure: true })
  ]);
  sk('liying', [
    P('Flying Knife', 1.8, 'One of the five knives on his back.', { shot: 'arrow' }),
    PA('Five Flying Knives', 1.0, 'All five knives at once.', { shot: 'arrow' }),
    P('Sky-Striking Eagle', 3.6, 'He drops on his prey like an eagle from the sky.', { sure: true })
  ]);
  sk('zhutong', [
    P('Beautiful Beard Halberd', 1.9, 'The constable of Yuncheng with Guan Yu\'s beard and Guan Yu\'s strength.'),
    PA('Halberd Sweep', 1.15, 'A long sweep of the halberd.'),
    P('Lord of the Beautiful Beard', 3.6, 'The constable who let Chao Gai and Song Jiang go free does not let this one go.')
  ]);
  sk('luzhishen', [
    P('Three Punches', 0.85, 'Three punches killed the Lord of the West. Nose, eye, temple.', o({ hits: 3 }, BL)),
    PA('Uproot the Willow', 1.3, 'He pulls a willow tree up by the roots and swings it.', BL),
    P('Chan Staff of Wutai', 4.2, 'Sixty-two catties of iron in the hands of the Flowery Monk.', BL)
  ]);
  sk('wusong', [
    P('Tiger-Slaying Fists', 0.85, 'The fists that beat the tiger of Jingyang Ridge to death.', o({ hits: 3 }, BL)),
    PA('Drunken Fist', 1.2, 'The more he drinks, the better he fights: the Happy Forest all over again.', BL),
    PA('Mandarin Duck Tower', 1.8, 'The night of vengeance: blood on the walls, and his name written in it.')
  ]);
  sk('dongping', [
    P('Twin Spears', 1.0, 'A spear in each hand.', { hits: 2 }),
    PA('General of Myriad Households', 1.15, 'The commander of Dongping charges the line.'),
    P('Double Spear Storm', 0.95, 'The spears come from everywhere at once.', { hits: 4, scatter: true })
  ]);
  sk('zhangqing', [
    P('Featherless Arrow', 1.8, 'A thrown stone, true as an arrow.', o({ sure: true }, STN)),
    PA('Volley of Stones', 1.0, 'Stone after stone from the pouch.', STN),
    P('Fifteen Generals Felled', 0.85, 'One after another, fifteen generals of Liangshan fell to his stones.', o({ hits: 5, scatter: true, sure: true }, STN))
  ]);
  sk('yangzhi', [
    P('Heirloom Sabre', 2.0, 'It cuts iron like mud and a hair blown across its edge.', { pierce: true }),
    PA('Yang Family Blade', 1.15, 'The sabre-art of the great Yang generals.'),
    P('Blue-Faced Beast', 3.8, 'All the bad luck of his life comes down on one enemy.')
  ]);
  sk('xuning', [
    P('Hooked Lance', 1.8, 'The hook pulls the foe off balance; he may not rise in time.', { status: 'sleep', statusChance: 0.3 }),
    PA('Break the Chained Horses', 1.3, 'The lance that hooked the legs of Huyan Zhuo\'s armoured cavalry.'),
    P('Golden Lance Guard', 3.6, 'The sole master of the hooked lance.', { sure: true })
  ]);
  sk('suochao', [
    P('Golden Battle-Axe', 2.0, 'Suo Chao always strikes first.'),
    PA('Vanguard Charge', 1.2, 'Straight into the enemy, as always, without waiting for anyone.'),
    P('Impatient Vanguard', 4.1, 'One enormous blow of the golden axe.')
  ]);
  sk('daizong', [
    P('Swift Sword', 0.95, 'Too fast to see.', { hits: 2 }),
    BF('Divine March', 'atkUp', 'allyAll', 'He ties his paper charms to the brothers\' legs.'),
    P('Eight Hundred Li a Day', 0.95, 'He is everywhere at once.', { hits: 5, scatter: true })
  ]);
  sk('liutang', [
    P('Red-Haired Devil', 1.9, 'The long-handled sabre of the man with the red birthmark.'),
    PA('Long Sabre Sweep', 1.15, 'A great sweep of the long sabre.'),
    P('Raid on the Birthday Gifts', 3.6, 'The blow that began the brotherhood of Liangshan.')
  ]);
  sk('likui', [
    P('Twin Axes', 1.05, 'One axe, then the other.', { hits: 2 }),
    PA('Black Whirlwind', 1.35, 'Stripped to the waist, he spins through the enemy with both axes.'),
    P('Killing Frenzy', 0.95, 'He cuts down everything in his path and does not stop to look.', { hits: 6, scatter: true })
  ]);
  sk('shijin', [
    P('Three-Pointed Blade', 1.8, 'The blade Wang Jin taught him to use properly.'),
    PA('Nine Dragons', 1.15, 'The nine blue dragons on his back seem to move as he fights.'),
    P('Wang Jin\'s Lesson', 3.6, 'Strength with method at last.', { sure: true })
  ]);
  sk('muhong', [
    P('Tyrant of Jieyang', 1.8, 'The spear of the man who rules the town.'),
    PA('Unrestrained', 1.1, 'He fights as he lives, with no restraint at all.'),
    P('Chase to the River', 3.4, 'He chased Song Jiang to the water\'s edge; nothing escapes him.')
  ]);
  sk('leiheng', [
    P('Winged Tiger Leap', 1.9, 'He leaps a stream three zhang wide and lands sabre first.'),
    PA('Constable\'s Sweep', 1.1, 'The strong constable clears the way.'),
    P('Vengeance for His Mother', 3.4, 'The blow that killed the singer Bai Xiuying.')
  ]);
  sk('lijun', [
    P('River Dragon Fork', 1.8, 'The steel fork of the Yangtze boatman.'),
    PA('Capsize', 1.2, 'He overturns the boat with the enemy in it.'),
    P('Lord of the Yangtze', 3.6, 'Of all the 108, the one who saw furthest.')
  ]);
  sk('ruanxiaoer', [
    P('Fish Spear', 1.8, 'The spear of the Shijie fishermen.'),
    PA('Net of Shijie Village', 1.1, 'The net comes down over all of them.'),
    P('Tai Sui Stands His Ground', 3.4, 'The eldest Ruan does not give a step.')
  ]);
  sk('zhangheng', [
    P('Knife-Noodles', 1.8, 'Dumplings, or knife-noodles? The knife is quicker.'),
    PA('Ferry of the Xunyang', 1.1, 'Halfway across the river, the boatman turns on his passengers.'),
    P('Into the River', 3.4, 'Over the side they go.', { status: 'sleep', statusChance: 0.4 })
  ]);
  sk('ruanxiaowu', [
    P('Leopard\'s Dagger', 1.0, 'The second Ruan, quick as the leopard on his chest.', { hits: 2 }),
    PA('Gambler\'s Throw', 1.1, 'He bets everything on one throw.'),
    P('Short-Lived Second Brother', 3.4, 'He fights as though he will die tomorrow.')
  ]);
  sk('zhangshun', [
    P('White Streak in the Waves', 1.0, 'In and out like a fish.', { hits: 2 }),
    P('Drag Under', 2.2, 'He dragged Li Kui under until his eyes were white.', { status: 'sleep', statusChance: 0.45 }),
    PA('Seven Days Beneath the Water', 1.6, 'He comes up from nowhere, among them all.')
  ]);
  sk('ruanxiaoqi', [
    P('Fish Spear', 1.85, 'The youngest and wildest of the Ruans.'),
    PA('Living King of Hell', 1.15, 'He drinks the emperor\'s wine and fights like the king of the dead.'),
    P('Insult to the Envoy', 3.6, 'He would not bow to the court, and he does not bow to this.')
  ]);
  sk('yangxiong', [
    P('Executioner\'s Sabre', 1.9, 'The jailer of Jizhou has struck off many heads.', { pierce: true }),
    PA('Sick Guan Suo', 1.15, 'Pale of face, terrible of blade.'),
    P('Green Mountain Reckoning', 3.6, 'The vengeance on Cuiping Mountain.')
  ]);
  sk('shixiu', [
    P('Daredevil\'s Sabre', 1.9, 'He can never pass by an injustice.'),
    PA('Leap from the Tower', 1.2, 'Alone, he leapt from a tower onto the execution ground.'),
    P('Daredevil Third Brother', 3.6, 'He does not count the enemy.', { sure: true })
  ]);
  sk('xiezhen', [
    P('Hunting Fork', 1.8, 'The steel fork of the Dengzhou hunters.'),
    PA('Tiger Trap', 1.1, 'The poisoned arrows of the tiger trap.', { status: 'poison', statusChance: 0.4 }),
    P('Two-Headed Snake', 3.4, 'He strikes from two sides at once.', { hits: 2, power: 1.7 })
  ]);
  sk('xiebao', [
    P('Hunting Fork', 1.8, 'The younger hunter\'s fork.'),
    PA('Twin-Tailed Scorpion', 1.1, 'A sting from behind.', { status: 'poison', statusChance: 0.4 }),
    P('The Stolen Tiger', 3.4, 'The Mao family took their tiger. They paid for it.')
  ]);
  sk('yanqing', [
    P('Crossbow Bolt', 1.8, 'His little crossbow never misses.', AR),
    P('Wrestler\'s Throw', 2.2, 'The throw that beat Ren Yuan at Mount Tai.', o({ status: 'sleep', statusChance: 0.45 }, BL)),
    P('The Prodigal', 1.4, 'Singer, wrestler, archer, tattooed and handsome: three bolts and he is gone.', o({ hits: 3 }, AR))
  ]);

  // ===================== The seventy-two Earthly Fiends =====================
  sk('zhuwu', [
    M('Battle Formation', 60, 'earth', 'enemy1', 'The brains of Mount Shaohua arrange the ground against the enemy.'),
    BF('Plea of Brotherhood', 'defUp', 'allyAll', 'His tearful plea saved Chen Da. Now it steels the party.'),
    M('Landslide', 160, 'earth', 'enemyAll', 'The mountain itself falls on the enemy.', { screen: true })
  ]);
  sk('huangxin', [
    P('Mourning Sword', 1.8, 'The sword he boasted would suppress three mountains.'),
    PA('Suppress Three Mountains', 1.1, 'He meant to sweep them all away.'),
    P('Suppressor\'s Wrath', 3.3, 'Now he suppresses the enemy instead.')
  ]);
  sk('sunli', [
    P('Spear and Whip', 1.0, 'Spear in one hand, steel whip in the other.', { hits: 2 }),
    PA('Sick Yuchi', 1.1, 'Like the Tang general Yuchi Gong.'),
    P('The Pretended Ally', 3.4, 'He came to the Zhu Village as a friend.', { sure: true })
  ]);
  sk('xuanzan', [
    P('Steel Sabre', 1.8, 'The prince\'s son-in-law can fight.'),
    PA('Ugly Face', 1.0, 'His face alone puts the enemy off their guard.', { status: 'sleep', statusChance: 0.25 }),
    P('Prince Consort\'s Blow', 3.3, 'His bride died of the shock. So does this one.')
  ]);
  sk('haosiwen', [
    P('Wood Dog Spear', 1.8, 'Born under the Wood Dog of the Well.'),
    PA('Sworn Brother\'s Charge', 1.1, 'He rides at Guan Sheng\'s side.'),
    P('Star of the Well', 3.3, 'The constellation of his mother\'s dream shines on his spear.')
  ]);
  sk('hantao', [
    P('Jujube-Wood Lance', 1.8, 'The vanguard of Huyan Zhuo.'),
    PA('Hundred Victories', 1.1, 'A graduate of the military examinations knows how to charge.'),
    P('General of a Hundred Victories', 3.3, 'One more victory.')
  ]);
  sk('pengqi', [
    P('Three-Pointed Blade', 1.8, 'Huyan Zhuo\'s second.'),
    PA('Heaven-Eyed Sweep', 1.1, 'He sees the whole line.'),
    P('Heaven-Eyed General', 3.3, 'The third eye sees where to strike.', { sure: true })
  ]);
  sk('shantinggui', [
    M('Black Water', 70, 'water', 'enemy1', 'The commander of Lingzhou looses the waters.'),
    H('Spring of Sacred Water', 120, 'allyAll', 'Clean water for the whole army.'),
    M('Flood the Field', 190, 'water', 'enemyAll', 'He breaks the dikes and drowns the field.', { screen: true })
  ]);
  sk('weidingguo', [
    M('Fire Arrows', 70, 'fire', 'enemy1', 'The red army of Lingzhou shoots fire.'),
    M('Fire-Carts', 120, 'fire', 'enemyAll', 'Burning carts roll into the enemy.'),
    M('General of Holy Fire', 220, 'fire', 'enemyAll', 'All the field is fire.', { screen: true })
  ]);
  sk('oupeng', [
    P('Golden-Winged Spear', 1.0, 'Swift as a bird.', { hits: 2 }),
    PA('Swoop of the Eagle', 1.1, 'Down from Huangmen Mountain.'),
    P('Golden-Winged Eagle', 3.3, 'He strikes from above.', { sure: true })
  ]);
  sk('dengfei', [
    P('Iron Chain', 1.8, 'His iron chain swings wide.'),
    PA('Fiery-Eyed Lion', 1.15, 'Red-eyed, he whirls the chain through the whole line.'),
    P('Yinma River', 3.4, 'The master of Yinma River.')
  ]);
  sk('yanshun', [
    P('Brocade Tiger', 1.9, 'Red beard and the strength of a bull.'),
    PA('Qingfeng Ambush', 1.15, 'Halt! Leave the carts and the silver!'),
    P('Cattle Trader\'s Blow', 3.4, 'He could fell an ox with one stroke.', BL)
  ]);
  sk('yanglin', [
    P('Brush-Tipped Spear', 1.0, 'A wandering spear.', { hits: 2 }),
    PA('Brocade Leopard', 1.1, 'A leopard\'s spring.'),
    P('Road of Zhangde', 3.3, 'He met Dai Zong on the road and never looked back.')
  ]);
  sk('lingzhen', [
    P('Fire Cannon', 2.0, 'A shell from the finest cannoneer in the realm.', { fx: 'fire', sure: true }),
    PA('Mother-and-Son Cannon', 1.2, 'Shells that burst in the air.', { fx: 'fire' }),
    PA('Heaven-Shaking Thunder', 1.75, 'His shells reach fifteen li.', { fx: 'fire', screen: true })
  ]);
  sk('lufang', [
    P('Red Halberd', 1.85, 'All in red, like Lü Bu.'),
    PA('Little Marquis', 1.1, 'The halberd of a would-be Lü Bu.'),
    P('Painted Halberd', 3.3, 'The duel that tangled their tassels.')
  ]);
  sk('guosheng', [
    P('White Halberd', 1.85, 'All in white, from Sichuan.'),
    PA('Second Rengui', 1.1, 'Like the Tang general Xue Rengui.'),
    P('Mercury-Seller\'s Challenge', 3.3, 'He came to take Lü Fang\'s mountain.')
  ]);
  sk('wangying', [
    P('Stumpy Tiger', 1.7, 'Short and quick.'),
    PA('Cart-Driver\'s Charge', 1.05, 'He drives straight through.'),
    P('Low Blow', 3.2, 'Short men strike low.', { sure: true })
  ]);
  sk('husanniang', [
    P('Twin Sabres', 1.0, 'A sabre in each hand.', { hits: 2 }),
    P('Red Lasso', 1.8, 'She hooks the enemy out of the saddle.', { status: 'sleep', statusChance: 0.5, sure: true }),
    P('Ten Feet of Blue', 1.0, 'Unbeatable with sabres and lasso.', { hits: 4, scatter: true })
  ]);
  sk('baoxu', [
    P('Broad Sword', 1.9, 'He kills without blinking.'),
    PA('God of Death', 1.2, 'Li Kui\'s kindred spirit.'),
    P('Mount Kumu', 3.5, 'Death comes down the mountain.')
  ]);
  sk('fanrui', [
    M('Black Wind', 70, 'wind', 'enemy1', 'The sorcerer of Mount Mangdang calls the wind.'),
    ST('Sand and Stones', 'silence', 0.6, 'enemyAll', 'Flying sand blinds the enemy\'s sorcerers.'),
    M('Demon King\'s Storm', 190, 'wind', 'enemyAll', 'Wind and rain at his command.', { screen: true })
  ]);
  sk('kongming', [
    P('Comet Spear', 1.8, 'Song Jiang\'s pupil at White Tiger Mountain.'),
    PA('Kong Family Charge', 1.1, 'The elder son leads.'),
    P('Comet', 3.3, 'A bright streak across the field.')
  ]);
  sk('kongliang', [
    P('Lone Fire', 1.8, 'The younger Kong brother.'),
    PA('Set the Dog On', 1.0, 'He set his dog on Wu Song once.'),
    P('Kong Liang\'s Sword', 3.2, 'Taught by Song Jiang himself.')
  ]);
  sk('xiangchong', [
    P('Flying Knives', 1.6, 'From behind his round shield.', { shot: 'arrow' }),
    PA('Twenty-Four Knives', 1.05, 'Twenty-four flying knives at once.', { shot: 'arrow' }),
    P('Eight-Armed Nezha', 0.9, 'Knives from eight arms.', { hits: 5, scatter: true, shot: 'arrow' })
  ]);
  sk('ligun', [
    P('Javelin', 1.7, 'Over the rim of his shield.', { shot: 'arrow' }),
    PA('Shield Wall', 1.05, 'Javelins from behind the shields.', { shot: 'arrow' }),
    P('Sky-Soaring Sage', 3.3, 'A javelin from the sky.', { shot: 'arrow', sure: true })
  ]);
  sk('malin', [
    P('Twin Swords', 1.0, 'Two swords between bouts of the flute.', { hits: 2 }),
    ST('Iron Flute', 'sleep', 0.5, 'enemyAll', 'The iron flute\'s song lulls the enemy.'),
    P('Iron Flute Immortal', 1.0, 'The swords dance to his tune.', { hits: 4, scatter: true })
  ]);
  sk('tongwei', [
    P('Dragon from the Cave', 1.0, 'Quick as an eel.', { hits: 2 }),
    PA('River Ambush', 1.05, 'Out of the water, all around.'),
    P('Smuggler\'s Knife', 3.2, 'Li Jun\'s follower strikes from below.')
  ]);
  sk('tongmeng', [
    P('River-Churning Clam', 1.0, 'He churns the river.', { hits: 2 }),
    PA('Overturned Boat', 1.05, 'Into the water with them.'),
    P('Clam\'s Grip', 3.2, 'Once he holds, he does not let go.')
  ]);
  sk('mengkang', [
    P('Jade Flagpole', 1.8, 'Tall as a flagpole.'),
    PA('Flower-Rock Barge', 1.1, 'The builder of barges rams the line.'),
    P('Flogging Repaid', 3.3, 'He killed the officer who flogged him.')
  ]);
  sk('chenda', [
    P('Stream-Leaping Tiger', 1.7, 'He rode down to borrow grain.'),
    PA('Shaohua Raid', 1.05, 'The bandits of Mount Shaohua.'),
    P('Tiger\'s Leap', 3.2, 'Across the stream and onto the enemy.')
  ]);
  sk('yangchun', [
    P('Long Blade', 1.7, 'Lean and quiet.'),
    PA('White-Spotted Snake', 1.05, 'The long blade slides along the line.', { status: 'poison', statusChance: 0.3 }),
    P('Snake\'s Strike', 3.2, 'Quiet, and then very fast.', { sure: true })
  ]);
  sk('zhengtianshou', [
    P('Fair-Faced Sword', 1.7, 'Pale and handsome, and deadly.'),
    PA('Silversmith\'s Edge', 1.05, 'A silversmith\'s son knows fine edges.'),
    P('Fair-Faced Gentleman', 3.2, 'Not as gentle as he looks.')
  ]);
  sk('taozongwang', [
    P('Iron Spade', 1.8, 'A farmer\'s spade.', BL),
    PA('Earthworks', 1.05, 'He digs the ground out from under them.', BL),
    P('Nine-Tailed Turtle', 3.2, 'Slow, and impossible to stop.', BL)
  ]);
  sk('gongwang', [
    P('Flying Spear', 1.7, 'Zhang Qing\'s lieutenant hurls spears.', { shot: 'arrow' }),
    PA('Flower-Necked Tiger', 1.05, 'Spears from the tattooed tiger.', { shot: 'arrow' }),
    P('Dongchang Spear', 3.2, 'The spear of Dongchang.', { shot: 'arrow' })
  ]);
  sk('dingdesun', [
    P('Flying Fork', 1.7, 'His face is pitted with scars; his forks fly true.', { shot: 'arrow' }),
    PA('Arrow-Struck Tiger', 1.05, 'Forks in every direction.', { shot: 'arrow' }),
    P('Scarred Fork', 3.2, 'He has been hit before. He hits back.', { shot: 'arrow' })
  ]);
  sk('muchun', [
    P('Little Unrestrained', 1.7, 'He picked a fight in the Jieyang market.', BL),
    PA('Market Brawl', 1.05, 'A brawl in the street.', BL),
    P('Younger Brother\'s Staff', 3.2, 'Mu Hong\'s brother is no weakling.', BL)
  ]);
  sk('caozheng', [
    P('Butcher\'s Knife', 1.8, 'A butcher by trade.', { pierce: true }),
    PA('Demon Carver', 1.1, 'He carves the line like a carcass.'),
    P('Trick of Mount Erlong', 3.3, 'Lin Chong\'s apprentice won a mountain with a trick.', { sure: true })
  ]);
  sk('songwan', [
    P('Giant in the Clouds', 1.8, 'A towering man.', BL),
    PA('Founder\'s Charge', 1.05, 'One of the first chiefs of Liangshan.'),
    P('Towering Blow', 3.2, 'From high above.', BL)
  ]);
  sk('duqian', [
    P('Sky-Touching Giant', 1.8, 'He touches the sky.', BL),
    PA('Founder\'s Sabre', 1.05, 'Who built the stronghold with Wang Lun.'),
    P('Giant\'s Blow', 3.2, 'He falls on the enemy like a tree.', BL)
  ]);
  sk('xueyong', [
    P('Sick Tiger Staff', 1.7, 'The street performer\'s staff.', BL),
    H('Medicine-Seller', 90, 'allyAll', 'His plasters and pills for the brothers.'),
    P('Street Performer', 1.0, 'The whole routine, for real this time.', o({ hits: 3 }, BL))
  ]);
  sk('shien', [
    P('Golden-Eyed Sword', 1.7, 'The warden\'s son.'),
    BF('Happy Forest Tavern', 'atkUp', 'allyAll', 'Wine for the brothers before the fight.'),
    P('Tiger Cub', 3.2, 'The cub has teeth.')
  ]);
  sk('lizhong', [
    P('Tiger-Slaying Staff', 1.7, 'Shi Jin\'s first teacher.', BL),
    H('Plasters for Sale', 80, 'allyAll', 'He sells plasters on the street. They work.'),
    P('Tiger-Slaying General', 3.2, 'The name is not only for show.', BL)
  ]);
  sk('zhoutong', [
    P('Little Conqueror', 1.8, 'The bandit of Peach Blossom Mountain.'),
    PA('Bridegroom\'s Charge', 1.05, 'He came to claim a bride.'),
    P('Peach Blossom Spear', 3.2, 'And found Lu Zhishen in the bridal bed.')
  ]);
  sk('tanglong', [
    P('Iron Hammer', 1.9, 'A blacksmith\'s hammer.', BL),
    PA('Forge Fire', 1.1, 'Sparks from the anvil.', { fx: 'fire' }),
    P('Gold-Spotted Leopard', 3.4, 'Xu Ning\'s cousin swings the hammer.', BL)
  ]);
  sk('duxing', [
    P('Demon Face', 1.7, 'A face that frightens children.', { status: 'sleep', statusChance: 0.2 }),
    PA('Loyal Steward', 1.05, 'He fights for his master.'),
    P('Loyal to the End', 3.2, 'He carried Li Ying home.')
  ]);
  sk('zouyuan', [
    P('Dragon from the Forest', 1.75, 'A gambler and bandit of Dengyun Mountain.'),
    PA('Dengyun Ambush', 1.05, 'Out of the forest.'),
    P('Uncle\'s Sabre', 3.2, 'Zou Run\'s uncle.')
  ]);
  sk('zourun', [
    P('Single Horn', 1.8, 'The lump on his head can butt a pine tree in two.', o({ status: 'sleep', statusChance: 0.35 }, BL)),
    PA('Single-Horned Dragon', 1.1, 'He charges head first.', BL),
    P('Pine-Splitting Butt', 3.4, 'Head first, through the enemy.', BL)
  ]);
  sk('zhugui', [
    P('Dry-Land Crocodile', 1.7, 'The tavern-keeper of the marsh shore.'),
    ST('Drugged Meat', 'sleep', 0.5, 'enemyAll', 'Travellers are welcomed, robbed or recruited.'),
    P('Whistling Arrow', 3.2, 'He signals the boats, and the boats come.', AR)
  ]);
  sk('zhufu', [
    P('Smiling Tiger', 1.7, 'An easy smile, and a knife.'),
    ST('Drugged Wine', 'sleep', 0.5, 'enemyAll', 'The wine that freed Li Kui.'),
    P('Smile and Strike', 3.2, 'He smiles right up to the last moment.', { sure: true })
  ]);
  sk('caifu', [
    P('Iron Arm', 1.8, 'The executioner of Daming.', { pierce: true }),
    PA('Executioner\'s Round', 1.1, 'He has a long list today.'),
    P('Iron Arm Strikes', 3.3, 'One stroke.', { pierce: true })
  ]);
  sk('caiqing', [
    P('Single Flower', 1.8, 'A flower over his ear, a sword in his hand.', { pierce: true }),
    PA('Execution Ground', 1.1, 'The square is full.'),
    P('Falling Petal', 3.3, 'Neat and final.', { pierce: true })
  ]);
  sk('lili', [
    P('Life-Taking Judge', 1.7, 'The keeper of the inn on Jieling Ridge.'),
    ST('Drugged Dumplings', 'sleep', 0.55, 'enemyAll', 'He drugged Song Jiang before learning who he was.'),
    P('Judge\'s Verdict', 3.3, 'The judgement is death.')
  ]);
  sk('liyun', [
    P('Green-Eyed Tiger', 1.8, 'The constable of Yishui.'),
    PA('Constable\'s Sabre', 1.05, 'He keeps order.'),
    P('Tricked No Longer', 3.3, 'He was tricked once.')
  ]);
  sk('jiaoting', [
    P('Family Wrestling', 0.9, 'A family art that has no equal.', o({ hits: 3 }, BL)),
    P('Faceless', 2.2, 'So rude no one will have him; so strong no one can throw him.', o({ status: 'sleep', statusChance: 0.4 }, BL)),
    PA('Unwelcome Everywhere', 1.6, 'He throws them all.', BL)
  ]);
  sk('shiyong', [
    P('Stone General', 1.8, 'A gambler who killed a man over a game.'),
    PA('Gambler\'s Fury', 1.1, 'Dice and blood.'),
    P('The False Letter', 3.3, 'He carried Song Jiang\'s father\'s letter.')
  ]);
  sk('sunxin', [
    P('Steel Whip', 1.0, 'He learned the whip from his brother.', o({ hits: 2 }, BL)),
    PA('Little Yuchi', 1.05, 'Like his brother, like Yuchi Gong.', BL),
    P('Tavern Brawl', 3.2, 'He keeps a tavern with his wife.', BL)
  ]);
  sk('gudasao', [
    P('Female Tiger', 1.0, 'She can thrash twenty men.', { hits: 2 }),
    PA('Thrash Twenty Men', 1.2, 'And does.'),
    P('Prison Break', 3.4, 'She forced Sun Li to help break the prison.')
  ]);
  sk('zhangqing2', [
    P('Gardener\'s Pole', 1.7, 'Once a monastery gardener.', BL),
    PA('Cross Slope', 1.05, 'The inn where they spare monks and singers.', BL),
    P('Vegetable Gardener', 3.2, 'He knows how to dig.', BL)
  ]);
  sk('sunerniang', [
    P('Female Yaksha', 1.0, 'Knives, quick and many.', { hits: 2 }),
    ST('Drugged Wine of Cross Slope', 'sleep', 0.6, 'enemyAll', 'Her wine was no match for Wu Song — but it is for them.'),
    P('Yaksha\'s Knives', 0.9, 'The mistress of Cross Slope at work.', { hits: 5, scatter: true })
  ]);
  sk('wangdingliu', [
    P('Living Lightning God', 0.95, 'He runs like lightning.', o({ hits: 2 }, BL)),
    PA('Lightning Dash', 1.05, 'Past them all before they turn.', BL),
    P('Run Like Lightning', 0.9, 'He is everywhere.', o({ hits: 4, scatter: true }, BL))
  ]);
  sk('yubaosi', [
    P('Flagstaff', 1.9, 'A giant carrying the banner.', BL),
    PA('Highwayman', 1.15, 'He stole the horses for Liangshan.', BL),
    P('God of the Dangerous Road', 3.5, 'No one passes.', BL)
  ]);
  sk('baisheng', [
    P('Carrying Pole', 1.6, 'The pole he carried the wine on.', BL),
    ST('Wine on Yellow Earth Ridge', 'sleep', 0.6, 'enemyAll', 'He sang as he carried the drugged wine up the ridge.'),
    P('Daylight Rat', 0.85, 'An idle gambler with quick hands.', { hits: 4, scatter: true })
  ]);
  sk('shiqian', [
    P('Flea on a Drum', 1.0, 'He leaps from roof to roof.', { hits: 2 }),
    ST('Steal', 'silence', 0.6, 'enemy1', 'He can steal anything, even a voice.'),
    P('The Stolen Rooster', 0.9, 'He stole the Zhu family\'s rooster, and started a war.', { hits: 5, scatter: true })
  ]);
  sk('duanjingzhu', [
    P('Golden-Haired Hound', 1.7, 'A horse thief from Zhuozhou.'),
    PA('Stampede', 1.05, 'He brings the horses through.'),
    P('Jade Lion That Lights the Night', 3.2, 'He stole the finest horse in the land.', { sure: true })
  ]);

  // ===================== companions who fight beside the 108 =====================
  sk('wangjin', [
    P('Instructor\'s Staff', 1.8, 'Strength without method is a door without a bolt.', BL),
    BF('Method', 'defUp', 'allyAll', 'He shows the party how to stand.'),
    P('Eighteen Arms', 3.6, 'Master of the eighteen arms.', o({ sure: true }, BL))
  ]);
  sk('luda', [
    P('Three Punches', 0.85, 'Nose, eye, temple: the end of the Lord of the West.', o({ hits: 3 }, BL)),
    PA('Major\'s Temper', 1.2, 'Loud, generous, quick with his fists.', BL),
    P('For the Jins', 3.8, 'For the singer and her father.', BL)
  ]);
  sk('chaogai', [
    P('Stone Pagoda', 2.0, 'He once carried a stone pagoda across the stream.', BL),
    PA('Heavenly King', 1.15, 'The headman of East Creek leads the charge.'),
    P('Heavenly King Who Carries the Pagoda', 3.8, 'All the weight of the pagoda in one blow.', BL)
  ]);
  sk('qiongying', [
    P('Flying Stone', 1.8, 'Taught in a dream to throw as Zhang Qing does.', o({ sure: true }, STN)),
    PA('Feathered Arrow', 1.0, 'Stone after stone.', STN),
    P('Vengeance of the Maiden', 0.85, 'She avenged her parents.', o({ hits: 5, scatter: true, sure: true }, STN))
  ]);
  sk('hongxin', [
    P('Ceremonial Staff', 1.4, 'The Grand Marshal is not a fighter.', BL),
    BF('Imperial Authority', 'defUp', 'self', 'He hides behind his rank.'),
    P('Marshal\'s Pride', 2.4, 'His pride broke the seal; perhaps it breaks this too.', BL)
  ]);
})();
