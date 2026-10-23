const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs'),http=require('http'),path=require('path');
(async()=>{
 const root=path.resolve(__dirname,'../..');
 const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';await page.goto(base+'art/likui-classic-v1/in-game.html');await page.waitForFunction(()=>window.spritePreviewReady);
  const checks=[];
  for(const map of ['zhugui_in','zhugui','liangshan']){await page.selectOption('#preview-map',map);for(const facing of ['down','left','up']){await page.click('[data-facing="'+facing+'"]');await page.waitForTimeout(100);const state=await page.evaluate(()=>({preview:window.spritePreviewState,density:WM.gfx.low.artScale,actors:[WM.field.player,...WM.field.actors].map(a=>({dir:a.dir,size:[a.sheet().cw,a.sheet().ch],artScale:a.sheet().artScale})),error:WM.lastError?.message||null}));assert.equal(state.preview.facing,facing);assert.equal(state.preview.map,map);assert.equal(state.density,8);assert.equal(state.error,null);for(const a of state.actors){assert.equal(a.dir,facing);assert.deepEqual(a.size,[24,32]);assert.equal(a.artScale,8);}checks.push(state);if(map==='zhugui_in'||facing==='down')await page.screenshot({path:path.join(__dirname,'game-'+map+'-'+facing+'.png')});}}
  await page.goto(base+'art/likui-classic-v1/compare.html');await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'browser-checks.json'),JSON.stringify({checks,errors,detailImagesLoaded:true},null,2));console.log('PASS: three directions across three game backgrounds, 24×32 logical size, 8× buffer, detail images loaded, no page errors.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
