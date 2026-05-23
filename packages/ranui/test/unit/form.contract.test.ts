import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/form';

describe('r-form contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with r-form form element', () => {
    const form = document.createElement('r-form');
    document.body.appendChild(form);

    const shadow = (form as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const inner = shadow.querySelector('.r-form');
    expect(inner).not.toBeNull();
    expect(inner?.tagName.toLowerCase()).toBe('form');
  });

  it('reflects value property via getter/setter', () => {
    const form = document.createElement('r-form') as any;
    document.body.appendChild(form);

    form.value = '{"name":"test"}';
    expect(form.getAttribute('value')).toBe('{"name":"test"}');
    expect(form.value).toBe('{"name":"test"}');
  });

  it('value setter ignores null', () => {
    const form = document.createElement('r-form') as any;
    document.body.appendChild(form);

    form.value = null;
    expect(form.getAttribute('value')).toBeNull();
  });

  it('slot is named r-form_content', () => {
    const form = document.createElement('r-form');
    document.body.appendChild(form);

    const shadow = (form as any)._shadowDom as ShadowRoot;
    const slot = shadow.querySelector('slot[name="r-form_content"]');
    expect(slot).not.toBeNull();
  });

  it('submit event on inner form sets value as JSON', () => {
    const form = document.createElement('r-form') as any;
    document.body.appendChild(form);

    // Trigger submit on the inner form element to exercise the submit listener
    const innerForm = form._form as HTMLFormElement;
    innerForm.dispatchEvent(new Event('submit'));
    // value is set to JSON.stringify(jsonData) which is '{}' (no form data)
    expect(typeof form.value).toBe('string');
  });
});
