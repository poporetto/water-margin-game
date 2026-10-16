'use strict';
const fs=require('fs'),sharp=require('sharp');
const names=['sand-1','sand-2','millet-1','millet-2','scorched-1','scorched-2','stone-steps','bridge-horizontal-planks','wood-floor-1','wood-floor-2','wood-floor-3','red-carpet','stone-floor-1','stone-floor-2','bridge-vertical-planks','interior-wall'];
(async()=>{
 const src='art/generated-surfaces-v1/surfaces-source.png',meta=await sharp(src).metadata(),tiles=[];
 for(let i=0;i<16;i++)tiles.push(await sharp(src).extract({left:Math.round((i%4)*meta.width/4),top:Math.round((i/4|0)*meta.height/4),width:Math.floor(meta.width/4),height:Math.floor(meta.height/4)}).resize(32,32,{kernel:'lanczos3'}).ensureAlpha().raw().toBuffer());
 const groups=[[0,1],[2,3],[4,5],[6],[7],[8,9,10],[11],[12,13],[14],[15]];
 // Match variant brightness so random floor choices do not form light/dark checkerboards.
 for(const group of groups){
  const means=group.map(i=>{const sum=[0,0,0];for(let p=0;p<4096;p+=4)for(let c=0;c<3;c++)sum[c]+=tiles[i][p+c];return sum.map(v=>v/1024);});
  const target=[0,1,2].map(c=>means.reduce((n,m)=>n+m[c],0)/means.length);
  group.forEach((i,j)=>{for(let p=0;p<4096;p+=4)for(let c=0;c<3;c++)tiles[i][p+c]=Math.max(0,Math.min(255,Math.round(tiles[i][p+c]+target[c]-means[j][c])));});
 }
 for(const group of groups){
  const joined=Buffer.concat(group.map(i=>tiles[i]));
  const png=await sharp(joined,{raw:{width:32,height:32*group.length,channels:4}}).png({palette:true,colours:16,dither:0}).toBuffer();
  const quant=await sharp(png).ensureAlpha().raw().toBuffer();group.forEach((i,j)=>tiles[i]=Buffer.from(quant.subarray(j*4096,(j+1)*4096)));
  // Matching opposite borders and matching variants. Interiors retain the source texture.
  const ref=Buffer.from(tiles[group[0]]);
  for(const i of group){const b=tiles[i];for(let k=1;k<31;k++){
   for(const x of [0,31])ref.copy(b,(k*32+x)*4,k*32*4,k*32*4+4);
   for(const y of [0,31])ref.copy(b,(y*32+k)*4,k*4,k*4+4);
  }for(const p of [0,31,31*32,1023])ref.copy(b,p*4,0,4);}
 }
 const atlas=Buffer.alloc(128*128*4),dir='assets/tiles/32/surfaces';fs.mkdirSync(dir,{recursive:true});
 for(let i=0;i<16;i++){for(let y=0;y<32;y++)tiles[i].copy(atlas,(((i/4|0)*32+y)*128+(i%4)*32)*4,y*128,(y+1)*128);await sharp(tiles[i],{raw:{width:32,height:32,channels:4}}).png().toFile(dir+'/'+names[i]+'.png');}
 await sharp(atlas,{raw:{width:128,height:128,channels:4}}).png().toFile('assets/tiles/32/surfaces.png');
 fs.writeFileSync('assets/tiles/32/surfaces-index.json',JSON.stringify({tileSize:32,groups,tiles:names.map((name,i)=>({name,cell:[i%4,i/4|0],file:'surfaces/'+name+'.png'}))},null,2)+'\n');console.log('Exported 16 seamless 32px surface tiles.');
})().catch(e=>{console.error(e);process.exitCode=1;});
