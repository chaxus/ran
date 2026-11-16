import { describe, expect, it } from 'vitest';
import { parseChineseNumber, parseEnglishNumber, parseRomanNumber, toFullWidth, toHalfWidth } from '@/utils';

describe('toHalfWidth / toFullWidth', () => {
  it('normalizes full-width digits, letters and punctuation', () => {
    expect(toHalfWidth('123')).toBe('123');
    expect(toHalfWidth('ABC')).toBe('ABC');
    expect(toHalfWidth('（1）')).toBe('(1)');
  });

  it('normalizes the ideographic space to a regular space', () => {
    expect(toHalfWidth('a b')).toBe('a b');
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
    expect(parseChineseNumber('12')).toBe(12);
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

  it('accumulates consecutive digits (二零二四 → 2024)', () => {
    expect(parseChineseNumber('二零二四')).toBe(2024);
    expect(parseChineseNumber('一二三')).toBe(123);
  });

  it('expands abbreviated trailing digits (一百一 → 110)', () => {
    expect(parseChineseNumber('一百一')).toBe(110);
    expect(parseChineseNumber('一千二')).toBe(1200);
    expect(parseChineseNumber('一万五')).toBe(15000);
    expect(parseChineseNumber('一百零一')).toBe(101);
  });

  it('treats a bare unit as one of that unit (百 → 100)', () => {
    expect(parseChineseNumber('十')).toBe(10);
    expect(parseChineseNumber('百')).toBe(100);
    expect(parseChineseNumber('千')).toBe(1000);
    expect(parseChineseNumber('万')).toBe(10000);
    expect(parseChineseNumber('亿')).toBe(100_000_000);
  });

  it('parses 亿 / 億 and mixes with 万', () => {
    expect(parseChineseNumber('一亿')).toBe(100_000_000);
    expect(parseChineseNumber('三億')).toBe(300_000_000);
    expect(parseChineseNumber('一亿两千万')).toBe(120_000_000);
    expect(parseChineseNumber('一亿零一万')).toBe(100_010_000);
    expect(parseChineseNumber('一亿五')).toBe(150_000_000);
  });

  it('parses 廿 / 卅 / 卌 as 20 / 30 / 40', () => {
    expect(parseChineseNumber('廿')).toBe(20);
    expect(parseChineseNumber('廿三')).toBe(23);
    expect(parseChineseNumber('卅二')).toBe(32);
    expect(parseChineseNumber('卌')).toBe(40);
    expect(parseChineseNumber('廿万')).toBe(200_000);
  });

  it('stacks sections (一万亿 → 1e12)', () => {
    expect(parseChineseNumber('一万亿')).toBe(1_000_000_000_000);
    expect(parseChineseNumber('一千万亿')).toBe(1_000_000_000_000_000);
    expect(parseChineseNumber('三万五千亿')).toBe(3_500_000_000_000);
    expect(parseChineseNumber('百万')).toBe(1_000_000);
    expect(parseChineseNumber('千万')).toBe(10_000_000);
    expect(parseChineseNumber('十万')).toBe(100_000);
    expect(parseChineseNumber('一亿零五')).toBe(100_000_005);
    expect(parseChineseNumber('九千九百九十九万九千九百九十九')).toBe(99_999_999);
  });

  it('returns null for repeated or out-of-order units instead of a guess', () => {
    for (const input of ['一百百', '千千', '十十', '一十十', '万万', '一亿亿', '一十百', '一百二零', '零百']) {
      expect(parseChineseNumber(input), input).toBeNull();
    }
  });

  it('lets only the first character be a bare unit', () => {
    expect(parseChineseNumber('百五')).toBe(150);
    expect(parseChineseNumber('一百十')).toBe(110);
    expect(parseChineseNumber('一千百')).toBeNull();
    expect(parseChineseNumber('一万千')).toBeNull();
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
