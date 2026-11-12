import { del, list } from '@vercel/blob';

export const MAX_DECODED_BYTES = Number(process.env.MAX_STRIP_BYTES || 8 * 1024 * 1024);
export const MAX_FILES_PER_SESSION = Number(process.env.MAX_FILES_PER_SESSION || 200);
export const MAX_AGE_DAYS = Number(process.env.MAX_STRIP_AGE_DAYS || 30);
export const DEFAULT_LIMIT = 24;

const SESSION_RE = /^[A-Za-z0-9_-]{16,64}$/;
const FILE_RE = /^(\d+)-([a-f0-9]{6})\.(png|jpe?g|webp)$/i;

export function getSession(req) {
  const session = req.headers['x-booth-session'] || '';
  if (!SESSION_RE.test(session)) return null;
  return session;
}

export function extForMime(mime) {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/webp') return 'webp';
  return 'png';
}

export function parseImageDataUrl(raw) {
  if (typeof raw !== 'string')
    return { error: 'Send the strip as an image data URL.', status: 400 };
  const match = /^data:(image\/png|image\/jpeg|image\/webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(raw);
  if (!match) {
    return { error: 'Send the strip as a PNG, JPEG, or WEBP data URL.', status: 400 };
  }
  const mime = match[1];
  const b64 = match[2].replace(/\s+/g, '');
  let buf;
  try {
    buf = Buffer.from(b64, 'base64');
  } catch {
    return { error: 'Invalid image data.', status: 400 };
  }
  if (!buf.length || buf.length > MAX_DECODED_BYTES) {
    return { error: 'Image is too large.', status: 413 };
  }
  return { mime, buf };
}

export function blobPath(session, name) {
  return `strips/${session}/${name}`;
}

function nameFromPathname(pathname) {
  const parts = String(pathname || '').split('/');
  return parts[parts.length - 1] || '';
}

function createdAtFromName(name) {
  const m = /^(\d+)-/.exec(name);
  return m ? Number(m[1]) : 0;
}

export async function listSessionBlobs(session, { limit = DEFAULT_LIMIT, cursor = null } = {}) {
  const prefix = `strips/${session}/`;
  const res = await list({
    prefix,
    limit,
    cursor: cursor || undefined,
  });

  const blobs = (res.blobs || [])
    .filter((b) => FILE_RE.test(nameFromPathname(b.pathname)))
    .map((b) => {
      const name = nameFromPathname(b.pathname);
      const uploadedAt =
        b.uploadedAt instanceof Date
          ? b.uploadedAt.getTime()
          : new Date(b.uploadedAt || 0).getTime();
      return {
        pathname: b.pathname,
        name,
        url: b.url,
        size: b.size || 0,
        createdAt: createdAtFromName(name) || uploadedAt || 0,
        uploadedAt,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt || b.name.localeCompare(a.name));

  return { blobs, cursor: res.cursor || null, hasMore: !!res.hasMore };
}

export async function enforceRetention(session) {
  try {
    const prefix = `strips/${session}/`;
    let cursor;
    let all = [];
    do {
      const res = await list({ prefix, cursor, limit: 1000 });
      all = all.concat(res.blobs || []);
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);

    const mapped = all
      .filter((b) => FILE_RE.test(nameFromPathname(b.pathname)))
      .map((b) => {
        const name = nameFromPathname(b.pathname);
        const uploadedAt =
          b.uploadedAt instanceof Date
            ? b.uploadedAt.getTime()
            : new Date(b.uploadedAt || 0).getTime();
        return { url: b.url, name, createdAt: createdAtFromName(name) || uploadedAt || 0 };
      })
      .sort((a, b) => b.createdAt - a.createdAt || b.name.localeCompare(a.name));

    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const toDelete = [];
    for (const f of mapped) {
      if (f.createdAt && f.createdAt < cutoff) toDelete.push(f.url);
    }
    for (let i = MAX_FILES_PER_SESSION; i < mapped.length; i++) {
      if (!toDelete.includes(mapped[i].url)) toDelete.push(mapped[i].url);
    }
    if (toDelete.length) await del(toDelete);
  } catch {
    // best-effort retention; ignore failures
  }
}

export function toItem(sessionBlob) {
  return {
    name: sessionBlob.name,
    url: sessionBlob.url,
    createdAt: Math.round(sessionBlob.createdAt || 0),
    size: sessionBlob.size || 0,
  };
}

export function send(res, status, body) {
  res.status(status);
  if (body === null || body === undefined) return res.end();
  return res.json(body);
}

export function isValidName(name) {
  return FILE_RE.test(String(name || ''));
}

export async function findBlobByName(session, name) {
  const pathname = blobPath(session, name);
  let cursor;
  do {
    const res = await list({ prefix: pathname, limit: 1, cursor });
    const found = (res.blobs || []).find((b) => b.pathname === pathname);
    if (found) return found;
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  // fallback: list session prefix and match exact name (in case of encoding differences)
  cursor = undefined;
  const prefix = `strips/${session}/`;
  do {
    const res = await list({ prefix, cursor, limit: 1000 });
    const found = (res.blobs || []).find((b) => nameFromPathname(b.pathname) === name);
    if (found) return found;
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return null;
}
