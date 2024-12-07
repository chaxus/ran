// This definition file follows a somewhat unusual format. ESTree allows
// runtime type checks based on the `type` parameter. In order to explain this
// to typescript we want to use discriminated union types:
// https://github.com/Microsoft/TypeScript/pull/9163
//
// For ESTree this is a bit tricky because the high level interfaces like
// Node or Function are pulling double duty. We want to pass common fields down
// to the interfaces that extend them (like Identifier or
// ArrowFunctionExpression), but you can't extend a type union or enforce
// common fields on them. So we've split the high level interfaces into two
// types, a base type which passes down inherited fields, and a type union of
// all types which extend the base type. Only the type union is exported, and
// the union is how other types refer to the collection of inheriting types.
//
// This makes the definitions file here somewhat more difficult to maintain,
// but it has the notable advantage of making ESTree much easier to use as
// an end user.

export interface BaseNodeWithoutComments {
  // Every leaf interface that extends BaseNode must specify a type property.
  // The type property should be a string literal. For example, Identifier
  // has: `type: "Identifier"`
  type: string;
  loc?: SourceLocation | null | undefined;
  range?: [number, number] | undefined;
}

export interface BaseNode extends BaseNodeWithoutComments {
  leadingComments?: Comment[] | undefined;
  trailingComments?: Comment[] | undefined;
}

export interface NodeMap {
  AssignmentProperty: AssignmentProperty;
  CatchClause: CatchClause;
  Class: Class;
  ClassBody: ClassBody;
  Expression: Expression;
  Function: Function;
  Identifier: Identifier;
  Literal: Literal;
  MethodDefinition: MethodDefinition;
  ModuleDeclaration: ModuleDeclaration;
  ModuleSpecifier: ModuleSpecifier;
  Pattern: Pattern;
  PrivateIdentifier: PrivateIdentifier;
  Program: Program;
  Property: Property;
  PropertyDefinition: PropertyDefinition;
  SpreadElement: SpreadElement;
  Statement: Statement;
  Super: Super;
  SwitchCase: SwitchCase;
  TemplateElement: TemplateElement;
  VariableDeclarator: VariableDeclarator;
}

export type Node = NodeMap[keyof NodeMap];

export interface Comment extends BaseNodeWithoutComments {
  type: 'Line' | 'Block';
  value: string;
}

export interface SourceLocation {
  source?: string | null | undefined;
  start: Position;
  end: Position;
}

export interface Position {
  /** >= 1 */
  line: number;
  /** >= 0 */
  column: number;
}

export interface Program extends BaseNode {
  type: 'Program';
  sourceType: 'script' | 'module';
  body: Array<Directive | Statement | ModuleDeclaration>;
  comments?: Comment[] | undefined;
}

export interface Directive extends BaseNode {
  type: 'ExpressionStatement';
  expression: Literal;
  directive: string;
}

export interface BaseFunction extends BaseNode {
  params: Pattern[];
  generator?: boolean | undefined;
  async?: boolean | undefined;
  // The body is either BlockStatement or Expression because arrow functions
  // can have a body that's either. FunctionDeclarations and
  // FunctionExpressions have only BlockStatement bodies.
  body: BlockStatement | Expression;
}

export type Function = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression;

export type Statement =
  | ExpressionStatement
  | BlockStatement
  | StaticBlock
  | EmptyStatement
  | DebuggerStatement
  | WithStatement
  | ReturnStatement
  | LabeledStatement
  | BreakStatement
  | ContinueStatement
  | IfStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | Declaration;

export interface BaseStatement extends BaseNode {}

export interface EmptyStatement extends BaseStatement {
  type: 'EmptyStatement';
}

export interface BlockStatement extends BaseStatement {
  type: 'BlockStatement';
  body: Statement[];
  innerComments?: Comment[] | undefined;
}

export interface StaticBlock extends Omit<BlockStatement, 'type'> {
  type: 'StaticBlock';
}

