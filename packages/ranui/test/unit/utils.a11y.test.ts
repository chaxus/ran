import { describe, expect, it } from 'vitest';
import { sliderStepFromKeydown } from '@/utils/a11y';

const key = (k: string, shiftKey = false): KeyboardEvent => ({ key: k, shiftKey }) as KeyboardEvent;

describe('sliderStepFromKeydown', () => {
  it('steps up on ArrowRight/ArrowUp and down on ArrowLeft/ArrowDown', () => {
    expect(sliderStepFromKeydown(key('ArrowRight'), { current: 5, min: 0, max: 10 })).toBe(6);
    expect(sliderStepFromKeydown(key('ArrowUp'), { current: 5, min: 0, max: 10 })).toBe(6);
    expect(sliderStepFromKeydown(key('ArrowLeft'), { current: 5, min: 0, max: 10 })).toBe(4);
    expect(sliderStepFromKeydown(key('ArrowDown'), { current: 5, min: 0, max: 10 })).toBe(4);
  });

  it('jumps to min/max on Home/End', () => {
    expect(sliderStepFromKeydown(key('Home'), { current: 5, min: 0, max: 10 })).toBe(0);
    expect(sliderStepFromKeydown(key('End'), { current: 5, min: 0, max: 10 })).toBe(10);
  });

  it('clamps at the bounds instead of overshooting', () => {
    expect(sliderStepFromKeydown(key('ArrowRight'), { current: 10, min: 0, max: 10 })).toBe(10);
    expect(sliderStepFromKeydown(key('ArrowLeft'), { current: 0, min: 0, max: 10 })).toBe(0);
  });

  it('respects a custom step', () => {
    expect(sliderStepFromKeydown(key('ArrowRight'), { current: 0, min: 0, max: 100, step: 5 })).toBe(5);
  });

  it('uses a coarse step (default step*10) when Shift is held', () => {
    expect(sliderStepFromKeydown(key('ArrowRight', true), { current: 0, min: 0, max: 100 })).toBe(10);
    expect(sliderStepFromKeydown(key('ArrowRight', true), { current: 0, min: 0, max: 100, step: 5 })).toBe(50);
  });

  it('honors an explicit coarseStep override', () => {
    expect(
      sliderStepFromKeydown(key('ArrowRight', true), { current: 0, min: 0, max: 100, step: 1, coarseStep: 25 }),
    ).toBe(25);
  });

  it('returns undefined for any other key, so callers can skip preventDefault', () => {
    expect(sliderStepFromKeydown(key('Enter'), { current: 5, min: 0, max: 10 })).toBeUndefined();
    expect(sliderStepFromKeydown(key('Tab'), { current: 5, min: 0, max: 10 })).toBeUndefined();
  });
});
