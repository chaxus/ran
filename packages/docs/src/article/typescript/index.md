# TypeScript's Type System

## I. What Is a Type

Concretely, a type refers to primitive types like number, boolean, and string, as well as composite types like Object and Function. Types are the abstraction that programming languages provide for different kinds of data:

- **Different types occupy different amounts of memory:** a boolean variable is allocated 4 bytes of memory, while a number variable is allocated 8 bytes. Declaring a variable with a different type means it occupies a different amount of memory space.

- **Different types support different operations:** a number can be added, subtracted, multiplied, or divided, but a boolean cannot. Among composite types, different objects support different methods — for example, Date and RegExp. A variable's type determines what operations can be performed on it.

Once types exist, our operations must match the type, or else an error occurs — this is type checking.

If we can guarantee that only operations allowed by a given type are performed on it, that is called type safety.

Type checking can happen at runtime, or ahead of time during compilation. These are two different approaches: the former is called dynamic type checking, and the latter static type checking.

Each approach has its pros and cons. Dynamic type checking keeps no type information in the source code — any value can be assigned to a variable, and any operation can be performed, making the code very flexible to write. But this also plants the seeds of type-unsafe bugs: for example, multiplying or dividing a string, or calling the `exec` method on a Date object — these errors can only be caught at runtime.

Among these, the most common errors are probably things like "null is not an object" and "undefined is not a function." A type mismatch that goes unnoticed while writing the code only surfaces at runtime, producing many such errors.

So while dynamic typing is simpler to write, the code can easily hide type-mismatch pitfalls.

Static type checking, on the other hand, preserves type information in the source code: declaring a variable requires specifying its type, and operations on that variable must match the declared type — a dedicated compiler checks this at compile time.

Static typing adds some difficulty to writing code, because in addition to the logic you want to express, you also have to consider type logic: what type a variable is, whether it matches, whether a type conversion is needed, and so on.

However, static typing also eliminates the risk of type-unsafe bugs, because type checking happens at compile time — you'll never end up multiplying a string or calling `exec` on a Date object.

So while static typing requires more consideration and is more complex to write, it eliminates the possibility of type-unsafe issues hiding in the code.

Now that we understand the difference between dynamic and static type checking, we can naturally draw this conclusion:

Dynamic typing is fine for simple scenarios, but not well suited to large projects, because there could be too many hidden pitfalls in the code — if a type-mismatch error shows up in production, it could be a serious problem.

Static typing, while it increases the cost of writing code, better guarantees code robustness and reduces the bug rate.

So large projects are destined to be built with statically typed languages.

## II. Classification of Type Systems

### 1. Simple type systems

Variables, functions, classes, and so on can all be declared with types, and the compiler performs type checking based on the declared types, raising an error when types don't match.

This is the most basic kind of type system. It guarantees type safety, but can be somewhat rigid.

For instance, an `add` function that needs to support both integer addition and floating-point addition requires declaring two separate functions:

```c
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}
```

The obvious solution: what if the type itself could be a parameter? Pass in `int` and get integer addition; pass in `double` and get floating-point addition.

And so we arrive at the second kind of type system.

### 2. Type systems that support generics

"Generic" is short for Generic Type — a general-purpose type that can stand in for any type. It's also called a type parameter.

It adds some flexibility to the type system: when the overall structure is fixed but some variable types vary, generics can eliminate a lot of duplicate code.

Take the `add` function above — with generics, it can be written like this:

```java
T add<T>(T a, T b) {
    return a + b;
}

add(1,2);
add(1.111, 2.2222);
```

At declaration time, the type that will vary is declared as a generic (i.e., a type parameter), and the concrete type is determined at call time.

Java is this kind of type system. If you've looked at Java code, you'll notice generics are used extensively — it's indeed a great feature for adding flexibility to a type system.

However, this level of flexibility isn't enough for JavaScript, because JavaScript is far more flexible.

For example, in Java, objects are always created by `new`-ing a class — you can't create an object out of thin air. But JavaScript can, since it supports object literals.

So how would you write the type for a function that returns the value of some property on an object?

```ts
function getPropValue<T>(obj: T, key): TypeOfValueForKey {
  return obj[key];
}
```

