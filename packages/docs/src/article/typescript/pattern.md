# Pattern Matching and Extraction

Strings can be pattern-matched against regular expressions to find matching parts and extract subgroups, which can then be referenced later using `$1`, `$2`, and so on.

```ts
'abc'.replace(/a(b)c/, '$1,$1,$1');
// 'b,b,b'
```

TypeScript types can do pattern matching in the same way.

For example, take a `Promise` type like this:

```ts
type p = Promise<'value'>;
```

If we want to extract the type of `value`, we can do this:

```ts
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

We use `extends` to pattern-match against the incoming type parameter `P`. The value type we need to extract is captured into a local variable `Value` declared with `infer`. If the match succeeds, we return the matched `Value`; otherwise we return `never` to indicate no match.

```ts
// type GetValueResult = 'value'
type GetValueResult = GetValueType<Promise<'value'>>;
```

This is pattern matching for TypeScript types:

TypeScript's type-level pattern matching works by using `extends` to match a type parameter, storing the result in a local type variable declared with `infer`. If the match succeeds, the extracted type can be retrieved from that local variable.

How useful is this pattern-matching approach? Let's look at how it applies to array, string, function, and constructor types.

## 1. Array Types

### Extracting the first element

How do we extract the type of the first element from an array type?

```ts
type arr = [1, 2, 3];
```

We match it against a pattern type, extracting the first element's type into a local variable declared with `infer` and returning it.

```ts
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never;
```

The type parameter `Arr` is constrained via `extends` to be an array type only, and its elements are `unknown`, meaning they can be any value.

> The difference between `any` and `unknown`: both `any` and `unknown` represent arbitrary types, but `unknown` can only accept a value of any type, whereas `any` can not only accept a value of any type but also be assigned to any type (except `never`). In type gymnastics, `unknown` is often used to accept and match any type, while it's rare to assign an arbitrary type to some type variable.

We pattern-match against `Arr`, placing the type of the first element we want to extract into the local variable `First` declared with `infer`. The remaining elements can be of any type, captured with `unknown`, and then we return the local variable `First`.

When the type parameter `Arr` is `[1, 2, 3]`:

```ts
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never;
type GetFirstValue = GetFirst<[1, 2, 3]>;
// type GetFirstValue = 1
```

When the type parameter `Arr` is `[]`:

```ts
type GetFirstResult = GetFirst<[]>;
// type GetFirstResult = never
```

### Extracting the last element

Just as we can extract the first element, we can also extract the last one — just tweak the pattern type:

```ts
type GetLastValue<Arr extends unknown[]> = Arr extends [...unknown, infer Last] ? Last : never;
```

When the type parameter `Arr` is `[1, 2, 3]`:

```ts
type GetLastResult = GetFirst<[1, 2, 3]>;
// type GetLastResult = 3
```

### PopArr

We've extracted the first and last elements separately; naturally we can also extract the remaining array, such as the array with its last element removed:

```ts
type PopArr<Arr extends unknown[]> = Arr extends [...infer Rest, unknown] ? Rest : never;
```

If it's an empty array, it's returned as-is; otherwise the remaining elements are matched and placed into the local variable `Rest` declared with `infer`, which is then returned.

When the type parameter `Arr` is `[1, 2, 3]`:

```ts
type PopResult = PopArr<[1, 2, 3]>;
// type PopResult = [1,2]
```

When the type parameter `Arr` is `[]`:

```ts
type PopResult = PopArr<[]>;
// type PopResult = []
```

### ShiftArr

The implementation of `ShiftArr` follows the same logic:

```ts
type ShiftArr<Arr extends unknown[]> = Arr extends [unknown, ...infer Rest] ? Rest : never;
```

When the type parameter `Arr` is `[1, 2, 3]`:

```ts
type ShiftResult = ShiftArr<[1, 2, 3]>;
// type ShiftResult = [2,3]
```

## 2. String Types

String types can likewise be pattern-matched: we match against a pattern string and place the part we need to extract into a local variable declared with `infer`.

### StartsWith

Determining whether a string starts with a given prefix is also done via pattern matching:

```ts
type StartWith<str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false;
```

We need to declare two type parameters — the string `Str` and the prefix to match `Prefix` — both of which are `string`.

We match `Str` against a pattern type whose prefix is `Prefix` followed by any `string`. If it matches, return `true`; otherwise return `false`.

When it matches:

```ts
type StartWithResult = StartWidth<'prefix string', 'prefix'>;
// type StartWithResult = true
```

When it doesn't match:

```ts
type StartWithResult = StartWidth<'prefix string', 'string'>;
// type StartWithResult = false
```

### Replace

A string can be matched against a pattern type to extract the parts we want, which can naturally then be used to construct a new type.

For example, implementing string replacement:

```ts
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str;
```

We declare three type parameters: `Str`, the string to perform the replacement on; `From`, the substring to be replaced; and `To`, the string to replace it with — all constrained to `string` via `extends`.

We match `Str` against a pattern string made up of `From` along with whatever comes before and after it, placing the preceding and following strings into the local variables `Prefix` and `Suffix` declared with `infer`.

We then construct a new string type using `Prefix`, `Suffix`, and the replacement string `To`, and return it.

When it matches:

```ts
type ReplaceResult = ReplaceStr<'str replace to result', 'result', 'aaaa'>;
// type ReplaceResult =  'str replace to aaaa'
```

When it doesn't match:

```ts
type ReplaceResult = ReplaceStr<'str replace to result', '???', 'aaaa'>;
// type ReplaceResult =  'str replace to result'
```

### Trim

Since we can match and replace strings, we can also implement `Trim`, which strips whitespace characters.

However, since we don't know how many whitespace characters there are, we can only match and remove them one at a time, which requires recursion.

Let's implement `TrimRight` first:

```ts
type TrimRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimRight<Rest> : Str;
```

The type parameter `Str` is the string to trim.

If `Str` matches a string followed by a whitespace character (space, newline, or tab), the preceding string is placed into the local variable `Rest` declared with `infer`.

We then recurse `TrimRight` with `Rest` as the type parameter until there's no match, at which point the current `Str` type parameter is the result.

```ts
type TrimRightResult = TrimRight<'value          '>;
// type TrimRightResult = 'value'
```

`TrimLeft` follows the same logic:

```ts
type TrimLeft<Str extends string> = Str extends `${' '|'\n'|'\t'}`${infer Rest} ? TrimLeft<Rest> : Str
```

Combining `TrimRight` and `TrimLeft` gives us `Trim`:

```ts
type Trim<Str extends string> = TrimRight<TrimLeft<Str>>;
```

## 3. Functions

Functions can also be type-matched, for example to extract parameter and return-value types.

### GetParameters

We can use pattern matching to extract a function type's parameter types:

```ts
type GetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never;
```

The type parameter `Func` is the function type to match, constrained to `Function` via `extends`.

We match `Func` against a pattern type, placing the parameter types into the local variable `Args` declared with `infer`. The return value can be of any type, so we use `unknown`.

We return the extracted parameter type `Args`.

```ts
type GetParametersResult = GetParameters<(name: string, age: number) => string>;
// type GetParametersResult = [name:string,age:number]
```

### GetReturnType

Just as we can extract parameter types, we can also extract the return type:

```ts
type GetReturnType<Func extends Function> = Func extends (...args: unknown[]) => infer ReturnType ? ReturnType : never;
```

We match `Func` against a pattern type, extracting the return value into the local variable `ReturnType` declared with `infer` and returning it.

The parameter types can be of any type, i.e. `any[]` (note: `unknown` can't be used here — the reason involves the contravariant nature of parameters, which will be explained in detail in the section on contravariance).

```ts
type GetReturnTypeResult = GetReturnType<() => 'return value'>;
// type GetReturnTypeResult = 'return value'
```

### GetThisParameterType

Methods can reference `this`, for example like this:

```ts
class Dong {
  name: string;

