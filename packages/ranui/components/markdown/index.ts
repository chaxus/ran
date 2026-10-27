import { RanElement } from '@/utils/ssr';
import { Div, View, createRef, EventManager } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  setBooleanAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
// Registers <r-icon>; the code-block toolbar's <r-icon name="copy"> etc. resolve their SVG
// via r-icon's own name-driven lazy loading (assets/icons/*.svg), no local registration.
import '@/components/icon';
import markdownCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
import { downloadBlob } from 'ranuts/utils';
import { observeDocumentTheme, resolveDocumentTheme, THEME_SIGNAL_ATTRIBUTES } from '@/utils/theme';
import type { DocumentTheme } from '@/utils/theme';
import { uiText } from '@/utils/ui-text';
import { markdownText } from './text';

type RenderModule = typeof import('./render');
type CodeCopyControl = import('./render').CodeCopyControl;

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
 *
 * @fires render - A render pass finished; `detail` counts the blocks and how many changed.
 * @fires error - Parsing or rendering failed; `detail.message` says why.
 * @fires copied - A code block was copied from its header.
 * @fires download - A code block was downloaded from its header.
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
  /**
   * Streaming throttle for `content`: the first update in a frame renders at once, later ones
   * in the same frame fold into one render on the next. Every update re-lexes the whole
   * source, so a chunk-per-task stream used to cost O(n) per chunk however fast it arrived.
   */
  private _frameOpen = false;
  private _frameRender?: { done: () => void };
  _renderModule: RenderModule | null = null;
  _detachTheme?: () => void;
  _lightDomObserver?: MutationObserver;
  private _readerEvents = new EventManager();
  private _copies = new Map<HTMLButtonElement, { control: CodeCopyControl; busy: boolean; timer?: number }>();
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
      'label-copy-error',
      'sheet',
    ];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, markdownCss);
    const bodyRef = createRef<HTMLDivElement>();
    this._wrap = Div()
      .class('ran-markdown')
      .part('markdown')
      .children(Div().class('ran-markdown-body').part('body').ref(bodyRef))
      .build();
    this._shadowDom.appendChild(this._wrap);
    this._body = shadowPart(bodyRef, 'body');
  }

  // ── Accessors ─────────────────────────────────────────────────────────────
  /**
   * Markdown source. Resolution order: the `content` property (set via JS, not reflected), the `content` attribute, then the element's text content.
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
    this.renderThrottled();
  }
  /** Parsing mode: `'streaming'` | `'static'`. Default `'streaming'` repairs half-written syntax and re-renders only changed blocks; use `'static'` for finished text. */
  get mode(): string {
    return getStringAttribute(this, 'mode') || 'streaming';
  }
  set mode(value: string) {
    setStringAttribute(this, 'mode', value);
  }
  /** Colour scheme: `'auto'` | `'light'` | `'dark'`. Default `'auto'` follows the document theme; embedded Mermaid diagrams use the same value. */
  get theme(): string {
    return getStringAttribute(this, 'theme') || 'auto';
  }
  set theme(value: string) {
    setStringAttribute(this, 'theme', value);
  }
  /** Shows a blinking caret after the last block while text streams in; remove it when the answer is complete. Any value draws a block caret; `'circle'` draws a dot. */
  get caret(): string {
    return getStringAttribute(this, 'caret');
  }
  set caret(value: string | null) {
    setStringAttribute(this, 'caret', value);
  }
  /** Adds a copy button to each code block header. Reflects the `copy` attribute; off by default. */
  get copyable(): boolean {
    return this.hasAttribute('copy');
  }
  set copyable(v: boolean) {
    setBooleanAttribute(this, 'copy', v);
  }
  /** Adds a download button to each code block header that saves the code as a file. Reflects the `download` attribute; off by default. */
  get downloadable(): boolean {
    return this.hasAttribute('download');
  }
  set downloadable(v: boolean) {
    setBooleanAttribute(this, 'download', v);
  }
  /** Shows line numbers in code blocks. Reflects the `line-numbers` attribute; off by default. */
  get lineNumbers(): boolean {
    return this.hasAttribute('line-numbers');
  }
  set lineNumbers(v: boolean) {
    setBooleanAttribute(this, 'line-numbers', v);
  }
  /** Shiki syntax highlighting for code blocks; off when the attribute is absent. `""` → github-light/github-dark; `"a"` → both; `"a b"` → light / dark theme. */
  get highlight(): string | null {
    return this.hasAttribute('highlight') ? getStringAttribute(this, 'highlight') : null;
  }
  set highlight(value: string | null) {
    setStringAttribute(this, 'highlight', value);
  }
  /** Treats `$…$` as inline math. Off by default because `$` often means currency; `\(…\)` always works. Reflects the `inline-math` attribute. */
  get inlineMath(): boolean {
    return this.hasAttribute('inline-math');
  }
  set inlineMath(v: boolean) {
    setBooleanAttribute(this, 'inline-math', v);
  }
  /** `target` for rendered links, set with `rel="noopener noreferrer"`. Defaults to `'_blank'`; use `'_self'` to open links in place. In-page `#` links are left alone. */
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
  private label(key: string, fallback: keyof typeof markdownText.en): string {
    return getStringAttribute(this, `label-${key}`) || uiText(markdownText, fallback, this);
  }
  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Theme ─────────────────────────────────────────────────────────────────
  private resolveTheme(): DocumentTheme {
    const t = this.theme;
    if (t === 'dark' || t === 'light') return t;
    return resolveDocumentTheme();
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
      this._detachTheme?.();
      this._detachTheme = undefined;
      return;
    }
    if (this._detachTheme) return;
    this._detachTheme = observeDocumentTheme((changed) => {
      if (THEME_SIGNAL_ATTRIBUTES.some((name) => changed.has(name))) this.syncTheme();
    });
  }

  // ── Rendering ─────────────────────────────────────────────────────────────
  private renderThrottled(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.render();
      return;
    }
    if (this._frameOpen) {
      // The shown source is already stale; copy feedback must not vouch for it until the
      // deferred render lands.
      for (const pending of this._copies.values()) this.resetCopy(pending.control);
      if (!this._frameRender) {
        let done!: () => void;
        this._pending = new Promise<void>((resolve) => (done = resolve));
        this._frameRender = { done };
      }
      return;
    }
    this.render();
    this.openFrame();
  }
  private openFrame(): void {
    this._frameOpen = true;
    requestAnimationFrame(() => {
      this._frameOpen = false;
      const queued = this._frameRender;
      if (!queued) return;
      this._frameRender = undefined;
      // Detached: connectedCallback renders the latest content when it comes back.
      if (!this.isConnected) return queued.done();
      const waiting = this._pending;
      this.render();
      // render() replaces `_pending` only while the parser chunk is still loading.
      if (this._pending === waiting) queued.done();
      else void this._pending.then(queued.done);
      this.openFrame();
    });
  }
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
      .catch((err: Error) => {
        if (token === this._renderToken && this.isConnected) this.showError(err?.message || String(err));
      });
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
        labels: { copy: this.label('copy', 'markdown.copy'), download: this.label('download', 'markdown.download') },
        onCopy: this.copyCode,
        resetCopy: this.resetCopy,
        onDownload: this.downloadCode,
      };
      let changed = 0;
      blocks.forEach((block, i) => {
        const incomplete = streaming && i === last && block.incompleteCode;
        const prev = this._blocks[i];
        if (prev && prev.key === block.key && prev.incomplete === incomplete) return;
        const el = prev ? prev.el : this.createBlockElement();
        const { themed } = mod.renderBlock(el, doc.render(block), {
          ...ctxBase,
          incomplete,
        });
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
        if (dropped) mod.releaseReaders(dropped.el);
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
    this._blocks.forEach((b) => {
      this._renderModule?.releaseReaders(b.el);
      b.el.remove();
    });
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
    this._blocks.forEach((b) => {
      this._renderModule?.releaseReaders(b.el);
      b.el.remove();
    });
    this._blocks = [];
    this.render();
  }

  // ── Code-block toolbar ────────────────────────────────────────────────────
  // Bound to each button when enhance() builds it, so the code and language arrive as
  // arguments rather than being read back out of the rendered DOM at click time.
  private resetCopy = (control: CodeCopyControl): void => {
    const pending = this._copies.get(control.button);
    if (pending?.timer) window.clearTimeout(pending.timer);
    this._copies.delete(control.button);
    control.button.removeAttribute('aria-busy');
    control.button.removeAttribute('aria-disabled');
    control.icon?.setAttribute('name', 'copy');
    control.status.textContent = '';
    control.status.hidden = true;
  };

  private copyCode = (control: CodeCopyControl, code: string, language: string, sourceCurrent: () => boolean): void => {
    if (this._copies.get(control.button)?.busy) return;
    this.resetCopy(control);
    const pending = { control, busy: true, timer: undefined as number | undefined };
    this._copies.set(control.button, pending);
    control.button.setAttribute('aria-busy', 'true');
    control.button.setAttribute('aria-disabled', 'true');
    const current = () => this.isConnected && sourceCurrent() && this._copies.get(control.button) === pending;
    void (async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(code);
        if (!current()) return;
        this.emit('copied', { kind: 'code', language, code });
        if (!current()) return;
        control.icon?.setAttribute('name', 'check');
        pending.timer = window.setTimeout(() => {
          if (current()) this.resetCopy(control);
        }, 1200);
      } catch {
        if (!current()) return;
        control.status.textContent = this.label('copy-error', 'markdown.copyError');
        control.status.hidden = false;
      } finally {
        if (current()) {
          pending.busy = false;
          control.button.removeAttribute('aria-busy');
          control.button.removeAttribute('aria-disabled');
        }
      }
    })();
  };

  private settleReader = (): void => {
    for (const block of this._blocks) this._renderModule?.settleHighlights(block.el);
  };

  private downloadCode = (code: string, language: string): void => {
    const ext = EXTENSIONS[language] || language || 'txt';
    const filename = ext === 'Dockerfile' ? 'Dockerfile' : `code.${ext}`;
    downloadBlob(new Blob([code], { type: 'text/plain;charset=utf-8' }), filename);
    this.emit('download', { kind: 'code', language, filename });
  };

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this.observeTheme();
    this._readerEvents.on(document, 'selectionchange', this.settleReader);
    this._readerEvents.on(document, 'pointerup', this.settleReader);
    this._readerEvents.on(document, 'keyup', this.settleReader);
    // Hand-authored / streamed light-DOM text: re-render when it changes, unless the
    // property or attribute is the source of truth.
    if (typeof MutationObserver !== 'undefined' && !this._lightDomObserver) {
      this._lightDomObserver = new MutationObserver(() => {
        if (this._content === null && !this.hasAttribute('content')) this.render();
      });
      this._lightDomObserver.observe(this, { childList: true, characterData: true, subtree: true });
    }
    this.render();
    for (const block of this._blocks) this._renderModule?.resumeReaders(block.el);
  }
  disconnectedCallback(): void {
    ++this._renderToken;
    this._readerEvents.abort();
    for (const block of this._blocks) this._renderModule?.releaseReaders(block.el);
    for (const pending of this._copies.values()) this.resetCopy(pending.control);
    this._detachTheme?.();
    this._detachTheme = undefined;
    this._lightDomObserver?.disconnect();
    this._lightDomObserver = undefined;
  }
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
    if (o === n) return;
    if (k === 'sheet') this.handlerExternalCss();
    else if (k === 'content') this.render();
    else if (k === 'label-copy-error') {
      for (const { control } of this._copies.values()) {
        if (!control.status.hidden) control.status.textContent = this.label('copy-error', 'markdown.copyError');
      }
    } else if (k === 'theme') {
      this.observeTheme();
      this.syncTheme();
    } else if (k === 'caret') {
      // pure CSS
    } else if (this.isConnected) this.rerender();
  }
}

defineSSR('r-markdown', Markdown as unknown as new () => HTMLElement);
export default Markdown;
