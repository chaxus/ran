# 背景与起源

Rust 语言的诞生可谓是计算机领域的一场伟大冒险。由 Graydon Hoare 于 2010 年创建，它的设计初衷是为了满足系统级编程的需求，并弥补 C++ 等语言的不足。在 Rust 的成长过程中，吸收了众多前辈语言的优点，同时摒弃了它们的一些痛点，使得 Rust 在系统编程领域脱颖而出。

# 优点与适用场景

Rust 语言以其强大的内存安全性、零成本抽象、并发性和不可变性而闻名。其独特的所有权系统使得程序员能够在不牺牲性能的前提下编写安全、并发的代码。这使得 Rust 在编写操作系统、嵌入式系统、网络服务以及特别是区块链领域表现出色。

# Rust 与区块链

在区块链应用中，Rust 的性能和安全性变得尤为突出，为区块链开发者提供了一个理想的编程语言选择，支持构建高效且安全的去中心化应用。项目如 StarkNet 和 Solana 等选择 Rust 作为智能合约的编程语言；用于以太坊应用程序开发的工具包 Foundry，也是由 Rust 语言编写的，可以快速、方便的完成依赖项管理、编译、运行测试、部署。这些都主要得益于 Rust 强大的性能和内存安全性……这些项目的选择证明了 Rust 在区块链生态中的卓越表现，为开发者提供了强大而安全的编程语言，促进了区块链技术的发展。通过利用 Rust 的特性，区块链应用得以更好地平衡性能和安全性的需求，为未来的去中心化世界奠定了坚实的基础。接下来，让我们投入这场关于 Rust 的奇妙之旅吧~

# 变量

Rust 中的变量可以分为可变变量和不可变变量，通俗来说，就是变量的值是否允许修改，如果在内存中给变量分配完值之后，可以根据需要来修改这个值，那它就是可变变量，反之，不允许这个值再发生变更，那就是不可变变量。前者很容易理解，变量的值在不同场景下会发生变化，它为编程提供了灵活性；后者，也有存在的道理，通过不可变的限制，提供了编程的安全性，特别是在多线程环境下，也减少了一些运行时检查，在一定程度上提升运行性能。

注意：这里提到的是否可变指的是变量的值，而非变量的数据类型。另外，不可变变量这个特性并不是 Rust 特有的，在 Java 中也有类似的概念，比如 String 类型就是不可变变量，当对不可变对象的值进行了类似的修改操作时，本质上是创建了新的对象，而不是修改了这个不可变变量的值。

比喻

举个简单的例子，假如有个叫 Ferris 的同学，从它出生起，身份证号就是不可变的，伴随 Ferris 的一生（不可变变量在其整个生命周期中都是不可变的），因为不可变，所以在有些场景下非常有用，比如可以在全国公安系统中准确的定位到一个人；但是，像家庭住址、性别（Nothing is impossible）、联系方式等这些，却有可能发生变化，这些变化对 Ferris 来说也许是非常有必要的。注：Ferris 是 Rust 社区的吉祥物，就是那个被煮熟的螃蟹🦀🙈

我们分别定义 2 个不同类型的变量，并尝试修改对应的值。

```rs
fn main() {
    // x 为可变变量，mut 即 mutable 的意思，该修饰符修饰的变量允许改变
    let mut x = 1;
    println!("x = {}", x);
    x = 2;
    println!("x = {}", x);

    // y 为不可变变量，如果没有指定 mut，则 Rust 默认为不可变
    let y = 3;
    println!("y = {}", y);
    // 对不可变变量 y 重新赋值，Rust 编译器会给出 cannot assign twice to immutable variable y 的错误提示
    y = 4;
    println!("y = {}", y);
}
```

变量解构是一种将复合数据类型（如元组、结构体、枚举等）中的值分解为单独变量的过程。它可以方便地从复杂的数据结构中提取出需要的值，并以更简洁的方式进行操作。通过这种方式，可以更好的控制数据的可见性，也使得代码更加优雅。变量解构通俗来讲就是已知原有的结构，解开该结构。它并不是 Rust 独有的特性，Python、JavaScript、Solidity 等许多编程语言也都有。

我们可以通过如下的方式，把水果篮里的香蕉、菠萝、榴莲放在 a、b、c 三个不同的盘子里，或者换一种方式，只拿香蕉和菠萝。

```rs
// 第一种放法
let (a, b, c) = ("Banana", "pineapple", "durian");

// 第二种放法
let (e, d, _) = ("Banana", "pineapple", "durian");
```

Rust 基本数据类型中最常用的数值类型：有符号整数 (i8, i16, i32, i64, isize)、无符号整数 (u8, u16, u32, u64, usize) 、浮点数 (f32, f64)。整数是 没有小数部分的数字，具体有如下几种类型：

![](./assets/rust-variable.webp)

表示方式为 有无符号 + 类型大小（位数），i 是英文单词 integer 的首字母，代表有符号类型，包含负整数、0 和正整数，与之相反的是 u，代表无符号 unsigned 类型，包含 0 和正整数。Rust 默认的整数类型是 i32，即用 32 个 bit 位表示有符号的整数。浮点类型数字 是带有小数点的数字，在 Rust 中浮点类型数字也有两种基本类型：f32 和 f64，分别为 32 位和 64 位大小。默认浮点类型是 f64。

我们在接下来看下数值的定义及表示方式。

```rs
// 这里 a 为默认的 i32 类型
let a = 1;
// 可以指定也可以指定为具体的整数类型
let b: u32 = 1;

// 这里 c 为默认的 f64 类型
let c = 1.0;
// 也可以指定为具体的浮点数类型
let d: f32 = 1.0;

// Rust 中可以方便的使用不同进制来表示数值，总有一款适合你
let x: i32 = 100_000_000;
let y: i32 = 0xffab;
let z: i32 = 0o77;
let m: i32 = 0b1111_0000;
let n: u8 = b'A';
println!("x = {}, y = {}, z = {}, m = {}, n = {}", x, y, z, m, n);
```

字符类型是用 char 类型表示的，占用 4 个字节的空间，可以表示 Unicode 字符集中的任何字符，包括 ASCII 字符、各种符号、各种语言的文字，甚至是表情符号。通过单引号'可以创建一个 char 类型的值。例如 let a:char = '🦀';布尔类型有两种值：true 和 false，占用内存的大小为 1 个字节。注意：这里是介绍的是字符（用单引号''表示)，不是字符串 (用双引号""表示)，在 Rust 中，字符串类型的长度取决于使用的编码集，默认情况下，Rust 使用 UTF-8 编码，一个字符占用 1～4 个字节，而 char 类型占用 4 个字节的存储空间，即使有些字符在特定编码集下只需要 1～3 个字节表示，Rust 也会将其扩展为 4 个字节。这样做的好处是：

● 保证所有 char 值在内存中占用固定大小，有利于内存对齐和访问效率。

● 避免编码转换开销，直接使用 4 字节值可以高效处理字符。

● 足够表示 Unicode 标量值所需的全部码位，确保未来的兼容性。

```rs
// 英文字符
let c = 'z';
// 数学符号
let z = 'ℤ';
// 中文字符
let g = '国';
// emoji 表情
let ferris = '🦀';

// 布尔类型
let m = true;
```

语句（Statements）是 Rust 中的执行单位，它们执行一些操作但不返回值，以分号;结尾。表达式（Expressions）是 Rust 中的计算单位，它们计算并返回一个值，所以表达式可以用作赋值。常见的表达式有函数调用、宏调用、用大括号创建的代码块等。单元类型：是 Rust 中一个特殊的返回值类型，意味着函数或表达式没有返回值，类似于其他语言中的 void 的返回类型。用符号 () 来表示。
小技巧：区分语句和表达式的一个简单方法就是有无分号;，有的话就是语句，执行操作但不返回结果；没有的话就是表达式，执行计算并返回结果。虽然这种方式在有些情况下不成立，但现阶段足以让我们应对绝大数场景。

```rs
fn main() {
    // 语句，使用 let 关键字创建变量并绑定一个值
    let a = 1;

    // 语句不返回值，所以不能把语句 (let a = 1) 绑定给变量 b，下面代码会编译失败
    let b = (let a = 1);

    // 表达式，返回值是 x + 1
    let y = {
        let x = 3;
        x + 1
    };

    println!("The value of y is: {}", y); // y = 4
}
```

函数是个很常见的概念，它是一段可重复使用的代码块，用于执行特定的任务或完成特定的操作。函数接受输入参数（可选），执行一系列操作，并返回一个值（可选）。
注意：Rust 代码中的函数和变量名使用 snake_case 规范风格。

现在我们来看下函数的各个组成部分。需要注意的是，函数的参数需要显式的标注类型，不仅有助于提高代码的可读性，也有助于 Rust 提供更强的类型安全性，帮助编译器在类型不匹配时发现错误，提供有用的错误信息。

```rs
// fn 为声明函数的关键字
// unsafe_add() 是函数名，函数的命名要遵循 snake_case 的规范，同时要见名知意，提高代码的可读性
// i 和 j 是入参，并且需要显式指定参数类型
// --> i32 表明出参也是 i32 类型
fn unsafe_add(i: i32, j: i32) -> i32 {
   // 表达式形式，所以函数会在计算求和后返回该值
   i + j
}
```

