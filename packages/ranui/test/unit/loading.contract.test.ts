import { describe, expect, it, beforeEach } from 'vitest';
import type { Loading } from '@/components/loading/index';
// Ensure custom elements are defined
import '@/components/loading/index';

describe('r-loading contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects name property to attributes', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);

    // Initial state (default name should be rotate or similar)
    // Just testing reflection here
    loading.name = 'rotate';
    expect(loading.getAttribute('name')).toBe('rotate');

    loading.name = 'stretch';
    expect(loading.getAttribute('name')).toBe('stretch');
  });

  it('renders different loading animations based on name', () => {
    const loading = document.createElement('r-loading') as unknown as Loading;
    document.body.appendChild(loading);

    const shadow = loading.shadowRoot!;

    loading.name = 'dot';
    expect(shadow.querySelector('.dot')).not.toBeNull();

    loading.name = 'rotate';
    expect(shadow.querySelector('.rotate')).not.toBeNull();

    loading.name = 'stretch';
    expect(shadow.querySelector('.stretch')).not.toBeNull();
  });
});
