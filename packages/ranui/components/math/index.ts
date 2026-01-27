import type { MathErrorEventDetail, MathRenderEventDetail } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Math Component
 * Renders LaTeX mathematical expressions using KaTeX
 *
 * @element r-math
 *
 * @fires render - Fired when math expression is rendered successfully
 * @fires error - Fired when rendering fails
 *
 * @csspart container - The math container
 *
 * @cssprop --math-display - Display mode
 * @cssprop --math-justify-content - Justify content
 * @cssprop --math-align-items - Align items
 */
export class Math extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;
  private _renderPromise?: Promise<void>;

  static get observedAttributes(): string[] {
    return ['latex', 'display'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get latex(): string {
    const latex = this.getAttribute('latex') || '';
    return decodeURIComponent(latex);
  }
  set latex(value: string) {
    this.setAttribute('latex', encodeURIComponent(value));
  }

  get displayMode(): boolean {
    return this.hasAttribute('display');
  }
  set displayMode(value: boolean) {
    if (value) {
      this.setAttribute('display', '');
    } else {
      this.removeAttribute('display');
    }
  }

  get loading(): boolean {
    return this.hasAttribute('loading');
  }
  private set loading(value: boolean) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  get error(): boolean {
    return this.hasAttribute('error');
  }
  private set error(value: boolean) {
    if (value) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._container = document.createElement('div');
    this._container.className = 'ran-math';
    this._container.setAttribute('part', 'container');
    this._container.setAttribute('role', 'math');

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.renderMath();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'latex' || name === 'display') {
      this.renderMath();
    }
  }

  // ========== Math Rendering ==========

  private async renderMath(): Promise<void> {
    if (!this.latex) {
      this._container.innerHTML = '';
      return;
    }

    // Wait for previous render to complete
    if (this._renderPromise) {
      await this._renderPromise;
    }

    this.loading = true;
    this.error = false;

    this._renderPromise = this.performRender();

    try {
      await this._renderPromise;
    } finally {
      this.loading = false;
      this._renderPromise = undefined;
    }
  }

  private async performRender(): Promise<void> {
    try {
      const katex = await import('@/assets/js/katex/katex-es.js');

      // Clear container
      this._container.innerHTML = '';

      // Create span with LaTeX content
      const span = document.createElement('span');
      const mathDelimiter = this.displayMode ? '$$' : '$';
      span.textContent = `${mathDelimiter}${this.latex}${mathDelimiter}`;
      this._container.appendChild(span);

      // Render math
      if (katex && katex.renderMathInElement) {
        katex.renderMathInElement(this._container, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
        });
      }

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent<MathRenderEventDetail>('render', {
          detail: {
            latex: this.latex,
            success: true,
          },
          bubbles: true,
          composed: true,
        })
      );

      this.error = false;
    } catch (err) {
      const error = err as Error;
      console.warn(`ranui math component warning: ${error.message}\n${error}`);

      this.error = true;

      // Dispatch error event
      this.dispatchEvent(
        new CustomEvent<MathErrorEventDetail>('error', {
          detail: {
            latex: this.latex,
            error,
          },
          bubbles: true,
          composed: true,
        })
      );

      // Show error message
      this._container.innerHTML = `<span style="color: #ff4d4f;">Math render error: ${error.message}</span>`;
    }
  }

  // ========== Public Methods ==========

  /**
   * Force re-render the math expression
   */
  public async refresh(): Promise<void> {
    await this.renderMath();
  }

  /**
   * Clear the rendered math
   */
  public clear(): void {
    this._container.innerHTML = '';
  }
}

async function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-math')) {
    customElements.define('r-math', Math);
    return Math;
  } else {
    return createCustomError('document is undefined or r-math already exists');
  }
}

export default Custom();
