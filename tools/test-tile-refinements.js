'use strict';
const assert=require('assert/strict'),{load}=require('./headless');
const sb=load(),W=sb.WM,pending=[],draws=[];W.S.newGame();
sb.Image=function(){Object.defineProperty(this,'src',{set:s=>{this.path=s;pending.push(this);}});};W.tiles.reloadArt();pending.forEach(i=>i.onload());
const ctx=new Proxy({drawImage:(...a)=>draws.push(a)},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>(t[k]=v,true)});
function map(rows){return{theme:'spring',interior:true,def:{},w:rows[0].length,h:rows.length,get(x,y){return rows[y]?.[x]??null;}};}
let m=map(['nnnnnnnn','nnnnnnnn','nccccccn','nnnnnnnn']);for(let x=1;x<=6;x++)W.tiles.drawTall(ctx,x*16,32,x,2,W.tiles.THEMES.spring,m,'c');
assert.equal(draws.length,6);assert(draws.every(d=>d[0].path.endsWith('counter-refined.png')),'one continuous counter');assert.equal(Object.keys(W.tiles.propLayout(m).occupied).length,0,'counter uses authored solid run');for(let x=1;x<=6;x++)assert(W.tiles.solidAt(m,x,2));assert(!W.tiles.solidAt(m,1,3));
draws.length=0;m=map(['nnnnnn','nnnnnn','nccnnn','nnnnnn']);W.tiles.drawTall(ctx,16,32,1,2,W.tiles.THEMES.spring,m,'c');assert(draws.some(d=>d[0].path.endsWith('objects.png')),'small counter retained');
let censers=0,statues=0;for(const[id,d]of Object.entries(W.data.maps)){const rows=typeof d.rows==='function'?d.rows():d.rows;if(!Array.isArray(rows))continue;const m=Object.assign(map(rows),{id,def:d,theme:d.theme||'spring',interior:d.interior,w:Math.max(...rows.map(r=>r.length))});for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if('15'.includes(m.get(x,y))&&m.get(x-1,y)!==m.get(x,y)){statues++;const a=W.tiles.propLayout(m).anchors[x+','+y];assert.equal(a.w,5,id+' full pedestal footprint');}else if(m.get(x,y)==='3'){censers++;const a=W.tiles.propLayout(m).anchors[x+','+y];assert.equal(a.w,2,id);assert.equal(a.h,2,id);for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)assert(W.tiles.solidAt(m,a.x+dx,a.y+dy));}}
assert.equal(censers,6);assert.equal(statues,7);
assert.equal(W.TILE_ART.tiles['1@spring'].sheet,'buddhistStatues');assert.equal(W.TILE_ART.tiles['5@spring'].sheet,'taoistStatues');assert.equal(W.TILE_ART.tiles['6@spring'].sheet,'objects');assert.equal(W.TILE_ART.tiles['7@spring'].sheet,'objects');assert(W.TILE_ART.tiles['6@spring'].object.pedestal);assert.equal(W.TILE_ART.tiles['2@spring'].object.at[0],4);assert.equal(W.TILE_ART.tiles['8@spring'].object.at[0],24);
console.log('PASS: joined counters, retained small furniture, six full 2x2 censer boundaries, distinct Buddhist/Taoist statues and original altar identities.');
