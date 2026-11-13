import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/lib/saved-plans.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const {decodePlans,encodePlans,validSnapshot}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const furniture={id:'f1',kind:'chair',name:'의자',width:50,depth:50,x:120,y:140,rotation:90};
const opening={id:'o1',type:'door',wall:0,offset:20,width:80,hinge:'start',swing:'inside'};
const room={shape:'rectangle',width:400,depth:500,cutWidth:0,cutDepth:0,leftWing:0};
const template={mode:'template',room,horizontal:true,vertical:false,openings:[opening],furniture:[furniture]};
const custom={mode:'custom',vertices:[{x:0,y:0,bulge:0},{x:400,y:0,bulge:30},{x:400,y:500,bulge:0},{x:0,y:500,bulge:0}],openings:[{...opening,type:'window',wall:1}],furniture:[{...furniture,kind:'fridge',name:'냉장고'}]};
test('template and curved custom snapshots round-trip with flips, openings and furniture',()=>{
 const plans=[{id:'p1',name:'내 방',savedAt:1,snapshot:template},{id:'p2',name:'주방',savedAt:2,snapshot:custom}];
 assert.deepEqual(decodePlans(encodePlans(plans)),{status:'ok',plans});
});
test('empty store is ready and corrupted or future versions are rejected without dropping records',()=>{
 assert.deepEqual(decodePlans(null),{status:'ok',plans:[]});
 for(const raw of ['{broken','null','[]',JSON.stringify({version:2,plans:[]}),JSON.stringify({version:1,plans:[{id:'p'}]})])assert.equal(decodePlans(raw).status,'corrupt');
});
test('openings and furniture with broken data are rejected while unassigned openings are retained',()=>{
 assert.equal(validSnapshot({...template,openings:[{...opening,wall:-1}]}),true);
 for(const bad of [{...opening,wall:4},{...opening,width:0},{...opening,offset:-1},{...opening,type:'other'}])assert.equal(validSnapshot({...template,openings:[bad]}),false);
 for(const bad of [{...furniture,width:0},{...furniture,rotation:361},{...furniture,x:2001},{...furniture,kind:'unknown'}])assert.equal(validSnapshot({...template,furniture:[bad]}),false);
 assert.equal(validSnapshot({...template,furniture:[furniture,{...furniture}]}),false);
});
test('invalid room shapes and invalid vertex structures are rejected',()=>{
 assert.equal(validSnapshot({...template,room:{...room,shape:'u',cutWidth:300,cutDepth:100,leftWing:100}}),false);
 assert.equal(validSnapshot({...template,room:{...room,width:99}}),false);
 assert.equal(validSnapshot({...custom,vertices:custom.vertices.slice(0,2)}),false);
 assert.equal(validSnapshot({...custom,vertices:custom.vertices.map(p=>({...p,x:3000}))}),false);
});
test('storage enforces 50-entry limit and unique saved plan IDs',()=>{
 const one={id:'same',name:'방',savedAt:1,snapshot:template};
 assert.equal(decodePlans(JSON.stringify({version:1,plans:[one,one]})).status,'corrupt');
 assert.equal(decodePlans(JSON.stringify({version:1,plans:Array.from({length:51},(_,i)=>({...one,id:String(i)}))})).status,'corrupt');
});

test('furniture preference flags persist and older saves remain valid',()=>{
 const legacy={id:'old',name:'이전 배치',savedAt:1,snapshot:template};
 const updated={...legacy,id:'new',snapshot:{...template,furniture:[{...furniture,fixed:true,replaceable:true}]}};
 assert.deepEqual(decodePlans(encodePlans([legacy,updated])),{status:'ok',plans:[legacy,updated]});
 assert.equal(validSnapshot({...template,furniture:[{...furniture,fixed:'yes'}]}),false);
 assert.equal(validSnapshot({...template,furniture:[{...furniture,replaceable:1}]}),false);
});
