'use strict';
const fs=require('fs'),sharp=require('sharp');
const root='assets/tiles/32/',src='art/generated-part2-v1/',manifest={tileSize:32,sheets:{},items:[]};
const themes=['marsh','south','dusk','autumn','snow','world'];
const canonical=m=>{for(const [bit,a,b]of[[16,1,2],[32,2,4],[64,4,8],[128,8,1]])if(!(m&a)||!(m&b))m&=~bit;return m;};
const masks=[...new Set(Array.from({length:256},(_,i)=>canonical(i)))];
async function save(name,cells,cols,rows,sw=32,sh=32){const out=Buffer.alloc(cols*sw*rows*sh*4);cells.forEach((cell,i)=>{if(!cell)return;for(let y=0;y<sh;y++)cell.copy(out,(((i/cols|0)*sh+y)*cols*sw+i%cols*sw)*4,y*sw*4,(y+1)*sw*4);});await sharp(out,{raw:{width:cols*sw,height:rows*sh,channels:4}}).png().toFile(root+name+'.png');manifest.sheets[name]={width:cols*sw,height:rows*sh};}
async function cell(file,col,row,cols,rows,w=32,h=32,transparent=false){
 const m=await sharp(file).metadata(),tree=file.endsWith('trees.png'),xs=tree?[0,392,810,1160,m.width]:null,ys=tree?[0,382,727,m.height]:null,left=tree?xs[col]:Math.round(col*m.width/cols),top=tree?ys[row]:Math.round(row*m.height/rows);
 const special=file.endsWith('supplement.png')&&row===1&&col===0?{left:0,top:390,width:440,height:330}:file.endsWith('interior.png')&&row===3&&col===3?{left:760,top:820,width:330,height:185}:null;
 let {data,info}=await sharp(file).extract(special||{left,top,width:(tree?xs[col+1]:Math.round((col+1)*m.width/cols))-left,height:(tree?ys[row+1]:Math.round((row+1)*m.height/rows))-top}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(transparent){
  // Isolate the largest connected silhouette, discarding neighbouring tips in grid margins.
  const seen=new Uint8Array(info.width*info.height);let best=[];
  for(let n=0;n<seen.length;n++){if(seen[n]||data[n*4+3]<128)continue;const q=[n];seen[n]=1;for(let i=0;i<q.length;i++){const p=q[i],x=p%info.width,y=p/info.width|0;for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,k=yy*info.width+xx;if(xx<0||yy<0||xx>=info.width||yy>=info.height||seen[k]||data[k*4+3]<128)continue;seen[k]=1;q.push(k);}}if(q.length>best.length)best=q;}
  const keep=new Set(best);for(let n=0;n<seen.length;n++)if(!keep.has(n))data.fill(0,n*4,n*4+4);
 }
 let im=sharp(data,{raw:info});if(transparent)im=sharp(await im.png().toBuffer()).trim({threshold:30});
 const index=row*cols+col,fill=tree||!transparent||(file.endsWith('interior.png')&&index<8)||(file.endsWith('supplement.png')&&index<4);
 data=await im.resize(w,h,{fit:fill?'fill':'contain',position:'south',background:'#00000000'}).ensureAlpha().raw().toBuffer();
 for(let p=3;p<data.length;p+=4)data[p]=transparent?(data[p]<128?0:255):255;
 data=await sharp(await sharp(data,{raw:{width:w,height:h,channels:4}}).png({palette:true,colours:16,dither:0}).toBuffer()).ensureAlpha().raw().toBuffer();for(let p=3;p<data.length;p+=4)data[p]=transparent?(data[p]<128?0:255):255;return data;
}
function borders(b,ref=b,w=32,h=32){const orig=Buffer.from(ref);for(let y=0;y<h;y++)for(const x of[0,w-1])orig.copy(b,(y*w+x)*4,y*w*4,y*w*4+4);for(let x=0;x<w;x++)for(const y of[0,h-1])orig.copy(b,(y*w+x)*4,x*4,x*4+4);for(const p of[0,w-1,(h-1)*w,w*h-1])orig.copy(b,p*4,0,4);return b;}
function shift(b,n){const out=Buffer.alloc(b.length);for(let y=0;y<32;y++)for(let x=0;x<32;x++)b.copy(out,(y*32+x)*4,(((y+n)%32)*32+(x+n)%32)*4,(((y+n)%32)*32+(x+n)%32)*4+4);return out;}
function maskTile(base,bank,mask,edge){const out=Buffer.from(base);for(let y=0;y<32;y++)for(let x=0;x<32;x++){let d=99;if(!(mask&1))d=Math.min(d,y);if(!(mask&2))d=Math.min(d,31-x);if(!(mask&4))d=Math.min(d,31-y);if(!(mask&8))d=Math.min(d,x);for(const[bits,diag,cx,cy]of[[3,16,31,0],[6,32,31,31],[12,64,0,31],[9,128,0,0]])if((mask&bits)===bits&&!(mask&diag))d=Math.min(d,Math.hypot(x-cx,y-cy));const p=(y*32+x)*4;if(d<4)bank.copy(out,p,p,p+4);else if(d<5&&edge){out[p]=edge[0];out[p+1]=edge[1];out[p+2]=edge[2];}}return out;}
(async()=>{
for(let row=0;row<6;row++){const theme=themes[row],raw=[];for(let c=0;c<8;c++)raw.push(borders(await cell(src+'terrain.png',c,row,8,6)));
if(row>=3){raw[0]=await sharp(root+'seasonal-ground.png').extract({left:0,top:(row-3)*32,width:32,height:32}).ensureAlpha().raw().toBuffer();}
raw[1]=borders(shift(raw[0],7),raw[0]);
const ground=[raw[0],borders(raw[1],raw[0]),borders(shift(raw[0],9),raw[0]),borders(shift(raw[1],17),raw[0]),borders(raw[2],raw[0]),borders(shift(raw[2],11),raw[0]),borders(raw[3],raw[0]),borders(shift(raw[3],13),raw[0])];
for(const mask of masks)ground.push(maskTile(raw[4],raw[0],mask,null));ground.push(raw[4],borders(shift(raw[4],9),raw[4]),borders(shift(raw[4],19),raw[4]),raw[7],borders(shift(raw[7],13),raw[7]));await save('regional-'+theme,ground,8,8);
for(let depth=0;depth<2;depth++){const frames=theme==='world'?2:3,cells=Array(frames*48).fill(null);for(let f=0;f<frames;f++){const base=borders(shift(raw[5+depth],f*2),raw[5+depth]);for(let i=0;i<47;i++)cells[f*48+i]=maskTile(base,raw[0],masks[i],theme==='world'?[61,72,64]:theme==='snow'?[222,234,239]:null);}await save('water-'+theme+(depth?'-deep':''),cells,8,frames*6);}
manifest.items.push({theme,ground:'regional-'+theme,grass:[0,1,2,3],longGrass:[4,5],flowers:[6,7],roadMasks:masks.map((mask,i)=>({mask,cell:[(i+8)%8,(i+8)/8|0]})),roadVariants:[55,56,57],special:[58,59]});}
const treeCells=[];for(let r=0;r<3;r++)for(let c=0;c<4;c++){const h=c<2?56:76,b=await cell(src+'trees.png',c,r,4,3,32,h,true),pad=Buffer.alloc(32*96*4);b.copy(pad);treeCells.push(pad);manifest.items.push({name:themes[r]+'-'+['broadleaf-1','broadleaf-2','pine-1','pine-2'][c],sheet:'regional-trees',cell:[c,r*3],width:32,height:h});}await save('regional-trees',treeCells,4,3,32,96);
const names=['wall-left','wall-middle','wall-middle-2','wall-scroll','wall-right','wall-inner-corner','wall-outer-corner','inside-door','dais-front','dais-left','dais-right','dais-front-left','dais-front-right','bars-left','bars-middle','bars-right','bars-top','bars-vertical','bars-bottom','bars-junction','cell-door','straw-pallet','snow-lantern','snow-reeds'];const objs=[];
for(let i=0;i<24;i++){const w=i===21?64:32,h=i<8?64:i===21?36:i===22?56:32,b=await cell(src+'interior.png',i%6,i/6|0,6,4,w,h,true),pad=Buffer.alloc(64*64*4);for(let y=0;y<h;y++)b.copy(pad,y*64*4,y*w*4,(y+1)*w*4);objs.push(pad);manifest.items.push({number:i+1,name:names[i],sheet:'part2-objects',cell:[(i%6)*2,(i/6|0)*2],width:w,height:h});}await save('part2-objects',objs,6,4,64,64);
for(let row=0;row<2;row++){const cells=[];for(let col=0;col<2;col++){const b=await cell(src+'gates.png',col,row,2,2,128,90,true),pad=Buffer.alloc(128*96*4);b.copy(pad);cells.push(pad);}await save('gate-'+(row?'autumn':'snow'),cells,1,2,128,96);}
const extra=[];for(let i=0;i<12;i++){if(i===7){extra.push(Buffer.alloc(64*64*4));continue;}const w=i===4?64:32,h=i===4?40:32,b=await cell(src+'supplement.png',i%4,i/4|0,4,3,w,h,true),pad=Buffer.alloc(64*64*4);for(let y=0;y<h;y++)b.copy(pad,y*64*4,y*w*4,(y+1)*w*4);extra.push(pad);}await save('part2-extra',extra,4,3,64,64);manifest.extra=['snow-wall-left','snow-wall-middle','snow-wall-right','snow-crenellations','snow-rowboat','snow-reeds-1','snow-reeds-2','unused','world-reeds-1','world-reeds-2','vegetables-1','vegetables-2'].map((name,i)=>({number:i+1,name,cell:[i%4*2,(i/4|0)*2]}));const vegBase=borders(await cell(src+'terrain.png',7,1,8,6)),vegBank=borders(await cell(src+'terrain.png',0,1,8,6)),vegCells=Array(96).fill(null);
for(let v=0;v<2;v++)for(let i=0;i<47;i++)vegCells[v*48+i]=maskTile(borders(shift(vegBase,v*11),vegBase),vegBank,masks[i],[101,72,43]);
await save('vegetables',vegCells,8,12);
manifest.vegetables={sheet:'vegetables',masks:masks.map((mask,i)=>({mask,variants:[[i%8,i/8|0],[i%8,(i/8|0)+6]]}))};
manifest.canonicalMasks=masks;fs.writeFileSync(root+'part2-index.json',JSON.stringify(manifest,null,2));console.log('Exported regional terrain, 47-shape animated water, trees, interiors, prison pieces, gates and supplements.');
})().catch(e=>{console.error(e);process.exitCode=1;});