我们在前面章节了解到整数相加可能会溢出，但这里并没有特殊处理，所以 unsafe_add 更容易提醒开发者，这个相加是不安全的，要注意啦~

Rust 为什么要设计没有任何返回值的单元类型 () ?
Rust 是一门静态类型语言，它在编译时需要确定每个函数的返回类型。
当函数体中没有返回语句或表达式时，编译器无法确定函数的返回类型应该是什么。为了解决这个问题，Rust 引入了单元类型 () 作为一种特殊的类型，表示没有返回值的函数。类似于其他语言中的 void 类型，通常用于打印消息、写入文件等一些不需要返回值的操作。

什么是发散函数（Diverging Functions）?

指的是永远不会返回的函数，甚至连默认的单元类型 () 返回值都没有，这些函数通常用！类型来标注。通常用于处理错误或不可恢复的情况，并通过终止程序的执行来表达这种状态。

前言：我们在前几节介绍过 Rust 的基础类型：i32、char、f64、bool 等，它们都是已知大小的，存储在栈内存中。在接下来的 Rust 所有权特性中会涉及到堆内存相关的知识，所以我们在这里使用 String 作为例子，并专注于 String 与所有权相关的部分，看下 Rust 如何在栈、堆内存中管理数据的。关于 String 类型更加深入的讲解会在第三章。

这里我们先介绍下关于内存的 2 个基础知识：栈内存和堆内存，注意，这并不是 Rust 独有的。

栈内存存储的数据主要为大小固定的基础数据类型，分配和释放速度很快；它以放入值的顺序存储值并以相反顺序取出值。这也被称作 后进先出（last in, first out）。

堆内存存储那些大小在运行时动态变化的数据结构，允许更灵活的数据共享和动态分配；当向堆放入数据时，内存分配器（memory allocator）在堆的某处找到一块足够大的空位，把它标记为已使用，并返回一个表示该位置地址的指针（pointer）。总的来说，堆、栈内存并无优劣之分，只是面向的场景不同而已。

动态字符串（String 类型）：大小可变的字符集合，这个类型允许程序在运行时动态的管理堆内存上的字符串数据，比如分配、增长和修改字符串内容，所以能够存储在编译时未知大小的内容。

通过下面的代码，我们看下动态字符串的创建。

```rs
use std::io;
fn main() {
     // 创建一个可变的字符串变量来存储用户输入
    let mut input: String = String::new();
    println!("请输入您的名字：");
    // 读取用户输入并将其存储在 input 变量中
    io::stdin()
        .read_line(&mut input)
        .expect("无法读取输入");
    // 打印用户输入的字符串
    println!("您的名字是：{}", input);
}
```

这一节我们将学习 Rust 的一个重要特性：所有权，它让 Rust 无需垃圾回收器（garbage collector）即可保证内存安全。因此，理解 Rust 中所有权的运作方式非常重要。所有权：Rust 中每个值都有一个唯一的所有者 owner（如上节代码 let s1 = String::from("hello");中，变量 s1 是 hello 这个值的所有者），所有者拥有这个值的所有权，负责管理内存资源的分配和释放。Rust 通过所有权机制规定内存管理的方式，确保程序在运行时不发生数据竞争、悬垂指针等内存安全问题。所有权三原则：

1. Rust 中每一个值都被一个变量所拥有，该变量被称为值的所有者；

2.一个值同时只能被一个变量所拥有，或者说一个值只能拥有一个所有者；

3.当所有者 (变量) 离开作用域范围时，这个值将被 drop (丢弃)。

我们在下面的代码中展示所有权的分配、修改。

```rs
// 变量 s1 拥有字符串 hello 的所有权
let mut s1:String = String::from("hello");

// 变量 s1 可以修改该字符串
s1.push_str(", hackquest."); // push_str() 在字符串后追加字面值
```

前言：在上节我们介绍了 Rust 的所有权以及所有权的转移，但是仅仅支持通过转移所有权的方式获取一个值，会让程序变得复杂。那么，接下来我们学习下 Rust 中的另一特性：借用

借用 (Borrowing) ：是指通过引用来获得数据的访问权，而不是所有权，用符号&表示。借用使得可以在不转移所有权的情况下，让多个部分同时访问相同的数据。Rust 的借用分为可变借用（mutable borrowing）和不可变借用（immutable borrowing）两种形式。

解引用：是借用的一个重要操作，允许通过引用获取到被引用值的实际内容，简单来说，就是获取到借用的对象的值。用符号\*表示。

我们还是从代码和内存两个角度展示下借用、解引用的相关概念。

```rs
// 变量 s1 拥有字符串的所有权，类似于你拥有一辆特别酷炫的车
let s1 = String::from("hello");

// 借用，通过 &s1 获得字符串的访问权，类似于朋友从你那里把这辆车借走了
// 但是车还是你的
let s: &String = &s1;

// 解引用，通过 *s 获的借用的对象的值
// 类似于你朋友把车开到大街上向别人展示：看，我借到了一辆特别酷炫的车！
println!("s1 = {}, s = {}", s1, *s);
```

通过一下的图示，我们会发现借用其实就是存储了字符串对象的内存地址指针，所以用更宽泛的概念来说，借用也是一种引用。

![](./assets/rust-borrow.webp)

通过前几节的学习，我们已经初步掌握了所有权、转移、借用的概念，本节我们再深入学习以下内容：所有权与函数、drop（释放）细节、可变借用的限制。

所有权可以转移给函数，在移动期间，所有者的堆栈值将会被复制到函数调用的参数堆栈中。

```rs
struct Foo {
    x: i32,
}

fn do_something(f: Foo) {
    println!("{}", f.x);
    // f 在这里被 dropped 释放
}

fn main() {
    let foo = Foo { x: 42 };
    // foo 被移交至 do_something
    do_something(foo);
    // 此后 foo 便无法再被使用
}
```

当然，也可以从函数中获取所有权：

在发生了可变借用后，一个资源的所有者便不可以再次被借用或者修改。此举是为了避免潜在的数据争用（data race）。

```rs
struct Foo {
    x: i32,
}

fn do_something(f: Foo) {
    println!("{}", f.x);
    // f 在这里被 dropped 释放
}

fn main() {
    let mut foo = Foo { x: 42 };
    let f = &mut foo;

    // 会报错：do_something(foo);
    // 因为 foo 已经被可变借用而无法取得其所有权

    // 会报错：foo.x = 13;
    // 因为 foo 已经被可变借用而无法被修改

    f.x = 13;
    // f 会因为此后不再被使用而被 dropped 释放

    println!("{}", foo.x);

    // 现在修改可以正常进行因为其所有可变引用已经被 dropped 释放
    foo.x = 7;

    // 移动 foo 的所有权到一个函数中
    do_something(foo);
}
```

前言：在前几节我们介绍过 String 类型的内存结构，有了这个基础，我们就更容易理解本节的切片概念。

切片（slice）：是一种引用数据结构，它允许你引用数据的一部分而不需要拷贝整个数据。切片通常用于数组、字符串等集合类型。

字符串切片（String slice）：是一种特殊的切片，专门用于处理字符串。字符串切片的类型是 &str。它可以通过索引或范围来指定字符串的一部分。字符串切片提供了对字符串的引用，而不引入额外的内存开销。本节我们讨论的是分配在内存中的可动态调节大小的字符串的切片。

我们接下来学习下切片的基本语法，以及对应的内存模型。

```rs
// 该字符串分配在内存中
let s = String::from("hello world");

// hello 没有引用整个 String 字符串 s，而是引用了 s 的一部分内容，通过 [0..5] 的方式来指定。
let hello: &str = &s[0..5];
let world: &str = &s[6..11];
```

创建切片需要通过 [开始索引..终止索引]来指定范围，代表的数据范围包含开始位置，但不包含结束位置，即前闭后开；同时索引位置从 0 开始。

![](./assets/rust-section.webp)

如果字符串包含汉字，在获取字符串切片时有什么要注意的？

A：字符串切片的索引位置是按照字节而不是字符。由于汉字使用 UTF-8 编码，一个汉字（字符）可能由一个或多个字节组成。因此索引必须对应一个完整的汉字的边界，否则获取该汉字会失败。

```rs
let chinese_string = "中国人";

// 获取切片 zhong 会失败，因为一个汉字可能由“一个或多个字节”组成。
// 这里“中”占用 3 个字节，因此 [0..2] 并不对应一个完整的汉字的边界
let zhong = &chinese_string [0..2];

// 正确的写法，1 个汉字占 3 个字节，即汉字“中”的字节范围是 0、1、2
let zhong = &chinese_string[0..3];
println!("{}", zhong);
```

前言：我们在上一节介绍了字符串切片（String slice），类型为 &str，它是指向动态字符串的一个引用，本节我们介绍另一种字符串切片：字符串字面量，可以把它理解成指向静态字符串 (程序二进制文件) 的一个引用。

