// Exercise the production path at dense feed intervals; check physical constraints.
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile('js/app.js','utf8'),start=source.indexOf('// Paper path is measured'),end=source.indexOf('// End paper path.');
const context={};vm.createContext(context);vm.runInContext(source.slice(start,end)+';this.path={outputPath,outputSurface,outputHeight,outputVertex}',context);
const {outputPath:p,outputSurface:surface,outputHeight:height,outputVertex:vertex}=context.path;
let samples=0;
for(let head=0;head<=1.94;head+=.004){
 let previous;
 for(let row=0;row<=240;row++){
  const v=row/240,a=vertex(head,v);samples++;
  assert(a.z>=p.inletZ-1e-8,'Hidden paper stays inside the outlet');
  assert(a.z<=surface(p.end).z,'Paper remains within receiving chute');
  assert(a.y-height(a.z)>=p.clearance-1e-9,'Paper stays above metal at every vertex');
  assert(Math.abs(a.v-Math.min(v,head/p.length))<1e-8,'Clipping crops UVs instead of stretching artwork');
  if(previous)assert(previous.z>=a.z,'Sheet cannot fold backwards through itself');previous=a;
 }
}
// Arc-length profile preserves paper dimensions around the curve.
for(let s=0;s<p.end;s+=.001){const a=surface(s),b=surface(s+.0001);assert(Math.abs(Math.hypot(b.y-a.y,b.z-a.z)/.0001-1)<.0001)}
const stampHead=p.stampS+(1-704/1050)*p.length;
const ink=vertex(stampHead,1-704/1050);assert(Math.abs(ink.z-.06)<1e-8);assert(Math.abs(ink.y-(p.height+p.clearance))<1e-8);
assert(stampHead<p.length,'Press stamps the exposed leading portion while the rest remains inside');
console.log(`ОТК: ${samples} paper vertices clear the metal; artwork and stamp registration agree`);
