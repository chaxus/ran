// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createWebHost } from '../src/host-web.ts';

describe('createWebHost', () => {
  it('requires a Document', () => {
    // `undefined` would trigger the default param; pass `null` to refuse a missing doc.
    expect(() => createWebHost(null)).toThrow(/Document/);
  });

  it('creates DOM nodes and applies props', () => {
    const host = createWebHost(document);
    const root = host.createElement('div') as unknown as HTMLElement;
    const child = host.createElement('button') as unknown as HTMLElement;
    host.setProp(child as never, 'type', 'button');
    host.setProp(child as never, 'class', 'primary');
    host.setText(child as never, 'Go');
    host.insert(root as never, child as never);
    document.body.appendChild(root);

    expect(root.querySelector('button.primary')?.getAttribute('type')).toBe('button');
    expect(root.querySelector('button')?.textContent).toBe('Go');

    let clicks = 0;
    const stop = host.addListener(child as never, 'click', () => {
      clicks += 1;
    });
    child.click();
    expect(clicks).toBe(1);
    stop();
    child.click();
    expect(clicks).toBe(1);

    host.remove(root as never, child as never);
    expect(root.querySelector('button')).toBeNull();
    root.remove();
  });
});
