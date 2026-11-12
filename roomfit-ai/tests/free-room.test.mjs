import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/lib/free-room.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {analyzeFreeRoom,diagonalExample,curveExample,pointOnWall,reflectRoom,moveVertex,validateOpening,openingGeometry,pointAtWallDistance,remapOpenings,nearestOpeningPosition}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const v=(x,y,bulge=0)=>({x,y,bulge});
const near=(a,b,e=1e-5)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('diagonal edges use Euclidean length and polygon area',()=>{
 const result=analyzeFreeRoom(diagonalExample);assert.equal(result.error,'');near(result.area,176000);near(result.perimeter,1200+2*Math.hypot(80,200));
});
test('quadratic curved wall has the expected midpoint and exact area contribution',()=>{
 const a=curveExample[1],b=curveExample[2];assert.deepEqual(pointOnWall(a,b,.5),{x:480,y:200});
 const result=analyzeFreeRoom(curveExample);assert.equal(result.error,'');near(result.area,160000+2/3*400*80);assert.ok(result.perimeter>1600);
});
test('curved length matches independent dense polyline approximation',()=>{
 const result=analyzeFreeRoom(curveExample);let length=0,previous=pointOnWall(curveExample[1],curveExample[2],0);
 for(let j=1;j<=10000;j++){const p=pointOnWall(curveExample[1],curveExample[2],j/10000);length+=Math.hypot(p.x-previous.x,p.y-previous.y);previous=p;}
 near(result.lengths[1],length,0.0001);
});
test('zero bulge is a straight line and reversing order preserves geometry',()=>{
 const points=[v(0,0),v(400,0),v(400,400),v(0,400)];const r=analyzeFreeRoom(points);near(r.area,160000);near(r.perimeter,1600);
 const reversed=curveExample.map((_,i)=>{const old=curveExample.length-1-i,prev=(old+curveExample.length-1)%curveExample.length;return {...curveExample[old],bulge:-curveExample[prev].bulge};});
 const a=analyzeFreeRoom(curveExample),b=analyzeFreeRoom(reversed);assert.equal(b.error,'');near(a.area,b.area);near(a.perimeter,b.perimeter);
});
test('crossing, overlapping, collapsed, invalid and oversized inputs are rejected',()=>{
 for(const p of [
 [v(0,0),v(400,400),v(0,400),v(400,0)],
 [v(0,0),v(400,0),v(200,0),v(200,400),v(0,400)],
 [v(0,0),v(0,0),v(100,100)],
 [v(0,0),v(NaN,0),v(100,100)],
 [v(0,0),v(2001,0),v(100,100)],
 [v(0,0,501),v(400,0),v(400,400),v(0,400)],
 [v(0,0),v(100,0),v(200,0)],
 [v(0,0),v(100,100)],
 Array.from({length:13},(_,i)=>v(i*10,100))
 ])assert.ok(analyzeFreeRoom(p).error);
});
test('curving into the opposite wall is rejected',()=>{
 const result=analyzeFreeRoom([v(0,0),v(400,0,450),v(400,400),v(0,400)]);assert.ok(result.error);
});

test('reflection preserves curved area and wall lengths, mirrors all curve points',()=>{
 for(const axis of ['horizontal','vertical']){
  const mirrored=reflectRoom(curveExample,axis),a=analyzeFreeRoom(curveExample),b=analyzeFreeRoom(mirrored);
  assert.equal(b.error,'');near(a.area,b.area);near(a.perimeter,b.perimeter);
  assert.deepEqual(reflectRoom(mirrored,axis),curveExample);
  for(let i=0;i<curveExample.length;i++)for(const t of [0,.25,.5,.75,1]){
   const p=pointOnWall(curveExample[i],curveExample[(i+1)%curveExample.length],t),q=pointOnWall(mirrored[i],mirrored[(i+1)%mirrored.length],t);
   near(q.x,axis==='horizontal'?400-p.x:p.x);near(q.y,axis==='vertical'?400-p.y:p.y);
  }
 }
});
test('moving vertices uses original drag position, clamps, rounds, and avoids collapsed neighbors',()=>{
 const moved=moveVertex(diagonalExample,1,50.4,30.7);
 assert.equal(moved[1].x,450);assert.equal(moved[1].y,31);assert.equal(diagonalExample[1].x,400);
 assert.equal(moveVertex(diagonalExample,1,5000,5000)[1].x,2000);
 assert.deepEqual(moveVertex(diagonalExample,1,-400,0),diagonalExample);
 assert.deepEqual(moveVertex(diagonalExample,1,NaN,0),diagonalExample);
 assert.equal(analyzeFreeRoom(moved).error,'');
});

