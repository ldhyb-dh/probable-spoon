"use client";
import {useState,useSyncExternalStore} from 'react';
import {decodePlans,encodePlans,validSnapshot} from '@/lib/saved-plans';
import type {PlanSnapshot,SavedPlan} from '@/lib/saved-plans';
const KEY='roomfit-plans-v1';
const EVENT='roomfit-plans-changed';
const BLOCKED='__roomfit_storage_blocked__';
function read(){try{return window.localStorage.getItem(KEY);}catch{return BLOCKED;}}
function server(){return null;}
function subscribe(callback:()=>void){window.addEventListener('storage',callback);window.addEventListener(EVENT,callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener(EVENT,callback);};}
export function SavedPlans({mode,snapshot,onLoad}:{mode:PlanSnapshot['mode'];snapshot:()=>PlanSnapshot|null;onLoad:(snapshot:PlanSnapshot)=>void}){
 const raw=useSyncExternalStore(subscribe,read,server);
 const decoded=decodePlans(raw);
 const [name,setName]=useState('');
 const [message,setMessage]=useState('');
 const [deleteId,setDeleteId]=useState<string|null>(null);
 const visible=decoded.plans.filter(p=>p.snapshot.mode===mode).sort((a,b)=>b.savedAt-a.savedAt);
 function save(){
  const current=snapshot();
  if(!current||!validSnapshot(current)){setMessage('유효한 평면도를 만든 뒤 저장해 주세요. 입력값과 가구 상태도 확인해 주세요.');return;}
  const stored=read();const now=decodePlans(stored);
  if(now.status!=='ok'){setMessage(stored===BLOCKED?'브라우저 저장소를 사용할 수 없어요.':'저장된 데이터의 형식을 읽을 수 없어 덮어쓰지 않았어요.');return;}
  if(now.plans.length>=50){setMessage('저장 공간은 최대 50개입니다. 필요 없는 배치를 삭제해 주세요.');return;}
  const title=name.trim()||'나의 방 '+new Date().toLocaleDateString('ko-KR');
  if(title.length>60){setMessage('이름은 60자 이내로 입력해 주세요.');return;}
  const plan:SavedPlan={id:crypto.randomUUID(),name:title,savedAt:Date.now(),snapshot:current};
  try{window.localStorage.setItem(KEY,encodePlans([...now.plans,plan]));window.dispatchEvent(new Event(EVENT));setMessage('현재 배치를 이 브라우저에 저장했어요.');setName('');}catch{setMessage('저장하지 못했어요. 브라우저 저장 공간이나 설정을 확인해 주세요.');}
 }
 function remove(id:string){
  const stored=read(),now=decodePlans(stored);
  if(now.status!=='ok'){setMessage('저장된 데이터를 읽을 수 없어 삭제하지 않았어요.');return;}
  try{window.localStorage.setItem(KEY,encodePlans(now.plans.filter(p=>p.id!==id)));window.dispatchEvent(new Event(EVENT));setDeleteId(null);setMessage('저장한 배치를 삭제했어요.');}catch{setMessage('삭제하지 못했어요. 브라우저 저장소 설정을 확인해 주세요.');}
 }
 return <section className="opening-editor saved-plans" aria-labelledby={'saved-plans-title'}>
  <h2 id="saved-plans-title">내 배치 저장하기</h2><p className="field-hint">완성한 방과 문·창문, 가구를 이 기기의 이 브라우저에 저장합니다. 다른 기기와 자동 동기화되지 않으며 브라우저 데이터를 지우면 저장 내용도 사라집니다.</p>
  <div className="save-plan-form"><label>배치 이름<input maxLength={60} value={name} onChange={e=>setName(e.target.value)} placeholder="예: 내 방 첫 번째 배치"/></label><button type="button" onClick={save}>현재 배치 저장</button></div>
  <p className="field-hint">확정한 배치만 저장됩니다. 불러오면 현재 편집 화면이 선택한 배치로 바뀝니다.</p>
  <p role="status" className="field-hint">{message}</p>
  {decoded.status==='corrupt'?<p role="alert" className="field-error">{raw===BLOCKED?'이 브라우저에서 저장소를 사용할 수 없습니다.':'저장된 데이터 형식을 읽을 수 없어 덮어쓰지 않았습니다.'}</p>:<>
   <h3>저장한 {mode==='template'?'기본형':'자유형'} 배치 · {visible.length}개</h3>
   {!visible.length?<p className="field-hint">아직 저장한 배치가 없어요.</p>:<ul className="opening-list">{visible.map(plan=><li key={plan.id}><div><strong>{plan.name}</strong><span>{new Date(plan.savedAt).toLocaleString('ko-KR')} · 가구 {plan.snapshot.furniture.length}개 · 문·창문 {plan.snapshot.openings.length}개</span></div><div className="opening-row-actions"><button type="button" onClick={()=>{onLoad(plan.snapshot);setMessage('선택한 배치를 불러왔어요.');}} aria-label={plan.name+' 불러오기'}>불러오기</button>{deleteId===plan.id?<><button type="button" onClick={()=>remove(plan.id)} aria-label={plan.name+' 삭제 확정'}>삭제 확정</button><button type="button" onClick={()=>setDeleteId(null)}>취소</button></>:<button type="button" onClick={()=>setDeleteId(plan.id)} aria-label={plan.name+' 삭제'}>삭제</button>}</div></li>)}</ul>}
   <p className="field-hint">기본형과 자유형은 각각 해당 편집 화면에서 불러옵니다.</p>
  </>}
 </section>;
}
