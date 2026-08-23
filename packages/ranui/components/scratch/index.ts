import scratchCss from './index.less?inline';
import { createRef, Div, EventManager, Slot, View } from '@/utils/builder';
import { RanElement, isDisabled } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';

/** Auto-reveals the rest once this fraction of the canvas has been stroked over — a
 * common scratch-card UX (scratch a bit, the reveal completes on its own) rather than
 * requiring the whole cover to be manually cleared pixel-by-pixel. */
const AUTO_REVEAL_THRESHOLD = 0.35;

class ScratchTicket extends RanElement {
  scratchTicketContainer: HTMLDivElement;
  scratchTicket: HTMLCanvasElement;
  state: {
    isScratching: boolean;
    scratchedArea: number;
    lastX: number;
    lastY: number;
    /** The one pointer currently driving the scratch — see `onScratchPointerDown`. */
    activePointerId?: number;
  };
  scratchAward: HTMLDivElement;
  _shadowDom: ShadowRoot;
  _events = new EventManager();
  // `icon`/`effect`/`iconSize` used to be observed here with nothing reading them —
  // reveal content is arbitrary (a prize amount, an image, an <r-icon>, several
  // elements), not a single named icon, so it belongs in the default slot below
  // rather than a narrow name+size attribute pair. See docs/src/ranui/scratch.
  static get observedAttributes(): string[] {
    return ['disabled', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, scratchCss);
    const scratchTicket = View('canvas')
      .class('ran-scratch-ticket-canvas')
      .style('width', '100%')
      .style('height', '100%')
      .build() as HTMLCanvasElement;
    // Default slot: whatever the consumer puts under <r-scratch> is the reveal
    // content, projected here so it renders underneath the scratch cover.
    const scratchAward = Div()
      .class('ran-scratch-ticket-award')
      .part('award')
      .children(Slot())
      .build() as HTMLDivElement;
    const scratchTicketContainer = Div()
      .class('ran-scratch-ticket')
      .children(scratchTicket, scratchAward)
      .build() as HTMLDivElement;
    this._shadowDom.appendChild(scratchTicketContainer);

    this.scratchTicketContainer = scratchTicketContainer;
    this.scratchAward = scratchAward;
    this.scratchTicket = scratchTicket;

    this.state = {
      isScratching: false,
      scratchedArea: 0,
      lastX: 0,
      lastY: 0,
      activePointerId: undefined,
    };
  }
  get disabled(): boolean {
    return isDisabled(this);
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
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
  syncDisabled = (): void => {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  };
  /**
   * Radius (canvas-space px) of the "coin" doing the scratching — scaled to the
   * canvas's own resolution so it reads as the same relative size regardless of
   * the element's actual display size or devicePixelRatio.
   */
  private brushRadius = (): number => {
    return Math.max(14, Math.min(this.scratchTicket.width, this.scratchTicket.height) * 0.09);
  };
  /** Maps a pointer event's viewport coordinates onto the canvas's own drawing-buffer
   * coordinate space — the two can differ (CSS size vs. canvas resolution / devicePixelRatio),
   * so a raw `clientX - rect.left` would scratch the wrong spot on anything but a 1:1 canvas. */
  private toCanvasPoint = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = this.scratchTicket.getBoundingClientRect();
    const scaleX = rect.width > 0 ? this.scratchTicket.width / rect.width : 1;
    const scaleY = rect.height > 0 ? this.scratchTicket.height / rect.height : 1;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };
  /**
   * Erases a stroke from `(fromX, fromY)` to `(toX, toY)` — a connected line, not an
   * isolated dab, so a fast drag reveals a continuous trail instead of a dotted one.
   * `scratchedArea` approximates the stroked rectangle (`length × brush diameter`); it's
   * a coarse heuristic (not an actual transparent-pixel count) but is honest about how
   * much the user has actually swept, unlike a flat per-event increment.
   */
  private scratchStroke = (fromX: number, fromY: number, toX: number, toY: number): void => {
    const ctx = this.scratchTicket.getContext('2d');
    if (!ctx) return;
    const radius = this.brushRadius();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    const distance = Math.max(Math.hypot(toX - fromX, toY - fromY), 1);
    this.state.scratchedArea += distance * radius * 2;
  };
  /**
   * Pointer Events unify mouse/touch/pen — one code path scratches on both desktop and
   * mobile — but "unify" doesn't mean "identical", so a few device-specific guards:
   *
   * - **Mouse**: `pointerdown` fires for *every* button, not just the primary one — a
   *   right-click-drag (e.g. opening a browser context-menu gesture) or a middle-click
   *   shouldn't scratch. `e.button !== 0` on a mouse pointer bails out before arming.
   * - **Touch**: a second finger touching mid-scratch fires a *second* `pointerdown`
   *   with a different `pointerId`, while the first finger may still be down. Without
   *   tracking which pointer is actually driving the stroke, that second touch would
   *   silently take over `lastX`/`lastY`, so `pointermove`s from *either* finger jump
   *   between two unrelated positions. `activePointerId` pins the interaction to
   *   whichever pointer started it; every other pointer's events are ignored until it
   *   ends (`pointerup`/`pointercancel`/`lostpointercapture`).
   */
  onScratchPointerDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    if (this.state.isScratching) return; // a second touch/pointer mid-stroke — ignore it
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Stops the page from scrolling under a touch drag on the scratch surface, and
    // (per the Pointer Events spec) suppresses the synthetic compatibility `click`/
    // `mouse*` events a touch would otherwise also fire.
    e.preventDefault();
    this.state.isScratching = true;
    this.state.activePointerId = e.pointerId;
    this.scratchTicket.setPointerCapture?.(e.pointerId);
    const { x, y } = this.toCanvasPoint(e.clientX, e.clientY);
    this.state.lastX = x;
    this.state.lastY = y;
    // A tap with no drag should still reveal a dab at that point, not nothing.
    this.scratchStroke(x, y, x, y);
  };
  onScratchPointerMove = (e: PointerEvent): void => {
    if (this.disabled || !this.state.isScratching) return;
    if (e.pointerId !== this.state.activePointerId) return;
    const { x, y } = this.toCanvasPoint(e.clientX, e.clientY);
    this.scratchStroke(this.state.lastX, this.state.lastY, x, y);
    this.state.lastX = x;
    this.state.lastY = y;
  };
  onScratchPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.state.activePointerId) return;
    this.state.isScratching = false;
    this.state.activePointerId = undefined;
    if (this.disabled) return;
    const { width, height } = this.scratchTicket;
    const ctx = this.scratchTicket.getContext('2d');
    if (!ctx) return;
    if (this.state.scratchedArea > width * height * AUTO_REVEAL_THRESHOLD) {
      this.state.scratchedArea = 0;
      ctx.clearRect(0, 0, width, height);
    }
  };
  drawScratchTicket = (): void => {
    const ctx = this.scratchTicket.getContext('2d');
    if (!this.scratchTicketContainer || !ctx) return;
    const { width, height } = this.scratchTicket;
    const coverColor = getComputedStyle(this).getPropertyValue('--ran-scratch-cover-background').trim();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = coverColor || '#6b6b6b';
    ctx.fillRect(0, 0, width, height);
  };
  /**
   * Matches the canvas's internal drawing-buffer resolution to its actual rendered
   * CSS size (× devicePixelRatio for crisp strokes on HiDPI screens) instead of the
   * browser's fixed 300×150 default. Without this, `toCanvasPoint` still maps pointer
   * coordinates correctly (it accounts for whatever scale is in effect), but the cover
   * itself renders soft/blurry once CSS stretches a 300×150 buffer to the element's
   * real size — and resetting the buffer always clears prior scratch progress, which
   * is the correct behavior for a real resize (e.g. an orientation change).
   */
  syncCanvasResolution = (): void => {
    const rect = this.scratchTicketContainer.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (this.scratchTicket.width === width && this.scratchTicket.height === height) return;
    this.scratchTicket.width = width;
    this.scratchTicket.height = height;
    this.state.scratchedArea = 0;
    this.drawScratchTicket();
  };
  private onWindowResize = (): void => {
    this.syncCanvasResolution();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.syncDisabled();
    this._events
      .on(this.scratchTicket, 'pointerdown', this.onScratchPointerDown as EventListener, { passive: false })
      .on(this.scratchTicket, 'pointermove', this.onScratchPointerMove as EventListener)
      .on(this.scratchTicket, 'pointerup', this.onScratchPointerUp as EventListener)
      .on(this.scratchTicket, 'pointercancel', this.onScratchPointerUp as EventListener)
      // A device/OS can reclaim pointer capture mid-gesture without ever firing
      // `pointerup` (seen on some Android WebViews when a system gesture — e.g. the
      // back-swipe edge — interrupts it). Without this, `isScratching` sticks `true`
      // forever and the *next* unrelated pointer motion silently keeps scratching.
      .on(this.scratchTicket, 'lostpointercapture', this.onScratchPointerUp as EventListener)
      .on(window, 'resize', this.onWindowResize);
    this.syncCanvasResolution();
  }
  disconnectedCallback(): void {
    this._events.abort();
  }
  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'disabled') this.syncDisabled();
    if (name === 'sheet') this.handlerExternalCss();
    this.drawScratchTicket();
  }
}

export default ScratchTicket;

defineSSR('r-scratch', ScratchTicket as unknown as new () => HTMLElement);