  constructor() {
    this.name = 'dong';
  }

  hello() {
    return "hello, I'm " + this.name;
  }
}

const dong = new Dong();
dong.hello();
```

When calling via `object.methodName`, `this` refers to that object.

But methods can also be invoked via `call` or `apply`:

```ts
class Dong {
  name: string;

  constructor() {
    this.name = 'dong';
  }

  hello() {
    return "hello, I'm " + this.name;
  }
}

const dong = new Dong();
dong.hello().call({ x: 1 });
```

When called via `call`, `this` changes, but here the mismatch in what `this` points to is not caught by the checker.

How can we get the compiler to catch errors involving what `this` refers to?

We can specify the type of `this` when declaring the method:

```ts
class Dong {
  name: string;

  constructor() {
    this.name = 'dong';
  }

  hello(this: Dong) {
    return "hello, I'm " + this.name;
  }
}
```

This way, when called via `call`/`apply`, the compiler can check whether the object `this` refers to is correct:

If no error is raised, it means the `strictBindCallApply` compiler option isn't enabled — this option controls whether `bind`, `call`, and `apply` are checked against the original function's type.

This `this` type can likewise be extracted via pattern matching:

```ts
type GetThisParameterType<T> = T extends (this: infer This, ...args: unknown[]) => unknown ? This : unknown;
```

The type parameter `T` is the type to process.

We match `T` against a pattern type, extracting the type of `this` into the local variable `ThisType` declared with `infer`. The remaining parameters can be of any type, i.e. `any`, and the return value can also be any type.

We return the extracted `ThisType`.

This allows us to extract the type of `this`:

## 4. Constructor Types

The difference between a constructor and a function is that a constructor is used to create objects, so it can be invoked with `new`.

Likewise, we can use pattern matching to extract a constructor's parameter and return types:

### GetInstanceType

Constructor types can be declared with an `interface`, using the `new (): xx` syntax.

For example:

```ts
interface Person {
  name: string;
}

