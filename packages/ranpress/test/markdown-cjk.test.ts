/**
 * A hard-wrapped CJK paragraph must not gain a space where the line broke.
 *
 * This regressed once already: the VitePress build overrode `softbreak` to drop the
 * newline between two CJK characters, the replacement did not, and 114 stray spaces
 * appeared across the Chinese pages of the first 120 files alone — invisible in the
 * markdown, visible in every rendered paragraph as `分 就`.
 */
import { describe, expect, it } from 'vitest';
import { collapseCjkSoftbreaks } from '../src/markdown.ts';

describe('collapseCjkSoftbreaks', () => {
  it('drops the break between two Chinese characters', () => {
    expect(collapseCjkSoftbreaks('这一部分\n就是这样')).toBe('这一部分就是这样');
  });

  it('drops it after CJK punctuation too', () => {
    expect(collapseCjkSoftbreaks('很好，\n它会工作')).toBe('很好，它会工作');
  });

  it('collapses every break in a run, not just the first', () => {
    expect(collapseCjkSoftbreaks('甲\n乙\n丙')).toBe('甲乙丙');
  });

  it('keeps the break when either side is Latin', () => {
    // The source style already spaces these, so removing it would join two words.
    expect(collapseCjkSoftbreaks('框架版本。\nTypeScript 类型')).toBe('框架版本。\nTypeScript 类型');
    expect(collapseCjkSoftbreaks('React、Vue、\nSvelte')).toBe('React、Vue、\nSvelte');
    expect(collapseCjkSoftbreaks('one\ntwo')).toBe('one\ntwo');
  });

  it('handles Japanese kana and full-width forms', () => {
    expect(collapseCjkSoftbreaks('コンポーネント\nです')).toBe('コンポーネントです');
  });

  it('leaves text without a break alone', () => {
    expect(collapseCjkSoftbreaks('一个建立在原生自定义元素之上的组件库')).toBe('一个建立在原生自定义元素之上的组件库');
  });
});
