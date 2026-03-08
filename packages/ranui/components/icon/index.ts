import iconCss from './index.less?inline';
import { RanElement, html } from '@/utils/index';
import { View } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';

type ImportMetaWithEnv = ImportMeta & { env?: { DEV?: boolean } };

const isDev = typeof import.meta !== 'undefined' && Boolean((import.meta as ImportMetaWithEnv).env?.DEV);
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

export class Icon extends RanElement {
  private readonly isDev = isDev;

  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'spin', 'decorative', 'aria-label'];
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
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, iconCss);

    // Rehydration safe: check if content already exists
    let div = this._shadowDom.querySelector('.ran-icon') as HTMLElement;
    if (!div) {
      const fragment = html` <div class="ran-icon" part="ran-icon"></div> `;
      this._shadowDom.appendChild(fragment);
      div = this._shadowDom.querySelector('.ran-icon')!;
    }
    this._div = div;
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }
  set name(value: string) {
    if (value) this.setAttribute('name', value);
  }
  get size(): string {
    return this.getAttribute('size') || '';
  }
  set size(value: string) {
    if (value) this.setAttribute('size', value);
  }
  get color(): string {
    return this.getAttribute('color') || '';
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
    return this.getAttribute('aria-label') || '';
  }
  set ariaLabel(value: string) {
    if (!value) {
      this.removeAttribute('aria-label');
      return;
    }
    this.setAttribute('aria-label', value);
  }

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
    window.addEventListener('ranui-icon-registered', this._onIconRegistered as EventListener);
    this.setIcon();
  }

  disconnectedCallback(): void {
    window.removeEventListener('ranui-icon-registered', this._onIconRegistered as EventListener);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (newValue !== oldValue) {
      if (name === 'name') this.setIcon();
      if (name === 'size') this.setSize();
      if (name === 'color') this.setColor();
      if (name === 'spin') this.setSpin();
      if (name === 'decorative' || name === 'aria-label') this.syncA11y();
    }
  }
}

if (typeof document !== 'undefined' && !customElements.get('r-icon')) {
  customElements.define('r-icon', Icon);
}
