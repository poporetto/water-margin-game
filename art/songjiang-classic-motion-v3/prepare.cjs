const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path');
const root=__dirname,prior=path.join(root,'../songjiang-classic-motion-v2');
function bounds(data,w,h,slot){let l=w,t=h,r=0,b=0;for(let y=0;y<h;y++)for(let x=slot*512;x<(slot+1)*512;x++)if(data[(y*w+x)*4+3]>=200){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}return {l,t,w:r-l+1,h:b-t+1};}
(async()=>{
 const src={};for(const name of ['front','back']){const {data,info}=await sharp(path.join(root,name+'-raw.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});src[name]={data,info,bounds:[0,1,2].map(c=>bounds(data,info.width,info.height,c))};}
 const report=[];
 for(const spec of [{file:'songjiang-walking.png',fw:192,fh:256,height:216},{file:'songjiang-walking-96.png',fw:96,fh:128,height:108},{file:'songjiang-walking-master.png',fw:768,fh:1024,height:734}]){
  const {fw,fh,height,file}=spec,composite=[],tops=[];
  for(const [name,row] of [['front',0],['back',3]]){
   const s=src[name],scale=height/s.bounds[0].h;
   for(let col=0;col<3;col++){
    const b=s.bounds[col],w=Math.round(b.w*scale),h=Math.round(b.h*scale),top=fh-h;
    const pixels=await sharp(s.data,{raw:s.info}).extract({left:b.l,top:b.t,width:b.w,height:b.h}).resize(w,h,{kernel:'nearest'}).raw().toBuffer();
    for(let i=3;i<pixels.length;i+=4)if(pixels[i]<128)pixels[i]=0;
    const left=Math.round(fw/2+(b.l-col*512-(s.bounds[0].l+s.bounds[0].w/2))*scale);
    if(left<0||left+w>fw||top<0)throw Error('Sprite exceeds cell');
    composite.push({input:await sharp(pixels,{raw:{width:w,height:h,channels:4}}).png().toBuffer(),left:col*fw+left,top:row*fh+top});
    tops.push({direction:name,column:col,top,height:h});
   }
   if(fw===192)report.push({direction:name,sharedScale:scale,bounds:s.bounds});
  }
  // The user approved the side walks; copy their complete rows without resampling.
  composite.push({input:await sharp(path.join(prior,file)).extract({left:0,top:fh,width:fw*3,height:fh*2}).png().toBuffer(),left:0,top:fh});
  const built=await sharp({create:{width:fw*3,height:fh*4,channels:4,background:'#00000000'}}).composite(composite).raw().toBuffer();
  const previousPixels=await sharp(path.join(prior,file)).ensureAlpha().raw().toBuffer();
  // Copy RGBA bytes after compositing too: this avoids premultiplication rounding
  // at translucent edges of the already-approved side frames.
  previousPixels.copy(built,fh*fw*3*4,fh*fw*3*4,fh*3*fw*3*4);
  await sharp(built,{raw:{width:fw*3,height:fh*4,channels:4}}).png().toFile(path.join(root,file));
  if(fw===192){
   const standing=[];for(let row=0;row<4;row++){const frame=await sharp(path.join(root,file)).extract({left:0,top:row*fh,width:fw,height:fh}).png().toBuffer();for(let c=0;c<3;c++)standing.push({input:frame,left:c*fw,top:row*fh});}
   await sharp({create:{width:fw*3,height:fh*4,channels:4,background:'#00000000'}}).composite(standing).png().toFile(path.join(root,'corrected-standing.png'));
   await fs.writeFile(path.join(root,'frames.json'),JSON.stringify({frame:[fw,fh],sheet:[fw*3,fh*4],logicalFrame:[24,32],artScale:8,rows:['down','left','right','up'],columns:['neutral','stride-a','stride-b'],sequence:[0,1,0,2],fps:5,headShoulderLock:false,sideRowsCopiedExactlyFrom:'../songjiang-classic-motion-v2',paletteQuantization:false,tops,report},null,2));
  }
 }
})().catch(e=>{console.error(e);process.exit(1)});
