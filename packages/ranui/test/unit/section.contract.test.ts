import { describe, expect, it, beforeEach } from 'vitest';
import type { Section } from '@/components/section';
import '@/components/section';

describe('r-section contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with header (heading + subtitle) and a slotted body', () => {
    const section = document.createElement('r-section') as unknown as Section;
    document.body.appendChild(section);

    const shadow = (section as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const header = shadow.querySelector('.ran-section-header');
    expect(header).not.toBeNull();
    expect(header?.getAttribute('part')).toBe('header');

    const heading = shadow.querySelector('.ran-section-heading');
    expect(heading).not.toBeNull();
    expect(heading?.getAttribute('part')).toBe('heading');
    expect(heading?.getAttribute('role')).toBe('heading');
    expect(heading?.getAttribute('aria-level')).toBe('2');

    const subtitle = shadow.querySelector('.ran-section-subtitle');
    expect(subtitle).not.toBeNull();
    expect(subtitle?.getAttribute('part')).toBe('subtitle');

    const body = shadow.querySelector('.ran-section-body');
    expect(body).not.toBeNull();
    expect(body?.getAttribute('part')).toBe('body');
    expect(body?.querySelector('slot')).not.toBeNull();
  });

  it('header is hidden when neither heading nor subtitle is set', () => {
    const section = document.createElement('r-section') as any;
    document.body.appendChild(section);
    expect(section._headerEl.style.display).toBe('none');
  });

  it('heading property reflects to the attribute and the header text', () => {
    const section = document.createElement('r-section') as unknown as Section;
    document.body.appendChild(section);

    section.heading = 'Getting started';
    expect(section.getAttribute('heading')).toBe('Getting started');
    expect((section as any)._headingEl.textContent).toBe('Getting started');
  });

  it('subtitle property reflects to the attribute and the subtitle text', () => {
    const section = document.createElement('r-section') as unknown as Section;
    document.body.appendChild(section);

    section.subtitle = 'A short description';
    expect(section.getAttribute('subtitle')).toBe('A short description');
    expect((section as any)._subtitleEl.textContent).toBe('A short description');
  });

  it('header becomes visible once either heading or subtitle is set, and hides again when both are cleared', () => {
    const section = document.createElement('r-section') as any;
    document.body.appendChild(section);
    expect(section._headerEl.style.display).toBe('none');

    section.setAttribute('heading', 'Title');
    expect(section._headerEl.style.display).toBe('');

    section.removeAttribute('heading');
    // _syncHeading runs on the 'heading' change and re-checks subtitle too;
    // with subtitle still empty the header should hide again.
    expect(section._headerEl.style.display).toBe('none');

    section.setAttribute('subtitle', 'Sub only');
    expect(section._headerEl.style.display).toBe('');
  });

  it('sheet property reflects to attribute', () => {
    const section = document.createElement('r-section') as unknown as Section;
    document.body.appendChild(section);

    section.sheet = '.ran-section-header { color: red; }';
    expect(section.getAttribute('sheet')).toBe('.ran-section-header { color: red; }');
    expect(section.sheet).toBe('.ran-section-header { color: red; }');
  });

  it('attributeChangedCallback skips when old and new value are the same', () => {
    const section = document.createElement('r-section') as any;
    document.body.appendChild(section);
    section._headingEl.textContent = 'untouched';

    section.attributeChangedCallback('heading', 'same', 'same');
    expect(section._headingEl.textContent).toBe('untouched');
  });

  it('disconnectedCallback does not throw', () => {
    const section = document.createElement('r-section') as unknown as Section;
    document.body.appendChild(section);
    expect(() => document.body.removeChild(section)).not.toThrow();
  });
});
