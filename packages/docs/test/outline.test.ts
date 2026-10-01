// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { mountOutline } from '../client/outline';

it('synchronizes both outlines when a scroll skips several headings', () => {
  document.body.innerHTML =
    '<article class="prose"><h2 id="one">One</h2><h2 id="two">Two</h2><h3 id="three">Three</h3></article><a class="toc__link" href="#three">Mobile</a><a class="toc__link" href="#three">Desktop</a><a class="toc__link" href="#one">One</a>';
  const positions = [10, 300, 600];
  document.querySelectorAll('h2,h3').forEach((heading, index) => {
    vi.spyOn(heading, 'getBoundingClientRect').mockImplementation(() => ({ top: positions[index] }) as DOMRect);
  });
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  const cleanup = mountOutline();
  expect(document.querySelector('[href="#one"]')!.getAttribute('aria-current')).toBe('location');
  positions.splice(0, 3, -600, -300, 10);
  window.dispatchEvent(new Event('scroll'));
  for (const link of document.querySelectorAll('[href="#three"]')) {
    expect(link.hasAttribute('data-active')).toBe(true);
    expect(link.getAttribute('aria-current')).toBe('location');
  }
  expect(document.querySelector('[href="#one"]')!.hasAttribute('aria-current')).toBe(false);
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});
