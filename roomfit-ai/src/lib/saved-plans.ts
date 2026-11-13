import type {Room} from './room';
import type {Opening,Vertex} from './free-room';
import type {FurnitureItem} from './furniture-types';
export type TemplateSnapshot={mode:'template';room:Room;horizontal:boolean;vertical:boolean;openings:Opening[];furniture:FurnitureItem[]};
export type CustomSnapshot={mode:'custom';vertices:Vertex[];openings:Opening[];furniture:FurnitureItem[]};
export type PlanSnapshot=TemplateSnapshot|CustomSnapshot;
export type SavedPlan={id:string;name:string;savedAt:number;snapshot:PlanSnapshot};
const object=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value);
const text=(value:unknown,max:number):value is string=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
const kinds=new Set(['bed','desk','wardrobe','sofa','table','chair','fridge','sink','washer','microwave','tv','bookshelf','drawer','shoe-cabinet','hanger','dining-table','stove','custom']);
const uniqueIds=(values:Record<string,unknown>[])=>new Set(values.map(v=>v.id)).size===values.length;
function roomValid(r:unknown):boolean{
 if(!object(r)||!['rectangle','l','u'].includes(String(r.shape)))return false;
 if(!['width','depth','cutWidth','cutDepth','leftWing'].every(k=>finite(r[k])&&Number.isInteger(r[k])))return false;
 const w=r.width as number,h=r.depth as number,c=r.cutWidth as number,d=r.cutDepth as number,l=r.leftWing as number;
 if(w<100||w>2000||h<100||h>2000)return false;
 if(r.shape!=='rectangle'&&(c<10||d<10||c>=w||d>=h))return false;
 return r.shape!=='u'||(l>=10&&l+c<w);
}
function verticesValid(value:unknown):boolean{
 if(!Array.isArray(value)||value.length<3||value.length>12)return false;
 return value.every((p,i)=>object(p)&&finite(p.x)&&finite(p.y)&&finite(p.bulge)&&Math.abs(p.x)<=2000&&Math.abs(p.y)<=2000&&Math.abs(p.bulge)<=500&&object(value[(i+1)%value.length])&&finite(value[(i+1)%value.length].x)&&finite(value[(i+1)%value.length].y)&&Math.hypot(p.x-value[(i+1)%value.length].x,p.y-value[(i+1)%value.length].y)>=1);
}
export function validSnapshot(value:unknown):value is PlanSnapshot{
 if(!object(value)||!['template','custom'].includes(String(value.mode))||!Array.isArray(value.openings)||!Array.isArray(value.furniture)||value.openings.length>100||value.furniture.length>100)return false;
 let wallCount=0;
 if(value.mode==='template'){
  if(!roomValid(value.room)||!object(value.room)||typeof value.horizontal!=='boolean'||typeof value.vertical!=='boolean')return false;
  wallCount=value.room.shape==='rectangle'?4:value.room.shape==='l'?6:8;
 }else{if(!verticesValid(value.vertices)||!Array.isArray(value.vertices))return false;wallCount=value.vertices.length;}
 const openings=value.openings as unknown[], furniture=value.furniture as unknown[];
 if(!openings.every(o=>object(o)&&text(o.id,200)&&['door','window'].includes(String(o.type))&&finite(o.wall)&&Number.isInteger(o.wall)&&o.wall>=-1&&o.wall<wallCount&&finite(o.offset)&&o.offset>=0&&o.offset<=100000&&finite(o.width)&&o.width>=10&&o.width<=100000&&['start','end'].includes(String(o.hinge))&&['inside','outside'].includes(String(o.swing))))return false;
 if(!furniture.every(f=>object(f)&&text(f.id,200)&&text(f.name,40)&&typeof f.kind==='string'&&kinds.has(f.kind)&&finite(f.width)&&f.width>=10&&f.width<=1000&&finite(f.depth)&&f.depth>=10&&f.depth<=1000&&finite(f.x)&&Math.abs(f.x)<=2000&&finite(f.y)&&Math.abs(f.y)<=2000&&finite(f.rotation)&&Math.abs(f.rotation)<=360&&(f.fixed===undefined||typeof f.fixed==='boolean')&&(f.replaceable===undefined||typeof f.replaceable==='boolean')))return false;
 return uniqueIds(openings as Record<string,unknown>[])&&uniqueIds(furniture as Record<string,unknown>[]);
}
export function decodePlans(raw:string|null):{status:'ok'|'corrupt';plans:SavedPlan[]}{
 if(raw===null)return {status:'ok',plans:[]};
 try{
  const data:unknown=JSON.parse(raw);
  if(!object(data)||data.version!==1||!Array.isArray(data.plans)||data.plans.length>50)return {status:'corrupt',plans:[]};
  if(!data.plans.every((p:unknown)=>object(p)&&text(p.id,200)&&text(p.name,60)&&finite(p.savedAt)&&p.savedAt>=0&&validSnapshot(p.snapshot))||!uniqueIds(data.plans))return {status:'corrupt',plans:[]};
  return {status:'ok',plans:data.plans as SavedPlan[]};
 }catch{return {status:'corrupt',plans:[]};}
}
export function encodePlans(plans:SavedPlan[]):string{return JSON.stringify({version:1,plans});}
