type InventedElementProps = any

type FiberProps = any

type AuthenticElement = any

interface InventedElement {
  type: string
  props: InventedElementProps
}

interface Fiber {
  props?: FiberProps
  type: string
  effectTag?: string // 操作的标记
  child?: Fiber // 子节点
  sibling?: Fiber // 兄弟节点
  return?: Fiber // 指向父节点
  dom?: AuthenticElement // 判断是不是根节点
  alternate?: Fiber // 记录上次的状态，进行diff对比
}

/**
 * @description: 创建文本虚拟DOM
 * @param {string} text
 * @return {VirtualDom}
 */
function createTextInventedElement(text: string): InventedElement {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
/**
 * @description: 创建虚拟DOM，参考React源码：https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js
 * @param {string} type
 * @param {VirtualDomProps} props
 * @param {array} children
 * @return {VirtualDom}
 */
function createElement(
  type: string,
  config: InventedElementProps,
  children: Array<InventedElement>,
): InventedElement {
  const props = {
    ...config,
    // children也要放到props里面去，这样我们在组件里面就能通过this.props.children拿到子元素
    children: children.map((child) => {
      return typeof child === 'object'
        ? child
        : createTextInventedElement(child)
    }),
  }
  // 核心逻辑不复杂，将参数都塞到一个对象上返回就行
  return { type, props }
}

/**
 * @description: 将fiber渲染成真实DOM, 参考react源码：https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMLegacy.js
 * @param {VirtualDom} element
 * @return {RealDom}
 */
function fiberToAuthenticElement(fiber: Fiber): AuthenticElement {
  // 检查当前节点是文本还是对象
  if (fiber.type === 'TEXT') {
    return document.createTextNode(fiber.props.nodeValue)
  }
  const dom = document.createElement(fiber.type)
  for (const prop in fiber.props) {
    // 将fiber上除了props属性都挂载到真正的DOM上去
    if (prop.startsWith('on')) {
      // 处理监听事件
      dom.addEventListener(prop.toLowerCase(), fiber.props[prop], false)
    } else {
      dom.setAttribute(prop, fiber.props[prop])
    }
  }
  return dom
}
/**
 * @description: 虚拟DOM转Fiber，用于替代虚拟DOM直接diff和转真实DOM。转成fiber后再一次性render，也叫commit。
 * @return {*}
 */
function reconcile(fiber: Fiber) {
  // 把虚拟DOM 的 render 和 patch阶段，变成了虚拟DOM转fiber的reconcile，同时空闲时才转schedule，转完后一次性commitFiber
  // 用于解决虚拟DOM转真实DOM时，render和patch时间过长的问题。只解决了patch时候问题。
  reconcileFiberNode(fiber)
  // 这个函数的返回值是下一个任务，这其实是一个深度优先遍历
  // 先找子元素，没有子元素了就找兄弟元素
  // 兄弟元素也没有了就返回父元素
  // 然后再找这个父元素的兄弟元素
  // 最后到根节点结束
  // 这个遍历的顺序其实就是从上到下，从左到右
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    if (nextFiber.return) {
      nextFiber = nextFiber.return
    }
  }
}
/**
 * @description: 处理当前fiber节点
 * @return {*}
 */
function reconcileFiberNode(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = fiberToAuthenticElement(fiber)
  }
  // reconcileChildren是把之前的 vdom 转成 child、sibling、return 这样串联起来的 fiber 链表：
  reconcileChildren(fiber)
}

function reconcileChildren(fiber: Fiber) {
  // 只有虚拟DOM才有fiber.props.children， fiber是通过child指向子节点
  const children: Array<Fiber> = fiber.props.children
  // 构建fiber结构
  const alternateFiber = fiber.alternate // 获取上次的fiber树
  let alternateChildFiber = fiber.alternate && fiber.alternate.child // 获取子fiber树第一个
  let updateFiber: Fiber | undefined
  let prevSibling: Fiber | undefined
  let index = 0
  if (children && children.length) {
    // 第一次没有oldFiber，那全部是REPLACEMENT
    // 处理新增的情况
    if (!alternateChildFiber) {
      for (let i = 0; i < children.length; i++) {
        const element = children[i]
        const { type, props } = element
        updateFiber = {
          return: fiber,
          type,
          props,
          effectTag: 'REPLACEMENT', // 添加一个操作标记
        }
        // 父级的child指向第一个子元素
        if (i === 0) {
          fiber.child = updateFiber
          prevSibling = updateFiber
        } else {
          // 每个子元素拥有指向下一个子元素的指针
          if (prevSibling) {
            prevSibling.sibling = updateFiber
            prevSibling = prevSibling.sibling
          }
        }
      }
    }
    // 处理更新和删除的情况
    while (index < children.length && alternateChildFiber) {
      const element = children[index]
      // 对比oldFiber和当前element
      const sameType =
        alternateChildFiber &&
        element &&
        alternateChildFiber.type === element.type //检测类型是不是一样
      // 先比较元素类型
      if (sameType) {
        // 如果类型一样，复用节点，更新props
        const { type, dom } = alternateChildFiber
        updateFiber = {
          type,
          props: element.props,
          dom,
          return: fiber,
          alternate: alternateChildFiber, // 记录下上次状态
          effectTag: 'UPDATE', // 添加一个操作标记
        }
      } else if (!sameType && element) {
        // 如果类型不一样，有新的节点，创建新节点替换老节点
        const { type, props } = element
        updateFiber = {
          type,
          props,
          return: fiber,
          effectTag: 'REPLACEMENT', // 添加一个操作标记
        }
      } else if (!sameType && alternateChildFiber) {
        // 如果类型不一样，没有新节点，有老节点，删除老节点
        alternateChildFiber.effectTag = 'DELETION' // 添加删除标记
        deletions.push(alternateChildFiber) // 一个数组收集所有需要删除的节点
      }
      if (updateFiber) {
        // 指向修改前的fiber
        updateFiber.alternate = alternateChildFiber
      }

      alternateChildFiber = alternateChildFiber.sibling // 循环处理兄弟元素

      // 父级的child指向第一个子元素
      if (index === 0) {
        fiber.child = updateFiber
        // 初始化prevSibling
        prevSibling = updateFiber
      } else {
        // 每个子元素拥有指向下一个子元素的指针
        if (prevSibling) {
          prevSibling.sibling = updateFiber
          prevSibling = prevSibling.sibling
        }
      }
      index++
    }
  }
}

