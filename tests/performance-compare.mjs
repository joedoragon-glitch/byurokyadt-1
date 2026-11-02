// Regression gate for the performance comparator, without launching a browser.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const profiler = fileURLToPath(new URL('./performance.mjs', import.meta.url));
const stages = ['idle', 'walking', 'eight-cinematic-views', 'reduced-motion-idle',
  'audio-on-idle', 'full-document-cycle', 'post-offline-idle'];
const report = (label, sourceSha) => ({
  meta: {
    label, base: label === 'base' ? 'http://127.0.0.1:8001/' : 'http://127.0.0.1:8000/',
    sourceSha, browser: 'test-Chromium', node: process.version, idleMs: 30000,
    runner: 'test-instrumentation',
    environment: { userAgent: 'test-user-agent', viewport: [960, 680], dpr: 1,
      reducedMotion: false, gl: { version: 'WebGL 2.0', unmaskedRenderer: 'test-software-GPU' } }
  },
  stages: stages.map(name => ({ name, elapsedMs: 5000, renders: 3, rafCallbacks: 120,
    draws: 500, callbackP95Ms: 1.5, jsHeapMB: 10 })),
  network: { cold: { responses: 20 }, warm: { responses: 10 },
    offline: { responses: 10, networkResponses: 0 } }
});
const dir = await mkdtemp(join(tmpdir(), 'byur-perf-compare-'));
const base = join(dir, 'base.json'), candidate = join(dir, 'candidate.json');
const out = join(dir, 'compare.json');
const invoke = () => spawnSync(process.execPath,
  [profiler, '--compare=' + base, '--candidate=' + candidate, '--out=' + out],
  { encoding: 'utf8', timeout: 10000 });

try {
  const a = report('base', '0000000000000000000000000000000000000001');
  const b = report('candidate', '0000000000000000000000000000000000000002');
  await writeFile(base, JSON.stringify(a));
  await writeFile(candidate, JSON.stringify(b));
  let result = invoke();
  assert.equal(result.status, 0, result.stderr);
  let comparison = JSON.parse(await readFile(out, 'utf8'));
  assert.equal(comparison.rows.length, 7);
  assert.equal(comparison.network.offline.candidate.networkResponses, 0);
  assert.equal(comparison.base.sourceSha, a.meta.sourceSha);
  assert.equal(comparison.candidate.sourceSha, b.meta.sourceSha);

  b.meta.environment.dpr = 2;
  await writeFile(candidate, JSON.stringify(b));
  result = invoke();
  assert.notEqual(result.status, 0, 'Mixed DPR must be rejected');
  b.meta.environment.dpr = 1;

  b.meta.environment.gl.unmaskedRenderer = 'different-hardware-GPU';
  await writeFile(candidate, JSON.stringify(b));
  result = invoke();
  assert.notEqual(result.status, 0, 'Mixed GPU renderers must be rejected');
  b.meta.environment.gl.unmaskedRenderer = a.meta.environment.gl.unmaskedRenderer;

  b.meta.idleMs = 1000;
  await writeFile(candidate, JSON.stringify(b));
  result = invoke();
  assert.notEqual(result.status, 0, 'Mixed idle durations must be rejected');
  b.meta.idleMs = a.meta.idleMs;

  b.stages[1].name = 'unmatched-stage';
  await writeFile(candidate, JSON.stringify(b));
  result = invoke();
  assert.notEqual(result.status, 0, 'Mismatched stage sequence must be rejected');
  console.log('Performance comparator: matched traces pass, incompatible DPR/GPU/settings/stages fail');
} finally {
  await rm(dir, { recursive: true, force: true });
}
