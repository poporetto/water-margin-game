'use strict';
const assert=require('assert/strict'),{load}=require('./headless');
const sb=load(),W=sb.WM,pending=[];W.S.newGame();sb.Image=function(){Object.defineProperty(this,'src',{set:()=>pending.push(this)});};W.tiles.reloadArt();pending.forEach(i=>i.onload());
function map(rows,events=[]){return{theme:'spring',w:rows[0].length,h:rows.length,def:{events},get(x,y){return x<0||y<0||x>=this.w||y>=this.h?null:rows[y][x];}};}
let m=map(['..........','..........','...t......','..........','..........']);
let l=W.tiles.propLayout(m);assert.equal(l.anchors['3,2'].w,2);assert(W.tiles.solidAt(m,4,2));assert(!W.tiles.solidAt(m,5,2));assert(!W.tiles.solidAt(m,4,1),'space above table remains walkable');
m=map(['..........','..........','...t......','..........','..........'],[{x:5,y:2}]);l=W.tiles.propLayout(m);assert.equal(l.anchors['3,2'].x,2,'expand away from interaction approach');assert(!W.tiles.solidAt(m,4,2));
m=map(['..........','..........','...kk.....','...kk.....','..........']);l=W.tiles.propLayout(m);assert.equal(Object.keys(l.anchors).length,1);assert.equal(Object.keys(l.occupied).length,4);
m=map(['..........','..........','...V......','..........','..........']);l=W.tiles.propLayout(m);assert.equal(l.anchors['3,2'].w,3);assert.equal(Object.keys(l.occupied).length,6);
m=map(['WWWWWWW','WnntnnW','WWnnWWW','WWnnWWW']);l=W.tiles.propLayout(m);assert(!W.tiles.solidAt(m,2,2),'corridor preserved');
m.theme='snow';assert.equal(W.tiles.propLayout(m).anchors['3,1'].w,2,'winter furniture retains its drawn footprint');assert(!W.tiles.solidAt(m,2,2),'winter furniture preserves corridor');
const winterTable=W.TILE_ART.tiles['t@snow'];delete W.TILE_ART.tiles['t@snow'];
const unloaded=map(['.......','...t...','.......']);unloaded.theme='snow';
assert.equal(Object.keys(W.tiles.propLayout(unloaded).occupied).length,0,'missing art does not retain expanded invisible blockers');W.TILE_ART.tiles['t@snow']=winterTable;
m=map(['..........','..........','..........','...b......','..........']);
l=W.tiles.propLayout(m);assert.equal(l.anchors['3,3'].w,2);assert(W.tiles.solidAt(m,4,3));assert(!W.tiles.solidAt(m,4,2),'bamboo canopy does not block the ground above');
for(const theme of ['spring','autumn','snow']){m.theme=theme;assert.equal(W.TILE_ART.tiles['b@'+theme].object.h,64);assert.equal(W.tiles.propLayout(m).anchors['3,3'].w,2);}
console.log('PASS: shared render/collision footprint, 2-wide table, protected event access, 2x2 bed, 3x2 tent, corridor and seasonal fallback.');
