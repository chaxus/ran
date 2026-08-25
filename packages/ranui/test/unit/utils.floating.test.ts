import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FloatingController } from '@/utils/floating';

/**
 * The controller r-select and r-popover both position through.
 *
 * jsdom lays nothing out, so the geometry is exercised where it belongs — in
 * `computePlacement`'s own tests, and in the browser through each component's
 * e2e specs. What is worth pinning here is the part that is pure state: that
 * `apply` is the single writer of display and `aria-expanded`, that the four
 * lifecycle events fire in order, and that a transition already in flight
 * cannot reach back and undo the one that replaced it.
 */
const mount = (): { host: HTMLElement; panel: HTMLElement } => {
  const host = document.createElement('div');
  const panel = document.createElement('div');
  panel.style.setProperty('display', 'none');
  document.body.append(host, panel);
  return { host, panel };
};

const controllerFor = (host: HTMLElement, panel: HTMLElement, extra = {}): FloatingController =>
  new FloatingController({
    host,
    panel: () => panel,
    placement: () => 'bottom',
    offset: 4,
    ...extra,
  });

describe('FloatingController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('is the only writer of display and aria-expanded, and they agree', () => {
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);

    controller.apply(true);
    expect(panel.style.display).toBe('block');
    expect(host.getAttribute('aria-expanded')).toBe('true');

    controller.apply(false);
    expect(panel.style.display).toBe('none');
    expect(host.getAttribute('aria-expanded')).toBe('false');
  });

  it('fires show then after-show on open, and hide then after-hide on close', () => {
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);
    const seen: string[] = [];
    for (const name of ['show', 'after-show', 'hide', 'after-hide']) {
      host.addEventListener(name, () => seen.push(name));
    }

    controller.apply(true);
    controller.apply(false);
    expect(seen).toEqual(['show', 'after-show', 'hide', 'after-hide']);
  });

  it('announces the state before the panel finishes animating into it', () => {
    // `show` is the intent, `after-show` the arrival. Assistive tech should not
    // have to wait out an animation to be told what happened, which is why
    // aria-expanded is written up front rather than in the tail.
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);
    let ariaAtShow: string | null = null;
    host.addEventListener('show', () => {
      ariaAtShow = host.getAttribute('aria-expanded');
    });

    controller.apply(true);
    expect(ariaAtShow).toBe('true');
  });

  it('lets a re-open cancel the close that was still finishing', () => {
    // The close's tail hides the panel. Without the generation check it would
    // run anyway and hide a panel that had since been re-opened — the same
    // class of bug as the swallowed click, one layer down.
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);
    const afterHide = vi.fn();
    host.addEventListener('after-hide', afterHide);

    controller.apply(true);
    controller.apply(false);
    controller.apply(true);

    expect(panel.style.display).toBe('block');
    // The superseded close must not report completion either.
    expect(afterHide).toHaveBeenCalledTimes(1);
  });

  it('closing an already-closed panel is a no-op, not a second hide', () => {
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);
    const hide = vi.fn();
    host.addEventListener('hide', hide);

    controller.apply(false);
    expect(hide).not.toHaveBeenCalled();
    expect(panel.style.display).toBe('none');
  });

  it('still reports the state when there is no panel yet', () => {
    // Components build their panel lazily; the attribute can be set first.
    const host = document.createElement('div');
    document.body.appendChild(host);
    const controller = new FloatingController({ host, panel: () => null, placement: () => 'bottom' });

    controller.apply(true);
    expect(host.getAttribute('aria-expanded')).toBe('true');
  });

  it('positions against the anchor when one is given rather than the host', () => {
    const { host, panel } = mount();
    const anchor = document.createElement('div');
    document.body.appendChild(anchor);
    anchor.getBoundingClientRect = () =>
      ({ top: 100, left: 200, width: 50, height: 20, bottom: 120, right: 250 }) as DOMRect;

    const controller = controllerFor(host, panel, { anchor: () => anchor });
    controller.apply(true);
    controller.position();

    // bottom placement, 4px offset: 120 + 4. Left edges align.
    expect(panel.style.getPropertyValue('--ran-y')).toBe('124px');
    expect(panel.style.getPropertyValue('--ran-x')).toBe('200px');
  });

  it('aligns to the anchor inside a custom container too', () => {
    const { host, panel } = mount();
    const container = document.createElement('div');
    container.id = 'floating-container';
    document.body.appendChild(container);
    container.getBoundingClientRect = () =>
      ({ top: 10, left: 20, width: 500, height: 400, bottom: 410, right: 520 }) as DOMRect;
    host.getBoundingClientRect = () =>
      ({ top: 100, left: 200, width: 50, height: 20, bottom: 120, right: 250 }) as DOMRect;
    panel.getBoundingClientRect = () =>
      ({ top: 0, left: 0, width: 120, height: 60, bottom: 60, right: 120 }) as DOMRect;

    const controller = controllerFor(host, panel, {
      containerId: () => 'floating-container',
      placement: () => 'bottom-end',
    });
    controller.apply(true);
    controller.position();

    // Trailing edges together: anchor ends at 250, a 120px panel starts at 130,
    // expressed relative to the container's own left edge (20).
    expect(panel.style.getPropertyValue('--ran-x')).toBe('110px');
    expect(panel.style.getPropertyValue('--ran-y')).toBe('114px');
  });

  it('positions against the measured panel size when the host box understates it', () => {
    // r-select pins the panel host's width to the trigger's; a consumer can make
    // the panel inside wider, and that overflow is invisible to the host's rect.
    const { host, panel } = mount();
    host.getBoundingClientRect = () =>
      ({ top: 100, left: 200, width: 50, height: 20, bottom: 120, right: 250 }) as DOMRect;
    panel.getBoundingClientRect = () => ({ top: 0, left: 0, width: 50, height: 60, bottom: 60, right: 50 }) as DOMRect;

    const controller = controllerFor(host, panel, {
      containerId: () => '',
      placement: () => 'bottom-end',
      measurePanel: () => ({ width: 200, height: 60 }),
    });
    controller.apply(true);
    controller.position();

    // Aligned against 200px, not the 50px the host box reports: 250 - 200.
    expect(panel.style.getPropertyValue('--ran-x')).toBe('50px');
  });

  it('follows the anchor while open and stops when closed or destroyed', () => {
    const { host, panel } = mount();
    const controller = controllerFor(host, panel);
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');

    controller.apply(true);
    expect(add.mock.calls.some((c) => c[0] === 'scroll')).toBe(true);
    expect(add.mock.calls.some((c) => c[0] === 'resize')).toBe(true);

    controller.apply(false);
    expect(remove.mock.calls.some((c) => c[0] === 'scroll')).toBe(true);

    remove.mockClear();
    controller.apply(true);
    controller.destroy();
    expect(remove.mock.calls.some((c) => c[0] === 'scroll')).toBe(true);

    add.mockRestore();
    remove.mockRestore();
  });

  it('hands the hooks the resolved side and alignment', () => {
    const { host, panel } = mount();
    const afterPosition = vi.fn();
    const beforeMeasure = vi.fn();
    const controller = controllerFor(host, panel, {
      placement: () => 'top-center',
      beforeMeasure,
      afterPosition,
    });

    controller.apply(true);
    controller.position();

    expect(beforeMeasure).toHaveBeenCalled();
    const position = afterPosition.mock.calls.at(-1)?.[0];
    expect(position.side).toBe('top');
    expect(position.align).toBe('center');
  });
});
