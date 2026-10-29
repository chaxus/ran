import glassCss from './index.less?inline';
import { createRef, Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, getStringAttribute, setStringAttribute, shadowPart } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { isActivationKey } from '@/utils/a11y';
import { createRimRenderer, type RimRenderer } from './rim';
import { lensMap } from './lens';
import { createRefraction, type Refraction, type RefractionSource } from './refraction';
import { GLASS_MATERIALS, type GlassMaterial, type GlassOptics, type GlassTone } from './materials';

let _glassSeq = 0;

export { GLASS_MATERIALS, type GlassMaterial, type GlassOptics, type GlassTone } from './materials';

/** Lens maps are smooth, so a coarse one scaled up by `feImage` looks the same and builds far faster. */
const MAP_LIMIT = 384;

/**
 * `r-glass` — a liquid glass surface.
 *
 * Pick a `material` and the pane is done; any of `blur`, `saturate`, `displace`, `bevel`,
 * `dispersion` and `specular` overrides that one value. Two ways to bend light:
 *
 * - **Over anything** (default): `backdrop-filter` frosts what is behind the host, and an SVG
 *   displacement map built from the pane's own shape bends it at the edge like a convex lens,
 *   split per colour channel for `dispersion`. The SVG part renders in Chromium only; other
 *   engines keep the frost.
 * - **Over an image or video** (`backdrop`): a WebGL2 shader samples that element directly and
 *   refracts it per wavelength, in every engine with WebGL2. The element stays in the page, so
 *   it keeps its own semantics; the glass only paints a refracted copy of the part it covers.
 *
 * `rim` adds a GPU-lit edge that depends only on the pane's shape. Content goes in the default
 * slot. Parts: `glass`, `specular`, `rim`, `refraction`.
 */
export class Glass extends RanElement {
  _shadowDom!: ShadowRoot;
  private _glass!: HTMLElement;
  /** The specular layer the rim renderer mounts into. */
  private _specular!: HTMLDivElement;
  /** Holds the refraction canvas, under the specular layer and the content. */
  private _refractionLayer!: HTMLDivElement;
  private _defs: HTMLDivElement | null = null;
  private _uid = `ran-glass-${(_glassSeq += 1)}`;
  private _events = new EventManager();
  // Tracks whether *this component* put tabindex="0" on, so _syncInteractive
  // can take it back off when `interactive` is removed — without leaking into
  // a tabindex a consumer set explicitly themselves (mirrors r-progress's
  // syncA11y for the same reason: `type="drag"` there, `interactive` here).
  private _tabIndexOwnedByComponent = false;
  private _rimRenderer: RimRenderer | null = null;
  private _refraction: Refraction | null = null;
  private _resize: ResizeObserver | null = null;
  /** While `backdrop` is set: finds a source added after the glass, or a new one when it is replaced. */
  private _mutations: MutationObserver | null = null;
  private _lensFrame = 0;
  private _lensKey = '';
  private _lensUrl = '';
  /** The tone the backdrop's own brightness suggests, while `backdrop` drives it. */
  private _measuredTone: GlassTone | null = null;
  /** Publishes the tone in effect as `:state(dark)` / `:state(light)`. */
  private _internals: ElementInternals | null = null;

