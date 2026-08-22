import componentCss from './index.less?inline';
import { ButtonBuilder, Div, EventManager, Span } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { diffLines } from 'ranuts/utils';
import type { DiffHunk } from 'ranuts/utils';
import type { ToolCallView, ToolCardStatus, ToolDiff, ToolLocation, ToolResultView } from './types';

export type { ToolCallView, ToolCardStatus, ToolDiff, ToolLocation, ToolResultView } from './types';

/** Card kinds this element renders natively; anything else degrades to `generic`. */
const KNOWN_CARDS = new Set(['generic', 'terminal', 'diff']);

/**
 * Narrows an untrusted view to a card kind this element renders.
 *
 * Views arrive from a tool and are replayed from a log, so a kind added by a newer
 * producer, or a value mangled in storage, must degrade rather than throw — a card that
 * can break rendering can break a whole replay.
 *
 * @param view The view to classify.
 * @returns The card kind to render with.
 */
function cardOf(view: { card?: unknown } | null): 'generic' | 'terminal' | 'diff' {
  const card = view?.card;
  return typeof card === 'string' && KNOWN_CARDS.has(card) ? (card as 'generic' | 'terminal' | 'diff') : 'generic';
}

/**
 * `<r-tool-card>` — renders a tool call and its result from a declared intent.
 *
 * The tool says what its call *is* — a shell command, a file edit, something generic — and
 * this element decides what that looks like. Keeping the two apart is what lets the same
 * call render as a terminal block here, a single line in a compact transcript, and a jump
 * target in an editor, without the tool knowing any of them exist.
 *
 * ```ts
 * const card = document.querySelector('r-tool-card');
 * card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
 * card.status = 'running';
 * // …later
 * card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
 * card.status = 'success';
 * ```
 *
 * Attributes: `status` (`running` | `success` | `error`), `open`, `sheet`.
 * Fires `locationclick` with `detail.location` when a file reference is activated.
 */
