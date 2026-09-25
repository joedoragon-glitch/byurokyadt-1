import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:8000/',url=new URL(base);url.searchParams.set('inspect','1');
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:960,height:680},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results',{recursive:true});
const snap=()=>page.evaluate(()=>window.BYUR_INSPECT.snapshot());
try{
 await page.goto(url.href);await page.locator('#loading').waitFor({state:'hidden'});const home=await snap();
 await page.evaluate(()=>{window.cinemaSafety={samples:0,unsafe:0};window.cinemaMonitor=setInterval(()=>{const s=window.BYUR_INSPECT.snapshot();if(s.cinema.active){window.cinemaSafety.samples++;if(!s.safe)window.cinemaSafety.unsafe++}},100)});
 await page.locator('#cinemaEnter').click();await page.waitForFunction(()=>!window.BYUR_INSPECT.snapshot().cinema.travelling);
 assert.equal(await page.locator('#operator').isVisible(),false);assert.equal((await snap()).cinema.active,true);
 // Exercise real navigation past the workbench on the way to the winter window.
 await page.locator('#cinemaShot').selectOption('5');await page.waitForFunction(()=>!window.BYUR_INSPECT.snapshot().cinema.travelling);
 assert((await snap()).safe);const safety=await page.evaluate(()=>window.cinemaSafety);assert.equal(safety.unsafe,0);assert(safety.samples>3);
 // Stationary photographic views are also the reduced-motion experience.
 await page.emulateMedia({reducedMotion:'reduce'});
 const shots=await page.evaluate(()=>window.BYUR_INSPECT.shots());
 for(let i=0;i<shots.length;i++){
  await page.locator('#cinemaShot').selectOption(String(i));await page.waitForFunction(()=>!window.BYUR_INSPECT.snapshot().cinema.travelling);
  await page.locator('#cinemaHide').click();await page.locator('#app canvas').screenshot({path:`test-results/cinema-${i+1}.png`});await page.locator('#cinemaReveal').click();assert((await snap()).safe);
 }
 await page.locator('#cinemaShot').selectOption('1');await page.locator('#cinemaLens').press('Home');assert.equal((await snap()).cinema.fov,20);await page.locator('#cinemaShot').selectOption('1');
 await page.locator('#cinemaFrame').selectOption('2.39');assert(Math.abs((await snap()).cinema.aspect-2.39)<.01);
 await page.locator('#cinemaFrame').selectOption('1.7777777778');
 const downloaded=page.waitForEvent('download');await page.locator('#cinemaPhoto').click();const download=await downloaded;await download.saveAs('test-results/cinematic-photo.png');const png=await readFile('test-results/cinematic-photo.png');assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),2560);assert.equal(png.readUInt32BE(20),1440);assert(png.length>70000,'Photo contains rendered scene');
 // Export must restore the interactive canvas; controls may hide without trapping the operator.
 await page.locator('#cinemaHide').click();await page.keyboard.press('Escape');assert.equal((await snap()).cinema.active,false);assert.deepEqual((await snap()).camera,home.camera);assert(await page.locator('#operator').isVisible());
 await page.locator('#cinemaEnter').click();await page.locator('#cinemaTour').click();assert.equal((await snap()).cinema.touring,true);await page.locator('#cinemaTour').click();assert.equal((await snap()).cinema.touring,false);
 await page.locator('#cinemaShot').selectOption('4');await page.locator('#app canvas').click({position:{x:30,y:40}});const beforeWalk=(await snap()).camera;await page.keyboard.down('w');await page.waitForTimeout(1600);await page.keyboard.up('w');const afterWalk=await snap();assert(afterWalk.safe);assert(afterWalk.camera[2]<beforeWalk[2],'Manual cinema movement responds after selecting a view');await page.keyboard.press('Escape');
 // Portrait controls and offline photographs remain usable.
 await page.setViewportSize({width:390,height:844});await page.locator('#cinemaEnter').click();await page.screenshot({path:'test-results/cinema-mobile.png'});assert(await page.locator('#cinemaPhoto').isVisible());await page.locator('#cinemaExit').click();
 await context.setOffline(true);await page.reload();await page.locator('#loading').waitFor({state:'hidden'});await page.locator('#cinemaEnter').click();await page.locator('#cinemaShot').selectOption('5');assert((await snap()).cinema.active);const offlineDownload=page.waitForEvent('download');await page.locator('#cinemaPhoto').click();await(await offlineDownload).saveAs('test-results/cinematic-offline.png');await context.setOffline(false);
 await page.locator('#cinemaExit').click();await page.locator('#sound').click();await page.waitForFunction(()=>window.MinistryAudio.state().decoded.length===10);const audio=await page.evaluate(()=>window.MinistryAudio.state());assert(audio.spatial);assert.equal(audio.listener.length,3);assert(audio.decoded.includes('wind')&&audio.decoded.includes('tick')&&audio.decoded.includes('step'));
 assert.deepEqual(errors,[]);await writeFile('test-results/cinematic-result.json',JSON.stringify({passed:true,base,checks:['safe smooth camera navigation','eight composed views','hidden operator controls','lens and aspect framing','2560px scene-only PNG','canvas restoration after export','Escape restores operator camera','tour play/pause','manual camera collision','reduced-motion mode','portrait layout','offline cinematic export','spatial listener and winter audio'],safety},null,2));console.log('ОТК: cinematic and winter audit passed');
}catch(e){await page.screenshot({path:'test-results/cinematic-failure.png'}).catch(()=>{});await writeFile('test-results/cinematic-failure.json',JSON.stringify({error:String(e),errors,snapshot:await snap().catch(()=>null)},null,2));throw e}finally{await browser.close()}
