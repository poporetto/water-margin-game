'use strict';
const sharp=require('sharp'),fs=require('fs');
(async()=>{const names=['forest','town','field','plains','snow','river','marsh','night','palace','interior','temple','mountain','cave','fire','ridge'];for(const name of names)await sharp('art/generated-battle-backgrounds-v1/'+name+'.png').resize(1920,1440,{fit:'fill'}).flatten({background:'#695b3f'}).png().toFile('assets/backgrounds/'+name+'.png');fs.writeFileSync('assets/backgrounds/index.json',JSON.stringify({width:1920,height:1440,era:'Northern Song, circa 1120',completed:names,pending:[]},null,2));})();
