# TypeScript 的类型系统

## 一.类型是什么

类型具体点来说就是指 number、boolean、string 等基础类型和 Object、Function 等复合类型，它们是编程语言提供的对不同内容的抽象：

- **不同类型变量占据的内存大小不同：** boolean 类型的变量会分配 4 个字节的内存，而 number 类型的变量则会分配 8 个字节的内存，给变量声明了不同的类型就代表了会占据不同的内存空间。

- **不同类型变量可做的操作不同：** number 类型可以做加减乘除等运算，boolean 就不可以，复合类型中不同类型的对象可用的方法不同，比如 Date 和 RegExp，变量的类型不同代表可以对该变量做的操作就不同。

有了类型，那我们的操作必须和类型相匹配，否则就会报错，这就是类型检查。

如果能保证对某种类型只做该类型允许的操作，这就叫做类型安全。

类型检查可以在运行时做，也可以运行之前的编译期做。这是两种不同的类型，前者叫做动态类型检查，后者叫做静态类型检查。

两种类型检查各有优缺点。动态类型检查 在源码中不保留类型信息，对某个变量赋什么值、做什么操作都是允许的，写代码很灵活。但这也埋下了类型不安全的隐患，比如对 string 做了乘除，对 Date 对象调用了 exec 方法，这些都是运行时才能检查出来的错误。

其中，最常见的错误应该是 “null is not an object”、“undefined is not a function” 之类的了，写代码时没发现类型不匹配，到了运行的时候才发现，就会有很多这种报错。

所以，动态类型虽然代码写起来简单，但代码中很容易藏着一些类型不匹配的隐患。

静态类型检查则是在源码中保留类型信息，声明变量要指定类型，对变量做的操作要和类型匹配，会有专门的编译器在编译期间做检查。

静态类型给写代码增加了一些难度，因为你除了要考虑代码要表达的逻辑之外，还要考虑类型逻辑：变量是什么类型的、是不是匹配、要不要做类型转换等。

不过，静态类型也消除了类型不安全的隐患，因为在编译期间就做了类型检查，就不会出现对 string 做了乘除，调用了 Date 的 exec 方法这类问题。

所以，静态类型虽然代码写起来要考虑的问题多一些，会复杂一些，但是却消除了代码中潜藏类型不安全问题的可能。

知道了动态类型检查和静态类型检查的区别，我们自然可以得出这样的结论：

动态类型只适合简单的场景，对于大项目却不太合适，因为代码中可能藏着的隐患太多了，万一线上报一个类型不匹配的错误，那可能就是大问题。

而静态类型虽然会增加写代码的成本，但是却能更好的保证代码的健壮性，减少 Bug 率。

所以，大型项目注定会用静态类型语言开发。

## 二.类型系统的分类

### 1.简单的类型系统

变量、函数、类等都可以声明类型，编译器会基于声明的类型做类型检查，类型不匹配时会报错。

这是最基础的类型系统，能保证类型安全，但有些死板。

比如一个 add 函数既可以做整数加法、又可以做浮点数加法，却需要声明两个函数：

```c
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}
```

这个问题的解决思路很容易想到：如果类型能传参数就好了，传入 int 就是整数加法，传入 double 就是浮点数加法。

所以，就有了第二种类型系统。

### 2.支持泛型的类型系统

泛型的英文是 Generic Type，通用的类型，它可以代表任何一种类型，也叫做类型参数。

它给类型系统增加了一些灵活性，在整体比较固定，部分变量的类型有变化的情况下，可以减少很多重复代码。

比如上面的 add 函数，有了泛型之后就可以这样写：

```java
T add<T>(T a, T b) {
    return a + b;
}

add(1,2);
add(1.111, 2.2222);
```

声明时把会变化的类型声明成泛型（也就是类型参数），在调用的时候再确定类型。

Java 就是这种类型系统。如果你看过 Java 代码，你会发现泛型用的特别多，这确实是一个很好的增加类型系统灵活性的特性。

但是，这种类型系统的灵活性对于 JavaScript 来说还不够，因为 JavaScript 太过灵活了。

