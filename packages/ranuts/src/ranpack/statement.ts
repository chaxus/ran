import type MagicString from 'magic-string';
import type {
  ExportAllDeclaration,
  ExportDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  Statement as StatementNode,
} from '../astParser';
import type { Reference } from './ast/Reference';
import { findReference } from './utils/findReference';
import { buildScope } from './utils/buildScope';
import {
  isExportDeclaration,
  isFunctionDeclaration,
  isImportDeclaration,
} from './utils/isFunctionDeclaration';
import { Scope } from './ast/Scope';
import type { Module } from './module';

/**
 * @description: 生成用于分析的 Statement 语句
 */
export class Statement {
  // acorn type problem
  node: StatementNode;
  magicString: MagicString;
  module: Module;
  scope: Scope;
  start: number;
  next: number;
  isImportDeclaration: boolean;
  isExportDeclaration: boolean;
  isReexportDeclaration: boolean;
  isFunctionDeclaration: boolean;
  isIncluded: boolean = false;
  defines: Set<string> = new Set();
  modifies: Set<string> = new Set();
  dependsOn: Set<string> = new Set();
  references: Reference[] = [];
  constructor(node: StatementNode, magicString: MagicString, module: Module) {
    this.magicString = magicString;
    this.node = node;
    this.module = module;
    this.scope = new Scope({
      statement: this,
    });
    this.start = node.start;
    this.next = 0;
    this.isImportDeclaration = isImportDeclaration(node);
    this.isExportDeclaration = isExportDeclaration(node as ExportDeclaration);
    this.isReexportDeclaration =
      this.isExportDeclaration &&
      !!(node as ExportAllDeclaration | ExportNamedDeclaration).source;
    this.isFunctionDeclaration = isFunctionDeclaration(
      node as FunctionDeclaration,
    );
  }

  analyze(): void {
    if (this.isImportDeclaration) return;
    // 1、构建作用域链，记录 Declaration 节点表
    buildScope(this);
    // 2. 寻找引用依赖，记录 Reference 节点表
    findReference(this);
  }

  mark(): void {
    if (this.isIncluded) {
      return;
    }
    this.isIncluded = true;
    this.references.forEach(
      (ref: Reference) => ref.declaration && ref.declaration.use(),
    );
  }
}
