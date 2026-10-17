import { describe, expect, it } from 'vitest';
import { alignCrossAxis as ownerAlignCrossAxis, computePlacement as ownerComputePlacement } from 'ranuts/utils';
import { alignCrossAxis, computePlacement } from '@/utils/placement';

describe('placement facade', () => {
  it('uses the shared geometry implementation', () => {
    expect(computePlacement).toBe(ownerComputePlacement);
    expect(alignCrossAxis).toBe(ownerAlignCrossAxis);
  });
});
