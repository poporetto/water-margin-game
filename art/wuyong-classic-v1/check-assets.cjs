const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const dir=__dirname;
function assert(value,message){if(!value)throw Error(message);}
(async()=>{
 const native=await sharp(path.join(dir,'wuyong-original.png')).metadata();
 assert(native.hasAlpha,'Native source must have alpha');
 const sheet=await sharp(path.join(dir,'wuyong-review-sheet.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert(sheet.info.width===576&&sheet.info.height===1024,'Review atlas dimensions');
 const checks=[];
 for(const [i,name] of ['front','left','back'].entries()){
  const {data,info}=await sharp(path.join(dir,'wuyong-'+name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert(info.width===192&&info.height===256,name+' frame size');
  let left=192,top=256,right=-1,bottom=-1,nonTransparentPixels=0,partialAlphaPixels=0;
  for(let y=0;y<256;y++)for(let x=0;x<192;x++){let a=data[(y*192+x)*4+3];if(a>0){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);nonTransparentPixels++;if(a<255)partialAlphaPixels++;}}
  assert(left>0&&right<191&&top>0&&bottom<255,name+' alpha touches cell edge');
  const row=[0,1,3][i];
  for(let col=0;col<3;col++)for(let y=0;y<256;y++)assert(data.subarray(y*192*4,(y+1)*192*4).equals(sheet.data.subarray(((row*256+y)*576+col*192)*4,((row*256+y)*576+col*192+192)*4)),name+' repeated cell mismatch');
  checks.push({name,dimensions:[192,256],alphaBounds:[left,top,right,bottom],nonTransparentPixels,partialAlphaPixels,noClipping:true,losslessPacking:true});
 }
 for(let y=512;y<768;y++)for(let x=0;x<576;x++)assert(sheet.data[(y*576+x)*4+3]===0,'Right row is not blank');
 const result={nativeSource:[native.width,native.height],nativeAlpha:native.hasAlpha,checks,rightRowBlank:true,standingOnly:true};
 fs.writeFileSync(path.join(dir,'asset-checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
})();
