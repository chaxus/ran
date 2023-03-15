import type { On } from './modules/listeners'
import type { Attrs } from './modules/attributes'
import type { Classes } from './modules/class'
import type { Props } from './modules/props'
import type { VNodeStyle } from './modules/style'

export type VNodes = VNode[]
export type VNodeChildElement = VNode | string | number
export type ArrayOrElement<T> = T | T[]
export type VNodeChildren = ArrayOrElement<VNodeChildElement>

// key属性类型
export type Key = string | number

// VNode接口
export interface VNode {
    // dom节点的选择器
    sel: string | undefined
    // 节点数据
    data: VNodeData | undefined
    // 子节点，和text互斥
    children: Array<VNode | string | number> | undefined
    // 存储VNode转化成的真实dom
    elm: Node | undefined
    // 节点的文本内容，和children互斥
    text: string | number | undefined
    // key，用于优化diff算法
    key: Key | undefined
}

export interface VNodeData {
    // 设置VNode对应的DOM元素的属性,通过 对象.属性 的方式来设置,它内部不会去处理布尔类型的属性
    props?: Props
    // 设置VNode对应的DOM元素的属性,通过 setAttributes 来设置,它内部不会去处理布尔类型的属性
    attrs?: Attrs
    // 设置VNode对应的DOM元素的class
    class?: Classes
    // 设置VNode对应的DOM元素的css style
    style?: VNodeStyle
    // 设置VNode对应的DOM元素的监听事件
    on?: On
    // 设置VNode对应的key
    key?: Key,
    ns?: string
}

export function vnode(sel: string | undefined,
    data: any | undefined,
    children: Array<VNode | string | number> | undefined,
    text: string | number | undefined,
    elm: Element | Text | undefined): VNode {
    const key = data === undefined ? undefined : data.key
    return { sel, data, children, text, elm, key }
}
