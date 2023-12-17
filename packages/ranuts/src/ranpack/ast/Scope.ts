import type { Statement } from '../statement';
import { keys } from '../utils/object';
import { Declaration } from './Declaration';

interface ScopeOptions {
  parent?: Scope;
  paramNodes?: any[];
  block?: boolean;
  statement: Statement;
  isTopLevel?: boolean;
}
/**
 * @description: 封装作用域相关的基本信息
 * @return {*}
 */
export class Scope {
  // 父作用域
  parent?: Scope;
  // 如果是函数作用域，则需要参数节点
  paramNodes: any[];
  // 是否为块级作用域
  isBlockScope?: boolean;
  // 作用域对应的语句节点
  statement: Statement;
  // 变量/函数 声明节点，为 Scope 的核心数据
  declarations: Record<string, Declaration> = {};
  constructor(options: ScopeOptions) {
    const { parent, paramNodes, block, statement } = options;
    this.parent = parent;
    this.paramNodes = paramNodes || [];
    this.statement = statement;
    this.isBlockScope = !!block;
    this.paramNodes.forEach((node) => (this.declarations[node.name] = new Declaration(node, true, this.statement)));
  }

  addDeclaration(node: any, isBlockDeclaration: boolean): void {
    // block scope & var, 向上追溯，直到顶层作用域
    if (this.isBlockScope && !isBlockDeclaration && this.parent) {
      this.parent.addDeclaration(node, isBlockDeclaration);
      return;
    }
    // 否则在当前作用域新建声明节点(Declaration)
    // 变量声明 函数声明
    // if (
    //   node.type === 'VariableDeclaration' ||
    //   node.type === 'FunctionDeclaration'
    // ) {
    const key = node.id && node.id.name;
    this.declarations[key] = new Declaration(node, false, this.statement);
    // }
  }
  /**
   * @description: 遍历声明节点(Declaration)
   * @param {function} fn
   * @return {*}
   */
  eachDeclaration(fn: (name: string, dec: Declaration) => void): void {
    keys(this.declarations).forEach((key) => {
      fn(key, this.declarations[key]);
    });
  }

  contains(name: string): Declaration {
    return this.findDeclaration(name);
  }

  findDeclaration(name: string): Declaration {
    return this.declarations[name] || (this.parent && this.parent.findDeclaration(name));
  }
}
