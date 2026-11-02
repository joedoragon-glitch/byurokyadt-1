// Non-deploying, paired browser workload profiler for issue #8.
// Run: node tests/performance.mjs --base=http://127.0.0.1:8000/ --label=main --out=test-results/performance/main.json
// The browser instrumentation has overhead. Numbers are comparative diagnostics, never device FPS/GPU time.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).filter(x => x.startsWith('--')).map(x => {
  const i = x.indexOf('=');
  return i === -1 ? [x.slice(2), 'true'] : [x.slice(2, i), x.slice(i + 1)];
}));
const median = xs => percentile(xs, .5);
function percentile(xs, q) {
  if (!xs.length) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  return Number(sorted[Math.floor((sorted.length - 1) * q)].toFixed(3));
}
const round = n => Number(n.toFixed(3));
if (args.compare && args.candidate) {
  const base = JSON.parse(await readFile(args.compare, 'utf8'));
  const candidate = JSON.parse(await readFile(args.candidate, 'utf8'));
  assert.deepEqual(base.stages.map(x => x.name), candidate.stages.map(x => x.name),
    'Comparison requires identical workloads');
  // A matched trace must also use the same renderer/browser and profiling settings.
  // The two local-server URLs, time stamps and source SHAs are intentionally different.
  const comparable = report => ({
    browser: report.meta?.browser, node: report.meta?.node, idleMs: report.meta?.idleMs,
    runner: report.meta?.runner, userAgent: report.meta?.environment?.userAgent,
    viewport: report.meta?.environment?.viewport, dpr: report.meta?.environment?.dpr,
    reducedMotion: report.meta?.environment?.reducedMotion,
    gl: report.meta?.environment?.gl
  });
  assert.deepEqual(comparable(base), comparable(candidate),
    'Comparison requires identical browser, renderer, viewport, DPR and workload settings');
  assert.deepEqual(Object.keys(base.network), Object.keys(candidate.network),
    'Comparison requires the same cold/warm/offline navigation stages');
  const rows = base.stages.map((a, i) => {
    const b = candidate.stages[i];
    return { stage: a.name, baseMs: a.elapsedMs, candidateMs: b.elapsedMs,
      baseRenders: a.renders, candidateRenders: b.renders,
      baseRAF: a.rafCallbacks, candidateRAF: b.rafCallbacks,
      baseDraws: a.draws, candidateDraws: b.draws,
      baseCallbackP95Ms: a.callbackP95Ms, candidateCallbackP95Ms: b.callbackP95Ms,
      baseHeapMB: a.jsHeapMB, candidateHeapMB: b.jsHeapMB };
  });
  const network = Object.fromEntries(Object.keys(base.network).map(name => [name, {
    base: base.network[name], candidate: candidate.network[name]
  }]));
  const result = { note: 'Single paired browser run. No automatic performance claim, FPS target or GPU-time inference.', base: base.meta, candidate: candidate.meta, rows, network };
  if (args.out) { await mkdir(dirname(args.out), { recursive: true }); await writeFile(args.out, JSON.stringify(result, null, 2)); }
  console.log('PAIRED PERFORMANCE COMPARISON\n' + JSON.stringify(result, null, 2));
  process.exit(0);
}

const base = args.base || process.env.BASE_URL || 'http://127.0.0.1:8000/';
const label = args.label || 'unlabelled';
const out = args.out || 'test-results/performance/' + label + '.json';
const idleMs = Number(args['idle-ms'] || 30000);
assert(idleMs >= 1000 && idleMs <= 120000, 'idle-ms out of supported range');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 960, height: 680 }, deviceScaleFactor: 1, acceptDownloads: true });
const page = await context.newPage();
page.setDefaultTimeout(90000);
const cdp = await context.newCDPSession(page);
async function cdpHeapMB() {
  try { const usage = await cdp.send('Runtime.getHeapUsage'); return round(usage.usedSize / 1048576); }
  catch { return null; }
}
const errors = [], network = [];
page.on('pageerror', error => errors.push(String(error)));
context.on('response', response => {
  const url = new URL(response.url());
  // Locally created blob: image URLs are not requests to a remote server.
  const source = url.protocol === 'blob:' ? 'object-url' : response.fromServiceWorker() ? 'service-worker' : 'network';
  network.push({ status: response.status(), source,
    url: source === 'object-url' ? 'blob:local-decoded-image' : url.pathname });
});
await page.addInitScript(() => {
  const probe = window.__BYUR_PERF_PROBE = { scheduled: 0, executed: 0, callbackMs: [], callbackTimes: [], drawCalls: 0, resources: {} };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = fn => {
    probe.scheduled++;
    return raf(t => {
      probe.executed++;
      const start = performance.now();
      try { return fn(t); }
      finally {
        if (probe.callbackMs.length < 100000) {
          probe.callbackMs.push(performance.now() - start);
          probe.callbackTimes.push(t);
        }
      }
    });
  };
  // Count real WebGL draw submissions (not just Three.js renderer.info's LAST rendered frame).
  // The wrappers are identical on both builds; report their measurement overhead as a limitation.
  for (const type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!type) continue;
    for (const method of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
      const desc = Object.getOwnPropertyDescriptor(type.prototype, method);
      if (!desc || typeof desc.value !== 'function') continue;
      Object.defineProperty(type.prototype, method, { ...desc, value: function (...a) {
        probe.drawCalls++;
        return desc.value.apply(this, a);
      } });
    }
    // Count API-level GPU resource operations, not estimated VRAM bytes.
    for (const method of ['createBuffer', 'deleteBuffer', 'createTexture', 'deleteTexture',
      'createProgram', 'deleteProgram', 'createFramebuffer', 'deleteFramebuffer',
      'createRenderbuffer', 'deleteRenderbuffer', 'texImage2D', 'texSubImage2D',
      'bufferData', 'bufferSubData']) {
      const desc = Object.getOwnPropertyDescriptor(type.prototype, method);
      if (!desc || typeof desc.value !== 'function') continue;
      Object.defineProperty(type.prototype, method, { ...desc, value: function (...a) {
        probe.resources[method] = (probe.resources[method] || 0) + 1;
        return desc.value.apply(this, a);
      } });
    }
  }
});

