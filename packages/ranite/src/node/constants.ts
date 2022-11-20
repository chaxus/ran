import path from "path";

// 无关的资源进行 external，不让 esbuild 处理，防止 Esbuild 报错
export const EXTERNAL_TYPES = [
  "css",
  "less",
  "sass",
  "scss",
  "styl",
  "stylus",
  "pcss",
  "postcss",
  "vue",
  "svelte",
  "marko",
  "astro",
  "png",
  "jpe?g",
  "gif",
  "svg",
  "ico",
  "webp",
  "avif",
];

export const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/;
// 将bare import的路径视作第三方包，推入 deps 集合中
export const BARE_IMPORT_RE = /^[\w@][^:]/;
export const QEURY_RE = /\?.*$/s;
export const HASH_RE = /#.*$/s;
// 预构建产物默认存放在 node_modules 中的 .m-vite 目录中
export const PRE_BUNDLE_DIR = path.join("node_modules", ".ranite");
export const DEFAULT_EXTERSIONS = [".tsx", ".ts", ".jsx", "js"];
export const HMR_HEADER = "vite-hmr";
export const CLIENT_PUBLIC_PATH = "/@vite/client";
export const HMR_PORT = 24678;
