// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { mountReadingRail } from '../client/reading-rail';
afterEach(() => {
  document.body.innerHTML = '';
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