It seems that just having `T` isn't enough — you also can't get at its properties and their value types. It would help if we could perform some logic on the type parameter `T`.

And so we arrive at the third kind of type system.

### 3. Type systems that support type-level programming

In Java, once you have an object's type, you can find its class and, from there, all sorts of information — so a type system that supports generics is enough.

But in JavaScript, objects can be created as literals, and properties can be freely added or removed — getting hold of an object doesn't tell you much on its own. So the type system needs to support further processing of the type parameters passed in.

Performing various logical operations on a passed-in type parameter (generic) to produce a new type — that's type-level programming.

For the `getPropValue` function above, the type can be written like this:

```ts
function getPropValue<T extends object, Key extends keyof T>(obj: T, key: Key): T[Key] {
  return obj[key];
}
```

Here, `keyof T` and `T[Key]` are type-level operations performed on the type parameter `T`.

TypeScript's type system is this third kind — it supports all sorts of logical processing on type parameters, allowing for very complex type-level logic.

How complex can type-level logic get?

Type-level logic performs various operations on type parameters and can implement a lot of powerful functionality.

Take this `ParseQueryString` type, for example:

```ts
type res = ParseQueryString<'a=1&b=2&c=3'>;
```

It can parse the string passed in as a type parameter and return the parsed result — equivalent to:

```ts
type res = {
  a: '1';
  b: '2';
  c: '3';
};
```

Could Java's generics-only type system do this? Clearly not. But TypeScript's type system can, because it can perform all sorts of logical processing on generics (type parameters).

That said, the type-level logic for this type takes quite a bit of code (don't worry if the TS type below doesn't make sense yet — it will be explained in detail in the mnemonics section; this is just to give you a feel for the complexity of type-level programming. Once you've finished learning, you'll be able to implement advanced types like this yourself):

```ts
type ParseParam<Param extends string> = Param extends `${infer Key}=${infer Value}`
  ? {
      [K in Key]: Value;
    }
  : {};

type MergeValues<One, Other> = One extends Other ? One : Other extends unknown[] ? [One, ...Other] : [One, Other];

type MergeParams<OneParam extends Record<string, any>, OtherParam extends Record<string, any>> = {
  [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
      ? OtherParam[Key]
      : never;
};
type ParseQueryString<Str extends string> = Str extends `${infer Param}&${infer Rest}`
  ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
  : ParseParam<Str>;
```

TypeScript's type system is Turing complete, meaning it can describe any computable logic. In simple terms, it has all the constructs JS has — loops, conditionals, and so on — so anything JS logic can express, the type system can express too.

Programming with type parameters is the most powerful part of TypeScript's type system, letting you implement all sorts of complex type-level computation — that's its strength. But it's also considered its weakness, because on top of business logic, you also have to write a lot of type-level logic.

That said, I'd argue this complexity is unavoidable, because JS itself is flexible enough that a type system designed to accurately describe it must be flexible enough too.

### 4. Type safety and variance

TypeScript adds a static type system to JavaScript in order to guarantee type safety — that is, to ensure a variable can only be assigned a value of the same type, and an object can only access the properties and methods it actually has.

For example, a `number` value cannot be assigned to a `boolean` variable, and a `Date` object cannot call the `exec` method.

That's what type checking does — when a type safety issue arises, it produces a compile-time error.

But this type-safety restriction can't be too rigid either — sometimes some flexibility is needed. For example, a subtype can be assigned to a variable of its parent type and used entirely as if it were the parent type — this is called "variance" (a change in type).

This "variance" comes in two flavors: when a subtype can be assigned to a parent type, it's called covariance; when a parent type can be assigned to a subtype, it's called contravariance.

Let's start with covariance:

#### Covariant

A type conversion applied to the output parameters of a concrete member, following the "Liskov Substitution Principle."

Covariance is easy to understand. Say we have two interfaces:

```ts
interface Animal {
  name: string;
  age: number;
}

interface Cat {
  name: string;
  age: number;
  hobbies: string[];
}
```

Here, `Cat` is a subtype of `Animal` — it's more specific — so a variable of type `Cat` can be assigned to a variable of type `Animal`:

