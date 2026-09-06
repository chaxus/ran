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

  // Kana is what separates Japanese from Chinese: both write Han, only Japanese writes kana.
  it('detects Japanese from its kana', () => {
    expect(detectLanguage('こんにちは')).toBe('ja');
    expect(detectLanguage('吾輩は猫である。名前はまだ無い。')).toBe('ja');
    expect(detectLanguage('カタカナだけの文字列')).toBe('ja');
  });

  it('detects kanji-heavy Japanese, where kana is a minority of the characters', () => {
    // Technical Japanese runs low on kana; the particles still give it away.
    expect(detectLanguage('本日開催予定の技術検討会議の資料を作成した')).toBe('ja');
  });

  it('detects Korean', () => {
    expect(detectLanguage('동해물과 백두산이 마르고 닳도록')).toBe('ko');
    expect(detectLanguage('한글과 漢字를 섞어 쓴 문장')).toBe('ko');
  });

  // The whole point of a share threshold rather than a boolean: one quoted title must not
  // flip a document's verdict.
  it('does not flip on an incidental quotation', () => {
    const chinese = `${'中文正文内容反复出现。'.repeat(40)}其中引用了《君の名は》这部电影。`;
    expect(detectLanguage(chinese)).toBe('zh');
  });

  it('returns other when there is no CJK or Latin at all', () => {
    expect(detectLanguage('123 —— 456 ??? !!!')).toBe('other');
    expect(detectLanguage('')).toBe('other');
    expect(detectLanguage('Здравствуйте')).toBe('other');
  });

  it('only inspects the sample window', () => {
    const text = `${'a'.repeat(50)}${'中'.repeat(5000)}`;
    expect(detectLanguage(text, 50)).toBe('en');
    expect(detectLanguage(text)).toBe('zh');
  });
});
