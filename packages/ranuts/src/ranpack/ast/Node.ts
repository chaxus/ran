import type { Node as ASTNode } from '../../astParser'
import type { Scope } from './Scope'

export interface Node extends ASTNode {
  parent?: Node
  _scope?: Scope
}
