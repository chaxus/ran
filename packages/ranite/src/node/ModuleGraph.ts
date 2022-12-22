import { cleanUrl } from './utils'

export interface ResolvedId extends ModuleOptions {
	external: boolean | 'absolute';
	id: string;
}
interface ModuleInfo extends ModuleOptions {
	ast: AcornNode | null;
	code: string | null;
	dynamicImporters: readonly string[];
	dynamicallyImportedIdResolutions: readonly ResolvedId[];
	dynamicallyImportedIds: readonly string[];
	exportedBindings: Record<string, string[]> | null;
	exports: string[] | null;
	hasDefaultExport: boolean | null;
	/** @deprecated Use `moduleSideEffects` instead */
	hasModuleSideEffects: boolean | 'no-treeshake';
	id: string;
	implicitlyLoadedAfterOneOf: readonly string[];
	implicitlyLoadedBefore: readonly string[];
	importedIdResolutions: readonly ResolvedId[];
	importedIds: readonly string[];
	importers: readonly string[];
	isEntry: boolean;
	isExternal: boolean;
	isIncluded: boolean | null;
}

export interface ExistingRawSourceMap {
	file?: string;
	mappings: string;
	names: string[];
	sourceRoot?: string;
	sources: string[];
	sourcesContent?: string[];
	version: number;
}

export type SourceMapInput = ExistingRawSourceMap | string | null | { mappings: '' };


interface AcornNode {
	end: number;
	start: number;
	type: string;
}
export interface SourceDescription extends Partial<PartialNull<ModuleOptions>> {
	ast?: AcornNode;
	code: string;
	map?: SourceMapInput;
}

type NullValue = null | undefined | void;

export type TransformResult = string | NullValue | Partial<SourceDescription>;

export interface CustomPluginOptions {
	[plugin: string]: any;
}
interface ModuleOptions {
	assertions: Record<string, string>;
	meta: CustomPluginOptions;
	moduleSideEffects: boolean | 'no-treeshake';
	syntheticNamedExports: boolean | string;
}

type PartialNull<T> = {
	[P in keyof T]: T[P] | null;
};
interface PartialResolvedId extends Partial<PartialNull<ModuleOptions>> {
	external?: boolean | 'absolute' | 'relative';
	id: string;
}

const cssLangs = `\\.(?:css|less|sass|scss|styl|stylus|pcss|postcss)(?:$|\\?)`
const cssLangRE = new RegExp(cssLangs)

const directRequestRE = /(?:\?|&)direct\b/

export const isDirectCSSRequest = (request: string): boolean =>
  cssLangRE.test(request) && directRequestRE.test(request)

class ModuleNode {
  // 原始请求 url
  url: string
  // 文件绝对路径 + query
  id: string | null = null
  // 文件绝对路径
  file: string | null = null
  type: 'js' | 'css'
  info?: ModuleInfo
  // resolveId 钩子返回结果中的元数据
  meta?: Record<string, any>
  // 该模块的引用方
  importers = new Set<ModuleNode>()
  // 该模块所依赖的模块
  importedModules = new Set<ModuleNode>()
  // 接受更新的模块
  acceptedHmrDeps = new Set<ModuleNode>()
  // 是否为`接受自身模块`的更新
  isSelfAccepting = false
  // 经过 transform 钩子后的编译结果
  transformResult: TransformResult | null = null
  // SSR 过程中经过 transform 钩子后的编译结果
  ssrTransformResult: TransformResult | null = null
  // SSR 过程中的模块信息
  ssrModule: Record<string, any> | null = null
  // 上一次热更新的时间戳
  lastHMRTimestamp = 0

  constructor(url: string) {
    this.url = url
    this.type = isDirectCSSRequest(url) ? 'css' : 'js'
  }
}

export class ModuleGraph {
  // 由原始请求 url 到模块节点的映射，如 /src/index.tsx
  urlToModuleMap = new Map<string, ModuleNode>()
  // 由模块 id 到模块节点的映射，其中 id 与原始请求 url，为经过 resolveId 钩子解析后的结果
  idToModuleMap = new Map<string, ModuleNode>()
  // 由文件到模块节点的映射，由于单文件可能包含多个模块，如 .vue 文件，因此 Map 的 value 值为一个集合
  fileToModulesMap = new Map<string, Set<ModuleNode>>()

  constructor(
    // 通过创建时传入，用于获取文件路径
    private resolveId: (url: string) => Promise<PartialResolvedId | null>,
  ) {}
  /**
   * @description: 通过绝对路径获取模块
   * @param {string} id
   * @return {ModuleNode | undefined}
   */    
  getModuleById(id: string): ModuleNode | undefined {
    return this.idToModuleMap.get(id)
  }

  async getModuleByUrl(rawUrl: string): Promise<ModuleNode | undefined> {
    const { url } = await this._resolve(rawUrl)
    return this.urlToModuleMap.get(url)
  }

  async ensureEntryFromUrl(rawUrl: string): Promise<ModuleNode> {
    const { url, resolvedId } = await this._resolve(rawUrl)
    // 首先检查缓存
    if (this.urlToModuleMap.has(url)) {
      return this.urlToModuleMap.get(url) as ModuleNode
    }
    // 若无缓存，更新 urlToModuleMap 和 idToModuleMap
    const mod = new ModuleNode(url)
    mod.id = resolvedId
    this.urlToModuleMap.set(url, mod)
    this.idToModuleMap.set(resolvedId, mod)
    return mod
  }

  async updateModuleInfo(
    mod: ModuleNode,
    importedModules: Set<string | ModuleNode>,
  ): Promise<void> {
    const prevImports = mod.importedModules
    for (const curImports of importedModules) {
      const dep =
        typeof curImports === 'string'
          ? await this.ensureEntryFromUrl(cleanUrl(curImports))
          : curImports
      if (dep) {
        mod.importedModules.add(dep)
        dep.importers.add(mod)
      }
    }
    // 清除已经不再被引用的依赖
    for (const prevImport of prevImports) {
      if (!importedModules.has(prevImport.url)) {
        prevImport.importers.delete(mod)
      }
    }
  }

  invalidateModule(file: string): void {
    const mod = this.idToModuleMap.get(file)
    if (mod) {
      mod.lastHMRTimestamp = Date.now()
      mod.transformResult = null
      mod.importers.forEach((importer) => {
        this.invalidateModule(importer.id!)
      })
    }
  }
  
  private async _resolve(
    url: string,
  ): Promise<{ url: string; resolvedId: string }> {
    const resolved = await this.resolveId(url)
    const resolvedId = resolved?.id || url
    return { url, resolvedId }
  }
}
