import { describe, expect, it } from 'vitest';
import { alignCrossAxis, computePlacement } from '@/utils/placement';

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

  it('does not flip when the anchor or floating rect has no real layout (e.g. jsdom, or an unmeasured panel)', () => {
    // anchor.top === 0 with a zero-height anchor makes spaceAbove read as 0,
    // which would otherwise always look like "no room above" and force a
    // spurious flip regardless of where the trigger actually sits.
    const result = computePlacement({
      anchor: { top: 0, left: 0, width: 0, height: 0 },
      floating: { width: 0, height: 0 },
      placement: 'top',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('top');
  });

  it('does not flip when only the floating panel is unmeasured (zero size) even if the anchor is real', () => {
    const result = computePlacement({
      anchor: { top: 10, left: 100, width: 200, height: 40 },
      floating: { width: 0, height: 0 },
      placement: 'top',
      offset: 4,
      boundary,
    });
    expect(result.placement).toBe('top');
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
  describe('cross-axis alignment', () => {
    const anchor = { top: 100, left: 500, width: 120, height: 40 };
    const floating = { width: 200, height: 150 };

    it("keeps a bare side aligned to the anchor's leading edge, and reports it bare", () => {
      const result = computePlacement({ anchor, floating, placement: 'bottom', offset: 4, boundary });
      expect(result.left).toBe(500);
      // The bare form survives the round trip: r-popover keys its arrow
      // direction off a four-entry lookup table, and 'bottom-start' misses it.
      expect(result.placement).toBe('bottom');
      expect(result.side).toBe('bottom');
      expect(result.align).toBe('start');
    });

    it('pins the trailing edges together for `-end`', () => {
      const result = computePlacement({ anchor, floating, placement: 'bottom-end', offset: 4, boundary });
      // anchor right edge 620, panel is 200 wide.
      expect(result.left).toBe(420);
      expect(result.placement).toBe('bottom-end');
      expect(result.align).toBe('end');
    });

    it('centres the panel on the anchor for `-center`', () => {
      const result = computePlacement({ anchor, floating, placement: 'bottom-center', offset: 4, boundary });
      // 500 + (120 - 200) / 2
      expect(result.left).toBe(460);
    });

    it('aligns on the vertical axis for a left/right placement', () => {
      const tall = { top: 100, left: 500, width: 120, height: 300 };
      const start = computePlacement({ anchor: tall, floating, placement: 'right', offset: 4, boundary });
      const end = computePlacement({ anchor: tall, floating, placement: 'right-end', offset: 4, boundary });
      const centre = computePlacement({ anchor: tall, floating, placement: 'right-center', offset: 4, boundary });
      expect(start.top).toBe(100);
      expect(end.top).toBe(250); // 100 + 300 - 150
      expect(centre.top).toBe(175); // 100 + (300 - 150) / 2
      // The cross axis moves; the main axis is the same for all three.
      expect(new Set([start.left, end.left, centre.left]).size).toBe(1);
    });

    it('carries the alignment across a flip', () => {
      const result = computePlacement({
        anchor: { top: 700, left: 500, width: 120, height: 40 },
        floating,
        placement: 'bottom-end',
        offset: 4,
        boundary,
      });
      expect(result.side).toBe('top');
      expect(result.placement).toBe('top-end');
      expect(result.left).toBe(420);
    });

    it('still shifts an aligned panel back inside the boundary', () => {
      // Hard against the right edge: `-end` would put the panel at 1000-200=800,
      // but the boundary keeps 8px of padding, so it lands at 792.
      const result = computePlacement({
        anchor: { top: 100, left: 880, width: 120, height: 40 },
        floating,
        placement: 'bottom-end',
        offset: 4,
        boundary,
      });
      expect(result.left).toBe(792);
      expect(result.align).toBe('end');
    });

    it('aligns without real layout too — alignment is arithmetic, not collision detection', () => {
      // jsdom reports zero-size rects, which switches off flip and shift. The
      // alignment still has to happen, or a jsdom-rendered menu silently reads
      // as left-aligned in every test that measures it.
      const result = computePlacement({
        anchor: { top: 0, left: 0, width: 0, height: 0 },
        floating: { width: 0, height: 0 },
        placement: 'bottom-end',
        offset: 4,
        boundary,
      });
      expect(result.placement).toBe('bottom-end');
      expect(result.align).toBe('end');
    });
  });
});

describe('alignCrossAxis', () => {
  it('pins the leading edges for start, the trailing edges for end, and centres for center', () => {
    expect(alignCrossAxis('start', 100, 40, 200)).toBe(100);
    expect(alignCrossAxis('end', 100, 40, 200)).toBe(-60);
    expect(alignCrossAxis('center', 100, 40, 200)).toBe(20);
  });

  it('is the same arithmetic computePlacement applies, so a caller positioning inside its own container matches', () => {
    const anchor = { top: 100, left: 500, width: 120, height: 40 };
    const floating = { width: 200, height: 150 };
    for (const align of ['start', 'center', 'end'] as const) {
      const computed = computePlacement({
        anchor,
        floating,
        placement: `bottom-${align}`,
        offset: 4,
        boundary: { top: 0, left: 0, width: 1000, height: 800 },
      });
      expect(computed.left).toBe(alignCrossAxis(align, anchor.left, anchor.width, floating.width));
    }
  });
});
