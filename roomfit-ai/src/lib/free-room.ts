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
