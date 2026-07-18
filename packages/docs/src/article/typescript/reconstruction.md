# Reconstruction for Transformation

The main purpose of type programming is to transform types in various ways — so how do we modify a type?

The TypeScript type system supports 3 kinds of "variables" that can declare an arbitrary type: `type`, `infer`, and type parameters.

`type` is called a type alias — it's essentially declaring a variable that stores some type:

```ts
type ttt = Promise<number>;
```

`infer` is used to extract a type and store it in a variable, similar to a local variable:

```ts
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

Type parameters are used to accept a concrete type, and in type-level computation they also act like local variables:

```ts
type isTwo<T> = T extends 2 ? true : false;
```

Strictly speaking, though, none of these three are actually "variables," because they can't be reassigned.

TypeScript designed a type system capable of type programming precisely so it could produce all kinds of complex types — so if we can't modify a type, how do we produce a new one?

The answer is reconstruction.

This brings us to the second type-gymnastics pattern: reconstruction for transformation.

## Reconstruction

Variables declared via `type`, `infer`, or type parameters in TypeScript can't be modified. To transform a type and produce a new one, you need to reconstruct it.

Reconstructing array, string, and function types is fairly simple.

Reconstructing index types — that is, aggregate types made up of multiple elements — is a bit more complex, involving mapped type syntax.

Let's start with the simple cases:

## Reconstructing Array Types

### Push

Given a tuple type like this:

```ts
type tuple = [1, 2, 3];
```

I want to add more elements to this tuple type — how do I do that?

Since TypeScript type variables don't support modification, we can construct a new tuple type instead:

```ts
type Push<Arr extends unknown[], Ele> = [...Arr, Ele];
```

The type parameter `Arr` is the array/tuple type to modify, and its element type is arbitrary, i.e., `unknown`.

The type parameter `Ele` is the type of the element being added.

The result is a new tuple type constructed from `Arr`'s existing elements plus `Ele`.

```ts
type PushResult = Push<[1, 2, 3], 4>;
// type PushResult = [1,2,3,4]
```

This is reconstruction for arrays/tuples.

> The difference between arrays and tuples: an array type consists of any number of elements of the same type, e.g. `number[]`, `Array<number>`, while a tuple has a fixed number of elements whose types can differ, e.g. `[1, true, 'name']`.

### Unshift

Just as we can append to the end, we can also prepend to the front:

```ts
type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr];
```

### Zip

Given these two tuples:

```ts
type tuple1 = [1, 2];
type tuple2 = ['name', 'value'];
```

we want to merge them into a tuple like this:

```ts
type tuple = [[1, 'name'], [2, 'value']];
```

The approach is straightforward: extract the two elements from each tuple, then construct a new tuple from them:

```ts
type Zip<One extends [unknown, unknown], Other extends [unknown, unknown]> = One extends [
  infer OneFirst,
  infer OneSecond,
]
  ? Other extends [infer OtherFirst, infer OtherSecond]
    ? [[OneFirst, OtherFirst], [OneSecond, OtherSecond]]
    : []
  : [];
```

The two type parameters `One` and `Other` are tuples of type `[unknown, unknown]`, representing tuples made of 2 elements of arbitrary type.

Using `infer`, we extract the elements of `One` and `Other` into the local variables `OneFirst`, `OneSecond`, `OtherFirst`, and `OtherSecond` declared by `infer`.

Then we construct and return a new tuple from these extracted elements:

```ts
type ZipResult = Zip<[1, 2], ['name', 'value']>;
// type ZipResult = [[1, 'name'], [2, 'value']];
```

But this only merges tuples with two elements — what if there are an arbitrary number of elements?

Then we need recursion:

```ts
type Zip<One extends unknown[], Other extends unknown[]> = One extends [infer OneFirst, ...infer OneRest]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip<OneRest, OtherRest>]
    : []
  : [];
```

The type parameters `One` and `Other` are declared as `unknown[]`, i.e., arrays with an arbitrary number of elements of arbitrary type.

Each time, we extract the first elements of `One` and `Other` — `OneFirst` and `OtherFirst` — and put the rest into `OneRest` and `OtherRest`.

`OneFirst` and `OtherFirst` are used to construct one element of the new tuple, and the remaining elements are handled by recursively processing `OneRest` and `OtherRest`.

This way, we can merge tuples of any number of elements:

```ts
type ZipResult = Zip<[1, 2, 3, 4, 5], ['name', 'value', 'three', 'four', 'five']>;
// type ZipResult = [[1, 'name'], [2, 'value'], [3, 'three'], [4, 'four'], [5, 'five']];
```

Now that we understand reconstructing array types, let's look at reconstructing string types:

## Reconstructing String Types

### CapitalizeStr

We want to transform the string literal type `'guang'` into `'Guang'`, with the first letter capitalized.

This requires extracting and reconstructing string types:

```ts
type CapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str;
```

We declare the type parameter `Str` as the string type to process, constrained to `string` via `extends`.

Using `infer`, we extract the first character into the local variable `First`, and the remaining characters into the local variable `Rest`.

Then we use TypeScript's built-in utility type `Uppercase` to capitalize the first letter, append `Rest`, and construct and return a new string type.

This is reconstruction for string types: extracting parts of an existing string type, applying a series of transformations, and constructing a new string type.

### CamelCase

Let's also implement the transformation from `dong_dong_dong` to `dongDongDong`.

Again, this is extraction plus reconstruction:

```ts
type CamelCase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
  : Str;