比如，在 Java 里，对象都是由类 new 出来的，你不能凭空创建对象，但是 JavaScript 却可以，它支持对象字面量。

那如果是一个返回对象某个属性值的函数，类型该怎么写呢？

```ts
function getPropValue<T>(obj: T, key): key对应的属性值类型 {
  return obj[key]
}
```

好像拿到了 T，也不能拿到它的属性和属性值，如果能对类型参数 T 做一些逻辑处理就好了。

所以，就有了第三种类型系统。

### 3.支持类型编程的类型系统

在 Java 里面，拿到了对象的类型就能找到它的类，进一步拿到各种信息，所以类型系统支持泛型就足够了。

但是在 JavaScript 里面，对象可以字面量的方式创建，还可以灵活的增删属性，拿到对象并不能确定什么，所以要支持对传入的类型参数做进一步的处理。

对传入的类型参数（泛型）做各种逻辑运算，产生新的类型，这就是类型编程。

比如上面那个 getProps 的函数，类型可以这样写：

```ts
function getPropValue<T extends object, Key extends keyof T>(
  obj: T,
  key: Key,
): T[Key] {
  return obj[key]
}
```

这里的 keyof T、T[Key] 就是对类型参数 T 的类型运算。

TypeScript 的类型系统就是第三种，支持对类型参数做各种逻辑处理，可以写很复杂的类型逻辑。

类型逻辑可以多复杂？

类型逻辑是对类型参数的各种处理，可以实现很多强大的功能：

比如这个 ParseQueryString 的类型：

```ts
type res = ParseQueryString<'a=1&b=2&c=3'>
```

它可以对传入的字符串的类型参数做解析，返回解析以后的结果。等于

```ts
type res = {
  a: '1'
  b: '2'
  c: '3'
}
```

如果是 Java 的只支持泛型的类型系统可以做到么？明显不能。但是 TypeScript 的类型系统就可以，因为它可以对泛型（类型参数）做各种逻辑处理。

只不过，这个类型的类型逻辑的代码比较多（下面的 ts 类型暂时看不懂没关系，在顺口溜那节会有详解，这里只是用来直观感受下类型编程的复杂度的，等学完以后大家也能实现这样的复杂高级类型的）：

```ts
type ParseParam<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
        [K in Key]: Value
      }
    : {}

type MergeValues<One, Other> = One extends Other
  ? One
  : Other extends unknown[]
  ? [One, ...Other]
  : [One, Other]

type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>,
> = {
  [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
    ? OtherParam[Key]
    : never
}
type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>
```

TypeScript 的类型系统是图灵完备的，也就是能描述各种可计算逻辑。简单点来理解就是循环、条件等各种 JS 里面有的语法它都有，JS 能写的逻辑它都能写。

对类型参数的编程是 TypeScript 类型系统最强大的部分，可以实现各种复杂的类型计算逻辑，是它的优点。但同时也被认为是它的缺点，因为除了业务逻辑外还要写很多类型逻辑。

不过，我倒是觉得这种复杂度是不可避免的，因为 JS 本身足够灵活，要准确定义类型那类型系统必然也要设计的足够灵活。

### 4.类型安全和型变

TypeScript 给 JavaScript 添加了一套静态类型系统，是为了保证类型安全的，也就是保证变量只能赋同类型的值，对象只能访问它有的属性、方法。

比如 number 类型的值不能赋值给 boolean 类型的变量，Date 类型的对象就不能调用 exec 方法。

这是类型检查做的事情，遇到类型安全问题会在编译时报错。

但是这种类型安全的限制也不能太死板，有的时候需要一些变通，比如子类型是可以赋值给父类型的变量的，可以完全当成父类型来使用，也就是“型变（variant）”（类型改变）。

这种“型变”分为两种，一种是子类型可以赋值给父类型，叫做协变（covariant），一种是父类型可以赋值给子类型，叫做逆变（contravariant）。

先来看下协变：

#### 协变（covariant）

对具体成员的输出参数进行一次类型转换，且类型转换的准则是 “里氏替换原则”。

其中协变是很好理解的，比如我们有两个 interface：

