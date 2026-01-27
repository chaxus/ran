/**
 * Type definitions for Button component
 */

// Button variants
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'text';

// Button colors
export type ButtonColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

// Button sizes
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button radius
export type ButtonRadius = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'full';

// Icon position
export type IconPosition = 'start' | 'end';

/**
 * Button component properties
 */
export interface ButtonProps {
  /** Button variant style */
  variant?: ButtonVariant;

  /** Button color theme */
  color?: ButtonColor;

  /** Button size */
  size?: ButtonSize;

  /** Border radius */
  radius?: ButtonRadius;

  /** Whether button is disabled */
  disabled?: boolean;

  /** Whether button is in loading state */
  loading?: boolean;

  /** Icon name (from r-icon component) */
  icon?: string;

  /** Icon position */
  'icon-position'?: IconPosition;

  /** Icon size (in pixels) */
  'icon-size'?: string;

  /** Whether button takes full width */
  'full-width'?: boolean;

  /** Custom CSS rules to inject */
  sheet?: string;

  /** Accessibility label (required for icon-only buttons) */
  'aria-label'?: string;

  /** Whether to show ripple effect on click */
  effect?: boolean | 'false';
}

/**
 * Button element interface
 */
export interface ButtonElement extends HTMLElement {
  /** Button variant style */
  variant: ButtonVariant;

  /** Button color theme */
  color: ButtonColor;

  /** Button size */
  size: ButtonSize;

  /** Border radius */
  radius: ButtonRadius;

  /** Whether button is disabled */
  disabled: boolean;

  /** Whether button is in loading state */
  loading: boolean;

  /** Icon name */
  icon: string;

  /** Icon position */
  iconPosition: IconPosition;

  /** Icon size */
  iconSize: string;

  /** Whether button takes full width */
  fullWidth: boolean;

  /** Whether to show ripple effect */
  effect: boolean;

  /** Form the button belongs to */
  readonly form: HTMLFormElement | null;

  /** Element internals for form participation */
  readonly elementInternals: ElementInternals | undefined;

  /** Focus the button */
  focus(options?: FocusOptions): void;

  /** Blur the button */
  blur(): void;

  /** Click the button */
  click(): void;
}

/**
 * Button event detail types
 */
export interface ButtonClickEventDetail {
  disabled: boolean;
  loading: boolean;
}

export interface LoadingChangeEventDetail {
  loading: boolean;
}

export interface DisabledChangeEventDetail {
  disabled: boolean;
}

/**
 * Button custom events
 */
export interface ButtonEventMap {
  /** Fired when button is clicked (mouse or keyboard) */
  'button-click': CustomEvent<ButtonClickEventDetail>;

  /** Fired when loading state changes */
  'loading-change': CustomEvent<LoadingChangeEventDetail>;

  /** Fired when disabled state changes */
  'disabled-change': CustomEvent<DisabledChangeEventDetail>;
}

/**
 * HTML attributes for the button element
 */
export interface ButtonHTMLAttributes extends Partial<ButtonProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;
  tabindex?: number | string;
  role?: string;

  // Event handlers
  onclick?: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  onkeydown?: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
  onfocus?: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
  onblur?: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-button': ButtonElement;
  }

  interface HTMLElementEventMap {
    'button-click': CustomEvent<ButtonClickEventDetail>;
    'loading-change': CustomEvent<LoadingChangeEventDetail>;
    'disabled-change': CustomEvent<DisabledChangeEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 * This will work with any JSX-compatible framework
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-button': ButtonHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onButtonClick?: (event: CustomEvent<ButtonClickEventDetail>) => void;
        onLoadingChange?: (event: CustomEvent<LoadingChangeEventDetail>) => void;
        onDisabledChange?: (event: CustomEvent<DisabledChangeEventDetail>) => void;
      };
    }
  }
}

export {};
