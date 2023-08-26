import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { BuildOptions, UserConfig } from 'vite';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import loadStyle from './plugins/load-style'
import loadSvg from './plugins/load-svg'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

export const umd: BuildOptions = {
  minify: 'terser',
  outDir: resolve(__dirname, 'dist/umd'),
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranui',
    fileName: 'index',
    formats: ['umd'],
  },
}

export const es: BuildOptions = {
  minify: 'terser',
  lib: {
    entry: {
      index: resolve(__dirname, 'index.ts'),
      button: resolve(__dirname, 'components/button/index.ts'),
      icon: resolve(__dirname, 'components/icon/index.ts'),
      image: resolve(__dirname, 'components/image/index.ts'),
      input: resolve(__dirname, 'components/input/index.ts'),
      message: resolve(__dirname, 'components/message/index.ts'),
      preview: resolve(__dirname, 'components/preview/index.ts'),
      skeleton: resolve(__dirname, 'components/skeleton/index.ts'),
      tabpane: resolve(__dirname, 'components/tabpane/index.ts'),
      tab: resolve(__dirname, 'components/tab/index.ts'),
    },
    fileName: (_: string, name: string): string => {
      if (name === 'index') {
        return `${name}.js`
      }
      return `components/${name}/index.js`
    },
    formats: ['es'],
  },
}

export const viteConfig: UserConfig = {
  plugins: [
    loadStyle({
      ignore: ['ranui/components/modal/index.ts'],
    }),
    dts(),
    loadSvg({ svgo: false, defaultImport: 'raw' }),
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
}

export default defineConfig(viteConfig)
