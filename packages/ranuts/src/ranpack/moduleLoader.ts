import { readFile } from 'node:fs/promises'
import { Module } from './module'
import { defaultResolver } from './utils/resolve'
import type { Bundle } from './bundle'
/**
 * @description: 1.调用 resolveId 方法解析模块路径 2.初始化模块实例即 Module 对象，解析模块 AST 3.递归初始化模块的所有依赖模块
 * @return {*}
 */
export class ModuleLoader {
  bundle: Bundle
  resolveIdsMap: Map<string, string | false> = new Map()
  constructor(bundle: Bundle) {
    this.bundle = bundle
  }
  /**
   * @description: 解析模块逻辑
   * @param {string} id
   * @param {string} importer
   * @return {*}
   */
  resolveId(id: string, importer: string = ''): string | false {
    const cacheKey = id + importer
    if (this.resolveIdsMap.has(cacheKey)) {
      return this.resolveIdsMap.get(cacheKey)!
    }
    const resolved = defaultResolver(id, importer)
    this.resolveIdsMap.set(cacheKey, resolved)
    return resolved
  }
  /**
   * @description: 加载模块内容并解析
   * @return {*}
   */
  async fetchModule(
    id: string,
    importer: string,
    isEntry = false,
    bundle: Bundle = this.bundle,
    loader: ModuleLoader = this,
  ): Promise<Module | null> {
    const path = this.resolveId(id, importer)

    if (path === false) {
      return null
    }
    // 查找缓存
    const existModule = this.bundle.getModuleById(path)
    if (existModule) {
      return existModule
    }
    const code = await readFile(path, { encoding: 'utf-8' })
    // 初始化模块，解析 AST
    const module = new Module({
      path,
      code,
      bundle,
      loader,
      isEntry,
    })
    this.bundle.addModule(module)
    // 拉取所有的依赖模块
    await this.fetchAllDependencies(module)
    return module
  }

  async fetchAllDependencies(module: Module): Promise<void> {
    await Promise.all(
      module.dependencies.map((dep) => {
        return this.fetchModule(dep, module.path)
      }),
    )
  }
}
