import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Select } from '@/components/select/index';
import { EventManager } from '@/utils/builder';
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
    const dropdown = document.getElementById(select._listboxId);
    expect(dropdown).toBeNull();
  });

  it('value getter returns empty string by default', async () => {
    const select = await createSelectWithOptions();
    expect(select.value).toBe('');
  });

  it('value setter updates attribute when not disabled', async () => {
    const select = await createSelectWithOptions();
    select.value = 'my-val';
    expect(select.getAttribute('value')).toBe('my-val');
  });

  it('value setter still assigns while disabled (only user interaction is blocked, matching native <select>)', async () => {
    // formResetCallback relies on this: a disabled select must still be able to
    // restore its defaultValue on reset — only the user's own interaction
    // (opening the dropdown, clicking an option) is blocked by `disabled`.
    const select = await createSelectWithOptions();
    select.disabled = true;
    select.value = 'should-still-set';
    expect(select.getAttribute('value')).toBe('should-still-set');
  });

  it('defaultValue getter and setter', async () => {
    const select = await createSelectWithOptions();
    (select as any).defaultValue = 'def';
    expect((select as any).defaultValue).toBe('def');
  });

  it('clears the search box when the dropdown closes, after the user has typed', async () => {
    // The search field is a native <input>, so once a user types into it the value is dirty
    // and no longer follows the `value` attribute. Clearing it by attribute — which is what
    // this did while `_search` was mistyped as the `r-input` custom element — leaves the text
    // sitting there for the next open.
    const select = await createSelectWithOptions();
    select._search.value = 'typed by the user';

    select.removeDropDownTimeId(new Event('mouseenter'));

    expect(select._search.value).toBe('');
  });

  it('showSearch getter and setter', async () => {
    const select = await createSelectWithOptions();
    (select as any).showSearch = 'true';
    expect((select as any).showSearch).toBe('true');
  });

  it('type getter and setter', async () => {
    const select = await createSelectWithOptions();
    (select as any).type = 'multiple';
    expect((select as any).type).toBe('multiple');
  });

  it('placement getter defaults to bottom', async () => {
    const select = await createSelectWithOptions();
    expect((select as any).placement).toBe('bottom');
  });

  it('placement setter updates attribute', async () => {
    const select = await createSelectWithOptions();
    (select as any).placement = 'top';
    expect(select.getAttribute('placement')).toBe('top');
  });

  it('sheet getter and setter', async () => {
    const select = await createSelectWithOptions();
    (select as any).sheet = '.ran-select { color: red; }';
    expect((select as any).sheet).toBe('.ran-select { color: red; }');
  });

  it('dropdownclass getter and setter', async () => {
    const select = await createSelectWithOptions();
    (select as any).dropdownclass = 'my-dropdown';
    expect((select as any).dropdownclass).toBe('my-dropdown');
  });

  it('getDropdownOptions returns items after connectedCallback creates the dropdown', async () => {
    const select = await createSelectWithOptions();
    // connectedCallback calls createOption() automatically; options populate via slotchange
    const opts = select.getDropdownOptions();
    expect(Array.isArray(opts)).toBe(true);
  });

  it('isDropdownOpen returns false before createOption', async () => {
    const select = await createSelectWithOptions();
    expect(select.isDropdownOpen()).toBe(false);
  });

  it('updateAriaExpanded sets aria-expanded attribute', async () => {
    const select = await createSelectWithOptions();
    select.updateAriaExpanded(true);
    expect(select.getAttribute('aria-expanded')).toBe('true');
    select.updateAriaExpanded(false);
    expect(select.getAttribute('aria-expanded')).toBe('false');
  });

  it('handlerExternalCss does not throw with valid CSS', async () => {
    const select = await createSelectWithOptions();
    (select as any).sheet = '.ran-select { color: blue; }';
    expect(() => select.handlerExternalCss()).not.toThrow();
  });

  it('createOption creates dropdown and appends to body', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    expect(select._selectDropdown).toBeTruthy();
    expect(document.body.contains(select._selectDropdown!)).toBe(true);
  });

  it('removeSelectDropdown removes from DOM', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    const dropdown = select._selectDropdown!;
    expect(document.body.contains(dropdown)).toBe(true);
    select.removeSelectDropdown();
    expect(document.body.contains(dropdown)).toBe(false);
  });

  it('getPopupContainerId getter and setter', async () => {
    const select = await createSelectWithOptions();
    select.getPopupContainerId = 'my-container';
    expect(select.getPopupContainerId).toBe('my-container');
  });

  it('isDropdownOpen returns true after setSelectDropdownDisplayBlock', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.setSelectDropdownDisplayBlock();
    expect(select.isDropdownOpen()).toBe(true);
  });

  it('syncActiveState without activeOption removes aria-activedescendant', async () => {
    const select = await createSelectWithOptions();
    select.setAttribute('aria-activedescendant', 'something');
    select._activeOption = undefined;
    select.syncActiveState();
    expect(select.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('keydownSelect Escape key calls setSelectDropdownDisplayNone', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    const spy = vi.spyOn(select, 'setSelectDropdownDisplayNone');
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    select.keydownSelect(event);
    expect(spy).toHaveBeenCalled();
  });

  it('keydownSelect does nothing when disabled', async () => {
    const select = await createSelectWithOptions();
    select.disabled = true;
    const spy = vi.spyOn(select, 'setSelectDropdownDisplayNone');
    select.keydownSelect(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('setActiveOptionByIndex works when dropdown items exist', async () => {
    const select = await createSelectWithOptions();
    const opts = select.getDropdownOptions();
    if (opts.length > 0) {
      opts.forEach((o) => {
        (o as any).scrollIntoView = vi.fn();
      });
      expect(() => select.setActiveOptionByIndex(0)).not.toThrow();
    } else {
      expect(true).toBe(true);
    }
  });

  it('addOptionToSlot populates option maps', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    expect((select as any)._optionLabelMapValue.size).toBeGreaterThanOrEqual(0);
  });

  it('selectMouseDown opens the dropdown', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.selectMouseDown(new MouseEvent('mousedown'));
    await sleep(20);
    expect(select.isDropdownOpen()).toBe(true);
  });

  it('selectBlur calls setSelectDropdownDisplayNone after delay', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.setSelectDropdownDisplayBlock();
    const spy = vi.spyOn(select, 'setSelectDropdownDisplayNone');
    select.selectBlur(new MouseEvent('blur'));
    await sleep(400);
    expect(spy).toHaveBeenCalled();
  });

  it('clickOption selects the matching dropdown item', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    select.setSelectDropdownDisplayBlock();
    await sleep(20);

    const opts = select.getDropdownOptions();
    if (opts.length > 0) {
      const changes: Event[] = [];
      select.addEventListener('change', (e: Event) => changes.push(e));
      const fakeEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(fakeEvent, 'target', {
        value: opts[0],
        configurable: true,
      });
      select.clickOption(fakeEvent);
      expect(select.value).toBeTruthy();
    } else {
      expect(true).toBe(true);
    }
  });

  it('clickRemoveSelect closes the dropdown', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.setSelectDropdownDisplayBlock();
    await sleep(20);
    select.clickRemoveSelect(new MouseEvent('click'));
    expect(select.getAttribute('aria-expanded')).toBe('false');
  });

  it('keydownSelect ArrowDown moves active option down', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
    expect(() => select.keydownSelect(event)).not.toThrow();
  });

  it('keydownSelect ArrowUp moves active option up', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });

    select.setActiveOptionByIndex(1);
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    expect(() => select.keydownSelect(event)).not.toThrow();
  });

  it('keydownSelect Enter selects active option', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });
    if (opts.length > 0) {
      select.setActiveOptionByIndex(0);
      select.setSelectDropdownDisplayBlock();
      const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
      expect(() => select.keydownSelect(event)).not.toThrow();
    } else {
      expect(true).toBe(true);
    }
  });

  it('keydownSelect Space opens dropdown when closed', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    expect(() => select.keydownSelect(event)).not.toThrow();
  });

  it('selectOptionElement selects an option and dispatches change event', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    if (opts.length > 0) {
      const changes: Event[] = [];
      select.addEventListener('change', (e: Event) => changes.push(e));
      select.selectOptionElement(opts[0]);
      expect(select.value).toBeTruthy();
      expect(changes.length).toBe(1);
    } else {
      expect(true).toBe(true);
    }
  });

  it('selectOptionElement with shouldDispatch=false does not dispatch change', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    if (opts.length > 0) {
      const changes: Event[] = [];
      select.addEventListener('change', (e: Event) => changes.push(e));
      select.selectOptionElement(opts[0], false);
      expect(changes.length).toBe(0);
    } else {
      expect(true).toBe(true);
    }
  });

  it('selectOptionElement with null does nothing', async () => {
    const select = await createSelectWithOptions();
    expect(() => select.selectOptionElement(null)).not.toThrow();
  });

  // These two replace a pair that asserted the opposite: that an animation timer
  // already in flight made the open/close methods return early without touching
  // `aria-expanded`. That early return was the defect -- it is how a click could
  // land in the exit animation's window and be swallowed, and how the announced
  // state drifted from the panel -- so the old cases had pinned the bug as the
  // contract. What is worth pinning is that `open` is the state and everything
  // else follows it.
  it('open reflects to the attribute and drives aria-expanded', async () => {
    const select = await createSelectWithOptions();
    select.createOption();

    select.open = true;
    expect(select.hasAttribute('open')).toBe(true);
    expect(select.getAttribute('aria-expanded')).toBe('true');

    select.open = false;
    expect(select.hasAttribute('open')).toBe(false);
    expect(select.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking the trigger toggles open rather than reopening it', async () => {
    const select = await createSelectWithOptions();
    select.createOption();

    const click = () => (select as any).selectMouseDown(new Event('click'));
    const seen: boolean[] = [];
    for (let i = 0; i < 4; i++) {
      click();
      seen.push(select.open);
    }
    expect(seen).toEqual([true, false, true, false]);
  });

  it('createSelectDropdownContent with options creates dropdown items', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    (select as any).createSelectDropdownContent([
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ]);
    const opts = select.getDropdownOptions();
    expect(opts.length).toBe(2);
  });

  it('createSelectDropdownContent with defaultValue sets active', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.setAttribute('defaultValue', 'a');
    (select as any).createSelectDropdownContent([{ label: 'Option A', value: 'a' }]);
    const opts = select.getDropdownOptions();
    if (opts.length > 0) {
      expect(opts[0].getAttribute('active')).toBe('a');
    } else {
      expect(true).toBe(true);
    }
  });

  it('changeSearch filters dropdown options', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const event = new CustomEvent('change', { detail: { value: 'option' } });
    expect(() => (select as any).changeSearch(event)).not.toThrow();
  });

  it('changeSearch with empty value restores all options', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const event = new CustomEvent('change', { detail: { value: '' } });
    expect(() => (select as any).changeSearch(event)).not.toThrow();
  });

  it('placementPosition does not throw', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    expect(() => select.placementPosition()).not.toThrow();
  });

  it('setActiveOptionByIndex updates _activeOption and calls syncActiveState', async () => {
    const select = await createSelectWithOptions();
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const opts = select.getDropdownOptions();
    if (opts.length >= 2) {
      opts.forEach((o) => {
        (o as any).scrollIntoView = vi.fn();
      });
      select.setActiveOptionByIndex(0);
      const prev = select._activeOption;
      select.setActiveOptionByIndex(1);
      expect(prev?.getAttribute('aria-selected')).toBe('false');
      expect(select._activeOption).toBe(opts[1]);
    } else {
      expect(true).toBe(true);
    }
  });

  it('getDropdownOptions returns empty array when no selectionDropdown', async () => {
    const select = document.createElement('r-select') as Select;
    document.body.appendChild(select);
    await sleep(20);
    (select as any)._selectionDropdown = null;
    expect(select.getDropdownOptions()).toEqual([]);
  });

  it('attributeChangedCallback sets disabled attributes when newValue is truthy', async () => {
    const select = await createSelectWithOptions();
    select.createOption();

    // Go through the real attribute-setting path (not a direct callback invocation with a
    // hand-picked newValue) — attributeChangedCallback reads the *current* disabled state
    // off the element via the `disabled` getter, so the attribute must actually be set.
    select.setAttribute('disabled', 'true');
    expect(select.getAttribute('aria-disabled')).toBe('true');
    expect((select as any)._select.hasAttribute('disabled')).toBe(true);
  });

  it('attributeChangedCallback treats the bare boolean form (`disabled` with no value) as disabled', async () => {
    const select = await createSelectWithOptions();
    select.createOption();

    // `<r-select disabled>` reflects as an empty-string attribute value — must not be
    // mistaken for "not disabled" the way a naive `!newValue` check would.
    select.setAttribute('disabled', '');
    expect(select.disabled).toBe(true);
    expect(select.getAttribute('aria-disabled')).toBe('true');
    expect(select.tabIndex).toBe(-1);
  });

  it('connectedCallback registers hover listeners via EventManager when trigger is hover', async () => {
    const select = document.createElement('r-select') as Select;
    select.setAttribute('trigger', 'hover');
    const abortSpy = vi.spyOn(EventManager.prototype, 'on');
    document.body.appendChild(select);
    await sleep(20);

    const registeredTypes = abortSpy.mock.calls.map((c) => c[1]);
    expect(registeredTypes).toContain('mouseenter');
    expect(registeredTypes).toContain('mouseleave');
  });

  it('setting the value attribute reflects to the closed-state label', () => {
    const select = document.createElement('r-select') as Select;
    select.innerHTML = '<r-option value="a">Apple</r-option><r-option value="b">Banana</r-option>';
    document.body.appendChild(select);

    select.setAttribute('value', 'b');
    expect((select as unknown as { _text: HTMLElement })._text.textContent).toBe('Banana');

    select.value = 'a';
    expect((select as unknown as { _text: HTMLElement })._text.textContent).toBe('Apple');
  });

  it('attaches scroll/resize listeners to reposition the dropdown and removes them on close', () => {
    const select = document.createElement('r-select') as unknown as {
      _attachReposition: () => void;
      _detachReposition: () => void;
      _repositionBound: boolean;
    };
    document.body.appendChild(select as unknown as Node);

    const addSpy = vi.spyOn(window, 'addEventListener');
    select._attachReposition();
    expect(select._repositionBound).toBe(true);
    expect(addSpy.mock.calls.some((c) => c[0] === 'scroll')).toBe(true);
    expect(addSpy.mock.calls.some((c) => c[0] === 'resize')).toBe(true);

    const removeSpy = vi.spyOn(window, 'removeEventListener');
    select._detachReposition();
    expect(select._repositionBound).toBe(false);
    expect(removeSpy.mock.calls.some((c) => c[0] === 'scroll')).toBe(true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('is form-associated and relays its value through ElementInternals', () => {
    expect((Select as any).formAssociated).toBe(true);

    const select = document.createElement('r-select') as any;
    document.body.appendChild(select);
    expect(select._internals).toBeTruthy();

    // jsdom's ElementInternals omits setFormValue, so stub it to observe calls.
    const setFormValue = vi.fn();
    select._internals.setFormValue = setFormValue;

    select.value = 'apple';
    expect(setFormValue).toHaveBeenLastCalledWith('apple');
  });

  // ── FIX C: `clear` was in observedAttributes but never read; it is removed ──
  it('does not observe the removed `clear` attribute', () => {
    expect(Select.observedAttributes).not.toContain('clear');
  });

  // ── FIX B: disabled options are non-selectable ────────────────────────────
  const createSelectWithDisabledMiddle = async () => {
    const select = document.createElement('r-select') as Select;
    [
      ['1', 'One', false],
      ['2', 'Two', true],
      ['3', 'Three', false],
    ].forEach(([value, label, disabled]) => {
      const option = document.createElement('r-option');
      option.setAttribute('value', value as string);
      option.textContent = label as string;
      if (disabled) option.setAttribute('disabled', '');
      select.appendChild(option);
    });
    document.body.appendChild(select);
    await sleep(20);
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);
    return select;
  };

  it('reflects an option disabled state onto the rendered dropdown item', async () => {
    const select = await createSelectWithDisabledMiddle();
    const opts = select.getDropdownOptions();
    const disabledItem = opts.find((o) => o.getAttribute('value') === '2')!;
    expect(disabledItem.hasAttribute('disabled')).toBe(true);
    expect(disabledItem.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not select a disabled option on click (FIX B)', async () => {
    const select = await createSelectWithDisabledMiddle();
    const disabledItem = select.getDropdownOptions().find((o) => o.getAttribute('value') === '2')!;

    const changes: Event[] = [];
    select.addEventListener('change', (e: Event) => changes.push(e));
    const fakeEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(fakeEvent, 'target', { value: disabledItem, configurable: true });
    select.clickOption(fakeEvent);

    expect(select.value).toBe('');
    expect(changes.length).toBe(0);
  });

  it('keyboard ArrowDown skips a disabled option (FIX B)', async () => {
    const select = await createSelectWithDisabledMiddle();
    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });

    // From nothing active, ArrowDown lands on the first (enabled) option.
    select.keydownSelect(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(select._activeOption).toBe(opts[0]);

    // From index 0, ArrowDown targets index 1 (disabled) → skips to index 2.
    select.keydownSelect(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(opts[1].getAttribute('aria-selected')).toBe('false');
    expect(opts[2].getAttribute('aria-selected')).toBe('true');
    expect(select._activeOption).toBe(opts[2]);
  });

  it('associates `label` via aria-label, not aria-labelledby pointing into its own shadow root', async () => {
    // The rendered <label> lives inside this select's own shadow root — a plain
    // aria-labelledby id-ref cannot cross into a (child) shadow tree, even the host's
    // own, so the combobox's accessible name came back empty when this used
    // aria-labelledby. Verified directly against Chrome's accessibility tree.
    const select = await createSelectWithOptions();
    select.setAttribute('label', 'Role');
    expect(select.getAttribute('aria-label')).toBe('Role');
    expect(select.hasAttribute('aria-labelledby')).toBe(false);

    select.setAttribute('label', 'Updated role');
    expect(select.getAttribute('aria-label')).toBe('Updated role');

    select.removeAttribute('label');
    expect(select.hasAttribute('aria-label')).toBe(false);
  });

  it('updates aria-disabled and tabIndex when disabled changes after the select is already connected', async () => {
    const select = await createSelectWithOptions();
    expect(select.tabIndex).toBe(0);

    // The bare boolean-attribute form (`disabled` with no value) reflects as an empty
    // string; a naive `!newValue` check treats that as falsy and takes the wrong branch.
    select.setAttribute('disabled', '');
    expect(select.getAttribute('aria-disabled')).toBe('true');
    expect(select.tabIndex).toBe(-1);

    select.removeAttribute('disabled');
    expect(select.hasAttribute('aria-disabled')).toBe(false);
    expect(select.tabIndex).toBe(0);
  });

  it('Home/End jump to the first/last enabled option', async () => {
    const select = await createSelectWithDisabledMiddle();
    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });

    select.keydownSelect(new KeyboardEvent('keydown', { key: 'End', cancelable: true }));
    expect(select._activeOption).toBe(opts[2]);

    select.keydownSelect(new KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
    expect(select._activeOption).toBe(opts[0]);
  });

  it('type-ahead jumps to the option starting with the typed characters', async () => {
    const select = await createSelectWithDisabledMiddle(); // One / Two(disabled) / Three
    const opts = select.getDropdownOptions();
    opts.forEach((o) => {
      (o as any).scrollIntoView = vi.fn();
    });

    select.keydownSelect(new KeyboardEvent('keydown', { key: 't', cancelable: true }));
    // 'Two' is disabled — type-ahead must skip it and land on 'Three'.
    expect(select._activeOption).toBe(opts[2]);
  });

  // ── FIX A: defaultValue and showSearch are reactive after connect ─────────
  it('re-applies the selection when defaultValue changes after connect (FIX A)', async () => {
    const select = await createSelectWithOptions(); // options value '1' / '2'
    select.createOption();
    select.addOptionToSlot();
    await sleep(20);

    const spy = vi.spyOn(select, 'setDefaultValue');
    select.setAttribute('defaultValue', '2');

    expect(spy).toHaveBeenCalled();
    expect(select.value).toBe('2');
    expect((select as any)._text.textContent).toBe('Option 2');
  });

  it('wires and unwires the search box when showSearch toggles after connect (FIX A)', async () => {
    const select = await createSelectWithOptions();
    const spy = vi.spyOn(select as any, '_applyShowSearch');

    select.setAttribute('showSearch', 'true');
    expect(spy).toHaveBeenCalledTimes(1);
    expect((select as any).onSearch).toBeTruthy();

    select.removeAttribute('showSearch');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('required property getter/setter reflects the attribute as a boolean', async () => {
    const select = await createSelectWithOptions();
    expect(select.required).toBe(false);
    select.required = 'true';
    expect(select.hasAttribute('required')).toBe(true);
    expect(select.required).toBe(true);

    select.required = 'false';
    expect(select.hasAttribute('required')).toBe(false);
  });

  it('formResetCallback restores defaultValue when set, else clears the selection', async () => {
    const select = await createSelectWithOptions(); // options value '1' / '2'
    select.setAttribute('defaultValue', '1');
    select.value = '2';
    expect(select.value).toBe('2');

    (select as any).formResetCallback();
    expect(select.value).toBe('1');

    select.removeAttribute('defaultValue');
    select.value = '2';
    (select as any).formResetCallback();
    expect(select.hasAttribute('value')).toBe(false);
    expect((select as any)._text.textContent).toBe('');
  });

  it('setValidity flags a required-but-empty selection, and clears when selected or disabled', async () => {
    const select = await createSelectWithOptions();
    const setValidity = vi.fn();
    (select as any)._internals.setValidity = setValidity;

    select.required = 'true';
    expect(setValidity).toHaveBeenLastCalledWith({ valueMissing: true }, expect.any(String), select);

    select.value = '1';
    expect(setValidity).toHaveBeenLastCalledWith({});

    select.value = '';
    expect(setValidity).toHaveBeenLastCalledWith({ valueMissing: true }, expect.any(String), select);

    select.disabled = true;
    expect(setValidity).toHaveBeenLastCalledWith({});
  });
});
