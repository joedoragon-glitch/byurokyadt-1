(()=>{
if(!window.THREE){window.BYUR_LOAD?.fatal('ЄЯЯOЯ: 3D engine unavailable.');return}
const T=THREE;window.BYUR_LOAD?.stage('engine_ready');
const mobile=matchMedia('(max-width:800px)').matches||/Android|iPhone|iPad/i.test(navigator.userAgent);
const root=document.getElementById('app'),hint=document.getElementById('hint'),fileInput=document.getElementById('file');

const scene=new T.Scene();scene.background=new T.Color(0x232722);scene.fog=new T.FogExp2(0x232722,.020);
const camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.05,80);camera.position.set(0,1.70,2.7);camera.rotation.order='YXZ';
let yaw=0,pitch=.018;camera.rotation.set(pitch,yaw,0);

let renderer;
try{
 renderer=new T.WebGLRenderer({antialias:!mobile,powerPreference:mobile?'default':'high-performance',failIfMajorPerformanceCaveat:false});
}catch(e){window.BYUR_LOAD?.fatal('ЯEИDEЯЄЯ ЄЯЯOЯ: '+e.message);return}
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.6));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=mobile?T.PCFShadowMap:T.PCFSoftShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;root.appendChild(renderer.domElement);
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
scene.add(new T.HemisphereLight(0xc4cfcc,0x3e3428,.74));
const key=new T.DirectionalLight(0xf1efe8,1.10);key.position.set(-3,5,3);key.castShadow=true;key.shadow.bias=-.0002;key.shadow.normalBias=.015;key.shadow.mapSize.set(mobile?1024:1536,mobile?1024:1536);scene.add(key);
for(const x of [-3.1,0,3.1]){
 box(2.18,.09,.40,steel2,x,5.54,-.15);
 const tubeMat=M(0xf3f5ec,.02,.32,0xeef3ef,1.8);
 box(1.90,.035,.18,tubeMat,x,5.47,-.15);
 const l=new T.PointLight(0xffdfb2,10,6.8,2.1);l.position.set(x,5.25,-.15);scene.add(l);
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
const clockFace=new T.Mesh(new T.CircleGeometry(.375,64),new T.MeshStandardMaterial({map:clockMap,roughness:.9}));clockFace.position.set(0,3.83,-6.549);scene.add(clockFace);
const clockHands=[];
for(const len of [.17,.27]){const pivot=new T.Group();pivot.position.set(0,3.83,-6.51);scene.add(pivot);box(.014,len,.014,dark,0,len/2,0,pivot);clockHands.push(pivot)}
function updateClock(){const d=new Date();clockHands[0].rotation.z=-(d.getHours()%12+d.getMinutes()/60)*Math.PI/6;clockHands[1].rotation.z=-(d.getMinutes()+d.getSeconds()/60)*Math.PI/30}
updateClock();setInterval(updateClock,1000);

window.BYUR_LOAD?.stage('room_ready');

/* WORKBENCH */
box(2.62,.12,1.52,wood,0,.86,-1.63);
for(const x of [-1.15,1.15])for(const z of [-2.24,-1.02])box(.12,.80,.12,dark,x,.40,z);
box(.56,.60,1.25,wood,-.92,.53,-1.63);

/* V9 — cabinet geometry measured against the two original illustrations. */
function roundedShape(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function softBox(w,h,d,mat,x,y,z,p=scene,r=.035){
 const b=Math.min(r*.35,d*.24),geo=new T.ExtrudeGeometry(roundedShape(w-2*b,h-2*b,r),{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,steps:1,curveSegments:5});geo.translate(0,0,-d/2+b);
 // A cabinet-size texture scale avoids stretching grain on each small panel.
 const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/2.5+.5,uv.getY(i)/2.5+.5);
 const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;
}
function decal(w,h,lines,x,y,z,p,bg=null,fg='#23251f'){
 const W=Math.ceil(w*360),H=Math.ceil(h*360),tex=canvasTex(W,H,(g)=>{if(bg){g.fillStyle=bg;g.fillRect(0,0,W,H)}g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';lines.forEach((l,i)=>{const text=typeof l==='string'?l:l.text;let size=typeof l==='string'?H/(lines.length*1.65):l.size*360;size=Math.min(size,70);do{g.font='bold '+size+'px Arial Narrow, Arial';if(g.measureText(text).width<W*.93)break;size--}while(size>9);g.fillText(text,W/2,H*(i+.5)/lines.length)})});
 return plane(w,h,new T.MeshStandardMaterial({map:tex,transparent:!bg,roughness:.83,metalness:0,depthWrite:!!bg}),x,y,z,0,0,0,p);
}
const enamelTex=posterTexture('enamel');enamelTex.wrapS=enamelTex.wrapT=T.RepeatWrapping;
const enamel=new T.MeshStandardMaterial({map:enamelTex,color:0xe2eceb,roughness:.64,metalness:.22,bumpMap:enamelTex,bumpScale:.0004});
const edgeMetal=M(0x62665e,.75,.37),chrome=M(0xb8beb8,.82,.3),bakelite=M(0x171b17,.18,.30),meterIvory=M(0xd2bb86,.06,.7);
const machine=new T.Group();machine.position.set(0,.94,-1.60);machine.scale.setScalar(.245);scene.add(machine);
// Upper cabinet; lower case is genuinely hollow so the paper bays have depth.
softBox(4.96,3.25,2.25,enamel,0,3.255,-.04,machine,.13);
softBox(4.98,.24,2.32,edgeMetal,0,.20,-.01,machine,.07);
softBox(.19,1.42,2.25,enamel,-2.38,.99,-.04,machine,.06);softBox(.19,1.42,2.25,enamel,2.38,.99,-.04,machine,.06);
box(4.70,1.38,.12,dark,0,1.02,-1.09,machine);
for(const x of [-2.08,2.08])for(const z of [-.85,.90])softBox(.42,.13,.42,bakelite,x,.065,z,machine,.04);
const screwBatches=new Map(),screwPose=new T.Object3D();
function screw(x,y,z,p=machine){
 let batch=screwBatches.get(p);if(!batch){const heads=new T.InstancedMesh(new T.CylinderGeometry(.036,.036,.024,10),edgeMetal,128),slots=new T.InstancedMesh(new T.BoxGeometry(.039,.007,.004),black,128);heads.count=slots.count=0;heads.castShadow=heads.receiveShadow=true;p.add(heads,slots);batch={heads,slots};screwBatches.set(p,batch);}
 const i=batch.heads.count;screwPose.position.set(x,y,z);screwPose.rotation.set(Math.PI/2,0,0);screwPose.updateMatrix();batch.heads.setMatrixAt(i,screwPose.matrix);
 screwPose.position.z+=.014;screwPose.rotation.set(0,0,(x+y)*1.7);screwPose.updateMatrix();batch.slots.setMatrixAt(i,screwPose.matrix);batch.heads.count=batch.slots.count=i+1;batch.heads.instanceMatrix.needsUpdate=batch.slots.instanceMatrix.needsUpdate=true;
}
function panel(w,h,x,y,z=1.105,mat=enamel){softBox(w,h,.085,mat,x,y,z,machine,.038);for(const sx of [-1,1])for(const sy of [-1,1])screw(x+sx*(w/2-.055),y+sy*(h/2-.055),z+.055);}
panel(.79,1.34,-2.015,4.125);panel(.79,1.65,-2.015,2.59);panel(2.27,2.24,-.45,3.68);panel(1.70,2.24,1.58,3.68);
panel(2.27,1.00,-.45,2.02);panel(1.70,1.00,1.58,2.02);
// Side service panel, louvres, carrying handles and access hardware.
for(const side of [-1,1]){
 const service=softBox(.055,2.20,1.78,enamel,side*2.495,3.35,-.02,machine,.025);
 for(let i=0;i<12;i++){const v=box(.026,.035,1.08,black,side*2.527,3.43+i*.074,-.02,machine);v.rotation.x=.12}
 for(const yy of [1.05,2.35]){box(.14,.14,.22,edgeMetal,side*2.51,yy,.55,machine);box(.14,.14,.22,edgeMetal,side*2.51,yy+.68,.55,machine);cyl(.055,.70,bakelite,side*2.64,yy+.34,.55,0,0,0,machine,16)}
}
// CRT is square, deep-set and softly curved; all characters keep their aspect ratio.
softBox(2.17,2.10,.19,edgeMetal,-.45,3.69,1.19,machine,.11);
softBox(2.00,1.92,.18,bakelite,-.45,3.69,1.29,machine,.15);
const crtC=document.createElement('canvas');crtC.width=900;crtC.height=900;const cg=crtC.getContext('2d');const crtT=new T.CanvasTexture(crtC);crtT.colorSpace=T.SRGBColorSpace;
const screenGeo=new T.PlaneGeometry(1.75,1.68,28,28),sp=screenGeo.attributes.position;
for(let i=0;i<sp.count;i++){const x=sp.getX(i)/.875,y=sp.getY(i)/.84;sp.setZ(i,.045*(1-x*x)*(1-y*y));}screenGeo.computeVertexNormals();
const screen=new T.Mesh(screenGeo,new T.MeshBasicMaterial({map:crtT,toneMapped:false}));screen.position.set(-.45,3.69,1.39);machine.add(screen);
function crt(lines){
 cg.fillStyle='#05110c';cg.fillRect(0,0,900,900);const glow=cg.createRadialGradient(440,400,20,450,450,590);glow.addColorStop(0,'#112e1d');glow.addColorStop(1,'#020805');cg.fillStyle=glow;cg.fillRect(0,0,900,900);
 cg.fillStyle='#9be1ac';cg.shadowColor='#7de3a0';cg.shadowBlur=2;cg.font='bold 58px monospace';cg.fillText('БЮРОКЯДТ-1',78,120);cg.fillStyle='#588768';cg.fillRect(78,155,744,3);
 let y=236;for(const text of lines.filter(x=>x!=='БЮРОКЯДТ-1')){if(!text){y+=32;continue}let size=42;while(size>18){cg.font='bold '+size+'px monospace';if(cg.measureText(text).width<740)break;size--}cg.fillStyle='#95d7a5';cg.fillText(text,78,y);y+=64;}
 cg.shadowBlur=0;cg.fillStyle='#739e80';cg.font='22px monospace';cg.fillText('СКБ № 41   /   ОПЕРАТОР 03',78,811);
 cg.fillStyle='rgba(0,0,0,.16)';for(let y=0;y<900;y+=4)cg.fillRect(0,y,900,1);crtT.needsUpdate=true;
}
crt(['БЮРОКЯДТ-1','ВНИМАНИЕ.','СИСТЕМА ГОТОВА.','','ВСТАВЬТЕ ДОКУМЕНТ.']);
// Ministry plate: print onto the enamel, with a restrained period emblem.
const emblem=canvasTex(600,470,(g)=>{g.translate(300,230);g.strokeStyle='#30342a';g.fillStyle='#30342a';g.lineWidth=7;for(const side of [-1,1]){g.beginPath();g.ellipse(side*40,5,125,165,side*.30,side<0?1.4:-1.4,side<0?4.9:1.9);g.stroke();for(let i=0;i<11;i++){const a=-1.4+i*.245,x=side*(45+120*Math.cos(a)),y=150*Math.sin(a);g.save();g.translate(x,y);g.rotate(side*a);g.beginPath();g.ellipse(0,0,23,7,.5,0,Math.PI*2);g.fill();g.restore();}}g.textAlign='center';g.font='bold 152px serif';g.fillText('☭',0,55);g.font='65px serif';g.fillText('★',0,-147);g.font='bold 36px serif';g.fillText('СССР',0,205)});
plane(.89,.70,new T.MeshStandardMaterial({map:emblem,transparent:true,roughness:.85}),1.58,4.42,1.158,0,0,0,machine);
decal(1.50,.42,['МИНИСТЕРСТВО','НЕНУЖНЫХ ПРОЦЕДУР'],1.58,3.91,1.158,machine);
decal(1.49,.37,['СПЕЦИАЛЬНОЕ','КОНСТРУКТОРСКОЕ БЮРО № 41'],1.58,3.39,1.158,machine);
decal(1.53,.31,['БЮРОКЯДТ-1'],1.58,2.99,1.158,machine);
decal(1.51,.25,['УНИВЕРСАЛЬНЫЙ АППАРАТ','ПОДТВЕРЖДЕНИЯ ДОКУМЕНТА'],1.58,2.70,1.158,machine);
const lampMats=[M(0x4dab43,.08,.19,0x70e254,.85),M(0xba7225,.1,.24),M(0x801b14,.15,.26)],lamps=[];
['СЕТЬ','РАБОТА','ОШИБКА'].forEach((name,i)=>{const y=4.51-i*.38;cyl(.095,.05,bakelite,-2.23,y,1.19,Math.PI/2,0,0,machine);cyl(.080,.035,chrome,-2.23,y,1.222,Math.PI/2,0,0,machine);lamps.push(cyl(.065,.049,lampMats[i],-2.23,y,1.25,Math.PI/2,0,0,machine));decal(.44,.12,[name],-1.915,y,1.161,machine)});
function knob(y,title){decal(.63,.14,[title],-2.015,y+.30,1.162,machine);cyl(.165,.06,chrome,-2.14,y,1.20,Math.PI/2,0,0,machine);const k=cyl(.137,.12,bakelite,-2.14,y,1.28,Math.PI/2,0,0,machine,24);const grip=softBox(.07,.24,.05,bakelite,-2.14,y,1.36,machine,.014);grip.rotation.z=-.55;const mark=box(.02,.055,.009,meterIvory,-2.095,y+.082,1.389,machine);mark.rotation.z=-.55;return k}
const resetKnob=knob(2.91,'РЕЖИМ');resetKnob.userData.action='reset';interactives.push(resetKnob);
decal(.29,.28,['АВТО','РУЧН.','СБРОС'],-1.78,2.91,1.162,machine);
knob(2.10,'СКОРОСТЬ');decal(.29,.27,['ТИХО','НОРМА','ТЩАТ.'],-1.78,2.10,1.162,machine);
function gauge(x,lines){
 softBox(1.03,.82,.105,bakelite,x,2.02,1.22,machine,.035);
 const tex=canvasTex(620,360,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#bbaa80');gr.addColorStop(1,'#e5d5a9');g.fillStyle=gr;g.fillRect(0,0,w,h);g.strokeStyle='#494335';g.fillStyle='#3a372b';g.textAlign='center';g.textBaseline='middle';const cx=310,cy=322,r=248;g.lineWidth=2;for(let i=0;i<=50;i++){const a=(-140+i*2)*Math.PI/180,rr=r-(i%5===0?22:10);g.beginPath();g.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a));g.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));g.stroke();if(i%10===0){g.font='24px Arial';g.fillText(String(i*2),cx+(r+31)*Math.cos(a),cy+(r+31)*Math.sin(a))}}g.font='15px Arial';g.fillText('ГОСТ 8711–78   •   КЛ. 2,5',310,280);});
 plane(.91,.53,new T.MeshStandardMaterial({map:tex,roughness:.62}),x,2.10,1.28,0,0,0,machine);
 const piv=new T.Group();piv.position.set(x,1.89,1.296);machine.add(piv);box(.009,.38,.009,red,0,.19,0,piv);cyl(.037,.015,bakelite,x,1.89,1.301,Math.PI/2,0,0,machine,16);piv.rotation.z=T.MathUtils.degToRad(50);
 decal(.96,.18,lines,x,1.73,1.28,machine,null,'#d9c499');for(const sx of [-.45,.45])screw(x+sx,1.68,1.285);return piv;
}
const g1=gauge(-1.015,['СТЕПЕНЬ','ДОКУМЕНТНОСТИ']),g2=gauge(.115,['УРОВЕНЬ БЮРОКРАТИЧЕСКОЙ','УВЕРЕННОСТИ']);
decal(1.27,.18,['ПОДТВЕРДИТЬ'],1.58,2.31,1.16,machine,'#873b2c','#dbc59f');
cyl(.306,.058,bakelite,1.58,1.96,1.22,Math.PI/2,0,0,machine);cyl(.275,.05,chrome,1.58,1.96,1.266,Math.PI/2,0,0,machine);
const cap=cyl(.246,.14,M(0x912319,.28,.28),1.58,1.96,1.34,Math.PI/2,0,0,machine,48);cap.userData.action='confirm';interactives.push(cap);
// Separate bolted lower panels surround deep open mechanics.
panel(.77,1.20,-2.02,.94);panel(.56,1.20,.58,.94);panel(2.27,.22,-.45,1.43);panel(1.70,.22,1.58,1.43);
decal(.59,.60,['ВСТАВИТЬ','ДОКУМЕНТ','→'],-2.02,1.02,1.164,machine,'#b4a384');
decal(.59,.20,['№ 041 · 1982'],-2.02,.48,1.164,machine);
const phaseLamps=[];['АНАЛИЗ','ПРОВЕРКА','ПЕЧАТЬ','ГОТОВО'].forEach((s,i)=>{const y=1.27-i*.245;cyl(.056,.04,bakelite,.395,y,1.19,Math.PI/2,0,0,machine,16);const m=M(i===3?0x447c35:0xb17621,.10,.26);phaseLamps.push(cyl(.036,.028,m,.395,y,1.222,Math.PI/2,0,0,machine,16));decal(.33,.088,[s],.66,y,1.161,machine)});
function phase(n){phaseLamps.forEach((l,i)=>{l.material.emissive.setHex(i<=n?(i===3?0x6bd54a:0xffb33c):0);l.material.emissiveIntensity=i<=n?1.5:0})}
/* Input bed projects well beyond the cabinet, with guides, bearings and rollers. */
const input=new T.Group();input.position.set(-.68,.32,1.01);machine.add(input);
softBox(2.02,.30,1.90,enamel,0,.05,.72,input,.065);softBox(1.86,.06,1.76,edgeMetal,0,.235,.72,input,.03);
const tray=box(1.80,.028,1.74,steel2,0,.28,.73,input);tray.userData.action='load';interactives.push(tray);
for(const x of [-.93,.93]){softBox(.12,.22,1.82,edgeMetal,x,.33,.72,input,.035);cyl(.043,1.50,chrome,x,.48,.70,Math.PI/2,0,0,input,16);for(const z of [.04,1.4])softBox(.18,.22,.21,enamel,x,.39,z,input,.025)}
const pcan=document.createElement('canvas');pcan.width=760;pcan.height=1024;const pg=pcan.getContext('2d');const ptex=new T.CanvasTexture(pcan);ptex.colorSpace=T.SRGBColorSpace;
const inPaper=plane(1.48,1.52,new T.MeshStandardMaterial({map:ptex,roughness:.94,side:T.DoubleSide}),0,.306,.74,-Math.PI/2,0,0,input);inPaper.visible=false;
function drawInput(name){pg.fillStyle='#d8ccb1';pg.fillRect(0,0,760,1024);pg.strokeStyle='#7b705c';pg.strokeRect(38,38,684,948);pg.fillStyle='#38342c';pg.textAlign='center';pg.font='bold 40px serif';pg.fillText('ФОРМА 27-Б',380,117);pg.font='22px monospace';pg.fillText('ПРЕДСТАВЛЕННЫЙ ДОКУМЕНТ',380,175);pg.font='bold 24px monospace';pg.fillText(name.toUpperCase().slice(0,32),380,249,640);pg.textAlign='left';pg.fillStyle='#9b8f74';for(let i=0;i<18;i++)pg.fillRect(70,310+i*23,570-(i%4)*41,3);pg.strokeStyle='#993d30';pg.lineWidth=4;pg.strokeRect(123,792,514,100);pg.fillStyle='#993d30';pg.font='bold 27px monospace';pg.fillText('ОЖИДАЕТ ПРОВЕРКИ',204,851);ptex.needsUpdate=true;}
const rollers=[cyl(.075,1.77,bakelite,0,.33,1.48,0,0,Math.PI/2,input),cyl(.085,1.77,chrome,0,.36,-.03,0,0,Math.PI/2,input)];
for(const z of [-.03,1.48])for(const x of [-.82,.82])cyl(.12,.08,edgeMetal,x,.33,z,0,0,Math.PI/2,input,18);
const rail=cyl(.033,1.80,chrome,0,.72,-.07,0,0,Math.PI/2,input,16);const scan=new T.Group();scan.position.set(-.74,.64,-.07);input.add(scan);softBox(.15,.14,.22,edgeMetal,0,0,0,scan,.02);const lens=box(.1,.025,.17,M(0xffd999,.05,.22,0xffbc61,1.2),0,-.08,0,scan);
box(1.78,.04,.10,M(0xffd79a,.02,.5,0xffbe6e,1.2),0,.92,-.14,input);const bayLight=new T.PointLight(0xffc277,.35,.75,2);bayLight.position.set(-.17,1.20,-1.28);scene.add(bayLight);
/* Output: a proper open press with a piston, collar, stamp block and sloped chute. */
const output=new T.Group();output.position.set(1.58,.33,1.03);machine.add(output);
for(const x of [-.66,.66]){softBox(.11,.94,.69,enamel,x,.58,-.02,output,.025);cyl(.045,.79,chrome,x*.68,.62,-.16,0,0,0,output,16)}
softBox(1.25,.16,.64,edgeMetal,0,.99,-.10,output,.04);
const stampLink=new T.Group();stampLink.position.set(0,.76,-.06);output.add(stampLink);cyl(.104,.44,chrome,0,0,0,0,0,0,stampLink);cyl(.168,.09,red,0,.045,0,0,0,0,stampLink);
const stamp=new T.Group();stamp.position.set(0,.51,-.06);output.add(stamp);softBox(1.05,.25,.54,edgeMetal,0,0,0,stamp,.03);box(.97,.045,.49,bakelite,0,-.14,0,stamp);for(const x of [-.43,.43])screw(x,0,.285,stamp);
const chute=new T.Group();chute.position.set(0,.195,.40);chute.rotation.x=.30;output.add(chute);softBox(1.39,.055,1.56,edgeMetal,0,0,.24,chute,.028);for(const x of [-.69,.69])box(.045,.10,1.57,chrome,x,.055,.24,chute);
const outRollers=[cyl(.071,1.15,bakelite,0,.27,.11,0,0,Math.PI/2,output),cyl(.067,1.15,chrome,0,.26,-.17,0,0,Math.PI/2,output)];
const ocan=document.createElement('canvas');ocan.width=760;ocan.height=1050;const og=ocan.getContext('2d');const otex=new T.CanvasTexture(ocan);otex.colorSpace=T.SRGBColorSpace;
const outPaper=plane(1.15,1.52,new T.MeshStandardMaterial({map:otex,roughness:.9,side:T.DoubleSide}),0,.12,.31,-Math.PI/2+.30,0,0,output);outPaper.visible=false;
function drawOut(name,serial){og.fillStyle='#e0d2b3';og.fillRect(0,0,760,1050);og.strokeStyle='#8b7e66';og.strokeRect(35,35,690,980);og.fillStyle='#4a4636';og.textAlign='center';og.font='bold 24px monospace';og.fillText('МИНИСТЕРСТВО НЕНУЖНЫХ ПРОЦЕДУР',380,95);og.font='bold 43px serif';og.fillText('СПРАВКА № '+serial,380,180);og.font='22px monospace';og.fillText(name.toUpperCase().slice(0,30),380,250);og.fillStyle='#a69a7f';for(let i=0;i<9;i++)og.fillRect(75,307+i*24,610-(i%3)*50,3);og.save();og.translate(380,704);og.rotate(-.035);og.strokeStyle='#9b362b';og.lineWidth=7;og.strokeRect(-291,-111,582,218);og.fillStyle='#9b362b';og.font='bold 47px Arial';og.fillText('ДОКУМЕНТ',0,-44);og.fillText('ЯВЛЯЕТСЯ',0,12);og.fillText('ДОКУМЕНТОМ',0,69);og.restore();og.fillStyle='#9b362b';og.font='76px serif';og.fillText('☭',380,946);otex.needsUpdate=true;}
/* Office dressing follows the cinematic reference: cool window, warm desk light. */
const timberTex=canvasTex(1024,512,(g,w,h)=>{g.fillStyle='#3d2b1f';g.fillRect(0,0,w,h);let seed=41;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};for(let i=0;i<900;i++){g.strokeStyle='rgba('+(rnd()>.6?'152,114,70':'16,13,9')+','+(.04+rnd()*.16)+')';g.lineWidth=.5+rnd()*2;const y=rnd()*h;g.beginPath();g.moveTo(0,y);g.bezierCurveTo(w*.3,y+(rnd()-.5)*12,w*.7,y+(rnd()-.5)*12,w,y);g.stroke()}});timberTex.wrapS=timberTex.wrapT=T.RepeatWrapping;timberTex.repeat.set(1,2);wood.map=timberTex;wood.color.setHex(0xffffff);wood.needsUpdate=true;
// Thin worn green linoleum work surface and oak apron.
softBox(2.59,.045,1.47,M(0x3a473b,.03,.86),0,.925,-1.63,scene,.025);
box(2.57,.20,.07,wood,0,.77,-.915);box(2.57,.20,.07,wood,0,.77,-2.345);
const docFace=canvasTex(384,512,(g)=>{g.fillStyle='#c9bc9d';g.fillRect(0,0,384,512);g.fillStyle='#6f6854';g.font='bold 23px serif';g.textAlign='center';g.fillText('ДЕЛО № 27-Б',192,52);for(let i=0;i<20;i++)g.fillRect(30,91+i*16,300-(i%4)*31,2);g.strokeStyle='#924538';g.lineWidth=3;g.strokeRect(97,408,190,56);g.font='bold 19px serif';g.fillStyle='#924538';g.fillText('СОГЛАСОВАНО',192,444)});
const docMat=new T.MeshStandardMaterial({map:docFace,roughness:.96});
function paperStack(x,y,z,w=.30,d=.39,count=12){const p=new T.Group();p.position.set(x,y,z);scene.add(p);const n=count*5,sheets=new T.InstancedMesh(new T.BoxGeometry(w,.00086,d),paper,n),pose=new T.Object3D();for(let i=0;i<n;i++){pose.position.set(Math.sin(i*7)*.003,i*.0009,Math.cos(i*3)*.003);pose.rotation.y=Math.sin(i*2)*.014;pose.updateMatrix();sheets.setMatrixAt(i,pose.matrix)}sheets.castShadow=sheets.receiveShadow=true;p.add(sheets);plane(w,d,docMat,0,n*.0009+.001,0,-Math.PI/2,0,0,p);return p;}
paperStack(-.99,.951,-1.33,.35,.47,18);paperStack(-1.01,.951,-1.87,.31,.42,9);paperStack(.97,.951,-1.03,.36,.42,5);
// Reference-inspired green glass banker's lamp.
const brass=M(0x967345,.78,.31),lampGreen=M(0x164d35,.27,.26);
cyl(.135,.026,brass,.99,.97,-1.93,0,0,0,scene,40);cyl(.09,.04,brass,.99,1.001,-1.93);cyl(.018,.44,brass,.99,1.22,-1.93,0,0,0,scene,20);
const lampShade=new T.Mesh(new T.CylinderGeometry(.12,.12,.44,32,1,false,0,Math.PI),lampGreen);lampShade.rotation.z=Math.PI/2;lampShade.position.set(.99,1.405,-1.85);lampShade.castShadow=true;scene.add(lampShade);plane(.36,.16,new T.MeshBasicMaterial({color:0xffd7a0}),.99,1.405,-1.84,-Math.PI/2);
for(const y of [.33,.51,.69]){box(.49,.16,.03,wood,-.92,y,-.99);box(.13,.018,.035,edgeMetal,-.92,y,-.96);}
const deskLight=new T.PointLight(0xffc27f,1.2,2.2,2);deskLight.position.set(.99,1.36,-1.78);scene.add(deskLight);
// Glazed window on the left with frames, dusty sill and diffuse daylight.
const windowPane=M(0xaebfbb,.02,.52,0x9fbbb9,.35);box(.08,2.70,2.75,dark,-5.87,2.72,-2.60);box(.085,2.51,2.55,windowPane,-5.81,2.72,-2.60);
for(const y of [1.39,2.71,4.05])box(.13,.065,2.86,steel2,-5.74,y,-2.60);for(const z of [-4,-2.61,-1.20])box(.13,2.70,.065,steel2,-5.73,2.72,z);box(.43,.08,3.03,wood,-5.69,1.36,-2.60);
const daylight=new T.PointLight(0xb9ced3,3.2,9,2);daylight.position.set(-4.9,3.35,-2.60);scene.add(daylight);
// A midground archive desk and records break up the former empty hall.
box(1.65,.075,.79,wood,-3.6,.82,-3.77);for(const x of [-4.30,-2.90])for(const z of [-4.06,-3.49])box(.07,.79,.07,dark,x,.4,z);
paperStack(-4.12,.861,-3.77,.35,.44,22);paperStack(-3.62,.861,-3.76,.36,.45,31);paperStack(-3.08,.861,-3.79,.31,.43,13);
for(const x of [-4.15,-3.6,-3.05]){box(.39,.37,.48,M(0x655b40,.02,.96),x,.26,-3.78);decal(.29,.13,['АРХИВ'],x,.30,-3.535,scene,'#b4a37e');}
// A chair has a compact, solid footprint used by the collision map.
softBox(.50,.055,.48,wood,3.94,.48,-4.36,scene,.035);softBox(.49,.46,.055,wood,3.94,.92,-4.58,scene,.035);for(const x of [3.73,4.15])for(const z of [-4.55,-4.17])cyl(.023,.48,dark,x,.24,z,0,0,0,scene,12);for(const x of [3.73,4.15])cyl(.021,.72,dark,x,.80,-4.58,0,0,0,scene,12);
// Small mug, pencil cup and bound files on the telephone table.
cyl(.068,.15,M(0xc7b996,.08,.45),4.49,.98,-5.08);cyl(.044,.004,M(0x33241a,0,.9),4.49,1.057,-5.08);
const mugHandle=new T.Mesh(new T.TorusGeometry(.041,.01,8,20),M(0xc7b996,.08,.45));mugHandle.position.set(4.555,.993,-5.08);scene.add(mugHandle);
for(let i=0;i<7;i++)box(.065,.32,.24,M([0x5e5946,0x5d3b2c,0x6a6b4d][i%3],0,.94),3.42+i*.068,1.06,-5.35);

const frost=canvasTex(512,512,(g,w,h)=>{const a=g.createLinearGradient(0,0,w,h);a.addColorStop(0,'#a7bab9');a.addColorStop(.55,'#b7c8c3');a.addColorStop(1,'#8da6a5');g.fillStyle=a;g.fillRect(0,0,w,h);g.strokeStyle='rgba(223,232,219,.24)';g.lineWidth=2;for(let i=0;i<180;i++){const x=Math.random()*w,y=h-Math.random()*h*.27;g.beginPath();g.moveTo(x,y);g.lineTo(x+10,y-24);g.moveTo(x,y-7);g.lineTo(x-8,y-14);g.stroke();}});windowPane.map=frost;windowPane.needsUpdate=true;
const doorGroup=new T.Group();doorGroup.position.set(5.84,0,-.8);doorGroup.rotation.y=-Math.PI/2;scene.add(doorGroup);
softBox(1.17,2.52,.14,dark,0,1.26,0,doorGroup,.015);softBox(1.02,2.37,.09,wood,0,1.205,.10,doorGroup,.018);softBox(.78,1.34,.035,M(0x4a4232,.04,.92),0,1.57,.16,doorGroup,.01);softBox(.78,.51,.035,wood,0,.53,.16,doorGroup,.01);decal(.43,.18,['ОПЕРАТОРСКАЯ','№ 3'],0,1.81,.189,doorGroup,'#b9a777');cyl(.038,.055,brass,.37,1.07,.205,Math.PI/2,0,0,doorGroup);box(.16,.027,.027,brass,.32,1.07,.247,doorGroup);
/* Radius-expanded floor footprints. Axis sliding keeps contact natural. */
const obstacles=[
 {x0:-1.32,x1:1.32,z0:-2.39,z1:-.875}, // main workbench, including machine and projecting trays
 {x0:-5.05,x1:-3.45,z0:-5.88,z1:-5.14}, // filing cabinets
 {x0:3.03,x1:4.77,z0:-5.55,z1:-4.86}, // telephone desk
 {x0:3.67,x1:4.21,z0:-4.64,z1:-4.10}, // chair
 {x0:-4.48,x1:-2.71,z0:-4.21,z1:-3.32}, // archive desk and boxes
 {x0:-.79,x1:.80,z0:-6.61,z1:-6.30}, // radiator
 {x0:-5.92,x1:-5.46,z0:-4.13,z1:-1.07}, // window sill
 {x0:5.57,x1:5.94,z0:-1.41,z1:-.19} // door and handle
];
const playerRadius=.19;
function canStand(x,z){return x>-5.68&&x<5.68&&z>-6.40&&z<6.70&&!obstacles.some(o=>x>o.x0-playerRadius&&x<o.x1+playerRadius&&z>o.z0-playerRadius&&z<o.z1+playerRadius)}
function walk(dx,dz){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.065));for(let i=0;i<steps;i++){let x=camera.position.x+dx/steps,z=camera.position.z;if(canStand(x,z))camera.position.x=x;z=camera.position.z+dz/steps;if(canStand(camera.position.x,z))camera.position.z=z;}}

window.BYUR_LOAD?.stage('machine_ready');

/* Mechanics and operator controls. Files remain entirely local. */
let current=null,busy=false,certificateReady=false,serial='';
const ui=Object.fromEntries(['loadDoc','runDoc','resetDoc','receipt','certificate','certificateCanvas','cycleCount','sound','roomView','deskView'].map(id=>[id,document.getElementById(id)]));
let issued=0;try{issued=Number(localStorage.getItem('byur-issued')||0)||0}catch{}
function updateCount(){ui.cycleCount.textContent='ЇSSUЄD: '+String(issued).padStart(3,'0')}updateCount();
function controls(){ui.loadDoc.disabled=ui.runDoc.disabled=ui.resetDoc.disabled=busy;ui.receipt.disabled=!certificateReady||busy}
function status(text){hint.textContent=text}
const audio=window.MinistryAudio;let soundOn=false,musicOn=false;
function sound(name){audio.play(name)}
ui.sound.onclick=async()=>{soundOn=!soundOn;ui.sound.textContent='SOUИD: '+(soundOn?'OИ':'OFF');ui.sound.setAttribute('aria-pressed',String(soundOn));try{await audio.setEffects(soundOn);sound('relay')}catch{soundOn=false;ui.sound.textContent='SOUИD: RETRY';ui.sound.setAttribute('aria-pressed','false');status('Audio delivery delayed. Click SOUИD to retry, comЯade.')}};
const musicButton=document.getElementById('music');musicButton.onclick=async()=>{musicOn=!musicOn;musicButton.textContent='MUSЇC: '+(musicOn?'OИ':'OFF');musicButton.setAttribute('aria-pressed',String(musicOn));try{await audio.setMusic(musicOn)}catch{musicOn=false;musicButton.textContent='MUSЇC: RETRY';musicButton.setAttribute('aria-pressed','false');status('Orchestra delayed. Click MUSЇC to retry.')}};
document.getElementById('volume').oninput=e=>audio.setVolume(Number(e.target.value)/100);
const st={cap:cap.position.z,inZ:inPaper.position.z,outZ:outPaper.position.z,stampY:stamp.position.y,linkY:stampLink.position.y,scanX:scan.position.x};
const wait=ms=>new Promise(r=>setTimeout(r,ms)),smooth=t=>t*t*(3-2*t);
function tween(ms,fn){return new Promise(res=>{const s=performance.now();function step(n){const t=Math.min(1,(n-s)/ms);fn(smooth(t));t<1?requestAnimationFrame(step):res()}requestAnimationFrame(step)})}
function setLamp(i,on){const m=lamps[i].material;m.emissive.setHex(on?[0x54ff66,0xffad35,0xd12620][i]:0);m.emissiveIntensity=on?2:0}
function resetVisual(){phase(-1);setLamp(1,false);setLamp(2,false);cap.position.z=st.cap;scan.position.x=st.scanX;stamp.position.y=st.stampY;stampLink.position.y=st.linkY;inPaper.position.z=st.inZ;outPaper.position.z=st.outZ;outPaper.position.y=.264;outPaper.visible=false;g1.rotation.z=g2.rotation.z=T.MathUtils.degToRad(50)}
async function gauges(a,b){const s1=g1.rotation.z,s2=g2.rotation.z,e1=T.MathUtils.degToRad(50-100*a),e2=T.MathUtils.degToRad(50-100*b);await tween(700,t=>{g1.rotation.z=s1+(e1-s1)*t;g2.rotation.z=s2+(e2-s2)*t})}
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
function showCertificate(){if(certificateReady&&!busy){ui.certificate.showModal();sound('relay')}}
ui.receipt.onclick=showCertificate;outPaper.userData.action='receipt';interactives.push(outPaper);
document.getElementById('closeReceipt').onclick=()=>ui.certificate.close();
document.getElementById('downloadReceipt').onclick=()=>{ui.certificateCanvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='SPRAVKA-27B-'+serial+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')};
async function run(){
 if(busy)return;
 if(!current){setLamp(2,true);crt(['ОШИБКА.','','ДОКУМЕНТ ИЄT.']);status('ЄЯЯOЯ · Select a document first, comЯade.');sound('relay');return}
 busy=true;certificateReady=false;resetVisual();phase(0);controls();setLamp(1,true);sound('relay');audio.setCycle(true);
 try{
 await tween(110,t=>cap.position.z=st.cap-.10*t);await tween(140,t=>cap.position.z=st.cap-.10*(1-t));
 status('AИALYSЇS · Machine considers existence of document.');crt(['АНАЛИЗ...','','ОБРАБОТКА: 20%']);sound('feed');
 await Promise.all([tween(1700,t=>{inPaper.position.z=st.inZ+(-.58-st.inZ)*t;rollers[0].rotation.x+=.22;rollers[1].rotation.x-=.22}),gauges(.28,.34)]);
 crt(['АНАЛИЗ...','','СКАНЕР WORKЇИG.']);sound('scan');await tween(1350,t=>{scan.position.x=-.74+1.48*t;lens.material.emissiveIntensity=2.2+.5*Math.sin(t*18)});await tween(550,t=>scan.position.x=.74-1.48*t);
 phase(1);status('VЄЯЇFЇCATЇOИ · Second department confirms first department.');crt(['ПРОВЕРКА...','','ОБРАБОТКА: 68%']);await gauges(.66,.72);await wait(500);
 phase(2);status('STAMPЇИG · State applies physical certainty.');crt(['ПЕЧАТЬ...','','OFFЇCЇДL ПЕЧАТЬ.']);serial=String(Math.floor(100000+Math.random()*900000));drawOut(current.name,serial);
 await tween(330,t=>{stamp.position.y=st.stampY+(.405-st.stampY)*t;stampLink.position.y=st.linkY-.105*t});sound('stamp');await wait(120);await tween(420,t=>{stamp.position.y=.405+(st.stampY-.405)*t;stampLink.position.y=st.linkY-.105*(1-t)});
 outPaper.visible=true;outPaper.position.z=-.55;sound('feed');await tween(1300,t=>{outPaper.position.z=-.45+1.16*t;outPaper.position.y=.36-.31*outPaper.position.z;outRollers[0].rotation.x+=.20;outRollers[1].rotation.x-=.20});await gauges(1,1);setLamp(1,false);phase(3);
 crt(['ПРОВЕРКА ЗАВЕРШЕНА.','','СТАТУС: ХОРОШО.','','ДОКУМЕНТ ЯВЛЯЕТСЯ ДОКУМЕНТОМ.']);
 createCertificate(current.name,serial);certificateReady=true;issued++;try{localStorage.setItem('byur-issued',String(issued))}catch{}updateCount();
 status('APPЯOVЄD · Your certificate is ready. Click CERTЇFЇCATЄ.');sound('bell');
 }catch(e){setLamp(2,true);status('ЄЯЯOЯ · Temporary deviation. Click ЯЄSЄT and retry.');console.error(e)}
 finally{busy=false;audio.setCycle(false);controls()}
}
function reset(){if(busy)return;current=null;certificateReady=false;fileInput.value='';inPaper.visible=false;resetVisual();controls();crt(['БЮРОКЯДТ-1','ВНИМАНИЕ.','СИСТЕМА ГОТОВА.']);status('COMЯADE, select a document or click the input tray.');sound('relay')}
function loadDocument(){if(!busy)fileInput.click()}
ui.loadDoc.onclick=loadDocument;ui.runDoc.onclick=run;ui.resetDoc.onclick=reset;
fileInput.onchange=()=>{if(busy||!fileInput.files[0])return;resetVisual();certificateReady=false;current=fileInput.files[0];drawInput(current.name);inPaper.visible=true;inPaper.position.z=st.inZ;crt(['ДОКУМЕНТ ПРИНЯТ.','','PЯЄSS ПОДТВЕРДИТЬ.']);setLamp(2,false);status('ЯЄCЄЇVЄD · '+current.name+' · Press COИFЇЯM.');controls();sound('relay')};
let viewMoving=false;
async function setView(view){
 if(viewMoving)return;viewMoving=true;renderer.domElement.style.opacity='0';await wait(180);
 const side=view==='side',desk=view===true,narrow=Math.max(0,.9/camera.aspect-1)*.85;camera.position.set(side?1.25:0,desk?1.70:side?1.72:1.70,(desk?.42:side?.55:2.7)+(desk||side?narrow:0));
 if(!current&&!busy)status(desk||side?'COMЯADE, select a document or click the input tray.':'COMЯADE, press 2 to approach the machine.');
 yaw=side?.46:0;pitch=desk?-.145:side?-.15:.018;camera.rotation.set(pitch,yaw,0);renderer.domElement.style.opacity='1';await wait(180);viewMoving=false;
}
ui.roomView.onclick=()=>setView(false);ui.deskView.onclick=()=>setView(true);document.getElementById('sideView').onclick=()=>setView('side');
controls();

/* interaction */
const ray=new T.Raycaster(),mouse=new T.Vector2();renderer.domElement.onclick=e=>{if(dragMoved){dragMoved=false;return}const r=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*2-1;mouse.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(interactives,true).filter(h=>{for(let o=h.object;o;o=o.parent)if(!o.visible)return false;return true});if(!hits.length)return;let o=hits[0].object;while(o&&!o.userData.action)o=o.parent;if(!o)return;if(o.userData.action==='load'&&!busy)fileInput.click();if(o.userData.action==='confirm')run();if(o.userData.action==='reset')reset();if(o.userData.action==='receipt')showCertificate()};

/* look / walk */
let dragging=false,lastX=0,lastY=0,dragMoved=false;renderer.domElement.onmousedown=e=>{dragging=true;lastX=e.clientX;lastY=e.clientY};addEventListener('mouseup',()=>dragging=false);addEventListener('mousemove',e=>{if(!dragging||viewMoving)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)dragMoved=true;yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(.72,pitch-dy*.003));camera.rotation.y=yaw;camera.rotation.x=pitch;lastX=e.clientX;lastY=e.clientY});
const keys={};addEventListener('keydown',e=>{
 if(ui.certificate.open||/INPUT|TEXTAREA/.test(e.target.tagName))return;
 if(e.target.tagName==='BUTTON'&&(e.key==='Enter'||e.key===' '))return;
 const k=e.key.toLowerCase();keys[k]=true;if(e.repeat)return;
 if(k==='f'){e.preventDefault();loadDocument()}if(k==='r')reset();
 if(k==='enter'){e.preventDefault();run()}if(k==='1')setView(false);if(k==='2')setView(true);if(k==='3')setView('side');
});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>{for(const k in keys)keys[k]=false;dragging=false});
function move(dt){if(viewMoving||ui.certificate.open)return;let forward=Number(!!keys.w)-Number(!!keys.s),side=Number(!!keys.d)-Number(!!keys.a);const norm=Math.hypot(forward,side);if(!norm)return;const speed=1.7*dt/norm;walk((-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed);}
document.getElementById('fs').onclick=()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();
renderer.domElement.style.touchAction='none';
if(new URLSearchParams(location.search).has('inspect'))window.BYUR_INSPECT={snapshot:()=>({camera:camera.position.toArray(),safe:canStand(camera.position.x,camera.position.z),machine: new T.Box3().setFromObject(machine).getSize(new T.Vector3()).toArray(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles}),canStand};
let tx=0,ty=0;
renderer.domElement.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;dragMoved=false},{passive:true});
renderer.domElement.addEventListener('touchmove',e=>{if(viewMoving)return;const t=e.touches[0],dx=t.clientX-tx,dy=t.clientY-ty;if(Math.abs(dx)+Math.abs(dy)>2)dragMoved=true;yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(.72,pitch-dy*.003));camera.rotation.set(pitch,yaw,0);tx=t.clientX;ty=t.clientY},{passive:true});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
resetVisual();renderer.render(scene,camera);window.BYUR_LOAD?.stage('first_frame');setTimeout(()=>window.BYUR_LOAD?.complete(),180);
let last=performance.now();(function loop(now){const dt=Math.min(.20,(now-last)/1000);last=now;move(dt);renderer.render(scene,camera);requestAnimationFrame(loop)})(last);
})();