import routeCss from './index.less?inline';
import { EventManager, Slot, createRoot, onCleanup, isSSR } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  ensureShadowElement,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { getSSGPath, matchPath } from '@/utils/router';

type RouterElement = HTMLElement & { _currentPath: string };
/** A lazy page module's default export: render into `host`, optionally return a cleanup. */
type PageRender = (host: HTMLElement) => void | (() => void);

export class Route extends RanElement {
  static get observedAttributes(): string[] {
    return ['path', 'exact', 'src', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _params: Record<string, string> = {};

  // Lazy mount/unmount mode (set via the `src` attribute):
  private _mounted = false;
  private _module: { default?: PageRender } | null = null;
  private _disposePage: (() => void) | null = null;
  private _pageHost: HTMLElement | null = null;
  // Bumped on every mount/unmount so an in-flight import() that resolves after a
  // leave (and possible re-enter) can tell it has been superseded and bail.
  private _mountToken = 0;

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, routeCss);
    ensureShadowElement(this._shadowDom, 'slot', () => Slot().build());
  }

  get path(): string {
    return getStringAttribute(this, 'path', '/');
  }
  set path(v: string) {
    setStringAttribute(this, 'path', v);
  }

  get exact(): boolean {
    return this.hasAttribute('exact');
  }

  /** Module specifier for lazy, code-split, mount/unmount page rendering. */
  get src(): string {
    return getStringAttribute(this, 'src');
  }
  set src(v: string) {
    setStringAttribute(this, 'src', v);
  }

  get params(): Record<string, string> {
    return { ...this._params };
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  _update(currentPath: string): void {
    const { matched, params } = matchPath(this.path, this.exact, currentPath);
    this._params = params;
    this.hidden = !matched;

    // Lazy mode: mount the page on match, dispose it on leave (client only).
    if (this.src && !isSSR) {
      if (matched) void this._mount();
      else this._unmount();
    }

    if (matched) {
      this.dispatchEvent(new CustomEvent('routematch', { detail: { path: currentPath, params }, bubbles: true }));
    }
  }

  // ── Lazy mount / unmount (src=) ───────────────────────────────────────────
  // The module's default export renders into a host inside a reactive scope
  // (createRoot). Leaving the route disposes that scope — every effect, binding,
  // and onCleanup the page registered is torn down in a single call. This is the
  // code-split, per-page-lifecycle mode for larger multi-page apps.

  private async _mount(): Promise<void> {
    if (this._mounted) return;
    this._mounted = true;
    const token = ++this._mountToken;
    if (!this._pageHost) {
      this._pageHost = document.createElement('div');
      this._pageHost.setAttribute('part', 'page');
      this.appendChild(this._pageHost);
    }
    try {
      this._module ??= (await import(/* @vite-ignore */ this.src)) as { default?: PageRender };
      if (token !== this._mountToken) return; // superseded by a later unmount/mount while importing
      const render = this._module.default;
      if (typeof render !== 'function') {
        console.error(`[r-route] "${this.src}" has no default export (host) => void`);
        return;
      }
      const host = this._pageHost;
      this._disposePage = createRoot((dispose) => {
        const cleanup = render(host);
        if (typeof cleanup === 'function') onCleanup(cleanup);
        return dispose;
      });
    } catch (error) {
      this._mounted = false;
      console.error(`[r-route] failed to load "${this.src}":`, error);
    }
  }

  private _unmount(): void {
    if (!this._mounted) return;
    this._mounted = false;
    this._mountToken++; // invalidate any import() still in flight
    this._disposePage?.();
    this._disposePage = null;
    this._pageHost?.replaceChildren();
  }

  // Called by HTMLElementMock.serialize() before SSR/SSG serialization. Lazy
  // (`src`) routes are client-rendered, so only show/hide is resolved here.
  _preSerialize(): void {
    const ssgPath = getSSGPath();
    if (ssgPath !== null) this._update(ssgPath);
  }

  connectedCallback(): void {
    this.handlerExternalCss();
    const router = this.closest('r-router') as RouterElement | null;
    if (router && router._currentPath) {
      this._update(router._currentPath);
    }
  }

  disconnectedCallback(): void {
    this._unmount();
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'src') {
      this._module = null;
      this._unmount();
    }
    if (name === 'path' || name === 'exact' || name === 'src') {
      const router = this.closest('r-router') as RouterElement | null;
      if (router) this._update(router._currentPath);
    }
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-route', Route as unknown as new () => HTMLElement);
export default Route;
