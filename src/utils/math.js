/**
 * Mathematical utilities for interpolation, clamping, and color morphing
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function mapRange(inMin, inMax, outMin, outMax, val) {
  if (inMax === inMin) return outMin;
  const t = (val - inMin) / (inMax - inMin);
  return outMin + (outMax - outMin) * t;
}

export function hexToRgb(hex) {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = clamp(Math.round(n), 0, 255);
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(hexA, hexB, progress) {
  const p = clamp(progress, 0, 1);
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  const r = Math.round(lerp(rgbA.r, rgbB.r, p));
  const g = Math.round(lerp(rgbA.g, rgbB.g, p));
  const b = Math.round(lerp(rgbA.b, rgbB.b, p));
  return rgbToHex(r, g, b);
}

export function calculateLayerOffset(scrollDelta, speedMultiplier, prefersReducedMotion = false) {
  if (prefersReducedMotion) return 0;
  return -scrollDelta * speedMultiplier;
}
