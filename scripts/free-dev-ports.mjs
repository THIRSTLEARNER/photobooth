#!/usr/bin/env node
// Stops stale Snapbooth dev processes before `npm run dev` starts.
// Only processes that belong to this project are touched.
import { execFileSync } from 'node:child_process';
import net from 'node:net';

const ports = process.argv.slice(2).map(Number).filter(Boolean);
const isWin = process.platform === 'win32';
const root = process.cwd().replace(/\\/g, '/').toLowerCase();

function listProcesses() {
  if (isWin) {
    const json = execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Select-Object ProcessId,ParentProcessId,CommandLine | ConvertTo-Json -Compress`,
      ],
      { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
    ).trim();
    if (!json) return [];
    const data = JSON.parse(json);
    return (Array.isArray(data) ? data : [data]).map((p) => ({
      pid: Number(p.ProcessId),
      ppid: Number(p.ParentProcessId),
      cmd: String(p.CommandLine || '').replace(/\s+/g, ' '),
    }));
  }

  const out = execFileSync('ps', ['-eo', 'pid=,ppid=,args='], { encoding: 'utf8' });
  return out
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const m = line.trim().match(/^(\d+)\s+(\d+)\s+(.*)$/);
      return m ? { pid: Number(m[1]), ppid: Number(m[2]), cmd: m[3] } : null;
    })
    .filter(Boolean);
}

function ancestorsOf(procs) {
  const byPid = new Map(procs.map((p) => [p.pid, p]));
  const ids = new Set();
  let pid = process.pid;
  while (pid && !ids.has(pid)) {
    ids.add(pid);
    pid = byPid.get(pid)?.ppid;
  }
  return ids;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.unref();
    srv.once('error', () => resolve(false));
    srv.listen({ port, exclusive: true }, () => srv.close(() => resolve(true)));
  });
}

const procs = listProcesses();
const ancestors = ancestorsOf(procs);
const targets = new Set();

for (const p of procs) {
  if (ancestors.has(p.pid)) continue;
  const cmd = p.cmd.replace(/\\/g, '/').toLowerCase();
  if (cmd.includes(root) || /node\s+--watch\s+server\/index\.js/.test(cmd)) {
    targets.add(p.pid);
  }
}

// Include children of matched processes (e.g. the watched server process).
let grew = true;
while (grew) {
  grew = false;
  for (const p of procs) {
    if (!targets.has(p.pid) && targets.has(p.ppid)) {
      targets.add(p.pid);
      grew = true;
    }
  }
}

for (const pid of targets) {
  try {
    if (isWin) {
      execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGKILL');
    }
    console.log(`[predev] Stopped stale dev process ${pid}.`);
  } catch {
    // Already gone.
  }
}

await new Promise((r) => setTimeout(r, 400));

const busy = [];
for (const port of ports) {
  if (!(await isPortFree(port))) busy.push(port);
}

if (busy.length) {
  console.warn(`[predev] Port(s) still in use: ${busy.join(', ')}.`);
  console.warn('[predev] Close the process using them, then run npm run dev again.');
  process.exit(1);
}

console.log(`[predev] Ports ready: ${ports.join(', ')}.`);
