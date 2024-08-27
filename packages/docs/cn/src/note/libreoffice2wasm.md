## 项目地址：

```sh
git clone https://git.libreoffice.org/core
```

github 地址：`https://github.com/LibreOffice/core/blob/master/static/README.wasm.md`

## 容器化环境

由于是 `c/c++` 的项目，编译过程需要很多系统级别配置。如果当前设备不支持的话，不建议强行去适配。可以进行容器化处理。

比如用一个最常见的服务器系统：

```sh
docker image pull ubuntu
```

下载完成后，就可以去构建一个服务了：

```sh
docker container run -p 30105:30105 --name=alit -itd ubuntu /bin/bash
```

构建并启动成功后，可以通过`docker container ls`去查看运行情况：

```sh
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS         PORTS                      NAMES
efd831ab0ba8   ubuntu    "/bin/bash"   5 seconds ago   Up 4 seconds   0.0.0.0:30105->30105/tcp   alit
```

再将项目移动到容器中：

```sh
docker cp ./core alit:/home
# 总的来说，项目还是非常大的
# Successfully copied 3.59GB to alit:/home
```

进入容器，进行操作。

```sh
docker exec -it alit /bin/bash
```

这样，就可以把开发构建环境和电脑系统隔离开，防止一些系统级别不安全的操作了。

## 安装必要的依赖：

````sh
dnf install -y git cmake python3 nodejs

## 遇到问题：

1. 执行 `./autogen.sh`报错，提示`Failed to run aclocal at ./autogen.sh line 195.`

```sh
brew install automake
````

安装完成后，执行`aclocal --version`或者`automake --version`检查是否安装完成

2. 执行 `./autogen.sh`遇到报错：

```sh
checking the GNU Make version... configure: error: failed (/usr/bin/make version >= 4.0 needed)
Error running configure at ./autogen.sh line 323.
```

通过 `make --version` 检查 make 的版本，执行 `brew install make`，再执行 `brew upgrade` 进行升级。确保 `make`的版本大于 `4.0`

当使用 `brew` 安装 `GNU Make` 时，它通常会被命名为 `gmake` 而不是 `make` ，以区分于 `macOS` 系统自带的 `BSD Make`。如果你希望在使用 `make` 命令时实际上调用 `gmake` ，需要进行一些特殊处理来替换或设置别名。

在.zshrc 文件中添加如下行：

```sh
# Configure the brew installation of gmake, alias to make
alias make='gmake'
```

然后，保存文件并重新加载配置文件（通过 `source ~/.zshrc` 或重新打开终端）。

在项目中搜索并替换成：

```sh
# args.makecmd = '/usr/bin/make'
args.makecmd = '/opt/homebrew/bin/gmake'
```

在编译完成后，找到可执行的文件：

```sh
find . -name soffice
```
然后执行
```sh
/home/core/instdir/program/soffice --headless --convert-to pdf /home/office/pptx.pptx
```

将 LibreOffice 编译成 WebAssembly 并在 Web 上运行特定命令（如 soffice --headless --convert-to pdf /home/office/pptx.pptx）是一个复杂的任务。以下是一个大致的实现步骤和思路：

1. 编译 LibreOffice 为 WebAssembly
假设你已经成功编译了 LibreOffice 并生成了 .wasm 文件和相关的 JavaScript 文件。

2. 创建 HTML 和 JavaScript 文件
创建一个 HTML 文件来加载 WebAssembly 模块，并编写 JavaScript 代码来调用 soffice 命令。

HTML 文件 (index.html)

```html
<!DOCTYPE html>
<html>
<head>
    <title>LibreOffice WebAssembly</title>
    <script src="libreoffice.js"></script>
</head>
<body>
    <input type="file" id="fileInput" />
    <button onclick="convertToPDF()">Convert to PDF</button>
    <script src="main.js"></script>
</body>
</html>
JavaScript 文件 (main.js)
// Initialize the Module
var Module = {
    onRuntimeInitialized: function() {
        console.log("LibreOffice WebAssembly Module Loaded");
    }
};

