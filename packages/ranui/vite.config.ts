import { defineConfig } from "vite";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import dts from 'vite-plugin-dts'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true, // 输出单独 source文件
    lib: {
      entry: "./index.ts",
      name: "ranui",
      fileName: "index",
      // 导出模块格式
      formats: ["es", "umd"],
    },
  },
  plugins: [
    dts({
      //指定使用的tsconfig.json为我们整个项目根目录下掉,如果不配置,你也可以在components下新建tsconfig.json
      tsConfigFilePath: '../../tsconfig.json'
    }),
  ],
  resolve: {
    alias: {
      "@/assets": resolve(__dirname, "client/assets"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "client/assets/base.css";`
      }
    },
    modules: {
      generateScopedName: "[name--[local]--[hash:base64:5]]",
    },
  },
});
