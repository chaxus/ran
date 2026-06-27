import routeCss from './index.less?inline';
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
import { getSSGPath } from '@/utils/router';

type RouterElement = HTMLElement & { _currentPath: string };

export class Route extends RanElement {
  static get observedAttributes(): string[] {
    return ['path', 'exact', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _params: Record<string, string> = {};

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

  _matchPath(currentPath: string): { matched: boolean; params: Record<string, string> } {
    const routePath = this.path;
    const params: Record<string, string> = {};
    const paramNames: string[] = [];

    const regexStr = routePath
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          paramNames.push(segment.slice(1));
          return '([^/]+)';
        }
        if (segment === '*') return '(.*)';
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');

    const pattern = this.exact ? new RegExp(`^${regexStr}$`) : new RegExp(`^${regexStr}(?:/.*)?$`);
    const match = currentPath.match(pattern);
    if (!match) return { matched: false, params };

    paramNames.forEach((name, i) => {
      params[name] = decodeURIComponent(match[i + 1] ?? '');
    });

    return { matched: true, params };
  }

  _update(currentPath: string): void {
    const { matched, params } = this._matchPath(currentPath);
    this._params = params;
    this.hidden = !matched;
    if (matched) {
      this.dispatchEvent(new CustomEvent('routematch', { detail: { path: currentPath, params }, bubbles: true }));
    }
  }

  // Called by HTMLElementMock.serialize() before the element is serialized in SSR/SSG.
  // At this point all attributes (path, exact) are already set, so _update() resolves correctly.
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
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'path' || name === 'exact') {
      const router = this.closest('r-router') as RouterElement | null;
      if (router) this._update(router._currentPath);
    }
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-route', Route as unknown as new () => HTMLElement);
export default Route;
