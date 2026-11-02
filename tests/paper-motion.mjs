import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:8000/',url=new URL(base);url.searchParams.set('inspect','1');
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:960,height:680}}),page=await context.newPage();page.setDefaultTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results',{recursive:true});

const auxiliary=async id=>{
 const toggle=page.locator('#menuToggle');
 if(await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
 await page.locator('#'+id).click();
};
try{
 await page.goto(url.href);await page.locator('#loading').waitFor({state:'hidden'});
 await page.locator('#file').setInputFiles({name:'PAPER-PATH.txt',mimeType:'text/plain',buffer:Buffer.from('Paper path inspection')});
 await page.emulateMedia({reducedMotion:'reduce'});await auxiliary('cinemaEnter');await page.locator('#cinemaShot').selectOption('4');await page.locator('#cinemaHide').click();
 await page.evaluate(()=>{window.BYUR_INSPECT.recordOutput();document.querySelector('#runDoc').click()});
 await page.waitForFunction(()=>window.BYUR_INSPECT.snapshot().output.stage==='ready'&&!window.BYUR_INSPECT.snapshot().busy,{},{timeout:180000});
 const audit=await page.evaluate(()=>window.BYUR_INSPECT.outputAudit());
 for(const f of audit.frames){await writeFile('test-results/paper-'+f.key+'.png',Buffer.from(f.png.split(',')[1],'base64'));delete f.png}
 await writeFile('test-results/paper-motion-samples.json',JSON.stringify(audit,null,2));
 assert(audit.samples.length>15,'Observe intermediate motion, not just end positions');
 const printing=audit.samples.filter(s=>s.stage==='printing'),delivery=audit.samples.filter(s=>s.stage==='delivery');
 assert(printing.some(s=>s.visibleLength>0&&s.visibleLength<.25),'A small leading edge emerges first');assert(printing.some(s=>s.visibleLength>.6),'Paper progressively feeds out');
 assert(printing.every(s=>!s.stamped),'No red imprint before press impact');assert(delivery.every(s=>s.stamped),'Imprint follows the delivered sheet');
 assert(audit.samples.every(s=>s.clearance>.0059),'Rendered mesh never enters metal');
 assert(audit.samples.filter(s=>s.stage==='impact').some(s=>Math.abs(s.stampBottom-s.stampSurface)<.0001),'Die contacts paper at impact');
 for(let i=1;i<audit.samples.length;i++)assert(audit.samples[i].head>=audit.samples[i-1].head,'No snap back when stamp releases');
 const expected=['printing-0.1','printing-0.4','printing-0.8','pressing-0.25','impact-0','delivery-0.25','delivery-0.6','delivery-0.95','ready-0'];
 assert.deepEqual(audit.frames.map(f=>f.key),expected);
 // Reach the real door using the normal camera and walk controls, then wait for the approach cue.
 await page.keyboard.press('Escape');await auxiliary('sound');await page.waitForFunction(()=>window.MinistryAudio.state().decoded.length===10);
 // Observe the approach event itself. The prior test sampled only lastPass after
 // waiting for any pass, so an unrelated background pass could overwrite it.
 const before=await page.evaluate(()=>window.MinistryAudio.state().corridor.passes);
 assert.equal(before,0,'Sound startup must not schedule premature corridor footsteps');
 await page.evaluate(()=>{
  window.BYUR_CORRIDOR_EVENTS=[];
  window.BYUR_CORRIDOR_WATCH=setInterval(()=>{
   const c=window.MinistryAudio.state().corridor,events=window.BYUR_CORRIDOR_EVENTS;
   if(c.lastPass && !events.some(e=>e.time===c.lastPass.time))events.push({passes:c.passes,since:c.since,...c.lastPass});
  },100);
 });
 await auxiliary('cinemaEnter');await page.locator('#cinemaShot').selectOption('6');await page.locator('#app canvas').click({position:{x:30,y:40}});
 await page.keyboard.down('w');await page.waitForFunction(()=>window.MinistryAudio.state().corridor.near);await page.keyboard.up('w');
 await page.waitForFunction(n=>window.BYUR_CORRIDOR_EVENTS.some(e=>e.passes>n&&e.reason==='approach'),before,{timeout:45000});
 const approach=await page.evaluate(n=>window.BYUR_CORRIDOR_EVENTS.find(e=>e.passes>n&&e.reason==='approach'),before);
 assert.equal(approach.positions.length,6);assert(approach.positions.every(p=>p[0]>6.1),'Footsteps originate beyond closed door');
 assert(approach.since!==null&&approach.time-approach.since>=1.1,'Approach follows a short dwell near the door');
 await page.waitForTimeout(3500);
 const approaches=await page.evaluate(n=>window.BYUR_CORRIDOR_EVENTS.filter(e=>e.passes>n&&e.reason==='approach').length,before);
 assert.equal(approaches,1,'Approach cue does not retrigger continuously');
 const corridor=await page.evaluate(()=>({state:window.MinistryAudio.state().corridor,events:window.BYUR_CORRIDOR_EVENTS}));
 await page.evaluate(()=>clearInterval(window.BYUR_CORRIDOR_WATCH));
 await page.keyboard.press('Escape');await auxiliary('sound');assert.equal(await page.evaluate(()=>window.MinistryAudio.state().voices),0,'Mute stops scheduled corridor voices');
 await page.locator('#resetDoc').click();assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().output.visible),false);
 assert.deepEqual(errors,[]);await writeFile('test-results/paper-motion-result.json',JSON.stringify({passed:true,base,checks:['progressive outlet feed','stamp applied at contact','continuous supported delivery','moving-stage rendered evidence','door approach footsteps','corridor source location and cooldown','mute cancels footsteps','output reset'],audit,corridor},null,2));console.log('ОТК: paper motion and corridor approach passed');
}catch(e){await page.screenshot({path:'test-results/paper-failure.png'}).catch(()=>{});await writeFile('test-results/paper-failure.json',JSON.stringify({error:String(e),errors,snapshot:await page.evaluate(()=>window.BYUR_INSPECT?.snapshot()).catch(()=>null),audio:await page.evaluate(()=>window.MinistryAudio?.state()).catch(()=>null),corridorEvents:await page.evaluate(()=>window.BYUR_CORRIDOR_EVENTS).catch(()=>null)},null,2));throw e}finally{await browser.close()}
