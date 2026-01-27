/**
 * Type definitions for Checkbox component
 */

// Checkbox sizes
export type CheckboxSize = 'sm' | 'md' | 'lg';

// Checkbox status
export type CheckboxStatus = 'normal' | 'error' | 'warning' | 'success';

/**
 * Checkbox component properties
 */
export interface CheckboxProps {
  /** Whether checkbox is checked */
  checked?: boolean;

  /** Checkbox value */
  value?: string;

  /** Whether checkbox is disabled */
  disabled?: boolean;

  /** Whether checkbox is readonly */
  readonly?: boolean;

  /** Whether checkbox is required */
  required?: boolean;

  /** Whether checkbox is indeterminate */
  indeterminate?: boolean;

  /** Checkbox size */
  size?: CheckboxSize;

  /** Checkbox status */
  status?: CheckboxStatus;

  /** Checkbox name for forms */
  name?: string;

  /** Label text */
  label?: string;

  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * Checkbox element interface
 */
export interface CheckboxElement extends HTMLElement {
  /** Whether checkbox is checked */
  checked: boolean;

  /** Checkbox value */
  value: string;

  /** Disabled state */
  disabled: boolean;

  /** Readonly state */
  readonly: boolean;

  /** Required state */
  required: boolean;

  /** Indeterminate state */
  indeterminate: boolean;

  /** Checkbox size */
  size: CheckboxSize;

  /** Checkbox status */
  status: CheckboxStatus;

  /** Checkbox name */
  name: string;

  /** Form element */
  readonly form: HTMLFormElement | null;

  /** Element internals */
  readonly elementInternals: ElementInternals | undefined;

  /** Toggle the checkbox */
  toggle(): void;
}

/**
 * Checkbox event detail types
 */
export interface CheckboxChangeEventDetail {
  checked: boolean;
  value: string;
}

/**
 * Checkbox custom events
 */
export interface CheckboxEventMap {
  /** Fired when checkbox state changes */
  'checkbox-change': CustomEvent<CheckboxChangeEventDetail>;
}

/**
 * HTML attributes for the checkbox element
 */
export interface CheckboxHTMLAttributes extends Partial<CheckboxProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;
  tabindex?: number | string;

  // Event handlers
  onchange?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-checkbox': CheckboxElement;
  }

  interface HTMLElementEventMap {
    'checkbox-change': CustomEvent<CheckboxChangeEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-checkbox': CheckboxHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onCheckboxChange?: (event: CustomEvent<CheckboxChangeEventDetail>) => void;
      };
    }
  }
}

export {};
