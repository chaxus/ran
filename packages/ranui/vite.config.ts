import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
// import viteCompression from 'vite-plugin-compression';
import loadStyle from './plugins/load-style'
// import autoImportFile from './plugins/auto-import-file'
import loadSvg from './plugins/load-svg'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const OUTPUT_FILE_NAME = 'index'

export default defineConfig({
  build: {
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'ranui',
      fileName: OUTPUT_FILE_NAME,
      formats: ['es', 'umd'],
    },
  },
  plugins: [
    loadStyle({
      ignore: ['ranui/components/modal/index.ts'],
    }),
    dts(),
    loadSvg({ svgo: false, defaultImport: 'raw' }),
    // autoImportFile({
    //   output: resolve(__dirname, 'component.ts'),
    //   path: [
    //     './components',
    //     // resolve(__dirname, "components/")
    //   ],
    //   extensions: ['.ts'],
    //   ignore: ['./components/form/index.ts', './components/modal/index.ts', './components/video/index.ts'],
    // }),
    // viteCompression({
    //   deleteOriginFile: true,
    //   threshold: 10240, // 大于10k
    //   // filter: /^index.js$|^index.umd.js$|.+\.d\.ts$/, // 排除入口文件(index.js,index.umd.cjs)和类型文件
    //   // filter: /(^index-.+\.js|json|css|html)$/ // 指定需要压缩的文件类型
    // })
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),
      '@/assets': resolve(__dirname, 'assets/'),
      '@/utils': resolve(__dirname, 'utils/'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "./base.less";`,
      },
    },
    modules: {
      generateScopedName: '[name--[local]--[hash:base64:5]]',
    },
  },
  server: {
    port: 5124,
    fs: {
      strict: false,
      allow: [],
    },
  },
})
