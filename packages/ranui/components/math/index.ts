import { RanElement } from '@/utils/index';
import { createRef, Div, EventManager, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
// Registers <r-icon>; the opt-in toolbar's <r-icon name="copy"> resolves its SVG via
// r-icon's own name-driven lazy loading, no local registration. The heavy bits (temml,
// fonts) stay lazy below.
import '@/components/icon';
import mathCss from './index.less?inline';
// Temml's MathML stylesheet, trimmed & self-contained. Shipped alongside the component
// styles so the native <math> output is spaced/positioned correctly inside the (closed)
// shadow root.
import temmlCss from './temml.css?inline';
import { defineSSR } from '@/utils/ssr-registry';

// Bundled math fonts make <r-math> render identically on every OS / browser (rather than
// depending on a system math font). `latinmodernmath` is the main face (Computer-Modern /
// LaTeX look, GUST/LPPL); `Temml.woff2` covers \mathscr + prime glyphs (MIT). See
// assets/fonts/LICENSE.md.
//
// They are imported *dynamically* (like the temml lib) so the ~388 KB face lands in its
// own lazy chunk fetched only on first render — never eagerly bundled into the barrel for
// consumers who `import 'ranui'` but never use <r-math>. `font="system"` skips them
// entirely and falls through to the system-font stack in temml.css.
//
// Chromium ignores @font-face declared inside a shadow root, so the faces are registered
// once at the document level (a harmless side effect — the family names are only ever
// referenced by <r-math>'s own MathML). Idempotent across every <r-math> instance.
const MATH_FONTS_STYLE_ID = 'ran-math-fonts';
// A memoized promise, not a boolean "already requested" flag: a boolean guard would make every
// call *after* the first return an instantly-resolved no-op promise, even while the first call's
// actual font import + style insertion is still in flight — a caller racing a fresh <r-math>
// against an in-progress one (or `render()` firing twice back-to-back, once via the `latex`
// attribute's own auto-render and once from an explicit manual call) would see its `await`
// resolve before the fonts were actually ready. Caching the promise itself means every caller,
// first or Nth, awaits the *same* real completion.
let mathFontsPromise: Promise<void> | undefined;
const ensureMathFonts = (): Promise<void> => {
  if (typeof document === 'undefined') return Promise.resolve();
  if (!mathFontsPromise) {
    mathFontsPromise = (async () => {
      const [{ default: latinModernMathFont }, { default: temmlScriptFont }] = await Promise.all([
        import('@/assets/fonts/latinmodernmath.woff2?inline'),
        import('@/assets/fonts/Temml.woff2?inline'),
      ]);
      if (document.getElementById(MATH_FONTS_STYLE_ID)) return;
      const style = document.createElement('style');
      style.id = MATH_FONTS_STYLE_ID;
      style.textContent =
        `@font-face{font-family:'Latin Modern Math';src:url(${latinModernMathFont}) format('woff2');font-weight:normal;font-style:normal;font-display:swap;}` +
        `@font-face{font-family:'Temml';src:url(${temmlScriptFont}) format('woff2');font-weight:normal;font-style:normal;font-display:swap;}`;
      (document.head || document.documentElement).appendChild(style);
    })();
  }
  return mathFontsPromise;
};

export class Math extends RanElement {
  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _wrap: HTMLElement;
  contain: HTMLElement;
  _toolbar: HTMLElement;
  _copyResetTimer?: number;
  _downloadMenu?: HTMLElement;
  // The lazy temml + font-face imports inside render() are deliberately
  // fire-and-forget for callers — but tests need a way to know when a render
  // has actually landed, rather than guessing with a fixed sleep (that raced
  // and flaked in CI on a slower runner). Same idiom as r-loading/r-icon's
  // `_pending` for their own lazy variant loads.
  _pending?: Promise<void>;
  static get observedAttributes(): string[] {
    return ['latex', 'display', 'font', 'macros', 'wrap', 'copy', 'download', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, `${mathCss}\n${temmlCss}`);
    const containRef = createRef<HTMLDivElement>();
    const toolbarRef = createRef<HTMLDivElement>();
    const mathRef = createRef<HTMLElement>();
    const iconRef = createRef<HTMLElement>();
    this._wrap = Div()
      .class('ran-math')
      .part('math')
      .children(
        Div().class('ran-math-render').ref(containRef).part('render'),
        Div().class('ran-math-toolbar').ref(toolbarRef).part('toolbar'),
      )
      .build();
    this._shadowDom.appendChild(this._wrap);
    this.contain = shadowPart(containRef, 'render');
    this._toolbar = shadowPart(toolbarRef, 'toolbar');
  }
  // ── Accessors ─────────────────────────────────────────────────────────────
  // Source: URI-encoded `latex` attribute (so `{`, `\`, newlines survive HTML
  // parsing) or, when the attribute is absent, the element's text content.
  get latex(): string {
    const attr = getStringAttribute(this, 'latex');
    if (attr) {
      try {
        return decodeURIComponent(attr);
      } catch {
        return attr;
      }
    }
    return (this.textContent || '').trim();
  }
  set latex(value: string) {
    setStringAttribute(this, 'latex', encodeURIComponent(value));
  }
  get display(): string {
    return getStringAttribute(this, 'display') || 'block';
  }
  set display(value: string) {
    setStringAttribute(this, 'display', value);
  }
  get font(): string {
    return getStringAttribute(this, 'font');
  }
  set font(value: string) {
    setStringAttribute(this, 'font', value);
  }
  // Temml `macros` — a JSON object of `{ "\\name": "expansion" }`. Invalid JSON is ignored.
  get macros(): Record<string, string> | undefined {
    const raw = getStringAttribute(this, 'macros');
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  set macros(value: Record<string, string> | string | undefined) {
    setStringAttribute(this, 'macros', typeof value === 'string' ? value : value ? JSON.stringify(value) : null);
  }
  // Temml `wrap` — soft line-breaking: 'none' | 'tex' | '='. Anything else → temml default.
  get wrap(): 'none' | 'tex' | '=' | undefined {
    const v = getStringAttribute(this, 'wrap');
    return v === 'none' || v === 'tex' || v === '=' ? v : undefined;
  }
  set wrap(value: string) {
    setStringAttribute(this, 'wrap', value);
  }
  get copyable(): boolean {
    return this.hasAttribute('copy');
  }
  set copyable(v: boolean) {
    setBooleanAttribute(this, 'copy', v);
  }
  // What the copy button copies: `copy` / `copy="source"` → LaTeX source; `copy="mathml"`
  // → the rendered MathML markup (Temml emits no SVG — MathML is the portable vector form).
  get copyTarget(): 'source' | 'mathml' {
    return getStringAttribute(this, 'copy') === 'mathml' ? 'mathml' : 'source';
  }
  get downloadable(): boolean {
    return this.hasAttribute('download');
  }
  set downloadable(v: boolean) {
    setBooleanAttribute(this, 'download', v);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  private label(key: string, fallback: string): string {
    return getStringAttribute(this, `label-${key}`) || fallback;
  }
  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  private showError(message: string): void {
    this.contain.innerHTML = '';
    const pre = View('pre').class('ran-math-error').part('error').build();
    pre.textContent = message;
    this.contain.appendChild(pre);
    this._toolbar.innerHTML = '';
    this._wrap.classList.remove('has-controls');
    this.emit('error', { message });
  }
  // ── Rendering ─────────────────────────────────────────────────────────────
  render(): void {
    const latex = this.latex;
    if (!latex) {
      this.contain.innerHTML = '';
      this._toolbar.innerHTML = '';
      this._wrap.classList.remove('has-controls');
      this._pending = undefined;
      return;
    }
    // Fire-and-forget *for callers* — render() itself stays synchronous/void, matching the
    // attribute-driven components elsewhere in this library. `_pending` tracks the same work
    // internally so a test (or any code that genuinely needs to know when a render has landed,
    // rather than merely triggering one) can await it instead of guessing with a timer.
    const fontPromise = this.font !== 'system' ? ensureMathFonts().catch(() => {}) : Promise.resolve();
    // The MathML renders immediately with the fallback stack and swaps to Latin Modern when
    // the lazy font resolves (font-display: swap) — rendering itself never waits on fontPromise,
    // only `_pending` (the test-observable signal) does. A font-load failure must not break rendering.
    const renderPromise = import('temml')
      .then(({ default: temml }) => {
        try {
          // `annotate` embeds <annotation encoding="application/x-tex"> so the source
          // is copyable and available to assistive tech; native MathML handles the rest.
          const options: Record<string, unknown> = {
            displayMode: this.display !== 'inline',
            throwOnError: true,
            annotate: true,
          };
          const macros = this.macros;
          if (macros) options.macros = macros;
          const wrap = this.wrap;
          if (wrap) options.wrap = wrap;
          this.contain.innerHTML = temml.renderToString(latex, options);
          this.buildToolbar();
          this.emit('render', { ok: true });
        } catch (err) {
          this.showError(String((err as Error)?.message || err));
        }
      })
      .catch((err: Error) => this.showError(err.message));
    this._pending = Promise.all([fontPromise, renderPromise]).then(() => undefined);
  }
  // ── Toolbar (opt-in) ──────────────────────────────────────────────────────
  private iconButton(icon: string, label: string, onClick: () => void): HTMLButtonElement {
    const btn = View('button')
      .class('ran-math-btn')
      .part('button')
      .attr('type', 'button')
      .attr('aria-label', label)
      .attr('title', label)
      .children(View('r-icon').attr('name', icon).attr('size', '16').attr('color', 'currentColor'))
      .build() as HTMLButtonElement;
    this._events.on(btn, 'click', onClick);
    return btn;
  }
  private buildToolbar(): void {
    this.closeDownloadMenu();
    this._toolbar.innerHTML = '';
    const buttons: HTMLElement[] = [];
    if (this.copyable) {
      const label = this.copyTarget === 'mathml' ? 'Copy MathML' : 'Copy LaTeX';
      buttons.push(this.iconButton('copy', this.label('copy', label), this.copyContent));
    }
    if (this.downloadable)
      buttons.push(this.iconButton('download', this.label('download', 'Download'), this.onDownload));
    buttons.forEach((b) => this._toolbar.appendChild(b));
    this._wrap.classList.toggle('has-controls', buttons.length > 0);
  }
  private currentMathML(): string {
    const math = this.contain.querySelector('math');
    return math ? math.outerHTML : '';
  }
  // Copy the source (default) or the rendered MathML, per the `copy` attribute value.
  private copyContent = (): void => {
    const target = this.copyTarget;
    const text = target === 'mathml' ? this.currentMathML() : this.latex;
    if (!text || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      this.emit('copied', { kind: target });
      const icon = this._toolbar.querySelector('r-icon[name="copy"]');
      if (icon) {
        icon.setAttribute('name', 'check');
        window.clearTimeout(this._copyResetTimer);
        this._copyResetTimer = window.setTimeout(() => icon.setAttribute('name', 'copy'), 1200);
      }
    });
  };
  // ── Download (opt-in) — source (.tex) / MathML (.mml) ─────────────────────
  // `download` (bare) offers both via a menu; restrict with `download="mathml"` or
  // `download="mathml source"`. A single format downloads directly.
  private downloadFormats(): string[] {
    const v = getStringAttribute(this, 'download').trim();
    const list = v ? v.split(/\s+/) : ['source', 'mathml'];
    return list.filter((f) => f === 'source' || f === 'mathml');
  }
  private onDownload = (): void => {
    const formats = this.downloadFormats();
    if (formats.length <= 1) this.triggerDownload(formats[0] || 'mathml');
    else this.toggleDownloadMenu();
  };
  private triggerDownload(format: string): void {
    if (format === 'source') this.downloadSource();
    else this.downloadMathML();
  }
  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  private downloadSource(): void {
    const source = this.latex;
    if (!source) return;
    this.saveBlob(new Blob([source], { type: 'application/x-tex;charset=utf-8' }), 'formula.tex');
    this.emit('download', { format: 'source' });
  }
  private downloadMathML(): void {
    const mml = this.currentMathML();
    if (!mml) return;
    this.saveBlob(
      new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${mml}`], { type: 'application/mathml+xml;charset=utf-8' }),
      'formula.mml',
    );
    this.emit('download', { format: 'mathml' });
  }
  private toggleDownloadMenu(): void {
    if (this._downloadMenu) {
      this.closeDownloadMenu();
      return;
    }
    const menu = Div().class('ran-math-menu').part('menu').build();
    const names: Record<string, string> = {
      source: this.label('download-source', 'Source (.tex)'),
      mathml: this.label('download-mathml', 'MathML (.mml)'),
    };
    this.downloadFormats().forEach((fmt) => {
      const item = View('button').class('ran-math-menu-item').attr('type', 'button').build();
      item.textContent = names[fmt] || fmt;
      this._events.on(item, 'click', () => {
        this.triggerDownload(fmt);
        this.closeDownloadMenu();
      });
      menu.appendChild(item);
    });
    this._wrap.appendChild(menu);
    this._downloadMenu = menu;
  }
  private closeDownloadMenu = (): void => {
    this._downloadMenu?.remove();
    this._downloadMenu = undefined;
  };
  // ── Lifecycle ─────────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this.render();
    // Close the download menu when the pointer leaves (the toolbar hides too).
    this._events.on(this._wrap, 'mouseleave', this.closeDownloadMenu);
  }
  disconnectedCallback(): void {
    this._events.abort();
    window.clearTimeout(this._copyResetTimer);
    this.closeDownloadMenu();
  }
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
    if (o === n) return;
    if (k === 'latex' || k === 'display' || k === 'font' || k === 'macros' || k === 'wrap') this.render();
    else if (k === 'copy' || k === 'download') this.buildToolbar();
    else if (k === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-math', Math as unknown as new () => HTMLElement);
export default Math;
