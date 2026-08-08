import { describe, expect, it } from 'vitest';
import { serializeForm } from '@/utils/form';

describe('serializeForm', () => {
  it('collects named fields into a plain object', () => {
    document.body.innerHTML = `
      <form id="f">
        <input name="username" value="alice" />
        <input name="email" value="alice@example.com" />
      </form>
    `;
    const form = document.getElementById('f') as HTMLFormElement;
    expect(serializeForm(form)).toEqual({ username: 'alice', email: 'alice@example.com' });
  });

  it('returns an array for a repeated field name', () => {
    document.body.innerHTML = `
      <form id="f">
        <input name="tag" value="a" />
        <input name="tag" value="b" />
      </form>
    `;
    const form = document.getElementById('f') as HTMLFormElement;
    expect(serializeForm(form)).toEqual({ tag: ['a', 'b'] });
  });

  it('returns an empty object for a form with no named fields', () => {
    document.body.innerHTML = `<form id="f"><button type="submit">Go</button></form>`;
    const form = document.getElementById('f') as HTMLFormElement;
    expect(serializeForm(form)).toEqual({});
  });
});
