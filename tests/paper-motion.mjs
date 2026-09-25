import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:8000/',url=new URL(base);url.searchParams.set('inspect','1');
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:960,height:680}}),page=await context.newPage();page.setDefaultTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results',{recursive:true});
try{
 await page.goto(url.href);await page.locator('#loading').waitFor({state:'hidden'});
 await page.locator('#file').setInputFiles({name:'PAPER-PATH.txt',mimeType:'text/plain',buffer:Buffer.from('Paper path inspection')});
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#cinemaEnter').click();await page.locator('#cinemaShot').selectOption('4');await page.locator('#cinemaHide').click();
 await page.evaluate(()=>{window.BYUR_INSPECT.recordOutput();document.querySelector('#runDoc').click()});
 await page.waitForFunction(()=>window.BYUR_INSPECT.snapshot().output.stage==='ready'&&!window.BYUR_INSPECT.snapshot().busy);
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
 await page.keyboard.press('Escape');await page.locator('#sound').click();await page.waitForFunction(()=>window.MinistryAudio.state().decoded.length===10);
 await page.locator('#cinemaEnter').click();await page.locator('#cinemaShot').selectOption('6');await page.locator('#app canvas').click({position:{x:30,y:40}});
 const before=await page.evaluate(()=>window.MinistryAudio.state().corridor.passes);
 await page.keyboard.down('w');await page.waitForFunction(()=>window.MinistryAudio.state().corridor.near);await page.keyboard.up('w');
 await page.waitForFunction(n=>window.MinistryAudio.state().corridor.passes>n,before);
 const corridor=await page.evaluate(()=>window.MinistryAudio.state().corridor);assert.equal(corridor.lastPass.reason,'approach');assert.equal(corridor.lastPass.positions.length,6);assert(corridor.lastPass.positions.every(p=>p[0]>6.1),'Footsteps originate beyond closed door');
 await page.waitForTimeout(3500);assert.equal(await page.evaluate(()=>window.MinistryAudio.state().corridor.passes),before+1,'Approach cue does not retrigger continuously');
 await page.keyboard.press('Escape');await page.locator('#sound').click();assert.equal(await page.evaluate(()=>window.MinistryAudio.state().voices),0,'Mute stops scheduled corridor voices');
 await page.locator('#resetDoc').click();assert.equal(await page.evaluate(()=>window.BYUR_INSPECT.snapshot().output.visible),false);
 assert.deepEqual(errors,[]);await writeFile('test-results/paper-motion-result.json',JSON.stringify({passed:true,base,checks:['progressive outlet feed','stamp applied at contact','continuous supported delivery','moving-stage rendered evidence','door approach footsteps','corridor source location and cooldown','mute cancels footsteps','output reset'],audit,corridor},null,2));console.log('ОТК: paper motion and corridor approach passed');
}catch(e){await page.screenshot({path:'test-results/paper-failure.png'}).catch(()=>{});await writeFile('test-results/paper-failure.json',JSON.stringify({error:String(e),errors,snapshot:await page.evaluate(()=>window.BYUR_INSPECT?.snapshot()).catch(()=>null),audio:await page.evaluate(()=>window.MinistryAudio?.state()).catch(()=>null)},null,2));throw e}finally{await browser.close()}
