"use client";
import {useEffect,useState} from 'react';
import type {MouseEvent,PointerEvent} from 'react';
import {nearestOpeningPosition,validateOpening} from '@/lib/free-room';
import type {Opening,Vertex,XY} from '@/lib/free-room';
import {OpeningMarks} from './openings';

export function useOpeningPlacement(vertices:Vertex[],items:Opening[],onChange:(items:Opening[])=>void){
  const [tool,setTool]=useState<Opening['type']|null>(null);
  const [width,setWidth]=useState('80');
  const [hinge,setHinge]=useState<Opening['hinge']>('start');
  const [swing,setSwing]=useState<Opening['swing']>('inside');
  const [position,setPosition]=useState<{wall:number;offset:number;locked:boolean}|null>(null);
  const [editing,setEditing]=useState<string|null>(null);
  const [notice,setNotice]=useState('');
  function cancel(){setTool(null);setPosition(null);setEditing(null);setNotice('배치를 취소했어요.');}
  useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setTool(null);setPosition(null);setEditing(null);setNotice('배치를 취소했어요.');}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[]);
  const preview:Opening|null=tool&&position?{id:editing??'__pending__',type:tool,wall:position.wall,offset:position.offset,width:width.trim()?Number(width):NaN,hinge,swing}:null;
  const issue=preview?validateOpening(vertices,preview,items):'';
  function choose(type:Opening['type']){setTool(type);setWidth(type==='door'?'80':'100');setPosition(null);setEditing(null);setNotice('평면도의 원하는 벽으로 마우스를 옮겨보세요.');}
  function pick(e:PointerEvent<SVGSVGElement>|MouseEvent<SVGSVGElement>,project:(p:XY)=>XY,lock=false){
    if(!tool||(!lock&&position?.locked))return;
    const svg=e.currentTarget,matrix=svg.getScreenCTM();if(!matrix)return;
    const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
    const hit=nearestOpeningPosition(vertices,p,project,Number.isFinite(Number(width))?Math.max(0,Number(width)):80,24/Math.max(.01,Math.hypot(matrix.a,matrix.b)));
    setPosition(hit?{wall:hit.wall,offset:hit.offset,locked:lock}:null);
    if(lock)setNotice(hit?'위치를 선택했어요. 미리보기를 확인한 뒤 배치 확정을 누르세요.':'벽 가까이를 선택해 주세요.');
  }
  function confirm(){
    if(!preview||!position?.locked||issue)return;
    if(editing&&!items.some(o=>o.id===editing)){cancel();return;}
    const item={...preview,id:editing??crypto.randomUUID()};
    onChange(editing?items.map(o=>o.id===editing?item:o):[...items,item]);
    setTool(null);setPosition(null);setEditing(null);setNotice('배치를 확정했어요.');
  }
  function edit(o:Opening){requestAnimationFrame(()=>document.querySelector('[data-placement-toolbar]')?.scrollIntoView({behavior:'smooth',block:'center'}));setTool(o.type);setWidth(String(o.width));setHinge(o.hinge);setSwing(o.swing);setEditing(o.id);setPosition({wall:o.wall,offset:o.offset,locked:true});setNotice('미리보기 상태입니다. 벽의 다른 위치를 클릭해 옮기고 배치 확정으로 반영하세요.');}
  return {tool,width,setWidth,hinge,setHinge,swing,setSwing,position,preview,issue,notice,choose,cancel,pick,confirm,edit,
    leave:()=>{if(!position?.locked)setPosition(null);},
    visibleItems:items.filter(o=>o.id!==editing)};
}
export type Placement=ReturnType<typeof useOpeningPlacement>;
function ToolIcon({kind}:{kind:'door'|'window'}){return <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">{kind==='door'?<><path d="M5 27V5h18v22M7 27h20M7 7l12 5v15H7Z"/><circle cx="15" cy="19" r="1"/></>:<><rect x="5" y="6" width="22" height="20" rx="1"/><path d="M16 6v20M5 16h22"/></>}</svg>;}
export function PlacementToolbar({placement:p,onSelect}:{placement:Placement;onSelect?:()=>void}){
  return <div className="placement-toolbar" data-placement-toolbar><div className="placement-tools" role="group" aria-label="문·창문 배치 도구"><button type="button" aria-label="문 아이콘으로 배치" aria-pressed={p.tool==='door'} onClick={()=>{onSelect?.();p.choose('door');}}><ToolIcon kind="door"/><span>문</span></button><button type="button" aria-label="창문 아이콘으로 배치" aria-pressed={p.tool==='window'} onClick={()=>{onSelect?.();p.choose('window');}}><ToolIcon kind="window"/><span>창문</span></button>{p.tool&&<button type="button" onClick={p.cancel}>선택 취소</button>}</div>
    {p.tool?<><div className="placement-settings"><label>폭 (cm)<input type="number" min="10" step="1" value={p.width} onChange={e=>p.setWidth(e.target.value)}/></label>{p.tool==='door'&&<><label>경첩<select value={p.hinge} onChange={e=>p.setHinge(e.target.value as Opening['hinge'])}><option value="start">시작점 쪽</option><option value="end">끝점 쪽</option></select></label><label>열림 방향<select value={p.swing} onChange={e=>p.setSwing(e.target.value as Opening['swing'])}><option value="inside">방 안쪽</option><option value="outside">방 바깥쪽</option></select></label></>}</div><p className="field-hint">벽 가까이 이동 → 미리보기 → 클릭/터치로 위치 선택 → 배치 확정. 다른 벽을 클릭하면 다시 선택할 수 있어요. Esc로 취소합니다.</p>{p.preview&&<p className={p.issue?'field-error':'placement-status'} role="status">{p.issue||`미리보기 · 벽 ${p.preview.wall+1} · 시작 ${p.preview.offset.toFixed(1)}cm · 폭 ${p.preview.width}cm${p.position?.locked?' · 위치 선택됨':''}`}</p>}<button className="button placement-confirm" type="button" disabled={!p.position?.locked||!!p.issue} onClick={p.confirm}>배치 확정</button></>:<p className="field-hint">문 또는 창문 아이콘을 선택하고 평면도에 놓아보세요.</p>}
    <p className="field-hint" role="status">{p.notice}</p>
  </div>;
}
export function PlacementPreview({vertices,placement:p,project}:{vertices:Vertex[];placement:Placement;project:(p:XY)=>XY}){
  return p.preview?<OpeningMarks vertices={vertices} items={[p.preview]} project={project} preview invalid={!!p.issue}/>:null;
}
