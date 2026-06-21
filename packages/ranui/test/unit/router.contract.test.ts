import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Router } from '@/components/router';
import { Route } from '@/components/route';
import '@/components/router';
import '@/components/route';

describe('r-router contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.pushState(null, '', '/');
  });

  it('renders shadow DOM with slot', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    const shadow = (router as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-router')).not.toThrow();
  });

  it('initialises _currentPath on connect', () => {
    window.history.pushState(null, '', '/about');
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    expect((router as any)._currentPath).toBe('/about');
  });

  it('navigate() updates _currentPath and pushes history entry', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    router.navigate('/foo');
    expect((router as any)._currentPath).toBe('/foo');
    expect(window.location.pathname).toBe('/foo');
  });

  it('navigate() with replace=true uses replaceState', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    const spy = vi.spyOn(window.history, 'replaceState');
    router.navigate('/bar', true);
    expect(spy).toHaveBeenCalledWith(null, '', '/bar');
    spy.mockRestore();
  });

  it('dispatches routechange event on navigate', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    const events: string[] = [];
    router.addEventListener('routechange', (e) => {
      events.push((e as CustomEvent).detail.path);
    });
    router.navigate('/x');
    expect(events).toContain('/x');
  });

  it('syncs child r-route elements when navigating', () => {
    const router = document.createElement('r-router') as Router;
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/target');
    router.appendChild(route);
    document.body.appendChild(router);

    router.navigate('/other');
    expect(route.hidden).toBe(true);
    router.navigate('/target');
    expect(route.hidden).toBe(false);
  });

  it('disconnectedCallback aborts event manager', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    const spy = vi.spyOn((router as any)._events, 'abort');
    document.body.removeChild(router);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('responds to popstate events', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    window.history.pushState(null, '', '/popped');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect((router as any)._currentPath).toBe('/popped');
  });

  it('handles ran-navigate event from children', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    router.dispatchEvent(new CustomEvent('ran-navigate', { detail: { path: '/nav', replace: false }, bubbles: true }));
    expect((router as any)._currentPath).toBe('/nav');
  });

  it('attributeChangedCallback skips when old === new', () => {
    const router = document.createElement('r-router') as Router;
    document.body.appendChild(router);
    const spy = vi.spyOn(router as any, 'handlerExternalCss');
    (router as any).attributeChangedCallback('sheet', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('mode getter defaults to history', () => {
    const router = document.createElement('r-router') as Router;
    expect((router as any).mode).toBe('history');
  });

  it('mode getter returns hash when attribute is set', () => {
    const router = document.createElement('r-router') as Router;
    router.setAttribute('mode', 'hash');
    expect((router as any).mode).toBe('hash');
  });
});
