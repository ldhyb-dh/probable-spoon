"use client";
import { openingGeometry,validateOpening } from '@/lib/free-room';
import type { Opening,Vertex,XY } from '@/lib/free-room';

type Props={vertices:Vertex[];items:Opening[];onChange:(items:Opening[])=>void;labels?:string[];onEdit:(item:Opening)=>void};
export function OpeningEditor({vertices,items,onChange,labels,onEdit}:Props){
  return <section className="opening-editor" aria-label="배치한 문·창문 목록"><h2>문·창문 배치</h2><p className="field-hint">평면도 위의 문·창문 아이콘으로 직접 배치하세요. 위치를 고르고 미리보기를 확인한 뒤 배치 확정을 눌러야 추가됩니다.</p>
    {!items.length?<p className="field-hint">아직 확정한 문·창문이 없어요.</p>:<ul className="opening-list">{items.map((o,i)=>{const issue=validateOpening(vertices,o,items);return <li key={o.id}><div><strong>{o.type==='door'?'문':'창문'} {i+1}</strong><span>{labels?.[o.wall]??(o.wall<0?'벽 미지정':`벽 ${o.wall+1}`)} · 시작 {o.offset}cm · 폭 {o.width}cm</span>{issue&&<p className="field-error">{issue} 수정 버튼으로 다시 배치해 주세요.</p>}</div><div className="opening-row-actions"><button type="button" onClick={()=>onEdit(o)} aria-label={`${o.type==='door'?'문':'창문'} ${i+1} 수정`}>수정</button><button type="button" onClick={()=>onChange(items.filter(v=>v.id!==o.id))} aria-label={`${o.type==='door'?'문':'창문'} ${i+1} 삭제`}>삭제</button></div></li>;})}</ul>}
    <p className="opening-legend"><span>주황: 문 / 열림 방향</span><span>파랑: 창문</span><span>초록: 배치 미리보기 · 빨강: 배치 불가</span></p>
  </section>;
}
export function OpeningMarks({vertices,items,project,preview=false,invalid=false}:{vertices:Vertex[];items:Opening[];project:(p:XY)=>XY;preview?:boolean;invalid?:boolean}){
  const line=(points:XY[])=>points.map((p,i)=>{const v=project(p);return `${i?'L':'M'}${v.x} ${v.y}`;}).join(' ');
  return <g className="opening-marks" pointerEvents="none">{items.map((o,i)=>{
    if(o.wall<0||o.wall>=vertices.length||!Number.isFinite(o.width)||o.width<=0)return null;
    if(!preview&&validateOpening(vertices,o,items))return null;
    const g=openingGeometry(vertices,o),color=preview?(invalid?'#c33f36':'#39804b'):o.type==='door'?'#ae572b':'#2679a4',mid=project(g.path[8]);
    return <g key={o.id} opacity={preview ? 0.65 : 1} role="img" aria-label={`${preview?'미리보기 ':''}${o.type==='door'?'문':'창문'} ${i+1}, 폭 ${o.width}cm`}><path d={line(g.path)} stroke="#fffdf9" strokeWidth="9" fill="none"/><path d={line(g.path)} stroke={color} strokeWidth={o.type==='door'?1:4} fill="none"/>{o.type==='door'&&!invalid&&<><path d={line([g.hinge,g.leaf])} stroke={color} strokeWidth="2" fill="none"/><path d={line(g.arc)} stroke={color} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/></>}<text x={mid.x} y={mid.y+18} textAnchor="middle" fill={color} fontSize="11" paintOrder="stroke" stroke="#fffdf9" strokeWidth="3">{o.type==='door'?'문':'창'} {i+1}</text></g>;
  })}</g>;
}
