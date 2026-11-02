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
 const clock=scene.getObjectByName('room-clock-case');
 const icedGlazing=scene.getObjectByName('iced-window-glazing');
 const masonry=['room-door-left-masonry','room-door-right-masonry','room-door-lintel'].map(n=>scene.getObjectByName(n));
 if(!clock||!icedGlazing||masonry.some(m=>!m))throw Error('Clock, frosted glazing or doorway masonry missing');
 const panels=names.map(n=>scene.getObjectByName(n));
 if(panels.some(p=>!p))throw Error('Missing named front-wall panels');
 const before=panels.map(p=>p.castShadow);
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
 return {names,initialCasters:before,changed,formerDarker,formerBrighter,
  clock:{casts:clock.castShadow,z:clock.position.z},
  glazing:{casts:icedGlazing.castShadow},
  masonry:masonry.map(m=>({name:m.name,casts:m.castShadow})),
  rig:{x:key.position.x,y:key.position.y,z:key.position.z,
   hemisphere:scene.children.filter(o=>o.isHemisphereLight).map(o=>o.intensity),
   windowFill:daylight.intensity},
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
 assert.equal(probe.clock.casts,false,'Wall clock should not project elongated decorative shadows');
 assert.equal(probe.glazing.casts,false,'Frosted glass must not act as an opaque window shadow caster');
 assert(Math.abs(probe.clock.z+6.665)<.001,'Clock case must rest against rear masonry');
 assert(probe.masonry.every(m=>!m.casts),'Doorway masonry remains an unshadowed shell');
 assert(Math.hypot(probe.rig.x,probe.rig.z)/probe.rig.y<.30,
  'Shadow direction should be dominated by the overhead fluorescent fittings');
 assert(probe.rig.windowFill<2.5,'Frosted winter window must remain diffuse supplementary fill');
 // Re-enabling legacy decorative casters is diagnostic only: it must not be
 // required to recreate a large oblique sun shadow after the lighting correction.
 await page.locator('#app canvas').screenshot({path:'test-results/phone-feedback/front-wall-fixed.png'});
 await page.evaluate(()=>{
  camera.position.set(0,3.83,-4.8);camera.lookAt(0,3.83,-6.62);renderer.render(scene,camera);
 });
 await page.locator('#app canvas').screenshot({path:'test-results/phone-feedback/clock-wall.png'});
 await page.evaluate(()=>{
  camera.position.set(4.5,1.7,-.8);camera.lookAt(6.02,1.5,-.8);renderer.render(scene,camera);
 });
 await page.locator('#app canvas').screenshot({path:'test-results/phone-feedback/corridor-door.png'});
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
