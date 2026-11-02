// Deterministic regression for asynchronous audio unlock and corridor priority.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
let tick,context;
const requests=[];
const node=()=>({connect(){},disconnect(){}});
const gain=()=>({...node(),gain:{value:0,cancelScheduledValues(){},setTargetAtTime(value){this.value=value}}});
class FakeAudioContext {
 constructor(){context=this;this.currentTime=0;this.sampleRate=64;this.state='suspended';this.listener={setPosition(){},setOrientation(){}};}
 createDynamicsCompressor(){return {...node(),threshold:{value:0},ratio:{value:0}}}
 createGain(){return gain()}
 createBuffer(channels,length){return {getChannelData(){return new Float32Array(length)}}}
 createBufferSource(){return {...node(),loop:false,start(){},stop(){}}}
 createPanner(){return {...node(),setPosition(){}}}
 createBiquadFilter(){return {...node(),frequency:{value:0},Q:{value:0}}}
 async resume(){this.state='running'}
 async suspend(){this.state='suspended'}
 async decodeAudioData(){return {duration:1}}
}
const window={AudioContext:FakeAudioContext};
const document={hidden:false,addEventListener(){}};
vm.runInNewContext(await readFile('js/audio.js','utf8'),{
 window,document,console,
 setInterval(fn){tick=fn;},
 fetch(url){return new Promise(resolve=>requests.push({url,resolve}));}
});
const audio=window.MinistryAudio;
const enabling=audio.setEffects(true);
// Keep the seven recording requests pending while a real AudioContext is active.
for(let i=0;i<5;i++)await Promise.resolve();
assert.equal(requests.length,7,'All original recordings must start loading');
assert.equal(typeof tick,'function');
context.currentTime=.2;tick();
assert.equal(audio.state().corridor.passes,0,'No premature corridor event during slow audio initialization');
for(const request of requests)request.resolve({ok:true,arrayBuffer:async()=>new ArrayBuffer(8)});
await enabling;
assert.equal(audio.state().decoded.length,10,'Seven recordings plus three procedural sounds ready');
assert.equal(audio.state().effectsOn,true);
// The random background timer is overdue by the time the operator approaches.
// A pending approach must take precedence over that unrelated event.
audio.listener([5.84,1.7,-.8],[0,0,-1],[0,1,0]);
context.currentTime=20;tick();
assert.equal(audio.state().corridor.passes,0,'Background footsteps cannot consume an unhandled approach');
context.currentTime=21.5;tick();
const approach=audio.state().corridor;
assert.equal(approach.passes,1);
assert.equal(approach.lastPass.reason,'approach');
assert.equal(approach.lastPass.positions.length,6);
assert(approach.lastPass.positions.every(p=>p[0]>6.1));
context.currentTime=24;tick();
assert.equal(audio.state().corridor.passes,1,'Approach cannot repeat immediately');
// An occasional background pass is still allowed when the listener is away.
audio.listener([0,1.7,2],[0,0,-1],[0,1,0]);
context.currentTime=100;tick();
assert.equal(audio.state().corridor.lastPass.reason,'passing');
assert.equal(audio.state().corridor.passes,2);
await audio.setEffects(false);
assert.equal(audio.state().voices,0,'Mute stops scheduled voices');
context.currentTime=200;tick();
assert.equal(audio.state().corridor.passes,2,'Mute suppresses new footsteps');
console.log('Corridor audio: delayed unlock, near-door approach priority, background passing, cooldown, mute passed');
