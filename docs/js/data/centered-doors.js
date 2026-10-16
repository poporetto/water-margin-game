// Center exterior building entrances after all authored maps and links are registered.
// Keep a migration table for old saves and script-specified arrival coordinates.
'use strict';
(function(){
 var migrations=WM.centeredDoorMoves={},maps=WM.data.maps;
 function moveFor(id,x,y){return (migrations[id]||[]).filter(function(m){return x>=m.oldX&&x<m.oldX+m.oldW&&(y===m.y||y===m.y+1);})[0];}
 WM.centeredEntry=function(id,x,y){var m=moveFor(id,x,y);return m?{x:m.x,y:y}: {x:x,y:y};};
 Object.keys(maps).forEach(function(id){var def=maps[id];if(def.interior||def.world||!Array.isArray(def.rows))return;
  var rows=def.rows.map(function(r){return r.split('');}),moves=[];
  function roofType(x,y){for(var yy=y-1;yy>=0;yy--){var ch=rows[yy][x];if(!ch)return '';if('WORdD'.indexOf(ch)>=0)continue;return '^zvZ'.indexOf(ch)>=0?ch:'';}return '';}
  for(var y=0;y<rows.length;y++)for(var x=0;x<rows[y].length;x++){
   if('WOR'.indexOf(rows[y][x])<0&&'Dd'.indexOf(rows[y][x])<0)continue;
   var start=x,roof=roofType(x,y);while(x+1<rows[y].length&&'WORdD'.indexOf(rows[y][x+1])>=0&&roofType(x+1,y)===roof)x++;var end=x,w=end-start+1;
   var doors=[];for(var xx=start;xx<=end;xx++)if('Dd'.indexOf(rows[y][xx])>=0)doors.push(xx);
   if(!doors.length||w<3||doors.some(function(d,i){return i&&d!==doors[i-1]+1;}))continue;
   var roofY=y-1;while(roofY>=0&&'WOR'.indexOf(rows[roofY][start])>=0)roofY--;
   if(roofY<0||'^zvZ'.indexOf(rows[roofY][start])<0)continue;
   var width=w%2?1:2,nx=start+Math.floor((w-width)/2),ch=rows[y][doors[0]],wall=rows[y].slice(start,end+1).indexOf('R')>=0?'R':'W';
   doors.forEach(function(dx){rows[y][dx]=wall;});
   for(var j=0;j<width;j++)rows[y][nx+j]=ch;
   if(rows[y+1])for(var j=0;j<width;j++){var at=nx+j,item=rows[y+1][at];if('jLp'.indexOf(item)>=0){for(var d=1;d<rows[y+1].length;d++){var to=at-d;if(to>=0&&rows[y+1][to]==='.'&&(to<nx||to>=nx+width)){rows[y+1][to]=item;rows[y+1][at]=':';break;}}}}
   var m={oldX:doors[0],oldW:doors.length,x:nx,y:y,w:width};moves.push(m);
   // Connect the moved threshold to its former approach without altering nearby structures.
   if(rows[y+1])for(var xx=Math.min(nx,doors[0]);xx<=Math.max(nx+width-1,doors[doors.length-1]);xx++)if('.,f:TPbHm'.indexOf(rows[y+1][xx])>=0)rows[y+1][xx]=':';
  }
  if(moves.length){migrations[id]=moves;def.rows=rows.map(function(r){return r.join('');});delete def._baked;}
 });
 Object.keys(maps).forEach(function(id){var def=maps[id];(Array.isArray(def.exits)?def.exits:[]).forEach(function(e){var own=moveFor(id,e.x,e.y);if(own&&e.y===own.y){e.x=own.x;e.w=own.w;}var target=moveFor(e.to,e.tx,e.ty);if(target)e.tx=target.x;});
  if(def.spawn){var p=WM.centeredEntry(id,def.spawn[0],def.spawn[1]);def.spawn=[p.x,p.y];}
  (WM.data.events[id]||[]).forEach(function(e){var m=moveFor(id,e.x,e.y);if(m)e.x=m.x;});
  // Named door collections are also used by later event code.
  var doors=WM.data[id+'Doors'];if(doors)Object.keys(doors).forEach(function(k){var d=doors[k],m=moveFor(id,d.x,d.y);if(m){d.x=m.x;d.w=m.w;}});
 });
})();
