import { RanElement } from '@/utils/index';
import { Div, View, createRef } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  setBooleanAttribute,
  syncSheetAttribute,
} from '@/utils/component';
// Registers <r-icon>; the code-block toolbar's <r-icon name="copy"> etc. resolve their SVG
// via r-icon's own name-driven lazy loading (assets/icons/*.svg), no local registration.
import '@/components/icon';
import markdownCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

type RenderModule = typeof import('./render');

interface BlockState {
  /** The block's diff key (source + the document's link definitions). */
  key: string;
  incomplete: boolean;
  el: HTMLElement;
  /** Embedded renderers in this block whose theme follows the host. */
  themed: HTMLElement[];
}

/** File extensions for the code-block download button (fence language → extension). */
const EXTENSIONS: Record<string, string> = {
  javascript: 'js',
  js: 'js',
  jsx: 'jsx',
  typescript: 'ts',
  ts: 'ts',
  tsx: 'tsx',
  python: 'py',
  py: 'py',
  rust: 'rs',
  rs: 'rs',
  go: 'go',
  java: 'java',
  kotlin: 'kt',
  swift: 'swift',
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  csharp: 'cs',
  cs: 'cs',
  'c#': 'cs',
  php: 'php',
  ruby: 'rb',
  rb: 'rb',
  bash: 'sh',
  sh: 'sh',
  shell: 'sh',
  zsh: 'sh',
  powershell: 'ps1',
  sql: 'sql',
  html: 'html',
  css: 'css',
  less: 'less',
  scss: 'scss',
  json: 'json',
  yaml: 'yaml',
  yml: 'yml',
  toml: 'toml',
  xml: 'xml',
  markdown: 'md',
  md: 'md',
  dockerfile: 'Dockerfile',
  vue: 'vue',
  svelte: 'svelte',
  dart: 'dart',
  lua: 'lua',
  r: 'r',
  scala: 'scala',
  haskell: 'hs',
  elixir: 'ex',
  graphql: 'graphql',
  text: 'txt',
};

/**
 * `<r-markdown>` — streaming-friendly Markdown renderer.
 *
 * Designed for AI-chat style output (à la Vercel Streamdown), but works for static
 * content too. In `mode="streaming"` (default) the text is first run through
 * `remend`, which closes half-streamed `**bold`, `` `code ``, links, `$$` math and so on,
 * then split into blocks; only the block whose text changed is re-rendered, so a
 * long answer never re-parses from the top on every token.
 *
 * Fenced ```mermaid blocks become `<r-mermaid>`, `$$…$$` / `\[…\]` / `\(…\)` become
 * `<r-math>`; both are lazily registered only when the content needs them.
 */
export class Markdown extends RanElement {
  _shadowDom: ShadowRoot;
  _wrap: HTMLElement;
  _body: HTMLElement;
  _blocks: BlockState[] = [];
  /** Content set through the property (not reflected — streaming text can be huge). */
  _content: string | null = null;
  /** In-flight render, so tests (and consumers) can `await el._pending`. */
  _pending: Promise<void> = Promise.resolve();
  _renderToken = 0;
  _renderModule: RenderModule | null = null;
  _themeObserver?: MutationObserver;
  _lightDomObserver?: MutationObserver;
  _copyResetTimer?: number;
  _error?: HTMLElement;

