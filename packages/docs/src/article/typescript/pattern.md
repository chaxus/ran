# 模式匹配提取

字符串可以和正则做模式匹配，找到匹配的部分，提取子组，之后可以用 1,2 等引用匹配的子组。

```ts
'abc'.replace(/a(b)c/, '$1,$1,$1')
// 'b,b,b'
```

Typescript 的类型也同样可以做模式匹配。

比如这样一个 Promise 类型：

```ts
type p = Promise<'value'>
```

我们想提取 value 的类型，可以这样做：

```ts
type GetValueType<P> = P extends Promise<infer Value> ? Value : never
```

通过 extends 对传入的类型参数 P 做模式匹配，其中值的类型是需要提取的，通过 infer 声明一个局部变量 Value 来保存，如果匹配，就返回匹配到的 Value，否则就返回 never 代表没匹配到。

```ts
// type GetValueResult = 'value'
type GetValueResult = GetValueType<Promise<'value'>>
```

这就是 Typescript 类型的模式匹配：

Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型。

这个模式匹配的套路有多有用呢？我们来看下在数组、字符串、函数、构造器等类型里的应用。

## 1.数组类型

### 提取第一个元素

数组类型想提取第一个元素的类型怎么做呢？

```ts
type arr = [1, 2, 3]
```

用它来匹配一个模式类型，提取第一个元素的类型到通过 infer 声明的局部变量里返回。

```ts
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]]
  ? First
  : never
```

类型参数 Arr 通过 extends 约束为只能是数组类型，数组元素是 unkown 也就是可以是任何值。

> any 和 unknown 的区别： any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量。

对 Arr 做模式匹配，把我们要提取的第一个元素的类型放到通过 infer 声明的 First 局部变量里，后面的元素可以是任何类型，用 unknown 接收，然后把局部变量 First 返回。

当类型参数 Arr 为 [1,2,3] 时：

```ts
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]]
  ? First
  : never
type GetFirstValue = GetFirst<[1, 2, 3]>
// type GetFirstValue = 1
```

当类型参数 Arr 为 [] 时：

```ts
type GetFirstResult = GetFirst<[]>
// type GetFirstResult = never
```

### 提取最后一个元素

可以提取第一个元素，当然也可以提取最后一个元素，修改下模式类型就行：

```ts
type GetLastValue<Arr extends unknown[]> = Arr extends [...unknown, infer Last]
  ? Last
  : never
```

当类型参数 Arr 为 [1,2,3]时：

```ts
type GetLastResult = GetFirst<[1, 2, 3]>
// type GetLastResult = 3
```

### PopArr

我们分别取了首尾元素，当然也可以取剩余的数组，比如取去掉了最后一个元素的数组：

```ts
type PopArr<Arr extends unknown[]> = Arr extends [...infer Rest, unknown]
  ? Rest
  : never
```

如果是空数组，就直接返回，否则匹配剩余的元素，放到 infer 声明的局部变量 Rest 里，返回 Rest。

当类型参数 Arr 为 [1,2,3] 时：

```ts
type PopResult = PopArr<[1, 2, 3]>
// type PopResult = [1,2]
```

当类型参数 Arr 为 [] 时：

```ts
type PopResult = PopArr<[]>
// type PopResult = []
```

### ShiftArr

同理可得 ShiftArr 的实现：

```ts
type ShiftArr<Arr extends unknown[]> = Arr extends [unknown, ...infer Rest]
  ? Rest
  : never
```

当类型参数 Arr 为 [1,2,3]时：

```ts
type ShiftResult = ShiftArr<[1, 2, 3]>
// type ShiftResult = [2,3]
```

## 2.字符串类型

字符串类型也同样可以做模式匹配，匹配一个模式字符串，把需要提取的部分放到 infer 声明的局部变量里。

### StartsWith

判断字符串是否以某个前缀开头，也是通过模式匹配：

```ts
type StartWith<
  str extends string,
  Prefix extends string,
> = Str extends `${Prefix}${string}` ? true : false
```

需要声明字符串 Str、匹配的前缀 Prefix 两个类型参数，它们都是 string。

用 Str 去匹配一个模式类型，模式类型的前缀是 Prefix，后面是任意的 string，如果匹配返回 true，否则返回 false。

