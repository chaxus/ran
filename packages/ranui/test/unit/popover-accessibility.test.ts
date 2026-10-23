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
    const popover = await createPopover();
    await sleep();

    const abortSpy = vi.spyOn((popover as any)._events, 'abort');
    document.body.removeChild(popover);

    expect(abortSpy).toHaveBeenCalledOnce();
  });

  it('dismisses a portaled action with Escape and restores its trigger', async () => {
    const popover = await createPopover();
    const trigger = document.createElement('button');
    popover.prepend(trigger);
    trigger.focus();
    popover.show();
    const action = popover.popoverContent!.querySelector('button')!;
    action.focus();
    const restoreFocus = vi.spyOn(trigger, 'focus');
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    action.dispatchEvent(escape);
    expect(popover.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(restoreFocus).toHaveBeenCalledWith({ preventScroll: true, focusVisible: true });
    expect(escape.defaultPrevented).toBe(true);
  });

  it('retains every interactive child when portaling a live content collection', async () => {
    const popover = await createPopover();
    const content = document.createElement('r-content');
    content.innerHTML = '<button>First action</button><button>Second action</button>';
    popover.createContent(content.children);
    expect(Array.from(popover.popoverContent!.querySelectorAll('button'), (button) => button.textContent)).toEqual([
      'First action',
      'Second action',
    ]);
  });

  it('returns to the pointer trigger when the browser focuses its popover host', async () => {
    const popover = await createPopover();
    const trigger = document.createElement('button');
    trigger.innerHTML = '<span>Options</span>';
    popover.prepend(trigger);
    popover.focus();
    trigger.querySelector('span')!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    const action = popover.popoverContent!.querySelector('button')!;
    action.focus();
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(popover.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('cancels a queued keyboard opening when Escape arrives before it appears', async () => {
    const popover = await createPopover();
    vi.useFakeTimers();
    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    vi.advanceTimersByTime(20);
    expect(popover.open).toBe(false);
  });

  it('rebinds portal keyboard dismissal once after reconnecting and updating content', async () => {
    const popover = await createPopover();
    const previous = popover.popoverContent!;
    const hide = vi.fn();
    popover.addEventListener('hide', hide);
    popover.remove();
    expect(previous.isConnected).toBe(false);
    document.body.append(popover);
    const content = popover.querySelector('r-content')!;
    content.innerHTML = '<button>Updated action</button>';
    popover.createContent(content.children);
    popover.focus();
    popover.show();
    const action = popover.popoverContent!.querySelector('button')!;
    action.focus();
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(popover.open).toBe(false);
    expect(document.activeElement).toBe(popover);
    expect(hide).toHaveBeenCalledOnce();
  });

  it('preserves authored portal nodes, state and listeners across repeated reconnects', async () => {
    const popover = await createPopover();
    const content = popover.querySelector('r-content')!;
    content.innerHTML = '<button>First action</button><input value="Draft"><button>Last action</button>';
    popover.createContent(content.children);
    const nodes = Array.from(popover.popoverContent!.children);
    const input = nodes[1] as HTMLInputElement;
    input.value = 'Edited draft';
    const click = vi.fn();
    nodes[2]!.addEventListener('click', click);
    for (let i = 0; i < 2; i++) {
      popover.show();
      popover.remove();
      expect(Array.from(content.children)).toEqual(nodes);
      document.body.append(popover);
      await sleep();
      popover.hide();
      popover.show();
      expect(Array.from(popover.popoverContent!.children)).toEqual(nodes);
      expect(input.value).toBe('Edited draft');
      (nodes[2] as HTMLButtonElement).click();
    }
    expect(click).toHaveBeenCalledTimes(2);
  });

  it.each(['handled', 'composing'])('preserves %s Escape in portaled content', async (kind) => {
    const popover = await createPopover();
    popover.show();
    const action = popover.popoverContent!.querySelector('button')!;
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
      isComposing: kind === 'composing',
    });
    if (kind === 'handled') action.addEventListener('keydown', (event) => event.preventDefault());
    action.dispatchEvent(event);
    expect(popover.open).toBe(true);
  });

  it('closes only the nested popover and does not activate a portaled action with Enter', async () => {
    const parent = await createPopover();
    const child = document.createElement('r-popover') as Popover;
    const trigger = document.createElement('button');
    const content = document.createElement('r-content');
    content.innerHTML = '<button>Child action</button>';
    child.append(trigger, content);
    parent.popoverContent!.append(child);
    parent.show();
    trigger.focus();
    child.show();
    const action = child.popoverContent!.querySelector('button')!;
    action.focus();
    action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(child.open).toBe(false);
    expect(parent.open).toBe(true);
    expect(document.activeElement).toBe(trigger);
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    parent.popoverContent!.querySelector('button')!.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(false);
  });
});
