import type { Declaration, ExportDeclaration} from '../../astParser';
import { NodeType } from '../../astParser';

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

export function isExportDeclaration(node: ExportDeclaration): boolean {
  return /^Export/.test(node.type);
}

export function isImportDeclaration(node: any):boolean {
  return node.type === 'ImportDeclaration';
}
