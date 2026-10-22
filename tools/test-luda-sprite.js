'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
(async()=>{
 const root=process.cwd(),out='output/luda-integration';fs.mkdirSync(out,{recursive:true});
 for(const prefix of ['', 'docs/'])assert(fs.readFileSync('art/luda-classic-motion-v1/luda-walking.png').equals(fs.readFileSync(prefix+'assets/sprites/luda.png')),'Approved v1 installed unchanged');
 const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;const reports=[];
 try{browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 for(const prefix of ['', 'docs/']){
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/'+prefix+'index.html');await page.waitForFunction(()=>WM.sprites.overrides.luda);
  await page.evaluate(()=>{
   const SP=WM.sprites;WM.S.newGame();WM.S.initChar('luda',20);WM.S.setParty(['luda']);WM.state.leader='luda';WM.state.opts.music=0;WM.state.opts.sfx=0;WM.script.running=0;
   WM.setScene(WM.field,{map:'zhugui_in',x:7,y:6,dir:'down'});WM.field.pendingAuto=false;WM.field.nameBanner=null;
   const sheet=SP.getWalk('luda');if(sheet!==SP.overrides.luda||WM.field.player.sheet()!==sheet)throw Error('Actor did not select approved sprite');
   if(sheet.width!==576||sheet.height!==1024||sheet.artScale!==8||sheet.cw!==24||sheet.ch!==32)throw Error('Wrong resolution/world size');
   if(SP.getWalk('luzhishen')===sheet)throw Error('Lu Zhishen incorrectly uses garrison costume');
   const battle=SP.battleOf('luda');if(battle.artScale!==8||battle.cw!==24||battle.ch!==32)throw Error('Battle fallback density changed');
   for(const [row,dir]of ['down','left','right','up'].entries())for(let phase=0;phase<4;phase++){
    const actual=WM.util.makeWorldCanvas(24,32,8),expected=WM.util.makeCanvas(192,256);SP.draw(actual.getContext('2d'),sheet,dir,phase,12,32);expected.getContext('2d').drawImage(sheet,[0,1,0,2][phase]*192,row*256,192,256,0,0,192,256);
    const a=actual.getContext('2d').getImageData(0,0,192,256).data,b=expected.getContext('2d').getImageData(0,0,192,256).data;for(let i=0;i<a.length;i++)if(a[i]!==b[i])throw Error('Frame sampling: '+dir+' '+phase);
   }
   if(WM.gfx.low.artScale!==8||WM.field.map.baked.artScale!==2)throw Error('Render density changed');
   const update=WM.field.update;window.spritePhases=new Set();WM.field.update=function(dt){update.call(this,dt);if(this.player.moving)window.spritePhases.add(this.player.anim);};
  });
  for(const [key,dir]of [['ArrowLeft','left'],['ArrowRight','right'],['ArrowUp','up'],['ArrowDown','down']]){
   await page.evaluate(dir=>{WM.field.loadMap('zhugui_in',dir==='down'?5:7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;window.spritePhases.clear();},dir);
   await page.keyboard.down(key);await page.waitForFunction(()=>window.spritePhases.size===4,{},{timeout:10000});assert.equal(await page.evaluate(()=>WM.field.player.dir),dir);await page.keyboard.up(key);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>WM.field.player.anim),0);
  }
  await page.evaluate(()=>{WM.field.loadMap('zhugui_in',7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;});await page.waitForTimeout(100);await page.screenshot({path:out+'/'+(prefix?'docs':'game')+'.png'});
  assert.equal(await page.evaluate(()=>WM.lastError?.message||null),null);assert.deepEqual(errors,[]);reports.push({entry:prefix+'index.html',approvedV1:true,frameChecks:16,keyboardDirections:4,idleResets:true,logicalSize:[24,32],density:8,monkCostumeDistinct:true,battleFallback:true,errors});await page.close();
 }
 fs.writeFileSync(out+'/checks.json',JSON.stringify(reports,null,2));console.log('PASS: Lu Da v1 installed unchanged in root/docs; all frame samples, four keyboard directions, idle, density and battle fallback; Lu Zhishen remains distinct.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
