import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/lib/free-room.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {analyzeFreeRoom,diagonalExample,curveExample,pointOnWall,reflectRoom,moveVertex}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
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
