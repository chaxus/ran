import type { Declaration, ExportDeclaration } from '../../astParser';
import { NodeType } from '../../astParser';
/**
 * @description: 是否为函数节点
 * @param {Declaration} node
 * @return {*}
 */
export function isFunctionDeclaration(node: Declaration): boolean {
  if (!node) return false;

  return (
    // function foo() {}
    node.type === 'FunctionDeclaration' ||
    // const foo = function() {}
    (node.type === NodeType.VariableDeclarator &&
      node.init &&
      node.init.type === NodeType.FunctionExpression) ||
    // export function ...
    // export default function
    ((node.type === NodeType.ExportNamedDeclaration ||
      node.type === NodeType.ExportDefaultDeclaration) &&
      !!node.declaration &&
      node.declaration.type === NodeType.FunctionDeclaration)
  );
}
/**
 * @description: 是否为 export 声明节点
 * @param {ExportDeclaration} node
 * @return {*}
 */
export function isExportDeclaration(node: ExportDeclaration): boolean {
  return /^Export/.test(node.type);
}
/**
 * @description: 是否为 import 声明节点
 * @param {any} node
 * @return {*}
 */
export function isImportDeclaration(node: any): boolean {
  return node.type === 'ImportDeclaration';
}
