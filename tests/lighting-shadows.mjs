// Paired, non-deploying Chromium lighting review of main and this branch.
// Test-only script interception exposes the SAME scene probes in both revisions.
// No debug camera hooks or overlays are shipped in the game.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const beforeURL=process.env.LIGHTING_BEFORE_URL||'http://127.0.0.1:8000/';
const afterURL=process.env.LIGHTING_AFTER_URL||'http://127.0.0.1:8001/';
const poses=[
 {name:'operator',x:0,y:1.7,z:2.7,yaw:0,pitch:.018},
 {name:'desk',x:0,y:1.7,z:.42,yaw:0,pitch:-.18},
 {name:'archive',x:-3.1,y:1.7,z:-4.55,yaw:0,pitch:-.14},
 {name:'window',x:-5.05,y:1.7,z:-2.55,yaw:-1.3,pitch:-.05},
 {name:'door',x:4.85,y:1.7,z:-.85,yaw:-1.50,pitch:0},
 {name:'rear-left',x:-5.1,y:1.7,z:5.5,yaw:-.55,pitch:-.04},
 {name:'rear-right',x:5.1,y:1.7,z:5.5,yaw:.55,pitch:-.04}
];
const probes=[
 ['floor-back-left',-5.5,0,-6.2],['floor-back-right',5.5,0,-6.2],
 ['floor-front-left',-5.5,0,6.2],['floor-front-right',5.5,0,6.2],
 ['back-wall-top-left',-5.6,5.6,-6.7],['back-wall-top-right',5.6,5.6,-6.7],
 ['window',-5.75,4,-2.6],['door',5.83,2.4,-.8],
 ['archive-desk',-3.6,.9,-3.77],['main-workbench',0,.94,-1.63],
 ['press',.4,1.3,-1.2],['floor-center',0,0,0],
 ['front-ceiling',0,5.8,5.7],['back-ceiling',0,5.8,-5.8]
];
const injection=[
 'window.__LIGHT_PROBE={',
 ' pose(p){',
 '  camera.position.set(p.x,p.y,p.z);camera.rotation.set(p.pitch||0,p.yaw||0,0);',
 '  camera.updateMatrixWorld(true);',
 '  const submitted=window.__BYUR_LIGHT_DRAW_COUNT;',
 '  const stamp=performance.now();renderer.render(scene,camera);',
 '  const renderWallMs=performance.now()-stamp;',
 '  const webglDrawSubmissions=window.__BYUR_LIGHT_DRAW_COUNT-submitted;',
 '  const shadow=key.shadow.camera;shadow.updateMatrixWorld(true);',
 '  const points='+JSON.stringify(probes)+';',
 '  const missing=points.filter(s=>{const v=new T.Vector3(s[1],s[2],s[3]).project(shadow);return Math.abs(v.x)>1.00001||Math.abs(v.y)>1.00001||v.z < -1.00001||v.z>1.00001}).map(s=>s[0]);',
 '  let casters=0,receivers=0,shadowLights=0;',
 '  scene.traverse(o=>{if(o.isMesh){casters+=Number(!!o.castShadow);receivers+=Number(!!o.receiveShadow)}if(o.isLight)shadowLights+=Number(!!o.castShadow)});',
 '  const gl=renderer.getContext(),ext=gl.getExtension("WEBGL_debug_renderer_info");',
 '  const gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);',
 '  const frontWall=scene.getObjectByName("room-front-wall");',
 '  return {pose:p,coverage:{total:points.length,covered:points.length-missing.length,missing},',
 '   shadow:{left:shadow.left,right:shadow.right,top:shadow.top,bottom:shadow.bottom,near:shadow.near,far:shadow.far,',
 '    width:key.shadow.mapSize.x,height:key.shadow.mapSize.y,lights:shadowLights,casters,receivers,',
 '    pressCaster:stamp.children.some(o=>o.castShadow),paperReceiver:outPaper.receiveShadow,',
 '    frontWall:frontWall?{casts:frontWall.castShadow,receives:frontWall.receiveShadow}:null},',
 '   renderer:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,',
 '    webglDrawSubmissions,renderWallMs,pixelRatio:renderer.getPixelRatio(),gpu}};',
 ' },',
 ' press(t){',
 '  const stroke=st.stampY-(outputPath.height+outputPath.clearance+.1625);',
 '  drawOut("LIGHTING REVIEW","123456",t>=1);',
 '  feedOutput(outputPath.stampS+(1-704/1050)*outputPath.length);',
 '  stamp.position.y=st.stampY-stroke*t;stampLink.position.y=st.linkY-stroke*t;',
 '  return this.pose({name:"press-"+t,x:.85,y:1.5,z:.35,yaw:.35,pitch:-.32});',
 ' },',
 ' restore(){stamp.position.y=st.stampY;stampLink.position.y=st.linkY;feedOutput(0);}',
 '};'
].join('\n');
await mkdir('test-results/lighting',{recursive:true});
const browser=await chromium.launch();
const pageErrors=[];
async function capture(label,base,view){
 const context=await browser.newContext({viewport:view.viewport,deviceScaleFactor:1,
  reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();page.setDefaultTimeout(90000);
 page.on('pageerror',e=>pageErrors.push(label+': '+e.message));
 await page.addInitScript(()=>{
  // Procedurally drawn room textures must match across the two revisions.
  let seed=44321;Math.random=()=>{seed=seed*16807%2147483647;return seed/2147483647};
  // Count actual WebGL calls including shadow and regular passes. Renderer.info
  // alone cannot establish GPU workload or render latency.
  window.__BYUR_LIGHT_DRAW_COUNT=0;
  for(const type of [window.WebGLRenderingContext,window.WebGL2RenderingContext]){
   if(!type)continue;
   for(const method of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){
    const descriptor=Object.getOwnPropertyDescriptor(type.prototype,method);
    if(!descriptor||typeof descriptor.value!=='function')continue;
    Object.defineProperty(type.prototype,method,{...descriptor,value:function(...args){
     window.__BYUR_LIGHT_DRAW_COUNT++;
     return descriptor.value.apply(this,args);
    }});
   }
  }
 });
 let intercepted=false;
 await page.route('**/js/app.js*',async route=>{
  const response=await route.fetch();
  const original=await response.text();
  const anchor='resetVisual();renderer.render(scene,camera);';
  assert(original.includes(anchor),'Scene instrumentation anchor missing');
  intercepted=true;
  await route.fulfill({response,body:original.replace(anchor,injection+'\n'+anchor)});
 });
 const url=new URL(base);url.searchParams.set('inspect','1');
 try{
  await page.goto(url.href);await page.locator('#loading').waitFor({state:'hidden'});
  assert(intercepted,'The real scene script was not intercepted');
  await page.waitForFunction(()=>!!window.__LIGHT_PROBE);
  assert.equal(await page.locator('#fatal').isVisible(),false);
  const samples=[];
  for(const p of poses.filter(p=>view.mobile?['operator','window','door','rear-right'].includes(p.name):true)){
   const metrics=await page.evaluate(p=>window.__LIGHT_PROBE.pose(p),p);
   await page.locator('#app canvas').screenshot({path:'test-results/lighting/'+view.name+'-'+label+'-'+p.name+'.png'});
   samples.push(metrics);
  }
  for(const t of view.mobile?[.5]:[0,.5,1]){
   const metrics=await page.evaluate(t=>window.__LIGHT_PROBE.press(t),t);
   await page.locator('#app canvas').screenshot({path:'test-results/lighting/'+view.name+'-'+label+'-press-'+t+'.png'});
   samples.push(metrics);
  }
  await page.evaluate(()=>window.__LIGHT_PROBE.restore());
  // This is an actual WASD transition, not a test-only camera teleport.
  await page.evaluate(p=>window.__LIGHT_PROBE.pose(p),poses[0]);
  await page.locator('#app canvas').focus();
  const start=await page.evaluate(()=>window.BYUR_INSPECT.snapshot().camera);
  await page.keyboard.down('w');await page.waitForTimeout(350);await page.keyboard.up('w');
  const end=await page.evaluate(()=>window.BYUR_INSPECT.snapshot().camera);
  assert(end[2]<start[2]-.02,'Operator WASD motion must still work');
  return {label,viewport:view.name,samples,walk:{start,end}};
 }finally{await context.close()}
}
const report={main:beforeURL,candidate:afterURL,profiles:{},errors:[]};
try{
 for(const view of [
  {name:'desktop',viewport:{width:1280,height:800},mobile:false},
  {name:'mobile',viewport:{width:390,height:844},mobile:true}
 ]){
  const before=await capture('before',beforeURL,view);
  const after=await capture('after',afterURL,view);
  report.profiles[view.name]={before,after};
  for(const s of after.samples){
   assert.equal(s.coverage.covered,s.coverage.total,view.name+' '+s.pose.name+': clipped shadow targets '+s.coverage.missing.join(', '));
   assert.equal(s.shadow.lights,1,'Maintain precisely one shadow-casting light');
   assert(s.shadow.pressCaster&&s.shadow.paperReceiver,'Dynamic press/paper shadows must remain eligible');
   if(s.shadow.frontWall){
    assert.equal(s.shadow.frontWall.casts,false,'Issue #7 front wall must never block the simulated interior key');
    assert.equal(s.shadow.frontWall.receives,true,'Issue #7 front wall must receive shadows');
   }
   assert(s.renderer.webglDrawSubmissions>0,'Actual WebGL submissions must be observed');
   assert.equal(s.shadow.width,view.mobile?1024:2048,'Explicit device shadow-map budget');
  }
  const b=before.samples[0],a=after.samples[0];
  console.log(view.name+': coverage '+b.coverage.covered+'/'+b.coverage.total+' -> '+a.coverage.covered+'/'+a.coverage.total);
  console.log(view.name+': draws '+b.renderer.calls+' -> '+a.renderer.calls+
   ', triangles '+b.renderer.triangles+' -> '+a.renderer.triangles+
   ', WebGL submissions '+b.renderer.webglDrawSubmissions+' -> '+a.renderer.webglDrawSubmissions+
   ', shadow+scene submit wall ms '+b.renderer.renderWallMs.toFixed(2)+' -> '+a.renderer.renderWallMs.toFixed(2)+
   ', casters '+b.shadow.casters+' -> '+a.shadow.casters+
   ', map '+b.shadow.width+'² -> '+a.shadow.width+'², GPU: '+a.renderer.gpu);
 }
 assert.deepEqual(pageErrors,[],'No page errors during headless comparison');
 report.passed=true;
 await writeFile('test-results/lighting/metrics.json',JSON.stringify(report,null,2));
 console.log('Lighting coverage and paired Chromium captures passed');
}catch(error){
 report.passed=false;report.error=String(error);report.errors=pageErrors;
 await writeFile('test-results/lighting/metrics.json',JSON.stringify(report,null,2));
 throw error;
}finally{await browser.close()}
