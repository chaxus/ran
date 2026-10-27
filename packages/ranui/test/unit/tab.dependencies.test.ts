import { describe, expect, it } from 'vitest';
import '@/components/tab';

describe('r-tabs per-component import', () => {
  it('registers the r-button its headers are built from', () => {
    expect(customElements.get('r-button')).toBeDefined();
  });
});