```ts
interface Animal {
  name: string
  age: number
}

interface Cat {
  name: string
  age: number
  hobbies: string[]
}
```

这里 Cat 是 Animal 的子类型，更具体，那么 Cat 类型的变量就可以赋值给 Animal 类型：

```ts
let animal: Animal = {
  name: 'cat',
  age: 3,
}

let cat: Cat = {
  name: 'Tony',
  age: 5,
  hobbies: ['run', 'swim'],
}

animal = cat
```

这并不会报错，虽然这俩类型不一样，但是依然是类型安全的。

这种子类型可以赋值给父类型的情况就叫做协变。

为什么要支持协变很容易理解：类型系统支持了父子类型，那如果子类型还不能赋值给父类型，还叫父子类型么？

所以型变是实现类型父子关系必须的，它在保证类型安全的基础上，增加了类型系统的灵活性。

逆变相对难理解一些：

#### 逆变（contravariant）

是对具体成员的输入参数进行一次类型转换，且类型转换的准则是"里氏替换原则"。

我们有这样两个函数：

```ts
let printHobbies: (cat: Cat) => void

printHobbies = (cat) => {
  console.log(cat.hobbies)
}

let printName: (animal: Animal) => void

printName = (animal) => {
  console.log(animal.name)
}
```

printHobbies 的参数 Guang 是 printName 参数 Person 的子类型。

那么问题来了，printName 能赋值给 printHobbies 么？printHobbies 能赋值给 printName 么？

测试一下发现是这样的：

```ts
let printHobbies: (cat: Cat) => void

printHobbies = (cat) => {
  console.log(cat.hobbies)
}

let printName: (animal: Animal) => void

printName = (animal) => {
  console.log(animal.name)
}

printHobbies = printName
```

printName 的参数 Person 不是 printHobbies 的参数 Guang 的父类型么，为啥能赋值给子类型？

因为这个函数调用的时候是按照 Guang 来约束的类型，但实际上函数只用到了父类型 Person 的属性和方法，当然不会有问题，依然是类型安全的。

这就是逆变，函数的参数有逆变的性质（而返回值是协变的，也就是子类型可以赋值给父类型）。

那反过来呢，如果 printHoobies 赋值给 printName 会发生什么？

因为函数声明的时候是按照 Person 来约束类型，但是调用的时候是按照 Guang 的类型来访问的属性和方法，那自然类型不安全了，所以就会报错。

但是在 ts2.x 之前支持这种赋值，也就是父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”。

但是这明显是有问题的，不能保证类型安全，所以之后 ts 加了一个编译选项 strictFunctionTypes，设置为 true 就只支持函数参数的逆变，设置为 false 则是双向协变。

我们把 strictFunctionTypes 关掉之后，就会发现两种赋值都可以了。

这样就支持函数参数的双向协变，类型检查不会报错，但不能严格保证类型安全。

开启之后，函数参数就只支持逆变，子类型赋值给父类型就会报错。

再举个逆变的例子，大家觉得下面这样的 ts 代码会报错么：

```ts
type Func = (a: string) => void

const func: Func = (a: 'hello') => undefined
```

答案是参数的位置会，返回值的位置不会：

参数的位置是逆变的，也就是被赋值的函数参数要是赋值的函数参数的子类型，而 string 不是 'hello' 的子类型，所以报错了。

返回值的位置是协变的，也就是赋值的函数的返回值是被赋值的函数的返回值的子类型，这里 undefined 是 void 的子类型，所以不报错。

### 不变（invariant）

逆变和协变都是型变，是针对父子类型而言的，非父子类型自然就不会型变，也就是不变：

非父子类型之间不会发生型变，只要类型不一样就会报错

那类型之间的父子关系是怎么确定的呢，好像也没有看到 extends 的继承？

像 java 里面的类型都是通过 extends 继承的，如果 A extends B，那 A 就是 B 的子类型。这种叫做名义类型系统（nominal type）。

而 ts 里不看这个，只要结构上是一致的，那么就可以确定父子关系，这种叫做结构类型系统（structual type）。

通过结构，更具体的那个是子类型。这里的 Cat 有 Animal 的所有属性，并且还多了一些属性，所以 Cat 是 Animal 的子类型。

