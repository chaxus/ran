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