```ts
let animal: Animal = {
  name: 'cat',
  age: 3,
};

let cat: Cat = {
  name: 'Tony',
  age: 5,
  hobbies: ['run', 'swim'],
};

animal = cat;
```

This doesn't produce an error. Even though the two types differ, it's still type safe.

This case — where a subtype can be assigned to a parent type — is called covariance.

It's easy to see why covariance needs to be supported: if the type system supports parent-child type relationships, but a subtype still couldn't be assigned to its parent type, would it really be a parent-child relationship at all?

So variance is necessary to implement type parent-child relationships — it adds flexibility to the type system while still guaranteeing type safety.

Contravariance is a bit harder to grasp:

#### Contravariant

A type conversion applied to the input parameters of a concrete member, following the "Liskov Substitution Principle."

Say we have these two functions:

```ts
let printHobbies: (cat: Cat) => void;

printHobbies = (cat) => {
  console.log(cat.hobbies);
};

let printName: (animal: Animal) => void;

printName = (animal) => {
  console.log(animal.name);
};
```

The parameter type of `printHobbies` is a subtype of the parameter type of `printName`.

So here's the question: can `printName` be assigned to `printHobbies`? Can `printHobbies` be assigned to `printName`?

Testing it out, here's what happens:

```ts
let printHobbies: (cat: Cat) => void;

printHobbies = (cat) => {
  console.log(cat.hobbies);
};

let printName: (animal: Animal) => void;

printName = (animal) => {
  console.log(animal.name);
};

printHobbies = printName;
```

Isn't `printName`'s parameter type the parent type of `printHobbies`'s parameter type? Why can it be assigned to the one with the subtype parameter?

Because when this function is called, it's constrained by the subtype, but the function body actually only uses properties and methods of the parent type — so naturally there's no problem, and it's still type safe.

This is contravariance: function parameters are contravariant (while return values are covariant — a subtype can be assigned to the parent type).

Now, what about the other direction — what happens if `printHobbies` is assigned to `printName`?

Because the function was declared with the parameter constrained to the subtype, but when called it would be accessing properties and methods based on the parent type, that's clearly type unsafe — so it produces an error.

Before TypeScript 2.x, this kind of assignment was allowed in both directions — a parent type could be assigned to a subtype, and a subtype could be assigned to a parent type, i.e., both contravariance and covariance at once, called "bivariance."

But this is clearly problematic, since it can't guarantee type safety. So TypeScript later added a compiler option, `strictFunctionTypes`: set it to `true` and only contravariance of function parameters is supported; set it to `false` and you get bivariance.

If we turn `strictFunctionTypes` off, we'll find both assignments are allowed.

This supports bivariance of function parameters — type checking won't produce an error, but type safety can't be strictly guaranteed.

With it turned on, function parameters only support contravariance — assigning a subtype to a parent type will produce an error.

Here's another contravariance example — do you think the following TS code will produce an error?

```ts
type Func = (a: string) => void;

const func: Func = (a: 'hello') => undefined;
```

The answer: the parameter position will, the return value position won't.

The parameter position is contravariant — meaning the parameter of the function being assigned must be a subtype of the parameter of the function it's being assigned to, and `string` is not a subtype of `'hello'`, so it errors.

The return value position is covariant — meaning the return value of the function being assigned must be a subtype of the return value of the function it's being assigned to. Here, `undefined` is a subtype of `void`, so no error.

### Invariant

Contravariance and covariance are both forms of variance, which apply to parent-child type relationships. Types that aren't in a parent-child relationship naturally don't undergo variance — that is, they're invariant:

Types that are not in a parent-child relationship never undergo variance — if the types differ at all, it's an error.

So how is the parent-child relationship between types determined — there's no `extends` inheritance in sight?

In languages like Java, types are all related through `extends` inheritance — if `A extends B`, then `A` is a subtype of `B`. This is called a nominal type system.

TypeScript doesn't work this way — as long as the structures match, a parent-child relationship can be established. This is called a structural type system.

Structurally, the more specific type is the subtype. Here, `Cat` has all of `Animal`'s properties plus some extra ones, so `Cat` is a subtype of `Animal`.

Note that what matters is being more specific, not having more properties.

When determining the parent-child relationship between union types, which is more specific: `'a' | 'b'` or `'a' | 'b' | 'c'`?

