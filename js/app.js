(()=>{
if(!window.THREE){window.BYUR_LOAD?.fatal('ОШИБКА: THREE ИЄT.');return}
const T=THREE;window.BYUR_LOAD?.stage('engine_ready');
const mobile=matchMedia('(max-width:800px)').matches||/Android|iPhone|iPad/i.test(navigator.userAgent);
const root=document.getElementById('app'),hint=document.getElementById('hint'),fileInput=document.getElementById('file');

const scene=new T.Scene();scene.background=new T.Color(0x171711);scene.fog=new T.FogExp2(0x171711,.018);
const camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.05,80);camera.position.set(0,1.68,2.7);camera.rotation.order='YXZ';
let yaw=0,pitch=.025;camera.rotation.set(pitch,yaw,0);

let renderer;
try{
 renderer=new T.WebGLRenderer({antialias:!mobile,powerPreference:mobile?'default':'high-performance',failIfMajorPerformanceCaveat:false});
}catch(e){window.BYUR_LOAD?.fatal('ОШИБКА WEBGL: '+e.message);return}
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.6));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=mobile?T.PCFShadowMap:T.PCFSoftShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;root.appendChild(renderer.domElement);
window.BYUR_LOAD?.stage('renderer_ready');

const M=(c,metal=.15,rough=.72,em=0x000000,ei=0)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive:em,emissiveIntensity:ei});
const steel=M(0x77786c,.44,.6),steel2=M(0xa1a193,.58,.42),dark=M(0x31322d,.50,.62),black=M(0x171713,.30,.65),red=M(0xa72c22,.50,.42),paper=M(0xdccfac,.02,.9),concrete=M(0x69675e,.02,.96),wood=M(0x4a3324,.08,.82);
const interactives=[];
function box(w,h,d,mat,x,y,z,p=scene){const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
function cyl(r,h,mat,x,y,z,rx=0,ry=0,rz=0,p=scene,seg=32){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,seg),mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=o.receiveShadow=true;p.add(o);return o}
function plane(w,h,mat,x,y,z,rx=0,ry=0,rz=0,p=scene){const o=new T.Mesh(new T.PlaneGeometry(w,h),mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.receiveShadow=true;p.add(o);return o}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
function sign(lines,bg='#888777',fg='#171713',border='#3b3a33',W=900,H=400){
 return new T.MeshStandardMaterial({map:canvasTex(W,H,(g,w,h)=>{
  g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=border;g.lineWidth=12;g.strokeRect(8,8,w-16,h-16);
  g.textAlign='center';g.textBaseline='middle';g.fillStyle=fg;
  let y=h/(lines.length+1);
  lines.forEach((s,i)=>{let size=s.size||52;while(size>20){g.font='700 '+size+'px Arial';if(g.measureText(s.text).width<w-80)break;size-=2}g.fillText(s.text,w/2,y*(i+1))})
 }),roughness:.82,metalness:.04});
}
window.BYUR_LOAD?.stage('materials_ready');

/* ROOM — PARTY-COMPLIANT LATE-SOVIET BRUTALIST RENOVATION */
const concreteTex=canvasTex(512,512,(g,w,h)=>{
 g.fillStyle='#8b897f';g.fillRect(0,0,w,h);
 const img=g.getImageData(0,0,w,h),d=img.data;
 for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*18;d[i]=Math.max(0,Math.min(255,d[i]+n));d[i+1]=Math.max(0,Math.min(255,d[i+1]+n));d[i+2]=Math.max(0,Math.min(255,d[i+2]+n))}
 g.putImageData(img,0,0);
 g.globalAlpha=.18;g.strokeStyle='#4f4e49';g.lineWidth=1;
 for(let i=0;i<75;i++){const x=Math.random()*w,y=Math.random()*h,l=12+Math.random()*80;g.beginPath();g.moveTo(x,y);g.lineTo(x+l,y+(Math.random()-.5)*4);g.stroke()}
});
concreteTex.wrapS=concreteTex.wrapT=T.RepeatWrapping;concreteTex.repeat.set(3.2,2.2);
const wallConcrete=new T.MeshStandardMaterial({map:concreteTex,color:0xb3b0a5,metalness:.01,roughness:.97});

const floorTex=canvasTex(512,512,(g,w,h)=>{
 g.fillStyle='#393a36';g.fillRect(0,0,w,h);
 for(let y=0;y<h;y+=64)for(let x=0;x<w;x+=64){const v=48+Math.floor(Math.random()*18);g.fillStyle='rgb('+v+','+(v-1)+','+(v-4)+')';g.fillRect(x+1,y+1,62,62)}
 g.strokeStyle='rgba(205,202,190,.12)';g.lineWidth=1;
 for(let i=0;i<=512;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,512);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(512,i);g.stroke()}
});
floorTex.wrapS=floorTex.wrapT=T.RepeatWrapping;floorTex.repeat.set(5,6);
const institutionalFloor=new T.MeshStandardMaterial({map:floorTex,metalness:.04,roughness:.88});

