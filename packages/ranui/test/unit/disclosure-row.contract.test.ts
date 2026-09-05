import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DISCLOSURE_BEFORE_TOGGLE, DISCLOSURE_TOGGLE, DisclosureRow } from '@/components/disclosure-row';
import '@/components/disclosure-row';

/**
 * Mounts a row.
 *
 * @returns The element and the parts a caller can observe.
 */
function mount(): {
  row: DisclosureRow;
  button: HTMLElement;
  title: HTMLElement;
  summary: HTMLElement;
  sep: HTMLElement;
} {
  const row = document.createElement('r-disclosure-row') as DisclosureRow;
  document.body.appendChild(row);
  const shadow = (row as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return {
    row,
    button: shadow.querySelector<HTMLElement>('.ran-disclosure-row')!,
    title: shadow.querySelector<HTMLElement>('.ran-disclosure-title')!,
    summary: shadow.querySelector<HTMLElement>('.ran-disclosure-summary')!,
    sep: shadow.querySelector<HTMLElement>('.ran-disclosure-sep')!,
  };
}

describe('r-disclosure-row contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('puts the title and summary on one line', () => {
    const { row, title, summary } = mount();
    row.heading = 'fetch_url';
    row.summary = 'https://example.com';
    expect(title.textContent).toBe('fetch_url');
    expect(summary.textContent).toBe('https://example.com');
  });

  it('drops the separator when there is nothing to punctuate', () => {
    // A row ending in a stray dot reads as truncated.
    const { row, sep } = mount();
    row.heading = 'ping';
    expect(sep.hidden).toBe(true);
    row.summary = 'once';
    expect(sep.hidden).toBe(false);
    row.summary = '';
    expect(sep.hidden).toBe(true);
  });

  it('is only a control when there is something to open', () => {
    // A row with no body is a line of text. Shipping it as a disabled button put a tab
    // stop on something that does nothing when pressed.
    const { row, button } = mount();
    expect(button.getAttribute('role')).toBeNull();
    expect(button.getAttribute('tabindex')).toBeNull();
    expect(button.getAttribute('aria-expanded')).toBeNull();

    row.expandable = true;
    expect(button.getAttribute('role')).toBe('button');
    expect(button.tabIndex).toBe(0);
  });

  it('ties the control to the body it controls', () => {
    const { row, button } = mount();
    row.expandable = true;
    const body = (row as unknown as { _body: HTMLElement })._body;
    expect(body.id).not.toBe('');
    expect(button.getAttribute('aria-controls')).toBe(body.id);
  });

  it('opens from the keyboard, since a div gets no activation for free', () => {
    const { row, button } = mount();
    row.expandable = true;
    for (const key of ['Enter', ' ']) {
      const before = row.open;
      button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      expect(row.open).toBe(!before);
    }
  });

  it('opens on activation and announces it', () => {
    const { row, button } = mount();
    const listener = vi.fn();
    row.addEventListener(DISCLOSURE_TOGGLE, listener);
    row.expandable = true;

    button.click();
    expect(row.open).toBe(true);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });

    button.click();
    expect(row.open).toBe(false);
  });

  it('does not open, or announce, when there is nothing inside', () => {
    // A control that reveals a blank is worse than no control: it invites a press.
    const { row, button } = mount();
    const listener = vi.fn();
    row.addEventListener(DISCLOSURE_TOGGLE, listener);
    button.click();
    expect(row.open).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it('says whether it is expanded', () => {
    const { row, button } = mount();
    row.expandable = true;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    row.open = true;
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('states that it is busy, not only draws it', () => {
    // The sweep is the only signal the work is still running, and it is a visual one.
    const { row, button } = mount();
    expect(button.getAttribute('aria-busy')).toBeNull();
    row.busy = true;
    expect(button.getAttribute('aria-busy')).toBe('true');
    row.busy = false;
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it('lets a listener refuse the toggle before it happens', () => {
    const { row, button } = mount();
    row.expandable = true;
    const after = vi.fn();
    row.addEventListener(DISCLOSURE_BEFORE_TOGGLE, (event) => event.preventDefault());
    row.addEventListener(DISCLOSURE_TOGGLE, after);

    button.click();
    expect(row.open).toBe(false);
    expect(after).not.toHaveBeenCalled();
  });

  it('announces the state it is about to move to', () => {
    const { row, button } = mount();
    row.expandable = true;
    const before = vi.fn();
    row.addEventListener(DISCLOSURE_BEFORE_TOGGLE, before);
    button.click();
    expect((before.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });
  });

  it('opens one row at a time within a name group', () => {
    // Same contract as `<details name>`: document-wide, and members need not be siblings.
    const a = document.createElement('r-disclosure-row') as DisclosureRow;
    const b = document.createElement('r-disclosure-row') as DisclosureRow;
    for (const el of [a, b]) {
      el.expandable = true;
      el.name = 'group';
      document.body.appendChild(el);
    }

    a.open = true;
    expect([a.open, b.open]).toEqual([true, false]);
    b.open = true;
    expect([a.open, b.open]).toEqual([false, true]);
  });

  it('leaves ungrouped rows alone', () => {
    const a = document.createElement('r-disclosure-row') as DisclosureRow;
    const b = document.createElement('r-disclosure-row') as DisclosureRow;
    for (const el of [a, b]) {
      el.expandable = true;
      document.body.appendChild(el);
    }
    a.open = true;
    b.open = true;
    expect([a.open, b.open]).toEqual([true, true]);
  });

  it('names its event apart from the platform one', () => {
    // `toggle` is what <details> fires, and its ToggleEvent carries oldState/newState
    // rather than a detail — a listener typed against the platform name finds nothing.
    expect(DISCLOSURE_TOGGLE).not.toBe('toggle');
  });

  it('lets slotted markup replace the heading and summary text', () => {
    // The attribute text is the slot's fallback, so a slot renders it exactly when nothing
    // was assigned — no precedence rule in JavaScript to get wrong.
    const row = document.createElement('r-disclosure-row') as DisclosureRow;
    row.heading = 'plain';
    const code = document.createElement('code');
    code.slot = 'heading';
    code.textContent = 'fetch()';
    row.appendChild(code);
    document.body.appendChild(row);

    const shadow = (row as unknown as { _shadowDom: ShadowRoot })._shadowDom;
    const slot = shadow.querySelector<HTMLSlotElement>('slot[name="heading"]')!;
    expect(slot.assignedNodes()).toEqual([code]);
    // The fallback still carries the attribute, and stops being rendered while the slot
    // has content of its own.
    expect(shadow.querySelector('.ran-disclosure-title-text')!.textContent).toBe('plain');
  });

  it('counts slotted content when deciding whether to draw the separator', () => {
    const row = document.createElement('r-disclosure-row') as DisclosureRow;
    document.body.appendChild(row);
    const shadow = (row as unknown as { _shadowDom: ShadowRoot })._shadowDom;
    const sep = shadow.querySelector<HTMLElement>('.ran-disclosure-sep')!;

    const heading = document.createElement('code');
    heading.slot = 'heading';
    heading.textContent = 'only';
    row.appendChild(heading);
    // One half of the line is not two things to punctuate, however it was supplied.
    expect(sep.hidden).toBe(true);

    row.summary = 'and a summary';
    expect(sep.hidden).toBe(false);
  });

  it('carries an error tone the summary can be coloured by', () => {
    const { row } = mount();
    row.tone = 'error';
    expect(row.getAttribute('tone')).toBe('error');
  });
});
