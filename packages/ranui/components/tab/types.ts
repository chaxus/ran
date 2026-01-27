/**
 * Tab Component Types
 */

/**
 * Tab type variants
 */
export type TabType = 'flat' | 'line';

/**
 * Tab alignment options
 */
export type TabAlign = 'start' | 'center' | 'end';

/**
 * Event detail for tab change events
 */
export interface TabChangeEventDetail {
  active: string;
  previousActive?: string;
}

/**
 * Tab header configuration
 */
export interface TabHeaderConfig {
  key: string;
  label: string;
  icon?: string;
  iconSize?: string;
  disabled?: boolean;
  type?: string;
}
