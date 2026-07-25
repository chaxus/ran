import { describe, expect, test } from 'vitest';
import { isEqual } from '../src/utils/obj';

describe('isEqual', () => {
  // primitives
  test('compares primitives', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('a', 'a')).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual('a', 'b')).toBe(false);
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
  });

  // special values
  test('compares special values', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(true);
    expect(isEqual(-0, -0)).toBe(true);
    expect(isEqual(0, 0)).toBe(true);
  });

  // arrays
  test('compares arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(isEqual([], [])).toBe(true);
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
  });

  // objects
  test('compares objects', () => {
    expect(isEqual({}, {})).toBe(true);
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(isEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(true);
    expect(isEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })).toBe(false);
  });

  // nested objects
  test('compares nested objects', () => {
    const obj1 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
    const obj2 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
    const obj3 = { a: 1, b: { c: 2, d: [3, 4, { e: 6 }] } };

    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  // Date
  test('compares Date objects', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(isEqual(date1, date2)).toBe(true);
    expect(isEqual(date1, date3)).toBe(false);
  });

  // RegExp
  test('compares regular expressions', () => {
    expect(isEqual(/abc/, /abc/)).toBe(true);
    expect(isEqual(/abc/g, /abc/g)).toBe(true);
    expect(isEqual(/abc/, /def/)).toBe(false);
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  // Map
  test('compares Maps', () => {
    const map1 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map2 = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const map3 = new Map([
      ['a', 1],
      ['b', 3],
    ]);

    expect(isEqual(map1, map2)).toBe(true);
    expect(isEqual(map1, map3)).toBe(false);
  });

  // Set
  test('compares Sets', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);

    expect(isEqual(set1, set2)).toBe(true);
    expect(isEqual(set1, set3)).toBe(false);
  });

  // circular references
  test('compares circular references', () => {
    const obj1: any = { a: 1 };
    const obj2: any = { a: 1 };
    obj1.self = obj1;
    obj2.self = obj2;

    expect(isEqual(obj1, obj2)).toBe(true);

    const arr1: any[] = [1, 2];
    const arr2: any[] = [1, 2];
    arr1.push(arr1);
    arr2.push(arr2);

    expect(isEqual(arr1, arr2)).toBe(true);
  });

  // mixed structures
  test('compares mixed-type objects', () => {
    const obj1 = {
      a: 1,
      b: 'string',
      c: true,
      d: [1, 2, { e: 3 }],
      f: { g: 4, h: [5, 6] },
      i: new Date('2023-01-01'),
      j: /test/g,
      k: new Map([['key', 'value']]),
      l: new Set([1, 2, 3]),
    };

    const obj2 = {
      a: 1,
      b: 'string',
      c: true,
      d: [1, 2, { e: 3 }],
      f: { g: 4, h: [5, 6] },
      i: new Date('2023-01-01'),
      j: /test/g,
      k: new Map([['key', 'value']]),
      l: new Set([1, 2, 3]),
    };

    expect(isEqual(obj1, obj2)).toBe(true);
  });
});
