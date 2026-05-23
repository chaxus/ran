import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dropdown, ARROW_TYPE } from '@/components/dropdown/index';
import '@/components/dropdown/index';

describe('r-dropdown contract', () => {
  const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with correct structure', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    const shadow = (dropdown as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ranui-dropdown-container')).not.toBeNull();
    expect(shadow.querySelector('.ranui-dropdown')).not.toBeNull();
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('creates, updates and removes arrow element from arrow attribute', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    const shadow = (dropdown as any)._shadowDom as ShadowRoot;

    dropdown.arrow = ARROW_TYPE.TOP;
    let arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow).toBeTruthy();
    expect(arrow.classList.contains('top')).toBe(true);

    dropdown.arrow = ARROW_TYPE.LEFT;
    arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow.classList.contains('left')).toBe(true);

    dropdown.arrow = ARROW_TYPE.RIGHT;
    expect(shadow.querySelector('.ranui-dropdown-arrow')?.classList.contains('right')).toBe(true);

    dropdown.arrow = ARROW_TYPE.BOTTOM;
    expect(shadow.querySelector('.ranui-dropdown-arrow')?.classList.contains('bottom')).toBe(true);

    dropdown.arrow = '';
    arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    expect(arrow).toBeFalsy();
  });

  it('transit property reflects to attributes', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    dropdown.transit = 'ran-dropdown-down-in';
    expect(dropdown.getAttribute('transit')).toBe('ran-dropdown-down-in');

    dropdown.transit = '';
    expect(dropdown.hasAttribute('transit')).toBe(false);
  });

  it('handlerTransit adds and removes transit class from dropdown', async () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    dropdown.transit = 'ran-dropdown-down-in';
    dropdown.handlerTransit();

    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-in')).toBe(true);
    await sleep(350);
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-in')).toBe(false);
  });

  it('show property reflects to attributes and getter returns value', () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    dropdown.show = 'true';
    expect(dropdown.getAttribute('show')).toBe('true');
    expect(dropdown.show).toBe('true');

    dropdown.show = '';
    expect(dropdown.hasAttribute('show')).toBe(false);
    expect(dropdown.show).toBe('');
  });

  it('stopPropagation calls event.stopPropagation', () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    const mockEvent = { stopPropagation: vi.fn() };
    dropdown.stopPropagation(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('attributeChangedCallback calls handlerExternalCss on sheet change', () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    const spy = vi.spyOn(dropdown, 'handlerExternalCss');
    dropdown.sheet = '.ranui-dropdown { color: red; }';
    dropdown.attributeChangedCallback('sheet', '', '.ranui-dropdown { color: red; }');
    expect(spy).toHaveBeenCalled();
  });

  it('sheet property reflects to attributes', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    dropdown.sheet = '.ranui-dropdown { background: red; }';
    expect(dropdown.getAttribute('sheet')).toBe('.ranui-dropdown { background: red; }');
  });

  it('dropdown part attribute is set correctly', () => {
    const dropdown = document.createElement('r-dropdown') as Dropdown;
    document.body.appendChild(dropdown);

    const inner = (dropdown as any)._shadowDom.querySelector('.ranui-dropdown') as HTMLElement;
    expect(inner.getAttribute('part')).toBe('dropdown');
  });

  it('attributeChangedCallback calls handlerArrow on arrow change', () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    const arrowSpy = vi.spyOn(dropdown, 'handlerArrow');
    dropdown.setAttribute('arrow', 'top');
    expect(arrowSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback adds transit class to dropdown', () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    dropdown.setAttribute('transit', 'ran-dropdown-down-in');
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-in')).toBe(true);
  });
});
