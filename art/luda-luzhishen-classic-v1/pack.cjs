const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const dir=__dirname;
async function grid(rows,file){const w=576,h=rows.length*256,data=Buffer.alloc(w*h*4);for(let r=0;r<rows.length;r++)for(let c=0;c<3;c++){if(!rows[r][c])continue;const p=await sharp(rows[r][c]).ensureAlpha().raw().toBuffer();for(let y=0;y<256;y++)p.copy(data,((r*256+y)*w+c*192)*4,y*192*4,(y+1)*192*4);}await sharp(data,{raw:{width:w,height:h,channels:4}}).png().toFile(file);}
(async()=>{
 const records=[];
 for(const character of ['luda','luzhishen']){
  const source=path.join(dir,character+'-original.png'),{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});const runs=[];let start=-1,last=-1;
  for(let x=0;x<info.width;x++){let count=0;for(let y=0;y<info.height;y++)if(data[(y*info.width+x)*4+3]>200)count++;if(count>2){if(start<0)start=x;last=x;}if(start>=0&&(x-last>12||x===info.width-1)){if(last-start>40)runs.push([start,last]);start=-1;}}
  if(runs.length!==3)throw Error('Expected three separated figures: '+character+' '+JSON.stringify(runs));const bounds=[];
  for(const [x0,x1]of runs){let l=info.width,t=info.height,r=-1,b=-1;for(let y=0;y<info.height;y++)for(let x=x0;x<=x1;x++)if(data[(y*info.width+x)*4+3]>200){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}const left=Math.max(0,l-2),top=Math.max(0,t-2);bounds.push({left,top,width:Math.min(info.width,r+3)-left,height:Math.min(info.height,b+3)-top});}
  records.push({character,source:character+'-original.png',bounds,sourceSize:[info.width,info.height]});
 }
 // Slightly taller and broader than the approved 224px Lin Chong; one scale for the same man in both outfits.
 const scale=Math.min(236/Math.max(...records.flatMap(r=>r.bounds.map(b=>b.height))),184/Math.max(...records.flatMap(r=>r.bounds.map(b=>b.width))));
 for(const rec of records){const frames=[];
  for(const [i,b]of rec.bounds.entries()){const width=Math.round(b.width*scale),height=Math.round(b.height*scale),pixels=await sharp(path.join(dir,rec.source)).extract(b).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();const canvas=Buffer.alloc(192*256*4),left=Math.floor((192-width)/2),top=255-height;for(let y=0;y<height;y++)pixels.copy(canvas,((top+y)*192+left)*4,y*width*4,(y+1)*width*4);const frame=await sharp(canvas,{raw:{width:192,height:256,channels:4}}).png().toBuffer();fs.writeFileSync(path.join(dir,rec.character+'-'+['front','left','back'][i]+'.png'),frame);frames.push(frame);}
  await grid([frames],path.join(dir,rec.character+'-turnaround.png'));await grid([Array(3).fill(frames[0]),Array(3).fill(frames[1]),[null,null,null],Array(3).fill(frames[2])],path.join(dir,rec.character+'-review-sheet.png'));
 }
 fs.writeFileSync(path.join(dir,'packing.json'),JSON.stringify({scale,frame:[192,256],footBaseline:255,logicalSize:[24,32],artScale:8,records},null,2));console.log('Packed both designs with one scale, original colours and no palette reduction.');
})();
