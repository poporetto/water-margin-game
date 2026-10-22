const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path');
const root=__dirname;
function ranges(counts){const out=[];let start=null;for(let i=0;i<=counts.length;i++){if(counts[i]&&start===null)start=i;if(!counts[i]&&start!==null){if(i-start>4)out.push([start,i]);start=null;}}return out;}
async function source(file,rows,cols){
 const {data,info}=await sharp(path.join(root,file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const ys=Array(info.height).fill(0);for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>200)ys[y]++;
 const yr=ranges(ys);if(yr.length!==rows)throw Error(`${file}: expected ${rows} rows, found ${yr.length}`);
 const bounds=[];for(let r=0;r<rows;r++){const [y0,y1]=yr[r],xs=Array(info.width).fill(0);for(let y=y0;y<y1;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>200)xs[x]++;const xr=ranges(xs);if(xr.length!==cols)throw Error(`${file} row ${r}: expected ${cols} figures, found ${xr.length}`);for(let c=0;c<cols;c++){const [l,right]=xr[c];let t=y1,b=y0;for(let y=y0;y<y1;y++)for(let x=l;x<right;x++)if(data[(y*info.width+x)*4+3]>200){t=Math.min(t,y);b=Math.max(b,y);}bounds.push({r,c,l,t,w:right-l,h:b-t+1});}}
 return {data,info,bounds};
}
async function frame(src,b,scale,fw=96,fh=128){
 const w=Math.round(b.w*scale),h=Math.round(b.h*scale);if(w>fw||h>fh)throw Error('Sprite exceeds its frame');
 let l=b.l+b.w,r=b.l;for(let y=b.t;y<b.t+b.h*.26;y++)for(let x=b.l;x<b.l+b.w;x++)if(src.data[(y*src.info.width+x)*4+3]>200){l=Math.min(l,x);r=Math.max(r,x);}
 const left=fw===96?Math.max(0,Math.min(fw-w,Math.round(fw/2-((l+r+1)/2-b.l)*scale))):Math.floor((fw-w)/2);
 const pixels=await sharp(src.data,{raw:src.info}).extract({left:b.l,top:b.t,width:b.w,height:b.h}).resize(w,h,{kernel:'nearest'}).raw().toBuffer();
 for(let i=3;i<pixels.length;i+=4)pixels[i]=pixels[i]>=200?255:0;
 return sharp({create:{width:fw,height:fh,channels:4,background:'#00000000'}}).composite([{input:pixels,raw:{width:w,height:h,channels:4},left,top:fh-h}]).png().toBuffer();
}
(async()=>{
 const walk=await source('walking-raw.png',3,3),scale=108/Math.max(...walk.bounds.map(b=>b.h)),frames=[];
 for(const b of walk.bounds)frames.push(await frame(walk,b,scale));
 // The generation repeated the front/rear lead limb. Build the opposite phase
 // by reflecting limbs, preserving the original head and asymmetric front robe.
 for(const row of [0,2]){
  const {data,info}=await sharp(frames[row*3+1]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const result=Buffer.from(data);
  for(let y=52;y<128;y++)for(let x=0;x<96;x++){
   const preserveFront=row===0&&((y<80&&x>=39&&x<57)||(y>=80&&y<105&&x>=33&&x<63));
   if(preserveFront)continue;
   const src=(y*96+95-x)*4,dst=(y*96+x)*4;for(let k=0;k<4;k++)result[dst+k]=data[src+k];
  }
  frames[row*3+2]=await sharp(result,{raw:info}).png().toBuffer();
 }
 const rows=[frames.slice(0,3),frames.slice(3,6),await Promise.all(frames.slice(3,6).map(f=>sharp(f).flop().png().toBuffer())),frames.slice(6,9)];
 const sheet=await sharp({create:{width:288,height:512,channels:4,background:'#00000000'}}).composite(rows.flatMap((row,r)=>row.map((input,c)=>({input,left:c*96,top:r*128})))).png().toBuffer();
 await fs.writeFile(path.join(root,'songjiang-walking.png'),sheet);
 await sharp(sheet).resize(576,1024,{kernel:'nearest'}).png().toFile(path.join(root,'walking-preview.png'));
 const battle=await source('battle-raw.png',1,1),battleScale=100/battle.bounds[0].h;
 const battleFrame=await frame(battle,battle.bounds[0],battleScale,192,128);
 await fs.writeFile(path.join(root,'songjiang-battle.png'),battleFrame);
 await sharp(battleFrame).resize(768,512,{kernel:'nearest'}).png().toFile(path.join(root,'battle-preview.png'));
 await fs.writeFile(path.join(root,'frames.json'),JSON.stringify({walk:{frame:[96,128],sheet:[288,512],rows:['down','left','right','up'],columns:['stand','stride-a','stride-b'],sequence:[0,1,0,2],fps:5,scale,bounds:walk.bounds},battle:{frame:[192,128],frameCount:1,facing:'left',static:true,scale:battleScale,bounds:battle.bounds},sourceColoursPreserved:true},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
