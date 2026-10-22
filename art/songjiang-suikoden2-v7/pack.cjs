const sharp=require('sharp');
const fs=require('node:fs/promises');
const path=require('node:path');
const root=__dirname,source=path.join(root,'../songjiang-suikoden2-v6');
async function pack(name, rows) {
  const { data, info } = await sharp(path.join(source, `${name}-raw.png`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
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
  const fw=name==='songjiang-battle'?128:96, fh=128;
  const scale=(name==='songjiang-battle'?100:108)/Math.max(...slots.map(s=>s.h));
  let frames=[];
  for(const s of slots) {
    const w=Math.round(s.w*scale),h=Math.round(s.h*scale);
    let headLeft=s.l+s.w,headRight=s.l;
    for(let y=s.t;y<s.t+Math.round(s.h*.28);y++)for(let x=s.l;x<s.l+s.w;x++){
      if(data[(y*info.width+x)*4+3]>=200){headLeft=Math.min(headLeft,x);headRight=Math.max(headRight,x);}
    }
    const anchor=(headLeft+headRight+1)/2;
    const left=name==='songjiang-battle'?Math.floor((fw-w)/2):Math.max(0,Math.min(fw-w,Math.round(fw/2-(anchor-s.l)*scale)));
    const resized=await sharp(data,{raw:info}).extract({left:s.l,top:s.t,width:s.w,height:s.h})
      .resize(w,h,{kernel:'nearest'}).raw().toBuffer();
    for(let p=3;p<resized.length;p+=4) resized[p]=resized[p]>=200?255:0;
    const frame=await sharp({create:{width:fw,height:fh,channels:4,background:'#00000000'}})
      .composite([{input:resized,raw:{width:w,height:h,channels:4},left,top:fh-h}]).png().toBuffer();
    frames.push(frame);
    s.output={width:w,height:h,left,top:fh-h};
  }
  // Song Jiang has no asymmetric costume marks; derive east from west exactly.
  if(rows===4) for(let c=0;c<3;c++) frames[6+c]=await sharp(frames[3+c]).flop().png().toBuffer();
  const sheet=await sharp({create:{width:fw*3,height:fh*rows,channels:4,background:'#00000000'}})
    .composite(frames.map((input,i)=>({input,left:(i%3)*fw,top:Math.floor(i/3)*fh})))
    .png().toBuffer();
  await fs.writeFile(path.join(root,`${name}.png`),sheet);
  await sharp(sheet).resize(fw*6,fh*rows*2,{kernel:'nearest'}).png().toFile(path.join(root,`${name}-preview.png`));
  await fs.writeFile(path.join(root,`${name}-checks.json`),JSON.stringify({scale,rows,columns:3,cell:[fw,fh],sequence:[0,1,0,2],slots,mirroredRight:rows===4},null,2));
}
async function replace(base, edits) {
  const {data,info}=await sharp(base).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const e of edits){
    const src=await sharp(e.input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    for(let y=0;y<src.info.height;y++)src.data.copy(data,((e.top+y)*info.width+e.left)*4,y*src.info.width*4,(y+1)*src.info.width*4);
  }
  return sharp(data,{raw:info}).png().toBuffer();
}
(async()=>{
  for(const [name,rows]of [['songjiang-walking',4],['songjiang-side',1],['songjiang-battle',1]])await pack(name,rows);
  const walking=await fs.readFile(path.join(root,'songjiang-walking.png'));
  const side=await fs.readFile(path.join(root,'songjiang-side.png'));
  const edits=[{input:side,left:0,top:128}];
  for(let c=0;c<3;c++)edits.push({input:await sharp(side).extract({left:c*96,top:0,width:96,height:128}).flop().png().toBuffer(),left:c*96,top:256});
  // Alternate symmetric front/rear limbs, leaving head/collar untouched.
  for(const row of [0,3]){
    const phase=await sharp(walking).extract({left:96,top:row*128,width:96,height:128}).png().toBuffer();
    const lower=await sharp(phase).extract({left:0,top:64,width:96,height:64}).flop().png().toBuffer();
    edits.push({input:await replace(phase,[{input:lower,left:0,top:64}]),left:192,top:row*128});
  }
  const output=await replace(walking,edits);
  await fs.writeFile(path.join(root,'songjiang-walking.png'),output);
  await sharp(output).resize(576,1024,{kernel:'nearest'}).png().toFile(path.join(root,'songjiang-walking-preview.png'));
  const comparison=[];
  for(let r=0;r<4;r++){
    comparison.push({input:await sharp(path.join(source,'songjiang-walking.png')).extract({left:0,top:r*64,width:48,height:64}).resize(192,256,{kernel:'nearest'}).png().toBuffer(),left:r*192,top:0});
    comparison.push({input:await sharp(output).extract({left:0,top:r*128,width:96,height:128}).resize(192,256,{kernel:'nearest'}).png().toBuffer(),left:r*192,top:256});
  }
  await sharp({create:{width:768,height:512,channels:4,background:'#26333c'}}).composite(comparison).png().toFile(path.join(root,'before-after.png'));
})().catch(e=>{console.error(e);process.exit(1)});
