// Exercise the actual room-construction block with lightweight scene-geometry doubles.
// This complements, not replaces, Chromium screenshots and 64 cinematic route checks.
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=await readFile('js/app.js','utf8');
new vm.Script(app,{filename:'js/app.js'});
const start=app.indexOf('/* ROOM COMPLETENESS:'),end=app.indexOf('/* Radius-expanded floor footprints.',start);
assert(start>0&&end>start,'Bounded production room-finishing section exists');
const records=[],instances=[];
const material=()=>({map:{},emissive:{setHex(){}},needsUpdate:false});
const shape=(kind,w,h,d,mat,x,y,z,parent)=>{
 const mesh={kind,w,h,d,x,y,z,parent,name:'',material:material(),position:{z,set(){}},rotation:{x:0,y:0},castShadow:true,receiveShadow:true};
 records.push(mesh);return mesh;
};
class Object3D{
 constructor(){
  this.position={x:0,y:0,z:0,set(x,y,z){Object.assign(this,{x,y,z})}};
  this.scale={x:1,y:1,z:1,set(x,y,z){Object.assign(this,{x,y,z})}};
  this.rotation={x:0,y:0,z:0,set(x,y,z){Object.assign(this,{x,y,z})}};
 }
 updateMatrix(){this.matrix={x:this.position.x,y:this.position.y,z:this.position.z,w:this.scale.x,h:this.scale.y,d:this.scale.z,rx:this.rotation.x}}
}
class InstancedMesh{
 constructor(geo,mat,count){this.geometry=geo;this.material=mat;this.count=count;this.instances=new Array(count);this.instanceMatrix={needsUpdate:false}}
 setMatrixAt(i,m){this.instances[i]={...m}}
}
const T={
 Vector3:class {constructor(x,y,z){Object.assign(this,{x,y,z})}},
 CatmullRomCurve3:class {constructor(points){this.points=points}},
 TubeGeometry:class {constructor(){}},
 TorusGeometry:class {constructor(){}},
 BoxGeometry:class {constructor(){}},
 CylinderGeometry:class {constructor(){}},
 Object3D,InstancedMesh,
 Mesh:class {constructor(geo,mat){this.geo=geo;this.material=mat;this.position={set(){}};this.rotation={}}}
};
const scene={add(o){if(o instanceof InstancedMesh){assert.equal(o.instances.length,o.count);assert(o.instances.every(x=>x&&Number.isFinite(x.x)),'All instancing transforms initialized');instances.push(o);for(const item of o.instances)records.push({kind:'instanced',...item,mat:o.material})}}};
const env={T,scene,doorGroup:{},seam:material(),steel2:material(),wallConcrete:material(),tieMat:material(),brass:material(),black:material(),phoneRed:material(),wood:material(),meterIvory:material(),rad:material(),
 M:material,box:(...args)=>shape('box',...args),softBox:(...args)=>shape('softBox',...args),cyl:(r,h,mat,x,y,z,rx,ry,rz,parent)=>shape('cyl',r,h,r,mat,x,y,z,parent),decal:(...args)=>shape('decal',...args)};
