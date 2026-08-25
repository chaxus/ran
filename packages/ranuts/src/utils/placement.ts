/** The side of the anchor a floating panel sits on. */
export type PlacementSide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Where the panel lines up along the cross axis: with the anchor's leading
 * edge, its centre, or its trailing edge. For a `top`/`bottom` placement that
 * is horizontal (left edge / centre / right edge); for `left`/`right` it is
 * vertical (top edge / centre / bottom edge).
 */
export type PlacementAlign = 'start' | 'center' | 'end';

/**
 * A side, optionally suffixed with a cross-axis alignment — the same grammar
 * Floating UI and Popper use (`bottom`, `bottom-end`, `right-center`, …).
 * A bare side means `-start`, which is what this module has always done.
 */
export type Placement = PlacementSide | `${PlacementSide}-${PlacementAlign}`;

export interface PlacementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ComputePlacementOptions {
  /** Anchor (trigger) rect, in viewport coordinates (e.g. `getBoundingClientRect()`). */
  anchor: PlacementRect;
  /** The floating panel's own size. */
  floating: { width: number; height: number };
  /** Preferred side, optionally with a cross-axis alignment. Flips to the opposite side when it lacks room and the opposite side has more; the alignment is carried across the flip. */
  placement: Placement;
  /** Gap kept between the anchor and the floating panel, in px. */
  offset?: number;
  /** Region the panel must stay inside, in viewport coordinates. Defaults to the window viewport. */
  boundary?: PlacementRect;
  /** Minimum gap kept between the panel and the boundary edge when shifting, in px. */
  padding?: number;
}

export interface ComputedPlacement {
  top: number;
  left: number;
  /**
   * The placement actually used, after flip, in the form the caller asked for:
   * a bare side stays bare, a suffixed one keeps its suffix. Callers that key a
   * lookup table off four sides therefore keep working unchanged.
   */
  placement: Placement;
  /** The side actually used, after flip — always bare, whatever form `placement` took. */
  side: PlacementSide;
  /** The cross-axis alignment actually used. `start` when the caller named none. */
  align: PlacementAlign;
}

/**
 * @description: Where a floating panel starts along the cross axis, given how
 * it should line up with its anchor. `start` pins the leading edges together,
 * `end` the trailing ones, `center` splits the difference. Exported because a
 * caller that computes its own coordinates -- a panel positioned inside a
 * custom container rather than the viewport -- still has to align the same way
 * `computePlacement` does, and two implementations of that would drift.
 * @param align cross-axis alignment
 * @param anchorStart anchor's leading edge on that axis (`left` or `top`)
 * @param anchorSize anchor's size on that axis (`width` or `height`)
 * @param floatingSize the panel's size on that axis
 * @return the panel's leading edge on that axis
 */
export const alignCrossAxis = (
  align: PlacementAlign,
  anchorStart: number,
  anchorSize: number,
  floatingSize: number,
): number => {
  if (align === 'end') return anchorStart + anchorSize - floatingSize;
  if (align === 'center') return anchorStart + (anchorSize - floatingSize) / 2;
  return anchorStart;
};

const defaultBoundary = (): PlacementRect => ({
  top: 0,
  left: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : Infinity,
  height: typeof window !== 'undefined' ? window.innerHeight : Infinity,
});

/**
 * Position a floating panel relative to an anchor rect: flips to the opposite
 * side when the preferred side doesn't have room and the opposite side has
 * more, aligns along the cross axis as asked, then shifts to stay within
 * `boundary`. Mirrors Floating UI's `flip`/`shift` middleware, minus the
 * dependency.
 *
 * Coordinates are viewport-relative throughout (same space as `anchor`); the
 * caller adds `scrollX`/`scrollY` when writing `position: absolute` styles.
 */
export const computePlacement = (options: ComputePlacementOptions): ComputedPlacement => {
  const { anchor, floating, offset = 0, padding = 8 } = options;
  const boundary = options.boundary ?? defaultBoundary();
  // A bare side keeps its bare form on the way out, so a caller that reads
  // `placement` as one of four values -- r-popover points its arrow with such a
  // lookup -- is unaffected by this parameter existing.
  const [requestedSide, requestedAlign] = options.placement.split('-') as [PlacementSide, PlacementAlign | undefined];
  const align: PlacementAlign = requestedAlign ?? 'start';
  let side = requestedSide;
  const isVertical = side === 'top' || side === 'bottom';

  // Without a real measured size for the anchor or the floating panel — e.g.
  // jsdom, which never performs actual layout, or a panel read before its
  // content/layout has settled — the space calculations below are
  // meaningless and would spuriously "detect" a collision on every call.
  // Skip flip/shift and just honor the caller's preferred placement.
  const hasRealLayout = anchor.width > 0 && anchor.height > 0 && floating.width > 0 && floating.height > 0;

  if (hasRealLayout && isVertical) {
    const spaceBelow = boundary.top + boundary.height - (anchor.top + anchor.height);
    const spaceAbove = anchor.top - boundary.top;
    if (side === 'bottom' && spaceBelow < floating.height + offset && spaceAbove > spaceBelow) {
      side = 'top';
    } else if (side === 'top' && spaceAbove < floating.height + offset && spaceBelow > spaceAbove) {
      side = 'bottom';
    }
  } else if (hasRealLayout) {
    const spaceRight = boundary.left + boundary.width - (anchor.left + anchor.width);
    const spaceLeft = anchor.left - boundary.left;
    if (side === 'right' && spaceRight < floating.width + offset && spaceLeft > spaceRight) {
      side = 'left';
    } else if (side === 'left' && spaceLeft < floating.width + offset && spaceRight > spaceLeft) {
      side = 'right';
    }
  }

  // `start` is what this module did before alignment existed, so a bare side
  // keeps its exact old coordinates.
  const alignOn = (anchorStart: number, anchorSize: number, floatingSize: number): number =>
    alignCrossAxis(align, anchorStart, anchorSize, floatingSize);

  let top: number;
  let left: number;
  if (side === 'bottom') {
    top = anchor.top + anchor.height + offset;
    left = alignOn(anchor.left, anchor.width, floating.width);
  } else if (side === 'top') {
    top = anchor.top - floating.height - offset;
    left = alignOn(anchor.left, anchor.width, floating.width);
  } else if (side === 'right') {
    top = alignOn(anchor.top, anchor.height, floating.height);
    left = anchor.left + anchor.width + offset;
  } else {
    top = alignOn(anchor.top, anchor.height, floating.height);
    left = anchor.left - floating.width - offset;
  }

  // Shift along the cross axis to stay within the boundary — skip when the
  // panel is wider/taller than the boundary itself (nothing to gain by
  // clamping) or when there's no real layout to clamp against.
  if (hasRealLayout && isVertical) {
    const minLeft = boundary.left + padding;
    const maxLeft = boundary.left + boundary.width - floating.width - padding;
    if (maxLeft >= minLeft) left = Math.min(Math.max(left, minLeft), maxLeft);
  } else if (hasRealLayout) {
    const minTop = boundary.top + padding;
    const maxTop = boundary.top + boundary.height - floating.height - padding;
    if (maxTop >= minTop) top = Math.min(Math.max(top, minTop), maxTop);
  }

  return { top, left, placement: requestedAlign ? `${side}-${align}` : side, side, align };
};
