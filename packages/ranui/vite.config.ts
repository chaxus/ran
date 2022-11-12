import { defineConfig } from "vite";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import dts from 'vite-plugin-dts'
import loadStyle from './plugins/load-style'
import autoImportFile from './plugins/auto-import-file'
import loadSvg from './plugins/load-svg'


// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

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
    loadStyle({
      ignore: ['ranui/components/modal/index.ts']
    }),
    dts(),
    loadSvg({ svgo: false, defaultImport: 'raw' }),
    autoImportFile({
      output:resolve(__dirname, "components.ts"),
      path: [
        './components',
        // resolve(__dirname, "components/")
      ],
      extensions: [".ts"],
      ignore: ['./components/form/index.ts','./components/modal/index.ts']
    }),
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, "components/"),
      '@/assets': resolve(__dirname, "assets/"),
      '@/utils': resolve(__dirname, "utils/"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  css: {
    preprocessorOptions: {
    less: {
      javascriptEnabled:true,
      additionalData: `@import "./base.less";`
    }
    },
    modules: {
      generateScopedName: "[name--[local]--[hash:base64:5]]",
    },
  },
  server:{
    fs: {
      strict: false,
      allow: [],
    },
  }
});
