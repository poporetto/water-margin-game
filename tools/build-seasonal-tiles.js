'use strict';
const fs=require('fs'),sharp=require('sharp');
const root='assets/tiles/32/';
async function objects(src,label,xs,ys,names,sizes,cols,slotW,slotH){
 const {data,info}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});const atlas=Buffer.alloc(cols*slotW*(names.length/cols)*slotH*4),index=[];fs.mkdirSync(root+label,{recursive:true});
 for(let i=0;i<names.length;i++){let col=i%cols,row=i/cols|0,l=xs[col+1],r=xs[col],t=ys[row+1],b=ys[row];for(let y=ys[row];y<ys[row+1];y++)for(let x=xs[col];x<xs[col+1];x++)if(data[(y*info.width+x)*4+3]>=192){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
 const [w,h]=sizes[i% sizes.length];let raw=await sharp(data,{raw:info}).extract({left:l,top:t,width:r-l+1,height:b-t+1}).resize(w,h,{fit:'contain',position:'south',background:'#00000000'}).raw().toBuffer();for(let p=3;p<raw.length;p+=4)raw[p]=raw[p]<128?0:255;
 raw=await sharp(await sharp(raw,{raw:{width:w,height:h,channels:4}}).png({palette:true,colours:16,dither:0}).toBuffer()).ensureAlpha().raw().toBuffer();for(let p=3;p<raw.length;p+=4)raw[p]=raw[p]<128?0:255;
 await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toFile(root+label+'/'+names[i]+'.png');for(let y=0;y<h;y++)raw.copy(atlas,((row*slotH+y)*cols*slotW+col*slotW)*4,y*w*4,(y+1)*w*4);index.push({name:names[i],file:label+'/'+names[i]+'.png',cell:[col*slotW/32,row*slotH/32],width:w,height:h});}
 await sharp(atlas,{raw:{width:cols*slotW,height:names.length/cols*slotH,channels:4}}).png().toFile(root+label+'.png');fs.writeFileSync(root+label+'-index.json',JSON.stringify(index,null,2));
}
(async()=>{
 await objects('art/generated-seasonal-v1/nature-source.png','seasonal-nature',[0,224,411,545,773,964,1142,1329,1536],[0,357,675,1024],['spring','autumn','snow'].flatMap(s=>['broadleaf','pine','poplar','willow','bamboo','dead-tree','boulder','cliff'].map(n=>s+'-'+n)),[[48,64],[48,88],[48,88],[96,120],[64,128],[48,56],[32,32],[32,32]],8,96,128);
 await objects('art/generated-world-v1/icons-source.png','world-icons',[0,405,787,1145,1536],[0,255,503,744,1024],['city','town','village','manor','temple','fort','inn','ruin','pass','forest','marsh','fortress','mountain','peak-1','peak-2','woodland'],[[96,64]],4,96,64);
 require('child_process').execFileSync(process.execPath,['tools/build-cliff-tiles.js'],{stdio:'inherit'});
 // Reuse the tested seamless surface exporter for the twelve seasonal textures.
 let script=fs.readFileSync('tools/build-surface-tiles.js','utf8').replace(/const names=.*?;/,"const names=['autumn-1','autumn-2','autumn-long','autumn-flowers','snow-1','snow-2','snow-shade','snow-tufts','silk-1','silk-2','silk-3','silk-road'];").replaceAll('generated-surfaces-v1/surfaces-source','generated-seasonal-v1/ground-source').replaceAll('i<16','i<12').replaceAll('meta.height/4','meta.height/3').replace('[[0,1],[2,3],[4,5],[6],[7],[8,9,10],[11],[12,13],[14],[15]]','[[0,1,2,3],[4,5,6,7],[8,9,10],[11]]').replaceAll('32/surfaces','32/seasonal-ground').replaceAll("'surfaces/'","'seasonal-ground/'").replace('16 seamless','12 seamless');
 const Module=require('module'),m=new Module(__filename,module);m.filename=__filename;m.paths=module.paths;m._compile(script,__filename);
})().catch(e=>{console.error(e);process.exitCode=1;});
