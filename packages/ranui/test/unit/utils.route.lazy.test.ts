import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/route';

// A lazy page module (default export renders into `host`, returns a cleanup).
// Delivered as a data: URL so `await import(src)` resolves a real ES module.
const PAGE_MODULE =
  'export default (host) => {' +
  '  const s = host.ownerDocument.createElement("span");' +
  '  s.className = "page-mark";' +
  '  host.appendChild(s);' +
  '  host.dataset.cleaned = "0";' +
  '  return () => { host.dataset.cleaned = "1"; };' +
  '};';
const SRC = `data:text/javascript,${encodeURIComponent(PAGE_MODULE)}`;

function makeRoute(): HTMLElement {
  const route = document.createElement('r-route');
  route.setAttribute('path', '/lazy');
  route.setAttribute('src', SRC);
  document.body.appendChild(route);
  return route;
}
const host = (route: HTMLElement) => route.querySelector<HTMLElement>('[part="page"]');

describe('r-route lazy mount (src=)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts the page on match and disposes it (cleanup) on leave', async () => {
    const route = makeRoute();
    (route as unknown as { _update(p: string): void })._update('/lazy'); // match → mount

    await vi.waitFor(() => expect(host(route)?.querySelectorAll('.page-mark').length).toBe(1));
    expect(host(route)?.dataset.cleaned).toBe('0');

    (route as unknown as { _update(p: string): void })._update('/other'); // leave → unmount
    expect(host(route)?.dataset.cleaned).toBe('1'); // page cleanup ran
    expect(host(route)?.querySelectorAll('.page-mark').length).toBe(0); // host cleared
  });

  it('does not double-render when re-entering while the import is still pending', async () => {
    const route = makeRoute();
    const u = (route as unknown as { _update(p: string): void })._update.bind(route);
    u('/lazy'); // mount #1 — import in flight
    u('/other'); // leave — invalidates mount #1
    u('/lazy'); // mount #2 — import in flight

    // Let every in-flight import settle, then assert exactly one render survived.
    await new Promise((r) => setTimeout(r, 0));
    await vi.waitFor(() => expect(host(route)?.querySelectorAll('.page-mark').length).toBe(1));
    expect(host(route)?.querySelectorAll('.page-mark').length).toBe(1);
  });
});