`'a' | 'b'` is more specific, so `'a' | 'b'` is a subtype of `'a' | 'b' | 'c'`.

## III. TypeScript's Type System

### 1. Supported types

The purpose of a static type system is to move type checking from runtime up to compile time, so TypeScript's type system naturally needs to pull in JS's runtime types — `number`, `boolean`, `string`, `object`, `bigint`, `symbol`, `undefined`, `null` — as well as their wrapper types `Number`, `Boolean`, `String`, `Object`, `Symbol`.

These are easy to understand — when adding static types to JS, there's no need to invent a whole new set of primitive types; just reuse JS's existing ones.

On the composite type side, JS has `class` and `Array`, both of which TypeScript's type system supports as well — but TypeScript adds three more types on top: Tuple, Interface, and Enum.

#### Tuple

A Tuple is an array type with a fixed number of elements and fixed types:

```ts
type Tuple = [number, string];
```

#### Interface

An Interface can describe the shape of functions, objects, and constructors.

Objects:

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
  name: 'guang',
  age: 18,
};
```

Functions:

```ts
interface SayHello {
  (name: string): string;
}

const func: SayHello = (name: string) => {
  return 'hello,' + name;
};
```

Constructors:

```ts
interface PersonConstructor {
  new (name: string, age: number): IPerson;
}

function createPerson(ctor: PersonConstructor): IPerson {
  return new ctor('guang', 18);
}
```

Object types and class types are also called index types in TypeScript — meaning types that index multiple elements. Since objects can have properties added dynamically, if you don't know in advance what properties there will be, you can use an index signature:

```ts
interface IPerson {
  [prop: string]: string | number;
}
const obj: IPerson = {};
obj.name = 'guang';
obj.age = 18;
```

In short, an interface can be used to describe composite types such as functions, constructors, and index types (objects, classes, arrays).

#### Enum

An Enum is a composite of a series of values:

```ts
enum Transpiler {
  Babel = 'babel',
  Postcss = 'postcss',
  Terser = 'terser',
  Prettier = 'prettier',
  TypeScriptCompiler = 'tsc',
}

const transpiler = Transpiler.TypeScriptCompiler;
```

TypeScript also supports literal types — meaning values like `1111`, `'aaaa'`, `{ a: 1 }` can themselves serve as types.

Among these, string literal types come in two forms: ordinary string literals, such as `'aaa'`, and template literals, such as `` aaa${string} ``, which means a string literal type that starts with `aaa` followed by any `string`.

So if you want to constrain a string literal type to start with a certain string, you can write it like this:

```ts
function func(str: `#${string}`) {}

func('aaaa'); // error

func('#aaaa'); // true
```

There are also four special types: `void`, `never`, `any`, and `unknown`.

- `never` represents unreachable — for example, when a function throws, its return type is `never`.
- `void` represents emptiness — it can be `undefined` or `never`.
- `any` is an arbitrary type — any type can be assigned to it, and it can be assigned to any type (except `never`).
- `unknown` is an unknown type — any type can be assigned to it, but it cannot be assigned to other types.

That covers all the types in TypeScript's type system. Most are carried over from JS — primitive types, `Array`, `class`, and so on — while a few are added, such as enum, interface, and tuple. It also supports literal types and the special types `void`, `never`, `any`, and `unknown`.

### 2. Type modifiers

Besides describing a type's structure, TypeScript's type system also supports describing a type's attributes — for example, whether it's optional or read-only:

```ts
interface IPerson {
  readonly name: string;
  age?: number;
}

type tuple = [string, number?];
```

### 3. Type-level operations

Now that we know what types exist in TypeScript's type system, what operations can we perform on them?

#### Conditionals: extends ? :

Conditional logic in TypeScript is written as `extends ? :`, called a Conditional Type. For example:

```ts
type res = 1 extends 2 ? true : false; // type res = false
```

This is the if-else of TypeScript's type system.

But logic like the above isn't very useful on its own — since both sides are static values, you could just compute the result yourself; why write code to check it?

So type-level conditional logic is really meant for dynamic type computations — operations on type parameters.

```ts
type isTwo<T> = T extends 2 ? true : false;

