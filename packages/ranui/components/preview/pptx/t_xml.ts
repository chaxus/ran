let _order = 1;

type Children = Array<
  | {
      children: Children | undefined;
      tagName: string;
      attrs: Record<string, string>;
    }
  | string
>;

interface Attrs {
  [x: string]: string | number | undefined;
  order?: number;
}

interface Node {
  [x: string]: Array<{ length: number } | Record<string, Attrs> | undefined>;
}

export default function t_xml(S: string): Record<string, any> {
  const openBracket = '<';
  const openBracketCC = '<'.charCodeAt(0);
  const closeBracket = '>';
  const closeBracketCC = '>'.charCodeAt(0);
  const minusCC = '-'.charCodeAt(0);
  const slashCC = '/'.charCodeAt(0);
  const exclamationCC = '!'.charCodeAt(0);
  const singleQuoteCC = "'".charCodeAt(0);
  const doubleQuoteCC = '"'.charCodeAt(0);
  const questionMarkCC = '?'.charCodeAt(0);

  const nameSpacer = '\r\n\t>/= ';

  let pos = 0;

  function parseChildren(): Children {
    const children = [];
    while (S[pos]) {
      if (S.charCodeAt(pos) === openBracketCC) {
        if (S.charCodeAt(pos + 1) === slashCC) {
          pos = S.indexOf(closeBracket, pos);
          return children;
        } else if (S.charCodeAt(pos + 1) === exclamationCC) {
          if (S.charCodeAt(pos + 2) === minusCC) {
            while (
              !(
                S.charCodeAt(pos) === closeBracketCC &&
                S.charCodeAt(pos - 1) === minusCC &&
                S.charCodeAt(pos - 2) === minusCC &&
                pos !== -1
              )
            ) {
              pos = S.indexOf(closeBracket, pos + 1);
            }
            if (pos === -1) {
              pos = S.length;
            }
          } else {
            pos += 2;
            for (; S.charCodeAt(pos) !== closeBracketCC; pos++) {}
          }
          pos++;
          continue;
        } else if (S.charCodeAt(pos + 1) === questionMarkCC) {
          pos = S.indexOf(closeBracket, pos);
          pos++;
          continue;
        }
        pos++;
        let startNamePos = pos;
        for (; nameSpacer.indexOf(S[pos]) === -1; pos++) {}
        const nodeTagName = S.slice(startNamePos, pos);

        let attrFound = false;
        let nodeAttributes: Record<string, string> = {};
        for (; S.charCodeAt(pos) !== closeBracketCC; pos++) {
          const c = S.charCodeAt(pos);
          if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
            startNamePos = pos;
            for (; nameSpacer.indexOf(S[pos]) === -1; pos++) {}
            const name = S.slice(startNamePos, pos);
            let code = S.charCodeAt(pos);
            while (code !== singleQuoteCC && code !== doubleQuoteCC) {
              pos++;
              code = S.charCodeAt(pos);
            }

            const startChar = S[pos];
            const startStringPos = ++pos;
            pos = S.indexOf(startChar, startStringPos);
            const value = S.slice(startStringPos, pos);
            if (!attrFound) {
              nodeAttributes = {};
              attrFound = true;
            }
            nodeAttributes[name] = value;
          }
        }

        let nodeChildren;
        if (S.charCodeAt(pos - 1) !== slashCC) {
          pos++;
          nodeChildren = parseChildren();
        }

        children.push({
          children: nodeChildren,
          tagName: nodeTagName,
          attrs: nodeAttributes,
        });
      } else {
        const startTextPos = pos;
        pos = S.indexOf(openBracket, pos) - 1;
        if (pos === -2) {
          pos = S.length;
        }
        const text = S.slice(startTextPos, pos + 1);
        if (text.trim().length > 0) {
          children.push(text);
        }
      }
      pos++;
    }
    return children;
  }

  _order = 1;
  return simplefy(parseChildren());
}

function simplefy(children?: Children): Record<string, any> {
  const node: Node = {};

  if (children === undefined) {
    return {};
  }

  if (children.length === 1 && (typeof children[0] === 'string' || children[0] instanceof String)) {
    return new String(children[0]);
  }

  children.forEach(function (child) {
    if (typeof child !== 'string') {
      if (!node[child.tagName]) {
        node[child.tagName] = [];
      }
    }
    if (typeof child === 'object') {
      const kids = simplefy(child.children);
      if (child.attrs) {
        kids.attrs = child.attrs;
      }

      if (kids['attrs'] === undefined) {
        kids['attrs'] = { order: _order };
      } else {
        kids['attrs']['order'] = _order;
      }
      _order++;
      node[child.tagName].push(kids);
    }
  });

  for (const i in node) {
    if (node[i].length === 1) {
      node[i] = node[i][0] as Array<{ length: number } | Record<string, Attrs> | undefined>;
    }
  }

  return node;
}
