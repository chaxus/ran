import { Loader, Plugin } from "esbuild";
import { BARE_IMPORT_RE } from "../constants";
// 用来分析 es 模块 import/export 语句的库
import { init, parse } from "es-module-lexer";
// 获取文件的扩展名
import { extname } from "node:path";
// 一个实现了 node 路径解析算法的库
import resolve from "resolve";
// 一个更加好用的文件操作库
import fs from "fs-extra";
// 用来开发打印 debug 日志的库
import createDebug from "debug";

const debug = createDebug("dev");
/**
 * @description: 处理预编译收集到的依赖，将cjs转化为esm，同时将esm规范化
 * @param {Set} deps
 */
export function preBundlePlugin(deps: Set<string>): Plugin {
  return {
    name: "esbuild:pre-bundle",
    setup(build) {
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          // path 模块路径
          // importer 父模块路径
          const { path, importer } = resolveInfo;
          const isEntry = !importer;
          // 命中需要预编译的依赖
          if (deps.has(path)) {
            // 若为入口，则标记 dep 的 namespace
            return isEntry
              ? {
                  path,
                  namespace: "dep",
                }
              : {
                  // 因为走到 onResolve 了，所以这里的 path 就是绝对路径了
                  path: resolve.sync(path, { basedir: process.cwd() }),
                };
          }
        }
      );

      // 拿到标记后的依赖，构造代理模块，交给 esbuild 打包
      build.onLoad(
        {
          filter: /.*/,
          namespace: "dep",
        },
        async (loadInfo) => {
          // es-module-lexer init 初始化
          await init;
          // 模块路径
          const { path } = loadInfo;
          const root = process.cwd();
          const entryPath = resolve.sync(path, { basedir: root });
          const code = await fs.readFile(entryPath, "utf-8");
          // es-module-lexer 进行词法分析
          // imports 和 exports 都是一个数组，其中每个元素（对象）代表一个导入语句的解析后的结果，具体会包含导入或导出的模块的名称、在源代码中的位置等信息。
          const [imports, exports] = await parse(code);
          let proxyModule = [];
          // 如果没有imports分析和exports分析，说明是一个cjs模块，进入cjs模块导入
          if (!imports.length && !exports.length) {
            // 构造代理模块
            // 通过 require 拿到模块的导出对象
            const res = require(entryPath);
            // 用 Object.keys 拿到所有的具名导出
            const specifiers = Object.keys(res);
             // 构造 export 语句交给 Esbuild 打包，将cjs模块转化为esm
            proxyModule.push(
              `export { ${specifiers.join(",")} } from "${entryPath}"`,
              `export default require("${entryPath}")`
            );
          } else {
            // esm 格式比较好处理，export * 或者 export default 即可
            if (exports.toString().includes("default")) {
              proxyModule.push(`import d from "${entryPath}";export default d`);
            }
            proxyModule.push(`export * from "${entryPath}"`);
          }
          debug("代理模块内容: %o", proxyModule.join("\n"));
          // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
          const loader = extname(entryPath).slice(1);
          return {
            // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
            loader: loader as Loader,
            contents: proxyModule.join("\n"),
            resolveDir: root,
          };
        }
      );
    },
  };
}
