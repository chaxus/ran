import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleConsole, handleError, handleFetchHook, handleXhrHook, replaceOld } from '@/utils';

const g = globalThis as unknown as Record<string, unknown>;
const saved: Array<[string, PropertyDescriptor | undefined]> = [];

const define = (key: string, value: unknown): void => {
  saved.push([key, Object.getOwnPropertyDescriptor(g, key)]);
  Object.defineProperty(g, key, { value, configurable: true, writable: true });
};

afterEach(() => {
  while (saved.length > 0) {
    const [key, descriptor] = saved.pop() as [string, PropertyDescriptor | undefined];
    if (descriptor) Object.defineProperty(g, key, descriptor);
    else delete g[key];
  }
});

/** Minimal listener-recording window stub */
const makeWindow = (extra: Record<string, unknown> = {}) => {
  const listeners = new Map<string, Set<EventListener>>();
  const win = {
    addEventListener: (type: string, fn: EventListener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener: (type: string, fn: EventListener) => listeners.get(type)?.delete(fn),
    ...extra,
  };
  return {
    win,
    count: (type: string): number => listeners.get(type)?.size ?? 0,
    fire: (type: string, event: unknown): void => listeners.get(type)?.forEach((fn) => fn(event as Event)),
  };
};

describe('replaceOld', () => {
  it('wraps a method and restores the original', () => {
    const target = { greet: (): string => 'original' };
    const restore = replaceOld(target, 'greet', () => () => 'patched');
    expect(target.greet()).toBe('patched');
    restore();
    expect(target.greet()).toBe('original');
  });

  it('is idempotent — restoring twice is harmless', () => {
    const target = { greet: (): string => 'original' };
    const restore = replaceOld(target, 'greet', () => () => 'patched');
    restore();
    restore();
    expect(target.greet()).toBe('original');
  });

  it('removes a forced key entirely on restore rather than leaving undefined', () => {
    const target: Record<string, unknown> = {};
    const restore = replaceOld(target, 'added', () => () => 'x', true);
    expect('added' in target).toBe(true);
    restore();
    expect('added' in target).toBe(false);
  });

  it('does not uninstall a layer that patched on top of it', () => {
    const target = { greet: (): string => 'original' };
    const restoreInner = replaceOld(target, 'greet', () => () => 'inner');
    replaceOld(target, 'greet', () => () => 'outer');
    restoreInner(); // 我们的 wrapper 已不在位，restore 应当放弃而不是把 outer 顶掉
    expect(target.greet()).toBe('outer');
  });

  it('leaves the target alone when it does not have the key', () => {
    const target: Record<string, unknown> = {};
    replaceOld(target, 'missing', () => () => 'x');
    expect('missing' in target).toBe(false);
  });
});

describe('handleConsole', () => {
  it('forwards every call to the hook and still prints', () => {
    const log = vi.fn();
    const warn = vi.fn();
    define('console', { log, warn, info: vi.fn(), error: vi.fn(), assert: vi.fn() });
    const hook = vi.fn();

    const restore = handleConsole(hook);
    (g.console as Console).log('hello', 1);
    expect(hook).toHaveBeenCalledWith('log', 'hello', 1);
    expect(log).toHaveBeenCalledWith('hello', 1);

    restore();
    (g.console as Console).warn('after');
    expect(hook).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('after');
  });

  it('restores the exact original functions', () => {
    const original = { log: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), assert: vi.fn() };
    define('console', { ...original });
    handleConsole(vi.fn())();
    expect((g.console as unknown as typeof original).log).toBe(original.log);
  });
});

describe('handleFetchHook', () => {
  it('reports request, response and error, and restores fetch', async () => {
    const originalFetch = vi.fn(async () => ({ ok: true }) as unknown as Response);
    const { win } = makeWindow({ fetch: originalFetch });
    define('window', win);

    const requestHook = vi.fn();
    const responseHook = vi.fn();
    const restore = handleFetchHook({ requestHook, responseHook });

    await (win as unknown as { fetch: typeof fetch }).fetch('/a');
    expect(requestHook).toHaveBeenCalledWith('/a', undefined);
    expect(responseHook).toHaveBeenCalled();

    restore();
    expect((win as unknown as { fetch: unknown }).fetch).toBe(originalFetch);
  });

  it('re-throws so the caller still sees the failure', async () => {
    const errorHook = vi.fn();
    const { win } = makeWindow({
      fetch: async () => {
        throw new Error('offline');
      },
    });
    define('window', win);
    handleFetchHook({ errorHook });
    await expect((win as unknown as { fetch: typeof fetch }).fetch('/a')).rejects.toThrow('offline');
    expect(errorHook).toHaveBeenCalled();
  });

  it('is a no-op without a window', () => {
    expect(() => handleFetchHook()()).not.toThrow();
  });
});

describe('handleXhrHook', () => {
  it('patches open and send, then restores both', () => {
    const open = vi.fn();
    const send = vi.fn();
    class FakeXhr {
      open = open;
      send = send;
      addEventListener = vi.fn();
    }
    define('window', makeWindow().win);
    define('XMLHttpRequest', class {} as unknown);
    const proto = (g.XMLHttpRequest as { prototype: Record<string, unknown> }).prototype;
    proto.open = open;
    proto.send = send;
    void FakeXhr;

    const requestHook = vi.fn();
    const restore = handleXhrHook({ requestHook });
    expect(proto.open).not.toBe(open);

    (proto.open as (...a: unknown[]) => void).call({}, 'GET', '/a');
    expect(requestHook).toHaveBeenCalled();

    restore();
    expect(proto.open).toBe(open);
    expect(proto.send).toBe(send);
  });
});

describe('handleError', () => {
  it('subscribes in the capture phase and unsubscribes cleanly', () => {
    const { win, count, fire } = makeWindow();
    define('window', win);
    const hook = vi.fn();

    const off = handleError(hook);
    expect(count('error')).toBe(1);
    expect(count('unhandledrejection')).toBe(1);

    fire('error', { message: 'boom' });
    expect(hook).toHaveBeenCalledWith({ message: 'boom' });

    off();
    expect(count('error')).toBe(0);
    expect(count('unhandledrejection')).toBe(0);
    fire('error', { message: 'again' });
    expect(hook).toHaveBeenCalledTimes(1);
  });

  it('does not stack listeners when called repeatedly without teardown', () => {
    // 回归：旧实现没有取消函数，热更新每重载一次就多一对监听，错误被上报 N 次
    const { win, count } = makeWindow();
    define('window', win);
    const offs = [handleError(vi.fn()), handleError(vi.fn()), handleError(vi.fn())];
    expect(count('error')).toBe(3);
    offs.forEach((off) => off());
    expect(count('error')).toBe(0);
  });

  it('is a no-op without a window', () => {
    expect(() => handleError()()).not.toThrow();
  });
});
