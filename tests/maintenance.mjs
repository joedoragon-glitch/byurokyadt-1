// Guard release metadata, actual offline precache entries and the complete test roster.
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';

const packageData=JSON.parse(await readFile('package.json','utf8'));
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const html=await readFile('index.html','utf8');
const worker=await readFile('service-worker.js','utf8');
const version=packageData.version;

assert.equal(lock.version,version,'Lockfile version must match package version');
assert.equal(lock.packages[''].version,version,'Root lockfile package version must match');

// Evaluate only the static service worker registration in a sandbox, never any fetch event.
// This checks CORE membership rather than accepting matching strings hidden in comments.
const scope={addEventListener(){}};
vm.runInNewContext(worker+'\nself.__maintenance={cache:CACHE,core:CORE};',{self:scope});
const cacheName=scope.__maintenance.cache;
const core=Array.from(scope.__maintenance.core);
assert.equal(cacheName,'byurokyadt-v'+version.replaceAll('.','-'),'PWA cache must track release version');
assert.equal(new Set(core).size,core.length,'Offline precache must not include duplicate paths');
for(const entry of core){
 assert(entry.startsWith('./'),'Offline precache paths must remain app-relative');
 const path=entry.slice(2).split('?')[0];
 assert(!path.includes('..'),'Invalid offline asset path: '+entry);
 await access(path||'.');
}

const paths=['styles.css','js/audio.js','js/cinematic.js','js/app.js'];
for(const path of paths){
 const url='./'+path+'?v='+version;
 const escaped=path.replace(/[.*+?^\u0024{}()|[\]\\]/g,'\\$&');
 const inHtml=[...html.matchAll(new RegExp('\\./'+escaped+'\\?v=([0-9.]+)','g'))];
 const inCache=core.filter(entry=>entry.startsWith('./'+path+'?v='));
 assert.deepEqual(inHtml.map(m=>m[1]),[version],'HTML URL version mismatch: '+path);
 assert.deepEqual(inCache,[url],'PWA URL version mismatch: '+path);
}
for(const asset of ['','index.html','manifest.webmanifest','icons/icon.svg','vendor/three.min.js',
 'assets/enamel-v9.webp','assets/brezhnev-party-v8.jpg','assets/xi-plan-v8.jpg']){
 assert(core.includes('./'+asset),'Required game asset missing from offline precache: '+asset);
}
const recordings=['ministry','room','relay','feed','scan','stamp','bell'];
for(const name of recordings){
 assert(core.includes('./assets/audio/'+name+'.ogg'),'Original audio missing from offline cache: '+name);
}
assert(!core.includes('./assets/audio-preview.html'),'Optional sound room must stay outside mandatory precache');

const commands=[...packageData.scripts.test.matchAll(/(?:^|&&\s*)node\s+(tests\/[\w-]+\.mjs)/g)].map(m=>m[1]);
assert(commands.length>=10,'Full suite must include established checks and maintenance guard');
assert.equal(new Set(commands).size,commands.length,'Test roster must not run any entry twice');
const required=['documentation-links','maintenance','audio-preview','audio-corridor',
 'camera-math','paper-path','acceptance','cinematic','paper-motion','audio-preview-browser'];
for(const name of required){
 const path='tests/'+name+'.mjs';
 assert(commands.includes(path),'Missing required test: '+path);
 await access(path);
}
const quality=await readFile('docs/QUALITY_STANDARDS.md','utf8');
assert(!quality.includes('all five suites'),'Outdated test-count guidance reintroduced');
console.log('Maintenance: release '+version+', '+paths.length+' versioned asset URLs, '+core.length+' real precache entries, '+commands.length+' tests OK');
