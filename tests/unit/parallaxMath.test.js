import { describe, it, expect } from 'vitest';
import { calculateLayerOffset } from '../../src/utils/math.js';

describe('Multi-Layer Parallax Physics', () => {
  const multipliers = {
    plane0: -0.15,
    plane1: -0.30,
    plane2: 0.25,
    plane3: 0.55,
    plane4: 1.15,
  };

  it('calculates layer offsets with strictly ordered absolute velocities', () => {
    const scrollDelta = 500;
    const dy0 = Math.abs(calculateLayerOffset(scrollDelta, multipliers.plane0));
    const dy1 = Math.abs(calculateLayerOffset(scrollDelta, multipliers.plane1));
    const dy2 = Math.abs(calculateLayerOffset(scrollDelta, multipliers.plane2));
    const dy3 = Math.abs(calculateLayerOffset(scrollDelta, multipliers.plane3));
    const dy4 = Math.abs(calculateLayerOffset(scrollDelta, multipliers.plane4));

    expect(dy4).toBeGreaterThan(dy3);
    expect(dy3).toBeGreaterThan(dy1);
    expect(dy1).toBeGreaterThan(dy2);
    expect(dy2).toBeGreaterThan(dy0);
  });

  it('returns exactly 0 offset when prefersReducedMotion is enabled', () => {
    const scrollDelta = 500;
    Object.values(multipliers).forEach((multiplier) => {
      expect(calculateLayerOffset(scrollDelta, multiplier, true)).toBe(0);
    });
  });
});
