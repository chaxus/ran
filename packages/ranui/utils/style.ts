// Shadow DOM 样式注入。实现住在 ranuts（`adoptStyles` / `adoptSheetText`），
// 这里只把 ranui 自己的 <style> 标记属性绑上去。
//
// 标记属性留在 ranui 是有意的：`data-ranui` / `data-ranui-sheet` 是 ranui 组件
// 渲染出的 DOM 的一部分，消费者可能靠它定位注入的样式，属于 ranui 的对外契约，
// 不该跟着通用实现一起下沉到 ranuts。
//
// 使用方式：
//   import css from './index.less?inline';
//   import { adoptStyles } from '@/utils/style';
//
//   constructor() {
//     this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
//     adoptStyles(this._shadowDom, css);
//   }
import { adoptSheetText as adoptSheetTextBase, adoptStyles as adoptStylesBase } from 'ranuts/utils';

/** ranui 静态组件样式在降级 <style> 上的标记 */
export const RANUI_STYLE_MARKER = 'data-ranui';
/** ranui 动态 `sheet` 属性样式在降级 <style> 上的标记 */
export const RANUI_SHEET_MARKER = 'data-ranui-sheet';

/**
 * 把组件的静态样式注入到指定的 Shadow DOM。
 * 优先 Constructable Stylesheets，不支持时降级为一个带 `data-ranui` 标记的 <style>。
 */
export const adoptStyles = (shadowRoot: ShadowRoot, cssText: string): void =>
  adoptStylesBase(shadowRoot, cssText, RANUI_STYLE_MARKER);

/**
 * 注入通过组件 `sheet` 属性传入的动态样式。
 * 同一个 shadowRoot 内相同 cssText 只注入一次。
 */
export const adoptSheetText = (shadowRoot: ShadowRoot, cssText: string): void =>
  adoptSheetTextBase(shadowRoot, cssText, RANUI_SHEET_MARKER);
