'use strict';
const assert=require('assert/strict');
const fs=require('fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1120,height:1000}}),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await page.goto('http://localhost:8765/tools/starter-tiles.html');
  await page.waitForFunction(()=>WM.tiles.artStatus().sheets.length===Object.keys(WM.TILE_ART.sheets).length);
  await page.screenshot({path:'output/tiles/starter-preview.png',fullPage:true});
  for(const theme of ['summer','autumn','snow','world']){await page.selectOption('#theme',theme);assert((await page.locator('#status').textContent()).includes(theme==='summer'?'new artwork active':'existing seasonal/world artwork'));}
  await page.setViewportSize({width:390,height:844});await page.selectOption('#theme','spring');await page.screenshot({path:'output/tiles/mobile-preview.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile preview should fit');
  await page.setViewportSize({width:1120,height:900});
  await page.goto('http://localhost:8765/index.html');await page.waitForFunction(()=>typeof WM.newGame==='function');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>WM.scenes.title.mode==='menu');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>WM.field.map&&WM.tiles.artStatus().sheets.length===Object.keys(WM.TILE_ART.sheets).length);
  await page.screenshot({path:'output/tiles/game-start.png'});
  // A controlled field scene checks actual input, collision and the actor/tall-object rendering path.
  await page.reload();await page.waitForFunction(()=>typeof WM.newGame==='function');
  await page.evaluate(()=>{
   WM.S.newGame();WM.S.setParty(WM.data.start.party);WM.state.leader=WM.data.start.party[0];
   WM.data.maps.tile_art_smoke={name:'Tile art smoke test',theme:'spring',rows:[
    'TTTTTTTTTTTTTTTTTTTT','T..................T','T...P....T.........T','T..................T',
    'T....~~~~~.........T','T....~~w~~.........T','T....~~~~~.........T','T..................T',
    'T::::::::::::::::::T','T..................T','T....T.......P.....T','T..................T',
    'T..................T','T..................T','TTTTTTTTTTTTTTTTTTTT'],events:[]};
   WM.script.running=0;WM.setScene(WM.field,{map:'tile_art_smoke',x:3,y:8,dir:'right'});
  });
  await page.waitForTimeout(500);
  const before=await page.evaluate(()=>WM.field.player.x);
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');
  assert(await page.evaluate(()=>WM.field.player.x)>before,'player moves with keyboard');
  await page.screenshot({path:'output/tiles/game-field.png'});
  const collision=await page.evaluate(()=>({tree:WM.tiles.solid('T'),pine:WM.tiles.solid('P'),water:WM.tiles.solid('~'),path:WM.tiles.solid(':')}));
  assert.deepEqual(collision,{tree:true,pine:true,water:true,path:false});
  await page.goto('http://localhost:8765/docs/index.html');await page.waitForFunction(()=>typeof WM.newGame==='function');await page.keyboard.press('Enter');await page.waitForFunction(()=>WM.scenes.title.mode==='menu');await page.keyboard.press('Enter');await page.waitForFunction(()=>WM.field.map&&WM.tiles.artStatus().sheets.length===Object.keys(WM.TILE_ART.sheets).length);
  assert.equal(await page.evaluate(()=>WM.lastError?WM.lastError.message:null),null,'game loop errors');
  assert.deepEqual(errors,[],'browser errors');assert.deepEqual(missing,[],'missing assets');
  fs.writeFileSync('output/tiles/browser-check.json',JSON.stringify({result:'pass',errors,missing,checks:['preview','five themes','mobile width','game boot','keyboard movement','collision flags','docs build']},null,2)+'\n');
  console.log('PASS: preview, seasonal fallbacks, mobile width, game boot, movement, collision flags, docs build, no browser errors or missing assets');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