type res = isTwo<1>; // type res = false
type res2 = isTwo<2>; // type res = true
```

This kind of type is also called an advanced type.

The hallmark of an advanced type is: you pass in a type parameter, run it through a series of type-level operations, and get back a new type.

#### Inference: infer

How do you extract part of a type? The answer is `infer`.

For example, extracting the first element of a tuple type:

```ts
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R] ? T : never;

type res = First<[1, 2, 3]>; // type res = 1
```

Note that the first `extends` here isn't a conditional — conditional types use `extends ? :`. The `extends` here means "constrained to" — that is, it constrains the type parameter to array types only.

Since we don't know the concrete type of the array elements, we use `unknown`.

`infer` will be used extensively in later chapters — for now, just get a basic feel for it.

#### Union: |

A Union type is similar to the `|` OR operator in JS, but it operates on types — it means a type can be one of several types.

```ts
type Union = 1 | 2 | 3;
```

#### Intersection: &

An Intersection type is similar to the `&` AND operator in JS, but it operates on types — it means merging types together.

```ts
type ObjType = { a: number } & { c: boolean };
```

Note that identical types can be merged, but distinct primitive types cannot — they get discarded instead:

Can be merged:

```ts
type ObjType = { a: number } & { c: boolean };

type res = { a: number; c: boolean } extends ObjType ? true : false; // type res = true
```

Cannot be merged:

```ts
type res = 'aaaa' & 2222; // type res = never
```

#### Mapped types

For objects and classes, the corresponding TypeScript type is an Index Type — so how do you modify an index type?

The answer is mapped types.

```ts
type MapType<T> = {
  [Key in keyof T]?: T[Key];
};
```

`keyof T` queries all the indexes (keys) of an index type — this is called an index query.

`T[Key]` retrieves the value at a given index of the index type — this is called an index access.

`in` is the operator used to iterate over a union type.

For example, turning the values of an index type into 3-element arrays:

```ts
type MapType<T> = {
  [Key in keyof T]: [T[Key], T[Key], T[Key]];
};

type res = MapType<{ a: 1; b: 2 }>; // type res = { a: [1, 1, 1]; b:[2, 2, 2]; }
```

A mapped type is essentially mapping one set to another — hence the name.

Besides the values, the keys can also be transformed, using the `as` operator — this is called re-mapping.

Here we use `as` to modify the keys too, repeating each key 3 times:

```ts
type MapType<T> = {
  [Key in keyof T as `${Key & string}${Key & string}${Key & string}`]: [T[Key], T[Key], T[Key]];
};

// type res = { aaa: [1, 1, 1]; bbb: [2, 2, 2]; }
```

The `& string` here might be confusing, so let's explain it:

Since an index type (object, class, etc.) can use `string`, `number`, or `symbol` as keys, `keyof T` yields a union type of `string | number | symbol`. Intersecting that with `string` leaves only `string`. As mentioned earlier, an intersection type merges identical types and discards distinct ones.

## IV. Determining a Type's "Type"

### IsAny

How do you determine whether a type is `any`? You have to rely on its characteristics:

Intersecting `any` with any other type always yields `any` — that is, `1 & any` results in `any`.

So it can be written like this:

```ts
type IsAny<T> = 'null' extends 'undefined' & T ? true : false;
```

### IsEqual

Previously, we implemented `IsEqual` like this:

```ts
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
```

The problem shows up when checking against `any`:

```ts
type IsEqualResult = IsEqual<'aaa', any>;
// type IsEqualResult = false
```

Because `any` can be any type, and any type is also `any`, writing it this way can't correctly detect `any`.

So instead, we write it like this:

```ts
type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
```

This lets it be checked correctly.

Here, `T` is never given a concrete type — it's essentially a temporary placeholder.

The goal is to compare:

```ts
<T>() => T extends X ? 1 : 2
<T>() => T extends Y ? 1 : 2
```

whether these two generic function types are equal. [How it works](https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796)

### IsUnion

Remember how to determine whether something is a union type? It relies on the fact that a union type, when it hits a conditional type, gets distributed into individual members that are each computed separately:

```ts
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
```

### IsNever

`never` is also special in conditional types: if the left side of a conditional type is a type parameter, and `never` is passed in, the result is directly `never`:

```ts
type TestNever<T> = T extends number ? 1 : 2;
```

When `T` is `never`:

```ts
type TestNeverResult = TestNever<never>;
// type TestNeverResult = never
```

So to check for `never`, you can't write `T extends number` directly — instead write it like this:

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

Now `never` can be checked correctly:

```ts
type TestNeverResult = IsNever<never>;
// type TestNeverResult = true
```

Beyond that, `any` is also special in conditional types — if the type parameter is `any`, the result is directly the union of the `trueType` and `falseType` branches:

```ts
type TestAny<T> = T extends number ? 1 : 2;

