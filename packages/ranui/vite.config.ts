import { defineConfig } from "vite";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import dts from 'vite-plugin-dts'
import loadStyle from './plugins/load-style'
import componentsIndex from './plugins/components-index'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "ranui",
      fileName: "index",
      formats: ["es", "umd"],
    },
  },
  plugins: [
    dts({
      tsConfigFilePath: './tsconfig.json'
    }),
    loadStyle({
      ignore:['ranui/components/modal/index.ts']
    }),
    componentsIndex({
      path:[
        './components',
        // resolve(__dirname, "components/")
      ]
    })
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, "components/"),
      '@/assets': resolve(__dirname, "assets/"),
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
