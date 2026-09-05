import componentCss from './index.less?inline';
import { createRef, Div, EventManager, Slot, Span, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { isActivationKey } from '@/utils/a11y';

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
 * summary), `busy` (a shimmer sweep while the work is running), `sheet`. Fires {@link DISCLOSURE_TOGGLE} with `detail.open`.
 */
/**
 * Name of the event a row fires when it opens or closes.
 *
 * Not `toggle`: that is the native event `<details>` fires, and its `ToggleEvent` carries
 * `oldState`/`newState` rather than a `detail` — a listener typed against the platform's
 * name gets the platform's payload and finds nothing in it.
 *
 * @fires disclosuretoggle - The row was expanded or collapsed.
 */
export const DISCLOSURE_TOGGLE = 'disclosuretoggle';

/**
 * Name of the event a row fires *before* it opens or closes.
 *
 * Cancelable: `event.preventDefault()` leaves the row as it was. That is what makes
 * "fetch the body the first time it is opened" and "refuse to collapse while an edit is
 * unsaved" expressible. The platform has no equivalent — `<details>` fires only the
 * after-the-fact `toggle`, and the request for a cancelable `beforetoggle` on it is still
 * open (whatwg/html#9743) — so this fills a real gap rather than duplicating one.
 *
 * Only a press fires it. A programmatic `row.open = true` is the application changing its
 * own mind, and there is nobody for it to ask.
 *
 * @fires disclosurebeforetoggle - The row is about to be expanded or collapsed.
 */
export const DISCLOSURE_BEFORE_TOGGLE = 'disclosurebeforetoggle';

/** Distinguishes one row's body from another's, for `aria-controls`. */
let seq = 0;

/**
 * Rows sharing a `name`, so opening one can close the rest.
 *
 * Keyed by name and holding connected rows only, which is what `<details name>` does: the
 * group is document-wide and the members do not have to be siblings.
 */
const groups = new Map<string, Set<DisclosureRow>>();

