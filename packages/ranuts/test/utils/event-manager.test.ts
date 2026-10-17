import { afterEach, describe, expect, it, vi } from 'vitest';
import { EventManager } from '@/utils/event';

afterEach(() => vi.unstubAllGlobals());

describe('EventManager lifecycle', () => {
  it('allocates a controller only when a scope first needs a signal', () => {
    const NativeAbortController = AbortController;
    const allocated = vi.fn();
    vi.stubGlobal(
      'AbortController',
      class extends NativeAbortController {
        constructor() {
          super();
          allocated();
        }
      },
    );

    const events = new EventManager();
    events.abort();
    events.abort();
    expect(allocated).not.toHaveBeenCalled();

    const first = events.signal;
    expect(events.signal).toBe(first);
    expect(allocated).toHaveBeenCalledTimes(1);

    events.abort();
    expect(first.aborted).toBe(true);
    expect(allocated).toHaveBeenCalledTimes(1);
    expect(events.signal).not.toBe(first);
    expect(allocated).toHaveBeenCalledTimes(2);
  });

  it('removes listeners on abort and allows registration in the next scope', () => {
    const events = new EventManager();
    const target = new EventTarget();
    const handler = vi.fn();

    events.on(target, 'change', handler);
    target.dispatchEvent(new Event('change'));
    events.abort();
    target.dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledTimes(1);

    events.on(target, 'change', handler);
    target.dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
