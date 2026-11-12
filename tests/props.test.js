import { describe, it, expect } from 'vitest';
import { PROPS, dogProp, propRectOnFace, staticPropRect } from '../src/props.js';

const face = {
  x: 0.3,
  y: 0.2,
  w: 0.4,
  h: 0.5,
  eyeX: 0.5,
  eyeY: 0.35,
  eyeDist: 0.16,
  noseY: 0.42,
  mouthY: 0.5,
  angle: 0,
};

describe('props', () => {
  it('includes a none prop and image props', () => {
    expect(PROPS.some((p) => p.id === 'none')).toBe(true);
    expect(PROPS.some((p) => p.id === 'dog' && p.url)).toBe(true);
  });

  it('dogProp toggles tongue variant url', () => {
    const out = dogProp(true);
    const inMouth = dogProp(false);
    expect(out.id).toBe('dog');
    expect(inMouth.id).toBe('dog');
    expect(out.url).not.toEqual(inMouth.url);
  });

  it('staticPropRect returns null for none and rect for others', () => {
    const none = PROPS.find((p) => p.id === 'none');
    const shades = PROPS.find((p) => p.id === 'shades');
    expect(staticPropRect(none)).toBeNull();
    const r = staticPropRect(shades);
    expect(r).toBeTruthy();
    expect(r.w).toBeGreaterThan(0);
    expect(r.h).toBeGreaterThan(0);
  });

  it('propRectOnFace positions shades around eyes', () => {
    const shades = PROPS.find((p) => p.id === 'shades');
    const r = propRectOnFace(shades, face);
    expect(r).toBeTruthy();
    expect(r.w).toBeCloseTo(face.eyeDist * 2.3, 5);
    expect(r.x + r.w / 2).toBeCloseTo(face.eyeX, 5);
    expect(r.y + r.h / 2).toBeCloseTo(face.eyeY, 5);
  });
});
