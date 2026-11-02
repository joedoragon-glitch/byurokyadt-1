// Issue #16: actual mobile Chromium gestures, default-on Web Audio and wall shadow probe.
// User-supplied iPhone screenshot is a visual target, not a claim of native iOS testing.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:8000/';
const url=new URL(base);url.searchParams.set('inspect','1');
await mkdir('test-results/phone-feedback',{recursive:true});
const browser=await chromium.launch();
const errors=[],results={base:url.href};
try {
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,
  isMobile:true,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();
 page.setDefaultTimeout(60000);
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/js/app.js*',async route=>{
  const response=await route.fetch(),source=await response.text();
  const anchor='resetVisual();renderer.render(scene,camera);';
  assert(source.includes(anchor),'Scene probe injection anchor missing');
  const probe=String.raw`
window.__SHADOW_REVIEW=()=>{
 const names=['front-wall-service-board','front-wall-electrical-box','front-wall-electrical-face'];
 const panels=names.map(n=>scene.getObjectByName(n));
 if(panels.some(p=>!p))throw Error('Missing named front-wall panels');
 const before=panels.map(p=>p.castShadow);
 // With ceiling-driven shadows, a 3 m object cannot project several
 // metres across the office, regardless of any accidental wall caster.
 const incidence=key.position.clone().sub(key.target.position);
 const projectedFrom3m=3*Math.hypot(incidence.x,incidence.z)/incidence.y;
 camera.position.set(0,1.7,2.7);camera.rotation.set(-.25,Math.PI,0);
 const gl=renderer.getContext(),w=renderer.domElement.width,h=renderer.domElement.height;
 const read=(cast)=>{
  panels.forEach(p=>p.castShadow=cast);renderer.shadowMap.needsUpdate=true;
  renderer.render(scene,camera);
  const pixels=new Uint8Array(w*h*4);
  gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  return pixels;
 };
 const withCasters=read(true),withoutCasters=read(false);
 let changed=0,formerDarker=0,formerBrighter=0;
 for(let i=0;i<withCasters.length;i+=4){
  const a=withCasters[i]+withCasters[i+1]+withCasters[i+2];
  const b=withoutCasters[i]+withoutCasters[i+1]+withoutCasters[i+2];
  if(Math.abs(a-b)>30){changed++;if(a<b)formerDarker++;else formerBrighter++}
 }
 panels.forEach((p,i)=>p.castShadow=before[i]);
 renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
 return {names,initialCasters:before,projectedFrom3m,changed,formerDarker,formerBrighter,
  expected:{castersOff:before.every(v=>!v)},resolution:[w,h]};
};
window.__SHADOW_REVIEW_RESTORE=()=>{
 camera.position.set(0,1.70,2.7);camera.rotation.set(.018,0,0);
 syncLook();needsFrame=true;renderer.render(scene,camera);
};
`;
  await route.fulfill({response,body:source.replace(anchor,probe+'\n'+anchor)});
 });
 await page.goto(url.href);
 await page.locator('#loading').waitFor({state:'hidden',timeout:60000});
 assert.equal(await page.locator('#fatal').isVisible(),false);
 assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#music').getAttribute('aria-pressed'),'true');
 assert.equal(await page.evaluate(()=>window.MinistryAudio.state().context),'unstarted',
  'No attempt to bypass user-gesture autoplay on initial page load');
 assert.equal(await page.locator('#moveStick').isVisible(),false,'Joystick must be hidden at rest');
 assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().room.touchMovement),true);
 const probe=await page.evaluate(()=>window.__SHADOW_REVIEW());
 results.shadow=probe;
 assert(probe.expected.castersOff,'Decorative front-wall backplates must not cast by default');
 assert(probe.projectedFrom3m<.60,
  'Overhead shadow geometry must not stretch a 3 m cabinet into a long window-like floor silhouette');
 // The previous oblique-light test expected deliberately re-enabled wall
 // decorations to recreate large detached patches. That is no longer the
 // desired behavior: both caster selection AND shadow direction prevent it.
 await page.locator('#app canvas').screenshot({path:'test-results/phone-feedback/front-wall-fixed.png'});
 await page.evaluate(()=>window.__SHADOW_REVIEW_RESTORE());
 // Native touch events, including a movement gesture and cleanup.
 const session=await context.newCDPSession(page);
 const point=(id,x,y)=>({id,x,y});
 const start=await page.evaluate(()=>window.BYUR_INSPECT.snapshot().camera);
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(1,82,230)]});
 assert.equal(await page.locator('#moveStick').isVisible(),true);
 assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().room.stickActive),true);
 await page.locator('#moveStick').screenshot({path:'test-results/phone-feedback/joystick-active.png'});
 await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(1,82,152)]});
 await page.waitForTimeout(450);
 const moved=await page.evaluate(()=>window.BYUR_INSPECT.snapshot());
 assert(moved.room.stickVector[1]<-.7,'Upward thumb gesture must mean forward movement');
 assert(moved.camera[2]<start[2]-.08,'Thumbstick must actually move the camera');
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await page.locator('#moveStick').isVisible(),false);
 assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().room.stickActive),false);
 // The first real touch must also unlock both independent, default-enabled buses.
 await page.waitForFunction(()=>window.MinistryAudio.state().decoded.length===10 &&
  window.MinistryAudio.state().context==='running',{},{timeout:40000});
 const active=await page.evaluate(()=>window.MinistryAudio.state());
 assert.equal(active.effectsOn,true);
 assert.equal(active.musicOn,true);
 results.mobile={start,moved:moved.camera,afterGesture:{context:active.context,effectsOn:active.effectsOn,musicOn:active.musicOn}};
 await context.close();
 // A narrow desktop viewport is not enough to enable a joystick.
 const desktop=await browser.newContext({viewport:{width:900,height:700},hasTouch:false,
  serviceWorkers:'block',reducedMotion:'reduce'});
 const dp=await desktop.newPage();
 dp.on('pageerror',e=>errors.push('desktop: '+e.message));
 await dp.goto(url.href);await dp.locator('#loading').waitFor({state:'hidden',timeout:60000});
 assert.equal(await dp.evaluate(()=>window.BYUR_INSPECT.snapshot().room.touchMovement),false);
 assert.equal(await dp.locator('#moveStick').isVisible(),false);
 results.desktop={touchMovement:false};
 await desktop.close();
 assert.deepEqual(errors,[],'No browser page errors');
 await writeFile('test-results/phone-feedback/report.json',JSON.stringify(results,null,2));
 console.log('Phone feedback regression: gesture audio, moving hidden joystick, desktop gate, isolated wall shadows passed');
} finally {await browser.close()}
