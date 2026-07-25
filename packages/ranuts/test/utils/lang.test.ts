import { describe, expect, it } from 'vitest';
import { detectLanguage } from '@/utils';

describe('detectLanguage', () => {
  it('detects Chinese', () => {
    expect(detectLanguage('滚滚长江东逝水，浪花淘尽英雄。')).toBe('zh');
  });

  it('detects English', () => {
    expect(detectLanguage('I went to the woods because I wished to live deliberately.')).toBe('en');
  });

  it('keeps Chinese text with a bit of English as Chinese', () => {
    expect(detectLanguage('这是一段中文正文，中间夹了 some English words 作为引用。')).toBe('zh');
  });

  it('returns other when there is no CJK or Latin at all', () => {
    expect(detectLanguage('123 —— 456 ??? !!!')).toBe('other');
    expect(detectLanguage('')).toBe('other');
    expect(detectLanguage('こんにちは')).toBe('other');
  });

  it('only inspects the sample window', () => {
    const text = `${'a'.repeat(50)}${'中'.repeat(5000)}`;
    expect(detectLanguage(text, 50)).toBe('en');
    expect(detectLanguage(text)).toBe('zh');
  });
});
