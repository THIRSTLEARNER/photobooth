// Face tracking for the photo props. Everything runs locally in the browser:
// the MediaPipe WASM runtime and the BlazeFace model are served from /public.
//
// The detector works on the raw camera frame. The preview and the captured
// photos are mirrored, so `toStageFace` flips the coordinates before the prop
// is positioned.

let detectorPromise = null;

export function loadFaceDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks('/mediapipe');
      const baseOptions = {
        modelAssetPath: '/models/blaze_face_short_range.tflite',
      };
      let detector;
      try {
        detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: { ...baseOptions, delegate: 'GPU' },
          runningMode: 'VIDEO',
          minDetectionConfidence: 0.5,
        });
      } catch {
        detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: { ...baseOptions, delegate: 'CPU' },
          runningMode: 'VIDEO',
          minDetectionConfidence: 0.5,
        });
      }
      return detector;
    })().catch((error) => {
      // Let a later attempt retry if loading failed (offline, bad asset, …).
      detectorPromise = null;
      throw error;
    });
  }
  return detectorPromise;
}

// Returns the largest face as normalized source-frame coordinates plus the
// eye/mouth anchors used by the prop layouts.
// BlazeFace (short-range) keypoints: 0 right eye, 1 left eye, 2 nose tip,
// 3 mouth center, 4 right ear tragion, 5 left ear tragion.
export function detectFace(detector, video) {
  if (!detector || !video || video.readyState < 2 || !video.videoWidth) return null;
  const result = detector.detectForVideo(video, performance.now());
  const faces = result?.detections ?? [];
  if (!faces.length) return null;

  const area = (d) => (d.boundingBox?.width ?? 0) * (d.boundingBox?.height ?? 0);
  const face = faces.reduce((best, next) => (area(next) > area(best) ? next : best));
  const box = face.boundingBox;
  if (!box || box.width <= 0 || box.height <= 0) return null;

  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const kps = face.keypoints || [];

  // Prefer labeled keypoints, then BlazeFace index order, then box estimates.
  const byLabel = (re) => kps.find((k) => re.test(k.label || ''));
  const byIndex = (i) => kps[i];

  const rightEye = byLabel(/right.?eye/i) || byIndex(0);
  const leftEye = byLabel(/left.?eye/i) || byIndex(1);
  const nose = byLabel(/nose/i) || byIndex(2);
  const mouth = byLabel(/mouth/i) || byIndex(3);
  const _rightEar = byLabel(/right.?ear/i) || byIndex(4);
  const _leftEar = byLabel(/left.?ear/i) || byIndex(5);
  void _rightEar;
  void _leftEar;

  const boxEyeY = (box.originY + box.height * 0.4) / vh;
  const boxMouthY = (box.originY + box.height * 0.74) / vh;

  const eyeY =
    rightEye && leftEye ? (rightEye.y + leftEye.y) / 2 : (rightEye?.y ?? leftEye?.y ?? boxEyeY);
  const eyeX =
    rightEye && leftEye ? (rightEye.x + leftEye.x) / 2 : (box.originX + box.width / 2) / vw;
  const eyeDist = rightEye && leftEye ? Math.abs(rightEye.x - leftEye.x) : (box.width / vw) * 0.42;
  const mouthY = mouth?.y ?? boxMouthY;
  const noseY = nose?.y ?? (eyeY + mouthY) / 2;

  // Tilt from the eye line (positive when right eye is lower in image coords).
  const angle =
    rightEye && leftEye ? Math.atan2(leftEye.y - rightEye.y, leftEye.x - rightEye.x) : 0;

  return {
    x: box.originX / vw,
    y: box.originY / vh,
    w: box.width / vw,
    h: box.height / vh,
    eyeX,
    eyeY,
    eyeDist,
    noseY,
    mouthY,
    angle,
    ts: performance.now(),
  };
}

// Maps a face box from the camera frame into the 4:3 stage (object-fit: cover)
// and mirrors it to match the selfie preview.
export function toStageFace(face, videoWidth, videoHeight, mirrored = true) {
  const stageAR = 4 / 3;
  const sourceAR = videoWidth / videoHeight;
  let sx = 0;
  let sy = 0;
  let sw = videoWidth;
  let sh = videoHeight;

  if (sourceAR > stageAR) {
    sw = videoHeight * stageAR;
    sx = (videoWidth - sw) / 2;
  } else if (sourceAR < stageAR) {
    sh = videoWidth / stageAR;
    sy = (videoHeight - sh) / 2;
  }

  const mapX = (nx) => (nx * videoWidth - sx) / sw;
  const mapY = (ny) => (ny * videoHeight - sy) / sh;

  let x = mapX(face.x);
  const w = (face.w * videoWidth) / sw;
  const y = mapY(face.y);
  const h = (face.h * videoHeight) / sh;
  const eyeDist = (face.eyeDist * videoWidth) / sw;
  let eyeX = mapX(face.eyeX);
  let angle = face.angle || 0;

  if (mirrored) {
    x = 1 - x - w;
    eyeX = 1 - eyeX;
    angle = -angle;
  }

  return {
    x,
    y,
    w,
    h,
    eyeX,
    eyeY: mapY(face.eyeY),
    eyeDist,
    noseY: mapY(face.noseY),
    mouthY: mapY(face.mouthY),
    angle,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Light smoothing keeps the sticker from jittering between detections while
// damping sudden jumps (brief landmark glitches or fast movement).
export function smoothFace(previous, next, amount = 0.45) {
  if (!previous) return next;
  const dx = (next.x ?? 0) - (previous.x ?? 0);
  const dy = (next.y ?? 0) - (previous.y ?? 0);
  const jump = Math.hypot(dx, dy);
  const sizeDelta =
    Math.abs((next.w ?? 0) - (previous.w ?? 0)) + Math.abs((next.h ?? 0) - (previous.h ?? 0));
  let a = amount;
  if (jump > 0.24 || sizeDelta > 0.3) a = Math.min(a, 0.18);
  else if (jump > 0.16 || sizeDelta > 0.18) a = Math.min(a, 0.32);

  const mix = (p, n) => p + (n - p) * a;

  // Keep angle continuous across the ±pi boundary and clamp extreme snaps.
  let da = (next.angle || 0) - (previous.angle || 0);
  if (da > Math.PI) da -= Math.PI * 2;
  if (da < -Math.PI) da += Math.PI * 2;
  da = clamp(da, -0.6, 0.6);

  const eyeDistPrev = previous.eyeDist ?? next.eyeDist ?? 0.2;
  const eyeDistNext = clamp(next.eyeDist ?? eyeDistPrev, eyeDistPrev * 0.7, eyeDistPrev * 1.3);

  return {
    x: mix(previous.x, next.x),
    y: mix(previous.y, next.y),
    w: mix(previous.w, next.w),
    h: mix(previous.h, next.h),
    eyeX: mix(previous.eyeX ?? next.eyeX, next.eyeX ?? previous.eyeX),
    eyeY: mix(previous.eyeY, next.eyeY),
    eyeDist: mix(eyeDistPrev, eyeDistNext),
    noseY: mix(previous.noseY ?? next.noseY, next.noseY ?? previous.noseY),
    mouthY: mix(previous.mouthY, next.mouthY),
    angle: (previous.angle || 0) + da * a,
  };
}
