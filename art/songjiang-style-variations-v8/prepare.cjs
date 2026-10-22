const sharp=require('sharp');
const fs=require('node:fs/promises');
const path=require('node:path');
const root=__dirname;
async function prepare(id){
  const {data,info}=await sharp(path.join(root,`${id}-original.png`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const occupied=Array(info.width).fill(false);
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>200)occupied[x]=true;
  const ranges=[];let start=null;
  for(let x=0;x<=info.width;x++){if(occupied[x]&&start===null)start=x;if(!occupied[x]&&start!==null){if(x-start>8)ranges.push([start,x]);start=null;}}
  if(ranges.length!==3)throw Error(`${id}: expected 3 separated figures, found ${ranges.length}`);
  const bounds=ranges.map(([l,r])=>{let t=info.height,b=0;for(let y=0;y<info.height;y++)for(let x=l;x<r;x++)if(data[(y*info.width+x)*4+3]>200){t=Math.min(t,y);b=Math.max(b,y)}return {l,t,w:r-l,h:b-t+1};});
  const scale=Math.min(108/Math.max(...bounds.map(b=>b.h)),88/Math.max(...bounds.map(b=>b.w))),frames=[];
  for(let i=0;i<3;i++){
    const b=bounds[i],w=Math.round(b.w*scale),h=Math.round(b.h*scale);
    const crop=await sharp(data,{raw:info}).extract({left:b.l,top:b.t,width:b.w,height:b.h}).resize(w,h,{kernel:'nearest'}).png().toBuffer();
    frames.push(await sharp({create:{width:96,height:128,channels:4,background:'#00000000'}}).composite([{input:crop,left:Math.round((96-w)/2),top:128-h}]).png().toBuffer());
  }
  await sharp({create:{width:288,height:128,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i*96,top:0}))).png().toFile(path.join(root,`${id}-turnaround.png`));
  const views=[frames[0],frames[1],await sharp(frames[1]).flop().png().toBuffer(),frames[2]];
  await sharp({create:{width:288,height:512,channels:4,background:'#00000000'}}).composite(views.flatMap((input,r)=>[0,1,2].map(c=>({input,left:c*96,top:r*128})))).png().toFile(path.join(root,`${id}-preview-sheet.png`));
  await fs.writeFile(path.join(root,`${id}-metadata.json`),JSON.stringify({sourceSize:[info.width,info.height],bounds,scale,frame:[96,128],order:['front','left','back'],animation:false,colors:'original; no palette quantization'},null,2));
}
(async()=>{await prepare('variant-a');await prepare('variant-b');})().catch(e=>{console.error(e);process.exit(1)});
