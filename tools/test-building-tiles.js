'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),sharp=require('sharp');
const{load,ROOT}=require('./headless');
async function main(){
 for(const[name,w,h]of[['roofs',192,96],['walls',128,64],['gate',64,96]]){
  const{data,info}=await sharp(path.join(ROOT,'assets/tiles/building-'+name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,w);assert.equal(info.height,h);
  for(let y=0;y<h;y+=16)for(let x=0;x<w;x+=16){const colors=new Set();for(let dy=0;dy<16;dy++)for(let dx=0;dx<16;dx++){const p=((y+dy)*w+x+dx)*4;assert(data[p+3]===0||data[p+3]===255,'binary alpha');if(data[p+3])colors.add(data.subarray(p,p+3).toString('hex'));}assert(colors.size<=16,'16-colour tile limit');}
  if(name==='gate')for(let y=29;y<45;y++)for(let x=16;x<48;x++){assert.equal(data[(y*64+x)*4+3],0,'open passage alpha');assert.equal(data[((48+y)*64+x)*4+3],255,'closed passage filled');}
 }
 const sb=load(),WM=sb.WM,T=WM.tiles,pending=[],draws=[];
 WM.state={flags:{}};
 sb.Image=function(){Object.defineProperty(this,'src',{set:src=>{this.srcPath=src;pending.push(this);}});};
 T.reloadArt();pending.forEach(img=>img.onload());assert.equal(T.artStatus().waiting,0);
 const ctx=new Proxy({drawImage:(...args)=>draws.push(args)},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>(t[k]=v,true)});
 WM.util.makeCanvas=(width,height)=>({width,height,getContext:()=>ctx});
 function map(rows,opt={}){return Object.assign({id:'test',w:rows[0].length,h:rows.length,theme:'spring',def:{},get(x,y){return x<0||y<0||x>=this.w||y>=this.h?null:rows[y][x];}},opt);}
 let m=map(['^^^^^','^^^^^','WWWWW','WODOW']);T.bake(m);
 const roof=draws.filter(d=>d[0].srcPath.endsWith('building-roofs.png'));
 assert.equal(roof.length,10);assert.deepEqual(roof.slice(0,5).map(d=>d[1]),[0,32,32,32,64],'left / repeating middle / right');
 assert(roof.slice(0,5).every(d=>d[2]===0));assert(roof.slice(5).every(d=>d[2]===64),'eave row');
 draws.length=0;T.drawTall(ctx,16,16,1,1,T.THEMES.spring,m,'^');assert.equal(draws[0][4],12,'six-pixel overhang');assert.equal(draws[0][6],32);
 for(const n of [1,2,4,6]){
  m=map(['#'.repeat(n+2),'#'+'G'.repeat(n)+'#','#'+'G'.repeat(n)+'#']);
  draws.length=0;T.drawTall(ctx,16,32,1,2,T.THEMES.spring,m,'G');assert.equal(draws.length,n+2);assert.equal(draws[0][5],0,'left pier outside G');assert.equal(draws.at(-1)[5],16+n*16,'right pier outside G');
  assert(draws.every(d=>d[2]===0),'open gate source');
  WM.state.flags['shut:test']=true;draws.length=0;T.drawTall(ctx,16,32,1,2,T.THEMES.spring,m,'G');assert(draws.every(d=>d[2]===96),'closed gate source');delete WM.state.flags['shut:test'];
  draws.length=0;T.drawTall(ctx,16,16,1,1,T.THEMES.spring,m,'G');assert.equal(draws.length,0,'multi-row gate drawn once');
 }
 m=map(['UGGU']);draws.length=0;T.drawTall(ctx,16,0,1,0,T.THEMES.spring,m,'G');assert.equal(draws.filter(d=>d[0].srcPath?.endsWith('building-gate.png')).length,0,'guardian temple gate retains bespoke drawing');
 for(const opt of [{interior:true},{theme:'world',def:{world:true}}]){draws.length=0;T.bake(map(['WDW'],opt));assert(!draws.some(d=>/building-/.test(d[0].srcPath||'')),'interior and world fallback');}
 for(const theme of ['spring','snow']){
  draws.length=0;T.bake(map(['ZZZ','RRR','RDR'],{theme}));
  assert(draws.some(d=>/building-walls/.test(d[0].srcPath||'')&&d[1]===64&&d[2]===96),'shrine uses pale facade');
  draws.length=0;T.bake(map(['vvv','RRR','RDR'],{theme}));
  assert(draws.some(d=>/building-walls/.test(d[0].srcPath||'')&&d[1]===224&&d[2]===0),'official hall retains red facade');
 }
 assert(T.hasTall('#',map(['#'])),'battlements participate in tall pass');
 assert(!T.solid('D')&&!T.solid('G'));for(const ch of ['d','W','R','#','F','p','^','z','v','Z'])assert(T.solid(ch),'collision unchanged '+ch);
 const index=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/tiles/building-index.json')));assert.equal(index.walls.length,32);assert.equal(index.roofs.length,4);
 console.log('PASS: native dimensions, hard alpha, palettes, roof joins/overhangs, 1/2/4/6-wide gates, closed state, guardian fallback, interior/world fallback and collision flags');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
