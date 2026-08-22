import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

/**
 * A player with the geometry the scrub maths needs.
 *
 * jsdom lays nothing out, so the progress bar's width and origin are supplied directly;
 * everything under test is arithmetic over those two numbers plus the pointer's clientX.
 *
 * @param options Whether the video should look like it is playing.
 * @returns The player element.
 */
function makePlayer({ playing = false } = {}): any {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
  Object.defineProperty(player._video, 'paused', { value: !playing, configurable: true });
  Object.defineProperty(player._video, 'ended', { value: false, configurable: true });
  Object.defineProperty(player._progress, 'offsetWidth', { value: 200, configurable: true });
  player._progress.getBoundingClientRect = vi.fn(() => ({ left: 0 }) as DOMRect);
  vi.spyOn(player._video, 'play').mockReturnValue(Promise.resolve() as any);
  player.ctx.duration = 100;
  return player;
}

/**
 * Dispatches one pointer event.
 *
 * @param target Where to dispatch.
 * @param type Event type.
 * @param init Pointer init, including `pointerType` and `clientX`.
 * @returns The dispatched event, so a caller can inspect `defaultPrevented`.
 */
function pointer(target: EventTarget, type: string, init: PointerEventInit = {}): PointerEvent {
  const event = new PointerEvent(type, { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
}

describe('r-player scrubbing works with touch, not only a mouse', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scrubs through a whole touch drag', () => {
    const player = makePlayer();

    // The bug this replaces: these three events produced nothing at all, because the drag
    // was bound to mousedown/mousemove/mouseup, which a touch never fires.
    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch', pointerId: 1 });
    expect(player.moveProgress.mouseDown).toBe(true);

    pointer(document, 'pointermove', { pointerType: 'touch', pointerId: 1, clientX: 109 });
    pointer(document, 'pointerup', { pointerType: 'touch', pointerId: 1 });

    expect(player.moveProgress.mouseDown).toBe(false);
    expect(player._video.currentTime).toBe(50);
  });

  it('scrubs with a pen the same way', () => {
    const player = makePlayer();
    pointer(player._progressDot, 'pointerdown', { pointerType: 'pen', pointerId: 2 });
    pointer(document, 'pointermove', { pointerType: 'pen', pointerId: 2, clientX: 59 });
    pointer(document, 'pointerup', { pointerType: 'pen', pointerId: 2 });
    expect(player._video.currentTime).toBe(25);
  });

  it('previews the position during the drag, before it is committed', () => {
    const player = makePlayer();
    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    pointer(document, 'pointermove', { pointerType: 'touch', clientX: 169 });

    // Moved but not seeked: the video only jumps when the drag ends.
    expect(player._progressWrapValue.style.transform).toBe('scaleX(0.8)');
    expect(player._video.currentTime).toBe(0);

    pointer(document, 'pointerup', { pointerType: 'touch' });
    expect(player._video.currentTime).toBe(80);
  });

  it('prevents the default so the browser does not synthesise a second mouse drag', () => {
    const player = makePlayer();
    const event = pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    expect(event.defaultPrevented).toBe(true);
  });

  it('resumes playback after a touch drag that interrupted it', () => {
    const player = makePlayer({ playing: true });
    const safePlay = vi.spyOn(player, 'safePlay').mockImplementation(() => undefined);

    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    pointer(document, 'pointermove', { pointerType: 'touch', clientX: 109 });
    pointer(document, 'pointerup', { pointerType: 'touch' });

    expect(safePlay).toHaveBeenCalled();
    expect(player._video.currentTime).toBe(50);
  });
});

describe('r-player releases a drag the pointer was taken away from', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('ends the drag on pointercancel instead of staying stuck mid-seek', () => {
    const player = makePlayer();

    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    pointer(document, 'pointermove', { pointerType: 'touch', clientX: 109 });
    expect(player.moveProgress.mouseDown).toBe(true);

    pointer(document, 'pointercancel', { pointerType: 'touch' });

    expect(player.moveProgress.mouseDown).toBe(false);
    expect(player._isSeeking).toBe(false);
  });

  it('does not seek on cancel, because the drag never reached a chosen destination', () => {
    const player = makePlayer();
    const setCurrentTime = vi.spyOn(player, 'setCurrentTime');

    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    pointer(document, 'pointermove', { pointerType: 'touch', clientX: 189 });
    pointer(document, 'pointercancel', { pointerType: 'touch' });

    expect(setCurrentTime).not.toHaveBeenCalled();
    expect(player._video.currentTime).toBe(0);
  });

  it('resumes playback on cancel when the drag had interrupted it', () => {
    const player = makePlayer({ playing: true });
    const safePlay = vi.spyOn(player, 'safePlay').mockImplementation(() => undefined);

    pointer(player._progressDot, 'pointerdown', { pointerType: 'touch' });
    pointer(document, 'pointercancel', { pointerType: 'touch' });

    expect(safePlay).toHaveBeenCalled();
    expect(player.moveProgress.mouseDown).toBe(false);
  });

  it('ignores a cancel that no drag preceded', () => {
    const player = makePlayer();
    const setCurrentTime = vi.spyOn(player, 'setCurrentTime');
    expect(() => pointer(document, 'pointercancel', { pointerType: 'touch' })).not.toThrow();
    expect(setCurrentTime).not.toHaveBeenCalled();
  });
});
