'use strict';
const assert=require('assert/strict'),sharp=require('sharp'),{load}=require('./headless');
(async()=>{
 // Exported furniture must contain one connected silhouette, not pieces of adjacent source rows.
 for(const n of ['table','tea-table','counter','storage-jar','incense-altar']){const{data,info}=await sharp('assets/tiles/32/objects/'+n+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});const seen=new Set(),parts=[];for(let i=0;i<info.width*info.height;i++){if(!data[i*4+3]||seen.has(i))continue;const q=[i];seen.add(i);for(let j=0;j<q.length;j++){const x=q[j]%info.width,y=q[j]/info.width|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,k=yy*info.width+xx;if(xx<0||yy<0||xx>=info.width||yy>=info.height||seen.has(k)||!data[k*4+3])continue;seen.add(k);q.push(k);}}parts.push(q.length);}assert.equal(parts.length,1,n+' no detached stains');}
 const sb=load(),W=sb.WM,imgs=[],draws=[];W.S.newGame();sb.Image=function(){Object.defineProperty(this,'src',{set:s=>{this.path=s;imgs.push(this);}});};W.tiles.reloadArt();imgs.forEach(i=>i.onload());
 const ctx=new Proxy({drawImage:(...a)=>draws.push(a)},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 const m={id:'test',theme:'summer',interior:true,def:{},w:4,h:1,get(x,y){return y===0?'q00q'[x]||null:null;}};
 for(let x=1;x<=2;x++)W.tiles.drawTall(ctx,x*16,0,x,0,W.tiles.THEMES.summer,m,'0');assert.equal(draws.length,1,'one seat per paired throne');assert.equal(draws[0][5],16,'seat stays at official position');assert.equal(draws[0][7],32,'seat spans two tiles');assert(draws[0][0].path.endsWith('governor-chair-refined.png'));
 const d=W.data.maps.demonhall,rows=d.rows,dm={...m,id:'demonhall',def:d,w:15,h:rows.length,get(x,y){return rows[y]?.[x]??null;}};draws.length=0;for(let x=7;x<=8;x++)W.tiles.drawTall(ctx,x*16,48,x,3,W.tiles.THEMES.summer,dm,'Q');assert.equal(draws.length,1);assert.equal(draws[0][7],32);assert.equal(draws[0][8],48);assert(W.tiles.solidAt(dm,7,3)&&W.tiles.solidAt(dm,8,3));assert(!W.tiles.solidAt(dm,7,4));const events=W.data.events.demonhall;assert.equal(events.find(e=>e.id==='tablet').w,2);
 console.log('PASS: clean connected furniture silhouettes, one official seat, 2x3 tablet with two-wide collision and interaction.');
})().catch(e=>{console.error(e);process.exitCode=1;});
