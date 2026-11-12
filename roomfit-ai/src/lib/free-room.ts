export type Vertex = { x: number; y: number; bulge: number };
export type XY = { x: number; y: number };
export const diagonalExample: Vertex[] = [{x:0,y:0,bulge:0},{x:400,y:0,bulge:0},{x:480,y:200,bulge:0},{x:400,y:400,bulge:0},{x:0,y:400,bulge:0}];
export const curveExample: Vertex[] = [{x:0,y:0,bulge:0},{x:400,y:0,bulge:-80},{x:400,y:400,bulge:0},{x:0,y:400,bulge:0}];
export function control(a: Vertex,b: Vertex): XY {
  const length=Math.hypot(b.x-a.x,b.y-a.y);
  return {x:(a.x+b.x)/2-(b.y-a.y)/length*2*a.bulge,y:(a.y+b.y)/2+(b.x-a.x)/length*2*a.bulge};
}
export function pointOnWall(a: Vertex,b: Vertex,t:number): XY {
  if(!a.bulge)return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
  const c=control(a,b),s=1-t;
  return {x:s*s*a.x+2*s*t*c.x+t*t*b.x,y:s*s*a.y+2*s*t*c.y+t*t*b.y};
}
function derivative(a: Vertex,b:Vertex,t:number): XY {
  if(!a.bulge)return {x:b.x-a.x,y:b.y-a.y};
  const c=control(a,b);
  return {x:2*((1-t)*(c.x-a.x)+t*(b.x-c.x)),y:2*((1-t)*(c.y-a.y)+t*(b.y-c.y))};
}
function integrate(f:(t:number)=>number,start=0,end=1,tolerance=0.00001,depth=16):number {
  const mid=(start+end)/2,whole=(end-start)/6*(f(start)+4*f(mid)+f(end));
  const left=(mid-start)/6*(f(start)+4*f((start+mid)/2)+f(mid));
  const right=(end-mid)/6*(f(mid)+4*f((mid+end)/2)+f(end));
  if(depth===0||Math.abs(left+right-whole)<15*tolerance)return left+right+(left+right-whole)/15;
  return integrate(f,start,mid,tolerance/2,depth-1)+integrate(f,mid,end,tolerance/2,depth-1);
}
const cross=(a:XY,b:XY,c:XY)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function intersects(a:XY,b:XY,c:XY,d:XY):boolean {
  const eps=1e-7;
  const on=(p:XY,q:XY,r:XY)=>Math.abs(cross(p,q,r))<eps&&r.x>=Math.min(p.x,q.x)-eps&&r.x<=Math.max(p.x,q.x)+eps&&r.y>=Math.min(p.y,q.y)-eps&&r.y<=Math.max(p.y,q.y)+eps;
  const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);
  return (x*y<0&&z*w<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);
}
export function analyzeFreeRoom(vertices:Vertex[]) {
  const invalid=(error:string)=>({error,area:0,perimeter:0,lengths:[] as number[],outline:[] as XY[]});
  if(vertices.length<3||vertices.length>12)return invalid('꼭짓점은 3~12개가 필요해요.');
  if(vertices.some(p=>![p.x,p.y,p.bulge].every(Number.isFinite)||Math.abs(p.x)>2000||Math.abs(p.y)>2000||Math.abs(p.bulge)>500))return invalid('좌표는 -2,000~2,000cm, 휘어짐은 -500~500cm 범위로 입력해 주세요.');
  if(vertices.some((a,i)=>Math.hypot(a.x-vertices[(i+1)%vertices.length].x,a.y-vertices[(i+1)%vertices.length].y)<1))return invalid('이웃한 꼭짓점 사이를 1cm 이상 띄워 주세요.');
  const outline=vertices.flatMap((a,i)=>Array.from({length:a.bulge?64:1},(_,j)=>pointOnWall(a,vertices[(i+1)%vertices.length],j/(a.bulge?64:1))));
  const n=outline.length;
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    if(j===i+1||(i===0&&j===n-1))continue;
    if(intersects(outline[i],outline[(i+1)%n],outline[j],outline[(j+1)%n]))return invalid('벽이 서로 교차하거나 겹쳐 있어요. 꼭짓점 위치 또는 휘어짐을 조절해 주세요.');
  }
  // Catch adjacent segments that double back over each other.
  for(let i=0;i<n;i++){
    const a=outline[(i+n-1)%n],b=outline[i],c=outline[(i+1)%n];
    if(Math.abs(cross(a,b,c))<1e-7&&(a.x-b.x)*(c.x-b.x)+(a.y-b.y)*(c.y-b.y)>0)return invalid('벽이 되돌아가며 겹쳐 있어요. 꼭짓점을 조절해 주세요.');
  }
  const lengths=vertices.map((a,i)=>{const b=vertices[(i+1)%vertices.length];return integrate(t=>{const d=derivative(a,b,t);return Math.hypot(d.x,d.y);});});
  const signedArea=vertices.reduce((sum,a,i)=>sum+integrate(t=>{const b=vertices[(i+1)%vertices.length],p=pointOnWall(a,b,t),d=derivative(a,b,t);return (p.x*d.y-p.y*d.x)/2;}),0);
  if(Math.abs(signedArea)<1)return invalid('면적이 너무 작거나 점들이 일직선이에요.');
  return {error:'',area:Math.abs(signedArea),perimeter:lengths.reduce((a,b)=>a+b,0),lengths,outline};
}

