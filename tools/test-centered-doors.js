'use strict';
const assert=require('assert/strict'),fs=require('fs'),{load}=require('./headless'),W=load().WM;let buildings=0,links=0;
for(const[id,moves]of Object.entries(W.centeredDoorMoves)){const d=W.data.maps[id];for(const m of moves){buildings++;for(let x=m.x;x<m.x+m.w;x++)assert('Dd'.includes(d.rows[m.y][x]),id+' centered door');assert(!W.tiles.solid(d.rows[m.y+1]?.[m.x]),id+' approach');const p=W.centeredEntry(id,m.oldX,m.y+1);assert.equal(p.x,m.x);}
 for(const e of d.exits||[]){const m=moves.find(m=>e.y===m.y&&e.x===m.x);if(m){links++;assert.equal(e.w,m.w,'whole centered doorway triggers entrance');}}
}
fs.mkdirSync('output/part2',{recursive:true});fs.writeFileSync('output/part2/centered-entrances.json',JSON.stringify({buildings,links,maps:W.centeredDoorMoves},null,2));console.log('PASS: '+buildings+' centered exterior doors, '+links+' entrance links, approach cells and old-coordinate migration.');
