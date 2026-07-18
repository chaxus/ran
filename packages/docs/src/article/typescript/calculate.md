# Using Array Length for Counting

The type system isn't Turing-complete in the sense that you can write any kind of logic, but numeric logic in particular seems hard to find.

That's right — numeric logic is fairly convoluted, so I pulled it out into its own section, which is exactly what we'll cover here.

This is the fourth pattern in type gymnastics: using array length for counting.

The TypeScript type system has no `+`, `-`, `*`, or `/` operators, so how do we do numeric computation?

You may have noticed that taking the `length` of an array type gives you a number.

For example:

```ts
type num1 = [unknown]['length'];
// type num1 = 1
type num2 = [unknown, unknown]['length'];
// type num1 = 2
type num3 = [unknown, unknown, unknown]['length'];
// type num1 = 3
```

And since we're able to construct array types ourselves, isn't constructing arrays of different lengths and then taking their `length` essentially numeric computation?

The TypeScript type system has no arithmetic operators, but you can perform numeric computation by constructing different arrays and taking their `length`, turning addition, subtraction, multiplication, and division on numbers into extraction from and construction of arrays.

(Strictly speaking what we construct are tuples, but knowing the difference between arrays and tuples isn't essential here.)

This is arguably the trickiest part of type gymnastics — it requires a bit of a mental shift to get past.

Let's work through some real examples to master it.

## Implementing Arithmetic with Array Length

### Add

Now that we know numeric computation needs to be converted into array type operations, the implementation of addition is easy to figure out:

Construct two arrays, merge them into one, and take the `length`.

For example, `3 + 2` means constructing an array type of length 3, constructing another of length 2, merging them into a single array, and taking the `length`.

The length of the array to construct isn't fixed, so it needs to be built recursively. We've implemented this before:

```ts
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
  ? Arr
  : BuildArray<Length, Ele, [...Arr, Ele]>;
```

The type parameter `Length` is the length of the array to construct. The type parameter `Ele` is the array element, defaulting to `unknown`. The type parameter `Arr` is the array being constructed, defaulting to `[]`.

If the length of `Arr` reaches `Length`, return the constructed `Arr`; otherwise keep constructing recursively.

With array construction in place, we can implement addition on top of it:

```ts
type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length'];
```

Let's test it with some larger numbers:

```ts
type AddResult = Add<32, 25>;
// type AddResult = 57
```

And that's it — we've implemented addition by constructing arrays of a given length and taking their `length`.

### Subtract

Addition works by constructing arrays, so how does subtraction work?

Subtraction removes part of a number, and it's natural to implement it via extraction on array types.

For example, `3` is the array type `[unknown, unknown, unknown]`. After extracting 2 elements, taking the `length` of the remaining array gives `1`.

So subtraction is implemented like this:

```ts
type Subtract<Num1 extends number, Num2 extends number> =
  BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest] ? Rest['length'] : never;
```

The type parameters `Num1` and `Num2` are the minuend and subtrahend, respectively, constrained to `number` via `extends`.

Construct an array of length `Num1`, then use pattern matching to extract `Num2` elements from it, putting the remainder into the local variable `Rest` declared with `infer`.

Taking the length of `Rest` and returning it gives the result of the subtraction.

And that's it — we've implemented subtraction via extraction on array types.

### Multiply

We converted addition into array construction and subtraction into array extraction. So how does multiplication work?

To explain multiplication, I dug up an elementary school textbook and found a diagram like this:

`1` multiplied by `5` is the same as `1 + 1 + 1 + 1 + 1` — in other words, multiplication is the accumulation of multiple addition results.

So, building on addition, we add one more parameter to carry the intermediate result array, and after finishing, take its `length` once to get the multiplication result:

```ts
type Multiplication<Num1 extends number, Num2 extends number, ResultArr extends unknown[] = []> = Num2 extends 0
  ? ResultArr['length']
  : Multiplication<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>;
```

The type parameters `Num1` and `Num2` are the multiplicand and multiplier, respectively.

Since multiplication is the accumulation of multiple addition results, we add a type parameter `ResultArr` to hold the intermediate result, defaulting to `[]`, which is equivalent to starting the accumulation from 0.

Each time we add once, `Num2` is decremented by 1, until `Num2` reaches 0, which means the addition is complete.

Each addition step places `Num1` elements into the `ResultArr` array.

Repeating this recursively is exactly recursively placing elements into `ResultArr`.

Finally, taking the `length` of `ResultArr` gives the result of the multiplication.

And that's it — we've implemented multiplication via recursive accumulation.

### Divide

Multiplication is recursive accumulation, so isn't division just recursive subtraction?

I went back to the elementary school textbook again and found a diagram like this:

We have 9 apples: give 3 to Pleasant Goat, 3 to Lazy Goat, and 3 to Sizzling Goat, leaving 0 remaining. So `9 / 3 = 3`.

So, division is implemented by repeatedly subtracting the divisor from the dividend until it reaches 0, and recording how many times we subtracted gives the result.

It looks like this:

```ts
type Divide<Num1 extends number, Num2 extends number, CountArr extends unknown[] = []> = Num1 extends 0
  ? CountArr['length']
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>;
```

The type parameters `Num1` and `Num2` are the dividend and divisor, respectively.

The type parameter `CountArr` is the accumulator array used to record how many subtractions were performed.

If `Num1` has been reduced to 0, then the number of subtractions performed so far is the division result, i.e., `CountArr['length']`.

Otherwise, keep subtracting recursively — subtract `Num2` from `Num1`, and add one more element to `CountArr` to represent one more subtraction.

This is how division is implemented:

And that's it — we've implemented division via recursive subtraction while recording the number of subtractions performed.

Now that we've covered addition, subtraction, multiplication, and division, let's move on to some other numeric type gymnastics.

## Implementing Counting with Array Length

### StrLen

Array length can be obtained via `length`, but string types don't have a `length` we can take directly, so let's implement an advanced type for computing string length.

String length isn't fixed, so recursion is clearly needed. Take one character at a time and count it, until there are none left — that's the string length.

```ts
type StrLen<Str extends string, CountArr extends unknown[] = []> = Str extends `${string}${infer Rest}`
  ? StrLen<Rest, [...CountArr, unknown]>
  : CountArr['length'];
```

The type parameter `Str` is the string to process. The type parameter `CountArr` is the counting array, defaulting to `[]`, representing a start from 0.

Each time, use pattern matching to extract the remaining string after removing one character, and add one more element to the counting array. Recursively extract characters and count.

If the pattern match fails, counting is complete, and we return the length of the counting array, `CountArr['length']`.

This lets us compute string length:

### GreaterThan

Now that we can count, we can also compare two numbers.

We keep adding elements to an array type and taking its length; if it reaches `A` first, then `B` is larger, otherwise `A` is larger:

```ts
type GreaterThan<Num1 extends number, Num2 extends number, CountArr extends unknown[] = []> = Num1 extends Num2
  ? false
  : CountArr['length'] extends Num2
    ? true
    : CountArr['length'] extends Num1
      ? false
      : GreaterThan<Num1, Num2, [...CountArr, unknown]>;
```

The type parameters `Num1` and `Num2` are the two numbers being compared.

The type parameter `CountArr` is used for counting and keeps accumulating, defaulting to `[]`, representing a start from 0.

If `Num1 extends Num2` holds, that means they're equal, so return `false` directly.

Otherwise, check the length of the counting array: if it reaches `Num2` first, then `Num1` is larger, so return `true`.

Conversely, if it reaches `Num1` first, then `Num2` is larger, so return `false`.

If neither has been reached yet, add one more element to the counting array `CountArr` and keep recursing.

This is how numeric comparison is implemented.

When comparing `3` and `4`:

### Fibonacci

Speaking of numeric computation, we can't skip the classic Fibonacci sequence computation.

The Fibonacci sequence is `1, 1, 2, 3, 5, 8, 13, 21, 34, ...`, where each number follows the rule of being the sum of the previous two.

F(0) = 1, F(1) = 1, F(n) = F(n - 1) + F(n - 2) (n ≥ 2, n ∈ N\*)

This is recursive addition, and in TypeScript type programming we implement this kind of addition using array construction:

```ts
type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1,
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [...IndexArr, unknown], Num>;

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;
```

The type parameter `PrevArr` represents the array for the previous accumulated value. The type parameter `CurrentArr` represents the array for the current value.

The type parameter `IndexArr` is used to record the index, incrementing by one each recursion, defaulting to `[]`, representing a start from 0.

The type parameter `Num` represents which number in the sequence we want to compute.

Check whether the current index, i.e., `IndexArr['length']`, has reached `Num`; if so, return the current value, `CurrentArr['length']`.

Otherwise, compute the value for the current index by adding the previous value to the current value: `[...PrevArr, ...CurrentArr]`.

Then keep recursing, incrementing the index by one, i.e., `[...IndexArr, unknown]`.

This is the process of recursively computing numbers in the Fibonacci sequence.

We can correctly compute that the 8th number is 21:
