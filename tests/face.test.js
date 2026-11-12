import { describe, it, expect } from 'vitest';
import { toStageFace, smoothFace } from '../src/face.js';

describe('toStageFace', () => {
  it('maps a centered face in a matching-aspect source without change', () => {
    const face = {
      x: 0.25,
      y: 0.25,
      w: 0.5,
      h: 0.5,
      eyeX: 0.5,
      eyeY: 0.4,
      eyeDist: 0.2,
      noseY: 0.5,
      mouthY: 0.6,
      angle: 0,
    };
    const mapped = toStageFace(face, 800, 600, false);
    expect(mapped.x).toBeCloseTo(0.25, 5);
    expect(mapped.y).toBeCloseTo(0.25, 5);
    expect(mapped.w).toBeCloseTo(0.5, 5);
    expect(mapped.h).toBeCloseTo(0.5, 5);
    expect(mapped.eyeX).toBeCloseTo(0.5, 5);
  });

  it('mirrors x/eyeX and negates angle when mirrored', () => {
    const face = {
      x: 0.1,
      y: 0.2,
      w: 0.3,
      h: 0.4,
      eyeX: 0.2,
      eyeY: 0.3,
      eyeDist: 0.15,
      noseY: 0.35,
      mouthY: 0.45,
      angle: 0.2,
    };
    const mapped = toStageFace(face, 800, 600, true);
    expect(mapped.x).toBeCloseTo(1 - 0.1 - 0.3, 5);
    expect(mapped.eyeX).toBeCloseTo(1 - 0.2, 5);
    expect(mapped.angle).toBeCloseTo(-0.2, 5);
  });
});

describe('smoothFace', () => {
  it('returns next when there is no previous', () => {
    const next = {
      x: 0.2,
      y: 0.2,
      w: 0.3,
      h: 0.3,
      eyeY: 0.3,
      mouthY: 0.4,
      eyeX: 0.35,
      eyeDist: 0.1,
      noseY: 0.32,
      angle: 0,
    };
    expect(smoothFace(null, next)).toBe(next);
  });

  it('interpolates fields toward next', () => {
    const prev = {
      x: 0.45,
      y: 0.44,
      w: 0.3,
      h: 0.4,
      eyeX: 0.48,
      eyeY: 0.46,
      eyeDist: 0.12,
      noseY: 0.52,
      mouthY: 0.6,
      angle: 0,
    };
    const next = {
      x: 0.55,
      y: 0.56,
      w: 0.3,
      h: 0.4,
      eyeX: 0.52,
      eyeY: 0.54,
      eyeDist: 0.12,
      noseY: 0.58,
      mouthY: 0.66,
      angle: 0,
    };
    const out = smoothFace(prev, next, 0.5);
    expect(out.x).toBeCloseTo(0.5, 5);
    expect(out.y).toBeCloseTo(0.5, 5);
    expect(out.eyeX).toBeCloseTo(0.5, 5);
    expect(out.eyeDist).toBeCloseTo(0.12, 5);
  });
});
