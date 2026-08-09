import glassCss from './index.less?inline';
import { Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowElement, ensureShadowRoot, getStringAttribute, setStringAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { isActivationKey } from '@/utils/a11y';
import { createRimRenderer, type RimRenderer } from './rim';

let _glassSeq = 0;

/**
 * `r-glass` — a liquid / frosted glass surface.
 *
 * Frosts and refracts whatever is behind it: `backdrop-filter` blur + saturate
 * for the frost, an SVG `feDisplacementMap` (strength = `displace`) for the
 * liquid light-bending, plus a specular rim/highlight. All visual knobs are
 * exposed as attributes and `--ran-glass-*` tokens; content goes in the default
 * slot. Parts: `glass` (the pane), `specular` (the highlight layer).
 *
 * Backdrop note: this samples the DOM behind the host — the portable technique.
 * A full WebGL/WebGPU shader path that rasterizes the *backdrop itself* into a
 * texture would look more "liquid" and work identically across browsers, but
 * costs the backdrop's interactivity/accessibility (buttons, selectable text,
 * live video behind the glass all become a flat pixel buffer) and a much
 * heavier bundle — deliberately not pursued here.
 *
 * `rim` is the middle ground: an opt-in WebGL layer (see `rim.ts`) that adds a
 * more physically-lit specular edge + chromatic fringe, computed purely from
 * the panel's own shape (never the backdrop), so it costs none of that.
 */
export class Glass extends RanElement {
  _shadowDom!: ShadowRoot;
  private _glass!: HTMLElement;
  private _turb: SVGElement | null = null;
  private _disp: SVGElement | null = null;
  private _uid = `ran-glass-${(_glassSeq += 1)}`;
  private _events = new EventManager();
  // Tracks whether *this component* put tabindex="0" on, so _syncInteractive
  // can take it back off when `interactive` is removed — without leaking into
  // a tabindex a consumer set explicitly themselves (mirrors r-progress's
  // syncA11y for the same reason: `type="drag"` there, `interactive` here).
  private _tabIndexOwnedByComponent = false;
  private _rimCanvas: HTMLCanvasElement | null = null;
  private _rimRenderer: RimRenderer | null = null;
  private _rimResizeObserver: ResizeObserver | null = null;

  static get observedAttributes(): string[] {
    return ['blur', 'saturate', 'displace', 'frequency', 'radius', 'tint', 'interactive', 'rim'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, glassCss);
    this._glass = ensureShadowElement(this._shadowDom, '.ran-glass', () =>
      Div()
        .class('ran-glass')
        .attr('part', 'glass')
        .children(Div().class('ran-glass-specular').attr('part', 'specular'), Slot())
        .build(),
    );
  }

  // ── Accessors ──────────────────────────────────────────────────────────────
  // Note: `blur` is exposed only as an ATTRIBUTE (`blur="16"`), not a JS
  // accessor — a `blur` property would shadow the native HTMLElement.blur()
  // method. Set it with setAttribute('blur', …) or in markup.

  /** Backdrop saturation, as a percentage number (e.g. `180`). */
  get saturate(): string {
    return getStringAttribute(this, 'saturate');
  }
  set saturate(v: string) {
    setStringAttribute(this, 'saturate', v);
  }

  /** Liquid refraction strength — the SVG displacement scale. `0` is a flat pane. */
  get displace(): string {
    return getStringAttribute(this, 'displace');
  }
  set displace(v: string) {
    setStringAttribute(this, 'displace', v);
  }

  /** Turbulence base frequency — smaller = larger, smoother liquid ripples. */
  get frequency(): string {
    return getStringAttribute(this, 'frequency');
  }
  set frequency(v: string) {
    setStringAttribute(this, 'frequency', v);
  }

  /** Corner radius, in px. */
  get radius(): string {
    return getStringAttribute(this, 'radius');
  }
  set radius(v: string) {
    setStringAttribute(this, 'radius', v);
  }

  /** Glass fill tint (any CSS background value). */
  get tint(): string {
    return getStringAttribute(this, 'tint');
  }
  set tint(v: string) {
    setStringAttribute(this, 'tint', v);
  }

  /** Animated specular sweep across the surface. */
  get sheen(): boolean {
    return this.hasAttribute('sheen');
  }
  set sheen(v: boolean) {
    this.toggleAttribute('sheen', v);
  }

  /**
   * Hover lift + press-scale feedback, for clickable glass. Also makes the host
   * a keyboard-operable button: `role="button"`, a tab stop (unless the consumer
   * already set one), and Enter/Space dispatch a click — see `_syncInteractive`/
   * `_onKeydown`.
   */
  get interactive(): boolean {
    return this.hasAttribute('interactive');
  }
  set interactive(v: boolean) {
    this.toggleAttribute('interactive', v);
  }

  /**
   * Opt-in WebGL specular rim + chromatic edge, lit from a fixed top-left light —
   * shape-only, never samples the backdrop (see the class doc for why that's the
   * point). Silently falls back to the plain CSS specular gradient when WebGL is
   * unavailable (old browser, disabled, SSR). See `rim.ts`.
   */
  get rim(): boolean {
    return this.hasAttribute('rim');
  }
  set rim(v: boolean) {
    this.toggleAttribute('rim', v);
  }

  // ── Internal ─────────────────────────────────────────────────────────────

  /** Inject the per-instance SVG displacement filter (client only, once). */
  private _ensureFilter(): void {
    if (this._disp || typeof document === 'undefined') return;
    if (!this._shadowDom.querySelector('.ran-glass-defs')) {
      const holder = document.createElement('div');
      holder.className = 'ran-glass-defs';
      holder.setAttribute('aria-hidden', 'true');
      // Unique id so backdrop-filter url() resolves to THIS instance's filter.
      // Defaults tuned for the iOS frosted look: low displacement + smooth,
      // low-frequency noise, so the surface reads as clean glass, not a wave.
      holder.innerHTML = `<svg><filter id="${this._uid}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="2" seed="7" result="n"/><feGaussianBlur in="n" stdDeviation="2" result="sn"/><feDisplacementMap in="SourceGraphic" in2="sn" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`;
      this._shadowDom.insertBefore(holder, this._shadowDom.firstChild);
      this.style.setProperty('--ran-glass-refraction', `url(#${this._uid})`);
    }
    this._turb = this._shadowDom.querySelector('feTurbulence');
    this._disp = this._shadowDom.querySelector('feDisplacementMap');
  }

  /**
   * Lazily create the WebGL rim canvas + context — only while `rim` is set, so a
   * page that never uses it never spends one of the browser's limited WebGL
   * context slots. Kept alive (not torn down) across disconnect/reconnect, same
   * as the SVG displacement filter above; only `_teardownRim` frees it, when
   * `rim` is explicitly turned back off.
   */
  private _ensureRim(): void {
    if (typeof document === 'undefined') return;
    if (!this._rimCanvas) {
      const canvas = document.createElement('canvas');
      canvas.className = 'ran-glass-rim';
      canvas.setAttribute('part', 'rim');
      canvas.setAttribute('aria-hidden', 'true');
      this._glass.querySelector('.ran-glass-specular')?.appendChild(canvas);
      this._rimCanvas = canvas;
      // null when WebGL is unavailable — the blank transparent canvas is then a
      // harmless no-op and the plain CSS specular gradient is the only highlight.
      this._rimRenderer = createRimRenderer(canvas);
      if (this._rimRenderer && typeof ResizeObserver !== 'undefined') {
        this._rimResizeObserver = new ResizeObserver(this._resizeRim);
        this._rimResizeObserver.observe(this._glass);
      }
    }
    this._resizeRim();
    this._rimRenderer?.setRadius(Number(this.radius) || 20);
  }

  private _resizeRim = (): void => {
    if (!this._rimRenderer) return;
    const { width, height } = this._glass.getBoundingClientRect();
    this._rimRenderer.resize(width, height);
  };

  private _teardownRim(): void {
    this._rimResizeObserver?.disconnect();
    this._rimResizeObserver = null;
    this._rimRenderer?.destroy();
    this._rimRenderer = null;
    this._rimCanvas?.remove();
    this._rimCanvas = null;
  }

  private _apply(name: string): void {
    const v = this.getAttribute(name);
    switch (name) {
      case 'blur':
        this._setVar('--ran-glass-blur', v, 'px');
        break;
      case 'saturate':
        this._setVar('--ran-glass-saturate', v, '%');
        break;
      case 'radius':
        this._setVar('--ran-glass-radius', v, 'px');
        break;
      case 'tint':
        this._setVar('--ran-glass-tint', v);
        break;
      case 'displace':
        this._ensureFilter();
        if (this._disp && v != null) this._disp.setAttribute('scale', v);
        break;
      case 'frequency':
        this._ensureFilter();
        if (this._turb && v != null) this._turb.setAttribute('baseFrequency', v);
        break;
    }
  }

  /** Set a host custom property, appending a unit only when the value is bare-numeric. */
  private _setVar(prop: string, value: string | null, unit = ''): void {
    if (value == null || value === '') {
      this.style.removeProperty(prop);
      return;
    }
    const needsUnit = unit && /^-?\d*\.?\d+$/.test(value.trim());
    this.style.setProperty(prop, needsUnit ? `${value.trim()}${unit}` : value);
  }

  /**
   * `interactive` makes the whole panel a click target (see the `sheen`/hover-lift
   * CSS — "for clickable glass"), so it needs the same keyboard activation a real
   * `<button>` gets for free: Enter/Space act like a click. Mirrors r-button's and
   * r-colorpicker's swatch keydown handler.
   */
  private _onKeydown = (e: KeyboardEvent): void => {
    if (!this.interactive) return;
    if (isActivationKey(e)) {
      e.preventDefault();
      this.click();
    }
  };

  /**
   * role="button" + a tab stop only while `interactive` — a purely decorative
   * glass panel must stay out of the tab order and off the accessibility tree;
   * without this a keyboard/screen-reader user had no way to tell (or reach)
   * that a glass panel was clickable at all.
   */
  private _syncInteractive(): void {
    if (this.interactive) {
      this.setAttribute('role', 'button');
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
        this._tabIndexOwnedByComponent = true;
      }
    } else {
      this.removeAttribute('role');
      if (this._tabIndexOwnedByComponent) {
        this.removeAttribute('tabindex');
        this._tabIndexOwnedByComponent = false;
      }
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback(): void {
    this._ensureFilter();
    Glass.observedAttributes.forEach((n) => this._apply(n));
    this._syncInteractive();
    if (this.rim) this._ensureRim();
    this._events.on(this, 'keydown', this._onKeydown as EventListener);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'interactive') {
      this._syncInteractive();
      return;
    }
    if (name === 'rim') {
      if (this.rim) this._ensureRim();
      else this._teardownRim();
      return;
    }
    this._apply(name);
    if (name === 'radius' && this.rim) this._rimRenderer?.setRadius(Number(this.radius) || 20);
  }
}

defineSSR('r-glass', Glass as unknown as new () => HTMLElement);
export default Glass;
