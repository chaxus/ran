import { expect, it } from 'vitest';
import { ElementBuilder, Show, Switch, Match, For, Index } from '../src/core';
import { signal, createEffect, createRoot } from '../src/signal';

it('SSR bindings snapshot values and do not subscribe an outer computation', () => {
  const [value, setValue] = signal('first');
  let runs = 0;
  let builder!: ElementBuilder;
  const dispose = createRoot((d) => {
    createEffect(() => {
      runs++;
      builder = new ElementBuilder('div').text(value);
    });
    return d;
  });
  setValue('second');
  expect(runs).toBe(1);
  expect(builder.serialize()).toBe('<div>first</div>');
  dispose();
});

it('SSR conditional snapshots do not subscribe their parent', () => {
  const [enabled, setEnabled] = signal(true);
  let runs = 0;
  const dispose = createRoot((d) => {
    createEffect(() => {
      runs++;
      new ElementBuilder('div').children(
        Show({ when: enabled, children: () => 'yes', fallback: () => 'no' }),
        Switch({ children: [Match({ when: enabled, children: () => 'on' })] }),
      );
    });
    return d;
  });
  setEnabled(false);
  expect(runs).toBe(1);
  dispose();
});

it('SSR lists and nested getters never subscribe an outer computation', () => {
  const [value, setValue] = signal('first');
  let runs = 0;
  const dispose = createRoot((d) => {
    createEffect(() => {
      runs++;
      new ElementBuilder('div').children(
        () => value(),
        For({ each: () => [value()], key: (x) => x, render: (x) => x }),
        Index({ each: () => [value()], render: (x) => x() }),
      );
    });
    return d;
  });
  setValue('second');
  expect(runs).toBe(1);
  dispose();
});
