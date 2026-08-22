import { describe, expect, it, vi } from 'vitest';
import {
  fanShapedByArc,
  getAngle,
  getArcPointerByDeg,
  getLinearGradient,
  getTangentByPointer,
  roundRectByArc,
} from '@/utils/canvas';

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

describe('utils/canvas', () => {
  it('converts degrees to radians', () => {
    expect(getAngle(0)).toBe(0);
    expect(getAngle(180)).toBeCloseTo(Math.PI);
    expect(getAngle(360)).toBeCloseTo(Math.PI * 2);
  });

  it('computes points on a circle', () => {
    expect(getArcPointerByDeg(0, 10)).toEqual([10, 0]);
    expect(getArcPointerByDeg(Math.PI / 2, 10)).toEqual([0, 10]);
    expect(getArcPointerByDeg(Math.PI, 10)).toEqual([-10, 0]);
  });

  it('computes the tangent line through a point', () => {
    expect(getTangentByPointer(2, 4)).toEqual([-0.5, 5]);
  });

  it('builds a fan-shaped path', () => {
    const ctx = createContextMock();
    fanShapedByArc(ctx, 100, 0, Math.PI / 2, 8);

    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.arc).toHaveBeenCalledTimes(1);
    expect(ctx.lineTo).toHaveBeenCalledTimes(1);
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
  });

  it('clamps the corner radius to half of the shortest side', () => {
    const ctx = createContextMock();
    roundRectByArc(ctx, 10, 20, 30, 10, 20);

    expect(ctx.moveTo).toHaveBeenCalledWith(15, 20);
    expect(ctx.arc).toHaveBeenCalledWith(35, 25, 5, -Math.PI / 2, 0);
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
  });

  it('creates linear gradients for keyword directions', () => {
    const ctx = createContextMock();
    const gradient = getLinearGradient(ctx, 10, 20, 100, 50, 'linear-gradient(to right, red 0, blue 1)');

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(10, 20, 110, 20);
    expect(gradient.addColorStop).toHaveBeenCalledWith(0, 'red');
    expect(gradient.addColorStop).toHaveBeenCalledWith(1, 'blue');
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

  it('rejects a value that is not a linear-gradient', () => {
    const ctx = createContextMock();
    expect(() => getLinearGradient(ctx, 0, 0, 100, 50, 'red')).toThrow(TypeError);
    // An empty argument list has nothing to make stops from
    expect(() => getLinearGradient(ctx, 0, 0, 100, 50, 'linear-gradient()')).toThrow(TypeError);
  });

  it('rejects an unterminated value without rescanning it', () => {
    // The argument list is located by index. Finding the closing parenthesis with `.+` instead
    // costs a scan to the end of the string from every position it could start at, which took
    // ~10s at this length. The assertion is the result; the runner's timeout is the guard.
    const ctx = createContextMock();
    const unterminated = `linear-gradient(${'linear-gradient(a'.repeat(20_000)}`;
    expect(() => getLinearGradient(ctx, 0, 0, 100, 50, unterminated)).toThrow(TypeError);
  });

  it.each([0, 30, 60, 120, 160, 200, 240, 300, 330])('creates linear gradients for %sdeg', (degree) => {
    const ctx = createContextMock();
    getLinearGradient(ctx, 0, 0, 100, 50, `linear-gradient(${degree}deg, red, blue)`);

    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
    expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(0, 'red');
    expect(ctx.gradient.addColorStop).toHaveBeenCalledWith(1, 'blue');
  });
});
