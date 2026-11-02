// Matched playable screenshots, not an aesthetic pass/fail by computer vision.
// Run with base and candidate static servers on ports 8001 and 8000 respectively.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=process.env.ROOM_BEFORE_URL||'http://127.0.0.1:8001/';
const changed=process.env.ROOM_AFTER_URL||'http://127.0.0.1:8000/';
const names=['operator','front-wall',...Array.from({length:8},(_,i)=>'cinema-'+String(i+1).padStart(2,'0')),'mobile-operator'];
const chromiumBrowser=await chromium.launch();
await mkdir('test-results/room-before',{recursive:true});
await mkdir('test-results/room-after',{recursive:true});
await mkdir('test-results/room-pairs',{recursive:true});
const checksum=data=>createHash('sha256').update(data).digest('hex');
const results={baseline:base,candidate:changed,viewport:{width:1280,height:720},matchedViews:names,shots:{},errors:{},comparison:{},method:'Playwright Chromium same viewport, reduced motion, same operator starting camera and eight production cinematic shots'};
async function run(tag,baseURL){
 const context=await chromiumBrowser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];
 page.setDefaultTimeout(90000);
 page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 const url=new URL(baseURL);url.searchParams.set('inspect','1');
 await page.goto(url.href);
 await page.locator('#loading').waitFor({state:'hidden',timeout:60000});
 assert(!(await page.locator('#fatal').isVisible()),tag+' renderer failed');
 const capture=async name=>{
  const file='test-results/room-'+tag+'/'+name+'.png';
  await page.locator('#app canvas').screenshot({path:file});
  const snapshot=await page.evaluate(()=>window.BYUR_INSPECT.snapshot());
  assert(snapshot.safe,tag+' '+name+' camera outside walkable room');
  results.shots[name]??={};
  const bytes=await readFile(file);
  results.shots[name][tag]={calls:snapshot.calls,triangles:snapshot.triangles,sha256:checksum(bytes),bytes:bytes.length,camera:snapshot.camera,room:snapshot.room??null};
 };
 await capture('operator');
 // One deliberate 180-degree look covers the missing +Z wall; not a new cinematic route.
 await page.mouse.move(1060,350);await page.mouse.down();
 await page.mouse.move(275,350,{steps:20});await page.mouse.up();
 await capture('front-wall');
 await page.locator('#cinemaEnter').click();
 await page.waitForFunction(()=>!window.BYUR_INSPECT.snapshot().cinema.travelling);
 for(let i=0;i<8;i++){
  await page.locator('#cinemaShot').selectOption(String(i));
  await page.waitForFunction(()=>!window.BYUR_INSPECT.snapshot().cinema.travelling);
  await page.locator('#cinemaHide').click();
  await capture('cinema-'+String(i+1).padStart(2,'0'));
  await page.locator('#cinemaReveal').click();
 }
 await page.locator('#cinemaExit').click();
 await page.setViewportSize({width:390,height:844});
 await page.locator('#roomView').click();await page.waitForFunction(()=>window.BYUR_INSPECT.viewReady());
 await capture('mobile-operator');
 results.errors[tag]=errors;
 assert.deepEqual(errors,[],tag+' page must be error-free');
 await context.close();
}
try{
 await run('before',base);
 await run('after',changed);
 const finished=results.shots['operator'].after.room;
 assert(finished&&finished.frontWall==='room-front-wall','Candidate must expose completed front wall');
 assert.deepEqual(finished.frontWallSize.map(v=>Math.round(v*100)/100),[12,6,.2]);
 assert.equal(finished.frontWallZ,7);
 // Atlas pairs are exact same-shot photographs, labeled and preserved in original resolution.
 const compositor=await chromiumBrowser.newPage();
 await compositor.setContent('<!doctype html><html><body></body></html>');
 for(const name of names){
  const before=await readFile('test-results/room-before/'+name+'.png');
  const after=await readFile('test-results/room-after/'+name+'.png');
  const png64=await compositor.evaluate(async ({left,right,name})=>{
   const load=async data=>{const im=new Image();im.src='data:image/png;base64,'+data;await im.decode();return im};
   const a=await load(left),b=await load(right);
   if(a.width!==b.width||a.height!==b.height)throw Error('Mismatched '+name);
   const header=46,canvas=document.createElement('canvas');
   canvas.width=a.width*2;canvas.height=a.height+header;
   const g=canvas.getContext('2d');
   g.fillStyle='#242923';g.fillRect(0,0,canvas.width,header);
   g.fillStyle='#ece7d3';g.font='bold 23px sans-serif';
   g.fillText('BEFORE  /  MAIN',16,31);g.fillText('AFTER  /  ISSUE #7',a.width+16,31);
   g.drawImage(a,0,header);g.drawImage(b,a.width,header);
   return canvas.toDataURL('image/png').split(',')[1];
  },{left:before.toString('base64'),right:after.toString('base64'),name});
  await writeFile('test-results/room-pairs/'+name+'.png',Buffer.from(png64,'base64'));
  results.comparison[name]={differentPixelsUnknown:true,pngBytes:[before.length,after.length],sameCamera:results.shots[name].before.camera.every((n,i)=>Math.abs(n-results.shots[name].after.camera[i])<.0001)};
  assert(results.comparison[name].sameCamera,name+' must use matched camera positions');
 }
 await compositor.close();
 await writeFile('test-results/room-visual.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify({passed:true,views:names.length,pairs:names.length,frontWall:finished,drawCalls:{before:results.shots.operator.before.calls,after:results.shots.operator.after.calls},triangles:{before:results.shots.operator.before.triangles,after:results.shots.operator.after.triangles},mobile:true,errors:results.errors},null,2));
}catch(e){
 await writeFile('test-results/room-visual-failure.json',JSON.stringify({error:String(e),results},null,2));
 throw e;
}finally{await chromiumBrowser.close()}