type TestAnyResult = TestAny<any>;
// type TestAnyResult = 1 | 2
```

These special cases for union types, `never`, and `any` as type parameters of a conditional type will be explained in more depth in a later section on the underlying mechanics.

### IsTuple

How do you determine a tuple type? What's the difference from an array?

A tuple type's `length` is a numeric literal type, while an array's `length` is `number`.

```ts
type len
```

### UnionToIntersection

Types have parent-child relationships — the more specific one is the subtype. For example, the intersection type `A & B` is a subtype of the union type `A | B`, because it's more specific.

Allowing a parent type to be assigned to a subtype is called **contravariance**.

Allowing a subtype to be assigned to a parent type is called **covariance**.

(For a detailed explanation of contravariance, covariance, and related concepts, see the fundamentals chapter.)

In TypeScript, function parameters exhibit contravariance — meaning if a parameter could be one of multiple types, the parameter type becomes their intersection.

So converting a union to an intersection can be implemented like this:

```ts
type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ? R : never;
```

The type parameter `U` is the union type to convert.

`U extends U` triggers the distributive behavior of union types, so each member type is passed in and computed separately, then merged at the end.

Using `U` as a parameter, we construct a function, then use pattern matching to extract the parameter's type.

The result is the intersection type.

The contravariant nature of function parameters is generally only used for converting unions to intersections — just remember that.

### GetOptional

How do you extract the optional keys from an index type?

This also relies on a characteristic of optional keys: an optional key's value is a union of `undefined` and the value's actual type.

To filter out optional keys, you need to construct a new index type, filtering along the way:

```ts
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key];
};
```

The type parameter `Obj` is the index type to process, constrained to `Record<string, any>` — an index type whose keys are strings and whose values can be any type.

Using mapped type syntax, we reconstruct the index type — the keys are the original keys, i.e., `Key in keyof Obj`, but with some filtering applied, i.e., the part after `as`.

The filtering works by taking each key individually and checking whether an empty object is a subtype of it.

`Pick` here is a built-in advanced type provided by TS — it constructs a new index type by picking out a given key:

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

For instance, picking out just `age` produces a new index type like this:

Optional means the key might not be present. When it isn't, `Pick<Obj, Key>` is empty, so `{} extends Pick<Obj, Key>` can be used to filter out optional keys.

The value type stays the same as before — `Obj[Key]`.

This way, we can filter out all the optional keys and construct a new index type.

## Summary

- Intersecting `any` with any type always yields `any` — that is, `1 & any` results in `any`. This characteristic can be used to detect the `any` type.
- When a union type appears as a type parameter on the left side of a conditional type, it gets distributed into individual types, computed separately, and then merged.
- When `never` appears as a type parameter on the left side of a conditional type, the result is directly `never`.
- When `any` appears as a type parameter on the left side of a conditional type, the result is directly the union of `trueType` and `falseType`.
- A tuple type is also an array type, but its `length` is a numeric literal type, while an array's `length` is `number`. This can be used to detect tuple types.
- Function parameters undergo contravariance, which can be used to convert union types to intersection types.
- An optional key might not be present, so `Pick`-ing it out could yield `{}` — this can be used to filter for optional keys, and conversely, non-optional keys.
- The keys of an index type are string literal types, whereas an index signature's key is not — this characteristic can be used to filter out index signatures.
- `keyof` only picks up the `public` members of a class, so it can be used to filter out `public` properties.
- By default, inferred types are not literal types; adding `as const` lets you infer literal types, but they come with a `readonly` modifier, so pattern matching against them also needs to include `readonly`.
