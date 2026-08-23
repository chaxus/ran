import { range } from 'ranuts/utils';
import progressCss from './index.less?inline';
import { createRef, Div, EventManager, RanElement } from '@/utils/index';
import {
  mountShadowTree,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { sliderStepFromKeydown } from '@/utils/a11y';

const attributes: string[] = ['percent', 'type', 'total', 'dot', 'sheet'];

/**
 * Parse `percent`/`total` attribute text into a plain number, tolerating an
 * optional trailing "%" as pure decoration (`percent="40"` and `percent="40%"`
 * mean the same thing here). Deliberately NOT `ranuts`' `perToNum` — that
 * utility's documented contract is "convert a percent string into a 0-1
 * fraction" (`perToNum('40%') === 0.4`), which is the wrong shape for this
 * component: `percent` and `total` share one scale (0-100 by default) and
 * `updateCurrentProgress` divides percent/total itself, so silently
 * pre-dividing by 100 here double-converts — `percent="40%"` rendered as
 * 0.4/100 = 0.4%, a barely-visible sliver instead of the intended 40%.
 */
const parsePercentLike = (str: string | null): number => {
  const trimmed = (str ?? '').trim();
  if (!trimmed) return 0;
  return trimmed.endsWith('%') ? Number(trimmed.slice(0, -1)) : Number(trimmed);
};

export class Progress extends RanElement {
  _progress!: HTMLDivElement;
  _progressWrap!: HTMLDivElement;
  _progressWrapValue!: HTMLDivElement;
  _progressDot!: HTMLDivElement;
  _shadowDom!: ShadowRoot;
  _events = new EventManager();
  // Scoped to a single drag session (created in progressDotMouseDown, aborted
  // in progressDotMouseUp/disconnectedCallback) rather than folded into
  // `_events` — see the comment on `progressDotMouseDown` for why the
  // document-level mousemove/mouseup pair must not stay bound for the
  // component's whole connected lifetime.
  _dragEvents = new EventManager();
  moveProgress: { mouseDown: boolean } = { mouseDown: false };
  // Tracks whether *this component* put tabindex="0" on, so syncA11y can take
  // it back off when type leaves "drag" — without leaking into a tabindex a
  // consumer set explicitly themselves (which the component never touches).
  private _tabIndexOwnedByComponent = false;

  static get observedAttributes(): string[] {
    return attributes;
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, progressCss);
    const progressWrapRef = createRef<HTMLDivElement>();
    const progressWrapValueRef = createRef<HTMLDivElement>();
    const progressDotRef = createRef<HTMLDivElement>();

    const container = mountShadowTree(this._shadowDom, () =>
      Div()
        .class('ran-progress')
        .children(
          Div()
            .class('ran-progress-wrap')
            .ref(progressWrapRef)
            .part('track')
            .children(Div().class('ran-progress-wrap-value').ref(progressWrapValueRef).part('fill')),
          Div().class('ran-progress-dot').ref(progressDotRef).part('dot'),
        )
        .build(),
    );

    this._progress = container;
    this._progressWrap = shadowPart(progressWrapRef, 'wrap');
    this._progressWrapValue = shadowPart(progressWrapValueRef, 'wrap value');
    this._progressDot = shadowPart(progressDotRef, 'dot');
  }

  get percent(): string {
    const percentAttr = this.getAttribute('percent') || '0';
    const num = parsePercentLike(percentAttr);
    const totalNum = Number(this.total);
    if (num > totalNum) {
      // ⚠️ Keep it silent or cap it, console.error is too loud for dev
      return String(totalNum);
    }
    return String(num);
  }
  set percent(value: string) {
    this.setAttribute('percent', value || '0');
    this.setAttribute('aria-valuenow', value || '0');
  }

  get total(): string {
    const total = this.getAttribute('total');
    if (!total) return '100'; // 💡 Better default for "percent" context
    return `${parsePercentLike(total)}`;
  }
  set total(value: string) {
    this.setAttribute('total', value || '100');
  }

  get type(): string {
    const type = this.getAttribute('type') || 'primary';
    return ['primary', 'drag'].includes(type) ? type : 'primary';
  }
  set type(value: string) {
    this.setAttribute('type', value || 'primary');
  }

  get dot(): string {
    const dot = this.getAttribute('dot') || 'true';
    return ['true', 'false'].includes(dot) ? dot : 'true';
  }
  set dot(value: string) {
    this.setAttribute('dot', value || 'true');
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }

  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  progressClick = (e: MouseEvent): void => {
    if (this.type !== 'drag') return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = range(offsetX / this._progress.offsetWidth, 0, 1);
    const newVal = percentage * Number(this.total);
    this.percent = String(newVal);
    this.updateUI(percentage);
    this.change();
  };

  /**
   * `document` pointermove/pointerup(/pointercancel) are attached here (drag
   * start) and removed in `progressDotMouseUp`/`disconnectedCallback` (drag
   * end) — NOT bound for the component's whole connected lifetime. A page can
   * reasonably have many `<r-progress>`, most never dragged (e.g. a list of
   * upload rows); a document-level listener per instance would run its no-op
   * `moveProgress.mouseDown` check on every single pointermove for the entire
   * page for as long as any of them exist. Scoping it to "only while a drag on
   * *this* instance is actually happening" keeps that cost at the number of
   * drags in flight (normally 0 or 1), not the number of progress bars on the
   * page.
   *
   * Pointer Events (not mouse-only) so dragging the dot works with touch —
   * matches `touch-action: none` on `.ran-progress-dot` in index.less, and the
   * `r-player`/`r-colorpicker` pointer-drag idiom documented in CLAUDE.md.
   */
  progressDotMouseDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.moveProgress.mouseDown = true;
    e.stopPropagation();
    this._dragEvents
      .on(document, 'pointermove', this.progressDotMouseMove as EventListener)
      .on(document, 'pointerup', this.progressDotMouseUp as EventListener)
      .on(document, 'pointercancel', this.progressDotMouseUp as EventListener);
  };

  progressDotMouseMove = (e: PointerEvent): void => {
    // `type` can change mid-drag (mousedown while type="drag", then the
    // attribute flips to "primary" before mouseup) — the document listener
    // stays attached until mouseup regardless, so it must re-check here too,
    // not just at drag-start.
    if (!this.moveProgress.mouseDown || this.type !== 'drag') return;
    const rect = this._progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = range(offsetX / this._progress.offsetWidth, 0, 1);
    const newVal = percentage * Number(this.total);
    this.percent = String(newVal);
    this.updateUI(percentage);
    this.change();
  };

  progressDotMouseUp = (): void => {
    this.moveProgress.mouseDown = false;
    this._dragEvents.abort();
  };

  /**
   * Arrow-key seeking for `type="drag"` — the mouse/touch drag path had no
   * keyboard equivalent, so a `role="slider"` with no way to actually operate
   * it from the keyboard. Left/Down and Right/Up step by 1% of `total`
   * (Shift for a 10%-of-total coarse step); Home/End jump to the ends,
   * matching native `<input type="range">`. Key mapping is shared with
   * r-colorpicker's hue/alpha sliders via `sliderStepFromKeydown`.
   */
  progressKeydown = (e: KeyboardEvent): void => {
    if (this.type !== 'drag') return;
    // No `|| 100` fallback here: `this.total` already defaults to '100' when
    // the attribute is absent (see the getter above), so `|| 100` only had an
    // effect when `total="0"` was set on purpose — silently discarding it.
    const total = Number(this.total);
    const next = sliderStepFromKeydown(e, { current: Number(this.percent), min: 0, max: total, step: total / 100 });
    if (next === undefined) return;
    e.preventDefault();
    this.percent = String(next);
    this.updateUI(next / total);
    this.change();
  };

  /**
   * role + aria-value* live on the host (the focusable element) rather than
   * the shadow-internal `.ran-progress` div — a screen reader needs both on
   * the same accessible node. `progressbar` is read-only semantics; `drag`
   * is operable, so it gets `slider` plus the tab stop that makes the
   * existing keyboard/mouse handlers reachable in the first place.
   */
  syncA11y = (): void => {
    const isDrag = this.type === 'drag';
    this.setAttribute('role', isDrag ? 'slider' : 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', this.total);
    // The `percent` *property* setter also writes this, but declarative
    // markup (`<r-progress percent="42">`) or `setAttribute('percent', …)`
    // never goes through that setter — without this, a screen reader saw a
    // slider/progressbar with a min and max but no current value.
    this.setAttribute('aria-valuenow', this.percent);
    if (isDrag) {
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
        this._tabIndexOwnedByComponent = true;
      }
    } else if (this._tabIndexOwnedByComponent) {
      // Switching away from "drag" makes the element non-operable again
      // (progressKeydown/progressClick/progressDotMouseMove all early-return
      // once type !== 'drag') — leaving tabindex="0" behind would tab-stop a
      // keyboard user into a slider that does nothing.
      this.removeAttribute('tabindex');
      this._tabIndexOwnedByComponent = false;
    }
  };

  updateUI = (percentage: number): void => {
    this.style.setProperty('--progress-percent', String(percentage));
  };

  _preSerialize(): void {
    const percent = parsePercentLike(this.getAttribute('percent') || '0');
    const total = parsePercentLike(this.getAttribute('total') || '100');
    const fraction = range(percent / total, 0, 1);
    this.style.setProperty('--progress-percent', String(fraction));
  }

  change = (): void => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.percent,
          percent: this.percent,
          total: this.total,
        },
      }),
    );
  };

  appendProgressDot = (): void => {
    if (!this._progress || !this._progressDot) return;
    // The dot is a drag handle — only meaningful for the interactive `drag`
    // type. On a plain progress bar it renders as an orphaned, non-interactive
    // marker, so keep it out unless the bar is actually draggable.
    const shouldShow = this.dot === 'true' && this.type === 'drag';
    if (shouldShow && !this._progress.contains(this._progressDot)) {
      this._progress.appendChild(this._progressDot);
    }
    if (!shouldShow && this._progress.contains(this._progressDot)) {
      this._progress.removeChild(this._progressDot);
    }
  };

  updateCurrentProgress = (): void => {
    if (!this._progress) return;
    const total = Number(this.total);
    const percent = Number(this.percent) / total;
    this.updateUI(percent);
  };

  /**
   * Bound once, unconditionally, from `connectedCallback` — NOT re-run when
   * `type` changes later. Gating the *binding* on `this.type === 'drag'` (as
   * this used to) meant a `<r-progress>` created as `primary` and switched to
   * `drag` afterwards got `syncA11y`'s role="slider"/tabIndex (which does
   * re-run on attribute change) without ever getting click/drag/keyboard
   * listeners — a slider that claims to be operable and silently isn't. Each
   * handler below already re-checks `this.type` itself, so binding
   * unconditionally here is safe and keeps behavior in sync with the type
   * actually in effect at interaction time, not at connect time.
   */
  dragEvent = (): void => {
    // Click and keydown are cheap and rarely fire, so binding them
    // unconditionally is fine — the `document` mousemove/mouseup pair is not
    // (see `progressDotMouseDown`) and is deliberately not bound here.
    this._events
      .on(this._progress, 'click', this.progressClick)
      .on(this._progressDot, 'pointerdown', this.progressDotMouseDown)
      .on(this, 'keydown', this.progressKeydown as EventListener);
  };

  private resize = (): void => {
    this.updateCurrentProgress();
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'primary');
    }
    this.dragEvent();
    this.updateCurrentProgress();
    this.appendProgressDot();
    this.syncA11y();
    this._events.on(window, 'resize', this.resize);
  }

  disconnectedCallback(): void {
    this._events.abort();
    // In case the element is removed mid-drag (mouse still down) — `_dragEvents`
    // is a separate EventManager (see progressDotMouseDown) so `_events.abort()`
    // above doesn't reach it. `.abort()` is safe to call even if no drag is
    // currently in flight (no listeners registered).
    this._dragEvents.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'dot' || name === 'type') this.appendProgressDot();
    if (name === 'percent' || name === 'total') this.updateCurrentProgress();
    if (name === 'type' || name === 'total' || name === 'percent') this.syncA11y();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-progress', Progress as unknown as new () => HTMLElement);
export default Progress;
