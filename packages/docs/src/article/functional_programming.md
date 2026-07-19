---
description: "An introduction to functional programming: pure functions, composition, currying and immutability, with JavaScript/TypeScript examples."
---

# Functional Programming

- Overview: Functional Programming (`FP`) is one of several programming paradigms. Other paradigms you've likely heard of include object-oriented programming and procedural programming.
- Object-oriented thinking: abstracts real-world things into classes and objects in the program world, and expresses the relationships between things through encapsulation, inheritance, and polymorphism.
- Functional thinking: abstracts the **relationships** between real-world things into the program world (i.e., it abstracts the process of computation).
  - The essence of a program: given an input, produce the corresponding output through some computation.
  - A "function" in functional programming doesn't refer to a function (method) in a program, **but rather to a function in the mathematical sense — a mapping relationship**.
  - The same input must always produce the same output (a pure function).
  - Functional programming is used to describe the mapping relationships between pieces of data (functions).

```js
//Non-functional, procedural style
let num1 = 1;
let num2 = 2;
let sum = num1 + num2;

//Functional programming, an abstraction over the procedural style
function sum(n1, n2) {
  return n1 + n2;
}
let result = sum(1, 2);
```

## 1. Basics of `JS` functions

- Functions can be stored in variables
- Functions can be passed as arguments
- Functions can be used as return values

In `JavaScript`, a function is just an ordinary object (it can be created via `new Function()`). We can store a function in a variable/array, and it can also be used as an argument to, or the return value of, another function. We can even construct a new function at runtime with `new Function('alert(1)')`.

- Assigning a function to a variable

```js
let fn = function () {
  console.log('First-class Function MDN');
};
```

## 2. Higher-order functions

- Higher-order function
  - Can accept a function as an argument
  - Can return a function as its result

1. Function as an argument

```js
//forEach
function forEach(array, fn) {
  for (let item of array) {
    fn(item);
  }
}

//filter
function filter(array, fn) {
  let result = [];
  for (let item of array) {
    if (fn(item)) {
      result.push(item);
    }
  }
  return result;
}

//test
let array = [1, 2, 3, 4, 5, 6, 7];
forEach(array, function (item) {
  console.log(item);
});

let r = filter(array, function (item) {
  return item % 2 === 0;
});
console.log(r);
```

2. Function as a return value

```js
//Higher-order function, returning a function
function makeFn() {
  let msg = 'Highter-order Function';
  return function () {
    console.log(msg);
  };
}
//First way to call it
const fn = makeFn();
fn();
//Second way to call it
makeFn()();
//once: a function that can only run once
function once(fn) {
  let done = false;
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
}
let pay = once(function (money) {
  console.log(`Pay ${money}`);
});
pay(5);
pay(5);
pay(5);
pay(5);
pay(5);
```

## 3. Closures

**Overview**: A function that has access to variables in another function's scope.

**Essence**: When a function executes, it's pushed onto the stack; once it finishes, it's popped off. However, scope members on the heap that are still referenced externally cannot be released. As a result, the inner function can still access members of the outer function.

**The stack**: Memory is allocated and released automatically; it stores primitive data types and takes up a fixed amount of space.

**Stack overflow**: With recursive calls, as the stack depth grows, memory eventually runs out, causing an overflow.

**Advantages of the stack**: All variables in a method live on the stack, and the method's stack memory is destroyed as soon as the method finishes executing. Access is very fast — second only to the CPU's registers — and it can be shared.

**The heap**: Memory is allocated dynamically, its size is not fixed, and it isn't released automatically or destroyed when a method finishes. It stores reference data types — what's actually saved is not the variable itself but a pointer to the object.

**Heap overflow**: Creating objects in a loop — i.e., continuously calling `new`.

## 4. Pure functions

- Concept: The same input always produces the same output, with no observable side effects — similar to a mathematical function `y=f(x)`.
- Example: `slice` is a pure function — given the same array input, it always returns the same output. `splice` is impure — the same input can produce different results because it mutates the original array.
- Functional programming doesn't keep intermediate computation results, so variables are immutable (stateless).
- The result of one function's execution can be handed off to another function to execute.
- Pure functions can be cached/memoized, because the same input always has the same output.

