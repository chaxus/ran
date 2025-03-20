import { describe, expect, test } from 'vitest';
import { cloneDeep } from '../src/utils/obj';

describe('cloneDeep 函数测试', () => {
  // 测试基本类型
  test('基本类型克隆', () => {
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep('hello')).toBe('hello');
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(undefined)).toBe(undefined);
  });

  // 测试数组
  test('数组克隆', () => {
    const original = [1, 2, 3];
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original); // 确保不是同一个引用

    // 修改克隆后的数组不应影响原数组
    cloned.push(4);
    expect(original.length).toBe(3);
  });

  // 测试嵌套数组
  test('嵌套数组克隆', () => {
    const original = [1, [2, 3], [4, [5, 6]]];
    const cloned: any = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned[1]).not.toBe(original[1]); // 确保嵌套数组也被克隆

    // 修改嵌套数组
    cloned[2][1] = [7, 8];
    expect((original[2] as number[])[1]).toEqual([5, 6]);
  });

  // 测试对象
  test('对象克隆', () => {
    const original = { a: 1, b: 2, c: 3 };
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // 修改克隆后的对象不应影响原对象
    cloned.a = 100;
    expect(original.a).toBe(1);
  });

  // 测试嵌套对象
  test('嵌套对象克隆', () => {
    const original = { a: 1, b: { c: 2, d: { e: 3 } } };
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned.b).not.toBe(original.b); // 确保嵌套对象也被克隆

    // 修改嵌套对象
    cloned.b.c = 100;
    expect(original.b.c).toBe(2);
  });

  // 测试日期对象
  test('日期对象克隆', () => {
    const original = new Date('2023-01-01');
    const cloned = cloneDeep(original);

    expect(cloned.getTime()).toBe(original.getTime());
    expect(cloned).not.toBe(original);
  });

  // 测试正则表达式
  test('正则表达式克隆', () => {
    const original = /test/gi;
    const cloned = cloneDeep(original);

    expect(cloned.source).toBe(original.source);
    expect(cloned.flags).toBe(original.flags);
    expect(cloned).not.toBe(original);
  });

  // 测试 Map 对象
  test('Map 对象克隆', () => {
    const original = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const cloned = cloneDeep(original);

    expect(cloned.get('a')).toBe(1);
    expect(cloned.get('b')).toBe(2);
    expect(cloned).not.toBe(original);

    // 修改克隆后的 Map 不应影响原 Map
    cloned.set('a', 100);
    expect(original.get('a')).toBe(1);
  });

  // 测试 Set 对象
  test('Set 对象克隆', () => {
    const original = new Set([1, 2, 3]);
    const cloned = cloneDeep(original);

    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(2)).toBe(true);
    expect(cloned.has(3)).toBe(true);
    expect(cloned).not.toBe(original);

    // 修改克隆后的 Set 不应影响原 Set
    cloned.add(4);
    expect(original.has(4)).toBe(false);
  });

  // 测试循环引用
  test('循环引用克隆', () => {
    const original: any = { a: 1, b: 2 };
    original.self = original;

    const cloned = cloneDeep(original);

    expect(cloned.a).toBe(1);
    expect(cloned.b).toBe(2);
    expect(cloned.self).toBe(cloned); // 循环引用应该指向克隆对象本身
    expect(cloned.self).not.toBe(original);
  });

  // 测试数组循环引用
  test('数组循环引用克隆', () => {
    const original: any[] = [1, 2];
    original.push(original);

    const cloned = cloneDeep(original);

    expect(cloned[0]).toBe(1);
    expect(cloned[1]).toBe(2);
    expect(cloned[2]).toBe(cloned); // 循环引用应该指向克隆数组本身
    expect(cloned[2]).not.toBe(original);
  });

  // 测试复杂嵌套结构
  test('复杂嵌套结构克隆', () => {
    const original: any = {
      a: 1,
      b: [2, 3, { c: 4 }],
      d: { e: 5, f: [6, 7] },
      g: new Map<string, number | number[] | { k: number }>([
        ['h', 8],
        ['i', [9, 10]],
        ['j', { k: 11 }],
      ]),
      l: new Set([12, [13, 14], { m: 15 }]),
    };

    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.b[2]).not.toBe(original.b[2]);
    expect(cloned.d).not.toBe(original.d);
    expect(cloned.d.f).not.toBe(original.d.f);
    expect(cloned.g).not.toBe(original.g);
    expect(cloned.l).not.toBe(original.l);

    // 修改克隆对象不影响原对象
    cloned.b[2].c = 400;
    expect((original.b[2] as { c: number }).c).toBe(4);
  });

  // 测试带有 Symbol 键的对象
  test('Symbol 键的对象克隆', () => {
    const sym = Symbol('test');
    const original = { [sym]: 'symbol value' };
    const cloned = cloneDeep(original);

    expect(cloned[sym]).toBe('symbol value');
    expect(cloned).not.toBe(original);
  });

  // 测试自定义类实例
  test('自定义类实例克隆', () => {
    class Person {
      name: string;
      age: number;

      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
      }

      greet() {
        return `Hello, I'm ${this.name}!`;
      }
    }

    const original = new Person('John', 30);
    const cloned = cloneDeep(original);

    expect(cloned.name).toBe('John');
    expect(cloned.age).toBe(30);
    expect(cloned.greet()).toBe("Hello, I'm John!");
    expect(cloned).not.toBe(original);

    // 修改克隆对象不影响原对象
    cloned.name = 'Jane';
    expect(original.name).toBe('John');
    expect(cloned.greet()).toBe("Hello, I'm Jane!");
  });
});
