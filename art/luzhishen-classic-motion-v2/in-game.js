'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  async function load(url){const img=new Image();img.src=url;await img.decode();const cv=WM.util.makeCanvas(img.width,img.height);cv.getContext('2d').drawImage(img,0,0);Object.assign(cv,{artScale:8,isOverride:true,cw:24,ch:32});return cv;}
  const sheets=await Promise.all(['walking','standing'].map(kind=>load('art/luzhishen-classic-motion-v2/luzhishen-'+kind+'.png')));
  WM.boot();WM.S.newGame();WM.S.initChar('luzhishen',20);WM.state.party=['luzhishen'];WM.state.leader='luzhishen';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let facing='down',paused=false,elapsed=0,phase=0,reference,origin;const keys=new Set();
  const places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  function update(dt=0){
   const p=WM.field.player;
   if(!paused){elapsed+=Math.min(dt,.1);phase=Math.floor(elapsed*5)%4;const dx=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),dy=Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'));
    if(dx||dy){const length=Math.hypot(dx,dy),step=22*Math.min(dt,.1);p.x=Math.max(origin.x+4,Math.min(origin.x+38,p.x+dx/length*step));p.y=Math.max(origin.y-12,Math.min(origin.y+12,p.y+dy/length*step));facing=dx?(dx>0?'right':'left'):(dy>0?'down':'up');}
   }
   p.dir=reference.dir=facing;p.anim=phase;reference.anim=0;
   status.textContent='Lu Zhishen'+' · '+facing+' · '+(paused?'paused':'walking')+' · frame '+([0,1,0,2][phase]+1);
   window.spritePreviewState={facing,paused,phase,column:[0,1,0,2][phase]};
  }
  function location(id){WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.pendingAuto=false;WM.field.nameBanner=null;const p=WM.field.player;origin={x:p.x,y:p.y};reference=Object.create(p);reference.isPlayer=false;reference.x=origin.x-20;reference.y=origin.y;reference.sheet=()=>sheets[1];p.x=origin.x+20;p.sheet=()=>sheets[0];WM.field.actors=[reference];WM.setScene({draw:()=>WM.field.draw(),update},null,true);update();}
  location('zhugui_in');
  document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{facing=b.dataset.facing;update();});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'Play':'Pause';update();};
  document.getElementById('step').onclick=()=>{paused=true;phase=(phase+1)%4;elapsed=phase/5;document.getElementById('pause').textContent='Play';update();};
  window.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')&&!['SELECT','INPUT'].includes(e.target.tagName)){keys.add(e.key);e.preventDefault();}});window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
