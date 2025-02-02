import type { JSXInternal } from '@/types/jsx/jsx'

type Key = string | number | any

type RefObject<T> = { current: T | null }
type RefCallback<T> = (instance: T | null) => void
export type Ref<T> = RefObject<T> | RefCallback<T> | null
// Component

export type ComponentType<P = object> = ComponentClass<P> | FunctionComponent<P>

// Function Component
export interface FunctionComponent<P = object> {
  (props: RenderableProps<P>, context?: any): VNode<any> | null
  displayName?: string
  defaultProps?: Partial<P> | undefined
}

export interface ErrorInfo {
  componentStack?: string
}
// class Component
interface Component<P = object, S = object> {
  componentWillMount?(): void
  componentDidMount?(): void
  componentWillUnmount?(): void
  getChildContext?(): object
  componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void
  shouldComponentUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any,
  ): boolean
  componentWillUpdate?(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any,
  ): void
  getSnapshotBeforeUpdate?(oldProps: Readonly<P>, oldState: Readonly<S>): any
  componentDidUpdate?(
    previousProps: Readonly<P>,
    previousState: Readonly<S>,
    snapshot: any,
  ): void
  componentDidCatch?(error: any, errorInfo: ErrorInfo): void
}

interface ComponentClass<P = object, S = object> {
  new (props: P, context?: any): Component<P, S>
  displayName?: string
  defaultProps?: Partial<P>
  contextType?: Context<any>
  getDerivedStateFromProps?(
    props: Readonly<P>,
    state: Readonly<S>,
  ): Partial<S> | null
  getDerivedStateFromError?(error: any): Partial<S> | null
}
// Context
interface Consumer<T>
  extends FunctionComponent<{
    children: (value: T) => ComponentChildren
  }> {}

interface Provider<T>
  extends FunctionComponent<{
    value: T
    children: ComponentChildren
  }> {}

interface Context<T> {
  Consumer: Consumer<T>
  Provider: Provider<T>
  displayName?: string
}

// function createContext<T>(defaultValue: T): Context<T>;
// VNode

export interface VNode<P = object> {
  type: ComponentType<P> | string
  text?: string
  props: P & { children: ComponentChildren }
  key: Key
  /**
   * ref is not guaranteed by React.ReactElement, for compatibility reasons
   * with popular react libs we define it as optional too
   */
  ref?: Ref<any> | null
  _original?: number // 计数标记
}

export type ComponentChild =
  | VNode<object>
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined

export type ComponentChildren = ComponentChild[]

interface Attributes {
  key?: Key | undefined
  jsx?: boolean | undefined
}

export type RenderableProps<P, RefType = any> = P &
  Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }>

/**
 * Create an virtual node (used for JSX)
 * @param {VNode["type"]} type The node name or Component
 * constructor for this virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<ComponentChildren>} [children] The children of the virtual node
 * @returns {VNode}
 */
export function createElement(
  type: VNode['type'],
  props: Record<string, string | number | null> | null | undefined = {},
  ...children: Array<ComponentChildren>
): VNode {
  const normalizedProps: Record<string, any> = {}
  let key: string | number | null = null,
    ref: any = null
  if (props) {
    Object.keys(props).forEach((i) => {
      if (i === 'key') key = props[i]
      else if (i === 'ref') ref = props[i]
      else normalizedProps[i] = props[i]
    })
  }
  if (children?.length > 0) {
    normalizedProps.children = []
    children.forEach((child, index) => {
      if (typeof child === 'function') {
        normalizedProps.children.push(child)
      } else if (['string', 'number'].includes(typeof child)) {
        if (
          index >= 1 &&
          normalizedProps.children[index - 1].type === '#text'
        ) {
          normalizedProps.children[index - 1].text += child
        } else {
          normalizedProps.children.push({ type: '#text', text: child })
        }
      } else {
        normalizedProps.children.push(child)
      }
    })
  }

  return createVNode(type, normalizedProps, key, ref)
}

/**
 * Create a VNode (used internally by Preact)
 * @param {VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param {string | number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {VNode}
 */
export function createVNode(
  type: VNode['type'],
  props: object | string | number | null,
  key: string | number | null,
  ref: VNode['ref'],
): VNode<any> {
  // V8 seems to be better at detecting type shapes if the object is allocated from the same call site
  // Do not inline into createElement and coerceToVNode!
  const vnode = {
    type,
    props,
    key,
    ref,
  }
  return vnode
}

export function createRef<T = any>(): RefObject<T> {
  return { current: null }
}

export function Fragment(props: RenderableProps<object>): ComponentChildren {
  return props.children || []
}

export const render = (vnode: JSXInternal.Element, node: HTMLElement | null): void => {
  console.log('render--->', vnode, node);
}
