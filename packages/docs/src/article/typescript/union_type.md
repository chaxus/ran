# Distributed Conditional Types

When a type parameter is a union type, and that type parameter is referenced directly on the left side of a conditional type, TypeScript passes each member of the union into the type computation separately, then merges the results back into a union type. This behavior is called a distributed conditional type.

For example, given a union type like this:

```ts
type Union = 'a' | 'b' | 'c';
```

If we want to uppercase the `a`, we could write:

```ts
type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item;
```

```ts
type result = UppercaseA<Union>;
// type result = 'A' | 'b' | 'c';
```

As you can see, our type parameter `Item` is constrained to `string`, and the conditional type checks whether it's `'a'`, but we passed in a union type.

This is TypeScript's special handling of union types inside conditional types: each member of the union is passed in separately for the type computation, and the results are merged afterward.

This is the same behavior as when a union type is used with template literal strings:

This does simplify type-level programming logic, since we don't need to recursively extract each member and process it manually.

It's easy to understand why TypeScript handles union types this way: each member of a union type is unrelated to the others, unlike arrays, indexes, or strings, where the elements have a relationship to each other. So TypeScript was designed to process each member separately and merge the results at the end.

Now that we know how TypeScript handles union types, let's put it into practice:

## CamelcaseUnion

We've implemented `Camelcase` before — it extracts characters from a string, capitalizes the first letter, and reconstructs a new string.

```ts
type Camelcase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
  : Str;
```

It extracts the characters on either side of `_`, uppercases the character on the right, constructs a new string, and recursively processes the remaining string.

```ts
type CamelcaseResult = Camelcase<'aa_aa_aa'>;
// type CamelcaseResult = 'aaAaAa'
```

If we want to apply `Camelcase` to an array of strings, we'd need to recursively process each element:

```ts
type CamelcaseArr<Arr extends unknown[]> = Arr extends [infer Item, ...infer RestArr]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : [];
```

The type parameter `Arr` is the array to process.

We recursively extract each element and apply `Camelcase` to it. Since `Camelcase` requires a `string` to be passed in, we use `& string` here to convert the type to `string`.

But what about union types?

Union types don't need recursive extraction of each member — TypeScript internally passes each member in separately for computation, then merges the results of each member back into a union type.

```ts
type CamelcaseUnion<Item extends string> = Item extends `${infer Left}_${infer Right}${infer Rest}`
  ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
  : Item;
```

Isn't this exactly the same as handling a single string?

That's right — handling a union type is no different from handling a single type; TypeScript splits each individual type apart and passes it in. There's no need to recursively extract each element the way we do with array types.

That does simplify things quite a bit. Sounds like it's all upside, right?

Not quite. This behavior actually introduces some extra cognitive overhead too. Let's look at another example to see why:

## IsUnion

To check whether a type is a union, we'd typically write it like this:

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
```

When passed a union type, it returns `true`:

```ts
type IsUnionResult = IsUnion<'a' | 'b' 'c'>
// type IsUnionResult = true
```

When passed any other type, it returns `false`:

```ts
type IsUnionResult = IsUnion<['a' | 'b' 'c']>
// type IsUnionResult = false
```

This is the cognitive overhead introduced by distributed conditional types.

Let's first look at a type like this:

```ts
type TestUnion<A, B = A> = A extends A ? { a: A; b: B } : never;

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>;
```

When we pass in the union type `'a' | 'b' | 'c'`, the result looks like this:

`A` and `B` are the same union type — so why do their values end up different?

**Because in a conditional type, if the type on the left side is a union type, each member is passed in separately for computation, but the right side is not.**

So when `A` is `'a'`, `B` is `'a' | 'b' | 'c'`; when `A` is `'b'`, `B` is `'a' | 'b' | 'c'`, and so on.

We can use this behavior to implement a check for union types:

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
```

The type parameters `A` and `B` are the union type to check, with `B` defaulting to `A`, i.e., the same type.

**The `A extends A` part looks meaningless at first glance, but its main purpose is to trigger the distributed conditional type, so that each member of `A` is passed in separately.**

**Writing `[B] extends [A]` instead of just `B` avoids triggering the distributed conditional type, so `B` remains the entire union type.**

