/**
 * Math Component Types
 */

/**
 * Event detail for math render events
 */
export interface MathRenderEventDetail {
  latex: string;
  success: boolean;
}

/**
 * Event detail for math error events
 */
export interface MathErrorEventDetail {
  latex: string;
  error: Error;
}
