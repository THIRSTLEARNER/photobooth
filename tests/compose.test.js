import { describe, it, expect } from 'vitest';
import {
  SHOTS,
  FILTERS,
  FRAMES,
  LAYOUTS,
  mimeForFormat,
  extensionForFormat,
} from '../src/compose.js';

describe('compose constants', () => {
  it('exposes expected defaults', () => {
    expect(SHOTS).toBe(4);
    expect(FILTERS.length).toBeGreaterThan(0);
    expect(FRAMES.length).toBeGreaterThan(0);
    expect(LAYOUTS.map((l) => l.id)).toContain('strip');
    expect(LAYOUTS.map((l) => l.id)).toContain('grid');
    expect(LAYOUTS.map((l) => l.id)).toContain('wide');
  });
});

describe('compose output helpers', () => {
  it('maps formats to mime types and extensions', () => {
    expect(mimeForFormat('png')).toBe('image/png');
    expect(mimeForFormat('jpeg')).toBe('image/jpeg');
    expect(mimeForFormat('webp')).toBe('image/webp');
    expect(extensionForFormat('png')).toBe('png');
    expect(extensionForFormat('jpeg')).toBe('jpg');
    expect(extensionForFormat('webp')).toBe('webp');
  });
});