字符串字面量（String Literals）：是指在代码中直接写死的、由双引号包围的一系列字符，例如 "Hello, world!"。它硬编码到最终的程序二进制中，类型为 &str，跟我们上节的动态字符串切片类型一样，因为它也是一种字符串引用，对程序二进制文件中静态分配的字符串数据的引用，也称之为静态字符串切片。

我们接下来分别看下字符串字面量和动态字符串的语法。

```rs
// 字符串字面量，编译时已确定
let x: &str = "hello world";

// 动态字符串
let hello: String = String::from("hello world");
// 字符串切片，引用整个字符串
let y: &str = &hello[..];
// 字符串切片，引用部分字符串
let z: &str = &hello[0..3];
```

字符串字面量 和 动态字符串切片的异同点？
A：相同点：①都是都是对字符串数据的引用，而不是实际的字符串数据本身。
②都是 UTF-8 编码的字符串。③两者都可以使用一些相似的字符串操作，如切片、查找、比较等。不同点：①字符串字面量被硬编码到程序二进制文件中，因此在整个程序运行期间有效。而字符串切片取决于引用它的变量或数据结构的生命周期。②字符串字面量在编译时已知大小，是固定大小的；字符串切片在运行时确定大小，是动态大小的。

前面我们已经对字符串有了一定的了解，接下来我们继续学习字符串相关的操作：追加、插入、替换、删除等。

字符串是由字符组成的连续集合，Rust 中字符采用 Unicode 字符集，约定每个字符 4 个字节，但在实际的编码中，Rust 对字符串采用 UTF-8 编码，也就是每个字符所占的字节数是变化的 (1 - 4)。这样有助于大幅降低字符串所占用的内存空间。

```rs
let say = String::from("hello，世界");
// 长度为 12
// utf-8 对 ascii 字符用 1 个字节，对常见汉字采用 3 个字节编码
println!("长度为:{}", say.len());
```

字节（byte）是一个长度单位，跟使用哪种编程语言没有关系，在计算机中它占据 8 个 bit 位，类似于 0111 1010 这样。字符（Character）是一种文本数据类型，表示文本中的一个单个字符，Rust 采用 char 表示为字符类型。字符串是由字符组成的序列，Rust 中字符串类型是 String。

元组：是由多种类型元素组合到一起形成的集合，因此它是复合类型，并且它的长度、顺序是固定的。元组通过使用圆括号 ( ) 来定义，其中包含了多个值，各个值之间用逗号 , 分隔。

元组的创建

```rs
// 创建 1 个长度为 4，多种不同元素类型的元组
let tup: (i32, f64, u8, &str) = (100, 1.1, 1, "这是一个元组");

// 元组的成员还可以是一个元组
let tup2: (u8, (i16, u32)) = (0, (-1, 1));
```

结构体：是一种自定义数据类型，用于组织和存储不同类型的数据成员。它允许你创建一个包含多个字段的数据结构，每个字段都有自己的类型和名称，使得代码更具可读性和可维护性。通过 struct 关键字定义。

延伸阅读：结构体在许多编程语言中都存在，尽管具体的实现和语法可能有所不同，比如 C 语言是结构体的发源地之一；C++ 继承了 C 语言的结构体并引入了类，使得结构体的功能更加强大；Go 语言中也有结构体的概念，用于定义一组相关字段的数据结构，并且可以有相关的方法，但没有经典的面向对象继承。Java 中虽然没有结构体的概念，但它的 Class 类特性也跟结构体类似，这正是 Java 面向对象编程的核心特性……

以汽车为例，我们学习下如何定义结构体：struct 关键字 + Car 结构体名称 + 清晰明确的字段及类型。

```rs
struct Car {
    // 品牌
    brand: String,
    // 颜色
    color: String,
    // 生产年份
    year: String,
    // 是否新能源
    is_new_energy: bool,
    // 价格
    price: f64
}
```

什么是元组结构体 (Tuple Struct)，适用什么场景？

A：结构体必须要有名称，但是结构体的字段可以没有名称，这种结构体长得很像元组，因此被称为元组结构体。

如果你希望有一个整体名称，但是又不关心里面字段的名称。例如下面的 Point 元组结构体，众所周知 3D 点是 (x, y, z) 形式的坐标点，因此我们无需再为内部的字段逐一命名为：x, y, z。

```rs
// 只有结构体名称：Color，没有字段名称
struct Color(i32, i32, i32);
// 只有结构体名称：Point，没有字段名称
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

枚举（Enum）是一种用户自定义数据类型，它允许你列举一些可能的值，也叫变体（variants），每个变体也可以包含不同类型的数据。枚举主要用于表示不同种类的选项或操作，以及进行模式匹配等场景。它的定义如下：

```rs
enum 枚举名 {
	variants1,
	variants2,
	……
}
```

我们以交通信号灯为例，看看它的枚举是什么。

```rs
// 通过 enum 关键字定义
enum TrafficLight {
  // 这里枚举出所有的取值
  Red,
  Yellow,
  Green,
}
```

什么是 Option 枚举，如何使用？

A：Option 枚举主要用于处理可能出现空值的情况，以避免使用空指针引起的运行时错误。它的定义如下：

```rs
// 它有两个枚举值，Some(T): 包含一个具体的值 T，以及 None: 表示没有值。
enum Option<T> {
	None,
	Some(T),
}
```

下面的例子中 divide 函数的返回值就是 Option 枚举。请注意：Rust 的 标准库 prelude 中，Option 枚举是默认导入的，因此在代码中使用 Option 时无需显式使用 Option:: 前缀或者通过 use 语句显式导入。

```rs
// 定义一个函数，返回一个 Option 枚举
fn divide(x: f64, y: f64) -> Option<f64> {
    if y == 0.0 {
        None
    } else {
        Some(x / y)
    }
}

fn main() {
    // 调用函数并匹配 Option 的变体
    let result1 = divide(10.0, 2.0);
    match result1 {
				// 这里不需要显式使用 Option::Some(data)
        Some(_data) => println!("result1:{:?}", result1),
        None => println!("result1: None"),
    }

    // 当分母为 0，返回 None 值
    let result2 = divide(10.0, 0.0);
    match result2 {
        Some(_data) => println!("result2:{:?}", result2),
        None => println!("result2: None"),
    }
}
```

数组：是将多个相同类型的元素依次组合在一起，形成的集合。在 Rust 中常用的数组有两种，一种是直接分配在栈内存中，速度很快但是长度固定的静态数组 array，另一种则是分配在堆内存中，可动态增长，但有性能损耗的动态数组 Vector。

我们在之前的章节提到过“元组”，它跟数组最重要的区别就是它不同类型的元素集合，而数组是相同类型的元素。

这一节我们将介绍下“静态数组”相关的内容。

如下代码展示了通过不同方式创建静态数组的语法

```rs
// 不指定元素类型，由编译器推断
let a = [1, 2, 3, 4, 5];

// [类型;长度] 显式指定类型及长度
let b: [i32; 5] = [1, 2, 3, 4, 5];

// [初始值;长度] 初始化一个某个值重复出现 N 次的数组，c = [3,3,3,3,3]
let c = [3; 5];
```

上一节我们已经初步了解了“动态数组”的概念，接下来我们深入学习下。

动态数组 Vec<T>是一种灵活的数据结构，允许在运行时动态改变大小。所以它的长度是可变的，可以根据需要动态增加或减少元素。这为处理不确定数量的数据提供了便利，比如读取未知数量的用户输入或动态生成数据集。

与 String 类型不同，动态数组 Vec<T>是通用的，可以存储“任何类型”的元素，而 String 专门用于处理 UTF-8 编码的文本数据。动态数组 Vec 提供更灵活的操作，但在处理文本时，String 提供了一些额外的字符串特定功能，例如字符串连接、切片等。选择使用动态数组 Vec 还是 String 取决于具体的需求和数据类型。

下面的代码展示了 5 种创建动态数组的不同方式。

```rs
// 1.显式声明动态数组类型
let v1: Vec<i32> = Vec::new();

// 2.编译器根据元素自动推断类型，须将 v 声明为 mut 后，才能进行修改。
let mut v2 = Vec::new();
v2.push(1);

// 3.使用宏 vec! 来创建数组，支持在创建时就给予初始化值
let v3 = vec![1, 2, 3];

// 4.使用 [初始值;长度] 来创建数组，默认值为 0，初始长度为 3
let v4 = vec![0; 3];  // v4 = [0, 0, 0];

