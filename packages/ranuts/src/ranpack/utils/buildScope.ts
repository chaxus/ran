import { Scope } from '../ast/Scope';
import type { Statement } from '../statement';
import type {
  FunctionDeclaration,
  Node,
  VariableDeclaration,
  VariableDeclarator,
} from '../../astParser';
import { NodeType } from '../../astParser';
import { walk } from './walk';
/**
 * @description: 构建作用域链
 * @param {Statement} statement
 * @return {*}
 */
export function buildScope(statement: Statement): void {
  const { node, scope: initialScope } = statement;
  let scope = initialScope;
  // 遍历 AST
  walk(node, {
    // 遵循深度优先的原则，每进入和离开一个节点会触发 enter 和 leave 钩子
    // 如 a 的子节点为 b，那么触发顺序为 a-enter、b-enter、b-leave、a-leave
    enter(node: Node) {
      // function foo () {...}
      if (node.type === NodeType.FunctionDeclaration) {
        scope.addDeclaration(node, false);
      }
      // var let const
      if (node.type === NodeType.VariableDeclaration) {
        const currentNode = node as VariableDeclaration;
        const isBlockDeclaration = currentNode.kind !== 'var';
        currentNode.declarations.forEach((declarator: VariableDeclarator) => {
          scope.addDeclaration(declarator, isBlockDeclaration);
        });
      }

      let newScope;

      // function scope
      if (node.type === NodeType.FunctionDeclaration) {
        const currentNode = node as FunctionDeclaration;
        newScope = new Scope({
          parent: scope,
          block: false,
          paramNodes: currentNode.params,
          statement,
        });
      }

      // new block state
      if (node.type === NodeType.BlockStatement) {
        newScope = new Scope({
          parent: scope,
          block: true,
          statement,
        });
      }
      // 记录 Scope 父子关系
      if (newScope) {
        Object.defineProperty(node, '_scope', {
          value: newScope,
          configurable: true,
        });

        scope = newScope;
      }
    },
    leave(node: Node) {
      // 更新当前作用域
      // 当前 scope 即 node._scope
      if (node._scope && scope.parent) {
        scope = scope.parent;
      }
    },
  });
}
