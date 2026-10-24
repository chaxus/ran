// Shadow DOM 样式注入。静态样式的实现住在 ranuts（`adoptStyles`），这里只把 ranui 自己的
// <style> 标记属性绑上去；`sheet` 属性的替换语义是 ranui 的契约，所以槽位在这里实现。
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
import { adoptStyles as adoptStylesBase } from 'ranuts/utils';

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

/** 每个 shadowRoot 当前占着 `sheet` 槽位的内容；`sheet` 为空表示走的是 <style> 降级 */
const slots = new WeakMap<ShadowRoot, { text: string; sheet?: CSSStyleSheet }>();
/** 相同 cssText 在多个实例间共享一个 CSSStyleSheet；`sheet` 改值或清空时释放引用，最后一个引用释放后删除。元素带着 `sheet` 被移除不会释放 */
const sharedSheets = new Map<string, { sheet: CSSStyleSheet; users: number }>();

const acquireShared = (cssText: string): CSSStyleSheet | undefined => {
  if (typeof CSSStyleSheet === 'undefined') return undefined;
  let entry = sharedSheets.get(cssText);
  if (!entry) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      entry = { sheet, users: 0 };
      sharedSheets.set(cssText, entry);
    } catch {
      return undefined;
    }
  }
  entry.users++;
  return entry.sheet;
};

const releaseShared = (cssText: string): void => {
  const entry = sharedSheets.get(cssText);
  if (entry && --entry.users === 0) sharedSheets.delete(cssText);
};

/**
 * 组件 `sheet` 属性的样式槽位：每个 shadowRoot 只有一份，新值替换旧值，空字符串移除。
 * 优先 Constructable Stylesheets，不支持时降级为一个带 `data-ranui-sheet` 标记的 <style>。
 */
export const replaceSheetText = (shadowRoot: ShadowRoot, cssText: string): void => {
  if (typeof document === 'undefined') return;
  const prev = slots.get(shadowRoot);
  if ((prev?.text ?? '') === cssText) return;

  if (prev?.sheet) {
    shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.filter((sheet) => sheet !== prev.sheet);
    releaseShared(prev.text);
  } else if (prev) {
    shadowRoot.querySelector(`style[${RANUI_SHEET_MARKER}]`)?.remove();
  }
  slots.delete(shadowRoot);
  if (!cssText) return;

  let sheet = acquireShared(cssText);
  if (sheet) {
    try {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
    } catch {
      // 有 CSSStyleSheet 却没有 adoptedStyleSheets（jsdom、旧引擎）：退回 <style>
      releaseShared(cssText);
      sheet = undefined;
    }
  }
  if (!sheet) {
    const style = document.createElement('style');
    style.setAttribute(RANUI_SHEET_MARKER, '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
  slots.set(shadowRoot, { text: cssText, sheet });
};
