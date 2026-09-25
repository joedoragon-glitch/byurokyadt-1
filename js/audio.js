/* Original sampled synthesis, decoded once. Audio starts only after a click. */
(()=>{
 let context,master,sfx,music,ambience,loading,musicSource,roomSource;
 let effectsOn=false,musicOn=false,volume=.65,cycling=false;const buffers=new Map();
 const names=['relay','feed','scan','stamp','bell','room','ministry'];
 function gain(parent,value){const g=context.createGain();g.gain.value=value;g.connect(parent);return g}
 async function ready(){
  if(!context){context=new(window.AudioContext||window.webkitAudioContext)();const compressor=context.createDynamicsCompressor();compressor.threshold.value=-12;compressor.ratio.value=3;compressor.connect(context.destination);master=gain(compressor,volume);sfx=gain(master,0);music=gain(master,0);ambience=gain(sfx,.055);}
  await context.resume();
  loading??=Promise.all(names.map(async name=>{const r=await fetch('./assets/audio/'+name+'.ogg');if(!r.ok)throw Error('Audio asset '+name);buffers.set(name,await context.decodeAudioData(await r.arrayBuffer()))})).catch(e=>{loading=null;throw e});
  await loading;return context;
 }
 function fade(g,value,d=.15){const t=context.currentTime;g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(value,t,d)}
 function loop(name,bus){const src=context.createBufferSource();src.buffer=buffers.get(name);src.loop=true;src.connect(bus);src.start();return src}
 async function setEffects(on){effectsOn=on;try{await ready()}catch(e){effectsOn=false;throw e}fade(sfx,effectsOn?.58:0,.035);if(effectsOn&&!roomSource)roomSource=loop('room',ambience);}
 async function setMusic(on){musicOn=on;try{await ready()}catch(e){musicOn=false;throw e}if(musicOn&&!musicSource)musicSource=loop('ministry',music);fade(music,musicOn?(cycling?.075:.15):0,.45)}
 function play(name){if(!effectsOn||!context||!buffers.has(name))return;const src=context.createBufferSource();src.buffer=buffers.get(name);src.connect(sfx);src.start()}
 function setVolume(v){volume=Math.max(0,Math.min(1,v));if(master)fade(master,volume,.035)}
 function setCycle(on){cycling=on;if(music)fade(music,musicOn?(cycling?.075:.15):0,.3)}
 document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend();else if(effectsOn||musicOn)context.resume().catch(()=>{})});
 window.MinistryAudio={setEffects,setMusic,play,setVolume,setCycle,state:()=>({effectsOn,musicOn,volume,cycling,context:context?.state||'unstarted',decoded:[...buffers.keys()]})};
})();
