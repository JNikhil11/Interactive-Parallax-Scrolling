import { describe, it, expect } from 'vitest';
import { clamp, lerp, mapRange, hexToRgb, rgbToHex, interpolateColor } from '../../src/utils/math.js';

describe('Math & Interpolation Utilities', () => {
  it('clamps values correctly', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('interpolates linearly (lerp)', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('maps ranges accurately', () => {
    expect(mapRange(0, 100, 0, 1, 50)).toBe(0.5);
    expect(mapRange(0, 10, 100, 200, 5)).toBe(150);
  });

  it('converts hex to rgb and back', () => {
    expect(hexToRgb('#0A1128')).toEqual({ r: 10, g: 17, b: 40 });
    expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(rgbToHex(10, 17, 40)).toBe('#0a1128');
  });

  it('interpolates colors smoothly across Scene 1 to Scene 2', () => {
    const scene1Hex = '#0A1128';
    const scene2Hex = '#1A237E';

    expect(interpolateColor(scene1Hex, scene2Hex, 0).toLowerCase()).toBe(scene1Hex.toLowerCase());
    expect(interpolateColor(scene1Hex, scene2Hex, 1).toLowerCase()).toBe(scene2Hex.toLowerCase());

    const mid = interpolateColor(scene1Hex, scene2Hex, 0.5);
    const midRgb = hexToRgb(mid);
    expect(midRgb.r).toBe(Math.round((10 + 26) / 2));
    expect(midRgb.g).toBe(Math.round((17 + 35) / 2));
    expect(midRgb.b).toBe(Math.round((40 + 126) / 2));
  });

  it('clamps out-of-bounds progress during color interpolation', () => {
    const colorA = '#000000';
    const colorB = '#ffffff';
    expect(interpolateColor(colorA, colorB, -0.5)).toBe('#000000');
    expect(interpolateColor(colorA, colorB, 1.5)).toBe('#ffffff');
  });
});
