import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/skeleton';

describe('r-skeleton contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with .ran-skeleton container', () => {
    const skeleton = document.createElement('r-skeleton');
    document.body.appendChild(skeleton);

    const shadow = (skeleton as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-skeleton')).not.toBeNull();
  });

  it('sheet property reflects to attribute', () => {
    const skeleton = document.createElement('r-skeleton');
    document.body.appendChild(skeleton);

    skeleton.setAttribute('sheet', '.ran-skeleton { background: red; }');
    expect(skeleton.getAttribute('sheet')).toBe('.ran-skeleton { background: red; }');
  });

  it('sheet getter returns empty string when not set', () => {
    const skeleton = document.createElement('r-skeleton');
    document.body.appendChild(skeleton);
    expect((skeleton as any).sheet).toBe('');
  });

  it('sheet setter updates attribute', () => {
    const skeleton = document.createElement('r-skeleton');
    document.body.appendChild(skeleton);

    (skeleton as any).sheet = '.ran-skeleton { opacity: 0.5; }';
    expect(skeleton.getAttribute('sheet')).toBe('.ran-skeleton { opacity: 0.5; }');
  });

  it('sheet setter with empty string sets empty attribute', () => {
    const skeleton = document.createElement('r-skeleton');
    document.body.appendChild(skeleton);

    (skeleton as any).sheet = '';
    // empty string → setAttribute with ''
    expect(skeleton.getAttribute('sheet')).toBe('');
  });

  it('attributeChangedCallback triggers external CSS on sheet change', () => {
    const skeleton = document.createElement('r-skeleton') as any;
    document.body.appendChild(skeleton);

    const cssSpy = vi.spyOn(skeleton, 'handlerExternalCss');
    skeleton.setAttribute('sheet', '.ran-skeleton { color: blue; }');
    expect(cssSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new', () => {
    const skeleton = document.createElement('r-skeleton') as any;
    document.body.appendChild(skeleton);

    const cssSpy = vi.spyOn(skeleton, 'handlerExternalCss');
    skeleton.setAttribute('sheet', 'same');
    cssSpy.mockClear();
    // trigger with same value manually
    skeleton.attributeChangedCallback('sheet', 'same', 'same');
    expect(cssSpy).not.toHaveBeenCalled();
  });

  it('connectedCallback runs handlerExternalCss', () => {
    const skeleton = document.createElement('r-skeleton') as any;
    const cssSpy = vi.spyOn(skeleton, 'handlerExternalCss');
    document.body.appendChild(skeleton); // triggers connectedCallback
    expect(cssSpy).toHaveBeenCalled();
  });
});
