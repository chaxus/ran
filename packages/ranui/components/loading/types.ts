/**
 * 每个 loading 动画拆分为独立模块，与自身 CSS co-locate，按需（动态 import）加载。
 * 使用方无需感知：`<r-loading name="xxx">` 用法不变，只有用到的 variant 的
 * JS + CSS 会被打进/下载。详见 variants/ 目录与 index.ts 的 LOADERS 表。
 */
export interface LoadingVariant {
  /** 该动画自身的 CSS（scoped 在 `.ran-loading` 下），按需注入 shadow root。 */
  css: string;
  /** 构建并返回该动画的根节点（挂到 `.ran-loading` 容器内）。 */
  render: () => HTMLElement;
}
