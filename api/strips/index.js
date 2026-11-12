import crypto from 'node:crypto';
import {
  DEFAULT_LIMIT,
  enforceRetention,
  extForMime,
  getSession,
  listSessionBlobs,
  parseImageDataUrl,
  send,
  toItem,
} from '../_lib.js';
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session) return send(res, 401, { error: 'Missing or invalid session.' });

  if (req.method === 'GET') {
    try {
      const limit = Math.max(1, Math.min(100, Number(req.query?.limit) || DEFAULT_LIMIT));
      const cursor =
        typeof req.query?.cursor === 'string' && req.query.cursor ? req.query.cursor : null;
      const {
        blobs,
        cursor: nextCursor,
        hasMore,
      } = await listSessionBlobs(session, { limit, cursor });
      // best-effort retention on read path (throttling not necessary here)
      await enforceRetention(session);
      return send(res, 200, {
        items: blobs.map(toItem),
        nextCursor: hasMore ? nextCursor : null,
      });
    } catch (err) {
      const msg = err && err.message ? String(err.message) : '';
      if (/BLOB_READ_WRITE_TOKEN/i.test(msg)) {
        return send(res, 500, {
          error: 'Gallery storage is not configured (missing BLOB_READ_WRITE_TOKEN).',
        });
      }
      return send(res, 500, { error: 'Could not load gallery.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const raw = req.body?.image;
      const parsed = parseImageDataUrl(raw);
      if (parsed.error) return send(res, parsed.status, { error: parsed.error });

      const { mime, buf } = parsed;
      const name = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${extForMime(mime)}`;
      const pathname = `strips/${session}/${name}`;

      const blob = await put(pathname, buf, {
        access: 'public',
        contentType: mime,
        addRandomSuffix: false,
      });

      await enforceRetention(session);

      return send(res, 201, {
        name,
        url: blob.url,
        createdAt: Date.now(),
        size: buf.length,
      });
    } catch (err) {
      const msg = err && err.message ? String(err.message) : '';
      if (/BLOB_READ_WRITE_TOKEN/i.test(msg)) {
        return send(res, 500, {
          error: 'Gallery storage is not configured (missing BLOB_READ_WRITE_TOKEN).',
        });
      }
      return send(res, 500, { error: 'Could not save the strip.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return send(res, 405, { error: 'Method not allowed.' });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};
