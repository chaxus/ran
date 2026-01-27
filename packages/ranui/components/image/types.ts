/**
 * Image Component Type Definitions
 */

// ========== Basic Types ==========

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
export type ImageLoadingStrategy = 'eager' | 'lazy';

// ========== Event Detail Types ==========

export interface ImageLoadEventDetail {
  src: string;
  width: number;
  height: number;
}

export interface ImageErrorEventDetail {
  src: string;
  error: Event;
}
