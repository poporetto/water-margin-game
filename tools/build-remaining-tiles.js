// Normalize the generated Northern Song object source into native 32px game assets.
'use strict';
const fs=require('fs'),sharp=require('sharp');
const names=['house-door','poplar','willow','willow-nest','bamboo','dead-tree','boulder','boulder-2','stall-vegetables','stall-cloth','stall-pottery','lantern','banner-red','banner-yellow','wine-flag','notice-board','stele','grave','tent','rowboat','sampan','guardian-lion','tea-table','table','counter','bed','shelves-jars','shelves-scrolls','storage-jar','incense-altar','cushion','hall-column','buddha','offering-altar','censer','three-pure-ones','goddess','deity-king','daoist-altar','painted-screen','dais','official-chair','judge-desk','reeds','reeds-2','cliff','cliff-2','barred-door'];
// Logical sizes; exported pixels are twice these sizes. Large objects keep the original game footprints.
const sizes=[[16,24],[16,38],[32,67],[32,67],[16,16],[16,16],[16,16],[16,16],[16,26],[16,26],[16,26],[16,28],[16,41],[16,41],[16,38],[16,28],[16,31],[16,16],[16,16],[16,16],[64,28],[16,22],[16,16],[16,16],[16,16],[32,32],[16,16],[16,16],[16,16],[16,16],[16,16],[16,39],[48,43],[48,23],[16,16],[48,42],[16,58],[16,58],[48,23],[48,34],[16,16],[16,30],[48,25],[16,16],[16,16],[16,16],[16,16],[16,24]];
// Physical proportion envelopes: preserve the source aspect ratio within these bounds.
for(const i of [8,9,10])sizes[i]=[32,32];
for(const i of [2,3])sizes[i]=[48,60];
for(const i of [36,37])sizes[i]=[24,48];
sizes[12]=[32,41];sizes[13]=[32,41];sizes[14]=[24,38];sizes[15]=[24,28];
sizes[1]=[24,38];sizes[16]=[24,31];
for(const i of [26,27])sizes[i]=[16,24];
for(const i of [22,23,24,26,27,29])sizes[i]=[32,28];
sizes[4]=[32,64];
sizes[18]=[48,40];sizes[17]=[32,20];sizes[19]=[32,20];
const edges=[[0,192,384,576,768,960,1152,1344,1536],[0,192,392,588,776,968,1155,1344,1536],[0,190,390,590,740,1070,1180,1355,1536],[0,200,400,590,770,950,1140,1340,1536],[0,180,435,565,835,960,1100,1330,1536],[0,265,400,620,790,970,1160,1355,1536]];
const yranges=[[0,207],[207,382],[365,533],[533,693],[690,867],[865,1024]];
(async()=>{
 const dir='assets/tiles/32/objects';fs.mkdirSync(dir,{recursive:true});
 const {data,info}=await sharp('art/generated-remaining-v1/objects-front-source.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const atlas=Buffer.alloc(1024*960*4),index=[];
 for(let i=0;i<48;i++){
  const row=i/8|0,col=i%8;let [yt,yb]=yranges[row],xl=edges[row][col],xr=edges[row][col+1];
  // Per-object margins exclude neighbouring ornaments where source rows overlap.
  if([8,9,10,14].includes(i))yb=365;if(i===39)yb=862;
  if(i===16)yb=535;if(i===17)yt=389;if(i===18)yt=367;if(i===19)yt=400;if(i===20)yt=395;if(i===21)yt=369;
  if(i===32)yt=686;if(i===33)yt=719;if(i===34)yt=716;
  let l=xr,t=yb,r=xl,b=yt;
  for(let y=yt;y<yb;y++)for(let x=xl;x<xr;x++)if(data[(y*info.width+x)*4+3]>=192){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  const [w,h]=sizes[i].map(n=>n*2);
  let raw=await sharp(data,{raw:info}).extract({left:l,top:t,width:r-l+1,height:b-t+1}).resize(w,h,{fit:'contain',position:'south',background:{r:0,g:0,b:0,alpha:0},kernel:'lanczos3'}).raw().toBuffer();
  for(let p=0;p<raw.length;p+=4){if(raw[p+3]<128){raw.fill(0,p,p+4);}else raw[p+3]=255;}
  // Quantize colours, then restore hard alpha for clean pixel edges.
  const quant=await sharp(raw,{raw:{width:w,height:h,channels:4}}).png({palette:true,colours:16,dither:0}).toBuffer();
  raw=await sharp(quant).ensureAlpha().raw().toBuffer();for(let p=3;p<raw.length;p+=4)raw[p]=raw[p]<128?0:255;
  await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toFile(dir+'/'+names[i]+'.png');
  const x=col*128,y=row*160;for(let yy=0;yy<h;yy++)raw.copy(atlas,((y+yy)*1024+x)*4,yy*w*4,(yy+1)*w*4);
  index.push({id:i,name:names[i],file:'objects/'+names[i]+'.png',cell:[col*4,row*5],width:w,height:h,logicalWidth:w/2,logicalHeight:h/2,sourceBounds:[l,t,r+1,b+1]});
 }
 await sharp(atlas,{raw:{width:1024,height:960,channels:4}}).png().toFile('assets/tiles/32/objects.png');
 fs.writeFileSync('assets/tiles/32/objects-index.json',JSON.stringify({tileSize:32,artScale:2,objects:index},null,2)+'\n');
 console.log('Exported 48 objects, individual transparent PNGs and a 32px-grid atlas.');
})().catch(e=>{console.error(e);process.exitCode=1;});
