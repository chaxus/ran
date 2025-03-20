/**
 * cloneDeep 函数使用示例
 */
import { cloneDeep } from '../src/utils/obj';

// 基本类型克隆
console.log('=== 基本类型克隆 ===');
console.log('原始值：42, 克隆后：', cloneDeep(42));
console.log('原始值："hello", 克隆后：', cloneDeep('hello'));
console.log('原始值：true, 克隆后：', cloneDeep(true));
console.log('原始值：null, 克隆后：', cloneDeep(null));
console.log('原始值：undefined, 克隆后：', cloneDeep(undefined));

// 数组克隆
console.log('\n=== 数组克隆 ===');
const arr = [1, 2, 3];
const clonedArr = cloneDeep(arr);
console.log('原始数组：', arr);
console.log('克隆数组：', clonedArr);
console.log('引用相同？', arr === clonedArr); // false

// 修改克隆后的数组不会影响原数组
clonedArr.push(4);
console.log('修改后的原始数组：', arr);
console.log('修改后的克隆数组：', clonedArr);

// 嵌套数组克隆
console.log('\n=== 嵌套数组克隆 ===');
const nestedArr = [1, [2, 3], [4, [5, 6]]];
const clonedNestedArr: any = cloneDeep(nestedArr);
console.log('原始嵌套数组：', nestedArr);
console.log('克隆嵌套数组：', clonedNestedArr);
console.log('引用相同？', nestedArr === clonedNestedArr); // false
console.log('内部数组引用相同？', nestedArr[1] === clonedNestedArr[1]); // false

// 修改克隆后的嵌套数组不会影响原数组
clonedNestedArr[1][0] = 200;
console.log('修改后的原始嵌套数组：', nestedArr);
console.log('修改后的克隆嵌套数组：', clonedNestedArr);

// 对象克隆
console.log('\n=== 对象克隆 ===');
const obj = { a: 1, b: 2, c: 3 };
const clonedObj = cloneDeep(obj);
console.log('原始对象：', obj);
console.log('克隆对象：', clonedObj);
console.log('引用相同？', obj === clonedObj); // false

// 修改克隆后的对象不会影响原对象
clonedObj.a = 100;
console.log('修改后的原始对象：', obj);
console.log('修改后的克隆对象：', clonedObj);

// 嵌套对象克隆
console.log('\n=== 嵌套对象克隆 ===');
const nestedObj = { a: 1, b: { c: 2, d: { e: 3 } } };
const clonedNestedObj = cloneDeep(nestedObj);
console.log('原始嵌套对象：', nestedObj);
console.log('克隆嵌套对象：', clonedNestedObj);
console.log('引用相同？', nestedObj === clonedNestedObj); // false
console.log('内部对象引用相同？', nestedObj.b === clonedNestedObj.b); // false

// 修改克隆后的嵌套对象不会影响原对象
clonedNestedObj.b.c = 200;
console.log('修改后的原始嵌套对象：', nestedObj);
console.log('修改后的克隆嵌套对象：', clonedNestedObj);

// 日期对象克隆
console.log('\n=== 日期对象克隆 ===');
const date = new Date('2023-01-01');
const clonedDate = cloneDeep(date);
console.log('原始日期：', date);
console.log('克隆日期：', clonedDate);
console.log('引用相同？', date === clonedDate); // false
console.log('值相同？', date.getTime() === clonedDate.getTime()); // true

// 正则表达式克隆
console.log('\n=== 正则表达式克隆 ===');
const regex = /test/gi;
const clonedRegex = cloneDeep(regex);
console.log('原始正则：', regex);
console.log('克隆正则：', clonedRegex);
console.log('引用相同？', regex === clonedRegex); // false
console.log('值相同？', regex.source === clonedRegex.source && regex.flags === clonedRegex.flags); // true

// Map 对象克隆
console.log('\n=== Map 对象克隆 ===');
const map = new Map([
  ['a', 1],
  ['b', 2],
]);
const clonedMap = cloneDeep(map);
console.log('原始 Map:', map);
console.log('克隆 Map:', clonedMap);
console.log('引用相同？', map === clonedMap); // false

// 修改克隆后的 Map 不会影响原 Map
clonedMap.set('a', 100);
console.log('修改后原始 Map 的 a 值：', map.get('a')); // 1
console.log('修改后克隆 Map 的 a 值：', clonedMap.get('a')); // 100

// Set 对象克隆
console.log('\n=== Set 对象克隆 ===');
const set = new Set([1, 2, 3]);
const clonedSet = cloneDeep(set);
console.log('原始 Set:', set);
console.log('克隆 Set:', clonedSet);
console.log('引用相同？', set === clonedSet); // false

// 修改克隆后的 Set 不会影响原 Set
clonedSet.add(4);
console.log('修改后原始 Set 有 4?', set.has(4)); // false
console.log('修改后克隆 Set 有 4?', clonedSet.has(4)); // true

// 循环引用对象克隆
console.log('\n=== 循环引用对象克隆 ===');
const circular: any = { a: 1, b: 2 };
circular.self = circular;
const clonedCircular = cloneDeep(circular);

console.log('原始循环引用对象 a 值：', circular.a);
console.log('克隆循环引用对象 a 值：', clonedCircular.a);
console.log('原始对象的自引用 === 原始对象？', circular.self === circular); // true
console.log('克隆对象的自引用 === 克隆对象？', clonedCircular.self === clonedCircular); // true
console.log('克隆对象的自引用 === 原始对象？', clonedCircular.self === circular); // false

// 复杂嵌套结构克隆
console.log('\n=== 复杂嵌套结构克隆 ===');
const complex: any = {
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
const clonedComplex: any = cloneDeep(complex);

console.log('克隆复杂对象成功！');
console.log('修改前原始复杂对象的嵌套值：', complex.b[2].c); // 4

// 修改克隆对象的深层嵌套值
clonedComplex.b[2].c = 400;
console.log('修改后原始复杂对象的嵌套值：', complex.b[2].c); // 仍然是 4
console.log('修改后克隆复杂对象的嵌套值：', clonedComplex.b[2].c); // 400

// 自定义类实例克隆
console.log('\n=== 自定义类实例克隆 ===');
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

const person = new Person('John', 30);
const clonedPerson = cloneDeep(person);

console.log('原始人员实例：', person);
console.log('克隆人员实例：', clonedPerson);
console.log('原始人员问候：', person.greet()); // Hello, I'm John!
console.log('克隆人员问候：', clonedPerson.greet()); // Hello, I'm John!

// 修改克隆人员不会影响原人员
clonedPerson.name = 'Jane';
console.log('修改后原始人员姓名：', person.name); // John
console.log('修改后克隆人员姓名：', clonedPerson.name); // Jane
console.log('修改后原始人员问候：', person.greet()); // Hello, I'm John!
console.log('修改后克隆人员问候：', clonedPerson.greet()); // Hello, I'm Jane!