// 5.使用 from 语法创建数组
let v5 = Vec::from([0, 0, 0]);
assert_eq!(v4, v5);
```

动态数组 Vector 在内存中的结构是什么样的，如何进行动态调整的？

```rs
fn main() {
    let mut v: Vec<i32> = vec![1, 2, 3, 4];
    //prints 4，即数组的初始容量是 4
    println!("v's capacity is {}", v.capacity());
    // 打印内存地址
    println!("Address of v's first element: {:p}", &v[0]);

    v.push(5);
    //prints 8，数组进行扩容，容量变成 8
    println!("v's capacity is {}", v.capacity());
    // 打印扩容后的内存地址，会发现跟上面的地址并不相同
    println!("Address of v's first element: {:p}", &v[0]);
}
```

初始时动态数组 v 的容量是 4，堆内存中存储数值，栈内存中记录了堆内存的地址指针、数组容量及数组大小，当添加新元素 5 时，数组进行扩容，重新申请一块 2 倍大小的内存（即 8），再将所有元素拷贝到新的内存位置，同时更新指针数据，这时数组大小是 5，容量大小是 8。

![](./assets/rust-vector-array.webp)

Hashmap 是 Rust 语言中的一个集合类型，用于存储键与值（key-value）的对应关系。每个键 key 映射到一个值 value，键必须是唯一的。这种结构允许我们通过键快速检索到值，而不需要遍历整个集合。Hashmap 的高效性来自于它的散列函数，这个函数能够将键转换成存储位置的索引，从而直接访问内存中的位置，这样就大大加快了查找速度。

可以使用如下 2 种方式创建 HashMap，如果预先知道要存储的 key-value 对个数，可以创建指定大小的 HashMap，避免频繁的内存分配和拷贝，提升性能。

```rs
// 由于 HashMap 并没有包含在 Rust 的 prelude 库中，所以需要手动引入
use std::collections::HashMap;
fn main() {
    // 创建一个 HashMap，用于存储学生成绩
    let mut student_grades = HashMap::new();
    student_grades.insert("Alice", 100);

    // 创建指定大小的 HashMap，避免频繁的内存分配和拷贝，提升性能。
    let mut student_grades2 = HashMap::with_capacity(3);
    student_grades2.insert("Alice", 100);
    student_grades2.insert("Bob", 99);
    student_grades2.insert("Eve", 59);
}
```

流程控制是编写程序时至关重要的一部分，它决定了程序的执行流程。Rust 在流程控制方面的语法设计简洁而强大，常见的流程控制语句有 if 表达式、for 循环、while 循环、loop 循环，这些是构建程序逻辑的重要工具，灵活运用它们可以使程序更加清晰和高效。

下面的代码展示了 Rust 中常见的 4 种流程控制命令，基本覆盖了编程过程中的绝大部分场景。

```rs
fn main() {
    let condition = true;
    // if else 语法
    if condition {
        // do something
    } else {
        // do something else
    }

    // for 循环
    for i in 1..=5 {
        println!("{}", i);
    }

    // while 循环
    let mut m = 1;
    while m <= 5  {
        println!("{}!", m);
        m = m + 1;
    }

    // loop 循环
    let mut n = 1;
    loop {
        println!("{}!!", n);
        n = n + 1;
        if n > 5 {
            break;
        }
    }
}
```

模式匹配

模式匹配允许我们将一个 target 值与一系列的模式相比较，并根据相匹配的模式执行对应的表达式。Rust 中常见的模式匹配有 match 和 if let 两种，这里我们以 match 举例来看看什么是模式匹配。

```rs
match target {
    模式1 => 表达式1,
    模式2 => {
        语句1;
        语句2;
        表达式2
    },
    _ => 表达式3
}
```

这里我们展示下 match 模式匹配的其他用法：模式绑定、赋值、解构。if let 简单模式匹配：用来处理只匹配一个模式的值而忽略其他模式的情况，可以让我们的代码更加简洁。

```rs
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Square(f64),
}

fn calculate_area(shape: &Shape) -> f64 {
    match shape {
        // 从匹配的模式中取出绑定的值，如 radiux、width、side
        Shape::Circle(radius) => std::f64::consts::PI * radius * radius,
        Shape::Rectangle(width, height) => width * height,
        Shape::Square(side) => side * side,
    }
}
struct Point {
    x: i32,
    y: i32,
}

fn process_point(point: Point) {
    match point {
        Point { x: 0, y: 0 } => println!("坐标在原点"),
        Point { x, y } => println!("坐标在 ({}, {})", x, y),
    }
}

fn main() {
    let circle = Shape::Circle(3.0);
    let rectangle = Shape::Rectangle(4.0, 5.0);
    let square = Shape::Square(2.0);

    // 1、调用函数，输出各形状的面积
    println!("圆形的面积：{}", calculate_area(&circle));
    println!("矩形的面积：{}", calculate_area(&rectangle));
    println!("正方形的面积：{}", calculate_area(&square));

    // 2、match 模式匹配进行赋值
    let area = match circle {
        Shape::Circle(radius) => std::f64::consts::PI * radius * radius,
        Shape::Rectangle(width, height) => width * height,
        Shape::Square(side) => side * side,
    };
    println!("圆形的面积：{}", area);

    // 3、解构结构体
    let point1 = Point { x: 0, y: 0 };
    let point2 = Point { x: 3, y: 7 };
    process_point(point1);
    process_point(point2);

		// 4、if let 简单匹配
    let some_u8_value = Some(3u8);
    match some_u8_value {
        Some(3) => println!("three"),
        // 这里还要考虑除 3 以外的其他值，以及 None 值
        _ => (),
    }

    // 只匹配数值 3 即可
    if let Some(3) = some_u8_value {
        println!("three");
    }
}
```

前言：我们在前面章节学习过结构体和枚举类型，它们定义了对象的属性（比如 Car 结构体中的品牌、颜色、价格等），但很多时候，光有属性是远远不够的，我们还需要对象的行为（比如行驶、减速等），而方法，就是关于对象行为的描述。

方法：是与结构体 structs 或枚举 enums 或特征对象 trait 等特定类型相关联的函数，它们允许你在这些类型上定义行为，并且支持像调用普通函数一样调用该行为。

方法与函数类似：它们使用 fn 关键字和名称声明，可以拥有参数和返回值，以及对应的函数体逻辑。不过方法与函数是不同的，因为方法通过 impl 关键字在结构体或枚举的上下文中定义，并且它们第一个参数总是&self，代表调用该方法的结构体实例。

该例子定义了一个 Rectangle 结构体，并且在其上定义了一个 area 方法，用于计算该矩形的面积。并在 main 函数中调用该方法。

```rs
// 结构体定义
struct Rectangle {
    width: u32,
    height: u32,
}

// impl Rectangle {} 表示为 Rectangle 实现方法 (impl 是实现 implementation 的缩写)
impl Rectangle {
    // area 方法的第一个参数为 &self，代表结构体实例本身
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!(
        "The area of the rectangle is {} square pixels.",
        // 这里调用结构体的 area 方法
        rect1.area()
    );
}
```

方法和函数之间的主要区别在于它们与类型的关系以及调用方式。

方法与特定的类型（结构体、枚举、trait 等）关联；在类型的 impl 块内定义，使用 self 参数来表示调用该方法的实例；使用点运算符来调用，类似于面向对象语言中的对象方法。

而函数则与特定类型无关，是独立存在的；可在任何地方定义，没有 self 参数，因为它们不与特定实例相关；直接通过函数名调用。

枚举中方法如何定义及使用？

枚举中方法定义和使用，跟结构体类似，具体看下下面的代码

```rs
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        match &self {
            Message::Quit => println!("退出"),
            Message::Move { x, y } => println!("移动到 ({},{})", x, y),
            Message::Write(text) => println!("写入{}", text),
            Message::ChangeColor(r, g, b) => println!("改变颜色为 ({}, {}, {})", r, g, b),
        }
    }
}

fn main() {
    let m = Message::Move { x: 1, y: 2 };
		// 调用枚举方法 call
    m.call();

    let n = Message::Write(String::from("hello"));
    n.call();
}
```

泛型（generics）：是一种强大的编程特性，允许编写可重用、通用的代码，而不必针对特定的数据类型进行硬编码。泛型的核心思想是参数化类型，即通过在定义时使用占位符来表示数据类型。例如，之前章节用到的 Vec<T>、HashMap<K,V>、Option<T>数据类型，使用<T>表示一个泛型参数（也可以用其他字符替代，如 K、V），其中 T 可以在实际使用时替换为任何具体的数据类型。这样的灵活性使得代码更加通用、可读性更强。

假如我们有一个函数 largest 可以用来查找 i32 类型数组中的最大元素，现在我们需要它支持 i64 类型的数组，怎么办？当然新增一个参数为 i64 类型的函数也可以，除了类型不同外，其他的逻辑跟上一个函数都一样，但未免太繁琐。

```rs
// 查找 i32 类型数组的最大元素
fn largest_for_i32(list: &[i32]) -> i32 {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

// 查找 i64 类型数组的最大元素，除了函数的参数和返回值类型不同外，其他跟
// 上一个函数完全一样
fn largest_for_i64(list: &[i64]) -> i64 {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}
```

那有什么好的办法吗？当然，泛型可以帮我们解决这个问题。将具体类型抽象为泛型 T，只要它里面的元素支持大小比较即可，这样我们就可以把上面的 2 个函数抽象成 1 个泛型函数。

```rs
fn largest<T>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        // 这里只是做示意说明，实际代码需要增加泛型约束
        if item > largest {
            largest = item;
        }
    }

    largest
}
```

我们在前面章节学习过 Rust 的结构体（struct）、枚举（enum）等数据类型以及方法，并且知道通过方法可以定义类型的行为，本节我们会引入一个新的概念：Trait 特性

Trait 特征：一个类型的行为由其可供调用的方法构成，如果可以对不同类型调用相同的方法的话，这些类型就可以共享相同的行为了。Trait 特征是一种将方法签名组合起来的机制，目的是构建一个实现某些目的所必需的行为的集合。总的来说，它是定义类型的共享行为并实现代码的抽象。

这里演示了 Trait 特征如何定义，并在结构体上实现的相关逻辑。

```rs
// trait 关键字 + MigrateBird 特征名
trait MigrateBird {
    // 定义该特征的方法，参数必须包含&self，因为它是该类型上的行为
    fn migrate(&self) -> String;
}

