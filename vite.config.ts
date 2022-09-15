import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    minify: false,
    rollupOptions:{
      input:'views/index.html'
    },
    lib: {
        entry: "./src/entry.ts",
        name: "RanUI",
        fileName: "ran-ui",
        // 导出模块格式
        formats: ["es", "umd","iife"],
      },
  },
  resolve: {
    alias: {
      "@/client": resolve(__dirname, "client"),
      "@/assets": resolve(__dirname, "client/assets"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    preprocessorOptions: {
      less:{
        javascriptEnabled: true,
        additionalData: `@import "client/assets/base.css";`
      }
    },
    modules: {
      generateScopedName: "[name--[local]--[hash:base64:5]]",
    },
  },
});
