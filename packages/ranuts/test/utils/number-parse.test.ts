import { describe, expect, it } from 'vitest';
import { parseChineseNumber, parseEnglishNumber, parseRomanNumber, toFullWidth, toHalfWidth } from '@/utils';

describe('toHalfWidth / toFullWidth', () => {
  it('normalizes full-width digits, letters and punctuation', () => {
    expect(toHalfWidth('１２３')).toBe('123');
    expect(toHalfWidth('ＡＢＣ')).toBe('ABC');
    expect(toHalfWidth('（１）')).toBe('(1)');
  });

  it('normalizes the ideographic space to a regular space', () => {
    expect(toHalfWidth('a　b')).toBe('a b');
  });

  it('leaves CJK characters untouched', () => {
    expect(toHalfWidth('第三章')).toBe('第三章');
  });

  it('round-trips through toFullWidth', () => {
    expect(toHalfWidth(toFullWidth('abc 123!'))).toBe('abc 123!');
  });
});

describe('parseChineseNumber', () => {
  it('parses plain digits, including full-width', () => {
    expect(parseChineseNumber('42')).toBe(42);
    expect(parseChineseNumber('１２')).toBe(12);
  });

  it('parses units', () => {
    expect(parseChineseNumber('一')).toBe(1);
    expect(parseChineseNumber('十')).toBe(10);
    expect(parseChineseNumber('十五')).toBe(15);
    expect(parseChineseNumber('二十三')).toBe(23);
    expect(parseChineseNumber('一百零三')).toBe(103);
    expect(parseChineseNumber('一千零一')).toBe(1001);
    expect(parseChineseNumber('三万')).toBe(30000);
    expect(parseChineseNumber('两百')).toBe(200);
  });

  it('accepts the traditional 萬', () => {
    expect(parseChineseNumber('三萬')).toBe(30000);
  });

  it('trims surrounding whitespace', () => {
    expect(parseChineseNumber('  二十  ')).toBe(20);
  });

  it('returns null rather than a guess when anything is unrecognized', () => {
    expect(parseChineseNumber('第三章')).toBeNull();
    expect(parseChineseNumber('abc')).toBeNull();
    expect(parseChineseNumber('')).toBeNull();
  });
});

describe('parseRomanNumber', () => {
  it('parses additive and subtractive notation', () => {
    expect(parseRomanNumber('I')).toBe(1);
    expect(parseRomanNumber('IV')).toBe(4);
    expect(parseRomanNumber('XIV')).toBe(14);
    expect(parseRomanNumber('MCMXCIV')).toBe(1994);
  });

  it('is case-insensitive', () => {
    expect(parseRomanNumber('mcmxciv')).toBe(1994);
  });

  it('rejects non-roman input', () => {
    expect(parseRomanNumber('12')).toBeNull();
    expect(parseRomanNumber('XIVZ')).toBeNull();
    expect(parseRomanNumber('')).toBeNull();
  });
});

describe('parseEnglishNumber', () => {
  it('accepts digits, number words and roman numerals', () => {
    expect(parseEnglishNumber('7')).toBe(7);
    expect(parseEnglishNumber('Three')).toBe(3);
    expect(parseEnglishNumber('TWENTY')).toBe(20);
    expect(parseEnglishNumber('XII')).toBe(12);
  });

  it('returns null for anything else', () => {
    expect(parseEnglishNumber('thirty')).toBeNull();
    expect(parseEnglishNumber('chapter')).toBeNull();
  });
});
