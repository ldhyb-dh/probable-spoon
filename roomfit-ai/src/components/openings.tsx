"use client";
import { useId,useState } from 'react';
import type { FormEvent } from 'react';
import { openingGeometry,validateOpening,wallLength } from '@/lib/free-room';
import type { Opening,Vertex,XY } from '@/lib/free-room';

type Props={vertices:Vertex[];items:Opening[];onChange:(items:Opening[])=>void;labels?:string[]};
export function OpeningEditor({vertices,items,onChange,labels}:Props){
  const prefix=useId();
  const [editing,setEditing]=useState<string|null>(null);
  const [type,setType]=useState<'door'|'window'>('door');
  const [wall,setWall]=useState('0');
  const [offset,setOffset]=useState('20');
  const [width,setWidth]=useState('80');
  const [hinge,setHinge]=useState<'start'|'end'>('start');
  const [swing,setSwing]=useState<'inside'|'outside'>('inside');
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const currentEditing=items.some(o=>o.id===editing)?editing:null;
  function submit(e:FormEvent){
    e.preventDefault();
    if(!offset.trim()||!width.trim()){setError('시작 거리와 폭을 입력해 주세요.');return;}
    const o:Opening={id:currentEditing??crypto.randomUUID(),type,wall:Number(wall),offset:Number(offset),width:Number(width),hinge,swing};
    const problem=validateOpening(vertices,o,items);setError(problem);if(problem)return;
    onChange(currentEditing?items.map(item=>item.id===currentEditing?o:item):[...items,o]);setEditing(null);setNotice(currentEditing?'문·창문을 수정했어요.':'문·창문을 추가했어요.');
  }
  function edit(o:Opening){setEditing(o.id);setType(o.type);setWall(String(o.wall));setOffset(String(o.offset));setWidth(String(o.width));setHinge(o.hinge);setSwing(o.swing);setError('');setNotice('');}
  return <section className="opening-editor" aria-labelledby={`${prefix}-title`}>
    <h2 id={`${prefix}-title`}>문·창문 배치</h2><p className="field-hint">벽을 고르고, 벽 시작점에서부터의 거리와 폭을 cm로 입력해 주세요. 곡선 벽의 거리는 벽을 따라 잽니다.</p>
    <form onSubmit={submit} noValidate>
      <div className="opening-fields">
        <label>종류<select value={type} onChange={e=>setType(e.target.value as Opening['type'])}><option value="door">문</option><option value="window">창문</option></select></label>
        <label>벽<select value={wall} onChange={e=>setWall(e.target.value)}>{Number(wall)<0&&<option value="-1">벽 다시 선택</option>}{vertices.map((a,i)=><option key={i} value={i}>{labels?.[i]??`벽 ${i+1}`} · {wallLength(a,vertices[(i+1)%vertices.length]).toFixed(1)}cm{a.bulge?' (곡선)':''}</option>)}</select></label>
        <label>시작 거리 (cm)<input type="number" min="0" step="1" value={offset} onChange={e=>setOffset(e.target.value)}/></label>
        <label>폭 (cm)<input type="number" min="10" step="1" value={width} onChange={e=>setWidth(e.target.value)}/></label>
        {type==='door'&&<><label>경첩 위치<select value={hinge} onChange={e=>setHinge(e.target.value as Opening['hinge'])}><option value="start">시작점 쪽</option><option value="end">끝점 쪽</option></select></label><label>열리는 방향<select value={swing} onChange={e=>setSwing(e.target.value as Opening['swing'])}><option value="inside">방 안쪽</option><option value="outside">방 바깥쪽</option></select></label></>}
      </div><p className="field-hint">기본형 벽 A는 첫 모서리에서 B 방향으로, 자유형 벽 1은 꼭짓점 1에서 2 방향으로 측정합니다. 문은 직선·사선 벽에, 창문은 곡선 벽에도 배치할 수 있어요.</p>
      {error&&<p className="field-error" role="alert">{error}</p>}
      <div className="custom-actions"><button type="submit">{currentEditing?'수정 반영':'문·창문 추가'}</button>{currentEditing&&<button type="button" onClick={()=>{setEditing(null);setError('');}}>수정 취소</button>}</div>
    </form><p className="field-hint" role="status">{notice}</p>
    {!items.length?<p className="field-hint">아직 배치한 문·창문이 없어요.</p>:<ul className="opening-list">{items.map((o,i)=>{const issue=validateOpening(vertices,o,items);return <li key={o.id}><div><strong>{o.type==='door'?'문':'창문'} {i+1}</strong><span>{labels?.[o.wall]??(o.wall<0?'벽 미지정':`벽 ${o.wall+1}`)} · 시작 {o.offset}cm · 폭 {o.width}cm</span>{issue&&<p className="field-error">{issue} 수정 버튼으로 다시 배치해 주세요.</p>}</div><div className="opening-row-actions"><button type="button" onClick={()=>edit(o)} aria-label={`${o.type==='door'?'문':'창문'} ${i+1} 수정`}>수정</button><button type="button" onClick={()=>{onChange(items.filter(v=>v.id!==o.id));if(editing===o.id)setEditing(null);}} aria-label={`${o.type==='door'?'문':'창문'} ${i+1} 삭제`}>삭제</button></div></li>;})}</ul>}
    <p className="opening-legend"><span>주황: 문 / 열림 방향</span><span>파랑: 창문</span></p>
  </section>;
}
export function OpeningMarks({vertices,items,project}:{vertices:Vertex[];items:Opening[];project:(p:XY)=>XY}){
  const line=(points:XY[])=>points.map((p,i)=>{const v=project(p);return `${i?'L':'M'}${v.x} ${v.y}`;}).join(' ');
  return <g className="opening-marks" pointerEvents="none">{items.map((o,i)=>{
    if(validateOpening(vertices,o,items))return null;
    const g=openingGeometry(vertices,o),color=o.type==='door'?'#ae572b':'#2679a4',mid=project(g.path[8]);
    return <g key={o.id} role="img" aria-label={`${o.type==='door'?'문':'창문'} ${i+1}, 폭 ${o.width}cm`}><path d={line(g.path)} stroke="#fffdf9" strokeWidth="9" fill="none"/><path d={line(g.path)} stroke={color} strokeWidth={o.type==='door'?1:4} fill="none"/>{o.type==='door'&&<><path d={line([g.hinge,g.leaf])} stroke={color} strokeWidth="2" fill="none"/><path d={line(g.arc)} stroke={color} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/></>}<text x={mid.x} y={mid.y+18} textAnchor="middle" fill={color} fontSize="11" paintOrder="stroke" stroke="#fffdf9" strokeWidth="3">{o.type==='door'?'문':'창'} {i+1}</text></g>;
  })}</g>;
}
