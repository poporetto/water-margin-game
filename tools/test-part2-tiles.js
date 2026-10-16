'use strict';
const fs=require('fs'),assert=require('assert/strict'),sharp=require('sharp'),{chromium}=require('playwright');
(async()=>{
const dir='assets/tiles/32/',index=JSON.parse(fs.readFileSync(dir+'part2-index.json'));
for(const [name,size]of Object.entries(index.sheets)){const {data,info}=await sharp(dir+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,size.width);assert.equal(info.height,size.height);for(let p=3;p<data.length;p+=4)assert(data[p]===0||data[p]===255,name+' hard alpha');}
const canon=m=>{for(const [bit,a,b]of[[16,1,2],[32,2,4],[64,4,8],[128,8,1]])if(!(m&a)||!(m&b))m&=~bit;return m;};
let checks=0;
for(const theme of ['marsh','south','dusk','autumn','snow','world'])for(const depth of ['', '-deep']){
 const {data,info}=await sharp(dir+'water-'+theme+depth+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 function pixel(mask,f,x,y){const i=index.canonicalMasks.indexOf(canon(mask)),p=(((i/8|0)*32+f*192+y)*info.width+i%8*32+x)*4;return data.subarray(p,p+4);}
 for(const vertical of [false,true])for(let bits=0;bits<1024;bits++){
  const grid=Array.from({length:3},()=>Array(4).fill(false));grid[1][1]=grid[1][2]=true;let n=0;for(let y=0;y<3;y++)for(let x=0;x<4;x++)if(y!==1||(x!==1&&x!==2))grid[y][x]=!!(bits&(1<<n++));
  function mask(cx){let m=0;const dirs=vertical?[[1,0,1],[0,1,2],[-1,0,4],[0,-1,8],[1,1,16],[-1,1,32],[-1,-1,64],[1,-1,128]]:[[0,-1,1],[1,0,2],[0,1,4],[-1,0,8],[1,-1,16],[1,1,32],[-1,1,64],[-1,-1,128]];for(const[dx,dy,bit]of dirs)if(grid[1+dy][cx+dx])m|=bit;return m;}
  for(let f=0;f<(theme==='world'?2:3);f++){for(let p=0;p<32;p++)assert.deepEqual(vertical?pixel(mask(1),f,p,0):pixel(mask(1),f,31,p),vertical?pixel(mask(2),f,p,31):pixel(mask(2),f,0,p),theme+' bank seam');checks++;}
 }
}
fs.mkdirSync('output/part2',{recursive:true});const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});try{const p=await browser.newPage({viewport:{width:1200,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});await p.goto('http://localhost:8765/tools/part2-tiles.html');await p.waitForFunction(()=>document.querySelectorAll('canvas').length===11);await p.screenshot({path:'output/part2/preview.png',fullPage:true});await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS: '+Object.keys(index.sheets).length+' atlases, hard alpha, '+checks+' shore/frame seam cases, eleven browser scenes, mobile and no missing images.');}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
