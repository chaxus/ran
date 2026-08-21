import { beforeEach, describe, expect, it } from 'vitest';
import { Reasoning } from '@/components/reasoning';
import '@/components/reasoning';

/**
 * Mounts a reasoning block.
 *
 * @returns The element, its shadow root, and the summary button.
 */
function mount(): { block: Reasoning; shadow: ShadowRoot; summary: HTMLElement } {
  const block = document.createElement('r-reasoning') as Reasoning;
  document.body.appendChild(block);
  const shadow = (block as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { block, shadow, summary: shadow.querySelector<HTMLElement>('.ran-reasoning-summary')! };
}

describe('r-reasoning contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Shadow DOM structure ────────────────────────────────────────────────

  it('renders a summary, marker, label, meta and body', () => {
    const { shadow } = mount();
    for (const selector of [
      '.ran-reasoning-summary',
      '.ran-reasoning-marker',
      '.ran-reasoning-label',
      '.ran-reasoning-meta',
      '.ran-reasoning-body',
    ]) {
      expect(shadow.querySelector(selector), selector).not.toBeNull();
    }
  });

  it('exports part attributes on the structural elements', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-reasoning')?.getAttribute('part')).toBe('reasoning');
    expect(shadow.querySelector('.ran-reasoning-summary')?.getAttribute('part')).toBe('summary');
    expect(shadow.querySelector('.ran-reasoning-body')?.getAttribute('part')).toBe('body');
    expect(shadow.querySelector('.ran-reasoning-text')?.getAttribute('part')).toBe('text');
  });

  it('uses a real button for the summary, so it is keyboard reachable', () => {
    const { summary } = mount();
    expect(summary.tagName).toBe('BUTTON');
    expect(summary.getAttribute('type')).toBe('button');
    expect(summary.getAttribute('aria-expanded')).toBe('false');
  });

  it('offers a slot so a caller can render the body itself', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-reasoning-body slot')).not.toBeNull();
  });

  // ── Content ─────────────────────────────────────────────────────────────

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
    const { block, shadow } = mount();
    expect(shadow.querySelector('.ran-reasoning-label')?.textContent).toBe('Reasoning');
    block.label = '思考过程';
    expect(shadow.querySelector('.ran-reasoning-label')?.textContent).toBe('思考过程');
  });

  it('shows a duration in seconds, and hides one below a second', () => {
    const { block, shadow } = mount();
    const meta = (): string | null | undefined => shadow.querySelector('.ran-reasoning-meta')?.textContent;
    expect(meta()).toBe('');
    block.duration = 4200;
    expect(meta()).toBe('4.2s');
    // Sub-second thinking is noise: a reader cares that it was fast, not that it was 340ms.
    block.duration = 340;
    expect(meta()).toBe('');
  });

  it('ignores a duration that is not a usable number', () => {
    const { block } = mount();
    block.setAttribute('duration', 'soon');
    expect(block.duration).toBeNull();
    block.setAttribute('duration', '-5');
    expect(block.duration).toBeNull();
  });

  it('tracks the marker and aria-expanded with the open state', () => {
    const { block, shadow, summary } = mount();
    block.open = true;
    expect(summary.getAttribute('aria-expanded')).toBe('true');
    expect(shadow.querySelector('.ran-reasoning-marker')?.textContent).toBe('▾');
    block.open = false;
    expect(summary.getAttribute('aria-expanded')).toBe('false');
    expect(shadow.querySelector('.ran-reasoning-marker')?.textContent).toBe('▸');
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
    const { block, summary } = mount();
    block.streaming = true;
    expect(block.open).toBe(true);

    summary.click();
    expect(block.open).toBe(false);

    // The stream ending must not re-decide something the reader already decided.
    block.streaming = false;
    expect(block.open).toBe(false);
    block.streaming = true;
    expect(block.open).toBe(false);
  });

  it('stops following once the reader expands it after the stream ended', () => {
    const { block, summary } = mount();
    block.streaming = true;
    block.streaming = false;
    expect(block.open).toBe(false);

    summary.click();
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
