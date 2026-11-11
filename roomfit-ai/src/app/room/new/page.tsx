"use client";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { parseRoom, fitRoom } from "@/lib/room";
import type { Room, RoomErrors } from "@/lib/room";

export default function NewRoom() {
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [errors, setErrors] = useState<RoomErrors>({});
  const widthRef = useRef<HTMLInputElement>(null), depthRef = useRef<HTMLInputElement>(null);
  const gridId = useId();
  const plan = room ? fitRoom(room) : null;
  const changed = room && (Number(width) !== room.width || Number(depth) !== room.depth);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = parseRoom(width, depth);
    setErrors(result.errors);
    if (result.room) setRoom(result.room);
    else if (result.errors.width) widthRef.current?.focus();
    else depthRef.current?.focus();
  }
  function sample() {
    setWidth("360"); setDepth("420"); setRoom({ width: 360, depth: 420 }); setErrors({});
  }
  return <>
    <a className="skip-link" href="#room-main">본문 바로가기</a>
    <header className="header container">
      <Link href="/" className="brand" aria-label="RoomFit AI 홈"><span className="brand-icon" aria-hidden="true">⌑</span>RoomFit <span className="brand-ai">AI</span></Link>
      <Link href="/" className="nav-link">← 홈으로 돌아가기</Link>
    </header>
    <main id="room-main" className="container room-builder">
      <p className="eyebrow">STEP 01 · 나의 공간 그리기</p>
      <h1>내 방의 크기를<br /><span>알려주세요.</span></h1>
      <p className="builder-description">가로와 세로 길이를 입력하면 실제 비율에 맞는 평면도를 그려드려요.</p>
      <div className="builder-grid">
        <section className="room-form-card" aria-labelledby="dimensions-title">
          <h2 id="dimensions-title">방 크기 입력</h2>
          <p className="field-hint" id="dimensions-hint">벽 안쪽을 기준으로 측정해 주세요. 단위는 cm입니다.</p>
          <form onSubmit={submit} noValidate>
            <label className="field-label" htmlFor="room-width">가로 길이</label>
            <div className="dimension-input"><input ref={widthRef} id="room-width" type="number" inputMode="numeric" min="100" max="2000" step="1" required value={width} onChange={e => setWidth(e.target.value)} placeholder="예: 360" aria-invalid={!!errors.width} aria-describedby={`dimensions-hint width-hint${errors.width ? " width-error" : ""}`} /><span>cm</span></div>
            <p id="width-hint" className="field-hint">위에서 보았을 때 좌우 길이</p>
            {errors.width && <p id="width-error" className="field-error">{errors.width}</p>}
            <label className="field-label" htmlFor="room-depth">세로 길이</label>
            <div className="dimension-input"><input ref={depthRef} id="room-depth" type="number" inputMode="numeric" min="100" max="2000" step="1" required value={depth} onChange={e => setDepth(e.target.value)} placeholder="예: 420" aria-invalid={!!errors.depth} aria-describedby={`depth-hint${errors.depth ? " depth-error" : ""}`} /><span>cm</span></div>
            <p id="depth-hint" className="field-hint">위에서 보았을 때 앞뒤 길이</p>
            {errors.depth && <p id="depth-error" className="field-error">{errors.depth}</p>}
            <p className="input-policy">100~2,000cm 사이의 정수로 입력해 주세요.</p>
            <button className="button create-plan" type="submit">{room ? "평면도 업데이트" : "평면도 만들기"}<span aria-hidden="true">→</span></button>
            <button className="sample-button" type="button" onClick={sample}>예시 방으로 시작하기 (360 × 420cm)</button>
          </form>
        </section>
        <section className="plan-card" aria-labelledby="plan-title">
          <div className="plan-heading"><h2 id="plan-title">나의 2D 평면도</h2><span className="sample-badge">직사각형 방</span></div>
          {room && plan ? <>
            <svg className="room-svg" viewBox="0 0 640 480" role="img" aria-label={`가로 ${room.width}cm, 세로 ${room.depth}cm의 직사각형 방 평면도`}>
              <defs><pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e4e7df" strokeWidth="1" /></pattern></defs>
              <rect x="0" y="0" width="640" height="480" fill={`url(#${gridId})`} />
              <rect x={plan.x} y={plan.y} width={plan.width} height={plan.height} rx="2" fill="#fbfaf4" stroke="#78856b" strokeWidth="6" />
              <line x1={plan.x} x2={plan.x + plan.width} y1={plan.y - 24} y2={plan.y - 24} stroke="#8c9580" />
              <text x="320" y={plan.y - 34} textAnchor="middle" className="svg-measure">가로 {room.width} cm</text>
              <text transform={`translate(${plan.x + plan.width + 34}, 240) rotate(90)`} textAnchor="middle" className="svg-measure">세로 {room.depth} cm</text>
              <text x="320" y="235" textAnchor="middle" className="svg-area">{(room.width * room.depth / 10000).toFixed(2)} m²</text>
              <text x="320" y="260" textAnchor="middle" className="svg-caption">나의 방</text>
            </svg>
            <div className="room-summary" aria-live="polite"><span>가로 <strong>{room.width / 100}m</strong></span><span>세로 <strong>{room.depth / 100}m</strong></span><span>면적 <strong>{(room.width * room.depth / 10000).toFixed(2)}m²</strong></span></div>
            {changed && <p className="pending-note" role="status">입력값을 변경했어요. 평면도 업데이트를 눌러 반영해 주세요.</p>}
          </> : <div className="plan-empty"><span className="empty-room" aria-hidden="true" /><h3>나만의 공간을 그려볼까요?</h3><p>방 크기를 입력하거나 예시 방을 선택하면<br />여기에 평면도가 나타나요.</p></div>}
          <p className="plan-note">입력한 치수에 따른 개략 평면도입니다. 문·창문과 가구는 다음 단계에서 추가됩니다.</p>
        </section>
      </div>
      <p className="builder-footnote">현재는 직사각형 방을 지원해요. 입력한 정보는 새로고침하면 초기화됩니다.</p>
    </main>
  </>;
}
