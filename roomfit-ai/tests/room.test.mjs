import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync(new URL('../src/lib/room.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { parseRoom, fitRoom } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
test('valid dimensions and inclusive size limits', () => {
  for (const [width, depth] of [[360, 420], [100, 2000], [2000, 100]]) assert.deepEqual(parseRoom(String(width), String(depth)), { room: { width, depth }, errors: {} });
});
test('invalid dimensions are rejected for either axis', () => {
  for (const raw of ['', ' ', 'abc', 'Infinity', '99', '2001', '-100', '0', '360.5']) {
    assert.equal(parseRoom(raw, '420').room, null);
    assert.ok(parseRoom(raw, '420').errors.width);
    assert.ok(parseRoom('360', raw).errors.depth);
  }
});
test('floor plan preserves aspect ratio and label margins at all extremes', () => {
  for (const room of [{width:100,depth:2000}, {width:2000,depth:100}, {width:360,depth:420}, {width:2000,depth:2000}]) {
    const plan = fitRoom(room);
    assert.ok(Math.abs(plan.width / plan.height - room.width / room.depth) < 1e-10);
    assert.ok(plan.x >= 80 && plan.y >= 80);
    assert.ok(plan.x + plan.width <= 560 && plan.y + plan.height <= 400);
  }
});
