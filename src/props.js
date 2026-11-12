// Vector face props. They render in the live preview and are drawn onto each
// captured photo so they end up in the composed strip.

const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;

const toUrl = (markup) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

// The dog artwork is parameterized so tapping the stuck filter can toggle
// the tongue, like the reference look. `tongueOut` picks the variant.
const dogArt = (tongueOut) =>
  svg(
    '0 0 480 470',
    `<defs>
    <linearGradient id="dogFur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b98356"/>
      <stop offset=".55" stop-color="#8f5a33"/>
      <stop offset="1" stop-color="#69401f"/>
    </linearGradient>
    <linearGradient id="dogInner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7d4e2c"/>
      <stop offset="1" stop-color="#4e2e17"/>
    </linearGradient>
    <radialGradient id="dogNose" cx=".38" cy=".3" r=".9">
      <stop offset="0" stop-color="#4c4c58"/>
      <stop offset=".45" stop-color="#24242d"/>
      <stop offset="1" stop-color="#101017"/>
    </radialGradient>
    <linearGradient id="dogTongue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff9eb0"/>
      <stop offset=".6" stop-color="#f2708a"/>
      <stop offset="1" stop-color="#d94f6f"/>
    </linearGradient>
  </defs>

  <path d="M214 30C158 22 100 62 72 146c-14 42-10 78 12 90 22 12 45-8 57-46 13-50 25-96 87-122Z" fill="url(#dogFur)" stroke="#4e2e17" stroke-width="6" stroke-linejoin="round"/>
  <path d="M266 30c56-8 114 32 142 116 14 42 10 78-12 90-22 12-45-8-57-46-13-50-25-96-87-122Z" fill="url(#dogFur)" stroke="#4e2e17" stroke-width="6" stroke-linejoin="round"/>
  <path d="M198 64c-42 8-74 38-92 100-6 22-2 36 9 36 15 0 27-18 35-50 10-42 24-68 72-86Z" fill="url(#dogInner)" opacity=".85"/>
  <path d="M282 64c42 8 74 38 92 100 6 22 2 36-9 36-15 0-27-18-35-50-10-42-24-68-72-86Z" fill="url(#dogInner)" opacity=".85"/>

  ${
    tongueOut
      ? `
  <path d="M210 330h60v96a30 30 0 0 1-60 0Z" fill="url(#dogTongue)" stroke="#b8445f" stroke-width="5" stroke-linejoin="round"/>
  <path d="M240 348v62" stroke="#c2526f" stroke-width="5" stroke-linecap="round" opacity=".8"/>
  `
      : ''
  }

  <path d="M240 232c-43 0-66 20-66 47 0 24 21 38 40 38 11 0 16-5 26-5s15 5 26 5c19 0 40-14 40-38 0-27-23-47-66-47Z" fill="url(#dogNose)" stroke="#08080d" stroke-width="5" stroke-linejoin="round"/>
  <ellipse cx="217" cy="272" rx="10" ry="13" fill="#050509" transform="rotate(14 217 272)"/>
  <ellipse cx="263" cy="272" rx="10" ry="13" fill="#050509" transform="rotate(-14 263 272)"/>
  <path d="M214 244c8-5 18-7 24-7" stroke="rgba(255,255,255,.38)" stroke-width="6" stroke-linecap="round" fill="none"/>
  ${tongueOut ? `<path d="M240 314v26" stroke="#17171e" stroke-width="6" stroke-linecap="round"/>` : ''}`
  );

