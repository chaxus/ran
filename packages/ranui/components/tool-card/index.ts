import componentCss from './index.less?inline';
import { ButtonBuilder, createRef, Div, EventManager, Span, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { diffLines } from 'ranuts/utils';
import type { DiffHunk } from 'ranuts/utils';
import '@/components/disclosure-row';
import '@/components/state-dot';
import { DISCLOSURE_TOGGLE } from '@/components/disclosure-row';
import type { DisclosureRow } from '@/components/disclosure-row';
import type { StateDot } from '@/components/state-dot';
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
 * The one line a collapsed call shows beside its title.
 *
 * Taken from the view when the producer named one, and otherwise derived — a tool that
 * did not think about its collapsed line still gets a useful one rather than a bare title.
 * Derivation is deliberately shallow: the first argument, the command, the first path. The
 * collapsed row has one line, and picking the most important field is the producer's job.
 *
 * @param view The pending view.
 * @returns The summary text, or an empty string when there is nothing worth showing.
 */
function summaryOf(view: ToolCallView | null): string {
  if (view === null) return '';
  if (typeof view.summary === 'string') return view.summary;
  if (view.card === 'terminal') return view.description ?? view.cwd ?? '';
  // Guarded like every other read of a view: these arrive from a tool and are replayed
  // from a log, so a malformed one has to degrade rather than throw. A card that can break
  // rendering can break a whole replay.
  if (view.card === 'diff') return Array.isArray(view.diffs) ? view.diffs.map((diff) => diff.path).join(' · ') : '';
  const input = view.card === 'generic' ? view.input : undefined;
  const first = typeof input === 'object' && input !== null ? Object.values(input)[0] : undefined;
  return typeof first === 'string' ? first : '';
}

/** Status a state dot shows for a card status. */
const DOT_STATE = { running: 'running', success: 'success', error: 'error' } as const;

/**
 * `<r-tool-card>` — one tool call, as a line you can skim and open.
 *
 * The tool says what its call *is* — a shell command, a file edit, something generic — and
 * this element decides what that looks like. Keeping the two apart is what lets the same
 * call render as a row here, a single line in a compact transcript, and a jump target in an
 * editor, without the tool knowing any of them exist.
 *
 * **It renders as a row, not a box.** A run of tool calls is a list: twelve bordered cards
 * down a transcript is twelve things competing with the answer, while twelve one-line rows
 * is something a reader skims past on the way to the reply. The name is about the render
 * intent — `ToolCallView.card` names *what the payload is* — not about the chrome.
 *
 * Everything starts collapsed for the same reason.
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
  _row!: DisclosureRow;
  _dot!: StateDot;
  _body!: HTMLElement;

  private _call: ToolCallView | null = null;
  private _result: ToolResultView | null = null;

  static get observedAttributes(): string[] {
    return ['status', 'open', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    // Built through the builder, not `document.createElement`: this constructor also runs
    // during server rendering, where there is no document. The SSR gate is what says so.
    const dot = createRef<StateDot>();
    const body = createRef<HTMLDivElement>();
    const row = View('r-disclosure-row')
      .attr('part', 'row')
      .children(
        View('r-state-dot').ref(dot).attr('slot', 'leading').build(),
        Div().class('ran-tool-card-body').ref(body).attr('part', 'body').build(),
      )
      .build();
    this._shadowDom.appendChild(row);

    this._row = row as DisclosureRow;
    this._dot = shadowPart(dot, 'state dot');
    this._body = shadowPart(body, 'body');
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
    // The row owns the open state and announces its own changes; this element only mirrors
    // them onto itself so a page can style `[open]` and read it back.
    this._events.on(this._row, DISCLOSURE_TOGGLE, (event) => {
      this.open = (event as CustomEvent<{ open: boolean }>).detail.open;
    });
    this._render();
  }

  disconnectedCallback(): void {
    this._events.abort();
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

  private _render(): void {
    const view = this._call;
    const status = this.status;
    this._row.heading = view !== null && 'title' in view ? view.title : '';
    this._row.summary = summaryOf(view);
    this._row.open = this.open;
    this._row.tone = status === 'error' ? 'error' : '';
    this._row.busy = status === 'running';
    this._dot.state = DOT_STATE[status];

    this._body.replaceChildren();
    const card = cardOf(this._result ?? view);
    if (card === 'terminal') this._renderTerminal();
    else if (card === 'diff') this._renderDiff();
    else this._renderGeneric();

    const locations = view !== null && 'locations' in view ? view.locations : undefined;
    if (Array.isArray(locations) && locations.length > 0) this._body.appendChild(this._renderLocations(locations));

    // A row with an empty body offers a toggle that reveals nothing, which is worse than
    // offering none — it invites a press and answers with a blank.
    this._row.expandable = this._body.childNodes.length > 0;
  }

  /**
   * Builds the IN/OUT card the generic body is shown in.
   *
   * Two gutter-labelled sections in one surface, each capped and scrolling on its own so a
   * long input never buries a short output. Either half may be absent.
   *
   * @param input What went in, or null.
   * @param output What came back, or null.
   * @param failed Whether the output describes a failure.
   * @returns The card, or null when there is nothing to show.
   */
  private _ioCard(input: string | null, output: string | null, failed: boolean): HTMLElement | null {
    if (input === null && output === null) return null;
    const card = Div().class('ran-tool-card-io').attr('part', 'io').build();
    const section = (label: string, text: string, error: boolean): HTMLElement => {
      const row = Div().class('ran-tool-card-io-section').build();
      const value = Span().class('ran-tool-card-io-text').attr('part', 'io-text').text(text).build();
      if (error) value.dataset.error = '';
      row.append(Span().class('ran-tool-card-io-label').attr('aria-hidden', 'true').text(label).build(), value);
      return row;
    };
    if (input !== null) card.appendChild(section('IN', input, false));
    if (output !== null) card.appendChild(section('OUT', output, failed));
    return card;
  }

  private _renderGeneric(): void {
    const call = this._call;
    const result = this._result;
    const input =
      call !== null && call.card === 'generic' && call.input !== undefined
        ? Object.entries(call.input)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        : null;
    const output = result !== null && result.card === 'generic' && result.content !== undefined ? result.content : null;
    const card = this._ioCard(input, output === '' ? null : output, this.status === 'error');
    if (card !== null) this._body.appendChild(card);
  }

  private _renderTerminal(): void {
    const call = this._call;
    const result = this._result;
    const input =
      call !== null && call.card === 'terminal' ? (call.cwd === undefined ? null : `cwd: ${call.cwd}`) : null;
    if (result === null || result.card !== 'terminal') {
      const card = this._ioCard(input, null, false);
      if (card !== null) this._body.appendChild(card);
      return;
    }
    // Terminal output is aligned in columns and keeps its own block, unwrapped: wrapping
    // destroys the alignment that made it readable in the terminal it came from.
    const card = this._ioCard(input, null, false);
    if (card !== null) this._body.appendChild(card);
    this._body.appendChild(this._pre(result.output, 'preserve'));
    if (result.exitCode !== undefined && result.exitCode !== 0) {
      this._body.appendChild(
        Div().class('ran-tool-card-description').attr('part', 'exit').text(`exit ${result.exitCode}`).build(),
      );
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
