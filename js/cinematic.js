/* Camera-only inspection. Navigation stays inside the walkable room. */
window.createMinistryCinema=({T,camera,renderer,scene,canStand,invalidate,syncLook,clearKeys,isModal})=>{
 const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const shots=[
  {name:'01 · THЄ OFFЇCЄ',p:[1.9,2.35,3.5],at:[-.55,2.05,-3.9],fov:57},
  {name:'02 · CABЇИЄT POЯTЯAЇT',p:[1.48,1.93,.05],at:[0,1.52,-1.46],fov:48},
  {name:'03 · CRT & MЄTЄЯS',p:[-.29,1.89,-.35],at:[-.15,1.75,-1.27],fov:54},
  {name:'04 · FЄЄD ЯOLLЄЯS',p:[-.42,1.38,-.51],at:[-.18,1.09,-1.20],fov:34},
  {name:'05 · STAMP PЯЄSS',p:[.52,1.27,-.52],at:[.385,1.16,-1.24],fov:28},
  {name:'06 · WЇИTЄЯ WЇИDOW',p:[-2.55,2.13,-.48],at:[-5.75,2.62,-2.60],fov:54},
  {name:'07 · COЯЯЇDOЯ DOOЯ',p:[3.64,1.77,1.15],at:[5.7,1.48,-.8],fov:57},
  {name:'08 · ЯЄCЄЇVЇИG TЯAY',p:[1.58,1.42,-.48],at:[.97,1.02,-1.32],fov:36}
 ];
 let active=false,hidden=false,touring=false,route=null,home=null,index=0,hold=0,capturing=false,toastTimer;
 const target=new T.Vector3(),lookCamera=new T.PerspectiveCamera(),bar=$('cinemaBar'),tab=$('cinemaReveal'),live=$('cinemaStatus');
 for(const [i,s] of shots.entries()){const o=document.createElement('option');o.value=i;o.textContent=s.name;$('cinemaShot').append(o)}
 const ease=t=>t*t*(3-2*t),V=a=>new T.Vector3(...a);
 function report(s){live.textContent=s}
 function clearLine(a,b){const n=Math.ceil(a.distanceTo(b)/.05);for(let i=0;i<=n;i++){const t=n?i/n:0;if(!canStand(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false}return true}
 function pathTo(end){
  const start=camera.position.clone();if(clearLine(start,end))return [start,end];
  // A small floor grid supplies a safe detour; line-of-sight pruning removes its stair steps.
  const step=.25,originX=-5.5,originZ=-6.25,nx=45,nz=52,key=(x,z)=>z*nx+x;
  const point=k=>new T.Vector3(originX+(k%nx)*step,start.y,originZ+Math.floor(k/nx)*step);
  const nearest=p=>{let result=-1,best=Infinity;for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const k=key(x,z),v=point(k),d=v.distanceToSquared(p);if(d<best&&canStand(v.x,v.z)&&clearLine(p,v)){result=k;best=d}}return result};
  const a=nearest(start),b=nearest(end);if(a<0||b<0)return null;
  const open=new Set([a]),parent=new Map(),cost=new Map([[a,0]]);let found=false;
  while(open.size){let k=-1,best=Infinity;for(const c of open){const f=cost.get(c)+point(c).distanceTo(point(b));if(f<best){best=f;k=c}}if(k===b){found=true;break}open.delete(k);const x=k%nx,z=Math.floor(k/nx);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=nx||zz<0||zz>=nz)continue;const n=key(xx,zz),v=point(n);if(!canStand(v.x,v.z)||!clearLine(point(k),v))continue;const c=cost.get(k)+Math.hypot(dx,dz)*step;if(c<(cost.get(n)??Infinity)){cost.set(n,c);parent.set(n,k);open.add(n)}}
  }
  if(!found)return null;const nodes=[end];let k=b;while(k!==a){nodes.unshift(point(k));k=parent.get(k)}nodes.unshift(point(a));nodes.unshift(start);
  const pruned=[start];let i=0;while(i<nodes.length-1){let j=nodes.length-1;while(j>i+1&&!clearLine(nodes[i],nodes[j]))j--;pruned.push(nodes[j]);i=j}
  let length=0;const lengths=[0];for(let j=1;j<pruned.length;j++){length+=pruned[j].distanceTo(pruned[j-1]);lengths.push(length)}
  for(let j=1;j<pruned.length;j++)pruned[j].y=T.MathUtils.lerp(start.y,end.y,lengths[j]/length);
  // Round the detour only when every sample remains clear; otherwise keep the safe polyline.
  const curved=new T.CatmullRomCurve3(pruned,false,'centripetal').getPoints(Math.max(60,Math.ceil(length/.035)));
  return curved.every((p,j)=>canStand(p.x,p.z)&&(!j||clearLine(curved[j-1],p)))?curved:pruned;
 }
 function resize(){
  let w=innerWidth,h=innerHeight;const value=active?Number($('cinemaFrame').value):0;
  if(value){if(w/h>value)w=Math.round(h*value);else h=Math.round(w/value)}
  renderer.setSize(w,h);Object.assign(renderer.domElement.style,{position:'absolute',left:Math.round((innerWidth-w)/2)+'px',top:Math.round((innerHeight-h)/2)+'px'});
  camera.aspect=w/h;camera.updateProjectionMatrix();invalidate();
 }
 function showControls(show){hidden=!show;bar.hidden=hidden;tab.hidden=!hidden;$('cinemaHide').setAttribute('aria-expanded',String(show));if(!show&&bar.contains(document.activeElement))document.activeElement.blur();if(show)$('cinemaHide').focus()}
 function stopTour(){touring=false;$('cinemaTour').textContent='T · STAЯT TOUЯ';$('cinemaTour').setAttribute('aria-pressed','false')}
 function cancelTravel(){route=null;stopTour();syncLook();clearKeys()}
 function go(n,{tour=false,instant=false}={}){
  if(!active)return;if(!tour)stopTour();index=(n+shots.length)%shots.length;$('cinemaShot').value=index;
  const s=shots[index],end=V(s.p),nodes=pathTo(end);if(!nodes){report('ЯOUTЄ BLOCKЄD. Choose another view.');return}
  const lengths=[0];for(let i=1;i<nodes.length;i++)lengths.push(lengths[i-1]+nodes[i].distanceTo(nodes[i-1]));
  lookCamera.position.copy(end);lookCamera.lookAt(V(s.at));
  route={nodes,lengths,total:lengths.at(-1),time:0,duration:Math.max(1.65,lengths.at(-1)/1.1),q0:camera.quaternion.clone(),q1:lookCamera.quaternion.clone(),f0:camera.fov,f1:s.fov};
  clearKeys();report(s.name+' · DRAG TO FRAME · P TO PHOTOGRAPH');
  if(instant||reduced.matches){camera.position.copy(end);camera.quaternion.copy(route.q1);camera.fov=s.fov;camera.updateProjectionMatrix();route=null;syncLook();invalidate()}
  $('cinemaLens').value=s.fov;$('cinemaLensValue').textContent=s.fov+'°';hold=0;
 }
 function enter(){
  if(active||isModal())return;home={p:camera.position.clone(),q:camera.quaternion.clone(),fov:camera.fov};active=true;clearKeys();
  document.body.classList.add('cinematic');for(const id of ['hud','viewControls','operator','hint','fs','installBtn','badge','appMode'])$(id).inert=true;
  $('cinema').hidden=false;bar.hidden=false;tab.hidden=true;hidden=false;resize();go(0);$('cinemaExit').focus();
 }
 function exit(){
  if(!active||capturing)return;cancelTravel();active=false;camera.position.copy(home.p);camera.quaternion.copy(home.q);camera.fov=home.fov;syncLook();
  document.body.classList.remove('cinematic');for(const id of ['hud','viewControls','operator','hint','fs','installBtn','badge','appMode'])$(id).inert=false;
  $('cinema').hidden=true;resize();$('cinemaEnter').focus();
 }
 async function capture(){
  if(!active||capturing)return;capturing=true;stopTour();$('cinemaPhoto').disabled=true;
  // Render synchronously before readback. No permanent preserveDrawingBuffer or extra GPU context.
  const oldSize=renderer.getSize(new T.Vector2()),oldRatio=renderer.getPixelRatio(),aspect=camera.aspect;
  const w=Math.min(2560,Math.round(1440*aspect)),h=Math.round(w/aspect);let blob;
  try{renderer.setPixelRatio(1);renderer.setSize(w,h,false);renderer.render(scene,camera);blob=await new Promise((resolve,reject)=>renderer.domElement.toBlob(b=>b?resolve(b):reject(Error('PNG export failed')),'image/png'))}
  catch(e){report('PHOTO ЇSSUЄ. Please retry, comЯade.');console.error(e)}
  finally{renderer.setPixelRatio(oldRatio);renderer.setSize(oldSize.x,oldSize.y,false);renderer.render(scene,camera);invalidate();capturing=false;$('cinemaPhoto').disabled=false}
  if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='BYUROKYADT-1-'+['office','cabinet','meters','rollers','stamp','winter','door','archive'][index]+'-'+new Date().toISOString().replace(/[:.]/g,'-')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);
  report('PHOTO SAVЄD · '+w+' × '+h+' · NO PAPЄЯWOЯK VЇSЇBLЄ');
  clearTimeout(toastTimer);$('cinemaToast').textContent='PHOTOGЯAPH ЇSSUЄD';$('cinemaToast').hidden=false;toastTimer=setTimeout(()=>$('cinemaToast').hidden=true,1800);
 }
 function toggleTour(){if(touring){cancelTravel();report('TOUЯ PAUSЄD. Frame at your leisure.')}else{touring=true;$('cinemaTour').textContent='T · PAUSЄ TOUЯ';$('cinemaTour').setAttribute('aria-pressed','true');hold=0;if(!route)go(index,{tour:true})}}
 function tick(dt){
  if(!active||capturing)return false;
  if(route){const r=route;r.time+=dt;const t=Math.min(1,r.time/r.duration),u=ease(t),d=r.total*u;let j=1;while(j<r.lengths.length-1&&r.lengths[j]<d)j++;const f=(d-r.lengths[j-1])/(r.lengths[j]-r.lengths[j-1]||1);target.lerpVectors(r.nodes[j-1],r.nodes[j],f);
   if(canStand(target.x,target.z)){camera.position.copy(target)}else{cancelTravel();report('ЯOUTЄ HALTЄD. Furniture has right of way.');return false}
   camera.quaternion.slerpQuaternions(r.q0,r.q1,u);camera.fov=T.MathUtils.lerp(r.f0,r.f1,u);camera.updateProjectionMatrix();syncLook();invalidate();if(t===1){route=null;hold=0}return true;
  }
  if(touring){hold+=dt;if(hold>7)go(index+1,{tour:true})}return false;
 }
 function lens(v){cancelTravel();camera.fov=T.MathUtils.clamp(v,20,75);camera.updateProjectionMatrix();$('cinemaLens').value=camera.fov;$('cinemaLensValue').textContent=Math.round(camera.fov)+'°';invalidate()}
 $('cinemaEnter').onclick=enter;$('cinemaExit').onclick=exit;$('cinemaShot').onchange=e=>go(Number(e.target.value));$('cinemaPrev').onclick=()=>go(index-1);$('cinemaNext').onclick=()=>go(index+1);
 $('cinemaTour').onclick=toggleTour;$('cinemaHide').onclick=()=>showControls(false);tab.onclick=()=>showControls(true);$('cinemaPhoto').onclick=capture;
 $('cinemaFrame').onchange=resize;$('cinemaLens').oninput=e=>lens(Number(e.target.value));
 renderer.domElement.addEventListener('wheel',e=>{if(!active)return;e.preventDefault();lens(camera.fov+Math.sign(e.deltaY)*2)},{passive:false});
 addEventListener('keydown',e=>{
  if(e.repeat||isModal())return;const k=e.key.toLowerCase();
  if(k==='escape'&&active){e.preventDefault();e.stopImmediatePropagation();exit();return}
  if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(k==='c'){e.preventDefault();active?exit():enter();return}if(!active)return;
  if(['h','p','t','[',']'].includes(k)){e.preventDefault();e.stopImmediatePropagation();if(k==='h')showControls(hidden);if(k==='p')capture();if(k==='t')toggleTour();if(k==='[')go(index-1);if(k===']')go(index+1)}
 },true);
 return {enter,exit,tick,resize,cancelTravel,capture,get active(){return active},get capturing(){return capturing},get touring(){return touring},get travelling(){return !!route},snapshot:()=>({active,hidden,touring,travelling:!!route,capturing,index,fov:camera.fov,aspect:camera.aspect}),shots:()=>shots.map(s=>({...s}))};
};
