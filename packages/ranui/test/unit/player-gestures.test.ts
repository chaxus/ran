import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachGestureHandlers, type PlayerGestureDeps } from '@/components/player/core/gestures';
import '@/components/player';

const makeContainerRect = (container: HTMLElement, width = 300, height = 150): void => {
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect);
};

const pointer = (
  type: string,
  init: Partial<PointerEventInit> & { pointerId?: number; clientX?: number; clientY?: number },
): PointerEvent => new PointerEvent(type, { pointerId: 1, pointerType: 'touch', bubbles: true, ...init });

const makeDeps = (): { deps: PlayerGestureDeps; container: HTMLElement; flash: HTMLElement } => {
  const container = document.createElement('div');
  const flash = document.createElement('div');
  document.body.appendChild(container);
  makeContainerRect(container);
  let currentTime = 20;
  let volume = 50;
  const deps: PlayerGestureDeps = {
    refs: { container, gestureFlash: flash },
    getCurrentTime: () => currentTime,
    getTotalTime: () => 100,
    setCurrentTime: vi.fn((n: number) => {
      currentTime = n;
      return n;
    }),
    getVolume: () => volume,
    setVolume: vi.fn((n: number) => {
      volume = n;
      return n;
    }),
    change: vi.fn(),
    onSingleTap: vi.fn(),
  };
  return { deps, container, flash };
};

describe('core/gestures attachGestureHandlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('ignores non-touch pointers entirely (mouse click behavior stays unchanged)', () => {
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);
    const preventDefault = vi.fn();
    const e = new PointerEvent('pointerdown', { pointerId: 1, pointerType: 'mouse', clientX: 250, clientY: 75 });
    Object.defineProperty(e, 'preventDefault', { value: preventDefault });
    container.dispatchEvent(e);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('calls onSingleTap after the double-tap window when only one tap occurs', async () => {
    vi.useFakeTimers();
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 75 }));
    expect(deps.onSingleTap).not.toHaveBeenCalled();

    vi.advanceTimersByTime(310);
    expect(deps.onSingleTap).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('seeks forward on the right half on a double tap and never fires the single-tap toggle', () => {
    vi.useFakeTimers();
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerdown', { clientX: 252, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 252, clientY: 75 }));

    expect(deps.setCurrentTime).toHaveBeenCalledWith(30);
    expect(deps.change).toHaveBeenCalledWith('gestureseek', { direction: 'forward', seconds: 10 });
    vi.advanceTimersByTime(400);
    expect(deps.onSingleTap).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('seeks backward on the left half on a double tap', () => {
    vi.useFakeTimers();
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 50, clientY: 75 }));
    container.dispatchEvent(pointer('pointerdown', { clientX: 52, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 52, clientY: 75 }));

    expect(deps.setCurrentTime).toHaveBeenCalledWith(10);
    expect(deps.change).toHaveBeenCalledWith('gestureseek', { direction: 'backward', seconds: 10 });
    vi.useRealTimers();
  });

  it('shows and then hides the gesture flash on a double-tap seek', () => {
    vi.useFakeTimers();
    const { deps, container, flash } = makeDeps();
    attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerdown', { clientX: 252, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 252, clientY: 75 }));

    expect(flash.textContent).toBe('+10s');
    expect(flash.classList.contains('ran-player-gesture-flash-visible')).toBe(true);
    vi.advanceTimersByTime(600);
    expect(flash.classList.contains('ran-player-gesture-flash-visible')).toBe(false);
    vi.useRealTimers();
  });

  it('adjusts volume on a vertical swipe starting on the right half', () => {
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);
    container.setPointerCapture = vi.fn();

    container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 100 }));
    container.dispatchEvent(pointer('pointermove', { clientX: 250, clientY: 70 })); // dy=-30 -> volume up
    container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 70 }));

    expect(deps.setVolume).toHaveBeenCalled();
    const lastCall = (deps.setVolume as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[0];
    expect(lastCall).toBeGreaterThan(50);
    // A swipe must never be interpreted as a tap.
    expect(deps.onSingleTap).not.toHaveBeenCalled();
  });

  it('does not start a volume swipe on the left half', () => {
    const { deps, container } = makeDeps();
    attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 100 }));
    container.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 40 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 50, clientY: 40 }));

    expect(deps.setVolume).not.toHaveBeenCalled();
  });

  it('destroy() clears pending timers so a late single tap never fires', () => {
    vi.useFakeTimers();
    const { deps, container } = makeDeps();
    const controller = attachGestureHandlers(deps);

    container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 75 }));
    container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 75 }));
    controller.destroy();
    vi.advanceTimersByTime(1000);

    expect(deps.onSingleTap).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe('r-player gesture wiring', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('attaches gestures on connect and toggles play/pause on a single touch tap', () => {
    vi.useFakeTimers();
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    player.listenEvent();
    makeContainerRect(player._container);

    const toggleSpy = vi.spyOn(player, 'dispatchClickPlayerContainerAction');
    player._container.dispatchEvent(pointer('pointerdown', { clientX: 250, clientY: 75 }));
    player._container.dispatchEvent(pointer('pointerup', { clientX: 250, clientY: 75 }));
    vi.advanceTimersByTime(310);

    expect(toggleSpy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('destroys the gesture controller on disconnect', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const destroySpy = vi.spyOn(player._gestures, 'destroy');

    player.remove();

    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(player._gestures).toBeUndefined();
  });
});