test('openings validate wall bounds and reject overlaps across doors and windows',()=>{
 const points=[v(0,0),v(400,0),v(400,400),v(0,400)];
 const o={id:'a',type:'door',wall:0,offset:20,width:80,hinge:'start',swing:'inside'};
 assert.equal(validateOpening(points,o), '');
 assert.equal(validateOpening(points,{...o,offset:320}), '');
 assert.ok(validateOpening(points,{...o,offset:321}));
 assert.ok(validateOpening(points,{...o,offset:-1}));assert.ok(validateOpening(points,{...o,width:9}));
 assert.ok(validateOpening(points,{...o,wall:-1}));assert.ok(validateOpening(points,{...o,wall:4}));
 assert.ok(validateOpening(points,{...o,id:'b',type:'window',offset:90},[o]));
 assert.equal(validateOpening(points,{...o,id:'b',offset:100},[o]),'');
 assert.equal(validateOpening(points,o,[o]),'');
});
test('straight/slanted doors have correctly sized swing arcs and hinges',()=>{
 const points=[v(0,0),v(300,400),v(-200,500)];
 const o={id:'a',type:'door',wall:0,offset:50,width:80,hinge:'start',swing:'inside'};
 const g=openingGeometry(points,o);near(g.start.x,30);near(g.start.y,40);near(Math.hypot(g.end.x-g.start.x,g.end.y-g.start.y),80);
 near(Math.hypot(g.leaf.x-g.hinge.x,g.leaf.y-g.hinge.y),80);
 assert.deepEqual(openingGeometry(points,{...o,hinge:'end'}).hinge,g.end);
 const outer=openingGeometry(points,{...o,swing:'outside'});near((g.leaf.x+outer.leaf.x)/2,g.hinge.x);near((g.leaf.y+outer.leaf.y)/2,g.hinge.y);
});
test('windows follow curved arc length; doors on curved walls are rejected',()=>{
 const o={id:'a',type:'window',wall:1,offset:50,width:150,hinge:'start',swing:'inside'};
 assert.equal(validateOpening(curveExample,o),'');assert.ok(validateOpening(curveExample,{...o,type:'door'}));
 const g=openingGeometry(curveExample,o);assert.ok(g.path.some(p=>p.x>400));
 const start=pointAtWallDistance(curveExample[1],curveExample[2],0),end=pointAtWallDistance(curveExample[1],curveExample[2],10000);
 near(start.x,400);near(start.y,0);near(end.x,400);near(end.y,400);
});
test('door and curved-window positions reflect with the room',()=>{
 for(const points of [diagonalExample,curveExample])for(const axis of ['horizontal','vertical']){
  const o={id:'a',type:'window',wall:1,offset:10,width:80,hinge:'start',swing:'inside'};
  const a=openingGeometry(points,o),mirrored=reflectRoom(points,axis),b=openingGeometry(mirrored,o);
  const maxX=Math.max(...points.map(p=>p.x)),maxY=Math.max(...points.map(p=>p.y));
  for(let i=0;i<a.path.length;i++){near(b.path[i].x,axis==='horizontal'?maxX-a.path[i].x:a.path[i].x,.01);near(b.path[i].y,axis==='vertical'?maxY-a.path[i].y:a.path[i].y,.01);}
 }
});
test('topology changes retain unaffected openings and mark changed walls for reassignment',()=>{
 const items=[0,1,2,3].map(wall=>({id:String(wall),type:'window',wall,offset:20,width:50,hinge:'start',swing:'inside'}));
 assert.deepEqual(remapOpenings(items,1,'insert',4).map(o=>o.wall),[0,-1,3,4]);
 assert.deepEqual(remapOpenings(items,0,'remove',4).map(o=>o.wall),[-1,0,1,-1]);
 assert.deepEqual(remapOpenings([{...items[0],wall:-1}],0,'insert',4)[0].wall,-1);
});

test('door swing and hinge reflect without changing opening direction relative to the room',()=>{
 for(const axis of ['horizontal','vertical'])for(const hinge of ['start','end'])for(const swing of ['inside','outside']){
  const o={id:'door',type:'door',wall:0,offset:20,width:80,hinge,swing};
  const a=openingGeometry(diagonalExample,o),b=openingGeometry(reflectRoom(diagonalExample,axis),o);
  for(const key of ['hinge','leaf']){near(b[key].x,axis==='horizontal'?480-a[key].x:a[key].x);near(b[key].y,axis==='vertical'?400-a[key].y:a[key].y);}
 }
});


test('pointer placement snaps to straight/slanted walls and clamps the entire opening',()=>{
 const points=[v(0,0),v(400,0),v(400,400),v(0,400)],project=p=>p;
 let hit=nearestOpeningPosition(points,{x:200,y:5},project,80,24);assert.equal(hit.wall,0);near(hit.offset,160);
 hit=nearestOpeningPosition(points,{x:395,y:0},project,80,24);near(hit.offset,320);
 assert.equal(nearestOpeningPosition(points,{x:200,y:200},project,80,24),null);
 const slope=[v(0,0),v(300,400),v(-100,500)];hit=nearestOpeningPosition(slope,{x:150,y:200},project,80,24);assert.equal(hit.wall,0);near(hit.offset,210);
});
test('pointer placement handles reflected/scaled viewports and curved walls',()=>{
 const project=p=>({x:600-p.x*.5,y:40+p.y*.5});
 const points=[v(0,0),v(400,0),v(400,400),v(0,400)];
 const hit=nearestOpeningPosition(points,project({x:200,y:0}),project,80,24);assert.equal(hit.wall,0);near(hit.offset,160);
 const mid=pointOnWall(curveExample[1],curveExample[2],.5);
 const curved=nearestOpeningPosition(curveExample,mid,p=>p,100,24);assert.equal(curved.wall,1);assert.ok(curved.offset>150);
 const item={id:'preview',type:'window',wall:curved.wall,offset:curved.offset,width:100,hinge:'start',swing:'inside'};
 assert.equal(validateOpening(curveExample,item),'');
 const nearEnd=nearestOpeningPosition(curveExample,pointOnWall(curveExample[1],curveExample[2],.98),p=>p,100,24);
 assert.equal(validateOpening(curveExample,{...item,wall:nearEnd.wall,offset:nearEnd.offset}),'');
});
