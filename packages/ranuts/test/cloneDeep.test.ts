import { describe, expect, test } from 'vitest';
import { cloneDeep } from '../src/utils/obj';

describe('cloneDeep', () => {
  // primitives
  test('clones primitives', () => {
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep('hello')).toBe('hello');
    expect(cloneDeep(true)).toBe(true);
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(undefined)).toBe(undefined);
  });

  // arrays
  test('clones arrays', () => {
    const original = [1, 2, 3];
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original); // not the same reference

    // Mutating the clone must not affect the original
    cloned.push(4);
    expect(original.length).toBe(3);
  });

  // nested arrays
  test('clones nested arrays', () => {
    const original = [1, [2, 3], [4, [5, 6]]];
    const cloned: any = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned[1]).not.toBe(original[1]); // the nested array was cloned too

    // Mutate the nested array
    cloned[2][1] = [7, 8];
    expect((original[2] as number[])[1]).toEqual([5, 6]);
  });

  // objects
  test('clones objects', () => {
    const original = { a: 1, b: 2, c: 3 };
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);

    // Mutating the clone must not affect the original
    cloned.a = 100;
    expect(original.a).toBe(1);
  });

  // nested objects
  test('clones nested objects', () => {
    const original = { a: 1, b: { c: 2, d: { e: 3 } } };
    const cloned = cloneDeep(original);

    expect(cloned).toEqual(original);
    expect(cloned.b).not.toBe(original.b); // the nested object was cloned too

    // Mutate the nested object
    cloned.b.c = 100;
    expect(original.b.c).toBe(2);
  });

  // Date
  test('clones Date objects', () => {
    const original = new Date('2023-01-01');
    const cloned = cloneDeep(original);

    expect(cloned.getTime()).toBe(original.getTime());
    expect(cloned).not.toBe(original);
  });

  // RegExp
  test('clones regular expressions', () => {
    const original = /test/gi;
    const cloned = cloneDeep(original);

    expect(cloned.source).toBe(original.source);
    expect(cloned.flags).toBe(original.flags);
    expect(cloned).not.toBe(original);
  });

  // Map
  test('clones Maps', () => {
    const original = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    const cloned = cloneDeep(original);

    expect(cloned.get('a')).toBe(1);
    expect(cloned.get('b')).toBe(2);
    expect(cloned).not.toBe(original);

    // Mutating the cloned Map must not affect the original
    cloned.set('a', 100);
    expect(original.get('a')).toBe(1);
  });

  // Set
  test('clones Sets', () => {
    const original = new Set([1, 2, 3]);
    const cloned = cloneDeep(original);

    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(2)).toBe(true);
    expect(cloned.has(3)).toBe(true);
    expect(cloned).not.toBe(original);

    // Mutating the cloned Set must not affect the original
    cloned.add(4);
    expect(original.has(4)).toBe(false);
  });

  // circular references
  test('clones circular references', () => {
    const original: any = { a: 1, b: 2 };
    original.self = original;

    const cloned = cloneDeep(original);

    expect(cloned.a).toBe(1);
    expect(cloned.b).toBe(2);
    expect(cloned.self).toBe(cloned); // the circular reference points at the clone itself
    expect(cloned.self).not.toBe(original);
  });

  // circular references in arrays
  test('clones circular references inside arrays', () => {
    const original: any[] = [1, 2];
    original.push(original);

    const cloned = cloneDeep(original);

    expect(cloned[0]).toBe(1);
    expect(cloned[1]).toBe(2);
    expect(cloned[2]).toBe(cloned); // the circular reference points at the cloned array itself
    expect(cloned[2]).not.toBe(original);
  });

  // complex nested structures
  test('clones a complex nested structure', () => {
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

    // Mutating the clone must not affect the original
    cloned.b[2].c = 400;
    expect((original.b[2] as { c: number }).c).toBe(4);
  });

  // symbol-keyed objects
  test('clones objects with symbol keys', () => {
    const sym = Symbol('test');
    const original = { [sym]: 'symbol value' };
    const cloned = cloneDeep(original);

    expect(cloned[sym]).toBe('symbol value');
    expect(cloned).not.toBe(original);
  });

  // custom class instances
  test('clones custom class instances', () => {
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

    // Mutating the clone must not affect the original
    cloned.name = 'Jane';
    expect(original.name).toBe('John');
    expect(cloned.greet()).toBe("Hello, I'm Jane!");
  });
});
