import { describe, expect, it, vi } from 'vitest';
import { signal, createEffect, computed, batch } from '@/utils/builder';

describe('signal', () => {
  it('returns the initial value', () => {
    const [count] = signal(1);
    expect(count()).toBe(1);
  });

  it('updates when set', () => {
    const [count, setCount] = signal(1);
    setCount(2);
    expect(count()).toBe(2);
  });

  it('supports updater function form', () => {
    const [count, setCount] = signal(0);
    setCount((n) => n + 1);
    setCount((n) => n + 1);
    expect(count()).toBe(2);
  });

  it('does not notify when value is unchanged (Object.is)', () => {
    const fn = vi.fn();
    const [, setCount] = signal(1);
    createEffect(() => {
      setCount(1);
      fn();
    });
    const calls = fn.mock.calls.length;
    setCount(1);
    expect(fn.mock.calls.length).toBe(calls); // no extra call
  });

  it('uses custom equals to skip equivalent values', () => {
    const fn = vi.fn();
    const [get, set] = signal({ id: 1, name: 'old' }, { equals: (a, b) => a.id === b.id });

    createEffect(() => {
      get();
      fn();
    });
    const calls = fn.mock.calls.length;

    set({ id: 1, name: 'new' }); // same id → skip
    expect(fn.mock.calls.length).toBe(calls);
    expect(get()).toEqual({ id: 1, name: 'old' });

    set({ id: 2, name: 'new' }); // different id → update
    expect(fn.mock.calls.length).toBe(calls + 1);
    expect(get()).toEqual({ id: 2, name: 'new' });
  });
});

describe('createEffect', () => {
  it('runs immediately', () => {
    const fn = vi.fn();
    createEffect(fn);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('re-runs when a read signal changes', () => {
    const [count, setCount] = signal(0);
    const fn = vi.fn();

    createEffect(() => {
      count();
      fn();
    });
    expect(fn).toHaveBeenCalledTimes(1);

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(2);

    setCount(2);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not re-run after dispose', () => {
    const [count, setCount] = signal(0);
    const fn = vi.fn();

    const dispose = createEffect(() => {
      count();
      fn();
    });
    dispose();

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(1); // only the initial run
  });

  it('calls cleanup before re-run', () => {
    const [flag, setFlag] = signal(false);
    const order: string[] = [];

    createEffect(() => {
      flag();
      order.push('run');
      return () => order.push('cleanup');
    });

    setFlag(true);
    expect(order).toEqual(['run', 'cleanup', 'run']);
  });

  it('calls cleanup on dispose', () => {
    const cleanup = vi.fn();
    const dispose = createEffect(() => cleanup);
    dispose();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});

describe('createEffect — stale subscription cleanup', () => {
  it('stops receiving updates from signals no longer read (conditional dependency)', () => {
    const [show, setShow] = signal(true);
    const [count, setCount] = signal(0);
    const fn = vi.fn();

    createEffect(() => {
      if (show()) count(); // count is only read when show is true
      fn();
    });

    expect(fn).toHaveBeenCalledTimes(1);

    setCount(1); // show=true, count read → effect runs
    expect(fn).toHaveBeenCalledTimes(2);

    setShow(false); // effect re-runs, no longer reads count
    expect(fn).toHaveBeenCalledTimes(3);

    setCount(2); // count changed but effect no longer subscribes → must NOT run
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('removes subscriptions on dispose so signals do not hold a reference', () => {
    const [count, setCount] = signal(0);
    const fn = vi.fn();

    const dispose = createEffect(() => {
      count();
      fn();
    });
    dispose();

    setCount(1);
    expect(fn).toHaveBeenCalledTimes(1); // only the initial run, nothing after dispose
  });
});

describe('batch', () => {
  it('flushes effects once after all writes', () => {
    const [a, setA] = signal(0);
    const [b, setB] = signal(0);
    const fn = vi.fn();

    createEffect(() => {
      a();
      b();
      fn();
    });
    expect(fn).toHaveBeenCalledTimes(1);

    batch(() => {
      setA(1); // normally triggers effect
      setB(1); // normally triggers effect again
    });

    // Only one flush after both writes, not two
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('deduplicates — same effect triggered by two signals runs only once', () => {
    const [x, setX] = signal(0);
    const [y, setY] = signal(0);
    const fn = vi.fn();

    createEffect(() => {
      x();
      y();
      fn();
    });

    batch(() => {
      setX(1);
      setY(1);
    });
    expect(fn).toHaveBeenCalledTimes(2); // 1 initial + 1 batched
  });

  it('nested batch calls are absorbed by the outer batch', () => {
    const [a, setA] = signal(0);
    const fn = vi.fn();

    createEffect(() => {
      a();
      fn();
    });

    batch(() => {
      batch(() => {
        setA(1);
      }); // inner batch — absorbed
      setA(2);
    }); // outer flush

    expect(fn).toHaveBeenCalledTimes(2); // 1 initial + 1 flush
  });
});

describe('computed', () => {
  it('derives value from signals', () => {
    const [a, setA] = signal(2);
    const [b, setB] = signal(3);
    const sum = computed(() => a() + b());

    expect(sum()).toBe(5);
    setA(10);
    expect(sum()).toBe(13);
    setB(0);
    expect(sum()).toBe(10);
  });

  it('only recomputes when dependencies change', () => {
    const fn = vi.fn(() => 42);
    const [x, setX] = signal(0);
    const c = computed(() => {
      x();
      return fn();
    });

    c(); // first read — triggers initial compute
    const calls = fn.mock.calls.length;

    setX(1); // dependency changed → recompute
    c();
    expect(fn.mock.calls.length).toBeGreaterThan(calls);
  });

  it('is read-only (only returns a getter)', () => {
    const [x] = signal(1);
    const c = computed(() => x() * 2);
    expect(typeof c).toBe('function');
    expect(c()).toBe(2);
  });
});
