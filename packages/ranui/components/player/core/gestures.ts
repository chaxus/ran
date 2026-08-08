/**
 * Mobile gestures — double-tap left/right half to seek ∓10s, vertical swipe
 * on the right half for volume (`docs/PLAYER_ROADMAP.md` Phase 3). Pointer
 * Events idiom (`pointerdown`/`pointermove`/`pointerup` + `setPointerCapture`),
 * mirroring `r-mermaid`'s fullscreen pan/zoom (`components/mermaid/index.ts`).
 *
 * Scoped to `pointerType === 'touch'` only — mouse/pen interaction is
 * untouched, still handled by the existing container `click` listener
 * (`core/controller.ts`'s `onContainerClick`). For touch, this module takes
 * over tap interpretation entirely (`e.preventDefault()` on `pointerdown`
 * suppresses the browser's compatibility `click` per the Pointer Events spec),
 * so a single tap is re-implemented here via `deps.onSingleTap` — debounced by
 * `DOUBLE_TAP_WINDOW_MS` so a double-tap-to-seek never lets the in-between
 * single-tap toggle play/pause and visibly flicker the video.
 */
const DOUBLE_TAP_WINDOW_MS = 300;
const DOUBLE_TAP_MAX_DISTANCE_PX = 60;
const SWIPE_START_THRESHOLD_PX = 10;
const SEEK_SECONDS = 10;
const FLASH_VISIBLE_MS = 500;

export type GestureSeekDirection = 'forward' | 'backward';

export interface PlayerGestureRefs {
  container: HTMLElement;
  gestureFlash: HTMLElement;
}

export interface PlayerGestureDeps {
  refs: PlayerGestureRefs;
  getCurrentTime: () => number;
  getTotalTime: () => number;
  setCurrentTime: (n: number) => number;
  getVolume: () => number;
  setVolume: (n: number) => number;
  change: (name: string, value: unknown) => void;
  /** Reuses `dispatchClickPlayerContainerAction` — same play/pause toggle a mouse click gets. */
  onSingleTap: (e: Event) => void;
}

export interface PlayerGestureController {
  destroy: () => void;
}

export function attachGestureHandlers(
  deps: PlayerGestureDeps,
  now: () => number = () => Date.now(),
): PlayerGestureController {
  const { refs } = deps;
  const abortController = new AbortController();
  const { signal } = abortController;

  let activePointerId: number | undefined;
  let startX = 0;
  let startY = 0;
  let startVolume = 0;
  let isSwiping = false;
  let pendingSingleTapTimer: ReturnType<typeof setTimeout> | undefined;
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  let lastTapAt = 0;
  let lastTapX = 0;

  const isRightHalf = (clientX: number): boolean => {
    const rect = refs.container.getBoundingClientRect();
    return clientX - rect.left > rect.width / 2;
  };

  const clearPendingSingleTap = (): void => {
    if (pendingSingleTapTimer === undefined) return;
    clearTimeout(pendingSingleTapTimer);
    pendingSingleTapTimer = undefined;
  };

  const showSeekFlash = (direction: GestureSeekDirection): void => {
    refs.gestureFlash.textContent = direction === 'forward' ? `+${SEEK_SECONDS}s` : `-${SEEK_SECONDS}s`;
    refs.gestureFlash.classList.toggle('ran-player-gesture-flash-right', direction === 'forward');
    refs.gestureFlash.classList.toggle('ran-player-gesture-flash-left', direction === 'backward');
    refs.gestureFlash.classList.add('ran-player-gesture-flash-visible');
    if (flashTimer !== undefined) clearTimeout(flashTimer);
    flashTimer = setTimeout(() => {
      refs.gestureFlash.classList.remove('ran-player-gesture-flash-visible');
      flashTimer = undefined;
    }, FLASH_VISIBLE_MS);
  };

  const seek = (direction: GestureSeekDirection): void => {
    const current = deps.getCurrentTime();
    const total = deps.getTotalTime();
    const next =
      direction === 'forward' ? Math.min(total, current + SEEK_SECONDS) : Math.max(0, current - SEEK_SECONDS);
    deps.setCurrentTime(next);
    deps.change('gestureseek', { direction, seconds: SEEK_SECONDS });
    showSeekFlash(direction);
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType !== 'touch') return;
    e.preventDefault();
    activePointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startVolume = deps.getVolume();
    isSwiping = false;
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!isSwiping) {
      // Volume swipe only starts on the right half — mirrors the seek split,
      // and leaves the left half free for a future brightness-style gesture.
      if (!isRightHalf(startX)) return;
      if (Math.abs(dy) < SWIPE_START_THRESHOLD_PX || Math.abs(dy) < Math.abs(dx)) return;
      isSwiping = true;
      clearPendingSingleTap();
      refs.container.setPointerCapture?.(e.pointerId);
    }
    const rect = refs.container.getBoundingClientRect();
    const nextVolume = Math.min(100, Math.max(0, startVolume - (dy / rect.height) * 100));
    deps.setVolume(nextVolume);
    deps.change('volume', nextVolume);
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== activePointerId) return;
    activePointerId = undefined;
    if (isSwiping) {
      isSwiping = false;
      return;
    }
    const tapAt = now();
    const tapX = e.clientX;
    const isDoubleTap =
      tapAt - lastTapAt < DOUBLE_TAP_WINDOW_MS && Math.abs(tapX - lastTapX) < DOUBLE_TAP_MAX_DISTANCE_PX;
    if (isDoubleTap) {
      clearPendingSingleTap();
      lastTapAt = 0;
      seek(isRightHalf(tapX) ? 'forward' : 'backward');
      return;
    }
    lastTapAt = tapAt;
    lastTapX = tapX;
    clearPendingSingleTap();
    pendingSingleTapTimer = setTimeout(() => {
      pendingSingleTapTimer = undefined;
      deps.onSingleTap(e);
    }, DOUBLE_TAP_WINDOW_MS);
  };

  refs.container.addEventListener('pointerdown', onPointerDown, { signal, passive: false });
  refs.container.addEventListener('pointermove', onPointerMove, { signal });
  refs.container.addEventListener('pointerup', onPointerUp, { signal });
  refs.container.addEventListener('pointercancel', onPointerUp, { signal });

  return {
    destroy: (): void => {
      clearPendingSingleTap();
      if (flashTimer !== undefined) clearTimeout(flashTimer);
      abortController.abort();
    },
  };
}
