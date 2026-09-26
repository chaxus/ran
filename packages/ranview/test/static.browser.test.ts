// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { Div, Span, Svg, View, For, Index, Show, Switch, Match, createRef } from '../src/static';
import { signal } from '../src/signal';

it('static DOM evaluates bindings and nested control flow once without region markers', () => {
  const [value, setValue] = signal('first');
  const ref = createRef<HTMLDivElement>();
  const el = Div()
    .ref(ref)
    .attr('title', value)
    .children(
      () => [Span().text(value), null],
      Show({ when: () => true, children: () => 'yes' }),
      Switch({ children: [Match({ when: () => true, children: () => 'on' })] }),
      For({ each: () => [1, 2], key: (x) => x, render: (x, i) => Span().text(() => `${x}:${i()}`) }),
      Index({ each: () => ['a'], render: (x) => Span().text(x) }),
    )
    .build();
  setValue('second');
  expect(ref.current).toBe(el);
  expect(el.title).toBe('first');
  expect(el.textContent).toBe('firstyeson1:02:1a');
  expect([...el.childNodes].some((n) => n.nodeType === 8)).toBe(false);
  expect(Svg('a').build().namespaceURI).toBe('http://www.w3.org/2000/svg');
  expect(View('path').build().namespaceURI).toBe('http://www.w3.org/2000/svg');
});

it('static listeners work and shadow children use static bindings', () => {
  let clicks = 0;
  const button = View('button')
    .on('click', () => clicks++)
    .build();
  button.click();
  expect(clicks).toBe(1);
  const [v, set] = signal('initial');
  const shadow = Div().shadow({ mode: 'open' }).children(Span().text(v)).done();
  set('updated');
  expect(shadow.shadow.textContent).toBe('initial');
});

it('reports mixed reactive list handles instead of appending invalid nodes', async () => {
  const reactive = await import('../src/core');
  expect(() => Div().children(reactive.For({ each: () => [1], key: (x) => x, render: () => 'x' }))).toThrow(/static/);
});
