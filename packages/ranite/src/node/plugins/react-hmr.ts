import { Plugin } from "../plugin";
import fs from "fs";
import path from "path";
import { isJSRequest } from "../utils";
import { transformAsync } from "@babel/core";

function loadPlugin(path: string): Promise<any> {
  return import(path).then((module) => module.default || module);
}

const RUNTIME_PUBLIC_PATH = "/@react-refresh";

const runtimeFilePath = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "react-refresh/cjs/react-refresh-runtime.development.js"
);

// react refresh 的具体内容
export const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
function debounce(fn, delay) {
  let handle
  return () => {
    clearTimeout(handle)
    handle = setTimeout(fn, delay)
  }
}
exports.performReactRefresh = debounce(exports.performReactRefresh, 16)
export default exports
`;

// 需要注入的全局代码
export const preambleCode = `
import RefreshRuntime from "${RUNTIME_PUBLIC_PATH}"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;

const header = `
import RefreshRuntime from "${RUNTIME_PUBLIC_PATH}";

let prevRefreshReg;
let prevRefreshSig;

if (import.meta.hot) {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/[\n]+/gm, "");

const footer = `
if (import.meta.hot) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
  import.meta.hot.accept();
  if (!window.__vite_plugin_react_timeout) {
    window.__vite_plugin_react_timeout = setTimeout(() => {
      window.__vite_plugin_react_timeout = 0;
      RefreshRuntime.performReactRefresh();
    }, 30);
  }
}`;

export function reactHMRPlugin(): Plugin {
  return {
    name: "m-vite:react-refresh",
    resolveId(id) {
      if (id === RUNTIME_PUBLIC_PATH) {
        return { id };
      }
      return null;
    },
    async load(id) {
      if (id === RUNTIME_PUBLIC_PATH) {
        return runtimeCode.replace(
          "process.env.NODE_ENV",
          JSON.stringify("development")
        );
      }
    },
    async transform(code, id) {
      if (isJSRequest(id) && !id.includes("node_modules")) {
        const reactRefreshPlugin = await loadPlugin("react-refresh/babel");
        const transformedCode = await transformAsync(code, {
          plugins: [reactRefreshPlugin],
        });
        return {
          code:
            header.replace("__SOURCE__", JSON.stringify(id)) +
            transformedCode!.code +
            footer,
        };
      }
      return null;
    },
    transformIndexHtml(raw) {
      return raw.replace(
        /(<head[^>]*>)/i,
        `$1<script type="module">${preambleCode}</script>`
      );
    },
  };
}
