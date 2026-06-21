import { describe, expect, it, beforeEach } from 'vitest';
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
    expect((checkbox as any).checked).toBe('true');
    expect((checkbox as any).value).toBe('true');

    const wrapper = (checkbox as any)._shadowDom.querySelector('.ran-checkbox') as HTMLElement;
    expect(wrapper.classList.contains('ran-checkbox-checked')).toBe(true);

    checkbox.setAttribute('checked', 'false');
    expect((checkbox as any).checked).toBe('false');
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

  it('disabled setter reflects to attribute', () => {
    const checkbox = document.createElement('r-checkbox') as Checkbox;
    document.body.appendChild(checkbox);

    checkbox.disabled = 'true';
    expect(checkbox.getAttribute('disabled')).toBe('true');
  });

  it('attributeChangedCallback syncs value when checked attribute changes', () => {
    const checkbox = document.createElement('r-checkbox') as any;
    document.body.appendChild(checkbox);

    checkbox.attributeChangedCallback('checked', 'false', 'true');
    expect(checkbox.context.checked).toBe(true);

    checkbox.attributeChangedCallback('checked', 'true', 'false');
    expect(checkbox.context.checked).toBe(false);
  });
});
