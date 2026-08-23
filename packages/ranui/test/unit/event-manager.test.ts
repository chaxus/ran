import { describe, expect, it, vi } from 'vitest';
import { EventManager } from '@/utils/builder';

/**
 * `EventManager` creates its AbortController on first use rather than up front, so these
 * cover the two edges that laziness introduces: aborting before anything was registered,
 * and registering again afterwards. The second is the one that breaks silently — a stale
 * aborted controller would leave every later listener dead on arrival with nothing thrown.
 */
describe('EventManager', () => {
  it('registers a listener and removes it on abort', () => {
    const target = document.createElement('div');
    const handler = vi.fn();
    const events = new EventManager();

    events.on(target, 'click', handler);
    target.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);

    events.abort();
    target.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('aborts safely when nothing was ever registered', () => {
    const events = new EventManager();
    expect(() => events.abort()).not.toThrow();
    expect(() => events.abort()).not.toThrow();
  });

  it('registers again after an abort', () => {
    const target = document.createElement('div');
    const handler = vi.fn();
    const events = new EventManager();

    events.on(target, 'click', handler);
    events.abort();

    events.on(target, 'click', handler);
    target.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('hands out one signal per cycle and a new one after abort', () => {
    const events = new EventManager();
    const first = events.signal;

    expect(events.signal).toBe(first);
    events.abort();

    expect(first.aborted).toBe(true);
    expect(events.signal).not.toBe(first);
    expect(events.signal.aborted).toBe(false);
  });

  it('delegates to descendants matching the selector, and stops on abort', () => {
    const parent = document.createElement('div');
    const child = document.createElement('button');
    child.className = 'item';
    parent.appendChild(child);
    const handler = vi.fn();
    const events = new EventManager();

    events.delegate(parent, '.item', 'click', handler);
    child.dispatchEvent(new Event('click', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    events.abort();
    child.dispatchEvent(new Event('click', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
