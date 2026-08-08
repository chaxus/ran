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