box(12,.18,14,institutionalFloor,0,-.09,0);
box(12,6,.2,wallConcrete,0,3,-6.8);
box(.2,6,14,wallConcrete,-6,3,0);
box(.2,6,14,wallConcrete,6,3,0);
box(12,.2,14,M(0x6d6c66,.03,.94),0,6,0);

/* recessed concrete panel seams — BEHIND propaganda, never in front */
const seam=M(0x55554f,.02,.96);
for(const x of [-5.35,-2.75,0,2.75,5.35])box(.035,5.55,.025,seam,x,3,-6.675);
for(const y of [1.35,3.02,4.68])box(11.55,.035,.025,seam,0,y,-6.675);

/* form-tie marks give concrete believable brutalist scale */
const tieMat=M(0x57564f,.02,.92);
for(const x of [-5.0,-3.35,-1.70,0,1.70,3.35,5.0]){
 for(const y of [1.70,3.58,5.22]){
  cyl(.038,.018,tieMat,x,y,-6.65,Math.PI/2,0,0,scene,18);
 }
}

/* party wall: large, unobstructed framed propaganda */
function posterTexture(key){
 const img=window.BYUR_POSTERS?.[key];
 if(!img?.naturalWidth)throw new Error('ПЛАКАТ НЕ ПРОШЁЛ ПРОВЕРКУ: '+key);
 const tex=new T.Texture(img);tex.colorSpace=T.SRGBColorSpace;
 tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());tex.needsUpdate=true;return tex;
}
const brezh=posterTexture('brezhnev'),plan=posterTexture('plan');
const glassMat=new T.MeshStandardMaterial({color:0xf6f2df,transparent:true,opacity:.07,roughness:.10,metalness:0});

function framed(tex,x,y,w=2.55,h=3.42){
 box(w+.18,h+.18,.075,dark,x,y,-6.61);
 box(w+.09,h+.09,.052,steel2,x,y,-6.565);
 plane(w,h,new T.MeshStandardMaterial({map:tex,roughness:.88,metalness:0,emissive:0xffffff,emissiveMap:tex,emissiveIntensity:.16}),x,y,-6.525);
 // Matte poster paper avoids reflections obscuring the printed artwork.
}
framed(brezh,-4.15,3.45,2.60,3.48);
framed(plan,4.15,3.45,2.60,3.48);

/* central red banner and ministry plaque */
plane(4.75,.72,sign([{text:'РЕШЕНИЯ XXVI СЪЕЗДА — В ЖИЗНЬ',size:48}],'#8d221b','#f1dfb1','#d1ba7d',1400,260),0,5.18,-6.52);
const ministry=sign([{text:'МИНИСТЕРСТВО НЕНУЖНЫХ ПРОЦЕДУР',size:37},{text:'ОПЕРАТОРСКАЯ № 3 • СКБ № 41',size:30}],'#b6ab83','#1b1913','#3c3729',1100,330);
plane(3.20,.92,ministry,0,1.56,-6.52);

/* ceiling coffers: heavy concrete mass kept ABOVE sightline */
const ceilingBeam=M(0x555650,.03,.94);
for(const z of [-4.8,-1.7,1.4,4.5])box(11.7,.28,.34,ceilingBeam,0,5.72,z);
for(const x of [-4.3,0,4.3])box(.30,.24,13.1,ceilingBeam,x,5.75,0);

/* cold fluorescent luminaires nested between coffers */
scene.add(new T.HemisphereLight(0xd6e0df,0x30312a,.95));
const key=new T.DirectionalLight(0xf0f2eb,1.05);key.position.set(-2,6,4);key.castShadow=true;key.shadow.bias=-.0002;key.shadow.normalBias=.015;key.shadow.mapSize.set(mobile?1024:1536,mobile?1024:1536);scene.add(key);
for(const x of [-3.1,0,3.1]){
 box(2.18,.09,.40,steel2,x,5.54,-.15);
 const tubeMat=M(0xf3f5ec,.02,.32,0xeef3ef,1.8);
 box(1.90,.035,.18,tubeMat,x,5.47,-.15);
 const l=new T.PointLight(0xe8edf0,16,6.8,2.1);l.position.set(x,5.25,-.15);scene.add(l);
}

