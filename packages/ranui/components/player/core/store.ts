import { signal } from '@/utils/index';

export interface Signal<T> {
  getter: () => T;
  setter: (newValue: T | ((prev: T) => T)) => void;
}

/**
 * Signals for the handful of visual concerns that were previously written from
 * multiple call sites each (play/pause button class, progress/time/buffered
 * display, volume icon+slider). One write site (the media/interaction
 * handlers) + one read site (`core/effects.ts`) replaces the scattered
 * `style.setProperty`/`.innerText` calls that used to live in every handler.
 */
export interface PlayerVisualSignals {
  isPlaying: Signal<boolean>;
  currentTime: Signal<number>;
  duration: Signal<number>;
  bufferedPercentage: Signal<number>;
  volume: Signal<number>;
}

export function createPlayerVisualSignals(): PlayerVisualSignals {
  const mk = <T>(initial: T): Signal<T> => {
    const [getter, setter] = signal<T>(initial);
    return { getter, setter };
  };
  return {
    isPlaying: mk(false),
    currentTime: mk(0),
    duration: mk(0),
    bufferedPercentage: mk(0),
    volume: mk(0.5),
  };
}
