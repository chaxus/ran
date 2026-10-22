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

  it('starts fresh keyboard typeahead after reconnect', async () => {
    const select = await createSelect();
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(select.value).toBe('2');
    select.remove();
    document.body.append(select);
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }));
    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(select.value).toBe('3');
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

  it.each(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'g'])(
    'reopens with %s immediately after selection while the previous panel is exiting',
    async (key) => {
      const select = await createSelect();
      vi.useFakeTimers();
      select.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      const changes = vi.fn();
      select.addEventListener('change', changes);
      const panel = select._selectionDropdown as HTMLElement & { getAnimationTarget(): Element };
      let finishExit!: () => void;
      const finished = new Promise<void>((resolve) => (finishExit = resolve));
      // Keep the actual floating exit pending, as it is with normal browser motion.
      Object.defineProperty(panel.getAnimationTarget(), 'getAnimations', {
        configurable: true,
        value: () => [{ finished }],
      });
      select.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      vi.advanceTimersToNextFrame();
      expect(select.open).toBe(false);
      expect(panel.style.display).toBe('block');
      expect(changes).toHaveBeenCalledOnce();

      select.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      expect(select.open).toBe(true);
      expect(select.getAttribute('aria-expanded')).toBe('true');
      expect(select.value).toBe('1');
      expect(changes).toHaveBeenCalledOnce();
      finishExit();
      await Promise.resolve();
      await Promise.resolve();
      vi.advanceTimersToNextFrame();
      expect(select.open).toBe(true);
      expect(panel.style.display).toBe('block');
      select.remove();
    },
  );
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
  it.each(['value', 'defaultValue'])(
    'keeps %s selection stable during matching search and clear until explicit replacement',
    async (attribute) => {
      const select = await createSelect();
      select.setAttribute('showSearch', '');
      select.setAttribute(attribute, '1');
      select.open = true;
      select._search.focus();
      const changes = vi.fn();
      select.addEventListener('change', changes);
      select._search.value = 'a';
      select._search.dispatchEvent(new Event('input', { bubbles: true }));
      expect(select.open).toBe(true);
      expect(select._search.value).toBe('a');
      expect(select._shadowDom.activeElement).toBe(select._search);
      expect(select.value).toBe('1');
      select._search.value = '';
      select._search.dispatchEvent(new Event('input', { bubbles: true }));
      expect(select.open).toBe(true);
      expect(select.value).toBe('1');
      expect(changes).not.toHaveBeenCalled();
      select.selectOptionElement(select.getDropdownOptions()[1]);
      expect(select.value).toBe('2');
      expect(select.open).toBe(false);
      select.open = true;
      select._search.value = 'b';
      select._search.dispatchEvent(new Event('input', { bubbles: true }));
      expect(select.open).toBe(true);
      expect(select.value).toBe('2');
      expect(select._text.textContent).toBe('Beta');
      expect(changes).toHaveBeenCalledOnce();
    },
  );
});