// Simulate the actual right-wall shell with a true door aperture before finishes.
const masonryStart=app.indexOf('const rightDoorWallParts=['),masonryEnd=app.indexOf('/* recessed concrete panel seams',masonryStart);
assert(masonryStart>0&&masonryEnd>masonryStart,'Doorway masonry block exists');
env.institutionalFloor=material();
vm.createContext(env);vm.runInContext(app.slice(masonryStart,masonryEnd),env);
const masonry=vm.runInContext('rightDoorWallParts',env);
assert.equal(masonry.length,3,'Right wall consists of two sides and a lintel');
assert.deepEqual(Array.from(masonry,m=>m.name),['room-door-left-masonry','room-door-right-masonry','room-door-lintel']);
assert(masonry.every(m=>!m.castShadow),'Masonry stays a receiver, not a false exterior-light caster');
const doorwayZ=[-.8-.72,-.8+.72],lintelY=2.68;
for(const part of masonry){
 const zMin=part.z-part.d/2,zMax=part.z+part.d/2;
 if(part.y-part.h/2<lintelY-.0001){
  assert(zMax<=doorwayZ[0]+.0001||zMin>=doorwayZ[1]-.0001,
   'No concrete occupies the open door aperture below lintel');
 }
}
vm.runInContext(app.slice(start,end),env);
const front=vm.runInContext('frontWall',env);
assert.equal(front.name,'room-front-wall');
assert.equal(front.castShadow,false,'Physical front wall receives light but must not occlude the interior key when issue #6 is integrated');
assert.equal(front.receiveShadow,true,'Front wall remains a shadow receiver');
assert.deepEqual([front.w,front.h,front.d,front.x,front.y,front.z],[12,6,.2,0,3,7]);
assert.equal(records.filter(o=>o.w===12&&o.h===6&&o.d===.2&&o.z===7).length,1,'Fourth +Z wall remains one continuous concrete boundary');
for(const axis of [-1,1]){
 assert(records.some(o=>o.x===axis*5.875&&o.h===.96),'Both side walls carry lower paint');
 assert(records.some(o=>o.x===axis*5.846&&o.h===.13),'Both side walls have skirting');
}
for(const z of [-6.677,6.877])assert(records.some(o=>o.z===z&&o.h===.96),'Front and rear lower paint exists');
assert.equal(instances.filter(o=>o.geometry instanceof T.BoxGeometry).length,6,'Six reused materials batch wall trim and static service/furniture hardware');
assert(records.filter(o=>o.kind==='instanced').length>55,'Construction and decorative fittings are submitted as instances');
assert.equal(instances.filter(o=>o.geometry instanceof T.CylinderGeometry).length,1,'All 21 front wall form-ties are a single draw');
assert.equal(instances.find(o=>o.geometry instanceof T.CylinderGeometry)?.count,21);
assert(records.filter(o=>o.parent===env.doorGroup).length>=8,'Door retains constructed frame and fittings');
const rightLowerPaint=records.filter(o=>o.kind==='instanced'&&o.x===5.875&&o.y===.49&&o.h===.96);
assert.equal(rightLowerPaint.length,2,'Right-wall lower paint must stop at each door jamb');
for(const part of rightLowerPaint)assert(part.z+part.d/2<=doorwayZ[0]+.0001||part.z-part.d/2>=doorwayZ[1]-.0001,
 'Paint must not continue invisibly across door leaf');
assert(app.includes('doorGroup.position.set(6.02,0,-.8)'), 'Door leaf must sit in the physical opening rather than proud of the wall');
assert(app.includes("clockCase.name='room-clock-case';clockCase.castShadow=false"), 'Clock body must not project exaggerated wall shadow');
assert(records.filter(o=>o.x===-4.65||o.x===-3.86).length>12,'Archive cabinetry has modeled drawer hardware');
assert.equal(vm.runInContext('serviceNotice.rotation.y',env),Math.PI,'Notice front face points into room');
assert.equal(vm.runInContext('serviceLabel.rotation.y',env),Math.PI,'Panel label front face points into room');
const collisionStart=app.indexOf('const obstacles=['),collisionEnd=app.indexOf('function walk(',collisionStart);
assert(collisionStart>=0&&collisionEnd>collisionStart);
vm.runInContext(app.slice(collisionStart,collisionEnd),env);
const stand=vm.runInContext('canStand',env);
assert(stand(0,6.59),'Front wall approach remains possible');
assert(!stand(0,6.66),'Camera cannot cross new front skirting');
assert(!stand(5.65,3),'Side skirting receives camera clearance');
assert(!stand(-5.65,3),'Opposite side skirting receives camera clearance');
assert(!stand(5.7,-.8),'Corridor door still solid');
assert(!stand(-3.8,-5.55),'Filing cabinets still solid');
for(const [x,z] of [[1.9,3.5],[1.48,.05],[-.29,-.35],[-.42,-.51],[.62,-.35],[-2.55,-.48],[3.64,1.15],[1.58,-.48]]){
 assert(stand(x,z),'One of the eight existing cinematic camera footholds was obstructed');
}
console.log(JSON.stringify({passed:true,mode:'source geometry simulation',frontWallSize:[front.w,front.h,front.d],createdPrimitives:records.length,instancedBatches:instances.length,checks:['open +X masonry doorway','integrated steel jamb and interrupted trim','clock shadow restraint','complete +Z shell','four wall trims','front-wall text orientation','batched wall reveals','door and archive detail','wall clearance','eight viewpoint footholds','syntax parses']},null,2));
