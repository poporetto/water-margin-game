// Deterministic production export of the generated source art. Requires sharp.
// Run: node tools/build-starter-tiles.js
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..');
const D = process.argv.includes('--32') ? 2 : 1, S = 16 * D;
const OUT = path.join(ROOT, 'assets/tiles', D === 2 ? '32' : '');
const SOURCE = path.join(ROOT, 'art/generated-starter-v1');
const rgb = hex => hex.match(/../g).map(v => parseInt(v, 16));
const palette = ['2e4430','475b32','60713b','798547','939453',
  '76563c','977047','b58b59','c3a070','123e54','18576a','247487',
  '3993a1','7cbbb6','b5cfba','092e45'].map(rgb);
const treePalette = ['182d24','253f29','354e2c','465d31','586d35','6c7e3d','829048','9ca05b',
  '322c21','4a3925','60482c','795b35','907143','aa8955','c5a36d'].map(rgb);
function nearest(r, g, b, colors) {
  let best = colors[0], score = Infinity;
  for (const c of colors) {
    const d = (r-c[0])**2 + (g-c[1])**2 + (b-c[2])**2;
    if (d < score) { best = c; score = d; }
  }
  return best;
}
function pixel(buf, x, y, color, width=S, alpha=255) {
  const i = (y*width+x)*4;
  buf[i]=color[0]; buf[i+1]=color[1]; buf[i+2]=color[2]; buf[i+3]=alpha;
}
function at(buf, x, y, width=S) { return [...buf.subarray((y*width+x)*4,(y*width+x)*4+3)]; }
async function reduce(file, rect, width, height, colors, transparent=false) {
  const {data} = await sharp(file).extract(rect).resize(width,height,{fit:'fill',kernel:'lanczos3'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<data.length;i+=4) {
    const a=transparent && data[i+3]<128 ? 0 : 255;
    const c=a ? nearest(data[i],data[i+1],data[i+2],colors) : [0,0,0];
    data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];data[i+3]=a;
  }
  return data;
}
function seamless(base, colors) {
  const b=Buffer.from(base), avg=(a,c)=>nearest(...a.map((v,i)=>(v+c[i])/2),colors);
  for(let y=1;y<S-1;y++) { const c=avg(at(base,0,y),at(base,S-1,y));pixel(b,0,y,c);pixel(b,S-1,y,c); }
  for(let x=1;x<S-1;x++) { const c=avg(at(base,x,0),at(base,x,S-1));pixel(b,x,0,c);pixel(b,x,S-1,c); }
  for(const [x,y] of [[0,0],[S-1,0],[0,S-1],[S-1,S-1]]) pixel(b,x,y,colors[2]);
  return b;
}
function shareBorder(tile, ref) {
  const b=Buffer.from(tile);
  for(let y=0;y<S;y++) for(let x=0;x<S;x++) if(x===0||x===S-1||y===0||y===S-1) pixel(b,x,y,at(ref,x,y));
  return b;
}
function canonical(mask) {
  // Keep a diagonal only when both adjoining cardinal neighbours are connected.
  for(const [bit,a,b] of [[16,1,2],[32,2,4],[64,4,8],[128,8,1]]) if(!(mask&a)||!(mask&b)) mask&=~bit;
  return mask;
}
async function sheet(name, cells, columns, rows) {
  const width=columns*S, height=rows*S, data=Buffer.alloc(width*height*4);
  cells.forEach((cell,i)=>{
    if(!cell)return;
    for(let y=0;y<S;y++) cell.copy(data,(((i/columns|0)*S+y)*width+(i%columns)*S)*4,y*S*4,(y+1)*S*4);
  });
  await sharp(data,{raw:{width,height,channels:4}}).png().toFile(path.join(OUT,name));
}
async function main() {
  fs.mkdirSync(OUT,{recursive:true});
  const file=path.join(SOURCE,'ground-source.png'), meta=await sharp(file).metadata();
  async function sourceCell(i, colors) {
    const col=i%8,row=i/8|0,left=Math.round(col*meta.width/8),top=Math.round(row*meta.height/4);
    return reduce(file,{left,top,width:Math.round((col+1)*meta.width/8)-left,height:Math.round((row+1)*meta.height/4)-top},S,S,colors);
  }
  const greens=palette.slice(0,5), earth=palette.slice(5,9), blues=palette.slice(9);
  const grass=seamless(await sourceCell(0,greens),greens);
  const dirt=seamless(await sourceCell(8,earth),earth);
  const ground=[];
  for(let i=0;i<8;i++) ground.push(shareBorder(await sourceCell(i,i<6?greens:palette.slice(0,9).concat([palette[14]])),grass));
  const roadCells={};
  for(let mask=0;mask<16;mask++) {
    const tile=Buffer.from(dirt);
    for(let y=0;y<S;y++) for(let x=0;x<S;x++) {
      let distance=99;
      if(!(mask&1))distance=Math.min(distance,y);
      if(!(mask&2))distance=Math.min(distance,S-1-x);
      if(!(mask&4))distance=Math.min(distance,S-1-y);
      if(!(mask&8))distance=Math.min(distance,x);
      if(distance<2*D)pixel(tile,x,y,at(grass,x,y));
      else if(distance===2*D && (x+y)%3===0)pixel(tile,x,y,palette[5]);
    }
    const i=ground.length;roadCells[mask]=[i%8,i/8|0];ground.push(tile);
  }
  const waterBases=[seamless(await sourceCell(19,blues),blues),seamless(await sourceCell(22,blues),blues)];
  const waterFrames=waterBases.map(base=>[0,1,2].map(frame=>{
    const b=Buffer.from(base);
    // Only interior highlights move; shared borders stay identical in every frame.
    for(const [sx,sy] of [[3,5],[9,11]]) for(let k=0;k<3*D;k++)pixel(b,(sx+frame)*D+k,sy*D,palette[12+(frame===1?1:0)]);
    return b;
  }));
  for(const frames of waterFrames)ground.push(...frames);
  ground.push(shareBorder(await sourceCell(9,earth),dirt),shareBorder(await sourceCell(10,earth),dirt));
  await sheet('ground.png',ground,8,4);
  const masks=[...new Set(Array.from({length:256},(_,i)=>canonical(i)))];
  const waterCells=Object.fromEntries(Array.from({length:256},(_,i)=>{const n=masks.indexOf(canonical(i));return [i,[n%8,n/8|0]];}));
  for(let depth=0;depth<2;depth++) {
    const cells=Array(144).fill(null);
    for(let frame=0;frame<3;frame++)for(let i=0;i<masks.length;i++) {
      const mask=masks[i],tile=Buffer.from(waterFrames[depth][frame]);
      for(let y=0;y<S;y++)for(let x=0;x<S;x++) {
        let d=99;
        if(!(mask&1))d=Math.min(d,y);if(!(mask&2))d=Math.min(d,S-1-x);
        if(!(mask&4))d=Math.min(d,S-1-y);if(!(mask&8))d=Math.min(d,x);
        // Rounded inner corners close diagonal gaps in banks.
        if((mask&3)===3 && !(mask&16))d=Math.min(d,Math.hypot(S-1-x,y));
        if((mask&6)===6 && !(mask&32))d=Math.min(d,Math.hypot(S-1-x,S-1-y));
        if((mask&12)===12 && !(mask&64))d=Math.min(d,Math.hypot(x,S-1-y));
        if((mask&9)===9 && !(mask&128))d=Math.min(d,Math.hypot(x,y));
        if(d<2*D)pixel(tile,x,y,at(grass,x,y));
        else if(d<3*D)pixel(tile,x,y,palette[5]);
        else if(d<4*D)pixel(tile,x,y,palette[14]);
      }
      cells[frame*48+i]=tile;
    }
    await sheet(depth?'deep-water.png':'water.png',cells,8,18);
  }
  const tf=path.join(SOURCE,'trees-source.png'),tm=await sharp(tf).metadata();
  const raw=await sharp(tf).ensureAlpha().raw().toBuffer();
  const treeData=Buffer.alloc(64*48*4*D*D),treeInfo=[];
  // The generator did not honour equal-width cells: these are inspected source boundaries.
  for(const [i,[left,right]] of [[0,370],[374,733],[738,1165],[1166,1448]].entries()) {
    let x0=right,y0=tm.height,x1=left,y1=0;
    for(let y=0;y<tm.height;y++)for(let x=left;x<right;x++)if(raw[(y*tm.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    const h=(i<2?28:38)*D;
    let tree=await reduce(tf,{left:x0,top:y0,width:x1-x0+1,height:y1-y0+1},S,h,treePalette,true);
    // Thresholding can remove the thin tip or lowest root; normalize the final opaque bounds.
    let lx=S,ly=h,rx=0,by=0;
    for(let y=0;y<h;y++)for(let x=0;x<S;x++)if(tree[(y*S+x)*4+3]){lx=Math.min(lx,x);ly=Math.min(ly,y);rx=Math.max(rx,x);by=Math.max(by,y);}
    tree=await sharp(tree,{raw:{width:S,height:h,channels:4}}).extract({left:lx,top:ly,width:rx-lx+1,height:by-ly+1}).resize(S,h,{fit:'fill',kernel:'nearest'}).raw().toBuffer();
    // Store at a grid-aligned origin; the runtime bottom-aligns the requested height.
    for(let y=0;y<h;y++)tree.copy(treeData,(y*64*D+i*S)*4,y*S*4,(y+1)*S*4);
    treeInfo.push({number:i+1,name:['Broadleaf rounded','Broadleaf irregular','Pine full','Pine slender'][i],cell:[i,0],width:S,height:h,sourceRect:[x0,y0,x1-x0+1,y1-y0+1]});
  }
  await sharp(treeData,{raw:{width:64*D,height:48*D,channels:4}}).png().toFile(path.join(OUT,'trees.png'));
  roadCells[15]=[[7,2],[6,3],[7,3]];
  const groundNames=['Grass 1','Grass 2','Grass 3','Grass 4','Dark grass 1','Dark grass 2','Flowers 1','Flowers 2',...Array.from({length:16},(_,m)=>'Road connection mask '+m),'Shallow water frame 1','Shallow water frame 2','Shallow water frame 3','Deep water frame 1','Deep water frame 2','Deep water frame 3','Dirt variant 2','Dirt variant 3'];
  const manifest={tileSize:S,logicalTileSize:16,artScale:D,ground:groundNames.map((name,i)=>({number:i+1,name,cell:[i%8,i/8|0]})),palette:palette.map(c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')),roadCells,waterCells,waterFrameOffsets:[[0,0],[0,6],[0,12]],canonicalWaterMasks:masks,trees:treeInfo};
  fs.writeFileSync(path.join(OUT,'starter-index.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('Exported '+S+'px ground, 16 road shapes, 47 shoreline shapes × 3 frames × 2 depths, and four transparent trees.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
