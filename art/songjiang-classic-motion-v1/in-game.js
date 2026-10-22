'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  async function load(url,single=false){const img=new Image();img.src=url;await img.decode();const fw=single?img.width:96,cv=WM.util.makeCanvas(single?fw*3:img.width,512),c=cv.getContext('2d');if(single){for(let r=0;r<4;r++)for(let col=0;col<3;col++)c.drawImage(img,col*fw,r*128);}else c.drawImage(img,0,0);cv.artScale=4;cv.isOverride=true;cv.cw=fw/4;cv.ch=32;return cv;}
  const [walk,stand,battle]=await Promise.all([load('art/songjiang-classic-motion-v1/songjiang-walking.png'),load('art/songjiang-style-variations-v8/variant-a-preview-sheet.png'),load('art/songjiang-classic-motion-v1/songjiang-battle.png',true)]);
  WM.boot();WM.gfx.low=WM.util.makeCanvas(WM.LOW_W*4,WM.LOW_H*4);WM.gfx.low.artScale=4;WM.gfx.lctx=WM.gfx.low.getContext('2d');WM.gfx.lctx.scale(4,4);
  WM.S.newGame();WM.S.initChar('songjiang',20);WM.state.party=['songjiang'];WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let mode='walking',facing='down',paused=false,elapsed=0,phase=0,origin={x:0,y:0};const keys=new Set();
  const sheets={walking:walk,standing:stand,battle},places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  WM.sprites.overrides.songjiang=walk;
  function label(){status.textContent=mode==='battle'?'One static left-facing battle pose':mode==='standing'?'Approved Classic standing reference':`Walking · ${paused?'paused':'playing'} · frame ${[0,1,0,2][phase]+1}`;}
  function update(dt){const p=WM.field.player;if(mode==='walking'&&!paused){elapsed+=Math.min(dt||0,0.1);phase=Math.floor(elapsed*5)%4;let dx=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),dy=Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'));if(dx||dy){const length=Math.hypot(dx,dy),step=22*Math.min(dt||0,0.1);p.x=Math.max(origin.x-18,Math.min(origin.x+18,p.x+dx/length*step));p.y=Math.max(origin.y-8,Math.min(origin.y+8,p.y+dy/length*step));facing=dx?(dx>0?'right':'left'):(dy>0?'down':'up');p.dir=facing;}}p.anim=mode==='walking'?phase:0;if(mode==='battle')p.dir='left';label();}
  function location(id){WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],mode==='battle'?'left':facing,true);WM.field.actors=[];WM.field.pendingAuto=false;WM.field.nameBanner=null;origin={x:WM.field.player.x,y:WM.field.player.y};WM.setScene({draw:()=>WM.field.draw(),update},null,true);label();}
  location('zhugui_in');document.getElementById('preview-map').value='zhugui_in';document.getElementById('preview-pose').value='walking';
  document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{if(mode==='battle')return;facing=b.dataset.facing;WM.field.player.dir=facing;});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  document.getElementById('preview-pose').onchange=e=>{mode=e.target.value;WM.sprites.overrides.songjiang=sheets[mode];WM.field.player.anim=0;WM.field.player.dir=mode==='battle'?'left':facing;document.querySelectorAll('[data-facing]').forEach(b=>b.disabled=mode==='battle');label();};
  document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'Play':'Pause';label();};
  document.getElementById('step').onclick=()=>{paused=true;phase=(phase+1)%4;elapsed=phase/5;document.getElementById('pause').textContent='Play';label();};
  window.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')&&!['SELECT','INPUT'].includes(e.target.tagName)){keys.add(e.key);e.preventDefault();}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
