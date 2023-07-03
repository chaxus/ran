# 递归复用

递归是把问题分解为一系列相似的小问题，通过函数不断调用自身来解决这一个个小问题，直到满足结束条件，就完成了问题的求解。

TypeScript 的高级类型支持类型参数，可以做各种类型运算逻辑，返回新的类型，和函数调用是对应的，自然也支持递归。

TypeScript 类型系统不支持循环，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。

既然提到了数组、字符串、对象等类型，那么我们就来看一下这些类型的递归案例吧。

## Promise 的递归复用

### DeepPromiseValueType

先用 Promise 热热身，实现一个提取不确定层数的 Promise 中的 value 类型的高级类型。

```ts
type ttt = Promise<Promise<Promise<Record<string, any>>>>
```

这里是 3 层 Promise，value 类型是索引类型。

数量不确定，一涉及到这个就要想到用递归来做，每次只处理一层的提取，然后剩下的到下次递归做，直到结束条件。

所以高级类型是这样的：

```ts
type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<
  infer ValueType
>
  ? ValueType extends Promise<unknown>
    ? DeepPromiseValueType<ValueType>
    : ValueType
  : never
```

类型参数 P 是待处理的 Promise，通过 extends 约束为 Promise 类型，value 类型不确定，设为 unknown。

每次只处理一个类型的提取，也就是通过模式匹配提取出 value 的类型到 infer 声明的局部变量 ValueType 中。

然后判断如果 ValueType 依然是 Promise 类型，就递归处理。

结束条件就是 ValueType 不为 Promise 类型，那就处理完了所有的层数，返回这时的 ValueType。

这样，我们就提取到了最里层的 Promise 的 value 类型，也就是索引类型：

其实这个类型的实现可以进一步的简化：

```ts
type DeepPromiseValueType2<T> = T extends Promise<infer ValueType>
  ? DeepPromiseValueType2<ValueType>
  : T
```

不再约束类型参数必须是 Promise，这样就可以少一层判断。

接下来再看下数组类型的递归复用：

## 数组类型的递归

### ReverseArr

有这样一个元组类型：

```ts
type arr = [1, 2, 3, 4, 5]
```

我们把它反过来，也就是变成：

```ts
type arr = [5, 4, 3, 2, 1]
```

这个学完了提取和构造很容易写出来：

```ts
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer One,
  infer Two,
  infer Three,
  infer Four,
  infer Five,
]
  ? [Five, Four, Three, Two, One]
  : never
```

但如果数组长度不确定呢？

数量不确定，条件反射的就要想到递归。

我们每次只处理一个类型，剩下的递归做，直到满足结束条件。

```ts
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer First,
  ...infer Rest,
]
  ? [...ReverseArr<Rest>, First]
  : Arr
```

类型参数 Arr 为待处理的数组类型，元素类型不确定，也就是 unknown。

每次只处理一个元素的提取，放到 infer 声明的局部变量 First 里，剩下的放到 Rest 里。

用 First 作为最后一个元素构造新数组，其余元素递归的取。

结束条件就是取完所有的元素，也就是不再满足模式匹配的条件，这时候就返回 Arr。

### Includes

既然递归可以做循环用，那么像查找元素这种自然也就可以实现。

比如查找 [1, 2, 3, 4, 5] 中是否存在 4，是就返回 true，否则返回 false。

从长度不固定的数组中查找某个元素，数量不确定，这时候就应该想到递归。

```ts
type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer First,
  ...infer Rest,
]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
```

类型参数 Arr 是待查找的数组类型，元素类型任意，也就是 unknown。FindItem 待查找的元素类型。

每次提取一个元素到 infer 声明的局部变量 First 中，剩余的放到局部变量 Rest。

判断 First 是否是要查找的元素，也就是和 FindItem 相等，是的话就返回 true，否则继续递归判断下一个元素。

直到结束条件也就是提取不出下一个元素，这时返回 false。

相等的判断就是 A 是 B 的子类型并且 B 也是 A 的子类型，。

这样就完成了不确定长度的数组中的元素查找，用递归实现了循环。

### RemoveItem

可以查找自然就可以删除，只需要改下返回结果，构造一个新的数组返回。

```ts
type RemoveItem<
  Arr extends unknown[],
  Item,
  Result extends unknown[] = [],
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
```

类型参数 Arr 是待处理的数组，元素类型任意，也就是 unknown[]。类型参数 Item 为待查找的元素类型。类型参数 Result 是构造出的新数组，默认值是 []。

通过模式匹配提取数组中的一个元素的类型，如果是 Item 类型的话就删除，也就是不放入构造的新数组，直接返回之前的 Result。

否则放入构造的新数组，也就是再构造一个新的数组 [...Result, First]。

直到模式匹配不再满足，也就是处理完了所有的元素，返回这时候的 Result。

这样我们就完成了不确定元素个数的数组的某个元素的删除：

### BuildArray

我们学过数组类型的构造，如果构造的数组类型元素个数不确定，也需要递归。

比如传入 5 和元素类型，构造一个长度为 5 的该元素类型构成的数组。

