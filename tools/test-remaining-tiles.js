'use strict';
const fs=require('fs'),assert=require('assert/strict'),sharp=require('sharp'),{chromium}=require('playwright');
(async()=>{
 const dir='assets/tiles/32/',index=JSON.parse(fs.readFileSync(dir+'objects-index.json'));assert.equal(index.objects.length,48);
 for(const o of index.objects){const {data,info}=await sharp(dir+o.file).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,o.width);assert.equal(info.height,o.height);let clear=0,solid=0;for(let i=3;i<data.length;i+=4){assert(data[i]===0||data[i]===255);if(data[i])solid++;else clear++;}assert(solid>0&&clear>0,o.name+' transparent silhouette');}
 const {data,info}=await sharp(dir+'building-walls.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(const id of [0,2,25,27])for(let y=6;y<32;y++)for(let x=0;x<8;x++){let xx=(id===0||id===25)?x:31-x;assert.equal(data[(((id/8|0)*32+y)*info.width+(id%8)*32+xx)*4+3],0,'outer plaster margin');}
 fs.mkdirSync('output/remaining',{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
 try{
  const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[],missing=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await p.goto('http://localhost:8765/tools/remaining-tiles.html');await p.waitForFunction(()=>document.images.length===48&&[...document.images].every(i=>i.complete&&i.naturalWidth));await p.screenshot({path:'output/remaining/catalogue.png',fullPage:true});
  await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.setViewportSize({width:1100,height:900});
  await p.goto('http://localhost:8765/index.html');await p.waitForFunction(()=>typeof WM.newGame==='function');await p.evaluate(()=>{WM.S.newGame();WM.S.setParty(['hongxin']);WM.state.leader='hongxin';WM.script.running=0;});
  for(const kind of ['outdoor','interior','temple']){
   await p.evaluate(kind=>{
    const rows=Array.from({length:20},()=>Array(24).fill(kind==='outdoor'?'.':'n'));
    const put=(x,y,s)=>[...s].forEach((c,i)=>rows[y][x+i]=(c==='.'&&kind!=='outdoor'?'n':c));
    if(kind==='outdoor'){put(2,6,'H..l..b.e.m..Q..U');put(2,10,'uuu.L.Y.J.I.g.V');put(2,14,'rr..o..<[>>');}
    if(kind==='interior'){put(2,6,'kk..h.h..j..A');put(2,7,'kk');put(2,10,'t.t..cccc..4..i');}
    if(kind==='temple'){put(2,7,'111..555..6..7');put(2,10,'222..888..3');put(2,15,'EEE..aaa..0');}
    WM.data.maps.object_smoke={name:'Northern Song '+kind,theme:'spring',interior:kind!=='outdoor',rows:rows.map(r=>r.join('')),events:[]};WM.setScene(WM.field,{map:'object_smoke',x:11,y:10,dir:'down'});
   },kind);
   await p.waitForFunction(()=>WM.tiles.artStatus().waiting===0);await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>WM.lastError?.message||null),null);await p.screenshot({path:'output/remaining/'+kind+'.png'});
  }
  // Story willow state must continue to use the fallen-tree art.
  const felled=await p.evaluate(()=>{const map={id:'willow',theme:'spring',def:{},get:()=>'.'};WM.state.flags['felled:willow']=true;const c=WM.util.makeWorldCanvas(80,80);WM.tiles.drawTall(c.getContext('2d'),32,32,2,2,WM.tiles.THEMES.spring,map,'l');return c.toDataURL();});assert(felled.startsWith('data:image/png'));
  await p.evaluate(()=>{
    const rows=Array.from({length:15},()=>'.'.repeat(20));rows[6]='.....t..............';
    WM.data.maps.prop_collision={theme:'spring',rows,events:[]};WM.setScene(WM.field,{map:'prop_collision',x:6,y:9,dir:'up'});
  });
  await p.waitForTimeout(150);assert(await p.evaluate(()=>WM.field.tileSolid(6,6)),'expanded table tile blocks');
  await p.keyboard.down('ArrowUp');await p.waitForTimeout(1000);await p.keyboard.up('ArrowUp');
  assert(await p.evaluate(()=>WM.field.player.y)>=112,'cannot walk through expanded table');
  await p.evaluate(()=>{
    const rows=Array.from({length:15},()=>'.'.repeat(20));
    rows[3]='..^^^^^^............';rows[4]=rows[3];rows[5]=rows[3];rows[6]='..WWWDWW............';
    WM.data.maps.roof_collision={theme:'spring',rows,events:[]};
    WM.setScene(WM.field,{map:'roof_collision',x:1,y:3,dir:'right'});
  });
  await p.waitForTimeout(150);
  assert.deepEqual(await p.evaluate(()=>[WM.field.tileSolid(2,3),WM.field.tileSolid(2,4),WM.field.tileSolid(2,5)]),[false,true,true]);
  const before=await p.evaluate(()=>WM.field.player.x);
  await p.keyboard.down('ArrowRight');await p.waitForTimeout(1000);await p.keyboard.up('ArrowRight');
  assert(await p.evaluate(()=>WM.field.player.x)>before+40,'walk across removed roof strip');
  const fallback=await p.evaluate(()=>{const m=WM.field.map,theme=m.theme;m.theme='snow';const value=WM.tiles.solidAt(m,2,3);m.theme=theme;return value;});assert(!fallback,'winter compact roofs also clear removed roof boundaries');
  await p.screenshot({path:'output/remaining/roof-collision.png'});
  await p.goto('http://localhost:8765/tools/prop-footprints.html');await p.waitForFunction(()=>document.querySelectorAll('canvas').length===9);await p.screenshot({path:'output/props/scale-boundaries.png',fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  fs.writeFileSync('output/remaining/check.json',JSON.stringify({result:'pass',objects:48,checks:['dimensions','binary transparency','wall margin alpha','catalogue desktop/mobile','outdoor props','furniture','temple run objects','felled willow'],errors,missing},null,2)+'\n');console.log('PASS: 48 transparent sprites, wall alpha, preview/mobile, outdoor/interior/temple scenes and story willow state.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
