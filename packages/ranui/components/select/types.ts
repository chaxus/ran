/**
 * Select Component Type Definitions
 */

// ========== Basic Types ==========

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectPlacement = 'top' | 'bottom';
export type SelectTrigger = 'click' | 'hover' | 'click,hover';

// ========== Option Types ==========

export interface SelectOption {
  label: string | number;
  value: string | number;
  disabled?: boolean;
}

// ========== Event Detail Types ==========

export interface SelectChangeEventDetail {
  value: string | number;
  label: string | number;
  option: SelectOption;
}

export interface SelectSearchEventDetail {
  query: string;
}

export interface SelectOpenEventDetail {
  visible: boolean;
}

export interface SelectCloseEventDetail {
  visible: boolean;
}

export interface SelectFocusEventDetail {
  value: string | number;
}

export interface SelectBlurEventDetail {
  value: string | number;
}

export interface SelectClearEventDetail {
  previousValue: string | number;
}