```js
//memoize function
function memoize(fn) {
  let cache = {};
  return function () {
    let key = JSON.stringfy(arguments);
    cache[key] = cache[key] || fn.apply(fn, arguments);
    return cache[key];
  };
}
```

- Testable: makes testing much easier.
- In a multithreaded environment, operating on shared memory data can lead to unexpected results, but a pure function doesn't need shared data space — it only depends on its input — so pure functions can run freely in parallel.
- Side effects: side effects make a pure function impure. For example, if a function depends on external state, it can no longer guarantee the same output — that's a side effect. Sources of side effects include: configuration files, databases, reading user input, and so on — any interaction with the outside world can introduce a side effect. Side effects reduce a method's generality, making it less suitable for extension and reuse, and they introduce security risks into a program. Side effects can never be fully eliminated — they can only be kept within a controlled scope as much as possible.

```js
//Impure function
let mini = 18;
function checkAge(age) {
  return age > min;
}
//Pure function (has a hardcoded value; can later be resolved via currying)
function checkAge(age) {
  let mini = 18;
  return age > mini;
}
```

## 5. Currying (`Haskell Brooks Curry`)

```js
//Solving the hardcoding problem above
function checkAge(min) {
  return function (age) {
    return age >= min;
  };
}
let checkAge18 = checkAge(18);
checkAge18(22);
```

Simplified with `es6`

```js
let checkAge = (min) => (age) => age >= min;
```

- When a function takes multiple arguments, you can pass part of them first, call it, and get back a function (these initial arguments remain fixed going forward).
- That returned function then accepts the remaining arguments and returns the result.
- The currying function in `lodash`
  - `_.curry(func)`
  - What it does: creates a function that accepts one or more of `func`'s arguments. If all of the function's arguments have been supplied, it returns the function's result; otherwise, it returns a function that keeps waiting for the remaining arguments.
  - Argument: the function to curry.
  - Return value: the curried function.

```js
//Using curry from lodash
const _ = require('loadsh');
function getSum(a, b, c) {
  return a + b + c;
}
const curried = _.curry(getSum);
console.log(curried(1, 2, 3)); //6
console.log(curried(1)(2, 3)); //6
console.log(curried(1)(2)(3)); //6
```

Implementing a curry function

```js
function curry(func) {
  return function curriedFn(...args) {
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.form(arguments)));
      };
    } else {
      return func(...args);
    }
  };
}
```

- Summary: Currying lets us pass a function fewer arguments at a time, returning a new function that remembers certain fixed arguments. This is a form of caching for function arguments, which makes a function more flexible and its granularity finer. It can turn a multi-argument function into a single-argument (unary) function, and such functions can be composed together to produce powerful behavior.

## 6. Function composition

- Pure functions and currying can easily lead us to write "onion code," such as `h(f(g(x)))`.
  - For example, getting the last element of an array and converting it to uppercase: `_.toUpper(._first(_.revers(array)))`.
  - Function composition lets us combine fine-grained functions back into a new function.
- Composition functions in `lodash`
  - `lodash` provides the composition functions `flow()` and `flowRight()`, both of which can compose multiple functions.
  - `flow()` executes left to right.
  - `flowRight()` executes right to left.
  - Implementing our own `flowRight` function:

```js
function composeRight(...args) {
  return function (value) {
    args.reverse().reduce(function (acc, fn) {
      return fn(acc);
    }, value);
  };
}
//Arrow function version
const compose =
  (...args) =>
  (value) =>
    args.reverse().reduce((acc, fn) => fn(acc), value);
//Note: with expression assignment, there's no function hoisting
```

- Function composition must satisfy the associative law — for three functions f, g, h, no matter which pair you compose first, the result is equivalent, i.e., `flowRight(_.toUpper,_.first,\_.revers)`.
- How do you debug a function composition?

```js
const log = (v) => {
  console.log(v);
  return v;
};
```

- The fp module in the `lodash` library
  - `lodash`'s `fp` module provides utility methods that are friendly to functional programming.
  - It offers immutable methods that are **auto-curried, iteratee-first, data-last**.

