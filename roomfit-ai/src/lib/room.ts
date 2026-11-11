export type Room = { width: number; depth: number };
export type RoomErrors = { width?: string; depth?: string };
export function parseRoom(width: string, depth: string): { room: Room | null; errors: RoomErrors } {
  const errors: RoomErrors = {};
  for (const [key, raw] of [["width", width], ["depth", depth]] as const) {
    const n = Number(raw);
    if (!raw.trim()) errors[key] = "길이를 입력해 주세요.";
    else if (!Number.isFinite(n) || !Number.isInteger(n) || n < 100 || n > 2000) errors[key] = "100~2,000cm 사이의 정수를 입력해 주세요.";
  }
  return { room: Object.keys(errors).length ? null : { width: Number(width), depth: Number(depth) }, errors };
}
export function fitRoom(room: Room) {
  const scale = Math.min(480 / room.width, 320 / room.depth);
  const width = room.width * scale, height = room.depth * scale;
  return { x: (640 - width) / 2, y: (480 - height) / 2, width, height };
}
