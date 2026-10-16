'use strict';
const assert=require('assert/strict'),{load}=require('./headless');
const sb=load(),W=sb.WM,pending=[];W.S.newGame();sb.Image=function(){Object.defineProperty(this,'src',{set:()=>pending.push(this)});};W.tiles.reloadArt();pending.forEach(i=>i.onload());W.data.locations={};
function map(rows,exits=[]){return{theme:'world',w:rows[0].length,h:rows.length,def:{world:true,exits},get(x,y){return x<0||y<0||x>=this.w||y>=this.h?null:rows[y][x];}};}
let m=map(['..........','..........','..MMM.....','..MMM.....','..........','..........']);let l=W.tiles.worldTerrainLayout(m);assert.equal(l.items.length,1);assert.equal(l.items[0].w,3);assert.equal(l.items[0].h,2);
m=map(['..........','..........','..b.......','..........','..........','..........']);l=W.tiles.worldTerrainLayout(m);assert.equal(l.items[0].w,4);assert.equal(l.items[0].h,3);assert(W.tiles.solidAt(m,5,4));assert(!W.tiles.solidAt(m,6,4));
m=map(['..........','..........','..T:......','...:......','..........','..........']);l=W.tiles.worldTerrainLayout(m);assert(!W.tiles.solidAt(m,3,2),'road remains open');assert(!W.tiles.solidAt(m,3,3));
m=map(['..........','..........','..T.......','..........','..........','..........'],[{x:4,y:3}]);l=W.tiles.worldTerrainLayout(m);assert(!W.tiles.solidAt(m,3,3),'exit approach protected');
m=map(['WWWWWWWW','W.T....W','WWW.WWWW','W......W','WWWWWWWW']);l=W.tiles.worldTerrainLayout(m);assert(!W.tiles.solidAt(m,3,2),'narrow passage remains open');
m=map(['..........','..........','..T.......','..........','..........','..........']);m.propEntry={x:4,y:3};l=W.tiles.worldTerrainLayout(m);assert(!W.tiles.solidAt(m,4,3),'arrival remains open');
const before=W.tiles.worldTerrainLayout(m);W.tiles.reloadArt();assert.equal(W.tiles.worldTerrainLayout(m).items.length,0,'no invisible expanded boundaries before images load');
console.log('PASS: merged 3x2 mountains, expanded forest collision, roads, exits, corridor, arrival and unloaded-art fallback.');
