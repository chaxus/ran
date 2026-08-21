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
 * `<r-reasoning>` — a collapsible chain of thought.
 *
 * Reasoning is the one part of a response a reader wants to watch while it happens and
 * almost never wants to keep afterwards. So the element expands while `streaming` is set
 * and collapses when it clears.
 *
 * **Until the reader touches it.** Once they expand or collapse it themselves, the
 * automatic behaviour stops for good — the same ownership rule `createBottomFollower`
 * applies to scrolling, and for the same reason: an interface that keeps re-deciding
 * something the reader has already decided is worse than one that never decided at all.
 * Setting `open` from script counts as taking control too, since script is acting for a
 * caller who has an opinion.
 *
 * ```ts
 * const reasoning = document.querySelector('r-reasoning');
 * reasoning.streaming = true;          // expands
 * reasoning.content += delta;          // grows while visible
 * reasoning.streaming = false;         // collapses, unless the reader intervened
 * reasoning.duration = 4200;           // "thought for 4.2s"
 * ```
 *
 * Attributes: `open`, `streaming`, `label`, `duration` (ms), `sheet`. The default slot
 * replaces the rendered text, for a caller that wants `<r-markdown>` in the body.
 */
export class Reasoning extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _summary!: HTMLElement;
  _label!: HTMLElement;
  _meta!: HTMLElement;
  _marker!: HTMLElement;
  _text!: HTMLElement;

  /**
   * Whether the reader (or a caller acting for them) has decided the open state.
   *
   * Once true, `streaming` no longer opens or closes anything.
   */
  private _readerOwns = false;
  /** Guards the element's own `open` writes from being mistaken for the reader's. */
  private _writingOpen = false;
  private _content = '';

  static get observedAttributes(): string[] {
    return ['open', 'streaming', 'label', 'duration', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-reasoning', () =>
      Div()
        .class('ran-reasoning')
        .attr('part', 'reasoning')
        .children(
          ButtonBuilder()
            .class('ran-reasoning-summary')
            .attr('part', 'summary')
            .attr('type', 'button')
            .attr('aria-expanded', 'false')
            .children(
              Span().class('ran-reasoning-marker').attr('part', 'marker').text('▸').build(),
              Span().class('ran-reasoning-label').attr('part', 'label').build(),
              Span().class('ran-reasoning-meta').attr('part', 'meta').build(),
            )
            .build(),
          Div()
            .class('ran-reasoning-body')
            .attr('part', 'body')
            .children(Span().class('ran-reasoning-text').attr('part', 'text').build(), Slot().build())
            .build(),
        )
        .build(),
    );
    this._summary = root.querySelector<HTMLElement>('.ran-reasoning-summary')!;
    this._label = root.querySelector<HTMLElement>('.ran-reasoning-label')!;
    this._meta = root.querySelector<HTMLElement>('.ran-reasoning-meta')!;
    this._marker = root.querySelector<HTMLElement>('.ran-reasoning-marker')!;
    this._text = root.querySelector<HTMLElement>('.ran-reasoning-text')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** The reasoning text. Assigning repeatedly is the streaming path. */
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
    this._text.textContent = value;
  }

  /** Whether reasoning is still arriving. */
  get streaming(): boolean {
    return this.hasAttribute('streaming');
  }
  set streaming(value: boolean) {
    if (value) this.setAttribute('streaming', '');
    else this.removeAttribute('streaming');
  }

  /** Whether the body is expanded. */
  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value === this.open) return;
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  /** Summary text. Defaults to `Reasoning`. */
  get label(): string {
    return getStringAttribute(this, 'label', 'Reasoning');
  }
  set label(value: string) {
    setStringAttribute(this, 'label', value);
  }

  /** How long the model spent, in milliseconds. Rendered beside the label when set. */
  get duration(): number | null {
    const raw = this.getAttribute('duration');
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  set duration(value: number | null) {
    setStringAttribute(this, 'duration', value === null ? null : String(value));
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
    this._events.on(this._summary, 'click', this._toggle);
    this._syncSummary();
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'label' || name === 'duration') this._syncSummary();
    if (name === 'streaming') this._followStreaming(next !== null);
    if (name === 'open') {
      // An `open` change this element did not make is a caller stating an intent, and
      // takes the automatic behaviour off the table for the rest of the element's life.
      if (!this._writingOpen) this._readerOwns = true;
      this._syncSummary();
    }
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _toggle = (): void => {
    this._readerOwns = true;
    this.open = !this.open;
  };

  /**
   * Expands while reasoning arrives and collapses when it stops.
   *
   * @param streaming Whether reasoning is still arriving.
   */
  private _followStreaming(streaming: boolean): void {
    if (this._readerOwns) return;
    this._writingOpen = true;
    this.open = streaming;
    this._writingOpen = false;
  }

  private _syncSummary(): void {
    const open = this.open;
    this._summary.setAttribute('aria-expanded', open ? 'true' : 'false');
    this._marker.textContent = open ? '▾' : '▸';
    this._label.textContent = this.label;
    const duration = this.duration;
    // Sub-second thinking is noise; a reader cares that it was fast, not that it was 340ms.
    this._meta.textContent = duration === null || duration < 1000 ? '' : `${(duration / 1000).toFixed(1)}s`;
  }
}

defineSSR('r-reasoning', Reasoning as unknown as new () => HTMLElement);
export default Reasoning;
