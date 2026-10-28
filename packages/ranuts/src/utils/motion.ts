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

export interface RollOptions {
  /**
   * Every character rises into place, staggered, as for an entrance. Transform only, so the
   * value is legible the whole time; without it the first call writes the text unanimated.
   */
  rise?: boolean;
}

/** What each host showed last: its text, and the cell of every character (null for whitespace). */
const shown = new WeakMap<HTMLElement, { text: string; cells: Array<HTMLElement | null> }>();

/** Entering motion: decelerates and stops on its mark, within the guide's 250–400ms. */
const ROLL = { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' };

const SCALE: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };

/** The first number in `text`, with a k/M/B suffix applied: "1.0k / 128k" reads as 1000. */
const leadingNumber = (text: string): number => {
  const match = /(-?\d+(?:\.\d+)?)\s*([kmb])?(?![a-z])/i.exec(text.replace(/,(?=\d{3})/g, ''));
  return match ? Number(match[1]) * (SCALE[match[2]?.toLowerCase() ?? ''] ?? 1) : Number.NaN;
};

/** -1 when `next` leads with a smaller number than `previous`, else +1. */
const direction = (previous: string, next: string): number => {
  const a = leadingNumber(previous);
  const b = leadingNumber(next);
  return Number.isFinite(a) && Number.isFinite(b) && b < a ? -1 : 1;
};

/**
 * @description: Writes `next` into `host`, rolling in only the characters that changed.
 *
 * Each character gets its own cell. A changed one slides up from below when the value grows
 * and down from above when it shrinks, clipped to its cell.
 *
 * The cells hold the real characters and nothing else, so `textContent`, selection, find in
 * page and screen readers always see the current value; the old character is not kept
 * around to slide out. Characters are matched from the right, the way digits line up, and an
 * unchanged one keeps its cell, so a roll still running finishes instead of snapping. The
 * direction follows the first number in the text, read with any k/M/B suffix.
 * Each word stays unbroken and whitespace stays plain text, so the text wraps where it did.
 * Under reduced motion, without the Web Animations API, or without a document, it only
 * writes the text.
 *
 * @example
 * ```ts
 * rollText(count, '41.2k'); // first call: written as is
 * rollText(count, '41.5k'); // only the "5" rolls in
 * ```
 */
export function rollText(host: HTMLElement, next: string, { rise = false }: RollOptions = {}): void {
  if (typeof document === 'undefined') {
    host.textContent = next;
    return;
  }
  const last = shown.get(host);
  if (last?.text === next && host.textContent === next) return;
  const animated = typeof host.animate === 'function' && !prefersReducedMotion() && (rise || last !== undefined);
  const step = direction(last?.text ?? '', next);
  const old = [...(last?.text ?? '')];
  const length = [...next].length;
  const cells: Array<HTMLElement | null> = [];
  let index = 0;
  const cellFor = (char: string): HTMLElement => {
    const position = index++;
    const before = old.length - (length - position);
    const kept = !rise && old[before] === char ? last?.cells[before] : null;
    if (kept) {
      cells.push(kept);
      return kept;
    }
    const cell = document.createElement('span');
    cells.push(cell);
    cell.style.display = 'inline-block';
    const glyph = document.createElement('span');
    glyph.style.display = 'inline-block';
    glyph.textContent = char;
    cell.append(glyph);
    if (!animated) return cell;
    if (rise) {
      glyph.animate([{ transform: 'translateY(0.4em)' }, { transform: 'none' }], {
        ...ROLL,
        delay: stagger(position, length, { each: 0.03 }) * 1000,
        fill: 'backwards',
      });
      return cell;
    }
    if (old[before] === char) return cell;
    // The clip is on the cell and the motion on the glyph, so the glyph moves inside it.
    // `clip-path`, not `overflow`: an inline-block with overflow moves its baseline.
    cell.style.clipPath = 'inset(0 -0.25em)';
    const roll = glyph.animate([{ transform: `translateY(${step * 100}%)` }, { transform: 'none' }], ROLL);
    roll.onfinish = () => cell.style.removeProperty('clip-path');
    return cell;
  };
  host.replaceChildren(
    ...next.split(/(\s+)/).flatMap((part): Node[] => {
      if (!part) return [];
      if (/^\s/.test(part)) {
        for (const _ of part) {
          index++;
          cells.push(null);
        }
        return [document.createTextNode(part)];
      }
      const word = document.createElement('span');
      word.style.whiteSpace = 'nowrap';
      word.append(...[...part].map(cellFor));
      return [word];
    }),
  );
  shown.set(host, { text: next, cells });
}