// 定义大雁结构体
struct WildGoose {
     color : String,
}

// 为 wild_goose 类型实现 migrate_bird 特征
impl MigrateBird for WildGoose {
     fn migrate(&self) -> String {
         "Geese fly in a V-shaped formation".to_string()
     }
}
```

注意：如果 Trait 特征方法没有默认实现，则方法定义以分号;结尾，即只有方法签名，没有{}方法体，因为具体的实现交由各类型负责。

什么是 Trait 特征的默认实现？

Trait 是共享的行为，所以我们可以给它赋予默认行为，而类型在必要的时候进行覆盖，否则就使用默认的行为。下面的代码展示了如何定义默认行为。

```rs
// 定义特征，并赋予默认实现 default_migrate
trait MigrateBird {
    fn default_migrate(&self) {
        println!("i am flying to the warm south");
    }
}

struct Swallow {
    color : String,
}

// 这里直接使用默认的实现
impl MigrateBird for Swallow {}

fn main() {
    let small_swallow = Swallow {
        color : String::from("black")
    };
    small_swallow.default_migrate();
}
```

前面我们学习了泛型和 Trait 特性，那么接下来我们稍微深入一点。
泛型单态化（monomorphization）：是一种编译优化技术，它通过填充编译时使用的具体类型，将通用代码转换为特定代码。与创建泛型函数的步骤相反，编译器寻找所有泛型代码被调用的位置并使用泛型代码针对具体类型生成代码。

针对上节中泛型函数 largest，参数类型为&T，这样 i32、i64 或者其他类型都可以调用该函数。

```rs
// T 可以代表任何一种类型
fn largest<T>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let arr1: [i32; 3] = [1, 2, 3];
    largest(&arr1);
    let arr2: [i64; 3] = [1, 2, 3];
    largest(&arr2);
}
```

但是在编译阶段，对于每种使用不同类型的泛型函数的情况，编译器又都会生成一个具体的函数，以便获得更好的性能。单态后的代码类似于这样。

```rs
// 重新实例化为 i32 类型的函数
fn largest_for_i32(list: &[i32]) -> i32 {
    let mut largest = list[0];
    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// 重新实例化为 i64 类型的函数
fn largest_for_i64(list: &[i64]) -> i64 {
    let mut largest = list[0];
    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

总的来说，我们可以使用泛型来编写不重复的代码，而 Rust 将会为每一个实例编译其特定类型的代码。这意味着在使用泛型时没有运行时开销；当代码运行，它的执行效率就跟好像手写每个具体定义的重复代码一样。这个单态化过程正是 Rust 泛型在运行时极其高效的原因。

什么是特征约束（Trait bound）？

我们先看下 Trait 是如何作为参数传递的，回到上节候鸟 MigrateBird 的例子，我们定义了一个参数类型为 MigrateBird 的 fly 方法，如下：

```rs
// trait 特征
trait MigrateBird {
    fn migrate(&self) -> String;
}

// 为大雁实现 Trait 特性的 migrate 方法
impl MigrateBird for WildGoose {
    fn migrate(&self) -> String {
        "Geese fly in a V-shaped formation".to_string()
    }
}

// 为燕子实现 Trait 特性的 migrate 方法
impl MigrateBird for Swallow {
    fn migrate(&self) -> String {
        "swallow fly fast, but have to rest frequently".to_string()
    }
}

fn fly(item: impl MigrateBird) {
		println!("i am flying to the warm south");
}
```

当然，对于 fly 方法，我们还可以用 Trait bound 的方式实现，这样，只有是 MigrateBird 类型的参数，才可以调用该函数，换句话说，我们把参数的泛型类型限制为 MigrateBird 类型。

```rs
fn fly<T: MigrateBird>(item: T) {
		println!("i am flying to the warm south");
}
```

在 Rust 中，关联类型允许我们在 trait 中使用类型参数 type，该类型可以在实现 trait 的时候具体化。这使得 trait 能够与不同的具体类型一起使用，而不需要在 trait 中提前指定具体的类型。通过关联类型，我们可以在 trait 中使用抽象的类型，而在实现 trait 时再具体指定这些类型，这样就可以在不同的类型上共享相同的行为，从而增加了 trait 的灵活性。

关联类型是在特征定义的语句块中，申明一个自定义类型，这样就可以在特征的方法签名中使用该类型：

```rs
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

以上是标准库中的迭代器特征 Iterator，它有一个 Item 关联类型，用于替代遍历的值的类型。同时，next 方法也返回了一个 Item 类型，不过使用 Option 枚举进行了包裹，假如迭代器中的值是 i32 类型，那么调用 next 方法就将获取一个 Option<i32> 的值。

```rs
impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        // --snip--
    }
}
```

通过如上代码，我们在 Counter 的实现中指定了 Item 的具体类型 u32，这也是 next 函数的返回值 Self::Item 对应的类型。

是否可以通过泛型参数达到相同的效果，关联类型跟泛型参数相比，它们的适用场景有什么区别？

通过在 trait 中使用泛型参数，可以实现与关联类型类似的灵活性。以下是使用泛型参数的示例：

```rs
pub trait Iterator<T> {

