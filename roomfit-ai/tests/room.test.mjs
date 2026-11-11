import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/lib/room.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {parseRoom,measureRoom,fitRoom}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const example={width:'400',depth:'500',cutWidth:'180',cutDepth:'200',leftWing:'100'};

test('rectangle, L and U have correct wall counts, areas and perimeters',()=>{
  for(const [shape,count,area,perimeter] of [['rectangle',4,200000,1800],['l',6,164000,1800],['u',8,164000,2200]]){
    const {room,errors}=parseRoom(shape,example);assert.deepEqual(errors,{});assert.ok(room);
    const measured=measureRoom(room);assert.equal(measured.walls.length,count);assert.equal(measured.area,area);assert.equal(measured.perimeter,perimeter);
    for(const wall of measured.walls){assert.ok(wall.length>0);assert.ok(wall.start.x===wall.end.x||wall.start.y===wall.end.y);}
    assert.deepEqual(measured.walls.at(-1).end,measured.points[0]);
  }
});
test('equal total perimeters cannot uniquely identify area or shape',()=>{
  const a=measureRoom(parseRoom('rectangle',example).room);
  const b=measureRoom(parseRoom('l',example).room);
  assert.equal(a.perimeter,b.perimeter);assert.notEqual(a.area,b.area);
});
test('invalid numeric dimensions and boundaries are checked',()=>{
  for(const value of ['', ' ', 'abc', 'Infinity', '0', '-10', '99', '2001', '360.5']){
    assert.equal(parseRoom('rectangle',{...example,width:value}).room,null);
    assert.ok(parseRoom('rectangle',{...example,depth:value}).errors.depth);
  }
  for(const value of ['100','2000'])assert.ok(parseRoom('rectangle',{width:value,depth:value}).room);
  assert.ok(parseRoom('l',{...example,cutWidth:'10',cutDepth:'10'}).room);
  assert.equal(parseRoom('l',{...example,cutWidth:'9'}).room,null);
});
test('cutouts cannot collapse, overlap or exceed the outer walls',()=>{
  for(const shape of ['l','u']){
    assert.ok(parseRoom(shape,{...example,cutWidth:'400'}).errors.cutWidth);
    assert.ok(parseRoom(shape,{...example,cutDepth:'500'}).errors.cutDepth);
  }
  assert.ok(parseRoom('u',{...example,leftWing:'220'}).errors.leftWing);
  assert.ok(parseRoom('u',{...example,leftWing:'230'}).errors.leftWing);
  assert.ok(parseRoom('u',{...example,leftWing:'219'}).room);
});
test('shape coordinates preserve scale and stay in canvas with margins',()=>{
  for(const shape of ['rectangle','l','u']){
    const room=parseRoom(shape,example).room, raw=measureRoom(room), fitted=fitRoom(room);
    for(let i=0;i<fitted.points.length;i++){
      const p=fitted.points[i],q=fitted.points[(i+1)%fitted.points.length];
      assert.ok(p.x>=80&&p.x<=560&&p.y>=80&&p.y<=400);
      assert.ok(Math.abs(Math.hypot(p.x-q.x,p.y-q.y)/fitted.scale-raw.walls[i].length)<1e-8);
    }
  }
  for(const [width,depth] of [['100','2000'],['2000','100']]){
    const plan=fitRoom(parseRoom('rectangle',{width,depth}).room);
    for(const p of plan.points)assert.ok(p.x>=80&&p.x<=560&&p.y>=80&&p.y<=400);
  }
});
