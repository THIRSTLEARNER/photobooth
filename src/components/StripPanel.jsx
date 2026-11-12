import { useEffect, useRef, useState } from 'react';
import { FRAMES, LAYOUTS } from '../compose.js';
import { OUTPUT_FORMAT_OPTIONS } from '../config.js';
import { CameraIcon, DownloadIcon, RetakeIcon, SaveIcon } from './icons.jsx';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function StripPanel({
  strip,
  hasShots,
  layout,
  setLayout,
  frame,
  setFrame,
  outputFormat,
  setOutputFormat,
  outputQuality,
  setOutputQuality,
  save,
  download,
  share,
  retake,
  status,
  shooting,
  applyStripSticker,
  editedStrip,
  setEditedStrip,
}) {
  const [editing, setEditing] = useState(false);
  const [sticker, setSticker] = useState(null); // {src,image,nw,nh}
  const [transform, setTransform] = useState({ x: 0.5, y: 0.5, scale: 1, rotation: 0, flipX: false, opacity: 1 });
  const [stickerError, setStickerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [builtInStickers, setBuiltInStickers] = useState([]);
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const layerRef = useRef(null);
  const transformRef = useRef(transform);
  const dragRef = useRef(null);
  const fileRef = useRef(null);
  transformRef.current = transform;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/stickers/strip/stickers.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('no manifest');
        const data = await res.json();
        const names = Array.isArray(data) ? data : Array.isArray(data?.stickers) ? data.stickers : [];
        const items = names
          .filter((n) => typeof n === 'string' && /\.(png|jpe?g|webp)$/i.test(n))
          .map((name) => ({ name, src: `/stickers/strip/${encodeURIComponent(name).replace(/%2F/g, '/')}` }));
        if (alive) setBuiltInStickers(items);
      } catch {
        if (alive) setBuiltInStickers([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    // Reset editor when base strip context changes.
    setEditing(false);
    setSticker(null);
    setStickerError('');
    setTransform({ x: 0.5, y: 0.5, scale: 1, rotation: 0, flipX: false, opacity: 1 });
  }, [strip]);

  const stickerRect = () => {
    if (!sticker?.nw || !sticker?.nh) return null;
    const t = transformRef.current;
    const baseW = 0.3;
    const w = clamp(baseW * (t.scale || 1), 0.05, 1.5);
    const img = imgRef.current;
    const aspectStage = img ? (img.clientHeight || 1) / (img.clientWidth || 1) : 1.5;
    const h = (w * (sticker.nh / sticker.nw)) / aspectStage;
    return { x: t.x - w / 2, y: t.y - h / 2, w, h, angle: t.rotation || 0, flipX: !!t.flipX, opacity: t.opacity ?? 1 };
  };

  const applyLayer = () => {
    const layer = layerRef.current;
    const r = stickerRect();
    if (!layer || !r) return;
    layer.style.left = `${(r.x + r.w / 2) * 100}%`;
    layer.style.top = `${(r.y + r.h / 2) * 100}%`;
    layer.style.width = `${r.w * 100}%`;
    layer.style.height = `${r.h * 100}%`;
    layer.style.opacity = String(r.opacity ?? 1);
    layer.style.transform = `translate(-50%, -50%) rotate(${r.angle || 0}rad) scaleX(${r.flipX ? -1 : 1})`;
  };

  useEffect(() => {
    applyLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, sticker?.src, transform, strip]);

  const toPoint = (e) => {
    const el = wrapRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  const removeStickerBackground = (img) => {
    try {
      const maxDim = 1024;
      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;
      const scale = Math.min(1, maxDim / Math.max(sw, sh));
      const w = Math.max(1, Math.round(sw * scale));
      const h = Math.max(1, Math.round(sh * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;

      const at = (x, y) => (y * w + x) * 4;
      const samples = [];
      const step = Math.max(1, Math.floor(Math.min(w, h) / 20));
      for (let x = 0; x < w; x += step) {
        samples.push(at(x, 0), at(x, h - 1));
      }
      for (let y = 0; y < h; y += step) {
        samples.push(at(0, y), at(w - 1, y));
      }
      // corners explicitly
      samples.push(at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1));

      let br = 0, bg = 0, bb = 0, n = 0;
      samples.forEach((i) => { br += d[i]; bg += d[i + 1]; bb += d[i + 2]; n++; });
      br /= n || 1; bg /= n || 1; bb /= n || 1;
      const bgBright = (br + bg + bb) / 3;
      const bgSat = Math.max(br, bg, bb) - Math.min(br, bg, bb);

      const colorDist = (i, r, g, b) => {
        const dr = d[i] - r, dg = d[i + 1] - g, db = d[i + 2] - b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };
      const distToBg = (i) => colorDist(i, br, bg, bb);
      const distToWhite = (i) => colorDist(i, 255, 255, 255);

      const baseTol = bgBright > 230 && bgSat < 25 ? 70 : bgBright > 200 ? 55 : 42;
      const feather = 18;

      const isBg = (i) => {
        if (d[i + 3] === 0) return false;
        const dd = distToBg(i);
        if (dd <= baseTol) return true;
        // Extra help for bright/white JPG backgrounds.
        if (bgBright > 210 && distToWhite(i) <= 55) return true;
        return false;
      };

      const seen = new Uint8Array(w * h);
      const qx = new Int32Array(w * h);
      const qy = new Int32Array(w * h);
      let qs = 0;
      let qe = 0;
      const push = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const p = y * w + x;
        if (seen[p]) return;
        const i = p * 4;
        if (!isBg(i)) return;
        seen[p] = 1;
        qx[qe] = x;
        qy[qe] = y;
        qe++;
      };
      for (let x = 0; x < w; x++) {
        push(x, 0);
        push(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        push(0, y);
        push(w - 1, y);
      }
      while (qs < qe) {
        const x = qx[qs];
        const y = qy[qs];
        qs++;
        const p = y * w + x;
        const i = p * 4;
        const dd = Math.min(distToBg(i), bgBright > 210 ? distToWhite(i) : 999);
        if (dd > baseTol - feather) {
          const a = Math.max(0, Math.min(1, (dd - (baseTol - feather)) / feather));
          d[i + 3] = Math.min(d[i + 3], Math.round(a * 255));
        } else {
          d[i + 3] = 0;
        }
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      }
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  };

  const startDrag = (mode, e) => {
    if (!editing || !sticker) return;
    const p = toPoint(e);
    if (!p) return;
    const t = { ...transformRef.current };
    dragRef.current = { mode, startX: p.x, startY: p.y, start: t, cx: t.x, cy: t.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  };

  const onMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const p = toPoint(e);
    if (!p) return;
    const t = { ...d.start };
    if (d.mode === 'move') {
      t.x = clamp(d.cx + (p.x - d.startX), -0.2, 1.2);
      t.y = clamp(d.cy + (p.y - d.startY), -0.2, 1.2);
    } else if (d.mode === 'resize') {
      const dx = p.x - d.cx;
      const dy = p.y - d.cy;
      const sdx = d.startX - d.cx;
      const sdy = d.startY - d.cy;
      const sd = Math.hypot(sdx, sdy) || 0.001;
      t.scale = clamp((d.start.scale || 1) * (Math.hypot(dx, dy) / sd), 0.2, 5);
    } else if (d.mode === 'rotate') {
      const a0 = Math.atan2(d.startY - d.cy, d.startX - d.cx);
      const a1 = Math.atan2(p.y - d.cy, p.x - d.cx);
      t.rotation = (d.start.rotation || 0) + (a1 - a0);
    }
    setTransform(t);
    transformRef.current = t;
  };

  const endDrag = (e) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const loadStickerFromSrc = async (src, { revokeOnFail } = {}) => {
    setLoading(true);
    setStickerError('');
    try {
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('load'));
        el.src = src;
      });
      let finalSrc = src;
      let finalImg = img;
      const processed = removeStickerBackground(img);
      if (processed) {
        try {
          const pImg = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = () => reject(new Error('processed load'));
            el.src = processed;
          });
          finalSrc = processed;
          finalImg = pImg;
        } catch {
          // fall back to original
        }
      }
      setSticker((prev) => {
        if (prev?.src?.startsWith('blob:') && prev.src !== src && prev.src !== finalSrc) URL.revokeObjectURL(prev.src);
        return {
          src: finalSrc,
          image: finalImg,
          nw: finalImg.naturalWidth || finalImg.width,
          nh: finalImg.naturalHeight || finalImg.height,
        };
      });
      if (revokeOnFail && src?.startsWith('blob:') && finalSrc !== src) {
        URL.revokeObjectURL(src);
      }
      setTransform({ x: 0.5, y: 0.5, scale: 1, rotation: 0, flipX: false, opacity: 1 });
      setEditing(true);
    } catch {
      if (revokeOnFail && src?.startsWith('blob:')) URL.revokeObjectURL(src);
      setStickerError('Couldn’t load that image. Try a PNG, JPG, or WEBP.');
    } finally {
      setLoading(false);
    }
  };

  const uploadSticker = async (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setStickerError('Couldn’t load that image. Try a PNG, JPG, or WEBP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStickerError('That image is too large. Choose one under 10 MB.');
      return;
    }
    const url = URL.createObjectURL(file);
    await loadStickerFromSrc(url, { revokeOnFail: true });
  };

  useEffect(() => () => { if (sticker?.src?.startsWith('blob:')) URL.revokeObjectURL(sticker.src); }, [sticker?.src]);

  const onApply = async () => {
    if (!sticker || !applyStripSticker) return;
    const r = stickerRect();
    if (!r) return;
    await applyStripSticker({ src: sticker.src, rect: { x: r.x, y: r.y, w: r.w, h: r.h, angle: r.angle, flipX: r.flipX, opacity: r.opacity } });
    setEditing(false);
  };
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section className="glass slot" aria-label="Photo strip">
      {strip ? (
        <>
          <div className="strip-edit-wrap" ref={wrapRef}>
            <img ref={imgRef} className="strip" src={strip} alt="Your photo strip" />
            {editing && sticker && (
              <div className="strip-sticker-layer-wrap" onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
                <div
                  ref={layerRef}
                  className="custom-sticker-layer strip-sticker-layer"
                >
                  <div className="custom-sticker-body" onPointerDown={(e) => startDrag('move', e)} role="group" aria-label="Strip sticker. Drag to move.">
                    <img src={sticker.src} alt="Strip sticker" draggable="false" />
                  </div>
                  <button type="button" className="custom-handle custom-handle-rotate" aria-label="Rotate sticker" onPointerDown={(e) => startDrag('rotate', e)} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag}><span aria-hidden="true">↻</span></button>
                  <button type="button" className="custom-handle custom-handle-resize" aria-label="Resize sticker" onPointerDown={(e) => startDrag('resize', e)} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag}><span aria-hidden="true">⇲</span></button>
                </div>
              </div>
            )}
          </div>

          <div className="field">
            <h2 id="strip-edit">Edit strip</h2>
            <p className="field-note">Add a sticker on the whole strip after your photos are done.</p>

            {builtInStickers.length > 0 ? (
              <div className="strip-sticker-picker" role="group" aria-label="Built-in strip stickers">
                {builtInStickers.map((item) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`strip-sticker-pick${sticker?.src === item.src ? ' active' : ''}`}
                    onClick={() => loadStickerFromSrc(item.src)}
                    aria-pressed={sticker?.src === item.src}
                    aria-label={`Use sticker ${item.name}`}
                    disabled={loading}
                  >
                    <img src={item.src} alt="" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="field-note">
                No built-in stickers yet. Add PNG/JPG files to <code>public/stickers/strip/</code> and list them in <code>stickers.json</code>.
              </p>
            )}

            <div className="row">
              {editing && sticker && <button type="button" className="chip" onClick={onApply}>Apply sticker</button>}
              {editing && <button type="button" className="chip" onClick={() => { setEditing(false); }}>Done</button>}
              {editedStrip && <button type="button" className="chip" onClick={() => setEditedStrip?.('')}>Remove strip edits</button>}
            </div>
            {loading && <p className="field-note" role="status">Loading image…</p>}
            {stickerError && <p className="field-note custom-error" role="alert">{stickerError}</p>}
            {editing && sticker && (
              <div className="custom-controls strip-edit-controls">
                <label className="quality-control"><span className="quality-label"><span>Size</span><strong>{Math.round((transform.scale || 1) * 100)}%</strong></span><input className="quality-range" type="range" min="0.2" max="5" step="0.01" value={transform.scale || 1} onChange={(e) => setTransform((t) => ({ ...t, scale: parseFloat(e.target.value) }))} /></label>
                <label className="quality-control"><span className="quality-label"><span>Rotate</span><strong>{Math.round(((transform.rotation || 0) * 180) / Math.PI)}°</strong></span><input className="quality-range" type="range" min="-180" max="180" step="1" value={Math.round(((transform.rotation || 0) * 180) / Math.PI)} onChange={(e) => setTransform((t) => ({ ...t, rotation: (parseFloat(e.target.value) * Math.PI) / 180 }))} /></label>
                <div className="row"><button type="button" className="chip" aria-pressed={!!transform.flipX} onClick={() => setTransform((t) => ({ ...t, flipX: !t.flipX }))}>Flip: {transform.flipX ? 'On' : 'Off'}</button></div>
              </div>
            )}
          </div>

          <div className="field">
            <h2 id="layouts">Format</h2>
            <div className="row" role="group" aria-labelledby="layouts">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  className="chip"
                  aria-pressed={layout.id === l.id}
                  onClick={() => setLayout(l)}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <h2 id="frames">Frame</h2>
            <div className="row" role="group" aria-labelledby="frames">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  className="chip"
                  aria-pressed={frame.id === f.id}
                  onClick={() => setFrame(f)}
                >
                  <span
                    className="swatch"
                    style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})` }}
                  />
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <h2 id="output">Output</h2>
            <div className="row" role="group" aria-labelledby="output">
              {OUTPUT_FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt}
                  className="chip"
                  aria-pressed={outputFormat === fmt}
                  onClick={() => setOutputFormat(fmt)}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
            {outputFormat !== 'png' && (
              <label className="quality-control">
                <span className="quality-label">
                  Quality <strong>{Math.round(outputQuality * 100)}%</strong>
                </span>
                <input
                  className="quality-range"
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.05"
                  value={outputQuality}
                  onChange={(e) => setOutputQuality(Number(e.target.value))}
                  aria-label="Output quality"
                />
              </label>
            )}
          </div>
          <div className="row">
            <button className="btn" onClick={save}>
              <SaveIcon /> Save to gallery
            </button>
            <button className="btn quiet" onClick={download}>
              <DownloadIcon /> Download
            </button>
            {canShare && (
              <button className="btn quiet" onClick={share}>
                Share
              </button>
            )}
            <button className="btn quiet" onClick={retake}>
              <RetakeIcon /> Retake all
            </button>
          </div>
          {status && (
            <p className="status" key={status} role="status">
              {status}
            </p>
          )}
        </>
      ) : (
        <div className="empty">
          <CameraIcon />
          <h2>
            {shooting
              ? 'Capturing your photos…'
              : hasShots
                ? 'Keep going'
                : 'Your strip appears here'}
          </h2>
          <p>
            {shooting
              ? 'Pose for each shot. You can retake individual photos after.'
              : hasShots
                ? 'Complete or retake shots to finish your strip.'
                : 'Pick your settings and press Start photobooth.'}
          </p>
        </div>
      )}
    </section>
  );
}
