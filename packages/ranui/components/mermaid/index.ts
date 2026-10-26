import { RanElement } from '@/utils/ssr';
import { createRef, Div, EventManager, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
// Registers <r-icon>; the toolbar's <r-icon name="copy"> etc. resolve their SVG via
// r-icon's own name-driven lazy loading (assets/icons/*.svg), no local registration.
import '@/components/icon';
import mermaidCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
import { observeDocumentTheme, resolveDocumentTheme, THEME_SIGNAL_ATTRIBUTES } from '@/utils/theme';
import { watchMediaQuery } from 'ranuts/utils';

let seq = 0;

/**
 * `<r-mermaid>` — a Mermaid diagram, with the library loaded only when one renders.
 *
 * @fires render - The diagram finished rendering.
 * @fires error - Rendering or an export failed; `detail.message` says why.
 * @fires copied - The source was copied from the opt-in toolbar.
 * @fires download - An SVG / PNG / source download was started.
 * @fires fullscreenchange - The fullscreen overlay opened or closed.
 */
export class Mermaid extends RanElement {
  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _wrap: HTMLElement;
  _diagram: HTMLElement;
  _toolbar: HTMLElement;
  _detachTheme?: () => void;
  /** Coalesces the attribute writes and the connect that a first mount makes into one render. */
  private _renderQueued = false;
  /** Bumped per render; a completion carrying an older token is a superseded diagram. */
  private _renderToken = 0;
  private _renderedTheme?: 'dark' | 'default';
  _copyResetTimer?: number;
  private _copyStatus?: HTMLElement;
  private _copyRevision = 0;
  private _copyPending?: { button: HTMLButtonElement };
  _fullscreenClose?: () => void;
  _downloadMenu?: HTMLElement;
  static get observedAttributes(): string[] {
    return ['code', 'theme', 'copy', 'download', 'fullscreen', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, mermaidCss);
    const diagramRef = createRef<HTMLDivElement>();
    const toolbarRef = createRef<HTMLDivElement>();
    this._wrap = Div()
      .class('ran-mermaid')
      .part('mermaid')
      .children(
        Div().class('ran-mermaid-toolbar').ref(toolbarRef).part('toolbar'),
        Div().class('ran-mermaid-diagram').ref(diagramRef).part('diagram'),
      )
      .build();
    this._shadowDom.appendChild(this._wrap);
    this._diagram = shadowPart(diagramRef, 'diagram');
    this._toolbar = shadowPart(toolbarRef, 'toolbar');
  }
  // ── Accessors ─────────────────────────────────────────────────────────────
  get code(): string {
    const attr = getStringAttribute(this, 'code');
    if (attr) return decodeURIComponent(attr);
    return (this.textContent || '').trim();
  }
  set code(value: string) {
    setStringAttribute(this, 'code', encodeURIComponent(value));
  }
  get theme(): string {
    return getStringAttribute(this, 'theme') || 'auto';
  }
  set theme(value: string) {
    setStringAttribute(this, 'theme', value);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
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
  get fullscreenable(): boolean {
    return this.hasAttribute('fullscreen');
  }
  set fullscreenable(v: boolean) {
    setBooleanAttribute(this, 'fullscreen', v);
  }
  private label(key: string, fallback: string): string {
    return getStringAttribute(this, `label-${key}`) || fallback;
  }
  private resolveTheme(): 'dark' | 'default' {
    const t = this.theme;
    if (t === 'dark') return 'dark';
    if (t === 'light') return 'default';
    const doc = resolveDocumentTheme();
    if (doc === 'system') {
      const prefersDark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'default';
    }
    return doc === 'dark' ? 'dark' : 'default';
  }
  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  // ── Rendering ─────────────────────────────────────────────────────────────
  /** Render once the current task's attribute writes settle, and only while connected. */
  requestRender = (): void => {
    if (!this.isConnected) return;
    // The source just changed: a copy started now must not deliver the old output.
    this.invalidateCopy();
    if (this._renderQueued) return;
    this._renderQueued = true;
    queueMicrotask(() => {
      this._renderQueued = false;
      if (this.isConnected) this.renderSource();
    });
  };
  render(): void {
    this.invalidateCopy();
    this.renderSource();
  }
  /** requestRender has already invalidated pending copies when the source changed. */
  private renderSource(): void {
    const token = ++this._renderToken;
    const graph = this.code;
    if (!graph) return;
    const id = `ran-mermaid-${seq++}`;
    const theme = this.resolveTheme();
    this._renderedTheme = theme;
    import('mermaid')
      .then(async ({ default: mermaid }) => {
        if (token !== this._renderToken) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme,
          fontFamily: 'inherit',
        });
        // Mermaid measures an SVG in its temporary document-level #d{id} div.
        // A host's universal reduced-motion duration can otherwise create tiny
        // transform transitions during that measurement and inflate the viewBox.
        // Keep this throwaway tree out of paint/accessibility while preserving
        // layout and getBBox measurement. The displayed SVG remains visible and
        // keeps the component's normal/reduced-motion treatment.
        const measurementStyle = View('style').build();
        measurementStyle.textContent = `#d${id}, #d${id} * { visibility: hidden !important; transition: none !important; }`;
        document.head.appendChild(measurementStyle);
        try {
          const { svg } = await mermaid.render(id, graph);
          if (token !== this._renderToken) return;
          this._diagram.innerHTML = svg;
          if (!this._toolbar.querySelector('button')) this.buildToolbar();
          this.emit('render', { ok: true });
        } catch (err) {
          // On failure mermaid leaves a "bomb" error graphic appended to <body> — drop it.
          document.getElementById(`d${id}`)?.remove();
          document.getElementById(id)?.remove();
          if (token === this._renderToken) this.showError(String((err as Error)?.message || err));
        } finally {
          measurementStyle.remove();
        }
      })
      .catch((err: Error) => {
        if (token === this._renderToken) this.showError(err.message);
      });
  }
  /** Follow the document theme only for `theme="auto"`, and redraw only when it resolves differently. */
  private syncThemeObserver(): void {
    if (this.theme !== 'auto' || !this.isConnected) {
      this._detachTheme?.();
      this._detachTheme = undefined;
      return;
    }
    if (this._detachTheme) return;
    const follow = (): void => {
      if (this.resolveTheme() !== this._renderedTheme) this.requestRender();
    };
    const detachDocument = observeDocumentTheme((changed) => {
      if (THEME_SIGNAL_ATTRIBUTES.some((name) => changed.has(name))) follow();
    });
    const detachMedia = watchMediaQuery('(prefers-color-scheme: dark)', follow);
    this._detachTheme = () => {
      detachDocument();
      detachMedia();
    };
  }
  private showError(message: string): void {
    this._diagram.innerHTML = '';
    const pre = View('pre').class('ran-mermaid-error').part('error').build();
    pre.textContent = message;
    this._diagram.appendChild(pre);
    this._toolbar.innerHTML = '';
    this._wrap.classList.remove('has-controls');
    this.emit('error', { message });
  }
  // ── Toolbar ───────────────────────────────────────────────────────────────
  private iconButton(icon: string, label: string, onClick: () => void): HTMLButtonElement {
    const btn = View('button')
      .class('ran-mermaid-btn')
      .part('button')
      .attr('type', 'button')
      .attr('aria-label', label)
      .attr('title', label)
      .children(View('r-icon').attr('name', icon).attr('size', '16').attr('color', 'currentColor'))
      .build() as HTMLButtonElement;
    this._events.on(btn, 'click', onClick);
    return btn;
  }
  private invalidateCopy(): void {
    this._copyRevision++;
    this._copyPending?.button.removeAttribute('aria-busy');
    this._copyPending = undefined;
    window.clearTimeout(this._copyResetTimer);
    this._copyStatus?.remove();
    this._copyStatus = undefined;
    if (this.copyable) this._toolbar.querySelector('button r-icon')?.setAttribute('name', 'copy');
  }
  private buildToolbar(): void {
    this.invalidateCopy();
    this.closeDownloadMenu();
    this._toolbar.innerHTML = '';
    const buttons: HTMLElement[] = [];
    if (this.copyable) buttons.push(this.iconButton('copy', this.label('copy', 'Copy source'), this.copySource));
    if (this.downloadable)
      buttons.push(this.iconButton('download', this.label('download', 'Download'), this.onDownload));
    if (this.fullscreenable)
      buttons.push(this.iconButton('fullscreen', this.label('fullscreen', 'Fullscreen'), this.openFullscreen));
    buttons.forEach((b) => this._toolbar.appendChild(b));
    this._wrap.classList.toggle('has-controls', buttons.length > 0);
  }
  private copySource = async (): Promise<void> => {
    const button = this._toolbar.querySelector<HTMLButtonElement>('button');
    if (!button || this._copyPending?.button === button) return;
    const target = 'source';
    const text = this.code;
    if (!text) return;
    const source = this.code;
    const revision = this._copyRevision;
    const current = (): boolean =>
      this.isConnected &&
      revision === this._copyRevision &&
      this.code === source &&
      this._toolbar.querySelector('button') === button;
    const operation = { button };
    this._copyPending = operation;
    button.setAttribute('aria-busy', 'true');
    window.clearTimeout(this._copyResetTimer);
    this._copyStatus?.remove();
    this._copyStatus = undefined;
    const icon = button.querySelector('r-icon');
    icon?.setAttribute('name', 'copy');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (!current()) return;
      this.emit('copied', { kind: target });
      icon?.setAttribute('name', 'check');
      this._copyResetTimer = window.setTimeout(() => {
        if (current()) icon?.setAttribute('name', 'copy');
      }, 1200);
    } catch {
      if (!current()) return;
      const status = Div().class('ran-mermaid-copy-status').part('copy-status').attr('role', 'status').build();
      status.textContent = this.label('copy-error', 'Could not copy. Try again.');
      this._copyStatus = status;
      this._toolbar.prepend(status);
    } finally {
      if (this._copyPending === operation) {
        button.removeAttribute('aria-busy');
        this._copyPending = undefined;
      }
    }
  };
  private currentSvg(): SVGSVGElement | null {
    return this._diagram.querySelector('svg');
  }
  // Download: `download` (bare) offers SVG + PNG + source via a small menu; restrict with
  // e.g. `download="svg"` or `download="svg png"`. A single format downloads directly.
  private downloadFormats(): string[] {
    const v = getStringAttribute(this, 'download').trim();
    const list = v ? v.split(/\s+/) : ['svg', 'png', 'source'];
    return list.filter((f) => f === 'svg' || f === 'png' || f === 'source');
  }
  private onDownload = (): void => {
    const formats = this.downloadFormats();
    if (formats.length <= 1) this.triggerDownload(formats[0] || 'svg');
    else this.toggleDownloadMenu();
  };
  private triggerDownload(format: string): void {
    if (format === 'png') this.downloadPng();
    else if (format === 'source') this.downloadSource();
    else this.downloadRawSvg();
  }
  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  private downloadRawSvg(): void {
    const svg = this.currentSvg();
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    this.saveBlob(
      new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${source}`], { type: 'image/svg+xml;charset=utf-8' }),
      'diagram.svg',
    );
    this.emit('download', { format: 'svg' });
  }
  private downloadSource(): void {
    const source = this.code;
    if (!source) return;
    this.saveBlob(new Blob([source], { type: 'text/plain;charset=utf-8' }), 'diagram.mmd');
    this.emit('download', { format: 'source' });
  }
  private downloadPng(): void {
    const svg = this.currentSvg();
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const w = Math.max(1, Math.round((rect.width || 800) * 2));
    const h = Math.max(1, Math.round((rect.height || 600) * 2));
    const source = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = (): void => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = this.resolveTheme() === 'dark' ? '#1a1a1a' : '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
        }
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            this.saveBlob(blob, 'diagram.png');
            this.emit('download', { format: 'png' });
          } else {
            this.emit('error', { message: 'PNG export failed' });
          }
        }, 'image/png');
      } catch {
        // foreignObject (HTML labels) can taint the canvas → toBlob throws SecurityError.
        URL.revokeObjectURL(url);
        this.emit('error', { message: 'PNG export failed (diagram may use HTML labels)' });
      }
    };
    img.onerror = (): void => {
      URL.revokeObjectURL(url);
      this.emit('error', { message: 'PNG export failed' });
    };
    img.src = url;
  }
  private toggleDownloadMenu(): void {
    if (this._downloadMenu) {
      this.closeDownloadMenu();
      return;
    }
    const menu = Div().class('ran-mermaid-menu').part('menu').build();
    const names: Record<string, string> = {
      svg: this.label('download-svg', 'SVG'),
      png: this.label('download-png', 'PNG'),
      source: this.label('download-source', 'Source (.mmd)'),
    };
    this.downloadFormats().forEach((fmt) => {
      const item = View('button').class('ran-mermaid-menu-item').attr('type', 'button').build();
      item.textContent = names[fmt] || fmt;
      this._events.on(item, 'click', () => {
        this.triggerDownload(fmt);
        this.closeDownloadMenu();
      });
      menu.appendChild(item);
    });
    this._toolbar.appendChild(menu);
    this._downloadMenu = menu;
  }
  private closeDownloadMenu = (): void => {
    this._downloadMenu?.remove();
    this._downloadMenu = undefined;
  };
  // ── Fullscreen (reuses r-modal) + pan/zoom ────────────────────────────────
  private openFullscreen = (): void => {
    const svg = this.currentSvg();
    if (!svg) return;
    import('@/components/modal').then(() => {
      const modal = document.createElement('r-modal');
      // Diagram lightbox: headerless (no title bar) but keep the floating close button.
      // `title` still gives the dialog an accessible label in headerless mode.
      modal.setAttribute('title', this.label('diagram', 'Diagram'));
      modal.setAttribute('hide-header', '');
      modal.setAttribute('closable', '');
      modal.setAttribute('maskClosable', 'true');
      modal.setAttribute('closeOnEsc', 'true');
      modal.style.setProperty('--ran-modal-dialog-width', 'min(1280px, 94vw)');
      modal.style.setProperty('--ran-modal-dialog-max-width', '94vw');

      const wrap = Div().build();
      wrap.style.cssText = 'position:relative;width:100%;height:82vh;overflow:hidden;';
      const stage = Div().build();
      stage.style.cssText =
        'width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;';
      const inner = Div().build();
      inner.style.cssText = 'transform-origin:center center;transition:transform .05s linear;';
      inner.appendChild(svg.cloneNode(true));
      stage.appendChild(inner);
      wrap.appendChild(stage);

      // pan / zoom state
      let scale = 1;
      let tx = 0;
      let ty = 0;
      let dragging = false;
      let ox = 0;
      let oy = 0;
      const apply = (): void => {
        inner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      };
      const zoom = (factor: number): void => {
        scale = Math.min(8, Math.max(0.4, scale * factor));
        apply();
      };
      const reset = (): void => {
        scale = 1;
        tx = 0;
        ty = 0;
        apply();
      };
      const ac = new AbortController();
      const sig = ac.signal;
      stage.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1);
        },
        { signal: sig, passive: false },
      );
      stage.addEventListener(
        'pointerdown',
        (e) => {
          dragging = true;
          ox = e.clientX - tx;
          oy = e.clientY - ty;
          stage.style.cursor = 'grabbing';
          stage.setPointerCapture?.(e.pointerId);
        },
        { signal: sig },
      );
      stage.addEventListener(
        'pointermove',
        (e) => {
          if (!dragging) return;
          tx = e.clientX - ox;
          ty = e.clientY - oy;
          apply();
        },
        { signal: sig },
      );
      const endDrag = (): void => {
        dragging = false;
        stage.style.cursor = 'grab';
      };
      stage.addEventListener('pointerup', endDrag, { signal: sig });
      stage.addEventListener('pointercancel', endDrag, { signal: sig });

      // zoom controls (bottom-center, inline-styled since they live in modal light DOM)
      const controls = Div().build();
      controls.style.cssText =
        'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:4px;padding:4px;border-radius:8px;background:var(--ran-color-bg-elevated, #ffffff);box-shadow:0 2px 8px rgba(0,0,0,.15);';
      const fsBtn = (icon: string, label: string, fn: () => void): HTMLButtonElement => {
        const b = View('button')
          .attr('type', 'button')
          .attr('aria-label', label)
          .attr('title', label)
          .children(View('r-icon').attr('name', icon).attr('size', '18').attr('color', 'currentColor'))
          .build() as HTMLButtonElement;
        b.style.cssText =
          'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:6px;background:transparent;color:var(--ran-color-text-secondary, #55555e);cursor:pointer;';
        b.addEventListener('click', fn, { signal: sig });
        return b;
      };
      controls.appendChild(fsBtn('zoom-out', this.label('zoom-out', 'Zoom out'), () => zoom(1 / 1.2)));
      controls.appendChild(fsBtn('refresh', this.label('reset', 'Reset'), reset));
      controls.appendChild(fsBtn('zoom-in', this.label('zoom-in', 'Zoom in'), () => zoom(1.2)));
      wrap.appendChild(controls);

      modal.appendChild(wrap);
      document.body.appendChild(modal);
      modal.setAttribute('open', '');
      this.emit('fullscreenchange', { open: true });

      const cleanup = (): void => {
        ac.abort();
        modal.remove();
        this._fullscreenClose = undefined;
        this.emit('fullscreenchange', { open: false });
      };
      modal.addEventListener('afterclose', cleanup, { once: true });
      this._fullscreenClose = cleanup;
    });
  };
  // ── Lifecycle ─────────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    // Rebind toolbar listeners after reconnect; source updates preserve its focus.
    this.buildToolbar();
    this.requestRender();
    // Close the download menu when the pointer leaves the diagram (the toolbar hides too).
    this._events.on(this._wrap, 'mouseleave', this.closeDownloadMenu);
    this.syncThemeObserver();
  }
  disconnectedCallback(): void {
    this.invalidateCopy();
    this._events.abort();
    this._detachTheme?.();
    this._detachTheme = undefined;
    this._renderToken++;
    window.clearTimeout(this._copyResetTimer);
    this.closeDownloadMenu();
    this._fullscreenClose?.();
  }
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
    if (o === n) return;
    if (k === 'theme') this.syncThemeObserver();
    if (k === 'code' || k === 'theme') this.requestRender();
    else if (k === 'copy' || k === 'download' || k === 'fullscreen') this.buildToolbar();
    else if (k === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-mermaid', Mermaid as unknown as new () => HTMLElement);
export default Mermaid;
