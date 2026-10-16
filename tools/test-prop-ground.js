'use strict';
const assert=require('assert/strict'),{load}=require('./headless');const sb=load(),W=sb.WM,draws=[],pending=[];
sb.Image=function(){Object.defineProperty(this,'src',{set:s=>{this.srcPath=s;pending.push(this);}});};W.tiles.reloadArt();pending.forEach(i=>i.onload());
const original=W.util.makeWorldCanvas;W.util.makeWorldCanvas=function(w,h){const cv=original(w,h),ctx=cv.getContext('2d');ctx.drawImage=(...a)=>draws.push(a);return cv;};
function check(ch,floor,interior,theme='spring'){draws.length=0;const m={theme,w:3,h:3,def:{},interior,get(x,y){return x<0||y<0||x>=3||y>=3?null:x===1&&y===1?ch:floor;}};W.tiles.bake(m);return draws.filter(d=>d[5]===16&&d[6]===16);}
for(const ch of ['j','p','t','h']){const d=check(ch,'.',false);assert(d.some(d=>d[0].srcPath.endsWith('/ground.png')),ch+' inherits grass');assert(!d.some(d=>d[0].srcPath.endsWith('/surfaces.png')),ch+' has no floor patch outdoors');}
assert(check('j','N',true).some(d=>d[0].srcPath.endsWith('/surfaces.png')),'indoor jar retains stone floor');
console.log('PASS: wells, jars and furniture inherit outdoor grass; interior stone floor preserved.');

for(const theme of ['spring','snow'])assert(check('F','=',false,theme).some(d=>theme==='snow'?d[0].srcPath.endsWith('/regional-snow.png'):d[0].srcPath.endsWith('/paving-refined.png')),theme+' fence retains surrounding paving');