/* institutional furniture: metal archives, radiator, telephone, side desk */
for(let col=0;col<2;col++){
 const x=-4.65+col*.79;box(.75,1.48,.62,M(0x657168,.32,.74),x,.74,-5.55);
 for(let row=0;row<3;row++){
  const y=.28+row*.46;box(.68,.41,.035,steel,x,y,-5.21);
  box(.23,.035,.06,dark,x,y+.02,-5.17);
  plane(.25,.10,sign([{text:'ДЕЛО '+(row+col*3+1),size:32}],'#c2b799','#34372c',null,400,160),x,y+.13,-5.184);
 }
}
box(1.7,.08,.65,wood,3.9,.86,-5.20);
for(const x of [3.15,4.65])for(const z of [-5.43,-4.97])box(.07,.84,.07,dark,x,.42,z);
const phoneRed=M(0x86291f,.18,.36);
box(.43,.12,.32,phoneRed,4.18,.96,-5.2);
cyl(.105,.035,black,4.18,1.04,-5.14,0,0,0,scene,28);
for(const x of [3.96,4.4])box(.09,.13,.14,phoneRed,x,1.08,-5.29);
box(.53,.08,.12,phoneRed,4.18,1.15,-5.29);
for(let i=0;i<4;i++)box(.32,.035,.42,paper,3.48,.935+i*.036,-5.15);
// Socket and skirting sit low; nothing crosses the poster faces.
box(11.7,.11,.055,dark,0,.07,-6.66);
plane(.26,.35,sign([{text:'220 В',size:40}],'#a8a898','#20251f',null,300,400),-1.75,.47,-6.535);


/* long steel radiator low on back wall, clear of posters */
const rad=M(0x77796f,.38,.67);
for(let i=0;i<11;i++)box(.12,.70,.11,rad,-.60+i*.12,.62,-6.48);
box(1.50,.06,.14,dark,0,.27,-6.48);box(1.50,.06,.14,dark,0,.97,-6.48);

/* Working wall clock: dial has real hour positions. */
const clockMap=canvasTex(512,512,(g,w,h)=>{
 g.fillStyle='#dbd7c6';g.fillRect(0,0,w,h);g.translate(w/2,h/2);
 g.strokeStyle='#272e2a';g.lineWidth=8;g.beginPath();g.arc(0,0,242,0,Math.PI*2);g.stroke();
 for(let i=0;i<60;i++){g.save();g.rotate(i*Math.PI/30);g.fillStyle='#343d35';g.fillRect(-2,-224,i%5===0?5:2,i%5===0?22:9);g.restore()}
 g.fillStyle='#28342d';g.font='bold 41px Arial';g.textAlign='center';g.textBaseline='middle';
 for(let i=1;i<=12;i++){const a=i*Math.PI/6;g.fillText(i,Math.sin(a)*175,-Math.cos(a)*175)}
});
cyl(.4,.07,dark,0,3.83,-6.60,Math.PI/2,0,0,scene,48);
plane(.75,.75,new T.MeshStandardMaterial({map:clockMap,roughness:.9}),0,3.83,-6.549);
const clockHands=[];
for(const len of [.17,.27]){const pivot=new T.Group();pivot.position.set(0,3.83,-6.51);scene.add(pivot);box(.014,len,.014,dark,0,len/2,0,pivot);clockHands.push(pivot)}
function updateClock(){const d=new Date();clockHands[0].rotation.z=-(d.getHours()%12+d.getMinutes()/60)*Math.PI/6;clockHands[1].rotation.z=-(d.getMinutes()+d.getSeconds()/60)*Math.PI/30}
updateClock();setInterval(updateClock,1000);

window.BYUR_LOAD?.stage('room_ready');

/* WORKBENCH */
box(2.15,.14,1.20,wood,0,.82,-1.58);box(2.02,.10,1.08,steel2,0,.90,-1.58);
for(const x of [-.92,.92])for(const z of [-2.0,-1.2])box(.12,.80,.12,dark,x,.40,z);
box(1.75,.50,.64,dark,0,.55,-1.64);

/* MACHINE desk scale */
const machine=new T.Group();machine.position.set(0,.88,-1.60);machine.scale.set(.285,.285,.285);scene.add(machine);
box(4.6,4.55,1.9,steel,0,2.35,0,machine);box(4.45,.14,1.98,dark,0,.13,0,machine);
box(.14,4.2,1.95,dark,-2.22,2.32,0,machine);box(.14,4.2,1.95,dark,2.22,2.32,0,machine);
for(const y of [.62,1.48,2.4,3.62,4.45])box(4.4,.024,.035,dark,0,y,.965,machine);

