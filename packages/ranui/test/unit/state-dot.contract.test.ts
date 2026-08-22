import { beforeEach, describe, expect, it } from 'vitest';
import { StateDot } from '@/components/state-dot';
import '@/components/state-dot';

/**
 * Mounts a dot.
 *
 * @returns The element.
 */
function mount(): StateDot {
  const dot = document.createElement('r-state-dot') as StateDot;
  document.body.appendChild(dot);
  return dot;
}

describe('r-state-dot contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders one element that carries both the halo and the core', () => {
    const dot = mount();
    const shadow = (dot as unknown as { _shadowDom: ShadowRoot })._shadowDom;
    expect(shadow.querySelector('.ran-state-dot')).not.toBeNull();
  });

  it('reflects the state it was given', () => {
    const dot = mount();
    dot.state = 'error';
    expect(dot.getAttribute('state')).toBe('error');
    expect(dot.state).toBe('error');
  });

  it('renders a state it does not know as idle rather than breaking', () => {
    const dot = mount();
    dot.setAttribute('state', 'exploded');
    expect(dot.state).toBe('idle');
  });

  it('is decoration until it is named', () => {
    // A dot beside a row that already states the outcome is noise in a screen reader.
    // Naming it is the caller saying it is the only statement of the state.
    const dot = mount();
    expect(dot.getAttribute('aria-hidden')).toBe('true');
    expect(dot.getAttribute('role')).toBeNull();

    dot.label = '运行中';
    expect(dot.getAttribute('aria-hidden')).toBeNull();
    expect(dot.getAttribute('role')).toBe('img');
    expect(dot.getAttribute('aria-label')).toBe('运行中');

    dot.label = '';
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });
});