```ts
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = [],
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>
```

类型参数 Length 为数组长度，约束为 number。类型参数 Ele 为元素类型，默认值为 unknown。类型参数 Arr 为构造出的数组，默认值是 []。

每次判断下 Arr 的长度是否到了 Length，是的话就返回 Arr，否则在 Arr 上加一个元素，然后递归构造。

学完了数组类型的递归，我们再来看下字符串类型。

## 字符串类型的递归

### ReplaceAll

学模式匹配的时候，我们实现过一个 Replace 的高级类型：

```ts
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str
```

它能把一个字符串中的某个字符替换成另一个：

但是如果有多个这样的字符就处理不了了。

如果不确定有多少个 From 字符，怎么处理呢？

在类型体操里，遇到数量不确定的问题，就要条件反射的想到递归。

每次递归只处理一个类型，这部分我们已经实现了，那么加上递归的调用就可以。

```ts
type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Left}${From}${infer Right}`
  ? `${Left}${To}${ReplaceAll<Right, From, To>}`
  : Str
```

类型参数 Str 是待处理的字符串类型，From 是待替换的字符，To 是替换到的字符。

通过模式匹配提取 From 左右的字符串到 infer 声明的局部变量 Left 和 Right 里。

用 Left 和 To 构造新的字符串，剩余的 Right 部分继续递归的替换。

结束条件是不再满足模式匹配，也就是没有要替换的元素，这时就直接返回字符串 Str。

这样就实现了任意数量的字符串替换：

### StringToUnion

我们想把字符串字面量类型的每个字符都提取出来组成联合类型，也就是把 'dong' 转为 'd' | 'o' | 'n' | 'g'。

怎么做呢？

很明显也是提取和构造：

```ts
type StringToUnion<Str extends string> =
  Str extends `${infer One}${infer Two}${infer Three}${infer Four}`
    ? One | Two | Three | Four
    : never
```

但如果字符串长度不确定呢？

数量不确定，在类型体操中就要条件反射的想到递归。

```ts
type StringToUnion<Str extends string> =
  Str extends `${infer First}${infer Rest}`
    ? First | StringToUnion<Rest>
    : never
```

类型参数 Str 为待处理的字符串类型，通过 extends 约束为 string。

通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余的字符放到局部变量 Rest。

用 First 构造联合类型，剩余的元素递归的取。

这样就完成了不确定长度的字符串的提取和联合类型的构造：

### ReverseStr

我们实现了数组的反转，自然也可以实现字符串类型的反转。

同样是递归提取和构造。

```ts
type ReverseStr<
  Str extends string,
  Result extends string = '',
> = Str extends `${infer First}${infer Rest}`
  ? ReverseStr<Rest, `${First}${Result}`>
  : Result
```

类型参数 Str 为待处理的字符串。类型参数 Result 为构造出的字符，默认值是空串。

通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余字符放到 Rest。

用 First 和之前的 Result 构造成新的字符串，把 First 放到前面，因为递归是从左到右处理，那么不断往前插就是把右边的放到了左边，完成了反转的效果。

直到模式匹配不满足，就处理完了所有的字符。

这样就完成了字符串的反转：

## 对象类型的递归

### DeepReadonly

对象类型的递归，也可以叫做索引类型的递归。

我们之前实现了索引类型的映射，给索引加上了 readonly 的修饰：

```ts
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}
```

如果这个索引类型层数不确定呢？

比如这样：

```ts
type obj = {
  a: {
    b: {
      c: {
        f: () => 'dong'
        d: {
          e: {
            guang: string
          }
        }
      }
    }
  }
}
```

数量（层数）不确定，类型体操中应该自然的想到递归。

我们在之前的映射上加入递归的逻辑：

```ts
type DeepReadonly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object
    ? Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadonly<Obj[Key]>
    : Obj[Key]
}
```

类型参数 Obj 是待处理的索引类型，约束为 Record<string, any>，也就是索引为 string，值为任意类型的索引类型。

索引映射自之前的索引，也就是 Key in keyof Obj，只不过加上了 readonly 的修饰。

值要做下判断，如果是 object 类型并且还是 Function，那么就直接取之前的值 Obj[Key]。

如果是 object 类型但不是 Function，那就是说也是一个索引类型，就递归处理 DeepReadonly<Obj[Key]>。

否则，值不是 object 就直接返回之前的值 Obj[Key]。

这样就完成了任意层数的索引类型的添加 readonly 修饰：

我们取处理以后的索引 a 的值看一下，发现 b 已经加上了 readonly 修饰。

测试一下：

为啥这里没有计算呀？

因为 ts 的类型只有被用到的时候才会做计算。

所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，从而触发计算：

```ts
type DeepReadonly<Obj extends Record<string, any>> = Obj extends any
  ? {
      readonly [Key in keyof Obj]: Obj[Key] extends object
        ? Obj[Key] extends Function
          ? Obj[Key]
          : DeepReadonly<Obj[Key]>
        : Obj[Key]
    }
  : never
```
