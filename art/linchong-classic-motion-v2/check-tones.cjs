const fs=require('fs'),sharp=require('sharp'),path=require('path');const d=__dirname;
async function stats(file,outfit){const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let top=256,bottom=0;for(let y=0;y<256;y++)for(let x=0;x<192;x++)if(data[(y*192+x)*4+3]>240){top=Math.min(top,y);bottom=Math.max(bottom,y);}const groups={hair:[],skin:[],cloth:[],trim:[],trousers:[],...(outfit==='exile'?{mantle:[]}: {gold:[]})};for(let y=top;y<=bottom;y++)for(let x=0;x<192;x++){const i=(y*192+x)*4,[r,g,b,a]=data.subarray(i,i+4);if(a<240)continue;const z=(y-top)/(bottom-top),v=.2126*r+.7152*g+.0722*b;
if(z<.19&&r>=g&&g>=b&&r<110)groups.hair.push(v);
if(z>.15&&z<.33&&r>170&&r>g*1.2&&g>b*1.12)groups.skin.push(v);
if(outfit==='official'?g>r+7&&g>b&&g>35:b>r+10&&b>g+4&&b>40)groups.cloth.push(v);
if(r>180&&g>155&&b>130&&r-g<45&&g-b<40)groups.trim.push(v);
if(z>.76&&z<.86&&r<100&&r>=g&&g>=b&&r-g<22)groups.trousers.push(v);
if(outfit==='exile'&&z>.33&&z<.59&&r>85&&r/g>1.04&&r/g<1.32&&g/b>1.03&&g/b<1.38)groups.mantle.push(v);
if(outfit==='official'&&z>.3&&z<.72&&r>70&&r>g&&g>b*1.2&&r/g<1.5)groups.gold.push(v);
}return Object.fromEntries(Object.entries(groups).map(([k,v])=>{v.sort((a,b)=>a-b);return [k,{count:v.length,q:[.1,.5,.9].map(q=>v.length?Math.round(v[Math.floor((v.length-1)*q)]):null)}];}));}
(async()=>{const reports=[];for(const name of ['official-front','exile-left','exile-back']){const outfit=name.split('-')[0],record={name,reference:await stats(d+'/'+name+'-0.png',outfit),before:[],after:[]};for(const c of [1,2]){record.before.push(await stats(path.resolve(d,'../linchong-classic-motion-v1/'+name+'-'+c+'.png'),outfit));record.after.push(await stats(d+'/'+name+'-'+c+'.png',outfit));}reports.push(record);console.log(name);for(const k of Object.keys(record.reference))console.log(k,record.reference[k].q,'old',record.before.map(s=>s[k].q),'new',record.after.map(s=>s[k].q));}fs.writeFileSync(d+'/tone-comparison.json',JSON.stringify(reports,null,2));})();
