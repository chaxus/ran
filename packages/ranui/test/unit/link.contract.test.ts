import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Link } from '@/components/link';
import '@/components/link';

describe('r-link contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with anchor element', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    const shadow = (link as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('a')).not.toBeNull();
  });

  it('does not throw on createElement', () => {
    expect(() => document.createElement('r-link')).not.toThrow();
  });

  it('anchor contains a slot element', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    const shadow = (link as any)._shadowDom as ShadowRoot;
    const anchor = shadow.querySelector('a');
    expect(anchor?.querySelector('slot')).not.toBeNull();
  });

  it('href setter reflects attribute and syncs anchor', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    link.href = '/about';
    expect(link.getAttribute('href')).toBe('/about');
    const anchor = (link as any)._anchor as HTMLAnchorElement;
    expect(anchor.href).toContain('/about');
  });

  it('replace getter returns false without attribute', () => {
    const link = document.createElement('r-link') as Link;
    expect((link as any).replace).toBe(false);
  });

  it('replace getter returns true with attribute', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('replace', '');
    expect((link as any).replace).toBe(true);
  });

  it('dispatches ran-navigate on anchor click for internal paths', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', '/about');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    const click = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
    anchor.dispatchEvent(click);

    expect(events).toHaveLength(1);
    expect(events[0]?.detail.path).toBe('/about');
  });

  it('does not dispatch ran-navigate for external http URLs', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', 'https://example.com');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    anchor.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true, cancelable: true }));
    expect(events).toHaveLength(0);
  });

  it('does not dispatch ran-navigate when modifier key is pressed', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', '/about');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    anchor.dispatchEvent(new MouseEvent('click', { button: 0, metaKey: true, bubbles: true, cancelable: true }));
    expect(events).toHaveLength(0);
  });

  it('does not dispatch ran-navigate when right-clicked (button !== 0)', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', '/about');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    anchor.dispatchEvent(new MouseEvent('click', { button: 2, bubbles: true, cancelable: true }));
    expect(events).toHaveLength(0);
  });

  it('passes replace:true detail when replace attribute is set', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', '/about');
    link.setAttribute('replace', '');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    anchor.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true, cancelable: true }));
    expect(events[0]?.detail.replace).toBe(true);
  });

  it('attributeChangedCallback syncs href when href changes', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    const spy = vi.spyOn(link as any, '_syncHref');
    link.setAttribute('href', '/new');
    // attributeChangedCallback fires for observed attribute change
    (link as any).attributeChangedCallback('href', '/old', '/new');
    expect(spy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    const spy = vi.spyOn(link as any, 'handlerExternalCss');
    (link as any).attributeChangedCallback('sheet', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('disconnectedCallback aborts event manager', () => {
    const link = document.createElement('r-link') as Link;
    document.body.appendChild(link);
    const spy = vi.spyOn((link as any)._events, 'abort');
    document.body.removeChild(link);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not dispatch ran-navigate for mailto: links', () => {
    const link = document.createElement('r-link') as Link;
    link.setAttribute('href', 'mailto:test@example.com');
    document.body.appendChild(link);

    const events: CustomEvent[] = [];
    link.addEventListener('ran-navigate', (e) => events.push(e as CustomEvent));

    const anchor = (link as any)._anchor as HTMLAnchorElement;
    anchor.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true, cancelable: true }));
    expect(events).toHaveLength(0);
  });
});
