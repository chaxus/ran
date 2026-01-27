import type {
  CheckboxChangeEventDetail,
  CheckboxSize,
  CheckboxStatus,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Checkbox Component
 *
 * @element r-checkbox
 *
 * @slot - Default slot for label content
 *
 * @fires checkbox-change - Fired when checkbox state changes
 *
 * @csspart container - The checkbox container
 * @csspart input - The native checkbox input
 * @csspart checkmark - The visual checkmark element
 * @csspart label - The label element
 */
export class Checkbox extends (HTMLElementSSR()!) {
  private _container!: HTMLLabelElement;
  private _input!: HTMLInputElement;
  private _checkmark!: HTMLSpanElement;
  private _label?: HTMLSpanElement;
  private _shadowRoot!: ShadowRoot;
  private _internals?: ElementInternals;

  static formAssociated = true;

  static get observedAttributes(): string[] {
    return [
      'checked',
      'value',
      'disabled',
      'readonly',
      'required',
      'indeterminate',
      'size',
      'status',
      'name',
      'label',
      'aria-label',
    ];
  }

  constructor() {
    super();

    if ('attachInternals' in this) {
      this._internals = this.attachInternals();
    }

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get checked(): boolean {
    return this.hasAttribute('checked');
  }
  set checked(value: boolean) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get value(): string {
    return this.getAttribute('value') || 'on';
  }
  set value(value: string) {
    this.setAttribute('value', value);
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

  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }
  set readonly(value: boolean) {
    if (value) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }
  set required(value: boolean) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }
  set indeterminate(value: boolean) {
    if (value) {
      this.setAttribute('indeterminate', '');
    } else {
      this.removeAttribute('indeterminate');
    }
  }

  get size(): CheckboxSize {
    return (this.getAttribute('size') as CheckboxSize) || 'md';
  }
  set size(value: CheckboxSize) {
    this.setAttribute('size', value);
  }

  get status(): CheckboxStatus {
    return (this.getAttribute('status') as CheckboxStatus) || 'normal';
  }
  set status(value: CheckboxStatus) {
    this.setAttribute('status', value);
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }
  set name(value: string) {
    this.setAttribute('name', value);
  }

  get form(): HTMLFormElement | null {
    return this._internals?.form || null;
  }

  get elementInternals(): ElementInternals | undefined {
    return this._internals;
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <label part="container" class="checkbox-container">
        <input part="input" class="checkbox-input" type="checkbox" />
        <span part="checkmark" class="checkbox-checkmark"></span>
        <slot></slot>
      </label>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.checkbox-container')!;
    this._input = this._shadowRoot.querySelector('.checkbox-input')!;
    this._checkmark = this._shadowRoot.querySelector('.checkbox-checkmark')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupCheckbox();
    this.setupEventListeners();
    this.updateClasses();
    this.updateAriaAttributes();
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'checked':
        this.updateChecked();
        break;

      case 'value':
        this.updateValue();
        break;

      case 'disabled':
      case 'readonly':
      case 'required':
        this.updateInputState();
        break;

      case 'indeterminate':
        this.updateIndeterminate();
        break;

      case 'size':
      case 'status':
        this.updateClasses();
        break;

      case 'name':
        this.updateName();
        break;

      case 'label':
        this.updateLabel();
        break;

      case 'aria-label':
        this.updateAriaAttributes();
        break;
    }
  }

  // ========== Methods ==========

  private setupCheckbox(): void {
    this.updateChecked();
    this.updateValue();
    this.updateInputState();
    this.updateIndeterminate();
    this.updateName();
    this.updateLabel();
  }

  private updateChecked(): void {
    if (!this._input) return;

    this._input.checked = this.checked;
    this.updateInternals();
    this.updateClasses();
  }

  private updateValue(): void {
    if (!this._input) return;

    this._input.value = this.value;
    this.updateInternals();
  }

  private updateInputState(): void {
    if (!this._input) return;

    this._input.disabled = this.disabled;
    this._input.readOnly = this.readonly;
    this._input.required = this.required;

    this.updateInternals();
  }

  private updateIndeterminate(): void {
    if (!this._input) return;

    this._input.indeterminate = this.indeterminate;
    this.updateClasses();
  }

  private updateName(): void {
    if (!this._input) return;

    if (this.name) {
      this._input.name = this.name;
    } else {
      this._input.removeAttribute('name');
    }
  }

  private updateLabel(): void {
    const labelText = this.getAttribute('label');

    if (labelText) {
      if (!this._label) {
        this._label = document.createElement('span');
        this._label.setAttribute('part', 'label');
        this._label.className = 'checkbox-label';
        this._container.appendChild(this._label);
      }
      this._label.textContent = labelText;
    } else if (this._label) {
      this._container.removeChild(this._label);
      this._label = undefined;
    }
  }

  private updateInternals(): void {
    if (!this._internals) return;

    if (this.disabled) {
      this._internals.setFormValue(null);
    } else if (this.checked) {
      this._internals.setFormValue(this.value);
    } else {
      this._internals.setFormValue(null);
    }

    // Update validity
    if (this.required && !this.checked) {
      this._internals.setValidity(
        { valueMissing: true },
        'This checkbox is required',
        this._input
      );
    } else {
      this._internals.setValidity({});
    }
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'checkbox-container',
      `checkbox-${this.size}`,
      `checkbox-${this.status}`,
      this.checked && 'checkbox-checked',
      this.indeterminate && 'checkbox-indeterminate',
      this.disabled && 'checkbox-disabled',
      this.readonly && 'checkbox-readonly',
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private updateAriaAttributes(): void {
    if (!this._input) return;

    const ariaLabel = this.getAttribute('aria-label') || this.getAttribute('label');
    if (ariaLabel) {
      this._input.setAttribute('aria-label', ariaLabel);
    }

    if (this.status === 'error') {
      this._input.setAttribute('aria-invalid', 'true');
    } else {
      this._input.removeAttribute('aria-invalid');
    }
  }

  // ========== Event Handlers ==========

  private setupEventListeners(): void {
    this._input.addEventListener('change', this.handleChange);
    this._input.addEventListener('click', this.handleClick);
  }

  private removeEventListeners(): void {
    this._input?.removeEventListener('change', this.handleChange);
    this._input?.removeEventListener('click', this.handleClick);
  }

  private handleChange = (): void => {
    if (this.disabled || this.readonly) return;

    this.checked = this._input.checked;

    // Clear indeterminate state on user interaction
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.dispatchEvent(
      new CustomEvent<CheckboxChangeEventDetail>('checkbox-change', {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleClick = (event: MouseEvent): void => {
    if (this.readonly) {
      event.preventDefault();
    }
  };

  // ========== Public Methods ==========

  toggle(): void {
    if (this.disabled || this.readonly) return;

    this.checked = !this.checked;
    this._input.checked = this.checked;

    // Clear indeterminate state on programmatic toggle
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.dispatchEvent(
      new CustomEvent<CheckboxChangeEventDetail>('checkbox-change', {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-checkbox')) {
    customElements.define('r-checkbox', Checkbox);
    return Checkbox;
  } else {
    return createCustomError('document is undefined or r-checkbox already exists');
  }
}

export default Custom();
