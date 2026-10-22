'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  async function load(url,density){const img=new Image();img.src=url;await img.decode();const cv=WM.util.makeCanvas(img.width,img.height);cv.getContext('2d').drawImage(img,0,0);cv.artScale=density;cv.isOverride=true;cv.cw=24;cv.ch=32;return cv;}
  const [walk,referenceSheet,stand,previous]=await Promise.all([load('art/songjiang-classic-motion-v3/songjiang-walking.png',8),load('art/songjiang-classic-motion-v2/classic-original-hd.png',8),load('art/songjiang-classic-motion-v3/corrected-standing.png',8),load('art/songjiang-classic-motion-v2/songjiang-walking.png',8)]);
  WM.boot();WM.gfx.low=WM.util.makeCanvas(WM.LOW_W*8,WM.LOW_H*8);WM.gfx.low.artScale=8;WM.gfx.lctx=WM.gfx.low.getContext('2d');WM.gfx.lctx.scale(8,8);WM.gfx.lctx.imageSmoothingEnabled=false;
  WM.S.newGame();WM.S.initChar('songjiang',20);WM.state.party=['songjiang'];WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let mode='walking',facing='down',paused=false,elapsed=0,phase=0,origin={x:0,y:0},reference;const keys=new Set();
  const sheets={walking:walk,standing:stand,previous},places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  WM.sprites.overrides.songjiang=walk;
  function label(){status.textContent=mode==='standing'?'Original reference left · corrected standing right':`${mode==='previous'?'Before these fixes':'Refined movement'} · ${paused?'paused':'playing'} · frame ${[0,1,0,2][phase]+1}`;}
  function update(dt){const p=WM.field.player;if(mode!=='standing'&&!paused){elapsed+=Math.min(dt||0,0.1);phase=Math.floor(elapsed*5)%4;const dx=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),dy=Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'));if(dx||dy){const length=Math.hypot(dx,dy),step=22*Math.min(dt||0,0.1);p.x=Math.max(origin.x+2,Math.min(origin.x+34,p.x+dx/length*step));p.y=Math.max(origin.y-8,Math.min(origin.y+8,p.y+dy/length*step));facing=dx?(dx>0?'right':'left'):(dy>0?'down':'up');}}p.dir=facing;p.anim=mode==='standing'?0:phase;reference.dir=facing;reference.anim=0;label();}
  function location(id){WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.pendingAuto=false;WM.field.nameBanner=null;const p=WM.field.player;origin={x:p.x,y:p.y};reference=Object.create(p);reference.isPlayer=false;reference.x=origin.x-20;reference.y=origin.y;reference.anim=0;reference.sheet=()=>referenceSheet;p.x=origin.x+18;WM.field.actors=[reference];WM.setScene({draw:()=>WM.field.draw(),update},null,true);label();}
  location('zhugui_in');document.getElementById('preview-map').value='zhugui_in';document.getElementById('preview-pose').value='walking';
  document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{facing=b.dataset.facing;WM.field.player.dir=facing;reference.dir=facing;});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  document.getElementById('preview-pose').onchange=e=>{mode=e.target.value;WM.sprites.overrides.songjiang=sheets[mode];label();};
  document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'Play':'Pause';label();};
  document.getElementById('step').onclick=()=>{paused=true;phase=(phase+1)%4;elapsed=phase/5;document.getElementById('pause').textContent='Play';label();};
  window.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')&&!['SELECT','INPUT'].includes(e.target.tagName)){keys.add(e.key);e.preventDefault();}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
