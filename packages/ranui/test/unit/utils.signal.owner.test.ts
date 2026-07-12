import { describe, expect, it, vi } from 'vitest';
import { signal, createEffect, computed, untrack, createRoot, onCleanup, Div } from '@/utils/builder';

describe('ownership (createRoot / dispose / onCleanup)', () => {
  it('createRoot dispose stops every effect created inside', () => {
    const [count, setCount] = signal(0);
    const runs = vi.fn();
    const dispose = createRoot((dispose) => {
      createEffect(() => {
        count();
        runs();
      });
      return dispose;
    });
    expect(runs).toHaveBeenCalledTimes(1);
    setCount(1);
    expect(runs).toHaveBeenCalledTimes(2);
    dispose();
    setCount(2);
    expect(runs).toHaveBeenCalledTimes(2); // no runs after the scope is disposed
  });

  it('runs onCleanup before each re-run and on dispose', () => {
    const [count, setCount] = signal(0);
    const cleanup = vi.fn();
    const dispose = createRoot((dispose) => {
      createEffect(() => {
        count();
        onCleanup(cleanup);
      });
      return dispose;
    });
    expect(cleanup).toHaveBeenCalledTimes(0);
    setCount(1); // re-run → previous run's cleanup fires
    expect(cleanup).toHaveBeenCalledTimes(1);
    dispose(); // dispose → last run's cleanup fires
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it('disposes nested effects when the outer effect re-runs (no leak)', () => {
    const [outer, setOuter] = signal(0);
    const [inner, setInner] = signal(0);
    const innerRuns = vi.fn();
    createRoot(() => {
      createEffect(() => {
        outer();
        createEffect(() => {
          inner();
          innerRuns();
        });
      });
    });
    expect(innerRuns).toHaveBeenCalledTimes(1);
    setInner(1);
    expect(innerRuns).toHaveBeenCalledTimes(2);
    setOuter(1); // outer re-runs → old inner disposed, a fresh inner runs once
    expect(innerRuns).toHaveBeenCalledTimes(3);
    setInner(2); // only the current inner reacts — the old one is gone
    expect(innerRuns).toHaveBeenCalledTimes(4);
  });
});

describe('computed (lazy + memoized)', () => {
  it('does not compute until read, caches, and recomputes lazily after a change', () => {
    const [n, setN] = signal(2);
    const fn = vi.fn(() => n() * 2);
    const double = computed(fn);

    expect(fn).toHaveBeenCalledTimes(0); // lazy — unread means uncomputed
    expect(double()).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
    double();
    expect(fn).toHaveBeenCalledTimes(1); // cached

    setN(3);
    expect(fn).toHaveBeenCalledTimes(1); // still not recomputed (nobody read it yet)
    expect(double()).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does NOT re-run a downstream effect when the memo value is unchanged', () => {
    const [n, setN] = signal(1);
    const even = computed(() => n() % 2 === 0); // stays false for 1 → 3
    const runs = vi.fn();
    createRoot(() => {
      createEffect(() => {
        even();
        runs();
      });
    });
    expect(runs).toHaveBeenCalledTimes(1);
    setN(3); // n changed, but `even` is still false → effect must stay asleep
    expect(runs).toHaveBeenCalledTimes(1);
    setN(2); // now `even` flips to true → effect wakes once
    expect(runs).toHaveBeenCalledTimes(2);
  });

  it('honors a custom equals on a memo', () => {
    const [p, setP] = signal({ id: 1, label: 'a' });
    const id = computed(() => p(), { equals: (a, b) => (a as { id: number }).id === (b as { id: number }).id });
    const runs = vi.fn();
    createRoot(() => {
      createEffect(() => {
        id();
        runs();
      });
    });
    expect(runs).toHaveBeenCalledTimes(1);
    setP({ id: 1, label: 'b' }); // same id → memo treats it as unchanged
    expect(runs).toHaveBeenCalledTimes(1);
    setP({ id: 2, label: 'b' }); // id changed → wakes
    expect(runs).toHaveBeenCalledTimes(2);
  });

  it('runs a diamond-dependent effect once per change (deduped)', () => {
    const [n, setN] = signal(1);
    const a = computed(() => n() + 1);
    const b = computed(() => n() + 2);
    const runs = vi.fn();
    createRoot(() => {
      createEffect(() => {
        a();
        b();
        runs();
      });
    });
    expect(runs).toHaveBeenCalledTimes(1);
    setN(2);
    expect(runs).toHaveBeenCalledTimes(2); // once, not twice
  });
});

describe('robustness', () => {
  it('throws on a self-referential effect cycle', () => {
    const [n, setN] = signal(0);
    expect(() =>
      createRoot(() => {
        createEffect(() => {
          setN(n() + 1); // reads and writes the same signal → cycle
        });
      }),
    ).toThrow(/cyclic/i);
  });

  it('untrack reads without subscribing', () => {
    const [n, setN] = signal(0);
    const runs = vi.fn();
    createRoot(() => {
      createEffect(() => {
        untrack(() => n());
        runs();
      });
    });
    expect(runs).toHaveBeenCalledTimes(1);
    setN(1);
    expect(runs).toHaveBeenCalledTimes(1); // never subscribed
  });
});

describe('builder reactive bindings', () => {
  it('.text(getter) binds reactively and is disposed with the scope', () => {
    const [msg, setMsg] = signal('a');
    let el!: HTMLElement;
    const dispose = createRoot((dispose) => {
      el = Div().text(msg).build();
      return dispose;
    });
    expect(el.textContent).toBe('a');
    setMsg('b');
    expect(el.textContent).toBe('b');
    dispose();
    setMsg('c');
    expect(el.textContent).toBe('b'); // binding removed with the scope
  });

  it('.attr(getter) and .class(getter) react to signals', () => {
    const [href, setHref] = signal('/a');
    const [cls, setCls] = signal('on');
    let el!: HTMLElement;
    createRoot(() => {
      el = Div().attr('href', href).class(cls).build();
    });
    expect(el.getAttribute('href')).toBe('/a');
    expect(el.className).toBe('on');
    setHref('/b');
    setCls('off');
    expect(el.getAttribute('href')).toBe('/b');
    expect(el.className).toBe('off');
  });
});
