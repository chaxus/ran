import { describe, expect, it, beforeEach } from 'vitest';
import { Select } from '@/components/select/index';
// Ensure custom elements are defined
import '@/components/select/index';

describe('r-select contract', () => {
  const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const createSelectWithOptions = async () => {
    const select = document.createElement('r-select') as Select;

    const opt1 = document.createElement('r-option');
    opt1.setAttribute('value', '1');
    opt1.textContent = 'Option 1';

    const opt2 = document.createElement('r-option');
    opt2.setAttribute('value', '2');
    opt2.textContent = 'Option 2';

    select.appendChild(opt1);
    select.appendChild(opt2);
    document.body.appendChild(select);
    await sleep(20);
    return select;
  };

  it('reflects disabled property to attributes and selection', async () => {
    const select = await createSelectWithOptions();
    // @ts-ignore - access private _shadowDom because mode is closed

    // Initial state
    expect(select.hasAttribute('disabled')).toBe(false);
    expect(select.tabIndex).toBe(0);

    // Set disabled
    select.disabled = true;
    await sleep();
    // @ts-ignore
    const selectionDisabled = select._shadowDom?.querySelector('.selection') as HTMLElement;
    expect(select.hasAttribute('disabled')).toBe(true);
    expect(select.getAttribute('aria-disabled')).toBe('true');
    expect(selectionDisabled?.hasAttribute('disabled')).toBe(true);
    expect(select.tabIndex).toBe(-1);

    // Remove disabled
    select.disabled = false;
    await sleep();
    // @ts-ignore
    const selectionEnabled = select._shadowDom?.querySelector('.selection') as HTMLElement;
    expect(select.hasAttribute('disabled')).toBe(false);
    expect(select.hasAttribute('aria-disabled')).toBe(false);
    expect(selectionEnabled?.hasAttribute('disabled')).toBe(false);
    expect(select.tabIndex).toBe(0);
  });

  it('sets dropdown trigger to click or hover', async () => {
    const select = await createSelectWithOptions();
    // Default is click
    expect(select.trigger).toBe('click');

    select.trigger = 'hover';
    expect(select.trigger).toBe('hover');
    expect(select.getAttribute('trigger')).toBe('hover');
  });

  it('initializes correct ARIA attributes', async () => {
    const select = await createSelectWithOptions();
    expect(select.getAttribute('role')).toBe('combobox');
    expect(select.getAttribute('aria-haspopup')).toBe('listbox');
    expect(select.getAttribute('aria-expanded')).toBe('false');
  });

  it('cleans up event listeners and dropdowns on disconnect', async () => {
    const select = await createSelectWithOptions();

    // Simulate opening the dropdown
    select.setSelectDropdownDisplayBlock();
    select.createOption();

    // Disconnect
    document.body.removeChild(select);

    // The selectDropdown container should be removed from body
    // getPopupContainerId defaults to body if not specified
    const dropdown = document.getElementById(select._listboxId);
    expect(dropdown).toBeNull();
  });
});
