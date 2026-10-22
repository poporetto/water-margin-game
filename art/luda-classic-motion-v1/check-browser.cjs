const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
(async()=>{const http=require('node:http'),path=require('node:path'),root=path.resolve(__dirname,'../..');const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'art/luda-classic-motion-v1/in-game.html');await page.waitForFunction(()=>window.spritePreviewReady);await page.click('#pause');const checks=[];
for(const facing of ['down','left','right','up']){await page.click('[data-facing="'+facing+'"]');const columns=[];for(let p=0;p<4;p++){await page.click('#step');columns.push(await page.evaluate(()=>window.spritePreviewState.column));}assert.deepEqual([...new Set(columns)].sort(),[0,1,2]);for(let p=0;p<4&&await page.evaluate(()=>window.spritePreviewState.column)!==1;p++)await page.click('#step');await page.waitForTimeout(80);await page.screenshot({path:__dirname+'/game-'+facing+'.png'});checks.push({facing,columns});}
await page.click('#pause');const x=await page.evaluate(()=>WM.field.player.x);await page.keyboard.down('ArrowRight');await page.waitForTimeout(450);await page.keyboard.up('ArrowRight');assert(await page.evaluate(()=>WM.field.player.x)>x);assert.equal(await page.evaluate(()=>WM.field.player.dir),'right');
for(const map of ['zhugui','liangshan']){await page.selectOption('#preview-map',map);await page.waitForTimeout(150);await page.screenshot({path:__dirname+'/game-'+map+'.png'});}
const state=await page.evaluate(()=>({density:WM.gfx.low.artScale,error:WM.lastError?.message||null,worldSize:[WM.field.player.sheet().cw,WM.field.player.sheet().ch]}));assert.equal(state.density,8);assert.deepEqual(state.worldSize,[24,32]);assert.equal(state.error,null);
const characters=['songjiang','linchong-official','linchong-exile','luzhishen','luda'];
for(const selection of [...characters,'all']){
 await page.selectOption('#preview-character',selection);
 assert.equal(await page.evaluate(()=>window.spritePreviewState.selection),selection);
 const visible=await page.evaluate(()=>[WM.field.player,...WM.field.actors].map(a=>a.sheet().spriteId));
 assert.deepEqual([...new Set(visible)].sort(),(selection==='all'?characters:[selection]).slice().sort());
 assert.equal(visible.length,selection==='all'?5:2);
 if(selection!=='all'){const detail=await page.locator('#detail-link').getAttribute('href');assert.equal((await page.request.get(base+detail)).status(),200);}
 for(const facing of ['down','left','right','up']){
  await page.click('[data-facing="'+facing+'"]');
  for(let i=0;i<4;i++){
   await page.click('#step');
   const view=await page.evaluate(()=>({phase:window.spritePreviewState.phase,actors:[WM.field.player,...WM.field.actors].map(a=>({dir:a.dir,anim:a.anim,density:a.sheet().artScale}))}));
   for(const a of view.actors){assert.equal(a.dir,facing);assert.equal(a.density,8);}
   if(selection==='all')assert(view.actors.every(a=>a.anim===view.phase));else{assert.equal(view.actors[0].anim,view.phase);assert.equal(view.actors[1].anim,0);}
  }
 }
}
await page.click('[data-facing="down"]');
for(const map of ['zhugui_in','zhugui','liangshan']){await page.selectOption('#preview-map',map);assert.equal(await page.evaluate(()=>window.spritePreviewState.characters.length),5);await page.waitForTimeout(100);await page.screenshot({path:__dirname+'/all-'+map+'.png'});}
await page.click('#pause');const groupX=await page.evaluate(()=>WM.field.player.x);await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');assert(await page.evaluate(()=>WM.field.player.x)>groupX);
await page.selectOption('#preview-character','luda');assert.equal(await page.evaluate(()=>WM.field.actors.length),1);
await page.setViewportSize({width:390,height:844});assert(await page.locator('#preview-character').isVisible());await page.screenshot({path:__dirname+'/mobile-controls.png'});
await page.goto(base+'art/luda-classic-motion-v1/compare.html');await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await page.waitForFunction(()=>document.querySelectorAll('canvas').length===4);await page.click('#pause');assert.deepEqual(errors,[]);fs.writeFileSync(__dirname+'/browser-checks.json',JSON.stringify({checks,state,keyboardMovement:true,locations:['zhugui_in','zhugui','liangshan'],detailImagesLoaded:true,characterSelections:characters,allCharacters:true,selectionDirectionsAndPhases:true,mobileControls:true,errors},null,2));console.log('PASS: five sprite selections and all-character lineup; four directions and phases for each, stationary references, three maps, keyboard movement, mobile selector, detail links, density 8, no browser errors.');}finally{await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