  static get observedAttributes(): string[] {
    return [
      'content',
      'mode',
      'theme',
      'caret',
      'copy',
      'download',
      'line-numbers',
      'highlight',
      'inline-math',
      'link-target',
      'sheet',
    ];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, markdownCss);
    const bodyRef = createRef<HTMLDivElement>();
    this._wrap = ensureShadowElement(this._shadowDom, '.ran-markdown', () =>
      Div()
        .class('ran-markdown')
        .part('markdown')
        .children(Div().class('ran-markdown-body').part('body').ref(bodyRef))
        .build(),
    );
    // ensureShadowElement may return a pre-existing tree (re-connect), so fall back to a lookup.
    // ensureShadowElement can hand back a tree built by a previous connect (or SSR), in
    // which case the factory never ran and the ref is empty; the body is its first child.
    this._body = bodyRef.current ?? (this._wrap.firstElementChild as HTMLElement);
  }

  // ── Accessors ─────────────────────────────────────────────────────────────
  /**
   * Markdown source. Resolution order: the `content` property (set via JS, not
   * reflected), the `content` attribute, then the element's text content.
   */
  get content(): string {
    if (this._content !== null) return this._content;
    const attr = getStringAttribute(this, 'content');
    if (attr) return attr;
    return this.textContent || '';
  }
  set content(value: string) {
    const next = value == null ? '' : String(value);
    if (this._content === next) return;
    this._content = next;
    this.render();
  }
  get mode(): string {
    return getStringAttribute(this, 'mode') || 'streaming';
  }
  set mode(value: string) {
    setStringAttribute(this, 'mode', value);
  }
  get theme(): string {
    return getStringAttribute(this, 'theme') || 'auto';
  }
  set theme(value: string) {
    setStringAttribute(this, 'theme', value);
  }
  get caret(): string {
    return getStringAttribute(this, 'caret');
  }
  set caret(value: string | null) {
    setStringAttribute(this, 'caret', value);
  }
  get copyable(): boolean {
    return this.hasAttribute('copy');
  }
  set copyable(v: boolean) {
    setBooleanAttribute(this, 'copy', v);
  }
  get downloadable(): boolean {
    return this.hasAttribute('download');
  }
  set downloadable(v: boolean) {
    setBooleanAttribute(this, 'download', v);
  }
  get lineNumbers(): boolean {
    return this.hasAttribute('line-numbers');
  }
  set lineNumbers(v: boolean) {
    setBooleanAttribute(this, 'line-numbers', v);
  }
  /** `""` → github-light/github-dark; `"a"` → both; `"a b"` → light / dark theme. */
  get highlight(): string | null {
    return this.hasAttribute('highlight') ? getStringAttribute(this, 'highlight') : null;
  }
  set highlight(value: string | null) {
    setStringAttribute(this, 'highlight', value);
  }
  get inlineMath(): boolean {
    return this.hasAttribute('inline-math');
  }
  set inlineMath(v: boolean) {
    setBooleanAttribute(this, 'inline-math', v);
  }
  get linkTarget(): string {
    return getStringAttribute(this, 'link-target') || '_blank';
  }
  set linkTarget(value: string) {
    setStringAttribute(this, 'link-target', value);
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

  // ── Theme ─────────────────────────────────────────────────────────────────
  private resolveTheme(): 'light' | 'dark' | 'system' {
    const t = this.theme;
    if (t === 'dark' || t === 'light') return t;
    const root = document.documentElement;
    const attr = root.getAttribute('data-ran-theme') || root.getAttribute('theme');
    if (attr === 'dark' || root.classList.contains('dark')) return 'dark';
    if (attr === 'light' || root.classList.contains('light')) return 'light';
    return 'system';
  }
  private syncTheme(): void {
    const t = this.resolveTheme();
    this._wrap.classList.toggle('is-dark', t === 'dark');
    this._wrap.classList.toggle('is-light', t === 'light');
    this._wrap.classList.toggle('is-system', t === 'system');
    // Nested renderers that bake the theme into their output follow the same setting.
    // They were handed back by enhance(), so no search of the rendered DOM is needed.
    for (const block of this._blocks) {
      for (const el of block.themed) el.setAttribute('theme', this.theme);
    }
  }
  private observeTheme(): void {
    if (this.theme !== 'auto') {
      this._themeObserver?.disconnect();
      this._themeObserver = undefined;
      return;
    }
    if (this._themeObserver || typeof MutationObserver === 'undefined') return;
    this._themeObserver = new MutationObserver(() => this.syncTheme());
    this._themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-ran-theme', 'theme'],
    });
  }

  // ── Rendering ─────────────────────────────────────────────────────────────
  render(): void {
    if (typeof document === 'undefined') return;
    const token = ++this._renderToken;
    const source = this.content;
    if (this._renderModule) {
      this.renderWith(this._renderModule, source, token);
      return;
    }
    this._pending = import('./render')
      .then((mod) => {
        this._renderModule = mod;
        if (token !== this._renderToken) return;
        this.renderWith(mod, source, token);
      })
      .catch((err: Error) => this.showError(err?.message || String(err)));
  }

  private renderWith(mod: RenderModule, source: string, token: number): void {
    if (token !== this._renderToken) return;
    const streaming = this.mode !== 'static';
    try {
      const text = streaming ? mod.remend(source, { inlineKatex: this.inlineMath }) : source;
      const doc = mod.parseDocument(text, { inlineMath: this.inlineMath, split: streaming });
      const blocks = doc.blocks;
      const last = blocks.length - 1;
      const highlightAttr = this.highlight;
      const ctxBase = {
        copy: this.copyable,
        download: this.downloadable,
        lineNumbers: this.lineNumbers,
        highlight: highlightAttr === null ? null : mod.parseThemes(highlightAttr),
        linkTarget: this.linkTarget,
        theme: this.theme,
        labels: { copy: this.label('copy', 'Copy code'), download: this.label('download', 'Download') },
        onCopy: this.copyCode,
        onDownload: this.downloadCode,
      };
      let changed = 0;
      blocks.forEach((block, i) => {
        const incomplete = streaming && i === last && block.incompleteCode;
        const prev = this._blocks[i];
        if (prev && prev.key === block.key && prev.incomplete === incomplete) return;
        const el = prev ? prev.el : this.createBlockElement();
        el.replaceChildren(doc.render(block));
        const { themed } = mod.enhance(el, { ...ctxBase, incomplete });
        // The caret hides while a fence is still open or the block is a table (it would
        // land inside the code/table box and look like content).
        el.toggleAttribute('data-no-caret', incomplete || block.hasTable);
        if (prev) {
          prev.key = block.key;
          prev.incomplete = incomplete;
          prev.themed = themed;
        } else {
          this._blocks.push({ key: block.key, incomplete, el, themed });
          this._body.appendChild(el);
        }
        changed += 1;
      });
      while (this._blocks.length > blocks.length) {
        const dropped = this._blocks.pop();
        dropped?.el.remove();
        changed += 1;
      }
      this._wrap.classList.remove('has-error');
      this._error?.remove();
      this._error = undefined;
      this.syncTheme();
      if (changed > 0) this.emit('render', { blocks: blocks.length, changed });
    } catch (err) {
      this.showError(String((err as Error)?.message || err));
    }
  }

  private createBlockElement(): HTMLElement {
    return Div().class('ran-markdown-block').part('block').build();
  }

  private showError(message: string): void {
    this._blocks.forEach((b) => b.el.remove());
    this._blocks = [];
    if (!this._error) {
      this._error = View('pre').class('ran-markdown-error').part('error').build();
      this._wrap.appendChild(this._error);
    }
    this._error.textContent = message;
    this._wrap.classList.add('has-error');
    this.emit('error', { message });
  }

  /** Force a full re-render (e.g. after toggling controls). */
  private rerender(): void {
    this._blocks.forEach((b) => b.el.remove());
    this._blocks = [];
    this.render();
  }

  // ── Code-block toolbar ────────────────────────────────────────────────────
  // Bound to each button when enhance() builds it, so the code and language arrive as
  // arguments rather than being read back out of the rendered DOM at click time.
  private copyCode = (icon: HTMLElement | null, code: string, language: string): void => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      this.emit('copied', { kind: 'code', language, code });
      if (!icon) return;
      icon.setAttribute('name', 'check');
      window.clearTimeout(this._copyResetTimer);
      this._copyResetTimer = window.setTimeout(() => icon.setAttribute('name', 'copy'), 1200);
    });
  };

  private downloadCode = (code: string, language: string): void => {
    const ext = EXTENSIONS[language] || language || 'txt';
    const filename = ext === 'Dockerfile' ? 'Dockerfile' : `code.${ext}`;
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.emit('download', { kind: 'code', language, filename });
  };

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this.observeTheme();
    // Hand-authored / streamed light-DOM text: re-render when it changes, unless the
    // property or attribute is the source of truth.
    if (typeof MutationObserver !== 'undefined' && !this._lightDomObserver) {
      this._lightDomObserver = new MutationObserver(() => {
        if (this._content === null && !this.hasAttribute('content')) this.render();
      });
      this._lightDomObserver.observe(this, { childList: true, characterData: true, subtree: true });
    }
    this.render();
  }
  disconnectedCallback(): void {
    this._themeObserver?.disconnect();
    this._themeObserver = undefined;
    this._lightDomObserver?.disconnect();
    this._lightDomObserver = undefined;
    window.clearTimeout(this._copyResetTimer);
  }
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
    if (o === n) return;
    if (k === 'sheet') this.handlerExternalCss();
    else if (k === 'content') this.render();
    else if (k === 'theme') {
      this.observeTheme();
      this.syncTheme();
    } else if (k === 'caret') {
      // pure CSS
    } else if (this.isConnected) this.rerender();
  }
}

defineSSR('r-markdown', Markdown as unknown as new () => HTMLElement);
export default Markdown;
