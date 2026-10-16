'use strict';
const assert=require('assert/strict'),fs=require('fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
 try{
  const p=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[],missing=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await p.goto('http://localhost:8765/tools/building-tiles.html');await p.waitForFunction(()=>WM.tiles.artStatus().waiting===0&&WM.tiles.artStatus().sheets.length===Object.keys(WM.TILE_ART.sheets).length);
  await p.screenshot({path:'output/buildings/preview.png',fullPage:true});
  const open=await p.locator('canvas').nth(3).evaluate(c=>c.toDataURL());await p.check('#closed');const shut=await p.locator('canvas').nth(3).evaluate(c=>c.toDataURL());assert.notEqual(open,shut,'gate state visible');await p.screenshot({path:'output/buildings/closed-gate.png',fullPage:true});
  for(const theme of ['summer','autumn','snow','world'])await p.selectOption('#theme',theme);
  await p.selectOption('#theme','spring');await p.uncheck('#closed');await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'output/buildings/mobile.png',fullPage:true});
  await p.setViewportSize({width:1100,height:900});
  for(const prefix of ['', '/docs']){
   await p.goto('http://localhost:8765'+prefix+'/index.html');await p.waitForFunction(()=>typeof WM.newGame==='function');
   await p.evaluate(()=>{WM.S.newGame();WM.S.setParty(['hongxin']);WM.state.leader='hongxin';WM.script.running=0;WM.setScene(WM.field,{map:'kaifeng',x:10,y:40,dir:'up'});});
   await p.waitForFunction(()=>WM.tiles.artStatus().waiting===0&&WM.tiles.artStatus().sheets.length===Object.keys(WM.TILE_ART.sheets).length);await p.waitForTimeout(400);
   assert.equal(await p.evaluate(()=>WM.lastError?WM.lastError.message:null),null);
   await p.screenshot({path:'output/buildings/'+(prefix?'docs-town':'kaifeng-town')+'.png'});
   if(!prefix){
    await p.evaluate(()=>{WM.data.maps.building_smoke={name:'Song gate',theme:'spring',rows:['####################','########GGGG########','########GGGG########','........====........','........====........','........====........','....................','....................','....................','....................','....................','....................','....................','....................','....................'],events:[]};WM.setScene(WM.field,{map:'building_smoke',x:9,y:4,dir:'up'});});
    await p.waitForTimeout(250);const before=await p.evaluate(()=>WM.field.player.y);await p.keyboard.down('ArrowUp');await p.waitForTimeout(600);await p.keyboard.up('ArrowUp');const after=await p.evaluate(()=>WM.field.player.y);assert(after<before-20,'player traverses the gate opening');
    assert.equal(await p.evaluate(()=>WM.lastError?WM.lastError.message:null),null);await p.screenshot({path:'output/buildings/gate-traversal.png'});
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  fs.writeFileSync('output/buildings/browser-check.json',JSON.stringify({result:'pass',errors,missing,checks:['six building scenes','gate state toggle','five themes','mobile layout','real Kaifeng map','keyboard gate traversal','docs build']},null,2)+'\n');
  console.log('PASS: building previews, gate states, seasonal fallback, mobile layout, Kaifeng rendering, gate traversal and docs build; no browser errors or missing assets');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
