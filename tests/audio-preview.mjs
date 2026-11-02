// Lightweight regression for the standalone OGG room and game-shell navigation.
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile('assets/audio-preview.html','utf8');
const listed=[...html.matchAll(/<audio\b[^>]*\bsrc="\.\/audio\/([^"]+)"/g)].map(m=>m[1]).sort();
const available=(await readdir('assets/audio')).filter(n=>n.endsWith('.ogg')).sort();
assert.deepEqual(listed,available,'Room must expose every original OGG once');
assert.equal(listed.length,7);
assert.equal((html.match(/<audio\b/g)||[]).length,7);
assert(!/localStorage|sessionStorage|indexedDB|navigator\.sendBeacon|XMLHttpRequest/.test(html),'Room must not read game saves or send telemetry');
assert(!/<audio[^>]+autoplay/i.test(html),'Browser audio must wait for gesture');

const handlers={};
const writes=[];
let offline=false;
const stored=new Map();
const cache={put:async(k,v)=>{const key=typeof k==='string'?k:k.url;writes.push(key);stored.set(key,v);}};
const caches={open:async()=>cache,keys:async()=>[],match:async(k)=>stored.get(typeof k==='string'?k:k.url)||null};
const sampleResponse=()=>({ok:true,clone(){return sampleResponse()}});
const scope='https://example.test/byurokyadt-1/';
const self={
 location:{origin:'https://example.test'},registration:{scope},
 clients:{claim:async()=>{}},skipWaiting:async()=>{},
 addEventListener:(type,handler)=>{handlers[type]=handler;}
};
const Response={error:()=>({offlineError:true})};
const fetch=async()=>{if(offline)throw Error('offline');return sampleResponse();};
const source=await readFile('service-worker.js','utf8');
vm.runInNewContext(source,{self,caches,fetch,Response,URL,Promise});
async function navigate(path){
 let response;const waits=[];
 const event={
  request:{url:new URL(path,scope).href,mode:'navigate',method:'GET'},
  respondWith:p=>{response=p;},
  waitUntil:p=>{waits.push(p);}
 };
 handlers.fetch(event);
 assert(response,'service worker must handle same-origin navigation');
 const result=await response;
 await Promise.all(waits);
 return result;
}
await navigate('assets/audio-preview.html');
assert(!writes.includes('./index.html'),'Preview navigation must not overwrite cached game HTML');
assert(writes.some(k=>k.includes('/assets/audio-preview.html')),'Preview can be cached as itself');
await navigate('index.html');
assert(writes.includes('./index.html'),'Game-shell navigation must preserve the offline game index');
offline=true;
const cachedRoom=await navigate('assets/audio-preview.html');
assert(cachedRoom.ok,'Already-visited listening room may work offline');
const unknownPage=await navigate('assets/unvisited-page.html');
assert(unknownPage.offlineError,'Uncached standalone page must not fall back to the game shell');
const offlineGame=await navigate('index.html');
assert(offlineGame.ok,'Cached game shell must remain available offline');
console.log('Preview: 7 OGG sources, no save access/autoplay, isolated navigation cache, offline game shell OK');
