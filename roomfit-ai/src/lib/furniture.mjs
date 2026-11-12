
export const furniturePresets=[
 {kind:'bed',name:'침대',width:100,depth:200,icon:'🛏'},
 {kind:'desk',name:'책상',width:120,depth:60,icon:'▤'},
 {kind:'wardrobe',name:'옷장',width:120,depth:60,icon:'▥'},
 {kind:'sofa',name:'소파',width:180,depth:80,icon:'🛋'},
 {kind:'table',name:'테이블',width:100,depth:100,icon:'▦'}
];
const EPS=1e-7;
const cross=(a,b)=>a.x*b.y-a.y*b.x;
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
export function furnitureCorners(item){
 const angle=item.rotation*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
 return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({x:item.x+x*item.width/2*c-y*item.depth/2*s,y:item.y+x*item.width/2*s+y*item.depth/2*c}));
}
export function validFurniture(item){
 return [item.x,item.y,item.width,item.depth,item.rotation].every(Number.isFinite)&&item.width>=10&&item.width<=1000&&item.depth>=10&&item.depth<=1000&&Math.abs(item.x)<=2000&&Math.abs(item.y)<=2000&&Math.abs(item.rotation)<=360;
}
export function pointInside(point,outline){
 let inside=false;
 for(let i=0,j=outline.length-1;i<outline.length;j=i++){
  const a=outline[j],b=outline[i],ab=sub(b,a),ap=sub(point,a);
  if(Math.abs(cross(ab,ap))<EPS&&point.x>=Math.min(a.x,b.x)-EPS&&point.x<=Math.max(a.x,b.x)+EPS&&point.y>=Math.min(a.y,b.y)-EPS&&point.y<=Math.max(a.y,b.y)+EPS)return true;
  if((a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }
 return inside;
}
function edgeInside(a,b,outline){
 const direction=sub(b,a),lengthSquared=direction.x**2+direction.y**2;
 const cuts=[0,1];
 for(let i=0;i<outline.length;i++){
  const c=outline[i],d=outline[(i+1)%outline.length],edge=sub(d,c),relative=sub(c,a),denom=cross(direction,edge);
  if(Math.abs(denom)>EPS){
   const t=cross(relative,edge)/denom,u=cross(relative,direction)/denom;
   if(t>0&&t<1&&u>=-EPS&&u<=1+EPS)cuts.push(t);
  }else if(Math.abs(cross(relative,direction))<EPS&&lengthSquared>0){
   for(const p of [c,d]){const t=((p.x-a.x)*direction.x+(p.y-a.y)*direction.y)/lengthSquared;if(t>0&&t<1)cuts.push(t);}
  }
 }
 cuts.sort((x,y)=>x-y);
 return cuts.slice(1).every((t,i)=>pointInside({x:a.x+direction.x*(t+cuts[i])/2,y:a.y+direction.y*(t+cuts[i])/2},outline));
}
export function fitsRoom(item,outline){
 if(outline.length<3||!validFurniture(item))return false;
 const points=furnitureCorners(item);
 return points.every(p=>pointInside(p,outline))&&points.every((p,i)=>edgeInside(p,points[(i+1)%4],outline));
}
export function furnitureOverlap(a,b){
 const p=furnitureCorners(a),q=furnitureCorners(b);
 for(const points of [p,q])for(let i=0;i<4;i++){
  const next=points[(i+1)%4],axis={x:-(next.y-points[i].y),y:next.x-points[i].x};
  const project=values=>values.map(v=>v.x*axis.x+v.y*axis.y);
  const x=project(p),y=project(q);
  if(Math.max(...x)<=Math.min(...y)+EPS||Math.max(...y)<=Math.min(...x)+EPS)return false;
 }
 return true;
}
export function furnitureIssues(item,items,outline){
 if(!validFurniture(item))return ['크기는 10~1,000cm, 중심 좌표는 ±2,000cm, 각도는 ±360° 범위로 입력해 주세요.'];
 const errors=[];
 if(!fitsRoom(item,outline))errors.push('가구가 방 밖으로 나가거나 벽을 가로질러요.');
 const collisions=items.filter(other=>other.id!==item.id&&validFurniture(other)&&furnitureOverlap(item,other));
 if(collisions.length)errors.push(collisions.map(o=>o.name).join(', ')+'와 겹쳐요.');
 return errors;
}
export function reflectFurniture(items,axis,outline){
 if(!outline.length)return items;
 const key=axis==='horizontal'?'x':'y',center=Math.min(...outline.map(p=>p[key]))+Math.max(...outline.map(p=>p[key]));
 return items.map(item=>({...item,[key]:center-item[key],rotation:((axis==='horizontal'?180-item.rotation:-item.rotation)%360+360)%360}));
}
