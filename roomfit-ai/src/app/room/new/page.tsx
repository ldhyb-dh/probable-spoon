"use client";
import Link from "next/link";
import {useFurniture,FurnitureToolbar,FurnitureMarks,FurnitureList} from "@/components/furniture";

import {OpeningEditor,OpeningMarks} from "@/components/openings";
import {useOpeningPlacement,PlacementToolbar,PlacementPreview} from "@/components/opening-placement";
import type {Opening} from "@/lib/free-room";
import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { fieldsFor, fitRoom, measureRoom, parseRoom, shapes } from "@/lib/room";
import type { FieldKey, Room, RoomErrors, RoomShape } from "@/lib/room";

export default function NewRoom() {
  const [openings,setOpenings]=useState<Opening[]>([]);
  const [horizontal,setHorizontal]=useState(false);
  const [vertical,setVertical]=useState(false);
  const [shape,setShape]=useState<RoomShape>("rectangle");
  const [values,setValues]=useState<Partial<Record<FieldKey,string>>>({});
  const [room,setRoom]=useState<Room|null>(null);
  const [errors,setErrors]=useState<RoomErrors>({});
  const [notice,setNotice]=useState("");
  const formRef=useRef<HTMLFormElement>(null);
  const gridId=useId();
  const fields=fieldsFor(shape);
  const basePlan=room?fitRoom(room):null, metrics=room?measureRoom(room):null;
  const plan=basePlan?{...basePlan,points:basePlan.points.map(p=>({x:horizontal?640-p.x:p.x,y:vertical?480-p.y:p.y}))}:null;
  const orientation=horizontal!==vertical?-1:1;
  const vertices=metrics?.points.map(p=>({...p,bulge:0}))??[];
  const placement=useOpeningPlacement(vertices,openings,setOpenings);
  const furniture=useFurniture(metrics?.points??[]);
  const project=(p:{x:number;y:number})=>{const scale=room?Math.min(480/room.width,320/room.depth):1;const x=(640-(room?.width??0)*scale)/2+p.x*scale,y=(480-(room?.depth??0)*scale)/2+p.y*scale;return {x:horizontal?640-x:x,y:vertical?480-y:y};};
  const inverse=(p:{x:number;y:number})=>{const scale=room?Math.min(480/room.width,320/room.depth):1;return {x:((horizontal?640-p.x:p.x)-(640-(room?.width??0)*scale)/2)/scale,y:((vertical?480-p.y:p.y)-(480-(room?.depth??0)*scale)/2)/scale};};
  const changed=room && fields.some(f=>Number(values[f.key])!==room[f.key]);
  function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result=parseRoom(shape,values);setErrors(result.errors);
    if(result.room){setRoom(result.room);setNotice("평면도가 업데이트됐어요.");}
    else {setNotice("입력한 길이를 확인해 주세요.");const key=fields.find(f=>result.errors[f.key])?.key;formRef.current?.querySelector<HTMLInputElement>(`#room-${key}`)?.focus();}
  }
  function sample(){furniture.reset();placement.cancel();
    const v={width:"400",depth:"500",cutWidth:shape==="u"?"160":"180",cutDepth:"200",leftWing:"100"};
    setOpenings([]);setValues(v);setErrors({});setRoom(parseRoom(shape,v).room);setNotice("예시 방을 불러왔어요.");
  }
  function select(next:RoomShape){furniture.reset();placement.cancel();setOpenings([]);setHorizontal(false);setVertical(false);setShape(next);setRoom(null);setErrors({});setNotice("");}
  return <>
    <a className="skip-link" href="#room-main">본문 바로가기</a>
    <header className="header container"><Link href="/" className="brand" aria-label="RoomFit AI 홈"><span className="brand-icon" aria-hidden="true">⌑</span>RoomFit <span className="brand-ai">AI</span></Link><Link href="/" className="nav-link">← 홈으로 돌아가기</Link></header>
    <main id="room-main" className="container room-builder">
      <p className="eyebrow">STEP 01 · 나의 공간 그리기</p>
      <h1>우리 방 모양대로,<br/><span>벽을 따라 그려요.</span></h1>
      <p className="builder-description">방 형태를 고르고 벽 안쪽 길이를 입력해 주세요. 들어간 공간까지 반영해 평면도를 만들어요.</p>
      <aside className="measurement-tip"><strong>둘레만 알면 방을 그릴 수 있나요?</strong><p>둘레의 총길이가 같아도 방의 모양과 면적은 달라질 수 있어요. 방 형태와 필요한 벽 길이를 함께 입력하면 나머지 벽 길이와 둘레를 계산해 드려요.</p></aside>
      <Link className="custom-entry" href="/room/custom">사선·곡선 벽 직접 그리기 →</Link>
      <fieldset className="shape-picker"><legend>1. 방 형태 선택</legend><div className="shape-options">{shapes.map(s=><label key={s.id} className={`shape-option ${shape===s.id?"selected":""}`}><input type="radio" name="shape" value={s.id} checked={shape===s.id} onChange={()=>select(s.id)}/><svg viewBox="0 0 64 56" aria-hidden="true"><path d={s.path}/></svg><span>{s.name}</span></label>)}</div></fieldset>
      <p className="field-hint">방 형태를 바꾸거나 예시 방을 다시 불러오면 배치한 문·창문과 가구도 초기화됩니다.</p>
      <div className="builder-grid">
        <section className="room-form-card" aria-labelledby="dimensions-title">
          <h2 id="dimensions-title">방 크기 입력</h2><p className="field-hint">2. 선택한 모양의 벽을 측정해 주세요. 단위는 cm입니다.</p>
          <form ref={formRef} onSubmit={submit} noValidate>
            {fields.map(f=><div key={f.key}><label className="field-label" htmlFor={`room-${f.key}`}>{f.label}</label><div className="dimension-input"><input id={`room-${f.key}`} type="number" inputMode="numeric" required min={f.min} max="2000" step="1" value={values[f.key]??""} onChange={e=>setValues({...values,[f.key]:e.target.value})} aria-invalid={!!errors[f.key]} aria-describedby={`hint-${f.key}${errors[f.key]?` error-${f.key}`:""}`} placeholder={f.key==="width"?"예: 400":f.key==="depth"?"예: 500":"예: 100"}/><span>cm</span></div><p className="field-hint" id={`hint-${f.key}`}>{f.hint}</p>{errors[f.key]&&<p className="field-error" id={`error-${f.key}`}>{errors[f.key]}</p>}</div>)}
            <p className="input-policy">전체 길이는 100~2,000cm, 추가 구간은 10~2,000cm의 정수로 입력해 주세요.</p>
            <button className="button create-plan" type="submit">{room?"평면도 업데이트":"평면도 만들기"}<span aria-hidden="true">→</span></button>
            <button className="sample-button" type="button" onClick={sample}>선택한 모양의 예시 방 불러오기</button>
          </form><p className="field-hint" role="status">{notice}</p>
        </section>
        <section className="plan-card" aria-labelledby="plan-title">
          <div className="plan-heading"><h2 id="plan-title">나의 2D 평면도</h2><span className="sample-badge">{shapes.find(s=>s.id===shape)?.name}</span></div>
          <div className="plan-transforms"><button type="button" disabled={!room} aria-pressed={horizontal} onClick={()=>setHorizontal(!horizontal)}>↔ 좌우 반전</button><button type="button" disabled={!room} aria-pressed={vertical} onClick={()=>setVertical(!vertical)}>↕ 상하 반전</button></div>
          {room&&<><FurnitureToolbar controller={furniture} onChoose={placement.cancel}/><PlacementToolbar placement={placement} onSelect={furniture.cancel}/></>}
          {room&&plan&&metrics?<>
            <svg className={`room-svg furniture-canvas ${placement.tool?"placing-opening":""}`} onPointerMove={e=>furniture.tool||furniture.dragging?furniture.move(e,inverse):placement.pick(e,project)} onPointerUp={e=>furniture.end(e)} onPointerCancel={e=>furniture.end(e,true)} onLostPointerCapture={e=>furniture.end(e,true)} onPointerLeave={()=>{placement.leave();furniture.leave();}} onClick={e=>furniture.tool?furniture.click(e,inverse):placement.pick(e,project,true)} viewBox="0 0 640 480" role="group" aria-label={`${shapes.find(s=>s.id===room.shape)?.name} 방 평면도, 면적 ${(metrics.area/10000).toFixed(2)}제곱미터, 둘레 ${(metrics.perimeter/100).toFixed(2)}미터`}>
              <defs><pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#e4e7df"/></pattern></defs>
              <rect width="640" height="480" fill={`url(#${gridId})`}/>
              <polygon points={plan.points.map(p=>`${p.x},${p.y}`).join(" ")} fill="#fbfaf4" stroke="#78856b" strokeWidth="5" strokeLinejoin="round"/>
              {plan.points.map((p,i)=>{const q=plan.points[(i+1)%plan.points.length],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);return <text key={i} x={(p.x+q.x)/2+dy/len*19*orientation} y={(p.y+q.y)/2-dx/len*19*orientation+5} textAnchor="middle" className="wall-letter">{String.fromCharCode(65+i)}</text>;})}
              <FurnitureMarks controller={furniture} project={project} inverse={inverse} interactive={!placement.tool&&!furniture.tool}/>
              <OpeningMarks vertices={vertices} items={placement.visibleItems} project={project}/><PlacementPreview vertices={vertices} placement={placement} project={project}/>
            </svg>
            <div className="room-summary" aria-live="polite"><span>면적 <strong>{(metrics.area/10000).toFixed(2)}m²</strong></span><span>둘레 <strong>{(metrics.perimeter/100).toFixed(2)}m</strong></span><span>외곽 <strong>{room.width/100} × {room.depth/100}m</strong></span></div>
            {changed&&<p className="pending-note" role="status">입력값을 바꿨어요. 평면도 업데이트를 눌러 반영해 주세요.</p>}
            <h3 className="wall-list-title">벽을 따라 확인하기</h3><ol className="wall-list">{metrics.walls.map(w=><li key={w.label}><span className="wall-key">{w.label}</span><strong>{w.length} cm</strong></li>)}</ol>
          </>:<div className="plan-empty"><svg className="shape-guide" viewBox="0 0 64 56" role="img" aria-label={`${shapes.find(s=>s.id===shape)?.name} 입력 참고도`}>{(()=>{const example=parseRoom(shape,{width:"400",depth:"500",cutWidth:"160",cutDepth:"200",leftWing:"100"}).room!;const p=measureRoom(example).points.map(v=>({x:12+v.x*.08,y:6+v.y*.08}));return <><polygon points={p.map(v=>`${v.x},${v.y}`).join(" ")} />{p.map((v,i)=>{const q=p[(i+1)%p.length],dx=q.x-v.x,dy=q.y-v.y,len=Math.hypot(dx,dy);return <text key={i} x={(v.x+q.x)/2+dy/len*5} y={(v.y+q.y)/2-dx/len*5+1.5} textAnchor="middle">{String.fromCharCode(65+i)}</text>;})}</>;})()}</svg><h3>벽의 알파벳을 보고 입력해 주세요</h3><p>예시 방을 불러와 모양을 먼저 확인할 수도 있어요.</p></div>}
          <p className="plan-note">직각으로 꺾이는 방의 개략 평면도입니다. 길이가 생략된 벽은 선택한 형태에 맞춰 자동 계산됩니다. 사선·곡선 벽은 위의 직접 그리기에서 만들 수 있어요. 아래에서 문·창문을 추가할 수 있어요.</p>
        </section>
      </div>{room&&<FurnitureList controller={furniture}/>} {room&&<OpeningEditor key={shape} vertices={vertices} items={openings} onChange={next=>{placement.cancel();setOpenings(next);}} onEdit={placement.edit} labels={metrics?.walls.map(w=>w.label)}/>}<p className="builder-footnote">현재 입력은 이 화면에서만 유지되며, 새로고침하면 초기화됩니다.</p>
    </main>
  </>;
}
