// Source-level room geometry audit. Browser captures and route tests are separate.
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=await readFile('js/app.js','utf8');
new vm.Script(app,{filename:'js/app.js'});
const start=app.indexOf('/* ROOM COMPLETENESS:'),end=app.indexOf('/* Radius-expanded floor footprints.',start);
assert(start>0&&end>start,'Bounded production room-finishing section exists');
const records=[];
const shape=(kind,w,h,d,mat,x,y,z,parent)=>{const mesh={kind,w,h,d,x,y,z,parent,name:'',position:{z,set(){}},rotation:{x:0},castShadow:false};records.push(mesh);return mesh;};
const T={
 Vector3:class {constructor(x,y,z){Object.assign(this,{x,y,z})}},
 CatmullRomCurve3:class {constructor(points){this.points=points}},
 TubeGeometry:class {constructor(){}},
 TorusGeometry:class {constructor(){}},
 Mesh:class {constructor(geo,mat){this.geo=geo;this.material=mat;this.position={set(){}};this.rotation={}}}
};
const scene={add(){}};
const env={T,scene,doorGroup:{},seam:{},steel2:{},wallConcrete:{},tieMat:{},brass:{},black:{},phoneRed:{},wood:{},meterIvory:{},rad:{},
 M:()=>({}),box:(...args)=>shape('box',...args),softBox:(...args)=>shape('softBox',...args),cyl:(r,h,mat,x,y,z,rx,ry,rz,parent)=>shape('cyl',r,h,r,mat,x,y,z,parent),decal:(...args)=>shape('decal',...args)};
vm.createContext(env);vm.runInContext(app.slice(start,end),env);
const front=vm.runInContext('frontWall',env);
assert.equal(front.name,'room-front-wall');
assert.deepEqual([front.w,front.h,front.d,front.x,front.y,front.z],[12,6,.2,0,3,7]);
const frontShellCount=records.filter(o=>o.w===12&&o.h===6&&o.d===.2).length;
assert.equal(frontShellCount,1,'Fourth wall is a single continuous concrete boundary');
for(const axis of [-1,1]){
 assert(records.some(o=>o.x===axis*5.875&&o.h===.96),'Both side walls carry lower paint');
 assert(records.some(o=>o.x===axis*5.846&&o.h===.13),'Both side walls have skirting');
}
for(const z of [-6.677,6.877])assert(records.some(o=>o.z===z&&o.h===.96),'Front and rear lower paint exists');
assert(records.filter(o=>o.parent===env.doorGroup).length>=8,'Door retains constructed frame and fittings');
assert(records.filter(o=>o.x===-4.65||o.x===-3.86).length>12,'Archive cabinetry has modeled drawer hardware');
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
 assert(stand(x,z),'One of the eight existing cinematic cameras was obstructed');
}
console.log(JSON.stringify({passed:true,mode:'source and geometry simulation',frontWallSize:[front.w,front.h,front.d],finishPrimitives:records.length,checks:['complete +Z shell','side paint/skirting','front and rear joins','door hardware','archive details','wall clearance','eight viewpoint footholds','syntax parses']},null,2));
