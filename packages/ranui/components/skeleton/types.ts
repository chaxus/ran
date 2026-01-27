/**
 * Skeleton Component Type Definitions
 */

// ========== Basic Types ==========

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

// ========== Event Detail Types ==========

export interface SkeletonLoadEventDetail {
  loading: boolean;
}
