import { expect, it } from 'vitest';
import * as dynamic from '../src/index';
import * as snapshot from '../src/static';

it('static and standard SSR preserve escaping, attributes, lists and shadow serialization', () => {
  const render = (v: typeof snapshot | typeof dynamic) => {
    const holder = v.createRef<HTMLDivElement>();
    const root = v
      .Div()
      .class(() => 'card')
      .boolAttr('hidden', () => false)
      .ref(holder)
      .children(
        v.Span().text(() => '<safe> & text'),
        v.For({ each: () => ['a', 'b'], key: (x) => x, render: (x, i) => v.Span().text(() => `${i()}:${x}`) }),
        v.Index({ each: () => ['c'], render: (x) => v.Span().text(x) }),
        v.Show({ when: () => true, children: () => 'yes' }),
        v.Switch({ children: [v.Match({ when: () => false, children: () => 'no' })], fallback: () => 'fallback' }),
      );
    root
      .shadow({ mode: 'open' })
      .css(':host{display:block}')
      .children(v.Span().text(() => 'shadow'));
    expect(holder.current).toBe(root.build());
    return root.serialize();
  };
  expect(render(snapshot)).toBe(render(dynamic));
  expect(render(snapshot)).toContain('&lt;safe&gt; &amp; text');
});
