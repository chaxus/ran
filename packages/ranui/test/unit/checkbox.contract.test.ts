import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Checkbox } from '@/components/checkbox';
import '@/components/checkbox';

describe('r-checkbox contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders checkbox wrapper and inner input correctly via ElementBuilder', () => {
    const checkbox = document.createElement('r-checkbox');
    document.body.appendChild(checkbox);

    const shadow = (checkbox as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const wrapper = shadow.querySelector('.ran-checkbox') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.getAttribute('part')).toBe('checkbox');

    const innerInput = shadow.querySelector('.ran-checkbox-input') as HTMLInputElement;
    expect(innerInput).toBeTruthy();
    expect(innerInput.getAttribute('part')).toBe('input');
    expect(innerInput.getAttribute('type')).toBe('checkbox');

    const innerSpan = shadow.querySelector('.ran-checkbox-inner') as HTMLSpanElement;
    expect(innerSpan).toBeTruthy();
    expect(innerSpan.getAttribute('part')).toBe('inner');
  });

  it('reflects checked property properly', () => {
    const checkbox = document.createElement('r-checkbox');
    document.body.appendChild(checkbox);

    checkbox.setAttribute('checked', 'true');
    expect((checkbox as any).checked).toBe(true);
    expect((checkbox as any).value).toBe('true');

    const wrapper = (checkbox as any)._shadowDom.querySelector('.ran-checkbox') as HTMLElement;
    expect(wrapper.classList.contains('ran-checkbox-checked')).toBe(true);

    checkbox.setAttribute('checked', 'false');
    expect((checkbox as any).checked).toBe(false);
    expect((checkbox as any).value).toBe('false');
    expect(wrapper.classList.contains('ran-checkbox-checked')).toBe(false);
  });

  it('toggles checked via click when not disabled', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    document.body.appendChild(checkbox);

    let lastChecked: boolean | undefined;
    checkbox.addEventListener('change', (e: Event) => {
      lastChecked = (e as CustomEvent).detail.checked;
    });

    // Initial state is unchecked
    checkbox.click();
    expect(lastChecked).toBe(true);
    expect((checkbox as any).context.checked).toBe(true);

    checkbox.click();
    expect(lastChecked).toBe(false);
  });

  it('does not toggle when disabled attribute is set', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    checkbox.setAttribute('disabled', '');
    document.body.appendChild(checkbox);

    let fired = false;
    checkbox.addEventListener('change', () => {
      fired = true;
    });

    checkbox.click();
    expect(fired).toBe(false);
  });

  it('value setter syncs checked state', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    document.body.appendChild(checkbox);

    (checkbox as any).value = 'true';
    expect((checkbox as any).context.checked).toBe(true);
    expect(checkbox.getAttribute('value')).toBe('true');

    (checkbox as any).value = 'false';
    expect((checkbox as any).context.checked).toBe(false);
  });

  it('sheet property reflects to attribute', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    document.body.appendChild(checkbox);

    checkbox.sheet = '.ran-checkbox { border: 1px solid red; }';
    expect(checkbox.getAttribute('sheet')).toBe('.ran-checkbox { border: 1px solid red; }');
  });

  it('disabled reflects to/from the attribute as a boolean', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    document.body.appendChild(checkbox);

    checkbox.disabled = true;
    expect(checkbox.hasAttribute('disabled')).toBe(true);
    expect(checkbox.disabled).toBe(true);

    checkbox.disabled = false;
    expect(checkbox.hasAttribute('disabled')).toBe(false);
    expect(checkbox.disabled).toBe(false);
  });

  it('attributeChangedCallback syncs value when checked attribute changes', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);

    checkbox.attributeChangedCallback('checked', 'false', 'true');
    expect(checkbox.context.checked).toBe(true);

    checkbox.attributeChangedCallback('checked', 'true', 'false');
    expect(checkbox.context.checked).toBe(false);
  });

  it('exposes the host as the accessible checkbox and hides the inner input', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);

    expect(checkbox.getAttribute('role')).toBe('checkbox');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect(checkbox.tabIndex).toBe(0);

    // The decorative inner <input> is out of the a11y tree and tab order so there
    // is only one checkbox node.
    const innerInput = checkbox._shadowDom.querySelector('.ran-checkbox-input') as HTMLInputElement;
    expect(innerInput.getAttribute('aria-hidden')).toBe('true');
    expect(innerInput.tabIndex).toBe(-1);
  });

  it('reflects checked state to aria-checked on toggle', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);

    checkbox.click();
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    checkbox.click();
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('toggles on Space and Enter keydown', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);

    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(checkbox.context.checked).toBe(true);
    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(checkbox.context.checked).toBe(false);
  });

  it('marks aria-disabled and drops out of the tab order when disabled', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    checkbox.setAttribute('disabled', '');
    document.body.appendChild(checkbox);

    expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    expect(checkbox.tabIndex).toBe(-1);

    // keyboard is a no-op when disabled
    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(checkbox.context.checked).toBe(false);
  });

  it('is form-associated and relays its value through ElementInternals', () => {
    expect((Checkbox as any).formAssociated).toBe(true);

    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);
    expect(checkbox._internals).toBeTruthy();

    // jsdom's ElementInternals omits setFormValue, so stub it to observe the calls
    // our code makes (real browsers implement it — see the optional-chained call).
    const setFormValue = vi.fn();
    checkbox._internals.setFormValue = setFormValue;

    checkbox.click(); // -> checked contributes its value
    expect(setFormValue).toHaveBeenLastCalledWith('true');
    checkbox.click(); // -> unchecked contributes nothing
    expect(setFormValue).toHaveBeenLastCalledWith(null);
  });
});