/**
 * @description: 空闲调度reconcile，进行虚拟DOM转fiber，同时收集区别
 * @return {*}
 */
function schedule(deadline: IdleDeadline) {
  while (currentFiberNode && deadline.timeRemaining() > 1) {
    // 这个while循环会在任务执行完或者时间到了的时候结束
    currentFiberNode = reconcile(currentFiberNode)
  }

  // 任务做完后统一渲染
  if (!currentFiberNode && fiberRoot) {
    commitFiber()
  }

  // 如果任务还没完，但是时间到了，我们需要继续注册requestIdleCallback
  requestIdleCallback(schedule)
}
/**
 * @description: fiber构建完成，同时区别也构建完成，进行统一的commit渲染
 * @return {*}
 */
function commitFiber() {
  deletions.forEach(fiberHandler) // 执行真正的节点删除
  fiberRoot && fiberHandler(fiberRoot) // 开启递归
  currentFiberNode = fiberRoot // 记录一下currentRoot
  fiberRoot = undefined // 操作完后将workInProgressRoot重置
}
function replacementHandler(fiber: Fiber) {
  if (fiber.return) {
    const parentDom = fiber.return.dom
    parentDom.appendChild(fiber.dom)
  }
}
function deletionHandler(fiber: Fiber) {
  if (fiber.return) {
    const parentDom = fiber.return.dom
    parentDom.removeChild(fiber.dom)
  }
}
function updateHandler(fiber: Fiber) {
  const { dom, alternate, props } = fiber
  const prevProps = alternate?.props
  const nextProps = props
  // 删除老的所有属性
  for (const prev in prevProps) {
    if (prev.startsWith('on')) {
      // 处理监听事件
      dom.removeEventListener(prev.toLowerCase(), fiber.props[prev], false)
    } else {
      dom.removeAttribute(prev)
    }
  }
  // 新增新的所有属性
  for (const next in nextProps) {
    if (next.startsWith('on')) {
      // 处理监听事件
      dom.addEventListener(next.toLowerCase(), fiber.props[next], false)
    } else {
      dom.setAttribute(next, fiber.props[next])
    }
  }
}

const fiberHandlerMapEffectTag = new Map([
  ['REPLACEMENT', replacementHandler],
  ['DELETION', deletionHandler],
  ['UPDATE', updateHandler],
])
/**
 * @description: 不同类型的fiber对应不同的处理方式
 * @param {Fiber} fiber
 */
function fiberHandler(fiber: Fiber) {
  if (!fiber) {
    return
  }
  // 向上查找真正的DOM
  let parentFiber = fiber.return
  while (parentFiber && !parentFiber.dom) {
    parentFiber = parentFiber.return
  }
  const handler = fiberHandlerMapEffectTag.get(fiber.effectTag || '')
  handler && handler(fiber)

  // 递归操作子元素和兄弟元素
  fiber.child && fiberHandler(fiber.child)
  fiber.sibling && fiberHandler(fiber.sibling)
}
/**
 * @description: 传入虚拟DOM和需要挂载的根节点，将虚拟DOM转化为Fiber，将fiber转化为真实DOM进行挂载
 * @param {InventedElement} inventedElement
 * @param {Element} root
 */
function render(inventedElement: InventedElement, root: Element) {
  // 保存上一次的fiber根节点，进行对比更新
  const alternate = fiberRoot
  // fiber和虚拟DOM结构上差不多，将虚拟DOM构建称fiber
  fiberRoot = {
    type: 'ROOT',
    dom: root,
    props: {
      children: [inventedElement],
    },
    alternate,
  }
  deletions = []
  currentFiberNode = fiberRoot
  // 开始进行遍历更新
  requestIdleCallback(schedule)
}

let deletions: Array<Fiber> = [] // 需要删除的节点
let currentFiberNode: Fiber | undefined // 用于记录当前处理到的fiber节点
let fiberRoot: Fiber | undefined // 记录fiber的根节点

export { render, createElement }
