// Virtual DOM
import type { VNode } from './vnode';
import { vnode } from './vnode';
// The DOM API helpers used to touch real nodes
import type { DOMAPI } from './htmlDomApi';
import { htmlDomApi } from './htmlDomApi';
// Type guards
import * as is from './is';
// Modules
import type { ModuleHook } from './modules';
import { modules } from './modules';

type NonUndefined<T> = T extends undefined ? never : T;

type KeyToIndexMap = Record<string, number>;

interface Cbs {
  [key: string]: ModuleHook[];
  create: Array<ModuleHook>;
  update: Array<ModuleHook>;
  destroy: Array<(oldVnode: VNode, vnode?: VNode) => void>;
}

// Two VNodes count as the same node when both their key and sel match
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

// Is this a VNode?
function isVnode(vnode: any): vnode is VNode {
  return vnode.sel !== undefined;
}

// Build a key → index map from the children's key attributes
function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {
  const map: KeyToIndexMap = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key;
    if (key !== undefined) {
      map[key] = i;
    }
  }
  return map;
}

// A blank VNode, passed to the create hooks fired from createElm
const emptyNode = vnode('', {}, [], undefined, undefined);

export function init(): (oldVnode: VNode | Element, vnode: VNode) => VNode {
  // The API used to manipulate the HTML DOM
  const api: DOMAPI = htmlDomApi;

  // Hook functions collected per module
  const cbs: Cbs = {
    create: [],
    update: [],
    destroy: [],
  };
  // Walk the hook names
  for (const key of Object.keys(cbs)) {
    // Start each as an array
    cbs[key] = [];
    // Walk the modules
    for (const module of Object.keys(modules)) {
      // Look up this lifecycle hook on the module
      const hook = modules[module][key];
      // When the module defines it
      if (hook !== undefined) {
        // Collect it under the matching hook name
        cbs[key].push(hook);
      }
    }
  }

  // A blank VNode carrying only a tag name / selector
  function emptyNodeAt(elm: Element) {
    const id = elm.id ? '#' + elm.id : '';
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
  }

  // Is it undefined?
  function isUndef(s: unknown): boolean {
    return s === undefined;
  }

  // Is it defined?
  function isDef<A>(s: A): s is NonUndefined<A> {
    return s !== undefined;
  }

  // Create a real DOM node from a VNode
  function createElm(vnode: VNode): Node {
    // Index while looping over children
    let i: number;
    // The VNode's children
    const children = vnode.children;
    // The VNode's selector
    const sel = vnode.sel;
    // Turn the vnode into a real DOM object (not yet in the document)
    if (sel === '!') {
      // A '!' selector means a comment node
      if (isUndef(vnode.text)) {
        vnode.text = '';
      }
      vnode.elm = api.createComment(`${vnode.text!}`);
    } else if (sel !== undefined) {
      // A non-empty selector is parsed
      // id part
      const hashIdx = sel.indexOf('#');
      // class part
      const dotIdx = sel.indexOf('.', hashIdx);
      // position of '#'
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      // position of '.'
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      // tag name
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      // Create the element
      const elm = (vnode.elm = api.createElement(tag));
      // Apply the id
      if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
      // Apply the classes
      if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
      // Fire every module's create hook
      for (i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode);
      }
      // With child vnodes, create their DOM elements and append them
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.appendChild(elm, createElm(ch as VNode));
          }
        }
      } else if (is.primitive(vnode.text)) {
        // A text child is created and appended too
        api.appendChild(elm, api.createTextNode(`${vnode.text!}`));
      }
    } else {
      // An empty selector means a text node
      vnode.elm = api.createTextNode(`${vnode.text!}`);
    }
    // Return the newly created DOM node
    return vnode.elm;
  }

  // Insert DOM nodes for a range of VNodes
  function addVnodes(parentElm: Node, before: Node | null, vnodes: VNode[], startIdx: number, endIdx: number) {
    // For each VNode create its DOM node and insert it before the given element
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch), before);
      }
    }
  }

  // Fire the destroy hooks
  function invokeDestroyHook(vnode: VNode) {
    // The VNode's data
    const data = vnode.data;
    // Only when data is present
    if (data !== undefined) {
      // Fire every module's destroy hook
      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      // Recurse into child VNodes (skipping string / number children)
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j];
          if (child != null && typeof child !== 'string' && typeof child !== 'number') {
            invokeDestroyHook(child);
          }
        }
      }
    }
  }

  // Build the callback that removes a child DOM node
  function createRmCb(childElm: Node) {
    return function rmCb() {
      // A closure holding the node to remove, so calling rmCb later deletes it
      const parent = api.parentNode(childElm) as Node;
      api.removeChild(parent, childElm);
    };
  }

  // Remove the DOM nodes of a range of VNodes
  function removeVnodes(parentElm: Node, vnodes: VNode[], startIdx: number, endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      // The removal callback
      let rm: () => void;
      // The node being removed
      const ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          // Fire the destroy hooks
          invokeDestroyHook(ch);
          /*
           * A full implementation would wait here until every remove hook has fired;
           * this DOM layer has no remove hooks, so there is nothing to wait for.
           */
          rm = createRmCb(ch.elm!);
          // Remove the child node
          rm();
        } else {
          // Remove the text node
          api.removeChild(parentElm, ch.elm!);
        }
      }
    }
  }

  // Reconcile children
  function updateChildren(parentElm: Node, oldCh: VNode[], newCh: VNode[]) {
    // Head index into the old children
    let oldStartIdx = 0;
    // Head index into the new children
    let newStartIdx = 0;
    // Tail index into the old children
    let oldEndIdx = oldCh.length - 1;
    // Tail index into the new children
    let newEndIdx = newCh.length - 1;
    // Old children's head VNode
    let oldStartVnode = oldCh[0];
    // Old children's tail VNode
    let oldEndVnode = oldCh[oldEndIdx];
    // New children's head VNode
    let newStartVnode = newCh[0];
    // New children's tail VNode
    let newEndVnode = newCh[newEndIdx];
    // key → index map over the old children
    let oldKeyToIdx: KeyToIndexMap | undefined;
    // The old VNode matching the new one by key
    let idxInOld: number;
    // The old VNode about to be moved
    let elmToMove: VNode;
    // The VNode a newly added one is inserted before
    let before: any;

    // Walk both children arrays until one of them is exhausted
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // The four cursors get reassigned below and may become null
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx];
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
        // Same key and sel — the same node
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // Old head matches new head: patch it and advance both head cursors
        // Comparing two nodes: when the new one carries vnode data,
        // run the update hooks so each module refreshes the old node,
        // updating whatever the loaded modules own,
        // then branch on node type: a text node is replaced outright, otherwise
        // check for children and reconcile them
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // Old tail matches new tail: patch it and move both tail cursors back
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        /**
         * Old head matches new tail: patch the new tail onto the old head, move that node
         * after the old tail, then advance the old head cursor and pull the new tail back.
         */
        patchVnode(oldStartVnode, newEndVnode);
        api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        /**
         * Old tail matches new head: patch the new head onto the old tail, move that node
         * before the old head, then pull the old tail cursor back and advance the new head.
         */
        patchVnode(oldEndVnode, newStartVnode);
        api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        // Build the key map on first need, so VNodes can be matched by key
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        // Look up the old index of the current new head VNode
        idxInOld = oldKeyToIdx[newStartVnode.key as string];

        if (isUndef(idxInOld)) {
          // No key: create the element from the new head VNode and insert it before the old head's DOM
          api.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.elm!);
        } else {
          // Keyed: fetch the old VNode for that key
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            // Different sel: create the new element and insert it before the old head's DOM
            api.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.elm!);
          } else {
            // Same sel: patch the new data onto the old VNode
            patchVnode(elmToMove, newStartVnode);
            // Clear the slot in the old children to mark it as consumed
            oldCh[idxInOld] = undefined as any;
            // Move its DOM node in front of the old head's DOM
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
          }
        }
        // Advance to the next new head VNode
        newStartVnode = newCh[++newStartIdx];
      }
    }
    // After the loop, one of the two children arrays has been fully walked
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      // Old cursors crossed: the new children added VNodes
      if (oldStartIdx > oldEndIdx) {
        // The DOM node the additions go before
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        // Insert the added VNodes' DOM nodes there
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
      } else {
        // Otherwise remove the leftover DOM nodes
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  // Diff two VNodes and apply the differences to the old one.
  function patchVnode(oldVnode: VNode, vnode: VNode) {
    // Fire the update hooks when the VNode carries data
    if (vnode.data !== undefined) {
      for (let i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
    }

    // Same VNode, so both share one real DOM element
    const elm = (vnode.elm = oldVnode.elm!);
    // Old children
    const oldCh = oldVnode.children as VNode[];
    // New children
    const ch = vnode.children as VNode[];

    // Identical nodes need no work
    if (oldVnode === vnode) return;
    // Is this a text node?
    if (isUndef(vnode.text)) {
      // Not text: do both VNodes have children?
      if (isDef(oldCh) && isDef(ch)) {
        // Both have children, and they differ — reconcile them
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch);
        }
      }
    }
  }

  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    // The DOM node and its parent
    let elm: Node, parent: Node;

    // A non-VNode oldVnode means first mount — wrap it in a blank VNode
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    // Same VNode?
    if (sameVnode(oldVnode, vnode)) {
      // Patch the differences
      patchVnode(oldVnode, vnode);
    } else {
      // The old VNode's DOM node
      elm = oldVnode.elm!;
      // Its parent
      parent = api.parentNode(elm) as Node;
      // Create the new element
      createElm(vnode);
      // With a parent present
      if (parent != null) {
        // Insert the new node into the tree
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
        // and remove the old VNode
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    return vnode;
  };
}
