// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { mountReadingRail } from '../client/reading-rail';
afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it('keeps the original navigable outline and exposes an explicit reading-mode control', () => {
  document.body.innerHTML =
    '<article class="prose"><h2 id="one">One</h2></article><aside class="toc"><p class="toc__label">Outline</p><ul class="toc__list"><li><a class="toc__link" href="#one">One</a></li></ul></aside>';
  const rail = mountReadingRail([...document.querySelectorAll<HTMLElement>('h2')]);
  const toggle = document.querySelector<HTMLButtonElement>('.toc-mode')!;
  expect(toggle.getAttribute('aria-pressed')).toBe('false');
  toggle.click();
  expect(toggle.getAttribute('aria-pressed')).toBe('true');
  expect(document.querySelector('.toc')!.hasAttribute('data-reading')).toBe(true);
  expect(document.querySelector('.toc__link')!.getAttribute('href')).toBe('#one');
  rail.update(0);
  expect(document.querySelector('.reading-rail__title')!.textContent).toBe('One');
  document.querySelector('.toc__link')!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  expect(document.querySelector('.toc')!.hasAttribute('data-engaged')).toBe(true);
  rail.dispose();
  expect(document.querySelector('.toc-mode')).toBeNull();
  expect(document.querySelector('.toc > .toc__list')).not.toBeNull();
});

it('retains markers across the whole document when there are more than 48 chapters', () => {
  document.body.innerHTML = `<article class="prose">${Array.from({ length: 80 }, (_, i) => `<h2 id="chapter-${i}">Chapter ${i}</h2>`).join('')}</article><aside class="toc"><p class="toc__label">Outline</p><ul class="toc__list"><a class="toc__link" href="#chapter-0">First</a></ul></aside>`;
  const headings = [...document.querySelectorAll<HTMLElement>('h2')];
  const rail = mountReadingRail(headings);
  const nodes = document.querySelectorAll('.reading-rail__node');
  expect(nodes.length).toBeLessThanOrEqual(48);
  expect(nodes[0].getAttribute('data-heading')).toBe('chapter-0');
  expect(nodes[nodes.length - 1].getAttribute('data-heading')).toBe('chapter-79');
  rail.dispose();
});

it('stops ongoing motion when the reduced-motion preference changes', () => {
  document.body.innerHTML =
    '<article class="prose"><h2 id="one">One</h2></article><aside class="toc" data-reading-default="true"><p class="toc__label">Outline</p><ul class="toc__list"><a class="toc__link" href="#one">One</a></ul></aside>';
  let change = () => {};
  const preference = {
    matches: false,
    addEventListener: (_event: string, listener: () => void) => {
      change = listener;
    },
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('matchMedia', (query: string) =>
    query.includes('reduced-motion')
      ? preference
      : { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() },
  );
  const request = vi.fn(() => 17);
  const cancel = vi.fn();
  vi.stubGlobal('requestAnimationFrame', request);
  vi.stubGlobal('cancelAnimationFrame', cancel);
  vi.spyOn(document.querySelector('.prose')!, 'getBoundingClientRect').mockReturnValue({
    top: -1000,
    height: 5000,
  } as DOMRect);
  const rail = mountReadingRail([...document.querySelectorAll<HTMLElement>('h2')]);
  rail.update(0);
  expect(request).toHaveBeenCalled();
  preference.matches = true;
  change();
  expect(cancel).toHaveBeenCalledWith(17);
  expect(Number(document.querySelector('.reading-rail__marker')!.getAttribute('cy'))).toBeGreaterThan(20);
  rail.dispose();
  expect(preference.removeEventListener).toHaveBeenCalled();
});
