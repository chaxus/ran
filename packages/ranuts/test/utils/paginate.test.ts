import { describe, expect, it } from 'vitest';
import { paginateText } from '@/utils';

/** 10 chars per line, 4 lines per page → 40 cells */
const BOX = { width: 100, height: 80 };
const METRICS = { charWidth: 10, lineHeight: 20 };

const paginate = (text: string, box = BOX, metrics = METRICS) => paginateText(text, box, metrics);

describe('paginateText — the derived grid', () => {
  it('derives lines and columns from the box and the metrics', () => {
    const result = paginate('a');
    expect(result.charsPerLine).toBe(10);
    expect(result.linesPerPage).toBe(4);
    expect(result.charsPerPage).toBe(40);
  });

  it('reports the normalized length, collapsing CRLF runs', () => {
    expect(paginate('a\r\n\r\nb').total).toBe(3);
  });
});

describe('paginateText — cutting', () => {
  it('reassembles exactly to the source text', () => {
    const text = '中'.repeat(250);
    const result = paginate(text);
    expect(result.pages.map((p) => p.text).join('')).toBe(text);
  });

  it('gives每页 charsPerPage 个全角字符', () => {
    const result = paginate('中'.repeat(120));
    expect(result.pages).toHaveLength(3);
    expect(result.pages[0].text).toHaveLength(40);
  });

  it('numbers pages and makes offsets contiguous', () => {
    const result = paginate('中'.repeat(120));
    expect(result.pages.map((p) => p.index)).toEqual([0, 1, 2]);
    for (let i = 1; i < result.pages.length; i++) {
      expect(result.pages[i].start).toBe(result.pages[i - 1].end);
    }
    expect(result.pages.at(-1)?.end).toBe(result.total);
  });

  it('slices match the offsets it reports', () => {
    const text = '中'.repeat(90);
    const result = paginate(text);
    for (const page of result.pages) {
      expect(text.slice(page.start, page.end)).toBe(page.text);
    }
  });

  it('starts a new line at a newline', () => {
    // 4 newline-terminated lines fill a page even though almost no cells are used
    const result = paginate('a\nb\nc\nd\ne\n');
    expect(result.pages.length).toBeGreaterThan(1);
  });

  it('returns one page for text that fits', () => {
    const result = paginate('中'.repeat(10));
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toMatchObject({ start: 0, index: 0 });
  });

  it('returns no pages for empty text', () => {
    expect(paginate('').pages).toEqual([]);
  });
});

describe('paginateText — word handling', () => {
  it('charges ASCII characters the narrow advance, so a Latin line holds more', () => {
    const latin = paginate('abcdefghij '.repeat(20));
    const cjk = paginate('中'.repeat(220));
    expect(latin.pages[0].text.length).toBeGreaterThan(cjk.pages[0].text.length);
  });

  it('does not end a page in the middle of a word', () => {
    const result = paginate('alpha bravo charlie delta echo foxtrot golf hotel india juliet');
    for (const page of result.pages.slice(0, -1)) {
      // 上一页结尾要么是空白，要么下一页开头是空白 —— 总之不能把词切开
      const endsClean = /\s$/.test(page.text);
      const nextStartsClean = /^\s/.test(result.pages[page.index + 1]?.text ?? ' ');
      expect(endsClean || nextStartsClean).toBe(true);
    }
  });

  it('breaks a word that cannot fit on any line', () => {
    // 单词比整行还长时只能硬切，否则永远放不下
    const result = paginate(`${'x'.repeat(200)} end`);
    expect(result.pages.length).toBeGreaterThan(0);
    expect(result.pages.map((p) => p.text).join('')).toBe(`${'x'.repeat(200)} end`);
  });

  it('honours a custom narrowRatio', () => {
    const wide = paginateText('abcdefghij '.repeat(20), BOX, { ...METRICS, narrowRatio: 1 });
    const narrow = paginateText('abcdefghij '.repeat(20), BOX, { ...METRICS, narrowRatio: 0.5 });
    expect(narrow.pages[0].text.length).toBeGreaterThan(wide.pages[0].text.length);
  });
});

describe('paginateText — degenerate input', () => {
  it('returns nothing for a box that has not been laid out yet', () => {
    // 回归：首屏容器还是 0 时不能去分页，floor(0 / charWidth) 会让循环空转
    const result = paginateText('中'.repeat(100), { width: 0, height: 0 }, METRICS);
    expect(result).toMatchObject({ pages: [], charsPerLine: 0, linesPerPage: 0 });
    expect(result.total).toBe(100);
  });

  it('respects a custom minBox', () => {
    expect(paginateText('abc', { width: 40, height: 40 }, METRICS, { minBox: 50 }).pages).toEqual([]);
    expect(paginateText('abc', { width: 40, height: 40 }, METRICS, { minBox: 10 }).pages).toHaveLength(1);
  });

  it('refuses nonsensical metrics rather than looping', () => {
    expect(paginateText('abc', BOX, { charWidth: 0, lineHeight: 20 }).pages).toEqual([]);
    expect(paginateText('abc', BOX, { charWidth: 10, lineHeight: 0 }).pages).toEqual([]);
  });

  it('terminates when a box holds less than one character', () => {
    const result = paginateText('中'.repeat(50), { width: 31, height: 31 }, { charWidth: 40, lineHeight: 40 });
    expect(result.pages).toEqual([]);
  });

  it('handles a million characters without pathological slowdown', () => {
    const started = Date.now();
    const result = paginate('中'.repeat(1_000_000));
    expect(result.pages).toHaveLength(25_000);
    expect(Date.now() - started).toBeLessThan(3000);
  });
});
