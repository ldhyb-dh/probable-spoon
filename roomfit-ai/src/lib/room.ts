export type RoomShape = "rectangle" | "l" | "u";
export type FieldKey = "width" | "depth" | "cutWidth" | "cutDepth" | "leftWing";
export type Room = Record<FieldKey, number> & { shape: RoomShape };
export type RoomErrors = Partial<Record<FieldKey, string>>;
export type Point = { x: number; y: number };
export const shapes: { id: RoomShape; name: string; path: string }[] = [
  { id: "rectangle", name: "직사각형", path: "M8 8H56V48H8Z" },
  { id: "l", name: "ㄱ자형", path: "M8 8H56V26H30V48H8Z" },
  { id: "u", name: "ㄷ자형", path: "M8 8H22V30H42V8H56V48H8Z" },
];
export function fieldsFor(shape: RoomShape): { key: FieldKey; label: string; hint: string; min: number }[] {
  const common = [
    { key: "width" as const, label: "전체 가로", hint: shape === "u" ? "아래쪽 긴 벽 G의 길이" : "위쪽 긴 벽 A의 길이", min: 100 },
    { key: "depth" as const, label: "전체 세로", hint: shape === "rectangle" ? "오른쪽 벽 B의 길이" : shape === "l" ? "왼쪽 긴 벽 F의 길이" : "왼쪽 긴 벽 H의 길이", min: 100 },
  ];
  if (shape === "rectangle") return common;
  return [...common,
    { key: "cutWidth", label: "들어간 부분 가로", hint: "안쪽 가로 벽 C의 길이", min: 10 },
    { key: "cutDepth", label: "들어간 부분 세로", hint: shape === "l" ? "안쪽 세로 벽 D의 길이" : "안쪽 세로 벽 B의 길이", min: 10 },
    ...(shape === "u" ? [{ key: "leftWing" as const, label: "왼쪽 날개 폭", hint: "왼쪽 위 짧은 벽 A의 길이", min: 10 }] : []),
  ];
}
export function parseRoom(shape: RoomShape, values: Partial<Record<FieldKey, string>>): {room: Room | null; errors: RoomErrors} {
  const errors: RoomErrors = {};
  const room: Room = { shape, width: 0, depth: 0, cutWidth: 0, cutDepth: 0, leftWing: 0 };
  for (const field of fieldsFor(shape)) {
    const raw = values[field.key] ?? "", n = Number(raw);
    if (!raw.trim()) errors[field.key] = "길이를 입력해 주세요.";
    else if (!Number.isFinite(n) || !Number.isInteger(n) || n < field.min || n > 2000) errors[field.key] = `${field.min}~2,000cm 사이의 정수를 입력해 주세요.`;
    else room[field.key] = n;
  }
  if (Object.keys(errors).length) return {room:null, errors};
  if (shape !== "rectangle") {
    if (room.cutWidth >= room.width) errors.cutWidth = "들어간 가로는 전체 가로보다 작아야 해요.";
    if (room.cutDepth >= room.depth) errors.cutDepth = "들어간 세로는 전체 세로보다 작아야 해요.";
    if (shape === "u" && room.leftWing + room.cutWidth >= room.width) errors.leftWing = "왼쪽 날개와 들어간 가로의 합이 전체 가로보다 작아야 해요.";
  }
  return { room: Object.keys(errors).length ? null : room, errors };
}
export function roomPoints(r: Room): Point[] {
  const w=r.width, h=r.depth, c=r.cutWidth, d=r.cutDepth, l=r.leftWing;
  if (r.shape === "l") return [{x:0,y:0},{x:w,y:0},{x:w,y:h-d},{x:w-c,y:h-d},{x:w-c,y:h},{x:0,y:h}];
  if (r.shape === "u") return [{x:0,y:0},{x:l,y:0},{x:l,y:d},{x:l+c,y:d},{x:l+c,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
  return [{x:0,y:0},{x:w,y:0},{x:w,y:h},{x:0,y:h}];
}
export function measureRoom(room: Room) {
  const points=roomPoints(room);
  const walls=points.map((p,i)=>{
    const end=points[(i+1)%points.length];
    return {label:String.fromCharCode(65+i),start:p,end,length:Math.hypot(end.x-p.x,end.y-p.y)};
  });
  const area=Math.abs(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p.x*q.y-q.x*p.y;},0))/2;
  return {points,walls,area,perimeter:walls.reduce((sum,w)=>sum+w.length,0)};
}
export function fitRoom(room: Room) {
  const scale=Math.min(480/room.width,320/room.depth);
  const x=(640-room.width*scale)/2, y=(480-room.depth*scale)/2;
  return {scale, x, y, points:roomPoints(room).map(p=>({x:x+p.x*scale,y:y+p.y*scale}))};
}
