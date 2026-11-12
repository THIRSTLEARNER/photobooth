import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FILTERS,
  FRAMES,
  LAYOUTS,
  composeStripCanvas,
  canvasToBlob,
  canvasToDataUrl,
  extensionForFormat,
  mimeForFormat,
} from '../compose.js';
import { detectFace, toStageFace } from '../face.js';
import { PROPS, dogProp, loadPropImage, propRectOnFace } from '../props.js';
import {
  DEFAULT_COUNTDOWN_SECONDS,
  DEFAULT_MIRRORED,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_OUTPUT_QUALITY,
  DEFAULT_SHOT_COUNT,
  FACE_RECENT_FOR_CAPTURE_MS,
} from '../config.js';
import { PERF_PROFILE } from '../perf.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function useCaptureSession({
  videoRef,
  faceRef,
  detectorRef,
  mirrored = DEFAULT_MIRRORED,
  setStatus,
}) {
  const cancelled = useRef(false);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [prop, setProp] = useState(PROPS[0]);
  const [frame, setFrame] = useState(FRAMES[0]);
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [shotCount, setShotCount] = useState(DEFAULT_SHOT_COUNT);
  const [countdownSeconds, setCountdownSeconds] = useState(DEFAULT_COUNTDOWN_SECONDS);
  const [outputFormat, setOutputFormat] = useState(DEFAULT_OUTPUT_FORMAT);
  const [outputQuality, setOutputQuality] = useState(DEFAULT_OUTPUT_QUALITY);
  const [phase, setPhase] = useState('idle'); // idle | shooting | done
  const [count, setCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [flash, setFlash] = useState(0);
  const [shots, setShots] = useState([]); // (string|null)[]
  const [strip, setStrip] = useState('');
  const [dogTongue, setDogTongue] = useState(true);

  const activeProp = useMemo(
    () => (prop.id === 'dog' ? dogProp(dogTongue) : prop),
    [prop, dogTongue]
  );
  const toggleDogTongue = useCallback(() => setDogTongue((out) => !out), []);

  const activePropRef = useRef(activeProp);
  const filterRef = useRef(filter);
  activePropRef.current = activeProp;
  filterRef.current = filter;

  useEffect(() => {
    PROPS.forEach((p) => {
      loadPropImage(p).catch(() => {});
    });
    loadPropImage(dogProp(false)).catch(() => {});
  }, []);

  const filledShots = useMemo(() => shots.filter(Boolean), [shots]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (filledShots.length === shotCount && shotCount > 0) {
        try {
          const canvas = await composeStripCanvas(filledShots, frame, layout.id);
          if (!alive) return;
          const dataUrl = await canvasToDataUrl(canvas, outputFormat, outputQuality);
          if (!alive) return;
          setStrip(dataUrl);
          if (phase !== 'done') setPhase('done');
        } catch {
          if (alive) setStatus?.('Failed to compose the strip.');
        }
      } else {
        setStrip('');
        if (phase === 'done') setPhase('idle');
      }
    })();
    return () => {
      alive = false;
    };
  }, [filledShots, shotCount, frame, layout, outputFormat, outputQuality, phase, setStatus]);

  const grab = async () => {
    const v = videoRef.current;
    if (!v) throw new Error('no video');
    const c = document.createElement('canvas');
    c.width = PERF_PROFILE.captureWidth;
    c.height = PERF_PROFILE.captureHeight;
    const ctx = c.getContext('2d');
    const sw = Math.min(v.videoWidth, (v.videoHeight * 4) / 3);
    const sh = (sw * 3) / 4;
    ctx.filter = filterRef.current.css;
    if (mirrored) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      v,
      (v.videoWidth - sw) / 2,
      (v.videoHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      c.width,
      c.height
    );

    const now = performance.now();
    let face =
      faceRef.current && now - (faceRef.current.ts || 0) < FACE_RECENT_FOR_CAPTURE_MS
        ? faceRef.current
        : null;
    if (detectorRef.current && v.readyState >= 2) {
      try {
        const raw = detectFace(detectorRef.current, v);
        if (raw) face = toStageFace(raw, v.videoWidth, v.videoHeight, mirrored);
      } catch {
        // Use the most recent live position if this frame can't be read.
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';
    const bakedProp = activePropRef.current;
    if (bakedProp?.url && face) {
      const rect = propRectOnFace(bakedProp, face);
      if (rect) {
        try {
          const img = await loadPropImage(bakedProp);
          const dx = rect.x * c.width;
          const dy = rect.y * c.height;
          const dw = rect.w * c.width;
          const dh = rect.h * c.height;
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 14;
          ctx.shadowOffsetY = 6;
          if (rect.angle) {
            ctx.translate(dx + dw / 2, dy + dh / 2);
            ctx.rotate(rect.angle);
            ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
          } else {
            ctx.drawImage(img, dx, dy, dw, dh);
          }
          ctx.restore();
        } catch {
          // A prop that fails to load shouldn't break the photo.
        }
      }
    }
    return c.toDataURL('image/png');
  };

  const captureSlot = async (index) => {
    if (countdownSeconds > 0) {
      for (let n = countdownSeconds; n >= 1; n--) {
        setCount(n);
        await sleep(1000);
        if (cancelled.current) return false;
      }
    }
    setCount(0);
    setFlash((f) => f + 1);
    const photo = await grab();
    if (cancelled.current) return false;
    setShots((prev) => {
      const next = [...prev];
      next[index] = photo;
      return next;
    });
    await sleep(500);
    return true;
  };

  const run = async () => {
    cancelled.current = false;
    const next = Array.from({ length: shotCount }, () => null);
    setShots(next);
    setStrip('');
    setStatus?.('');
    setPhase('shooting');
    for (let i = 0; i < shotCount; i++) {
      if (cancelled.current) break;
      setActiveIndex(i);
      const ok = await captureSlot(i);
      if (!ok || cancelled.current) break;
    }
    setActiveIndex(-1);
    setCount(0);
    if (!cancelled.current) {
      setPhase('done');
    } else {
      setPhase('idle');
    }
  };

  const retakeAll = () => {
    cancelled.current = true;
    setActiveIndex(-1);
    setCount(0);
    setPhase('idle');
    setShots([]);
    setStrip('');
    setStatus?.('');
  };

  const retakeShot = async (index) => {
    if (phase === 'shooting') return;
    if (index < 0 || index >= shotCount) return;
    cancelled.current = false;
    setStrip('');
    setStatus?.('');
    setPhase('shooting');
    setActiveIndex(index);
    const ok = await captureSlot(index);
    setActiveIndex(-1);
    setCount(0);
    if (ok && !cancelled.current) {
      setPhase('done');
    } else {
      setPhase('idle');
    }
  };

  const cancel = () => {
    cancelled.current = true;
    setActiveIndex(-1);
    setCount(0);
    setPhase('idle');
  };

  const download = async () => {
    if (!filledShots.length) return;
    try {
      const canvas = await composeStripCanvas(filledShots, frame, layout.id);
      const blob = await canvasToBlob(canvas, outputFormat, outputQuality);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapbooth-strip.${extensionForFormat(outputFormat)}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setStatus?.('Failed to download the strip.');
    }
  };

  const share = async () => {
    if (!filledShots.length) return false;
    try {
      const canvas = await composeStripCanvas(filledShots, frame, layout.id);
      const blob = await canvasToBlob(canvas, outputFormat, outputQuality);
      if (!blob) return false;
      const file = new File([blob], `snapbooth-strip.${extensionForFormat(outputFormat)}`, {
        type: mimeForFormat(outputFormat),
      });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: 'Snapbooth strip' });
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  };

  const getStripDataUrl = async () => {
    if (!filledShots.length) return '';
    const canvas = await composeStripCanvas(filledShots, frame, layout.id);
    return canvasToDataUrl(canvas, outputFormat, outputQuality);
  };

  return {
    filter,
    setFilter,
    prop,
    setProp,
    frame,
    setFrame,
    layout,
    setLayout,
    shotCount,
    setShotCount,
    countdownSeconds,
    setCountdownSeconds,
    outputFormat,
    setOutputFormat,
    outputQuality,
    setOutputQuality,
    phase,
    count,
    activeIndex,
    flash,
    shots,
    filledShots,
    strip,
    setStrip,
    dogTongue,
    activeProp,
    toggleDogTongue,
    run,
    retake: retakeAll,
    retakeShot,
    cancel,
    download,
    share,
    getStripDataUrl,
    cancelledRef: cancelled,
  };
}