注意，这里用的是更具体，而不是更多。

判断联合类型父子关系的时候， 'a' | 'b' 和 'a' | 'b' | 'c' 哪个更具体？

'a' | 'b' 更具体，所以 'a' | 'b' 是 'a' | 'b' | 'c' 的子类型。

## 三.TypeScript 类型系统

### 1.支持的类型

静态类型系统的目的是把类型检查从运行时提前到编译时，那 TS 类型系统中肯定要把 JS 的运行时类型拿过来，也就是 number、boolean、string、object、bigint、symbol、undefined、null 这些类型，还有就是它们的包装类型 Number、Boolean、String、Object、Symbol。

这些很容易理解，给 JS 添加静态类型，总没有必要重新造一套基础类型吧，直接复用 JS 的基础类型就行。

复合类型方面，JS 有 class、Array，这些 TypeScript 类型系统也都支持，但是又多加了三种类型：元组（Tuple）、接口（Interface）、枚举（Enum）。

#### 元组

元组（Tuple）就是元素个数和类型固定的数组类型：

```ts
type Tuple = [number, string]
```

#### 接口

接口（Interface）可以描述函数、对象、构造器的结构：

对象：

```ts
interface IPerson {
  name: string
  age: number
}

class Person implements IPerson {
  name: string
  age: number
}

const obj: IPerson = {
  name: 'guang',
  age: 18,
}
```

函数：

```ts
interface SayHello {
  (name: string): string
}

const func: SayHello = (name: string) => {
  return 'hello,' + name
}
```

构造器：

```ts
interface PersonConstructor {
  new (name: string, age: number): IPerson
}

function createPerson(ctor: PersonConstructor): IPerson {
  return new ctor('guang', 18)
}
```

对象类型、class 类型在 TypeScript 里也叫做索引类型，也就是索引了多个元素的类型的意思。对象可以动态添加属性，如果不知道会有什么属性，可以用可索引签名：

```ts
interface IPerson {
  [prop: string]: string | number
}
const obj: IPerson = {}
obj.name = 'guang'
obj.age = 18
```

总之，接口可以用来描述函数、构造器、索引类型（对象、class、数组）等复合类型。

#### 枚举

枚举（Enum）是一系列值的复合：

```ts
enum Transpiler {
  Babel = 'babel',
  Postcss = 'postcss',
  Terser = 'terser',
  Prettier = 'prettier',
  TypeScriptCompiler = 'tsc',
}

const transpiler = Transpiler.TypeScriptCompiler
```

此外，TypeScript 还支持字面量类型，也就是类似 1111、'aaaa'、{ a: 1} 这种值也可以做为类型。

其中，字符串的字面量类型有两种，一种是普通的字符串字面量，比如 'aaa'，另一种是模版字面量，比如 aaa${string}，它的意思是以 aaa 开头，后面是任意 string 的字符串字面量类型。

所以想要约束以某个字符串开头的字符串字面量类型时可以这样写：

```ts
function func(str: `#${string}`) {}

func('aaaa') // error

func('#aaaa') // true
```

还有四种特殊的类型：void、never、any、unknown：

- never 代表不可达，比如函数抛异常的时候，返回值就是 never。
- void 代表空，可以是 undefined 或 never。
- any 是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了 never）。
- unknown 是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。

这些就是 TypeScript 类型系统中的全部类型了，大部分是从 JS 中迁移过来的，比如基础类型、Array、class 等，也添加了一些类型，比如 枚举（enum）、接口（interface）、元组等，还支持了字面量类型和 void、never、any、unknown 的特殊类型。

### 2.类型的装饰

除了描述类型的结构外，TypeScript 的类型系统还支持描述类型的属性，比如是否可选，是否只读等：

```ts
interface IPerson {
  readonly name: string
  age?: number
}

