// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { autosizeTextarea } from '@/utils';

/**
 * jsdom has no layout engine, so `scrollHeight` is always 0. Stub it with a value derived from
 * the content — the point under test is the reset-measure-apply cycle, not real text metrics.
 */
const LINE_HEIGHT = 20;
const stubScrollHeight = (el: HTMLTextAreaElement): void => {
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get(): number {
      return (el.value.split('\n').length || 1) * LINE_HEIGHT;
    },
  });
};

const makeTextarea = (): HTMLTextAreaElement => {
  const el = document.createElement('textarea');
  document.body.append(el);
  stubScrollHeight(el);
  return el;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('autosizeTextarea', () => {
  it('sizes the element once on attach, before any input', () => {
    const el = makeTextarea();
    el.value = 'one\ntwo';
    autosizeTextarea(el);
    expect(el.style.height).toBe('40px');
  });

  it('grows as lines are added', () => {
    const el = makeTextarea();
    autosizeTextarea(el);
    expect(el.style.height).toBe('20px');

    el.value = 'a\nb\nc';
    el.dispatchEvent(new Event('input'));
    expect(el.style.height).toBe('60px');
  });

  it('shrinks again when content is removed', () => {
    const el = makeTextarea();
    autosizeTextarea(el);
    el.value = 'a\nb\nc\nd';
    el.dispatchEvent(new Event('input'));
    expect(el.style.height).toBe('80px');

    // The height must be reset to auto before measuring, or scrollHeight can only ever grow.
    el.value = 'a';
    el.dispatchEvent(new Event('input'));
    expect(el.style.height).toBe('20px');
  });

  it('stops listening and restores the original height when disposed', () => {
    const el = makeTextarea();
    el.style.height = '99px';
    const stop = autosizeTextarea(el);
    expect(el.style.height).toBe('20px');

    stop();
    expect(el.style.height).toBe('99px');

    el.value = 'a\nb\nc';
    el.dispatchEvent(new Event('input'));
    expect(el.style.height).toBe('99px');
  });

  it('adds the border back only for content-box sizing', () => {
    const el = makeTextarea();
    const spy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      boxSizing: 'content-box',
      borderTopWidth: '2px',
      borderBottomWidth: '3px',
    } as unknown as CSSStyleDeclaration);

    autosizeTextarea(el);
    expect(el.style.height).toBe('25px');
    spy.mockRestore();
  });
});
