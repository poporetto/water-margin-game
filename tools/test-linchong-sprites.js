'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{
 for(const outfit of ['official','exile'])for(const prefix of ['','docs/'])assert(fs.readFileSync('art/linchong-classic-motion-v3/'+outfit+'-walking.png').equals(fs.readFileSync(prefix+'assets/sprites/linchong-'+outfit+'.png')),'Approved sheet must be installed unchanged');
 const http=require('node:http'),root=process.cwd();
 const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.json':'application/json'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const out='output/linchong-integration';fs.mkdirSync(out,{recursive:true});const reports=[];
 try{for(const prefix of ['','docs/']){
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+prefix+'index.html');
  await page.waitForFunction(()=>WM.sprites.overrides['linchong-official']&&WM.sprites.overrides['linchong-exile']);
  const report=await page.evaluate(()=>{
   const SP=WM.sprites;WM.S.newGame();WM.S.initChar('linchong',20);WM.S.setParty(['linchong']);WM.state.leader='linchong';WM.state.chapter=3;WM.state.opts.music=0;WM.state.opts.sfx=0;WM.script.running=0;
   WM.setScene(WM.field,{map:'zhugui_in',x:7,y:6,dir:'down'});WM.field.pendingAuto=false;WM.field.nameBanner=null;
   const actor=WM.field.player,battles={};
   const states=[{chapter:3,exiled:false,outfit:'official'},{chapter:3,exiled:true,outfit:'exile'},{chapter:4,exiled:false,outfit:'exile'},{chapter:2,exiled:false,outfit:'official'}];
   for(const s of states){WM.state.chapter=s.chapter;WM.state.flags.ch3_exiled=s.exiled;const id='linchong-'+s.outfit,sheet=SP.getWalk('linchong');if(SP.resolveId('linchong')!==id||sheet!==SP.overrides[id]||actor.sheet()!==sheet)throw Error('Story outfit does not update on existing actor');if(WM.portraits.resolveId('linchong')!=='linchong_'+s.outfit)throw Error('Portrait and sprite disagree');
    if(sheet.width!==576||sheet.height!==1024||sheet.artScale!==8||sheet.cw!==24||sheet.ch!==32)throw Error('Incorrect density or world size');
    const battle=SP.battleOf('linchong');if(battle!==sheet.battle||battle.artScale!==8||battle.cw!==24||battle.ch!==32)throw Error('Battle fallback outfit/density');if(battles[s.outfit]&&battle!==battles[s.outfit])throw Error('Variant cache not reused');battles[s.outfit]=battle;
   }
   if(battles.official===battles.exile)throw Error('Battle cache leaks across outfits');
   for(const outfit of ['official','exile']){const sheet=SP.overrides['linchong-'+outfit];for(const [row,dir]of ['down','left','right','up'].entries())for(let phase=0;phase<4;phase++){
    const actual=WM.util.makeWorldCanvas(24,32,8),expected=WM.util.makeCanvas(192,256);SP.draw(actual.getContext('2d'),sheet,dir,phase,12,32);expected.getContext('2d').drawImage(sheet,[0,1,0,2][phase]*192,row*256,192,256,0,0,192,256);
    const a=actual.getContext('2d').getImageData(0,0,192,256).data,b=expected.getContext('2d').getImageData(0,0,192,256).data;for(let i=0;i<a.length;i++)if(a[i]!==b[i])throw Error('Frame sampling changed: '+outfit+' '+dir+' '+phase);
   }}
   if(WM.gfx.low.artScale!==8||WM.field.map.baked.artScale!==2)throw Error('World or background density changed');
   const update=WM.field.update;window.spritePhases=new Set();WM.field.update=function(dt){update.call(this,dt);if(this.player.moving)window.spritePhases.add(this.player.anim);};
   return {storyStates:states,frameChecks:32,logicalSize:[24,32],density:8,battleCachesSeparate:true};
  });
  for(const outfit of ['official','exile']){
   await page.evaluate(o=>{WM.state.chapter=3;WM.state.flags.ch3_exiled=o==='exile';},outfit);
   for(const [key,dir]of [['ArrowLeft','left'],['ArrowRight','right'],['ArrowUp','up'],['ArrowDown','down']]){
    await page.evaluate(dir=>{WM.field.loadMap('zhugui_in',dir==='down'?5:7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;window.spritePhases.clear();},dir);
    await page.keyboard.down(key);await page.waitForFunction(()=>window.spritePhases.size===4,{},{timeout:10000});assert.equal(await page.evaluate(()=>WM.field.player.dir),dir);await page.keyboard.up(key);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>WM.field.player.anim),0);
   }
   await page.evaluate(()=>{WM.field.loadMap('zhugui_in',7,6,'down',true);WM.field.pendingAuto=false;WM.field.nameBanner=null;});await page.waitForTimeout(100);await page.screenshot({path:out+'/'+(prefix?'docs':'game')+'-'+outfit+'.png'});
  }
  assert.equal(await page.evaluate(()=>WM.lastError?.message||null),null);assert.deepEqual(errors,[]);reports.push({entry:prefix+'index.html',...report,keyboardDirections:4,outfits:2,idleResets:true,errors});await page.close();
 }
 fs.writeFileSync(out+'/checks.json',JSON.stringify(reports,null,2));console.log('PASS: both approved sheets, story transition and reset, matching portraits, separate battle fallback caches, all 32 source frames, keyboard movement and idle, root and docs.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
