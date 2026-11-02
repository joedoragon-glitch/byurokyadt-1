// Issue #9: actual Chromium states, newcomer flow and responsive accessibility evidence.
// Run with a local server at http://127.0.0.1:8000.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:8000/';
const url=new URL(base);url.searchParams.set('inspect','1');
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:900},hasTouch:true,acceptDownloads:true,reducedMotion:'reduce'});
const page=await context.newPage();page.setDefaultTimeout(90000);
const errors=[];page.on('pageerror',error=>errors.push(error.message));
await mkdir('test-results',{recursive:true});
const button=id=>page.locator('#'+id);
const focused=()=>page.evaluate(()=>document.activeElement?.id);
async function auxiliary(id){
 if(await button('menuToggle').getAttribute('aria-expanded')!=='true')await button('menuToggle').click();
 await button(id).click();
}
const layout=()=>page.evaluate(()=>{
 const ids=['hud','menuToggle','operator','loadDoc','runDoc','resetDoc','receipt'];
 const boxes=Object.fromEntries(ids.map(id=>{
  const el=document.getElementById(id),r=el.getBoundingClientRect();
  return [id,{visible:getComputedStyle(el).display!=='none',x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}];
 }));
 return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,boxes};
});
try{
 await page.goto(url.href);await button('loading').waitFor({state:'hidden',timeout:60000});
 assert.equal(await button('fatal').isVisible(),false);
 assert.equal(await button('stepLabel').textContent(),'STEP 1 / 3 · SELECT A DOCUMENT');
 assert.equal(await button('receipt').isVisible(),false);
 assert.equal(await button('utilityPanel').isVisible(),false);
 assert.equal(await page.getByRole('status').count(),1,'One active operator announcement');
 await page.screenshot({path:'test-results/ui-01-desktop-idle.png'});

 // Keyboard menu sequence and Escape return to the toggle.
 await button('menuToggle').focus();await page.keyboard.press('Enter');
 assert.equal(await button('menuToggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Tab');assert.equal(await focused(),'roomView');
 await page.keyboard.press('Escape');assert.equal(await focused(),'menuToggle');
 assert.equal(await button('utilityPanel').isVisible(),false);

 // Native modal help, focus order and return to the visible trigger.
 await button('menuToggle').click();await button('helpToggle').click();
 assert.equal(await button('helpDialog').evaluate(el=>el.open),true);
 assert.equal(await page.getByRole('dialog',{name:/Operator.s instructions/}).isVisible(),true);
 assert.equal(await focused(),'helpTitle');
 await page.keyboard.press('Tab');assert.equal(await focused(),'helpClose');
 await page.keyboard.press('Escape');
 assert.equal(await button('helpDialog').evaluate(el=>el.open),false);
 await page.waitForFunction(()=>document.activeElement?.id==='menuToggle');

 // An empty procedure reports a comprehensible error.
 await button('runDoc').click();
 assert.match(await button('hint').textContent(),/^ERROR · Select a document first/);
 const chooser=page.waitForEvent('filechooser');
 await button('loadDoc').tap();
 await (await chooser).setFiles({name:'FORM-27B.txt',mimeType:'text/plain',buffer:Buffer.from('Local document')});
 assert.match(await button('stepLabel').textContent(),/STEP 2/);
 assert.match(await button('hint').textContent(),/RECEIVED/);
 assert.match(await button('selectedFile').textContent(),/FORM-27B\.txt/);
 await page.screenshot({path:'test-results/ui-02-document-selected.png'});

 // Actual busy and issued states, not mocked machine status.
 // Capture the live region as a screen-reader-facing processing transcript.
 await page.evaluate(()=>{
  window.BYUR_UI_STATUS_LOG=[];
  new MutationObserver(()=>window.BYUR_UI_STATUS_LOG.push(document.getElementById('hint').textContent))
   .observe(document.getElementById('hint'),{childList:true,characterData:true,subtree:true});
 });
 await button('runDoc').focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>window.BYUR_INSPECT.snapshot().busy);
 assert.equal(await button('loadDoc').isDisabled(),true);
 assert.equal(await button('runDoc').isDisabled(),true);
 assert.match(await button('stepLabel').textContent(),/PROCESSING/);
 await page.screenshot({path:'test-results/ui-03-busy.png'});
 await page.waitForFunction(()=>window.BYUR_INSPECT.snapshot().output.stage==='ready'&&!window.BYUR_INSPECT.snapshot().busy,{},{timeout:180000});
 assert.equal(await button('receipt').isVisible(),true);
 assert.equal(await button('receipt').isEnabled(),true);
 assert.match(await button('stepLabel').textContent(),/STEP 3/);
 const liveMessages=await page.evaluate(()=>window.BYUR_UI_STATUS_LOG);
 for(const phase of ['ANALYSIS','VERIFICATION','PRINTING','STAMPING','APPROVED']){
  assert(liveMessages.some(message=>message.startsWith(phase+' ·')),`Missing readable live announcement: ${phase}`);
 }
 await page.screenshot({path:'test-results/ui-04-certificate-ready.png'});
 await button('receipt').focus();await page.keyboard.press('Enter');assert.equal(await button('certificate').evaluate(el=>el.open),true);
 assert.equal(await page.getByRole('dialog',{name:'Official certificate'}).isVisible(),true);
 assert.match(await button('certificateCanvas').getAttribute('aria-label'),/FORM-27B\.txt/);
 await page.keyboard.press('Escape');assert.equal(await button('certificate').evaluate(el=>el.open),false);
 await page.waitForFunction(()=>document.activeElement?.id==='receipt');

 // Independent sound and music toggles, and the master volume.
 await auxiliary('sound');await page.waitForFunction(()=>window.MinistryAudio.state().decoded.length===10,{},{timeout:30000});
 assert.equal(await button('sound').getAttribute('aria-pressed'),'true');
 await auxiliary('music');assert.equal(await button('music').getAttribute('aria-pressed'),'true');
 await button('volume').press('Home');assert.equal(await page.evaluate(()=>window.MinistryAudio.state().volume),0);
 await auxiliary('sound');assert.equal(await button('sound').getAttribute('aria-pressed'),'false');
 assert.equal(await button('music').getAttribute('aria-pressed'),'true');
 await auxiliary('music');assert.equal(await button('music').getAttribute('aria-pressed'),'false');
 await page.keyboard.press('Escape');

 // Reduced-motion cinematic controls must restore focus after hiding and exiting.
 assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);
 await auxiliary('cinemaEnter');assert.equal(await button('operator').isVisible(),false);
 assert.equal(await focused(),'cinemaExit');
 await button('cinemaHide').click();assert.equal(await focused(),'cinemaReveal');
 await page.keyboard.press('Escape');
 assert.equal(await button('operator').isVisible(),true);
 assert.equal(await focused(),'menuToggle');

 // Desktop / portrait / short landscape / narrow phone. Menu is scrollable, not clipped.
 const matrix=[[1440,900,'desktop'],[390,844,'phone'],[844,390,'landscape'],[320,568,'small-phone']];
 const reports=[];
 for(const [width,height,name] of matrix){
  await page.setViewportSize({width,height});
  const data=await layout();reports.push({name,...data});
  assert(data.scrollWidth<=width+1,name+': unexpected horizontal overflow');
  for(const id of ['menuToggle','loadDoc','runDoc','receipt']){
   const r=data.boxes[id];assert(r.visible,name+': '+id+' hidden');
   assert(r.x>=-1&&r.right<=width+1&&r.y>=-1&&r.bottom<=height+1,name+': '+id+' clipped');
   assert(r.h>=44,name+': '+id+' touch target below 44px');
  }
  const head=data.boxes.hud,menu=data.boxes.menuToggle,op=data.boxes.operator;
  assert(head.right<menu.x+1,name+': title/menu overlap');
  assert(menu.bottom<op.y,name+': menu/operator overlap');
  await page.screenshot({path:'test-results/ui-05-'+name+'.png'});
  await button('menuToggle').tap();
  assert.equal(await button('utilityPanel').isVisible(),true);
  const panel=await button('utilityPanel').boundingBox();
  const opRect=await button('operator').boundingBox();
  assert(panel&&panel.y>=0&&panel.y+panel.height<=height+1,name+': menu clipped');
  assert(opRect&&panel.y+panel.height<=opRect.y-5,name+': secondary menu obscures essential document controls');
  await page.screenshot({path:'test-results/ui-06-'+name+'-menu.png'});
  // Every secondary function remains reachable through the menu's own scroll area.
  await button('helpToggle').scrollIntoViewIfNeeded();
  const helpRect=await button('helpToggle').boundingBox();
  assert(helpRect&&helpRect.y>=panel.y-1&&helpRect.y+helpRect.height<=panel.y+panel.height+1,name+': help action cannot be scrolled into menu');
  await page.keyboard.press('Escape');
 }

 // Complete the keyboard path: reset, select a second local file and reset again.
 await button('resetDoc').focus();await page.keyboard.press('Enter');
 assert.equal(await button('file').inputValue(),'');
 assert.match(await button('stepLabel').textContent(),/STEP 1/);
 const keyboardChooser=page.waitForEvent('filechooser');
 await button('loadDoc').focus();await page.keyboard.press('Enter');
 await (await keyboardChooser).setFiles({name:'KEYBOARD-DOCUMENT.txt',mimeType:'text/plain',buffer:Buffer.from('Keyboard test')});
 assert.match(await button('stepLabel').textContent(),/STEP 2/);
 await button('resetDoc').focus();await page.keyboard.press('Enter');
 assert.equal(await button('file').inputValue(),'');
 assert.match(await button('stepLabel').textContent(),/STEP 1/);
 assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().issued),1);
 assert.deepEqual(errors,[]);
 await writeFile('test-results/ui-accessibility-result.json',JSON.stringify({passed:true,base,matrix:reports,checks:['menu keyboard and Escape','keyboard document/confirm/collect/reset','help dialog and focus','document flow','busy state','certificate focus','audio and music independence','volume','cinema hidden controls','reduced motion','touch targets','responsive layouts','nonoverlapping scrollable menu','counter after reset'],errors},null,2));
 console.log('UI accessibility: Chromium states and viewport matrix passed');
}catch(error){
 await page.screenshot({path:'test-results/ui-failure.png'}).catch(()=>{});
 await writeFile('test-results/ui-accessibility-failure.json',JSON.stringify({error:String(error),errors,stage:await button('stepLabel').textContent().catch(()=>null)},null,2));
 throw error;
}finally{await browser.close()}
