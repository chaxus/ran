/**
 * Dropdown Component Types
 */

/**
 * Arrow position types
 */
export type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Transition animation types
 */
export type TransitType =
  | 'ran-dropdown-up-in'
  | 'ran-dropdown-up-out'
  | 'ran-dropdown-down-in'
  | 'ran-dropdown-down-out'
  | 'ran-dropdown-left-in'
  | 'ran-dropdown-left-out'
  | 'ran-dropdown-right-in'
  | 'ran-dropdown-right-out';

/**
 * Event detail for dropdown show/hide events
 */
export interface DropdownVisibilityEventDetail {
  visible: boolean;
}

/**
 * Event detail for dropdown transit events
 */
export interface DropdownTransitEventDetail {
  transit: TransitType;
}
