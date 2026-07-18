# Recursive Reuse

Recursion breaks a problem down into a series of similar smaller problems, solving them one by one through a function repeatedly calling itself until a termination condition is met, at which point the problem is solved.

TypeScript's advanced types support type parameters and can perform all kinds of type-level logic to return new types—this corresponds to function calls, so naturally it also supports recursion.

The TypeScript type system doesn't support loops, but it does support recursion. When dealing with a type whose quantity (count, length, depth) is not fixed, you can process just one type at a time, then recursively call yourself to process the next type, until the termination condition—i.e., all types have been processed—is reached. This completes type-level programming over an indeterminate quantity, achieving the effect of a loop.

Since we've mentioned arrays, strings, objects, and other types, let's look at recursion examples for each of these types.

## Recursive Reuse with Promise

### DeepPromiseValueType

Let's warm up with Promise first, by implementing an advanced type that extracts the value type from a Promise nested to an indeterminate depth.

```ts
type ttt = Promise<Promise<Promise<Record<string, any>>>>;
```

Here we have 3 levels of Promise, and the value type is an indexed type.

Whenever the quantity is indeterminate, you should think of recursion—process the extraction for just one level each time, and leave the rest to the next recursive call, until the termination condition is met.

So the advanced type looks like this:

```ts
type DeepPromiseValueType<P extends Promise<unknown>> =
  P extends Promise<infer ValueType>
    ? ValueType extends Promise<unknown>
      ? DeepPromiseValueType<ValueType>
      : ValueType
    : never;
```

The type parameter `P` is the Promise to process, constrained to a Promise type via `extends`. Since the value type is indeterminate, it's set to `unknown`.

Each time, we only handle the extraction of one type—that is, we use pattern matching to extract the value type into the local variable `ValueType` declared via `infer`.

Then we check whether `ValueType` is still a Promise type, and if so, we process it recursively.

The termination condition is when `ValueType` is no longer a Promise type—at that point all levels have been processed, and we return the current `ValueType`.

This way, we extract the value type of the innermost Promise, i.e., the indexed type:

Actually, this type's implementation can be simplified further:

```ts
type DeepPromiseValueType2<T> = T extends Promise<infer ValueType> ? DeepPromiseValueType2<ValueType> : T;
```

We no longer constrain the type parameter to be a Promise, which lets us drop one level of checking.

Next, let's look at recursion over array types.

## Recursion over Array Types

### ReverseArr

Consider the following tuple type:

```ts
type arr = [1, 2, 3, 4, 5];
```

We want to reverse it, i.e., turn it into:

```ts
type arr = [5, 4, 3, 2, 1];
```

Having learned extraction and construction, this is easy to write:

```ts
type ReverseArr<Arr extends unknown[]> = Arr extends [infer One, infer Two, infer Three, infer Four, infer Five]
  ? [Five, Four, Three, Two, One]
  : never;
```

But what if the array length is indeterminate?

Whenever the quantity is indeterminate, your first instinct should be recursion.

We process just one type each time, and handle the rest recursively, until the termination condition is satisfied.

```ts
type ReverseArr<Arr extends unknown[]> = Arr extends [infer First, ...infer Rest] ? [...ReverseArr<Rest>, First] : Arr;
```

The type parameter `Arr` is the array type to process; the element type is indeterminate, i.e., `unknown`.

Each time, we extract just one element into the local variable `First` declared via `infer`, and put the rest into `Rest`.

We use `First` as the last element to construct the new array, and recursively take the remaining elements.

The termination condition is when all elements have been consumed, i.e., the pattern match no longer holds—at that point we return `Arr`.

### Includes

Since recursion can be used as a loop, something like element lookup can naturally be implemented too.

For example, to check whether `4` exists in `[1, 2, 3, 4, 5]`, returning `true` if so and `false` otherwise.

Searching for an element in an array of indeterminate length—since the quantity is indeterminate, you should think of recursion.

```ts
type Includes<Arr extends unknown[], FindItem> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false;

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

The type parameter `Arr` is the array type to search, with an arbitrary element type, i.e., `unknown`. `FindItem` is the element type to look for.

Each time, we extract one element into the local variable `First` declared via `infer`, and put the rest into the local variable `Rest`.

We check whether `First` is the element we're looking for, i.e., whether it equals `FindItem`. If so, we return `true`; otherwise we continue recursively checking the next element.

Until the termination condition is reached—i.e., no next element can be extracted—at which point we return `false`.

The equality check is: `A` is a subtype of `B` and `B` is also a subtype of `A`.

This way, we've implemented element lookup in an array of indeterminate length, using recursion to achieve the effect of a loop.

### RemoveItem

If we can search, we can naturally remove as well—we just need to change the returned result, constructing and returning a new array.

```ts
type RemoveItem<Arr extends unknown[], Item, Result extends unknown[] = []> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result;

type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

The type parameter `Arr` is the array to process, with an arbitrary element type, i.e., `unknown[]`. The type parameter `Item` is the element type to look for. The type parameter `Result` is the new array being constructed, with a default value of `[]`.

We use pattern matching to extract the type of one element from the array. If it's of type `Item`, we remove it—that is, we don't add it to the new array being constructed, and simply return the previous `Result` as is.

Otherwise, we add it to the new array being constructed, i.e., we construct another new array `[...Result, First]`.

Until the pattern match no longer holds—i.e., all elements have been processed—we return the current `Result`.

This way, we've implemented removal of a given element from an array with an indeterminate number of elements:

### BuildArray

We've learned about constructing array types—if the number of elements in the array being constructed is indeterminate, recursion is needed as well.

