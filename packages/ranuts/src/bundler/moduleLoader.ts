import { readFile } from 'node:fs/promises'
import { Module } from './module'
import { defaultResolver } from './utils/resolve'
import type { Bundle } from './bundle'

export class ModuleLoader {
  bundle: Bundle
  resolveIdsMap: Map<string, string | false> = new Map()
  constructor(bundle: Bundle) {
    this.bundle = bundle
  }

  resolveId(id: string, importer: string | null): string | false {
    const cacheKey = id + importer
    if (this.resolveIdsMap.has(cacheKey)) {
      return this.resolveIdsMap.get(cacheKey)!
    }
    const resolved = defaultResolver(id, importer)
    this.resolveIdsMap.set(cacheKey, resolved)
    return resolved
  }
  // 加载模块并解析
  async fetchModule(
    id: string,
    importer: null | string,
    isEntry = false,
    bundle: Bundle = this.bundle,
    loader: ModuleLoader = this,
  ): Promise<Module | null> {
    const path = this.resolveId(id, importer)

    if (path === false) {
      return null
    }
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
