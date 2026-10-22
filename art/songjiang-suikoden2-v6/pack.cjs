// Packaging only: shared-scale nearest-neighbour sampling of generated artwork.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = __dirname;
async function replace(base, edits) {
  const {data,info}=await sharp(base).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const e of edits){
    const src=await sharp(e.input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(let y=0;y<src.info.height;y++)src.data.copy(data,((e.top+y)*info.width+e.left)*4,y*src.info.width*4,(y+1)*src.info.width*4);
  }
  return sharp(data,{raw:info}).png().toBuffer();
}

async function pack(name, rows) {
  const { data, info } = await sharp(path.join(root, `${name}-raw.png`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  function ranges(counts) {
    const result=[];let start=null;
    for(let i=0;i<=counts.length;i++){
      if(counts[i] && start===null) start=i;
      if(!counts[i] && start!==null){if(i-start>4)result.push([start,i]);start=null;}
    }
    return result;
  }
  const ys=Array(info.height).fill(0);
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>=200)ys[y]++;
  const rowRanges=ranges(ys);
  if(rowRanges.length!==rows)throw new Error(`Expected ${rows} rows, found ${rowRanges.length}`);
  const slots = [];
  for (let r=0;r<rows;r++) {
    const [y0,y1]=rowRanges[r],xs=Array(info.width).fill(0);
    for(let y=y0;y<y1;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>=200)xs[x]++;
    const columns=ranges(xs);
    if(columns.length!==3)throw new Error(`Expected 3 columns, found ${columns.length}`);
    for(let c=0;c<3;c++) {
    const [x0,x1]=columns[c];
    let l=x1,t=y1,rr=x0,b=y0;
    for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++) {
      if(data[(y*info.width+x)*4+3]>=200) {l=Math.min(l,x);rr=Math.max(rr,x);t=Math.min(t,y);b=Math.max(b,y);}
    }
    if(l>rr) throw new Error(`Empty frame ${r},${c}`);
    slots.push({r,c,l,t,w:rr-l+1,h:b-t+1});
    }
  }
  const scale=Math.min(54/Math.max(...slots.map(s=>s.h)),44/Math.max(...slots.map(s=>s.w)));
  let frames=[];
  for(const s of slots) {
    const w=Math.round(s.w*scale),h=Math.round(s.h*scale);
    let headLeft=s.l+s.w,headRight=s.l;
    for(let y=s.t;y<s.t+Math.round(s.h*.28);y++)for(let x=s.l;x<s.l+s.w;x++){
      if(data[(y*info.width+x)*4+3]>=200){headLeft=Math.min(headLeft,x);headRight=Math.max(headRight,x);}
    }
    const anchor=(headLeft+headRight+1)/2;
    const left=name==='songjiang-battle'?Math.floor((48-w)/2):Math.max(0,Math.min(48-w,Math.round(24-(anchor-s.l)*scale)));
    const resized=await sharp(data,{raw:info}).extract({left:s.l,top:s.t,width:s.w,height:s.h})
      .resize(w,h,{kernel:'nearest'}).raw().toBuffer();
    for(let p=3;p<resized.length;p+=4) resized[p]=resized[p]>=200?255:0;
    const frame=await sharp({create:{width:48,height:64,channels:4,background:'#00000000'}})
      .composite([{input:resized,raw:{width:w,height:h,channels:4},left,top:64-h}]).png().toBuffer();
    frames.push(frame);
    s.output={width:w,height:h,left,top:64-h};
  }
  // Song Jiang has no asymmetric costume marks; derive east from west exactly.
  if(rows===4) for(let c=0;c<3;c++) frames[6+c]=await sharp(frames[3+c]).flop().png().toBuffer();
  const sheet=await sharp({create:{width:144,height:64*rows,channels:4,background:'#00000000'}})
    .composite(frames.map((input,i)=>({input,left:(i%3)*48,top:Math.floor(i/3)*64})))
    .png({palette:true,colours:24,dither:0}).toBuffer();
  await fs.writeFile(path.join(root,`${name}.png`),sheet);
  await sharp(sheet).resize(576,256*rows,{kernel:'nearest'}).png().toFile(path.join(root,`${name}-preview.png`));
  await fs.writeFile(path.join(root,`${name}-checks.json`),JSON.stringify({scale,rows,columns:3,cell:[48,64],sequence:[0,1,0,2],slots,mirroredRight:rows===4},null,2));
}
(async()=>{for(const [name,rows] of [['songjiang-walking',4],['songjiang-battle',1],['songjiang-side',1]]) {
  try{await fs.access(path.join(root,`${name}-raw.png`));}catch{continue;}
  await pack(name,rows);
}
  const walkingPath=path.join(root,'songjiang-walking.png');
  const walking=await fs.readFile(walkingPath),edits=[];
  // Front and rear costumes are symmetric: opposite stride uses mirrored limbs,
  // retaining the unmirrored head and collar from the same pose.
  for(const row of [0,3]){
    const pose=await sharp(walking).extract({left:48,top:row*64,width:48,height:64}).png().toBuffer();
    const lower=await sharp(pose).extract({left:0,top:32,width:48,height:32}).flop().png().toBuffer();
    const phase=await replace(pose,[{input:lower,left:0,top:32}]);
    edits.push({input:phase,left:96,top:row*64});
  }
  try{
    const side=await fs.readFile(path.join(root,'songjiang-side.png'));
    edits.push({input:side,left:0,top:64});
    for(let c=0;c<3;c++){
      const right=await sharp(side).extract({left:c*48,top:0,width:48,height:64}).flop().png().toBuffer();
      edits.push({input:right,left:c*48,top:128});
    }
  }catch(e){if(e.code!=='ENOENT')throw e;}
  // Replace cells, including transparent pixels.
  const replaced=await replace(walking,edits);
  const final=await sharp(replaced).png({palette:true,colours:24,dither:0}).toBuffer();
  await fs.writeFile(walkingPath,final);
  await sharp(final).resize(576,1024,{kernel:'nearest'}).png().toFile(path.join(root,'songjiang-walking-preview.png'));
  // One explicit 23-colour opaque palette + transparency for walk and battle.
  const images=[],hist=new Map();
  for(const name of ['songjiang-walking','songjiang-battle']){
    const image=await sharp(path.join(root,name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    images.push({name,...image});
    for(let i=0;i<image.data.length;i+=4)if(image.data[i+3]){
      const rgb=Array.from(image.data.subarray(i,i+3)),key=rgb.join(',');
      const entry=hist.get(key)||{rgb,n:0};entry.n++;hist.set(key,entry);
    }
  }
  const boxes=[[...hist.values()]];
  const range=box=>[0,1,2].map(k=>Math.max(...box.map(p=>p.rgb[k]))-Math.min(...box.map(p=>p.rgb[k])));
  while(boxes.length<23){
    let best=-1,score=-1;
    boxes.forEach((b,i)=>{const v=Math.max(...range(b))*Math.sqrt(b.reduce((n,p)=>n+p.n,0));if(b.length>1&&v>score){score=v;best=i;}});
    if(best<0)break;
    const box=boxes.splice(best,1)[0],ranges=range(box),axis=ranges.indexOf(Math.max(...ranges));
    box.sort((a,b)=>a.rgb[axis]-b.rgb[axis]);
    const half=box.reduce((n,p)=>n+p.n,0)/2;let n=0,cut=1;
    for(let i=0;i<box.length-1;i++){n+=box[i].n;if(n>=half){cut=i+1;break;}}
    boxes.push(box.slice(0,cut),box.slice(cut));
  }
  const palette=boxes.map(b=>{const n=b.reduce((n,p)=>n+p.n,0);return [0,1,2].map(k=>Math.round(b.reduce((sum,p)=>sum+p.rgb[k]*p.n,0)/n));});
  for(const im of images){
    for(let i=0;i<im.data.length;i+=4)if(im.data[i+3]){
      let best=palette[0],distance=Infinity;
      for(const p of palette){const d=p.reduce((sum,v,k)=>sum+(v-im.data[i+k])**2,0);if(d<distance){distance=d;best=p;}}
      for(let k=0;k<3;k++)im.data[i+k]=best[k];
    }
    const output=await sharp(im.data,{raw:im.info}).png().toBuffer();
    await fs.writeFile(path.join(root,im.name+'.png'),output);
    await sharp(output).resize(im.info.width*4,im.info.height*4,{kernel:'nearest'}).png().toFile(path.join(root,im.name+'-preview.png'));
  }
  await fs.writeFile(path.join(root,'palette.json'),JSON.stringify(palette));
})().catch(e=>{console.error(e);process.exit(1);});