```js
//lodash methods
const _ = require('lodash');
_.map(['a', 'b', 'c'], _.toUpper);
//=>['A','B','C']
_.map(['a', 'b', 'c']);
//=>['a','b','c']
//loadsh/fp module
const fp = require('lodasg/fp');
fp.map(fp.toUpper, ['a', 'b', 'c']);
fp.map(fp.toUpper)(['a', 'b', 'c']);
```

## 7. Point Free

We can define a data-processing pipeline as a composed operation that has nothing to do with the data itself — without referencing the parameter that represents the data — simply by composing together simple computation steps. Before using this pattern, we need to define a few auxiliary basic operation functions.

- No need to specify the data being processed
- Only need to compose the operation pipeline
- Requires defining a few auxiliary basic operation functions

```js
const f = fp.flowRight(fp.join('-'), fp.map(_.toLower), fp.splite(''));
```

## 8. `functor`

- Why learn about functors?<br />So far we haven't addressed how to keep side effects within a controllable scope in functional programming — exception handling, asynchronous operations, and so on.
- `Functor`
  - Container: contains a value and a transformation relationship for that value (this transformation relationship is a function).
  - Functor: a special kind of container, implemented as a plain object that has a `map` method. The `map` method can run a function to process the value (the transformation).

```js
//Functor
class Container {
  //A functor must hold a value internally
  constructor(value) {
    //This value is passed in and is not exposed externally
    this._value = value;
  }
  map(fn) {
    //The map method takes a function that processes the value.
    //It passes the processed value into a new functor and returns that new functor.
    return new Container(fn(this._value));
  }
}

//Creating a new functor
let r = new Container(5).map((x) => x + 1).map((x) => x * x);
```

The `of` method:

```js
//The of method is used to return a functor object
class Container {
  constructor(value) {
    this._value = value;
  }
  static of(value) {
    //Takes a value and returns a new functor object
    return new Container(value);
  }
  map(fn) {
    return Container.of(fn(this._value));
  }
}
let r = Container.of(5)
  .map((x) => x + 1)
  .map((x) => x * x);
console.log(r); //What's printed is a functor, not a value — the value is never extracted directly. When you need to change the value, pass a function into the map method and chain calls.
```

- Summary
  - Functional programming operations don't act directly on values; they're carried out by functors.
  - A functor is simply an object that implements the `map` contract.
  - You can think of a functor as a box that wraps a value.
  - To process the value inside the box, you pass a value-processing function (a pure function) into the box's `map` method, and that function processes the value.
  - Finally, the `map` method returns a new box (functor) containing the new value.
- `MayBe` functor
  - While programming we may encounter many kinds of errors that need to be handled accordingly.
  - The purpose of the MayBe functor is to handle cases of empty/null values from the outside (keeping side effects within an allowed scope).

```js
//MayBe functor
class MayBe {
  static of(value) {
    return new MayBe(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value));
  }
  isNothing() {
    return this._value === null || this._value === undefined;
  }
}
let r = MayBe.of(null)
  .map((x) => x + 1)
  .map((x) => x * x);
console.log(r);
```

- Problem: if `map` is called multiple times and a `null` value shows up somewhere in the middle, the final result is a functor containing `null`. While the MayBe functor can handle the empty-value case, there's no way to tell which step produced the null.
- Either functor
  - "Either" means one of two things — similar to an `if...else...` branch.
  - Exceptions make a function impure; the Either functor can be used for exception handling.

```js
//Either functor
class Left {
  static of(value) {
    return new Left(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return this;
  }
}

class Right {
  static of(value) {
    return new Right(value);
  }
  constructor(value) {
    this._value = value;
  }
  map(fn) {
    return Right.of(fn(this._value));
  }
}

function parseJSON(str) {
  try {
    return Right.of(JSON.parse(str));
  } catch (error) {
    return Left.of({ error: error.message });
  }
}
let l = parseJSON('{name:zs}'); //error
console.log(l);
let r = parseJSON('{"name":"zs"}');
console.log(r);
r.map((x) => x.toUpper());
```

