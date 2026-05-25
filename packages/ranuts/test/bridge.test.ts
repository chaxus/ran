import { afterEach, describe, expect, it, vi } from 'vitest';
import { MessageCodec, Platform } from '@/utils';

describe('Platform bridge', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
  });

  it('does not dispatch inherited handlers from message type input', async () => {
    let messageHandler: ((event: MessageEvent) => void | Promise<void>) | undefined;
    const addEventListener = vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
      if (type === 'message' && typeof handler === 'function') {
        messageHandler = handler as unknown as (event: MessageEvent) => void | Promise<void>;
      }
    });
    const removeEventListener = vi.fn();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: { addEventListener, removeEventListener },
    });

    const inheritedHandler = vi.fn();
    const events = Object.create({ inherited: inheritedHandler });
    Platform.init(events);

    await messageHandler?.({
      data: MessageCodec.encode({ type: 'inherited', payload: 'payload', id: 'request-id' }),
      origin: 'https://example.com',
      source: { postMessage: vi.fn() },
    } as unknown as MessageEvent);

    expect(inheritedHandler).not.toHaveBeenCalled();
  });
});
