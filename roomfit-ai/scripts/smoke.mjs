import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

// Requires a successful npm run build. Port 0 lets the OS select a free port.
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '0', '--hostname', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NO_COLOR: '1' },
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
server.on('error', error => { output += error.message; });

try {
  let base;
  for (let attempt = 0; attempt < 100; attempt++) {
    const match = output.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+)/);
    if (match && output.includes('Ready')) { base = match[1]; break; }
    if (server.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(base, `Server did not start within 10 seconds.\n${output}`);
  for (const [path, status, text] of [
    ['/', 200, '같은 방,'],
    ['/room/new', 200, '방 크기 입력'],
    ['/missing-page', 404, '404'],
  ]) {
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, status, path);
    const html = await response.text();
    assert.ok(html.includes(text), `${path}: expected page text`);
    if (path === '/') {
      assert.ok(html.includes('href="/room/new"'), 'Start link destination');
      const css = html.match(/href="([^\"]+\.css[^\"]*)"/);
      assert.ok(css, 'Stylesheet link');
      const asset = await fetch(new URL(css[1].replaceAll('&amp;', '&'), base), { signal: AbortSignal.timeout(10000) });
      assert.equal(asset.status, 200, 'Stylesheet response');
      assert.ok((await asset.text()).includes('.hero'), 'Compiled home styles');
    }
    console.log(`PASS ${path} (${status})`);
  }
  console.log('PASS production HTTP smoke checks (not a browser interaction test)');
} finally {
  if (server.exitCode === null) {
    const closed = once(server, 'exit');
    server.kill('SIGTERM');
    const timeout = setTimeout(() => server.kill('SIGKILL'), 3000);
    await closed;
    clearTimeout(timeout);
  }
}
