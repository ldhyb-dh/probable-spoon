import {test} from 'node:test';
import assert from 'node:assert/strict';
import {furnitureCorners,validFurniture,pointInside,fitsRoom,furnitureOverlap,furnitureIssues,reflectFurniture} from '../src/lib/furniture.mjs';

const room=[{x:0,y:0},{x:400,y:0},{x:400,y:500},{x:0,y:500}];
const item=(extra={})=>({id:'a',kind:'bed',name:'침대',width:100,depth:100,x:100,y:100,rotation:0,...extra});
test('inside, outside and exact boundary contact are distinguished',()=>{
 assert.equal(fitsRoom(item(),room),true);
 assert.equal(fitsRoom(item({x:0}),room),false);
 assert.equal(fitsRoom(item({x:50,y:50}),room),true);
 assert.equal(fitsRoom(item({x:50,y:50,rotation:45}),room),false);
});
test('SAT catches rotated overlap but permits edge contact and separation',()=>{
 assert.equal(furnitureOverlap(item(),item({id:'b',x:150})),true);
 assert.equal(furnitureOverlap(item(),item({id:'b',x:200})),false);
 assert.equal(furnitureOverlap(item(),item({id:'b',x:250})),false);
 assert.equal(furnitureOverlap(item({rotation:45}),item({id:'b',x:170,rotation:30})),true);
});
test('U-shaped void cannot be bridged even when all four furniture corners are inside',()=>{
 const u=[{x:0,y:0},{x:100,y:0},{x:100,y:200},{x:300,y:200},{x:300,y:0},{x:400,y:0},{x:400,y:400},{x:0,y:400}];
 const bridge=item({x:200,y:100,width:350,depth:100});
 assert.equal(furnitureCorners(bridge).every(p=>pointInside(p,u)),true);
 assert.equal(fitsRoom(bridge,u),false);
 assert.equal(fitsRoom(item({x:200,y:300,width:150,depth:100}),u),true);
});
test('L-shaped cutout and diagonal boundary are respected',()=>{
 const l=[{x:0,y:0},{x:400,y:0},{x:400,y:200},{x:200,y:200},{x:200,y:400},{x:0,y:400}];
 assert.equal(fitsRoom(item({x:300,y:300}),l),false);
 const triangle=[{x:0,y:0},{x:400,y:0},{x:0,y:400}];
 assert.equal(fitsRoom(item({x:100,y:100,width:50,depth:50}),triangle),true);
 assert.equal(fitsRoom(item({x:300,y:300,width:50,depth:50}),triangle),false);
});
test('sampled curved boundary supports containment checks',()=>{
 const circle=Array.from({length:128},(_,i)=>({x:200+200*Math.cos(i/128*Math.PI*2),y:200+200*Math.sin(i/128*Math.PI*2)}));
 assert.equal(fitsRoom(item({x:200,y:200}),circle),true);
 assert.equal(fitsRoom(item({x:200,y:200,width:400,depth:400}),circle),false);
});
test('invalid dimensions, non-finite coordinates and extreme angles are rejected',()=>{
 for(const extra of [{width:0},{depth:-1},{width:1001},{x:NaN},{y:Infinity},{rotation:361},{x:2001}])assert.equal(validFurniture(item(extra)),false);
 assert.equal(validFurniture(item({width:10,depth:1000,x:-2000,rotation:-360})),true);
});
test('self collision is ignored, other furniture produces an actionable issue',()=>{
 const a=item();
 assert.equal(furnitureIssues(a,[a],room).length,0);
 assert.equal(furnitureIssues(a,[a,item({id:'b',name:'책상',x:120})],room).some(s=>s.includes('책상')),true);
});
test('reflection preserves furniture containment and returns to original after two flips',()=>{
 const a=item({rotation:25});
 for(const axis of ['horizontal','vertical']){
  const reflected=reflectFurniture([a],axis,room);
  assert.equal(fitsRoom(reflected[0],room),true);
  const restored=reflectFurniture(reflected,axis,room)[0];
  for(const key of ['x','y','width','depth','rotation'])assert.equal(restored[key],a[key]);
 }
});
test('ninety-degree rotation swaps the furniture footprint dimensions',()=>{
 const p=furnitureCorners(item({width:100,depth:200,rotation:90}));
 const x=p.map(v=>v.x),y=p.map(v=>v.y);
 assert.equal(Math.abs(Math.max(...x)-Math.min(...x)-200)<1e-7,true);
 assert.equal(Math.abs(Math.max(...y)-Math.min(...y)-100)<1e-7,true);
});