// Reflection reverses orientation, so the signed curve offset must reverse too.
export function reflectRoom(vertices:Vertex[],axis:'horizontal'|'vertical'):Vertex[]{
  const key=axis==='horizontal'?'x':'y';
  const center=Math.min(...vertices.map(p=>p[key]))+Math.max(...vertices.map(p=>p[key]));
  return vertices.map(p=>({...p,[key]:center-p[key],bulge:p.bulge===0?0:-p.bulge}));
}
// Delta is measured in room cm against the viewport frozen at pointer-down.
export function moveVertex(vertices:Vertex[],index:number,dx:number,dy:number):Vertex[]{
  if(!vertices[index]||!Number.isFinite(dx)||!Number.isFinite(dy))return vertices;
  const clamp=(n:number)=>Math.max(-2000,Math.min(2000,Math.round(n)));
  const point={...vertices[index],x:clamp(vertices[index].x+dx),y:clamp(vertices[index].y+dy)};
  const previous=vertices[(index+vertices.length-1)%vertices.length],next=vertices[(index+1)%vertices.length];
  if(Math.hypot(point.x-previous.x,point.y-previous.y)<1||Math.hypot(point.x-next.x,point.y-next.y)<1)return vertices;
  return vertices.map((p,i)=>i===index?point:p);
}

