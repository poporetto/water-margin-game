'use strict';
(async function () {
  const status = document.getElementById('preview-status');
  try {
    async function makeSheet(source, aligned=true) {
    const image = new Image();
    image.src = source;
    await image.decode();
    // Nearest-neighbour reduction for an in-engine scale preview. No palette changes.
    const sheet = document.createElement('canvas'); sheet.width = 144; sheet.height = 256;
    const context = sheet.getContext('2d'); context.imageSmoothingEnabled = false;
    const crops = aligned ? [[80,96,416,832], [1120,96,352,832], [1120,96,352,832], [576,96,432,832]] : [[80,94,416,838], [1120,104,342,828], [1120,104,342,828], [575,94,425,838]];
    crops.forEach(([x,y,w,h], row) => {
      const frame = document.createElement('canvas'); frame.width=48;frame.height=64;
      const c=frame.getContext('2d');c.imageSmoothingEnabled=false;
      const height=aligned?h/16:54, width=aligned?w/16:Math.round(w*height/h);
      if(row===2){c.translate(48,0);c.scale(-1,1);}
      c.drawImage(image,x,y,w,h,Math.floor((48-width)/2),64-height,width,height);
      // Cut low-opacity generation halos, retaining the source's solid artwork.
      const pixels=c.getImageData(0,0,48,64);
      for(let i=3;i<pixels.data.length;i+=4)pixels.data[i]=pixels.data[i]>=200?255:0;
      c.putImageData(pixels,0,0);
      for(let col=0;col<3;col++)context.drawImage(frame,col*48,row*64);
    });
    sheet.artScale=2;sheet.isOverride=true;sheet.cw=24;sheet.ch=32;
    return sheet;
    }
    const [sheet, previousSheet] = await Promise.all([makeSheet('art/songjiang-game-preview/design.png'), makeSheet('art/songjiang-game-preview/design.png',false)]);
    async function loadPoses(path, battle=false) {
      const img=new Image();img.src=path;await img.decode();
      const cv=document.createElement('canvas');cv.width=144;cv.height=256;
      const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
      if(battle){for(let r=0;r<4;r++)c.drawImage(img,0,r*64);}else c.drawImage(img,0,0);
      cv.artScale=2;cv.isOverride=true;cv.cw=24;cv.ch=32;return cv;
    }
    const [walking,jian]=await Promise.all([loadPoses('art/songjiang-walk-v5/songjiang-walking.png'),loadPoses('art/songjiang-poses-v2/songjiang-jian.png',true)]);
    // Use the corrected front-facing idle in the standing comparison too.
    const standingContext=sheet.getContext('2d');
    standingContext.clearRect(0,0,144,64);
    for(let col=0;col<3;col++)standingContext.drawImage(walking,0,0,48,64,col*48,0,48,64);
    let pose='walking';
    WM.boot();
    WM.S.newGame();WM.S.initChar('songjiang',20);
    WM.state.party=['songjiang'];WM.state.leader='songjiang';
    WM.state.opts.music=0;WM.state.opts.sfx=0;
    WM.sprites.overrides.songjiang=walking;
    const locations={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
    let facing='down',compare=false;
    function location(id){
      const [x,y]=locations[id];WM.field.musicLocked=true;
      WM.field.loadMap(id,x,y,facing,true);WM.field.actors=[];WM.field.pendingAuto=false;WM.field.nameBanner=null;
      WM.setScene({draw:()=>WM.field.draw(),update:()=>{WM.field.player.anim=pose==='standing'?0:[0,1,0,2][Math.floor(WM.time*5)%4];}},null,true);
      status.textContent=pose==='walking'?'Walking · consistent beard and collar · coordinated bob':pose==='standing'?'Approved standing · original palette':'Jian draft';
    }
    location('zhugui_in');
    document.getElementById('preview-map').value='zhugui_in';
    document.getElementById('preview-pose').value='walking';
    document.getElementById('preview-compare').disabled=true;
    document.querySelectorAll('[data-facing]').forEach(button=>button.onclick=()=>{
      facing=pose==='jian'?'left':button.dataset.facing;WM.field.player.dir=facing;
      document.querySelectorAll('[data-facing]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    });
    document.getElementById('preview-pose').onchange=e=>{
      pose=e.target.value;compare=false;
      WM.sprites.overrides.songjiang=pose==='walking'?walking:pose==='jian'?jian:sheet;
      if(pose==='jian'){facing='left';WM.field.player.dir='left';}
      status.textContent=pose==='standing'?'Approved richer palette':pose==='walking'?'Walking · consistent beard and collar · coordinated bob':'Jian draft · proportions under review';
      document.getElementById('preview-compare').disabled=pose!=='standing';
    };
    document.getElementById('preview-map').onchange=e=>location(e.target.value);
    document.getElementById('preview-compare').onclick=e=>{
      compare=!compare;WM.sprites.overrides.songjiang=compare?previousSheet:sheet;
      e.target.textContent=compare?'Show consistent-scale version':'Compare old reduction';
      status.textContent=compare?'Old uneven reduction':'Uniform 1:16 sampling · original palette · standing preview';
    };
  } catch(error){status.textContent='Preview could not load: '+error.message;console.error(error);}
})();
