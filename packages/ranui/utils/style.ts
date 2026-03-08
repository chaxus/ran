// ─── adoptStyles ──────────────────────────────────────────────────────────────
// 统一的 Shadow DOM 样式注入工具。
// 优先使用 Constructable Stylesheets（多实例共享一份解析结果，性能最佳），
// 降级到 <style> 标签注入。
//
// 使用方式：
//   import css from './index.less?inline';
//   import { adoptStyles } from '@/utils/style';
//
//   constructor() {
//     this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
//     adoptStyles(this._shadowDom, css);
//   }
// ─────────────────────────────────────────────────────────────────────────────

/** CSS 字符串 → CSSStyleSheet 对象缓存，同组件多实例只解析一次 */
const sheetCache = new Map<string, CSSStyleSheet>();
const dynamicSheetCache = new Map<string, CSSStyleSheet>();

/**
 * 将 CSS 字符串注入到指定的 Shadow DOM。
 * - SSR 环境安全（自动跳过）
 * - 幂等：同一 shadowRoot 不会重复注入
 * - 优先使用 Constructable Stylesheets 提升性能
 */
export const adoptStyles = (shadowRoot: ShadowRoot, cssText: string): void => {
  // SSR 守卫
  if (typeof document === 'undefined') return;
  if (!cssText) return;

  if (typeof CSSStyleSheet !== 'undefined') {
    try {
      if (!sheetCache.has(cssText)) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        sheetCache.set(cssText, sheet);
      }
      const sheet = sheetCache.get(cssText)!;
      // 幂等：避免重复添加
      if (!shadowRoot.adoptedStyleSheets.includes(sheet)) {
        shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
      }
      return;
    } catch {
      // Constructable Stylesheets 不支持（如 Firefox 旧版），降级处理
    }
  }

  // 降级：<style> 标签，data-ranui 标记防止重复注入
  if (!shadowRoot.querySelector('style[data-ranui]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ranui', '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
};

/**
 * 注入通过组件 `sheet` 属性传入的动态样式。
 * 幂等策略：同一 shadowRoot 内相同 cssText 只注入一次。
 */
export const adoptSheetText = (shadowRoot: ShadowRoot, cssText: string): void => {
  if (typeof document === 'undefined') return;
  if (!cssText) return;

  if (typeof CSSStyleSheet !== 'undefined') {
    try {
      if (!dynamicSheetCache.has(cssText)) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        dynamicSheetCache.set(cssText, sheet);
      }
      const sheet = dynamicSheetCache.get(cssText)!;
      if (!shadowRoot.adoptedStyleSheets.includes(sheet)) {
        shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
      }
      return;
    } catch {
      // ignore and fallback to style tag
    }
  }

  const existed = Array.from(shadowRoot.querySelectorAll('style[data-ranui-sheet]')).some(
    (item) => item.textContent === cssText,
  );
  if (!existed) {
    const style = document.createElement('style');
    style.setAttribute('data-ranui-sheet', '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
};
