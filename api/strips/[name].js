import { del } from '@vercel/blob';
import { findBlobByName, getSession, isValidName, send } from '../_lib.js';

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session) return send(res, 401, { error: 'Missing or invalid session.' });

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const name = Array.isArray(req.query?.name) ? req.query.name[0] : req.query?.name;
  if (!isValidName(name)) return send(res, 400, { error: 'Invalid strip name.' });

  try {
    const blob = await findBlobByName(session, name);
    if (!blob) return send(res, 404, { error: 'Not found.' });
    await del(blob.url);
    return res.status(204).end();
  } catch (err) {
    const msg = err && err.message ? String(err.message) : '';
    if (/BLOB_READ_WRITE_TOKEN/i.test(msg)) {
      return send(res, 500, {
        error: 'Gallery storage is not configured (missing BLOB_READ_WRITE_TOKEN).',
      });
    }
    return send(res, 500, { error: 'Could not delete the strip.' });
  }
}