export interface ExpressionStatement extends BaseStatement {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface IfStatement extends BaseStatement {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate?: Statement | null | undefined;
}

export interface LabeledStatement extends BaseStatement {
  type: 'LabeledStatement';
  label: Identifier;
  body: Statement;
}

export interface BreakStatement extends BaseStatement {
  type: 'BreakStatement';
  label?: Identifier | null | undefined;
}

export interface ContinueStatement extends BaseStatement {
  type: 'ContinueStatement';
  label?: Identifier | null | undefined;
}

export interface WithStatement extends BaseStatement {
  type: 'WithStatement';
  object: Expression;
  body: Statement;
}

export interface SwitchStatement extends BaseStatement {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface ReturnStatement extends BaseStatement {
  type: 'ReturnStatement';
  argument?: Expression | null | undefined;
}

export interface ThrowStatement extends BaseStatement {
  type: 'ThrowStatement';
  argument: Expression;
}

export interface TryStatement extends BaseStatement {
  type: 'TryStatement';
  block: BlockStatement;
  handler?: CatchClause | null | undefined;
  finalizer?: BlockStatement | null | undefined;
}

export interface WhileStatement extends BaseStatement {
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends BaseStatement {
  type: 'DoWhileStatement';
  body: Statement;
  test: Expression;
}

export interface ForStatement extends BaseStatement {
  type: 'ForStatement';
  init?: VariableDeclaration | Expression | null | undefined;
  test?: Expression | null | undefined;
  update?: Expression | null | undefined;
  body: Statement;
}

export interface BaseForXStatement extends BaseStatement {
  left: VariableDeclaration | Pattern;
  right: Expression;
  body: Statement;
}

export interface ForInStatement extends BaseForXStatement {
  type: 'ForInStatement';
}

export interface DebuggerStatement extends BaseStatement {
  type: 'DebuggerStatement';
}

export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration;

export interface BaseDeclaration extends BaseStatement {}

export interface MaybeNamedFunctionDeclaration extends BaseFunction, BaseDeclaration {
  type: 'FunctionDeclaration';
  /** It is null when a function declaration is a part of the `export default function` statement */
  id: Identifier | null;
  body: BlockStatement;
}

export interface FunctionDeclaration extends MaybeNamedFunctionDeclaration {
  id: Identifier;
}

export interface VariableDeclaration extends BaseDeclaration {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}

export interface VariableDeclarator extends BaseNode {
  type: 'VariableDeclarator';
  id: Pattern;
  init?: Expression | null | undefined;
}

export interface ExpressionMap {
  ArrayExpression: ArrayExpression;
  ArrowFunctionExpression: ArrowFunctionExpression;
  AssignmentExpression: AssignmentExpression;
  AwaitExpression: AwaitExpression;
  BinaryExpression: BinaryExpression;
  CallExpression: CallExpression;
  ChainExpression: ChainExpression;
  ClassExpression: ClassExpression;
  ConditionalExpression: ConditionalExpression;
  FunctionExpression: FunctionExpression;
  Identifier: Identifier;
  ImportExpression: ImportExpression;
  Literal: Literal;
  LogicalExpression: LogicalExpression;
  MemberExpression: MemberExpression;
  MetaProperty: MetaProperty;
  NewExpression: NewExpression;
  ObjectExpression: ObjectExpression;
  SequenceExpression: SequenceExpression;
  TaggedTemplateExpression: TaggedTemplateExpression;
  TemplateLiteral: TemplateLiteral;
  ThisExpression: ThisExpression;
  UnaryExpression: UnaryExpression;
  UpdateExpression: UpdateExpression;
  YieldExpression: YieldExpression;
}

export type Expression = ExpressionMap[keyof ExpressionMap];

export interface BaseExpression extends BaseNode {}

export type ChainElement = SimpleCallExpression | MemberExpression;

export interface ChainExpression extends BaseExpression {
  type: 'ChainExpression';
  expression: ChainElement;
}

export interface ThisExpression extends BaseExpression {
  type: 'ThisExpression';
}

export interface ArrayExpression extends BaseExpression {
  type: 'ArrayExpression';
  elements: Array<Expression | SpreadElement | null>;
}

export interface ObjectExpression extends BaseExpression {
  type: 'ObjectExpression';
  properties: Array<Property | SpreadElement>;
}

export interface PrivateIdentifier extends BaseNode {
  type: 'PrivateIdentifier';
  name: string;
}

export interface Property extends BaseNode {
  type: 'Property';
  key: Expression | PrivateIdentifier;
  value: Expression | Pattern; // Could be an AssignmentProperty
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

export interface PropertyDefinition extends BaseNode {
  type: 'PropertyDefinition';
  key: Expression | PrivateIdentifier;
  value?: Expression | null | undefined;
  computed: boolean;
  static: boolean;
}

export interface FunctionExpression extends BaseFunction, BaseExpression {
  id?: Identifier | null | undefined;
  type: 'FunctionExpression';
  body: BlockStatement;
}

export interface SequenceExpression extends BaseExpression {
  type: 'SequenceExpression';
  expressions: Expression[];
}

export interface UnaryExpression extends BaseExpression {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: true;
  argument: Expression;
}

export interface BinaryExpression extends BaseExpression {
  type: 'BinaryExpression';
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface AssignmentExpression extends BaseExpression {
  type: 'AssignmentExpression';
  operator: AssignmentOperator;
  left: Pattern | MemberExpression;
  right: Expression;
}

export interface UpdateExpression extends BaseExpression {
  type: 'UpdateExpression';
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
}

export interface LogicalExpression extends BaseExpression {
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface ConditionalExpression extends BaseExpression {
  type: 'ConditionalExpression';
  test: Expression;
  alternate: Expression;
  consequent: Expression;
}

export interface BaseCallExpression extends BaseExpression {
  callee: Expression | Super;
  arguments: Array<Expression | SpreadElement>;
}
export type CallExpression = SimpleCallExpression | NewExpression;

export interface SimpleCallExpression extends BaseCallExpression {
  type: 'CallExpression';
  optional: boolean;
}

export interface NewExpression extends BaseCallExpression {
  type: 'NewExpression';
}

export interface MemberExpression extends BaseExpression, BasePattern {
  type: 'MemberExpression';
  object: Expression | Super;
  property: Expression | PrivateIdentifier;
  computed: boolean;
  optional: boolean;
}

export type Pattern = Identifier | ObjectPattern | ArrayPattern | RestElement | AssignmentPattern | MemberExpression;

export interface BasePattern extends BaseNode {}

export interface SwitchCase extends BaseNode {
  type: 'SwitchCase';
  test?: Expression | null | undefined;
  consequent: Statement[];
}

export interface CatchClause extends BaseNode {
  type: 'CatchClause';
  param: Pattern | null;
  body: BlockStatement;
}

export interface Identifier extends BaseNode, BaseExpression, BasePattern {
  type: 'Identifier';
  name: string;
}

export type Literal = SimpleLiteral | RegExpLiteral | BigIntLiteral;

export interface SimpleLiteral extends BaseNode, BaseExpression {
  type: 'Literal';
  value: string | boolean | number | null;
  raw?: string | undefined;
}

export interface RegExpLiteral extends BaseNode, BaseExpression {
  type: 'Literal';
  value?: RegExp | null | undefined;
  regex: {
    pattern: string;
    flags: string;
  };
  raw?: string | undefined;
}

export interface BigIntLiteral extends BaseNode, BaseExpression {
  type: 'Literal';
  value?: bigint | null | undefined;
  bigint: string;
  raw?: string | undefined;
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';

export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '<<'
  | '>>'
  | '>>>'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | '|'
  | '^'
  | '&'
  | 'in'
  | 'instanceof';

export type LogicalOperator = '||' | '&&' | '??';

export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '**='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='
  | '||='
  | '&&='
  | '??=';

export type UpdateOperator = '++' | '--';

export interface ForOfStatement extends BaseForXStatement {
  type: 'ForOfStatement';
  await: boolean;
}

export interface Super extends BaseNode {
  type: 'Super';
}

export interface SpreadElement extends BaseNode {
  type: 'SpreadElement';
  argument: Expression;
}

export interface ArrowFunctionExpression extends BaseExpression, BaseFunction {
  type: 'ArrowFunctionExpression';
  expression: boolean;
  body: BlockStatement | Expression;
}

export interface YieldExpression extends BaseExpression {
  type: 'YieldExpression';
  argument?: Expression | null | undefined;
  delegate: boolean;
}

export interface TemplateLiteral extends BaseExpression {
  type: 'TemplateLiteral';
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface TaggedTemplateExpression extends BaseExpression {
  type: 'TaggedTemplateExpression';
  tag: Expression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends BaseNode {
  type: 'TemplateElement';
  tail: boolean;
  value: {
    /** It is null when the template literal is tagged and the text has an invalid escape (e.g. - tag`\unicode and \u{55}`) */
    cooked?: string | null | undefined;
    raw: string;
  };
}

export interface AssignmentProperty extends Property {
  value: Pattern;
  kind: 'init';
  method: boolean; // false
}

export interface ObjectPattern extends BasePattern {
  type: 'ObjectPattern';
  properties: Array<AssignmentProperty | RestElement>;
}

export interface ArrayPattern extends BasePattern {
  type: 'ArrayPattern';
  elements: Array<Pattern | null>;
}

export interface RestElement extends BasePattern {
  type: 'RestElement';
  argument: Pattern;
}

export interface AssignmentPattern extends BasePattern {
  type: 'AssignmentPattern';
  left: Pattern;
  right: Expression;
}

export type Class = ClassDeclaration | ClassExpression;
export interface BaseClass extends BaseNode {
  superClass?: Expression | null | undefined;
  body: ClassBody;
}

export interface ClassBody extends BaseNode {
  type: 'ClassBody';
  body: Array<MethodDefinition | PropertyDefinition | StaticBlock>;
}

export interface MethodDefinition extends BaseNode {
  type: 'MethodDefinition';
  key: Expression | PrivateIdentifier;
  value: FunctionExpression;
  kind: 'constructor' | 'method' | 'get' | 'set';
  computed: boolean;
  static: boolean;
}

export interface MaybeNamedClassDeclaration extends BaseClass, BaseDeclaration {
  type: 'ClassDeclaration';
  /** It is null when a class declaration is a part of the `export default class` statement */
  id: Identifier | null;
}

export interface ClassDeclaration extends MaybeNamedClassDeclaration {
  id: Identifier;
}

export interface ClassExpression extends BaseClass, BaseExpression {
  type: 'ClassExpression';
  id?: Identifier | null | undefined;
}

export interface MetaProperty extends BaseExpression {
  type: 'MetaProperty';
  meta: Identifier;
  property: Identifier;
}

export type ModuleDeclaration =
  | ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration;
export interface BaseModuleDeclaration extends BaseNode {}

export type ModuleSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ExportSpecifier;
export interface BaseModuleSpecifier extends BaseNode {
  local: Identifier;
}

export interface ImportDeclaration extends BaseModuleDeclaration {
  type: 'ImportDeclaration';
  specifiers: Array<ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier>;
  source: Literal;
}

export interface ImportSpecifier extends BaseModuleSpecifier {
  type: 'ImportSpecifier';
  imported: Identifier;
}

export interface ImportExpression extends BaseExpression {
  type: 'ImportExpression';
  source: Expression;
}

export interface ImportDefaultSpecifier extends BaseModuleSpecifier {
  type: 'ImportDefaultSpecifier';
}

export interface ImportNamespaceSpecifier extends BaseModuleSpecifier {
  type: 'ImportNamespaceSpecifier';
}

export interface ExportNamedDeclaration extends BaseModuleDeclaration {
  type: 'ExportNamedDeclaration';
  declaration?: Declaration | null | undefined;
  specifiers: ExportSpecifier[];
  source?: Literal | null | undefined;
}

export interface ExportSpecifier extends BaseModuleSpecifier {
  type: 'ExportSpecifier';
  exported: Identifier;
}

export interface ExportDefaultDeclaration extends BaseModuleDeclaration {
  type: 'ExportDefaultDeclaration';
  declaration: MaybeNamedFunctionDeclaration | MaybeNamedClassDeclaration | Expression;
}

export interface ExportAllDeclaration extends BaseModuleDeclaration {
  type: 'ExportAllDeclaration';
  exported: Identifier | null;
  source: Literal;
}

export interface AwaitExpression extends BaseExpression {
  type: 'AwaitExpression';
  argument: Expression;
}

export const VERSION: string;

// utils
type NullValue = null | undefined | void;
type MaybeArray<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;

type PartialNull<T> = {
  [P in keyof T]: T[P] | null;
};

export interface RollupError extends RollupLog {
  name?: string;
  stack?: string;
  watchFiles?: string[];
}

export interface RollupLog {
  binding?: string;
  cause?: unknown;
  code?: string;
  exporter?: string;
  frame?: string;
  hook?: string;
  id?: string;
  ids?: string[];
  loc?: {
    column: number;
    file?: string;
    line: number;
  };
  message: string;
  meta?: any;
  names?: string[];
  plugin?: string;
  pluginCode?: unknown;
  pos?: number;
  reexporter?: string;
  stack?: string;
  url?: string;
}

export type LogLevel = 'warn' | 'info' | 'debug';
export type LogLevelOption = LogLevel | 'silent';

export type SourceMapSegment = [number] | [number, number, number, number] | [number, number, number, number, number];

export interface ExistingDecodedSourceMap {
  file?: string;
  readonly mappings: SourceMapSegment[][];
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: string[];
  version: number;
  x_google_ignoreList?: number[];
}

export interface ExistingRawSourceMap {
  file?: string;
  mappings: string;
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: string[];
  version: number;
  x_google_ignoreList?: number[];
}

export type DecodedSourceMapOrMissing =
  | {
      missing: true;
      plugin: string;
    }
  | (ExistingDecodedSourceMap & { missing?: false });

export interface SourceMap {
  file: string;
  mappings: string;
  names: string[];
  sources: string[];
  sourcesContent?: string[];
  version: number;
  toString(): string;
  toUrl(): string;
}

export type SourceMapInput = ExistingRawSourceMap | string | null | { mappings: '' };

interface ModuleOptions {
  attributes: Record<string, string>;
  meta: CustomPluginOptions;
  moduleSideEffects: boolean | 'no-treeshake';
  syntheticNamedExports: boolean | string;
}

export interface SourceDescription extends Partial<PartialNull<ModuleOptions>> {
  ast?: ProgramNode;
  code: string;
  map?: SourceMapInput;
}

export interface TransformModuleJSON {
  ast?: ProgramNode;
  code: string;
  // note if plugins use new this.cache to opt-out auto transform cache
  customTransformCache: boolean;
  originalCode: string;
  originalSourcemap: ExistingDecodedSourceMap | null;
  sourcemapChain: DecodedSourceMapOrMissing[];
  transformDependencies: string[];
}

export interface ModuleJSON extends TransformModuleJSON, ModuleOptions {
  ast: ProgramNode;
  dependencies: string[];
  id: string;
  resolvedIds: ResolvedIdMap;
  transformFiles: EmittedFile[] | undefined;
}

export interface PluginCache {
  delete(id: string): boolean;
  get<T = any>(id: string): T;
  has(id: string): boolean;
  set<T = any>(id: string, value: T): void;
}

export type LoggingFunction = (log: RollupLog | string | (() => RollupLog | string)) => void;

export interface MinimalPluginContext {
  debug: LoggingFunction;
  error: (error: RollupError | string) => never;
  info: LoggingFunction;
  meta: PluginContextMeta;
  warn: LoggingFunction;
}

export interface EmittedAsset {
  fileName?: string;
  name?: string;
  needsCodeReference?: boolean;
  source?: string | Uint8Array;
  type: 'asset';
}

export interface EmittedChunk {
  fileName?: string;
  id: string;
  implicitlyLoadedAfterOneOf?: string[];
  importer?: string;
  name?: string;
  preserveSignature?: PreserveEntrySignaturesOption;
  type: 'chunk';
}

export interface EmittedPrebuiltChunk {
  code: string;
  exports?: string[];
  fileName: string;
  map?: SourceMap;
  sourcemapFileName?: string;
  type: 'prebuilt-chunk';
}

export type EmittedFile = EmittedAsset | EmittedChunk | EmittedPrebuiltChunk;

export type EmitFile = (emittedFile: EmittedFile) => string;

interface ModuleInfo extends ModuleOptions {
  ast: ProgramNode | null;
  code: string | null;
  dynamicImporters: readonly string[];
  dynamicallyImportedIdResolutions: readonly ResolvedId[];
  dynamicallyImportedIds: readonly string[];
  exportedBindings: Record<string, string[]> | null;
  exports: string[] | null;
  hasDefaultExport: boolean | null;
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

export type GetModuleInfo = (moduleId: string) => ModuleInfo | null;

export interface CustomPluginOptions {
  [plugin: string]: any;
}

type LoggingFunctionWithPosition = (
  log: RollupLog | string | (() => RollupLog | string),
  pos?: number | { column: number; line: number },
) => void;

export type ParseAst = (input: string, options?: { allowReturnOutsideFunction?: boolean }) => ProgramNode;

// declare AbortSignal here for environments without DOM lib or @types/node
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AbortSignal {}
}

export type ParseAstAsync = (
  input: string,
  options?: { allowReturnOutsideFunction?: boolean; signal?: AbortSignal },
) => Promise<ProgramNode>;

export interface PluginContext extends MinimalPluginContext {
  addWatchFile: (id: string) => void;
  cache: PluginCache;
  debug: LoggingFunction;
  emitFile: EmitFile;
  error: (error: RollupError | string) => never;
  getFileName: (fileReferenceId: string) => string;
  getModuleIds: () => IterableIterator<string>;
  getModuleInfo: GetModuleInfo;
  getWatchFiles: () => string[];
  info: LoggingFunction;
  load: (
    options: { id: string; resolveDependencies?: boolean } & Partial<PartialNull<ModuleOptions>>,
  ) => Promise<ModuleInfo>;
  parse: ParseAst;
  resolve: (
    source: string,
    importer?: string,
    options?: {
      attributes?: Record<string, string>;
      custom?: CustomPluginOptions;
      isEntry?: boolean;
      skipSelf?: boolean;
    },
  ) => Promise<ResolvedId | null>;
  setAssetSource: (assetReferenceId: string, source: string | Uint8Array) => void;
  warn: LoggingFunction;
}

export interface PluginContextMeta {
  rollupVersion: string;
  watchMode: boolean;
}

export interface ResolvedId extends ModuleOptions {
  external: boolean | 'absolute';
  id: string;
  resolvedBy: string;
}

export interface ResolvedIdMap {
  [key: string]: ResolvedId;
}

interface PartialResolvedId extends Partial<PartialNull<ModuleOptions>> {
  external?: boolean | 'absolute' | 'relative';
  id: string;
  resolvedBy?: string;
}

export type ResolveIdResult = string | NullValue | false | PartialResolvedId;

export type ResolveIdResultWithoutNullValue = string | false | PartialResolvedId;

export type ResolveIdHook = (
  this: PluginContext,
  source: string,
  importer: string | undefined,
  options: { attributes: Record<string, string>; custom?: CustomPluginOptions; isEntry: boolean },
) => ResolveIdResult;

export type ShouldTransformCachedModuleHook = (
  this: PluginContext,
  options: {
    ast: ProgramNode;
    code: string;
    id: string;
    meta: CustomPluginOptions;
    moduleSideEffects: boolean | 'no-treeshake';
    resolvedSources: ResolvedIdMap;
    syntheticNamedExports: boolean | string;
  },
) => boolean | NullValue;

export type IsExternal = (source: string, importer: string | undefined, isResolved: boolean) => boolean;

export type HasModuleSideEffects = (id: string, external: boolean) => boolean;

export type LoadResult = SourceDescription | string | NullValue;

export type LoadHook = (this: PluginContext, id: string) => LoadResult;

export interface TransformPluginContext extends PluginContext {
  debug: LoggingFunctionWithPosition;
  error: (error: RollupError | string, pos?: number | { column: number; line: number }) => never;
  getCombinedSourcemap: () => SourceMap;
  info: LoggingFunctionWithPosition;
  warn: LoggingFunctionWithPosition;
}

export type TransformResult = string | NullValue | Partial<SourceDescription>;

export type TransformHook = (this: TransformPluginContext, code: string, id: string) => TransformResult;

export type ModuleParsedHook = (this: PluginContext, info: ModuleInfo) => void;

export type RenderChunkHook = (
  this: PluginContext,
  code: string,
  chunk: RenderedChunk,
  options: NormalizedOutputOptions,
  meta: { chunks: Record<string, RenderedChunk> },
) => { code: string; map?: SourceMapInput } | string | NullValue;

export type ResolveDynamicImportHook = (
  this: PluginContext,
  specifier: string | AstNode,
  importer: string,
  options: { attributes: Record<string, string> },
) => ResolveIdResult;

export type ResolveImportMetaHook = (
  this: PluginContext,
  property: string | null,
  options: { chunkId: string; format: InternalModuleFormat; moduleId: string },
) => string | NullValue;

export type ResolveFileUrlHook = (
  this: PluginContext,
  options: {
    chunkId: string;
    fileName: string;
    format: InternalModuleFormat;
    moduleId: string;
    referenceId: string;
    relativePath: string;
  },
) => string | NullValue;

export type AddonHookFunction = (this: PluginContext, chunk: RenderedChunk) => string | Promise<string>;
export type AddonHook = string | AddonHookFunction;

export type ChangeEvent = 'create' | 'update' | 'delete';
export type WatchChangeHook = (this: PluginContext, id: string, change: { event: ChangeEvent }) => void;

/**
 * use this type for plugin annotation
 * @example
 * ```ts
 * interface Options {
 * ...
 * }
 * const myPlugin: PluginImpl<Options> = (options = {}) => { ... }
 * ```
 */

export type PluginImpl<O extends object = object, A = any> = (options?: O) => Plugin<A>;

export interface OutputBundle {
  [fileName: string]: OutputAsset | OutputChunk;
}

export interface FunctionPluginHooks {
  augmentChunkHash: (this: PluginContext, chunk: RenderedChunk) => string | void;
  buildEnd: (this: PluginContext, error?: Error) => void;
  buildStart: (this: PluginContext, options: NormalizedInputOptions) => void;
  closeBundle: (this: PluginContext) => void;
  closeWatcher: (this: PluginContext) => void;
  generateBundle: (
    this: PluginContext,
    options: NormalizedOutputOptions,
    bundle: OutputBundle,
    isWrite: boolean,
  ) => void;
  load: LoadHook;
  moduleParsed: ModuleParsedHook;
  onLog: (this: MinimalPluginContext, level: LogLevel, log: RollupLog) => boolean | NullValue;
  options: (this: MinimalPluginContext, options: InputOptions) => InputOptions | NullValue;
  outputOptions: (this: PluginContext, options: OutputOptions) => OutputOptions | NullValue;
  renderChunk: RenderChunkHook;
  renderDynamicImport: (
    this: PluginContext,
    options: {
      customResolution: string | null;
      format: InternalModuleFormat;
      moduleId: string;
      targetModuleId: string | null;
    },
  ) => { left: string; right: string } | NullValue;
  renderError: (this: PluginContext, error?: Error) => void;
  renderStart: (
    this: PluginContext,
    outputOptions: NormalizedOutputOptions,
    inputOptions: NormalizedInputOptions,
  ) => void;
  resolveDynamicImport: ResolveDynamicImportHook;
  resolveFileUrl: ResolveFileUrlHook;
  resolveId: ResolveIdHook;
  resolveImportMeta: ResolveImportMetaHook;
  shouldTransformCachedModule: ShouldTransformCachedModuleHook;
  transform: TransformHook;
  watchChange: WatchChangeHook;
  writeBundle: (this: PluginContext, options: NormalizedOutputOptions, bundle: OutputBundle) => void;
}

export type OutputPluginHooks =
  | 'augmentChunkHash'
  | 'generateBundle'
  | 'outputOptions'
  | 'renderChunk'
  | 'renderDynamicImport'
  | 'renderError'
  | 'renderStart'
  | 'resolveFileUrl'
  | 'resolveImportMeta'
  | 'writeBundle';

export type InputPluginHooks = Exclude<keyof FunctionPluginHooks, OutputPluginHooks>;

export type SyncPluginHooks =
  | 'augmentChunkHash'
  | 'onLog'
  | 'outputOptions'
  | 'renderDynamicImport'
  | 'resolveFileUrl'
  | 'resolveImportMeta';

export type AsyncPluginHooks = Exclude<keyof FunctionPluginHooks, SyncPluginHooks>;

export type FirstPluginHooks =
  | 'load'
  | 'renderDynamicImport'
  | 'resolveDynamicImport'
  | 'resolveFileUrl'
  | 'resolveId'
  | 'resolveImportMeta'
  | 'shouldTransformCachedModule';

export type SequentialPluginHooks =
  | 'augmentChunkHash'
  | 'generateBundle'
  | 'onLog'
  | 'options'
  | 'outputOptions'
  | 'renderChunk'
  | 'transform';

export type ParallelPluginHooks = Exclude<
  keyof FunctionPluginHooks | AddonHooks,
  FirstPluginHooks | SequentialPluginHooks
>;

export type AddonHooks = 'banner' | 'footer' | 'intro' | 'outro';

type MakeAsync<Function_> = Function_ extends (this: infer This, ...parameters: infer Arguments) => infer Return
  ? (this: This, ...parameters: Arguments) => Return | Promise<Return>
  : never;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ObjectHook<T, O = {}> = T | ({ handler: T; order?: 'pre' | 'post' | null } & O);

export type PluginHooks = {
  [K in keyof FunctionPluginHooks]: ObjectHook<
    K extends AsyncPluginHooks ? MakeAsync<FunctionPluginHooks[K]> : FunctionPluginHooks[K],
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    K extends ParallelPluginHooks ? { sequential?: boolean } : {}
  >;
};

export interface OutputPlugin
  extends Partial<{ [K in OutputPluginHooks]: PluginHooks[K] }>,
    Partial<{ [K in AddonHooks]: ObjectHook<AddonHook> }> {
  cacheKey?: string;
  name: string;
  version?: string;
}

export interface Plugin<A = any> extends OutputPlugin, Partial<PluginHooks> {
  // for inter-plugin communication
  api?: A;
}

export type TreeshakingPreset = 'smallest' | 'safest' | 'recommended';

export interface NormalizedTreeshakingOptions {
  annotations: boolean;
  correctVarValueBeforeDeclaration: boolean;
  manualPureFunctions: readonly string[];
  moduleSideEffects: HasModuleSideEffects;
  propertyReadSideEffects: boolean | 'always';
  tryCatchDeoptimization: boolean;
  unknownGlobalSideEffects: boolean;
}

export interface TreeshakingOptions extends Partial<Omit<NormalizedTreeshakingOptions, 'moduleSideEffects'>> {
  moduleSideEffects?: ModuleSideEffectsOption;
  preset?: TreeshakingPreset;
}

interface ManualChunkMeta {
  getModuleIds: () => IterableIterator<string>;
  getModuleInfo: GetModuleInfo;
}
export type GetManualChunk = (id: string, meta: ManualChunkMeta) => string | NullValue;

export type ExternalOption =
  | (string | RegExp)[]
  | string
  | RegExp
  | ((source: string, importer: string | undefined, isResolved: boolean) => boolean | NullValue);

export type GlobalsOption = { [name: string]: string } | ((name: string) => string);

export type InputOption = string | string[] | { [entryAlias: string]: string };

export type ManualChunksOption = { [chunkAlias: string]: string[] } | GetManualChunk;

export type LogHandlerWithDefault = (level: LogLevel, log: RollupLog, defaultHandler: LogOrStringHandler) => void;

export type LogOrStringHandler = (level: LogLevel | 'error', log: RollupLog | string) => void;

export type LogHandler = (level: LogLevel, log: RollupLog) => void;

export type ModuleSideEffectsOption = boolean | 'no-external' | string[] | HasModuleSideEffects;

export type PreserveEntrySignaturesOption = false | 'strict' | 'allow-extension' | 'exports-only';

export type SourcemapPathTransformOption = (relativeSourcePath: string, sourcemapPath: string) => string;

export type SourcemapIgnoreListOption = (relativeSourcePath: string, sourcemapPath: string) => boolean;

export type InputPluginOption = MaybePromise<Plugin | NullValue | false | InputPluginOption[]>;

export interface InputOptions {
  cache?: boolean | RollupCache;
  context?: string;
  experimentalCacheExpiry?: number;
  experimentalLogSideEffects?: boolean;
  external?: ExternalOption;
  input?: InputOption;
  logLevel?: LogLevelOption;
  makeAbsoluteExternalsRelative?: boolean | 'ifRelativeSource';
  maxParallelFileOps?: number;
  moduleContext?: ((id: string) => string | NullValue) | { [id: string]: string };
  onLog?: LogHandlerWithDefault;
  onwarn?: WarningHandlerWithDefault;
  perf?: boolean;
  plugins?: InputPluginOption;
  preserveEntrySignatures?: PreserveEntrySignaturesOption;
  preserveSymlinks?: boolean;
  shimMissingExports?: boolean;
  strictDeprecations?: boolean;
  treeshake?: boolean | TreeshakingPreset | TreeshakingOptions;
  watch?: WatcherOptions | false;
}

export interface InputOptionsWithPlugins extends InputOptions {
  plugins: Plugin[];
}

export interface NormalizedInputOptions {
  cache: false | undefined | RollupCache;
  context: string;
  experimentalCacheExpiry: number;
  experimentalLogSideEffects: boolean;
  external: IsExternal;
  input: string[] | { [entryAlias: string]: string };
  logLevel: LogLevelOption;
  makeAbsoluteExternalsRelative: boolean | 'ifRelativeSource';
  maxParallelFileOps: number;
  moduleContext: (id: string) => string;
  onLog: LogHandler;
  perf: boolean;
  plugins: Plugin[];
  preserveEntrySignatures: PreserveEntrySignaturesOption;
  preserveSymlinks: boolean;
  shimMissingExports: boolean;
  strictDeprecations: boolean;
  treeshake: false | NormalizedTreeshakingOptions;
}

export type InternalModuleFormat = 'amd' | 'cjs' | 'es' | 'iife' | 'system' | 'umd';

export type ModuleFormat = InternalModuleFormat | 'commonjs' | 'esm' | 'module' | 'systemjs';

type GeneratedCodePreset = 'es5' | 'es2015';

interface NormalizedGeneratedCodeOptions {
  arrowFunctions: boolean;
  constBindings: boolean;
  objectShorthand: boolean;
  reservedNamesAsProps: boolean;
  symbols: boolean;
}

interface GeneratedCodeOptions extends Partial<NormalizedGeneratedCodeOptions> {
  preset?: GeneratedCodePreset;
}

export type OptionsPaths = Record<string, string> | ((id: string) => string);

export type InteropType = 'compat' | 'auto' | 'esModule' | 'default' | 'defaultOnly';

export type GetInterop = (id: string | null) => InteropType;

export type AmdOptions = (
  | {
      autoId?: false;
      id: string;
    }
  | {
      autoId: true;
      basePath?: string;
      id?: undefined;
    }
  | {
      autoId?: false;
      id?: undefined;
    }
) & {
  define?: string;
  forceJsExtensionForImports?: boolean;
};

export type NormalizedAmdOptions = (
  | {
      autoId: false;
      id?: string;
    }
  | {
      autoId: true;
      basePath: string;
    }
) & {
  define: string;
  forceJsExtensionForImports: boolean;
};

type AddonFunction = (chunk: RenderedChunk) => string | Promise<string>;

type OutputPluginOption = MaybePromise<OutputPlugin | NullValue | false | OutputPluginOption[]>;

type HashCharacters = 'base64' | 'base36' | 'hex';

export interface OutputOptions {
  amd?: AmdOptions;
  assetFileNames?: string | ((chunkInfo: PreRenderedAsset) => string);
  banner?: string | AddonFunction;
  chunkFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  compact?: boolean;
  // only required for bundle.write
  dir?: string;
  dynamicImportInCjs?: boolean;
  entryFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  esModule?: boolean | 'if-default-prop';
  experimentalMinChunkSize?: number;
  exports?: 'default' | 'named' | 'none' | 'auto';
  extend?: boolean;
  /** @deprecated Use "externalImportAttributes" instead. */
  externalImportAssertions?: boolean;
  externalImportAttributes?: boolean;
  externalLiveBindings?: boolean;
  // only required for bundle.write
  file?: string;
  footer?: string | AddonFunction;
  format?: ModuleFormat;
  freeze?: boolean;
  generatedCode?: GeneratedCodePreset | GeneratedCodeOptions;
  globals?: GlobalsOption;
  hashCharacters?: HashCharacters;
  hoistTransitiveImports?: boolean;
  indent?: string | boolean;
  inlineDynamicImports?: boolean;
  interop?: InteropType | GetInterop;
  intro?: string | AddonFunction;
  manualChunks?: ManualChunksOption;
  minifyInternalExports?: boolean;
  name?: string;
  noConflict?: boolean;
  outro?: string | AddonFunction;
  paths?: OptionsPaths;
  plugins?: OutputPluginOption;
  preserveModules?: boolean;
  preserveModulesRoot?: string;
  sanitizeFileName?: boolean | ((fileName: string) => string);
  sourcemap?: boolean | 'inline' | 'hidden';
  sourcemapBaseUrl?: string;
  sourcemapExcludeSources?: boolean;
  sourcemapFile?: string;
  sourcemapFileNames?: string | ((chunkInfo: PreRenderedChunk) => string);
  sourcemapIgnoreList?: boolean | SourcemapIgnoreListOption;
  sourcemapPathTransform?: SourcemapPathTransformOption;
  strict?: boolean;
  systemNullSetters?: boolean;
  validate?: boolean;
}

export interface NormalizedOutputOptions {
  amd: NormalizedAmdOptions;
  assetFileNames: string | ((chunkInfo: PreRenderedAsset) => string);
  banner: AddonFunction;
  chunkFileNames: string | ((chunkInfo: PreRenderedChunk) => string);
  compact: boolean;
  dir: string | undefined;
  dynamicImportInCjs: boolean;
  entryFileNames: string | ((chunkInfo: PreRenderedChunk) => string);
  esModule: boolean | 'if-default-prop';
  experimentalMinChunkSize: number;
  exports: 'default' | 'named' | 'none' | 'auto';
  extend: boolean;
  /** @deprecated Use "externalImportAttributes" instead. */
  externalImportAssertions: boolean;
  externalImportAttributes: boolean;
  externalLiveBindings: boolean;
  file: string | undefined;
  footer: AddonFunction;
  format: InternalModuleFormat;
  freeze: boolean;
  generatedCode: NormalizedGeneratedCodeOptions;
  globals: GlobalsOption;
  hashCharacters: HashCharacters;
  hoistTransitiveImports: boolean;
  indent: true | string;
  inlineDynamicImports: boolean;
  interop: GetInterop;
  intro: AddonFunction;
  manualChunks: ManualChunksOption;
  minifyInternalExports: boolean;
  name: string | undefined;
  noConflict: boolean;
  outro: AddonFunction;
  paths: OptionsPaths;
  plugins: OutputPlugin[];
  preserveModules: boolean;
  preserveModulesRoot: string | undefined;
  sanitizeFileName: (fileName: string) => string;
  sourcemap: boolean | 'inline' | 'hidden';
  sourcemapBaseUrl: string | undefined;
  sourcemapExcludeSources: boolean;
  sourcemapFile: string | undefined;
  sourcemapFileNames: string | ((chunkInfo: PreRenderedChunk) => string) | undefined;
  sourcemapIgnoreList: SourcemapIgnoreListOption;
  sourcemapPathTransform: SourcemapPathTransformOption | undefined;
  strict: boolean;
  systemNullSetters: boolean;
  validate: boolean;
}

export type WarningHandlerWithDefault = (warning: RollupLog, defaultHandler: LoggingFunction) => void;

export interface SerializedTimings {
  [label: string]: [number, number, number];
}

export interface PreRenderedAsset {
  name: string | undefined;
  source: string | Uint8Array;
  type: 'asset';
}

export interface OutputAsset extends PreRenderedAsset {
  fileName: string;
  needsCodeReference: boolean;
}

export interface RenderedModule {
  readonly code: string | null;
  originalLength: number;
  removedExports: string[];
  renderedExports: string[];
  renderedLength: number;
}

export interface PreRenderedChunk {
  exports: string[];
  facadeModuleId: string | null;
  isDynamicEntry: boolean;
  isEntry: boolean;
  isImplicitEntry: boolean;
  moduleIds: string[];
  name: string;
  type: 'chunk';
}

export interface RenderedChunk extends PreRenderedChunk {
  dynamicImports: string[];
  fileName: string;
  implicitlyLoadedBefore: string[];
  importedBindings: {
    [imported: string]: string[];
  };
  imports: string[];
  modules: {
    [id: string]: RenderedModule;
  };
  referencedFiles: string[];
}

export interface OutputChunk extends RenderedChunk {
  code: string;
  map: SourceMap | null;
  sourcemapFileName: string | null;
  preliminaryFileName: string;
}

export interface SerializablePluginCache {
  [key: string]: [number, any];
}

export interface RollupCache {
  modules: ModuleJSON[];
  plugins?: Record<string, SerializablePluginCache>;
}

export interface RollupOutput {
  output: [OutputChunk, ...(OutputChunk | OutputAsset)[]];
}

export interface RollupBuild {
  cache: RollupCache | undefined;
  close: () => Promise<void>;
  closed: boolean;
  generate: (outputOptions: OutputOptions) => Promise<RollupOutput>;
  getTimings?: () => SerializedTimings;
  watchFiles: string[];
  write: (options: OutputOptions) => Promise<RollupOutput>;
}

export interface RollupOptions extends InputOptions {
  // This is included for compatibility with config files but ignored by rollup.rollup
  output?: OutputOptions | OutputOptions[];
}

export interface MergedRollupOptions extends InputOptionsWithPlugins {
  output: OutputOptions[];
}

export function rollup(options: RollupOptions): Promise<RollupBuild>;

export interface ChokidarOptions {
  alwaysStat?: boolean;
  atomic?: boolean | number;
  awaitWriteFinish?:
    | {
        pollInterval?: number;
        stabilityThreshold?: number;
      }
    | boolean;
  binaryInterval?: number;
  cwd?: string;
  depth?: number;
  disableGlobbing?: boolean;
  followSymlinks?: boolean;
  ignoreInitial?: boolean;
  ignorePermissionErrors?: boolean;
  ignored?: any;
  interval?: number;
  persistent?: boolean;
  useFsEvents?: boolean;
  usePolling?: boolean;
}

export type RollupWatchHooks = 'onError' | 'onStart' | 'onBundleStart' | 'onBundleEnd' | 'onEnd';

export interface WatcherOptions {
  buildDelay?: number;
  chokidar?: ChokidarOptions;
  clearScreen?: boolean;
  exclude?: string | RegExp | (string | RegExp)[];
  include?: string | RegExp | (string | RegExp)[];
  skipWrite?: boolean;
}

export interface RollupWatchOptions extends InputOptions {
  output?: OutputOptions | OutputOptions[];
  watch?: WatcherOptions | false;
}

export type AwaitedEventListener<T extends { [event: string]: (...parameters: any) => any }, K extends keyof T> = (
  ...parameters: Parameters<T[K]>
) => void | Promise<void>;

export interface AwaitingEventEmitter<T extends { [event: string]: (...parameters: any) => any }> {
  close(): Promise<void>;
  emit<K extends keyof T>(event: K, ...parameters: Parameters<T[K]>): Promise<unknown>;
  /**
   * Removes an event listener.
   */
  off<K extends keyof T>(event: K, listener: AwaitedEventListener<T, K>): this;
  /**
   * Registers an event listener that will be awaited before Rollup continues.
   * All listeners will be awaited in parallel while rejections are tracked via
   * Promise.all.
   */
  on<K extends keyof T>(event: K, listener: AwaitedEventListener<T, K>): this;
  /**
   * Registers an event listener that will be awaited before Rollup continues.
   * All listeners will be awaited in parallel while rejections are tracked via
   * Promise.all.
   * Listeners are removed automatically when removeListenersForCurrentRun is
   * called, which happens automatically after each run.
   */
  onCurrentRun<K extends keyof T>(
    event: K,
    listener: (...parameters: Parameters<T[K]>) => Promise<ReturnType<T[K]>>,
  ): this;
  removeAllListeners(): this;
  removeListenersForCurrentRun(): this;
}

export type RollupWatcherEvent =
  | { code: 'START' }
  | { code: 'BUNDLE_START'; input?: InputOption; output: readonly string[] }
  | {
      code: 'BUNDLE_END';
      duration: number;
      input?: InputOption;
      output: readonly string[];
      result: RollupBuild;
    }
  | { code: 'END' }
  | { code: 'ERROR'; error: RollupError; result: RollupBuild | null };

export type RollupWatcher = AwaitingEventEmitter<{
  change: (id: string, change: { event: ChangeEvent }) => void;
  close: () => void;
  event: (event: RollupWatcherEvent) => void;
  restart: () => void;
}>;

export function watch(config: RollupWatchOptions | RollupWatchOptions[]): RollupWatcher;

interface AstNode {
  end: number;
  start: number;
  type: string;
}

type ProgramNode = Program & AstNode;

export function defineConfig(options: RollupOptions): RollupOptions;
export function defineConfig(options: RollupOptions[]): RollupOptions[];
export function defineConfig(optionsFunction: RollupOptionsFunction): RollupOptionsFunction;

export type RollupOptionsFunction = (
  commandLineArguments: Record<string, any>,
) => MaybePromise<RollupOptions | RollupOptions[]>;