interface PersonConstructor {
  new (name: string): Person;
}
```

Here, `PersonConstructor` returns an instance object of type `Person`, which can also be extracted via pattern matching.

```ts
type GetInstanceType<ConstructorType extends new (...args: any) => any> = ConstructorType extends new (
  ...args: any
) => infer InstanceType
  ? InstanceType
  : any;
```

The type parameter `ConstructorType` is the type to process, constrained to a constructor type via `extends`.

We match `ConstructorType` against a pattern type, extracting the returned instance type into the local variable `InstanceType` declared with `infer`, and return `InstanceType`.

This lets us extract the instance type corresponding to a constructor:

```ts
interface PersonConstructor {
  new (name: string): Person;
}

type GetInstanceTypeResult = GetInstanceType<PersonConstructor>;
// type GetInstanceTypeResult = Person
```

### GetConstructorParameters

`GetInstanceType` extracts a constructor's return type; similarly, we can also extract a constructor's parameter types:

```ts
type GetConstructorParameters<ConstructorType extends new (...args: any) => any> = ConstructorType extends new (
  ...args: infer ParametersType
) => any
  ? ParametersType
  : never;
```

The type parameter `ConstructorType` is the type to process, constrained to a constructor type via `extends`.

We match `ConstructorType` against a pattern type, extracting the parameters into the local variable `ParametersType` declared with `infer`, and return `ParametersType`.

This lets us extract the parameter types corresponding to a constructor:

```ts
interface PersonConstructor {
  new (name: string): Person;
}

type GetConstructorParametersResult = GetConstructorParameters<PersonConstructor>;
// type GetConstructorParametersResult = [name:string]
```

### Index Types

Index types can also have the type of a given index's value extracted via pattern matching — this is used quite often. For example, the `PropsWithRef` advanced type in React's `index.d.ts` extracts the type of the `ref` value via pattern matching:

```ts
type PropsWithRef<P> = 'ref' extends keyof P
  ? P extends { ref?: infer R | undefined }
    ? string extends R
      ? PropsWithRef<P> & { ref?: Exclude<R, string> | undefined }
      : P
    : P
  : P;
```

Let's simplify that advanced type to extract the type of `ref` on `Props`:

```ts
type GetPropsRef<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? value
    : never
  : never;
```

The type parameter `Props` is the type to process.

We use `keyof Props` to get the union type made up of all of `Props`'s keys, and check whether `ref` is among them — i.e. `'ref' extends keyof Props`.

Why do we need this check? As noted above:

In TS 3.0, if there's no corresponding index, `Obj[Key]` returns `{}` rather than `never`, so this check is there for compatibility.

If the `ref` key exists, we extract the type of `Value` via `infer` and return it; otherwise we return `never`.

```ts
type GetPropsRefResult = GetPropsRef<{ ref: 1; name: 'str' }>;
// type GetPropsRefResult = 1
```

When `ref` is `undefined`:

```ts
type GetPropsRefResult = GetPropsRef<{ ref: undefined; name: 'str' }>;
// type GetPropsRefResult = undefined
```
