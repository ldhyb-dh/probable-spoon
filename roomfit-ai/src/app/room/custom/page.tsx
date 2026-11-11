"use client";
import Link from "next/link";
import { useMemo,useRef,useState } from "react";
import { analyzeFreeRoom,control,curveExample,diagonalExample,pointOnWall,reflectRoom,moveVertex } from "@/lib/free-room";
import type { Vertex } from "@/lib/free-room";

type Draft={x:string;y:string;bulge:string};
type Frame={scale:number;ox:number;oy:number};
type Drag={index:number;pointerId:number;startX:number;startY:number;frame:Frame;original:Vertex[];latest:Vertex[]};
const draftOf=(points:Vertex[]):Draft[]=>points.map(p=>({x:String(p.x),y:String(p.y),bulge:String(p.bulge)}));
export default function CustomRoom(){
  const [draft,setDraft]=useState<Draft[]>(draftOf(diagonalExample));
  const [selected,setSelected]=useState(0);
  const dragRef=useRef<Drag|null>(null);
  const [dragFrame,setDragFrame]=useState<Frame|null>(null);
  const [notice,setNotice]=useState("");
  const numeric=draft.map(p=>({x:p.x.trim()?Number(p.x):NaN,y:p.y.trim()?Number(p.y):NaN,bulge:p.bulge.trim()?Number(p.bulge):NaN}));
  const result=useMemo(()=>analyzeFreeRoom(draft.map(p=>({x:p.x.trim()?Number(p.x):NaN,y:p.y.trim()?Number(p.y):NaN,bulge:p.bulge.trim()?Number(p.bulge):NaN}))),[draft]);
  const safe=numeric.every(p=>[p.x,p.y,p.bulge].every(Number.isFinite)&&Math.abs(p.x)<=2000&&Math.abs(p.y)<=2000&&Math.abs(p.bulge)<=500)&&numeric.every((p,i)=>Math.hypot(p.x-numeric[(i+1)%numeric.length].x,p.y-numeric[(i+1)%numeric.length].y)>=1);
  const samples=safe?numeric.flatMap((a,i)=>Array.from({length:33},(_,j)=>pointOnWall(a,numeric[(i+1)%numeric.length],j/32))):[];
  const minX=Math.min(...samples.map(p=>p.x)),maxX=Math.max(...samples.map(p=>p.x)),minY=Math.min(...samples.map(p=>p.y)),maxY=Math.max(...samples.map(p=>p.y));
  const scale=safe?Math.min(480/Math.max(maxX-minX,1),320/Math.max(maxY-minY,1)):1;
  const frame=dragFrame??{scale,ox:80-minX*scale+(480-(maxX-minX)*scale)/2,oy:80-minY*scale+(320-(maxY-minY)*scale)/2};
  const sx=(x:number)=>frame.ox+x*frame.scale,sy=(y:number)=>frame.oy+y*frame.scale;
  function svgPoint(svg:SVGSVGElement,clientX:number,clientY:number){
    const matrix=svg.getScreenCTM();
    return matrix?new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse()):null;
  }
  function beginDrag(e:React.PointerEvent<SVGGElement>,index:number){
    if(e.button!==0||!safe)return;
    const svg=e.currentTarget.ownerSVGElement;
    if(!svg)return;
    const point=svgPoint(svg,e.clientX,e.clientY);if(!point)return;
    e.preventDefault();setSelected(index);setNotice('');
    dragRef.current={index,pointerId:e.pointerId,startX:point.x,startY:point.y,frame,original:numeric,latest:numeric};
    setDragFrame(frame);svg.setPointerCapture(e.pointerId);
  }
  function dragMove(e:React.PointerEvent<SVGSVGElement>){
    const drag=dragRef.current;if(!drag||drag.pointerId!==e.pointerId)return;
    const point=svgPoint(e.currentTarget,e.clientX,e.clientY);if(!point)return;
    const next=moveVertex(drag.original,drag.index,(point.x-drag.startX)/drag.frame.scale,(point.y-drag.startY)/drag.frame.scale);
    drag.latest=next;setDraft(draftOf(next));
  }
  function endDrag(e:React.PointerEvent<SVGSVGElement>,cancel=false){
    const drag=dragRef.current;if(!drag||drag.pointerId!==e.pointerId)return;
    if(!cancel)dragMove(e);
    const error=analyzeFreeRoom(drag.latest).error;
    setDraft(draftOf(cancel||error?drag.original:drag.latest));
    setNotice(cancel?'이동을 취소했어요.':error?'벽이 겹치거나 교차해 이동 전 위치로 되돌렸어요.':'꼭짓점을 이동했어요.');
    dragRef.current=null;setDragFrame(null);
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function flip(axis:'horizontal'|'vertical'){
    if(!safe)return;setDraft(draftOf(reflectRoom(numeric,axis)));setNotice(axis==='horizontal'?'평면도를 좌우 반전했어요.':'평면도를 상하 반전했어요.');
  }
  const path=safe?numeric.map((a,i)=>{const b=numeric[(i+1)%numeric.length],c=control(a,b);return `${i===0?`M${sx(a.x)} ${sy(a.y)}`:''}${a.bulge?`Q${sx(c.x)} ${sy(c.y)} ${sx(b.x)} ${sy(b.y)}`:`L${sx(b.x)} ${sy(b.y)}`}`;}).join(' ')+' Z':'';
  function update(index:number,key:keyof Draft,value:string){setDraft(draft.map((p,i)=>i===index?{...p,[key]:value}:p));setNotice('');}
  function sample(points:Vertex[]){setDraft(draftOf(points));setSelected(0);setNotice('예시 방을 불러왔어요.');}
  function add(){
    if(!safe||draft.length>=12)return;
    const a=numeric[selected],b=numeric[(selected+1)%numeric.length];
    if(a.bulge){setNotice('곡선 벽은 휘어짐을 0으로 바꾼 뒤 꼭짓점을 추가해 주세요.');return;}
    setDraft([...draft.slice(0,selected+1),{x:String((a.x+b.x)/2),y:String((a.y+b.y)/2),bulge:'0'},...draft.slice(selected+1)]);setSelected(selected+1);setNotice('새 꼭짓점을 추가했어요. 좌표를 바꾸면 사선 벽이 생겨요.');
  }
  function remove(){if(draft.length<=3)return;setDraft(draft.filter((_,i)=>i!==selected).map((p,i)=>i===(selected-1+draft.length-1)%(draft.length-1)?{...p,bulge:'0'}:p));setSelected(0);setNotice('꼭짓점을 삭제하고 연결된 벽을 직선으로 바꿨어요.');}
  const active=draft[selected];
  return <>
    <header className="header container"><Link href="/" className="brand">RoomFit <span className="brand-ai">AI</span></Link><Link href="/room/new" className="nav-link">← 기본 방 형태</Link></header>
    <main className="container room-builder"><p className="eyebrow">CUSTOM ROOM · 사선과 곡선</p><h1>벽이 꺾여도,<br/><span>부드럽게 휘어도.</span></h1><p className="builder-description">그림의 꼭짓점을 마우스로 끌어 옮기거나 좌표를 입력해 편집하세요. 각 벽의 휘어짐도 조절할 수 있어요.</p>
      <aside className="measurement-tip"><strong>좌표는 어떻게 입력하나요?</strong><p>방의 한 곳을 (0, 0)으로 정하고, 오른쪽이 X+, 아래쪽이 Y+입니다. 좌표와 휘어짐의 단위는 cm예요. 각 꼭짓점에서 다음 꼭짓점까지가 한 벽이며 마지막 벽은 첫 점으로 자동 연결됩니다.</p></aside>
      <div className="custom-presets"><button type="button" onClick={()=>sample(diagonalExample)}>사선 방 예시</button><button type="button" onClick={()=>sample(curveExample)}>곡선 방 예시</button></div>
      <div className="builder-grid">
        <section className="room-form-card" aria-labelledby="custom-edit-title"><h2 id="custom-edit-title">꼭짓점 · 벽 편집</h2><p className="field-hint">번호로 꼭짓점을 선택하거나, 그림의 점을 끌어서 옮겨보세요.</p>
          <div className="vertex-tabs" role="group" aria-label="꼭짓점 선택">{draft.map((_,i)=><button type="button" key={i} aria-pressed={i===selected} onClick={()=>setSelected(i)}>{i+1}</button>)}</div>
          <h3>꼭짓점 {selected+1}</h3>
          {(['x','y'] as const).map(key=><div key={key}><label className="field-label" htmlFor={`vertex-${key}`}>{key.toUpperCase()} 좌표 (cm)</label><div className="dimension-input"><input id={`vertex-${key}`} type="number" min="-2000" max="2000" step="1" value={active[key]} onChange={e=>update(selected,key,e.target.value)}/><span>cm</span></div></div>)}
          <label className="field-label" htmlFor="wall-bulge">벽 {selected+1} → {(selected+1)%draft.length+1}의 휘어짐</label><div className="dimension-input"><input id="wall-bulge" type="number" min="-500" max="500" step="1" value={active.bulge} onChange={e=>update(selected,'bulge',e.target.value)}/><span>cm</span></div>
          <p className="field-hint">0은 직선입니다. 0이 아니면 벽 중앙이 해당 거리만큼 휘어집니다. +와 −로 방향을 바꿀 수 있어요.</p>
          <label className="sr-only" htmlFor="bulge-slider">휘어짐 조절</label><input className="bulge-slider" id="bulge-slider" type="range" min="-500" max="500" step="1" value={Number.isFinite(Number(active.bulge))?Math.max(-500,Math.min(500,Number(active.bulge))):0} onChange={e=>update(selected,'bulge',e.target.value)}/>
          <div className="custom-actions"><button type="button" onClick={add} disabled={!safe||draft.length>=12}>이 벽에 꼭짓점 추가</button><button type="button" onClick={remove} disabled={draft.length<=3}>선택 꼭짓점 삭제</button></div>
          <p className="field-hint" role="status">{notice}</p><p className="field-hint">좌표 ±2,000cm · 휘어짐 ±500cm · 꼭짓점 3~12개</p>
        </section>
        <section className="plan-card" aria-labelledby="custom-plan-title"><div className="plan-heading"><h2 id="custom-plan-title">나의 자유형 평면도</h2><span className="sample-badge">사선 · 곡선</span></div>
          <div className="plan-transforms"><button type="button" disabled={!safe||!!dragFrame} onClick={()=>flip('horizontal')}>↔ 좌우 반전</button><button type="button" disabled={!safe||!!dragFrame} onClick={()=>flip('vertical')}>↕ 상하 반전</button></div>
          {safe?<svg onPointerMove={dragMove} onPointerUp={e=>endDrag(e)} onPointerCancel={e=>endDrag(e,true)} onLostPointerCapture={e=>endDrag(e,true)} className={`room-svg draggable-plan ${dragFrame?'is-dragging':''}`} viewBox="0 0 640 480" role="group" aria-label="꼭짓점을 마우스로 이동할 수 있는 자유형 방 평면도">
            <path d={path} fill={result.error?'#f8e5e0':'#edf0e2'} stroke={result.error?'#ad493a':'#78856b'} strokeWidth="4"/>
            {numeric.map((a,i)=>{const b=numeric[(i+1)%numeric.length],mid=pointOnWall(a,b,.5);return <g key={i}><text x={sx(mid.x)} y={sy(mid.y)-12} textAnchor="middle" className="wall-letter">벽 {i+1}</text><g role="button" tabIndex={0} aria-label={`꼭짓점 ${i+1} 선택`} aria-pressed={selected===i} onPointerDown={e=>beginDrag(e,i)} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i);}}} className="vertex-handle"><circle cx={sx(a.x)} cy={sy(a.y)} r="14" fill={selected===i?'#a54c2e':'#fff'} stroke="#a54c2e" strokeWidth="2"/><text x={sx(a.x)} y={sy(a.y)+5} textAnchor="middle" fontSize="13" fill={selected===i?'white':'#a54c2e'}>{i+1}</text></g></g>;})}
          </svg>:<div className="plan-empty"><p>유효한 좌표를 입력하면 평면도가 나타납니다.</p></div>}
          {result.error?<p className="field-error" role="alert">{result.error}</p>:<><div className="room-summary" aria-live="polite"><span>면적 <strong>{(result.area/10000).toFixed(2)}m²</strong></span><span>둘레 <strong>{(result.perimeter/100).toFixed(2)}m</strong></span></div><h3 className="wall-list-title">벽별 길이</h3><ol className="wall-list">{result.lengths.map((length,i)=><li key={i}><span className="wall-key">벽 {i+1}</span><strong>{length.toFixed(1)} cm</strong>{numeric[i].bulge!==0&&<span>곡선</span>}</li>)}</ol></>}
          <p className="plan-note">곡선은 중앙 휘어짐으로 정의한 2차 베지어 곡선이며 원호와는 다릅니다. 곡선 길이는 수치 계산한 근삿값이에요. 벽 교차 검사는 곡선을 64구간으로 나눠 확인합니다. 시공용 실측 도면으로 사용할 수는 없습니다.</p>
        </section>
      </div><p className="builder-footnote">변경은 즉시 반영됩니다. 새로고침하면 예시 방으로 초기화됩니다.</p>
    </main>
  </>;
}
