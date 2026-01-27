import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Parent interface for Tabs component
 */
interface TabsParent extends ParentNode {
  updateAttribute: (key: string, attribute: string, value?: string | null) => void;
}

/**
 * Modern Tab Panel Component
 *
 * @element r-tab
 *
 * @slot - Panel content
 *
 * @cssprop --tab-content-padding - Content padding (inherited from r-tabs)
 */
export class TabPane extends (HTMLElementSSR()!) {
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;
  private _parent?: TabsParent | null;

  static get observedAttributes(): string[] {
    return ['label', 'r-key', 'disabled', 'icon', 'iconSize', 'effect'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(value: string) {
    this.setAttribute('label', value);
  }

  get icon(): string | null {
    return this.getAttribute('icon');
  }
  set icon(value: string | null) {
    if (value && value !== 'false') {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }

  get iconSize(): string | null {
    return this.getAttribute('iconSize');
  }
  set iconSize(value: string | null) {
    if (value && value !== 'false') {
      this.setAttribute('iconSize', value);
    } else {
      this.removeAttribute('iconSize');
    }
  }

  get key(): string | null {
    return this.getAttribute('r-key');
  }
  set key(value: string | null) {
    if (value) {
      this.setAttribute('r-key', value);
    } else {
      this.removeAttribute('r-key');
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get effect(): string | null {
    return this.getAttribute('effect');
  }
  set effect(value: string | null) {
    if (value && value !== 'false') {
      this.setAttribute('effect', value);
    } else {
      this.removeAttribute('effect');
    }
  }

  // ========== Render ==========

  private render(): void {
    this._slot = document.createElement('slot');
    this._shadowRoot.appendChild(this._slot);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this._parent = this.parentNode as TabsParent;

    // Initialize attributes on parent after DOM is loaded
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.initializeAttributes);
      } else {
        this.initializeAttributes();
      }
    }

    // Set ARIA role
    this.setAttribute('role', 'tabpanel');
  }

  disconnectedCallback(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('DOMContentLoaded', this.initializeAttributes);
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    // Update parent tab header when attributes change
    if (this.key && this._parent?.updateAttribute) {
      switch (name) {
        case 'icon':
          this._parent.updateAttribute(this.key, 'icon', newValue);
          break;

        case 'iconSize':
          this._parent.updateAttribute(this.key, 'iconSize', newValue);
          break;

        case 'effect':
          this._parent.updateAttribute(this.key, 'effect', newValue);
          break;

        case 'disabled':
          this._parent.updateAttribute(this.key, 'disabled', newValue);
          break;
      }
    }
  }

  // ========== Methods ==========

  private initializeAttributes = (): void => {
    if (!this.key || !this._parent?.updateAttribute) return;

    // Sync attributes with parent tab header
    if (this.icon) {
      this._parent.updateAttribute(this.key, 'icon', this.icon);
    }

    if (this.iconSize) {
      this._parent.updateAttribute(this.key, 'iconSize', this.iconSize);
    }

    if (this.effect) {
      this._parent.updateAttribute(this.key, 'effect', this.effect);
    }
  };
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-tab')) {
    customElements.define('r-tab', TabPane);
    return TabPane;
  } else {
    return createCustomError('document is undefined or r-tab already exists');
  }
}

export default Custom();
