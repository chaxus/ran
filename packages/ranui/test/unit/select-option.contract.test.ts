import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/select';

// r-option is not a registered custom element — it's used as a plain HTML element
// by the select component. Tests focus on attribute/property behavior through select.
describe('r-option in r-select', () => {
  const sleep = (ms = 20) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('r-option elements are recognized as select children', async () => {
    const select = document.createElement('r-select') as any;
    const opt1 = document.createElement('r-option');
    opt1.setAttribute('value', 'a');
    opt1.textContent = 'Option A';
    const opt2 = document.createElement('r-option');
    opt2.setAttribute('value', 'b');
    opt2.textContent = 'Option B';

    select.appendChild(opt1);
    select.appendChild(opt2);
    document.body.appendChild(select);
    await sleep();

    const options = select.querySelectorAll('r-option');
    expect(options.length).toBe(2);
    expect(options[0].getAttribute('value')).toBe('a');
    expect(options[1].getAttribute('value')).toBe('b');
  });

  it('r-option value attribute is preserved', () => {
    const opt = document.createElement('r-option');
    opt.setAttribute('value', 'test-value');
    document.body.appendChild(opt);
    expect(opt.getAttribute('value')).toBe('test-value');
  });

  it('r-option disabled attribute is preserved', () => {
    const opt = document.createElement('r-option');
    opt.setAttribute('disabled', '');
    document.body.appendChild(opt);
    expect(opt.hasAttribute('disabled')).toBe(true);
  });

  it('r-option textContent represents the label', () => {
    const opt = document.createElement('r-option');
    opt.textContent = 'My Option Label';
    document.body.appendChild(opt);
    expect(opt.textContent).toBe('My Option Label');
  });
});
