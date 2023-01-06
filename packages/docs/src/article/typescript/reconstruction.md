# 重新构造做变换

类型编程主要的目的就是对类型做各种转换，那么如何对类型做修改呢？

TypeScript 类型系统支持 3 种可以声明任意类型的变量： type、infer、类型参数。

type 叫做类型别名，其实就是声明一个变量存储某个类型：

```ts
type ttt = Promise<number>;
```

infer 用于类型的提取，然后存到一个变量里，相当于局部变量：

```ts
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

类型参数用于接受具体的类型，在类型运算中也相当于局部变量：

```ts
type isTwo<T> = T extends 2 ? true: false;
```

但是，严格来说这三种也都不叫变量，因为它们不能被重新赋值。

TypeScript 设计可以做类型编程的类型系统的目的就是为了产生各种复杂的类型，那不能修改怎么产生新类型呢？

答案是重新构造。

这就涉及到了第二个类型体操套路：重新构造做变换。

## 重新构造

TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造。

数组、字符串、函数等类型的重新构造比较简单。

索引类型，也就是多个元素的聚合类型的重新构造复杂一些，涉及到了映射类型的语法。

我们先从简单的开始：

## 数组类型的重新构造

### Push

有这样一个元组类型：

```ts
type tuple = [1,2,3];
```

我想给这个元组类型再添加一些类型，怎么做呢？

TypeScript 类型变量不支持修改，我们可以构造一个新的元组类型：

```ts
type Push<Arr extends unknown[], Ele> = [...Arr, Ele] 
```

类型参数 Arr 是要修改的数组/元组类型，元素的类型任意，也就是 unknown。

类型参数 Ele 是添加的元素的类型。

返回的是用 Arr 已有的元素加上 Ele 构造的新的元组类型。

```ts
type PushResult = Push<[1,2,3],4>
// type PushResult = [1,2,3,4]
```

这就是数组/元组的重新构造。

> 数组和元组的区别：数组类型是指任意多个同一类型的元素构成的，比如 `number[]`、`Array<number>`，而元组则是数量固定，类型可以不同的元素构成的，比如 `[1, true, 'name']`。

### Unshift

可以在后面添加，同样也可以在前面添加：

```ts
type Unshift<Arr extends  unknown[], Ele> = [Ele, ...Arr];
```

### Zip

有这样两个元组：

```ts
type tuple1 = [1,2];
type tuple2 = ['name', 'value'];
```

我们想把它们合并成这样的元组：

```ts
type tuple = [[1, 'name'], [2, 'value']];
```

思路很容易想到，提取元组中的两个元素，构造成新的元组：

```ts
type Zip<One extends [unknown, unknown], Two extends [unknown, unknown]> = One extends [infer OneFirst, infer TwoSecond]
```