export type Opening={id:string;type:'door'|'window';wall:number;offset:number;width:number;hinge:'start'|'end';swing:'inside'|'outside'};
export function wallLength(a:Vertex,b:Vertex){return integrate(t=>{const d=derivative(a,b,t);return Math.hypot(d.x,d.y);});}
export function validateOpening(vertices:Vertex[],opening:Opening,all:Opening[]=[]):string{
  if(!Number.isInteger(opening.wall)||opening.wall<0||opening.wall>=vertices.length)return '벽을 다시 선택해 주세요.';
  if(!Number.isFinite(opening.offset)||opening.offset<0||!Number.isFinite(opening.width)||opening.width<10)return '시작 거리는 0 이상, 폭은 10cm 이상이어야 해요.';
  const a=vertices[opening.wall],b=vertices[(opening.wall+1)%vertices.length];
  if(![a.x,a.y,a.bulge,b.x,b.y].every(Number.isFinite)||Math.hypot(a.x-b.x,a.y-b.y)<1)return '먼저 유효한 방 치수를 입력해 주세요.';
  if(opening.type==='door'&&a.bulge!==0)return '문은 직선·사선 벽에 배치할 수 있어요. 곡선 벽에는 창문을 선택해 주세요.';
  if(opening.offset+opening.width>wallLength(a,b)+1e-6)return '문·창문이 벽 끝을 넘어가요. 시작 거리 또는 폭을 줄여 주세요.';
  if(all.some(o=>o.id!==opening.id&&o.wall===opening.wall&&opening.offset<o.offset+o.width-1e-6&&o.offset<opening.offset+opening.width-1e-6))return '같은 벽의 다른 문·창문과 겹쳐 있어요.';
  return '';
}
// Map arc-length distance to the quadratic parameter with a 128-step lookup.
export function pointAtWallDistance(a:Vertex,b:Vertex,distance:number):XY{
  const length=wallLength(a,b);
  if(!a.bulge)return pointOnWall(a,b,Math.max(0,Math.min(1,distance/length)));
  const samples=Array.from({length:129},(_,i)=>pointOnWall(a,b,i/128));
  const lengths=[0];for(let i=1;i<samples.length;i++)lengths.push(lengths[i-1]+Math.hypot(samples[i].x-samples[i-1].x,samples[i].y-samples[i-1].y));
  const target=Math.max(0,Math.min(1,distance/length))*lengths[128];
  const index=Math.max(1,lengths.findIndex(l=>l>=target));
  const t=(index-1+(target-lengths[index-1])/(lengths[index]-lengths[index-1]))/128;
  return pointOnWall(a,b,t);
}
export function openingGeometry(vertices:Vertex[],o:Opening){
  const a=vertices[o.wall],b=vertices[(o.wall+1)%vertices.length];
  const path=Array.from({length:17},(_,i)=>pointAtWallDistance(a,b,o.offset+o.width*i/16));
  const start=path[0],end=path[16];
  const hinge=o.hinge==='start'?start:end,closed=o.hinge==='start'?end:start;
  const length=Math.hypot(end.x-start.x,end.y-start.y),ux=(end.x-start.x)/length,uy=(end.y-start.y)/length;
  const orientation=Math.sign(vertices.reduce((sum,p,i)=>{const q=vertices[(i+1)%vertices.length];return sum+integrate(t=>{const v=pointOnWall(p,q,t),d=derivative(p,q,t);return v.x*d.y-v.y*d.x;});},0))||1;
  const side=orientation*(o.swing==='inside'?1:-1),nx=-uy*side,ny=ux*side;
  const base={x:(closed.x-hinge.x)/length,y:(closed.y-hinge.y)/length};
  const arc=Array.from({length:17},(_,i)=>{const t=i/16*Math.PI/2;return {x:hinge.x+o.width*(base.x*Math.cos(t)+nx*Math.sin(t)),y:hinge.y+o.width*(base.y*Math.cos(t)+ny*Math.sin(t))};});
  return {path,start,end,hinge,leaf:arc[16],arc};
}
// Keep unaffected wall bindings; changed walls require explicit reassignment.
export function remapOpenings(all:Opening[],index:number,action:'insert'|'remove',count:number):Opening[]{
  return all.map(o=>{
    if(o.wall<0)return o;
    if(action==='insert')return {...o,wall:o.wall===index?-1:o.wall>index?o.wall+1:o.wall};
    const previous=(index+count-1)%count;
    return {...o,wall:o.wall===index||o.wall===previous?-1:o.wall>index?o.wall-1:o.wall};
  });
}

export function nearestOpeningPosition(vertices:Vertex[],pointer:XY,project:(p:XY)=>XY,width:number,maxDistance=24):{wall:number;offset:number;distance:number}|null{
  let best:{wall:number;offset:number;distance:number}|null=null;
  vertices.forEach((a,wall)=>{
    const b=vertices[(wall+1)%vertices.length];
    if(![a.x,a.y,a.bulge,b.x,b.y].every(Number.isFinite)||Math.hypot(b.x-a.x,b.y-a.y)<1)return;
    const count=a.bulge?128:1;
    const points=Array.from({length:count+1},(_,i)=>pointOnWall(a,b,i/count));
    const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));
    const length=wallLength(a,b);
    for(let i=1;i<points.length;i++){
      const p=project(points[i-1]),q=project(points[i]),dx=q.x-p.x,dy=q.y-p.y,n=dx*dx+dy*dy;
      if(!n)continue;
      const u=Math.max(0,Math.min(1,((pointer.x-p.x)*dx+(pointer.y-p.y)*dy)/n));
      const distance=Math.hypot(pointer.x-p.x-u*dx,pointer.y-p.y-u*dy);
      if(distance>maxDistance||(best!==null&&distance>=best.distance))continue;
      const center=(distances[i-1]+u*(distances[i]-distances[i-1]))/distances[count]*length;
      best={wall,offset:Math.min(Math.max(0,length-width),Math.round(Math.max(0,center-width/2)*10)/10),distance};
    }
  });
  return best;
}
