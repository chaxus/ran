# TypeScript 类型系统中的类型

1. 基本类型： number、boolean、string、object、bigint、symbol、undefined、null
2. 复合类型： class、Array、元组（Tuple）、接口（Interface）、枚举（Enum）
3. 特殊的类型：void、never、any、unknown

## Tuple

元组（Tuple）就是元素个数和类型固定的数组类型：

```ts
type Tuple = [number, string];
```

## Interface

接口（Interface）可以描述函数、对象、构造器的结构：

- 对象

```ts

interface IPerson {
    name: string;
    age: number;
}

class Person implements IPerson {
    name: string;
    age: number;
}

const obj: IPerson = {
    name: 'name',
    age: 18
}
```

- 函数

```ts
interface SayHello {
    (name: string): string;
}

const func: SayHello = (name: string) => {
    return 'hello,' + name
}
```

- 构造器

```ts
interface PersonConstructor {
    new (name: string, age: number): IPerson;
}

function createPerson(ctor: PersonConstructor):IPerson {
    return new ctor('name', 18);
}
```

对象类型、class 类型在 TypeScript 里也叫做索引类型，也就是索引了多个元素的类型的意思。对象可以动态添加属性，如果不知道会有什么属性，可以用可索引签名：

```ts
interface IPerson {
    [prop: string]: string | number;
}
const obj:IPerson = {};
obj.name = 'name';
obj.age = 18;
```

## Enum

枚举（Enum）是一系列值的复合：

```ts
enum Transpiler {
    Babel = 'babel',
    Postcss = 'postcss',
    Terser = 'terser',
    Prettier = 'prettier',
    TypeScriptCompiler = 'tsc'
}

const transpiler = Transpiler.TypeScriptCompiler;
```

此外，TypeScript 还支持字面量类型，也就是类似 1111、'aaaa'、{ a: 1} 这种值也可以做为类型。

其中，字符串的字面量类型有两种，一种是普通的字符串字面量，比如 'aaa'，另一种是模版字面量，比如 aaa${string}，它的意思是以 aaa 开头，后面是任意 string 的字符串字面量类型。

所以想要约束以某个字符串开头的字符串字面量类型时可以这样写：

```ts
function func(str:`#${string}`){

}

func('aaa') // error

func('#aaa') // true
```

## void

代表空，可以是 undefined 或 never。

## never

代表不可达，比如函数抛异常的时候，返回值就是 never。

## any

是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了 never）。

## unknown

是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。

## 类型的装饰

除了描述类型的结构外，TypeScript 的类型系统还支持描述类型的属性，比如是否可选，是否只读等：

```ts
interface IPerson {
    readonly name: string;
    age?: number;
}

type tuple = [string, number?];
```
