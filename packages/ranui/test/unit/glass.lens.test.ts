import { bendAt, lensMap } from '@/components/glass/lens';

describe('glass lens profile', () => {
  it('keeps the face soft and concentrates bend on the rim', () => {
    expect(bendAt(0)).toBe(0);
    expect(bendAt(1)).toBe(1);
    // Inner bevel stays calmer than a plain u² curve.
    expect(bendAt(0.25)).toBeLessThan(0.25 ** 2);
    // Near the lip the cube-after-smoothstep still climbs hard.
    expect(bendAt(0.92)).toBeGreaterThan(0.7);
  });

  it('writes inward displacement on RG and a rim specular mask on B', () => {
    const map = lensMap(32, 32, 8, 8);
    const center = ((16 * 32 + 16) * 4) >>> 0;
    const edge = ((0 * 32 + 16) * 4) >>> 0;
    expect(map[center]).toBe(128);
    expect(map[center + 1]).toBe(128);
    expect(map[center + 2]).toBe(128);
    // Top-edge pixel pulls downward (G > 128) and lights the specular channel.
    expect(map[edge + 1]).toBeGreaterThan(200);
    expect(map[edge + 2]).toBeGreaterThan(200);
  });
});
