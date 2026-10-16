'use strict';
const sharp=require('sharp');
(async()=>{
const base=await sharp('assets/tiles/32/building-roofs.png').ensureAlpha().raw().toBuffer();
const source=await sharp('art/generated-winter-v1/roofs-source.png').resize(384,192).ensureAlpha().raw().toBuffer();
const raw=Buffer.from(source);
// Preserve the ridge and eave geometry. Match their adjoining scanlines after
// the unused middle slope row is omitted by the compact-roof renderer.
for(let style=0;style<4;style++)for(let x=0;x<96;x++){
 const from=(31*384+style*96+x)*4,to=(64*384+style*96+x)*4;
 for(let c=0;c<3;c++){const edge=raw[from+c];raw[to+c]=edge;raw[to+384*4+c]=Math.round((edge+raw[to+384*4+c])/2);}
}
for(let p=0;p<raw.length;p+=4){if(raw[p+3]<128)base.copy(raw,p,p,p+3);raw[p+3]=base[p+3];}
// All repeated centre bays use matching join pixels, including both corner pieces.
for(let style=0;style<4;style++)for(let y=0;y<192;y++){
 const start=style*96,ref=(y*384+start+32)*4;
 for(const col of [31,32,63,64]){const p=(y*384+start+col)*4;if(raw[p+3])raw.copy(raw,p,ref,ref+3);}
}
const quant=await sharp(raw,{raw:{width:384,height:192,channels:4}}).png({palette:true,colours:32,dither:0}).toBuffer();
const result=await sharp(quant).ensureAlpha().raw().toBuffer();for(let p=3;p<result.length;p+=4)result[p]=base[p];
await sharp(result,{raw:{width:384,height:192,channels:4}}).png().toFile('assets/tiles/32/building-roofs-snow.png');
console.log('Exported continuous winter roof slopes, matched joins and original silhouette alpha.');
})().catch(e=>{console.error(e);process.exitCode=1;});
