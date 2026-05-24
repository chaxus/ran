import { describe, expect, it, vi } from 'vitest';
import { createSignal } from '@/utils/signal';

describe('utils/signal', () => {
  it('returns the initial value and updates changed values', () => {
    const [getter, setter] = createSignal(1);

    expect(getter()).toBe(1);
    setter(2);
    expect(getter()).toBe(2);
  });

  it('does not notify subscribers when the value is unchanged', () => {
    const subscriber = vi.fn();
    const [getter, setter] = createSignal(1, { subscriber: [subscriber] });

    setter(1);

    expect(getter()).toBe(1);
    expect(subscriber).not.toHaveBeenCalled();
  });

  it('registers function subscribers only once', () => {
    const subscriber = vi.fn();
    const [_, setter] = createSignal(1, { subscriber: [subscriber, subscriber, 'noop' as unknown as Function] });

    setter(2);

    expect(subscriber).toHaveBeenCalledOnce();
    expect(subscriber).toHaveBeenCalledWith(2);
  });

  it('uses custom comparators to skip equivalent values', () => {
    const subscriber = vi.fn();
    const [getter, setter] = createSignal({ id: 1, name: 'old' }, {
      subscriber: [subscriber],
      equals: (prev, next) => prev?.id === next.id,
    });

    setter({ id: 1, name: 'new' });
    expect(getter()).toEqual({ id: 1, name: 'old' });
    expect(subscriber).not.toHaveBeenCalled();

    setter({ id: 2, name: 'new' });
    expect(getter()).toEqual({ id: 2, name: 'new' });
    expect(subscriber).toHaveBeenCalledWith({ id: 2, name: 'new' });
  });

  it('forces notification when equals is false', () => {
    const subscriber = vi.fn();
    const [getter, setter] = createSignal(1, { subscriber: [subscriber], equals: false });

    setter(1);

    expect(getter()).toBe(1);
    expect(subscriber).not.toHaveBeenCalled();

    setter(2);
    expect(getter()).toBe(2);
    expect(subscriber).toHaveBeenCalledWith(2);
  });

  it('suppresses all updates when equals is true', () => {
    const subscriber = vi.fn();
    const [getter, setter] = createSignal(1, { subscriber: [subscriber], equals: true });

    setter(2);

    expect(getter()).toBe(1);
    expect(subscriber).not.toHaveBeenCalled();
  });
});
