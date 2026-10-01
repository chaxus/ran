// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { searchResult, searchSnippet } from '../client/search';
import { interactionCopy } from '../client/copy';

it('highlights raw special characters without interpreting markup or corrupting entities', () => {
  const text = '<img src=x onerror="alert(1)"> &amp; C++ [a.b]';
  const result = searchSnippet(text, ['<img', '&amp;', 'C++', '[a.b]']);
  expect(result.textContent).toBe(text);
  expect(result.querySelector('img')).toBeNull();
  expect([...result.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual([
    '<img',
    '&amp;',
    'C++',
    '[a.b]',
  ]);
});

it('uses longest literal matches in a single pass without nested marks', () => {
  const result = searchSnippet('Button button mark market', ['button', 'but', 'mark', 'market', 'button']);
  expect(result.textContent).toBe('Button button mark market');
  expect([...result.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual([
    'Button',
    'button',
    'mark',
    'market',
  ]);
  expect(result.querySelector('mark mark')).toBeNull();
});

it('keeps snippet context, ellipses and short-term highlight policy', () => {
  const text = 'a'.repeat(100) + 'TARGET' + 'z'.repeat(200);
  const result = searchSnippet(text, ['target']);
  expect(result.textContent).toBe('…' + text.slice(60, 210) + '…');
  expect(result.querySelector('mark')!.textContent).toBe('TARGET');
  expect(searchSnippet('a & <b>', ['a', '&']).querySelector('mark')).toBeNull();
});

it('renders result text and attributes safely while retaining keyboard identifiers and categories', () => {
  const hit = {
    id: 'one',
    score: 1,
    text: '',
    title: '<img src=x>',
    page: 'A & B',
    url: '/src/ranui/api#button?value="<x>',
    preview: 'Source code: private\nUse <button> & friends',
  };
  const result = searchResult(hit, 3, true, ['<button>'], interactionCopy('en'));
  expect(result.id).toBe('search-option-3');
  expect(result.getAttribute('aria-selected')).toBe('true');
  const link = result.querySelector('a')!;
  expect(link.getAttribute('href')).toBe(hit.url);
  expect(link.getAttribute('tabindex')).toBe('-1');
  expect(link.hasAttribute('data-active')).toBe(true);
  expect(result.querySelector('.search-hit__title')!.textContent).toBe(hit.title);
  expect(result.querySelector('.search-hit__kind')!.textContent).toBe(interactionCopy('en').reference);
  expect(result.querySelector('.search-hit__text')!.textContent).toBe('Use <button> & friends');
  expect(result.querySelector('img, button')).toBeNull();
  expect(searchResult(hit, 0, false, [], interactionCopy('en')).querySelector('a')!.hasAttribute('data-active')).toBe(
    false,
  );
});
