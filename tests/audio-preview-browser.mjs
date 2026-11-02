// Real Chromium acceptance for the standalone original-audio room and game cache.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.BASE_URL || 'http://127.0.0.1:8000/';
const url=new URL('assets/audio-preview.html',base).href;
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1000,height:860}});
const page=await context.newPage();
page.setDefaultTimeout(30000);
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto(url,{waitUntil:'load'});
 assert.equal(await page.locator('audio').count(),7,'Seven native recording players');
 assert.equal(await page.locator('audio[autoplay]').count(),0,'No automatic audio playback');
 assert.equal(await page.locator('audio').evaluateAll(nodes=>nodes.every(node=>node.paused)),true);
 const diagnostics=await page.evaluate(async()=>{
   const context=new (window.AudioContext||window.webkitAudioContext)();
   try{
     return await Promise.all([...document.querySelectorAll('audio')].map(async player=>{
       const response=await fetch(player.src);
       if(!response.ok)throw new Error('Missing audio: '+player.src+' ('+response.status+')');
       const decoded=await context.decodeAudioData(await response.arrayBuffer());
       return {file:new URL(player.src).pathname.split('/').pop(),seconds:decoded.duration,channels:decoded.numberOfChannels};
     }));
   }finally{await context.close();}
 });
 assert.equal(diagnostics.length,7);
 for(const d of diagnostics)assert(d.seconds>0&&d.channels>0,'Recording is decodable '+d.file);
 console.log('OGG decode: '+diagnostics.map(d=>d.file+' '+d.seconds.toFixed(2)+'s').join(', '));
 // Native user gesture: play a long music recording, then start the room bed.
 const players=page.locator('audio');
 await players.nth(0).click({position:{x:32,y:25}});
 await page.waitForFunction(()=>!document.querySelectorAll('audio')[0].paused);
 await players.nth(1).click({position:{x:32,y:25}});
 await page.waitForFunction(()=>!document.querySelectorAll('audio')[1].paused);
 assert.equal(await players.nth(0).evaluate(el=>el.paused),true,'Other player must pause');
 await page.getByRole('button',{name:'Stop all playback'}).click();
 assert.equal(await page.locator('audio').evaluateAll(nodes=>nodes.every(el=>el.paused)),true,'Stop all stops media');
 // Register the production service worker and exercise real browser caching.
 await page.evaluate(async()=>{
  await navigator.serviceWorker.register('../service-worker.js');
  await navigator.serviceWorker.ready;
 });
 await page.reload();
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 const before=await page.evaluate(async()=>{
  const cached=await caches.match(new URL('../index.html',location.href).href);
  if(!cached)throw new Error('Missing offline game shell');
  return await cached.text();
 });
 assert(before.includes('id="loading"'),'Cached index must be the game, not the audio room');
 await page.reload();
 await page.waitForFunction(async()=>!!(await caches.match(location.href)));
 const after=await page.evaluate(async()=>{
  const cached=await caches.match(new URL('../index.html',location.href).href);
  return await cached.text();
 });
 assert.equal(after,before,'Standalone navigation must never replace game shell');
 await context.setOffline(true);
 await page.reload();
 assert.equal(await page.locator('audio').count(),7,'Previously visited listening room must reopen offline');
 await assert.rejects(()=>page.goto(new URL('assets/not-visited-qa.html',base).href), 'Uncached standalone page cannot fall back to game');
 await page.goto(new URL('index.html',base).href,{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('#loading').count(),1,'Real game shell survives offline');
 assert.deepEqual(errors,[],'No page-script errors');
 console.log('Browser audio room: seven decoded recordings, playback switch, Stop all, cache isolation, offline room/game passed');
}finally{await browser.close();}