type tuple = [string, number?]
```

### 3.类型运算

我们知道了 TypeScript 类型系统里有哪些类型，那么可以对这些类型做什么类型运算呢？

#### 条件：extends ?

TypeScript 里的条件判断是 extends ? :，叫做条件类型（Conditional Type）比如：

```ts
type res = 1 extends 2 ? true : false // type res = false
```

这就是 TypeScript 类型系统里的 if else。

但是，上面这样的逻辑没啥意义，静态的值自己就能算出结果来，为什么要用代码去判断呢？

所以，类型运算逻辑都是用来做一些动态的类型的运算的，也就是对类型参数的运算。

```ts
type isTwo<T> = T extends 2 ? true : false

type res = isTwo<1> // type res = false
type res2 = isTwo<2> // type res = true
```

这种类型也叫做高级类型。

高级类型的特点是传入类型参数，经过一系列类型运算逻辑后，返回新的类型。

#### 推导：infer

如何提取类型的一部分呢？答案是 infer。

比如提取元组类型的第一个元素：

```ts
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
  ? T
  : never

type res = First<[1, 2, 3]> // type res = 1
```

注意，第一个 extends 不是条件，条件类型是 extends ? :，这里的 extends 是约束的意思，也就是约束类型参数只能是数组类型。

因为不知道数组元素的具体类型，所以用 unknown。

infer 在后面的章节会大量用到，这里先简单了解即可。

#### 联合：｜

联合类型（Union）类似 js 里的或运算符 |，但是作用于类型，代表类型可以是几个类型之一。

```ts
type Union = 1 | 2 | 3
```

#### 交叉：&

交叉类型（Intersection）类似 js 中的与运算符 &，但是作用于类型，代表对类型做合并。

```ts
type ObjType = { a: number } & { c: boolean }
```

注意，同一类型可以合并，不同的类型没法合并，会被舍弃：

可以合并的

```ts
type ObjType = { a: number } & { c: boolean }

