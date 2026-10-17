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

    // Nothing active yet: the first ArrowDown lands on the first option, not the second.
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(select.getAttribute('aria-expanded')).toBe('true');
    expect(select.getAttribute('aria-activedescendant')).toBeTruthy();
    expect(select.getDropdownOptions()[0].getAttribute('aria-selected')).toBe('true');

    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    vi.advanceTimersByTime(320);

    expect(select.value).toBe('1');
    expect(select.getAttribute('aria-expanded')).toBe('false');
    expect(changes).toEqual([{ value: '1', label: 'Alpha' }]);
  });
  it('leaves native search editing keys alone and filters native input and change', async () => {
    const select = await createSelect();
    select.setAttribute('showSearch', '');
    for (const key of ['b', ' ', 'Home', 'End', 'Backspace']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
      select._search.dispatchEvent(event);
      expect(event.defaultPrevented, key).toBe(false);
    }
    select._search.value = 'BE';
    select._search.dispatchEvent(new Event('input', { bubbles: true }));
    expect(select.getDropdownOptions().map((option) => option.textContent)).toEqual(['Beta']);
    select._search.value = '';
    select._search.dispatchEvent(new Event('change'));
    expect(select.getDropdownOptions()).toHaveLength(3);
  });

  it('ignores composing Enter and filters the final composition commit', async () => {
    const select = await createSelect();
    select.showSearch = 'true';
    select.open = true;
    select.setActiveOptionByIndex(0);
    const changes = vi.fn();
    select.addEventListener('change', changes);
    select._search.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    select._search.value = 'Beta';
    select._search.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
    select._search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    expect(select.open).toBe(true);
    expect(changes).not.toHaveBeenCalled();
    select._search.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
    expect(select.getDropdownOptions().map((option) => option.textContent)).toEqual(['Beta']);
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
    expect(changes).not.toHaveBeenCalled();
  });

  it('keeps host typeahead and nonbubbling selection changes', async () => {
    const select = await createSelect();
    const delegated = vi.fn();
    document.body.addEventListener('change', delegated, { once: true });
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(select.value).toBe('2');
    expect(delegated).not.toHaveBeenCalled();
    document.body.removeEventListener('change', delegated);
  });
});