  static get observedAttributes(): string[] {
    return [
      'material',
      'blur',
      'saturate',
      'displace',
      'bevel',
      'dispersion',
      'specular',
      'radius',
      'tint',
      'tone',
      'interactive',
      'rim',
      'backdrop',
    ];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, glassCss);
    const specularRef = createRef<HTMLDivElement>();
    const refractionRef = createRef<HTMLDivElement>();
    this._glass = Div()
      .class('ran-glass')
      .attr('part', 'glass')
      .children(
        Div().class('ran-glass-refraction').ref(refractionRef).attr('part', 'refraction'),
        Div().class('ran-glass-specular').ref(specularRef).attr('part', 'specular'),
        Slot(),
      )
      .build();
    this._shadowDom.appendChild(this._glass);
    this._specular = shadowPart(specularRef, 'specular layer');
    this._refractionLayer = shadowPart(refractionRef, 'refraction layer');
    this._internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
  }

  // ── Accessors ──────────────────────────────────────────────────────────────
  // Note: `blur` is exposed only as an ATTRIBUTE (`blur="16"`), not a JS
  // accessor — a `blur` property would shadow the native HTMLElement.blur()
  // method. Set it with setAttribute('blur', …) or in markup.

  /** A preset for every optical value: `regular` (default), `thin`, `thick` or `clear`. */
  get material(): string {
    return getStringAttribute(this, 'material');
  }
  set material(v: string) {
    setStringAttribute(this, 'material', v, { removeEmpty: true });
  }

  /** Backdrop saturation, as a percentage number (e.g. `180`). */
  get saturate(): string {
    return getStringAttribute(this, 'saturate');
  }
  set saturate(v: string) {
    setStringAttribute(this, 'saturate', v, { removeEmpty: true });
  }

  /** How far the edge pulls the backdrop inward, in px. `0` is a flat pane. */
  get displace(): string {
    return getStringAttribute(this, 'displace');
  }
  set displace(v: string) {
    setStringAttribute(this, 'displace', v, { removeEmpty: true });
  }

  /** Width of the curved edge band that bends light, in px. */
  get bevel(): string {
    return getStringAttribute(this, 'bevel');
  }
  set bevel(v: string) {
    setStringAttribute(this, 'bevel', v, { removeEmpty: true });
  }

  /** How far the colors split at the edge, as a percentage of `displace`. `0` keeps them together. */
  get dispersion(): string {
    return getStringAttribute(this, 'dispersion');
  }
  set dispersion(v: string) {
    setStringAttribute(this, 'dispersion', v, { removeEmpty: true });
  }

  /** Strength of the highlights, as a percentage (`100` is the material's normal light). */
  get specular(): string {
    return getStringAttribute(this, 'specular');
  }
  set specular(v: string) {
    setStringAttribute(this, 'specular', v, { removeEmpty: true });
  }

  /** Corner radius, in px. */
  get radius(): string {
    return getStringAttribute(this, 'radius');
  }
  set radius(v: string) {
    setStringAttribute(this, 'radius', v, { removeEmpty: true });
  }

  /** Glass fill tint (any CSS background value). */
  get tint(): string {
    return getStringAttribute(this, 'tint');
  }
  set tint(v: string) {
    setStringAttribute(this, 'tint', v, { removeEmpty: true });
  }

  /**
   * What sits behind the glass: `dark` (default) lights the edge, `light` shades it, because a
   * white highlight disappears on a pale backdrop. Left unset over a `backdrop`, it follows the
   * measured brightness of the covered area. The tone in effect is published as
   * `:state(dark)` / `:state(light)`, and sets the content's ink (`--ran-glass-ink`).
   */
  get tone(): string {
    return getStringAttribute(this, 'tone');
  }
  set tone(v: string) {
    setStringAttribute(this, 'tone', v, { removeEmpty: true });
  }

  /**
   * An `<img>` or `<video>` to refract with the WebGL path: a selector, resolved in the host's
   * document or shadow root, or empty for the first image or video in the host's parent.
   */
  get backdrop(): string {
    return getStringAttribute(this, 'backdrop');
  }
  set backdrop(v: string) {
    setStringAttribute(this, 'backdrop', v);
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
   * Opt-in GPU specular rim: an outer and an inner wall line, lit by a key light from the
   * top left and a dim fill from the bottom right, with slow thickness variation and
   * occasional glints. Shape-only, never samples the backdrop. Renders on WebGL first,
   * upgrades to WebGPU in the background when available, and leaves the CSS specular
   * gradient alone when neither exists. See `rim.ts`.
   */
  get rim(): boolean {
    return this.hasAttribute('rim');
  }
  set rim(v: boolean) {
    this.toggleAttribute('rim', v);
  }

  // ── Internal ─────────────────────────────────────────────────────────────

  /** The material's values with any attribute override applied. */
  get optics(): GlassOptics {
    const preset = this._preset;
    const read = (name: keyof GlassOptics): number => {
      const value = Number.parseFloat(this.getAttribute(name) ?? '');
      return Number.isFinite(value) ? Math.max(0, value) : preset[name];
    };
    return {
      blur: read('blur'),
      saturate: read('saturate'),
      displace: read('displace'),
      bevel: read('bevel'),
      dispersion: read('dispersion'),
      specular: read('specular'),
    };
  }

  /** The chosen material's values; `Object.hasOwn` so `material="toString"` is not a material. */
  private get _preset(): (typeof GLASS_MATERIALS)[GlassMaterial] {
    return Object.hasOwn(GLASS_MATERIALS, this.material)
      ? GLASS_MATERIALS[this.material as GlassMaterial]
      : GLASS_MATERIALS.regular;
  }

  private get _radius(): number {
    const value = Number.parseFloat(this.radius);
    return Number.isFinite(value) ? Math.max(0, value) : 20;
  }

  private get _tone(): GlassTone {
    if (this.tone === 'light' || this.tone === 'dark') return this.tone;
    return this._measuredTone ?? 'dark';
  }

  /** Writes every value CSS reads, so the stylesheet never has to know the materials. */
  private _syncStyle(): void {
    const optics = this.optics;
    const preset = this._preset;
    this.style.setProperty('--ran-glass-blur', `${optics.blur}px`);
    this.style.setProperty('--ran-glass-saturate', `${optics.saturate}%`);
    this.style.setProperty('--ran-glass-specular-strength', `${optics.specular / 100}`);
    this._setVar('--ran-glass-radius', this.radius, 'px');
    this._setVar('--ran-glass-tint', this.tint);
    this._setVar('--ran-glass-tint-alpha', preset.tint);
    const tone = this._tone;
    this._glass.dataset.tone = tone;
    const states = this._internals?.states;
    try {
      states?.delete(tone === 'light' ? 'dark' : 'light');
      states?.add(tone);
    } catch {
      // Chromium before 125 accepted only `--`-prefixed names; the ink still follows the tone.
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

  /** Re-renders the SVG lens filter on the next frame; several changes in one frame cost one build. */
  private _scheduleLens = (): void => {
    if (this._lensFrame || typeof requestAnimationFrame === 'undefined') return;
    this._lensFrame = requestAnimationFrame(() => {
      this._lensFrame = 0;
      this._renderLens();
    });
  };

  /**
   * The per-instance SVG filter `backdrop-filter` points at. Its displacement map is drawn
   * from the pane's size, radius and bevel, so it is rebuilt when any of them changes.
   */
  private _renderLens(): void {
    if (typeof document === 'undefined') return;
    if (!this._defs) {
      this._defs = document.createElement('div');
      this._defs.className = 'ran-glass-defs';
      this._defs.setAttribute('aria-hidden', 'true');
      this._shadowDom.insertBefore(this._defs, this._shadowDom.firstChild);
      // Unique id so backdrop-filter url() resolves to THIS instance's filter.
      this.style.setProperty('--ran-glass-refraction', `url(#${this._uid})`);
    }
    // backdrop-filter's filter space is the border box, so the border counts.
    const width = this._glass.offsetWidth;
    const height = this._glass.offsetHeight;
    const { displace, bevel, dispersion } = this.optics;
    const url = width > 0 && height > 0 && displace > 0 ? this._lensImage(width, height, bevel) : '';
    let body = '<feOffset/>';
    if (url) {
      // feDisplacementMap moves a pixel by scale × (map − 0.5); the map spans ±0.5, so the
      // largest pull is scale / 2 and `displace` px needs a scale of twice that.
      const scale = displace * 2;
      const spread = dispersion / 100 / 2;
      const image = `<feImage href="${url}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none" result="lens"/>`;
      const bend = (k: number, result: string): string =>
        `<feDisplacementMap in="SourceGraphic" in2="lens" scale="${(scale * k).toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="${result}"/>`;
      if (spread <= 0) body = image + bend(1, 'out');
      else {
        // Shorter wavelengths bend more: blue gets the largest pull, red the smallest.
        const IDENTITY = ['1 0 0 0 0', '0 1 0 0 0', '0 0 1 0 0'];
        const keep = (channel: number, from: string, result: string): string => {
          const rows = IDENTITY.map((row, i) => (i === channel ? row : '0 0 0 0 0'));
          return `<feColorMatrix in="${from}" type="matrix" values="${rows.join(' ')} 0 0 0 1 0" result="${result}"/>`;
        };
        body =
          image +
          bend(1 - spread, 'dr') +
          bend(1, 'dg') +
          bend(1 + spread, 'db') +
          keep(0, 'dr', 'r') +
          keep(1, 'dg', 'g') +
          keep(2, 'db', 'b') +
          '<feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg"/>' +
          '<feComposite in="rg" in2="b" operator="arithmetic" k2="1" k3="1"/>';
      }
    }
    this._defs.innerHTML =
      `<svg width="0" height="0"><filter id="${this._uid}" x="0" y="0" width="${width || 1}" height="${height || 1}" ` +
      `filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">${body}</filter></svg>`;
  }

  /** The lens map as a data URL, cached until the shape changes. */
  private _lensImage(width: number, height: number, bevel: number): string {
    const key = `${width}x${height}:${this._radius}:${bevel}`;
    if (key === this._lensKey) return this._lensUrl;
    const scale = Math.min(1, MAP_LIMIT / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    if (!context) return '';
    context.putImageData(new ImageData(lensMap(w, h, this._radius * scale, bevel * scale), w, h), 0, 0);
    this._lensKey = key;
    this._lensUrl = canvas.toDataURL();
    return this._lensUrl;
  }

  /**
   * Lazily create the rim renderer — only while `rim` is set, so a page that
   * never uses it never spends one of the browser's limited WebGL/WebGPU
   * context slots. Release it on disconnect; detached panes never allocate a backend.
   */
  private _ensureRim(): void {
    if (!this.isConnected || this._rimRenderer || typeof document === 'undefined') return;
    this._rimRenderer = createRimRenderer(this._specular);
    this._syncRim();
  }

  private _teardownRim(): void {
    this._rimRenderer?.destroy();
    this._rimRenderer = null;
  }

  private _syncRim(): void {
    const { bevel, specular } = this.optics;
    this._rimRenderer?.set({ radius: this._radius, bevel, strength: specular / 100, tone: this._tone });
  }

  /** The element `backdrop` names, or the first image or video beside the host. */
  private _backdropSource(): RefractionSource | null {
    if (!this.hasAttribute('backdrop')) return null;
    const selector = this.backdrop.trim();
    const root = this.getRootNode() as Document | ShadowRoot;
    let found: Element | null = null;
    try {
      found = selector ? root.querySelector(selector) : (this.parentElement?.querySelector('img, video') ?? null);
    } catch {
      return null;
    }
    return found instanceof HTMLImageElement || found instanceof HTMLVideoElement ? found : null;
  }

  private _syncRefraction(): void {
    this._watchBackdrop();
    const source = this.isConnected ? this._backdropSource() : null;
    if (this._refraction && this._refraction.source !== source) this._teardownRefraction();
    if (source && !this._refraction) {
      this._refraction = createRefraction(this._refractionLayer, this._glass, source, {
        onActive: (active) => {
          if (this._glass.hasAttribute('data-refracting') !== active)
            this._glass.toggleAttribute('data-refracting', active);
        },
        onTone: (tone) => {
          this._measuredTone = tone;
          this._syncStyle();
          this._syncRim();
          this._syncRefractionParams();
        },
      });
    }
    this._syncRefractionParams();
  }

  private _watchBackdrop(): void {
    const watching = this.isConnected && this.hasAttribute('backdrop');
    if (!watching) {
      this._mutations?.disconnect();
      this._mutations = null;
      return;
    }
    if (this._mutations || typeof MutationObserver === 'undefined') return;
    this._mutations = new MutationObserver(() => this._syncRefraction());
    this._mutations.observe(this.getRootNode(), { childList: true, subtree: true });
  }

  private _syncRefractionParams(): void {
    this._refraction?.set({ ...this.optics, radius: this._radius, tone: this._tone });
  }

  private _teardownRefraction(): void {
    if (!this.isConnected || !this.hasAttribute('backdrop')) this._watchBackdrop();
    this._refraction?.destroy();
    this._refraction = null;
    this._measuredTone = null;
    this._glass.removeAttribute('data-refracting');
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
    this._syncStyle();
    this._renderLens();
    this._syncInteractive();
    if (this.rim) this._ensureRim();
    this._syncRefraction();
    this._events.on(this, 'keydown', this._onKeydown as EventListener);
    if (typeof ResizeObserver !== 'undefined') {
      this._resize = new ResizeObserver(this._scheduleLens);
      this._resize.observe(this._glass);
    }
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._teardownRim();
    this._teardownRefraction();
    this._resize?.disconnect();
    this._resize = null;
    if (this._lensFrame) cancelAnimationFrame(this._lensFrame);
    this._lensFrame = 0;
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
    this._syncStyle();
    if (!this.isConnected) return;
    if (name === 'backdrop') {
      this._syncRefraction();
      return;
    }
    if (['material', 'displace', 'bevel', 'dispersion', 'radius'].includes(name)) this._scheduleLens();
    this._syncRim();
    this._syncRefractionParams();
  }
}

defineSSR('r-glass', Glass as unknown as new () => HTMLElement);
export default Glass;
