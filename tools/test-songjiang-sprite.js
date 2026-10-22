'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const approved=fs.readFileSync('art/songjiang-classic-motion-v3/songjiang-walking.png');
 for(const file of ['assets/sprites/songjiang.png','docs/assets/sprites/songjiang.png'])assert(approved.equals(fs.readFileSync(file)),file+' matches approved art');
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
 const out='output/songjiang-integration';fs.mkdirSync(out,{recursive:true});const reports=[];
 try{for(const prefix of ['','docs/']){
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:8765/'+prefix+'index.html');await page.waitForFunction(()=>WM.sprites.overrides.songjiang);
  const report=await page.evaluate(()=>{
   const sheet=WM.sprites.getWalk('songjiang');
   if(sheet.width!==576||sheet.height!==1024||sheet.artScale!==8||sheet.cw!==24||sheet.ch!==32)throw Error('Incorrect sprite density or world size');
   if(WM.gfx.low.artScale!==8||WM.gfx.low.width!==2560||WM.gfx.low.height!==1920)throw Error('Viewport loses sprite detail');
   // Compare each renderer-selected frame against the source at its native density.
   for(const [row,dir] of ['down','left','right','up'].entries())for(let phase=0;phase<4;phase++){
    const actual=WM.util.makeWorldCanvas(24,32,8),expected=WM.util.makeCanvas(192,256);
    WM.sprites.draw(actual.getContext('2d'),sheet,dir,phase,12,32);
    expected.getContext('2d').drawImage(sheet,[0,1,0,2][phase]*192,row*256,192,256,0,0,192,256);
    const a=actual.getContext('2d').getImageData(0,0,192,256).data,b=expected.getContext('2d').getImageData(0,0,192,256).data;
    for(let i=0;i<a.length;i++)if(a[i]!==b[i])throw Error('Frame sampling changed: '+dir+' '+phase);
   }
   WM.S.newGame();WM.S.initChar('songjiang',20);WM.S.setParty(['songjiang']);WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;WM.script.running=0;
   WM.setScene(WM.field,{map:'zhugui_in',x:7,y:6,dir:'down'});WM.field.pendingAuto=false;WM.field.nameBanner=null;
   if(WM.field.player.sheet()!==sheet)throw Error('Player did not use registered sprite');
   if(WM.field.map.baked.artScale!==2)throw Error('Map cache density changed');
   const battle=WM.sprites.battleOf('songjiang');if(battle.artScale!==8||battle.cw!==24||battle.ch!==32)throw Error('Battle fallback scale');
   return {sheet:[sheet.width,sheet.height],density:sheet.artScale,logicalSize:[sheet.cw,sheet.ch],sourceSampling:'all 16 direction/phase combinations exact',mapDensity:WM.field.map.baked.artScale};
  });
  const directions=[];
  await page.evaluate(()=>{const update=WM.field.update;window.spritePhases=new Set();WM.field.update=function(dt){update.call(this,dt);if(WM.field.player.moving)window.spritePhases.add(WM.field.player.anim);};});
  for(const [key,dir] of [['ArrowLeft','left'],['ArrowRight','right'],['ArrowUp','up'],['ArrowDown','down']]){
   await page.evaluate(dir=>{WM.field.loadMap('zhugui_in',dir==='down'?5:7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;window.spritePhases.clear();},dir);
   await page.keyboard.down(key);await page.waitForFunction(()=>window.spritePhases.size===4,{},{timeout:10000});
   const actual=await page.evaluate(()=>({dir:WM.field.player.dir,moving:WM.field.player.moving}));assert.equal(actual.dir,dir);assert.equal(actual.moving,true);
   await page.keyboard.up(key);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>WM.field.player.anim),0);directions.push(dir);
  }
  await page.evaluate(()=>{WM.field.loadMap('zhugui_in',7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;});
  await page.waitForTimeout(250);await page.screenshot({path:out+'/'+(prefix?'docs':'game')+'.png'});
  assert.equal(await page.evaluate(()=>WM.lastError?.message||null),null);assert.deepEqual(errors,[]);
  reports.push({entry:prefix+'index.html',...report,keyboardDirections:directions,idleResets:true,errors});await page.close();
 }
 fs.writeFileSync(out+'/checks.json',JSON.stringify(reports,null,2));console.log('PASS: approved asset, native-density sampling, real keyboard walking and idle, map density, and docs build.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
