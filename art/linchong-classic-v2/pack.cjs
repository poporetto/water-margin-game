const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const dir=__dirname;
(async()=>{
 const records=[];
 for(const outfit of ['official','exile']){
  const source=path.join(dir,outfit+'-original.png');
  const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const runs=[];let start=-1,last=-1;
  for(let x=0;x<info.width;x++){
   let count=0;for(let y=0;y<info.height;y++)if(data[(y*info.width+x)*4+3]>200)count++;
   if(count>2){if(start<0)start=x;last=x;}
   if(start>=0&&(x-last>12||x===info.width-1)){if(last-start>40)runs.push([start,last]);start=-1;}
  }
  if(runs.length!==3)throw Error('Expected three separated figures: '+JSON.stringify(runs));
  const bounds=[];
  for(const [x0,x1] of runs){
   let l=info.width,t=info.height,r=-1,b=-1;
   for(let y=0;y<info.height;y++)for(let x=x0;x<=x1;x++)if(data[(y*info.width+x)*4+3]>200){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
   bounds.push({left:Math.max(0,l-1),top:Math.max(0,t-1),width:r-l+3,height:b-t+3});
  }
  records.push({outfit,source,bounds,sourceSize:[info.width,info.height]});
 }
 // One proportional scale across all six views; no independent stretching or palette reduction.
 const scale=224/Math.max(...records.flatMap(r=>r.bounds.map(b=>b.height)));
 for(const rec of records){
  const frames=[];
  for(const [i,b] of rec.bounds.entries()){
   const width=Math.round(b.width*scale),height=Math.round(b.height*scale);
   const input=await sharp(rec.source).extract(b).resize(width,height,{kernel:'nearest'}).toBuffer();
   const frame=await sharp({create:{width:192,height:256,channels:4,background:'#00000000'}}).composite([{input,left:Math.floor((192-width)/2),top:255-height}]).png().toBuffer();
   fs.writeFileSync(path.join(dir,rec.outfit+'-'+['front','left','back'][i]+'.png'),frame);frames.push(frame);
  }
  await sharp({create:{width:576,height:256,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i*192,top:0}))).png().toFile(path.join(dir,rec.outfit+'-turnaround.png'));
  // Engine-compatible static review sheet; deliberately blank right row (not a mirrored cheek mark).
  const composite=[];for(const [i,row] of [0,1,3].entries())for(let col=0;col<3;col++)composite.push({input:frames[i],left:col*192,top:row*256});
  await sharp({create:{width:576,height:1024,channels:4,background:'#00000000'}}).composite(composite).png().toFile(path.join(dir,rec.outfit+'-review-sheet.png'));
 }
 fs.writeFileSync(path.join(dir,'packing.json'),JSON.stringify({scale,frame:[192,256],footBaseline:255,logicalSize:[24,32],artScale:8,records},null,2));
 console.log('Packed both outfits at shared scale',scale);
})();
