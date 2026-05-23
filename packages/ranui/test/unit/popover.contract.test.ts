import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Popover } from '@/components/popover/index';
// Ensure custom elements are defined
import '@/components/popover/index';
import '@/components/popover/content/index';

describe('r-popover contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects placement, arrow, and trigger properties to attributes', () => {
    const popover = document.createElement('r-popover') as unknown as Popover;
    document.body.appendChild(popover);

    popover.placement = 'top';
    expect(popover.getAttribute('placement')).toBe('top');

    popover.arrow = 'false';
    expect(popover.getAttribute('arrow')).toBe('false');

    popover.trigger = 'hover';
    expect(popover.getAttribute('trigger')).toBe('hover');
  });

  it('toggles visibility on hover trigger', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.trigger = 'hover';
    popover.innerHTML = `
      <div id="trigger">Hover me</div>
      <r-content>Popover content</r-content>
    `;
    document.body.appendChild(popover);
    await sleep(100);

    const popoverContent = popover.popoverContent as HTMLElement;
    expect(popoverContent).not.toBeUndefined();

    // Initial state: hidden
    expect(popoverContent.style.display).toBe('none');

    // Simulate mouseenter
    popover.dispatchEvent(new MouseEvent('mouseenter'));
    await sleep(100);
    expect(popoverContent.style.display).toBe('block');
    expect(popoverContent.getAttribute('transit')).toBe('ran-dropdown-up-in');

    // Simulate mouseleave
    popover.dispatchEvent(new MouseEvent('mouseleave'));
    await sleep(800); // 16 + 300 + 16 + 300 = 632ms
    expect(popoverContent.style.display).toBe('none');
  });

  it('r-content callback fires onChange on childList mutation', async () => {
    const content = document.createElement('r-content') as any;
    document.body.appendChild(content);

    const changes: Event[] = [];
    content.addEventListener('change', (e: Event) => changes.push(e));

    const child = document.createElement('span');
    child.textContent = 'Hello';
    content.appendChild(child);

    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    expect(changes.length).toBeGreaterThan(0);
    expect((changes[0] as CustomEvent).detail.type).toBe('childList');
  });

  it('r-content callback fires onChange on attribute mutation', async () => {
    const content = document.createElement('r-content') as any;
    document.body.appendChild(content);

    const changes: Event[] = [];
    content.addEventListener('change', (e: Event) => changes.push(e));

    content.setAttribute('data-test', 'value');

    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    expect(changes.length).toBeGreaterThan(0);
    expect((changes[0] as CustomEvent).detail.type).toBe('attributes');
  });

  it('r-content disconnectedCallback disconnects observer', () => {
    const content = document.createElement('r-content') as any;
    document.body.appendChild(content);
    const spy = vi.spyOn(content.observer, 'disconnect');
    document.body.removeChild(content);
    expect(spy).toHaveBeenCalled();
  });

  it('applies arrow direction and anchor sizing variables when shown', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.trigger = 'hover';
    popover.placement = 'top';
    popover.arrow = 'true';
    popover.innerHTML = `
      <div id="trigger">Hover me</div>
      <r-content>Popover content</r-content>
    `;
    document.body.appendChild(popover);
    await sleep(100);

    const popoverContent = popover.popoverContent as HTMLElement;
    popover.dispatchEvent(new MouseEvent('mouseenter'));
    await sleep(120);

    expect(popoverContent.style.display).toBe('block');
    expect(popoverContent.getAttribute('arrow')).toBe('bottom');
    expect(popoverContent.style.getPropertyValue('--ran-dropdown-arrow-anchor-width')).not.toBe('');
    expect(popoverContent.style.getPropertyValue('--ran-dropdown-arrow-anchor-height')).not.toBe('');
  });

  it('arrow getter returns attribute value', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);
    popover.setAttribute('arrow', 'true');
    expect(popover.arrow).toBe('true');
  });

  it('getPopupContainerId getter and setter', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);
    popover.getPopupContainerId = 'my-container';
    expect(popover.getAttribute('getPopupContainerId')).toBe('my-container');
    expect(popover.getPopupContainerId).toBe('my-container');
  });

  it('sheet getter and setter', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);
    popover.sheet = '.ran-popover { color: red; }';
    expect(popover.sheet).toBe('.ran-popover { color: red; }');
  });

  it('closePopover calls setDropdownDisplayNone', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    const spy = vi.spyOn(popover, 'setDropdownDisplayNone');
    popover.closePopover();
    expect(spy).toHaveBeenCalled();
  });

  it('stopPropagation prevents event bubbling', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const event = new MouseEvent('click', { bubbles: true });
    const spy = vi.spyOn(event, 'stopPropagation');
    popover.stopPropagation(event);
    expect(spy).toHaveBeenCalled();
  });

  it('clickContent calls stopPropagation', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const event = new MouseEvent('click', { bubbles: true });
    const spy = vi.spyOn(event, 'stopPropagation');
    popover.clickContent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('clickRemovePopover calls hoverRemovePopover', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const spy = vi.spyOn(popover, 'hoverRemovePopover');
    const event = new MouseEvent('click');
    popover.clickRemovePopover(event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('hoverRemovePopover calls setDropdownDisplayNone', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const spy = vi.spyOn(popover, 'setDropdownDisplayNone');
    const event = new MouseEvent('click');
    popover.hoverRemovePopover(event);
    expect(spy).toHaveBeenCalled();
  });

  it('watchContent calls createContent with event detail', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content><span>Hi</span></r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    const spy = vi.spyOn(popover, 'createContent');
    const fakeContent = document.createElement('div');
    const event = new CustomEvent('change', {
      detail: { value: { content: fakeContent.children } },
    });
    popover.watchContent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('createContent populates popoverContent with children', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content><span>Hello</span><span>World</span></r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    const container = document.createElement('div');
    container.innerHTML = '<span>A</span><span>B</span>';
    popover.createContent(container.children);
    expect(popover.popoverContent).not.toBeNull();
  });

  it('attributeChangedCallback sheet calls handlerExternalCss', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const spy = vi.spyOn(popover, 'handlerExternalCss');
    popover.attributeChangedCallback('sheet', '', '.ran-popover { color: blue; }');
    expect(spy).toHaveBeenCalled();
  });

  it('attributeChangedCallback placement calls changePlacement', () => {
    const popover = document.createElement('r-popover') as any;
    document.body.appendChild(popover);

    const spy = vi.spyOn(popover, 'changePlacement');
    popover.attributeChangedCallback('placement', 'top', 'bottom');
    expect(spy).toHaveBeenCalled();
  });

  it('changePlacement sets arrow=right when placement is left', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    popover.placement = 'left';
    popover.changePlacement();
    await sleep(100);
    expect(popover.popoverContent?.getAttribute('arrow')).toBe('right');
  });

  it('changePlacement sets arrow=left when placement is right', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    popover.placement = 'right';
    popover.changePlacement();
    await sleep(100);
    expect(popover.popoverContent?.getAttribute('arrow')).toBe('left');
  });

  it('placementPosition handles placement=left', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.placement = 'left';
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    expect(() => popover.placementPosition()).not.toThrow();
  });

  it('placementPosition handles placement=right', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.placement = 'right';
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    expect(() => popover.placementPosition()).not.toThrow();
  });

  it('changePlacement sets arrow=top when placement is bottom', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    popover.placement = 'bottom';
    popover.changePlacement();
    await sleep(100);
    expect(popover.popoverContent?.getAttribute('arrow')).toBe('top');
  });

  it('placementPosition with getPopupContainerId and container element', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const containerId = 'test-popover-container-001';
    const container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);

    const popover = document.createElement('r-popover') as any;
    popover.innerHTML = `<r-content>Content</r-content>`;
    popover.setAttribute('getPopupContainerId', containerId);
    popover.placement = 'top';
    document.body.appendChild(popover);
    await sleep(100);

    expect(() => popover.placementPosition()).not.toThrow();
  });
});
