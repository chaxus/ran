export interface Fragment extends DocumentFragment {
  parent: Node | null;
  firstChildNode: ChildNode | null;
  lastChildNode: ChildNode | null;
}

export interface DOMAPI {
  // 创建元素节点
  createElement: (
    tagName: any,
    options?: ElementCreationOptions,
  ) => HTMLElement;
  createElementNS: (
    namespaceURI: string,
    qualifiedName: string,
    options?: ElementCreationOptions,
  ) => Element;
  /**
   * @experimental
   * @todo Make it required when the fragment is considered stable.
   */
  createDocumentFragment?: () => Fragment;
  // 创建文本节点
  createTextNode: (text: string) => Text;
  // 创建注释节点
  createComment: (text: string) => Comment;
  // 在指定的已有子节点之前插入新的子节点。
  insertBefore: (
    parentNode: Node,
    newNode: Node,
    referenceNode: Node | null,
  ) => void;
  // 删除子节点
  removeChild: (node: Node, child: Node) => void;
  // 添加子节点
  appendChild: (node: Node, child: Node) => void;
  // 获取元素父节点
  parentNode: (node: Node) => Node | null;
  // 获取元素紧跟的节点
  nextSibling: (node: Node) => Node | null;
  // 获取元素标签名
  tagName: (elm: Element) => string;
  // 设置元素文本内容
  setTextContent: (node: Node, text: string | null) => void;
  // 获取元素文本内容
  getTextContent: (node: Node) => string | null;
  // 判定是否为元素节点
  isElement: (node: Node) => node is Element;
  // 判定是否为文本节点
  isText: (node: Node) => node is Text;
  // 判定是否为注释节点
  isComment: (node: Node) => node is Comment;
  /**
   * @experimental
   * @todo Make it required when the fragment is considered stable.
   */
  isDocumentFragment?: (node: Node) => node is DocumentFragment;
}

function createElement(
  tagName: any,
  options?: ElementCreationOptions,
): HTMLElement {
  return document.createElement(tagName, options);
}

function createElementNS(
  namespaceURI: string,
  qualifiedName: string,
  options?: ElementCreationOptions,
): Element {
  return document.createElementNS(namespaceURI, qualifiedName, options);
}

function createDocumentFragment(): Fragment {
  return parseFragment(document.createDocumentFragment());
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function createComment(text: string): Comment {
  return document.createComment(text);
}

function insertBefore(
  parentNode: Node,
  newNode: Node,
  referenceNode: Node | null,
): void {
  if (isDocumentFragment(parentNode)) {
    let node: Node | null = parentNode;
    while (node && isDocumentFragment(node)) {
      const fragment = parseFragment(node);
      node = fragment.parent;
    }
    parentNode = node ?? parentNode;
  }
  if (isDocumentFragment(newNode)) {
    newNode = parseFragment(newNode, parentNode);
  }
  if (referenceNode && isDocumentFragment(referenceNode)) {
    referenceNode = parseFragment(referenceNode).firstChildNode;
  }
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node: Node, child: Node): void {
  node.removeChild(child);
}

function appendChild(node: Node, child: Node): void {
  if (isDocumentFragment(child)) {
    child = parseFragment(child, node);
  }
  node.appendChild(child);
}

function parentNode(node: Node): Node | null {
  if (isDocumentFragment(node)) {
    while (node && isDocumentFragment(node)) {
      const fragment = parseFragment(node);
      node = fragment.parent as Node;
    }
    return node ?? null;
  }
  return node.parentNode;
}

function nextSibling(node: Node): Node | null {
  if (isDocumentFragment(node)) {
    const fragment = parseFragment(node);
    const parent = parentNode(fragment);
    if (parent && fragment.lastChildNode) {
      const children = Array.from(parent.childNodes);
      const index = children.indexOf(fragment.lastChildNode);
      return children[index + 1] ?? null;
    }
    return null;
  }
  return node.nextSibling;
}

function tagName(elm: Element): string {
  return elm.tagName;
}

function setTextContent(node: Node, text: string | null): void {
  node.textContent = text;
}

function getTextContent(node: Node): string | null {
  return node.textContent;
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

function isText(node: Node): node is Text {
  return node.nodeType === 3;
}

function isComment(node: Node): node is Comment {
  return node.nodeType === 8;
}

function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === 11;
}

function parseFragment(
  fragmentNode: DocumentFragment,
  parentNode?: Node | null,
): Fragment {
  const fragment = fragmentNode as Fragment;
  fragment.parent ??= parentNode ?? null;
  fragment.firstChildNode ??= fragmentNode.firstChild;
  fragment.lastChildNode ??= fragmentNode.lastChild;
  return fragment;
}

export const htmlDomApi: DOMAPI = {
  createElement,
  createElementNS,
  createTextNode,
  createDocumentFragment,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment,
  isDocumentFragment,
};
