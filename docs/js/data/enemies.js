// Enemies and troop formations. Stats scale from level; chapter files add their own bosses.
'use strict';
(function () {
  var E = WM.data.enemies, T = WM.data.troops;
  // E(id, name, lv, sprite, mods)
  WM.enemy = function (id, name, lv, sprite, m) {
    m = m || {};
    var hp = Math.round((20 + lv * 12) * (m.hp || 1));
    E[id] = {
      id: id, name: name, lv: lv, sprite: sprite,
      hp: m.hpAbs || hp,
      atk: Math.round((8 + lv * 4.1) * (m.atk || 1)),
      dfs: Math.round((8 + lv * 2.6) * (m.dfs || 1)),
      spd: Math.round((8 + lv * 1.6) * (m.spd || 1)),
      skl: Math.round((10 + lv * 1.8) * (m.skl || 1)),
      mgc: Math.round((6 + lv * 1.5) * (m.mgc || 1)),
      exp: m.exp || 100, gold: m.gold != null ? m.gold : Math.round(6 + lv * 4),
      drops: m.drops || [], skills: m.skills || [], range: m.range || 'S', weak: m.weak, resist: m.resist,
      boss: !!m.boss, fx: m.fx
    };
    return E[id];
  };
  var en = WM.enemy;
  var hum = function (look) { return { kind: 'human', look: look }; };
  var beast = function (art, params) { return { kind: 'beast', art: art, params: params }; };
  WM.hum = hum; WM.beast = beast;

  // looks reused by many enemies
  var L = WM.enemyLooks = {
    bandit: { skin: '#c8905e', hairStyle: 'headband', band: '#7a2a1a', body: '#5a4a3a', trim: '#3a2a1a', beard: 'stubble', weapon: 'dao' },
    bandit2: { skin: '#b8804e', hairStyle: 'wild', body: '#4a3a2a', trim: '#7a2a1a', beard: 'full', weapon: 'axes', build: 'big' },
    banditArcher: { skin: '#c8905e', hairStyle: 'headband', band: '#3a5a2a', body: '#4a5a3a', trim: '#3a2a1a', weapon: 'bow' },
    soldier: { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#6a6a72', tassel: '#c8302a', body: '#8a2a2a', trim: '#c8b890', weapon: 'spear' },
    archer: { skin: '#c8905e', hairStyle: 'helmet', helmColor: '#6a6a72', tassel: '#c8302a', body: '#8a3a2a', trim: '#c8b890', weapon: 'bow' },
    officer: { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#8a7a3a', tassel: '#c8302a', body: '#6a2a2a', trim: '#d8b36a', weapon: 'saber', beard: 'short' },
    constable: { skin: '#c8905e', hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#c8302a', weapon: 'dao' },
    thug: { skin: '#d8a070', hairStyle: 'topknot', body: '#6a5a6a', trim: '#3a2a3a', chest: true, weapon: 'fists' },
    monkThug: { skin: '#d8a070', hairStyle: 'bald', body: '#5a3a2a', trim: '#8a6a3a', weapon: 'staff' },
    liao: { skin: '#d8a070', hairStyle: 'helmet', helmColor: '#5a4a3a', tassel: '#2a2a2a', body: '#3a5a6a', trim: '#c8b890', weapon: 'spear', beard: 'full' },
    liaoArcher: { skin: '#d8a070', hairStyle: 'hat', hatColor: '#5a4a3a', body: '#4a6a5a', trim: '#c8b890', weapon: 'bow', beard: 'short' },
    fangla: { skin: '#c8905e', hairStyle: 'headband', band: '#c8a020', body: '#5a2a5a', trim: '#c8a020', weapon: 'saber' },
    sorcerer: { skin: '#e8b48a', hairStyle: 'daoist', crown: '#3a3a3a', body: '#3a2a4a', trim: '#8a2a2a', weapon: 'sword', beard: 'long' }
  };

  // ---- beasts & spirits ----
  en('wolf', 'Grey Wolf', 2, beast('wolf'), { spd: 1.3, atk: 0.9, exp: 70, gold: 0, fx: 'claw', drops: [['bun', 0.1]] });
  en('wolf2', 'Mountain Wolf', 9, beast('wolf', { body: '#5a5a62' }), { spd: 1.3, atk: 0.95, exp: 90, gold: 0, fx: 'claw' });
  en('boar', 'Wild Boar', 3, beast('boar'), { hp: 1.3, atk: 1.1, spd: 0.8, exp: 80, gold: 0, fx: 'blunt', drops: [['beef', 0.25]] });
  en('boar2', 'Tusked Boar', 14, beast('boar'), { hp: 1.3, atk: 1.1, spd: 0.8, exp: 90, gold: 0, fx: 'blunt', drops: [['beef', 0.3]] });
  en('snake', 'Mountain Viper', 2, beast('snake'), { hp: 0.8, spd: 1.2, exp: 70, gold: 0, fx: 'claw', skills: [{ name: 'Venom Fang', chance: 0.3, type: 'phys', power: 1, status: 'poison', statusChance: 0.6, fx: 'claw' }] });
  en('snake2', 'Green Python', 12, beast('snake', { body: '#2a7a3a' }), { hp: 1.2, spd: 1.1, exp: 90, gold: 0, fx: 'claw', skills: [{ name: 'Constrict', chance: 0.25, type: 'phys', power: 1.4 }] });
  en('eagle', 'Mountain Hawk', 6, beast('eagle'), { hp: 0.8, spd: 1.5, exp: 80, gold: 0, fx: 'claw', range: 'L' });
  en('bear', 'Black Bear', 10, beast('bear'), { hp: 1.6, atk: 1.2, spd: 0.7, exp: 110, gold: 0, fx: 'claw', drops: [['medicine', 0.2]] });
  en('monkey', 'Gibbon', 7, beast('monkey'), { hp: 0.8, spd: 1.6, exp: 70, gold: 12, fx: 'claw', drops: [['bun', 0.3]] });
  en('bat', 'Cave Bat', 5, beast('bat'), { hp: 0.6, spd: 1.6, exp: 60, gold: 0, fx: 'claw', range: 'M' });
  en('ghostfire', 'Wandering Ghost-Fire', 4, beast('spirit'), { hp: 0.8, mgc: 1.4, exp: 90, gold: 5, weak: 'water', skills: [{ name: 'Ghost Flame', chance: 0.5, type: 'magic', power: 22, element: 'fire', fx: 'fire' }] });
  en('crocodile', 'River Crocodile', 16, beast('crocodile'), { hp: 1.4, atk: 1.15, spd: 0.8, exp: 100, gold: 0, fx: 'claw' });
  en('toad', 'Marsh Toad', 10, beast('toad'), { hp: 1.1, exp: 80, gold: 0, fx: 'blunt', skills: [{ name: 'Poison Spray', chance: 0.3, type: 'magic', power: 20, status: 'poison', statusChance: 0.5, fx: 'water' }] });
  en('tiger', 'Tiger', 8, beast('tiger'), { hp: 2.2, atk: 1.25, spd: 1.2, exp: 160, gold: 0, fx: 'claw' });

  // ---- road & bandit enemies ----
  en('bandit', 'Mountain Bandit', 1, hum(L.bandit), { exp: 80, drops: [['bun', 0.2]] });
  en('bandit2', 'Bandit Brute', 3, hum(L.bandit2), { hp: 1.3, atk: 1.1, spd: 0.85, exp: 90, drops: [['beef', 0.15]] });
  en('banditArcher', 'Bandit Archer', 2, hum(L.banditArcher), { hp: 0.8, range: 'L', fx: 'arrow', exp: 80, drops: [['bun', 0.2]] });
  en('thug', 'Street Tough', 2, hum(L.thug), { hp: 0.9, exp: 70, gold: 20, fx: 'blunt' });
  en('roadbandit', 'Highwayman', 8, hum(L.bandit), { exp: 90, drops: [['beef', 0.2], ['medicine', 0.08]] });
  en('roadbrute', 'Highway Brute', 10, hum(L.bandit2), { hp: 1.3, atk: 1.1, spd: 0.85, exp: 95, drops: [['beef', 0.2]] });
  en('roadarcher', 'Highway Archer', 9, hum(L.banditArcher), { hp: 0.8, range: 'L', fx: 'arrow', exp: 90 });
  en('soldier', 'Government Soldier', 6, hum(L.soldier), { exp: 90, range: 'M', drops: [['medicine', 0.1]] });
  en('archer', 'Government Archer', 6, hum(L.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 90 });
  en('constable', 'Yamen Runner', 5, hum(L.constable), { hp: 0.9, exp: 80, drops: [['bun', 0.2]] });
  en('soldier2', 'Garrison Soldier', 14, hum(L.soldier), { range: 'M', exp: 95, drops: [['medicine', 0.12]] });
  en('archer2', 'Garrison Archer', 14, hum(L.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 95 });
  en('officer2', 'Garrison Officer', 16, hum(L.officer), { hp: 1.5, atk: 1.1, exp: 120, drops: [['medicine', 0.3]] });
  en('soldier3', 'Imperial Soldier', 24, hum(L.soldier), { range: 'M', exp: 100, drops: [['medicine', 0.15]] });
  en('archer3', 'Imperial Archer', 24, hum(L.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 100 });
  en('officer3', 'Imperial Officer', 26, hum(L.officer), { hp: 1.5, atk: 1.1, exp: 120, drops: [['ginseng', 0.1]] });
  en('soldier4', 'Palace Guard', 38, hum(L.soldier), { range: 'M', exp: 100, drops: [['medicine', 0.2]] });
  en('archer4', 'Palace Archer', 38, hum(L.archer), { hp: 0.8, range: 'L', fx: 'arrow', exp: 100 });
  en('officer4', 'Guard Commander', 40, hum(L.officer), { hp: 1.5, atk: 1.1, exp: 130, drops: [['ginseng', 0.15]] });

  // ---- troops used by random encounters ----
  T.road1 = ['bandit', 'bandit'];
  T.road2 = ['bandit', 'banditArcher'];
  T.road3 = ['wolf', 'wolf'];
  T.road4 = ['bandit2', 'bandit', 'banditArcher'];
  T.wild1 = ['boar'];
  T.wild2 = ['snake', 'snake'];
  T.wild3 = ['wolf', 'wolf', 'wolf'];
})();
