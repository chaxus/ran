# 分布式条件类型

当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。

比如这样一个联合类型：

```ts
type Union = 'a' | 'b' | 'c'
```

我们想把其中的 a 大写，就可以这样写：

```ts
type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item
```

```ts
type result = UppercaseA<Union>
// type result = 'A' | 'b' | 'c';
```

可以看到，我们类型参数 Item 约束为 string，条件类型的判断中也是判断是否是 a，但传入的是联合类型。

这就是 TypeScript 对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并。

这和联合类型遇到字符串时的处理一样：

这样确实是简化了类型编程逻辑的，不需要递归提取每个元素再处理。

TypeScript 之所以这样处理联合类型也很容易理解，因为联合类型的每个元素都是互不相关的，不像数组、索引、字符串那样元素之间是有关系的。所以设计成了每一个单独处理，最后合并。

知道了 TypeScript 怎么处理的联合类型，趁热打铁来练习一下：

## CamelcaseUnion

Camelcase 我们实现过，就是提取字符串中的字符，首字母大写以后重新构造一个新的。

```ts
type Camelcase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : Str
```

提取 \_ 左右的字符，把右边字符大写之后构造成新的字符串，余下的字符串递归处理。

```ts
type CamelcaseResult = Camelcase<'aa_aa_aa'>
// type CamelcaseResult = 'aaAaAa'
```

如果是对字符串数组做 Camelcase，那就要递归处理每一个元素：

```ts
type CamelcaseArr<Arr extends unknown[]> = Arr extends [
  infer Item,
  ...infer RestArr,
]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : []
```

类型参数 Arr 为待处理数组。

递归提取每一个元素做 Camelcase，因为 Camelcase 要求传入 string，这里要 & string 来变成 string 类型。

那如果是联合类型呢？

联合类型不需要递归提取每个元素，TypeScript 内部会把每一个元素传入单独做计算，之后把每个元素的计算结果合并成联合类型。

```ts
type CamelcaseUnion<Item extends string> =
  Item extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
    : Item
```

这不和单个字符串的处理没区别么？

没错，对联合类型的处理和对单个类型的处理没什么区别，TypeScript 会把每个单独的类型拆开传入。不需要像数组类型那样需要递归提取每个元素做处理。

确实简化了很多，好像都是优点？

也不全是，其实这样处理也增加了一些认知成本，不信我们再来看个例子：

## IsUnion

判断联合类型我们会这样写：

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
```

当传入联合类型时，会返回 true：

```ts
type IsUnionResult = IsUnion<'a' | 'b' 'c'>
// type IsUnionResult = true
```

当传入其他类型时，会返回 false：

```ts
type IsUnionResult = IsUnion<['a' | 'b' 'c']>
// type IsUnionResult = false
```

这就是分布式条件类型带来的认知成本。

我们先来看这样一个类型：

```ts
type TestUnion<A, B = A> = A extends A ? { a: A; b: B } : never

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>
```

传入联合类型 'a' | 'b' | 'c' 的时候，结果是这样的：

A 和 B 都是同一个联合类型，为啥值还不一样呢？

**因为条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会。**

所以 A 是 'a' 的时候，B 是 'a' | 'b' | 'c'， A 是 'b' 的时候，B 是 'a' | 'b' | 'c'。。。

那么利用这个特点就可以实现 Union 类型的判断：

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
```

类型参数 A、B 是待判断的联合类型，B 默认值为 A，也就是同一个类型。

**A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入。**

**[B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，那么 B 就是整个联合类型。**

B 是联合类型整体，而 A 是单个类型，自然不成立，而其它类型没有这种特殊处理，A 和 B 都是同一个，怎么判断都成立。

利用这个特点就可以判断出是否是联合类型。

其中有两个点比较困惑，我们重点记一下：

当 A 是联合类型时：

A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。

A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。

理解了这两点，分布式条件类型就算掌握了。

## BEM

bem 是 css 命名规范，用 block\_\_element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式。

那么我们可以写这样一个高级类型，传入 block、element、modifier，返回构造出的 class 名：

这样使用：

```ts
type bemResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']>
```

它的实现就是三部分的合并，但传入的是数组，要递归遍历取出每一个元素来和其他部分组合，这样太麻烦了。

而如果是联合类型就不用递归遍历了，因为联合类型遇到字符串也是会单独每个元素单独传入做处理。

数组转联合类型可以这样写：

```ts
type union = ['aaa', 'bbb'][number]
// type union = 'aaa' | 'bbb'
```

那么 BEM 就可以这样实现：

```ts
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[],
> = `${Block}__${Element[number]}--${Modifiers[number]}`
```

类型参数 Block、Element、Modifiers 分别是 bem 规范的三部分，其中 Element 和 Modifiers 都可能多个，约束为 string[]。

构造一个字符串类型，其中 Element 和 Modifiers 通过索引访问来变为联合类型。

字符串类型中遇到联合类型的时候，会每个元素单独传入计算，也就是这样的效果：

```ts
type RemResult = BEM<'a', ['b', 'c'], ['d', 'e']>
// type RemResult = 'a__b--d' | 'a__b--e' | 'a__c--d' | 'a__b--e'
```

可以看到，用好了联合类型，确实能简化类型编程逻辑。

## AllCombinations

我们再来实现一个全组合的高级类型，也是联合类型相关的：

希望传入 'A' | 'B' 的时候，能够返回所有的组合： 'A' | 'B' | 'BA' | 'AB'。

这种全组合问题的实现思路就是两两组合，组合出的字符串再和其他字符串两两组和：

比如 'A' | 'B' | 'c'，就是 A 和 B、C 组合，B 和 A、C 组合，C 和 A、B 组合。然后组合出来的字符串再和其他字符串组合。

任何两个类型的组合有四种：A、B、AB、BA

```ts
type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`
```

然后构造出来的字符串再和其他字符串组合。

所以全组合的高级类型就是这样：

```ts
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never
```

类型参数 A、B 是待组合的两个联合类型，B 默认是 A 也就是同一个。

A extends A 的意义就是让联合类型每个类型单独传入做处理，上面我们刚学会。

A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 Combination<A, B 去掉 A 以后的所有组合>。

而 B 去掉 A 以后的所有组合就是 AllCombinations<Exclude<B, A>>，所以全组合就是 Combination<A, AllCombinations<Exclude<B, A>>>。

## 总结

联合类型中的每个类型都是相互独立的，TypeScript 对它做了特殊处理，也就是遇到字符串类型、条件类型的时候会把每个类型单独传入做计算，最后把每个类型的计算结果合并成联合类型。

条件类型左边是联合类型的时候就会触法这种处理，叫做分布式条件类型。

有两点特别要注意：

- A extends A 不是没意义，意义是取出联合类型中的单个类型放入 A

- A extends A 才是分布式条件类型， [A] extends [A] 就不是了，只有左边是单独的类型参数才可以。

我们后面做了一些案例，发现联合类型的这种 distributive 的特性确实能简化类型编程，但是也增加了认知成本，不过这也是不可避免的事。
