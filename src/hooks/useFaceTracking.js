import { useEffect, useRef, useState } from 'react';
import { detectFace, loadFaceDetector, smoothFace, toStageFace } from '../face.js';
import { propRectOnFace, staticPropRect } from '../props.js';
import { DEFAULT_MIRRORED, FACE_STALE_FREEZE_MS, FACE_STALE_HIDE_MS } from '../config.js';
import { PERF_PROFILE } from '../perf.js';

export function useFaceTracking({
  videoRef,
  ready,
  prop,
  activeProp,
  mirrored = DEFAULT_MIRRORED,
  faceRef: externalFaceRef,
  detectorRef: externalDetectorRef,
}) {
  const propLayerRef = useRef(null);
  const internalFaceRef = useRef(null);
  const internalDetectorRef = useRef(null);
  const faceRef = externalFaceRef || internalFaceRef;
  const detectorRef = externalDetectorRef || internalDetectorRef;
  const [tracker, setTracker] = useState('idle'); // idle | loading | ready | error
  const [hasFace, setHasFace] = useState(false);

  const activePropRef = useRef(activeProp);
  activePropRef.current = activeProp;

  const propOn = prop.id !== 'none';

  useEffect(() => {
    if (!ready || !propOn) {
      faceRef.current = null;
      if (propLayerRef.current) propLayerRef.current.style.opacity = '0';
      return undefined;
    }

    let stopped = false;
    let rafId = 0;
    let lastRun = 0;
    let lastSeen = 0;

    if (!detectorRef.current) setTracker('loading');

    const _hide = () => {
      faceRef.current = null;
      setHasFace((seen) => (seen ? false : seen));
      if (propLayerRef.current) propLayerRef.current.style.opacity = '0';
    };
    void _hide;

    const runDetection = (detector) => {
      const v = videoRef.current;
      if (v && v.readyState >= 2) {
        try {
          const raw = detectFace(detector, v);
          if (raw) {
            const mapped = toStageFace(raw, v.videoWidth, v.videoHeight, mirrored);
            const previous = faceRef.current;
            const face = previous ? smoothFace(previous, mapped) : mapped;
            face.ts = performance.now();
            faceRef.current = face;
            lastSeen = face.ts;
            setHasFace((seen) => (seen ? seen : true));

            const el = propLayerRef.current;
            if (el) {
              const r = propRectOnFace(activePropRef.current, face);
              if (r) {
                el.style.left = `${(r.x + r.w / 2) * 100}%`;
                el.style.top = `${r.y * 100}%`;
                el.style.width = `${r.w * 100}%`;
                el.style.transform = `translateX(-50%) rotate(${r.angle || 0}rad)`;
                el.style.opacity = '1';
              }
            }
          } else if (performance.now() - lastSeen > FACE_STALE_HIDE_MS) {
            // No face in view for a while: fall back to a stable default placement.
            faceRef.current = null;
            setHasFace((seen) => (seen ? false : seen));
            const el = propLayerRef.current;
            const r = staticPropRect(activePropRef.current);
            if (el && r) {
              el.style.left = `${(r.x + r.w / 2) * 100}%`;
              el.style.top = `${r.y * 100}%`;
              el.style.width = `${r.w * 100}%`;
              el.style.transform = 'translateX(-50%)';
              el.style.opacity = '1';
            }
          } else if (performance.now() - lastSeen > FACE_STALE_FREEZE_MS) {
            // Brief loss: keep the last known placement visible.
            setHasFace((seen) => (seen ? false : seen));
          }
        } catch {
          // A dropped frame isn't fatal; try again on the next tick.
        }
      }
    };

    const tick = (detector, now) => {
      if (stopped) return;
      if (now - lastRun >= PERF_PROFILE.faceDetectIntervalMs) {
        lastRun = now;
        runDetection(detector);
      }
      rafId = window.requestAnimationFrame((t) => tick(detector, t));
    };

    (async () => {
      try {
        const detector = await loadFaceDetector();
        if (stopped) return;
        detectorRef.current = detector;
        setTracker('ready');
        rafId = window.requestAnimationFrame((t) => tick(detector, t));
      } catch {
        if (stopped) return;
        detectorRef.current = null;
        setTracker('error');
        setHasFace(false);

        // Keep the old centred placement usable if the tracker can't load.
        const el = propLayerRef.current;
        const r = staticPropRect(activePropRef.current);
        if (el && r) {
          el.style.left = `${(r.x + r.w / 2) * 100}%`;
          el.style.top = `${r.y * 100}%`;
          el.style.width = `${r.w * 100}%`;
          el.style.transform = 'translateX(-50%)';
          el.style.opacity = '1';
        }
      }
    })();

    const layer = propLayerRef.current;
    return () => {
      stopped = true;
      window.cancelAnimationFrame(rafId);
      faceRef.current = null;
      if (layer) layer.style.opacity = '0';
    };
    // faceRef/detectorRef are stable refs passed in or created once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, propOn, videoRef, mirrored]);

  const trackingLoading = propOn && (tracker === 'idle' || tracker === 'loading');
  const trackingNote = !propOn
    ? ''
    : tracker === 'error'
      ? 'The face filter couldn’t load, so props stay centred. Refresh to try again.'
      : trackingLoading
        ? 'Loading the face filter…'
        : hasFace
          ? 'Props are locked to your face — move around and they’ll follow.'
          : 'Face filter on — show your face to place the sticker.';

  return {
    propLayerRef,
    faceRef,
    detectorRef,
    tracker,
    hasFace,
    trackingLoading,
    trackingNote,
  };
}
