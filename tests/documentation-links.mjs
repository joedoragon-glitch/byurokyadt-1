// Check the maintained Markdown entry points and relative repository links.
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const core=['README.md','AGENTS.md','docs/DOCUMENTATION_INDEX.md','docs/DEVELOPMENT_STATE.md','docs/ARCHITECTURE.md','docs/CREATIVE_DIRECTION.md','docs/QUALITY_STANDARDS.md','docs/AUDIO_DIRECTION.md','docs/ENGINEERING_WORKFLOW.md','docs/DECISIONS.md','docs/COMMUNICATION_STYLE.md'];
for(const path of core)await access(path);
const docs=[
 ...(await readdir('.')).filter(f=>f.endsWith('.md')),
 ...(await readdir('docs')).filter(f=>f.endsWith('.md')).map(f=>'docs/'+f)
];
let total=0;
for(const file of docs){
 const source=await readFile(file,'utf8');
 for(const m of source.matchAll(/\]\(([^)]+)\)/g)){
  const link=m[1].trim().split('#')[0].split('?')[0];
  if(!link||/^(?:https?:|mailto:|data:)/i.test(link))continue;
  const target=resolve(dirname(file),decodeURIComponent(link));
  assert(target.startsWith(resolve('.')+'/')||target===resolve('.'),`Out-of-repository link in ${file}: ${link}`);
  try{await access(target)}catch{assert.fail(`Broken relative link in ${file}: ${link}`)}
  total++;
 }
}
const readme=await readFile('README.md','utf8');
const agents=await readFile('AGENTS.md','utf8');
assert(readme.includes('](AGENTS.md)')&&readme.includes('](docs/DOCUMENTATION_INDEX.md)'));
assert(agents.includes('docs/ENGINEERING_WORKFLOW.md')&&agents.includes('docs/CREATIVE_DIRECTION.md'));
console.log(`Documentation: ${docs.length} files and ${total} relative links valid`);
