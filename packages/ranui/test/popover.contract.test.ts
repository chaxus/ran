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
    const popover = document.createElement('r-popover') as unknown as Popover;
    popover.innerHTML = `
      <div id="trigger">Hover me</div>
      <r-content>Popover content</r-content>
    `;
    document.body.appendChild(popover);
    await sleep(100);

    // @ts-ignore - access private field for testing
    const popoverBlock = popover.popoverBlock as HTMLElement;
    // The classes used are from placementDirection map in index.ts
    // For default placement 'bottom', it uses 'ran-dropdown-down-in'

    // Initial state: not visible
    expect(popoverBlock.classList.contains('ran-dropdown-down-in')).toBe(false);

    // Simulate mouseenter
    popover.dispatchEvent(new MouseEvent('mouseenter'));
    await sleep(100);
    expect(popoverBlock.classList.contains('ran-dropdown-down-in')).toBe(true);

    // Simulate mouseleave
    popover.dispatchEvent(new MouseEvent('mouseleave'));
    await sleep(500); // Wait for animation (300ms)
    expect(popoverBlock.classList.contains('ran-dropdown-down-in')).toBe(false);
  });
});