当匹配时：

```ts
type StartWithResult = StartWidth<'prefix string', 'prefix'>
// type StartWithResult = true
```

不匹配时：

```ts
type StartWithResult = StartWidth<'prefix string', 'string'>
// type StartWithResult = false
```

### Replace

字符串可以匹配一个模式类型，提取想要的部分，自然也可以用这些再构成一个新的类型。

比如实现字符串替换：

```ts
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str
```

声明要替换的字符串 Str、待替换的字符串 From、替换成的字符串 3 个类型参数，通过 extends 约束为都是 string 类型。

用 Str 去匹配模式串，模式串由 From 和之前之后的字符串构成，把之前之后的字符串放到通过 infer 声明的局部变量 Prefix、Suffix 里。

用 Prefix、Suffix 加上替换到的字符串 To 构造成新的字符串类型返回。

当匹配时：

```ts
type ReplaceResult = ReplaceStr<'str replace to result', 'result', 'aaaa'>
// type ReplaceResult =  'str replace to aaaa'
```

不匹配时：

```ts
type ReplaceResult = ReplaceStr<'str replace to result', '???', 'aaaa'>
// type ReplaceResult =  'str replace to result'
```

### Trim

能够匹配和替换字符串，那也就能实现去掉空白字符的 Trim：

不过因为我们不知道有多少个空白字符，所以只能一个个匹配和去掉，需要递归。

先实现 TrimRight:

```ts
type TrimRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' ｜ '\t'}` ? TrimRight<Rest> : Str
```

类型参数 Str 是要 Trim 的字符串。

如果 Str 匹配字符串 + 空白字符 (空格、换行、制表符)，那就把字符串放到 infer 声明的局部变量 Rest 里。

把 Rest 作为类型参数递归 TrimRight，直到不匹配，这时的类型参数 Str 就是处理结果。

```ts
type TrimRightResult = TrimRight<'value          '>
// type TrimRightResult = 'value'
```

同理可得 TrimLeft：

```ts
type TrimLeft<Str extends string> = Str extends `${' '|'\n'|'\t'}`${infer Rest} ? TrimLeft<Rest> : Str
```

TrimRight 和 TrimLeft 结合就是 Trim：

```ts
type Trim<Str extends string> = TrimRight<TrimLeft<Str>>
```

## 3.函数

函数同样也可以做类型匹配，比如提取参数、返回值的类型。

### GetParameters

函数类型可以通过模式匹配来提取参数的类型：

```ts
type GetParameters<Func extends Function> = Func extends (
  ...args: infer Args
) => unknown
  ? Args
  : never
```

类型参数 Func 是要匹配的函数类型，通过 extends 约束为 Function。

Func 和模式类型做匹配，参数类型放到用 infer 声明的局部变量 Args 里，返回值可以是任何类型，用 unknown。

返回提取到的参数类型 Args。

```ts
type GetParametersResult = GetParameters<(name: string, age: number) => string>
// type GetParametersResult = [name:string,age:number]
```

### GetReturnType

能提取参数类型，同样也可以提取返回值类型：

```ts
type GetReturnType<Func extends Function> = Func extends (
  ...args: unknown[]
) => infer ReturnType
  ? ReturnType
  : never
```

Func 和模式类型做匹配，提取返回值到通过 infer 声明的局部变量 ReturnType 里返回。

参数类型可以是任意类型，也就是 any[]（注意，这里不能用 unknown，这里的解释涉及到参数的逆变性质，具体原因逆变那一节会解释）。

```ts
type GetReturnTypeResult = GetReturnType<() => 'return value'>
// type GetReturnTypeResult = 'return value'
```

### GetThisParameterType

方法里可以调用 this，比如这样：

```ts
class Dong {
  name: string

  constructor() {
    this.name = 'dong'
  }

  hello() {
    return "hello, I'm " + this.name
  }
}

const dong = new Dong()
dong.hello()
```

用对象.方法名的方式调用的时候，this 就指向那个对象。

但是方法也可以用 call 或者 apply 调用：

```ts
class Dong {
  name: string

  constructor() {
    this.name = 'dong'
  }

  hello() {
    return "hello, I'm " + this.name
  }
}

