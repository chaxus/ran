import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Popover } from '@/components/popover/index';
// Ensure custom elements are defined
import '@/components/popover/index';
import '@/components/popover/content/index';

/**
 * Record every value the `transit` attribute takes on an element.
 *
 * The class is on the panel only while the animation runs, and jsdom animates
 * nothing, so it is put on and taken off again within a frame or two. Asserting
 * it is still there after a fixed wait would be asserting the old behaviour: a
 * 300ms timer that expired on its own. What is worth checking is the value it
 * took -- the direction -- which a recorder catches however briefly it was set.
 */
const recordTransit = (el: Element): string[] => {
  const seen: string[] = [];
  const note = (value: string | null): void => {
    if (value && !seen.includes(value)) seen.push(value);
  };
  const observer = new MutationObserver((records) => {
    // `oldValue`, not just the current value: with no animation to wait for the
    // class is put on and taken off inside one synchronous block, so by the time
    // this callback runs the attribute is already back to null. The value it
    // held is only recoverable from the record.
    for (const record of records) note(record.oldValue);
    note(el.getAttribute('transit'));
  });
  observer.observe(el, { attributes: true, attributeFilter: ['transit'], attributeOldValue: true });
  return seen;
};

describe('r-popover contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects placement and trigger properties to attributes', () => {
    const popover = document.createElement('r-popover') as unknown as Popover;
    document.body.appendChild(popover);

    popover.placement = 'top';
    expect(popover.getAttribute('placement')).toBe('top');

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
    const transits = recordTransit(popoverContent);
    popover.dispatchEvent(new MouseEvent('mouseenter'));
    await sleep(100);
    expect(popoverContent.style.display).toBe('block');
    expect(transits).toContain('ran-dropdown-up-in');

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

  // Regression: `.left`/`.right` in dropdown/index.less position the arrow as an
  // offset from the *panel's top edge*, which only points at the trigger's
  // center when the panel's top edge is flush with the trigger's top edge.
  // computePlacement's boundary shift (trigger near a viewport edge) breaks
  // that assumption — the panel moves vertically but nothing told the arrow —
  // so `placementPosition` must feed the real top-to-top delta back in via
  // `--ran-dropdown-arrow-anchor-offset-y`, the same way it already does for
  // the X axis on top/bottom via `--ran-dropdown-arrow-anchor-offset`.
  it('placement=left/right feeds a Y-axis correction when the panel top drifts from the trigger top', async () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));
    const popover = document.createElement('r-popover') as any;
    popover.placement = 'right';
    popover.innerHTML = `<div id="trigger">Trigger</div><r-content>Content</r-content>`;
    document.body.appendChild(popover);
    await sleep(100);

    const trigger = popover.querySelector('#trigger') as HTMLElement;
    trigger.getBoundingClientRect = () =>
      ({ top: 780, left: 400, width: 40, height: 40, bottom: 820, right: 440 }) as DOMRect;
    // Simulates a boundary-clamped panel: its real top (600) no longer matches
    // the trigger's top (780) — exactly the case `.left`/`.right`'s formula
    // otherwise has no way to know about.
    popover.popoverContent.getBoundingClientRect = () =>
      ({ top: 600, left: 500, width: 150, height: 200, bottom: 800, right: 650 }) as DOMRect;

    popover.placementPosition();

    expect(popover.popoverContent.style.getPropertyValue('--ran-dropdown-arrow-anchor-offset-y')).toBe('180px');
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
  // ── Cross-axis alignment (`placement="bottom-end"` and friends) ──────────
  //
  // The suffix is new; the bare form is not. Everything inside this component
  // that keys a four-entry table off `placement` -- the transit animation, the
  // arrow direction, the custom-container coordinate branch -- has to read the
  // side alone, or a suffixed placement lands on `undefined` and takes the
  // panel's animation and arrow with it.
  describe('cross-axis alignment', () => {
    const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));

    /** A popover whose trigger and panel report fixed rects (jsdom lays out nothing). */
    const mountMeasured = async (placement: string, containerId?: string) => {
      const popover = document.createElement('r-popover') as any;
      popover.placement = placement;
      if (containerId) popover.setAttribute('getPopupContainerId', containerId);
      popover.innerHTML = `<div id="trigger">Trigger</div><r-content>Content</r-content>`;
      document.body.appendChild(popover);
      await sleep(100);

      const trigger = popover.querySelector('#trigger') as HTMLElement;
      trigger.getBoundingClientRect = () =>
        ({ top: 100, left: 500, width: 120, height: 40, bottom: 140, right: 620 }) as DOMRect;
      popover.popoverContent.getBoundingClientRect = () =>
        ({ top: 0, left: 0, width: 200, height: 150, bottom: 150, right: 200 }) as DOMRect;
      return popover;
    };

    it("pins the panel to the trigger's trailing edge for `-end`, and to its leading edge without a suffix", async () => {
      const start = await mountMeasured('bottom');
      start.placementPosition();
      expect(start.popoverContent.style.getPropertyValue('--ran-x')).toBe('500px');

      const end = await mountMeasured('bottom-end');
      end.placementPosition();
      // Trigger's right edge is 620; a 200px panel ending there starts at 420.
      expect(end.popoverContent.style.getPropertyValue('--ran-x')).toBe('420px');
    });

    it('centres the panel on the trigger for `-center`', async () => {
      const popover = await mountMeasured('bottom-center');
      popover.placementPosition();
      // 500 + (120 - 200) / 2
      expect(popover.popoverContent.style.getPropertyValue('--ran-x')).toBe('460px');
    });

    it('aligns on the vertical axis for a left/right placement', async () => {
      // Sat further down the viewport than the shared rect: `-end` against a
      // trigger 100px from the top would put the panel above the viewport, and
      // the boundary shift -- correctly -- pulls it back, which measures the
      // clamp rather than the alignment.
      const lowerTrigger = (popover: any) => {
        (popover.querySelector('#trigger') as HTMLElement).getBoundingClientRect = () =>
          ({ top: 300, left: 500, width: 120, height: 40, bottom: 340, right: 620 }) as DOMRect;
      };

      const start = await mountMeasured('right');
      lowerTrigger(start);
      start.placementPosition();
      expect(start.popoverContent.style.getPropertyValue('--ran-y')).toBe('300px');

      const end = await mountMeasured('right-end');
      lowerTrigger(end);
      end.placementPosition();
      // Trigger's bottom edge is 340; a 150px panel ending there starts at 190.
      expect(end.popoverContent.style.getPropertyValue('--ran-y')).toBe('190px');
      // The cross axis moved; the main axis did not.
      expect(end.popoverContent.style.getPropertyValue('--ran-x')).toBe(
        start.popoverContent.style.getPropertyValue('--ran-x'),
      );
    });

    it('still points the arrow at the trigger when the placement carries a suffix', async () => {
      const popover = await mountMeasured('bottom-end');
      popover.changePlacement();
      await sleep(100);
      // `oppositeSide` has four entries and no 'bottom-end' — reading the whole
      // attribute here yields undefined and leaves the arrow on whatever side
      // it last had.
      expect(popover.popoverContent?.getAttribute('arrow')).toBe('top');
    });

    it('still animates in from the side when the placement carries a suffix', async () => {
      const popover = await mountMeasured('bottom-end');
      // `ran-dropdown-down-end` is not a class anyone defines; reading the whole
      // attribute for this lookup would land on `undefined` and take the panel's
      // animation with it.
      const transits = recordTransit(popover.popoverContent);
      popover.setDropdownDisplayBlock();
      await sleep(60);
      expect(transits).toContain('ran-dropdown-down-in');
    });

    it('aligns inside a custom container too, not only in the body portal', async () => {
      const containerId = 'test-popover-container-align';
      const container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
      container.getBoundingClientRect = () =>
        ({ top: 50, left: 100, width: 800, height: 600, bottom: 650, right: 900 }) as DOMRect;

      const popover = await mountMeasured('bottom-end', containerId);
      popover.placementPosition();
      // Same 420 as the portal branch, expressed relative to the container's
      // own left edge (100).
      expect(popover.popoverContent.style.getPropertyValue('--ran-x')).toBe('320px');
    });
  });
});
