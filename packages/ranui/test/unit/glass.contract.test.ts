import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Glass } from '@/components/glass';
import '@/components/glass';

describe('r-glass contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with correct structure', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    const shadow = (glass as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-glass')).not.toBeNull();
    expect(shadow.querySelector('.ran-glass-specular')).not.toBeNull();
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('injects exactly one SVG displacement filter, even across repeated connects', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);
    document.body.removeChild(glass);
    document.body.appendChild(glass);

    const shadow = (glass as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelectorAll('.ran-glass-defs').length).toBe(1);
    expect(shadow.querySelectorAll('feDisplacementMap').length).toBe(1);
  });

  it('blur/saturate/radius reflect to CSS custom properties with units', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    glass.setAttribute('blur', '24');
    expect(glass.style.getPropertyValue('--ran-glass-blur')).toBe('24px');

    glass.saturate = '150';
    expect(glass.style.getPropertyValue('--ran-glass-saturate')).toBe('150%');

    glass.radius = '12';
    expect(glass.style.getPropertyValue('--ran-glass-radius')).toBe('12px');
  });

  it('tint reflects verbatim, without a unit appended', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    glass.tint = 'rgba(0,0,0,0.2)';
    expect(glass.style.getPropertyValue('--ran-glass-tint')).toBe('rgba(0,0,0,0.2)');
  });

  it('removing an attribute clears its custom property', () => {
    const glass = document.createElement('r-glass') as Glass;
    glass.setAttribute('blur', '24');
    document.body.appendChild(glass);
    expect(glass.style.getPropertyValue('--ran-glass-blur')).toBe('24px');

    glass.removeAttribute('blur');
    expect(glass.style.getPropertyValue('--ran-glass-blur')).toBe('');
  });

  it('displace/frequency drive the SVG filter primitives, not a CSS variable', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    glass.displace = '20';
    glass.frequency = '0.01';

    const shadow = (glass as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('feDisplacementMap')?.getAttribute('scale')).toBe('20');
    expect(shadow.querySelector('feTurbulence')?.getAttribute('baseFrequency')).toBe('0.01');
  });

  it('sheen and interactive are plain boolean attributes', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    expect(glass.sheen).toBe(false);
    glass.sheen = true;
    expect(glass.hasAttribute('sheen')).toBe(true);

    glass.interactive = true;
    expect(glass.hasAttribute('interactive')).toBe(true);
    glass.interactive = false;
    expect(glass.hasAttribute('interactive')).toBe(false);
  });

  it('interactive adds role="button" and a tab stop; a plain panel stays out of the tab order', () => {
    const interactive = document.createElement('r-glass') as Glass;
    interactive.setAttribute('interactive', '');
    document.body.appendChild(interactive);
    expect(interactive.getAttribute('role')).toBe('button');
    expect(interactive.tabIndex).toBe(0);

    const plain = document.createElement('r-glass') as Glass;
    document.body.appendChild(plain);
    expect(plain.hasAttribute('role')).toBe(false);
    expect(plain.hasAttribute('tabindex')).toBe(false);
  });

  it('removes the tabindex/role it added itself when interactive is removed, but never touches a consumer-set tabindex', () => {
    const glass = document.createElement('r-glass') as Glass;
    glass.setAttribute('interactive', '');
    document.body.appendChild(glass);
    expect(glass.hasAttribute('tabindex')).toBe(true);

    glass.removeAttribute('interactive');
    expect(glass.hasAttribute('tabindex')).toBe(false);
    expect(glass.hasAttribute('role')).toBe(false);

    const withOwnTabindex = document.createElement('r-glass') as Glass;
    withOwnTabindex.setAttribute('tabindex', '-1');
    withOwnTabindex.setAttribute('interactive', '');
    document.body.appendChild(withOwnTabindex);
    withOwnTabindex.removeAttribute('interactive');
    expect(withOwnTabindex.getAttribute('tabindex')).toBe('-1');
  });

  it('Enter/Space dispatch a click when interactive, matching a native button', () => {
    const glass = document.createElement('r-glass') as Glass;
    glass.setAttribute('interactive', '');
    document.body.appendChild(glass);

    const onClick = vi.fn();
    glass.addEventListener('click', onClick);
    glass.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);

    glass.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('Enter/Space do nothing when not interactive', () => {
    const glass = document.createElement('r-glass') as Glass;
    document.body.appendChild(glass);

    const onClick = vi.fn();
    glass.addEventListener('click', onClick);
    glass.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new value', () => {
    const glass = document.createElement('r-glass') as any;
    document.body.appendChild(glass);

    const applySpy = vi.spyOn(glass, '_apply');
    glass.attributeChangedCallback('blur', '10', '10');
    expect(applySpy).not.toHaveBeenCalled();
  });

  it('disconnectedCallback removes listeners without error', () => {
    const glass = document.createElement('r-glass') as Glass;
    glass.setAttribute('interactive', '');
    document.body.appendChild(glass);
    expect(() => document.body.removeChild(glass)).not.toThrow();
  });
});
