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

  // Replaces a case that asserted the class disappeared on its own after 300ms.
  // That timer was a fourth copy of a duration the stylesheet owns, and it took
  // off `this.transit` as read at that moment rather than the class it had put
  // on — change direction inside the window and it removed the new class while
  // the old one stayed forever, leaving a panel with both `-in` and `-out`
  // applied. The class now lives exactly as long as the attribute does, and the
  // caller that set it decides when the animation is over.
  it('mirrors the transit attribute onto the panel, and takes the old class off', async () => {
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);

    dropdown.transit = 'ran-dropdown-down-in';
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-in')).toBe(true);

    // Reversing direction must not leave the first class behind.
    dropdown.transit = 'ran-dropdown-down-out';
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-in')).toBe(false);
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-out')).toBe(true);

    // And it stays until the attribute goes, rather than expiring on a timer.
    await sleep(350);
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-out')).toBe(true);

    dropdown.removeAttribute('transit');
    expect(dropdown.dropdown.classList.contains('ran-dropdown-down-out')).toBe(false);
  });

  it('exposes the element its animations run on', () => {
    // They run on a class inside the shadow root, so `getAnimations()` on the
    // host reports nothing and `{ subtree: true }` does not cross the boundary.
    // Anything waiting for the panel's transition asks for this instead of
    // reaching through the shadow tree for a class name.
    const dropdown = document.createElement('r-dropdown') as any;
    document.body.appendChild(dropdown);
    expect(dropdown.getAnimationTarget()).toBe(dropdown.dropdown);
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
