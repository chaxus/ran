import routerCss from './index.less?inline';
import { EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  ensureShadowElement,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { useRouter, type RouterComponentElement, type RouterCore } from '@/utils/router';

type RouteElement = HTMLElement & { _update: (path: string) => void };

export class Router extends RanElement {
  static get observedAttributes(): string[] {
    return ['mode', 'base', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _slot: HTMLSlotElement;
  _currentPath: string = '';
  /** Bound RouterCore (when createRouter() was used) — navigation delegates to it. */
  _core: RouterCore | null = null;

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, routerCss);
    const slot = ensureShadowElement(this._shadowDom, 'slot', () => Slot().build());
    this._slot = slot as HTMLSlotElement;
  }

  get mode(): 'history' | 'hash' {
    return this.getAttribute('mode') === 'hash' ? 'hash' : 'history';
  }

  get base(): string {
    return getStringAttribute(this, 'base');
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

  _getPath(): string {
    if (this.mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    }
    const base = this.base;
    const path = window.location.pathname;
    if (base && path.startsWith(base)) {
      return path.slice(base.length) || '/';
    }
    return path;
  }

  navigate(path: string, replace = false): void {
    // With a RouterCore, route everything through it so guards, View
    // Transitions, and afterEach/onRouteChange run uniformly.
    if (this._core) {
      void (replace ? this._core.replace(path) : this._core.push(path));
      return;
    }
    const fullPath = this.mode === 'hash' ? `#${path}` : this.base + path;
    if (replace) {
      window.history.replaceState(null, '', fullPath);
    } else {
      window.history.pushState(null, '', fullPath);
    }
    this._syncRoutes();
  }

  _syncRoutes(): void {
    const path = this._getPath();
    this._currentPath = path;
    this.querySelectorAll<RouteElement>('r-route').forEach((route) => {
      if (typeof route._update === 'function') route._update(path);
    });
    this.dispatchEvent(new CustomEvent('routechange', { detail: { path }, bubbles: true }));
  }

  _handlePopState = (): void => {
    // Back/forward: run the full pipeline (View Transitions + hooks) via the
    // core when present. Guards can't cancel a completed browser navigation, so
    // the core's _notify() intentionally skips beforeEach here.
    if (this._core) this._core._notify();
    else this._syncRoutes();
  };

  _handleNavigate = (e: Event): void => {
    const { path, replace } = (e as CustomEvent<{ path: string; replace: boolean }>).detail;
    e.stopPropagation();
    this.navigate(path, replace);
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(window, 'popstate', this._handlePopState);
    this._events.on(this, 'ran-navigate', this._handleNavigate as EventListener);
    this._events.on(this._slot, 'slotchange', () => this._syncRoutes());
    // Register with RouterCore if a global instance exists
    const core = useRouter();
    if (core) {
      this._core = core;
      core._bind(this as unknown as RouterComponentElement);
    }
    this._syncRoutes();
    // Re-sync after r-route is guaranteed to be upgraded
    if (typeof customElements !== 'undefined') {
      customElements.whenDefined('r-route').then(() => this._syncRoutes());
    }
  }

  disconnectedCallback(): void {
    const core = useRouter();
    if (core) core._unbind(this as unknown as RouterComponentElement);
    this._core = null;
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-router', Router as unknown as new () => HTMLElement);
export default Router;
