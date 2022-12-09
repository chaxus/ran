type VirtualDomProps = any

type RealDom = any
interface VirtualDom {
  type: string;
  props: VirtualDomProps;
}

interface Fiber {
  props:VirtualDomProps,
  type:string,
  effectTag:string, // 操作的标记
  child:Fiber, // 子节点
  sibling:Fiber, // 兄弟节点
  return:Fiber, // 指向父节点
  dom:RealDom, // 判断是不是根节点
  alternate:Fiber,

}

function createTextVDom(text:string):VirtualDom{
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createVirtualDom(type:string, props:VirtualDomProps, ...children:Array<VirtualDom>):VirtualDom {
  // 核心逻辑不复杂，将参数都塞到一个对象上返回就行
  // children也要放到props里面去，这样我们在组件里面就能通过this.props.children拿到子元素
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object' ? child: createTextVDom(child)
      })
    }
  }
}

// 创建DOM的操作
function createDom(vDom:VirtualDom) {
  let dom: RealDom;
  // 检查当前节点是文本还是对象
  if(vDom.type === 'TEXT') {
    dom = document.createTextNode(vDom.props.nodeValue);
  } else {
    dom = document.createElement(vDom.type);

    // 将vDom上除了children外的属性都挂载到真正的DOM上去
    if(vDom.props) {
      Object.keys(vDom.props)
        .filter(key => key !== 'children')
        .forEach(item => {
          if(item.indexOf('on') === 0) {
            dom.addEventListener(item.substring(2).toLowerCase(), vDom.props[item], false);
          } else {
            dom[item] = vDom.props[item];
          }
        })
    }
  }
  return dom;
}

// 更新DOM的操作
function updateDom(dom:RealDom, prevProps:VirtualDomProps, nextProps:VirtualDomProps) {
  // 1. 过滤children属性
  // 2. 老的存在，新的没了，取消
  // 3. 新的存在，老的没有，新增
  Object.keys(prevProps)
    .filter(name => name !== 'children')
    .filter(name => !(name in nextProps))
    .forEach(name => {
      if(name.indexOf('on') === 0) {
        dom.removeEventListener(name.substring(2).toLowerCase(), prevProps[name], false);
      } else {
        dom[name] = '';
      }
    });

  Object.keys(nextProps)
    .filter(name => name !== 'children')
    .forEach(name => {
      if(name.indexOf('on') === 0) {
        dom.addEventListener(name.substring(2).toLowerCase(), nextProps[name], false);
      } else {
        dom[name] = nextProps[name];
      }
    });
}
let deletions:Array<Fiber>// 需要删除的节点，汇总统一删除
let workInProgressRoot:Fiber | undefined // 根节点
let currentRoot:Fiber
// 统一操作DOM
function commitRoot() {
  deletions.forEach(commitRootImpl);     // 执行真正的节点删除
  if(workInProgressRoot){
    commitRootImpl(workInProgressRoot.child);    // 开启递归
    currentRoot = workInProgressRoot;    // 记录一下currentRoot
    workInProgressRoot = undefined;     // 操作完后将workInProgressRoot重置
  }
 
}

function commitDeletion(fiber:Fiber, domParent:RealDom) {
  if(fiber.dom) {
    // dom存在，是普通节点
    domParent.removeChild(fiber.dom);
  } else {
    // dom不存在，是函数组件,向下递归查找真实DOM
    commitDeletion(fiber.child, domParent);
  }
}

function commitRootImpl(fiber:Fiber) {
  if(!fiber) {
    return;
  }

  // const parentDom = fiber.return.dom;
  // 向上查找真正的DOM
  let parentFiber = fiber.return;
  while(!parentFiber.dom) {
    parentFiber = parentFiber.return;
  }
  const parentDom:RealDom = parentFiber.dom;

  if(fiber.effectTag === 'REPLACEMENT' && fiber.dom) {
    parentDom.appendChild(fiber.dom);
  } else if(fiber.effectTag === 'DELETION') {
    // parentDom.removeChild(fiber.dom);
    commitDeletion(fiber, parentDom);
  } else if(fiber.effectTag === 'UPDATE' && fiber.dom) {
    // 更新DOM属性
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  // 递归操作子元素和兄弟元素
  commitRootImpl(fiber.child);
  commitRootImpl(fiber.sibling);
}