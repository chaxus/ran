import { afterEach, describe, expect, it, vi } from 'vitest';
import { BRIDGE_MARKER, MessageCodec, Platform, PostMessageBridge, acceptPortBridge, createPortBridge } from '@/utils';

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

    // 用新的信封协议（结构化对象 + 协议标记）投递；'inherited' 是原型上的键，
    // 不应被 Object.entries 采集为处理器，因此不该被调用。
    await messageHandler?.({
      data: { __bridge: BRIDGE_MARKER, channel: 'default', type: 'inherited', payload: 'payload', id: 'request-id' },
      origin: 'https://example.com',
      source: { postMessage: vi.fn() },
    } as unknown as MessageEvent);

    expect(inheritedHandler).not.toHaveBeenCalled();
  });

  const initPlatformWith = (events: Record<string, (payload: unknown) => unknown>) => {
    let messageHandler: ((event: MessageEvent) => void | Promise<void>) | undefined;
    const addEventListener = vi.fn((type: string, handler: EventListenerOrEventListenerObject) => {
      if (type === 'message' && typeof handler === 'function') {
        messageHandler = handler as unknown as (event: MessageEvent) => void | Promise<void>;
      }
    });
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: { addEventListener, removeEventListener: vi.fn() },
    });
    Platform.init(events);
    return (event: Partial<MessageEvent>) => messageHandler?.(event as MessageEvent);
  };

  it('replies with a marked envelope carrying the handler result (Client↔Platform interop)', async () => {
    const deliver = initPlatformWith({ echo: (p) => ({ got: p }) });
    const reply = vi.fn();
    await deliver({
      data: { __bridge: BRIDGE_MARKER, channel: 'default', type: 'echo', payload: 42, id: 'req-1' },
      origin: 'https://example.com',
      source: { postMessage: reply } as unknown as Window,
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(reply).toHaveBeenCalledTimes(1);
    const [envelope, opts] = reply.mock.calls[0];
    expect(envelope).toMatchObject({
      __bridge: BRIDGE_MARKER,
      type: 'echo',
      id: 'req-1',
      isResponse: true,
      payload: { got: 42 },
    });
    expect(opts).toEqual({ targetOrigin: 'https://example.com' });
  });

  it('replies with isError when a Platform handler throws', async () => {
    const deliver = initPlatformWith({
      boom: () => {
        throw new Error('nope');
      },
    });
    const reply = vi.fn();
    await deliver({
      data: { __bridge: BRIDGE_MARKER, channel: 'default', type: 'boom', payload: null, id: 'req-2' },
      origin: 'https://example.com',
      source: { postMessage: reply } as unknown as Window,
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(reply.mock.calls[0][0]).toMatchObject({ isResponse: true, isError: true, payload: 'nope' });
  });

  it('ignores foreign (non-marked) traffic in Platform', async () => {
    const handler = vi.fn();
    const deliver = initPlatformWith({ ping: handler });
    await deliver({
      data: { type: 'ping', payload: 1, id: 'x' },
      origin: 'https://example.com',
      source: { postMessage: vi.fn() } as unknown as Window,
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(handler).not.toHaveBeenCalled();
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

type FakeWindow = { postMessage: ReturnType<typeof vi.fn> };
type Envelope = {
  __bridge: string;
  channel: string;
  senderId: string;
  type: string;
  payload: unknown;
  id?: string;
  isResponse?: boolean;
  isError?: boolean;
};

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('PostMessageBridge request/response', () => {
  const originalWindow = globalThis.window;
  const created: PostMessageBridge[] = [];

  afterEach(() => {
    // 销毁本轮创建的 bridge，从共享分发器摘除，避免跨用例串扰
    created.splice(0).forEach((bridge) => bridge.destroy());
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
  });

  const setupBridge = (targetWindow: FakeWindow, channel?: string) => {
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
    const bridge = new PostMessageBridge(targetWindow as unknown as Window, '*', channel);
    created.push(bridge);
    return { bridge, deliver: (event: Partial<MessageEvent>) => messageHandler?.(event as MessageEvent) };
  };

  // 现在线路上是结构化对象（非 base64），直接读最后一条 envelope
  const lastEnvelope = (target: FakeWindow): Envelope => target.postMessage.mock.calls.at(-1)?.[0] as Envelope;
  const deliverTo = (bridge: PostMessageBridge, data: Partial<Envelope>, source: FakeWindow) =>
    bridge.receive({ data, origin: '*', source: source as unknown as Window } as unknown as MessageEvent);

  it('sends a marked envelope and resolves on a normal response', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', { a: 1 });
    const env = lastEnvelope(target);
    // 信封应带协议标记 + 通道 + 发送方 id，且 payload 未被 base64 化
    expect(env.__bridge).toBeTruthy();
    expect(env.channel).toBe('default');
    expect(env.payload).toEqual({ a: 1 });
    deliverTo(bridge, { ...env, payload: { ok: true }, isResponse: true, senderId: 'peer' }, target);
    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('rejects the pending request when the response carries isError', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', {});
    const env = lastEnvelope(target);
    deliverTo(
      bridge,
      { ...env, payload: 'handler blew up', isResponse: true, isError: true, senderId: 'peer' },
      target,
    );
    await expect(promise).rejects.toThrow('handler blew up');
  });

  it('ignores messages whose source is not the target window', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', {});
    const env = lastEnvelope(target);
    // 来自其他窗口的响应应被忽略
    deliverTo(bridge, { ...env, payload: 'spoofed', isResponse: true, senderId: 'peer' }, { postMessage: vi.fn() });
    // 来自正确窗口的响应才生效
    deliverTo(bridge, { ...env, payload: 'trusted', isResponse: true, senderId: 'peer' }, target);
    await expect(promise).resolves.toBe('trusted');
  });

  it('ignores foreign postMessage traffic without the protocol marker', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', {});
    const env = lastEnvelope(target);
    // 无 __bridge 标记（其它库的消息）应被忽略，pending 保持
    deliverTo(bridge, { type: 'do', payload: 'noise', id: env.id, isResponse: true } as Partial<Envelope>, target);
    deliverTo(bridge, { ...env, payload: 'real', isResponse: true, senderId: 'peer' }, target);
    await expect(promise).resolves.toBe('real');
  });

  it('isolates bridges on different channels (Q3)', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target, 'channel-A');
    const handler = vi.fn(() => 'ok');
    bridge.on('greet', handler);
    const marker = (() => {
      // 借一次 send 取出协议标记；该 send 不会有响应，destroy 时会被 reject，
      // 挂 catch 吞掉，避免 unhandled rejection。
      bridge.send('warmup', {}).catch(() => {});
      return lastEnvelope(target).__bridge;
    })();
    // 另一通道的请求应被忽略
    deliverTo(
      bridge,
      { __bridge: marker, channel: 'channel-B', type: 'greet', payload: {}, id: 'r1', senderId: 'peer' },
      target,
    );
    await flush();
    expect(handler).not.toHaveBeenCalled();
    // 本通道的请求才处理
    deliverTo(
      bridge,
      { __bridge: marker, channel: 'channel-A', type: 'greet', payload: {}, id: 'r2', senderId: 'peer' },
      target,
    );
    await flush();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not answer its own requests (Q4 self-answer guard)', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    bridge.on('greet', () => 'hi');
    // warmup send 不会有响应，destroy 时会被 reject，挂 catch 避免 unhandled rejection。
    bridge.send('warmup', {}).catch(() => {});
    const { __bridge: marker, channel, senderId } = lastEnvelope(target);
    target.postMessage.mockClear();
    // 用 bridge 自己的 senderId 发来的请求 → 跳过，不回复
    deliverTo(bridge, { __bridge: marker, channel, type: 'greet', payload: {}, id: 'self', senderId }, target);
    await flush();
    expect(target.postMessage).not.toHaveBeenCalled();
    // 其它实例的请求 → 正常回复
    deliverTo(bridge, { __bridge: marker, channel, type: 'greet', payload: {}, id: 'other', senderId: 'peer' }, target);
    await flush();
    expect(target.postMessage).toHaveBeenCalledTimes(1);
  });

  it('rejects outstanding requests on destroy', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge } = setupBridge(target);
    const promise = bridge.send('do', {});
    bridge.destroy();
    await expect(promise).rejects.toThrow('Bridge destroyed');
  });

  it('rejects when the payload cannot be structured-cloned', async () => {
    // 模拟 postMessage 抛 DataCloneError（如 payload 含函数）
    const target = {
      postMessage: vi.fn(() => {
        throw new Error('DataCloneError');
      }),
    };
    const { bridge } = setupBridge(target);
    await expect(bridge.send('do', () => {})).rejects.toThrow('DataCloneError');
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

  it('routes messages through the shared dispatcher (方案 C)', async () => {
    const target = { postMessage: vi.fn() };
    const { bridge, deliver } = setupBridge(target);
    const promise = bridge.send('do', {});
    const env = lastEnvelope(target);
    // 通过共享分发器捕获的全局监听器投递，而非直接 receive
    deliver({
      data: { ...env, payload: 'via-dispatcher', isResponse: true, senderId: 'peer' },
      origin: '*',
      source: target as unknown as Window,
    });
    await expect(promise).resolves.toBe('via-dispatcher');
  });
});

// 用假的 MessagePort 对（node 环境无 DOM MessagePort），验证方案 B 的收发逻辑
const makePortPair = () => {
  const listeners: { a: Set<(e: { data: unknown }) => void>; b: Set<(e: { data: unknown }) => void> } = {
    a: new Set(),
    b: new Set(),
  };
  const make = (self: 'a' | 'b', other: 'a' | 'b') => ({
    addEventListener: (type: string, handler: (e: { data: unknown }) => void) => {
      if (type === 'message') listeners[self].add(handler);
    },
    removeEventListener: (type: string, handler: (e: { data: unknown }) => void) => {
      if (type === 'message') listeners[self].delete(handler);
    },
    start: () => {},
    close: () => {},
    postMessage: (data: unknown) => {
      listeners[other].forEach((handler) => handler({ data }));
    },
  });
  return [make('a', 'b'), make('b', 'a')] as const;
};

describe('PortBridge (方案 B, MessagePort)', () => {
  it('round-trips a request/response over a port pair', async () => {
    const [p1, p2] = makePortPair();
    const a = createPortBridge(p1 as unknown as MessagePort);
    const b = createPortBridge(p2 as unknown as MessagePort);
    b.on('add', ({ x, y }: { x: number; y: number }) => x + y);
    await expect(a.send('add', { x: 2, y: 3 })).resolves.toBe(5);
    a.destroy();
    b.destroy();
  });

  it('rejects when the remote handler throws', async () => {
    const [p1, p2] = makePortPair();
    const a = createPortBridge(p1 as unknown as MessagePort);
    const b = createPortBridge(p2 as unknown as MessagePort);
    b.on('boom', () => {
      throw new Error('kaboom');
    });
    await expect(a.send('boom', {})).rejects.toThrow('kaboom');
    a.destroy();
    b.destroy();
  });

  it('rejects pending requests on destroy', async () => {
    const [p1] = makePortPair();
    const a = createPortBridge(p1 as unknown as MessagePort);
    const promise = a.send('never', {});
    a.destroy();
    await expect(promise).rejects.toThrow('Bridge destroyed');
  });

  it('acceptPortBridge rejects outside a browser environment', async () => {
    await expect(acceptPortBridge()).rejects.toThrow('unavailable outside a browser');
  });
});
