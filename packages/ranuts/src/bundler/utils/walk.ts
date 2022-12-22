
import type { Statement } from '../../astParser';
import type {Node} from '../ast/Node'

let shouldSkip;
let shouldAbort: boolean;

type Enter = (node: Node, parent?:Node, prop?:string)=>void

/**
 * @description: 无论是构建作用域链还是记录引用节点，都离不开一个最基本的操作，那就是对 AST 进行遍历操作
 * @param {any} ast
 * @param {object} param2
 * @return {*}
 */
export function walk(ast: Statement, { enter, leave }: { enter: Enter; leave: Enter }):void {
  shouldAbort = false;
  visit(ast, undefined, enter, leave);
}

const context = {
  skip: () => (shouldSkip = true),
  abort: () => (shouldAbort = true)
};

const childKeys = {} as Record<string, string[]>;

const toString = Object.prototype.toString;

function isArray(thing: any) {
  return toString.call(thing) === '[object Array]';
}

function visit(node: Node, parent: Node | undefined, enter: Enter, leave: Enter, prop?: string) {
  if (!node || shouldAbort) return;

  if (enter) {
    shouldSkip = false;
    enter.call(context, node, parent, prop);
    if (shouldSkip || shouldAbort) return;
  }

  const keys =
    childKeys[node.type] ||
    (childKeys[node.type] = Object.keys(node).filter(
      (key) => typeof node[key as keyof Node] === 'object'
    ));

  let key, value:any;

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    value = node[key as keyof Node];
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        visit(value[j], node, enter, leave, key);
      }
    } else if (value && value.type) {
      visit(value, node, enter, leave, key);
    }
  }

  if (leave && !shouldAbort) {
    leave(node, parent, prop);
  }
}
