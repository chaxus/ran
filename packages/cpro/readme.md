# C++

如果要为 macOS 进行 C++ 开发，建议安装 Clang 编译器。只需在“终端”窗口 (Ctrl+Shift+ `) 中运行以下命令即可安装命令行开发人员工具：
```sh
xcode-select --install
```
然后，要验证已安装 clang，请在“终端”窗口中运行以下命令。你应该会看到一条消息，其中包含有关所使用的 Clang 版本的信息。
```sh
clang --version
```

```c++

#include<iostream>

using namespace std;

int main(){
    cout << "Hello~" << endl;
    return 0;
}

```

命令行执行：

```sh
clang++ main.cpp
# if meet some error like this: error: non-aggregate type 'vector<int>' cannot be initialized with an initializer list
# g++ -std=c++11
./a.out
```

# WebAssembly

官网：<https://emscripten.org/>

Mac 安装 `Emscripten`

```sh
brew install emscripten
```

安装完成后测试是否存在

```sh
emcc -v
```

编译 `C++` 代码

```sh
emcc main.cpp
```

命令成功执行后，你会发现 `main.cpp` 同级目录下会生成两个文件：`a.out.wasm` 和 `a.out.js`。其中，`a.out.wasm` 就是我们想要的 `Wasm` 模块。

```sh
node a.out.js
```

`Node.js` 是支持 `Wasm` 模块的（自 `Node.js 8` 开始）。

如果你希望到浏览器环境下测试文件，那么你可以在命令行下使用如下指令编译我们的 `C++` 代码：

```sh
emcc main.cpp -o main.html
```

命令成功执行后，`main.cpp` 同级目录下会再多出三个文件：`main.wasm`、`main.js` 和 `main.html`。你可以用`Live Server`打开 `main.html` 文件，就能看到结果了：

![](./assets//images/emsc-web-preview.jpg)

## 调试 WebAssembly

我们可以在编译 `WebAssembly` 的时候加入 `-v` 参数来让 `Emscripten` 为我们输出更多编译信息，以辅助我们发现 `C++` 代码中的问题。

如果你想在运行期调试 `WebAssembly` 的代码，那么你需要使用如下指令重新编译 `WebAssembly` 模块以让你的 `.wasm` 文件包含调试信息：

```sh
emcc -g main.cpp -o main.html
```

默认情况下 `Emscripten` 编译 `WebAssembly` 模块时会为我们优化掉大部分调试信息，添加 `-g` 指令后，`Emscripten` 将不再为我们优化调试信息。

接着你需要为你的谷歌浏览器安装一个插件 [`C/C++ DevTools Support (DWARF)`](https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb) ，这是 `Chrome DevTools` 开发团队为开发者提供的专门用于调试 `WebAssembly` 的浏览器插件，注意安装过程中要保持良好的网络环境。

![](./assets/images/emsc-chrome-tools.jpg)

安装完成后，打开 `Chrome` 浏览器的调试工具 `DevTools`，点击设置按钮（⚙），打开调试工具的设置面板，勾选实验选项卡下的 `WebAssembly Debugging: Enable DWARF support` 选项。

![](./assets/images/emsc-chrome-setting.jpg)

接着退回到 `DevTools` 主面板，把你的源码路径添加到 `DevTools` 的文件系统中，然后在 `main.cpp` 中下一个断点，刷新 `main.html` 页面，你会发现刚刚下的断点已经命中了，而且调用堆栈也会显示在 `DevTools` 右侧的面板中，如下图所示：

![](./assets/images/emsc-chrome-debug.jpg)

## C++ 与 JS 的交互

### ccall

如果需要调用一个在 C 语言自定义的函数，你可以使用 Emscripten 中的 ccall() 函数，以及 EMSCRIPTEN_KEEPALIVE 声明

默认情况下，Emscripten 生成的代码只会调用 main() 函数，其他的函数将被视为无用代码。在一个函数名之前添加 EMSCRIPTEN_KEEPALIVE 能够防止这样的事情发生。你需要导入 emscripten.h 库来使用 EMSCRIPTEN_KEEPALIVE。

```html
<button id="wasm">运行自定义函数</button>

<script type='text/javascript'>
    document.getElementById("wasm").addEventListener("click", function () {
      alert("检查控制台");
      var result = Module.ccall(
        "main", // name of C function
        null, // return type
        null, // argument types
        null,  // arguments
      );
    });
  </script>
```
[](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html)

```sh
emcc -v main.cpp -o main.html -sEXPORTED_FUNCTIONS=_quick_sort,_main -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
```

### cwrap

`cwrap`的方式会更加简单

```html
<button id="wasm">运行自定义函数</button>

<script type='text/javascript'>
    document.getElementById("wasm").addEventListener("click", function () {
      var main = Module.cwrap('main', null, null) // function name, return type, argument type
      main()
    })
  </script>
```


### Embind

https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html?highlight=emscripten_bindings

以下代码使用 EMSCRIPTEN_BINDINGS() 块将简单 C++ lerp() function() 公开给 JavaScript。

```cpp
// quick_example.cpp
#include <emscripten/bind.h>

using namespace emscripten;

float lerp(float a, float b, float t) {
    return (1 - t) * a + t * b;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("lerp", &lerp);
}
```
为了使用 `embin` 编译上面的示例，我们使用 `bind` 选项调用 `emcc：`

```sh
emcc -lembind -o main.js main.cpp
```
生成的`main.js`文件可以作为节点模块或通过 `<script>` 标记加载：

```html
<!doctype html>
<html>
  <script>
    var Module = {
      onRuntimeInitialized: function() {
        console.log('lerp result: ' + Module.lerp(1, 2, 0.5));
      }
    };
  </script>
  <script src="main.js"></script>
</html>
```

绑定代码作为静态构造函数运行，并且仅当链接中包含对象文件时，静态构造函数才会运行，因此在为库文件生成绑定时，必须显式指示编译器包含对象文件。

例如，要为一个假设的库生成绑定.a 编译 Emscripten 运行带有编译器标志的 --whole-archive emcc：

```sh
emcc -lembind -o library.js -Wl,--whole-archive library.a -Wl,--no-whole-archive
```
向 JavaScript 公开类需要更复杂的绑定语句。例如：

```cpp
class MyClass {

public:
  MyClass(int x, std::string y)
    : x(x)
    , y(y)
  {}

  void incrementX() {
    ++x;
  }

  int getX() const { return x; }
  void setX(int x_) { x = x_; }

  static std::string getStringFromInstance(const MyClass& instance) {
    return instance.y;
  }

private:
  int x;
  std::string y;
};

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example) {
  class_<MyClass>("MyClass")
    .constructor<int, std::string>()
    .function("incrementX", &MyClass::incrementX)
    .property("x", &MyClass::getX, &MyClass::setX)
    .class_function("getStringFromInstance", &MyClass::getStringFromInstance)
    ;
}
```

绑定块定义了临时 class_ 对象上的成员函数调用链（在 Boost.Python 中使用了相同的样式）。这些函数注册类、其 constructor() 、成员 function() 、class_function() （静态）和 property() .

然后可以在 JavaScript 中创建和使用 的 MyClass 实例，如下所示：

```js
var instance = new Module.MyClass(10, "hello");
instance.incrementX();
instance.x; // 11
instance.x = 20; // 20
Module.MyClass.getStringFromInstance(instance); // "hello"
instance.delete();
```
为了防止闭包编译器重命名上述示例代码中的符号，需要按如下方式重写：

```js
var instance = new Module["MyClass"](10, "hello");
instance["incrementX"]();
instance["x"]; // 11
instance["x"] = 20; // 20
Module["MyClass"]["getStringFromInstance"](instance); // "hello"
instance.delete();
```
请注意，只有优化程序看到的代码才需要这样做，例如，如 in --pre-js 或 上所述，或在 EM_ASM 或 EM_JS --post-js .对于未通过闭包编译器优化的其他代码，您无需进行此类更改。如果您在构建时没有 --closure 1 启用闭包编译器，则也不需要它。

### clone

在某些情况下，JavaScript 代码库的多个长期部分需要将同一 C++ 对象保留不同的时间。

为了适应该用例，Emscripten 提供了一种引用计数机制，在该机制中，可以为同一底层 C++ 对象生成多个句柄。仅当删除所有句柄时，才会销毁对象。

clone() JavaScript 方法返回一个新的句柄。它最终还必须与 delete() ：

```js
async function myLongRunningProcess(x, milliseconds) {
    // sleep for the specified number of milliseconds
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    x.method();
    x.delete();
}

const y = new Module.MyClass;          // refCount = 1
myLongRunningProcess(y.clone(), 5000); // refCount = 2
myLongRunningProcess(y.clone(), 3000); // refCount = 3
y.delete();                            // refCount = 2

// (after 3000ms) refCount = 1
// (after 5000ms) refCount = 0 -> object is deleted
```

基本类型的手动内存管理很繁重，因此 embind 提供了对值类型的支持。Value arrays 与 JavaScript 数组相互转换，并 value objects 相互转换和从 JavaScript 对象

### 总结

```sh
emcc -lembind -o main.js main.cpp -sEXPORTED_FUNCTIONS=_quick_sort,_main -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
```
