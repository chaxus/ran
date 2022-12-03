import { ServerContext } from "./server/index";

export interface CustomPluginOptions {
	[plugin: string]: any;
}

export interface ModuleOptions {
	assertions: Record<string, string>;
	meta: CustomPluginOptions;
	moduleSideEffects: boolean | 'no-treeshake';
	syntheticNamedExports: boolean | string;
}

export type PartialNull<T> = {
	[P in keyof T]: T[P] | null;
};

export type NullValue = null | undefined | void;
 
export type ServerHook = (
  server: ServerContext
) => (() => void) | void | Promise<(() => void) | void>;

// 只实现以下这几个钩子
export interface Plugin {
  name: string;
  configureServer?: ServerHook;
  resolveId?: (
    id: string,
    importer?: string
  ) => Promise<PartialResolvedId | null> | PartialResolvedId | null;
  load?: (id: string) => Promise<LoadResult | null> | LoadResult | null;
  transform?: (
    code: string,
    id: string
  ) => Promise<SourceDescription | null> | SourceDescription | null;
  transformIndexHtml?: (raw: string) => Promise<string> | string;
}

export interface AcornNode {
	end: number;
	start: number;
	type: string;
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

export interface SourceDescription extends Partial<PartialNull<ModuleOptions>> {
	ast?: AcornNode;
	code: string;
	map?: SourceMapInput;
}

export interface PartialResolvedId extends Partial<PartialNull<ModuleOptions>> {
	external?: boolean | 'absolute' | 'relative';
	id: string;
}

export type LoadResult = SourceDescription | string | NullValue;

export interface ResolvedId extends ModuleOptions {
	external: boolean | 'absolute';
	id: string;
}

