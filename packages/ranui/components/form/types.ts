/**
 * Form Component Types
 */

/**
 * Form data interface
 */
export interface FormDataValue {
  [key: string]: FormDataEntryValue | FormDataEntryValue[];
}

/**
 * Validation rule types
 */
export type ValidatorFunction = (value: any, formData: FormDataValue) => boolean | string | Promise<boolean | string>;

/**
 * Validation rule interface
 */
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  validator?: ValidatorFunction;
  message?: string;
}

/**
 * Field validation rules
 */
export interface FieldRules {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

/**
 * Field error interface
 */
export interface FieldError {
  field: string;
  message: string;
  rule?: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
  errorFields: string[];
}

/**
 * Event detail for form submit events
 */
export interface FormSubmitEventDetail {
  data: FormDataValue;
  formData: globalThis.FormData;
  validation: ValidationResult;
}

/**
 * Event detail for form validate events
 */
export interface FormValidateEventDetail {
  valid: boolean;
  errors: FieldError[];
  data: FormDataValue;
}

/**
 * Event detail for form reset events
 */
export interface FormResetEventDetail {
  previousData: FormDataValue;
}

/**
 * Event detail for form change events
 */
export interface FormChangeEventDetail {
  field: string;
  value: any;
  data: FormDataValue;
}

/**
 * Form layout type
 */
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
