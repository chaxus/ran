# tsup

库打包的工具，并且内置 esbuild 进行提速，性能上更加强悍，因此使用 tsup 进行项目的构建。

# cac

用于构建cli命令行的工具

# esbuild

[esbuild官网](https://esbuild.github.io/getting-started/)

Esbuild 对外暴露了一系列的 API，主要包括两类: Build API和Transform API，我们可以在 Nodejs 代码中通过调用这些 API 来使用 Esbuild 的各种功能。

## Build API

Build API主要用来进行项目打包，包括build、buildSync和serve三个方法。

首先我们来试着在 Node.js 中使用build 方法。你可以在项目根目录新建build.js文件，内容如下:

```js
const { build, buildSync, serve } = require("esbuild");

async function runBuild() {
  // 异步方法，返回一个 Promise
  const result = await build({
    // ----  如下是一些常见的配置  --- 
    // 当前项目根目录
    absWorkingDir: process.cwd(),
    // 入口文件列表，为一个数组
    entryPoints: ["./src/index.jsx"],
    // 打包产物目录
    outdir: "dist",
    // 是否需要打包，一般设为 true
    bundle: true,
    // 模块格式，包括`esm`、`commonjs`和`iife`
    format: "esm",
    // 需要排除打包的依赖列表
    external: [],
    // 是否开启自动拆包
    splitting: true,
    // 是否生成 SourceMap 文件
    sourcemap: true,
    // 是否生成打包的元信息文件
    metafile: true,
    // 是否进行代码压缩
    minify: false,
    // 是否开启 watch 模式，在 watch 模式下代码变动则会触发重新打包
    watch: false,
    // 是否将产物写入磁盘
    write: true,
    // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
    // 针对一些特殊的文件，调用不同的 loader 进行加载
    loader: {
      '.png': 'base64',
    }
  });
  console.log(result);
}

runBuild();
```

随后，你在命令行执行node build.js，就能在控制台发现如下日志信息:

## Transform API

除了项目的打包功能之后，Esbuild 还专门提供了单文件编译的能力，即Transform API，与 Build API 类似，它也包含了同步和异步的两个方法，分别是transformSync和transform。下面，我们具体使用下这些方法。

首先，在项目根目录新建transform.js，内容如下:

## Esbuild 插件开发


# es-module-lexer

官方说明：[es-module-lexer](https://www.npmjs.com/package/es-module-lexer)

es-module-lexer 是一个可以对 ES Module 语句进行词法分析的工具包。