import { html, RanElement } from '@/utils/index';
import { adoptStyles } from '@/utils/style';
import iconCss from './index.less?inline';

const iconLoaders = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;
const iconSvgCache = new Map<string, string>();

export class Icon extends RanElement {
  static get observedAttributes() {
    return ['name', 'size', 'color', 'spin', 'decorative', 'aria-label'];
  }
  _icon?: SVGElement;
  _div!: HTMLElement;
  _shadowDom!: ShadowRoot;

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

  get name() {
    return this.getAttribute('name');
  }
  set name(value) {
    if (value) this.setAttribute('name', value);
  }
  get size() {
    return this.getAttribute('size');
  }
  set size(value) {
    if (value) this.setAttribute('size', value);
  }
  get color() {
    return this.getAttribute('color');
  }
  set color(value) {
    if (value) this.setAttribute('color', value);
  }
  get spin() {
    return this.hasAttribute('spin');
  }
  set spin(value) {
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
  setIcon = async () => {
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
          let svg = iconSvgCache.get(cacheKey);
          if (!svg) {
            const loader = iconLoaders[`../../assets/icons/${iconName}.svg`];
            if (!loader) {
              if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
                console.warn(`[ranui-icon] icon not found: ${iconName}`);
              }
              return;
            }
            svg = await loader();
            iconSvgCache.set(cacheKey, svg);
          }
          if (typeof svg === 'string' && svg.trim().startsWith('<svg')) {
            this.renderSvg(svg, iconName);
          }
        } catch (error) {
          if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
            console.warn(`[ranui-icon] render icon failed: ${iconName}`, error);
          }
        }
      }
    }
  };

  parseSvg = (svgContent: string): SVGElement | undefined => {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const root = doc.documentElement;
    if (!root || root.tagName.toLowerCase() === 'parsererror') return undefined;
    if (root.tagName.toLowerCase() !== 'svg') return undefined;

    // Recreate in current document to avoid cross-document node quirks.
    const template = document.createElement('template');
    template.innerHTML = root.outerHTML;
    const svg = template.content.firstElementChild;
    if (!svg || svg.tagName.toLowerCase() !== 'svg') return undefined;
    return svg as SVGElement;
  };

  renderSvg = (svgContent: string, iconName: string) => {
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
    }
  };

  /**
   * @description: 设置 icon 的大小
   * @return {*}
   */
  setSize = () => {
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
  setColor = () => {
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
  setSpin = () => {
    if (this.spin) {
      this._div.classList.add('ran-icon-spin');
    } else {
      this._div.classList.remove('ran-icon-spin');
    }
  };

  connectedCallback() {
    this.setIcon();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
