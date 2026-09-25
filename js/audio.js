/* Original sampled mechanics + quiet procedural winter. No remote audio. */
(()=>{
 let context,master,sfx,music,ambience,loading,musicSource,roomSource,windSource;
 let effectsOn=false,musicOn=false,volume=.65,cycling=false,nextTick=0,nextSteps=0;
 const buffers=new Map(),voices=new Set(),anchors={relay:[-.50,1.66,-1.29],feed:[-.17,1.11,-1.28],scan:[-.17,1.19,-1.28],stamp:[.39,1.15,-1.33],bell:[0,1.85,-1.32],wind:[-5.7,2.7,-2.6],tick:[0,.65,-6.4],step:[6.24,.4,-.8]};
 const corridor={near:false,since:null,handled:false,nextApproach:0,passes:0,lastPass:null};
 const names=['relay','feed','scan','stamp','bell','room','ministry'];let listenerState=null,lastEvent=null;
 function gain(parent,value){const g=context.createGain();g.gain.value=value;g.connect(parent);return g}
 function noiseBuffer(seconds,fn){const b=context.createBuffer(1,Math.ceil(context.sampleRate*seconds),context.sampleRate),d=b.getChannelData(0);let seed=71,low=0;for(let i=0;i<d.length;i++){seed=(seed*16807)%2147483647;const n=seed/2147483647*2-1;low=low*.96+n*.04;d[i]=fn(i/context.sampleRate,n,low,seconds)}return b}
 function winterBuffers(){
  buffers.set('wind',noiseBuffer(12,(t,n,low,d)=>low*(.55+.20*Math.sin(t*2*Math.PI/d)+.13*Math.cos(t*6*Math.PI/d))*Math.min(1,t/.08,(d-t)/.08)));
  buffers.set('tick',noiseBuffer(.48,(t,n)=>Math.exp(-t*23)*(.25*n+Math.sin(t*2*Math.PI*1370)*.3+Math.sin(t*2*Math.PI*1931)*.15)));
  buffers.set('step',noiseBuffer(.46,(t,n,low)=>Math.min(1,t*75)*Math.exp(-t*17)*(low*1.7+Math.sin(t*2*Math.PI*62)*.34)));
 }
 async function ready(){
  if(!context){context=new(window.AudioContext||window.webkitAudioContext)();const compressor=context.createDynamicsCompressor();compressor.threshold.value=-12;compressor.ratio.value=3;compressor.connect(context.destination);master=gain(compressor,volume);sfx=gain(master,0);music=gain(master,0);ambience=gain(sfx,.045);winterBuffers();if(listenerState)listener(...listenerState)}
  await context.resume();
  loading??=Promise.all(names.map(async name=>{const r=await fetch('./assets/audio/'+name+'.ogg');if(!r.ok)throw Error('Audio asset '+name);buffers.set(name,await context.decodeAudioData(await r.arrayBuffer()))})).catch(e=>{loading=null;throw e});
  await loading;return context;
 }
 function fade(g,value,d=.15){const t=context.currentTime;g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(value,t,d)}
 function loop(name,bus){const src=context.createBufferSource();src.buffer=buffers.get(name);src.loop=true;src.connect(bus);src.start();return src}
 function positioned(name,position,level=1,delay=0,looped=false){
  if(!effectsOn||!context||context.state!=='running'||!buffers.has(name)||voices.size>20)return;
  const src=context.createBufferSource(),p=context.createPanner(),g=gain(sfx,level);src.buffer=buffers.get(name);src.loop=looped;p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=1.8;p.maxDistance=22;p.rolloffFactor=.8;p.setPosition(...position);let filter;if(name==='step'){filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;filter.Q.value=.5;src.connect(filter);filter.connect(p)}else src.connect(p);p.connect(g);src.start(context.currentTime+delay);voices.add(src);src.onended=()=>{voices.delete(src);src.disconnect();filter?.disconnect();p.disconnect();g.disconnect()};lastEvent={name,position:[...position]};return src;
 }
 async function setEffects(on){effectsOn=on;try{await ready()}catch(e){effectsOn=false;throw e}fade(sfx,effectsOn?.58:0,.035);if(effectsOn){if(!roomSource)roomSource=loop('room',ambience);if(!windSource)windSource=positioned('wind',anchors.wind,.28,0,true);nextTick=context.currentTime+5;nextSteps=context.currentTime+17;corridor.since=null;corridor.handled=false}else{for(const v of voices)v.stop();voices.clear();windSource=null}}
 async function setMusic(on){musicOn=on;try{await ready()}catch(e){musicOn=false;throw e}if(musicOn&&!musicSource)musicSource=loop('ministry',music);fade(music,musicOn?(cycling?.075:.15):0,.45)}
 function play(name,position){positioned(name,position||anchors[name]||[0,1.5,-1.6])}
 function listener(position,forward,up){listenerState=[position,forward,up];if(!context)return;const l=context.listener;if(l.positionX){for(const [key,value] of Object.entries({positionX:position[0],positionY:position[1],positionZ:position[2],forwardX:forward[0],forwardY:forward[1],forwardZ:forward[2],upX:up[0],upY:up[1],upZ:up[2]}))l[key].value=value}else{l.setPosition(...position);l.setOrientation(...forward,...up)}}
 function setVolume(v){volume=Math.max(0,Math.min(1,v));if(master)fade(master,volume,.035)}
 function setCycle(on){cycling=on;if(music)fade(music,musicOn?(cycling?.075:.15):0,.3)}
 function corridorPass(t,reason){
  const direction=Math.random()<.5?1:-1,positions=[];
  for(let i=0;i<6;i++){const position=[6.24,.35,-.8+direction*(i-2.5)*.52];positions.push(position);positioned('step',position,.62*[.60,.82,1,1,.82,.60][i],i*.61)}
  corridor.passes++;corridor.lastPass={time:t,reason,positions};corridor.handled=corridor.near;corridor.nextApproach=t+22;nextSteps=t+35+Math.random()*25;
 }
 setInterval(()=>{if(!effectsOn||!context||context.state!=='running'||document.hidden)return;const t=context.currentTime;
  if(t>nextTick){positioned('tick',anchors.tick,.13);if(Math.random()<.4)positioned('tick',anchors.tick,.075,.21);nextTick=t+11+Math.random()*19}
  const position=listenerState?.[0];corridor.near=!!position&&Math.hypot(position[0]-5.84,position[2]+.8)<2.25;
  if(!corridor.near){corridor.since=null;corridor.handled=false}else if(corridor.since===null)corridor.since=t;
  if(corridor.near&&!corridor.handled&&t-corridor.since>=1.2&&t>=corridor.nextApproach)corridorPass(t,'approach');
  else if(t>nextSteps)corridorPass(t,'passing');
 },500);
 document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend();else if(effectsOn||musicOn)context.resume().catch(()=>{})});
 window.MinistryAudio={setEffects,setMusic,play,listener,setVolume,setCycle,state:()=>({effectsOn,musicOn,volume,cycling,context:context?.state||'unstarted',decoded:[...buffers.keys()],spatial:true,corridor:{...corridor},listener:listenerState,lastEvent,voices:voices.size})};
})();