    fn next(&mut self) -> Option<T>;
}
```

关联类型相对于泛型参数相比，语法更简洁：使用关联类型时，不需要在每个 impl 语句中指定具体的类型参数（如 impl Iterator<u32> for Counter {…}），而是在 trait 中定义关联类型，尤其当泛型参数较多时，使得代码更加清晰简洁，提升代码可读性。

通常情况下，泛型参数更适用于函数中，当函数需要适用于多个不同类型时，使用泛型参数可以提供更大的灵活性。而关联类型更适合与 trait 相关的类型抽象：当 trait 需要定义一个与 trait 相关的类型，且这个类型在实现 trait 时才能确定具体类型时，使用关联类型会更加合适。

因此，选择使用泛型参数还是关联类型取决于具体的需求和代码结构，以及对灵活性和抽象级别的需求。

悬垂引用：尝试使用离开作用域的值的引用。我们在前面的章节介绍过借用的概念，就是获取值的引用，但在这个值本身超出其作用域后，就会被 Rust 内存管理器释放掉（drop），此时如果还尝试使用该引用，就会发生悬垂引用，引发错误。

```rs
// 这里我们看下悬垂引用的例子。
{
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("r: {}", r);
}
```

变量 x 的作用域在内部的{}中，此时变量 r 获取到了 x 的引用，但在内部{}之后，变量 x 被 Rust 释放，由于变量 r 的作用域一直到外部的{}，也就是此时 r 依然有效，但是它的值不存在了，因此变量 r 成了悬垂引用，这就是为什么编译器会提示 x does not live long enough, borrowed value does not live long enough。

借用检查器（borrow checker）是如何工作的？

Rust 编译器有一个借用检查器，它比较作用域来确保所有的借用都是有效的。对于上面的例子，借用检查器会对变量的作用域范围进行标注，如下：

```rs
{
    let r;                // ---------+-- 'a
                          //          |
    {                     //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}
```

我们会发现变量 r 的作用域是 'a 所标识的范围，而变量 x 的作用域是 'b 所标识的范围，此时 'b 的范围小于 'a，即变量 r 引用的作用域大于值的作用域，借用检查器就会发现这个引用可能是无效的。

对于上面的例子，如何才能通过借用检查器的检查？

只需要保证值的作用域 'b 大于 引用的作用域 'a 即可。换句话说，只要债主一直活着，Rust 的世界里就认为这个借贷是允许的。

```rs
{
    let x = 5;            // ----------+-- 'b
                          //           |
    let r = &x;           // --+-- 'a  |
                          //   |       |
    println!("r: {}", r); //   |       |
                          // --+       |
}                         // ----------+
```

生命周期：Rust 中的每一个引用都有其生命周期（lifetime），也就是引用保持有效的作用域。在大多数时候，我们无需手动的声明生命周期，因为编译器可以自动进行推导，但当多个生命周期存在，如同上节的 longest 函数：fn longest(x: &str, y: &str) -> &str {……}，入参有 2 个不同引用，出参也会根据函数体逻辑指向不同的引用，此时编译器无法进行引用的生命周期分析，就需要我们手动标明不同引用之间的生命周期关系，也就是生命周期标注。

生命周期标注并不改变任何引用的生命周期的长短。它只是描述了多个引用生命周期相互的关系，便于编译器进行引用的分析，但不影响其生命周期。它的目的是避免悬垂引用，防止程序引用了本不该引用的数据。

生命周期标注的语法：生命周期参数名称必须以撇号'开头，其名称通常全是小写，类似于泛型其名称非常短。'a 是默认使用的名称。生命周期参数标注位于引用的 & 之后，并有一个空格来将引用类型与生命周期标注分隔开。

对于函数的参数和返回值中存在多个引用，需要手动去标记生命周期。

```rs
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

参数 x 和 y 的生命周期标注都是'a，至于 'a 究竟是多久我们并不需要关心，只需要知道 'a 代表的是变量 x 和 y 生命周期相同（重叠）的那部分，即 x 和 y 生命周期中最小的那个范围。而返回值也是通过 'a 进行标注的，说明了返回值的生命周期与变量 x 或 y 中最小的那个一致。我们通过 FAQ 来看下具体的使用例子。

longest 函数是如何处理具有不同生命周期的引用？

如下的代码展示了 string1 和 string2 这两个不同生命周期的变量，前者的生命周期位于外部的{}中，而后者的生命周期位于内部的{}中，所以'a 代表的生命周期范围是两者中较小的那个，即内部的 {}，此时返回值 result 的生命周期也是属于内部的 {}，即返回值能够保证在 string1 和 string2 中较短的那个生命周期结束前有效，此时不会发生悬垂引用，编译通过。

```rs
fn main() {
    let string1 = String::from("abcdefghijklmnopqrstuvwxyz");
    {
        let string2 = String::from("123456789");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}
```

接下来，让我们尝试另外一个例子，该例子揭示了 result 的引用的生命周期必须是两个参数中较短的那个。

```rs
fn main() {
    let string1 = String::from("abcdefghijklmnopqrstuvwxyz");
    let result;
    {
        let string2 = String::from("123456789");
        result = longest(string1.as_str(), string2.as_str());
    }
    println!("The longest string is {}", result);
}
```

此时 'a 代表的生命周期范围依旧是变量 string1 和 string2 中最小的那个，即内部的{}，但返回值 result 的生命周期范围却是外部的{}，而不是内部的{}，也就意味着 result 可能会引用一个无效的值，因此编译失败。

> 注意：通过人为观察 result 的引用应该为 string1，这样返回值 result 和 string1 的作用域是一致的，理论上是应该编译通过的。但是，Rust 的编译器会采用保守的策略，我们通过生命周期标注告诉 Rust，longest 函数返回值的生命周期是传入参数中较小的那个变量的生命周期，因此借用检查器不允许上述代码，因为可能存在无效引用。

Rust 中的错误主要分为 2 类，不可恢复错误 panic 和可恢复错误 Result。

Panic 是一种非正常的程序终止，通常表示发生了无法恢复的错误，例如数组越界、除零等。在 Rust 中，Panic 可以通过 panic! 宏来显式触发。当 panic 发生时，程序会打印错误信息，并在栈展开（stack unwinding）过程中清理资源，最终退出程序。

Result 是一种更为正常和可控的错误处理方式，例如文件操作、网络请求等可能发生错误的场景。这些操作可以返回 Result<T, E> 类型并交由开发者处理，其中 T 是成功时的返回类型，E 是错误时的返回类型。

下面的代码我们分别展示了 panic 错误和 Result<T, E>错误。其中 T 和 E 是泛型类型参数，T 代表成功时返回的数据类型，而 E 代表失败时返回的错误类型。由于 Result 预导入模块（prelude）已经包含了 Result 枚举及其成员，所以使用中不需要显式指定前缀 Result::，如 Result::Ok、Result::Err，可直接使用 OK 或 Err

```rs
/*
 * Result 的定义如下，
 *
 * enum Result<T, E> {
 *    Ok(T),
 *	  Err(E),
 * }
 */

// 两数相除
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("Cannot divide by zero!"))
    } else {
        Ok(a / b)
    }
}

// 不可恢复错误
fn main1() {
    // 人为制造一个 panic 的场景，程序运行到此处会中断，不再往下执行
    panic!("This is a panic situation!");
}

// 可恢复错误，使用 Result 类型来处理潜在的错误
fn main2() {

    // divide(1, 0) 返回值为 Result 类型，这里通过 match 进行模式匹配，分别处理成功和失败这 2 种情况
    match divide(1, 0) {
        Ok(result) => println!("Result: {}", result),
        Err(err) => println!("Error: {}", err),
    }
}
```

如果错误需要交给上层调用者来处理，错误如何传播？

如果 method_a 调用 method_b 时，除了 method_b 中处理错误外，还可以选择让调用者 method_a 知道这个错误并决定该如何处理，这称为 传播（propagating）错误，这样能更好地控制代码调用，因为调用者 method_a 可能拥有更多的上下文信息或逻辑来决定应该如何处理错误。请看下面错误传播的代码示意

```rs
use std::io;
use std::io::Read;
use std::fs::File;
// 打开并读取文件内容，这里返回值为 Result 类型，不管正常还是错误，都可以
// 传播给上层调用者 main 函数
fn read_file_contents(file_path: &str) -> Result<String, io::Error> {
    // 尝试打开文件
    let my_file: Result<File, io::Error> = File::open(file_path);

    // 采用模式匹配，如果打开成功，则将文件句柄绑定到 file 变量，
    // 否则采用 Return 显式返回错误信息，交由上层调用者 main 函数处理
    let mut file = match my_file {
        // 等同于 Result::Ok(file)
        Ok(my_file) => my_file,
        Err(e) => return Err(e),
    };

    let mut contents = String::new();

    // 这是一个表达式，模式匹配后直接返回对应的值
    // 如果读取成功，则返回 Ok(contents)，反之，返回 Err(e)，上层调用者 main
		// 函数处理函数调用的最终结果
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e),
    }
}

fn main() {
	// 这里处理函数的调用结果
	match read_file_contents("example.txt") {
		Ok(contents) => println!("File contents: {}", contents),
		// 上层调用者决定只打印错误信息，而不是中断程序执行
		Err(err) => eprintln!("Error reading file: {}", err),
	}
}
```

学习目标：本节我们先从整体上学习宏的基础概念，并认识几个 Rust 中常见的宏。

宏（Macro）是一种元编程（metaprogramming）的工具，使得开发者能够编写能够生成代码的代码，从而提高代码的灵活性和重用性。更详尽的解释可以参见本课的 FAQ。Rust 中的宏分为以下两种类型：

声明式宏（Declarative Macros）允许开发者使用宏规则（macro_rules!）创建模式匹配和替换规则，根据匹配到的模式进行代码替换。声明式宏是一种基于文本的宏，它仅仅是简单的文本替换，并没有对语法树进行操作。

过程宏（Procedural Macros）允许开发者在代码生成阶段使用 Rust 代码来处理输入并生成输出。而非像声明式宏那样匹配对应模式然后以另一部分代码替换当前代码，因此是更为强大和灵活的宏形式，过程宏有三种主要类型：派生宏（derive macros）、属性式宏（attribute-like macros）和函数式宏（function-like macros）。

总体而言，声明式宏主要是基于简单的文本替换和模式匹配，适用于对代码进行简单的转换。过程宏则更为灵活，允许在编译期间生成和操作 AST，提供了更丰富的功能，但相对复杂一些，需要更深入的理解和使用。选择声明式宏还是过程宏通常取决于所需功能的复杂性和类型安全的要求。

> AST（Abstract Syntax Tree，抽象语法树）：Rust 源代码在编译器中会被解析成词法单元（Token），并进一步解析成一种树状结构，其中的每个节点表示源代码的一个语法结构元素，比如表达式、语句、函数声明等。节点之间通过树状结构相互连接，反映了源代码中的嵌套和层次关系。

这里展示了 Rust 中最常见的一些宏：

```rs
// 日志打印宏 println!
println!("hello, micro");

// 动态数组创建宏 vec!
let _dyc_arr = vec![1, 2, 3];

// 断言宏 assert!，判断条件是否满足
let x = 1;
let y = 2;
assert!(x + y == 3, "x + y should equal 3");

// 格式化字符串的宏 format!
let name = "world";
let _message = format!("Hello, {}!", name);
```

Rust 中宏和函数究竟有什么区别？

在 Rust 中，宏和函数都是用于代码重用的工具，但它们之间有一些重要的区别。

首先，宏是一种编译时工具，而函数是一种运行时工具。这意味着，宏在编译时被展开并生成代码，而函数则在程序运行时被调用并执行代码。因此，使用宏可以在编译时进行更多的优化和检查，从而提高程序的性能和安全性。其次，宏可以接受任意数量和类型的参数，并且可以在编译时生成任意类型的代码。这使得宏非常灵活，可以用于各种不同的场景。例如，宏可以用于生成数据结构、定义域特定语言、实现代码模板等等。另外，宏还可以使用 Rust 的元编程功能，例如宏定义中的 #[derive] 属性可以自动生成代码，这在某些情况下可以减少编写代码的工作量。下面是一个简单的示例，展示了如何使用宏和函数来实现相同的功能。假设我们要编写一个函数，将一个字符串转换为大写字母：

```rs
fn to_upper_case(s: &str) -> String {
    s.to_uppercase()
}

fn main() {
    let s = "hello, world!";
    let result = to_upper_case(s);
    println!("{}", result);
}

```

这个函数很简单，但是我们可以使用宏来实现同样的功能，如下所示：

```rs
macro_rules! to_upper_case {
    ($s:expr) => {
        $s.to_uppercase()
    };
}

fn main() {
    let s = "hello, world!";
    let result = to_upper_case!(s);
    println!("{}", result);
}

```

这个宏看起来比函数更复杂，但它的优点也很明显：可以在编译时展开，这使得宏在编译时进行更多的优化和检查，从而提高程序的性能和安全性。在上面的例子中，宏展开后，在生成的代码中直接使用 to_uppercase 方法，而不需要调用 to_upper_case 函数，减少了程序的运行时间和内存使用。Rust 编译器将将宏展开为以下代码：

```rs
let s = "hello, world!";
let result = s.to_uppercase();
println!("{}", result);
```

总之，宏和函数都是 Rust 中非常有用的工具，需要根据具体的需求选择使用哪种方式。

通过前面的学习，我们对 Rust 中的宏有了初步认识，本节我们继续学习其中的声明式宏，首先回顾下它的概念：

声明式宏（Declarative Macros）采用了类似 match 的机制（见 4.2 节模式匹配），允许开发者使用宏规则 macro_rules! 创建模式匹配和替换规则，根据匹配到的模式进行代码替换。声明式宏是一种基于文本的宏，它仅仅是简单的文本替换，并没有对语法树进行操作。

> 语法树是代码的抽象表示，它以树状结构表示代码的语法结构。在宏中，语法树是由一个个代码单元组成的抽象结构，用于表示代码的语法和结构。宏可以通过操作语法树来生成、修改或重组代码。

这里展示了一个简单的声明式宏的定义（使用关键字 macro_rules!），该宏通过参数个数实现了 2 种模式匹配机制。

注意：Rust 编译器对该宏展开后，并不是对 2 个数进行了求和计算，而是将其展开为 2 个相加的数字，代码如下：

```rs
// 宏的定义
macro_rules! add {
		// 匹配 2 个参数，如 add!(1,2), add!(2,3)
    ($a:expr,$b:expr) => {
        // macro 宏展开的代码
        {
            // 表达式相加
            $a + $b
        }
    };

		// 匹配 1 个参数，如 add!(1), add!(2)
    ($a:expr) => {{
        $a
    }};
}

fn main() {
		let x = 0;
    // 宏的使用
    add!(1, 2);
    add!(x);
}

// 宏展开的代码如下
fn main() {
	{
		1 + 2
	}
}
```

Rust 宏中的 Token 是什么概念？

Token 是 Rust 代码的最小单元，它是源代码中的一个元素，代表了语法的一部分。在 Rust 中，Token 可以是关键字、标识符、运算符、符号等。在宏中，我们需要操作和理解这些 Token，以便生成或转换代码。

```rs
macro_rules! add {
    ($a:expr,$b:expr) => {{
        $a + $b
    }};
}
```

上面的代码中，参数以$作为开头，:后表明该参数的类型，参数类型通常被称为 Token，Rust 中常见的 Token 类型有：

● 表达式（expr）：表示 Rust 代码中的表达式，例如 x + y、if condition { true } else { false } 等，数字也是一种表达式。

● 语句（stmt）：表示 Rust 代码中的语句，例如 let x = 1;、println!("Hello, world!"); 等。

● 类型（ty）：表示 Rust 代码中的类型，例如 i32、bool、String 等。

● 标识符（ident）：表示 Rust 代码中的标识符，例如变量名、函数名、结构体名等。

● 通用 Token（tt）：表示 Rust 代码中的任意 Token，可以用于匹配和生成任意类型的 Token。

声明式宏如何实现比函数更加灵活的功能，如不确定的参数类型、非固定数量的参数等？

通过 Q1 我们知道，可以使用标记类型为 ty 的参数作为数据类型，如 u8、u16 等。我们接着改下上面的代码，使得该宏在添加数字之前，将其转换为特定类型。

```rs
macro_rules! add_as {
    // ty 表示参数类型
    ($a:expr,$b:expr,$typ:ty) => {
        $a as $typ + $b as $typ
    };
}

fn main() {
		// 这里 add! 宏可以使用多种数据类型
    println!("{}", add_as!(0, 2, u8));
		println!("{}", add_as!(0, 2, u16));
}
```

Rust 宏也支持接受非固定数量的参数。操作符与正则表达式非常相似，\*用于零个或多个标记类型，+用于零个或一个参数。

```rs
macro_rules! add{
    // 匹配单个参数
    ($a:expr)=>{
       $a
    };
   // 匹配 2 个参数
    ($a:expr,$b:expr)=>{
       {
           $a+$b
       }
    };
   // 递归调用
    ($a:expr,$($b:tt)*)=>{
        {
            $a+add!($($b)*)
        }
    }
}

fn main() {
    println!("{}", add!(1, 2, 3, 4));
}
```

重复的标记类型包含在$() 中，后面跟着一个*或+，表示该标记将重复的次数。$($b:tt)*表示 tt 类型的参数$b，可以重复 0~N 次，而 add!($($b)\*) 则表示多个$b会递归调用 add! 宏，因此也就实现了非固定数量的参数调用。

学习目标：鉴于宏的使用场景大于开发场景，因此本节目标并不要求掌握宏的完整开发流程，了解过程宏的实现原理即可。上一节我们学习了声明式宏，本节我们继续学习过程宏中的派生宏。

派生宏（Derive Macros）：通常用于为 struct 结构体、enum 枚举、union 类型实现 Trait 特征（见 4.5 节 Trait 特征）。使用时通过#[derive(CustomMacro)]这样的语法，允许用户轻松地为自定义类型提供一些通用的实现。前文提到三种过程宏 (派生宏、属性宏、函数宏)，它们的工作方式都是类似的：使用 Rust 的源代码作为输入参数，基于代码进行一系列操作后，再输出一段全新的代码。

一个过程宏的简单框架如下：

```rs
use proc_macro::TokenStream;

// 标记类宏的类型
#[proc_macro_derive(CustomMacro)]
pub fn custom_macro_derive(input: TokenStream) -> TokenStream {
    TokenStream::new()
}
```

proc_macro_derive 稍微特殊一些，因为它需要一个额外的标识符，此标识符将成为 derive 宏的实际名称，如 CustomMacro、Clone、Copy 等。

input 输入标记流是添加了 derive 属性的类型，它将始终是 enum、struct 或者 union 类型，因为只有这些类型才可以使用 derive 派生宏。

需要说明的是，过程宏中的派生宏输出的代码并不会替换之前的代码，而是在原来代码基础上追加指定宏的 Trait 实现

下面的代码我们定义了一个 Foo 结构体，通常情况下 struct 有许多 Trait 要实现。这里使用了 2 种方式，一种是常规的 impl，另一种是使用宏

```rs
struct Foo { x: i32, y: i32 }

// 方式一
impl Copy for Foo { ... }
impl Clone for Foo { ... }
impl Ord for Foo { ... }
impl PartialOrd for Foo { ... }
impl Eq for Foo { ... }
impl PartialEq for Foo { ... }
impl Debug for Foo { ... }
impl Hash for Foo { ... }

// 方式二
#[derive(Copy, Clone, Ord, PartialOrd, Eq, PartialEq, Debug, Hash, Default)]
struct Foo { x: i32, y: i32 }
```

这种情况下显然通过 derive 宏更加方便。但以上两种方式并没有孰优孰劣，主要在于不同的类型是否可以使用同样的默认特征实现，如果可以，那过程宏的方式可以帮我们减少很多代码实现。

派生宏的实现原理是什么？

我们以 HelloMacro 这个 Trait 特征为例，这里有 MyStruct 和 YourStruct 这 2 个结构体实现了 Trait 特征的 hello_macro() 函数，并打印出对应的结构体的名称。

```rs
// 这是一个通用的 Trait 特征
trait HelloMacro {
	fn hello_macro();
}

// 自定义结构体 MyStruct，并实现如上特征
struct MyStruct;
impl HelloMacro for MyStruct {
	fn hello_macro() {
		println!("Hello, Macro! My name is MyStruct!");
	}
}

// 自定义结构体 YourStruct，并实现如上特征
struct YourStruct;
impl HelloMacro for YourStruct {
	fn hello_macro() {
		println!("Hello, Macro! My name is YourStruct!");
	}
}

fn main() {
	MyStruct::hello_macro();
	YourStruct::hello_macro();
}
```

这个 HelloMacro 特征可以对任意结构体使用，并且在打印日志中自动替换成结构体的名称，因此把它定义为宏是比较合适的。按照过程宏定义的模板，我们实现如下的代码：

```rs
// 引入宏相关的依赖
extern crate proc_macro;
use proc_macro::TokenStream;
use quote::quote;
use syn;
use syn::DeriveInput;

// HelloMacro 宏的实现逻辑
#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
	let ast:DeriveInput = syn::parse(input).unwrap();
	impl_hello_macro(&ast)
}
```

前几行代码引入了 macro 相关的依赖：Rust 的 quote 和 syn 库，其中 syn 库用于解析 Rust 代码的 AST（抽象语法树），而 quote 库用于生成 Rust 代码。

主体函数首先使用 syn::parse 函数解析输入的 TokenStream，并将其转换为 DeriveInput 类型的 ast。然后，它调用 impl_hello_macro 函数，将 ast 作为参数传递给它，生成实现 HelloMacro 特征的 Rust 代码，并将其转换为 TokenStream，并返回给调用者。因此，当用户使用#[derive(HelloMacro)]标记了他的类型后，Rust 编译器在编译前会调用 hello_macro_derive 函数，生成相应的代码，即宏的展开。

在介绍 impl_hello_macro 函数之前，我们再来回顾下上节提到的 Token 概念，Token 是 Rust 代码的最小单元，它是源代码中的一个元素，代表了语法的一部分。在 Rust 中，Token 可以是关键字、标识符、运算符、符号等。在宏中，我们需要操作和理解这些 Token，以便生成或转换代码。

例如，在 Rust 中，let x = 5;这行代码可以被分解为以下 Token：

●`let`: 关键字

●`x`: 标识符

●``=` : 赋值运算符

● `5` : 数字字面量

● `;` : 分号

而 TokenStream 则是由一系列 Token 组成的序列，它是在宏展开期间传递和操作的数据类型。它表示一段被解析和处理过的代码。TokenStream 可以包含多个 Token，它们组成了一个代码片段。在宏中，通常会接收一个 TokenStream 作为输入，对其中的 Token 进行处理，然后生成一个新的 TokenStream 作为输出。这种方式允许在编译时进行代码生成或代码转换。再来看一下一个结构体由哪些部分组成：

```rs
// vis，可视范围   关键字    ident，标识符   generic，范型
pub              struct    User            <T>        {
	// fields: 结构体的字段
	// vis   ident   type
	pub       name:   &T,
}
```

● `pub` : 可视范围，在宏中通过 vis 来表示，表示标识符、模块、结构体等的访问权限。

● `struct` : 关键字 keyword，例如 fn、struct、if 等。

● `User`: 标识符 ident，例如变量名、函数名等。

● `<T>`：范型 generic

● `fields`：结构体字段的集合

● `T`：在 pub name: &T 中表示 ident 的 type 类型，代码中的类型标识符，例如 i32、String 等。

syn::parse 调用会返回一个 DeriveInput 结构体来代表解析后的 Rust 代码，后续逻辑我们就是在此基础上调整相应的 Rust 代码，这里大家也许更容易理解为什么说宏是一种元编程了：编写 Rust 代码的代码。

```rs
DeriveInput {
	// --snip--
	vis: Visibility,
	ident: Ident {
		ident: "MyStruct",
		span: #0 bytes(95..103)
	},
	generics: Generics,

	// Data 是一个枚举，分别是 DataStruct，DataEnum，DataUnion，这里以 DataStruct 为例
	data: Data(
		DataStruct {
			struct_token: Struct,
			fields: Fields,
			semi_token: Some(
				Semi
			)
		}
	)
}
```

接下来看下如何构建特征实现的代码，也是过程宏的具体实现逻辑：

```rs
fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {

    let name = &ast.ident;
    let gen = quote! {
				// 实现 HelloMacro 特征
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

首先，将结构体的名称赋予给 name，也就是 name 中会包含一个字段，它的值是字符串 MyStruct。

其次，使用 quote! 可以定义我们想要返回的 Rust 代码。由于编译器需要的内容和 quote! 直接返回的不一样，因此还需要使用.into 方法其转换为 TokenStream。

特征的 hell_macro() 函数只有一个功能，就是使用 println! 打印一行欢迎语句，使用 stringify! 获取#name 的字面值形式。有了这个宏，我们就可以直接用它来标记结构体

```rs
#[derive(HelloMacro)]
struct MyStruct;
```

如上就是过程宏定义的细节，完整的代码见右侧 Example。

在前几节的基础上，我们继续学习属性式宏和函数式宏。

说明：也有人将其称为 类属性宏 和 类函数宏，但这里提到的“类”并不是面向对象编程中的 class，而是 like，类似于的意思，因此这种叫法很容易让人混淆，翻译成“属性式”和“函数式”则更加贴切。

属性式宏（attribute-like macro）：定义了可添加到标记对象的新外部属性。这种宏通过#[attr]或#[attr(…)]方式调用，其中…是标记的具体属性（可选）。一个属性式宏定义的简单框架如下所示：

```rs
use proc_macro::TokenStream;

// 这里标记宏的类型
#[proc_macro_attribute]
pub fn custom_attribute(input: TokenStream, annotated_item: TokenStream) -> TokenStream {
    annotated_item
}
```

这里需要注意的是，与派生宏、函数式宏不同，属性式宏有两个输入参数，而不是一个。

● 第一个参数是属性名称后面的带分隔符的标记项（即#[attr(…)]中 (…) 的具体内容）。如果只有属性名称（其后不带标记项，比如 #[attr]），则这个参数的值为空。

● 第二个参数是标记的代码项本身的 Token 流，它可以是被标记的字段、结构体、函数等（见真实用例）。

如下的代码展示了一些常见的属性式宏：#[cfg(…)]是根据条件编译的属性宏、#[test]是用于标记测试函数的属性宏、#[allow(...)]和 #[warn(...)]控制编译器的警告级别。

```rs
// 用于根据条件选择性地包含或排除代码
#[cfg(feature = "some_feature")]
fn conditional_function() {
    // 仅在特定特性启用时才编译此函数
}

#[test]
fn my_test() {
    // 测试函数
}

#[allow(unused_variables)]
fn unused_variable() {
    // 允许未使用的变量
}
```

什么是函数式宏（function-like macro）？

函数式宏采用 proc_macro! 关键字定义，通过 custom_fn_macro!(…) 的方式来调用。但不同于声明式宏使用模式匹配的方式，函数宏则更像是常规的函数调用，可以使用各种 Rust 语法，包括条件语句、循环、模式匹配等，使得它更加灵活和强大。

函数式的定义简单编写框架如下所示：

```rs
use proc_macro::TokenStream;

// 这里标记宏的类型
#[proc_macro]
pub fn custom_fn_macro(input: TokenStream) -> TokenStream {
    input
}
```

可以看到，这实际上只是从一个 TokenStream 到另一个 TokenStream 的映射，其中 input 是调用分隔符内的标记项。

例如，对于示例调用 foo!(bar)，input 输入标记流即为 bar。返回的标记流将替换宏调用。

右侧我们展示了 Rust 中常见的函数式宏，以及 Solana 中 anchor 框架的 declare_id! 宏

项目结构：

module：用于组织和封装代码的单元。它可以包含函数、结构体、枚举、常量、Trait 等，也可以包含其他模块。通过使用 mod 关键字可以在 Rust 中创建模块，并且模块可以嵌套形成模块树。

crate：是 Rust 中的编译单元，可以是库 crate 或二进制 crate（它们的区别参见 FAQ）。一个 crate 可以包含一个或多个模块。

package：是一个包含一个或多个相关 crate 的项目工程。它由一个 Cargo.toml 文件定义，该文件包含有关项目的元信息、依赖关系以及其他配置选项。一个 package 可能包含一个主 crate（通常是可执行文件）和零个或多个库 crate（通常是依赖 crate）。

下面的代码分别展示了模块（module）的定义。

```rs
// mod 定义一个模块，后面跟着模块名（my_module）
mod my_module {
    // 模块的内容
    pub fn my_function() {
        // 函数体
    }
}
```

请详细介绍 Rust 中 库 crate 和二进制 crate 的概念？

库 crate 和二进制 crate 是两种不同类型的 Rust 项目。它们分别用于构建库（用于被其他程序引用）和可执行程序。我们分别看下它们的概念及区别：

库 crate：是一种 Rust 项目，通过 cargo new --lib 库名来创建，它的主要目的是提供可供其他程序引用的功能性代码。库 crate 的代码通常是一些通用的、可复用的功能。

组织方式：一个库 crate 的代码通常位于一个名为 lib.rs 的文件中，该文件包含 crate 的主模块。库 crate 的代码可以由其他 crate 引用，通过在 Cargo.toml 文件中添加相应的依赖。

二进制 crate：也是一种 Rust 项目，通过 cargo new 项目名来创建，它的主要目的是构建可执行程序。这个 crate 可以包含多个模块，其中一个模块被指定为主入口点，例如 main.rs 文件。二进制 crate 的代码用于创建独立的可执行文件。

组织方式：一个二进制 crate 的代码通常包含在一个名为 main.rs 的文件中，该文件包含程序的主函数 main()。

总的来说，库 crate，用于构建可供其他程序引用的功能性代码；代码通常位于 lib.rs 文件中；可以被其他 crate 引用作为依赖。而二进制 crate，用于构建可执行程序；代码通常位于 main.rs 文件中；产生一个独立的可执行文件。

注意：在一个 Rust 项目中，你可以同时包含库 crate 和二进制 crate。例如，一个项目可能包含一个库用于提供通用功能，同时也包含一个可执行程序用于演示或测试该库。在这种情况下，项目的目录结构通常包含 src/lib.rs 和 src/main.rs。
