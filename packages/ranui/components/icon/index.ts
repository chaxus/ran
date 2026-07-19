import iconCss from './index.less?inline';
import { RanElement } from '@/utils/index';
import { Div, EventManager, View } from '@/utils/builder';
import { defineSSR } from '@/utils/ssr-registry';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';

const isDev = import.meta.env.DEV;
import { coreIcons } from './core-icons';

const iconSvgCache = new Map<string, string>();
let hasStartedRegistration = false;

const isSvgText = (value: string): boolean => /<svg[\s>]/i.test(value);

const pickSvgText = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return isSvgText(value) ? value : undefined;
  }
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const data = record.data;
  if (typeof data === 'string' && isSvgText(data)) {
    return data;
  }

  const nestedDefault = record.default;
  if (typeof nestedDefault === 'string' && isSvgText(nestedDefault)) {
    return nestedDefault;
  }
  if (nestedDefault && typeof nestedDefault === 'object') {
    const nested = nestedDefault as Record<string, unknown>;
    if (typeof nested.data === 'string' && isSvgText(nested.data)) {
      return nested.data;
    }
  }
  return undefined;
};

/** Register one icon. Consumer controls what gets bundled by what it imports. */
export const registerIcon = (name: string, source: unknown): void => {
  hasStartedRegistration = true;
  const svg = pickSvgText(source);
  if (!svg) {
    if (isDev) {
      console.warn(`[ranui-icon] register icon failed: ${name}`);
    }
    return;
  }
  iconSvgCache.set(`inline:${name}`, svg);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ranui-icon-registered', { detail: { name } }));
  }
};

/** Batch register icons. */
export const registerIcons = (icons: Record<string, unknown>): void => {
  hasStartedRegistration = true;
  Object.entries(icons).forEach(([name, source]) => {
    registerIcon(name, source);
  });
};

// Core action glyphs are always available — components like <r-mermaid> can use
// <r-icon name="copy"> without registering anything. The rest of assets/icons stays
// opt-in via registerBuiltinIcons(). See core-icons.ts.
registerIcons(coreIcons);

/**
 * Names of the SVGs ranui ships in `assets/icons/`. This tuple is the source of
 * truth for {@link RanIconName}; a unit test asserts it stays in sync with the
 * asset folder, so adding/removing an SVG without updating this list fails CI.
 */
export const RAN_ICON_NAMES = [
  'add-user',
  'arrow-down',
  'book',
  'check',
  'check-circle',
  'check-circle-fill',
  'close',
  'close-circle',
  'close-circle-fill',
  'copy',
  'download',
  'drop',
  'eye',
  'eye-close',
  'fullscreen',
  'github',
  'globe',
  'home',
  'info-circle',
  'info-circle-fill',
  'issue',
  'loading',
  'loading-scene',
  'lock',
  'menu',
  'message',
  'more',
  'plus',
  'power-off',
  'preview',
  'refresh',
  'search',
  'setting',
  'sort',
  'team',
  'unlock',
  'user',
  'warning-circle',
  'warning-circle-fill',
  'without-content',
  'zoom-in',
  'zoom-out',
] as const;

/** A name from ranui's bundled icon set (see {@link registerBuiltinIcons}). */
export type RanIconName = (typeof RAN_ICON_NAMES)[number];

