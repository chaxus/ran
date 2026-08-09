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

export interface RequiredValidityOptions {
  disabled: boolean;
  required: boolean;
  isEmpty: boolean;
  /** Native validation-bubble message. Default: "Please fill out this field." */
  message?: string;
  /** Element the native validation bubble anchors to — must be focusable. */
  anchor?: HTMLElement;
  /**
   * Element that receives `aria-required`/`aria-invalid` — the element assistive tech
   * actually focuses. Defaults to `host`. Pass this when the host itself isn't the
   * focusable node (e.g. r-input's real `<input>` lives in shadow DOM and is what a
   * screen reader reports on, not the custom-element host).
   */
  ariaTarget?: HTMLElement;
}

/**
 * Shared "required field" validity + a11y sync for form-associated components
 * (checkbox/input/select): mirrors emptiness into `ElementInternals.setValidity`
 * (so `form.checkValidity()`/`reportValidity()`/`:invalid` work) and into
 * `aria-required`/`aria-invalid` on the host, so assistive tech gets the same
 * signal sighted users get from the native validation bubble. Disabled fields
 * never block submission or report invalid, matching native `<input disabled>`.
 *
 * This exact ~10-line branch (disabled → clear / required+empty → valueMissing
 * / else clear) used to be hand-duplicated across checkbox, input, and select;
 * this is the canonical version new form-associated components should call.
 */
export function updateRequiredValidity(
  host: HTMLElement,
  internals: ElementInternals | undefined,
  options: RequiredValidityOptions,
): void {
  const { disabled, required, isEmpty, message = 'Please fill out this field.', anchor, ariaTarget = host } = options;
  if (required) ariaTarget.setAttribute('aria-required', 'true');
  else ariaTarget.removeAttribute('aria-required');

  const invalid = !disabled && required && isEmpty;
  if (invalid) ariaTarget.setAttribute('aria-invalid', 'true');
  else ariaTarget.removeAttribute('aria-invalid');

  if (!internals) return;
  if (invalid) internals.setValidity?.({ valueMissing: true }, message, anchor);
  else internals.setValidity?.({});
}

/** Shared `checkValidity()`/`reportValidity()` passthroughs to `ElementInternals`. */
export function checkInternalsValidity(internals: ElementInternals | undefined): boolean {
  return internals?.checkValidity?.() ?? true;
}
export function reportInternalsValidity(internals: ElementInternals | undefined): boolean {
  return internals?.reportValidity?.() ?? true;
}
