import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const STRIPS = path.join(here, 'strips');
const DIST = path.join(here, '..', 'dist');
const PORT = Number(process.env.PORT || 3001);

const MAX_DECODED_BYTES = Number(process.env.MAX_STRIP_BYTES || 8 * 1024 * 1024);
const MAX_FILES_PER_SESSION = Number(process.env.MAX_FILES_PER_SESSION || 200);
const MAX_AGE_DAYS = Number(process.env.MAX_STRIP_AGE_DAYS || 30);
const JSON_LIMIT = '12mb';

const SESSION_RE = /^[A-Za-z0-9_-]{16,64}$/;
const FILE_RE = /^(\d+)-([a-f0-9]{6})\.(png|jpe?g|webp)$/i;

await fs.mkdir(STRIPS, { recursive: true });

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: JSON_LIMIT }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=()');
  next();
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

function getSession(req) {
  const session = req.get('X-Booth-Session') || '';
  if (!SESSION_RE.test(session)) return null;
  return session;
}

function sessionDir(session) {
  return path.join(STRIPS, session);
}

function extForMime(mime) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/webp') return 'webp';
  return 'png';
}

async function ensureSessionDir(session) {
  const dir = sessionDir(session);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

async function listSessionFiles(session) {
  const dir = sessionDir(session);
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (!FILE_RE.test(ent.name)) continue;
    const full = path.join(dir, ent.name);
    try {
      const stat = await fs.stat(full);
      files.push({ name: ent.name, size: stat.size, createdAt: stat.mtimeMs, full });
    } catch {
      // skip unreadable
    }
  }
  files.sort((a, b) => b.createdAt - a.createdAt || b.name.localeCompare(a.name));
  return files;
}

async function enforceRetention(session) {
  const files = await listSessionFiles(session);
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const toDelete = [];
  for (const f of files) {
    if (f.createdAt < cutoff) toDelete.push(f);
  }
  for (let i = MAX_FILES_PER_SESSION; i < files.length; i++) {
    if (!toDelete.includes(files[i])) toDelete.push(files[i]);
  }
  await Promise.all(toDelete.map((f) => fs.rm(f.full, { force: true })));
}

function toItem(session, f) {
  return {
    name: f.name,
    url: `/strips/${session}/${f.name}`,
    createdAt: Math.round(f.createdAt),
    size: f.size,
  };
}

app.use(
  '/strips',
  (req, res, next) => {
    // Prevent directory listing-like discovery; static will 404 for dirs/missing.
    next();
  },
  express.static(STRIPS, { index: false, fallthrough: true })
);

app.get('/api/strips', async (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Missing or invalid session.' });

  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 24));
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null;

  const files = await listSessionFiles(session);
  let start = 0;
  if (cursor) {
    const idx = files.findIndex((f) => f.name === cursor);
    if (idx >= 0) start = idx + 1;
  }
  const page = files.slice(start, start + limit);
  const next = start + limit < files.length ? files[start + limit - 1].name : null;

  res.json({ items: page.map((f) => toItem(session, f)), nextCursor: next });
});

app.post('/api/strips', writeLimiter, async (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Missing or invalid session.' });

  const raw = req.body?.image;
  if (typeof raw !== 'string')
    return res.status(400).json({ error: 'Send the strip as an image data URL.' });

  const match = /^data:(image\/png|image\/jpeg|image\/webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(raw);
  if (!match)
    return res.status(400).json({ error: 'Send the strip as a PNG, JPEG, or WEBP data URL.' });

  const mime = match[1];
  const b64 = match[2].replace(/\s+/g, '');
  let buf;
  try {
    buf = Buffer.from(b64, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid image data.' });
  }
  if (!buf.length || buf.length > MAX_DECODED_BYTES) {
    return res.status(413).json({ error: 'Image is too large.' });
  }

  const dir = await ensureSessionDir(session);
  const name = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${extForMime(mime)}`;
  const full = path.join(dir, name);

  try {
    await fs.writeFile(full, buf, { flag: 'wx' });
  } catch (err) {
    if (err && err.code === 'EEXIST')
      return res.status(409).json({ error: 'Conflict, try again.' });
    return res.status(500).json({ error: 'Could not save the strip.' });
  }

  await enforceRetention(session).catch(() => {});

  let stat;
  try {
    stat = await fs.stat(full);
  } catch {
    return res.status(500).json({ error: 'Could not save the strip.' });
  }

  res.status(201).json(toItem(session, { name, size: stat.size, createdAt: stat.mtimeMs }));
});

app.delete('/api/strips/:name', writeLimiter, async (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Missing or invalid session.' });

  const name = req.params.name;
  if (!FILE_RE.test(name)) return res.status(400).json({ error: 'Invalid strip name.' });

  const full = path.join(sessionDir(session), name);
  try {
    await fs.rm(full, { force: false });
  } catch (err) {
    if (err && err.code === 'ENOENT') return res.status(404).json({ error: 'Not found.' });
    return res.status(500).json({ error: 'Could not delete the strip.' });
  }
  res.status(204).end();
});

// Serves the built React app after `npm run build`
app.use(express.static(DIST));
app.get('*', (_req, res, next) =>
  res.sendFile(path.join(DIST, 'index.html'), (err) => err && next())
);

const server = app.listen(PORT, '0.0.0.0', () =>
  console.log(`Snapbooth server on http://localhost:${PORT}`)
);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Run "npm run dev" again to clear stale dev servers, ` +
        `or stop the process using port ${PORT}.`
    );
    process.exit(1);
  }
  throw err;
});
