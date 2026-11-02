// Source-level guard for the owner's Russian-at-first-glance dialect.
// The real browser flow is covered separately by ui-accessibility and acceptance.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(path,'utf8');
const [html,app,cinema,css]=await Promise.all(
 ['index.html','js/app.js','js/cinematic.js','styles.css'].map(read));
for(const [path,source] of [['index.html',html],['js/app.js',app],['js/cinematic.js',cinema]]){
 for(const letter of ['Ї','Є']) assert(!source.includes(letter),path+': non-Russian Cyrillic confusable must not return: '+letter);
}
for(const phrase of ['БЮРОКЯДТ-1','МИНИСТЕРСТВО','ПРОВЕРКА','ПЕЧАТЬ','СПРАВКА']){
 assert(app.includes(phrase),'Preserve authentic Cyrillic: '+phrase);
}
for(const phrase of ['STЕР 1 / 3 · SЕLЕКТ ДОКУМЕНТ','КОNFIRM','СОLLЕКТ СПРАВКА','ФОТО РЕRМIТ']){
 assert(html.includes(phrase),'Visible mixed-script phrase missing: '+phrase);
}
assert(html.includes('id="hint" aria-hidden="true"'),'Decorative status must not be spoken literally');
assert(html.includes('id="srStatus" class="srOnly" role="status"'),'Plain-English workflow announcements required');
assert(html.includes('id="srCinemaStatus" class="srOnly" role="status"'),'Plain-English photo announcements required');
assert(html.includes('aria-label="Select a document"'),'Critical action name must remain plain English');
assert(html.includes('aria-label="Collect certificate"'),'Certificate action name must remain plain English');
assert(app.includes("document.getElementById('srStatus').textContent=spoken||visual"),'Speech and display must be independently updated');
assert(cinema.includes('spokenLive.textContent=spoken||visual'),'Photo speech and display must be independently updated');
assert((cinema.match(/label:'[^']+'/g)||[]).length>=8,'All eight camera shots need readable alternatives');
assert(css.includes('.srOnly{'),'Readable alternatives must be visually hidden, not removed');
for(const phrase of ['drawInput(current.name)','drawOut(current.name,serial)','createCertificate(current.name,serial)']){
 assert(app.includes(phrase),'Never transform or upload player filenames: '+phrase);
}
console.log('Language style: mixed-script UI, genuine Cyrillic, readable announcements and filenames OK');