```

The type parameter `Str` is the string type to process, constrained to `string`.

We extract the characters before and after the `_` into the local variables `Left` and `Right` declared by `infer`, and put the remaining characters into `Rest`.

Then we uppercase the right-hand character `Right`, construct a new string with `Left`, and recursively process the remaining characters `Rest`.

This completes the transformation from snake_case to camelCase:

### DropSubStr

Just as we can modify a string, we can also delete part of it. Let's do an example of removing a substring from a string:

```ts
type DropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str;
```

The type parameter `Str` is the string to process, and `SubStr` is the substring to remove; both are constrained to `string` via `extends`.

Using pattern matching, we extract the strings before and after `SubStr` into the local variables `Prefix` and `Suffix` declared by `infer`.

If there's no match, we return `Str` directly.

If there is a match, we construct a new string from `Prefix` and `Suffix`, then continue recursively removing `SubStr` until there's no more match, i.e., no more occurrences of `SubStr` remain.

After looking at reconstruction for string types, let's move on to reconstruction for function types:

## Reconstructing Function Types

### AppendArgument

Earlier, we implemented extraction of parameters and return values separately. Reconstruction, then, is just modifying these extracted types and constructing a new type from them.

For example, adding a parameter to an existing function type:

```ts
type AppendArgument<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnType
  ? (...args: [...Args, Arg]) => ReturnType
  : never;
```

The type parameter `Func` is the function type to process, constrained to `Function` via `extends`, and `Arg` is the type of the parameter to add.

Using pattern matching, we extract the parameters into the local variable `Args` declared by `infer`, and extract the return value into the local variable `ReturnType`.

We construct a new parameter type by appending `Arg` to the `Args` array, and combine it with `ReturnType` to construct and return a new function type.

This completes the modification of a function type:

Finally, let's look at reconstruction for index types.

## Reconstructing Index Types

An index type is a type that aggregates multiple elements — classes, objects, etc. are all index types. For example, this is an index type:

```ts
type obj = {
  name: string;
  age: number;
  gender: boolean;
};
```

Index types can have modifiers added, such as `readonly` (read-only) or `?` (optional):

```ts
type obj = {
  readonly name: string;
  age?: number;
  gender: boolean;
};
```

Modifying it and constructing a new type involves mapped type syntax:

```ts
type Mapping<Obj extends object> = {
  [Key in keyof Obj]: Obj[Key];
};
```

### Mapping

During mapping, we can also modify the value, for example:

```ts
type Mapping<Obj extends object> = {
  [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]];
};
```

The type parameter `Obj` is the index type to process, constrained to `object` via `extends`.

We use `keyof` to extract the keys of `Obj` as the keys of the new index type, i.e., `Key in keyof Obj`.

The type of the value can be transformed — here we take the original value `Obj[Key]` and construct a three-element tuple type from it: `[Obj[Key], Obj[Key], Obj[Key]]`:

### UppercaseKey

Besides modifying the value, we can also modify the key using `as` — this is called remapping.

For example, converting the keys of an index type to uppercase:

```ts
type UppercaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
};
```

The type parameter `Obj` is the index type to process, constrained to `object` via `extends`.

The keys of the new index type start out as the keys of `Obj`, i.e., `Key in keyof Obj`, but undergo a transformation — the part after `as`.

We use `Uppercase` to convert the key `Key` to uppercase. Since a key can be of type `string`, `number`, or `symbol`, but `Uppercase` only accepts `string`, we intersect with `& string` to take only the `string` portion of the key.

The value stays unchanged — it remains the type of the value corresponding to the original key, `Obj[Key]`.

The resulting index type converts the original index type's keys to uppercase:

### Record

TypeScript provides the built-in utility type `Record` for creating index types:

```ts
type Record<K extends string | number | symbol, T> = { [P in K]: T };
```

By specifying the key and value types as `K` and `T`, you can create a corresponding index type.

Above, we constrained the index type using `object`; a more semantically appropriate choice is `Record<string, any>`:

```ts
type UppercaseKey<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
};
```

This constrains the type parameter `Obj` to be an index type whose keys are `string` and whose values are of any type.

### ToReadonly

An index type's keys can have the `readonly` modifier added, meaning read-only.

So we can implement a utility type that adds `readonly` to an index type:

```ts
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
```

Using a mapped type, we construct a new index type where the keys are marked `readonly`, while everything else stays the same — the keys remain the original keys, `Key in keyof T`, and the values remain the original values, `T[Key]`.

### ToPartial

Similarly, an index type's keys can also have the optional modifier added:

```ts
type ToPartial<T> = {
  [Key in keyof T]?: T[Key];
};
```

This adds the `?` optional modifier to the keys of index type `T`, while everything else stays the same.

### ToMutable

Just as we can add the `readonly` modifier, we can also remove it:

```ts
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key];
};
```

This removes the `readonly` modifier from every key of index type `T`, while everything else stays the same.

### ToRequired

Similarly, we can also remove the optional modifier:

```ts
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key];
};
```

This removes the `?` modifier from the keys of index type `T`, while everything else stays the same.

### FilterByValueType

We can also filter based on the value's type while constructing a new index type:

```ts
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key];
};
```

The type parameter `Obj` is the index type to process, constrained via `extends` to `Record<string, any>` — an index type whose keys are `string` and whose values are of any type.

The type parameter `ValueType` is the value type to filter for.

We construct a new index type whose keys start out as the keys of `Obj`, i.e., `Key in keyof Obj`, but undergo a transformation — the part after `as`.

If the original key's value `Obj[Key]` is of type `ValueType`, the key remains the original key `Key`; otherwise the key is set to `never`. Keys of type `never` are dropped when the new index type is generated.

The value stays unchanged — it remains the value of the original key, `Obj[Key]`.

This achieves the goal of filtering an index type's keys to produce a new index type:
