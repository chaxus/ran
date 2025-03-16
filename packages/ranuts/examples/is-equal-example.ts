/**
 * isEqual 函数使用示例
 */
import { isEqual } from '../src/utils/obj';

// 基本类型比较
console.log('=== 基本类型比较 ===');
console.log('1 === 1:', isEqual(1, 1)); // true
console.log('1 === 2:', isEqual(1, 2)); // false
console.log('NaN === NaN:', isEqual(NaN, NaN)); // true
console.log('0 === -0:', isEqual(0, -0)); // false (Lodash 中应该是 false)

// 数组比较
console.log('\n=== 数组比较 ===');
console.log('[1, 2, 3] === [1, 2, 3]:', isEqual([1, 2, 3], [1, 2, 3])); // true
console.log('[1, 2, 3] === [1, 2, 4]:', isEqual([1, 2, 3], [1, 2, 4])); // false
console.log('嵌套数组：[1, [2, 3]] === [1, [2, 3]]:', isEqual([1, [2, 3]], [1, [2, 3]])); // true

// 对象比较
console.log('\n=== 对象比较 ===');
console.log('空对象：{} === {}:', isEqual({}, {})); // true
console.log('简单对象：{a: 1} === {a: 1}:', isEqual({ a: 1 }, { a: 1 })); // true
console.log('简单对象：{a: 1} === {a: 2}:', isEqual({ a: 1 }, { a: 2 })); // false

// 嵌套对象比较
console.log('\n=== 嵌套对象比较 ===');
const complexObj1 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
const complexObj2 = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
const complexObj3 = { a: 1, b: { c: 2, d: [3, 4, { e: 6 }] } };
console.log('嵌套对象 (相同):', isEqual(complexObj1, complexObj2)); // true
console.log('嵌套对象 (不同):', isEqual(complexObj1, complexObj3)); // false

// 特殊对象类型比较
console.log('\n=== 特殊对象比较 ===');
console.log(
  '日期：new Date(2023, 0, 1) === new Date(2023, 0, 1):',
  isEqual(new Date(2023, 0, 1), new Date(2023, 0, 1)),
); // true

console.log('正则：/abc/ === /abc/:', isEqual(/abc/, /abc/)); // true
console.log('正则：/abc/g === /abc/i:', isEqual(/abc/g, /abc/i)); // false

// Map 和 Set 比较
console.log('\n=== Map 和 Set 比较 ===');
const map1 = new Map([
  ['a', 1],
  ['b', 2],
]);
const map2 = new Map([
  ['a', 1],
  ['b', 2],
]);
console.log('Map 比较：', isEqual(map1, map2)); // true

const set1 = new Set([1, 2, 3]);
const set2 = new Set([1, 2, 3]);
console.log('Set 比较：', isEqual(set1, set2)); // true

// 循环引用比较
console.log('\n=== 循环引用比较 ===');
const circular1: any = { a: 1 };
const circular2: any = { a: 1 };
circular1.self = circular1;
circular2.self = circular2;

console.log('循环引用对象比较：', isEqual(circular1, circular2)); // true

// 混合对象比较
console.log('\n=== 混合对象比较 ===');
const mixedObj1 = {
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

const mixedObj2 = {
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

console.log('混合对象比较：', isEqual(mixedObj1, mixedObj2)); // true
