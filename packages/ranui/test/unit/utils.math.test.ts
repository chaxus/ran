import { describe, expect, it, vi } from 'vitest';
import {
  fanShapedByArc,
  getAngle,
  getArcPointerByDeg,
  getLinearGradient,
  getTangentByPointer,
  roundRectByArc,
} from '@/utils/math';

function createContextMock(): CanvasRenderingContext2D & {
  gradient: { addColorStop: ReturnType<typeof vi.fn> };
} {
  const gradient = { addColorStop: vi.fn() };
  return {
    beginPath: vi.fn(),
    arc: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
    gradient,
  } as unknown as CanvasRenderingContext2D & { gradient: { addColorStop: ReturnType<typeof vi.fn> } };
}

describe('utils/math', () => {
  it('converts degrees to radians', () => {
    expect(getAngle(0)).toBe(0);
    expect(getAngle(180)).toBeCloseTo(Math.PI);
    expect(getAngle(360)).toBeCloseTo(Math.PI * 2);
  });

  it('computes rounded arc points from radians and radius', () => {
    expect(getArcPointerByDeg(0, 10)).toEqual([10, 0]);
    expect(getArcPointerByDeg(Math.PI / 2, 10)).toEqual([0, 10]);
    expect(getArcPointerByDeg(Math.PI, 10)).toEqual([-10, 0]);
  });

  it('computes tangent slope and intercept for a point', () => {
    expect(getTangentByPointer(2, 4)).toEqual([-0.5, 5]);
  });

  it('draws a fan shape with an outer arc and inner point', () => {
    const ctx = createContextMock();
    fanShapedByArc(ctx, 100, 0, Math.PI / 2, 8);

    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.arc).toHaveBeenCalledWith(0, 0, 100, expect.any(Number), expect.any(Number), false);
    expect(ctx.lineTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
  });

  it('caps rounded rectangle radius to half the smaller dimension', () => {
    const ctx = createContextMock();
    roundRectByArc(ctx, 10, 20, 30, 10, 20);

    expect(ctx.moveTo).toHaveBeenCalledWith(15, 20);
    expect(ctx.arc).toHaveBeenCalledWith(35, 25, 5, -Math.PI / 2, 0);
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
  });

  it('creates linear gradients for keyword directions', () => {
    const ctx = createContextMock();
    const gradient = getLinearGradient(
      ctx,
      10,
      20,
      100,
      50,
      'linear-gradient(to right, red 0, blue 1)',
    ) as unknown as { addColorStop: ReturnType<typeof vi.fn> };

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(10, 20, 110, 20);
    expect(gradient.addColorStop).toHaveBeenCalledWith('0', 'red');
    expect(gradient.addColorStop).toHaveBeenCalledWith('1', 'blue');
  });

  it('creates linear gradients for degree directions', () => {
    const ctx = createContextMock();
    getLinearGradient(ctx, 0, 0, 100, 50, 'linear-gradient(90deg, red, blue)');

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(100, 50, 100, 0);
    expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(0, 'red');
    expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(1, 'blue');
  });

  it.each([
    ['to top', [0, 50, 0, 0]],
    ['to bottom', [0, 0, 0, 50]],
    ['to left', [100, 0, 0, 0]],
    ['to right', [0, 0, 100, 0]],
  ] as const)('creates linear gradients for %s', (direction, expected) => {
    const ctx = createContextMock();
    getLinearGradient(ctx, 0, 0, 100, 50, `linear-gradient(${direction}, red, blue)`);

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(...expected);
  });

  it.each([0, 30, 60, 120, 160, 200, 240, 300, 330])(
    'creates linear gradients for %sdeg',
    (degree) => {
      const ctx = createContextMock();
      getLinearGradient(ctx, 0, 0, 100, 50, `linear-gradient(${degree}deg, red, blue)`);

      expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
      expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(0, 'red');
      expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(1, 'blue');
    },
  );
});
