import componentCss from './index.less?inline';
import { ButtonBuilder, Div, EventManager, Slot, Span } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

/**
 * `<r-disclosure-row>` — the one-line summary row a run of them reads as a list.
 *
 * `[16px leading] [title] [·] [summary, fills and truncates]`, on one 24px line, with the
 * whole row as the toggle. The shape is the point: a row that wraps stops being scannable,
 * and scannability is what makes twelve tool calls a list instead of a wall. The summary
 * truncates rather than wrapping for the same reason.
 *
 * The leading slot holds two things in one 16px box — whatever the caller puts there at
 * rest, and a chevron that fades in on hover. They share a grid cell, so the swap costs no
 * layout and the title never shifts under the pointer.
 *
 * ```html
 * <r-disclosure-row expandable heading="fetch_url" summary="https://example.com">
 *   <r-state-dot slot="leading" state="running"></r-state-dot>
 *   <pre>…the expanded body…</pre>
 * </r-disclosure-row>
 * ```
 *
 * Attributes: `open`, `expandable`, `heading`, `summary`, `tone` (`error` colours the
 * summary), `sheet`. Fires {@link DISCLOSURE_TOGGLE} with `detail.open`.
 */
/**
 * Name of the event a row fires when it opens or closes.
 *
 * Not `toggle`: that is the native event `<details>` fires, and its `ToggleEvent` carries
 * `oldState`/`newState` rather than a `detail` — a listener typed against the platform's
 * name gets the platform's payload and finds nothing in it.
 */
export const DISCLOSURE_TOGGLE = 'disclosuretoggle';

export class DisclosureRow extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _row!: HTMLElement;
  _title!: HTMLElement;
  _summary!: HTMLElement;
  _sep!: HTMLElement;

  static get observedAttributes(): string[] {
    return ['open', 'expandable', 'heading', 'summary', 'tone', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-disclosure', () =>
      Div()
        .class('ran-disclosure')
        .attr('part', 'disclosure')
        .children(
          ButtonBuilder()
            .class('ran-disclosure-row')
            .attr('part', 'row')
            .attr('type', 'button')
            .children(
              Span()
                .class('ran-disclosure-leading')
                .attr('part', 'leading')
                .children(
                  Span().class('ran-disclosure-icon').children(Slot().attr('name', 'leading').build()).build(),
                  Span().class('ran-disclosure-chevron').attr('aria-hidden', 'true').text('▸').build(),
                )
                .build(),
              Span().class('ran-disclosure-title').attr('part', 'title').build(),
              Span().class('ran-disclosure-sep').attr('part', 'separator').attr('aria-hidden', 'true').build(),
              Span().class('ran-disclosure-summary').attr('part', 'summary').build(),
            )
            .build(),
          Div().class('ran-disclosure-body').attr('part', 'body').children(Slot().build()).build(),
        )
        .build(),
    );
    this._row = root.querySelector<HTMLElement>('.ran-disclosure-row')!;
    this._title = root.querySelector<HTMLElement>('.ran-disclosure-title')!;
    this._summary = root.querySelector<HTMLElement>('.ran-disclosure-summary')!;
    this._sep = root.querySelector<HTMLElement>('.ran-disclosure-sep')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** Whether the body is shown. */
  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value === this.open) return;
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  /**
   * Whether the row has a body worth opening.
   *
   * A row with nothing inside is still a row — a completed call with no output reads the
   * same as one with output until you try to open it, and offering a toggle that reveals
   * an empty box is worse than offering none.
   */
  get expandable(): boolean {
    return this.hasAttribute('expandable');
  }
  set expandable(value: boolean) {
    if (value) this.setAttribute('expandable', '');
    else this.removeAttribute('expandable');
  }

  /**
   * The fixed-width left half of the line.
   *
   * Not `title`: that is a native `HTMLElement` attribute, and the browser renders it as a
   * tooltip. A component using it for a heading makes every instance sprout a tooltip
   * repeating the text already on screen, and there is no way to switch that off once the
   * attribute is set.
   */
  get heading(): string {
    return getStringAttribute(this, 'heading');
  }
  set heading(value: string) {
    setStringAttribute(this, 'heading', value);
  }

  /** The truncating right half. Empty drops the separator with it. */
  get summary(): string {
    return getStringAttribute(this, 'summary');
  }
  set summary(value: string) {
    setStringAttribute(this, 'summary', value);
  }

  /** `error` colours the summary; anything else is the ordinary tone. */
  get tone(): string {
    return getStringAttribute(this, 'tone');
  }
  set tone(value: string) {
    setStringAttribute(this, 'tone', value);
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
    this._events.on(this._row, 'click', this._toggle);
    this._sync();
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    else this._sync();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _toggle = (): void => {
    if (!this.expandable) return;
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent(DISCLOSURE_TOGGLE, { detail: { open: this.open }, bubbles: true, composed: true }),
    );
  };

  private _sync(): void {
    const { heading, summary, expandable, open } = this;
    this._title.textContent = heading;
    this._summary.textContent = summary;
    // The dot is punctuation between two texts; with only one of them there is nothing to
    // punctuate, and a row ending in a stray dot reads as truncated.
    this._sep.hidden = summary === '' || heading === '';
    // Not a button when there is nothing to open: a control that does nothing is worse in
    // the accessibility tree than plain text, because it invites a press.
    this._row.setAttribute('aria-expanded', expandable ? String(open) : 'false');
    if (expandable) {
      this._row.removeAttribute('disabled');
      this._row.removeAttribute('aria-disabled');
    } else {
      this._row.setAttribute('aria-disabled', 'true');
    }
  }
}

defineSSR('r-disclosure-row', DisclosureRow as unknown as new () => HTMLElement);
export default DisclosureRow;
