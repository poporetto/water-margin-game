// Production export of Northern Song building source art; requires sharp.
'use strict';
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const D=process.argv.includes('--32')?2:1;
const ROOT=path.resolve(__dirname,'..'),SOURCE=path.join(ROOT,'art/generated-buildings-v1'),OUT=path.join(ROOT,'assets/tiles',D===2?'32':'');
const palette=['181b1c','303638','4b5151','666b68','898b7e','b0ad9b','d0c8ac','e8dfc5','30251d','503629','73503a','99704b','bea16a','4a241e','78382a','a34f38'].map(h=>h.match(/../g).map(v=>parseInt(v,16)));
const thatchPalette=['211e18','39291c','51371f','694725','80592f','966c3d','a97f49','ba9054','c7a165','d6b67b','e5c68c','f0d69f','4a241e','78382a','a34f38','99704b'].map(h=>h.match(/../g).map(v=>parseInt(v,16)));
function color(r,g,b,colors=palette){let score=Infinity,best;for(const c of colors){const d=(r-c[0])**2+(g-c[1])**2+(b-c[2])**2;if(d<score){score=d;best=c;}}return best;}
function put(dst,dw,src,sw,sh,dx,dy){dw*=D;sw*=D;sh*=D;dx*=D;dy*=D;for(let y=0;y<sh;y++)src.copy(dst,((dy+y)*dw+dx)*4,y*sw*4,(y+1)*sw*4);}
function crop(data,w,left,top,width,height){w*=D;left*=D;top*=D;width*=D;height*=D;const out=Buffer.alloc(width*height*4);for(let y=0;y<height;y++)data.copy(out,y*width*4,((y+top)*w+left)*4,((y+top)*w+left+width)*4);return out;}
async function resize(data,sw,sh,w,h){return sharp(data,{raw:{width:sw*D,height:sh*D,channels:4}}).resize(w*D,h*D,{fit:'fill',kernel:'nearest'}).raw().toBuffer();}
async function image(file){const{data,info}=await sharp(path.join(SOURCE,file+'-source.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});return {data,w:info.width,h:info.height};}
async function extract(im,rect,w,h,cutTop=0,opaque=false,colors=palette){
 let [left,top,right,bottom]=rect,x0=right,y0=bottom,x1=left,y1=top;
 for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(im.data[(y*im.w+x)*4+3]>=192){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 y0+=Math.round((y1-y0)*cutTop);
 const data=await sharp(im.data,{raw:{width:im.w,height:im.h,channels:4}}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(w*D,h*D,{fit:'fill',kernel:'lanczos3'}).raw().toBuffer();
 for(let i=0;i<data.length;i+=4){const a=data[i+3]>=128?255:0,c=a?color(data[i],data[i+1],data[i+2],colors):opaque?(Array.isArray(opaque)?opaque:palette[6]):[0,0,0];data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];data[i+3]=opaque?255:a;}
 return data;
}
async function save(name,data,w,h){await sharp(data,{raw:{width:w*D,height:h*D,channels:4}}).png().toFile(path.join(OUT,name+'.png'));}
async function main(){
 fs.mkdirSync(OUT,{recursive:true});
 const roof=await image('roofs'),walls=await image('walls'),gate=await image('gate');
 const roofs=Buffer.alloc(192*96*4*D*D);
 for(let i=0;i<4;i++){
  const x=i%2,y=i/2|0,full=await extract(roof,[Math.round(x*roof.w/2),Math.round(y*roof.h/2),Math.round((x+1)*roof.w/2),Math.round((y+1)*roof.h/2)],48,38,0,false,i===1?thatchPalette:palette);
  put(roofs,192,crop(full,48,0,0,48,16),48,16,i*48,0);
  // Repeating middle slope: use only the central texture, without ridge or eave.
  const tex=crop(full,48,16,12,16,12),middle=await resize(tex,16,12,16,16);
  for(let col=0;col<3;col++)put(roofs,192,middle,16,16,i*48+col*16,16);
  put(roofs,192,crop(full,48,0,16,48,22),48,22,i*48,32);
  put(roofs,192,await resize(full,48,38,48,22),48,22,i*48,64);
 }
 await save('building-roofs',roofs,192,96);
 const cells=[];
 for(let i=0;i<32;i++){
  const col=i%8,row=i/8|0,wall=[0,1,2,3,4,5,6,7,8,25,26,27,29].includes(i),opaque=wall||[9,10,11,15,16,30].includes(i);
  cells.push(await extract(walls,[Math.round(col*walls.w/8),Math.round(row*walls.h/4),Math.round((col+1)*walls.w/8),Math.round((row+1)*walls.h/4)],16,16,wall?.30:0,i===4?palette[0]:opaque));
 }
 // Remove masonry battlements from fill pieces; keep separate crest sprites.
 for(const i of [9,10,11])cells[i]=await resize(crop(cells[10],16,2,7,12,7),12,7,16,16);
 // Regularize masonry courses and paving joints so repeated tiles form continuous construction.
 for(const i of [9,10,11,15,16])for(let y=0;y<16*D;y++)for(let x=0;x<16*D;x++){
  const p=(y*16*D+x)*4,paving=i>=15,course=(paving?8:4)*D,offset=(Math.floor(y/course)%2)*4*D;
  const joint=y%course===course-1||(x+offset)%(8*D)===8*D-1;
  let c=joint?palette[2]:palette[paving?4:3];
  if(!joint&&y%course===0)c=palette[paving?5:4];
  else if(!joint&&x>0&&x<16*D-1&&y>0&&y<16*D-1&&((x*7+y*11+i*3)%29===0))c=palette[paving?3:4];
  cells[i][p]=c[0];cells[i][p+1]=c[1];cells[i][p+2]=c[2];cells[i][p+3]=255;
 }
 // Upper plaster walls do not repeat a stone footing between storey rows.
 for(let k=0;k<3;k++)cells[25+k]=await resize(crop(cells[k],16,0,0,16,12),16,12,16,16);
 // The outside of each corner post is transparent, including the upper facade variants.
 for(const i of [0,2,25,27])for(let y=3*D;y<16*D;y++)for(let x=0;x<4*D;x++){
  const xx=(i===0||i===25)?x:16*D-1-x,p=(y*16*D+xx)*4;
  cells[i].fill(0,p,p+4);
 }
 // Red official walls use red plaster/wood, while ordinary walls stay off-white.
 for(const i of [6,7,8,29])for(let p=0;p<cells[i].length;p+=4)if(cells[i][p]>150&&Math.abs(cells[i][p]-cells[i][p+1])<50){cells[i][p]=palette[15][0];cells[i][p+1]=palette[15][1];cells[i][p+2]=palette[15][2];}
 // A roofless repeating masonry fill and transparent top crest are distinct pieces.
 const wallData=Buffer.alloc(128*64*4*D*D);cells.forEach((c,i)=>put(wallData,128,c,16,16,(i%8)*16,(i/8|0)*16));
 await save('building-walls',wallData,128,64);
 const original=await extract(gate,[0,0,gate.w,gate.h],64,45),gates=Buffer.alloc(64*96*4*D*D),open=Buffer.alloc(64*45*4*D*D);
 put(open,64,await resize(crop(original,64,0,0,23,45),23,45,16,45),16,45,0,0);
 put(open,64,await resize(crop(original,64,23,0,18,45),18,45,32,45),32,45,16,0);
 put(open,64,await resize(crop(original,64,41,0,23,45),23,45,16,45),16,45,48,0);
 // The last 16 rows of the passage must stay visually open across every walkable G tile.
 for(let y=29*D;y<45*D;y++)for(let x=16*D;x<48*D;x++){const p=(y*64*D+x)*4;open[p]=open[p+1]=open[p+2]=open[p+3]=0;}
 put(gates,64,open,64,45,0,0);
 const closed=Buffer.from(open);put(closed,64,cells[5],16,16,16,29);put(closed,64,cells[5],16,16,32,29);put(gates,64,closed,64,45,0,48);
 await save('building-gate',gates,64,96);
 const names=['Plaster left','Plaster middle','Plaster right','Vertical-slat window','Open double door','Barred double door','Red wall left','Red wall middle','Red wall right','Masonry left','Masonry middle','Masonry right','Battlement left','Battlement middle','Battlement right','Stone paving 1','Stone paving 2','Horizontal fence','Vertical fence','Fence NW','Fence NE','Fence SW','Fence SE','Fence post','Well','Upper plaster left','Upper plaster middle','Upper plaster right','Red column','Red wall slat window','Closed door variant','Stone footing'];
 fs.writeFileSync(path.join(OUT,'building-index.json'),JSON.stringify({tileSize:16*D,logicalTileSize:16,artScale:D,thatchPalette:thatchPalette.map(c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')),palette:palette.map(c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')),walls:names.map((name,i)=>({number:i+1,name,cell:[i%8,i/8|0]})),roofs:['Town grey tile','Village thatch','Official dark tile','Shrine warm grey tile'].map((name,i)=>({name,column:i*3,width:3,topRow:0,middleRow:1,eaveRow:2,singleRow:4,eaveHeight:22*D})),gate:{width:64*D,height:45*D,openOrigin:[0,0],closedOrigin:[0,48*D],piers:16*D,passage:32*D}},null,2)+'\n');
 console.log('Exported 4 modular Song roof styles, 32 wall/fixture tiles and open/closed gates.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
