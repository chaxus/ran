import { describe, expect, it } from 'vitest';
import { computePlacement } from '@/utils/placement';

const boundary = { top: 0, left: 0, width: 1000, height: 800 };

describe('computePlacement', () => {
  it('places bottom by default when there is room', () => {
    const result = computePlacement({
      anchor: { top: 100, left: 100, width: 200, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('bottom');
    expect(result.top).toBe(100 + 40 + 4);
    expect(result.left).toBe(100);
  });

  it('places top when explicitly requested and there is room', () => {
    const result = computePlacement({
      anchor: { top: 400, left: 100, width: 200, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'top',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('top');
    expect(result.top).toBe(400 - 150 - 4);
  });

  it('flips bottom to top when the anchor is near the bottom edge of the boundary', () => {
    // Anchor sits at y=750 in an 800-tall boundary — only 50px below, not enough
    // for a 150px panel, but 750px above is plenty.
    const result = computePlacement({
      anchor: { top: 750, left: 100, width: 200, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('top');
    expect(result.top).toBe(750 - 150 - 4);
  });

  it('flips top to bottom when the anchor is near the top edge of the boundary', () => {
    const result = computePlacement({
      anchor: { top: 10, left: 100, width: 200, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'top',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('bottom');
    expect(result.top).toBe(10 + 40 + 4);
  });

  it('does not flip when neither side has enough room but the preferred side is not worse', () => {
    // Anchor near the middle of a boundary too short for the panel on either side.
    const shortBoundary = { top: 0, left: 0, width: 1000, height: 120 };
    const result = computePlacement({
      anchor: { top: 40, left: 100, width: 200, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      boundary: shortBoundary,
    });
    // spaceBelow = 120-80=40, spaceAbove = 40; equal, so no flip triggered.
    expect(result.placement).toBe('bottom');
  });

  it('shifts left horizontally to stay within the boundary when the anchor is near the right edge', () => {
    const result = computePlacement({
      anchor: { top: 100, left: 950, width: 40, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      padding: 8,
      boundary,
    });
    expect(result.placement).toBe('bottom');
    // Clamped so the panel's right edge stays >= 8px from the boundary's right edge.
    expect(result.left).toBe(1000 - 200 - 8);
  });

  it('shifts right horizontally to stay within the boundary when the anchor is near the left edge', () => {
    const result = computePlacement({
      anchor: { top: 100, left: -150, width: 40, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      padding: 8,
      boundary,
    });
    expect(result.left).toBe(8);
  });

  it('flips left to right when the anchor is near the left edge of the boundary', () => {
    const result = computePlacement({
      anchor: { top: 100, left: 10, width: 40, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'left',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('right');
    expect(result.left).toBe(10 + 40 + 4);
  });

  it('flips right to left when the anchor is near the right edge of the boundary', () => {
    const result = computePlacement({
      anchor: { top: 100, left: 950, width: 40, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'right',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('left');
    expect(result.left).toBe(950 - 200 - 4);
  });

  it('shifts vertically to stay within the boundary for left/right placements', () => {
    const result = computePlacement({
      anchor: { top: 780, left: 400, width: 40, height: 40 },
      floating: { width: 150, height: 200 },
      placement: 'right',
      offset: 4,
      padding: 8,
      boundary,
    });
    expect(result.top).toBe(800 - 200 - 8);
  });

  it('skips the shift clamp when the panel is larger than the boundary', () => {
    const tinyBoundary = { top: 0, left: 0, width: 100, height: 800 };
    const result = computePlacement({
      anchor: { top: 100, left: 20, width: 40, height: 40 },
      floating: { width: 200, height: 150 },
      placement: 'bottom',
      offset: 4,
      padding: 8,
      boundary: tinyBoundary,
    });
    // maxLeft (100-200-8) < minLeft (8) — clamp is skipped, natural left is kept.
    expect(result.left).toBe(20);
  });
});
