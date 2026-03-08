import { describe, expect, it, beforeEach } from 'vitest';
import type { Popover } from '../components/popover/index';
// Ensure custom elements are defined
import '../components/popover/index';
import '../components/popover/content/index';

describe('r-popover contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects placement, arrow, and trigger properties to attributes', () => {
    const popover = document.createElement('r-popover') as unknown as Popover;
    document.body.appendChild(popover);

    popover.placement = 'top';
    expect(popover.getAttribute('placement')).toBe('top');

    popover.arrow = 'false';
    expect(popover.getAttribute('arrow')).toBe('false');

    popover.trigger = 'hover';
    expect(popover.getAttribute('trigger')).toBe('hover');
  });

  it('toggles visibility on hover trigger', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.trigger = 'hover';
    popover.innerHTML = `
      <div id="trigger">Hover me</div>
      <r-content>Popover content</r-content>
    `;
    document.body.appendChild(popover);
    await sleep(100);

    const popoverContent = popover.popoverContent as HTMLElement;
    expect(popoverContent).not.toBeUndefined();

    // Initial state: hidden
    expect(popoverContent.style.display).toBe('none');

    // Simulate mouseenter
    popover.dispatchEvent(new MouseEvent('mouseenter'));
    await sleep(100);
    expect(popoverContent.style.display).toBe('block');
    expect(popoverContent.getAttribute('transit')).toBe('ran-dropdown-up-in');

    // Simulate mouseleave
    popover.dispatchEvent(new MouseEvent('mouseleave'));
    await sleep(800); // 16 + 300 + 16 + 300 = 632ms
    expect(popoverContent.style.display).toBe('none');
  });
});
