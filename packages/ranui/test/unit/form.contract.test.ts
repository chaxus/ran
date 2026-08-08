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

    const inner = shadow.querySelector('.ran-form');
    expect(inner).not.toBeNull();
    expect(inner?.tagName.toLowerCase()).toBe('form');
    expect(inner?.getAttribute('part')).toBe('form');
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

  it('renders an unnamed default slot (no r-form_content indirection)', () => {
    const form = document.createElement('r-form');
    document.body.appendChild(form);

    const shadow = (form as any)._shadowDom as ShadowRoot;
    const slot = shadow.querySelector('slot');
    expect(slot).not.toBeNull();
    expect(slot?.getAttribute('name')).toBeNull();
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

  it('recomputes FormData fresh on every submit, not a stale snapshot from connect', () => {
    const form = document.createElement('r-form') as any;
    document.body.appendChild(form);

    const innerForm = form._form as HTMLFormElement;
    // Placed directly into the internal shadow <form> (bypassing slot
    // assignment, which jsdom cannot flatten) so plain FormData collection
    // sees it — same technique the previous test already relies on via `_form`.
    const input = document.createElement('input');
    input.name = 'username';
    innerForm.appendChild(input);

    // Changed *after* connect, before submit — must be read at submit time.
    input.value = 'alice';

    innerForm.dispatchEvent(new Event('submit'));
    expect(form.value).toBe(JSON.stringify({ username: 'alice' }));
  });

  it('reset event on inner form clears value', () => {
    const form = document.createElement('r-form') as any;
    document.body.appendChild(form);

    form.value = '{"name":"test"}';
    expect(form.getAttribute('value')).toBe('{"name":"test"}');

    const innerForm = form._form as HTMLFormElement;
    innerForm.dispatchEvent(new Event('reset'));
    expect(form.getAttribute('value')).toBeNull();
  });
});