/* CRT */
box(2.52,1.82,.16,dark,-.58,3.5,1.0,machine);box(2.42,1.72,.145,black,-.58,3.5,1.035,machine);
const crtC=document.createElement('canvas');crtC.width=1024;crtC.height=700;const cg=crtC.getContext('2d');const crtT=new T.CanvasTexture(crtC);crtT.colorSpace=T.SRGBColorSpace;
plane(2.12,1.44,new T.MeshBasicMaterial({map:crtT,toneMapped:false}),-.58,3.5,1.11,0,0,0,machine);
function crt(lines){cg.fillStyle='#07170c';cg.fillRect(0,0,1024,700);cg.strokeStyle='rgba(135,255,150,.05)';for(let y=0;y<700;y+=8){cg.beginPath();cg.moveTo(0,y);cg.lineTo(1024,y);cg.stroke()}cg.fillStyle='#8cff9d';cg.shadowColor='#6aff83';cg.shadowBlur=12;cg.font='700 34px Courier New';let y=52;for(const line of lines){if(line===''){y+=24;continue}let s=line,size=34;while(size>22){cg.font='700 '+size+'px Courier New';if(cg.measureText(s).width<900)break;size-=2}cg.fillText(s,48,y);y+=45}crtT.needsUpdate=true}
crt(['БЮРОКЯДТ-1','ВНИМАНИЕ.','СИСТЕМА ГОТОВА.','','COMЯДDЄ, ЇИSЄЯT ДОКУМЕНТ.']);

/* labels */
plane(1.53,2.12,sign([{text:'☭  СССР',size:78},{text:'СКБ № 41',size:42},{text:'БЮРОКЯДТ-1',size:80},{text:'АППАРАТ ПОДТВЕРЖДЕНИЯ ДОКУМЕНТА',size:34}],'#858577','#141410','#35362f',1000,1250),1.40,3.27,1.075,0,0,0,machine);

/* lamps */
const lampMats=[M(0x54ff66,.05,.28,0x54ff66,1.5),M(0xffad35,.05,.28),M(0xc4271f,.05,.28)],lamps=[];
box(.72,1.46,.105,dark,-1.9,3.63,1.02,machine);
['СЕТЬ','РАБОТА','ОШИБКА'].forEach((name,i)=>{const y=4.07-i*.42;cyl(.13,.08,black,-2.04,y,1.12,Math.PI/2,0,0,machine);lamps.push(cyl(.095,.09,lampMats[i],-2.04,y,1.17,Math.PI/2,0,0,machine));plane(.39,.11,sign([{text:name,size:40}],'#898a7d','#171712',null,640,180),-1.665,y,1.08,0,0,0,machine)});

/* gauges */
function gauge(x,title){box(1.24,.82,.13,dark,x,2.18,1.04,machine);plane(1.06,.56,sign([{text:'0      50      100',size:25}],'#d7c69e','#2b2921',null,600,300),x,2.24,1.115,0,0,0,machine);const piv=new T.Group();piv.position.set(x,2.07,1.18);machine.add(piv);box(.47,.018,.018,M(0xb22b22,.1,.45),.235,0,0,piv);piv.rotation.z=T.MathUtils.degToRad(28);plane(1.08,.16,sign([{text:title,size:25}],'#282925','#d9cfb0','#11120f',760,210),x,1.83,1.12,0,0,0,machine);return piv}
const g1=gauge(-.55,'СТЕПЕНЬ ДОКУМЕНТНОСТИ'),g2=gauge(.86,'БЮРОКРАТИЧЕСКАЯ УВЕРЕННОСТЬ');

/* reset knob */
box(.72,.98,.105,dark,-1.9,2.43,1.02,machine);const resetKnob=cyl(.18,.12,black,-1.9,2.37,1.16,Math.PI/2,0,0,machine);resetKnob.userData.action='reset';interactives.push(resetKnob);plane(.49,.30,sign([{text:'РЕЖИМ',size:44},{text:'СБРОС',size:34}],'#898a7d','#171712',null,560,300),-1.9,2.77,1.08,0,0,0,machine);

/* confirm button */
box(1.23,.82,.12,steel2,1.72,2.18,1.03,machine);cyl(.31,.12,dark,1.72,2.15,1.16,Math.PI/2,0,0,machine);const cap=cyl(.245,.17,red,1.72,2.15,1.25,Math.PI/2,0,0,machine);cap.userData.action='confirm';interactives.push(cap);plane(1.02,.15,sign([{text:'ПОДТВЕРДИТЬ',size:37}],'#9e2d23','#f1deb4','#5d1712',800,190),1.72,2.58,1.1,0,0,0,machine);

