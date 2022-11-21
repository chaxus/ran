import { defineConfig } from "vite";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import dts from 'vite-plugin-dts'

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true, // 输出单独 source文件
    rollupOptions: {
      inlineDynamicImports: true,
    },
    lib: {
      entry: "./index.ts",
      name: "ranuts",
      fileName: "index",
      // 导出模块格式
      formats: ["es", "umd"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [
    dts(),
  ],
  server:{
    fs: {
      strict: false,
      allow: [],
    },
  }
});