For example, given `5` and an element type, construct an array of length 5 made up of that element type.

```ts
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
  ? Arr
  : BuildArray<Length, Ele, [...Arr, Ele]>;
```

The type parameter `Length` is the array length, constrained to `number`. The type parameter `Ele` is the element type, with a default value of `unknown`. The type parameter `Arr` is the array being constructed, with a default value of `[]`.

Each time, we check whether the length of `Arr` has reached `Length`. If so, we return `Arr`; otherwise we add one more element to `Arr` and recursively construct further.

Having learned recursion over array types, let's move on to string types.

## Recursion over String Types

### ReplaceAll

When we learned about pattern matching, we implemented an advanced type called `Replace`:

```ts
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str;
```

It can replace one occurrence of a character in a string with another:

But it can't handle the case where there are multiple such characters.

What if we don't know how many `From` characters there are?

In type-level programming, whenever you encounter a problem with an indeterminate quantity, your first instinct should be recursion.

Each recursive call handles just one type—we've already implemented that part—so we just need to add the recursive call.

```ts
type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string,
> = Str extends `${infer Left}${From}${infer Right}` ? `${Left}${To}${ReplaceAll<Right, From, To>}` : Str;
```

The type parameter `Str` is the string type to process, `From` is the character to be replaced, and `To` is the character to replace it with.

We use pattern matching to extract the strings to the left and right of `From` into the local variables `Left` and `Right` declared via `infer`.

We use `Left` and `To` to construct the new string, and continue recursively replacing in the remaining `Right` part.

The termination condition is when the pattern match no longer holds, i.e., there's nothing left to replace—at that point we simply return the string `Str`.

This way, we've implemented string replacement for an arbitrary number of occurrences:

### StringToUnion

We want to extract every character of a string literal type to form a union type, i.e., turn `'dong'` into `'d' | 'o' | 'n' | 'g'`.

How do we do this?

Clearly, this is also extraction and construction:

```ts
type StringToUnion<Str extends string> = Str extends `${infer One}${infer Two}${infer Three}${infer Four}`
  ? One | Two | Three | Four
  : never;
```

But what if the string length is indeterminate?

Whenever the quantity is indeterminate, in type-level programming your first instinct should be recursion.

```ts
type StringToUnion<Str extends string> = Str extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never;
```

The type parameter `Str` is the string type to process, constrained to `string` via `extends`.

We use pattern matching to extract the first character into the local variable `First` declared via `infer`, and put the rest of the characters into the local variable `Rest`.

We use `First` to construct the union type, and recursively take the remaining elements.

This way, we've implemented extraction and union-type construction for a string of indeterminate length:

### ReverseStr

We've implemented array reversal, so naturally we can implement string reversal as well.

It's likewise recursive extraction and construction.

```ts
type ReverseStr<Str extends string, Result extends string = ''> = Str extends `${infer First}${infer Rest}`
  ? ReverseStr<Rest, `${First}${Result}`>
  : Result;
```

The type parameter `Str` is the string to process. The type parameter `Result` is the character string being constructed, with a default value of an empty string.

We use pattern matching to extract the first character into the local variable `First` declared via `infer`, and put the rest of the characters into `Rest`.

We construct a new string using `First` and the previous `Result`, placing `First` at the front. Since recursion processes from left to right, continually prepending characters ends up moving the ones on the right to the left, achieving the reversal effect.

Once the pattern match no longer holds, all characters have been processed.

This way, we've implemented string reversal:

## Recursion over Object Types

### DeepReadonly

Recursion over object types can also be called recursion over indexed types.

Previously, we implemented a mapping over an indexed type, adding the `readonly` modifier to its keys:

```ts
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};
```

What if the depth of this indexed type is indeterminate?

For example, like this:

```ts
type obj = {
  a: {
    b: {
      c: {
        f: () => 'dong';
        d: {
          e: {
            guang: string;
          };
        };
      };
    };
  };
};
```

Whenever the quantity (depth) is indeterminate, in type-level programming your first instinct should naturally be recursion.

Let's add recursive logic to the previous mapping:

```ts
type DeepReadonly<Obj extends Record<string, any>> = {
  readonly [Key in keyof Obj]: Obj[Key] extends object
    ? Obj[Key] extends Function
      ? Obj[Key]
      : DeepReadonly<Obj[Key]>
    : Obj[Key];
};
```

The type parameter `Obj` is the indexed type to process, constrained to `Record<string, any>`—that is, an indexed type whose keys are `string` and whose values can be any type.

The keys are mapped from the original keys, i.e., `Key in keyof Obj`, just with the `readonly` modifier added.

The value needs to be checked: if it's an `object` type and also a `Function`, we simply take the previous value `Obj[Key]` as is.

If it's an `object` type but not a `Function`, that means it's also an indexed type, so we process it recursively as `DeepReadonly<Obj[Key]>`.

Otherwise, if the value is not an `object`, we just return the previous value `Obj[Key]` as is.

This way, we've implemented adding the `readonly` modifier to an indexed type of arbitrary depth:

Let's look at the value of key `a` after processing, and we can see that `b` already has the `readonly` modifier applied.

Let's test it:

Why isn't this being computed here?

Because TypeScript only computes a type when it's actually used.

So we can prepend something like `Obj extends never ? never` or `Obj extends any`, etc., to trigger the computation:

```ts
type DeepReadonly<Obj extends Record<string, any>> = Obj extends any
  ? {
      readonly [Key in keyof Obj]: Obj[Key] extends object
        ? Obj[Key] extends Function
          ? Obj[Key]
          : DeepReadonly<Obj[Key]>
        : Obj[Key];
    }
  : never;
```
