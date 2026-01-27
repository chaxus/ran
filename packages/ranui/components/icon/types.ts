/**
 * Type definitions for Icon component
 */

/**
 * Icon component properties
 */
export interface IconProps {
  /** Icon name (filename without .svg extension) */
  name?: string;

  /** Icon size (in pixels or CSS units like '1em', '24px') */
  size?: string | number;

  /** Icon color (CSS color value or 'currentColor') */
  color?: string;

  /** Spin animation duration in seconds */
  spin?: number | string;

  /** Custom CSS rules to inject */
  sheet?: string;

  /** Accessibility label */
  'aria-label'?: string;

  /** Whether icon is decorative only */
  'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * Icon element interface
 */
export interface IconElement extends HTMLElement {
  /** Icon name */
  name: string | null;

  /** Icon size */
  size: string | number | null;

  /** Icon color */
  color: string | null;

  /** Spin animation duration */
  spin: string | number | null;

  /** Load icon from local assets or external source */
  load(source?: string): Promise<void>;
}

/**
 * Icon event detail types
 */
export interface IconLoadEventDetail {
  name: string;
  success: boolean;
  error?: Error;
}

/**
 * Icon custom events
 */
export interface IconEventMap {
  /** Fired when icon finishes loading */
  'icon-load': CustomEvent<IconLoadEventDetail>;

  /** Fired when icon fails to load */
  'icon-error': CustomEvent<IconLoadEventDetail>;
}

/**
 * HTML attributes for the icon element
 */
export interface IconHTMLAttributes extends Partial<IconProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;
  role?: string;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-icon': IconElement;
  }

  interface HTMLElementEventMap {
    'icon-load': CustomEvent<IconLoadEventDetail>;
    'icon-error': CustomEvent<IconLoadEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-icon': IconHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onIconLoad?: (event: CustomEvent<IconLoadEventDetail>) => void;
        onIconError?: (event: CustomEvent<IconLoadEventDetail>) => void;
      };
    }
  }
}

export {};
