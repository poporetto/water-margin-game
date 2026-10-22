'use strict';
const assert=require('assert/strict'),fs=require('fs'),sharp=require('sharp'),{chromium}=require('playwright');
(async()=>{
 fs.mkdirSync('output/32px',{recursive:true});
 for(const name of ['ground','trees','water','deep-water','building-roofs','building-walls','building-gate']){
  const old=await sharp('assets/tiles/'+name+'.png').metadata();
  const {data,info}=await sharp('assets/tiles/32/'+name+'.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,old.width*2);assert.equal(info.height,old.height*2);
  for(let i=3;i<data.length;i+=4)assert(data[i]===0||data[i]===255,'hard alpha '+name);
  const enlarged=await sharp('assets/tiles/'+name+'.png').resize(info.width,info.height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer();
  assert(!data.equals(enlarged),'new detail rather than duplicated old pixels: '+name);
 }
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
 try{
  const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://localhost:8765/index.html');await p.waitForFunction(()=>typeof WM.newGame==='function'&&WM.sprites.overrides.songjiang);
  const report=await p.evaluate(()=>{
   WM.S.newGame();WM.S.setParty(['hongxin']);WM.state.leader='hongxin';WM.script.running=0;
   WM.setScene(WM.field,{map:'kaifeng',x:10,y:40,dir:'up'});
   const chars=Object.keys(WM.data.chars),monsters=Object.keys(WM.monsters.ART);
   for(const id of chars){const s=WM.sprites.get(id),density=WM.ASSETS.spriteScales?.[id]||2;if(s.width!==72*density||s.height!==128*density||s.artScale!==density)throw Error('character size '+id);}
   for(const id of monsters){const s=WM.monsters.get(id);if(s.artScale!==2||s.width!==s.logicalWidth*2)throw Error('monster size '+id);}
   if(WM.gfx.low.width!==2560||WM.gfx.low.height!==1920)throw Error('world buffer');
   if(WM.field.map.baked.artScale!==2)throw Error('map texture density changed');
   return{characters:chars.length,monsterTypes:monsters.length,worldBuffer:[2560,1920],logicalTile:WM.TILE,physicalTile:WM.ART_TILE};
  });
  await p.waitForTimeout(800);await p.screenshot({path:'output/32px/kaifeng.png'});
  const sheet=await p.evaluate(()=>WM.sprites.get('hongxin').toDataURL());fs.writeFileSync('output/32px/hongxin.png',Buffer.from(sheet.split(',')[1],'base64'));
  await p.evaluate(()=>{WM.battle.start(Object.keys(WM.data.troops)[0],{});});
  await p.waitForFunction(()=>WM.scene===WM.scenes.battle);await p.waitForTimeout(600);await p.screenshot({path:'output/32px/battle.png'});
  assert.equal(await p.evaluate(()=>WM.lastError?.message||null),null);
  await p.reload();await p.waitForFunction(()=>typeof WM.newGame==='function');
  await p.evaluate(()=>{WM.S.newGame();WM.S.setParty(['hongxin']);WM.duel.start(Object.keys(WM.data.duels)[0],{});});
  await p.waitForFunction(()=>WM.scene===WM.scenes.duel);await p.waitForTimeout(600);await p.screenshot({path:'output/32px/duel.png'});
  assert.equal(await p.evaluate(()=>WM.lastError?.message||null),null);assert.deepEqual(errors,[]);
  fs.writeFileSync('output/32px/check.json',JSON.stringify({result:'pass',...report,errors},null,2)+'\n');console.log(report);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
