const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path');
const root=__dirname,names=['front','left','back'];
async function rgba(file){return sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
function bounds(data,w,h,left=0,right=w){let l=right,t=h,r=left,b=0;for(let y=0;y<h;y++)for(let x=left;x<right;x++)if(data[(y*w+x)*4+3]>=200){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}return {l,t,w:r-l+1,h:b-t+1};}
async function canvas(fw,fh,input,left,top){return sharp({create:{width:fw,height:fh,channels:4,background:'#00000000'}}).composite([{input,left,top}]).png().toBuffer();}
(async()=>{
 const sources=[];
 for(const name of names){const seed=await rgba(path.join(root,name+'-seed.png')),raw=await rgba(path.join(root,name+'-raw.png'));const bb=[0,1,2].map(c=>bounds(raw.data,raw.info.width,raw.info.height,c*512,(c+1)*512));sources.push({name,seed,raw,bb,match:seed.info.height/bb[0].h});}
 const reports=[];
 for(const spec of [{file:'songjiang-walking-master.png',fw:768,fh:1024,scale:1},{file:'songjiang-walking.png',fw:192,fh:256,scale:216/734},{file:'songjiang-walking-96.png',fw:96,fh:128,scale:108/734}]){
  const {fw,fh,scale}=spec,dirs=[];
  for(const src of sources){
   const sw=Math.round(src.seed.info.width*scale),sh=Math.round(src.seed.info.height*scale);
   const idle=await canvas(fw,fh,await sharp(src.seed.data,{raw:src.seed.info}).resize(sw,sh,{kernel:'nearest'}).png().toBuffer(),Math.round((fw-sw)/2),fh-sh);
   const idleRaw=await sharp(idle).raw().toBuffer(),frames=[idle],headLock=fh-sh+Math.round(sh*.34);
   for(const c of [1,2]){
    const b=src.bb[c],sc=scale*src.match,w=Math.round(b.w*sc),h=Math.round(b.h*sc);
    const crop=await sharp(src.raw.data,{raw:src.raw.info}).extract({left:b.l,top:b.t,width:b.w,height:b.h}).resize(w,h,{kernel:'nearest'}).raw().toBuffer();
    // Suppress the low-alpha generated halo while retaining semi-opaque edge alpha and every RGB value.
    for(let i=3;i<crop.length;i+=4)if(crop[i]<128)crop[i]=0;
    const left=Math.round(fw/2+(b.l-c*512-(src.bb[0].l+src.bb[0].w/2))*sc),top=fh-h;
    if(left<0||left+w>fw||top<0)throw Error('Sprite exceeds frame');
    const pose=await canvas(fw,fh,await sharp(crop,{raw:{width:w,height:h,channels:4}}).png().toBuffer(),left,top);
    const pixels=await sharp(pose).raw().toBuffer();
    // Lock the approved cap/face/beard region, including its transparent surround.
    idleRaw.copy(pixels,0,0,headLock*fw*4);
    frames.push(await sharp(pixels,{raw:{width:fw,height:fh,channels:4}}).png().toBuffer());
   }
   dirs.push(frames);
   if(fw===192)reports.push({direction:src.name,sourceBounds:src.bb,sharedScale:scale*src.match,headLockRows:headLock,idleSize:[sw,sh]});
  }
  const rows=[dirs[0],dirs[1],await Promise.all(dirs[1].map(f=>sharp(f).flop().png().toBuffer())),dirs[2]];
  await sharp({create:{width:fw*3,height:fh*4,channels:4,background:'#00000000'}}).composite(rows.flatMap((row,r)=>row.map((input,c)=>({input,left:c*fw,top:r*fh})))).png().toFile(path.join(root,spec.file));
  if(fw===192){
   await sharp({create:{width:fw*3,height:fh*4,channels:4,background:'#00000000'}}).composite(rows.flatMap((row,r)=>[0,1,2].map(c=>({input:row[0],left:c*fw,top:r*fh})))).png().toFile(path.join(root,'classic-original-hd.png'));
  }
 }
 await fs.writeFile(path.join(root,'frames.json'),JSON.stringify({frame:[192,256],sheet:[576,1024],logicalFrame:[24,32],artScale:8,rows:['down','left','right','up'],columns:['original-idle','stride-a','stride-b'],sequence:[0,1,0,2],fps:5,originalIdleLocked:true,originalHeadLocked:true,paletteQuantization:false,master:{file:'songjiang-walking-master.png',frame:[768,1024],note:'Source-scale figures; no source downsampling'},reports},null,2));
})();
