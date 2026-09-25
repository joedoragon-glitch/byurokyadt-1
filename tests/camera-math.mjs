// Uses the vendored Three.js math and production camera controller, without a GPU.
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const elements=new Map();
const element=id=>{if(!elements.has(id))elements.set(id,{style:{},value:id==='cinemaFrame'?'1.7777777778':'',hidden:false,append(){},setAttribute(){},contains(){return false},focus(){},blur(){},addEventListener(){}});return elements.get(id)};
const sandbox={console:{warn(){},log(){}},window:{},document:{getElementById:element,createElement:()=>element('option'),body:{classList:{add(){},remove(){}}}},matchMedia:()=>({matches:false}),innerWidth:960,innerHeight:680,addEventListener(){},setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(await readFile('vendor/three.min.js','utf8'),sandbox);const T=sandbox.THREE;assert(T);
// Read the actual scene's obstacle map so the test follows real furniture bounds.
const app=await readFile('js/app.js','utf8'),start=app.indexOf('const obstacles=['),end=app.indexOf('function walk(',start);vm.runInContext(app.slice(start,end),sandbox);const canStand=vm.runInContext('canStand',sandbox);
vm.runInContext(await readFile('js/cinematic.js','utf8'),sandbox);
const camera=new T.PerspectiveCamera(62,960/680,.05,80);camera.rotation.order='YXZ';camera.position.set(0,1.7,2.7);
const renderer={setSize(){},domElement:{style:{},addEventListener(){}}},cinema=sandbox.window.createMinistryCinema({T,camera,renderer,scene:new T.Scene(),canStand,invalidate(){},syncLook(){},clearKeys(){},isModal:()=>false});
const home=camera.position.clone();cinema.enter();let samples=0,routes=0;
function settle(){let ticks=0;while(cinema.travelling&&ticks++<3000){cinema.tick(1/60);assert(canStand(camera.position.x,camera.position.z),'Camera stays outside furniture and walls');assert(Number.isFinite(camera.quaternion.w));samples++}assert(!cinema.travelling,'Camera path terminates');}
settle();const shots=cinema.shots();
for(let i=0;i<shots.length;i++)for(let j=0;j<shots.length;j++){
 camera.position.set(...shots[i].p);element('cinemaShot').onchange({target:{value:String(j)}});settle();assert(camera.position.distanceTo(new T.Vector3(...shots[j].p))<.001,'Camera reaches requested view');routes++;
}
cinema.exit();assert(camera.position.distanceTo(home)<.0001);assert.equal(camera.fov,62);
console.log(JSON.stringify({passed:true,routes,samples,checks:['all 64 viewpoint routes','furniture and wall clearance','finite orientations','arrival at all eight views','operator camera restored']},null,2));
