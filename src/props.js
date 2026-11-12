// Vector face props. They render in the live preview and are drawn onto each
// captured photo so they end up in the composed strip.

const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${body}</svg>`;

const toUrl = (markup) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Shared “glass booth” material hints: bold silhouette, soft inner depth, crisp highlights.
const GLASS = {
  stroke: '#101425',
  strokeSoft: 'rgba(16,20,37,0.55)',
  highlight: 'rgba(255,255,255,0.75)',
  highlightSoft: 'rgba(255,255,255,0.35)',
  shadow: 'rgba(10,14,36,0.28)',
};

// The dog artwork is parameterized so tapping the stuck filter can toggle
// the tongue, like the reference look. `tongueOut` picks the variant.
const dogArt = (tongueOut) =>
  svg(
    '0 0 480 460',
    `<defs>
      <linearGradient id="dogFur" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#c89263"/>
        <stop offset="0.55" stop-color="#9a6338"/>
        <stop offset="1" stop-color="#6d4322"/>
      </linearGradient>
      <linearGradient id="dogInner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8a5832"/>
        <stop offset="1" stop-color="#5a3319"/>
      </linearGradient>
      <radialGradient id="dogSnout" cx="0.35" cy="0.28" r="0.95">
        <stop offset="0" stop-color="#5b5563"/>
        <stop offset="0.45" stop-color="#2a2833"/>
        <stop offset="1" stop-color="#14131a"/>
      </radialGradient>
      <linearGradient id="dogTongue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffb3c1"/>
        <stop offset="0.6" stop-color="#f27390"/>
        <stop offset="1" stop-color="#d94f70"/>
      </linearGradient>
      <linearGradient id="dogSheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.45)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>

    <g stroke="${GLASS.stroke}" stroke-width="6" stroke-linejoin="round">
      <path d="M196 40C140 36 88 84 66 154c-12 38-6 70 16 80 20 9 42-10 54-46 16-50 34-92 86-112Z" fill="url(#dogFur)"/>
      <path d="M284 40c56-4 108 44 130 114 12 38 6 70-16 80-20 9-42-10-54-46-16-50-34-92-86-112Z" fill="url(#dogFur)"/>
    </g>
    <path d="M182 76c-36 10-60 40-74 94-4 18 0 28 8 28 12 0 22-16 30-44 12-40 30-64 64-78Z" fill="url(#dogInner)" opacity="0.82"/>
    <path d="M298 76c36 10 60 40 74 94 4 18 0 28-8 28-12 0-22-16-30-44-12-40-30-64-64-78Z" fill="url(#dogInner)" opacity="0.82"/>
    <path d="M92 120c18-38 52-58 86-60" stroke="url(#dogSheen)" stroke-width="10" stroke-linecap="round"/>
    <path d="M388 120c-18-38-52-58-86-60" stroke="url(#dogSheen)" stroke-width="10" stroke-linecap="round"/>

    ${
      tongueOut
        ? `<g stroke="#b8445f" stroke-width="5" stroke-linejoin="round">
             <path d="M214 320h52v88a26 26 0 0 1-52 0Z" fill="url(#dogTongue)"/>
             <path d="M240 336v58" stroke="rgba(180,60,90,0.7)" stroke-width="5" stroke-linecap="round"/>
           </g>`
        : ''
    }

    <g stroke="${GLASS.stroke}" stroke-width="6" stroke-linejoin="round">
      <path d="M240 224c-40 0-62 18-62 44 0 22 18 36 36 36 10 0 15-5 26-5s16 5 26 5c18 0 36-14 36-36 0-26-22-44-62-44Z" fill="url(#dogSnout)"/>
    </g>
    <ellipse cx="218" cy="262" rx="10" ry="12" fill="#0c0c12" transform="rotate(12 218 262)"/>
    <ellipse cx="262" cy="262" rx="10" ry="12" fill="#0c0c12" transform="rotate(-12 262 262)"/>
    <path d="M214 236c10-6 20-8 28-8" stroke="${GLASS.highlightSoft}" stroke-width="6" stroke-linecap="round"/>
    ${tongueOut ? `<path d="M240 304v20" stroke="#17171e" stroke-width="6" stroke-linecap="round"/>` : `<path d="M226 304c8 8 20 8 28 0" stroke="#17171e" stroke-width="6" stroke-linecap="round" fill="none"/>`}`
  );

const ART = {
  dog: dogArt(true),
  shades: svg(
    '0 0 420 150',
    `<defs>
      <linearGradient id="lens" x1="0" y1="0" x2="0.1" y2="1">
        <stop offset="0" stop-color="#5a6285"/>
        <stop offset="0.45" stop-color="#151827"/>
        <stop offset="1" stop-color="#2b314a"/>
      </linearGradient>
      <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2a2f45"/>
        <stop offset="1" stop-color="#0e101a"/>
      </linearGradient>
      <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g stroke="${GLASS.stroke}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 46 8 38" stroke="url(#frameGrad)"/>
      <path d="M390 46 412 38" stroke="url(#frameGrad)"/>
      <path d="M184 54c14-14 38-14 52 0" fill="none" stroke="url(#frameGrad)"/>
      <rect x="28" y="22" width="156" height="104" rx="40" fill="url(#lens)"/>
      <rect x="236" y="22" width="156" height="104" rx="40" fill="url(#lens)"/>
    </g>
    <path d="M54 42c28-16 58-16 86 0" stroke="url(#glare)" stroke-width="10" stroke-linecap="round"/>
    <path d="M262 42c28-16 58-16 86 0" stroke="url(#glare)" stroke-width="10" stroke-linecap="round"/>
    <path d="M150 102c10 10 22 10 32 0" stroke="${GLASS.highlightSoft}" stroke-width="5" stroke-linecap="round"/>
    <path d="M358 102c10 10 22 10 32 0" stroke="${GLASS.highlightSoft}" stroke-width="5" stroke-linecap="round"/>`
  ),
  cat: svg(
    '0 0 420 210',
    `<defs>
      <linearGradient id="earOuter" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#4a4f6b"/>
        <stop offset="1" stop-color="#151827"/>
      </linearGradient>
      <linearGradient id="earInner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd0e3"/>
        <stop offset="1" stop-color="#ff7db3"/>
      </linearGradient>
      <linearGradient id="earSheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.4)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g stroke="${GLASS.stroke}" stroke-width="7" stroke-linejoin="round">
      <path d="M40 196 62 34c3-18 22-24 36-13l76 58c-34 38-82 74-134 117Z" fill="url(#earOuter)"/>
      <path d="M380 196 358 34c-3-18-22-24-36-13l-76 58c34 38 82 74 134 117Z" fill="url(#earOuter)"/>
    </g>
    <path d="M78 164 94 66l52 40c-20 22-42 42-68 58Z" fill="url(#earInner)" opacity="0.92"/>
    <path d="M342 164 326 66l-52 40c20 22 42 42 68 58Z" fill="url(#earInner)" opacity="0.92"/>
    <path d="M76 82c10-22 26-32 40-34" stroke="url(#earSheen)" stroke-width="8" stroke-linecap="round"/>
    <path d="M344 82c-10-22-26-32-40-34" stroke="url(#earSheen)" stroke-width="8" stroke-linecap="round"/>
    <path d="M150 124c-10 10-18 18-26 24" stroke="${GLASS.strokeSoft}" stroke-width="4" stroke-linecap="round"/>
    <path d="M270 124c10 10 18 18 26 24" stroke="${GLASS.strokeSoft}" stroke-width="4" stroke-linecap="round"/>`
  ),
  bunny: svg(
    '0 0 320 320',
    `<defs>
      <linearGradient id="bunOuter" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#dde1f2"/>
      </linearGradient>
      <linearGradient id="bunInner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd2e5"/>
        <stop offset="1" stop-color="#ff8fbd"/>
      </linearGradient>
      <linearGradient id="bunSheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.7)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g stroke="${GLASS.stroke}" stroke-width="7" stroke-linejoin="round">
      <path d="M96 304c-24-62-30-156-6-220 12-32 52-32 64 0 24 64 18 158-6 220Z" fill="url(#bunOuter)"/>
      <path d="M224 304c24-62 30-156 6-220-12-32-52-32-64 0-24 64-18 158 6 220Z" fill="url(#bunOuter)"/>
    </g>
    <path d="M116 268c-14-52-16-120-2-170 30 10 38 84 28 170Z" fill="url(#bunInner)" opacity="0.9"/>
    <path d="M204 268c14-52 16-120 2-170-30 10-38 84-28 170Z" fill="url(#bunInner)" opacity="0.9"/>
    <path d="M102 90c8-26 22-38 34-40" stroke="url(#bunSheen)" stroke-width="9" stroke-linecap="round"/>
    <path d="M218 90c-8-26-22-38-34-40" stroke="url(#bunSheen)" stroke-width="9" stroke-linecap="round"/>`
  ),
  crown: svg(
    '0 0 340 190',
    `<defs>
      <linearGradient id="gold" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#fff0b8"/>
        <stop offset="0.45" stop-color="#ffc757"/>
        <stop offset="1" stop-color="#d98512"/>
      </linearGradient>
      <linearGradient id="goldShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.35)"/>
        <stop offset="1" stop-color="rgba(120,70,10,0.15)"/>
      </linearGradient>
      <radialGradient id="gemPink" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#ffd1e6"/>
        <stop offset="1" stop-color="#ff4f9a"/>
      </radialGradient>
      <radialGradient id="gemTeal" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#d8fff9"/>
        <stop offset="1" stop-color="#2ee6d6"/>
      </radialGradient>
      <radialGradient id="gemViolet" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#eadfff"/>
        <stop offset="1" stop-color="#7c5cff"/>
      </radialGradient>
    </defs>
    <g stroke="${GLASS.stroke}" stroke-width="8" stroke-linejoin="round">
      <path d="M34 152 20 52l78 54L170 30l72 76 78-54-14 100Z" fill="url(#gold)"/>
      <rect x="34" y="150" width="272" height="28" rx="14" fill="url(#gold)"/>
    </g>
    <path d="M48 80l48 34 36-38" stroke="url(#goldShade)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M292 80l-48 34-36-38" stroke="url(#goldShade)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <g stroke="${GLASS.stroke}" stroke-width="4">
      <circle cx="170" cy="128" r="13" fill="url(#gemPink)"/>
      <circle cx="98" cy="138" r="10" fill="url(#gemTeal)"/>
      <circle cx="242" cy="138" r="10" fill="url(#gemViolet)"/>
    </g>
    <path d="M164 122c3-3 7-4 10-2" stroke="${GLASS.highlight}" stroke-width="4" stroke-linecap="round"/>`
  ),
  mustache: svg(
    '0 0 320 110',
    `<defs>
      <linearGradient id="stache" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0" stop-color="#3a3f56"/>
        <stop offset="1" stop-color="#121420"/>
      </linearGradient>
      <linearGradient id="stacheSheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(255,255,255,0)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,0.22)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g stroke="${GLASS.stroke}" stroke-width="6" stroke-linejoin="round">
      <path d="M160 34c-28-30-70-32-104-6-26 20-28 58 4 66 36 9 76-12 100-32 24 20 64 41 100 32 32-8 30-46 4-66-34-26-76-24-104 6Z" fill="url(#stache)"/>
    </g>
    <path d="M64 50c20-10 40-6 56 6" stroke="${GLASS.highlightSoft}" stroke-width="6" stroke-linecap="round"/>
    <path d="M256 50c-20-10-40-6-56 6" stroke="${GLASS.highlightSoft}" stroke-width="6" stroke-linecap="round"/>
    <path d="M110 74c30 10 70 10 100 0" stroke="url(#stacheSheen)" stroke-width="8" stroke-linecap="round"/>`
  ),
};

const META = [
  { id: 'none', name: 'None' },
  // `cx/top/width` are fallback/static hints. `faceWidth` scales against detected face.
  { id: 'shades', name: 'Shades', cx: 50, top: 33, width: 34, faceWidth: 1.18, vbW: 420, vbH: 150 },
  { id: 'cat', name: 'Cat ears', cx: 50, top: 6, width: 36, faceWidth: 1.22, vbW: 420, vbH: 210 },
  {
    id: 'bunny',
    name: 'Bunny ears',
    cx: 50,
    top: 0,
    width: 28,
    faceWidth: 0.98,
    vbW: 320,
    vbH: 320,
  },
  { id: 'crown', name: 'Crown', cx: 50, top: 5, width: 28, faceWidth: 1.0, vbW: 340, vbH: 190 },
  {
    id: 'mustache',
    name: 'Mustache',
    cx: 50,
    top: 52,
    width: 22,
    faceWidth: 0.78,
    vbW: 320,
    vbH: 110,
  },
  { id: 'dog', name: 'Dog', cx: 50, top: 2, width: 44, faceWidth: 1.42, vbW: 480, vbH: 460 },
];

export const PROPS = META.map((p) => ({
  ...p,
  art: ART[p.id] || null,
  url: ART[p.id] ? toUrl(ART[p.id]) : null,
}));

// Both dog variants, for tap-to-toggle and capture. `url`/`art` stay whole
// data URIs so the shared image cache can key on them.
export const dogArtUrl = (tongueOut) => toUrl(dogArt(tongueOut));

export function dogProp(tongueOut) {
  const base = PROPS.find((p) => p.id === 'dog');
  return { ...base, art: dogArt(tongueOut), url: dogArtUrl(tongueOut), tongueOut };
}

// Places a prop on the detected face box. All values are normalized (0–1)
// against the 4:3 stage, so the same rectangle works for the live overlay and
// the captured canvas.
export function propRectOnFace(prop, face) {
  if (!prop?.url || !face) return null;

  const fw = clamp(face.w || 0.25, 0.12, 0.85);
  const fh = clamp(face.h || 0.32, 0.16, 0.95);
  const eyeDist = clamp(face.eyeDist || fw * 0.42, fw * 0.22, fw * 0.6);
  const eyeX = face.eyeX ?? face.x + fw / 2;
  const eyeY = face.eyeY ?? face.y + fh * 0.42;
  const noseY = face.noseY ?? eyeY + fh * 0.18;
  const mouthY = face.mouthY ?? face.y + fh * 0.72;
  const faceCx = face.x + fw / 2;
  const angle = clamp(face.angle || 0, -0.7, 0.7);

  let w;
  let cx = faceCx;
  let cy = face.y + fh / 2;
  let a = angle;

  switch (prop.id) {
    case 'shades':
      // Glasses: centred on the eyes and sized from eye distance for stability.
      w = clamp(eyeDist * 2.35, fw * 0.9, fw * 1.45);
      cx = eyeX;
      cy = eyeY + fh * 0.01;
      a = angle * 0.9;
      break;
    case 'cat':
      // Ears: sit above the head, follow tilt, and span slightly wider than face.
      w = clamp(fw * 1.24, 0.18, 0.75);
      cx = faceCx + (eyeX - faceCx) * 0.2;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.18 + fh * 0.02;
      a = angle * 0.85;
      break;
    case 'bunny':
      w = clamp(fw * 1.0, 0.16, 0.62);
      cx = faceCx;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.46 + fh * 0.01;
      a = angle * 0.7;
      break;
    case 'crown':
      w = clamp(fw * 1.02, 0.16, 0.64);
      cx = faceCx + (eyeX - faceCx) * 0.15;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.32 + fh * 0.01;
      a = angle * 0.8;
      break;
    case 'mustache':
      w = clamp(eyeDist * 1.35, fw * 0.45, fw * 0.95);
      cx = faceCx + (noseY - eyeY) * Math.sin(angle) * 0.05;
      cy = noseY + (mouthY - noseY) * 0.52;
      a = angle;
      break;
    case 'dog': {
      // Floppy ears + nose + tongue. Width spans past the cheeks; the artwork's
      // nose anchor is pinned near the detected nose.
      w = clamp(fw * 1.48, 0.22, 0.92);
      cx = eyeX;
      const hNorm = w * (prop.vbH / prop.vbW) * (4 / 3);
      const noseAnchor = 268 / prop.vbH; // y in SVG where snout/nose sits
      cy = noseY - (noseAnchor - 0.5) * hNorm + fh * 0.01;
      a = angle * 0.85;
      break;
    }
    default:
      w = clamp((prop.faceWidth || 1) * fw, 0.12, 0.8);
      cx = faceCx;
      cy = face.y + fh / 2;
      a = 0;
  }

  const h = w * (prop.vbH / prop.vbW) * (4 / 3);
  return { x: cx - w / 2, y: cy - h / 2, w, h, angle: a };
}

// Centre-of-frame fallback for browsers where the tracker can't start.
export function staticPropRect(prop) {
  if (!prop?.url) return null;
  const w = prop.width / 100;
  const h = w * (prop.vbH / prop.vbW) * (4 / 3);
  return { x: prop.cx / 100 - w / 2, y: prop.top / 100, w, h, angle: 0 };
}

const cache = new Map();

export function loadPropImage(prop) {
  if (!prop?.url) return Promise.resolve(null);
  // Key on the URL, not the id: the dog has two tongue variants.
  if (!cache.has(prop.url)) {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Could not load prop: ${prop.id}`));
      img.src = prop.url;
    });
    cache.set(prop.url, promise);
    promise.catch(() => cache.delete(prop.url));
  }
  return cache.get(prop.url);
}
