const sharp=require('sharp'),fs=require('fs'),path=require('path');const d=__dirname,src=path.resolve(d,'../linchong-classic-v2'),meta=JSON.parse(fs.readFileSync(src+'/packing.json')),directions=['front','left','right','back'];
async function rgba(file){return sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
function bounds(data,w,h,x0=0,x1=w,y0=0,y1=h){let l=x1,t=y1,r=-1,b=-1;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*w+x)*4+3]>=200){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}if(r<0)throw Error('Empty frame');return {left:l,top:t,width:r-l+1,height:b-t+1};}
function headCenter(raw,b){const h=bounds(raw.data,raw.info.width,raw.info.height,b.left,b.left+b.width,b.top,b.top+Math.round(b.height*.23));return h.left+h.width/2;}
async function canvas(w,h,input,left,top){if(left<0||top<0)throw Error('Frame overflow '+[left,top]);return sharp({create:{width:w,height:h,channels:4,background:'#00000000'}}).composite([{input,left,top}]).png().toBuffer();}
async function losslessGrid(rows,fw,fh,file){const w=fw*rows[0].length,h=fh*rows.length,pixels=Buffer.alloc(w*h*4);for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){const raw=await sharp(rows[r][c]).ensureAlpha().raw().toBuffer();for(let y=0;y<fh;y++)raw.copy(pixels,((r*fh+y)*w+c*fw)*4,y*fw*4,(y+1)*fw*4);}await sharp(pixels,{raw:{width:w,height:h,channels:4}}).png().toFile(file);}
function tones(data,outfit){const groups={cloth:[],skin:[],...(outfit==='exile'?{mantle:[]}: {})};for(let i=0;i<data.length;i+=4){const [r,g,b,a]=data.subarray(i,i+4);if(a<240)continue;const y=.2126*r+.7152*g+.0722*b;if(outfit==='official'?g>r+7&&g>b&&g>35:b>r+10&&b>g+4&&b>40)groups.cloth.push([r,g,b,y]);if(r>170&&g>80&&g<210&&r>g*1.22&&g>b*1.18)groups.skin.push([r,g,b,y]);if(outfit==='exile'&&r>110&&r<210&&g>90&&r/g<1.27&&r/g>1.04&&g/b>1.05&&g/b<1.32)groups.mantle.push([r,g,b,y]);}return Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,{pixels:v.length,median:[0,1,2,3].map(i=>v.length?Math.round(v.map(p=>p[i]).sort((a,b)=>a-b)[Math.floor(v.length/2)]):null)}]));}
(async()=>{const reports=[];for(const outfit of ['official','exile']){const rec=meta.records.find(r=>r.outfit===outfit),rows=[],masterRows=[];for(const dir of directions){const raw=await rgba(d+'/'+outfit+'-'+dir+'-raw.png'),slot=raw.info.width/3;if(!Number.isInteger(slot))throw Error('Nonuniform slots');const bb=[0,1,2].map(c=>bounds(raw.data,raw.info.width,raw.info.height,c*slot,(c+1)*slot));const seed=await rgba(d+'/'+outfit+'-'+dir+'-seed.png');const sourceHeight=seed.info.height;const sharedScale=meta.scale*sourceHeight/bb[0].height,frames=[],masters=[];const approved=dir==='right'?null:await rgba(src+'/'+outfit+'-'+dir+'.png');let approvedHead=96;
 if(approved){const ib=bounds(approved.data,192,256);approvedHead=headCenter(approved,ib);}
 for(let c=0;c<3;c++){
  const b=bb[c];let input=await sharp(raw.data,{raw:raw.info}).extract(b).png().toBuffer();
  // Alpha-edge cleanup only; preserve every RGB value and never quantize colours.
  const pix=await sharp(input).ensureAlpha().raw().toBuffer();for(let j=3;j<pix.length;j+=4)if(pix[j]<128)pix[j]=0;
  input=await sharp(pix,{raw:{width:b.width,height:b.height,channels:4}}).png().toBuffer();
  const scale=sharedScale,w=Math.round(b.width*scale),h=Math.round(b.height*scale),localHead=headCenter(raw,b)-b.left;
  const x=Math.round(approvedHead-localHead*scale),y=Math.min(255-h,Math.round(255+(b.top-(bb[0].top+bb[0].height))*scale));
  if(x+w>192||h>255)throw Error('Overflow '+outfit+' '+dir+' '+c);
  let frame=await canvas(192,256,await sharp(input).resize(w,h,{kernel:'nearest'}).toBuffer(),x,y);
  if(c===0&&approved)frame=fs.readFileSync(src+'/'+outfit+'-'+dir+'.png');
  frames.push(frame);fs.writeFileSync(d+'/'+outfit+'-'+dir+'-'+c+'.png',frame);
  const ms=sourceHeight/bb[0].height,mw=Math.round(b.width*ms),mh=Math.round(b.height*ms);let master=await canvas(768,1024,await sharp(input).resize(mw,mh,{kernel:'nearest'}).toBuffer(),Math.round(384-localHead*ms),Math.min(1023-mh,Math.round(1023+(b.top-(bb[0].top+bb[0].height))*ms)));
  if(c===0&&dir!=='right')master=await canvas(768,1024,await sharp(seed.data,{raw:seed.info}).png().toBuffer(),Math.floor((768-seed.info.width)/2),1023-seed.info.height);
  masters.push(master);
 }
 rows.push(frames);masterRows.push(masters);const tone=await Promise.all(frames.map(async f=>tones(await sharp(f).raw().toBuffer(),outfit)));reports.push({outfit,direction:dir,sourceBounds:bb,sharedScale,originalIdle:dir!=='right',tones:tone});
 await losslessGrid([frames],192,256,d+'/'+outfit+'-'+dir+'-strip.png');
 }
 for(const [kind,rr,fw,fh]of [['walking',rows,192,256],['walking-master',masterRows,768,1024]])await losslessGrid(rr,fw,fh,d+'/'+outfit+'-'+kind+'.png');
 await losslessGrid(rows.map(row=>[row[0],row[0],row[0]]),192,256,d+'/'+outfit+'-standing.png');
 }
 fs.writeFileSync(d+'/frames.json',JSON.stringify({frame:[192,256],sheet:[576,1024],artScale:8,logicalSize:[24,32],rows:['down','left','right','up'],columns:['neutral','strideA','strideB'],sequence:[0,1,0,2],fps:5,headLock:false,paletteQuantization:false,reports},null,2));console.log('Packed both four-direction walking sets');console.log(reports.map(r=>({outfit:r.outfit,dir:r.direction,cloth:r.tones.map(t=>t.cloth.median),skin:r.tones.map(t=>t.skin.median),mantle:r.tones.map(t=>t.mantle?.median)})));})();