const ART = {
  dog: dogArt(true),
  shades: svg(
    '0 0 400 140',
    `<defs>
      <linearGradient id="lens" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a4160"/>
        <stop offset=".55" stop-color="#0b0e1c"/>
        <stop offset="1" stop-color="#2a3049"/>
      </linearGradient>
    </defs>
    <path d="M22 34 4 26" stroke="#0d0f1a" stroke-width="10" stroke-linecap="round"/>
    <path d="M378 34 396 26" stroke="#0d0f1a" stroke-width="10" stroke-linecap="round"/>
    <rect x="20" y="16" width="156" height="104" rx="40" fill="url(#lens)" stroke="#0d0f1a" stroke-width="9"/>
    <rect x="224" y="16" width="156" height="104" rx="40" fill="url(#lens)" stroke="#0d0f1a" stroke-width="9"/>
    <path d="M176 48c14-12 34-12 48 0" fill="none" stroke="#0d0f1a" stroke-width="9" stroke-linecap="round"/>
    <path d="M48 36c22-12 44-12 62 0" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="7" stroke-linecap="round"/>
    <path d="M252 36c22-12 44-12 62 0" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="7" stroke-linecap="round"/>`
  ),
  cat: svg(
    '0 0 400 180',
    `<defs>
      <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a3f5c"/>
        <stop offset="1" stop-color="#12141f"/>
      </linearGradient>
      <linearGradient id="pink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffb3d1"/>
        <stop offset="1" stop-color="#ff6ea9"/>
      </linearGradient>
    </defs>
    <path d="M42 168 54 30c2-14 16-20 28-12l78 52c-30 36-70 68-118 98Z" fill="url(#fur)" stroke="#0d0f1a" stroke-width="7" stroke-linejoin="round"/>
    <path d="M358 168 346 30c-2-14-16-20-28-12l-78 52c30 36 70 68 118 98Z" fill="url(#fur)" stroke="#0d0f1a" stroke-width="7" stroke-linejoin="round"/>
    <path d="M76 138 84 58l48 34c-16 18-34 34-56 46Z" fill="url(#pink)" opacity=".9"/>
    <path d="M324 138 316 58l-48 34c16 18 34 34 56 46Z" fill="url(#pink)" opacity=".9"/>`
  ),
  bunny: svg(
    '0 0 300 300',
    `<defs>
      <linearGradient id="bun" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="1" stop-color="#d9dcf0"/>
      </linearGradient>
      <linearGradient id="bin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffc4dc"/>
        <stop offset="1" stop-color="#ff86b6"/>
      </linearGradient>
    </defs>
    <path d="M84 292c-26-64-34-162-8-226 12-30 56-30 68 0 26 64 18 162-8 226Z" fill="url(#bun)" stroke="#c9cde2" stroke-width="7"/>
    <path d="M216 292c26-64 34-162 8-226-12-30-56-30-68 0-26 64-18 162 8 226Z" fill="url(#bun)" stroke="#c9cde2" stroke-width="7"/>
    <path d="M104 258c-14-54-18-126-2-176 32 8 42 84 30 176Z" fill="url(#bin)" opacity=".85"/>
    <path d="M196 258c14-54 18-126 2-176-32 8-42 84-30 176Z" fill="url(#bin)" opacity=".85"/>`
  ),
  crown: svg(
    '0 0 320 180',
    `<defs>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffeaa3"/>
        <stop offset=".5" stop-color="#ffc24d"/>
        <stop offset="1" stop-color="#e08a12"/>
      </linearGradient>
    </defs>
    <path d="M28 148 16 46l76 52L160 28l68 70 76-52-12 102Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="8" stroke-linejoin="round"/>
    <rect x="28" y="148" width="264" height="26" rx="13" fill="url(#gold)" stroke="#8a5a12" stroke-width="8"/>
    <circle cx="160" cy="126" r="12" fill="#ff5fa2" stroke="#8a5a12" stroke-width="4"/>
    <circle cx="92" cy="136" r="9" fill="#2ee6d6" stroke="#8a5a12" stroke-width="4"/>
    <circle cx="228" cy="136" r="9" fill="#7c5cff" stroke="#8a5a12" stroke-width="4"/>`
  ),
  mustache: svg(
    '0 0 300 100',
    `<path d="M150 34c-26-28-66-30-98-6-24 18-28 54 2 62 34 9 74-10 96-28 22 18 62 37 96 28 30-8 26-44 2-62-32-24-72-22-98 6Z" fill="#1a1c2b" stroke="#080a12" stroke-width="6" stroke-linejoin="round"/>
    <path d="M58 48c18-8 36-4 50 6" stroke="rgba(255,255,255,.18)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M242 48c-18-8-36-4-50 6" stroke="rgba(255,255,255,.18)" stroke-width="6" stroke-linecap="round" fill="none"/>`
  ),
};

const META = [
  { id: 'none', name: 'None' },
  // `cx/top/width` are the old centre-of-frame fallback used when the face
  // tracker can't load. `faceWidth` scales each prop against the detected face.
  { id: 'shades', name: 'Shades', cx: 50, top: 33, width: 34, faceWidth: 1.16, vbW: 400, vbH: 140 },
  { id: 'cat', name: 'Cat ears', cx: 50, top: 7, width: 34, faceWidth: 1.2, vbW: 400, vbH: 180 },
  {
    id: 'bunny',
    name: 'Bunny ears',
    cx: 50,
    top: 0,
    width: 26,
    faceWidth: 0.94,
    vbW: 300,
    vbH: 300,
  },
  { id: 'crown', name: 'Crown', cx: 50, top: 6, width: 27, faceWidth: 0.98, vbW: 320, vbH: 180 },
  {
    id: 'mustache',
    name: 'Mustache',
    cx: 50,
    top: 52,
    width: 20,
    faceWidth: 0.72,
    vbW: 300,
    vbH: 100,
  },
  { id: 'dog', name: 'Dog', cx: 50, top: 2, width: 44, faceWidth: 1.45, vbW: 480, vbH: 470 },
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

  const eyeDist = face.eyeDist || face.w * 0.42;
  const eyeX = face.eyeX ?? face.x + face.w / 2;
  const faceCx = face.x + face.w / 2;
  let w;
  let cx;
  let cy;
  let angle = face.angle || 0;

  switch (prop.id) {
    case 'shades':
      // Glasses: centred on the eyes and sized from the eye-to-eye distance.
      w = eyeDist * 2.3;
      cx = eyeX;
      cy = face.eyeY;
      break;
    case 'cat':
      w = face.w * 1.15;
      cx = faceCx;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.22;
      break;
    case 'bunny':
      w = face.w * 0.98;
      cx = faceCx;
      // Sit the ear bases on the top of the head rather than floating above it.
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.44;
      break;
    case 'crown':
      w = face.w * 0.98;
      cx = faceCx;
      cy = face.y - w * (prop.vbH / prop.vbW) * 0.34;
      break;
    case 'mustache':
      w = eyeDist * 1.3;
      cx = faceCx;
      // Rest on the philtrum, between nose and mouth.
      cy = face.noseY + (face.mouthY - face.noseY) * 0.55;
      break;
    case 'dog': {
      // Floppy ears + nose + tongue. Width spans past the cheeks; the
      // artwork's nose anchor (y = 276 of 470) is pinned to the detected nose.
      w = face.w * 1.45;
      cx = face.eyeX ?? faceCx;
      const hLocal = w * (prop.vbH / prop.vbW) * (4 / 3);
      cy = face.noseY - (276 / prop.vbH - 0.5) * hLocal;
      break;
    }
    default:
      w = prop.faceWidth * face.w;
      cx = faceCx;
      cy = face.y + face.h / 2;
      angle = 0;
  }

  // `h` is expressed as a fraction of the stage height (width fraction × 4/3),
  // matching the normalized y axis and staticPropRect.
  const h = w * (prop.vbH / prop.vbW) * (4 / 3);
  return { x: cx - w / 2, y: cy - h / 2, w, h, angle };
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
