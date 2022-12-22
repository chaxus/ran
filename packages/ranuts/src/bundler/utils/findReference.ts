import type { Statement } from '../statement';
import { Reference } from '../ast/Declaration';
import { walk } from './walk';

function isReference(node: any, parent: any): boolean {
  if (node.type === 'MemberExpression' && parent.type !== 'MemberExpression') {
    return true;
  }
  if (node.type === 'Identifier') {
    // export { foo as bar }
    if (parent.type === 'ExportSpecifier' && node !== parent.local)
      return false;
    return true;
  }
  return false;
}

export function findReference(statement: Statement):void {
  const { references, scope: initialScope, node } = statement;
  let scope = initialScope;
  walk(node, {
    enter(node: any, parent: any) {
      if (node._scope) scope = node._scope;
      if (isReference(node, parent)) {
        const reference = new Reference(node, scope, statement);
        references.push(reference);
      }
    },
    leave(node: any) {
      if (node._scope && scope.parent) {
        scope = scope.parent;
      }
    }
  });
}
