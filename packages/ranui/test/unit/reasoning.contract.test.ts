import { beforeEach, describe, expect, it } from 'vitest';
import { Reasoning } from '@/components/reasoning';
import '@/components/reasoning';
import type { DisclosureRow } from '@/components/disclosure-row';

/**
 * Mounts a reasoning block.
 *
 * @returns The element, its shadow root, and the disclosure row it is headed with.
 */
function mount(): { block: Reasoning; shadow: ShadowRoot; row: DisclosureRow } {
  const block = document.createElement('r-reasoning') as Reasoning;
  document.body.appendChild(block);
  const shadow = (block as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { block, shadow, row: shadow.querySelector('r-disclosure-row') as DisclosureRow };
}

/**
 * Announces a reader-driven toggle the way the row does.
 *
 * The row's own control lives behind a closed shadow root, and the announcement is exactly
 * the seam that exists because of it.
 *
 * @param row The row heading the block.
 * @param open Whether the reader opened or closed it.
 */
function toggle(row: DisclosureRow, open: boolean): void {
  row.dispatchEvent(new CustomEvent('disclosuretoggle', { detail: { open }, bubbles: true, composed: true }));
}

describe('r-reasoning contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── The row ─────────────────────────────────────────────────────────────

  it('is headed with the same disclosure row a tool call uses', () => {
    // One disclosure language per transcript: a reader should not have to learn two ways of
    // opening a thing depending on which kind of thing it is.
    const { shadow, row } = mount();
    expect(row).not.toBeNull();
    expect(row.expandable).toBe(true);
    expect(shadow.querySelector('[part="body"]')).not.toBeNull();
  });

  it('shows the latest line while thinking and the first line once it stops', () => {
    // Watching a model think, the opening sentence stopped being news several paragraphs
    // ago; deciding whether to open it afterwards, the first line is where it starts.
    const { block, row } = mount();
    block.streaming = true;
    block.content = '先看小数部分\n0.9 比 0.11 大\n所以 9.9 更大';
    expect(row.summary).toBe('所以 9.9 更大');

    block.streaming = false;
    expect(row.summary).toBe('先看小数部分');
  });

  it('says nothing on the collapsed line before any reasoning has arrived', () => {
    const { block, row } = mount();
    block.streaming = true;
    expect(row.summary).toBe('');
    block.content = '\n  \n';
    expect(row.summary).toBe('');
  });

  it('sweeps while it is thinking, and stops when it stops', () => {
    const { block, row } = mount();
    block.streaming = true;
    expect(row.busy).toBe(true);
    block.streaming = false;
    expect(row.busy).toBe(false);
  });

  it('renders content as text, and grows on repeated assignment', () => {
    const { block, shadow } = mount();
    block.content = 'first';
    expect(shadow.querySelector('.ran-reasoning-text')?.textContent).toBe('first');
    block.content += ' second';
    expect(shadow.querySelector('.ran-reasoning-text')?.textContent).toBe('first second');
    expect(block.content).toBe('first second');
  });

  // ── Summary ─────────────────────────────────────────────────────────────

  it('defaults the label and reflects a set one', () => {
    const { block, row } = mount();
    expect(row.heading).toBe('Reasoning');
    block.label = '思考过程';
    expect(row.heading).toBe('思考过程');
  });

  it('shows a duration in seconds beside the label, and hides one below a second', () => {
    const { block, row } = mount();
    expect(row.heading).toBe('Reasoning');
    block.duration = 4200;
    expect(row.heading).toBe('Reasoning · 4.2s');
    // Sub-second thinking is noise: a reader cares that it was fast, not that it was 340ms.
    block.duration = 340;
    expect(row.heading).toBe('Reasoning');
  });

  it('ignores a duration that is not a usable number', () => {
    const { block } = mount();
    block.setAttribute('duration', 'soon');
    expect(block.duration).toBeNull();
    block.setAttribute('duration', '-5');
    expect(block.duration).toBeNull();
  });

  it('passes the open state down to the row it is headed with', () => {
    const { block, row } = mount();
    block.open = true;
    expect(row.open).toBe(true);
    block.open = false;
    expect(row.open).toBe(false);
  });

  // ── Following the stream ────────────────────────────────────────────────

  it('expands while reasoning arrives and collapses when it stops', () => {
    const { block } = mount();
    expect(block.open).toBe(false);
    block.streaming = true;
    expect(block.open).toBe(true);
    block.streaming = false;
    expect(block.open).toBe(false);
  });

  it('stops following once the reader collapses it mid-stream', () => {
    const { block, row } = mount();
    block.streaming = true;
    expect(block.open).toBe(true);

    toggle(row, false);
    expect(block.open).toBe(false);

    // The stream ending must not re-decide something the reader already decided.
    block.streaming = false;
    expect(block.open).toBe(false);
    block.streaming = true;
    expect(block.open).toBe(false);
  });

  it('stops following once the reader expands it after the stream ended', () => {
    const { block, row } = mount();
    block.streaming = true;
    block.streaming = false;
    expect(block.open).toBe(false);

    toggle(row, true);
    expect(block.open).toBe(true);

    block.streaming = true;
    block.streaming = false;
    expect(block.open).toBe(true);
  });

  it('treats a scripted open as the caller stating an intent', () => {
    const { block } = mount();
    block.open = true;
    block.streaming = true;
    block.streaming = false;
    expect(block.open).toBe(true);
  });

  it('treats an open attribute set directly as the same intent', () => {
    const { block } = mount();
    block.setAttribute('open', '');
    block.streaming = true;
    block.streaming = false;
    expect(block.open).toBe(true);
  });

  it('does not take ownership from its own writes while following', () => {
    const { block } = mount();
    // Three full cycles: if the element's own `open` writes counted as intent, the first
    // one would freeze it.
    for (let i = 0; i < 3; i += 1) {
      block.streaming = true;
      expect(block.open).toBe(true);
      block.streaming = false;
      expect(block.open).toBe(false);
    }
  });

  // ── Lifecycle ───────────────────────────────────────────────────────────

  it('syncs an external stylesheet through the sheet attribute', () => {
    const { block } = mount();
    block.sheet = '.ran-reasoning { outline: 1px solid; }';
    expect(block.getAttribute('sheet')).toBe('.ran-reasoning { outline: 1px solid; }');
  });
});
