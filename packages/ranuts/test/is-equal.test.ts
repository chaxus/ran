import { describe, expect, test } from 'vitest';
import { isEqual } from '../src/utils/obj';

describe('isEqual 函数测试', () => {
  // 测试基本类型
  test('基本类型比较', () => {
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

  // 测试特殊值
  test('特殊值比较', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(true);
    expect(isEqual(-0, -0)).toBe(true);
    expect(isEqual(0, 0)).toBe(true);
  });

  // 测试数组
  test('数组比较', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(isEqual([], [])).toBe(true);
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
  });

  // 测试对象
  test('对象比较', () => {
    expect(isEqual({}, {})).toBe(true);
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(isEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(true);
    expect(isEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })).toBe(false);
  });

  // 测试嵌套对象
  test('嵌套对象比较', () => {
    const obj1 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
    const obj2 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
    const obj3 = { a: 1, b: { c: 2, d: [3, 4, { e: 6 }] } };

    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  // 测试日期对象
  test('日期对象比较', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01');
    const date3 = new Date('2023-01-02');

    expect(isEqual(date1, date2)).toBe(true);
    expect(isEqual(date1, date3)).toBe(false);
  });

  // 测试正则表达式
  test('正则表达式比较', () => {
    expect(isEqual(/abc/, /abc/)).toBe(true);
    expect(isEqual(/abc/g, /abc/g)).toBe(true);
    expect(isEqual(/abc/, /def/)).toBe(false);
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  // 测试 Map 对象
  test('Map 对象比较', () => {
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

  // 测试 Set 对象
  test('Set 对象比较', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3]);
    const set3 = new Set([1, 2, 4]);

    expect(isEqual(set1, set2)).toBe(true);
    expect(isEqual(set1, set3)).toBe(false);
  });

  // 测试循环引用
  test('循环引用比较', () => {
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

  // 测试混合对象
  test('混合类型对象比较', () => {
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
