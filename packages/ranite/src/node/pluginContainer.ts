import type {
  LoadResult,
  PartialResolvedId,
  SourceDescription,
  ResolvedId,
} from './plugin'
import { Plugin } from './plugin'

export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription | null>
}

// 模拟 Rollup 的插件机制
// 实现 Rollup 插件钩子的调度
// 实现插件钩子内部的 Context 上下文对象
export const createPluginContainer = (plugins: Plugin[]): PluginContainer => {
  // 插件上下文对象
  // 使用implements来实现一些类共有方法属性的提取，能够提取类型中的属性。
  // 这里仅实现上下文对象的 resolve 方法，缺少很多RollupPluginContext中的属性
  class Context {
    async resolve(id: string, importer?: string) {
      let out = await pluginContainer.resolveId(id, importer)
      if (typeof out === 'string') out = { id: out }
      return out as ResolvedId | null
    }
  }
  // 插件容器
  const pluginContainer: PluginContainer = {
    /**
     * @description:
     * @param {string} id 文件路径
     * @param {string} importer // 使用id文件路径的父路径
     */
    async resolveId(id: string, importer?: string) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const newId = await plugin.resolveId.call(ctx, id, importer)
          if (newId) {
            id = typeof newId === 'string' ? newId : newId.id
            return { id }
          }
        }
      }
      return null
    },
    /**
     * @description: 加载模块的内容
     * @param {*} id
     * @return {*}
     */
    async load(id) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (plugin.load) {
          const result = await plugin.load.call(ctx, id)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    /**
     * @description: 自定义模块转换
     * @param {*} code
     * @param {*} id
     * @return {*}
     */
    async transform(code, id) {
      const ctx = new Context()
      for (const plugin of plugins) {
        if (plugin.transform) {
          const result = await plugin.transform.call(ctx, code, id)
          if (!result) continue
          if (typeof result === 'string') {
            code = result
          } else if (result.code) {
            code = result.code
          }
        }
      }
      return { code }
    },
  }

  return pluginContainer
}
