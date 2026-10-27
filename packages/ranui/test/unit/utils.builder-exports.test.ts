import { describe, expect, it } from 'vitest';
import * as ranview from '@alixex/ranview';
import * as builder from '@/utils/builder';

describe('ranui/builder', () => {
  it('re-exports every runtime export of ranview, by name', () => {
    expect(Object.keys(builder).sort()).toEqual(Object.keys(ranview).sort());
  });
});
