import type { Plugin } from '../plugin'
import { esbuildTransformPlugin } from './esbuild'
import { resolvePlugin } from './resolve'
import { importAnalysisPlugin } from './importAnalysis'
import { cssPlugin } from './css'
import { assetPlugin } from './assets'
import { clientInjectPlugin } from './clientInject'
import { reactHMRPlugin } from './react-hmr'

export function resolvePlugins(): Plugin[] {
  return [
    // clientInject插件最好放到最前面的位置，以免后续插件的 load 钩子干扰客户端脚本的加载。
    clientInjectPlugin(),
    resolvePlugin(),
    esbuildTransformPlugin(),
    reactHMRPlugin(),
    importAnalysisPlugin(),
    cssPlugin(),
    assetPlugin(),
  ]
}
