import componentCss from './index.less?inline';
import { createRef, Div, Span } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

/** How full the context window is. */
export type TokenMeterLevel = 'ok' | 'warn' | 'over';

/** Fraction of the limit at which the meter starts warning. */
const WARN_AT = 0.8;

/**
 * Formats a token count the way a reader scans it.
 *
 * Exact below a thousand, because "847" is a number someone can hold; abbreviated above,
 * because the third digit of "128,431" tells a reader nothing they act on.
 *
 * @param tokens The count.
 * @returns The label.
 */
function short(tokens: number): string {
  if (tokens < 1000) return String(tokens);
  if (tokens < 10_000) return `${(tokens / 1000).toFixed(1)}k`;
  return `${Math.round(tokens / 1000)}k`;
}

/**
 * `<r-token-meter>` — how much of the context window a conversation is using.
 *
 * Every chat client that omits this works for a week and then stops working: each turn
 * carries the whole history, the request grows monotonically, and one day the provider
 * refuses it. The refusal arrives as a wall. This is the instrument that makes the growth
 * visible before then.
 *
 * ```ts
 * const meter = document.querySelector('r-token-meter');
 * meter.limit = 65536;
 * meter.used = 41200;      // context the next request will carry
 * meter.spent = 128431;    // tokens billed across the conversation, optional
 * ```
 *
 * `level` is reflected (`ok` / `warn` / `over`) so a page can react to the same escalation
 * the bar shows, and `title` always states the numbers — colour is never the only carrier.
 *
 * Attributes: `limit`, `used`, `spent`, `label`, `sheet`. `level` is set by the element and
 * writing it from outside is overwritten on the next update.
 */
export class TokenMeter extends RanElement {
  _shadowDom!: ShadowRoot;
  _fill!: HTMLElement;
  _text!: HTMLElement;
  _root!: HTMLElement;

  static get observedAttributes(): string[] {
    return ['limit', 'used', 'spent', 'label', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const fill = createRef<HTMLDivElement>();
    const text = createRef<HTMLElement>();
    const root = ensureShadowElement(this._shadowDom, '.ran-token-meter', () =>
      Div()
        .class('ran-token-meter')
        .attr('part', 'meter')
        // A progress bar by role, so a screen reader reads it as a proportion rather than
        // as two loose numbers.
        .attr('role', 'progressbar')
        .attr('aria-valuemin', '0')
        .children(
          Div()
            .class('ran-token-meter-track')
            .attr('part', 'track')
            .children(Div().class('ran-token-meter-fill').ref(fill).attr('part', 'fill').build())
            .build(),
          Span().class('ran-token-meter-text').ref(text).attr('part', 'text').build(),
        )
        .build(),
    );
    this._root = root;
    this._fill = shadowPart(fill, 'fill');
    this._text = shadowPart(text, 'text');
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** Context window size in tokens. Zero or absent hides the bar and shows only counts. */
  get limit(): number {
    return this._number('limit');
  }
  set limit(value: number) {
    setStringAttribute(this, 'limit', String(value));
  }

  /** Tokens the next request will carry — the history, not the whole conversation. */
  get used(): number {
    return this._number('used');
  }
  set used(value: number) {
    setStringAttribute(this, 'used', String(value));
  }

  /**
   * Tokens billed across the conversation so far.
   *
   * Distinct from {@link TokenMeter.used} and not derivable from it: a conversation that
   * has been compacted has spent far more than it currently carries, and that difference is
   * the whole reason someone looks at this.
   */
  get spent(): number {
    return this._number('spent');
  }
  set spent(value: number) {
    setStringAttribute(this, 'spent', String(value));
  }

  /** Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts. */
  get label(): string {
    return getStringAttribute(this, 'label', 'Context');
  }
  set label(value: string) {
    setStringAttribute(this, 'label', value);
  }

  /** How full the window is. Derived; assigning it is overwritten on the next update. */
  get level(): TokenMeterLevel {
    const value = this.getAttribute('level');
    return value === 'warn' || value === 'over' ? value : 'ok';
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    this.handlerExternalCss();
    this._render();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    else this._render();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  /**
   * Reads a numeric attribute.
   *
   * @param name The attribute.
   * @returns Its value, or zero when absent or not a usable count. A meter is decoration on
   *   someone else's screen; a malformed number must not be able to throw in a render path.
   */
  private _number(name: string): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  private _render(): void {
    const { limit, used, spent, label } = this;
    const ratio = limit === 0 ? 0 : used / limit;
    const level: TokenMeterLevel = limit === 0 || ratio < WARN_AT ? 'ok' : ratio < 1 ? 'warn' : 'over';
    this.setAttribute('level', level);

    // Capped at the track, because a bar wider than its track paints outside the rounded
    // corner; `title` and `aria-valuenow` still carry the real number.
    this._fill.style.width = `${Math.min(100, ratio * 100)}%`;
    this._root.setAttribute('aria-valuenow', String(used));
    this._root.setAttribute('aria-valuemax', String(limit === 0 ? used : limit));

    // The label rides in the readout, not only in the title: in a composer strip a bare
    // number beside a bar is a number nobody can name, and `title` needs a hover to reach.
    const context = limit === 0 ? short(used) : `${short(used)} / ${short(limit)}`;
    const counts = spent === 0 ? context : `${context} · ${short(spent)}`;
    this._text.textContent = label === '' ? counts : `${label} ${counts}`;
    // The exact numbers, unabbreviated, and the only place the level is stated in words —
    // a reader who cannot distinguish the colours still gets the escalation.
    this._root.setAttribute(
      'title',
      [
        `${label}: ${used.toLocaleString()}${limit === 0 ? '' : ` / ${limit.toLocaleString()}`}`,
        spent === 0 ? '' : `Spent: ${spent.toLocaleString()}`,
        level === 'ok' ? '' : level === 'warn' ? 'Approaching the limit' : 'Over the limit',
      ]
        .filter((part) => part !== '')
        .join('\n'),
    );
  }
}

defineSSR('r-token-meter', TokenMeter as unknown as new () => HTMLElement);
export default TokenMeter;
