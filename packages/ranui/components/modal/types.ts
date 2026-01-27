/**
 * Type definitions for Modal component
 */

// Modal sizes
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal component properties
 */
export interface ModalProps {
  /** Whether modal is visible */
  visible?: boolean;

  /** Modal title */
  title?: string;

  /** Modal size */
  size?: ModalSize;

  /** Whether to show close button */
  closable?: boolean;

  /** Whether to close modal when clicking mask */
  'mask-closable'?: boolean;

  /** Whether to show mask (backdrop) */
  mask?: boolean;

  /** Whether modal can be closed by pressing ESC */
  'keyboard-closable'?: boolean;

  /** Whether to destroy content when closed */
  'destroy-on-close'?: boolean;

  /** Whether to center modal vertically */
  centered?: boolean;

  /** Custom footer content */
  footer?: boolean;

  /** Z-index of modal */
  'z-index'?: number;

  /** Custom class for modal */
  'modal-class'?: string;

  /** Custom class for mask */
  'mask-class'?: string;
}

/**
 * Modal element interface
 */
export interface ModalElement extends HTMLElement {
  /** Whether modal is visible */
  visible: boolean;

  /** Modal title */
  title: string;

  /** Modal size */
  size: ModalSize;

  /** Whether closable */
  closable: boolean;

  /** Whether mask closable */
  maskClosable: boolean;

  /** Whether centered */
  centered: boolean;

  /** Open the modal */
  open(): void;

  /** Close the modal */
  close(): void;

  /** Toggle the modal */
  toggle(): void;
}

/**
 * Modal event detail types
 */
export interface ModalOpenEventDetail {
  visible: true;
}

export interface ModalCloseEventDetail {
  visible: false;
}

/**
 * Modal custom events
 */
export interface ModalEventMap {
  /** Fired when modal opens */
  'modal-open': CustomEvent<ModalOpenEventDetail>;

  /** Fired when modal closes */
  'modal-close': CustomEvent<ModalCloseEventDetail>;

  /** Fired when trying to close modal (can be prevented) */
  'modal-before-close': CustomEvent<ModalCloseEventDetail>;
}

/**
 * HTML attributes for the modal element
 */
export interface ModalHTMLAttributes extends Partial<ModalProps> {
  class?: string;
  style?: string;
  id?: string;
  slot?: string;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-modal': ModalElement;
  }

  interface HTMLElementEventMap {
    'modal-open': CustomEvent<ModalOpenEventDetail>;
    'modal-close': CustomEvent<ModalCloseEventDetail>;
    'modal-before-close': CustomEvent<ModalCloseEventDetail>;
  }
}

/**
 * JSX IntrinsicElements for framework support
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-modal': ModalHTMLAttributes & {
        children?: any;
        // Framework-specific event handlers
        onModalOpen?: (event: CustomEvent<ModalOpenEventDetail>) => void;
        onModalClose?: (event: CustomEvent<ModalCloseEventDetail>) => void;
        onModalBeforeClose?: (event: CustomEvent<ModalCloseEventDetail>) => void;
      };
    }
  }
}

export {};
