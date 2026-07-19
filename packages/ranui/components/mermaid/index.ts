import { RanElement } from '@/utils/index';
import { Div, View, EventManager } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  setBooleanAttribute,
  syncSheetAttribute,
} from '@/utils/component';
// Registers <r-icon> and its always-on core action glyphs (copy/download/fullscreen/
// zoom-in/zoom-out/refresh/check), so the toolbar can use <r-icon name="copy"> directly.
import '@/components/icon';
import mermaidCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

let seq = 0;

export class Mermaid extends RanElement {
  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _wrap: HTMLElement;
  _diagram: HTMLElement;
  _toolbar: HTMLElement;
  _themeObserver?: MutationObserver;
  _copyResetTimer?: number;
  _fullscreenClose?: () => void;
  _downloadMenu?: HTMLElement;
  static get observedAttributes(): string[] {
    return ['code', 'theme', 'copy', 'download', 'fullscreen', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, mermaidCss);
    this._wrap = ensureShadowElement(this._shadowDom, '.ran-mermaid', () =>
      Div()
        .class('ran-mermaid')
        .part('mermaid')
        .children(
          Div().class('ran-mermaid-diagram').part('diagram'),
          Div().class('ran-mermaid-toolbar').part('toolbar'),
        )
        .build(),
    );
    this._diagram = this._wrap.querySelector('.ran-mermaid-diagram') as HTMLElement;
    this._toolbar = this._wrap.querySelector('.ran-mermaid-toolbar') as HTMLElement;
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
    const root = document.documentElement;
    const dark = root.classList.contains('dark') || root.getAttribute('data-ran-theme') === 'dark';
    return dark ? 'dark' : 'default';
  }
  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  // ── Rendering ─────────────────────────────────────────────────────────────
  render(): void {
    const graph = this.code;
    if (!graph) return;
    const id = `ran-mermaid-${seq++}`;
    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: this.resolveTheme(),
          fontFamily: 'inherit',
        });
        try {
          const { svg } = await mermaid.render(id, graph);
          this._diagram.innerHTML = svg;
          this.buildToolbar();
          this.emit('render', { ok: true });
        } catch (err) {
          // On failure mermaid leaves a "bomb" error graphic appended to <body> — drop it.
          document.getElementById(`d${id}`)?.remove();
          document.getElementById(id)?.remove();
          this.showError(String((err as Error)?.message || err));
        }
      })
      .catch((err: Error) => this.showError(err.message));
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
  private buildToolbar(): void {
    this._toolbar.innerHTML = '';
    const buttons: HTMLElement[] = [];
    if (this.copyable) buttons.push(this.iconButton('copy', this.label('copy', 'Copy source'), this.copySource));
    if (this.downloadable) buttons.push(this.iconButton('download', this.label('download', 'Download'), this.onDownload));
    if (this.fullscreenable) buttons.push(this.iconButton('fullscreen', this.label('fullscreen', 'Fullscreen'), this.openFullscreen));
    buttons.forEach((b) => this._toolbar.appendChild(b));
    this._wrap.classList.toggle('has-controls', buttons.length > 0);
  }
  private copySource = (): void => {
    const source = this.code;
    if (!source || !navigator.clipboard) return;
    navigator.clipboard.writeText(source).then(() => {
      this.emit('copied', { kind: 'source' });
      const icon = this._toolbar.querySelector('r-icon[name="copy"]');
      if (icon) {
        icon.setAttribute('name', 'check');
        window.clearTimeout(this._copyResetTimer);
        this._copyResetTimer = window.setTimeout(() => icon.setAttribute('name', 'copy'), 1200);
      }
    });
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
    this._wrap.appendChild(menu);
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
      stage.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:grab;touch-action:none;';
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
        'position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:4px;padding:4px;border-radius:8px;background:var(--ran-color-bg-elevated,#fff);box-shadow:0 2px 8px rgba(0,0,0,.15);';
      const fsBtn = (icon: string, label: string, fn: () => void): HTMLButtonElement => {
        const b = View('button')
          .attr('type', 'button')
          .attr('aria-label', label)
          .attr('title', label)
          .children(View('r-icon').attr('name', icon).attr('size', '18').attr('color', 'currentColor'))
          .build() as HTMLButtonElement;
        b.style.cssText =
          'display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:6px;background:transparent;color:var(--ran-color-text-secondary,#666);cursor:pointer;';
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
    this.render();
    // Close the download menu when the pointer leaves the diagram (the toolbar hides too).
    this._events.on(this._wrap, 'mouseleave', this.closeDownloadMenu);
    if (this.theme === 'auto' && !this._themeObserver) {
      this._themeObserver = new MutationObserver(() => this.render());
      this._themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-ran-theme'],
      });
    }
  }
  disconnectedCallback(): void {
    this._events.abort();
    this._themeObserver?.disconnect();
    this._themeObserver = undefined;
    window.clearTimeout(this._copyResetTimer);
    this.closeDownloadMenu();
    this._fullscreenClose?.();
  }
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
    if (o === n) return;
    if (k === 'code' || k === 'theme') this.render();
    else if (k === 'copy' || k === 'download' || k === 'fullscreen') this.buildToolbar();
    else if (k === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-mermaid', Mermaid as unknown as new () => HTMLElement);
export default Mermaid;
