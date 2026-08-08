import { createStore } from 'ranuts/utils';

/** Src URL is the key directly — no hashing needed at this scale. */
const resumeStore = createStore<number>('ran-player-resume:');

export function loadResumePosition(src: string): number {
  if (!src) return 0;
  return resumeStore.get(src, 0);
}

export function saveResumePosition(src: string, currentTime: number): void {
  if (!src) return;
  resumeStore.set(src, currentTime);
}

export function clearResumePosition(src: string): void {
  if (!src) return;
  resumeStore.remove(src);
}

/** Don't resume a video that's already essentially over — it should restart fresh. */
export function shouldResumeAt(currentTime: number, duration: number): boolean {
  return currentTime > 0 && Number.isFinite(duration) && duration > 0 && currentTime < duration - 2;
}

export function maybeSaveResumePosition(input: { rememberPosition: boolean; src: string; currentTime: number }): void {
  if (!input.rememberPosition) return;
  saveResumePosition(input.src, input.currentTime);
}

export function maybeClearResumePosition(input: { rememberPosition: boolean; src: string }): void {
  if (!input.rememberPosition) return;
  clearResumePosition(input.src);
}

/**
 * Position to resume at, or `undefined` if resuming isn't applicable right now
 * (feature off, mid quality-switch reload, or too close to the end — see `shouldResumeAt`).
 */
export function resolveResumeTarget(input: {
  rememberPosition: boolean;
  isSwitchingSource: boolean;
  src: string;
  totalTime: number;
}): number | undefined {
  if (!input.rememberPosition || input.isSwitchingSource) return undefined;
  const resumeAt = loadResumePosition(input.src);
  return shouldResumeAt(resumeAt, input.totalTime) ? resumeAt : undefined;
}