type res = { a: number; c: boolean } extends ObjType ? true : false // type res = true
```

不可合并

```ts
type res = 'aaaa' & 2222 // type res = never
```

#### 映射类型

对象、class 在 TypeScript 对应的类型是索引类型（Index Type），那么如何对索引类型作修改呢？

答案是映射类型。

```ts
type MapType<T> = {
  [Key in keyof T]?: T[Key]
}
```

keyof T 是查询索引类型中所有的索引，叫做索引查询。

T[Key] 是取索引类型某个索引的值，叫做索引访问。

in 是用于遍历联合类型的运算符。

比如我们把一个索引类型的值变成 3 个元素的数组：

```ts
type MapType<T> = {
  [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{ a: 1; b: 2 }> // type res = { a: [1, 1, 1]; b:[2, 2, 2]; }
```

映射类型就相当于把一个集合映射到另一个集合，这是它名字的由来。

除了值可以变化，索引也可以做变化，用 as 运算符，叫做重映射。

我们用 as 把索引也做了修改，改成了 3 个 key 重复：

```ts
type MapType<T> = {
  [Key in keyof T as `${Key & string}${Key & string}${Key & string}`]: [
    T[Key],
    T[Key],
    T[Key],
  ]
}

// type res = { aaa: [1, 1, 1]; bbb: [2, 2, 2]; }
```

这里的 & string 可能大家会迷惑，解释一下：

因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃。

## 四.判断类型的类型

### IsAny

如何判断一个类型是 any 类型呢？要根据它的特性来：

any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any。

所以，可以这样写：

```ts
type IsAny<T> = 'null' extends 'undefined' & T ? true : false
```

### IsEqual

之前我们实现 IsEqual 是这样写的：

```ts
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
```

问题出在 any 的判断上：

```ts
type IsEqualResult = IsEqual<'aaa', any>
// type IsEqualResult = false
```

因为 any 可以是任何类型，任何类型也都是 any，所以当这样写判断不出 any 类型来。

所以，我们会这样写：

```ts
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false
```

这样就能正常判断了：

其中 T 是不传类型的，相当于一个临时变量

其目的是对比：

```ts
<T>() => T extends X ? 1 : 2
<T>() => T extends Y ? 1 : 2
```

这两个泛型函数类型是否相等，[原理](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796)

### IsUnion

还记得怎么判断 union 类型么？要根据它遇到条件类型时会分散成单个传入做计算的特性：

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
```

### IsNever

never 在条件类型中也比较特殊，如果条件类型左边是类型参数，并且传入的是 never，那么直接返回 never：

```ts
type TestNever<T> = T extends number ? 1 : 2
```

当 T 为 never 时：

```ts
type TestNeverResult = TestNever<never>
// type TestNeverResult = never
```

所以，要判断 never 类型，就不能直接 T extends number，可以这样写：

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

这样就能正常判断 never 类型了：

```ts
type TestNeverResult = IsNever<never>
// type TestNeverResult = true
```

除此以外，any 在条件类型中也比较特殊，如果类型参数为 any，会直接返回 trueType 和 falseType 的合并：

```ts
type TestAny<T> = T extends number ? 1 : 2

type TestAnyResult = TestAny<any>
// type TestAnyResult = 1 | 2
```

联合类型、never、any 在作为条件类型的类型参数时的这些特殊情况，也会在后面的原理篇来解释原因。

### IsTuple

元组类型怎么判断呢？它和数组有什么区别呢？

元组类型的 length 是数字字面量，而数组的 length 是 number。

```ts
type len
```

### UnionToIntersection

类型之间是有父子关系的，更具体的那个是子类型，比如 A 和 B 的交叉类型 A & B 就是联合类型 A | B 的子类型，因为更具体。

如果允许父类型赋值给子类型，就叫做**逆变**。

如果允许子类型赋值给父类型，就叫做**协变**。

（关于逆变、协变等概念的详细解释可以看原理篇）

在 TypeScript 中有函数参数是有逆变的性质的，也就是如果参数可能是多个类型，参数类型会变成它们的交叉类型。

所以联合转交叉可以这样实现 ：

```ts
type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
```

类型参数 U 是要转换的联合类型。

U extends U 是为了触发联合类型的 distributive 的性质，让每个类型单独传入做计算，最后合并。

利用 U 做为参数构造个函数，通过模式匹配取参数的类型。

结果就是交叉类型

函数参数的逆变性质一般就联合类型转交叉类型会用，记住就行。

### GetOptional

如何提取索引类型中的可选索引呢？

这也要利用可选索引的特性：可选索引的值为 undefined 和值类型的联合类型。

过滤可选索引，就要构造一个新的索引类型，过程中做过滤：

```ts
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key]
}
```

类型参数 Obj 为待处理的索引类型，类型约束为索引为 string、值为任意类型的索引类型 Record<string, any>。

用映射类型的语法重新构造索引类型，索引是之前的索引也就是 Key in keyof Obj，但要做一些过滤，也就是 as 之后的部分。

过滤的方式就是单独取出该索引之后，判断空对象是否是其子类型。

这里的 Pick 是 ts 提供的内置高级类型，就是取出某个 Key 构造新的索引类型：

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
```

比如单独取出 age 构造的新的索引类型是这样的：

可选的意思是这个索引可能没有，没有的时候，那 Pick<Obj, Key> 就是空的，所以 {} extends Pick<Obj, Key> 就能过滤出可选索引。

值的类型依然是之前的，也就是 Obj[Key]。

这样，就能过滤出所有可选索引，构造成新的索引类型：

## 总结

- any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any，可以用这个特性判断 any 类型。
- 联合类型作为类型参数出现在条件类型左侧时，会分散成单个类型传入，最后合并。
- never 作为类型参数出现在条件类型左侧时，会直接返回 never。
- any 作为类型参数出现在条件类型左侧时，会直接返回 trueType 和 falseType 的联合类型。
- 元组类型也是数组类型，但 length 是数字字面量，而数组的 length 是 number。可以用来判断元组类型。
- 函数参数处会发生逆变，可以用来实现联合类型转交叉类型。
- 可选索引的索引可能没有，那 Pick 出来的就可能是 {}，可以用来过滤可选索引，反过来也可以过滤非可选索引。
- 索引类型的索引为字符串字面量类型，而可索引签名不是，可以用这个特性过滤掉可索引签名。
- keyof 只能拿到 class 的 public 的索引，可以用来过滤出 public 的属性。
- 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行。
