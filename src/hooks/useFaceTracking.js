import { useEffect, useRef, useState } from 'react';
import { detectFace, loadFaceDetector, smoothFace, toStageFace } from '../face.js';
import { propRectOnFace } from '../props.js';
import { DEFAULT_MIRRORED } from '../config.js';
import { PERF_PROFILE } from '../perf.js';

// Grace period before hiding after the face is lost, to avoid flicker on brief misses.
const NO_FACE_GRACE_MS = 420;

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
      setHasFace(false);
      if (propLayerRef.current) propLayerRef.current.style.opacity = '0';
      return undefined;
    }

    let stopped = false;
    let rafId = 0;
    let lastRun = 0;
    let lastSeen = 0;

    if (!detectorRef.current) setTracker('loading');

    const hideLayer = () => {
      faceRef.current = null;
      setHasFace(false);
      if (propLayerRef.current) propLayerRef.current.style.opacity = '0';
    };

    const applyRect = (rect) => {
      const el = propLayerRef.current;
      if (!el || !rect) return;
      el.style.left = `${(rect.x + rect.w / 2) * 100}%`;
      el.style.top = `${rect.y * 100}%`;
      el.style.width = `${rect.w * 100}%`;
      el.style.transform = `translateX(-50%) rotate(${rect.angle || 0}rad)`;
      el.style.opacity = '1';
    };

    const runDetection = (detector) => {
      const v = videoRef.current;
      if (v && v.readyState >= 2) {
        try {
          const raw = detectFace(detector, v);
          const now = performance.now();
          if (raw) {
            const mapped = toStageFace(raw, v.videoWidth, v.videoHeight, mirrored);
            const previous = faceRef.current;
            const face = previous ? smoothFace(previous, mapped) : mapped;
            face.ts = now;
            faceRef.current = face;
            lastSeen = now;
            setHasFace(true);

            const r = propRectOnFace(activePropRef.current, face);
            if (r) applyRect(r);
          } else if (lastSeen && now - lastSeen <= NO_FACE_GRACE_MS) {
            // Brief miss: keep last known placement for stability, but mark face as not detected.
            setHasFace(false);
          } else {
            // No face detected (or grace expired): hide the prop instead of showing a static fallback.
            hideLayer();
          }
        } catch {
          // A dropped frame isn't fatal; try again on the next tick.
          const now = performance.now();
          if (lastSeen && now - lastSeen <= NO_FACE_GRACE_MS) {
            setHasFace(false);
          } else if (!lastSeen || now - lastSeen > NO_FACE_GRACE_MS) {
            hideLayer();
          }
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
        faceRef.current = null;
        if (propLayerRef.current) propLayerRef.current.style.opacity = '0';
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
      ? 'Face tracking is unavailable, so props stay hidden. Refresh to try again.'
      : trackingLoading
        ? 'Loading face tracking…'
        : hasFace
          ? 'Prop locked to your face — move around and it will follow.'
          : 'Show your face to place the prop. It disappears when no face is detected.';

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
