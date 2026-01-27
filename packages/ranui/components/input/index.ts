import type {
  InputBlurEventDetail,
  InputChangeEventDetail,
  InputClearEventDetail,
  InputFocusEventDetail,
  InputInputEventDetail,
  InputSize,
  InputStatus,
  InputType,
  InputVariant,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/icon/index';

/**
 * Modern Input Component
 *
 * @element r-input
 *
 * @slot prefix - Prefix content
 * @slot suffix - Suffix content
 *
 * @fires input-change - Fired when value changes
 * @fires input-input - Fired on every keystroke
 * @fires input-focus - Fired when input gains focus
 * @fires input-blur - Fired when input loses focus
 * @fires input-clear - Fired when clear button is clicked
 * @fires input-enter - Fired when Enter key is pressed
 *
 * @csspart container - The input container
 * @csspart input - The native input/textarea element
 * @csspart label - The floating label
 * @csspart prefix - The prefix container
 * @csspart suffix - The suffix container
 * @csspart clear - The clear button
 * @csspart count - The character count
 * @csspart error - The error message
 */
export class Input extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _input!: HTMLInputElement | HTMLTextAreaElement;
  private _label?: HTMLLabelElement;
  private _prefixContainer!: HTMLSpanElement;
  private _suffixContainer!: HTMLSpanElement;
  private _clearButton?: HTMLButtonElement;
  private _countElement?: HTMLSpanElement;
  private _errorElement?: HTMLSpanElement;
  private _shadowRoot!: ShadowRoot;
  private _internals?: ElementInternals;

  static formAssociated = true;

  static get observedAttributes(): string[] {
    return [
      'type',
      'value',
      'placeholder',
      'name',
      'disabled',
      'readonly',
      'required',
      'size',
      'status',
      'variant',
      'maxlength',
      'min',
      'max',
      'step',
      'prefix',
      'suffix',
      'label',
      'clearable',
      'show-count',
      'autocomplete',
      'inputmode',
      'spellcheck',
      'minrows',
      'maxrows',
      'full-width',
      'aria-label',
      'error',
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

  get type(): InputType {
    return (this.getAttribute('type') as InputType) || 'text';
  }
  set type(value: InputType) {
    this.setAttribute('type', value);
  }

  get value(): string {
    return this._input?.value || '';
  }
  set value(value: string) {
    if (this._input) {
      this._input.value = value;
      this.updateInternals();
      this.updateCount();
    }
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || '';
  }
  set placeholder(value: string) {
    if (value) {
      this.setAttribute('placeholder', value);
    } else {
      this.removeAttribute('placeholder');
    }
  }

  get name(): string {
    return this.getAttribute('name') || '';
  }
  set name(value: string) {
    this.setAttribute('name', value);
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

  get size(): InputSize {
    return (this.getAttribute('size') as InputSize) || 'md';
  }
  set size(value: InputSize) {
    this.setAttribute('size', value);
  }

  get status(): InputStatus {
    return (this.getAttribute('status') as InputStatus) || 'normal';
  }
  set status(value: InputStatus) {
    this.setAttribute('status', value);
  }

  get variant(): InputVariant {
    return (this.getAttribute('variant') as InputVariant) || 'outlined';
  }
  set variant(value: InputVariant) {
    this.setAttribute('variant', value);
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

    const isTextarea = this.type === 'textarea';

    this._shadowRoot.innerHTML = `
      <div part="container" class="input-container">
        <span part="prefix" class="input-prefix">
          <slot name="prefix"></slot>
        </span>
        ${
          isTextarea
            ? '<textarea part="input" class="input-control"></textarea>'
            : '<input part="input" class="input-control" />'
        }
        <span part="suffix" class="input-suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.input-container')!;
    this._input = this._shadowRoot.querySelector('.input-control')!;
    this._prefixContainer = this._shadowRoot.querySelector('.input-prefix')!;
    this._suffixContainer = this._shadowRoot.querySelector('.input-suffix')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupInput();
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
      case 'type':
        this.handleTypeChange();
        break;

      case 'value':
        if (this._input) {
          this._input.value = newValue || '';
          this.updateCount();
        }
        break;

      case 'placeholder':
      case 'name':
      case 'maxlength':
      case 'min':
      case 'max':
      case 'step':
      case 'autocomplete':
      case 'inputmode':
      case 'spellcheck':
        this.updateInputAttributes();
        break;

      case 'disabled':
      case 'readonly':
      case 'required':
        this.updateInputState();
        break;

      case 'size':
      case 'status':
      case 'variant':
      case 'full-width':
        this.updateClasses();
        break;

      case 'label':
        this.updateLabel();
        break;

      case 'prefix':
        this.updatePrefixIcon();
        break;

      case 'suffix':
        this.updateSuffixIcon();
        break;

      case 'clearable':
        this.updateClearButton();
        break;

      case 'show-count':
        this.updateCount();
        break;

      case 'error':
        this.updateError();
        break;

      case 'aria-label':
        this.updateAriaAttributes();
        break;

      case 'minrows':
      case 'maxrows':
        this.updateTextareaRows();
        break;
    }
  }

  // ========== Methods ==========

  private setupInput(): void {
    this.updateInputAttributes();
    this.updateInputState();
    this.updateLabel();
    this.updatePrefixIcon();
    this.updateSuffixIcon();
    this.updateClearButton();
    this.updateCount();
    this.updateError();
    this.updateTextareaRows();
  }

  private updateInputAttributes(): void {
    if (!this._input) return;

    const attrs = {
      placeholder: this.placeholder,
      name: this.name,
      maxlength: this.getAttribute('maxlength'),
      autocomplete: this.getAttribute('autocomplete'),
      inputmode: this.getAttribute('inputmode'),
      spellcheck: this.getAttribute('spellcheck'),
    };

    // Set type for input (not textarea)
    if (this._input instanceof HTMLInputElement && this.type !== 'textarea') {
      this._input.type = this.type;

      // Number-specific attributes
      if (this.type === 'number') {
        const min = this.getAttribute('min');
        const max = this.getAttribute('max');
        const step = this.getAttribute('step');
        if (min) this._input.min = min;
        if (max) this._input.max = max;
        if (step) this._input.step = step;
      }
    }

    Object.entries(attrs).forEach(([key, value]) => {
      if (value) {
        this._input.setAttribute(key, value);
      } else {
        this._input.removeAttribute(key);
      }
    });
  }

  private updateInputState(): void {
    if (!this._input) return;

    this._input.disabled = this.disabled;
    this._input.readOnly = this.readonly;
    this._input.required = this.required;

    this.updateInternals();
  }

  private updateInternals(): void {
    if (!this._internals) return;

    if (this.disabled) {
      this._internals.setFormValue(null);
    } else {
      this._internals.setFormValue(this.value);
    }

    // Update validity
    if (this.required && !this.value) {
      this._internals.setValidity(
        { valueMissing: true },
        'This field is required',
        this._input
      );
    } else {
      this._internals.setValidity({});
    }
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'input-container',
      `input-${this.size}`,
      `input-${this.variant}`,
      `input-${this.status}`,
      this.disabled && 'input-disabled',
      this.readonly && 'input-readonly',
      this.hasAttribute('full-width') && 'input-full-width',
      this.value && 'input-has-value',
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private updateLabel(): void {
    const labelText = this.getAttribute('label');

    if (labelText) {
      if (!this._label) {
        this._label = document.createElement('label');
        this._label.setAttribute('part', 'label');
        this._label.className = 'input-label';
        this._container.appendChild(this._label);
      }
      this._label.textContent = labelText;
    } else if (this._label) {
      this._container.removeChild(this._label);
      this._label = undefined;
    }
  }

  private updatePrefixIcon(): void {
    const iconName = this.getAttribute('prefix');
    if (iconName) {
      this.updateIcon(this._prefixContainer, iconName);
    }
  }

  private updateSuffixIcon(): void {
    const iconName = this.getAttribute('suffix');
    if (iconName) {
      this.updateIcon(this._suffixContainer, iconName);
    }
  }

  private updateIcon(container: HTMLElement, iconName: string): void {
    let icon = container.querySelector('r-icon') as HTMLElement;
    if (!icon) {
      icon = document.createElement('r-icon');
      icon.setAttribute('size', '16');
      container.appendChild(icon);
    }
    icon.setAttribute('name', iconName);
    icon.setAttribute('aria-hidden', 'true');
  }

  private updateClearButton(): void {
    const shouldShow = this.hasAttribute('clearable');

    if (shouldShow && !this._clearButton) {
      this._clearButton = document.createElement('button');
      this._clearButton.setAttribute('part', 'clear');
      this._clearButton.className = 'input-clear';
      this._clearButton.type = 'button';
      this._clearButton.setAttribute('aria-label', 'Clear input');
      this._clearButton.innerHTML = `
        <r-icon name="close" size="14" aria-hidden="true"></r-icon>
      `;
      this._clearButton.addEventListener('click', this.handleClear);
      this._suffixContainer.appendChild(this._clearButton);
    } else if (!shouldShow && this._clearButton) {
      this._clearButton.removeEventListener('click', this.handleClear);
      this._suffixContainer.removeChild(this._clearButton);
      this._clearButton = undefined;
    }

    // Show/hide based on value
    if (this._clearButton) {
      this._clearButton.style.display = this.value ? 'inline-flex' : 'none';
    }
  }

  private updateCount(): void {
    const shouldShow = this.hasAttribute('show-count');
    const maxlength = this.getAttribute('maxlength');

    if (shouldShow && maxlength) {
      if (!this._countElement) {
        this._countElement = document.createElement('span');
        this._countElement.setAttribute('part', 'count');
        this._countElement.className = 'input-count';
        this._container.appendChild(this._countElement);
      }
      const current = this.value.length;
      this._countElement.textContent = `${current}/${maxlength}`;
    } else if (this._countElement) {
      this._container.removeChild(this._countElement);
      this._countElement = undefined;
    }
  }

  private updateError(): void {
    const errorText = this.getAttribute('error');

    if (errorText) {
      if (!this._errorElement) {
        this._errorElement = document.createElement('span');
        this._errorElement.setAttribute('part', 'error');
        this._errorElement.className = 'input-error';
        this._errorElement.setAttribute('role', 'alert');
        this._container.appendChild(this._errorElement);
      }
      this._errorElement.textContent = errorText;
      this.status = 'error';
    } else if (this._errorElement) {
      this._container.removeChild(this._errorElement);
      this._errorElement = undefined;
    }
  }

  private updateTextareaRows(): void {
    if (this._input instanceof HTMLTextAreaElement) {
      const minrows = this.getAttribute('minrows');
      const maxrows = this.getAttribute('maxrows');
      if (minrows) this._input.rows = parseInt(minrows);
      if (maxrows) this._input.style.maxHeight = `${parseInt(maxrows) * 1.5}em`;
    }
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

  private handleTypeChange(): void {
    // If switching to/from textarea, need to re-render
    const currentIsTextarea = this._input instanceof HTMLTextAreaElement;
    const newIsTextarea = this.type === 'textarea';

    if (currentIsTextarea !== newIsTextarea) {
      const currentValue = this.value;
      this.render();
      this.value = currentValue;
      this.setupInput();
      this.setupEventListeners();
    }
  }

  // ========== Event Handlers ==========

  private setupEventListeners(): void {
    this._input.addEventListener('input', this.handleInput);
    this._input.addEventListener('change', this.handleChange);
    this._input.addEventListener('focus', this.handleFocus);
    this._input.addEventListener('blur', this.handleBlur);
    this._input.addEventListener('keydown', this.handleKeyDown);
  }

  private removeEventListeners(): void {
    this._input?.removeEventListener('input', this.handleInput);
    this._input?.removeEventListener('change', this.handleChange);
    this._input?.removeEventListener('focus', this.handleFocus);
    this._input?.removeEventListener('blur', this.handleBlur);
    this._input?.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleInput = (event: Event): void => {
    const inputEvent = event as InputEvent;

    this.updateClasses();
    this.updateCount();
    this.updateClearButton();
    this.updateInternals();

    this.dispatchEvent(
      new CustomEvent<InputInputEventDetail>('input-input', {
        detail: {
          value: this.value,
          inputType: inputEvent.inputType,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleChange = (): void => {
    this.dispatchEvent(
      new CustomEvent<InputChangeEventDetail>('input-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleFocus = (): void => {
    this.dispatchEvent(
      new CustomEvent<InputFocusEventDetail>('input-focus', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleBlur = (): void => {
    this.dispatchEvent(
      new CustomEvent<InputBlurEventDetail>('input-blur', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && this.type !== 'textarea') {
      this.dispatchEvent(
        new CustomEvent<InputInputEventDetail>('input-enter', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private handleClear = (): void => {
    const previousValue = this.value;
    this.value = '';

    this.updateClasses();
    this.updateCount();
    this.updateClearButton();

    this.dispatchEvent(
      new CustomEvent<InputClearEventDetail>('input-clear', {
        detail: { previousValue },
        bubbles: true,
        composed: true,
      })
    );

    this._input.focus();
  };

  // ========== Public Methods ==========

  focus(options?: FocusOptions): void {
    this._input?.focus(options);
  }

  blur(): void {
    this._input?.blur();
  }

  select(): void {
    if (this._input instanceof HTMLInputElement || this._input instanceof HTMLTextAreaElement) {
      this._input.select();
    }
  }

  clear(): void {
    this.handleClear();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-input')) {
    customElements.define('r-input', Input);
    return Input;
  } else {
    return createCustomError('document is undefined or r-input already exists');
  }
}

export default Custom();
