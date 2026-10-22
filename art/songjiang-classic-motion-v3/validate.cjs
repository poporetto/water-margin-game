const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path');
(async()=>{const report={sides:[],colourStats:[],headShoulderLock:false};
for(const file of ['songjiang-walking.png','songjiang-walking-96.png','songjiang-walking-master.png']){
 const current=path.join(__dirname,file),old=path.join(__dirname,'../songjiang-classic-motion-v2',file),meta=await sharp(current).metadata(),h=meta.height/4;
 const crop={left:0,top:h,width:meta.width,height:h*2};
 const a=await sharp(current).extract(crop).raw().toBuffer(),b=await sharp(old).extract(crop).raw().toBuffer();
 if(!a.equals(b))throw Error('Approved side frames changed: '+file);
 report.sides.push({file,pixelIdentical:true});
}
for(const row of [0,3]){const values=[];for(let col=0;col<3;col++){
 const p=await sharp(path.join(__dirname,'songjiang-walking.png')).extract({left:col*192,top:row*256,width:192,height:256}).raw().toBuffer(),reds=[],gold=[];
 for(let i=0;i<p.length;i+=4){if(p[i+3]<200)continue;const [r,g,b]=p.subarray(i,i+3);if(r>75&&r>g*2&&r>b*2)reds.push(r);if(r>140&&g>80&&g<r*.9&&b<g*.5)gold.push(.2126*r+.7152*g+.0722*b);}
 const median=a=>a.sort((a,b)=>a-b)[Math.floor(a.length/2)];values.push({redMedian:median(reds),goldLumaMedian:median(gold)});
 }report.colourStats.push({direction:row===0?'front':'back',values});
}
const meta=JSON.parse(await fs.readFile(path.join(__dirname,'frames.json'),'utf8'));report.frameTops=meta.tops;
await fs.writeFile(path.join(__dirname,'validation.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
