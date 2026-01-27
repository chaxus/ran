/**
 * Type definitions for Input component
 */

// Input types
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'textarea';

// Input sizes
export type InputSize = 'sm' | 'md' | 'lg';

// Input status
export type InputStatus = 'normal' | 'error' | 'warning' | 'success';

// Input variant
export type InputVariant = 'outlined' | 'filled' | 'borderless';

/**
 * Input component properties
 */
export interface InputProps {
  /** Input type */
  type?: InputType;

  /** Input value */
  value?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Input name for forms */
  name?: string;

  /** Whether input is disabled */
  disabled?: boolean;

  /** Whether input is readonly */
  readonly?: boolean;

  /** Whether input is required */
  required?: boolean;

  /** Input size */
  size?: InputSize;

  /** Input status */
  status?: InputStatus;

  /** Input variant */
  variant?: InputVariant;

  /** Maximum length */
  maxlength?: number;

  /** Minimum value (for number type) */
  min?: string | number;

  /** Maximum value (for number type) */
  max?: string | number;

  /** Step value (for number type) */
  step?: string | number;

  /** Prefix icon */
  prefix?: string;

  /** Suffix icon */
  suffix?: string;

  /** Label text (floating label) */
  label?: string;

  /** Show clear button */
  clearable?: boolean;

  /** Show character count */
  'show-count'?: boolean;

  /** Autocomplete attribute */
  autocomplete?: string;

  /** Input mode for mobile keyboards */
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

  /** Disable spell check */
  spellcheck?: boolean;

  /** Textarea minimum rows */
  minrows?: number;

  /** Textarea maximum rows */
  maxrows?: number;

  /** Full width */
  'full-width'?: boolean;

  /** Accessibility label */
  'aria-label'?: string;

  /** Error message */
  error?: string;
}

/**
 * Input element interface
 */
export interface InputElement extends HTMLElement {
  /** Input type */
  type: InputType;

  /** Input value */
  value: string;

  /** Placeholder */
  placeholder: string;

  /** Input name */
  name: string;

  /** Disabled state */
  disabled: boolean;

  /** Readonly state */
  readonly: boolean;

  /** Required state */
  required: boolean;

  /** Input size */
  size: InputSize;

  /** Input status */
  status: InputStatus;

  /** Input variant */
  variant: InputVariant;

  /** Form element */
  readonly form: HTMLFormElement | null;

  /** Element internals */
  readonly elementInternals: ElementInternals | undefined;

  /** Focus the input */
  focus(options?: FocusOptions): void;

  /** Blur the input */
  blur(): void;

  /** Select text */
  select(): void;

  /** Clear value */
  clear(): void;
}

/**
 * Input event detail types
 */
export interface InputChangeEventDetail {
  value: string;
}

export interface InputInputEventDetail {
  value: string;
  inputType?: string;
}

export interface InputFocusEventDetail {
  value: string;
}

export interface InputBlurEventDetail {
  value: string;
}

export interface InputClearEventDetail {
  previousValue: string;
}

/**
 * Input custom events
 */
export interface InputEventMap {
  /** Fired when input value changes */
  'input-change': CustomEvent<InputChangeEventDetail>;

  /** Fired on input (every keystroke) */
  'input-input': CustomEvent<InputInputEventDetail>;

  /** Fired when input gains focus */
  'input-focus': CustomEvent<InputFocusEventDetail>;

  /** Fired when input loses focus */
  'input-blur': CustomEvent<InputBlurEventDetail>;

  /** Fired when clear button is clicked */
  'input-clear': CustomEvent<InputClearEventDetail>;

  /** Fired when Enter is pressed */
  'input-enter': CustomEvent<InputInputEventDetail>;
}

/**
 * HTML attributes for the input element
 */
export interface InputHTMLAttributes extends Partial<InputProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;
  tabindex?: number | string;

  // Event handlers
  oninput?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onchange?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
  onfocus?: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
  onblur?: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-input': InputElement;
  }

  interface HTMLElementEventMap {
    'input-change': CustomEvent<InputChangeEventDetail>;
    'input-input': CustomEvent<InputInputEventDetail>;
    'input-focus': CustomEvent<InputFocusEventDetail>;
    'input-blur': CustomEvent<InputBlurEventDetail>;
    'input-clear': CustomEvent<InputClearEventDetail>;
    'input-enter': CustomEvent<InputInputEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-input': InputHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onInputChange?: (event: CustomEvent<InputChangeEventDetail>) => void;
        onInputInput?: (event: CustomEvent<InputInputEventDetail>) => void;
        onInputFocus?: (event: CustomEvent<InputFocusEventDetail>) => void;
        onInputBlur?: (event: CustomEvent<InputBlurEventDetail>) => void;
        onInputClear?: (event: CustomEvent<InputClearEventDetail>) => void;
        onInputEnter?: (event: CustomEvent<InputInputEventDetail>) => void;
      };
    }
  }
}

export {};
