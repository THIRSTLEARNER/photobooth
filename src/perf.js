function safeMatch(query) {
  try {
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false;
  } catch {
    return false;
  }
}

function getConnection() {
  if (typeof navigator === 'undefined') return null;
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

export function getPerformanceProfile() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      tier: 'balanced',
      lowEnd: false,
      highEnd: false,
      reduceEffects: false,
      captureWidth: 800,
      captureHeight: 600,
      cameraWidth: 1280,
      cameraHeight: 960,
      faceDetectIntervalMs: 90,
      outputQuality: 0.92,
    };
  }

  const reducedMotion = safeMatch('(prefers-reduced-motion: reduce)');
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // GB, Chromium-only; fallback to mid
  const dpr = window.devicePixelRatio || 1;
  const smallViewport = Math.min(window.innerWidth || 0, window.innerHeight || 0) <= 768;
  const conn = getConnection();
  const saveData = !!conn?.saveData;
  const effectiveType = String(conn?.effectiveType || '');
  const slowNetwork = /(^|-)2g/.test(effectiveType) || effectiveType === '3g';

  let lowEnd =
    reducedMotion ||
    saveData ||
    slowNetwork ||
    cores <= 4 ||
    memory <= 4 ||
    (smallViewport && cores <= 6) ||
    (dpr > 2.5 && cores <= 6);

  // Very constrained devices
  const veryLow =
    saveData ||
    slowNetwork ||
    cores <= 2 ||
    memory <= 2 ||
    (smallViewport && (cores <= 4 || memory <= 4));

  // High-end when clearly capable and not asking to save data/reduce
  const highEnd = !lowEnd && !saveData && !slowNetwork && cores >= 8 && memory >= 8 && dpr <= 2;

  if (veryLow) lowEnd = true;

  if (highEnd) {
    return {
      tier: 'high',
      lowEnd: false,
      highEnd: true,
      reduceEffects: false,
      captureWidth: 960,
      captureHeight: 720,
      cameraWidth: 1280,
      cameraHeight: 960,
      faceDetectIntervalMs: 80,
      outputQuality: 0.92,
    };
  }

  if (lowEnd) {
    return {
      tier: 'low',
      lowEnd: true,
      highEnd: false,
      reduceEffects: true,
      captureWidth: veryLow ? 480 : 640,
      captureHeight: veryLow ? 360 : 480,
      cameraWidth: veryLow ? 640 : 960,
      cameraHeight: veryLow ? 480 : 720,
      faceDetectIntervalMs: veryLow ? 180 : 140,
      outputQuality: 0.84,
    };
  }

  return {
    tier: 'balanced',
    lowEnd: false,
    highEnd: false,
    reduceEffects: false,
    captureWidth: 800,
    captureHeight: 600,
    cameraWidth: 1280,
    cameraHeight: 960,
    faceDetectIntervalMs: 90,
    outputQuality: 0.92,
  };
}

export const PERF_PROFILE = getPerformanceProfile();

export function applyPerformanceHints() {
  if (typeof document === 'undefined') return PERF_PROFILE;
  const root = document.documentElement;
  root.dataset.perf = PERF_PROFILE.tier;
  if (PERF_PROFILE.reduceEffects) root.dataset.reduceEffects = 'true';
  else delete root.dataset.reduceEffects;
  return PERF_PROFILE;
}
