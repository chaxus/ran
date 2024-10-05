#

安装依赖

```sh
# --build=missing 参数来让 Conan 自动从源码构建缺失的包
# --output-folder 指定 conan 安装后的输出目录
conan install .  --build=missing --output-folder=build/conan
```
配置和生成 CMake 构建系统

```sh
# -S : 这个选项指定源代码目录。. 表示当前目录，即包含 CMakeLists.txt 文件的目录。
# -B build:这个选项指定构建目录。build 是你希望 CMake 将生成的构建文件（如 Makefile 或项目文件）放置的目录。如果该目录不存在，CMake 会自动创建它。
# -DCMAKE_TOOLCHAIN_FILE=build/conan/conan_toolchain.cmake: 这个选项告诉 CMake 使用 build/conan/conan_toolchain.cmake 文件作为工具链文件。工具链文件包含了编译器、链接器和其他构建工具的配置，通常是由 Conan 生成的，用于确保你的项目使用正确的依赖和编译设置。
# -DCMAKE_BUILD_TYPE=Release:这个选项设置构建类型为 Release。CMake 支持多种构建类型，如 Debug、Release、RelWithDebInfo 和 MinSizeRel。Release 构建类型通常会启用优化并禁用调试信息，以生成高效的可执行文件。
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan/conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release
```

编译项目

```sh
cd build
cmake --build .
```

通常情况下，CMake 会在 build 目录中生成可执行文件，文件名与你在 CMakeLists.txt 中指定的 add_executable 名字一致。根据你的 CMakeLists.txt，可执行文件名为 image-process
