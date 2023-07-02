import * as MagicString from 'magic-string'
import type { Module } from './module'
import { Graph } from './graph'

interface BundleOptions {
  entry: string
}

export class Bundle {
  graph: Graph
  constructor(options: BundleOptions) {
    // 初始化模块依赖图对象
    this.graph = new Graph({
      entry: options.entry,
      bundle: this,
    })
  }

  async build(): Promise<void> {
    // 模块打包逻辑，完成所有的 AST 相关操作
    return await this.graph.build()
  }

  getModuleById(id: string): Module {
    return this.graph.getModuleById(id)
  }

  addModule(module: Module): void {
    return this.graph.addModule(module)
  }
  /**
   * @description: 代码生成逻辑，拼接模块 AST 节点，产出代码
   * @return {*}
   */
  render(): { code: string; map: MagicString.SourceMap } {
    const msBundle = new MagicString.Bundle({ separator: '\n' })

    this.graph.orderedModules.forEach((module) => {
      msBundle.addSource({
        content: module.render(),
      })
    })

    const map = msBundle.generateMap({ includeContent: true })
    return {
      code: msBundle.toString(),
      map,
    }
  }
}
