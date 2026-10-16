'use strict';
const assert=require('assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});try{const p=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
for(const prefix of ['', '/docs']){
 await p.goto('http://localhost:8765'+prefix+'/index.html');await p.waitForFunction(()=>typeof WM.newGame==='function');
 const entrance=await p.evaluate(()=>{WM.S.newGame();WM.S.setParty(['hongxin']);WM.state.leader='hongxin';WM.script.running=0;const m=WM.centeredDoorMoves.kaifeng.find(m=>m.oldX!==m.x&&WM.data.maps.kaifeng.exits.some(e=>e.x===m.x&&e.y===m.y&&!e.cond));const e=WM.data.maps.kaifeng.exits.find(e=>e.x===m.x&&e.y===m.y);WM.data.events.kaifeng=[];WM.data.events[e.to]=[];WM.setScene(WM.field,{map:'kaifeng',x:m.x,y:m.y+1,dir:'up',noAuto:true});return {m,to:e.to};});
 await p.waitForFunction(()=>WM.tiles.artStatus().waiting===0);await p.keyboard.down('ArrowUp');await p.waitForFunction(to=>WM.state.map===to,entrance.to,{timeout:5000});await p.keyboard.up('ArrowUp');assert.equal(await p.evaluate(()=>WM.state.map),entrance.to,'centered door enters correct interior');
 await p.keyboard.down('ArrowDown');await p.waitForFunction(()=>WM.state.map==='kaifeng',null,{timeout:5000});await p.keyboard.up('ArrowDown');assert.equal(await p.evaluate(()=>WM.state.map),'kaifeng','return exit reaches exterior');
 assert.equal(await p.evaluate(()=>WM.lastError?.message||null),null);
}
await p.goto('http://localhost:8765/tools/building-tiles.html?theme=snow');await p.waitForFunction(()=>WM.tiles.artStatus().waiting===0);await p.screenshot({path:'output/part2/building-fixes.png',fullPage:true});await p.check('#closed');await p.screenshot({path:'output/part2/snow-gate-closed.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS: centered door entry/return in game and docs, winter building render, closed gate and no missing assets.');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
