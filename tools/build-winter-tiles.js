'use strict';
const sharp=require('sharp');
(async()=>{
const base=await sharp('assets/tiles/32/building-roofs.png').ensureAlpha().raw().toBuffer();
const raw=await sharp('art/generated-winter-v1/roofs-source.png').resize(384,192).ensureAlpha().raw().toBuffer();
for(let p=0;p<raw.length;p+=4){if(raw[p+3]<128)base.copy(raw,p,p,p+3);raw[p+3]=base[p+3];}
const quant=await sharp(raw,{raw:{width:384,height:192,channels:4}}).png({palette:true,colours:32,dither:0}).toBuffer();
const result=await sharp(quant).ensureAlpha().raw().toBuffer();for(let p=3;p<result.length;p+=4)result[p]=base[p];
await sharp(result,{raw:{width:384,height:192,channels:4}}).png().toFile('assets/tiles/32/building-roofs-snow.png');
console.log('Exported snow roofs with original atlas coordinates and exact silhouette alpha.');
})().catch(e=>{console.error(e);process.exitCode=1;});