- IO functor
  - The `_value` inside an IO functor is a function — here, a function is treated as a value.
  - The IO functor can store an impure function in `_value`, deferring execution of that impure operation (lazy evaluation).
  - It hands the impure operation off to the caller to execute.

```js
const fp = require('lodash/fp');
class IO {
  static of(x) {
    return new IO(function () {
      return x;
    });
  }
  constructor(fn) {
    this._value = fn;
  }
  map(fn) {
    return IO.of(fp.flowRight(fn, this._value));
  }
}
//Usage
//Since this runs in a Node environment, we can pass the process object directly, i.e., Node's own process
let r = IO.of(process).map((p) => p.execPath);
console.log(r); //IO {_value :[Function]}
console.log(r._value()); //Executes and returns the path of the Node process
```

- folktale
  - folktale is a standard functional programming library.
  - Unlike lodash and ramda, it doesn't provide a large number of utility functions.
  - It only provides functional-processing operations such as curry and compose, plus a handful of functors like Task, Either, and MayBe.

```js
//folktale  2.3.2
//Task: handling asynchronous tasks
const fs = require('fs');
const { task } = require('folktale/concurrency/task');
const { split, find } = require('loadsh/fp');

function readFile(filename) {
  return task((resolver) => {
    fs.readFile(filename, 'utf-8', (error, data) => {
      if (error) {
        resolver.reject(err);
      } else {
        resolver.resolve(data);
      }
    });
  });
}
//Returns a Task functor
readFile('package.json')
  .run()
  .listen({
    //Listening for the event's status
    onRejected: (err) => {
      console.log(err);
    },
    onResolved: (value) => {
      console.log(value);
    },
  });
//map can be called before run, to process the returned result
readFile('package.json')
  .map(split('\n'))
  .map(find((x) => x.includes('version')))
  .run()
  .listen({
    //Listening for the event's status
    onRejected: (err) => {
      console.log(err);
    },
    onResolved: (value) => {
      console.log(value);
    },
  });
```

- Pointed functor
  - A Pointed functor is a functor that implements the static `of` method.
  - `of` exists to avoid using `new` to create objects; on a deeper level, `of` is used to place a value into a context (put the value into the container, then use `map` to process it).
- Monad functor
  - The Monad functor exists to solve the problem of nested IO functors.

```js
const fp = require('lodash/fp');
const fs = require('fs');
class IO {
  static of(x) {
    return new IO(function () {
      return x;
    });
  }
  constructor(fn) {
    this._value = fn;
  }
  map(fn) {
    return IO.of(fp.flowRight(fn, this._value));
  }
}
let readFile = function (filename) {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8');
  });
};
let print = function (x) {
  return new IO(function (x) {
    console.log(x);
    return x;
  });
};
let cat = fp.flowRight(print, readFile);
let r = cat('package.json')._value()._value();
console.log(r);
```

- A Monad functor is a Pointed functor that can be flattened. "Flattening" solves the problem of nested functors, i.e., `IO(IO(x))`.
- Any functor that has both `join` and `of` methods, and obeys certain laws, is a Monad.

```js
//Note the join method
const fp = require('lodash/fp');
const fs = require('fs');
class IO {
  static of(x) {
    return new IO(function () {
      return x;
    });
  }
  constructor(fn) {
    this._value = fn;
  }
  map(fn) {
    return IO.of(fp.flowRight(fn, this._value));
  }
  join() {
    return this._value();
  }
  flatMap(fn) {
    //map followed by join is such a common pattern that flatMap combines the two into a "flattened" call
    return this.map(fn).join();
  }
}
let print = function (x) {
  return new IO(function () {
    console.log(x);
    return x;
  });
};
let r = readFile('package.json') //map can be used here to process the content
  .flatMap(print)
  .join();
```

## References

- [Functional Programming and Asynchronous Programming](http://t.zoukankan.com/feng9exe-p-10477713.html)
- [An Introduction to Functional Programming](http://www.ruanyifeng.com/blog/2012/04/functional_programming.html)
- [A Functional Programming Tutorial](http://www.ruanyifeng.com/blog/2017/02/fp-tutorial.html)
