(()=>{
if(!window.THREE){window.BYUR_LOAD?.fatal('ОШИБКА: THREE ИЄT.');return}
const T=THREE;window.BYUR_LOAD?.stage('engine_ready');
const mobile=matchMedia('(max-width:800px)').matches||/Android|iPhone|iPad/i.test(navigator.userAgent);
const root=document.getElementById('app'),hint=document.getElementById('hint'),fileInput=document.getElementById('file');

const scene=new T.Scene();scene.background=new T.Color(0x171711);scene.fog=new T.FogExp2(0x171711,.018);
const camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.05,80);camera.position.set(0,1.68,4.25);camera.rotation.order='YXZ';
let yaw=0,pitch=-.04;camera.rotation.set(pitch,yaw,0);

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

/* ROOM — party-approved brutalism */
box(12,.18,14,M(0x49463f,.04,.93),0,-.09,0);box(12,6,.2,concrete,0,3,-6.8);box(.2,6,14,concrete,-6,3,0);box(.2,6,14,concrete,6,3,0);box(12,.2,14,M(0x44443f,.06,.9),0,6,0);
for(const x of [-4.5,-1.5,1.5,4.5])box(.16,6,.24,dark,x,3,-6.66);
box(10.8,.10,.18,dark,0,1.1,-6.63);box(10.8,.10,.18,dark,0,5.1,-6.63);

const texLoader=new T.TextureLoader();
const brezh=texLoader.load('./assets/brezhnev_1982.svg');brezh.colorSpace=T.SRGBColorSpace;
const plan=texLoader.load('./assets/xi_five_year_plan_1981_1985.svg');plan.colorSpace=T.SRGBColorSpace;
function framed(tex,x){box(2.62,3.18,.08,dark,x,3.55,-6.73);box(2.50,3.06,.05,steel2,x,3.55,-6.70);plane(2.40,2.96,new T.MeshStandardMaterial({map:tex,roughness:.72}),x,3.55,-6.66)}
framed(brezh,-3.95);framed(plan,3.95);
plane(4.8,.72,sign([{text:'РЕШЕНИЯ XXVI СЪЕЗДА — В ЖИЗНЬ',size:48}],'#8d221b','#f1dfb1','#d1ba7d',1400,260),0,5.05,-6.64);

const ministry=sign([{text:'МИНИСТЕРСТВО НЕНУЖНЫХ ПРОЦЕДУР',size:38},{text:'ОПЕРАТОРСКАЯ № 3 • СКБ № 41',size:31}],'#b6ab83','#1b1913','#3c3729',1100,330);
plane(3.15,.92,ministry,0,1.74,-6.64);

/* cold fluorescent office light */
scene.add(new T.HemisphereLight(0xcac7b7,0x24231e,1.25));
const key=new T.DirectionalLight(0xf1f2eb,1.45);key.position.set(-2,6,4);key.castShadow=true;key.shadow.mapSize.set(mobile?1024:1536,mobile?1024:1536);scene.add(key);
for(const x of [-3,0,3]){box(2.25,.09,.48,steel2,x,5.72,-1.0);const l=new T.PointLight(0xe9edf0,21,7.5,2);l.position.set(x,5.45,-1);scene.add(l)}
/* filing bank + clock + phone */
for(let row=0;row<3;row++)for(let col=0;col<4;col++){box(.72,.72,.58,dark,-4.55+col*.78,.46+row*.74,2.85);box(.40,.045,.025,steel2,-4.55+col*.78,.51+row*.74,3.15)}
const clockMat=sign([{text:'12     3',size:24},{text:'9      6',size:24}],'#d9d2bc','#1e1d18','#34342e',500,500);cyl(.35,.07,dark,4.65,4.85,-6.56,Math.PI/2);plane(.57,.57,clockMat,4.65,4.85,-6.51);
box(.95,.08,.42,wood,4.6,1.08,-5.82);box(.42,.23,.30,M(0x8c251d,.35,.55),4.6,1.23,-5.82);
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

/* mechanics */
let current=null,busy=false;const st={cap:cap.position.z,inZ:inPaper.position.z,outZ:outPaper.position.z,stampY:stamp.position.y,linkY:stampLink.position.y,scanX:scan.position.x};
const wait=ms=>new Promise(r=>setTimeout(r,ms)),smooth=t=>t*t*(3-2*t);
function tween(ms,fn){return new Promise(res=>{const s=performance.now();function step(n){const t=Math.min(1,(n-s)/ms);fn(smooth(t));t<1?requestAnimationFrame(step):res()}requestAnimationFrame(step)})}
function setLamp(i,on){const m=lamps[i].material;m.emissive.setHex(on?[0x54ff66,0xffad35,0xd12620][i]:0);m.emissiveIntensity=on?2:0}
function resetVisual(){setLamp(1,false);setLamp(2,false);cap.position.z=st.cap;scan.position.x=st.scanX;stamp.position.y=st.stampY;stampLink.position.y=st.linkY;inPaper.position.z=st.inZ;outPaper.position.z=st.outZ;outPaper.visible=false;g1.rotation.z=g2.rotation.z=T.MathUtils.degToRad(28)}
async function gauges(a,b){const s1=g1.rotation.z,s2=g2.rotation.z,e1=T.MathUtils.degToRad(28-56*a),e2=T.MathUtils.degToRad(28-56*b);await tween(700,t=>{g1.rotation.z=s1+(e1-s1)*t;g2.rotation.z=s2+(e2-s2)*t})}
async function run(){if(busy)return;if(!current){setLamp(2,true);crt(['ОШИБКА.','','ДОКУМЕНТ ИЄT.']);return}busy=true;setLamp(2,false);setLamp(1,true);
 await tween(110,t=>cap.position.z=st.cap-.10*t);await tween(140,t=>cap.position.z=st.cap-.10*(1-t));
 crt(['АНАЛИЗ...','','ОБРАБОТКА: 20%']);await Promise.all([tween(1700,t=>{inPaper.position.z=st.inZ+(-.58-st.inZ)*t;rollers[0].rotation.x+=.22;rollers[1].rotation.x-=.22}),gauges(.28,.34)]);
 crt(['АНАЛИЗ...','','СКАНЕР WORKЇИG.']);await tween(1350,t=>{scan.position.x=-.82+1.64*t;lens.material.emissiveIntensity=2.2+.5*Math.sin(t*18)});await tween(550,t=>scan.position.x=.82-1.64*t);
 crt(['ПРОВЕРКА...','','ОБРАБОТКА: 68%']);await gauges(.66,.72);await wait(500);
 crt(['ПЕЧАТЬ...','','OFFЇCЇДL ПЕЧАТЬ.']);const serial=String(Math.floor(100000+Math.random()*899999));drawOut(current.name,serial);
 await tween(330,t=>{stamp.position.y=st.stampY+(.02-st.stampY)*t;stampLink.position.y=st.linkY-.20*t});await wait(120);await tween(420,t=>{stamp.position.y=.02+(st.stampY-.02)*t;stampLink.position.y=st.linkY-.20*(1-t)});
 outPaper.visible=true;outPaper.position.z=-.55;await tween(1300,t=>{outPaper.position.z=-.55+.95*t;outRollers[0].rotation.x+=.20;outRollers[1].rotation.x-=.20});await gauges(1,1);setLamp(1,false);
 crt(['ПРОВЕРКА ЗАВЕРШЕНА.','','СТАТУС: ХОРОШО.','','ДОКУМЕНТ ЯВЛЯЕТСЯ ДОКУМЕНТОМ.']);hint.textContent='ГОТОВО. СПАСИБО, COMЯДDЄ.';busy=false}
function reset(){if(busy)return;current=null;fileInput.value='';inPaper.visible=false;resetVisual();crt(['БЮРОКЯДТ-1','ВНИМАНИЕ.','СИСТЕМА ГОТОВА.']);hint.textContent='COMЯДDЄ, CLICK INPUT ЛОТОК.'}
fileInput.onchange=()=>{if(!fileInput.files[0])return;current=fileInput.files[0];drawInput(current.name);inPaper.visible=true;inPaper.position.z=st.inZ;crt(['ДОКУМЕНТ ПРИНЯТ.','','PЯЄSS ПОДТВЕРДИТЬ.']);setLamp(2,false)};

/* interaction */
const ray=new T.Raycaster(),mouse=new T.Vector2();renderer.domElement.onclick=e=>{if(dragMoved){dragMoved=false;return}const r=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*2-1;mouse.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(interactives,true);if(!hits.length)return;let o=hits[0].object;while(o&&!o.userData.action)o=o.parent;if(!o)return;if(o.userData.action==='load'&&!busy)fileInput.click();if(o.userData.action==='confirm')run();if(o.userData.action==='reset')reset()};

/* look / walk */
let dragging=false,lastX=0,lastY=0,dragMoved=false;renderer.domElement.onmousedown=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY};addEventListener('mouseup',()=>dragging=false);addEventListener('mousemove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)dragMoved=true;yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(.72,pitch-dy*.003));camera.rotation.y=yaw;camera.rotation.x=pitch;lastX=e.clientX;lastY=e.clientY});
const keys={};addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function move(dt){const sp=2.4*dt,f=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(keys.w)camera.position.addScaledVector(f,sp);if(keys.s)camera.position.addScaledVector(f,-sp);if(keys.a)camera.position.addScaledVector(r,-sp);if(keys.d)camera.position.addScaledVector(r,sp);camera.position.x=Math.max(-5.4,Math.min(5.4,camera.position.x));camera.position.z=Math.max(-5.9,Math.min(6.2,camera.position.z))}
document.getElementById('fs').onclick=()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
resetVisual();renderer.render(scene,camera);window.BYUR_LOAD?.stage('first_frame');setTimeout(()=>window.BYUR_LOAD?.complete(),180);
let last=performance.now();(function loop(now){const dt=Math.min(.04,(now-last)/1000);last=now;move(dt);renderer.render(scene,camera);requestAnimationFrame(loop)})(last);
})();