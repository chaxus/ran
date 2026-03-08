import { describe, expect, it, beforeEach } from 'vitest';
import { applyHostStyle, getMessageContainer, getMessageHostSelector } from '@/components/message/container';

describe('message container', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('applies top and zIndex style with number and string values', () => {
    const host = document.createElement('div');
    applyHostStyle(host, { top: 24, zIndex: 3000 });
    expect(host.style.top).toBe('24px');
    expect(host.style.zIndex).toBe('3000');

    applyHostStyle(host, { top: '2rem', zIndex: 'var(--z-overlay)' });
    expect(host.style.top).toBe('2rem');
    expect(host.style.zIndex).toBe('var(--z-overlay)');
  });

  it('mounts to custom container from getContainer', () => {
    const root = document.createElement('div');
    root.id = 'custom-root';
    document.body.appendChild(root);

    const container = getMessageContainer({
      getContainer: () => root,
      top: 40,
      zIndex: 2222,
    });

    expect(container).not.toBeNull();
    expect(root.querySelector('.ranui-message')).toBe(container);

    const host = root.querySelector<HTMLElement>(getMessageHostSelector());
    expect(host).not.toBeNull();
    expect(host?.style.top).toBe('40px');
    expect(host?.style.zIndex).toBe('2222');
  });

  it('reuses one host in the same mount element and updates style per call', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const first = getMessageContainer({
      getContainer: () => root,
      top: 10,
      zIndex: 1000,
    });

    const second = getMessageContainer({
      getContainer: () => root,
      top: 30,
      zIndex: 2000,
    });

    expect(first).toBe(second);

    const hosts = root.querySelectorAll(getMessageHostSelector());
    expect(hosts.length).toBe(1);

    const host = hosts[0] as HTMLElement;
    expect(host.style.top).toBe('30px');
    expect(host.style.zIndex).toBe('2000');
  });
});
