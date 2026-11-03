// Keep the Markdown entry points, local links, anchors and maintained formatting coherent.
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';

const core = [
  'README.md', 'AGENTS.md', 'docs/DOCUMENTATION_INDEX.md',
  'docs/DEVELOPMENT_STATE.md', 'docs/ARCHITECTURE.md',
  'docs/CREATIVE_DIRECTION.md', 'docs/QUALITY_STANDARDS.md',
  'docs/AUDIO_DIRECTION.md', 'docs/ENGINEERING_WORKFLOW.md',
  'docs/DECISIONS.md', 'docs/COMMUNICATION_STYLE.md'
];
for (const path of core) await access(path);
const docs = [
  ...(await readdir('.')).filter(f => f.endsWith('.md')),
  ...(await readdir('docs')).filter(f => f.endsWith('.md')).map(f => 'docs/' + f)
];
const root = resolve('.');
const sources = new Map();
for (const file of docs) sources.set(resolve(file), await readFile(file, 'utf8'));

function slug(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[~*_]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_ -]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}
function headingAnchors(source) {
  const used = new Map(), anchors = new Set();
  let fence = null;
  for (const line of source.split('\n')) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (marker[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;
    const h = line.match(/^#{1,6}\s+(.+)\s*$/);
    if (!h) continue;
    const base = slug(h[1].replace(/\s+#+\s*$/, ''));
    const count = used.get(base) || 0;
    anchors.add(base + (count ? '-' + count : ''));
    used.set(base, count + 1);
  }
  return anchors;
}
let localLinks = 0, anchorsChecked = 0;
for (const file of docs) {
  const source = sources.get(resolve(file));
  assert(source.endsWith('\n') && !source.includes('\r'),
    `Markdown must use LF and end in newline: ${file}`);
  const lines = source.split('\n');
  let fence = null, titles = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    assert(!/[ \t]+$/.test(line), `Trailing whitespace: ${file}:${i + 1}`);
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (marker[1][0] === fence) fence = null;
      continue;
    }
    if (!fence && /^#\s+/.test(line)) titles++;
  }
  assert(!fence, `Unterminated Markdown code fence: ${file}`);
  // AUDIT is a concatenated historical record with several legitimate H1 entries.
  if (file !== 'AUDIT.md') {
    assert.equal(titles, 1, `Maintained Markdown needs one H1: ${file}`);
    assert(!source.includes('\\`'), `Escaped code delimiter: ${file}`);
  }

  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const [path, hash] = match[1].trim().split('#');
    if (/^(?:https?:|mailto:|data:)/i.test(path)) continue;
    if (!path && !hash) continue;
    const target = resolve(dirname(file), decodeURIComponent(path || basename(file)));
    assert(target === root || target.startsWith(root + '/'),
      `Out-of-repository link in ${file}: ${match[1]}`);
    try { await access(target); }
    catch { assert.fail(`Broken relative link in ${file}: ${match[1]}`); }
    localLinks++;
    if (hash) {
      const content = sources.get(target) || await readFile(target, 'utf8');
      const anchor = decodeURIComponent(hash).toLowerCase();
      assert(headingAnchors(content).has(anchor),
        `Broken Markdown anchor in ${file}: ${match[1]}`);
      anchorsChecked++;
    }
  }
}
const readme = sources.get(resolve('README.md'));
const agents = sources.get(resolve('AGENTS.md'));
const index = sources.get(resolve('docs/DOCUMENTATION_INDEX.md'));
assert(readme.includes('](AGENTS.md)') && readme.includes('](docs/DOCUMENTATION_INDEX.md)'));
assert(agents.includes('docs/ENGINEERING_WORKFLOW.md') && agents.includes('docs/CREATIVE_DIRECTION.md'));
for (const file of docs.filter(p => p.startsWith('docs/') && p !== 'docs/DOCUMENTATION_INDEX.md')) {
  assert(index.includes('(' + basename(file) + ')'), `Unindexed documentation: ${file}`);
}
console.log(`Documentation: ${docs.length} Markdown files, ${localLinks} local links, ${anchorsChecked} anchors and formatting OK`);