export class Icon extends RanElement {
  private readonly isDev = isDev;
  _events = new EventManager();

  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'spin', 'decorative', 'aria-label', 'sheet'];
  }
  _icon?: SVGElement;
  _div!: HTMLElement;
  _shadowDom!: ShadowRoot;
  _onIconRegistered = (event: Event): void => {
    const customEvent = event as CustomEvent<{ name?: string }>;
    const registeredName = customEvent.detail?.name;
    if (!registeredName) return;
    if (registeredName === this.name && !this._icon) {
      this.setIcon();
    }
  };

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, iconCss);
    const div = ensureShadowElement(this._shadowDom, '.ran-icon', () =>
      Div().class('ran-icon').part('ran-icon').build(),
    );
    this._div = div;
  }

  get name(): string {
    return getStringAttribute(this, 'name');
  }
  set name(value: string) {
    if (value) this.setAttribute('name', value);
  }
  get size(): string {
    return getStringAttribute(this, 'size');
  }
  set size(value: string) {
    if (value) this.setAttribute('size', value);
  }
  get color(): string {
    return getStringAttribute(this, 'color');
  }
  set color(value: string) {
    if (value) this.setAttribute('color', value);
  }
  get spin(): boolean {
    return this.hasAttribute('spin');
  }
  set spin(value: boolean) {
    if (value) this.setAttribute('spin', '');
    else this.removeAttribute('spin');
  }

  get decorative(): boolean {
    const value = this.getAttribute('decorative');
    if (value == null) return !this.hasAttribute('aria-label');
    return value !== 'false' && value !== '0';
  }
  set decorative(value: boolean) {
    this.setAttribute('decorative', value ? 'true' : 'false');
  }

  get ariaLabel(): string {
    return getStringAttribute(this, 'aria-label');
  }
  set ariaLabel(value: string) {
    setStringAttribute(this, 'aria-label', value, { removeEmpty: true });
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }

  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  syncA11y = (): void => {
    if (!this._icon) return;
    const decorative = this.decorative;
    if (decorative) {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
      this._icon.setAttribute('aria-hidden', 'true');
      this._icon.setAttribute('focusable', 'false');
      return;
    }
    this.removeAttribute('aria-hidden');
    this.setAttribute('role', 'img');
    this._icon.removeAttribute('aria-hidden');
    this._icon.setAttribute('focusable', 'false');
  };

  /**
   * @description: 设置 icon 的 svg
   * @return {*}
   */
  setIcon = (): void => {
    if (typeof document === 'undefined') return;
    if (this._icon) {
      this._icon.remove();
      this._icon = undefined;
    }
    const iconName = this.name;
    if (iconName) {
      if (iconName.startsWith('<svg')) {
        this.renderSvg(iconName, iconName);
      } else {
        try {
          const cacheKey = `inline:${iconName}`;
          const svg = iconSvgCache.get(cacheKey);
          if (!svg) {
            if (this.isDev && hasStartedRegistration) {
              console.warn(`[ranui-icon] icon not registered: ${iconName}`);
            }
            return;
          }
          if (svg && this.isSvgText(svg)) {
            this.renderSvg(svg, iconName);
          } else if (this.isDev) {
            console.warn(`[ranui-icon] invalid svg text: ${iconName}`);
          }
        } catch (error) {
          if (this.isDev) {
            console.warn(`[ranui-icon] render icon failed: ${iconName}`, error);
          }
        }
      }
    }
  };

  isSvgText = (value: string): boolean => {
    return isSvgText(value);
  };

  parseSvg = (svgContent: string): SVGElement | undefined => {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const root = doc.documentElement;
    if (!root || root.tagName.toLowerCase() === 'parsererror') return undefined;
    if (root.tagName.toLowerCase() !== 'svg') return undefined;

    // Use XMLSerializer for XML nodes (outerHTML is not stable across browsers here).
    const serialized = new XMLSerializer().serializeToString(root);

    // Recreate in current document to avoid cross-document node quirks.
    const template = View('template').build() as HTMLTemplateElement;
    template.innerHTML = serialized.trim();
    const svg = template.content.firstElementChild;
    if (!svg || svg.tagName.toLowerCase() !== 'svg') return undefined;
    return svg as SVGElement;
  };

  renderSvg = (svgContent: string, iconName: string): void => {
    const svgElement = this.parseSvg(svgContent);
    if (svgElement) {
      this._icon = svgElement;
      this._icon.setAttribute('part', 'icon-svg');
      this._icon.setAttribute('data-name', iconName);
      this._div.appendChild(this._icon);
      this.setSize();
      this.setColor();
      this.setSpin();
      this.syncA11y();
    } else if (this.isDev) {
      console.warn(`[ranui-icon] parse svg failed: ${iconName}`);
    }
  };

  /**
   * @description: 设置 icon 的大小
   * @return {*}
   */
  setSize = (): void => {
    if (this._icon) {
      const size = this.size || '1em';
      this._icon.setAttribute('width', size);
      this._icon.setAttribute('height', size);
      // The shadow stylesheet sets `.ran-icon svg { width: var(--ran-icon-svg-width, 1em) }`,
      // and a CSS width beats the SVG width/height *attributes* — so `size` would never take
      // effect. Set it as inline style too (inline style wins over the stylesheet rule).
      // Unitless values (e.g. size="30") are px; keep units when given (2rem, 50%, 1em).
      const cssSize = /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
      this._icon.style.setProperty('width', cssSize);
      this._icon.style.setProperty('height', cssSize);
    }
  };

  /**
   * @description: 设置 icon 的颜色
   * @return {*}
   */
  setColor = (): void => {
    if (this._icon) {
      const color = this.color || 'currentColor';
      this._icon.style.setProperty('color', color);
      this._icon.style.setProperty('fill', color);
      this._icon.style.setProperty('stroke', color);
    }
  };

  /**
   * @description: 设置 icon 是否旋转
   * @return {*}
   */
  setSpin = (): void => {
    if (this.spin) {
      this._div.classList.add('ran-icon-spin');
    } else {
      this._div.classList.remove('ran-icon-spin');
    }
  };

  connectedCallback(): void {
    this._events.on(window, 'ranui-icon-registered', this._onIconRegistered as EventListener);
    this.handlerExternalCss();
    this.setIcon();
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name') this.setIcon();
    if (name === 'size') this.setSize();
    if (name === 'color') this.setColor();
    if (name === 'spin') this.setSpin();
    if (name === 'decorative' || name === 'aria-label') this.syncA11y();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-icon', Icon as unknown as new () => HTMLElement);
