import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY_PAGE_SIZE, SESSION_HEADER, SESSION_STORAGE_KEY } from '../config.js';

function getOrCreateSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && /^[A-Za-z0-9_-]{16,64}$/.test(existing)) return existing;
    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    const id = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

export function useGallery() {
  const [gallery, setGallery] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [status, setStatus] = useState('');
  const cancelled = useRef(false);
  const sessionIdRef = useRef('');

  if (!sessionIdRef.current) sessionIdRef.current = getOrCreateSessionId();

  const headers = useCallback(
    (extra = {}) => ({ ...extra, [SESSION_HEADER]: sessionIdRef.current }),
    []
  );

  const loadGallery = useCallback(
    async ({ reset = true, cursor = null } = {}) => {
      try {
        const params = new URLSearchParams({ limit: String(GALLERY_PAGE_SIZE) });
        if (cursor) params.set('cursor', cursor);
        const res = await fetch(`/api/strips?${params.toString()}`, { headers: headers() });
        if (cancelled.current) return;
        if (!res.ok) throw new Error('load failed');
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        const next = Array.isArray(data) ? null : (data.nextCursor ?? null);
        setGallery((prev) => (reset ? items : [...prev, ...items]));
        setNextCursor(next);
      } catch {
        if (cancelled.current) return;
        setStatus('The gallery server isn’t running. Start it with npm run dev.');
      }
    },
    [headers]
  );

  useEffect(() => {
    cancelled.current = false;
    loadGallery({ reset: true });
    return () => {
      cancelled.current = true;
    };
  }, [loadGallery]);

  const loadMore = useCallback(async () => {
    if (!nextCursor) return;
    await loadGallery({ reset: false, cursor: nextCursor });
  }, [loadGallery, nextCursor]);

  const saveStrip = useCallback(
    async (strip) => {
      setStatus('Saving…');
      try {
        const res = await fetch('/api/strips', {
          method: 'POST',
          headers: headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ image: strip }),
        });
        if (!res.ok) {
          let message = 'Couldn’t save the strip.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string' && data.error) message = data.error;
          } catch {
            // ignore parse errors
          }
          throw new Error(message);
        }
        setStatus('Saved to your private gallery.');
        await loadGallery({ reset: true });
        return true;
      } catch (err) {
        setStatus(
          err && err.message && err.message !== 'Failed to fetch'
            ? err.message
            : 'Couldn’t save the strip. Check that the server is running.'
        );
        return false;
      }
    },
    [headers, loadGallery]
  );

  const removeStrip = useCallback(
    async (name) => {
      try {
        await fetch(`/api/strips/${encodeURIComponent(name)}`, {
          method: 'DELETE',
          headers: headers(),
        });
        await loadGallery({ reset: true });
      } catch {
        // ignore; gallery will refresh on next load
      }
    },
    [headers, loadGallery]
  );

  return { gallery, nextCursor, status, setStatus, loadGallery, loadMore, saveStrip, removeStrip };
}