// Function to convert file to PDF
function convertToPDF() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length == 0) {
        alert("Please select a file.");
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var arrayBuffer = event.target.result;
        var byteArray = new Uint8Array(arrayBuffer);

        // Write the file to the WASM virtual file system
        var filename = '/home/office/' + file.name;
        Module.FS_createDataFile('/', filename, byteArray, true, true);

        // Call the soffice command
        var command = 'soffice --headless --convert-to pdf ' + filename;
        Module.ccall(
            'system', // name of C function
            'number', // return type
            ['string'], // argument types
            [command] // arguments
        );

        // Read the output PDF file
        var outputFilename = '/home/office/' + file.name.replace(/\.[^/.]+$/, "") + '.pdf';
        var output = Module.FS_readFile(outputFilename);

        // Create a blob and a link to download the PDF
        var blob = new Blob([output], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.name.replace(/\.[^/.]+$/, "") + '.pdf';
        link.click();
    };

    reader.readAsArrayBuffer(file);
}
```
3. 部署和测试
将生成的 .wasm 文件、JavaScript 文件和 HTML 文件部署到你的 Web 服务器上，打开 index.html 文件，选择一个 PPTX 文件并点击“Convert to PDF”按钮。这个过程会：

从文件输入中读取 PPTX 文件。
将文件写入 WebAssembly 模块的虚拟文件系统。
调用 soffice --headless --convert-to pdf 命令进行转换。
从虚拟文件系统中读取生成的 PDF 文件。
创建一个下载链接，允许用户下载生成的 PDF 文件。
4. 注意事项
这个过程可能需要大量的内存和计算资源，可能需要优化和调整。
需要确保 Emscripten 的文件系统（MEMFS）能够正确处理大文件。
需要处理可能的错误和异常情况，并提供用户友好的错误提示。
通过这些步骤，你应该能够在 Web 上调用 soffice 命令并将 PPTX 文件转换为 PDF。如果遇到具体问题，请提供详细的错误信息，以便更好地帮助你解决问题。










减少 WebAssembly 文件的体积是一个常见的需求，尤其是在处理像 LibreOffice 这样的大型项目时。如果你只需要特定的功能（如将文件转换为 PDF），可以采取以下几种方法来减小生成的 WebAssembly 文件的体积：

1. 精简功能模块
确保只编译你需要的功能模块。你已经在 autogen.input 中指定了 --with-main-module=writer，这会限制编译的模块，但你可以进一步精简。

2. 移除不必要的组件
在 autogen.input 中，进一步禁用不必要的组件和功能。例如：

--disable-dbus
--disable-xmlsec
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-collada
--disable-gltf
--disable-wmf
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-systray
--disable-mozilla
--disable-odk
--disable-pch
--disable-skia
--disable-scripting
3. 使用 Emscripten 优化选项
Emscripten 提供了多种优化选项，可以帮助减小生成的 WebAssembly 文件的体积：

使用 -O3 或 -Oz 进行最大化优化。
使用 --closure 1 进行 JavaScript 代码的闭包优化。
使用 --llvm-lto 3 进行链接时间优化。
在编译时，确保使用这些选项：

emconfigure ./configure ...
emmake make CXXFLAGS="-O3 --llvm-lto 3" LDFLAGS="-O3 --llvm-lto 3"
4. 移除调试信息
确保移除所有调试信息，这可以显著减小文件体积：

emconfigure ./configure ...
emmake make CXXFLAGS="-O3 --llvm-lto 3 -g0" LDFLAGS="-O3 --llvm-lto 3 -g0"
5. 使用 WebAssembly Minifier
使用 WebAssembly Minifier 工具（如 wasm-opt）进一步优化和减小生成的 WebAssembly 文件：

wasm-opt -Oz -o optimized.wasm original.wasm
6. 自定义构建脚本
如果上述方法仍然不能满足需求，可以考虑编写自定义构建脚本，只包含必要的源文件和库，进一步精简生成的 WebAssembly 文件。

7. 动态加载模块
如果可能，将一些功能模块拆分为单独的 WebAssembly 文件，并在需要时动态加载，以减少初始加载的体积。

示例 autogen.input
以下是一个示例 autogen.input 文件，结合了上述建议：

```sh
--disable-debug
--enable-sal-log
--disable-crashdump
--host=wasm32-local-emscripten
--disable-gui
--with-main-module=writer
--with-package-format=emscripten
--disable-dbus
--disable-xmlsec
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-collada
--disable-gltf
--disable-wmf
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-systray
--disable-mozilla
--disable-odk
--disable-pch
--disable-skia
--disable-scripting
```

通过这些步骤，你应该能够显著减小生成的 WebAssembly 文件的体积，同时保留将文件转换为 PDF 的功能。如果遇到具体问题，请提供详细的错误信息，以便更好地帮助你解决问题。






wasm-opt 是 Binaryen 项目的一部分，它是一个用于优化和处理 WebAssembly 二进制文件的工具。你可以在 Ubuntu 上通过以下步骤安装和使用 wasm-opt：

1. 安装依赖项
首先，确保你的系统上已经安装了必要的依赖项：

sudo apt update
sudo apt install cmake build-essential git
2. 下载和编译 Binaryen
接下来，从源码编译 Binaryen：

# 克隆 Binaryen 仓库
git clone https://github.com/WebAssembly/binaryen.git
cd binaryen

# 创建并进入构建目录
mkdir build
cd build

# 使用 CMake 配置构建
cmake ..

# 编译 Binaryen
make

# 安装 Binaryen
sudo make install
3. 使用 wasm-opt
安装完成后，你可以使用 wasm-opt 命令来优化 WebAssembly 文件。例如：

# 假设你有一个名为 original.wasm 的 WebAssembly 文件
wasm-opt -Oz -o optimized.wasm original.wasm
在这个命令中：

-Oz 表示进行最大化的尺寸优化。
-o optimized.wasm 指定输出文件名为 optimized.wasm。
original.wasm 是输入的 WebAssembly 文件。
4. 验证安装
你可以通过运行以下命令来验证 wasm-opt 是否正确安装：

wasm-opt --version
这将输出 wasm-opt 的版本信息，确认它已成功安装并可以使用。

示例
假设你有一个名为 example.wasm 的 WebAssembly 文件，你可以通过以下命令优化它：

wasm-opt -Oz -o example_optimized.wasm example.wasm
这将生成一个优化后的 WebAssembly 文件 example_optimized.wasm，其体积通常会显著减小。

通过这些步骤，你应该能够在 Ubuntu 上成功安装和使用 wasm-opt 来优化你的 WebAssembly 文件。如果在安装或使用过程中遇到任何问题，请提供详细的错误信息，以便进一步帮助你解决问题。






--disable-debug
--enable-sal-log
--disable-crashdump
--host=wasm32-local-emscripten
--disable-gui
--with-main-module=writer
--with-package-format=emscripten
--disable-dbus
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-odk
--disable-pch
--disable-skia
--disable-scripting


步骤 1：下载最新的 OpenSSL 源代码
首先，确保你在一个干净的目录中，然后下载最新版本的 OpenSSL 源代码。你可以访问 OpenSSL 官方网站 查看最新版本。假设最新版本是 openssl-3.0.9：

wget https://www.openssl.org/source/openssl-3.0.9.tar.gz
tar -xzvf openssl-3.0.9.tar.gz
cd openssl-3.0.9
步骤 2：编译和安装 OpenSSL
接下来，编译并安装 OpenSSL：

./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib
make
make test
make install
步骤 3：确认 OpenSSL 安装路径
确保 OpenSSL 的头文件和库文件已正确安装：

ls /usr/local/ssl/include
ls /usr/local/ssl/lib
步骤 4：设置环境变量
设置正确的环境变量，以便编译时能找到 OpenSSL：

export PKG_CONFIG_PATH="/usr/local/ssl/lib/pkgconfig"
export CFLAGS="-I/usr/local/ssl/include"
export LDFLAGS="-L/usr/local/ssl/lib -lssl -lcrypto"
步骤 5：清理之前的配置
在重新运行 configure 脚本之前，清理之前的配置：

make clean
步骤 6：重新运行 configure 脚本
重新运行 configure 脚本，以确保它能找到新的 OpenSSL 版本：

emconfigure ./configure --disable-debug --enable-sal-log --disable-crashdump --host=wasm32-local-emscripten --disable-gui --with-main-module=writer --with-package-format=emscripten --disable-dbus --disable-odk --disable-postgresql-sdbc --disable-firebird-sdbc --disable-coinmp --disable-cve-tests --disable-gtk3 --disable-gstreamer-1-0 --disable-kf5 --disable-scripting-beanshell --disable-scripting-javascript --disable-extensions --disable-epm --disable-online-update --disable-python --disable-pdfimport --disable-lpsolve --disable-sdremote --disable-scripting --disable-avmedia --disable-coinmp --disable-report-builder --disable-odk --disable-pch --disable-skia --disable-scripting --srcdir=/home/core --enable-option-checking=fatal
步骤 7：检查 config.log
如果配置仍然失败，请检查 config.log 文件以获取更多详细信息：

cat config.log | grep openssl
通过确保 OpenSSL 已正确安装并设置正确的环境变量，我们应该能够解决配置过程中遇到的问题。如果问题仍然存在，请提供 config.log 文件中与 OpenSSL 相关的更多详细信息，以便进一步诊断和解决问题。


emconfigure ./configure --disable-debug --enable-sal-log --disable-crashdump --host=wasm32-local-emscripten --disable-gui --with-main-module=writer --with-package-format=emscripten --disable-dbus --disable-odk --disable-postgresql-sdbc --disable-firebird-sdbc --disable-coinmp --disable-cve-tests --disable-gtk3 --disable-gstreamer-1-0 --disable-kf5 --disable-scripting-beanshell --disable-scripting-javascript --disable-extensions --disable-epm --disable-online-update --disable-python --disable-pdfimport --disable-lpsolve --disable-sdremote --disable-scripting --disable-avmedia --disable-coinmp --disable-report-builder --disable-odk --disable-pch --disable-skia --disable-scripting --srcdir=/home/core --enable-option-checking=fatal


emmake make CXXFLAGS="-I/usr/local/ssl/include -O3 -g0 -msimd128" LDFLAGS="-L/usr/local/ssl/lib -lssl -lcrypto -O3 -g0"