const dong = new Dong()
dong.hello().call({ x: 1 })
```

call 调用的时候，this 就变了，但这里却没有被检查出来 this 指向的错误。

如何让编译器能够检查出 this 指向的错误呢？

可以在方法声明时指定 this 的类型：

```ts
class Dong {
  name: string

  constructor() {
    this.name = 'dong'
  }

  hello(this: Dong) {
    return "hello, I'm " + this.name
  }
}
```

这样，当 call/apply 调用的时候，就能检查出 this 指向的对象是否是对的：

如果没有报错，说明没开启 `strictBindCallApply` 的编译选项，这个是控制是否按照原函数的类型来检查 bind、call、apply

这里的 this 类型同样也可以通过模式匹配提取出来：

```ts
type GetThisParameterType<T> = T extends (
  this: infer This,
  ...args: unknown[]
) => unknown
  ? This
  : unknown
```

类型参数 T 是待处理的类型。

用 T 匹配一个模式类型，提取 this 的类型到 infer 声明的局部变量 ThisType 中，其余的参数是任意类型，也就是 any，返回值也是任意类型。

返回提取到的 ThisType。

这样就能提取出 this 的类型：

## 4.构造器类型

构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。

同样，我们也可以通过模式匹配提取构造器的参数和返回值的类型：

### GetInstanceType

构造器类型可以用 interface 声明，使用 new(): xx 的语法。

比如：

```ts
interface Person {
  name: string
}

interface PersonConstructor {
  new (name: string): Person
}
```

这里的 PersonConstructor 返回的是 Person 类型的实例对象，这个也可以通过模式匹配取出来。

```ts
type GetInstanceType<ConstructorType extends new (...args: any) => any> =
  ConstructorType extends new (...args: any) => infer InstanceType
    ? InstanceType
    : any
```

类型参数 ConstructorType 是待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType。

这样就能取出构造器对应的实例类型:

```ts
interface PersonConstructor {
  new (name: string): Person
}

type GetInstanceTypeResult = GetInstanceType<PersonConstructor>
// type GetInstanceTypeResult = Person
```

### GetConstructorParameters

GetInstanceType 是提取构造器返回值类型，那同样也可以提取构造器的参数类型：

```ts
type GetConstructorParameters<
  ConstructorType extends new (...args: any) => any,
> = ConstructorType extends new (...args: infer ParametersType) => any
  ? ParametersType
  : never
```

类型参数 ConstructorType 为待处理的类型，通过 extends 约束为构造器类型。

用 ConstructorType 匹配一个模式类型，提取参数的部分到 infer 声明的局部变量 ParametersType 里，返回 ParametersType。

这样就能提取出构造器对应的参数类型：

```ts
interface PersonConstructor {
  new (name: string): Person
}

type GetConstructorParametersResult =
  GetConstructorParameters<PersonConstructor>
// type GetConstructorParametersResult = [name:string]
```

### 索引类型

索引类型也同样可以用模式匹配提取某个索引的值的类型，这个用的也挺多的，比如 React 的 index.d.ts 里的 PropsWithRef 的高级类型，就是通过模式匹配提取了 ref 的值的类型：

```ts
type PropsWithRef<P> = 'ref' extends keyof P
  ? P extends { ref?: infer R | undefined }
    ? string extends R
      ? PropsWithRef<P> & { ref?: Exclude<R, string> | undefined }
      : P
    : P
  : P
```

我们简化一下那个高级类型，提取 Props 里 ref 的类型：

```ts
type GetPropsRef<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? value
    : never
  : never
```

类型参数 Props 为待处理的类型。

通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。

为什么要做这个判断，上面注释里写了：

在 ts3.0 里面如果没有对应的索引，Obj[Key] 返回的是 {} 而不是 never，所以这样做下兼容处理。

如果有 ref 这个索引的话，就通过 infer 提取 Value 的类型返回，否则返回 never。

```ts
type GetPropsRefResult = GetPropsRef<{ ref: 1; name: 'str' }>
// type GetPropsRefResult = 1
```

当 ref 为 undefined 时：

```ts
type GetPropsRefResult = GetPropsRef<{ ref: undefined; name: 'str' }>
// type GetPropsRefResult = undefined
```
