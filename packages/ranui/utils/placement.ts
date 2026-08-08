export type Placement = 'top' | 'bottom' | 'left' | 'right';

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
  /** Preferred side. Flips to the opposite side when it lacks room and the opposite side has more. */
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
  /** The side actually used, after flip. */
  placement: Placement;
}

const defaultBoundary = (): PlacementRect => ({
  top: 0,
  left: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : Infinity,
  height: typeof window !== 'undefined' ? window.innerHeight : Infinity,
});

/**
 * Position a floating panel relative to an anchor rect: flips to the opposite
 * side when the preferred side doesn't have room and the opposite side has
 * more, then shifts along the cross axis to stay within `boundary`. Mirrors
 * Floating UI's `flip`/`shift` middleware, minus the dependency.
 *
 * Coordinates are viewport-relative throughout (same space as `anchor`); the
 * caller adds `scrollX`/`scrollY` when writing `position: absolute` styles.
 */
export const computePlacement = (options: ComputePlacementOptions): ComputedPlacement => {
  const { anchor, floating, offset = 0, padding = 8 } = options;
  const boundary = options.boundary ?? defaultBoundary();
  let placement = options.placement;
  const isVertical = placement === 'top' || placement === 'bottom';

  // Without a real measured size for the anchor or the floating panel — e.g.
  // jsdom, which never performs actual layout, or a panel read before its
  // content/layout has settled — the space calculations below are
  // meaningless and would spuriously "detect" a collision on every call.
  // Skip flip/shift and just honor the caller's preferred placement.
  const hasRealLayout = anchor.width > 0 && anchor.height > 0 && floating.width > 0 && floating.height > 0;

  if (hasRealLayout && isVertical) {
    const spaceBelow = boundary.top + boundary.height - (anchor.top + anchor.height);
    const spaceAbove = anchor.top - boundary.top;
    if (placement === 'bottom' && spaceBelow < floating.height + offset && spaceAbove > spaceBelow) {
      placement = 'top';
    } else if (placement === 'top' && spaceAbove < floating.height + offset && spaceBelow > spaceAbove) {
      placement = 'bottom';
    }
  } else if (hasRealLayout) {
    const spaceRight = boundary.left + boundary.width - (anchor.left + anchor.width);
    const spaceLeft = anchor.left - boundary.left;
    if (placement === 'right' && spaceRight < floating.width + offset && spaceLeft > spaceRight) {
      placement = 'left';
    } else if (placement === 'left' && spaceLeft < floating.width + offset && spaceRight > spaceLeft) {
      placement = 'right';
    }
  }

  let top: number;
  let left: number;
  if (placement === 'bottom') {
    top = anchor.top + anchor.height + offset;
    left = anchor.left;
  } else if (placement === 'top') {
    top = anchor.top - floating.height - offset;
    left = anchor.left;
  } else if (placement === 'right') {
    top = anchor.top;
    left = anchor.left + anchor.width + offset;
  } else {
    top = anchor.top;
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

  return { top, left, placement };
};
