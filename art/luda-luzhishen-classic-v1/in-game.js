'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  async function load(url){const img=new Image();img.src=url;await img.decode();const cv=WM.util.makeCanvas(img.width,img.height);cv.getContext('2d').drawImage(img,0,0);Object.assign(cv,{artScale:8,isOverride:true,cw:24,ch:32});return cv;}
  const sheets=await Promise.all(['art/songjiang-classic-motion-v2/classic-original-hd.png','art/luda-luzhishen-classic-v1/luda-review-sheet.png','art/luda-luzhishen-classic-v1/luzhishen-review-sheet.png'].map(load));
  WM.boot();WM.S.newGame();WM.S.initChar('songjiang',20);WM.state.party=['songjiang'];WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let facing='down',actors=[];
  const places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  function update(){for(const actor of actors){actor.dir=facing;actor.anim=0;}window.spritePreviewState={facing,map:document.getElementById('preview-map').value};status.textContent='Standing views · '+{down:'front',left:'left',up:'back'}[facing];}
  function location(id){
   WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.pendingAuto=false;WM.field.nameBanner=null;
   const p=WM.field.player,origin=p.x;
   actors=[Object.create(p),p,Object.create(p)];
   actors.forEach((actor,i)=>{actor.x=origin+(i-1)*32;actor.y=p.y;actor.isPlayer=i===1;actor.sheet=()=>sheets[i];actor.anim=0;});
   WM.field.actors=[actors[0],actors[2]];
   WM.setScene({draw:()=>WM.field.draw(),update},null,true);update();
  }
  location('zhugui_in');
  document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{facing=b.dataset.facing;update();});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
