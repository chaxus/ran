/**
 * Type definitions for Message component
 */

// Message types
export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading';

// Message positions
export type MessagePosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

/**
 * Message options
 */
export interface MessageOptions {
  /** Message content */
  content: string;

  /** Message type */
  type?: MessageType;

  /** Display duration in milliseconds (0 for persistent) */
  duration?: number;

  /** Whether message can be closed manually */
  closable?: boolean;

  /** Custom icon name */
  icon?: string;

  /** Callback when message is closed */
  onClose?: () => void;

  /** Custom class name */
  className?: string;
}

/**
 * Message instance
 */
export interface MessageInstance {
  /** Close this message */
  close: () => void;

  /** Update message content */
  update: (options: Partial<MessageOptions>) => void;
}

/**
 * Message API
 */
export interface MessageAPI {
  /** Show an info message */
  info(content: string | MessageOptions): MessageInstance;

  /** Show a success message */
  success(content: string | MessageOptions): MessageInstance;

  /** Show a warning message */
  warning(content: string | MessageOptions): MessageInstance;

  /** Show an error message */
  error(content: string | MessageOptions): MessageInstance;

  /** Show a loading message */
  loading(content: string | MessageOptions): MessageInstance;

  /** Show a custom message */
  open(options: MessageOptions): MessageInstance;

  /** Destroy all messages */
  destroyAll(): void;

  /** Configure global message settings */
  config(options: MessageGlobalConfig): void;
}

/**
 * Global message configuration
 */
export interface MessageGlobalConfig {
  /** Default duration in milliseconds */
  duration?: number;

  /** Default position */
  position?: MessagePosition;

  /** Maximum number of messages shown at once */
  maxCount?: number;

  /** Distance from top/bottom in pixels */
  offset?: number;
}

/**
 * Message element interface
 */
export interface MessageElement extends HTMLElement {
  /** Message type */
  type: MessageType;

  /** Message content */
  content: string;

  /** Whether closable */
  closable: boolean;

  /** Custom icon */
  icon?: string;

  /** Close the message */
  close(): void;
}

/**
 * Global type declarations
 */
declare global {
  interface HTMLElementTagNameMap {
    'r-message': MessageElement;
  }

  interface Window {
    /** Message API */
    message: MessageAPI;

    ranui: {
      message?: MessageAPI;
    };
  }
}
