// NPC looks. Named story characters use face:true to get a portrait.
'use strict';
(function () {
  WM.data.npcs = WM.data.npcs || {};
  WM.npc = function (id, name, look, o) {
    o = o || {};
    WM.data.npcs[id] = { id: id, name: name, look: look, face: !!o.face, bio: o.bio };
  };
  var SK = { fair: '#f0c49a', light: '#e8b48a', mid: '#d8a070', tan: '#c8905e', dark: '#9a6a48' };

  // ---- generic folk ----
  WM.npc('villager', 'Villager', { skin: SK.tan, hairStyle: 'topknot', body: '#7a6a4a', trim: '#5a4a3a', pants: '#4a3a2a' }, { face: true });
  WM.npc('villager2', 'Villager', { skin: SK.mid, hairStyle: 'headband', band: '#e8e0d0', body: '#5a6a7a', trim: '#e8e0d0' });
  WM.npc('farmer', 'Farmer', { skin: SK.tan, hairStyle: 'hat', hatColor: '#c8b070', body: '#8a7a5a', trim: '#5a4a3a', beard: 'stubble' });
  WM.npc('woman', 'Village Woman', { skin: SK.light, hairStyle: 'woman', body: '#8a5a6a', trim: '#e8d8c0', dress: true });
  WM.npc('woman2', 'Townswoman', { skin: SK.fair, hairStyle: 'woman', body: '#5a7a9a', trim: '#f0e0c0', dress: true, flower: '#e8a0b0' });
  WM.npc('oldman', 'Old Man', { skin: SK.mid, hair: '#d8d8d0', hairStyle: 'topknot', beard: 'long', beardColor: '#e8e8e0', body: '#6a5a4a', trim: '#c8b890' }, { face: true });
  WM.npc('oldwoman', 'Old Woman', { skin: SK.mid, hair: '#c8c8c0', hairStyle: 'woman', body: '#5a4a5a', trim: '#c8b890', dress: true }, { face: true });
  WM.npc('child', 'Child', { skin: SK.light, hairStyle: 'topknot', body: '#c85a4a', trim: '#f0e0c0', build: 'small' });
  WM.npc('merchant', 'Merchant', { skin: SK.fair, hairStyle: 'scarf', band: '#3a2a1a', body: '#8a6a2a', trim: '#d8b36a', beard: 'mustache' }, { face: true });
  WM.npc('shopkeep', 'Shopkeeper', { skin: SK.light, hairStyle: 'scarf', band: '#2a3a2a', body: '#4a6a4a', trim: '#e8e0d0', beard: 'short' }, { face: true });
  WM.npc('waiter', 'Waiter', { skin: SK.light, hairStyle: 'headband', band: '#e8e0d0', body: '#e8e0d0', trim: '#3a3a3a', pants: '#3a3a3a' }, { face: true });
  WM.npc('innkeep', 'Innkeeper', { skin: SK.mid, hairStyle: 'scarf', band: '#5a2a1a', body: '#6a3a2a', trim: '#c8b890', beard: 'mustache', build: 'big' }, { face: true });
  WM.npc('smith', 'Blacksmith', { skin: SK.tan, hairStyle: 'headband', band: '#3a3a3a', body: '#4a3a2a', trim: '#8a6a4a', chest: true, build: 'big', beard: 'short' }, { face: true });
  WM.npc('talismaster', 'Incense Daoist', { skin: SK.fair, hairStyle: 'daoist', crown: '#3a3a3a', body: '#3a3a6a', trim: '#e8e0d0', beard: 'long', beardColor: '#d8d8d0' }, { face: true });
  WM.npc('monk', 'Monk', { skin: SK.light, hairStyle: 'bald', body: '#8a6a3a', trim: '#c89a4a', beads: true }, { face: true });
  WM.npc('daoist', 'Daoist', { skin: SK.light, hairStyle: 'daoist', crown: '#8a7a4a', body: '#4a5a7a', trim: '#e8e0d0', beard: 'short' }, { face: true });
  WM.npc('scholar', 'Scholar', { skin: SK.fair, hairStyle: 'scarf', band: '#1a1a2a', body: '#3a4a6a', trim: '#e8e0d0', beard: 'mustache', build: 'slim' }, { face: true });
  WM.npc('soldier', 'Soldier', { skin: SK.tan, hairStyle: 'helmet', helmColor: '#6a6a72', tassel: '#c8302a', body: '#8a2a2a', trim: '#c8b890', weapon: 'spear' }, { face: true });
  WM.npc('guard', 'Guard', { skin: SK.mid, hairStyle: 'helmet', helmColor: '#5a5a62', tassel: '#2a2a2a', body: '#3a3a5a', trim: '#c8b890', weapon: 'spear' });
  WM.npc('officer', 'Officer', { skin: SK.light, hairStyle: 'futou', body: '#2a3a6a', trim: '#d8b36a', beard: 'short' }, { face: true });
  WM.npc('official', 'Official', { skin: SK.fair, hairStyle: 'futou', body: '#7a1a1a', trim: '#d8b36a', beard: 'long' }, { face: true });
  WM.npc('constable', 'Constable', { skin: SK.tan, hairStyle: 'scarf', band: '#1a1a1a', body: '#2a2a2a', trim: '#c8302a', weapon: 'dao' }, { face: true });
  WM.npc('bandit', 'Bandit', { skin: SK.tan, hairStyle: 'headband', band: '#7a2a1a', body: '#5a4a3a', trim: '#3a2a1a', beard: 'stubble', weapon: 'dao' });
  WM.npc('servant', 'Servant', { skin: SK.light, hairStyle: 'topknot', body: '#5a5a4a', trim: '#e8e0d0' }, { face: true });
  WM.npc('maid', 'Maid', { skin: SK.fair, hairStyle: 'woman', body: '#7a9a7a', trim: '#e8e0d0', dress: true });
  WM.npc('boatman', 'Boatman', { skin: SK.tan, hairStyle: 'hat', hatColor: '#a8905a', body: '#5a6a6a', trim: '#4a3a2a', chest: true });
  WM.npc('hunter', 'Hunter', { skin: SK.tan, hairStyle: 'headband', band: '#5a4a2a', body: '#6a5a3a', trim: '#8a6a4a', weapon: 'bow' });
  WM.npc('drunk', 'Drunkard', { skin: '#e0907a', hairStyle: 'wild', hair: '#3a2a1a', body: '#7a6a5a', trim: '#5a4a3a', beard: 'stubble' });
  WM.npc('gambler', 'Gambler', { skin: SK.light, hairStyle: 'headband', band: '#3a3a3a', body: '#6a3a5a', trim: '#d8b36a' });
  WM.npc('outlaw', 'Liangshan Man', { skin: SK.tan, hairStyle: 'headband', band: '#c8302a', body: '#4a4a3a', trim: '#c8302a', weapon: 'spear' }, { face: true });
  WM.npc('outlawW', 'Liangshan Woman', { skin: SK.light, hairStyle: 'woman', body: '#6a3a3a', trim: '#c8302a', dress: true });
  WM.npc('recorder', 'Record Keeper', { skin: SK.fair, hairStyle: 'scarf', band: '#2a2a3a', body: '#4a4a5a', trim: '#e8e0d0', beard: 'long', build: 'slim' }, { face: true });
})();
