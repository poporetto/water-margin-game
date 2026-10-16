'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {load,ROOT} = require('./headless');
async function main(){
 const D=process.env.ART_SCALE==='2'?2:1,S=16*D,dir='assets/tiles'+(D===2?'/32':'');
 const index=JSON.parse(fs.readFileSync(path.join(ROOT,dir+'/starter-index.json')));
 assert.equal(new Set(index.canonicalWaterMasks).size,47);
 const images={};
 for(const [name,w,h] of [['ground',128,64],['trees',64,48],['water',128,288],['deep-water',128,288]]){
  const {data,info}=await sharp(path.join(ROOT,dir,name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,w*D,name+' width');assert.equal(info.height,h*D,name+' height');
  for(let i=3;i<data.length;i+=4)assert(data[i]===0||data[i]===255,name+' must have hard alpha');
  images[name]={data,w:w*D,h:h*D};
 }
 function cell(name,xy){const im=images[name],data=Buffer.alloc(S*S*4);for(let y=0;y<S;y++)im.data.copy(data,y*S*4,((xy[1]*S+y)*im.w+xy[0]*S)*4,((xy[1]*S+y)*im.w+xy[0]*S+S)*4);return data;}
 function pixel(b,x,y){return b.subarray((y*S+x)*4,(y*S+x+1)*4);}
 for(const name of ['ground','water','deep-water']){
  const im=images[name];
  for(let y=0;y<im.h/S;y++)for(let x=0;x<im.w/S;x++){
   const b=cell(name,[x,y]),colors=new Set();for(let i=0;i<b.length;i+=4)if(b[i+3])colors.add(b.subarray(i,i+3).toString('hex'));
   assert(colors.size<=16,name+' palette limit');
  }
 }
 for(const a of [0,1,2,3,4,5,6,7])for(const b of [0,1,2,3,4,5,6,7])for(let i=0;i<S;i++){
  assert.deepEqual(pixel(cell('ground',[a,0]),S-1,i),pixel(cell('ground',[b,0]),0,i),'grass horizontal seam');
  assert.deepEqual(pixel(cell('ground',[a,0]),i,S-1),pixel(cell('ground',[b,0]),i,0),'grass vertical seam');
 }
 // Exhaust all possible shared neighbourhoods of two adjacent water cells.
 for(const name of ['water','deep-water'])for(const vertical of [false,true])for(let bits=0;bits<1024;bits++){
  const grid=Array.from({length:3},()=>Array(4).fill(false));grid[1][1]=grid[1][2]=true;let n=0;
  for(let y=0;y<3;y++)for(let x=0;x<4;x++)if(y!==1||(x!==1&&x!==2))grid[y][x]=!!(bits&(1<<n++));
  function mask(cx){let m=0;const dirs=vertical?[[1,0,1],[0,1,2],[-1,0,4],[0,-1,8],[1,1,16],[-1,1,32],[-1,-1,64],[1,-1,128]]:[[0,-1,1],[1,0,2],[0,1,4],[-1,0,8],[1,-1,16],[1,1,32],[-1,1,64],[-1,-1,128]];for(const [dx,dy,bit] of dirs)if(grid[1+dy][cx+dx])m|=bit;return m;}
  for(let f=0;f<3;f++){
   const ac=index.waterCells[mask(1)],bc=index.waterCells[mask(2)],a=cell(name,[ac[0],ac[1]+6*f]),b=cell(name,[bc[0],bc[1]+6*f]);
   for(let i=0;i<S;i++)assert.deepEqual(vertical?pixel(a,i,0):pixel(a,S-1,i),vertical?pixel(b,i,S-1):pixel(b,0,i),name+' shoreline seam');
  }
 }
 for(const tree of index.trees){
  let bottom=false,top=false;const colors=new Set();
  for(let y=0;y<48*D;y++)for(let x=0;x<S;x++){const i=(y*64*D+tree.cell[0]*S+x)*4,a=images.trees.data[i+3];if(y>=tree.height)assert.equal(a,0);if(a){if(y===tree.height-1)bottom=true;if(y===0)top=true;colors.add(images.trees.data.subarray(i,i+3).toString('hex'));}}
  assert(bottom&&top,'tree uses the full requested height');assert(colors.size<=16,'tree palette');
 }
 const sb=load(),WM=sb.WM,pending=[];
 sb.Image=function(){Object.defineProperty(this,'src',{set:src=>{this.srcPath=src;pending.push(this);}});};
 WM.tiles.reloadArt();pending.forEach(img=>img.onload());
 assert.equal(WM.tiles.artStatus().waiting,0);assert.equal(WM.tiles.artStatus().sheets.length,Object.keys(WM.TILE_ART.sheets).length);
 const map={w:3,h:3,theme:'spring',def:{},get:(x,y)=>x===1&&y===1?'~':'.'};
 const draws=[],ctx={drawImage:(...a)=>draws.push(a)};
 WM.tiles.animateArt(ctx,map,0,0,0);const first=draws[0];draws.length=0;WM.tiles.animateArt(ctx,map,0,0,.4);assert.equal(draws[0][2]-first[2],192,'shoreline animation advances one frame block');
 draws.length=0;WM.tiles.drawTall(ctx,32,64,2,4,WM.tiles.THEMES.spring,map,'P');assert.equal(draws[0][0].srcPath,'assets/tiles/32/trees.png');assert.equal(draws[0][6],42,'pine bottom aligns to y+16');assert.equal(draws[0][4],76);
 for(const theme of ['autumn','snow','world'])assert(WM.TILE_ART.tiles['.@'+theme],'seasonal ground is available');
 console.log('PASS: dimensions, binary alpha, palettes, grass joins, 12,288 shoreline-neighbour/frame cases, tree bounds, loading, animation and tall alignment');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
