// Vector face props. They render in the live preview and are drawn onto each
// captured photo so they end up in the composed strip.

const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${body}</svg>`;

const toUrl = (markup) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Shared material system: soft ink edges, luminous highlights, gentle contact depth.
const M = {
  ink: '#141828',
  inkSoft: 'rgba(20,24,40,0.45)',
  hi: 'rgba(255,255,255,0.58)',
  hiSoft: 'rgba(255,255,255,0.28)',
};

// The dog artwork is parameterized so tapping the prop can toggle the tongue.
// Both variants share the same silhouette/anchor for stable tracking and capture.
const dogArt = (tongueOut) =>
  svg(
    '0 0 480 440',
    `<defs>
      <linearGradient id="dfur" x1="0.1" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#d39a6a"/>
        <stop offset="0.55" stop-color="#a66a3c"/>
        <stop offset="1" stop-color="#744724"/>
      </linearGradient>
      <linearGradient id="dinner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#94603a"/>
        <stop offset="1" stop-color="#643722"/>
      </linearGradient>
      <radialGradient id="dsn" cx="0.38" cy="0.3" r="0.9">
        <stop offset="0" stop-color="#5a5666"/>
        <stop offset="0.5" stop-color="#262532"/>
        <stop offset="1" stop-color="#12111a"/>
      </radialGradient>
      <linearGradient id="dtongue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffc0cc"/>
        <stop offset="0.55" stop-color="#f47b95"/>
        <stop offset="1" stop-color="#d95473"/>
      </linearGradient>
      <linearGradient id="dshine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${M.hi}"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>

    <!-- ears -->
    <path d="M186 46C132 42 86 90 70 150c-10 34-4 62 16 70 18 8 38-10 48-42 16-46 34-86 78-104Z" fill="url(#dfur)" stroke="${M.ink}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M294 46c54-4 100 44 116 104 10 34 4 62-16 70-18 8-38-10-48-42-16-46-34-86-78-104Z" fill="url(#dfur)" stroke="${M.ink}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M172 80c-30 12-50 40-62 86-3 14 0 22 7 22 10 0 20-14 28-40 12-36 30-58 56-70Z" fill="url(#dinner)" opacity="0.85"/>
    <path d="M308 80c30 12 50 40 62 86 3 14 0 22-7 22-10 0-20-14-28-40-12-36-30-58-56-70Z" fill="url(#dinner)" opacity="0.85"/>
    <path d="M96 112c16-30 44-46 72-48" stroke="url(#dshine)" stroke-width="9" stroke-linecap="round"/>
    <path d="M384 112c-16-30-44-46-72-48" stroke="url(#dshine)" stroke-width="9" stroke-linecap="round"/>

    <!-- tongue (variant) -->
    ${
      tongueOut
        ? `<path d="M216 312h48v82a24 24 0 0 1-48 0Z" fill="url(#dtongue)" stroke="#b84d69" stroke-width="5" stroke-linejoin="round"/>
           <path d="M240 328v52" stroke="rgba(170,60,90,0.55)" stroke-width="4.5" stroke-linecap="round"/>`
        : `<path d="M224 314c10 10 22 10 32 0" stroke="#8a4b5a" stroke-width="5" stroke-linecap="round" opacity="0.55"/>`
    }

    <!-- snout/nose -->
    <path d="M240 218c-38 0-58 17-58 41 0 20 17 34 34 34 10 0 14-5 24-5s14 5 24 5c17 0 34-14 34-34 0-24-20-41-58-41Z" fill="url(#dsn)" stroke="${M.ink}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="220" cy="254" rx="9" ry="11" fill="#0b0b12" transform="rotate(10 220 254)"/>
    <ellipse cx="260" cy="254" rx="9" ry="11" fill="#0b0b12" transform="rotate(-10 260 254)"/>
    <path d="M216 230c9-5 18-7 24-7" stroke="${M.hiSoft}" stroke-width="6" stroke-linecap="round"/>
    ${tongueOut ? `<path d="M240 296v18" stroke="#1a1a22" stroke-width="5.5" stroke-linecap="round"/>` : `<path d="M228 296c8 7 16 7 24 0" stroke="#1a1a22" stroke-width="5.5" stroke-linecap="round"/>`}`
  );

const ART = {
  dog: dogArt(true),
  shades: svg(
    '0 0 420 140',
    `<defs>
      <linearGradient id="sframe" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2f3650"/>
        <stop offset="1" stop-color="#0f1324"/>
      </linearGradient>
      <linearGradient id="slens" x1="0" y1="0" x2="0.15" y2="1">
        <stop offset="0" stop-color="#5b6488"/>
        <stop offset="0.45" stop-color="#171b2d"/>
        <stop offset="1" stop-color="#2a3148"/>
      </linearGradient>
      <linearGradient id="ssheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.5)"/>
        <stop offset="0.55" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <g stroke="${M.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 42 6 36" stroke="url(#sframe)"/>
      <path d="M396 42 414 36" stroke="url(#sframe)"/>
      <path d="M186 50c14-12 34-12 48 0" fill="none" stroke="url(#sframe)" stroke-width="8"/>
      <rect x="24" y="18" width="162" height="100" rx="38" fill="url(#slens)"/>
      <rect x="234" y="18" width="162" height="100" rx="38" fill="url(#slens)"/>
    </g>
    <path d="M48 36c30-14 68-14 100 4" stroke="url(#ssheen)" stroke-width="9" stroke-linecap="round"/>
    <path d="M258 36c30-14 68-14 100 4" stroke="url(#ssheen)" stroke-width="9" stroke-linecap="round"/>
    <path d="M154 94c10 8 22 8 32 0" stroke="${M.hiSoft}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M364 94c10 8 22 8 32 0" stroke="${M.hiSoft}" stroke-width="4.5" stroke-linecap="round"/>`
  ),
  cat: svg(
    '0 0 420 200',
    `<defs>
      <linearGradient id="cear" x1="0.1" y1="0" x2="0.25" y2="1">
        <stop offset="0" stop-color="#535976"/>
        <stop offset="1" stop-color="#171a2a"/>
      </linearGradient>
      <linearGradient id="cinner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd6e6"/>
        <stop offset="0.55" stop-color="#ffb8d2"/>
        <stop offset="1" stop-color="#f06fa8"/>
      </linearGradient>
      <linearGradient id="cshine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${M.hi}"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <!-- outer ears (slight splay/asymmetry) -->
    <path d="M38 186 64 38c4-16 22-22 35-10l72 62c-36 36-82 68-133 96Z" fill="url(#cear)" stroke="${M.ink}" stroke-width="6.5" stroke-linejoin="round"/>
    <path d="M382 186 356 38c-4-16-22-22-35-10l-72 62c36 36 82 68 133 96Z" fill="url(#cear)" stroke="${M.ink}" stroke-width="6.5" stroke-linejoin="round"/>
    <!-- inner ears -->
    <path d="M76 156 94 72l48 42c-20 20-42 34-66 42Z" fill="url(#cinner)" opacity="0.94"/>
    <path d="M344 156 326 72l-48 42c20 20 42 34 66 42Z" fill="url(#cinner)" opacity="0.94"/>
    <!-- rim highlights -->
    <path d="M78 84c10-18 24-28 36-30" stroke="url(#cshine)" stroke-width="7" stroke-linecap="round"/>
    <path d="M342 84c-10-18-24-28-36-30" stroke="url(#cshine)" stroke-width="7" stroke-linecap="round"/>
    <!-- soft depth near base -->
    <path d="M150 122c-10 8-18 14-24 18" stroke="${M.inkSoft}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M270 122c10 8 18 14 24 18" stroke="${M.inkSoft}" stroke-width="3.5" stroke-linecap="round"/>`
  ),
  bunny: svg(
    '0 0 320 320',
    `<defs>
      <linearGradient id="bout" x1="0.2" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="#fbfcff"/>
        <stop offset="1" stop-color="#dde3f7"/>
      </linearGradient>
      <linearGradient id="binner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffddec"/>
        <stop offset="0.55" stop-color="#ffb8d2"/>
        <stop offset="1" stop-color="#f06fa8"/>
      </linearGradient>
      <linearGradient id="bshine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.75)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <!-- left ear: slight outward curve -->
    <path d="M100 304c-22-60-26-150-4-214 11-30 48-30 59 0 22 64 16 154-6 214Z" fill="url(#bout)" stroke="${M.ink}" stroke-width="6.5" stroke-linejoin="round"/>
    <!-- right ear: gentle lean for natural asymmetry -->
    <path d="M220 304c22-60 28-150 6-214-11-30-48-30-59 0-22 64-18 154 4 214Z" fill="url(#bout)" stroke="${M.ink}" stroke-width="6.5" stroke-linejoin="round"/>
    <path d="M118 266c-12-50-14-116-2-164 26 10 34 80 26 164Z" fill="url(#binner)" opacity="0.92"/>
    <path d="M202 266c12-50 14-116 2-164-26 10-34 80-26 164Z" fill="url(#binner)" opacity="0.92"/>
    <path d="M106 92c8-24 20-34 30-36" stroke="url(#bshine)" stroke-width="8" stroke-linecap="round"/>
    <path d="M214 92c-8-24-20-34-30-36" stroke="url(#bshine)" stroke-width="8" stroke-linecap="round"/>`
  ),
  crown: svg(
    '0 0 340 180',
    `<defs>
      <linearGradient id="cgold" x1="0.1" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#ffe7a8"/>
        <stop offset="0.45" stop-color="#f6b84e"/>
        <stop offset="1" stop-color="#d98512"/>
      </linearGradient>
      <linearGradient id="cshade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(255,255,255,0.38)"/>
        <stop offset="1" stop-color="rgba(120,70,10,0.12)"/>
      </linearGradient>
      <radialGradient id="g1" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#ffe0ef"/>
        <stop offset="1" stop-color="#f06fa8"/>
      </radialGradient>
      <radialGradient id="g2" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#dffff9"/>
        <stop offset="1" stop-color="#2ee6d6"/>
      </radialGradient>
      <radialGradient id="g3" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#ece4ff"/>
        <stop offset="1" stop-color="#7c5cff"/>
      </radialGradient>
    </defs>
    <path d="M38 146 24 56l76 50L170 34l70 72 76-50-14 90Z" fill="url(#cgold)" stroke="${M.ink}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="38" y="144" width="264" height="24" rx="12" fill="url(#cgold)" stroke="${M.ink}" stroke-width="7"/>
    <path d="M56 84l46 30 34-34" stroke="url(#cshade)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M284 84l-46 30-34-34" stroke="url(#cshade)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="170" cy="124" r="12" fill="url(#g1)" stroke="${M.ink}" stroke-width="3.5"/>
    <circle cx="102" cy="134" r="9" fill="url(#g2)" stroke="${M.ink}" stroke-width="3.5"/>
    <circle cx="238" cy="134" r="9" fill="url(#g3)" stroke="${M.ink}" stroke-width="3.5"/>
    <path d="M164 118c3-3 6-4 9-2" stroke="${M.hi}" stroke-width="3.5" stroke-linecap="round"/>`
  ),
  mustache: svg(
    '0 0 320 110',
    `<defs>
      <linearGradient id="mst" x1="0.1" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#3f465e"/>
        <stop offset="1" stop-color="#141828"/>
      </linearGradient>
      <linearGradient id="mshine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(255,255,255,0)"/>
        <stop offset="0.5" stop-color="rgba(255,255,255,0.22)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <path d="M160 36c-26-28-66-30-98-6-24 18-26 52 4 60 34 8 70-10 94-30 24 20 60 38 94 30 30-8 28-42 4-60-32-24-72-22-98 6Z" fill="url(#mst)" stroke="${M.ink}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M66 50c18-9 36-6 50 4" stroke="${M.hiSoft}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M254 50c-18-9-36-6-50 4" stroke="${M.hiSoft}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M112 72c28 8 68 8 96 0" stroke="url(#mshine)" stroke-width="7" stroke-linecap="round"/>
    <path d="M160 44c-6 6-10 12-10 18" stroke="${M.inkSoft}" stroke-width="3" stroke-linecap="round"/>`
  ),
};

const META = [
  { id: 'none', name: 'None' },
  { id: 'shades', name: 'Shades', cx: 50, top: 33, width: 34, faceWidth: 1.18, vbW: 420, vbH: 140 },
  { id: 'cat', name: 'Cat ears', cx: 50, top: 6, width: 36, faceWidth: 1.22, vbW: 420, vbH: 200 },
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
  { id: 'crown', name: 'Crown', cx: 50, top: 5, width: 28, faceWidth: 1.0, vbW: 340, vbH: 180 },
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
  { id: 'dog', name: 'Dog', cx: 50, top: 2, width: 44, faceWidth: 1.42, vbW: 480, vbH: 440 },
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
      w = clamp(eyeDist * 2.32, fw * 0.92, fw * 1.42);
      cx = eyeX;
      cy = eyeY + fh * 0.01;
      a = angle * 0.9;
      break;
    case 'cat':
      // Ears: sit on upper head/brow, follow tilt, span slightly wider than face.
      w = clamp(fw * 1.22, 0.18, 0.74);
      cx = faceCx + (eyeX - faceCx) * 0.18;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.16 + fh * 0.03;
      a = angle * 0.8;
      break;
    case 'bunny':
      // Ears: anchor at crown with gentle backward tilt and natural height.
      w = clamp(fw * 1.0, 0.16, 0.62);
      cx = faceCx;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.45 + fh * 0.015;
      a = angle * 0.65;
      break;
    case 'crown':
      w = clamp(fw * 1.02, 0.16, 0.64);
      cx = faceCx + (eyeX - faceCx) * 0.12;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.3 + fh * 0.015;
      a = angle * 0.75;
      break;
    case 'mustache':
      w = clamp(eyeDist * 1.34, fw * 0.46, fw * 0.94);
      cx = faceCx + (noseY - eyeY) * Math.sin(angle) * 0.04;
      cy = noseY + (mouthY - noseY) * 0.5;
      a = angle * 0.95;
      break;
    case 'dog': {
      // Width spans past cheeks; snout/nose anchor pinned near detected nose.
      w = clamp(fw * 1.46, 0.22, 0.9);
      cx = eyeX;
      const hNorm = w * (prop.vbH / prop.vbW) * (4 / 3);
      const noseAnchor = 258 / prop.vbH; // y in SVG where snout sits
      cy = noseY - (noseAnchor - 0.5) * hNorm + fh * 0.01;
      a = angle * 0.8;
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
