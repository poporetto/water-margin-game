// Items, equipment, talismans (the setting's runes) and shop inventories.
'use strict';
(function () {
  var IT = WM.data.items, TL = WM.data.talismans, SH = WM.data.shops;
  var o = 0;
  function use(id, name, price, effect, battle, field, desc, extra) {
    IT[id] = Object.assign({ id: id, name: name, type: 'use', price: price, effect: effect, battle: battle, field: field, desc: desc, order: o++ }, extra || {});
  }
  function eq(id, type, name, price, def, desc, extra) {
    IT[id] = Object.assign({ id: id, name: name, type: type, price: price, def: def, desc: desc, order: 100 + o++ }, extra || {});
  }
  function key(id, name, desc) { IT[id] = { id: id, name: name, type: 'key', price: 0, desc: desc, order: 500 + o++ }; }

  // ---- consumables ----
  use('bun', 'Steamed Bun', 10, { heal: 60 }, 'ally1', 'ally1', 'A meat-filled bun. Restores 60 HP.');
  use('beef', 'Sliced Beef', 35, { heal: 180 }, 'ally1', 'ally1', 'Two catties of boiled beef, as heroes order it. Restores 180 HP.');
  use('medicine', 'Medicine', 60, { heal: 300 }, 'ally1', 'ally1', 'A packet of herbal medicine. Restores 300 HP.');
  use('ginseng', 'Wild Ginseng', 220, { heal: 800 }, 'ally1', 'ally1', 'A root from the northern mountains. Restores 800 HP.');
  use('wine', 'Village Wine', 30, { heal: 70 }, 'allyAll', 'allyAll', 'A jug of country wine passed around. Restores 70 HP to everyone.');
  use('goodwine', 'Fine Wine', 140, { heal: 260 }, 'allyAll', 'allyAll', 'Aged wine from a famous cellar. Restores 260 HP to everyone.');
  use('antidote', 'Antidote', 20, { cure: ['poison'] }, 'ally1', 'ally1', 'Cures poison.');
  use('needle', 'Silver Needle', 40, { cure: ['poison', 'sleep', 'silence'] }, 'ally1', 'ally1', 'An acupuncture needle. Cures all ailments.');
  use('soulcharm', 'Soul-Calling Charm', 300, { revive: 0.5 }, 'allyKO', 'ally1', 'A Daoist charm that calls back a fallen comrade with half HP.');
  use('panacea', 'An\'s Panacea', 0, { revive: 1, heal: 'full' }, 'allyKO', 'ally1', 'Divine Physician An Daoquan\'s remedy. Full revival.');
  use('menghan', 'Knockout Drug', 80, { status: 'sleep', chance: 0.8 }, 'enemyAll', null, 'Mengan drug, as slipped into wine on Yellow Earth Ridge. Puts enemies to sleep.', { sfx: 'wind', fx: 'wind' });
  use('lime', 'Lime Powder', 50, { damage: 40, status: 'silence', chance: 0.5 }, 'enemy1', null, 'Thrown in the eyes. Damages and may silence.', { sfx: 'miss', fx: 'sand' });
  use('firepot', 'Fire Pot', 120, { damage: 160 }, 'enemyAll', null, 'An earthen pot of burning oil. Damages all enemies.', { sfx: 'fire', fx: 'fire' });
  use('tigerwine', 'Tiger-Bone Wine', 90, { buff: 'atkUp' }, 'ally1', null, 'Fiery wine steeped with tiger bone. Raises attack for a few rounds.');
  use('incense', 'Calming Incense', 400, { mp: true }, null, 'ally1', 'Restores all talisman charges for one person.');

  // ---- equipment ----
  eq('cap', 'head', 'Cloth Cap', 30, 2, 'A plain cloth cap.');
  eq('bandana', 'head', 'Red Headband', 60, 3, 'A fighter\'s headband.', { bonus: { spd: 1 } });
  eq('leathercap', 'head', 'Leather Cap', 120, 5, 'Hardened leather.');
  eq('ironhelm', 'head', 'Iron Helmet', 380, 9, 'An officer\'s iron helm.', { who: ['warrior', 'brute', 'leader'] });
  eq('phoenixhelm', 'head', 'Phoenix Helmet', 1200, 15, 'A gilded helm of the Imperial Guard.', { who: ['warrior', 'brute', 'leader', 'archer'] });
  eq('hairpin', 'head', 'Silver Hairpin', 220, 5, 'A lady\'s hairpin.', { who: 'women', bonus: { luk: 4 } });
  eq('daoistcrown', 'head', 'Daoist Crown', 500, 7, 'Raises magic.', { who: ['mage', 'scholar'], bonus: { mgc: 6 } });

  eq('robe', 'body', 'Cotton Robe', 40, 3, 'Everyday clothing.');
  eq('quilted', 'body', 'Quilted Coat', 140, 7, 'A padded winter coat.');
  eq('leather', 'body', 'Leather Armour', 320, 11, 'Studded leather armour.');
  eq('lamellar', 'body', 'Lamellar Armour', 900, 18, 'Iron plates laced in rows.', { who: ['warrior', 'brute', 'leader'] });
  eq('goosefeather', 'body', 'Goose-Feather Armour', 0, 26, 'Xu Ning\'s heirloom armour: light as feathers, hard as iron.', { who: ['xuning', 'warrior', 'swift'] });
  eq('monkrobe', 'body', 'Monk\'s Robe', 180, 8, 'A heavy cotton kasaya.', { bonus: { hp: 20 } });
  eq('daoistrobe', 'body', 'Daoist Robe', 420, 10, 'Embroidered with the Eight Trigrams.', { who: ['mage', 'scholar'], bonus: { mgc: 5 } });
  eq('silkrobe', 'body', 'Silk Robe', 600, 9, 'Fine Suzhou silk.', { bonus: { luk: 6 } });
  eq('brigandine', 'body', 'Brigandine', 1600, 24, 'Steel plates riveted inside cloth.', { who: ['warrior', 'brute', 'leader', 'archer', 'swift'] });

  eq('buckler', 'shield', 'Wooden Buckler', 80, 3, 'A small round shield.');
  eq('rattan', 'shield', 'Rattan Shield', 300, 7, 'Light and tough.');
  eq('ironshield', 'shield', 'Iron Shield', 900, 12, 'Heavy but strong.', { who: ['warrior', 'brute'] });

  eq('jadering', 'acc', 'Jade Ring', 300, 1, 'Raises luck.', { bonus: { luk: 8 } });
  eq('straw', 'acc', 'Straw Sandals', 60, 0, 'Light shoes. Raises speed.', { bonus: { spd: 4 } });
  eq('legcharm', 'acc', 'Swift-Walk Charm', 600, 0, 'A paper charm like Dai Zong\'s. Raises speed greatly.', { bonus: { spd: 12 } });
  eq('amulet', 'acc', 'Peach-Wood Amulet', 250, 3, 'Wards off evil. Raises magic defence.', { bonus: { mgc: 4 } });
  eq('gauntlet', 'acc', 'Iron Gauntlets', 450, 4, 'Raises power.', { bonus: { pwr: 6 } });
  eq('beltjade', 'acc', 'Jade Belt', 1500, 4, 'An official\'s belt. Raises all stats a little.', { bonus: { pwr: 4, skl: 4, spd: 4, mgc: 4, luk: 4 } });

  // ---- key items ----
  key('decree', 'Imperial Decree', 'The emperor\'s summons to the Celestial Master Zhang.');
  key('letter_chai', 'Chai Jin\'s Letter', 'A letter of introduction to Zhu Gui of Liangshan.');
  key('sabre', 'Heirloom Sabre', 'Yang Zhi\'s ancestral sabre: cuts copper and iron like mud, splits a hair blown against the edge, kills without a trace of blood.');
  key('heavenbook', 'Heavenly Books', 'Three scrolls given to Song Jiang by the Mysterious Lady of the Ninth Heaven.');
  key('poem', 'Rebel Poem', 'The poem Song Jiang wrote drunk on the wall of Xunyang Tower.');
  key('goldenbell', 'Golden Bell', 'The imperial envoy\'s gilded bell, borrowed for a ruse at Huazhou.');

  // ================= Talismans (runes) =================
  function tal(id, name, price, spells, desc, extra) { TL[id] = Object.assign({ id: id, name: name, price: price, spells: spells, desc: desc }, extra || {}); }
  var sp = function (name, lvl, target, effect, power, element, desc, extra) { return Object.assign({ name: name, lvl: lvl, target: target, effect: effect, power: power, element: element, desc: desc }, extra || {}); };

  tal('fire', 'Fire Talisman', 800, [
    sp('Ember Shot', 1, 'enemy1', 'damage', 55, 'fire', 'Fire strikes one enemy.'),
    sp('Burning Field', 2, 'enemyAll', 'damage', 80, 'fire', 'Flames sweep all enemies.'),
    sp('Blazing Lotus', 3, 'enemyAll', 'damage', 150, 'fire', 'A lotus of fire blooms among the enemy.'),
    sp('Red Phoenix', 4, 'enemyAll', 'damage', 280, 'fire', 'The Vermilion Bird descends.', { screen: true })
  ], 'Ancient fire charm.');
  tal('water', 'Water Talisman', 800, [
    sp('Gentle Rain', 1, 'ally1', 'heal', 90, 'water', 'Restores one ally.'),
    sp('Timely Rain', 2, 'allyAll', 'heal', 110, 'water', 'Restores the whole party.'),
    sp('Clear Spring', 3, 'allyAll', 'cure', 140, 'water', 'Cures ailments and restores the party.'),
    sp('Spring Tide', 4, 'allyKO', 'revive', 1, 'water', 'Revives a fallen ally completely.')
  ], 'Healing water charm.');
  tal('wind', 'Wind Talisman', 800, [
    sp('Cutting Gale', 1, 'enemy1', 'damage', 50, 'wind', 'A blade of wind.'),
    sp('Sleeping Mist', 2, 'enemyAll', 'status', 0, 'wind', 'Puts enemies to sleep.', { status: 'sleep', statusChance: 0.55 }),
    sp('Whirlwind', 3, 'enemyAll', 'damage', 135, 'wind', 'A whirlwind tears through the enemy.'),
    sp('Breath of Heaven', 4, 'allyAll', 'heal', 300, 'wind', 'A sacred wind restores the party.')
  ], 'Wind charm.');
  tal('thunder', 'Five Thunders', 0, [
    sp('Thunderclap', 1, 'enemy1', 'damage', 70, 'thunder', 'Lightning strikes one enemy.'),
    sp('Thunder Spear', 2, 'enemy1', 'damage', 170, 'thunder', 'A spear of lightning.'),
    sp('Five Thunders', 3, 'enemyAll', 'damage', 170, 'thunder', 'The Five Thunders of Heaven\'s True Law.', { screen: true }),
    sp('Wrath of Heaven', 4, 'enemyAll', 'damage', 330, 'thunder', 'Heaven itself answers the rite.', { screen: true })
  ], 'Luo Zhenren\'s Five Thunders rite, taught to Gongsun Sheng.', { fixed: true });
  tal('earth', 'Earth Talisman', 800, [
    sp('Stone Skin', 1, 'ally1', 'buff', 0, 'earth', 'Hardens one ally\'s defence.', { status: 'defUp' }),
    sp('Mountain Ward', 2, 'allyAll', 'buff', 0, 'earth', 'Raises the party\'s defence.', { status: 'defUp' }),
    sp('Landslide', 3, 'enemyAll', 'damage', 140, 'earth', 'Rocks fall on the enemy.'),
    sp('Shaking Earth', 4, 'enemyAll', 'damage', 260, 'earth', 'The earth itself rises.', { screen: true })
  ], 'Earth charm.');
  tal('march', 'Divine March', 0, [
    sp('Swift Charm', 1, 'self', 'buff', 0, 'wind', 'Dai Zong ties charms to his legs: his attack rises.', { status: 'atkUp', free: true })
  ], 'Dai Zong\'s marching charms.', { fixed: true, passive: { spd: 10 } });
  tal('heavenbook', 'Heavenly Book', 0, [
    sp('Star Gathering', 1, 'allyAll', 'heal', 70, 'magic', 'The stars of the brotherhood shine: restores the party.'),
    sp('Mandate of Heaven', 2, 'allyAll', 'buff', 0, 'magic', 'Raises the whole party\'s attack.', { status: 'atkUp' }),
    sp('Way of Heaven', 3, 'enemyAll', 'damage', 180, 'magic', 'Heaven\'s justice smites the enemy.', { screen: true }),
    sp('Thirty-Six Spirits', 4, 'enemyAll', 'damage', 360, 'magic', 'The thirty-six Heavenly Spirits descend.', { screen: true })
  ], 'Scrolls of the Mysterious Lady of the Ninth Heaven. Song Jiang\'s alone.', { fixed: true, slot: 'head' });
  tal('fury', 'Fury Talisman', 600, null, 'Raises power, lowers defence.', { passive: { pwr: 12, def: -8 } });
  tal('hawk', 'Hawk-Eye Talisman', 600, null, 'Raises accuracy (skill).', { passive: { skl: 15 } });
  tal('turtle', 'Turtle Talisman', 600, null, 'Raises defence.', { passive: { def: 10 } });
  tal('swallow', 'Swallow Talisman', 900, null, 'Raises speed.', { passive: { spd: 12 } });

  // ================= Shops =================
  SH.village = { name: 'Village Store', items: ['bun', 'beef', 'medicine', 'antidote', 'wine', 'cap', 'robe', 'straw'] };
  SH.weizhou = { name: 'Weizhou Market', items: ['bun', 'beef', 'medicine', 'antidote', 'wine', 'cap', 'bandana', 'robe', 'quilted', 'buckler', 'straw'] };
  SH.wutai = { name: 'Wutai Town', items: ['bun', 'medicine', 'antidote', 'wine', 'monkrobe', 'quilted', 'leathercap', 'buckler'] };
  SH.kaifeng = { name: 'Eastern Capital Bazaar', items: ['beef', 'medicine', 'antidote', 'needle', 'wine', 'goodwine', 'soulcharm', 'lime', 'leathercap', 'hairpin', 'quilted', 'leather', 'silkrobe', 'rattan', 'jadering', 'amulet'] };
  SH.kaifeng_t = { name: 'Daoist of the Eastern Capital', items: ['fire', 'water', 'wind', 'earth', 'hawk', 'turtle'] };
  SH.cangzhou = { name: 'Cangzhou Store', items: ['bun', 'beef', 'medicine', 'antidote', 'wine', 'quilted', 'leathercap', 'buckler', 'straw'] };
  SH.daming = { name: 'Daming Market', items: ['beef', 'medicine', 'needle', 'goodwine', 'soulcharm', 'lime', 'tigerwine', 'ironhelm', 'leather', 'lamellar', 'rattan', 'gauntlet', 'amulet'] };
  SH.daming_t = { name: 'Daming Talisman Shop', items: ['fire', 'water', 'wind', 'earth', 'fury', 'hawk', 'turtle', 'swallow'] };
  SH.yuncheng = { name: 'Yuncheng Store', items: ['bun', 'beef', 'medicine', 'antidote', 'wine', 'menghan', 'bandana', 'leathercap', 'quilted', 'leather', 'buckler', 'straw'] };
  SH.liangshan = { name: 'Liangshan Stores', items: ['beef', 'medicine', 'ginseng', 'needle', 'wine', 'goodwine', 'soulcharm', 'menghan', 'lime', 'firepot', 'tigerwine', 'incense'] };
  SH.liangshan_armor = { name: 'Hou Jian\'s Tailor', items: ['ironhelm', 'phoenixhelm', 'hairpin', 'daoistcrown', 'lamellar', 'brigandine', 'daoistrobe', 'silkrobe', 'ironshield', 'rattan', 'jadering', 'legcharm', 'gauntlet', 'beltjade', 'amulet'] };
  SH.liangshan_t = { name: 'Jin Dajian\'s Engraving', items: ['fire', 'water', 'wind', 'earth', 'fury', 'hawk', 'turtle', 'swallow'] };
  SH.jiangzhou = { name: 'Jiangzhou Market', items: ['beef', 'medicine', 'needle', 'goodwine', 'soulcharm', 'firepot', 'ironhelm', 'leather', 'lamellar', 'rattan', 'jadering', 'legcharm'] };
  SH.south = { name: 'Jiangnan Market', items: ['medicine', 'ginseng', 'needle', 'goodwine', 'soulcharm', 'firepot', 'incense', 'phoenixhelm', 'brigandine', 'silkrobe', 'ironshield', 'beltjade'] };
})();
