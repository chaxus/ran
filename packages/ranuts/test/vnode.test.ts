// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { h, init } from '@/vnode';

describe('vnode/h', () => {
  it('builds a bare element vnode', () => {
    const v = h('div');
    expect(v.sel).toBe('div');
    expect(v.text).toBeUndefined();
    expect(v.children).toBeUndefined();
  });

  it('treats a primitive second argument as text', () => {
    const v = h('span', 'hello');
    expect(v.text).toBe('hello');
    expect(v.children).toBeUndefined();
  });

  it('treats an object second argument as data and picks up the key', () => {
    const v = h('div', { key: 'k1', props: { id: 'x' } });
    expect(v.key).toBe('k1');
    expect(v.data?.props).toEqual({ id: 'x' });
  });

  it('wraps primitive children into text vnodes', () => {
    const v = h('ul', {}, ['a', h('li', 'b')]);
    expect(Array.isArray(v.children)).toBe(true);
    const [first, second] = v.children as Array<{ text?: string; sel?: string }>;
    expect(first.text).toBe('a');
    expect(second.sel).toBe('li');
  });

  it('adds the SVG namespace for svg selectors', () => {
    const v = h('svg', {}, [h('rect')]);
    expect(v.data?.ns).toBe('http://www.w3.org/2000/svg');
  });
});

describe('vnode/init patch', () => {
  it('mounts a vnode into a host element with id/class/text', () => {
    const parent = document.createElement('div');
    const mount = document.createElement('div');
    parent.appendChild(mount);

    const patch = init();
    const v = h('span#a.b.c', {}, 'hello');
    patch(mount, v);

    const elm = v.elm as HTMLElement;
    expect(elm.tagName).toBe('SPAN');
    expect(elm.id).toBe('a');
    expect(elm.className).toBe('b c');
    expect(elm.textContent).toBe('hello');
    expect(parent.contains(elm)).toBe(true);
  });
});
