// Guard release metadata, cache identity, offline shell inputs and the test roster.
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';

const packageData=JSON.parse(await readFile('package.json','utf8'));
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const html=await readFile('index.html','utf8');
const worker=await readFile('service-worker.js','utf8');
const version=packageData.version;

assert.equal(lock.version,version,'Lockfile version must match package version');
assert.equal(lock.packages[''].version,version,'Root lockfile package version must match');

const suffix=version.replaceAll('.','-');
assert(worker.includes(`const CACHE='byurokyadt-v${suffix}'`),'PWA cache must track release version');
const paths=['styles.css','js/audio.js','js/cinematic.js','js/app.js'];
for(const path of paths){
 const url=`./${path}?v=${version}`;
 // Exact versioned URLs must be referenced once by both the game and precache.
 const escaped=path.replace(/[.*+?^\u0024{}()|[\]\\]/g,'\\$&');
 const inHtml=[...html.matchAll(new RegExp(`\\./${escaped}\\?v=([0-9.]+)`,'g'))];
 const inCache=[...worker.matchAll(new RegExp(`\\./${escaped}\\?v=([0-9.]+)`,'g'))];
 assert.deepEqual(inHtml.map(m=>m[1]),[version],`HTML URL version mismatch: ${path}`);
 assert.deepEqual(inCache.map(m=>m[1]),[version],`PWA URL version mismatch: ${path}`);
 assert(html.includes(url)&&worker.includes(url));
}
for(const asset of ['manifest.webmanifest','icons/icon.svg','vendor/three.min.js',
  'assets/enamel-v9.webp','assets/brezhnev-party-v8.jpg','assets/xi-plan-v8.jpg']){
 assert(worker.includes(`./${asset}`),`Required game asset missing from offline precache: ${asset}`);
}
assert(!worker.includes("'./assets/audio-preview.html'"),'Optional sound page must remain outside mandatory offline shell');

const commands=[...packageData.scripts.test.matchAll(/(?:^|&&\s*)node\s+(tests\/[\w-]+\.mjs)/g)].map(m=>m[1]);
assert(commands.length>=10,'Full suite must include established checks and maintenance guard');
assert.equal(new Set(commands).size,commands.length,'Test roster must not run any entry twice');
const required=['documentation-links','maintenance','audio-preview','audio-corridor',
 'camera-math','paper-path','acceptance','cinematic','paper-motion','audio-preview-browser'];
for(const name of required){
 const path=`tests/${name}.mjs`;
 assert(commands.includes(path),`Missing required test: ${path}`);
 if(name!=='maintenance')await access(path);
}
const quality=await readFile('docs/QUALITY_STANDARDS.md','utf8');
assert(!quality.includes('all five suites'),'Outdated test-count guidance reintroduced');
console.log(`Maintenance: release ${version}, four HTML/cache URLs, six offline asset references and ${commands.length} declared checks OK`);
