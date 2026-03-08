import { describe, expect, it, beforeEach } from 'vitest';
import { Icon, registerIcon } from '@/components/icon/index';
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
});
