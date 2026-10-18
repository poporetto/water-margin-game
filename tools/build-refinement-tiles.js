'use strict';
const sharp=require('sharp'),fs=require('fs');
const src='art/generated-refinements-v1/',dst='assets/tiles/32/';
async function sprite(name,w,h,preserveAspect=false){
 let {data,info}=await sharp(src+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let i=3;i<data.length;i+=4)data[i]=data[i]<200?0:255;
 const png=await sharp(data,{raw:info}).png().toBuffer();
 let out=await sharp(png).trim({threshold:1}).resize(w,h,preserveAspect?{fit:'contain',position:'south',background:{r:0,g:0,b:0,alpha:0}}:{fit:'fill'}).png({palette:true,colours:16,dither:0}).toBuffer();
 let r=await sharp(out).ensureAlpha().raw().toBuffer();for(let i=3;i<r.length;i+=4)r[i]=r[i]<128?0:255;
 await sharp(r,{raw:{width:w,height:h,channels:4}}).png().toFile(dst+name+'-refined.png');
}
(async()=>{
 await sprite('sealed-tablet',64,96);await sprite('counter',128,56);await sprite('statues-wood',144,136,true);
 await sprite('taoist-wood',144,136);
 await sprite('weapon-rack',64,64);
 await sprite('willow-uprooted',128,64,true);
 await sprite('governor-chair',64,64);
 await sprite('rowboat-complete',64,40);await sprite('sampan-empty',128,56);
 let p=await sharp(src+'paving.png').resize(64,64).png({palette:true,colours:16,dither:0}).toBuffer();
 let {data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 // Matching exterior scanlines make the four-cell repeating pattern seamless.
 for(let y=0;y<64;y++)data.copy(data,(y*64+63)*4,(y*64)*4,(y*64+1)*4);
 data.copy(data,63*64*4,0,64*4);
 await sharp(data,{raw:info}).png().toFile(dst+'paving-refined.png');
 // Preserve the existing bronze censer design at the new two-by-two size.
 await sharp(dst+'objects.png').extract({left:256,top:640,width:32,height:32}).resize(64,64,{kernel:'nearest'}).png().toFile(dst+'censer-refined.png');
})();
