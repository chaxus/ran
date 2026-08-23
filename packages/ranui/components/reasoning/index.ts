import componentCss from './index.less?inline';
import { createRef, Div, EventManager, Slot, Span, View } from '@/utils/builder';
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
import { DISCLOSURE_TOGGLE } from '@/components/disclosure-row';
import '@/components/disclosure-row';
import type { DisclosureRow } from '@/components/disclosure-row';

/**
 * The line a collapsed reasoning block shows.
 *
 * While it is still arriving, the **latest** line — a reader watching a model think wants to
 * see where it has got to, and the opening sentence stopped being news several paragraphs
 * ago. Once it has stopped, the **first** line, because that is where the block starts and
 * the reader is now deciding whether to open it at all.
 *
 * @param text The reasoning so far.
 * @param streaming Whether more is still arriving.
 * @returns The line to show, or an empty string when there is nothing yet.
 */
function summaryOf(text: string, streaming: boolean): string {
  const visible = text.trimEnd();
  if (visible === '') return '';
  if (!streaming) return visible.split('\n', 1)[0] ?? '';
  const at = visible.lastIndexOf('\n');
  return at === -1 ? visible : visible.slice(at + 1);
}

/**
 * `<r-reasoning>` — a collapsible chain of thought.
 *
 * Reasoning is the one part of a response a reader wants to watch while it happens and
 * almost never wants to keep afterwards. So the element expands while `streaming` is set and
 * collapses when it clears, and the collapsed line keeps showing where the thinking has got
 * to — see {@link summaryOf}.
 *
 * **Until the reader touches it.** Once they expand or collapse it themselves, the automatic
 * behaviour stops for good — the same ownership rule `createBottomFollower` applies to
 * scrolling, and for the same reason: an interface that keeps re-deciding something the
 * reader has already decided is worse than one that never decided at all. Setting `open`
 * from script counts as taking control too, since script is acting for a caller who has an
 * opinion.
 *
 * The header is `r-disclosure-row`, the same chrome a tool call uses, so a transcript
 * carrying both has one disclosure language rather than two.
 *
 * ```ts
 * const reasoning = document.querySelector('r-reasoning');
 * reasoning.streaming = true;          // expands, and sweeps
 * reasoning.content += delta;          // grows while visible
 * reasoning.streaming = false;         // collapses, unless the reader intervened
 * reasoning.duration = 4200;           // "4.2s" beside the label
 * ```
 *
 * Attributes: `open`, `streaming`, `label`, `duration` (ms), `sheet`. The default slot
 * replaces the rendered text, for a caller that wants `<r-markdown>` in the body.
 */
export class Reasoning extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _row!: DisclosureRow;
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

    const text = createRef<HTMLElement>();
    const row = ensureShadowElement(this._shadowDom, 'r-disclosure-row', () =>
      View('r-disclosure-row')
        .attr('part', 'row')
        .attr('expandable', '')
        .children(
          Div()
            .class('ran-reasoning-body')
            .attr('part', 'body')
            .children(Span().class('ran-reasoning-text').ref(text).attr('part', 'text').build(), Slot().build())
            .build(),
        )
        .build(),
    ) as DisclosureRow;
    this._row = row;
    this._text = shadowPart(text, 'text');
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** The reasoning text. Assigning repeatedly is the streaming path. */
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
    this._text.textContent = value;
    this._syncRow();
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
    // The row announces its own toggles; a toggle it did not make itself is the reader.
    this._events.on(this._row, DISCLOSURE_TOGGLE, (event) => {
      this._readerOwns = true;
      this._writingOpen = true;
      this.open = (event as CustomEvent<{ open: boolean }>).detail.open;
      this._writingOpen = false;
    });
    this._syncRow();
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'label' || name === 'duration') this._syncRow();
    if (name === 'streaming') this._followStreaming(next !== null);
    if (name === 'open') {
      // An `open` change this element did not make is a caller stating an intent, and takes
      // the automatic behaviour off the table for the rest of the element's life.
      if (!this._writingOpen) this._readerOwns = true;
      this._syncRow();
    }
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  /**
   * Expands while reasoning arrives and collapses when it stops.
   *
   * @param streaming Whether reasoning is still arriving.
   */
  private _followStreaming(streaming: boolean): void {
    this._syncRow();
    if (this._readerOwns) return;
    this._writingOpen = true;
    this.open = streaming;
    this._writingOpen = false;
  }

  private _syncRow(): void {
    const streaming = this.streaming;
    const duration = this.duration;
    this._row.open = this.open;
    this._row.busy = streaming;
    // Sub-second thinking is noise; a reader cares that it was fast, not that it was 340ms.
    const meta = duration === null || duration < 1000 ? '' : `${(duration / 1000).toFixed(1)}s`;
    this._row.heading = meta === '' ? this.label : `${this.label} · ${meta}`;
    this._row.summary = summaryOf(this._content, streaming);
  }
}

defineSSR('r-reasoning', Reasoning as unknown as new () => HTMLElement);
export default Reasoning;
