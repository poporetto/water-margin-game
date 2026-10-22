'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  async function load(id){const img=new Image();img.src=`art/songjiang-style-variations-v8/${id}-preview-sheet.png`;await img.decode();const cv=WM.util.makeCanvas(img.width,img.height);cv.getContext('2d').drawImage(img,0,0);cv.artScale=4;cv.isOverride=true;cv.cw=24;cv.ch=32;return cv;}
  const [a,b]=await Promise.all([load('variant-a'),load('variant-b')]);const variants={'variant-a':a,'variant-b':b};
  WM.boot();WM.gfx.low=WM.util.makeCanvas(WM.LOW_W*4,WM.LOW_H*4);WM.gfx.low.artScale=4;WM.gfx.lctx=WM.gfx.low.getContext('2d');WM.gfx.lctx.scale(4,4);
  WM.S.newGame();WM.S.initChar('songjiang',20);WM.state.party=['songjiang'];WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let variant='variant-b',facing='down';WM.sprites.overrides.songjiang=variants[variant];
  const places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  function label(){status.textContent=variant==='variant-a'?'A · Classic silhouette, leaner face':'B · Softer eyebrows, gentler expression';}
  function location(id){WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.actors=[];WM.field.pendingAuto=false;WM.field.nameBanner=null;WM.setScene({draw:()=>WM.field.draw(),update:()=>{WM.field.player.anim=0;}},null,true);label();}
  document.getElementById('preview-variant').value=variant;document.getElementById('preview-map').value='zhugui_in';location('zhugui_in');
  document.querySelectorAll('[data-facing]').forEach(button=>button.onclick=()=>{facing=button.dataset.facing;WM.field.player.dir=facing;document.querySelectorAll('[data-facing]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  document.getElementById('preview-variant').onchange=e=>{variant=e.target.value;WM.sprites.overrides.songjiang=variants[variant];label();};
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