`B` is the union type as a whole, while `A` is a single member, so naturally the check fails. For non-union types, there's no such special handling — `A` and `B` are the same type, so the check always passes.

This behavior lets us determine whether a type is a union type.

There are two confusing points here worth remembering:

When `A` is a union type:

Writing `A extends A` is done purely to trigger the distributed conditional type, so each member is passed in and processed separately — nothing more.

`A extends A` and `[A] extends [A]` are handled differently: the former checks a single member against the whole type, while the latter checks the entire union type against itself on both sides. This is because the distributed conditional type is only triggered when the left side of `extends` is a bare type parameter.

Once you understand these two points, you've mastered distributed conditional types.

## BEM

BEM is a CSS naming convention that uses the form `block__element--modifier` to describe the style of a particular state of an element within a block.

We can write an advanced type that takes a block, element, and modifier, and returns the constructed class name:

Used like this:

```ts
type bemResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']>;
```

The implementation merges three parts together, but since we're passing in arrays, we'd need to recursively iterate over each element to combine it with the other parts — which is quite cumbersome.

If instead we use union types, we don't need to iterate recursively, because a union type used with a template literal string is also processed by passing each member in separately.

We can convert an array to a union type like this:

```ts
type union = ['aaa', 'bbb'][number];
// type union = 'aaa' | 'bbb'
```

So `BEM` can be implemented like this:

```ts
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[],
> = `${Block}__${Element[number]}--${Modifiers[number]}`;
```

The type parameters `Block`, `Element`, and `Modifiers` correspond to the three parts of the BEM convention. Since `Element` and `Modifiers` may each contain multiple values, they're constrained to `string[]`.

We construct a template literal string type, where `Element` and `Modifiers` are converted to union types via indexed access.

When a template literal string type encounters a union type, each member is passed in separately for computation, producing this effect:

```ts
type RemResult = BEM<'a', ['b', 'c'], ['d', 'e']>;
// type RemResult = 'a__b--d' | 'a__b--e' | 'a__c--d' | 'a__b--e'
```

As you can see, using union types well really does simplify type-level programming logic.

## AllCombinations

Let's implement another advanced type that's also related to union types — one that produces all combinations.

We want that when passed `'A' | 'B'`, it returns all combinations: `'A' | 'B' | 'BA' | 'AB'`.

The approach to this "all combinations" problem is to combine members pairwise, then combine the resulting strings with the remaining strings pairwise as well:

For example, with `'A' | 'B' | 'c'`, we combine A with B and C, combine B with A and C, and combine C with A and B. Then the resulting strings are combined with the other strings again.

Combining any two types produces four results: A, B, AB, and BA.

```ts
type Combination<A extends string, B extends string> = A | B | `${A}${B}` | `${B}${A}`;
```

Then the resulting strings are combined with the remaining strings again.

So the advanced type for all combinations looks like this:

```ts
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never;
```

The type parameters `A` and `B` are the two union types to combine, with `B` defaulting to `A`, i.e., the same type.

The purpose of `A extends A` is to make each member of the union type get passed in and processed separately — something we just learned above.

The processing for `A` is to combine it with every type remaining in `B` after removing `A` — that is, `Combination<A, all combinations of B with A removed>`.

And all combinations of `B` with `A` removed is `AllCombinations<Exclude<B, A>>`. So the full combination is `Combination<A, AllCombinations<Exclude<B, A>>>`.

## Summary

Each member of a union type is independent of the others. TypeScript gives union types special treatment: when they're used with template literal string types or conditional types, each member is passed in separately for computation, and the results for each member are merged back into a union type at the end.

This behavior is triggered whenever the left side of a conditional type is a union type, and it's called a distributed conditional type.

There are two points worth paying special attention to:

- `A extends A` is not meaningless — its purpose is to extract each individual member of the union type into `A`.

- `A extends A` triggers a distributed conditional type, but `[A] extends [A]` does not — only a bare type parameter on the left side triggers it.

Through the examples we worked through, we found that this distributive characteristic of union types really does simplify type-level programming, though it also adds some cognitive overhead — which is, in the end, unavoidable.
