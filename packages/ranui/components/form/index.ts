import type {
  FieldError,
  FieldRules,
  FormChangeEventDetail,
  FormDataValue,
  FormLayout,
  FormResetEventDetail,
  FormSubmitEventDetail,
  FormValidateEventDetail,
  ValidationResult,
  ValidationRule,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Form Component
 *
 * @element r-form
 *
 * @fires submit - Fired when form is submitted
 * @fires validate - Fired when form validation completes
 * @fires reset - Fired when form is reset
 * @fires change - Fired when any field value changes
 *
 * @slot - Form content (form controls)
 *
 * @csspart form - The form element
 *
 * @cssprop --form-label-color - Label text color
 * @cssprop --form-error-color - Error message color
 * @cssprop --form-item-margin-bottom - Margin bottom for form items
 */
export class Form extends (HTMLElementSSR()!) {
  private _form!: HTMLFormElement;
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;
  private _rules: FieldRules = {};
  private _initialData: FormDataValue = {};

  static get observedAttributes(): string[] {
    return ['disabled', 'layout', 'loading'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get layout(): FormLayout {
    return (this.getAttribute('layout') as FormLayout) || 'vertical';
  }
  set layout(value: FormLayout) {
    this.setAttribute('layout', value);
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

  get loading(): boolean {
    return this.hasAttribute('loading');
  }
  set loading(value: boolean) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._slot = document.createElement('slot');

    this._form = document.createElement('form');
    this._form.className = 'r-form';
    this._form.setAttribute('part', 'form');
    this._form.setAttribute('novalidate', '');
    this._form.appendChild(this._slot);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._form);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupEventListeners();
    this._initialData = this.getFormData();
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'disabled':
        this.updateDisabledState();
        break;
    }
  }

  // ========== Event Listeners ==========

  private setupEventListeners(): void {
    this._form.addEventListener('submit', this.handleSubmit);
    this._form.addEventListener('reset', this.handleReset);
    this._form.addEventListener('change', this.handleChange);
    this._form.addEventListener('input', this.handleInput);
  }

  private removeEventListeners(): void {
    this._form.removeEventListener('submit', this.handleSubmit);
    this._form.removeEventListener('reset', this.handleReset);
    this._form.removeEventListener('change', this.handleChange);
    this._form.removeEventListener('input', this.handleInput);
  }

  private handleSubmit = async (event: Event): Promise<void> => {
    event.preventDefault();

    if (this.disabled || this.loading) return;

    const formData = new FormData(this._form);
    const data = this.getFormData();
    const validation = await this.validate();

    // Dispatch submit event
    const submitEvent = new CustomEvent<FormSubmitEventDetail>('submit', {
      detail: { data, formData, validation },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    const shouldContinue = this.dispatchEvent(submitEvent);

    // If validation failed or event was cancelled, don't proceed
    if (!validation.valid || !shouldContinue) {
      return;
    }
  };

  private handleReset = (): void => {
    const previousData = this.getFormData();

    // Dispatch reset event
    this.dispatchEvent(
      new CustomEvent<FormResetEventDetail>('reset', {
        detail: { previousData },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const field = target.name;

    if (!field) return;

    const data = this.getFormData();
    const value = data[field];

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent<FormChangeEventDetail>('change', {
        detail: { field, value, data },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleInput = (event: Event): void => {
    // Can be used for real-time validation
    const target = event.target as HTMLInputElement;
    const field = target.name;

    if (field && this._rules[field]) {
      // Optionally validate field on input
      this.validateField(field).catch(console.error);
    }
  };

  // ========== Form Data Methods ==========

  private getFormData(): FormDataValue {
    const formData = new FormData(this._form);
    const data: FormDataValue = {};

    formData.forEach((value, key) => {
      const all = formData.getAll(key);
      data[key] = all.length > 1 ? all : value;
    });

    return data;
  }

  // ========== Validation Methods ==========

  private async validateField(fieldName: string): Promise<FieldError[]> {
    const rules = this._rules[fieldName];
    if (!rules) return [];

    const data = this.getFormData();
    const value = data[fieldName];
    const ruleArray = Array.isArray(rules) ? rules : [rules];
    const errors: FieldError[] = [];

    for (const rule of ruleArray) {
      const error = await this.validateRule(fieldName, value, rule, data);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  private async validateRule(
    field: string,
    value: any,
    rule: ValidationRule,
    formData: FormDataValue
  ): Promise<FieldError | null> {
    // Required validation
    if (rule.required && !value) {
      return {
        field,
        message: rule.message || `${field} is required`,
        rule: 'required',
      };
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) return null;

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return {
        field,
        message: rule.message || `${field} format is invalid`,
        rule: 'pattern',
      };
    }

    // Min validation
    if (rule.min !== undefined && Number(value) < rule.min) {
      return {
        field,
        message: rule.message || `${field} must be at least ${rule.min}`,
        rule: 'min',
      };
    }

    // Max validation
    if (rule.max !== undefined && Number(value) > rule.max) {
      return {
        field,
        message: rule.message || `${field} must be at most ${rule.max}`,
        rule: 'max',
      };
    }

    // MinLength validation
    if (rule.minLength !== undefined && String(value).length < rule.minLength) {
      return {
        field,
        message: rule.message || `${field} must be at least ${rule.minLength} characters`,
        rule: 'minLength',
      };
    }

    // MaxLength validation
    if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
      return {
        field,
        message: rule.message || `${field} must be at most ${rule.maxLength} characters`,
        rule: 'maxLength',
      };
    }

    // Custom validator
    if (rule.validator) {
      const result = await rule.validator(value, formData);
      if (result !== true) {
        return {
          field,
          message: typeof result === 'string' ? result : (rule.message || `${field} validation failed`),
          rule: 'custom',
        };
      }
    }

    return null;
  }

  private updateDisabledState(): void {
    const elements = this._form.elements;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;
      if (this.disabled) {
        element.setAttribute('disabled', '');
      } else {
        element.removeAttribute('disabled');
      }
    }
  }

  // ========== Public Methods ==========

  /**
   * Validate the entire form
   */
  public async validate(): Promise<ValidationResult> {
    const data = this.getFormData();
    const allErrors: FieldError[] = [];

    // Validate all fields that have rules
    for (const fieldName in this._rules) {
      const fieldErrors = await this.validateField(fieldName);
      allErrors.push(...fieldErrors);
    }

    const result: ValidationResult = {
      valid: allErrors.length === 0,
      errors: allErrors,
      errorFields: [...new Set(allErrors.map((e) => e.field))],
    };

    // Dispatch validate event
    this.dispatchEvent(
      new CustomEvent<FormValidateEventDetail>('validate', {
        detail: {
          valid: result.valid,
          errors: result.errors,
          data,
        },
        bubbles: true,
        composed: true,
      })
    );

    return result;
  }

  /**
   * Set validation rules for the form
   */
  public setRules(rules: FieldRules): void {
    this._rules = rules;
  }

  /**
   * Get validation rules
   */
  public getRules(): FieldRules {
    return this._rules;
  }

  /**
   * Submit the form programmatically
   */
  public submit(): void {
    this._form.requestSubmit();
  }

  /**
   * Reset the form
   */
  public reset(): void {
    this._form.reset();
  }

  /**
   * Get current form data as object
   */
  public getData(): FormDataValue {
    return this.getFormData();
  }

  /**
   * Set form data
   */
  public setData(data: FormDataValue): void {
    const elements = this._form.elements;

    for (const key in data) {
      const element = elements.namedItem(key) as HTMLInputElement;
      if (element) {
        const value = data[key];
        if (Array.isArray(value)) {
          // Handle multiple values (checkboxes, multi-select)
          if (element.type === 'checkbox') {
            (element as HTMLInputElement).checked = value.includes(element.value);
          }
        } else {
          if (element.type === 'checkbox') {
            (element as HTMLInputElement).checked = Boolean(value);
          } else if (element.type === 'radio') {
            (element as HTMLInputElement).checked = element.value === value;
          } else {
            element.value = String(value);
          }
        }
      }
    }
  }

  /**
   * Clear all form values
   */
  public clear(): void {
    this._form.reset();
    const elements = this._form.elements;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLInputElement;
      if (element.type !== 'submit' && element.type !== 'button') {
        element.value = '';
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = false;
        }
      }
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-form')) {
    customElements.define('r-form', Form);
    return Form;
  } else {
    return createCustomError('document is undefined or r-form already exists');
  }
}

export default Custom();
