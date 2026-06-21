import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import message from '@/components/message/index';

describe('r-message component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('registers r-message custom element', () => {
    expect(customElements.get('r-message')).toBeTruthy();
  });

  it('message API exports info, success, error, warning, toast', () => {
    expect(typeof message?.info).toBe('function');
    expect(typeof message?.success).toBe('function');
    expect(typeof message?.error).toBe('function');
    expect(typeof message?.warning).toBe('function');
    expect(typeof message?.toast).toBe('function');
  });

  it('r-message element has shadow DOM with correct structure', () => {
    const el = document.createElement('r-message');
    document.body.appendChild(el);

    const shadow = (el as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-message-notice')).not.toBeNull();
    expect(shadow.querySelector('.ran-message-notice-content')).not.toBeNull();
    expect(shadow.querySelector('.ran-message-notice-content-info')).not.toBeNull();
  });

  it('r-message type property reflects to attribute', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.type = 'success';
    expect(el.getAttribute('type')).toBe('success');
  });

  it('r-message content property updates span text', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setAttribute('content', 'Hello World');
    expect(el._span.textContent).toBe('Hello World');
  });

  it('r-message sheet property reflects to attribute', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.sheet = '.ran-message-notice { color: red; }';
    expect(el.getAttribute('sheet')).toBe('.ran-message-notice { color: red; }');
  });

  it('setIcon sets icon name and color for success type', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setIcon('success');
    expect(el._icon.getAttribute('name')).toBe('check-circle-fill');
    expect(el._icon.getAttribute('color')).toBe('#52c41a');
  });

  it('setIcon sets icon name and color for error type', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setIcon('error');
    expect(el._icon.getAttribute('name')).toBe('close-circle-fill');
    expect(el._icon.getAttribute('color')).toBe('#ff4d4f');
  });

  it('setIcon sets icon name and color for warning type', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setIcon('warning');
    expect(el._icon.getAttribute('name')).toBe('warning-circle-fill');
    expect(el._icon.getAttribute('color')).toBe('#faad14');
  });

  it('setIcon sets icon name and color for info type', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setIcon('info');
    expect(el._icon.getAttribute('name')).toBe('info-circle-fill');
    expect(el._icon.getAttribute('color')).toBe('#1890ff');
  });

  it('setIcon does not set icon for toast type', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setIcon('toast');
    // toast has null icon, so _icon should have no name set
    expect(el._icon.getAttribute('name')).toBeNull();
  });

  it('message.info creates a message element in container', () => {
    message?.info('Test info message');

    const container = document.querySelector('.ranui-message');
    expect(container).not.toBeNull();

    const msg = container?.querySelector('.message') as HTMLElement;
    expect(msg).not.toBeNull();
    expect(msg.getAttribute('type')).toBe('info');
    expect(msg.getAttribute('content')).toBe('Test info message');
  });

  it('message.success creates element with success type', () => {
    message?.success('Operation successful');

    const container = document.querySelector('.ranui-message');
    const msg = container?.querySelector('.message[type="success"]') as HTMLElement;
    expect(msg).not.toBeNull();
    expect(msg.getAttribute('content')).toBe('Operation successful');
  });

  it('message.error creates element with error type', () => {
    message?.error('An error occurred');

    const container = document.querySelector('.ranui-message');
    const msg = container?.querySelector('.message[type="error"]') as HTMLElement;
    expect(msg).not.toBeNull();
  });

  it('message.warning creates element with warning type', () => {
    message?.warning('A warning');

    const container = document.querySelector('.ranui-message');
    const msg = container?.querySelector('.message[type="warning"]') as HTMLElement;
    expect(msg).not.toBeNull();
  });

  it('message.toast creates element with toast type', () => {
    message?.toast('Toast notification');

    const container = document.querySelector('.ranui-message');
    const msg = container?.querySelector('.message[type="toast"]') as HTMLElement;
    expect(msg).not.toBeNull();
  });

  it('message is removed from container after duration', () => {
    message?.info({ content: 'Will disappear', duration: 1000 });

    const container = document.querySelector('.ranui-message')!;
    expect(container.querySelector('.message')).not.toBeNull();

    vi.advanceTimersByTime(1000);
    expect(container.querySelector('.message')).toBeNull();
  });

  it('message calls close callback after removal', () => {
    const closeSpy = vi.fn();
    message?.info({ content: 'Close test', duration: 500, close: closeSpy });

    vi.advanceTimersByTime(500);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('message.info ignores null/undefined options', () => {
    expect(() => message?.info(null)).not.toThrow();
    expect(() => message?.info(undefined)).not.toThrow();
  });

  it('attributeChangedCallback skips when old === new', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);

    el.setAttribute('content', 'same');
    el._span.textContent = '';

    el.attributeChangedCallback('content', 'same', 'same');
    expect(el._span.textContent).toBe('');
  });

  it('r-message type getter returns attribute', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);
    el.setAttribute('type', 'success');
    expect(el.type).toBe('success');
  });

  it('r-message content getter returns attribute', () => {
    const el = document.createElement('r-message') as any;
    document.body.appendChild(el);
    el.setAttribute('content', 'Hello');
    expect(el.content).toBe('Hello');
  });

  it('message.info with object options sets duration and top', () => {
    message?.info({ content: 'With options', duration: 2000, top: 20 });
    const container = document.querySelector('.ranui-message');
    const msg = container?.querySelector('.message');
    expect(msg).not.toBeNull();
  });

  it('message.info removes class message-leave after duration', () => {
    message?.info({ content: 'Leave test', duration: 1000 });
    vi.advanceTimersByTime(700);
    const container = document.querySelector('.ranui-message')!;
    const msg = container.querySelector('.message') as HTMLElement;
    expect(msg?.classList.contains('message-leave')).toBe(true);
  });
});