export class ToolCard extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _header!: HTMLElement;
  _title!: HTMLElement;
  _body!: HTMLElement;

  private _call: ToolCallView | null = null;
  private _result: ToolResultView | null = null;

  static get observedAttributes(): string[] {
    return ['status', 'open', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-tool-card', () =>
      Div()
        .class('ran-tool-card')
        .attr('part', 'card')
        .children(
          ButtonBuilder()
            .class('ran-tool-card-header')
            .attr('part', 'header')
            .attr('type', 'button')
            .attr('aria-expanded', 'false')
            .children(
              Span().class('ran-tool-card-status').attr('part', 'status').build(),
              Span().class('ran-tool-card-title').attr('part', 'title').build(),
              Span().class('ran-tool-card-toggle').attr('part', 'toggle').text('▸').build(),
            )
            .build(),
          Div().class('ran-tool-card-body').attr('part', 'body').build(),
        )
        .build(),
    );
    this._header = root.querySelector<HTMLElement>('.ran-tool-card-header')!;
    this._title = root.querySelector<HTMLElement>('.ran-tool-card-title')!;
    this._body = root.querySelector<HTMLElement>('.ran-tool-card-body')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** The pending view, derived from the call's arguments. */
  get call(): ToolCallView | null {
    return this._call;
  }
  set call(value: ToolCallView | null) {
    this._call = value;
    this._render();
  }

  /** The completed view. Replaces the pending one once set. */
  get result(): ToolResultView | null {
    return this._result;
  }
  set result(value: ToolResultView | null) {
    this._result = value;
    this._render();
  }

  /** Lifecycle of the call, reflected so styling can key off it. */
  get status(): ToolCardStatus {
    const value = getStringAttribute(this, 'status', 'running');
    return value === 'success' || value === 'error' ? value : 'running';
  }
  set status(value: ToolCardStatus) {
    setStringAttribute(this, 'status', value);
  }

  /** Whether the body is expanded. */
  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
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
    this._events.on(this._header, 'click', this._toggle);
    this._syncOpen();
    this._render();
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'open') this._syncOpen();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _toggle = (): void => {
    this.open = !this.open;
  };

  private _syncOpen(): void {
    const open = this.open;
    this._header.setAttribute('aria-expanded', open ? 'true' : 'false');
    const toggle = this._header.querySelector<HTMLElement>('.ran-tool-card-toggle');
    if (toggle !== null) toggle.textContent = open ? '▾' : '▸';
  }

  private _render(): void {
    const view = this._call;
    this._title.textContent = view !== null && 'title' in view ? view.title : '';

    this._body.replaceChildren();
    const card = cardOf(this._result ?? view);
    if (card === 'terminal') this._renderTerminal();
    else if (card === 'diff') this._renderDiff();
    else this._renderGeneric();

    const locations = view !== null && 'locations' in view ? view.locations : undefined;
    if (Array.isArray(locations) && locations.length > 0) this._body.appendChild(this._renderLocations(locations));
  }

  private _renderGeneric(): void {
    const call = this._call;
    const result = this._result;
    if (call !== null && call.card === 'generic' && call.input !== undefined) {
      const list = document.createElement('dl');
      list.className = 'ran-tool-card-input';
      list.setAttribute('part', 'input');
      for (const [key, value] of Object.entries(call.input)) {
        const term = document.createElement('dt');
        term.textContent = key;
        const description = document.createElement('dd');
        description.textContent = value;
        list.append(term, description);
      }
      this._body.appendChild(list);
    }
    const content = result !== null && result.card === 'generic' ? result.content : undefined;
    // Wrapped: a generic result is whatever text the tool returned — a sentence, a fetched
    // page — and reading it should not mean dragging a scrollbar sideways one line at a time.
    if (content !== undefined && content !== '') this._body.appendChild(this._pre(content, 'wrap'));
  }

  private _renderTerminal(): void {
    const call = this._call;
    if (call !== null && call.card === 'terminal') {
      const parts = [call.description, call.cwd === undefined ? undefined : `cwd: ${call.cwd}`].filter(
        (part): part is string => part !== undefined && part !== '',
      );
      if (parts.length > 0) {
        this._body.appendChild(
          Div().class('ran-tool-card-description').attr('part', 'description').text(parts.join(' · ')).build(),
        );
      }
    }
    const result = this._result;
    if (result !== null && result.card === 'terminal') {
      // Unwrapped: terminal output is aligned in columns, and wrapping it destroys the
      // alignment that made it readable in the terminal it came from.
      this._body.appendChild(this._pre(result.output, 'preserve'));
      if (result.exitCode !== undefined && result.exitCode !== 0) {
        this._body.appendChild(
          Div().class('ran-tool-card-description').attr('part', 'exit').text(`exit ${result.exitCode}`).build(),
        );
      }
    }
  }

  private _renderDiff(): void {
    const source = this._result ?? this._call;
    const diffs = source !== null && source.card === 'diff' ? source.diffs : undefined;
    if (!Array.isArray(diffs)) return;
    for (const diff of diffs) this._body.appendChild(this._renderFile(diff));
  }

  private _renderFile(diff: ToolDiff): HTMLElement {
    const file = Div().class('ran-tool-card-file').attr('part', 'file').build();
    file.appendChild(Div().class('ran-tool-card-path').attr('part', 'path').text(diff.path).build());
    for (const hunk of diffLines(diff.oldText ?? '', diff.newText)) file.appendChild(this._renderHunk(hunk));
    return file;
  }

  private _renderHunk(hunk: DiffHunk): HTMLElement {
    const block = Div().class('ran-tool-card-hunk').attr('part', 'hunk').build();
    for (const line of hunk.lines) {
      const row = Div().class('ran-tool-card-line').attr('part', 'line').build();
      row.dataset.kind = line.kind;
      row.append(
        Span()
          .class('ran-tool-card-gutter')
          .text(line.oldLine === null ? '' : String(line.oldLine))
          .build(),
        Span()
          .class('ran-tool-card-gutter')
          .text(line.newLine === null ? '' : String(line.newLine))
          .build(),
        Span()
          .text(`${line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '}${line.text}`)
          .build(),
      );
      block.appendChild(row);
    }
    return block;
  }

  private _renderLocations(locations: readonly ToolLocation[]): HTMLElement {
    const list = Div().class('ran-tool-card-locations').attr('part', 'locations').build();
    for (const location of locations) {
      const label = location.line === undefined ? location.path : `${location.path}:${location.line}`;
      const button = ButtonBuilder()
        .class('ran-tool-card-location')
        .attr('part', 'location')
        .attr('type', 'button')
        .text(label)
        .build();
      this._events.on(button, 'click', () => {
        this.dispatchEvent(new CustomEvent('locationclick', { detail: { location }, bubbles: true, composed: true }));
      });
      list.appendChild(button);
    }
    return list;
  }

  /**
   * Builds the monospaced block a result is shown in.
   *
   * @param text The text to show.
   * @param lines Whether long lines wrap. Terminal output is column-aligned and must not;
   *   arbitrary text must, or reading it means scrolling sideways per line.
   * @returns The block.
   */
  private _pre(text: string, lines: 'wrap' | 'preserve'): HTMLElement {
    const pre = document.createElement('pre');
    pre.className = lines === 'wrap' ? 'ran-tool-card-output ran-tool-card-output-wrap' : 'ran-tool-card-output';
    pre.setAttribute('part', 'output');
    pre.textContent = text;
    return pre;
  }
}

defineSSR('r-tool-card', ToolCard as unknown as new () => HTMLElement);
export default ToolCard;