const report = { meta: { label, base, startedAt: new Date().toISOString(),
  runner: 'Playwright Chromium, context 960x680 at DPR 1, instrumented WebGL draw and RAF callbacks',
  caveat: 'Callback wall time includes JS and driver stalls; WebGL draws are submissions, not measured GPU time. Never infer physical-device FPS.',
  idleMs, node: process.version, sourceSha: args['source-sha'] || null,
  memorySource: 'CDP Runtime.getHeapUsage (JavaScript heap, not GPU VRAM)' }, boot: {}, stages: [], network: {}, failures: [] };
const inspect = new URL(base); inspect.searchParams.set('inspect', '1');

async function read() {
  return page.evaluate(() => {
    const p = window.__BYUR_PERF_PROBE, s = window.BYUR_INSPECT.snapshot();
    const canvas = document.querySelector('#app canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return {
      time: performance.now(), scheduled: p.scheduled, executed: p.executed,
      drawCalls: p.drawCalls, resources: { ...p.resources }, cpuCount: p.callbackMs.length, callbackMs: p.callbackMs.slice(),
      callbackTimes: p.callbackTimes.slice(), renders: s.frames, callsPerLastRender: s.calls,
      trianglesPerLastRender: s.triangles, output: s.output.stage, busy: s.busy,
      heapMB: performance.memory?.usedJSHeapSize ? performance.memory.usedJSHeapSize / 1048576 : null,
      gl: { version: gl?.getParameter(gl.VERSION), vendor: gl?.getParameter(gl.VENDOR),
        renderer: gl?.getParameter(gl.RENDERER),
        unmaskedVendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : null,
        unmaskedRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null },
      userAgent: navigator.userAgent, dpr: devicePixelRatio,
      viewport: [innerWidth, innerHeight], reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  });
}
async function stage(name, operation) {
  const before = await read(), heapStart = await cdpHeapMB(), wallStart = performance.now(), networkStart = network.length;
  await operation();
  const after = await read(), heapEnd = await cdpHeapMB();
  const callbackMs = after.callbackMs.slice(before.cpuCount);
  const times = after.callbackTimes.slice(before.cpuCount);
  const intervals = times.slice(1).map((t, i) => t - times[i]).filter(t => t >= 0);
  const entry = { name, elapsedMs: round(performance.now() - wallStart),
    rafScheduled: after.scheduled - before.scheduled, rafCallbacks: after.executed - before.executed,
    renders: after.renders - before.renders, draws: after.drawCalls - before.drawCalls,
    resourceCalls: Object.fromEntries([...new Set([...Object.keys(before.resources), ...Object.keys(after.resources)])]
      .map(key => [key, (after.resources[key] || 0) - (before.resources[key] || 0)])
      .filter(([, count]) => count !== 0)),
    lastRenderCalls: after.callsPerLastRender, lastRenderTriangles: after.trianglesPerLastRender,
    callbackP50Ms: median(callbackMs), callbackP95Ms: percentile(callbackMs, .95),
    callbackIntervalP95Ms: percentile(intervals, .95),
    jsHeapMB: heapEnd, jsHeapDeltaMB: heapStart === null || heapEnd === null ? null : round(heapEnd - heapStart),
    network: { responses: network.length - networkStart,
      serviceWorkerResponses: network.slice(networkStart).filter(x => x.source === 'service-worker').length },
    outputEnd: after.output };
  report.stages.push(entry);
  console.log('PERF STAGE ' + label + ' ' + JSON.stringify(entry));
}
// Optional controls stay behind the secondary menu in issue #9's UI candidate.
// Preserve the actual player click path on both the current and future interfaces.
async function clickUtility(id) {
  const menu = page.locator('#menuToggle');
  if (await menu.count() && await menu.getAttribute('aria-expanded') !== 'true')
    await menu.click();
  await page.locator('#' + id).click();
}
async function ready() {
  await page.locator('#loading').waitFor({ state: 'hidden', timeout: 90000 });
  assert.equal(await page.locator('#fatal').isVisible(), false, 'Game scene initializes');
  await page.waitForFunction(() => !!window.BYUR_INSPECT?.snapshot);
}
const runNavigation = async (name, offline = false) => {
  const networkStart = network.length, start = performance.now();
  await page.goto(inspect.href, { waitUntil: 'load', timeout: 90000 });
  await ready();
  const requests = network.slice(networkStart);
  report.network[name] = { elapsedMs: round(performance.now() - start),
    responses: requests.length, serviceWorkerResponses: requests.filter(x => x.source === 'service-worker').length,
    networkResponses: requests.filter(x => x.source === 'network').length,
    localObjectUrlResponses: requests.filter(x => x.source === 'object-url').length,
    resources: requests.map(x => x.url + ' (' + x.status + ', ' + x.source + ')'),
    offline, controller: await page.evaluate(() => !!navigator.serviceWorker.controller) };
  if (offline) assert.equal(report.network[name].networkResponses, 0,
    'Offline app reload must not depend on uncached network resources');
};

try {
  await runNavigation('cold');
  const environment = await read();
  report.meta.browser = browser.version();
  report.meta.environment = { userAgent: environment.userAgent, dpr: environment.dpr,
    viewport: environment.viewport, gl: environment.gl, reducedMotion: environment.reducedMotion };
  report.boot = { renders: environment.renders, drawCalls: environment.drawCalls, heapMB: await cdpHeapMB(),
    resources: environment.resources };
  await page.screenshot({ path: (await outputPath('room.png')) });
  await stage('idle', () => page.waitForTimeout(idleMs));
  await stage('walking', async () => {
    await page.locator('#app canvas').click({ position: { x: 30, y: 40 } });
    await page.keyboard.down('w'); await page.waitForTimeout(2500); await page.keyboard.up('w');
    await page.keyboard.down('d'); await page.waitForTimeout(2500); await page.keyboard.up('d');
  });
  await stage('eight-cinematic-views', async () => {
    await clickUtility('cinemaEnter');
    for (let i = 0; i < 8; i++) {
      await page.locator('#cinemaShot').selectOption(String(i));
      await page.waitForFunction(() => !window.BYUR_INSPECT.snapshot().cinema.travelling, null, { timeout: 90000, polling: 250 });
    }
    await page.locator('#cinemaExit').click();
  });
  await stage('reduced-motion-idle', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(3000);
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await stage('audio-on-idle', async () => {
    await clickUtility('sound');
    await page.waitForFunction(() => window.MinistryAudio.state().decoded.length === 10, null, { timeout: 45000 });
    await page.waitForTimeout(8000);
  });
  await page.locator('#file').setInputFiles({ name: 'PROFILE-27B.txt', mimeType: 'text/plain', buffer: Buffer.from('performance audit: no file uploaded') });
  await stage('full-document-cycle', async () => {
    await page.locator('#runDoc').click();
    await page.waitForFunction(() => !document.querySelector('#runDoc').disabled && document.querySelector('#hint').textContent.startsWith('APPЯOVЄD'), null, { timeout: 180000, polling: 250 });
  });
  assert.equal((await page.evaluate(() => window.BYUR_INSPECT.snapshot())).issued, 1);
  await page.screenshot({ path: await outputPath('complete.png') });
  await clickUtility('sound');
  await runNavigation('warm');
  await context.setOffline(true);
  await runNavigation('offline', true);
  await context.setOffline(false);
  await stage('post-offline-idle', () => page.waitForTimeout(3000));
  report.meta.cacheNames = await page.evaluate(() => caches.keys());
  assert(report.meta.cacheNames.some(x => x.startsWith('byurokyadt-')), 'PWA precache exists');
  assert.deepEqual(errors, [], 'No browser errors');
  report.meta.finishedAt = new Date().toISOString();
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(report, null, 2));
  console.log('PERF COMPLETE ' + label + ' ' + out);
} catch (error) {
  report.failures.push(String(error), ...errors);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(report, null, 2));
  console.error('PERF FAILED ' + label, error);
  throw error;
} finally {
  await browser.close();
}
async function outputPath(name) {
  const path = dirname(out) + '/' + label + '-' + name;
  await mkdir(dirname(path), { recursive: true });
  return path;
}
