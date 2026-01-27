/**
 * Popover Component Types
 */

/**
 * Popover placement positions
 */
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Popover trigger types
 */
export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'manual';

/**
 * Event detail for popover visibility events
 */
export interface PopoverVisibilityEventDetail {
  visible: boolean;
  placement: PopoverPlacement;
}

/**
 * Event detail for popover content change events
 */
export interface PopoverContentChangeEventDetail {
  content: HTMLCollection;
}
