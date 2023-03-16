// 虚拟dom
import type { VNode } from './vnode'
import { vnode } from './vnode'

// 引入操作的dom api的相关方法
import type { DOMAPI } from './htmlDomApi'
import { htmlDomApi } from './htmlDomApi'
// 类型判断
import * as is from './is'
// 导入模块
import type { ModuleHook } from './modules';
import { modules } from './modules'

type NonUndefined<T> = T extends undefined ? never : T

type KeyToIndexMap = { [key: string]: number }

interface Cbs {
  [key: string]: ModuleHook[]
  create: Array<ModuleHook>
  update: Array<ModuleHook>
  destroy: Array<(oldVnode: VNode, vnode?: VNode) => void>
}

// 如果2个VNode节点的key和sel属性都相同，我们就认为它们是相同的VNode节点
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}

// 判断是否为Vnode
function isVnode(vnode: any): vnode is VNode {
  return vnode.sel !== undefined
}

// 根据children item的key属性，创建Key Map
function createKeyToOldIdx(
  children: VNode[],
  beginIdx: number,
  endIdx: number,
): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key] = i
    }
  }
  return map
}

// 创建一个空白VNode,用于createElm中触发create钩子函数时调用
const emptyNode = vnode('', {}, [], undefined, undefined)

export function init(): (oldVnode: VNode | Element, vnode: VNode) => VNode {
  // 获取操作html dom的api
  const api: DOMAPI = htmlDomApi

  // 用于缓存各个模块的钩子函数
  const cbs: Cbs = {
    create: [],
    update: [],
    destroy: [],
  }
  // 遍历cbs
  for (const key of Object.keys(cbs)) {
    // 初始化为数组
    cbs[key] = []
    // 遍历modules
    for (const module of Object.keys(modules)) {
      // 获取模块中对应的生命周期
      const hook = modules[module][key]
      // 如果生命周期有值
      if (hook !== undefined) {
        // 将其加入cbs对应的属性中
        cbs[key].push(hook)
      }
    }
  }

  // 创建一个只有标签名和选择器的空白VNode
  function emptyNodeAt(elm: Element) {
    const id = elm.id ? '#' + elm.id : ''
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : ''
    return vnode(
      api.tagName(elm).toLowerCase() + id + c,
      {},
      [],
      undefined,
      elm,
    )
  }

  // 判断是否为undefined
  function isUndef(s: unknown): boolean {
    return s === undefined
  }

  // 判断是否为defined
  function isDef<A>(s: A): s is NonUndefined<A> {
    return s !== undefined
  }

  // 根据VNode创建dom
  function createElm(vnode: VNode): Node {
    // 缓存循环children中的index
    let i: number
    // 缓存VNode的children
    const children = vnode.children
    // 缓存VNode的选择器
    const sel = vnode.sel
    // 把 vnode 转化成真实DOM对象（没有渲染到页面）
    if (sel === '!') {
      // 如果选择器是！，创建注释节点
      if (isUndef(vnode.text)) {
        vnode.text = ''
      }
      vnode.elm = api.createComment(`${vnode.text!}`)
    } else if (sel !== undefined) {
      // 如果选择器不为空，解析选择器
      // 缓存id
      const hashIdx = sel.indexOf('#')
      // 缓存class
      const dotIdx = sel.indexOf('.', hashIdx)
      // 缓存 # 的位置
      const hash = hashIdx > 0 ? hashIdx : sel.length
      // 缓存 . 的位置
      const dot = dotIdx > 0 ? dotIdx : sel.length
      // 缓存标签
      const tag =
        hashIdx !== -1 || dotIdx !== -1
          ? sel.slice(0, Math.min(hash, dot))
          : sel
      // 创建dom
      const elm = (vnode.elm = api.createElement(tag))
      // dom设置id
      if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
      // dom设置class
      if (dotIdx > 0)
        elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
      // 触发各个模块的create钩子函数
      for (i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode)
      }
      // 如果vnode中有子节点，创建子vnode对应的DOM元素并追加到DOM树上
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i]
          if (ch != null) {
            api.appendChild(elm, createElm(ch as VNode))
          }
        }
      } else if (is.primitive(vnode.text)) {
        // 如果有子文本节点，也创建并追加到DOM树上
        api.appendChild(elm, api.createTextNode(`${vnode.text!}`))
      }
    } else {
      // 如果选择器为空，创建文本节点
      vnode.elm = api.createTextNode(`${vnode.text!}`)
    }
    // 返回新创建的DOM
    return vnode.elm
  }

  // 根据VNode新增dom
  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
  ) {
    // 遍历传入的VNode数组，创建对应的dom，再将dom插入到指定的dom元素之前
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch), before)
      }
    }
  }

  // 触发destroy钩子函数
  function invokeDestroyHook(vnode: VNode) {
    // 获取VNode的data属性
    const data = vnode.data
    // 当data不为空时
    if (data !== undefined) {
      // 触发各个模块的destroy钩子函数
      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
      // 当VNode有子节点，且子节点不为字符串或数字，触发子节点VNode的destroy钩子函数
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j]
          if (
            child != null &&
            typeof child !== 'string' &&
            typeof child !== 'number'
          ) {
            invokeDestroyHook(child)
          }
        }
      }
    }
  }

  // 创建删除子节点dom的方法
  function createRmCb(childElm: Node) {
    return function rmCb() {
      // 这里是一个闭包将需要删除的dom节点缓存起来,方便之后调用rmCb方法删除
      const parent = api.parentNode(childElm) as Node
      api.removeChild(parent, childElm)
    }
  }

  // 删除VNode对应dom
  function removeVnodes(
    parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
  ): void {
    for (; startIdx <= endIdx; ++startIdx) {
      // 用于缓存删除dom的方法
      let rm: () => void
      // 获取当前要删除节点
      const ch = vnodes[startIdx]
      if (ch != null) {
        if (isDef(ch.sel)) {
          // 触发destroy钩子函数
          invokeDestroyHook(ch)
          /*
           * 在snabbdom中这里需要判断remove钩子函数是否全部调用,而我们terdom没有remove钩子函数,所以
           * 不需要判断
           */
          rm = createRmCb(ch.elm!)
          // 删除子节点
          rm()
        } else {
          // 删除文本节点
          api.removeChild(parentElm, ch.elm!)
        }
      }
    }
  }

  // 更新children
  function updateChildren(parentElm: Node, oldCh: VNode[], newCh: VNode[]) {
    // 旧VNode的children头索引
    let oldStartIdx = 0
    // 新VNode的children头索引
    let newStartIdx = 0
    // 旧VNode的children尾索引
    let oldEndIdx = oldCh.length - 1
    // 新VNode的children尾索引
    let newEndIdx = newCh.length - 1
    // 旧VNode的children的头VNode
    let oldStartVnode = oldCh[0]
    // 旧VNode的children的尾VNode
    let oldEndVnode = oldCh[oldEndIdx]
    // 新VNode的children的头VNode
    let newStartVnode = newCh[0]
    // 新VNode的children的尾VNode
    let newEndVnode = newCh[newEndIdx]
    // 旧VNode的children的Key Map
    let oldKeyToIdx: KeyToIndexMap | undefined
    // 用于缓存key相同的新旧VNode
    let idxInOld: number
    // 用于缓存将要移动的旧VNode
    let elmToMove: VNode
    // 用于缓存将要插入新增VNode的位置之前的VNode
    let before: any

    // 遍历新旧children数组，直到其中之一遍历完
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 我们之后可能会对oldStartVnode、oldEndVnode、newStartVnode、newEndVnode重新赋值，可能会出现等于null的情况
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx]
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx]
        // key 和 sel 相同，则就是相同节点
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 当旧头VNode和新头VNode是相同VNode时，将新头VNode差异更新到旧头VNode上，同时将新旧头索引后移
        // 对比两个节点，如果newVnode有vnodeData，
        // 执行update钩子，更新oldNode上的模块的内容
        // 更新加载过的模块里的内容
        // 判断节点的类型，文本节点直接替换，如果不是文本节点
        // 判断是否有子元素，更新子元素
        patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 当旧尾VNode和新尾VNode是相同VNode时，将新尾VNode差异更新到旧尾VNode上，同时将新旧尾索引前移
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        /**
         * 当旧头VNode和新尾VNode是相同节点时，将新尾VNode差异更新到旧头VNode上，然后将旧头VNode插入到旧尾VNode后
         * 最后将旧头索引后移，新尾索引前移
         */
        patchVnode(oldStartVnode, newEndVnode)
        api.insertBefore(parentElm,oldStartVnode.elm!,api.nextSibling(oldEndVnode.elm!))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        /**
         * 当旧尾VNode和新头VNode是相同节点时，将新头VNode差异更新到旧尾VNode上，然后将旧尾VNode插入到旧头VNode前
         * 最后将旧尾索引前移，新头索引后移
         */
        patchVnode(oldEndVnode, newStartVnode)
        api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 如果没有Key Map则创建Key Map，用于根据key来更新VNode
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        }
        // 根据Key Map获取当前新头VNode的对应的旧VNode的index
        idxInOld = oldKeyToIdx[newStartVnode.key as string]

        if (isUndef(idxInOld)) {
          // 如果没有设置key属性，直接根据新头VNode创建dom元素，插入到旧头VNode对应dom之前
          api.insertBefore(
            parentElm,
            createElm(newStartVnode),
            oldStartVnode.elm!,
          )
        } else {
          // 如果设置key属性，获取到key对应的旧VNode
          elmToMove = oldCh[idxInOld]
          if (elmToMove.sel !== newStartVnode.sel) {
            // 如果旧VNode和新VNode的sel属性不同，则直接创建新VNode对应的dom，插入到旧头VNode对应dom之前
            api.insertBefore(
              parentElm,
              createElm(newStartVnode),
              oldStartVnode.elm!,
            )
          } else {
            // 如果sel属性相同，则将新VNode数据更新到旧VNode上
            patchVnode(elmToMove, newStartVnode)
            // 删除旧children对应的VNode，代表已经更新过
            oldCh[idxInOld] = undefined as any
            // 创建VNode对应的dom，插入到旧头VNode对应dom之前
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
          }
        }
        // 将新头VNode设置为新children数组中新头索引后一位
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 循环完成后，当旧头索引小于等于旧尾索引，或新头索引大于等于新尾索引时，说明新旧children其中之一已经遍历完成
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      // 如果存在旧头索引大于旧尾索引情况，说明新children中新增了VNode
      if (oldStartIdx > oldEndIdx) {
        // 获取新增VNode后一位的VNode对应的dom
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
        // 将新增VNode对应dom插入对应dom树位置
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
      } else {
        // 删除多余dom节点
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
      }
    }
  }

  // 对比新旧vnode差异,将差异更新到旧VNode上。
  function patchVnode(oldVnode: VNode, vnode: VNode) {
    // 当VNode的data属性存在时,触发update钩子函数
    if (vnode.data !== undefined) {
      for (let i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode)
      }
    }

    // 由于是相同的VNode节点，使用新旧VNode的真实dom元素相同
    const elm = (vnode.elm = oldVnode.elm!)
    // 获取旧VNode的children
    const oldCh = oldVnode.children as VNode[]
    // 获取新VNode的children
    const ch = vnode.children as VNode[]

    // 如果新旧节点完全相同，直接返回
    if (oldVnode === vnode) return
    // 判断VNode是否为文本节点
    if (isUndef(vnode.text)) {
      // 如果不是文本节点，判断新旧VNode是否同时有children
      if (isDef(oldCh) && isDef(ch)) {
        // 如果同时有children属性，且children属性不相同就更新children
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch)
        }
      }
    }
  }

  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    // 缓存dom节点和父dom节点
    let elm: Node, parent: Node

    // 当oldVnode不是VNode时，说明是初次加载，创建一个空白VNode
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode)
    }

    // 判断是否为相同VNode节点
    if (sameVnode(oldVnode, vnode)) {
      // 更新VNode节点差异
      patchVnode(oldVnode, vnode)
    } else {
      // 获取旧VNode的dom
      elm = oldVnode.elm!
      // 获取父节点dom
      parent = api.parentNode(elm) as Node
      // 创建dom元素
      createElm(vnode)
      // 当父节点不为空时
      if (parent != null) {
        // 将新创建的dom插入dom树
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
        // 删除旧VNode节点
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }
    return vnode
  }
}
