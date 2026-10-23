'use strict';
(async()=>{
 const status=document.getElementById('preview-status');
 try{
  const catalog=[
   {id:'songjiang',name:'Song Jiang',detail:'songjiang-classic-motion-v3'},
   {id:'linchong-official',name:'Lin Chong · Imperial instructor',detail:'linchong-classic-motion-v3'},
   {id:'linchong-exile',name:'Lin Chong · Exile',detail:'linchong-classic-motion-v3'},
   {id:'luzhishen',name:'Lu Zhishen',detail:'luzhishen-classic-motion-v2'},
   {id:'luda',name:'Lu Da',detail:'luda-classic-motion-v1'},
   {id:'wusong',name:'Wu Song · Walking review',detail:'wusong-classic-motion-v2',file:'art/wusong-classic-motion-v2/wusong-walking.png'},
   {id:'likui',name:'Li Kui · Walking review',detail:'likui-classic-motion-v1',file:'art/likui-classic-motion-v1/likui-walking.png'},
   {id:'chaogai',name:'Chao Gai · Walking review',detail:'chaogai-classic-motion-v1',file:'art/chaogai-classic-motion-v1/chaogai-walking.png'},
   {id:'yangzhi',name:'Yang Zhi · Walking review',detail:'yangzhi-classic-motion-v1',file:'art/yangzhi-classic-motion-v1/yangzhi-walking.png'},
   {id:'wuyong',name:'Wu Yong · Walking review',detail:'wuyong-classic-motion-v1',file:'art/wuyong-classic-motion-v1/wuyong-walking.png'}
  ];
  const selector=document.getElementById('preview-character');
  selector.replaceChildren(...catalog.map(c=>new Option(c.name,c.id)),new Option('Animation batch · Chao Gai / Li Kui / Yang Zhi / Wu Yong','batch'),new Option('All characters together','all'));
  const grouped=()=>selection==='all'||selection==='batch';
 const isStanding=()=>!grouped()&&!!catalog.find(c=>c.id===selection).standing;
  const lacksRight=()=>grouped()?catalog.some(c=>c.standing):isStanding();
  const sheets=new Map(await Promise.all(catalog.map(async entry=>{
   const img=new Image();img.src=entry.file||'assets/sprites/'+entry.id+'.png';await img.decode();
   const cv=WM.util.makeCanvas(img.width,img.height);cv.getContext('2d').drawImage(img,0,0);
   Object.assign(cv,{artScale:8,isOverride:true,cw:24,ch:32,spriteId:entry.id});return [entry.id,cv];
  })));
  WM.boot();WM.S.newGame();WM.S.initChar('luda',20);WM.state.party=['luda'];WM.state.leader='luda';WM.state.opts.music=0;WM.state.opts.sfx=0;
  let selection=document.body.dataset.character||'luda',mapId='zhugui_in',facing='down',paused=false,elapsed=0,phase=0,reference,origin,walkers=[],offset={x:0,y:0};
  document.getElementById('preview-character').value=selection;
  const keys=new Set(),places={zhugui:[9,17],liangshan:[25,32],zhugui_in:[7,6]};
  function update(dt=0){
   if(!paused){
    elapsed+=Math.min(dt,.1);phase=Math.floor(elapsed*5)%4;
    const dx=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),dy=Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'));
    if(dx||dy){const length=Math.hypot(dx,dy),step=22*Math.min(dt,.1),limit=grouped()?8:18;
     offset.x=Math.max(-limit,Math.min(limit,offset.x+dx/length*step));offset.y=Math.max(-12,Math.min(12,offset.y+dy/length*step));
     const nextFacing=dx?(dx>0?'right':'left'):(dy>0?'down':'up');if(!(lacksRight()&&nextFacing==='right'))facing=nextFacing;
    }
   }
   walkers.forEach(({actor,x,y,standing})=>{actor.x=x+offset.x;actor.y=y+offset.y;actor.dir=facing;actor.anim=standing?0:phase;});
   if(reference){reference.dir=facing;reference.anim=0;}
   const name=selection==='all'?'All characters':selection==='batch'?'Chao Gai · Li Kui · Yang Zhi · Wu Yong':catalog.find(c=>c.id===selection).name;
   status.textContent=name+' · '+facing+((isStanding()||(selection==='batch'&&['chaogai','likui','yangzhi','wuyong'].every(id=>catalog.find(c=>c.id===id).standing)))?' · standing views':(' · '+(paused?'paused':'walking')+' · frame '+([0,1,0,2][phase]+1)));
   window.spritePreviewState={selection,characters:walkers.map(w=>w.id),facing,paused,phase,column:[0,1,0,2][phase]};
  }
  function location(id){
   const hasStanding=lacksRight();
   if(hasStanding&&facing==='right')facing='left';
   document.querySelector('[data-facing="right"]').disabled=hasStanding;
   mapId=id;offset={x:0,y:0};keys.clear();WM.field.musicLocked=true;WM.field.loadMap(id,...places[id],facing,true);WM.field.pendingAuto=false;WM.field.nameBanner=null;
   const p=WM.field.player;origin={x:p.x,y:p.y};reference=null;walkers=[];WM.field.actors=[];
   const entries=selection==='all'?catalog:selection==='batch'?['chaogai','likui','yangzhi','wuyong'].map(id=>catalog.find(c=>c.id===id)):catalog.filter(c=>c.id===selection),center=Math.floor(entries.length/2);
   entries.forEach((entry,i)=>{
    const actor=i===center?p:Object.create(p);actor.isPlayer=actor===p;actor.sheet=()=>sheets.get(entry.id);actor.sheetId=entry.id;
    const columns=Math.min(5,entries.length),row=Math.floor(i/columns),rowCount=Math.ceil(entries.length/columns),inRow=Math.min(columns,entries.length-row*columns);
    const x=origin.x+(grouped()?-8+(i%columns-(inRow-1)/2)*29:20),y=origin.y+(grouped()?(row-(rowCount-1)/2)*36:0);walkers.push({actor,id:entry.id,x,y,standing:!!entry.standing});
    if(actor!==p)WM.field.actors.push(actor);
   });
   if(!grouped()){reference=Object.create(p);reference.isPlayer=false;reference.x=origin.x-20;reference.y=origin.y;reference.sheet=()=>sheets.get(isStanding()?'songjiang':selection);WM.field.actors.push(reference);}
   const detail=document.getElementById('detail-link');detail.hidden=grouped();
   if(!grouped())detail.href='art/'+entries[0].detail+'/compare.html';
   document.getElementById('preview-help').textContent=grouped()
    ?'Left to right, top row first: '+entries.map(c=>c.name).join(' · ')+(catalog.some(c=>c.standing)?' — Standing entries have front, left and back views only.':' — All characters walk in four directions. Arrow keys move the group.')
    :isStanding()?'Left: Song Jiang Classic reference · Right: standing candidate. Front, left and back only; walking follows design approval.':'Left: standing reference · Right: walking · Arrow keys move the walking sprite.';
   WM.setScene({draw:()=>WM.field.draw(),update},null,true);update();
  }
  location(mapId);
  document.getElementById('preview-character').onchange=e=>{selection=e.target.value;location(mapId);};
  document.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>{facing=b.dataset.facing;update();});
  document.getElementById('preview-map').onchange=e=>location(e.target.value);
  document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'Play':'Pause';update();};
  document.getElementById('step').onclick=()=>{paused=true;phase=(phase+1)%4;elapsed=phase/5;document.getElementById('pause').textContent='Play';update();};
  window.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')&&!['SELECT','INPUT'].includes(e.target.tagName)){keys.add(e.key);e.preventDefault();}});
  window.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
  window.spritePreviewReady=true;
 }catch(e){status.textContent=e.message;console.error(e);}
})();
