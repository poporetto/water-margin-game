'use strict';
const fs=require('fs'),sharp=require('sharp');
(async()=>{const src='art/generated-cliffs-v2/source.png',meta=await sharp(src).metadata(),parts=[];
for(let i=0;i<3;i++){
 const top=Math.round(i*meta.height/3),bottom=Math.round((i+1)*meta.height/3);
 const png=await sharp(src).extract({left:0,top,width:meta.width,height:bottom-top}).resize(128,64).png({palette:true,colours:24,dither:0}).toBuffer();
 const raw=await sharp(png).ensureAlpha().raw().toBuffer();
 // Only the outer repeat joins are matched; the eight interior tiles retain continuous geology.
 for(let y=0;y<64;y++)raw.copy(raw,(y*128+127)*4,y*128*4,y*128*4+4);
 raw.copy(raw,63*128*4,0,128*4);
 parts.push({input:await sharp(raw,{raw:{width:128,height:64,channels:4}}).png().toBuffer(),left:0,top:i*64});
}
await sharp({create:{width:128,height:192,channels:4,background:'#000000'}}).composite(parts).png().toFile('assets/tiles/32/cliff-faces.png');
console.log('Exported three continuous 128x64 cliff faces (eight native 32px tiles per season).');
})().catch(e=>{console.error(e);process.exitCode=1;});
