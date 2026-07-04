import { afterEach, describe, expect, it, vi } from 'vitest';
import { MessageCodec, Platform, PostMessageBridge } from '@/utils';

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

describe('MessageCodec round-trip', () => {
  it('round-trips unicode payloads (中文 / emoji)', () => {
    const data = { msg: '你好 🌈 世界', n: 42, nested: { a: ['x', 'y'] } };
    expect(MessageCodec.decode(MessageCodec.encode(data))).toEqual(data);
  });

  it('round-trips large payloads without dropping data', () => {
    // 大于分块阈值 (0x8000)，触发 encode 的分块拼接路径
    const data = { type: 'file', payload: 'x'.repeat(200_000), id: 'abc' };
    const encoded = MessageCodec.encode(data);
    expect(encoded).not.toBe('');
    expect(MessageCodec.decode(encoded)).toEqual(data);
  });

  it('returns empty/null on failure without logging to console', () => {
    const spy = vi.spyOn(console, 'log');
    // 循环引用无法 JSON.stringify → encode 返回 ''
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(MessageCodec.encode(circular)).toBe('');
    // 非本协议字符串解码失败 → 返回 null
    expect(MessageCodec.decode('not-a-valid-encoded-message')).toBeNull();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('PostMessageBridge request/response', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
  });

  const setupBridge = (targetWindow: { postMessage: ReturnType<typeof vi.fn> }) => {
    let messageHandler: ((event: MessageEvent) => void) | undefined;
    const addEventListener = vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
      if (type === 'message' && typeof handler === 'function') {
        messageHandler = handler as unknown as (event: MessageEvent) => void;
      }
    });
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: { addEventListener, removeEventListener: vi.fn() },
    });
    const bridge = new PostMessageBridge(targetWindow as unknown as Window, '*');
    return { bridge, deliver: (event: Partial<MessageEvent>) => messageHandler?.(event as MessageEvent) };
  };

  const outgoingId = (target: { postMessage: ReturnType<typeof vi.fn> }): string => {
    const sent = MessageCodec.decode<{ id: string }>(target.postMessage.mock.calls[0][0]);
    return sent!.id;
  };

  it('resolves the pending request on a normal response', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge, deliver } = setupBridge(target);
    const promise = bridge.send('do', { a: 1 });
    deliver({
      data: MessageCodec.encode({ type: 'do', payload: { ok: true }, id: outgoingId(target), isResponse: true }),
      origin: '*',
      source: target as unknown as Window,
    });
    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('rejects the pending request when the response carries isError', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge, deliver } = setupBridge(target);
    const promise = bridge.send('do', {});
    deliver({
      data: MessageCodec.encode({
        type: 'do',
        payload: 'handler blew up',
        id: outgoingId(target),
        isResponse: true,
        isError: true,
      }),
      origin: '*',
      source: target as unknown as Window,
    });
    await expect(promise).rejects.toThrow('handler blew up');
  });

  it('ignores messages whose source is not the target window', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge, deliver } = setupBridge(target);
    const promise = bridge.send('do', {});
    const id = outgoingId(target);
    // 来自其他窗口的响应应被忽略
    deliver({
      data: MessageCodec.encode({ type: 'do', payload: 'spoofed', id, isResponse: true }),
      origin: '*',
      source: { postMessage: vi.fn() } as unknown as Window,
    });
    // 来自正确窗口的响应才生效
    deliver({
      data: MessageCodec.encode({ type: 'do', payload: 'trusted', id, isResponse: true }),
      origin: '*',
      source: target as unknown as Window,
    });
    await expect(promise).resolves.toBe('trusted');
  });

  it('rejects outstanding requests on destroy', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', {});
    bridge.destroy();
    await expect(promise).rejects.toThrow('Bridge destroyed');
  });

  it('rejects immediately when the payload cannot be encoded', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    // 循环引用 → JSON.stringify 抛错 → encode 返回 ''
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    await expect(bridge.send('do', circular)).rejects.toThrow('Failed to encode message payload');
    // 不应发出任何消息
    expect(target.postMessage).not.toHaveBeenCalled();
  });

  it('degrades gracefully when instantiated outside a browser', async () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    // 无 window 时构造不应抛错
    const bridge = new PostMessageBridge();
    // send 明确 reject，broadcast / destroy 静默降级
    await expect(bridge.send('do', {})).rejects.toThrow('unavailable outside a browser');
    expect(() => bridge.broadcast({ type: 'x', payload: 1 })).not.toThrow();
    expect(() => bridge.destroy()).not.toThrow();
  });
});
