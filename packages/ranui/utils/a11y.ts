export interface SliderStepOptions {
  current: number;
  min: number;
  max: number;
  /** Arrow-key increment. Default 1. */
  step?: number;
  /** Shift+Arrow increment. Default `step * 10`. */
  coarseStep?: number;
}

/**
 * Maps a keydown event to a slider's next value, per the WAI-ARIA slider
 * keyboard pattern: ArrowRight/Up = +step, ArrowLeft/Down = -step, Home/End
 * = min/max, Shift = coarse step. Returns `undefined` for any other key —
 * callers should treat that as "not handled" and skip `preventDefault()`.
 *
 * Shared by every component with an arrow-key-operable slider (r-progress,
 * r-colorpicker's hue/alpha tracks) so the keyboard contract — and any future
 * fix to it — lives in one place instead of drifting per copy.
 */
export function sliderStepFromKeydown(e: KeyboardEvent, options: SliderStepOptions): number | undefined {
  const { current, min, max, step = 1, coarseStep = step * 10 } = options;
  const delta = e.shiftKey ? coarseStep : step;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(max, current + delta);
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(min, current - delta);
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return undefined;
  }
}

/**
 * Whether a keydown is the "activate" gesture for a non-native interactive
 * element (a `<div>`/host acting as a button) — Enter or Space, matching the
 * behavior a real `<button>` gets from the browser for free. Includes
 * `'Spacebar'`, the pre-standardization key name old Edge/IE report.
 *
 * The same `e.key === 'Enter' || e.key === ' '` check (some call sites also
 * add `'Spacebar'`, some don't) is hand-duplicated across button, select,
 * popover, checkbox, and colorpicker; this is the canonical version new code
 * should call instead of re-typing the check.
 */
export function isActivationKey(e: KeyboardEvent): boolean {
  return e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar';
}
