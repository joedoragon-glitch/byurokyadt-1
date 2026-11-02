// Issue #20: real Three.js desk geometry + rendered prop photographs.
// CI Chromium captures are visual evidence, not claims of owner/real-iPhone approval.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:8000/';
const code=await readFile('js/app.js','utf8');
assert(!code.includes('box(.53,.08,.12,phoneRed,4.18'),
 'Old straight barbell handset must not remain');
assert(!code.includes('for(let i=0;i<7;i++)box(.065,.32,.24'),
 'Overlapping repeated slabs must not remain on the phone desk');
assert(!code.includes('for(let i=0;i<4;i++)box(.32,.035,.42,paper'),
 'Four tall paper bricks must not return');
await mkdir('test-results/desk-props',{recursive:true});
const browser=await chromium.launch(),errors=[],results={base,viewports:{},sourceChecks:3};
const expose=String.raw`
window.__DESK_PROBE={
 bounds(name){
  const obj=scene.getObjectByName(name);
  if(!obj)throw new Error('Missing desk object '+name);
  const bb=new T.Box3().setFromObject(obj);
  return {name,min:bb.min.toArray(),max:bb.max.toArray(),meshCount:(()=>{
   let count=0;obj.traverse(o=>{if(o.isMesh)count++});return count;
  })()};
 },
 details(){
  const fileIds=[12,27,31,48];
  const canvas=rotaryFace.material.map.image;
  const c=canvas.getContext('2d'),data=c.getImageData(0,0,canvas.width,canvas.height).data;
  let cream=0,dark=0;
  for(let i=0;i<data.length;i+=16){
   const r=data[i],g=data[i+1],b=data[i+2];
   if(r>175&&g>165&&b>145)cream++;
   if(r<100&&g<100&&b<100)dark++;
  }
  return {phone:this.bounds('desk-phone-1982'),binders:this.bounds('desk-archive-binders'),
   dossier:this.bounds('desk-loose-dossier'),files:fileIds.map(id=>this.bounds('archive-binder-'+id)),
   earpiece:this.bounds('phone-earpiece'),mouthpiece:this.bounds('phone-mouthpiece'),
   cradleLeft:this.bounds('phone-cradle-left'),cradleRight:this.bounds('phone-cradle-right'),
   dial:this.bounds('phone-ten-position-dial'),grip:this.bounds('phone-shaped-handset-grip'),
   cord:this.bounds('phone-coiled-cord'),dialImage:[canvas.width,canvas.height],
   dialPixels:{cream,dark},dialAngle:rotaryFace.rotation.x,
   shellType:phoneShell.geometry.type,drawCalls:renderer.info.render.calls,
   triangles:renderer.info.render.triangles};
 },
 view(pos,target){
  camera.position.set(...pos);camera.lookAt(new T.Vector3(...target));
  renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
  return {camera:pos,target,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
 }
};
`;
const within=(n,min,max)=>n>=min-1e-3&&n<=max+1e-3;
function separated(a,b,axes){
 return axes.some(i=>a.max[i]<b.min[i]-.002||b.max[i]<a.min[i]-.002);
}
try{
 for(const v of [{name:'desktop',width:1280,height:800,mobile:false},
  {name:'phone',width:390,height:844,mobile:true}]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},
    deviceScaleFactor:1,hasTouch:v.mobile,isMobile:v.mobile,reducedMotion:'reduce',
    serviceWorkers:'block'});
  const page=await context.newPage();page.setDefaultTimeout(90000);
  page.on('pageerror',e=>errors.push(v.name+': '+e.message));
  await page.addInitScript(()=>{
   window.__ROTARY_DIGITS=[];
   const fill=CanvasRenderingContext2D.prototype.fillText;
   CanvasRenderingContext2D.prototype.fillText=function(value,...args){
    if(/^[0-9]$/.test(String(value)))window.__ROTARY_DIGITS.push(String(value));
    return fill.call(this,value,...args);
   };
  });
  await page.route('**/js/app.js*',async route=>{
   const response=await route.fetch(),content=await response.text();
   const anchor='resetVisual();renderer.render(scene,camera);';
   assert(content.includes(anchor),'Source injection anchor missing');
   await route.fulfill({response,body:content.replace(anchor,expose+'\n'+anchor)});
  });
  const url=new URL(base);url.searchParams.set('inspect','1');
  await page.goto(url.href);
  await page.locator('#loading').waitFor({state:'hidden',timeout:60000});
  assert.equal(await page.locator('#fatal').isVisible(),false);
  const data=await page.evaluate(()=>window.__DESK_PROBE.details());
  assert.equal(data.files.length,4);
  assert(data.phone.meshCount>=12,'Phone must be modeled, not a single abstract block');
  assert(data.binders.meshCount>=24,'Closed files need real covers and document cores');
  assert.equal(data.shellType,'ExtrudeGeometry','Period sloped casing must be modeled');
  assert.deepEqual(data.dialImage,[512,512]);
  assert(data.dialPixels.cream>1000&&data.dialPixels.dark>30,
    'Light rotary finger ring and dark holes must be perceptible');
  const digits=await page.evaluate(()=>window.__ROTARY_DIGITS.slice(0,10));
  assert.deepEqual(digits,['1','2','3','4','5','6','7','8','9','0'],
    'Finger wheel requires period 1–9,0 numbering rather than decorative dots');
  assert(data.dialAngle<-1.2&&data.dialAngle> -1.5,'Dial must slope with body');
  for(const [kind,obj] of [['phone',data.phone],['binders',data.binders],
    ['dossier',data.dossier]]){
   assert(within(obj.min[0],3.04,4.76)&&within(obj.max[0],3.04,4.76),
    kind+' leaks off desk laterally');
   assert(within(obj.min[2],-5.54,-4.865)&&within(obj.max[2],-5.54,-4.865),
    kind+' leaks off desk fore/aft');
   assert(within(obj.min[1],.89,1.30)&&within(obj.max[1],.89,1.30),
    kind+' clips through desk or rises implausibly');
  }
  for(const [kind,part] of [['phone feet',data.phone],['file bases',data.binders],['folio cover',data.dossier]])
   assert(Math.abs(part.min[1]-.90)<.012,kind+' must contact the actual .90m wooden desktop');
  assert(separated(data.phone,data.binders,[0,2]),'Phone intersects upright binders');
  assert(separated(data.phone,data.dossier,[0,2]),'Phone intersects loose folio');
  assert(separated(data.binders,data.dossier,[0,2]),'Folio is driven through binders');
  for(let i=0;i<data.files.length;i++)for(let j=i+1;j<data.files.length;j++)
   assert(separated(data.files[i],data.files[j],[0,2]),
    'Two upright binders occupy the same space');
  // Real local bench dimensions: x 3.05..4.75, z −5.525..−4.875.
  // Leave mug inside this tabletop and at least .05m away from phone housing.
  assert(data.phone.max[0]<4.55,'Moved mug must clear the phone housing');
  // Phone must have one continuous grip and two endpoints touching their rests.
  assert(data.grip.min[0]<data.earpiece.max[0]-.008,
    'Molded grip must enter and connect to the left earpiece');
  assert(data.grip.max[0]>data.mouthpiece.min[0]+.008,
    'Molded grip must enter and connect to the right mouthpiece');
  assert(Math.abs(data.earpiece.min[1]-data.cradleLeft.max[1])<.012,
    'Handset must rest on left cradle, not float above it');
  assert(Math.abs(data.mouthpiece.min[1]-data.cradleRight.max[1])<.012,
    'Handset must rest on right cradle');
  assert(data.cord.min[1]>.90&&data.cord.max[1]<1.24,
    'Coiled cord must hang beside set, not slice through the desk');
  const shots=[
   {id:'desk-wide',pos:[3.82,1.57,-3.74],target:[3.90,1.02,-5.19]},
   {id:'phone-close',pos:[4.12,1.37,-4.33],target:[4.17,1.07,-5.20]},
   {id:'binders-close',pos:[3.31,1.43,-4.33],target:[3.46,1.08,-5.30]}
  ];
  results.viewports[v.name]={size:[v.width,v.height],details:data,digits,views:{}};
  for(const shot of shots){
   const info=await page.evaluate(({pos,target})=>window.__DESK_PROBE.view(pos,target),shot);
   await page.locator('#app canvas').screenshot({
    path:'test-results/desk-props/'+v.name+'-'+shot.id+'.png'});
   results.viewports[v.name].views[shot.id]=info;
  }
  await context.close();
 }
 assert.deepEqual(errors,[],'No JS/browser errors');
 await writeFile('test-results/desk-props/report.json',JSON.stringify({passed:true,errors,...results},null,2));
 console.log('Desk props: 1982 rotary dial, handset/cradle, binder separation, real 3D bounds and six closeups passed');
}catch(e){
 await writeFile('test-results/desk-props/error.json',JSON.stringify({error:String(e),errors,...results},null,2));
 throw e;
}finally{await browser.close()}
