import MagicString from 'magic-string';
import type { Statement as StatementNode } from '../astParser';
import { parse } from '../astParser';
import type { Bundle } from './bundle';
import { Statement } from './statement';
import type { ModuleLoader } from './moduleLoader';
import type {
  Declaration} from './ast/Declaration';
import {
  SyntheticDefaultDeclaration,
  SyntheticNamespaceDeclaration
} from './ast/Declaration';
import { keys } from './utils/object';

export interface ModuleOptions {
  path: string;
  bundle: Bundle;
  loader: ModuleLoader;
  code: string;
  isEntry: boolean;
}

interface ImportOrExportInfo {
  source?: string;
  localName: string;
  name: string;
  statement?: Statement;
  isDeclaration?: boolean;
  module?: Module;
}

interface Specifier {
  type: string;
  local: {
    name: string;
  };
  imported: {
    name: string;
  };
  exported: {
    name: string;
  };
}

type Imports = Record<string, ImportOrExportInfo>;
type Exports = Record<string, ImportOrExportInfo>;

export class Module {
  isEntry: boolean = false;
  id: string;
  path: string;
  bundle: Bundle;
  moduleLoader: ModuleLoader;
  code: string;
  magicString: MagicString;
  statements: Statement[];
  imports: Imports;
  exports: Exports;
  reexports: Exports;
  exportAllSources: string[] = [];
  exportAllModules: Module[] = [];
  declarations: Record<string, Declaration>;
  dependencies: string[] = [];
  dependencyModules: Module[] = [];
  referencedModules: Module[] = [];
  constructor({ path, bundle, code, loader, isEntry = false }: ModuleOptions) {
    this.id = path;
    this.bundle = bundle;
    this.moduleLoader = loader;
    this.isEntry = isEntry;
    this.path = path;
    this.code = code;
    this.magicString = new MagicString(code);
    this.imports = {};
    this.exports = {};
    this.reexports = {};
    this.declarations = {};
    try {
      const ast = parse(code) as any;

      const nodes = ast.body as StatementNode[];
      // 以语句(Statement)的维度来拆分 Module，保存 statement 的集合，供之后分析
      this.statements = nodes.map((node) => {
        const magicString = this.magicString.snip(node.start, node.end);
        return new Statement(node, magicString, this);
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    // 分析 AST 节点
    this.analyseAST();
  }

  analyseAST():void {
    // 以语句为最小单元来分析
    this.statements.forEach((statement) => {
       // 对 statement 进行分析
      statement.analyse();
      if (statement.isImportDeclaration) {
        this.addImports(statement);
      } else if (statement.isExportDeclaration) {
        this.addExports(statement);
      }
      // 注册顶层声明
      if (!statement.scope.parent) {
        statement.scope.eachDeclaration((name, declaration) => {
          this.declarations[name] = declaration;
        });
      }
    });
    // 注册 statement 的 next 属性，用于生成代码使用，next 即下一个 statement 的起始位置
    const statements = this.statements;
    let next = this.code.length;
    for (let i = statements.length - 1; i >= 0; i--) {
      statements[i].next = next;
      next = statements[i].start;
    }
    // console.log('module:', this.path, this.declarations);
  }

  addDependencies(source: string):void {
    if (!this.dependencies.includes(source)) {
      this.dependencies.push(source);
    }
  }

  addImports(statement: Statement):void {
    const node = statement.node as any;
    const source = node.source.value;
    // import
    node.specifiers.forEach((specifier: Specifier) => {
      const isDefault = specifier.type === 'ImportDefaultSpecifier';
      const isNamespace = specifier.type === 'ImportNamespaceSpecifier';
      const localName = specifier.local.name;
      const name = isDefault
        ? 'default'
        : isNamespace
        ? '*'
        : specifier.imported.name;
      this.imports[localName] = { source, name, localName };
    });
    this.addDependencies(source);
  }

  addExports(statement: Statement):void {
    const node = statement.node as any;
    const source = node.source && node.source.value;
    if (node.type === 'ExportNamedDeclaration') {
      // export { a, b } from 'mod'
      if (node.specifiers.length) {
        node.specifiers.forEach((specifier: Specifier) => {
          const localName = specifier.local.name;
          const exportedName = specifier.exported.name;
          this.exports[exportedName] = {
            localName,
            name: exportedName
          };
          if (source) {
            this.reexports[localName] = {
              statement,
              source,
              localName,
              name: localName,
              module: undefined
            };
            this.imports[localName] = {
              source,
              localName,
              name: localName
            };
            this.addDependencies(source);
          }
        });
      } else {
        const declaration = node.declaration;
        let name;
        if (declaration.type === 'VariableDeclaration') {
          // export const foo = 2;
          name = declaration.declarations[0].id.name;
        } else {
          // export function foo() {}
          name = declaration.id.name;
        }
        this.exports[name] = {
          statement,
          localName: name,
          name
        };
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      const identifier =
        // export default foo;
        (node.declaration.id && node.declaration.id.name) ||
        // export defualt function foo(){}
        node.declaration.name;

      this.exports['default'] = {
        statement,
        localName: identifier,
        name: 'default'
      };
      this.declarations['default'] = new SyntheticDefaultDeclaration(
        node,
        identifier,
        statement
      );
    } else if (node.type === 'ExportAllDeclaration') {
      // export * from 'mod'
      if (source) {
        this.exportAllSources.push(source);
        this.addDependencies(source);
      }
    }
  }

  bind():void {
    this.bindImportSpecifiers();
    this.bindReferences();
  }

  bindImportSpecifiers():void {
    [...Object.values(this.imports), ...Object.values(this.reexports)].forEach(
      (specifier) => {
        specifier.module = this._getModuleBySource(specifier.source!);
      }
    );
    this.exportAllModules = this.exportAllSources.map(
      this._getModuleBySource.bind(this)
    );
    // 建立模块依赖图
    this.dependencyModules = this.dependencies.map(
      this._getModuleBySource.bind(this)
    );
    this.dependencyModules.forEach((module) => {
      module.referencedModules.push(this);
    });
  }

  bindReferences():void {
    // 处理 default 导出
    if (this.declarations['default'] && this.exports['default'].localName) {
      const declaration = this.trace(this.exports['default'].localName);
      if (declaration) {
        (this.declarations['default'] as SyntheticDefaultDeclaration).bind(
          declaration
        );
      }
    }
    this.statements.forEach((statement) => {
      statement.references.forEach((reference) => {
        // 根据引用寻找声明的位置
        // 寻找顺序: 1. statement 2. 当前模块 3. 依赖模块
        const declaration =
          reference.scope.findDeclaration(reference.name) ||
          this.trace(reference.name);
        if (declaration) {
          declaration.addReference(reference);
        }
      });
    });
  }
  getOrCreateNamespace():Declaration {
    if (!this.declarations['*']) {
      this.declarations['*'] = new SyntheticNamespaceDeclaration(this);
    }
    return this.declarations['*'];
  }
  trace(name: string):Declaration | null {
    if (this.declarations[name]) {
      // 从当前模块找
      return this.declarations[name];
    }
    if (this.imports[name]) {
      const importSpecifier = this.imports[name];
      const importModule = importSpecifier.module!;
      if (importSpecifier.name === '*') {
        return importModule.getOrCreateNamespace();
      }
      // 从依赖模块找
      const declaration = importModule.traceExport(importSpecifier.name);
      if (declaration) {
        return declaration;
      }
    }
    return null;
  }

  traceExport(name: string): Declaration | null {
    // 1. reexport
    // export { foo as bar } from './mod'
    const reexportDeclaration = this.reexports[name];
    if (reexportDeclaration) {
      // 说明是从其它模块 reexport 出来的
      // 经过 bindImportSpecifier 方法处理，现已绑定 module
      const declaration = reexportDeclaration.module!.traceExport(
        reexportDeclaration.localName
      );
      if (!declaration) {
        throw new Error(
          `${reexportDeclaration.localName} is not exported by module ${
            reexportDeclaration.module!.path
          }(imported by ${this.path})`
        );
      }
      return declaration;
    }
    // 2. export
    // export { foo }
    const exportDeclaration = this.exports[name];
    if (exportDeclaration) {
      const declaration = this.trace(name);
      if (declaration) {
        return declaration;
      }
    }
    // 3. export all
    for (const exportAllModule of this.exportAllModules) {
      const declaration = exportAllModule.trace(name);
      if (declaration) {
        return declaration;
      }
    }
    return null;
  }

  render():MagicString {
    const source = this.magicString.clone().trim();
    this.statements.forEach((statement) => {
      // 1. Tree Shaking
      if (!statement.isIncluded) {
        source.remove(statement.start, statement.next);
        return;
      }
      // 2. 重写引用位置的变量名 -> 对应的声明位置的变量名
      statement.references.forEach((reference) => {
        const { start, end } = reference;
        const declaration = reference.declaration;
        if (declaration) {
          const name = declaration.render();
          source.overwrite(start, end, name!);
        }
      });
      // 3. 擦除/重写 export 相关的代码
      if (statement.isExportDeclaration && !this.isEntry) {
        // export { foo, bar }
        if (
          statement.node.type === 'ExportNamedDeclaration' &&
          statement.node.specifiers.length
        ) {
          source.remove(statement.start, statement.next);
        }
        // remove `export` from `export const foo = 42`
        else if (
          statement.node.type === 'ExportNamedDeclaration' &&
          (statement.node.declaration!.type === 'VariableDeclaration' ||
            statement.node.declaration!.type === 'FunctionDeclaration')
        ) {
          source.remove(
            statement.node.start,
            statement.node.declaration!.start
          );
        }
        // remove `export * from './mod'`
        else if (statement.node.type === 'ExportAllDeclaration') {
          source.remove(statement.start, statement.next);
        }
        // export default
        else if (statement.node.type === 'ExportDefaultDeclaration') {
          const defaultDeclaration = this.declarations['default'];
          const defaultName = defaultDeclaration.render();

          // export default function() {}  -> function a() {}
          if (statement.node.declaration.type === 'FunctionDeclaration') {
            if (statement.node.declaration.id) {
              // export default function foo() {} -> const a = funciton foo() {}
              source.overwrite(
                statement.node.start,
                statement.node.declaration.start,
                `const ${defaultName} = `
              );
            } else {
              source.overwrite(
                statement.node.start,
                statement.node.declaration.start + 8,
                `function ${defaultName}`
              );
            }
          } else {
            // export default () => {}
            // export default Foo;
            source.overwrite(
              statement.node.start,
              statement.node.declaration.start,
              `const ${defaultName} = `
            );
          }
        }
      }
    });
    // 4. 单独处理 namespace 导出
    if (this.declarations['*']) {
      const namespaceDeclaration = this.declarations[
        '*'
      ] as SyntheticNamespaceDeclaration;
      if (namespaceDeclaration.needsNamespaceBlock) {
        source.append(`\n\n${namespaceDeclaration.renderBlock()}\n`);
      }
    }
    return source.trim();
  }

  getExports(): string[] {
    return [
      ...keys(this.exports),
      ...keys(this.reexports),
      ...this.exportAllModules
        .map((module) =>
          module.getExports().filter((name: string) => name !== 'default')
        )
        .flat()
    ];
  }

  private _getModuleBySource(source: string) {
    const id = this.moduleLoader.resolveId(source!, this.path) as string;
    return this.bundle.getModuleById(id);
  }
}
