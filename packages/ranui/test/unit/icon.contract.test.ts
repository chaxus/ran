import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Icon, registerIcon, registerIcons } from '@/components/icon/index';
// Ensure custom elements are defined
import '@/components/icon/index';

describe('r-icon contract', () => {
  const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const createIcon = async (name?: string, sampleSvgObj?: string) => {
    const icon = document.createElement('r-icon') as Icon;
    document.body.appendChild(icon);
    await sleep(20); // allow connectedCallback and shadow DOM to render
    if (name && sampleSvgObj) {
      registerIcon(name, sampleSvgObj);
      icon.name = name;
      await sleep(20);
    }
    return icon;
  };

  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;

  it('reflects correct aria attributes when decorative', async () => {
    const icon = await createIcon('test-home', sampleSvg);

    // Default is decorative true (no aria-label)
    expect(icon.decorative).toBe(true);

    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl).not.toBeNull();

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(svgEl?.getAttribute('aria-hidden')).toBe('true');
    expect(svgEl?.getAttribute('focusable')).toBe('false');

    // Change to semantic (not decorative)
    icon.decorative = false;
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
    expect(icon.getAttribute('role')).toBe('img');

    // Wait for the sync properties
    await sleep();
    const newSvgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(newSvgEl?.hasAttribute('aria-hidden')).toBe(false);
  });

  it('updates SVG styling properties', async () => {
    const icon = await createIcon('test-color', sampleSvg);
    await sleep();

    // Update size
    icon.size = '2rem';
    await sleep();
    expect(icon.getAttribute('size')).toBe('2rem');

    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl?.getAttribute('width')).toBe('2rem');
    expect(svgEl?.getAttribute('height')).toBe('2rem');

    // Update color
    icon.color = 'blue';
    await sleep();
    expect(icon.getAttribute('color')).toBe('blue');
    expect(svgEl?.style.getPropertyValue('color')).toBe('blue');

    // Update spin class
    const inner = (icon as any)._shadowDom?.querySelector('.ran-icon');
    expect(inner?.classList.contains('ran-icon-spin')).toBe(false);
    icon.spin = true;
    await sleep();
    expect(inner?.classList.contains('ran-icon-spin')).toBe(true);
  });

  it('ariaLabel getter and setter', async () => {
    const icon = await createIcon('test-aria', sampleSvg);
    icon.ariaLabel = 'Home icon';
    expect(icon.getAttribute('aria-label')).toBe('Home icon');
    expect(icon.ariaLabel).toBe('Home icon');

    icon.ariaLabel = '';
    expect(icon.hasAttribute('aria-label')).toBe(false);
  });

  it('sheet getter and setter', async () => {
    const icon = await createIcon('test-sheet', sampleSvg);
    icon.sheet = '.ran-icon { color: red; }';
    expect(icon.sheet).toBe('.ran-icon { color: red; }');
  });

  it('reacts to new registered icons via events', async () => {
    const icon = await createIcon();

    icon.name = 'async-icon';
    await sleep();
    expect((icon as any)._shadowDom?.querySelector('svg')).toBeNull();

    // Register after component is connected
    registerIcon('async-icon', sampleSvg);

    await sleep(20);
    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl).not.toBeNull();
  });

  it('registerIcon with non-SVG source does not add to cache', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerIcon('invalid-icon', 'not-an-svg');
    const icon = document.createElement('r-icon') as Icon;
    icon.name = 'invalid-icon';
    document.body.appendChild(icon);
    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl).toBeNull();
    consoleWarnSpy.mockRestore();
  });

  it('registerIcons registers multiple icons at once', async () => {
    registerIcons({ 'batch-icon-1': sampleSvg, 'batch-icon-2': sampleSvg });
    const icon = document.createElement('r-icon') as Icon;
    icon.name = 'batch-icon-1';
    document.body.appendChild(icon);
    await sleep(20);
    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl).not.toBeNull();
  });

  it('registerIcon with object having data property', async () => {
    const source = { data: sampleSvg };
    registerIcon('data-icon', source);
    const icon = document.createElement('r-icon') as Icon;
    icon.name = 'data-icon';
    document.body.appendChild(icon);
    await sleep(20);
    expect((icon as any)._shadowDom?.querySelector('svg')).not.toBeNull();
  });

  it('registerIcon with object having default property', async () => {
    const source = { default: sampleSvg };
    registerIcon('default-icon', source);
    const icon = document.createElement('r-icon') as Icon;
    icon.name = 'default-icon';
    document.body.appendChild(icon);
    await sleep(20);
    expect((icon as any)._shadowDom?.querySelector('svg')).not.toBeNull();
  });

  it('registerIcon with nested default.data property', async () => {
    const source = { default: { data: sampleSvg } };
    registerIcon('nested-icon', source);
    const icon = document.createElement('r-icon') as Icon;
    icon.name = 'nested-icon';
    document.body.appendChild(icon);
    await sleep(20);
    expect((icon as any)._shadowDom?.querySelector('svg')).not.toBeNull();
  });

  it('spin setter with false removes spin attribute', async () => {
    const icon = await createIcon('spin-test', sampleSvg);
    icon.spin = true;
    expect(icon.hasAttribute('spin')).toBe(true);
    icon.spin = false;
    expect(icon.hasAttribute('spin')).toBe(false);
  });

  it('syncA11y returns early when no _icon', async () => {
    const icon = await createIcon();
    (icon as any)._icon = undefined;
    expect(() => (icon as any).syncA11y()).not.toThrow();
  });

  it('setIcon renders SVG when name starts with <svg', async () => {
    const icon = document.createElement('r-icon') as Icon;
    document.body.appendChild(icon);
    await sleep(20);
    icon.name = sampleSvg;
    await sleep(20);
    const svgEl = (icon as any)._shadowDom?.querySelector('svg');
    expect(svgEl).not.toBeNull();
  });

  it('_onIconRegistered does nothing when registeredName does not match', async () => {
    const icon = await createIcon('some-icon', sampleSvg);
    const spy = vi.spyOn(icon as any, 'setIcon');
    const event = new CustomEvent('ranui-icon-registered', { detail: { name: 'other-icon' } });
    (icon as any)._onIconRegistered(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('_onIconRegistered does nothing when detail name is undefined', async () => {
    const icon = await createIcon();
    const spy = vi.spyOn(icon as any, 'setIcon');
    const event = new CustomEvent('ranui-icon-registered', { detail: {} });
    (icon as any)._onIconRegistered(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('renderSvg with invalid svg content warns in dev mode', async () => {
    const icon = await createIcon();
    (icon as any).isDev = true;
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (icon as any).renderSvg('not-valid-svg', 'test-icon');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('parse svg failed: test-icon'));
    consoleSpy.mockRestore();
  });

  it('parseSvg returns undefined for non-svg root element', async () => {
    const icon = await createIcon();
    const result = (icon as any).parseSvg('<div>not svg</div>');
    expect(result).toBeUndefined();
  });

  it('parseSvg returns undefined for malformed content', async () => {
    const icon = await createIcon();
    const result = (icon as any).parseSvg('<malformed!!!>');
    expect(result).toBeUndefined();
  });
});
