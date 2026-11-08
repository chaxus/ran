import { describe, expect, it } from 'vitest';
import { createMemoryHost, emitMemoryEvent } from '../src/host-memory.ts';

describe('createMemoryHost', () => {
  it('builds a small tree without touching document', () => {
    const host = createMemoryHost();
    const root = host.createElement('div');
    const label = host.createText('hi');
    const child = host.createElement('span');
    host.setProp(child, 'data-id', '1');
    host.setStyle?.(child, { color: 'red' });
    host.insert(child, label);
    host.insert(root, child);

    const debug = host.debug(root);
    expect(debug.children).toHaveLength(1);
    expect(debug.children[0].type).toBe('span');
    expect(debug.children[0].props.get('data-id')).toBe('1');
    expect(debug.children[0].style.color).toBe('red');
    expect(debug.children[0].children[0].text).toBe('hi');
  });

  it('inserts before a sibling, removes, and disposes listeners', () => {
    const host = createMemoryHost();
    const root = host.createElement('div');
    const a = host.createElement('a');
    const b = host.createElement('b');
    host.insert(root, a);
    host.insert(root, b, a);
    expect(host.debug(root).children.map((c) => c.type)).toEqual(['b', 'a']);

    host.remove(root, b);
    expect(host.debug(root).children.map((c) => c.type)).toEqual(['a']);

    let count = 0;
    const stop = host.addListener(a, 'click', () => {
      count += 1;
    });
    emitMemoryEvent(a, 'click');
    expect(count).toBe(1);
    stop();
    emitMemoryEvent(a, 'click');
    expect(count).toBe(1);
  });
});
