'use strict';
(async()=>{
  const status=document.getElementById('preview-status');
  try {
    async function sheet(name,battle=false){
      const img=new Image();img.src=`art/songjiang-suikoden2-v6/${name}.png`;await img.decode();
      const cv=document.createElement('canvas');cv.width=144;cv.height=256;
      const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
      if(battle)for(let r=0;r<4;r++)c.drawImage(img,0,r*64);else c.drawImage(img,0,0);
      cv.artScale=2;cv.isOverride=true;cv.cw=24;cv.ch=32;return cv;
    }
    const [walk,battle]=await Promise.all([sheet('songjiang-walking'),sheet('songjiang-battle',true)]);
    WM.boot();WM.S.newGame();WM.S.initChar('songjiang',20);
    WM.state.party=['songjiang'];WM.state.leader='songjiang';WM.state.opts.music=0;WM.state.opts.sfx=0;
    WM.sprites.overrides.songjiang=walk;
    let pose='walking',facing='down';
    const places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
    function location(id){
      WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.actors=[];WM.field.pendingAuto=false;WM.field.nameBanner=null;
      WM.setScene({draw:()=>WM.field.draw(),update:()=>{
        WM.field.player.anim=[0,1,0,2][Math.floor(WM.time*5)%4];
      }},null,true);
      status.textContent='Song Jiang · four-direction walk · sword guard';
    }
    location('zhugui_in');document.getElementById('preview-map').value='zhugui_in';
    document.getElementById('preview-pose').value='walking';
    document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{
      facing=pose==='jian'?'left':b.dataset.facing;WM.field.player.dir=facing;
    });
    document.getElementById('preview-map').onchange=e=>location(e.target.value);
    document.getElementById('preview-pose').onchange=e=>{
      pose=e.target.value;WM.sprites.overrides.songjiang=pose==='jian'?battle:walk;
      if(pose==='jian')facing='left';WM.field.player.dir=facing;
    };
    window.spritePreviewReady=true;
  }catch(e){status.textContent=e.message;console.error(e);}
})();
