import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/select';
import { mountElement } from './helpers/component';
import type { Select } from '@/components/select';

const createSelect = async () => {
  const select = await mountElement<Select>('r-select');
  ['Alpha', 'Beta', 'Gamma'].forEach((label, index) => {
    const option = document.createElement('r-option');
    option.setAttribute('value', `${index + 1}`);
    option.textContent = label;
    select.appendChild(option);
  });
  select.addOptionToSlot();
  return select;
};

describe('r-select accessibility keyboard contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('opens, tracks active descendant, selects, and closes from keyboard events', async () => {
    const select = await createSelect();
    vi.useFakeTimers();
    const changes: Array<{ value: string; label: string }> = [];
    select.addEventListener('change', (event: Event) => {
      changes.push((event as CustomEvent).detail);
    });

    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(select.getAttribute('aria-expanded')).toBe('true');
    expect(select.getAttribute('aria-activedescendant')).toBeTruthy();
    expect(select.getDropdownOptions()[1].getAttribute('aria-selected')).toBe('true');

    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    vi.advanceTimersByTime(320);

    expect(select.value).toBe('2');
    expect(select.getAttribute('aria-expanded')).toBe('false');
    expect(changes).toEqual([{ value: '2', label: 'Beta' }]);
  });
});
