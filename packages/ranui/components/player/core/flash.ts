/**
 * Transient, self-dismissing message on `.ran-player-gesture-flash` — the
 * show/hide-with-timer logic `core/gestures.ts`'s double-tap seek indicator
 * already needed, extracted so a second caller (the remote-playback-failure
 * notice in `core/chrome.ts`) doesn't hand-roll its own copy of the same
 * three lines. Position is caller-supplied via `className` (one of the
 * `ran-player-gesture-flash-{left,right,center}` modifiers in `index.less`)
 * since different callers anchor the message differently — seek flashes sit
 * over the half of the video that was tapped, a general notice sits centered.
 */
export interface FlashController {
  show: (text: string, className?: string) => void;
  destroy: () => void;
}

const POSITION_CLASSES = [
  'ran-player-gesture-flash-left',
  'ran-player-gesture-flash-right',
  'ran-player-gesture-flash-center',
];

export function createFlashController(el: HTMLElement, visibleMs: number): FlashController {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    show: (text, className): void => {
      el.textContent = text;
      el.classList.remove(...POSITION_CLASSES);
      if (className) el.classList.add(className);
      el.classList.add('ran-player-gesture-flash-visible');
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => {
        el.classList.remove('ran-player-gesture-flash-visible');
        timer = undefined;
      }, visibleMs);
    },
    destroy: (): void => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    },
  };
}
