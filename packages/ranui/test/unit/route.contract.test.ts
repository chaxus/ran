import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Route } from '@/components/route';
import '@/components/route';

describe('r-route contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with slot', () => {
    const route = document.createElement('r-route') as Route;
    document.body.appendChild(route);
    const shadow = (route as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-route')).not.toThrow();
  });

  it('path getter defaults to /', () => {
    const route = document.createElement('r-route') as Route;
    expect((route as any).path).toBe('/');
  });

  it('path setter reflects attribute', () => {
    const route = document.createElement('r-route') as Route;
    document.body.appendChild(route);
    route.path = '/about';
    expect(route.getAttribute('path')).toBe('/about');
  });

  it('_update shows element when path matches', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/about');
    document.body.appendChild(route);
    (route as any)._update('/about');
    expect(route.hidden).toBe(false);
  });

  it('_update hides element when path does not match', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/about');
    document.body.appendChild(route);
    (route as any)._update('/home');
    expect(route.hidden).toBe(true);
  });

  it('prefix match: /about matches /about/team without exact', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/about');
    document.body.appendChild(route);
    (route as any)._update('/about/team');
    expect(route.hidden).toBe(false);
  });

  it('exact match: /about does not match /about/team with exact', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/about');
    route.setAttribute('exact', '');
    document.body.appendChild(route);
    (route as any)._update('/about/team');
    expect(route.hidden).toBe(true);
  });

  it('exact match: /about matches /about with exact', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/about');
    route.setAttribute('exact', '');
    document.body.appendChild(route);
    (route as any)._update('/about');
    expect(route.hidden).toBe(false);
  });

  it('extracts params from :param segments', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/user/:id');
    document.body.appendChild(route);
    (route as any)._update('/user/42');
    expect(route.params).toEqual({ id: '42' });
  });

  it('extracts multiple params', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/org/:org/repo/:repo');
    document.body.appendChild(route);
    (route as any)._update('/org/ranui/repo/main');
    expect(route.params).toEqual({ org: 'ranui', repo: 'main' });
  });

  it('params getter returns empty object when no params', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/home');
    document.body.appendChild(route);
    (route as any)._update('/home');
    expect(route.params).toEqual({});
  });

  it('dispatches routematch event on successful match', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/home');
    document.body.appendChild(route);
    const events: CustomEvent[] = [];
    route.addEventListener('routematch', (e) => events.push(e as CustomEvent));
    (route as any)._update('/home');
    expect(events).toHaveLength(1);
    expect(events[0]?.detail.path).toBe('/home');
  });

  it('does not dispatch routematch event on non-match', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('path', '/home');
    document.body.appendChild(route);
    const events: CustomEvent[] = [];
    route.addEventListener('routematch', (e) => events.push(e as CustomEvent));
    (route as any)._update('/other');
    expect(events).toHaveLength(0);
  });

  it('disconnectedCallback aborts event manager', () => {
    const route = document.createElement('r-route') as Route;
    document.body.appendChild(route);
    const spy = vi.spyOn((route as any)._events, 'abort');
    document.body.removeChild(route);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('attributeChangedCallback skips when old === new', () => {
    const route = document.createElement('r-route') as Route;
    document.body.appendChild(route);
    const spy = vi.spyOn(route as any, 'handlerExternalCss');
    (route as any).attributeChangedCallback('sheet', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('exact getter returns false without attribute', () => {
    const route = document.createElement('r-route') as Route;
    expect((route as any).exact).toBe(false);
  });

  it('exact getter returns true with attribute', () => {
    const route = document.createElement('r-route') as Route;
    route.setAttribute('exact', '');
    expect((route as any).exact).toBe(true);
  });
});
