import { DEFAULT_OUTPUT_FORMAT, DEFAULT_OUTPUT_QUALITY, DEFAULT_SHOT_COUNT } from './config.js';

export const SHOTS = DEFAULT_SHOT_COUNT;

export const FILTERS = [
  { id: 'none', name: 'Clear', css: 'none' },
  { id: 'noir', name: 'Noir', css: 'grayscale(1) contrast(1.15)' },
  { id: 'chrome', name: 'Chrome', css: 'saturate(1.5) contrast(1.1) hue-rotate(-8deg)' },
  { id: 'haze', name: 'Haze', css: 'brightness(1.12) contrast(.88) saturate(.9)' },
  { id: 'dusk', name: 'Dusk', css: 'sepia(.45) saturate(1.5) hue-rotate(250deg)' },
];

export const FRAMES = [
  { id: 'frost', name: 'Frost', from: '#f4f7ff', to: '#cfd8ff', fg: '#1b2150' },
  { id: 'aurora', name: 'Aurora', from: '#6a47f0', to: '#19d3c5', fg: '#ffffff' },
  { id: 'rose', name: 'Rose', from: '#ff5fa2', to: '#ffb37a', fg: '#2b0f22' },
  { id: 'night', name: 'Night', from: '#0a0e24', to: '#2a2f6b', fg: '#f4f6ff' },
];

export const LAYOUTS = [
  { id: 'strip', name: 'Classic strip' },
  { id: 'grid', name: 'Grid' },
  { id: 'wide', name: 'Wide row' },
];

const load = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function drawPhoto(ctx, img, x, y, w, h, r = 18) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

function paintBackground(ctx, W, H, frame) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, frame.from);
  g.addColorStop(1, frame.to);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function paintFooter(ctx, W, H, frame, compact = false) {
  ctx.fillStyle = frame.fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const titleSize = compact ? 30 : 38;
  const dateSize = compact ? 16 : 20;
  const titleY = compact ? H - 38 : H - 62;
  const dateY = compact ? H - 14 : H - 28;
  ctx.font = `800 ${titleSize}px Syne, system-ui, sans-serif`;
  ctx.fillText('SNAPBOOTH', W / 2, titleY);
  ctx.font = `500 ${dateSize}px Figtree, system-ui, sans-serif`;
  ctx.fillText(
    new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    W / 2,
    dateY
  );
}

export function mimeForFormat(format = DEFAULT_OUTPUT_FORMAT) {
  if (format === 'jpeg' || format === 'jpg') return 'image/jpeg';
  if (format === 'webp') return 'image/webp';
  return 'image/png';
}

export function extensionForFormat(format = DEFAULT_OUTPUT_FORMAT) {
  if (format === 'jpeg' || format === 'jpg') return 'jpg';
  if (format === 'webp') return 'webp';
  return 'png';
}

export async function canvasToDataUrl(
  canvas,
  format = DEFAULT_OUTPUT_FORMAT,
  quality = DEFAULT_OUTPUT_QUALITY
) {
  const mime = mimeForFormat(format);
  if (mime === 'image/png') return canvas.toDataURL(mime);
  return canvas.toDataURL(mime, quality);
}

export async function canvasToBlob(
  canvas,
  format = DEFAULT_OUTPUT_FORMAT,
  quality = DEFAULT_OUTPUT_QUALITY
) {
  const mime = mimeForFormat(format);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), mime, mime === 'image/png' ? undefined : quality)
  );
}

// Draws shots onto a strip/collage and returns a canvas. Supports variable shot counts.
export async function composeStripCanvas(shots, frame, layout = 'strip') {
  const imgs = await Promise.all(shots.map(load));
  const pad = 40;
  const gap = 20;
  let W;
  let H;
  let positions;

  if (layout === 'grid') {
    const cols = imgs.length <= 1 ? 1 : 2;
    const rows = Math.ceil(imgs.length / cols);
    W = 920;
    const pw = (W - pad * 2 - gap * (cols - 1)) / cols;
    const ph = pw * 0.75;
    const footer = 100;
    H = pad + ph * rows + gap * Math.max(0, rows - 1) + footer;
    positions = imgs.map((_, i) => ({
      x: pad + (i % cols) * (pw + gap),
      y: pad + Math.floor(i / cols) * (ph + gap),
      w: pw,
      h: ph,
    }));
  } else if (layout === 'wide') {
    const cols = Math.max(1, imgs.length);
    const maxW = 1680;
    const minPhotoW = 220;
    W = Math.min(maxW, Math.max(640, pad * 2 + cols * minPhotoW + gap * (cols - 1)));
    const pw = (W - pad * 2 - gap * (cols - 1)) / cols;
    const ph = pw * 0.75;
    const footer = 90;
    H = pad + ph + footer;
    positions = imgs.map((_, i) => ({
      x: pad + i * (pw + gap),
      y: pad,
      w: pw,
      h: ph,
    }));
  } else {
    W = 640;
    const pw = W - pad * 2;
    const ph = 420;
    const footer = 120;
    H = pad + imgs.length * ph + Math.max(0, imgs.length - 1) * gap + footer;
    positions = imgs.map((_, i) => ({
      x: pad,
      y: pad + i * (ph + gap),
      w: pw,
      h: ph,
    }));
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W);
  canvas.height = Math.round(H);
  const ctx = canvas.getContext('2d');

  paintBackground(ctx, canvas.width, canvas.height, frame);
  imgs.forEach((img, i) => {
    const p = positions[i];
    if (p) drawPhoto(ctx, img, p.x, p.y, p.w, p.h);
  });
  paintFooter(ctx, canvas.width, canvas.height, frame, layout === 'wide');

  return canvas;
}

// Back-compat: returns PNG data URL.
export async function composeStrip(shots, frame, layout = 'strip') {
  const canvas = await composeStripCanvas(shots, frame, layout);
  return canvasToDataUrl(canvas, 'png');
}