export class DisclosureRow extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _root!: HTMLElement;
  _row!: HTMLElement;
  _title!: HTMLElement;
  _summary!: HTMLElement;
  _sep!: HTMLElement;
  _leadingSlot!: HTMLSlotElement;
  _body!: HTMLElement;
  _bodyInner!: HTMLElement;
  private _bodyId = `ran-disclosure-body-${(seq += 1)}`;

  static get observedAttributes(): string[] {
    return ['open', 'expandable', 'heading', 'summary', 'tone', 'busy', 'name', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const row = createRef<HTMLDivElement>();
    const title = createRef<HTMLElement>();
    const summary = createRef<HTMLElement>();
    const sep = createRef<HTMLElement>();
    const leadingSlot = createRef<HTMLSlotElement>();
    const body = createRef<HTMLDivElement>();
    const bodyInner = createRef<HTMLDivElement>();
    const root = Div()
      .class('ran-disclosure')
      .attr('part', 'disclosure')
      .children(
        // A div, not a button. `expandable` is what decides whether this row is a control:
        // a row with no body is a line of text, and shipping it as a disabled button put a
        // tab stop on something that does nothing when pressed. `_sync` adds the button
        // role, the tab stop and the keyboard handling when there is something to open —
        // the same arrangement `r-button` uses.
        Div()
          .class('ran-disclosure-row')
          .ref(row)
          .attr('part', 'row')
          .children(
            Span()
              .class('ran-disclosure-leading')
              .attr('part', 'leading')
              .children(
                Span()
                  .class('ran-disclosure-icon')
                  .children(Slot().ref(leadingSlot).attr('name', 'leading').build())
                  .build(),
                // An inline SVG rather than the `▸` character: a text glyph is drawn by
                // whichever font resolves it, so its weight, size and baseline vary by
                // platform, and it cannot take a stroke width. Same path and stroke as
                // `assets/icons/chevron-down.svg`, inline rather than through `r-icon`
                // because a row is meant to appear dozens of times in a list and this
                // avoids a custom-element upgrade for each one.
                View('svg')
                  .class('ran-disclosure-chevron')
                  .attr('viewBox', '0 0 24 24')
                  .attr('fill', 'none')
                  .attr('stroke', 'currentColor')
                  .attr('stroke-width', '1.75')
                  .attr('stroke-linecap', 'round')
                  .attr('stroke-linejoin', 'round')
                  .attr('aria-hidden', 'true')
                  .children(View('path').attr('d', 'M6 9l6 6 6-6').build())
                  .build(),
              )
              .build(),
            Span().class('ran-disclosure-title').ref(title).attr('part', 'title').build(),
            Span().class('ran-disclosure-sep').ref(sep).attr('part', 'separator').attr('aria-hidden', 'true').build(),
            Span().class('ran-disclosure-summary').ref(summary).attr('part', 'summary').build(),
          )
          .build(),
        // Two elements, not one: the outer box animates `grid-template-rows`, and the
        // inner one clips what does not fit yet. A single element cannot do both.
        Div()
          .class('ran-disclosure-body')
          .attr('part', 'body')
          .id(this._bodyId)
          .ref(body)
          .children(Div().class('ran-disclosure-body-inner').ref(bodyInner).children(Slot().build()).build())
          .build(),
      )
      .build();
    this._shadowDom.appendChild(root);
    this._root = root;
    this._leadingSlot = leadingSlot.current as HTMLSlotElement;
    this._body = body.current as HTMLElement;
    this._bodyInner = bodyInner.current as HTMLElement;
    this._row = shadowPart(row, 'row');
    this._title = shadowPart(title, 'title');
    this._summary = shadowPart(summary, 'summary');
    this._sep = shadowPart(sep, 'separator');
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

  /**
   * Whether the work this row stands for is still running.
   *
   * Draws a shimmer sweep across the line. A spinner says something somewhere is happening;
   * a sweep over the row says this row is the one still working.
   */
  get busy(): boolean {
    return this.hasAttribute('busy');
  }
  set busy(value: boolean) {
    if (value) this.setAttribute('busy', '');
    else this.removeAttribute('busy');
  }

  /** `error` colours the summary; anything else is the ordinary tone. */
  get tone(): string {
    return getStringAttribute(this, 'tone');
  }
  set tone(value: string) {
    setStringAttribute(this, 'tone', value);
  }

  /**
   * Groups rows so that opening one closes the rest.
   *
   * Same contract as `<details name>`: the group is the whole document, and members do not
   * have to be siblings. Absent, the row opens and closes on its own.
   */
  get name(): string {
    return getStringAttribute(this, 'name');
  }
  set name(value: string) {
    setStringAttribute(this, 'name', value);
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
    // A div with a button role does not get Enter and Space for free.
    this._events.on(this._row, 'keydown', this._keydown);
    this._events.on(this._leadingSlot, 'slotchange', this._syncLeading);
    this._join();
    this._syncLeading();
    this._sync();
    if (this.open) this._closeGroupPeers();
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._leave();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') {
      this.handlerExternalCss();
      return;
    }
    if (name === 'name') {
      this._leave(old ?? '');
      this._join();
    }
    // Exclusivity is enforced here rather than in the press handler so that
    // `row.open = true` obeys the group too, the way `<details name>` does.
    if (name === 'open' && next !== null) this._closeGroupPeers();
    this._sync();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _toggle = (): void => {
    if (!this.expandable) return;
    const next = !this.open;
    const allowed = this.dispatchEvent(
      new CustomEvent(DISCLOSURE_BEFORE_TOGGLE, {
        detail: { open: next },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (!allowed) return;
    this.open = next;
    this.dispatchEvent(
      new CustomEvent(DISCLOSURE_TOGGLE, { detail: { open: this.open }, bubbles: true, composed: true }),
    );
  };

  private _keydown = (event: KeyboardEvent): void => {
    if (!this.expandable || !isActivationKey(event)) return;
    // Space scrolls the page otherwise, which is the one thing a reader operating the row
    // from the keyboard did not ask for.
    event.preventDefault();
    this._toggle();
  };

  /** Adds this row to its `name` group, if it has one. */
  private _join(): void {
    const { name } = this;
    if (!name) return;
    const group = groups.get(name) ?? new Set<DisclosureRow>();
    group.add(this);
    groups.set(name, group);
  }

  /**
   * Removes this row from a group.
   *
   * @param name The group to leave. Defaults to the current one; an explicit value is what
   *   lets `name` change without stranding the row in its previous group.
   */
  private _leave(name = this.name): void {
    const group = groups.get(name);
    if (!group) return;
    group.delete(this);
    if (group.size === 0) groups.delete(name);
  }

  /** Closes every other open row sharing this row's `name`. */
  private _closeGroupPeers(): void {
    const group = this.name ? groups.get(this.name) : undefined;
    if (!group) return;
    group.forEach((peer) => {
      if (peer !== this) peer.open = false;
    });
  }

  /**
   * Records whether anything was slotted into `leading`.
   *
   * With leading content the chevron shares that 16px cell and only appears on hover,
   * focus or while open, so the state icon is what a reader sees at rest. With nothing
   * slotted the chevron is the only affordance the row has, so hiding it until hover would
   * leave an expandable row looking like plain text. CSS cannot ask whether a slot is
   * empty, so the answer is recorded as a class.
   */
  private _syncLeading = (): void => {
    if (typeof this._leadingSlot?.assignedNodes !== 'function') return;
    const filled = this._leadingSlot
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || (node.textContent ?? '').trim() !== '');
    this._root.classList.toggle('has-leading', filled);
  };

  private _sync(): void {
    const { heading, summary, expandable, open } = this;
    this._title.textContent = heading;
    this._summary.textContent = summary;
    // The dot is punctuation between two texts; with only one of them there is nothing to
    // punctuate, and a row ending in a stray dot reads as truncated.
    this._sep.hidden = summary === '' || heading === '';
    // Only a row with something to open is a control. Without a body it carries no role,
    // no tab stop and no expanded state: it is a line of text, and announcing it as a
    // button invites a press that does nothing.
    if (expandable) {
      this._row.setAttribute('role', 'button');
      this._row.tabIndex = 0;
      this._row.setAttribute('aria-expanded', String(open));
      // Ties the control to what it controls, so a reader can move from one to the other.
      this._row.setAttribute('aria-controls', this._bodyId);
    } else {
      this._row.removeAttribute('role');
      this._row.removeAttribute('tabindex');
      this._row.removeAttribute('aria-expanded');
      this._row.removeAttribute('aria-controls');
    }
    // The sweep is the only signal that this row's work is still running, and it is a
    // visual one. `aria-busy` is the same statement for a reader who cannot see it.
    if (this.busy) this._row.setAttribute('aria-busy', 'true');
    else this._row.removeAttribute('aria-busy');
    // A collapsed body is clipped, not removed, so that it can animate. Clipped content is
    // still focusable and still read out, so it is made inert instead — the previous
    // `display: none` did that for free.
    this._bodyInner.inert = !(expandable && open);
  }
}

defineSSR('r-disclosure-row', DisclosureRow as unknown as new () => HTMLElement);
export default DisclosureRow;
