import glassCss from './index.less?inline';
import { Div, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowElement, ensureShadowRoot, getStringAttribute, setStringAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

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
 * A WebGPU shader path (for refracting a canvas/3D scene) is documented
 * separately and not bundled here, to keep the element lean.
 */
export class Glass extends RanElement {
  _shadowDom!: ShadowRoot;
  private _glass!: HTMLElement;
  private _turb: SVGElement | null = null;
  private _disp: SVGElement | null = null;
  private _uid = `ran-glass-${(_glassSeq += 1)}`;

  static get observedAttributes(): string[] {
    return ['blur', 'saturate', 'displace', 'frequency', 'radius', 'tint'];
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

  /** Hover lift + press-scale feedback (for clickable glass). */
  get interactive(): boolean {
    return this.hasAttribute('interactive');
  }
  set interactive(v: boolean) {
    this.toggleAttribute('interactive', v);
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

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback(): void {
    this._ensureFilter();
    Glass.observedAttributes.forEach((n) => this._apply(n));
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._apply(name);
  }
}

defineSSR('r-glass', Glass as unknown as new () => HTMLElement);
export default Glass;
