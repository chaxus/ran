import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { customNew, debounce, instanceOf, throttle } from '@/optimize';

describe('optimize/instanceOf', () => {
  it('matches the native instanceof for direct instances', () => {
    class A {}
    const a = new A();
    expect(instanceOf(a as never, A)).toBe(a instanceof A);
    expect(instanceOf(a as never, A)).toBe(true);
  });

  it('walks the prototype chain for inherited instances', () => {
    class A {}
    class B extends A {}
    const b = new B();
    expect(instanceOf(b as never, A)).toBe(true);
    expect(instanceOf(b as never, B)).toBe(true);
  });

  it('returns false when the constructor is unrelated', () => {
    class A {}
    class C {}
    expect(instanceOf(new A() as never, C)).toBe(false);
  });
});

describe('optimize/customNew', () => {
  it('creates an instance wired to the constructor prototype', () => {
    function Person(this: Record<string, unknown>, name: string) {
      this.name = name;
    }
    Person.prototype.greet = function (this: { name: string }) {
      return `hi ${this.name}`;
    };
    const p = customNew(Person, 'ran') as { name: string; greet: () => string };
    expect(p.name).toBe('ran');
    expect(p.greet()).toBe('hi ran');
    expect(p instanceof (Person as never)).toBe(true);
  });

  it('prefers an explicitly returned object', () => {
    const override = { overridden: true };
    function Ctor(this: Record<string, unknown>) {
      return override;
    }
    expect(customNew(Ctor)).toBe(override);
  });

  it('throws when the first argument is not a function', () => {
    expect(() => customNew({} as never)).toThrow('constructor must be function');
  });
});

describe('optimize/debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('invokes the callback once after the trailing delay', async () => {
    const spy = vi.fn((n: number) => n * 2);
    const debounced = debounce(100, spy);

    debounced(1);
    debounced(2);
    const pending = debounced(3);

    expect(spy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    await expect(pending).resolves.toBe(6);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(3);
  });
});

describe('optimize/throttle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('blocks calls until the wait window has elapsed, then fires once', () => {
    const spy = vi.fn(() => 'ok');
    const throttled = throttle(spy, 1000);

    // Within the initial window: suppressed.
    expect(throttled()).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();

    // Once the window elapses, the next call fires...
    vi.advanceTimersByTime(1000);
    expect(throttled()).toBe('ok');
    expect(spy).toHaveBeenCalledTimes(1);

    // ...and the following call is suppressed again until the next window.
    expect(throttled()).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
