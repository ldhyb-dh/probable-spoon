"use client";
import {useEffect,useRef,useState} from 'react';
import type {MouseEvent,PointerEvent} from 'react';
import {furnitureCorners,furnitureIssues,furniturePresets,reflectFurniture,validFurniture} from '@/lib/furniture.mjs';
import type {FurnitureItem,FurnitureKind,FurniturePoint} from '@/lib/furniture-types';
type Inverse=(point:FurniturePoint)=>FurniturePoint;
type Drag={id:string;pointerId:number;start:FurniturePoint;original:FurnitureItem;svg:SVGSVGElement;inverse:Inverse};
function worldPoint(e:PointerEvent<SVGSVGElement>|MouseEvent<SVGSVGElement>,inverse:Inverse){
 const matrix=e.currentTarget.getScreenCTM();if(!matrix)return null;
 const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());return inverse(p);
}
export function useFurniture(outline:FurniturePoint[]){
 const [items,setItems]=useState<FurnitureItem[]>([]);
 const [tool,setTool]=useState<FurnitureKind|null>(null);
 const [selected,setSelected]=useState<string|null>(null);
 const [width,setWidth]=useState('100'),[depth,setDepth]=useState('200'),[angle,setAngle]=useState('0'),[name,setName]=useState('침대');
 const [centerX,setCenterX]=useState('100'),[centerY,setCenterY]=useState('100');
 const [position,setPosition]=useState<{x:number;y:number;locked:boolean}|null>(null);
 const [notice,setNotice]=useState('');
 const [dragging,setDragging]=useState(false);
 const dragRef=useRef<Drag|null>(null);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key!=='Escape')return;setTool(null);setPosition(null);const d=dragRef.current;if(d){setItems(prev=>prev.map(item=>item.id===d.id?d.original:item));setCenterX(String(d.original.x));setCenterY(String(d.original.y));dragRef.current=null;setDragging(false);if(d.svg.hasPointerCapture(d.pointerId))d.svg.releasePointerCapture(d.pointerId);}setNotice('진행 중인 배치/이동을 취소했어요.');};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[]);
 const candidate:FurnitureItem|null=tool&&position?{id:'__furniture_preview__',kind:tool,name:name.trim()||'가구',width:width.trim()?Number(width):NaN,depth:depth.trim()?Number(depth):NaN,x:position.x,y:position.y,rotation:angle.trim()?Number(angle):NaN}:null;
 const problems=candidate?furnitureIssues(candidate,items,outline):[];
 const selectedItem=items.find(item=>item.id===selected);
 function cancel(){setTool(null);setPosition(null);}
 function reset(){cancel();setItems([]);setSelected(null);}
 function restore(next:FurnitureItem[]){cancel();setItems(next);setSelected(null);setNotice("저장된 가구를 불러왔어요.");}
 function choose(kind:FurnitureKind){const preset=furniturePresets.find(p=>p.kind===kind)!;setTool(kind);setSelected(null);setWidth(String(preset.width));setDepth(String(preset.depth));setAngle('0');setName(preset.name);setPosition(null);setNotice('방 안으로 마우스를 옮기고, 클릭 후 가구 배치 확정을 누르세요.');}
 function pick(item:FurnitureItem){setCenterX(String(item.x));setCenterY(String(item.y));setSelected(item.id);setWidth(String(item.width));setDepth(String(item.depth));setAngle(String(item.rotation));setName(item.name);cancel();}
 function move(e:PointerEvent<SVGSVGElement>,inverse:Inverse){
  const drag=dragRef.current;
  if(drag&&e.pointerId===drag.pointerId){const p=worldPoint(e,drag.inverse);if(!p)return;const x=Math.max(-2000,Math.min(2000,Math.round(drag.original.x+p.x-drag.start.x))),y=Math.max(-2000,Math.min(2000,Math.round(drag.original.y+p.y-drag.start.y)));setItems(prev=>prev.map(item=>item.id===drag.id?{...item,x,y}:item));setCenterX(String(x));setCenterY(String(y));return;}
  if(!tool||position?.locked)return;const p=worldPoint(e,inverse);if(p)setPosition({x:Math.round(p.x),y:Math.round(p.y),locked:false});
 }
 function click(e:MouseEvent<SVGSVGElement>,inverse:Inverse){if(!tool)return;const p=worldPoint(e,inverse);if(p)setPosition({x:Math.round(p.x),y:Math.round(p.y),locked:true});}
 function begin(e:PointerEvent<SVGGElement>,item:FurnitureItem,inverse:Inverse){
  if(e.button!==0||tool)return;const svg=e.currentTarget.ownerSVGElement,matrix=svg?.getScreenCTM();if(!svg||!matrix)return;
  e.preventDefault();e.stopPropagation();const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
  pick(item);dragRef.current={id:item.id,pointerId:e.pointerId,start:inverse(point),original:item,svg,inverse};setDragging(true);svg.setPointerCapture(e.pointerId);
 }
 function end(e:PointerEvent<SVGSVGElement>,cancelled=false){const d=dragRef.current;if(!d||d.pointerId!==e.pointerId)return;if(cancelled){setItems(prev=>prev.map(item=>item.id===d.id?d.original:item));setCenterX(String(d.original.x));setCenterY(String(d.original.y));}else move(e,d.inverse);dragRef.current=null;setDragging(false);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);setNotice(cancelled?'가구 이동을 취소했어요.':'가구를 이동했어요. 빨간색 가구는 위치를 조절해 주세요.');}
 function confirm(){if(!candidate||!position?.locked||problems.length)return;const item={...candidate,id:crypto.randomUUID()};setItems(prev=>[...prev,item]);setSelected(item.id);setCenterX(String(item.x));setCenterY(String(item.y));cancel();setNotice('가구를 추가했어요. 평면도에서 끌어 이동할 수 있어요.');}
 function apply(){if(!selectedItem)return;const item={...selectedItem,name:name.trim()||selectedItem.name,x:centerX.trim()?Number(centerX):NaN,y:centerY.trim()?Number(centerY):NaN,width:width.trim()?Number(width):NaN,depth:depth.trim()?Number(depth):NaN,rotation:angle.trim()?Number(angle):NaN};if(!validFurniture(item)){setNotice('크기는 10~1,000cm, 좌표는 ±2,000cm, 각도는 ±360° 범위로 입력해 주세요.');return;}setItems(prev=>prev.map(o=>o.id===item.id?item:o));setNotice('가구 크기·각도를 반영했어요.');}
 function rotate(){if(tool){setAngle(String(((Number(angle)||0)+90)%360));return;}if(selectedItem){const rotation=((selectedItem.rotation+90)%360+360)%360;setItems(prev=>prev.map(o=>o.id===selectedItem.id?{...o,rotation}:o));setAngle(String(rotation));}}
 function remove(id:string){setItems(prev=>prev.filter(item=>item.id!==id));if(selected===id)setSelected(null);}
 function mirror(axis:'horizontal'|'vertical',boundary:FurniturePoint[]){cancel();setItems(prev=>reflectFurniture(prev,axis,boundary));setSelected(null);}
 return {items,tool,selected,selectedItem,centerX,centerY,setCenterX,setCenterY,width,depth,angle,name,setWidth,setDepth,setAngle,setName,position,candidate,problems,notice,dragging,cancel,reset,restore,choose,pick,move,click,begin,end,confirm,apply,rotate,remove,mirror,outline,leave:()=>{if(!position?.locked)setPosition(null);}};
}
export type FurnitureController=ReturnType<typeof useFurniture>;
export function FurnitureToolbar({controller:f,onChoose}:{controller:FurnitureController;onChoose:()=>void}){
 return <section className="furniture-toolbar" aria-label="가구 배치 도구"><h3>가구 배치</h3><p className="field-hint">기본 크기는 예시예요. 실제 가구에 맞게 수정해 주세요.</p>{Array.from(new Set(furniturePresets.map(p=>p.category))).map(category=><div key={category}><h4 className="furniture-category">{category}</h4><div className="furniture-presets">{furniturePresets.filter(p=>p.category===category).map(p=><button type="button" key={p.kind} aria-pressed={f.tool===p.kind} onClick={()=>{onChoose();f.choose(p.kind);}}><span aria-hidden="true">{p.icon}</span>{p.name}</button>)}</div></div>)}
 {(f.tool||f.selectedItem)&&<><div className="furniture-fields"><label>이름<input maxLength={40} value={f.name} onChange={e=>f.setName(e.target.value)}/></label><label>가로 (cm)<input type="number" min="10" max="1000" value={f.width} onChange={e=>f.setWidth(e.target.value)}/></label><label>세로 (cm)<input type="number" min="10" max="1000" value={f.depth} onChange={e=>f.setDepth(e.target.value)}/></label><label>회전 (도)<input type="number" value={f.angle} onChange={e=>f.setAngle(e.target.value)}/></label>{!f.tool&&<><label>중심 X (cm)<input type="number" min="-2000" max="2000" value={f.centerX} onChange={e=>f.setCenterX(e.target.value)}/></label><label>중심 Y (cm)<input type="number" min="-2000" max="2000" value={f.centerY} onChange={e=>f.setCenterY(e.target.value)}/></label></>}</div><div className="custom-actions"><button type="button" onClick={f.rotate}>90° 회전</button>{f.tool?<><button type="button" disabled={!f.position?.locked||f.problems.length>0} onClick={f.confirm}>가구 배치 확정</button><button type="button" onClick={f.cancel}>배치 취소</button></>:<><button type="button" onClick={f.apply}>크기·각도 적용</button><button type="button" onClick={()=>f.remove(f.selected!)}>선택 가구 삭제</button></>}</div></>}
 {f.tool&&<p className="field-hint">가구 아이콘 → 방 안에서 미리보기 → 클릭/터치로 위치 선택 → 가구 배치 확정. 초록은 배치 가능, 빨강은 벽 밖/겹침입니다.</p>}{f.problems.length>0&&<p role="status" className="field-error">{f.problems.join(' ')}</p>}<p className="field-hint" role="status">{f.notice}</p></section>;
}
export function FurnitureMarks({controller:f,project,inverse,interactive=true}:{controller:FurnitureController;project:(p:FurniturePoint)=>FurniturePoint;inverse:Inverse;interactive?:boolean}){
 const all=f.candidate?[...f.items,f.candidate]:f.items;
 return <g>{all.map(item=>{
  if(!validFurniture(item))return null;const preview=item.id==='__furniture_preview__',errors=furnitureIssues(item,f.items,f.outline),points=furnitureCorners(item).map(project),center=project(item),color=errors.length?'#b34036':preview?'#3b8150':f.selected===item.id?'#a54c2e':'#627453';
  return <g key={item.id} role={preview?'img':'button'} tabIndex={preview||!interactive?-1:0} aria-label={(preview?'미리보기 ':'')+item.name+(errors.length?' · '+errors.join(' '):'')} className="furniture-item" style={{pointerEvents:preview||!interactive?'none':'auto',cursor:preview?'default':'grab'}} onPointerDown={e=>{if(interactive&&!preview)f.begin(e,item,inverse);}} onClick={e=>{if(!preview&&interactive){e.stopPropagation();f.pick(item);}}} onKeyDown={e=>{if(!preview&&interactive&&(e.key==='Enter'||e.key===' ')){e.preventDefault();f.pick(item);}}}><polygon points={points.map(p=>p.x+','+p.y).join(' ')} stroke={color} strokeWidth={f.selected===item.id?3:2} fill={errors.length?'#f6dcd8':preview?'#d9ebd8':'#e4dccb'} opacity={preview ? 0.65 : 0.9} strokeDasharray={preview?'5 3':undefined}/><path d={'M'+points[0].x+' '+points[0].y+'L'+points[1].x+' '+points[1].y} stroke={color} strokeWidth="5" pointerEvents="none"/><text x={center.x} y={center.y+4} textAnchor="middle" fill={color} fontSize="11" pointerEvents="none">{item.name}</text></g>;
 })}</g>;
}
export function FurnitureList({controller:f}:{controller:FurnitureController}){
 return <section className="opening-editor" aria-label="등록한 가구"><h2>등록한 가구 · {f.items.length}개</h2><p className="field-hint">평면도의 가구를 끌어 이동하거나 선택한 뒤 회전·크기를 조절하세요. 빨간색 표시는 벽 밖/가구 겹침입니다. 문이 열리는 공간은 직접 확인해 주세요.</p>{!f.items.length?<p className="field-hint">평면도 위의 가구 아이콘으로 추가할 수 있어요.</p>:<ul className="opening-list">{f.items.map(item=>{const errors=furnitureIssues(item,f.items,f.outline);return <li key={item.id}><div><strong>{item.name}</strong><span>{item.width} × {item.depth}cm · {item.rotation}° · 중심 ({item.x}, {item.y})cm</span>{errors.length>0&&<p className="field-error">{errors.join(' ')}</p>}</div><div className="opening-row-actions"><button type="button" onClick={()=>{f.pick(item);document.querySelector('.furniture-toolbar')?.scrollIntoView({behavior:'smooth',block:'center'});}}>선택</button><button type="button" onClick={()=>f.remove(item.id)} aria-label={item.name+' 삭제'}>삭제</button></div></li>;})}</ul>}</section>;
}
