import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DISCLOSURE_TOGGLE, DisclosureRow } from '@/components/disclosure-row';
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
    row.title = 'fetch_url';
    row.summary = 'https://example.com';
    expect(title.textContent).toBe('fetch_url');
    expect(summary.textContent).toBe('https://example.com');
  });

  it('drops the separator when there is nothing to punctuate', () => {
    // A row ending in a stray dot reads as truncated.
    const { row, sep } = mount();
    row.title = 'ping';
    expect(sep.hidden).toBe(true);
    row.summary = 'once';
    expect(sep.hidden).toBe(false);
    row.summary = '';
    expect(sep.hidden).toBe(true);
  });

  it('uses a real button, so the row is keyboard reachable', () => {
    const { button } = mount();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
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

  it('says whether it is expanded, and says when it cannot be', () => {
    const { row, button } = mount();
    expect(button.getAttribute('aria-disabled')).toBe('true');
    row.expandable = true;
    expect(button.getAttribute('aria-disabled')).toBeNull();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    row.open = true;
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('names its event apart from the platform one', () => {
    // `toggle` is what <details> fires, and its ToggleEvent carries oldState/newState
    // rather than a detail — a listener typed against the platform name finds nothing.
    expect(DISCLOSURE_TOGGLE).not.toBe('toggle');
  });

  it('carries an error tone the summary can be coloured by', () => {
    const { row } = mount();
    row.tone = 'error';
    expect(row.getAttribute('tone')).toBe('error');
  });
});
