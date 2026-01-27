/**
 * Type definitions for Progress component
 */

// Progress types
export type ProgressType = 'line' | 'circle' | 'dashboard';

// Progress sizes
export type ProgressSize = 'sm' | 'md' | 'lg';

// Progress status
export type ProgressStatus = 'normal' | 'success' | 'error' | 'warning' | 'active';

/**
 * Progress component properties
 */
export interface ProgressProps {
  /** Progress percentage (0-100) */
  percent?: number;

  /** Progress type */
  type?: ProgressType;

  /** Progress size */
  size?: ProgressSize;

  /** Progress status */
  status?: ProgressStatus;

  /** Whether to show progress text */
  'show-text'?: boolean;

  /** Custom progress text format function */
  format?: (percent: number) => string;

  /** Progress color (can be string or function) */
  color?: string | ((percent: number) => string);

  /** Stroke width for line progress */
  'stroke-width'?: number;

  /** Whether progress can be dragged (interactive) */
  draggable?: boolean;

  /** Width for circle/dashboard type (in px) */
  width?: number;

  /** Indeterminate progress (loading state) */
  indeterminate?: boolean;
}

/**
 * Progress element interface
 */
export interface ProgressElement extends HTMLElement {
  /** Progress percentage (0-100) */
  percent: number;

  /** Progress type */
  type: ProgressType;

  /** Progress size */
  size: ProgressSize;

  /** Progress status */
  status: ProgressStatus;

  /** Whether draggable */
  draggable: boolean;

  /** Whether indeterminate */
  indeterminate: boolean;
}

/**
 * Progress event detail types
 */
export interface ProgressChangeEventDetail {
  percent: number;
}

/**
 * Progress custom events
 */
export interface ProgressEventMap {
  /** Fired when progress value changes */
  'progress-change': CustomEvent<ProgressChangeEventDetail>;
}

/**
 * HTML attributes for the progress element
 */
export interface ProgressHTMLAttributes extends Partial<ProgressProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;

  // Event handlers
  onchange?: ((this: GlobalEventHandlers, ev: Event) => any) | null;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-progress': ProgressElement;
  }

  interface HTMLElementEventMap {
    'progress-change': CustomEvent<ProgressChangeEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-progress': ProgressHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onProgressChange?: (event: CustomEvent<ProgressChangeEventDetail>) => void;
      };
    }
  }
}

export {};
