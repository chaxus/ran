/**
 * Form Component Types
 */

/**
 * Form data interface
 */
export interface FormData {
  [key: string]: FormDataEntryValue | FormDataEntryValue[];
}

/**
 * Form validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
}

/**
 * Event detail for form submit events
 */
export interface FormSubmitEventDetail {
  data: FormData;
  formData: globalThis.FormData;
}

/**
 * Event detail for form validate events
 */
export interface FormValidateEventDetail extends ValidationResult {
  data: FormData;
}

/**
 * Event detail for form reset events
 */
export interface FormResetEventDetail {
  previousData: FormData;
}