/* INPUT */
const input=new T.Group();input.position.set(-.82,.72,1.02);machine.add(input);box(2.35,.18,.98,dark,0,.03,.10,input);const tray=box(2.18,.08,1.25,steel2,0,.14,.25,input);tray.rotation.x=T.MathUtils.degToRad(-8);tray.userData.action='load';interactives.push(tray);
const inPaper=box(1.65,.024,1.02,paper,0,.23,.38,input);inPaper.rotation.x=T.MathUtils.degToRad(-8);inPaper.visible=false;
const pcan=document.createElement('canvas');pcan.width=900;pcan.height=560;const pg=pcan.getContext('2d');const ptex=new T.CanvasTexture(pcan);ptex.colorSpace=T.SRGBColorSpace;inPaper.material=new T.MeshStandardMaterial({map:ptex,roughness:.9});
function drawInput(name){pg.fillStyle='#ded3b3';pg.fillRect(0,0,900,560);pg.strokeStyle='#7b705c';pg.strokeRect(25,25,850,510);pg.fillStyle='#38342c';pg.font='700 48px Courier New';pg.fillText('ФОРМА 27-Б',45,70);let n=name.toUpperCase().slice(0,28);pg.font='700 30px Courier New';pg.fillText(n,45,145);pg.font='27px Courier New';pg.fillText('ПРЕДСТАВЛЕН ДЛЯ ГОСУДАРСТВЕННОЙ ПРОВЕРКИ',45,215);pg.strokeStyle='#99271f';pg.lineWidth=7;pg.strokeRect(55,325,790,135);pg.fillStyle='#99271f';pg.font='700 34px Courier New';pg.fillText('ОЖИДАЕТ ПРОВЕРКИ',170,410);ptex.needsUpdate=true}
const rollers=[cyl(.13,1.96,black,0,.33,-.22,0,0,Math.PI/2,input),cyl(.13,1.96,black,0,.33,.22,0,0,Math.PI/2,input)];
const rail=box(1.9,.055,.055,steel2,0,.55,-.03,input);const scan=new T.Group();scan.position.set(-.82,.55,-.03);input.add(scan);box(.18,.11,.18,steel2,0,0,0,scan);const lens=box(.12,.028,.12,M(0xffdc7c,.05,.25,0xffc95a,2.1),0,-.065,0,scan);

/* OUTPUT */
const output=new T.Group();output.position.set(1.1,.72,1.03);machine.add(output);box(1.55,.18,1.0,dark,0,.02,.11,output);const outTray=box(1.42,.07,1.30,steel2,0,.12,.28,output);outTray.rotation.x=T.MathUtils.degToRad(-8);
box(.82,.17,.55,dark,0,.82,-.15,output);const stampLink=new T.Group();stampLink.position.set(0,.56,-.15);output.add(stampLink);box(.16,.50,.16,steel2,0,0,0,stampLink);const stamp=box(.55,.18,.42,red,0,.30,-.15,output);
const outRollers=[cyl(.095,1.10,black,0,.26,-.10,0,0,Math.PI/2,output),cyl(.095,1.10,black,0,.26,.18,0,0,Math.PI/2,output)];
const outPaper=box(1.12,.022,.92,paper,0,.20,-.04,output);outPaper.rotation.x=T.MathUtils.degToRad(-8);outPaper.visible=false;
const ocan=document.createElement('canvas');ocan.width=850;ocan.height=620;const og=ocan.getContext('2d');const otex=new T.CanvasTexture(ocan);otex.colorSpace=T.SRGBColorSpace;outPaper.material=new T.MeshStandardMaterial({map:otex,roughness:.9});
function drawOut(name,serial){og.fillStyle='#ded3b3';og.fillRect(0,0,850,620);og.strokeStyle='#77705e';og.strokeRect(25,22,800,570);og.fillStyle='#39342b';og.font='700 28px Courier New';og.fillText('МИНИСТЕРСТВО НЕНУЖНЫХ ПРОЦЕДУР',35,58);og.font='25px Courier New';og.fillText('СПРАВКА № '+serial,35,108);og.font='700 24px Courier New';og.fillText('ДОКУМЕНТ: '+name.toUpperCase().slice(0,24),35,190);og.fillText('ПРОВЕРКА: ЗАВЕРШЕНА',35,238);og.strokeStyle='#9d281f';og.lineWidth=8;og.strokeRect(60,325,730,150);og.fillStyle='#9d281f';og.font='700 36px Courier New';og.fillText('ДОКУМЕНТ ЯВЛЯЕТСЯ',165,390);og.fillText('ДОКУМЕНТОМ',270,438);otex.needsUpdate=true}

