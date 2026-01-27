/**
 * Loading Component Type Definitions
 */

// ========== Basic Types ==========

export type LoadingType =
  | 'double-bounce'
  | 'rotate'
  | 'stretch'
  | 'cube'
  | 'dot'
  | 'triple-bounce'
  | 'scale-out'
  | 'circle'
  | 'circle-line'
  | 'square'
  | 'pulse'
  | 'solar'
  | 'cube-fold'
  | 'circle-fold'
  | 'cube-grid'
  | 'circle-turn'
  | 'circle-rotate'
  | 'circle-spin'
  | 'dot-bar'
  | 'dot-circle'
  | 'line'
  | 'dot-pulse'
  | 'line-scale'
  | 'text'
  | 'cube-dim'
  | 'dot-line'
  | 'arc'
  | 'drop'
  | 'pacman';

export type LoadingSize = 'sm' | 'md' | 'lg';
export type LoadingColor = string;

// ========== Event Detail Types ==========

export interface LoadingChangeEventDetail {
  type: LoadingType;
}
