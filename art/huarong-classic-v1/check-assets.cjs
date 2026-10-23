const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
(async()=>{
 const root=__dirname,ids=['front','left','back']; const report={checkedAt:new Date().toISOString(),frames:[],checks:{}};
 const raw=await sharp(path.join(root,'huarong-original.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 report.native={width:raw.info.width,height:raw.info.height,transparentPixels:0,opaquePixels:0};
 for(let n=3;n<raw.data.length;n+=4){if(raw.data[n]===0)report.native.transparentPixels++;if(raw.data[n]===255)report.native.opaquePixels++;}
 if(!report.native.transparentPixels||!report.native.opaquePixels)throw Error('Native needs opaque artwork and transparent background');
 const frames=[];
 for(const direction of ids){const r=await sharp(path.join(root,'huarong-'+direction+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});if(r.info.width!==192||r.info.height!==256)throw Error('Invalid frame size');let l=192,t=256,b=-1,rgt=-1,edgePixels=0;for(let y=0;y<256;y++)for(let x=0;x<192;x++)if(r.data[(y*192+x)*4+3]){l=Math.min(l,x);rgt=Math.max(rgt,x);t=Math.min(t,y);b=Math.max(b,y);if(x===0||x===191||y===0||y===255)edgePixels++;}if(edgePixels)throw Error('Artwork touches cell edge '+direction);report.frames.push({direction,width:192,height:256,alphaBounds:[l,t,rgt,b],edgePixels});frames.push(r.data);}
 const strip=await sharp(path.join(root,'huarong-turnaround.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});if(strip.info.width!==576||strip.info.height!==256)throw Error('Turnaround size');
 const sheet=await sharp(path.join(root,'huarong-review-sheet.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});if(sheet.info.width!==576||sheet.info.height!==1024)throw Error('Atlas size');
 for(let row=0;row<4;row++)for(let col=0;col<3;col++)for(let y=0;y<256;y++){const data=sheet.data.subarray(((row*256+y)*576+col*192)*4,((row*256+y)*576+col*192+192)*4);if(row===2){if(data.some(v=>v!==0))throw Error('Right row must be blank');}else{const index=row===3?2:row;if(!data.equals(frames[index].subarray(y*192*4,(y+1)*192*4)))throw Error('Standing rows not identical');}}
 report.checks={nativeTransparency:true,frameDimensions:true,noCellEdgeClipping:true,turnaroundDimensions:true,atlasDimensions:true,repeatedStandingRowsIdentical:true,rightRowBlank:true};
 fs.writeFileSync(path.join(root,'asset-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})();
