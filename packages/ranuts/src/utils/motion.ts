/**
 * @description: Motion primitives that leave the drawing to the caller: whether the reader
 * asked for reduced motion, a spring solved in closed form (also as a CSS `linear()` easing),
 * stagger delays, and a one-shot "has this entered the viewport" observer.
 *
 * Nothing here owns an animation loop. The spring is a pure function of time, so it drives a
 * requestAnimationFrame loop, a Web Animations keyframe list or a CSS transition equally.
 */

/**
 * @description: Whether the reader asked for reduced motion. `false` where there is no window (SSR, Node).
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface SpringOptions {
  /** Pull towards the target. Higher is faster. */
  stiffness?: number;
  /** Resistance. Below `2 * sqrt(stiffness * mass)` the spring overshoots before settling. */
  damping?: number;
  mass?: number;
  /** Starting velocity, in progress units per second (1 = the whole distance per second). */
  velocity?: number;
}

export interface Spring {
  /** Progress from 0 to 1 at `seconds`; an underdamped spring passes 1 before settling. */
  at: (seconds: number) => number;
  /** Seconds until the spring stays within 0.1% of its target. */
  duration: number;
  /** The same curve as a CSS `linear()` easing over `duration`, for transitions and WAAPI. */
  easing: string;
}

const SETTLED = 0.001;
const LONGEST = 10;

/**
 * @description: A damped spring from 0 to 1, solved exactly rather than stepped, so any frame rate gives
 * the same curve.
 *
 * @example
 * ```ts
 * const { duration, easing } = spring({ stiffness: 260, damping: 20 });
 * card.animate([{ transform: 'translateY(24px)' }, { transform: 'none' }], { duration: duration * 1000, easing });
 * ```
 */
export function spring({ stiffness = 170, damping = 26, mass = 1, velocity = 0 }: SpringOptions = {}): Spring {
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  // Displacement from the target: u(0) = -1, u'(0) = velocity.
  let offset: (t: number) => number;
  if (zeta < 1) {
    const damped = omega * Math.sqrt(1 - zeta * zeta);
    const b = (velocity - zeta * omega) / damped;
    offset = (t) => Math.exp(-zeta * omega * t) * (-Math.cos(damped * t) + b * Math.sin(damped * t));
  } else if (zeta === 1) {
    offset = (t) => (-1 + (velocity - omega) * t) * Math.exp(-omega * t);
  } else {
    const root = omega * Math.sqrt(zeta * zeta - 1);
    const r1 = -zeta * omega + root;
    const r2 = -zeta * omega - root;
    const c2 = (velocity + r1) / (r2 - r1);
    const c1 = -1 - c2;
    offset = (t) => c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
  }
  const at = (seconds: number): number => (seconds <= 0 ? 0 : 1 + offset(seconds));

  let duration = LONGEST;
  for (let t = LONGEST; t >= 0; t -= 1 / 240) {
    if (Math.abs(offset(t)) >= SETTLED) {
      duration = Math.min(LONGEST, t + 1 / 240);
      break;
    }
  }
  const samples = Math.max(16, Math.min(120, Math.round(duration * 60)));
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    points.push(String(Math.round((i === samples ? 1 : at((i / samples) * duration)) * 10000) / 10000));
  }
  return { at, duration, easing: `linear(${points.join(', ')})` };
}

export interface StaggerOptions {
  /** Seconds between neighbouring items. */
  each?: number;
  /** Which item goes first. */
  from?: 'start' | 'end' | 'center';
}

/**
 * @description: Delay, in seconds, for item `index` of `count` so a group arrives in order.
 */
export const stagger = (index: number, count: number, { each = 0.05, from = 'start' }: StaggerOptions = {}): number => {
  const step = from === 'end' ? count - 1 - index : from === 'center' ? Math.abs(index - (count - 1) / 2) : index;
  return Math.max(0, step) * each;
};

export interface EntryOptions {
  /** The line, as a fraction of the viewport height from the top, that the element's top crosses. */
  line?: number;
  /** Called once the element crosses the line. `reduced` asks the caller to show the end state. */
  onEnter: (state: { reduced: boolean }) => void;
}

/**
 * @description: Calls `onEnter` once, when `element` first scrolls past `line`, then stops observing.
 * Where there is no IntersectionObserver it enters at once, so content is never left hidden.
 * Returns a function that stops observing early.
 *
 * @example
 * ```ts
 * const stop = observeEntry(card, { onEnter: ({ reduced }) => (reduced ? show(card) : animateIn(card)) });
 * ```
 */
export function observeEntry(element: Element, { line = 0.85, onEnter }: EntryOptions): () => void {
  if (typeof window === 'undefined') return () => {};
  const enter = () => onEnter({ reduced: prefersReducedMotion() });
  if (typeof IntersectionObserver === 'undefined') {
    enter();
    return () => {};
  }
  const bottom = Math.round((1 - Math.min(1, Math.max(0, line))) * 100);
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      enter();
    },
    { rootMargin: `0px 0px -${bottom}% 0px` },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
