import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/form';

describe('r-form contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a shadow DOM with a plain passthrough slot (no owned <form>)', () => {
    // A <form> inside shadow DOM can never become the form owner of
    // light-DOM children — even ones rendered through a <slot> — because form
    // ownership is resolved over the real (light) DOM ancestor chain, which
    // never crosses into shadow DOM. So <r-form> intentionally does not own
    // a <form>; the real <form> is authored by the consumer in light DOM.
    const form = document.createElement('r-form');
    document.body.appendChild(form);

    const shadow = (form as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('slot')).not.toBeNull();
    expect(shadow.querySelector('form')).toBeNull();
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

  it('submit on a light-DOM <form> child sets value as JSON and prevents navigation', () => {
    const form = document.createElement('r-form') as any;
    const innerForm = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'username';
    input.value = 'alice';
    innerForm.appendChild(input);
    form.appendChild(innerForm);
    document.body.appendChild(form);

    const event = new Event('submit', { bubbles: true, cancelable: true });
    innerForm.dispatchEvent(event);

    expect(form.value).toBe(JSON.stringify({ username: 'alice' }));
    expect(event.defaultPrevented).toBe(true);
  });

  it('recomputes FormData fresh on every submit, not a stale snapshot from connect', () => {
    const form = document.createElement('r-form') as any;
    const innerForm = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'username';
    innerForm.appendChild(input);
    form.appendChild(innerForm);
    document.body.appendChild(form);

    // Changed *after* connect, before submit — must be read at submit time.
    input.value = 'alice';
    innerForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(form.value).toBe(JSON.stringify({ username: 'alice' }));
  });

  it('reset on a light-DOM <form> child clears value', () => {
    const form = document.createElement('r-form') as any;
    const innerForm = document.createElement('form');
    form.appendChild(innerForm);
    document.body.appendChild(form);

    form.value = '{"name":"test"}';
    expect(form.getAttribute('value')).toBe('{"name":"test"}');

    innerForm.dispatchEvent(new Event('reset', { bubbles: true }));
    expect(form.getAttribute('value')).toBeNull();
  });
});
