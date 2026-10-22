// User-authorized colour-only correction. Source coordinates and every alpha byte are immutable.
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const d=__dirname,src=path.resolve(d,'../linchong-classic-motion-v1');
const targets=new Set(['official-front','exile-left','exile-back']),dirs=['front','left','right','back'];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function rgbLab(r,g,b){const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};r=lin(r);g=lin(g);b=lin(b);const f=v=>v>.008856?Math.cbrt(v):7.787*v+16/116;const x=f((.4124564*r+.3575761*g+.1804375*b)/.95047),y=f(.2126729*r+.7151522*g+.072175*b),z=f((.0193339*r+.119192*g+.9503041*b)/1.08883);return [116*y-16,500*(x-y),200*(y-z)];}
function labRgb(L,a,b){let y=(L+16)/116,x=a/500+y,z=y-b/200;const f=v=>v**3>.008856?v**3:(v-16/116)/7.787;x=.95047*f(x);y=f(y);z=1.08883*f(z);const enc=v=>Math.round(clamp(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055,0,1)*255);return [enc(3.2404542*x-1.5371385*y-.4985314*z),enc(-.969266*x+1.8760108*y+.041556*z),enc(.0556434*x-.2040259*y+1.0572252*z)];}
function q(v,p){const pos=(v.length-1)*p,i=Math.floor(pos);return v[i]+(v[Math.min(i+1,v.length-1)]-v[i])*(pos-i);}
function groups(image,outfit){const {data,info}=image;let top=info.height,bottom=0;for(let i=3;i<data.length;i+=4)if(data[i]>200){const y=Math.floor((i/4)/info.width);top=Math.min(top,y);bottom=Math.max(bottom,y);}const labels=[],samples={},labs=[];
 for(let i=0;i<data.length;i+=4){const [r,g,b,a]=data.subarray(i,i+4),y=Math.floor(i/4/info.width),z=(y-top)/Math.max(1,bottom-top),lab=rgbLab(r,g,b);labs.push(lab);let group='';
  if(a&&lab[0]>3){
   if(r>150&&r-g>44&&g-b>20)group='skin';
   else if(outfit==='official'?g>r+6&&g>b-2:b>r+9&&b>g+3)group='cloth';
   else if(z<.29||(z<.37&&lab[0]<25))group='hair';
   else if(outfit==='exile'&&z>.29&&z<.61&&r>=g&&g>=b-4)group='mantle';
   else if(r>150&&g>135&&b>105&&r-g<45&&g-b<48)group='ivory';
   else if(outfit==='official'&&z>.29&&z<.72&&r>65&&r>=g&&g-b>16&&r-g<38)group='gold';
   else if(z>.67&&z<.89&&r<110&&Math.max(r,g,b)-Math.min(r,g,b)<30)group='trousers';
   else if(lab[0]<23&&Math.max(r,g,b)-Math.min(r,g,b)<14)group='darkDetails';
   else group='leather';
  }
  labels.push(group);if(group&&a>=240)(samples[group]??=[]).push(lab);
 }
 return {labels,samples,labs};}
function summaries(samples){return Object.fromEntries(Object.entries(samples).map(([k,p])=>[k,{count:p.length,channels:[0,1,2].map(c=>p.map(v=>v[c]).sort((a,b)=>a-b))}]));}
const quantiles=[.01,.05,.15,.3,.5,.7,.85,.95,.99];
function transfer(source,reference){const knots=[];for(const p of quantiles){const x=q(source,p),y=q(reference,p);if(knots.length&&x-knots.at(-1)[0]<.3)continue;knots.push([x,y]);}return v=>{let n=1;while(n<knots.length-1&&v>knots[n][0])n++;const [x0,y0]=knots[n-1],[x1,y1]=knots[n],slope=clamp((y1-y0)/(x1-x0),.25,3);return clamp(y0+(v-x0)*slope,0,100);};}
async function rgba(file){return sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
async function grid(rows,file){const w=576,h=rows.length*256,data=Buffer.alloc(w*h*4);for(let r=0;r<rows.length;r++)for(let c=0;c<3;c++){const p=await sharp(rows[r][c]).ensureAlpha().raw().toBuffer();for(let y=0;y<256;y++)p.copy(data,((r*256+y)*w+c*192)*4,y*192*4,(y+1)*192*4);}await sharp(data,{raw:{width:w,height:h,channels:4}}).png().toFile(file);}
(async()=>{const report=[];for(const outfit of ['official','exile']){const rows=[];for(const dir of dirs){const name=outfit+'-'+dir,frames=[0,1,2].map(c=>fs.readFileSync(src+'/'+name+'-'+c+'.png'));if(targets.has(name)){const ref=groups(await rgba(frames[0]),outfit),reference=summaries(ref.samples);for(const c of [1,2]){const image=await rgba(frames[c]),before=groups(image,outfit),current=summaries(before.samples),maps={},params={};
 for(const [group,s]of Object.entries(current)){const r=reference[group];if(!r||r.count<12||s.count<12)continue;const da=q(r.channels[1],.5)-q(s.channels[1],.5),db=q(r.channels[2],.5)-q(s.channels[2],.5);maps[group]={lightness:transfer(s.channels[0],r.channels[0]),da,db};params[group]={samples:[r.count,s.count],before:[.1,.5,.9].map(p=>q(s.channels[0],p)),reference:[.1,.5,.9].map(p=>q(r.channels[0],p)),chromaOffset:[da,db]};}
 const output=Buffer.from(image.data);for(let pixel=0;pixel<before.labels.length;pixel++){const m=maps[before.labels[pixel]];if(!m)continue;const [L,a,b]=before.labs[pixel],rgb=labRgb(m.lightness(L),a+m.da,b+m.db);for(let ch=0;ch<3;ch++)output[pixel*4+ch]=rgb[ch];}
 // Sample AFTER using the same immutable material membership as BEFORE, so label changes cannot hide a regression.
 for(const [group,p]of Object.entries(params)){const values=[];for(let px=0;px<before.labels.length;px++)if(before.labels[px]===group&&output[px*4+3]>=240)values.push(rgbLab(...output.subarray(px*4,px*4+3))[0]);values.sort((a,b)=>a-b);p.after=[.1,.5,.9].map(qv=>q(values,qv));}
 frames[c]=await sharp(output,{raw:image.info}).png().toBuffer();report.push({name,frame:c,materials:params});
 }}for(let c=0;c<3;c++)fs.writeFileSync(d+'/'+name+'-'+c+'.png',frames[c]);rows.push(frames);await grid([frames],d+'/'+name+'-strip.png');}
 await grid(rows,d+'/'+outfit+'-walking.png');fs.copyFileSync(src+'/'+outfit+'-standing.png',d+'/'+outfit+'-standing.png');}
 fs.writeFileSync(d+'/colour-report.json',JSON.stringify({method:'Continuous material-specific Lab lightness transfer; median Lab chroma offsets. No redraw, resampling or palette quantization.',source:src,targets:[...targets],frame:[192,256],artScale:8,report},null,2));console.log('Corrected six frames from v1; preserved other frames and alpha.');})();