window.BYUR_LOAD?.stage('machine_ready');

/* Mechanics and operator controls. Files remain entirely local. */
let current=null,busy=false,certificateReady=false,serial='';
const ui=Object.fromEntries(['loadDoc','runDoc','resetDoc','receipt','certificate','certificateCanvas','cycleCount','sound','roomView','deskView'].map(id=>[id,document.getElementById(id)]));
let issued=0;try{issued=Number(localStorage.getItem('byur-issued')||0)||0}catch{}
function updateCount(){ui.cycleCount.textContent='ВЫДАНО: '+String(issued).padStart(3,'0')}updateCount();
function controls(){ui.loadDoc.disabled=ui.runDoc.disabled=ui.resetDoc.disabled=busy;ui.receipt.disabled=!certificateReady||busy}
function status(text){hint.textContent=text}
let audioContext=null,soundOn=false;
function sound(freq,duration=.08,type='square',volume=.025){
 if(!soundOn)return;
 try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),gain=audioContext.createGain(),t=audioContext.currentTime;o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(25,freq*.6),t+duration);gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(gain);gain.connect(audioContext.destination);o.start();o.stop(t+duration)}catch{}
}
ui.sound.onclick=()=>{soundOn=!soundOn;ui.sound.textContent='ЗВУК: '+(soundOn?'ВКЛ':'ВЫКЛ');ui.sound.setAttribute('aria-pressed',String(soundOn));sound(620)};
const st={cap:cap.position.z,inZ:inPaper.position.z,outZ:outPaper.position.z,stampY:stamp.position.y,linkY:stampLink.position.y,scanX:scan.position.x};
const wait=ms=>new Promise(r=>setTimeout(r,ms)),smooth=t=>t*t*(3-2*t);
function tween(ms,fn){return new Promise(res=>{const s=performance.now();function step(n){const t=Math.min(1,(n-s)/ms);fn(smooth(t));t<1?requestAnimationFrame(step):res()}requestAnimationFrame(step)})}
function setLamp(i,on){const m=lamps[i].material;m.emissive.setHex(on?[0x54ff66,0xffad35,0xd12620][i]:0);m.emissiveIntensity=on?2:0}
function resetVisual(){setLamp(1,false);setLamp(2,false);cap.position.z=st.cap;scan.position.x=st.scanX;stamp.position.y=st.stampY;stampLink.position.y=st.linkY;inPaper.position.z=st.inZ;outPaper.position.z=st.outZ;outPaper.visible=false;g1.rotation.z=g2.rotation.z=T.MathUtils.degToRad(28)}
async function gauges(a,b){const s1=g1.rotation.z,s2=g2.rotation.z,e1=T.MathUtils.degToRad(28-56*a),e2=T.MathUtils.degToRad(28-56*b);await tween(700,t=>{g1.rotation.z=s1+(e1-s1)*t;g2.rotation.z=s2+(e2-s2)*t})}
function createCertificate(name,number){
 const c=ui.certificateCanvas,g=c.getContext('2d');g.fillStyle='#ede4c9';g.fillRect(0,0,c.width,c.height);
 g.strokeStyle='#383c31';g.lineWidth=3;g.strokeRect(54,54,1172,1652);g.strokeRect(66,66,1148,1628);
 g.textAlign='center';g.fillStyle='#98382c';g.font='bold 76px serif';g.fillText('★',640,185);
 g.fillStyle='#30392f';g.font='bold 28px monospace';g.fillText('МИНИСТЕРСТВО НЕНУЖНЫХ ПРОЦЕДУР',640,255);
 g.font='22px monospace';g.fillText('СПЕЦИАЛЬНОЕ КОНСТРУКТОРСКОЕ БЮРО № 41',640,299);
 g.font='bold 92px serif';g.fillText('СПРАВКА',640,470);g.font='28px monospace';g.fillText('№ 27-Б / '+number+'     •     1982',640,534);
 g.textAlign='left';g.font='25px monospace';g.fillText('ПРЕДСТАВЛЕННЫЙ ДОКУМЕНТ',130,675);
 let size=38;while(size>16){g.font='bold '+size+'px monospace';if(g.measureText(name).width<1000)break;size--}
 const clipped=name.length>100?name.slice(0,97)+'…':name;g.fillText(clipped,130,742,1000);
 g.font='26px monospace';g.fillText('АНАЛИЗ                       ПРОЙДЕН',130,875);g.fillText('ПРОВЕРКА                     ЗАВЕРШЕНА',130,935);g.fillText('БЮРОКРАТИЧЕСКАЯ УВЕРЕННОСТЬ   100 %',130,995);
 g.save();g.translate(640,1208);g.rotate(-.055);g.strokeStyle='#993c30';g.lineWidth=9;g.strokeRect(-465,-98,930,196);g.strokeRect(-451,-84,902,168);g.fillStyle='#993c30';g.textAlign='center';g.font='bold 43px monospace';g.fillText('ДОКУМЕНТ ЯВЛЯЕТСЯ',0,-13);g.font='bold 59px monospace';g.fillText('ДОКУМЕНТОМ',0,61);g.restore();
 g.font='25px monospace';g.fillStyle='#30392f';g.fillText('ОПЕРАТОРСКАЯ № 3',130,1480);g.fillText('ПЕЧАТЬ: БЮРОКЯДТ-1',130,1530);
 g.font='20px monospace';g.textAlign='center';g.fillText('ПОВТОРНАЯ ПРОВЕРКА ПОДТВЕРДИТ ПРЕДЫДУЩУЮ ПРОВЕРКУ.',640,1620);
}
function showCertificate(){if(certificateReady&&!busy){ui.certificate.showModal();sound(350,.08,'sine')}}
ui.receipt.onclick=showCertificate;outPaper.userData.action='receipt';interactives.push(outPaper);
document.getElementById('closeReceipt').onclick=()=>ui.certificate.close();
document.getElementById('downloadReceipt').onclick=()=>{ui.certificateCanvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='SPRAVKA-27B-'+serial+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')};
async function run(){
 if(busy)return;
 if(!current){setLamp(2,true);crt(['ОШИБКА.','','ДОКУМЕНТ ИЄT.']);status('ОШИБКА. First provide ДОКУМЕНТ, товаЯish.');sound(90,.22);return}
 busy=true;certificateReady=false;resetVisual();controls();setLamp(1,true);sound(160,.09);
 try{
 await tween(110,t=>cap.position.z=st.cap-.10*t);await tween(140,t=>cap.position.z=st.cap-.10*(1-t));
 status('АНАЛИЗ · Machine consider existence of ДОКУМЕНТ.');crt(['АНАЛИЗ...','','ОБРАБОТКА: 20%']);sound(76,1.7,'sawtooth',.018);
 await Promise.all([tween(1700,t=>{inPaper.position.z=st.inZ+(-.58-st.inZ)*t;rollers[0].rotation.x+=.22;rollers[1].rotation.x-=.22}),gauges(.28,.34)]);
 crt(['АНАЛИЗ...','','СКАНЕР WORKЇИG.']);sound(240,1.3,'triangle',.025);await tween(1350,t=>{scan.position.x=-.82+1.64*t;lens.material.emissiveIntensity=2.2+.5*Math.sin(t*18)});await tween(550,t=>scan.position.x=.82-1.64*t);
 status('ПРОВЕРКА · Second department confirm first department.');crt(['ПРОВЕРКА...','','ОБРАБОТКА: 68%']);await gauges(.66,.72);await wait(500);
 status('ПЕЧАТЬ · State apply physical certainty.');crt(['ПЕЧАТЬ...','','OFFЇCЇДL ПЕЧАТЬ.']);serial=String(Math.floor(100000+Math.random()*900000));drawOut(current.name,serial);
 await tween(330,t=>{stamp.position.y=st.stampY+(.02-st.stampY)*t;stampLink.position.y=st.linkY-.20*t});sound(65,.19,'sawtooth',.11);await wait(120);await tween(420,t=>{stamp.position.y=.02+(st.stampY-.02)*t;stampLink.position.y=st.linkY-.20*(1-t)});
 outPaper.visible=true;outPaper.position.z=-.55;sound(85,1.3,'sawtooth',.017);await tween(1300,t=>{outPaper.position.z=-.55+.95*t;outRollers[0].rotation.x+=.20;outRollers[1].rotation.x-=.20});await gauges(1,1);setLamp(1,false);
 crt(['ПРОВЕРКА ЗАВЕРШЕНА.','','СТАТУС: ХОРОШО.','','ДОКУМЕНТ ЯВЛЯЕТСЯ ДОКУМЕНТОМ.']);
 createCertificate(current.name,serial);certificateReady=true;issued++;try{localStorage.setItem('byur-issued',String(issued))}catch{}updateCount();
 status('ГОТОВО · СПРАВКА ready. Collect approved certainty.');sound(780,.18,'sine');
 }catch(e){setLamp(2,true);status('ОШИБКА · Temporary deviation. СБРОС and retry.');console.error(e)}
 finally{busy=false;controls()}
}
function reset(){if(busy)return;current=null;certificateReady=false;fileInput.value='';inPaper.visible=false;resetVisual();controls();crt(['БЮРОКЯДТ-1','ВНИМАНИЕ.','СИСТЕМА ГОТОВА.']);status('COMЯДDЄ, CLICK INPUT ЛОТОК.');sound(120)}
function loadDocument(){if(!busy)fileInput.click()}
ui.loadDoc.onclick=loadDocument;ui.runDoc.onclick=run;ui.resetDoc.onclick=reset;
fileInput.onchange=()=>{if(busy||!fileInput.files[0])return;resetVisual();certificateReady=false;current=fileInput.files[0];drawInput(current.name);inPaper.visible=true;inPaper.position.z=st.inZ;crt(['ДОКУМЕНТ ПРИНЯТ.','','PЯЄSS ПОДТВЕРДИТЬ.']);setLamp(2,false);status('ПРИНЯТ · '+current.name+' · PЯЄSS ПРОВЕРКА.');controls();sound(430,.10,'sine')};
let viewMoving=false;
async function setView(desk){if(viewMoving)return;viewMoving=true;const start=camera.position.clone(),end=new T.Vector3(0,desk?1.58:1.68,desk ? .32 : 2.7),sy=yaw,sp=pitch,ep=desk?-.025:.025;await tween(700,t=>{camera.position.lerpVectors(start,end,t);yaw=sy*(1-t);pitch=sp+(ep-sp)*t;camera.rotation.set(pitch,yaw,0)});viewMoving=false}
ui.roomView.onclick=()=>setView(false);ui.deskView.onclick=()=>setView(true);
controls();

/* interaction */
const ray=new T.Raycaster(),mouse=new T.Vector2();renderer.domElement.onclick=e=>{if(dragMoved){dragMoved=false;return}const r=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*2-1;mouse.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(interactives,true);if(!hits.length)return;let o=hits[0].object;while(o&&!o.userData.action)o=o.parent;if(!o)return;if(o.userData.action==='load'&&!busy)fileInput.click();if(o.userData.action==='confirm')run();if(o.userData.action==='reset')reset();if(o.userData.action==='receipt')showCertificate()};

/* look / walk */
let dragging=false,lastX=0,lastY=0,dragMoved=false;renderer.domElement.onmousedown=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY};addEventListener('mouseup',()=>dragging=false);addEventListener('mousemove',e=>{if(!dragging||viewMoving)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)dragMoved=true;yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(.72,pitch-dy*.003));camera.rotation.y=yaw;camera.rotation.x=pitch;lastX=e.clientX;lastY=e.clientY});
const keys={};addEventListener('keydown',e=>{
 if(ui.certificate.open||/INPUT|BUTTON|TEXTAREA/.test(e.target.tagName))return;
 const k=e.key.toLowerCase();keys[k]=true;if(e.repeat)return;
 if(k==='f'){e.preventDefault();loadDocument()}if(k==='r')reset();
 if(k==='enter'){e.preventDefault();run()}if(k==='1')setView(false);if(k==='2')setView(true);
});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{for(const k in keys)keys[k]=false;dragging=false});
function move(dt){if(viewMoving||ui.certificate.open)return;const old=camera.position.clone();const sp=2.4*dt,f=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(keys.w)camera.position.addScaledVector(f,sp);if(keys.s)camera.position.addScaledVector(f,-sp);if(keys.a)camera.position.addScaledVector(r,-sp);if(keys.d)camera.position.addScaledVector(r,sp);camera.position.x=Math.max(-5.4,Math.min(5.4,camera.position.x));camera.position.z=Math.max(-5.9,Math.min(6.2,camera.position.z));if(Math.abs(camera.position.x)<1.3&&camera.position.z>-2.4&&camera.position.z<-.68)camera.position.copy(old)}
document.getElementById('fs').onclick=()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();
renderer.domElement.style.touchAction='none';
let tx=0,ty=0;
renderer.domElement.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;dragMoved=false},{passive:true});
renderer.domElement.addEventListener('touchmove',e=>{if(viewMoving)return;const t=e.touches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)+Math.abs(dy)>2)dragMoved=true;yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(.72,pitch-dy*.003));camera.rotation.set(pitch,yaw,0);tx=t.clientX;ty=t.clientY},{passive:true});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
resetVisual();renderer.render(scene,camera);window.BYUR_LOAD?.stage('first_frame');setTimeout(()=>window.BYUR_LOAD?.complete(),180);
let last=performance.now();(function loop(now){const dt=Math.min(.04,(now-last)/1000);last=now;move(dt);renderer.render(scene,camera);requestAnimationFrame(loop)})(last);
})();