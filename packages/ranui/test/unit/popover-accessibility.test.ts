import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/popover';
import { mountElement, sleep } from './helpers/component';
import type { Popover } from '@/components/popover';

const createPopover = async () => {
  const popover = await mountElement<Popover>('r-popover', { trigger: 'click' });
  const content = document.createElement('r-content');
  content.innerHTML = '<button>Action</button>';
  popover.appendChild(content);
  popover.createContent(content.children);
  return popover;
};

describe('r-popover accessibility contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes keyboard and expanded accessibility attributes', async () => {
    const popover = await createPopover();

    expect(popover.tabIndex).toBe(0);
    expect(popover.getAttribute('aria-haspopup')).toBe('dialog');
    expect(popover.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens with Enter or Space and closes with Escape', async () => {
    const popover = await createPopover();
    vi.useFakeTimers();

    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    vi.advanceTimersByTime(20);
    expect(popover.popoverContent?.style.display).toBe('block');
    expect(popover.getAttribute('aria-expanded')).toBe('true');

    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    vi.advanceTimersByTime(320);
    expect(popover.popoverContent?.style.display).toBe('none');
    expect(popover.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes the same listeners that connectedCallback registered', async () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const removeSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const popover = await createPopover();
    await sleep();

    document.body.removeChild(popover);

    expect(addSpy).toHaveBeenCalledWith('click', popover.clickPopover);
    expect(addSpy).toHaveBeenCalledWith('keydown', popover.keydownPopover);
    expect(removeSpy).toHaveBeenCalledWith('click', popover.clickPopover);
    expect(removeSpy).toHaveBeenCalledWith('keydown', popover.keydownPopover);

  });
});
