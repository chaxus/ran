let shouldSkip;
let shouldAbort: boolean;

export function walk(ast: any, { enter, leave }: { enter: any; leave: any }):void {
  shouldAbort = false;
  visit(ast, null, enter, leave);
}

let context = {
  skip: () => (shouldSkip = true),
  abort: () => (shouldAbort = true)
};

let childKeys = {} as Record<string, string[]>;

let toString = Object.prototype.toString;

function isArray(thing: Object) {
  return toString.call(thing) === '[object Array]';
}

function visit(node: any, parent: any, enter: any, leave: any, prop?: string) {
  if (!node || shouldAbort) return;

  if (enter) {
    shouldSkip = false;
    enter.call(context, node, parent, prop);
    if (shouldSkip || shouldAbort) return;
  }

  let keys =
    childKeys[node.type] ||
    (childKeys[node.type] = Object.keys(node).filter(
      (key) => typeof node[key] === 'object'
    ));

  let key, value;

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    value = node[key];

    if (isArray(value)) {
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
