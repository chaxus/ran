import { describe, expect, it } from 'vitest';
import { Matrix } from '@/utils/visual/math/matrix';
import { Point } from '@/utils/visual/vertex/point';

describe('visual/Matrix', () => {
  it('defaults to the identity matrix', () => {
    const m = new Matrix();
    expect([m.a, m.b, m.c, m.d, m.tx, m.ty]).toEqual([1, 0, 0, 1, 0, 0]);
  });

  it('translates and scales a point', () => {
    const m = new Matrix();
    m.scale(2, 3).translate(5, 7);
    const p = m.apply(new Point(1, 1));
    expect(p.x).toBe(2 * 1 + 5);
    expect(p.y).toBe(3 * 1 + 7);
  });

  it('round-trips a point through apply / applyInverse', () => {
    const m = new Matrix()
      .scale(2, 4)
      .translate(10, -3)
      .rotate(Math.PI / 5);
    const original = new Point(3, 9);
    const back = m.applyInverse(m.apply(original));
    expect(back.x).toBeCloseTo(original.x, 6);
    expect(back.y).toBeCloseTo(original.y, 6);
  });

  it('append composes transforms like matrix multiplication', () => {
    const a = new Matrix().translate(10, 20);
    const b = new Matrix().scale(2, 2);
    a.append(b);
    const p = a.apply(new Point(1, 1));
    // scale first (2,2) then translate (10,20)
    expect(p.x).toBe(12);
    expect(p.y).toBe(22);
  });

  it('clone produces an equal but independent matrix', () => {
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    const c = m.clone();
    expect(c.equals(m)).toBe(true);
    c.translate(1, 1);
    expect(c.equals(m)).toBe(false);
  });

  it('identity resets a mutated matrix', () => {
    const m = new Matrix(9, 9, 9, 9, 9, 9).identity();
    expect(m.equals(new Matrix())).toBe(true);
  });

  it('toArray lays out a 3x3 in column / transposed form', () => {
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    expect(Array.from(m.toArray(false))).toEqual([1, 3, 5, 2, 4, 6, 0, 0, 1]);
    expect(Array.from(m.toArray(true))).toEqual([1, 2, 0, 3, 4, 0, 5, 6, 1]);
  });
});
